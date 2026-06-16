# 04 — Page Reform Phases

Planning document only. No code is changed and no installs are run here. This file
specifies the detailed, page-by-page phases for reforming the five locked page types
into the constitution: the six narrative bands, the chart kit, the type law, the
warm OKLCH tokens, and the 12 / 6 / 4 column grid.

Read alongside:
- `00-research-answer-source.md` (the resource catalog and the visual ideology: the
  six bands, the three reading lanes, the chart language matrix, the five north-stars).
- `06-ground-truth.md` (the literal current state: tokens, fonts, the five locked
  section orders, the gates, the honesty boundary, the hard constraints).

---

## The immutable spine (read before any phase)

The five locked page types and their fixed, ordered section sets are immutable. The
reformation changes HOW each section is composed and visualised, never WHICH sections
exist, and never their order. Concretely:

- Every section in a type's locked list is always present, in its own row, in the
  spec order. Nothing is added, removed, merged-out-of-existence, or reordered without
  the founder.
- The six narrative bands are a COMPOSITION layer over the locked order, not a
  replacement for it. A band is a contiguous run of locked sections that share one
  idea and one dominant visual rhythm. Bands never resequence the underlying rows;
  they group consecutive rows and give the group a shared frame, a quiet left-rail
  identity, and a single answer-first claim.
- `src/lib/page-sections.ts` predates the 2026-06-16 spec and must be rewritten to
  match the locked orders. That rewrite is part of P1 (it lands with the cell), and is
  re-verified by `verify_page_sections` + `verify_section_order` in every later phase.

The six bands (from the ideology, `00-research-answer-source.md` Part B):
1. The answer — masthead, distribution spread, calculator.
2. The verdict — honest take, tangible units, the quick why-this-number.
3. The economics — P&L, cost levers, owner keeps, break-even.
4. The operating reality — risks, pay by role, cost to open, seasonality, first-year ramp.
5. The comparison field — comparable places, versus the world, related links.
6. The trust layer — operator voices, prose story, one-line takeaway, methodology.

The governing rule for every band is ONE IDEA PER BAND: one dominant visual, one crisp
claim, one explanatory paragraph, one trust cue. Title first, number second, reason
third, caveat fourth.

The chart-language matrix (the section-to-chart law, from `00` Part B "Chart language"):
each statistic gets the right visual form, drawn from the existing kit
(`src/components/kit/charts/` plus the kit family) restyled through tokens. Primary
renderer visx, static/prototype renderer Observable Plot + JSDOM, math/format from D3.
Where a kit primitive already exists (RangeStrip, MoneyGoesBreakdown, Waterfall,
ThresholdGauge, SeverityGlyph, TimelineRibbon, LikeForLikeBars, TierBar, ComparisonBars,
VisitorSplit, ScoreBand, HeatStrip, FootfallGrid) the phase reuses it and does not build a
parallel chart.

### The three constitution tests (applied at every prototype review)

Every band, on every page, is reviewed against three tests before it is wired to real data:
- SKIM test: a reader scanning at speed gets the band's one claim from the title and the
  dominant visual alone, without reading the paragraph.
- SAMENESS test: no two adjacent bands look like the same visual treatment; the page
  reads as a guided spread, not an 18-card stack of identical cards.
- ONE-IDEA test: the band carries exactly one idea. If a section is trying to say two
  things, the second belongs to the next row, not a second visual crammed into this band.

### Shared verification contract (applies to ALL five phases)

Every phase's "verify" step runs, in this order (per `docs/verification-protocol.md`):
1. Instruction fidelity: the locked section list for the page is present, complete, in
   order. No section dropped, renamed, or resequenced.
2. Gates: `npx tsc --noEmit` clean; `npm run prebuild` 31/31; `verify_page_sections` and
   `verify_section_order` PASS; hard constraints clean (no em-dashes, no source-agency
   names, no URL slug renames, tokens only, WCAG AA, 375px no horizontal scroll).
