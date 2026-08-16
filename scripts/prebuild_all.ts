/**
 * scripts/prebuild_all.ts
 *
 * Architecture-audit strategy E (2026-05-27).
 *
 * Parallel runner for the prebuild quality-gate chain. Replaces the
 * 25-script `&&`-chained `prebuild` script in package.json with a
 * single process that spawns the gates in parallel via Node's
 * `child_process.spawn`, then aggregates exit codes.
 *
 * Why: serial wall-clock was ~60s (sum of all gates). Each gate is
 * a self-contained subprocess reading its own files; nothing depends
 * on another gate's output. Parallel wall-clock approaches the MAX
 * gate time (typically the slowest 3-4 gates) instead of the SUM.
 * Expected drop: ~60s → ~15s for warm cache.
 *
 * Concurrency cap: `--concurrency=<n>` (default 6). Avoids spawning
 * 25 simultaneous tsx processes on a small developer machine.
 *
 * Honors --bail (default true): on first failure, kill the rest and
 * exit non-zero immediately so CI doesn't waste cycles. Pass
 * --no-bail to run all gates and aggregate the full failure list.
 *
 * Run: npx tsx scripts/prebuild_all.ts
 */
import { spawn } from "node:child_process";
import path from "node:path";

type Gate = {
  /** Display name (shown in the log). */
  name: string;
  /** tsx-runnable path (relative to repo root). */
  script: string;
  /** Optional CLI args appended after the script path. */
  args?: string[];
};

/**
 * The full gate chain. Order is informational only — gates run in
 * parallel. Keep this list in sync with package.json `prebuild`.
 */
