# 10 · Track H — France Sirene (conditional)

> Commune-level French SMB data. Conditional on Track A.4 (founder
> downloads the 6 GB Sirene CSV). High-yield if landed: +60,000
> rows.

---

## 1 · Goal

Add **60,000+ commune-level rows** for France across the top 2,000
communes + 45 Paris/Lyon/Marseille arrondissements.

### Conditional

Pipeline cannot run without `StockUniteLegale.csv` at
`E:\atlas\delivery\regional\fr_insee\`. Founder action A.4 in
`03_TRACK_A_FOUNDER_BLOCKERS.md`.

If A.4 is OPEN when execution reaches Track H: **skip Track H,
move to Track I.** Note in `PROGRESS.md` that H is pending A.4.

---

## 2 · Targets

| Metric | Target | Stretch |
|---|---|---|
| Commune-level rows | 60,000+ | 80,000+ |
| Communes covered | Top 2,000 | Top 3,500 |
| Industries per commune | ~30 (NAF-3 mapped) | ~50 (NAF-4) |
| Coverage tier | P (Primary, direct measurement) | — |

---

## 3 · The Sirene dataset

### What's in StockUniteLegale.csv

Per file from INSEE (Institut national de la statistique et des
études économiques):

- **~30 million rows** — every active legal entity in France
- Columns: SIREN (legal entity ID), denominationUniteLegale (name), activitePrincipaleUniteLegale (NAF-5 code), codeCommune, trancheEffectifsUniteLegale (employee band), etatAdministratifUniteLegale (active/ceased), etc.
- Size: ~6 GB uncompressed, ~600 MB compressed
- Encoding: UTF-8
- Update cadence: monthly

### Why DuckDB and not pandas

`pd.read_csv()` on 6 GB explodes to ~30 GB in memory after pandas'
indexing overhead — would blow the 600 MB RSS cap immediately
(R-007).

DuckDB streams the file: parses, filters, groups, writes — all in
under 500 MB RAM. Python process RSS stays around 100 MB.

---

## 4 · T-H.1 · Pre-check (founder dependency)

Before doing anything else:

```powershell
# PowerShell
Test-Path "E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv"
# expect: True

(Get-Item "E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv").Length / 1GB
# expect: > 5 (file is ~6 GB)
```

If `False` or file < 5 GB: **STOP this track.** Report to founder
in chat: "Track H blocked on A.4 — Sirene CSV not in place." Move
to Track I.

---

## 5 · T-H.2 · DuckDB aggregation

### File

`E:\atlas\scripts\ingest\fr_insee\aggregate.py`

### Pseudocode

```python
"""Phase 4 — France Sirene commune-level aggregation."""
import os, sys
from pathlib import Path
sys.path.insert(0, r"E:\atlas\scripts")
import duckdb

CSV_PATH = r"E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv"
OUT_PARQUET = r"E:\atlas\delivery\regional\fr_insee\agg.parquet"
TOP_N_COMMUNES = 2000

def main():
    print("=== Phase 4: France Sirene aggregation (DuckDB) ===")
    con = duckdb.connect(":memory:")
    con.execute("SET memory_limit='400MB'")
    con.execute("SET threads=2")
    
    # Step 1: identify top N communes by total active firms
    print("  Step 1: identifying top communes by firm count...")
    con.execute(f"""
        CREATE TABLE top_communes AS
        SELECT codeCommune, COUNT(*) AS firm_count
        FROM read_csv('{CSV_PATH}', auto_detect=true)
        WHERE etatAdministratifUniteLegale = 'A'  -- Active
          AND codeCommune IS NOT NULL
          AND length(codeCommune) = 5
        GROUP BY codeCommune
        ORDER BY firm_count DESC
        LIMIT {TOP_N_COMMUNES}
    """)
    
    # Step 2: aggregate per (commune, NAF-3, employee_band)
    print("  Step 2: aggregating per commune x industry x size...")
    con.execute(f"""
        COPY (
            SELECT
                s.codeCommune AS commune_code,
                LEFT(s.activitePrincipaleUniteLegale, 4) AS naf_4,
                s.trancheEffectifsUniteLegale AS size_band_raw,
                COUNT(*) AS n_enterprises
            FROM read_csv('{CSV_PATH}', auto_detect=true) s
            JOIN top_communes tc ON s.codeCommune = tc.codeCommune
            WHERE s.etatAdministratifUniteLegale = 'A'
              AND s.activitePrincipaleUniteLegale IS NOT NULL
            GROUP BY 1, 2, 3
        ) TO '{OUT_PARQUET}' (FORMAT 'parquet')
    """)
    
    # Step 3: report
    con.execute(f"SELECT COUNT(*) AS n FROM read_parquet('{OUT_PARQUET}')")
    n = con.fetchone()[0]
    print(f"  Aggregated {n:,} rows to {OUT_PARQUET}")
    
    # Step 4: sample
    sample = con.execute(f"SELECT * FROM read_parquet('{OUT_PARQUET}') LIMIT 10").fetchall()
    for row in sample:
        print(f"    {row}")

