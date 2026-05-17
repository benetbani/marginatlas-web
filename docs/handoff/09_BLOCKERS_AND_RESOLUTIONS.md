# 09 · Blockers and Resolution Paths

> Every open blocker with stable ID, impact, owner, and click-by-click
> resolution. Update this file whenever a blocker is resolved or a
> new one emerges.

---

## 1 · Blocker summary table

| ID | Title | Severity | Owner | Resolution time | Status |
|---|---|---|---|---|---|
| **B-001** | Cloudflare DNS for marginatlas.com | HIGH | Founder | 5 min | OPEN |
| **B-002** | Editorial tone undecided | MEDIUM | Founder | 30 min thinking | OPEN |
| **B-003** | France Sirene 6 GB CSV download | LOW | Founder | 30 min download | OPEN |
| **B-004** | NAICS-3 taxonomy coverage gap | MEDIUM | Engineering | 1-2 hours | OPEN |
| **B-005** | Canada StatCan wrong source table | LOW | Engineering | 1 hour | OPEN |
| **B-006** | OECD SDMX endpoint migration | LOW | Engineering | 2 hours | OPEN |
| **B-007** | UK NOMIS numeric ID lookup | LOW | Engineering | 3-4 hours | OPEN |
| **B-008** | Real images for 18 surfaces | LOW | Founder + designer | TBD | OPEN |
| **B-009** | Korea KOSIS impossible | PERMANENT | — | — | CLOSED (permanent skip) |
| **B-010** | Germany Destatis Kreis paid-only | PERMANENT | — | — | CLOSED (DUPLICATE — Eurostat covers) |
| **B-011** | Auth + Stripe not built | DEFERRED | Engineering | 2-3 days | OPEN (deferred until founder asks) |
| **B-012** | EU LAU per-country pipelines | LOW | Engineering | 5-8 hours | OPEN |
| **B-013** | Smaller country ingest pipelines | LOW | Engineering | Multi-day | OPEN |

---

## 2 · B-001 · Cloudflare DNS for marginatlas.com

### Impact

The canonical production URL `https://marginatlas.com` returns
Cloudflare 522 (origin unreachable). This is the only thing blocking
the public-facing site. Vercel deployment is healthy; the preview
URL `marginatlas-web-twtl.vercel.app` works.

### Root cause

DNS at Cloudflare still points at the Namecheap parking page:

- `A · marginatlas.com → 192.64.119.209` (proxied, orange cloud)
- `CNAME · www → parkingpage.namecheap.com` (proxied)

Cloudflare proxy in front of an unreachable origin returns 522.

### Resolution (founder action, 5 minutes)

**Cloudflare → DNS Records:**

1. Find row `A · marginatlas.com · 192.64.119.209 · Proxied (orange)` → Edit ▶ → Delete → confirm.
2. Find row `CNAME · www · parkingpage.namecheap.com · Proxied (orange)` → Edit ▶ → Delete → confirm.
3. Confirm 3 MX records (route1/2/3.mx.cloudflare.net) untouched.
4. Confirm 2 TXT records (DKIM `cf2024-1._domainkey` + SPF) untouched.
5. Click blue **+ Add record** button (top-right):
   - **Type:** `CNAME`
   - **Name:** `@` (at-sign = root domain)
   - **Target:** `33b3dbcd78a448ad.vercel-dns-017.com`
   - **Proxy status:** click the orange cloud once so it turns **GREY** (DNS only)
   - **TTL:** Auto
   - Click **Save**
6. Click **+ Add record** again:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `33b3dbcd78a448ad.vercel-dns-017.com` (same)
   - **Proxy status:** **GREY**
   - **TTL:** Auto
   - Click **Save**
7. Vercel dashboard → marginatlas-web project → Settings → Domains → Click Refresh on both rows.
8. Wait 2-10 minutes; reload `https://marginatlas.com`.

If Cloudflare refuses CNAME at apex: use `A · @ · 76.76.21.21 · Proxy: DNS only` instead.

### How to verify resolved

```bash
curl -sI -L https://marginatlas.com | head -3
# expect: HTTP/1.1 200 OK (after DNS propagates)
```

---

## 3 · B-002 · Editorial tone undecided

### Impact

Three things blocked:

1. Per-cell narrative paragraphs (Plan v3 §B.5) — currently neutral fact
2. Country landing page editorial blurbs (Plan v3 §G)
3. Sector deep-dive long-form content (Plan v3 §H)
4. `/ask` AI route live mode (currently preview-stub)

### Why it's blocked

The founder explicitly said the tone hasn't been decided. Different
parts of the site may need different tones — technical pages neutral,
blog more voice-driven, AI responses somewhere in between.

### Resolution (founder decision)

