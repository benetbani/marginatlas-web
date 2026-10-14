# Country page, the journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every country page answers the visitor's journey in the same sixteen slots and seven stages, each slot one answer type, its depth one tap down inside the slot it deepens, every placed figure with an owner direction carrying one triangle, the phone reading one column in stage order.

**Architecture:** Checks first, each red on today's renders: the slot model as data, a replicability gate over the renders of /gb, /kh, /af and /de, an answer-type gate that reads each list's value class, the signal's mark rule, the browser checks taught to read inside a closed plus (and KIND ADJACENT taught to read zones), the paywall's shape on slots. Then the signal (one triangle, five angles, five tokens inside its own folder, the palette gate's one named allowlist), the shared pieces (DetailPanel's answer fold, FactRows' declared type, the kit Focal's signal), one builder module per stage turning today's builders into slot models, one component per stage drawing them, and the country view rewritten to compose every country from the slot plan (zones paired only inside a stage, the index from the drawn slots, the locks per slot). Then what the fold replaces leaves with its tests, the written rules follow, and the spec's section 8 verifies the after against the before.

**Tech Stack:** Next.js 15.5 App Router, React 19 server and client components, TypeScript 5, Tailwind 3.4; tests are tsx scripts in the `check()`/`red()` style wired into `scripts/prebuild_all.ts`; jsdom for static reads of renders and of `renderToStaticMarkup` output; Playwright behind `requireBrowser` for the browser gates.

**Spec:** E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md

Research behind it, in E:/atlas/docs/superpowers/research/2026-10-13-strategic-pages/: `R5-country-page.md` (the sixteen-slot model with sources, thin states and plus contents per slot in its section 5, which the spec adopts row for row; the misplacements; the rulings it replaces) and `R6-cues.md` (the triangle, the colour contrast, the disclosure pattern, the answer types, the opener icon). Every implementer reads the spec, R5, R6, E:/atlas/website/CLAUDE.md and E:/atlas/website/.superpowers/sdd/pl-implementer-rules.md (its rules hold here with this plan's branch, `country-journey`, in place of `pre-launch-fixes`).

This plan executes after two plans already in line and on top of both: E:/atlas/docs/superpowers/plans/2026-10-12-rhythm-air-inside.md (the shared pieces' distances, the 14px floor, tiles off rows, the opener glyph, the D3 re-splits, four new gates) and E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md (the homepage). "The state this plan builds on" below says what each leaves; Task 0 checks it and stops on any difference.

## Global Constraints

The spec's rules, verbatim (sections 2 to 8):

- **The seven stages.** "1 Orient: What is this country like for a small business? 2 The market: Is there money here, and where? 3 To open: What does opening take? 4 To run: What does staying open cost? 5 To last: Will it survive, and what if it does not? 6 The rules: Which rules bind me, and what is changing? 7 Next: Where do I go from here?"
- "The market stands before the costs (a cost reads against the revenue it is set against); the rule changes stand in stage 6, each change also dated on the row it changes."
- **The answer types.** "Answer types: MONEY, SHARE, TIME, POSITION (a figure and its signal), STATE (a word from a closed list), DATED PAIR. A slot leads with one figure at 30, then rows of that same type; a list of another type goes behind the plus as its own list under its own head; units sit in the label or the column head, never in the cell, so digits share one edge. A slot without its data omits itself (no seat, no "Not known yet")."
- **The sixteen slots**, number, stage, slot, type: 1 Orient, Tax on profit, SHARE; 2 Orient, Where it stands, POSITION; 3 Market, Customers, city by city, MONEY; 4 Market, What households spend on, SHARE; 5 Market, What trades take, MONEY; 6 Open, To open (forms, the bill, steps; licences and from abroad behind the plus), MONEY and DAYS, one unit a column; 7 Run, What a hire costs (rules of employing, hiring ease and the hire lever behind the plus), MONEY; 8 Run, Running costs (premises tax, insurance behind the plus), MONEY per unit; 9 Run, Credit and card fees, SHARE; 10 Run, Filing deadlines (late penalties behind the plus), TIME; 11 Run, Against the peers, table, one unit a column; 12 Last, How many last, SHARE; 13 Last, Selling or failing (if it fails behind the plus), TIME; 14 Rules, How dealings go (the state or people, a switch), POSITION; 15 Rules, Rule changes, DATED PAIR; 16 Next, Where to next, doors. Sources, thin states and the plus of each slot are R5 section 5's table.
- "The UK's present deep sections (opening from abroad, employing people, an hour all in, the lease by law, if it fails, the job market, the locals' notes) fold behind the plus of slots 6, 7, 8 and 13; "what locals know" keeps only what no other slot prints. Slot 1's thin state is the company tax rate under its own label (198 of 198 countries), never "Not known yet"."
- **The signal, shape and place.** "One solid triangle, 16px beside a row's figure and 20px beside a 30px figure, in its own column right after the figure. Its angle carries the state: up very good, tilted up-left good, pointing left middle, down-left poor, pointing down very poor."
- **The signal's colour (his ruling).** "Dark green `#1b5e20` (7.87:1 on white), green `#2e7d32` (5.13:1), dark yellow `#8a6d00` (4.92:1), red `#c62828` (5.62:1), dark red `#7f0000` (11.04:1). Each holds 3:1 or more on every ground (WCAG 1.4.11). The palette gate takes one named allowlist for these five tokens inside the signal component only, never a raised baseline; everywhere else the palette rule holds."
- **Never colour alone.** "The angle and a word carry the state for colour-blind readers (green and red merge for about 8% of men) and screen readers: the mark's accessible label is the state word, and each page carries a one-line key."
- **Which figures carry it.** "A placed figure (the country ranked among the countries) whose measure has an owner direction. One direction table, defined once per measure, says which way is easier for an owner: fewer days, lower fees and tax, cheaper power and credit, cleaner dealing, easier hiring, more firms lasting, a shorter sale or discharge. A measure with no clear owner direction (salary, customer pay, the wage floor) carries no mark."
- **The direction table, as the spec proposes it:** "Tax on profit; employer on-cost share; cost to register; card fees; lending rate; electricity and diesel prices: lower. Days to register; time to sell a business; time to be freed after a failure; days to enforce a contract: fewer, shorter. Firms still trading at year five: more. Hiring ease; tax predictability: easier, more predictable. Bribery met in dealings; waiting time with officials: less. Customer pay; salaries; the wage floor; household spend shares; population: no mark (no single owner direction)."
- **The state.** "The placement rank among the countries holding the measure, turned by its direction, in fifths; no mark under a set of 20." "This replaces MODEL PART 6's "nothing is a judgment" and GUIDELINES' "no hue for good or bad" for the signal alone (his ruling)."
- **Depth behind "more".** "The site's existing DetailPanel (native details): the summary row shows the answer (its label, its figure, the plus at the row's end), and opening it shows 2 to 8 rows of one type in place; closed on arrival; the whole row a 44px target; no carousel, modal, drawer or jump. Every browser check that reads a section's content opens the panels first (seven skip a closed panel today: their reading is fixed in the same change, each a red first on a planted closed panel)."
- **One answer type a section.** "A new chain gate reads each row's value class and reds a list that mixes money, time, share, position or state."
- **Openers.** "The section's icon is a bare 32px Atlas glyph in terracotta, no tile, 12px before the 20px title (a `32px 1fr` grid, so a wrapped title hangs under itself); icons inside a section are grey, and never the opener's own glyph. (The rhythm branch's Task 5 lands this for every page; this page inherits it.)"
- **Vertically first.** "The stage order is the phone's one column; a desktop pair joins only two neighbouring slots of one stage."
- **Kept.** "One figure printed once, three full widths, no typed figure, a section with no data omits itself, the copy rules."
- **Paywall.** "His ruling 18 by analogy: each stage's first slot open, every later slot of the stage locked when the paywall is on; the lock order (lockedLevelKeys) follows the new slots."
- **Gates that move.** "Blueprint-conformance, the loud-seat ledger, KIND ADJACENT, form-variety, BLOCK FLOOR (the country floor follows the slots), the paywall shape; each re-baselined only by a measured fall or a ruled change, never raised to pass."
- **New gates.** "The answer-type gate; a replicability test that /gb, /kh, /af and /de draw their slots in the model's order and types (the programmatic promise); the signal's direction table read for every mark printed."
- **Verification.** "Before and after renders of /gb, /kh, /af and /de at 375 first, then 768 and 1280; photographs read; every browser check no more reds than before; the measures (first-read sections, answer-type mixes, marks per page); the chain, the build, and after his deploy word a production probe."
- **Out of scope.** "The city and trade pages (the same model in later passes), the cost simulator (its own spec), the homepage (planned), the London trade picker and the buyer layer (later projects)." The side finding (the desktop index links "Time to sell", which /gb never draws) is fixed here.

The house rules every task holds:

- Copy: headings of four words at most; twelve words a line at most; no semicolon; no em-dash; never "modelled", "withheld" or "on file"; no source-agency names; no "we". A label is a noun phrase of three words at most (ROW SENTENCE). Every user-visible string lives in `src/lib/spine/copy.ts`.
- The palette: terracotta and neutral greys, with the signal's five tokens as the one named exception inside `src/components/spine/signal/`.
- No ratchet baseline raised; lowering one to a measured value in the same commit is allowed; a new page's first measurement is recorded the way each gate records a new page, never as a raise.
- A gate never passes having read nothing: it reds on an empty scan set. A knowable scan set is checked against an independent enumeration (`scripts/lib/spine_scan.mjs` does it for the spine's source).
- The chain needs no network or secret; a browser check calls `requireBrowser`.
- The owner's never-list, verbatim: "Never: push, deploy, merge into main, force-push, --no-verify; change Stripe, Supabase, Vercel or DNS settings; apply a migration to the live database; print or copy any .env value; install or download anything (npm, pip, data files); send an email or post anywhere; rename a URL; raise a ratchet baseline; pipe a verification into a filter; run two browsers or a browser beside the chain; close my apps for memory (wait and check again). Never invent a figure, testimonial, review, logo or credential."

## Review Focus

1. **A second triangle with another meaning.** The world track's reference mark (the central bank's rate on the lending track, `WorldRange.tsx`, `data-mark="reference"`) is a small down-pointing ink triangle drawn with CSS borders, in the same slot as the lending rate's signal; a reader takes it for "very poor". Expected: the signal is the only triangle on a country page, the reference a tick. Test: Task 2, Step 1 (`tests/spine/signal.test.ts`: every triangle-shaped mark on the country renders sits inside `[data-signal]`, and the reference renders as a bar).
2. **Two drawings of one sort on neighbouring slots, unmeasured.** KIND ADJACENT (clause 64, kept on a band page by PART 10) reads levels as `main [data-band], main [data-hero]`, and no zone carries either, so on a zone page it compares the hero and nothing else; the journey order puts drawings next to each other that stood apart. Expected: two visual cards of one kind never stand on one zone or on neighbouring zones. Test: Task 1E, Step 1 (a planted page with two bar lists on neighbouring zones reds KIND ADJACENT; then every render is read).
3. **A dated row on the day the law changes.** A change shows dated on the row it changes; the page regenerates daily, and on the change's date the row must switch its value and its note together (the UK's "Unfair dismissal, months": 24 with "6 months from 1 Jan 2027" becomes 6 with "since 1 Jan 2027"), never one without the other. Expected: on any `today` a row prints the value in force and a note that agrees with the change run. Test: Task 3E, Step 1 (`datedRow` and the hire slot's rows built for `today` the day before and the day of a change in `data/sections/changes.json`); Task 3H, Step 1 holds every coming or recent change dated on its row or named as printed on none.
4. **The opened reading finding faults on pages this plan does not draw.** Once the seven checks read inside a closed plus, rows behind the city, trade, industry and home pluses are read for the first time (the industry licence names are the known case: ROW SENTENCE on four labels). Expected: every fault the opened pass finds is fixed at its source or brought to the controller; no baseline grows to hold it. Test: Task 1E, Step 6 (the opened pass over every render, each new red listed per page with its rule, before anything else in the plan builds on the checks).
5. **A thin country dropping out of the search index.** The floor census (`scripts/seo/floor_census.tsx`) counts each non-UK page's blocks against `FLOOR_BY_SURFACE` and `src/lib/seo/indexable.ts` noindexes a page under its floor (his interview answer 6). Today a thin country reaches the floor through its drawn seats; the journey drops every seat, so a country with little data can fall under the floor and leave the index. Expected: no country page that indexes today stops indexing without his word. Test: Task 4, Step 11 (the census rerun for countries, the at-floor list compared before and after, a country lost stops the plan; Q5).

## Decisions the spec leaves open (the controller asks him; the plan names, it does not decide)

- **Q1, before Task 3C: slot 5 where a country's only trade figures are net margins.** The spec types slot 5 MONEY and adopts R5's source row, which names "margin rows (22 countries, M:373)"; a net margin is a SHARE. Today 22 countries draw the margin card (the harness snapshot `data/archetypes/net_margin_snapshot.json`: AD AU AT BB BN DE GY IE IL IT JP LA LI ME NZ PH PL PT TR AE GB US; Germany is one of the four renders), and the UK draws London's sales instead. (A) slot 5 takes SHARE where its only figures are margins (one slot, its type set by the data, an exception named in the registry); (B) slot 5 stays MONEY everywhere and the net margins leave those 22 pages until a money figure for their trades exists (the spec's success line "nothing a section printed today is lost" then has one named exception); (C) slot 5 is SHARE everywhere and the UK's London sales stand behind its plus (the UK's two margins are modelled, and the UK page prints only sourced or marked figures). The plan is written for B, with A's delta in Task 3C, Step 6.
- **Q2, before Tasks 3E and 3F: the hire lever and the loan lever behind the plus.** The spec puts "the hire lever behind the plus" (slot 7) and R5 puts start-up loans behind slot 9's plus, while its section 5 makes the plus "2 to 8 rows of one type" and DetailPanel takes rows by law (no drawing behind a disclosure: `kit.tsx` InlineDisclosure's contract and the archetype checker's HIDDEN GRAPHIC). (A) the two levers stay in their slot's body under its rows, open, the plus holding rows only; (B) a plus holds one instrument (DetailPanel gains an `instrument` child, HIDDEN GRAPHIC exempts `[data-instrument]`). The plan is written for A, with B's delta in Task 3E, Step 9 (the hire lever) and Task 3F, Step 7 (the loan lever).
- **Q3, before Task 1A: two placed measures the direction table does not name.** Admin ease (the 2020 ease-of-doing-business index, a row of the board today) and the cost of living on the city scale (moving to the board, Reading 9) have no row in the table, which is his to read measure by measure. (A) a direction for each (admin ease higher is easier; the cost of living lower is easier), dated; (B) no mark on either, by the spec's rule for a measure with no owner direction named; (C) as B, and the living cost leaves the page instead of joining the board: its city scale left /gb on 2026-10-04 as a coined reading (clause 17; the country view's comment "THE PREMISES TAX IN PLACE OF THE COST-OF-LIVING SCALE"), while 104 countries print it today. The plan is written for B; A is one line each in `OWNER_DIRECTION` (Task 1A, Step 3) and a fixture in Task 2; C drops Task 3B's living row and its test check.
- **Q4, before Task 4: two single-slot stages in a row.** On every country but the UK, stage 5 draws slot 13 alone and stage 6 draws slot 14 alone, so two lone zones stand side by side, which art direction D3 reds (`scripts/lib/zone_rhythm.mjs`: "two lone neighbours are one, whichever side each stands"); the spec forbids joining slots of two stages. (A) D3 reads a stage's opening zone as a new start: a chapter head between two zones ends the comparison; (B) where two neighbouring stages each draw one slot, those two slots share one zone (amends spec section 6 for that case); (C) a lone zone alternates its side (a right-hand lone, a second left edge on the page). The plan is written for A, with B's delta in Task 4, Step 3.
- **Q5, during Task 4: the new country floor and the index it decides.** The spec: "BLOCK FLOOR (the country floor follows the slots)" and "a thin country draws its 11" (ten blocks: the masthead holds slots 1 and 2). The floor census decides indexing from that floor. Task 4 lowers `FLOOR_BY_SURFACE.country` from 13 to the thin exemplar's measured count (Afghanistan, ten expected), reruns the census and lists every country page that indexes today and would not after; such a list, if not empty, goes to him before Task 5.
- **Q6, before Task 3H: the rule changes' rest past eight rows.** Spec section 5 makes a plus "2 to 8 rows of one type"; the UK's ledger holds about thirty changes in force, so the recent run's rest is over twenty rows, and a cut by year or topic still leaves a fold over eight (April 2026 alone holds sixteen). (A) the run keeps its own continuation (DatedChanges' disclosure, the rows its run had no room for, newest first), the one named exception to the two-to-eight fold, all one type; (B) the eight newest of the rest behind one answer fold, the older changes dated only on the rows they changed and gone from the slot (the success line "nothing a section printed today is lost" then has a second named exception). The plan is written for A, with B's delta in Task 3H, Step 7.
- **During Task 1E: faults behind other pages' pluses.** A label, unit or copy fault the opened pass finds on a city, trade, industry or home page is fixed at its source in that task (the copy rules hold); any other kind goes to the controller before a baseline is touched.

## The controller's rulings on Q1 to Q6 (2026-10-13; they govern where the tasks are written for another option)

- **Q1: a seventeenth slot, 5b "What trades keep" (SHARE), in stage 2 after slot 5.** It draws where a country holds sourced net margins for its trades (the 22 of the margin snapshot, the UK only where its margins are sourced or marked), and omits itself elsewhere. Slot 5 stays MONEY everywhere. One answer type a slot, every country filling the slots it holds, and nothing a section prints today lost: neither A (a slot whose type changes with the data) nor B (22 pages losing their margins) nor C (the UK's modelled margins leading its slot). Tasks 1A (the registry gains 5b), 1B (the replicability gate reads it), 3C (5b built beside 5, B's money-only rule for slot 5 kept) and 4 (the composition) carry it.
- **Q2: A.** The hire and loan levers stand open in their slot's body under its rows; a plus holds rows only (DetailPanel takes rows by law).
- **Q3: admin ease takes a direction (higher is easier for an owner, dated 2026-10-13), the analogue of the approved table's hiring ease and tax predictability; the cost of living carries no mark (no single owner direction) and stays where Reading 9 puts it.** One line in OWNER_DIRECTION (Task 1A, Step 3) and a fixture in Task 2.
- **Q4: A.** A stage's opening zone, under its chapter head, starts a new comparison for art direction D3.
- **Q5: as written.** Any country page that indexes today and would not after goes to the owner before Task 5.
- **Q6: A.** The rule changes keep their own continuation, newest first, all one type: the one named exception to the two-to-eight fold.

## Readings the plan takes (stated, not asked)

1. Slots 1 and 2 stay inside his masthead (`HeroBoard`, his design of 2026-09-20): its answer column is slot 1, its column of placed figures slot 2; the masthead is one block (`take`) carrying two slots. The index names it once, "Tax on profit".
2. The masthead and the close stand outside the chapters, as today ("a spread does not number its cover or its back page"); stages 2 to 6 are the chapters, numbered 01 to 05 on the page, each titled by the spec's stage name: "The market", "To open", "To run", "To last", "The rules".
3. A slot is one section: its root carries `data-slot`, `data-stage` (the spec's stage number) and `data-answer` (its type); its DOM id is the registry's.
4. A POSITION row is a figure placed among the countries (`data-placed`); its signal draws where the measure has a direction and the set holds 20 or more. The spectra's rows are reads on two poles, not ranks among countries, so slot 14 carries no signal.
5. The lending rate draws wherever the profile holds it. R5's "repeated values to vet" is a data item: the file holds several values each shared by five or six countries (0.2496, 0.0807 and 0.043 six times each; Task 0 records the count), no single fill like electricity's 0.13 on 52 rows, so no fill rule is added here.
6. The paywall stays on UK pages only (his ruling 27); on the country page the slots are its levels.
7. DetailPanel's answer fold is opt-in (`type` given); every other page keeps today's panel until its own pass (spec section 9). The fold's figure is the count of its rows ("their count", R6 2.3), so no figure shown closed repeats inside it.
8. A unit word leaves the cell for the label (its last token, within three words) or, where it cannot fit, the row's note (fact rows) or readout (the board). A currency sign, pence and a magnitude (K, M) stay with the figure; "%" stays in a SHARE list.
9. Slot 8 leads with the electricity price and its placement, without a world track (R5's thin state names the figure and its placement; the lending track in slot 9 is the stage's one world track, clause 64); the peers' prices from that track stand behind slot 8's plus. The cost of living on the city scale (printed in the running costs today, where no premises rules stand) joins the board as a POSITION row with no mark.
10. Slot 4 takes the UK's form, the share bar, on every country; the ranked-bars spend form retires.
11. Slot 3 draws one row of city cards (four, or every city up to five; no pager: spec section 5 refuses a carousel and the pager pages); the cities past the row stand behind its plus as money rows that open their pages, so no city's pay prints twice.
12. A locals' note whose figure another slot prints goes; any other joins the slot whose question it answers, as a row of that slot's type.
13. Country KH and DE join `scripts/harness/pages.json`, so every gate that reads the chain's renders reads four countries, and the replicability gate reads all four.
14. "Hiring staff" leaves the board for slot 7's plus "How hiring goes", a STATE list of the shard's four hiring words (`people_pay.hiring.hire_ease`, `contract_ease`, `fire_ease`, `recruiting_depth`; KH, AF and DE hold all four).
15. Slot 7's thin state is "the wage floor and the share" (R5): where the employer's share would stand alone (no pension rows to fold with it), it rides the lead's words ("a full-time year at the minimum wage, plus 7% from the employer"); with the UK's pension minimums it heads "What the employer adds".
16. Slot 3's DOM id stays `cities`: the home's "All UK cities" door opens `/gb#cities` (tests/home/foot.test.ts), and slot 3 opens its stage, so it never locks.
17. A step of slot 6 takes a label from a closed list by the words its shard's name holds, the shard's own words its row's note; the steps draw where the legal forms table draws, as the bill's card drew them. A list headed "in days" converts weeks exactly and months at the calendar's average month (the figure `monthsOfDays` divides by); a list whose rows hold several units carries each row's unit in its label instead.
18. A row the changes ledger dates prints the value in force on the page's day and a note that agrees with the ledger: the coming value and its date, or "since" its date for 120 days (the changes slot's own recent window); an older change prints the value and no note. A rules file note that types a date gives way to the ledger's.
19. Slot 12's figure is the survival curve's own (the region lever draws it at 30), so the slot draws no second lead; slot 14's two foot figures (foreign-owned firms, born abroad) fold into "Who trades here"; slot 16 is the terminus, stamped.
20. The bill (slot 6's lead) is stamped with its own shard figure, so it reads as its own fact beside the legal forms table's government fee (fact-once's rule for two facts that print alike); the peers' electricity behind slot 8's plus are rows without doors, since that slot locks and a locked slot keeps no link a free reader would lose.

## What is true today (main c35e42a7; rhythm-air-inside 064f54df, Tasks 0 to 2A done)

Read with `git -C E:/atlas/website show rhythm-air-inside:<path>`; line numbers are 064f54df's and drift, the quoted text anchors.

- **The view.** `src/components/spine/country/country-view.tsx` (1,966 lines, git `-text`) holds two compositions. `const rich = !!(employment && insurance && financing && banking && paperwork && londonSales && costs && hasSetup && locals && cities && spendData);` picks the UK's: eighteen zones in four chapters (`const zones: Array<{ key: string; split: ZoneSplit; ...` from `{ key: "take", split: "wide", label: "The tax burden", outside: true,`), the rule changes second (`/* THE HOT STUFF FIRST (his word of 2026-10-04)`), six GB-only builders (`buildHireAllIn`, `buildLeaseByLaw`, `buildFromAbroad`, `buildIfItFails`, `buildFirmsLast`, `buildDuel`), the rail list `const sections: RailSection[] = [` with `{ id: "exit", label: COPY.countryExit.kicker, chapter: "03" },` unconditional (the dead "Time to sell" link: the UK's exit card is withheld, `country_exit_rows.ts`), the locks `const lockedZones = locked ? lockedLevelKeys(zones.map(...` and the free doors (`cityDoors`, `tradeDoors`). Every other country takes `const generalZonesAll` (nine zones, three chapters, drawn blocked seats through `seatOf(...)` and `BlockedSeat`). `export const LOUD_SEATS` names "00 take" LIT, "08 hiring" and "12 money" HELD EMPTY.
- **The masthead.** `src/lib/spine/hero_board.ts`: rows `clean`, `admin` ("Admin ease, 2020"), `llc-days`, `hiring` (the shard's word, `value: hiring, unit: "", level: null`), `salary-month`, `llc-cost`; `levelOf` thirds; `heroTaxes(iso2)` (the shard's tax list, else the profile's sales tax and company tax). `src/lib/spine/hero_facts.ts:88-90`: the answer only where `getSmbRegime` holds a regime (58 of 195). `src/components/spine/archetypes/HeroBoard.tsx`: `data-state={board.answer ? "answer" : "no-answer"}`, the no-answer branch printing `COPY.answer.absent` ("Not known yet"), the taxes plus only in the answer branch, `LevelMark` (three bars), the key `{board.levelBasis ?? COPY.heroBoard.levelBasis}` ("Marks rank the countries."). HeroBoard is also the city masthead (`city_hero_board.ts`), so its city rows keep their level marks.
- **The plus.** `src/components/spine/archetypes/DetailPanel.tsx`: rows only, under two draws nothing, `InlineDisclosure` with the plus at the start, the summary a label (`summary: string`), rows `data-detail-row` with `dt`/`dd`, every value a `Fig`.
- **The rows.** `src/components/spine/archetypes/FactRows.tsx`: every value a `Fig` (a word too), no declared type, two lists from 600px.
- **The zones.** `src/components/spine/zones.tsx`: `Zone` writes `data-zone` as `pair ? level : lone ? "lone" : "wide"`; a lone section takes the left two thirds; `ChapterHead` writes `data-chapter-head={index}` and `id="chapter-${index}"`.
- **The paywall.** `src/lib/monetization/levels.ts` `lockedLevelKeys(levels)`: membership carried forward from a chapter's tag, `outside` never locks. `scripts/harness/check_paywall.mjs` reads levels as `section[data-zone]`, a chapter opening at its head, the close outside; rule 7 compares the open and locked renders' internal links. `src/components/spine/LockedSection.tsx` `lockedBody(body, table)` keys by React key. `COPY.locked.lines` holds a line per locked section id.
- **The seven checks that skip a closed plus** (R6 2.3): `scripts/harness/check_model_laws.mjs` (`const hiddenFromSight = (el) => {`, used by ROW SENTENCE, UNIT MIX, BANNED WORDS and FIGURE FACE), `scripts/harness/check_page_holes.mjs` (`/* A CLOSED PLUS IS NOT INK (sys:closed-plus-ink, 2026-09-19).`), `scripts/harness/check_page_laws.mjs` (`const hiddenLeaf = (el) => {`), `scripts/harness/probe_page.mjs` (`/* a closed plus's hidden rows are not content`), `scripts/verify_art_direction.mjs` (`const inDeadDetails = (e) => {`), `scripts/verify_full_width_sitewide.mjs` (`function inDead(el) {`), `scripts/verify_gathered_emptiness.mjs` (`if (d && !d.open && !e.closest("summary")) continue;`). Two already open panels: `check_archetypes.mjs` (`/* THE OPENED PASS (review finding 3)`) and `check_copy_plain.mjs` (`for (const d of main.querySelectorAll("details")) { d.removeAttribute("name"); d.open = true; }`). Art direction and gathered emptiness open pages through `scripts/lib/measure_pages.mjs` `eachPageAtWidths(widths, fn)`.
- **KIND ADJACENT is blind on zones.** `check_page_laws.mjs`: `const levels = [...document.querySelectorAll("main [data-band], main [data-hero]")]` and `const levelOf = (card) => card.closest("[data-band], [data-hero]");` then `if (!la || !lb) continue;`; zones write neither attribute (`git grep -n "data-band" -- src` finds the bento root, the kit's old `Band` and `src/app/page.tsx` only), so on a zone page the rule compares nothing but the hero. This measurement cannot distinguish two bar cards on neighbouring zones from two bar cards ten zones apart.
- **Blueprint-conformance is retired.** `scripts/prebuild_all.ts`: "/* The blueprint-conformance gate (2026-08-29 to 2026-09-17) stood here." GUIDELINES.md 0.3 still names it. The replicability gate (Task 1B) is what holds a page to its model now.
- **BLOCK FLOOR.** `check_model_laws.mjs` `const FLOOR_BY_SURFACE = { country: 13, city: 16, cell: 15, industry: 11, hood: 4, howto: 7, home: 5, openings: 2 };` (the home plan may have touched the home's entry; the country's is this plan's). The floor census reads it (`scripts/seo/floor_census.tsx` writes `data/seo/floor_census.json`; `src/lib/seo/indexable.ts` noindexes a non-UK page under its floor).
- **The palette gate.** `scripts/verify_palette_membership.mjs` reads `src/components`, `src/app`, `src/styles`, `src/lib` (`.ts`, `.tsx`, `.css`), comments stripped, judges every hex by hue (`isPaletteLegal`): `#1b5e20`, `#2e7d32` and `#8a6d00` are banned, `#c62828` and `#7f0000` sit in the terracotta band and pass. `scripts/verify_hardcoded_hex.ts` reads `.tsx` under `src/app` and `src/components` only.
- **The reference triangle.** `src/components/spine/charts/WorldRange.tsx`: `data-mark="reference"` is `border-x-[5px] border-t-[6px] border-x-transparent border-t-[var(--c-ink)]` (a down triangle), and its key draws the same glyph.
- **Tests that pin today's country page:** `tests/spine/hero_rows.test.ts` (the board's labels, "Admin ease, 2020"), `tests/home/firms_last.test.ts` (FirmsLast drawn on /gb in chapter 04), `tests/home/duel.test.ts` (`id="duel"`, `href="#duel"` on the /gb render), `tests/spine/household_spend.test.ts`, `tests/spine/uk_sources.test.ts`, `tests/spine/focal_values.test.ts`, `tests/spine/world_range_no_median.test.ts`, `tests/spine/page_foot.test.ts`, `tests/monetization/levels.test.ts` (the /gb zone list); the builders' own tests (`from_abroad`, `hire_all_in`, `if_it_fails`, `lease_by_law`, `london_trade_sales`, `lasts_uk`) test builders this plan keeps.
- **The data the four countries hold** (read 2026-10-13): KH profile `corporate_income_tax_combined_pct` 0.2491, `bank_lending_rate_pct` 0.0908, `electricity_usd_per_kwh_commercial` 0.1075, no regime; AF 0.2377, 0.0861, 0.1173, no regime, no legal form; DE 0.3, 0.045, 0.22, a regime; GB 0.25, 0.0661, 0.32, the law engine's figure. The four shards hold the four hiring words. The UK's locals notes are two (`data/archetypes/locals_notes.json`): the rates relief at £12,000 (the premises rules print it) and the pension trigger at £10,000.
- **The written rules** (E:/atlas, branch p4-seam): MODEL.md PART 1 "**THE WALK, and every country page and every city page obeys it**", PART 6 "One direction always, so the same words mean the same rank on every page and nothing is a judgment.", 8.2 "**THE THIN COUNTRY, SEATED**" and "**FLOOR: 13,", 10.2 "The United Kingdom's four:", 10.7 "Every row shows at every width. A fold behind a plus was tried on 2026-10-04 and left the same day", PART 9 clause 33 and clause 63. GUIDELINES.md 0.2 "The palette is terracotta plus cool neutrals only", 0.3 "A page's block count clears its page type's floor" and "A page's rendered sections match its own blueprint's SPINE table exactly", 0.4 "One unit per column", 0.5 "A detail panel (the plus) is closed on arrival".

## The state this plan builds on (after rhythm-air-inside and home-quiet-editorial)

Task 0, Step 2 checks each by grep; any difference stops the plan and goes to the controller with the file.

- **Rhythm 2A, 2B:** `Rail` renders `<div class="mb-6" data-rail="">`; `Focal({ figure, words, placement, prov, accent, live, beside, className, wordsClassName })` and `Basis({ children, beside, className })` are exported by `src/components/spine/kit.tsx` (Focal renders `<div data-focal="1" ...>` then `<p data-focal-words="">` then `<p data-placement="">`); FactRows rows `py-4`.
- **Rhythm 3:** reader text at 14 (DetailPanel's `dt`/`dd`, FactRows' note, the board's unit at `--t-body`); `data-type-allow` keys in `scripts/harness/type_floor_allow.json`; a muted paragraph at 14 carries `data-line`, `data-basis`, `data-placement` or `data-focal-words`.
- **Rhythm 4:** the board's `llc-days` and `llc-cost` rows have left (fact-once: their home is the registering table), the board holding four rows on every country (`clean`, `admin`, `hiring`, `salary-month`); `scripts/harness/fact_once_allow.json` holds the laws Q2 named.
- **Rhythm 5, as the controller amends it to spec section 6 (this spec's openers):** the opener is a bare 32px glyph in terracotta, no tile; no row draws a tile; `tiles-openers` holds it.
- **Rhythm 6:** the D3 re-splits of /gb, /af, the industry page and the thin trade (the country's zones are rebuilt here anyway).
- **Gates added by rhythm:** `type-floor`, `type-floor-reader`, `fact-once`, `fact-once-reader`, `spacing-pin`, `zone-rhythm`, `tiles-openers`; `scripts/lib/zone_rhythm.mjs` exports `zoneRhythm(splits)` and `zoneLadder(...)`; `scripts/lib/spine_scan.mjs` exports `scanSpine()` and `SPINE_OUT`.
- **Home:** `src/components/spine/home/*` rebuilt; `spine_scan.mjs` no longer names `home/` out; `check_model_laws.mjs` `FOCAL_EXEMPT_FORMS` holds `department`; FOUNDER-VERDICTS.md ends with "## The home, quiet editorial (2026-10-13, in chat)" and his answers under it; GUIDELINES.md 0.2, 0.3 and 0.7 carry the home's rows.

## Conventions for every task

- Commands from Git Bash, each `cd /e/atlas/website && ...` (Task 7's E:/atlas files `cd /e/atlas && ...`). tsx as `node node_modules/tsx/dist/cli.mjs`, never npx. Each verification `> scratchpad/journey/<file> 2>&1; echo "exit $?" >> scratchpad/journey/<file>`, read with the Read tool, never piped.
- RENDER, one page: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx country <ISO2>`; the four: the same with `--list scripts/harness/pages.json` (it renders every listed page). Renders and browser checks one at a time, never beside the chain.
- GATES: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=<names>`; after a source change name `pages-fresh` first.
- COUNTS after a gate is added or removed (new files staged first): `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write`; `scripts/gates.json` and CLAUDE.md's generated block move, nothing else.
- CENSUS after a country block is added or removed: `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write --pages=scratchpad/journey/no-pages.md` (that path does not exist, so the script writes `docs/loop/CENSUS.md` alone and leaves the design repo's PAGES.md to the controller).
- TYPECHECK where a task changes props or types: `node -e "const f=Math.round(require('os').freemem()/1048576);console.log(f+' MB free');process.exit(f>=1150?0:1)"`; exit 0 runs `node node_modules/typescript/bin/tsc --noEmit -p .`, exit 1 a scoped config under `scratchpad/journey/` (extends `../../tsconfig.json`, `incremental: false`, `include` the files touched plus `src/types` and `next-env.d.ts`).
- `src/components/spine/country/country-view.tsx` is git `-text`: Edit-tool edits only, except Task 4, which replaces it whole and records `git ls-files --eol` before and after. Keep every other file's line endings.
- tsx injects `__name` into compiled functions, so no tsx test hands a function to `page.evaluate`: a browser rule lives in an `.mjs` file run by node, and a tsx test reads that file's source from disk (as `tests/spine/fact_once.test.ts` does).
- A gate's empty scan is a red. A comment says what the code does, no more: every comment a step writes is read against the code in that step.
- Commits: only the task's files; the message `journey:<slug>: <what> (plan 2026-10-13 country-page-journey, Task <n>)`, then a blank line and exactly `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never switch branches, rebase, reset, stash, merge or amend. Records in the design repo (QUEUE.md, STATE.md, PAGES.md) are the controller's.

## File map

| File | Task | Role |
|---|---|---|
| `scratchpad/journey/measure_country.mjs` | 0 | the before and after reading (not committed) |
| `src/lib/spine/country_slots.ts` | 1A | the slot model: stages, slots, types, ids |
| `src/lib/spine/owner_direction.ts` | 1A | the direction table |
| `tests/spine/country_model.test.ts` | 1A | the model's shape and words (gate `country-model`) |
| `tests/spine/country_slots.test.ts`, `scripts/harness/pages.json` | 1B | the replicability gate over four renders (gate `country-slots`) |
| `scripts/lib/answer_type.mjs`, `scripts/harness/check_answer_type.mjs`, `tests/spine/answer_type.test.ts` | 1C | the value classes and the gate (`answer-type`, `answer-type-reader`) |
| `tests/spine/signal_marks.test.ts` | 1D | the mark rule over the renders (gate `signal-marks`) |
| `scripts/lib/open_panels.mjs`, the seven checks, `scripts/lib/measure_pages.mjs`, `tests/spine/panels_opened.test.ts` | 1E | the opened reading (gate `panels-opened`), KIND ADJACENT on zones |
| `scripts/harness/check_paywall.mjs`, `tests/monetization/levels.test.ts` | 1F, 5 | the paywall read by slots |
| `src/lib/spine/signal.ts`, `src/components/spine/signal/tokens.ts`, `src/components/spine/signal/Signal.tsx`, `scripts/verify_palette_membership.mjs`, `src/components/spine/charts/WorldRange.tsx`, `tests/spine/signal.test.ts` | 2 | the triangle (gate `signal`) |
| `src/components/spine/archetypes/DetailPanel.tsx`, `FactRows.tsx`, `ShareBar.tsx`, `src/components/spine/charts/BarList.tsx`, `src/components/spine/kit.tsx` (Focal), `tests/spine/answer_fold.test.ts` | 3A | the fold, the declared list, the focal's signal (gate `answer-fold`) |
| `src/lib/spine/slots/types.ts` | 3A | the slot model's types and `list()` |
| `src/lib/spine/hero_board.ts`, `HeroBoard.tsx`, `src/components/spine/country/slots/StageOrient.tsx`, `tests/spine/slots_orient.test.ts` | 3B | stage 1 (gate `slots-orient`) |
| `src/lib/spine/slots/market.ts`, `src/components/spine/country/slots/StageMarket.tsx`, `tests/spine/slots_market.test.ts` | 3C | stage 2 (gate `slots-market`) |
| `src/lib/spine/slots/open.ts`, `StageOpen.tsx`, `country_licences_rows.ts`, `sections/from_abroad.ts`, `tests/spine/slots_open.test.ts` | 3D | stage 3 (gate `slots-open`) |
| `src/lib/spine/slots/dated.ts`, `src/lib/spine/slots/hire.ts`, `StageHire.tsx`, `src/lib/spine/sections/country_rules.ts`, `tests/spine/slots_hire.test.ts` | 3E | stage 4's hire, the dated row (gate `slots-hire`) |
| `src/lib/spine/slots/run.ts`, `StageRun.tsx`, `CompareTable.tsx`, `tests/spine/slots_run.test.ts` | 3F | stage 4's costs, credit, filings and peers (gate `slots-run`) |
| `src/lib/spine/slots/last.ts`, `StageLast.tsx`, `country_exit_rows.ts`, `tests/spine/slots_last.test.ts` | 3G | stage 5 (gate `slots-last`) |
| `src/lib/spine/slots/rules.ts`, `StageRules.tsx`, `DatedChanges.tsx`, `tests/spine/slots_rules.test.ts` | 3H | stages 6 and 7, the dated rows' coverage (gate `slots-rules`) |
| `src/components/spine/country/Slot.tsx` | 3A | the one slot frame |
| `src/lib/spine/slots/plan.ts`, `src/lib/spine/slots/zones.ts`, `tests/spine/country_zones.test.ts`, `country-view.tsx`, `scripts/lib/zone_rhythm.mjs`, `scripts/verify_art_direction.mjs` | 4 | the composition (gate `country-zones`) |
| `src/lib/spine/slots/locks.ts`, `src/components/spine/LockedSection.tsx`, `tests/spine/country_locks.test.ts` | 5 | the locks per slot (gate `country-locks`) |
| the retired components and their tests | 6 | what the fold replaces |
| E:/atlas `design/loop/build/briefs/MODEL.md`, `rules/FOUNDER-VERDICTS.md`; website `docs/design-system/GUIDELINES.md` | 7 | the written rules |

---

### Task 0: The ground and the before

**Files:**
- Create (scratch, never committed): `scratchpad/journey/measure_country.mjs`, `scratchpad/journey/before/*`, `scratchpad/journey/shots/*`

**Interfaces:**
- Produces: `node scratchpad/journey/measure_country.mjs <render.html> ...` (blocks and the first read, the slots drawn, lists and the lists that mix value classes, values holding a unit, level marks and signals, seats, "Not known yet"). Task 8 runs it again.

- [ ] **Step 1: The branch (the controller's).** When `home-quiet-editorial` has completed its Task 9 (its last commit; or `main`, if the controller has merged both plans): from E:/atlas/website, clean, `git switch -c country-journey`. Then `mkdir -p scratchpad/journey/before scratchpad/journey/after scratchpad/journey/shots`.

- [ ] **Step 2: The state this plan builds on, checked.** Each to its own file with the exit line:

```bash
cd /e/atlas/website && git log --oneline -120 > scratchpad/journey/t0-log.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-log.txt
cd /e/atlas/website && git grep -n "^export function Focal\|^export function Basis" -- src/components/spine/kit.tsx > scratchpad/journey/t0-focal.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-focal.txt
cd /e/atlas/website && git grep -n 'className="mb-6" data-rail=""' -- src/components/spine/kit.tsx > scratchpad/journey/t0-rail.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-rail.txt
cd /e/atlas/website && git grep -n "export function Rail" -A 30 -- src/components/spine/kit.tsx > scratchpad/journey/t0-opener.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-opener.txt
cd /e/atlas/website && git grep -n '"llc-days"\|"llc-cost"\|key: "hiring"' -- src/lib/spine/hero_board.ts > scratchpad/journey/t0-board.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-board.txt
cd /e/atlas/website && git grep -n "<Ico" -- src/components/spine/archetypes/HeroBoard.tsx src/components/spine/archetypes/FactRows.tsx src/components/spine/charts/WorldRange.tsx > scratchpad/journey/t0-tiles.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-tiles.txt
cd /e/atlas/website && git grep -n 'name: "\(type-floor\|type-floor-reader\|fact-once\|fact-once-reader\|spacing-pin\|zone-rhythm\|tiles-openers\|home-contents\|home-band\|home-no-counts\)"' -- scripts/prebuild_all.ts > scratchpad/journey/t0-gates.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-gates.txt
cd /e/atlas/website && git grep -n "export function zoneRhythm\|export function scanSpine" -- scripts/lib > scratchpad/journey/t0-libs.txt 2>&1; echo "exit $?" >> scratchpad/journey/t0-libs.txt
cd /e/atlas && grep -n "^## The home, quiet editorial (2026-10-13, in chat)" rules/FOUNDER-VERDICTS.md > website/scratchpad/journey/t0-verdicts.txt 2>&1; echo "exit $?" >> website/scratchpad/journey/t0-verdicts.txt
```

Expected: the log holds the rhythm commits through `docs:rhythm-gates` and the home's through its Task 8; focal two hits; rail one hit; the opener's Rail draws a bare glyph (no `Ico` tile: the controller's amendment of rhythm Task 5 to spec section 6) at 32px beside the title in a `32px 1fr` grid; board: `"llc-days"` and `"llc-cost"` no hit (rhythm Task 4 took them off; where that plan's Q2 kept one, the hit is the row his answer kept and the report names it), `key: "hiring"` one hit; tiles no hit (exit 1 is the expected answer); gates ten hits; libs two; verdicts one. Any other answer stops the plan and goes to the controller with the file: this plan inherits the opener and the board's rows, it does not build them.

- [ ] **Step 3: Write the reading tool** `scratchpad/journey/measure_country.mjs`:

```js
// scratchpad/journey/measure_country.mjs (plan 2026-10-13 country-page-journey, Tasks 0 and 8): a country render read statically, the
// same way before and after, for the spec's measures (first-read sections, answer-type mixes, marks per page). Not a gate, never committed.
// usage: node scratchpad/journey/measure_country.mjs <render.html> ...
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const classOf = (t) => {
  const s = (t || "").replace(/[\s\u00a0]+/g, " ").trim();
  if (!s || /^[\u2013-]$/.test(s)) return null;
  if (!/\d/.test(s)) return "word";
  if (/[£$€]/.test(s) || /\d\s?p\b/.test(s)) return "money";
  if (/%/.test(s)) return "share";
  if (/\b(days?|weeks?|months?|years?|hours?)\b/i.test(s)) return "time";
  return "count";
};
const UNIT = /\d[\d.,]*\s*(?:[KMB]\b)?\s*(?:\/\s*\d+|\/\s*mo\b|\b(?:days?|weeks?|months?|years?|hours?)\b|\ba (?:week|month|year)\b|\ban hour\b)/i;
for (const file of process.argv.slice(2)) {
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "")).window.document;
  const main = doc.querySelector("main") ?? doc.body;
  const shut = (el) => { const d = el.closest("details"); return !!d && !d.hasAttribute("open") && !el.closest("summary"); };
  const blocks = [...main.querySelectorAll("[data-block]")].filter((b) => !b.parentElement?.closest("[data-block]"));
  const slots = [...main.querySelectorAll("[data-slot]")].map((s) => s.getAttribute("data-slot"));
  const lists = [...main.querySelectorAll('[data-archetype="fact-rows"], [data-archetype="detail-panel"], [data-hero-rows]')];
  const mixes = [];
  for (const l of lists) {
    const set = new Set([...l.querySelectorAll("dd, [data-figure]")].map((v) => classOf(v.textContent)).filter(Boolean));
    if (set.size > 1) mixes.push(`${l.closest("[data-block]")?.getAttribute("data-block") ?? "?"} ${[...set].join("+")}`);
  }
  const values = [...main.querySelectorAll("dd, [data-figure]")];
  const unitIn = values.filter((v) => UNIT.test(v.textContent ?? "")).length;
  console.log(`${file}`);
  console.log(`  blocks ${blocks.length}, first read ${blocks.filter((b) => !shut(b)).length}; slots ${slots.length ? `${slots.length}: ${slots.join(" ")}` : "none"}`);
  console.log(`  lists ${lists.length}, mixing classes ${mixes.length}${mixes.length ? ` (${mixes.join("; ")})` : ""}; values holding a unit ${unitIn} of ${values.length}`);
  console.log(`  level marks ${main.querySelectorAll("[data-level]").length}, signals ${main.querySelectorAll("[data-signal]").length}; seats ${main.querySelectorAll("[data-blocked]").length}; "Not known yet" ${(main.textContent.match(/Not known yet/g) || []).length}`);
}
```

- [ ] **Step 4: The before renders.** The memory test (Conventions, TYPECHECK's first command), then RENDER the list to `scratchpad/journey/before/render-list.txt` (exit 0), then one at a time `render_page.tsx country KH` to `before/render-kh.txt` and `render_page.tsx country DE` to `before/render-de.txt`. Copy `country-GB.html`, `country-AF.html`, `country-KH.html`, `country-DE.html` from `scratchpad/harness/pages/` into `scratchpad/journey/before/`, and `data/seo/floor_census.json` to `before/floor_census.json` (the index's state before, Q5).

- [ ] **Step 5: The before measures.** `node scratchpad/journey/measure_country.mjs scratchpad/journey/before/country-GB.html scratchpad/journey/before/country-KH.html scratchpad/journey/before/country-AF.html scratchpad/journey/before/country-DE.html > scratchpad/journey/before/measure.txt 2>&1; echo "exit $?" >> scratchpad/journey/before/measure.txt`. Expected: country-GB about 30 blocks, all a first read, mixing lists in the board and in the abroad, lease, fail, hour, employing, paperwork, running and paying sections; country-KH about 15 blocks with seats and "Not known yet" once; slots none on all four. Then the lending rate's repeated values (Reading 5): `grep -o '"bank_lending_rate_pct": *[0-9.]*' data/economic_indicators/country_profile_v2.json > scratchpad/journey/before/lending-values.txt 2>&1; echo "exit $?" >> scratchpad/journey/before/lending-values.txt`; read it and write in the report how many values five or more countries share.

- [ ] **Step 6: The before browser checks**, one at a time, each to `scratchpad/journey/before/<check>.txt` with its exit line, over the four files `scratchpad/journey/before/country-{GB,KH,AF,DE}.html` (written `<four>` below: that brace list, which Git Bash expands): `node scripts/harness/check_page_laws.mjs <four>`, `node scripts/harness/check_page_holes.mjs <four>`, `node scripts/harness/check_model_laws.mjs <four>`, `node scripts/harness/check_copy_plain.mjs <four>`, `node scripts/harness/check_readability.mjs <four>`; then `node node_modules/tsx/dist/cli.mjs scripts/harness/check_paywall.mjs > scratchpad/journey/before/paywall.txt 2>&1; echo "exit $?" >> scratchpad/journey/before/paywall.txt` (it renders its own locked forms) and `node scripts/harness/harness.mjs archetypes > scratchpad/journey/before/archetypes.txt 2>&1; echo "exit $?" >> scratchpad/journey/before/archetypes.txt`. The reds per page and per rule are the before the spec's section 8 holds every after to.

- [ ] **Step 7: The before photographs, 375 first**, one at a time, for each of the four files: `node scripts/harness/shoot_page.mjs scratchpad/journey/before/<name>.html "#take" scratchpad/journey/shots/before-<name>-top 375,768,1280`, the same with `"#chapter-01"` (`-ch01`), `"#chapter-02"` (`-ch02`) and `"Where to next"` (`-foot`), each run's output to `scratchpad/journey/before/shoot-<name>-<part>.txt`. Read each picture, the 375 ones first.

---

### Task 1A: The slot model as data (asks Q3 first)

**Files:**
- Create: `src/lib/spine/country_slots.ts`, `src/lib/spine/owner_direction.ts`
- Test: `tests/spine/country_model.test.ts` (create)
- Modify: `src/lib/spine/copy.ts` (a `journey` block before the comment that opens `banned`)
- Modify: `scripts/prebuild_all.ts` (after the `zone-rhythm` entry); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Produces: `type AnswerType = "money" | "share" | "time" | "position" | "state" | "dated-pair" | "table" | "doors"`; `type StageId`; `type SlotId = "tax-on-profit" | "where-it-stands" | "customers" | "spend" | "trades" | "open" | "hire" | "running-costs" | "credit" | "filings" | "peers" | "lasting" | "exit" | "dealings" | "changes" | "close"`; `STAGES: readonly StageDef[]` (`{ id, n, question, heading, index }`); `SLOTS: readonly SlotDef[]` (`{ n, id, stage, question, type, heading, domId, icon, source, thin, plus }`); `slotDef(id)`, `stageDef(id)`, `stageOfSlot(id)`. `OWNER_DIRECTION` (`Record<MeasureKey, { direction: OwnerDirection; spec: string }>`), `type MeasureKey`, `type OwnerDirection = "lower" | "higher" | "none"`, `directionOf(measure)`. `COPY.journey` (stages, slots, more, ageOf, thinTax, hiringRows, hiringWords, stepLabels, signal, buyers, exitWords, views, runs, adminNote). Gate `country-model`.

- [ ] **Step 1: Write the failing test** `tests/spine/country_model.test.ts`:

```ts
/**
 * THE COUNTRY PAGE'S MODEL (plan 2026-10-13 country-page-journey, Task 1A; spec E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md,
 * sections 2 to 4; R5 section 5, adopted row for row): src/lib/spine/country_slots.ts holds the spec's sixteen slots in its seven stages, in
 * order, each with its type, heading and DOM id; the words they print (COPY.journey) meet the copy rules; src/lib/spine/owner_direction.ts
 * holds the spec's direction table row for row and names every measure the page places.
 * BLIND SPOT, stated: it reads the model and its words, not the pages; the pages are the country-slots gate's (Task 1B).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_model.test.ts
 */
import { SLOTS, STAGES, slotDef } from "../../src/lib/spine/country_slots";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-model";
const FILE = "src/lib/spine/country_slots.ts";
const REMEDY = "hold the spec's sixteen slots in its seven stages, in order, each its type, heading and id; the words in COPY.journey within the copy rules; the direction table the spec's, row for row";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

/* THE SPEC'S TABLE (section 3): number, id, stage, type. */
const SPEC: Array<[number, string, string, string]> = [
  [1, "tax-on-profit", "orient", "share"], [2, "where-it-stands", "orient", "position"],
  [3, "customers", "market", "money"], [4, "spend", "market", "share"], [5, "trades", "market", "money"],
  [6, "open", "open", "table"],
  [7, "hire", "run", "money"], [8, "running-costs", "run", "money"], [9, "credit", "run", "share"], [10, "filings", "run", "time"], [11, "peers", "run", "table"],
  [12, "lasting", "last", "share"], [13, "exit", "last", "time"],
  [14, "dealings", "rules", "position"], [15, "changes", "rules", "dated-pair"],
  [16, "close", "next", "doors"],
];
check(`sixteen slots (${SLOTS.length})`, SLOTS.length === 16);
for (const [n, id, stage, type] of SPEC) {
  const s = SLOTS[n - 1];
  check(`slot ${n} is ${id}, stage ${stage}, ${type} (${s ? `${s.id}, ${s.stage}, ${s.type}` : "missing"})`, !!s && s.n === n && s.id === id && s.stage === stage && s.type === type);
}
check("the stages are the spec's seven, in order", JSON.stringify(STAGES.map((g) => [g.id, g.n])) === JSON.stringify([["orient", 1], ["market", 2], ["open", 3], ["run", 4], ["last", 5], ["rules", 6], ["next", 7]]));
check("the chapters are stages 2 to 6, titled by the spec's names and numbered 01 to 05; the masthead and the close stand outside",
  JSON.stringify(STAGES.map((g) => [g.heading, g.index])) === JSON.stringify([[null, null], ["The market", "01"], ["To open", "02"], ["To run", "03"], ["To last", "04"], ["The rules", "05"], [null, null]]));
check("slots 1 and 2 are the masthead's (#take); every other slot its own DOM id",
  slotDef("tax-on-profit").domId === "take" && slotDef("where-it-stands").domId === "take" && new Set(SLOTS.slice(2).map((s) => s.domId)).size === 14 && !SLOTS.slice(2).some((s) => s.domId === "take"));
check("the ids are the plan's (slot 3 keeps `cities`, the anchor the home's All UK cities door opens)", JSON.stringify(SLOTS.slice(2).map((s) => s.domId)) === JSON.stringify(["cities", "spend", "trades", "open", "hire", "running-costs", "credit", "filings", "peers", "lasting", "exit", "dealings", "changes", "close"]));

/* THE WORDS (the copy rules): every string under COPY.journey. */
const strings: Array<[string, string]> = [];
const walk = (v: unknown, at: string) => { if (typeof v === "string") strings.push([at, v]); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${at}.${k}`); };
walk(COPY.journey, "journey");
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const BANNED = [/\bmodell?ed\b/i, /\bwithheld\b/i, /\bon file\b/i, /\bwe\b/i, /;/, /\u2014/];
const bad = strings.filter(([, s]) => words(s) > 12 || BANNED.some((re) => re.test(s))).map(([at]) => at);
check(`every journey string is twelve words or fewer, with no semicolon, em-dash, method word or "we" (${bad.join(", ") || "all"})`, strings.length > 0 && bad.length === 0, "src/lib/spine/copy.ts");
const heads = [...SLOTS.map((s) => s.heading), ...STAGES.flatMap((g) => (g.heading ? [g.heading] : [])), ...Object.values(COPY.journey.more)].filter((h) => words(h) > 4);
check(`every heading, chapter title and plus head is four words or fewer (${heads.join(" | ") || "all"})`, heads.length === 0, "src/lib/spine/copy.ts");

/* THE DIRECTION TABLE (spec section 4), row for row, and the two measures Q3 names. */
const WANT: Record<string, string> = {
  "tax-on-profit": "lower", "employer-oncost": "lower", "register-cost": "lower", "card-fees": "lower", "lending-rate": "lower", electricity: "lower", diesel: "lower",
  "register-days": "lower", "time-to-sell": "lower", "time-to-discharge": "lower", "enforce-days": "lower",
  "firms-year-five": "higher", "hiring-ease": "higher", "tax-predictability": "higher",
  bribery: "lower", "official-wait": "lower", "clean-dealing": "higher",
  "customer-pay": "none", salary: "none", "wage-floor": "none", "household-spend": "none", population: "none",
  "admin-ease": "none", "cost-of-living": "none",
};
const got = Object.fromEntries(Object.entries(OWNER_DIRECTION).map(([k, v]) => [k, v.direction]));
check(`the direction table holds the spec's rows and Q3's two, each its direction (${JSON.stringify(got)})`, JSON.stringify(Object.keys(got).sort()) === JSON.stringify(Object.keys(WANT).sort()) && Object.entries(WANT).every(([k, d]) => got[k] === d), "src/lib/spine/owner_direction.ts");
check("every row of the table says which spec line it reads", Object.values(OWNER_DIRECTION).every((v) => typeof v.spec === "string" && v.spec.trim().length > 0), "src/lib/spine/owner_direction.ts");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_model: all pass");
```

Under Q3 answered A, `WANT` reads `"admin-ease": "higher", "cost-of-living": "lower"`, and Step 3's two rows say so with his words' date.

- [ ] **Step 2: Run it to see it fail.** `node node_modules/tsx/dist/cli.mjs tests/spine/country_model.test.ts > scratchpad/journey/t1a.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1a.txt`. Expected: exit 1, `Cannot find module` for `src/lib/spine/country_slots`.

- [ ] **Step 3: Write the direction table** `src/lib/spine/owner_direction.ts`:

```ts
/**
 * src/lib/spine/owner_direction.ts , WHICH WAY IS EASIER FOR AN OWNER, ONCE PER MEASURE (plan 2026-10-13 country-page-journey, Task 1A;
 * spec E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, section 4; his ruling of 2026-10-13 on the signal).
 *
 * The signal (src/lib/spine/signal.ts, src/components/spine/signal/Signal.tsx) draws beside a figure placed among the countries whose
 * measure is named here with a direction: "lower" (lower is easier: fewer days, lower fees and tax, cheaper power and credit, less
 * bribery and waiting) or "higher" (higher is easier: more firms lasting, easier hiring, a cleaner score). "none" draws no mark (salary,
 * customer pay, the wage floor: no single owner direction). A measure the page places and this table does not name is a red of the
 * signal-marks gate: it is named here, with its reading, before it prints. `spec` quotes the line of the spec's table each row reads.
 */
export type OwnerDirection = "lower" | "higher" | "none";

export const OWNER_DIRECTION = {
  "tax-on-profit": { direction: "lower", spec: "Tax on profit: lower" },
  "employer-oncost": { direction: "lower", spec: "employer on-cost share: lower" },
  "register-cost": { direction: "lower", spec: "cost to register: lower" },
  "card-fees": { direction: "lower", spec: "card fees: lower" },
  "lending-rate": { direction: "lower", spec: "lending rate: lower" },
  electricity: { direction: "lower", spec: "electricity and diesel prices: lower" },
  diesel: { direction: "lower", spec: "electricity and diesel prices: lower" },
  "register-days": { direction: "lower", spec: "Days to register: fewer, shorter" },
  "time-to-sell": { direction: "lower", spec: "time to sell a business: fewer, shorter" },
  "time-to-discharge": { direction: "lower", spec: "time to be freed after a failure: fewer, shorter" },
  "enforce-days": { direction: "lower", spec: "days to enforce a contract: fewer, shorter" },
  "firms-year-five": { direction: "higher", spec: "Firms still trading at year five: more" },
  "hiring-ease": { direction: "higher", spec: "Hiring ease: easier" },
  "tax-predictability": { direction: "higher", spec: "tax predictability: more predictable" },
  bribery: { direction: "lower", spec: "Bribery met in dealings: less" },
  "official-wait": { direction: "lower", spec: "waiting time with officials: less" },
  "clean-dealing": { direction: "higher", spec: "Bribery met in dealings: less, read on the clean-dealing score, where 100 is clean, so a higher score is less bribery" },
  "customer-pay": { direction: "none", spec: "Customer pay: no mark (no single owner direction)" },
  salary: { direction: "none", spec: "salaries: no mark (no single owner direction)" },
  "wage-floor": { direction: "none", spec: "the wage floor: no mark (no single owner direction)" },
  "household-spend": { direction: "none", spec: "household spend shares: no mark (no single owner direction)" },
  population: { direction: "none", spec: "population: no mark (no single owner direction)" },
  "admin-ease": { direction: "none", spec: "not in the spec's table: no mark until his reading (plan 2026-10-13 country-page-journey, Q3)" },
  "cost-of-living": { direction: "none", spec: "not in the spec's table: no mark until his reading (plan 2026-10-13 country-page-journey, Q3)" },
} as const satisfies Record<string, { direction: OwnerDirection; spec: string }>;

export type MeasureKey = keyof typeof OWNER_DIRECTION;

export function directionOf(measure: MeasureKey): OwnerDirection {
  return OWNER_DIRECTION[measure].direction;
}
```

- [ ] **Step 4: The words.** In `src/lib/spine/copy.ts`, before the line `  /** Words that must never appear in an archetype's copy: the corporate register.`, insert:

```ts
  /** THE COUNTRY PAGE BY THE VISITOR'S JOURNEY (plan 2026-10-13 country-page-journey; spec E:/atlas/docs/superpowers/specs/2026-10-13-
   *  country-page-journey-design.md; his direction of 2026-10-13). The chapters' titles are the spec's stage names; a slot's heading is
   *  four words at most and its line twelve at most; a plus's head is a label, its unit said there where its rows are bare numbers; the
   *  signal's five words are its accessible names and its key is the page's one line about it. Read aloud, every one. */
  journey: {
    stages: { market: "The market", open: "To open", run: "To run", last: "To last", rules: "The rules" },
    slots: {
      "tax-on-profit": { heading: "Tax on profit" },
      "where-it-stands": { heading: "Where it stands" },
      customers: { heading: "Customers, city by city", words: "typical full-time pay, a year, nationwide" },
      spend: { heading: "What households spend on" },
      trades: { heading: "What trades take", words: "typical yearly sales of the middle London trade" },
      open: { heading: "Forms, fees and days" },
      hire: { heading: "What a hire costs" },
      "running-costs": { heading: "Running costs" },
      credit: { heading: "Credit and card fees" },
      filings: { heading: "Filing deadlines", words: "after the year end, to file the accounts" },
      peers: { heading: "Against the peers" },
      lasting: { heading: "How many last" },
      exit: { heading: "Selling or failing" },
      dealings: { heading: "How dealings go" },
      changes: { heading: "Rule changes" },
      close: { heading: "Where to next" },
    },
    more: {
      cities: "Customer pay by city",
      tenths: "Bottom and top tenth",
      trades: "More London trades",
      steps: "The steps, in days",
      stepsHow: "How each step goes",
      stepCosts: "Each step's cost",
      licenceWaits: "Licence waits, in days",
      abroad: "From abroad",
      abroadCosts: "From abroad, costs",
      abroadWaits: "From abroad, in days",
      employing: "Rules of employing",
      hiring: "How hiring goes",
      adds: "What the employer adds",
      hour: "An hour, all in",
      jobs: "The job market",
      premises: "Premises tax",
      insurance: "Insurance by law",
      lease: "The lease, by law",
      leaseTerms: "The lease, its terms",
      leaseCosts: "The lease, its costs",
      peersPower: "Peers' electricity",
      loans: "Start-up loans",
      pay: "How customers pay",
      lands: "When money lands",
      filingCosts: "Filing costs",
      back: "What holds firms back",
      byCity: "By city",
      failMost: "Trades that fail most",
      failCosts: "Costs of failing",
      failReach: "What failing reaches",
      whoTrades: "Who trades here",
    },
    /** A people file's bands of ages, headed by its place: "London by age". */
    ageOf: "{place} by age",
    /** Slot 1's thin state (spec section 3): the company tax rate under its own label, never "Not known yet". */
    thinTax: { label: "Tax on company profit", words: "the headline rate on a company's profit" },
    hiringRows: { hire: "Taking on staff", contracts: "Contracts", fire: "Letting go", depth: "People to hire" },
    hiringWords: { easy: "Easy", moderate: "Moderate", hard: "Hard", deep: "Deep", fair: "Fair", thin: "Thin" } as Record<string, string>,
    /** A step's label from a closed list, by the words its shard's name holds (src/lib/spine/slots/open.ts, stepLabel); the shard's own words stand under it as its note. */
    stepLabels: { name: "Name check", register: "Registration", tax: "Tax number", vat: "Sales tax", bank: "Bank account", licence: "Licence", social: "Social insurance", notary: "Notary", seal: "Company seal", other: "Other step" },
    signal: { key: "Up is easier for an owner, down is harder.", words: { 1: "Very good", 2: "Good", 3: "Middle", 4: "Poor", 5: "Very poor" } },
    buyers: { active: "with plenty of buyers", steady: "with some buyers", thin: "with few buyers" } as Record<string, string>,
    exitWords: "to sell a business here",
    views: { state: "With the state", people: "With people" },
    runs: { coming: "Coming", recent: "Recent" },
    /** The admin index's year, said in the board row's readout once its label carries the unit (the plan's Reading 8). */
    adminNote: "Last published in 2020.",
  },
```

- [ ] **Step 5: Write the model** `src/lib/spine/country_slots.ts`:

```ts
/**
 * src/lib/spine/country_slots.ts , THE COUNTRY PAGE'S SLOT MODEL AS DATA (plan 2026-10-13 country-page-journey, Task 1A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, sections 2 and 3; R5 section 5, which the spec adopts row for row).
 *
 * Sixteen slots in seven stages, the same for every country: one question, one answer type, one source, one thin state and one tap down
 * each. A country draws the slots its data holds, in this order (src/lib/spine/slots/plan.ts); a slot without its data omits itself (no
 * seat, no "Not known yet"). The stage order is the phone's one column; a desktop pair joins two neighbouring slots of one stage
 * (src/lib/spine/slots/zones.ts). Stages 2 to 6 are the page's chapters, numbered 01 to 05; the masthead (stage 1) and the close (stage 7)
 * stand outside them. The words a slot prints are COPY.journey's; `source`, `thin` and `plus` are R5's notes, for a reader of this file.
 */
import { COPY } from "@/lib/spine/copy";
import type { AtlasIconId } from "@/components/brand/icons";

export type AnswerType = "money" | "share" | "time" | "position" | "state" | "dated-pair" | "table" | "doors";
export type StageId = "orient" | "market" | "open" | "run" | "last" | "rules" | "next";
export type SlotId = "tax-on-profit" | "where-it-stands" | "customers" | "spend" | "trades" | "open" | "hire" | "running-costs" | "credit" | "filings" | "peers" | "lasting" | "exit" | "dealings" | "changes" | "close";

export type StageDef = { id: StageId; n: number; question: string; heading: string | null; index: string | null };
export type SlotDef = { n: number; id: SlotId; stage: StageId; question: string; type: AnswerType; heading: string; domId: string; icon: AtlasIconId | null; source: string; thin: string; plus: readonly string[] };

const J = COPY.journey;

export const STAGES: readonly StageDef[] = [
  { id: "orient", n: 1, question: "What is this country like for a small business?", heading: null, index: null },
  { id: "market", n: 2, question: "Is there money here, and where?", heading: J.stages.market, index: "01" },
  { id: "open", n: 3, question: "What does opening take?", heading: J.stages.open, index: "02" },
  { id: "run", n: 4, question: "What does staying open cost?", heading: J.stages.run, index: "03" },
  { id: "last", n: 5, question: "Will it survive, and what if it does not?", heading: J.stages.last, index: "04" },
  { id: "rules", n: 6, question: "Which rules bind me, and what is changing?", heading: J.stages.rules, index: "05" },
  { id: "next", n: 7, question: "Where do I go from here?", heading: null, index: null },
];

export const SLOTS: readonly SlotDef[] = [
  { n: 1, id: "tax-on-profit", stage: "orient", question: "What share of profit goes to the state?", type: "share", heading: J.slots["tax-on-profit"].heading, domId: "take", icon: null, source: "hero_facts.ts, the regime (58 of 195); the UK's law engine (uk_tax_on_profit.ts)", thin: "the company tax rate under its own label (country_profile_v2.json corporate_income_tax_combined_pct, 198 of 198)", plus: ["the other taxes"] },
  { n: 2, id: "where-it-stands", stage: "orient", question: "How does it sit for an owner?", type: "position", heading: J.slots["where-it-stands"].heading, domId: "take", icon: null, source: "hero_board.ts, the board's rows", thin: "no mark under a set of 20; Hiring staff moves to slot 7", plus: ["the row's placement sentence, in its readout"] },
  { n: 3, id: "customers", stage: "market", question: "What do customers earn, and where?", type: "money", heading: J.slots.customers.heading, domId: "cities", icon: "best-areas", source: "city_cards.ts (105 countries); range_rows.ts buildCustomersStrip (198; tenths on 47)", thin: "the national typical alone", plus: ["every covered city", "the tenths"] },
  { n: 4, id: "spend", stage: "market", question: "Where does a household's money go?", type: "share", heading: J.slots.spend.heading, domId: "spend", icon: "spending-power", source: "country_spend_rows.ts (196 of 198); people.ts buildAgeMix (the people file)", thin: "omit", plus: ["people by age"] },
  { n: 5, id: "trades", stage: "market", question: "Which trades make money here?", type: "money", heading: J.slots.trades.heading, domId: "trades", icon: "owner-keeps", source: "country_depth_rows.ts buildLondonTradeSales (the UK); margin rows (22 countries, Q1)", thin: "omit (173)", plus: ["more trades"] },
  { n: 6, id: "open", stage: "open", question: "What do the forms cost, how long?", type: "table", heading: J.slots.open.heading, domId: "open", icon: "register-cost", source: "the formation file's tiers (152); entry_bill_rows.ts; howto_steps_rows.ts; country_licences_rows.ts; from_abroad.ts (the UK)", thin: "the bill or the table alone", plus: ["the steps", "licences by trade", "from abroad"] },
  { n: 7, id: "hire", stage: "run", question: "What does one employee cost a year?", type: "money", heading: J.slots.hire.heading, domId: "hire", icon: "hiring", source: "pay_rows.ts (195 pairs); country_rates.ts employer_social; the shard's people_pay.hiring (197); rules.json employing (the UK)", thin: "the wage floor and the share", plus: ["rules of employing", "how hiring goes", "what the employer adds", "an hour, all in", "the job market"] },
  { n: 8, id: "running-costs", stage: "run", question: "What do power and premises cost?", type: "money", heading: J.slots["running-costs"].heading, domId: "running-costs", icon: "cost-breakdown", source: "the profile's electricity (198, 52 fills left out) and diesel; rules.json premises and insurance (the UK); lease_by_law.ts (the UK)", thin: "electricity and its placement", plus: ["premises tax", "insurance by law", "the lease", "the peers' electricity"] },
  { n: 9, id: "credit", stage: "run", question: "What does money cost me?", type: "share", heading: J.slots.credit.heading, domId: "credit", icon: "raise-money", source: "the profile's bank_lending_rate_pct (198); country_depth_rows.ts financing; country_rules.ts buildPayments (the UK)", thin: "the lending rate on its track", plus: ["start-up loans", "how customers pay", "when money lands"] },
  { n: 10, id: "filings", stage: "run", question: "What must I file, and when?", type: "time", heading: J.slots.filings.heading, domId: "filings", icon: "filings", source: "rules.json filings (the UK)", thin: "omit", plus: ["late penalties and filing fees"] },
  { n: 11, id: "peers", stage: "run", question: "Better deal than its peers?", type: "table", heading: J.slots.peers.heading, domId: "peers", icon: "benchmark", source: "peer_rows.ts (51 of 195)", thin: "omit", plus: ["sort by any head"] },
  { n: 12, id: "lasting", stage: "last", question: "Of a hundred new firms, how many trade at year five?", type: "share", heading: J.slots.lasting.heading, domId: "lasting", icon: "first-year", source: "first_years.ts survival and obstacles; firms_last.ts; duel.ts (the UK)", thin: "omit", plus: ["what holds firms back", "by city", "trades that fail most"] },
  { n: 13, id: "exit", stage: "last", question: "How long to sell, or to be freed if it fails?", type: "time", heading: J.slots.exit.heading, domId: "exit", icon: "sale-tag", source: "country_exit_rows.ts (198; withheld on the UK); if_it_fails.ts and rules.json closing (the UK)", thin: "time to sell alone", plus: ["if it fails: its time rows, then its money and its state rows"] },
  { n: 14, id: "dealings", stage: "rules", question: "How do the state and people deal?", type: "position", heading: J.slots.dealings.heading, domId: "dealings", icon: "bank", source: "character_rows.ts (192 of 195)", thin: "omit under two reads", plus: ["who trades here"] },
  { n: 15, id: "changes", stage: "rules", question: "What changed, what is coming?", type: "dated-pair", heading: J.slots.changes.heading, domId: "changes", icon: "change", source: "country_rules.ts buildRuleChanges; data/sections/changes.json (the UK)", thin: "omit", plus: ["more changes"] },
  { n: 16, id: "close", stage: "next", question: "Where now?", type: "doors", heading: J.slots.close.heading, domId: "close", icon: null, source: "close_rows.ts", thin: "fewer doors", plus: [] },
];

export function slotDef(id: SlotId): SlotDef {
  const s = SLOTS.find((x) => x.id === id);
  if (!s) throw new Error(`country_slots: no slot "${id}"`);
  return s;
}

export function stageDef(id: StageId): StageDef {
  const g = STAGES.find((x) => x.id === id);
  if (!g) throw new Error(`country_slots: no stage "${id}"`);
  return g;
}

export function stageOfSlot(id: SlotId): StageDef {
  return stageDef(slotDef(id).stage);
}
```

- [ ] **Step 6: Run it to see it pass.** To `scratchpad/journey/t1a-b.txt`: every check PASS, exit 0.

- [ ] **Step 7: Wire it.** In `scripts/prebuild_all.ts`, after the line holding `name: "zone-rhythm"`:

```ts
  /* THE COUNTRY PAGE'S MODEL (plan 2026-10-13 country-page-journey, Task 1A; his direction of 2026-10-13: the same slots, in the same
     order and type, for every country): the sixteen slots in seven stages, their words within the copy rules, the direction table the
     spec's. No browser. */
  { name: "country-model", script: "tests/spine/country_model.test.ts" },
```

Stage the three new files and `copy.ts`, then COUNTS to `t1a-counts.txt` (exit 0). GATES `--only=country-model,counts-fresh,gate-conflicts,no-em-dashes,no-source-agencies,copy-no-method-words` to `t1a-gates.txt`: all PASS.

- [ ] **Step 8: Commit.** `src/lib/spine/country_slots.ts`, `src/lib/spine/owner_direction.ts`, `src/lib/spine/copy.ts`, `tests/spine/country_model.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:model: the country page's sixteen slots in seven stages as data, their words, and the owner direction table (plan 2026-10-13 country-page-journey, Task 1A)`.

---

### Task 1B: The replicability gate, red on today's renders

**Files:**
- Test: `tests/spine/country_slots.test.ts` (create)
- Modify: `scripts/harness/pages.json` (two entries after the `AF` entry)
- Modify: `scripts/prebuild_all.ts` (after `country-model`); regenerated `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`
- Modify (first measurements only, never a raise): the ratchet baselines that record a new page, each where its gate seeds KH and DE (`scripts/harness/model_laws_baseline.json`, `page_laws_baseline.json`, `page_holes_baseline.json`, `provenance_baseline.json`, `scripts/art_direction_baseline.json`, `scripts/section_bands_baseline.json`)

**Interfaces:**
- Consumes: Task 1A's `SLOTS`, `STAGES`, `SlotId`.
- Produces: gate `country-slots`; the renders `scratchpad/harness/pages/country-KH.html` and `country-DE.html` in the chain; the expected sets (`THIN` for KH and AF, Germany's, all sixteen for GB).

- [ ] **Step 1: Write the failing test** `tests/spine/country_slots.test.ts`:

```ts
/**
 * THE PROGRAMMATIC PROMISE (plan 2026-10-13 country-page-journey, Task 1B; spec section 8: "a replicability test that /gb, /kh, /af and /de
 * draw their slots in the model's order and types"; his question of 2026-10-13, "if the same page is done for Cambodia, would you fill it
 * roughly the same?"). Over the country renders pages-fresh writes (the country entries of scripts/harness/pages.json), statically:
 *   ORDER      the slots a render draws, in document order (the phone's one column), are the model's (src/lib/spine/country_slots.ts), in
 *              its order, each once, and exactly the set this file expects for that country;
 *   TYPE       each slot declares its stage's number and the model's answer type;
 *   NO SEAT    no drawn blocked seat, no "Not known yet";
 *   MASTHEAD   the masthead (#take) holds slots 1 and 2;
 *   INDEX      every link of the page's index ("On this page") lands on an id the render holds (the dead "Time to sell" of 2026-10-13);
 *   FIRST READ the slots a first read meets, printed (the spec's first measure: sixteen on the UK's page).
 * BLIND SPOT, stated: it reads markup, not what a reader sees (a slot hidden by a stylesheet still counts). The expected sets are the
 * spec's for KH and AF (R5 section 5: "/kh draws slots 1, 2, 3, 4, 6, 7, 8, 9 ..., 13, 14 and 16") and the plan's reading for GB and DE; a
 * set changes only with the data that changes it, written in the step's report, never to make this pass.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_slots.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { SLOTS, STAGES, type SlotId } from "../../src/lib/spine/country_slots";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-slots";
const VIEW = "src/components/spine/country/country-view.tsx";
const REMEDY = "draw the country page from the slot plan (src/lib/spine/slots/plan.ts): every slot its data holds, in the model's order, each stamped data-slot, data-stage and data-answer, no seat; the index built from the drawn slots";
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const ALL = SLOTS.map((s) => s.id);
const THIN: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "exit", "dealings", "close"];
const EXPECT: Record<string, SlotId[]> = {
  "country-GB": ALL,
  "country-KH": THIN,
  "country-AF": THIN,
  "country-DE": ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "peers", "exit", "dealings", "close"],
};
const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
check(`the chain renders the four countries the spec names (${pages.join(", ") || "none"})`, ["country-GB", "country-KH", "country-AF", "country-DE"].every((n) => pages.includes(n)), "scripts/harness/pages.json");
const typeOf = new Map(SLOTS.map((s) => [s.id as string, s.type as string]));
const stageN = new Map(SLOTS.map((s) => [s.id as string, String(STAGES.find((g) => g.id === s.stage)?.n ?? "")]));

for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  const main = doc.querySelector("main");
  if (!main) { check(`${name}: the render holds a main`, false, file); continue; }
  const els = [...main.querySelectorAll("[data-slot]")];
  const ids = els.map((e) => e.getAttribute("data-slot") ?? "");
  const want = EXPECT[name];
  if (!want) { check(`${name}: this file writes the set it expects`, false, "tests/spine/country_slots.test.ts"); continue; }
  check(`${name} ORDER: draws ${ids.join(" ") || "no slot"}; the model expects ${want.join(" ")}`, JSON.stringify(ids) === JSON.stringify(want));
  const wrong = els.filter((e) => { const id = e.getAttribute("data-slot") ?? ""; return e.getAttribute("data-answer") !== typeOf.get(id) || e.getAttribute("data-stage") !== stageN.get(id); }).map((e) => `${e.getAttribute("data-slot")} (${e.getAttribute("data-stage")}, ${e.getAttribute("data-answer")})`);
  check(`${name} TYPE: each slot its stage and the model's answer type (wrong: ${wrong.join(", ") || "none"})`, els.length > 0 && wrong.length === 0);
  check(`${name} NO SEAT: no drawn blocked seat and no "Not known yet"`, !main.querySelector("[data-blocked]") && !/Not known yet/.test(main.textContent ?? ""));
  const take = main.querySelector("#take");
  check(`${name} MASTHEAD: #take holds slots 1 and 2`, !!take && !!take.querySelector('[data-slot="tax-on-profit"]') && !!take.querySelector('[data-slot="where-it-stands"]'));
  const nav = doc.querySelector('nav[aria-label="On this page"]');
  const dead = nav ? [...nav.querySelectorAll('a[href^="#"]')].map((a) => (a.getAttribute("href") ?? "").slice(1)).filter((id) => !doc.getElementById(id)) : ["the index itself"];
  check(`${name} INDEX: every index link lands on an id the render holds (dead: ${dead.join(", ") || "none"})`, dead.length === 0);
  const firstRead = els.filter((e) => { const d = e.closest("details"); return !d || d.hasAttribute("open"); }).length;
  console.log(`  ${name}: a first read meets ${firstRead} slot(s)`);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_slots: all pass");
```

Under Q1 answered A, Germany's set holds `"trades"` after `"spend"`.

- [ ] **Step 2: Two countries join the chain's renders.** In `scripts/harness/pages.json`, after the entry whose `slugs` is `["AF"]` (its closing `},`), insert:

```json
    {
      "surface": "country",
      "slugs": [
        "KH"
      ],
      "since": "plan 2026-10-13 country-page-journey, Task 1B: the spec's replicability test reads Cambodia (his question of 2026-10-13: if the same page is done for Cambodia, would you fill it roughly the same?)"
    },
    {
      "surface": "country",
      "slugs": [
        "DE"
      ],
      "since": "plan 2026-10-13 country-page-journey, Task 1B: Germany, a country with a regime, legal forms, peers and the margins card, the fourth of the spec's replicability renders"
    },
```

Then `git grep -n "eleven renders\|11 renders\|eleven fresh\|eleven pages" -- scripts tests > scratchpad/journey/t1b-typed.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1b-typed.txt`: a test or gate that types the list's length is corrected to read the list (the count is never typed again), each correction in the report.

- [ ] **Step 3: Run the test to see it fail.** RENDER the list to `scratchpad/journey/t1b-render.txt` (exit 0; KH and DE among the renders), then the test to `t1b.txt`. Expected: exit 1; the four countries read; `ORDER` red on each ("draws no slot"); `TYPE` and `MASTHEAD` red; `NO SEAT` red on KH, AF and DE (their seats) and on KH and AF ("Not known yet"); `INDEX` red on country-GB ("dead: exit").

- [ ] **Step 4: The new pages' first measurements.** GATES `--only=pages-fresh,harness-laws,harness-page-laws,harness-page-filter,provenance,art-direction,section-bands,fact-once,type-floor,tiles-openers,loud-seats,harness-copy-plain,harness-readability,gathered-emptiness,fullwidth-sitewide,form-variety,floor-census-fresh` to `t1b-gates.txt`. For each ratchet that reds only because country-KH or country-DE has no entry, record the first measurement the way that gate records one (`--write-baseline` on `check_model_laws.mjs --list --ratchet`, `check_page_laws.mjs --list`, `check_page_holes.mjs --list`, `check_provenance.mjs --list`, `verify_section_bands.mjs`), after reading that no other page's count grew; `verify_art_direction.mjs --write-baseline` writes every page's count as measured, so run it without the flag first and write only when its "findings GREW" lines name the two new pages and nothing else. A law (fact-once, type-floor, tiles-openers, loud-seats, the plain-copy laws, floor-census-fresh) that reds on KH or DE is listed in the report by page and rule: today's page breaks it, and Tasks 3 and 4 rebuild that page; nothing is seeded for a law.

- [ ] **Step 5: Wire it.** In `scripts/prebuild_all.ts`, after the `country-model` entry:

```ts
  /* THE PROGRAMMATIC PROMISE (plan 2026-10-13 country-page-journey, Task 1B; spec section 8): /gb, /kh, /af and /de draw their slots in the
     model's order and types, no seat, the index landing on what is drawn. Static, over the renders pages-fresh writes. */
  { name: "country-slots", script: "tests/spine/country_slots.test.ts" },
```

Stage the test; COUNTS to `t1b-counts.txt`; CENSUS to `t1b-census.txt`. GATES `--only=pages-fresh,country-slots,counts-fresh,census-fresh,harness-preflight` to `t1b-gates2.txt`: `country-slots` red as in Step 3, the rest PASS.

- [ ] **Step 6: Commit.** The test, `scripts/harness/pages.json`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`, every baseline Step 4 seeded and every file Step 2 corrected; message `journey:replicability: /gb, /kh, /af and /de held to the slot model's order and types, Cambodia and Germany joining the chain's renders, red on today's pages (plan 2026-10-13 country-page-journey, Task 1B)`.

---

### Task 1C: The answer-type gate, red on today's renders

**Files:**
- Create: `scripts/lib/answer_type.mjs`, `scripts/harness/check_answer_type.mjs`
- Test: `tests/spine/answer_type.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `country-slots`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Produces: `classifyRow({ value: string; label?: string; head?: string; placed?: boolean }) => "money" | "share" | "time" | "position" | "state" | "count" | null`; `unitInCell(value: string) => boolean`; `readAnswerTypes(doc: Document, { requireDeclared?: boolean }) => { lists: number; rows: number; findings: Array<{ rule: "WRONG TYPE" | "UNIT IN CELL" | "FOLD ROWS" | "UNDECLARED" | "SLOT TYPE"; where: string; detail: string }> }`; `LIST_TYPES`. The markup contract every later task writes: a list carries `data-answer="<type>"`; each row's value element carries `data-value`; a row placed among the countries carries `data-placed="<measure>"`; an answer fold carries `data-fold="answer"` and its head is its `summary [data-label]`. Gates `answer-type` (the renders) and `answer-type-reader` (the fixtures).

- [ ] **Step 1: Write the failing test** `tests/spine/answer_type.test.ts`:

```ts
/**
 * ONE ANSWER TYPE A LIST, THE READING (plan 2026-10-13 country-page-journey, Task 1C; spec sections 3 and 6): scripts/lib/answer_type.mjs over
 * jsdom fixtures: the value classes, the unit in a cell, the fold's two to eight rows, the undeclared list, the slot's own type; ranges,
 * thresholds, pence, magnitudes and a unit carried by the label or the fold's head are read as the figure they are, never as a mix.
 * BLIND SPOT, stated: fixtures prove the reading, not the pages; the pages are the `answer-type` gate's, over the renders pages-fresh writes.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/answer_type.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { readAnswerTypes, classifyRow } from "../../scripts/lib/answer_type.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "answer-type-reader";
const LIB = "scripts/lib/answer_type.mjs";
const GATE = "scripts/harness/check_answer_type.mjs";
const REMEDY = "read a row's class from its value, and for a bare number from its label or its fold's head (the header of scripts/lib/answer_type.mjs); a list of one declared type, its units out of the cells";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const doc = (inner: string) => new JSDOM(`<!doctype html><html><body><main>${inner}</main></body></html>`).window.document;
const row = (label: string, value: string, extra = "") => `<div data-row="r"${extra}><dt data-label>${label}</dt><dd data-value>${value}</dd></div>`;
const list = (type: string, rows: string) => `<div data-archetype="fact-rows" data-answer="${type}"><dl>${rows}</dl></div>`;
const fold = (type: string, head: string, rows: string) => `<div data-archetype="detail-panel" data-fold="answer" data-answer="${type}"><details><summary><span data-label>${head}</span></summary><dl>${rows.replace(/data-row="r"/g, "data-detail-row")}</dl></details></div>`;
const found = (inner: string, opts: { requireDeclared?: boolean } = {}) => readAnswerTypes(doc(inner), opts).findings.map((f: { rule: string }) => f.rule).sort().join(",");

check("money: a dollar figure and a pound figure are one class", found(list("money", row("Fee", "$133") + row("Wage floor, an hour", "£12.71"))) === "");
check("a word in a money list is the wrong type", found(list("money", row("Fee", "$133") + row("Online", "Free"))) === "WRONG TYPE");
check("time: bare numbers under labels that end with their unit", found(list("time", row("Accounts, months", "9") + row("Tax return, months", "12"))) === "");
check("a unit in the cell is a red of its own, the class still time", found(list("time", row("Accounts", "9 months"))) === "UNIT IN CELL");
check("share: a range of percents and a percent", found(list("share", row("Card readers", "1.69% to 1.75%") + row("Late interest", "8%"))) === "");
check("money: a threshold, a range, a magnitude and pence", found(list("money", row("Debt Relief Order", "Under £50,000") + row("Start-up loan", "£500 to £25,000") + row("Parting, 10 years", "$13K") + row("Business rates", "43.2p"))) === "");
check("a word in a time list is the wrong type (Next day)", found(list("time", row("Card payouts", "Next day"))) === "WRONG TYPE");
check("position: placed figures of any unit", found(`<div data-hero-rows data-answer="position">${row("Clean dealing /100", "71", ' data-placed="clean-dealing"')}${row("Monthly salary", "$4,315", ' data-placed="salary"')}</div>`) === "");
check("an unplaced figure in a position list is the wrong type", found(`<div data-hero-rows data-answer="position">${row("Monthly salary", "$4,315")}</div>`) === "WRONG TYPE");
check("state: words from a closed list", found(list("state", row("Taking on staff", "Moderate") + row("Letting go", "Easy"))) === "");
check("a time in a state list is the wrong type and a unit in a cell", found(list("state", row("Tax code", "21 days"))) === "UNIT IN CELL,WRONG TYPE");
check("a dated pair holds its date", found(`<div data-answer="dated-pair"><div data-row="c"><span>1 Apr 2026</span><span data-label>Minimum wage</span><span data-value>£12.21</span></div></div>`) === "");
check("a dated pair without a date is the wrong type", found(`<div data-answer="dated-pair"><div data-row="c"><span data-label>Minimum wage</span><span data-value>£12.21</span></div></div>`) === "WRONG TYPE");
check("a fold of one row is under two", found(fold("money", "Customer pay by city", row("London", "$65K"))) === "FOLD ROWS");
check("a fold of nine rows is over eight", found(fold("money", "Customer pay by city", Array.from({ length: 9 }, (_, i) => row(`City ${i}`, `$${i + 1}K`)).join(""))) === "FOLD ROWS");
check("a fold of three rows stands", found(fold("money", "Customer pay by city", row("London", "$65K") + row("Leeds", "$42K") + row("Bristol", "$44K"))) === "");
check("an undeclared fact-rows list is a red where a declaration is required", found(`<div data-archetype="fact-rows"><dl>${row("A", "$1")}</dl></div>`, { requireDeclared: true }) === "UNDECLARED");
check("and no red where it is not", found(`<div data-archetype="fact-rows"><dl>${row("A", "$1")}</dl></div>`) === "");
check("a score's unit in its cell is a red (71 /100)", found(`<div data-hero-rows data-answer="position">${row("Clean dealing", "71 /100", ' data-placed="clean-dealing"')}</div>`) === "UNIT IN CELL");
check("a slot whose own rows declare another type than the slot", found(`<div data-slot="hire" data-answer="money">${list("share", row("Rate", "8%"))}</div>`) === "SLOT TYPE");
check("a rate per hundred under its label is a share", found(list("share", row("Vacancies per 100 jobs", "2.8"))) === "");
check("a range of years under its label is time", found(list("time", row("Director ban, years", "2 to 15"))) === "");
check("a fold's head can carry the unit of its bare numbers", found(fold("time", "The steps, in days", row("Registration", "1") + row("Bank account", "21"))) === "");
check("a bare count in a money list is the wrong type", found(list("money", row("Steps in all", "5"))) === "WRONG TYPE");
check("the classes by name", classifyRow({ value: "$1" }) === "money" && classifyRow({ value: "8%" }) === "share" && classifyRow({ value: "Easy" }) === "state" && classifyRow({ value: "3", label: "Notice, weeks" }) === "time" && classifyRow({ value: "3" }) === "count" && classifyRow({ value: "71", placed: true }) === "position" && classifyRow({ value: "\u2013" }) === null);

/* THE GATE'S WIRING. */
const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("the gate reads the country surface of the harness list statically, requires every list declared, and reds an empty scan", /surface === "country"/.test(gate) && /requireDeclared: true/.test(gate) && /new JSDOM\(/.test(gate) && !/chromium/.test(gate) && /no country render/.test(gate) && /read no list/.test(gate), GATE, "read the country renders of scripts/harness/pages.json with jsdom, requireDeclared, and red a list with no country page, a missing render or a render with no list");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/answer_type: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t1c.txt`: exit 1, `Cannot find module` for `scripts/lib/answer_type.mjs`.

- [ ] **Step 3: Write the reading** `scripts/lib/answer_type.mjs`:

```js
/**
 * scripts/lib/answer_type.mjs , ONE ANSWER TYPE A LIST, READ FROM THE MARKUP (plan 2026-10-13 country-page-journey, Task 1C; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, sections 3 and 6: "a new chain gate reads each row's value
 * class and reds a list that mixes money, time, share, position or state"; his words of 2026-10-13, "in a declarative section you cannot
 * switch from words to numbers").
 *
 * A LIST is an element carrying `data-answer` (money, share, time, position, state, dated-pair, table, doors); its ROWS are the elements
 * carrying `data-value` whose nearest `data-answer` ancestor is the list. A row's CLASS is read from its value's text and, for a bare
 * number, from its label (the row's `[data-label]`) or the fold's head (`summary [data-label]`), because the unit lives there (spec
 * section 3: "units sit in the label or the column head, never in the cell"):
 *   position  a row carrying `data-placed` (a figure placed among the countries), whatever its unit;
 *   state     no digit in the value;
 *   money     a currency sign, or pence ("43.2p");
 *   share     a percent sign, or a bare number whose label or head says "per 100";
 *   time      a time word in the value, or a bare number whose label or head ends with one;
 *   count     any other bare number.
 * THE RULES:
 *   WRONG TYPE   a row whose class is not its list's type (a dated pair is read for its date instead; a table's columns are UNIT MIX's,
 *                in check_model_laws.mjs; doors hold no value class);
 *   UNIT IN CELL a value with a unit after its last digit (days, weeks, months, years, hours, "/100", "/mo", "a week", "an hour", "a
 *                month", "a year", "per");
 *   FOLD ROWS    an answer fold (`[data-fold="answer"]`) of fewer than two rows or more than eight;
 *   UNDECLARED   with `requireDeclared`, a fact-rows list, a detail panel or the board's rows that declare no type;
 *   SLOT TYPE    a slot (`[data-slot]`) whose own fact rows, outside its folds, declare another type than the slot.
 * ITS BLIND SPOT, stated: it reads text, not meaning ("12" under "Steps in all" is a count; a figure written in words reads as a state);
 * a value outside `data-value` is unread; a closed fold's rows are read, because the markup holds them and the plus is part of its
 * section.
 */
export const LIST_TYPES = ["money", "share", "time", "position", "state", "dated-pair", "table", "doors"];
const TIME_WORD = /\b(days?|weeks?|months?|years?|hours?)\b/i;
const TIME_END = /\b(days?|weeks?|months?|years?|hours?)$/i;
const UNIT_AFTER = /\d[\d.,]*\s*(?:[KMB]\b)?\s*(?:\/\s*\d+|\/\s*mo\b|\b(?:days?|weeks?|months?|years?|hours?)\b|\ba (?:week|month|year)\b|\ban hour\b|\bper\b)/i;
const DATE = /\b\d{1,2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{4}\b/;
const fold = (s) => (s || "").replace(/[\s\u00a0]+/g, " ").trim();

/** The class of one row. */
export function classifyRow({ value, label = "", head = "", placed = false }) {
  const v = fold(value);
  if (!v || /^[\u2013-]$/.test(v)) return null;
  if (placed) return "position";
  if (!/\d/.test(v)) return "state";
  if (/[£$€]/.test(v) || /\d\s?p\b/.test(v)) return "money";
  if (/%/.test(v)) return "share";
  if (TIME_WORD.test(v)) return "time";
  const l = fold(label);
  const h = fold(head);
  if (/\bper 100\b/i.test(l) || /\bper 100\b/i.test(h)) return "share";
  if (TIME_END.test(l) || TIME_END.test(h)) return "time";
  return "count";
}

/** A value that carries its unit after its last digit. */
export function unitInCell(value) {
  return UNIT_AFTER.test(fold(value));
}

/** Reads one parsed render or fragment. */
export function readAnswerTypes(doc, { requireDeclared = false } = {}) {
  const root = doc.querySelector("main") || doc.body;
  const findings = [];
  const where = (el) => el.closest("[data-slot]")?.getAttribute("data-slot") || el.closest("[data-block]")?.getAttribute("data-block") || "page";
  const lists = [...root.querySelectorAll("[data-answer]")];
  let rowsRead = 0;
  for (const list of lists) {
    const type = list.getAttribute("data-answer");
    if (!LIST_TYPES.includes(type)) { findings.push({ rule: "WRONG TYPE", where: where(list), detail: `a list declares "${type}", not one of ${LIST_TYPES.join(", ")}` }); continue; }
    const head = list.matches('[data-fold="answer"]') ? list.querySelector("summary [data-label]")?.textContent ?? "" : "";
    const values = [...list.querySelectorAll("[data-value]")].filter((v) => v.parentElement?.closest("[data-answer]") === list);
    for (const v of values) {
      rowsRead++;
      const rowEl = v.closest("[data-row], [data-detail-row]") || v.parentElement;
      const label = rowEl?.querySelector("[data-label]")?.textContent ?? "";
      const text = v.textContent ?? "";
      if (type === "dated-pair") {
        if (!DATE.test(rowEl?.textContent ?? "")) findings.push({ rule: "WRONG TYPE", where: where(list), detail: `a dated pair with no date: "${fold(rowEl?.textContent).slice(0, 60)}"` });
        continue;
      }
      if (type === "table" || type === "doors") continue;
      const placed = !!(rowEl && (rowEl.hasAttribute("data-placed") || rowEl.closest("[data-placed]")));
      const cls = classifyRow({ value: text, label, head, placed });
      if (cls && cls !== type) findings.push({ rule: "WRONG TYPE", where: where(list), detail: `"${fold(label)}" reads ${cls} ("${fold(text)}") in a ${type} list` });
      if (unitInCell(text)) findings.push({ rule: "UNIT IN CELL", where: where(list), detail: `"${fold(text)}" under "${fold(label)}": the unit belongs in the label or the head` });
    }
    if (list.matches('[data-fold="answer"]') && (values.length < 2 || values.length > 8)) findings.push({ rule: "FOLD ROWS", where: where(list), detail: `an answer fold of ${values.length} row(s); two to eight` });
  }
  if (requireDeclared) {
    for (const el of root.querySelectorAll('[data-archetype="fact-rows"], [data-archetype="detail-panel"], [data-hero-rows]')) {
      if (!el.hasAttribute("data-answer")) findings.push({ rule: "UNDECLARED", where: where(el), detail: `a ${el.getAttribute("data-archetype") ?? "hero rows"} list declares no answer type` });
    }
  }
  for (const slot of root.querySelectorAll("[data-slot]")) {
    const st = slot.getAttribute("data-answer");
    if (st === "table" || st === "doors") continue;
    for (const l of slot.querySelectorAll('[data-archetype="fact-rows"][data-answer]')) {
      if (l.closest("details") || l.closest("[data-slot]") !== slot) continue;
      if (l.getAttribute("data-answer") !== st) findings.push({ rule: "SLOT TYPE", where: slot.getAttribute("data-slot"), detail: `the slot answers ${st} and its own rows declare ${l.getAttribute("data-answer")}` });
    }
  }
  return { lists: lists.length, rows: rowsRead, findings };
}
```

- [ ] **Step 4: Write the gate** `scripts/harness/check_answer_type.mjs`:

```js
/**
 * check_answer_type , ONE ANSWER TYPE A LIST (plan 2026-10-13 country-page-journey, Task 1C; spec sections 3 and 6). On every country render
 * the chain draws (the country entries of scripts/harness/pages.json), every list declares its type and holds rows of that type alone, its
 * units out of the cells, each fold two to eight rows, each slot's own rows its type; read by scripts/lib/answer_type.mjs, whose header
 * states what a class is and its blind spot. Not a ratchet. No browser: it parses the renders pages-fresh writes, so it also runs on Vercel.
 *
 *   node scripts/harness/check_answer_type.mjs --list[=scripts/harness/pages.json]
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { preflight } from "./preflight.mjs";
import { readAnswerTypes } from "../lib/answer_type.mjs";
import { red, redSummary } from "../lib/red.mjs";

preflight({ name: "check_answer_type" });

const RULE = "answer-type";
const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.filter((p) => p.surface === "country").map((p) => `${p.surface}-${p.slugs.join("-")}`);
const REMEDY = "give each list its slot's type (data-answer) and its rows one class: a row of another type moves behind the plus in its own list under its own head; a unit goes into the label or the head; a fold holds two to eight rows";
const reds = [];
if (pages.length === 0) reds.push({ file: LIST, detail: "no country render in the list: the gate read nothing", remedy: "keep the country entries in scripts/harness/pages.json" });
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { reds.push({ file, detail: `${name}: no country render to read`, remedy: "run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names" }); continue; }
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  const r = readAnswerTypes(doc, { requireDeclared: true });
  console.log(`  ${name}: ${r.lists} list(s), ${r.rows} row(s), ${r.findings.length} finding(s)`);
  if (r.lists === 0) reds.push({ file, detail: `${name}: the gate read no list on this render`, remedy: REMEDY });
  for (const f of r.findings) reds.push({ file, detail: `${name} #${f.where}: ${f.rule}: ${f.detail}`, remedy: REMEDY });
}
for (const f of reds) red({ rule: RULE, ...f });
if (reds.length) { redSummary(RULE, reds.length, REMEDY, `${pages.length} country render(s)`); process.exit(1); }
console.log(`PASS answer-type: ${pages.length} country render(s), every list one type.`);
```

The wiring check reads "no country render" and "read no list" from the strings above.

- [ ] **Step 5: Run the test, then the gate.** Test to `t1c-b.txt`: all PASS, exit 0. With fresh renders (RENDER the list to `t1c-render.txt`), `node scripts/harness/check_answer_type.mjs --list > scratchpad/journey/t1c-gate.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1c-gate.txt`. Expected: exit 1, UNDECLARED on every fact-rows list, detail panel and the board's rows on all four countries (today nothing declares a type), and no other rule (nothing declares one to mix). Record each page's count of lists.

- [ ] **Step 6: Wire it.** After the `country-slots` entry in `scripts/prebuild_all.ts`:

```ts
  /* ONE ANSWER TYPE A LIST (plan 2026-10-13 country-page-journey, Task 1C; his words of 2026-10-13, "in a declarative section you cannot
     switch from words to numbers"): every list on a country render declares its type and holds that type alone, units out of the cells,
     folds of two to eight rows (scripts/lib/answer_type.mjs). Static; its reading's fixtures beside it. */
  { name: "answer-type", script: "scripts/harness/check_answer_type.mjs", args: ["--list"] },
  { name: "answer-type-reader", script: "tests/spine/answer_type.test.ts" },
```

Stage the three new files; COUNTS to `t1c-counts.txt`; GATES `--only=pages-fresh,answer-type-reader,answer-type,harness-preflight,counts-fresh,gate-conflicts` to `t1c-gates.txt`: `answer-type` red as in Step 5, the rest PASS.

- [ ] **Step 7: Commit.** `scripts/lib/answer_type.mjs`, `scripts/harness/check_answer_type.mjs`, `tests/spine/answer_type.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:answer-type: one answer type a list, gated on every country render (value classes, units out of the cells, folds of two to eight), red on today's pages (plan 2026-10-13 country-page-journey, Task 1C)`.

---

### Task 1D: The mark rule, red on today's renders

**Files:**
- Test: `tests/spine/signal_marks.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `answer-type-reader`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 1A's `OWNER_DIRECTION`.
- Produces: gate `signal-marks`. The markup contract: a mark is `[data-signal="<1..5>"][data-measure="<key>"]`; a placed figure's row or focal (`[data-row]`, `[data-focal-row]`) carries `data-placed="<key>"` and, where a directed measure draws no mark, `data-no-signal="set"` (a set under 20) or `"fill"` (a fill value); the page's key is `[data-signal-key]`. Task 2 appends the recomputed states (STATE).

- [ ] **Step 1: Write the failing test** `tests/spine/signal_marks.test.ts`:

```ts
/**
 * THE SIGNAL'S MARK RULE (plan 2026-10-13 country-page-journey, Task 1D; spec section 4, and section 8: "the signal's direction table read
 * for every mark printed"). Over the country renders pages-fresh writes, statically:
 *   NAMED   every mark ([data-signal]) names a measure (data-measure) of the direction table (src/lib/spine/owner_direction.ts) whose
 *           direction is lower or higher, and a state from 1 to 5;
 *   PLACED  every placed figure ([data-placed]) names a measure of the table; where the measure has a direction its row or focal holds its
 *           mark, unless it says why not (data-no-signal: "set", under 20 countries hold it; "fill", the file's stand-in value); where the
 *           measure has none, no mark;
 *   KEY     a page that draws a mark carries the one-line key ([data-signal-key]) once;
 *   READ    each country render holds at least one placed figure (a rule that reads nothing is no rule).
 * BLIND SPOT, stated: it reads the stamps the builders write, not the arithmetic; Task 2's STATE checks recompute the states printed for
 * the measures they can read from the files.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/signal_marks.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "signal-marks";
const REMEDY = "stamp each placed figure with its measure (data-placed), draw the signal beside it where the direction table gives the measure a direction (src/components/spine/signal/Signal.tsx), none where it gives none, and carry the page's one key line";
let failed = 0;
const check = (label: string, ok: boolean, file = "src/components/spine/country/country-view.tsx") => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TABLE = OWNER_DIRECTION as Record<string, { direction: string }>;

const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
check(`country renders to read (${pages.length})`, pages.length > 0, "scripts/harness/pages.json");
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  const main = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document.querySelector("main");
  if (!main) { check(`${name}: the render holds a main`, false, file); continue; }
  const marks = [...main.querySelectorAll("[data-signal]")];
  const badMarks = marks.filter((m) => !/^[1-5]$/.test(m.getAttribute("data-signal") ?? "") || !["lower", "higher"].includes(TABLE[m.getAttribute("data-measure") ?? ""]?.direction ?? "")).map((m) => `${m.getAttribute("data-measure")}=${m.getAttribute("data-signal")}`);
  check(`${name} NAMED: every mark names a directed measure and a state 1 to 5 (${marks.length} marks; bad: ${badMarks.join(", ") || "none"})`, badMarks.length === 0);
  const placed = [...main.querySelectorAll("[data-placed]")];
  check(`${name} READ: at least one placed figure on the render (${placed.length})`, placed.length > 0);
  const faults: string[] = [];
  for (const el of placed) {
    const m = el.getAttribute("data-placed") ?? "";
    const dir = TABLE[m]?.direction;
    const box = el.matches("[data-row], [data-focal-row]") ? el : el.closest("[data-row], [data-focal-row]") ?? el;
    const has = !!box.querySelector(`[data-signal][data-measure="${m}"]`);
    const why = box.getAttribute("data-no-signal") ?? el.getAttribute("data-no-signal");
    if (!dir) faults.push(`${m}: a placed measure the direction table does not name`);
    else if (dir === "none" && has) faults.push(`${m}: a mark on a measure with no owner direction`);
    else if (dir !== "none" && !has && why !== "set" && why !== "fill") faults.push(`${m}: a directed measure placed without its mark or its reason`);
  }
  check(`${name} PLACED: every placed figure follows the table (${faults.join("; ") || "all"})`, faults.length === 0);
  const keys = main.querySelectorAll("[data-signal-key]").length;
  check(`${name} KEY: ${marks.length ? "one key line for its marks" : "no mark, so no key is owed"} (${keys})`, marks.length === 0 ? keys <= 1 : keys === 1);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/signal_marks: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t1d.txt`. Expected: exit 1, `READ` red on all four countries ("at least one placed figure on the render (0)"); NAMED, PLACED and KEY pass vacuously on each, which is why READ stands beside them.

- [ ] **Step 3: Wire it.** After the `answer-type-reader` entry:

```ts
  /* THE SIGNAL'S MARK RULE (plan 2026-10-13 country-page-journey, Task 1D; spec section 4): every mark on a country render names a directed
     measure of the direction table, every placed figure follows it, the page carries its one key. Static. */
  { name: "signal-marks", script: "tests/spine/signal_marks.test.ts" },
```

Stage the test; COUNTS to `t1d-counts.txt`; GATES `--only=pages-fresh,signal-marks,counts-fresh,gate-conflicts` to `t1d-gates.txt`: `signal-marks` red as in Step 2, the rest PASS.

- [ ] **Step 4: Commit.** The test, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:signal-marks: every mark names a directed measure and every placed figure follows the direction table, gated on the country renders, red on today's pages (plan 2026-10-13 country-page-journey, Task 1D)`.

---

### Task 1E: The browser checks read inside a closed plus, and KIND ADJACENT reads zones

**Files:**
- Create: `scripts/lib/open_panels.mjs`, `scripts/harness/check_panels_opened.mjs`
- Modify: `scripts/harness/check_model_laws.mjs`, `scripts/harness/check_page_holes.mjs`, `scripts/harness/check_page_laws.mjs`, `scripts/harness/probe_page.mjs`, `scripts/verify_art_direction.mjs`, `scripts/verify_full_width_sitewide.mjs`, `scripts/verify_gathered_emptiness.mjs`, `scripts/lib/measure_pages.mjs`, `scripts/lib/page_renders.mjs`
- Modify: `scripts/prebuild_all.ts` (after `signal-marks`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Produces: `openPanels() => number` (runs inside a page: opens every closed `<details>` under main, `name` removed first, and returns how many it opened); `OPENED = " (panels open)"`; `eachPageAtWidths(widths, fn, { opened?: boolean })` and `eachPage(width, fn, opts)` returning `openedResult` beside `result`; `pageRenders({ list })` reads `process.env.HARNESS_PAGES_LIST` when set. Gate `panels-opened` (browser). Every one of the seven checks reports a finding only the open page makes with `OPENED` after its detail.

- [ ] **Step 1: Write the failing gate** `scripts/harness/check_panels_opened.mjs` (Review Focus 2's planted page is its last fixture):

```js
/**
 * check_panels_opened , EVERY BROWSER CHECK READS INSIDE A CLOSED PLUS (plan 2026-10-13 country-page-journey, Task 1E; spec section 5: "every
 * browser check that reads a section's content opens the panels first (seven skip a closed panel today: their reading is fixed in the same
 * change, each a red first on a planted closed panel)"). It writes planted pages, each hiding one fault of one check's kind behind a closed
 * <details>, runs that check on it as the chain runs it, and holds the check's output to a finding marked " (panels open)"; and it plants
 * two bar lists on neighbouring zones and holds the page laws to KIND ADJACENT (Review Focus 2: clause 64 read on zones).
 * BLIND SPOT, stated: each fixture proves that one check opens the panels and reads one rule inside them, not every rule; the planted sizes
 * are set to trip the named rule, so a change to that rule's threshold can need the fixture resized.
 *
 *   node scripts/harness/check_panels_opened.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";
import { red, redSummary } from "../lib/red.mjs";

await requireBrowser("panels-opened", "whether the seven browser checks read inside a closed plus, and KIND ADJACENT on zones");
preflight({ browser: true, name: "check_panels_opened" });

const RULE = "panels-opened";
const DIR = "scratchpad/journey/panels";
const PAGES_DIR = "scratchpad/harness/pages";
mkdirSync(DIR, { recursive: true });
const zone = (inner) => `<section data-zone="lone" data-tone="tint"><div data-zone-level=""><div data-zone-cell="" class="min-w-0">${inner}</div></div></section>`;
const card = (id, inner, style = "width:900px", attrs = "") => `<div id="${id}" data-block="${id}" data-card="" class="spine-card"${attrs} style="${style}"><div data-rail=""><h3 data-rail-title="">Planted</h3></div>${inner}</div>`;
const shut = (inner) => `<details><summary>More</summary>${inner}</details>`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><title>planted</title></head><body style="margin:0;font-family:sans-serif"><main style="width:1120px;margin:0 auto;padding:16px">${body}</main></body></html>`;
const PLANTS = {
  /* model laws, ROW SENTENCE: a five-word label behind the plus. */
  laws: page(zone(card("planted", `<p>Two lines.</p>${shut(`<dl><div data-detail-row><dt data-label>A label of five words</dt><dd><span class="fig">1</span></dd></div><div data-detail-row><dt data-label>Short</dt><dd><span class="fig">2</span></dd></div></dl>`)}`))),
  /* page holes, WHITE SPACE: the open plus grows its column and leaves the other empty inside the card. */
  holes: page(zone(card("planted", `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div>${shut(`<div style="height:900px;background:#555"></div>`)}</div><div><p>Short</p></div></div>`))),
  /* page laws, TEXT OUT OF BOX: an unbroken line behind the plus runs out of its 300px card. */
  pageLaws: page(zone(card("planted", `<p>One line.</p>${shut(`<p style="white-space:nowrap">${"Unbroken".repeat(60)}</p>`)}`, "width:300px"))),
  /* the probe: the open plus adds height to the card's content. */
  probe: page(zone(card("planted", `<p>One line.</p>${shut(`<div style="height:400px;background:#555"></div>`)}`))),
  /* art direction: accent text behind the plus (the gate's own accent colours), more than a card's budget. */
  art: page(zone(card("planted", `<p>One line.</p>${shut(`<p><span style="color:rgb(194,65,12)">$1</span> <span style="color:rgb(194,65,12)">$2</span> <span style="color:rgb(194,65,12)">$3</span> <span style="color:rgb(194,65,12)">$4</span></p>`)}`))),
  /* full width: a narrow section whose open plus spans the column. */
  wide: page(zone(card("planted", `<p style="width:300px">Narrow.</p>${shut(`<div style="width:1088px;height:40px;background:#555"></div>`)}`, "width:auto"))),
  /* gathered emptiness, E6: the open plus leaves a blank beside it in a two-column card. */
  empty: page(zone(card("planted", `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div>${shut(`<div style="height:900px;background:#555"></div>`)}</div><div><p>Short</p></div></div>`))),
  /* KIND ADJACENT on zones (Review Focus 2): two visual cards of one kind on neighbouring zones. */
  kind: page(zone(card("bars-a", `<p>Bars A</p>`, "width:900px", ' data-archetype="bar-list" data-visual="1"')) + zone(card("bars-b", `<p>Bars B</p>`, "width:900px", ' data-archetype="bar-list" data-visual="1"'))),
};
for (const [k, html] of Object.entries(PLANTS)) writeFileSync(`${DIR}/${k}.html`, html, "utf8");
/* The gates that read the harness list read a list of one planted page (scripts/lib/page_renders.mjs reads HARNESS_PAGES_LIST). */
writeFileSync(`${PAGES_DIR}/country-ZZART.html`, PLANTS.art, "utf8");
writeFileSync(`${PAGES_DIR}/country-ZZEMPTY.html`, PLANTS.empty, "utf8");
writeFileSync(`${DIR}/art.json`, JSON.stringify({ pages: [{ surface: "country", slugs: ["ZZART"] }] }), "utf8");
writeFileSync(`${DIR}/empty.json`, JSON.stringify({ pages: [{ surface: "country", slugs: ["ZZEMPTY"] }] }), "utf8");

const run = (args, env = {}) => { const r = spawnSync(process.execPath, args, { encoding: "utf8", env: { ...process.env, ...env }, maxBuffer: 32 * 1024 * 1024 }); return `${r.stdout ?? ""}${r.stderr ?? ""}`; };
const CASES = [
  { check: "scripts/harness/check_model_laws.mjs", out: () => run(["scripts/harness/check_model_laws.mjs", `${DIR}/laws.html`]), want: /ROW SENTENCE[^\n]*\(panels open\)/ },
  { check: "scripts/harness/check_page_holes.mjs", out: () => run(["scripts/harness/check_page_holes.mjs", `${DIR}/holes.html`]), want: /WHITE SPACE[^\n]*\(panels open\)/ },
  { check: "scripts/harness/check_page_laws.mjs", out: () => run(["scripts/harness/check_page_laws.mjs", `${DIR}/pageLaws.html`]), want: /TEXT OUT OF BOX[^\n]*\(panels open\)/ },
  { check: "scripts/harness/probe_page.mjs", out: () => run(["scripts/harness/probe_page.mjs", `${DIR}/probe.html`, "1280"]), want: /panels open[\s\S]*planted \d+x\d+ \(content \d+\)/ },
  { check: "scripts/verify_art_direction.mjs", out: () => run(["scripts/verify_art_direction.mjs"], { HARNESS_PAGES_LIST: `${DIR}/art.json` }), want: /\(panels open\)/ },
  { check: "scripts/verify_full_width_sitewide.mjs", out: () => run(["scripts/verify_full_width_sitewide.mjs", "--pages", `planted=${DIR}/wide.html`]), want: /\(panels open\)/ },
  { check: "scripts/verify_gathered_emptiness.mjs", out: () => run(["scripts/verify_gathered_emptiness.mjs"], { HARNESS_PAGES_LIST: `${DIR}/empty.json` }), want: /\(panels open\)/ },
  { check: "scripts/harness/check_page_laws.mjs (KIND ADJACENT)", out: () => run(["scripts/harness/check_page_laws.mjs", `${DIR}/kind.html`]), want: /KIND ADJACENT[^\n]*neighbouring levels/ },
];
let failed = 0;
for (const c of CASES) {
  const out = c.out();
  writeFileSync(`${DIR}/${c.check.replace(/[^a-z_]+/gi, "-")}.out.txt`, out, "utf8");
  if (c.want.test(out)) console.log(`PASS  ${c.check}: the planted fault is read`);
  else { failed++; red({ rule: RULE, file: c.check.split(" ")[0], detail: `${c.check}: the planted fault was not reported (its output is in ${DIR})`, remedy: "read the page again with every plus open (scripts/lib/open_panels.mjs) and report a finding only the open page makes with ' (panels open)'; read KIND ADJACENT's levels as zones" }); }
}
rmSync(`${PAGES_DIR}/country-ZZART.html`, { force: true });
rmSync(`${PAGES_DIR}/country-ZZEMPTY.html`, { force: true });
if (failed) { redSummary(RULE, failed, "every browser check reads inside a closed plus (spec section 5)", `${CASES.length} planted pages`); process.exit(1); }
console.log(`PASS panels-opened: ${CASES.length} planted pages read by their checks.`);
```

- [ ] **Step 2: Run it to see it fail.** `node scripts/harness/check_panels_opened.mjs > scratchpad/journey/t1e.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1e.txt` (nothing else running: eight browser runs, one after another). Expected: exit 1, eight reds: no check marks a finding " (panels open)", and the page laws say nothing of KIND ADJACENT on the planted zones. For each check, read its output file in `scratchpad/journey/panels/`: the planted fault must be absent (the check skipped the closed plus). If a fault already shows closed, its plant is resized (taller, wider, more accents) until the closed reading misses it, and the report says how.

- [ ] **Step 3: The shared helper** `scripts/lib/open_panels.mjs`:

```js
/**
 * scripts/lib/open_panels.mjs , THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5). `openPanels` runs
 * inside a page (a check hands it to Playwright; it reads nothing from this file's scope): it opens every closed <details> under main,
 * removing `name` first because grouped panels close one another, and returns how many it opened. A check reads the page as it arrives
 * (every panel closed, the state a reader meets) and then, where this opened any, reads it again; a finding only the second reading makes
 * is reported with OPENED after its detail. The readings that compare two sections' heights or count the page's levels stay closed: a
 * plus a reader opened is a state he chose.
 * ITS BLIND SPOT, stated: it opens native <details> only, the site's one disclosure; a panel a script draws on a click is not opened.
 */
export function openPanels() {
  let n = 0;
  for (const d of document.querySelectorAll("main details")) {
    d.removeAttribute("name");
    if (!d.open) { d.open = true; n++; }
  }
  return n;
}

export const OPENED = " (panels open)";
```

In `scripts/lib/page_renders.mjs`, `export function pageRenders({ kinds = ["fresh", "frozen"], list = HARNESS_LIST } = {}) {` becomes `export function pageRenders({ kinds = ["fresh", "frozen"], list = process.env.HARNESS_PAGES_LIST || HARNESS_LIST } = {}) {`, and its header gains the line ` * HARNESS_PAGES_LIST, when set, names another list (scripts/harness/check_panels_opened.mjs points it at a planted page; the chain never sets it).`

In `scripts/lib/measure_pages.mjs`: `import { pageRenders } from "./page_renders.mjs";` is followed by `import { openPanels } from "./open_panels.mjs";`; `export async function eachPage(width, fn) {` and its body become `export async function eachPage(width, fn, opts = {}) {` / `  return (await eachPageAtWidths([width], fn, opts))[0].result;`; `export async function eachPageAtWidths(widths, fn) {` becomes `export async function eachPageAtWidths(widths, fn, { opened = false } = {}) {`; and the line `          perPage.push({ name: e.name, key: e.key, kind: e.kind, path: e.path, result: await p.evaluate(fn) });` becomes:

```js
          const result = await p.evaluate(fn);
          /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E): with `opened`, the page is read again with every plus open
             (scripts/lib/open_panels.mjs), and the gate judges both readings. */
          const openedResult = opened && (await p.evaluate(openPanels)) ? await p.evaluate(fn) : null;
          perPage.push({ name: e.name, key: e.key, kind: e.kind, path: e.path, result, openedResult });
```

The doc comment above `eachPageAtWidths` gains: "With `{ opened: true }` each page also carries `openedResult`, the same measurement with every plus open (null where the page holds none)."

- [ ] **Step 4: The seven checks.**

1. `scripts/harness/check_model_laws.mjs`. After `import { requireBrowser } from "../lib/local_only.mjs";` add `import { openPanels, OPENED } from "../lib/open_panels.mjs";`. After the line `    const { found, unmeasured: um, blocks, floor: pageFloor } = await page.evaluate(inPage, { floor, wide: w === WIDTHS[0], noAnswerRelief: name.startsWith("cell-") ? 2 : 0 });` insert:

```js
    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): the rules read the page again with every plus open;
       a finding only the open page makes is the plus's, named so. The page's counts (BLOCK FLOOR, LONE CARD, EDGE) are read once, closed. */
    if (await page.evaluate(openPanels)) {
      const again = await page.evaluate(inPage, { floor, wide: false, noAnswerRelief: name.startsWith("cell-") ? 2 : 0 });
      const had = new Set(found.map((f) => `${f.id}\u241f${f.rule}\u241f${f.detail}`));
      for (const f of again.found) if (!had.has(`${f.id}\u241f${f.rule}\u241f${f.detail}`)) found.push({ ...f, detail: `${f.detail}${OPENED}` });
    }
```

   The header comment's paragraph that ends "Planted and watched: with the panel opened in the render the four rows fire, closed they do not." gains the sentence: "Since plan 2026-10-13 (country-page-journey, Task 1E) the file reads every page a second time with its panels open and reports what only that reading finds with \" (panels open)\"; this skip is the first reading's."

2. `scripts/harness/check_page_holes.mjs`. After `import { accentWalk } from "../lib/accent_walk.mjs";` add `import { openPanels, OPENED } from "../lib/open_panels.mjs";`. Before the line `    if (shots) {` insert:

```js
    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): the card rules read again with every plus open; a red
       only the open page makes is the plus's, named so. The accents, the sideways scroll and NO SECTIONS were read on the closed page. */
    if (await page.evaluate(openPanels)) {
      const ow = await page.evaluate(inPage);
      const ruleOf = (msg) => msg.split(":")[0];
      const said = new Set(reds.filter((r) => r.page === name && r.w === w).map((r) => `${r.id}\u241f${ruleOf(r.msg)}`));
      const sayOpen = (id, msg) => { if (!said.has(`${id}\u241f${ruleOf(msg)}`)) red(name, w, id, `${msg}${OPENED}`); };
      for (const c of SECTION == null ? ow.cut : ow.cut.filter((x) => x.id === SECTION)) sayOpen(c.id, `ROWS CUT: the chart declares ${c.expect} rows and draws ${c.drawn}`);
      if (w === WIDTHS[0]) for (const h of SECTION == null ? ow.hierarchy : ow.hierarchy.filter((x) => x.id === SECTION)) sayOpen(h.id, `${h.rule}: ${h.detail}`);
      for (const c of SECTION == null ? ow.out : ow.out.filter((x) => x.id === SECTION)) {
        const minW = Math.max(120, c.cardW / 4), minH = Math.max(120, c.cardH / 4);
        if (c.holeW >= minW && c.holeH >= minH) sayOpen(c.id, `WHITE SPACE: a blank rectangle ${c.holeW}x${c.holeH} inside a ${c.cardW}x${c.cardH} card${c.siblings > 1 ? ` (one of ${c.siblings} in its band)` : ""}`);
      }
    }
```

   The comment `/* A CLOSED PLUS IS NOT INK (sys:closed-plus-ink, 2026-09-19).` block gains the sentence "The first reading's rule; the opened reading (plan 2026-10-13, Task 1E) reads the plus's content as ink."

3. `scripts/harness/check_page_laws.mjs`. After `import { requireBrowser } from "../lib/local_only.mjs";` add `import { openPanels, OPENED } from "../lib/open_panels.mjs";`. In `inPage`'s parameters add `opened = false` beside `width` and `pageName`, and give every block that reads levels, zones or the whole page (the blocks commented THE LEVELS, the zone rules ZONE TONES, ZONE PAD and ZONE SPLIT, and THE PAGE) `&& !opened` in its guarding condition, so the opened reading runs the card rules alone. Replace the line `    for (const r of walk.reds) reds.push({ page: name, w, ...r });` with:

```js
    for (const r of walk.reds) reds.push({ page: name, w, ...r });
    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): the card rules read again with every plus open; a red
       only the open page makes is the plus's, named so. Levels, zones and the page's kinds are read closed (a plus a reader opened is his). */
    if (await page.evaluate(openPanels)) {
      const ow = await page.evaluate(inPage, { width: w, pageName: name, opened: true });
      const said = new Set(walk.reds.map((r) => `${r.id}\u241f${r.rule}`));
      for (const r of ow.reds) if (!said.has(`${r.id}\u241f${r.rule}`)) reds.push({ page: name, w, ...r, msg: `${r.msg}${OPENED}` });
    }
```

   KIND ADJACENT reads zones. Replace the two lines `    const levels = [...document.querySelectorAll("main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length && !b.parentElement.closest("[data-band], [data-hero]"));` and `    const levelOf = (card) => card.closest("[data-band], [data-hero]");` with:

```js
    /* A ZONE IS A LEVEL (plan 2026-10-13 country-page-journey, Task 1E; MODEL PART 10 keeps clause 64 on a band page): the old reading found a
       level by [data-band] or [data-hero] alone, which no zone carries, so on a band page it compared the hero and nothing else. A card's level
       is its outermost zone, band or hero; the levels are those, in page order. */
    const LEVEL = "[data-zone], [data-band], [data-hero]";
    const levels = [...document.querySelectorAll("main [data-zone], main [data-band], main [data-hero]")].filter((b) => b.getClientRects().length && !b.parentElement.closest(LEVEL));
    const levelOf = (card) => { let l = card.closest(LEVEL); while (l && l.parentElement && l.parentElement.closest(LEVEL)) l = l.parentElement.closest(LEVEL); return l; };
```

   and the header's line `64 KIND ADJACENT      two visual cards of one kind on one level, in one` gains, at the end of its entry, "(a level is a zone on a band page, since plan 2026-10-13)".

4. `scripts/harness/probe_page.mjs`. After `import { preflight } from "./preflight.mjs";` add `import { openPanels } from "../lib/open_panels.mjs";`. The arrow handed to `p.evaluate` at `const rows = await p.evaluate(() => {` moves, unchanged, into `const measureCards = () => { ... };` declared above the widths loop, and the call becomes `const rows = await p.evaluate(measureCards);`. After the line `  for (const r of rows) console.log(r.band.padEnd(44), r.cards.map((c) => \`${c.id} ${c.w}x${c.h} (content ${c.natural})\`).join(" | "));` add:

```js
  /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E): the same table with every plus open, so a card's height with its folds
     open is read beside its height on arrival. */
  if (await p.evaluate(openPanels)) {
    console.log(`--- ${w}, panels open ---`);
    for (const r of await p.evaluate(measureCards)) console.log(r.band.padEnd(44), r.cards.map((c) => `${c.id} ${c.w}x${c.h} (content ${c.natural})`).join(" | "));
  }
```

5. `scripts/verify_art_direction.mjs`. After `import { requireBrowser } from "./lib/local_only.mjs";` add `import { OPENED } from "./lib/open_panels.mjs";`. `const pages = await eachPage(1440, collect);` becomes `const pages = await eachPage(1440, collect, { opened: true });`. The per-page judging moves into a function: everything inside `for (const entry of pages) {` from `  const lines = [];` up to (not including) the line `  console.log(\`\n  ${nameWithKey(entry)}   ${lines.length} finding(s)\`);` moves, unchanged but for one rewrite, into `function judge(result) { const counts = {}; const lines = []; ... return { counts, lines }; }` declared above the loop; the rewrite: each pair `now[\`${name}:<key>\`] = <n>;` with `total += <n>;` inside it becomes `counts[<key>] = <n>;` (every rule block in that span sets its count in that one shape; `grep -n "now\[" scripts/verify_art_direction.mjs > scratchpad/journey/t1e-now.txt` lists them first). The loop then reads:

```js
for (const entry of pages) {
  /* The baseline is keyed by the page's OLD name (`key`); the line below prints the harness's name with the key beside it when they differ. */
  const { key: name, result } = entry;
  /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): each rule judged on the page as it arrives and with
     every plus open; a rule's count is the larger of the two, and a finding only the open page makes is named so. */
  const closed = judge(result);
  const open = entry.openedResult ? judge(entry.openedResult) : { counts: {}, lines: [] };
  for (const k of new Set([...Object.keys(closed.counts), ...Object.keys(open.counts)])) {
    const v = Math.max(closed.counts[k] ?? 0, open.counts[k] ?? 0);
    now[`${name}:${k}`] = v;
    total += v;
  }
  const lines = [...closed.lines, ...open.lines.filter((l) => !closed.lines.includes(l)).map((l) => `${l}${OPENED}`)];
  console.log(`\n  ${nameWithKey(entry)}   ${lines.length} finding(s)`);
  lines.forEach((l) => console.log("   " + l));
}
```

   The comment above `const inDeadDetails = (e) => {` gains: "The first reading's rule; since plan 2026-10-13 (Task 1E) the page is judged again with every plus open."

6. `scripts/verify_full_width_sitewide.mjs`. After `import { requireBrowser } from "./lib/local_only.mjs";` add `import { openPanels, OPENED } from "./lib/open_panels.mjs";`. Replace `    const offenders = sections.filter((s) => s.fail);` with:

```js
    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): every plus open, the sections measured again; a section
       full width only when its plus is open is an offender of the open page, named so. */
    const openedSections = (await page.evaluate(openPanels)) ? (await page.evaluate(measure)).sections : [];
    const closedFails = sections.filter((s) => s.fail);
    const seen = new Set(closedFails.map((s) => s.label));
    const offenders = [...closedFails, ...openedSections.filter((s) => s.fail && !seen.has(s.label)).map((s) => ({ ...s, label: `${s.label}${OPENED}` }))];
```

7. `scripts/verify_gathered_emptiness.mjs`. After `import { requireBrowser } from "./lib/local_only.mjs";` add `import { OPENED } from "./lib/open_panels.mjs";`. `await eachPageAtWidths(WIDTHS, measure)` becomes `await eachPageAtWidths(WIDTHS, measure, { opened: true })`; inside that loop, after `    const { key, result } = entry;` add `    const openedOnly = (entry.openedResult ?? []).filter((o) => o.hole && !result.some((c) => c.label === o.label && c.hole)).map((o) => ({ ...o, label: \`${o.label}${OPENED}\` }));` and `    for (const s of result) {` becomes `    for (const s of [...result, ...openedOnly]) {`, with the comment `    /* THE OPENED READING (plan 2026-10-13 country-page-journey, Task 1E): a hole only the open page holds is judged too, named so. */` above it.

- [ ] **Step 5: Run the planted pages.** `node scripts/harness/check_panels_opened.mjs > scratchpad/journey/t1e-b.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1e-b.txt`: eight PASS, exit 0. Then the meta-gates: GATES `--only=harness-preflight,browser-gates-skip,strip-comments` to `t1e-meta.txt`: PASS.

- [ ] **Step 6: The opened reading over every render** (Review Focus 2 and 4). RENDER the list to `t1e-render.txt`; GATES `--only=pages-fresh,harness-laws,harness-page-filter,harness-page-laws,art-direction,fullwidth-sitewide,gathered-emptiness` to `t1e-gates.txt`. Every red this run adds against Task 1B's state is a fault the old reading could not see: list each in the report by page, rule and detail. A label, unit or copy fault on a city, trade, industry, district or home page is fixed at its source in this task (the copy rules hold; the builder or `src/lib/spine/copy.ts` that writes it), one fix one rerun; a fault on a country page is the rebuild's (Tasks 3 and 4) and is listed; any other kind (a section to move for KIND ADJACENT, a hole) goes to the controller before a baseline is touched, with the line. No baseline rises.

- [ ] **Step 7: Wire it.** After the `signal-marks` entry:

```ts
  /* EVERY BROWSER CHECK READS INSIDE A CLOSED PLUS (plan 2026-10-13 country-page-journey, Task 1E; spec section 5): seven checks read each page
     again with its panels open (scripts/lib/open_panels.mjs), proved on planted pages, and KIND ADJACENT reads zones. A browser gate. */
  { name: "panels-opened", script: "scripts/harness/check_panels_opened.mjs", browser: true },
```

Stage the two new files; COUNTS to `t1e-counts.txt`; GATES `--only=panels-opened,harness-preflight,browser-gates-skip,counts-fresh,gate-conflicts` to `t1e-gates2.txt`: PASS.

- [ ] **Step 8: Commit.** The two new files, the seven checks, `scripts/lib/measure_pages.mjs`, `scripts/lib/page_renders.mjs`, every source Step 6 fixed, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:panels-opened: seven browser checks read every page again with its plus open, each proved on a planted closed panel, and KIND ADJACENT reads zones (plan 2026-10-13 country-page-journey, Task 1E)`.

---

### Task 1F: The paywall's shape on slots, red on today's locked page

**Files:**
- Modify: `scripts/harness/check_paywall.mjs` (the levels' reading)
- Modify: `tests/monetization/levels.test.ts` (the slots' case)

**Interfaces:**
- Consumes: the slot markup (`data-slot`, `data-stage`); `lockedLevelKeys(levels)` unchanged.
- Produces: `paywall-shape` reading the country page's levels as its slots: stage 1 and stage 7 outside, each of stages 2 to 6 a chapter tagged on every slot it holds; the locked blocks exactly the locked slots'.

- [ ] **Step 1: The slots' case in the levels test.** In `tests/monetization/levels.test.ts`, the label `"/gb locks eight of twelve chapter levels"` becomes `"a page of zones carried forward (the /gb of 2026-10-09) locks eight of twelve chapter levels"`, and after that check add:

```ts
/* THE COUNTRY PAGE'S SLOTS (plan 2026-10-13 country-page-journey, Task 1F; spec section 8: his ruling 18 by analogy, each stage's first slot
   open and every later slot of the stage locked): the masthead's two slots and the close stand outside, each stage tags its slots. */
const gbSlots: LevelRef[] = [
  { key: "tax-on-profit", outside: true }, { key: "where-it-stands", outside: true },
  { key: "customers", chapter: "2" }, { key: "spend", chapter: "2" }, { key: "trades", chapter: "2" },
  { key: "open", chapter: "3" },
  { key: "hire", chapter: "4" }, { key: "running-costs", chapter: "4" }, { key: "credit", chapter: "4" }, { key: "filings", chapter: "4" }, { key: "peers", chapter: "4" },
  { key: "lasting", chapter: "5" }, { key: "exit", chapter: "5" },
  { key: "dealings", chapter: "6" }, { key: "changes", chapter: "6" },
  { key: "close", outside: true },
];
check("/gb's slots lock eight: every slot after its stage's first", same(lockedLevelKeys(gbSlots), ["spend", "trades", "running-costs", "credit", "filings", "peers", "exit", "changes"]));
check("a thin country's stages of one slot lock nothing but what follows a first", same(lockedLevelKeys(gbSlots.filter((s) => !["trades", "filings", "peers", "lasting", "changes"].includes(s.key))), ["spend", "running-costs", "credit"]));
```

Run it to `scratchpad/journey/t1f-levels.txt`: PASS (the function already does it; the case pins the reading).

- [ ] **Step 2: The check reads slots.** In `scripts/harness/check_paywall.mjs`, replace the block from `  // 1 and 2: the levels as drawn, and what locks.` through the line `  for (const l of levels) if (l.chapter && l.zone.querySelector("[data-locked]")) fault(p, \`chapter ${l.chapter}'s first level ("${l.label}") holds a locked section (rule 2, each chapter opens free)\`);` with:

```js
  // 1 and 2: the levels as drawn, and what locks. ON THE COUNTRY PAGE THE SLOTS ARE THE LEVELS (plan 2026-10-13 country-page-journey,
  // Task 1F; spec section 8: his ruling 18 by analogy, each stage's first slot open, every later slot of the stage locked): a slot is
  // [data-slot] with its stage's number; stages 1 and 7 (the masthead and the close) stand outside; a locked slot is its LockedSection,
  // which carries the slot's stamps. Every other page reads its zones, as before.
  const slotted = p.stem === "country-gb";
  let levels;
  if (slotted) {
    const seen = new Set();
    levels = [...doc.querySelectorAll("[data-slot]")].filter((s) => { const k = s.getAttribute("data-slot"); if (seen.has(k)) return false; seen.add(k); return true; }).map((s) => {
      const stage = Number(s.getAttribute("data-stage") ?? "0");
      return { key: s.getAttribute("data-slot"), chapter: stage >= 2 && stage <= 6 ? String(stage) : null, outside: !(stage >= 2 && stage <= 6), label: s.getAttribute("data-slot"), zone: s };
    });
    if (levels.length === 0) fault(p, "the country page draws no slot ([data-slot]): its levels are its slots (spec section 8)");
  } else {
    let inChapters = false;
    levels = [...doc.querySelectorAll("section[data-zone]")].map((z, i) => {
      const head = z.querySelector("[data-chapter-head]")?.getAttribute("data-chapter-head") ?? null;
      if (head) inChapters = true;
      const label = z.getAttribute("data-zone-label") ?? "";
      return { key: `z${i}`, chapter: head, outside: !inChapters || label === COPY.close.kicker, label, zone: z };
    });
  }
  const lockedZones = lockedLevelKeys(levels.map(({ key, chapter, outside }) => ({ key, chapter, outside })));
  const blocksOf = (l) => (slotted ? [l.zone.getAttribute("data-block") ?? l.zone.id] : topBlocks(l.zone).map((b) => b.getAttribute("data-block")));
  const expected = levels.filter((l) => lockedZones.has(l.key)).flatMap(blocksOf).sort();
  const locked = [...doc.querySelectorAll("[data-locked]")];
  const got = locked.map((b) => b.getAttribute("data-block") ?? b.id).sort();
  if (expected.length === 0) fault(p, "no level locks: the page drew no chapters, or the render is not a locked one");
  if (JSON.stringify(got) !== JSON.stringify(expected)) fault(p, `locked ${got.join(", ") || "nothing"}; the levels lock ${expected.join(", ") || "nothing"} (rule 1, his ruling 18)`);
  const firsts = new Set();
  for (const l of levels) {
    if (!l.chapter || firsts.has(l.chapter)) continue;
    firsts.add(l.chapter);
    const first = slotted ? l.zone.hasAttribute("data-locked") : !!l.zone.querySelector("[data-locked]");
    if (first) fault(p, `${slotted ? "stage" : "chapter"} ${l.chapter}'s first level ("${l.label}") holds a locked section (rule 2, each ${slotted ? "stage" : "chapter"} opens free)`);
  }
```

The header's rule 1 line gains ", on the country page its slots (plan 2026-10-13)" after "the levels read as drawn".

- [ ] **Step 3: Run it to see it red.** `node node_modules/tsx/dist/cli.mjs scripts/harness/check_paywall.mjs > scratchpad/journey/t1f.txt 2>&1; echo "exit $?" >> scratchpad/journey/t1f.txt`. Expected: exit 1; country-gb: "the country page draws no slot ([data-slot])" and "no level locks"; the city and the trade page PASS as before (their reading is unchanged).

- [ ] **Step 4: Commit.** `scripts/harness/check_paywall.mjs`, `tests/monetization/levels.test.ts`; message `journey:paywall-slots: the paywall's shape reads the country page's slots as its levels (each stage's first open), red on today's locked page (plan 2026-10-13 country-page-journey, Task 1F)`.

---

### Task 2: The signal

**Files:**
- Create: `src/lib/spine/signal.ts`, `src/components/spine/signal/tokens.ts`, `src/components/spine/signal/Signal.tsx`
- Test: `tests/spine/signal.test.ts` (create); `tests/spine/signal_marks.test.ts` (append STATE)
- Modify: `scripts/verify_palette_membership.mjs` (the named allowlist), `src/components/spine/charts/WorldRange.tsx` (the reference mark a tick, Review Focus 1)
- Modify: `scripts/prebuild_all.ts` (after `panels-opened`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 1A's `OWNER_DIRECTION`, `directionOf`, `MeasureKey`; `COPY.journey.signal`.
- Produces: `type SignalState = 1 | 2 | 3 | 4 | 5`; `SIGNAL_SET_FLOOR = 20`; `SIGNAL_ANGLE: Record<SignalState, number>`; `signalRank(value, values) => { lower; higher; total }`; `signalState(value, values, direction) => SignalState | null`; `type Signalled = { state: SignalState; measure: MeasureKey }`; `signalFor(measure, value, values) => { signal: Signalled | null; noSignal: "set" | null }`. `Signal({ state, measure, size?: "row" | "focal" })` (stamps `data-signal`, `data-measure`, `role="img"`, `aria-label` and `title` the state's word); `SignalKey()` (stamps `data-signal-key`, `data-line`). `SIGNAL_FILL` in `src/components/spine/signal/tokens.ts`, imported by `Signal.tsx` alone. Gate `signal`.

- [ ] **Step 1: Write the failing test** `tests/spine/signal.test.ts` (Review Focus 1's checks are its last part):

```ts
/**
 * THE SIGNAL (plan 2026-10-13 country-page-journey, Task 2; spec section 4): the state's arithmetic (src/lib/spine/signal.ts) on fixtures and
 * on the UK's electricity; the triangle (src/components/spine/signal/Signal.tsx) at its five angles and two sizes, its word its accessible
 * name; the five colours held by one file and named once in the palette gate; and, on the country renders, every triangle a signal
 * (Review Focus 1: the world track's reference mark is a tick, never a second triangle beside the signal).
 * BLIND SPOT, stated: on the renders a triangle is read as a CSS border triangle or a three-point polygon; one drawn another way is unread.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/signal.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { signalState, signalFor, SIGNAL_ANGLE, SIGNAL_SET_FLOOR } from "../../src/lib/spine/signal";
import { Signal, SignalKey } from "../../src/components/spine/signal/Signal";
import { WorldRangeRows } from "../../src/components/spine/charts/WorldRange";
import { worldValues, worldRange } from "../../src/lib/spine/world_stats";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "signal";
const LIB = "src/lib/spine/signal.ts";
const REMEDY = "turn the placement rank by the measure's direction into fifths (no mark under twenty), draw one solid triangle at the state's angle in its token, its word its name, the five tokens in one file the palette gate names, and no other triangle on the page";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

/* THE ARITHMETIC: a hundred members, 1 to 100. */
const set = Array.from({ length: 100 }, (_, i) => i + 1);
const higher = (v: number) => signalState(v, set, "higher");
const lower = (v: number) => signalState(v, set, "lower");
check(`higher is easier: the fifths by the share strictly below (100: ${higher(100)}, 80: ${higher(80)}, 61: ${higher(61)}, 60: ${higher(60)}, 41: ${higher(41)}, 40: ${higher(40)}, 21: ${higher(21)}, 20: ${higher(20)})`,
  higher(100) === 1 && higher(81) === 1 && higher(80) === 2 && higher(61) === 2 && higher(60) === 3 && higher(41) === 3 && higher(40) === 4 && higher(21) === 4 && higher(20) === 5 && higher(1) === 5);
check(`lower is easier: the fifths by the share strictly above (1: ${lower(1)}, 100: ${lower(100)}, 50: ${lower(50)})`, lower(1) === 1 && lower(100) === 5 && lower(50) === 3);
check("a tie is neither below nor above", signalState(5, Array(30).fill(5), "higher") === 5 && signalState(5, Array(30).fill(5), "lower") === 5);
check(`no state under a set of ${SIGNAL_SET_FLOOR}, none without a direction`, signalState(5, set.slice(0, 19), "higher") === null && signalState(5, set, "none") === null);
check("a measure with no owner direction draws nothing and owes no reason", JSON.stringify(signalFor("salary", 50, set)) === JSON.stringify({ signal: null, noSignal: null }));
check("a directed measure on a small set draws nothing and says so", JSON.stringify(signalFor("electricity", 5, set.slice(0, 10))) === JSON.stringify({ signal: null, noSignal: "set" }));
const gbKwh = getCountryProfile("GB").electricity_usd_per_kwh_commercial as number;
check(`the UK's business electricity, the world's dearest, is very poor (${signalFor("electricity", gbKwh, worldValues("electricity_usd_per_kwh_commercial")).signal?.state})`, signalFor("electricity", gbKwh, worldValues("electricity_usd_per_kwh_commercial")).signal?.state === 5);

/* THE TRIANGLE. */
const SPEC_FILL = { 1: "#1b5e20", 2: "#2e7d32", 3: "#8a6d00", 4: "#c62828", 5: "#7f0000" } as const;
for (const s of [1, 2, 3, 4, 5] as const) {
  const html = renderToStaticMarkup(React.createElement(Signal, { state: s, measure: "electricity" }));
  const word = COPY.journey.signal.words[s];
  check(`state ${s}: one polygon turned ${SIGNAL_ANGLE[s]} degrees about the centre, filled ${SPEC_FILL[s]}, named "${word}"`,
    (html.match(/<polygon/g) ?? []).length === 1 && html.includes(`rotate(${SIGNAL_ANGLE[s]} 8 8)`) && html.includes(`fill="${SPEC_FILL[s]}"`) && html.includes(`aria-label="${word}"`) && html.includes(`title="${word}"`) && html.includes('role="img"') && html.includes(`data-signal="${s}"`) && html.includes('data-measure="electricity"') && html.includes('aria-hidden="true"'),
    "src/components/spine/signal/Signal.tsx");
}
check("the angles are the spec's: up, up-left, left, down-left, down", JSON.stringify(SIGNAL_ANGLE) === JSON.stringify({ 1: 0, 2: -45, 3: -90, 4: -135, 5: 180 }));
check("16px beside a row's figure, 20px beside a 30px figure", /h-4 w-4/.test(renderToStaticMarkup(React.createElement(Signal, { state: 3, measure: "electricity" }))) && /h-5 w-5/.test(renderToStaticMarkup(React.createElement(Signal, { state: 3, measure: "electricity", size: "focal" }))), "src/components/spine/signal/Signal.tsx");
check("the page's key: one line, twelve words at most", /data-signal-key=""/.test(renderToStaticMarkup(React.createElement(SignalKey))) && COPY.journey.signal.key.split(/\s+/).length <= 12, "src/components/spine/signal/Signal.tsx");

/* THE FIVE COLOURS: one file holds them, Signal.tsx alone imports it, the palette gate names it once. */
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
const files: string[] = [];
const walk = (d: string) => { for (const e of readdirSync(d)) { const p = join(d, e).replace(/\\/g, "/"); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css|mjs)$/.test(p)) files.push(p); } };
walk("src");
const HEX = Object.values(SPEC_FILL);
const holders = files.filter((f) => { const src = strip(readFileSync(f, "utf8")).toLowerCase(); return HEX.some((h) => src.includes(h)); });
check(`the five colours stand in one file, the signal's tokens (${holders.join(", ") || "none"})`, JSON.stringify(holders) === JSON.stringify(["src/components/spine/signal/tokens.ts"]), "src/components/spine/signal/tokens.ts");
const importers = files.filter((f) => /from "(?:\.\/tokens|@\/components\/spine\/signal\/tokens)"/.test(readFileSync(f, "utf8")));
check(`only Signal.tsx imports the tokens (${importers.join(", ")})`, JSON.stringify(importers) === JSON.stringify(["src/components/spine/signal/Signal.tsx"]), "src/components/spine/signal/Signal.tsx");
const gate = readFileSync("scripts/verify_palette_membership.mjs", "utf8");
check("the palette gate names one allowlist: the tokens file and the five colours, nothing else", /const SIGNAL_ALLOW = \{ file: "src\/components\/spine\/signal\/tokens\.ts"/.test(gate) && HEX.every((h) => gate.includes(`"${h}"`)) && (gate.match(/SIGNAL_ALLOW = /g) ?? []).length === 1, "scripts/verify_palette_membership.mjs");

/* REVIEW FOCUS 1: THE SIGNAL IS THE PAGE'S ONE TRIANGLE. The reference on a world track is a tick. */
const range = worldRange("bank_lending_rate_pct");
const track = range ? renderToStaticMarkup(React.createElement(WorldRangeRows, { rows: [{ key: "lending", label: "Rate", value: 0.066, display: "6.6%", range, fmt: (v: number) => `${v}`, refs: [{ key: "base", label: "Central bank rate", value: 0.0375 }] }] })) : "";
const refDoc = new JSDOM(`<main>${track}</main>`).window.document;
const ref = refDoc.querySelector('[data-mark="reference"]');
check("the world track's reference mark is a tick, not a triangle", !!ref && !/border-x-transparent/.test(ref.getAttribute("class") ?? "") && /\bw-0\.5\b/.test(ref.getAttribute("class") ?? ""), "src/components/spine/charts/WorldRange.tsx");
const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
let read = 0;
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  read++;
  const main = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document.querySelector("main");
  const css = [...(main?.querySelectorAll("[class]") ?? [])].filter((el) => { const c = el.getAttribute("class") ?? ""; return /border-x-transparent/.test(c) && /border-[tb]-\[/.test(c); });
  const polys = [...(main?.querySelectorAll("polygon") ?? [])].filter((p) => (p.getAttribute("points") ?? "").trim().split(/\s+/).length === 3);
  const stray = [...css, ...polys].filter((el) => !el.closest("[data-signal]"));
  check(`${name}: every triangle on the page is a signal (${stray.length} other)`, stray.length === 0, "src/components/spine/charts/WorldRange.tsx");
}
check(`country renders read (${read})`, read > 0, "scripts/harness/pages.json");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/signal: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t2.txt`: exit 1, `Cannot find module` for `src/lib/spine/signal`.

- [ ] **Step 3: The state** `src/lib/spine/signal.ts`:

```ts
/**
 * src/lib/spine/signal.ts , THE SIGNAL'S STATE (plan 2026-10-13 country-page-journey, Task 2; spec section 4: "the placement rank among the
 * countries holding the measure, turned by its direction, in fifths; no mark under a set of 20").
 *
 * THE ARITHMETIC, the whole of it. Among the members holding the measure (the figure's own country included), `lower` hold a figure
 * strictly below it and `higher` strictly above; a tie is neither. Where lower is easier for an owner (src/lib/spine/owner_direction.ts),
 * the share is higher / total; where higher is easier, lower / total. Fifths: 0.8 and up very good (1), 0.6 good (2), 0.4 middle (3), 0.2
 * poor (4), under 0.2 very poor (5). No state for a measure with no owner direction, nor under a set of twenty. Computed at render, never
 * stored (GUIDELINES' derived-accents rule). A caller passes the set it places the figure in (fills already left out, world_stats.ts), and
 * never places a fill value.
 * ITS BLIND SPOT, stated: it ranks what it is handed; a set of interpolated values ranks as if measured (146 of 197 profiles are
 * interpolated), which the placement sentence beside it shares.
 */
import { directionOf, type MeasureKey, type OwnerDirection } from "@/lib/spine/owner_direction";

export type SignalState = 1 | 2 | 3 | 4 | 5;
export type Signalled = { state: SignalState; measure: MeasureKey };

export const SIGNAL_SET_FLOOR = 20;

/** The triangle's angle for each state (spec section 4): up very good, up-left good, left middle, down-left poor, down very poor. */
export const SIGNAL_ANGLE: Record<SignalState, number> = { 1: 0, 2: -45, 3: -90, 4: -135, 5: 180 };

export function signalRank(value: number, values: readonly number[]): { lower: number; higher: number; total: number } {
  let lower = 0, higher = 0, total = 0;
  if (!Number.isFinite(value)) return { lower, higher, total };
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    total++;
    if (v < value) lower++;
    else if (v > value) higher++;
  }
  return { lower, higher, total };
}

export function signalState(value: number, values: readonly number[], direction: OwnerDirection): SignalState | null {
  if (direction === "none") return null;
  const { lower, higher, total } = signalRank(value, values);
  if (total < SIGNAL_SET_FLOOR) return null;
  const share = (direction === "higher" ? lower : higher) / total;
  return share >= 0.8 ? 1 : share >= 0.6 ? 2 : share >= 0.4 ? 3 : share >= 0.2 ? 4 : 5;
}

/** The mark for one placed figure, or the reason it draws none: no owner direction owes no reason; a set under twenty says "set". */
export function signalFor(measure: MeasureKey, value: number, values: readonly number[]): { signal: Signalled | null; noSignal: "set" | null } {
  const direction = directionOf(measure);
  if (direction === "none") return { signal: null, noSignal: null };
  const state = signalState(value, values, direction);
  return state == null ? { signal: null, noSignal: "set" } : { signal: { state, measure }, noSignal: null };
}
```

- [ ] **Step 4: The tokens and the triangle.** `src/components/spine/signal/tokens.ts`:

```ts
/**
 * THE SIGNAL'S FIVE COLOURS (plan 2026-10-13 country-page-journey, Task 2; spec section 4; his ruling of 2026-10-13, "Green to red, only in the
 * signal"), declared once and read by ./Signal.tsx alone: the one named exception to the terracotta-and-greys palette
 * (scripts/verify_palette_membership.mjs, SIGNAL_ALLOW, names this file). On white 7.87, 5.13, 4.92, 5.62 and 11.04 to 1, each 3:1 or more on
 * every ground the site paints (WCAG 1.4.11). The triangle's fill and nothing else: never text, a bar, a row tint or a chart.
 */
export const SIGNAL_FILL = { 1: "#1b5e20", 2: "#2e7d32", 3: "#8a6d00", 4: "#c62828", 5: "#7f0000" } as const;
```

`src/components/spine/signal/Signal.tsx`:

```tsx
/**
 * THE SIGNAL (plan 2026-10-13 country-page-journey, Task 2; spec section 4; his ruling of 2026-10-13, "Green to red, only in the signal").
 * One solid triangle whose angle carries the state (src/lib/spine/signal.ts, SIGNAL_ANGLE): up very good, tilted up-left good, pointing left
 * middle, down-left poor, pointing down very poor. Its colour repeats the angle, from the five tokens of ./tokens.ts. Never colour alone: the
 * angle carries the state, the accessible label and the title say its word (COPY.journey.signal.words), and the page's key line says what the
 * angles mean. 16px beside a row's figure, 20px beside a section's 30px figure, its own box right after the figure. The polygon's centroid
 * is the box's centre, so every angle turns in place.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { SIGNAL_ANGLE, type SignalState } from "@/lib/spine/signal";
import type { MeasureKey } from "@/lib/spine/owner_direction";
import { SIGNAL_FILL } from "./tokens";

export function Signal({ state, measure, size = "row" }: { state: SignalState; measure: MeasureKey; size?: "row" | "focal" }) {
  const word = COPY.journey.signal.words[state];
  return (
    <span data-signal={String(state)} data-measure={measure} role="img" aria-label={word} title={word} className={`inline-flex shrink-0 self-center ${size === "focal" ? "h-5 w-5" : "h-4 w-4"}`}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="h-full w-full">
        <polygon points="8,0.7 14,11.7 2,11.7" transform={`rotate(${SIGNAL_ANGLE[state]} 8 8)`} fill={SIGNAL_FILL[state]} />
      </svg>
    </span>
  );
}

/** THE PAGE'S ONE KEY (spec section 4: "each page carries a one-line key"): what the angles mean. */
export function SignalKey() {
  return <p data-signal-key="" data-line="" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{COPY.journey.signal.key}</p>;
}
```

- [ ] **Step 5: The palette gate's one allowlist.** In `scripts/verify_palette_membership.mjs`, after the line `const NEUTRAL_S_MAX = 12;` insert:

```js
/* THE SIGNAL'S NAMED EXCEPTION (plan 2026-10-13 country-page-journey, Task 2; his ruling of 2026-10-13, "Green to red, only in the signal";
   spec section 4): the good-or-bad triangle's five colours are legal in its one tokens file and nowhere else. Any other off-palette hue in
   that file, and these five in any other file, count as before. A list named here, never a raised baseline. */
const SIGNAL_ALLOW = { file: "src/components/spine/signal/tokens.ts", hexes: new Set(["#1b5e20", "#2e7d32", "#8a6d00", "#c62828", "#7f0000"]) };
const signalAllowed = (f, hex) => f === SIGNAL_ALLOW.file && SIGNAL_ALLOW.hexes.has(hex.toLowerCase());
```

and in `main()`, the line `    for (const m of src.match(/#[0-9a-fA-F]{6}\b/g) || []) if (!isPaletteLegal(m)) n++;` becomes `    for (const m of src.match(/#[0-9a-fA-F]{6}\b/g) || []) if (!isPaletteLegal(m) && !signalAllowed(f, m)) n++;`. The header's "No exceptions." paragraph gains, after its first sentence: "One named exception since 2026-10-13, his: the signal's five colours, inside its tokens file alone (SIGNAL_ALLOW below)."

- [ ] **Step 6: The reference mark is a tick** (Review Focus 1). In `src/components/spine/charts/WorldRange.tsx`, the reference span's class `absolute -top-2.5 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-[var(--c-ink)]` becomes `absolute -top-2 h-2 w-0.5 -translate-x-1/2 rounded-sm bg-[var(--c-ink)]`, and the key's glyph class `inline-block h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[var(--c-ink)]` becomes `inline-block h-2.5 w-0.5 rounded-sm bg-[var(--c-ink)]`. Above the reference span add `{/* THE REFERENCE IS A TICK (plan 2026-10-13 country-page-journey, Task 2): a triangle on a country page is the signal's alone, so the central bank's rate stands as a short ink bar above the track, and its key draws the same bar. */}`; the type's comment that says "a small ink triangle above the track at its value" reads "a short ink bar above the track at its value".

- [ ] **Step 7: STATE, appended to the mark rule.** In `tests/spine/signal_marks.test.ts`, add the imports `import { signalState } from "../../src/lib/spine/signal";`, `import { directionOf, type MeasureKey } from "../../src/lib/spine/owner_direction";`, `import { worldValues } from "../../src/lib/spine/world_stats";` and `import { getCountryProfile, listCountryProfiles } from "../../src/lib/economic_profile";`, a line ` *   STATE   the state of each mark whose measure this file can read from the files (electricity, the lending rate, clean dealing), recomputed.` in the header's list, and, inside the page loop after the `KEY` check:

```ts
  /* STATE (plan 2026-10-13 country-page-journey, Task 2): the marks this file can recompute from the files. */
  const FIELD: Record<string, string> = { electricity: "electricity_usd_per_kwh_commercial", "lending-rate": "bank_lending_rate_pct", "clean-dealing": "corruption_perception_index" };
  const iso2 = name.slice("country-".length);
  for (const m of marks) {
    const measure = m.getAttribute("data-measure") ?? "";
    const field = FIELD[measure];
    if (!field) continue;
    const value = (getCountryProfile(iso2) as unknown as Record<string, number>)[field];
    const values = measure === "clean-dealing" ? listCountryProfiles().map((p) => (p as unknown as Record<string, number>)[field]).filter((v) => Number.isFinite(v)) : worldValues(field);
    const want = signalState(value, values, directionOf(measure as MeasureKey));
    check(`${name} STATE: ${measure} prints ${m.getAttribute("data-signal")}, the arithmetic gives ${want}`, String(want) === m.getAttribute("data-signal"), "src/lib/spine/signal.ts");
  }
```

- [ ] **Step 8: Run, plant, run.** Test to `t2-b.txt`: all PASS, exit 0 (the renders' check reads the four countries; the reference tick shows on country-GB's lending track once Task 3F draws it, and no other triangle stands today). GATES `--only=palette-membership,no-hardcoded-hex,token-steps` to `t2-gates.txt`: PASS. Then plant once: add `const x = "#2e7d32";` to `src/lib/spine/signal.ts`, run `node scripts/verify_palette_membership.mjs > scratchpad/journey/t2-plant.txt 2>&1; echo "exit $?" >> scratchpad/journey/t2-plant.txt` (exit 1, the file named), remove the line, run again to `t2-unplant.txt` (exit 0). TYPECHECK to `t2-tsc.txt`: 0.

- [ ] **Step 9: Wire it.** After the `panels-opened` entry:

```ts
  /* THE SIGNAL (plan 2026-10-13 country-page-journey, Task 2; his ruling of 2026-10-13, "Green to red, only in the signal"): the state's
     fifths, the triangle at its five angles, the five colours in one file the palette gate names, and no other triangle on a country page.
     No browser. */
  { name: "signal", script: "tests/spine/signal.test.ts" },
```

Stage the new files; COUNTS to `t2-counts.txt`; GATES `--only=pages-fresh,signal,signal-marks,palette-membership,counts-fresh,gate-conflicts` to `t2-gates2.txt`: `signal` PASS, `signal-marks` red on READ as before, the rest PASS.

- [ ] **Step 10: Commit.** `src/lib/spine/signal.ts`, `src/components/spine/signal/tokens.ts`, `src/components/spine/signal/Signal.tsx`, `scripts/verify_palette_membership.mjs`, `src/components/spine/charts/WorldRange.tsx`, `tests/spine/signal.test.ts`, `tests/spine/signal_marks.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:signal: one triangle, five angles, five colours in one file the palette gate names (his one exception), its word its name, and the world track's reference a tick (plan 2026-10-13 country-page-journey, Task 2)`.

---

### Task 3A: The shared pieces: the answer fold, the declared list, the focal's signal, the slot's frame

**Files:**
- Modify: `src/components/spine/archetypes/DetailPanel.tsx` (the answer fold, `type`; rows may link)
- Modify: `src/components/spine/archetypes/FactRows.tsx` (`answer`, `data-value`, a row's `placed`, `signal`, `noSignal`)
- Modify: `src/components/spine/kit.tsx` (Focal's `placed`, `signal`, `noSignal`)
- Modify: `src/components/spine/archetypes/ShareBar.tsx` (`data-answer="share"` on its rows, `data-value` on each share)
- Modify: `src/components/spine/charts/BarList.tsx` (`answer`, `data-value` on each figure)
- Create: `src/lib/spine/slots/types.ts`, `src/components/spine/country/Slot.tsx`
- Test: `tests/spine/answer_fold.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `signal`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 1A's `AnswerType`, `SlotId`, `slotDef`, `stageOfSlot`; Task 1C's markup contract and `readAnswerTypes`; Task 2's `Signal`, `SignalState`, `Signalled`.
- Produces: `DetailPanel({ name, summary, rows, withheldLine?, type?: AnswerType })` (with `type`, the answer fold: `data-fold="answer"`, `data-answer`, the summary's label, the rows' count and the plus at the row's end, rows `data-value`); `DetailRow` gains `href?: string`. `FactRows({ rows, className?, answer?: AnswerType })`; `FactRow` gains `placed?: MeasureKey | null`, `signal?: Signalled | null`, `noSignal?: "set" | "fill" | null`. `Focal({ ..., placed?, signal?, noSignal? })` (with `placed`, a `data-focal-row` wrapper carrying `data-placed` and the 20px signal beside the figure). `BarList({ ..., answer? })`. In `src/lib/spine/slots/types.ts`: `SlotRow`, `SlotList`, `SlotLead`, `SlotModel<D>`, `FOLD_MIN = 2`, `FOLD_MAX = 8`, `list(key, head, type, rows) => SlotList | null`, `present(xs)`, `valueClass(text) => "money" | "share" | "time" | "state" | "count" | null`. `Slot({ model, children })` and `toFactRow(row)` in `src/components/spine/country/Slot.tsx`. Gate `answer-fold`.

- [ ] **Step 1: Write the failing test** `tests/spine/answer_fold.test.ts`:

```ts
/**
 * THE SHARED PIECES OF THE JOURNEY (plan 2026-10-13 country-page-journey, Task 3A; spec sections 3 and 5): DetailPanel's answer fold (closed,
 * the head, the count and the plus at the row's end, a 44px row, two to eight rows of one type, the browser's own marker hidden), every other
 * page's panel unchanged; FactRows declaring its type, a word list in the body face; the kit's Focal carrying a signal beside a placed
 * figure, unchanged where it carries none; the slot's frame in its order with its stamps; list() refusing a plus under two rows or over eight.
 * BLIND SPOT, stated: static markup, no layout: the 44px is read as the class that sets it, the one line of the summary on the renders.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/answer_fold.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { DetailPanel } from "../../src/components/spine/archetypes/DetailPanel";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { Focal } from "../../src/components/spine/kit";
import { Slot } from "../../src/components/spine/country/Slot";
import { list, valueClass } from "../../src/lib/spine/slots/types";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "answer-fold";
const REMEDY = "the fold as spec section 5 draws it (the head, its count, the plus at the row's end, closed, 44px, two to eight rows of one type), FactRows and Focal stamping what the gates read, the slot's frame in its order";
let failed = 0;
const check = (label: string, ok: boolean, file: string) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const h = (el: React.ReactElement) => renderToStaticMarkup(el);
const doc = (html: string) => new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
const PANEL = "src/components/spine/archetypes/DetailPanel.tsx";

const rows = [{ label: "London", value: "$65K", href: "/cities/london" }, { label: "Leeds", value: "$42K" }, { label: "Bristol", value: "$44K" }];
const fold = h(React.createElement(DetailPanel, { name: "customers-cities", summary: "Customer pay by city", rows, type: "money" }));
const f = doc(fold);
const sum = f.querySelector("summary");
check("the fold is closed on arrival and stamped as an answer fold of its type", !!f.querySelector("details") && !f.querySelector("details[open]") && !!f.querySelector('[data-fold="answer"][data-answer="money"][data-rows="3"]'), PANEL);
check("the summary holds the head, then the rows' count, then the plus, the plus hidden from a screen reader", !!sum && sum.querySelector("[data-label]")?.textContent === "Customer pay by city" && sum.querySelector("[data-fold-count]")?.textContent === "3" && sum.lastElementChild?.getAttribute("aria-hidden") === "true" && sum.lastElementChild?.textContent === "+", PANEL);
check("the whole summary is a 44px row and the browser's own marker is hidden", /\bmin-h-11\b/.test(sum?.getAttribute("class") ?? "") && /\blist-none\b/.test(sum?.getAttribute("class") ?? "") && /details-marker\]:hidden/.test(sum?.getAttribute("class") ?? ""), PANEL);
check("each row's value is stamped for the answer-type gate, a row with a page links its label", f.querySelectorAll("[data-detail-row] [data-value]").length === 3 && !!f.querySelector('[data-detail-row] a[href="/cities/london"]'), PANEL);
check("the fold reads clean through the answer-type gate", readAnswerTypes(f, { requireDeclared: true }).findings.length === 0, PANEL);
const words = doc(h(React.createElement(DetailPanel, { name: "hire-hiring", summary: "How hiring goes", rows: [{ label: "Taking on staff", value: "Moderate" }, { label: "Letting go", value: "Easy" }], type: "state" })));
check("a word list's values are words, not figures", words.querySelectorAll(".fig").length === 0 && words.querySelectorAll("[data-value]").length === 2, PANEL);
const old = h(React.createElement(DetailPanel, { name: "x", summary: "The other taxes", rows: [{ label: "VAT", value: "20%" }, { label: "Corporation tax", value: "25%" }] }));
check("without a type the panel every other page draws is unchanged (the plus first, no fold stamp)", !/data-fold=/.test(old) && /<summary[^>]*><span[^>]*>\+<\/span>/.test(old), PANEL);

const FACT = "src/components/spine/archetypes/FactRows.tsx";
const fr = doc(h(React.createElement(FactRows, { answer: "money", rows: [{ key: "a", label: "Diesel, a litre", value: "$2.59" }, { key: "b", label: "Business rates", value: "43.2p", placed: null }] })));
check("FactRows declares its type and stamps each value", !!fr.querySelector('[data-archetype="fact-rows"][data-answer="money"]') && fr.querySelectorAll("[data-value]").length === 2, FACT);
const st = doc(h(React.createElement(FactRows, { answer: "state", rows: [{ key: "a", label: "Renewal", value: "By law" }, { key: "b", label: "Repairs claim", value: "Capped" }] })));
check("a state list's values are words in the body face, never .fig", st.querySelectorAll(".fig").length === 0, FACT);
const sig = doc(h(React.createElement(FactRows, { answer: "share", rows: [{ key: "a", label: "Rate", value: "6.6%", placed: "lending-rate", signal: { state: 2, measure: "lending-rate" } }, { key: "b", label: "Card fees", value: "1.7%" }] })));
check("a placed row carries its measure and its signal in the row", !!sig.querySelector('[data-row="a"][data-placed="lending-rate"] [data-signal="2"][data-measure="lending-rate"]'), FACT);

const KIT = "src/components/spine/kit.tsx";
const plain = h(React.createElement(Focal, { figure: "$1", words: "w" }));
check("a Focal with no signal renders as before (the spacing pin's shape)", /^<div class="mb-6"><div data-focal="1" class="fig/.test(plain) && !/data-focal-row/.test(plain), KIT);
const placed = doc(h(React.createElement(Focal, { figure: "$0.32", words: "per kWh", placed: "electricity", signal: { state: 5, measure: "electricity" } })));
check("a placed Focal stands its 20px signal beside the figure, in a row carrying the measure", !!placed.querySelector('[data-focal-row][data-placed="electricity"] [data-focal="1"]') && !!placed.querySelector('[data-focal-row] [data-signal="5"] .h-full') && /h-5 w-5/.test(placed.querySelector("[data-signal]")?.getAttribute("class") ?? ""), KIT);

const SLOT = "src/components/spine/country/Slot.tsx";
const model = { id: "running-costs" as const, lead: { figure: "$0.32", words: "per kWh of business electricity", placed: "electricity" as const, signal: { state: 5 as const, measure: "electricity" as const } }, rows: { key: "rows", head: "", type: "money" as const, rows: [{ key: "diesel", label: "Diesel, a litre", value: "$2.59" }] }, more: [{ key: "premises", head: "Premises tax", type: "money" as const, rows: [{ key: "relief", label: "Full rates relief", value: "£12,000" }, { key: "rates", label: "Business rates", value: "43.2p" }] }], drawing: null, thin: false };
const s = doc(h(React.createElement(Slot, { model }, React.createElement("div", { "data-drawing": "" }))));
const box = s.querySelector('[data-slot="running-costs"]');
check("the slot's frame: its Box stamped with its slot, stage and type, its DOM id the model's", !!box && box.id === "running-costs" && box.getAttribute("data-stage") === "4" && box.getAttribute("data-answer") === "money", SLOT);
const order = [...(box?.querySelectorAll("[data-rail], [data-focal-row], [data-drawing], [data-archetype='fact-rows'], [data-fold='answer']") ?? [])].map((e) => e.hasAttribute("data-rail") ? "rail" : e.hasAttribute("data-focal-row") ? "lead" : e.hasAttribute("data-drawing") ? "drawing" : e.getAttribute("data-archetype") === "fact-rows" ? "rows" : "fold");
check(`the frame's order: opener, lead, drawing, rows, folds (${order.join(", ")})`, JSON.stringify(order) === JSON.stringify(["rail", "lead", "drawing", "rows", "fold"]), SLOT);
check("the frame reads clean through the answer-type gate", readAnswerTypes(s, { requireDeclared: true }).findings.length === 0, SLOT);
const TYPES = "src/lib/spine/slots/types.ts";
let threw = false;
try { list("x", "X", "money", Array.from({ length: 9 }, (_, i) => ({ key: String(i), label: `R${i}`, value: "$1" }))); } catch { threw = true; }
check("list(): none under two rows, a throw over eight (a caller cuts a long list by its question, never drops a row)", list("x", "X", "money", [{ key: "a", label: "A", value: "$1" }]) === null && threw, TYPES);
check("valueClass reads a value as the gate does", valueClass("$1") === "money" && valueClass("8%") === "share" && valueClass("21 days") === "time" && valueClass("Easy") === "state" && valueClass("5") === "count", TYPES);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/answer_fold: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3a.txt`: exit 1, `Cannot find module` for `src/components/spine/country/Slot`.

- [ ] **Step 3: The answer fold.** In `src/components/spine/archetypes/DetailPanel.tsx`: after `import type { Provenance } from "@/lib/spine/provenance";` add `import type { AnswerType } from "@/lib/spine/country_slots";`; `export type DetailRow = { label: string; value: string; note?: string; prov?: Provenance | null };` becomes `export type DetailRow = { label: string; value: string; note?: string; prov?: Provenance | null; /** A row with a page of its own links its label (the answer fold only). */ href?: string };`; the signature `export function DetailPanel({ name, summary, rows, withheldLine }: { name: string; summary: string; rows: DetailRow[]; withheldLine?: string | null }) {` becomes `export function DetailPanel({ name, summary, rows, withheldLine, type }: { name: string; summary: string; rows: DetailRow[]; withheldLine?: string | null; /** The answer fold's type (plan 2026-10-13 country-page-journey): given, the country page's fold; absent, the panel every other page draws. */ type?: AnswerType }) {`; and after its first line `  if (!rows || rows.length < 2) return null;` add `  if (type) return <AnswerFold name={name} summary={summary} rows={rows} type={type} />;`. At the end of the file:

```tsx
/**
 * THE ANSWER FOLD (plan 2026-10-13 country-page-journey, Task 3A; spec section 5; R6 2.3): the country page's plus. Closed on arrival; the
 * whole summary row a 44px target: the list's head as its label, the count of its rows as its figure ("their count", so no figure shown
 * closed repeats inside), the plus at the row's end, hidden from a screen reader so the summary's words are its name. Open, two to eight
 * rows of one type in place, each value stamped data-value for the answer-type gate, a word list (state) in the body face and a figure list
 * in the figure face; a row with a page of its own links its label and carries the arrow after its value. No drawing, no fold inside a
 * fold, no terracotta on hover; the browser's own marker is hidden, the signal being the page's one triangle. Every other page keeps the
 * panel above until its own pass (spec section 9).
 */
function AnswerFold({ name, summary, rows, type }: { name: string; summary: string; rows: DetailRow[]; type: AnswerType }) {
  const words = type === "state";
  return (
    <div data-archetype="detail-panel" data-rows={rows.length} data-fold="answer" data-answer={type} className="mt-6 border-t border-[var(--c-border)]">
      <details name={name} className="group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-2.5 [&::-webkit-details-marker]:hidden">
          <span data-label className="min-w-0 flex-1 text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink)]">{summary}</span>
          <span data-fold-count className="tabular-nums text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{rows.length}</span>
          <span aria-hidden="true" className="w-4 text-center text-[length:var(--t-lead)] leading-5 text-[var(--c-muted)] transition-transform group-open:rotate-45">+</span>
        </summary>
        <dl className="grid gap-2 pb-3">
          {rows.map((r, i) => (
            <div key={i} data-detail-row className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
              <dt data-label className="min-w-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{r.href ? <a href={r.href} className="underline-offset-2 hover:underline">{r.label}</a> : r.label}</dt>
              <dd className="flex items-baseline justify-end gap-2 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
                <span data-value="">{words ? <span className="font-medium">{r.value}</span> : <Fig prov={r.prov}>{r.value}</Fig>}</span>
                {r.href ? <span aria-hidden="true" className="text-[var(--c-muted)]">→</span> : null}
              </dd>
              {r.note ? <dd className="col-span-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{r.note}</dd> : null}
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
```

- [ ] **Step 4: FactRows declares its type.** In `src/components/spine/archetypes/FactRows.tsx`: after its imports add `import { Signal } from "@/components/spine/signal/Signal";`, `import type { AnswerType } from "@/lib/spine/country_slots";`, `import type { Signalled } from "@/lib/spine/signal";` and `import type { MeasureKey } from "@/lib/spine/owner_direction";`. In `export type FactRow = {`, before its closing `};`, add `  /** The measure of a figure placed among the countries (plan 2026-10-13 country-page-journey): stamped data-placed for the mark rule. */ placed?: MeasureKey | null;`, `  /** Its signal, beside the figure (src/components/spine/signal/Signal.tsx). */ signal?: Signalled | null;` and `  /** Why a directed measure draws no mark: "set" (under twenty hold it), "fill". */ noSignal?: "set" | "fill" | null;`. `export function FactRows({ rows, className = "" }: { rows: FactRow[]; className?: string }) {` becomes `export function FactRows({ rows, className = "", answer }: { rows: FactRow[]; className?: string; /** The list's answer type (plan 2026-10-13 country-page-journey): stamped data-answer; "state" sets the values as words. */ answer?: AnswerType }) {`. The row's element `      data-row={r.key}` gains, on the next line, `      {...(r.placed ? { "data-placed": r.placed } : {})}` and `      {...(r.noSignal ? { "data-no-signal": r.noSignal } : {})}`. The `<dd ...>` that holds the row's `<Fig ...>{r.value}</Fig>` gains `data-value=""`, and its child becomes:

```tsx
        {answer === "state" ? (
          /* A WORD LIST IN THE BODY FACE (plan 2026-10-13 country-page-journey, Task 3A; R6 section 3): a state is a word, never set in the figure face. */
          <span className="block text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink)]">{r.value}</span>
        ) : r.signal ? (
          /* A PLACED FIGURE AND ITS SIGNAL ON ONE LINE (spec section 4: the triangle right after the figure). */
          <span className="inline-flex items-center gap-2"><Fig className="text-[length:var(--t-lead)] leading-5 text-[var(--c-ink)]" prov={r.prov}>{r.value}</Fig><Signal state={r.signal.state} measure={r.signal.measure} /></span>
        ) : (
          <Fig className="block text-[length:var(--t-lead)] leading-5 text-[var(--c-ink)]" prov={r.prov}>{r.value}</Fig>
        )}
```

(the last branch keeps the Fig's classes exactly as the file holds them after rhythm Task 5). The list's root `<div data-archetype="fact-rows" data-rows={String(live.length)} ...>` gains `{...(answer ? { "data-answer": answer } : {})}`. The header gains a bullet: " *  - A LIST DECLARES ITS TYPE (plan 2026-10-13 country-page-journey, Task 3A): `answer` stamps data-answer and each value data-value, so the answer-type gate reads every row; a state list's values are words."

- [ ] **Step 5: The kit's Focal carries a signal.** In `src/components/spine/kit.tsx`: add `import { Signal } from "@/components/spine/signal/Signal";`, `import type { Signalled } from "@/lib/spine/signal";` and `import type { MeasureKey } from "@/lib/spine/owner_direction";` beside its other imports. In `export function Focal(`, add to the destructured props `placed = null, signal = null, noSignal = null` and to the props' type `placed?: MeasureKey | null; signal?: Signalled | null; noSignal?: "set" | "fill" | null`. Inside it, the line rendering `<div data-focal="1" ...>{figure}</div>` is assigned to `const fig = ( ... );` above the return, and in the returned wrapper it is replaced by:

```tsx
      {/* A PLACED FIGURE AND ITS SIGNAL (plan 2026-10-13 country-page-journey, Task 3A; spec section 4: 20px beside a 30px figure, its own box
          right after it): the row carries the measure for the mark rule; a figure placed nowhere renders exactly as before. */}
      {placed ? (
        <div data-focal-row="" data-placed={placed} {...(noSignal ? { "data-no-signal": noSignal } : {})} className="flex items-center gap-2">
          {fig}
          {signal ? <Signal state={signal.state} measure={signal.measure} size="focal" /> : null}
        </div>
      ) : fig}
```

The Focal's doc comment gains: "`placed`, `signal` and `noSignal` (plan 2026-10-13 country-page-journey): a figure placed among the countries stamps its measure and draws its signal beside it."

- [ ] **Step 6: The drawings that hold rows declare them.** In `src/components/spine/archetypes/ShareBar.tsx`, the rows' container `<div className={\`mt-3 grid gap-2 ...\`} data-expect-rows={live.length}>` gains `data-answer="share"`, and the span that prints `{Math.round(p.share)}{unit}` gains `data-value=""` (a share bar's rows are shares on every page). In `src/components/spine/charts/BarList.tsx`, the props gain `answer?: AnswerType` (`import type { AnswerType } from "@/lib/spine/country_slots";`), the element that carries the list's `data-archetype` gains `{...(answer ? { "data-answer": answer } : {})}`, and the element that prints an item's `display` gains `data-value=""`.

- [ ] **Step 7: The slot's types** `src/lib/spine/slots/types.ts`:

```ts
/**
 * src/lib/spine/slots/types.ts , A SLOT'S MODEL (plan 2026-10-13 country-page-journey, Task 3A; spec section 3): what a stage's builder hands
 * its component. A slot leads with one figure (`lead`, drawn at 30 by the kit's Focal, its signal beside it where placed), then rows of the
 * slot's own type (`rows`), then each list of another type behind its own plus (`more`, DetailPanel's answer fold), and the drawing its
 * component knows (`drawing`). A builder returns null where the slot's data is absent: the slot omits itself, no seat.
 */
import type { Provenance } from "@/lib/spine/provenance";
import type { AnswerType, SlotId } from "@/lib/spine/country_slots";
import type { Signalled } from "@/lib/spine/signal";
import type { MeasureKey } from "@/lib/spine/owner_direction";

export type SlotRow = { key: string; label: string; value: string; note?: string | null; prov?: Provenance | null; href?: string; placed?: MeasureKey | null; signal?: Signalled | null; noSignal?: "set" | "fill" | null };
export type SlotList = { key: string; head: string; type: AnswerType; rows: SlotRow[] };
export type SlotLead = { figure: string; words: string; prov?: Provenance | null; placement?: string | null; placed?: MeasureKey | null; signal?: Signalled | null; noSignal?: "set" | "fill" | null };
export type SlotModel<D = null> = { id: SlotId; lead: SlotLead | null; rows: SlotList | null; more: SlotList[]; drawing: D; thin: boolean };

export const FOLD_MIN = 2;
export const FOLD_MAX = 8;

/** One plus: two to eight rows of one type, or none under two. Over eight is a caller's fault (spec section 5): it cuts the list by its
 *  question, never drops a row, so this throws and the stage's test reds before a page is built. */
export function list(key: string, head: string, type: AnswerType, rows: SlotRow[]): SlotList | null {
  if (rows.length < FOLD_MIN) return null;
  if (rows.length > FOLD_MAX) throw new Error(`slots: the plus "${head}" holds ${rows.length} rows; eight at most, cut by its question`);
  return { key, head, type, rows };
}

export function present<T>(xs: ReadonlyArray<T | null | undefined>): T[] {
  return xs.filter((x): x is T => x != null);
}

/** A value's class by its text, the answer-type gate's first reading (scripts/lib/answer_type.mjs), so a builder sorts a row into the list
 *  of its type before the gate judges it. A bare number is a count here; its unit belongs in its label or its list's head. */
export function valueClass(text: string): "money" | "share" | "time" | "state" | "count" | null {
  const v = (text || "").replace(/[\s\u00a0]+/g, " ").trim();
  if (!v || /^[\u2013-]$/.test(v)) return null;
  if (!/\d/.test(v)) return "state";
  if (/[£$€]/.test(v) || /\d\s?p\b/.test(v)) return "money";
  if (/%/.test(v)) return "share";
  if (/\b(days?|weeks?|months?|years?|hours?)\b/i.test(v)) return "time";
  return "count";
}

/** A duration's number with its unit word taken out ("21 days" to "21", "6 to 12 months" to "6 to 12"), for a list whose head or label
 *  carries the unit; null where the text holds no number. */
export function bareDuration(text: string): string | null {
  const v = (text || "").replace(/[\s\u00a0]+/g, " ").trim();
  if (!/\d/.test(v)) return null;
  return v.replace(/\s*\b(days?|weeks?|months?|years?|hours?)\b/gi, "").replace(/\s+/g, " ").trim();
}
```

- [ ] **Step 8: The slot's frame** `src/components/spine/country/Slot.tsx`:

```tsx
/**
 * THE SLOT'S FRAME (plan 2026-10-13 country-page-journey, Task 3A; spec section 3): one section a slot, its parts in one order on every
 * country: the opener (the kit's Rail, the slot's heading and glyph), the lead figure at 30 (the kit's Focal, its signal beside it where
 * placed), the drawing (the stage component's, as children), the rows of the slot's type (FactRows), then each list of another type behind
 * its own plus (DetailPanel's answer fold). Its Box is stamped data-slot, data-stage and data-answer, the replicability and answer-type
 * gates' reading, and carries the registry's DOM id.
 */
import * as React from "react";
import { Box, Rail, Focal } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel, SlotRow } from "@/lib/spine/slots/types";

export const toFactRow = (r: SlotRow): FactRow => ({ key: r.key, label: r.label, value: r.value, note: r.note ?? null, prov: r.prov ?? null, placed: r.placed ?? null, signal: r.signal ?? null, noSignal: r.noSignal ?? null });

export function Slot({ model, children }: { model: SlotModel<unknown>; children?: React.ReactNode }) {
  const def = slotDef(model.id);
  const stage = stageOfSlot(model.id);
  return (
    <Box id={def.domId} data-slot={def.id} data-stage={String(stage.n)} data-answer={def.type} className="flex flex-col">
      <Rail icon={def.icon ?? undefined} kicker={def.heading} />
      {model.lead ? (
        <Focal figure={model.lead.figure} words={model.lead.words} placement={model.lead.placement ?? null} prov={model.lead.prov ?? null} placed={model.lead.placed ?? null} signal={model.lead.signal ?? null} noSignal={model.lead.noSignal ?? null} />
      ) : null}
      {children}
      {model.rows ? <FactRows answer={model.rows.type} rows={model.rows.rows.map(toFactRow)} /> : null}
      {model.more.map((m) => (
        <DetailPanel key={m.key} name={`${def.id}-${m.key}`} summary={m.head} type={m.type} rows={m.rows.map((r) => ({ label: r.label, value: r.value, note: r.note ?? undefined, prov: r.prov ?? null, href: r.href }))} />
      ))}
    </Box>
  );
}
```

- [ ] **Step 9: Run it to see it pass, and the pieces' other readers.** Test to `t3a-b.txt`: all PASS, exit 0. TYPECHECK to `t3a-tsc.txt`: 0. GATES `--only=answer-fold,spacing-pin,home-forms,home-answers,harness-archetypes,type-floor-reader,tiles-openers` to `t3a-gates.txt`: PASS (the spacing pin still reads Focal's old shape; the archetype sheet draws every other page's panel unchanged; the type floor's source scan reads the new `text-[length:var(--t-body)]` classes).

- [ ] **Step 10: Wire it.** After the `signal` entry:

```ts
  /* THE JOURNEY'S SHARED PIECES (plan 2026-10-13 country-page-journey, Task 3A; spec section 5): the answer fold, the declared list, the
     focal's signal, the slot's frame. No browser. */
  { name: "answer-fold", script: "tests/spine/answer_fold.test.ts" },
```

Stage the new files; COUNTS to `t3a-counts.txt`; GATES `--only=answer-fold,counts-fresh,gate-conflicts` to `t3a-gates2.txt`: PASS.

- [ ] **Step 11: Commit.** The seven source files, the test, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:pieces: DetailPanel's answer fold (head, count, plus at the end, two to eight rows of one type), FactRows declaring its type, the kit Focal's signal and the slot's frame (plan 2026-10-13 country-page-journey, Task 3A)`.

---

### Task 3B: Stage 1, the masthead: slot 1's thin state, slot 2's placed figures and their signals

**Files:**
- Modify: `src/lib/spine/hero_board.ts` (the thin answer, the rows' measures and signals, units into labels, "Hiring staff" out, the living cost in, the director's loan charge into the other taxes)
- Modify: `src/components/spine/archetypes/HeroBoard.tsx` (`slotted`: the slot stamps, the signal column, the key line, the taxes fold)
- Modify: `src/lib/spine/copy.ts` (`COPY.journey.boardRows`, `directorsLoan`, `signal.readout`)
- Create: `src/components/spine/country/slots/StageOrient.tsx`
- Test: `tests/spine/slots_orient.test.ts` (create); `tests/spine/hero_rows.test.ts` (the labels it names)
- Modify: `scripts/prebuild_all.ts` (after `answer-fold`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 2's `signalFor`, `Signal`, `SignalKey`; Task 3A's DetailPanel `type`; Task 1C's `readAnswerTypes`.
- Produces: `HeroBoardRow` gains `placed?: MeasureKey | null`, `signal?: Signalled | null`, `noSignal?: "set" | "fill" | null`, `readout?: string | null`; a country row's `unit` is `""` and its `level` null; `buildHeroBoard(iso2)` answers on every country whose profile holds the company rate (the regime's rate, the UK's worked figure, else the company rate under `COPY.journey.thinTax`); `heroTaxes(iso2, { company })`; `hireEase` deleted (its row left; Task 3E reads the shard's four hiring words itself). `HeroBoard({ id?, board, answers?, slotted? })`: with `slotted` the answer column is `data-slot="tax-on-profit"` (share), the rows column `data-slot="where-it-stands"` (position), each row's value `data-value`, the signal in the mark column, the key line `SignalKey`, the taxes an answer fold. `MastheadSlots({ iso2 })` in `src/components/spine/country/slots/StageOrient.tsx`. Gate `slots-orient`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_orient.test.ts`:

```ts
/**
 * STAGE 1, ORIENT (plan 2026-10-13 country-page-journey, Task 3B; spec sections 3 and 4; R5 section 5, slots 1 and 2): his masthead holds slot 1
 * (the tax on profit, its thin state the company rate under its own label, never "Not known yet") and slot 2 (the placed figures, each a
 * figure with its unit in its label and its signal where its measure has a direction; "Hiring staff" gone to slot 7), on the UK, Cambodia,
 * Afghanistan and Germany; the board read clean by the answer-type gate, its one key line drawn.
 * BLIND SPOT, stated: the builder and the archetype's markup, not the page's layout; the page is the country-slots gate's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_orient.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildHeroBoard } from "../../src/lib/spine/hero_board";
import { HeroBoard } from "../../src/components/spine/archetypes/HeroBoard";
import { signalState } from "../../src/lib/spine/signal";
import { getCountryProfile, listCountryProfiles } from "../../src/lib/economic_profile";
import { getCountryCostOfLivingIndex } from "../../src/lib/economics/country_metrics";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-orient";
const FILE = "src/lib/spine/hero_board.ts";
const REMEDY = "slot 1 answers on every country (the company rate under its own label where no regime is held); slot 2's rows carry their units in their labels, their measures and their signals; the board stamped for the gates";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const clean = listCountryProfiles().map((p) => p.corruption_perception_index).filter((v): v is number => typeof v === "number" && Number.isFinite(v));

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const b = buildHeroBoard(iso2);
  const p = getCountryProfile(iso2);
  check(`${iso2} slot 1: the board answers (${b.answer?.label}: ${b.answer?.value})`, !!b.answer);
  check(`${iso2} slot 2: no "Hiring staff" row (it is slot 7's), every row's unit in its label, no level on a country row`, !b.rows.some((r) => r.key === "hiring") && b.rows.every((r) => r.unit === "" && r.level === null));
  const row = b.rows.find((r) => r.key === "clean");
  const want = row ? signalState(p.corruption_perception_index as number, clean, "higher") : null;
  check(`${iso2} clean dealing is placed and carries its signal, ${want}`, !!row && row.placed === "clean-dealing" && row.signal?.state === want && row.label === COPY.journey.boardRows.clean);
  const salary = b.rows.find((r) => r.key === "salary-month");
  check(`${iso2} the monthly salary is placed and carries no mark (salaries: no owner direction)`, !salary || (salary.placed === "salary" && !salary.signal && salary.label === COPY.journey.boardRows.salary));
  const admin = b.rows.find((r) => r.key === "admin");
  check(`${iso2} admin ease is placed, its year in its readout, and no mark (Q3)`, !admin || (admin.placed === "admin-ease" && !admin.signal && (admin.readout ?? "").includes("2020")));
  check(`${iso2} the other taxes: a fold of two to eight shares, or none`, !b.taxes || (b.taxes.length >= 2 && b.taxes.length <= 8 && b.taxes.every((t) => /%$/.test(t.value))));
  const html = renderToStaticMarkup(React.createElement(HeroBoard, { id: "take", board: b, slotted: true }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  check(`${iso2} the masthead holds slots 1 and 2, stamped`, !!doc.querySelector('#take [data-slot="tax-on-profit"][data-stage="1"][data-answer="share"]') && !!doc.querySelector('#take [data-slot="where-it-stands"][data-stage="1"][data-answer="position"]'), "src/components/spine/archetypes/HeroBoard.tsx");
  check(`${iso2} no "Not known yet" anywhere on the board`, !/Not known yet/.test(doc.body.textContent ?? ""), "src/components/spine/archetypes/HeroBoard.tsx");
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings;
  check(`${iso2} the board reads clean through the answer-type gate (${f.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`).join("; ") || "clean"})`, f.length === 0, "src/components/spine/archetypes/HeroBoard.tsx");
  check(`${iso2} one key line under the placed figures`, doc.querySelectorAll("[data-signal-key]").length === 1, "src/components/spine/archetypes/HeroBoard.tsx");
}
const kh = buildHeroBoard("KH");
const khRate = `${Math.round((getCountryProfile("KH").corporate_income_tax_combined_pct as number) * 1000) / 10}%`;
check(`Cambodia's thin state: "${COPY.journey.thinTax.label}" ${khRate}, its own words, the company rate gone from its other taxes`, kh.answer?.label === COPY.journey.thinTax.label && kh.answer?.value === khRate && kh.answerBasis === COPY.journey.thinTax.words && !(kh.taxes ?? []).some((t) => t.key === "company_tax"));
check("Germany keeps its regime's rate under his label", buildHeroBoard("DE").answer?.label === COPY.answer.label);
const gb = buildHeroBoard("GB");
check("the UK's other taxes take the director's loan charge, a share the failing slot no longer prints", (gb.taxes ?? []).some((t) => t.key === "directors_loan" && /%$/.test(t.value)));
check("the UK prints no living cost on its board (its premises rules stand in the running costs)", !gb.rows.some((r) => r.key === "living"));
const khLiving = kh.rows.find((r) => r.key === "living");
check("Cambodia places its living cost on the city scale, no mark (Q3); Afghanistan, with no covered city, holds none", getCountryCostOfLivingIndex("KH") != null && !!khLiving && khLiving.placed === "cost-of-living" && !khLiving.signal && khLiving.label === COPY.journey.boardRows.living && !buildHeroBoard("AF").rows.some((r) => r.key === "living"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_orient: all pass");
```

- [ ] **Step 2: Run it to see it fail.** `node node_modules/tsx/dist/cli.mjs tests/spine/slots_orient.test.ts > scratchpad/journey/t3b.txt 2>&1; echo "exit $?" >> scratchpad/journey/t3b.txt`. Expected: exit 1; KH and AF fail slot 1 (no answer), every country fails the "Hiring staff" and unit checks, `COPY.journey.boardRows` is undefined.

- [ ] **Step 3: The words.** In `src/lib/spine/copy.ts`, inside `journey`, the line `    signal: { key: "Up is easier for an owner, down is harder.", words: { 1: "Very good", 2: "Good", 3: "Middle", 4: "Poor", 5: "Very poor" } },` becomes:

```ts
    signal: { key: "Up is easier for an owner, down is harder.", words: { 1: "Very good", 2: "Good", 3: "Middle", 4: "Poor", 5: "Very poor" }, /** A placed row's readout: the state's word, then its placement sentence. */ readout: "{word} for an owner." },
```

and after `    adminNote: "Last published in 2020.",` add:

```ts
    /** The board's rows (slot 2), each label carrying its unit within three words (spec section 3; ROW SENTENCE). */
    boardRows: { clean: "Clean dealing /100", admin: "Admin ease /100", salary: "Monthly salary", living: "Living cost /100" },
    /** The UK's charge on a director's loan, a tax, standing in the other taxes of slot 1. */
    directorsLoan: { label: "Director's loan charge", note: "Company pays, until repaid" },
```

- [ ] **Step 4: The builder.** In `src/lib/spine/hero_board.ts`:
  - After `import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";` add:

```ts
import { signalFor, type Signalled } from "@/lib/spine/signal";
import type { MeasureKey } from "@/lib/spine/owner_direction";
/* The living cost from its own builder, not from running_costs_rows.ts, which imports levelOf from this file. */
import { getCountryCostOfLivingIndex, costOfLivingOnCityScale, allCountryCostOfLivingIndices } from "@/lib/economics/country_metrics";
import { ruleValue } from "@/lib/spine/sections/country_rules";
import { IF_IT_FAILS } from "@/lib/spine/sections/if_it_fails";
```

  - In `export type HeroBoardRow = {`, before its closing `};`:

```ts
  /** The measure of a figure placed among the countries (plan 2026-10-13 country-page-journey): the mark rule reads it. */
  placed?: MeasureKey | null;
  signal?: Signalled | null;
  noSignal?: "set" | "fill" | null;
  /** The row's readout words where they are more than its placement sentence (the state's word, an index's year, a scale). */
  readout?: string | null;
```

  - Above `export function buildHeroBoard(iso2In: string): HeroBoardData {`:

```ts
/** A country row placed among the countries (plan 2026-10-13 country-page-journey, Task 3B; spec sections 3 and 4): its unit in its label, no
 *  level (the signal says which way is easier where its measure has a direction), its readout the state's word then its placement. */
function placedRow(base: { key: string; icon: AtlasIconId; label: string; value: string; confidence: HeroBoardRow["confidence"]; placement: string | null }, measure: MeasureKey, raw: number, set: readonly number[], extra: string | null = null): HeroBoardRow {
  const { signal, noSignal } = signalFor(measure, raw, set);
  const word = signal ? COPY.journey.signal.readout.replace("{word}", COPY.journey.signal.words[signal.state]) : null;
  const readout = [word, base.placement, extra].filter(Boolean).join(" ") || null;
  return { ...base, unit: "", level: null, placed: measure, signal, noSignal, readout };
}
```

  - The `clean` row's push, from `rows.push({ key: "clean", icon: "corruption", label: COPY.heroBoard.rows.clean,` to its `});`, becomes:

```ts
    rows.push(placedRow({ key: "clean", icon: "corruption", label: COPY.journey.boardRows.clean, value: String(v), confidence: profileConfidence, placement: placementOf(profile.corruption_perception_index, s.clean, "countries") }, "clean-dealing", profile.corruption_perception_index, s.clean));
```

  - The `admin` row's push becomes:

```ts
    rows.push(placedRow({ key: "admin", icon: "ease-of-business", label: COPY.journey.boardRows.admin, value: String(v), confidence: profileConfidence, placement: placementOf(profile.ease_of_doing_business_index, s.admin, "countries") }, "admin-ease", profile.ease_of_doing_business_index, s.admin, COPY.journey.adminNote));
```

  - The `salary-month` row's push becomes:

```ts
    rows.push(placedRow({ key: "salary-month", icon: "wages", label: COPY.journey.boardRows.salary, value: usd(month), confidence: pay!.confidence === "measured" ? "measured" : "modeled", placement: placementOf(month, set, "countries") }, "salary", month, set));
```

  - Delete `  const hiring = hireEase(iso2);`, the comment that opens `/* HOW EASY IT IS TO HIRE (his hero list of 2026-09-20`, the line `  if (hiring) rows.push({ key: "hiring", ...` and the whole `function hireEase(iso2: string): string | null {` with its doc comment (no caller is left; slot 7's "How hiring goes" reads the shard's four words in `src/lib/spine/slots/run.ts`). `heroTaxes` still reads `queryFacts`, `loadCountryShard` and `countryEntityId`, so their imports stay.
  - After the salary row's closing `}`, the living cost (Reading 9):

```ts
  /* THE LIVING COST ON THE CITY SCALE (plan 2026-10-13 country-page-journey, Task 3B; Reading 9): the running costs printed it where the
     country's rules hold no premises tax. It is a position on his scale (cheapest covered city 1, dearest 100, his ruling of 2026-09-20),
     not a price, so it stands here, placed among the countries, no mark until his reading (Q3). The UK keeps its premises rules instead. */
  const livingIndex = getCountryCostOfLivingIndex(iso2);
  const living = livingIndex != null && livingIndex > 0 ? costOfLivingOnCityScale(livingIndex) : null;
  if (living != null && livingIndex != null && !ruleValue(iso2, "premises", "full-relief-limit")) {
    rows.push(placedRow({ key: "living", icon: "spending-power", label: COPY.journey.boardRows.living, value: String(living), confidence: "modeled", placement: placementOf(livingIndex, allCountryCostOfLivingIndices(), "countries") }, "cost-of-living", livingIndex, allCountryCostOfLivingIndices(), COPY.runningCosts.basisLiving));
  }
```

  - Slot 1's thin state, after the line `  if (uk && facts.answer) facts.answer = { ...facts.answer, value: \`${uk.percent}%\`, share: uk.share, confidence: "measured", prov: { src: "uk/law/take_home.ts:sole trader:median full-time pay", kind: "worked out" } };`:

```ts
  /* SLOT 1'S THIN STATE (plan 2026-10-13 country-page-journey, Task 3B; spec section 3: "the company tax rate under its own label (198 of 198
     countries), never 'Not known yet'"): where no small-business regime is held, the answer is the profile's combined rate on company profit,
     under its own label and words, and the other taxes leave it out. */
  let thin = false;
  if (!facts.answer && profileHeld && isPos(profile.corporate_income_tax_combined_pct)) {
    const ct = profile.corporate_income_tax_combined_pct;
    facts.answer = { label: COPY.journey.thinTax.label, value: `${Math.round(ct * 1000) / 10}%`, regime: null, confidence: profileConfidence, share: ct, prov: { src: "economic_indicators/country_profile_v2.json:corporate_income_tax_combined_pct", kind: profile.tier === "A" ? "looked up" : "estimate" } };
    thin = true;
  }
```

  - In the return, `...(uk ? { answerBasis: COPY.answer.basisUk.replace("{profit}", usd(uk.profitUsd)) } : {})` becomes `...(uk ? { answerBasis: COPY.answer.basisUk.replace("{profit}", usd(uk.profitUsd)) } : thin ? { answerBasis: COPY.journey.thinTax.words } : {})`, and `taxes: heroTaxes(iso2)` becomes `taxes: heroTaxes(iso2, { company: !thin })`.
  - `function heroTaxes(iso2: string): Array<DetailRow & { key: string }> | null {` becomes `function heroTaxes(iso2: string, { company = true }: { company?: boolean } = {}): Array<DetailRow & { key: string }> | null {`; its line `      if (isPos(profile.corporate_income_tax_combined_pct)) rows.push({ key: "company_tax",` gains `company && ` at the head of its condition (the rest of the line unchanged); and before its `  return rows.length >= 2 ? rows : null;`:

```ts
  /* THE UK'S CHARGE ON A DIRECTOR'S LOAN (plan 2026-10-13 country-page-journey, Task 3B): a tax and a share, the one share among "if it
     fails"'s rows, so it stands with the other taxes and the failing slot (Task 3G) prints its time, money and state rows alone. */
  const loan = iso2.toUpperCase() === "GB" ? (IF_IT_FAILS.fields.directors_loan_charge_pct?.value as { from_2026?: number } | undefined) : undefined;
  if (rows.length >= 2 && typeof loan?.from_2026 === "number") rows.push({ key: "directors_loan", label: COPY.journey.directorsLoan.label, value: `${loan.from_2026}%`, note: COPY.journey.directorsLoan.note });
```

  - The header's paragraph that opens "THE LEVEL is the placement builder's rank" gains, at its end: "On the country board the level gave way to the signal (plan 2026-10-13 country-page-journey, Task 3B; spec section 4, his ruling): a placed figure whose measure has an owner direction carries the triangle, and a row's unit stands in its label; the city board keeps its levels." Its bullet "how easy it is to hire: NO ROW TODAY." becomes "how easy it is to hire: slot 7's plus since 2026-10-13 (spec section 3)."

- [ ] **Step 5: The archetype.** In `src/components/spine/archetypes/HeroBoard.tsx`:
  - After `import { provAttrs } from "@/lib/spine/provenance";` add `import { Signal, SignalKey } from "@/components/spine/signal/Signal";`.
  - `export function HeroBoard({ id = "take", board, answers }: { id?: string; board: HeroBoardData; answers?: string }) {` becomes `export function HeroBoard({ id = "take", board, answers, slotted = false }: { id?: string; board: HeroBoardData; answers?: string; /** The country page's journey (plan 2026-10-13 country-page-journey): the answer column is slot 1, the rows slot 2. */ slotted?: boolean }) {`.
  - The answer column's `<div className="grid content-between gap-5">` becomes `<div className="grid content-between gap-5" {...(slotted ? { "data-slot": "tax-on-profit", "data-stage": "1", "data-answer": "share" } : {})}>`.
  - `<DetailPanel name="hero-taxes" summary={COPY.heroBoard.taxes.summary} rows={board.taxes} />` becomes `<DetailPanel name="hero-taxes" summary={COPY.heroBoard.taxes.summary} rows={board.taxes} type={slotted ? "share" : undefined} />`.
  - The rows column, `<div data-hero-rows="" className={\`flex flex-col ${board.answer ? "md:col-span-2 lg:col-span-1" : ""}\`}>`, gains `{...(slotted ? { "data-slot": "where-it-stands", "data-stage": "1", "data-answer": "position" } : {})}` after `data-hero-rows=""`.
  - `<RowsFrame readable={rows.some((r) => r.placement)}` becomes `<RowsFrame readable={rows.some((r) => r.placement || r.readout)}`.
  - In each row's element, `{...(r.placement ? { "data-readout-figure": r.unit ? \`${r.value} ${r.unit}\` : r.value, "data-readout-words": r.placement } : {})}` becomes `{...(r.placement || r.readout ? { "data-readout-figure": r.unit ? \`${r.value} ${r.unit}\` : r.value, "data-readout-words": r.readout ?? r.placement } : {})} {...(r.placed ? { "data-placed": r.placed } : {})} {...(r.noSignal ? { "data-no-signal": r.noSignal } : {})}`.
  - The figure's `<span data-figure="" className=` becomes `<span data-figure="" data-value="" className=`.
  - The mark column, `{r.level ? (` with `<LevelMark level={r.level} />` and `<span aria-hidden="true" />` under it to its closing `)}`, becomes `{r.signal ? <Signal state={r.signal.state} measure={r.signal.measure} /> : r.level ? <LevelMark level={r.level} /> : <span aria-hidden="true" />}`.
  - The key under the rows, the paragraph whose child is `{board.levelBasis ?? COPY.heroBoard.levelBasis}`, is wrapped: `{slotted ? <SignalKey /> : (` before it and `)}` after it, the paragraph itself unchanged.
  - The header's THE COLUMN bullet gains: "On the country page (`slotted`, plan 2026-10-13 country-page-journey) a row is its label with its unit, its figure and its signal where its measure has an owner direction (src/lib/spine/owner_direction.ts); the key line is the signal's; the city board keeps its level marks."

- [ ] **Step 6: The stage's component** `src/components/spine/country/slots/StageOrient.tsx`:

```tsx
/**
 * STAGE 1, ORIENT (plan 2026-10-13 country-page-journey, Task 3B; spec section 2: "What is this country like for a small business?"): his
 * masthead (HeroBoard, his design of 2026-09-20), its answer column slot 1 (the tax on profit) and its column of placed figures slot 2.
 */
import * as React from "react";
import { HeroBoard } from "@/components/spine/archetypes/HeroBoard";
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

export function MastheadSlots({ iso2 }: { iso2: string }) {
  return <HeroBoard id="take" board={buildHeroBoard(iso2)} answers={SURFACE_ANSWERS.country} slotted />;
}
```

- [ ] **Step 7: The test that names the board's labels.** In `tests/spine/hero_rows.test.ts`: `check("the salary row is the typical salary (a median)", row("salary-month")?.label === "Typical salary");` becomes `check("the salary row is the typical salary a month, its unit in its label", row("salary-month")?.label === "Monthly salary");`, and `check("the admin index carries its last year", row("admin")?.label === "Admin ease, 2020");` becomes `check("the admin index carries its scale in its label and its last year in its readout", row("admin")?.label === "Admin ease /100" && (row("admin")?.readout ?? "").includes("2020"));`. The header's "the admin index carries its last year, 2020" reads "the admin index carries its scale in its label and its last year, 2020, in its readout (plan 2026-10-13 country-page-journey, Task 3B)". (Rhythm Task 4 took the days row; its check left with it, which Task 0, Step 2 confirmed.)

- [ ] **Step 8: Run them.** Test to `t3b-b.txt`: all PASS, exit 0. `node node_modules/tsx/dist/cli.mjs tests/spine/hero_rows.test.ts > scratchpad/journey/t3b-rows.txt 2>&1; echo "exit $?" >> scratchpad/journey/t3b-rows.txt`: PASS. TYPECHECK to `t3b-tsc.txt`: 0. GATES `--only=slots-orient,hero-rows,harness-archetypes,home-forms,countries-disclosure,signal` to `t3b-gates.txt`: PASS (the archetype sheet's `hero-board` stories draw unslotted, so the city board keeps its levels; Afghanistan's board holds three rows, clean dealing, admin ease and the monthly salary, and `HERO_BOARD_ROWS_CAP` is a ceiling with no floor).

- [ ] **Step 9: Wire and commit.** After the `answer-fold` entry:

```ts
  /* STAGE 1, ORIENT (plan 2026-10-13 country-page-journey, Task 3B): slot 1 answers on every country, slot 2's placed figures carry their
     signals. No browser. */
  { name: "slots-orient", script: "tests/spine/slots_orient.test.ts" },
```

Stage the new files; COUNTS to `t3b-counts.txt`. Commit `src/lib/spine/hero_board.ts`, `src/components/spine/archetypes/HeroBoard.tsx`, `src/lib/spine/copy.ts`, `src/components/spine/country/slots/StageOrient.tsx`, `tests/spine/slots_orient.test.ts`, `tests/spine/hero_rows.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:orient: the masthead's two slots, the tax on profit on every country (the company rate where no regime is held) and the placed figures with their signals, Hiring staff gone to slot 7 (plan 2026-10-13 country-page-journey, Task 3B)`.

---

### Task 3C: Stage 2, the market: slots 3, 4 and 5 (asks Q1 first)

**Files:**
- Create: `src/lib/spine/slots/market.ts`, `src/components/spine/country/slots/StageMarket.tsx`
- Test: `tests/spine/slots_market.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `slots-orient`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 3A's `list`, `present`, `SlotModel`, `SlotRow`, `FOLD_MAX`, `Slot`; today's `buildCustomersStrip` (`range_rows.ts`), `buildCityCards` (`city_cards.ts`, eight cities at most, largest first), `buildCountrySpend`, `SPEND_FOOD_IN`, `SPEND_FOOD_OUT`, `SPEND_RESIDUAL` (`country_spend_rows.ts`), `buildAgeMix`, `listPeoplePlaces` (`sections/people.ts`), `buildLondonTradeSales`, `londonMiddleSales` (`country_depth_rows.ts`).
- Produces: `CITY_CARDS_SHOWN = 4`, `cardsShown(n)`, `TRADES_SHOWN_MIN = 8`; `buildCustomersSlot(iso2) => SlotModel<CustomersDrawing> | null` (`CustomersDrawing = { cards: CityCards | null }`); `buildSpendSlot(iso2) => SlotModel<SpendDrawing> | null` (`{ spend: CountrySpendData }`); `buildTradesSlot(iso2) => SlotModel<TradesDrawing> | null` (`{ drawn: SalesRow[]; worldMax: number; middle: number }`); `CustomersSlot`, `SpendSlot`, `TradesSlot` (each `{ model }`). Gate `slots-market`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_market.test.ts`:

```ts
/**
 * STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C; spec sections 2 and 3; R5 section 5, slots 3 to 5): customers city by city
 * (the national typical pay at 30, one row of city cards, the cities past the row behind the plus, the tenths behind theirs), what households
 * spend on (the UK's form, the share bar, on every country; the people file's ages behind the plus), what trades take (London's sales, the
 * UK's alone under Q1's answer B), on the UK, Cambodia, Afghanistan and Germany; each slot read clean by the answer-type gate; no city's pay
 * printed twice.
 * BLIND SPOT, stated: the builders and the components' markup; the page's order and layout are Task 4's gates'.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_market.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildCustomersSlot, buildSpendSlot, buildTradesSlot, CITY_CARDS_SHOWN, cardsShown } from "../../src/lib/spine/slots/market";
import { CustomersSlot, SpendSlot, TradesSlot } from "../../src/components/spine/country/slots/StageMarket";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { usd } from "../../src/lib/spine/money";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-market";
const FILE = "src/lib/spine/slots/market.ts";
const REMEDY = "build the market's three slots from today's builders: each its lead of the slot's type, its folds of one type each, every figure once, the slot omitted where its data is absent";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const clean = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);

check("the row of cards: every city up to five (a fold of one is no fold), four past that", cardsShown(1) === 1 && cardsShown(4) === 4 && cardsShown(5) === 5 && cardsShown(6) === CITY_CARDS_SHOWN && cardsShown(8) === CITY_CARDS_SHOWN);
for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const c = buildCustomersSlot(iso2);
  const typical = Math.round(getCountryProfile(iso2).median_wage_full_time_usd as number);
  check(`${iso2} slot 3 draws, its lead the national typical pay (${c?.lead?.figure})`, !!c && c.lead?.figure === usd(typical));
  const all = buildCityCards(iso2)?.cards.length ?? 0;
  const drawn = c?.drawing.cards?.cards.length ?? 0;
  const folded = c?.more.find((m) => m.key === "cities")?.rows ?? [];
  check(`${iso2} slot 3: ${all} covered cities, ${drawn} as cards and ${folded.length} behind the plus, none in both, each fold of money rows`, !!c && drawn === cardsShown(all) && drawn + folded.length <= all && !folded.some((r) => (c.drawing.cards?.cards ?? []).some((k) => k.id === r.key)) && c.more.every((m) => m.type === "money"));
  if (c) { const f = clean(read(React.createElement(CustomersSlot, { model: c }))); check(`${iso2} slot 3 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageMarket.tsx"); }
  const s = buildSpendSlot(iso2);
  check(`${iso2} slot 4 leads with the food money's share and folds shares alone`, !!s && /%$/.test(s.lead?.figure ?? "") && s.more.every((m) => m.type === "share"));
  if (s) { const doc = read(React.createElement(SpendSlot, { model: s })); const f = clean(doc); check(`${iso2} slot 4 reads clean, its bar's rows declared shares (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('[data-slot="spend"] [data-answer="share"]'), "src/components/spine/country/slots/StageMarket.tsx"); }
}
check("Afghanistan: no covered city, so the national typical alone", buildCustomersSlot("AF")?.thin === true && buildCustomersSlot("AF")?.drawing.cards === null);
check("Cambodia: its one city in the row", buildCustomersSlot("KH")?.drawing.cards?.cards.length === 1);
const gbCities = buildCityCards("GB")?.cards ?? [];
const gbFold = buildCustomersSlot("GB")?.more.find((m) => m.key === "cities");
check(`the UK: ${gbCities.length} cities, four cards, the rest with a pay of their own behind the plus, each a door to its page`, gbCities.length > CITY_CARDS_SHOWN + 1 && gbFold?.rows.length === gbCities.slice(CITY_CARDS_SHOWN).filter((k) => typeof k.payUsd === "number").length && (gbFold?.rows ?? []).every((r) => typeof r.href === "string" && r.href.startsWith("/")));
const gbTrades = buildTradesSlot("GB");
const sales = buildLondonTradeSales();
check(`the UK draws slot 5: London's trades, the drawn and the folded together every trade the list holds (${sales?.rows.length})`, !!gbTrades && !!sales && gbTrades.drawing.drawn.length + (gbTrades.more[0]?.rows.length ?? 0) === sales.rows.length && gbTrades.more.every((m) => m.rows.length <= 8));
if (gbTrades) { const f = clean(read(React.createElement(TradesSlot, { model: gbTrades }))); check(`the UK's slot 5 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageMarket.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 5 (Q1, answer B: no money figure for their trades)", !buildTradesSlot("KH") && !buildTradesSlot("AF") && !buildTradesSlot("DE"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_market: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3c.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/market`.

- [ ] **Step 3: The builders** `src/lib/spine/slots/market.ts`:

```ts
/**
 * src/lib/spine/slots/market.ts , STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C; spec sections 2 and 3; R5 section 5,
 * slots 3 to 5): "Is there money here, and where?" The market stands before the costs, since a cost reads against the revenue it is set
 * against. Each builder reads today's builders and returns its slot's model, or null where the slot's data is absent (no seat).
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildCityCards, type CityCards } from "@/lib/spine/city_cards";
import { buildCustomersStrip } from "@/lib/spine/range_rows";
import { buildCountrySpend, type CountrySpendData } from "@/lib/spine/country_spend_rows";
import { buildAgeMix, listPeoplePlaces } from "@/lib/spine/sections/people";
import { buildLondonTradeSales, londonMiddleSales } from "@/lib/spine/country_depth_rows";
import { FOLD_MAX, list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;

/** One row of city cards: spec section 5 refuses a carousel, and the cards' pager paged. Four, or every city up to five, since a plus of one
 *  row is no plus (FOLD_MIN); the cities past the row stand behind the plus, each figure printed once. */
export const CITY_CARDS_SHOWN = 4;
export const cardsShown = (n: number): number => (n <= CITY_CARDS_SHOWN + 1 ? n : CITY_CARDS_SHOWN);
/** London's trades drawn as bars: eight at least, the rest (eight at most) behind the plus. */
export const TRADES_SHOWN_MIN = 8;

export type CustomersDrawing = { cards: CityCards | null };
/** SLOT 3, CUSTOMERS CITY BY CITY (MONEY a year): the national typical full-time pay at 30; one row of the covered cities' cards, each its
 *  customers' pay and a door to its page; the cities past the row behind the plus as money rows that open their pages; the bottom and top
 *  tenth behind theirs where the deciles are held. Thin: the national typical alone. */
export function buildCustomersSlot(iso2: string): SlotModel<CustomersDrawing> | null {
  const strip = buildCustomersStrip(iso2);
  const typical = strip?.marks.find((m) => m.key === "typical") ?? null;
  if (!strip || !typical) return null;
  const cards = buildCityCards(iso2);
  const shown = cards ? cardsShown(cards.cards.length) : 0;
  const past: SlotRow[] = (cards?.cards ?? []).slice(shown).filter((c) => typeof c.payUsd === "number" && c.payUsd > 0).map((c) => ({ key: c.id, label: c.name, value: usd(c.payUsd as number), prov: c.payProv ?? null, href: c.href }));
  const tenths: SlotRow[] = strip.marks.filter((m) => m.key !== "typical").map((m) => ({ key: m.key, label: m.label, value: usd(m.value) }));
  return {
    id: "customers",
    lead: { figure: usd(typical.value), words: J.slots.customers.words },
    rows: null,
    more: present([list("cities", J.more.cities, "money", past), list("tenths", J.more.tenths, "money", tenths)]),
    drawing: { cards: cards ? { ...cards, cards: cards.cards.slice(0, shown) } : null },
    thin: !cards,
  };
}

export type SpendDrawing = { spend: CountrySpendData };
/** SLOT 4, WHAT HOUSEHOLDS SPEND ON (SHARE of 100): the food money's share spent eating out at 30; the budget's parts as one share bar, the
 *  UK's form on every country; each band of ages the people file holds for the country behind its own plus. Thin: omit. */
export function buildSpendSlot(iso2: string): SlotModel<SpendDrawing> | null {
  const spend = buildCountrySpend(iso2);
  if (!spend) return null;
  const place = listPeoplePlaces().find((p) => p.iso2 === iso2.toUpperCase())?.city;
  const ages = buildAgeMix(iso2, place, "country");
  const ageLists = (ages?.bars ?? []).map((bar, i) => list(`ages-${i}`, J.ageOf.replace("{place}", bar.name), "share", bar.bands.map((b) => ({ key: b.key, label: b.label, value: `${Math.round(b.pct)}%` }))));
  return {
    id: "spend",
    lead: { figure: spend.out.figure, words: COPY.countrySpend.outWords, prov: spend.out.prov ?? null },
    rows: null,
    more: present(ageLists),
    drawing: { spend },
    thin: false,
  };
}

type SalesRow = NonNullable<ReturnType<typeof buildLondonTradeSales>>["rows"][number];
export type TradesDrawing = { drawn: SalesRow[]; worldMax: number; middle: number };
/** SLOT 5, WHAT TRADES TAKE (MONEY a year): London's registered trades by their typical yearly sales, the middle trade at 30, the bars each a
 *  door to its trade's London page, the rest behind the plus as rows that open the same pages. The UK's alone: a country whose only trade
 *  figures are net margins draws no slot 5 (Q1, answer B). Thin: omit. */
export function buildTradesSlot(iso2: string): SlotModel<TradesDrawing> | null {
  if (iso2.toUpperCase() !== "GB") return null;
  const sales = buildLondonTradeSales();
  if (!sales || sales.rows.length < 2) return null;
  const middle = londonMiddleSales(sales);
  const n = sales.rows.length;
  const shown = n <= TRADES_SHOWN_MIN + 1 ? n : Math.max(TRADES_SHOWN_MIN, n - FOLD_MAX);
  const rest: SlotRow[] = sales.rows.slice(shown).map((r) => ({ key: r.key, label: r.name, value: usd(r.value), prov: r.prov ?? null, href: r.href }));
  return {
    id: "trades",
    lead: { figure: usd(middle), words: J.slots.trades.words },
    rows: null,
    more: present([list("more", J.more.trades, "money", rest)]),
    drawing: { drawn: sales.rows.slice(0, shown), worldMax: sales.worldMax, middle },
    thin: false,
  };
}
```

- [ ] **Step 4: The components** `src/components/spine/country/slots/StageMarket.tsx`:

```tsx
/**
 * STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C): slots 3 to 5 drawn in the slot's frame (src/components/spine/country/Slot.tsx):
 * the covered cities' cards (one row, so the pager never draws), the household budget's share bar, London's trades' bars.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { BarList } from "@/components/spine/charts/BarList";
import { COPY } from "@/lib/spine/copy";
import { usd } from "@/lib/spine/money";
import { SPEND_FOOD_IN, SPEND_FOOD_OUT, SPEND_RESIDUAL } from "@/lib/spine/country_spend_rows";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { CustomersDrawing, SpendDrawing, TradesDrawing } from "@/lib/spine/slots/market";

export function CustomersSlot({ model }: { model: SlotModel<CustomersDrawing> }) {
  const cards = model.drawing.cards;
  return (
    <Slot model={model}>
      {cards ? <CityCards cards={cards.cards} allHref={cards.allHref} allLabel={COPY.cities.allLabel} basis={COPY.cityCards.plain.basis} prevLabel={COPY.cities.prev} nextLabel={COPY.cities.next} /> : null}
    </Slot>
  );
}

export function SpendSlot({ model }: { model: SlotModel<SpendDrawing> }) {
  const spend = model.drawing.spend;
  return (
    <Slot model={model}>
      <div className="mt-1 flex flex-1 flex-col">
        <ShareBar parts={spend.rows.map((r) => ({ key: r.key, name: r.name, share: r.value, prov: r.prov }))} lead={[SPEND_FOOD_OUT, SPEND_FOOD_IN]} residualKey={SPEND_RESIDUAL} tall fill bracket={COPY.countrySpend.bracket} />
      </div>
    </Slot>
  );
}

export function TradesSlot({ model }: { model: SlotModel<TradesDrawing> }) {
  const { drawn, worldMax, middle } = model.drawing;
  return (
    <Slot model={model}>
      <BarList answer="money" items={drawn.map((r) => ({ key: r.key, label: r.name, value: r.value, display: usd(r.value), href: r.href, icon: r.icon, prov: r.prov }))} max={worldMax} reference={{ value: middle, label: COPY.londonSales.middleKey }} />
    </Slot>
  );
}
```

- [ ] **Step 5: Run it.** Test to `t3c-b.txt`: all PASS, exit 0. TYPECHECK to `t3c-tsc.txt`: 0. A covered city past the row whose card holds no pay of its own (`payUsd` absent: `city_cards.ts` prints only a city's own typical) has no money row; it stays a door through the cards' "Every covered city" link, and the report names each such city on the four countries.

- [ ] **Step 6: Under Q1 answered A only** (slot 5 takes SHARE where its only figures are net margins): `SlotModel` gains `type?: AnswerType` (an override, slot 5's alone, named in its doc comment in `src/lib/spine/slots/types.ts`); `Slot.tsx` writes `data-answer={model.type ?? def.type}`; `buildTradesSlot(iso2, margins: MarginCard | null = null)` returns, off the UK, where `margins && margins.rows.length >= 2`, `{ id: "trades", type: "share", lead: null, rows: null, more: [], drawing: { margins } }` (`TradesDrawing` a union of the two drawings), the view passing `marginCardFromRows(Array.isArray(d.money?.list) ? d.money.list : [])` (`src/lib/spine/margin_rows.ts`, as `country-view.tsx` builds it today); `TradesSlot` draws today's margin card's `RankedBars` call (the `Money` function of `country-view.tsx`, moved here unchanged) under the slot's opener; the test's last check reads "Germany draws slot 5 as shares" (`buildTradesSlot("DE", marginCardFromSnapshot("DE"))?.type === "share"`, the harness snapshot standing in for the seed), and `tests/spine/country_slots.test.ts`'s Germany set gains `"trades"` after `"spend"`. Under B this step is skipped.

- [ ] **Step 7: Wire and commit.** After `slots-orient`:

```ts
  /* STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C): customers city by city, what households spend on, what trades take.
     No browser. */
  { name: "slots-market", script: "tests/spine/slots_market.test.ts" },
```

Stage the new files; COUNTS to `t3c-counts.txt`. Commit `src/lib/spine/slots/market.ts`, `src/components/spine/country/slots/StageMarket.tsx`, `tests/spine/slots_market.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:market: the market's three slots, customers city by city with the cities past the row one tap down, the household budget's bar on every country, London's trades (plan 2026-10-13 country-page-journey, Task 3C)`.

---

### Task 3D: Stage 3, to open: slot 6, the forms, the bill and the days, with the steps, the licences and the UK's walls from abroad behind the plus

**Files:**
- Create: `src/lib/spine/slots/open.ts`, `src/components/spine/country/slots/StageOpen.tsx`
- Modify: `src/lib/spine/slots/types.ts` and `src/components/spine/country/Slot.tsx` (a slot's `gloss`, the Rail's)
- Modify: `src/lib/spine/country_licences_rows.ts` (a trade label over three words takes its short form), `src/lib/spine/sections/from_abroad.ts` (the founder route's years on its focal)
- Modify: `src/lib/spine/copy.ts` (`COPY.entryBill.licences.short`, `COPY.journey.openRows`, `COPY.journey.abroad`)
- Test: `tests/spine/slots_open.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `slots-market`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 3A's `list`, `present`, `SlotModel`, `SlotRow`, `Slot`; today's `buildEntryBill`, `ENTRY_BILL_METRICS` (`entry_bill_rows.ts`), `buildHowToSteps` (`howto_steps_rows.ts`), `buildCountryLicences`, `buildSetupRows`, `howToOpenDoor` (`setup_rows.ts`), `buildFromAbroad`, `latestChange` (`sections/country_rules.ts`), `TiersTable`.
- Produces: `SlotModel` gains `gloss?: string | null` (Slot passes it to the Rail). In `src/lib/spine/slots/open.ts`: `inDays(text) => string | null`, `stepLabel(name) => string`, `uniqueLabels(labels) => string[]`, `type OpenDrawing = { setup: SetupRow[]; howTo: { href: string; label: string } | null }`, `buildOpenSlot(iso2, today) => SlotModel<OpenDrawing> | null`. `OpenSlot({ model })` in `StageOpen.tsx`. `FromAbroad["focal"]` gains `years: number`. Gate `slots-open`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_open.test.ts`:

```ts
/**
 * STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D; spec sections 2 and 3; R5 section 5, slot 6): one slot, "Forms, fees and
 * days": the bill at 30 (its own shard figure, stamped), the legal forms table, the days until trading as a row; behind the plus, lists of
 * one type each: the steps in days under fixed labels (the shard's words as each row's note), how each step goes, each step's cost where
 * more than one step costs money, the licences' waits in days, the UK's walls from abroad (their states, their costs, their waits). On the
 * UK, Cambodia, Afghanistan and Germany; each read clean by the answer-type gate.
 * BLIND SPOT, stated: the builder and the component's markup; whether a step label fits a shard's step is read here on four countries'
 * names, not on 198.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_open.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildOpenSlot, inDays, stepLabel, uniqueLabels } from "../../src/lib/spine/slots/open";
import { OpenSlot } from "../../src/components/spine/country/slots/StageOpen";
import { buildEntryBill } from "../../src/lib/spine/entry_bill_rows";
import { buildSetupRows } from "../../src/lib/spine/setup_rows";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-open";
const FILE = "src/lib/spine/slots/open.ts";
const REMEDY = "build slot 6 from the bill, the legal forms table and the steps: the bill at 30, one type a list behind the plus, units in the heads, labels from the closed list";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

check("durations in days: days as they are, weeks times seven, months at the calendar's average month, a range end by end", inDays("28 days") === "28" && inDays("1 day") === "1" && inDays("0 days") === "0" && inDays("6 to 10 weeks") === "42 to 70" && inDays("3 to 4 months") === "91 to 122" && inDays("Start immediately") === null && inDays("–") === null);
check("the steps' labels from the closed list (the UK's four)", JSON.stringify(["Register the company", "Register for tax", "Open a business bank account", "Register for VAT (if sales are high)"].map(stepLabel)) === JSON.stringify([COPY.journey.stepLabels.register, COPY.journey.stepLabels.tax, COPY.journey.stepLabels.bank, COPY.journey.stepLabels.vat]));
check("Cambodia's sentences read as labels", JSON.stringify(["Reserve the company name in Khmer on the CamDX business registration portal", "Register the company with the Ministry of Commerce via CamDX", "Tax registration with the tax department", "Open a corporate bank account and confirm it to the tax department"].map(stepLabel)) === JSON.stringify([COPY.journey.stepLabels.name, COPY.journey.stepLabels.register, COPY.journey.stepLabels.tax, COPY.journey.stepLabels.bank]));
check("a trade office and a licence are the licence step; a taxpayer number the tax step", stepLabel("Trade office registration (Gewerbeanmeldung) of the activity") === COPY.journey.stepLabels.licence && stepLabel("Obtain trade and investment license (annual)") === COPY.journey.stepLabels.licence && stepLabel("Receive taxpayer identification number (TIN)") === COPY.journey.stepLabels.tax);
check("a label met twice takes its count", JSON.stringify(uniqueLabels(["Registration", "Other step", "Registration"])) === JSON.stringify(["Registration", "Other step", "Registration 2"]));

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const m = buildOpenSlot(iso2, TODAY);
  const bill = buildEntryBill(iso2);
  check(`${iso2} slot 6 draws`, !!m);
  if (!m) continue;
  check(`${iso2} the lead is the bill, stamped with its shard figure (${m.lead?.figure})`, bill?.figure ? m.lead?.figure === bill.figure && m.lead?.prov?.src === `facts/country/${iso2}.json:costs.license_setup_usd` && (m.lead?.words ?? "").startsWith(COPY.entryBill.focalWords) : m.lead === null);
  check(`${iso2} the legal forms table is the drawing, its rows the formation file's`, m.drawing.setup.length === buildSetupRows(iso2).length);
  check(`${iso2} every plus holds one type, its labels three words at most`, m.more.every((l) => l.rows.every((r) => words(r.label) <= 3)) && m.more.every((l) => ["time", "state", "money"].includes(l.type)));
  const html = renderToStaticMarkup(React.createElement(OpenSlot, { model: m }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`);
  check(`${iso2} slot 6 reads clean (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('#open[data-slot="open"][data-stage="3"][data-answer="table"]'), "src/components/spine/country/slots/StageOpen.tsx");
}
const gb = buildOpenSlot("GB", TODAY)!;
const key = (m: NonNullable<ReturnType<typeof buildOpenSlot>>, k: string) => m.more.find((l) => l.key === k);
check(`the UK's pluses: ${gb.more.map((l) => l.key).join(", ")}`, JSON.stringify(gb.more.map((l) => l.key)) === JSON.stringify(["steps", "how", "licences", "abroad", "abroad-costs", "abroad-waits"]));
check("the UK: one step costs money, so the bill's words say the rest are free and no costs plus draws", !key(gb, "costs") && (gb.lead?.words ?? "") !== COPY.entryBill.focalWords);
check("the UK: the bank's wait has no source, so its row prints the dash and no days-until-trading row stands", key(gb, "steps")?.rows.find((r) => r.label === COPY.journey.stepLabels.bank)?.value === "–" && gb.rows === null);
check("the UK's licences: waits in days, their short labels", JSON.stringify(key(gb, "licences")?.rows.map((r) => r.value)) === JSON.stringify(["28", "42 to 70", "91 to 122", "28 to 56", "0"]));
check("the UK's walls from abroad: a state each, from the closed list", (key(gb, "abroad")?.rows ?? []).length >= 2 && (key(gb, "abroad")?.rows ?? []).every((r) => Object.values(COPY.fromAbroad.state).includes(r.value)));
const kh = buildOpenSlot("KH", TODAY)!;
check("Cambodia: three steps cost money, so their costs stand behind their own plus; its days until trading a row", !!key(kh, "costs") && key(kh, "costs")!.type === "money" && kh.rows?.type === "time" && kh.rows.rows.length === 1);
const af = buildOpenSlot("AF", TODAY)!;
check("Afghanistan: no legal form on file, so the bill alone and no steps behind a plus (the table's country draws them, as today)", af.drawing.setup.length === 0 && !key(af, "steps") && af.thin === true);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_open: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3d.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/open`.

- [ ] **Step 3: The words.** In `src/lib/spine/copy.ts`: in `entryBill.licences`, after `noLicence: "No licence needed"` add `, /** A shard's trade name over three words, as a row label (ROW SENTENCE; plan 2026-10-13 country-page-journey, Task 3D). */ short: { "Bar / restaurant (alcohol)": "Selling alcohol", "Taxi / private hire": "Taxi or minicab", "Most retail and online": "Retail and online" } as Record<string, string>`. Inside `journey`, after `boardRows` (Task 3B):

```ts
    /** Slot 6's own row: the days until trading (the shard's total), its unit in its label. */
    openRows: { trading: "Until trading, days" },
    /** The UK's walls from abroad behind slot 6's plus: the founder route's fees, the decision's wait, a fee that buys a stay. */
    abroad: { founder: "Founder visa fees", founderNote: "For {years} years, per person", decision: "Visa decision", decisionNote: "Applying from outside the UK", forTime: "Fee and surcharge for {time}" },
```

- [ ] **Step 4: The two builders' small changes.** In `src/lib/spine/country_licences_rows.ts`, `rows.push({ label: r.trade.replace(/\s*\/\s*/g, " or "), value: none ? L.noWait : r.wait, note: none ? L.noLicence : r.licence });` becomes `rows.push({ label: L.short[r.trade] ?? r.trade.replace(/\s*\/\s*/g, " or "), value: none ? L.noWait : r.wait, note: none ? L.noLicence : r.licence });`, and its header's "the trade as the label" reads "the trade as the label, a name over three words in its short form (COPY.entryBill.licences.short)". In `src/lib/spine/sections/from_abroad.ts`, `focal: { gbp: number; usd: number | null; weeks: number; prov: Provenance };` becomes `focal: { gbp: number; usd: number | null; weeks: number; years: number; prov: Provenance };` and the return's `weeks: decision.outside, prov: worked("innovator_founder")` becomes `weeks: decision.outside, years: founder.years, prov: worked("innovator_founder")`.

- [ ] **Step 5: A slot's gloss.** In `src/lib/spine/slots/types.ts`, `export type SlotModel<D = null> = { id: SlotId; lead: SlotLead | null; rows: SlotList | null; more: SlotList[]; drawing: D; thin: boolean };` becomes `export type SlotModel<D = null> = { id: SlotId; lead: SlotLead | null; rows: SlotList | null; more: SlotList[]; drawing: D; thin: boolean; /** A term the slot's title uses, glossed in the opener (the Rail's gloss). */ gloss?: string | null };`. In `src/components/spine/country/Slot.tsx`, `<Rail icon={def.icon ?? undefined} kicker={def.heading} />` becomes `<Rail icon={def.icon ?? undefined} kicker={def.heading} gloss={model.gloss ?? undefined} />`.

- [ ] **Step 6: The builder** `src/lib/spine/slots/open.ts`:

```ts
/**
 * src/lib/spine/slots/open.ts , STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D; spec sections 2 and 3; R5 section 5, slot 6):
 * "What does opening take?" One slot, "Forms, fees and days": the bill to register at 30 (the shard's own figure, stamped, so it reads as
 * its own fact beside the table's government fee), the legal forms table under it (one unit a column), the days until trading as a row
 * where the shard's total stands and no step's wait is unsourced. Behind the plus, each list of one type: the steps in days under a label
 * from a closed list (the shard's own words as each row's note, his law of 2026-09-20: "labels and categories, defined once"), how each step
 * goes, each step's cost where more than one step costs money (where one does, the bill's words say the rest are free), the licences'
 * waits by trade, and the UK's walls from abroad: their state, their costs, their waits. The steps draw where the legal forms table does,
 * as the bill's card drew them before. Thin: the bill or the table alone; with neither the slot omits.
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildEntryBill, ENTRY_BILL_METRICS } from "@/lib/spine/entry_bill_rows";
import { buildHowToSteps } from "@/lib/spine/howto_steps_rows";
import { buildCountryLicences } from "@/lib/spine/country_licences_rows";
import { buildSetupRows, howToOpenDoor, type SetupRow } from "@/lib/spine/setup_rows";
import { buildFromAbroad } from "@/lib/spine/sections/from_abroad";
import { latestChange } from "@/lib/spine/sections/country_rules";
import { list, present, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
/** The calendar's average month in days, the figure `monthsOfDays` in sections/if_it_fails.ts divides by. */
const DAYS_A_MONTH = 365.25 / 12;

/** A duration as whole days, for a list whose head says "in days": days as they are, weeks times seven, months at the calendar's average
 *  month, a range end by end; null where the text holds no duration of that shape ("Start immediately", a dash). */
export function inDays(text: string | null | undefined): string | null {
  const v = (text ?? "").replace(/[\s ]+/g, " ").trim().toLowerCase();
  const m = v.match(/^(\d+(?:\.\d+)?)(?: to (\d+(?:\.\d+)?))? (days?|weeks?|months?)$/);
  if (!m) return null;
  const per = m[3].startsWith("day") ? 1 : m[3].startsWith("week") ? 7 : DAYS_A_MONTH;
  const a = Math.round(Number(m[1]) * per);
  return m[2] ? `${a} to ${Math.round(Number(m[2]) * per)}` : String(a);
}

/** A step's label from the closed list (COPY.journey.stepLabels), by the words its shard's name holds, read in this order so a name that
 *  holds two (a bank account confirmed to the tax office) takes the more particular. */
const STEP_WORDS: ReadonlyArray<readonly [keyof typeof COPY.journey.stepLabels, RegExp]> = [
  ["name", /\bname\b/i],
  ["bank", /\bbank/i],
  ["tax", /\btax/i],
  ["vat", /\bvat\b|\bgst\b|\bsales tax\b/i],
  ["social", /\bsocial\b|\bpension|\binsurance\b|\bsecurity\b/i],
  ["licence", /\blicen[cs]|\bpermit\b|\btrade office\b/i],
  ["notary", /\bnotar/i],
  ["seal", /\bseal\b|\bstamp\b/i],
  ["register", /\bregist|\bincorporat/i],
];
export function stepLabel(name: string): string {
  for (const [key, re] of STEP_WORDS) if (re.test(name)) return J.stepLabels[key];
  return J.stepLabels.other;
}

/** Labels made distinct: the second of a label takes " 2", the third " 3". */
export function uniqueLabels(labels: string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((l) => {
    const n = (seen.get(l) ?? 0) + 1;
    seen.set(l, n);
    return n === 1 ? l : `${l} ${n}`;
  });
}

export type OpenDrawing = { setup: SetupRow[]; howTo: { href: string; label: string } | null };

export function buildOpenSlot(iso2In: string, today: string): SlotModel<OpenDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const bill = buildEntryBill(iso2);
  const setup = buildSetupRows(iso2);
  const steps = setup.length > 0 ? buildHowToSteps(iso2) : null;
  const all = steps?.steps ?? [];
  const isFree = (c: string | null) => !!c && /^\$0(\.0+)?$/.test(c.trim());
  const paid = all.filter((s) => s.cost && !isFree(s.cost));
  const free = all.filter((s) => isFree(s.cost));
  /* WHERE ONE STEP IS THE ONLY ONE THAT COSTS MONEY the bill is that fee, and its words say the other steps are free (2026-09-25, QUEUE
     country:register-fee-three-prints), with the law's pound fee where the change file holds it (the design review of 2026-10-04). */
  const oneFee = !!bill?.figure && paid.length === 1 && paid[0].cost === bill.figure && free.length > 0;
  const localFee = oneFee ? latestChange(iso2, "incorporation-fee", today)?.from ?? null : null;
  const E = COPY.entryBill;
  const words = oneFee ? (localFee ? E.focalWordsLocalFee.replace("{fee}", localFee).replace("{n}", String(free.length)) : E.focalWordsOneFee.replace("{n}", String(free.length))) : E.focalWords;
  const printed = bill?.verdict.bill.state === "printed" ? bill.verdict.bill : null;
  const lead: SlotLead | null = bill?.figure && printed ? { figure: bill.figure, words, prov: { src: `facts/country/${iso2}.json:${ENTRY_BILL_METRICS.bill}`, kind: printed.tag === "held" ? "looked up" : "estimate" } } : null;
  if (!lead && setup.length === 0) return null;

  /* THE DAYS UNTIL TRADING, a row: the shard's total where the guard prints it, never where a step's wait has no source (the UK's bank
     account, howto_steps_rows.ts UNSOURCED_WAITS, takes the total with it). */
  const days = bill?.figures.days ?? null;
  const tradingRows: SlotRow[] = days != null && !(steps && steps.totalDays == null) ? [{ key: "trading", label: J.openRows.trading, value: String(Math.round(days)), note: E.basisDays }] : [];

  const labels = uniqueLabels(all.map((s) => stepLabel(s.name)));
  const stepRows: SlotRow[] = all.map((s, i) => ({ key: s.key, label: labels[i], value: inDays(s.days) ?? "–", note: s.name }));
  const howRows: SlotRow[] = all.flatMap((s, i) => (s.how ? [{ key: s.key, label: labels[i], value: s.how }] : []));
  const costRows: SlotRow[] = oneFee ? [] : all.flatMap((s, i) => (s.cost ? [{ key: s.key, label: labels[i], value: s.cost }] : []));
  const licenceRows: SlotRow[] = (setup.length > 0 ? buildCountryLicences(iso2) ?? [] : []).flatMap((r, i) => {
    const d = inDays(r.value);
    return d != null ? [{ key: `licence-${i}`, label: r.label, value: d, note: r.note ?? null }] : [];
  });

  /* THE UK'S WALLS FROM ABROAD (sections/from_abroad.ts), three lists: each wall's state; what the route and the walls cost (a law's own
     fee in its pounds, a summed cost in dollars); the waits in days. A stay's length is no wait, so the Youth Mobility scheme's months
     stand in its cost's note. */
  const abroad = iso2 === "GB" ? buildFromAbroad() : null;
  const A = J.abroad;
  const abroadState: SlotRow[] = (abroad?.walls ?? []).map((w) => ({ key: w.key, label: w.label, value: COPY.fromAbroad.state[w.state], note: w.note, prov: w.prov }));
  const abroadCosts: SlotRow[] = abroad && abroad.focal.usd != null
    ? [
        { key: "founder", label: A.founder, value: usd(abroad.focal.usd), note: A.founderNote.replace("{years}", String(abroad.focal.years)), prov: abroad.focal.prov },
        ...abroad.walls.flatMap((w): SlotRow[] => (w.usd != null ? [{ key: w.key, label: w.label, value: usd(w.usd), note: w.time ? A.forTime.replace("{time}", w.time) : w.note, prov: w.prov }] : w.fee ? [{ key: w.key, label: w.label, value: w.fee, note: w.note, prov: w.prov }] : [])),
      ]
    : [];
  const abroadWaits: SlotRow[] = abroad
    ? [
        { key: "decision", label: A.decision, value: String(abroad.focal.weeks * 7), note: A.decisionNote, prov: abroad.focal.prov },
        ...abroad.walls.flatMap((w): SlotRow[] => {
          const d = w.usd == null ? inDays(w.time) : null;
          return d != null ? [{ key: w.key, label: w.label, value: d, note: w.note, prov: w.prov }] : [];
        }),
      ]
    : [];

  const M = J.more;
  return {
    id: "open",
    lead,
    /* The slot's own rows have no floor (list() is the plus's, two to eight), so the one row is its list. */
    rows: tradingRows.length > 0 ? { key: "trading", head: J.openRows.trading, type: "time", rows: tradingRows } : null,
    more: present([
      list("steps", M.steps, "time", stepRows),
      list("how", M.stepsHow, "state", howRows),
      list("costs", M.stepCosts, "money", costRows),
      list("licences", M.licenceWaits, "time", licenceRows),
      list("abroad", M.abroad, "state", abroadState),
      list("abroad-costs", M.abroadCosts, "money", abroadCosts),
      list("abroad-waits", M.abroadWaits, "time", abroadWaits),
    ]),
    drawing: { setup, howTo: setup.length > 0 ? howToOpenDoor(iso2) : null },
    thin: setup.length === 0 || !lead,
    gloss: setup.length > 0 ? COPY.glossary.legalForm : null,
  };
}
```

- [ ] **Step 7: The component** `src/components/spine/country/slots/StageOpen.tsx`:

```tsx
/**
 * STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D): slot 6 in the slot's frame (src/components/spine/country/Slot.tsx), the
 * legal forms table (TiersTable, his rulings 8 and 9 of 2026-09-04) as its drawing, the door to the how-to page in it.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { OpenDrawing } from "@/lib/spine/slots/open";

export function OpenSlot({ model }: { model: SlotModel<OpenDrawing> }) {
  const { setup, howTo } = model.drawing;
  return <Slot model={model}>{setup.length > 0 ? <TiersTable rows={setup} howTo={howTo} fill /> : null}</Slot>;
}
```

- [ ] **Step 8: Run it.** Test to `t3d-b.txt`: all PASS, exit 0. A step label that reads wrong on one of the four countries (the test's names) is fixed in `STEP_WORDS`, never by a label per country. Then the labels over every shard, read once by a scratch script, `scratchpad/journey/step_labels.ts` (not committed):

```ts
// scratchpad/journey/step_labels.ts (plan 2026-10-13 country-page-journey, Task 3D): every country's steps through stepLabel, a count per
// label and twenty notes that fell to "Other step". Not committed.
import { buildOpenSlot } from "../../src/lib/spine/slots/open";
import { listCountryProfiles } from "../../src/lib/economic_profile";
import { COPY } from "../../src/lib/spine/copy";
const n = new Map<string, number>();
const other: string[] = [];
for (const p of listCountryProfiles()) {
  for (const r of buildOpenSlot(p.iso2, "2026-10-13")?.more.find((l) => l.key === "steps")?.rows ?? []) {
    const label = r.label.replace(/ \d+$/, "");
    n.set(label, (n.get(label) ?? 0) + 1);
    if (label === COPY.journey.stepLabels.other && other.length < 20) other.push(`${p.iso2}: ${r.note}`);
  }
}
console.log(JSON.stringify([...n.entries()].sort((a, b) => b[1] - a[1])));
console.log(other.join("\n"));
```

The memory test (Conventions, TYPECHECK's first command), then `node node_modules/tsx/dist/cli.mjs scratchpad/journey/step_labels.ts > scratchpad/journey/t3d-labels.txt 2>&1; echo "exit $?" >> scratchpad/journey/t3d-labels.txt`. Read it: where "Other step" holds more than a tenth of all rows, the report lists the twenty notes and the controller reads them before a word joins `STEP_WORDS`. TYPECHECK to `t3d-tsc.txt`: 0. GATES `--only=slots-open,slots-market,slots-orient,answer-fold,home-forms,harness-archetypes` to `t3d-gates.txt`: PASS (the how-to page reads `buildHowToSteps` unchanged; the licences' short labels reach the UK page's card until Task 4 replaces it).

- [ ] **Step 9: Wire and commit.** After `slots-market`:

```ts
  /* STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D): the bill, the legal forms and the days, the steps, licences and walls from
     abroad behind the plus, one type a list. No browser. */
  { name: "slots-open", script: "tests/spine/slots_open.test.ts" },
```

Stage the new files; COUNTS to `t3d-counts.txt`. Commit `src/lib/spine/slots/open.ts`, `src/components/spine/country/slots/StageOpen.tsx`, `src/lib/spine/slots/types.ts`, `src/components/spine/country/Slot.tsx`, `src/lib/spine/country_licences_rows.ts`, `src/lib/spine/sections/from_abroad.ts`, `src/lib/spine/copy.ts`, `tests/spine/slots_open.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:open: slot 6, the bill, the legal forms and the days, with the steps under fixed labels, the licences and the walls from abroad one tap down (plan 2026-10-13 country-page-journey, Task 3D)`.

---

### Task 3E: Stage 4, part one: slot 7, what a hire costs, and the dated row (asks Q2 first)

**Files:**
- Create: `src/lib/spine/slots/dated.ts`, `src/lib/spine/slots/hire.ts`, `src/components/spine/country/slots/StageHire.tsx`
- Modify: `src/lib/spine/sections/country_rules.ts` (`changeAround`, `ruleRaw`, `ruleRow`), `src/lib/spine/slots/types.ts` (`SlotRow.change`), `src/components/spine/country/Slot.tsx` (`after`), `src/lib/spine/copy.ts` (`COPY.journey.dated`, `hire`, `employ`, `more.statutory`)
- Test: `tests/spine/slots_hire.test.ts` (create; Review Focus 3)
- Modify: `scripts/prebuild_all.ts` (after `slots-open`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 3A's `list`, `present`, `SlotModel`, `SlotRow`, `Slot`; today's `buildPayBars` (`pay_rows.ts`), `getCountryRates` (`src/lib/tax/country_rates.ts`, `employerSocial` a fraction), `buildCountryEmployment` (`country_depth_rows.ts`, `leaveDays`), `buildHireAllIn` (`sections/hire_all_in.ts`), `buildJobMarket` (`sections/market_jobs.ts`), `lawValue`, `dateText`, `ruleNote` (`sections/country_rules.ts`), the shard's `people_pay.hiring.*` words, `HireLever`.
- Produces: in `country_rules.ts`: `changeAround(iso2, key, today) => { latest: { date; dateText; from: LawValue } | null; next: { date; dateText; from: LawValue; before: LawValue } | null }`, `ruleRaw(iso2, topic, key) => LawValue | null`, `ruleRow(iso2, topic, key, opts?: { bare?: boolean; label?: string; note?: string | null }) => SlotRow | null` (a file note's semicolon read as a comma). In `dated.ts`: `DATED_RECENT_DAYS = 120`, `type Dated = { value: string; note: string | null; change: string }`, `datedRow(iso2, change, today, fmt) => Dated | null`, `monthsOf(v)`. `SlotRow` gains `change?: string | null` (the ledger key that dates it; Task 3H's coverage reads it). `Slot({ model, children, after })`: `after` stands under the slot's rows, before its folds (Q2, answer A). In `hire.ts`: `HIRING_METRICS`, `hiringStates(iso2) => SlotRow[]`, `type HireDrawing = { iso2: string; pay: PayBarsData | null; rate: number | null }`, `buildHireSlot(iso2, today) => SlotModel<HireDrawing> | null`. `HireSlot({ model })` and `HireCost` (moved from `country-view.tsx`, unchanged) in `StageHire.tsx`. Gate `slots-hire`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_hire.test.ts`:

```ts
/**
 * STAGE 4, SLOT 7, WHAT A HIRE COSTS, AND THE DATED ROW (plan 2026-10-13 country-page-journey, Task 3E; spec sections 2 and 3; R5 section 5,
 * slot 7; Review Focus 3). The wage floor's full-time year at 30; the UK's money rules as rows; behind the plus, lists of one type: what
 * the employer adds, the rules of employing (each unit in its label), statutory pay a week, how hiring goes (the shard's four words, on
 * every country), an hour all in, the job market; the hire's lever under the rows. A rule the changes ledger dates prints its value in
 * force on `today` and a note that agrees with the ledger, switching together on the change's day.
 * BLIND SPOT, stated: the builder and the markup on four countries and three dates; the ledger's own truth is the changes file's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_hire.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildHireSlot } from "../../src/lib/spine/slots/hire";
import { datedRow, monthsOf } from "../../src/lib/spine/slots/dated";
import { HireSlot } from "../../src/components/spine/country/slots/StageHire";
import { buildPayBars } from "../../src/lib/spine/pay_rows";
import { dateText, lawValue } from "../../src/lib/spine/sections/country_rules";
import { usd } from "../../src/lib/spine/money";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-hire";
const FILE = "src/lib/spine/slots/hire.ts";
const REMEDY = "slot 7 from the pay pair, the employer's rate, the UK's rules and the shard's hiring words: the floor at 30, one type a list, units in the labels, a dated rule's value and note switching together";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const bare = (v: Parameters<typeof lawValue>[0]) => lawValue(v, true);
const D = COPY.journey.dated;

/* THE DATED ROW (Review Focus 3): the minimum wage the day before its change, the day of it, and long after. */
const before = datedRow("GB", "minimum-wage-21", "2026-03-31", bare);
const dayOf = datedRow("GB", "minimum-wage-21", "2026-04-01", bare);
const later = datedRow("GB", "minimum-wage-21", "2026-10-13", bare);
check(`the day before: the old value and the coming one dated (${before?.value}, ${before?.note})`, before?.value === "£12.21" && before.note === D.coming.replace("{to}", "£12.71 an hour").replace("{date}", dateText("2026-04-01") as string), "src/lib/spine/slots/dated.ts");
check(`the day of: the new value, dated since (${dayOf?.value}, ${dayOf?.note})`, dayOf?.value === "£12.71" && dayOf.note === D.since.replace("{date}", dateText("2026-04-01") as string), "src/lib/spine/slots/dated.ts");
check("past the recent window: the value, no note", later?.value === "£12.71" && later.note === null && later.change === "minimum-wage-21", "src/lib/spine/slots/dated.ts");
check("a key the ledger does not hold dates nothing", datedRow("GB", "no-such-change", "2026-10-13", bare) === null && monthsOf({ years: 2 }) === "24" && monthsOf({ months: 6 }) === "6", "src/lib/spine/slots/dated.ts");
const row = (today: string) => buildHireSlot("GB", today)?.more.find((l) => l.key === "employing")?.rows.find((r) => r.key === "dismissal");
const eve = row("2026-12-31");
const day = row("2027-01-01");
check(`the UK's unfair dismissal row on 31 Dec 2026: 24 months, 6 months coming (${eve?.value}, ${eve?.note})`, eve?.value === "24" && eve.note === D.coming.replace("{to}", "6 months").replace("{date}", dateText("2027-01-01") as string) && eve.change === "unfair-dismissal-period");
check(`and on 1 Jan 2027: 6 months, since that day (${day?.value}, ${day?.note})`, day?.value === "6" && day.note === D.since.replace("{date}", dateText("2027-01-01") as string));

const TODAY = "2026-10-13";
for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const m = buildHireSlot(iso2, TODAY);
  const floor = buildPayBars(iso2)?.rows.find((r) => r.key === "minimum")?.value;
  check(`${iso2} slot 7 leads with the wage floor's full-time year (${m?.lead?.figure})`, !!m && typeof floor === "number" && m.lead?.figure === usd(floor));
  if (!m) continue;
  check(`${iso2} how hiring goes: the shard's four words, a state each`, m.more.find((l) => l.key === "hiring")?.rows.length === 4 && m.more.find((l) => l.key === "hiring")!.type === "state");
  const html = renderToStaticMarkup(React.createElement(HireSlot, { model: m }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`);
  check(`${iso2} slot 7 reads clean (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('#hire[data-slot="hire"][data-stage="4"][data-answer="money"]'), "src/components/spine/country/slots/StageHire.tsx");
}
const kh = buildHireSlot("KH", TODAY)!;
check("Cambodia: the employer's share stands alone, so it rides the lead's words (Reading 15), no plus of one row", /%/.test(kh.lead?.words ?? "") && !kh.more.some((l) => l.key === "adds") && kh.rows === null);
const gb = buildHireSlot("GB", TODAY)!;
check(`the UK's pluses: ${gb.more.map((l) => l.key).join(", ")}`, JSON.stringify(gb.more.map((l) => l.key)) === JSON.stringify(["adds", "employing", "statutory", "hiring", "hour", "jobs"]));
check("the UK's own rows are money (the hourly floor, the allowance, the enrolment trigger), and the lead's words name no share", gb.rows?.type === "money" && JSON.stringify(gb.rows.rows.map((r) => r.key)) === JSON.stringify(["minimum-wage-21", "employment-allowance", "pension-trigger"]) && gb.lead?.words === COPY.pay.focalWords);
check("every row of the rules of employing carries its unit in its label, its value bare", (gb.more.find((l) => l.key === "employing")?.rows ?? []).every((r) => /, (days|weeks|months|hours)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
check("the hire's lever stands where its inputs do", gb.drawing.pay !== null && gb.drawing.rate !== null);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_hire: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3e.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/hire`.

- [ ] **Step 3: The words.** In `src/lib/spine/copy.ts`, inside `journey`, after `abroad` (Task 3D):

```ts
    /** A rule the changes ledger dates, on its own row (spec section 2; slots/dated.ts): the coming value and its day, or the day it began. */
    dated: { coming: "{to} from {date}", since: "since {date}" },
    /** Slot 7: the share riding the lead where it stands alone (Reading 15), the rows' labels the file's own are too long for. */
    hire: { leadShare: "a full-time year at the minimum wage, plus {share} from the employer", employer: "Employer's share", hourly: "Hourly minimum wage", hour: "One worked hour", vacancies: "Vacancies per 100", payroll: "Payroll change" },
    /** The rules of employing, a time each, its unit in its label (spec section 3: "units sit in the label"). */
    employ: { holiday: "Paid holiday, days", week: "Longest week, hours", dismissal: "Unfair dismissal, months", maternity: "Maternity pay, weeks", notice: "Notice, weeks", sick: "Sick pay, weeks", bankHolidays: "Bank holidays, days" },
```

and in `journey.more`, after `jobs: "The job market",` add `statutory: "Statutory pay a week",`.

- [ ] **Step 4: The ledger's reads.** In `src/lib/spine/sections/country_rules.ts`, add `import type { SlotRow } from "@/lib/spine/slots/types";` beside its imports, and after `nextChange`:

```ts
/** THE LEDGER AROUND ONE DAY, raw (plan 2026-10-13 country-page-journey, Task 3E): the newest change of a key in force on `today` and the
 *  soonest coming after it, each with its values as the file holds them, so a row can print them in its own form (src/lib/spine/slots/dated.ts). */
export function changeAround(iso2: string, key: string, today: string): { latest: { date: string; dateText: string; from: LawValue } | null; next: { date: string; dateText: string; from: LawValue; before: LawValue } | null } {
  const c = countryBlock<{ changes?: FileChange[] }>(changesJson, iso2);
  const all = (c?.changes ?? []).filter((x) => x.key === key);
  const past = all.filter((x) => x.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0];
  const coming = all.filter((x) => x.date > today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const pastText = past ? dateText(past.date) : null;
  const comingText = coming ? dateText(coming.date) : null;
  return {
    latest: past && pastText ? { date: past.date, dateText: pastText, from: past.from } : null,
    next: coming && comingText ? { date: coming.date, dateText: comingText, from: coming.from, before: coming.before } : null,
  };
}

/** One rule's value as the file holds it, or null. */
export function ruleRaw(iso2: string, topic: string, key: string): LawValue | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  const r = list?.find((x) => x.key === key);
  return r && r.value && typeof r.value === "object" ? r.value : null;
}

/** One rule as a slot's row: the file's label (or `label`), its value (bare drops the period, for a list whose label or head carries
 *  it), its note (or `note`; a file note's semicolon read as a comma, the copy rule); null where the file holds no value it can say. */
export function ruleRow(iso2: string, topic: string, key: string, opts: { bare?: boolean; label?: string; note?: string | null } = {}): SlotRow | null {
  const c = countryBlock<Record<string, unknown>>(rulesJson, iso2);
  const list = c && Array.isArray(c[topic]) ? (c[topic] as FileRule[]) : null;
  const r = list?.find((x) => x.key === key);
  const value = r ? lawValue(r.value, !!opts.bare) : null;
  if (!r || !value) return null;
  const note = opts.note !== undefined ? opts.note : typeof r.note === "string" ? r.note.replace(/;\s*/g, ", ") : null;
  return { key, label: opts.label ?? r.label, value, note };
}
```

`slots/types.ts` imports nothing from this module, so the type import closes no cycle.

- [ ] **Step 5: The dated row** `src/lib/spine/slots/dated.ts`:

```ts
/**
 * src/lib/spine/slots/dated.ts , A CHANGE DATED ON THE ROW IT CHANGES (plan 2026-10-13 country-page-journey, Task 3E; spec section 2: "the
 * rule changes stand in stage 6, each change also dated on the row it changes"; Review Focus 3). A row printing a rule the changes ledger
 * dates (data/sections/changes.json, through sections/country_rules.ts) takes the value in force on `today`, in the row's own form, and a
 * note that agrees with the ledger: the coming value and its day where a change is coming, else the day the value in force began while
 * that change is news (the changes slot's own window, 120 days). The page regenerates daily, so on a change's day the value and the note
 * switch together. Older changes print the value and no note; the changes slot keeps their dates.
 */
import { changeAround, lawValue, type LawValue } from "@/lib/spine/sections/country_rules";
import { COPY } from "@/lib/spine/copy";

/** How long a change in force stays news on its row: the changes slot's recent window (buildRuleChanges' `recentDays`). */
export const DATED_RECENT_DAYS = 120;

export type Dated = { value: string; note: string | null; change: string };

const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

/** A span in whole months, for a label that carries "months"; null for any other unit. */
export function monthsOf(v: LawValue): string | null {
  if (typeof v.years === "number") return String(v.years * 12);
  if (typeof v.months === "number" && typeof v.days !== "number") return String(v.months);
  return null;
}

/** The value a dated rule holds on `today` in the row's form (`fmt`), and the note that agrees with the ledger; null where the ledger does
 *  not date the rule, or `fmt` cannot say its value. */
export function datedRow(iso2: string, change: string, today: string, fmt: (v: LawValue) => string | null): Dated | null {
  const { latest, next } = changeAround(iso2, change, today);
  const held = latest ? latest.from : next ? next.before : null;
  const value = held ? fmt(held) : null;
  if (value == null) return null;
  const D = COPY.journey.dated;
  const to = next ? lawValue(next.from) : null;
  if (next && to) return { value, note: D.coming.replace("{to}", to).replace("{date}", next.dateText), change };
  if (latest && daysBetween(latest.date, today) <= DATED_RECENT_DAYS) return { value, note: D.since.replace("{date}", latest.dateText), change };
  return { value, note: null, change };
}
```

- [ ] **Step 6: A row's ledger key, and what stands under the rows.** In `src/lib/spine/slots/types.ts`, `SlotRow` gains `change?: string | null` before its closing `}` (with the comment `/** The changes ledger's key that dated this row (src/lib/spine/slots/dated.ts). */`). In `src/components/spine/country/Slot.tsx`: `export function Slot({ model, children }: { model: SlotModel<unknown>; children?: React.ReactNode }) {` becomes `export function Slot({ model, children, after }: { model: SlotModel<unknown>; children?: React.ReactNode; /** An instrument under the slot's rows, open (plan 2026-10-13 country-page-journey, Q2, answer A): the hire's and the loan's levers. */ after?: React.ReactNode }) {`, and after the line `      {model.rows ? <FactRows answer={model.rows.type} rows={model.rows.rows.map(toFactRow)} /> : null}` add `      {after}`. The header's frame order reads "the opener, the lead, the drawing, the rows, an instrument under them, the folds".

- [ ] **Step 7: The builder** `src/lib/spine/slots/hire.ts`:

```ts
/**
 * src/lib/spine/slots/hire.ts , STAGE 4, TO RUN, SLOT 7: WHAT A HIRE COSTS (plan 2026-10-13 country-page-journey, Task 3E; spec sections 2 and
 * 3; R5 section 5, slot 7): "What does one employee cost a year?" MONEY a year. The wage floor's full-time year at 30 (the staff card's one
 * figure since milestone 1, M3); the UK's money rules as rows (the hourly floor, the allowance, the enrolment trigger, the locals' note no
 * other slot prints, Reading 12); behind the plus, each list of one type: what the employer adds, the rules of employing (a time each, its
 * unit in its label), statutory pay a week, how hiring goes (the shard's four words, "Hiring staff" off the board), an hour all in and the
 * job market. The hire's lever stands under the rows (Q2, answer A). Where the employer's share would stand alone it rides the lead's words
 * (Reading 15). Thin: the floor and the share. With no floor the slot omits.
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildPayBars, type PayBarsData } from "@/lib/spine/pay_rows";
import { getCountryRates } from "@/lib/tax/country_rates";
import { buildCountryEmployment } from "@/lib/spine/country_depth_rows";
import { buildHireAllIn } from "@/lib/spine/sections/hire_all_in";
import { buildJobMarket } from "@/lib/spine/sections/market_jobs";
import { lawValue, ruleNote, ruleRaw, ruleRow, type LawValue } from "@/lib/spine/sections/country_rules";
import { queryFacts } from "@/lib/facts/store";
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import { datedRow, monthsOf } from "./dated";
import { list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const bare = (v: LawValue) => lawValue(v, true);
const count = (v: LawValue | null, unit: "weeks" | "hours" | "days"): string | null => (v && typeof v[unit] === "number" ? String(v[unit]) : null);
/** A file note that dates its rule ("since 1 Apr 2026") goes stale with the next change; the ledger dates the row instead. */
const undated = (note: string | null | undefined): string | null => (note && !/\b(since|from) \d{1,2} [A-Z][a-z]{2} \d{4}\b/.test(note) ? note : null);
/** A rule row whose value and note the ledger dates on `today`; the file's own note stands where it says no date. */
function datedRule(iso2: string, key: string, change: string, today: string, label?: string): SlotRow | null {
  const base = ruleRow(iso2, "employing", key, { bare: true, label });
  if (!base) return null;
  const d = datedRow(iso2, change, today, bare);
  return { ...base, value: d?.value ?? base.value, note: d?.note ?? undated(base.note), change: d?.change ?? null };
}

/** The shard's four words on hiring (Reading 14), each a state from a closed list. */
export const HIRING_METRICS = { hire: "people_pay.hiring.hire_ease", contracts: "people_pay.hiring.contract_ease", fire: "people_pay.hiring.fire_ease", depth: "people_pay.hiring.recruiting_depth" } as const;

export function hiringStates(iso2: string): SlotRow[] {
  const code = countryEntityId(iso2);
  if (!code || !loadCountryShard(code)) return [];
  return (Object.keys(HIRING_METRICS) as Array<keyof typeof HIRING_METRICS>).flatMap((k) => {
    const f = queryFacts({ entityId: code, metrics: [HIRING_METRICS[k]], rowKey: "" })[0];
    const word = f && f.tag !== "placeholder" && typeof f.value === "string" ? J.hiringWords[f.value.trim().toLowerCase()] : undefined;
    return word ? [{ key: k, label: J.hiringRows[k], value: word }] : [];
  });
}

export type HireDrawing = { iso2: string; pay: PayBarsData | null; rate: number | null };

export function buildHireSlot(iso2In: string, today: string): SlotModel<HireDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const pay = buildPayBars(iso2);
  const floor = pay && !pay.withheld ? pay.rows.find((r) => r.key === "minimum" && r.value > 0) ?? null : null;
  if (!floor) return null;
  const social = getCountryRates(iso2).employerSocial;
  const share = typeof social === "number" && social > 0 ? Math.round(social * 1000) / 10 : null;
  const H = J.hire;
  const E = J.employ;

  /* WHAT THE EMPLOYER ADDS: the employer's rate (the law's, dated, where the ledger holds it), then the pension minimums. */
  const ni = datedRow(iso2, "employer-ni", today, bare);
  const employer: SlotRow | null = ni ? { key: "employer", label: H.employer, value: ni.value, note: ni.note ?? undated(ruleNote(iso2, "employing", "employer-ni")), change: ni.change } : share != null ? { key: "employer", label: H.employer, value: `${share}%`, note: COPY.pay.employerShare } : null;
  const adds: SlotRow[] = present([employer, ruleRow(iso2, "employing", "pension-employer"), ruleRow(iso2, "employing", "pension-total")]);
  const addsList = list("adds", J.more.adds, "share", adds);

  /* THE UK'S MONEY RULES: the hourly floor and the allowance, each dated, and the enrolment trigger (the locals' second note). */
  const money: SlotRow[] = present([datedRule(iso2, "minimum-wage-21", "minimum-wage-21", today, H.hourly), datedRule(iso2, "employment-allowance", "employment-allowance", today), ruleRow(iso2, "employing", "pension-trigger", { bare: true })]);

  /* THE RULES OF EMPLOYING: a time each, its unit in its label, the dismissal period dated. */
  const employment = buildCountryEmployment(iso2);
  const raw = (key: string) => ruleRaw(iso2, "employing", key);
  const dismissal = datedRow(iso2, "unfair-dismissal-period", today, monthsOf);
  const dismissalOwn = raw("unfair-dismissal");
  const bankDays = ruleRaw(iso2, "holidays", "england-wales");
  const holidayYear = (ruleNote(iso2, "holidays", "england-wales") ?? "").match(/20\d\d/)?.[0] ?? null;
  const employing: SlotRow[] = present([
    employment?.leaveDays != null ? { key: "holiday", label: E.holiday, value: String(employment.leaveDays), note: COPY.employment.notes.leave } : null,
    count(raw("longest-week"), "hours") ? { key: "week", label: E.week, value: count(raw("longest-week"), "hours") as string, note: COPY.employment.notes.week } : null,
    dismissal ? { key: "dismissal", label: E.dismissal, value: dismissal.value, note: dismissal.note ?? COPY.employment.notes.dismissal, change: dismissal.change } : dismissalOwn && monthsOf(dismissalOwn) ? { key: "dismissal", label: E.dismissal, value: monthsOf(dismissalOwn) as string, note: COPY.employment.notes.dismissal } : null,
    count(raw("maternity-pay-length"), "weeks") ? { key: "maternity", label: E.maternity, value: count(raw("maternity-pay-length"), "weeks") as string, note: COPY.employment.notes.maternity } : null,
    count(raw("notice-2-to-12-years"), "weeks") ? { key: "notice", label: E.notice, value: count(raw("notice-2-to-12-years"), "weeks") as string, note: COPY.rulesRows.noticeNote } : null,
    count(raw("sick-pay-length"), "weeks") ? { key: "sick", label: E.sick, value: count(raw("sick-pay-length"), "weeks") as string, note: COPY.rulesRows.sickNote } : null,
    count(bankDays, "days") && holidayYear ? { key: "bank-holidays", label: E.bankHolidays, value: count(bankDays, "days") as string, note: COPY.rulesRows.holidaysNote.replace("{year}", holidayYear) } : null,
  ]);

  /* STATUTORY PAY A WEEK, each dated. */
  const statutory: SlotRow[] = present([datedRule(iso2, "sick-pay", "sick-pay-rate", today), datedRule(iso2, "maternity-pay-weekly", "maternity-pay-rate", today)]);

  /* AN HOUR, ALL IN: the law engine's worked hour, the parting bills and the law's two amounts printed nowhere else (the UK's alone). */
  const allIn = iso2 === "GB" ? buildHireAllIn({ allowance: true }) : null;
  const hour: SlotRow[] = allIn && allIn.perWorkedHour.usd != null
    ? [
        { key: "hour", label: H.hour, value: usd(allIn.perWorkedHour.usd), note: COPY.hireAllIn.words, prov: allIn.perWorkedHour.prov },
        ...allIn.parting.flatMap((p): SlotRow[] => (p.usd != null ? [{ key: `parting-${p.years}`, label: COPY.hireAllIn.parting[p.years], value: usd(p.usd), note: p.redundancy > 0 ? COPY.hireAllIn.partingNote : COPY.hireAllIn.partingNoteNotice, prov: p.prov }] : [])),
        ...allIn.extras.map((x): SlotRow => ({ key: x.key, label: x.label, value: x.value, note: x.note ?? null, prov: x.prov ?? null })),
      ]
    : [];

  /* THE JOB MARKET: the rates, then the trade's vacancies per hundred jobs and its payroll a year on. */
  const jm = buildJobMarket(iso2);
  const jobs: SlotRow[] = jm
    ? [
        ...jm.rates.map((r): SlotRow => ({ key: r.key, label: r.label, value: `${r.pct}%`, note: COPY.jobMarket.focalWords })),
        ...(jm.sector ? [{ key: "vacancies", label: H.vacancies, value: String(jm.sector.vacancies), note: jm.sector.label }, { key: "payroll", label: H.payroll, value: `${jm.sector.payrollChange}%`, note: COPY.jobMarket.payroll }] : []),
      ]
    : [];

  return {
    id: "hire",
    lead: { figure: usd(floor.value), words: !addsList && share != null ? H.leadShare.replace("{share}", `${share}%`) : COPY.pay.focalWords },
    rows: money.length > 0 ? { key: "money", head: J.slots.hire.heading, type: "money", rows: money } : null,
    more: present([
      addsList,
      list("employing", J.more.employing, "time", employing),
      list("statutory", J.more.statutory, "money", statutory),
      list("hiring", J.more.hiring, "state", hiringStates(iso2)),
      list("hour", J.more.hour, "money", hour),
      list("jobs", J.more.jobs, "share", jobs),
    ]),
    drawing: { iso2, pay, rate: share },
    thin: money.length === 0,
  };
}
```

A rule a step reads that the file lacks drops that row and nothing else; a list under two rows is no plus (`list`), so Cambodia, Afghanistan and Germany draw the lead (the share in its words) and "How hiring goes".

- [ ] **Step 8: The component** `src/components/spine/country/slots/StageHire.tsx`: the header comment, then move `function HireCost({ iso2, pay, rate }: ...)` from `src/components/spine/country/country-view.tsx` here unchanged (the whole function, its comments and the imports it uses: `HireLever`, `countryFigure`, `ruleAmount`, `lawValue`, `convertToUsd`, `COPY`, `isNum` as a local `const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);`), exported, and:

```tsx
/**
 * STAGE 4, SLOT 7, WHAT A HIRE COSTS (plan 2026-10-13 country-page-journey, Task 3E): the slot's frame (src/components/spine/country/Slot.tsx)
 * with the hire's lever under its rows (Q2, answer A), where the pay pair's average and the employer's rate stand. HireCost moved here from
 * country-view.tsx unchanged: the lever's start at the average, the UK's allowance and pension minimums in dollars, the law's pounds beside.
 */
export function HireSlot({ model }: { model: SlotModel<HireDrawing> }) {
  const { iso2, pay, rate } = model.drawing;
  return <Slot model={model} after={pay && rate != null ? <HireCost iso2={iso2} pay={pay} rate={rate} /> : null} />;
}
```

with `import { Slot } from "@/components/spine/country/Slot";`, `import type { SlotModel } from "@/lib/spine/slots/types";`, `import type { HireDrawing } from "@/lib/spine/slots/hire";` at the top. In `country-view.tsx` the moved function is replaced by `import { HireCost } from "@/components/spine/country/slots/StageHire";` (the `Hiring` card still calls it until Task 4 replaces the view).

- [ ] **Step 9: Under Q2 answered B only** (a plus holds one instrument): `DetailPanel` gains `instrument?: React.ReactNode` (drawn inside the open fold after its rows, its wrapper `data-instrument=""`), `scripts/harness/check_archetypes.mjs`'s HIDDEN GRAPHIC skips a graphic inside `[data-instrument]`, and the planted test in `tests/spine/answer_fold.test.ts` gains a fold with an instrument that HIDDEN GRAPHIC does not red; `HireSlot` passes the lever as the `hour` fold's instrument instead of `after`, and this task's test reads the lever inside `[data-fold="answer"] [data-instrument]`. Under A this step is skipped.

- [ ] **Step 10: Run it.** Test to `t3e-b.txt`: all PASS, exit 0. TYPECHECK to `t3e-tsc.txt`: 0. GATES `--only=slots-hire,slots-open,answer-fold,interact,harness-archetypes` to `t3e-gates.txt`: PASS (the lever's own gate, `interact`, reads the moved component by its markup).

- [ ] **Step 11: Wire and commit.** After `slots-open`:

```ts
  /* STAGE 4, SLOT 7, AND THE DATED ROW (plan 2026-10-13 country-page-journey, Task 3E; Review Focus 3): what a hire costs, one type a list,
     and a dated rule's value and note switching together on the change's day. No browser. */
  { name: "slots-hire", script: "tests/spine/slots_hire.test.ts" },
```

Stage the new files; COUNTS to `t3e-counts.txt`. Commit `src/lib/spine/slots/dated.ts`, `src/lib/spine/slots/hire.ts`, `src/components/spine/country/slots/StageHire.tsx`, `src/components/spine/country/country-view.tsx`, `src/lib/spine/sections/country_rules.ts`, `src/lib/spine/slots/types.ts`, `src/components/spine/country/Slot.tsx`, `src/lib/spine/copy.ts`, `tests/spine/slots_hire.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:hire: slot 7, the wage floor at 30, the rules of employing with their units in their labels, how hiring goes on every country, and a dated rule switching with its note (plan 2026-10-13 country-page-journey, Task 3E)`.

---

### Task 3F: Stage 4, part two: slots 8 to 11, running costs, credit, filings and the peers (asks Q2 first)

**Files:**
- Create: `src/lib/spine/slots/run.ts`, `src/components/spine/country/slots/StageRun.tsx`
- Modify: `src/components/spine/archetypes/CompareTable.tsx` (`stamp`), `src/lib/spine/copy.ts` (`COPY.journey.run`, `premises`, `lease`, `credit`, `filings`)
- Test: `tests/spine/slots_run.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `slots-hire`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Tasks 3A and 3E's `list`, `present`, `SlotModel`, `SlotRow`, `Slot` (with `after`), `datedRow`, `ruleRow`, `ruleRaw`; Task 2's `signalFor`; today's `getCountryProfile`, `isElectricityFill` (`running_costs_rows.ts`), `worldValues`, `worldRange` (`world_stats.ts`), `peerMarks` (`peer_marks.ts`), `placementOf` (`placement.ts`), `buildLeaseByLaw` (`sections/lease_by_law.ts`), `buildPayments`, `ruleValue` (`sections/country_rules.ts`), `buildCountryFinancing` (`country_depth_rows.ts`, `loan`, `baseRate`), `buildPeerTable` (`peer_rows.ts`), `WorldRangeRows`, `LoanLever`, `CompareTable`, `usdCents` (kit).
- Produces: in `run.ts`: `durationParts(text) => { figure: string; unit: "days" | "weeks" | "months" | "years"; rest: string } | null`; `buildRunningCostsSlot(iso2, today) => SlotModel<null> | null`; `type CreditDrawing = { iso2: string; rate: number; base: { share: number; display: string } | null; loan: { min: number; max: number; rate: number } | null }`, `buildCreditSlot(iso2, today) => SlotModel<CreditDrawing> | null`; `buildFilingsSlot(iso2, today) => SlotModel<null> | null`; `type PeersDrawing = { table: PeerTable; caveat?: string }`, `buildPeersSlot(iso2) => SlotModel<PeersDrawing> | null`. `RunningCostsSlot`, `CreditSlot`, `FilingsSlot`, `PeersSlot` (each `{ model }`) in `StageRun.tsx`. `CompareTable` gains `stamp?: Record<string, string>` (spread on its Box). Gate `slots-run`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_run.test.ts`:

```ts
/**
 * STAGE 4, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F; spec sections 2 to 4; R5 section 5, slots 8 to 11): running costs
 * (electricity at 30, placed with its signal, diesel a row; the UK's premises tax, insurance, the lease's state, terms and costs and the
 * peers' electricity behind the plus), credit and card fees (the lending rate at 30, placed with its signal, on the stage's one world
 * track, its reference a tick; the UK's card and payment shares as rows, its loans, payment split and waits behind the plus, the loan's
 * lever under the rows), filing deadlines (the UK's: the accounts at 30, the other deadlines a time each with its unit in its label, the
 * costs behind the plus) and the peers (the comparison table, stamped). On the UK, Cambodia, Afghanistan and Germany; each read clean by
 * the answer-type gate; every placed figure's mark the direction table's.
 * BLIND SPOT, stated: the builders and the components' markup; the track's drawing is WorldRange's own, read by its tests.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_run.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot, buildPeersSlot, durationParts } from "../../src/lib/spine/slots/run";
import { RunningCostsSlot, CreditSlot, FilingsSlot, PeersSlot } from "../../src/components/spine/country/slots/StageRun";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { worldValues } from "../../src/lib/spine/world_stats";
import { signalState } from "../../src/lib/spine/signal";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-run";
const FILE = "src/lib/spine/slots/run.ts";
const REMEDY = "build slots 8 to 11 from today's builders: the lead of the slot's type, placed with its signal where its measure has a direction, one type a list, units in the labels, the peers' table stamped";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const findings = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);
const marks = (doc: Document) => [...doc.querySelectorAll("[data-placed]")].map((el) => {
  const m = el.getAttribute("data-placed") ?? "";
  const dir = (OWNER_DIRECTION as Record<string, { direction: string }>)[m]?.direction;
  const has = !!el.querySelector(`[data-signal][data-measure="${m}"]`);
  return dir && (dir === "none" ? !has : has || ["set", "fill"].includes(el.getAttribute("data-no-signal") ?? "")) ? null : m;
}).filter(Boolean);

check("a duration's figure, unit and words", JSON.stringify(durationParts("14 days' warning")) === JSON.stringify({ figure: "14", unit: "days", rest: "warning" }) && JSON.stringify(durationParts("Over 7 years")) === JSON.stringify({ figure: "7", unit: "years", rest: "Over" }) && durationParts("3 to 12 months")?.figure === "3 to 12" && durationParts("By law") === null);

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const p = getCountryProfile(iso2);
  const run = buildRunningCostsSlot(iso2, TODAY);
  const kwh = p.electricity_usd_per_kwh_commercial as number;
  check(`${iso2} slot 8 leads with electricity at two places, placed, its signal recomputed (${run?.lead?.figure})`, !!run && run.lead?.figure === `$${kwh.toFixed(2)}` && run.lead.placed === "electricity" && run.lead.signal?.state === signalState(kwh, worldValues("electricity_usd_per_kwh_commercial"), "lower"));
  if (run) { const d = read(React.createElement(RunningCostsSlot, { model: run })); const f = findings(d); check(`${iso2} slot 8 reads clean, its marks the table's (${[...f, ...marks(d)].join("; ") || "clean"})`, f.length === 0 && marks(d).length === 0 && !!d.querySelector('#running-costs[data-slot="running-costs"][data-stage="4"][data-answer="money"]'), "src/components/spine/country/slots/StageRun.tsx"); }
  const credit = buildCreditSlot(iso2, TODAY);
  const rate = p.bank_lending_rate_pct as number;
  check(`${iso2} slot 9 leads with the lending rate, placed, its signal recomputed (${credit?.lead?.figure})`, !!credit && credit.lead?.figure === `${Math.round(rate * 1000) / 10}%` && credit.lead.placed === "lending-rate" && credit.lead.signal?.state === signalState(rate, worldValues("bank_lending_rate_pct"), "lower"));
  if (credit) { const d = read(React.createElement(CreditSlot, { model: credit })); const f = findings(d); check(`${iso2} slot 9 reads clean, its marks the table's, the track drawn (${[...f, ...marks(d)].join("; ") || "clean"})`, f.length === 0 && marks(d).length === 0 && !!d.querySelector('#credit[data-slot="credit"] [data-archetype="world-range"]'), "src/components/spine/country/slots/StageRun.tsx"); }
}
check("filings: the UK's alone", !!buildFilingsSlot("GB", TODAY) && !buildFilingsSlot("KH", TODAY) && !buildFilingsSlot("AF", TODAY) && !buildFilingsSlot("DE", TODAY));
check("the peers: the UK and Germany, not Cambodia or Afghanistan", !!buildPeersSlot("GB") && !!buildPeersSlot("DE") && !buildPeersSlot("KH") && !buildPeersSlot("AF"));
const gbRun = buildRunningCostsSlot("GB", TODAY)!;
check(`the UK's running costs pluses: ${gbRun.more.map((l) => l.key).join(", ")}`, JSON.stringify(gbRun.more.map((l) => l.key)) === JSON.stringify(["premises", "insurance", "lease", "lease-terms", "lease-costs", "peers-power"]));
check("the UK's lease terms: a time each, its unit in its label, its value bare", (gbRun.more.find((l) => l.key === "lease-terms")?.rows ?? []).every((r) => /, (days|weeks|months|years)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
check("diesel is a row with its unit in its label (no '/L' in the cell)", gbRun.rows?.type === "money" && (gbRun.rows.rows ?? []).every((r) => !/\/L/.test(r.value)));
const gbCredit = buildCreditSlot("GB", TODAY)!;
check(`the UK's credit rows (${gbCredit.rows?.rows.map((r) => r.key).join(", ")}) and pluses (${gbCredit.more.map((l) => l.key).join(", ")})`, gbCredit.rows?.type === "share" && JSON.stringify(gbCredit.more.map((l) => l.key)) === JSON.stringify(["loans", "pay", "lands"]) && gbCredit.drawing.loan !== null && gbCredit.drawing.base !== null);
check("Cambodia's credit: the rate on its track alone", buildCreditSlot("KH", TODAY)!.rows === null && buildCreditSlot("KH", TODAY)!.more.length === 0);
const gbFile = buildFilingsSlot("GB", TODAY)!;
const d = read(React.createElement(FilingsSlot, { model: gbFile }));
check(`the UK's filings read clean (${findings(d).join("; ") || "clean"}), the accounts at 30, the costs behind the plus`, findings(d).length === 0 && /\d/.test(gbFile.lead?.figure ?? "") && gbFile.more.some((l) => l.key === "costs" && l.type === "money"), "src/components/spine/country/slots/StageRun.tsx");
const peers = read(React.createElement(PeersSlot, { model: buildPeersSlot("GB")! }));
check("the peers' table is the slot, stamped, one Box", !!peers.querySelector('#peers[data-slot="peers"][data-stage="4"][data-answer="table"][data-archetype="compare-table"]') && peers.querySelectorAll("#peers").length === 1, "src/components/spine/country/slots/StageRun.tsx");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_run: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3f.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/run`.

- [ ] **Step 3: The words.** In `src/lib/spine/copy.ts`, inside `journey`, after `employ` (Task 3E):

```ts
    /** Slot 8's own row and the UK's three premises rules, their labels as the page printed them. */
    run: { diesel: "Diesel per litre" },
    premises: { relief: "Full rates relief", rates: "Business rates", retail: "Shops and cafés" },
    /** The UK's lease, split by answer type: its rules' states, its terms with their units, its costs. */
    lease: { notice: "Landlord notice, months", optOut: "Opting out, days", request: "Renewal request, months", newLease: "New lease, years", short: "Short leases, months", registered: "Registered over, years", exempt: "Exempt", compensated: "Compensated" },
    /** Slot 9: the lead's words, the UK's loan rate row, the waits' labels. */
    credit: { words: "a year, the average rate on a business bank loan", loanRate: "Start-up loan rate", payouts: "Card payouts, days", terms: "Payment terms, days", agreed: "Agreed limit, days" },
    /** Slot 10: the UK's deadlines, a time each, its unit in its label. */
    filings: { taxReturn: "Tax return, months", taxPayment: "Tax payment, months", vatReturn: "VAT return, months", andDays: "and {n} days, {note}", andDay: "and 1 day, {note}" },
```

and in `journey.more` the line `      loans: "Start-up loans",` becomes `      loans: "Loans and grants",`.

- [ ] **Step 4: The table takes the slot's stamps.** In `src/components/spine/archetypes/CompareTable.tsx`, `CompareTableProps` gains `/** The country page's journey (plan 2026-10-13 country-page-journey): slot 11's stamps on the table's Box. */ stamp?: Record<string, string>;`, the destructure `export function CompareTable({ id, kicker, icon, rows, columns, caveat, entityHead, withheld, note, flags = true, sample = false, inBand = false, zone = false }: CompareTableProps) {` gains `stamp` after `zone = false`, and `<Box id={id} data-archetype="compare-table"` becomes `<Box id={id} {...(stamp ?? {})} data-archetype="compare-table"`.

- [ ] **Step 5: The builders** `src/lib/spine/slots/run.ts`:

```ts
/**
 * src/lib/spine/slots/run.ts , STAGE 4, TO RUN, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F; spec sections 2 to 4; R5 section
 * 5): "What does staying open cost?" after the hire (slot 7, slots/hire.ts):
 *   8  RUNNING COSTS (MONEY per unit): electricity at 30, placed among the countries with its signal (the fill never printed, never placed),
 *      diesel a row; behind the plus the UK's premises tax, insurance the law requires, its lease split by type, the peers' electricity.
 *   9  CREDIT AND CARD FEES (SHARE): the lending rate at 30, placed with its signal, on the stage's one world track (the central bank's rate
 *      its reference, a tick); the UK's card, cash and late-payment shares as rows; its loans, payment split and waits behind the plus; the
 *      loan's lever under the rows (Q2, answer A).
 *   10 FILING DEADLINES (TIME): the UK's annual accounts at 30, the other deadlines a time each with its unit in its label, the costs behind
 *      the plus.
 *   11 AGAINST THE PEERS (table): the comparison table, its own Box stamped as the slot.
 * Each returns null where its data is absent (no seat). Rules the changes ledger dates carry its dating (slots/dated.ts).
 */
import { usdCents } from "@/components/spine/kit";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { getCountryProfile } from "@/lib/economic_profile";
import { isElectricityFill } from "@/lib/spine/running_costs_rows";
import { worldRange, worldValues } from "@/lib/spine/world_stats";
import { peerMarks } from "@/lib/spine/peer_marks";
import { placementOf } from "@/lib/spine/placement";
import { signalFor } from "@/lib/spine/signal";
import { buildLeaseByLaw } from "@/lib/spine/sections/lease_by_law";
import { buildPayments, lawValue, ruleRaw, ruleRow, ruleValue, type LawValue } from "@/lib/spine/sections/country_rules";
import { buildCountryFinancing } from "@/lib/spine/country_depth_rows";
import { buildPeerTable, type PeerTable } from "@/lib/spine/peer_rows";
import { datedRow } from "./dated";
import { list, present, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;
const bare = (v: LawValue) => lawValue(v, true);
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const profileProv = (iso2: string, field: string) => ({ src: `economic_indicators/country_profile_v2.json:${field}`, kind: getCountryProfile(iso2).tier === "A" ? ("looked up" as const) : ("estimate" as const) });

/** A duration's figure, its unit and the words around them: "14 days' warning" is 14, days and "warning"; null where no duration stands. */
export function durationParts(text: string): { figure: string; unit: "days" | "weeks" | "months" | "years"; rest: string } | null {
  const m = (text || "").replace(/[\s ]+/g, " ").trim().match(/^(.*?)(\d+(?:\.\d+)?(?: to \d+(?:\.\d+)?)?) (days?|weeks?|months?|years?)(?:'s|')?(.*)$/i);
  if (!m) return null;
  const unit = m[3].toLowerCase().replace(/s?$/, "s") as "days" | "weeks" | "months" | "years";
  return { figure: m[2], unit, rest: `${m[1]} ${m[4]}`.replace(/\s+/g, " ").trim() };
}

/** A dated rule's row: the ledger's value and note where it dates the rule, the file's otherwise. */
function dated(base: SlotRow | null, iso2: string, change: string, today: string): SlotRow | null {
  if (!base) return null;
  const d = datedRow(iso2, change, today, bare);
  return d ? { ...base, value: d.value, note: d.note ?? base.note ?? null, change } : base;
}

/* ----- SLOT 8, RUNNING COSTS ----- */
export function buildRunningCostsSlot(iso2In: string, today: string): SlotModel<null> | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  if (profile.iso2.toUpperCase() !== iso2) return null;
  const F = "electricity_usd_per_kwh_commercial";
  const kwh = isPos(profile.electricity_usd_per_kwh_commercial) && !isElectricityFill(profile.electricity_usd_per_kwh_commercial) ? profile.electricity_usd_per_kwh_commercial : null;
  const set = worldValues(F);
  const lead: SlotLead | null = kwh != null ? { figure: usdCents(kwh), words: COPY.ranged.electricityWords, placement: placementOf(kwh, set, "countries"), placed: "electricity", ...signalFor("electricity", kwh, set), prov: profileProv(iso2, F) } : null;
  const diesel = isPos(profile.diesel_usd_per_liter) ? profile.diesel_usd_per_liter : null;
  const rows: SlotRow[] = diesel != null ? [{ key: "diesel", label: J.run.diesel, value: usdCents(diesel), note: COPY.ranged.dieselNote, prov: profileProv(iso2, "diesel_usd_per_liter") }] : [];
  if (!lead && rows.length === 0) return null;

  const P = J.premises;
  const premises = present([
    ruleRow(iso2, "premises", "full-relief-limit", { label: P.relief, note: COPY.rulesRows.reliefNote }),
    dated(ruleRow(iso2, "premises", "small-multiplier", { label: P.rates, note: COPY.rulesRows.ratesNote }), iso2, "rates-small-multiplier", today),
    ruleRow(iso2, "premises", "small-retail-multiplier", { label: P.retail, note: COPY.rulesRows.retailNote }),
  ]);
  const insurance = present([
    ruleRow(iso2, "insurance", "employers-liability-cover", { bare: true }),
    ruleRow(iso2, "insurance", "employers-liability-fine", { bare: true }),
    ruleRow(iso2, "insurance", "certificate-fine", { bare: true }),
  ]);

  /* THE UK'S LEASE, BY TYPE (sections/lease_by_law.ts): its rules' states (a figure in a rule that is a state moves to the row's note),
     its terms a time each with its unit in its label (the landlord's least notice first, the card's figure before), its stamp duty. */
  const lease = iso2 === "GB" ? buildLeaseByLaw() : null;
  const L = J.lease;
  const byKey = new Map((lease?.rows ?? []).map((r) => [r.key, r]));
  const leaseState: SlotRow[] = present([
    byKey.get("renewal") ? { key: "renewal", label: byKey.get("renewal")!.label, value: byKey.get("renewal")!.value, note: byKey.get("renewal")!.note ?? null } : null,
    byKey.get("repairs") ? { key: "repairs", label: byKey.get("repairs")!.label, value: byKey.get("repairs")!.value, note: byKey.get("repairs")!.note ?? null } : null,
    byKey.get("vat") ? { key: "vat", label: byKey.get("vat")!.label, value: L.exempt, note: byKey.get("vat")!.value } : null,
    byKey.get("refused") ? { key: "refused", label: byKey.get("refused")!.label, value: L.compensated, note: [byKey.get("refused")!.value, byKey.get("refused")!.note].filter(Boolean).join(", ") } : null,
  ]);
  const TERMS: Array<[string, string, boolean]> = [["signing-away", L.optOut, false], ["asking", L.request, false], ["new-lease", L.newLease, false], ["short", L.short, false], ["registering", L.registered, true]];
  const leaseTerms: SlotRow[] = lease
    ? [
        { key: "notice", label: L.notice, value: String(lease.focal.months), note: COPY.leaseByLaw.words, prov: lease.focal.prov },
        ...TERMS.flatMap(([key, label, dropRest]): SlotRow[] => {
          const r = byKey.get(key);
          const d = r ? durationParts(r.value) : null;
          /* The label carries the unit, so a term the file states in another unit stands nowhere rather than under a wrong label. */
          if (!r || !d || !label.endsWith(d.unit)) return [];
          const note = [dropRest || !d.rest ? null : capFirst(d.rest), r.note ? (dropRest || !d.rest ? r.note : lowFirst(r.note)) : null].filter(Boolean).join(", ");
          return [{ key, label, value: d.figure, note: note || null, prov: r.prov ?? null }];
        }),
      ]
    : [];
  const leaseCosts: SlotRow[] = (lease?.tax ?? []).flatMap((t, i): SlotRow[] => (t.usd == null ? [] : [{ key: `tax-${t.years}`, label: COPY.leaseByLaw.taxLabel[t.years], value: usd(t.usd), note: i > 0 && t.dueDays != null ? COPY.leaseByLaw.taxNoteDue.replace("{days}", String(t.dueDays)) : COPY.leaseByLaw.taxNote, prov: t.prov }]));
  /* THE PEERS' ELECTRICITY (Reading 9): the peers the track marked, as rows without doors (Reading 20: this slot locks, and a locked slot
     keeps no link a free reader would lose). */
  const peers: SlotRow[] = kwh != null ? (peerMarks(iso2, F) ?? []).map((m) => ({ key: m.iso2, label: m.name, value: usdCents(m.value) })) : [];

  const M = J.more;
  return {
    id: "running-costs",
    lead,
    rows: rows.length ? { key: "own", head: J.slots["running-costs"].heading, type: "money", rows } : null,
    more: present([list("premises", M.premises, "money", premises), list("insurance", M.insurance, "money", insurance), list("lease", M.lease, "state", leaseState), list("lease-terms", M.leaseTerms, "time", leaseTerms), list("lease-costs", M.leaseCosts, "money", leaseCosts), list("peers-power", M.peersPower, "money", peers)]),
    drawing: null,
    thin: !lead,
  };
}

/* ----- SLOT 9, CREDIT AND CARD FEES ----- */
export type CreditDrawing = { iso2: string; rate: number; base: { share: number; display: string } | null; loan: { min: number; max: number; rate: number } | null };
export function buildCreditSlot(iso2In: string, today: string): SlotModel<CreditDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const profile = getCountryProfile(iso2);
  const F = "bank_lending_rate_pct";
  const rate = profile.iso2.toUpperCase() === iso2 && isPos(profile.bank_lending_rate_pct) ? profile.bank_lending_rate_pct : null;
  if (rate == null) return null;
  const set = worldValues(F);
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  const C = J.credit;
  const lead: SlotLead = { figure: pct(rate), words: C.words, placement: placementOf(rate, set, "countries"), placed: "lending-rate", ...signalFor("lending-rate", rate, set), prov: profileProv(iso2, F) };
  /* THE CENTRAL BANK'S RATE, THE TRACK'S REFERENCE (a tick since Task 2), placed only inside the world's range. */
  const fin = buildCountryFinancing(iso2);
  const range = worldRange(F);
  const baseShare = fin?.baseRate != null && fin.baseRate > 0 ? fin.baseRate / 100 : null;
  const base = baseShare != null && range && baseShare >= range.min && baseShare <= range.max ? { share: baseShare, display: String(fin?.cells.find((c) => c.key === "base")?.value ?? `${fin?.baseRate}%`) } : null;

  const pay = buildPayments(iso2);
  const R = COPY.rulesRows.payments;
  const share = (v: number) => `${v}%`;
  const loanRate = fin?.loan ? dated({ key: "loan-rate", label: C.loanRate, value: share(fin.loan.rate), note: null }, iso2, "start-up-loan-rate", today) : null;
  const rows: SlotRow[] = present([
    pay && pay.feeLow != null && pay.feeHigh != null ? { key: "readers", label: R.readers, value: pay.feeLow === pay.feeHigh ? share(pay.feeLow) : `${share(pay.feeLow)} to ${share(pay.feeHigh)}`, note: R.readersNote } : null,
    pay?.cash ? { key: "cash", label: R.cash, value: share(pay.cash.now), note: R.cashNote.replace("{then}", share(pay.cash.then)).replace("{thenYear}", pay.cash.thenYear) } : null,
    ruleRow(iso2, "paying", "statutory-interest"),
    loanRate,
  ]);
  const loans: SlotRow[] = fin?.loan
    ? [
        { key: "loan-least", label: ruleRow(iso2, "financing", "start-up-loan-min")?.label ?? COPY.financing.cells.startup, value: usd(fin.loan.min), note: ruleValue(iso2, "financing", "start-up-loan-min") },
        { key: "loan-most", label: ruleRow(iso2, "financing", "start-up-loan-max")?.label ?? COPY.financing.cells.startup, value: usd(fin.loan.max), note: ruleValue(iso2, "financing", "start-up-loan-max") },
        ...(fin.cells.filter((c) => c.key.startsWith("grant-")).map((c): SlotRow => ({ key: c.key, label: c.label, value: String(c.value), note: c.note ?? null }))),
      ]
    : [];
  const split: SlotRow[] = (pay?.parts ?? []).map((p, i) => ({ key: p.key, label: p.name, value: share(p.share), note: i === 0 ? R.basis.replace("{period}", pay!.period) : null }));
  const raw = (key: string) => ruleRaw(iso2, "paying", key);
  const lands: SlotRow[] = present([
    pay?.payoutDays != null ? { key: "payouts", label: C.payouts, value: String(pay.payoutDays), note: pay.payoutFast ? R.payoutNote : null } : null,
    typeof raw("default-payment-period")?.days === "number" ? { key: "terms", label: C.terms, value: String(raw("default-payment-period")!.days), note: ruleRow(iso2, "paying", "default-payment-period")?.note ?? null } : null,
    typeof raw("agreed-period-business")?.days === "number" ? { key: "agreed", label: C.agreed, value: String(raw("agreed-period-business")!.days), note: ruleRow(iso2, "paying", "agreed-period-business")?.note ?? null } : null,
  ]);
  const M = J.more;
  return {
    id: "credit",
    lead,
    rows: rows.length ? { key: "own", head: J.slots.credit.heading, type: "share", rows } : null,
    more: present([list("loans", M.loans, "money", loans), list("pay", M.pay, "share", split), list("lands", M.lands, "time", lands)]),
    drawing: { iso2, rate, base, loan: fin?.loan ?? null },
    thin: rows.length === 0,
  };
}

/* ----- SLOT 10, FILING DEADLINES ----- */
export function buildFilingsSlot(iso2In: string, today: string): SlotModel<null> | null {
  const iso2 = iso2In.toUpperCase();
  const accounts = ruleRaw(iso2, "filings", "accounts-deadline");
  const accountsText = accounts ? lawValue(accounts) : null;
  if (!accountsText) return null;
  const F = J.filings;
  /* A deadline in months and days: the months its figure, the days said in its note. */
  const monthsRow = (key: string, label: string): SlotRow | null => {
    const v = ruleRaw(iso2, "filings", key);
    const note = ruleRow(iso2, "filings", key)?.note ?? "";
    if (!v || typeof v.months !== "number") return null;
    const days = typeof v.days === "number" ? v.days : 0;
    return { key, label, value: String(v.months), note: days === 0 ? note || null : (days === 1 ? F.andDay : F.andDays.replace("{n}", String(days))).replace("{note}", note) };
  };
  const rows = present([monthsRow("tax-return-deadline", F.taxReturn), monthsRow("corporation-tax-payment", F.taxPayment), monthsRow("vat-return-deadline", F.vatReturn)]);
  const lateLow = ruleValue(iso2, "filings", "late-accounts-1");
  const lateHigh = ruleValue(iso2, "filings", "late-accounts-4");
  const costs = present([
    dated(ruleRow(iso2, "filings", "confirmation-statement-fee", { note: COPY.rulesRows.statementWords }), iso2, "confirmation-statement-fee", today),
    lateLow && lateHigh ? { key: "late-accounts", label: ruleRow(iso2, "filings", "late-accounts-1")?.label ?? "", value: `${lateLow} to ${lateHigh}`, note: COPY.rulesRows.lateAccountsNote } : null,
  ]);
  return {
    id: "filings",
    lead: { figure: accountsText, words: J.slots.filings.words },
    rows: rows.length ? { key: "own", head: J.slots.filings.heading, type: "time", rows } : null,
    more: present([list("costs", J.more.filingCosts, "money", costs)]),
    drawing: null,
    thin: false,
  };
}

/* ----- SLOT 11, AGAINST THE PEERS ----- */
export type PeersDrawing = { table: PeerTable; caveat?: string };
export function buildPeersSlot(iso2: string): SlotModel<PeersDrawing> | null {
  const table = buildPeerTable(iso2);
  if (!table) return null;
  /* His ruling of 2026-10-05 on PARKED P04.2: the UK's peers kept, called estimates; no other caveat prints. */
  const caveat = table.caveat === COPY.peers.caveatEstimates ? table.caveat : undefined;
  return { id: "peers", lead: null, rows: null, more: [], drawing: { table, caveat }, thin: false };
}
```

A rule the file lacks drops its row and nothing else; a list under two rows is no plus.

- [ ] **Step 6: The components** `src/components/spine/country/slots/StageRun.tsx`:

```tsx
/**
 * STAGE 4, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F): running costs, credit (the lending rate's world track with its
 * peers and its reference, the loan's lever under the rows), filing deadlines in the slot's frame, and the peers' table stamped as slot 11.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { WorldRangeRows, type WorldRangeRow } from "@/components/spine/charts/WorldRange";
import { LoanLever } from "@/components/spine/interact/LoanLever";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { COPY } from "@/lib/spine/copy";
import { worldRange, worldValues } from "@/lib/spine/world_stats";
import { peerMarks } from "@/lib/spine/peer_marks";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { CreditDrawing, PeersDrawing } from "@/lib/spine/slots/run";

export function RunningCostsSlot({ model }: { model: SlotModel<null> }) {
  return <Slot model={model} />;
}

export function CreditSlot({ model }: { model: SlotModel<CreditDrawing> }) {
  const { iso2, rate, base, loan } = model.drawing;
  const F = "bank_lending_rate_pct";
  const range = worldRange(F);
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  /* THE STAGE'S ONE WORLD TRACK (Reading 9; clause 64), headless: the figure is the slot's lead, so the track prints it once there. */
  const rows: WorldRangeRow[] = range ? [{ key: "lending", label: COPY.ranged.lending, value: rate, display: pct(rate), range, fmt: pct, scale: "log", hairlines: worldValues(F), peers: peerMarks(iso2, F), peersWord: COPY.ranged.peers, refs: base ? [{ key: "base", label: COPY.financing.cells.base, value: base.share, display: base.display }] : null }] : [];
  return (
    <Slot model={model} after={loan ? <LoanLever min={loan.min} max={loan.max} rate={loan.rate} termMin={COPY.financing.startupTerm.min} termMax={COPY.financing.startupTerm.max} words={COPY.financing.loan} /> : null}>
      {rows.length ? <div className="mb-5"><WorldRangeRows rows={rows} headless ends={COPY.ranged.ends} /></div> : null}
    </Slot>
  );
}

export function FilingsSlot({ model }: { model: SlotModel<null> }) {
  return <Slot model={model} />;
}

export function PeersSlot({ model }: { model: SlotModel<PeersDrawing> }) {
  const def = slotDef("peers");
  const { table, caveat } = model.drawing;
  return <CompareTable id={def.domId} kicker={def.heading} icon={def.icon ?? "benchmark"} rows={table.rows} columns={table.columns} caveat={caveat} zone stamp={{ "data-slot": def.id, "data-stage": String(stageOfSlot("peers").n), "data-answer": def.type }} />;
}
```

- [ ] **Step 7: Under Q2 answered B only:** `CreditSlot` passes the loan's lever as the `loans` fold's `instrument` (Task 3E, Step 9's DetailPanel prop) instead of `after`, and this task's test reads the lever inside `[data-fold="answer"] [data-instrument]`. Under A this step is skipped.

- [ ] **Step 8: Run it.** Test to `t3f-b.txt`: all PASS, exit 0. A peer whose name runs past three words in "Peers' electricity" is a ROW SENTENCE fault once the fold is read open: the report names it and the controller reads it with the label (no peer group of the four countries holds one, read off `buildPeerTable`'s rows in the test's output). TYPECHECK to `t3f-tsc.txt`: 0. GATES `--only=slots-run,slots-hire,signal,answer-fold,interact,harness-archetypes,world-range-no-median` to `t3f-gates.txt`: PASS (the archetype sheet draws CompareTable unstamped).

- [ ] **Step 9: Wire and commit.** After `slots-hire`:

```ts
  /* STAGE 4, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F): running costs and credit placed with their signals, the UK's
     filings, the peers stamped. No browser. */
  { name: "slots-run", script: "tests/spine/slots_run.test.ts" },
```

Stage the new files; COUNTS to `t3f-counts.txt`. Commit `src/lib/spine/slots/run.ts`, `src/components/spine/country/slots/StageRun.tsx`, `src/components/spine/archetypes/CompareTable.tsx`, `src/lib/spine/copy.ts`, `tests/spine/slots_run.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:run: running costs and credit placed with their signals on every country, the UK's premises, insurance, lease, loans, payments and filings one type a list, the peers stamped (plan 2026-10-13 country-page-journey, Task 3F)`.

---

### Task 3G: Stage 5, to last: slots 12 and 13, how many last and selling or failing

**Files:**
- Create: `src/lib/spine/slots/last.ts`, `src/components/spine/country/slots/StageLast.tsx`
- Modify: `src/lib/spine/country_exit_rows.ts` (`worldExitHighs`), `src/lib/spine/copy.ts` (`COPY.journey.lastRows`, `exit`)
- Test: `tests/spine/slots_last.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `slots-run`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Tasks 3A, 3E and 3F's `list`, `present`, `valueClass`, `SlotModel`, `SlotRow`, `SlotLead`, `Slot`, `datedRow`, `ruleRow`, `ruleRaw`, `durationParts`; Task 2's `signalFor`; today's `buildSurvival`, `buildObstacles` (`sections/first_years.ts`), `buildFirmsLast` (`src/lib/home/firms_last.ts`), `buildDuel` (`src/lib/home/duel.ts`), `buildCountryExit`, `exitMonthsText` (`country_exit_rows.ts`), `buildIfItFails` (`sections/if_it_fails.ts`), `SurvivalCurve` (`interact/SurvivalCurve.tsx`), `RangePair`.
- Produces: `worldExitHighs() => number[] | null` in `country_exit_rows.ts`; in `last.ts`: `type LastingDrawing = { survival: Survival }`, `buildLastingSlot(iso2, today) => SlotModel<LastingDrawing> | null`, `type ExitDrawing = { exit: CountryExitData | null }`, `buildExitSlot(iso2, today) => SlotModel<ExitDrawing> | null`. `LastingSlot`, `ExitSlot` (each `{ model }`) in `StageLast.tsx`. Gate `slots-last`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_last.test.ts`:

```ts
/**
 * STAGE 5, TO LAST (plan 2026-10-13 country-page-journey, Task 3G; spec sections 2 and 3; R5 section 5, slots 12 and 13): how many last (the
 * UK's survival curve with its figure at 30 and its region lever, what holds firms back, by city and the trades that fail most behind the
 * plus, shares each) and selling or failing (off the UK, the time to sell at 30, placed among the countries with its signal, the buyers in
 * its words; on the UK, if it fails: the months to be freed at 30, its times as rows with their units in their labels, its costs and what it
 * reaches behind the plus, the director's loan charge left for slot 1). On the UK, Cambodia, Afghanistan and Germany.
 * BLIND SPOT, stated: the builders and the markup; the duel prints only while its feed is fresh (45 days), so its plus is read where it draws.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_last.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildLastingSlot, buildExitSlot } from "../../src/lib/spine/slots/last";
import { LastingSlot, ExitSlot } from "../../src/components/spine/country/slots/StageLast";
import { buildCountryExit, worldExitHighs } from "../../src/lib/spine/country_exit_rows";
import { signalState } from "../../src/lib/spine/signal";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-last";
const FILE = "src/lib/spine/slots/last.ts";
const REMEDY = "build slots 12 and 13 from the survival file, the exit shard and the UK's failure law: one type a list, units in the labels, the time to sell placed with its signal";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const clean = (el: React.ReactElement) => readAnswerTypes(new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);

const gb = buildLastingSlot("GB", TODAY);
check(`the UK's slot 12: the curve drawn, its pluses ${gb?.more.map((l) => l.key).join(", ")}`, !!gb && gb.lead === null && gb.more[0]?.key === "back" && gb.more[1]?.key === "by-city" && gb.more.every((l) => l.type === "share" && ["back", "by-city", "fail-most"].includes(l.key)));
if (gb) { const f = clean(React.createElement(LastingSlot, { model: gb })); check(`the UK's slot 12 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 12 (no survival file)", !buildLastingSlot("KH", TODAY) && !buildLastingSlot("AF", TODAY) && !buildLastingSlot("DE", TODAY));

for (const iso2 of ["KH", "AF", "DE"]) {
  const m = buildExitSlot(iso2, TODAY);
  const exit = buildCountryExit(iso2);
  const hi = exit?.marks[exit.marks.length - 1].value;
  const highs = worldExitHighs();
  check(`${iso2} slot 13: the time to sell at 30, placed, its signal recomputed (${m?.lead?.figure})`, !!m && !!exit && typeof hi === "number" && !!highs && m.lead?.placed === "time-to-sell" && m.lead.signal?.state === signalState(hi, highs, "lower") && /months?$/.test(m.lead.figure));
  if (m) { const f = clean(React.createElement(ExitSlot, { model: m })); check(`${iso2} slot 13 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }
}
const gbExit = buildExitSlot("GB", TODAY)!;
check(`the UK's slot 13 is if it fails: the months to be freed at 30, the times ${gbExit.rows?.rows.map((r) => r.key).join(", ")}, the pluses ${gbExit.more.map((l) => l.key).join(", ")}`, gbExit.rows?.type === "time" && JSON.stringify(gbExit.rows.rows.map((r) => r.key)) === JSON.stringify(["liquidation-time", "director-ban", "strike-off-notice", "no-trading-period"]) && JSON.stringify(gbExit.more.map((l) => l.key)) === JSON.stringify(["costs", "reach"]));
check("the director's loan charge is slot 1's, never here", ![...(gbExit.rows?.rows ?? []), ...gbExit.more.flatMap((l) => l.rows)].some((r) => r.key === "directors-loan"));
check("the UK's times carry their units in their labels, their values bare", (gbExit.rows?.rows ?? []).every((r) => /, (months|years)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
{ const f = clean(React.createElement(ExitSlot, { model: gbExit })); check(`the UK's slot 13 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_last: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3g.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/last`.

- [ ] **Step 3: The words and the world's sale times.** In `src/lib/spine/copy.ts`, inside `journey`, after `filings` (Task 3F):

```ts
    /** Slot 12's pluses: the first row's note in each, the duel's middle trade. */
    lastRows: { cohort: "born in {cohort}, still trading in {year}", insolvent: "of companies insolvent a year", middle: "Middle trade", ofTrades: "the middle of {n} trades" },
    /** Slot 13 on the UK: its times, each unit in its label. */
    exit: { liquidation: "Liquidation, months", ban: "Director ban, years", strikeNotice: "Strike-off notice, months", noTrading: "No-trading period, months" },
```

In `src/lib/spine/country_exit_rows.ts`, after `function worldExit(): WorldExit | null { ... }`:

```ts
/** The slow ends of every shard's sale time, lowest first, the set the placement reads (plan 2026-10-13 country-page-journey, Task 3G: the
 *  signal reads the same set), or null where the scan read too little. */
export function worldExitHighs(): number[] | null {
  return worldExit()?.highs ?? null;
}
```

- [ ] **Step 4: The builders** `src/lib/spine/slots/last.ts`:

```ts
/**
 * src/lib/spine/slots/last.ts , STAGE 5, TO LAST: SLOTS 12 AND 13 (plan 2026-10-13 country-page-journey, Task 3G; spec sections 2 and 3; R5
 * section 5): "Will it survive, and what if it does not?"
 *   12 HOW MANY LAST (SHARE of 100): the survival curve, its figure at 30 its own (SurvivalCurve, the region lever), so the slot draws no
 *      second lead; behind the plus what holds firms back, where new firms last by city (doors to the cities) and the trades that fail most
 *      (doors to the trade pages, while the feed is fresh). The UK's alone today (data/sections/survival.json).
 *   13 SELLING OR FAILING (TIME): off the UK, the time to sell at 30, its slow end placed among the countries with its signal, the buyers in
 *      its words, the usual span drawn beside it; on the UK, whose sale times have no source, if it fails: the months to be freed at 30, its
 *      times as rows with their units in their labels (the strike-off's from the rules beside the failure law's), its costs and what it
 *      reaches behind the plus. The director's loan charge is a tax and stands in slot 1 (Task 3B).
 */
import { COPY } from "@/lib/spine/copy";
import { buildSurvival, buildObstacles, type Survival } from "@/lib/spine/sections/first_years";
import { buildFirmsLast } from "@/lib/home/firms_last";
import { buildDuel } from "@/lib/home/duel";
import { buildCountryExit, exitMonthsText, worldExitHighs, type CountryExitData } from "@/lib/spine/country_exit_rows";
import { buildIfItFails } from "@/lib/spine/sections/if_it_fails";
import { lawValue, ruleRaw, ruleRow } from "@/lib/spine/sections/country_rules";
import { signalFor } from "@/lib/spine/signal";
import { datedRow } from "./dated";
import { durationParts } from "./run";
import { list, present, valueClass, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;

export type LastingDrawing = { survival: Survival };
export function buildLastingSlot(iso2In: string, today: string): SlotModel<LastingDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const survival = buildSurvival(iso2);
  if (!survival) return null;
  const C = COPY.firstYears;
  const back: SlotRow[] = (buildObstacles(iso2)?.items ?? []).map((o, i) => ({ key: o.key, label: o.label, value: `${o.pct}%`, note: i === 0 ? C.obstaclesWords.replace("{item}", o.label.toLowerCase()) : null, prov: o.prov }));
  const lasts = iso2 === "GB" ? buildFirmsLast() : null;
  const L = J.lastRows;
  const byCity: SlotRow[] = (lasts?.rows ?? []).map((r, i) => ({ key: r.key, label: r.name, value: `${r.display}%`, note: i === 0 ? L.cohort.replace("{cohort}", String(lasts!.cohort)).replace("{year}", String(lasts!.year)) : null, prov: r.prov, href: r.href }));
  const duel = iso2 === "GB" ? buildDuel(today) : null;
  const failMost: SlotRow[] = duel
    ? [
        ...duel.rows.slice(0, 2).map((r, i): SlotRow => ({ key: r.key, label: r.name, value: `${r.value.toFixed(1)}%`, note: i === 0 ? L.insolvent : null, prov: r.prov, href: r.href })),
        { key: "middle", label: L.middle, value: `${duel.middle.figure}%`, note: L.ofTrades.replace("{n}", String(duel.count)), prov: duel.middle.prov },
        ...duel.rows.slice(2).map((r): SlotRow => ({ key: r.key, label: r.name, value: `${r.value.toFixed(1)}%`, note: null, prov: r.prov, href: r.href })),
      ]
    : [];
  const M = J.more;
  return {
    id: "lasting",
    lead: null,
    rows: null,
    more: present([list("back", M.back, "share", back), list("by-city", M.byCity, "share", byCity), list("fail-most", M.failMost, "share", failMost)]),
    drawing: { survival },
    thin: false,
  };
}

export type ExitDrawing = { exit: CountryExitData | null };
export function buildExitSlot(iso2In: string, today: string): SlotModel<ExitDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const fails = iso2 === "GB" ? buildIfItFails() : null;
  if (fails) {
    const X = J.exit;
    const TIME_LABEL: Record<string, string> = { "liquidation-time": X.liquidation, "director-ban": X.ban };
    const times: SlotRow[] = [];
    const costs: SlotRow[] = [];
    const reach: SlotRow[] = [];
    for (const r of fails.rows) {
      if (r.key === "directors-loan") continue;
      const cls = valueClass(r.value);
      const d = cls === "time" ? durationParts(r.value) : null;
      const row: SlotRow = { key: r.key, label: r.label, value: r.value, note: r.note ?? null, prov: r.prov ?? null };
      if (d && TIME_LABEL[r.key]?.endsWith(d.unit)) times.push({ ...row, label: TIME_LABEL[r.key], value: d.figure });
      else if (cls === "money") costs.push(row);
      else if (cls === "state") reach.push(row);
    }
    /* THE SOLVENT CLOSE BESIDE THE FAILURE (rules.json closing; the paperwork card's "To close" until now): its two waits as times, its fee
       a cost, dated where the ledger dates it. */
    for (const [key, label] of [["strike-off-notice", X.strikeNotice], ["no-trading-period", X.noTrading]] as const) {
      const v = ruleRaw(iso2, "closing", key);
      if (v && typeof v.months === "number") times.push({ key, label, value: String(v.months), note: ruleRow(iso2, "closing", key)?.note ?? null });
    }
    const fee = ruleRow(iso2, "closing", "strike-off-fee");
    if (fee) {
      const d = datedRow(iso2, "strike-off-fee", today, (v) => lawValue(v, true));
      costs.push(d ? { ...fee, value: d.value, note: d.note ?? fee.note ?? null, change: "strike-off-fee" } : fee);
    }
    return {
      id: "exit",
      lead: { figure: `${fails.focal.months} ${COPY.ifItFails.months}`, words: COPY.ifItFails.words, prov: fails.focal.prov },
      rows: times.length ? { key: "times", head: J.slots.exit.heading, type: "time", rows: times } : null,
      more: present([list("costs", J.more.failCosts, "money", costs), list("reach", J.more.failReach, "state", reach)]),
      drawing: { exit: null },
      thin: false,
    };
  }
  /* OFF THE UK: THE TIME TO SELL, its slow end placed among every shard's slow ends (the placement's own set), its signal from the same. */
  const exit = buildCountryExit(iso2);
  if (!exit) return null;
  const lo = exit.marks[0].value;
  const hi = exit.marks[exit.marks.length - 1].value;
  const highs = worldExitHighs();
  const buyers = exit.climateWord ? J.buyers[exit.climateWord] : undefined;
  const lead: SlotLead = {
    figure: `${exitMonthsText(lo).replace(/ months?$/, "")} to ${exitMonthsText(hi)}`,
    words: buyers ? `${J.exitWords}, ${buyers}` : J.exitWords,
    placement: exit.placement,
    placed: "time-to-sell",
    ...(highs ? signalFor("time-to-sell", hi, highs) : { signal: null, noSignal: "set" as const }),
  };
  return { id: "exit", lead, rows: null, more: [], drawing: { exit }, thin: true, gloss: COPY.countryExit.basis };
}
```

- [ ] **Step 5: The components** `src/components/spine/country/slots/StageLast.tsx`:

```tsx
/**
 * STAGE 5, TO LAST (plan 2026-10-13 country-page-journey, Task 3G): slot 12 draws the survival curve (its figure, words and region lever its
 * own, moved from FirstYears.tsx unchanged); slot 13 draws the usual span beside the country's (RangePair, the lean exit card's), or nothing
 * on the UK, whose answer is its rows.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { SurvivalCurve } from "@/components/spine/interact/SurvivalCurve";
import { RangePair } from "@/components/spine/charts/RangePair";
import { COPY } from "@/lib/spine/copy";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { ExitDrawing, LastingDrawing } from "@/lib/spine/slots/last";

export function LastingSlot({ model }: { model: SlotModel<LastingDrawing> }) {
  const data = model.drawing.survival;
  const C = COPY.firstYears;
  const place = data.place ? data.place.charAt(0).toUpperCase() + data.place.slice(1) : C.countryFallback;
  return (
    <Slot model={model}>
      <SurvivalCurve id="lasting" country={data.points} regions={data.regionCurves} best={data.regions?.best ?? null} worst={data.regions?.worst ?? null} start={data.start} words={{ focal: C.focalWords, focalIn: C.focalWordsIn, start: C.start, year: C.year, regions: C.regions, choose: C.choose, country: place, kicker: C.kicker }} />
    </Slot>
  );
}

export function ExitSlot({ model }: { model: SlotModel<ExitDrawing> }) {
  const exit = model.drawing.exit;
  const C = COPY.countryExit;
  const lo = exit?.marks[0].value ?? 0;
  const hi = exit?.marks[exit.marks.length - 1].value ?? 0;
  return (
    <Slot model={model}>
      {exit?.usual ? (
        <div className="flex flex-1 flex-col">
          <RangePair fill spans={[{ key: "here", label: C.here, lo, hi, accent: true, quiet: true }, { key: "usual", label: C.usualAnywhere, lo: exit.usual.lo, hi: exit.usual.hi }]} max={Math.max(24, exit.usual.hi, hi)} fmt={(v) => String(Math.round(v))} unit={C.months} ticks={[0, 6, 12, 18, 24]} aria={C.kicker} />
        </div>
      ) : null}
    </Slot>
  );
}
```

- [ ] **Step 6: Run it.** Test to `t3g-b.txt`: all PASS, exit 0. TYPECHECK to `t3g-tsc.txt`: 0. GATES `--only=slots-last,slots-run,interact,harness-archetypes,placeholder-never-printed` to `t3g-gates.txt`: PASS (the placeholder gate lists `country_exit_rows.ts`'s scan, unchanged).

- [ ] **Step 7: Wire and commit.** After `slots-run`:

```ts
  /* STAGE 5, TO LAST (plan 2026-10-13 country-page-journey, Task 3G): how many last, selling or failing, one type a list, the time to sell
     placed with its signal. No browser. */
  { name: "slots-last", script: "tests/spine/slots_last.test.ts" },
```

Stage the new files; COUNTS to `t3g-counts.txt`. Commit `src/lib/spine/slots/last.ts`, `src/components/spine/country/slots/StageLast.tsx`, `src/lib/spine/country_exit_rows.ts`, `src/lib/spine/copy.ts`, `tests/spine/slots_last.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:last: how many last with its pluses by type, selling or failing (the time to sell placed with its signal, the UK's failure law by type) (plan 2026-10-13 country-page-journey, Task 3G)`.

---

### Task 3H: Stages 6 and 7: slots 14 to 16, how dealings go, the rule changes and where to next, and the dated rows' coverage (asks Q6 first)

**Files:**
- Create: `src/lib/spine/slots/rules.ts`, `src/components/spine/country/slots/StageRules.tsx`
- Modify: `src/components/spine/archetypes/DatedChanges.tsx` (the run declares its type), `src/lib/spine/slots/dated.ts` (`UNDATED`)
- Test: `tests/spine/slots_rules.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `slots-last`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: the earlier stage builders (`buildOpenSlot`, `buildHireSlot`, `buildRunningCostsSlot`, `buildCreditSlot`, `buildFilingsSlot`, `buildExitSlot`) for the coverage; `buildCharacterTables` (`character_rows.ts`), `buildRuleChanges` (`sections/country_rules.ts`), `buildCloseDoors`, `buildCompareDoor` (`close_rows.ts`), `Switch`, `SpectraTable`, `ChangeRun`, `Terminus`.
- Produces: in `rules.ts`: `CHANGES_LEAD` (moved from `country-view.tsx`), `type DealingsDrawing = { state: SpectraData | null; people: SpectraData | null }`, `buildDealingsSlot(iso2) => SlotModel<DealingsDrawing> | null`, `type ChangesDrawing = { coming: ChangeRow[]; recent: ChangeRow[]; shown: number }`, `buildChangesSlot(iso2, today) => SlotModel<ChangesDrawing> | null`, `type CloseDrawing = { doors: Door[] }`, `buildCloseSlot(iso2, name) => SlotModel<CloseDrawing> | null`. In `dated.ts`: `UNDATED: Record<string, string>` (a ledger key no country row prints, and why). `DealingsSlot`, `ChangesSlot`, `CloseSlot` (each `{ model }`) in `StageRules.tsx`. `ChangeRun`'s root carries `data-answer="dated-pair"`, each row's new value `data-value`. Gate `slots-rules`.

- [ ] **Step 1: Write the failing test** `tests/spine/slots_rules.test.ts`:

```ts
/**
 * STAGES 6 AND 7 (plan 2026-10-13 country-page-journey, Task 3H; spec sections 2 and 3; R5 section 5, slots 14 to 16): how dealings go (the
 * state's and the people's spectra under one switch, their two foot figures behind the plus as shares), the rule changes (the coming and the
 * recent runs, each row a dated pair) and where to next (the doors). Then the coverage of "each change also dated on the row it changes":
 * every change the UK's ledger holds as coming, or in force within the recent window, is dated on a row some slot prints, or named in
 * UNDATED with the reason no country row prints it; read on a fixed day and on today.
 * BLIND SPOT, stated: the coverage reads the slot models' rows (`change`), not the render; the render's agreement is the dated row's own test.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_rules.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildDealingsSlot, buildChangesSlot, buildCloseSlot } from "../../src/lib/spine/slots/rules";
import { DealingsSlot, ChangesSlot, CloseSlot } from "../../src/components/spine/country/slots/StageRules";
import { buildOpenSlot } from "../../src/lib/spine/slots/open";
import { buildHireSlot } from "../../src/lib/spine/slots/hire";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot } from "../../src/lib/spine/slots/run";
import { buildExitSlot } from "../../src/lib/spine/slots/last";
import { DATED_RECENT_DAYS, UNDATED } from "../../src/lib/spine/slots/dated";
import changesJson from "../../data/sections/changes.json";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "slots-rules";
const FILE = "src/lib/spine/slots/rules.ts";
const REMEDY = "build slots 14 to 16 from the spectra, the ledger and the doors; date every coming or recent change on the row it changes, or name in UNDATED why no country row prints it";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const clean = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);
const TODAY = "2026-10-13";

for (const [iso2, name] of [["GB", "the United Kingdom"], ["KH", "Cambodia"], ["AF", "Afghanistan"], ["DE", "Germany"]] as const) {
  const deal = buildDealingsSlot(iso2);
  check(`${iso2} slot 14: the spectra drawn, the foot figures behind the plus as shares`, !!deal && (!!deal.drawing.state || !!deal.drawing.people) && deal.more.every((l) => l.key === "who" && l.type === "share") && !deal.drawing.state?.foot && !deal.drawing.people?.foot);
  if (deal) { const doc = read(React.createElement(DealingsSlot, { model: deal })); const f = clean(doc); check(`${iso2} slot 14 reads clean, a switch where both tables stand (${f.join("; ") || "clean"})`, f.length === 0 && (!(deal.drawing.state && deal.drawing.people) || !!doc.querySelector("#dealings [data-switch]")), "src/components/spine/country/slots/StageRules.tsx"); }
  const close = buildCloseSlot(iso2, name);
  check(`${iso2} slot 16: doors`, !!close && close.drawing.doors.length > 0);
  if (close) { const doc = read(React.createElement(CloseSlot, { model: close })); check(`${iso2} slot 16 is the terminus, stamped`, !!doc.querySelector('[data-terminus] #close[data-slot="close"][data-stage="7"][data-answer="doors"] [data-archetype="terminus"]'), "src/components/spine/country/slots/StageRules.tsx"); }
}
const ch = buildChangesSlot("GB", TODAY);
check(`the UK's slot 15: ${ch?.drawing.coming.length} coming, ${ch?.drawing.recent.length} in force, ${ch?.drawing.shown} shown`, !!ch && ch.drawing.coming.length + ch.drawing.recent.length >= 3);
if (ch) { const doc = read(React.createElement(ChangesSlot, { model: ch })); const f = clean(doc); check(`the UK's slot 15 reads clean, every row a dated pair (${f.join("; ") || "clean"})`, f.length === 0 && doc.querySelectorAll('[data-answer="dated-pair"] [data-value]').length > 0, "src/components/spine/country/slots/StageRules.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 15 (no ledger)", !buildChangesSlot("KH", TODAY) && !buildChangesSlot("AF", TODAY) && !buildChangesSlot("DE", TODAY));

/* EACH CHANGE DATED ON THE ROW IT CHANGES: on a fixed day and on today. */
type FileChange = { key: string; date: string };
const ledger = ((changesJson as unknown as Record<string, { changes?: FileChange[] }>).GB?.changes ?? []);
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
for (const day of [TODAY, new Date().toISOString().slice(0, 10)]) {
  const models = [buildOpenSlot("GB", day), buildHireSlot("GB", day), buildRunningCostsSlot("GB", day), buildCreditSlot("GB", day), buildFilingsSlot("GB", day), buildExitSlot("GB", day)];
  const dated = new Set(models.flatMap((m) => [...(m?.rows?.rows ?? []), ...(m?.more.flatMap((l) => l.rows) ?? [])]).map((r) => r.change).filter((k): k is string => typeof k === "string"));
  const owed = [...new Set(ledger.filter((c) => c.date > day || days(c.date, day) <= DATED_RECENT_DAYS).map((c) => c.key))];
  const missing = owed.filter((k) => !dated.has(k) && !UNDATED[k]);
  check(`on ${day}: every coming or recent change is dated on a row or named in UNDATED (${missing.join(", ") || "all"})`, missing.length === 0, "src/lib/spine/slots/dated.ts");
}
check("every UNDATED entry names a ledger key and says why", Object.entries(UNDATED).every(([k, why]) => ledger.some((c) => c.key === k) && why.trim().length > 20), "src/lib/spine/slots/dated.ts");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_rules: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t3h.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/rules`.

- [ ] **Step 3: The run declares its type.** In `src/components/spine/archetypes/DatedChanges.tsx`, `<div data-archetype="dated-changes" data-rows={String(rows.length)} className="[container-type:inline-size]">` becomes `<div data-archetype="dated-changes" data-answer="dated-pair" data-rows={String(rows.length)} className="[container-type:inline-size]">`, and in `Row`, `<Fig className="text-[var(--c-ink)]">{r.from}</Fig>` becomes `<span data-value=""><Fig className="text-[var(--c-ink)]">{r.from}</Fig></span>` (the kit's `Fig` takes `children`, `className` and `prov` only, so the stamp is on a wrapper). The header gains: "The run declares its answer type (plan 2026-10-13 country-page-journey, Task 3H): a dated pair, each row's date read by the answer-type gate."

- [ ] **Step 4: The changes no row prints.** In `src/lib/spine/slots/dated.ts`, after `DATED_RECENT_DAYS`:

```ts
/** A change the ledger holds that no row of a country page prints, and why: its date stands in the changes slot alone (stage 6). A coming or
 *  recent change neither dated on a row nor named here is a red of the slots-rules gate. */
export const UNDATED: Record<string, string> = {
  "unfair-dismissal-cap-2027": "the cap on an unfair dismissal award prints on no row of the country page",
  "unfair-dismissal-cap-2026": "the cap on an unfair dismissal award prints on no row of the country page",
  "digital-tax-records-2027": "a sole trader's digital tax records print on no row of the country page",
  "digital-tax-records-2028": "a sole trader's digital tax records print on no row of the country page",
  "digital-tax-records-2026": "a sole trader's digital tax records print on no row of the country page",
  "tribunal-time-limit": "the time limit for a tribunal claim prints on no row of the country page",
  "week-pay-cap": "the cap on a week's pay for statutory awards prints on no row of the country page",
};
```

Run the test's coverage before writing the map's last entries: a key it names missing that a slot does print (a rule row whose ledger key differs from its rule key) is dated in its builder with `datedRow` and the key set as the row's `change`, never added here.

- [ ] **Step 5: The builders** `src/lib/spine/slots/rules.ts`:

```ts
/**
 * src/lib/spine/slots/rules.ts , STAGES 6 AND 7: SLOTS 14 TO 16 (plan 2026-10-13 country-page-journey, Task 3H; spec sections 2 and 3; R5 section
 * 5): "Which rules bind me, and what is changing?" then "Where do I go from here?"
 *   14 HOW DEALINGS GO (POSITION on poles): the state's and the people's spectra under one switch (his keep since 2026-06-18), reads on two
 *      poles, not ranks among countries, so no signal (Reading 4); their two foot figures (foreign-owned firms, born abroad) behind the plus
 *      as shares. Omits under two reads.
 *   15 RULE CHANGES (DATED PAIR): the ledger's coming run and its recent run, the lead rows shown and the rest in the run's own disclosure
 *      (Q6, answer A); each change is also dated on the row it changes (slots/dated.ts). The UK's alone today.
 *   16 WHERE TO NEXT (doors): the terminus's doors.
 */
import { COPY } from "@/lib/spine/copy";
import { buildCharacterTables, type SpectraData } from "@/lib/spine/character_rows";
import { buildRuleChanges } from "@/lib/spine/sections/country_rules";
import { buildCloseDoors, buildCompareDoor } from "@/lib/spine/close_rows";
import type { ChangeRow } from "@/components/spine/archetypes/DatedChanges";
import type { Door } from "@/components/spine/archetypes/Terminus";
import { list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The changes a person opening a small business meets first (moved from country-view.tsx unchanged). */
export const CHANGES_LEAD = ["minimum-wage-21", "sick-pay-start", "incorporation-fee", "employer-ni"];

export type DealingsDrawing = { state: SpectraData | null; people: SpectraData | null };
export function buildDealingsSlot(iso2: string): SlotModel<DealingsDrawing> | null {
  const t = buildCharacterTables(iso2);
  if (!t.state && !t.people) return null;
  const who: SlotRow[] = present([
    t.state?.foot ? { key: "foreign-owned", label: capFirst(t.state.foot.label), value: t.state.foot.value } : null,
    t.people?.foot ? { key: "born-abroad", label: capFirst(t.people.foot.label), value: t.people.foot.value } : null,
  ]);
  return {
    id: "dealings",
    lead: null,
    rows: null,
    more: present([list("who", J.more.whoTrades, "share", who)]),
    drawing: { state: t.state ? { ...t.state, foot: null } : null, people: t.people ? { ...t.people, foot: null } : null },
    thin: !(t.state && t.people),
  };
}

export type ChangesDrawing = { coming: ChangeRow[]; recent: ChangeRow[]; shown: number };
export function buildChangesSlot(iso2: string, today: string): SlotModel<ChangesDrawing> | null {
  const c = buildRuleChanges(iso2, today, CHANGES_LEAD);
  if (!c || c.coming.length + c.inForce.length < 3) return null;
  return { id: "changes", lead: null, rows: null, more: [], drawing: { coming: c.coming, recent: c.inForce, shown: c.inForceLead }, thin: false };
}

export type CloseDrawing = { doors: Door[] };
export function buildCloseSlot(iso2: string, name: string): SlotModel<CloseDrawing> | null {
  const doors = [...buildCloseDoors(iso2).filter((d) => d.kind !== "pill"), ...buildCompareDoor(name)];
  if (doors.length === 0) return null;
  return { id: "close", lead: null, rows: null, more: [], drawing: { doors }, thin: doors.length < 3 };
}
```

- [ ] **Step 6: The components** `src/components/spine/country/slots/StageRules.tsx`:

```tsx
/**
 * STAGES 6 AND 7 (plan 2026-10-13 country-page-journey, Task 3H): the dealings' two spectra under one switch (the Switch the paperwork card
 * used), the coming and recent change runs under their small heads, the terminus stamped as slot 16 inside its full-width sanction.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { Box } from "@/components/spine/kit";
import { Switch } from "@/components/spine/interact/Switch";
import { SpectraTable } from "@/components/spine/archetypes/SpectraTable";
import { ChangeRun } from "@/components/spine/archetypes/DatedChanges";
import { Terminus } from "@/components/spine/archetypes/Terminus";
import { COPY } from "@/lib/spine/copy";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { ChangesDrawing, CloseDrawing, DealingsDrawing } from "@/lib/spine/slots/rules";

const J = COPY.journey;

export function DealingsSlot({ model }: { model: SlotModel<DealingsDrawing> }) {
  const { state, people } = model.drawing;
  const table = (t: NonNullable<DealingsDrawing["state"]>) => <SpectraTable rows={t.rows} dot={t.dot} foot={null} scale="body" />;
  return (
    <Slot model={model}>
      {state && people ? (
        <Switch id="dealings-views" label={slotDef("dealings").heading} views={[{ key: "state", label: J.views.state, panel: table(state) }, { key: "people", label: J.views.people, panel: table(people) }]} />
      ) : state ? table(state) : people ? table(people) : null}
    </Slot>
  );
}

export function ChangesSlot({ model }: { model: SlotModel<ChangesDrawing> }) {
  const { coming, recent, shown } = model.drawing;
  const head = (words: string) => <p data-line="" className="mt-4 text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink2)] first:mt-0">{words}</p>;
  return (
    <Slot model={model}>
      {coming.length ? <>{head(J.runs.coming)}<ChangeRun rows={coming} /></> : null}
      {recent.length ? <>{head(J.runs.recent)}<ChangeRun rows={recent} shown={shown} more={COPY.changes.more} moreOne={COPY.changes.moreOne} /></> : null}
    </Slot>
  );
}

export function CloseSlot({ model }: { model: SlotModel<CloseDrawing> }) {
  const def = slotDef("close");
  return (
    <div data-terminus>
      <Box id={def.domId} data-slot={def.id} data-stage={String(stageOfSlot("close").n)} data-answer={def.type}>
        <Terminus kicker={def.heading} doors={model.drawing.doors} />
      </Box>
    </div>
  );
}
```

- [ ] **Step 7: Under Q6 answered B only** (no plus past eight rows, the ledger too): `buildChangesSlot` keeps the coming run whole (four on the UK today), the recent run's lead rows, and behind one answer fold of type `dated-pair` ("More changes", `COPY.journey.more.changes`, added) the eight newest of the rest; the older changes stand dated on the rows they changed and leave the slot; `ChangesSlot` draws the recent run with no `more`; the test checks the fold's rows are eight at most. Under A this step is skipped.

- [ ] **Step 8: Run it.** Test to `t3h-b.txt`: all PASS, exit 0. TYPECHECK to `t3h-tsc.txt`: 0. GATES `--only=slots-rules,slots-last,slots-hire,slots-run,slots-open,doors,harness-archetypes` to `t3h-gates.txt`: PASS (the archetype sheet's dated-changes stories carry the new stamps harmlessly).

- [ ] **Step 9: Wire and commit.** After `slots-last`:

```ts
  /* STAGES 6 AND 7 (plan 2026-10-13 country-page-journey, Task 3H): how dealings go, the rule changes, where to next, and every coming or
     recent change dated on its row or named as printed on none. No browser. */
  { name: "slots-rules", script: "tests/spine/slots_rules.test.ts" },
```

Stage the new files; COUNTS to `t3h-counts.txt`. Commit `src/lib/spine/slots/rules.ts`, `src/components/spine/country/slots/StageRules.tsx`, `src/components/spine/archetypes/DatedChanges.tsx`, `src/lib/spine/slots/dated.ts`, `tests/spine/slots_rules.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:rules: how dealings go under one switch, the rule changes as dated pairs, where to next, and each coming or recent change dated on its row (plan 2026-10-13 country-page-journey, Task 3H)`.

---

### Task 4: The composition: every country from the slot plan (asks Q4 first, Q5 during)

**Files:**
- Create: `src/lib/spine/slots/plan.ts`, `src/lib/spine/slots/zones.ts`
- Test: `tests/spine/country_zones.test.ts` (create)
- Modify (replaced whole): `src/components/spine/country/country-view.tsx`
- Modify: `scripts/lib/zone_rhythm.mjs`, `scripts/verify_art_direction.mjs`, `tests/spine/zone_rhythm.test.ts` (a chapter's opening zone starts D3 afresh, Q4 answer A)
- Modify: `scripts/harness/check_model_laws.mjs` (`FLOOR_BY_SURFACE.country`), `tests/home/firms_last.test.ts`, `tests/home/duel.test.ts`, `tests/spine/focal_values.test.ts` (their /gb render checks read the slots)
- Modify: `scripts/prebuild_all.ts` (after `slots-rules`); regenerated `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`, `data/seo/floor_census.json`; baselines a gate lowers to a measured value

**Interfaces:**
- Consumes: every stage builder and component of Tasks 3B to 3H; Task 1A's `STAGES`, `SLOTS`, `slotDef`, `stageOfSlot`; `Zone`, `zoneTone` (`zones.tsx`); `zoneRhythm` (`scripts/lib/zone_rhythm.mjs`).
- Produces: in `plan.ts`: `type PlannedSlot` (a union, one member per drawn slot: `{ id: "tax-on-profit"; model: null }` for the masthead, which draws slots 1 and 2, then `{ id: "customers"; model: SlotModel<CustomersDrawing> }` and so on for each later slot), `planCountry(iso2, name, today) => { slots: PlannedSlot[]; drawn: SlotId[] }` (`drawn` holds `"where-it-stands"` after `"tax-on-profit"`). In `zones.ts`: `type ZoneShape = ZoneSplit | "lone"`, `type ZonePlan = { key: string; split: ZoneShape; slots: SlotId[]; stage: StageId; chapter: { index: string; heading: string } | null; outside: boolean; label: string }`, `WIDE_SLOTS`, `PAIR_SPLIT`, `composeZones(drawn, { resetAtChapter? }) => ZonePlan[]`. `zoneRhythm(splits, starts?)` (a zone whose `starts[i]` is true, a chapter's opening zone, is compared with nothing before it). `SpineCountryBody({ data, locked })` drawn from the plan. Gate `country-zones`.

- [ ] **Step 1: Write the failing test** `tests/spine/country_zones.test.ts`:

```ts
/**
 * THE COMPOSITION (plan 2026-10-13 country-page-journey, Task 4; spec section 6: "The stage order is the phone's one column; a desktop pair
 * joins only two neighbouring slots of one stage"; section 3: "A slot without its data omits itself"). Over every set of the optional slots
 * (slots 3 to 16, 16,384 sets), the zones keep the stage order, hold every drawn slot once, pair only two neighbouring drawn slots of one
 * stage, keep three full widths at most, and give art direction's D3 nothing to find (a chapter's opening zone starting afresh, Q4's answer
 * A); and the four countries' plans draw the slots the replicability gate expects.
 * BLIND SPOT, stated: the plan and the zones as data; the drawn page is the replicability and art-direction gates'.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_zones.test.ts
 */
import { composeZones, PAIR_SPLIT, WIDE_SLOTS } from "../../src/lib/spine/slots/zones";
import { planCountry } from "../../src/lib/spine/slots/plan";
import { SLOTS, slotDef, type SlotId } from "../../src/lib/spine/country_slots";
import { zoneRhythm } from "../../scripts/lib/zone_rhythm.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-zones";
const FILE = "src/lib/spine/slots/zones.ts";
const REMEDY = "pair only two neighbouring drawn slots of one stage (PAIR_SPLIT names each pair's split), keep the stage order and three full widths, and leave D3 nothing to find";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const OPTIONAL = SLOTS.filter((s) => s.n >= 3).map((s) => s.id);
const faults: string[] = [];
for (let mask = 0; mask < 1 << OPTIONAL.length; mask++) {
  const drawn: SlotId[] = ["tax-on-profit", "where-it-stands", ...OPTIONAL.filter((_, i) => mask & (1 << i))];
  const zones = composeZones(drawn);
  const flat = zones.flatMap((z) => z.slots);
  const say = (f: string) => { if (faults.length < 12) faults.push(`${drawn.slice(2).join(",") || "(none)"}: ${f}`); };
  if (JSON.stringify(flat) !== JSON.stringify(drawn)) say(`the zones hold ${flat.join(",")}`);
  for (const z of zones) {
    if (new Set(z.slots.map((id) => slotDef(id).stage)).size !== 1) say(`zone ${z.key} joins two stages`);
    if (z.slots.length === 2 && z.stage !== "orient") {
      const [a, b] = z.slots;
      if (drawn.indexOf(b) !== drawn.indexOf(a) + 1 || PAIR_SPLIT[`${a}|${b}`] !== z.split) say(`zone ${z.key} pairs ${a} and ${b} as ${z.split}`);
    }
    if (z.slots.some((id) => WIDE_SLOTS.has(id)) && (z.split !== "wide" || z.slots.length !== 1)) say(`zone ${z.key} holds a full-width slot beside another`);
  }
  if (zones.filter((z) => z.split === "wide").length > 3) say("more than three full widths");
  const d3 = zoneRhythm(zones.map((z) => z.split), zones.map((z) => !!z.chapter));
  if (d3.length) say(`D3: ${d3.join("; ")}`);
}
check(`every set of the optional slots composes clean (${faults.join(" | ") || `all ${1 << OPTIONAL.length}`})`, faults.length === 0);

const ALL = SLOTS.map((s) => s.id);
const THIN: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "exit", "dealings", "close"];
const DE: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "peers", "exit", "dealings", "close"];
const TODAY = "2026-10-13";
for (const [iso2, name, want] of [["GB", "the United Kingdom", ALL], ["KH", "Cambodia", THIN], ["AF", "Afghanistan", THIN], ["DE", "Germany", DE]] as const) {
  const p = planCountry(iso2, name, TODAY);
  check(`${iso2} plans ${p.drawn.length} slots, the replicability gate's ${want.length}`, JSON.stringify(p.drawn) === JSON.stringify(want), "src/lib/spine/slots/plan.ts");
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_zones: all pass");
```

Under Q1 answered A, `DE` gains `"trades"` after `"spend"`, as `tests/spine/country_slots.test.ts` does (Task 3C, Step 6).

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t4.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/zones`.

- [ ] **Step 3: D3 starts afresh at a chapter (Q4, answer A).** In `scripts/lib/zone_rhythm.mjs`, the header's D3 sentence gains: "A zone that opens a chapter (it holds the chapter's numbered head) starts the comparison afresh: it is compared with no zone before it, and no run of three equal halves crosses it (plan 2026-10-13 country-page-journey, Q4's answer A: two stages each drawing one slot stand as two lone zones, and the chapter head between them is the break)." The function becomes:

```js
/**
 * @param {string[]} splits the split each zone declares, in page order (`main [data-zone]`'s attribute)
 * @param {boolean[]} [starts] true for a zone that opens a chapter (it holds `[data-chapter-head]`)
 * @returns {string[]} NO_ZONE_READ alone when no zone was read, else one finding per repeat, then one per run of three equal halves
 */
export function zoneRhythm(splits, starts = []) {
  /* A reading of nothing is a finding, not a pass: the header's last sentence. One zone read is a read; only none is not. */
  if (!splits.length) return [NO_ZONE_READ];
  const out = [];
  for (let i = 1; i < splits.length; i++) {
    if (starts[i]) continue;
    if (splits[i] !== "wide" && splits[i] === splits[i - 1]) out.push(`zones ${i} and ${i + 1} both split ${splits[i]}`);
  }
  for (let i = 2; i < splits.length; i++) {
    if (starts[i] || starts[i - 1]) continue;
    if (splits[i] === "1-1" && splits[i - 1] === "1-1" && splits[i - 2] === "1-1") out.push(`zones ${i - 1} to ${i + 1} are three equal halves in a row`);
  }
  return out;
}
```

In `scripts/verify_art_direction.mjs`, after `const zoneSplits = zoneEls.map((z) => z.getAttribute("data-zone") || "");` add `const zoneStarts = zoneEls.map((z) => !!z.querySelector(":scope > [data-chapter-head]"));`, return `zoneStarts` from `collect()` beside `zoneSplits` (the object the page evaluation returns), and `const rhythm = zoneRhythm(result.zoneSplits);` becomes `const rhythm = zoneRhythm(result.zoneSplits, result.zoneStarts);`. In `tests/spine/zone_rhythm.test.ts`, the wiring check's `/zoneRhythm\(result\.zoneSplits\)/` becomes `/zoneRhythm\(result\.zoneSplits, result\.zoneStarts\)/` (its label "judges them with zone_rhythm.mjs" gains ", a chapter's opening zone afresh"), and before it add:

```ts
check("a chapter's opening zone starts afresh: two lone zones with a chapter head between them are no repeat", same(zoneRhythm(["wide", "lone", "lone", "wide"], [false, true, true, false]), []));
check("inside one chapter two lone neighbours still repeat", same(zoneRhythm(["wide", "lone", "lone"], [false, true, false]), ["zones 2 and 3 both split lone"]));
check("no run of three equal halves crosses a chapter's head", same(zoneRhythm(["1-1", "1-1", "1-1"], [false, false, true]), ["zones 1 and 2 both split 1-1"]));
```

Under Q4 answered B only (two neighbouring stages that each draw one slot share one zone): `zoneRhythm` and the art-direction gate stay as they are; `composeZones` runs with `resetAtChapter: false` and, before pairing, joins two neighbouring stages that each draw one non-wide slot into one zone (`split` `"1-1"`, the later stage's chapter head drawn above the zone, its index kept for the rail); the exhaustive test asserts no D3 finding on the plans of the four countries and the countries `listCountryProfiles()` names, and states that a set of slots no country draws is not judged; spec section 6's amendment goes into Task 7's verdicts entry. Under C (a lone zone alternates its side): `Zone` takes `side?: "left" | "right"` (a right-hand lone writes `data-zone="lone-right"`, `lg:grid-cols-[1fr_2fr]` with the section in the second track), `composeZones` alternates lone sides, and `zoneRhythm` reads `lone` and `lone-right` as two splits.

- [ ] **Step 4: The zones** `src/lib/spine/slots/zones.ts`:

```ts
/**
 * src/lib/spine/slots/zones.ts , THE SLOTS INTO ZONES (plan 2026-10-13 country-page-journey, Task 4; spec section 6: "The stage order is the
 * phone's one column; a desktop pair joins only two neighbouring slots of one stage").
 *
 * A stage's drawn slots, in order, pair two neighbours where PAIR_SPLIT names the pair (the split the pair takes from 1024px); a slot left
 * over stands alone (a lone zone, the left two thirds); the masthead is one full-width zone holding slots 1 and 2, the peers' table and the
 * close are full width (MODEL PART 10's three full widths). A stage pairs from its start or from its end, whichever leaves the page fewer
 * art-direction D3 findings (scripts/lib/zone_rhythm.mjs, read the same way here), the start winning a tie. Stages 2 to 6 each open a
 * chapter; the masthead and the close stand outside them.
 */
import { SLOTS, STAGES, slotDef, type SlotId, type StageDef, type StageId } from "@/lib/spine/country_slots";
import type { ZoneSplit } from "@/components/spine/zones";

export type ZoneShape = ZoneSplit | "lone";
export type ZonePlan = { key: string; split: ZoneShape; slots: SlotId[]; stage: StageId; chapter: { index: string; heading: string } | null; outside: boolean; label: string };
type Draft = { split: ZoneShape; slots: SlotId[] };

/** The slots that stand full width (the masthead is its own stage's one zone). */
export const WIDE_SLOTS: ReadonlySet<SlotId> = new Set<SlotId>(["peers", "close"]);

/** Every pair two neighbouring slots of one stage can make, and its split: the wider drawing on the wider side. */
export const PAIR_SPLIT: Readonly<Record<string, ZoneSplit>> = {
  "customers|spend": "3-2",
  "customers|trades": "3-2",
  "spend|trades": "1-1",
  "hire|running-costs": "1-1",
  "hire|credit": "1-1",
  "hire|filings": "1-1",
  "running-costs|credit": "1-1",
  "running-costs|filings": "1-1",
  "credit|filings": "3-2",
  "lasting|exit": "3-2",
  "dealings|changes": "2-3",
};

function pairUp(slots: SlotId[], fromEnd: boolean): Draft[] {
  const seq = fromEnd ? [...slots].reverse() : slots;
  const out: Draft[] = [];
  for (let i = 0; i < seq.length; i++) {
    const a = seq[i];
    const b = seq[i + 1];
    if (WIDE_SLOTS.has(a)) { out.push({ split: "wide", slots: [a] }); continue; }
    const [first, second] = fromEnd ? [b, a] : [a, b];
    const split = b && !WIDE_SLOTS.has(b) ? PAIR_SPLIT[`${first}|${second}`] : undefined;
    if (split) { out.push({ split, slots: [first, second] }); i++; }
    else out.push({ split: "lone", slots: [a] });
  }
  return fromEnd ? out.reverse() : out;
}

/** D3 as scripts/lib/zone_rhythm.mjs reads it (the country-zones test holds the two to one answer). */
function d3Count(splits: ZoneShape[], starts: boolean[], reset: boolean): number {
  let n = 0;
  for (let i = 1; i < splits.length; i++) if (!(reset && starts[i]) && splits[i] !== "wide" && splits[i] === splits[i - 1]) n++;
  for (let i = 2; i < splits.length; i++) if (!(reset && (starts[i] || starts[i - 1])) && splits[i] === "1-1" && splits[i - 1] === "1-1" && splits[i - 2] === "1-1") n++;
  return n;
}

export function composeZones(drawn: readonly SlotId[], { resetAtChapter = true }: { resetAtChapter?: boolean } = {}): ZonePlan[] {
  const has = new Set(drawn);
  const stages: Array<{ g: StageDef; slots: SlotId[] }> = STAGES.map((g) => ({ g, slots: SLOTS.filter((s) => s.stage === g.id && has.has(s.id)).map((s) => s.id) })).filter((x) => x.slots.length > 0);
  const choices: Draft[][][] = stages.map(({ g, slots }) => {
    if (g.id === "orient") return [[{ split: "wide", slots }]];
    const a = pairUp(slots, false);
    const b = pairUp(slots, true);
    return JSON.stringify(a) === JSON.stringify(b) ? [a] : [a, b];
  });
  let best: { picked: Draft[][]; score: number } | null = null;
  const walk = (i: number, picked: Draft[][]) => {
    if (i === choices.length) {
      const zs = picked.flatMap((p, si) => p.map((z, zi) => ({ z, start: zi === 0 && stages[si].g.index != null })));
      const score = d3Count(zs.map((x) => x.z.split), zs.map((x) => x.start), resetAtChapter);
      if (!best || score < best.score) best = { picked, score };
      return;
    }
    for (const c of choices[i]) walk(i + 1, [...picked, c]);
  };
  walk(0, []);
  return best!.picked.flatMap((p, si) => p.map((z, zi): ZonePlan => {
    const g = stages[si].g;
    const first = slotDef(z.slots[0]);
    return { key: first.domId, split: z.split, slots: z.slots, stage: g.id, chapter: zi === 0 && g.index && g.heading ? { index: g.index, heading: g.heading } : null, outside: g.index == null, label: first.heading };
  }));
}
```

- [ ] **Step 5: The plan** `src/lib/spine/slots/plan.ts`:

```ts
/**
 * src/lib/spine/slots/plan.ts , A COUNTRY'S SLOTS (plan 2026-10-13 country-page-journey, Task 4; spec section 3: "A slot without its data
 * omits itself"): every stage's builder asked in the model's order, the slots that answer kept. The masthead (slots 1 and 2, his HeroBoard)
 * draws on every country; every other slot draws where its builder returns a model. `drawn` is the list the zones, the rail and the
 * replicability gate read.
 */
import type { SlotId } from "@/lib/spine/country_slots";
import type { SlotModel } from "./types";
import { buildCustomersSlot, buildSpendSlot, buildTradesSlot, type CustomersDrawing, type SpendDrawing, type TradesDrawing } from "./market";
import { buildOpenSlot, type OpenDrawing } from "./open";
import { buildHireSlot, type HireDrawing } from "./hire";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot, buildPeersSlot, type CreditDrawing, type PeersDrawing } from "./run";
import { buildLastingSlot, buildExitSlot, type LastingDrawing, type ExitDrawing } from "./last";
import { buildDealingsSlot, buildChangesSlot, buildCloseSlot, type DealingsDrawing, type ChangesDrawing, type CloseDrawing } from "./rules";

export type PlannedSlot =
  | { id: "tax-on-profit"; model: null }
  | { id: "customers"; model: SlotModel<CustomersDrawing> }
  | { id: "spend"; model: SlotModel<SpendDrawing> }
  | { id: "trades"; model: SlotModel<TradesDrawing> }
  | { id: "open"; model: SlotModel<OpenDrawing> }
  | { id: "hire"; model: SlotModel<HireDrawing> }
  | { id: "running-costs"; model: SlotModel<null> }
  | { id: "credit"; model: SlotModel<CreditDrawing> }
  | { id: "filings"; model: SlotModel<null> }
  | { id: "peers"; model: SlotModel<PeersDrawing> }
  | { id: "lasting"; model: SlotModel<LastingDrawing> }
  | { id: "exit"; model: SlotModel<ExitDrawing> }
  | { id: "dealings"; model: SlotModel<DealingsDrawing> }
  | { id: "changes"; model: SlotModel<ChangesDrawing> }
  | { id: "close"; model: SlotModel<CloseDrawing> };

export function planCountry(iso2In: string, name: string, today: string): { slots: PlannedSlot[]; drawn: SlotId[] } {
  const iso2 = iso2In.toUpperCase();
  const slots: PlannedSlot[] = [{ id: "tax-on-profit", model: null }];
  const customers = buildCustomersSlot(iso2); if (customers) slots.push({ id: "customers", model: customers });
  const spend = buildSpendSlot(iso2); if (spend) slots.push({ id: "spend", model: spend });
  const trades = buildTradesSlot(iso2); if (trades) slots.push({ id: "trades", model: trades });
  const open = buildOpenSlot(iso2, today); if (open) slots.push({ id: "open", model: open });
  const hire = buildHireSlot(iso2, today); if (hire) slots.push({ id: "hire", model: hire });
  const running = buildRunningCostsSlot(iso2, today); if (running) slots.push({ id: "running-costs", model: running });
  const credit = buildCreditSlot(iso2, today); if (credit) slots.push({ id: "credit", model: credit });
  const filings = buildFilingsSlot(iso2, today); if (filings) slots.push({ id: "filings", model: filings });
  const peers = buildPeersSlot(iso2); if (peers) slots.push({ id: "peers", model: peers });
  const lasting = buildLastingSlot(iso2, today); if (lasting) slots.push({ id: "lasting", model: lasting });
  const exit = buildExitSlot(iso2, today); if (exit) slots.push({ id: "exit", model: exit });
  const dealings = buildDealingsSlot(iso2); if (dealings) slots.push({ id: "dealings", model: dealings });
  const changes = buildChangesSlot(iso2, today); if (changes) slots.push({ id: "changes", model: changes });
  const close = buildCloseSlot(iso2, name); if (close) slots.push({ id: "close", model: close });
  const drawn = slots.flatMap((s): SlotId[] => (s.id === "tax-on-profit" ? ["tax-on-profit", "where-it-stands"] : [s.id]));
  return { slots, drawn };
}
```

Under Q1 answered A, `planCountry` takes a fourth argument `margins: MarginCard | null` and passes it to `buildTradesSlot`; the view hands it `marginCardFromRows(Array.isArray(d.money?.list) ? d.money.list : [])`.

- [ ] **Step 6: Run the test.** To `t4-b.txt`: all PASS, exit 0. Then the zone rhythm's own test: `node node_modules/tsx/dist/cli.mjs tests/spine/zone_rhythm.test.ts > scratchpad/journey/t4-rhythm.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-rhythm.txt`: PASS.

- [ ] **Step 7: The view, replaced whole.** First `git ls-files --eol src/components/spine/country/country-view.tsx > scratchpad/journey/t4-eol-before.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-eol-before.txt` (expected `-text`, its line endings recorded). Read the file once more for what other modules import from it: `SpineCountryBody` (the route, the harness, the floor census, `scripts/build_final_pages.tsx`), `LOUD_SEATS` (read off the source by `scripts/lib/loud_seats.ts`) and `SpendCard` (the archetype sheet, `stories.tsx`, until Task 6). Then write the file whole, keeping its line endings, as:

```tsx
/**
 * Country page, SPINE BODY (SpineCountryBody), BY THE VISITOR'S JOURNEY (plan 2026-10-13 country-page-journey, Task 4; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md; his direction of 2026-10-13).
 *
 * The live route (src/app/[country]/country_spine.tsx) mounts this with the real seed; the route wraps it in SpineShell. Every country
 * draws the same sixteen slots in the same seven stages, in the model's order and types (src/lib/spine/country_slots.ts): the slots its
 * data holds (src/lib/spine/slots/plan.ts), each drawn by its stage's component (./slots/), composed into zones that pair only two
 * neighbouring slots of one stage (src/lib/spine/slots/zones.ts). The masthead and the close stand outside the chapters; stages 2 to 6 are
 * chapters 01 to 05. The rail lists the slots drawn, so it links no slot the page does not draw. A slot without its data omits itself:
 * no seat, no "Not known yet". Under the zones, the UK's sources line, the report line and the thin page's notify ask, as before.
 *
 * `locked` (the paywall's form of the page) is not read here: the page draws open, and scripts/harness/check_paywall.mjs reds on it until
 * the locks follow the slots.
 * SampleTag stays imported: scripts/verify_sample_tags.ts reads this file's source for the honesty marker of the country seeds' group.
 * No em-dashes, no raw hex, tokens only.
 */
import * as React from "react";
import { SampleTag } from "@/components/spine/kit";
import { Zone, zoneTone } from "@/components/spine/zones";
import { STAGES, slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import { planCountry, type PlannedSlot } from "@/lib/spine/slots/plan";
import { composeZones } from "@/lib/spine/slots/zones";
import { MastheadSlots } from "./slots/StageOrient";
import { CustomersSlot, SpendSlot, TradesSlot } from "./slots/StageMarket";
import { OpenSlot } from "./slots/StageOpen";
import { HireSlot } from "./slots/StageHire";
import { RunningCostsSlot, CreditSlot, FilingsSlot, PeersSlot } from "./slots/StageRun";
import { LastingSlot, ExitSlot } from "./slots/StageLast";
import { DealingsSlot, ChangesSlot, CloseSlot } from "./slots/StageRules";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { checkedDateForCountry } from "@/lib/spine/checked";
import { DepthNotifyFoot } from "@/components/spine/DepthNotifyFoot";
import { countryPageTarget } from "@/lib/geo/page_targets";

void SampleTag;

/**
 * THE THREE LOUD MOMENTS, declared where they are lit or held (MODEL.md PART 6; read off this source by scripts/lib/loud_seats.ts). Seat one
 * is the masthead's answer at 40 in the accent, lit on every country since slot 1's thin state prints the company rate; seats two and three
 * are held: the hire's wage floor and the middle trade print at 30 in ink.
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 take", figure: "the tax on profit, 40", state: "LIT", condition: "spec 2026-10-13 section 3: the page's only 40, in --terra-text, on every country; where no regime is held the company rate stands under its own label" },
  { seat: 2, card: "07 hire", figure: "none: the wage floor at 30 in ink", state: "HELD EMPTY", condition: "his interview of 2026-09-26, answer 30 (milestone 1, M3): the wage floor and the hire's lever in ink; lit only by a figure that answers the slot" },
  { seat: 3, card: "05 trades", figure: "none: the middle trade at 30 in ink", state: "HELD EMPTY", condition: "his quiet of 2026-09-08 holds: the market's figures print in ink; the budget is spent at one" },
] as const satisfies readonly LoudSeat[];

/* THE WAYFINDING RAIL, BY CHAPTER, IN THE PAGE'S ORDER (2026-09-26): fixed to the viewport's right edge from 2xl, where it takes no room from
   the column. Its sections are the slots the page draws. */
type RailSection = { id: string; label: string; chapter?: string };
function OnThisPage({ sections, chapters }: { sections: RailSection[]; chapters?: Record<string, { index: string; heading: string }> }) {
  if (sections.length === 0) return null;
  const groups: Array<{ chapter?: string; items: RailSection[] }> = [];
  for (const s of sections) {
    const key = chapters && s.chapter && chapters[s.chapter] ? s.chapter : undefined;
    const last = groups[groups.length - 1];
    if (last && last.chapter === key) last.items.push(s);
    else groups.push({ chapter: key, items: [s] });
  }
  const link = (s: RailSection) => (
    <li key={s.id}>
      <a href={`#${s.id}`} className="block max-w-[18ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]">
        {s.label}
      </a>
    </li>
  );
  return (
    /* Never taller than the window: a shorter window scrolls it. */
    <nav aria-label="On this page" className="fixed right-6 top-1/2 hidden max-h-[calc(100vh-2rem)] -translate-y-1/2 overflow-y-auto 2xl:block">
      <div className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">On this page</div>
      {groups.map((g, gi) =>
        g.chapter && chapters ? (
          <div key={`${g.chapter}-${gi}`} className="mt-4">
            <div className="flex max-w-[20ch] gap-2 text-[length:var(--t-micro)] font-semibold leading-snug text-[var(--c-ink)]">
              <span className="tabular-nums text-[var(--c-muted)]">{chapters[g.chapter].index}</span>
              <span>{chapters[g.chapter].heading}</span>
            </div>
            <ol className="mt-2 space-y-2">{g.items.map(link)}</ol>
          </div>
        ) : (
          <ol key={`flat-${gi}`} className={chapters ? "mt-3 space-y-2" : "mt-2 space-y-2"}>{g.items.map(link)}</ol>
        ),
      )}
    </nav>
  );
}

/** Today's date as the page regenerates daily: the dated rows and the changes read it. */
const todayIso = () => new Date().toISOString().slice(0, 10);

/** One planned slot, drawn by its stage's component. */
function SlotView({ slot, iso2 }: { slot: PlannedSlot; iso2: string }) {
  switch (slot.id) {
    case "tax-on-profit": return <MastheadSlots iso2={iso2} />;
    case "customers": return <CustomersSlot model={slot.model} />;
    case "spend": return <SpendSlot model={slot.model} />;
    case "trades": return <TradesSlot model={slot.model} />;
    case "open": return <OpenSlot model={slot.model} />;
    case "hire": return <HireSlot model={slot.model} />;
    case "running-costs": return <RunningCostsSlot model={slot.model} />;
    case "credit": return <CreditSlot model={slot.model} />;
    case "filings": return <FilingsSlot model={slot.model} />;
    case "peers": return <PeersSlot model={slot.model} />;
    case "lasting": return <LastingSlot model={slot.model} />;
    case "exit": return <ExitSlot model={slot.model} />;
    case "dealings": return <DealingsSlot model={slot.model} />;
    case "changes": return <ChangesSlot model={slot.model} />;
    case "close": return <CloseSlot model={slot.model} />;
  }
}

export function SpineCountryBody({ data, locked = false }: { data?: any; locked?: boolean }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  const iso2: string | undefined = typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined;
  if (!name || !iso2) return null;
  void locked;
  const ownPath = countryPageTarget(iso2)?.href ?? null;
  const plan = planCountry(iso2, name, todayIso());
  const zones = composeZones(plan.drawn);
  const byId = new Map(plan.slots.map((s) => [s.id as string, s]));
  const chapters = Object.fromEntries(STAGES.filter((g) => g.index && g.heading).map((g) => [g.index as string, { index: g.index as string, heading: g.heading as string }]));
  const sections: RailSection[] = plan.drawn.filter((id) => id !== "where-it-stands").map((id) => ({ id: slotDef(id).domId, label: slotDef(id).heading, chapter: stageOfSlot(id).index ?? undefined }));
  return (
    <>
      {/* SIXTEEN PIXELS OF GUTTER ON A PHONE (research R2): the site's column holds 16 under 768, so a section's content is 343px wide at 375. */}
      <div data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split === "lone" ? "2-1" : z.split} label={z.label} chapter={z.chapter ?? undefined}>
            {z.slots.filter((id) => id !== "where-it-stands").map((id) => {
              const slot = byId.get(id);
              return slot ? <SlotView key={id} slot={slot} iso2={iso2} /> : null;
            })}
          </Zone>
        ))}
      </div>
      <SourcesFoot iso2={iso2} />
      <ReportFoot path={ownPath} checked={checkedDateForCountry(iso2)} />
      {ownPath ? <DepthNotifyFoot path={ownPath} /> : null}
      <OnThisPage sections={sections} chapters={chapters} />
    </>
  );
}

/* WHAT HOUSEHOLDS SPEND ON, the ranked form the archetype sheet still draws (stories.tsx imports it from here): seven parts of a hundred, the
   leftover pinned last, on a track whose far end is the whole budget. No country page draws it; slot 4 draws the share bar. */
export function SpendCard({ spend }: { spend: CountrySpendData | null }) {
  if (!spend) return null;
  const C = COPY.countrySpend;
  return (
    <RankedBars
      id="spend"
      kicker={C.kicker}
      icon="spending-power"
      tagged={spend.tag !== "held"}
      basis={spend.basis}
      rows={spend.rows.map((r) => ({ key: r.key, name: r.name, value: r.value }))}
      residualKey={SPEND_RESIDUAL}
      worldMax={SPEND_WHOLE}
      ceiling="whole"
      topLabel={C.topLabel}
      feature="none"
      focal={{ figure: spend.out.figure, words: C.outWords }}
      fmt={(v) => `${v}%`}
      phoneHead={{ name: C.phoneHead.name, value: C.phoneHead.value }}
    />
  );
}
```

The file's imports also take `import { RankedBars } from "@/components/spine/archetypes/RankedBars";`, `import { COPY } from "@/lib/spine/copy";` and `import { SPEND_RESIDUAL, SPEND_WHOLE, type CountrySpendData } from "@/lib/spine/country_spend_rows";` for `SpendCard`. A lone zone is drawn by `Zone` from its one child and any split but `"wide"`, so `"2-1"` stands for `"lone"`. Then `git ls-files --eol src/components/spine/country/country-view.tsx > scratchpad/journey/t4-eol-after.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-eol-after.txt`: the same attribute and endings as before. TYPECHECK to `t4-tsc.txt`: 0 (a module no file imports any more, today's section components, is Task 6's).

- [ ] **Step 8: The /gb render checks that read the old page.** In `tests/home/firms_last.test.ts`, the block from `/* THE UK PAGE'S RENDER (pages-fresh renders it first in the chain): the level after chapter 04's first, where new firms last beside which` to the line `} else if (!gbRender) console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the /gb render's checks did not run");` becomes:

```ts
/* THE UK PAGE'S RENDER (plan 2026-10-13 country-page-journey, Task 4): where new firms last stands behind slot 12's plus, "By city", each city
   a row that opens its page, the lead stamped. */
const VIEW_AT = { file: "src/lib/spine/slots/last.ts", remedy: "keep where new firms last behind slot 12's plus as one row a city, stamped, each a door to its page" };
const gbRender = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
if (gbRender && built) {
  const slot = gbRender.slice(gbRender.indexOf('data-slot="lasting"'), gbRender.indexOf('data-slot="exit"'));
  const fold = slot.slice(slot.indexOf(`>${COPY.journey.more.byCity}<`));
  check("/gb draws where new firms last behind slot 12's plus, one row a city, the lead stamped, each a door", slot.length > 0 && fold.length > 0 && new RegExp(`data-src="home/city_survival\\.json:${built.lead.key}"`).test(fold) && built.rows.every((r) => fold.includes(`href="${r.href}"`)), VIEW_AT);
} else if (!gbRender) console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the /gb render's checks did not run");
```

In `tests/home/duel.test.ts`, the three lines from `if (gb && buildDuel()) check("/gb's render carries the duel beside where new firms last` to `else if (gb) check("past its window /gb's render carries no duel` become:

```ts
if (gb && buildDuel()) check("/gb's render carries the duel's rows behind slot 12's plus, its middle stamped from the feed", gb.slice(gb.indexOf('data-slot="lasting"')).includes(`>${COPY.journey.more.failMost}<`) && /data-src="editorial\/editorial_feed\.json:fail-most:the middle/.test(gb));
else if (gb) check("past its window /gb's render carries no duel: no plus of it, no stamp from the feed's item", !gb.includes(`>${COPY.journey.more.failMost}<`) && !/data-src="editorial\/editorial_feed\.json:fail-most/.test(gb));
```

(with `import { COPY } from "../../src/lib/spine/copy";` where the file lacks it). In `tests/spine/focal_values.test.ts`, inside `if (existsSync(GB)) {`, the lines from `const obsPart = at("obstacles", "<section data-zone");` to the check that ends `after Obstacles prints every share" });` become:

```ts
  const lasting = page.slice(page.indexOf('data-slot="lasting"'), page.indexOf('data-slot="exit"'));
  const back = lasting.slice(lasting.indexOf(`>${COPY.journey.more.back}<`));
  const shares = (obs?.items ?? []).filter((o) => back.includes(`>${o.pct}%<`)).length;
  check(`/gb's render prints every obstacle's share behind slot 12's plus, one row each (${shares} of ${obs?.items.length ?? 0})`, !!obs && shares === obs.items.length, { file: "src/lib/spine/slots/last.ts", remedy: "keep every obstacle a row of slot 12's plus, its share printed" });
```

and `const svPart = at("first-years", 'id="obstacles"');` becomes `const svPart = lasting.slice(0, lasting.indexOf("data-fold=\"answer\""));` (the curve before the slot's first plus); the obstacles' builder is the file's `obs` (as its component checks name it; where the file names it otherwise, use that name).

- [ ] **Step 9: The country floor (Q5) and the blocks.** RENDER the list to `t4-render.txt` (exit 0), and one at a time `render_page.tsx country KH` and `country DE`. Count the blocks of the four renders with the floor census's own function: `node -e "import('./scripts/lib/block_count.mjs').then(({countTopBlocks})=>{const fs=require('fs');for(const p of ['GB','KH','AF','DE'])console.log(p, countTopBlocks(fs.readFileSync('scratchpad/harness/pages/country-'+p+'.html','utf8')));})" > scratchpad/journey/t4-blocks.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-blocks.txt` (the memory test first). Expected: GB 15, KH 10, AF 10, DE 11 (the masthead one block holding two slots). In `scripts/harness/check_model_laws.mjs`, `FLOOR_BY_SURFACE`'s `country: 13` becomes Afghanistan's measured count, with the comment above the table gaining: "country: the thin exemplar's measured count since plan 2026-10-13 country-page-journey (Afghanistan draws the eleven slots its data holds, the masthead one block; spec section 7: 'the country floor follows the slots'). Lowered to a measurement, never raised; the floor census decides the index from it (Q5)."

- [ ] **Step 10: Every gate over the new page.** GATES `--only=pages-fresh,country-zones,country-slots,country-model,answer-type,answer-type-reader,signal-marks,signal,answer-fold,slots-orient,slots-market,slots-open,slots-hire,slots-run,slots-last,slots-rules,panels-opened,harness-laws,harness-page-laws,harness-page-filter,harness-copy-plain,harness-readability,art-direction,zone-rhythm,section-bands,fullwidth-sitewide,gathered-emptiness,fact-once,type-floor,tiles-openers,spacing-pin,loud-seats,provenance,doors,interact,hero-rows,home-firms-last,home-duel,focal-values,household-spend,uk-pages-sources,page-foot,home-answers,home-foot,sample-tags,form-variety,dead-anchors` to `t4-gates.txt` (the browser gates one at a time inside the serial chain). Every red is read before anything changes: a fault in a slot is fixed in its stage's builder or component (one fix, one rerun); a ratchet that falls is lowered to its measured value in this commit with `--write-baseline` where the gate records one (`verify_art_direction.mjs` only after its "findings GREW" lines name no page); a gate that reds for a ruled change it was told nothing of (form-variety on the new forms) goes to the controller with the line. `paywall-shape` is not in the list: it is red since Task 1F and Task 5 turns it. No baseline rises.

- [ ] **Step 11: The index the floor decides (Review Focus 5, Q5).** CENSUS to `t4-census.txt` (`docs/loop/CENSUS.md` written). Then the floor census for the country pages: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/seo/floor_census.tsx --only=country > scratchpad/journey/t4-floor.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-floor.txt`, then compare `data/seo/floor_census.json` with `scratchpad/journey/before/floor_census.json` by a scratch script, `scratchpad/journey/floor_diff.mjs` (not committed):

```js
// scratchpad/journey/floor_diff.mjs (plan 2026-10-13 country-page-journey, Task 4; Review Focus 5): every country page that was at its floor
// before and is under it now, read off the two census files and the floors each was judged against. Not committed.
import { readFileSync } from "node:fs";
const before = JSON.parse(readFileSync("scratchpad/journey/before/floor_census.json", "utf8"));
const after = JSON.parse(readFileSync("data/seo/floor_census.json", "utf8"));
const laws = readFileSync("scripts/harness/check_model_laws.mjs", "utf8");
const floor = Number(/const FLOOR_BY_SURFACE = \{[^}]*country:\s*(\d+)/.exec(laws)?.[1]);
const pages = (f) => Object.entries(f.pages ?? f).filter(([, e]) => e && e.surface === "country");
const was = new Map(pages(before).map(([k, e]) => [k, e.blocks]));
const lost = pages(after).filter(([k, e]) => e.blocks < floor && (was.get(k) ?? 0) >= 13).map(([k, e]) => `${k} ${was.get(k)} -> ${e.blocks}`);
console.log(`country floor ${floor}; pages under it now that met 13 before: ${lost.length}`);
for (const l of lost) console.log(`  ${l}`);
```

`node scratchpad/journey/floor_diff.mjs > scratchpad/journey/t4-floor-diff.txt 2>&1; echo "exit $?" >> scratchpad/journey/t4-floor-diff.txt`. Read the file's shape first (`data/seo/floor_census.json`'s top level): where its entries sit under another key than `pages`, the script's `pages()` reads that key. Expected: none lost. A list that is not empty STOPS the plan here: it goes to the controller with the file, and nothing of Task 5 starts before his word (Q5).

- [ ] **Step 12: Wire and commit.** After `slots-rules`:

```ts
  /* THE COMPOSITION (plan 2026-10-13 country-page-journey, Task 4; spec section 6): every set of the slots composes into zones that pair only
     two neighbouring slots of one stage, with D3 clean, and the four countries plan the slots the replicability gate expects. No browser. */
  { name: "country-zones", script: "tests/spine/country_zones.test.ts" },
```

Stage the new files; COUNTS to `t4-counts.txt`. Commit, in two commits: first `scripts/lib/zone_rhythm.mjs`, `scripts/verify_art_direction.mjs`, `tests/spine/zone_rhythm.test.ts`, message `journey:zone-rhythm-chapters: D3 starts afresh at a chapter's opening zone, so two stages that each draw one slot stand as two lone zones (plan 2026-10-13 country-page-journey, Task 4, Q4)`; then `src/lib/spine/slots/plan.ts`, `src/lib/spine/slots/zones.ts`, `tests/spine/country_zones.test.ts`, `src/components/spine/country/country-view.tsx`, `scripts/harness/check_model_laws.mjs`, `tests/home/firms_last.test.ts`, `tests/home/duel.test.ts`, `tests/spine/focal_values.test.ts`, `docs/loop/CENSUS.md`, `data/seo/floor_census.json`, every baseline Step 10 lowered, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:compose: every country drawn from the slot plan in the journey's order, zones paired only inside a stage, the rail from the slots drawn, the country floor the thin exemplar's (plan 2026-10-13 country-page-journey, Task 4)`.

---

### Task 5: The locks follow the slots

**Files:**
- Create: `src/lib/spine/slots/locks.ts`
- Modify: `src/components/spine/country/country-view.tsx` (Edit-tool edits), `src/components/spine/LockedSection.tsx` (`stamp`), `src/lib/spine/copy.ts` (`COPY.locked.lines` for the slots that lock)
- Test: `tests/spine/country_locks.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (after `country-zones`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `lockedLevelKeys` (`src/lib/monetization/levels.ts`, unchanged); Task 4's `planCountry`, `composeZones`; `LockedSection`, `FreeDoors`; Task 1F's `paywall-shape` reading.
- Produces: `SLOT_STAND_IN: Record<SlotId, StandInKind>`, `lockedSlots(drawn) => Set<string>` (stages 1 and 7 outside; each of stages 2 to 6 a chapter tagged on its slots); `LockedSection({ ..., stamp? })`; the locked page: each locked slot its LockedSection carrying the slot's stamps, and where the trades' slot locks, its trade pages as free doors after the close. Gate `country-locks`.

- [ ] **Step 1: Write the failing test** `tests/spine/country_locks.test.ts`:

```ts
/**
 * THE LOCKS FOLLOW THE SLOTS (plan 2026-10-13 country-page-journey, Task 5; spec section 8: "his ruling 18 by analogy: each stage's first slot
 * open, every later slot of the stage locked when the paywall is on; the lock order (lockedLevelKeys) follows the new slots"). The UK locks
 * eight slots, a thin country three; every slot that can lock has its line; the locked UK page draws each locked slot as its LockedSection
 * with the slot's stamps, and the trades' pages as free doors (his ruling of 2026-10-05 on PARKED P20.1); the open page draws no lock.
 * BLIND SPOT, stated: static markup; the paywall's own gate (paywall-shape) renders the locked forms and compares their links.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_locks.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { lockedSlots } from "../../src/lib/spine/slots/locks";
import { planCountry } from "../../src/lib/spine/slots/plan";
import { SpineCountryBody } from "../../src/components/spine/country/country-view";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLOTS, slotDef } from "../../src/lib/spine/country_slots";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-locks";
const FILE = "src/lib/spine/slots/locks.ts";
const REMEDY = "lock every slot after its stage's first (lockedLevelKeys over the slots), draw each as its LockedSection with the slot's stamps and its line, and stand the trades' pages as free doors";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const sorted = (s: Set<string>) => [...s].sort().join(",");

const gb = planCountry("GB", "United Kingdom", TODAY);
check(`the UK locks eight slots (${sorted(lockedSlots(gb.drawn))})`, sorted(lockedSlots(gb.drawn)) === ["changes", "credit", "exit", "filings", "peers", "running-costs", "spend", "trades"].sort().join(","));
const kh = planCountry("KH", "Cambodia", TODAY);
check(`Cambodia locks three (${sorted(lockedSlots(kh.drawn))})`, sorted(lockedSlots(kh.drawn)) === ["credit", "running-costs", "spend"].sort().join(","));
const lockable = SLOTS.filter((s) => lockedSlots(SLOTS.map((x) => x.id)).has(s.id));
const lines = COPY.locked.lines as Record<string, string>;
check(`every slot that can lock has its line, no figure in it (${lockable.map((s) => s.domId).filter((d) => !lines[d]).join(", ") || "all"})`, lockable.every((s) => typeof lines[s.domId] === "string" && !/\d/.test(lines[s.domId])), "src/lib/spine/copy.ts");

const html = (locked: boolean) => renderToStaticMarkup(React.createElement(SpineCountryBody, { data: { meta: { country_name: "United Kingdom", iso2: "GB" } }, locked }));
const open = new JSDOM(`<!doctype html><html><body><main>${html(false)}</main></body></html>`).window.document;
check("the open page draws no lock", open.querySelectorAll("[data-locked]").length === 0, "src/components/spine/country/country-view.tsx");
const shut = new JSDOM(`<!doctype html><html><body><main>${html(true)}</main></body></html>`).window.document;
const got = [...shut.querySelectorAll("[data-locked]")].map((el) => el.getAttribute("data-slot")).sort().join(",");
check(`the locked page draws each locked slot as its LockedSection, stamped (${got})`, got === sorted(lockedSlots(gb.drawn)) && [...shut.querySelectorAll("[data-locked]")].every((el) => el.id === slotDef(el.getAttribute("data-slot") as never).domId), "src/components/spine/country/country-view.tsx");
const sales = buildLondonTradeSales();
const doors = shut.querySelector('[data-free-doors="trades"]');
check("the trades' pages stand as free doors after the close", !!doors && !!sales && sales.rows.every((r) => !!doors.querySelector(`a[href="${r.href}"]`)), "src/components/spine/country/country-view.tsx");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_locks: all pass");
```

- [ ] **Step 2: Run it to see it fail.** To `scratchpad/journey/t5.txt`: exit 1, `Cannot find module` for `src/lib/spine/slots/locks`.

- [ ] **Step 3: The lines.** In `src/lib/spine/copy.ts`, inside `locked.lines`, after `spend: "What households here spend their money on.",` add:

```ts
      /* The country page's slots that lock (plan 2026-10-13 country-page-journey, Task 5): spend, running-costs and peers hold their lines above. */
      trades: "What London’s trades take in a year.",
      credit: "What borrowing costs, and how customers pay you.",
      filings: "What you must file, and when it is due.",
      exit: "What failing costs you, and how long it takes.",
      changes: "What changed in the rules, and what is coming.",
```

- [ ] **Step 4: The locked card takes the slot's stamps.** In `src/components/spine/LockedSection.tsx`, `export function LockedSection({ id, title, icon, kind, lineKey = id }: { id: string; title: string; icon: AtlasIconId; kind: StandInKind; lineKey?: string }) {` becomes `export function LockedSection({ id, title, icon, kind, lineKey = id, stamp }: { id: string; title: string; icon: AtlasIconId; kind: StandInKind; lineKey?: string; /** The country page's slot stamps (plan 2026-10-13 country-page-journey): the paywall's shape reads a locked slot by them. */ stamp?: Record<string, string> }) {` and `<Box id={id} keep data-locked="1"` becomes `<Box id={id} {...(stamp ?? {})} keep data-locked="1"`.

- [ ] **Step 5: The locks** `src/lib/spine/slots/locks.ts`:

```ts
/**
 * src/lib/spine/slots/locks.ts , THE COUNTRY PAGE'S LOCKS BY SLOT (plan 2026-10-13 country-page-journey, Task 5; spec section 8: his ruling 18
 * by analogy). The slots are the levels lockedLevelKeys reads: the masthead (stage 1) and the close (stage 7) stand outside, each of stages
 * 2 to 6 is a chapter tagged on every slot it draws, so each stage's first slot drawn stays open and every later one locks. The paywall stays
 * on UK pages alone (his ruling 27); the view asks only when the page is drawn locked.
 */
import { lockedLevelKeys } from "@/lib/monetization/levels";
import { stageOfSlot, type SlotId } from "@/lib/spine/country_slots";
import type { StandInKind } from "@/components/spine/LockedSection";

/** The stand-in nearest each slot's drawing, for its locked card. */
export const SLOT_STAND_IN: Record<SlotId, StandInKind> = {
  "tax-on-profit": "grid", "where-it-stands": "rows", customers: "grid", spend: "bars", trades: "bars", open: "table", hire: "bars",
  "running-costs": "rows", credit: "track", filings: "rows", peers: "table", lasting: "track", exit: "rows", dealings: "track", changes: "rows", close: "rows",
};

export function lockedSlots(drawn: readonly SlotId[]): Set<string> {
  return lockedLevelKeys(drawn.map((id) => {
    const n = stageOfSlot(id).n;
    const inChapter = n >= 2 && n <= 6;
    return { key: id, chapter: inChapter ? String(n) : null, outside: !inChapter };
  }));
}
```

- [ ] **Step 6: The view draws the locks.** In `src/components/spine/country/country-view.tsx` (Edit-tool edits):
  - Add the imports `import { LockedSection } from "@/components/spine/LockedSection";`, `import { FreeDoors } from "@/components/spine/FreeDoors";` and `import { lockedSlots, SLOT_STAND_IN } from "@/lib/spine/slots/locks";`.
  - In the header, the two lines from ` * \`locked\` (the paywall's form of the page) is not read here:` to ` * the locks follow the slots.` become ` * \`locked\`, the paywall's form of the page (UK pages alone, his ruling 27): every slot after its stage's first draws as its LockedSection, the slot's stamps on it (src/lib/spine/slots/locks.ts), and where the trades' slot locks, its trade pages stand as free doors after the close (his ruling of 2026-10-05 on PARKED P20.1), so locking cuts no path.`
  - `  void locked;` becomes `  const locks = locked ? lockedSlots(plan.drawn) : null;`.
  - Inside the zone's map, `return slot ? <SlotView key={id} slot={slot} iso2={iso2} /> : null;` becomes:

```tsx
              if (!slot) return null;
              const def = slotDef(id);
              return locks?.has(id) ? (
                <LockedSection key={id} id={def.domId} title={def.heading} icon={def.icon ?? "change"} kind={SLOT_STAND_IN[id]} lineKey={def.domId} stamp={{ "data-slot": def.id, "data-stage": String(stageOfSlot(id).n), "data-answer": def.type }} />
              ) : (
                <SlotView key={id} slot={slot} iso2={iso2} />
              );
```

  - After the zones' map, before the closing `</div>` of `data-spine-body`, the trades' free doors:

```tsx
        {/* THE TRADES' PAGES, FREE (his ruling of 2026-10-05 on PARKED P20.1): where the trades' slot locks, every London trade page its bars and
            its plus open stands by name after the close, outside the chapters. */}
        {(() => {
          const trades = plan.slots.find((s) => s.id === "trades");
          if (!locks?.has("trades") || !trades || trades.id !== "trades") return null;
          const doors = [...trades.model.drawing.drawn.map((r) => ({ name: r.name, href: r.href })), ...trades.model.more.flatMap((l) => l.rows).map((r) => ({ name: r.label, href: r.href ?? "" }))];
          return (
            <Zone key="trade-doors" tone={zoneTone(zones.length)} split="wide" label={COPY.londonSales.kicker}>
              <FreeDoors id="trades" title={COPY.londonSales.kicker} doors={doors} />
            </Zone>
          );
        })()}
```

- [ ] **Step 7: Run it, and the paywall's gates.** Test to `t5-b.txt`: all PASS, exit 0. TYPECHECK to `t5-tsc.txt`: 0. GATES `--only=country-locks,paywall-shape,paywall-levels,country-zones,doors` to `t5-gates.txt`: PASS. `paywall-shape` now passes for country-gb (red since Task 1F): its log names the eight locked slots and "0 lost" internal links.

- [ ] **Step 8: Wire and commit.** After `country-zones`:

```ts
  /* THE LOCKS FOLLOW THE SLOTS (plan 2026-10-13 country-page-journey, Task 5; his ruling 18 by analogy): each stage's first slot open, every
     later one its LockedSection, the trades' pages free. No browser. */
  { name: "country-locks", script: "tests/spine/country_locks.test.ts" },
```

Stage the new files; COUNTS to `t5-counts.txt`. Commit `src/lib/spine/slots/locks.ts`, `src/components/spine/country/country-view.tsx`, `src/components/spine/LockedSection.tsx`, `src/lib/spine/copy.ts`, `tests/spine/country_locks.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `journey:locks: the paywall locks every slot after its stage's first, each its locked card with the slot's stamps, the trades' pages free (plan 2026-10-13 country-page-journey, Task 5)`.

---

### Task 6: What the fold replaced leaves, with its tests

**Files:**
- Delete: every component, builder and test Step 1's list names that nothing imports any more
- Modify: `src/components/spine/country/country-view.tsx` (`SpendCard` leaves), `src/components/spine/archetypes/stories.tsx` (its story leaves), `src/lib/spine/copy.ts` (keys nothing reads), the allowlists and baselines that name a section the country page no longer draws, the tests that read the retired components

**Interfaces:**
- Consumes: Task 4's view and every slot.
- Produces: no new name. After it, `git grep` finds no import of a deleted module, no allowlist entry naming a country section that is gone, and no copy key that nothing reads.

- [ ] **Step 1: The list, measured.** For each name, its importers after Task 5, one command to one file:

```bash
cd /e/atlas/website && for n in FromAbroad HireAllIn LeaseByLaw IfItFails FirmsLast Duel FirstYears Obstacles AgeMix JobMarket BlockedSeat SpendCard; do echo "== $n"; git grep -l "\b$n\b" -- src tests scripts; done > scratchpad/journey/t6-importers.txt 2>&1; echo "exit $?" >> scratchpad/journey/t6-importers.txt
cd /e/atlas/website && for n in buildCitiesSeat seatOf countryHeldToRegisters buildCountryEmployment buildCountryInsurance buildCountryBanking buildCountryPaperwork buildCountryClosing buildLocalsNotes buildEntryBillDetail hireEase; do echo "== $n"; git grep -n "\b$n\b" -- src tests scripts; done > scratchpad/journey/t6-builders.txt 2>&1; echo "exit $?" >> scratchpad/journey/t6-builders.txt
```

Read both. The rule: a component file under `src/components/spine/country/` or `src/components/spine/sections/` whose only importers were today's `country-view.tsx` (and a story or a test of itself) is deleted with its story entry and with the checks in tests that render it; one a city, trade, home or industry page imports stays. A builder function no source calls any more is deleted with its own test's checks of it; a builder a slot calls stays (the ones Tasks 3B to 3H name). `countryHeldToRegisters` and the builders the slots read stay. The report lists each name, its importers before, and kept or deleted.

- [ ] **Step 2: `SpendCard` and its story.** In `src/components/spine/archetypes/stories.tsx`, the import `import { SpendCard } from "@/components/spine/country/country-view";` and the story that draws it (the entry whose element is `<SpendCard`, its pick function where only it reads it) leave; in `country-view.tsx`, the block from `/* WHAT HOUSEHOLDS SPEND ON, the ranked form the archetype sheet still draws` to the closing brace of `SpendCard`, and the three imports Task 4 added for it, leave (Edit-tool edits). The archetype sheet's `ranked-bars` instances that remain (the trade pages') keep the form measured; GATES `--only=harness-archetypes` to `t6-arch.txt`: PASS.

- [ ] **Step 3: The retired components' tests.** In `tests/home/firms_last.test.ts` and `tests/home/duel.test.ts`, the checks that render `FirmsLast` or `Duel` (their `renderToStaticMarkup(React.createElement(FirmsLast, ...` and `(Duel, ...` blocks and the checks that read that markup) leave with the components, where Step 1 deletes them; the builders' checks and Task 4's render checks stay. In `tests/spine/focal_values.test.ts`, the checks that render `Obstacles` or `FirstYears` leave where Step 1 deletes them; the `SurvivalCurve` checks stay (slot 12 draws it). A test left with no check is deleted and its gate entry with it (COUNTS after).

- [ ] **Step 4: The words nothing reads.** For each top-level key of `COPY` the deleted view or components read (`blocked`, `chapters`, `fromAbroad`, `hireAllIn`, `leaseByLaw`, `ifItFails`, `employment`, `paperwork`, `closing`, `banking`, `financing`, `insurance`, `rulesRows`, `pay`, `heroBoard.rows.hiring`, `heroBoard.hireEase`, `entryBill.detailSummary`, `entryBill.detailRows`, `countryExit.climateLine`, `countryExit.world`, `customers`, `cities.prev`, `cities.next`): `git grep -n "COPY\.<key>\|C\.<key>\|<key>:" -- src tests scripts` to `scratchpad/journey/t6-copy-<key>.txt`; a key (or a member of one) no file outside `copy.ts` reads is deleted, a key something reads stays. The copy gates run after: GATES `--only=country-model,copy-no-method-words,no-em-dashes,no-source-agencies,harness-copy-plain` to `t6-copy.txt`: PASS.

- [ ] **Step 5: The names of sections the page no longer draws.** `git grep -n "from-abroad\|hire-all-in\|lease-by-law\|if-it-fails\|first-years\|firms-last\|\"duel\"\|#duel\|entry-bill\|character-people\|\"employment\"\|\"paperwork\"\|\"financing\"\|\"banking\"\|\"insurance\"\|\"money\"\|\"setup\"\|\"locals\"\|\"age-mix\"\|\"job-market\"\|\"obstacles\"" -- scripts tests src/lib docs/design-system > scratchpad/journey/t6-ids.txt 2>&1; echo "exit $?" >> scratchpad/journey/t6-ids.txt`. Each hit is read: an allowlist or baseline entry keyed to a country section that is gone (`scripts/harness/fact_once_allow.json`, `scripts/harness/type_floor_allow.json`, `check_model_laws.mjs`'s per-section tables, `scripts/width_discipline_baseline.json`, a gate's expected-ids list) is deleted (the rule since the checkup of 2026-10-08: an entry whose subject is gone is a red to remove in the same commit); a hit about another page (the city page's `locals`, a trade page's `setup`) stays; a hit in prose (a comment naming history) stays. A baseline that falls with it is lowered to its measured value with its gate's own `--write-baseline`.

- [ ] **Step 6: Everything after the sweep.** TYPECHECK to `t6-tsc.txt`: 0 (the full program, the memory test first; a scoped run here would miss an importer). COUNTS to `t6-counts.txt`. GATES `--only=pages-fresh,country-slots,answer-type,signal-marks,country-zones,country-locks,harness-archetypes,harness-laws,harness-page-laws,fact-once,type-floor,provenance,loud-seats,doors,dead-anchors` to `t6-gates.txt`: PASS (no gate reads unused modules: Step 1's lists and the full typecheck are that reading).

- [ ] **Step 7: Commit.** Every deleted file and every edited one Steps 2 to 6 name, `scripts/gates.json`, `CLAUDE.md`; message `journey:retire: the country sections the slots fold away leave with their stories, tests, words and allowlist entries (plan 2026-10-13 country-page-journey, Task 6)`.

---

### Task 7: The written rules

**Files:**
- Modify (E:/atlas, branch p4-seam): `design/loop/build/briefs/MODEL.md`, `rules/FOUNDER-VERDICTS.md`
- Modify (website): `docs/design-system/GUIDELINES.md`

**Interfaces:**
- Consumes: the spec, Tasks 1A to 6 and the controller's record of his answers to Q1 to Q6.
- Produces: the rules in writing: his rulings of 2026-10-13 as a dated verdicts entry, MODEL's superseded paragraphs bracketed with the date and the new rule, GUIDELINES' enforcement table naming the new gates.

- [ ] **Step 1: The verdicts entry.** In `E:/atlas/rules/FOUNDER-VERDICTS.md`, after the last entry (the home's, "## The home, quiet editorial (2026-10-13, in chat)", and his answers under it), append:

```markdown
## The country page, by the visitor's journey (2026-10-13, in chat)

His words, reading /gb on a phone, in substance (the spec, E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, section 1):
the stacking of text lowers readability; the alignment of elements is often bad; missing cues make it hard to tell whether an indicator is
good or bad; "if the same page is done for Cambodia, would you fill it roughly the same? That's the problem, each section has to be filled in
a more programmatic, category based, less declarative language"; "click to explore more in the same section"; "is the visitor ready for this
info at this moment?"; "You cannot slap legislative changes at the top"; "in a declarative section you cannot switch from words to numbers";
"be programmatic, but not shallow, but also relevant and understandable"; the section icons "bigger and superior with no background";
"vertically first".

His decisions:
- **Journey order, depth behind "more".** Sixteen slots in seven stages for every country (orient, the market, to open, to run, to last, the
  rules, next); the UK's extra depth opens inside the slot it deepens (DetailPanel's answer fold, two to eight rows of one type, closed on
  arrival). One answer type a slot; units in the label or the head, never the cell. A slot without its data omits itself.
- **Green to red, only in the signal.** One solid triangle beside a placed figure whose measure has an owner direction; its angle carries
  the state in fifths of the placement; dark green, green, dark yellow, red, dark red, inside the signal's own tokens file alone, the one
  named exception to the terracotta-and-greys palette; never colour alone (the angle, the word, a key line on every page).
- The spec, approved by him on 2026-10-13, is the binding text; research R5 section 5 is its slot table.

What it replaces, his rulings over these: MODEL PART 1's walk; 10.2's chapters (one set of seven stages); 10.7's "every row shows at every
width" (a slot's depth folds); 8.2's "every block is present on every country, drawn or seated" and the floor of 13 (the floor is the thin
exemplar's measured count); clause 63's "more sections" (the content stays, a dozen sections open on a tap); PART 6's "nothing is a judgment"
and the palette's "no green" for the signal alone. Kept: one figure printed once, three full widths, no typed figure, a section with no data
omits itself, the copy rules.

The plan (E:/atlas/docs/superpowers/plans/2026-10-13-country-page-journey.md) asked him six questions; his answers, as the controller
recorded them:
- Q1, slot 5 where a country's only trade figures are net margins:
- Q2, the hire and loan levers behind the plus:
- Q3, admin ease and the living cost (their direction, and the living cost's place):
- Q4, two single-slot stages in a row (art direction D3):
- Q5, the new country floor and the index it decides:
- Q6, the rule changes' rest past eight rows:
```

The controller writes each answer after its colon from the record of the chat, in his words where he gave words; an answer not yet given stays empty and the report says so. `cd /e/atlas && git add rules/FOUNDER-VERDICTS.md && git commit` with the message `rules: his rulings of 2026-10-13 on the country page by the visitor's journey, and the plan's six questions (plan 2026-10-13 country-page-journey, Task 7)`, a blank line and the trailer.

- [ ] **Step 2: MODEL.md.** In `E:/atlas/design/loop/build/briefs/MODEL.md`, each superseded paragraph keeps its text and gains a bracket at its end, the house's form:
  - After the paragraph that opens `**THE WALK, and every country page and every city page obeys it, top to bottom, no exceptions.**`: `[SUPERSEDED FOR THE COUNTRY PAGE 2026-10-13 (his ruling, in chat; FOUNDER-VERDICTS.md "The country page, by the visitor's journey"): the country page follows the visitor's journey, sixteen slots in seven stages, the same for every country (website src/lib/spine/country_slots.ts, held by the country-model and country-slots gates); the city and trade pages keep this walk until their own pass.]`
  - At the end of the PART 6 paragraph that holds `One direction always, so the same words mean the same rank on every page and nothing is a judgment.`: `[AMENDED 2026-10-13 FOR THE SIGNAL ALONE (his ruling, "Green to red, only in the signal"): a placed figure whose measure has an owner direction (website src/lib/spine/owner_direction.ts) carries one triangle whose angle and colour say easier or harder for an owner; the placement sentence keeps its one direction; held by the signal and signal-marks gates.]`
  - At the end of the paragraph that opens `**THE THIN COUNTRY, SEATED`: `[SUPERSEDED 2026-10-13 (his ruling): no seat; a slot without its data omits itself, so a thin country draws the slots its data holds (Afghanistan eleven, in ten blocks).]`
  - At the end of the paragraph that opens `**FLOOR: 13,`: `[2026-10-13: the country floor is the thin exemplar's measured count, N, lowered by measurement (website scripts/harness/check_model_laws.mjs FLOOR_BY_SURFACE); the floor census decides the index from it (his answer to the plan's Q5).]`, N being the AF line of `scratchpad/journey/t4-blocks.txt`.
  - At the end of the 10.2 paragraph that holds `The United Kingdom's four:`: `[SUPERSEDED FOR THE COUNTRY PAGE 2026-10-13: every country's chapters are the journey's stages 2 to 6, numbered 01 to 05: The market, To open, To run, To last, The rules; the masthead and the close stand outside them.]`
  - At the end of the bullet that holds `Every row shows at every width. A fold behind a plus was tried on 2026-10-04 and left the same day`: `[SUPERSEDED FOR THE COUNTRY PAGE 2026-10-13 (his ruling, "depth behind more"): a slot's rows of another type fold behind its plus, DetailPanel's answer fold, two to eight rows of one type, closed on arrival; the browser checks read every page with its panels open (the panels-opened gate).]`
  - At the end of PART 9 clause 33: `[2026-10-13: the country's floor is PART 8's measured one (8.2's FLOOR bracket of that date).]`; at the end of clause 63: `[2026-10-13, the country page: the content stays and a dozen sections open on a tap inside the slot they deepen.]`
  `cd /e/atlas && git add design/loop/build/briefs/MODEL.md && git commit`, message `model: the country page by the visitor's journey, the signal, the fold and the floor, bracketed where they supersede (plan 2026-10-13 country-page-journey, Task 7)`, the blank line and the trailer.

- [ ] **Step 3: GUIDELINES.md.** In `docs/design-system/GUIDELINES.md`:
  - 0.2: the row that opens `| The palette is terracotta plus cool neutrals only` gains, before its gate cell, " One named exception since 2026-10-13, his ruling: the signal's five colours inside `src/components/spine/signal/tokens.ts`, nowhere else." After it add the row `| A placed figure whose measure has an owner direction carries the signal (one triangle, its angle and colour the state in fifths of the placement, its word its accessible name); a measure with none carries no mark; the page carries one key line. | \`signal\`, \`signal-marks\` | 2026-10-13 |`.
  - 0.3: the row that opens `| A page's block count clears its page type's floor` reads its country floor as the measured one (`FLOOR_BY_SURFACE` in `scripts/harness/check_model_laws.mjs`, never typed here: "the country's, the thin exemplar's measured count since 2026-10-13"); the row that opens `| A page's rendered sections match its own blueprint's SPINE table exactly` gains " Retired 2026-08-29 to 2026-09-17; on the country page the slots hold it since 2026-10-13: every country draws its slots in the model's order and types." and its gate cell reads `\`country-slots\``; after it add `| A desktop pair joins two neighbouring slots of one stage; a slot left over stands alone; a chapter's opening zone starts D3 afresh. | \`country-zones\`, \`art-direction\` | 2026-10-13 |`.
  - 0.4: after the row that opens `| One unit per column` add `| One answer type a list (money, share, time, position, state, dated pair); a unit sits in the label or the head, never in the cell. | \`answer-type\` | 2026-10-13 |`.
  - 0.5: the row that opens `| A detail panel (the plus) is closed on arrival` gains " On the country page the plus is the answer fold: its head, its count and the plus at the row's end, two to eight rows of one type, the whole row a 44px target." and its gate cell adds `\`answer-fold\``; after it add `| Every browser check that reads a section's content reads it with the panels open. | \`panels-opened\` | 2026-10-13 |`.
  Commit (website) `docs/design-system/GUIDELINES.md`, message `journey:guidelines: the signal, the answer type, the fold, the zones and the opened reading in the enforcement table (plan 2026-10-13 country-page-journey, Task 7)`.

---

### Task 8: Verification (spec section 8)

**Files:**
- Create (scratch, never committed): `scratchpad/journey/after/*`, `scratchpad/journey/shots/after-*`, the report

**Interfaces:**
- Consumes: Task 0's before (`scratchpad/journey/before/*`, `measure_country.mjs`), every gate.
- Produces: the report to the controller: the after against the before, page by page and rule by rule, with the photographs read.

- [ ] **Step 1: The after renders.** The memory test, then RENDER the list to `scratchpad/journey/after/render-list.txt` (exit 0) and `render_page.tsx country KH` and `country DE` one at a time; copy `country-GB.html`, `country-KH.html`, `country-AF.html`, `country-DE.html` into `scratchpad/journey/after/`.

- [ ] **Step 2: The measures, after against before.** `node scratchpad/journey/measure_country.mjs scratchpad/journey/after/country-GB.html scratchpad/journey/after/country-KH.html scratchpad/journey/after/country-AF.html scratchpad/journey/after/country-DE.html > scratchpad/journey/after/measure.txt 2>&1; echo "exit $?" >> scratchpad/journey/after/measure.txt`. Expected beside `before/measure.txt`: GB about 15 blocks, its first read the slots and their closed pluses; KH, AF and DE 10, 10 and 11 blocks; slots in the model's order on all four; lists mixing classes 0; values holding a unit 0; level marks only on no country row; signals at least one a page (clean dealing, the lending rate); seats 0; "Not known yet" 0. Every difference from these is a line of the report with its cause.

- [ ] **Step 3: The browser checks, no more reds than before.** One at a time, each to `scratchpad/journey/after/<check>.txt` with its exit line, over `scratchpad/journey/after/country-{GB,KH,AF,DE}.html` (as in Task 0, Step 6): the page laws, the holes, the model laws, plain copy, readability; then the paywall check and the archetype harness. For each check and page, the reds after are compared with Task 0's before by rule: a rule with more reds after than before is a fault of this plan, fixed at its source (one fix, one rerun) before the report; the report lists each rule's before and after.

- [ ] **Step 4: The photographs, 375 first.** One at a time, for each of the four after files: `node scripts/harness/shoot_page.mjs scratchpad/journey/after/<name>.html "#take" scratchpad/journey/shots/after-<name>-top 375,768,1280`, the same with `"#chapter-01"` (`-ch01`), `"#chapter-03"` (`-ch03`), `"#chapter-05"` (`-ch05`) and `"Where to next"` (`-foot`), each run's output to `scratchpad/journey/after/shoot-<name>-<part>.txt`. Read every picture, the 375 ones first, against the before pictures of the same part: the one column in stage order on a phone, the signal beside its figure with the key line under the board, each plus one line with its count and its plus at the end, no ragged figure column, no unit in a cell. What the eye finds that no gate read is a line of the report.

- [ ] **Step 5: The chain and the build.** `cd /e/atlas/website && npm run verify:deploy -- --build > scratchpad/journey/after/deploy.txt 2>&1; echo "exit $?" >> scratchpad/journey/after/deploy.txt` (the chain serial, then the Next build and the postbuild guard, as Vercel runs them; the memory test first, and no browser beside it). Read the file, not its exit line alone: every gate PASS, the build compiled. A red stops the plan with the file.

- [ ] **Step 6: The report.** To the controller, from the files: the tasks' commits; the before and after measures; each browser check's reds before and after by rule; the photographs' findings; the floor census's list (Task 4, Step 11); the decisions and the answers each task built for (Q1 to Q6); anything a step brought to the controller and its outcome. Nothing is pushed: the push and the deploy are his word.

- [ ] **Step 7: After his deploy word only: the production probe.** When he has given it and the controller has pushed: `cd /e/atlas/website && npm run deploy:watch -- --marker='data-slot="where-it-stands"' > scratchpad/journey/after/deploy-watch.txt 2>&1; echo "exit $?" >> scratchpad/journey/after/deploy-watch.txt` (the deploy watcher reads production for a string the new page carries), then the production probe of /gb, /kh, /af and /de that `docs/verification-protocol.md` names (its string probe, the screenshot step being blocked headless), each to `scratchpad/journey/after/probe-<iso2>.txt`: each page answers 200 and holds its slots in the model's order (`data-slot` in sequence), no "Not known yet", one `[data-signal-key]`. The report gains these files' lines.

---
