# Phase 13 — India + China

> Two giant markets with complex data landscapes. India has MCA + MSME
> data at state/district level. China has NBS data at province +
> prefecture-city, but English access is harder. Strategy: full state
> coverage + top 100 cities per country.

## INDIA

### Targets
- 28 states + 8 union territories
- 766 districts
- Top 100 cities (Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, etc.)

### Sources
- **MCA Master Data** (Ministry of Corporate Affairs): https://www.mca.gov.in/MinistryV2/companyllpmasterdata.html — every registered company
- **MSME Annual Reports** + DGCIS: aggregate per state + district
- **Census of India Economic Census**: every 10 years, latest 2013/2024
- **NSSO Unincorporated Sector Enterprise Survey**
- **GSTN aggregate data** (where publicly released)

### Industry mapping
NIC-2008 (India National Industrial Classification) — based on NACE Rev.2, 4-digit. Crosswalk in `scripts/ingest/in_mca/nic_to_industry.csv`.

### Schema mapping
```
country := 'IN'
geo_id := for state: 'IN-' + 2-char ISO 3166-2 (e.g. 'IN-MH' Maharashtra)
         for district: 'IN-' + state + '-' + district code (e.g. 'IN-MH-MUM' Mumbai)
         for city: 'IN-CITY-' + slug
geo_level := 'state' | 'district' | 'city'
industry_id := mapped from NIC-2008
year := from query
size_band := varies by source; map to our 5
n_enterprises := from MCA + MSME
n_employees := from Economic Census
revenue_per_firm := from MCA where filed
quality_score := 65 (mixed-quality sources, varying completeness)
coverage_tier := 'M'
coverage_source := 'National business statistics'
currency := 'USD' after INR→USD
```

### Implementation
1. `scripts/ingest/in_mca/fetch_state_msme.py`
2. `scripts/ingest/in_mca/fetch_district_econ_census.py`
3. `scripts/ingest/in_mca/fetch_top_cities.py`
4. `scripts/ingest/in_mca/state_district_lookup.csv`
5. `normalize.py` + `upload.py` + `run.py`

### Expected output
~894 geos × ~25 industries × ~2 bands = **~45,000 cells.** Post-drop ~18,000. Storage: ~6 MB.

### Spot-checks
- `/in/maharashtra/software-development`
- `/in/karnataka/web-mobile-dev-shops`
- `/in/tamil-nadu/textile-apparel-mfg`
- `/in/city/mumbai/restaurants`
- `/in/city/bengaluru/custom-software-contract`
- `/in/city/delhi/cosmetics-shops`
- `/in/city/chennai/auto-repair-shops`
- `/in/city/hyderabad/clothing-stores`
- `/in/city/pune/management-consulting`
- `/in/city/ahmedabad/jewelry-stores`

---

## CHINA

### Targets
- 31 province-level units (provinces + autonomous regions + municipalities)
- Top 30 prefecture-level cities (Beijing, Shanghai, Guangzhou, Shenzhen, Chengdu, Hangzhou, Wuhan, Xi'an, Chongqing, etc.)

### Sources
- **National Bureau of Statistics (NBS)**: http://data.stats.gov.cn/english/ — limited English coverage; mostly Chinese
- **NBS Yearbook** (annual): PDF + Excel downloads
- **NBS Economic Census** (every 5 years)
- **CEIC China Premium Database** (paid, not used)

Strategy: Manual download of NBS Yearbook Excel sheets → parse via openpyxl → normalize → upload. Not API-driven (NBS API is unreliable for foreign IPs).

### Industry mapping
GB/T 4754-2017 (Chinese National Standard for Industrial Classification) — broadly aligns with ISIC. Crosswalk in `scripts/ingest/cn_nbs/gbt4754_to_industry.csv`.

### Schema mapping
```
country := 'CN'
geo_id := for province: 'CN-' + 2-char (e.g. 'CN-BJ' Beijing)
         for prefecture city: 'CN-CITY-' + 4-digit prefecture code
geo_level := 'province' | 'prefecture_city'
industry_id := mapped from GB/T 4754
year := from query (use most recent published)
size_band := NBS bands: 50- / 50-99 / 100-499 / 500-999 / 1000+ (note: these are MUCH larger than ours; map carefully)
n_enterprises := from "Number of Industrial Enterprises Above Designated Size"
n_employees := from Employed Persons by Industry
revenue_per_firm := from Operating Revenue
quality_score := 60 (NBS data, lower verification confidence)
coverage_tier := 'T'
coverage_source := 'National statistical agency'
currency := 'USD' after CNY→USD
```

### Implementation
1. `scripts/ingest/cn_nbs/download_yearbook.py` — manual download list, semi-automated parsing
2. `scripts/ingest/cn_nbs/parse_excel.py` — openpyxl-based, streaming
3. `scripts/ingest/cn_nbs/province_lookup.csv`, `city_lookup.csv`
4. `normalize.py` + `upload.py` + `run.py`

### Expected output
~61 geos × ~25 industries × ~2 bands = **~3,000 cells.** Storage: ~1 MB.

### Spot-checks
- `/cn/beijing/restaurants`
- `/cn/shanghai/web-mobile-dev-shops`
- `/cn/guangdong/manufacturing` (province-level)
- `/cn/city/shenzhen/custom-software-contract`
- `/cn/city/hangzhou/web-mobile-dev-shops`
- `/cn/city/chengdu/restaurants`
- `/cn/city/wuhan/textile-apparel-mfg`
- `/cn/city/xian/hotels-lodging`
- `/cn/sichuan/food-beverage-mfg`
- `/cn/zhejiang/specialty-trades`

---

## DoD (combined)
- [ ] All 36 IN states/UT + 766 districts + 100 cities
- [ ] All 31 CN provinces + 30 prefecture cities
- [ ] 20/20 combined spot-checks render
- [ ] ≥ 20,000 IN + CN rows in `regional_cells`
- [ ] CN data clearly tier "T" (Tabulated) in UI badge
