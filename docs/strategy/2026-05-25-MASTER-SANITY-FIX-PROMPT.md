# MASTER SANITY-FIX PROMPT — Margin Atlas (v34)

**Date authored:** 2026-05-25
**Purpose:** A single executable prompt that fixes every catastrophic data, rendering, routing, and visual problem visible on the site today. Paste this entire file into an autonomous agent session and run.

**Tone of execution:** No circumvention. No "I'll defer this until X." Every target below has a hard pass / fail. The agent does not stop until every metric passes or until a specific blocker is escalated with file paths + line numbers.

**Forbidden moves:**
- Suppressing a page or value just to make a test pass.
- Re-defining a metric mid-flight to make it easier to hit.
- Saying "this is a follow-up item" for any target below.
- Treating a render bug as a data bug or vice versa without proving it.

**Required moves:**
- Every target has an explicit verifier (a script or a list of URLs to walk).
- Every fix lands with a regression test that would have caught it.
- Every claim of "done" is backed by a green CI gate.

---

## SECTION 0 — Pre-flight: what is broken today (the canvas)

The agent must read these screenshot-derived findings before doing anything else:

1. **Cleaning services category page** shows Bottom $37.5M / Typical $41.2M / Top $46.9M. Two failures:
   a. Numbers are in tens of millions for a small-business sector that should sit in the $50K–$2M band per firm.
   b. The spread from bottom to top is only ~1.25x; real distributions for SMB cleaning services have at least 10x spread between p10 and p90.

2. **Auto dealers category page** shows:
   a. Distribution chart with axis labels overlapping ("$585K $2.3M$3.5M" mashed together).
   b. "Bottom 10% Typical Top 10%" labels stacked on top of each other.
   c. Internal engineering note visible to public: "Cloned from auto_dealers_gas during Wave 4b split."
   d. "Top countries for auto dealers" lists **Denmark three times**, then a list of small countries (Luxembourg, Singapore, Switzerland, Norway, Sweden, Finland) that are clearly not the top auto-dealer markets.

3. **Retail & shops / Education & instruction / Real estate sector pages** all show "across the world" bar charts that mix incompatible geographies:
   - US states (California)
   - Cities (Madrid, São Paulo, Mexico City)
   - Countries (Netherlands, Italy, Germany, UK, France, Japan, India, Australia)
   All rendered as if they were peers. This is the most damaging trust failure visible.

4. **Navigator button** now successfully submits and routes to a cell URL, but the cell URL itself **loads and gives up** without rendering. The hang is server-side. Other pages on the site load fast — only the cell route hangs.

5. **Distribution visual** is unbranded (uses generic teal gradient, not Atlas palette), and the axis values stack on top of each other when the spread is wide.

6. **/cities page** has no map. The 200 covered cities should anchor a full-width geographic map that is the page's hero.

The agent's job is to fix all six in order, with hard targets per section.

---

## SECTION 1 — Universal data sanity sweep

**Goal:** Zero blank, implausible, or "idiotic" cell renders across every (country, industry, size) combination the site exposes. Zero city/state contamination in country-level comparisons.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 1.1 | Cell pages that render numbers outside the per-industry plausibility band | **0** | `scripts/audit/plausibility_sweep.ts` walks every URL the navigator can generate, asserts every revenue value falls within `[industry.lo / 5, industry.hi * 2]` for that industry |
| 1.2 | Cell pages where p10 = p50 = p90 (zero spread) | **0** | same script |
| 1.3 | Cell pages where the spread (p90/p10) is less than 2x | **<5%** | flag as warning; auto-suppress as "modeled" if true |
| 1.4 | Cell pages where the absolute median > industry ceiling | **0** | hard fail |
| 1.5 | Cell pages where the absolute median < industry floor / 10 | **0** | hard fail |
| 1.6 | "Across the world" / "Top countries" tables that include any non-country entity | **0 rows** | new gate: filter every such query through `isSovereignCountry(iso2)` before rendering |
| 1.7 | Duplicate country rows in any "Top countries" list (Denmark three times bug) | **0** | dedupe by iso2 at query time |
| 1.8 | Internal engineering notes leaking into public copy ("Cloned from X during Wave Y split") | **0** | new gate: grep `src/components/**` and any database `notes` column for the pattern `Cloned from|Wave \\d|TODO|FIXME|XXX|DEBUG` rendered into user-visible text |
| 1.9 | "Top countries" lists that contain countries with population < 1M for industries where the top 10 by GDP is the right answer (e.g. auto dealers showing Luxembourg) | **flag, not auto-fix** | the script reports; the human decides per-industry whether to filter |
| 1.10 | All revenue numbers display the correct currency for their geography | **100%** | currency-correction gate already exists; extend to every render path |

