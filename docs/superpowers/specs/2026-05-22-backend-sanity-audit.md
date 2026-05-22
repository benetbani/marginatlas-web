# Backend sanity audit — 2026-05-22

> Founder request after several rounds of UI debugging where the
> underlying data turned out to be the real problem. Goal: a complete,
> honest assessment of what's in the database, what hallucinations have
> bitten us, and exactly what data we need to acquire / fix / drop to
> make the product credible.

## The three tables

Margin Atlas runs on three Supabase tables. Everything user-visible
flows through one of these. Inventory probe in progress; numbers below
are from prior session work + targeted probes today.

### 1. `cells_master` — US only

- **Total rows:** ~722,432 (per Plan v24 Block 11 probe)
- **Country scope:** US only (`country = 'US'`)
- **Industry codes:** NAICS-6 (6-digit North American Industry
  Classification System)
- **Geo:** state-level via `geo_id = 'US-XX'` (XX = FIPS code, 50 states + DC)
- **Years:** 2024 dominant; some older. Index on `year` but not
  `total_employment`.
- **Source flavor:** statistical-agency aggregates (no source-agency
  names per R-002)

**Per-cell fields:**
- `n` (enterprise count)
- `total_employment`
- `rev_p10 / rev_p25 / rev_p50 / rev_p75 / rev_p90` (revenue percentiles)
- `mean_wage_per_employee_usd`
- `quality_score` (0-100)
- `coverage_tier` (P / G / X / etc.)
- `industry_description` (free text)

**Strengths:**
- Comprehensive industry coverage (~1,000+ NAICS-6 codes)
- 50-state coverage
- Real measured data with quality tier

**Weaknesses:**
- US ONLY. Margin Atlas is supposed to be global.
- State-level is the only granularity (no metro, no county, no city)
- NAICS-6 doesn't map cleanly to non-US classification systems
- Sub-niche industries (eg `craft_breweries_taprooms`) aren't in
  cells_master, they resolve up to their parent NAICS-3
- No FIPS county codes despite the table being called "cells_master"

### 2. `regional_cells` — international, sub-national

- **Total rows:** ~376k (per Plan v24 Block 6 scanner)
- **Country scope:** ~22 European countries primarily, plus some
  Asian/Latin coverage
- **Industry codes:** Margin Atlas's own friendly `industry_id` (eg
  `restaurants`, `software_development`)
- **Geo levels:** mix per country:
  - DE/FR/IT/BE/PL/PT/SE/DK/NO/FI/CZ/HU/RO/IE: NUTS-1 + NUTS-2 only
  - GB: LAD (Local Authority District) codes (~249 of them)
  - ES: NUTS-2 + province codes (ES-XX format)
  - NL: NUTS-2 + municipality codes (NL-GMxxxx format)
  - CH / AT / TR / RU: city-overlay codes (XX-CITY-name format)
  - GR: empty (zero rows)
- **Years:** 2024 dominant

**Per-cell fields:**
- `n_enterprises`
- `n_employees`
- `rev_p10/25/50/75/90`
- `payroll_per_employee`
- `quality_score`
- `coverage_tier`
- `industry_id` (friendly slug)

**Strengths:**
- Real international data
- Friendly industry slugs that match the URL taxonomy
- Quality tiers

**Weaknesses (CRITICAL):**
- **No NUTS-3 anywhere for Europe.** Frankfurt, Lyon, Milan, Madrid —
  all the major cities the founder cares about — don't have city-level
  rows. Best we can do is NUTS-2 region containing them.
- **22 European countries, ~5 others** — vs the 195+ countries the
  site advertises in COUNTRIES
- **GB uses LAD codes (good), Spain uses provinces (good), Netherlands
  uses municipalities (good), but the format varies per country.**
  No unified geo_id pattern. Code has to special-case each country.
- **Switzerland / Austria / Turkey / Russia use proprietary
  `XX-CITY-name` codes** instead of any standard scheme
