# 07 · Codebase Tour

> Every directory and every key file annotated. This is the file
> inventory — use it as a map when you need to find or modify
> something.

---

## 1 · Top-level layout

```
E:\atlas\
├── website/                     # Next.js 15 App Router app (the git repo)
│   ├── src/                     # All TypeScript source
│   ├── docs/                    # All documentation (this folder + ingest/)
│   ├── public/                  # Static assets (images go here when commissioned)
│   ├── scripts/                 # Node/TS scripts (verify_taxonomy.ts)
│   ├── .env.local               # API keys (gitignored)
│   ├── package.json             # Deps + scripts
│   ├── tailwind.config.ts       # Color palette + typography
│   ├── tsconfig.json            # TS strict mode
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── PLAN_V3.md               # Superseded planning doc
│   └── PLAN_V4.md               # Current planning doc
├── scripts/                     # Python data engineering (NOT a git repo)
│   ├── ingest/                  # All sub-national ingest pipelines
│   │   ├── common/              # 8 reusable helpers
│   │   └── <per-phase>/         # One subfolder per source country
│   ├── migrations/              # SQL migrations (applied manually in Supabase)
│   └── *.py                     # Other one-off scripts (audit, upload, etc.)
└── delivery/                    # Ingest cache + outputs (NOT a git repo)
    ├── regional/                # Per-phase progress + cached source files
    └── fx_cache/                # World Bank FX cache
```

---

## 2 · `website/src/app/` — Next.js App Router pages

### Page routes (every route the user can visit)

| Path | File | What it does |
|---|---|---|
| `/` | `page.tsx` | Home: hero + navigator + FirstFrameStrip + 12 FeaturedCellTile + SectorMasterMenu + CellOfTheWeek + stats strip + 3-col "what you'll see" + NewsletterSignup |
| `/[country]` | `[country]/page.tsx` | Country landing: flag + name + coverage tier + signature line + top SMB industries + Compare CTA |
| `/[country]/[geo]/[industry]` | `[country]/[geo]/[industry]/page.tsx` | THE cell page (largest file). Hero + breadcrumb + DimensionSwitcher + AtlasScore + TypicalFirmCard + DistributionHistogram + DistributionBars + TimeSeriesChart + CellActions + AcrossStatesStrip + QualityBadge + sticky right-rail CellPageNav |
| `/[country]/[geo]/[industry]/loading.tsx` | (skeleton) | Renders cell-page-shaped skeleton during ISR |
| `/about-data` | `about-data/page.tsx` | Generic data description (no source agencies named, per Plan A lockdown) |
| `/ask` | `ask/page.tsx` + `AskClient.tsx` | AI query layer. Preview-stub until ANTHROPIC_API_KEY is in Vercel. |
| `/blog` | `blog/page.tsx` | Markdown blog index |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Individual blog post (markdown) |
| `/browse` | `browse/page.tsx` | All countries grid (basic; expandable) |
| `/compare` | `compare/page.tsx` + `CompareClient.tsx` | 4-cell side-by-side. Wired to /api/cell-lookup. |
| `/embed/[country]/[geo]/[industry]` | `embed/[country]/[geo]/[industry]/page.tsx` | Iframe-friendly minimal cell view (no header/footer when iframed) |
| `/methodology` | `methodology/page.tsx` | Redirects to /about-data (Plan A lockdown) |
| `/not-found` | `not-found.tsx` | Branded 404 with 4 helpful tiles |
| `/pricing` | `pricing/page.tsx` | 4-tier pricing grid |
| `/random` | `random/route.ts` | Route handler: 307-redirects to a rotating cell |
| `/saved` | `saved/page.tsx` + `SavedClient.tsx` | localStorage saved-cells list with clear-all |
| `/sectors` | `sectors/page.tsx` | All 20 visible sectors grid |
| `/sectors/[sector]` | `sectors/[sector]/page.tsx` | Per-sector hero + quick-stat preview tiles + full industry grid + sister-sector chips |
| `/you` | `you/page.tsx` + `CompareToMeClient.tsx` | "How do I compare?" calculator (privacy by design — numbers stay client-side) |
| `/sitemap.xml` | `sitemap.ts` | Generated sitemap |
| `/robots.txt` | `robots.ts` | Generated robots with AI-crawler blocks |