3. Data honesty: real data where held; data-not-held sections keep an honest, clearly
   tagged SAMPLE or empty state inside the built frame, never a fabricated real-looking
   number, never a wall of dashes. London is the ONE fully-filled exemplar where inventing
   editorial specifics is sanctioned (`isLondon`); everywhere else self-omits honestly.
4. SEE it (Playwright MCP): render and screenshot at desktop 1280 and mobile 375, a filled
   exemplar AND a thin instance, confirm with eyes that the change is present, nothing is
   broken / blank / washed-out / overlapping, no data sits behind imagery, the hierarchy is
   answer-first, and the page coheres with the other reformed types.
5. Honest report: state samples, deferrals, judgment calls, and risks with real output.
6. Ship discipline: preview, founder nod, then promote. Promote held until Wave F per the
   one-cohesive-ship decision; phases land on `reform-v2/r6-forward`.

The prototype-first method (used by every phase): build each page as a static-data
prototype in the `/dev` harness first (the harness already hosts `/dev/cell`, `/dev/charts`,
`/dev/country`, `/dev/cities`, `/dev/home`, `/dev/compare`), review against the three tests,
THEN wire the real view-model and verify. The harness never ships; it is the seeing surface.

---

## P1 — London Restaurants cell (the template)

This is the template phase. The cell sets the band composition, the chart-per-section
choices, and the wiring pattern that P2 to P5 follow. It also carries the rewrite of
`src/lib/page-sections.ts` to the locked orders.

Route: `[country]/[geo]/[industry]`, live at `/gb/london/restaurants`. London is the
fully-filled exemplar (`isLondon`), so the cell is the one place every section fills and
the band composition can be judged at full density. The cell is also the lightest
engraved touch per the unified-language decision: frame plus hero plus dividers only, the
dense data board stays the star.

### Goal

Compose the 18 locked cell sections (plus the section-0 calculator) into the six bands,
assign each section its chart from the matrix, prove it as a static prototype seen at 1280
and 375, then wire it to the real cell view-model at `/gb/london/restaurants`. Establish the
reusable band-frame and chart-binding pattern for the rest of the site.

### The locked section list it MUST keep (never add / remove / reorder)

From `06-ground-truth.md` section 2.4, verbatim order:
0. Make-it-yours calculator (above the body, directly under the masthead number)
1. Masthead — typical revenue + its spread
2. The honest take
3. In plain terms — the number in tangible units
4. Where the money goes
5. What moves the cost
6. What the owner keeps
7. Break-even
8. What to watch — the risks
9. Pay by role
10. Cost to open
11. Through the year
12. Your realistic first year
13. The same business nearby
14. Operator voices
15. Versus the world
16. The story in plain words
17. One thing to remember
18. Related

### Substeps

1. Map sections to bands (composition only, order preserved):
   - Band 1 The answer: section 1 Masthead + spread, section 0 calculator (rendered
     directly under the masthead anchor number as the spec places it).
   - Band 2 The verdict: section 2 honest take, section 3 in-plain-terms tangible units.
   - Band 3 The economics: section 4 where the money goes, section 5 what moves the cost,
     section 6 what the owner keeps, section 7 break-even.
   - Band 4 The operating reality: section 8 what to watch, section 9 pay by role,
     section 10 cost to open, section 11 through the year, section 12 first year.
   - Band 5 The comparison field: section 13 same business nearby, section 15 versus the
     world. (Section 14 operator voices and section 18 related are placed by their locked
     position, see note below.)
   - Band 6 The trust layer: section 14 operator voices, section 16 the story in plain
     words, section 17 one thing to remember, section 18 related.
   - Composition note: bands group CONSECUTIVE locked rows. Where the locked order
     interleaves a trust-layer row inside a comparison run (section 14 sits between 13 and
     15), the row stays in its locked position; the band label follows the dominant idea of
     the run and the row keeps its own frame. The locked order always wins over a tidier
     grouping.