if __name__ == "__main__":
    main()
```

### Expected output

- ~150,000 raw rows in agg.parquet (top 2000 communes × ~30 NAF-3 × 5 size bands)
- After filtering (n < 5 suppressed): ~60,000 final rows
- File size: ~5 MB parquet

### Runtime

~10-15 minutes (DuckDB streaming over 6 GB CSV).

### RAM

DuckDB caps at 400 MB. Python process: ~80 MB. Total RSS: ~500 MB.

---

## 6 · T-H.3 · NAF mapping + commune name lookup

### File

`E:\atlas\scripts\ingest\fr_insee\map_and_upload.py`

### Pseudocode

```python
"""Phase 4 — France Sirene upload to regional_cells."""
import os, sys, json
from pathlib import Path
sys.path.insert(0, r"E:\atlas\scripts")
sys.path.insert(0, r"E:\atlas\scripts\ingest")
import duckdb
import requests

from common.industry_mapper import nace_to_industry_id
from common.geo_name_normalize import normalize_geo_name
from common.upload_to_supabase import upsert_iterable
from common.quality_score import score as qscore
from common.ram_guard import RamGuard

AGG_PARQUET = r"E:\atlas\delivery\regional\fr_insee\agg.parquet"
COMMUNES_LOOKUP = r"E:\atlas\delivery\regional\fr_insee\communes.json"

# NAF size band → our size_band
SIZE_BAND_MAP = {
    "00": "1",     # 0 employees (entrepreneur)
    "01": "1",     # 1-2
    "02": "1",     # 3-5
    "03": "2-9",   # 6-9
    "11": "10-49", # 10-19
    "12": "10-49", # 20-49
    "21": "50-249",# 50-99
    "22": "50-249",# 100-199
    "31": "50-249",# 200-249
    "32": "250+",  # 250-499
    "41": "250+",  # 500-999
    "42": "250+",  # 1000-1999
    "51": "250+",  # 2000-4999
    "52": "250+",  # 5000+
}

def fetch_commune_names():
    """Pull commune name lookup (5-digit code → name)."""
    if Path(COMMUNES_LOOKUP).exists():
        return json.loads(Path(COMMUNES_LOOKUP).read_text(encoding="utf-8"))
    # INSEE COG (Code Officiel Géographique)
    url = "https://www.insee.fr/fr/statistiques/fichier/7766585/v_commune_2024.csv"
    print("  Fetching commune name lookup from INSEE...")
    r = requests.get(url, timeout=60)
    # Parse CSV: columns include COM (code) and LIBELLE (name)
    import csv, io
    reader = csv.DictReader(io.StringIO(r.text))
    lookup = {row["COM"]: row["LIBELLE"] for row in reader}
    Path(COMMUNES_LOOKUP).write_text(json.dumps(lookup, indent=2), encoding="utf-8")
    return lookup

def main():
    print("=== Phase 4: France Sirene upload ===")
    commune_names = fetch_commune_names()
    print(f"  loaded {len(commune_names):,} commune name lookups")
    
    con = duckdb.connect(":memory:")
    rows_raw = con.execute(f"SELECT * FROM read_parquet('{AGG_PARQUET}')").fetchall()
    
    rows = []
    with RamGuard(cap_mb=600, label="fr_insee") as g:
        for commune_code, naf_4, size_band_raw, n_enterprises in rows_raw:
            if n_enterprises < 5: continue  # privacy suppression
            geo_name = commune_names.get(commune_code, commune_code)
            naf_2 = naf_4[:2]  # NAF → NACE 2-digit
            industry_id = nace_to_industry_id(naf_2)
            if not industry_id: continue
            size_band = SIZE_BAND_MAP.get(size_band_raw, "total")
            rows.append({
                "country": "FR",
                "geo_id": f"FR-{commune_code}",
                "geo_level": "commune",
                "geo_name": normalize_geo_name(geo_name),
                "industry_id": industry_id,
                "year": 2024,  # Sirene is real-time; tag as current year
                "size_band": size_band,
                "n_enterprises": int(n_enterprises),
                "n_employees": None,
                "revenue_per_firm": None,
                "payroll_per_employee": None,
                "rev_p10": None, "rev_p25": None, "rev_p50": None, "rev_p75": None, "rev_p90": None,
                "quality_score": qscore("P", year=2024, has_n_enterprises=True),
                "coverage_tier": "P",
                "coverage_source": "National business statistics",  # GENERIC per R-002
                "currency": "USD",
            })
            g.tick()
    
    # Roll up by aggregating size bands per (commune, industry) for the 'total' row
    from collections import defaultdict
    totals = defaultdict(int)
    for r in rows:
        key = (r["geo_id"], r["industry_id"], r["year"])
        totals[key] += r["n_enterprises"]
    
    total_rows = []
    for (geo_id, industry_id, year), n in totals.items():
        if n < 5: continue
        sample = next(r for r in rows if r["geo_id"]==geo_id and r["industry_id"]==industry_id)
        total_rows.append({**sample, "size_band": "total", "n_enterprises": n})
    
    all_rows = rows + total_rows
    print(f"  uploading {len(all_rows):,} rows ({len(rows):,} by size + {len(total_rows):,} totals)")
    
    summary = upsert_iterable("regional_cells", iter(all_rows), batch_size=500,
                              progress_every=10, label="fr_insee")
    print(f"  uploaded {summary['pushed']:,}")

