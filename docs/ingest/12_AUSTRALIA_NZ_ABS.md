# Phase 12 — Australia + New Zealand

## Targets
**Australia**
- 8 states/territories
- 88 SA4 (Statistical Areas Level 4) — sub-state regions
- 350 SA3
- 2,310 SA2 — neighbourhood-level (top 300 in this phase)
- 384 LGA (Local Government Areas) — distinct from SA hierarchy

**New Zealand**
- 16 regions
- 67 territorial authorities (TLAs)

## Sources
**Australia**
- **ABS Counts of Australian Businesses (Cat 8165.0)**: https://www.abs.gov.au/methodologies/counts-australian-businesses-including-entries-and-exits-methodology/
- **ABS Data Explorer API**: https://api.abs.gov.au/data/{dataflow}/{key}
- ANZSIC 2006 industry codes
- Free, no key

**New Zealand**
- **Stats NZ Business Demography**: https://www.stats.govt.nz/
- **Stats NZ DataInfo+ API**: https://api.stats.govt.nz/
- ANZSIC 2006 (same as Australia)

## Industry mapping
ANZSIC 2006 — close to NACE Rev.2 at division/group level. Crosswalk in `scripts/ingest/au_abs/anzsic_to_industry.csv`.

## Schema mapping (AU)
```
country := 'AU'
geo_id := for state: 'AU-' + 1-digit (e.g. 'AU-1' = NSW)
         for SA4: 'AU-SA4-' + 3-digit
         for SA3: 'AU-SA3-' + 5-digit
         for SA2: 'AU-SA2-' + 9-digit
         for LGA: 'AU-LGA-' + 5-digit
geo_level := 'state' | 'sa4' | 'sa3' | 'sa2' | 'lga'
geo_name := from ASGS (Australian Statistical Geography Standard)
industry_id := mapped from ANZSIC
year := from query
size_band := ABS bands map directly to our 5
n_enterprises := business count
n_employees := from Estimates of Employment
revenue_per_firm := from ABS BLADE (Business Longitudinal Analysis Data Environment) where possible
quality_score := 78
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD' after AUD→USD
```

## Schema mapping (NZ)
```
country := 'NZ'
geo_id := for region: 'NZ-' + region code
         for TLA: 'NZ-TLA-' + 3-digit
geo_level := 'region' | 'tla'
... (similar)
```

## Implementation
1. `scripts/ingest/au_abs/fetch_states.py`, `fetch_sa4.py`, `fetch_sa3.py`, `fetch_top_sa2.py`, `fetch_lga.py`
2. `scripts/ingest/au_abs/asgs_lookup.csv`
3. `scripts/ingest/au_abs/normalize.py` + `upload.py` + `run.py`
4. `scripts/ingest/nz_stats/fetch_region.py`, `fetch_tla.py`
5. `scripts/ingest/nz_stats/tla_lookup.csv`
6. `scripts/ingest/nz_stats/normalize.py` + `upload.py` + `run.py`

## Expected output
- AU: 8 states + 88 SA4 + 350 SA3 + 300 SA2 + 100 LGA = 846 geos × 30 industries × 2 bands = **~50,000 cells** (post-drop ~20,000)
- NZ: 16 + 67 = 83 geos × 30 industries × 1 band = **~2,500 cells**
- **Total: ~22,500.** Storage: ~8 MB. Time: 4 hours.

## Spot-checks
- `/au/new-south-wales/restaurants`
- `/au/sa4/sydney-eastern-suburbs/cafes-coffee-shops`
- `/au/sa4/melbourne-inner/restaurants`
- `/au/lga/city-of-sydney/professional-services`
- `/au/lga/city-of-melbourne/web-mobile-dev-shops`
- `/au/queensland/hotels-lodging`
- `/au/western-australia/mining-quarrying` (corp_only)
- `/au/lga/city-of-brisbane/clothing-stores`
- `/nz/auckland/restaurants`
- `/nz/wellington/web-mobile-dev-shops`
- `/nz/canterbury/residential-construction`
- `/nz/tla/queenstown-lakes/hotels-lodging`

## RAM
ABS + Stats NZ APIs return paginated < 30 MB chunks. Peak ~60 MB.

## DoD
- [ ] All 8 AU states + 88 SA4 + top 300 SA2 + 100 LGA
- [ ] All 16 NZ regions + 67 TLAs
- [ ] 12/12 spot-checks render
- [ ] ≥ 20,000 AU+NZ rows in `regional_cells`
