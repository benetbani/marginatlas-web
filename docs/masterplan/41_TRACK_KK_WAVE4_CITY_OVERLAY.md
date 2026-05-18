# 41 · Track KK — Wave 4-8 City Overlay for 142 New Countries

> Plan v8 Phase B added 142 countries to COUNTRIES list. Their country
> landing pages render via extrapolated_cells fallback. But each
> country still has zero CITY-level cells. This track adds capital + 3-5
> major cities per country.

---

## 1 · Goal

For each of the 142 new countries surfaced in Plan v8, add 3-5
representative cities to regional_cells via the Phase 18 / Wave 3
overlay pattern.

Total expected: ~600 new cities × ~250 industries = ~150,000 new rows
(after quality filter ~80k).

---

## 2 · Cities to add (curated)

### Africa (40 countries × 3-4 cities = ~140 cities)

GHA: Accra, Kumasi · SEN: Dakar · CIV: Abidjan · ETH: Addis Ababa ·
TZA: Dar es Salaam, Dodoma · UGA: Kampala · RWA: Kigali · MOZ: Maputo ·
AGO: Luanda · CMR: Yaoundé, Douala · etc. (40 countries from R.5)

### Asia (16 countries × 3-5 cities = ~70 cities)

PAK: Karachi, Lahore, Islamabad, Faisalabad · BGD: Dhaka, Chittagong ·
LKA: Colombo · NPL: Kathmandu · KHM: Phnom Penh · LAO: Vientiane ·
MMR: Yangon · MNG: Ulaanbaatar · UZB: Tashkent · KGZ: Bishkek · TJK: Dushanbe ·
KAZ extension: Almaty, Astana, Shymkent (already in Wave 3) ·
PHL: Manila, Cebu, Davao, Quezon City · VNM: Ho Chi Minh, Hanoi, Da Nang ·
THA: Bangkok, Chiang Mai · IDN: Jakarta, Surabaya, Medan, Bandung ·
MYS: KL, Penang, Johor Bahru · etc.

### LATAM (20 countries × 3 cities = ~60 cities)

URY: Montevideo · PRY: Asunción · ECU: Quito, Guayaquil · BOL: La Paz, Santa Cruz ·
PAN: Panama City · CRI: San José · DOM: Santo Domingo · GTM: Guatemala City ·
HND: Tegucigalpa · SLV: San Salvador · NIC: Managua · JAM: Kingston · etc.

### MENA (12 countries × 3 cities = ~35 cities)

JOR: Amman · LBN: Beirut · QAT: Doha · KWT: Kuwait City · BHR: Manama ·
OMN: Muscat · TUN: Tunis · DZA: Algiers · IRN: Tehran, Mashhad, Isfahan ·
IRQ: Baghdad · YEM: Sana'a · LBY: Tripoli · etc.

### Caribbean + Pacific (15 cities)

BHS, BRB, ATG, KNA, LCA, VCT, GRD, DMA, FJI, WSM, TON, SLB · 1-2 cities each.

### Europe long-tail (15 cities)

BIH: Sarajevo · MKD: Skopje · MDA: Chișinău · MNE city extensions ·
BLR: Minsk (extension) · UKR: Kyiv, Lviv, Kharkiv, Odesa · etc.

**Total: ~600 cities across 142 countries.**

---

## 3 · Implementation pattern

Extend `scripts/ingest/city_overlay/fetch_wave3.py` → `fetch_wave4.py`:

```python
WAVE4_CITIES = {
    "GH": [("Accra", 0.40, 1.30), ("Kumasi", 0.10, 0.95), ("Tamale", 0.05, 0.85)],
    "SN": [("Dakar", 0.55, 1.30), ("Touba", 0.08, 0.85)],
    # ... 600 entries
}

# Most countries have their own extrapolated_cells coverage; for those
# missing (TWN, HKG, MAC have data; check each), seed from a regional
# proxy.
```

Quality computation:
- City share + premium within "normal" range → quality_10 = 5-6
- Tier-1 cities (capitals of G20-ish economies) → quality_10 = 6
- Smaller cities → quality_10 = 4-5

---

## 4 · Steps

| Step | Effort |
|---|---|
| KK.1 Curate 600-city list with shares + premia | 4 hr |
| KK.2 Write fetch_wave4.py | 2 hr |
| KK.3 Run pipeline (multiple batches if needed) | 1 hr |
| KK.4 Verify quality_10 distribution | 30 min |
| KK.5 Spot-check 20 sampled URLs | 30 min |
| **Total** | **~8 hr** |

---

## 5 · Verification gate

- ≥ 80% of the 142 new countries have ≥ 3 city cells
- All cells have quality_10 ≥ 3
- RAM peak < 200 MB
- Sample URLs render: Accra, Lahore, Tashkent, Quito, Beirut

---

## 6 · What this unlocks

- Every covered country has city-level URLs that render
- Sitemap grows by ~80k URLs (post quality filter)
- CityPicker autocomplete coverage triples
- Foundation for top-1000 cities curation (Track HH)