if __name__ == "__main__":
    main()
```

---

## 7 · T-H.4 · Run

```bash
cd E:\atlas
python scripts/ingest/fr_insee/aggregate.py    # ~15 min
python scripts/ingest/fr_insee/map_and_upload.py    # ~5 min
```

Total: ~20 min.

Peak RAM: ~500 MB during DuckDB pass.

---

## 8 · T-H.5 · Spot-check

| URL | Commune | Industry |
|---|---|---|
| `/fr/fr-75056/restaurants` | Paris (commune code) | Restaurants |
| `/fr/fr-75101/cafes-coffee-shops` | Paris 1er arrondissement | Cafés |
| `/fr/fr-13055/hotels-lodging` | Marseille | Hotels |
| `/fr/fr-69123/clothing-stores` | Lyon | Clothing |
| `/fr/fr-31555/web-mobile-dev-shops` | Toulouse | Software |

Each: tier 'P', 4-5 stars.

Note: Paris arrondissements are separate communes (75101 through
75120). Lyon arrondissements: 69381-69389. Marseille: 13201-13216.
These are sub-commune entities with their own SIREN data.

---

## 9 · Verification gate

| Check | Pass criterion |
|---|---|
| H.1 CSV in place | `Test-Path` true, file > 5 GB |
| H.2 agg.parquet written | File exists, > 1 MB |
| H.3 NAF mapping | Industry_id resolved for ≥ 80% of NAF codes |
| H.4 Row count | ≥ 60,000 |
| H.5 Spot-check | 5/5 |
| Coverage tier | All 'P' |
| RAM peak | < 600 MB |

When all seven pass: **H is DONE.** Move to Track I.

---

## 10 · Time estimate

| Task | Time |
|---|---|
| H.1 Pre-check | 1 min |
| H.2 DuckDB aggregation | 15-20 min |
| H.3 Mapping logic | 1 hour write |
| H.4 Upload | 5-10 min |
| H.5 Spot-check | 15 min |
| **Total** | ~2 hours (after CSV in place) |

---

## 11 · Known gotchas

- **SIREN vs SIRET**: SIREN = legal entity (9 digits). SIRET = establishment (14 digits = SIREN + 5-digit NIC). The StockUniteLegale file is at SIREN level. For multi-site businesses, this undercounts the establishment-level reality.
- **Alternative**: StockEtablissement.csv (also from INSEE) is at SIRET level — more granular, larger (~12 GB). For Phase 4 use UniteLegale (faster); for future phase consider Etablissement.
- **`codeCommune` nullable**: some entities have no commune code (e.g. holding companies registered without a fixed location). Drop these.
- **Closed entities**: filter `etatAdministratifUniteLegale = 'A'` (Active). Excluding 'C' (Ceased).
- **Auto-entrepreneurs (micro-entrepreneurs)**: most are in the 0-employee band. Counted but with very small typical revenue. Not filtered out — they're real businesses.
- **NAF revision**: France migrated NAF Rev 2008 → NAF 2025 in early 2025. If the CSV uses the new revision, the existing NACE map may be off for new codes. Sample 100 rows to confirm revision.
- **Encoding**: file is UTF-8 but historic Sirene was Latin-1. Confirm via the first few hundred bytes.

---

## 12 · What this unlocks

- France becomes a top-quality coverage country (NUTS-3 from Eurostat + commune from Sirene)
- Paris, Marseille, Lyon, Toulouse, Nice, Nantes — all at commune granularity
- Each Paris arrondissement is its own cell (75101, 75102, ...) — high SEO leverage
- French SMB queries (`cafés à paris`, `restaurants à lyon`) finally have real answers
