# 07 · Track E — UK NOMIS Ingest

> UK Local Authority District + MSOA (Middle Super Output Area)
> coverage via the ONS NOMIS API.

---

## 1 · Goal

Add **30,000+ rows** of UK sub-national data across 374 LADs +
~500 high-traffic MSOAs.

### Why UK matters

- High SEO leverage (London boroughs, Manchester, Birmingham, Edinburgh are high-volume queries)
- Currently zero measured UK sub-national data
- Existing UK coverage limited to extrapolated_cells (country-level) + Phase 18 city overlay

---

## 2 · Targets

| Task | Target | Gate |
|---|---|---|
| E.1 ID discovery | LAD geo type + SIC industry IDs documented | Numeric IDs in `gb_ons/constants.py` |
| E.2 LAD ingest | 20,000+ rows | 374 LADs × ~55 SIC sections |
| E.3 MSOA ingest (stretch) | +10,000 rows | Top 500 MSOAs × ~20 industries |

---

## 3 · The NOMIS API problem

NOMIS doesn't expose a machine-readable schema endpoint that lists
parameter IDs. Every query needs:

- `geography=<type ID>` (e.g. `TYPE434` for LAD)
- `industry=<numeric IDs>` (e.g. `146800640...146800915` for SIC sections)
- `employment_sizeband=<numeric>`
- `measures=<numeric>` (e.g. `20100` for businesses count)

Without these, the API returns empty data. The IDs aren't
documented in any single place.

---

## 4 · T-E.1 · ID discovery

### Strategy

Two paths:

#### Path A — Manual UI extraction

1. Open `https://www.nomisweb.co.uk/datasets`
2. Find dataset `NM_141_1` (UK Business Counts — local units)
3. Click "Custom" tab
4. Build a query in the UI for: All LADs, all SIC sections, all sizebands
5. Click "Download CSV"
6. The CSV URL shown at the bottom has all numeric IDs in the query string
7. Extract and cache to `delivery/regional/gb_ons/api_ids.json`

#### Path B — Schema XML

NOMIS publishes per-dataset XML schemas:

```bash
curl -s "https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.def.sdmx.json"
```

Parse the JSON to extract dimension keys.

### Recommended: Path A first, B as backup

Path A is faster (5 minutes). Path B is more durable but requires
XML/JSON parsing that may shift.

### Cache the IDs

`delivery/regional/gb_ons/api_ids.json`:

```json
{
  "dataset": "NM_141_1",
  "geography_lad": "TYPE434",
  "geography_msoa": "TYPE399",
  "industry_sic_sections": "146800640,146800641,...,146800915",
  "industry_sic_2digit": [
    {"code": "01", "id": "..."},
    ...
  ],
  "employment_sizeband_total": "0",
  "measures_businesses_count": "20100",
  "measures_local_units": "20100",
  "geography_lad_codes": [
    "E09000033", "E09000019", ...
  ]
}
```

---

## 5 · T-E.2 · LAD pipeline

### File location

`E:\atlas\scripts\ingest\gb_ons\fetch.py`

### Approach

NOMIS supports batch queries via comma-separated values:

```python
url = (f"https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.data.json"
       f"?date=latest"
       f"&geography={GEOGRAPHY_LAD_CODES_COMMA_SEPARATED}"  # 374 codes
       f"&industry={SIC_2DIGIT_IDS_COMMA_SEPARATED}"  # ~85 codes
       f"&legal_status=0"  # all
       f"&employment_sizeband=0"  # total
       f"&measures={MEASURES_BUSINESSES_COUNT}")
```

One huge request returns all (LAD × industry) cells. NOMIS allows
up to ~500k cells per query — 374 × 85 = ~32k cells is well within.

If single request times out: chunk by SIC section (split the
industry list into 3-5 chunks).

### Steps

#### T-E.2.1 — Build the URL

```python
import json, requests
ids = json.loads(Path(r"E:\atlas\delivery\regional\gb_ons\api_ids.json").read_text())
url = (
    "https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.data.json"
    f"?date=latest"
    f"&geography={ids['geography_lad']}"
    f"&industry={','.join(x['id'] for x in ids['industry_sic_2digit'])}"
    f"&legal_status=0"
    f"&employment_sizeband=0"
    f"&measures={ids['measures_businesses_count']}"
)
```

#### T-E.2.2 — Fetch

```python
r = requests.get(url, timeout=120)
data = r.json()
obs = data["obs"]  # list of cells
```

Peak RAM: ~100 MB for the response.

#### T-E.2.3 — Normalise

