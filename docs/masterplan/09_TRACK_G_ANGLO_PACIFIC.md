# 09 · Track G — Anglo Pacific (Australia + New Zealand)

> Two countries with clean SDMX APIs and well-documented
> classifications. Lower risk than EU LAU; higher SMB density per
> capita than most regions.

---

## 1 · Goal

Add **22,000+ rows** across Australia (SA4 / SA3 / SA2) and New
Zealand (Territorial Local Authorities).

---

## 2 · Targets

| Country | Geo level | Target rows | Gate |
|---|---|---|---|
| Australia | SA4 (107 areas) + SA3 (358) | **15,000+** | Combined |
| New Zealand | TLA (67) | **7,000+** | 67 × ~30 industries × employee bands |
| Combined | | **22,000+** | All gates pass |

---

## 3 · T-G.1 · Australia ABS research

### Source

ABS (Australian Bureau of Statistics) ABS.Stat API.

- Base URL: `https://api.data.abs.gov.au/data/`
- Documentation: `https://www.abs.gov.au/about/data-services/application-programming-interfaces-apis/data-api-user-guide`
- No API key required for current API (v2)

### Target dataset

**`ABS_COUNTRY_OF_BIRTH_AGGS`**? No — that's demographic.

The right dataset is **`8165.0`** ("Counts of Australian Businesses,
including Entries and Exits") published as dataflow
**`ABS,BLLS,1.0.0`** or similar.

Alternative: **`81550DO001_2021_22`** (Business Counts by Industry
and Region).

Probe to confirm:

```bash
curl -s "https://api.data.abs.gov.au/dataflow/ABS" \
  -H "Accept: application/vnd.sdmx.structure+json;version=1.0.0"
```

Returns the list of dataflows from ABS agency. Find the right one.

### ANZSIC classification

Australia uses ANZSIC 2006 (Australia/NZ Standard Industrial
Classification). Map via existing `ANZSIC_BRIDGE` in
`common/industry_mapper.py`.

If `ANZSIC_BRIDGE` is incomplete: expand it (one-time work).

### Geographic levels

ABS Statistical Areas (ASGS 2021):

- SA4 — 107 areas (state-equivalent of statistical regions)
- SA3 — 358 (sub-state)
- SA2 — 2,310 (suburb-ish, too granular for our needs)
- LGA — 537 Local Government Areas (alternative to SA3)

Target: SA4 + SA3. Skip SA2 (too suppressed). LGA as alternative
if SA3 unavailable.

---

## 4 · T-G.2 · Australia pipeline

### File

`E:\atlas\scripts\ingest\au_abs\fetch.py`

### Steps

#### T-G.2.1 — Probe dataflow

Confirm dataflow ID. Cache structure response.

#### T-G.2.2 — Discover area codes

```bash
curl -s "https://api.data.abs.gov.au/codelist/ABS/CL_SA4_2021_GEOGRAPHY" \
  -H "Accept: application/vnd.sdmx.structure+json;version=1.0.0"
```

Returns list of all SA4 codes. Cache to `delivery/regional/au_abs/sa4_codes.json`.

#### T-G.2.3 — Pipeline

Standard pattern. SDMX-JSON walker. Per-SA4 fetch with ANZSIC
breakdown.

```python
def fetch_sa4_industry_breakdown(sa4_code):
    key = f"A.{sa4_code}.._T."  # frequency.region.industry.size.measure
    url = f"https://api.data.abs.gov.au/data/{DATAFLOW}/{key}?startPeriod=2020"
    r = requests.get(url, headers={"Accept": "application/vnd.sdmx.data+json"}, timeout=60)
    return r.json() if r.status_code == 200 else None
```

#### T-G.2.4 — Normalise

```python
def normalize(sa4_code, sa4_name, raw_obs):
    anzsic_code = raw_obs["industry"]["id"]  # e.g. "G" (Retail) or "G41" (Food retail)
    industry_id = anzsic_to_industry_id(anzsic_code)
    if not industry_id: return None
    ...
    return {
        "country": "AU",
        "geo_id": f"AU-{sa4_code}",
        "geo_level": "sa4",
        ...
        "coverage_source": "National business statistics",  # GENERIC
        "coverage_tier": "P",
    }
```

#### T-G.2.5 — Run

107 SA4 × ~30 industries = ~3,200 cells. ~30 min.
Then SA3: 358 × ~30 = ~10,700 cells. ~1.5 hours.
Total Australia: ~13,900 rows. Round to target 15,000+.

#### T-G.2.6 — Spot-check

| URL | SA4 | Industry |
|---|---|---|
| `/au/au-101/restaurants` | Sydney - Inner City | Restaurants |
| `/au/au-206/cafes-coffee-shops` | Melbourne - Inner | Cafés |
| `/au/au-302/web-mobile-dev-shops` | Brisbane Inner City | Software |
| `/au/au-401/hairdressers-beauty` | Adelaide Central | Hairdressers |
| `/au/au-503/auto-repair-shops` | Perth - Inner | Auto repair |

---

## 5 · T-G.3 · New Zealand Stats NZ research

### Source

Stats NZ uses Aria (their open data portal):

- Base URL: `https://www.stats.govt.nz/tools/business-figures-aotearoa/`
- API: `https://api.stats.govt.nz/opendata/v1/` (newer API)
- Documentation: `https://aria.stats.govt.nz/`

### Target dataset

**Business Operations Survey** or **Business Demography** published
as `BDOPS` or similar dataflow.

Probe:

```bash
curl -s "https://api.stats.govt.nz/opendata/v1/data?Catalogue=Business" 
```

### Classification

NZSIC = New Zealand Standard Industrial Classification, derived
from ANZSIC. Same `ANZSIC_BRIDGE` applies.

### Geographic level

TLA = Territorial Local Authority. 67 of them. Slug examples:
`auckland`, `wellington`, `christchurch`, `dunedin`.

---

## 6 · T-G.4 · New Zealand pipeline

### File

`E:\atlas\scripts\ingest\nz_stats\fetch.py`

Same pattern as Australia. Smaller scale (67 TLAs × ~30 industries
= ~2,000 cells minimum, target 7,000 with employee-band breakdown).

### Steps

#### T-G.4.1 — Probe

#### T-G.4.2 — TLA codes

```bash
curl -s "https://api.stats.govt.nz/opendata/v1/dimension/CL_TLA"
```

#### T-G.4.3 — Pipeline + run

~1 hour.

#### T-G.4.4 — Spot-check

| URL | TLA | Industry |
|---|---|---|
| `/nz/nz-akl/restaurants` | Auckland | Restaurants |
| `/nz/nz-wlg/management-consulting` | Wellington | Consulting |
| `/nz/nz-chc/web-mobile-dev-shops` | Christchurch | Software |
| `/nz/nz-dud/hotels-lodging` | Dunedin | Hotels |
| `/nz/nz-tau/auto-repair-shops` | Tauranga | Auto repair |

---

## 7 · ANZSIC bridge expansion (if needed)

Check current state of `ANZSIC_BRIDGE` in
`scripts/ingest/common/industry_mapper.py`. If incomplete:

```python
ANZSIC_BRIDGE = {
    # Letter-level (ANZSIC sections)
    "A": "farming_food_production",  # Agriculture
    "B": "mining_energy",  # Mining (corp_only)
    "C": "manufacturing_artisan",  # Manufacturing - default to artisan; corp_only for sub-codes
    "D": "telecom_broadcasting",  # Utilities (corp_only)
    "E": "construction",
    "F": "wholesale_durable",  # Wholesale (mixed)
    "G": "retail_shops",  # Retail
    "H": "hotels_lodging",  # Accommodation + food services (split sub)
    "I": "transport_small",
    "J": "creative_media",  # Information media
    "K": "finance_corp",  # Financial services (corp_only)
    "L": "real_estate",  # Rental, hiring + real estate
    "M": "professional_services",
    "N": "professional_services",  # Admin support
    "O": "telecom_broadcasting",  # Public admin (non-applicable - skip)
    "P": "education_instruction",
    "Q": "health_clinics",
    "R": "events_entertainment",  # Arts + recreation
    "S": "other_local",  # Other services
    
    # Subdivision codes (2-digit) — refine where possible
    "G41": "grocery_stores",
    "G42": "specialty_food_retail",
    "G44": "clothing_stores",
    "G45": "furniture_home_stores",
    "G46": "electronics_appliance_stores",
    "H44": "hotels_lodging",
    "H45": "restaurants",
    "H46": "cafes_coffee_shops",
    # ... continue per the ABS 2006 doc
}
```

This is a one-hour cleanup. Do it as part of T-G.2.1.

---

## 8 · Verification gate

| Check | Pass criterion |
|---|---|
| G.1 Australia probe | Dataflow ID locked |
| G.2 Australia ingest | ≥ 15,000 rows |
| G.2 Australia spot-check | 5/5 |
| G.3 New Zealand probe | Dataflow ID locked |
| G.4 New Zealand ingest | ≥ 7,000 rows |
| G.4 New Zealand spot-check | 5/5 |
| Combined delta | ≥ 22,000 |
| Coverage tier | All 'P' |
| RAM peak | < 600 MB |
| ANZSIC bridge complete | All 19 letter codes mapped |

When all ten pass: **G is DONE.** Move to Track H (or skip to I if
Track A.4 is still open).

---

## 9 · Time estimate

| Task | Time |
|---|---|
| G.1 AU probe + ID discovery | 1 hour |
| G.2 AU pipeline + run + verify | 2-3 hours |
| G.3 NZ probe + ID discovery | 30 min |
| G.4 NZ pipeline + run + verify | 1 hour |
| ANZSIC bridge expansion | 30 min |
| **Total** | 5-6 hours |

---

## 10 · Known gotchas

- **ABS API v1 vs v2**: ABS migrated mid-2023. v1 (`stat.data.abs.gov.au`) still works but is deprecated. Use v2 (`api.data.abs.gov.au`).
- **ANZSIC vs ASIC**: ASIC is the older 1993 classification. ANZSIC 2006 is current. Some Stats NZ tables still use ANZSIC 1996 — same letter codes work.
- **TLA code format**: Stats NZ uses 3-char codes like `006` (Far North), `007` (Whangārei) — alphabetical might not be intuitive. Use slug from name.
- **Privacy suppression**: both ABS and Stats NZ suppress cells with < 5 firms or < 5 employees. Drop suppressed cells.
- **Maori macron in TLA names**: `Tāmaki Makaurau`, `Te Whanganui-a-Tara`. Use `normalize_geo_name` which strips diacritics for slug, preserves macrons in display.

---

## 11 · What this unlocks

- AU + NZ go from city-overlay-only (tier X) to measured (tier P)
- Sydney, Melbourne, Auckland become high-quality cells
- Anglo-bloc coverage parity with US / UK
