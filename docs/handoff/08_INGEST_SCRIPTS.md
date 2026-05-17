# 08 · Ingest Scripts Inventory

> Every Python sub-national ingest pipeline. Status, what it does,
> how to run, expected output, known issues.

---

## 1 · Tier classification

| Tier | Meaning | Action when picking up |
|---|---|---|
| **A — DONE** | Executed; rows live in `regional_cells` | Verify spot-checks; move on |
| **B — DUPLICATE** | Works but adds no new value vs existing coverage | Do not re-run; document why |
| **C — PARTIAL / BLOCKED** | Source data exists but pipeline incomplete or wrong | Fix per the notes below |
| **D — SCAFFOLD** | Folder exists; script not written or needs founder action | Write or wait |

---

## 2 · Per-pipeline status

### Tier A — Executed

#### 2.A.1 · `eu_eurostat/fetch_nuts.py` — Phase 1 EU NUTS

- **Rows live:** 43,903 (regional_cells, tier 'S')
- **Geographic coverage:** EU-27 + EFTA + candidates at NUTS-1/2/3 (~280 regions × ~40 industries × 1-3 years)
- **Source:** Eurostat dataset `sbs_r_nuts06_r2` via `ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/`
- **Auth:** None (public API)
- **Strategy:**
  1. Fetch each (indicator, year) combination WITHOUT geo filter — returns all 280+ regions in one ~30K-observation response
  2. Accumulate all 238K raw obs in memory (~200 MB)
  3. Merge once: per (country, geo_id, industry_id, year) bucket, combine V11210 (firms) + V16110 (employees) + V13320 (wages) into a single row with derived `payroll_per_employee` in USD
  4. Upload via batched upsert (500 rows per call)
- **Indicators:** V11210 (Local units = enterprise count), V16110 (Persons employed), V13320 (Wages and salaries in mio EUR), V12110 (Net turnover — NOT published at NUTS level in this dataset)
- **Years:** 2018, 2019, 2020 (dataset goes 2008-2020; 2020 is latest)
- **Runtime:** ~3 minutes including upload
- **Peak RAM:** 195 MB
- **Known issues:** None
- **How to re-run:**
  ```bash
  rm -f E:\atlas\delivery\regional\eu_eurostat\progress.json
  python E:\atlas\scripts\ingest\eu_eurostat\fetch_nuts.py
  ```

#### 2.A.2 · `jp_estat/fetch.py` — Phase 8 Japan e-Stat

- **Rows live:** 6,951 (regional_cells, tier 'P')
- **Geographic coverage:** 47 prefectures + 100+ major municipalities (Tokyo wards, Osaka, Kyoto, Yokohama, Nagoya, etc.)
- **Source:** e-Stat (政府統計の総合窓口) table `0004040099` (2024 Economic Census for Business Frame, Privately Owned Establishments by Industry × Prefecture × Major Cities)
- **Auth:** `?appId={ESTAT_APP_ID}` URL param
- **Strategy:**
  1. Paginate via `START_POSITION` + `LIMIT=100000`
  2. Filter to tabulated variable "102-2024" (Number of establishments)
  3. Filter to area codes ending in 000 (prefectures) or 5-digit municipality codes
  4. Map JSIC 2-digit divisions via ISIC bridge (`isic_to_industry_id`)
- **Industries covered:** 57 distinct industry_ids mapped from JSIC divisions
- **Runtime:** ~5 minutes for 29 pages of 100K obs each
- **Peak RAM:** 137 MB
- **Known issues:**
  - JSIC 2-digit divisions don't perfectly align with ISIC — some niche divisions may be misclassified (e.g. JSIC 06 might be "petroleum mining" or "construction" depending on edition)
  - Future cleanup: write a dedicated JSIC → industry_id table in `industry_mapper.py`
- **How to re-run:**
  ```bash
  rm -f E:\atlas\delivery\regional\jp_estat\progress.json
  python E:\atlas\scripts\ingest\jp_estat\fetch.py
  ```

#### 2.A.3 · `us_census/fetch_cbp.py` — Phase 10 US Census

- **Rows live:** 87,573 (regional_cells, tier 'P')
- **Geographic coverage:** ~1,700 US counties (across all 51 states + DC)
- **Source:** US Census County Business Patterns 2022 via `api.census.gov/data/2022/cbp`
- **Auth:** `?key={CENSUS_API_KEY}` URL param
- **Strategy:**
  1. Iterate all 51 state FIPS × all 73 NAICS-3 codes from our taxonomy = 3,723 API calls
  2. Per call: get county-level data with EMP (employment), ESTAB (establishments), PAYANN (annual payroll)
  3. Derive `payroll_per_employee` = (PAYANN × 1000) / EMP
  4. Resume support: per-state save to progress.json