const GATES: Gate[] = [
  { name: "taxonomy", script: "scripts/verify_taxonomy.ts" },
  { name: "no-em-dashes", script: "scripts/verify_no_em_dashes.ts" },
  { name: "no-source-agencies", script: "scripts/verify_no_source_agencies.ts" },
  /* The spine2 invariants (PORT-CONTRACT M1-M9). Both are fast and browser-free.
     The rendered-design linter is deliberately NOT here: it drives a real
     browser, so it runs as `npm run verify:rendered` before a ship, not on
     every build. Registered 2026-07-26 after each was negative-tested. */
  { name: "cell-lattice", script: "scripts/verify_cell_lattice.mjs" },
  { name: "derived-accents", script: "scripts/verify_derived_accents.mjs" },
  /* FRESHNESS of the two artifacts generated out of design/mockups/. Both are
     valid files when stale, so nothing else can notice: a stale stylesheet
     still compiles and a stale glyph module still typechecks. This actually
     happened on 2026-07-26 , six edits to the mockup stylesheet sat
     unpropagated for eleven hours while the React kit rendered the old design.
     Both checks were negative-tested against a real induced drift. */
  { name: "spine-css-fresh", script: "scripts/scope_atlas_css.mjs", args: ["--check"] },
  { name: "glyphs-fresh", script: "scripts/sync_glyphs.mjs", args: ["--check"] },
  /* The reconciliation check on the ONLY hand-filled data file the product has.
     It existed and was runnable but was never registered, so the arithmetic
     behind every headline figure was verified only when somebody remembered to
     run it by hand. Registered 2026-07-27. */
  { name: "cell-data", script: "scripts/verify_cell_data.mjs" },
  /* The founder's banned vocabulary, on the REACT source. It was enforced only
     against the three mockup HTML files by verify_lattice.mjs, so "turnover"
     reached the reader from spine2_adapter.ts with 43 gates green. Scoped to the
     spine-2 surface; negative-tested 2026-07-27. */
  { name: "banned-vocabulary", script: "scripts/verify_banned_vocabulary.ts" },
  /* Placeholder data lifted from the design mockups must never reach a reader.
     It has the same shape and the same tier fields as real data, so a fixture
     served publicly would look exactly like a page that cites its own
     provenance while every number in it was invented. Negative-tested. */
  { name: "no-fixture-in-routes", script: "scripts/verify_no_fixture_in_routes.ts" },
  /* The other half of the dead-link check. find_dead_links strips the fragment
     before validating, so six footer anchors pointed at sections that do not
     exist, on every page, under a green gate. Negative-tested. */
  { name: "dead-anchors", script: "scripts/verify_dead_anchors.ts" },
  /* The public CSV export is unauthenticated, so its column list is a
     publishing decision. It may emit only allowlisted columns, and never a raw
     provenance string: `coverage_source` falls back to a database value nobody
     here has vetted for source-agency names, which the copy gate cannot see
     because it reads components, not route handlers. Negative-tested against
     both an unlisted column and a forbidden field. Registered 2026-07-31. */
  { name: "export-columns", script: "scripts/verify_export_columns.ts" },
  /* The POPs vocabulary cap. A composition mix only makes places comparable if
     every place describes itself in the same closed set of words, and the way
     that breaks is silent: a second city reaches for a better word, nothing
     errors, and the layer stops meaning anything. Also holds the mix to 100.
     Negative-tested against an off-vocabulary key, a mix summing to 88, and a
     second accent. Registered 2026-07-31. */
  { name: "population-mix", script: "scripts/verify_population_mix.ts" },
  /* District wealth ships as one of five bands and never as an index number,
     ratified 2026-07-31 on the evidence that ~84% of income variance sits
     inside a small area and that interpolated district income is wrong by
     >10% in ~44% of cases. A number sorts and colours a map, so the pressure
     to add one back is real; this makes it argue with a failing build.
     Negative-tested against a smuggled index, an invented band and an
     uncovered district. Registered 2026-07-31. */
  { name: "district-wealth", script: "scripts/verify_district_wealth.ts" },
  /* The district population mix: capped vocabulary, at most five types, ordered
     largest first (the renderer and the favoured-trades derivation both assume
     it and neither fails visibly if it is wrong), scarce never overlapping top,
     and every district covered. Negative-tested against five induced defects.
     Registered 2026-07-31. */
  { name: "district-mix", script: "scripts/verify_district_mix.ts" },
  /* Business subtypes: at most ten per trade, all five facts stated as a figure
     or an honest null, and repeat frequency banded rather than counted, because
     a visit count is a claim about a specific business we have never observed.
     Also catches a count smuggled in under another field name. Negative-tested
     against seven induced defects. Registered 2026-07-31. */
  { name: "subtypes", script: "scripts/verify_subtypes.ts" },
  /* District coordinates. Every other kind of bad data here announces itself; a
     wrong coordinate does not. The page renders, the map draws a marker, and it
     sits in the North Sea. Checks relative position rather than absolute, since
     districts of one city are near each other by construction, which catches a
     flipped longitude sign without needing to know where any city is.
     Negative-tested against a 2747km displacement, a duplicate point, 0,0 and a
     missing centre. Registered 2026-08-01. */
  { name: "district-geometry", script: "scripts/verify_district_geometry.ts" },
  { name: "no-hardcoded-hex", script: "scripts/verify_hardcoded_hex.ts" },
  /* WCAG AA on every token that carries text. The colour tokens are edited by
     eye in the founder's design file, where a shade nudged lighter still
     compiles and still typechecks. Measured clean before it was written, 247 of
     251 declarations AA or better, so it is a hard gate rather than a ratchet.
     Negative-tested 2026-08-08 by lightening --muted, which it caught across
     all 81 of its declarations. */
  { name: "token-contrast", script: "scripts/verify_token_contrast.mjs" },
  { name: "dead-links", script: "scripts/audit/find_dead_links.ts", args: ["--strict"] },
  /* featured-tiles REMOVED FROM THE CHAIN 2026-08-09. It guarded a grid that
     no longer exists.

     The featured-tiles grid was deleted from the home page (src/lib/home/beats.ts
     still says "where the old featured-tiles grid was"), and the gate behind it
     was left registered. It reads data/snapshots/featured-tiles.json, dated
     22 May, and fails the Vercel build if any tile has a null revenue. So a
     stale snapshot for a deleted feature could stop a deploy, and the failure
     message told whoever hit it to fix "the FEATURED tuples in src/app/page.tsx",
     which have not existed for months.

     Deleted rather than left unregistered, per this repo's own corollary: a
     check nothing runs is not coverage, wire it or delete it. If the grid comes
     back, so does the gate, out of git. */
  { name: "render-guards", script: "scripts/verify_render_guards.ts" },
  { name: "deepening", script: "scripts/verify_deepening.ts" },
  { name: "monetization-coverage", script: "scripts/verify_monetization_coverage.ts" },
  { name: "v34-research-rules", script: "scripts/verify_v34_research_rules.ts" },
  { name: "no-internal-notes", script: "scripts/verify_no_internal_notes.ts" },
  { name: "no-slot-counting", script: "scripts/verify_no_slot_counting.ts" },
  { name: "page-has-h1", script: "scripts/verify_page_has_h1.ts" },
  { name: "no-dev-links", script: "scripts/verify_no_dev_links.ts" },
  { name: "api-endpoints-exist", script: "scripts/verify_api_endpoints_exist.ts" },
  { name: "industry-refs", script: "scripts/verify_industry_refs.ts" },
  { name: "no-hardcoded-place", script: "scripts/verify_no_hardcoded_place.ts" },
  { name: "no-district-as-trade", script: "scripts/verify_no_district_as_trade.ts" },
  { name: "retired-claims", script: "scripts/verify_retired_claims.ts" },
  { name: "no-stock-imagery", script: "scripts/verify_no_stock_imagery.ts" },
  { name: "top-industries-plausibility", script: "tests/cells/top_industries_plausibility.test.ts" },
  { name: "all-sizes-blend", script: "tests/cells/extrapolated_all_sizes_blend.test.ts" },
  { name: "geo-region-name", script: "tests/cells/geo_region_name.test.ts" },
  /* ELEVEN TEST FILES THAT PASSED AND NEVER RAN, wired 2026-08-09.
     tests/ held 16 files. Four were in this list. The other twelve were written,
     committed, and executed by nothing: no test runner is installed and the
     idiom here is a bare tsx script that exits 1, so a file not named in this
     array is inert. They read as coverage from the outside and were not.
     Eleven of the twelve were run and pass; they are registered below, so from
     now on they defend what they were written to defend.
     The twelfth, tests/scores/recommend_demand.test.ts, is deliberately NOT
     here. It transitively imports src/lib/supabase.ts, which throws at module
     load without credentials, so it would make the prebuild chain depend on a
     secret. That is the one thing this chain must never do. Run it by hand:
       npx tsx tests/scores/recommend_demand.test.ts
     Rule that follows: a test file nothing runs is not coverage. Wire it or
     delete it, and check this list when you add one. */
  { name: "industry-resolution", script: "tests/cells/industry_resolution.test.ts" },
  { name: "search-cascade", script: "tests/home/search_cascade.test.ts" },
  { name: "research-drop-schema", script: "tests/ingest/research_drop_schema.test.ts" },
  { name: "facts-store", script: "tests/facts/store.test.ts" },
  { name: "facts-shard", script: "tests/facts/shard.test.ts" },
  { name: "facts-confidence", script: "tests/facts/confidence.test.ts" },
  /* Two live routes were invisible to crawlers: a client island read
     useSearchParams with no Suspense boundary, which opts the WHOLE route into
     client rendering while still reporting as prerendered. Negative-tested. */
  { name: "search-params-suspense", script: "scripts/verify_search_params_suspense.mjs" },
  /* /browse was declared in the sitemap at priority 0.8 while being a
     permanentRedirect to /world whose own canonical named /world. A sitemap is
     a list of pages you want indexed. Negative-tested. */
  { name: "sitemap-no-redirects", script: "scripts/verify_sitemap_no_redirects.mjs" },
  /* /world and /industries were promoted out of SiteChrome, which is where
     <main> lives, and nothing replaced the landmark. Invisible in a browser;
     a screen reader had no content region to jump to. Negative-tested. */
  { name: "main-landmark", script: "scripts/verify_main_landmark.mjs" },
  { name: "break-in-for-cell", script: "tests/scores/break_in_for_cell.test.ts" },
  { name: "composite", script: "tests/scores/composite.test.ts" },
  { name: "country-board", script: "tests/scores/country_board.test.ts" },
  { name: "margin-index", script: "tests/scores/margin_index.test.ts" },
  { name: "recommend-core", script: "tests/scores/recommend_core.test.ts" },
  /* recommender-flag removed 2026-08-09 with the flag it tested. It asserted
     that NEXT_PUBLIC_RECOMMENDER parses to false when unset, which tests the
     parser, not a gate: nothing ever consumed that flag. Wiring the orphan
     tests into this chain an hour earlier is what surfaced it , the build broke
     the moment the dead flag went, which is a test earning its keep by dying
     with its subject. */
  { name: "scores", script: "tests/scores/scores.test.ts" },
  { name: "wave2-flags", script: "tests/scores/wave2_flags.test.ts" },
  /* Three checks added 2026-08-09 under "sharpen the axe", each pinning a class
     of failure that had already happened once and that nothing could see. */
  { name: "robots", script: "tests/app/robots.test.ts" },
  { name: "route-chrome-contract", script: "tests/app/route_chrome_contract.test.ts" },
  { name: "no-silent-db-errors", script: "scripts/verify_no_silent_db_errors.mjs" },
  { name: "dev-routes-sealed", script: "scripts/verify_dev_routes_sealed.mjs" },
  { name: "palette-membership", script: "scripts/verify_palette_membership.mjs" },
  /* These two travel together. The list bounds the country wildcard so
     middleware can 404 a made-up first segment; the test proves the rule
     catches nothing the site publishes. If the list rots, middleware 404s a
     real page, so the gate fails in BOTH directions. */
  { name: "top-level-segments", script: "scripts/verify_top_level_segments.mjs" },
  { name: "junk-url-rule", script: "tests/routing/junk_url_rule.test.ts" },
  { name: "useless-tiles", script: "scripts/audit/find_useless_tiles.ts" },
  { name: "typography", script: "scripts/verify_typography_consistency.ts" },
  { name: "signature-quality", script: "scripts/verify_signature_quality.ts" },
  { name: "cost-share-invariant", script: "scripts/verify_cost_share_invariant.ts" },
  { name: "key-benchmark", script: "scripts/verify_key_benchmark_assignment.ts" },
  { name: "comparative-voice", script: "scripts/verify_comparative_voice.ts" },
  { name: "turnover-bands", script: "scripts/verify_turnover_bands.ts" },
  { name: "wage-source", script: "scripts/verify_wage_source_consistency.ts" },
  /* The check that would have caught a three-month outage. The service-role key
     was rotated and Vercel kept the old value; every supabaseAdmin read failed,
     every page fell back to synthesised figures, and nothing said a word.
     A REJECTED key fails the build; an unreachable host does not, because
     trading a silent quarter-long outage for a deploy blocked by a network blip
     is the wrong way round. No key set at all is a skip, so a bare local
     prebuild is unaffected. Negative-tested on 2026-08-08 against a wrong key
     and a garbage key, both exit 1. */
  { name: "db-credential", script: "scripts/verify_db_credential.mjs" },
  /* The gate fx.ts has promised in a comment since it was written. Checks the
     DISPLAY rates in src/lib/currency.ts only; fx.ts is pinned at parse time on
     purpose and must not be refreshed. Warns at 92 days, fails at 183.
     Negative-tested at all three bands on 2026-08-08. */
  { name: "fx-freshness", script: "scripts/verify_fx_freshness.mjs" },
  { name: "city-wages", script: "scripts/verify_city_wage_premiums.ts" },
  { name: "industry-medians", script: "scripts/verify_industry_medians.ts" },
  { name: "econ-profile-integrity", script: "scripts/verify_economic_profile_integrity.ts" },
  { name: "au-industry-map", script: "scripts/verify_au_industry_map.ts" },
  { name: "au-anchor-render", script: "scripts/verify_au_primary_anchor_render.ts" },
  { name: "layering", script: "scripts/verify_layering.ts" },
  { name: "section-order", script: "scripts/verify_section_order.ts" },
  { name: "cross-geography-guard", script: "scripts/verify_cross_geography_guard.ts" },
  { name: "page-sections", script: "scripts/verify_page_sections.ts" },
  { name: "bar-budget", script: "scripts/verify_bar_budget.ts" },
  { name: "no-bold-display", script: "scripts/verify_no_bold_display.ts" },
  { name: "banned-patterns", script: "scripts/verify_banned_patterns.ts" },
  { name: "registry", script: "scripts/verify_registry.ts" },
  { name: "no-eyebrow", script: "scripts/verify_no_eyebrow.ts" },
  { name: "subsection-icons", script: "scripts/verify_subsection_icons.ts" },
  { name: "trade-set", script: "scripts/verify_trade_set.ts" },
  { name: "sample-tags", script: "scripts/verify_sample_tags.ts" },
  { name: "no-parent-repo-reads", script: "scripts/verify_no_parent_repo_reads.ts" },
  { name: "two-surface-levels", script: "scripts/verify_two_surface_levels.ts" },
  /* A route with no metadata export has no title of its own. 101 page.tsx
     routes exist and 73 declare metadata, a gap nothing had ever measured, so
     it grew back after every cleanup. 24 of the 28 misses are dev, admin and
     _design workbenches, which SHOULD be untitled; four are shipping pages,
     and one of them is the home page. Those four are carried on a dated
     allowlist so the chain stays green while they are repaired, and a route
     outside it fails the build. Negative-tested against a new untitled route
     (caught), the same route under /dev (exempt), and a route declaring
     robots index false (exempt). Registered 2026-08-04. */
  { name: "page-metadata", script: "scripts/verify_page_metadata.ts" },
  /* The other half of the same defect, and the worse half. Next merges metadata
     down the tree per top-level KEY by replacement, so a route that declares a
     title but never mentions `alternates` inherits the root layout's
     `canonical: "/"` and emits a tag saying it IS the home page. Measured on
     rendered output from the dev server, not inferred: /cities/london and
     /pricing both served their own title beside a canonical of
     https://www.marginatlas.com. 29 of 49 shipping routes did this, including
     every dynamic route that generates the long tail (cities/[slug],
     [country]/[geo], compare/cities/[pair], decide/[activity]/[city],
     blog/[slug], learn/[slug], coverage/[iso2]). All 29 were repaired in the
     same change, so the allowlist ships EMPTY and a new route without
     `alternates` simply fails. Negative-tested against a new route declaring a
     title and no alternates (caught), the same route under /dev (exempt), and a
     route hard-coding canonical "/" (caught by the second check).
     Registered 2026-08-06. */
  { name: "canonical-urls", script: "scripts/verify_canonical_urls.ts" },
  /* A count stated beside the array it counts. city_list_v1.json said
     totals.total 200 and a continent_split summing to 200 while its cities
     array held 252, using region codes (NA, EU, MENA) that appear nowhere in
     the data. Both were dormant, which is the only reason a wrong number was
     never published. Deleted rather than recomputed: a recomputed total goes
     stale the next time the array grows, and array.length cannot. Deliberately
     NARROW, and that narrowness is the design: the obvious version compared
     every totals-shaped object to every array and produced sixteen hits of
     which fifteen were false, because every data/quality report states a
     POPULATION beside a SAMPLE. A gate that cries wolf fifteen times in sixteen
     gets switched off. Registered 2026-08-04. */
  { name: "stated-totals", script: "scripts/verify_stated_totals.mjs" },
  /* A RATCHET, not a pass. 43 paragraphs on the v2 surface run past the ratified
     20-word budget today; it fails only when that set GROWS. A hard fail would
     red every page at once, and this codebase already knows what happens then. */
  { name: "paragraph-budget", script: "scripts/verify_paragraph_budget.mjs" },
  /* The icon and radius scales, on the CURRENT v2 surface only. Both were
     decided in DESIGN.md and enforced nowhere, so both would drift back.
     Scope is narrow for the same reason as above: spine/, spine2-*,
     brand-glyphs and spine-kit are previous-generation workbenches carrying
     32px, 26px, 20px and 15px glyphs that were right for their generation.
     The icon scale is FIVE, not the two DESIGN.md claimed: 18 for a section
     head (33 uses), 13 inline (16), 24 on chapter and card tiles (3), 14 for
     the pricing matrix tick in a 74px column (2), 16 for the footer social
     icon per BRAND.md (1). A gate asserting two would have failed six correct
     uses. Registered 2026-08-04. */
  { name: "v2-scales", script: "scripts/verify_v2_scales.ts" },
  { name: "spacing-scale", script: "scripts/verify_spacing_scale.ts" },
  /* One number cannot be the answer for seven cities. Two thirds of the rows
     behind place pages carry no revenue of their own, and the read path filled
     the headline from a shared per-industry anchor while leaving the row's
     provenance label untouched, so a constant was published as an observation in
     a named place: 7281 colliding (country, industry) combinations behind 76,948
     live pages. Registered 2026-08-01 as a RATCHET while the repair was still a
     founder decision; REPAIRED and flipped to --strict the same day. The repair
     kept every figure and dropped the label: fillMissingFields marks the cell
     whose headline it supplied, and deriveCoverageTier will not call such a cell
     measured. 951 real cells resolved through getCellBySlug before and after,
     21,873 fields compared, zero changed. The gate reads the tier off its own
     output, so it reached zero on its own rather than being adjusted to. */
  { name: "shared-revenue", script: "scripts/verify_shared_revenue_across_countries.ts", args: ["--strict"] },
  /* A URL assembled from parts is not a URL that resolves. Seven live link
     defects were found and repaired in four iterations on 2026-08-01 and every
     one was the same move, and every one passed the dead-link gate, which
     matches only quoted literals and checks route shape rather than whether a
     segment names the place the link claims. The two routes that refuse a
     segment outside a closed list are the country page and the region page, and
     resolveGeoPage and countryPagePath in src/lib/cells/related_links.ts are the
     sanctioned way to ask. This gate fails when someone writes the construction
     without them, and separately pins the slugs that name a city on one route
     and a region on another, which is how "All of New York" opened the state.
     Registered 2026-08-01 as a RATCHET on the construction set and the collision
     set, because live constructions remain and this iteration built the
     instrument rather than repairing them. Negative-tested twice with different
     defect shapes: a new two-segment construction in a component, and a new
     colliding city slug. Flip to args ["--strict"] once the repairs land. */
  { name: "geo-link-construction (KNOWN DEFECT)", script: "scripts/verify_geo_link_construction.ts" },
];

