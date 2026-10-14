# Homepage, quiet editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The homepage establishes the brand and lays the whole atlas out as a quiet contents page: a positioning line above his h1 with its moving words, a picker that follows the h1's case, six numbered departments whose members come from rules read from the code, one solid terracotta statement and a colophon, with no chart, no single city's story, no run of figures and no count.

**Architecture:** Checks first, each red on today's render: the zone order, seats and parts in `home_shape`, the contents' rules and anatomy, the band as one statement, the no-counts law, the no-eyebrow named exception. Then one piece per task on top of `rhythm-air-inside`'s shared components: the positioning line on a new `--terra-full` token; the picker following the h1 through a client `HomeAsk` and a server-only case list; a pure contents builder (`src/lib/home/contents.ts`) drawn by a new `Department` archetype in six literal Box sections inside one wide zone; the band; a colophon in place of the two foot lines. Then the old sections leave with their tests, the home's source joins the spine scans, the written rules follow, and the spec's section 5 verifies the after against the before.

**Tech Stack:** Next.js 15.5 App Router, React 19 server and client components, TypeScript 5, Tailwind 3.4; tests are tsx scripts in the `check()`/`red()` style wired into `scripts/prebuild_all.ts`; jsdom for static reads and for mounting client components; Playwright behind `requireBrowser` for the browser gates.

**Spec:** E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md

Research behind it: E:/atlas/docs/superpowers/research/2026-10-12-design-goals/R3-home.md. Every implementer reads the spec, E:/atlas/website/CLAUDE.md and E:/atlas/website/.superpowers/sdd/pl-implementer-rules.md (its rules hold here with this plan's branch, `home-quiet-editorial`, in place of `pre-launch-fixes`). The spec numbers the page's parts inside its section 2; this plan cites them as "section 2, item 1" (the positioning line) to "item 5" (the colophon).

## Global Constraints

- The page, top to bottom: the positioning line, the question with moving parts and its picker, the contents, Pro only while the paywall is on, the band, the colophon.
- Positioning line: "The reference atlas of small-business earnings." (his pick, 2026-10-13), beside the compass mark, a serious line, never a small uppercase kicker; it claims the category, not a rank: no "#1", "most trusted" or "most used".
- The site-wide no-eyebrow rule gets one named exception for the positioning line, his instruction of 2026-10-13.
- The h1 "How much does a {trade} make in {place}?" with its red words changing in place stays as built; the picker under it follows the question's current case until the reader touches it (no single default city); the Try line that names London's trades goes; the definition line goes.
- The contents: one section, six numbered departments, a muted index 01 to 06, two rows of three at 1024 and up, one column on a phone, hairline rules between them, generous air.
- Each department: its number, its marks, a title of four words or fewer, one plain line of twelve words or fewer, three or four member rows, and an "All" door row; a member row is one shape everywhere: mark, name, a figure only where the model requires one, an arrow.
- 01 Countries: country flags, members by a rule read from the code (the countries whose pages are most complete), never a hand-kept list; "All countries".
- 02 Cities: the grey city photographs the site already holds; members by the same kind of rule (the cities whose pages carry their own figures); names only, no figure; "All cities".
- 03 Trades: the trade pictograms; each member row carries the trade's own world-typical figure from the builder the trade's industry page uses (MODEL PART 9), never one place's; "Every trade".
- 04 Tools: the site's icons; Decide, Check, Calculator, Compare; "All tools".
- 05 Reading: the three learn tracks and the newest blog post; "All reading".
- 06 How it is made: About the figures, Sources and licences, the corrections log, coverage; no count.
- The band: full width, the brand terracotta at full strength (not the pale tint), white type that meets WCAG AA, one sentence on how the figures are made and one link to the method; no figure and no count; the page's one show-off.
- The colophon: a ruled block that gathers the licence line, Sources and licences, Report a mistake, the corrections log, status and "Checked {date}", the date from the builder that prints it today.
- The Pro band keeps its slot and its rule (drawn only while the paywall is on).
- Removed: the worked example (HomeExample), the three proof cards (HomeProofs), the band's four counts (HomeRecord), the UK cities' pay rows, and "Where to next" as its own list; each removed section's tests leave with it.
- The look: the site's own typefaces (no new font), its figure style (tabular numerals), hairline rules, the muted index, flags and trade pictograms as marks; terracotta in four places only: the mark, the question's moving words, the positioning line's mark, the band.
- Reader text 14px or larger on the home.
- No country, city or trade-list count on the home (his ruling of 2026-10-07); no testimonial, press line, client logo or byline; every figure from its builder with its provenance, never typed; terracotta and neutral greys only.
- Copy: four-word headings, twelve words a line, no semicolon, no em-dash, never "modelled", "withheld" or "on file", no source-agency names, no "we".
- No carousel, pager, modal, drawer, toast, loader or filter chip.
- Phone first: every part reads as one column at 375 with the 16px gutter.
- The owner's never-list, verbatim: "Never: push, deploy, merge into main, force-push, --no-verify; change Stripe, Supabase, Vercel or DNS settings; apply a migration to the live database; print or copy any .env value; install or download anything (npm, pip, data files); send an email or post anywhere; rename a URL; raise a ratchet baseline; pipe a verification into a filter; run two browsers or a browser beside the chain; close my apps for memory (wait and check again). Never invent a figure, testimonial, review, logo or credential."

## Review Focus

1. **A pointer, press, focus or key reaching the picker while the case changes.** Expected: the h1's words and the picker's fields stop on the same case at that moment, and a submit (the browser's own before the lists load, the page's own after) sends the case on screen. Test: Task 3, Step 1 (`tests/home/hero_words.test.ts` mounts `HomeAsk` on a driven clock: ticks move the fields, a pointer over the form freezes both, both submits read; a pointer over the h1 alone freezes nothing).
2. **An h1 case the picker cannot show whole, or whose search lands nowhere** (a word no activity answers, a city no country lists or two countries list, a cell the edge answers 404). Expected: that tick keeps the case on screen, never half a case and never a 404; the first case is the form's own seed. Test: Task 3, Step 1 (`tests/home/picker.test.ts`: a null case between two cases; `tests/home/destination.test.ts`: every kept case lands where `edgeNotFound` says a page stands, `pickerCaseFor` fixtures).
3. **A department in a thin data state** (no covered country but the UK, no city with its own figure and photograph, no trade whose net is its own, no track with an article, no post). Expected: fewer rows, never a placeholder row, never more than four, the door always there, no member landing on a 404. Test: Task 1B, Step 1, run green in Task 4A (`tests/home/contents.test.ts` feeds each builder empty and odd sources) and Task 4B (a `Department` with no rows draws its title, line and door).
4. **A trade figure that is not the trade's own, or differs from its industry page** (the sector profile's residual on a fill shard; a figure rounded twice). Expected: such a trade is left out, never printed under its name; a printed figure is the industry page's answer character for character, stamped. Test: Task 1B, Step 1, green in Task 4A (a profile-branch trade fed to `contentsTrades` yields no member; each member's text equals `industryHeroFacts(id).answer.value`).
5. **A count reaching the home in words or in a member's name** ("one hundred and thirty-eight trades", "hundreds of cities", "five London trades", a post titled "The 12 cities where rent fell"). Expected: the no-counts gate reds it and the reading department passes over such a post. Test: Task 1C, Step 1 (fixtures through `listCounts` and the render walk) and Task 1B, Step 1, green in Task 4A (`contentsReading` skips a counting title).

## Decisions the spec leaves open (the controller asks him; the plan names, it does not decide)

- **Q1, before Task 2: the band's colour, `--terra-full`.** The spec asks for "the brand terracotta at full strength"; the brand's own red is the wordmark's `#e62200` (atlas-500), which his rule of 2026-10-10 keeps "the wordmark's alone" (globals.css at `--terra-text`, and the implementer rules' palette line). White on it reads 4.57 to 1 (AA, narrowly). (A) `#e62200`, the wordmark's own, the rule amended to "the wordmark, the band and the positioning line's mark"; (B) `#c11c00` (atlas-600), 6.12 to 1, one step deeper; (C) `#991600`, the one text red, 8.50 to 1. The plan is written for A; B or C changes one line (Task 2, Step 3's token) and Task 8's wording. Recommendation: A, the spec's "brand terracotta" read literally.
- **Q2, before Task 4B: the department form's FOCAL exemption.** The home's block floor is 5 and "only rises" (`check_model_laws.mjs` FLOOR_BY_SURFACE), and a home with no `[data-card]` reds NO SECTIONS in three gates, so the six departments must be Box sections (a `data-block` each). FOCAL then asks each for a figure at 30, which a contents entry does not hold. (A) add `department` to `FOCAL_EXEMPT_FORMS` and name it in MODEL PART 4's "WHO HOLDS NO 30" as a form that holds no figure by its own law, as the prose form and the seat form do; (B) draw the departments as cards with no id, so no block: BLOCK FLOOR then reads the home as unmeasured, which lowers a floor the model says only rises. The plan is written for A.
- **Q3, before Task 6: "Checked {date}" on a home that prints no register figure.** The spec keeps it, "the date from the builder that prints it today" (`checkedDateForTrade`, here for the h1's first case, restaurants in London). `src/lib/spine/checked.ts` prints the date "only on a page whose figures that data backs", and the new home prints no register figure (its one kind of figure is a trade's world net, an estimate). (A) keep it, as the spec says; (B) drop it: `HomeColophon` takes no date, `tests/spine/page_foot.test.ts` sets home-gb `dated: false` and its kind for home-view.tsx `"none"`, and home_shape's colophon check reads no `data-checked`. The plan is written for A, with B's delta in Task 6, Step 6.

## Readings the plan takes (stated, not asked)

- From 768 to 1023 the departments stand two to a row in three rows (the spec names 1024 up and the phone only).
- Pro keeps its slot after the page's main section: after the contents, before the band.
- The marks stand on the member rows, one at the start of each; the department's number stands beside its title.
- The band's sentence is "Each figure is counted, worked out, looked up or estimated.": About the figures' four kinds (that page's description says the same). A sentence that every figure names its source would be false: the provenance ratchet holds 275 unstamped figures on country-GB and 57 on industry-restaurants (`scripts/harness/provenance_baseline.json`). Its link is About the figures (`/about-data#reading`), the method.
- 06's door is About the figures (the spec lists it with 06's entries; a door row stands for the whole department); 05's door, "All reading", opens `/learn`, the knowledge base.
- The six departments are Box sections with ids `dept-<key>`: the page laws read a section by `data-card`, the block floor by `data-block`, and `cities` stays free while the old foot draws until Task 7A.
- The contents is one wide zone that draws its own grid: ZONE SPLIT reds a `1-1-1` zone holding six cells, and art direction D3 never reds two neighbouring wide zones.
- The newest post whose title holds a list count is passed over for the next (the no-counts law reads member names).
- A trade's figure prints only where its world net is its own (`resolveTradeNet`'s shard branch); a fill shard, whose net is the sector profile's residual, is left out of the department, never printed under the trade's name.
- An h1 case the picker cannot show whole keeps the case on screen (Review Focus 2).

## What is true today (rhythm-air-inside 2ed8420e; main c35e42a7)

Every home source file below is identical at both commits; where a script differs, both lines are given.

- **The view.** `src/components/spine/home/home-view.tsx`: header :1-28; imports :29-52; `LOUD_SEATS` :61-65 (seat 1 `pays` LIT, seat 2 `record` FIELD, seat 3 `foot` NO HONEST CANDIDATE); `HomeSearch` :74-90 (the h1 :79-81 holding `<HeroWords lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} />`, the picker's wrapper `relative z-30 mt-4 lg:mt-8 w-full` :82-84 holding `<NavigatorForm showHeading={false} seed={homePickerSeed()} />`, the definition `<p data-definition="" ...>{C.definition}</p>` :85-86); `HomeCities` :100-108; `SpineHomeBody` :110-147 with its zones :118-125 (search wide; example 1-1 even; pro 2-1 behind `isPaywallOn`; proofs 1-1-1 even cards; record wide terra; foot 1-1), `const toned = zones.filter((z) => z.tone !== "terra");` :128, `<SourcesFoot iso2="GB" />` and `<ReportFoot path="/" checked={example ? checkedDateForTrade("GB", "london", example.trade) : null} />` :143-144.
- **The parts that leave.** `home/HomeExample.tsx`, `home/HomeProofs.tsx`, `home/HomeRecord.tsx` (four counts on `--terra`, "of 138"), `archetypes/CityRows.tsx`; their builders `src/lib/home/worked_example.ts`, `src/lib/home/proofs.ts` (and `src/lib/spine/home_answers.ts`, imported by `proofs.ts` alone), `src/lib/home/site_counts.ts`. `WhereNext.tsx`'s `pitch` prop (:16, :23) is passed by the home alone; `openings-view.tsx:58` draws `WhereNext` without it.
- **The hero's words.** `home/HeroWords.tsx`: props :25; one timer effect :29-82; it stops on `pointerdown`, `keydown`, `focusin` inside `#search` (`acts` :72-73). `src/lib/hero-words.ts`: twelve cities, eight businesses, `HERO_TICKS = 12`, `heroIndexAt` :60-62; `RotatingWord` draws `words[index % words.length]`.
- **The picker.** `src/components/NavigatorForm.tsx`: header :9-36; the signature :61; the comment "THE PRE-FILL NO LONGER ROTATES" :65-88; state :89-91; `loadLists` :101-115; the no-seed effects :117-127; options from the seed :129-132; `hidden` :135-136; `tries` and `tryCity` :137-140; handlers `onPointerEnter={loadLists}`, `onFocus`, `onKeyDown` :169-171; the Try line `<p data-try="" ...>` :268-284. `src/lib/home/picker.ts`: `PickerSeed` with `tries` and `tryCity` :28-35; `homePickerSeed` :67-79; the re-export :81-83. `src/lib/home/destination.ts`: `HOME_TRY_CITY`, `HOME_TRY`, `homeTryLinks`, `homeTryCityLabel` :68-92. `src/app/page.tsx:424` (the flag-off home) renders `<NavigatorForm seed={homePickerSeed()} />`.
- **The copy.** `src/lib/spine/copy.ts`, `COPY.home` :2732-2892: `h1` :2733, `searchLabel` :2734, `lines` :2738, `citiesLabel` :2739, `citiesAll` :2742, `citiesUnit` :2743, `citiesHead` :2747, `next` :2815, `example` :2832, `definition` :2850, `proofs` :2863, `record` :2873, `pro` :2884; `pageFoot` :2900. `definition` also feeds `src/app/layout.tsx`, `manifest.ts`, `og/default/route.tsx` and `StructuredData.tsx` (kept).
- **The stylesheet.** `src/app/globals.css`: the glyph accents :632-680 (`.spine-scope .ma-glyph .a { stroke: var(--terra-text); }` :673-675; the section icon's override `.spine-scope .ma-glyph.spine-ic .a` :660-666); THE ZONES' `:root` :1166-1173 with `--band-rule` :1172; the terracotta zone :1289-1301 (`--zone-bg: var(--terra)`, `color: var(--c-ink)`); its print rule :1302-1308; the foot band `[data-sources-foot], [data-page-foot]` :1309-1320; `--c-card: rgba(255, 255, 255, 1);` :2744; `--terra: #fb8469;` :2772; `--terra-text: #991600;` :2777.
- **The laws.** `scripts/harness/check_page_laws.mjs` (both): ZONE TONES header :399-400; `const TERRA = "rgb(251, 132, 105)", TERRA_PAGE = "home-gb";` :416; ZONE SPLIT :446-452; NO SECTIONS :518. `scripts/harness/check_model_laws.mjs`: `FLOOR_BY_SURFACE` (home 5) :373; `KEPT_BY_HIS_RULING_31` and `FOCAL_EXEMPT_FORMS` :829-830; FLAG and FLAG ROOM :493-540. Baselines: `model_laws_baseline.json` home-gb 0, `provenance_baseline.json` home-gb 0, `page_laws_baseline.json` holds country-AF alone, `art_direction_baseline.json` holds no home key (every home measure is held at 0).
- **The gates that name home files.** `scripts/verify_no_eyebrow.ts` (SURFACE_FILES :75-85, home-view :82; exit block :232), `verify_subsection_icons.ts:57`, `verify_no_bold_display.ts:57`, `verify_banned_patterns.ts:56`, `verify_bar_budget.ts:95`; `scripts/verify_trade_set.ts` (Part 3 doc :35-44, `import { HOME_TRY }` :55, `HOME_TRY_FILE` :59-61, Part 3 :213-222, its report :230-233); `scripts/verify_archetype_coverage.ts:40-41` (`ARCHETYPES` ends `"CountUnits", "CityRows"];`); `scripts/lib/spine_scan.mjs` (rhythm only) `SPINE_OUT` names `home/` :59 and `WhereNext.tsx` :62.
- **The chain's home gates** (`scripts/prebuild_all.ts`, rhythm line then main line): home-destination :603/:585, home-answers :608/:590, home-bands :612/:594, home-how-made :676/:658, home-archive :680/:662, site-counts :686/:668, home-forms :689/:671, home-foot :693/:675, uk-sources :734/:716, masthead :837/:819, hero-words :920/:902, home-picker :924/:906, home-shape :926/:908, no-eyebrow :1012/:994, trade-set :1014/:996.
- **Tests that read the home.** `tests/trust/home_shape.test.ts` (the old order); `tests/home/{home_answers,foot,site_counts,archive,how_made}.test.ts` (the parts that leave); `tests/home/{picker,destination,hero_words}.test.ts` (the hero); `tests/home/home_bands.test.ts` (REMEDY names site_counts.test); `tests/spine/uk_sources.test.ts:107-108` (the band's count equal to the list's unmarked items); `tests/spine/page_foot.test.ts:10-11`, `:45`, `:79` (the home's checked date); `tests/chrome/masthead.test.ts:52`, `:766`, `:790-803` (the arrow read from `HomeProofs`); `tests/spine/home_forms.test.ts:1-26`, `:185-188` (props for the old home); `tests/home/{duel,firms_last,kitchens,new_companies,us_restaurants}.test.ts` (each asserts its section is absent from the home's render: unaffected); `tests/app/head.test.ts:442-446` (the h1 inside `#search`: unaffected); `tests/trust/hero_still.test.ts` (unaffected).

## The state this plan builds on (after rhythm-air-inside's Tasks 2A, 2B, 3 and 5)

The rhythm plan (E:/atlas/docs/superpowers/plans/2026-10-12-rhythm-air-inside.md) changes the shared pieces the home draws. Task 0, Step 2 checks each by grep; a difference stops this plan and is reported.

- **Rail's margins (2A):** `Rail` renders `<div class="mb-6" data-rail=""><div class="flex items-center gap-2">`, so a section title stands 24 above its first content; `<Band hero>` renders `<div data-hero="1">` with no margin; FactRows rows are `py-4`. The home draws a Rail only in `ProBand`.
- **Focal and Basis in the kit (2B):** `Focal` and `Basis` are exported from `src/components/spine/kit.tsx`; `country/focal.tsx` re-exports `Focal`, which `ProBand.tsx` imports; a Focal's wrapper is `mb-6`.
- **12px text lifted to 14 (3):** the kit's Basis, Focal's words and placement, FactRows' note at `--t-body`; `ReportFoot.tsx` at `--t-body`; `SourcesFoot.tsx` keeps 12 with `data-type-allow="sources-foot"`; `check_copy_plain.mjs` reads a paragraph marked `data-line`, `data-basis` or `data-placement` as a supporting line at any size; `home/*` was out of that task's scope.
- **Tiles on openers only (5):** FactRows draws no glyph; gate `tiles-openers` holds the kit's `Ico` to the openers in the source and on the spine renders.
- **New gates:** `type-floor`, `type-floor-reader`, `fact-once`, `fact-once-reader`, `spacing-pin`, `zone-rhythm`, `tiles-openers`; `scripts/lib/type_floor.mjs` exports `readTypeFloor(doc, allowKeys)`; `scripts/lib/spine_scan.mjs` exports `scanSpine()` and `SPINE_OUT`, whose `home/` entry calls the home "project 3 of the owner's design goals" (this plan).
- **Written rules (7):** FOUNDER-VERDICTS.md ends with "## Rhythm: air inside only (2026-10-12, in chat)"; GUIDELINES.md 0.1 to 0.3 carry the rhythm gates' rows.

## Conventions for every task

- Commands from Git Bash, each `cd /e/atlas/website && ...` (Task 8's E:/atlas files `cd /e/atlas && ...`). tsx as `node node_modules/tsx/dist/cli.mjs`, never npx. Each verification `> scratchpad/home-qe/<file> 2>&1; echo "exit $?" >> scratchpad/home-qe/<file>`, read with the Read tool, never piped.
- RENDER, the home alone: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx home gb` (writes `scratchpad/harness/pages/home-gb.html`). Renders and browser checks one at a time, never beside the chain.
- GATES: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=<names>`; after a source change name `pages-fresh` first, so the gates read fresh renders.
- COUNTS after a gate is added or removed, or a gate's path literals change (new files staged first): `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write`; `scripts/gates.json` and CLAUDE.md's generated block move, nothing else.
- CENSUS after a home Box is added or removed: `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write --pages=scratchpad/home-qe/no-pages.md` (that path does not exist, so the script writes `docs/loop/CENSUS.md` alone and leaves the design repo's PAGES.md to the controller).
- TYPECHECK where a task changes props or types: the memory test `node -e "const f=Math.round(require('os').freemem()/1048576);console.log(f+' MB free');process.exit(f>=1150?0:1)"`; exit 0 runs `node node_modules/typescript/bin/tsc --noEmit -p .`, exit 1 a scoped config under `scratchpad/home-qe/` (extends `../../tsconfig.json`, `incremental: false`, `include` the files touched plus `src/types` and `next-env.d.ts`).
- Edits holding a backslash go through the Edit tool. Keep each file's line endings (`git ls-files --eol <file>`).
- Commits: only the task's files; one commit per task unless the task says otherwise; the message `home:<slug>: <what> (plan 2026-10-13 home-quiet-editorial, Task <n>)`, then a blank line and exactly `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never switch branches, rebase, reset, stash, merge or amend. Records in the design repo (QUEUE.md, STATE.md, PAGES.md) are the controller's.
- A gate that cannot read what it holds reds: a test whose render is missing reds with the remedy "run the pages-fresh gate"; a module that does not exist yet is loaded with `import()` and reds by name, never crashes the file.
- tsx injects `__name` into compiled functions, so no test serializes a function into `page.evaluate`; a browser rule lives in an `.mjs` file and a tsx test reads that file's source from disk.
- A comment says what the code does, no more: every comment this plan writes or touches is read against the code in the same step.

## File map

| File | Task | Role |
|---|---|---|
| `scratchpad/home-qe/measure_home.mjs` | 0 | the before and after reading (not committed) |
| `tests/trust/home_shape.test.ts` | 1A | rewritten whole: the order, the seats, the parts, the render |
| `tests/home/contents.test.ts` | 1B (green 4A, 4B) | the departments' rules, thin states, anatomy, render, the small copies |
| `tests/home/band.test.ts` | 1B (green 5) | the band as one statement, its truth, its colour |
| `src/lib/home/list_counts.ts`, `tests/home/no_counts.test.ts` | 1C | the count words; the no-counts law |
| `scripts/verify_no_eyebrow.ts` | 1D, 7B | the named exception; the home folder read |
| `src/app/globals.css` | 2, 4B, 5 | `--terra-full`; `.ma-mono`; the band's zone |
| `src/components/spine/home/home-view.tsx` | 2, 3, 4B, 5, 6, 7A | the page |
| `src/components/spine/home/HomeAsk.tsx` | 3 | the h1 and the picker on one index (client) |
| `src/components/spine/home/HeroWords.tsx`, `src/components/NavigatorForm.tsx` | 3 | `onIndex`; `cases`, `caseIndex`, the Try line gone |
| `src/lib/home/picker.ts`, `src/lib/home/picker_cases.ts`, `src/lib/home/destination.ts` | 3 | `pickerSeed`; the h1's cases (server only); HOME_TRY gone |
| `src/lib/home/contents.ts` | 4A | the six departments' rules |
| `src/components/spine/archetypes/Department.tsx`, `src/components/spine/home/HomeContents.tsx` | 4B | the form; the six sections |
| `src/components/spine/home/HomeBand.tsx` | 5 | the band |
| `src/components/spine/home/HomeColophon.tsx` | 6 | the colophon |
| `src/lib/spine/copy.ts` | 2, 3, 4A, 5, 6, 7A | `positioning`, `contents`, `band`, `colophon`; the old keys pruned |
| `scripts/harness/check_page_laws.mjs`, `scripts/harness/check_model_laws.mjs`, `scripts/verify_archetype_coverage.ts`, `scripts/verify_trade_set.ts` | 3, 4A, 4B, 5, 7A | the laws taught the new page |
| `scripts/lib/spine_scan.mjs` and four surface gates | 7B | the home's source read by the scans |
| E:/atlas `design/loop/build/briefs/MODEL.md`, `rules/FORM-CATALOG.md`, `rules/FOUNDER-VERDICTS.md`; website `docs/design-system/GUIDELINES.md` | 8 | the written rules |

---

### Task 0: The ground and the before

**Files:**
- Create (scratch, never committed): `scratchpad/home-qe/measure_home.mjs`, `scratchpad/home-qe/before/*`, `scratchpad/home-qe/shots/*`

**Interfaces:**
- Produces: `node scratchpad/home-qe/measure_home.mjs <render.html> ...` (zones with split, tone and label; h1, h2 and h3 counts; figures and unstamped figures; digits outside a figure; terracotta classes; distinct internal links; the type floor's small and allowed characters). Used again by Task 9.

- [ ] **Step 1: The branch (the controller's).** When `rhythm-air-inside` has completed its Task 8 (its last commit on top of 2ed8420e; or `main`, if the controller has merged it): from E:/atlas/website, clean, `git switch -c home-quiet-editorial`. Then `mkdir -p scratchpad/home-qe/before scratchpad/home-qe/after scratchpad/home-qe/shots`.

- [ ] **Step 2: The state this plan builds on, checked.** Each to its own file with the exit line:

```bash
cd /e/atlas/website && git log --oneline -80 > scratchpad/home-qe/t0-log.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-log.txt
cd /e/atlas/website && git grep -n 'className="mb-6" data-rail=""' -- src/components/spine/kit.tsx > scratchpad/home-qe/t0-rail.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-rail.txt
cd /e/atlas/website && git grep -n "^export function Focal\|^export function Basis" -- src/components/spine/kit.tsx > scratchpad/home-qe/t0-focal.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-focal.txt
cd /e/atlas/website && git grep -n 'data-type-allow="sources-foot"' -- src/components/spine/SourcesFoot.tsx > scratchpad/home-qe/t0-sources.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-sources.txt
cd /e/atlas/website && git grep -n "t-micro" -- src/components/spine/ReportFoot.tsx > scratchpad/home-qe/t0-report.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-report.txt
cd /e/atlas/website && git grep -n "<Ico" -- src/components/spine/archetypes/FactRows.tsx > scratchpad/home-qe/t0-tiles.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-tiles.txt
cd /e/atlas/website && git grep -n "scanSpine" -- tests/spine > scratchpad/home-qe/t0-scan.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-scan.txt
cd /e/atlas/website && git grep -n 'name: "\(type-floor\|type-floor-reader\|fact-once\|spacing-pin\|zone-rhythm\|tiles-openers\)"' -- scripts/prebuild_all.ts > scratchpad/home-qe/t0-gates.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t0-gates.txt
```

Expected: the log holds the rhythm commits `rhythm:head-rows-hero`, `rhythm:groups`, `rhythm:type-floor-pieces`, `rhythm:type-floor-sweep`, the `rhythm:fact-once-*` commits, `rhythm:tiles-openers`, the re-splits and `docs:rhythm-gates`; rail, focal, sources each one or two hits (exit 0); report and tiles no hit (exit 1, which is the expected answer); gates six hits. `t0-scan.txt` says which spine tests read through `scanSpine` (`spacing_pin` at least; record whether `type_floor.test.ts` and `tiles_openers.test.ts` do: Task 7B depends on it). Any other answer stops the plan and goes to the controller with the file.

- [ ] **Step 3: Write the reading tool** `scratchpad/home-qe/measure_home.mjs`:

```js
// scratchpad/home-qe/measure_home.mjs (plan 2026-10-13 home-quiet-editorial, Tasks 0 and 9): the home's render read statically, the same
// way before and after. Not a gate, never committed.
// usage: node scratchpad/home-qe/measure_home.mjs <render.html> ...
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { readTypeFloor } from "../../scripts/lib/type_floor.mjs";
const allow = new Set(JSON.parse(readFileSync("scripts/harness/type_floor_allow.json", "utf8")).map((e) => e.key));
for (const file of process.argv.slice(2)) {
  const html = readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
  const doc = new JSDOM(html).window.document;
  const main = doc.querySelector("main") ?? doc.body;
  const zones = [...main.querySelectorAll("[data-zone]")].map((z) => `${z.getAttribute("data-zone")}${z.getAttribute("data-tone") ? `/${z.getAttribute("data-tone")}` : ""} "${z.getAttribute("data-zone-label") ?? ""}"`);
  const figs = [...main.querySelectorAll(".fig")];
  const bare = figs.filter((f) => !f.hasAttribute("data-src") || !f.hasAttribute("data-kind"));
  const walker = doc.createTreeWalker(main, 4);
  let digits = 0;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.parentElement && !n.parentElement.closest(".fig, time, [data-dept-index]")) digits += ((n.textContent ?? "").match(/\d/g) ?? []).length;
  const terra = [...main.querySelectorAll("*")].filter((el) => /terra|atlas-\d/.test(el.getAttribute("class") ?? "")).length;
  const links = new Set([...main.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")));
  const tf = readTypeFloor(doc, allow);
  console.log(`${file}\n  zones: ${zones.join(" | ")}\n  h1 ${main.querySelectorAll("h1").length}, h2 ${main.querySelectorAll("h2").length}, h3 ${main.querySelectorAll("h3").length}\n  figures ${figs.length} (${bare.length} unstamped); digits outside a figure ${digits}; terracotta classes ${terra}; distinct internal links ${links.size}\n  under 14px: ${tf.small} small, ${tf.allowed} allowed, of ${tf.chars} characters`);
}
```

- [ ] **Step 4: The before render and reading.** The memory test, then RENDER to `scratchpad/home-qe/before/render.txt` (exit 0); copy `scratchpad/harness/pages/home-gb.html` to `scratchpad/home-qe/before/home-gb.html`; `node scratchpad/home-qe/measure_home.mjs scratchpad/home-qe/before/home-gb.html > scratchpad/home-qe/before/measure.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/before/measure.txt`. Expected zones: `wide "Search" | 1-1 "Worked example" | 1-1-1 "Proofs" | wide/terra "Read from the record" | 1-1 "The UK’s cities"`; figures over 20, digits outside a figure above 0.

- [ ] **Step 5: The before browser checks**, one at a time, each to `scratchpad/home-qe/before/<check>.txt` with its exit line: `node scripts/harness/check_page_laws.mjs scratchpad/home-qe/before/home-gb.html`, `node scripts/harness/check_page_holes.mjs scratchpad/home-qe/before/home-gb.html`, `node scripts/harness/check_model_laws.mjs scratchpad/home-qe/before/home-gb.html`, `node scripts/harness/check_copy_plain.mjs scratchpad/home-qe/before/home-gb.html`, `node scripts/harness/check_readability.mjs scratchpad/home-qe/before/home-gb.html`; then GATES `--only=loud-seats,harness-links,provenance,art-direction,harness-page-filter` to `before/gates.txt`. The reds per rule are the before the spec's section 5 holds every after to.

- [ ] **Step 6: The before photographs**, one at a time: `node scripts/harness/shoot_page.mjs scratchpad/home-qe/before/home-gb.html "#search" scratchpad/home-qe/shots/before-top 1280,768,375`, the same with `"#joins"` (`before-proofs`), `"#record"` (`before-band`) and `"#cities"` (`before-foot`), each run's output to `scratchpad/home-qe/before/shoot-<part>.txt`. Read each picture.

---

### Task 1A: home_shape rewritten, red on today's render

**Files:**
- Modify (rewrite whole): `tests/trust/home_shape.test.ts`
- Modify: `scripts/prebuild_all.ts` (the comment above `{ name: "home-shape", ... }`)

**Interfaces:**
- Consumes: nothing new.
- Produces: the names later tasks satisfy: zones keyed `search`, `contents`, `pro`, `band` in `home-view.tsx`; `COPY.home.positioning`, `COPY.home.contents.label`, `COPY.home.band.label`, `COPY.home.colophon`; `<HomeAsk lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} cases={homePickerCases()} />`; HomeAsk's h1 and `<NavigatorForm showHeading={false} cases={cases} caseIndex={at} />`; `<HomeColophon checked={checkedDateForTrade(ask.hidden.country, ask.hidden.subdivision, ask.hidden.industry)} />`; the hooks `[data-positioning]`, `[data-contents]`, `#band`, `#colophon`; `Department.tsx`'s h2 at the Rail title's tracking.

- [ ] **Step 1: Write the test.** `tests/trust/home_shape.test.ts` is replaced whole by:

```ts
/**
 * THE HOME, QUIET EDITORIAL (plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, approved 2026-10-13). His words that led to it: the home
 * "fails all the premises of what a homepage should include", and "fails on establishing brand, not elegant and slaps infographics". In
 * this order and nothing else: the search zone (the positioning line beside the compass mark, above his h1 with its two moving words, and
 * the picker that follows the h1's case), the contents (six numbered departments in one wide zone), Pro only while the paywall is on, the
 * band (one solid statement on the brand terracotta), then the colophon. Three wide zones by name; three seats: the band a field, the
 * contents and the colophon none; no worked example, proofs, counts band, city rows or where-to-next list; one h2 a department and none
 * skipped; every figure stamped but Pro's prices; no reader text under 14px. Read from src/components/spine/home/home-view.tsx,
 * src/components/spine/home/HomeAsk.tsx, src/app/page.tsx, src/components/NavigatorForm.tsx, src/components/StructuredData.tsx and
 * src/components/spine/archetypes/Department.tsx, and from the harness render scratchpad/harness/pages/home-gb.html, which pages-fresh
 * writes first in the chain: a missing render is a red, so the render's half never passes having read nothing.
 * Run: node node_modules/tsx/dist/cli.mjs tests/trust/home_shape.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { HERO_BUSINESSES, HERO_CITIES } from "../../src/lib/hero-words";
import { COPY } from "../../src/lib/spine/copy";
import { priceLine, yearlyHeadline } from "../../src/lib/monetization/plan";
import { OGL_LINE, UK_SOURCES_FOOT } from "../../src/lib/spine/uk_sources";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { readTypeFloor } from "../../scripts/lib/type_floor.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-shape";
const VIEW = "src/components/spine/home/home-view.tsx";
const ASK = "src/components/spine/home/HomeAsk.tsx";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = `keep ${VIEW} to plan 2026-10-13 home-quiet-editorial: zones search (the positioning line, then HomeAsk), contents (HomeContents), (pro behind isPaywallOn), band (HomeBand on the terracotta tone); seats contents none, band FIELD, colophon none; then HomeColophon`;
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
/** A COPY.home string by its path, or "" where the key has not landed yet (each lands with its task; a missing one is a red, never a crash). */
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };

/* JSX COMMENTS GO FIRST, WHOLE (kept from the test this replaces): one that runs over two lines leaves its braces to stripCommentLines, and a
   slice ending at the first line that starts with `}` would stop early; tempered, so a match never runs past its own comment. */
const view = read(VIEW);
const code = stripCommentLines(view.replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const askCode = stripCommentLines(read(ASK).replace(/\{\s*\/\*(?:(?!\*\/)[\s\S])*\*\/\s*\}/g, "").split("\n")).join("\n");
const live = read("src/app/page.tsx");
const picker = read("src/components/NavigatorForm.tsx");
const sd = read("src/components/StructuredData.tsx");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside SpineHomeBody's `zones` array), and each zone's line. */
const body = /const zones[\s\S]*?\n  \];/.exec(code)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
check(`the zones run the search, the contents, then the band (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(["search", "contents", "band"]));
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the contents and before the band, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("contents") && pro < keys.indexOf("band") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
const zoneLine = (key: string) => new RegExp(`\\{ key: "${key}", split: "([^"]+)"[^\\n]*`).exec(body);
const split = (key: string) => zoneLine(key)?.[1];
check(`three full widths and no other split but Pro's: the search, the contents and the band (read: ${["search", "contents", "band"].map((k) => `${k} ${split(k) ?? "none"}`).join(", ")})`, split("search") === "wide" && split("contents") === "wide" && split("band") === "wide" && (body.match(/split: "wide"/g) ?? []).length === 3 && (body.match(/split: "/g) ?? []).length === 4);
check("the contents zone draws HomeContents from buildContents, under the zone name the copy gives it", /\{ key: "contents", split: "wide", label: COPY\.home\.contents\.label, body: \[<HomeContents key="contents" contents=\{contents\} \/>\] \}/.test(body) && /const contents = buildContents\(\);/.test(code), VIEW, `list it as { key: "contents", split: "wide", label: COPY.home.contents.label, body: [<HomeContents key="contents" contents={contents} />] } with const contents = buildContents();`);
check("the band is HomeBand, its own zone on the terracotta tone the alternation skips", /\{ key: "band", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY\.home\.band\.label, body: \[<HomeBand key="band" \/>\] \}/.test(body) && /const toned = zones\.filter\(\(z\) => z\.tone !== "terra"\);/.test(code) && /zoneTone\(toned\.indexOf\(z\)\)/.test(code));

/* THE SEATS (the spec's section 4: the band the one loud seat; the question's moving words his h1's red, never a seat). */
const seats = /export const LOUD_SEATS = \[[\s\S]*?\] as const/.exec(code)?.[0] ?? "";
check("three seats: the contents none, the band a field, the colophon none; no seat lit by a figure", !/state: "LIT"/.test(seats) && /seat: 1, card: "contents"[^\n]*state: "NO HONEST CANDIDATE"/.test(seats) && /seat: 2, card: "band", id: "band"[^\n]*state: "FIELD"/.test(seats) && /seat: 3, card: "colophon"[^\n]*state: "NO HONEST CANDIDATE"/.test(seats));

/* THE SEARCH (the spec's section 2, items 1 and 2). */
const search = /function HomeSearch[\s\S]*?\n\}/.exec(code)?.[0] ?? "";
const posAt = search.indexOf("<p data-positioning");
check("the positioning line stands first in the search, the compass mark in the brand terracotta beside its words, at the head rung, before the question", posAt > -1 && posAt < search.indexOf("<HomeAsk") && /<p data-positioning="" className="mb-4 flex items-center gap-3 text-\[length:var\(--t-head\)\] font-semibold leading-7 text-\[var\(--c-ink\)\] lg:mb-6">\s*<LogoMark size=\{24\} className="shrink-0 text-\[var\(--terra-full\)\]" \/>\s*<span>\{C\.positioning\}<\/span>\s*<\/p>/.test(search));
check("the question and its picker are HomeAsk, handed the h1's words and the cases the picker follows; no h1, picker or definition of the view's own", /<HomeAsk lead=\{C\.h1\.lead\} middle=\{C\.h1\.middle\} businesses=\{HERO_BUSINESSES\} cities=\{HERO_CITIES\} cases=\{homePickerCases\(\)\} \/>/.test(search) && !/<h1\b|<NavigatorForm|data-definition|\.definition\b/.test(search));
check("HomeAsk holds the h1 on its words' one timer, told the index, and under it the picker that follows that index, with no heading", /<h1 className="font-display text-\[1\.75rem\] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-\[var\(--c-ink\)\] leading-\[1\.08\]">\s*<HeroWords lead=\{lead\} middle=\{middle\} businesses=\{businesses\} cities=\{cities\} onIndex=\{setAt\} \/>\s*<\/h1>/.test(askCode) && /<div className="relative z-30 mt-4 lg:mt-8 w-full">\s*<NavigatorForm showHeading=\{false\} cases=\{cases\} caseIndex=\{at\} \/>\s*<\/div>/.test(askCode), ASK, "write src/components/spine/home/HomeAsk.tsx as plan 2026-10-13 Task 3 gives it");
check("the live home renders the picker with its heading, its first paint from the server's seed", /^import \{ homePickerSeed \} from "@\/lib\/home\/picker";/m.test(live) && /<NavigatorForm seed=\{homePickerSeed\(\)\} \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live), "src/app/page.tsx");
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker), "src/components/NavigatorForm.tsx");
check(`the h1's first words ask the case the picker opens on ("a ${HERO_BUSINESSES[0]}" in "${HERO_CITIES[0]}")`, HERO_BUSINESSES[0] === "restaurant" && HERO_CITIES[0] === "London", "src/lib/hero-words.ts");
const sdFn = (name: string) => { const at = sd.indexOf(`export function ${name}(`); if (at < 0) return ""; const next = sd.indexOf("\nexport function ", at + 1); return sd.slice(at, next < 0 ? undefined : next); };
check("the WebSite's and the Organization's descriptions in the structured data are the site's one definition", /description:\s*COPY\.home\.definition/.test(sdFn("WebSite")) && /description:\s*COPY\.home\.definition/.test(sdFn("Organization")), "src/components/StructuredData.tsx");

/* THE COLOPHON (the spec's section 2, item 5): one block in place of the two foot lines, the date of the h1's first case. */
check("the colophon closes the page with the date of the h1's first case, and the two foot lines are gone", /<HomeColophon checked=\{checkedDateForTrade\(ask\.hidden\.country, ask\.hidden\.subdivision, ask\.hidden\.industry\)\} \/>/.test(code) && /const ask = homePickerSeed\(\);/.test(code) && !/<SourcesFoot\b|<ReportFoot\b/.test(code));

/* NOTHING THE REFORM RETIRED (the spec's section 2, "Removed", and the plans before it). */
const RETIRED = ["HomePlace", "HomePays", "HomeExample", "ProofJoins", "ProofArchive", "ProofTax", "HomeProofs", "HomeRecord", "buildSiteCounts", "buildWorkedExample", "buildProofs", "CityRows", "CityRowsHead", "HomeCities", "WhereNext", "nextDoors", "HomeDuel", "HomeKitchens", "HomeFirmsLast", "HomeNewCompanies", "HomeUsRestaurants", "HomeHowMade", "Notebook", "buildNotebook", "AnswerDoor", "TaxAnswer", "TradesAnswer", "YearsAnswer", "buildHomeAnswers", "HomeNewsletter", "AtlasHolds", "buildAtlasHolds", "getAtlasLedger"];
const still = RETIRED.filter((n) => new RegExp(`\\b${n}\\b`).test(code));
check(`no section the reform retired is drawn (${still.join(", ") || "none"})`, still.length === 0);

/* CURLY APOSTROPHES (kept from the test this replaces, critique pass 2, P2.3; fix rounds F1 and F2): no string of COPY.home, the city rows'
   basis, the free doors or the locked cards prints a straight apostrophe, and the locked cities line begins with the free doors' own name. */
const straight: string[] = [];
const walkStrings = (v: unknown, path: string): void => { if (typeof v === "string") { if (v.includes("'")) straight.push(`${path}: ${v.slice(0, 40)}`); } else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkStrings(x, `${path}.${k}`); };
walkStrings(COPY.home, "COPY.home");
walkStrings(COPY.cityCards.plain, "COPY.cityCards.plain");
walkStrings(COPY.freeDoors, "COPY.freeDoors");
walkStrings(COPY.locked, "COPY.locked");
check(`the home's, the free doors' and the locked cards' words print curly apostrophes (${straight.length ? straight.join("; ") : "none straight"})`, straight.length === 0, "src/lib/spine/copy.ts", "write the typographic apostrophe (U+2019) in every string of COPY.home, COPY.cityCards.plain, COPY.freeDoors and COPY.locked");
check(`the locked card's line for the UK's cities begins with the free doors' name for them ("${COPY.locked.lines.cities}")`, COPY.locked.lines.cities.startsWith(COPY.freeDoors.cities) && !COPY.locked.lines.cities.includes("'"), "src/lib/spine/copy.ts", "COPY.locked.lines.cities begins with COPY.freeDoors.cities's string, the typographic apostrophe in it");

/* A DEPARTMENT'S TITLE IS SET AS EVERY SECTION TITLE ON A ZONE (the critique's P2.2 of plan 2026-10-10: one tracking for the h2 rung). */
const railTracking = /\[data-zone\] \.spine-card:not\(\[data-keep-card\]\) \[data-rail-title\] \{[^}]*letter-spacing:\s*(-?[\d.]+em)/.exec(read("src/app/globals.css"))?.[1] ?? "none";
const deptH2 = /<h2[^>]*className="([^"]*)"/.exec(read("src/components/spine/archetypes/Department.tsx"))?.[1] ?? "";
check(`a department's title takes the zone title's tracking, ${railTracking}, and no tracking-tight (read: ${deptH2 || "no Department.tsx"})`, railTracking === "-0.01em" && deptH2.includes(`tracking-[${railTracking}]`) && !/tracking-tight/.test(deptH2), "src/components/spine/archetypes/Department.tsx", "give Department's h2 tracking-[-0.01em], the letter-spacing globals.css gives every Rail title on a zone");

/* THE RENDER, where pages-fresh wrote it. */
const render = read(RENDER);
if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh), which renders home gb first in the chain");
else {
  const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "").replace(/<script[\s\S]*?<\/script>/g, "")).window.document;
  const main = doc.querySelector("main") ?? doc.body;
  const zones = [...main.querySelectorAll("[data-zone]")];
  const labels = zones.map((z) => z.getAttribute("data-zone-label") ?? "");
  check(`the render's zones run the search, the contents, then the band (${labels.join(" | ")})`, copyAt("contents.label") !== "" && copyAt("band.label") !== "" && JSON.stringify(labels.filter((l) => l !== COPY.home.pro.kicker)) === JSON.stringify([COPY.home.searchLabel, copyAt("contents.label"), copyAt("band.label")]), RENDER);
  const wides = zones.filter((z) => z.getAttribute("data-zone") === "wide");
  const band = doc.getElementById("band");
  check(`three full widths by name, the search, the contents and the band (${wides.map((z) => z.getAttribute("data-zone-label")).join(" | ") || "none"}), the band the one terracotta zone`, wides.length === 3 && !!wides[0].querySelector("[data-hero]") && !!wides[1].querySelector("[data-contents]") && wides[2] === band && band?.getAttribute("data-tone") === "terra" && main.querySelectorAll('[data-tone="terra"]').length === 1, RENDER);
  const searchEl = doc.getElementById("search");
  const pos = searchEl?.querySelector("[data-positioning]") ?? null;
  const h1El = searchEl?.querySelector("h1") ?? null;
  check(`the positioning line stands in the search before the question, in its own words, beside the mark, never in capitals ("${pos?.textContent?.trim() ?? ""}")`, !!pos && !!h1El && (pos.compareDocumentPosition(h1El) & 4) !== 0 && copyAt("positioning") !== "" && pos.textContent?.trim() === copyAt("positioning") && !!pos.querySelector("svg") && !/uppercase|tracking-/.test(pos.getAttribute("class") ?? ""), RENDER);
  /* THE HERO AS THE SERVER DRAWS IT (kept from the test this replaces): the h1 on set lines, the picker's case and its no-script fields. */
  const h1At = render.indexOf("<h1");
  const h1 = h1At < 0 ? "" : render.slice(h1At, render.indexOf("</h1>", h1At) + 5);
  const h1Text = h1.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  check(`the h1 reads as one question ("${h1Text}")`, h1Text === `${COPY.home.h1.lead} ${HERO_BUSINESSES[0]} ${COPY.home.h1.middle} ${HERO_CITIES[0]}?`, RENDER);
  check("the h1 stands on set lines: a phone's break after the lead, a break after the business, each word ending its line", /^<h1 [^>]*>How much does a <br class="sm:hidden"\/><span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="restaurant"[\s\S]*?<\/span><\/span><\/span> <br\/>make in <span class="text-atlas-700" data-founder-accent="">[\s\S]*?data-w="Shanghai\?"/.test(h1), RENDER);
  check("the \"?\" stands inside the city's slot against its word, no space before it", h1.includes(`>${HERO_CITIES[0]}<span class="text-[var(--c-ink)]">?</span></span>`) && !/<\/span>\s*\?/.test(h1), RENDER);
  const formAt = render.indexOf("<form");
  const formHtml = formAt < 0 ? "" : render.slice(formAt, render.indexOf("</form>", formAt) + 7);
  check("the picker paints the h1's first case on the first paint, and its no-script fields hold it", ["United Kingdom", "London", "Restaurants"].every((v) => formHtml.includes(`value="${v}"`)) && ['name="country" value="gb"', 'name="subdivision" value="london"', 'name="industry" value="restaurants"'].every((v) => formHtml.includes(v)), RENDER);
  check("the picker's labels read in sentence case, and its one action is the ink button", ["Country", "City", "Business"].every((l) => new RegExp(`<label for="[a-z]+" class="[^"]*">${l}</label>`).test(formHtml)) && !/uppercase|tracking-/.test(formHtml) && /<button type="submit"[^>]*class="[^"]*bg-\[var\(--c-ink\)\][^"]*">Show me the numbers /.test(formHtml), RENDER);
  check("the picker draws no examples' line and the page no definition line (the positioning line says what the site is)", !/<p data-try/.test(render) && !/data-definition/.test(render) && !(main.textContent ?? "").includes(COPY.home.definition), RENDER);
  /* One h1, one h2 a department (and Pro's where the switch is on in the render's environment), none skipped. */
  const count = (sel: string) => main.querySelectorAll(sel).length;
  const proOn = labels.includes(COPY.home.pro.kicker);
  check(`one h1 and one h2 a department, none skipped (h1 ${count("h1")}, h2 ${count("h2")} of ${6 + (proOn ? 1 : 0)}, h3 ${count("h3")})`, count("h1") === 1 && count("h2") === 6 + (proOn ? 1 : 0) && count("h3") === 0, RENDER);
  /* A PRO PRICE IS THE SITE'S OWN OFFER, NOT A STATISTIC (his decision of 2026-10-09): exempt only inside the Pro zone, as the band prints it. */
  const PRICES = [priceLine("year"), priceLine("month"), yearlyHeadline().replace(/ (?=\S+$)/, "\xa0")];
  const proZone = zones.find((z) => z.getAttribute("data-zone-label") === COPY.home.pro.kicker) ?? null;
  const figs = [...main.querySelectorAll(".fig")];
  const bare = figs.filter((f) => (!f.hasAttribute("data-src") || !f.hasAttribute("data-kind")) && !(proZone?.contains(f) && PRICES.includes(f.textContent ?? "")));
  check(`every figure says where it came from (${figs.length} figures, ${bare.length} without${bare.length ? `: ${bare.map((f) => JSON.stringify(f.textContent)).join(", ")}` : ""})`, bare.length === 0, RENDER, "give the figure its builder's prov (provAttrs, src/lib/spine/provenance.ts); a Pro price is exempt only as the plan prints it");
  const colophon = doc.getElementById("colophon");
  check("the colophon closes the page after the band: the licence line, Sources and licences, Report a mistake, the corrections log, status and the checked date, and no foot line beside it", !!colophon && !!band && (band.compareDocumentPosition(colophon) & 4) !== 0 && (colophon.textContent ?? "").includes(OGL_LINE) && !!colophon.querySelector(`a[href="${UK_SOURCES_FOOT.href}"]`) && !!colophon.querySelector('a[data-report="1"]') && !!colophon.querySelector('a[href="/corrections"]') && !!colophon.querySelector('a[href="/status"]') && !!colophon.querySelector('[data-checked="1"] time[datetime]') && main.querySelectorAll("[data-sources-foot]").length === 0, RENDER);
  /* THE TYPE FLOOR ON THE HOME (the spec's section 4: reader text 14 or larger, though the type-floor gate reads the spine pages): read as
     scripts/lib/type_floor.mjs reads (its blind spot is stated there); the home holds no chart and no 12px foot line, so it allows nothing. */
  const allow = new Set((JSON.parse(read("scripts/harness/type_floor_allow.json") || "[]") as Array<{ key: string }>).map((e) => e.key));
  const tf = readTypeFloor(doc, allow);
  check(`no reader text under 14px on the home, and no 12px place to allow (${tf.small} small and ${tf.allowed} allowed of ${tf.chars} characters${tf.runs.length ? `; ${tf.runs.slice(0, 4).map(([at, c]: [string, number]) => `${at} ${c}`).join("; ")}` : ""})`, tf.chars > 0 && tf.small === 0 && tf.allowed === 0, RENDER, "set every line of the home at var(--t-body) or larger: the colophon's licence line is 14 too, so nothing on the home needs an allowance");
  check("no retired section is on the home", !/id="(answer|years|trades|duel|kitchens|firms-last|new-companies|us-restaurants|how-made|place|pays|joins|archive|tax|record|cities|next)"/.test(render) && !/data-notebook|data-next=/.test(render), RENDER);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/home_shape: all pass");
