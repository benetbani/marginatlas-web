# 01 · Project Overview

---

## 1 · What Margin Atlas is, in one paragraph

Margin Atlas is a global small-business benchmarking database
positioned at `marginatlas.com`. It exposes revenue, employment,
wage, and firm-count benchmarks for ~180 SMB-relevant industries
across 219 countries, with sub-national depth down to NUTS-3 /
US-county / JP-municipality / BR-city level where source data
permits. The product is deliberately curated around the
small-business audience — banking, oil and gas, pharmaceuticals,
telecom carriers, and other large-corporation industries are hidden
by default behind a Pro-tier toggle.

---

## 2 · Target user

The product exists for one persona, in three flavours:

| Persona flavour | Typical query | What they value |
|---|---|---|
| Small-business operator | "What does a typical café in Lyon earn?" | Concrete, locally-specific numbers |
| Aspiring founder | "Can a bike shop in Berlin pay rent?" | Realistic distributions, not just averages |
| Boutique consultant | "How does my client's revenue compare to peers?" | Distribution percentiles + sub-national depth |

NOT the target:

- Public-company analysts (they have Bloomberg, S&P, FactSet)
- Banking / private-equity due-diligence teams (different tools)
- Macro economists (use OECD, World Bank directly)

---

## 3 · Why this product exists (gap in market)

Existing tools fall into two camps:

**Camp A — public-company financial data** (Bloomberg, S&P Capital
IQ, PitchBook, FactSet): rich data on tens of thousands of listed
firms, but those firms are not representative of the median local
business. A typical user query like "what does a typical hair salon
in Berlin earn" has no answer in Bloomberg.

**Camp B — local-government statistical agencies** (US Census, INSEE,
Destatis, e-Stat, IBGE, etc.): the raw data exists but is locked
inside per-country APIs with idiosyncratic classifications, no
cross-country comparability, no unified taxonomy, and impenetrable
URLs like `sbs_r_nuts06_r2?indic_sb=V11210&geo=DE21&time=2020`.

Margin Atlas sits between the two. It pulls from Camp B sources,
normalises to a unified industry × geography schema, and exposes a
human-readable URL space (`/de/munich/restaurants`,
`/fr/paris/cosmetics-shops`, `/in/mumbai/web-mobile-dev-shops`) with
distributions, time series, and quality ratings.

---

## 4 · Business model and pricing

### Pricing locked

| Tier | Monthly | Annual | What's included |
|---|---|---|---|
| Free | $0 | — | 50 cell previews/month, p50 only, watermarked 100-row CSV export |
| Starter | $38 | $304 (4 months free) | Unlimited cell views, full p10/p25/p50/p75/p90, CSV/Excel up to 10k rows, 5 saved searches, 50 AI queries |
| Pro | $78 | $624 (4 months free) | Everything in Starter + 100k-row exports + Parquet format + unlimited saved + unlimited AI queries + quarterly bulk-data drop |
| Enterprise | from $150 | $1,200+ | Everything in Pro + API access + custom slices + white-label exports + Slack support + bespoke pricing |

### Pricing rules

- Annual price = 8 × monthly price (4 months free; 33% discount)
- Pro and Starter offer a 7-day free trial
- Enterprise is invoice-only (no Stripe checkout)
- No payment processing live yet — Stripe integration is Phase R / PLAN_V4 §29
- Pro tier currently gated by `?pro=1` URL query string or
  `atlas_pro=1` cookie

### Auth status

Not yet built. Free tier works without auth. Saved cells are
localStorage. Future Phase R / PLAN_V4 §28 wires Supabase Auth
(email magic link + Google OAuth) + migrates saves to a per-user
table.

---

## 5 · Competitive positioning

| Player | Strength | Why Margin Atlas wins for SMB |
|---|---|---|
| Bloomberg, S&P Capital IQ, FactSet | Listed-company depth | Doesn't cover the long tail of local SMBs |
| IBISWorld, Statista | Industry reports | Country-level only, expensive, not granular |
| US Census, Eurostat directly | Free, authoritative | Per-country, per-table, no unified UX |
| Yelp, OpenCorporates | Per-firm directories | No revenue/distribution data |
| **Margin Atlas** | Cross-country normalised SMB benchmarks at sub-national depth | The unique combination |