- **Industries covered:** All 73 NAICS-3 codes in our taxonomy
- **Runtime:** ~1h50m wall-time (rate-limited; ~50 calls/min)
- **Peak RAM:** <100 MB (streaming)
- **Known issues:**
  - Many cells dropped where `n_enterprises < 5` (privacy suppression)
  - Sub-NAICS-6 detail not extracted (would 2-3× the row count)
- **How to re-run:**
  ```bash
  rm -f E:\atlas\delivery\regional\us_census\progress.json
  python E:\atlas\scripts\ingest\us_census\fetch_cbp.py
  ```

#### 2.A.4 · `city_overlay/fetch.py` — Phase 18 global cities

- **Rows live:** 41,448 (regional_cells, tier 'X')
- **Geographic coverage:** 240+ cities across 38 countries (US, KR, CN, IN, ID, VN, TH, MY, PH, AU, NZ, CA, MX, AR, CL, CO, PE, AE, SA, IL, TR, EG, ZA, NG, KE, MA, RU, UA, PK, BD, IR + small islands)
- **Source:** Pure compute — `extrapolated_cells` × hand-curated `(city_name, share, premium)` tuples per country
- **Auth:** Service-role key (read-only)
- **Strategy:**
  1. For each (country, city) in `CITIES`, fetch all extrapolated_cells rows for that country
  2. Multiply each row's `predicted_rev_per_firm` by `productivity_premium`
  3. Synthesise p10/p25/p50/p75/p90 distribution (±50% wedge around the mean)
  4. Write to regional_cells with `geo_level='city'`, tier 'X', quality ~37
- **Per-country `(city, share, premium)` tuples:** Hand-curated. Share is the city's portion of national SMB activity (smaller than pure population share because activity concentrates more than population). Premium is the productivity multiplier (e.g. London 1.40, Mumbai 1.45, Manila 1.35).
- **Notable absences:** GB, DE, FR, IT, ES, JP, BR — these countries don't have extrapolated_cells rows (excluded as regression anchors). Brazil cities covered separately via `fetch_br_cities.py`. EU + JP cities covered via Phase 1 NUTS-3 + Phase 8 JP municipalities.
- **Runtime:** ~2 minutes
- **Peak RAM:** 81 MB
- **Known issues:**
  - City shares and productivity premiums are best-guess; refinement would benefit from real city-population data and OECD productivity index
  - Each city × industry combo writes the same `predicted_rev_per_firm` × premium for all years → only one (most recent) year per cell

#### 2.A.5 · `city_overlay/fetch_br_cities.py` — Phase 18b BR cities

- **Rows live:** 834 (regional_cells, tier 'X')
- **Geographic coverage:** 15 Brazilian cities (São Paulo, Rio, Brasília, Salvador, Fortaleza, Belo Horizonte, Curitiba, Porto Alegre, Recife, Manaus, Belém, Goiânia, Campinas, Florianópolis, Vitória)
- **Source:** Brazil regional_cells state-level rows (added by Phase 15)
- **Auth:** Service-role key
- **Strategy:** Same as Phase 18 but uses regional_cells as parent source (since Brazil is absent from extrapolated_cells)
- **Runtime:** ~30 seconds
- **Known issues:** None

#### 2.A.6 · `latam_cluster/br_ibge.py` — Phase 15a Brazil IBGE

- **Rows live:** 1,483 (regional_cells, tier 'P')
- **Geographic coverage:** All 27 Brazilian UFs (states + DF)
- **Source:** IBGE SIDRA API agregado `6449` (CEMPRE: Empresas e outras organizações)
- **Auth:** None (public API)
- **Strategy:**
  1. Pull all CNAE 2.0 categories from table 6449 metadata (1067 categories)
  2. Filter to categories where the code maps to an industry_id (74 categories)
  3. Per (CNAE category, year=2021), fetch variable 2585 (Number of companies) for all UFs (N3 level)
  4. Filter to rows with n_enterprises ≥ 5
