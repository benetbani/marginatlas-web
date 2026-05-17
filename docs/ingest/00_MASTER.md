# Sub-National Ingest — Master Plan

> Plan v4.0 Phase Q execution. Goal: drive every Margin Atlas cell page
> to the deepest geographic granularity available in each country —
> ideally **city / municipality level**, falling back to district, then
> state/region only when the source data does not exist below that.

---

## 0 · Why this exists

Country-level data is decorative. The user comes for "what does a typical
boutique earn **in Milan**", not "in Italy". The whole product thesis
collapses unless we get below the country line. This plan executes that.

---

## 1 · Strategic objectives (ranked)

| # | Objective | Win condition |
|---|---|---|
| 1 | **Every EU country at NUTS-3 (district)** | 1,346 NUTS-3 regions populated with ≥ 30 SMB industries each |
| 2 | **Every EU country at LAU (municipality)** for the five most-trafficked countries | DE / FR / IT / ES / NL down to municipality level — 60,000+ LAU rows total |
| 3 | **US at county + MSA + ZIP** | 3,143 counties × 40 industries + 384 MSAs + ZIP rollup for top 500 metros |
| 4 | **JP at prefecture + municipality** | 47 prefectures + top 200 municipalities |
| 5 | **KR at si/gun/gu** | 226 sub-metro districts |
| 6 | **CA + AU + NZ at sub-state** | CSDs (CA), SA2s (AU), TAs (NZ) |
| 7 | **Major non-OECD coverage**: BR, MX, AR, CL, CO, IN, CN, ID, TH, VN, MY, PH, AE, SA, ZA, EG, NG, MA, TR, IL | Best-available granularity per country (state / district / city) |
| 8 | **OECD + World Bank overlay** | Cross-validation + bridge fillers for cells with no national source |