### API routes

| Endpoint | File | What it does |
|---|---|---|
| `/api/ask` | `api/ask/route.ts` | POST. Anthropic agentic loop with `query_cells` tool. Per-IP 10/hour rate limit. Preview-stub when no key. |
| `/api/cell-lookup` | `api/cell-lookup/route.ts` | GET. Compact JSON cell fetch by ?country=X&industry=Y&region=Z. Used by /compare and /you. |
| `/api/cell-snapshot` | `api/cell-snapshot/route.ts` | GET. Single-cell quick preview for FeaturedCellTile. |
| `/api/popular-cell-snapshot` | `api/popular-cell-snapshot/route.ts` | GET. Rotating popular cell for FirstFrameStrip. |
| `/api/export-csv` | `api/export-csv/route.ts` | GET. Single-cell CSV with watermark header + optional time series. |
| `/api/newsletter` | `api/newsletter/route.ts` | POST. Stores email in Supabase newsletter table. |

### Root layout

| File | What it does |
|---|---|
| `layout.tsx` | Root layout: header (logo + nav + GlobalSearch), main content slot, footer (4 columns), Organization schema.org, body bg gradient |
| `globals.css` | Tailwind base + cream-50 page background + .flag class (Twemoji fallback) + .card / .card-cream / .hairline component classes + serif font feature settings |
| `middleware.ts` | Edge: AI-crawler block (451), bare-scraper block (403), per-IP rate limit (60/min → 429) |

---

## 3 · `website/src/lib/` — shared library code

### `cells.ts` — ALL data access

The single source of truth for talking to Supabase. Exports:

| Function / type | Purpose |
|---|---|
| `Cell` type | Shape of a cell row across all tables (normalised) |
| `CellSelector` type | Optional `{ sizeBand, year }` filter |
| `getCellBySlug(country, geo, industry, selector)` | THE main resolver. Walks cells_master → regional_cells → extrapolated_cells with PARENT_FALLBACK_MAP. Returns a Cell or null. |
| `getCellVariants(country, geo, industry)` | All variants (all size bands, all years) for a cell — used by DimensionSwitcher |
| `getTopCells(limit)` | Top-N highest-traffic US cells (for sitemap + random) |
| `getComparableCells(state, excludeNaics6, limit)` | Same state, other industries |
| `getSameIndustryAcrossStates(industrySlug, excludeGeoId, limit)` | Same industry, other US states — for AcrossStatesStrip |
| `getIndustryRankInState(geoId, currentNaics6)` | "Restaurants rank #N out of M industries in California" |
| `getExtrapolatedCell(iso2, industrySlug, selector)` | Non-US fallback path |
| `getTopIndustriesForCountry(iso2, limit)` | For country landing pages |
| `cellUrl(cell)` | Build the URL slug from a Cell object |
| `slugify(s)` | Slug helper used in many places |
| `listUsStates()` | List of 50 US states + DC |
| `buildTimeSeries(cells)` | Group variants by year for TimeSeriesChart |
| `distinctSizeBands(cells)` / `distinctYears(cells)` | For DimensionSwitcher dropdowns |

### `taxonomy.ts` — sectors + industries + countries

Exports:

