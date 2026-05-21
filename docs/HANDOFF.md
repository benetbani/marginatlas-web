# HANDOFF — Margin Atlas state-of-the-world

> Last updated: 2026-05-21 end of session 5
>
> **This file is the canonical entry point** for any new Claude session
> picking up Margin Atlas work. Read this end-to-end before doing
> anything. Everything else in this repo (and `E:\atlas\scripts/`) is
> referenced from here.
>
> **Session 5 delta — read this if nothing else:**
> `docs/handoff/15_SESSION_5_UPDATE.md`. It captures the 13 commits +
> Plan v15 + R-003 catastrophic hotfix shipped on 2026-05-21, and
> overrides this file wherever they disagree. The bootstrap prompt in
> `docs/handoff/14_BOOTSTRAP_PROMPT.md` already includes that chapter
> in its read order.

---

## 0 · Index

1. [The product in one paragraph](#1--the-product-in-one-paragraph)
2. [Founder communication preferences (READ FIRST)](#2--founder-communication-preferences-read-first)
3. [Current live state — what's on the internet right now](#3--current-live-state)
4. [The full decision log — every WHY captured](#4--the-full-decision-log)
5. [API keys + secrets — what exists, where, and what it unlocks](#5--api-keys--secrets)
6. [Database state — every table, every column, every row count](#6--database-state)
7. [Codebase tour — every directory + what it does](#7--codebase-tour)
8. [Ingest scripts inventory — what's done, what works, what doesn't](#8--ingest-scripts-inventory)
9. [Plan documents — which one is current](#9--plan-documents)
10. [Open blockers + their resolution paths](#10--open-blockers--resolution-paths)
11. [Things to NEVER do](#11--things-to-never-do)
12. [Recommended next steps, ranked by impact](#12--recommended-next-steps)
13. [Sample URLs (working + broken) for verification](#13--sample-urls-for-verification)
14. [Founder action items — what's blocking on them](#14--founder-action-items)

---

## 1 · The product in one paragraph

**Margin Atlas** is a global small-business benchmarking database
positioned at `marginatlas.com` (Cloudflare DNS + Vercel hosting +
Supabase Pro Postgres + Cloudflare R2 for cold parquet). It exposes
revenue, employment, wage, and firm-count benchmarks for ~180 SMB
industries across 219 countries, with sub-national depth down to
NUTS-3 / US-county / JP-municipality / BR-city level where data exists.
**The target user is the small-business founder, operator, or
consultant** — NOT the public-company analyst. The product is
deliberately curated to exclude banking / oil / pharma / large-corp
industries from default UI; those exist behind a Pro toggle. Pricing
is locked at $38 / $78 / $150 monthly with 33% annual discount.

The Tesseract Research entity owns the product. The founder also runs
"Tesseract Stock Agent" — a separate product reserved for aquamarine
brand colour. Margin Atlas uses burnt amber + warm graphite, no
aquamarine ever.

---

## 2 · Founder communication preferences (READ FIRST)

These have been corrected multiple times. Honour them.

| Rule | Status | Note |
|---|---|---|
| Never use the word "okay" in responses | Hard rule | Founder has flagged this twice |
| Be direct, no fluff, no sweetening | Hard rule | Plain reality, even when uncomfortable |
| When asked a yes/no question, lead with yes/no | Hard rule | Then explain |
| When a click-by-click is requested, give exact button names + paths | Hard rule | Not abstract advice |
| "Execute all of it, 0 stops" means: don't pause for sub-phase approval | Hard rule | But DO pause for genuine blockers (API keys missing, DDL needs SQL editor) |
| When something can't be done, say so plainly | Hard rule | Don't pretend |
| Don't apologise repeatedly | Soft rule | Once is enough |
| Don't restate what the user just said | Hard rule | Save tokens, move forward |

The founder works in long, run-on, voice-dictated paragraphs. Parse
the substance, ignore filler. Common patterns:

- "Just do it, just do it, just do it" → permission granted; execute
- "Don't bitch about X" → skip the disclaimer, do the thing
- "Give it to me direct" → no qualifiers, no hedging
- "I'm not here for hours" → make autonomous decisions; report at end
- "Be aggressive but methodical" → push for breadth, but per-step quality
- "Don't overload the RAM" → cap pipelines at 600 MB RSS, sequential not parallel

---

## 3 · Current live state

### URLs

| URL | Status | Notes |
|---|---|---|
| `marginatlas.com` | **522 Cloudflare error** | DNS not fixed yet. Two Vercel CNAMEs need to be added at Cloudflare with grey-cloud (DNS only). See `docs/ingest/HANDOFF.md` §14. |
| `marginatlas-web-twtl.vercel.app` | **200 OK, full site** | Use this for testing until DNS is fixed |
| `marginatlas-web-*.vercel.app` (preview deployments) | working | Auto-deploys from main branch |

### Vercel deployments

GitHub repo: `github.com/benetbani/marginatlas-web` (private)
- Connected to Vercel project `marginatlas-web`
- Auto-deploys on push to `main`
- Currently on Next.js 15.0.7, React 19 RC
- 8+ commits pushed during the session that's being archived

### Database

Supabase project `npfqasdghbffqgmzgxzr` ("Margin Atlas"):

| Table | Rows | Bytes | Purpose |
|---|---|---|---|
| `cells_master` | ~722,000 | ~280 MB | US state-level data from v1.5 (the original SUSB pull) |
| `extrapolated_cells` | 57,816 | ~16 MB | Regression-based country-level estimates for 219 countries (182 individual + 37 WB aggregates) |
| `regional_cells` | **179,409** | ~60 MB | New sub-national data added during this session (EU NUTS, US counties, JP prefectures, BR states, global city overlay) |
| Total | ~960,000 | ~360 MB | 4.5% of new 8 GB Pro tier |

### Vercel env vars (production)

- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `ANTHROPIC_API_KEY` — **NOT set in Vercel** (intentional — `/ask` route stays in preview-stub mode until tone is decided)

---

## 4 · The full decision log

This is the WHY behind every architectural decision. Read this before
proposing changes to any of these.

### Branding + visual

| # | Decision | Why | When |
|---|---|---|---|
| D-001 | Burnt amber + warm graphite palette | Founder explicitly told us "aquamarine has no place in this" — that's Tesseract Stock Agent's colour | Session 1 |
| D-002 | Expanded palette to 8 in-family tones (cream, moss, clay, cocoa, parchment) | Founder said site looked "bland". Stayed strictly inside warm-earth-tone family. NO cool colours except a single sparse deep teal. | Session 2 |
| D-003 | Hero image NOT on the right | Founder explicit: "the image should not be on the right side, that's wrong" | Session 3 |
| D-004 | Navigator dominates the hero (full width, big padding, big CTA) | Founder: "the menu should be occupying more space" | Session 3 |
| D-005 | Image placeholders use cream-gradient with emoji glyph | Founder hasn't commissioned real images yet; SmartImage component swaps in real `src` when provided | Session 2 |
| D-006 | Sector dropdown: curated display order, NOT alphabetical | Founder: "you go in the alphabetic method, but in this case, the alphabetic method is not good… should have a master menu". Alphabetical opened with "Administrative" which is ugly. | Session 3 |
| D-007 | Country dropdown: alphabetical sort | Standard pattern; founder confirmed | Session 2 |

### Product positioning

| # | Decision | Why | When |
|---|---|---|---|
| D-010 | The atlas is for SMBs, NOT for public-company analysts | Founder explicit, multiple times: "this thing was made for the small guy, not for the banks" | Session 3 |
| D-011 | Banking, oil & gas, pharma, telecom, large insurance — hidden by default | Bimodal distributions ruin averages; founder explicit: "the asset management firms make this amount of money — it's a little bit dumb" | Session 3 |
| D-012 | 25 sectors total: 20 visible + 5 Pro-only | Visible: Food & drink, Retail & shops, Beauty & wellness, Trades & home services, Hospitality, Professional services, Software & tech, Real estate, Transport (small), Manufacturing & artisan, Construction, Farming & food production, Health & clinics, Education & instruction, Creative & media, Repair services, Pet services, Events & entertainment, Cultural, Other local services. Pro-only: Mining & energy, Heavy industry, Finance (corp), Telecom & broadcasting, Higher ed & hospitals. | Session 3 |
| D-013 | 202 industries: 180 visible (smb_core + smb_friendly) + 22 hidden (mixed_caution + corp_only) | Migrated 193 existing industries to new sector schema + added 9 sub-niches for thin sectors | Session 3 |
| D-014 | First 3 sectors in display order MUST be `food_drink`, `retail_shops`, `beauty_wellness` | These are the visceral SMB anchors users recognise. CI verify_taxonomy.ts enforces this. | Session 3 |
| D-015 | Sub-niches that don't have direct measured data resolve to parent industry via PARENT_FALLBACK_MAP | 73 NAICS-3 codes mapped in taxonomy but only 44 are in extrapolated_cells; without fallback, 102 industries would 404 | Session 3 |

### Pricing

| # | Decision | Why | When |
|---|---|---|---|
| D-020 | $38 Starter / $78 Pro / $150 Enterprise monthly | Founder dictated | Session 1 |
| D-021 | Annual = 8 × monthly (4 months free, 33% discount) | Founder dictated | Session 1 |
| D-022 | 7-day Pro trial on Starter and Pro tiers | Standard pattern; founder agreed | Session 1 |

### Methodology + sources

| # | Decision | Why | When |
|---|---|---|---|
| D-030 | NEVER reveal source agencies in user-visible text | Founder: "avoid putting methodology and sources of information out there… don't broadcast where the raw data lives publicly" — competitive moat against LLM-powered competitors reverse-engineering our sources | Session 2 |
| D-031 | All `coverage_source` strings genericized via QualityBadge component | "National business statistics", "European business statistics", "Cross-country economic indicators", "Estimated from regional patterns" — never the specific agency name | Session 2 |
| D-032 | Schema.org JSON-LD stripped of `measurementTechnique`, `license`, `sameAs` | Same reason — those fields would leak data provenance to scrapers | Session 2 |
| D-033 | robots.txt blocks AI training crawlers (GPTBot, ClaudeBot, etc.) | Don't feed competitors' models for free | Session 2 |
| D-034 | Edge middleware blocks AI crawlers (451), bare scrapers (403), rate limits 60 req/min/IP | Defence in depth | Session 2 |
| D-035 | Methodology page redirects to generic `/about-data` | Same lockdown | Session 2 |

### Editorial / content

| # | Decision | Why | When |
|---|---|---|---|
| D-040 | Editorial tone is NOT decided yet | Founder hasn't locked it. Plan v3.0 Phases B.5, G, H all deferred. Different parts of the site may need different tones (technical pages vs blog). | Sessions 1-4 |
| D-041 | `/ask` AI route stays in preview-stub mode | ANTHROPIC_API_KEY exists in `.env.local` but NOT in Vercel env. When tone is locked, paste key into Vercel and `/ask` flips live. | Session 3 |
| D-042 | Model fixed to `claude-sonnet-4-5` in /ask | Founder direction: not heaviest, not lightest | Session 3 |
| D-043 | /ask rate-limited at 10 questions per IP per hour | Free-tier cap; cost control | Session 3 |
| D-044 | The cell page narrative uses neutral, factual phrasing | "A typical X here brings in about $Y" — no editorial voice until tone is set | Session 1 |

### Infrastructure

| # | Decision | Why | When |
|---|---|---|---|
| D-050 | Supabase Pro tier ($25/mo, 8 GB) | Free 500 MB cap was about to burst at Phase 4 of sub-national ingest. Pro gives 16× headroom + connection pooling + backups + no auto-pause. Cheapest sane infra decision in the project. | Session 4 |
| D-051 | Cloudflare R2 stays at $0.01/mo, public access disabled | Methodology lockdown; only used for cold parquet exports | Session 2 |
| D-052 | Hugging Face dataset made private | Same lockdown | Session 2 |
| D-053 | GitHub atlas-data repo made private | Same lockdown | Session 2 |
| D-054 | Cloudflare DNS not yet fixed | Founder pending — needs to delete Namecheap A + CNAME records, add Vercel CNAMEs with grey cloud | Session 4 |
| D-055 | RAM cap per ingest pipeline: 600 MB RSS | Founder said "do not exceed 70% RAM" repeatedly; machine blocks under high RAM. ram_guard.py enforces. | Session 3 |
| D-056 | Sequential execution within and across pipelines | Same reason — no parallel pipelines | Session 3 |
| D-057 | Supabase upserts batched at 500 rows | Sweet spot for PostgREST | Session 3 |
| D-058 | Idempotent upserts (PK conflict = merge via `Prefer: resolution=merge-duplicates`) | Resume support; safe to re-run any phase | Session 3 |

### Sub-national ingest specific

| # | Decision | Why | When |
|---|---|---|---|
| D-060 | Korea KOSIS = PERMANENTLY SKIPPED | KOSIS registration requires a Korean mobile phone number. Confirmed dead-end for non-Korean founders. | Session 4 |
| D-061 | Germany Destatis = DUPLICATE | Token works (POST + header `username: TOKEN`) but free-tier catalogue only exposes Germany + Länder tables. Kreis-level requires paid subscription. Länder coverage already in Phase 1 Eurostat. | Session 4 |
| D-062 | EU coverage via Eurostat NUTS-2/3 in one sweep, NOT per-country | Eurostat publishes NUTS-1/2/3 in one dataset (`sbs_r_nuts06_r2`); fetching by `(indic_sb, year)` filter without country narrowing returns all 280+ regions in one ~30K-obs response. 12 calls total. | Session 4 |
| D-063 | Eurostat indicators V11210 + V16110 + V13320 merged in-memory before upload | Initial bug: separate upserts per indicator overwrote each other. Fix: accumulate all 238K raw obs (~200 MB), merge once into 43,903 final cells, upload. | Session 4 |
| D-064 | US Census CBP 2022 at county × NAICS-3, all 51 states × 73 codes | 3,723 sequential API calls; ~1h50m wall-time; tier 'P'. PAYANN gives payroll-per-employee. | Session 4 |
| D-065 | JP Economic Census 2024 (table 0004040099) at prefecture + municipality | JSIC 2-digit divisions broadly align with ISIC; mapped via ISIC bridge. Some niche divisions need dedicated JSIC table. | Session 4 |
| D-066 | BR IBGE CEMPRE (table 6449, var 2585) at UF level | 27 UFs × ~74 industries. CNAE-2 follows NACE Rev.2. | Session 4 |
| D-067 | Global city overlay derived from extrapolated_cells × population/productivity factors | Tier 'X', quality 37. Founder: "if it's not perfect, mark it clearly". | Session 4 |
| D-068 | BR cities derived from BR state regional_cells (not extrapolated_cells) | Brazil is absent from extrapolated_cells (was an anchor country in the original regression). | Session 4 |
| D-069 | France Sirene NOT executed | 6 GB CSV needs user-side bandwidth. Scaffold ready. | Session 4 |
| D-070 | OECD overlay scaffold only | OECD SDMX endpoint URL migrated; old `stats.oecd.org/SDMX-JSON/` returns 404; new endpoints need verification. | Session 4 |
| D-071 | "Coming soon" tiles eliminated from home | Founder explicit: "what's the point of coming soon?" — drop missing tiles entirely. | Session 3 |
| D-072 | Featured tiles use measured parent industries, not sub-niches | Sub-niches may not resolve; parent always does. | Session 3 |

---

## 5 · API keys + secrets

All keys live in `E:\atlas\website\.env.local` (gitignored). Mirror these
to Vercel env vars to make them live in production where indicated.

| Key | Value (lookup in .env.local) | In Vercel? | Status | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://npfqasdghbffqgmzgxzr.supabase.co` | ✅ yes | works | Postgres + PostgREST |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | ✅ yes | works | Client-side reads |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_WNmSDeJjZf9QCdyQdjfmLA_ZFPNGRcf` | ✅ yes | works | Server-side reads + writes; bypasses RLS |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | `https://pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev` | ✅ yes | works | Cloudflare R2 public CDN (but R2 made private for lockdown) |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-QO9UXG_oxKO8...` (40+ chars) | ❌ NO | works but gated | Model: claude-sonnet-4-5. `/ask` route stays in preview until founder decides tone. To flip live: paste into Vercel Settings → Environment Variables. |
| `CENSUS_API_KEY` | `fe675776579e52608d53fcba230ea5a4f5889d18` | ❌ NO (not needed in Vercel; used only by ingest scripts) | works | US Census Bureau CBP/SUSB; rate-limited; used by `scripts/ingest/us_census/` |
| `DESTATIS_API_TOKEN` | `7ade8953b219486883cec3c549938227` | ❌ NO | works but blocked | Destatis GENESIS REST 2020 API; auth: POST + HTTP header `username: TOKEN`. Free tier catalogue limited to Germany + Länder only — Kreis data needs paid subscription. |
| `ESTAT_APP_ID` | `b71aaf298b2e3b51e5f161f8285d758806fdf5a4` | ❌ NO | works | Japan e-Stat (政府統計の総合窓口); pass as `?appId=KEY` URL param. Endpoint `http://api.e-stat.go.jp/rest/3.0/app/json/getStatsData`. |
| KOSIS Korea API | — | — | **IMPOSSIBLE TO GET** | KOSIS registration requires a Korean mobile phone number. Skipped permanently. |

**Founder's name on registrations:** `benet@researchtesseract.com` /
`Atlas Tesseract Research` / `Industry benchmarking research` /
URL `https://marginatlas.com`.

---

## 6 · Database state

### `cells_master` (US states, pre-existing from v1.5)

Schema: `country VARCHAR(2), geo_id TEXT, geo_level TEXT, geo_name TEXT,
naics_6 TEXT, naics_4 TEXT, industry_description TEXT, size_band TEXT,
year INTEGER, n BIGINT, total_employment BIGINT, total_payroll BIGINT,
mean_wage_per_employee_usd DOUBLE, rev_p10..rev_p90 DOUBLE,
quality_score INTEGER, coverage_tier VARCHAR, coverage_source TEXT,
currency VARCHAR(3)`

Row count: ~722,000. Geo level: `state` (US-01 through US-56).
Industries: NAICS-6. Mostly tier 'P' (US Census SUSB primary).

### `extrapolated_cells` (created by `scripts/migrations/001_extrapolated_cells.sql`)

Schema: `country_iso3 VARCHAR(3), country_name TEXT, year INTEGER,
industry_id TEXT, size_band TEXT, predicted_rev_per_firm DOUBLE,
coverage_tier VARCHAR, coverage_source TEXT, quality_score INTEGER`

PK: `(country_iso3, year, industry_id, size_band)`

Row count: 57,816. Coverage: 219 country codes (182 individual + 37 WB
aggregates). Notable absences: USA, GBR, DEU, FRA, ITA, ESP, JPN, BRA
were excluded as regression-fit anchors. Only 44 of 202 industries
covered.

### `regional_cells` (created by `scripts/migrations/002_regional_cells.sql`)

Schema: `country VARCHAR(2), geo_id TEXT, geo_level TEXT, geo_name TEXT,
industry_id TEXT, year INTEGER, size_band TEXT, n_enterprises BIGINT,
n_employees BIGINT, rev_p10..rev_p90 DOUBLE, revenue_per_firm DOUBLE,
payroll_per_employee DOUBLE, quality_score INTEGER, coverage_tier VARCHAR,
coverage_source TEXT, currency VARCHAR(3) DEFAULT 'USD'`

PK: `(country, geo_id, industry_id, year, size_band)`

Row count: **179,409**. Breakdown:
- US counties: 87,573 (Tier 'P', Phase 10)
- EU NUTS-1/2/3: 43,903 (Tier 'S', Phase 1)
- Global city overlay: 41,448 (Tier 'X', Phase 18)
- Japan prefectures + municipalities: 6,951 (Tier 'P', Phase 8)
- Brazil states + cities: 2,317 (Tier 'P' + 'X', Phase 15)
- Canada (partial, wrong source table): 65 (Tier 'P', Phase 11)

### Data layer access pattern (in `website/src/lib/cells.ts`)

```
getCellBySlug(country, geo, industry):
  if country == 'US':
    1. cells_master (US states + counties)
    → falls back to extrapolated_cells if no match
  else:
    1. regional_cells (sub-national for non-US countries)
    → falls back to extrapolated_cells (country-level)
    → applies PARENT_FALLBACK_MAP if sub-niche industry has no parent
```

The `resolveToMeasuredIndustry` chain in `taxonomy.ts` walks
`parent_id → PARENT_FALLBACK_MAP → self` so sub-niches like
`boutique_clothing` resolve to `textile_apparel_mfg` (which IS covered)
when no direct measurement exists.

---

## 7 · Codebase tour

### `E:\atlas\website/` — Next.js 15 App Router app (TypeScript, Tailwind 3.4, React 19 RC)

```
src/
├── app/
│   ├── page.tsx                    # Home: hero + navigator + first-frame strip + featured cells + sector master menu + cell-of-the-week + stats + what-you'll-see + newsletter
│   ├── layout.tsx                  # Root: header nav (Browse / Compare / How do I compare? / Ask / Blog / Pricing), footer 4 cols, Organization schema.org, GlobalSearch (Cmd+K)
│   ├── globals.css                 # Tailwind base + cream-page background + .flag class for Twemoji fallback + .card / .card-cream / .hairline component classes
│   ├── not-found.tsx               # Branded 404 with 4 helpful tiles
│   ├── about-data/                 # Generic data description (no source agencies named)
│   ├── ask/                        # AI query layer (preview-gated; AskClient.tsx + page.tsx)
│   ├── blog/                       # Markdown-driven blog index + [slug] route
│   ├── browse/                     # All countries grid (to be expanded later)
│   ├── compare/                    # 4-cell side-by-side (CompareClient.tsx + page.tsx). Wired to /api/cell-lookup
│   ├── embed/[country]/[geo]/[industry]/ # Iframe-friendly minimal cell view
│   ├── methodology/                # Redirects to /about-data (Phase A lockdown)
│   ├── pricing/                    # 4 tiers: Free / Starter / Pro / Enterprise
│   ├── random/                     # Route handler: 307-redirects to a rotating cell
│   ├── saved/                      # localStorage cells list + clear-all
│   ├── sectors/
│   │   ├── page.tsx                # All 20 visible sectors grid
│   │   └── [sector]/page.tsx       # Per-sector hero + top industries with quick stats + full industry grid + sister-sector chips
│   ├── you/                        # "Compare to me" calculator — privacy by design (numbers stay in browser)
│   ├── [country]/
│   │   ├── page.tsx                # Country landing: flag + name + tagline + coverage tier + top SMB industries + Compare CTA
│   │   └── [geo]/[industry]/
│   │       ├── page.tsx            # THE cell page (largest single file). Hero + DimensionSwitcher + AtlasScore + TypicalFirmCard + DistributionHistogram + DistributionBars + TimeSeriesChart + CellActions + Comparables + AcrossStatesStrip + 5-star QualityBadge + sticky right-rail CellPageNav
│   │       └── loading.tsx         # Skeleton matching real heights
│   └── api/
│       ├── ask/route.ts            # Anthropic agentic loop with query_cells tool + 10/hour IP rate-limit
│       ├── cell-lookup/route.ts    # Compact JSON cell fetch (used by /compare and /you)
│       ├── cell-snapshot/route.ts  # Per-cell preview for FeaturedCellTile
│       ├── popular-cell-snapshot/route.ts  # Rotating cell for FirstFrameStrip
│       ├── export-csv/route.ts     # Single-cell CSV with watermark + optional time series
│       └── newsletter/route.ts     # Email signup (writes to a Supabase table)
├── lib/
│   ├── supabase.ts                 # Supabase client singletons (anon + admin)
│   ├── cells.ts                    # ALL data access. Cell shape + getCellBySlug + getCellVariants + getTopCells + getComparableCells + getSameIndustryAcrossStates + getIndustryRankInState + getExtrapolatedCell + getTopIndustriesForCountry + cellUrl + slugify + listUsStates
│   ├── taxonomy.ts                 # SECTORS + INDUSTRIES + COUNTRIES + visibleSectors + visibleIndustries + visibleIndustriesInSector + sectorHasVisibleIndustries + LEGACY_SECTOR_ALIAS + resolveSector + resolveToMeasuredIndustry + PARENT_FALLBACK_MAP + naics6ToIndustry + slugToIndustry + industryToSlug + Gate type
│   ├── taxonomy/
│   │   ├── sectors.json            # v4 25-sector master menu (20 visible + 5 Pro)
│   │   └── industries.json         # v4 202 industries with audience tags
│   ├── countries.ts                # ISO-2 ↔ ISO-3 map + flagFromIso2 (regional indicators) + slug helpers
│   ├── blog.ts                     # Markdown parsing for /blog
│   ├── audience.ts                 # Server-side Pro gate (cookie + query param)
│   └── cn.ts                       # Tiny classname joiner
├── components/
│   ├── NavigatorForm.tsx           # The 6-field navigator (country / region / subdivision / sector / industry / size) with "Surprise me ✦" + "Show me the numbers →"
│   ├── ComboField.tsx              # Type-ahead combobox; matches label / examples / keywords
│   ├── GlobalSearch.tsx            # Cmd+K search across industries / countries / sectors
│   ├── SectorMasterMenu.tsx        # 20-tile grid in curated display order
│   ├── FeaturedCellTile.tsx        # Home tile; drops entirely if cell has no data (no "Coming soon")
│   ├── FirstFrameStrip.tsx         # Above-fold rotating-cell preview
│   ├── CellOfTheWeek.tsx           # Weekly-rotating curated cell card
│   ├── DimensionSwitcher.tsx       # Sticky in-page bar: industry / region / size / year pivots
│   ├── DistributionHistogram.tsx   # SVG piecewise-density from p10/p25/p50/p75/p90
│   ├── DistributionBars.tsx        # 5 horizontal tier bars
│   ├── TimeSeriesChart.tsx         # SVG sparkline + YoY pill
│   ├── TypicalFirmCard.tsx         # Derived ratios (employees/firm, revenue/employee, etc.)
│   ├── AcrossStatesStrip.tsx       # Bar list of same-industry across US states
│   ├── AtlasScore.tsx              # 0-100 composite score + Strong/Solid/Mixed/Tough chip
│   ├── QualityBadge.tsx            # Star rating + generic source descriptor (Plan A lockdown)
│   ├── CellPageNav.tsx             # Sticky right-rail TOC with IntersectionObserver
│   ├── CellActions.tsx             # Save (★) / Copy link / CSV / Embed action row
│   ├── SmartImage.tsx              # next/image wrapper with cream-gradient + emoji placeholder
│   ├── NewsletterSignup.tsx
│   ├── StructuredData.tsx          # JSON-LD: Dataset, Breadcrumbs, Article, Organization (stripped of source-leaking fields per Plan A)
│   └── Tooltip.tsx
└── middleware.ts                   # Edge: AI crawler → 451; bare scraper → 403; rate limit 60 req/min/IP

scripts/
└── verify_taxonomy.ts              # CI: structural invariants. Runs via `prebuild` in package.json. Fails build if banking ever appears in default visible sectors.

docs/
├── HANDOFF.md                      # THIS FILE
├── ingest/                         # 21 sub-national ingest plan docs
│   ├── 00_MASTER.md                # Strategy, sequence, RAM discipline
│   ├── 01-18_*.md                  # Per-phase docs
│   ├── 19_VERIFICATION_QUALITY.md  # Running scoreboard
│   ├── 99_EXECUTION_PROMPT.md      # Paste-back-to-execute
│   └── FINAL_REPORT.md             # Comprehensive end-of-session 4 report

PLAN_V3.md                          # SMB-first correction plan (session 2)
PLAN_V4.md                          # 30-step corrective plan after v3 review (session 3)
CLAUDE.md                           # Project rules / coding standards
package.json                        # Includes `prebuild: npx tsx scripts/verify_taxonomy.ts`
tailwind.config.ts                  # Expanded warm-earth palette (cream, moss, clay, cocoa, parchment families)
.env.local                          # All API keys (gitignored)
.gitignore                          # Standard Next.js + .env* (excludes .env.local)
```

### `E:\atlas\scripts/` — Python data engineering (NOT a git repo; intentional)

```
ingest/
├── common/
│   ├── ram_guard.py                # 600 MB cap context manager + tick(); psutil-based; abort + resume on overshoot
│   ├── upload_to_supabase.py       # Batched idempotent upserter (PostgREST resolution=merge-duplicates); 500 rows/batch; retry on 429/503; progress logging
│   ├── industry_mapper.py          # NAICS / NACE / ISIC / ANZSIC / JSIC / KSIC → industry_id; bridges to taxonomy.json
│   ├── currency_convert.py         # World Bank PA.NUS.FCRF cache + fallback table; per-year USD conversion
│   ├── geo_name_normalize.py       # UTF-8 + accent stripping + slugify
│   ├── quality_score.py            # Tier + completeness + recency → 0-100
│   ├── pagination.py               # Generic paginator with backoff
│   └── dedup.py                    # PK-stable client-side dedup
├── eu_eurostat/
│   └── fetch_nuts.py               # ✅ WORKING, EXECUTED. 43,903 rows. Strategy: pull all geos at once per (indic, year), merge in-memory.
├── jp_estat/
│   └── fetch.py                    # ✅ WORKING, EXECUTED. 6,951 rows. Table 0004040099 Economic Census 2024. Paginates 100k obs at a time.
├── us_census/
│   └── fetch_cbp.py                # ✅ WORKING, EXECUTED. 87,573 rows. 51 states × 73 NAICS-3 codes = 3,723 API calls. ~1h50m wall-time.
├── city_overlay/
│   ├── fetch.py                    # ✅ WORKING, EXECUTED. 41,448 rows. Derives cities from extrapolated_cells × city-share × productivity-premium.
│   └── fetch_br_cities.py          # ✅ WORKING, EXECUTED. 834 rows. Brazil-specific (BR absent from extrapolated_cells).
├── latam_cluster/
│   └── br_ibge.py                  # ✅ WORKING, EXECUTED. 1,483 rows. IBGE SIDRA table 6449 var 2585.
├── ca_statcan/
│   └── fetch.py                    # ⚠️ PARTIAL. 65 rows. Wrong source table — correct is 33-10-0418-01, retry needed.
├── gb_ons/
│   └── fetch.py                    # ⚠️ SCAFFOLD. NOMIS API needs numeric ID lookups (e.g. TYPE434 = LAD, 146800640 = SIC sections).
├── de_destatis/
│   └── fetch.py                    # ⚠️ AUTH WORKS but FREE TIER ONLY LÄNDER. Kreis-level requires paid subscription.
├── oecd/
│   └── fetch_region_gva.py         # ⚠️ SCAFFOLD. Endpoint migrated to sdmx.oecd.org with new dataflow names; needs verification.
├── wb/
│   └── fetch_enterprise.py         # ✅ AUDIT TOOL only (no rows added). Wrote delivery/regional/wb_followup.csv listing 158 countries needing follow-up.
├── es_ine/, it_istat/, kr_kosis/, fr_insee/, eu_lau/, in_mca/, cn_nbs/, sea_cluster/, mena_africa/, nz_stats/, au_abs/
│   └── (empty subfolders — to be populated)

migrations/
├── 001_extrapolated_cells.sql      # Applied
└── 002_regional_cells.sql          # Applied

audit_extrapolated_coverage.py      # Coverage audit; runs against Supabase; writes delivery/regional/*.csv
upload_extrapolated_cells.py        # Original uploader for the 57,816 extrapolated rows
migrate_industries_to_v4_sectors.py # One-shot migration; already run

delivery/regional/
├── eu_eurostat/                    # Progress files + cached metadata
├── us_census/                      # progress.json (resume support)
├── jp_estat/                       # progress.json
├── ca_statcan/                     # Source CSVs cached (~300 MB)
├── br_ibge/                        # 
├── phase01_eu_eurostat.log         # Per-phase execution logs
├── phase08_jp.log
├── phase10_us_census.log
├── phase15_br.log
├── phase18_city.log
└── wb_followup.csv                 # 158 countries needing follow-up ingest
```

---

## 8 · Ingest scripts inventory

### Tier A — WORKING + EXECUTED (rows live in regional_cells)

| Phase | Script | Rows | Notes |
|---|---|---|---|
| 1 | `eu_eurostat/fetch_nuts.py` | 43,903 | EU-27 + EFTA NUTS-1/2/3 |
| 8 | `jp_estat/fetch.py` | 6,951 | JP prefectures + 100+ municipalities |
| 10 | `us_census/fetch_cbp.py` | 87,573 | US ~1,700 counties × ~30 industries |
| 15a | `latam_cluster/br_ibge.py` | 1,483 | BR 27 UFs |
| 18 | `city_overlay/fetch.py` | 41,448 | 38 countries × 4-12 cities each |
| 18b | `city_overlay/fetch_br_cities.py` | 834 | 15 BR cities derived from state data |

### Tier B — WORKING but DUPLICATE or LIMITED

| Phase | Script | Notes |
|---|---|---|
| 3 | `de_destatis/fetch.py` | Auth works; free tier limit (Länder only) |
| 17 | `wb/fetch_enterprise.py` | Audit tool only; wrote follow-up CSV |

### Tier C — PARTIAL or BLOCKED

| Phase | Script | Blocker |
|---|---|---|
| 11 | `ca_statcan/fetch.py` | 65 rows from wrong source table (33-10-0270); correct is 33-10-0418-01 |
| 7 | `gb_ons/fetch.py` | NOMIS API needs numeric ID lookups for industry/geography |
| 17 | `oecd/fetch_region_gva.py` | OECD SDMX endpoint migrated; new dataflow names need verification |

### Tier D — SCAFFOLDED (empty subfolders ready)

`es_ine/`, `it_istat/`, `kr_kosis/` (impossible), `fr_insee/` (6 GB CSV
needs user download), `eu_lau/`, `in_mca/`, `cn_nbs/`, `sea_cluster/`,
`mena_africa/`, `nz_stats/`, `au_abs/`.

### How to run an ingest

Every script is self-contained and idempotent. From `E:\atlas`:

```bash
python scripts/ingest/<phase>/fetch.py
```

Each script:
1. Pre-fetches currency conversion rates
2. Wraps execution in `RamGuard(cap_mb=600)`
3. Writes progress to `delivery/regional/<phase>/progress.json` after each unit of work
4. Batches 500-row upserts to Supabase
5. Logs to stdout with per-batch progress
6. Can be killed and restarted; resume picks up where it left off

---

## 9 · Plan documents

| Doc | Status | Use |
|---|---|---|
| `PLAN_V3.md` | superseded | Reference only — SMB-first correction plan; many items already shipped or migrated to v4 |
| `PLAN_V4.md` | **CURRENT** | The 30-step corrective plan after v3 review; most items shipped in sessions 3-4. Open items: editorial (B.5/G/H), more sub-national, auth + Stripe |
| `docs/ingest/00_MASTER.md` | active | Sub-national ingest strategy + sequence + RAM budget + common contract |
| `docs/ingest/01-18_*.md` | reference | Per-phase plans; many marked DEFERRED or DONE |
| `docs/ingest/19_VERIFICATION_QUALITY.md` | **CURRENT** | Per-phase scoreboard + quality gates |
| `docs/ingest/99_EXECUTION_PROMPT.md` | superseded | Was used to bootstrap the ingest run; replaced by HANDOFF.md |
| `docs/ingest/FINAL_REPORT.md` | **CURRENT** | Comprehensive end-of-session-4 report |

---

## 10 · Open blockers + resolution paths

### Blocker 1: Cloudflare DNS — `marginatlas.com` returns 522

**Resolution (founder action, ~5 minutes):**

1. Cloudflare → marginatlas.com → DNS → Records
2. Delete row: `A · marginatlas.com · 192.64.119.209 · Proxied (orange)` (Namecheap parking)
3. Delete row: `CNAME · www · parkingpage.namecheap.com · Proxied (orange)`
4. Add: `CNAME · @ · 33b3dbcd78a448ad.vercel-dns-017.com · Proxy GREY (DNS only)`
5. Add: `CNAME · www · 33b3dbcd78a448ad.vercel-dns-017.com · Proxy GREY (DNS only)`
6. Leave 3 MX + 2 TXT records alone (email)
7. Vercel → Domains → click Refresh on both rows
8. Wait 2-10 min; reload `https://marginatlas.com`

If Cloudflare rejects CNAME at apex: use `A · @ · 76.76.21.21 · Proxy DNS only` instead.

### Blocker 2: Editorial tone — locks Plan v3 §B.5, G, H + `/ask` live mode

**Resolution (founder decision):**

Decide on tone for:
1. Per-cell narrative paragraphs (currently neutral fact)
2. Country landing page editorial blurbs
3. Sector deep-dive long-form content
4. Blog post voice
5. `/ask` AI response style

Then paste ANTHROPIC_API_KEY into Vercel env vars and `/ask` flips
from preview-stub to live agentic answers using `claude-sonnet-4-5`.

### Blocker 3: France Sirene (6 GB CSV)

**Resolution (founder action, ~30 min):**

1. Visit `https://www.data.gouv.fr/fr/datasets/r/eec3a04e-...` (StockUniteLegale)
2. Download `StockUniteLegale_utf8.zip` (~600 MB compressed)
3. Place at `E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv` (unzipped)
4. Tell me to execute. Pipeline streams via DuckDB at < 500 MB RAM.
Target: ~60,000 commune-level cells across top 2,000 communes + 45 arrondissements.

### Blocker 4: NAICS-3 taxonomy coverage gap

**Resolution (engineering, 1 hour):**

Current `industries.json` has 73 NAICS-3 codes mapped. US/CA/MX ingests
return many rows that fall through because NAICS-3 codes 441-454
(retail), 541 (professional services), 561 (admin support) etc. aren't
in our taxonomy's `naics_3` arrays. Expanding to full NAICS-3
universe (~250 codes) would 2-3× the yield of Phases 10, 11, 15.

### Blocker 5: Auth + Stripe (PLAN_V4 Phases 28-29)

**Status:** Pro gate is wired via `?pro=1` query string + `atlas_pro=1`
cookie. Real auth (Supabase magic link) and Stripe checkout NOT yet
built. Founder hasn't requested it yet.

### Blocker 6: Image assets

**Status:** All image surfaces use `SmartImage` placeholder (cream
gradient + emoji glyph). 18 surfaces identified in `PLAN_V3.md §11`.
Founder owns commissioning. No real images yet.

---

## 11 · Things to NEVER do

1. **NEVER use aquamarine, teal, or cyan in atlas UI** — those colours are reserved for Tesseract Stock Agent (founder's other product)
2. **NEVER reveal source agencies in user-visible text** — say "compiled business statistics", not "Eurostat sbs_r_nuts06_r2" — competitive moat
3. **NEVER name banking, oil & gas, pharma, or other corp-only industries in default UI** — they're behind a Pro gate
4. **NEVER use the word "okay" in responses to the founder** — flagged twice as annoying
5. **NEVER apologise repeatedly** — once is fine; move on
6. **NEVER commit `.env.local` to git** — it's gitignored; check before any commit
7. **NEVER use `pd.read_csv()` without `chunksize=`** on large files — DuckDB streams better
8. **NEVER run parallel ingest pipelines** — founder explicit, RAM constraint
9. **NEVER exceed 600 MB RSS per script** — use `ram_guard.py`; abort on overshoot
10. **NEVER push to main without `npx tsc --noEmit` passing** — TypeScript strict mode
11. **NEVER add Banking / Oil & Gas / Pharma to the visible sector list** — CI `verify_taxonomy.ts` will fail the build
12. **NEVER use `git push --force` to main** — destructive, not allowed
13. **NEVER skip pre-commit hooks with `--no-verify`** — fix the actual issue
14. **NEVER use the OLD Eurostat dataset URL pattern** (`stats.oecd.org/SDMX-JSON/`) — migrated; use `sdmx.oecd.org/public/rest/data/`
15. **NEVER pay for Destatis Kreis data** without founder explicit ok — duplicate of Eurostat NUTS-3 anyway
16. **NEVER add "Coming soon" placeholder tiles** — drop missing tiles entirely
17. **NEVER suggest the founder spend money** without giving a direct yes/no recommendation + alternatives

---

## 12 · Recommended next steps

Ranked by impact-per-effort, with explicit time estimates.

### Tier 1 — Founder-actionable quick wins

| # | Action | Owner | Time | Unlocks |
|---|---|---|---|---|
| 1 | Fix Cloudflare DNS for marginatlas.com | founder | 5 min | Production URL live |
| 2 | Decide editorial tone | founder | 30 min thinking | Phases B.5/G/H + /ask live mode |
| 3 | Paste ANTHROPIC_API_KEY into Vercel env vars | founder | 2 min | /ask flips live (do this after tone decision) |

### Tier 2 — High-value engineering (under 1 day each)

| # | Action | Estimated rows added | Time |
|---|---|---|---|
| 4 | Expand NAICS-3 coverage in `industries.json` | n/a but unlocks 2-3× yield on US/CA/MX phases | 1-2 hours |
| 5 | France Sirene execute (after founder downloads CSV) | ~60,000 commune cells | 2 hours |
| 6 | Canada StatCan retry with table 33-10-0418-01 | ~12,000 cells | 1 hour |
| 7 | OECD SDMX endpoint re-test with new dataflow IDs | ~8,000 regional cells | 2 hours |
| 8 | UK NOMIS numeric ID discovery + execute | ~30,000 LAD + MSOA cells | 3-4 hours |
| 9 | EU LAU per-country (NL, IT, ES, DE) | ~150,000 municipality cells | 5-8 hours |

### Tier 3 — Multi-day projects

| # | Action | Notes |
|---|---|---|
| 10 | Auth (Supabase magic link) + saved-cells migration | PLAN_V4 §28 |
| 11 | Stripe checkout for Pro tier | PLAN_V4 §29 |
| 12 | Real image production for 18 catalogued surfaces | Commission a designer; ~$3-5k total per PLAN_V3.md §11 |
| 13 | INE Spain + ISTAT Italy + AU ABS + NZ Stats + IN MCA | ~100,000 cells across remaining countries |
| 14 | Editorial content production (per-cell narratives, country pages, sector deep-dives) | Blocked on tone decision |

### Tier 4 — Polish + growth

- Print stylesheet, social-share OG images, status page, press kit
- "Atlas Score" badge generator for embeds
- Industry forecasts (multi-year trend)
- "Compare to me" landing page enhancements
- SEO: sitemap expansion, structured data audit, content marketing

---

## 13 · Sample URLs for verification

After Vercel deploys, use the `marginatlas-web-twtl.vercel.app` URL
(until DNS is fixed) and verify these render real data:

### EU NUTS coverage (Phase 1)
- `/de/de21/restaurants` (Oberbayern)
- `/it/itc4c/jewelry-stores` (Milan)
- `/fr/fr101/cosmetics-shops` (Paris département)
- `/es/es511/restaurants` (Barcelona)
- `/pl/pl12/software-development` (Warsaw region)
- `/nl/nl3/management-consulting` (Western Netherlands)
- `/se/se11/web-mobile-dev-shops` (Stockholm region)

### US counties (Phase 10)
- `/us/us-06-037/restaurants` (LA County)
- `/us/us-17-031/legal-services` (Cook County, Chicago)
- `/us/us-48-201/auto-repair-shops` (Harris County, Houston)
- `/us/us-06-085/software-development` (Santa Clara, Silicon Valley)
- `/us/us-25-025/management-consulting` (Suffolk County, Boston)

### Japan prefectures + municipalities (Phase 8)
- `/jp/jp-13000/restaurants` (Tokyo prefecture)
- `/jp/jp-27100/cafes-coffee-shops` (Osaka)
- `/jp/jp-26100/hotels-lodging` (Kyoto)
- `/jp/jp-23100/auto-repair-shops` (Nagoya)

### Brazil states + cities (Phase 15)
- `/br/br-sp/restaurants` (São Paulo state)
- `/br/br-rj/cafes-coffee-shops` (Rio state)
- `/br/br-city-sao-paulo/restaurants`
- `/br/br-city-rio-de-janeiro/cafes-coffee-shops`

### Global city overlay (Phase 18)
- `/us/city/new-york/restaurants`
- `/cn/city/shanghai/restaurants`
- `/in/city/mumbai/web-mobile-dev-shops`
- `/ru/city/moscow/restaurants`
- `/au/city/sydney/cafes-coffee-shops`
- `/mx/city/mexico-city/restaurants`

### Pro-only sectors (should be hidden unless `?pro=1`)
- Default visit to `/sectors` → 20 sectors visible, banking + mining absent
- `/sectors?pro=1` → 25 sectors visible including Finance (corp), Mining & energy

### Verify rate limiting + crawler block
- `curl -A "GPTBot" https://marginatlas.com/` → 451 Unavailable
- `curl https://marginatlas.com/` 70 times rapid → 60 succeed, then 429

---

## 14 · Founder action items

These items are blocking on founder. Listed in priority order.

| # | Item | Priority | Estimated time |
|---|---|---|---|
| 1 | Cloudflare DNS fix (delete 2 records, add 2 CNAMEs, grey cloud) | **HIGH** — production not live | 5 min |
| 2 | Editorial tone decision | **MEDIUM** — blocks 3 phases | 30 min thinking |
| 3 | Paste ANTHROPIC_API_KEY into Vercel env vars (after tone is set) | LOW | 2 min |
| 4 | Decide whether to commission real images for 18 surfaces ($3-5k) | LOW | TBD |
| 5 | France Sirene 6 GB CSV download (when ready for Phase 4) | LOW | 30 min download |
| 6 | Stripe + Supabase Auth setup (when ready for paid tiers) | LOW | 1 hour |

---

## 15 · Glossary

- **SMB**: Small and medium business — the target audience
- **NUTS**: Nomenclature of Territorial Units for Statistics (EU classification)
- **LAU**: Local Administrative Units (NUTS-4/5, municipalities)
- **NAICS**: North American Industry Classification System
- **NACE**: European industry classification (Rev.2)
- **JSIC**: Japan Standard Industrial Classification
- **KSIC**: Korean Standard Industrial Classification
- **ANZSIC**: Australia/New Zealand Standard Industrial Classification
- **CNAE**: Brazilian industry classification (~NACE)
- **CEMPRE**: IBGE's central business register
- **DENUE**: Mexico's national statistical directory of enterprises
- **CBP**: County Business Patterns (US Census)
- **SUSB**: Statistics of US Businesses
- **BRES**: Business Register and Employment Survey (UK)
- **Tier P/S/M/T/X**: Primary / Secondary / Modeled / Tabulated / Extrapolated quality tiers

---

*End of HANDOFF.md.*
*Next session: read this first, then proceed.*