Total target: from **~3,800 cells today** (US states only that aren't extrapolated) to **120,000+ measured sub-national cells** at completion.

---

## 2 · Coverage matrix (target)

| Country / Region | NUTS-1 / Federal | NUTS-2 / State | NUTS-3 / District | LAU / City |
|---|---|---|---|---|
| US | n/a | 51 states (live) | 3,143 counties | 384 MSAs + top ZIPs |
| Germany | 16 Länder | 38 Reg.bezirke | 401 Kreise | 10,790 Gemeinden (top 1,000) |
| France | 18 régions | 96 départements | n/a (use dept) | 35,000 communes (top 2,000) |
| Italy | 5 macro | 20 regioni | 107 province | 8,000 comuni (top 1,000) |
| Spain | 7 zonas NUTS-1 | 17 comunidades | 50 provincias | 8,131 municipios (top 1,000) |
| UK | 12 NUTS-1 | 41 NUTS-2 | 179 NUTS-3 | 374 LAD (all) + 7,000+ MSOA (top 500) |
| Netherlands | 4 | 12 provincies | 40 COROP | ~340 gemeenten |
| Belgium | 3 régions | 11 provinces | 44 arrondissementen | 581 communes |
| Sweden | n/a | 8 riksområden | 21 län | 290 kommuner |
| Norway | n/a | 7 landsdeler | 11 fylker | 356 kommuner |
| Denmark | n/a | 5 regioner | 99 kommuner | (same as NUTS-3) |
| Finland | n/a | 5 suuralueet | 19 maakunnat | 309 kunnat |
| Poland | n/a | 17 voivodeships | 73 podregiony | 2,477 gminy (top 200) |
| Austria, Czechia, Portugal, Ireland, Greece, Hungary, Romania, Bulgaria, Croatia, Slovakia, Slovenia, Estonia, Latvia, Lithuania, Luxembourg, Cyprus, Malta | All EU members covered via Eurostat NUTS-2/3 + LAU where source supports |
| Switzerland | 7 grandes régions | 26 cantons | 148 districts | 2,148 communes (top 200) |
| Iceland | n/a | 2 regions | 8 regions | 64 sveitarfélög |
| Japan | n/a | 47 prefectures | n/a | 1,718 municipalities (top 200) |
| South Korea | n/a | 17 metro | 226 si/gun/gu | (same as district) |
| China | n/a | 31 provinces | 333 prefecture cities | top 100 cities |
| India | n/a | 28 states + 8 UTs | 766 districts | top 100 cities |
| Indonesia | n/a | 34 provinces | 514 regencies | top 50 cities |
| Vietnam | n/a | 63 provinces | n/a | top 30 cities |
| Thailand | n/a | 76 provinces + BKK | n/a | top 30 cities |
| Malaysia | n/a | 16 states + FT | 144 districts | top 30 cities |
| Philippines | n/a | 17 regions | 81 provinces | top 30 cities |
| Singapore | 5 regions | n/a | 28 districts | (same) |
| UAE | n/a | 7 emirates | n/a | top 10 cities |
| Saudi Arabia | n/a | 13 provinces | n/a | top 30 cities |
| Israel | n/a | 7 districts | 15 sub-districts | 75 cities |
| Turkey | n/a | 81 provinces | 973 districts | top 100 cities |
| Egypt | n/a | 27 governorates | n/a | top 30 cities |
| Mexico | n/a | 32 states | n/a | 2,469 municipios (top 300) |
| Brazil | 5 regiões | 27 estados | n/a | 5,570 municípios (top 500) |
| Argentina | n/a | 24 provinces | n/a | top 100 partidos |
| Chile | n/a | 16 regiones | n/a | 346 comunas (top 100) |
| Colombia | n/a | 32 departamentos | n/a | 1,103 municipios (top 100) |
| Peru | n/a | 24 regiones | n/a | top 100 distritos |
| Canada | n/a | 13 provinces | 293 CMA | 5,000+ CSD (top 500) |
| Australia | n/a | 8 states | 88 SA4 | 2,310 SA2 (top 300) |
| New Zealand | n/a | 16 regions | 67 TLAs | (same as TLA) |
| South Africa | n/a | 9 provinces | 52 districts | 213 municipalities |
| Nigeria | n/a | 36 states + FCT | n/a | top 30 cities |
| Kenya | n/a | 47 counties | n/a | top 20 cities |
| Morocco | n/a | 12 régions | 75 prov+pref | top 30 cities |

---

## 3 · Common contract

Every pipeline writes to the Supabase `regional_cells` table created by
`scripts/migrations/002_regional_cells.sql`. Each row must conform to:

```
country: ISO-2 (e.g. 'DE', 'FR', 'JP')
geo_id: hierarchical, source-coded (e.g. 'DE-BY', 'DE-BY-09162', 'FR-IDF', 'FR-75056')
geo_level: 'macro' | 'region' | 'state' | 'province' | 'county' | 'district' | 'municipality' | 'city' | 'ward'
geo_name: human-readable display (e.g. 'Bavaria', 'Munich')
industry_id: must match our taxonomy industries.json
year: int
size_band: '1' | '2-9' | '10-49' | '50-249' | '250+' | 'total'
n_enterprises: int | NULL
n_employees: int | NULL
rev_p10..rev_p90: USD-equivalent float | NULL
revenue_per_firm: USD-equivalent float | NULL
payroll_per_employee: USD-equivalent float | NULL
quality_score: 0-100 int
coverage_tier: 'P' | 'S' | 'M' | 'T' | 'X'
coverage_source: generic label only (Plan v3.0 §A lockdown — NEVER name the agency in user-visible text; this column is allowed to hold the agency code for our own use but the QualityBadge component generizes it)
currency: 'USD'
```

---

## 4 · Cross-cutting helpers

Build once, reuse across every pipeline. Live in `scripts/ingest/common/`:

| Helper | Purpose |
|---|---|
| `upload_to_supabase.py` | Batch upsert via PostgREST. Chunks of 500, retry on 503, progress logging |
| `industry_mapper.py` | Source-classification (NACE/SIC/JSIC/KSIC/etc.) → our industry_id |
| `currency_convert.py` | Per-year USD conversion via cached World Bank PA.NUS.FCRF |
| `geo_name_normalize.py` | UTF-8, accent-stripping, slug generation |
| `quality_score.py` | Assigns quality_score from coverage_tier + recency + n_enterprises |
| `pagination.py` | Generic API paginator with rate-limit awareness |
| `dedup.py` | Idempotent upsert key generation |
| `ram_guard.py` | Wraps psutil; aborts batch if RSS > 512 MB |

---

## 5 · RAM discipline (NON-NEGOTIABLE)

The user has flagged previously that this machine cannot afford
high-RAM scripts. Every pipeline MUST:

1. **Stream from source** — never load full source file/API into memory.
   - Use `requests.get(..., stream=True)` and `iter_lines()` or `iter_content()`.
   - For CSV: `pandas.read_csv(..., chunksize=10000)` or pure `csv.reader`.
   - For JSON-stat / large JSON: use `ijson` (incremental parser).
2. **Batch write** — chunks of 500 rows to Supabase, never single inserts.
3. **DuckDB aggregations** — always set `memory_limit='256MB'` and `threads=2`.
4. **Sequential execution** — no parallel pipelines. One country at a time.
5. **Explicit `gc.collect()`** between batches when handling large rows.
6. **`ram_guard.py`** wraps every pipeline's main loop. Trips at 512 MB RSS; logs and aborts the current batch.
7. **No held buffers** — close file handles, requests, DB cursors immediately.

---

## 6 · Execution sequence (recommended order)

Order is chosen for maximum visible value per hour of work, RAM safety,
and dependency ordering (EU NUTS-2 unlocks per-country LAU paths).

| # | Phase doc | Countries | Expected rows | Time estimate |
|---|---|---|---|---|
| 1 | `01_EU_EUROSTAT_NUTS.md` | EU-27 + EFTA-4 (NUTS-1/2/3) | ~6,500 cells × 40 industries = 260,000 | 4 hours |
| 2 | `02_EU_LAU_DEEP.md` | EU LAU via Eurostat + bridges | 60,000 | 6 hours |
| 3 | `03_GERMANY_DESTATIS_KREISE.md` | DE Kreise + Gemeinden | 12,000 | 4 hours |
| 4 | `04_FRANCE_INSEE_COMMUNES.md` | FR communes | 80,000 (top 2k × 40) | 6 hours |
| 5 | `05_ITALY_ISTAT_COMUNI.md` | IT comuni | 40,000 | 4 hours |
| 6 | `06_SPAIN_INE_MUNICIPIOS.md` | ES municipios | 40,000 | 4 hours |
| 7 | `07_UK_ONS_LAD.md` | UK LAD + MSOA | 30,000 | 4 hours |
| 8 | `08_JAPAN_ESTAT_MUNICIPALITIES.md` | JP prefectures + cities | 10,000 | 4 hours |
| 9 | `09_KOREA_KOSIS_SIGUNGU.md` | KR districts | 9,000 | 3 hours |
| 10 | `10_US_CENSUS_COUNTIES_MSA.md` | US counties + MSAs + ZIP | 125,000 | 8 hours |
| 11 | `11_CANADA_STATCAN_CSD.md` | CA CMA + CSD | 12,000 | 4 hours |
| 12 | `12_AUSTRALIA_NZ_ABS.md` | AU SA2 + NZ TLA | 10,000 | 4 hours |
| 13 | `13_INDIA_CHINA.md` | IN districts + CN top cities | 25,000 | 6 hours |
| 14 | `14_SEA_CLUSTER.md` | SG, MY, ID, TH, VN, PH | 8,000 | 4 hours |
| 15 | `15_LATAM_CLUSTER.md` | BR, MX, AR, CL, CO, PE | 35,000 | 5 hours |
| 16 | `16_MENA_AFRICA.md` | UAE, SA, IL, TR, EG, ZA, NG, MA, KE | 8,000 | 4 hours |
| 17 | `17_OECD_WB_OVERLAY.md` | All countries cross-validation | n/a (validation) | 3 hours |
| 18 | `18_CITY_OVERLAY.md` | Global Functional Urban Areas | 5,000 | 3 hours |
| 19 | `19_VERIFICATION_QUALITY.md` | Test plan + coverage gates | n/a | 2 hours |

**Total:** ~770,000+ measured sub-national cells. Total work: ~80 engineering hours over phased weeks.

---

## 7 · Per-phase deliverable checklist

Each phase produces, at completion:

- [ ] `scripts/ingest/{phase}/run.py` runnable end-to-end on a developer laptop in < 1 hour
- [ ] Sample output: first 100 rows committed to `delivery/regional/{phase}_sample.csv`
- [ ] Row count uploaded to `regional_cells` matches expected ± 5%
- [ ] At least 3 spot-check URLs in the website live and rendering with real data
- [ ] Coverage audit script delta showing the new sub-national rows
- [ ] One-paragraph note appended to `docs/ingest/19_VERIFICATION_QUALITY.md`

---

## 8 · Website wiring (already done — verify per phase)

The website code path is already updated to route sub-national geo lookups:

```
getCellBySlug(country, geo, industry)
  → if country === 'US' and geo matches a state slug:
      query cells_master
  → else if exact match in regional_cells (country, geo_id):
      query regional_cells
  → else:
      query extrapolated_cells (country-level fallback)
```

The `cells.ts` data layer is the seam. When each phase lands and rows are
in `regional_cells`, the website automatically serves them with no code
change.

---

## 9 · Pricing on Supabase free tier

The free tier caps at 500 MB storage. We are at ~425 MB today (cells_master
+ extrapolated_cells). New regional rows estimated:

| Phase | Rows | Bytes/row | Estimated size |
|---|---|---|---|
| EU NUTS-2/3 | 50,000 | 300 | 15 MB |
| EU LAU | 60,000 | 300 | 18 MB |
| US counties + MSA + ZIP | 125,000 | 300 | 37 MB |
| All others combined | 300,000 | 300 | 90 MB |
| **TOTAL** | ~535,000 | | **~160 MB** |

585 MB total → **WE WILL EXCEED FREE TIER**. Options:

1. Upgrade Supabase to Pro ($25/mo) — gives 8 GB storage. Recommended.
2. Compress sub-national rows by dropping `total` size_band where size-banded rows exist (~40% saving).
3. Move cold tables (older years, smaller cells) to Cloudflare R2 parquet, lazy-load via DuckDB-WASM client-side. Free but adds complexity.

Recommendation: **Phase 1-3 fit under free tier**. Trigger upgrade decision at Phase 4. Until then, every row counts — strict `audience: smb_core+smb_friendly` filter on uploads, drop `corp_only` industries at upload time.

---

## 10 · Per-phase files

The phase files live in this directory:

- `01_EU_EUROSTAT_NUTS.md`
- `02_EU_LAU_DEEP.md`
- `03_GERMANY_DESTATIS_KREISE.md`
- `04_FRANCE_INSEE_COMMUNES.md`
- `05_ITALY_ISTAT_COMUNI.md`
- `06_SPAIN_INE_MUNICIPIOS.md`
- `07_UK_ONS_LAD.md`
- `08_JAPAN_ESTAT_MUNICIPALITIES.md`
- `09_KOREA_KOSIS_SIGUNGU.md`
- `10_US_CENSUS_COUNTIES_MSA.md`
- `11_CANADA_STATCAN_CSD.md`
- `12_AUSTRALIA_NZ_ABS.md`
- `13_INDIA_CHINA.md`
- `14_SEA_CLUSTER.md`
- `15_LATAM_CLUSTER.md`
- `16_MENA_AFRICA.md`
- `17_OECD_WB_OVERLAY.md`
- `18_CITY_OVERLAY.md`
- `19_VERIFICATION_QUALITY.md`
- `99_EXECUTION_PROMPT.md`  ← paste this back to me to start

---

## 11 · Risks + mitigations

| Risk | Probability | Mitigation |
|---|---|---|
| Source API rate-limits | high | Aggressive backoff; nightly cron not realtime |
| Industry classification drift across countries | high | Per-country crosswalk file in `scripts/ingest/{cc}/industry_map.csv` |
| Currency conversion years missing | low | Cache World Bank FX series at start of run |
| Source data licensing | medium | All sources listed are public/free for non-commercial; revisit at commercial scale |
| Supabase storage cap | high | Plan upgrade at $25/mo before Phase 4 |
| Process crash mid-batch | medium | Idempotent upserts (PK conflict OK); resume from `last_uploaded_offset` file |
| Founder OOM | high | RAM guard at 512 MB RSS, sequential execution, no parallelism |

---

## 12 · Definition of done (whole plan)

- [ ] 19 phase docs implemented
- [ ] `regional_cells` table populated with ≥ 500,000 measured rows
- [ ] All 45+ priority countries have at least province/state-level coverage
- [ ] 15 countries have municipality/city-level coverage for SMB industries
- [ ] Website renders city-level URLs (e.g. `/it/milan/restaurants`, `/de/munich/cafes`, `/fr/lyon/clothing-stores`) with real measured data
- [ ] Featured cell tiles on home upgraded to point at city-level URLs
- [ ] Coverage audit report shows ≥ 80% of (country × top-40 SMB industry) cells have measured (not extrapolated) data
- [ ] At least one city-level cell per country featured in the "Cell of the week" rotation
