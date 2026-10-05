# Phase A, steps 01 to 04: what is wrong on live pages, before anything new is sold

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**Goal:** no address answers a page for a thing that does not exist, no live page prints a coined score or a struck method word,
and the London pages' remaining unsourced figures become sourced, labelled or withheld. His enduring rule (memory
`project_marginatlas_direction`): data quality first, no visibly wrong numbers. These come first because Pro will sell the same
pages: selling a page that carries a wrong figure sells the wrong figure.

**What the map of 2026-10-05 measured** (read-only agents over source and the 2026-10-05 renders):
- `/gb/london/<any word>` renders a synthesized default page at 200 (`[country]/[geo]/[industry]/page.tsx` L384-394,
  `adapt_cell.ts` L110-116, L342-348), canonical to itself and indexable (every `/gb/...` page indexes, `src/lib/seo/indexable.ts`).
  `/industries/<word>` and `/cities/<word>` call `notFound()` inside a streamed page and answer 200: the root and route
  `loading.tsx` files open a streaming boundary, so the status is sent before the body runs (`src/middleware.ts` L126-166 says so).
  The middleware pins a real 404 only for one- and two-segment paths under a country (`isPlaceWeDoNotHold`, L193-269, applied
  L460-465).
- Live legacy pages print a coined 0-100 score (his ruling 11: "no composite, ever") or "modeled": `EasiestToBreakIn` on the
  legacy region pages (`/gb/england`, `/us/california`), `BreakInScore` and `OpeningChecklist` on `/{c}/{geo}/{trade}/opening`,
  `BuyVsStartCompare` on `/buy-or-start`, `/industries/[x]/across` (a 0-100 break-in score), `MakeItYoursPanel` and
  `kit/sections.tsx` on the noindexed `[sub]` pages, and the words in `/extremes`, `/faq`, `/terms`, `/tools`, `/coverage`,
  `/compare/cities/[pair]`, `/calculator`, `/methodology`, `/about-data`. `/about-data` (L105-193) still teaches a "coverage chip"
  and "Modeled"; `/methodology` (L29, 95-99, 147) promises "a confidence label on every figure", which no page prints.
- Labels audit (`E:/atlas/design/loop/build/research/2026-10-02-labels-audit-uk-pages.md`) items still open: 10, 15, 17, 18
  (partly), 19, 22 (partly), 23, 24. Item 15 needs a download (parked); the rest can be fixed from files on disk.

---

## Step 01: an address for nothing answers 404

**Why.** A page that answers for a word that names nothing is an indexable page of invented content; on `/gb` it is a UK page,
so it indexes. QUEUE `launch:retired-trades-live` recommended "the edge 404 for words that name nothing"; milestone 1 built the
retired-trade redirects only.

**Files:**
- Create: `src/lib/routing/edge_not_found.ts`; Test: `tests/routing/edge_not_found.test.ts`
- Create (generated, small): `src/lib/routing/hood_slugs.ts` and `scripts/gen_hood_slugs.ts` (writes it from `spineHoodDistricts`)
- Modify: `src/middleware.ts` (call it beside `isPlaceWeDoNotHold`, after every redirect: renames, aliases, retired trades)

- [ ] **Read first:** the middleware whole; `isPlaceWeDoNotHold`; `retiredPlaceTarget`; the rename and alias handling of trade
  slugs (`src/lib/taxonomy/retired.ts`, `src/lib/taxonomy.ts` `SLUG_TO_INDUSTRY`, any alias map the cell route or middleware uses);
  `cityPathFor`; the three-segment neighbourhood landing (`findNeighborhoodContext`, cell route L355-358). The middleware runs on
  the edge: import only what it already imports or small tables; never `hood_scheme.ts` (it pulls the neighbourhood data).
- [ ] **Test first** (rule `edge-not-found`), a pure `edgeNotFound(path: string): boolean` answering true only for a path that
  can name nothing: `/gb/london/zz-not-a-trade` true; `/gb/london/restaurants` false; a retired slug false (the redirect owns
  it); a renamed or aliased slug false (its redirect owns it); `/industries/zz` true; `/industries/restaurants` false;
  `/cities/zz` true; `/cities/london` false; `/cities/london/neighborhoods/zz` true; `/cities/london/neighborhoods/west-end` false;
  `/gb/how-to-open` false; any path the middleware already pins (`isPlaceWeDoNotHold`) unchanged. Read the old sitemap shards
  (`src/app/sitemap.ts` history: `git log -p --follow src/app/sitemap.ts | grep -m 50 neighborhood`) for three-segment
  neighbourhood URLs that were ever published: if any exist, those slugs answer a 308 to the city's hub (a URL carries equity and
  never dies without a redirect) and the test says so.
