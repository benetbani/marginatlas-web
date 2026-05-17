# 06 · Track D — EU LAU (Municipality) Pipeline

> Three countries in sequence: Netherlands → Spain → Italy. Each
> adds municipality-level depth on top of the existing NUTS-2/3
> coverage from Phase 1 Eurostat.

---

## 1 · Goal

Add **70,000+ municipality-level rows** across Netherlands, Spain,
and Italy. These are the three EU countries where:

1. Public APIs exist (no scraping)
2. Coverage gap is largest (urban municipalities have rich SMB data not in Eurostat NUTS-3)
3. SEO leverage is high (cities like Amsterdam, Barcelona, Milan are high-search-volume for SMB queries)

Germany Gemeinden is excluded (Destatis paid-only, D-061).
France communes is in Track H (conditional on founder CSV).

---

## 2 · Targets

| Country | Target rows | Gate |
|---|---|---|
| Netherlands (gemeenten) | **10,000+** | 340 gemeenten × ~30 industries |
| Spain (municipios, top 1,000) | **30,000+** | top 1,000 of 8,131 × ~30 industries |
| Italy (comuni, top 1,000) | **30,000+** | top 1,000 of 7,904 × ~30 industries |
| Combined | **70,000+** | All three lands |

---

## 3 · T-D.1 · Netherlands research

### Source

CBS (Centraal Bureau voor de Statistiek) StatLine OpenData API.

- Base URL: `https://opendata.cbs.nl/ODataApi/odata/`
- No API key required
- Documentation: `https://www.cbs.nl/en-gb/our-services/open-data`

### Target dataset

CBS table **`81588NED`** ("Bedrijven; bedrijfstak/branche, regio" — Businesses by branch and region) is the closest match. Geographic levels include Gemeenten (LAU equivalent).

Alternative tables to probe if 81588NED doesn't have the breakdown we need:

- `81589NED` — businesses by employee size class × branch
- `83655NED` — newer version with more recent data
- `84516NED` — businesses with at least 1 employee by sector × region

### Steps

#### T-D.1.1 — Probe the API

```python
import requests
r = requests.get("https://opendata.cbs.nl/ODataApi/odata/81588NED/UntypedDataSet?$top=10",
                 headers={"Accept": "application/json"})
print(r.status_code, r.json())
```

Verify response shape: dimensions, value column, geographic codes.

#### T-D.1.2 — Discover the geo code mapping

CBS uses their own GM-prefixed codes for gemeenten (e.g. `GM0363` =
Amsterdam). Get the lookup from:

```python
r = requests.get("https://opendata.cbs.nl/ODataApi/odata/81588NED/RegioS",
                 headers={"Accept": "application/json"})
# Returns a list of all geographic entities used in the dataset
# Filter to those starting with "GM"
```

Cache the mapping to `delivery/regional/nl_cbs/gemeenten.json`.

#### T-D.1.3 — Discover the industry classification

CBS uses SBI 2008 codes (the Dutch implementation of NACE Rev.2).
1:1 with NACE at 4-digit. Use the existing
`common/industry_mapper.py` `nace_to_industry_id`.

```python
r = requests.get("https://opendata.cbs.nl/ODataApi/odata/81588NED/BedrijfstakkenBranchesSBI2008",
                 headers={"Accept": "application/json"})
```

Filter to 2-digit SBI codes that map to one of our industries.

---

## 4 · T-D.2 · Netherlands pipeline

### File location

`E:\atlas\scripts\ingest\nl_cbs\fetch.py`

### Pattern

Follow the standard pipeline pattern in
`docs/handoff/08_INGEST_SCRIPTS.md` §4. Pseudocode:

