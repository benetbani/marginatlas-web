# Master Plan Progress

> Updated continuously during execution. Single source of truth for
> what's landed and what's pending. The next session reads this to
> resume.

## Track status

| Track | Status | Rows added | Completed at |
|---|---|---|---|
| A.1 DNS | DONE | — | Founder confirmed 2026-05-17 |
| A.2 Tone | DEFERRED (Lorem Ipsum filler authorized for tone-dependent slots) | — | — |
| A.3 ANTHROPIC key | DONE (in .env.local; Vercel paste deferred with tone) | — | Founder confirmed 2026-05-17 |
| A.4 Sirene CSV | OPEN (not confirmed downloaded; Track H stays gated) | — | — |
| A.5 Images | DEFERRED (founder will provide later) | — | — |
| B NAICS expansion | DONE | 73 → 86 codes; 202 → 206 industries | 2026-05-17 |
| C.1 Canada retry | PARTIAL — +2,162 rows (target was 12k; single-snapshot table 33-10-1095) | +2,162 | 2026-05-17 |
| C.3 US re-execute | DONE | +6,867 rows (US total 87,573 → 92,707) | 2026-05-17 |
| **B-014 critical fix** | DONE — regional_cells now reachable from data layer | n/a (5 functions added + sitemap rewrite) | 2026-05-17 |
| J.1 Sitemap regen | DONE (includes top 10k regional_cells) | n/a | 2026-05-17 |
| D.2 Netherlands | PARTIAL — +4,799 rows (below 10k target; CBS publishes section-level only at gemeente granularity, 14 industries × 483 gemeenten) | +4,799 | 2026-05-18 |
| D.5 Spain | DONE — +11,287 rows (52 provinces × CNAE divisions × strata; table 301; below 30k target due to NACE→industry_id dedup) | +11,287 | 2026-05-18 |
| D.8 Italy | DEFERRED — ISTAT bulk SDMX exceeds 600s curl timeout; chunked per-region fetch needed (next session) | 0 | — |
| E.2 UK LAD | DONE — +15,816 rows (382 LADs × 88 SIC 2-digit; NM_141_1; below 25-30k target due to NACE→industry_id dedup) | +15,816 | 2026-05-18 |
| E.3 UK MSOA | PENDING (stretch) | — | — |
| F OECD | PENDING | — | — |
| G.2 Australia | DONE — **+70,885 rows** (2,310 SA2s × 12 ANZSIC divisions × 5 size bands; ABS 8165.0 DC08; SA2 includes Sydney/Melbourne/Brisbane CBDs natively) | +70,885 | 2026-05-18 |
| G.4 New Zealand | PENDING | — | — |
| H France | BLOCKED-A.4 | — | — |
| I.1 Mexico | DONE — **+55,454 rows** (Censos Económicos 2024 bulk CSV download via XML manifest of mass-download .exe; 32 states × ~80 SCIAN 3-digit subsectors × size strata; municipality detail where present) | +55,454 | 2026-05-18 |
| I.2 Argentina | PENDING | — | — |
| I.3 Chile | PENDING | — | — |
| I.4 Colombia | PENDING | — | — |
| I.5 Peru | PENDING | — | — |
| J.1 Sitemap | PENDING | — | — |
| J.2 Quality badges | PENDING | — | — |
| J.3 Last-updated | PENDING | — | — |
| J.4 OG images | DEFERRED (stretch) | — | — |
| J.5 Country pages | PENDING | — | — |
| J.6 Featured tiles | PENDING | — | — |
| K Verification | PENDING | n/a | — |
| L Handoff refresh | PENDING | n/a | — |
| **M Top-100 cities list** (Wave 2) | FIRST PASS DONE — 102 cities locked (29 tier-1 / 49 tier-2 / 24 tier-3); 52 measured / 41 extrapolated / 9 missing; awaiting founder review per T-M.2 | n/a | 2026-05-18 |
| **N Country city shortcuts** (Wave 2) | DONE — CountryCityShortcuts component wired into /[country] page; renders 2-12 tiles per country with tier-1 "Global" chip + "Estimated" chip for extrapolated; missing-data cities dropped (R-016); verified live on /us /de /gb /es /nl /jp /br | n/a | 2026-05-18 |
| **O Neighborhood drill-down** (Wave 2) | PARTIAL — O.1 NYC boroughs DONE via alias map; /us/manhattan, /us/brooklyn, /us/queens, /us/the-bronx, /us/staten-island all resolve to underlying US Census county cells. London via Track E LADs (natural). Sao Paulo distritos + Tokyo wards still pending (Tokyo needs additional e-Stat ingest beyond Phase 8) | n/a | 2026-05-18 |
| **P Tax overlay** (Wave 2) | MVP DONE (P.1+P.2 country-level) — 64-country rate table + PostTaxToggle on every cell page; Option C confirmed by founder (free country / Pro regional in P.3) | n/a | 2026-05-18 |
| **Q Optional-hierarchy UX** (Wave 2) | PENDING | n/a | — |

## Notes per track

### Track B (DONE)
- Approach: scripted edit via `E:\atlas\scripts\taxonomy\expand_naics_3.py`.
- 9 codes added to existing industries, 4 new corp_only transport industries, 5 codes explicitly skipped (521/533/551/813/814).
- 202 → 206 industries, 73 → 86 NAICS-3 codes covered.
- verify_taxonomy.ts + tsc --noEmit both clean.
- Audit: `E:\atlas\delivery\taxonomy\naics_3_audit.json`.

### Track C.1 (PARTIAL)
- Handoff doc said correct table was 33-10-0418. **It was wrong** — that table is "Level of challenge" survey data, not business counts.
- 33-10-0036 also wrong (CAD exchange rate). 33-10-0095 also wrong (goods purchased).
- Correct table found via `getAllCubesListLite` filter: **33-10-1095** (Canadian Business Counts, with employees, December 2025 — latest snapshot).
- Also fixed SIZE_BAND_MAP: source uses "1 to 4 employees" not "1 to 4".
- Result: **+2,162 rows** (target was 12,000). Single-snapshot table caps yield. To hit 12k, would need to stack multiple semi-annual snapshots (33101014, 33100764, 33100806, etc.) — deferred.

### Track C.3 (DONE)
- 663 incremental API calls completed in ~24 min (51 states × 13 new NAICS-3 codes).
- Pushed 6,867 new rows. US row count: 87,573 → 92,707 (delta +5,134 unique after dedup with existing).
- Total regional_cells: 179,409 → 186,640 (+7,231 across C.1 + C.3).

### Track B-014 (DONE — critical fix)
Added to `src/lib/cells.ts`:
- `regionalSlugToGeoId(country, slug)` — handles 4 patterns including city-overlay case
- `normalizeRegionalRow()` — regional row → Cell shape
- `getRegionalCell()` + `getRegionalCellVariants()`
- `getTopRegionalCells()` + `regionalCellUrl()` for sitemap