- **Industries covered:** 74 CNAE divisions mapped via NACE bridge
- **Year:** 2021 (latest published)
- **Runtime:** ~3 minutes
- **Peak RAM:** 48 MB
- **Known issues:**
  - Variable 2585 only gives enterprise count; no employee or revenue. Would need additional variables for richer data.
  - Variable ID 410 was wrong on first try (caused 500 errors); correct is 2585.

#### 2.A.7 · `wb/fetch_enterprise.py` — Phase 17 WB audit

- **Rows added:** 0 (audit-only tool)
- **Purpose:** Iterates all 217 World Bank countries; for each, checks if regional_cells has any rows. Writes 158-country follow-up list.
- **Source:** `api.worldbank.org/v2/country` for country list; Supabase REST for coverage check
- **Output:** `delivery/regional/wb_followup.csv` (158 rows, one per country needing follow-up ingest)
- **Runtime:** ~3 minutes
- **Known issues:** Doesn't add data; just audits.

---

### Tier B — Duplicate

#### 2.B.1 · `de_destatis/fetch.py` — Phase 3 Germany Destatis

- **Status:** Token authenticates correctly but FREE TIER CATALOGUE limits to Germany + Länder tables only. Kreis-level requires paid subscription.
- **Auth pattern (working):** POST method, HTTP header `username: TOKEN`, NOT URL param
- **Endpoint:** `https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile`
- **Tables available in free tier (catalogue search `52111*`):** All return Germany-only or Länder-only data, which is already covered by Phase 1 Eurostat NUTS-1
- **Decision:** Marked DUPLICATE. Do not pursue further unless founder approves paid subscription.

---

### Tier C — Partial or blocked

#### 2.C.1 · `ca_statcan/fetch.py` — Phase 11 Canada (PARTIAL)

- **Rows live:** 65 (regional_cells, tier 'P')
- **Status:** Pipeline works but pulled from WRONG source table on first try.
- **First try:** Table `33-10-0270-01` (Business dynamics, with employees) — turned out to be a "business dynamics survey" (active / opening / continuing / closing counts), not the per-NAICS-3 county counts we wanted.
- **Second try:** Table `33-10-0307-01` — also wrong (was "expected change in business activity" survey).
- **Correct table (NOT YET TRIED):** `33-10-0418-01` (Canadian Business Counts, with employees, by NAICS-4 + Province) — this is the one we want.
- **Estimated yield:** ~12,000 rows if rerun correctly.
- **How to fix:**
  ```python
  # In scripts/ingest/ca_statcan/fetch.py, change:
  table = "33100307"
  # to:
  table = "33100418"
  ```
  Then delete cached CSV at `delivery/regional/ca_statcan/33100307.csv` and re-run.
- **Auth:** None (StatCan WDS is public)

#### 2.C.2 · `gb_ons/fetch.py` — Phase 7 UK NOMIS (SCAFFOLD)

- **Status:** Pipeline scaffolded but doesn't fetch rows because NOMIS API requires per-dataset numeric IDs
- **Example needed:** `geography=TYPE434` (LAD), `industry=146800640...146800915` (SIC sections)
- **Why hard:** NOMIS has no per-dataset metadata endpoint that lists these IDs; need to scrape their HTML schema docs or use a community-built mapping table
- **Estimated yield:** ~30,000 LAD + MSOA rows if completed
- **Auth:** None

#### 2.C.3 · `oecd/fetch_region_gva.py` — Phase 17 OECD (SCAFFOLD)

- **Status:** Endpoint migrated. Old `stats.oecd.org/SDMX-JSON/data/` returns 404. New endpoint is `sdmx.oecd.org/public/rest/data/` with NEW dataflow names.
- **Probable new dataflow:** `OECD.CFE.EDS,DSD_REG_ECO@DF_GVA_AGG,1.0` (needs verification)
- **Estimated yield:** ~8,000 OECD region cells if completed
- **Auth:** None

---

### Tier D — Empty scaffold (folders exist, scripts to write)