- **Greece has zero rows.** Athens, Thessaloniki aliases point nowhere
- **Some rows have scale anomalies** — Plan v24 Block 1 scanner found
  11,325 cells with values outside SMB-physical bounds (e.g.
  Liechtenstein utilities at $5B revenue per firm, Lugano grocery at
  $1.87B). These are now suppressed at the render layer but not removed
  from source. The triage data is in cell_triage_v1.json (2.8 MB).

### 3. `extrapolated_cells` — country-level estimates

- **Total rows:** ~57k
- **Country scope:** broader (~80+ countries via `country_iso3`)
- **Industry codes:** friendly `industry_id`
- **Geo:** country-only. No sub-national granularity.
- **Fields:** `predicted_rev_per_firm`, `country_iso3`, `country_name`,
  `industry_id`, `year`, `size_band`, `quality_score`, `coverage_tier`

**Strengths:**
- Wider country coverage than regional_cells
- Single point estimate per (country, industry, size_band, year)

**Weaknesses:**
- Single point estimate, no percentile distribution (the cell page
  synthesizes a ±50% spread for display)
- Quality is typically lower (coverage_tier = 'X' for most)
- Cross-country outliers: Plan v24 Block 6 scanner found 297 cells
  with >10x deviation from global industry median. Liechtenstein
  furniture at 1509x median. Switzerland veterinary at 1506x. These
  came from extrapolation overfit on small-sample countries.

## Hallucinations observed in this session (chronological)

These are the specific data failures the founder caught:

### H1 — Frankfurt → Hessen (Plan v24)
- **Symptom:** `/de/frankfurt/restaurants` rendered "How much does a
  restaurant make in Hessen?" — geo_name showed the NUTS-1 region, not
  the city.
- **Root cause:** Frankfurt has no row in regional_cells (no NUTS-3 in
  the DB). The auto-alias map pointed `frankfurt → DE7` (Hessen NUTS-1).
- **Fix shipped:** Manual alias `frankfurt → DE71 Darmstadt` (NUTS-2)
  with display label override "Frankfurt am Main".
- **Underlying issue not fixed:** The DB still has no NUTS-3 data. The
  best we can do is regional-level masquerade. **We need NUTS-3
  Eurostat data ingested.**

### H2 — Switzerland $245M restaurants (Plan v24)
- **Symptom:** Cell page for Swiss restaurants showed $245M revenue
  per firm.
- **Root cause:** Extrapolated_cells row with bad value. Tax-haven /
  outlier bias.
- **Fix shipped:** Scale-sanity scanner + auto-triage. 119 cells
  auto-suppressed (severity ≥ 2). Render layer returns null on
  suppressed cells. Cross-country chart filters via SMB-physical
  bounds (REVENUE_PER_FIRM_BOUNDS).
- **Underlying issue not fixed:** extrapolated_cells generation
  pipeline still produces bad values for tax-haven countries.

### H3 — Software dev California $525K with $99K wage / 4 employees
- **Symptom:** Founder math: 4 × $99K = $396K payroll, $525K revenue
  → tight margin, "common sense check fails".
- **Root cause:** cells_master row has internally-coherent numbers
  for that NAICS code in California, but the implied employees-per-firm
  conflicts with what users intuitively expect.
- **Fix shipped:** Plan v25 Block 2 `enforceSanity()` caps employees
  so revenue / (employees × wage) ≥ 1.4. UI displays a more sensible
  employee count.
- **Underlying issue not fixed:** The raw data still says $525K
  median for SF software dev. That's the published statistic.

### H4 — Featured tiles "Click for details" (Plan v24/v25)
- **Symptom:** Homepage 9-tile grid had 7 tiles saying "Click for
  details" with no number.
- **Root cause:** The FEATURED list referenced (country, geo, industry)
  triples where the data didn't resolve.
- **Fix shipped:** Plan v25 Block 6 — fall back to synthesizeCell() so
  every tile shows a number.