2. Choose the chart per section from the matrix (reuse the kit; restyle through tokens):
   - 1 Masthead: RangeStrip / min-median-high band with labelled percentile anchors;
     the single masthead anchor number is the only Newsreader numeral on the page.
   - 0 Calculator: MakeItYours controlled inputs plus a live range band, not a separate
     dashboard.
   - 2 Honest take: HonestTakeBox verdict plus a break-in difficulty gauge (ThresholdGauge
     family), per the round-2 locked treatment.
   - 3 In plain terms: icon-unit equivalence cards (compact, no decorative pictographs
     unless they clarify scale).
   - 4 Where the money goes: MoneyGoesBreakdown per-$100 bar with a vermillion tick on the
     kept row (the one loud accent for this view).
   - 5 What moves the cost: ranked sensitivity / tornado bars (ComparisonBars family).
   - 6 What the owner keeps: large retained amount plus a moss-highlighted take-home band.
   - 7 Break-even: ThresholdGauge with a fixed-cost marker.
   - 8 What to watch: SeverityGlyph per risk row, ordered by severity.
   - 9 Pay by role: aligned role/pay table with local wage context (kit tables); reflows to
     labelled bar lists at 375.
   - 10 Cost to open: range bar with category callouts.
   - 11 Through the year: 12-month seasonality line or HeatStrip, not a decorative calendar.
   - 12 First year: TimelineRibbon step sequence plus a cumulative line.
   - 13 Same business nearby: LikeForLikeBars ranked dot/bar.
   - 15 Versus the world: percentile dot plot (ComparisonBars / dot-plot family), not a
     choropleth.
   - 14 Operator voices: quote cards with metadata, not icons posing as evidence.
   - 16 The story in plain words: quiet prose beat, no chart.
   - 17 One thing to remember: single framed takeaway card.
   - 18 Related: link cards.

3. Build the static-data prototype in `/dev/cell` (extend the existing harness page): a
   full London restaurants instance with hand-fixtured numbers, all 19 rows, the six band
   frames, each section bound to its chosen chart. Build a thin (non-London, data-light)
   variant in the same harness to prove the honest sample/empty states inside the frames.

4. Review against the constitution tests: SKIM (each band's claim readable from title plus
   dominant visual), SAMENESS (no two adjacent bands share a visual treatment; verdict
   gauge, economics waterfall, operating-reality ribbon, comparison dot-plot all read
   distinct), ONE-IDEA (each band carries one idea; split any section straining to say two).

5. Rewrite `src/lib/page-sections.ts` CELL_SECTIONS to the locked order (risks up after the
   money block, narrative low), update `src/lib/page-layout/section-order.ts` and the
   registry in the same change, and confirm the `verify_page_sections` / `verify_section_order`
   gates pass against the new manifest.

6. Wire the real cell view-model: bind the prototype band frames and charts to the real
   `getCellBySlug()` data through the existing cell view contract (`src/lib/cells/cell_view.ts`),
   honouring nullable-in-silence-out (a null field renders nothing, never a placeholder
   chart). London fills fully via the sanctioned `isLondon` invention of role wages, tangible
   units, and the editorial beats; thin cells self-omit the invented beats and keep real
   masthead / honest-take / money-split / break-even / like-for-like peers.

### Deliverable

`/gb/london/restaurants` rebuilt as the six-band template: all 19 locked rows present in
order, each bound to its matrix chart, the cell at the lightest engraved touch, the
`page-sections.ts` manifest rewritten to the locked cell order, and a reusable band-frame +
chart-binding pattern documented for P2 to P5. Prototype lives in `/dev/cell`.

### Verification

Shared contract above. Specifics: the rewritten manifest is the thing both section gates now
check, so they must pass on the new order before anything else. SEE the filled London cell
AND a thin non-London cell at 1280 and 375; confirm the masthead anchor is the only serif
numeral, the vermillion budget stays under one idea per view, the data board stays opaque on
cream with engraved texture only in the frame and never behind a number, and 375 reflows
tables to labelled bar lists with no horizontal scroll. Honesty: the thin cell shows tagged
SAMPLE / empty states inside built frames, never fabricated numbers, never a wall of dashes;
long runs of unheld sections collapse into one calm "still filling in" strip
(`StillFillingIn`).