```

- [ ] **Step 2: The gate's comment.** In `scripts/prebuild_all.ts` the line `  /* The home as an introduction (his yes of 2026-10-09; plan 2026-10-09, home introduction): the hero (his h1, still, the picker with no heading, its examples links, the definition), the worked example, (Pro), the three proofs, the UK's cities beside where to next; no counts, no newsletter band, nothing the plan re-homed. */` becomes `  /* The home, quiet editorial (his choice of 2026-10-13; plan 2026-10-13 home-quiet-editorial): the positioning line above his h1 and the picker that follows it, the contents, (Pro), the band, the colophon; three seats; nothing the reform retired; every figure stamped; no reader text under 14px. Reads the home's render, which pages-fresh writes first. */`.

- [ ] **Step 3: Run it to see it red.** `node node_modules/tsx/dist/cli.mjs tests/trust/home_shape.test.ts > scratchpad/home-qe/t1a.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t1a.txt` (after RENDER, so the render is today's). Expected: exit 1; red on the zone order, the splits, the contents zone, the band, the seats, the positioning line (source and render), HomeAsk (source), the colophon (source and render), the retired names (HomePlace, HomeProofs, HomeRecord, CityRows, WhereNext and more), Department's tracking (no file), the render's zones and wide zones, the examples' line, the h2 count (8 today), the type floor and the retired ids; PASS on the live home, the picker's heading, the h1's first words, the structured data, the apostrophes, the locked cities line, the h1's text, set lines and "?", the first paint, the labels and the figures' stamps.

- [ ] **Step 4: Commit.** `tests/trust/home_shape.test.ts`, `scripts/prebuild_all.ts`; message `home:shape-red: home_shape holds the quiet editorial home (search with the positioning line and HomeAsk, contents, Pro, band, colophon; three seats; no retired section; the type floor), red on today's render (plan 2026-10-13 home-quiet-editorial, Task 1A)`.

---

### Task 1B: the contents and the band, tested first, red on today's code

