# Phase 16 — MENA + Africa Cluster

Nine priority countries: UAE, Saudi Arabia, Israel, Turkey, Egypt, South Africa, Nigeria, Kenya, Morocco.

## Per-country targets + sources

### UAE
- 7 emirates
- Top 10 cities (Dubai, Abu Dhabi, Sharjah, Ajman, etc.)
- **Source:** Federal Competitiveness and Statistics Centre (FCSC) https://fcsc.gov.ae/, Dubai Statistics Center https://www.dsc.gov.ae/, Statistics Centre Abu Dhabi
- ISIC Rev.4
- Expected: 17 × 25 × 1 = ~400 cells
- Spot: `/ae/dubai/restaurants`, `/ae/abu-dhabi/hotels-lodging`, `/ae/sharjah/manufacturing`

### Saudi Arabia
- 13 provinces (mintaqah)
- Top 30 cities (Riyadh, Jeddah, Mecca, Medina, Dammam, Khobar, etc.)
- **Source:** GASTAT (General Authority for Statistics) https://www.stats.gov.sa/ — Establishments Census
- ISIC Rev.4
- Expected: 43 × 25 × 1 = ~1,100 cells
- Spot: `/sa/riyadh/restaurants`, `/sa/jeddah/restaurants`, `/sa/eastern-province/manufacturing`

### Israel
- 7 districts + 15 sub-districts
- 75 cities (top by population)
- **Source:** Central Bureau of Statistics (CBS) https://www.cbs.gov.il/ — Statistical Abstract + Establishments Survey
- ISIC Rev.4
- Expected: 97 × 25 × 1 = ~2,400 cells
- Spot: `/il/tel-aviv-yafo/web-mobile-dev-shops`, `/il/jerusalem/restaurants`, `/il/haifa/restaurants`, `/il/herzliya/professional-services`

### Turkey
- 81 provinces (il)
- 973 districts (ilçe) → top 100
- **Source:** TÜİK (Turkish Statistical Institute) https://www.tuik.gov.tr/ — Annual Industry and Service Statistics
- NACE Rev.2
- Expected: 181 × 25 × 1 = ~4,500 cells
- Spot: `/tr/istanbul/restaurants`, `/tr/ankara/professional-services`, `/tr/izmir/textile-apparel-mfg`, `/tr/district/kadikoy/cafes-coffee-shops`

### Egypt
- 27 governorates (muhafazah)
- Top 30 cities
- **Source:** CAPMAS (Central Agency for Public Mobilization And Statistics) https://www.capmas.gov.eg/ — Economic Census
- ISIC Rev.4 (Egyptian adaptation)
- Expected: 57 × 20 × 1 = ~1,100 cells
- Spot: `/eg/cairo/restaurants`, `/eg/alexandria/manufacturing`, `/eg/giza/clothing-stores`

### South Africa
- 9 provinces
- 52 districts + 213 local municipalities
- **Source:** Stats SA (Statistics South Africa) https://www.statssa.gov.za/ — Quarterly Employment Statistics + Business Demography
- ISIC Rev.4 + SIC Version 7
- Expected: 274 × 25 × 1 = ~6,800 cells → cap top 100 municipalities → ~3,000
- Spot: `/za/gauteng/manufacturing`, `/za/municipality/city-of-johannesburg/restaurants`, `/za/municipality/city-of-cape-town/web-mobile-dev-shops`, `/za/kwazulu-natal/hotels-lodging`

### Nigeria
- 36 states + FCT (Federal Capital Territory)
- Top 30 cities (Lagos, Kano, Ibadan, Abuja, Port Harcourt, etc.)
- **Source:** National Bureau of Statistics https://www.nigerianstat.gov.ng/ — National MSME Survey, Economic Census
- ISIC Rev.4
- Expected: 67 × 20 × 1 = ~1,300 cells
- Spot: `/ng/lagos/restaurants`, `/ng/abuja/professional-services`, `/ng/kano/textile-apparel-mfg`

### Kenya
- 47 counties
- Top 20 cities
- **Source:** KNBS (Kenya National Bureau of Statistics) https://www.knbs.or.ke/ — MSME Survey + Economic Survey
- ISIC Rev.4
- Expected: 67 × 20 × 1 = ~1,300 cells
- Spot: `/ke/nairobi/restaurants`, `/ke/mombasa/hotels-lodging`, `/ke/kisumu/restaurants`

### Morocco
- 12 régions
- 75 préfectures + provinces
- Top 30 cities
- **Source:** HCP (Haut-Commissariat au Plan) https://www.hcp.ma/ — Economic Census, Annual Business Statistics
- NMAE 2010 (Moroccan Nomenclature, based on NACE)
- Expected: 117 × 20 × 1 = ~2,300 cells
- Spot: `/ma/casablanca-settat/manufacturing`, `/ma/rabat-sale-kenitra/professional-services`, `/ma/marrakech-safi/hotels-lodging`

## Common schema mapping
```
country := <ISO-2>
geo_id := '<ISO-2>-' + admin code
geo_level := 'province' | 'emirate' | 'governorate' | 'state' | 'county' | 'district' | 'city'
industry_id := mapped from local-to-ISIC bridge
year := from query
size_band := per-source mapping (some MENA sources don't size-band)
n_enterprises := from source
n_employees := where reported
quality_score := 50-70 depending on source
coverage_tier := 'T' or 'M'
coverage_source := 'National business statistics'
currency := 'USD' after local→USD
```

## Implementation
One subfolder per country: `scripts/ingest/{ae,sa,il,tr,eg,za,ng,ke,ma}/`. Some sources are PDF-only — use `pdfplumber` + manual parsing for those (Egypt, Nigeria, Morocco partial).

## Expected output
**~22,000 cells combined.** Storage: ~7 MB. Time: 5 hours.

## DoD
- [ ] All 9 MENA + Africa countries with at least state/province-level coverage
- [ ] At least 5 cities per country
- [ ] 25/25 combined spot-checks render
- [ ] ≥ 18,000 MENA+Africa rows in `regional_cells`