### Required deliverables

- `scripts/audit/plausibility_sweep.ts` — walks every URL the navigator can generate, runs all 10 targets, exits non-zero on any hard fail.
- `scripts/verify_no_internal_notes.ts` — prebuild gate that fails on any of `/Cloned from|Wave \\d|TODO|FIXME|XXX|DEBUG/` in user-visible source OR in any field that gets rendered to the page.
- `src/lib/geo/is_sovereign_country.ts` — single source of truth for "is this a country I should put in a countries chart". Returns false for ISO3, World Bank aggregates, US states, cities, sub-national regions.
- Wire `isSovereignCountry()` into every query that builds an "across the world" or "top countries" view. There are at least 4: `getSameIndustryAcrossCountries`, the sector-page SectorAcrossWorld component, the industry-page "Top countries for X" block, the cells `top countries` sidebar.

### Required regression tests

For each target above, the agent writes a test that would have caught the original bug:

- `tests/sanity/cleaning_services_plausibility.ts` — fetches `/industries/cleaning_services` cell aggregates, asserts p50 < $2M.
- `tests/sanity/auto_dealers_no_duplicate_countries.ts` — fetches `/industries/auto_dealers` top-countries, asserts unique iso2 codes.
- `tests/sanity/no_internal_notes_visible.ts` — visits 50 random cell URLs, asserts none contain the strings "Cloned from", "Wave 4", "TODO", "FIXME".
- `tests/sanity/no_city_state_in_country_charts.ts` — visits 5 sector pages, asserts every "across the world" row is in `COUNTRIES` (no states, no cities).

### Acceptance criteria for Section 1

- All 10 targets pass.
- All 4 regression tests pass.
- The prebuild chain runs them on every commit.
- Founder walks 10 random URLs and finds no blank / mixed-up / idiotic data.

---

## SECTION 2 — Top-200 cities map page

**Goal:** `/cities` is anchored by a full-width geographic map showing all 200 covered cities at their real coordinates. The map is the page's hero, not a list below the fold.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 2.1 | Map width on desktop | `100%` of the main content frame (max-w-7xl, full bleed inside it) | manual + screenshot |
| 2.2 | Map height on desktop | minimum 480px, ideally 600px | manual + screenshot |
| 2.3 | Map height on mobile | minimum 320px | manual + screenshot |
| 2.4 | Number of cities rendered as markers | **exactly 200**, matching the city_list_v1.json file | unit test: render the component, count circle elements |
| 2.5 | Cities at correct coordinates | every marker within 50km of its true lat/lon | spot-check 20 random cities against ground-truth from a reference dataset |
| 2.6 | Marker click target | minimum 32px on hover for accessibility | manual |
| 2.7 | Marker links | each opens the city's `/cities/{slug}` page | unit test |
| 2.8 | Cities visible without scrolling on desktop 1280px viewport | **all 200** | screenshot at 1280x720 |
| 2.9 | Map base layer | uses the same atlas-cream / atlas-700 palette as the homepage world map; NO blue Mercator default | manual review against atlas palette |
| 2.10 | Page load time-to-interactive for `/cities` | **< 2s on a cold render** | Vercel Speed Insights |

