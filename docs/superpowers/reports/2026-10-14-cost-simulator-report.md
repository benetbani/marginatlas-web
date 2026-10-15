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

## Task 8, the written rules (076923cb; MODEL.md skipped, its text below)

- The seven gates exist (calc-engine, calc-defaults, calc-api, calc-display, calc-page, calc-state, calc-door).
- GUIDELINES.md 0.7 gained the plan's four rows, as written.
- SKIPPED, the parent repo (E:/atlas/design/loop/build/briefs/MODEL.md is not in this repo). The text for the controller, the plan's Step 2
  and Step 3 as built (where the build differs from the plan's text, the build's fact is written and marked "built:"):
  - The `15 close` row: `` `Terminus`: three doors (its cap), the pill last (M21): `` becomes `` `Terminus`: four doors since 2026-10-13
    (the cap the trade close alone raises; plan 2026-10-13 cost-simulator, Q3), the pill last (M21): ``, and after `up to the city page,
    "Opening a business in {city}";` insert ` to the calculator, "Run your own numbers", with the page's place and trade
    (`/calculator?country=..&city=..&trade=..`, landing on the sales to break even; a region's or a council's page carries its country
    alone);`.
  - THE DOORS paragraph: `and the compare pill (`/compare`).` in its `15 close` sentence becomes `the calculator with the page's place and
    trade ("Run your own numbers", landing on the sales to break even, since 2026-10-13), and the compare pill (`/compare`).`
  - PART 10, the line beginning `- **A figure says where it came from**:`: `(counted, worked out, looked up, estimate, the register ledger's
    words)` becomes `(counted, worked out, looked up, estimate, the register ledger's words; and "yours", a figure the reader set on
    /calculator, since 2026-10-13, never one of the four)`.
  - Before `## PART 9. WHAT THE MODEL FORBIDS`, insert:

```markdown
### 8.10 The cost simulator, /calculator. Seven blocks since 2026-10-13 (plan 2026-10-13 cost-simulator; spec docs/superpowers/specs/2026-10-13-cost-simulator-design.md, section 4), this order, every place and trade the calculator resolves

| Row | Block | What it holds | Seat |
|---|---|---|---|
| `00 masthead` | What your business costs | The h1 and three native pickers on 48px fields: the country, the city or anywhere in it, the trade. A band, no block. | the first zone, wide |
| `01 answer` | Sales to break even | The page's one 40, the sales to break even a month, `--terra-text`; a day, customers a day, the firms above it (built: no signal yet, the country plan's signal joins it where twenty firms or more are placed); the sales for the reader's profit goal when set; one basis. Its reason in its place where an input is empty. | the instrument: from 768 beside the margin, from 1024 the right column, first |
| `02 margin` | Your margin | The margin at the reader's sales before tax at 30, placed by those sales among the place's firms ("Your sales top 70% of firms here."; built: the signal waits for the country plan); after tax in the UK. "Type your sales to see this." where none are held. | the instrument: from 768 beside the answer, from 1024 the right column, second |
| `03 numbers` | Your numbers | The page's one card (the reader operates it, 10.4) and the page's one prose section (art direction E1: a source line under every lever): the fixed costs a month at 30; Team (steppers), Premises, Sales, You, Loan, each lever a slider beside a typed figure with its line, the lever in hand showing the break-even beside it. | the instrument: the full width at 768, from 1024 the left column spanning its three rows |
| `04 month` | Your month | The profit a month at 30; one bar (costs per sale, fixed costs, profit, the break-even ticked, the costs running past the sales at a loss) and its key; the bill as fact rows in a switch for a month or a year, words and figures only, the basis at the end of the switch's tab row. | the instrument: the full width at 768, from 1024 the right column, third |
| `05 moves` | What moves it most | RankedBars: each input up a tenth or one more hire, the five largest rises, the leader's bar `--terra`; its focal the sales each 100 of fixed costs needs, `--terra-text`. | the next band, its left two thirds |
| `06 opening` | Money to open it | The months to pay back at 30, none at a loss; the opening bill as fact rows (the cell's held bill, else fit-out, deposit and registration, else the trade's archetype at the city's prices). | the last band, its left three fifths from 1024 |
| `07 sources` | Where figures come from | NoteList, five notes at most, each fact a short phrase with its date, "Your figures" first once the reader sets one. | the last band, its right two fifths from 1024 |

THE BAR LEDGER: two cards, `04 month` and `05 moves`, in two columns of consecutive bands (the instrument's right column, the next band's left two thirds); no third (Q4 answer A: the team rows are steppers, the opening bill is rows, no phase bar). THE THREE LOUD MOMENTS: `01 answer` LIT, `05 moves` LIT, the third NO HONEST CANDIDATE (`calculator-view.tsx` LOUD_SEATS). THE DOORS: the page draws none; every trade page's close carries "Run your own numbers" to it (8.6 `15 close`). A block with nothing to draw is not drawn, and the zones close up so no two lone zones stand together. Gates: `calc-engine`, `calc-defaults`, `calc-api`, `calc-display`, `calc-page`, `calc-state`, `calc-door`, and every render law over `calculator-gb-london-restaurants`.
```