- **Underlying issue not fixed:** Specific tuples like Tokyo ramen,
  LA gyms, Milan boutiques have no real row. Synthesis fills the gap
  but the numbers are estimates, not measured.

### H5 — "Restaurant in Chile makes millions, Barcelona makes $46K" (Plan v24)
- **Symptom:** Cross-country chart showed wildly different revenue
  across countries for the same industry.
- **Root cause:** extrapolated_cells outliers. Liechtenstein /
  Switzerland / Monaco / Qatar / Andorra had restaurant revenue 100x-
  1500x the global median due to extrapolation overfit.
- **Fix shipped:** Plan v24 Block 6 — cross-country chart filters via
  SMB-physical bounds and orders by quality_score DESC. Plan v24 Block
  6 cross_country_outliers.ts script identified 297 specific outliers.
- **Underlying issue not fixed:** The extrapolation model itself is
  broken for small countries. Needs retraining or hard-cap on outputs.

### H6 — Sitemap shard 2 empty (Plan v24/v26)
- **Symptom:** `/sitemap/2.xml` served 110 bytes (empty urlset) for
  weeks. Search engines never saw regional URLs.
- **Root cause 1:** `getTopRegionalCells(20000)` hit Supabase
  statement timeout, silently returned [].
- **Root cause 2:** When I changed to limit=5000 with no quality
  ordering, the downstream filter `score100to10(quality_score) >= 4`
  dropped all 1000 returned rows because they were random low-quality.
- **Fix shipped:** Limit 1000 (PostgREST cap) + keep quality_score
  DESC ordering.
- **Underlying issue not fixed:** Supabase free tier has 60-second
  statement timeout. Queries above 1000 rows are problematic.

### H7 — Edge function 1.15 MB > 1 MB cap (Plan v26)
- **Symptom:** Every Vercel deploy from Plan v24 Block 1 through
  Plan v25 failed with "The Edge Function 'og/cell' size is 1.15 MB
  and your plan size limit is 1 MB."
- **Root cause:** triage.ts switched from `node:fs` to JSON import
  to fix an Edge runtime compat issue. The JSON import inlined the
  2.8 MB cell_triage_v1.json into every module that transitively
  imported cells.ts, including the Edge OG route.
- **Fix shipped:** Switched /og/cell from edge to nodejs runtime.
- **Underlying issue not fixed:** Loading 2.8 MB of triage data into
  every server function is wasteful. Should be a runtime fetch.

## Coverage gaps

### Country coverage

What COUNTRIES const says vs what's actually in DB:

| Source | Country count |
|---|---|
| `COUNTRIES` const in taxonomy.ts | ~195 |
| `cells_master` | 1 (US only) |
| `regional_cells` | ~22 (mostly EU + a few others) |
| `extrapolated_cells` | ~80 |

**Reality:** for most non-EU non-US countries, the only data is a
single extrapolated point estimate. Sub-national granularity is
essentially zero outside EU.

### Granularity gaps

What the URL structure promises vs what the data delivers:

| URL pattern | Coverage |
|---|---|
| `/[country]` | All 195 (via extrapolated) |
| `/[country]/[geo]` | US: 50 states. EU: 22 countries × NUTS-2. Rest: none. |
| `/[country]/[geo]/[industry]` | Same as above, but per-industry |
| `/[country]/[city]/[neighborhood]/[industry]` (NEW Plan v26) | 23 cities with synthesized neighborhood data |

**The neighborhood layer is 100% synthesized**, not measured. Phase B
acknowledges this with the "Estimated benchmark" badge.

### Industry coverage gaps

- NAICS-6 in cells_master has ~1000 codes
- Friendly industry taxonomy has 223 industries
- ~16 friendly industries are "legacy aliases" that redirect
- ~31 industries have `audience: corp_only` and are hidden by default
- ~5 industries have no NAICS mapping at all (e.g. very niche
  sub-trades)

### Year coverage

- cells_master: dominantly 2024, some 2023 / 2022
- regional_cells: dominantly 2024
- extrapolated_cells: 2024