```python
def normalize(obs_row):
    geo_code = obs_row["geography"]["geogcode"]  # e.g. "E09000033"
    geo_name = obs_row["geography"]["description"]  # "Westminster"
    sic = obs_row["industry"]["description"]  # "Real estate activities"
    industry_id = nace_to_industry_id(extract_sic_2digit(sic))
    if not industry_id: return None
    n = obs_row["obs_value"]["value"]
    if n is None or n < 5: return None
    return {
        "country": "GB",
        "geo_id": geo_code,  # already E09000033 format
        "geo_level": "lad",
        "geo_name": normalize_geo_name(geo_name),
        "industry_id": industry_id,
        "year": int(obs_row["time"]["description"][:4]),
        "size_band": "total",
        "n_enterprises": int(n),
        # ... rest
        "coverage_source": "National business statistics",  # GENERIC
        "coverage_tier": "P",
    }
```

#### T-E.2.4 — Upload + commit

Standard pattern.

### T-E.2.5 — LAD spot-check

| URL | LAD | Industry |
|---|---|---|
| `/gb/gb-e09000033/legal-services` | Westminster | Legal services |
| `/gb/gb-e08000003/restaurants` | Manchester | Restaurants |
| `/gb/gb-e08000025/web-mobile-dev-shops` | Birmingham | Software dev |
| `/gb/gb-s12000036/management-consulting` | Edinburgh | Consulting |
| `/gb/gb-w06000022/auto-repair-shops` | Cardiff | Auto repair |

---

## 6 · T-E.3 · MSOA pipeline (stretch)

MSOAs are neighbourhoods within LADs. ~7,000 in England + Wales.
Most have very low SMB counts (below 5, suppressed by privacy).

### Strategy

Cap to top 500 MSOAs by total business count:

1. First pass: fetch totals per MSOA (no industry breakdown)
2. Sort by total descending
3. Take top 500
4. Second pass: fetch industry breakdown for those 500 only

This caps the run at ~10,000 cells and keeps the MSOA layer
meaningful (most cells will have ≥ 5 firms each).

### Steps

#### T-E.3.1 — Identify top 500 MSOAs

```python
url_totals = (
    f"https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.data.json"
    f"?date=latest"
    f"&geography={GEOGRAPHY_MSOA}"  # TYPE399
    f"&industry=0"  # all
    f"&employment_sizeband=0"
    f"&measures={MEASURES_BUSINESSES_COUNT}"
)
r = requests.get(url_totals, timeout=120)
totals = sorted(r.json()["obs"], key=lambda x: -x["obs_value"]["value"])[:500]
top_500_codes = [o["geography"]["geogcode"] for o in totals]
```

#### T-E.3.2 — Fetch per-industry for top 500

Same approach as LAD but with the MSOA code list.

#### T-E.3.3 — Upload with `geo_level='msoa'`

Use standard pipeline pattern.

#### T-E.3.4 — MSOA spot-check

| URL | MSOA | Industry |
|---|---|---|
| `/gb/gb-e02000001/legal-services` | City of London 001 | Legal |
| `/gb/gb-e02000977/web-mobile-dev-shops` | Tech City | Software |
| `/gb/gb-e02006827/restaurants` | Soho-area MSOA | Restaurants |

---

## 7 · Verification gate

| Check | Pass criterion |
|---|---|
| E.1 IDs cached | `gb_ons/api_ids.json` exists with all required IDs |
| E.2 LAD rows | ≥ 20,000 |
| E.2 LAD spot-check | 5/5 |
| E.3 MSOA rows (if pursued) | ≥ 10,000 |
| E.3 MSOA spot-check (if pursued) | 3/3 |
| Coverage tier | All 'P' |
| RAM peak | < 600 MB |

When E.1 + E.2 pass: **E.2 is DONE.** E.3 is stretch — if time
permits, do it; otherwise defer to a future session.

---

## 8 · Time estimate

| Task | Time |
|---|---|
| E.1 ID discovery (Path A) | 1 hour |
| E.2 LAD pipeline (write + run + verify) | 2-3 hours |
| E.3 MSOA pipeline (stretch) | 2-3 hours |
| **Total** | 4-7 hours |

---

## 9 · Known issues / gotchas

- **NOMIS rate limit**: ~1 request per second for unauthenticated. Use 1-2s sleep between calls.
- **Suppressed values**: cells with < 5 firms return `null`. Drop them.
- **SIC sections vs 2-digit**: SIC has 21 sections (A-U) and 88 2-digit divisions. Use 2-digit for finer detail; section level for sanity check.
- **Northern Ireland gap**: NI uses a separate dataset (`NM_141_1` covers GB only excluding NI). Skip NI for this track; add later if asked.
- **Welsh / Scottish geo codes**: `W06000022` Cardiff, `S12000036` Edinburgh. Slug should derive from `geo_name`.
- **NOMIS dataset versions**: `NM_141_1` is the current one as of 2025. If a newer dataset has replaced it, probe the dataset list at `https://www.nomisweb.co.uk/api/v01/dataset/def.json`.

---

## 10 · What this unlocks

- UK becomes a flagship country for SMB benchmarks
- All London boroughs become directly addressable URLs
- Manchester, Birmingham, Edinburgh, Cardiff, Belfast (when NI lands) — major search hubs
- Featured cells can use real UK regional data (e.g. `/gb/gb-e09000033/legal-services` as a London featured tile)