- [ ] **Generate the district table:** `scripts/gen_hood_slugs.ts` writes `src/lib/routing/hood_slugs.ts` (city slug to its
  district slugs) from `spineHoodDistricts`; a test asserts the file equals a fresh generation, so it cannot drift.
- [ ] **Wire it:** where `isPlaceWeDoNotHold` answers its pinned 404 (L460-465), answer the same response for `edgeNotFound(path)`.
- [ ] **Verify:** the test; `tsc`; `retired-paths`, `dead-links`, `doors`, `robots`, `indexable`; and the middleware's size: if
  step 18's `npm run build` has not run yet, run it here under the protocol's memory rule and read the middleware size line
  (Vercel's edge limit is the ceiling; record the number in the ledger).
- [ ] **Commit:** `01: an address that names nothing answers 404 at the edge, never an invented page`.

---

## Step 02: no coined score and no struck word on any live page

**Why.** His ruling 11 forbids a composite score anywhere; his copy correction of 2026-09-24 struck the method words; the About
and methodology pages promise marks no page prints. Milestone 1's M11 cleaned every `COPY` string; these live outside it.

**Files:** the components and routes listed above (each read before it is touched); Create
`tests/copy/legacy_method_words.test.ts` and `scripts/copy/legacy_method_words_baseline.json`.

- [ ] **The gate first** (rule `legacy-method-words`): walk string literals and JSX text in `src/app` and `src/components`
  (skip `src/app/dev`, `src/app/_design`, `src/lib/spine/copy.ts`, which `copy-no-method-words` reads), comments stripped with
  `scripts/lib/strip_comments`, against the plain-copy gate's list read from `scripts/harness/check_copy_plain.mjs` (the parse
  `tests/spine/copy_no_method_words.test.ts` uses), plus the words `modeled`, `confidence label`, `coverage chip`, and any 0-100
  score label (`/100`, `out of 100`, `score`) in a component that prints a place or trade ranking. A ratchet per file: the
  baseline is seeded at the count after this step's fixes and only falls (`--write-baseline` after a fix lowers it).
- [ ] **Coined scores leave the page** (ruling 11 outranks the older "replace never cut" for a composite, because a composite is on
  the NEVER list): `EasiestToBreakIn` on the region pages, `BreakInScore` and `BreakInMasthead` on `/opening`, the across page's
  break-in score. Where a section's only content is the score, the section is withdrawn from the page; where the section also
  holds real figures, the score column or line goes and the figures stay. A redirect is not needed: no URL changes.
