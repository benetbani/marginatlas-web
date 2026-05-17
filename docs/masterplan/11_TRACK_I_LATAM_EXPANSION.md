# 11 · Track I — LATAM Expansion

> Mexico INEGI, Argentina INDEC, Chile INE, Colombia DANE, Peru INEI.
> Five countries; sequential; each adds 3-10k cells.

---

## 1 · Goal

Add **25,000+ rows** of LATAM sub-national data, taking total LATAM
coverage from BR-only (2,317 rows) to **27,000+ rows across 6
countries**.

---

## 2 · Targets

| Country | Target rows | Source | Difficulty |
|---|---|---|---|
| I.1 Mexico (INEGI DENUE / BIE) | **10,000+** | BIE API | Medium |
| I.2 Argentina (INDEC) | **4,000+** | INDEC OpenData | Medium |
| I.3 Chile (INE) | **3,000+** | INE / SII | Medium-low |
| I.4 Colombia (DANE) | **3,000+** | DANE API | Medium |
| I.5 Peru (INEI) | **3,000+** | INEI / SUNAT | Medium-high |
| Combined | **23,000+** | | |

(Round to 25k+ as the gate.)

---

## 3 · T-I.1 · Mexico INEGI

### Source

INEGI BIE (Banco de Información Económica) API.

- Base URL: `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/`
- Requires free token (register at `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/login/`)
- Documentation: `https://www.inegi.org.mx/servicios/api_indicadores.html`

### Target dataset

DENUE (Directorio Estadístico Nacional de Unidades Económicas) has
per-establishment data. Aggregated counts are available at:

- Cubo de información BIE — `tipoSerie=2` (annual)
- Indicators like `1006300003` (Number of economic units by activity and state)

### SCIAN classification

Mexico uses SCIAN (Sistema de Clasificación Industrial de América
del Norte) = NAICS at 4-digit. Use `naics_4_to_industry_id` or
`naics_3_to_industry_id` per existing mapper.

### Steps

#### T-I.1.1 — Founder action: register for token

Founder visits the INEGI registration page (registered to
`benet@researchtesseract.com` for audit trail). Token gets cached
in `.env.local`:

```
INEGI_API_TOKEN=<token>
```

Pause point if token not yet provisioned. Move to I.2 in
meantime.

#### T-I.1.2 — Pipeline file

`E:\atlas\scripts\ingest\mx_inegi\fetch.py`

Standard pattern. INEGI returns JSON with nested observation
structure.

#### T-I.1.3 — Run

32 states × ~80 SCIAN-3 codes = ~2,560 cells base.
Plus top 300 municipios × ~30 industries = ~9,000 cells.
Combined: ~10,000-12,000 rows.

Runtime: ~2 hours.

#### T-I.1.4 — Spot-check

| URL | State / Municipio | Industry |
|---|---|---|
| `/mx/mx-cmx/restaurants` | Mexico City | Restaurants |
| `/mx/mx-jal/cafes-coffee-shops` | Jalisco | Cafés |
| `/mx/mx-nle/web-mobile-dev-shops` | Nuevo León | Software |
| `/mx/mx-yuc/hotels-lodging` | Yucatán | Hotels |
| `/mx/mx-bcn/management-consulting` | Baja California | Consulting |

---

## 4 · T-I.2 · Argentina INDEC

### Source

INDEC OpenData (limited) + Ministerio de Economía datasets.

- Base URL: `https://apis.datos.gob.ar/series/api/series/`
- No API key required
- Documentation: `https://datos.gob.ar/series/api/`

### Target dataset

INDEC publishes business demography in their Censo Nacional
Económico (last full census 2020-2021). Per-province aggregated
counts available via:

- Series ID for "Cantidad de empresas por provincia y rama" — needs probe

Argentina's classification: CLANAE 2018 (Clasificación Nacional de
Actividades Económicas) = NACE-equivalent.

### Steps

#### T-I.2.1 — Probe

```bash
curl -s "https://apis.datos.gob.ar/series/api/search?q=empresas+rama+provincia"
```