```python
"""Phase 2a — Netherlands CBS gemeenten ingest."""
import os, sys, time, json
from pathlib import Path
sys.path.insert(0, r"E:\atlas\scripts")
sys.path.insert(0, r"E:\atlas\scripts\ingest")
import requests

from common.industry_mapper import nace_to_industry_id
from common.geo_name_normalize import normalize_geo_name, slugify
from common.currency_convert import prefetch_currencies, to_usd
from common.upload_to_supabase import upsert_iterable
from common.quality_score import score as qscore
from common.dedup import dedup_iter
from common.ram_guard import RamGuard

BASE = "https://opendata.cbs.nl/ODataApi/odata/81588NED"
CACHE = Path(r"E:\atlas\delivery\regional\nl_cbs")
CACHE.mkdir(parents=True, exist_ok=True)
PROGRESS = CACHE / "progress.json"

def load_progress():
    if PROGRESS.exists(): return json.loads(PROGRESS.read_text(encoding="utf-8"))
    return {"done": []}

def save_progress(p):
    PROGRESS.write_text(json.dumps(p, indent=2), encoding="utf-8")

def fetch_gemeenten():
    """Return list of (GM-code, name) tuples."""
    r = requests.get(f"{BASE}/RegioS", headers={"Accept": "application/json"})
    regios = r.json()["value"]
    return [(x["Key"], x["Title"]) for x in regios if x["Key"].startswith("GM")]

def fetch_sbi_codes():
    """Return list of 2-digit SBI codes that map to our industries."""
    r = requests.get(f"{BASE}/BedrijfstakkenBranchesSBI2008", headers={"Accept": "application/json"})
    sbis = r.json()["value"]
    out = []
    for sbi in sbis:
        code = sbi["Key"]
        if len(code) == 2 and nace_to_industry_id(code):
            out.append((code, sbi["Title"]))
    return out

def fetch_cell(gm_code, sbi_code):
    """Pull one (gemeente, SBI) row."""
    url = (f"{BASE}/UntypedDataSet"
           f"?$filter=RegioS eq '{gm_code}' and BedrijfstakkenBranchesSBI2008 eq '{sbi_code}'"
           f"&$select=Bedrijven_1,Perioden")
    r = requests.get(url, headers={"Accept": "application/json"}, timeout=30)
    if r.status_code != 200: return None
    data = r.json().get("value", [])
    return data

def normalize(gm_code, gm_name, sbi_code, raw):
    """Map one source row to regional_cells schema."""
    period = raw.get("Perioden", "")
    year = int(period[:4]) if period[:4].isdigit() else 2022
    n_enterprises = raw.get("Bedrijven_1")
    if n_enterprises is None or n_enterprises < 5:
        return None
    industry_id = nace_to_industry_id(sbi_code)
    if not industry_id: return None
    return {
        "country": "NL",
        "geo_id": f"NL-{gm_code}",
        "geo_level": "municipality",
        "geo_name": normalize_geo_name(gm_name),
        "industry_id": industry_id,
        "year": year,
        "size_band": "total",
        "n_enterprises": int(n_enterprises),
        "n_employees": None,
        "revenue_per_firm": None,
        "payroll_per_employee": None,
        "rev_p10": None, "rev_p25": None, "rev_p50": None, "rev_p75": None, "rev_p90": None,
        "quality_score": qscore("P", year=year, has_n_enterprises=True),
        "coverage_tier": "P",
        "coverage_source": "National business statistics",  # GENERIC per R-002
        "currency": "USD",
    }

def main():
    print("=== Phase 2a: Netherlands CBS gemeenten ===")
    prefetch_currencies(["EUR", "USD"])
    progress = load_progress()
    
    gemeenten = fetch_gemeenten()
    sbis = fetch_sbi_codes()
    print(f"  {len(gemeenten)} gemeenten, {len(sbis)} SBI codes -> {len(gemeenten)*len(sbis)} cells")
    
    rows = []
    with RamGuard(cap_mb=600, label="nl_cbs") as g:
        for gm_code, gm_name in gemeenten:
            for sbi_code, sbi_name in sbis:
                unit = f"{gm_code}|{sbi_code}"
                if unit in progress.get("done", []): continue
                raw_list = fetch_cell(gm_code, sbi_code)
                if raw_list:
                    for raw in raw_list:
                        r = normalize(gm_code, gm_name, sbi_code, raw)
                        if r: rows.append(r)
                progress.setdefault("done", []).append(unit)
                if len(progress["done"]) % 50 == 0:
                    save_progress(progress)
                g.tick()
                time.sleep(0.2)
    save_progress(progress)
    
    rows = list(dedup_iter(rows))
    print(f"  uploading {len(rows):,} rows")
    summary = upsert_iterable("regional_cells", iter(rows), batch_size=500,
                              progress_every=10, label="nl_cbs")
    print(f"  uploaded {summary['pushed']:,} (failed {summary['failed']})")

if __name__ == "__main__":
    main()
```

