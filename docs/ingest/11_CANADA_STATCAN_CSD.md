# Phase 11 — Canada: Provinces → CMA → CSD

## Targets
- 13 provinces + territories (`CA-ON`, `CA-QC`, etc.)
- 35 Census Metropolitan Areas (CMA) — Toronto, Montreal, Vancouver, etc.
- 5,000+ Census Subdivisions (CSD) — top 500 in this phase

## Sources
- **StatCan Open Government Portal**: https://www.statcan.gc.ca/en/microdata/data-centres
- **Business Register** (Table 33-10-0666-01): https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3310066601
- **Canadian Business Counts (CBC)**: by NAICS and CMA, monthly updates
- API via StatCan WDS: https://www150.statcan.gc.ca/t1/wds/rest/getDataFromVectorsAndLatestNPeriods

Free, no key required.

## Industry mapping
Canada uses the same **NAICS** classification as the US. Existing crosswalk works 1:1.

## Schema mapping
```
country := 'CA'
geo_id := for province: 'CA-' + 2-letter (e.g. 'CA-ON')
         for CMA: 'CA-CMA-' + 3-digit CMA code (e.g. 'CA-CMA-535' = Toronto)
         for CSD: 'CA-CSD-' + 7-digit (e.g. 'CA-CSD-3520005' = Toronto City)
geo_level := 'province' | 'cma' | 'csd'
geo_name := from StatCan SGC (Standard Geographical Classification)
industry_id := mapped from NAICS-3/6
year := from query
size_band := CBC bands: 1-4 / 5-9 / 10-19 / 20-49 / 50-99 / 100-199 / 200-499 / 500+
n_enterprises := from Business Register
n_employees := from BR
revenue_per_firm := where reported
quality_score := 80
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD' after CAD→USD
```

## Implementation
1. `scripts/ingest/ca_statcan/fetch_province.py`
2. `scripts/ingest/ca_statcan/fetch_cma.py`
3. `scripts/ingest/ca_statcan/fetch_csd.py` — top 500 by population.
4. `scripts/ingest/ca_statcan/sgc_lookup.csv` — geo codes.
5. `scripts/ingest/ca_statcan/normalize.py` + `upload.py` + `run.py`.

## Expected output
~548 geos × 30 industries × ~3 bands = **~50,000 cells.** Post n<5 drop: ~30,000. Storage: ~10 MB. Time: 4 hours.

## Spot-checks
- `/ca/ontario/residential-construction`
- `/ca/quebec/restaurants`
- `/ca/british-columbia/web-mobile-dev-shops`
- `/ca/alberta/oil-gas-extraction` (corp_only)
- `/ca/cma/toronto/management-consulting`
- `/ca/cma/montreal/cafes-coffee-shops`
- `/ca/cma/vancouver/restaurants`
- `/ca/csd/toronto-city/clothing-stores`
- `/ca/csd/calgary/auto-repair-shops`
- `/ca/csd/ottawa/professional-services`

## DoD
- [ ] All 13 provinces + 35 CMAs + 500 CSDs
- [ ] ≥ 25,000 CA rows
- [ ] 10/10 spot-checks