**No real time series.** The site has `buildTimeSeries()` helper but
in practice most cells have only one year. Year-over-year comparison
is essentially impossible.

### Field coverage gaps

Null rates from prior probes (sampled):

| Field | cells_master null % | regional_cells null % |
|---|---:|---:|
| revenue_per_firm / rev_p50 | ~5% | ~10% |
| rev_p10 / rev_p90 | ~15% | ~20% |
| n_employees / total_employment | ~10% | ~25% |
| payroll_per_employee | n/a | ~30% |
| quality_score | ~0% | ~5% |

(Probe will refine these when it finishes.)

**Plan v25 fillMissingFields synthesizes null fields, so the UI
always renders. But the disclosed accuracy of synthesized fields is
lower than measured ones.**

## Architectural problems

### A1. No unified geo_id schema

Each country has its own convention:
- US: `US-XX` (FIPS state code) + sometimes `US-XX-XXX` (FIPS county)
- DE/FR/IT/etc.: NUTS codes (`DE71`, `FRK2`, `ITI4`)
- GB: LAD codes (`GB-E08000025`)
- ES: provinces (`ES-08`)
- NL: municipalities (`NL-GM0363`)
- CH/AT/TR/RU: city overlays (`CH-CITY-zurich`)

**Impact:** every URL slug → geo_id resolution needs per-country
logic. The manual_city_aliases.ts file exists to paper over this.
Adding a new country means writing new resolver branches.

**Recommended fix:** standardize on a single hierarchical scheme.
Either (a) ISO-3166-2 subdivision codes everywhere, (b) bespoke
"slug + parent_slug" lineage in a separate `regions` table.

### A2. Three separate cell tables with overlapping intent

- cells_master: US only
- regional_cells: international sub-national
- extrapolated_cells: country-level fallback

**Impact:** four separate query paths in cells.ts. Bugs surface when
the fallback chain is wrong (e.g. Frankfurt drift fix moved the label
override OUT of getRegionalCell because that path wasn't fired).

**Recommended fix:** consolidate into a single `cells` table with a
`coverage_tier` column distinguishing measured / regional / country /
extrapolated. Or at minimum: standardize the columns and query
interface so all three look the same to the application.

### A3. The cell_triage_v1.json is 2.8 MB and bundled

This file was responsible for breaking every deploy for 3 weeks.

**Recommended fix:** either (a) move suppression to a DB row flag
(`is_suppressed` column on each table), or (b) load via runtime fetch
not bundled JSON.

### A4. Quality score is on a 0-100 scale but logic switches between 0-10 and 0-100

`score100to10` translates between scales. Different callers use
different scales. This caused the shard 2 empty issue: filter said
`>= 4` (0-10 scale) but the data is 0-100.

**Recommended fix:** pick one scale and stick to it across the codebase.

### A5. PostgREST 1000-row cap is not respected anywhere

Multiple call sites use limits like 5000, 20000. PostgREST caps at
1000 by default. Queries silently truncate or time out.

**Recommended fix:** raise the Supabase max-rows setting (project
config), or paginate explicitly when N > 1000.

### A6. Edge cache and stale-while-revalidate masks bugs

When Vercel served the 110-byte sitemap for hours after a deploy with
a fix, the cache hid the staleness. There's no health-check that
verifies "is the production sitemap populated?"

**Recommended fix:** add a Sentry / monitoring assertion that checks
sitemap shard sizes on every deploy and alerts if any shard < 1 KB.

## Data we should acquire (in priority order)

### P0 — Eurostat NUTS-3 / LAU-2

**Why:** the founder cares deeply about Frankfurt, Lyon, Milan,
Madrid, Barcelona — all of which need city-level data. NUTS-3 is the
finest official European division (Frankfurt am Main = DE712).

**What:** Eurostat's `Structural Business Statistics` (SBS) at NUTS-3
granularity. Available as Eurostat bulk download CSV.

**Effort:** medium. Eurostat publishes CSV; we'd need an ingestion
script that maps Eurostat codes to our taxonomy and writes to
regional_cells. ~2-3 days of work.

### P1 — More countries in extrapolated_cells

Currently ~80 countries. The COUNTRIES list has ~195. Gap = ~115.

**What:** extend the extrapolation model to cover the missing
countries. Use World Bank's `Enterprise Surveys` and OECD SDBS
(Structural and Demographic Business Statistics) as anchors.

**Effort:** large. Requires either (a) hand-curating each missing
country, or (b) building a generic extrapolation that uses GDP /
labor force / wage index from World Bank to estimate per-industry
revenue.

### P2 — UK LSOA-level (or borough × industry intersection)

UK already has LAD codes. LSOA (Lower Layer Super Output Area) would
go finer. London especially benefits.

**Effort:** medium. ONS publishes LSOA-level business stats.

### P3 — Spain at municipal level

Spain has province codes; municipal level would add ~8,000 distinct
geos. Probably overkill for current needs.

**Effort:** medium.

### P4 — Year-over-year history

Right now most cells are 2024 only. To enable trends and
"year-over-year change" copy, we need 2020-2024 at minimum for the
top industries.

**Effort:** large. Re-ingest from country statistical agencies for
multiple years.

## Data we should drop / suppress

### D1 — Tax-haven extrapolations

Liechtenstein, Monaco, Andorra, San Marino, Cayman Islands, Bermuda
— extrapolated_cells values are systematically broken (100x-1500x
median). Either:
- Drop from extrapolated_cells entirely
- Re-extrapolate with a hard cap (revenue ≤ industry 90th percentile
  globally × 2)
- Suppress at render layer (Plan v24 Block 1 already does this for
  119 of them, but the model produces more bad values for these
  countries)

### D2 — The cells_master rows with null industry_description

About 5% of cells_master rows have null industry_description. Without
a description we can't surface them in the sitemap (the helper
explicitly filters them out). They take DB space without serving.

