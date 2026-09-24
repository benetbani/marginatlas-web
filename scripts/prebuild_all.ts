/**
 * scripts/prebuild_all.ts
 *
 * THE GATE CHAIN. Vercel runs it through npm's prebuild hook before every
 * build; locally it is `npm run prebuild` (parallel, --no-bail) or
 * `npm run verify:deploy` (serial, to a file). One process spawns every gate
 * in the GATES array below as its own `npx tsx` subprocess through a worker
 * pool (`--concurrency=<n>`, default 4: 6 hit Windows resource limits and
 * segfaulted gates on a loaded machine) and aggregates the exit codes.
 * Architecture-audit strategy E (2026-05-27): serial wall-clock was the SUM
 * of the gates, parallel approaches the slowest few.
 *
 * Three things it tells apart, because a chain that reported them as one red
 * cost whole sessions (plan-2026-09-17/02-ERRORS.md, step 13):
 *
 * 1. THE PREFLIGHT. Before any gate starts it reads free memory and refuses
 *    under the floor with exit 2 (the ground exit, never 1, so a refusal is
 *    never read as a red): CHAIN_FLOOR_MB when more than one browser gate can
 *    be open at once, BROWSER_FLOOR_MB when at most one can (concurrency 1,
 *    or a --only subset holding one browser gate), no floor when no browser
 *    gate is selected. The floors are scripts/harness/preflight.mjs's. The
 *    refusal names what to close from a real reading of the process table
 *    (win32: tasklist grouped by image name, the top three). `--floor=<MB>`
 *    overrides for a proof; PREFLIGHT_FORCE=1 runs anyway; under VERCEL or CI
 *    the floor is skipped and the header line says so, because a refused
 *    deploy is worse than a memory death on a machine we do not control.
 *
 * 2. A MEMORY DEATH is not a failure. A non-zero exit with no output at all,
 *    or with a death signature in it (heap limit, ENOMEM, a closed browser
 *    target, browserType.launch, spawn UNKNOWN, exit 134, 0xC0000005,
 *    0xC0000409), is classified `memory`. A browser gate (`browser: true`)
 *    that died this way is retried ONCE after the whole pool has drained, so
 *    the retry runs with nothing else in flight, and the retry's real result
 *    replaces the first. A non-browser gate is not retried but is reported
 *    apart all the same. The per-gate log line says MEMORY the way it says
 *    TIMEOUT.
 *
 * 3. THE SUMMARY carries `Died on memory: N` on its own line, apart from
 *    `Failed: N` (real failures and timeouts only), and a `=== Died on
 *    memory ===` block beside `=== Failures ===` names each gate, the free
 *    memory at the time and the remedy. The exit code is 1 for either.
 *
 * Also: --bail (default on; `prebuild` passes --no-bail) stops on the first
 * real failure; --timeout=<s> (default 120) kills a wedged gate with its
 * tree; --only=<name,name> runs a subset by exact gate name; --quiet mutes
 * the per-gate lines.
 *
 * Run: npx tsx scripts/prebuild_all.ts
 */
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

type Gate = {
  /** Display name (shown in the log). */
  name: string;
  /** tsx-runnable path (relative to repo root). */
  script: string;
  /** Optional CLI args appended after the script path. */
  args?: string[];
  /** The script launches a Playwright browser: it counts against the memory
      floor, and a memory death of it is retried once, alone. Thirteen today: nine
     since plan step 14 retired blueprint-conformance, the three harness
     gates step 14b added, and loud-seats (step 40); scripts/gates.json
     carries the count. */
  browser?: true;
  /** `first`: the gate runs to completion, serially, before the pool starts,
      because other gates read what it writes (plan step 14b: `pages-fresh`
      renders the six spine pages the nine browser gates then open). A red
      among the first-phase gates is reported like any other; under --bail it
      stops the run before the pool, under --no-bail the pool still runs and
      the readers say the age of whatever renders exist. */
  phase?: "first";
};

/**
 * The full gate chain. Gates marked `phase: "first"` run serially, in array
 * order, before the pool; for every other gate the order is informational
 * only, they run in parallel. Keep this list in sync with package.json
 * `prebuild`.
 */
