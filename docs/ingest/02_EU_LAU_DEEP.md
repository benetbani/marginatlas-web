# Phase 2 — EU LAU (Local Administrative Units = municipalities)

> **Goal:** Push below NUTS-3 to the actual municipality level (LAU =
> formerly NUTS-4 / NUTS-5) for the five most-trafficked EU countries:
> Germany, France, Italy, Spain, Netherlands. Total LAU count across
> these five is ~110,000 — we cherry-pick the top 4,000 by
> population/economic relevance, leaving the long tail for later.

---

## 1 · Why LAU matters

NUTS-3 already gives us "Paris" (FR101) and "Milan" (ITC4C), but those
codes wrap whole départements / provinces. LAU is what gets us:

- A specific arrondissement of Paris (FR75056)
- A specific Munich district (DE-09162)
- An individual Italian comune (IT-015146)
- A specific Madrid barrio rollup

This is the level the founder explicitly asked for: **city / town /
village level**. Most user queries ("clothing boutiques in Milan",
"cafés in Lyon") resolve here.

---

## 2 · Sources per country

| Country | LAU count | Source dataset | API |
|---|---|---|---|
| Germany | 10,790 Gemeinden | Destatis 47411-04-01-4-B / GENESIS-Online | https://www-genesis.destatis.de/ |
| France | 35,000 communes | INSEE Sirene SIREN/SIRET base + REE | https://api.insee.fr/ |
| Italy | 8,000 comuni | ISTAT IstatData "Imprese attive per comune" | https://esploradati.istat.it/ |
| Spain | 8,131 municipios | INE Directorio Central de Empresas (DIRCE) | https://ine.es/ |
| Netherlands | 340 gemeenten | CBS StatLine "Bedrijven; bedrijfsgrootte" | https://opendata.cbs.nl/ |

All five APIs are public, free, and rate-limited but generous.

---

## 3 · Cherry-pick rule

Don't try to fetch all 110,000 LAU at once. Apply this filter:

1. **Population ≥ 5,000** (cuts the rural long tail to ~12,000 LAU)
2. **OR** has any LAU economic data point with `n_enterprises ≥ 50`
3. Cap at top 4,000 by population (sorted desc)

This keeps storage manageable (~120,000 cells at 30 industries × 4,000 LAU) and focuses on places people actually live and run businesses.

---

## 4 · Implementation per country

### 4a · Germany (Destatis Gemeinden)

Steps:
1. Fetch population per Gemeinde from `12411-0017` (population by Gemeinde).
2. Filter to top 1,000 by population.
3. Fetch business demography per Gemeinde from `52111-0009` (Local units by Gemeinde + NACE-2).
4. NACE-2 → industry_id mapping (loses some granularity vs NACE-4 at NUTS-3).
5. Currency: EUR → USD via World Bank annual FX.
6. Output: ~1,000 Gemeinden × 30 industries × 1 size = 30,000 cells.
7. Spot check: `/de/munich/restaurants`, `/de/berlin-mitte/cafes-coffee-shops`, `/de/hamburg/hairdressers-beauty`.

### 4b · France (INSEE Sirene)

Sirene is the **gold standard** — every registered French business with
its 5-digit NAF code, commune, employee band. ~25 million records.

