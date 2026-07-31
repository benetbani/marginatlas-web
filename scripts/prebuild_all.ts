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
  { name: "no-hardcoded-hex", script: "scripts/verify_hardcoded_hex.ts" },
  { name: "dead-links", script: "scripts/audit/find_dead_links.ts", args: ["--strict"] },
  { name: "featured-tiles", script: "scripts/verify_featured_tiles.ts" },
  { name: "render-guards", script: "scripts/verify_render_guards.ts" },
  { name: "deepening", script: "scripts/verify_deepening.ts" },
  { name: "monetization-coverage", script: "scripts/verify_monetization_coverage.ts" },
  { name: "v34-research-rules", script: "scripts/verify_v34_research_rules.ts" },
  { name: "no-internal-notes", script: "scripts/verify_no_internal_notes.ts" },
  { name: "top-industries-plausibility", script: "tests/cells/top_industries_plausibility.test.ts" },
  { name: "all-sizes-blend", script: "tests/cells/extrapolated_all_sizes_blend.test.ts" },
  { name: "geo-region-name", script: "tests/cells/geo_region_name.test.ts" },
  { name: "useless-tiles", script: "scripts/audit/find_useless_tiles.ts" },
  { name: "typography", script: "scripts/verify_typography_consistency.ts" },
  { name: "signature-quality", script: "scripts/verify_signature_quality.ts" },
  { name: "cost-share-invariant", script: "scripts/verify_cost_share_invariant.ts" },
  { name: "key-benchmark", script: "scripts/verify_key_benchmark_assignment.ts" },
  { name: "comparative-voice", script: "scripts/verify_comparative_voice.ts" },
  { name: "turnover-bands", script: "scripts/verify_turnover_bands.ts" },
  { name: "wage-source", script: "scripts/verify_wage_source_consistency.ts" },
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