#### T-I.2.2 — Pipeline

24 provinces × ~30 CLANAE-2 codes = ~720 cells base.
Add employee-band breakdown to reach 4,000+.

Runtime: ~1 hour.

#### T-I.2.3 — Spot-check

| URL | Province | Industry |
|---|---|---|
| `/ar/ar-baires/restaurants` | Buenos Aires | Restaurants |
| `/ar/ar-cba/cafes-coffee-shops` | Córdoba | Cafés |
| `/ar/ar-mza/hotels-lodging` | Mendoza | Hotels |
| `/ar/ar-sf/web-mobile-dev-shops` | Santa Fe | Software |
| `/ar/ar-rio/clothing-stores` | Río Negro | Clothing |

---

## 5 · T-I.3 · Chile INE

### Source

Chile's INE (Instituto Nacional de Estadísticas) + Servicio de
Impuestos Internos (SII) for business counts.

- INE Base URL: `https://www.ine.gob.cl/estadisticas/economia/empresas`
- SII publishes per-region per-industry counts in their annual report (PDF + Excel + CSV)

### Steps

#### T-I.3.1 — Source confirmation

INE has a SDMX endpoint at `https://stat.ine.cl/SDMXSWS/V1/` —
probe for business demography dataflows.

If SDMX is incomplete: fallback to SII annual report CSV download.

#### T-I.3.2 — Pipeline

16 regions × ~30 CIIU-2 codes (= ISIC) = ~480 cells base.
Add comuna breakdown for top 100 comunas = ~3,000 cells.

#### T-I.3.3 — Spot-check

| URL | Region / Comuna | Industry |
|---|---|---|
| `/cl/cl-rm/restaurants` | Región Metropolitana (Santiago) | Restaurants |
| `/cl/cl-vap/cafes-coffee-shops` | Valparaíso | Cafés |
| `/cl/cl-bio/web-mobile-dev-shops` | Biobío (Concepción) | Software |
| `/cl/cl-ant/hotels-lodging` | Antofagasta | Hotels |
| `/cl/cl-arc/management-consulting` | Arica | Consulting |

---

## 6 · T-I.4 · Colombia DANE

### Source

DANE (Departamento Administrativo Nacional de Estadística).

- Base URL: `https://www.dane.gov.co/index.php/servicios-al-ciudadano/servicios-informacion`
- Newer: `https://www.dane.gov.co/index.php/estadisticas-por-tema/cuentas-nacionales` for industry breakdowns
- Most useful for our purposes: Confecámaras (Chambers of Commerce) publish business counts per department + CIIU-3

### Steps

#### T-I.4.1 — Source choice

DANE's official API has limited business demography. Confecámaras
publishes more useful per-department per-CIIU data via their
"Demografía Empresarial" series.

For Phase I.4, use Confecámaras annual report CSV — manual
download once, then aggregate.

#### T-I.4.2 — Pipeline

32 departamentos × ~30 CIIU-2 codes = ~960 cells base.
Add top 100 municipios = ~3,000 cells.

#### T-I.4.3 — Spot-check

| URL | Departamento | Industry |
|---|---|---|
| `/co/co-bog/restaurants` | Bogotá D.C. | Restaurants |
| `/co/co-ant/cafes-coffee-shops` | Antioquia (Medellín) | Cafés |
| `/co/co-val/hotels-lodging` | Valle del Cauca (Cali) | Hotels |
| `/co/co-cun/web-mobile-dev-shops` | Cundinamarca | Software |
| `/co/co-atl/clothing-stores` | Atlántico (Barranquilla) | Clothing |

---

## 7 · T-I.5 · Peru INEI

### Source

INEI (Instituto Nacional de Estadística e Informática) + SUNAT.

- INEI Base URL: `https://www.inei.gob.pe/`
- SUNAT publishes business counts: `https://www.sunat.gob.pe/estadisticas/`

### Steps

#### T-I.5.1 — Source choice

INEI has the Censo Económico data; SUNAT has live business counts.
Use SUNAT for per-department per-CIIU breakdown.