**Files:**
- Create: `tests/home/contents.test.ts`, `tests/home/band.test.ts`
- Modify: `scripts/prebuild_all.ts` (two entries after `home-shape`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: the interfaces of Tasks 4A, 4B and 5, exactly as named there: from `src/lib/home/contents.ts` `DEPARTMENT_ORDER`, `MEMBERS_MAX`, `ABOUT_THE_FIGURES`, `buildContents()`, `contentsCountries(broadest?)`, `contentsCities(cards?)`, `contentsTrades(slugs?)`, `contentsTools()`, `contentsReading(posts?, tracksHeld?)`, `contentsMethod()`, `tradeOwnFigure(id)`; from `src/lib/home/list_counts.ts` `holdsListCount`; `Department` and its `DepartmentRow`; `HomeContents.tsx`'s six literal Boxes; `HomeBand`; the CSS tokens `--terra-full`, `--band-ink`, the class `.ma-mono`.
- Produces: gates `home-contents` and `home-band`.

- [ ] **Step 1: Write `tests/home/contents.test.ts`:**

```ts
/**
 * THE ATLAS AS A CONTENTS PAGE (plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Tasks 1B, 4A and 4B; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3). Six numbered departments in one section,
 * each its number, its marks, a title of four words or fewer, one line of twelve words or fewer, at most four members and its door. Holds:
 *  - THE RULES, recomputed here from the modules each rule names and never from the builder's own reading: 01 the countries held to the
 *    registers, then the world page's broadest; 02 the cities held to sources, each with its own figure and small photograph; 03 rule 32's
 *    trades whose world net is their own, each printing its industry page's answer; 04 the four tools; 05 the tracks that hold an article
 *    and the newest post whose title counts nothing; 06 the method's three pages and About the figures;
 *  - THIN STATES (Review Focus 3): each builder fed an empty or odd source draws fewer rows, never a placeholder, and keeps its door;
 *  - A TRADE'S OWN FIGURE (Review Focus 4): a trade whose net is its sector profile's residual is left out, never printed as the trade's;
 *  - A POST THAT COUNTS (Review Focus 5): the reading department passes over a title holding a list count;
 *  - THE ANATOMY: the Department archetype as it renders, HomeContents' six literal sections, the marks in ink, the home's render;
 *  - THE SMALL COPIES the cities department draws, their crops and the root route's closure (moved from tests/home/foot.test.ts, which
 *    retires with the home's foot in Task 7A);
 *  - every member and door lands on a page the edge serves; the learn page holds each track's anchor; the trade-set gate's registry.
 * Every module this plan creates is loaded with import(), and a missing one is a red, so the file runs before the code it holds exists.
 * BLIND SPOT, stated: edgeNotFound is the edge's answer, so a route that answers notFound() after the edge lets an address through reads as
 * a page here (the production probe after a push is that instrument); a photograph is held to its file and crop, not to what a reader sees
 * (the photographs of Task 9 are).
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/contents.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { posix } from "node:path";
import { JSDOM } from "jsdom";
import { COUNTRIES, INDUSTRIES, INDUSTRY_BY_ID, industryToSlug, slugToIndustry, tradeRowName } from "../../src/lib/taxonomy";
import { countryHeldToRegisters, cityHeldToSources } from "../../src/lib/uk/registers/register_city";
import { countryPageTarget } from "../../src/lib/geo/page_targets";
import { getCoverageReport } from "../../src/lib/quality/coverage-report";
import { getCoverageRows } from "../../src/lib/coverage/report";
import { buildWorldAtlas } from "../../src/lib/scores/world_atlas";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { cityThumb } from "../../src/lib/cities/city_images";
import { EVERYDAY_TRADES } from "../../src/lib/spine/adapt_city";
import { industryHeroFacts } from "../../src/lib/spine/industry_hero_facts";
import { resolveTradeNet } from "../../src/lib/spine/trade_net";
import { LEARN_BY_FAMILY } from "../../src/lib/learn/articles";
import { getAllPosts } from "../../src/lib/blog";
import { SHEET_TRUST } from "../../src/lib/nav";
import { UK_SOURCES_FOOT } from "../../src/lib/spine/uk_sources";
import { DOOR_ARROW } from "../../src/lib/spine/door_look";
import { edgeNotFound } from "../../src/lib/routing/edge_not_found";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-contents";
const BUILDER = "src/lib/home/contents.ts";
const DEPT_FILE = "src/components/spine/archetypes/Department.tsx";
const HC = "src/components/spine/home/HomeContents.tsx";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = "build the six departments as plan 2026-10-13 Tasks 4A and 4B give them: each member from its rule read from the code, at most four, none padded, every door kept, a trade row printing its industry page's own figure";
const ORDER = ["countries", "cities", "trades", "tools", "reading", "method"] as const;
let failed = 0;
const check = (label: string, ok: boolean, file = BUILDER, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
/** A COPY.home string by its path, or "" until its task lands it. */
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };

/** A JPEG's width and height, read from its first start-of-frame marker (moved from tests/home/foot.test.ts; no image library). */
function jpegSize(path: string): { width: number; height: number } | null {
  const b = readFileSync(path);
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

/** The files a module reaches by static import or re-export, each with whether it carries "use client" (moved from tests/home/foot.test.ts;
 *  a static walk of the source: it cannot see an import() call). */
function reaches(entry: string): Array<{ file: string; client: boolean }> {
  const seen = new Map<string, boolean>();
  const resolveSpec = (from: string, spec: string): string | null => {
    const base = spec.startsWith("@/") ? posix.join("src", spec.slice(2)) : spec.startsWith(".") ? posix.join(posix.dirname(from), spec) : null;
    if (!base) return null;
    return [base, `${base}.tsx`, `${base}.ts`, `${base}/index.tsx`, `${base}/index.ts`].find((c) => /\.tsx?$/.test(c) && existsSync(c)) ?? null;
  };
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    const text = stripCommentLines(readFileSync(file, "utf8").split("\n")).join("\n");
    seen.set(file, /^\s*["']use client["']/.test(text));
    for (const m of text.matchAll(/(?:^|[\n;])\s*(?:import|export)\s+(type\s+)?([^;"']*?)\s*from\s*["']([^"']+)["']|(?:^|[\n;])\s*import\s*["']([^"']+)["']/g)) {
      if (m[1]) continue;
      const named = m[2] === undefined ? null : /^\{([\s\S]*)\}$/.exec(m[2].trim());
      if (named) { const specs = named[1].split(",").map((s) => s.trim()).filter(Boolean); if (specs.length > 0 && specs.every((s) => /^type\s/.test(s))) continue; }
      const to = resolveSpec(file, m[3] ?? m[4]);
      if (to) walk(to);
    }
  };
  walk(entry);
  return [...seen].map(([file, client]) => ({ file, client }));
}

async function main(): Promise<void> {
  /* ---------------- THE RULES (Task 4A) ---------------- */
  const B = await import("../../src/lib/home/contents").catch(() => null);
  check("the contents builder is there", !!B, BUILDER, "create src/lib/home/contents.ts as plan 2026-10-13 Task 4A gives it");
  if (B) {
    const contents = B.buildContents();
    check(`six departments in their order, numbered 01 to 06 (${B.DEPARTMENT_ORDER.join(", ")}), at most ${B.MEMBERS_MAX} members each`, JSON.stringify(B.DEPARTMENT_ORDER) === JSON.stringify(ORDER) && B.MEMBERS_MAX === 4 && ORDER.every((k, i) => contents[k].key === k && contents[k].index === String(i + 1).padStart(2, "0")));
    for (const k of ORDER) {
      const d = contents[k];
      check(`${d.index} ${d.title}: a title of four words or fewer and one plain line of twelve or fewer ("${d.line}")`, words(d.title) >= 1 && words(d.title) <= 4 && words(d.line) <= 12 && /^[A-Z]/.test(d.line) && d.line.endsWith(".") && !/[;\u2014\u2013]/.test(d.title + d.line) && !/\b(we|our|modelled|withheld)\b|on file/i.test(`${d.title} ${d.line}`), "src/lib/spine/copy.ts");
      check(`${d.index} ${d.title}: at most four members, none padded (${d.members.length}: ${d.members.map((m) => m.name).join(", ") || "none"})`, d.members.length <= 4 && d.members.every((m) => m.key !== "" && m.name.trim() !== "" && m.href.startsWith("/")));
      check(`${d.index} ${d.title}: its door, "${d.door.label}" to ${d.door.href}`, d.door.label.trim() !== "" && d.door.href.startsWith("/"));
    }
    /* 01: held to the registers first, then the world page's "where the map goes furthest", as /world builds it. */
    const report = getCoverageReport();
    const deepest = buildWorldAtlas({ ...report, countries: getCoverageRows() } as Parameters<typeof buildWorldAtlas>[0], new Set(COUNTRIES.map((c) => c.code)), (iso2) => COUNTRIES.find((c) => c.code === iso2)?.name || iso2, report?.totals?.industries_covered ?? 0).deepest.map((c) => c.iso2);
    const wantCountries = [...new Set([...COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).map((c) => c.code), ...deepest])].filter((c) => countryPageTarget(c)).slice(0, 4);
    check(`01: the countries held to the registers, then the world page's broadest, each with a page (${contents.countries.members.map((m) => m.key).join(", ")}; recomputed ${wantCountries.join(", ")})`, JSON.stringify(contents.countries.members.map((m) => m.key.toUpperCase())) === JSON.stringify(wantCountries) && contents.countries.members.every((m) => m.mark.kind === "flag" && m.figure === null && m.href === countryPageTarget(m.key)?.href && m.name === countryPageTarget(m.key)?.label));
    /* 02: the cities held to sources, largest metro first, each printing its own figure on its page and holding its small photograph. */
    const wantCities = COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).flatMap((c) => (buildCityCards(c.code)?.cards ?? []).filter((card) => cityHeldToSources(c.code, card.id) && typeof card.payUsd === "number" && !!cityThumb(card.id)).map((card) => card.id)).slice(0, 4);
    check(`02: the cities held to sources, largest first, each with its own figure and small photograph, names only (${contents.cities.members.map((m) => m.key).join(", ")}; recomputed ${wantCities.join(", ")})`, JSON.stringify(contents.cities.members.map((m) => m.key)) === JSON.stringify(wantCities) && contents.cities.members.every((m) => m.mark.kind === "photo" && m.figure === null && m.href === `/cities/${m.key}`));
    /* 03: rule 32's trades in its order whose world net is the trade's own (the shard branch), each the industry page's answer. */
    const everyday = [...new Set([...EVERYDAY_TRADES].map((s) => slugToIndustry(s)?.id).filter((x): x is string => !!x))];
    const wantTrades = everyday.filter((id) => resolveTradeNet(id, { moneyShown: false, netMarginPct: null })?.branch === "shard").slice(0, 4);
    check(`03: rule 32's trades in its order whose world net is the trade's own (${contents.trades.members.map((m) => m.key).join(", ")}; recomputed ${wantTrades.join(", ")})`, JSON.stringify(contents.trades.members.map((m) => m.key)) === JSON.stringify(wantTrades));
    for (const m of contents.trades.members) {
      const answer = industryHeroFacts(m.key)?.answer?.value;
      check(`03 ${m.name}: the industry page's own figure, "${m.figure?.text}" against its answer "${answer}", stamped from the trade's shard`, !!m.figure && m.figure.text === answer && m.figure.prov.src === `facts/industry/${m.key}.json:margin_ladder.net_margin_pct` && m.figure.prov.kind === "estimate" && m.name === tradeRowName(m.key, INDUSTRY_BY_ID[m.key]?.name ?? "") && m.href === `/industries/${industryToSlug(m.key)}` && m.mark.kind === "pictogram");
    }
    const profileId = INDUSTRIES.map((i) => i.id).find((id) => resolveTradeNet(id, { moneyShown: false, netMarginPct: null })?.branch === "profile" && slugToIndustry(industryToSlug(id))?.id === id);
    const viaProfile = profileId ? B.contentsTrades([industryToSlug(profileId)]) : null;
    check(`a trade whose net is its sector's residual is left out, never printed under its name (${profileId ?? "no such trade found"}: ${viaProfile ? viaProfile.members.length : "not run"} member(s), figure ${profileId ? JSON.stringify(B.tradeOwnFigure(profileId)) : "none"})`, !!profileId && !!viaProfile && viaProfile.members.length === 0 && B.tradeOwnFigure(profileId) === null && viaProfile.door.href === "/industries");
    /* 04, 05, 06. */
    check("04: the four tools, Decide, Check, Calculator and Compare, each to its page", JSON.stringify(contents.tools.members.map((m) => [m.name, m.href])) === JSON.stringify([["Decide", "/decide"], ["Check", "/check"], ["Calculator", "/calculator"], ["Compare", "/compare"]]) && contents.tools.members.every((m) => m.mark.kind === "icon" && m.figure === null));
    const L = await import("../../src/lib/home/list_counts").catch(() => null);
    check("the count words are there (src/lib/home/list_counts.ts, Task 1C)", !!L, "src/lib/home/list_counts.ts");
    const tracksHeld = (["A", "B", "C"] as const).filter((f) => LEARN_BY_FAMILY(f).length > 0);
    const newest = L ? getAllPosts().find((p) => p.title.trim() !== "" && !L.holdsListCount(p.title)) : undefined;
    const wantReading = [...tracksHeld.map((f) => `/learn#track-${f}`), ...(newest ? [`/blog/${newest.slug}`] : [])];
    check(`05: the knowledge base's tracks that hold an article, then the newest post whose title counts nothing (${contents.reading.members.map((m) => m.href).join(", ")}; recomputed ${wantReading.join(", ")})`, JSON.stringify(contents.reading.members.map((m) => m.href)) === JSON.stringify(wantReading));
    const counted = B.contentsReading([{ slug: "a", title: "The 12 cities where rent fell" }, { slug: "b", title: "What a pharmacy keeps" }], () => false);
    check(`a post whose title counts a list is passed over for the next (${counted.members.map((m) => m.href).join(", ") || "none"})`, counted.members.map((m) => m.href).join() === "/blog/b");
    const about = SHEET_TRUST.find((n) => n.href.startsWith("/about-data"));
    check("06: Sources and licences, the corrections log, the coverage report; its door About the figures, the sheet's own name and address for it", JSON.stringify(contents.method.members.map((m) => m.href)) === JSON.stringify([UK_SOURCES_FOOT.href, "/corrections", "/coverage"]) && contents.method.members[0]?.name === UK_SOURCES_FOOT.link && !!about && contents.method.door.label === about.label && contents.method.door.href === about.href && B.ABOUT_THE_FIGURES.label === about.label && B.ABOUT_THE_FIGURES.href === about.href);
    /* THIN AND ODD STATES (Review Focus 3). */
    const thinC = B.contentsCountries([]);
    check(`a world with no coverage keeps the countries held to the registers and the door (${thinC.members.map((m) => m.key).join(", ")})`, thinC.members.map((m) => m.key).join() === "gb" && thinC.door.href === "/countries");
    const oddC = B.contentsCountries(["GB", "XX", "gb", "FR"]);
    check(`a country twice, or one with no page, is drawn once or not at all (${oddC.members.map((m) => m.key).join(", ")})`, oddC.members.map((m) => m.key).join() === "gb,fr");
    check(`a long list is cut at four (${B.contentsCountries(COUNTRIES.map((c) => c.code)).members.length})`, B.contentsCountries(COUNTRIES.map((c) => c.code)).members.length === 4);
    const london = buildCityCards("GB")?.cards.find((c) => c.id === "london");
    const thinCity = B.contentsCities([]);
    const noPay = london ? B.contentsCities([{ iso2: "GB", card: { ...london, payUsd: undefined } }]) : null;
    const unheld = london ? B.contentsCities([{ iso2: "GB", card: { ...london, id: "atlantis" } }]) : null;
    check("no city card, a city with no figure of its own, or a city no source holds leaves the department its door and no such row (the photograph's condition is the recomputed rule's, above)", thinCity.members.length === 0 && thinCity.door.href === "/cities" && !!noPay && noPay.members.length === 0 && !!unheld && unheld.members.length === 0);
    const thinT = B.contentsTrades([]);
    const oddT = B.contentsTrades(["restaurants", "restaurants", "no-such-trade"]);
    check(`no trade leaves the door alone; a trade twice or no trade at all is drawn once or not at all (${oddT.members.map((m) => m.key).join(", ")})`, thinT.members.length === 0 && thinT.door.href === "/industries" && oddT.members.length <= 1 && oddT.members.every((m) => m.key === "restaurants"));
    const thinR = B.contentsReading([], () => false);
    check("no track with an article and no post leaves the reading department its door alone", thinR.members.length === 0 && thinR.door.href === "/learn");
    /* EVERY MEMBER AND DOOR LANDS. */
    const hrefs = ORDER.flatMap((k) => [...contents[k].members.map((m) => m.href), contents[k].door.href]);
    const nowhere = hrefs.filter((h) => edgeNotFound(h.split("#")[0]));
    check(`every member and door lands on a page the edge serves (${hrefs.length} read${nowhere.length ? `; nowhere: ${nowhere.join(", ")}` : ""})`, hrefs.length >= 12 && nowhere.length === 0);
    (globalThis as unknown as { React: typeof React }).React = React;
    const { default: LearnHub } = await import("../../src/app/(site)/learn/page");
    const learn = renderToStaticMarkup(React.createElement(LearnHub));
    const anchors = contents.reading.members.filter((m) => m.href.startsWith("/learn#")).map((m) => m.href.split("#")[1]);
    check(`the learn page holds each track's anchor (${anchors.join(", ") || "none"})`, anchors.every((a) => learn.includes(`id="${a}"`)), "src/app/(site)/learn/page.tsx");
    const names = ORDER.flatMap((k) => contents[k].members.map((m) => m.name));
    const counting = L ? names.filter((n) => L.holdsListCount(n)) : names;
    check(`no member's name counts a list (${counting.join(" | ") || "none"})`, counting.length === 0);
    const tradeSet = (JSON.parse(read("scripts/gates.json") || "{\"gates\":[]}") as { gates: Array<{ name: string; reads?: string[] }> }).gates.find((g) => g.name === "trade-set");
    check(`the registry lists src/lib/home/contents.ts among the trade-set gate's reads (${(tradeSet?.reads ?? []).join(", ") || "no reads"})`, !!tradeSet && (tradeSet.reads ?? []).includes(BUILDER) && !(tradeSet.reads ?? []).includes("src/lib/home/destination.ts"), "scripts/verify_trade_set.ts", "name src/lib/home/contents.ts as a path literal in scripts/verify_trade_set.ts (HOME_TRADES_FILE), then run node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write");

    /* ---------------- THE ANATOMY (Task 4B) ---------------- */
    const D = await import("../../src/components/spine/archetypes/Department").catch(() => null);
    check("the Department archetype is there", !!D, DEPT_FILE, "create it as plan 2026-10-13 Task 4B gives it");
    if (D) {
      const prov = { src: "facts/industry/restaurants.json:margin_ladder.net_margin_pct", kind: "estimate" as const };
      const props = { dept: "trades", index: "03", title: "Trades", line: "What each trade keeps from its sales, after all costs.", door: { label: "Every trade", href: "/industries" } };
      const html = renderToStaticMarkup(React.createElement(D.Department, { ...props, rows: [{ key: "a", href: "/industries/a", name: "Alpha", mark: React.createElement("span", null, "m"), figure: { text: "7%", unit: "of sales kept", prov } }, { key: "b", href: "/industries/b", name: "Beta", mark: React.createElement("span", null, "m"), figure: null }] }));
      const doc = new JSDOM(`<!doctype html><body>${html}</body>`).window.document;
      const root = doc.querySelector('[data-archetype="department"]');
      const index = root?.querySelector("[data-dept-index]");
      check("the form stamps its archetype and department, its index muted in the figures' face, hidden from a screen reader, no figure class", !!root && root.getAttribute("data-dept") === "trades" && index?.textContent === "03" && index.getAttribute("aria-hidden") === "true" && /tabular-nums/.test(index.className) && /text-\[var\(--c-muted\)\]/.test(index.className) && !/\bfig\b/.test(index.className), DEPT_FILE);
      check("its title an h2 the zones' title rule reads, its one line under it, marked a line", root?.querySelector("h2[data-rail-title]")?.textContent === "Trades" && root?.querySelectorAll("p").length === 1 && root?.querySelector("p[data-dept-line][data-line]")?.textContent === props.line, DEPT_FILE);
      const rowsEls = [...(root?.querySelectorAll("a[data-member]") ?? [])];
      const door = root?.querySelector("a[data-dept-all]");
      const arrows = [...(root?.querySelectorAll('span[aria-hidden="true"]') ?? [])].filter((s) => s.textContent === "\u2192");
      check(`each member one shape: a link 44 tall, its mark hidden, its name, the door's arrow at its end; the door last (${rowsEls.length} rows, ${arrows.length} arrows)`, rowsEls.length === 2 && rowsEls.every((r) => /\bmin-h-11\b/.test(r.className) && r.querySelector('[data-member-mark][aria-hidden="true"]') && r.querySelector("[data-member-name]")) && arrows.length === 3 && arrows.every((a) => a.className === DOOR_ARROW) && door?.getAttribute("href") === "/industries" && (door.textContent ?? "").includes("Every trade") && /\bmin-h-11\b/.test(door.className) && root?.querySelector("li:last-child a") === door, DEPT_FILE);
      const fig = rowsEls[0]?.querySelector(".fig");
      check("a trade row's figure is stamped and says its unit to a screen reader; a row without one draws none", fig?.textContent === "7%" && fig.getAttribute("data-src") === prov.src && fig.getAttribute("data-kind") === "estimate" && rowsEls[0]?.querySelector(".sr-only")?.textContent === " of sales kept" && !rowsEls[1]?.querySelector(".fig"), DEPT_FILE);
      check("no terracotta anywhere in the form", !/terra|atlas-\d/.test(html), DEPT_FILE);
      const none = new JSDOM(`<!doctype html><body>${renderToStaticMarkup(React.createElement(D.Department, { ...props, rows: [] }))}</body>`).window.document;
      check("a department with no member draws its number, title, line and door, and no row (Review Focus 3)", !!none.querySelector("h2") && !!none.querySelector("[data-dept-line]") && none.querySelectorAll("a[data-member]").length === 0 && !!none.querySelector("a[data-dept-all]"), DEPT_FILE);
    }
    const hc = stripCommentLines(read(HC).split("\n")).join("\n");
    const boxes = [...hc.matchAll(/<Box id="(dept-[a-z]+)" className="flex flex-col">\s*<Department \{\.\.\.dept\("([a-z]+)"\)\} \/>\s*<\/Box>/g)].map((m) => [m[1], m[2]]);
    check(`six literal sections, each one department, in the order (${boxes.map(([id]) => id).join(", ") || "none"})`, JSON.stringify(boxes) === JSON.stringify(ORDER.map((k) => [`dept-${k}`, k])), HC, "write each department's Box on its own line in HomeContents.tsx: the census reads a Box's id from its literal");
    check("the grid: one column, two from 768, three from 1024, hairlines between departments, no sm: pairing", /md:grid-cols-2/.test(hc) && /lg:grid-cols-3/.test(hc) && /\[&>\*\+\*\]:border-t/.test(hc) && !/\bsm:grid-cols/.test(hc), HC);
    check("the marks: a flag, the city's small photograph in grey with no wash, a pictogram or an icon in ink (ma-mono)", /<CountryFlag iso2=\{mark\.iso2\} \/>/.test(hc) && /<DuotonePhoto [^>]*tint=\{false\}/.test(hc) && (hc.match(/className="ma-mono text-\[var\(--c-ink2\)\]"/g) ?? []).length === 2, HC);
    const css = read("src/app/globals.css");
    check("a glyph marked ma-mono draws its accent in its own ink, not the terracotta", /\.spine-scope \.ma-glyph\.ma-mono \.a \{\s*stroke: currentColor;\s*\}/.test(css) && /\.spine-scope \.ma-glyph\.ma-mono \.af \{\s*fill: currentColor;\s*stroke: none;\s*\}/.test(css), "src/app/globals.css");
    const render = read(RENDER);
    if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh)");
    else {
      const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
      const zone = [...doc.querySelectorAll("main [data-zone]")].find((z) => z.getAttribute("data-zone-label") === copyAt("contents.label"));
      const blocks = zone ? [...zone.querySelectorAll("[data-block]")].map((b) => b.getAttribute("data-block")) : [];
      check(`the contents zone is one full width holding the six departments in order (${blocks.join(", ") || "none"})`, !!zone && zone.getAttribute("data-zone") === "wide" && JSON.stringify(blocks) === JSON.stringify(ORDER.map((k) => `dept-${k}`)), RENDER);
      for (const k of ORDER) {
        const box = doc.getElementById(`dept-${k}`);
        const d = contents[k];
        const rowsEls = box ? [...box.querySelectorAll("a[data-member]")] : [];
        check(`${d.index} ${d.title} as drawn: its number, its title, ${d.members.length} row(s) as built, its door`, !!box && box.querySelector("[data-dept-index]")?.textContent === d.index && box.querySelector("h2")?.textContent === d.title && rowsEls.length === d.members.length && rowsEls.every((r, i) => r.getAttribute("href") === d.members[i].href) && box.querySelector("a[data-dept-all]")?.getAttribute("href") === d.door.href, RENDER);
      }
    }
  }

  /* ---------------- THE SMALL COPIES (moved from tests/home/foot.test.ts; the critique's P1.11, the ship audit's 3.3) ---------------- */
  const THUMBS = "public/cities/thumbs";
  const THUMBS_REMEDY = "run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs, then node node_modules/tsx/dist/cli.mjs scripts/gen_served_files.ts, and commit public/cities/thumbs with the manifest and src/lib/routing/served_files.ts";
  const photos = readdirSync("public/cities").filter((f) => /^[a-z0-9-]+\.jpe?g$/i.test(f));
  const copies = photos.map((f) => { const path = `${THUMBS}/${f}`; const held = existsSync(path); return { f, bytes: held ? statSync(path).size : 0, dims: held ? jpegSize(path) : null }; });
  const total = copies.reduce((s, c) => s + c.bytes, 0);
  check(`every city photograph has its small copy, 480 by 360 (${copies.filter((c) => c.dims?.width === 480 && c.dims?.height === 360).length} of ${photos.length})`, photos.length > 0 && copies.every((c) => c.dims?.width === 480 && c.dims?.height === 360), THUMBS, THUMBS_REMEDY);
  check(`each under 50,000 bytes and all under 200,000 (${total.toLocaleString("en-US")} in all)`, copies.every((c) => c.bytes > 0 && c.bytes < 50_000) && total < 200_000, THUMBS, THUMBS_REMEDY);
  const manifest = JSON.parse(read("data/cities/images_manifest.json") || "{\"cities\":{}}") as { cities: Record<string, { file: string; thumb?: string; position?: string }> };
  const MANIFEST = "data/cities/images_manifest.json";
  const MANIFEST_REMEDY = "give each city a position in data/cities/images_credits.json, then run node node_modules/tsx/dist/cli.mjs scripts/build_city_images_manifest.ts --thumbs; never edit the manifest by hand";
  const entries = Object.entries(manifest.cities);
  check(`the manifest names each small copy and its crop (${entries.length} cities)`, entries.length === photos.length && entries.every(([slug, e]) => e.thumb === `/cities/thumbs/${e.file.split("/").pop()}` && /^\d{1,3}% \d{1,3}%$/.test(e.position ?? "") && cityThumb(slug)?.src === e.thumb && cityThumb(slug)?.position === e.position), MANIFEST, MANIFEST_REMEDY);
  const credits = JSON.parse(read("data/cities/images_credits.json") || "{\"photos\":{}}") as { photos: Record<string, { position?: string }> };
  const apart = entries.filter(([slug, e]) => credits.photos[slug.toLowerCase()]?.position !== e.position).map(([slug]) => slug);
  check(`each city's crop in the manifest is the credits file's${apart.length ? `; apart: ${apart.join(", ")}` : ""}`, apart.length === 0, MANIFEST, MANIFEST_REMEDY);
  const PARTS = "src/components/spine/archetypes/CityParts.tsx";
  const clients = reaches(PARTS).filter((r) => r.client).map((r) => r.file);
  check(`CityParts.tsx, the photograph's recipe the contents draw, is a server module and reaches no client module${clients.length ? `; client: ${clients.join(", ")}` : ""}`, clients.length === 0, PARTS, "keep CityParts.tsx free of a \"use client\" directive and of any import that reaches a client module");
  const PAGER = "src/components/spine/archetypes/CityCards.tsx";
  const rootReach = [...reaches("src/app/layout.tsx"), ...reaches("src/app/page.tsx")];
  check("the root route's static import closure holds no pager (CityCards.tsx), and CityCards re-exports no DuotonePhoto", !rootReach.some((r) => r.file === PAGER) && !/export\s*\{\s*DuotonePhoto\s*\}/.test(read(PAGER)), "src/app/page.tsx", "import DuotonePhoto from \"@/components/spine/archetypes/CityParts\", never from CityCards.tsx");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/contents: all pass");
}