Need decisions on:

1. **Per-cell narrative voice.** Options: dry-factual (current), data-journalism (e.g. "Restaurants in California cluster between $200K and $1.5M annual revenue, with a long right tail"), conversational, founder-first-person.

2. **Country landing copy.** Options: encyclopedic, magazine-tone, listicle-friendly.

3. **Sector deep-dive voice.** Options: McKinsey-report tone, IBISWorld-tone, blog-style.

4. **Blog voice.** Options: technical, opinionated, mixed.

5. **/ask response style.** Options: terse-direct, conversational, citation-heavy.

Once decided:

1. Update `src/app/[country]/[geo]/[industry]/page.tsx` to include the narrative paragraph in the new voice
2. Update `src/app/[country]/page.tsx` for country pages
3. Update `src/app/sectors/[sector]/page.tsx` for sectors
4. Update `src/app/api/ask/route.ts` system prompt to encode the chosen /ask voice
5. Add ANTHROPIC_API_KEY to Vercel env vars to flip /ask live (see B-002b below)

### B-002b · Sub-task: paste ANTHROPIC_API_KEY into Vercel

Once tone is decided:

1. Vercel dashboard → marginatlas-web → Settings → Environment Variables
2. **Add New** button (top-right)
3. **Key:** `ANTHROPIC_API_KEY`
4. **Value:** paste from `.env.local` line 11
5. **Environments:** UNCHECK Development, CHECK Production + Preview
6. **Sensitive** toggle: leave ON
7. Click **Save**
8. Deployments tab → latest production deploy → three-dot menu → **Redeploy**
9. Wait ~60s; test by posting to `/api/ask` with a real question

---

## 4 · B-003 · France Sirene 6 GB CSV download

### Impact

Phase 4 (France communes) blocked. Estimated yield: ~60,000
commune-level cells across top 2,000 communes + 45 Paris/Lyon/
Marseille arrondissements.

### Why it's blocked

Sirene "Stock Unités Légales" is ~600 MB compressed / ~6 GB
uncompressed. Founder-side bandwidth needed to download once.

### Resolution

**Founder action:**

1. Visit `https://www.data.gouv.fr/fr/datasets/r/eec3a04e-...` (StockUniteLegale page)
   - Or search "Sirene Stock Unités Légales" on data.gouv.fr
2. Download `StockUniteLegale_utf8.zip` (~600 MB)
3. Unzip locally
4. Place `StockUniteLegale.csv` at `E:\atlas\delivery\regional\fr_insee\StockUniteLegale.csv`
5. Tell me; I'll execute the pipeline (~2 hours, uses DuckDB to stream-aggregate under 500 MB RAM)

### What I'll do once CSV is in place

1. Write `scripts/ingest/fr_insee/aggregate.py` (DuckDB SQL to aggregate per (commune, NAF-3, employee_band))
2. Write `scripts/ingest/fr_insee/normalize.py` (NAF → industry_id mapping)
3. Write `scripts/ingest/fr_insee/upload.py`
4. Write `scripts/ingest/fr_insee/run.py` (orchestrator)
5. Execute; expect ~60,000 commune cells

---

## 5 · B-004 · NAICS-3 taxonomy coverage gap

### Impact

Current `industries.json` has 73 NAICS-3 codes mapped. The full
NAICS-3 universe is ~250 codes. US Census / Canada StatCan / Mexico
INEGI ingests return many rows that fall through because NAICS-3
codes 441-454 (retail), 541 (professional services), 561 (admin
support), etc. aren't in our taxonomy's `naics_3` arrays.

Expanding to full NAICS-3 universe would 2-3× the yield of Phases 10
(US), 11 (CA), and Mexico ingest when it lands.

### Resolution (engineering, 1-2 hours)

1. Pull the full NAICS-3 list from `https://www.census.gov/naics/`
2. For each unmapped NAICS-3 code, decide which existing industry_id
   it belongs to OR create a new sub-niche industry_id
3. Update `src/lib/taxonomy/industries.json` — add `naics_3` codes to
   existing entries, add new entries for genuinely new industries
4. Run `npx tsx scripts/verify_taxonomy.ts` — confirm CI passes
5. Re-execute Phase 10 (US Census):
   ```bash
   rm -f E:\atlas\delivery\regional\us_census\progress.json
   python E:\atlas\scripts\ingest\us_census\fetch_cbp.py
   ```
6. Verify row count increase

### Expected impact

- US Phase 10: +~50,000 rows (current 87,573 → ~140,000)
- Canada (after B-005 fix): +~12,000 rows
- Mexico (when INEGI lands): +~25,000 rows

---

## 6 · B-005 · Canada StatCan wrong source table

### Impact