const GATES: Gate[] = [
  /* THE CHAIN SEES THE LIVE PAGES (plan step 14b, 2026-09-17). Renders the six
     pages of scripts/harness/pages.json from the real adapters and views into
     scratchpad/harness/pages/ and asserts each is fresh and whole. FIRST and
     alone, because the nine browser gates below read those renders through
     scripts/lib/page_renders.mjs instead of the snapshots frozen in
     docs/loop/artifacts/final-pages on 2026-09-08. Not a browser gate: the
     render is React. It needs NEXT_PUBLIC_SUPABASE_URL to start (the client
     is built at import) and says in its output whether it had one. */
  { name: "pages-fresh", script: "scripts/verify_pages_fresh.mjs", phase: "first" },
  /* THE DOORS LAND WHERE THEY PROMISE (plan step 39, 2026-09-19; MODEL.md
     PART 8's "THE DOORS" paragraphs, M23, the coherence check of 2026-09-16).
     Reads the renders pages-fresh wrote and walks every door on them (the
     termini, the city cards, the neighbourhood cards, the trade rows, the
     rivals and visitor rows, the money card's rows): the href resolves to a
     route by a pure mirror of each route's notFound() over the same files,
     the door's declared promise (`data-lands`, set where the door is built)
     is the kind its landing page's masthead declares (`data-answers`, one
     declaration per surface in src/lib/spine/door_kinds.ts), no compare
     table's rows navigate, no two doors of one terminus share a first word.
     A trade cell's route is decided by the database, so a cell href is
     verified against the prerendered list and the harness exemplars and
     otherwise printed unverifiable, never passing. The walk is written to
     scratchpad/harness/doors.txt. No browser, no network: jsdom over the
     files. Planted twice (a dead door, a wrong promise) and watched red. */
  { name: "doors", script: "scripts/verify_doors.ts" },
  /* THE HARNESS'S OWN RULES JOIN THE CHAIN (plan step 14b, second half). Until
     today the archetype rules, the page filter and the model-laws list ran by
     hand only (`npm run harness`), so a deploy checked none of them. Three
     gates, each behind a floor that falls and never rises: the archetype
     sheet (rendered by the gate itself; exits on design reds alone, its data
     reds go to DATA-REQUIREMENTS.md, step 17), the page filter over the
     fresh renders (scripts/harness/page_holes_baseline.json, per page), and
     the model-laws list over the same renders (--ratchet against
     scripts/harness/model_laws_baseline.json, seeded at 99 rows on
     2026-09-17). All three read what pages-fresh wrote, which is why it runs
     first. Browser gates, three more of them: twelve in the chain then,
     thirteen with loud-seats below. */
  { name: "harness-archetypes", script: "scripts/harness/harness.mjs", args: ["archetypes"], browser: true },
  { name: "harness-page-filter", script: "scripts/harness/check_page_holes.mjs", args: ["--list"], browser: true },
  /* HIS PAGE LAWS OF 2026-09-20 (MODEL.md PART 9 clauses 50 to 58; the checks
     in E:/atlas/design/loop/architecture/HARNESS-SPEC.md). The page filter
     above measures a blank rectangle inside a card and a full-width band; the
     renders of 2026-09-19 passed it and failed his eye ("the harness is not
     working correctly"). This gate holds what it did not: cards per level,
     the level's fill, visuals per level, the text measure, a card's foot, the
     hero's side, overlap and overflow, repeated kinds, parts behind a click.
     The same fresh renders, the same per-page ratchet
     (scripts/harness/page_laws_baseline.json), seeded at the first honest
     measurement of each page and falling only. A browser gate, one more. */
  { name: "harness-page-laws", script: "scripts/harness/check_page_laws.mjs", args: ["--list"], browser: true },
  { name: "harness-laws", script: "scripts/harness/check_model_laws.mjs", args: ["--list", "--ratchet"], browser: true },
  /* The walk over the links the rendered pages offer (2026-09-22, QUEUE ui:links-and-the-dead-link-walk): the shape of every internal href against src/app, the hygiene, and the floor of ways out per page type. No browser: it reads the same renders `pages-fresh` writes. `dead-links` beside it reads SOURCE literals and cannot see a link composed from data, which is every link on a spine page. */
  { name: "harness-links", script: "scripts/harness/check_page_links.mjs", args: ["--list"] },
  /* THE LOUD-MOMENTS LEDGER AND THE RENDER AGREE (plan step 40, 2026-09-19;
     MODEL.md PART 6 and PART 8's seat tables). Each surface's view declares
     its three loud seats (`LOUD_SEATS`; the census prints them into
     docs/loop/CENSUS.md and PAGES.md), and this gate opens every render in
     scripts/harness/pages.json at 1280 with the page filter's own accent walk
     (scripts/lib/accent_walk.mjs, one function for both) and reds a seat
     declared LIT that carries no accent on a card that prints its figure, and
     any accent in a card no LIT seat names. A browser gate that measures for
     itself: the filter writes its count to scratchpad/harness/accents.json,
     but in this pool the two run at once, so a read of that file would race
     its write. Planted twice and watched red. A thirteenth browser gate. */
  { name: "loud-seats", script: "scripts/verify_loud_seats.mjs", browser: true },
  { name: "taxonomy", script: "scripts/verify_taxonomy.ts" },
  { name: "no-em-dashes", script: "scripts/verify_no_em_dashes.ts" },
  { name: "no-source-agencies", script: "scripts/verify_no_source_agencies.ts" },
  /* The archetype harness's browser-free half (2026-09-04): builds the answer
     card's facts for every country from local modules and checks the copy
     register, the labels' length, the subtitle's promises and the tags. No
     network, no browser. The browser half runs as `npm run harness:archetypes`
     before a ship, by the same convention as verify:rendered. */
  { name: "archetype-copy", script: "scripts/verify_archetype_copy.ts" },
  /* The model's twelve laws (MODEL.md PART 8.5, task 4, 2026-09-08), the
     browser-free, database-free third: BANNED WORDS, ROW SENTENCE and
     DISTRICT ADJECTIVE, checked as pure copy/data facts (static COPY
     strings, and the city-level builders run against a synthetic, lettered
     fixture rather than a live per-city seed, since that seed needs the
     database). The other nine of the twelve need a rendered page and stay
     in `npm run harness:laws`, by the same convention as harness:page and
     harness:readability: never in this chain. */
  { name: "model-laws-copy", script: "scripts/verify_model_laws_copy.ts" },
  /* Every spine section is on an archetype or named in
     data/archetypes/coverage_exceptions.json with a reason; the set only
     shrinks. The build loop's ratchet (run 9, 2026-09-06). Browser-free. */
  { name: "archetype-coverage", script: "scripts/verify_archetype_coverage.ts" },
  { name: "harness-preflight", script: "scripts/verify_harness_preflight.ts" },
  { name: "no-background-photo", script: "scripts/verify_no_background_photo.ts" },
  /* The spine2 invariants (PORT-CONTRACT M1-M9). Both are fast and browser-free.
     The rendered-design linter is deliberately NOT here: it drives a real
     browser, so it runs as `npm run verify:rendered` before a ship, not on
     every build. Registered 2026-07-26 after each was negative-tested. */
  { name: "cell-lattice", script: "scripts/verify_cell_lattice.mjs" },
  { name: "derived-accents", script: "scripts/verify_derived_accents.mjs" },
  /* The two visual faults the 2026-08-24 whole-site sweeps found and could prove.
     Both are source scans: no network, no secret, no browser, so neither can fail
     on a blip. Both were negative-tested against a deliberately broken file
     before being registered here.

     The other four sweeps built that day are NOT here, and the reason is written
     down rather than left to be rediscovered. `sweep_dead_sections` and
     `sweep_empty_chapters` have to RENDER the pages, which means importing the
     adapters, which construct a database client at import time: the chain must
     never need a secret. `sweep_repeated_figures` produces a list a human has to
     judge, and a gate that cries wolf gets switched off. `sweep_cross_page_figures`
     has never found a fault, so it has not earned a place. All four stay manual. */
  { name: "no-scaling-drawings", script: "scripts/verify_no_scaling_drawings.mjs" },
  { name: "scale-end-clamps", script: "scripts/verify_scale_end_clamps.mjs" },
  { name: "frost-reads", script: "scripts/verify_frost_reads.mjs", browser: true },
  { name: "section-bands", script: "scripts/verify_section_bands.mjs", browser: true },
  { name: "art-direction", script: "scripts/verify_art_direction.mjs", browser: true },
  /* E6, the other half of "a lot of whitespace". The ink gate measures HEIGHT,
     so a card with a dead strip down its right passed as full. */
  { name: "gathered-emptiness", script: "scripts/verify_gathered_emptiness.mjs", browser: true },
  /* The same rule on a LIVE render of the country page, which the four static
     artefacts above never include, runs as `npm run harness:page` before a
     ship (scripts/harness/check_page_holes.mjs): the render needs the database
     for the money card, and this chain must not. Founder, 2026-09-05. */
  /* D1 read across every surface a visitor can walk, not only the four rebuilt
     spine pages `section-bands` already holds the line for. 2026-08-27: "the ban
     is site-wide, every live surface, not only the four reformed page types."
     Ratchet, negative-tested; the legacy three carry real counts today. */
  { name: "fullwidth-sitewide", script: "scripts/verify_full_width_sitewide.mjs", browser: true },
  /* Task 6, 2026-08-27 verdicts 2, 4, 7: one card radius, and country flags
     that are always rectangles and always legible, read across the same
     seven pages `fullwidth-sitewide` reads. The task brief called the flags
     gate hard with no baseline; the controller shipped both as RATCHETS
     instead, because the violators it catches (194 rounded flags on
     countries-list, minuscule flags in the legacy country page's peers
     table, the legacy pages' own 16px/12px card radii) are only repaired in
     later tasks, and a hard gate would fail the whole chain from today until
     then. `country-gb`'s flags baseline MUST reach 0 once its peers table is
     rebuilt. Both negative-tested against a scratch copy of a real page. */
  { name: "radius-uniform", script: "scripts/verify_radius_uniform.mjs", browser: true },
  { name: "flag-marks", script: "scripts/verify_flag_marks.mjs", browser: true },
  /* The 2026-08-30 verdicts, each a gate the same day (working method rule 4):
     law M, nothing scrolls sideways at phone width on the rebuilt surfaces
     (the peers table paid first); N9, quartile words never reach a reader ,
     deciles or the typical alone. Both scoped to the rebuilt spine with the
     legacy remainder named loudly, not silently passed. */
  { name: "no-phone-sideways", script: "scripts/verify_no_phone_sideways.mjs", browser: true },
  { name: "no-quartile-words", script: "scripts/verify_no_quartile_words.mjs" },
  /* THE CHECK THAT WOULD HAVE CAUGHT THE SLOP, 2026-09-01. Every other gate
     here tests a rule; none tested sameness, so ten sections drawn as the same
     horizontal track passed the entire suite and reached the founder. Counts
     each page's declared visual ideas against the caps parsed out of
     FORM-CATALOG v2. Negative-tested by planting three I1 declarations on a
     page whose cap is two and watching it fail. */
  { name: "form-variety", script: "scripts/verify_form_variety.mjs", browser: true },
  /* The blueprint-conformance gate (2026-08-29 to 2026-09-17) stood here. It
     compared design/blueprints/*.md in the parent repo against renders frozen
     in docs/loop/artifacts/final-pages on 2026-09-08, so it could never see
     the live site, and MODEL.md PART 8 has been the one source of every spine
     since plan step 2. Retired with plan step 14; the blueprints carry a
     SUPERSEDED line naming their PART 8 section. */
  /* Two display utilities on one element compile to two declarations and the
     stylesheet picks the winner. Nothing warns and a typecheck cannot see it.
     The tooltip marker carried inline-flex AND grid for months. */
  { name: "one-display", script: "scripts/verify_one_display.mjs" },
  /* Critique rounds may only improve on each other. Without this the record is
     a diary: pleasant to keep, no obstacle to making the same mistake twice. */
  { name: "critique-rounds", script: "scripts/verify_critique_rounds.mjs" },
  /* The coverage CLAIM, not the rules. Section J of the art direction says
     which of its 55 rules a gate holds, and that claim was wrong in three
     separate documents on the day it was written. A coverage claim nobody
     verifies is worse than no claim: it stops anyone looking. */
  { name: "art-direction-coverage", script: "scripts/verify_art_direction_coverage.ts" },
  /* FRESHNESS of the two artifacts generated out of design/mockups/. Both are
     valid files when stale, so nothing else can notice: a stale stylesheet
     still compiles and a stale glyph module still typechecks. This actually
     happened on 2026-07-26 , six edits to the mockup stylesheet sat
     unpropagated for eleven hours while the React kit rendered the old design.
     Both checks were negative-tested against a real induced drift. */
  /* Plan step 14 (2026-09-17): `spine-css-fresh` compared src/styles/atlas-spine.css
     with the parent repo's mockup stylesheet, retired in plan step 5, so it was
     red against a file that no longer means anything. The stylesheet is the
     site's own now; this reads it alone and asserts what the generator used to
     guarantee (every rule under .av2, .av2 free of transform and filter). */
  { name: "spine-css-scoped", script: "scripts/verify_spine_css_scoped.mjs" },
  { name: "glyphs-fresh", script: "scripts/sync_glyphs.mjs", args: ["--check"] },
  /* The section census (plan step 24, 2026-09-17): docs/loop/CENSUS.md is
     generated from src/components/spine and this reds when it is stale, so
     PAGES.md can never again say the country page draws a CardPager it stopped
     drawing. Reads only the in-repo copy; never the loop repo, which the
     build machine does not have. */
  { name: "census-fresh", script: "scripts/harness/census.ts", args: ["--check"] },
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
  /* The district engine's boundary. Its tables are keyed by underscore id and
     the site's slugs are hyphenated from names; for as long as the city
     adapter passed a slug straight in, every London district's revenue was
     exactly +0% and nothing on the page could tell "average" from "never
     asked". Either spelling must resolve to the same coefficients, a trade
     with no model must come back tagged rather than as a silent 1.0, and the
     rent share must be read from the baselines rather than typed. Negative-
     tested against a resolver missing its taxonomy step (34 reds) and a
     literal 0.12 typed back in. Registered 2026-09-17. */
  { name: "district-engine-boundary", script: "scripts/verify_district_engine_boundary.ts" },
  { name: "no-hardcoded-hex", script: "scripts/verify_hardcoded_hex.ts" },
  /* The distance ladder (2026-09-23, briefs/DISTANCES.md section 1: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64). A ratchet seeded at the 152 uses the spine held the day it was written; the count may only fall. */
  { name: "distance-ladder", script: "scripts/verify_distance_ladder.mjs" },
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
  { name: "no-cream", script: "scripts/verify_no_cream.ts" },
  /* THE SHARED COMMENT STRIPPER, TESTED, because every source-scanning gate in
     this list depends on it and it has now been wrong three times.

     Its header records the first two: a naive startsWith("//") that understood
     only the first line of a block comment, hit by two gates in one sitting.
     The third, found 2026-08-17, was worse in kind rather than degree: a `/*`
     inside a STRING literal opened a block comment that never belonged, and the
     state machine carried it forward, so every gate below went blind from there
     to the next real close. On src/app/_design/page.tsx that hid 195 of 451
     lines, including 45 className lines, and every gate reported PASS.

     A library that silently switches off the whole chain is the one place in
     this repo where an untested helper is indefensible. */
  /* A COLOUR CLASS THAT RESOLVES TO NOTHING. Added 2026-08-17, the same day
     tailwind.config.ts stopped extending the default palette and started
     replacing it. That was the right fix and it sharpens this failure mode:
     with no stock ramp underneath, a class naming a step the ramp does not
     publish emits NO rule, and the element silently inherits.

     It found 26 on its first run. Nineteen were cocoa-400/200 and sixteen of
     those sat on MISSING-DATA markers, so the one thing whose job is to look
     absent was rendering in ordinary body colour. The other seven were
     ink-400, two of them the "BOTTOM 10%" and "TOP 10%" caps on
     PercentileStrip, which are meant to be QUIETER than the figures beneath
     them and were inheriting at full strength instead. */
  /* A TAKE-HOME THAT CONTRADICTS ITS OWN SHOWN MARGIN. Added 2026-08-17 after
     two independent defects of one shape landed in a single day: London's
     curated file disagreed with its own margin on ALL TWENTY activities
     (hotels printed 19% BELOW its shown margin), and the homepage beats printed
     the raw structural profit beside a 3%-floored margin, agreeing with the
     cell page on 38.3% of 17,496 combinations and printing $1 beside "3% net"
     of $150,000 at worst.

     Two halves. The contract half sweeps resolveOwnerTakeHome and asserts the
     printed figure never sits BELOW the dollars its shown margin implies; that
     is a floor, not an equality, because the resolver deliberately takes the
     max of the structural profit and the margin floor. The bypass half is a
     ratchet over modules that derive the figure without the resolver, which is
     what both defects actually were. */
  { name: "take-home-identity", script: "scripts/verify_take_home_identity.ts" },
  { name: "token-steps", script: "scripts/verify_token_steps_exist.ts" },
  /* A CUSTOM PROPERTY THAT REFERENCES ITSELF. Added 2026-08-18 after
     globals.css was found declaring `--font-display: var(--font-display), ...`
     on :root, the same element next/font's class lands on. Measured in a
     browser on a two-order fixture: when :root wins the tie the property
     computes to the EMPTY STRING and every consumer INHERITS THE BODY SANS,
     because invalid-at-computed-value-time discards the whole declaration
     rather than stepping to the next family. When the font class wins instead,
     the :root declaration is discarded and its fallback chain never applies.
     No ordering does what the author meant, which is why this is a hard gate.
     Negative-tested by re-inducing the exact line. */
  { name: "no-self-referential-css-vars", script: "scripts/verify_no_self_referential_css_vars.ts" },
  /* Registered 2026-08-20. Written months earlier and never wired, which is why
     the site has had no accessibility check of any kind in the chain. It was NOT
     wired as-is: it held no `process.exit`, so registering it unchanged would have
     added a sixth check that cannot go red. Now a hard gate at zero, negative
     tested against a fixture. */
  { name: "a11y-static", script: "scripts/audit/a11y_static_audit.ts" },
  /* THE GATE LIST EXISTS ONCE. Added 2026-08-19 after prebuild:serial was found
     holding a hand-written chain of 43 script paths against this array's 102, a
     drift of 59 gates including cream, palette, take-home identity, canonical
     URLs and every wired test. CLAUDE.md calls that script "same gates,
     single-process (use if parallel is flaky)", and the parallel runner IS
     flaky on Windows, so the documented remedy ran 42% of the chain and printed
     only passes. The duplicate was deleted rather than policed; this stops a
     second one growing back. Negative-tested by re-inducing a three-gate chain. */
  { name: "single-gate-chain", script: "scripts/verify_single_gate_chain.ts" },
  /* THE CARRIERS HOLD CURRENT NUMBERS. Added 2026-08-19, executing move M1 of
     docs/loop/artifacts/org-proposal.md. The gate count alone was stated at ~78
     line locations across 32 files at TEN values (25, 26, 31, 53, 58, 95, 98,
     99, 101, 102), every one typed by somebody who had just measured it. So
     documents stopped stating counts and started carrying a generated block,
     and this fails the chain when a block goes stale, naming the command that
     fixes it. Negative-tested by editing 103 to 99 in CLAUDE.md. */
  { name: "counts-fresh", script: "scripts/verify_counts_fresh.ts" },
  /* THE GATE REGISTRY HOLDS NO CONTRADICTION. Plan step 15, 2026-09-17.
     `scripts/gates.json` is generated from this array and the gate scripts by
     counts.ts (the gate above reds when it is stale) and records what each gate
     bans and requires. This reds when one gate bans a literal that another
     requires, which is how archetype-copy once required the `x1.00` that
     model-laws-copy bans and a page could satisfy only one of them. Proved by
     planting a scratch gate declaring `requires "x1.00"`. */
  { name: "gate-conflicts", script: "scripts/verify_gate_conflicts.ts" },
  /* EVERY RED NAMES A FILE, A LINE, A RULE AND A REMEDY, ratcheted. Plan step
     16, 2026-09-17: a static census of each gate's failure text (a path, the
     rule's name, a remedy phrase) against scripts/gate_reds_baseline.json,
     which falls and never rises. "cream grew 5 to 6" cost a deploy and a
     search; the same red now reads globals.css:2534 with the literal and
     "use var(--c-card) or another token". */
  { name: "gate-reds-ratchet", script: "scripts/audit_gate_reds.mjs" },
  { name: "strip-comments", script: "tests/lib/strip_comments.test.ts" },
  { name: "build-compare", script: "tests/scripts/build_compare.test.ts" },
  { name: "scope-rules", script: "tests/taxonomy/scope_rules.test.ts" },
  { name: "retired-activities", script: "tests/taxonomy/retired.test.ts" },
  { name: "activity-merges", script: "tests/taxonomy/merges.test.ts" },
  { name: "presence-threshold", script: "tests/taxonomy/presence.test.ts" },
  { name: "type-ladder", script: "scripts/verify_type_ladder.ts" },
  { name: "width-discipline", script: "scripts/verify_width_discipline.ts" },
  { name: "table-semantics", script: "scripts/verify_table_semantics.ts" },
  { name: "render-graph", script: "scripts/audit_render_graph.ts", args: ["--gate"] },
  { name: "top-industries-plausibility", script: "tests/cells/top_industries_plausibility.test.ts" },
  { name: "all-sizes-blend", script: "tests/cells/extrapolated_all_sizes_blend.test.ts" },
  /* The 6x-median keep screen at the trade-page layer (2026-08-29): the same
     fixed credibility formula the country page runs, pinned so no cell_view
     surface can print an owner take-home the country page would withhold.
     Negative-tested by removing the screen from buildCellView (4 failures). */
  { name: "cell-keep-credibility", script: "tests/cells/cell_view_credibility_screen.test.ts" },
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
  /* A placeholder is not a figure (2026-09-23 night): two new builders read one
     each as "modelled" the same evening (London's calendar, printed on
     production; North Korea's household budget, unserved only because /kp is a
     404). The store now drops a placeholder unless
     a query asks; this proves the refusal on the bank's real holders and a
     plant, holds every ask to a named list, and every read around the store to
     a named list that filters its own. Planted three ways, each watched red. */
  { name: "placeholder-never-printed", script: "scripts/verify_placeholder_never_printed.ts" },
  /* /gb/london answered "Not found" while /cities/london served (QUEUE
     launch:gb-london-404; the goal's D4, 2026-09-24): the region route
     redirects a city its country holds to the city's page, after its own
     region lookup and before notFound(); every listed city is held to its
     page and to no other country's path. Planted once (the redirect moved
     after notFound), watched red. */
  { name: "city-path-redirect", script: "scripts/verify_city_path_redirect.ts" },
  /* A trade's address named an activity the atlas retired (the goal's A6,
     2026-09-24, fetched on production): /industries/consulting printed
     "Management consulting", /gb/london/plumber "residential construction",
     /gb/london/chemicals-mfg Custom jewelers. Every word, id and old slug the
     resolvers read answers a live trade or nothing, a fuzzy answer carries
     every word, and the legacy crosswalk names no retired activity. Planted
     twice (the old alias step, the old fuzzy sum), each watched red. */
  { name: "trade-resolution", script: "scripts/verify_trade_resolution.ts" },
  /* The "?" gloss opened on hover and keyboard only from 2026-08-21, when it
     moved onto a Radix tooltip, to 2026-09-24: a tap on a phone focused it and
     showed nothing (fetched on production with a touch device; the goal's A8).
     Bundles InfoTip and drives a browser: a tap opens and a second tap closes
     it at 375, hover at 1280, focus and Escape from the keyboard. Planted twice
     (the old component, and the fix without preventDefault), each watched red. */
  { name: "gloss-tap", script: "scripts/verify_gloss_tap.mjs", browser: true },
  /* A browser gate that forgets requireBrowser dies on Vercel's build machine,
     which has no browser, and fails the deploy after a local chain passed
     every gate: three did on 2026-08-27, gloss-tap did on 2026-09-24 (batch
     eight). Every chain script that launches a browser, directly or through a
     local module, must call it. No browser, no network: a source read.
     Planted (the guard removed from gloss-tap), watched red. */
  { name: "browser-gates-skip", script: "scripts/verify_browser_gates_skip.ts" },
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
  { name: "wage-deciles", script: "scripts/verify_wage_deciles.ts" },
  /* The expandable legal-form table actually expands: jsdom mounts the real
     client component and clicks it, because the static final-pages render is
     unhydrated and cannot tell a working expander from a dead one (its own
     header states the blind spot). Founder order 2026-08-30, gated same day. */
  { name: "setup-expand", script: "tests/spine/setup_tiers_expand.test.ts" },
  /* The peers table's registration fee and registration wait sit on ONE row of
     the formation file. Two modules used to pick their own row and disagreed on
     the 8 countries with no Sole Trader tier, so 23 of the 51 peer tables
     printed a limited company's fee beside a freelancer's filing time. Every
     figure was individually real, which is why nothing else here could see it.
     C31, 2026-09-03; negative-tested against the old picker inside the file. */
  { name: "formation-pair", script: "tests/spine/formation_pair_one_row.test.ts" },
  /* The bill to register never prints beside a table that contradicts it
     (plan step 44, 2026-09-17). The country shard's all-in bill and days until
     trading sit in one band with the formation file's LLC row, and on 100 of
     the 148 countries holding both the shard's figure is below the table's in
     a direction that cannot be true. The guard in entry_bill_rows.ts withholds
     the offending figure with a stated line; this holds the guard to the
     brief's own cases, walks every country's built card against the row the
     guard read, and ratchets the withheld counts (51 bills, 83 days, 4 not on
     file) so they fall and never rise. Planted twice on 2026-09-17 (the bill
     unchecked; the verdict ignored) and seen red both times. */
  { name: "entry-bill-guard", script: "tests/spine/entry_bill_guard.test.ts" },
  /* The placement sentence is one wording, one direction, one builder (MODEL.md
     PART 6 decision 2, PART 9 clause 37, R2; plan step 31's sixth dispatch,
     2026-09-18). "Higher than {n} countries in ten", n one to nine in words,
     "Among the lowest tenth" for the bottom, the singular for one, a tie not
     lower, a share on a boundary on its tenth, no line without a set; every
     sentence the builder can produce over every pair up to 200 members is
     checked against the one shape. Planted once (the clamp raised to ten) and
     seen red by name. */
  { name: "placement-sentence", script: "tests/spine/placement.test.ts" },
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
  /* Plan step 48 (2026-09-19): the sample switch is a launch gate. The marks
     are hidden by his switch while he is the only reader; this fails a build
     with the marks off unless .env.production (committed, public flags only)
     or the environment declares NEXT_PUBLIC_SITE_PRIVATE=1, with the one
     sentence "the site is not private and the sample marks are off". */
  { name: "sample-switch", script: "scripts/verify_sample_switch.ts" },
  /* Finding C1a, 2026-08-28 review round on src/lib/spine/adapt_country.ts.
     buildSpineCountrySeed needs the database for its money block, so it can
     never be called from a gate (this chain must never need the network). A
     STATIC gate instead: parse the adapter's own source (comments stripped),
     confirm every block in its returned seed object carries _meta.confidence,
     and confirm the file never imports country_profile_v2 or reads
     employer_social_pct, so plan correction 1 (one source for payroll and tax)
     stays enforced mechanically rather than by review alone. Negative-tested
     against a scratch copy with one block's _meta deleted (caught, and
     isolated to that one block) and a scratch copy with a rival import added
     (caught). */
  { name: "country-seed-confidence", script: "scripts/verify_country_seed_confidence.mjs" },
  /* Plan step 43 (2026-09-17): the profile's minimum wage is 0.45 times the
     median to the dollar on 148 of 197 rows, a fill's fingerprint; the
     at-a-glance card withholds those and every non-tier-A row, and this
     rebuilds every row through the builder and reds a printed one at the
     fingerprint. Planted on the US row and seen red before it was trusted. */
  { name: "min-wage-not-fill", script: "scripts/verify_min_wage_not_fill.ts" },
  /* MODEL.md 8.2 `06 running-costs`, clause 46 (2026-09-18): the profile's
     commercial electricity rate is exactly 0.13 on 52 rows, the engine's own
     reference constant, a fill's fingerprint; the power-and-living-costs card
     withholds those, tier A included, and this rebuilds every row through
     the builder and reds a printed rate within a tenth of a cent of it, or an
     interpolated one not marked modelled. Planted on the fill rows and seen
     red 52 times before it was trusted. */
  { name: "electricity-not-fill", script: "scripts/verify_electricity_not_fill.ts" },
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
  /* THE TRADE PAGE PRINTS A TAKE-HOME ONLY OFF A ROW OF ITS OWN (QUEUE
     trust:revenue-filled, launch-blocking, 2026-09-19). The gate above kept
     the fill's figure and dropped its label; the trust gate (trust.ts) never
     read the mark, so the trade page's money gate (cell_view.ts moneyShown)
     printed the engine's take-home over a filled anchor, or over the margin
     clamp's floor, as the city's own on every prerendered cell off London
     and the United States (plan step 34's third dispatch: 945 filled and 22
     floored of the slate's 1,029 resolved rows). Now the gate has a sixth
     guard on the mark and moneyShown refuses a floored margin, and this
     walks every prerendered trade cell (the two routes' static params read
     off the files, and the sheet's exemplars) through loadCellView and reds
     on any cell whose money shows off a filled or floored row but through
     the curated London entry. Needs the database like pages-fresh (it says
     when a lookup fell back and passed vacuously); not a browser gate.
     Planted once: the sixth guard removed, red on eight of forty by route. */
  { name: "money-shown-own-rows", script: "scripts/verify_money_shown_own_rows.ts" },
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
/* A PER-GATE TIMEOUT, because a gate that hangs wedged a whole serial run on
   2026-09-05 (a browser gate on a machine with under 400 MB free sat for
   twenty-three minutes and nothing said so). A gate past the limit is killed
   with its process tree and reported as a red that says TIMEOUT, which is a
   finding about the machine or the gate, never a pass. `--timeout=<seconds>`,
   default 240; 0 disables. THE DEFAULT ROSE 120 TO 240 ON 2026-09-19 (plan
   step 50's first run): archetype-copy builds every trade builder over the
   243 shards and runs 95 s on a free machine, 128 s beside the harness and
   225 s while other programs held most of the CPU, and was killed at 120 s
   twice in one afternoon as a TIMEOUT that was the machine's load, not the
   gate's. A budget is not a ratchet (nothing is judged by it but a hang), and
   the hang this rule exists for ran twenty-three minutes; 240 still catches
   it. A Vercel build machine is not this one, which is the other reason.
   AND ROSE AGAIN, 240 TO 360, ON 2026-09-23, for the same gate and the same
   reason measured twice in one run: 240.4 s inside the chain (a TIMEOUT) and
   186 s alone, minutes apart, on a machine holding 1.3 GB of somebody else's
   browser. A gate that legitimately needs three minutes should not sit four
   seconds under its own ceiling, because the failure it produces is a lie
   about the code. 360 still catches the hang, which ran twenty-three. */
const timeoutArg = argv.find((a) => a.startsWith("--timeout="));
const TIMEOUT_MS = (timeoutArg ? Math.max(0, parseInt(timeoutArg.split("=")[1], 10)) : 360) * 1000;
/* A SUBSET, `--only=<name,name>`: exact gate names, so a crashed or timed-out
   gate can be rerun alone by the same runner instead of by hand. The GATES
   array is untouched, so the counts and the single-chain gate read the same
   list; only what runs is narrowed, and the summary says so. */
const onlyArg = argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? new Set(onlyArg.split("=")[1].split(",").map((x) => x.trim()).filter(Boolean)) : null;
const freeMb = () => Math.round(os.freemem() / 1048576);

/* THE MEMORY FLOOR (plan step 13, 2026-09-17). The chain used to start on a
   starved machine and die a minute later inside a browser gate, and the death
   read as a failure: ten of eleven reds in one run were that. Now it refuses
   first, with exit 2, the harness preflight's ground exit: a finding is 1, a
   wrong ground is 2, and the two are never confused.

   The floors are the harness preflight's own (scripts/harness/preflight.mjs,
   plan step 26, measured: browser deaths at 266 to 624 MB free, passes from
   about 1036 up). That module is not imported here: it imports playwright at
   module load and exits 2 on a wrong cwd, and this chain must depend on
   neither. The two numbers are read out of its source text instead, so the
   files cannot drift; the literals are the fallback for an unreadable file and
   are the values of 2026-09-17. The floor for a run follows how many browsers
   can be open at once: the chain floor above one, the browser floor at one,
   none when no selected gate launches one. `--floor=<MB>` overrides for a
   proof (0 disables), PREFLIGHT_FORCE=1 runs anyway, and VERCEL or CI skips
   the floor: a refused deploy is worse than a memory death on a machine we
   do not control. */
const GROUND_EXIT = 2;
const PREFLIGHT_SOURCE = "scripts/harness/preflight.mjs";
const FLOOR_LITERALS = { BROWSER_FLOOR_MB: 620, CHAIN_FLOOR_MB: 1100 };
function readFloors(): { BROWSER_FLOOR_MB: number; CHAIN_FLOOR_MB: number; literal: boolean } {
  try {
    const src = readFileSync(PREFLIGHT_SOURCE, "utf8");
    const b = /export const BROWSER_FLOOR_MB\s*=\s*(\d+)/.exec(src);
    const c = /export const CHAIN_FLOOR_MB\s*=\s*(\d+)/.exec(src);
    if (b && c) return { BROWSER_FLOOR_MB: Number(b[1]), CHAIN_FLOOR_MB: Number(c[1]), literal: false };
  } catch { /* unreadable: the literals */ }
  return { ...FLOOR_LITERALS, literal: true };
}
const floorArg = argv.find((a) => a.startsWith("--floor="));
const FLOOR_OVERRIDE = floorArg ? Math.max(0, parseInt(floorArg.split("=")[1], 10) || 0) : null;
const CI_SKIP = process.env.VERCEL ? "VERCEL" : process.env.CI ? "CI" : null;

/** The floor this run is held to, and the reason in words for the header. */
function floorFor(selected: Gate[]): { mb: number; why: string } {
  if (FLOOR_OVERRIDE !== null) return { mb: FLOOR_OVERRIDE, why: "by --floor" };
  const floors = readFloors();
  const source = floors.literal ? "; preflight.mjs unreadable, the literal" : "";
  const browsersAtOnce = Math.min(CONCURRENCY, selected.filter((g) => g.browser).length);
  if (browsersAtOnce > 1) return { mb: floors.CHAIN_FLOOR_MB, why: `up to ${browsersAtOnce} browser gates at once${source}` };
  if (browsersAtOnce === 1) return { mb: floors.BROWSER_FLOOR_MB, why: `one browser gate at a time${source}` };
  return { mb: 0, why: "no browser gate selected" };
}

/** win32 only: the top three image names by working set, read from tasklist, so
    the refusal names what to close instead of saying "close something". */
function heaviestProcesses(): string[] {
  if (process.platform !== "win32") return [];
  const r = spawnSync("tasklist", ["/FO", "CSV", "/NH"], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (r.status !== 0 || !r.stdout) return [];
  const groups = new Map<string, { mb: number; count: number }>();
  for (const line of r.stdout.split(/\r?\n/)) {
    /* "Image Name","PID","Session Name","Session#","Mem Usage": five quoted
       cells; the memory reads "123,456 K" in the machine's locale, so keep the
       digits only. */
    const cells = [...line.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    if (cells.length < 5) continue;
    const kb = Number(cells[4].replace(/\D/g, ""));
    if (!kb) continue;
    const g = groups.get(cells[0]) ?? { mb: 0, count: 0 };
    g.mb += kb / 1024;
    g.count += 1;
    groups.set(cells[0], g);
  }
  return [...groups.entries()]
    .sort((a, b) => b[1].mb - a[1].mb)
    .slice(0, 3)
    .map(([name, g]) => `${name}: ${Math.round(g.mb)} MB across ${g.count} process${g.count === 1 ? "" : "es"}`);
}

type Kind = "pass" | "fail" | "timeout" | "memory";

type GateResult = {
  name: string;
  exitCode: number;
  kind: Kind;
  durationMs: number;
  /** node's free physical memory when the gate ended, in MB. */
  freeMbAtEnd: number;
  stdoutTail: string;
  stderrTail: string;
  /** Set on a retry's result: the free memory at the first run, the one that died. */
  firstDeathAt?: number;
};

/* WHAT A MEMORY DEATH LOOKS LIKE, from this chain's own history: a V8 heap
   limit, a failed allocation, ENOMEM, Playwright losing its browser or never
   getting one, the shell's "spawn UNKNOWN", and three exit codes: 134
   (SIGABRT), 0xC0000005 (an access violation, the Windows segfault) and
   0xC0000409 (a fail-fast). Plus the quietest one: a non-zero exit that
   printed nothing at all, which is what a process the machine killed looks
   like from here. The signatures are matched on the whole output, not only
   on the twenty-line tail kept for the report, because a heap death prints
   its stack for twenty lines after the one line that names it. A timeout
   stays a timeout: it was this runner that killed it. */
const DEATH_EXIT_CODES = new Set([134, 3221225477, 3221226505]);
const DEATH_SIGNATURES = [
  /FATAL ERROR: Reached heap limit/,
  /Allocation failed/,
  /ENOMEM/,
  /Target page, context or browser has been closed/,
  /browserType\.launch/,
  /spawn UNKNOWN/,
];
function classify(exitCode: number, output: string): Kind {
  if (exitCode === 0) return "pass";
  if (exitCode === 124) return "timeout";
  if (DEATH_EXIT_CODES.has(exitCode)) return "memory";
  const text = output.trim();
  if (text === "" || DEATH_SIGNATURES.some((re) => re.test(text))) return "memory";
  return "fail";
}
const tail20 = (s: string) => s.split("\n").slice(-20).join("\n");

function runGate(gate: Gate): Promise<GateResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const args = ["tsx", gate.script, ...(gate.args ?? [])];
    // shell: true is required on Windows to spawn `npx` (which
    // resolves to `npx.cmd`); Node 22+ refuses to spawn .cmd files
    // directly with EINVAL. The DEP0190 deprecation warning this
    // triggers is acceptable here because every arg is a hardcoded
    // literal from the GATES array: no caller-controlled input.
    const child = spawn("npx", args, {
      shell: process.platform === "win32",
      env: process.env,
    });
    const stdoutBuf: string[] = [];
    const stderrBuf: string[] = [];
    let timedOut = false;
    const timer = TIMEOUT_MS > 0
      ? setTimeout(() => {
          timedOut = true;
          // The shell wrapper on Windows leaves the real process as a grandchild; kill the tree.
          if (process.platform === "win32" && child.pid) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
          else child.kill("SIGKILL");
        }, TIMEOUT_MS)
      : null;
    const finish = (exitCode: number, stdout: string, stderr: string, prefix = "") => {
      resolve({
        name: gate.name,
        exitCode,
        kind: classify(exitCode, stdout + stderr),
        durationMs: Date.now() - started,
        freeMbAtEnd: freeMb(),
        stdoutTail: tail20(stdout),
        stderrTail: prefix + tail20(stderr),
      });
    };
    child.stdout.on("data", (b: Buffer) => stdoutBuf.push(b.toString()));
    child.stderr.on("data", (b: Buffer) => stderrBuf.push(b.toString()));
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      finish(
        timedOut ? 124 : code ?? 1,
        stdoutBuf.join(""),
        stderrBuf.join(""),
        timedOut ? `TIMEOUT after ${TIMEOUT_MS / 1000}s: the gate was killed with its process tree (free memory ${freeMb()} MB)\n` : "",
      );
    });
    child.on("error", (err) => finish(1, "", `spawn error: ${err.message}`));
  });
}

