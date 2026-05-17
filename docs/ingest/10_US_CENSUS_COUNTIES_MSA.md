# Phase 10 — US: Counties + MSAs + ZIP rollup

> **Goal:** Drive US from the current state-level coverage down to
> **county (3,143)** and **MSA (384)** + a ZIP rollup for the top 500
> metros. This is the biggest single phase by rowcount and the highest
> SEO leverage (US queries dominate organic search).

## Targets
| Level | Count | Phase |
|---|---|---|
| State | 51 | Already live |
| MSA (Metropolitan Statistical Area) | 384 | THIS phase |
| County | 3,143 | THIS phase |
| ZIP rollup (for top 500 metros) | ~10,000 ZIPs | THIS phase |

## Sources
- **US Census Bureau County Business Patterns (CBP)**: https://api.census.gov/data/2022/cbp
- **County Business Patterns ZIP Code Business Patterns (ZBP)**: https://api.census.gov/data/2022/zbp
- **Statistics of US Businesses (SUSB)** for size-class breakdown by state (already in cells_master); MSA-level via CBP since 2018.
- API key required, free: https://api.census.gov/data/key_signup.html — store in env `CENSUS_API_KEY`.

## Industry mapping
NAICS-6 (US). We already have crosswalk in `apply_taxonomy.py`. CBP returns NAICS-2/3/4/6 — use NAICS-3 for industry aggregation, NAICS-6 for sub-niches where covered.

## Schema mapping
```
country := 'US'
geo_id := for county: 'US-' + 5-char state+county FIPS (e.g. 'US-06037' = Los Angeles)
         for MSA: 'US-MSA-' + 5-digit CBSA code (e.g. 'US-MSA-31080' = LA-Long Beach-Anaheim)
         for ZIP: 'US-ZIP-' + 5-digit (e.g. 'US-ZIP-90210')
geo_level := 'county' | 'msa' | 'zip'
geo_name := from Census FIPS lookups
industry_id := mapped from NAICS-3 (then NAICS-6 fallback for sub-niches)
year := 2022 (most recent CBP)
size_band := CBP "EMPSZES" codes 212 / 220 / 230 / 235 / 240 / 250 / 260 / 270 → our 5 bands
n_enterprises := EST (number of establishments)
n_employees := EMP
revenue_per_firm := NULL (CBP doesn't have revenue; would need SUSB)
payroll_per_employee := PAYANN / EMP
quality_score := 85 (Census Bureau primary measurement)
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD'
```

## Implementation
1. `scripts/ingest/us_census/fetch_cbp_counties.py` — paginated per state (51 calls × ~30 industries) to stay under 50k cell limit per call.
2. `scripts/ingest/us_census/fetch_cbp_msa.py`
3. `scripts/ingest/us_census/fetch_zbp.py` — top 500 metros only (cap by population).
4. `scripts/ingest/us_census/county_lookup.csv` (FIPS), `msa_lookup.csv` (CBSA), `zip_lookup.csv` (geocode + population).
5. `scripts/ingest/us_census/normalize.py`
6. `scripts/ingest/us_census/upload.py` (batched, with idempotent PK)
7. `scripts/ingest/us_census/run.py` — orchestrator
8. Resume `us_census_progress.json` (per state + per MSA range)

## Expected output
- County: 3,143 × ~30 industries × ~5 bands = ~120,000 cells (post n<5 drop: ~90,000)
- MSA: 384 × ~30 × 5 = ~50,000 cells (~35,000 post-drop)
- ZIP: ~10,000 ZIPs × ~10 top industries × 1 band = ~50,000 cells
- **Total: ~175,000 cells.** Storage: ~55 MB. Time: 8 hours.

## Spot-checks
- `/us/los-angeles-county/restaurants` (06037)
- `/us/cook-county/legal-services` (17031)
- `/us/king-county/web-mobile-dev-shops` (53033) — Seattle
- `/us/harris-county/oil-gas-extraction` (48201) — Houston (corp_only normally hidden; visible in Pro)
- `/us/maricopa-county/residential-construction` (04013) — Phoenix
- `/us/miami-dade-county/hotels-lodging` (12086)
- `/us/queens-county/restaurants` (36081)
- `/us/orange-county/cosmetics-shops` (06059) — CA
- `/us/dallas-county/management-consulting` (48113)
- `/us/santa-clara-county/software-development` (06085) — Silicon Valley
- `/us/msa/new-york-newark-jersey-city/restaurants` (35620)
- `/us/msa/los-angeles-long-beach-anaheim/cafes-coffee-shops` (31080)

## RAM
CBP API responses paginated < 50 MB each. Total peak ~100 MB.

## URL routing
Add to website cells.ts:
```ts
// Resolve 'los-angeles-county' → US-06037
// Resolve 'msa/new-york-newark-jersey-city' → US-MSA-35620
// Resolve 'zip-90210' → US-ZIP-90210
```
Slug builder `geo_id_to_slug` and `slug_to_geo_id` helpers added per geo_level.

## DoD
- [ ] All 3,143 counties with ≥ 10 industry cells each
- [ ] All 384 MSAs populated
- [ ] Top 500 ZIPs across 50 largest metros
- [ ] 12/12 spot-checks render
- [ ] ≥ 150,000 US rows in `regional_cells`
- [ ] Sitemap auto-includes new URLs (sitemap.ts uses cellUrl helper)
- [ ] Trigger Supabase upgrade decision before this phase commits 50% (~60 MB)