### D3 — Old size_band labels

cells_master uses various size band labels ("ALL", "1-4 emp",
"5-9 emp", etc.). Sometimes the same band appears under multiple
variants. Standardize on a single label scheme.

## Recommended improvements (architectural)

### I1. Add a `cells` materialized view

Union cells_master + regional_cells + extrapolated_cells into a
single view with unified columns. The application reads one source.

### I2. Add a `geos` table

Master list of every (country, geo_id, geo_name, geo_level, parent_geo_id).
The friendly slug → geo_id resolution becomes a single lookup
instead of per-country branches.

### I3. Add an `aliases` table

URL slug → geo_id (and industry slug → industry_id) mapping. Move
the manual_city_aliases.ts and city_aliases_generated.ts data into
a DB table so updates don't require deploys.

### I4. Per-deploy data-freshness assertions

After every Vercel deploy, run a smoke probe that hits:
- /sitemap/0.xml through /sitemap/5.xml (each > 1 KB)
- /us/california/restaurants (has $X revenue, not "Click for details")
- /de/frankfurt/restaurants (geo_name = "Frankfurt am Main")
- /xx/yy/restaurants (Estimated badge present)

If any assertion fails, the deploy is rolled back automatically.

### I5. Surface synthesis vs measurement in the API

The cell page already shows "Estimated benchmark" badging. But
internal API consumers (Pro tier, B-011 still parked) need to see
`is_synthetic`, `coverage_tier`, and `quality_score` on every
response. Make these mandatory fields.

### I6. Build a `data_quality` dashboard

Internal-only admin route at `/admin/data-quality` that surfaces:
- Suppressed cells (severity histogram)
- Cross-country outliers
- Recent ingest dates per table
- Null-rate trends

This would have surfaced the empty-sitemap problem in days, not weeks.

## Priority action queue