---

## P2 — United Kingdom country

### Goal

Compose the 24 locked country sections into the six bands, assign each its matrix chart
reusing the cell's band-frame pattern, prototype in `/dev/country`, then wire to the real
country view-model. The engraved country page already exists as the built reference instance
of the unified language; this phase brings its section composition into the band system and
the chart matrix without changing the locked order. Its promote stays held for Wave F.

### The locked section list it MUST keep (never add / remove / reorder)

From `06-ground-truth.md` section 2.2, verbatim order:
1. Hero · 2. At a glance (eight headline metrics) · 3. The country's shape (the nine lenses)
· 4. Cost + rules to set up · 5. Licences · 6. Where the margin leaks · 7. Hiring + the cost
of a team · 8. The talent reality · 9. Who has money to spend · 10. How far you can reach ·
11. Versus the neighbours · 12. The opportunity gap · 13. Same business, here vs abroad ·
14. Special zones · 15. The ground under you · 16. Cities · 17. Character · 18. What locals
know · 19. What your life looks like here · 20. Versus the world · 21. The honest take ·
22. Gut-check · 23. One thing to remember · 24. Related countries.

### Substeps

1. Map sections to bands (order preserved):
   - Band 1 The answer: 1 Hero, 2 At a glance (eight headline metrics).
   - Band 2 The verdict: 3 The country's shape (nine-lens radar), 4 Cost + rules to set up,
     5 Licences.
   - Band 3 The economics: 6 Where the margin leaks, 7 Hiring + cost of a team,
     8 The talent reality, 9 Who has money to spend.
   - Band 4 The operating reality: 10 How far you can reach, 14 Special zones, 15 The
     ground under you (the operating-context rows that sit by their locked position).
   - Band 5 The comparison field: 11 Versus the neighbours, 12 The opportunity gap,
     13 Same business here vs abroad, 16 Cities, 20 Versus the world.
   - Band 6 The trust layer: 17 Character, 18 What locals know, 19 What your life looks like
     here, 21 The honest take, 22 Gut-check, 23 One thing to remember, 24 Related countries.
   - Composition note: the locked country order interleaves comparison, operating, and
     trust rows; bands label the dominant run and each row keeps its locked position and its
     own frame. Never resequence to make a band contiguous.

2. Choose the chart per section from the matrix:
   - 2 At a glance: eight scorecards / engraved gauges (the eight headline metrics).
   - 3 The country's shape: the nine-lens radar.
   - 4 Cost + rules: setup route-line.
   - 5 Licences: ordered list / TierBar where confidence-graded.
   - 6 Where the margin leaks: three-bar "leak" (the round-2 `[NEW]` leak treatment).
   - 7 Hiring + cost of a team: wage rails.
   - 8 The talent reality: ComparisonBars / supply-demand bars.
   - 9 Who has money to spend: distribution / percentile band.
   - 10 How far you can reach: reach visual (ComparisonBars or range), not a decorative map.
   - 11 Versus the neighbours: ComparisonBars ranked.
   - 12 The opportunity gap: opportunity scatter.
   - 13 Same business here vs abroad: LikeForLikeBars.
   - 14 Special zones: tier cards / suits-area cards (`[NEW]`).
   - 15 The ground under you: TierBar / structure breakdown.
   - 16 Cities: ranked city cards / small multiples.
   - 17 Character: character spectrum.
   - 18 What locals know: framed editorial cards (honest, SAMPLE off London).
   - 19 What your life looks like here: editorial / equivalence cards.
   - 20 Versus the world: percentile dot plot.
   - 21 The honest take: HonestTakeBox verdict.
   - 22 Gut-check: framed gut-check cards (`[NEW]`).
   - 23 One thing to remember: single takeaway card.
   - 24 Related countries: link cards.