/** The per-gate log line: the tick, the name, the seconds, and MEMORY or
    TIMEOUT when it was that; a retry's line says what the retry found. */
function logLine(gate: Gate, r: GateResult) {
  if (QUIET) return;
  const sym = r.kind === "pass" ? "✓" : "✗";
  const secs = (r.durationMs / 1000).toFixed(1);
  let note = "";
  if (r.firstDeathAt !== undefined) {
    note = r.kind === "pass" ? `  passed on retry after a memory death at ${r.firstDeathAt} MB free`
      : r.kind === "memory" ? `  MEMORY again on the retry, alone (exit ${r.exitCode}, ${r.freeMbAtEnd} MB free)`
      : `  ${r.kind === "timeout" ? "TIMEOUT" : "failed"} on retry after a memory death at ${r.firstDeathAt} MB free: a real result`;
  } else if (r.kind === "timeout") {
    note = "  TIMEOUT";
  } else if (r.kind === "memory") {
    note = `  MEMORY (exit ${r.exitCode}, ${r.freeMbAtEnd} MB free${gate.browser ? "; retried alone once the pool drains" : "; not a browser gate, not retried"})`;
  }
  console.log(`  ${sym} ${gate.name.padEnd(28)} ${secs}s${note}`);
}

/** Worker-pool runner: runs the `phase: "first"` gates serially and to
    completion before anything else, then caps concurrency over the rest,
    optionally bails on a real failure, and retries each browser gate's memory
    death once, alone, after the pool has drained. */