| Function / type | Purpose |
|---|---|
| `Sector` type | id, name, tagline, display_order, audience_default, header_color, legacy_aliases, isic_sections, examples, icon |
| `Industry` type | id, name, examples, keywords, sector_id, isic_divisions, naics_3, nace_divisions, audience, parent_id |
| `AudienceTag` type | "smb_core" / "smb_friendly" / "mixed_caution" / "corp_only" |
| `Gate` type | `{ revealMixed?, revealCorp? }` — used by visibleSectors / visibleIndustries |
| `SECTORS`, `INDUSTRIES`, `COUNTRIES` | Loaded from JSON files; alphabetised for COUNTRIES |
| `SECTOR_BY_ID`, `INDUSTRY_BY_ID` | Lookups |
| `SECTORS_ORDERED` | Sectors sorted by `display_order` (curated, not alphabetical) |
| `LEGACY_SECTOR_ALIAS` | Old → new sector ID map for URL stability |
| `visibleSectors(gate)` | Returns sectors visible under the gate, in display order |
| `sectorHasVisibleIndustries(sectorId, gate)` | True if at least one child industry is visible |
| `visibleIndustriesInSector(sectorId, gate)` | Alphabetical within the sector |
| `visibleIndustries(gate)` | All visible industries |
| `resolveSector(slug)` | Walks LEGACY_SECTOR_ALIAS |
| `resolveToMeasuredIndustry(ind)` | Walks parent_id → PARENT_FALLBACK_MAP → self |
| `PARENT_FALLBACK_MAP` | Constant; maps uncovered parent industries to covered cousins |
| `naics6ToIndustry(naics6)` | NAICS-6 prefix → industry_id |
| `slugToIndustry(slug)` | Slug → Industry (with keyword/example fallback) |
| `industryToSlug(industryId)` | industry_id → URL slug |
| `searchIndustries(query, sectorFilter)` | For GlobalSearch |
| `searchCountries(query)` | For GlobalSearch |

### Other lib files

| File | Purpose |
|---|---|
| `supabase.ts` | Two singletons: `supabase` (anon) + `supabaseAdmin` (service role) |
| `taxonomy/sectors.json` | The 25 sectors with metadata |
| `taxonomy/industries.json` | The 202 industries with audience tags |
| `countries.ts` | ISO-2 ↔ ISO-3 map + `flagFromIso2` (regional indicator pair Unicode) + `slugToIso2` + `iso2ToName` |
| `blog.ts` | Markdown parsing for /blog (uses gray-matter + remark) |
| `audience.ts` | Server-side Pro gate (`readGateFromRequest`, `readGateFromObject`) |
| `cn.ts` | Tiny classname joiner (no clsx dep) |

---

## 4 · `website/src/components/` — UI components

### Home page components

| Component | Purpose |
|---|---|
| `NavigatorForm.tsx` | The 6-field navigator (country / region / subdivision / sector / industry / employees). Uses `Gate` from URL query. Has "Surprise me ✦" and "Show me the numbers →" buttons. |
| `ComboField.tsx` | Type-ahead combobox. Matches on label, examples, keywords. Reused by NavigatorForm, CompareClient, CompareToMeClient. |
| `GlobalSearch.tsx` | Cmd+K modal. Searches industries + countries + sectors. |
| `SectorMasterMenu.tsx` | 20-tile grid in curated display order with per-sector header_color. |
| `FeaturedCellTile.tsx` | One home-grid tile. Server-fetches its cell. Returns null if no data (drops the tile rather than showing "Coming soon"). |
| `FirstFrameStrip.tsx` | Above-fold rotating cell preview (4 quick stats). Server-fetches the hourly-rotation cell. |
| `CellOfTheWeek.tsx` | Weekly-rotating curated cell card with editorial-lite headline. |
| `NewsletterSignup.tsx` | Email capture form. POSTs to /api/newsletter. |

### Cell page components