3. Build the static-data prototype in `/dev/country` with the UK as the filled instance and
   a thin non-UK country as the data-light variant.

4. Review against SKIM / SAMENESS / ONE-IDEA. The country page is the densest type; the
   SAMENESS test matters most here so the 24 rows do not read as one long gauge wall.

5. Wire the real country view-model, honouring nullable-in-silence-out. The UK fills as the
   exemplar; thin countries self-omit invented editorial and keep real metrics, leaks, peers.

### Deliverable

The reformed UK country page on `reform-v2/r6-forward`: all 24 locked rows present in order,
banded, each bound to its matrix chart, cohering with the cell's visual language. Prototype
in `/dev/country`. Promote held for Wave F.

### Verification

Shared contract. Specifics: nine-lens radar and the eight at-a-glance gauges render opaque on
cream, engraved texture in frame only; SEE filled UK and a thin country at 1280 and 375;
confirm the dense run still passes SAMENESS (distinct treatments across leak bars, opportunity
scatter, peer bars, character spectrum); thin countries show honest SAMPLE / empty inside
frames, never fabricated metrics.

---

## P3 — London city

### Goal

Compose the 12 locked city sections into the bands, assign matrix charts, prototype in
`/dev/cities`, wire the real city view-model. London is the filled city exemplar.

### The locked section list it MUST keep (never add / remove / reorder)

From `06-ground-truth.md` section 2.3, verbatim order:
1. Hero + Business Climate Score · 2. At a glance (metro metrics) · 3. Who the local customer
is · 4. Tourist money vs local money · 5. What space costs · 6. What owners keep across
trades · 7. Best areas to set up · 8. Neighbourhoods · 9. How the city is changing · 10. Rival
+ peer cities · 11. Operator voices · 12. One thing to remember.

### Substeps

1. Map sections to bands (order preserved):
   - Band 1 The answer: 1 Hero + Business Climate Score (ScoreBand), 2 At a glance (metro
     metrics).
   - Band 2 The verdict: 3 Who the local customer is, 4 Tourist money vs local money.
   - Band 3 The economics: 5 What space costs, 6 What owners keep across trades.
   - Band 4 The operating reality: 7 Best areas to set up, 8 Neighbourhoods, 9 How the city
     is changing.
   - Band 5 The comparison field: 10 Rival + peer cities.
   - Band 6 The trust layer: 11 Operator voices, 12 One thing to remember.

2. Choose the chart per section from the matrix:
   - 1 Hero + score: ScoreBand business-climate gauge.
   - 2 At a glance: metro scorecards.
   - 3 Who the local customer is: audience / demographic cards or distribution.
   - 4 Tourist money vs local money: VisitorSplit.
   - 5 What space costs: range bar / RangeStrip by area.
   - 6 What owners keep across trades: OwnerKeepTable.
   - 7 Best areas to set up: suits-area cards / ranked cards.
   - 8 Neighbourhoods: ranked neighbourhood cards / small multiples (links to P4).
   - 9 How the city is changing: trend-direction card (`[NEW]`) / TimelineRibbon.
   - 10 Rival + peer cities: ComparisonBars / peer dot plot.
   - 11 Operator voices: quote cards with metadata.
   - 12 One thing to remember: single takeaway card.

3. Build the static-data prototype in `/dev/cities` with London filled and a thin city as
   the data-light variant.

4. Review against SKIM / SAMENESS / ONE-IDEA.

5. Wire the real city view-model, nullable-in-silence-out; London fills, thin cities
   self-omit.

### Deliverable

The reformed London city page on `reform-v2/r6-forward`: 12 locked rows present in order,
banded, matrix-charted, cohering with cell and country. Prototype in `/dev/cities`. Promote
held for Wave F.

### Verification

Shared contract. SEE filled London and a thin city at 1280 and 375; confirm VisitorSplit and
ScoreBand read clearly, the peer comparison is a dot plot not a choropleth, neighbourhoods
small-multiples link correctly to P4 districts, honest SAMPLE off-London.

