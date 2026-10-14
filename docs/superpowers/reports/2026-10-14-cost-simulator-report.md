# Cost simulator build report (plan 2026-10-13 cost-simulator), branch `cost-simulator`

Base: `origin/parallel-base` 55a03e07, fast-forwarded to 7c92b4af on the controller's word (CI renders get a Supabase URL). Commits are
`sim:<slug>: ... (plan 2026-10-13 cost-simulator, Task N)`. Written as each task lands; the last section is the state at the last push.

## Where this ran, and what that changed

Not a cloud machine: the owner's 8 GB laptop, a worktree beside three other agents, free memory mostly 300 to 1,200 MB, two fork failures
and one ENOMEM on the way. So: no local full typecheck (it needs a 4 GB heap); a scoped typecheck of every touched file per task (exit 0
each time); the whole chain and the full typecheck on GitHub (checks.yml) per push; renders and browser gates one at a time, after the
memory check (the controller's `_run_when_free.sh` from its note on), on a one-page list (`scratchpad/calc/pages-calc.json`) so a gate reads
the calculator's render without reds for renders this worktree never drew. `node_modules` is a junction to the main checkout's (nothing
installed). Renders run with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` (the controller's note), so database reads fall back at once.

## The other plans this one stands on, as found (Task 0, Step 2)

The plan assumes rhythm-air-inside, home-quiet-editorial and country-page-journey have all landed. On parallel-base: the rhythm kit is there
(Rail `mb-6` and `level`, Focal, Basis); the country plan is not (no `src/lib/spine/signal.ts`, `owner_direction.ts`,
`src/components/spine/signal/`, no `placed`/`signal`/`noSignal` props on Focal or FactRows, no `WANT` line in country_model.test.ts); the home
plan is not (no tests/home/band.test.ts; spine_scan still names `home/` out). The plan says stop there; the dispatch says build on
parallel-base while the others run and not to build the signal. Built without the signal (see Task 4B and the open items).

## Task 0, the ground and the before

- Census (`scratchpad/calc/census.ts`, exit 0, fifteen lines): every city holds a secondary rent, a service charge, a fit-out cost, a
  deposit and an owner's median salary (0 lacking each); 96 cities lack a city wage; 65 countries lack their own employer rate; 4 countries
  (SV, GE, IS, SN) lack a commercial rent and a registration bill; 128 trades offered; 0 with no roles; 101 with an owner's seat; 0 with no
  spend per head; 5 on the 42/10/5 ladder (bricklaying_services, cabinet_making, alarm_systems_install, tiling_services,
  plastering_services); 38 on the 80,000 archetype default. No city lacks a rent, so Review Focus 3 is held by taking Berlin's rent out of
  the fact store, as the plan's test does.
- The before of the old page: no browser frame could be drawn then (the desktop pane's screenshot timed out; memory). Read as text by a
  remote fetch of https://www.marginatlas.com/calculator: the circular form (Country, Region, Industry, Size band, "Your annual revenue
  (USD)", "Show me the numbers"), h1 "What sales do you actually need, and does the owner get paid?", cards to /compare and /browse.
- The before of the trade close: deferred to just before Task 6 (no earlier task touches it), then rendered and photographed at 1280, 768
  and 375 (`scratchpad/calc/shots/before-close-*.jpeg`): three doors, the pill last.

## Task 1, the engine (9d48c425)

- engine.ts and uk_model.ts as written; "yours" the fifth word (`StampKind`), the provenance gate's `KINDS` holds it.
- Test red first (modules missing), then all pass: London restaurants by hand rent 73,374.79, rates 31,551.16, staff 179,232.26, running
  71,692.90, F 355,851.11, R* 556,017.36; the three money trades equal to model.ts to the penny (break-even, profit at the anchor, the sole
  trader's keeps, the share above); Berlin F 569,651.74, v 0.48, R* 1,095,484.12, 136 customers a day; owner's pay in F (1,172,407.19);
  a loss (-153,651.74), payback withheld at a loss, no break-even where shares reach 1 or 1.05; no NaN in 29 runs.
- Deviation: the test's `ReturnType<typeof E.simulate>` (E typed `module | null`, tsc TS18047) typed as the engine's `EngineResult`.
- Gates: calc-engine, uk-pnl-model, uk-pnl-london, london-trade-hero, counts-fresh pass. CI on 9d48c425: typecheck exit 0; chain 278 of
  290, the 12 reds identical to the base run on 7c92b4af.

## Task 2, the defaults (95b86363; a237fc59)

- london.ts's geography a parameter (London's words unchanged), place.ts, bundle.ts, cell_facts.ts, defaults.ts, load.ts, COPY.calculator.
- Test red, then all pass first run: London on model.ts (break-even 556,017.36 = model.ts), Q1 answer A (no service charge, the anchor's
  sales), Leeds and anywhere in the UK on England's rows ("Leeds holds none. This is England's."), Edinburgh on the world rows with no rates
  and no tax, Berlin through the files 1,095,484.12, the country's rent said when the city's is taken out ("Berlin holds none. This is
  Germany's."), the field empty with its line when the country's is too, no fill on 384 bundles of 128 trades.
- Deviations: `loadFacts([...saved])` (readonly array); notesOf's array typed for tsc.
- CI red found after: uk-open-permits (every read of the city list for a page's place passes cityOfCountry): fixed in a237fc59, the
  ticket's tier read as `getCityTier(cityOfCountry(iso2, city))`. That commit also carried Task 4C's first part by mistake (staged files
  swept into a path-less commit); left as is (no amend or reset), named in its subject at e5a12029.

## Task 3, the route (991343e1)

- respond.ts and /api/calculator as written; route_shapes gained the one line `["api", "calculator"]`. calc-api, edge-not-found,
  counts-fresh pass.

## Task 4A, money, bounds, the lever (ae79eb01)

- display.ts, bounds.ts, Range (value may be empty, its stamp, symbol and decimals as props). Range's unit keeps the base's `--t-micro`
  class (the rhythm branch has not moved it on parallel-base), as the step says. 193 strings inside the copy rules.
- calc-display, type-floor-reader, spacing-pin, counts-fresh pass; `interact` left to CI (browser over renders).

## Task 4B, the page (9177bfb5; 48c6043e; 70250044)

- Seed, sections, levers, client, view, page.tsx; door kind `break-even` and surface `calculator`; RankedBars `level`; STACKED exported;
  note_shape.ts; the page joins loud_seats, the bar budget and the four source lists; CENSUS.md regenerated (its block for the calculator,
  plus four kicker lines the base had stale).
- Not built: the signal (the country plan's). Step 3 skipped whole; no SignalKey, no placed/signal props; the page test drops the three
  signal checks and the direction-table check, and its header says so.
- Deviation: RankedBars requires `phoneHead`; the plan's MovesSection passed none: `COPY.calculator.moves.phoneHead` ("Figure moved",
  "Rise a year").
- Page test all pass: the one 40 $61,463 a month (556,017.36 / 12 x 1.3265), £46,335 after the currency event, the rent's typed figure 480
  then 362 with no write, Berlin's three "Type your sales to see this." lines, 54 client modules with no server module.
- CI red found after: archetype-coverage (the levers card on no archetype): named in coverage_exceptions.json with its reason (48c6043e).
- Photographed at 375 (the levers card): the typed share read "36 of sales"; units now "% of sales" / "% of pay" (70250044).

## Task 4C, the chain's renders (a237fc59 part one; e5a12029; 6a78d6a1; 17b6ee7e; bc0e18f8)

- render_page surface, pages.json entry, floor 7 (floor_census.json by its script: only `calculator: 7` and the date moved), link floor 2
  (counted on the render: the sources foot's link and the report link), the door gate's masthead query, page_foot, launch_ready (three
  exemplars and the production path), art direction's list, the render checks in the page test.
- Ratchets seeded at 0 by their own commands on the one-page list: provenance (51 figures, 51 stamped), model laws. Page laws, page holes and
  copy plain store only non-zero pages: nothing to seed. The model-laws ratchet once auto-seeded the calculator at 5 on its first run; that
  write was undone before any commit and the findings fixed.
- Findings fixed in the page, one change and one rerun each: LABEL GAP on the money to open it at 1280 (its zone 3-2, so its rows split into
  two lists; the page test's zone list says "3-2"), a justify-between team row at 768 (the stepper in the next column), ALIGNMENT on the
  centred head count (right-aligned), WHITE SPACE on the margin at 768 (answer and margin side by side from 768), 200px of air under the
  answer at 1280 (rows sized to content, 6a78d6a1), E6 gathered hole in the month at 1280 (the basis at the end of the switch's tab row;
  Switch gained an optional `aside`, unchanged without it, 17b6ee7e), E1 prose in the levers (681 characters: the levers' card is the page's
  one prose section and the sources' facts are short phrases with dates, bc0e18f8).
- Not measured on the calculator: fact-once, type-floor and line-rule read only the five spine surfaces (country, city, cell, industry, hood)
  on this base, so they never open the calculator's render.
- Local results on the London render: model laws 0, page laws 0, page holes 0, copy plain 0, readability 0, loud seats agree (LIT 2 of 3:
  $61,463 and 156), full width 0, art direction 0, gathered emptiness 0, provenance 0 silent, links 2 of floor 2.

## Task 5, the address (b0243dbe)

- state.ts, seo.ts, the page's generateMetadata and `v`, the client's replaceState after 250 ms, /calculator out of the edge's cache list.
- The state test was first run after state.ts and seo.ts existed (memory held the first run back), so its red was the three wiring checks
  (page, client, middleware), not the "is there" pair; then all pass.
- calc-state, calc-page, calc-defaults, edge-not-found, counts-fresh pass.

## Task 6, the door (58879667)

- runDoor in COPY, the run door before the pill (city where the city list holds it, else anywhere in the country; none for a trade the
  calculator does not offer), TRADE_CLOSE_CAP 4 through CloseCard on the trade page and its story, the door gate's calculatorLanding, the
  archetype gate's counts 4, 4, 3 and its run-door check.
- Deviation: the test counted `/data-door/g`, which also matches `data-door-kind` and the wrapper's `data-doors` (9 on four doors); it
  counts `data-door="` now.
- calc-door, archetype-copy, calc-page, counts-fresh pass; page laws 0 and no model-law finding on #close on the London trade render.
- Photographed after at 1280, 768 and 375 (`scratchpad/calc/shots/after-close-*.jpeg`): four doors, none cut, the pill last (at 768 the
  pill wraps to its own row, as the terminus draws it).

## Task 7, the circular form leaves (24222f29; 254f56f8)

- CalculatorForm.tsx deleted (render-graph's ORPHAN on the CI run of e5a12029 was this file). The deletion went out alone (a failed
  `git add` stopped the chain); the rest followed in 254f56f8.
- Deviation: `--write-baseline` on the two width and type ratchets also wrote other files' drift from the parallel branches (falls, and one
  per-file chCaps rise); kept only the two calculator files' removal, totals lowered by exactly their counts (type ladder 850 to 843, width
  remCaps 205 to 197, smPairings 41 to 38). Both gates pass (measured 837 and 193).
- tools/page.tsx and admin1.ts comments say what stands; money.ts's past-tense mention stays.