| Component | Purpose |
|---|---|
| `DimensionSwitcher.tsx` | Sticky bar above hero: industry / region / size / year pivots without page reload |
| `DistributionHistogram.tsx` | SVG piecewise-density chart from p10/p25/p50/p75/p90 |
| `DistributionBars.tsx` | 5 horizontal tier bars (smallest 10% / quarter / typical / three-quarter / biggest 10%) |
| `TimeSeriesChart.tsx` | SVG sparkline with YoY pill chip + gradient area fill |
| `TypicalFirmCard.tsx` | Derived ratios (employees per firm, revenue per employee, etc.) |
| `AcrossStatesStrip.tsx` | Horizontal bar list of same-industry across US states |
| `AtlasScore.tsx` | 0-100 composite score with Strong / Solid / Mixed / Tough chip + gradient bar |
| `QualityBadge.tsx` | Star rating (1-5) + generic source descriptor. **Critical Plan A lockdown** — maps specific agency names to generic labels. |
| `CellPageNav.tsx` | Sticky right-rail TOC with IntersectionObserver-based active-section tracking |
| `CellActions.tsx` | Star (save) + Copy link + CSV download + Embed action row |

### Utility components

| Component | Purpose |
|---|---|
| `SmartImage.tsx` | next/image wrapper with cream-gradient + emoji-glyph placeholder when no `src` provided |
| `StructuredData.tsx` | JSON-LD: Dataset / Breadcrumbs / Article / Organization. Stripped of source-leaking fields per Plan A. |
| `Tooltip.tsx` | Simple hover tooltip used in stat labels |

---

## 5 · `website/scripts/` — Node/TS build scripts

| File | Purpose |
|---|---|
| `verify_taxonomy.ts` | CI script. Run via `npm run prebuild` before every `next build`. Checks: every industry has a real sector_id; every parent_id resolves; visible sectors have ≥3 visible children; no forbidden words ("banking", "mining", "energy", "pharma", "telecom") in default-visible sector names; display_order is unique; first three visible sectors are food_drink + retail_shops + beauty_wellness. **Fails the build if violated.** |

---

## 6 · `website/package.json` — scripts and deps

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "verify:taxonomy": "npx tsx scripts/verify_taxonomy.ts",
    "prebuild": "npx tsx scripts/verify_taxonomy.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "gray-matter": "^4.0.3",
    "next": "15.0.7",
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106",
    "remark": "^15.0.1",
    "remark-html": "^16.0.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.20",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

Notable: `tsx` is invoked via `npx` rather than installed as a dep
(saves a few MB).

---

## 7 · `website/tailwind.config.ts` — palette

Custom colour families (defined in `tailwind.config.ts`):

| Family | Stops | Purpose |
|---|---|---|
| `ink` | 50, 100, 200, 300, 500, 600, 700, 800, 900 | Warm graphite text + greys |
| `atlas` | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 | Burnt amber primary spine |
| `cream` | 50, 100, 200, 300, 400, 500 | Sand / parchment surface layers |
| `parchment` | (single value `#E8DDC7`) | Aliased for borders + coverage badges |
| `moss` | 50, 100, 300, 500, 700, 900 | Positive deltas (replaces emerald) |
| `clay` | 50, 100, 300, 500, 700, 900 | Negative deltas (replaces rose) |
| `cocoa` | 50, 100, 300, 500, 700, 900 | Deep text + borders alternative to graphite |
| `teal` | 50, 500, 600, 700 | Sparse data signature accent (<5% of surface) |

---

## 8 · `website/docs/` — documentation

```
docs/
├── HANDOFF.md                       # Original single-file handoff (superseded by this folder)
├── BOOTSTRAP_PROMPT.md              # Original single-file bootstrap prompt (superseded by 14_BOOTSTRAP_PROMPT.md)
├── handoff/                         # THIS FOLDER — 15-file structured handoff
│   ├── 00_README.md
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_FOUNDER_PROFILE.md
│   ├── 03_DECISION_LOG.md
│   ├── 04_CURRENT_STATE.md
│   ├── 05_DATABASE_SCHEMA.md
│   ├── 06_API_KEYS_AND_SECRETS.md
│   ├── 07_CODEBASE_TOUR.md          # (this file)
│   ├── 08_INGEST_SCRIPTS.md
│   ├── 09_BLOCKERS_AND_RESOLUTIONS.md
│   ├── 10_NEVER_DO_RULES.md
│   ├── 11_NEXT_STEPS.md
│   ├── 12_VERIFICATION_URLS.md
│   ├── 13_GLOSSARY.md
│   └── 14_BOOTSTRAP_PROMPT.md
└── ingest/                          # Sub-national ingest planning + reports
    ├── 00_MASTER.md
    ├── 01-18_*.md                   # Per-phase plans
    ├── 19_VERIFICATION_QUALITY.md   # Running scoreboard
    ├── 99_EXECUTION_PROMPT.md       # Original execution trigger (used in session 4)
    └── FINAL_REPORT.md              # Comprehensive end-of-session-4 report
```

