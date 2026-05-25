# MASTER CITIES-DEEPENING + COVERAGE-FILL PROMPT — Margin Atlas

**Date authored:** 2026-05-25
**Purpose:** A single executable prompt that fixes every issue the founder identified in today's cities-page review, deepens the per-city data model with the missing metrics (metro pop, metro GDP, avg gross salary, HDI, Gini, profit/saturation/formation-cost layers), and continues the site-wide hero-image fill. Paste this entire file into an autonomous agent session and run.

**Tone of execution:** No circumvention. Every target below has a hard pass / fail. The agent does not stop until every metric passes or until a specific blocker is escalated with file paths + line numbers.

**Hard resource cap:**
- **Process RSS must NOT exceed 600 MB at any point during execution.** Stream every large dataset; never load a full Wikipedia dump or world GeoJSON into memory; chunk Supabase writes in batches of ≤500 rows.

**Forbidden moves:**
- Suppressing a city or value just to make a test pass.
- Re-defining a metric mid-flight to make it easier to hit.
- Saying "this is a follow-up item" for any target below.
- Treating a render bug as a data bug or vice versa without proving it.
- Adding hand-written "estimated" / "modeled" disclaimers that bad-mouth our own data. Replace with quiet methodology footer link; never apologetic copy.

**Required moves:**
- Every target has an explicit verifier (script or URL walk).
- Every fix lands with a regression test that would have caught it.
- Every data field is sourced (URL, year, methodology) and the source is committed alongside the value.
- Every fallback / extrapolation is logged with the input + the multiplier so it is auditable.
- Memory profile sampled every 5 minutes during long runs; if RSS approaches 500 MB, snapshot and chunk.

---

## SECTION 0 — Canvas (what the founder said today)

Read these notes before doing anything else. They are the source of truth for the rest of this prompt; every section is a faithful expansion of one or more lines below.