| Rank | Action | Effort | Risk if not done |
|---|---|---|---|
| 1 | Ingest Eurostat NUTS-3 (P0) | 2-3 days | Frankfurt / Lyon / Milan / Madrid all render as "regional masquerade" indefinitely |
| 2 | Move triage data out of bundle (A3 fix) | 4 hours | Another Edge function size cliff |
| 3 | Drop tax-haven outliers (D1) | 4 hours | Cross-country chart keeps surfacing nonsense even with current filters |
| 4 | Add per-deploy assertions (I4) | 1 day | Next silent regression sits in prod for weeks |
| 5 | Re-extrapolate for missing countries (P1) | 1-2 weeks | The site advertises 195 countries but only 80 have data |
| 6 | Standardize quality scale 0-100 vs 0-10 (A4) | 4 hours | Future filters silently misfire |
| 7 | Build aliases + geos tables (I2, I3) | 2 days | Adding cities means code edits + deploys; should be data edits |
| 8 | UK LSOA-level granularity (P2) | 3 days | London neighborhood layer stays synthetic |
| 9 | Year-over-year history (P4) | 2 weeks+ | "Trends" remains unspeakable |
| 10 | data_quality admin dashboard (I6) | 2 days | Operating blind on data health |

## Critical lessons from this session

1. **Silent failures compound.** The empty sitemap shipped for weeks
   because nothing alerted on it. Add deploy-time assertions.
2. **Bundle bloat is invisible until it crosses a tier limit.** Add
   a guard (Plan v26 A.6 already shipped this).
3. **PostgREST 1000-row cap is real.** Never assume queries with
   `limit(N)` where N > 1000 will return N rows.
4. **Edge runtime caps function size at 1 MB on Hobby.** Watch all
   import chains into Edge routes.
5. **JSON imports inline into the bundle.** What looks like "lazy
   loading" of a 2.8 MB data file actually puts 2.8 MB into every
   transitively-importing function.
6. **Vercel build env differs from local.** Local builds with
   `.env.local` and warm Supabase connections succeed where Vercel
   builds with cold connections and possibly different env vars fail.
   Test against production, not local.
7. **The fallback chain order matters more than each step.** When
   regional misses, the chain falls to extrapolated, which has
   different geo_name semantics. The drift fix moved the label override
   to the top of the chain so it works regardless of which path
   resolved.

## Live inventory (probed 2026-05-22)

Run via `npx tsx scripts/audit/backend_inventory.ts`. Raw output in
`data/audit/backend_inventory.json`.

### cells_master

- **Total rows:** count query timed out at Supabase's 60s statement
  limit (so > 500k confirmed, likely ~722k from earlier probes)
- **Distinct industries (sampled):** 717 NAICS-6 codes
- **Quality distribution (sample of 1000):** 695 cells at quality ≥ 85,
  237 in 70-85, 68 in 50-70, 0 below 50. Strong quality at the head.
- **Null rates:** ~14% on percentiles (p10, p50, p90).
  Counts and wages are essentially 100% present.

### regional_cells

- **Countries with data (37 total):**

| Country | Rows | Country | Rows |
|---|---:|---|---:|
| ES (Spain) | 14,386 | IL (Israel) | 2,112 |
| JP (Japan) | 6,951 | RO (Romania) | 1,548 |
| DE (Germany) | 6,522 | HU (Hungary) | 1,390 |
| PL (Poland) | 3,036 | TR (Türkiye) | 1,320 |
| AT (Austria) | 2,833 | ZA (S. Africa) | 1,320 |
| CN (China) | 2,640 | MY (Malaysia) | 1,320 |
| RU (Russia) | 2,640 | VN (Vietnam) | 1,320 |
| IN (India) | 2,112 | CZ (Czech) | 1,139 |
| BE (Belgium) | 1,618 | RS / others | 264-1,056 each |
| CH (Switzerland) | 1,584 | EG (Egypt) | 792 |
| KR (S. Korea) | 1,584 | AE (UAE) | 792 |
| ID (Indonesia) | 1,584 | SA (Saudi Arabia) | 1,320 |
| PH (Philippines) | 1,584 | QA (Qatar) | 264 |
| SE (Sweden) | 1,386 | IE (Ireland) | 330 |

