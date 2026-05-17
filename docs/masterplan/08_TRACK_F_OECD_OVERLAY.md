# 08 · Track F — OECD Regional Overlay

> Cross-validation layer plus non-EU OECD fills (Japan / Korea /
> Israel / Chile sub-national equivalents where domestic ingest is
> hard or impossible).

---

## 1 · Goal

Add **8,000+ rows** of OECD-sourced regional cells, with a focus
on countries where domestic ingest is blocked:

- Korea (KOSIS impossible — D-060)
- Israel
- Chile
- Mexico (interim until Track I.1 lands)
- New Zealand (interim until Track G lands)

Plus cross-validation overlay on EU / US (where we already have
primary data — OECD adds a sanity check signal).

---

## 2 · Targets

| Task | Target | Gate |
|---|---|---|
| F.1 New endpoint confirmation | Successful single-region query | Returns ≥ 1 row |
| F.2 Dataflow ID locked | Specific ID hardcoded | Documented in script |
| F.3 Pipeline rewrite | Script returns rows | Dry-run: 1 country, 1 region |
| F.4 Full execute | 8,000+ rows | Count check |

---

## 3 · The endpoint migration problem

Old endpoint pattern (returns 404):

```
https://stats.oecd.org/SDMX-JSON/data/REGION_ECONOM/...
```

New endpoint pattern (current):

```
https://sdmx.oecd.org/public/rest/data/<AGENCY_ID>,<DATAFLOW_ID>,<VERSION>/<KEY>?...
```

Where:

- `AGENCY_ID` = `OECD.CFE.EDS` (Centre for Entrepreneurship, SMEs, Regions and Cities)
- `DATAFLOW_ID` = candidate `DSD_REG_ECO@DF_GVA_AGG` (regional GVA aggregate)
- `VERSION` = `1.0`
- `KEY` = dot-separated dimension values

This is the OECD SDMX 3.0 spec. Documentation:
`https://sdmx.oecd.org/public/`.

---

## 4 · T-F.1 · New endpoint probe

### Steps

#### T-F.1.1 — List available dataflows

```bash
curl -s "https://sdmx.oecd.org/public/rest/dataflow/OECD.CFE.EDS" \
  -H "Accept: application/vnd.sdmx.structure+json;version=2.1"
```

Returns a list of all dataflows in the OECD CFE EDS agency. Find
the one for regional GVA + employment by industry.

Candidates to look for:

- `DF_GVA_AGG` — regional GVA aggregated
- `DF_REG_BUS_DEM` — regional business demography
- `DF_REG_EMP` — regional employment
- `DF_SME` — SME indicators

The one we want will have dimensions including REF_AREA (region),
ACTIVITY (industry classification), and TIME_PERIOD.

#### T-F.1.2 — Inspect the dataflow structure

```bash
curl -s "https://sdmx.oecd.org/public/rest/datastructure/OECD.CFE.EDS/DSD_REG_BUS_DEM" \
  -H "Accept: application/vnd.sdmx.structure+json;version=2.1"
```

Extract:

- Dimension list with allowed values per dimension
- The classification used for ACTIVITY (likely ISIC Rev.4)
- The geographic classification (likely OECD TL2 or TL3 regions)

#### T-F.1.3 — Probe a single region

For a known good region — TL3 region `JPN_13` (Tokyo) or `USA_06` (California):

```bash
curl -s "https://sdmx.oecd.org/public/rest/data/OECD.CFE.EDS,DF_REG_BUS_DEM,1.0/A.JPN_13.B-N.._T....?startPeriod=2020" \
  -H "Accept: application/vnd.sdmx.data+json"
```

If returns data: lock the dataflow ID.

If returns empty: try next candidate (DF_GVA_AGG, DF_REG_EMP, etc.).

#### T-F.1.4 — Cache the probe result

`delivery/regional/oecd/probe_results.json`:

```json
{
  "dataflow_id": "DF_REG_BUS_DEM",
  "agency_id": "OECD.CFE.EDS",
  "version": "1.0",
  "dimensions": ["FREQ", "REF_AREA", "ACTIVITY", "SIZE", "UNIT_MEASURE", "TIME_PERIOD"],
  "key_pattern": "A.{country}_{region}.{activity}.{size}.{unit}",
  "regions_per_country": {
    "USA": ["USA_01", ...],
    "JPN": ["JPN_01", ..., "JPN_47"],
    "KOR": ["KOR_11", ..., "KOR_50"],
    ...
  }
}
```

---

## 5 · T-F.2 · Dataflow ID locked