### Competitive moat

The moat is *curation + normalisation*, not raw data (the data is
public). Three deliberate moats:

1. **Methodology lockdown** (decision D-030/D-031/D-032/D-033/D-034):
   user-visible text never names source agencies, schema.org is
   stripped, AI crawlers are blocked. A competitor with an LLM
   cannot easily reverse-engineer which dataset feeds which cell.
2. **Unified taxonomy** (decisions D-012/D-013): 25-sector master
   menu plus 202 industries plus per-country classification
   crosswalks (NACE/NAICS/JSIC/CNAE/ANZSIC/KSIC/ISIC). Replicating
   this takes weeks of careful work.
3. **SMB-only curation** (decision D-010/D-011): the default UI hides
   industries where SMBs don't participate meaningfully. Competitors
   that throw all data at the user dilute their own value.

---

## 6 · The parent entity and sibling products

**Tesseract Research** is the parent entity. The founder
(`benet@researchtesseract.com`) runs multiple products under it.

Sibling products + their reserved colours / namespaces (do NOT
overlap):

| Product | Colour reserved | Atlas must not use |
|---|---|---|
| Tesseract Stock Agent | Aquamarine `#36C6CC`, light aqua `#7BE2E6`, deep aqua `#16AEB5` | Any aquamarine / teal / cyan |
| Tesseract Portfolio Engine | Emerald green | Heavy emerald (moss is fine — moss is the warm-yellow-green, not the cool green) |
| Tesseract Catalyst Engine | Violet `#5e47de` | Any violet / purple |
| **Margin Atlas** | Burnt amber + warm graphite + cream + parchment + moss + clay + cocoa | Owns the warm-earth-tone palette |

The amber + warm graphite palette is reserved for Atlas alone. Any
new product would need to pick a different family.

---

## 7 · Public surfaces

| Surface | URL | Status |
|---|---|---|
| Main site (canonical) | `https://marginatlas.com` | **522 error** (DNS not fixed yet, see B-001) |
| Vercel preview (fallback) | `https://marginatlas-web-twtl.vercel.app` | **Working** — use this for any test |
| GitHub repo (private) | `https://github.com/benetbani/marginatlas-web` | Active; auto-deploys from `main` to Vercel |
| Supabase project | `https://npfqasdghbffqgmzgxzr.supabase.co` | Pro tier, 8 GB |
| Cloudflare R2 (private now) | `https://pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev` | Public access disabled per lockdown |
| Hugging Face dataset (private) | `huggingface.co/datasets/<benetbani>/atlas` | Made private per lockdown |
| GitHub atlas-data repo (private) | `github.com/benetbani/atlas-data` | Made private per lockdown |
| Email contact | `hello@marginatlas.com` (configured via Cloudflare MX) | Working |
| Newsletter | Internal Supabase table | Working |

---

## 8 · Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js 15.0.7 App Router | Server components, ISR, edge middleware |
| UI library | React 19 RC + Tailwind 3.4 | Latest features; tailwind for rapid iteration |
| TypeScript | Strict mode | Catches schema drift early |
| Hosting | Vercel Hobby | Free tier; auto-deploys |
| Database | Supabase Pro Postgres | 8 GB storage; connection pooling; backups |
| Storage (cold) | Cloudflare R2 | $0.01/mo; for parquet exports |
| AI | Anthropic API (claude-sonnet-4-5) | Used by /ask route; gated by editorial tone decision |
| Industry data ingest | Python 3.13 + DuckDB | Streaming aggregation under 600 MB RAM |
| Currency conversion | World Bank PA.NUS.FCRF cache | Free, comprehensive |
| Analytics | None yet | Plausible or Vercel Analytics later |
| CI | npm prebuild script (`verify_taxonomy.ts`) | Fails build on structural drift |

---