---

## 9 · `E:\atlas\scripts\` — Python data engineering

```
scripts/
├── ingest/
│   ├── common/                      # 8 reusable helpers
│   │   ├── __init__.py
│   │   ├── ram_guard.py             # RAM cap context manager + tick()
│   │   ├── upload_to_supabase.py    # Batched idempotent upserter
│   │   ├── industry_mapper.py       # NAICS / NACE / ISIC / ANZSIC / JSIC / KSIC bridges
│   │   ├── currency_convert.py      # World Bank FX cache + fallback table
│   │   ├── geo_name_normalize.py    # UTF-8 + accents + slugify
│   │   ├── quality_score.py         # Tier + completeness + recency → 0-100
│   │   ├── pagination.py            # Generic API paginator
│   │   └── dedup.py                 # PK-stable client-side dedup
│   ├── eu_eurostat/
│   │   └── fetch_nuts.py            # ✅ EXECUTED — 43,903 rows
│   ├── jp_estat/
│   │   └── fetch.py                 # ✅ EXECUTED — 6,951 rows
│   ├── us_census/
│   │   └── fetch_cbp.py             # ✅ EXECUTED — 87,573 rows
│   ├── city_overlay/
│   │   ├── fetch.py                 # ✅ EXECUTED — 41,448 rows
│   │   └── fetch_br_cities.py       # ✅ EXECUTED — 834 rows
│   ├── latam_cluster/
│   │   └── br_ibge.py               # ✅ EXECUTED — 1,483 rows
│   ├── ca_statcan/
│   │   └── fetch.py                 # ⚠️ PARTIAL — 65 rows (wrong table)
│   ├── gb_ons/
│   │   └── fetch.py                 # ⚠️ SCAFFOLD — needs NOMIS numeric IDs
│   ├── de_destatis/
│   │   └── fetch.py                 # ⚠️ WORKS but DUPLICATE (free tier limit)
│   ├── oecd/
│   │   └── fetch_region_gva.py      # ⚠️ SCAFFOLD — endpoint migrated
│   ├── wb/
│   │   └── fetch_enterprise.py      # ✅ AUDIT TOOL — wrote followup CSV
│   ├── es_ine/                      # empty
│   ├── it_istat/                    # empty
│   ├── kr_kosis/                    # empty (impossible)
│   ├── fr_insee/                    # empty (6 GB CSV needs founder download)
│   ├── eu_lau/                      # empty
│   ├── in_mca/                      # empty
│   ├── cn_nbs/                      # empty
│   ├── sea_cluster/                 # empty
│   ├── mena_africa/                 # empty
│   ├── nz_stats/                    # empty
│   └── au_abs/                      # empty
├── migrations/
│   ├── 001_extrapolated_cells.sql   # Applied
│   └── 002_regional_cells.sql       # Applied
├── audit_extrapolated_coverage.py   # Coverage audit; writes delivery/regional/*.csv
├── upload_extrapolated_cells.py     # Original uploader for the 57,816 extrapolated rows
└── migrate_industries_to_v4_sectors.py  # One-shot migration; already run
```

---

## 10 · `E:\atlas\delivery\regional\` — ingest cache