Once F.1.3 returns data, hardcode the dataflow ID in the script.

```python
# scripts/ingest/oecd/fetch_region_gva.py
OECD_BASE = "https://sdmx.oecd.org/public/rest/data"
AGENCY = "OECD.CFE.EDS"
DATAFLOW = "DF_REG_BUS_DEM"  # locked after probe
VERSION = "1.0"
```

Update `docs/handoff/03_DECISION_LOG.md` with the locked ID
(append a new D-NNN entry).

---

## 6 · T-F.3 · Pipeline rewrite

### File

`E:\atlas\scripts\ingest\oecd\fetch_region_gva.py` (rewrite the
existing scaffold)

### Pseudocode

```python
"""Phase 17 — OECD regional overlay."""
import os, sys, time, json
from pathlib import Path
sys.path.insert(0, r"E:\atlas\scripts")
sys.path.insert(0, r"E:\atlas\scripts\ingest")
import requests

from common.industry_mapper import isic_to_industry_id
from common.geo_name_normalize import normalize_geo_name
from common.upload_to_supabase import upsert_iterable
from common.quality_score import score as qscore
from common.dedup import dedup_iter
from common.ram_guard import RamGuard

BASE = "https://sdmx.oecd.org/public/rest/data"
AGENCY = "OECD.CFE.EDS"
DATAFLOW = "DF_REG_BUS_DEM"
VERSION = "1.0"

CACHE = Path(r"E:\atlas\delivery\regional\oecd")
CACHE.mkdir(parents=True, exist_ok=True)
PROGRESS = CACHE / "progress.json"

# Countries to overlay — prioritise gaps in our coverage
COUNTRIES = ["KOR", "ISR", "CHL", "NZL", "MEX"]  # focus on hard-to-ingest

# Plus cross-validation overlay (optional second pass)
CROSSVAL_COUNTRIES = ["USA", "DEU", "FRA", "JPN", "GBR"]

def fetch_country(country_iso3):
    """Pull all regions × activities for one country."""
    key = f"A.{country_iso3}.._T..."  # frequency.country.activity.size.unit.measure
    url = f"{BASE}/{AGENCY},{DATAFLOW},{VERSION}/{key}?startPeriod=2018"
    r = requests.get(url, headers={"Accept": "application/vnd.sdmx.data+json"}, timeout=60)
    if r.status_code != 200:
        print(f"  {country_iso3}: HTTP {r.status_code}")
        return None
    return r.json()

def normalize(country_iso3, country_iso2, raw_response):
    """Walk the SDMX-JSON tree and emit regional_cells rows."""
    structure = raw_response.get("structure", {})
    dimensions = structure.get("dimensions", {}).get("observation", [])
    region_dim_idx = next((i for i, d in enumerate(dimensions) if d["id"] == "REF_AREA"), None)
    activity_dim_idx = next((i for i, d in enumerate(dimensions) if d["id"] == "ACTIVITY"), None)
    time_dim_idx = next((i for i, d in enumerate(dimensions) if d["id"] == "TIME_PERIOD"), None)
    
    region_codes = dimensions[region_dim_idx]["values"]  # [{id, name}]
    activity_codes = dimensions[activity_dim_idx]["values"]
    time_codes = dimensions[time_dim_idx]["values"]
    
    datasets = raw_response.get("dataSets", [{}])[0]
    observations = datasets.get("observations", {})
    
    rows = []
    for obs_key, obs_value in observations.items():
        idx = obs_key.split(":")
        region = region_codes[int(idx[region_dim_idx])]
        activity = activity_codes[int(idx[activity_dim_idx])]
        time = time_codes[int(idx[time_dim_idx])]
        
        industry_id = isic_to_industry_id(activity["id"])
        if not industry_id: continue
        
        value = obs_value[0]
        if value is None: continue
        
        rows.append({
            "country": country_iso2,
            "geo_id": f"{country_iso2}-{region['id']}",
            "geo_level": "oecd_tl2",  # or tl3 depending on dataflow
            "geo_name": normalize_geo_name(region["name"]),
            "industry_id": industry_id,
            "year": int(time["id"][:4]),
            "size_band": "total",
            "n_enterprises": int(value) if value else None,
            "n_employees": None,
            "rev_p10": None, "rev_p25": None, "rev_p50": None, "rev_p75": None, "rev_p90": None,
            "revenue_per_firm": None,
            "payroll_per_employee": None,
            "quality_score": qscore("S", year=int(time["id"][:4]), has_n_enterprises=True),
            "coverage_tier": "S",  # Secondary — OECD re-publishes from national
            "coverage_source": "Cross-country economic indicators",  # GENERIC per R-002
            "currency": "USD",
        })
    return rows

ISO3_TO_ISO2 = {"KOR": "KR", "ISR": "IL", "CHL": "CL", "NZL": "NZ", "MEX": "MX",
                "USA": "US", "DEU": "DE", "FRA": "FR", "JPN": "JP", "GBR": "GB"}

def main():
    print("=== Phase 17: OECD regional overlay ===")
    rows = []
    with RamGuard(cap_mb=600, label="oecd") as g:
        for iso3 in COUNTRIES:
            print(f"  fetching {iso3}...")
            raw = fetch_country(iso3)
            if not raw: continue
            country_rows = normalize(iso3, ISO3_TO_ISO2[iso3], raw)
            print(f"    {len(country_rows)} rows")
            rows.extend(country_rows)
            g.tick()
            time.sleep(1.0)  # OECD polite delay
    
    rows = list(dedup_iter(rows))
    print(f"  uploading {len(rows):,} rows")
    summary = upsert_iterable("regional_cells", iter(rows), batch_size=500,
                              progress_every=10, label="oecd")
    print(f"  uploaded {summary['pushed']:,}")

if __name__ == "__main__":
    main()
```