main().catch((e) => { red({ rule: RULE, file: BUILDER, detail: `the contents test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
```

- [ ] **Step 2: Write `tests/home/band.test.ts`:**

```ts
/**
 * THE BAND, ONE SOLID STATEMENT (plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Tasks 1B and 5; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 4; his decision of 2026-10-13: "one solid
 * statement: full-width brand terracotta at full strength, white type, one sentence, a link to the method"). Holds: the band a zone and
 * never a card, its one sentence and its one link and nothing else, no figure and no digit; the sentence true of the site, in the four words
 * the provenance stamp and About the figures use for how a figure is made; the colour the token --terra-full and the words --band-ink, white
 * at AA on it, ink on paper in print; the page laws reading the band's colour from the token; the render's one terracotta zone after the
 * contents and before the colophon. HomeBand loads with import(), so the file runs before it exists and reds.
 * BLIND SPOT, stated: the contrast is computed from the tokens as written, not from pixels; check_readability measures the render.
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/band.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { COPY } from "../../src/lib/spine/copy";
import { SHEET_TRUST } from "../../src/lib/nav";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-band";
const BAND = "src/components/spine/home/HomeBand.tsx";
const CSS = "src/app/globals.css";
const COPYF = "src/lib/spine/copy.ts";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const REMEDY = "draw the band as plan 2026-10-13 Task 5 gives it: one zone on [data-tone=\"terra\"], one sentence and one link to About the figures, no figure and no digit, on --terra-full in --band-ink";
let failed = 0;
const check = (label: string, ok: boolean, file = BAND, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const read = (f: string) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const copyAt = (path: string): string => { let v: unknown = COPY.home; for (const k of path.split(".")) v = v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined; return typeof v === "string" ? v : ""; };
const follows = (a: Element | null, b: Element | null) => !!a && !!b && (a.compareDocumentPosition(b) & 4) !== 0;

async function main(): Promise<void> {
  const line = copyAt("band.line");
  const label = copyAt("band.label");
  check(`the band's words are one plain sentence of twelve words or fewer, no digit ("${line}")`, line !== "" && label !== "" && line.trim().split(/\s+/).length <= 12 && /^[A-Z]/.test(line) && line.endsWith(".") && (line.match(/[.!?]/g) ?? []).length === 1 && !/[;\u2014\u2013]/.test(line) && !/\b(we|our|modelled|withheld)\b|on file/i.test(line) && !/\d/.test(line), COPYF);
  const kinds = [...(/export type ProvenanceKind = ([^;]+);/.exec(read("src/lib/spine/provenance.ts"))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  check(`it names the four kinds a figure is, as the provenance stamp names them (${kinds.join(", ") || "none read"})`, kinds.length === 4 && kinds.every((k) => line.toLowerCase().includes(k === "estimate" ? "estimat" : k)), COPYF, "say how every figure is made in the stamp's four words: counted, worked out, looked up, estimated");
  (globalThis as unknown as { React: typeof React }).React = React;
  const { default: AboutDataPage } = await import("../../src/app/(site)/about-data/page");
  const aboutHtml = renderToStaticMarkup(React.createElement(AboutDataPage));
  const at = aboutHtml.indexOf('id="reading"');
  const reading = at < 0 ? "" : aboutHtml.slice(at, aboutHtml.indexOf("<h2", at + 1)).replace(/<[^>]+>/g, " ");
  check("the page its link opens, About the figures' #reading, names the same four kinds", at > 0 && ["Counted", "Worked out", "Looked up", "Estimate"].every((w) => reading.includes(w)), "src/app/(site)/about-data/page.tsx", "keep #reading's four kinds on About the figures");
  const about = SHEET_TRUST.find((n) => n.href.startsWith("/about-data"));
  const B = await import("../../src/components/spine/home/HomeBand").catch(() => null);
  check("HomeBand is there", !!B);
  if (B) {
    const doc = new JSDOM(`<!doctype html><body>${renderToStaticMarkup(React.createElement(B.HomeBand))}</body>`).window.document;
    const root = doc.body.firstElementChild;
    check("a zone, never a card: one level, one cell, on the terracotta tone, labelled by its sentence", root?.tagName === "SECTION" && root.getAttribute("data-zone") === "wide" && root.getAttribute("data-tone") === "terra" && root.id === "band" && root.getAttribute("aria-labelledby") === "band-line" && root.getAttribute("data-zone-label") === label && root.querySelectorAll(":scope > [data-zone-level] > [data-zone-cell]").length === 1 && !root.querySelector("[data-card], [data-block]"));
    const ps = root ? [...root.querySelectorAll("p")] : [];
    const links = root ? [...root.querySelectorAll("a")] : [];
    check(`one sentence and one link to the method, nothing else (${ps.length} paragraph(s), ${links.length} link(s), no heading)`, ps.length === 1 && ps[0].id === "band-line" && ps[0].textContent === line && links.length === 1 && !!about && links[0].getAttribute("href") === about.href && (links[0].textContent ?? "").includes(about.label) && !root?.querySelector("h1, h2, h3, h4"));
    check("no figure and no digit on the band", !!root && !root.querySelector(".fig") && !/\d/.test(root.textContent ?? ""));
  }
  const src = read(BAND);
  check("its words are the band's ink and nothing else: no ink, grey, red or figure of their own", /text-\[var\(--band-ink\)\]/.test(src) && !/--c-ink\b|--c-ink2|--c-muted|--terra-text|text-atlas-|<Fig\b/.test(src));
  const css = read(CSS);
  const terraBlock = /\[data-zone\]\[data-tone="terra"\] \{([^}]*)\}/.exec(css)?.[1] ?? "";
  const printBlock = /@media print \{\s*\[data-zone\]\[data-tone="terra"\] \{([^}]*)\}/.exec(css)?.[1] ?? "";
  const full = [...css.matchAll(/--terra-full:\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => m[1]);
  check(`the band's zone stands on --terra-full in --band-ink (read: ${terraBlock.replace(/\s+/g, " ").trim() || "no rule"})`, /--zone-bg:\s*var\(--terra-full\)/.test(terraBlock) && /--c-surface:\s*var\(--terra-full\)/.test(terraBlock) && /color:\s*var\(--band-ink\)/.test(terraBlock), CSS);
  check(`--terra-full is one colour, defined once (${full.join(", ") || "none"}); --band-ink is the card's white; the pale band's rule colour is gone`, full.length === 1 && /--band-ink:\s*var\(--c-card\)/.test(css) && !/--band-rule/.test(css), CSS);
  check("on paper the band is ink on white", /--zone-bg:\s*var\(--c-card\)/.test(printBlock) && /--band-ink:\s*var\(--c-ink\)/.test(printBlock), CSS);
  const lum = (hex: string) => { const [r, g, b] = [1, 3, 5].map((i) => { const s = parseInt(hex.slice(i, i + 2), 16) / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = full.length === 1 ? 1.05 / (lum(full[0]) + 0.05) : 0;
  check(`white on --terra-full reads ${ratio.toFixed(2)} to 1, AA for every size the band sets (4.5 or more)`, ratio >= 4.5, CSS, "keep --terra-full dark enough for white type at 4.5 to 1 (Q1's three choices all are)");
  const laws = read("scripts/harness/check_page_laws.mjs");
  check("the page laws read the band's colour from --terra-full, never a typed value", /var\(--terra-full\)/.test(laws) && !/rgb\(251, 132, 105\)/.test(laws), "scripts/harness/check_page_laws.mjs", "read TERRA in check_page_laws.mjs by probing var(--terra-full), as plan 2026-10-13 Task 5 gives it");
  const render = read(RENDER);
  if (!render) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh)");
  else {
    const doc = new JSDOM(render.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
    const terra = [...doc.querySelectorAll('main [data-tone="terra"]')];
    const bandEl = doc.getElementById("band");
    check(`the render's one terracotta zone is the band, after the contents and before the colophon (${terra.length} terracotta zone(s))`, terra.length === 1 && terra[0] === bandEl && follows(doc.querySelector("main [data-contents]"), bandEl) && follows(bandEl, doc.getElementById("colophon")), RENDER);
    check("no digit on the band as drawn", !!bandEl && !/\d/.test(bandEl.textContent ?? ""), RENDER);
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/band: all pass");
}

main().catch((e) => { red({ rule: RULE, file: BAND, detail: `the band test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
```

- [ ] **Step 3: Wire both.** In `scripts/prebuild_all.ts`, straight after `  { name: "home-shape", script: "tests/trust/home_shape.test.ts" },` add:

```ts
  /* The home's contents (plan 2026-10-13 home-quiet-editorial; his choice of 2026-10-13, quiet editorial): six numbered departments, each
     at most four members chosen by a rule read from the code and recomputed here, a trade row printing its industry page's own figure, a
     thin state drawing fewer rows and never a placeholder, every member landing; the Department form and the six literal sections; the
     small copies of the city photographs it draws. Reads the home's render, which pages-fresh writes first. */
  { name: "home-contents", script: "tests/home/contents.test.ts" },
  /* The home's band, one solid statement (his decision of 2026-10-13): one sentence true of how every figure is made, one link to the
     method, no figure and no digit, on the brand terracotta at full strength (--terra-full) in white at AA, ink on paper in print. */
  { name: "home-band", script: "tests/home/band.test.ts" },
```

Stage the two tests; COUNTS to `scratchpad/home-qe/t1b-counts.txt`.

- [ ] **Step 4: Run them to see them red.** Each to its file: `node node_modules/tsx/dist/cli.mjs tests/home/contents.test.ts > scratchpad/home-qe/t1b-contents.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t1b-contents.txt`, the same for `band.test.ts` to `t1b-band.txt`. Expected: contents exit 1, red on "the contents builder is there" (every rule, thin state and anatomy check waits inside that one until Task 4A creates the module, and runs from then); PASS on the small copies, their crops, CityParts and the root closure. Band exit 1, red on the band's words and the four kinds (no `COPY.home.band` yet, so the line reads ""), "HomeBand is there", its ink, the zone's colour, `--terra-full`, print, the contrast (no token), the page laws' colour and the render's terracotta zone; PASS on About the figures' #reading.

- [ ] **Step 5: Commit.** `tests/home/contents.test.ts`, `tests/home/band.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `home:contents-band-red: the contents' rules, thin states and anatomy and the band as one true statement are tested first, red on today's code (plan 2026-10-13 home-quiet-editorial, Task 1B)`.

---

### Task 1C: the no-counts law, red on today's render

**Files:**
- Create: `src/lib/home/list_counts.ts`, `tests/home/no_counts.test.ts`
- Modify: `scripts/prebuild_all.ts` (one entry after `home-band`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Produces: `LIST_COUNT_RE: RegExp`, `listCounts(text: string): string[]`, `holdsListCount(text: string): boolean` from `src/lib/home/list_counts.ts` (Task 4A's reading department uses `holdsListCount`); gate `home-no-counts`.

- [ ] **Step 1: Write the test** `tests/home/no_counts.test.ts`:

```ts
/**
 * NO COUNT ON THE HOME (his ruling of 2026-10-07: no country, city or trade-list count on the home; plan
 * E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1C; spec E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-
 * editorial-design.md, sections 1 and 4). Three rules over the home's render, scratchpad/harness/pages/home-gb.html (pages-fresh writes it
 * first in the chain):
 *   COUNT   a number beside one of the site's list nouns, in figures or in words ("195 countries", "five London trades", "hundreds of
 *           cities"), read block by block (a paragraph, a list item, a link, a heading, a cell, a label), the block's text nodes joined so a
 *           count split across tags is one phrase; the words are src/lib/home/list_counts.ts's;
 *   FIGURE  a stamped figure (`.fig`) anywhere but a trade row of the contents (MODEL PART 9: a trade row carries its own figure) and the
 *           Pro band (an offer, his decision of 2026-10-09);
 *   DIGIT   any digit in the band, which states and never counts.
 * Not read: a department's index (data-dept-index, "01" to "06"), a <time>, the stylesheet and scripts. The home's own strings in the copy
 * table are read with the same words. The rules are proven on fixtures first (Review Focus 5), then run on the render; a missing render, or
 * a main with no text, is a red, so the gate never passes having read nothing.
 * BLIND SPOT, stated: it reads the server's markup at no width, so a count a client component writes after hydration, a count drawn as a
 * mark, or a total with two words or more between it and its noun ("195 of the world's countries") is not seen.
 * Run: node node_modules/tsx/dist/cli.mjs tests/home/no_counts.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-no-counts";
const RENDER = "scratchpad/harness/pages/home-gb.html";
const LIB = "src/lib/home/list_counts.ts";
const REMEDY = "say it without the count (a door names a list, never its size); a figure stands only in a trade row of the contents and in the Pro band; the band states and never counts";
let failed = 0;
const check = (label: string, ok: boolean, file = RENDER, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

type Finding = { rule: "COUNT" | "FIGURE" | "DIGIT"; text: string };
const BLOCKS = "p, li, a, h1, h2, h3, h4, dt, dd, td, th, label, button, figcaption, blockquote, summary, caption";
const SKIP = "style, script, template, noscript, time, [data-dept-index]";

/** The three rules over one parsed page, its count words read by `listCounts`. */
function readCounts(doc: Document, listCounts: (s: string) => string[]): { chars: number; findings: Finding[] } {
  const root = doc.querySelector("main") ?? doc.body;
  const groups = new Map<Element, string[]>();
  let chars = 0;
  const walker = doc.createTreeWalker(root, 4);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    const t = n.textContent ?? "";
    if (!el || !t.trim() || el.closest(SKIP)) continue;
    chars += t.replace(/\s/g, "").length;
    const host = el.closest(BLOCKS) ?? el;
    const list = groups.get(host) ?? [];
    list.push(t);
    groups.set(host, list);
  }
  const findings: Finding[] = [];
  for (const parts of groups.values()) for (const c of listCounts(parts.join(" "))) findings.push({ rule: "COUNT", text: c });
  for (const f of root.querySelectorAll(".fig")) if (!f.closest('[data-dept="trades"] [data-member]') && !f.closest("#pro")) findings.push({ rule: "FIGURE", text: (f.textContent ?? "").trim() });
  const band = root.querySelector("#band");
  if (band && /\d/.test(band.textContent ?? "")) findings.push({ rule: "DIGIT", text: (band.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60) });
  return { chars, findings };
}

async function main(): Promise<void> {
  const L = await import("../../src/lib/home/list_counts").catch(() => null);
  check("the count words are there", !!L, LIB, "create src/lib/home/list_counts.ts as plan 2026-10-13 Task 1C gives it");
  if (L) {
    const RED = ["Explore 195 countries", "one hundred and thirty-eight trades", "Hundreds of cities, one atlas", "five London trades", "a dozen countries", "40+ countries", "1,234 businesses", "Over 9 sectors"];
    const CLEAN = ["Cities, city by city.", "What each trade keeps from its sales, after all costs.", "Contains public sector information licensed under the Open Government Licence v3.0.", "Checked 13 October 2026", "Each figure is counted, worked out, looked up or estimated.", "The reference atlas of small-business earnings.", "What it takes to run a business, country by country."];
    const missed = RED.filter((s) => L.listCounts(s).length === 0);
    const wrong = CLEAN.filter((s) => L.listCounts(s).length > 0);
    check(`a count in figures or in words is found (${RED.length - missed.length} of ${RED.length}${missed.length ? `; missed: ${missed.join(" | ")}` : ""})`, missed.length === 0, LIB);
    check(`a line with no count is left alone (${CLEAN.length - wrong.length} of ${CLEAN.length}${wrong.length ? `; wrongly: ${wrong.join(" | ")}` : ""})`, wrong.length === 0, LIB);
    const fx = (html: string) => readCounts(new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document, L.listCounts);
    const has = (r: { findings: Finding[] }, rule: Finding["rule"]) => r.findings.some((f) => f.rule === rule);
    check("a count split across tags is one phrase", has(fx('<a href="/x"><span>195</span> <span>countries</span></a>'), "COUNT"), "tests/home/no_counts.test.ts");
    check("a department's index beside its title is no count", fx('<div data-dept="countries"><div><span data-dept-index="">01</span><h2>Countries</h2></div></div>').findings.length === 0, "tests/home/no_counts.test.ts");
    check("a figure outside a trade row and Pro is found; a trade row's and Pro's are not", has(fx('<p><span class="fig" data-src="x" data-kind="counted">138</span></p>'), "FIGURE") && fx('<div data-dept="trades"><ul><li><a data-member="restaurants" href="/industries/restaurants"><span>Restaurants</span><span class="fig" data-src="x" data-kind="estimate">7%</span></a></li></ul></div>').findings.length === 0 && fx('<div id="pro"><span class="fig">$38</span></div>').findings.length === 0, "tests/home/no_counts.test.ts");
    check("a digit on the band is found; a date in a <time> is not", has(fx('<section id="band"><p>Read from 32 sources.</p></section>'), "DIGIT") && fx('<p>Checked <time datetime="2026-10-13">13 October 2026</time></p>').findings.length === 0, "tests/home/no_counts.test.ts");
    /* THE HOME'S OWN STRINGS IN THE COPY TABLE (they land task by task; until then none is read). */
    const H = COPY.home as unknown as Record<string, unknown>;
    const strings: string[] = [];
    const walk = (v: unknown): void => { if (typeof v === "string") strings.push(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
    for (const k of ["positioning", "contents", "band", "colophon"]) walk(H[k]);
    const inCopy = strings.flatMap((s) => L.listCounts(s));
    check(`the home's own strings hold no count (${strings.length} read${inCopy.length ? `; ${inCopy.join(" | ")}` : ""})`, inCopy.length === 0, "src/lib/spine/copy.ts");
    if (!existsSync(RENDER)) check("the home's render is there to read", false, RENDER, "run the pages-fresh gate (GATES --only=pages-fresh), which renders home gb first in the chain");
    else {
      const r = readCounts(new JSDOM(readFileSync(RENDER, "utf8")).window.document, L.listCounts);
      const by = (rule: Finding["rule"]) => r.findings.filter((f) => f.rule === rule).map((f) => f.text);
      check(`the home's render was read (${r.chars} characters)`, r.chars > 0);
      check(`no count of a list on the home (${by("COUNT").join(" | ") || "none"})`, by("COUNT").length === 0);
      check(`no figure on the home but a trade row's and Pro's (${by("FIGURE").length}${by("FIGURE").length ? `: ${by("FIGURE").slice(0, 12).join(", ")}` : ""})`, by("FIGURE").length === 0);
      check(`no digit on the band (${by("DIGIT").join(" | ") || "none"})`, by("DIGIT").length === 0);
    }
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/no_counts: all pass");
}

main().catch((e) => { red({ rule: RULE, file: RENDER, detail: `the no-counts test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY }); process.exit(1); });
```

- [ ] **Step 2: Run it to see it red.** To `scratchpad/home-qe/t1c-a.txt`: exit 1, "the count words are there" red.

- [ ] **Step 3: Write `src/lib/home/list_counts.ts`:**

```ts
/**
 * src/lib/home/list_counts.ts
 *
 * A COUNT OF THE SITE'S OWN LISTS, IN FIGURES OR IN WORDS (his ruling of 2026-10-07: no country, city or trade-list count on the home;
 * plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1C). One reader of the words for the home's no-counts law
 * (tests/home/no_counts.test.ts, over the render) and for the contents' reading department (src/lib/home/contents.ts), which passes over a
 * post whose title holds one, so a new post can never put a count on the home.
 *
 * A count is a number, as digits ("195", "1,234", "40+") or as words ("five", "thirty-eight", "hundreds", "a dozen"), then at most one
 * word, then one of the site's list nouns below.
 * ITS BLIND SPOT, stated before it is trusted: a count with two words or more between its number and its noun ("195 of the world's
 * countries"), a bare total ("all 138"), a singular noun ("one country") and a count drawn as a mark are not seen.
 */
const NOUNS = ["countries", "cities", "trades", "businesses", "industries", "activities", "places", "pages", "districts", "neighbourhoods", "neighborhoods", "boroughs", "regions", "sectors", "markets", "economies", "sources", "datasets", "benchmarks", "records"];
const UNITS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const NUMBER = [
  "\\d[\\d,.]*",
  `(?:${TENS.join("|")})(?:-(?:${UNITS.slice(0, 9).join("|")}))?`,
  UNITS.join("|"),
  "hundreds?",
  "thousands?",
  "millions?",
  "dozens?",
  "scores",
].join("|");

/** A number, at most one word, then a list noun; global and blind to case. */
export const LIST_COUNT_RE = new RegExp(`\\b(?:${NUMBER})\\+?\\s+(?:[A-Za-z\\u2019'-]+\\s+)?(?:${NOUNS.join("|")})\\b`, "gi");

/** Every count in a text, as written (runs of space read as one). */
export function listCounts(text: string): string[] {
  return [...String(text ?? "").replace(/\s+/g, " ").matchAll(LIST_COUNT_RE)].map((m) => m[0]);
}

/** Whether a text holds a count. */
export function holdsListCount(text: string): boolean {
  return listCounts(text).length > 0;
}
```

- [ ] **Step 4: Wire it.** After the `home-band` entry of Task 1B add:

```ts
  /* No country, city or trade-list count on the home, in figures or in words (his ruling of 2026-10-07), no figure but a trade row's and
     Pro's, no digit on the band: read on the home's render, block by block, never passing having read nothing. */
  { name: "home-no-counts", script: "tests/home/no_counts.test.ts" },
```

Stage both new files; COUNTS to `t1c-counts.txt`.

- [ ] **Step 5: Run it to see the law red on today's page.** RENDER first if the render is older than this branch's last source change; test to `t1c-b.txt`. Expected: exit 1; the fixtures PASS; "the home's own strings" PASS with 0 read; FIGURE red with the worked example's, the proofs', the counts band's and the city rows' figures; COUNT and DIGIT as found (record them).

- [ ] **Step 6: Commit.** `src/lib/home/list_counts.ts`, `tests/home/no_counts.test.ts`, `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md`; message `home:no-counts-red: no country, city or trade-list count on the home, in figures or in words, and no figure but a trade row's and Pro's, gated on the render; red on today's page (plan 2026-10-13 home-quiet-editorial, Task 1C)`.

---

### Task 1D: the no-eyebrow rule's named exception, red until the line exists

**Files:**
- Modify: `scripts/verify_no_eyebrow.ts` (header, imports :48-49, a guard before `if (violations > 0) {` :232, the success line)

**Interfaces:**
- Consumes: `COPY.home.positioning` (Task 2), the `data-positioning` element in `HomeSearch` (Task 2).
- Produces: the exception, held to its form.

- [ ] **Step 1: The header.** After the paragraph that ends ` * tag line.` (the `// allow-eyebrow` paragraph) insert:

```ts
 *
 * THE ONE NAMED EXCEPTION (his instruction of 2026-10-13: "position the page as #1 page on its own niche, above this H1 with moving parts,
 * it is deeply needed"; spec E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 1; plan 2026-10-13
 * home-quiet-editorial, Task 1D): the home's positioning line, `data-positioning` in src/components/spine/home/home-view.tsx, stands
 * above the h1 and names the category the site owns. The heuristic above finds an eyebrow by its capitals, so a sentence-case line above a
 * title passes it unseen; the exception is therefore named and held below to the form the instruction and the spec give it: exactly one
 * such element on the surfaces, in the home's view, standing in HomeSearch before the question, never in capitals or tracked, at the head
 * or section rung, its words COPY.home.positioning: sentence case, twelve words or fewer, no rank or credential word (the site holds no
 * ranking evidence, and the never-list forbids an invented credential). BLIND SPOT: it reads the source and the copy table; the line as
 * drawn is tests/trust/home_shape.test.ts's.
```

- [ ] **Step 2: The import.** After `import { join, resolve } from "node:path";` add `import { COPY } from "../src/lib/spine/copy";`.

- [ ] **Step 3: The guard.** Immediately before `if (violations > 0) {` insert:

```ts
/* THE NAMED EXCEPTION, HELD TO ITS FORM (see the header). */
const VIEW_FILE = "src/components/spine/home/home-view.tsx";
const RANK_WORDS = ["#1", "no. 1", "number one", "most trusted", "most used", "best", "leading", "top", "largest", "biggest", "award"];
const positioningSites = [...new Set(SURFACE_FILES)].flatMap((f) => readFileSync(resolve(ROOT, f), "utf-8").split("\n").map((l, i) => (!isCommentLine(l) && /data-positioning/.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
const viewSrc = existsSync(resolve(ROOT, VIEW_FILE)) ? readFileSync(resolve(ROOT, VIEW_FILE), "utf-8") : "";
const homeSearch = /function HomeSearch[\s\S]*?\n\}/.exec(viewSrc)?.[0] ?? "";
const posTag = /<p data-positioning="" className="([^"]*)">([\s\S]*?)<\/p>/.exec(homeSearch);
const questionAt = [homeSearch.indexOf("<HomeAsk"), homeSearch.indexOf("<h1")].filter((i) => i >= 0);
const positioning = String((COPY.home as unknown as Record<string, unknown>).positioning ?? "");
const posWords = positioning.trim().split(/\s+/).filter(Boolean);
const exceptionFaults: string[] = [];
if (positioningSites.length !== 1 || !positioningSites[0].startsWith(`${VIEW_FILE}:`)) exceptionFaults.push(`one data-positioning element on the surfaces, in ${VIEW_FILE} (found ${positioningSites.length}: ${positioningSites.join(", ") || "none"})`);
if (!posTag || questionAt.length === 0 || homeSearch.indexOf("data-positioning") > Math.min(...questionAt)) exceptionFaults.push("the positioning line stands in HomeSearch before the question (<HomeAsk or <h1)");
if (posTag && /uppercase|tracking-/.test(posTag[1])) exceptionFaults.push(`the positioning line is never in capitals or tracked (class: ${posTag[1]})`);
if (posTag && !/text-\[length:var\(--t-(?:head|section)\)\]/.test(posTag[1])) exceptionFaults.push("the positioning line stands at the head or section rung, a serious line, never a small kicker");
if (posTag && !/\{C\.positioning\}/.test(posTag[2])) exceptionFaults.push("the positioning line prints COPY.home.positioning ({C.positioning})");
if (posWords.length === 0 || posWords.length > 12 || !/^[A-Z]/.test(positioning) || positioning === positioning.toUpperCase()) exceptionFaults.push(`COPY.home.positioning is one sentence-case line of twelve words or fewer ("${positioning}")`);
const rank = RANK_WORDS.filter((w) => new RegExp(`(^|[^a-z])${w.replace(/[.#]/g, (c) => `\\${c}`)}([^a-z]|$)`, "i").test(positioning));
if (rank.length) exceptionFaults.push(`COPY.home.positioning claims a rank or a credential the site does not hold (${rank.join(", ")})`);
for (const f of exceptionFaults) {
  console.error(`${VIEW_FILE}: the positioning line's named exception: ${f}`);
  violations++;
}
if (exceptionFaults.length) console.error("  Remedy: draw the home's positioning line as plan 2026-10-13 home-quiet-editorial Task 2 gives it, the one exception rule 11 names.");
```

- [ ] **Step 4: The success line.** `console.log("✓ No hand-rolled eyebrows above a title on the spine/home surfaces.");` becomes `console.log("✓ No hand-rolled eyebrows above a title on the spine/home surfaces; the home's positioning line held to its named exception.");`

- [ ] **Step 5: Run it to see it red.** GATES `--only=no-eyebrow` to `scratchpad/home-qe/t1d.txt`. Expected: exit 1; the exception's faults "one data-positioning element (found 0)", "stands in HomeSearch before the question", and the copy line (`""`); no eyebrow found by the heuristic.

- [ ] **Step 6: Commit.** `scripts/verify_no_eyebrow.ts`; message `home:eyebrow-exception: the no-eyebrow gate names its one exception, the home's positioning line (his instruction of 2026-10-13), and holds it to its form; red until the line exists (plan 2026-10-13 home-quiet-editorial, Task 1D)`.

---

### Task 2: the positioning line (asks Q1 first)

**Files:**
- Modify: `src/lib/spine/copy.ts` (after `h1:` :2733), `src/app/globals.css` (after `--terra-text: #991600;` :2777), `src/components/spine/home/home-view.tsx` (imports; `HomeSearch` :74-90)

**Interfaces:**
- Consumes: Task 1D's guard; Task 1A's positioning checks.
- Produces: `COPY.home.positioning: string`; the token `--terra-full`; `<p data-positioning="">` first in `HomeSearch`.

- [ ] **Step 1: The failing state is Task 1D's and 1A's.** GATES `--only=no-eyebrow` to `t2-red.txt` (exit 1, as Task 1D left it).

- [ ] **Step 2: The words.** In `src/lib/spine/copy.ts`, after `    h1: { lead: "How much does a", middle: "make in" },` insert:

```ts
    /** THE POSITIONING LINE (plan 2026-10-13 home-quiet-editorial, Task 2; the spec's section 2, item 1): his pick of 2026-10-13, the
     *  category the site owns, said above his h1 beside the compass mark; a statement, never a rank (no ranking evidence is held). The one
     *  exception the no-eyebrow rule names (scripts/verify_no_eyebrow.ts). */
    positioning: "The reference atlas of small-business earnings.",
```

- [ ] **Step 3: The token (Q1).** In `src/app/globals.css`, after `  --terra-text: #991600;` insert:

```css
  /* THE BRAND TERRACOTTA AT FULL STRENGTH (plan 2026-10-13 home-quiet-editorial, Task 2; the spec's sections 2 and 3, his decision of
     2026-10-13: the band "full-width brand terracotta at full strength", the positioning line's mark beside it). The wordmark's own red
     until that day (the rule of 2026-10-10 above); the home's band and the positioning line's mark take it too, and nothing else on the
     site. White on it reads 4.57 to 1. */
  --terra-full: #e62200;
```

Under Q1's B the value is `#c11c00` and the last sentence reads "White on it reads 6.12 to 1."; under C `#991600` and "8.50 to 1". The comment's second sentence then reads "One step deeper than the wordmark's red; the home's band and the positioning line's mark take it, and nothing else on the site." (B) or "The one text red; the home's band and the positioning line's mark take it as a fill and a mark." (C).

- [ ] **Step 4: The line.** In `home-view.tsx` add `import { LogoMark } from "@/components/brand/LogoMark";` after `import { Box, Rail } from "@/components/spine/kit";`. In `HomeSearch`, after `      <section id="search" className="flex flex-col">` insert:

```tsx
        {/* THE POSITIONING LINE (plan 2026-10-13 home-quiet-editorial, Task 2; the spec's section 2, item 1): his pick, the category the site owns, at the head rung beside the compass mark in the brand terracotta; never a small capitals kicker (the no-eyebrow rule's one named exception). 16 under it to the question, 24 from 1024. */}
        <p data-positioning="" className="mb-4 flex items-center gap-3 text-[length:var(--t-head)] font-semibold leading-7 text-[var(--c-ink)] lg:mb-6">
          <LogoMark size={24} className="shrink-0 text-[var(--terra-full)]" />
          <span>{C.positioning}</span>
        </p>
```

- [ ] **Step 5: Run the guard and the shape.** GATES `--only=no-eyebrow` to `t2-eyebrow.txt`: exit 0. RENDER to `t2-render.txt`; test `tests/trust/home_shape.test.ts` to `t2-shape.txt`: the render's positioning check PASS; the source check stays red until Task 3 (it reads the line before `<HomeAsk`, which Task 3 adds); the rest as Task 1A left them. GATES `--only=pages-fresh,harness-page-laws,harness-readability,harness-copy-plain,no-terra-hover,css-minifies,palette-membership` to `t2-gates.txt`: every one PASS (`check_readability`'s LEADING reads 28 on 20 as 1.4).

- [ ] **Step 6: Photograph.** `node scripts/harness/shoot_page.mjs scratchpad/harness/pages/home-gb.html "#search" scratchpad/home-qe/shots/t2-top 1280,768,375` to `t2-shoot.txt`; read each: the line above the h1, the mark in the brand red, one line at 1280, two at most at 375.

- [ ] **Step 7: Commit.** `src/lib/spine/copy.ts`, `src/app/globals.css`, `src/components/spine/home/home-view.tsx`; message `home:positioning: "The reference atlas of small-business earnings." stands above his h1 beside the compass mark in the brand terracotta (--terra-full), the no-eyebrow rule's one named exception (plan 2026-10-13 home-quiet-editorial, Task 2)`.

---

### Task 3: the picker follows the question's case; the Try line and the definition go

**Files:**
- Create: `src/components/spine/home/HomeAsk.tsx`, `src/lib/home/picker_cases.ts`
- Modify: `src/components/spine/home/HeroWords.tsx` (header :11-15, props :25, the effect :29-82), `src/components/NavigatorForm.tsx` (header :9-36, :58-61, :65-91, :117-140, :169-171, :268-284), `src/lib/home/picker.ts` (:8-12, :19, :28-35, :67-83), `src/lib/home/destination.ts` (:68-92), `src/components/spine/home/home-view.tsx` (imports, `HomeSearch`), `src/lib/spine/copy.ts` (the comment above `definition`), `scripts/verify_trade_set.ts` (Part 3 removed), `scripts/prebuild_all.ts` (comments of home-destination, hero-words, home-picker)
- Test: `tests/home/hero_words.test.ts`, `tests/home/picker.test.ts`, `tests/home/destination.test.ts`; regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `HERO_TICKS`, `heroIndexAt` (src/lib/hero-words.ts); `edgeNotFound(path: string): boolean` (src/lib/routing/edge_not_found.ts); `homeDestination`.
- Produces: `HomeAsk({ lead, middle, businesses, cities, cases }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[]; cases: ReadonlyArray<PickerSeed | null> })` (client); `HeroWords` gains `onIndex?: (index: number) => void`; `NavigatorForm` gains `cases?: ReadonlyArray<PickerSeed | null>; caseIndex?: number`; `PickerSeed = { country: PickerOption; city: PickerOption; business: PickerOption; hidden: PickerHidden }`; `pickerSeed(country: string, city: string, business: string): PickerSeed` (picker.ts); `pickerCaseFor(word: string, place: string): PickerSeed | null` and `homePickerCases(): Array<PickerSeed | null>` (picker_cases.ts, server only).

- [ ] **Step 1: Write the failing tests.**

`tests/home/hero_words.test.ts`: in the header, after `still at once on the first pointerdown, keydown or focusin inside #search;` insert ` still at once on a pointer over the picker's form (plan 2026-10-13 home-quiet-editorial, Task 3); the index on screen told after each change (onIndex), and HomeAsk's picker following it until the reader reaches it, a submit then sending the case on screen;`. In `main`, the mount tree's `React.createElement("input", { id: "probe", "aria-label": "probe" })` inside `mount` becomes `React.createElement("form", null, React.createElement("input", { id: "probe", "aria-label": "probe" }))` (the probe's keydown and focusin still bubble to `#search`). In the `acts` list, after the `focusin` entry add:

```ts
    ["pointer over the picker's form", () => { document.querySelector("#search form")!.dispatchEvent(new dom.window.PointerEvent("pointerover", { bubbles: true })); }],
```

Straight after the `acts` loop's closing `}` (the loop whose check reads `a ${name} inside #search stops the words at once`), while `mount()` still has a live root to replace, add:

```ts
  /* A POINTER OVER THE QUESTION ALONE MOVES NOTHING (plan 2026-10-13 home-quiet-editorial, Task 3): only the form is the picker. */
  await mount();
  await advance(TICK);
  await act(async () => { document.querySelector("#search h1")!.dispatchEvent(new dom.window.PointerEvent("pointerover", { bubbles: true })); });
  await advance(TICK);
  check(`a pointer over the question alone stops nothing: the words go on (${words()})`, words() === "pharmacy / Istanbul", HERO);
```

Then, after the hydration check's last line (`  await act(async () => { hydrated.unmount(); });`, which leaves the container empty and every root unmounted, so the blocks below make their own) and before `  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }`, add:

```ts
  /* THE INDEX ON SCREEN IS TOLD AFTER EACH CHANGE (onIndex): 0 at mount, then each tick's, never twice for one tick (a fade is no change). */
  const told: number[] = [];
  const onIndex = (i: number) => { told.push(i); };
  const toldRoot = createRoot(container);
  timers = [];
  await act(async () => { toldRoot.render(React.createElement("section", { id: "search" }, React.createElement("h1", null, React.createElement(HeroWords, { ...props, onIndex })))); });
  await advance(TICK * 2);
  check(`the index on screen is told after each change (${told.join(", ")})`, told.join() === "0,1,2", HERO, "call onIndex(heroIndexAt(tick)) in an effect on [tick, onIndex]");
  await act(async () => { toldRoot.unmount(); });

  /* THE PICKER FOLLOWS THE CASE ON SCREEN (Review Focus 1): HomeAsk holds the h1's words and the picker on one index; each tick moves the
     fields to the h1's case, a pointer reaching the form stops both where they are, and a submit then sends the case on screen, the
     browser's own before the lists load and the page's own after. BLIND SPOT: jsdom proves the mechanism and the fields the form holds; the
     labels' paint is the photographs'. */
  const { AppRouterContext } = await import("next/dist/shared/lib/app-router-context.shared-runtime");
  const { HomeAsk } = await import("../../src/components/spine/home/HomeAsk");
  const { homePickerCases } = await import("../../src/lib/home/picker_cases");
  const { homeDestination } = await import("../../src/lib/home/destination");
  const ASK = "src/components/spine/home/HomeAsk.tsx";
  const FOLLOW = "keep the picker on the h1's index (HomeAsk passes HeroWords' onIndex to NavigatorForm's caseIndex), stop both when a pointer reaches the form (HeroWords' pointerover on the form, NavigatorForm's reach), and send the case on screen";
  const cases = homePickerCases();
  const pushed: string[] = [];
  const router = { push(p: string) { pushed.push(p); }, replace() {}, back() {}, forward() {}, refresh() {}, prefetch() {} };
  const settle = async (done: () => boolean) => { for (let i = 0; i < 300 && !done(); i++) await act(async () => { await new Promise((r) => setTimeout(r, 10)); }); };
  const at = cases.findIndex((c, i) => i > 0 && c !== null);
  check(`the picker can follow a case after the first (${at > 0 ? `${W.HERO_BUSINESSES[at % W.HERO_BUSINESSES.length]} in ${W.HERO_CITIES[at % W.HERO_CITIES.length]}, tick ${at}` : "none"})`, at > 0 && cases[0] !== null, "src/lib/home/picker_cases.ts", FOLLOW);
  if (at > 0 && cases[0]) {
    const askRoot = createRoot(container);
    timers = [];
    await act(async () => { askRoot.render(React.createElement(AppRouterContext.Provider, { value: router as never }, React.createElement("section", { id: "search" }, React.createElement(HomeAsk, { ...props, cases })))); });
    const form = () => container.querySelector("form")!;
    const sends = () => [...new dom.window.FormData(form()).entries()].map(([k, v]) => `${k}=${v}`).join("&");
    const hiddenOf = (c: NonNullable<(typeof cases)[number]>) => `country=${c.hidden.country}&region=${c.hidden.region}&subdivision=${c.hidden.subdivision}&industry=${c.hidden.industry}`;
    const want = cases[at]!;
    check(`at mount the fields hold the h1's first case (${sends()})`, sends() === hiddenOf(cases[0]), ASK, FOLLOW);
    await advance(TICK * at);
    const wordsAt = words();
    check(`after ${at} tick(s) the fields hold the case the h1 shows, ${wordsAt} (${sends()})`, sends() === hiddenOf(want), ASK, FOLLOW);
    const native = new dom.window.Event("submit", { bubbles: true, cancelable: true });
    await act(async () => { form().dispatchEvent(new dom.window.PointerEvent("pointerover", { bubbles: true })); form().dispatchEvent(native); });
    const sentNative = sends();
    await advance(TICK * 3);
    check(`a pointer over the form stops the words and the fields at once, where they are (${words()} against ${wordsAt}; ${timers.length} timer; ${sends()})`, words() === wordsAt && timers.length === 0 && sends() === hiddenOf(want), ASK, FOLLOW);
    check(`a submit at that moment is the browser's own and sends the case on screen (default prevented ${native.defaultPrevented}; ${sentNative})`, !native.defaultPrevented && sentNative === hiddenOf(want) && pushed.length === 0, ASK, FOLLOW);
    await act(async () => { (container.querySelector("#country") as HTMLInputElement).focus(); });
    await settle(() => container.querySelectorAll('[role="option"]').length > 1);
    const scripted = new dom.window.Event("submit", { bubbles: true, cancelable: true });
    await act(async () => { form().dispatchEvent(scripted); });
    const path = homeDestination({ country: want.country.value, city: want.city.value, trade: want.business.value });
    check(`once the lists are in, a submit is the page's own and pushes the case on screen, ${path} (pushed ${pushed.join(", ") || "nothing"})`, scripted.defaultPrevented && pushed.join() === path, ASK, FOLLOW);
    await act(async () => { askRoot.unmount(); });
  }
```

`tests/home/picker.test.ts`:
- Header :7: `action; the examples' line in ink2 under the row; a failure said in the card;` becomes `action; no examples' line (plan 2026-10-13 home-quiet-editorial, Task 3: the fields follow the h1's case instead); a failure said in the card;`, and after `first paint from the server's seed, whose labels are the lists' own.` add ` On the rebuilt home the form follows the cases it is handed (cases, caseIndex) until a pointer, a press, a focus or a key reaches it, and a null case keeps the case on screen (Review Focus 2).`
- :299 becomes `  check("its lists load with import() when the reader reaches the form: a pointer enters it, a press or a focus lands in it, or a key is pressed in it (reach, which also stops the fields following the h1)", /loading\.current = import\("@\/lib\/home\/picker"\)\.then\(/.test(code) && /const reach = React\.useCallback\(\(\) => \{\s*touched\.current = true;\s*loadLists\(\);/.test(code) && ["onPointerEnter", "onPointerDown", "onFocus", "onKeyDown"].every((h) => new RegExp(`${h}=\\{reach\\}`).test(code)), FORM);`
- :307: delete ` && /<p data-try="" className="[^"]*lg:col-span-4 lg:row-start-2"/.test(code)` from the condition, and its label's `, the line beside it` goes.
- :309, :310 to :313 (the examples' line's two checks and the comment between them) become one check: `  check("the examples' line is gone (plan 2026-10-13: the fields follow the h1's case instead): no data-try, no tries, no city of its own", !/data-try|tries|tryCity|homeTryLinks/.test(code), FORM);`
- :349 `SEED`'s `, tries: [], tryCity: "London" }` becomes ` }`.
- After :391 (`  await byPointer.unmount();`) insert:

```ts
  /* THE FIELDS FOLLOW THE CASES THEY ARE HANDED, AND A NULL CASE KEEPS THE ONE ON SCREEN (plan 2026-10-13 home-quiet-editorial, Task 3;
     Review Focus 2): three cases, the middle one null, the index moved by re-rendering; the hidden fields are what a submit sends before
     the lists load. Once a pointer reaches the form, a new index moves nothing. */
  const FOLLOW_REMEDY = "follow cases[caseIndex] into the three fields and the shown case while the reader has not reached the form, keep the case on screen for a null case, and hold the fields once reached";
  const A: PickerSeed = { country: { value: "GB", label: "United Kingdom" }, city: { value: "london", label: "London" }, business: { value: "restaurants", label: "Restaurants" }, hidden: { country: "gb", region: "", subdivision: "london", industry: "restaurants" } };
  const Bc: PickerSeed = { country: { value: "FR", label: "France" }, city: { value: "paris", label: "Paris" }, business: { value: "bakeries_retail", label: "Bakeries (retail)" }, hidden: { country: "fr", region: "", subdivision: "paris", industry: "bakeries-retail" } };
  const casesTree = (i: number) => React.createElement(AppRouterContext.Provider, { value: router as any }, React.createElement<{ cases?: ReadonlyArray<PickerSeed | null>; caseIndex?: number }>(NavigatorForm, { cases: [A, null, Bc], caseIndex: i }));
  const followBox = document.createElement("div");
  document.body.appendChild(followBox);
  const followRoot = createRoot(followBox);
  const sendsOf = () => [...new dom.window.FormData(followBox.querySelector("form")!).entries()].map(([k, v]) => `${k}=${v}`).join("&");
  await act(async () => { followRoot.render(casesTree(0)); });
  const atA = sendsOf();
  await act(async () => { followRoot.render(casesTree(1)); });
  const atNull = sendsOf();
  await act(async () => { followRoot.render(casesTree(2)); });
  const atB = sendsOf();
  const countryShown = followBox.querySelector<HTMLInputElement>("#country")?.value ?? "";
  await act(async () => { followBox.querySelector("form")!.dispatchEvent(new dom.window.PointerEvent("pointerover", { bubbles: true })); });
  await act(async () => { followRoot.render(casesTree(0)); });
  const afterReach = sendsOf();
  check(`the fields follow the cases: the first, the first kept over a null case, the third; once reached, a new index moves nothing (${[atA, atNull, atB, afterReach].join(" | ")}; country "${countryShown}")`, atA === "country=gb&region=&subdivision=london&industry=restaurants" && atNull === atA && atB === "country=fr&region=&subdivision=paris&industry=bakeries-retail" && countryShown === "France" && afterReach === atB, FORM, FOLLOW_REMEDY);
  await act(async () => { followRoot.unmount(); });
  followBox.remove();
  check("HomeAsk imports the picker's types only, so its lists still load on first use", /^import type \{[^}]*\bPickerSeed\b[^}]*\} from "@\/lib\/home\/picker";/m.test(readFileSync("src/components/spine/home/HomeAsk.tsx", "utf8")) && !/^import (?!type\b)[^\n]*from "@\/lib\/home\/(picker|picker_cases|destination)";/m.test(readFileSync("src/components/spine/home/HomeAsk.tsx", "utf8")), "src/components/spine/home/HomeAsk.tsx");
  check("the lazy lists carry no route table: src/lib/home/picker.ts imports nothing from src/lib/routing", !/from "@\/lib\/routing\//.test(readFileSync(PICKER, "utf8")), PICKER, "keep the edge's route table in src/lib/home/picker_cases.ts, a server module, never in picker.ts");
```

- :441 becomes `  check("the seed carries the case alone: no examples' links", !("tries" in seed) && !("tryCity" in seed), PICKER);`

`tests/home/destination.test.ts`:
- :14 `import { homeDestination, UK_CITIES, HOME_TRY, HOME_TRY_CITY, homeTryLinks, homeTryCityLabel } from "../../src/lib/home/destination";` becomes `import { homeDestination, UK_CITIES } from "../../src/lib/home/destination";`; :15 becomes `import { homePickerSeed, countryOptions, cityOptions, businessOptions } from "../../src/lib/home/picker";`; :16 (`londonTradeHero`) is deleted; after :20 add `import { homePickerCases, pickerCaseFor } from "../../src/lib/home/picker_cases";` and `import { edgeNotFound } from "../../src/lib/routing/edge_not_found";`; :22 becomes `import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";`.
- :81 to :91 (from `/* THE PICKER'S EXAMPLES` through the `unnamed` check) are replaced by:

```ts
/* THE H1'S CASES LAND (plan 2026-10-13 home-quiet-editorial, Task 3; Review Focus 2): the picker follows the h1's words through
   homePickerCases (src/lib/home/picker_cases.ts), one case a tick; every case it keeps is a search that lands on a page the edge serves
   (src/lib/routing/edge_not_found.ts), its labels the lists' own, and the first is the form's own seed; a case it cannot keep is null and
   named here. BLIND SPOT: edgeNotFound is the edge's answer, so it cannot tell a page that renders from a route that answers notFound()
   after the edge lets the address through; the production probe after a push is that instrument. */
const CASES = "src/lib/home/picker_cases.ts";
const cases = homePickerCases();
const named = cases.map((c, i) => `${HERO_BUSINESSES[i % HERO_BUSINESSES.length]} in ${HERO_CITIES[i % HERO_CITIES.length]}: ${c ? "followed" : "kept on screen"}`);
check(`one case a tick of the h1's lap (${cases.length}: ${named.join("; ")})`, cases.length === HERO_CITIES.length && cases[0] !== null, { file: CASES, remedy: "return one case a tick, HERO_TICKS of them, the first restaurants in London" });
check("the first case is the form's own seed, so the first paint and the h1 ask one question", JSON.stringify(cases[0]) === JSON.stringify(homePickerSeed()), { file: CASES });
const kept = cases.filter((c): c is NonNullable<typeof c> => c !== null);
const landings = kept.map((c) => homeDestination({ country: c.country.value, city: c.city.value, trade: c.business.value }));
const nowhere = landings.filter((p) => edgeNotFound(p));
check(`every case the picker follows lands on a page the edge serves (${landings.join(", ")})${nowhere.length ? `; nowhere: ${nowhere.join(", ")}` : ""}`, nowhere.length === 0, { file: CASES, remedy: "return null for a case whose search the edge answers with 404 (edgeNotFound)" });
const label = (list: Array<{ value: string; label: string }>, value: string) => list.find((o) => o.value === value)?.label;
check("every case the picker follows carries the lists' own labels", kept.every((c) => label(countryOptions(), c.country.value) === c.country.label && label(cityOptions(c.country.value), c.city.value) === c.city.label && label(businessOptions({ revealMixed: false, revealCorp: false }), c.business.value) === c.business.label), { file: CASES });
check("a word no activity answers, or a city no list holds, is no case (null), and London's restaurant is the seed", pickerCaseFor("zzzzqq", "London") === null && pickerCaseFor("restaurant", "Atlantis") === null && JSON.stringify(pickerCaseFor("restaurant", "London")) === JSON.stringify(homePickerSeed()), { file: CASES });
```

- The registry check and its comment (from `/* THE REGISTRY NAMES WHAT THE TRADE-SET GATE READS` through its `check(...)`) are deleted (Part 3 leaves the trade-set gate in this task; Task 4A's contents test holds the registry for the gate's new Part 3).

Run the three to `t3-red-words.txt`, `t3-red-picker.txt`, `t3-red-dest.txt`: exit 1, each red where `HomeAsk`, `picker_cases`, `onIndex`, the pointerover stop and `reach` are missing.

- [ ] **Step 2: The server's cases.** `src/lib/home/picker.ts`:
- :8 to :11 become:

```ts
 *   pickerSeed() and homePickerSeed()  what the form paints before anything loads: the three fields' values and labels and the four
 *                         fields the no-script form sends to /api/go; homePickerSeed is the form's own case, restaurants in London. The
 *                         h1's cases, one a tick, are src/lib/home/picker_cases.ts's (a server module: it reads the edge's route table).
```

- :19 `import { homeDestination, homeTryLinks, homeTryCityLabel } from "@/lib/home/destination";` becomes `import { homeDestination } from "@/lib/home/destination";`.
- In `PickerSeed`, the lines `  tries: Array<{ word: string; href: string }>;` and `  tryCity: string;` are deleted.
- `homePickerSeed` (:67-79) is replaced by:

```ts
/** A case as the first paint draws it, every label its list's own (the default audience gate's activities). */
export function pickerSeed(country: string, city: string, business: string): PickerSeed {
  const pick = (options: PickerOption[], value: string): PickerOption => ({ value, label: options.find((o) => o.value === value)?.label ?? "" });
  return {
    country: pick(countryOptions(), country),
    city: pick(cityOptions(country), city),
    business: pick(businessOptions({ revealMixed: false, revealCorp: false }), business),
    hidden: hiddenFields(country, city, business),
  };
}

/** The form's own case, restaurants in London (CASCADE_PREFILLS[0]), as the first paint draws it. */
export function homePickerSeed(): PickerSeed {
  const p = CASCADE_PREFILLS[0];
  return pickerSeed(p.country, p.city, p.business);
}
```

- :81 to :83 become:

```ts
/* What the loaded form reads besides the builders: the case it opens on where nothing was passed, and the destination a search lands on. */
export { CASCADE_PREFILLS, homeDestination };
```

`src/lib/home/destination.ts`: delete from `/* THE PICKER'S EXAMPLES, EACH THE PAGE THAT ANSWERS IT (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 9; the` to the end of the file (`HOME_TRY_CITY`, `HOME_TRY`, `homeTryLinks`, `homeTryCityLabel`).

Create `src/lib/home/picker_cases.ts`:

```ts
/**
 * src/lib/home/picker_cases.ts
 *
 * THE H1'S CASES, ONE A TICK, FOR THE PICKER TO FOLLOW (plan 2026-10-13 home-quiet-editorial, Task 3; spec E:/atlas/docs/superpowers/
 * specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 2: "The picker under it follows the question's current case until the
 * reader touches it (no single default city)"). The h1 shows HERO_BUSINESSES[i] in HERO_CITIES[i] at tick i, each list cycling
 * (RotatingWord draws words[index % words.length]; src/lib/hero-words.ts), so the case at tick i is that pair, read into what the form
 * paints:
 *   the business  the activity the word names (slugToIndustry), and only one the form's own list offers under the default gate;
 *   the city      the one country whose city list holds a city of that name (getCitiesForCountryCode, the form's own lists: the UK's
 *                 seven for London); a name no list holds, or two countries hold, is not guessed;
 *   the landing   a search for the case lands on a page the edge serves (homeDestination, then edgeNotFound).
 * A tick whose case fails any of the three is null, and the picker keeps the case on screen (src/components/NavigatorForm.tsx). The first
 * case is the form's own seed: the h1's first words are restaurants in London.
 *
 * SERVER ONLY: it reads the edge's route table, which the picker's lazy lists (src/lib/home/picker.ts, loaded in the browser on first use)
 * must never carry; the home's view works the cases out and hands them to HomeAsk as data.
 */
import { COUNTRIES, slugToIndustry } from "@/lib/taxonomy";
import { getCitiesForCountryCode } from "@/lib/home/search_cascade";
import { homeDestination } from "@/lib/home/destination";
import { edgeNotFound } from "@/lib/routing/edge_not_found";
import { HERO_BUSINESSES, HERO_CITIES, HERO_TICKS } from "@/lib/hero-words";
import { businessOptions, pickerSeed, type PickerSeed } from "@/lib/home/picker";

/** The case behind one tick's two words, or null where the picker cannot show it whole or a search for it lands on no page. */
export function pickerCaseFor(word: string, place: string): PickerSeed | null {
  const business = slugToIndustry(word)?.id ?? null;
  if (!business || !businessOptions({ revealMixed: false, revealCorp: false }).some((o) => o.value === business)) return null;
  const homes = COUNTRIES.filter((c) => getCitiesForCountryCode(c.code).some((x) => x.label === place));
  if (homes.length !== 1) return null;
  const country = homes[0].code;
  const city = getCitiesForCountryCode(country).find((x) => x.label === place)?.slug;
  if (!city || edgeNotFound(homeDestination({ country, city, trade: business }))) return null;
  return pickerSeed(country, city, business);
}

/** The h1's cases by tick, one lap of its cities (HERO_TICKS), each followed or null. */
export function homePickerCases(): Array<PickerSeed | null> {
  return Array.from({ length: HERO_TICKS }, (_, i) => pickerCaseFor(HERO_BUSINESSES[i % HERO_BUSINESSES.length], HERO_CITIES[i % HERO_CITIES.length]));
}
```

- [ ] **Step 3: The words tell their index and stop at the form.** `HeroWords.tsx`:
- The header's `still at once on the first pointerdown, keydown or focusin inside #search, the hero's section,` becomes `still at once on the first pointerdown, keydown or focusin inside #search, the hero's section, or the first pointer over the picker's form there (plan 2026-10-13 home-quiet-editorial, Task 3: the picker follows the words until then, HomeAsk; onIndex tells it the index on screen),`.
- :25 `export function HeroWords({ lead, middle, businesses, cities }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[] }) {` becomes `export function HeroWords({ lead, middle, businesses, cities, onIndex }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[]; /** Told the index on screen after each change (HomeAsk: the picker follows it). */ onIndex?: (index: number) => void }) {`.
- In the effect, after `    for (const a of acts) host?.addEventListener(a, stop);` add:

```tsx
    /* A POINTER OVER THE FORM IS A HAND AT THE PICKER (plan 2026-10-13 home-quiet-editorial, Task 3): the picker stops following the words
       the moment a pointer enters it (NavigatorForm's reach), so the words stop then too, and the case on screen is the case a submit sends.
       Duck-typed: the target is an element with closest(), whatever global the runtime calls it. */
    const overForm = (e: Event) => {
      const t = e.target as { closest?: (s: string) => unknown } | null;
      if (t?.closest?.("form")) stop();
    };
    host?.addEventListener("pointerover", overForm);
```

and in its cleanup, after `      for (const a of acts) host?.removeEventListener(a, stop);` add `      host?.removeEventListener("pointerover", overForm);`.
- After the effect's closing `  }, []);` add:

```tsx
  /* THE PICKER FOLLOWS THE WORDS (plan 2026-10-13 home-quiet-editorial, Task 3): the index on screen, told after each change. */
  React.useEffect(() => {
    onIndex?.(heroIndexAt(tick));
  }, [tick, onIndex]);
```

- [ ] **Step 4: The form follows the case.** `NavigatorForm.tsx`:
- :20 ` *  - The form opens on one real example, restaurants in London, and holds it.` becomes ` *  - The form opens on one real example, restaurants in London; on the rebuilt home it follows the h1's case until the reader reaches it, then holds what it shows.`
- :24-35, the paragraph that begins ` * IN THE SPINE'S TOKENS, ONE ROW, ONE ACTION (plan 2026-10-10, home reform, Task 2;` and ends ` * destination.`, is replaced whole by:

```tsx
 * IN THE SPINE'S TOKENS, ONE ROW, ONE ACTION (plan 2026-10-10, home reform, Task 2; the critique's P0.4, P1.2, P1.3 and P1.14; the
 * ship audit's 1b.5 and 3.2): the card is the spine's (radius 12, the strong edge, the card's shadow, 24 of padding) and stays a card
 * on the hero's band (data-keep-card: a picker is an instrument); the action is the page's one solid ink button, the fourth column of
 * the field row from 1024, under the fields at the right from 768, full width on a phone; the footer strip and its divider are gone,
 * and so is the examples' line (plan 2026-10-13 home-quiet-editorial, Task 3: the fields follow the h1's case instead). Any failure
 * says so in the card instead of sending the visitor to a random page. THE LISTS LOAD ON FIRST USE: the server passes `seed`
 * (src/lib/home/picker.ts homePickerSeed) or `cases`, one a tick of the h1's words (src/lib/home/picker_cases.ts), with the three
 * labels and the no-script fields the first paint needs, and the 195 countries, the activities and the city lists arrive with import()
 * when the reader reaches the form: a pointer enters it, a press or a focus lands in it, or a key is pressed in it (a field focused
 * before the page hydrated fires no focus that React hears, so its first key starts the load). Until they are in, an open field says
 * "Loading…" in place of a list or of "No match" (ComboField's `loading`, the Task 2 review: typing then filtered the one seeded option
 * alone), and its Enter keeps typed words in the field. A press that comes before them is the browser's own submit to /api/go, which
 * answers through the same destination.
```

- :58-60, the doc comment straight above the signature (its first line ends `where the page's h1 already asks the question (the rebuilt home, his`), is replaced whole by:

```tsx
/** `showHeading={false}` drops the card's own heading where the page's h1 already asks the question (the rebuilt home, his
 *  instruction of 2026-10-07: "reform home drastically"); the live home keeps it. `seed` is what the first paint draws, from the
 *  server; with neither it nor `cases` the form loads its lists at once and opens on the same case. `cases` and `caseIndex` (the
 *  rebuilt home, HomeAsk): the h1's case at each tick, the first `cases[0]`, the form's own seed; null where the picker cannot show a
 *  case, which keeps the case on screen. */
```
- :61 becomes `export function NavigatorForm({ showHeading = true, seed, cases, caseIndex = 0 }: { showHeading?: boolean; seed?: PickerSeed; cases?: ReadonlyArray<PickerSeed | null>; caseIndex?: number } = {}) {`
- :65-91 (the comment `/* THE PRE-FILL NO LONGER ROTATES, ...` through `  const [business, setBusiness] = React.useState(seed?.business.value ?? "");`) are replaced by:

```tsx
  /* THE FIELDS FOLLOW THE QUESTION ON SCREEN, AND STOP WHEN THE READER REACHES THEM (plan 2026-10-13 home-quiet-editorial, Task 3; the
     spec's section 2, item 2). The rebuilt home passes `cases`, one per tick of the h1's words (src/lib/home/picker_cases.ts), and
     `caseIndex`, the tick on screen (HomeAsk), so the three fields show the h1's own case and the form names no city of its own. The first
     pointer over the form, a press, a focus or a key in it is the reader reaching for it (`reach`): from then the fields hold what they
     show, and the h1's words stop at the same moment (HeroWords stops on a pointer over the form), so a submit sends the case on screen. A
     case the picker cannot show whole is null, and the case on screen stays. The values never move once a hand is near: the defect an
     earlier rotating prefill had (a submit reading values that changed while the reader decided) cannot happen. Without `cases` (the live
     home, and any form handed `seed` alone) the form opens on the seed and holds it. */
  const first = seed ?? cases?.[0] ?? null;
  const [shown, setShown] = React.useState<PickerSeed | null>(first);
  const [country, setCountry] = React.useState(first?.country.value ?? "");
  const [city, setCity] = React.useState(first?.city.value ?? "");
  const [business, setBusiness] = React.useState(first?.business.value ?? "");
  const touched = React.useRef(false);
```

- After the `loadLists` callback (after its closing `  }, []);`) add:

```tsx
  /* The reader's hand is at the form: the fields stop following the h1, and the lists load. */
  const reach = React.useCallback(() => {
    touched.current = true;
    loadLists();
  }, [loadLists]);

  /* Follow the h1's case until the reader reaches the form; a null case keeps the case on screen. */
  React.useEffect(() => {
    if (!cases || cases.length === 0 || touched.current) return;
    const next = cases[((caseIndex % cases.length) + cases.length) % cases.length];
    if (!next) return;
    setShown(next);
    setCountry(next.country.value);
    setCity(next.city.value);
    setBusiness(next.business.value);
  }, [cases, caseIndex]);
```

- :117-127: `  /* No seed: load at once, and open on the case once the lists are in. */` becomes `  /* Nothing to paint first (no seed and no cases): load at once, and open on the case once the lists are in. */`; `    if (!seed) loadLists();` becomes `    if (!first) loadLists();` with its deps `  }, [seed, loadLists]);` becoming `  }, [first, loadLists]);`; `    if (!lists || seed || country) return;` becomes `    if (!lists || first || country) return;` with its deps `  }, [lists, seed, country]);` becoming `  }, [lists, first, country]);`.
- :129-132: the comment `/* Before the lists arrive each field holds its seeded option alone, so it shows its label; after, the whole list. */` becomes `/* Before the lists arrive each field holds the shown case's option alone, so it shows its label; after, the whole list. */`, and in the three `useMemo` lines `seed ? [seed.country] : []`, `seed ? [seed.city] : []`, `seed ? [seed.business] : []` become `shown ? [shown.country] : []`, `shown ? [shown.city] : []`, `shown ? [shown.business] : []` with each `[lists, seed` dependency becoming `[lists, shown`.
- :136 `(seed?.hidden ?? NO_HIDDEN)` becomes `(shown?.hidden ?? NO_HIDDEN)`.
- :137-140 (the tries comment and the two `const` lines) are deleted.
- :169-171 `      onPointerEnter={loadLists}`, `      onFocus={loadLists}`, `      onKeyDown={loadLists}` become `      onPointerEnter={reach}`, `      onPointerDown={reach}`, `      onFocus={reach}`, `      onKeyDown={reach}`.
- :195-199, the JSX comment that begins `{/* The field row: Country, then City, then Business, then the action; the examples' line under it.`, is replaced whole by:

```tsx
      {/* The field row: Country, then City, then Business, then the action. One column on a phone (the action full width under the
          fields), three from 768 (the action under the fields at the right), four from 1024 (the action the row's last column, its foot
          on the fields' foot: the row's inner wrapper steps out of the way there, `lg:contents`). The fields' columns may shrink to
          nothing (minmax(0,1fr)), so the action's column keeps the button's own width and its words stay on one line. */}
```
- :268-284 (the comment `{/* THE EXAMPLES ARE LINKS ...` through `          ) : null}` after the `</p>`) are deleted.

- [ ] **Step 5: HomeAsk, and the view.** Create `src/components/spine/home/HomeAsk.tsx`:

```tsx
"use client";
/**
 * HomeAsk, THE QUESTION AND THE PICKER ON ONE INDEX (plan 2026-10-13 home-quiet-editorial, Task 3; spec E:/atlas/docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 2). His h1, its two words on HeroWords' one timer, and under it the picker,
 * which follows the h1's case: HeroWords tells the index on screen (onIndex) and NavigatorForm shows `cases[index]` until the reader
 * reaches it. The h1's classes and the picker's wrapper are the ones home-view.tsx drew before this file (32 from the h1 to the picker from
 * 1024, 16 on a phone). The cases come from the server (src/lib/home/picker_cases.ts) as data; this file imports the picker's types only,
 * so the lists still load on first use.
 */
import * as React from "react";
import { HeroWords } from "./HeroWords";
import { NavigatorForm } from "@/components/NavigatorForm";
import type { PickerSeed } from "@/lib/home/picker";

export function HomeAsk({ lead, middle, businesses, cities, cases }: { lead: string; middle: string; businesses: readonly string[]; cities: readonly string[]; cases: ReadonlyArray<PickerSeed | null> }) {
  const [at, setAt] = React.useState(0);
  return (
    <>
      <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--c-ink)] leading-[1.08]">
        <HeroWords lead={lead} middle={middle} businesses={businesses} cities={cities} onIndex={setAt} />
      </h1>
      <div className="relative z-30 mt-4 lg:mt-8 w-full">
        <NavigatorForm showHeading={false} cases={cases} caseIndex={at} />
      </div>
    </>
  );
}
```

In `home-view.tsx`: `import { NavigatorForm } from "@/components/NavigatorForm";`, `import { HeroWords } from "./HeroWords";` and `import { homePickerSeed } from "@/lib/home/picker";` are replaced by `import { HomeAsk } from "./HomeAsk";` and `import { homePickerCases } from "@/lib/home/picker_cases";`. `HomeSearch`'s doc comment (:67-73, `/** The hero he kept: ...`) becomes:

```tsx
/** The search: the positioning line, then the question and the picker that follows it (HomeAsk). Left-aligned, as every band page's text
 *  is. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07): the h1 asks it, so the picker draws no heading, and its fields follow
 *  the h1's case (plan 2026-10-13 home-quiet-editorial, Task 3); the positioning line says what the site is, so the definition line is
 *  gone. */
```

In `HomeSearch`, the h1 (`        <h1 className="font-display ...">` through `        </h1>`), the wrapper `        <div className="relative z-30 mt-4 lg:mt-8 w-full">` through its `        </div>`, the JSX comment `{/* WHAT THE SITE IS, ONCE, AT THE HERO'S FOOT ... */}` and `<p data-definition="" ...>{C.definition}</p>` are replaced by:

```tsx
        <HomeAsk lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} cases={homePickerCases()} />
```

In `src/lib/spine/copy.ts` the comment above `definition` (`/** WHAT THE SITE IS, ONCE (plan 2026-10-09, home introduction; ... */`) becomes `/** WHAT THE SITE IS, ONCE (plan 2026-10-09, home introduction): the site's one sentence for the head's description, the manifest, the share card and the structured data (src/app/layout.tsx, manifest.ts, og/default/route.tsx, src/components/StructuredData.tsx). The home no longer prints it since plan 2026-10-13: the positioning line says what the site is. */`.

- [ ] **Step 6: Part 3 leaves the trade-set gate.** `scripts/verify_trade_set.ts`: the header's item 2, from ` *   2. PART 3 (plan 2026-10-09, home introduction): the picker's three` through ` *      under their own heading.` (the parenthesis about the form's placeholder text after it stays), becomes:

```ts
 *   2. PART 3: the picker's examples' line was held here from plan
 *      2026-10-09; it left the home with plan 2026-10-13
 *      home-quiet-editorial, Task 3, and Task 4A of that plan gives Part 3
 *      the home's trades.
```

Delete `import { HOME_TRY } from "../src/lib/home/destination";`; the `HOME_TRY_FILE` doc comment (it begins `/** The module Part 3 reads the picker's examples from (HOME_TRY)`) and its constant; the Part 3 block from `/* PART 3 (plan 2026-10-09, home introduction): the picker's line is no longer a breadth demo.` through the `console.log` line that prints `verify_trade_set: the picker's examples`; and the report block that begins `if (triesReport.length > 0) {` through its closing `}`.

- [ ] **Step 7: The chain's comments.** In `scripts/prebuild_all.ts`, the comment above `{ name: "home-destination", ... }` (four lines, from `  /* Where a home search lands:` to `the site's one definition is the structured data's. */`) becomes:

```ts
  /* Where a home search lands: only pages that exist, the UK first, never /gb/gb/...; the search page lists pages that exist;
     no dialog search left (masterplan step 33; his ruling 11 and his refusals of 2026-09-22). Since plan 2026-10-13 (home, quiet
     editorial): every case of the h1 the picker follows lands on a page the edge serves, the first the form's own seed; the h1 asks
     restaurants in London first; the site's one definition is the structured data's. */
```

the comment above `{ name: "hero-words", ... }` becomes:

```ts
  /* The hero's two words on one timer (plan 2026-10-10, home reform, Task 2; WCAG 2.2.2): twelve ticks of 3.5 s, the last back to
     "restaurant" and "London", then still for good; still at once on a touch, a key or a focus inside the search, or a pointer over the
     picker; paused while hidden; the index told to the picker, which follows it (HomeAsk, plan 2026-10-13); the h1 on set lines, each
     slot as wide as its widest word drawn, the "?" against the city. */
```

and the comment above `{ name: "home-picker", ... }` becomes:

```ts
  /* The home picker in the spine's tokens (plan 2026-10-10, home reform, Task 2): sentence-case labels, 48px fields with a 3:1 edge
     and an ink focus ring, 16px type on a phone, a "No match" row, the one ink action, its lists loaded on first use, its first paint
     from the server's seed or the h1's first case, its fields following the h1's case until the reader reaches them (plan 2026-10-13),
     no examples' line. */
```

- [ ] **Step 8: Run the tests, the gates and the typecheck.** The three tests to `t3-words.txt`, `t3-picker.txt`, `t3-dest.txt`: exit 0 each. COUNTS to `t3-counts.txt` (trade-set's reads lose destination.ts). TYPECHECK to `t3-tsc.txt`: 0. RENDER to `t3-render.txt`; GATES `--only=pages-fresh,home-shape,home-destination,home-picker,hero-words,hero-still,trade-set,head,search-cascade,harness-page-laws,harness-copy-plain,harness-readability,no-eyebrow,counts-fresh,edge-not-found` to `t3-gates.txt`: PASS but home-shape, whose search checks now PASS (positioning before HomeAsk, HomeAsk, the examples' line, the definition) and whose other Task 1A reds stand. Record from `t3-dest.txt` which of the twelve cases the picker follows and which it keeps on screen.

- [ ] **Step 9: The picker in a browser (Review Focus 1).** One browser, nothing beside it: `node scripts/harness/shoot_page.mjs scratchpad/harness/pages/home-gb.html "#search" scratchpad/home-qe/shots/t3-search 1280,768,375` to `t3-shoot.txt`; read each: no examples' line, no definition, the fields under the h1 holding restaurants in London (the render's first paint).

- [ ] **Step 10: Commit.** Every file of this task's Files and the three tests, `scripts/gates.json`, `CLAUDE.md`; message `home:picker-follows: the picker follows the h1's case (HomeAsk, onIndex, the server's cases in picker_cases.ts) until the reader reaches it, a submit sending the case on screen; the Try line and the definition line leave the home (plan 2026-10-13 home-quiet-editorial, Task 3)`.

---

### Task 4A: the contents builder

**Files:**
- Create: `src/lib/home/contents.ts`
- Modify: `src/lib/spine/copy.ts` (after `positioning`), `scripts/verify_trade_set.ts` (a new Part 3); regenerated `scripts/gates.json`, `CLAUDE.md`
- Test: `tests/home/contents.test.ts` (Task 1B), `trade-set`

**Interfaces:**
- Consumes: `holdsListCount` (Task 1C).
- Produces, from `src/lib/home/contents.ts`:
  - `DEPARTMENT_ORDER = ["countries", "cities", "trades", "tools", "reading", "method"] as const`; `type DepartmentKey`; `MEMBERS_MAX = 4`;
  - `type MemberMark = { kind: "flag"; iso2: string } | { kind: "photo"; src: string; position: string | null } | { kind: "pictogram"; id: AtlasPictogramId } | { kind: "icon"; id: AtlasIconId }`;
  - `type ContentsMember = { key: string; name: string; href: string; mark: MemberMark; figure: { text: string; prov: Provenance } | null }`;
  - `type ContentsDepartment = { key: DepartmentKey; index: string; title: string; line: string; members: ContentsMember[]; door: { label: string; href: string } }`; `type Contents = Record<DepartmentKey, ContentsDepartment>`;
  - `ABOUT_THE_FIGURES: { label: string; href: string }`;
  - `worldBroadest(): string[]`, `contentsCountries(broadest?: readonly string[]): ContentsDepartment`, `heldCityCards(): Array<{ iso2: string; card: CityCard }>`, `contentsCities(cards?: ReadonlyArray<{ iso2: string; card: CityCard }>): ContentsDepartment`, `tradeOwnFigure(industryId: string): { text: string; prov: Provenance } | null`, `contentsTrades(slugs?: readonly string[]): ContentsDepartment`, `contentsTools(): ContentsDepartment`, `contentsReading(posts?: ReadonlyArray<{ slug: string; title: string }>, tracksHeld?: (family: "A" | "B" | "C") => boolean): ContentsDepartment`, `contentsMethod(): ContentsDepartment`, `buildContents(): Contents`.
- `COPY.home.contents`: `label`, `depts.<key>.{title, line, door}`, `tools.{decide, check, calculator, compare}`, `tracks.{A, B, C}`, `method.{corrections, coverage}`, `unit`.

- [ ] **Step 1: The failing state is Task 1B's.** Test `tests/home/contents.test.ts` to `t4a-red.txt`: exit 1, "the contents builder is there" red.

- [ ] **Step 2: The words.** In `src/lib/spine/copy.ts`, after the `positioning` entry (Task 2) insert:

```ts
    /** THE ATLAS AS A CONTENTS PAGE (plan 2026-10-13 home-quiet-editorial, Task 4A; the spec's section 2, item 3): the zone's name (a data
     *  attribute, not a printed word); each department's title (four words at most), its one line (twelve words at most, true of every
     *  member its rule can draw) and its door; the tools', the tracks' and the method's member names (the sources' name is the foot's own,
     *  UK_SOURCES_FOOT.link); the trade figure's unit, said to a screen reader (the trades' line says it once for the eye). */
    contents: {
      label: "The atlas",
      depts: {
        countries: { title: "Countries", line: "What it takes to run a business, country by country.", door: "All countries" },
        cities: { title: "Cities", line: "What a typical customer earns, city by city.", door: "All cities" },
        trades: { title: "Trades", line: "What each trade keeps from its sales, after all costs.", door: "Every trade" },
        tools: { title: "Tools", line: "Put the figures to work on your own plan.", door: "All tools" },
        reading: { title: "Reading", line: "Plain guides to revenue and margins, and how to read a figure.", door: "All reading" },
        method: { title: "How it is made", line: "Where each figure comes from, and every correction made.", door: "About the figures" },
      },
      tools: { decide: "Decide", check: "Check", calculator: "Calculator", compare: "Compare" },
      tracks: { A: "Revenue by trade", B: "What owners keep", C: "Reading the numbers" },
      method: { corrections: "Corrections", coverage: "Coverage report" },
      unit: "of sales kept",
    },
```

Each line is held true by its rule: the countries' pages carry the costs of opening and running; a city member carries its own typical customer pay (`payUsd`, the rule's own condition); a trade member prints exactly what its line says, the industry page's "What this trade keeps"; the tools are the tools page's own; the three tracks are the learn page's revenue, owner's keep and reading tracks; the method's members are the sources list, the corrections log and the coverage report.

- [ ] **Step 3: The builder.** Create `src/lib/home/contents.ts`:

```ts
/**
 * src/lib/home/contents.ts
 *
 * THE ATLAS AS A CONTENTS PAGE (plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 4A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3): six numbered departments, each its title,
 * its one line, at most four members chosen by a rule read from the code (never a hand-kept list of places or trades) and its door. A
 * department never pads: a member that fails its rule is left out, so a thin state draws fewer rows and the door still stands.
 *
 *   01 Countries      the countries held to the registers (countryHeldToRegisters: the UK), then the world page's broadest coverage
 *                     (buildWorldAtlas's `deepest`, its "where the map goes furthest"), each with a page (countryPageTarget); a flag
 *   02 Cities         the cities held to sources (cityHeldToSources), largest metro first (buildCityCards), each printing its own figure on
 *                     its page (`payUsd`, the city's own typical pay) and holding its small photograph (cityThumb); names only
 *   03 Trades         rule 32's everyday trades (EVERYDAY_TRADES, in its order), each whose world net is the trade's own (resolveTradeNet's
 *                     shard branch, never the sector profile's residual), printing the figure its industry page prints (industryHeroFacts)
 *   04 Tools          the four tools: Decide, Check, Calculator, Compare
 *   05 Reading        the knowledge base's tracks that hold an article (LEARN_BY_FAMILY), then the newest post whose title holds no list
 *                     count (getAllPosts is newest first; src/lib/home/list_counts.ts)
 *   06 How it is made Sources and licences, the corrections log, the coverage report; its door About the figures, the method
 *
 * Each builder takes its source as an argument with the real one as its default, so tests/home/contents.test.ts feeds it thin and odd
 * states. Server only: it reads the shards, the coverage report and the blog's files.
 */
import { COUNTRIES, industryToSlug, slugToIndustry, tradeRowName } from "@/lib/taxonomy";
import { countryHeldToRegisters, cityHeldToSources } from "@/lib/uk/registers/register_city";
import { countryPageTarget } from "@/lib/geo/page_targets";
import { getCoverageReport } from "@/lib/quality/coverage-report";
import { getCoverageRows } from "@/lib/coverage/report";
import { buildWorldAtlas } from "@/lib/scores/world_atlas";
import { buildCityCards, type CityCard } from "@/lib/spine/city_cards";
import { cityThumb } from "@/lib/cities/city_images";
import { EVERYDAY_TRADES } from "@/lib/spine/adapt_city";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";
import { LEARN_BY_FAMILY } from "@/lib/learn/articles";
import { getAllPosts } from "@/lib/blog";
import { UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";
import { holdsListCount } from "@/lib/home/list_counts";
import { COPY } from "@/lib/spine/copy";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";
import type { AtlasPictogramId } from "@/components/brand/pictograms";

export const DEPARTMENT_ORDER = ["countries", "cities", "trades", "tools", "reading", "method"] as const;
export type DepartmentKey = (typeof DEPARTMENT_ORDER)[number];
/** At most four members a department (the spec: three or four rows), never padded to it. */
export const MEMBERS_MAX = 4;

export type MemberMark = { kind: "flag"; iso2: string } | { kind: "photo"; src: string; position: string | null } | { kind: "pictogram"; id: AtlasPictogramId } | { kind: "icon"; id: AtlasIconId };
export type ContentsMember = { key: string; name: string; href: string; mark: MemberMark; figure: { text: string; prov: Provenance } | null };
export type ContentsDepartment = { key: DepartmentKey; index: string; title: string; line: string; members: ContentsMember[]; door: { label: string; href: string } };
export type Contents = Record<DepartmentKey, ContentsDepartment>;

/** Each department's door. The method's is About the figures' reading section, the address the mobile sheet gives that page (SHEET_TRUST). */
const DOOR_HREF: Record<DepartmentKey, string> = { countries: "/countries", cities: "/cities", trades: "/industries", tools: "/tools", reading: "/learn", method: "/about-data#reading" };
/** About the figures, the method: the sixth department's door and the band's one link (HomeBand). */
export const ABOUT_THE_FIGURES = { label: COPY.home.contents.depts.method.door, href: DOOR_HREF.method };

function dept(key: DepartmentKey, members: ContentsMember[]): ContentsDepartment {
  const D = COPY.home.contents.depts[key];
  return { key, index: String(DEPARTMENT_ORDER.indexOf(key) + 1).padStart(2, "0"), title: D.title, line: D.line, members: members.slice(0, MEMBERS_MAX), door: { label: D.door, href: DOOR_HREF[key] } };
}

/** The world page's "where the map goes furthest": the broadest covered countries, as /world builds them (src/app/world/page.tsx). */
export function worldBroadest(): string[] {
  const report = getCoverageReport();
  const valid = new Set(COUNTRIES.map((c) => c.code));
  const nameOf = (iso2: string) => COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
  return buildWorldAtlas({ ...report, countries: getCoverageRows() }, valid, nameOf, report?.totals?.industries_covered ?? 0).deepest.map((c) => c.iso2);
}

/** 01: the countries held to the registers, then `broadest`, each once and each with a page. */
export function contentsCountries(broadest: readonly string[] = worldBroadest()): ContentsDepartment {
  const held = COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).map((c) => c.code);
  const seen = new Set<string>();
  const members: ContentsMember[] = [];
  for (const raw of [...held, ...broadest]) {
    const code = String(raw).toUpperCase();
    if (seen.has(code)) continue;
    seen.add(code);
    const target = countryPageTarget(code);
    if (!target) continue;
    members.push({ key: code.toLowerCase(), name: target.label, href: target.href, mark: { kind: "flag", iso2: code }, figure: null });
  }
  return dept("countries", members);
}

/** The city cards of every country held to the registers, in the cards' own order (largest metro first). */
export function heldCityCards(): Array<{ iso2: string; card: CityCard }> {
  return COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).flatMap((c) => (buildCityCards(c.code)?.cards ?? []).map((card) => ({ iso2: c.code, card })));
}

/** 02: the cities held to sources, each printing its own figure on its page and holding its small photograph; names only. */
export function contentsCities(cards: ReadonlyArray<{ iso2: string; card: CityCard }> = heldCityCards()): ContentsDepartment {
  const members: ContentsMember[] = [];
  for (const { iso2, card } of cards) {
    if (!cityHeldToSources(iso2, card.id) || typeof card.payUsd !== "number") continue;
    const thumb = cityThumb(card.id);
    if (!thumb) continue;
    members.push({ key: card.id, name: card.name, href: card.href, mark: { kind: "photo", src: thumb.src, position: thumb.position }, figure: null });
  }
  return dept("cities", members);
}

/** A trade's own world figure, the answer its industry page prints, or null where the trade holds no net of its own (the sector profile's
 *  residual is the sector's figure, never a trade row's). Stamped from the shard field the net is read from, an estimate (the site's kind
 *  for a modelled world figure). */
export function tradeOwnFigure(industryId: string): { text: string; prov: Provenance } | null {
  const facts = industryHeroFacts(industryId);
  if (!facts?.answer || facts.net?.branch !== "shard") return null;
  return { text: facts.answer.value, prov: { src: `facts/industry/${industryId}.json:margin_ladder.net_margin_pct`, kind: "estimate" } };
}

/** 03: rule 32's trades in its order, each once, each whose world net is its own. */
export function contentsTrades(slugs: readonly string[] = [...EVERYDAY_TRADES]): ContentsDepartment {
  const seen = new Set<string>();
  const members: ContentsMember[] = [];
  for (const slug of slugs) {
    const ind = slugToIndustry(slug);
    if (!ind || seen.has(ind.id)) continue;
    seen.add(ind.id);
    const figure = tradeOwnFigure(ind.id);
    if (!figure) continue;
    members.push({ key: ind.id, name: tradeRowName(ind.id, ind.name), href: `/industries/${industryToSlug(ind.id)}`, mark: { kind: "pictogram", id: industryPictogramId(ind.id) }, figure });
  }
  return dept("trades", members);
}

const TOOLS: ReadonlyArray<{ key: keyof typeof COPY.home.contents.tools; href: string; icon: AtlasIconId }> = [
  { key: "decide", href: "/decide", icon: "where-it-pays" },
  { key: "check", href: "/check", icon: "benchmark" },
  { key: "calculator", href: "/calculator", icon: "calculator" },
  { key: "compare", href: "/compare", icon: "compare" },
];

/** 04: the four tools. */
export function contentsTools(): ContentsDepartment {
  return dept("tools", TOOLS.map((t) => ({ key: t.key, name: COPY.home.contents.tools[t.key], href: t.href, mark: { kind: "icon", id: t.icon }, figure: null })));
}

/* The learn page's three tracks, each at its section's own anchor (src/app/(site)/learn/page.tsx, id={`track-${track.family}`}); a track
   with no article self-omits there, so its member is drawn only when it holds one. */
const TRACKS: ReadonlyArray<{ family: "A" | "B" | "C"; href: string; icon: AtlasIconId }> = [
  { family: "A", href: "/learn#track-A", icon: "revenue" },
  { family: "B", href: "/learn#track-B", icon: "owner-keeps" },
  { family: "C", href: "/learn#track-C", icon: "range" },
];

/** 05: the tracks that hold an article, then the newest post whose title holds no list count. */
export function contentsReading(posts: ReadonlyArray<{ slug: string; title: string }> = getAllPosts(), tracksHeld: (family: "A" | "B" | "C") => boolean = (f) => LEARN_BY_FAMILY(f).length > 0): ContentsDepartment {
  const members: ContentsMember[] = TRACKS.filter((t) => tracksHeld(t.family)).map((t) => ({ key: `track-${t.family}`, name: COPY.home.contents.tracks[t.family], href: t.href, mark: { kind: "icon", id: t.icon }, figure: null }));
  const post = posts.find((p) => p.title.trim() !== "" && !holdsListCount(p.title));
  if (post) members.push({ key: `post-${post.slug}`, name: post.title, href: `/blog/${post.slug}`, mark: { kind: "icon", id: "bookmark" }, figure: null });
  return dept("reading", members);
}

/** 06: the sources list, the corrections log and the coverage report; the door About the figures. */
export function contentsMethod(): ContentsDepartment {
  const M = COPY.home.contents.method;
  return dept("method", [
    { key: "sources", name: UK_SOURCES_FOOT.link, href: UK_SOURCES_FOOT.href, mark: { kind: "icon", id: "filings" }, figure: null },
    { key: "corrections", name: M.corrections, href: "/corrections", mark: { kind: "icon", id: "change" }, figure: null },
    { key: "coverage", name: M.coverage, href: "/coverage", mark: { kind: "icon", id: "global-spread" }, figure: null },
  ]);
}

/** The six, from their real sources. */
export function buildContents(): Contents {
  return { countries: contentsCountries(), cities: contentsCities(), trades: contentsTrades(), tools: contentsTools(), reading: contentsReading(), method: contentsMethod() };
}
```

Where TypeScript rejects `{ ...report, countries: getCoverageRows() }` for a null report, write it as `/world` writes it (`src/app/world/page.tsx:162-167`), which compiles today; never cast to `any`.

- [ ] **Step 4: Part 3 holds the home's trades.** `scripts/verify_trade_set.ts`: the header's item 2 (Task 3's four lines) becomes:

```ts
 *   2. PART 3 (plan 2026-10-13 home-quiet-editorial, Task 4A): the home's
 *      trades, the contents' third department (contentsTrades in
 *      src/lib/home/contents.ts), each held to rule 32's set by its
 *      taxonomy id; an empty department is a red too. Its failures print
 *      under their own heading.
```

After `import { join, resolve } from "node:path";` add `import { contentsTrades } from "../src/lib/home/contents";`, `import { slugToIndustry } from "../src/lib/taxonomy";` and `import { EVERYDAY_TRADES } from "../src/lib/spine/adapt_city";`, then after the imports:

```ts
/** The module Part 3 reads the home's trades from (contentsTrades): named as a path literal so the gate registry, which scripts/counts.ts
 *  generates from the literals in each gate's script, lists the file the gate reads. */
const HOME_TRADES_FILE = "src/lib/home/contents.ts";
```

After the `/* Part 2 REMOVED (rule 32 v2, 2026-07-12) ... */` comment add:

```ts
/* PART 3 (plan 2026-10-13 home-quiet-editorial, Task 4A): the home's trades. The contents' third department lists rule 32's everyday trades
 * (contentsTrades, from EVERYDAY_TRADES, the city adapter's copy of the set), so each member is held here to that set by its taxonomy id,
 * read from the module that prints them and never from the page's text; a department with no trade is a red too, so this part never
 * passes having read nothing. BLIND SPOT: it holds the members to EVERYDAY_TRADES; that set's agreement with ALLOWED_RAW's words is not
 * re-read here. */
const homeReport: string[] = [];
const everydayIds = new Set([...EVERYDAY_TRADES].map((s) => slugToIndustry(s)?.id).filter((x): x is string => !!x));
const homeTrades = contentsTrades().members;
if (homeTrades.length === 0) { homeReport.push("the home's trades department lists no trade"); violations++; }
for (const m of homeTrades) {
  if (everydayIds.has(m.key)) continue;
  homeReport.push(`"${m.name}" (${m.key}) , outside the rule-32 set`);
  violations++;
}
console.log(`verify_trade_set: the home's trades , ${homeTrades.map((m) => m.name).join(", ") || "none"}`);
```

and after the `if (jsonReport.length > 0) { ... }` block:

```ts
if (homeReport.length > 0) {
  console.error(`\nHome trade offenders (contentsTrades, ${HOME_TRADES_FILE}):`);
  for (const line of homeReport) console.error(`  ${line}`);
}
```

- [ ] **Step 5: Run the builder's half.** Stage `src/lib/home/contents.ts`; COUNTS to `t4a-counts.txt`; TYPECHECK to `t4a-tsc.txt`: 0. Test `tests/home/contents.test.ts` to `t4a.txt`: every check of the rules, thin states, Review Focus 3, 4 and 5 fixtures, the landings, the learn anchors, the member names and the registry PASS; the anatomy and render checks still red (Task 4B). Record each department's members from the PASS lines (the counts the plan does not pin: they are the rules' answer on this day's data). GATES `--only=trade-set,home-no-counts,dead-anchors,dead-links,no-source-agencies,copy-no-method-words,no-em-dashes,counts-fresh,layering` to `t4a-gates.txt`: PASS but home-no-counts, which keeps Task 1C's FIGURE reds (the old sections still draw).

- [ ] **Step 6: Commit.** `src/lib/home/contents.ts`, `src/lib/spine/copy.ts`, `scripts/verify_trade_set.ts`, `scripts/gates.json`, `CLAUDE.md`; message `home:contents-builder: six departments whose members come from rules read from the code (registers then the world's broadest, cities held to sources, rule 32's trades with their own net, the four tools, the tracks and the newest post, the method), each at most four and never padded; trade-set holds the home's trades (plan 2026-10-13 home-quiet-editorial, Task 4A)`.

---

### Task 4B: the Department form and the contents zone (asks Q2 first)

**Files:**
- Create: `src/components/spine/archetypes/Department.tsx`, `src/components/spine/home/HomeContents.tsx`
- Modify: `src/components/spine/home/home-view.tsx` (imports; the zones), `src/app/globals.css` (after the `.spine-scope .ma-glyph .af` rule :676-679), `scripts/harness/check_model_laws.mjs:829-830`, `scripts/verify_archetype_coverage.ts:40-41`; regenerated `docs/loop/CENSUS.md`
- Test: `tests/home/contents.test.ts`, `home-shape`

**Interfaces:**
- Consumes: Task 4A's `Contents`, `ContentsDepartment`, `MemberMark`, `buildContents`.
- Produces: `Department({ dept, index, title, line, rows, door }: { dept: string; index: string; title: string; line: string; rows: readonly DepartmentRow[]; door: { label: string; href: string } })`, `type DepartmentRow = { key: string; href: string; name: string; mark: React.ReactNode; figure?: { text: string; unit: string; prov: Provenance } | null }`; `HomeContents({ contents }: { contents: Contents })` whose root carries `data-contents=""`; Box ids `dept-countries` to `dept-method`.

- [ ] **Step 1: The failing state is Task 1B's.** Test `tests/home/contents.test.ts` to `t4b-red.txt`: the anatomy and render checks red.

- [ ] **Step 2: The form.** Create `src/components/spine/archetypes/Department.tsx`:

```tsx
/**
 * Department, ONE PART OF THE ATLAS AS A CONTENTS ENTRY (plan 2026-10-13 home-quiet-editorial, Task 4B; spec E:/atlas/docs/superpowers/
 * specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3, and section 3; catalogued in E:/atlas/rules/FORM-CATALOG.md, VERSION
 * 10). Quiet editorial, from parts the site owns: the muted index in the figures' face, the title at the head rung (20, a section title's
 * size and tracking on a zone), one plain line in ink2 8 under it (the title's own line, marked a line for the plain-copy law), then 24 to
 * the member rows. A row is one shape everywhere: its mark, its name, a figure only where the model asks for one (a trade row carries its
 * own, MODEL PART 9), the arrow every door on the site carries (DOOR_ARROW); a hairline between rows; the door to the whole part last, its
 * name in ink2. Every row is a link 44 tall at least, so a tap never misses. No accent and no 30: a department is a door to a part of the
 * site, never a figure's card (MODEL PART 4, WHO HOLDS NO 30, names the form; FOCAL_EXEMPT_FORMS in check_model_laws.mjs). Hidden from a
 * screen reader: the index (the title says the part) and each mark (the name says the member); a figure says its unit there instead.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { DOOR_ARROW, DOOR_NAME } from "@/lib/spine/door_look";
import type { Provenance } from "@/lib/spine/provenance";

export type DepartmentRow = { key: string; href: string; name: string; mark: React.ReactNode; figure?: { text: string; unit: string; prov: Provenance } | null };

export function Department({ dept, index, title, line, rows, door }: { dept: string; index: string; title: string; line: string; rows: readonly DepartmentRow[]; door: { label: string; href: string } }) {
  return (
    <div data-archetype="department" data-dept={dept} className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <span aria-hidden data-dept-index="" className="font-serif text-[length:var(--t-body)] font-semibold leading-5 tabular-nums text-[var(--c-muted)]">
          {index}
        </span>
        <h2 data-typography="custom" data-rail-title="" className="text-[length:var(--t-head)] font-semibold leading-7 tracking-[-0.01em] text-[var(--c-ink)]">
          {title}
        </h2>
      </div>
      <p data-dept-line="" data-line="" className="mt-2 text-pretty text-[var(--c-ink2)] text-[length:var(--t-body)] leading-5">
        {line}
      </p>
      <ul data-dept-rows="" className="mt-6">
        {rows.map((r, i) => (
          <li key={r.key} className={i === 0 ? undefined : "border-t border-[var(--c-border)]"}>
            <a href={r.href} data-member={r.key} className="group tap-y grid min-h-11 grid-cols-[2.5rem_minmax(0,1fr)_auto_0.75rem] items-center gap-x-3 py-2 text-[var(--c-ink)] no-underline">
              <span aria-hidden data-member-mark="" className="flex h-7 items-center">
                {r.mark}
              </span>
              <span data-member-name="" className="min-w-0 text-[length:var(--t-lead)] font-medium leading-6 group-hover:underline">
                {r.name}
              </span>
              {r.figure ? (
                <span className="text-[length:var(--t-lead)] leading-6">
                  <Fig prov={r.figure.prov}>{r.figure.text}</Fig>
                  <span className="sr-only">{` ${r.figure.unit}`}</span>
                </span>
              ) : (
                <span />
              )}
              <span aria-hidden className={DOOR_ARROW}>&#8594;</span>
            </a>
          </li>
        ))}
        <li className={rows.length === 0 ? undefined : "border-t border-[var(--c-border)]"}>
          <a href={door.href} data-dept-all="" className={`tap-y flex min-h-11 items-center justify-between gap-3 py-2 ${DOOR_NAME} text-[var(--c-ink2)] no-underline hover:text-[var(--c-ink)] hover:underline`}>
            <span>{door.label}</span>
            <span aria-hidden className={DOOR_ARROW}>&#8594;</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
```

The line's classes stand in that order on purpose: `tests/chrome/masthead.test.ts` reds the substring `leading-5 text-[var(--c-ink2)]` in a file that reads DOOR_ARROW (Task 7A points that check at this file).

- [ ] **Step 3: The ink marks.** In `src/app/globals.css`, after the rule `  .spine-scope .ma-glyph .af {` / `    fill: var(--terra-text);` / `    stroke: none;` / `  }` add:

```css
  /* A MARK IN ITS OWN INK (plan 2026-10-13 home-quiet-editorial, Task 4B; the spec's section 3: on the home, terracotta in four places
     only): the home's contents draw the site's icons and trade pictograms as member marks in ink2, so the glyph's accent follows its ink
     here, as the section icon's does above. */
  .spine-scope .ma-glyph.ma-mono .a {
    stroke: currentColor;
  }
  .spine-scope .ma-glyph.ma-mono .af {
    fill: currentColor;
    stroke: none;
  }
```

- [ ] **Step 4: The six sections.** Create `src/components/spine/home/HomeContents.tsx`:

```tsx
/**
 * HomeContents, THE ATLAS AS A CONTENTS PAGE (plan 2026-10-13 home-quiet-editorial, Task 4B; spec E:/atlas/docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 3, and section 3): one wide zone's content, six numbered departments on a grid
 * of its own: one column on a phone, two from 768, two rows of three from 1024, hairlines between them with 32 of air either side of each.
 * Each department is a section card (a Box with its id, so the page laws read six sections and the home clears its block floor) standing
 * open on the zone, drawn by the Department form. THE SIX ARE WRITTEN OUT, NOT MAPPED: the section census (scripts/harness/census.ts) and
 * the archetype coverage gate read a Box's id and its archetype from the source, so each Box is its own line. The marks: a flag
 * (CountryFlag), the city's small photograph in grey with no wash (DuotonePhoto from CityParts.tsx, a server module), a trade pictogram or
 * a site icon in ink2 (`ma-mono`: no terracotta accent inside a glyph).
 */
import * as React from "react";
import { Box } from "@/components/spine/kit";
import { Department, type DepartmentRow } from "@/components/spine/archetypes/Department";
import { DuotonePhoto } from "@/components/spine/archetypes/CityParts";
import { CountryFlag } from "@/components/CountryFlag";
import { AtlasIcon } from "@/components/brand/icons";
import { AtlasPictogram } from "@/components/brand/pictograms";
import type { Contents, DepartmentKey, MemberMark } from "@/lib/home/contents";
import { COPY } from "@/lib/spine/copy";

/** The small copies' own size (scripts/build_city_images_manifest.ts --thumbs), so the browser keeps the picture's box before it decodes. */
const THUMB_W = 480;
const THUMB_H = 360;
const GRID = "grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3 lg:gap-x-16 [&>*+*]:border-t [&>*+*]:border-[var(--c-border)] [&>*+*]:pt-8 [&>*:nth-child(2)]:md:border-t-0 [&>*:nth-child(2)]:md:pt-0 [&>*:nth-child(3)]:lg:border-t-0 [&>*:nth-child(3)]:lg:pt-0";

function Mark({ mark }: { mark: MemberMark }) {
  if (mark.kind === "flag") return <CountryFlag iso2={mark.iso2} />;
  if (mark.kind === "photo")
    return (
      <span className="relative block h-7 w-10 overflow-hidden rounded-[8px] [&>[data-veil]]:hidden">
        <DuotonePhoto src={mark.src} placeholder={false} tint={false} position={mark.position} width={THUMB_W} height={THUMB_H} />
      </span>
    );
  if (mark.kind === "pictogram") return <AtlasPictogram id={mark.id} size={24} className="ma-mono text-[var(--c-ink2)]" />;
  return <AtlasIcon id={mark.id} size={20} className="ma-mono text-[var(--c-ink2)]" />;
}

export function HomeContents({ contents }: { contents: Contents }) {
  const dept = (key: DepartmentKey) => {
    const d = contents[key];
    const rows: DepartmentRow[] = d.members.map((m) => ({ key: m.key, href: m.href, name: m.name, mark: <Mark mark={m.mark} />, figure: m.figure ? { text: m.figure.text, unit: COPY.home.contents.unit, prov: m.figure.prov } : null }));
    return { dept: d.key, index: d.index, title: d.title, line: d.line, rows, door: d.door };
  };
  return (
    <div data-contents="" className={GRID}>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-countries" className="flex flex-col">
          <Department {...dept("countries")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-cities" className="flex flex-col">
          <Department {...dept("cities")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-trades" className="flex flex-col">
          <Department {...dept("trades")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-tools" className="flex flex-col">
          <Department {...dept("tools")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-reading" className="flex flex-col">
          <Department {...dept("reading")} />
        </Box>
      </div>
      <div data-contents-cell="" className="min-w-0">
        <Box id="dept-method" className="flex flex-col">
          <Department {...dept("method")} />
        </Box>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: The zone in the view.** In `home-view.tsx` add `import { HomeContents } from "./HomeContents";` and `import { buildContents } from "@/lib/home/contents";` after `import { HomeAsk } from "./HomeAsk";`; in `SpineHomeBody`, after `  const cities = buildCityCards(data?.iso2 ?? "GB");` add `  const contents = buildContents();`; after `    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },` add `    { key: "contents", split: "wide", label: COPY.home.contents.label, body: [<HomeContents key="contents" contents={contents} />] },`.

- [ ] **Step 6: The laws taught the form (Q2).** `scripts/harness/check_model_laws.mjs`: before `  const FOCAL_EXEMPT_FORMS = new Set([...EVEN_BY_RULING, "note-list", ...KEPT_BY_HIS_RULING_31]);` add:

```js
  /* THE HOME'S CONTENTS (plan 2026-10-13 home-quiet-editorial, Task 4B; his choice of 2026-10-13, quiet editorial: the atlas laid out as a
     contents page, no charts; Q2 of that plan): a department is a door to a part of the site, its rows names and its one kind of figure a
     trade row's own at 16, so it holds no figure at 30 by its own law, as the prose form and the seat form do. Named in MODEL PART 4's
     WHO HOLDS NO 30 in the same plan (Task 8). By form, wherever the form stands. */
  const CONTENTS_BY_HIS_SPEC = ["department"];
```

and that line becomes `  const FOCAL_EXEMPT_FORMS = new Set([...EVEN_BY_RULING, "note-list", ...KEPT_BY_HIS_RULING_31, ...CONTENTS_BY_HIS_SPEC]);`. Under Q2's B this step is skipped, `HomeContents`' Boxes take no `id` (a `data-section` attribute names each), the census and coverage checks of `contents.test.ts` read that attribute, and BLOCK FLOOR prints home-gb unmeasured; the controller rules before B is built.

`scripts/verify_archetype_coverage.ts`: after the `/* CityRows (plan 2026-10-10, ...) ... */` line add `/* Department (plan 2026-10-13 home-quiet-editorial, Task 4B): the home's contents entry, catalogued in rules/FORM-CATALOG.md VERSION 10. */`, and `"CountUnits", "CityRows"];` becomes `"CountUnits", "CityRows", "Department"];`.

- [ ] **Step 7: Run, census, laws.** TYPECHECK to `t4b-tsc.txt`: 0. RENDER to `t4b-render.txt`. CENSUS to `t4b-census.txt` (six `dept-*` rows in `docs/loop/CENSUS.md`, on Department). Test `tests/home/contents.test.ts` to `t4b.txt`: exit 0. Browser checks one at a time on `scratchpad/harness/pages/home-gb.html`, each to `t4b-<check>.txt`: page laws (no TAP SIZE, CARD FOOT BLANK, TEXT WIDE, ALIGNMENT, OPEN SECTION or ZONE SPLIT red in `#dept-*`), page holes (no NO LEAD or WALL), model laws (no FOCAL on `dept-*`; FLAG and FLAG ROOM on the flags), copy plain (each department one line, twelve words), readability (LEADING, MEASURE and CONTRAST hold). GATES `--only=pages-fresh,home-contents,archetype-coverage,census-fresh,harness-laws,harness-page-laws,harness-page-filter,harness-copy-plain,harness-readability,provenance,loud-seats,art-direction,distance-ladder,width-discipline,radius-uniform,type-floor-reader,spacing-pin,tiles-openers` to `t4b-gates.txt`: every one PASS (provenance home-gb stays 0: each trade figure stamped; art direction holds the home at 0: the index is tabular, the zones wide, wide, then the old levels).

- [ ] **Step 8: Photograph.** `shoot_page.mjs scratchpad/harness/pages/home-gb.html "#dept-countries" scratchpad/home-qe/shots/t4b-contents 1280,768,375` (the card and its zone, the whole contents) to `t4b-shoot.txt`; read each: two rows of three at 1280, two columns at 768, one at 375; the index muted beside each title; the hairlines; the flags with room; the photographs in grey; the icons and pictograms in ink, no terracotta; each trade's figure aligned at the right; the doors last.

- [ ] **Step 9: Commit.** `Department.tsx`, `HomeContents.tsx`, `home-view.tsx`, `globals.css`, `check_model_laws.mjs`, `verify_archetype_coverage.ts`, `docs/loop/CENSUS.md`; message `home:contents: the atlas as a contents page, six numbered departments in one wide zone drawn by the new Department form (number, title, line, member rows with their marks in ink, the door), each a section card; FOCAL names the form among those that hold no 30 (plan 2026-10-13 home-quiet-editorial, Task 4B)`.

---

### Task 5: the band, one solid statement (Q1 holds)

**Files:**
- Create: `src/components/spine/home/HomeBand.tsx`
- Delete: `src/components/spine/home/HomeRecord.tsx`, `src/lib/home/site_counts.ts`, `tests/home/site_counts.test.ts`
- Modify: `src/app/globals.css` (:1166-1173 THE ZONES' `:root`; :1286-1308 the terracotta zone and its print rule), `scripts/harness/check_page_laws.mjs:399-400`, `:413-416`, `src/components/spine/home/home-view.tsx` (imports, `LOUD_SEATS` seat 2, the zones), `src/lib/spine/copy.ts` (`record` replaced by `band`), `src/lib/spine/loud_seats.ts:41-49`, `scripts/lib/accent_walk.mjs:35-44`, `scripts/verify_loud_seats.mjs:208`, `:224`, `src/lib/spine/uk_sources.ts:22`, `:46-47`, `tests/spine/uk_sources.test.ts:1-10`, `:17`, `:96-108`, `tests/home/home_bands.test.ts:20`, `scripts/prebuild_all.ts` (the `site-counts` entry and its comment)
- Test: `tests/home/band.test.ts` (Task 1B); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `--terra-full` (Task 2), `ABOUT_THE_FIGURES` (Task 4A).
- Produces: `HomeBand()`; `COPY.home.band = { label: string; line: string }`; `--band-ink`; LOUD_SEATS seat 2 `{ seat: 2, card: "band", id: "band", ..., state: "FIELD" }`.

- [ ] **Step 1: The failing state is Task 1B's.** Test `tests/home/band.test.ts` to `t5-red.txt`: exit 1.

- [ ] **Step 2: The words.** In `src/lib/spine/copy.ts`, the block from `    /** THE BAND, "READ FROM THE RECORD" (plan 2026-10-10, the home reformed to ship, Task 5;` through the `    },` that closes `record: {` (its last entry `labels: { sources: "Official datasets", ... },`) is replaced by:

```ts
    /** THE BAND, ONE SOLID STATEMENT (plan 2026-10-13 home-quiet-editorial, Task 5; the spec's section 2, item 4; his decision of
     *  2026-10-13): the zone's name (a data attribute, not a printed word) and its one sentence, how every figure on the site is made, in
     *  About the figures' four words (the provenance stamp's kinds); its link is that page's name, ABOUT_THE_FIGURES. No figure, no count. */
    band: {
      label: "How figures are made",
      line: "Each figure is counted, worked out, looked up or estimated.",
    },
```

- [ ] **Step 3: The band.** Create `src/components/spine/home/HomeBand.tsx`:

```tsx
/**
 * HomeBand, THE BAND: ONE SOLID STATEMENT (plan 2026-10-13 home-quiet-editorial, Task 5; spec E:/atlas/docs/superpowers/specs/
 * 2026-10-13-home-quiet-editorial-design.md, section 2, item 4; his decision of 2026-10-13: "one solid statement: full-width brand
 * terracotta at full strength, white type, one sentence, a link to the method"). The page's one show-off and its one loud seat, lit by its
 * ground (LOUD_SEATS seat 2, FIELD). A ZONE, NOT A CARD, as the band before it was: the zone's own markup, one level and one cell, on the
 * tone globals.css gives `[data-zone][data-tone="terra"]` (THE ZONES: `--terra-full`, its words `--band-ink`, white), so no card law reads
 * it and the page laws' ZONE PAD and ZONE SPLIT read it as every zone. The sentence says how every figure on the site is made, in About the
 * figures' four words, at the section rung within half the page; the one link opens that page's reading section, underlined at rest
 * because a link on a coloured ground needs a mark besides its colour. No figure, no count, no digit (tests/home/band.test.ts,
 * tests/home/no_counts.test.ts).
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { ABOUT_THE_FIGURES } from "@/lib/home/contents";

export function HomeBand() {
  const C = COPY.home.band;
  return (
    <section data-zone="wide" data-tone="terra" data-zone-label={C.label} id="band" aria-labelledby="band-line">
      <div data-zone-level="" className="grid grid-cols-1">
        <div data-zone-cell="" className="min-w-0">
          <p id="band-line" className="max-w-[var(--measure-half)] text-pretty text-[length:var(--t-section)] font-semibold leading-9 tracking-tight text-[var(--band-ink)]">
            {C.line}
          </p>
          <a href={ABOUT_THE_FIGURES.href} className="tap-y mt-4 inline-flex min-h-11 items-center gap-1 text-[length:var(--t-lead)] font-medium leading-6 text-[var(--band-ink)] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80">
            <span>{ABOUT_THE_FIGURES.label}</span>
            <span aria-hidden>&#8594;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Its ground.** `src/app/globals.css`: in THE ZONES' `:root`, the lines `  /* THE BAND'S RULES (plan 2026-10-10, the home reformed to ship, Task 5; critique section 4): ink at 30 percent over the terracotta,` / `     1px, decorative, the only rules the band draws. */` / `  --band-rule: color-mix(in srgb, var(--c-ink) 30%, var(--terra));` become:

```css
  /* THE BAND'S INK (plan 2026-10-13 home-quiet-editorial, Task 5): white on the brand terracotta, every word of the band; ink in print. */
  --band-ink: var(--c-card);
```

(first `git grep -n "band-rule" -- src scripts tests > scratchpad/home-qe/t5-band-rule.txt 2>&1`: after HomeRecord's deletion in Step 6, globals.css alone names it). The comment `/* THE ONE TERRACOTTA ZONE (plan 2026-10-10, the home reformed to ship, Task 5; ...` through the print rule's closing `}` (:1286-1308) is replaced by:

```css
/* THE ONE TERRACOTTA ZONE, ONE SOLID STATEMENT (plan 2026-10-13 home-quiet-editorial, Task 5; his decision of 2026-10-13: "one solid
   statement: full-width brand terracotta at full strength, white type, one sentence, a link to the method"; it replaced the pale band of
   plan 2026-10-10, whose terracotta he called "very light"). The home's band stands on the brand terracotta at full strength, `--terra-full`,
   edge to edge as every zone does; every word on it is `--band-ink`, white, its hierarchy size and weight alone. The page laws' ZONE TONES
   read the colour from this token and accept it once, on home-gb; the loud-seats gate reads the zone as its seat's moment (FIELD), never as
   an accent figure. In forced colours the border drawn between zones (below) marks it. */
[data-zone][data-tone="terra"] {
  --zone-bg: var(--terra-full);
  --c-surface: var(--terra-full);
  color: var(--band-ink);
}
/* ON PAPER THE BAND IS INK ON WHITE (critique P2.11 of plan 2026-10-10): no fill in print, so a printed home stays legible. */
@media print {
  [data-zone][data-tone="terra"] {
    --zone-bg: var(--c-card);
    --c-surface: var(--c-card);
    --band-ink: var(--c-ink);
  }
}
```

- [ ] **Step 5: The page laws read the colour.** `scripts/harness/check_page_laws.mjs`: in the header, `terracotta zone, the home's band, accepted once and on home-gb only (plan 2026-10-10, Task 5).` becomes `terracotta zone, the home's band, accepted once and on home-gb only (plan 2026-10-10, Task 5), its colour --terra-full read from the stylesheet (plan 2026-10-13, Task 5).`. The comment and constant at :413-416 become:

```js
    /* THE ONE TERRACOTTA ZONE (his request of 2026-10-10 for one section in terracotta; his decision of 2026-10-13, one solid statement on
       the brand terracotta at full strength; plan 2026-10-13 home-quiet-editorial, Task 5): the home's band, accepted once and only on
       home-gb; on any other page, or a second time on the home, a red. Its colour is read from the token, never typed, so the token's value
       stays one line in globals.css; a token that does not resolve probes as transparent and is a red of its own, or a band left unpainted
       would match it and pass. */
    const TERRA = (() => { const d = document.createElement("div"); d.style.backgroundColor = "var(--terra-full)"; document.body.appendChild(d); const c = getComputedStyle(d).backgroundColor; d.remove(); return c; })(), TERRA_PAGE = "home-gb";
    if (/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(TERRA)) red("page", "ZONE TONES", "the band's colour --terra-full does not resolve; the one terracotta zone cannot be told from an unpainted one");
```

- [ ] **Step 6: The view, the seat, the old band out.** `home-view.tsx`: `import { HomeRecord } from "./HomeRecord";` and `import { buildSiteCounts } from "@/lib/home/site_counts";` are replaced by `import { HomeBand } from "./HomeBand";`; `  const record = buildSiteCounts();` is deleted; `    ...(record ? [{ key: "record", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.record.label, body: [<HomeRecord key="record" record={record} />] }] : []),` becomes `    { key: "band", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.band.label, body: [<HomeBand key="band" />] },`; seat 2 (`  { seat: 2, card: "record", id: "record", ...},`) becomes:

```tsx
  { seat: 2, card: "band", id: "band", figure: "the band, one solid statement on the brand terracotta, its words white", state: "FIELD", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 4): his decision of 2026-10-13, one solid statement in the brand terracotta at full strength; the zone is the seat's moment and holds no figure" },
```

and the zones' comment `the band only where all four of its counts build (SITE_COUNTS_MIN), drawing its own zone on the terracotta (HomeRecord); the foot always draws its doors.` becomes `the band always, drawing its own zone on the terracotta (HomeBand); the foot always draws its doors.`. `git rm src/components/spine/home/HomeRecord.tsx src/lib/home/site_counts.ts tests/home/site_counts.test.ts`. In `scripts/prebuild_all.ts` delete the comment `/* The terracotta band, "Read from the record" (plan 2026-10-10, ...` and its entry `  { name: "site-counts", script: "tests/home/site_counts.test.ts" },`.

- [ ] **Step 7: What named the old band.** Each edit makes a comment true again:
  - `src/lib/spine/loud_seats.ts`, the FIELD entry (:41-49, from ` *   FIELD                the seat is lit by its ground` through ` *                        its card's id as a LIT seat does.`), is replaced by:

```ts
 *   FIELD                the seat is lit by its ground, not by a figure: its
 *                        card is a zone painted the band's terracotta
 *                        (`[data-zone][data-tone="terra"]`, globals.css THE
 *                        ZONES; the home's band, one solid statement since
 *                        plan 2026-10-13), its words in the band's ink
 *                        (`--band-ink`). The walk counts that zone as the
 *                        seat's moment and never as an accent figure; an
 *                        accent inside it, a missing zone, or a terracotta
 *                        zone no FIELD seat names is the gate's red. It names
 *                        its card's id as a LIT seat does.
```

  - `scripts/lib/accent_walk.mjs`, the four lines from ` * A ZONE LIT BY ITS GROUND (plan 2026-10-10, the home reformed to ship, Task` through ` * loud moment with no accent text on it. The walk lists every such zone under`, are replaced by:

```js
 * A ZONE LIT BY ITS GROUND (plan 2026-10-10, the home reformed to ship, Task
 * 5; the spec's decision 7): the home's band is a zone painted the brand
 * terracotta (`[data-zone][data-tone="terra"]`, `--terra-full` since plan
 * 2026-10-13) whose words are the band's ink, white, a loud moment with no
 * accent text on it. The walk lists every such zone under
```

  - `scripts/verify_loud_seats.mjs` :208's remedy `"draw the zone (the home's band draws only with all four counts, SITE_COUNTS_MIN, and nothing with fewer: run node node_modules/tsx/dist/cli.mjs tests/home/site_counts.test.ts), or correct the declaration's card id"` becomes `"draw the zone (the home's band, HomeBand, draws on every render: run node node_modules/tsx/dist/cli.mjs tests/home/band.test.ts), or correct the declaration's card id"`; :224's `"a zone lit by its ground holds no accent: its figures to ink (--c-ink, 7.06:1 on --terra)"` becomes `"a zone lit by its ground holds no accent: its words in the band's ink (--band-ink on --terra-full)"`.
  - `src/lib/spine/uk_sources.ts` :21-22, the two lines that end `the class the` and begin ` * home's band counts by (plan 2026-10-10, Task 5;`, are replaced by:

```ts
 * its link where the records hold one), its attribution line, and whether its publisher is official (a public body), the class About
 * the figures marks (a note under each publisher that is not official; tests/spine/uk_sources.test.ts holds every entry to one). The test (tests/spine/uk_sources.test.ts) holds the list to the
```

and the `official` field's doc comment (:45-47, from `  /** Whether the publisher is a public body` through `holds every entry to a class. */`) is replaced by:

```ts
  /** Whether the publisher is a public body (a department, an agency, a regulator, a public corporation, the official record), so its
   *  datasets are official; false for a trade body, a commercial panel or a seller's own page. About the figures marks the ones that
   *  are not official; tests/spine/uk_sources.test.ts holds every entry to a class. */
```
  - `tests/home/home_bands.test.ts:20`: the REMEDY's ` (its band's four evidence counts are tests/home/site_counts.test.ts's)` is deleted.
- [ ] **Step 8: The sources test keeps the class without the band.** `tests/spine/uk_sources.test.ts`: in the header, `marking each` / `publisher that is not an official body (the flag the home's band counts by, so the band's figure can be reproduced from the list); and the` becomes `marking each` / `publisher that is not an official body; every publisher is classed, today's four that are not official pinned; and the`; delete `import { buildSiteCounts } from "../../src/lib/home/site_counts";`; before `/* THE NEW COMPANIES' FLOOR, IN WORDS` add (moved from the retired site_counts.test.ts):

```ts
/* THE CLASS OF EVERY PUBLISHER (the coordinator's ruling of 2026-10-10; moved here from tests/home/site_counts.test.ts, retired with the home's
   counts band by plan 2026-10-13 home-quiet-editorial, Task 5): each entry of both lists says `official`, true for a public body, false for a
   trade body, a commercial panel or a seller's own page; a publisher with no class is a red, and today's four that are not official are a
   tripwire, so a class that changes is read by a person. */
const NOT_OFFICIAL_TODAY = ["ukfinance", "brc", "worldpanel", "sellers"];
const unclassed = [...UK_SOURCES, ...WORLD_SOURCES].filter((s) => typeof (s as { official?: unknown }).official !== "boolean").map((s) => s.key);
check(`every publisher is classed official or not (${UK_SOURCES.length} in the UK list, ${WORLD_SOURCES.length} outside it)${unclassed.length ? `; no class: ${unclassed.join(", ")}` : ""}`, unclassed.length === 0, "give every entry of UK_SOURCES and WORLD_SOURCES official: true (a public body) or false (a trade body, a commercial panel, a seller's own page)");
const notOfficial = UK_SOURCES.filter((s) => s.official === false).map((s) => s.key).sort();
check(`the publishers that are not official are today's four (${notOfficial.join(", ") || "none"})`, JSON.stringify(notOfficial) === JSON.stringify([...NOT_OFFICIAL_TODAY].sort()), "a publisher's class changed, or one was added: confirm it in src/lib/spine/uk_sources.ts, then set NOT_OFFICIAL_TODAY in this test to match");
```

(the file's `check` is `(label, ok, remedy)`, its file always `src/lib/spine/uk_sources.ts`). In `thePage()`, the comment `/* THE LIST SAYS WHICH PUBLISHERS ARE OFFICIAL (the closing cleanup of plan 2026-10-10, ...` becomes `/* THE LIST SAYS WHICH PUBLISHERS ARE OFFICIAL (the closing cleanup of plan 2026-10-10, item 17): each publisher the flag marks as not official (a trade body, a commercial panel, a seller's own pages) carries a quiet "Not an official body." under its name, so a reader can tell the official datasets from the rest. */`; `  const band = buildSiteCounts()?.counts.find((c) => c.key === "sources")?.value;` is deleted and the check after it becomes:

```ts
  const officialItems = UK_SOURCES.filter((s) => s.official === true).reduce((t, s) => t + s.items.length, 0);
  check(`the items in the list without a note are the official publishers' items (${unmarked} of ${UK_SOURCES.reduce((t, s) => t + s.items.length, 0)}; official ${officialItems})`, unmarked === officialItems, OFFICIAL_AT);
```

- [ ] **Step 9: Run, then the laws.** Stage the deletions and `HomeBand.tsx`; COUNTS to `t5-counts.txt`; TYPECHECK to `t5-tsc.txt`: 0. RENDER to `t5-render.txt`. Test `tests/home/band.test.ts` to `t5-band.txt`: exit 0. GATES `--only=pages-fresh,home-band,loud-seats,harness-page-laws,harness-readability,harness-page-filter,uk-sources,home-bands,css-minifies,palette-membership,token-contrast,no-cream,art-direction,counts-fresh` to `t5-gates.txt`: every one PASS (loud-seats: seat 2 FIELD on `#band`, no accent in it; page laws: ZONE TONES accepts `--terra-full` once; readability: white on the band at 4.57). Home-shape (`t5-shape.txt`): the band zone's check PASS; its seats check, one check over all three seats, and the order stay red until Task 7A.

- [ ] **Step 10: Photograph.** `shoot_page.mjs scratchpad/harness/pages/home-gb.html "#band" scratchpad/home-qe/shots/t5-band 1280,768,375` to `t5-shoot.txt`; read each: the brand red edge to edge, the sentence white at 24 within half the page, the link white and underlined, no figure.

- [ ] **Step 11: Commit.** Every file of this task's Files; message `home:band: the band is one solid statement on the brand terracotta at full strength (--terra-full), white, "Each figure is counted, worked out, looked up or estimated." and one link to About the figures; the counts band and its test leave, the publishers' class held in uk_sources (plan 2026-10-13 home-quiet-editorial, Task 5)`.

---

### Task 6: the colophon (asks Q3 first)

**Files:**
- Create: `src/components/spine/home/HomeColophon.tsx`
- Modify: `src/components/spine/ReportFoot.tsx:12`, `:22`, `src/components/spine/home/home-view.tsx` (imports; the two foot lines :142-144), `src/lib/spine/copy.ts` (after `band`), `tests/spine/page_foot.test.ts:10-11`
- Test: `home-shape`, `page-foot`

**Interfaces:**
- Consumes: `OGL_LINE`, `UK_SOURCES_FOOT`, `reportHref`, `COPY.pageFoot`, `COPY.home.contents.method.corrections`, `checkedDateForTrade`, `homePickerSeed`.
- Produces: `HomeColophon({ checked }: { checked?: string | null })` rooted at `<section id="colophon" data-colophon="" data-page-foot="">`; `checkedDayText(iso: string): string` exported from `ReportFoot.tsx`; `COPY.home.colophon = { label: string; status: string }`.

- [ ] **Step 1: The failing state.** Test `tests/trust/home_shape.test.ts` to `t6-red.txt`: the colophon's two checks red.

- [ ] **Step 2: The words.** After the `band` entry in `copy.ts` insert:

```ts
    /** THE COLOPHON (plan 2026-10-13 home-quiet-editorial, Task 6; the spec's section 2, item 5): its name to a screen reader and the
     *  status page's link; the rest are the foot's own words (COPY.pageFoot, UK_SOURCES_FOOT) and the corrections log's (contents.method). */
    colophon: {
      label: "Sources and corrections",
      status: "Status",
    },
```

- [ ] **Step 3: One date formatter.** `ReportFoot.tsx:12`, the line that begins `const dateText = (iso: string) => new Date(` and formats a day with `toLocaleDateString("en-GB", ...)`, becomes:

```tsx
/** A held day as a page foot prints it, "1 October 2026", in UTC so the day never moves with the reader's clock (the home's colophon prints it too). */
export const checkedDayText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
```

and :22's `{dateText(checked)}` becomes `{checkedDayText(checked)}`.

- [ ] **Step 4: The colophon.** Create `src/components/spine/home/HomeColophon.tsx`:

```tsx
/**
 * HomeColophon, THE HOME'S LAST WORD (plan 2026-10-13 home-quiet-editorial, Task 6; spec E:/atlas/docs/superpowers/specs/2026-10-13-home-
 * quiet-editorial-design.md, section 2, item 5): one ruled block in place of the two small foot lines, gathering what a careful reader looks
 * for at a page's foot: the licence line the UK's figures ask for (OGL_LINE), Sources and licences, Report a mistake (this page's path,
 * src/lib/spine/report.ts; nofollow, since the correction page is a form), the corrections log, the site's status, and "Checked" with the
 * day the page's builder holds (src/lib/spine/checked.ts; the home's view passes the date of the h1's first case). At the body rung in
 * ink2, the licence line within the prose measure, a hairline between it and the links, every link 44 tall to the tap. It keeps the foot
 * lines' hook, data-page-foot, so globals.css paints it as the tint band edge to edge under the last zone, and the Report link and the
 * checked line keep theirs (data-report, data-checked), which tests/spine/page_foot.test.ts reads on every page.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { OGL_LINE, UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";
import { reportHref } from "@/lib/spine/report";
import { checkedDayText } from "@/components/spine/ReportFoot";

const LINK = "tap-y inline-flex min-h-11 items-center underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]";

export function HomeColophon({ checked = null }: { checked?: string | null }) {
  const C = COPY.home.colophon;
  return (
    <section id="colophon" data-colophon="" data-page-foot="" aria-label={C.label} className="pt-8 pb-8 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">
      <p data-licence="" className="max-w-[min(64ch,var(--measure-half))] text-pretty">
        {OGL_LINE}
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 border-t border-[var(--c-border)] pt-2">
        <li>
          <a href={UK_SOURCES_FOOT.href} className={LINK}>{UK_SOURCES_FOOT.link}</a>
        </li>
        <li>
          <a data-report="1" href={reportHref("/")} rel="nofollow" className={LINK}>{COPY.pageFoot.report}</a>
        </li>
        <li>
          <a href="/corrections" className={LINK}>{COPY.home.contents.method.corrections}</a>
        </li>
        <li>
          <a href="/status" className={LINK}>{C.status}</a>
        </li>
        {checked ? (
          <li data-checked="1" className="inline-flex min-h-11 items-center whitespace-nowrap">
            {COPY.pageFoot.checked} <time dateTime={checked}>{checkedDayText(checked)}</time>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: The view.** `home-view.tsx`: `import { SourcesFoot } from "@/components/spine/SourcesFoot";` and `import { ReportFoot } from "@/components/spine/ReportFoot";` are replaced by `import { HomeColophon } from "./HomeColophon";` and `import { homePickerSeed } from "@/lib/home/picker";`; in `SpineHomeBody` after `  const contents = buildContents();` add `  const ask = homePickerSeed();`; the JSX comment `{/* THE LICENCE LINE AND ITS LINK (MODEL 10.8c: the home prints UK register figures), THEN REPORT A MISTAKE (masterplan step 31). */}` and the two lines `<SourcesFoot iso2="GB" />` and `<ReportFoot path="/" checked={...} />` are replaced by:

```tsx
      {/* THE COLOPHON (plan 2026-10-13 home-quiet-editorial, Task 6; the spec's section 2, item 5): the licence line and the page's links, and the date of the h1's first case, restaurants in London, the date that page prints (src/lib/spine/checked.ts). */}
      <HomeColophon checked={checkedDateForTrade(ask.hidden.country, ask.hidden.subdivision, ask.hidden.industry)} />
```

`tests/spine/page_foot.test.ts:10-11`: `Since plan 2026-10-10 (the home reformed to ship, Task 6; the critique's P1.12) the home holds the line too: its` / `worked example prints the London restaurant page's figures, so its foot asks that page's date.` becomes `Since plan 2026-10-13 (home, quiet editorial, Task 6) the home's colophon holds` / `the line, the date of the h1's first case (restaurants in London), as that plan's spec asks (its Q3 names the doctrine it bends).`

- [ ] **Step 6: Under Q3's B only.** `HomeColophon` is called with no `checked`; `home-view.tsx` drops `checkedDateForTrade` and `ask`; `tests/spine/page_foot.test.ts:45` `{ file: "home-gb", path: "/", dated: true },` becomes `dated: false` and :79's `["src/components/spine/home/home-view.tsx", "trade"],` becomes `"none"]`; home_shape's colophon source check becomes `/<HomeColophon \/>/.test(code) && !/<SourcesFoot\b|<ReportFoot\b/.test(code)` and its render check drops `!!colophon.querySelector('[data-checked="1"] time[datetime]')` for `!colophon.querySelector("[data-checked]")`. Under A this step is skipped.

- [ ] **Step 7: Run.** TYPECHECK to `t6-tsc.txt`: 0. RENDER to `t6-render.txt`; GATES `--only=pages-fresh,home-shape,page-foot,uk-sources,home-no-counts,harness-page-laws,harness-readability,harness-links,dead-anchors` to `t6-gates.txt`: page-foot PASS (one Report link to `/corrections/new?page=%2F`, one checked line on home-gb); home-shape's colophon checks PASS; harness-page-laws: TAP SIZE holds on the colophon's links at 375; readability: the licence line under 78 characters a line.

- [ ] **Step 8: Photograph.** `shoot_page.mjs scratchpad/harness/pages/home-gb.html "#colophon" scratchpad/home-qe/shots/t6-colophon 1280,768,375` to `t6-shoot.txt`; read each: the tint band under the terracotta, the licence line, the hairline, the five links on one or two lines at 1280 and wrapped cleanly at 375.

- [ ] **Step 9: Commit.** `HomeColophon.tsx`, `ReportFoot.tsx`, `home-view.tsx`, `copy.ts`, `tests/spine/page_foot.test.ts`; message `home:colophon: one ruled colophon closes the home (the licence line, Sources and licences, Report a mistake, Corrections, Status, Checked with the date of the h1's first case) in place of the two foot lines (plan 2026-10-13 home-quiet-editorial, Task 6)`.

---

### Task 7A: the old sections leave with their tests

**Files:**
- Delete: `src/components/spine/home/HomeExample.tsx`, `src/components/spine/home/HomeProofs.tsx`, `src/components/spine/archetypes/CityRows.tsx`, `src/lib/home/worked_example.ts`, `src/lib/home/proofs.ts`, `src/lib/spine/home_answers.ts`, `tests/home/home_answers.test.ts`, `tests/home/foot.test.ts`
- Modify: `src/components/spine/home/home-view.tsx` (replaced whole), `src/lib/spine/copy.ts` (`lines`, `citiesLabel`, `citiesAll`, `citiesUnit`, `citiesHead`, `example`, `proofs` out), `src/components/spine/WhereNext.tsx` (`pitch` out), `src/components/spine/archetypes/CityCards.tsx:6-9`, `:116`, `src/components/spine/archetypes/CityParts.tsx:2-6`, `src/lib/spine/door_look.ts:4-6`, `:23-28`, `scripts/verify_archetype_coverage.ts:40-41`, `scripts/prebuild_all.ts` (home-answers and home-foot out; the home-how-made and home-archive comments)
- Modify (tests): `tests/home/archive.test.ts`, `tests/home/how_made.test.ts`, `tests/chrome/masthead.test.ts`, `tests/spine/home_forms.test.ts`; regenerated `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`

**Interfaces:**
- Consumes: every earlier task.
- Produces: the final home.

The fate of each test that reads the home, decided here (no test of a deleted component stays):

| Test | Fate |
|---|---|
| `tests/trust/home_shape.test.ts` | rewritten whole (Task 1A); green here |
| `tests/home/contents.test.ts`, `band.test.ts`, `no_counts.test.ts` | new (Tasks 1B, 1C) |
| `tests/home/home_answers.test.ts` (the worked example, the tax proof) | retired: its components and builders leave |
| `tests/home/foot.test.ts` (the city rows, where to next on the home, the foot's date) | retired: the small copies, crops, CityParts and the root closure moved to `contents.test.ts` in Task 1B; "From the blog" moves to `masthead.test.ts` below; the date is home_shape's colophon check |
| `tests/home/site_counts.test.ts` | retired in Task 5; the publishers' class moved to `uk_sources.test.ts` |
| `tests/home/archive.test.ts` | rewritten: the archive's slice and About the figures' #archive stay; the second proof's card, its re-export cases and the home's render leave |
| `tests/home/how_made.test.ts` | rewritten: the join, the pages read and About the figures stay; the first proof's card and the home's render leave |
| `tests/chrome/masthead.test.ts` | edited: the door arrow read from Department, not HomeProofs; "From the blog" added |
| `tests/spine/home_forms.test.ts` | kept: it tests props of components that stay (Rail, Ring, BarList, RangeStrip, CountUnits, FactRows, SegmentBar, MonthBars, StepMark); its header and one comment made true |
| `tests/home/picker.test.ts`, `destination.test.ts`, `hero_words.test.ts` | edited in Task 3 |
| `tests/home/home_bands.test.ts`, `tests/spine/uk_sources.test.ts`, `tests/spine/page_foot.test.ts` | edited in Tasks 5 and 6 |
| `tests/home/{duel,firms_last,kitchens,new_companies,us_restaurants,search_cascade}.test.ts`, `tests/trust/hero_still.test.ts`, `tests/app/head.test.ts` | kept unchanged (each holds a section absent from the home, or the hero's still words, or the h1 inside `#search`) |

- [ ] **Step 1: The failing state.** Test `tests/trust/home_shape.test.ts` to `t7a-red.txt`: red on the order, seats 1 and 3, the retired names, the h2 count, the type floor and the retired ids.

- [ ] **Step 2: The view, whole.** `src/components/spine/home/home-view.tsx` is replaced by:

```tsx
/**
 * THE HOME PAGE, QUIET EDITORIAL (plan E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, approved 2026-10-13). His words that led to it: "The homepage
 * talks about London and fails all the premises of what a homepage should include", and "It fails on establishing brand, not elegant and
 * slaps infographics which is soooo wrong at so many levels." His choice: quiet editorial, the brand first, the atlas laid out as a
 * contents page, no charts.
 *
 * The frame, in the order the page reads:
 *   the search    the positioning line beside the compass mark, "The reference atlas of small-business earnings." (his pick, the
 *                 no-eyebrow rule's one named exception), above his h1 with its two moving words (HeroWords, one timer that stops), and
 *                 the picker under it, which follows the h1's case until the reader reaches it (HomeAsk; src/lib/home/picker_cases.ts)
 *   the contents  one wide zone, six numbered departments (HomeContents, the Department form): countries, cities, trades, tools,
 *                 reading, how it is made, each member chosen by a rule read from the code (src/lib/home/contents.ts)
 *   Pro           only while the paywall's switch is on, quiet (ruling 23), after the contents
 *   the band      one solid statement on the brand terracotta at full strength, white, one sentence and one link to the method
 *                 (HomeBand), the page's one loud seat, lit by its ground
 * then the colophon: the licence line, Sources and licences, Report a mistake, the corrections log, status and the checked date
 * (HomeColophon). No worked example, proofs, counts, city rows or where-to-next list: each left with plan 2026-10-13, Task 7A, its tests
 * with it. Each level is a zone (src/components/spine/zones.tsx); tests/trust/home_shape.test.ts holds the order.
 *
 * Drawn by the root route's flagged branch (`isHomeReformEnabled()`), the harness surface `home` (page `home-gb`).
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { LogoMark } from "@/components/brand/LogoMark";
import { isPaywallOn } from "@/lib/feature_flags";
import { ProBand } from "./ProBand";
import { HomeAsk } from "./HomeAsk";
import { HomeContents } from "./HomeContents";
import { HomeBand } from "./HomeBand";
import { HomeColophon } from "./HomeColophon";
import { buildContents } from "@/lib/home/contents";
import { homePickerCases } from "@/lib/home/picker_cases";
import { homePickerSeed } from "@/lib/home/picker";
import { HERO_BUSINESSES, HERO_CITIES } from "@/lib/hero-words";
import { COPY } from "@/lib/spine/copy";
import { checkedDateForTrade } from "@/lib/spine/checked";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; plan 2026-10-13 home-quiet-editorial; the spec's sections 3 and 4): the band, lit by its ground
 * (FIELD: the brand terracotta is the moment, its words white); the contents and the colophon hold none. The question's two moving words
 * are his h1's red (data-founder-accent), never a seat. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "contents", figure: "none: the six departments are doors, a trade row's own figure in ink", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 3): his choice of 2026-10-13, the atlas as a contents page, no charts; a door holds no lit figure" },
  { seat: 2, card: "band", id: "band", figure: "the band, one solid statement on the brand terracotta, its words white", state: "FIELD", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 4): his decision of 2026-10-13, one solid statement in the brand terracotta at full strength; the zone is the seat's moment and holds no figure" },
  { seat: 3, card: "colophon", figure: "none: the colophon holds the licence line, the links and the checked date", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13, home quiet editorial (the spec's section 2, item 5): the page ends quiet" },
] as const satisfies readonly LoudSeat[];

/** The search: the positioning line, then the question and the picker that follows it (HomeAsk). Left-aligned, as every band page's text
 *  is. THE POSITIONING LINE (the spec's section 2, item 1; his pick of 2026-10-13): the category the site owns, a serious line at the head
 *  rung beside the compass mark in the brand terracotta, never a small capitals kicker (scripts/verify_no_eyebrow.ts names it the rule's one
 *  exception); 16 under it to the question, 24 from 1024. THE QUESTION IS ASKED ONCE (his instruction of 2026-10-07): the h1 asks it, so
 *  the picker draws no heading, and its fields follow the h1's case. */
function HomeSearch() {
  const C = COPY.home;
  return (
    <div data-hero="1">
      <section id="search" className="flex flex-col">
        <p data-positioning="" className="mb-4 flex items-center gap-3 text-[length:var(--t-head)] font-semibold leading-7 text-[var(--c-ink)] lg:mb-6">
          <LogoMark size={24} className="shrink-0 text-[var(--terra-full)]" />
          <span>{C.positioning}</span>
        </p>
        <HomeAsk lead={C.h1.lead} middle={C.h1.middle} businesses={HERO_BUSINESSES} cities={HERO_CITIES} cases={homePickerCases()} />
      </section>
    </div>
  );
}

export function SpineHomeBody({ data = null }: { data?: { iso2?: string } | null } = {}) {
  /* `data` stays in the signature for the root route's and the harness's call ({ iso2: "GB" }); the home reads nothing from it since plan
     2026-10-13: each department's rule reads its own lists (src/lib/home/contents.ts). */
  void data;
  const contents = buildContents();
  const ask = homePickerSeed();
  /* Each zone one line, so tests/trust/home_shape.test.ts reads its split and its body together. The band draws its own zone on the
     terracotta (HomeBand); Pro only with the paywall's switch on. */
  const zones: Array<{ key: string; split: ZoneSplit; tone?: "terra"; label: string; body: React.ReactNode[] }> = [
    { key: "search", split: "wide", label: COPY.home.searchLabel, body: [<HomeSearch key="search" />] },
    { key: "contents", split: "wide", label: COPY.home.contents.label, body: [<HomeContents key="contents" contents={contents} />] },
    ...(isPaywallOn() ? [{ key: "pro", split: "2-1" as ZoneSplit, label: COPY.home.pro.kicker, body: [<ProBand key="pro" />] }] : []),
    { key: "band", split: "wide" as ZoneSplit, tone: "terra" as const, label: COPY.home.band.label, body: [<HomeBand key="band" />] },
  ];
  /* THE TONES ALTERNATE OVER THE ZONES THAT ARE NOT THE BAND (critique section 7 of plan 2026-10-10): the search takes the tint, the
     contents the paper, Pro the tint again when it draws; the band draws its own zone on the terracotta. */
  const toned = zones.filter((z) => z.tone !== "terra");
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z) =>
          z.tone === "terra" ? (
            <React.Fragment key={z.key}>{z.body}</React.Fragment>
          ) : (
            <Zone key={z.key} tone={zoneTone(toned.indexOf(z))} split={z.split} label={z.label}>
              {z.body}
            </Zone>
          ),
        )}
      </div>
      {/* THE COLOPHON (the spec's section 2, item 5): the licence line and the page's links, and the date of the h1's first case, restaurants in London, the date that page prints (src/lib/spine/checked.ts). */}
      <HomeColophon checked={checkedDateForTrade(ask.hidden.country, ask.hidden.subdivision, ask.hidden.industry)} />
    </>
  );
}
```

(Under Q3's B, `ask`, `homePickerSeed`, `checkedDateForTrade` and the colophon's prop go, as Task 6, Step 6 says.)

- [ ] **Step 3: The parts and their builders leave.** First the importers, each to its file: `git grep -n "HomeExample\|HomeProofs\|CityRows\|worked_example\|lib/home/proofs\|lib/spine/home_answers" -- src scripts > scratchpad/home-qe/t7a-importers.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t7a-importers.txt`. Expected after Step 2: only the six files this step deletes (each names another of them) and the four whose comments Step 6 rewrites (`CityCards.tsx`, `CityParts.tsx`, `door_look.ts`, `verify_archetype_coverage.ts`); anything else stops the task. Then `git rm src/components/spine/home/HomeExample.tsx src/components/spine/home/HomeProofs.tsx src/components/spine/archetypes/CityRows.tsx src/lib/home/worked_example.ts src/lib/home/proofs.ts src/lib/spine/home_answers.ts tests/home/home_answers.test.ts tests/home/foot.test.ts`. In `scripts/prebuild_all.ts` delete the comment that begins `  /* The worked example and the third proof on the home (plan 2026-10-09,` with the entry `  { name: "home-answers", script: "tests/home/home_answers.test.ts" },` under it, and the comment that begins `  /* The home's foot (plan 2026-10-10,` with `  { name: "home-foot", script: "tests/home/foot.test.ts" },`. The comment above `{ name: "home-how-made", ... }` (three lines, from `  /* Section 4, how figures are made, is the join now:`) becomes:

```ts
  /* Section 4, how figures are made, is the join now: a year of notices matched by name to the register, the notices, the names and
     the names found, and the London trade pages read from the band counts. About the figures prints the join in its #failures and the
     pages read in its #reading (the home's proof card of them left with plan 2026-10-13). */
```

and in the comment above `{ name: "home-archive", ... }`, after `its source deferred on a build server.` add ` About the figures prints it in #archive.` (inside the comment, before its `*/`).

- [ ] **Step 4: The words that leave.** `src/lib/spine/copy.ts`, in `COPY.home`: delete the comment `/** THE ANSWERS' SHORT LINES ...` and the line `lines: { answer: ..., years: ... },`; the line `citiesLabel: "The UK’s cities",`; the comment `/** THE HOME'S CITY ROWS ...` with `citiesAll` and `citiesUnit`; the comment `/** THE COLUMN HEAD over the figures ...` with `citiesHead`; the block from `    /** THE WORKED EXAMPLE (plan 2026-10-09, home introduction;` through the `    },` after `      paysDoor: "Try your own",`; the block from `    /** THE THREE PROOFS (plan 2026-10-09, home introduction;` through the `    },` after the `tax:` line. Then `git grep -n "COPY\.home\.\(lines\|citiesLabel\|citiesAll\|citiesUnit\|citiesHead\|example\|proofs\)" -- src scripts tests > scratchpad/home-qe/t7a-copy.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t7a-copy.txt`: no hit (exit 1). The block comment above `home: {` (`/** THE HOME PAGE ON THE BAND PAGE (masterplan steps 32 to 37; ...`) becomes `/** THE HOME PAGE (plan 2026-10-13 home-quiet-editorial: the positioning line, his h1 with its business and city rotating between the words, the contents, the band, the colophon); its other keys are the sections it once drew, now on /gb and /new-businesses, which read them from here. */`.

- [ ] **Step 5: WhereNext's pitch.** `git grep -n "pitch" -- src/components src/app > scratchpad/home-qe/t7a-pitch.txt 2>&1`: WhereNext.tsx alone. `WhereNext.tsx`: its header comment (lines 1-10) is replaced by:

```tsx
/**
 * WhereNext, WHERE TO NEXT AS DOORS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Tasks 5 and 10; the home's spec of
 * 2026-10-09, section 6). Furniture, not a reading: no figure, so it stands outside the section cards (no Box), its heading at the head
 * rung and one row a door, a hairline between, each row the whole width a plain link read without script. It fills the half its level
 * gives it (`even`, ruling 7: cards in a row share a height): the list takes the height left under the heading and its rows share it
 * from 768; stacked under 768 each row keeps its own. /new-businesses draws it; the home drew it until plan 2026-10-13 (home, quiet
 * editorial, Task 7A), which also took out its `pitch`, the home's 56px slots beside the city rows. Not the terminus: that archetype
 * holds three doors and no two of them may open on one word, and these are the site's ways out.
 */
```

The signature `export function WhereNext({ id = "next", title, doors, pitch = false }: { id?: string; title: string; doors: readonly NextDoor[]; /** The page stands this list beside ... */ pitch?: boolean }) {` becomes `export function WhereNext({ id = "next", title, doors }: { id?: string; title: string; doors: readonly NextDoor[] }) {`; `<ul className={pitch ? "mt-4 grid flex-1 grid-cols-1 md:auto-rows-[56px]" : "mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr"}>` becomes `<ul className="mt-3 grid flex-1 grid-cols-1 md:auto-rows-fr">`.

- [ ] **Step 6: Comments that named the rows and the proofs.**
  - `CityCards.tsx` :6-9, the paragraph that begins ` * THE PAGER'S FILE SINCE 2026-10-10`, is replaced by:

```tsx
 * THE PAGER'S FILE SINCE 2026-10-10 (plan docs/superpowers/plans/2026-10-10-home-reform, Task 6; the ship audit's 3.5): the home's
 * still rows (CityRows.tsx) drew the UK's cities on the home until plan 2026-10-13 retired them, and the picture's recipe and the money
 * grammar moved to CityParts.tsx, which this file and the home's contents read. This file keeps the pager and its two forms: the tall
 * cards, and the row form for a set under four.
```

and :116's `(the home's rows draw their own door, CityRows)` becomes `(a caller that draws its own door passes neither)`.
  - `CityParts.tsx` :2-11, the header's two paragraphs, are replaced by:

```tsx
 * CityParts, THE CITY CARDS' SHARED PARTS: the photograph's recipe (DuotonePhoto) and the money grammar of a set of cities (moneyFor).
 * Moved out of CityCards.tsx (plan docs/superpowers/plans/2026-10-10-home-reform, Task 6; the ship audit's 3.5) into a file with no
 * client directive, so a server page (the home's contents, since plan 2026-10-13) and the pager's client cards (CityCards.tsx) draw one
 * recipe, and the home ships no client code for its photographs. CityCards no longer re-exports DuotonePhoto (cleanup item 21 of that
 * plan): the callers import it from here.
 *
 * Since that plan the picture also takes the small copy's own size (`width`, `height`, so the browser keeps its box before it
 * decodes), a crop that keeps its landmark in a short frame (`position`, the CSS object-position), a veil of the caller's own
 * (`veil`; the home's contents hide the veil and keep the picture in grey), and decodes off the main thread (`decoding="async"`, the
 * critique's P1.11), on every card.
```

  - `door_look.ts` :5-6 (` * arrow). A door is a link whose name stands with an arrow at its edge: the home's three proof doors, Where to next's rows and the` and the line after it) become:

```ts
 * arrow). A door is a link whose name stands with an arrow at its edge: the home's department rows (Department.tsx, since plan
 * 2026-10-13), Where to next's rows and the 404's six. Their classes were copied from file to file and kept in step by a test that read one file's source from another's test;
```

and DOOR_ARROW's doc comment (:22-27) is replaced by:

```ts
/**
 * The arrow every door carries at its edge (critique pass 3, fix round D2, item P2.6: "each door carries the arrow every other door on the site carries"): the glyph
 * (&#8594;, aria-hidden) at the body rung in ink2, never shrinking, on the title row's 20px line. The home's department rows and their doors draw it as it stands
 * (Department.tsx, since plan 2026-10-13; the home's proof doors drew it before), and so do the 404's doors; a test compares what each draws
 * with this constant by import (fix round F1, group G9: the 404 had a copy of these classes, kept in step by a regex over HomeProofs.tsx's source).
 */
```
  - `verify_archetype_coverage.ts`: the `/* CityRows (plan 2026-10-10, ...) ... */` line is deleted and `"CountUnits", "CityRows", "Department"];` becomes `"CountUnits", "Department"];`.
- [ ] **Step 7: The tests rewritten.**
  - `tests/home/archive.test.ts`: the header's paragraph from ` * THE CARD DRAWS THE JOINS' OWN YEAR, NOT THE LAST TWELVE MONTHS HELD` through ` * windows built here from the real ones, without touching a file.` becomes ` * THE JOINS' YEAR: the months the archive holds inside the window the failure rates read (data/home/method.json) sum to those rates'` / ` * notices, so About the figures' #archive and #failures agree; a re-export in the right order (the failures table, then method and archive)` / ` * moves the window with the months. The home drew both as proof cards until plan 2026-10-13 (home, quiet editorial), which retired them.`; the imports `import { buildProofs, proofArchive } from "../../src/lib/home/proofs";`, `import { ProofArchive } from "../../src/components/spine/home/HomeProofs";` and `import { COPY } from "../../src/lib/spine/copy";` are deleted; `import { buildArchive, monthName, daysWords, type Archive } from "../../src/lib/home/archive";` becomes `import { buildArchive, monthName, daysWords } from "../../src/lib/home/archive";` and `import { buildJoins, type Joins } from "../../src/lib/home/how_made";` becomes `import { buildJoins } from "../../src/lib/home/how_made";`; the helper `const esc = ...` and its doc line are deleted; the comment `own and not through the builder, because the card draws the archive's months inside it. */` becomes `own and not through the builder, because About the figures prints the archive's months inside it. */`; in THE BUILDER's comment `the twelve inside the joins' year, the months the home's second proof draws, sum to the joins'` / `notices, proof 1's figure.` becomes `the twelve inside the joins' year sum to the joins'` / `notices (About the figures prints both).`; the block from `/* A RE-EXPORT MUST NOT MOVE THE CARD` through the `}` closing `if (built && joinsNow && span && method) {`, and the block from `/* THE SECOND PROOF (plan Task 8;` through the `}` closing `if (proofs && built) {`, are deleted; in `main`, the comment `/* ABOUT THE FIGURES' #archive (plan Task 2), where the second proof's door lands: the builder's months and copies, no source named. */` becomes `/* ABOUT THE FIGURES' #archive (plan Task 2 of the home introduction): the builder's months and copies, no source named. */`, and the block from `  /* THE HOME'S RENDER (Task 10), where the harness wrote it: the second proof, stamped, behind its door. */` through `  } else if (!home) console.log("DEFER  scratchpad/harness/pages/home-gb.html is not rendered here; the home's render check did not run");` is deleted.
  - `tests/home/how_made.test.ts`: the header's `Holds the proof` / ` * (src/lib/home/proofs.ts, HomeProofs.tsx) and, where the harness wrote it, the home's render; since plan 2026-10-10 (the home` / ` * reformed to ship, Task 4) the proof's ring reads the names found in 100, in ink, and its title is the door, with its arrow.` becomes `The home's proof` / ` * of the join (src/lib/home/proofs.ts, HomeProofs.tsx) left with plan 2026-10-13 (home, quiet editorial); its card's checks went with it.`; the imports `import { buildProofs } from "../../src/lib/home/proofs";`, `import { ProofJoins } from "../../src/components/spine/home/HomeProofs";` and `import { COPY } from "../../src/lib/spine/copy";` are deleted; REMEDY's `; then draw the first proof from the slice` is deleted; the block from `/* THE FIRST PROOF (Task 8 of the home introduction;` through the `}` closing `if (proofs && joins) {` is deleted; in `main`, the label `"About's destination heading stays \"Failures, trade by trade\" (the first proof's door lands on it)"` becomes `"About's heading for the join stays \"Failures, trade by trade\""`, and the block from `  /* THE HOME'S RENDER (Task 10), where the harness wrote it: the first proof, stamped, behind its door; how figures are made gone. */` through `  } else if (!home) console.log("DEFER ...");` is deleted.
  - `tests/chrome/masthead.test.ts`: :52 `const PROOFS = "src/components/spine/home/HomeProofs.tsx";` becomes `const DEPARTMENT = "src/components/spine/archetypes/Department.tsx";`; :766's `carries the arrow the home's proof doors carry, read here from HomeProofs.tsx' own DoorTitle and not typed:` becomes `carries the arrow the home's department rows carry, read here from Department.tsx as drawn and not typed:`; the comment :790-794 becomes `/* ONE ARROW FOR EVERY DOOR, COMPARED BY IMPORT (fix round F1, group G9): the classes are DOOR_ARROW in src/lib/spine/door_look.ts, read by the home's Department rows (since plan 2026-10-13; HomeProofs' DoorTitle before) and by the 404, spelled in neither; the test imports the constant, renders a department with one row and its door and reads its two arrows, and the 404's six. */`; the lines `  const { buildProofs } = await import("../../src/lib/home/proofs");` and `  const { ProofTax } = await import("../../src/components/spine/home/HomeProofs");` become `  const { Department } = await import("../../src/components/spine/archetypes/Department");`; `  const builtProofs = buildProofs();` and `  const proofArrows = builtProofs ? arrowsIn(renderToStaticMarkup(React.createElement(ProofTax, { p: builtProofs.tax as never }))) : [];` become `  const deptArrows = arrowsIn(renderToStaticMarkup(React.createElement(Department, { dept: "tools", index: "04", title: "Tools", line: "One line.", rows: [{ key: "decide", href: "/decide", name: "Decide", mark: null, figure: null }], door: { label: "All tools", href: "/tools" } })));`; `ARROW_AT`'s remedy becomes `"export const DOOR_ARROW from src/lib/spine/door_look.ts (the arrow's classes), draw it with DOOR_ARROW in src/components/spine/archetypes/Department.tsx (each member row and the door) and in src/app/not-found.tsx, and spell the classes in neither"`; in the next check `every door carries the arrow the home's proof doors carry` becomes `every door carries the arrow the home's department rows carry`, `${proofArrows.length} on a proof door` becomes `${deptArrows.length} on a department's row and door`, and `proofArrows.length === 1 && JSON.stringify(proofArrows[0]) === JSON.stringify(DOOR_ARROW_TOKENS)` becomes `deptArrows.length === 2 && deptArrows.every((a) => JSON.stringify(a) === JSON.stringify(DOOR_ARROW_TOKENS))`; in the check after it, `"DoorTitle and the 404 import DOOR_ARROW` becomes `"Department and the 404 import DOOR_ARROW` and both `code(PROOFS)` become `code(DEPARTMENT)`. After that check add (moved from the retired foot test):

```ts
  /* THE BLOG DOOR'S NAME (the critique's P2.7 of plan 2026-10-10; moved from tests/home/foot.test.ts with the home's foot, plan 2026-10-13):
     Where to next, on /new-businesses and wherever it stands, calls the blog by the name the nav, the footer and the page give it. */
  const blogDoor = nextDoors(null).find((d) => d.href === "/blog");
  check(`"${blogDoor?.label}" opens /blog, and no door is the notebook`, blogDoor?.label === "From the blog" && blogDoor?.key === "blog" && !nextDoors(null).some((d) => /notebook/i.test(`${d.key} ${d.label}`)), { file: "src/lib/home/next_doors.ts", remedy: "name the blog door \"From the blog\" (COPY.home.next.doors.blog), the nav's and the footer's name" });
```

(the file's `check` takes `{ file, remedy }` as its third argument; read its signature first and match it).
  - `tests/spine/home_forms.test.ts`: after its header's first paragraph (whose last line ends `changes nothing where it is not.`) add the two lines:

```ts
 * Since plan 2026-10-13 (home, quiet editorial, Task 7A) the home draws none of these forms; the props stay on the shared components, each off
 * by default, and are held here until a page uses them or a plan retires them.
```

and the comment :185-188 (from `/* THE EDGE IS ONE KEY, NOT A STRING COMPARED IN TWO FILES` through `(tests/home/home_answers.test.ts renders it). */`) is replaced by:

```ts
/* THE EDGE IS ONE KEY, NOT A STRING COMPARED IN TWO FILES (fix round F1, group G5, the D1 review's Minor 4). FactRows drew the soft grey's edge when
   `r.swatch === "var(--c-soft2)"`, a literal the home's tax key wrote too, so renaming the token in one file dropped the edge in silence. A row now
   says it carries the edge: `edged`, and the colour decides nothing. The home's tax key set it until plan 2026-10-13 retired that card; nothing
   passes it today. */
```
- [ ] **Step 8: Run, census, laws.** COUNTS to `t7a-counts.txt`; TYPECHECK to `t7a-tsc.txt`: 0. RENDER to `t7a-render.txt`; CENSUS to `t7a-census.txt`. Tests to their files: home_shape `t7a-shape.txt` exit 0; contents, band, no_counts exit 0; archive, how_made, masthead, home_forms exit 0. GATES `--only=pages-fresh,home-shape,home-contents,home-band,home-no-counts,home-archive,home-how-made,home-forms,home-bands,home-duel,home-firms-last,home-kitchens,home-new-companies,home-us-restaurants,masthead,page-foot,uk-sources,archetype-coverage,census-fresh,loud-seats,provenance,harness-laws,harness-page-laws,harness-page-filter,harness-copy-plain,harness-readability,harness-links,art-direction,dead-anchors,dead-links,counts-fresh` to `t7a-gates.txt`: every one PASS (loud-seats: no LIT seat, the band FIELD; harness-laws: BLOCK FLOOR 6 against 5; harness-links: the home's distinct links over its floor of 11; provenance home-gb 0).

- [ ] **Step 9: Commit.** Every deleted and modified file of this task, `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`; message `home:old-sections-out: the worked example, the three proofs, the city rows and the home's where-to-next leave with their builders and tests; archive, how-made, masthead and home-forms hold what stays; the home is search, contents, Pro, band and colophon (plan 2026-10-13 home-quiet-editorial, Task 7A)`.

---

### Task 7B: the home's source joins the scans

**Files:**
- Modify: `scripts/lib/spine_scan.mjs:59`, `:62`; `scripts/verify_no_eyebrow.ts:82`, `scripts/verify_subsection_icons.ts:57`, `scripts/verify_no_bold_display.ts:57`, `scripts/verify_banned_patterns.ts:56`, `scripts/verify_bar_budget.ts:95`; regenerated `scripts/gates.json`, `CLAUDE.md`
- Test: `spacing-pin`, `type-floor-reader`, `tiles-openers` (as Task 0, Step 2 recorded which read `scanSpine`), and the five surface gates

**Interfaces:**
- Consumes: Task 7A's final home files.
- Produces: every `.tsx` under `src/components/spine/home/` read by the spine scans and the five surface gates.

- [ ] **Step 1: The scan set takes the home in.** In `scripts/lib/spine_scan.mjs`, delete the line ``  [`${SPINE_ROOT}/home/`, "the homepage's own view, project 3 of the owner's design goals of 2026-10-12: the spec changes it only where it shares a kit piece, and the pin reads those pieces where the kit defines them"],``, and the `WhereNext.tsx` line's reason becomes `"the where-to-next doors of the /new-businesses page, named out with its view (openings/): no country, city, trade, industry or district page draws it, and the home has not drawn it since plan 2026-10-13"`. Above the PAGES THE SPEC DOES NOT NAME comment, add ``  /* src/components/spine/home/ IS READ since plan 2026-10-13 home-quiet-editorial, Task 7B: the home's project is built, so its source holds the spine's distances, type floor and tiles rules like every page the kit draws. */``.

- [ ] **Step 2: The five surface gates read the folder.** In each of `verify_no_eyebrow.ts`, `verify_subsection_icons.ts`, `verify_no_bold_display.ts` and `verify_banned_patterns.ts`, the line `  "src/components/spine/home/home-view.tsx", // the home page on the band page (masterplan step 32), after home2-view` becomes `  ...tsxIn("src/components/spine/home"), // the home's view and every piece it draws (plan 2026-10-13 home-quiet-editorial, Task 7B: the folder, so a new piece is read from its first commit)`; in `verify_bar_budget.ts`, `  { name: "home", budget: 2, files: ["src/components/spine/home/home-view.tsx"] }, // masterplan step 32, after home2-view` becomes `  { name: "home", budget: 2, files: tsxIn("src/components/spine/home") }, // the home's folder (plan 2026-10-13 home-quiet-editorial, Task 7B)`. Each file's `tsxIn` returns `[]` for a folder that does not exist and reads one level, which is the home folder's whole depth.

- [ ] **Step 3: Run each, one change one verification.** COUNTS to `t7b-counts.txt` (the five gates' reads now name the folder). GATES `--only=spacing-pin,type-floor-reader,tiles-openers,no-eyebrow,subsection-icons,no-bold-display,banned-patterns,bar-budget,distance-ladder,counts-fresh` to `t7b-gates.txt`. Expected: spacing-pin prints the home's files among those read and no hand-rolled opener, focal block or basis line in them; type-floor-reader (where it reads `scanSpine`) no small class in `home/*`; tiles-openers (where it reads `scanSpine`) no `<Ico` in `home/*`; no-eyebrow reads `HomeAsk.tsx` and the rest and keeps one `data-positioning`; subsection-icons: ProBand's Rail carries its icon; bar-budget: home 0 of 2. A red here names a home file's own fault: fix it in that file in this task and list it in the report. Where Task 0, Step 2 found that `type_floor.test.ts` or `tiles_openers.test.ts` walks its own folder list, the report says that this step changed nothing for it.

- [ ] **Step 4: Commit.** The six scripts, `scripts/gates.json`, `CLAUDE.md`, and any home file Step 3 fixed; message `home:scans-read-home: the spine scan and the eyebrow, subsection-icon, bold, banned-pattern and bar-budget gates read the whole home folder now its project is built (plan 2026-10-13 home-quiet-editorial, Task 7B)`.

---

### Task 8: the written rules

**Files:**
- Modify (E:/atlas): `design/loop/build/briefs/MODEL.md` (PART 4 :163, PART 6 :251 and :260, PART 8 :598, PART 9 :948, PART 10 :1072), `rules/FORM-CATALOG.md` (append), `rules/FOUNDER-VERDICTS.md` (append)
- Modify (website): `docs/design-system/GUIDELINES.md` (0.2, 0.3, 0.7)

**Interfaces:**
- Consumes: the gate names `home-contents`, `home-band`, `home-no-counts`, `no-eyebrow`, `harness-laws`; Q1, Q2 and Q3 as he answered them.
- Produces: written rules that say what the gates hold.

- [ ] **Step 1: MODEL.md.**
  - PART 4, the paragraph beginning `**WHO HOLDS NO 30, read off this table and PART 8, settled 2026-09-17` (:163), gains at its end (after `the finding stays until the data lands.`), on the same line:

```markdown
 A HOME CONTENTS DEPARTMENT (the `department` form, 2026-10-13, his choice of quiet editorial: the atlas laid out as a contents page, no charts) is a door to a part of the site: its rows are names, and its one kind of figure is a trade row's own at 16, so it holds no 30 by its own law, as the prose form and the seat form do, and is exempt (`FOCAL_EXEMPT_FORMS` in check_model_laws.mjs, website plan 2026-10-13 home-quiet-editorial, Task 4B).
```

  - PART 6, after the bullet `- The trade, industry and neighbourhood lists are in 8.6, 8.7 and 8.8, each with its seat ledger. The spine is the authority and this list describes it (2026-09-17, plan step 3).` (:251) add the bullet:

```markdown
- Home (2026-10-13, his choice of quiet editorial): the band is the one loud moment, lit by its ground (FIELD): the brand terracotta at full strength, white type, one sentence and a link to the method, no figure; the question's two moving words are his h1's red (`data-founder-accent`), never an accent; the contents and the colophon hold none. On the home terracotta stands in four places only: the wordmark, the question's moving words, the positioning line's mark and the band.
```
  - PART 6, the paragraph `**TERRACOTTA NEVER APPEARS** on a heading, ...` (:260) gains at its end: ` One mark is his: the home's positioning line carries the compass mark in the brand terracotta beside its words (2026-10-13), one of the home's four terracotta places.`
  - PART 8, `2. **Form.** No two adjacent sections share a form. The three bar cards sit in three different bands.` (:598) gains ` The home's contents (2026-10-13) are six departments inside one section, so the rule reads that section's neighbours (the question above, the band below), never the departments beside each other.`
  - PART 9, clause 11 (:948) `11. The place named twice on one page, a bold h1, a world median in the masthead, and an eyebrow above any title. (2026-08-30, 2026-07-10, 2026-07-11.)` becomes `11. The place named twice on one page, a bold h1, a world median in the masthead, and an eyebrow above any title, but one: the home's positioning line above its h1, his named exception of 2026-10-13, a serious sentence-case line beside the compass mark, never a kicker (website scripts/verify_no_eyebrow.ts holds its form). (2026-08-30, 2026-07-10, 2026-07-11, 2026-10-13.)`
  - PART 10, clause 69 (:1072) `69. A third surface, a stripe per section, or two neighbouring zones in one tone.` becomes `69. A third surface, a stripe per section, or two neighbouring zones in one tone; the one third surface is the home's band, his rulings of 2026-10-10 (one section in terracotta) and 2026-10-13 (one solid statement in the brand terracotta at full strength), gated once and on the home only by the page laws' ZONE TONES.`
- [ ] **Step 2: FORM-CATALOG.md**, appended:

```markdown
## VERSION 10, 2026-10-13: the home's contents department

**Department** (`src/components/spine/archetypes/Department.tsx`, stamps `data-archetype="department"`): one part of the atlas as a contents
entry, his choice of quiet editorial for the home (website plan 2026-10-13 home-quiet-editorial; spec
E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3). Its number (01 to 06, muted, in the figures'
face), its title at the head rung, one plain line, three or four member rows and its door. A member row is one shape everywhere: its mark
(a flag, a city's grey photograph, a trade pictogram or a site icon, in ink), its name, a figure only where the model asks for one (a trade
row carries its own world net, stamped), the arrow every door carries. No accent, no 30 (MODEL PART 4 names the form). Free of the bar
budget (it draws no bar); not a visual form for KIND REPEATED. Six stand in one section on the home, so the adjacency rule reads that
section's neighbours.
```

- [ ] **Step 3: FOUNDER-VERDICTS.md**, appended:

```markdown
## The home, quiet editorial (2026-10-13, in chat)

His words that day: "The homepage talks about London and fails all the premises of what a homepage should include. Furthermore the
terracotta used in the background of that section is very light. Homepage is a total mess." Then: "It fails on establishing brand, not
elegant and slaps infographics which is soooo wrong at so many levels." His decisions: the reference is quiet editorial (think FT or
Monocle); "The question with moving parts should remain, for the other things do as you choose, but position the page as #1 page on its own
niche, above this H1 with moving parts, it is deeply needed."; the band one solid statement, full-width brand terracotta at full strength,
white type, one sentence, a link to the method. His pick for the positioning line: "The reference atlas of small-business earnings." The
no-eyebrow rule takes one named exception for that line. Spec: E:/atlas/docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md;
plan: E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md.
```

His answers to the plan's Q1, Q2 and Q3 are the controller's to add under this entry, each verbatim with its date; the implementer writes none.

- [ ] **Step 4: GUIDELINES.md.** In 0.2, after the row that begins `| Terracotta never appears on a heading, kicker, h1, border,` add:

```markdown
| On the home, terracotta stands in four places only: the wordmark, the question's moving words, the positioning line's mark and the band (the brand terracotta at full strength, white type, one sentence). | `home-band` (the band's colour, ink and one statement), `home-shape` (the positioning line's mark), `loud-seats` (the band its one FIELD seat) | 2026-10-13 |
```

In 0.3, after the row that begins `| A page's block count clears its page type's floor:` add:

```markdown
| The home's catalog is one contents section of six numbered departments, each a title of four words or fewer, one line, at most four members chosen by a rule read from the code, and its door; a department is never padded. | `home-contents`; FOCAL names the `department` form (`check_model_laws.mjs`) | 2026-10-13 |
```

In 0.7, after the row that begins `| No em dashes in user-visible source;` add:

```markdown
| No eyebrow above a title (rulebook rule 11), with one named exception, his of 2026-10-13: the home's positioning line, a serious sentence-case line beside the compass mark above the question, twelve words at most, no rank word. | `no-eyebrow` | 2026-07-10; the exception 2026-10-13 |
| The home prints no country, city or trade-list count, in figures or in words, and no figure but a trade row's and the Pro band's. | `home-no-counts` | his ruling of 2026-10-07; gated 2026-10-13 |
```

- [ ] **Step 5: Verify the text.** `git -C E:/atlas diff -- design/loop/build/briefs/MODEL.md rules/FORM-CATALOG.md rules/FOUNDER-VERDICTS.md > scratchpad/home-qe/t8-atlas-diff.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/t8-atlas-diff.txt` (run from E:/atlas/website so the file lands in its scratchpad); read it: no em-dash, no typed count, each edit dated. GATES `--only=no-em-dashes,no-source-agencies,counts-fresh` to `t8-gates.txt`: PASS.

- [ ] **Step 6: Commit, in two repositories.** E:/atlas: `git -C E:/atlas add design/loop/build/briefs/MODEL.md rules/FORM-CATALOG.md rules/FOUNDER-VERDICTS.md`; message `rules: the home, quiet editorial (his choice of 2026-10-13): the department form and its FOCAL exemption, the band the home's one loud moment and one third surface, the positioning line's named exception, his verdict recorded (website plan 2026-10-13 home-quiet-editorial, Task 8)`. Website: `docs/design-system/GUIDELINES.md`; message `docs:home-gates: GUIDELINES names the gates that hold the quiet editorial home (home-contents, home-band, home-no-counts, the no-eyebrow exception) (plan 2026-10-13 home-quiet-editorial, Task 8)`.

---

### Task 9: verification (the spec's section 5)

**Files:**
- Create (scratch): `scratchpad/home-qe/after/*`, `scratchpad/home-qe/report.md` (the report the controller reads; not committed)

**Interfaces:**
- Consumes: Task 0's before files and tool; every gate above.
- Produces: the before and after table, the browser checks compared, the photographs, the paywall-on form, the chain's and the build's results.

- [ ] **Step 1: After render and reading.** RENDER to `after/render.txt`; copy `home-gb.html` to `after/home-gb.html`; `node scratchpad/home-qe/measure_home.mjs scratchpad/home-qe/after/home-gb.html > scratchpad/home-qe/after/measure.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/measure.txt`. The table, before against after, each from its file: zones (`wide "Search" | wide "The atlas" | wide/terra "How figures are made"`), h1 1 and h2 6, figures (only the trades' rows, each stamped), digits outside a figure (0), terracotta classes (the positioning mark, the h1's two words), distinct internal links, characters under 14px (0 small, 0 allowed).

- [ ] **Step 2: The browser checks, after,** one at a time, Task 0's Step 5 again with `after/` files to `after/<check>.txt`. For each rule: after's reds never outnumber before's; a new red stops the work and is reported with its line.

- [ ] **Step 3: Photographs after,** one at a time at 1280, 768 and 375: `"#search"` (`after-top`), `"#dept-countries"` (`after-contents`: the card and its zone, all six), `"#band"` (`after-band`), `"#colophon"` (`after-colophon`), each run's output to `after/shoot-<part>.txt`. Read each against the spec: the category nameable from the first screen; no chart, no single city's story, no run of figures; terracotta in the four places only. The controller reads them too. Then the spec's section 1 measure, "every catalog entry is reachable above the fold's second screen at 1280", with one browser and nothing beside it: write `scratchpad/home-qe/fold.mjs` (scratch, an `.mjs` run by node, so the function handed to the page is plain JavaScript):

```js
// scratchpad/home-qe/fold.mjs (plan 2026-10-13 home-quiet-editorial, Task 9): where the departments' doors end, against the second screen.
// usage: node scratchpad/home-qe/fold.mjs <render.html> [width] [height] [bar]. BLIND SPOT: a render holds no masthead, so the bar's height
// (the sticky header in production) is added by hand; one viewport height stands for every laptop.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const [, , file, w = "1280", h = "800", bar = "64"] = process.argv;
const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: Number(w), height: Number(h) } })).newPage();
  await p.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
  const r = await p.evaluate(() => { const doors = [...document.querySelectorAll("[data-dept-all]")]; return { n: doors.length, last: Math.max(0, ...doors.map((d) => d.getBoundingClientRect().bottom + window.scrollY)) }; });
  const end = r.last + Number(bar);
  console.log(`${file} at ${w}x${h}: ${r.n} department doors, the lowest ends at ${Math.round(end)}px with the bar; the second screen ends at ${2 * Number(h)}px: ${r.n === 6 && end <= 2 * Number(h) ? "within" : "past"}`);
} finally { await b.close(); }
```

`node scratchpad/home-qe/fold.mjs scratchpad/home-qe/after/home-gb.html 1280 800 > scratchpad/home-qe/after/fold.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/fold.txt`: "6 department doors ... within". "Past" stops the work: the controller rules on the air before anything is tightened.

- [ ] **Step 4: The paywall's form.** `NEXT_PUBLIC_PAYWALL=1 NEXT_PUBLIC_AUTH_ENABLED=1 node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx home gb > scratchpad/home-qe/after/render-pro.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/render-pro.txt`; copy the render to `after/home-gb-pro.html`; test home_shape against it by copying it over `scratchpad/harness/pages/home-gb.html` and running `tests/trust/home_shape.test.ts` to `after/shape-pro.txt` (Pro after the contents and before the band, h2 7, its prices exempt), then page laws and model laws on `after/home-gb-pro.html`; then RENDER again without the variables, so the chain's render is the switch-off page. `node scripts/harness/check_paywall.mjs > scratchpad/home-qe/after/paywall.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/paywall.txt` (it renders its own locked forms): exit 0.

- [ ] **Step 5: The typecheck, the chain and the build (the controller's).** TYPECHECK to `after/tsc.txt`: 0. `npm run verify:deploy > scratchpad/home-qe/after/chain.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/chain.txt`: every gate passed (the count is CLAUDE.md's generated block). `npm run verify:deploy -- --build > scratchpad/home-qe/after/build.txt 2>&1; echo "exit $?" >> scratchpad/home-qe/after/build.txt`: 0. Then the built page seen: `node node_modules/next/dist/bin/next start -p 3100` in the background, one browser: `node scripts/harness/shoot_page.mjs http://localhost:3100/ "#search" scratchpad/home-qe/shots/built-top 1280,375` and the same for `"#dept-countries"` and `"#band"`, the server stopped after; read each. Then a final review of the branch (superpowers:requesting-code-review).

- [ ] **Step 6: His word for the deploy,** then `npm run deploy:watch -- --marker=data-positioning` and a production probe of `/`: the positioning line above the h1, six departments with their doors, the band on the brand terracotta with one sentence and one link, the colophon with its date; photographs at 1280 and 375 from the production URL with `shoot_page.mjs`.

---

## Out of scope, noted

- The buyer department (project 4), the London trade picker (project 2), the rhythm reform (project 1).
- Props of shared components the home no longer passes, left in place and held by `tests/spine/home_forms.test.ts` until a page uses them or a plan retires them: StepMark (exported, no caller), RangeStrip `oneRow`, Ring `size="lead"` and `layout="row"`, FactRows `swatch` and `edged`, MonthBars `prov`, CountUnits `fine`, SegmentBar `parts`.
- A story for `Department` in `src/components/spine/archetypes/stories.tsx` (the archetype harness's sheet): no gate asks for one; add it when the form is drawn on a second page.
- The design repo's PAGES.md census block (the controller runs `census.ts --write` against it) and QUEUE.md and STATE.md.