Phase 11 Canada (PARTIAL) has only 65 rows because the pipeline
pulled from table `33-10-0270-01` (Business dynamics survey) which
is the WRONG dataset.

### Root cause

Wrong dataset name lookup. The right table for Canadian Business
Counts at NAICS-4 × province is `33-10-0418-01`.

### Resolution (engineering, ~1 hour)

```python
# In E:\atlas\scripts\ingest\ca_statcan\fetch.py, change line:
table = "33100307"
# to:
table = "33100418"
```

Then:

```bash
rm -f E:\atlas\delivery\regional\ca_statcan\33100307.csv
python E:\atlas\scripts\ingest\ca_statcan\fetch.py
```

### Expected yield

~12,000 rows.

---

## 7 · B-006 · OECD SDMX endpoint migration

### Impact

Phase 17 OECD overlay scaffolded but doesn't execute. Old endpoint
`stats.oecd.org/SDMX-JSON/data/` returns 404.

### Root cause

OECD migrated their SDMX API to `sdmx.oecd.org/public/rest/data/`
with new dataflow names. Old URLs deprecated.

### Resolution (engineering, ~2 hours)

1. Probe the new OECD SDMX endpoint to find the right dataflow ID
   for regional GVA. Suspected: `OECD.CFE.EDS,DSD_REG_ECO@DF_GVA_AGG,1.0`
2. Update `scripts/ingest/oecd/fetch_region_gva.py`:
   - Replace base URL: `https://sdmx.oecd.org/public/rest/data`
   - Replace dataflow ID
   - Update query string format (SDMX 2.0 → 3.0 may have changed)
3. Test with a single country first
4. Execute full sweep

### Expected yield

~8,000 OECD region cells. Mostly cross-validates Phase 1 (EU NUTS),
adds bridge fills for non-EU OECD countries (US states-equivalent
overlay, JP prefecture-equivalent, KR sigungu, AU SA4, etc.).

---

## 8 · B-007 · UK NOMIS numeric ID lookup

### Impact

Phase 7 UK NOMIS scaffolded but returns 0 rows because NOMIS API
requires per-dataset numeric IDs:

- `geography=TYPE434` (LAD geography type)
- `industry=146800640...146800915` (SIC sections)

Without knowing these IDs, the query returns no data.

### Resolution (engineering, 3-4 hours)

NOMIS has no machine-readable schema endpoint that lists these. Two
paths:

1. **Manual approach:** Visit `https://www.nomisweb.co.uk/datasets/nm_141_1`
   (or whatever dataset) → click "Custom" → use the form to build a
   query → inspect the generated URL → extract the numeric IDs →
   hardcode in the script.

2. **Community-built mapping:** Search GitHub for "nomisweb" projects
   that have already enumerated the IDs (e.g. there's a Python
   package `nomisweb-pulldata` that may help).

After IDs are known:

```python
# In scripts/ingest/gb_ons/fetch.py, update:
url = (f"{NOMIS}/NM_141_1.data.json?date=latest"
       f"&geography={LAD_GEOGRAPHY_ID}"
       f"&industry={SIC_SECTIONS_LIST}"
       f"&legal_status=0"
       f"&employment_sizeband=0"
       f"&measures=20100")
```

### Expected yield

~30,000 cells across 374 LADs + top 500 MSOAs.

---

## 9 · B-008 · Real images for 18 surfaces

### Impact

All image surfaces use `SmartImage` placeholder (cream gradient +
emoji glyph). Functional but not premium-feeling.

### The 18 surfaces

See `PLAN_V3.md §11` for the full catalog. Notable ones:

- Home hero (HOME-1) — stylized world atlas illustration
- Each featured cell tile (HOME-2) — industry-themed thumbnail × 12
- Cell page hero (CELL-1) — industry-themed photo
- Sector landing (SEC-1) — sector hero
- Country landing (CTRY-1) — country hero
- About-data (ABOUT-1) — infographic-style
- Pricing (PRICE-1) — premium banner
- /you (YOU-1) — "you vs typical" illustration
- 404 (404-1) — thematic "lost on map"

### Resolution

**Founder action:** Commission an illustrator for the 18 canonical
surfaces. Estimated cost: $3-5k for high-quality consistent work.

OR: stay with placeholders. They're tasteful enough.

### How to swap in real images later

For each surface, the SmartImage component takes a `src` prop. Once
images exist:

1. Place files at `website/public/images/<category>/<name>.webp`
2. Edit the call site (e.g. `src/app/page.tsx`) — change:
   ```tsx
   <SmartImage alt="..." glyph="🗺️" />
   ```
   to:
   ```tsx
   <SmartImage src="/images/home/atlas-hero.webp" alt="..." />
   ```

One-line change per surface.

---