## 9 · Product principles (informal but adhered to)

1. **The middle firm is the hero.** Median revenue, median firm
   size, median wage. Mean is misleading.
2. **Distribution over point estimate.** Every cell shows p10, p25,
   p50, p75, p90 — the spread tells the truth.
3. **Quality is a visible signal.** Every cell carries a 5-star
   rating (Tier P/S/M/T/X). No black boxes.
4. **Friendly names over codes.** Users see "restaurants in
   California", never "NAICS 722 in US-06".
5. **Don't pretend to know what you don't.** Missing values render
   as "—", not zero or a default.
6. **City > region > state > country.** The deeper the geographic
   granularity, the more valuable the cell.
7. **SMB-first, corp-second.** Banking-and-friends are a Pro feature,
   not a free-tier feature.
8. **The atlas reads, not the user.** Pre-curated featured cells
   above the fold so first-time visitors don't have to type.

---

## 10 · Plans hierarchy

| Doc | Authority | Use when |
|---|---|---|
| `PLAN_V3.md` | Superseded | Reference for sessions 2-3 context |
| `PLAN_V4.md` | **Current authoritative roadmap** | Default reference for unshipped items |
| `docs/ingest/00_MASTER.md` and `01-18_*.md` | Per-phase reference | When executing a specific sub-national ingest phase |
| `docs/handoff/11_NEXT_STEPS.md` | Operational priority list | When founder says "what's next?" |

---

## 11 · Major shipped capabilities

This is a snapshot of what works today. Specifics in
`04_CURRENT_STATE.md` and `07_CODEBASE_TOUR.md`.

### Backend / data

- 25-sector master menu (20 visible + 5 Pro-only)
- 202 industries with audience tags
- CI-enforced taxonomy invariants (`verify_taxonomy.ts`)
- Three-table data layer with parent-fallback resolution
- 179,409 measured sub-national cells (regional_cells)
- 722,000 US state-level cells (cells_master)
- 57,816 country-level regression estimates (extrapolated_cells)
- 8 reusable Python ingest helpers
- 6+ executed ingest pipelines (EU NUTS, US Census, JP, BR, city overlay)
- API endpoints for: cell lookup, cell snapshot, popular-cell snapshot,
  CSV export, ask (preview-stub), random, newsletter

### Frontend

- Home with hero + navigator + first-frame strip + 12 featured
  cells + sector master menu + cell-of-the-week + stats + newsletter
- Cell page with: hero + dimension switcher + AtlasScore +
  TypicalFirmCard + DistributionHistogram + DistributionBars +
  TimeSeriesChart + CellActions + AcrossStatesStrip +
  QualityBadge + sticky right-rail nav
- Country landing pages with flag + tagline + top industries
- Sector landing pages with hero + top industries + sister sectors
- Compare page (live API, 4 cells)
- Compare-to-me (`/you`) privacy-by-design calculator
- Saved cells (localStorage; 5-cell free cap)
- Embed view at `/embed/[country]/[geo]/[industry]`
- Cmd+K global search
- Edge middleware: AI-crawler block, bare-scraper block, rate limit
- Branded 404 with helpful tiles
- Loading skeletons matching cell-page heights
- Full warm-earth-tone palette (cream + parchment + moss + clay +
  cocoa + atlas amber + sparse deep teal)

### Operational

- Methodology lockdown live (source agencies never named in UI)
- robots.txt blocks AI crawlers
- Schema.org JSON-LD stripped of source-leaking fields
- Supabase Pro upgraded
- Vercel auto-deploys from `main`

---

## 12 · Major unshipped / blocked

- Editorial tone decision (blocks Phases B.5/G/H + /ask live mode)
- Cloudflare DNS for `marginatlas.com` (founder action)
- France Sirene 6 GB CSV (founder-side download)
- Auth + Stripe (deferred until founder asks)
- Real images for 18 catalogued surfaces (founder commissions)
- ~40-60 more countries' sub-national ingest (per-source per-phase work)

See `11_NEXT_STEPS.md` for prioritised roadmap.