```
delivery/regional/
├── eu_eurostat/
│   ├── progress.json                # Completed (indic, year) combos
│   └── nuts_labels.json             # Cached NUTS geo labels
├── us_census/
│   └── progress.json                # Completed (state, naics3) pairs
├── jp_estat/
│   └── progress.json                # Completed pages
├── ca_statcan/
│   └── 33100307.csv                 # Cached source (~300 MB)
├── br_ibge/
├── phase01_eu_eurostat.log
├── phase08_jp.log
├── phase10_us_census.log
├── phase15_br.log
├── phase18_city.log
├── coverage_audit_per_country.csv   # From audit_extrapolated_coverage.py
├── coverage_audit_per_industry.csv
├── coverage_audit_summary.json
└── wb_followup.csv                  # 158 countries needing follow-up
```

---

## 11 · Key constants by file (quick reference)

| Constant | File | Purpose |
|---|---|---|
| `PARENT_FALLBACK_MAP` | `src/lib/taxonomy.ts` | Sub-niche to covered-parent mapping |
| `LEGACY_SECTOR_ALIAS` | `src/lib/taxonomy.ts` | Old → new sector ID for URL stability |
| `SECTORS_ORDERED` | `src/lib/taxonomy.ts` | Curated display order (not alphabetical) |
| `COUNTRIES` | `src/lib/taxonomy.ts` | 38 covered countries (alphabetical) |
| `ISO2_TO_ISO3` | `src/lib/countries.ts` | Country code mapping |
| `MODEL` | `src/app/api/ask/route.ts` | `"claude-sonnet-4-5"` |
| `ASK_FREE_LIMIT` | `src/app/api/ask/route.ts` | `10` (questions per IP per hour) |
| `AI_CRAWLER_PATTERNS` | `src/middleware.ts` | Regex list of AI bot UA patterns |
| `PAGE_LIMIT` | `src/middleware.ts` | `60` (requests per IP per minute) |
| `JSIC_TO_INDUSTRY` | `scripts/ingest/jp_estat/fetch.py` | Hardcoded JSIC → industry_id bridge |
| `ANZSIC_BRIDGE` | `scripts/ingest/common/industry_mapper.py` | ANZSIC subdivision mapping |
| `CITIES` | `scripts/ingest/city_overlay/fetch.py` | Per-country city share + productivity premium |

---

## 12 · Build / dev / test commands

```bash
# Install deps
cd E:\atlas\website
npm install

# Dev server
npm run dev    # http://localhost:3000

# Type check
npx tsc --noEmit

# Taxonomy structural check (also runs in prebuild)
npx tsx scripts/verify_taxonomy.ts

# Production build (runs prebuild + verify_taxonomy automatically)
npm run build

# Lint
npm run lint
```

For Python ingest:

```bash
# Install psutil (only Python dep beyond requests + duckdb)
pip install psutil

# Run a phase
cd E:\atlas
python scripts/ingest/<phase>/<script>.py
```

---

## 13 · Where to add a new feature

| Feature type | Where it goes |
|---|---|
| New page route | `website/src/app/<route>/page.tsx` |
| New API endpoint | `website/src/app/api/<endpoint>/route.ts` |
| New React component | `website/src/components/<Name>.tsx` |
| New shared util | `website/src/lib/<name>.ts` |
| New sector | `website/src/lib/taxonomy/sectors.json` + verify CI passes |
| New industry | `website/src/lib/taxonomy/industries.json` + verify CI passes |
| New ingest phase | `E:\atlas\scripts\ingest\<phase>/` (use common/ helpers) |
| New SQL migration | `E:\atlas\scripts\migrations\NNN_*.sql` + apply manually in Supabase SQL editor |
| New brand colour | `website/tailwind.config.ts` (stay in warm-earth family per D-002) |
| New global style | `website/src/app/globals.css` |
| New planning doc | `website/docs/handoff/` (this folder; numbered) OR `website/docs/ingest/` (for new ingest phases) |