- **Quality distribution (top-1000 sample):** all 1000 rows at quality
  ≥ 85. This is because the sample was ordered by quality_score DESC.
  The full table likely has a longer tail at lower quality.
- **Null rates:** 100% null on `rev_p10 / rev_p50 / rev_p90` (sampled).
  This means **regional_cells has NO percentile data**. The point
  estimate is computed by application code via
  `revenue_per_firm ?? rev_p50` and percentiles are then synthesized.

### extrapolated_cells

- **Total rows: 107,734** (full count succeeded — table is smaller)
- **Countries:** the sampling probe couldn't enumerate all ISO-3
  codes because of the 1000-row PostgREST cap. Earlier work
  established ~80 countries via direct queries.

## Specific gaps surfaced by inventory

### Gap 1: cells_master rev_p10/p50/p90 missing on ~14%

The application falls back to `rev_p50` if `revenue_per_firm` is
null, but on ~14% of US cells BOTH are null. These fall through to
synthesis at render time. Should re-ingest from source with stricter
column-completeness.

### Gap 2: regional_cells has 100% null on percentile columns

Every regional cell renders without measured percentiles — the
log-normal spread is synthesized from the point estimate. That's why
non-US distribution charts look uniform across industries.

**Fix:** add a follow-up extrapolation that computes per-country
percentile spreads from the available cells, persist as new columns.
Or accept the synthesis as-is and label it clearly.

### Gap 3: Countries advertised but not in regional_cells

The COUNTRIES list has ~195 entries. regional_cells has 37 countries.
Missing 158. Pages for these countries fall back to extrapolated_cells
(country-level point estimate) → synthesis. Every cell page for
Bangladesh, Pakistan, all of sub-Saharan Africa, most of Latin America,
Greece, etc. is essentially synthesized.

### Gap 4: Heavily concentrated coverage

ES alone is 14,386 rows — more than DE + PL + AT + JP combined for
non-US. The data was clearly ingested unevenly. ES gets sub-national
+ provinces, while Greece gets zero. The user-facing experience is
inconsistent.

### Gap 5: The extrapolated_cells row count surprised

107,734 rows. With ~80 countries × ~30 industries × ~2 size-bands × 2-3
years that's roughly the expected count. **The model is doing a lot
of work to fill these in.** Every row outside the SMB-physical bounds
is a hallucination by our model, not a measurement.

## Updated priority queue (with inventory data)

| Rank | Action | Effort | Why now |
|---|---|---|---|
| 1 | Add percentile columns to regional_cells (rev_p10-p90) | 1-2 weeks | 100% null today; every non-US distribution chart synthesizes |
| 2 | Ingest Eurostat NUTS-3 for top-30 European cities | 2-3 days | The "Frankfurt → DE71 region" workaround is the best we can do today |
| 3 | Drop tax-haven extrapolations OR retrain with hard cap | 4 hours | Cross-country chart filter is firefighting outputs |
| 4 | Move triage data out of bundle (suppression via DB flag) | 4 hours | Permanent fix for the Edge bundle cliff |
| 5 | Backfill cells_master percentile nulls | 1-2 weeks | 14% of US cells render synthesized percentiles |
| 6 | Extend extrapolated_cells to all 195 countries | 2 weeks+ | Currently 80 / 195. Site advertises 195. |
| 7 | Per-deploy data-freshness assertions | 1 day | Catch the next silent regression |
| 8 | Standardize quality scale (0-10 vs 0-100) | 4 hours | Source of the shard 2 bug |
| 9 | Build aliases + geos tables | 2 days | Adding cities currently requires code edits |
| 10 | data_quality admin dashboard | 2 days | Operating blind on data health |

## Out of scope for this audit

- Auth / Stripe (B-011 still parked)
- Real-time data streams
- Multi-language data ingestion
- AI-summary generation per cell
- API endpoint coverage for Pro tier
