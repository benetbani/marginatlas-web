# Phase 17 — OECD + World Bank Overlay (cross-validation + bridge fillers)

> **Goal:** Two purposes — (a) cross-validate the country-level
> aggregates we already have against authoritative cross-country
> sources, flagging anomalies; (b) fill gaps for countries where no
> national-statistical-office ingest happened in phases 1–16, using
> OECD + World Bank as the source of last resort.

## Sources

### OECD Regional Statistics
- **OECD.Stat SDMX API**: https://stats.oecd.org/SDMX-JSON/
- Datasets:
  - `REGION_DEMOGR` — regional population
  - `REGION_ECONOM` — GDP, employment, productivity by TL2 (~360 regions across OECD)
  - `RFINSTAT` — regional finance statistics
  - `SNA_TABLE6A` — value added by industry × region
- ~360 OECD TL2 regions covered

### OECD Functional Urban Areas
- Database of ~1,200 metropolitan areas across OECD with economic indicators
- Provides "city" benchmarks for OECD where national-source city-level isn't available
- URL: https://www.oecd.org/cfe/regionaldevelopment/functional-urban-areas.htm

### World Bank Subnational
- **World Bank Subnational Population**: indicator `SP.POP.TOTL`
- **World Bank Subnational Poverty Equity (SPID)**: GDP per capita subnational where available
- **World Bank Enterprise Surveys**: firm-level data for ~150 countries with sub-national breakdowns
- API: https://api.worldbank.org/v2/

## Strategy

1. **Validation pass**: For every (country, industry) pair in our extrapolated_cells, compare against the OECD aggregate. Where the deviation > 50%, flag the row and log to `delivery/validation_anomalies.csv`. Do NOT auto-correct — manual review only.

2. **Bridge fill pass**: For every country in `COUNTRIES` that hasn't been ingested via phases 1–16, pull whatever the OECD/WB has at the regional level. Tag `coverage_tier = 'T'` and `quality_score = 50`. This gets countries like Argentina, Peru, smaller Eastern European countries onto the map with at least region-level data.

3. **City overlay**: For top-50 OECD Functional Urban Areas not yet covered by national-source ingest, write rows tagged `geo_level = 'metro_area'` with OECD-derived economic indicators converted to per-firm estimates via the OECD's enterprise-density factors.

## Schema mapping (Bridge fills)
```
country := <ISO-2>
geo_id := for OECD region: 'OECD-' + TL2 code
         for OECD FUA: 'OECD-FUA-' + code
         for WB: 'WB-' + country + '-' + region code where available
geo_level := 'region' | 'metro_area'
industry_id := derived from OECD ISIC mapping
year := from query
n_enterprises := from WB Enterprise Survey or OECD enterprise count
n_employees := from OECD employment
revenue_per_firm := from OECD value added / enterprise count
quality_score := 50
coverage_tier := 'T'
coverage_source := 'Cross-country economic indicators' (OECD) or 'International economic indicators' (WB)
currency := 'USD'
```

## Implementation
1. `scripts/ingest/oecd/fetch_region_econ.py`
2. `scripts/ingest/oecd/fetch_fua.py`
3. `scripts/ingest/oecd/normalize.py`
4. `scripts/ingest/wb/fetch_enterprise_survey.py`
5. `scripts/ingest/wb/normalize.py`
6. `scripts/ingest/validation/cross_check.py` — compares against existing rows, writes anomaly CSV
7. Upload via common helper

## Expected output
- Validation: 0 new rows; one anomaly report
- Bridge fills: ~8,000 cells (regions + FUAs across countries not in phases 1-16)
- Storage: ~3 MB

## DoD
- [ ] Anomaly report committed at `delivery/validation_anomalies_v4.csv`
- [ ] Every country in `COUNTRIES` has at least one regional-level row (no country is country-level-only after this phase)
- [ ] Top 50 OECD FUAs not in national ingest have metro-area rows
- [ ] ≥ 5,000 OECD/WB bridge rows in `regional_cells`
