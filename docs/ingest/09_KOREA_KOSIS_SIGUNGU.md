# Phase 9 — South Korea: Metro + Si/Gun/Gu

## Targets
- 17 metropolitan/special regions (광역시도)
- 226 sigungu (시군구) — equivalent to district / county / borough

## Sources
- **KOSIS** (Korean Statistical Information Service): https://kosis.kr/openapi/
- **Statistics Korea (KOSTAT) Annual Business Survey**
- Free key via https://kosis.kr/openapi/ (register with email)

## Industry mapping
KSIC (Korean Standard Industrial Classification) — broadly aligned with ISIC. Crosswalk in `scripts/ingest/kr_kosis/ksic_to_industry.csv`.

## Schema mapping
```
country := 'KR'
geo_id := 'KR-' + sigungu code (KSI district code)
geo_level := 'sigungu' (or 'metro' for the 17 top-level)
geo_name := from KOSIS administrative-area list (English transliteration)
industry_id := mapped from KSIC
year := from query
size_band := KOSIS bands: 1-4 / 5-9 / 10-19 / 20-49 / 50-99 / 100-299 / 300+
n_enterprises := from Annual Business Survey
n_employees := same
revenue_per_firm := from KOSIS revenue tables where published
quality_score := 75
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD' after KRW→USD
```

## Implementation
1. `scripts/ingest/kr_kosis/fetch_metro.py` — 17 top-level.
2. `scripts/ingest/kr_kosis/fetch_sigungu.py` — all 226 sigungu.
3. `scripts/ingest/kr_kosis/sigungu_lookup.csv` — code ↔ name (EN+KR).
4. `scripts/ingest/kr_kosis/normalize.py`
5. `scripts/ingest/kr_kosis/upload.py`
6. `scripts/ingest/kr_kosis/run.py`

## Expected output
~243 geos × ~30 industries × 1 band = **~7,000 cells.** Storage: ~3 MB. Time: 3 hours.

## Spot-checks
- `/kr/seoul/restaurants` (11000)
- `/kr/gangnam-gu/cafes-coffee-shops` (11680)
- `/kr/seocho-gu/cosmetics-shops` (11650)
- `/kr/busan/restaurants` (26000)
- `/kr/incheon/web-mobile-dev-shops` (28000)
- `/kr/daegu/clothing-stores` (27000)
- `/kr/daejeon/professional-services` (30000)
- `/kr/gwangju/hotels-lodging` (29000)
- `/kr/ulsan/auto-repair-shops` (31000)
- `/kr/jeju/hotels-lodging` (50000)

## RAM
KOSIS API responses < 20 MB. Peak ~50 MB.

## DoD
- [ ] All 17 metro + 226 sigungu populated
- [ ] All 25 Seoul gu individually present
- [ ] 10/10 spot-checks render
- [ ] ≥ 6,500 KR rows