- [ ] **The words:** each "modeled"/"modelled" in visible text says it plainly in the register M11 used ("estimated", "an
  estimate", or nothing); aria labels the same (`RangeStrip.tsx` L195-208 builds "Modelled range from"). `/about-data` stops
  teaching the coverage chip and tiers and points to its own "How to read a figure" section (M9's four kinds); `/methodology`
  stops promising a confidence label on every figure and says what pages do print (the half-filled mark and its line, the four
  kinds). No new promise is written.
- [ ] **Verify:** the new gate (seeded), `copy-no-method-words`, `no-em-dashes`, `banned-vocabulary`, `tsc`, `dead-links`, `census-fresh`.
- [ ] **Commit:** `02: no coined score and no struck word on any live page; About and methodology teach what pages print`.

---

## Step 03: London's city page carries sourced figures or none

**Why.** Labels audit items 19, 22, 23 and 24 are on `/cities/london`, a UK page that indexes and that Pro will sell.

**Files:** read the audit's items first; then the builders behind each card (`city_hero_board.ts`, the districts card's builder,
the customers card's builder, the premises card's builder) and the data each reads.

- [ ] **Item 19, rent by district:** replace the modelled multipliers (1.00x to 2.50x) with rateable value per square metre from
  `E:/atlas/registers/uk/tables/london_premises_value_by_borough.json` (35 areas; aggregated statistics, never the rating list
  itself, which is never republished). Map boroughs to the seven districts only where the district's definition in
  `data/cities/neighborhoods_v1.json` is made of whole boroughs; a district made of parts of boroughs gets no figure (an en dash,
  clause 18) rather than a borrowed one. Extend `E:/atlas/registers/uk/export_for_site.py` to write the slice the site reads; the
  `uk-registers` gate (`scripts/verify_uk_registers.ts` L30) requires exactly four slices in `data/uk/registers/`, so put the new
  slice in `data/uk/registers_extra/` with its own pin test, or widen that gate's list with the reason. Provenance: counted.
- [ ] **Item 23, what customers earn:** the OECD decile ratios times our median become ASHE April 2025 for London's employees:
  p10 £23,990, p90 £76,903 (`E:/atlas/design/loop/build/research/2026-09-25-uk-official-figures.md` L31, with its source line).
  Write them into a data file with the source URL and the checked date, convert at the site's rate (the audit used x1.3265:
  $31.8K and $102.0K; use the site's own FX module, never a typed rate). Provenance: looked up.
- [ ] **Item 22, the hand-anchored cost of living** (the peers' column and the hero's "Cost of living 48"): no source holds it,
  so it is withheld (an en dash in the column; the hero cell takes the next sourced figure the hero builder holds, or the cell is
  withheld if none). Never a hand-typed index.
- [ ] **Item 24, the premises figures** ($5,000 prime, $1,750, $200, +5%, a 6-month deposit against the country's 3, 1.5 of 100
  empty, $1,400 fit-out, 12 months rent-free, permits $610, crew pay, "Official visit a year 1"): each one is sourced from a file
  on disk (with its source line), or labelled as the estimate it is (provenance kind estimate, its basis line saying so plainly),
  or withheld. The two deposits disagree: print one, from the source that holds it, or neither. The hero's "City permits 56 days"
  is the longest single wait, not a total: its label says what it is (three words at most).
- [ ] **Verify:** re-render `city london`; `harness-laws`, `harness-copy-plain`, `harness-page-laws`, `provenance` (only falls),
  `archetype-copy`, `model-laws-copy`, `no-source-agencies`, `uk-registers`; look at the photographs of the changed cards.
- [ ] **Commit:** `03: London's city page: rents by district from the valuation statistics, customer pay from ASHE, no hand-typed index`.

---

## Step 04: the London trade pages and /gb, the rest of the audit

**Files:** the audit's items 10, 17, 18; QUEUE rows `country:cities-region-line`, `cell:manchester-resolves-london`,
`city:invented-words-elsewhere`; the builders behind each card.

- [ ] **Item 10, the world's typical on every London trade page** ("Where each $100 goes", "What staff cost", "Covering the
  costs", "Where sales come from", "What a customer spends", "Firms per 10,000 people", "20 of 100 close a year", "Chain-owned",
  "When the week pays"; copy keys `copy.ts` L1713, 1934, 1966, 2003, 2021, 2210). Where a register on disk answers the same
  question for London, use it: firms per 10,000 people from `data/uk/registers/turnover.json` and the population the city page
  already reads; insolvencies from `data/uk/registers/failures.json` (a different measure from closures: the card's label changes
  with the figure). Where nothing on disk answers it, the card says once, plainly, that the figure is the trade's typical, never
  with the struck phrase "typical for the trade anywhere"; the basis line is the card's one supporting line.
- [ ] **Item 17 on /gb:** the peers' constants and the "What locals know" notes with no source: each sourced from a file, or the
  line goes (a number with no source is the visibly wrong figure his rule forbids); the spectra keep their kept form (his ruling 31).
- [ ] **Item 18 residue:** "Open a business bank account 21 days" (shard text, unsourced: withhold or source); "Time to sell ...
  Among the lowest tenth" ranked against agent estimates (withhold the ranking, keep the figure only if sourced).
- [ ] **The cities' region line:** London, Manchester and Birmingham say "England", Leeds says nothing: one source for every UK
  city's line, the same depth for all (London is Greater London, his ruling of 2026-10-04).
- [ ] **Verify two queued suspicions:** `/gb/manchester/<trade>` (if the route renders) must not print London's figures
  (`cell:manchester-resolves-london`): render one, compare the head figure with London's; if equal, withhold it there and add a
  test. District words invented by `tagLabel` (`adapt_hood.ts` L157, `NeighborhoodExplorer.tsx`): if any still prints on a hub or
  district render, remove it.
- [ ] **Verify:** re-render the UK harness pages; `harness-laws`, `harness-copy-plain`, `harness-page-laws`, `provenance`,
  `archetype-copy`, `london-trade-hero`, `london-trade-sales`, `lasts-uk`, `copy-no-method-words`.
- [ ] **Commit:** `04: the London trade pages and /gb: register figures where they answer, the trade's typical said once, unsourced lines gone`.
- [ ] **Park** in `PARKED.md`: item 15 (household spending shares need the ONS Family Spending workbooks, a download).