**Cities map page (the world map):**
- Dots too big. **Way smaller.** Use the signature terracotta color (the codebase's atlas-700 vermillion `#952509`), NOT teal.
- Zoom in / zoom out controls. Forgotten in the first pass. Must exist.
- Tooltip / popup should appear immediately BELOW the dot (small floating figure), not in the top-left of the map.
- Big, light-gray instruction at the top of the map: **"Click a city"** (or similar). Faint, not loud.
- Countries should not be clickable. (Already correct; preserve.)
- Cities to ADD (must be present in the marker layer): Moscow, Saint Petersburg, Bucharest, Tbilisi, Baghdad, Baku, Algiers, all European capital cities, Luanda (Angola), Muscat (Oman), Antalya, Monaco, Doha (Qatar), Manama (Bahrain), Hong Kong (verify presence), one major city each from Costa Rica, Dominican Republic, Panama.
- Cities to REMOVE: Suva.
- Cities to REPLACE: Jerusalem → Haifa.
- Exclude micro-countries that would clutter the map: Andorra, Liechtenstein. (Monaco is INCLUDED per founder, despite size.)

**Cities map page (the country-grouped list below the map):**
- Group by **continent** (alphabetical), with each continent's countries listed alphabetically within.
- Five columns, not four.
- Flags bigger.

**City detail page (e.g. /cities/los-angeles):**
- Hero-image-dominates-the-frame is wrong. The image stays full bleed, but the content cards **overlay** the image at the bottom.
- City name in the bottom-LEFT overlay. Stat cards in the bottom-CENTER and bottom-RIGHT overlays.
- Duplicate country label is a bug. "Los Angeles → California → United States" then country repeated again below is wrong; render hierarchy exactly once.
- Metro population, not municipality. (Paris municipality ≈ 2.1M; Paris metro ≈ 11M; we must show metro.)
- Metro GDP, verified per city.
- Wealth tier: remove. No purpose.
- Stat cards must include: metro population, metro GDP, average gross salary per employed person, HDI (with smart fallback), Gini coefficient (national fallback OK with disclaimer).
- New content sections per city: top-5 most profitable business activities, top-5 least profitable, top-5 most saturated (by businesses per capita), business formation costs by legal tier (freelancer → LLC → local equivalents).

**Site-wide:**
- Header logo at top-left: a bit bigger than today.
- Hero images for countries and cities: continue the fill. Baltimore is empty; Las Vegas is empty; many cities still without imagery. Denver looks good. Fill the gaps.
- Remove every "estimated" cursor / disclaimer that bad-mouths the data. Replace apologetic language with quiet, factual methodology links.

This is the canvas. Every section below addresses a slice of it with hard targets.

---

## SECTION 1 — Cities map: dot styling, palette, zoom, tooltip, instruction

**Goal:** the world map on `/cities` looks editorial, lets the user click any covered city with zero confusion, and has none of the today-visible problems.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 1.1 | Marker radius at zoom level 1 | **r = 2.5** SVG units (was r=4 → too big) | inspect `CitiesWorldMap.tsx` |
| 1.2 | Marker fill color | **`#952509`** (atlas-700 vermillion, the codebase's actual atlas token). Stroke `#6F1A06` (atlas-800). NO teal. | grep + screenshot |
| 1.3 | Marker hover radius | **r = 5** with a soft halo (transparent 12px ring) for 32px+ click target | manual + a11y test |
| 1.4 | Zoom in / zoom out controls | Two buttons in bottom-right of the map, atlas-700 outline, atlas-50 fill, 32px square. Plus mouse-wheel zoom. | manual |
| 1.5 | Zoom range | 1x to 4x. Pan clamp within map bounds (no panning off the edge). | manual |
| 1.6 | Tooltip placement | Appears **directly below the dot** (translate y +14px), not in the top-left of the SVG. 8px atlas-200 border, 6px padding, white background, name + country flag emoji. | manual + screenshot |
| 1.7 | "Click a city" instruction | Rendered as an overlay at the top-center of the map, `text-2xl text-ink-300 font-display tracking-wide opacity-60`. Disappears on first user pan or zoom. | manual |
| 1.8 | Countries not clickable | `pointer-events: none` on `<Geography>`. Only `<Marker>` elements receive clicks. | manual + grep |

### Required deliverables

- Rewrite `src/components/cities/CitiesWorldMap.tsx`:
  - Add `ZoomableGroup` from `react-simple-maps` with zoom 1→4, center clamped to map bounds.
  - Add two stacked `<button>` zoom controls absolutely positioned bottom-right.
  - Add the "Click a city" overlay (state-managed: hide on first interaction).
  - Replace marker styles with the new vermillion palette + r=2.5.
  - Replace tooltip implementation with an absolutely-positioned card below the dot (use `Marker` foreignObject or a sibling absolutely-positioned div tied to projected coords).

### Acceptance criteria

- All 8 targets pass.
- Founder loads `/cities`, sees a quiet map with small terracotta dots, sees the "Click a city" hint, can zoom + pan, hovers a dot and the tooltip pops below it.

---

## SECTION 2 — Cities map: city list curation (add / remove / replace)

**Goal:** the marker layer and `data/cities/city_list_v1.json` reflect the founder's curated list. Every micro-country exclusion respected. Every requested addition present with real coordinates.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 2.1 | Removed: Suva | `suva` entry NOT in city_list, no marker | grep |
| 2.2 | Replaced: Jerusalem → Haifa | `jerusalem` removed; `haifa` added with iso2=IL, coords ≈ 32.7940, 34.9896 | grep |
| 2.3 | Added: Moscow + Saint Petersburg | both present, iso2=RU | grep |
| 2.4 | Added: Bucharest, Tbilisi, Baghdad, Baku, Algiers | all 5 present with iso2 + coords | grep |
| 2.5 | Added: Luanda (AO), Muscat (OM), Antalya (TR) | all 3 present | grep |
| 2.6 | Added: Monaco (MC), Doha (QA), Manama (BH) | all 3 present despite micro-country status (founder override) | grep |
| 2.7 | Added: one major city each from Costa Rica (San José), Dominican Republic (Santo Domingo), Panama (Panama City) | all 3 present | grep |
| 2.8 | Added: ALL European capital cities currently missing | full list: London, Paris, Berlin, Madrid, Rome, Lisbon, Athens, Vienna, Bern, Amsterdam, Brussels, Copenhagen, Stockholm, Oslo, Helsinki, Reykjavík, Dublin, Warsaw, Prague, Budapest, Sofia, Bucharest (also covered above), Belgrade, Zagreb, Ljubljana, Bratislava, Sarajevo, Skopje, Podgorica, Pristina, Tirana, Vilnius, Riga, Tallinn, Minsk, Kyiv, Chișinău, Nicosia, Valletta, Vaduz (Liechtenstein) — note: Vaduz EXCLUDED (micro), Andorra EXCLUDED (micro), San Marino EXCLUDED (micro). Monaco INCLUDED per founder. | grep + visual inspection |
| 2.9 | Excluded: Andorra, Liechtenstein (other micros) | NOT in list | grep |
| 2.10 | Hong Kong present | iso2=HK, coords 22.3193, 114.1694 | grep |
| 2.11 | Every added city has real-world coords accurate to ≤50km of metro center | sample 10 random additions, verify against authoritative source | manual |

### Required deliverables

- Edit `data/cities/city_list_v1.json` and `data/cities/city_coordinates_v1.json` in lockstep.
- For every addition, the entry includes: `slug, name, iso2, continent, tier, pop_m (metro), gdp_b (metro), wealth_z` (the existing schema) plus the coordinate row in city_coordinates_v1.json.
- Add a comment-block header in city_list_v1.json (in a `_README` key) documenting the inclusion/exclusion criteria used (micro-country rule + override list).

### Acceptance criteria

- All 11 targets pass.
- The cities map shows every founder-requested addition at the correct location.
- The cities map does NOT show Suva, Jerusalem, Andorra, Liechtenstein, San Marino, Vaduz.

---

## SECTION 3 — Cities map: country-grouped list below the map

**Goal:** the country-flag block below the map is grouped by continent (then alphabetical within), uses 5 columns, with bigger flags.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 3.1 | Grouping structure | Continent header → country sub-header → cities for that country | inspect rendered DOM |
| 3.2 | Continent order | Africa, Asia, Europe, North America, Oceania, South America (alphabetical) | grep |
| 3.3 | Country order within continent | Alphabetical by country name | grep |
| 3.4 | Cities within country | Alphabetical by city name | grep |
| 3.5 | Columns | **5 columns** on desktop (lg:grid-cols-5), 2 on mobile (grid-cols-2), 3 on tablet (md:grid-cols-3) | grep |
| 3.6 | Flag size | Currently ~16px wide. Increase to **24px wide** (`w-6`). | grep |

### Required deliverables

- Edit `src/app/cities/page.tsx` to:
  - Build a `Record<Continent, Record<CountryName, City[]>>` from the cities list.
  - Render continent as `<h2 className="font-display text-2xl ...">` headers.
  - Render country names as `<h3 className="font-display text-base font-semibold ...">` sub-headers.
  - Render cities as the existing card style but inside a `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3`.

### Acceptance criteria

- All 6 targets pass.
- Founder loads `/cities`, scrolls past the map, sees the country block organized by continent + country.

---

## SECTION 4 — City detail page: hero overlay + duplicate country fix

**Goal:** the first frame of each city page (e.g. `/cities/los-angeles`) presents the hero image full-bleed with the content cards overlaid at the bottom, NOT a dominating image followed by separate cards.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 4.1 | Hero image full-bleed | `w-full h-[60vh] min-h-[400px] max-h-[640px] object-cover` | inspect |
| 4.2 | Overlay container | Absolutely positioned at the bottom of the hero, `bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent`, `min-h-[40%]` | inspect |
| 4.3 | City name placement | Bottom-LEFT of the overlay, `font-display text-4xl md:text-6xl text-cream-50` | inspect |
| 4.4 | Stat card placement | Bottom-CENTER and bottom-RIGHT of the overlay, semi-transparent cards `bg-cream-50/90 backdrop-blur-sm` | inspect |
| 4.5 | Country / state hierarchy rendered exactly once | breadcrumb shows `Cities / United States / California / Los Angeles` once; no duplicate "United States" lower on the page | grep + manual |
| 4.6 | Wealth tier removed | NO "wealth_z" or tier label rendered anywhere on the city page | grep |
| 4.7 | "Estimated" / apologetic copy removed | NO "Estimated", "Modeled", "Approximate" pills or text rendered on the city page hero | grep |

### Required deliverables

- Rewrite the top half of `src/app/cities/[slug]/page.tsx`:
  - Hero section renders the image + an absolutely-positioned overlay div.
  - City name + breadcrumb in bottom-left.
  - Stat cards (the new content from Section 5) in bottom-center + bottom-right.
- Remove every wealth-tier render path.
- Remove every "Estimated"/"Modeled" pill from the city hero. (The methodology link in the footer is sufficient.)

### Acceptance criteria

- All 7 targets pass.
- Founder loads `/cities/los-angeles`, sees the hero image with cards overlaid at the bottom, no duplicate country label, no wealth tier.

---

## SECTION 5 — City data pipeline: the 5 metrics that matter

**Goal:** every covered city has trustworthy values for the five metrics the founder identified: **metro population, metro GDP, average gross salary per employed person, HDI, Gini coefficient.** When a value is missing, use a smart fallback that is documented + auditable.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 5.1 | Metro population for every covered city | populated; defined as the metropolitan area (NOT the municipality alone). Paris ≈ 11M, NOT 2.1M | new column `metro_pop_m` in city_list + a per-city sources file |
| 5.2 | Metro GDP for every covered city | populated; in USD billions (PPP-adjusted where available). | new column `metro_gdp_b_usd` + sources |
| 5.3 | Average gross salary for every covered city | populated; defined as gross annual salary per employed person in the metro area, in USD | new column `metro_avg_gross_salary_usd_year` + sources |
| 5.4 | HDI for every covered city | populated, with explicit `hdi_source: city | region | country_extrap` field documenting fallback layer used | per-city record |
| 5.5 | Gini for every covered city | populated; national fallback OK with `gini_source: city | country` field | per-city record |
| 5.6 | HDI fallback math | When city HDI missing: use region HDI. When region missing: country HDI bumped by `+0.5%` per city tier (Tier-1 megacity = +1.5%, Tier-2 = +1.0%, Tier-3 = +0.5%); cap at 1.000. Never silently equate city to country. | documented in `src/lib/cities/hdi_fallback.ts` |
| 5.7 | Gini fallback | When city Gini missing: use country Gini. Add a footer note: "Inequality figure shown at national level." | documented |
| 5.8 | Source provenance per field | every populated field links to a `data/cities/sources/<slug>.json` row with `field, value, source_url, source_year, methodology_note` | per-city sources file |
| 5.9 | Smart-extrapolation audit log | every fallback-derived value writes a row to `data/cities/extrapolation_log.json` with the inputs and the multiplier used | per-city log |
| 5.10 | Memory cap during pipeline | Pipeline process RSS ≤ 500 MB peak. Streamed CSV reads only, never load the World Bank dataset whole. | `--max-old-space-size=512` + sampled `process.memoryUsage()` |

### Required deliverables

- New script: `scripts/data/cities/fill_metro_metrics.ts`
  - For each city in `city_list_v1.json`, fills `metro_pop_m`, `metro_gdp_b_usd`, `metro_avg_gross_salary_usd_year`, `hdi`, `gini` from a combination of:
    - World Bank Indicators API (free, JSON, country-level)
    - OECD Stat (where available, free CSV)
    - National statistical office endpoints (where structured)
    - Wikipedia infoboxes (parsed via the structured wikidata SPARQL endpoint, NOT scraped HTML)
    - Numbeo for city-level salary (with attribution)
  - Writes results back to `city_list_v1.json` AND to a per-city sources file.
  - Memory profile: every 100 cities, log `process.memoryUsage()`. If RSS approaches 500 MB, flush partial results to disk and continue in a fresh batch.
- New library: `src/lib/cities/hdi_fallback.ts` with the documented multiplier table.
- New library: `src/lib/cities/gini_fallback.ts` (national fallback + footer-note marker).
- Per-city sources file at `data/cities/sources/<slug>.json`.
- Extrapolation audit log at `data/cities/extrapolation_log.json`.

### Required regression tests

- `tests/sanity/cities_metro_population_not_municipal.ts` — asserts Paris metro_pop_m ≥ 9, London ≥ 8, Tokyo ≥ 30, NYC ≥ 18. Catches the municipality-vs-metro confusion.
- `tests/sanity/cities_hdi_not_equal_country.ts` — asserts that for cities where HDI came from country fallback, the value differs from the country baseline by at least the tier bump.
- `tests/sanity/cities_have_source_per_field.ts` — every populated field has a corresponding source row.

### Acceptance criteria

- All 10 targets pass.
- The 200+ cities all have the 5 metrics filled or explicit `null` with a documented reason.
- Memory peak during pipeline never exceeds 500 MB.

---

## SECTION 6 — City detail page: new content sections (profitable, saturated, formation costs)

**Goal:** every city page renders three new ambitious sections that the founder identified as the real value drivers.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 6.1 | Top 5 most profitable activities per city | section renders 5 industries ranked by net profit margin, with the margin shown | render test |
| 6.2 | Top 5 least profitable activities per city | section renders 5 industries ranked ascending by net profit margin | render test |
| 6.3 | Top 5 most saturated activities per city | section renders 5 industries ranked by businesses-per-capita | render test |
| 6.4 | Business formation costs section | renders a small table per legal tier (Freelancer / Sole Trader / LLC / Joint-Stock / local equivalent) with cost + setup-days | render test |
| 6.5 | Legal-tier naming | global category label first (e.g. "Limited Liability Company") with local term in parentheses (e.g. "LLC (Inc., US)" / "LLC (SARL, FR)" / "LLC (S.r.l., IT)") | grep |
| 6.6 | Special legal tiers per country | when a country has a unique tier worth surfacing (e.g. Germany's UG, France's micro-entrepreneur, Mexico's S.A. de C.V., Brazil's MEI), render it alongside the standard tiers | per-country table |
| 6.7 | Empty-state behavior | when a city has no margin / saturation / formation data, render a quiet "We're working on this" line, never an empty broken section | manual |
| 6.8 | NO "estimated" apologetic copy | the new sections do not render "estimated", "modeled", "approximate" pills | grep |

### Required deliverables

- New library: `src/lib/cities/profitable_activities.ts`
  - For each city, queries existing cell data joined with `industry_margins.json` to rank net profit margin within that city.
  - Caches the result in `data/cities/profitable_activities/<slug>.json` so the page doesn't recompute.
- New library: `src/lib/cities/saturated_activities.ts`
  - For each city, computes businesses-per-capita using cell n_enterprises + metro population.
  - Caches similarly.
- New library: `src/lib/cities/formation_costs.ts`
  - Reads from a new `data/legal/business_formation_costs_v1.json` file with per-country legal tiers, cost ranges, setup days.
  - Initial seed: 30 highest-traffic countries. (The script extends incrementally per the section-9 sweep.)
- New components:
  - `src/components/cities/TopProfitableActivities.tsx`
  - `src/components/cities/MostSaturatedActivities.tsx`
  - `src/components/cities/BusinessFormationCosts.tsx`
- Mount all three on `/cities/[slug]` below the hero.

### Acceptance criteria

- All 8 targets pass.
- Founder loads 5 random city pages and confirms all three sections render with real data or a quiet empty state.

---

## SECTION 7 — Site-wide hero image fill (countries + cities)

**Goal:** every covered country and every covered city has a hero image. No more blank Baltimore, no more blank Las Vegas. Continue the work already started.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 7.1 | City hero images present | all 200+ cities have a hero image (real Unsplash/Pexels source OR a documented fallback card style) | grep |
| 7.2 | Country hero images present | all 50+ ISO2 countries with cell coverage have a hero image | grep |
| 7.3 | Image quality (editorial, not stock-photo cheese) | every hero passes the existing curation checklist in `src/lib/images/CURATION_RULES.md` | manual review |
| 7.4 | Attribution per image | every Unsplash/Pexels image has the photographer credit in the methodology block | grep |
| 7.5 | Memory cap during fetch | image-import script peak RSS ≤ 400 MB (stream binary fetch to disk, never buffer entire file in JS) | sampled `process.memoryUsage()` |
| 7.6 | Bandwidth cap | image-import script makes ≤ 60 API calls per minute (Unsplash free tier limit) | sleep between requests |

### Required deliverables

- Extend `scripts/images/import_unsplash.ts` (already exists) to:
  - Read the missing-images list dynamically (queries city + country data, finds nulls).
  - Process in batches of 10 with 10s sleep between batches.
  - Sample memory every batch; if over 400 MB, flush + restart.
- Run the script against the missing-images list.
- For any city where no good editorial image exists, fall back to the existing pattern-card hero (so no city is visually blank).

### Acceptance criteria

- All 6 targets pass.
- Founder walks the cities list and finds no visually blank city.

---

## SECTION 8 — Site-wide "estimated" / "modeled" disclaimer purge

**Goal:** every apologetic "estimated", "modeled", "approximate" pill or copy block that bad-mouths our own data is removed from the user-visible surface. Trust signals replace them: a quiet methodology link in the footer of every page, and a "How we know this" link inline with stat blocks.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 8.1 | "Estimated" pills rendered | **0** instances across all pages | grep on rendered text |
| 8.2 | "Modeled" pills rendered | **0** instances | grep |
| 8.3 | Confidence-band UI that reads as apologetic | **0** instances (replace with the v34 dotted-underline pattern that opens the methodology) | grep |
| 8.4 | Methodology link in footer of every page | **100%** | per-page audit (already exists) |
| 8.5 | "How we know this" link on stat blocks | added where the data was previously labeled "estimated" | grep |

### Required deliverables

- Site-wide find/replace of every "Estimated", "Modeled", "Approximate" badge component.
- New small component: `src/components/HowWeKnowThis.tsx` — a tiny inline link that opens `/about-data#<anchor>` for the relevant metric.
- Extend the v34 monetization-coverage audit (`coverage/monetization-coverage.html`) with a new gate "no apologetic copy".

### Acceptance criteria

- All 5 targets pass.
- Founder walks 10 cell pages, 5 city pages, 5 industry pages: zero "estimated" pills visible.

---

## SECTION 9 — Per-city quality sweep (the verification gate for sections 2-6)

**Goal:** for every covered city in the database, every check from sections 2-6 passes. The agent does not declare any section "done" until this sweep is green for that section.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 9.1 | Coverage report HTML | `coverage/cities-coverage.html` exists, renders a matrix of [city × check] cells | new script |
| 9.2 | Every cell green or explicit-pending | no red cells | matrix audit |
| 9.3 | Per-check pass rates documented | each section's pass rate logged in the report header | matrix audit |
| 9.4 | Per-city pages tested in production | 10 random city URLs hit with cell-smoke-style script, all render < 3s | new script |

### Required deliverables

- New script: `scripts/audit/cities_coverage.ts` — same shape as the existing monetization-coverage audit. Walks every city, every check; outputs `coverage/cities-coverage.json` + `.html`.
- New script: `scripts/audit/city_page_smoke.ts` — hits 10 random city URLs in production with cache busters; measures TTFB.

### Acceptance criteria

- All 4 targets pass.
- Coverage HTML opens locally + the founder eyeballs it before deploy.

---

## SECTION 10 — Site-wide logo bump

**Goal:** the header logo at top-left is bigger than today's 32px.

### Hard targets

| # | Metric | Target | Verifier |
|---|---|---|---|
| 10.1 | Header logo size | **40px** (was 32px). The header's vertical padding adjusts to keep the visual centerline. | grep |
| 10.2 | Mobile logo size | **32px** (slight downsize from desktop, but bigger than today's mobile) | grep |
| 10.3 | No layout shift on other nav items | spacing recalculated so Pricing button still aligns | manual |

### Required deliverables

- Edit `src/app/layout.tsx`: bump `<LogoWordmark size={32} ... />` to `size={40}` and adjust the header's `py-6 md:py-7` to `py-5 md:py-6` if needed for visual balance.

### Acceptance criteria

- All 3 targets pass.
- Header looks more prominent without becoming top-heavy.

---

## SECTION 11 — Final integration sweep

After sections 1-10 are individually green:

- Run the full prebuild chain.
- Run all sanity scripts: `cities_coverage`, `city_page_smoke`, `cell_page_smoke` (from prior sweep).
- Deploy to production.
- Wait 60s for the deploy to settle.
- Run the same sanity scripts against the production URL.
- Open `coverage/cities-coverage.html` AND `coverage/monetization-coverage.html`.
- Walk 20 random city + cell URLs as a cold visitor and confirm: map renders + zooms + clicks work, city page hero overlays work, no duplicate country labels, no apologetic pills, top-5 sections render, formation costs render where data exists.

### Acceptance criteria for the whole prompt

- **All 10 sections green.**
- **All regression tests passing.**
- **No new prebuild violations.**
- **Production smoke green for 24 hours straight.**
- **Process RSS during any pipeline run never exceeded 600 MB.**

---

## Execution order

The agent must execute in this order:

1. **Section 2 (cities list curation)** — without the new cities, every downstream test on the map references the wrong baseline.
2. **Section 5 (data pipeline)** — populates the metrics that sections 4 and 6 render.
3. **Section 1 (map styling + zoom + tooltip)** — independent visual work; can ship in parallel with sections 5 and 6.
4. **Section 3 (country-grouped list)** — independent; can ship in parallel.
5. **Section 4 (city page hero overlay)** — depends on Section 5 (needs the new metrics).
6. **Section 6 (new content sections)** — depends on Section 5.
7. **Section 7 (hero image fill)** — independent; can ship in parallel.
8. **Section 8 (estimated-disclaimer purge)** — independent; can ship in parallel.
9. **Section 9 (per-city quality sweep)** — runs AFTER sections 2-6 are green.
10. **Section 10 (logo bump)** — trivial; can ship any time.
11. **Section 11 (final integration sweep)** — the gate.

---

## Memory hygiene throughout

The 600 MB RAM cap is hard. Every pipeline step:

- Wraps long loops in `process.memoryUsage()` sampling every N iterations.
- Logs RSS every 5 minutes during long runs.
- Streams CSV / JSON reads (never `JSON.parse(readFileSync(huge.json))`).
- Chunks Supabase writes in batches of 500.
- Triggers `global.gc()` (with `--expose-gc` flag) at chunk boundaries when RSS > 400 MB.
- If RSS approaches 500 MB despite chunking, flushes partial results to disk and restarts the process with a `--resume-from=<slug>` flag.

A monitoring script `scripts/util/memory_guard.ts` wraps any long-running pipeline and kills the process with a snapshot if it exceeds 600 MB.

---

## What this prompt is NOT

- Not a wishlist.
- Not a "let me know what blocks you" letter.
- Not a "we'll iterate on this" memo.
- Not permission to bypass the 600 MB cap.

Every target has a hard pass / fail. The agent does not declare success on any section until every target in that section is green. If a target genuinely cannot be hit (e.g. metro-GDP for a specific small city is unfindable in any public source), the agent escalates with the city name, every source tried, and a concrete request — never silently moves the goalpost.

---

## Where the agent should report

- Per-section status updates as the work progresses.
- A final summary at the end with: targets met, targets failed (if any), commits shipped, URLs to verify.
- The complete cities-coverage report at `coverage/cities-coverage.html`.
- The extrapolation audit log at `data/cities/extrapolation_log.json`.

---

**End of prompt.**