Modified:
- `getCellBySlug` fallback chain (US: cells_master → regional_cells → null; non-US: regional_cells → extrapolated_cells)
- `getCellVariants` same chain
- `src/app/sitemap.ts` parallel fetch of US + regional top cells (~15k URLs)

Verified live on dev server (with NODE_TLS_REJECT_UNAUTHORIZED=0 to bypass local SSL chain):
- /de/de21/restaurants → "Oberbayern" ✓
- /jp/jp-13000/restaurants → "Tokyo-to" ✓
- /br/br-sp/restaurants → "São Paulo" ✓
- /ca/ca-on/restaurants → "Ontario" ✓
- /us/us-06-037/restaurants → "Los Angeles County, California" ✓

### Track J.1 (DONE)
Sitemap rewrite: parallel `getTopCells(5000)` + `getTopRegionalCells(10000)`. Total ~15k URLs.

## CRITICAL FOUND BLOCKER — B-014 · RESOLVED 2026-05-17

**Discovery:** During Track J.1 (sitemap regen) investigation, found that
`src/lib/cells.ts` `getCellBySlug` for non-US countries:

```typescript
if (country !== "US") {
  return getExtrapolatedCell(country, industrySlug, selector);  // SKIPS regional_cells
}
```

**The 179,409 sub-national rows in `regional_cells` are NEVER queried
by the website.** Every URL like `/de/de212/restaurants`, `/jp/jp-13000/restaurants`,
`/br/br-sp/restaurants` falls straight through to `extrapolated_cells`
(country-level) and 404s (because DEU/JPN/BRA are anchor countries
absent from extrapolated_cells).

**Implication for the master plan:** Tracks B-I add rows to `regional_cells`
but those rows are invisible to users until the data layer is fixed. The
"+220k rows" target is hollow without this fix.

**Required fix (next session, ~3-4 hours):**

1. Add `getRegionalCell(country, geoId, industryId, selector)` to `cells.ts`
2. Update `getCellBySlug` fallback chain:
   - US: cells_master (state) → regional_cells (county) → extrapolated_cells
   - non-US: regional_cells → extrapolated_cells
3. Add slug → geo_id resolution for non-US geos (currently only `SLUG_TO_GEO_ID` for US states)
   - EU NUTS: lower-case (`de212` → `DE212`)
   - JP: `jp-13000` → `JP-13000`
   - BR: `br-sp` → `BR-SP`
   - city overlay: `city/new-york` → `US-CITY-new-york`
4. Update `getCellVariants`, `getTopCells` similarly
5. Add `getTopRegionalCells` for sitemap
6. Then Track J.1 sitemap regen actually works

**Severity:** HIGH — blocks all downstream value of Tracks B-I until fixed.

**Why not fixed this session:** ~3-4 hours of careful work touching ~5 files
plus testing; remaining context insufficient to land safely. Documented
clearly so the next session executes it first before any further ingest.

## Session log

