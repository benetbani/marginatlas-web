# Phase 15 — Latin America Cluster

Six countries: Mexico, Brazil, Argentina, Chile, Colombia, Peru.

## Per-country targets + sources

### Mexico
- 32 states + Mexico City
- 2,469 municipios — top 300 in this phase
- **Source:** INEGI DENUE (Directorio Estadístico Nacional de Unidades Económicas) https://www.inegi.org.mx/app/api/denue/v1/
- **Source:** INEGI Censo Económico (every 5y)
- SCIAN 2018 classification (Mexican NAICS adaptation, 1:1 with US NAICS at 4-digit)
- Expected: 332 + 300 municipios × 25 industries × 2 bands = ~30,000 cells → post-drop ~10,000
- Spot: `/mx/mexico-city/restaurants`, `/mx/jalisco/manufacturing`, `/mx/municipio/guadalajara/restaurants`, `/mx/municipio/monterrey/professional-services`, `/mx/municipio/tijuana/auto-repair-shops`

### Brazil
- 5 macro regiões + 27 estados (UF) + 5,570 municípios → top 500 in this phase
- **Source:** IBGE Cadastro Central de Empresas (CEMPRE) annual https://www.ibge.gov.br/estatisticas/economicas/comercio.html
- **Source:** IBGE SIDRA API https://sidra.ibge.gov.br/api/
- CNAE 2.3 classification (Brazilian NACE Rev.2 adaptation, 1:1 at 4-digit)
- Expected: 532 + 500 × 25 × 2 = ~28,000 cells → post-drop ~12,000
- Spot: `/br/sao-paulo-state/manufacturing`, `/br/rio-de-janeiro-state/restaurants`, `/br/municipio/sao-paulo/web-mobile-dev-shops`, `/br/municipio/rio-de-janeiro/cafes-coffee-shops`, `/br/municipio/belo-horizonte/restaurants`, `/br/municipio/curitiba/professional-services`, `/br/municipio/porto-alegre/clothing-stores`, `/br/municipio/salvador/hotels-lodging`

### Argentina
- 23 provinces + Buenos Aires city
- Top 100 partidos/departamentos
- **Source:** INDEC Censo Nacional Económico, RECC, INDEC Estructural
- CIIU Argentina (ISIC adaptation)
- Expected: 124 × 25 × 1 = ~3,000 cells
- Spot: `/ar/buenos-aires-city/restaurants`, `/ar/cordoba-province/manufacturing`, `/ar/partido/la-plata/restaurants`

### Chile
- 16 regiones + 346 comunas → top 100
- **Source:** INE Chile https://www.ine.gob.cl/ + SII (Servicio de Impuestos Internos)
- CIIU Rev.4 Chile (ISIC)
- Expected: 116 × 25 × 1 = ~2,900 cells
- Spot: `/cl/region/metropolitana/restaurants`, `/cl/comuna/santiago/web-mobile-dev-shops`, `/cl/comuna/valparaiso/hotels-lodging`

### Colombia
- 32 departamentos + Bogotá
- 1,103 municipios → top 100
- **Source:** DANE Encuesta Anual Manufacturera + DIAN tax filings
- CIIU Rev. 4 A.C.
- Expected: 133 × 25 × 1 = ~3,300 cells
- Spot: `/co/bogota/restaurants`, `/co/antioquia/manufacturing`, `/co/municipio/medellin/web-mobile-dev-shops`

### Peru
- 24 regiones + Lima Province
- Top 100 distritos
- **Source:** INEI Censos Económicos
- CIIU Rev.4 Peru
- Expected: 125 × 25 × 1 = ~3,100 cells
- Spot: `/pe/lima/restaurants`, `/pe/cusco/hotels-lodging`, `/pe/distrito/miraflores/cafes-coffee-shops`

## Common schema mapping
```
country := <ISO-2>
geo_id := '<ISO-2>-' + admin code
geo_level := 'estado' | 'municipio' | 'province' | 'comuna' | 'departamento' | 'distrito'
industry_id := mapped from local-to-NACE-or-ISIC bridge
year := from query
size_band := per-source
n_enterprises := from source
n_employees := where reported
revenue_per_firm := where reported (Brazil CEMPRE has it; Mexico DENUE doesn't)
quality_score := 60-75
coverage_tier := 'M' or 'T' depending on completeness
coverage_source := 'National business statistics'
currency := 'USD' after local→USD
```

## Implementation
One subfolder per country: `scripts/ingest/{mx,br,ar,cl,co,pe}/` with the standard pipeline.

INEGI DENUE special: ~5M rows; use chunked Sirene-style aggregation in DuckDB.

## Expected output
**~35,000 cells combined.** Storage: ~12 MB. Time: 5 hours.

## DoD
- [ ] All 6 countries with state-level coverage
- [ ] Mexico top 300 municipios, Brazil top 500 municípios populated
- [ ] 20/20 combined spot-checks render
- [ ] ≥ 30,000 LATAM rows in `regional_cells`