### T-D.2.1 — Test on a single gemeente first

```python
# Quick smoke
print(fetch_cell("GM0363", "56"))  # Amsterdam, NACE 56 (restaurants)
```

If returns data: proceed. If 0 rows: adjust filter syntax.

### T-D.2.2 — Run full pipeline

Estimated:
- 340 gemeenten × ~30 SBI codes = ~10,200 API calls
- ~50 calls/min → ~3.5 hours
- Or use `$batch` endpoint to halve calls if API supports it

Peak RAM: < 150 MB.

### T-D.2.3 — Commit + verify

```bash
git add scripts/ingest/nl_cbs/
git commit -m "ingest: phase 2a Netherlands CBS gemeenten — +<N> rows"
git push origin main
```

---

## 5 · T-D.3 · Netherlands spot-check

| URL | Geography | Industry |
|---|---|---|
| `/nl/nl-gm0363/restaurants` | Amsterdam | Restaurants |
| `/nl/nl-gm0599/cafes-coffee-shops` | Rotterdam | Cafés |
| `/nl/nl-gm0518/web-mobile-dev-shops` | The Hague | Software dev |
| `/nl/nl-gm0344/hairdressers-beauty` | Utrecht | Hairdressers |
| `/nl/nl-gm0772/management-consulting` | Eindhoven | Consulting |

Each: tier 'P', 4-5 stars, real n_enterprises.

---

## 6 · T-D.4 · Spain INE DIRCE research

### Source

INE (Instituto Nacional de Estadística) DIRCE API.

- Base URL: `https://servicios.ine.es/wstempus/js/EN/`
- No API key required
- Documentation: `https://www.ine.es/dyngs/INEbase/en/operacion.htm?c=Estadistica_C&cid=1254736176962`

### Target table

DIRCE table **`24999`** ("Empresas según sector económico, número de asalariados, condición jurídica y comunidad y ciudad autónoma") or the municipality-level equivalent.

INE's municipio-level DIRCE data is published at:

- API endpoint: `DATOS_TABLA/24999` or similar
- Provides count of enterprises by CNAE-09 division × municipio × employee band

### Steps

#### T-D.4.1 — Probe the API

```python
r = requests.get("https://servicios.ine.es/wstempus/js/EN/OPERACION/52", headers={"Accept": "application/json"})
# OPERACION 52 = DIRCE
```

#### T-D.4.2 — Get municipio codes

```python
r = requests.get("https://servicios.ine.es/wstempus/js/EN/CODIGOS_NIVEL/19")
# Nivel 19 = municipios
```

Cache top 1,000 by population to `delivery/regional/es_ine/municipios.json`.

#### T-D.4.3 — Get CNAE 2009 classification

CNAE 2009 = Spanish implementation of NACE Rev.2. 1:1 at 4-digit.

---

## 7 · T-D.5 · Spain pipeline

`E:\atlas\scripts\ingest\es_ine\fetch.py`

Same pattern as Netherlands. Key differences:

- INE uses `CODIGO_INE` (5-digit municipio codes)
- API returns Spanish month/year encoded as `M+YYYY` or `T+QYY`
- Top 1,000 municipios cap (8,131 total is too many; SMBs concentrate in top 1k)

### T-D.5.1 — Cap top 1,000 municipios by population

Pull from INE's population endpoint:

```python
r = requests.get("https://servicios.ine.es/wstempus/js/EN/DATOS_TABLA/2852")  # Population
# Sort by latest year, take top 1000
```

### T-D.5.2 — Run