### Required deliverables

- `src/components/cities/CitiesWorldMap.tsx` — server component (or RSC-friendly client) that takes `cities: City[]` and renders the marker layer.
- Use `react-simple-maps` (already a dep) with the same `world-atlas` topojson as the homepage map.
- Markers: 5px radius circle, atlas-700 fill, hover 8px + tooltip showing city name + country.
- Wire into `src/app/cities/page.tsx` as the FIRST section, ABOVE the existing list.
- The existing list stays as a secondary section.

### Acceptance criteria for Section 2

- All 10 targets pass.
- Founder loads `/cities` and sees all 200 cities as markers on a full-bleed map before scrolling.

---

## SECTION 3 — Cell-page hang fix

**Goal:** Every cell URL the navigator can produce loads and renders within 3 seconds on a cold request. No exceptions, no excuses.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 3.1 | Median TTFB for a cold cell URL (no Vercel cache) | **< 1.5s** | `scripts/audit/cell_page_smoke.ts` hits 30 random cell URLs in production with cache busters, measures TTFB |
| 3.2 | p95 TTFB for a cold cell URL | **< 3s** | same |
| 3.3 | Cell URLs that 5xx / 504 / hang | **0** out of 30 sampled | same |
| 3.4 | Cell URLs that show Atlas 404 (`This page isn't part of the atlas`) when the navigator just routed there | **0** | same |
| 3.5 | The cell page's parallel-data-fetch budget total | **< 4s** total wall-clock for all `Promise.all([...])` calls combined | inspect via wrapping each fetch in `withTimeout` |
| 3.6 | Server function size in the Vercel dashboard for the cell route | **< 50MB** | postbuild check already exists; extend to alert if it ever exceeds 40MB |

### Diagnosis protocol (the agent runs this BEFORE attempting any fix)

1. Open the Vercel dashboard → Functions → look at the cell route's recent invocations. Note durations, cold-start times, and any error rows.
2. Open the Supabase dashboard → Database → Queries → look for the slowest queries in the last hour. Note the query shape.
3. Hit `/us/california/restaurants` from the CLI with `curl -w "%{time_total}"` and record the wall time.
4. Hit the same URL twice to test ISR cache warming.
5. Inspect what changed in the cell-page tree between the last known-good commit and now. The Phase C revert removed `QuartileMarkers` and `InlineMidArticle`; verify no other change is still present.
6. Check the prebuild output for any warnings about route size or build time.

### Required deliverables

- `scripts/audit/cell_page_smoke.ts` — hits 30 random cell URLs, reports per-URL TTFB and pass/fail.
- A document `docs/strategy/2026-05-25-cell-hang-postmortem.md` explaining the root cause in plain English once found.
- Whatever code fix the diagnosis points to. Possibilities (the agent picks based on evidence, not guess):
  - If Supabase is the bottleneck → add query indexes; reduce parallel fetches; ship a `/api/cell-data` JSON layer with its own cache.
  - If function size is the bottleneck → tree-shake imports; lazy-load the heavy sections.
  - If a specific cell row triggers slow rendering (e.g. a city with thousands of comparable cells) → cap the comparable-cells query to 6.
  - If hydration is the bottleneck → convert the heaviest section to a server component.

### Acceptance criteria for Section 3

- All 6 targets pass.
- 30/30 cell URLs load successfully.
- The post-mortem doc explains the root cause and is committed.

---

## SECTION 4 — Distribution chart redesign

