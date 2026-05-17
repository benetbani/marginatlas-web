# Phase 7 — United Kingdom: NUTS-2 → LAD → MSOA

> **Goal:** Drive UK to the **LAD (Local Authority District)** level
> for all 374 LADs, plus **MSOA (Middle Super Output Area)** for the
> top 500 economically-active MSOAs. MSOA gives effective
> neighbourhood-of-city granularity.

## Targets
| Level | UK name | Count | Phase |
|---|---|---|---|
| Country | UK / EN / SC / WL / NI | 4 | n/a (whole-country) |
| Region | NUTS-1 region (East, NW, etc.) | 12 | Phase 1 |
| Subregion | NUTS-2 | 41 | Phase 1 |
| County / unitary | NUTS-3 | 179 | Phase 1 |
| Local Authority District | LAD | 374 | THIS phase |
| Middle SOA | MSOA | 7,201 | TOP 500 in this phase |

## Sources
- **ONS BRES** (Business Register and Employment Survey): https://www.nomisweb.co.uk/api/v01/dataset/NM_172_1.data.json
- **ONS UK Business Counts**: https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.data.json
- **Companies House**: https://download.companieshouse.gov.uk/en_output.html (bulk download of all 4M+ active companies)

NOMIS is the canonical ONS API for sub-national stats. Free, generous limits.

## Industry mapping
UK SIC 2007 — equivalent to NACE Rev.2 to 4 digits. Crosswalk already exists.

## Schema mapping
```
country := 'GB'
geo_id := for LAD: 'GB-' + 9-char ONS code (e.g. 'GB-E09000033' = Westminster)
         for MSOA: 'GB-' + 9-char ONS MSOA code
geo_level := 'lad' | 'msoa'
geo_name := from ONS Geography lookups
industry_id := mapped from SIC-2007 4-digit
year := from query
size_band := BRES bands: 1-4, 5-9, 10-19, 20-49, 50-99, 100-249, 250-499, 500-999, 1000+ → mapped
n_enterprises := V1
n_employees := V2 (BRES employee count)
revenue_per_firm := NULL initially (UK doesn't publish at LAD/MSOA)
payroll_per_employee := derived from ASHE (Annual Survey of Hours and Earnings) where joinable
quality_score := 80
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD' after GBP→USD
```

## Implementation
1. `scripts/ingest/gb_ons/fetch_lad_bres.py` — NOMIS API paginated.
2. `scripts/ingest/gb_ons/fetch_msoa_counts.py`
3. `scripts/ingest/gb_ons/fetch_ashe.py` — for wages
4. `scripts/ingest/gb_ons/lad_lookup.csv`, `msoa_lookup.csv`
5. `scripts/ingest/gb_ons/normalize.py`
6. `scripts/ingest/gb_ons/upload.py`
7. `scripts/ingest/gb_ons/run.py`
8. Resume `gb_ons_progress.json`

## Expected output
- LAD: 374 × ~30 industries × ~5 bands → cap at ~22,000 cells (drop n<5)
- MSOA: top 500 × ~30 × 1 band → ~15,000 cells
- **Total: ~37,000 cells.** Storage: ~12 MB. Time: 5 hours.

## Spot-checks
- `/gb/westminster/restaurants` (E09000033)
- `/gb/city-of-london/legal-services` (E09000001)
- `/gb/camden/cafes-coffee-shops` (E09000007)
- `/gb/manchester/web-mobile-dev-shops` (E08000003)
- `/gb/birmingham/clothing-stores` (E08000025)
- `/gb/leeds/management-consulting` (E08000035)
- `/gb/edinburgh/hotels-lodging` (S12000036)
- `/gb/glasgow/restaurants` (S12000049)
- `/gb/cardiff/web-mobile-dev-shops` (W06000015)
- `/gb/belfast/professional-services` (N09000003)

## RAM
NOMIS API responses are small (≤ 50 MB). Peak ~70 MB.

## DoD
- [ ] All 374 LAD populated with ≥ 15 industries
- [ ] Top 500 MSOA populated with ≥ 10 industries
- [ ] 10/10 spot-checks render
- [ ] Edinburgh + Glasgow + Cardiff + Belfast all distinct (devolved nations)
- [ ] ≥ 30,000 UK rows in `regional_cells`
