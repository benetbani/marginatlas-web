# Phase 8 — Japan: Prefectures + Municipalities

## Targets
- 47 prefectures (todofuken) — `JP-13` Tokyo, `JP-27` Osaka, etc.
- 1,718 municipalities (shi-machi-mura) — top 200 covered in this phase

## Sources
- **e-Stat (政府統計の総合窓口)**: https://www.e-stat.go.jp/
- **Economic Census (経済センサス基礎調査)** — every 5 years, latest 2021
- **Establishment and Enterprise Census** — annual updates
- API: https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData (free with email-registered key)

Application ID: register via https://www.e-stat.go.jp/api/. Store in env `ESTAT_APP_ID`.

## Industry mapping
JSIC Rev.13 (Japan Standard Industrial Classification) — different structure from NACE. Custom crosswalk in `scripts/ingest/jp_estat/jsic_to_industry.csv`. Notable mappings:
- JSIC 09 (Manufacture of food and beverages) → `food_beverage_mfg`
- JSIC H75 (Eating and drinking places) → `restaurants`
- JSIC I-58 (Apparel and accessories retail) → `clothing_stores`
- JSIC P (Medical services) — small clinics → `health_clinics`
- JSIC M-77 (Software services) → `software_development`

## Schema mapping
```
country := 'JP'
geo_id := for prefecture: 'JP-' + 2-digit (e.g. 'JP-13' Tokyo)
         for municipality: 'JP-' + 5-digit JIS code
geo_level := 'prefecture' | 'municipality'
geo_name := from e-Stat metadata (English where available, romaji fallback)
industry_id := mapped from JSIC
year := from query
size_band := e-Stat bands: 1-4 / 5-9 / 10-19 / 20-29 / 30-49 / 50-99 / 100-199 / 200-299 / 300+ → our 5 bands
n_enterprises := from Establishments table
n_employees := from Employees table
revenue_per_firm := where Economic Census has it (limited industries)
quality_score := 75
coverage_tier := 'P'
coverage_source := 'National business census'
currency := 'USD' after JPY→USD
```

## Implementation
1. `scripts/ingest/jp_estat/fetch_prefecture.py` — all 47.
2. `scripts/ingest/jp_estat/fetch_top_municipalities.py` — top 200 by population (Tokyo wards individually).
3. `scripts/ingest/jp_estat/jis_lookup.csv` — JIS code ↔ name (English + romaji).
4. `scripts/ingest/jp_estat/normalize.py`
5. `scripts/ingest/jp_estat/upload.py`
6. `scripts/ingest/jp_estat/run.py`

## Expected output
- Prefecture: 47 × ~30 × 1 = ~1,400 cells
- Municipality: 200 × ~30 × 1 = ~6,000 cells
- **Total: ~7,500 cells.** Storage: ~3 MB. Time: 3 hours.

## Spot-checks
- `/jp/tokyo/restaurants` (JP-13)
- `/jp/shinjuku/cafes-coffee-shops` (13104)
- `/jp/shibuya/clothing-stores` (13113)
- `/jp/osaka/restaurants` (27100)
- `/jp/kyoto/hotels-lodging` (26100)
- `/jp/yokohama/web-mobile-dev-shops` (14100)
- `/jp/sapporo/restaurants` (01100)
- `/jp/fukuoka/cafes-coffee-shops` (40130)
- `/jp/nagoya/auto-repair-shops` (23100)
- `/jp/sendai/professional-services` (04100)

## RAM
e-Stat API returns < 30 MB per query. Peak ~50 MB.

## DoD
- [ ] All 47 prefectures + 200 municipalities
- [ ] All 23 Tokyo wards individually populated
- [ ] 10/10 spot-checks render
- [ ] ≥ 7,000 JP rows in `regional_cells`