**Goal:** The distribution chart on every cell, industry, and sector page is branded, readable, and never has overlapping axis labels.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 4.1 | Axis label collisions | **0** (visual inspection at 320px, 640px, 1024px, 1440px widths) | screenshot pass at all 4 widths |
| 4.2 | Chart fill color | atlas-700 (`#16AEB5`) at 70% opacity, NOT generic teal | grep |
| 4.3 | Chart stroke color | atlas-800 | grep |
| 4.4 | Internal engineering notes ("Cloned from X") visible anywhere on the page | **0** | covered by Section 1 #8 but reasserted here |
| 4.5 | Distribution chart accessible label | every chart has `<title>` and `aria-label` describing what it represents | unit test |
| 4.6 | Distribution chart works when p25 / p75 are null | renders gracefully; no `NaN` or "$undefined" visible | manual |

### Required deliverables

- Rewrite `src/components/DistributionVisual.tsx` (or its parent) to:
  - Use atlas-700 as the primary fill color and atlas-800 as the stroke.
  - Stagger axis labels so they never collide: if two labels are within 60px of each other, drop the lower-priority one (median wins over p10 wins over p90 wins over modeled tail).
  - Add a `<title>` element inside the SVG for accessibility.
  - Add an `aria-label` on the chart container.
- Add a Storybook entry at `/dev/distribution-states?dev=1` that renders the chart in 5 states: normal spread, narrow spread, missing p25/p75, missing p10/p90, all-zero (degenerate).

### Acceptance criteria for Section 4

- All 6 targets pass.
- Screenshots at 320px / 640px / 1024px / 1440px show no overlap.
- Founder reviews the storybook and signs off on the visual.

---

## SECTION 5 — Country/city/state contamination purge

**Goal:** No "across the world" or "top countries" comparison anywhere on the site ever mixes a city, a state, or a sub-national region with countries. Per the cleanup that started in v32 but never finished.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 5.1 | Sector-page "{industry} across the world" charts that include a non-country | **0** | Section 1 #6 verifier |
| 5.2 | Industry-page "Top countries for X" lists that include a non-country | **0** | same |
| 5.3 | Cell-page "Same industry across other countries" ribbon that includes a non-country | **0** | same |
| 5.4 | City-page sister-cities ribbon that includes a country | **0** (the inverse — sister cities should be cities only) | new test |
| 5.5 | Homepage navigator output URL that points to a non-country at the `[country]` segment | **0** | walk the form output for every country option |
| 5.6 | World map page filtering | **only ISO2 in COUNTRIES taxonomy** | existing test, reassert |

### Required deliverables

- `src/lib/geo/is_sovereign_country.ts` — exports `isSovereignCountry(code: string): boolean` and `filterToCountries<T>(rows: T[], getCode: (r: T) => string): T[]`.
- Refactor every "across the world" / "top countries" query to pipe through `filterToCountries(...)` immediately after fetch.
- Update `getSameIndustryAcrossCountries` in `src/lib/cells.ts` to filter at the SQL level: `WHERE country IN (SELECT iso2 FROM countries WHERE is_sovereign = true)`.

### Acceptance criteria for Section 5

- All 6 targets pass.
- Founder loads the 5 most-trafficked sector pages and the 5 most-trafficked industry pages and confirms zero contamination.

---

## SECTION 6 — Plausibility floor enforcement at render time (the "$41M for cleaning services" bug)

**Goal:** No cell, industry, or sector page ever displays a number that is physically impossible for the industry.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 6.1 | Median revenue for `cleaning_services` cells | within `[$30K, $1.5M]` per firm | per-industry bounds table |
| 6.2 | Median revenue for `restaurants` cells | within `[$50K, $5M]` per firm | same |
| 6.3 | Median revenue for `auto_dealers` cells | within `[$300K, $50M]` per firm | same |
| 6.4 | Median revenue for `gas_stations` cells | within `[$150K, $10M]` per firm | same |
| 6.5 | Industry-page aggregate that violates any bound | suppress + show "Modeled" pill, NEVER render the raw number | new render-layer guard |
| 6.6 | Per-industry plausibility table covers | all 192 visible industries | extend `src/lib/qa/plausibility_suppression.ts` |

### Required deliverables