### T-F.3.1 — Dry-run on KR

```python
# Test:
raw = fetch_country("KOR")
rows = normalize("KOR", "KR", raw)
print(f"{len(rows)} rows for KR")
```

If returns rows: proceed.

If returns 0: dimension mapping wrong. Adjust normalise function.

### T-F.3.2 — Full run

5 countries × ~30 regions × ~20 industries = ~3,000-8,000 rows.

Runtime: ~5 minutes (small data).

Peak RAM: < 200 MB.

---

## 7 · T-F.4 · Spot-check + commit

| URL | Geography | Industry |
|---|---|---|
| `/kr/kr-11/restaurants` | Seoul region | Restaurants |
| `/kr/kr-26/cafes-coffee-shops` | Busan region | Cafés |
| `/il/il-tlv/web-mobile-dev-shops` | Tel Aviv | Software dev |
| `/cl/cl-rm/restaurants` | Santiago metro | Restaurants |
| `/nz/nz-akl/hotels-lodging` | Auckland | Hotels |

Each: tier 'S', 3-4 stars, source label "Cross-country economic
indicators".

### Commit

```bash
git add scripts/ingest/oecd/fetch_region_gva.py
git commit -m "ingest: phase 17 OECD overlay — +<N> rows across KR, IL, CL, NZ, MX"
git push origin main
```

---

## 8 · Verification gate

| Check | Pass criterion |
|---|---|
| F.1 New endpoint probe | Returns data |
| F.2 Dataflow ID | Hardcoded in script |
| F.3 Dry-run | ≥ 1 row for KR |
| F.4 Full run | ≥ 8,000 rows |
| Spot-check | 5/5 |
| Coverage tier | All 'S' |

When all six pass: **F is DONE.** Move to Track G.

---

## 9 · Time estimate

| Task | Time |
|---|---|
| F.1 Endpoint probe (lots of trial) | 1 hour |
| F.2 Dataflow ID lock | 30 min |
| F.3 Pipeline rewrite | 1 hour |
| F.4 Run + verify | 30 min |
| **Total** | 3 hours |

---

## 10 · Cross-validation overlay (stretch)

If F.4 lands successfully and time permits, run the
`CROSSVAL_COUNTRIES` set (USA, DEU, FRA, JPN, GBR). This:

- Doesn't add new geographic depth (already covered by Phase 1 / 8 / 10)
- DOES add a tier-'S' shadow row per (country, region, industry)
- Useful for QA: flag any cell where OECD value differs from our primary by > 20% — likely indicates ingest bug

Stretch only. Don't block Track G on this.

---

## 11 · Known gotchas

- **OECD region codes differ from ISO/NUTS**: `KOR_11` is Seoul (not `KR-11`). The geo_id needs prefixing with country ISO-2 in the regional_cells PK.
- **OECD region levels mix TL2 and TL3**: TL2 = our "state" equivalent; TL3 = "district". Some countries publish only TL2; others have both. Document per country.
- **ACTIVITY dimension classification varies by dataflow**: some use ISIC Rev.4, others use NACE Rev.2. Probe the structure response to confirm.
- **SDMX-JSON format**: observations are encoded as flattened keys. The walker in normalise() is required; do not try to parse as a flat list.
- **Polite delay**: OECD allows fast queries but courtesy = 1s between countries.