Steps:
1. Download Sirene "Stock Unités Légales" CSV (updated monthly, ~6 GB).
2. **CRITICAL:** Stream-parse with `pandas.read_csv(chunksize=50000)` and aggregate per (commune, NAF-3, employee_band) in batches.
3. Use DuckDB with `memory_limit='512MB'` to aggregate: `COUNT(*) AS n_enterprises`, `SUM(employee_band_midpoint) AS n_employees_est`.
4. Map NAF-3 → industry_id via crosswalk.
5. Filter to top 2,000 communes by enterprise count.
6. No revenue data in Sirene (it's a registry, not a financial statement). Quality tier "T" (Tabulated counts only).
7. Output: ~2,000 communes × 30 industries × 5 size_bands = 300,000 cells. CAP at 60,000 after the top-2,000 filter and dropping low-n rows.
8. Spot check: `/fr/paris/restaurants` (commune 75056), `/fr/lyon/cafes-coffee-shops` (69123), `/fr/marseille/clothing-stores` (13055).

### 4c · Italy (ISTAT comuni)

Steps:
1. Pull `DCSC_ASIAUE1P` (Active enterprises by comune + ATECO 3-digit) — ISTAT IstatData.
2. ATECO-3 → industry_id mapping.
3. ISTAT also has `DCSC_ASIAUE1L` with employee counts per comune.
4. Filter to top 1,000 comuni by enterprise count (covers ~80% of all firms).
5. Output: ~1,000 comuni × 30 industries × 1 size_band = 30,000 cells.
6. Spot check: `/it/milan/jewelry-stores` (15146), `/it/rome/restaurants` (58091), `/it/florence/clothing-boutiques` (48017).

### 4d · Spain (INE DIRCE municipios)

Steps:
1. Pull DIRCE table `https://servicios.ine.es/wstempus/js/EN/DATOS_TABLA/4721` (companies by municipality + CNAE-2).
2. CNAE-2009 → industry_id mapping (CNAE follows NACE Rev.2).
3. Filter to top 1,000 municipios.
4. Output: ~1,000 × 30 × 1 = 30,000 cells.
5. Spot check: `/es/barcelona/cosmetics-shops` (08019), `/es/madrid/clothing-boutiques` (28079), `/es/valencia/restaurants` (46250).

### 4e · Netherlands (CBS gemeenten)

Steps:
1. Pull CBS open-data `https://opendata.cbs.nl/ODataApi/odata/81588NED/TypedDataSet` (companies by gemeente + SBI-2).
2. SBI-2008 → industry_id mapping.
3. All 340 gemeenten fit comfortably; no filtering.
4. Output: ~340 × 30 × 1 = 10,200 cells.
5. Spot check: `/nl/amsterdam/cafes-coffee-shops` (0363), `/nl/rotterdam/restaurants` (0599), `/nl/the-hague/clothing-stores` (0518).

---

## 5 · Universal data quality rules

- Drop any row where `n_enterprises < 5` (privacy + statistical noise).
- Convert all amounts to USD via World Bank `PA.NUS.FCRF` annual averages.
- `coverage_tier = "M"` (Modeled / Aggregated, since LAU is often a roll-up of register data without distribution).
- `quality_score`: 60–70 based on completeness.
- `coverage_source` (internal): exact source code per country. The UI generizes via `QualityBadge`.

---

## 6 · Storage budget

| Country | LAU cells | Bytes/row | MB |
|---|---|---|---|
| DE Gemeinden top 1,000 | 30,000 | 300 | 9 |
| FR communes top 2,000 | 60,000 | 300 | 18 |
| IT comuni top 1,000 | 30,000 | 300 | 9 |
| ES municipios top 1,000 | 30,000 | 300 | 9 |
| NL gemeenten all | 10,200 | 300 | 3 |
| **Total** | **160,200** | | **~50 MB** |

Combined with Phase 1: ~130 MB total. **Triggers Supabase Pro upgrade decision before Phase 4.**

---

## 7 · Spot-check URLs

After Phase 2 completes, these should all return measured (not extrapolated) data:

- DE: `/de/munich/restaurants`, `/de/berlin/cafes-coffee-shops`, `/de/hamburg/legal-services`
- FR: `/fr/paris/cosmetics-shops`, `/fr/lyon/restaurants`, `/fr/marseille/hotels-lodging`
- IT: `/it/milan/clothing-boutiques`, `/it/rome/cafes-coffee-shops`, `/it/florence/jewelry-stores`
- ES: `/es/barcelona/restaurants`, `/es/madrid/cosmetics-shops`, `/es/valencia/hotels-lodging`
- NL: `/nl/amsterdam/restaurants`, `/nl/rotterdam/cafes-coffee-shops`, `/nl/the-hague/hotels-lodging`

---

## 8 · RAM discipline (critical for France)

The Sirene CSV is 6 GB uncompressed. The pipeline MUST:

```python
# WRONG — loads full 6 GB to memory
df = pandas.read_csv("sirene.csv")

# RIGHT — chunked aggregate
agg = duckdb.connect(":memory:")
agg.execute("SET memory_limit='400MB'")
agg.execute("SET threads=2")
agg.execute("""
    INSERT INTO commune_industry
    SELECT codecommuneetablissement, activitePrincipaleEtablissement,
           tranchEffectifsEtablissement,
           COUNT(*) AS n
    FROM read_csv('sirene.csv', auto_detect=true, sample_size=1000)
    GROUP BY 1, 2, 3
""")
```

This pushes the aggregation INTO DuckDB which spills to disk if memory is exceeded. The Python process stays under 100 MB throughout.

---

## 9 · Implementation sequence

For each of the 5 countries, in this order: NL → ES → IT → DE → FR.

- NL first (smallest, fastest, proves the pattern)
- ES, IT next (medium)
- DE (medium, but Destatis API has more friction)
- FR last (biggest, riskiest, save for when pattern is proven)

---

## 10 · Definition of done

- [ ] All 5 country pipelines runnable end-to-end
- [ ] ≥ 150,000 rows in `regional_cells` with `geo_level = 'municipality'`
- [ ] Top 5 cities per country render with measured data on the website
- [ ] Spot-check URLs in section 7 all return non-extrapolated cells
- [ ] DuckDB peak RAM stays under 512 MB on the Sirene aggregation
- [ ] Per-country resume files exist
- [ ] Summary appended to `19_VERIFICATION_QUALITY.md`