## CI reds met after Task 7, and their fixes

- canonical-urls (on 254f56f8): the route's source named no `alternates` once its metadata moved to seo.ts; generateMetadata now spreads
  calculatorMetadata and says `alternates: { canonical: "/calculator" }` itself (e17872c8). canonical-urls and calc-state pass.

## Task 9, verification (no code but the fixes it found)

- Renders, one at a time, each exit 0 (`scratchpad/calc/after/`): calculator gb london restaurants (the chain's), de berlin restaurants, gb
  manchester barbershops, gb anywhere restaurants. Plain copy on the three ad hoc views: 0 reds at 1280 and 375 (anywhere in the UK draws
  six cards: no fit-out without a city and no archetype on a UK page without a city index, so the money to open it is not drawn, as the
  plan's rule says).
- Photographs read (full page; `scratchpad/calc/shots/full-*.jpeg`): London at 375, 768 and 1280 (the answer above the levers on a phone;
  from 1024 the levers left of the answer, the margin and the month; no sideways scroll at any width, scrollWidth equal to the viewport),
  Berlin at 375, 768 and 1280, Manchester barbershops at 375 and 1280; the London levers card and answer section at 375, 768 and 1280.
  - London, by hand against the page: £556,017.36 a year, £46,334.78 a month, printed $61,463 in dollars (x 1.3265) and £46,335 after the
    currency event; a day $2,021; firms above it 32%; margin 4.4%, after tax 3.8%; fixed costs $39,336 a month; the month's profit $2,931.
  - Berlin: $1,095,484.12 a year, printed $91,290 a month; margin, month and payback show "Type your sales to see this."; no rates line.
    The photograph showed the loan's interest rate as 0: the profiles' `bank_lending_rate_pct` holds a fraction (0.045), the lever and the
    engine take a percent. Fixed with a defaults check first (red at 0.045, green at 4.5), ff9e65b7.
  - Manchester barbershops (England's rows off the model): a loss printed as losses with the true minus (margin −50.7%, month −$6,856),
    "No payback while the month runs at a loss.", business rates $0 (full small business relief at a rateable value of £9,576), the
    fallback lines "Manchester holds none. This is England's.", no staff line.
- Not run, and why: the local production build (`npm run verify:deploy -- --build`) and the browser probe against `npm run start`. The build
  and its typecheck need a 4 GB heap and the laptop held 300 to 1,200 MB free beside three agents; the controller's note says heavy checks go
  to GitHub. What the probe would have watched is held instead by: the state test (the address, clamps, noindex, replaceState wiring), the
  page test mounted in jsdom (a currency change redraws and writes nothing), the api test (404, the place switch's body), the door test and
  the London trade render (four doors), and the photographs above. The production probe waits for his deploy word in any case.

## The last code push's GitHub check (ff9e65b7, run 38614817535)

- Typecheck: exit 0 (the full `tsc --noEmit -p .`).
- Chain: 296 gates, 285 pass, 11 red, every one red on the base too: harness-page-laws, fact-once, harness-laws, harness-links, provenance
  (cell pages, database fallbacks), type-floor (rhythm's), art-direction (rhythm on other pages), home-answers, uk-city-sources,
  harness-archetypes TIMEOUT, money-shown-own-rows TIMEOUT. census-fresh, red on the base, is green here (regenerated in Task 4B).
- The calculator's own lines there: page laws 0 at 1280, 768 and 375; links 2 of floor 2; provenance 51 of 51 stamped; art direction 0;
  gathered emptiness 0; its one finding is FIGURE FACE on `#page`, the CI runner drawing without the figure face, as on every page (the
  controller's known CI-only red; the model-laws ratchet counts it 1 over 0 there, 0 on the laptop where the face loads).
- Every calc gate green: calc-engine, calc-defaults, calc-api, calc-display, calc-page, calc-state, calc-door.
- Commits after it change only this report.

## Open items

1. THE SIGNAL (the country plan's) is not on the page. When country-page-journey lands: the plan's Task 4B Step 3 (the two measures in
   owner_direction.ts, signalStateOfShare and signalForShare in signal.ts, the WANT line), the firms row's `placed`/`signal`/`noSignal` and
   SignalKey in AnswerSection, the same on MarginSection's Focal, and the plan's four signal checks back in tests/simulator/page.test.ts.
2. AN OWNER'S SEAT NAMED IN BRACKETS IS PAID AS STAFF. Reading 7 takes a role whose name begins "Owner" as the owner's seat; barbershops'
   "Barber (owner-operator)" does not begin so, stands at 1 head with pay, and Manchester barbershops print a 50.7% loss partly for it. A
   ruling on the rule (match "owner" anywhere in the role?) is his.
3. fact-once, type-floor and line-rule read only the five spine surfaces on this base; the calculator's render is outside them. Whether they
   should read it is the rhythm plan's call.
4. Not run locally: the production build and the browser probe (memory); the production probe waits for his deploy word.
5. MODEL.md (the parent repo): the text above for the controller to apply.
6. Layout decisions taken to clear render laws, for review: the answer and the margin side by side from 768; the money to open it at three
   fifths from 1024; the levers' card the page's one prose section and the sources' facts short; the month's basis at the end of the
   switch's tab row (Switch's optional `aside`, unchanged for its other caller, the country page).
7. Commit hygiene: a237fc59 holds the defaults' city guard and Task 4C's first part; Task 7 landed in two commits (24222f29, 254f56f8).
   No amend or reset was used to tidy them.
8. Shared files touched (for the merge): copy.ts (COPY.calculator, tradeClose.runDoor), provenance.ts (StampKind), check_provenance.mjs,
   london.ts, door_kinds.ts, RankedBars (level), zones.tsx (STACKED exported), NoteList and locals_rows (note_shape.ts), Range, Switch,
   Terminus, exit.tsx, cell-view.tsx, stories.tsx, close_rows.ts, middleware.ts, loud_seats.ts, the bar budget and four source lists,
   verify_doors, verify_archetype_copy, verify_launch_ready, verify_art_direction, check_model_laws, check_page_links, render_page,
   pages.json, page_foot.test.ts, the provenance and model-laws baselines (one calculator line each), the type and width baselines (the two
   calculator files out), floor_census.json, coverage_exceptions.json, CENSUS.md, gates.json, CLAUDE.md, GUIDELINES.md.
9. parallel-base has moved to 5e11c768 (the runner installs the fonts); not merged here without a word, so CI still draws without the figure face.

## Fix round 1 (the final review, .superpowers/sdd/cost-simulator-final-review.md, with the controller's rulings)

Each fix test first where a test could see it, one commit each:

- C1 (5036c823): a role naming the owner anywhere (`/\bowner\b/i`) is the owner's seat, one head fewer (`Math.max(0, headcount - 1)`).
  The defaults test holds all 119 such roles across the offered trades in Berlin and barbershops' "Barber (owner-operator)" at 0 (red
  first: 1 unmarked).
- I1 (7460d6cb): off the recipes the cost of goods is the shard's own goods or supplies driver (`cost_structure.cost_drivers`, names such as
  "Materials and parts", "Cost of goods sold", "Ingredients and packaging"; a name that mixes in pay or overhead is not one); 90 trades take
  it. 1 - gross margin only where no such driver exists, its line now "What the gross margin leaves, which may include direct labour."
  Plumbers in Berlin: goods 20% (was 60%), break-even $495,533 a year (was $1,294,781). Red first: plumbers read 0.6.
- I2 (f609b772): the owner's pay outside a city defaults to the country's median pay (`countryMedianPay`, the team's own), never
  country_metrics' GDP share ladder; the line reads "The country's median pay."; the no-fill sweep reds an owner's stamp on country_metrics
  (red first on Afghanistan, every trade).
- I3 (075248b6): the address keeps four decimals; a round trip of goods 0.325 and employer charges 0.195 (red first: 0.33 and 0.2).
- M1 (ca2a7640): "Past a £500,000 rateable value, rates take a higher rule."
- M2 (088b37d3): the answer is the page's one polite live region; `live` off the four section figures and the effect line.
- M3 (d3ecf55c): the firms' note says "Local firms of the trade" on a trusted cell's tenths, "Registered firms in the place" on the
  register's bands; the page test holds both (red first).
- M4 (b40cc16d): a dollar place shown in pounds takes fx.ts's pound rate (1 / 1.3265), the one a UK figure's dollars take; the display test
  holds it both ways (red first at 743.5).
- M5 (9228f92d): London at the anchor with a 40,000 loan at 7.5% over five years and 300,000 to open, by hand: 9,618.24 a year in F, profit
  16,892.81, the year's principal 6,850.55 taxed, 13,987.74 after tax, 258 months to pay back. The engine already held it (green on first
  run).
- M6 (8ddfacf1): the bare /calculator in the upper sitemap; data-pack, sitemap-no-redirects, junk-url-rule, metadata-routes, indexable,
  sitemap-families and layering pass.
- Merged origin/parallel-base 5e11c768 (the runner's fonts) as 9af8a1a4.

Manchester barbershops at their defaults (the register's mean sales £122,356.94): before the round, margin −50.7% before and after tax
(F £159,910.29, the owner-barber paid as staff); after C1, −20.8% (F £123,325.90, the barber's seat at 0, break-even £154,157.38); after I1
unchanged at −20.8%, since barbershops take their goods from the UK recipe's supplies line (8%), which already left the commission out.

Local checks: calc-engine, calc-defaults, calc-api, calc-display, calc-page, calc-state, archetype-copy, uk-open-permits, counts-fresh
pass. Not re-rendered locally (memory); the check run renders.

The check run on 9af8a1a4 (38648069793): typecheck exit 0; chain 285 of 296, the same 11 base reds as before (harness-page-laws, fact-once,
harness-laws, harness-links, provenance, type-floor, art-direction, home-answers, uk-city-sources, harness-archetypes and
money-shown-own-rows timeouts). The calculator there: page laws 0, links 2 of 2, provenance 51 of 51, art direction 0, its one finding
FIGURE FACE (the runner still draws without the face after the merge).