---

## P4 — London neighbourhoods

### Goal

Compose the 9 locked neighbourhood sections into the bands, assign matrix charts, prototype
in the dev harness (extend `/dev/cities` or a `/dev` district view), wire the real
neighbourhood view-model. London districts are the filled exemplar.

### The locked section list it MUST keep (never add / remove / reorder)

From `06-ground-truth.md` section 2.5, verbatim order:
1. The district hero · 2. Street by street · 3. What thrives here and why · 4. Who lives and
shops here · 5. Cost to operate · 6. Versus next door · 7. The businesses here · 8. Operator
voices · 9. One thing to remember.

### Substeps

1. Map sections to bands (order preserved):
   - Band 1 The answer: 1 The district hero, 2 Street by street.
   - Band 2 The verdict: 3 What thrives here and why.
   - Band 3 The economics: 5 Cost to operate.
   - Band 4 The operating reality: 4 Who lives and shops here, 7 The businesses here (the
     operating-context rows by their locked position).
   - Band 5 The comparison field: 6 Versus next door.
   - Band 6 The trust layer: 8 Operator voices, 9 One thing to remember.
   - Composition note: this short type interleaves an economics row (5) between operating
     rows (4 and 7) in the locked order; bands follow the dominant idea and each row keeps
     its locked position. Do not resequence to make the economics band contiguous.

2. Choose the chart per section from the matrix:
   - 1 District hero: district hero frame (lightest engraved touch, like the cell).
   - 2 Street by street: FootfallGrid / street-level strip.
   - 3 What thrives here and why: ranked business-type cards / ComparisonBars.
   - 4 Who lives and shops here: audience / demographic cards.
   - 5 Cost to operate: range bar / RangeStrip.
   - 6 Versus next door: LikeForLikeBars (district vs adjacent district).
   - 7 The businesses here: business-mix cards / small multiples.
   - 8 Operator voices: quote cards with metadata.
   - 9 One thing to remember: single takeaway card.

3. Build the static-data prototype with a filled London district (e.g. a curated district)
   and a thin district as the data-light variant.

4. Review against SKIM / SAMENESS / ONE-IDEA. With only 9 rows the SKIM test is the binding
   one: the district claim must land from hero plus street strip alone.

5. Wire the real neighbourhood view-model, nullable-in-silence-out; London districts fill,
   thin districts self-omit. Confirm the city page's neighbourhoods section (P3 row 8) links
   into these districts.

### Deliverable

The reformed London neighbourhoods page on `reform-v2/r6-forward`: 9 locked rows present in
order, banded, matrix-charted, cohering with city and cell. Prototype in the dev harness.
Promote held for Wave F.

### Verification

Shared contract. SEE a filled London district and a thin district at 1280 and 375; confirm
FootfallGrid and the versus-next-door LikeForLikeBars read clearly, the district links from
the city neighbourhoods section resolve, honest SAMPLE off the curated London districts.

---

## P5 — Home

### Goal

Compose the 9 locked home sections into the bands, assign matrix charts, prototype in
`/dev/home`, wire the real home view-model. Home has extra brand freedom (it is the one page
with the most latitude) but the same band system, type law, tokens, and grid apply, and the
locked order is still immutable.

### The locked section list it MUST keep (never add / remove / reorder)

From `06-ground-truth.md` section 2.1, verbatim order:
1. Hero (the rotating question + search) · 2. Pick a country (the world map) · 3. What a
business actually keeps (live real examples) · 4. The same trade, state by state
(like-for-like proof) · 5. The same numbers, block by block (neighbourhood proof) · 6. Built
for the people who price a business (the audience) · 7. Free to read, paid to go deeper
(pricing) · 8. From the notebook (a few articles) · 9. Get the free benchmark report
(newsletter).

### Substeps

