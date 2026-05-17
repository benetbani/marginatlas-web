# Phase 4 — France: Régions → Départements → Communes

> **Goal:** Drive France down to the **commune (city/town/village)** level
> for the top 2,000 communes. France's INSEE Sirene is the most
> comprehensive business registry in Europe — every registered business
> with its precise commune code. This phase exploits that to give us
> deep coverage from Paris arrondissements down to mid-size towns.

---

## 1 · Targets

| Level | French name | Count | Phase |
|---|---|---|---|
| Macro | Région | 18 | Phase 1 NUTS-1 |
| Department | Département | 96 metropolitan + 5 overseas | Phase 1 NUTS-3 |
| Inter-commune | EPCI | ~1,250 | Not covered (rare in user queries) |
| Commune | Commune | 35,000 | TOP 2,000 in this phase |
| Sub-commune | Arrondissement (Paris, Lyon, Marseille only) | 45 | Treated as communes |

The top 2,000 communes cover ~92% of French SMB activity.

---

## 2 · Source

**INSEE Sirene** — the official French business registry.

| Path | Content |
|---|---|
| Bulk download | https://www.data.gouv.fr/fr/datasets/r/eec3a04e-... (`StockUniteLegale_utf8.zip`, ~600 MB compressed, 6 GB uncompressed) |
| API (limited) | https://api.insee.fr/entreprises/sirene/V3.11/ (10k requests/month free; bulk preferred) |
| Companion: INSEE REE (Répertoire) | https://www.insee.fr/fr/statistiques/serie/000436391 |
| Companion: INSEE BPE (Permanent Equipment Base) | https://www.insee.fr/fr/statistiques/3568617 |

We use the **bulk Sirene download** — streaming-friendly, no rate limit.

---

## 3 · Data shape

Sirene records per legal unit:
- SIREN (9-digit company ID)
- SIRET (14-digit establishment ID)
- NAF / APE code (5-digit French equivalent of NACE Rev.2)
- Commune code (5-digit INSEE code, e.g. `75056` = Paris)
- Employee size band (`tranchEffectifsUniteLegale`: 00 = 0 employees, 01 = 1–2, 02 = 3–5, 03 = 6–9, 11 = 10–19, 12 = 20–49, 21 = 50–99, 22 = 100–199, 31 = 200–249, 32 = 250–499, 41 = 500–999, 42 = 1000–1999, 51 = 2000–4999, 52 = 5000–9999, 53 = 10000+)
- Status (active / cessé)

Aggregating by (commune, NAF-3, employee_band) gives us cell-ready rows.

---

## 4 · Aggregation strategy

```sql
-- Run inside DuckDB with memory_limit='400MB'
CREATE TABLE commune_industry_band AS
SELECT
    codeCommuneUniteLegale       AS commune_code,
    LEFT(activitePrincipaleUniteLegale, 3) AS naf_3,
    tranchEffectifsUniteLegale   AS size_band_raw,
    COUNT(*) AS n_enterprises
FROM read_csv('StockUniteLegale_utf8.csv',
              auto_detect=true,
              sample_size=10000,
              union_by_name=true)
WHERE etatAdministratifUniteLegale = 'A'  -- active only
GROUP BY 1, 2, 3
```

DuckDB streams the CSV from disk, never loads the full 6 GB to memory.
With `memory_limit='400MB'` it spills to disk when needed. Process RSS
stays under 500 MB throughout.

Output rowcount: ~12 million pre-aggregation → ~600,000 post-aggregation.

After NAF-3 → industry_id mapping and dropping `corp_only` industries,
final dataset shrinks to ~250,000 (commune × industry × band) rows.

Filter to top 2,000 communes by total enterprise count → ~60,000 final cells.

---

## 5 · Industry mapping (NAF → industry_id)

- NAF 56.10A → `restaurants`
- NAF 56.30Z → `bars-nightclubs` → falls back to `restaurants`
- NAF 47.71Z → `clothing-stores`
- NAF 47.77Z → `jewelry-stores`
- NAF 47.75Z → `cosmetics-shops`
- NAF 96.02A → `hair-salons`
- NAF 41.20A → `residential-construction`
- NAF 43.22A → `plumbers`
- NAF 43.21A → `electricians`
- NAF 62.01Z → `web-mobile-dev-shops` / `custom-software-contract`
- NAF 68.31Z → `real-estate-agencies`
- ... and ~90 more 5-digit codes → ~40 industries in our taxonomy

Full mapping in `scripts/ingest/fr_insee/naf_to_industry.csv`. Built once
from the official INSEE cross-mapping doc.

---

## 6 · Employee band normalization

INSEE bands are finer than ours. Mapping:

| INSEE | Our `size_band` |
|---|---|
| 00 | `1` (sole prop, 0 employees = self) |
| 01, 02, 03 | `2-9` |
| 11, 12 | `10-49` |
| 21, 22, 31 | `50-249` |
| 32, 41, 42, 51, 52, 53 | `250+` |

When aggregating, sum within the mapped band.

---

## 7 · Schema mapping

