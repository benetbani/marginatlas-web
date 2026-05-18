# 04 · Current State Snapshot

> Captured at end of session 4 (2026-05-17). Refresh this file at the
> end of every major session so the next handoff is accurate.

---

## 1 · Live URLs

| URL | Status | Notes |
|---|---|---|
| `https://marginatlas.com` | ❌ **522 Cloudflare error** | DNS not fixed. See blocker B-001. |
| `https://www.marginatlas.com` | ❌ **522 Cloudflare error** | Same root cause |
| `https://marginatlas-web-twtl.vercel.app` | ✅ **200 OK** | Use this URL for any testing |
| Preview deployments | ✅ Working | One per branch / PR |

The Vercel deployment is healthy. The DNS layer is the only blocker
to making `marginatlas.com` resolve.

---

## 2 · Vercel project state

| Field | Value |
|---|---|
| Project | `marginatlas-web` |
| Owner | `Benet's projects` (Hobby tier) |
| Repo | `github.com/benetbani/marginatlas-web` |
| Production branch | `main` |
| Auto-deploy | Enabled |
| Build command | `next build` (which triggers `prebuild: npx tsx scripts/verify_taxonomy.ts` first) |
| Custom domains | `marginatlas.com` + `www.marginatlas.com` (both showing "Invalid Configuration") |
| Latest production deploy | (varies — check Vercel dashboard) |

---

## 3 · Vercel env vars (production)

| Variable | Status | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set | Production + Preview + Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set | Production + Preview + Development |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set | Production + Preview |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | ✅ Set | Production + Preview + Development |
| `ANTHROPIC_API_KEY` | ❌ **NOT SET in Vercel** | Intentionally absent — /ask stays in preview mode until tone is decided |

Note: when adding ANTHROPIC_API_KEY later, Vercel will flag it as
"sensitive" automatically (any var with `KEY` in the name). Sensitive
vars can be added to Production + Preview but NOT Development —
uncheck Development when adding.

---

## 4 · GitHub repo state

| Field | Value |
|---|---|
| URL | `github.com/benetbani/marginatlas-web` |
| Visibility | Private |
| Default branch | `main` |
| Recent commit count (last 48 hours) | 12+ commits |
| Open PRs | 1 (vercel/react-server-components-cve auto-PR) |
| Branch protection | Default (none) |
| CI | `prebuild` runs taxonomy verification |

`E:\atlas\website` is the local checkout. `E:\atlas\scripts` is NOT
in this repo (intentional — Python tooling lives outside the website
repo).

---

## 5 · Supabase project state

| Field | Value |
|---|---|
| Project name | Margin Atlas |
| Project ref | `npfqasdghbffqgmzgxzr` |
| Region | (check dashboard) |
| Tier | **Pro** ($25/month, 8 GB storage) |
| API URL | `https://npfqasdghbffqgmzgxzr.supabase.co` |
| Tables | `cells_master`, `extrapolated_cells`, `regional_cells` |
| Total row count | ~960,000 |
| Storage used | ~360 MB (4.5% of 8 GB) |

### Per-table row counts

| Table | Rows | Source |
|---|---|---|
| `cells_master` | ~722,000 | v1.5 US Census SUSB pre-existing data |
| `extrapolated_cells` | 57,816 | Regression-based country estimates (219 country codes) |
| `regional_cells` | **~357,000** | Sub-national data; sessions 3-11 (delta +170,121 across sessions 6-10 + session 11 added 142 new COUNTRIES via free-coverage unlock from existing extrapolated_cells) |

### regional_cells breakdown (Session 4 work)

| Country / source | Rows | Tier | Phase |
|---|---|---|---|
| United States (county-level via Census CBP) | 92,707 | P | 10 + Track C.3 re-execute (session 5) |
| EU-27 + EFTA (NUTS-1/2/3 via Eurostat) | 43,903 | S | 1 |
| Global city overlay (38 countries) | 41,448 | X | 18 |
| Japan (prefecture + municipality via e-Stat) | 6,951 | P | 8 |
| Canada (correct table 33-10-1095) | 2,227 | P | 11 + Track C.1 retry (session 5) |
| Australia (2,310 SA2s × ANZSIC × employment size) | 70,885 | P | Track G.2 (session 8) |
| Mexico (32 states + municipios × SCIAN 3-digit × strata) | 55,454 | P | Track I.1 (session 9) |
| Wave 3 city overlay (AL+RU ext+KZ+AZ+GE+IL+CH+AT+microstates) | 13,464 | X | session 10 (city derivations via extrapolated proxies; AL/CH/AT seeded from MNE) |
| United Kingdom (382 LADs × SIC 2-digit) | 15,816 | P | Track E.2 (session 7) |
| Spain (52 provinces × CNAE × strata) | 11,287 | P | Track D.5 (session 6) |
| Netherlands (483 gemeenten × SBI sections) | 4,799 | P | Track D.2 (session 6) |
| Brazil (state via IBGE) | 1,483 | P | 15 |
| Brazil cities (derived from BR states) | 834 | X | 18b |