Estimated: 1,000 municipios × ~30 CNAE = 30,000 calls. ~10 hours
sequential. Use background bash + wake-up monitor.

Alternative: pull all data in one batch query if API supports
`?selected_codes=munic1,munic2,...` syntax. Cuts to ~30 calls.

Probe first; choose pattern.

---

## 8 · T-D.6 · Spain spot-check

| URL | Geography | Industry |
|---|---|---|
| `/es/es-28079/restaurants` | Madrid municipio | Restaurants |
| `/es/es-08019/cafes-coffee-shops` | Barcelona municipio | Cafés |
| `/es/es-46250/hotels-lodging` | Valencia municipio | Hotels |
| `/es/es-41091/clothing-stores` | Seville municipio | Clothing |
| `/es/es-29067/web-mobile-dev-shops` | Málaga municipio | Software dev |

---

## 9 · T-D.7 · Italy ISTAT research

### Source

ISTAT SDMX API.

- Base URL: `https://sdmx.istat.it/SDMXWS/rest/`
- Documentation: `https://www.istat.it/en/methods-and-tools/microdata-files/api-rest-istat`

### Target dataflow

ISTAT publishes business demography (Asia — Archivio Statistico delle Imprese Attive) at comune level. Probe dataflows:

- `101_1015` — Asia Imprese
- `IT1,101_1015,1.0` — likely SDMX flow ID

### Italian classification

ATECO 2007 = Italian implementation of NACE Rev.2. Use existing
`nace_to_industry_id`.

---

## 10 · T-D.8 · Italy pipeline

`E:\atlas\scripts\ingest\it_istat\fetch.py`

Same pattern. SDMX response is XML by default — request JSON via
`Accept: application/vnd.sdmx.data+json`.

Top 1,000 comuni by population (7,904 total).

Estimated: ~30,000 cells. ~6 hours.

---

## 11 · T-D.9 · Italy spot-check

| URL | Geography | Industry |
|---|---|---|
| `/it/it-rm/restaurants` | Roma comune | Restaurants |
| `/it/it-mi/clothing-stores` | Milano comune | Clothing |
| `/it/it-na/cafes-coffee-shops` | Napoli comune | Cafés |
| `/it/it-to/auto-repair-shops` | Torino comune | Auto repair |
| `/it/it-bo/web-mobile-dev-shops` | Bologna comune | Software dev |

---

## 12 · Combined verification gate

| Check | Pass criterion |
|---|---|
| Netherlands row count | ≥ 10,000 |
| Netherlands spot-check | 5/5 |
| Spain row count | ≥ 30,000 |
| Spain spot-check | 5/5 |
| Italy row count | ≥ 30,000 |
| Italy spot-check | 5/5 |
| Combined regional_cells delta | ≥ 70,000 |
| RAM peak (any pipeline) | < 600 MB |
| Coverage tier | All 'P' |
| Sitemap | Includes new EU municipality URLs |

When all ten pass: **D is DONE.** Move to Track E.

---

## 13 · Time estimate

| Task | Time |
|---|---|
| D.1-D.3 Netherlands | 4-5 hours (probe + write + run + verify) |
| D.4-D.6 Spain | 6-8 hours (more municipios, more iteration) |
| D.7-D.9 Italy | 6-8 hours (SDMX is more complex than OData) |
| **Total** | 16-21 hours |

This is the largest track in the sweep. Can be split across two
sessions if needed — each country is independent.

---

## 14 · Operational notes

- **Sequential order matters**: do NL first (simplest API, fastest probe), then ES (medium complexity), then IT (most complex). Builds confidence in the pattern.
- **Cache aggressively**: each pipeline writes intermediate JSON to `delivery/regional/<country>/`. Don't re-fetch.
- **One pipeline at a time**: never run two countries in parallel (R-008).
- **Polite delays**: 0.2-0.3s between API calls. None of these APIs are rate-limit-aggressive but courtesy matters.
- **DuckDB optional**: if a country's full dataset is downloadable as a single CSV (e.g. Spain DIRCE bulk), use DuckDB. Otherwise per-call REST is fine.