/** CLI arg parsing. */
const argv = process.argv.slice(2);
const concurrencyArg = argv.find((a) => a.startsWith("--concurrency="));
// Default concurrency 4 (was 6). 6 hit Windows resource limits with
// some gates intermittently segfaulting (exit 134 / Windows 0xC0000005)
// when the system was already loaded. 4 keeps wall-clock close to
// optimal (~30s for 25 gates) without that failure mode.
const CONCURRENCY = concurrencyArg ? Math.max(1, parseInt(concurrencyArg.split("=")[1], 10)) : 4;
const BAIL = !argv.includes("--no-bail");
const QUIET = argv.includes("--quiet");

type GateResult = {
  name: string;
  exitCode: number;
  durationMs: number;
  stdoutTail: string;
  stderrTail: string;
};

function runGate(gate: Gate): Promise<GateResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const args = ["tsx", gate.script, ...(gate.args ?? [])];
    // shell: true is required on Windows to spawn `npx` (which
    // resolves to `npx.cmd`); Node 22+ refuses to spawn .cmd files
    // directly with EINVAL. The DEP0190 deprecation warning this
    // triggers is acceptable here because every arg is a hardcoded
    // literal from the GATES array — no caller-controlled input.
    const child = spawn("npx", args, {
      shell: process.platform === "win32",
      env: process.env,
    });
    const stdoutBuf: string[] = [];
    const stderrBuf: string[] = [];
    child.stdout.on("data", (b: Buffer) => stdoutBuf.push(b.toString()));
    child.stderr.on("data", (b: Buffer) => stderrBuf.push(b.toString()));
    child.on("close", (code) => {
      resolve({
        name: gate.name,
        exitCode: code ?? 1,
        durationMs: Date.now() - started,
        stdoutTail: stdoutBuf.join("").split("\n").slice(-20).join("\n"),
        stderrTail: stderrBuf.join("").split("\n").slice(-20).join("\n"),
      });
    });
    child.on("error", (err) => {
      resolve({
        name: gate.name,
        exitCode: 1,
        durationMs: Date.now() - started,
        stdoutTail: "",
        stderrTail: `spawn error: ${err.message}`,
      });
    });
  });
}