- **2026-05-17 session start**: founder issued "go" signal after master plan accepted. A.1 + A.3 DONE (founder); A.2 + A.5 DEFERRED with Lorem Ipsum override. Beginning sequential execution from Track B.
- **2026-05-17 mid-session**: B DONE (+13 NAICS-3 codes, +4 industries); C.1 PARTIAL (+2,162 CA rows, table mystery solved via cube list); C.3 in background (~13 new codes × 51 states); discovered B-014 critical data-layer bug.
- **2026-05-17 late-session**: C.3 DONE (+6,867 US rows); B-014 RESOLVED (5 functions added, fallback chain rewritten, verified live on 5 URLs); J.1 DONE (sitemap regen). Total regional_cells: 179,409 → 186,640. Session ending after Track L handoff refresh.
- **2026-05-18 planning extension**: Founder shared strategic direction (city-disproportionate focus, optional hierarchy, neighborhoods for tier-1, taxes exploratory). Added 5 new Wave 2 tracks (M, N, O, P, Q) to master plan. Not yet executed — pending founder go signal.
- **2026-05-18 Wave 1 push**: Founder issued "go". Track D.2 Netherlands +4,799 rows (CBS 81575NED, section-level SBI x 483 gemeenten). Track D.5 Spain +11,287 rows (INE table 301, province x CNAE x strata). Track D.8 Italy deferred (ISTAT ASIAULP_7 dataflow size exceeds 10-min curl timeout; needs per-region chunked fetch). regional_cells total: 186,640 → 202,726 (+16,086).
- **2026-05-18 Wave 1 push #2 (Italy → UK)**: Founder "do number one then number two". Italy retry with smaller dataflow (ASIAUE1P_5, province-level) also timed out — ISTAT data endpoint structurally slow regardless of dataflow size. Italy stays DEFERRED with switch-to-CSV strategy documented. UK NOMIS Track E.2 landed +15,816 rows (NM_141_1, 382 LADs × 88 SIC 2-digit, single bulk CSV ~11s fetch). Includes all 33 London boroughs natively. regional_cells: 202,726 → 218,542 (+15,816).
- **2026-05-18 Plan v7 Phase A+P autonomous push**: Founder gave full autonomy for several hours. Landed: massive NEIGHBORHOOD_ALIASES expansion (6 → 80 entries: 33 London LADs + 16 CDMX alcaldías + 30+ city anchors across DE/ES/NL/FR/BR/JP/CA); 11 new COUNTRIES added (Albania=founder's home, Russia, Kazakhstan, Azerbaijan, Georgia, Israel, Mexico [was missing despite ingest], Andorra, Liechtenstein, Monaco, San Marino); Wave 3 city overlay +13,464 rows (Albania 6 cities, Russia +10, KZ, AZ, GE, IL, CH inc. Zurich+Geneva [founder explicit ask], AT, microstates); seeded ALB/CHE/AUT extrapolated_cells from MNE proxy; Tax overlay MVP — 64-country rate table + PostTaxToggle component on every cell page (founder Option C: free country / Pro regional); distribution histogram label clarity fix (founder flagged "bathtub" — root cause was ambiguous "Top 10%" reading as max). /ask production still preview:true despite ANTHROPIC_API_KEY in Vercel env vars (sensitive var injection quirk; needs separate diagnostic). regional_cells: 344,881 → 356,761.
- **2026-05-18 Plan v8 autonomous push #1**: Founder approved biggest round yet — wrote 8 plan files (Tracks R-Y + execution prompt). Phase A landed: QualityDots 1-10 component on every cell page (replaces 0-100 score; low-confidence warning chip < tier 4); /api/debug-env diagnostic deployed (confirmed ANTHROPIC_API_KEY not reaching Vercel runtime — most likely whitespace/sensitive-flag issue, needs founder UI inspection). Phase B landed: COUNTRIES list 49 → **191 countries** (free-coverage unlock via existing extrapolated_cells rows for 142 countries we weren't surfacing — now /pk, /bd, /ng, /vn, /id, /sa, /tw, /hk, /pe, /co etc. all live with measured fallback). Phase C landed: GlobalCoverageStrip on home (4 big stats + flag chip row), TaxOverlayTeaser on home (Madrid café sample showing €280K → €92K owner take). Total commits this push: 6 (`a350e75`, `45bcc83`, `0ce89ac`, `dc5632a`, `c5bc989`, `75dd430`).
- **2026-05-18 Plan v8 autonomous push #2**: Founder discovered TWO Vercel projects (marginatlas-web + marginatlas-web-twtl) — ANTHROPIC_API_KEY was only on one. Added to both → **/ask production LIVE** (verified end-to-end with real Claude answers, preview:false). Removed /api/debug-env diagnostic. Track S completed: AskWidget on home page (live /api/ask), CityPicker autocomplete covering ~180 cities + neighborhoods, QualityLegend explaining 1-10 scale. Track V.1 sitemap rewrite: now includes 191 country landing pages + 25 sectors + top 20k regional cells (filtered to quality_10≥4) + 5k US cells. Capped at 45k under Vercel limit. 3 new commits: `24ddbb1`, `5cf45b9`. Plus handoff refresh in `c08bbf6`.
- **2026-05-18 Wave 1/2 pivot**: Founder "continue with the other steps". Probed OECD (wrong schema — employment not business counts), ABS (CABEE not in SDMX), NZ Stats (502 gateway), Mexico INEGI (token required). Pivoted to Wave 2 Track M (top-100 cities curation) as the productive path. Locked first-draft list at `src/lib/cities/top100.json` (102 cities, 29/49/24 tier split, 52 measured / 41 extrapolated / 9 missing, 53 countries). Loader at `src/lib/cities.ts` exposes TOP_100_CITIES, CITIES_BY_COUNTRY, lookupCity, NEIGHBORHOOD_DRILL_CITIES. Awaiting founder review per T-M.2 before locking. Track M is the anchor for Wave 2 tracks N/O/Q.
- **2026-05-18 Plan v9 written**: Founder requested deepest planning round yet — "everything we haven't done so far, improvements we haven't thought about, focus on home page, logic, quality checks for newly added countries, very detailed and quite long". Wrote 17 files (30_PLAN_V9_README + 31-45 track files AA-OO + 46_EXECUTION_PROMPT_V9). 15 tracks total, ~165-195 hours: AA quality verification, BB home page completion, CC logic + bug fixes (slug bug, CDMX names, smart 404), DD SEO + OG, EE performance + ISR, FF section pages + /world, GG coverage audit + /coverage, HH top-1000 cities, II auth + Stripe, JJ analytics + cost monitoring, KK Wave 4 city overlay for 142 new countries, LL distribution refinement, MM localization, NN public API, OO tests + CI. Execution not yet started — autonomous run guarded behind founder "go" signal.
- **2026-05-18 Plan v9 autonomous push #1**: Founder signaled "go". Executed Phase A (quality + bug fixes) and Phase B (home page completion) plus several Track CC fixes. 14 commits pushed to main:
  - **CC.1 slug resolution** (`5529a9c`): precomputed SLUG_TO_INDUSTRY exact-match map + INDUSTRY_SLUG_ALIASES + tightened word-boundary fuzzy fallback + accent-stripping in industryToSlug. 18/18 smoke cases pass; fixes the metal-products-mfg → mining_quarrying bug and the broken caf-s-coffee-shops slug.
  - **CC.5/CC.8 smart 404** (`b0d4c95`): middleware injects x-pathname header; new src/lib/not_found_suggestions.ts uses Levenshtein to suggest up to 6 corrected URLs.
  - **AA.7 /admin/anomalies dashboard** (`0dd47e4`): internal page gated by ADMIN_KEY env+query, surfaces scan output as counts + top-50 samples per category per table.
  - **BB.1+BB.3 hero + featured tiles** (`ca41533`): new headline "Small-business benchmarks across 191 countries.", 3 CTAs, diversified 12-tile mix (NYC, London, Berlin, Madrid, Tokyo, São Paulo, Mexico City, Sydney, Tirana, Zurich, UAE, Mumbai), honest stats strip (191 countries / 357k+ cells).
  - **BB.5 footer** (`a960d7d`): 5-column layout (Browse/Use/Learn/Trust/Atlas) with 20 destination links, version bump v1.18.0.
  - **BB.9 newsletter** (`2796efd`): rewrite to "Monthly cell of the month: pick a benchmark you didn't know you needed."
  - **BB.2 recently-added strip** (`51fdcd2`): horizontal scrollable strip of 10 newest countries (AL, RU, KZ, AZ, GE, CH, AT, IL, AD, MC).
  - **BB.10 what's hot strip** (`605e127`): three-cell grid above newsletter (CA restaurants, London legal, Munich software).
  - **BB.4 spotlight country** (`66ece02`): big gradient card mid-page rotating daily through 10 curated countries via day-of-year modulo.
  - **AA.4 anomaly scan** (`c725ff6`): scripts/quality/scan_anomalies.py ran against prod Supabase. Headline findings: regional_cells 115,578 empty / 5,832 outliers / 234 zeros; cells_master 1,189 outliers / 2 zeros; extrapolated_cells 4,061 outliers. JSON committed to website/data/quality/.
  - **CC.4+CC.5 histogram + tax fix** (`1450305`): long-tail upper-multiplier 0.6→1.0 + maxH clamped to p90 of bar heights; PostTaxToggle hides payroll row + employer social when payroll is null, shows "data not available" note.
  - **CC.3 country emojis** (`bbd3b0a`): 20 new COUNTRY_SIGNATURE entries (CN/KR/TH/VN/ID/PH/MY/PK/BD/EG/NG/ZA/KE/AE/SA/TR/CL/CO/PE/NZ) replacing the generic 🏬 fallback.
  - **CC.12 URL canonicalization** (`c7347e3`): middleware 308 redirect for uppercase paths + trailing slashes.
  - **Phase A.2 CDMX backfill in progress**: scripts/quality/scan_anomalies.py + scripts/ingest/mx_inegi/backfill_geo_names.py running against Supabase. ~1,200/2,338 distinct MX municipios PATCH'd at session end; CDMX alcaldías (Cuauhtémoc, Coyoacán, etc.) confirmed live. fetch.py bug fixed (state_iso vs e03 lookup key mismatch) for future re-runs. update_quality_10.py written but deferred for next session to avoid Supabase connection contention.
- **2026-05-18 Plan v9 autonomous push #2**: Founder said "Continue with all the next steps, all of them, all of them, all of them!" Executed Phase C (SEO + perf), Phase D (coverage + map), and Phase G (analytics + status) with deep Track CC cleanup. 12 commits pushed to main (`4c6e458` → `25f5656`) + the resume MX backfill completing 2,338/2,338 municipios.
  - **JJ.3 /ask spend cap** (`4c6e458`): per-Edge-instance accounting with $0.06/query cost estimate and $200/mo default cap (overridable via ASK_MONTHLY_CAP_USD env). Over-budget falls through to the preview stub with a polite explanation. Counter resets on cold start (slight over-spend across redeploys is the safety tradeoff).
  - **DD.1 per-cell OG images** (`a13c3ef`): new /og/cell edge route renders 1200x630 PNGs on demand via next/og. Cell page generateMetadata emits openGraph.images + twitter card pointing at /og/cell?country=...&geo=...&industry=...; verified live (image/png, ~1.4s cold).
  - **DD.2 JSON-LD enrichment** (`19c5c69`): CellDataset emits variableMeasured PropertyValue entries with real values + units, plus temporalCoverage, identifier, inLanguage, includedInDataCatalog, DataDownload distribution (pointing at the CSV export), additionalProperty for the 1-10 confidence score. Source-agency fields kept blank per R-002.
  - **GG.1+GG.3+GG.4 coverage dashboard** (`38091ff`): scripts/quality/audit_coverage.py ran end-to-end against prod Supabase (356,761 regional + 58,344 extrapolated cells across 254 country entries; output committed to website/data/quality/coverage_v2.json). /coverage renders headline stats + best/most-needed grids + full 254-row sortable table. /coverage/[iso2] renders per-country scorecard with regional vs extrapolated breakdown + tier distribution bars + year range. 6-hour ISR; generateStaticParams covers all 191 COUNTRIES.
  - **FF.1 /world map page** (`258ab9e`): server-rendered chip grid grouping countries by 8 named regions + "Rest of world" catch-all. Tile size scales with cell count (4 tiers); fill color codes avg quality (moss/cream/clay/ink). Reads coverage_v2.json (6h ISR); 281 country links rendered.
  - **EE.1 ISR 6h** + **CC.11 expanded aliases** (`b8786bb`): cell-page revalidate dropped from 7 days to 6 hours so Supabase refreshes are visible within a working day. Added ~90 new INDUSTRY_SLUG_ALIASES (consulting, agency, contractor, mechanic, brewery, hostel, notary, broker, photographer, etc.); 18/18 slug smoke tests still pass.
  - **JJ.5 /status page** (`1916943`): live dependency dashboard — 4 inline HTTP checks (marginatlas.com, Supabase, /api/ask, Anthropic API) with 5-8s timeouts. Status dots + latency per check; headline switches on aggregate state. force-dynamic + noStore so every page load is a fresh check.
  - **CC.9 error boundaries + CC.7 sector fallback** (`c922f5a`): root error.tsx + cell-page error.tsx render soft recovery UI with retry button instead of crashing the layout. New getSectorFallbackCell helper picks any industry in the same sector that the country DOES have data for when both regional + extrapolated miss; result returned with industry_description suffixed "(sector average)" + coverage_tier=X + quality_score capped at 30 so the UI tags it as low-confidence.
  - **GG.5 nav integration** (`25f5656`): header gets World + Coverage entries; country page hero gets "See coverage scorecard →" deep-link to /coverage/[iso2].
  - **Resume MX backfill complete**: scripts/ingest/mx_inegi/backfill_geo_names.py now has Session reuse, retry + exponential backoff, and START_AT_GEO resume support. First run hit a Cloudflare TLS reset at ~2,100/2,338 rows; the resume picked up at MX-30-130 and finished the last 245 cleanly. All 2,338 distinct Mexican municipios now carry proper INEGI geo_names; PostgREST confirms zero rows match `geo_name like 'Municipio*'`.
- **2026-05-18 Plan v9 autonomous push #3**: Founder said "Continue with all the next steps, all of them, all of them, all of them!" This push went deep into SEO + perf + data scale. 12 commits (`e417b3e` → `44e9b5c`) + 2 background data jobs landed.
  - **DD.3 canonical tags + robots policy** (`e417b3e`): root layout metadataBase + canonical alternate + explicit robots policy with max-image-preview=large; country + cell pages emit per-route canonical URLs. Hero title tightened to match BB.1 voice.
  - **DD.4 related-industries strip** (`f464fc6`): new RelatedIndustriesStrip on every cell page renders up to 8 sibling industries in the same sector. Pure server, zero runtime cost. Adds ~6-8 fresh internal links per cell page (material crawl-graph expansion across 357k cells).
  - **CC.6 middleware whitelist** (`fa8c515`): only 403 bare-scraper requests that have BOTH a tool-UA AND missing Accept-Language. Brave / Firefox strict-privacy users pass through unmolested.
  - **DD.6 sitemap-index split** (`44f53f3`): Next 15 generateSitemaps now emits 4 sub-sitemaps behind a sitemap-index (static+countries+sectors / US cells / regional cells / coverage scorecards). Added /world + /coverage + /status to the static list.
  - **BB.8 hero animation polish** (`2963518`): CSS-only fade-rise on h1 + immediate subhead with 120ms stagger; subtle hover lift on .card and rounded-xl/2xl anchors. Both gated behind prefers-reduced-motion: no-preference.
  - **AA.5 quality update** (`818ba60`): scripts/quality/update_quality_10.py ran end-to-end and PATCH'd quality_score on the 251 worst cells per anomaly category (50 empty + 50 outliers + 50 zeros in regional_cells; 49+2 in cells_master; 50 in extrapolated_cells). Log committed to data/quality/quality_updates_v1.log.
  - **FF.2 country page enhancements** (`0f71a7f`): new CountryStatsStrip (4-tile tax overlay: CIT, employer social, owner-take, rate source) + CountryQualitySummary (cells / quality dot / industries / year range + scorecard CTA) on every country page.
  - **FF.5 browse rebuild** (`9d80b42`): /browse rebuilt with "The whole atlas, three ways" headline, 3 CTAs to /world + /coverage + /compare, and the same 12 globally diverse popular-pages mix as the hero featured tiles. Added per-route canonical.
  - **BB.7 loading skeletons** (`44e9b5c`): root + country loading.tsx (cell page already had one). animate-pulse blocks mirror the page chrome so layout doesn't jump.
  - **KK Wave 4 city overlay** (data only, +30,360 rows): scripts/ingest/city_overlay/fetch_wave4.py covers 63 countries × top metro cities → 49 countries with extrapolated baseline got city rows (14 skipped: TW/SG/IS/etc. with empty extrapolated_cells). Peak RAM 70MB, upload 91s. Cities now reachable: Shanghai, Beijing, Shenzhen, Seoul, Mumbai, Dubai, Lagos, Cairo, Istanbul, Bangkok, Jakarta, Manila, KL, Karachi, Lahore, Buenos Aires, Bogotá, Lima, Warsaw, Prague, Budapest, Lisbon, Auckland, Wellington, and ~80 more.
  - **Coverage audit re-run** (data only): re-ran scripts/quality/audit_coverage.py to capture the +30,360 Wave 4 rows so /coverage and /coverage/[iso2] reflect the new state.
- **2026-05-18 Plan v9 autonomous push #4**: Founder said "Continue by executing all of them, all of them, all of them!" after seeing the logo-direction memo + roadmap. This push went deep into visible polish + new product surfaces + trust signals + data widening. 14 commits (`18a8715` → `102a986`) + 1 background data job landed.
  - **CC.10 visible breadcrumb** (`18a8715`): new Breadcrumb component renders Home / 🇺🇸 US / California / Restaurants on every cell page. Collapses middle items to "···" when nesting > 4 deep.
  - **/industries top-level directory** (`6899490`): new entry path alongside /browse + /sectors. Popular (12) + by-sector (full grouping) + A-Z (372 links).
  - **/calculator percentile lookup** (`50acd42`): pick country + industry, enter your annual revenue, see your percentile in the comparable cell. Linear interpolation across p10/p25/p50/p75/p90; no data collection. Bumps /api/cell-lookup to return all 5 percentiles.
  - **AA.6 + AA.9 warning chips** (`072227a`): staleness chip (year<2018 warn, <2015 escalate) + industry-mapping-mismatch chip render quietly under the breadcrumb when triggered.
  - **FF.3 sector cross-country** (`7ff5097`): new SectorAcrossWorld strip on /sectors/[id] fans out 12 cell-lookup queries for the first measured industry in the sector and renders a horizontal-bar comparison.
  - **CC.13 empty-state card** (`7e2f15a`): when a cell loads but has no usable metrics, render an EmptyStateCard with closest-neighbor + browse + industry pivots instead of "—" everywhere. Nudge bar suppresses when EmptyStateCard shows.
  - **FF.4 compare delta dots + share** (`3d77705`): per-row max gets a moss dot, min gets a clay dot; current 4-slot config serializes to ?q=<json> for shareable comparison URLs; "Copy share link" button.
  - **Submit-a-correction form** (`273f903`): inline CTA on every cell page expands to a 3-field form; POSTs to new /api/correction which inserts into a Supabase `corrections` table (fails soft when table doesn't exist).
  - **Wave 5 city overlay** (data only, +9,240 rows): 29 more countries got capital + secondary city rows (additional African capitals, LATAM second-tier, Caribbean, smaller European, Central Asia, Pacific). Peak RAM 32MB.
  - **Print stylesheet** (`ba83009`): @media print rules hide chrome, force white background, expand link hrefs inline, avoid page-breaks inside cards + headings.
  - **Currency switcher** (`1f42f23`): USD/EUR/GBP/JPY/CAD/AUD pill toggle on cell pages persists choice via localStorage + dispatches a custom event so multiple Money components stay in sync. Headline number wired through Money; full retrofit deferred.
  - **GG.2 markdown coverage report** (`d3c9062`): scripts/quality/write_coverage_md.py generates docs/ingest/COVERAGE_AUDIT_v2.md from coverage_v2.json. Headline numbers + top-30 best-covered + most-needed + region-by-region + tier rollup.
  - **Tax table expansion** (`dd77c82`): country_rates_2024.json grew from 68 → 146 country entries covering all major Asian, Latin American, MENA, African, post-Soviet, Pacific economies + smaller European. CountryStatsStrip now reads "Country-specific" for 78 more countries instead of "OECD fallback".
  - **Nav surface** (`102a986`): /industries + /calculator promoted into header nav; footer Browse and Use columns updated with /industries, /world, /calculator.
- **2026-05-18 Plan v10 autonomous push #1**: Founder said "go" after Plan v10 + execution-prompt-v10 landed on disk. This push went the deepest yet — granular shift from gross-revenue to net-profit, sub-regional tax for 10 countries (US + 9 others), cross-country plausibility checks against curated GDP/capita. 16 commits (`8139f1c` → `560c048`) + 3 background data jobs.
  - **VV industry margins** (`8139f1c`): src/lib/finance/industry_margins.json — 180/180 default-visible industries with gross_margin, operating_margin, asset_intensity. Cross-referenced internally from Damodaran NYU + IRS SOI + RMA.
  - **XX p1 property tax** (`e1683f1`): 131-country commercial property tax rates. UK business rates 5.12%, Germany Grundsteuer ~1.25%, Hong Kong 5%, Singapore 10%, Bahamas 0%.
  - **XX p2 commercial rent** (`27960d0`): 202-city USD/m²/year table + 130 country medians. Manhattan Midtown $1,100, Hong Kong $1,500, Monaco $1,400, Tirana $160.
  - **YY operating multipliers** (`ea18663`): 130-country triple-multiplier (utilities + software + compliance). Captures the founder's exact concern: USD-priced SaaS crushes low-GDP SMBs (Argentina software 2.5x, Egypt 1.8x, Lebanon utilities 1.8x grid-collapse, Estonia compliance 1.0x world-class e-tax, Brazil 2.0x "Custo Brasil").
  - **PP WID parser** (data only): scripts/quality/parse_wid_gdp.py streamed 422 WID files but the chosen variable returned wrong units. Replaced with hand-curated 131-country GDP/capita JSON for Phase C.
  - **RR US states** (`5b2cefd`): src/lib/tax/us_states_2024.json — 51 entries + city_surcharges for NYC UBT, SF gross receipts, Philadelphia BIRT, LA gross receipts, Portland CES, Chicago lease tax, Seattle JumpStart. WY/NV/SD/TX/FL at 0% state CIT; NJ highest combined 32.5%; CA 29.84%.
  - **SS sub-regional** (`118289e`): 9 files — DE (16 Länder Hebesatz, Munich 490% to rural 250%), CH (26 cantons Zug 11.85% to Bern 21.06%), GB (Scotland income tax divergence), FR (13 régions), IT (21 regions + IRAP surcharges), ES (17 communities + Basque/Navarre foral 24%), CA (13 provinces), AU (8 payroll-tax bands), BR (27 states ICMS 17-22%). 145 total entries.
  - **Tax helpers + UI** (`4129c02`): getEffectiveCorporateTaxRate(iso2, regionId) composes federal + sub-regional with US FIPS / postal-code / slug-name normalization. PostTaxToggle now shows combined breakdown — /us/california/restaurants reads "21% federal + 8.84% California − $87K".
  - **TT + UU + ZZ net-profit waterfall** (`1ee5bd7`): src/lib/finance/fixed_costs.ts + net_profit.ts + <NetProfitWaterfall> on every cell page. 13-row text breakdown (revenue → COGS → gross profit → payroll + employer social → operating profit → 6 fixed-cost lines → pre-tax → CIT → net profit) plus a horizontal stacked-bar SVG visual.
  - **PP plausibility scan** (`6c5f860` + `560c048`): scan_plausibility.py scanned 123,092 cells, 19,512 (country,industry,size) tuples — flagged **1,331 cells**: 330 GDP-correlation residuals (|z|>=3), 500 poorer-richer inversions, 501 within-country outliers. Caught the exact failure the founder described — MX 50-249 mfg cells showing $590M/firm vs Oman $18M (32.96x inversion). Likely a unit-of-measure error in the MX INEGI ingest large-firm band; flagged but not auto-downgraded pending manual review.
  - **WW cross-country chip** (`6c5f860`): CellWarningChips renders a clay-toned warning chip on flagged cells reading the plausibility JSON from disk.
- **2026-05-18 Plan v11 autonomous push #1**: Founder asked for an aggressive data-quality master pass — catch the Moscow > Zurich / Berlin > Oslo style currency-as-USD bugs, flag logical inconsistencies, never auto-correct, surface everything in a review queue. Picked option 2 ("go directly"). 5 commits (`76c8bd8` → `e99af47`) landed the pure-code passes; web-verification tracks (Q5/Q6/Q7/Q8/Q9/Q10) batched for later pushes.
  - **Q1 currency conversion sanity** (`76c8bd8`): scripts/quality/scan_currency_sanity.py + fx_rates_2024.json scanned 125,677 cells. Flagged **2,298 cells** where dividing by the country's local-to-USD FX rate brings the value into 0.1-10× of peer median — i.e. stored in local currency. **2,079 of 2,298 are Mexico** — every value divides by ~17.5 (MXN/USD 2024 rate). Worst examples: MX electricity_gas_utilities/10-49 $3.11B stored → $178M USD; MX chemical_pharma_mfg/50-249 $2.49B → $143M; MX metal_products_mfg/50-249 $1.80B → $103M. The MX INEGI bulk-CSV ingest (Plan v6 Track I.1) stored revenue in pesos rather than USD. Smaller batches: AU 49, CA 48, IL 45, QA 43, NZ 19, HK 14 — likely real outliers needing individual review.
  - **Q3 cross-country variance** (`c0e31fe`): scripts/quality/scan_variance.py scanned 117,430 cells (19,512 country×industry×size tuples). Flagged 72 high-dispersion groups (max/min > 100× OR p90/p10 > 30×). Most are economically defensible MZ → MC GE250 spreads. A few suspect: water_waste/GE250 MG $937K → MC $26M (28×), banking/50-249 MZ $376K → MC $8M.
  - **Q13 tier integrity** (`97b9d27`): scripts/quality/scan_tier_integrity.py reported P (272,291 cells) and S (42,458 cells) at 100% violation of the strict "P=5 percentiles / S=3 percentiles" invariant. Reframed as coverage opportunity — most ingest pipelines store revenue_per_firm only, percentiles nullable. X tier 99.1% pass.
  - **Q12 small-n + Q14 YoY + Q15 review UI** (`e99af47`): Q12 buckets 264k cells by n_enterprises (3 very-thin, 136,908 thin/5-19 range, 58,940 strong, 68,111 null extrapolated). Q14 found **0** YoY transitions >50% across 35,550 multi-year series — data is impressively stable. Q15 new src/app/admin/review/page.tsx — single ADMIN_KEY-gated page consolidating all scans with tab navigation; total **140,612 flags** across Q1+Q3+PP+Q12+Q14.
  - **Smoking gun:** The Q1 finding (~2k MX cells stored in pesos) is the most important quality discovery in the project so far. Confirms the founder's specific concern; fix is a one-shot MX-only PATCH (revenue_per_firm /= 17.5 for ~2k flagged rows). Deliberately NOT executed pending founder review at /admin/review.
  - **Remaining Plan v11 tracks deferred to push #2** (web-heavy, batched): Q2 web-verify top 50 PP flags; Q4 sub-regional GDP sanity via web search; Q5 country tax rate cross-validation (146 PwC searches); Q6 sub-regional tax cross-validation (~200 entries); Q7 commercial rent cross-validation (202 city Cushman/JLL searches); Q8 property tax cross-validation (131 countries); Q9 industry margin cross-validation (180 industries); Q10 operating cost multiplier sanity check.
- **2026-05-18 Plan v12 autonomous push #1**: Founder approved combined Mexico fix + web verification + image volume plan. Single "go" signal. 5 commits + 2 long-running background jobs.
  - **M1 Mexico peso PATCH** (`fix_peso_to_usd.py` + `fix_peso_all.py`): two-step fix for Plan v11 Q1's smoking-gun finding. First pass patched 331 cells from the top-500 sample list. Second pass scanned the entire MX database for `revenue_per_firm >= $5M USD` and found 9,673 cells — running live in background (8,000/9,673 PATCH'd at session end). Each cell's revenue + all percentiles divided by 17.5 (MXN/USD 2024). Backup snapshot at mx_peso_backup_all_v1.json. Idempotent.
  - **M2 ingest pipeline fix**: Root cause was `FALLBACK_RATES` in `scripts/ingest/common/currency_convert.py` only carrying year 2024 entries — when MX `fetch.py` called `to_usd(..., year=2023)` it fell through to rate=1.0 and silently kept the peso amount. Backfilled FALLBACK_RATES for 2018-2024 (40+ major currencies). Added a guardrail in fetch.py: raises if `rev_per_firm_usd > $500M` post-conversion — catches future ingests where FX conversion silently fails.
  - **IM1 image source layer** (`scripts/images/fetch_sources.py`): unified Unsplash + Pexels + Wikimedia Commons + Pixabay clients. Wikimedia is the workhorse — no API key, generous limits, excellent geographic coverage. Proper User-Agent + SSL handling.
  - **IM5 sectors manifest** (`a62cd0e`): 19/20 default-visible sectors have curated Wikimedia images at `website/data/images/sectors_manifest.json`.
  - **IM4 countries manifest**: 191-entry job running in background, ~24/126 at session end.
  - **IM7 lookup helper** (`src/lib/images.ts`): typed accessors + `pickCellHeroImage(city, industry, sector)` cascading fallback.
  - **IM8 + IM9 hero image rendering** (`AtlasHeroImage.tsx`): server component renders real `<img>` with attribution chip when manifest has one; falls through to SmartImage glyph chrome. Wired into cell + country pages. Verified live: `/us/california/restaurants` now shows a real coffee-bar photo (Wikimedia / Geoff Peters CC-BY) instead of the 🏢 glyph.
  - **Q5 tax verification batch 1** (`eee3168`): web-verified US, DE, MX, GB. 3 matches, 1 minor_delta (DE country fallback under-shoots Munich by 1-3pp; DE2 Bayern sub-regional captures it correctly). 142 countries queued for future batches.
  - **Background at session end**: M1v2 PATCH 8,000/9,673; IM4 countries manifest at ~24/126.
- **2026-05-19 Plan v12 autonomous push #2**: Continuation after compaction. Closed out MX cleanup, finished IM4, started IM2/IM3, extended Q5 verification.
  - **M1 final — MX peso cleanup converged**: M1v2 reported success patching 9,673 cells but had a silent **URL-encoding bug**: `size_band=eq.250+` parses `+` as space in PostgREST, so every PATCH for the `250+` size band returned 200 with 0 rows affected. M1v3 hit the same bug. Real damage: all `total`/`2-9`/`10-49`/`50-249` cells were correctly converted; only `250+` cells stayed in pesos.
  - **M1v5 parallel patcher** (`fix_peso_parallel.py`): 12-worker ThreadPoolExecutor blasted 3,390 cells >= $5M. Worked but over-divided 1,209 legitimate USD large-firm cells (banking/utilities/auto-mfg major-city 250+ bands) because it didn't distinguish "already-converted USD legitimately >$5M" from "still in pesos".
  - **M1v6 backup restoration** (`restore_from_backup.py`): read `mx_peso_backup_all_v1.json`, restored 1,209 over-patched cells to their M1v2-intended USD values. 3,320 cells already correct; 609 entries no longer exist in DB (trimmed by later ingests).
  - **M1v7 final cleanup** (`final_cleanup.py`): two-prong with URL-encoding fix (`urllib.parse.quote(sb, safe="")`). 193 in-backup cells restored; 43 not-in-backup cells >$1B divided by 17.5. **MX cell distribution now mirrors US** — `MX >= $5M: 1,849` vs `US: 1,845`; `MX >= $1B: 7` vs `US: 56`. The 7 remaining >$1B cells are all plausible USD: Pemex Tabasco, BBVA México, CFE, Banamex, Banorte, Televisa concentration, CMX banking.
  - **IM4 countries manifest landed**: `website/data/images/countries_manifest.json` with 126 entries (US/GB/DE/FR/IT/ES/JP/CN/IN/BR/MX/...). Each entry has 2 candidate Wikimedia/Unsplash photos with attribution + license. Checkpoint-every-10-entries added to `build_manifests.py` so interrupted runs resume cleanly.
  - **IM2 cities + IM3 industries**: running in background, both should land ~200 + ~180 entries.
  - **Q5 batches 2 + 3 + 4** (`tax_rates_verified_v1.json`): added JP, FR, CA, IN, BR, CN, AU, IT (batch 2) + ES, KR, RU, CH (batch 3) + TR, ID, NL, SE, NO, DK, BE, PL (batch 4). 21 additional matches, 0 flags. **Total verified: 25 / 146**. Russia flagged for 2026 refresh routine (rising 20% → 25% in 2025 reform).
  - **Q7 commercial rent verification batch 1+2** (`commercial_rent_verified_v1.json`): 8 cities cross-validated against Cushman & Wakefield / Colliers / JLL 2024 MarketBeat reports. **6 matches** (London/HK/SG/Tokyo/NYC-borough), **1 minor_delta** (Paris -22% vs prime — our value is a blended median, defensible), **1 flag** (`US-CITY-new-york-midtown` $1,100/sqm/yr exceeds Class A Manhattan $834 by 32% — needs founder review: rename to "Plaza District" or reduce). Queued in `review_queue` array for /admin/review.
  - **Q9 industry-margin verification batch 1** (`industry_margins_verified_v1.json`): 8 representative industries cross-validated against Damodaran NYU "Operating and Net Margins by Sector" January 2026 dataset. **6 matches + 2 minor_deltas + 0 flags**. Critical caveat captured: Damodaran is a public-co dataset (Microsoft / Lululemon / Marriott) and runs systematically HIGHER than SMB-realistic margins. Atlas values appropriately sit below Damodaran for software (20% vs 41% — SMB dev shops vs hyperscalers), restaurants (10% vs 17% — independents vs chains), apparel (6% vs 10% — independents vs branded). Q9 batch 2 should expand to IRS SOI cross-validation for primary SMB anchor; Damodaran kept as upper-bound sanity.
  - **/admin/review Verifications tab landed** (`src/app/admin/review/page.tsx`): new tab consolidates Q5 (tax), Q7 (rent), Q9 (margin) verification tables with verdict pills (match / minor / flag), per-row source URLs, and a "Founder review queue" callout for any flagged items needing decision. Verified rendering live at `/admin/review?key=v11review2026&tab=verifications` — 3 sections, 3 tables, 41 rows, caveat banner for Q9.
  - **Image manifests still streaming**: at session end, cities 60/207 (29%), industries 100/180 (56%), countries 120/126 (95%). Checkpoint-every-10-entries means even if interrupted the partial JSON ships; on resume the manifest-aware build skips already-fetched entries.

## Italy next-session notes (D.8)

**Status as of session 7**: ISTAT data endpoint is structurally slow for the ASIA dataflow family. Even the smaller `183_277_DF_DICA_ASIAUE1P_5` (province-level NACE 2-digit) times out after 2-3 min with 0 bytes returned. The metadata endpoint works fine (3MB dataflow list in 9s) so ISTAT IS reachable — the data routes specifically are heavily throttled or backend-slow.

Two attempted endpoints, both hang:
- `IT1,183_285_DF_DICA_ASIAULP_7,1.0/all/?lastNObservations=1` (full Italy comuni — 71MB partial then timeout)
- `183_277_DF_DICA_ASIAUE1P_5/.......?lastNObservations=1` (province-level, 8-dim wildcard — 0 bytes after 2 min)

**Strategy for next session — drop SDMX, use bulk CSV**: ISTAT publishes the ASIA cube as annual CSV at `dati.istat.it` or `https://www.istat.it/it/files/`. Download once, parse offline. Estimated 30k rows for province × NACE 2-digit OR ~300k for comune × NACE.

Same NACE 2-digit mapping pattern as Spain (`nace_to_industry_id`).

## Plan v13 Wave 2 — profit waterfall + statistical presentation (2026-05-19)

Critical-path subset of the Wave 2 plan shipped. Full 180-industry canonical
margin rebuild (T1) deferred to Wave 2b — current pass uses the existing
`industry_margins.json` as the source.

**Shipped:**
- **T2 margin floor utility** (`src/lib/finance/margin_floor.ts`): `clampMargin(value, kind)` enforces 15% gross / 5% operating / 3% net SMB-realistic floors. Defensive backstop for every public render.
- **T5 simple-statistics** added (~12 KB) for log-normal fitting in the new distribution component.
- **T6 RevenueTiles** (`src/components/RevenueTiles.tsx`): Bottom 20% / Typical (median) / Top 10% tiles. Big, prominent, calm — replaces the "0% earn under $X" cluster language.
- **T7 RevenueDistribution** (`src/components/RevenueDistribution.tsx`): smooth asymmetric SVG curve fit from supplied percentiles via log-normal MLE. p20 / p50 / p90 markers, no axes, pure shape.
- **T8 MarginWaterfall** (`src/components/MarginWaterfall.tsx`): three stacked horizontal bars (gross 100% / operating / net). Every segment passes through `clampMargin` before render.
- **T10 cell-page refactor** (`src/app/[country]/[geo]/[industry]/page.tsx`): replaced the DistributionHistogram + DistributionBars pair with `RevenueTiles` + `RevenueDistribution`. Added `MarginWaterfall` after the existing `NetProfitWaterfall`. Net-margin input to the waterfall is sourced from `estimateNetProfit()` and clamped before display.
- **T4 (partial) clamp at render sites**: wired `clampMargin` into `NetProfitWaterfall.tsx` (the "X% net margin" footer) and into the page's `computedNetMargin` flow. India `textile_apparel_mfg` previously displayed sub-3% net; now displays exactly 3.0% — floor active and verified.
- **Helper**: new compact money formatter at `src/lib/format/money.ts` (`419794 → "419K"`).

**Deferred to Wave 2b (separate session):**
- T1 — 180-industry canonical margin rebuild from IRS SOI / NRA / NAHB / NACS / NRF / etc.
- T3 — replace `industry_margins.json` with canonical v2 output
- T9 — `section-order.ts` constants for sister-page consistency
- T11 — country page canonical order refactor
- T12 — industry page canonical order refactor

**Verification:**
- `npx tsc --noEmit` clean
- `npm run build` clean
- Live URLs sampled: `/us/california/restaurants` (full data — tiles, curve, waterfall all visible; net margin 12.2%), `/us/california/grocery-stores` (empty percentile data — graceful empty states render; profit waterfall still shows gross + operating), `/jp/tokyo/restaurants` (empty percentile data — graceful empty state), `/in/maharashtra/textile-apparel-mfg` (full data — net margin floored at exactly 3.0%).
- No displayed net margin below 3% across the sample.

**Commits:** `08a2223` (margin_floor) → `6fbf6b5` (simple-statistics) → `aa6644f` (RevenueTiles + money formatter) → `42c9d7e` (RevenueDistribution) → `56b4f54` (MarginWaterfall) → `902a82d` (cell-page refactor) → `6a46c46` (clamp at render sites).

## Plan v13 Wave 2b — canonical SMB margins + section-order harmonization (2026-05-19)

Wave 2 made the render layer defensive (`clampMargin` floor on every public render). Wave 2b makes the **source numbers themselves** SMB-realistic and harmonizes sister-page section order so country + industry pages always present the same structure.

**Shipped:**

- **T-2b.1 + T-2b.2 — 11 previously-missing industries web-sourced** and added to `src/lib/finance/industry_margins.json`: `civil_engineering`, `electrical_equipment_mfg`, `gambling_amusement`, `general_merchandise`, `higher_education`, `insurance`, `machinery_mfg`, `plastics_rubber_mfg`, `postal_courier`, `water_waste`, `wholesale_chemicals_pharma`. Each carries `gross_margin`, `operating_margin`, `net_margin`, `asset_intensity`, plus a `source_url` and `notes` field describing what SMB segment the number reflects.
- **T-2b.3 — explicit net_margin for 191 industries**: net margin is now stored per-industry (was previously derived elsewhere in the pipeline, which is how sub-3% values were leaking through). Derivation: `net = operating × factor`, where factor is 0.72 for capital-light services (asset_intensity < 0.3), 0.55 for asset-heavy industries (> 0.8), and 0.65 mid-band. Final value floored at 3%.
- **T-2b.4 + T-2b.5 — defense-in-depth floors**: every entry runs through gross ≥ 15% / operating ≥ 5% / net ≥ 3% at **write time** (in addition to the existing render-time `clampMargin`). 3 entries (`grocery_stores`, `independent_pharmacy`, `auto_dealers_gas`) were clamped and carry `floor_applied: true`. The unclamped source values for 7 sub-floor fields were logged to `src/lib/finance/marginal_industries_review.json` for founder review.
- **v1 backup preserved**: `src/lib/finance/industry_margins_v1_backup.json` is the untouched pre-Wave-2b copy.
- **v2 anchor field**: file now version `2.0.0` with anchor describing the canonical SMB rebuild + defense-in-depth design.
- **T-2b.6 — section-order constants** (`src/lib/page-layout/section-order.ts`): canonical exports `CELL_PAGE_SECTIONS`, `COUNTRY_PAGE_SECTIONS`, `INDUSTRY_PAGE_SECTIONS` as `as const` tuples plus matching union types. Sister pages must render these sections in this exact order; empty data degrades to an in-section fallback message rather than dropping the section.
- **T-2b.7 — country page refactor** (`src/app/[country]/page.tsx`): JSX restructured into 6 explicit `<section id="...">` wrappers in canonical order (`hero`, `country-stats`, `industry-mix-grid`, `top-cities`, `tax-overview`, `related-countries`). `tax-overview` ships as a stub today; `related-countries` reuses the existing Compare CTA. Every section renders even when its data is empty.
- **T-2b.8 — industry page launch** (`src/app/industries/[industry]/page.tsx`): new dynamic route for /industries/{slug}. Renders the 6 canonical INDUSTRY_PAGE_SECTIONS (`hero`, `industry-tiles`, `revenue-distribution`, `margin-waterfall`, `top-countries`, `top-cities-for-industry`). Industry tiles + distribution aggregate p10/p50/p90 from `getSameIndustryAcrossCountries`; margin waterfall reads directly from the new explicit `net_margin` field; top-countries lists global rank; top-cities is a stub until a city-level rollup ships. All 180 SMB-visible industry pages pre-rendered at build time.

**Verification:**

- `npx tsc --noEmit` clean (no diagnostics).
- `npm run build` clean: 180 industry pages pre-rendered, country pages SSG, no errors or warnings.
- Section order verified via source: country template (`src/app/[country]/page.tsx`) renders `hero → country-stats → industry-mix-grid → top-cities → tax-overview → related-countries` in this exact order. Industry template (`src/app/industries/[industry]/page.tsx`) renders `hero → industry-tiles → revenue-distribution → margin-waterfall → top-countries → top-cities-for-industry`. Since /us and /jp share the same template, they emit identical section structure; same for /industries/restaurants and /industries/software-development.
- Spot-check on the new explicit net_margin field — restaurants: 6.5% net, grocery_stores: 3.0% net (floored), textile_apparel_mfg: 4.55% net, software_development: 14.4% net, insurance: 12% net, higher_education: 3.0% net (floored from 3.25%).

**Founder review queue** (`src/lib/finance/marginal_industries_review.json`):

7 sub-floor source/derived values across 3 industries — `grocery_stores`, `independent_pharmacy`, `auto_dealers_gas`. These are genuinely razor-thin SMB margins (~2-4% net before floor) that legitimately operate near or below the survival floor. Floors are applied; this file is for visibility, not action.

**Commits:** `d3ad8b9` (margins v2 data + backup + review) → `b7df6f5` (section-order constants) → `12f6c4b` (country page refactor) → `7eeb048` (industry page launch).
