# Phase 1 — EU NUTS-1/2/3 via Eurostat

> **Goal:** Populate `regional_cells` with measured business statistics
> for every NUTS-1, NUTS-2, and NUTS-3 region across EU-27 + EFTA-4
> (Switzerland, Norway, Iceland, Liechtenstein) and candidate countries
> via the Eurostat REST API.
>
> **Why first:** This single phase unlocks ~6,500 sub-national geo
> records spanning 30+ countries. It is the highest leverage move in the
> entire plan.

---

## 1 · Targets

| Level | Definition | Count | Example |
|---|---|---|---|
| NUTS-1 | Macro region | 104 | `DE5` Bremen, `FR1` Île-de-France macro |
| NUTS-2 | Province / state | 281 | `DE21` Oberbayern, `ITC4` Lombardia |
| NUTS-3 | District / department | 1,348 | `DE212` Munich Stadt, `ITC4C` Milan |

Of these, **NUTS-3 is the prize** — it puts us at the actual district / county / department level for the whole EU.

---

## 2 · Source

| Dataset | Eurostat code | Granularity |
|---|---|---|
| Annual enterprise statistics by NUTS-2 | `sbs_r_nuts06_r2` | NUTS-2 × NACE Rev.2 |
| Business demography by region | `bd_l_form_r2` | NUTS-2 × NACE |
| Local units by NUTS-3 | `sbs_r_loc_le_03` | NUTS-3 × NACE |
| Employment in non-financial services by NUTS-3 | `sbs_r_l_03` | NUTS-3 × NACE high-level |

Endpoint pattern:
```
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{dataset_code}?format=JSON&lang=EN&{filters}
```

No API key required. Soft rate limit ~3,000 calls/day.

---

## 3 · Industry mapping

Eurostat reports in NACE Rev.2 (B–N, P–S, plus aggregates). We map
4-digit NACE → ISIC Rev.4 → our `industry_id` via the existing
`scripts/apply_taxonomy.py` crosswalk. Cells without a clean match are
dropped.

Crosswalk file: `scripts/ingest/common/nace_to_industry.csv`. Pre-built
from the ISIC↔NACE bridge. Industries we expect to cover from Eurostat:

- All `mining_quarrying`, `manufacturing_*`, `construction_*` sub-codes
- `wholesale_*`, `retail_*` (NACE G)
- `transport_*` (NACE H)
- `hotels_lodging`, `restaurants` (NACE I)
- `it_services_hosting`, `software_development`, `media_publishing` (NACE J)
- `real_estate_*` (NACE L)
- `professional_services`, `legal_services`, `accounting_tax`, `management_consulting`, `architecture_engineering` (NACE M)
- `cleaning_services`, `employment_services`, `security_services`, `travel_agencies`, `office_support` (NACE N)
- `education` placeholders (NACE P) and `health_clinics` (Q)
- Arts, entertainment, personal services (R, S)

Banking (K) and utilities (D, E) are downloaded but marked `corp_only`
and filtered at write time.

---

## 4 · Schema mapping

| Source field | regional_cells column |
|---|---|
| `geo` (e.g. "DE21") | `geo_id` |
| label lookup via Eurostat `nuts.dic` | `geo_name` |
| `NACE_R2` 4-digit code → mapped | `industry_id` |
| `time` (year) | `year` |
| `unit` filter EUR → USD via FX | `revenue_per_firm` |
| `sizeclas` if present, else "total" | `size_band` |
| `V11210` enterprise count | `n_enterprises` |
| `V16110` employees count | `n_employees` |
| `V12110` / `V11210` derived | `revenue_per_firm` |
| `V13320` / `V16110` derived | `payroll_per_employee` |

The first/last `geo_id` character determines the NUTS level (DE = country, DE2 = NUTS-1, DE21 = NUTS-2, DE212 = NUTS-3).

---

## 5 · Implementation steps