async function runAll(selected: Gate[]): Promise<{ results: GateResult[]; bailed: boolean }> {
  const results: GateResult[] = [];
  let nextIdx = 0;
  let bailed = false;
  const inFlight = new Set<Promise<void>>();

  /* THE FIRST PHASE (plan step 14b): one at a time, in array order, nothing
     else in flight, because the pool's gates read what these write. A real
     failure here bails exactly as one in the pool does; a memory death is
     reported apart and, since none of these is a browser gate, not retried. */
  const firstPhase = selected.filter((g) => g.phase === "first");
  const gates = selected.filter((g) => g.phase !== "first");
  for (const gate of firstPhase) {
    if (bailed) break;
    const r = await runGate(gate);
    results.push(r);
    logLine(gate, r);
    if ((r.kind === "fail" || r.kind === "timeout") && BAIL) bailed = true;
  }
  if (firstPhase.length && gates.length && !QUIET) console.log(`  (${firstPhase.length} first-phase gate${firstPhase.length === 1 ? "" : "s"} done${bailed ? ", bailed" : `; the pool of ${gates.length} starts`})`);

  function maybeStart(): void {
    if (bailed) return;
    if (nextIdx >= gates.length) return;
    const gate = gates[nextIdx++];
    const p = runGate(gate).then((r) => {
      results.push(r);
      logLine(gate, r);
      /* A memory death never bails: it is a finding about the machine, not
         about the gate, and for a browser gate the retry below may overturn it. */
      if ((r.kind === "fail" || r.kind === "timeout") && BAIL) bailed = true;
    });
    inFlight.add(p);
    p.finally(() => inFlight.delete(p));
  }

  // Prime the pool, then keep replenishing until done.
  for (let i = 0; i < CONCURRENCY; i++) maybeStart();
  while (inFlight.size > 0) {
    await Promise.race(inFlight);
    maybeStart();
  }

  /* THE RETRY, one at a time with nothing else in flight, so the second reading
     is of the gate and not of the pool. Its result replaces the first: a pass
     is a pass, a failure is a real failure with its output, a second death is
     reported under memory. Not after a bail: the chain promised to stop. */
  if (!bailed) {
    for (let i = 0; i < results.length; i++) {
      const first = results[i];
      const gate = gates.find((g) => g.name === first.name);
      if (!gate || !gate.browser || first.kind !== "memory" || first.firstDeathAt !== undefined) continue;
      if (!QUIET) console.log(`  ↻ ${gate.name.padEnd(28)} retrying alone after a memory death at ${first.freeMbAtEnd} MB free (${freeMb()} MB free now)`);
      const again = await runGate(gate);
      again.firstDeathAt = first.freeMbAtEnd;
      results[i] = again;
      logLine(gate, again);
    }
  }
  return { results, bailed };
}

