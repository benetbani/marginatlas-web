# Phase 14 — Southeast Asia Cluster

Six countries: Singapore, Malaysia, Indonesia, Thailand, Vietnam, Philippines.

## Per-country targets + sources

### Singapore
- 5 regions + 28 planning areas (URA Master Plan zones)
- **Source:** SingStat (https://tablebuilder.singstat.gov.sg/) — table `M212381` Establishments by SSIC + planning area
- Industry classification: SSIC 2020 → maps to ISIC at section/division level
- Expected: 28 × 30 industries = ~800 cells
- Spot: `/sg/region/orchard/clothing-stores`, `/sg/region/cbd/professional-services`, `/sg/region/jurong/restaurants`

### Malaysia
- 13 states + 3 federal territories
- 144 districts (daerah)
- **Source:** Department of Statistics Malaysia (DOSM) https://www.dosm.gov.my/ — Establishment Census
- MSIC 2008 classification
- Expected: 160 × 30 = ~4,800 cells
- Spot: `/my/selangor/restaurants`, `/my/kuala-lumpur/web-mobile-dev-shops`, `/my/penang/restaurants`

### Indonesia
- 34 provinces + 514 regencies (kabupaten/kota)
- **Source:** BPS (Badan Pusat Statistik) https://webapi.bps.go.id/v1 — Survei Industri Besar Sedang + Sensus Ekonomi (every 10y)
- KBLI 2020 classification
- Expected: 548 × 25 = ~14,000 cells; cap at top 100 regencies → ~3,000 cells
- Spot: `/id/jakarta/restaurants`, `/id/regency/surabaya/textile-apparel-mfg`, `/id/regency/bandung/clothing-stores`

### Thailand
- 76 provinces + Bangkok
- **Source:** NSO Thailand https://www.nso.go.th/ + Department of Business Development (DBD) https://www.dbd.go.th/
- ISIC Rev.4 (Thailand adopted directly)
- Expected: 77 × 30 = ~2,300 cells
- Spot: `/th/bangkok/restaurants`, `/th/chiang-mai/hotels-lodging`, `/th/phuket/restaurants`

### Vietnam
- 63 provinces (5 centrally-governed cities + 58 provinces)
- **Source:** General Statistics Office (GSO) https://www.gso.gov.vn/ — Enterprise Survey annual
- VSIC 2018 (Vietnam Standard Industrial Classification) → maps to ISIC
- Expected: 63 × 25 = ~1,600 cells
- Spot: `/vn/ho-chi-minh-city/restaurants`, `/vn/hanoi/web-mobile-dev-shops`, `/vn/danang/hotels-lodging`

### Philippines
- 17 regions + 81 provinces
- **Source:** PSA (Philippine Statistics Authority) https://psa.gov.ph/ — List of Establishments
- PSIC 2009 (Philippine Standard Industrial Classification)
- Expected: 98 × 25 = ~2,500 cells
- Spot: `/ph/metro-manila/restaurants`, `/ph/cebu/web-mobile-dev-shops`, `/ph/davao/hotels-lodging`

## Common schema mapping
```
country := <ISO-2>
geo_id := '<ISO-2>-' + source admin code
geo_level := 'region' | 'province' | 'kabupaten' | 'district' | 'planning_area'
industry_id := mapped from local-to-ISIC crosswalk
year := from query
size_band := per-source mapping to our 5
n_enterprises := from source
n_employees := where reported
quality_score := 55-70 depending on source completeness
coverage_tier := 'M' for most; 'T' for spotty
coverage_source := 'National business statistics' or 'National business census'
currency := 'USD' after local→USD
```

## Implementation
One subfolder per country: `scripts/ingest/{sg,my,id,th,vn,ph}/`. Each with the standard `fetch.py + normalize.py + upload.py + run.py + lookup CSVs`.

Common helper for the local-classification-to-ISIC mapping logic at `scripts/ingest/common/isic_bridge.py`.

## Expected output
**~15,000 cells combined.** Storage: ~5 MB. Time: 4 hours total.

## DoD
- [ ] All 6 countries have at least state/province-level coverage
- [ ] SG planning areas (28), Malaysian districts (top 50), Indonesian top 100 kabupaten populated
- [ ] 18/18 combined spot-checks render
- [ ] ≥ 12,000 SEA rows in `regional_cells`