| Folder | Source | Why not done |
|---|---|---|
| `es_ine/` | INE Spain DIRCE | Per-table probe needed; founder hasn't requested |
| `it_istat/` | ISTAT SDMX | Per-dataflow probe needed; founder hasn't requested |
| `kr_kosis/` | KOSIS Korea | **IMPOSSIBLE** — Korean phone for registration |
| `fr_insee/` | INSEE Sirene | 6 GB CSV — needs founder-side download to `delivery/regional/fr_insee/StockUniteLegale.csv` first |
| `eu_lau/` | Per-country municipality APIs | Multiple sources needed (DE Destatis paid, IT ISTAT, ES INE, NL CBS) |
| `in_mca/` | India MCA + Census Economic Census | Heavy manual download |
| `cn_nbs/` | China NBS | PDF parsing required |
| `sea_cluster/` | SG, MY, ID, TH, VN, PH | Partial APIs; per-country work |
| `mena_africa/` | UAE, SA, IL, TR, EG, ZA, NG, KE, MA | Per-country work |
| `nz_stats/` | Stats NZ | SDMX per-dataset key syntax |
| `au_abs/` | ABS | Same |

---

## 3 · Common helpers (`scripts/ingest/common/`)

### `ram_guard.py`

```python
from common.ram_guard import RamGuard

with RamGuard(cap_mb=600, label="my-pipeline") as g:
    for batch in batches:
        process(batch)
        g.tick()    # check RSS; raises RamGuardError if over cap
```

Used by every pipeline. Aborts if RSS exceeds 600 MB. Founder
explicit RAM constraint (D-055).

### `upload_to_supabase.py`

```python
from common.upload_to_supabase import upsert_iterable

summary = upsert_iterable(
    "regional_cells",
    iter(rows),
    batch_size=500,
    progress_every=10,
    label="my-phase",
)
# summary = {"pushed": N, "failed": M, "batches": K, "duration_s": T, "first_error": err or None}
```

Idempotent (PostgREST `Prefer: resolution=merge-duplicates`).
Retries on 429/503/504 with exponential backoff. 500-row batches.

### `industry_mapper.py`

```python
from common.industry_mapper import nace_to_industry_id, naics_to_industry_id, isic_to_industry_id, map_industry

# Country-aware dispatcher
industry_id = map_industry("DE", "C25")  # → 'metal_products_mfg'

# Direct classifier callers
industry_id = nace_to_industry_id("56")        # → 'restaurants'
industry_id = naics_to_industry_id("722511")    # → 'restaurants'
industry_id = isic_to_industry_id("56")         # → 'restaurants'
```

Returns None if no match. ~73 NAICS-3 codes, ~80 NACE divisions, ~80 ISIC divisions mapped. Plus per-classification bridges for ANZSIC, JSIC, KSIC.

### `currency_convert.py`

```python
from common.currency_convert import prefetch_currencies, to_usd, rate_per_usd

# Cache rates at start
prefetch_currencies(["EUR", "JPY", "GBP", "BRL", "USD"])

# Convert
usd_amount = to_usd(1000.0, "EUR", 2022)  # → ~1054.0
rate = rate_per_usd("EUR", 2022)          # → ~0.9485
```

Caches World Bank `PA.NUS.FCRF` series to `delivery/fx_cache/`. Has fallback table for currencies WB doesn't carry.

### `geo_name_normalize.py`

```python
from common.geo_name_normalize import slugify, normalize_geo_name, strip_accents

slug = slugify("São Paulo")              # → 'sao-paulo'
name = normalize_geo_name("  Tokyo   ")  # → 'Tokyo'
ascii = strip_accents("Lyon, France")    # → 'Lyon, France'
```

### `quality_score.py`

```python
from common.quality_score import score

score = score(
    "P",                    # tier
    year=2022,
    has_n_enterprises=True,
    has_n_employees=True,
    has_revenue=True,
    has_payroll=True,
    has_distribution=False,
)
# returns 0-100 integer; clamps to 20-100
```

### `pagination.py`

```python
from common.pagination import paginate, backoff_sleep

def fetch_page(page_idx: int) -> tuple[list, bool]:
    # return (rows, has_more)
    ...

for row in paginate(fetch_page, delay_s=0.3, max_pages=10_000):
    process(row)

# Or manual backoff
backoff_sleep(attempt=3)  # sleeps 8s on attempt 3 (1s, 2s, 4s, 8s, …)
```

### `dedup.py`

```python
from common.dedup import dedup_iter, row_key

unique_rows = list(dedup_iter(all_rows))  # generator; keeps first occurrence
```

PK = `(country, geo_id, industry_id, year, size_band)`. Useful when source data has overlap.

---

## 4 · Standard pipeline pattern

Every per-phase script follows the same shape:

