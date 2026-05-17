# Phase 5 — Italy: Regioni → Province → Comuni

> **Goal:** Reach the comune (municipality) level for Italy — top 1,000
> of 7,904 comuni, covering ~85% of Italian SMB activity. Italian
> SMB story (boutique food, fashion, leather, ceramics, mid-size
> manufacturing) is most accurately read at comune level.

## Targets
| Level | Italian | Count | Phase |
|---|---|---|---|
| Macro | Ripartizione | 5 | Eurostat NUTS-1 (Phase 1) |
| Region | Regione | 20 | Eurostat NUTS-2 (Phase 1) |
| Province | Provincia/Città metropolitana | 107 | Eurostat NUTS-3 (Phase 1) |
| Municipality | Comune | 7,904 | TOP 1,000 in THIS phase |

## Sources
- **ISTAT IstatData (esploradati.istat.it)**: `DCSC_ASIAUE1P` (active enterprises by comune × ATECO-3) and `DCSC_ASIAUE1L` (employees by comune × ATECO-3).
- **ISTAT Censimento permanente delle imprese** (annual): finer rev/wage data by comune × ATECO-2.
- API: SDMX endpoint `https://esploradati.istat.it/SDMXWS/rest/data/{dataflow}/{key}?format=jsondata`. Free, no key.

## Industry mapping
ATECO-2007 (Italian NACE Rev.2 implementation) — 1:1 with NACE codes. Use existing crosswalk. Notable Italian-only specifics:
- ATECO 13 (textiles), 14 (apparel), 15 (leather) → strong coverage → `textile_apparel_mfg`, sub-niche routes for leather goods
- ATECO 23.4 (ceramics) → maps to `furniture_other_mfg`
- ATECO 25 (metals) → `metal_products_mfg` (Italian Mittelstand equivalent)
- ATECO 47.71 → `clothing_stores`; ATECO 47.77 → `jewelry_stores`
- ATECO 55.10 → `hotels_lodging`; ATECO 56.10 → `restaurants`
- ATECO 96.02 → `hair_salons` / `hairdressers_beauty`

## Schema mapping
```
country  := 'IT'
geo_id   := 'IT-' + 6-digit ISTAT comune code (e.g. 'IT-015146' = Milano)
geo_level := 'comune'
geo_name := from ISTAT comuni list
industry_id := mapped from ATECO-3
year     := from query
size_band := 'total' (most ISTAT comune tables don't size-band)
n_enterprises  := ISTAT V40 (Imprese attive)
n_employees    := ISTAT V41 (Addetti)
revenue_per_firm := ISTAT V42 / V40 (where pubblicato)
quality_score := 75
coverage_tier := 'P'
coverage_source := 'National business statistics'
currency := 'USD'
```

## Implementation
1. `scripts/ingest/it_istat/fetch_dataflow.py` — paginated SDMX fetch, streams JSON, capped batch.
2. `scripts/ingest/it_istat/comuni_lookup.csv` — ISTAT codice ↔ comune name ↔ provincia ↔ regione (one-time download).
3. `scripts/ingest/it_istat/normalize.py` — ATECO→industry, EUR→USD.
4. `scripts/ingest/it_istat/filter_top_1000.py` — top 1,000 comuni by enterprise count.
5. `scripts/ingest/it_istat/upload.py` — common helper.
6. `scripts/ingest/it_istat/run.py` — orchestrator.
7. Resume file `it_istat_progress.json`.

## Expected output
~1,000 comuni × ~30 industries × 1 size band = **~30,000 cells**. Storage: ~9 MB. Time: 4 hours.

## Spot-checks
- `/it/milan/clothing-boutiques` (015146)
- `/it/rome/restaurants` (058091)
- `/it/florence/jewelry-stores` (048017)
- `/it/turin/auto-repair-shops` (001272)
- `/it/naples/pizzerias` (063049)
- `/it/bologna/cafes-coffee-shops` (037006)
- `/it/venice/hotels-lodging` (027042)
- `/it/genoa/restaurants` (010025)
- `/it/palermo/hair-salons` (082053)
- `/it/verona/wine-bars` (023091)

## RAM
ISTAT SDMX returns < 100 MB per query. Stream parse. Peak ~80 MB.

## DoD
- [ ] Top 1,000 comuni ingested
- [ ] 10/10 spot-checks render measured data
- [ ] ≥ 25,000 IT rows in `regional_cells`
- [ ] Per-comune progress file complete