- Extend `src/lib/qa/REVENUE_PER_FIRM_BOUNDS` to cover all 192 visible industries (today it covers ~30).
- Wire the bounds check into the industry-aggregate query path (today it only runs on cell-page reads).
- Add a regression test asserting cleaning_services p50 < $2M across all geographies.

### Acceptance criteria for Section 6

- All 6 targets pass.
- The cleaning-services page never again shows $37M.
- The auto-dealers page never again shows the absurd country list.

---

## SECTION 7 — Navigator button + cell-page coupling (root cause)

**Goal:** Whatever combo a user picks in the navigator, the destination page either renders cleanly OR returns a clear "we don't cover that combination yet" with three suggested alternatives.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 7.1 | Navigator-generated URLs that 404 to the generic Atlas not-found page | **< 5%** | walk every country × top-5-industries combination from the form |
| 7.2 | Navigator-generated URLs that hang (no response in 10s) | **0** | same |
| 7.3 | Default region for each country when user doesn't pick | matches the country's biggest covered region by GDP, not alphabetical first | unit test |
| 7.4 | Navigator output URL when no industry is picked | routes to `/random`, not silently 404 | unit test (still passing from earlier fix) |

### Required deliverables

- A new `src/lib/regions/default_region_by_country.ts` table mapping iso2 → preferred default region slug (e.g., US → "california", GB → "england", DE → "berlin").
- Update `NavigatorForm.submit()` to use this table BEFORE falling back to "first alphabetical" or "california".
- Walk the form's full input space in `scripts/audit/navigator_url_coverage.ts` and report any URL that 404s or hangs.

### Acceptance criteria for Section 7

- All 4 targets pass.
- Founder can pick any country + any visible industry and either get a real cell or get the styled fallback (NEVER a hang, NEVER a raw Next.js 404).

---

## SECTION 8 — Final integration sweep

After Sections 1–7 are individually green:

- Run the full prebuild chain.
- Run all sanity scripts: `plausibility_sweep`, `cell_page_smoke`, `navigator_url_coverage`.
- Deploy to production.
- Wait 60s for the deploy to settle.
- Run the same sanity scripts against the production URL.
- Open `coverage/monetization-coverage.html` AND the new `coverage/sanity-coverage.html` reports.
- Walk 20 random URLs as a cold visitor and confirm: button works, cell loads, numbers plausible, no internal notes, no city-country mixing, distribution chart looks branded.

### Acceptance criteria for the whole prompt

- **All 7 sections green.**
- **All regression tests passing.**
- **No new prebuild violations.**
- **Production smoke green for 24 hours straight.**

---

## Execution order

The agent must execute in this order (because each phase unblocks the next):

1. Section 3 (cell-page hang fix) — without this, no other diagnostic is reliable.
2. Section 1 (data sanity sweep) — surfaces every other problem in one report.
3. Section 5 (country/city contamination purge) — depends on Section 1 having flagged the bad rows.
4. Section 6 (plausibility floor enforcement) — depends on Section 1.
5. Section 7 (navigator + cell-page coupling) — depends on Section 3.
6. Section 2 (cities map page) — independent; can ship in parallel with 4–7.
7. Section 4 (distribution chart redesign) — independent; can ship in parallel.
8. Section 8 (final integration sweep).

---

## What this prompt is NOT

- Not a wishlist.
- Not a "let me know what blocks you" letter.
- Not a "we'll iterate on this" memo.

Every target has a hard pass / fail. The agent does not declare success on any section until every target in that section is green. If a target genuinely cannot be hit (e.g., 100% city-coordinate accuracy depends on a data source we don't have), the agent escalates with file paths, line numbers, and a concrete request — never silently moves the goalpost.

---

## Where the agent should report

- Per-section status updates as the work progresses.
- A final summary at the end with: targets met, targets failed (if any), commits shipped, URLs to verify.
- The complete sanity report at `coverage/sanity-coverage.html`.

---

**End of prompt.**