### RLS policies

- `extrapolated_cells` — public SELECT
- `regional_cells` — public SELECT
- `cells_master` — public SELECT (pre-existing)
- All inserts/updates require service-role key

---

## 6 · Cloudflare state

| Field | Value |
|---|---|
| Domain | `marginatlas.com` |
| Account | (founder's personal Cloudflare) |
| DNS records (current — BROKEN) | A: `marginatlas.com → 192.64.119.209` (Namecheap parking, proxied), CNAME: `www → parkingpage.namecheap.com` (proxied) |
| MX records (intact) | `route1/2/3.mx.cloudflare.net` |
| TXT records (intact) | `cf2024-1._domainkey`, SPF `marginatlas.com v=spf1 …` |
| R2 bucket | Private (URL exists but access restricted) |

### What's needed (B-001)

Delete the 2 Namecheap parking records, add 2 Vercel CNAMEs with
**grey cloud** (DNS only):

- `CNAME @ → 33b3dbcd78a448ad.vercel-dns-017.com` (grey)
- `CNAME www → 33b3dbcd78a448ad.vercel-dns-017.com` (grey)

Click-by-click in `09_BLOCKERS_AND_RESOLUTIONS.md` §B-001.

---

## 7 · Local development state

| Path | Purpose | Status |
|---|---|---|
| `E:\atlas\website\` | Next.js app (git repo) | Active development |
| `E:\atlas\website\.env.local` | Local env vars (gitignored) | All 5 API keys configured |
| `E:\atlas\website\node_modules\` | npm dependencies | Run `npm install` if missing |
| `E:\atlas\website\.next\` | Build cache | Auto-managed |
| `E:\atlas\scripts\` | Python ingest tooling (NOT a git repo) | All shipped helpers + per-phase scripts |
| `E:\atlas\scripts\ingest\common\` | 8 reusable helpers | All implemented |
| `E:\atlas\scripts\ingest\<phase>\` | Per-phase scripts | Status varies — see `08_INGEST_SCRIPTS.md` |
| `E:\atlas\delivery\regional\` | Ingest progress files + cached source data | Multi-GB; preserved for resume |
| `E:\atlas\delivery\fx_cache\` | World Bank FX cache | ~50 KB JSON |

### Running dev server

```bash
cd E:\atlas\website
npm run dev    # starts on http://localhost:3000
```

### Type-checking

```bash
cd E:\atlas\website
npx tsc --noEmit
```

### Verifying taxonomy structure

```bash
cd E:\atlas\website
npx tsx scripts/verify_taxonomy.ts
```

### Running an ingest pipeline

```bash
cd E:\atlas
python scripts/ingest/<phase>/<script>.py
```

---

## 8 · What's working live

### Frontend (verifiable on `marginatlas-web-twtl.vercel.app`)

| Surface | Status |
|---|---|
| Home page (hero, navigator, featured cells, sector menu, cell-of-the-week, stats, what-you'll-see, newsletter) | ✅ Live |
| Cell page for any covered cell | ✅ Live |
| Country landing pages (`/us`, `/de`, `/jp`, etc.) | ✅ Live |
| Sector landing pages (`/sectors/food_drink`, etc.) | ✅ Live |
| Sectors index (`/sectors`) | ✅ Live |
| Compare page | ✅ Live (wired to /api/cell-lookup) |
| Compare-to-me (`/you`) | ✅ Live |
| Saved cells (`/saved`) | ✅ Live (localStorage) |
| Embed view | ✅ Live |
| Blog (`/blog`) | ✅ Live (empty content; markdown loader works) |
| About data (`/about-data`) | ✅ Live |
| Pricing | ✅ Live |
| 404 | ✅ Branded |
| Cmd+K search | ✅ Live |
| Random cell (`/random`) | ✅ Live |
| /ask (preview-stub mode) | ✅ Returns stub message |

### Backend / data

| Capability | Status |
|---|---|
| US state cells from cells_master | ✅ ~722k rows queryable |
| US county cells from regional_cells | ✅ 87,573 rows queryable |
| EU NUTS-1/2/3 from regional_cells | ✅ 43,903 rows queryable |
| Country-level extrapolation fallback | ✅ 57,816 rows queryable |
| City overlay (38 countries) | ✅ 41,448 rows queryable |
| Sub-niche → parent fallback (PARENT_FALLBACK_MAP) | ✅ Active |
| Quality badge generic source labels | ✅ Active |

### API routes

| Endpoint | Status |
|---|---|
| `/api/cell-lookup` | ✅ Live |
| `/api/cell-snapshot` | ✅ Live |
| `/api/popular-cell-snapshot` | ✅ Live |
| `/api/export-csv` | ✅ Live (single-cell CSV with watermark) |
| `/api/ask` | ⚠️ Preview-stub mode |
| `/api/newsletter` | ✅ Live |

### Edge middleware

| Behaviour | Status |
|---|---|
| AI training crawlers → 451 | ✅ Active |
| Bare scrapers (curl/wget no Accept-Language) on /api/* or cell pages → 403 | ✅ Active |
| Per-IP rate limit 60 req/min → 429 | ✅ Active |

---

## 9 · What's broken or pending

| Item | Status | Blocked on |
|---|---|---|
| `marginatlas.com` DNS | 522 | Founder Cloudflare action (B-001) |
| /ask live mode | preview-stub | Editorial tone decision (D-040) + ANTHROPIC_API_KEY paste in Vercel |
| Real editorial content (per-cell, country, sector) | not started | Editorial tone decision (D-040) |
| France Sirene ingest | scaffolded | 6 GB CSV needs founder-side download |
| Korea KOSIS ingest | impossible | Korean phone required |
| Germany Kreis ingest | duplicate | Free tier limit; Eurostat covers anyway |
| EU LAU per-country (NL, IT, ES, DE municipalities) | scaffolded | Per-source dataset probe needed |
| OECD regional overlay | scaffolded | Endpoint migration; new dataflow IDs |
| Auth (Supabase Auth) | not started | Founder waiting for paid-tier launch readiness |
| Stripe checkout | not started | Same as auth |
| Real images (18 surfaces) | placeholders | Founder commissioning |
| NAICS-3 taxonomy expansion (73 → ~250 codes) | not started | Engineering, 1-2 hours |
| Canada retry with correct table (33-10-0418-01) | not started | Engineering, ~1 hour |

---

## 10 · What was last touched

| File / area | When | What |
|---|---|---|
| `docs/handoff/` (this folder) | Session 4 final | Created; replaces single HANDOFF.md |
| `docs/HANDOFF.md` | Session 4 | Created as single doc, now superseded by the handoff/ folder |
| `docs/ingest/FINAL_REPORT.md` | Session 4 | Expanded with per-script Tier A/B/C/D inventory |
| `docs/ingest/19_VERIFICATION_QUALITY.md` | Session 4 | Updated scoreboard with US Census final + 6 other phases |
| `scripts/ingest/us_census/fetch_cbp.py` | Session 4 | Executed; 87,573 rows landed |
| `scripts/ingest/jp_estat/fetch.py` | Session 4 | Executed; 6,951 rows landed |
| `scripts/ingest/latam_cluster/br_ibge.py` | Session 4 | Executed; 1,483 rows landed |
| `scripts/ingest/city_overlay/fetch_br_cities.py` | Session 4 | Executed; 834 rows landed |
| `scripts/ingest/common/*.py` (8 files) | Session 4 | All written from scratch |
| `src/lib/taxonomy/sectors.json` | Session 3 | v4 25-sector menu |
| `src/lib/taxonomy/industries.json` | Session 3 | v4 202 industries |
| `src/lib/taxonomy.ts` | Session 3-4 | visibleSectors, PARENT_FALLBACK_MAP, resolveToMeasuredIndustry |
| Every component in `src/components/` | Sessions 2-3 | Visual refresh + new components (CellOfTheWeek, FirstFrameStrip, SectorMasterMenu, etc.) |

---

## 11 · How to verify the live state quickly

```bash
# Total regional_cells row count
curl -s 'https://npfqasdghbffqgmzgxzr.supabase.co/rest/v1/regional_cells?select=country&limit=1' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: count=exact" \
  -I 2>&1 | grep -i content-range
# expect: Content-Range: 0-0/179409

# Vercel preview is up
curl -sI -L https://marginatlas-web-twtl.vercel.app | head -3
# expect: HTTP/1.1 200 OK

# Production is broken
curl -sI -L -k https://marginatlas.com 2>&1 | head -3
# expect: HTTP/1.1 522

# A specific cell renders
curl -s https://marginatlas-web-twtl.vercel.app/us/california/restaurants | grep -c '<h1'
# expect: at least 1
```
