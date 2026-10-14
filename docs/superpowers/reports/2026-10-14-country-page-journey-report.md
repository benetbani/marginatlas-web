# Country page journey, the build report (plan 2026-10-13 country-page-journey)

Branch `country-journey`, from `origin/parallel-base` (55a03e07, fast-forwarded to 7c92b4af on the controller's word for the check
server's Supabase URL). Built in a worktree on the owner's 8 GB laptop beside three other agents (not the cloud machine the dispatch
assumed): every render, browser run and chain run waited for free memory (`scratchpad/journey/waitmem.sh`, 700 to 900 MB), one browser at a
time; the full chain and the full typecheck ran on GitHub at each push. This report is appended as each task lands.

## Standing conditions

- **Renders** use the controller's placeholder Supabase URL (`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`), as the check server
  does, so database figures fall back. Known reds of that environment, not this plan's: provenance on the two London trade pages (51 vs 48,
  124 vs 123), home-answers (the London restaurant page's figures), the closed-reading ROW SENTENCE and FOCAL rows on the city, trade,
  industry and hood pages, type-floor on every page (rhythm Task 3), art-direction D3 on country-gb-new, country-AF, the thin trade and
  the industry page (rhythm Task 6), census-fresh and uk-city-sources (rhythm).
- **The chain is red by design** from Task 1B to Task 4/5: country-slots, answer-type, signal-marks and paywall-shape are written red on
  today's page and turn when the page is composed from the slots.
- **The check server's output**: `gh run view --log-failed` shows the Gate chain step's exit only (the chain writes to chain.txt, an
  artifact); I did not download artifacts (a download needs the owner's word), so the chain's per-gate detail comes from local runs. The
  Typecheck step's result is read from the run each push.
- **Parent repo**: the dispatch says E:/atlas is absent; on this laptop it exists, but I followed the dispatch: no parent-repo file was
  edited (Task 7's MODEL.md and FOUNDER-VERDICTS.md texts are at the end of this report for the controller).

## Task 0: the ground and the before

- State check (Step 2): rhythm 2A, 2B and 2C are on the base (Focal and Basis in the kit, `mb-6 data-rail`, fact-once, type-floor,
  spacing-pin, zone-rhythm, spine_scan, zone_rhythm); rhythm 3 to 6 and the home plan are not (the board still holds `llc-days`, `llc-cost`
  and `hiring`; FactRows, HeroBoard and WorldRange still draw `<Ico>` tiles; no `tiles-openers`, `home-*` gates). The dispatch says those
  branches land in parallel, so the plan went on; where a task assumed their state, the deviation is named in that task.
- Before renders (country GB, AF, KH, DE) and measures (`scratchpad/journey/before/measure.txt`):
  - GB: 30 blocks, all first read; 16 lists, 10 mixing value classes (take, entry-bill, from-abroad, hiring, employment, lease-by-law,
    paperwork, banking, if-it-fails); 35 of 94 values hold a unit; 6 level marks, 0 signals, 0 seats, 0 "Not known yet".
  - KH: 15 blocks; 1 list (take) mixing; 4 of 6 values hold a unit; 8 level marks; 3 seats; "Not known yet" once.
  - AF: 15 blocks; 1 list mixing; 3 of 5; 6 level marks; 5 seats; "Not known yet" once.
  - DE: 15 blocks; 2 lists, 1 mixing; 4 of 8; 8 level marks; 2 seats; 0.
  - Slots: none on all four.
- Lending rate (Reading 5): seven values are shared by five or more countries (0.2496, 0.0807, 0.043 six times each; 0.2982, 0.2495,
  0.0806, 0.052 five times each). No fill rule added.
- Before browser checks over the four (`scratchpad/journey/before/`): page laws 3 reds (KH 2 LONE FIGURE, AF 1 LONE FIGURE; KH had no
  entry); page holes 0; model laws 3 (AF, DE running-costs FOCAL, KH 1); plain copy 0; readability 0; paywall-shape PASS. The archetype
  harness hung on its sheet's photograph (the browser could not capture the sheet under memory pressure) and was stopped; its before is the
  check server's run of the Task 1A push (no page change).
- Before photographs: not taken on this machine before the build (memory); see Task 8.

## Task 1A: the slot model as data (1fd7344a)

- `src/lib/spine/country_slots.ts`: the spec's sixteen slots and the ruled **5b "What trades keep" (SHARE)** after slot 5 (Q1), seventeen
  rows; `n` is the page order, `num` the spec's number ("5b"); 5b's id and DOM id `margins`, icon `margin` (slot 5 keeps `owner-keeps`).
- `src/lib/spine/owner_direction.ts`: the spec's table row for row; **admin ease `higher`** with his reading's date (Q3), the cost of
  living `none`.
- `COPY.journey` as the plan writes it, plus `slots.margins`.
- Test `tests/spine/country_model.test.ts` (gate `country-model`), adapted to seventeen slots and Q3: red (no module), then PASS.
- Gates: country-model, counts-fresh, gate-conflicts, no-em-dashes, no-source-agencies, copy-no-method-words PASS.

## Task 1B: the replicability gate (f710e543)

- `tests/spine/country_slots.test.ts` (gate `country-slots`); KH and DE join `scripts/harness/pages.json`.
- Deviation: the expected sets carry Q1's 5b: GB draws every slot but `margins` (its trade margins are neither sourced nor marked, so
  London's sales stand); DE's set holds `margins` after `spend`, marked OPTIONAL in the test because the margins come from the seed's live
  rows, which a render without the database cannot reach (the blind spot is said in the header).
- Red on today's pages as planned: ORDER, TYPE, MASTHEAD on all four, NO SEAT on KH, AF, DE, INDEX on GB ("dead: exit").
- First measurements seeded (never a raise): model laws KH 1, DE 1 (the gate's own seeding); page laws KH 2 (`--write-baseline` over the
  two files alone); provenance KH 44, DE 103; section bands KH 1, DE 2 and art direction KH (prose, accents, frontRepeat 1 each) and DE
  (prose, accents, rhythm, frontRepeat 1 each) by hand with a `_reseed_history` record each, because those gates' `--write-baseline`
  rewrites every page and would have raised the rhythm branch's D3 counts.
- Laws red on KH and DE today (the rebuild's): type-floor (KH 22.8%, DE 24.1%), and the before reds above.
- CENSUS not rewritten: Task 1B adds no section, and a rewrite would have carried the rhythm branch's census-fresh fix and my untracked
  slot files.

## Task 1C: the answer-type gate (1269b88d)

- `scripts/lib/answer_type.mjs`, `scripts/harness/check_answer_type.mjs`, `tests/spine/answer_type.test.ts` (gates `answer-type`,
  `answer-type-reader`).
- Deviations: (1) the date reading ends a year at its last digit, not at a word boundary (a row's text runs its cells together, "1 Apr
  2026Minimum wage"); found by the fixture going red. (2) `data-answer="1"`, the page's answer marker on AnswerCard, HeroBoard,
  IncomeBreakdown and MarkList, is not read as a list; and the two readers of that marker were narrowed to `[data-answer="1"]`
  (check_page_laws.mjs GLOSS, check_archetypes.mjs's answer size), since a slot's `data-answer` type would otherwise read as the page's
  answer (a gloss beside slot 6's title would red GLOSS). A fixture holds the marker apart.
- Red on today's renders as planned: UNDECLARED on every list (GB 16, AF 1, KH 1, DE 2) and "read no list" on each.

## Task 1D: the mark rule (08ce7aae)

- `tests/spine/signal_marks.test.ts` (gate `signal-marks`): red on READ on all four, as planned.

## Task 1E: the opened reading (b4107324)

- `scripts/lib/open_panels.mjs`, `scripts/harness/check_panels_opened.mjs` (gate `panels-opened`, browser), the seven checks, measure_pages
  (`opened`), page_renders (`HARNESS_PAGES_LIST`), KIND ADJACENT on zones.
- Red first: eight planted faults unreported. Deviation in a plant: the full-width plant read full width closed (a block title's and the
  summary's text boxes span the card), so its title and summary stand inline. Then eight PASS.
- Deviation: check_page_holes runs the opened reading after its photographs, so `--shots` keeps showing the page as it arrives; the whole
  zone block of the page laws (zone tones, pad, split and open section) is read closed.
- The opened pass over every render (Review Focus 4), new reds against the closed reading:
  - industry-restaurants #open: ROW SENTENCE on four licence names (the known case). **Fixed at source**: a licence whose shard name runs
    past three words takes its kind from a closed list (`COPY.industryOpen.detail.kinds`, read by words in industry_open_rows.ts) as its
    label, its name as the row's note; over every shard 800 of 952 rows relabelled, 26 to "Other requirement". The licence-jurisdiction
    gate now reads a long name in the note. Rerun: the four reds gone.
  - **cell-gb-london-barbershops@768 #split: WHITE SPACE 375x120 inside a 720x327 card (panels open). For the controller** (a hole on a
    trade page; no baseline touched). harness-page-filter is red on it until it is resolved.
  - Country pages (the rebuild's): GB #changes LABEL GAP x10 and #entry-bill ROW SENTENCE x3 (panels open); DE #take ROW SENTENCE "Tax on
    company profit" (panels open); KIND ADJACENT on AF, KH and DE (the two spectra tables on one zone).
  - Art direction, full width, gathered emptiness: nothing new.

## Task 1F: the paywall on slots (8010d1a6)

- check_paywall reads the country page's slots as its levels; levels test gains the slots' cases (and one for 5b). Red on today's locked
  page as planned ("draws no slot", "no level locks").

## Task 2: the signal (cc85a626)

- signal.ts, signal/tokens.ts, signal/Signal.tsx; the palette gate's one named allowlist; the world track's reference a tick; STATE in the
  mark rule. Red first (the allowlist and the tick); PASS after GB's re-render. Plant `#2e7d32` in signal.ts: the palette gate reds the
  file (exit 1); removed: PASS. palette-membership, no-hardcoded-hex, token-steps, world-range-no-median PASS.

## Task 3A: the shared pieces (911cd79e)

- DetailPanel's answer fold, FactRows `answer`/`placed`/`signal`, the kit Focal's signal, ShareBar and BarList stamps, slots/types.ts,
  country/Slot.tsx. Test `answer_fold` (gate `answer-fold`): red, then PASS. Scoped typecheck 0.
- Deviations: BarList's figure is stamped through a `display: contents` wrapper (the Fig is the subgrid's item); the "unchanged panel"
  check reads "no fold stamp, no answer type" instead of the plus's markup order.
- home-answers red locally on the London restaurant render (database fallback, not this task).

## Task 3B: stage 1, the masthead (3f6ff730)

- hero_board.ts: slot 1's thin state (the company rate under its own label), every row placed with its measure, the signal where the
  measure has a direction, units in labels, Hiring staff gone, the living cost on the board (KH yes, AF none, GB none), the director's
  loan charge in the UK's other taxes. HeroBoard `slotted`. StageOrient.tsx. hero_rows test's two labels.
- Deviations: (1) the board's `llc-days` and `llc-cost` rows are still on the base (rhythm Task 4 has not landed), so they are placed rows
  too ("Days to register", "Cost to register", measures register-days and register-cost, both directed); rhythm's removal wins at merge.
  (2) admin ease carries its signal (Q3 ruling). (3) `COPY.heroBoard.taxNotes.companyTax` is "Company profit tax" (three words; the
  opened pass's ROW SENTENCE on DE's fold). (4) The render tests set `globalThis.React` (CountryFlag and the city cards lean on Next's
  automatic runtime), as the render spikes do.
- slots-orient, hero-rows, home-forms, countries-disclosure, signal PASS; scoped typecheck 0.

## Task 3C: stage 2, the market (a090b455)

- slots/market.ts, StageMarket.tsx; **5b built** (`buildMarginsSlot`: the margin card, founder ruling 6's vertical bars, the middle
  trade's margin at 30, never on the UK) with RankedBars taking the slot's stamps (`stamp`). Test `slots_market` adapted to Q1.
- Cities past the row (all hold a pay of their own): GB Glasgow, Bristol, Edinburgh; DE Berlin, Cologne, Düsseldorf, Leipzig; KH none;
  AF none.
- slots-market PASS; scoped typecheck 0. Check server on this push: Typecheck PASS, Gate chain red (the planned reds).

## Task 3D: stage 3, to open (0f297011)

- slots/open.ts, StageOpen.tsx, a slot's gloss, licences' short labels, from_abroad years. Red (no copy), then PASS.
- Step labels over every shard: 616 rows; Bank account 143, Tax number 131, Registration 110, Name check 96, Notary 49, Licence 31,
  Other step 25 (4%, under a tenth, so no word joins STEP_WORDS), Social insurance 13, Sales tax 10, Company seal 8. The "Other step" notes
  are deposits of share capital, articles and statutes, e-signatures and one-stop filings (AZ, BG, CG, CH, CI, DK, EE, FR, GM, GT, ID, IE,
  IL, IN, IS, MA, ME, MN, MT).
- slots-open, slots-market, slots-orient, answer-fold, home-forms PASS; scoped typecheck 0.

## Task 3E: stage 4, slot 7 and the dated row (5a8b4113)

- slots/dated.ts, slots/hire.ts, StageHire.tsx (HireCost moved from country-view.tsx unchanged; the view imports it until Task 4,
  byte-exact edit: CRLF 1965 to 1908 lines, the two stray CRs kept), changeAround / ruleRaw / ruleRow in country_rules.ts, SlotRow.change,
  Slot's `after`. Red (no copy), then PASS, including Review Focus 3 (the minimum wage on 31 Mar and 1 Apr 2026; unfair dismissal 24 with
  "6 months from 1 Jan 2027" on 31 Dec 2026, 6 with "since 1 Jan 2027" the next day).
- Deviation: the UK's employer rate is dated as its share alone ("15%"), its threshold in the note ("on pay over £5,000 a year", from the
  rules file's employer-ni-threshold), because "15% over £5,000" read as money in a share list (the answer-type gate found it).
- slots-hire, slots-open, answer-fold, interact PASS; scoped typecheck 0 (with country-view.tsx).

## Task 3F: stage 4, slots 8 to 11 (8f725d62)

- slots/run.ts, StageRun.tsx, CompareTable `stamp`. Red (no copy), then PASS.
- Deviation: the lease's fact rows carry node values, so run.ts reads them as text (the scoped typecheck found it).
- Peers' electricity names (Step 8): GB France, Netherlands, Germany, Ireland; DE Poland, France, Netherlands, Austria; none over three
  words.
- slots-run, slots-hire, signal, answer-fold, world-range-no-median PASS; scoped typecheck 0.

## Task 3G: stage 5 (dd5b3703)

- slots/last.ts, StageLast.tsx, worldExitHighs. Red (no copy), then PASS: KH 8 to 18 months, AF 12 to 36, DE 8 to 14, each placed with
  its signal; the UK's failure law by type (four times, costs, reach), the director's loan charge left for slot 1.
- slots-last, slots-run, placeholder-never-printed PASS; scoped typecheck 0.

## Task 3H: stages 6 and 7 (f410fe5a)

- slots/rules.ts, StageRules.tsx, DatedChanges declaring a dated pair, UNDATED. Red, then PASS.
- Coverage read before the map was written: on 2026-10-13 and on the run's day the undated coming or recent changes were
  tribunal-time-limit, unfair-dismissal-cap-2027, digital-tax-records-2027 and -2028, none printed on a country row; the map holds the
  plan's seven entries (every one a ledger key, each with its reason).
- The UK's slot 15: 4 coming, 35 in force, 6 shown (Q6, answer A: the run keeps its own continuation).
- slots-rules and the other stage gates, doors PASS; scoped typecheck 0.

## Task 4: the view composed from the slots (fe34a6ce, efbe2bad)

- country-view.tsx rewritten (CRLF kept byte-exact; the index blob written with `git hash-object --no-filters` and `update-index
  --cacheinfo`, because a plain add normalised the git `-text` file to LF): every country drawn from `planCountry` in the journey's order,
  zones from `composeZones(plan.drawn)` (pairs only inside a stage, Q4 A: a chapter's opening zone starts D3 afresh), the rail from the
  slots drawn, slot 5b (the margins) from the route's money rows, the loud seats (00 take, 07 hire, 05 trades held).
- Renders: GB 15 blocks over 16 slots, KH 10 over 11, AF 10 over 11, DE 11 over 12 (the masthead is one block holding slots 1 and 2).
  country-slots, answer-type, signal-marks PASS on the four.
- The country floor (Step 11): `FLOOR_BY_SURFACE.country` 13 to 10, Afghanistan's measured count. Floor census over 194 countries,
  before [[13,3],[14,1],[15,190]], now [[9,5],[10,140],[11,49]].
- **Q5, for the owner (not decided here)**: five country pages that met the old floor fall under the new one and would stop indexing:
  /cu 15 to 9 (no hire slot, no wage floor on file), /lk 14 to 9 (no spend), /mo, /nr, /to 13 to 9 (no dealings). The plan says this goes
  to the owner before Task 5; per the dispatch I recorded it and went on, because the locks (Task 5) do not touch the floor. Each of the five
  draws ten slots in nine blocks (`scratchpad/journey/t4-nine.txt`).
- Deviations: slot 5b (Q1) in the plan's sixteen as a seventeenth (`num: "5b"`); the customers' pay stamped with its profile fields; the
  HeroBoard's `data-value` after its class (the fact-once reader's pattern); page_foot's list gained /kh and /de; firms_last, duel and
  focal_values read the slots; baselines seeded for the new pages and lowered where they fell (provenance GB 274, AF 12, KH 29, DE 94).
- The browser checks after compose found my faults, fixed at source in efbe2bad:
  - ALIGNMENT on every fold at 1280: the fold's plus was centred in a fixed box; it now sits in its own box, as the kit's plus.
  - TAP SIZE at 375 (panels open): a linked fold row (cities, trades) was an 18px link; the link now takes the row 44 tall.
  - ROW SENTENCE on four-word fold heads: the head carried `data-label`; it is now `data-fold-head` (the answer-type reader and both tests
    follow), a head and not a row's label.
  - LABEL GAP on the UK's rule changes (panels open): "2.5% over Bank Rate to 4% over Bank Rate" widened the values' column; what a rate
    sits over is now said once, on the right, as the period is.
  - FOCAL on the customers slot: the city cards' names (20, the heading rung) under the slot's 30. **A reading change for the controller
    to confirm**: `check_model_laws.mjs` leaves `[data-city-name]` out of the "between 16 and 30" reading, as it leaves the zone title out
    (a name is words; a figure on a city card is still read).
  - WHITE SPACE at 768 on seven thin lone slots (KH, AF, DE credit and exit, AF open): a thin slot of one figure stamps `data-lean`, and
    zones.tsx's lone level gives a lean section the left half from 768 (the kit Band's own half), the left third from 1024 as before.
    Blind spot found and stated: page holes judges only the largest-area blank, so the same air at 1280 read clean (a wide shallow blank hid
    the tall one); the photographs at 768 and 1280 showed the two equal.
  - WHITE SPACE on the UK masthead (panels open): the other taxes open under the answer and the rows column stood over 366 by 210 of
    nothing; on the country's board the rows share the column's height (closed, nothing moves; photographed at 1280).
  - Line rule (rhythm's gate): a fold or the hire lever straight under a figure's block added its margin to the block's (48 and 44); a fold
    there now stands 12 below the block and the lever 24; the spend's bar lost its 4px (28 to 24).
  - Art direction E1 and F1 on the UK (panels open): the hire slot held 426 characters of notes, the running costs 284; the notes behind
    their pluses are labels now (for example "Redundancy and notice, at 35", "to end a protected lease", "for 33 weeks, or 90% if lower" in
    data/sections/rules.json); a fold note's figures are tabular.
- Checks after efbe2bad, on renders made with the placeholder URL: page laws 1 red (AF's customers LONE FIGURE, the plan's thin form "the
  national typical alone", the same red as before the plan, held at AF's baseline 1); model laws 0; page holes 0; plain copy 0; readability
  0; line-rule, panels-opened, section-bands, loud-seats, gathered-emptiness, fullwidth-sitewide, form-variety PASS; 35 light gates PASS
  (slots, answer type, fold, zones, hire, lease, uk-sources, spacing, layering, counts-fresh among them); art direction grew only on the
  barbershops page (D3, rhythm's); fact-once reds only on the industry and hood renders (no country finding). Baselines lowered to the
  measures: page laws KH 2 to 0; model laws AF, KH, DE 1 to 0; art direction KH frontRepeat, DE rhythm, DE frontRepeat 1 to 0; section
  bands AF 2 to 1. Scoped typecheck 0.
- Photographs read: KH #credit at 768 and 1280 before and after the lean rule (the half from 768 holds the figure, its words and the
  track with no air beside them); the UK masthead at 1280 after the rows rule.
- Not done here: `docs/loop/CENSUS.md` (census-fresh is a known red of the base, and a rewrite would carry the rhythm branch's sections).

## Check server catch-up (8d7f91b8)

- The check server's typecheck had been red since the 3E to 3H push (it passed at 3C). Its output goes to an artifact I do not download,
  so I typechecked locally in two scoped halves (every test and script this branch changed or that imports a changed module; every other
  importer of the changed modules): one error, `tests/spine/slots_open.test.ts` (TS2345, an `as const` closed list asked to include a
  string). Fixed; both halves 0.

## Task 5: the locks follow the slots (4d987124)

- slots/locks.ts (`SLOT_STAND_IN`, `lockedSlots` over lockedLevelKeys: stages 1 and 7 outside, each of 2 to 6 a chapter), LockedSection
  `stamp`, the view drawing each locked slot as its LockedSection with the slot's stamps and the trades' pages as free doors after the close,
  gate `country-locks` wired after country-zones, counts regenerated.
- Red first (the view drew no lock: 2 findings), then all PASS.
- Deviations: the copy's line for the trades' slot is keyed `london-trades` (`lockLineKey`), because `COPY.locked.lines.trades` is the
  city page's line ("trades" was a duplicate key); slot 5b (margins) has its stand-in and line, as every slot that can lock does.
- Locks: the UK eight (spend, trades, running-costs, credit, filings, peers, exit, changes), Cambodia three (spend, running-costs, credit).
- paywall-shape now PASS for the UK (red since Task 1F): "country-gb: 8 locked section(s); internal links 31 open, 32 locked (0 lost)".
  country-locks, paywall-levels, paywall-flag, locked-data, country-zones, doors, counts-fresh PASS; scoped typecheck 0.