1. Map sections to bands (order preserved; home's bands lean on answer / proof / trust):
   - Band 1 The answer: 1 Hero (rotating question + search), 2 Pick a country (world map).
   - Band 3 The economics / proof: 3 What a business actually keeps (live real examples).
   - Band 5 The comparison field / proof: 4 The same trade state by state (like-for-like),
     5 The same numbers block by block (neighbourhood proof).
   - Band 6 The trust / conversion layer: 6 The audience, 7 Pricing, 8 From the notebook,
     9 Newsletter.
   - Composition note: home does not use all six bands one-to-one; it uses the band frames
     and the one-idea-per-band rule over its 9 rows. The answer, proof, and trust bands carry
     the page; verdict / operating-reality bands do not apply to a marketing home and are not
     forced in. The order stays exactly as locked.

2. Choose the chart per section from the matrix:
   - 1 Hero: rotating question + search (no chart; the masthead anchor uses the serif).
   - 2 Pick a country: the world map (geography genuinely matters here, so a map is correct).
   - 3 What a business actually keeps: live real-example cards with RangeStrip / kept band.
   - 4 The same trade state by state: LikeForLikeBars (like-for-like proof, never ranking
     across business x geography).
   - 5 The same numbers block by block: LikeForLikeBars / small multiples (neighbourhood
     proof).
   - 6 The audience: audience cards.
   - 7 Pricing: pricing cards (one loud accent on the recommended tier only).
   - 8 From the notebook: article cards.
   - 9 Newsletter: capture block.

3. Build the static-data prototype in `/dev/home` with live-example fixtures.

4. Review against SKIM / SAMENESS / ONE-IDEA. Home's SAMENESS test guards against the proof
   bands (rows 3 to 5) reading as three identical bar walls; differentiate live-example
   cards, state-by-state bars, and block-by-block multiples.

5. Wire the real home view-model. The live-real-examples and proof sections pull real cell /
   state / neighbourhood figures (like-for-like only); honest self-omit where a figure is not
   held. No fabricated home numbers.

### Deliverable

The reformed home page on `reform-v2/r6-forward`: 9 locked rows present in order, banded,
matrix-charted, cohering with the four interior types as the cohesive site's front door.
Prototype in `/dev/home`. Promote held for Wave F (the single cohesive ship of all five types).

### Verification

Shared contract. SEE the home page at 1280 and 375; confirm the world map reads on mobile
without horizontal scroll, the three proof bands stay visually distinct, pricing's one loud
accent sits only on the recommended tier, the live examples are real (or honestly omitted),
and the front door coheres with the reformed cell, country, city, and neighbourhood pages.
After P5, run the Wave F cohesion QA across all five types at 1280 and 375, one comprehensive
preview, then promote once on the founder's nod.

---

## Cross-phase notes

- Order of work: P1 (cell, the template + the `page-sections.ts` rewrite) must land first
  because it establishes the band-frame pattern, the chart-binding pattern, and the corrected
  manifest the section gates check. P2 to P5 reuse that pattern and re-verify the gates.
- The chart kit is reused, not re-grown: every section binds to an existing kit primitive
  restyled through tokens. New builds are limited to the round-2 `[NEW]` list (kept-vs-gone
  bar, icon-unit cards, ease/difficulty + multiplier gauges, three-bar leak, framed gut-check
  cards, trend-direction card, tier cards, suits-area cards). No parallel chart families.
- Tokens, type, and grid are constant across all five phases: warm OKLCH tokens (one loud
  accent, vermillion budget under 5% of surface, one idea per viewport), Newsreader for
  mastheads / H1-H3 / the single anchor numeral / pull-quotes only and never below 20px,
  Inter for all body / UI / numerals with tabular-nums, the 12 / 6 / 4 column grid collapsing
  to one column at 375 with no horizontal scroll.
- Honesty is constant: London is the one filled exemplar where editorial invention is
  sanctioned; every other instance self-omits honestly, shows tagged SAMPLE / empty inside
  the built frame, collapses long unheld runs into one calm strip, and never fabricates.
- Promote is held until Wave F: all five reformed types ship together in one cohesive
  promote after the full cohesion QA, never piecemeal.
