# Phase 6 — Spain: Comunidades → Provincias → Municipios

> **Goal:** Reach the municipio level for Spain — top 1,000 of 8,131
> municipios. INE's DIRCE gives clean per-municipio firm counts by
> CNAE-2 division.

## Targets
| Level | Spanish | Count | Phase |
|---|---|---|---|
| Zone | Zona NUTS-1 | 7 | Phase 1 |
| Autonomous community | Comunidad Autónoma | 17 + 2 ciudades | Phase 1 NUTS-2 |
| Province | Provincia | 50 | Phase 1 NUTS-3 |
| Municipality | Municipio | 8,131 | THIS PHASE (top 1,000) |

## Sources
- **INE DIRCE** (Directorio Central de Empresas): https://servicios.ine.es/wstempus/js/EN/DATOS_TABLA/4721 (companies by municipality + CNAE-2 + size class)
- **INE Censo de Población y Viviendas**: complementary employment data
- **INE Estadística estructural de empresas**: revenue + payroll
- Free, no key, JSON output.

## Industry mapping
CNAE-2009 (Spanish NACE Rev.2 implementation), 1:1 with NACE. Existing crosswalk works as-is.

## Schema mapping
```
country := 'ES'
geo_id := 'ES-' + 5-digit INE municipio code (e.g. 'ES-28079' = Madrid)
geo_level := 'municipio'
geo_name := from INE municipios list
industry_id := mapped from CNAE-2
year := from query
size_band := INE provides 0/1-2/3-5/6-9/10-19/20-49/50-99/100-199/200-499/500-999/1000-4999/5000+ → mapped to our 5 bands
n_enterprises := INE V01 (Empresas)
n_employees := derived from size band midpoints × n_enterprises
quality_score := 70
coverage_tier := 'M'  # modeled employees, primary enterprise counts
coverage_source := 'National business statistics'
currency := 'USD'
```

## Implementation
1. `scripts/ingest/es_ine/fetch_dirce.py` — paginated JSON, streaming.
2. `scripts/ingest/es_ine/municipios_lookup.csv` — INE code ↔ name.
3. `scripts/ingest/es_ine/normalize.py`
4. `scripts/ingest/es_ine/filter_top_1000.py`
5. `scripts/ingest/es_ine/upload.py`
6. `scripts/ingest/es_ine/run.py`
7. Resume file `es_ine_progress.json`.

## Expected output
~1,000 municipios × ~30 industries × 5 bands = **~75,000 cells** (cap at 30,000 after dropping low-n).
Storage: ~10 MB. Time: 4 hours.

## Spot-checks
- `/es/barcelona/restaurants` (08019)
- `/es/madrid/cosmetics-shops` (28079)
- `/es/valencia/hotels-lodging` (46250)
- `/es/seville/clothing-stores` (41091)
- `/es/zaragoza/hair-salons` (50297)
- `/es/malaga/cafes-coffee-shops` (29067)
- `/es/bilbao/restaurants` (48020)
- `/es/granada/jewelry-stores` (18087)
- `/es/palma-de-mallorca/hotels-lodging` (07040)
- `/es/alicante/web-mobile-dev-shops` (03014)

## RAM
INE API returns small JSON. Peak ~60 MB.

## DoD
- [ ] Top 1,000 municipios with ≥ 20 industry cells each
- [ ] All 50 provincial capitals included
- [ ] 10/10 spot-checks render
- [ ] ≥ 25,000 ES rows in `regional_cells`