async function main() {
  const started = Date.now();
  const selected = ONLY ? GATES.filter((g) => ONLY.has(g.name)) : GATES;
  if (ONLY) {
    const missing = [...ONLY].filter((n) => !GATES.some((g) => g.name === n));
    if (missing.length) { console.error(`--only names no gate: ${missing.join(", ")}`); process.exit(GROUND_EXIT); }
  }

  /* THE PREFLIGHT. The header always prints the free memory it read and the
     floor it was held to; under the floor it refuses, names what to close, and
     exits 2 before a single gate has started. */
  const free = freeMb();
  const floor = floorFor(selected);
  const forced = Boolean(process.env.PREFLIGHT_FORCE);
  const under = !CI_SKIP && floor.mb > 0 && free < floor.mb;
  const floorClause = CI_SKIP
    ? `floor skipped: ${CI_SKIP}`
    : floor.mb > 0
      ? `floor ${floor.mb} MB (${floor.why})${under && forced ? ", under it, PREFLIGHT_FORCE=1 runs anyway" : ""}`
      : `floor none (${floor.why})`;
  console.log(`=== prebuild_all  (${GATES.length} gates${ONLY ? `, running ${selected.length} by --only` : ""}, concurrency=${CONCURRENCY}, timeout=${TIMEOUT_MS / 1000}s, free memory ${free} MB, ${floorClause}) ===`);
  if (under && !forced) {
    console.error(`refused: free memory ${free} MB is below the chain's floor ${floor.mb} MB (${floor.mb - free} MB short)`);
    for (const line of heaviestProcesses()) console.error(`  ${line}`);
    console.error(`  close Edge windows (or whatever holds the most) until ${floor.mb} MB is free, then run again; PREFLIGHT_FORCE=1 runs anyway`);
    process.exit(GROUND_EXIT);
  }
  console.log("");
  const { results, bailed } = await runAll(selected);
  const wall = ((Date.now() - started) / 1000).toFixed(1);
  const passes = results.filter((r) => r.kind === "pass");
  const fails = results.filter((r) => r.kind === "fail" || r.kind === "timeout");
  const deaths = results.filter((r) => r.kind === "memory");
  const timeouts = fails.filter((r) => r.kind === "timeout").length;
  const retriedPasses = passes.filter((r) => r.firstDeathAt !== undefined).length;
  console.log("");
  console.log(`=== Summary ===`);
  console.log(`  Ran: ${results.length} / ${GATES.length} gates${ONLY ? " (a subset by --only; not the chain)" : ""}`);
  console.log(`  Wall-clock: ${wall}s, free memory now ${freeMb()} MB`);
  console.log(`  Passed: ${passes.length}${retriedPasses ? ` (${retriedPasses} on a retry after a memory death)` : ""}`);
  console.log(`  Failed: ${fails.length}${timeouts ? ` (${timeouts} by TIMEOUT)` : ""}`);
  console.log(`  Died on memory: ${deaths.length}`);

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
      const after = f.firstDeathAt !== undefined ? `; the retry's real result, after a memory death at ${f.firstDeathAt} MB free` : "";
      console.log(`\n--- ${f.name} (exit ${f.exitCode}${after}) ---`);
      if (f.stdoutTail.trim()) console.log(f.stdoutTail);
      if (f.stderrTail.trim()) console.log(f.stderrTail);
    }
  }

  /* THE MEMORY BLOCK, apart from the failures: the gate, the free memory when it
     died, whether it was retried, and the one remedy. What it printed, if
     anything, sits under it, because the signature is the evidence. */
  if (deaths.length > 0) {
    console.log("");
    console.log("=== Died on memory ===");
    for (const d of deaths) {
      const gate = GATES.find((g) => g.name === d.name);
      const what = d.firstDeathAt !== undefined
        ? `died on memory twice: at ${d.firstDeathAt} MB free in the pool and at ${d.freeMbAtEnd} MB free alone (exit ${d.exitCode})`
        : `died on memory at ${d.freeMbAtEnd} MB free (exit ${d.exitCode}); ${gate?.browser ? (bailed ? "not retried because the chain bailed on a real failure" : "not retried") : "not a browser gate, not retried"}`;
      console.log(`  ${d.name}: ${what}`);
      const printed = [d.stdoutTail, d.stderrTail].filter((t) => t.trim()).join("\n");
      if (printed) console.log(printed.split("\n").map((l) => `      ${l}`).join("\n"));
    }
    console.log(`  Free memory (close Edge windows, or whatever holds the most), then run these alone: npm run prebuild -- --only=${deaths.map((d) => d.name).join(",")}`);
  }

  if (fails.length > 0 || deaths.length > 0) process.exit(1);
  console.log(ONLY ? "\n  SUBSET: PASS (not the chain; run without --only for the gate)" : "\n  GATE: PASS");
}

void path; // reserved for future absolute-path resolution if needed
main().catch((err) => {
  console.error("prebuild_all crashed:", err);
  process.exit(1);
});
