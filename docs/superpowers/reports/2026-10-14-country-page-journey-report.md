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