/** Worker-pool runner: caps concurrency, optionally bails on failure. */
async function runAll(gates: Gate[]): Promise<GateResult[]> {
  const results: GateResult[] = [];
  let nextIdx = 0;
  let bailed = false;
  const inFlight = new Set<Promise<void>>();
  const workers: Promise<void>[] = [];

  function maybeStart(): Promise<void> | null {
    if (bailed) return null;
    if (nextIdx >= gates.length) return null;
    const gate = gates[nextIdx++];
    const p = runGate(gate).then((r) => {
      results.push(r);
      if (!QUIET) {
        const sym = r.exitCode === 0 ? "✓" : "✗";
        const secs = (r.durationMs / 1000).toFixed(1);
        console.log(`  ${sym} ${gate.name.padEnd(28)} ${secs}s`);
      }
      if (r.exitCode !== 0 && BAIL) bailed = true;
    });
    inFlight.add(p);
    p.finally(() => inFlight.delete(p));
    return p;
  }

  // Prime the pool.
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = maybeStart();
    if (p) workers.push(p);
  }
  // Keep replenishing until done.
  while (inFlight.size > 0) {
    await Promise.race(inFlight);
    const p = maybeStart();
    if (p) workers.push(p);
  }
  return results;
}

async function main() {
  const started = Date.now();
  console.log(`=== prebuild_all  (${GATES.length} gates, concurrency=${CONCURRENCY}) ===`);
  console.log("");
  const results = await runAll(GATES);
  const wall = ((Date.now() - started) / 1000).toFixed(1);
  const fails = results.filter((r) => r.exitCode !== 0);
  console.log("");
  console.log(`=== Summary ===`);
  console.log(`  Ran: ${results.length} / ${GATES.length} gates`);
  console.log(`  Wall-clock: ${wall}s`);
  console.log(`  Passed: ${results.length - fails.length}`);
  console.log(`  Failed: ${fails.length}`);

  /* DEFERRED CHECKS, surfaced at the summary.

     verify_cell_lattice runs 11 checks and defers 3, and says so plainly in
     its own output: "CHECKS THAT COULD NOT RUN , 3. These are NOT passes."
     One of them is that a city's keep-share is never compared against its
     country's, because no country file exists to compare against.

     That gate is honest. This runner was not. Gate stdout is captured but only
     printed on FAILURE, so a deferral appeared as one green tick among many,
     and the line everybody actually reads, "Passed: 95, Failed: 0", had no way
     to express "and some checks could not run at all".

     A check that did not run is not a check that passed. The summary says so
     now, and the convention is one a gate opts into by printing "N deferred". */
  const deferred = results
    .map((r) => {
      const m = /(\d+)\s+deferred/.exec(r.stdoutTail);
      return m ? { name: r.name, count: Number(m[1]) } : null;
    })
    .filter((x): x is { name: string; count: number } => x !== null);

  if (deferred.length > 0) {
    const total = deferred.reduce((n, d) => n + d.count, 0);
    console.log(
      `  Deferred: ${total} check(s) could not run (` +
        deferred.map((d) => `${d.name}:${d.count}`).join(", ") +
        `). These are NOT passes; run the gate directly for the conditions.`,
    );
  }

  if (fails.length > 0) {
    console.log("");
    console.log("=== Failures ===");
    for (const f of fails) {
      console.log(`\n--- ${f.name} (exit ${f.exitCode}) ---`);
      if (f.stdoutTail.trim()) console.log(f.stdoutTail);
      if (f.stderrTail.trim()) console.log(f.stderrTail);
    }
    process.exit(1);
  }
  console.log("\n  GATE: PASS");
}

void path; // reserved for future absolute-path resolution if needed
main().catch((err) => {
  console.error("prebuild_all crashed:", err);
  process.exit(1);
});