1. `scripts/ingest/eu_eurostat/fetch_nuts2.py` — paginated fetch for `sbs_r_nuts06_r2`. Streams JSON-stat via `ijson`. Memory bounded.
2. `scripts/ingest/eu_eurostat/fetch_nuts3.py` — same for `sbs_r_l_03`.
3. `scripts/ingest/eu_eurostat/normalize.py` — per-row mapping to `regional_cells` schema. Currency conversion EUR → USD via cached `PA.NUS.FCRF` from World Bank.
4. `scripts/ingest/common/upload_to_supabase.py` — batch upsert, 500 rows per call.
5. `scripts/ingest/eu_eurostat/run.py` — orchestrator: fetch → normalize → upload, one country at a time.
6. Industry crosswalk: `scripts/ingest/common/nace_to_industry.csv` — generated once from existing ISIC mapping.
7. NUTS code lookup: download `nuts_2021.csv` from Eurostat metadata, cache locally.
8. Quality scoring: tier "S" (Secondary, modeled from primary), score 70–80 based on row completeness.
9. Coverage source string: "European business statistics" (already in QualityBadge generic mapping).
10. RAM guard: import `ram_guard.py`; abort batch at 500 MB RSS.
11. Resume support: write `last_upload_offset.json` per country after each successful batch.
12. Verify: spot-check three URLs after each EU-country batch: a NUTS-2 cell, a NUTS-3 cell, an industry-rich city.

---

## 6 · Expected output

- **Rows:** ~6,500 geos × ~40 SMB industries × 1 size band (`total`) = ~260,000 cells
- **Storage delta:** ~80 MB
- **Time to complete:** 4 hours for the full EU-27 + EFTA-4 sweep
- **Quality tier:** mostly "S" (secondary, official statistical agency)

---

## 7 · Spot-check URLs (after Phase 1 completes)

- `/de/oberbayern/restaurants` (DE21 NUTS-2)
- `/de/munich/restaurants` (DE212 NUTS-3 → "Munich Stadt")
- `/fr/ile-de-france/cafes-coffee-shops` (FR10 NUTS-2)
- `/fr/paris/cosmetics-shops` (FR101 NUTS-3 → Paris dept)
- `/it/lombardy/clothing-stores` (ITC4 NUTS-2)
- `/it/milan/jewelry-stores` (ITC4C NUTS-3)
- `/es/cataluna/hotels-lodging` (ES51 NUTS-2)
- `/es/barcelona/restaurants` (ES511 NUTS-3)
- `/pl/mazowieckie/software-development` (PL12 NUTS-2)
- `/pl/warsaw/it-services-hosting` (PL127 NUTS-3)

---

## 8 · Risks

| Risk | Mitigation |
|---|---|
| Some NUTS-3 codes have no business stats (rural, sparsely populated) | Skip rows where n_enterprises < 10; do not invent |
| Cyprus, Malta have only NUTS-2 = whole country | Special-cased; flagged in output |
| NACE-4 to industry_id mapping incomplete for niche codes | Fall back to NACE-3 mapping; mark quality "M" instead of "S" |
| Eurostat dataset URLs occasionally change | Hard-code dataset codes; if a fetch fails, log + skip |
| Cell-page URL slug collision (Paris dept FR-75 vs Paris commune FR-75056) | Use slug `paris-departement` for the dept, `paris-commune` for the city; or skip dept-level when city-level exists |

---

## 9 · RAM budget

- Fetch: streams via `requests` + `ijson` (< 50 MB peak).
- Normalize: row-by-row generator (< 20 MB peak).
- Upload: 500-row batches, ~150 KB each.
- DuckDB not used in this phase.
- **Peak: ~80 MB. Well within budget.**

---

## 10 · Definition of done

- [ ] All 27 EU + 4 EFTA + 6 candidate countries fetched
- [ ] ≥ 200,000 rows written to `regional_cells` with `coverage_tier IN ('P','S','M')`
- [ ] 10/10 spot-check URLs in section 7 render with measured data
- [ ] No row has `industry_id` = NULL
- [ ] No row has `geo_name` = `geo_id` (lookup succeeded for all)
- [ ] Resume file `last_upload_offset.json` shows all countries marked DONE
- [ ] One-line summary added to `19_VERIFICATION_QUALITY.md`