CIIU Rev. 4 = ISIC Rev. 4. Direct mapping.

#### T-I.5.2 — Pipeline

25 regions (departamentos + Lima province) × ~30 CIIU-2 codes
= ~750 cells base.
Add top 50 provincias = ~2,500 cells.

#### T-I.5.3 — Spot-check

| URL | Region / Provincia | Industry |
|---|---|---|
| `/pe/pe-lim/restaurants` | Lima | Restaurants |
| `/pe/pe-cus/hotels-lodging` | Cusco | Hotels |
| `/pe/pe-aqp/cafes-coffee-shops` | Arequipa | Cafés |
| `/pe/pe-lal/web-mobile-dev-shops` | La Libertad (Trujillo) | Software |
| `/pe/pe-piu/management-consulting` | Piura | Consulting |

---

## 8 · Verification gate (combined)

| Check | Pass criterion |
|---|---|
| Mexico rows | ≥ 10,000 |
| Mexico spot-check | 5/5 |
| Argentina rows | ≥ 4,000 |
| Argentina spot-check | 5/5 |
| Chile rows | ≥ 3,000 |
| Chile spot-check | 5/5 |
| Colombia rows | ≥ 3,000 |
| Colombia spot-check | 5/5 |
| Peru rows | ≥ 3,000 |
| Peru spot-check | 5/5 |
| Combined delta | ≥ 23,000 |
| Coverage tier | Mostly 'P' (some 'S' for Chile/Colombia depending on source) |
| RAM peak (any pipeline) | < 600 MB |

When all thirteen pass: **I is DONE.** Move to Track J.

---

## 9 · Time estimate

| Task | Time |
|---|---|
| I.1 Mexico (highest priority — register + write + run) | 4-5 hours |
| I.2 Argentina (probe + write + run) | 2-3 hours |
| I.3 Chile | 2-3 hours |
| I.4 Colombia | 3-4 hours (Confecámaras manual download) |
| I.5 Peru | 3-4 hours |
| **Total** | 14-19 hours |

This is the second-largest track. Can be split across two sessions.
Run countries in sequence; each is independent.

---

## 10 · Sequencing logic

Order chosen by impact-per-effort:

1. **Mexico first** — largest economy, most rows expected, clean API
2. **Argentina second** — well-documented INDEC, decent volume
3. **Chile** — small but clean
4. **Colombia** — manual download adds friction
5. **Peru** — least documented; do last

If any country blocks (API change, registration friction): skip
and move on. Document in `PROGRESS.md`.

---

## 11 · Known gotchas

- **Spanish-language docs**: most LATAM stat-office docs are Spanish-only. Use translate; preserve term mappings in code comments.
- **Per-classification crosswalks**: CLANAE (AR), CIIU Rev.4 (CL/CO/PE), SCIAN (MX). MX = NAICS at 4-digit. Others = ISIC-aligned.
- **Suppression**: most LATAM agencies suppress cells below 3-5 firms. Drop them.
- **Currency**: all rows store revenue in USD. Use World Bank FX rate for the data's year via `currency_convert.to_usd()`. Argentine peso has high inflation; use end-of-year rate, not average.
- **Geo code conventions**:
  - MX: ISO-2 + state code (`mx-jal`, `mx-cmx`, `mx-yuc`)
  - AR: province slug (`ar-baires` for Buenos Aires province; disambiguate from city)
  - CL: region code (`cl-rm`)
  - CO: departamento ISO-2 part (`co-bog`, `co-ant`)
  - PE: region 3-letter (`pe-lim`, `pe-cus`)
- **Argentina note**: "Buenos Aires" is ambiguous (province vs city). Use `ar-baires` for province, `ar-caba` (Ciudad Autónoma de Buenos Aires) for city.

---

## 12 · What this unlocks

- LATAM grows from 1 covered country (Brazil) to 6 covered countries
- Mexico City, Buenos Aires, Santiago, Bogotá, Lima — all measured
- Regional consulting / SMB queries in Spanish surface real data
- Reduces reliance on Phase 18 city overlay (tier 'X') for LATAM