```python
"""Phase X — <source> ingest."""
from __future__ import annotations
import os, sys, time, json
from pathlib import Path

sys.path.insert(0, r"E:\atlas\scripts")
sys.path.insert(0, r"E:\atlas\scripts\ingest")
try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

import requests, urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from common.industry_mapper import nace_to_industry_id  # or whichever
from common.geo_name_normalize import normalize_geo_name
from common.currency_convert import prefetch_currencies, to_usd
from common.upload_to_supabase import upsert_iterable
from common.quality_score import score as qscore
from common.dedup import dedup_iter
from common.ram_guard import RamGuard, current_rss_mb

API_KEY = os.environ.get("API_KEY_NAME", "<hardcoded-default>")
CACHE_DIR = Path(r"E:\atlas\delivery\regional\<phase>")
CACHE_DIR.mkdir(parents=True, exist_ok=True)
PROGRESS_FILE = CACHE_DIR / "progress.json"

def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        try: return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except Exception: pass
    return {"done": [], "totals": {}}

def save_progress(p: dict) -> None:
    PROGRESS_FILE.write_text(json.dumps(p, indent=2), encoding="utf-8")

def fetch_unit(...) -> ... | None:
    """One API call."""
    ...

def normalize(...) -> dict | None:
    """Map one source row to regional_cells schema."""
    ...

def main():
    print("=== Phase X: <description> ===")
    prefetch_currencies([...])
    progress = load_progress()

    rows: list[dict] = []
    with RamGuard(cap_mb=600, label="<phase>") as g:
        for unit in units:
            if unit in progress.get("done", []):
                continue
            data = fetch_unit(unit)
            if not data: continue
            for raw in data:
                r = normalize(raw)
                if r: rows.append(r)
            progress.setdefault("done", []).append(unit)
            save_progress(progress)
            g.tick()
            time.sleep(0.3)  # rate-limit politeness

    # Final upload
    dd = list(dedup_iter(rows))
    summary = upsert_iterable("regional_cells", iter(dd), batch_size=500,
                               progress_every=10, label="<phase>")
    print(f"  uploaded {summary['pushed']:,} (failed {summary['failed']}) in {summary['duration_s']}s")
    print(f"  peak RSS ~{current_rss_mb():.0f} MB")

if __name__ == "__main__":
    main()
```

---

## 5 · Migration SQL files

### `001_extrapolated_cells.sql` (applied)

Creates the `extrapolated_cells` table for the 57,816 regression-based country estimates.

### `002_regional_cells.sql` (applied)

Creates the `regional_cells` table for all sub-national data.

Both are at `E:\atlas\scripts\migrations\`. To apply manually:

1. Open Supabase dashboard → SQL Editor → New query
2. Paste the file contents
3. Click Run

---

## 6 · How to write a new ingest pipeline

1. Read this file (08) end-to-end
2. Read the per-phase plan in `docs/ingest/<N>_<COUNTRY>.md` if it exists
3. Probe the source API:
   - List all dataset codes
   - Pick the right one
   - Confirm auth pattern
   - Confirm response format
4. Create folder `scripts/ingest/<country>/`
5. Copy the standard pattern (section 4 above)
6. Implement `fetch_unit`, `normalize`, `main`
7. Use the common helpers — don't reinvent
8. Test on a small unit first (e.g. one state, one industry)
9. Run full pipeline; monitor RAM
10. Verify rows in Supabase: count + spot-check 3 specific URLs
11. Update `docs/ingest/19_VERIFICATION_QUALITY.md` scoreboard
12. Commit + push

---

## 7 · Common gotchas

| Gotcha | Where seen | Workaround |
|---|---|---|
| Source returns aggregate when filtered by country | Eurostat (D-062) | Query without country filter; let response include all regions |
| Per-batch upserts overwrite each other | Eurostat indicators (D-063) | Accumulate in memory; merge before upload |
| Wrong dataset ID | StatCan (D-064 family) | Probe metadata first; verify against expected columns |
| Variable ID wrong on first try | IBGE (D-066) | Pull metadata first |
| NAICS-3 codes missing from taxonomy | US Census, Canada | Add to industries.json; CI catches structural issues |
| Endpoint URL migrated | OECD | Test new URL format; old returns 404 |
| Free tier limits | Destatis | Document; mark DUPLICATE if other source covers |
| Korean phone required | KOSIS | Skip permanently |
| Source CSV too big for memory | Sirene 6 GB | DuckDB streaming with memory_limit |
| Country absent from extrapolated_cells | BR, JP, DE, FR, etc. (anchors) | Use regional_cells as parent for city overlay |