## 10 · B-009 · Korea KOSIS impossible (CLOSED)

### Status

Permanently closed. Cannot register without Korean mobile phone
number for SMS verification.

### Workaround

Korea coverage limited to:

- Phase 18 city overlay (Seoul, Busan, Incheon, Daegu, Daejeon, Gwangju derived from extrapolated_cells × city share — tier 'X')
- Phase 17 OECD overlay if/when activated

### Not pursuing further

Confirmed dead-end for non-Korean founders.

---

## 11 · B-010 · Germany Destatis Kreis paid-only (CLOSED)

### Status

Closed as DUPLICATE.

### Reasoning

Destatis token works (POST + HTTP header `username: TOKEN`). But the
free-tier catalogue only exposes Germany + Länder tables. Kreis-level
(German districts) data requires paid Destatis subscription.

Phase 1 Eurostat already covers Germany at NUTS-1 (Länder),
NUTS-2 (Regierungsbezirke), and NUTS-3 (Kreise approximately). So
paying for Destatis would duplicate.

### Mark as DUPLICATE; do not pursue

Unless founder explicitly authorises paid Destatis subscription
later for additional fields (e.g. wage data not in Eurostat).

---

## 12 · B-011 · Auth + Stripe not built (DEFERRED)

### Impact

No real user accounts. No paid-tier checkout. Pro features gated by
URL query `?pro=1` + cookie (interim).

### Why deferred

Founder hasn't asked for it yet. Plan v4 §28 (auth) + §29 (Stripe)
are explicitly future work.

### Resolution (when founder asks, 2-3 days)

**Auth (Supabase Auth, ~1.5 days):**

1. Enable email magic link + Google OAuth in Supabase dashboard
2. Create `/sign-in` page
3. Add Supabase Auth context provider (Next.js)
4. New table `user_saved_cells (user_id, cell_url, label, created_at)`
5. Update CellActions.tsx to use API when authenticated, localStorage when not
6. Migration prompt on first sign-in (localStorage → user account)

**Stripe (~1.5 days):**

1. Stripe dashboard → create products: Starter $38, Pro $78, Enterprise (invoice)
2. New `/api/checkout` endpoint (creates Checkout session)
3. New `/api/webhook/stripe` endpoint (handles `checkout.session.completed` → flip `is_pro` flag)
4. New table `user_subscriptions` mirroring Stripe state
5. Replace `?pro=1` flag with real `isPro()` server check
6. Pricing page CTAs route to `/api/checkout?tier=X`
7. 7-day free trial via Stripe trial_period

---

## 13 · B-012 · EU LAU per-country pipelines

### Impact

Phase 2 (EU LAU = municipalities) deferred. Estimated yield:
~150,000 cells across DE Gemeinden + IT comuni + ES municipios +
NL gemeenten top-1000 each.

### Why deferred

Per-country bulk downloads needed (Destatis Gemeinden, IBGE municípios,
INE DIRCE, CBS StatLine). Each needs probe.

### Resolution per country

- **NL CBS (table 81588NED):** Public API, no key. ~340 gemeenten. Quickest win.
- **ES INE (DIRCE):** Public API, no key. ~8,131 municipios; cap top 1,000.
- **IT ISTAT:** SDMX, per-dataflow probe needed. ~7,904 comuni; cap top 1,000.
- **DE Destatis Gemeinden:** Paid tier required (same as Kreis). Mark DUPLICATE.

Recommended sequence: NL → ES → IT.

---

## 14 · B-013 · Smaller country ingest pipelines

### Impact

Multiple countries with no sub-national coverage beyond Phase 18 city
overlay (which is tier 'X'):

- AU + NZ (ABS + Stats NZ): ~22,500 cells
- IN (MCA + Economic Census): ~20,000 cells
- CN (NBS): ~3,000 cells (PDF parsing)
- SEA cluster (SG, MY, ID, TH, VN, PH): ~15,000 cells
- LATAM remaining (MX, AR, CL, CO, PE): ~25,000 cells
- MENA + Africa cluster: ~22,000 cells

### Why deferred

Each requires 30-60 minutes of source-specific API probing per
country, plus per-classification crosswalk (some use ISIC, some use
local classifications).

### Resolution

Multi-day project. Sequence by impact-per-effort: AU+NZ first (clean
APIs, known schemas), then SEA, then LATAM, then MENA+AF.

---

## 15 · How to add a new blocker to this file

1. Pick the next stable ID (B-014, B-015, …)
2. Add to the summary table at the top
3. Add a per-blocker section with: Impact / Root cause / Resolution / Expected outcome / Verification command
4. If founder action needed: include click-by-click
5. Update `04_CURRENT_STATE.md` blocker list to reference this ID
6. Commit + push