```
country        := 'FR'
geo_id         := 'FR-' + 5-digit commune code (e.g. 'FR-75056' = Paris all-arr)
geo_level      := 'commune'
geo_name       := from INSEE communes CSV (e.g. 'Paris', 'Lyon', 'Toulouse')
industry_id    := mapped from NAF-3
year           := 2024 (most recent Sirene stock)
size_band      := mapped from INSEE band
n_enterprises  := COUNT from aggregation
n_employees    := SUM of band midpoints × n_enterprises (estimate)
revenue_per_firm := NULL (Sirene has no revenue; would need DGFiP join, deferred)
payroll_per_employee := NULL
quality_score  := 65 (tabulated counts only, no distribution)
coverage_tier  := 'T' (Tabulated)
coverage_source := 'National business statistics'
currency       := 'USD'
```

Paris special case: aggregate by arrondissement using SIRET-level `codeCommuneEtablissement`. URLs become `/fr/paris-1er-arrondissement/...`, `/fr/paris-7e-arrondissement/...`. Same for Lyon (9 arrondissements) and Marseille (16).

---

## 8 · Implementation steps

1. `scripts/ingest/fr_insee/download_sirene.py` — pulls latest StockUniteLegale ZIP, unzips. Resume support.
2. `scripts/ingest/fr_insee/aggregate.py` — DuckDB SQL above. Output to `commune_industry_band.parquet`.
3. `scripts/ingest/fr_insee/fetch_commune_meta.py` — pulls the official communes registry from INSEE (35k rows, < 1 MB).
4. `scripts/ingest/fr_insee/normalize.py` — joins aggregate with commune meta + industry crosswalk + band mapping. Writes `regional_cells_fr.parquet`.
5. `scripts/ingest/fr_insee/filter_top_2k.py` — keeps top 2,000 communes by total firm count + always includes all Paris/Lyon/Marseille arrondissements.
6. `scripts/ingest/fr_insee/upload.py` — batched upsert to Supabase.
7. `scripts/ingest/fr_insee/run.py` — orchestrator. 6-stage pipeline.
8. `scripts/ingest/fr_insee/insee_communes.csv` — official commune codes + names cache.
9. Resume file: `fr_insee_progress.json`.
10. Verify: `/fr/paris-7e/cosmetics-shops`, `/fr/lyon-2e/restaurants`, `/fr/marseille-6e/cafes-coffee-shops`, `/fr/bordeaux/wine-bars`, `/fr/nice/hotels-lodging`, `/fr/toulouse/aerospace-mfg` (will fall back since aerospace is corp_only), `/fr/lille/textile-apparel-mfg`.

---

## 9 · RAM discipline (critical)

The 6 GB CSV is the largest input in the whole project. Rules:

- NEVER `pd.read_csv("...")` without `chunksize=`.
- Use DuckDB for aggregation; set `memory_limit='400MB'`.
- After aggregation, the in-memory parquet is < 50 MB.
- Upload streams the parquet row-by-row.
- Process RSS must never exceed 600 MB.
- Monitor with `ram_guard.py`; abort on overshoot, resume from last commune.

---

## 10 · Expected output

- **Communes covered:** top 2,000 by activity + all 45 arrondissements
- **Industries × communes:** ~30 SMB industries
- **Size bands per cell:** 1–5 bands (mostly 3 for active communes)
- **Total cells:** ~60,000–80,000
- **Storage:** ~25 MB

Time to run: 4 hours end-to-end (mostly the CSV download + DuckDB aggregation; Supabase upload is fast).

---

## 11 · Spot-check URLs

- `/fr/paris/restaurants` (commune 75056, all-Paris)
- `/fr/paris-7e/cosmetics-shops` (75107)
- `/fr/lyon/restaurants` (69123)
- `/fr/lyon-2e/clothing-boutiques` (69382)
- `/fr/marseille/cafes-coffee-shops` (13055)
- `/fr/toulouse/web-mobile-dev-shops` (31555)
- `/fr/bordeaux/wine-bars` (33063)
- `/fr/nice/hotels-lodging` (06088)
- `/fr/nantes/restaurants` (44109)
- `/fr/strasbourg/bakeries` (67482)
- `/fr/montpellier/hair-salons` (34172)
- `/fr/rennes/web-mobile-dev-shops` (35238)

---

## 12 · Risks

| Risk | Mitigation |
|---|---|
| Sirene CSV size grows month-over-month | Cap download at 8 GB; if exceeded, switch to API for incremental updates |
| Some communes merge / split | Use 2024 commune codes; older arr-mergers (Paris-Saint-Mandé etc.) flagged |
| NAF-3 too coarse for niche industries | Use NAF-4 (already in source) for top 200 communes, NAF-3 for rest |
| No revenue data | Quality tier "T" makes this explicit in UI |
| Active vs inactive flag drift | Always filter `etatAdministratifUniteLegale = 'A'` |
| Confidentiality suppression on very small communes | Drop rows where `n_enterprises < 5` |

---

## 13 · Future enhancement

Sirene gives only enterprise counts. To add revenue per commune, join
with **DGFiP FBR (Fichier des résultats des entreprises)** which has
balance-sheet data per SIREN. Aggregation by commune × industry gives
real revenue distribution. This requires special access (DGFiP grants
research licenses) — Phase B work post-launch.

---

## 14 · Definition of done

- [ ] Top 2,000 communes ingested with ≥ 20 industry cells each
- [ ] Paris/Lyon/Marseille arrondissements (45) all populated
- [ ] 12/12 spot-check URLs return non-extrapolated cells
- [ ] DuckDB peak RAM < 500 MB confirmed via `ram_guard.py` logs
- [ ] Resume from interruption works (kill mid-run, restart, completes)
- [ ] Coverage audit shows ≥ 60,000 France rows in `regional_cells`
