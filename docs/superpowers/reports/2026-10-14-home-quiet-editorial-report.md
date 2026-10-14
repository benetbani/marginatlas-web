# Report: homepage, quiet editorial (plan 2026-10-13), branch `home-quiet-editorial`

Plan: `docs/superpowers/plans/2026-10-13-home-quiet-editorial.md`. Spec: `docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md`.
Base: `origin/parallel-base` 55a03e07, fast-forwarded to 7c92b4af at the controller's word (the CI Supabase URL fix). Rulings applied:
Q1 = B (`--terra-full: #c11c00`), Q2 = A (`department` in `FOCAL_EXEMPT_FORMS`), Q3 = B (no "Checked {date}" on the home). Positioning
line: "The reference atlas of small-business earnings."

This file is appended task by task, so a stop loses nothing. Scratch outputs named below live in `scratchpad/home-qe/` (not committed).

## Environment, stated first

- This ran in a worktree on the owner's 8 GB laptop beside three other agents, not on a cloud machine (the dispatch first said cloud; the
  controller corrected it). Free memory sat between 450 and 1,300 MB. Every render, browser check and gate batch waited for memory
  (`scratchpad/home-qe/when_free.mjs`, then the controller's `_run_when_free.sh`, both 800 MB from Task 7A); one browser at a time; no
  application was closed. Several batches still failed on memory (a 360 s TIMEOUT, `ERR_FAILED`, an `UNKNOWN read` error, a render
  out of heap) and were rerun alone; those reruns are the results given.
- `node_modules` is a junction to the main checkout's (`E:/atlas/website/node_modules`); nothing was installed or downloaded but the
  CI run artifacts of this branch (`gh run download`, the chain's own text output).
- No `.env.local` in the worktree. Renders and tests ran with the controller's placeholders (`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-placeholder`), so database-fed parts (related links on cell pages) differ from the laptop's renders.
- Full typecheck: memory never reached the plan's 1,150 MB test, so every local typecheck is the scoped config
  (`scratchpad/home-qe/tsconfig.scoped.json`, the home's files, its tests and their imports). The full `tsc` is GitHub's.
- The parent repo exists on this laptop, but per the dispatch no parent-repo file was edited; Task 8's texts are below for the controller.

## Task 0, the ground and the before

- Step 2 (state check): rail (2A) and Focal/Basis (2B) present; `SourcesFoot`'s `data-type-allow` absent and `ReportFoot` still on
  `--t-micro` (rhythm Task 3 NOT on this base); `FactRows` still draws `<Ico` (rhythm Task 5 NOT on this base); five of six rhythm gates
  wired, `tiles-openers` absent; `scanSpine` read by `tests/spine/spacing_pin.test.ts` only. The plan says any other answer stops it;
  the dispatch builds on this base anyway ("do not make those changes yourself"), so I went on. Files: `t0-*.txt`.
- Before render: zones `wide/tint "Search" | 1-1/paper "Worked example" | 1-1-1/tint "Proofs" | wide/terra "Read from the record" |
  1-1/paper "The UK's cities"`; h1 1, h2 8; 32 figures (0 unstamped); 69 digits outside a figure; 25 distinct internal links; 370 of 1,596
  characters under 14px. (`before/measure.txt`, `before/home-gb.html`.)
- Before browser checks and photographs: not taken at Task 0 (memory under the floor); deferred to Task 9 against the saved
  `before/home-gb.html`.
- Base CI (55a03e07) failed on every render-reading gate: no Supabase URL, so `pages-fresh` rendered nothing. 7c92b4af fixed that.

## Task 1A, home_shape rewritten (7de97032)

- `tests/trust/home_shape.test.ts` replaced as written, with Q3 B's deltas applied from the start (the colophon checks read `<HomeColophon />`
  and no `[data-checked]`); the chain comment changed. Header paths are repo-relative (the plan now travels with the repo).
- Red on today's render as the plan expected: 20 findings, 12 passes (`t1a.txt`).

## Task 1B, contents and band tested first (24b3d3a8)

- Deviation: the modules these tests load before they exist (`contents`, `list_counts`, `Department`, `HomeBand`) are imported through a
  specifier held in a `string` constant, so `tsc` (which checks `tests/`) stays green from this commit; the plan's literal `import()`
  would have red the typecheck until Task 5.
- contents: red only on "the builder is there", small copies and closure PASS. band: red on 11, About the figures' `#reading` PASS.
  Gates `home-contents`, `home-band` wired; counts written.

## Task 1C, the no-counts law (8b57ee4c)

- Test red without the lib, then `src/lib/home/list_counts.ts` as written. Fixtures 8 of 8 and 7 of 7. On today's render: COUNT none,
  DIGIT none, FIGURE red with 32 figures (the old sections'). Gate `home-no-counts` wired.

## Task 1D, the no-eyebrow exception (78c6e07b)

- Header, import, guard and success line as written. Red with the three expected faults; no heuristic eyebrow found.

## Task 2, the positioning line (f57abac3)

- Copy, `--terra-full: #c11c00` (Q1 B, comment "White on it reads 6.12 to 1", computed 6.115), the `<p data-positioning>` with the
  LogoMark. no-eyebrow PASS; home_shape's render positioning check PASS; gates pages-fresh, harness-page-laws, harness-copy-plain,
  harness-readability, no-terra-hover, css-minifies, palette-membership all PASS (`t2-gates.txt`).
- Photographs read (`shots/t2-top-*`): one line at 1280 beside the deep-red mark; two lines at 375, the hyphen in "small-business"
  breaking the line ("small-" / "business earnings."). Not changed: the words are his.

## Task 3, the picker follows the h1 (4ba9ccf4)

- `HomeAsk.tsx`, `picker_cases.ts`, HeroWords' `onIndex` and form stop, NavigatorForm's `cases`/`caseIndex`/`reach`, `pickerSeed`, the Try
  line and `HOME_TRY` gone, trade-set Part 3 removed, chain comments, the three tests edited as written.
- Deviation: the code landed before the test edits in this session, so no red run of the three edited tests was captured.
- All twelve h1 cases are followed (none kept on screen): restaurant London, bakery Paris, pharmacy Istanbul (health and beauty stores),
  barber Tokyo, hotel Sydney, boutique Berlin (clothing stores), butcher Milan (specialty grocery), gym Mumbai, restaurant Dubai, bakery
  Lagos, pharmacy Chicago, barber Shanghai (`t3-probe.txt`).
- Tests: hero_words 35 PASS (the HomeAsk follow, the native and the scripted submit), picker all pass, destination all pass.
- Gates: pages-fresh, home-destination, home-picker, hero-words, hero-still, trade-set, head, search-cascade, harness-copy-plain,
  no-eyebrow, edge-not-found, counts-fresh PASS; harness-page-laws and harness-readability failed on memory and were rerun on the home
  in later tasks (PASS); home-shape red only on the later tasks' checks. Scoped tsc 0.
- CI on 4ba9ccf4 (run 38492860642): typecheck exit 0; chain 276 pass, 16 fail: home-shape, home-contents, home-band, home-no-counts (red by
  design until later tasks); census-fresh and uk-city-sources (known base reds); harness-page-laws (country-GB, country-AF), fact-once
  (industry page), type-floor (spine pages), art-direction (country, cell, industry rhythm), harness-links (cell pages' database links),
  provenance (cell pages), harness-laws (FIGURE FACE on every page, a Linux font artifact; home-gb's only finding), home-answers (the
  London page drawn with no database), harness-archetypes and money-shown-own-rows (timeouts). None names a home file but the four
  by-design reds.

## Task 4A, the contents builder (0076e3ba)

- Copy `COPY.home.contents`, `src/lib/home/contents.ts` as written, trade-set's new Part 3.
- Deviation: `EVERYDAY_TRADES` moved to `src/lib/spine/everyday_trades.ts` (adapt_city imports and re-exports it, one import and a
  three-line comment in place of the const). Read through adapt_city, the builder pulled in `src/lib/cells.ts` and the database client
  at import (traced: supabase.ts <- cells.ts <- scores/city_board.ts <- spine/adapt_city.ts), so trade-set, home-contents and home-band
  would have needed a Supabase URL in the chain. Now the builder, the contents test and trade-set load with no URL (proven with the
  variables unset).
- Members on this day's data: countries GB, US, CA, MX; cities London, Manchester, Birmingham, Leeds; trades restaurants 7%, grocery
  stores 3%, pharmacies 6%, hairdressers and beauty 11%; tools Decide, Check, Calculator, Compare; reading the three tracks and the post
  "Hairdressing and beauty businesses in each London borough"; method sources, corrections, coverage.
- contents test: 49 PASS, only the anatomy and render red (Task 4B). Gates trade-set, dead-anchors, dead-links, no-source-agencies,
  copy-no-method-words, no-em-dashes, counts-fresh, layering PASS; home-no-counts red on the old sections' figures as planned.

## Task 4B, the Department form and the contents zone (2d005c4b)

- `Department.tsx`, `.ma-mono` CSS, `HomeContents.tsx`, the contents zone, `CONTENTS_BY_HIS_SPEC` (Q2 A), `Department` in the archetype list,
  `docs/loop/CENSUS.md` written (it also refreshed rows the base had stale, the known census-fresh red; census-fresh PASS after).
- contents test all pass (67). On the render: page laws 0 reds at three widths; page holes 0; model laws 0 findings, BLOCK FLOOR 12
  against 5; copy plain 0; readability 0.
- Gates: pages-fresh, home-contents, archetype-coverage, census-fresh, harness-page-laws, harness-page-filter, harness-copy-plain,
  harness-readability, loud-seats, radius-uniform, type-floor-reader, spacing-pin, distance-ladder, width-discipline PASS;
  provenance red on cell-gb-london-restaurants and barbershops only (home-gb 36 of 36 stamped); art-direction red on country,
  cell and industry rhythm only (home-gb 0); harness-laws TIMEOUT on memory (model laws on the home alone: 0). Scoped tsc 0.
- Photographs read (`shots/t4b-all-*`, an element shooter, since shoot_page frames one card): two rows of three at 1280 with a hairline
  between, two columns at 768, one column at 375; muted index beside each title; flags; grey city photographs; icons and pictograms in
  ink, no terracotta; trade figures right-aligned; doors last. Noted, not changed: pharmacies draws the scissors pictogram (the
  crosswalk's mapping for health and beauty stores), the same mark as hairdressers.

## Task 5, the band (f27d5f84)

- Copy `band`, `HomeBand.tsx`, `--band-ink`, the terracotta zone on `--terra-full`, print rule, page laws reading the token, LOUD_SEATS
  seat 2, HomeRecord, site_counts and its test removed with the chain entry; loud_seats, accent_walk, verify_loud_seats, uk_sources
  comments and remedies; the publishers' class moved into uk_sources.test.ts. Also made true: two comments in `scripts/verify_launch_ready.ts`
  and one in `src/lib/home/how_made.ts` that named the retired band (not in the plan's list).
- Deviation: band.test's render check reads `#colophon`, so it stayed red on that one check until Task 6 (the plan expected exit 0 here).
- Gates: pages-fresh, harness-page-filter, harness-page-laws (ZONE TONES accepts the band), harness-readability, loud-seats, token-contrast,
  no-cream, css-minifies, counts-fresh, home-bands, uk-sources, palette-membership PASS; art-direction red on other pages only. Scoped tsc 0.
- Photographs read (`shots/t5-band-*`): the deep terracotta edge to edge, the sentence white at the section rung within half the page,
  the link white and underlined, no figure.

## Task 6, the colophon (1d866f63), Q3 ruled B

- `COPY.home.colophon`, `HomeColophon.tsx` with no date prop and no checked line, the view's two foot lines replaced, page_foot.test home-gb
  `dated: false` and home-view kind `"none"`, its header made true. Step 3 (the shared date formatter in ReportFoot) skipped under B,
  which also keeps ReportFoot, a piece the rhythm branch changes, untouched.
- band test all pass; home_shape's two colophon checks PASS. Gates pages-fresh, harness-page-laws, harness-readability, page-foot,
  dead-anchors, uk-sources, home-band PASS; harness-links red on the two cell pages (database links), home-gb 43 links against 11.
- Photographs read (`shots/t6-colophon-*`): tint band, licence line, hairline, four links on one line at 1280, two lines at 375.

## Task 7A, the old sections leave (3d9417c5)

- home-view.tsx replaced whole (Q3 B form: no `ask`, no `checkedDateForTrade`, `<HomeColophon />`). Removed: HomeExample, HomeProofs,
  CityRows, worked_example.ts, proofs.ts, home_answers.ts, tests home_answers and foot, chain entries home-answers and home-foot.
  COPY.home's lines, citiesLabel, citiesAll, citiesUnit, citiesHead, example and proofs pruned (no remaining reader in src or scripts).
  WhereNext's `pitch` gone. Comments made true in CityCards, CityParts, door_look, verify_archetype_coverage (CityRows out of the list),
  and, beyond the plan's list, src/app/not-found.tsx and src/lib/home/archive.ts. archive, how_made, masthead (arrow read from Department,
  "From the blog" moved in) and home_forms rewritten as the plan gives them. CENSUS written (home: six dept rows; Pro not drawn).
- Left as is, named for a later pass: comments that still name the retired files in shared pieces the rhythm branch is changing
  (src/components/spine/kit.tsx:1212, src/components/spine/basis.tsx:10, src/components/spine/archetypes/FactRows.tsx:40), the
  masthead test's 404 comment "THE PROOF DOORS' ARROW", and a stale `HomeProofs.tsx` entry in scripts/width_discipline_baseline.json
  (the gate passes; caps shrank 205 to 201).
- After render (`t7a-measure.txt`): zones `wide/tint "Search" | wide/paper "The atlas" | wide/terra "How figures are made"`; h1 1, h2 6,
  h3 0; 4 figures, all stamped (the trade rows); 2 digits outside a figure ("v3.0" in the licence line); terracotta classes 3 (the
  positioning mark and the h1's two words); 31 distinct internal links; 0 characters under 14px.
- Tests: home_shape 32 PASS (exit 0), contents 67, band 15, no_counts 12, how_made 24, masthead 133, home_forms 42, all exit 0.
  archive: 25 PASS and one red, "on this machine its source archive is the file it was exported from": the laptop's archive log hash no
  longer matches the export's (data drift on the laptop since the export; my edits removed only the card checks; CI defers it).
- Gates (non-browser, run locally): page-foot, archetype-coverage, census-fresh, dead-anchors, dead-links, counts-fresh, width-discipline,
  home-bands, home-duel, home-kitchens, home-firms-last, home-new-companies, home-us-restaurants, home-how-made, home-forms, uk-sources,
  masthead, home-shape, home-contents, home-band, home-no-counts, layering, no-eyebrow, trade-set PASS; home-archive red as above.
  Browser gates for this task are read from the GitHub run (the controller's rule: heavy checks on GitHub). Scoped tsc 0 (both configs).

## Task 7B, the home's source joins the scans (see the commit "home:scans-read-home")

- spine_scan.mjs: the `home/` exclusion deleted with a dated comment in its place; WhereNext's reason now names /new-businesses alone.
  verify_no_eyebrow, verify_subsection_icons, verify_no_bold_display, verify_banned_patterns read `...tsxIn("src/components/spine/home")`;
  verify_bar_budget's home entry reads the folder. counts written.
- Gates: spacing-pin (100 .tsx read, 11 named out, no finding in home/), type-floor-reader, no-eyebrow (one data-positioning, in
  home-view), subsection-icons, no-bold-display, banned-patterns, bar-budget (home 0 of 2), distance-ladder, counts-fresh: all PASS.
  No home file needed a fix. `tiles-openers` is not on this base (rhythm Task 5), and `type_floor.test.ts` walks its own list, not
  scanSpine (Task 0), so this step changed nothing for either.

## Task 8, the written rules (b38e69c2 for the website part)

- website `docs/design-system/GUIDELINES.md`: the four rows added in 0.2, 0.3 and 0.7 as the plan gives them (0.2's row names
  `--terra-full` #c11c00, Q1 B). Gates no-em-dashes, no-source-agencies, counts-fresh PASS. No gate reads GUIDELINES.md.
- Commit message prefix: the plan's `docs:home-gates:` was kept for this commit, where the dispatch asked `home:`; noted, not amended.
- PARENT-REPO EDITS SKIPPED (the dispatch: no parent-repo file is edited here). The exact texts for the controller, from the plan with
  Q1 B, Q2 A and Q3 B applied:

  1. `E:/atlas/design/loop/build/briefs/MODEL.md`, PART 4, the paragraph beginning `**WHO HOLDS NO 30, read off this table and PART 8,
     settled 2026-09-17` (plan :163), appended at its end, after `the finding stays until the data lands.`, on the same line:

     > A HOME CONTENTS DEPARTMENT (the `department` form, 2026-10-13, his choice of quiet editorial: the atlas laid out as a contents page, no charts) is a door to a part of the site: its rows are names, and its one kind of figure is a trade row's own at 16, so it holds no 30 by its own law, as the prose form and the seat form do, and is exempt (`FOCAL_EXEMPT_FORMS` in check_model_laws.mjs, website plan 2026-10-13 home-quiet-editorial, Task 4B).

  2. MODEL.md PART 6, after the bullet `- The trade, industry and neighbourhood lists are in 8.6, 8.7 and 8.8, each with its seat ledger.
     The spine is the authority and this list describes it (2026-09-17, plan step 3).`, a new bullet:

     > - Home (2026-10-13, his choice of quiet editorial): the band is the one loud moment, lit by its ground (FIELD): the brand terracotta at full strength, white type, one sentence and a link to the method, no figure; the question's two moving words are his h1's red (`data-founder-accent`), never an accent; the contents and the colophon hold none. On the home terracotta stands in four places only: the wordmark, the question's moving words, the positioning line's mark and the band.

  3. MODEL.md PART 6, the paragraph `**TERRACOTTA NEVER APPEARS** on a heading, ...`, appended:

     > One mark is his: the home's positioning line carries the compass mark in the brand terracotta beside its words (2026-10-13), one of the home's four terracotta places.

  4. MODEL.md PART 8, `2. **Form.** No two adjacent sections share a form. The three bar cards sit in three different bands.`, appended:

     > The home's contents (2026-10-13) are six departments inside one section, so the rule reads that section's neighbours (the question above, the band below), never the departments beside each other.

  5. MODEL.md PART 9, clause 11, replaced by:

     > 11. The place named twice on one page, a bold h1, a world median in the masthead, and an eyebrow above any title, but one: the home's positioning line above its h1, his named exception of 2026-10-13, a serious sentence-case line beside the compass mark, never a kicker (website scripts/verify_no_eyebrow.ts holds its form). (2026-08-30, 2026-07-10, 2026-07-11, 2026-10-13.)

  6. MODEL.md PART 10, clause 69, replaced by:

     > 69. A third surface, a stripe per section, or two neighbouring zones in one tone; the one third surface is the home's band, his rulings of 2026-10-10 (one section in terracotta) and 2026-10-13 (one solid statement in the brand terracotta at full strength), gated once and on the home only by the page laws' ZONE TONES.

  7. `E:/atlas/rules/FORM-CATALOG.md`, appended:

     > ## VERSION 10, 2026-10-13: the home's contents department
     >
     > **Department** (`src/components/spine/archetypes/Department.tsx`, stamps `data-archetype="department"`): one part of the atlas as a contents entry, his choice of quiet editorial for the home (website plan 2026-10-13 home-quiet-editorial; spec E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3). Its number (01 to 06, muted, in the figures' face), its title at the head rung, one plain line, three or four member rows and its door. A member row is one shape everywhere: its mark (a flag, a city's grey photograph, a trade pictogram or a site icon, in ink), its name, a figure only where the model asks for one (a trade row carries its own world net, stamped), the arrow every door carries. No accent, no 30 (MODEL PART 4 names the form). Free of the bar budget (it draws no bar); not a visual form for KIND REPEATED. Six stand in one section on the home, so the adjacency rule reads that section's neighbours.

  8. `E:/atlas/rules/FOUNDER-VERDICTS.md`, appended (his answers to Q1, Q2 and Q3 are the controller's to add under it, verbatim and dated):

     > ## The home, quiet editorial (2026-10-13, in chat)
     >
     > His words that day: "The homepage talks about London and fails all the premises of what a homepage should include. Furthermore the terracotta used in the background of that section is very light. Homepage is a total mess." Then: "It fails on establishing brand, not elegant and slaps infographics which is soooo wrong at so many levels." His decisions: the reference is quiet editorial (think FT or Monocle); "The question with moving parts should remain, for the other things do as you choose, but position the page as #1 page on its own niche, above this H1 with moving parts, it is deeply needed."; the band one solid statement, full-width brand terracotta at full strength, white type, one sentence, a link to the method. His pick for the positioning line: "The reference atlas of small-business earnings." The no-eyebrow rule takes one named exception for that line. Spec: E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md; plan: E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md.

  Also the controller's: the design repo's PAGES.md census block (`census.ts --write` against it; the home's rows are now the six
  `dept-*` and Pro), QUEUE.md and STATE.md.

## Task 9, verification (the spec's section 5)

- Before against after, each read from its render with `measure_home.mjs` (`before/measure.txt`, `after/measure.txt`):

  | measure | before | after |
  |---|---|---|
  | zones | wide Search, 1-1 Worked example, 1-1-1 Proofs, wide/terra Read from the record, 1-1 The UK's cities | wide Search, wide The atlas, wide/terra How figures are made |
  | h1 / h2 / h3 | 1 / 8 / 0 | 1 / 6 / 0 |
  | figures (unstamped) | 32 (0) | 4 (0), the trade rows |
  | digits outside a figure | 69 | 2 ("v3.0" in the licence line) |
  | terracotta classes | 3 | 3 (the positioning mark, the h1's two words) |
  | distinct internal links | 25 | 31 |
  | characters under 14px | 370 of 1,596 | 0 of 1,003 |

- Browser checks, one at a time (`before/*.txt`, `after/*.txt`): page laws before 6 reds, after 0 (the before reds are this branch's
  ZONE TONES reading `--terra-full` on a render whose inline stylesheet predates the token, and the old pale band); page holes 0 and 0;
  model laws 0 and 0 (after: BLOCK FLOOR 6 against 5); copy plain 0 and 0; readability 0 and 0. No rule has more reds after than before.
- The fold (the spec's section 1 measure, `after/fold.txt`): at 1280 by 800 the six department doors end at 1,343px with a 64px bar;
  the second screen ends at 1,600px: within.
- Photographs read: `shots/after-page-1280` (the whole home), `after-top-*`, `after-contents-*`, `after-band-*`, `after-colophon-*`,
  `before-page-1280`, `before-top-*`. The category is nameable from the first screen (the positioning line above the h1); no chart, no
  single city's story, no run of figures; terracotta in the four places only with the paywall off. At 375 every part is one column.
- The paywall's form (`after/home-gb-pro.html`, NEXT_PUBLIC_PAYWALL=1 and NEXT_PUBLIC_AUTH_ENABLED=1): home_shape all pass against it
  (zones search, contents, Pro, band; h2 7 of 7; Pro's prices exempt); no_counts all pass; model laws 0; page laws 0 when the file
  carries the home's own name (named home-gb-pro it reds ZONE TONES "on home-gb-pro", the law's page check, an artifact of the file
  name). The render was then redone with the switches off. Read in `shots/after-pro-page-1280`: Pro stands after the contents and
  before the band. Noted: Pro's Rail draws its icon on a terracotta tile, a fifth terracotta place while the paywall is on (the rhythm
  branch's bare-glyph change may answer it). `check_paywall.mjs` (it renders three locked pages) was left to GitHub's `paywall-shape`.
- Step 5 (the full typecheck, `npm run verify:deploy`, the build, `next start`) and step 6 (deploy) are the controller's and the
  owner's; GitHub's run stands in for the chain and the typecheck here (below). No final code review was dispatched from this session.

## GitHub check runs

- Run 38614668533 on 93ef6522 (Task 8's report push, code as of Task 8): typecheck exit 0; chain 278 pass, 11 fail. Every home gate
  passed (home-shape, home-contents, home-band, home-no-counts, home-picker, hero-words, home-destination, page-foot, masthead, loud-seats,
  census-fresh among them). The eleven: trade-row-names (MINE: it read the everyday set's literal out of adapt_city.ts, which Task 4A
  moved; fixed in 6cd23d24, the gate now reads src/lib/spine/everyday_trades.ts and passes locally); uk-city-sources (a known base red,
  the rhythm branch's); harness-page-laws (country-GB #duel TEXT OUT OF BOX, country-AF LONE FIGURE; home-gb 0); fact-once and type-floor
  (spine pages, rhythm Tasks 1A and 1B red by design; no home finding); art-direction (country, cell and industry rhythm; home 0);
  harness-links (the two cell pages' database links; home-gb 31 against 11); provenance (the two cell pages; home-gb 4 of 4 stamped);
  harness-laws (FIGURE FACE on every page, Linux fonts in CI, the controller's known CI-only red); harness-archetypes and
  money-shown-own-rows (timeouts, known). The run on the last push is given in the final reply.
- Run 38492860642 on 4ba9ccf4 (Task 3): typecheck 0; its reds are listed under Task 3.

## Open items

1. Comments that still name the retired home files in shared pieces the rhythm branch is changing: src/components/spine/kit.tsx:1212,
   src/components/spine/basis.tsx:10, src/components/spine/archetypes/FactRows.tsx:40; also the masthead test's 404 comment "THE PROOF
   DOORS' ARROW" and a stale `HomeProofs.tsx` entry in scripts/width_discipline_baseline.json (the gate passes).
2. With the paywall on, Pro's Rail icon sits on a terracotta tile: a fifth terracotta place on the home (the spec says four).
3. The pharmacies row draws the scissors pictogram, the same as hairdressers (industryPictogramId's mapping for health and beauty stores).
4. At 375 the positioning line breaks at the hyphen of "small-business"; his words were kept as they are.
5. tests/home/archive.test.ts reds on this laptop only: the archive log's hash no longer matches data/home/archive.json's export (a
   re-export, `python -P scripts/data/home/export_home.py archive`, is the controller's call; nothing in this branch touched the data).
6. Not run here, the controller's: the full local typecheck at 4 GB, `npm run verify:deploy`, the build, `next start` and its
   photographs, `check_paywall.mjs` locally, a final code review, the parent-repo texts of Task 8, PAGES.md, QUEUE.md and STATE.md.
7. Merge watch with rhythm-air-inside: this branch touched shared files the rhythm branch also changes: NavigatorForm.tsx, HeroWords.tsx,
   globals.css (`--terra-full`, `--band-ink`, the terracotta zone, `.ma-mono`), copy.ts, check_page_laws.mjs (TERRA), check_model_laws.mjs
   (FOCAL exemption), spine_scan.mjs and the five surface gates, adapt_city.ts (EVERYDAY_TRADES moved out), docs/loop/CENSUS.md
   (generated: regenerate after the merge) and scripts/gates.json with CLAUDE.md's counts (regenerate after the merge). ReportFoot.tsx
   and SourcesFoot.tsx were left untouched.
