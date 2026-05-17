# 03 · Track A — Founder Blockers

> Five tasks only the founder can do. Each unblocks downstream work
> or makes a strategic call. Listed in priority order.
>
> The session executes none of these directly — it documents,
> click-by-clicks, and reports.

---

## A.1 · Cloudflare DNS for marginatlas.com

### Why this is HIGH priority

`marginatlas.com` currently returns Cloudflare 522 (origin
unreachable). The Vercel deployment is healthy at
`marginatlas-web-twtl.vercel.app`, but the canonical URL doesn't
resolve. No live launch is possible until this lands.

### Estimated time

5 minutes if Cloudflare credentials handy.

### Click-by-click (founder)

Open Cloudflare → marginatlas.com → DNS → Records:

#### Step A.1.1 — Delete the Namecheap A record

1. Find row: `A · marginatlas.com · 192.64.119.209 · Proxied (orange)`
2. Click **Edit** ▸
3. Click **Delete** (bottom-left of the edit panel)
4. Confirm deletion

#### Step A.1.2 — Delete the Namecheap CNAME

1. Find row: `CNAME · www · parkingpage.namecheap.com · Proxied (orange)`
2. **Edit** ▸ **Delete** ▸ confirm

#### Step A.1.3 — Verify MX + TXT untouched

The 3 MX records (`route1.mx.cloudflare.net`,
`route2.mx.cloudflare.net`, `route3.mx.cloudflare.net`) and 2 TXT
records (DKIM `cf2024-1._domainkey` + SPF on `marginatlas.com`)
must remain. Do NOT delete these.

#### Step A.1.4 — Add Vercel CNAME at apex

1. Click blue **+ Add record** button (top-right)
2. **Type:** `CNAME`
3. **Name:** `@` (means root domain)
4. **Target:** `33b3dbcd78a448ad.vercel-dns-017.com`
5. **Proxy status:** click the orange cloud once → it turns **GREY** (DNS only)
6. **TTL:** Auto
7. Click **Save**

#### Step A.1.5 — Add Vercel CNAME at www

1. Click **+ Add record** again
2. **Type:** `CNAME`
3. **Name:** `www`
4. **Target:** `33b3dbcd78a448ad.vercel-dns-017.com` (same)
5. **Proxy status:** GREY
6. **TTL:** Auto
7. Click **Save**

#### Step A.1.6 — Refresh in Vercel

1. Vercel dashboard → `marginatlas-web` → Settings → Domains
2. Find both `marginatlas.com` and `www.marginatlas.com` rows
3. Click the **Refresh** button on each
4. Wait 2-10 minutes

### Fallback if Cloudflare rejects CNAME at apex

Some Cloudflare accounts won't allow CNAME on `@`. If so:

- Delete the CNAME `@` row
- Add **A · @ · 76.76.21.21 · Proxy DNS only (GREY)** instead

### How to verify (founder or session)

```bash
curl -sI -L https://marginatlas.com | head -3
# expect after propagation: HTTP/1.1 200 OK
```

If the session can verify, no founder report needed — just commit
note "DNS resolved" in the next commit.

---

## A.2 · Editorial tone decision

### Why this is MEDIUM priority

Blocks four things:

1. Per-cell narrative paragraphs (currently dry-factual)
2. Country landing page editorial blurbs
3. Sector deep-dive long-form content
4. `/ask` AI route live mode

Without a decision, the session writes nothing editorial (R-026).

### Estimated time

30 minutes of thinking. No keyboard work.

### What to decide

Five mutually independent decisions. Pick one option per row.

#### A.2.1 — Per-cell narrative voice

How should `/{country}/{geo}/{industry}` pages read in the
narrative paragraph above the data?

| Option | Example |
|---|---|
| **Dry-factual** (current) | "A typical restaurant in California brings in about $1.2M per year. There are ~85,000 of them, employing roughly 18 people each on average." |
| **Data-journalism** | "California's restaurant scene clusters between $200K and $1.5M annual revenue, with a long right tail driven by Bay Area fine dining." |
| **Conversational** | "If you're opening a restaurant in California, here's the reality check: typical revenue is around $1.2M, but the bottom decile is below $200K." |
| **Founder first-person** | "I built this benchmark because I couldn't find one. California restaurants: typical $1.2M, 85k of them, 18 employees each." |

#### A.2.2 — Country landing page voice

Same five options scoped to the per-country page.

#### A.2.3 — Sector deep-dive voice

How should `/sectors/[id]` pages read in the explanatory copy?

| Option | Feel |
|---|---|
| **McKinsey-report** | Authoritative, jargon-heavy, segmented |
| **IBISWorld** | Industry-report neutral, lists, definitions |
| **Blog-style** | Opinionated, narrative |

#### A.2.4 — Blog voice

| Option | Use |
|---|---|
| **Technical** | Deep dives, data-heavy, charts |
| **Opinionated** | Take-driven, "here's what the data says" |
| **Mixed** | Vary per post |

#### A.2.5 — `/ask` response style

| Option | Feel |
|---|---|
| **Terse-direct** | "Restaurants in California: typical $1.2M revenue. 85k firms. p10 $200K, p90 $3M." |
| **Conversational** | "California's restaurant industry has about 85,000 establishments. The typical one earns around $1.2 million annually, but there's wide spread…" |
| **Citation-heavy** | "Based on compiled national business statistics for California (NAICS 722), the typical restaurant…" |

### What the session does once decided

1. Update `src/app/[country]/[geo]/[industry]/page.tsx` narrative voice
2. Update `src/app/[country]/page.tsx` country page copy
3. Update `src/app/sectors/[sector]/page.tsx` sector copy
4. Update `src/app/api/ask/route.ts` system prompt for /ask voice
5. Trigger A.3 (paste key into Vercel)

---

## A.3 · Paste ANTHROPIC_API_KEY into Vercel

### Why this is LOW priority (depends on A.2)

Flips `/ask` from preview-stub to live agentic answers. Cost-bearing
once live. Founder explicitly gated this behind the tone decision.

### Estimated time

2 minutes.

### Click-by-click (founder)

1. Vercel dashboard → `marginatlas-web` → **Settings** (left sidebar)
2. Click **Environment Variables** (inner sidebar)
3. Top-right blue **Add New** button
4. **Key:** `ANTHROPIC_API_KEY`
5. **Value:** paste the key from `.env.local` line 11 (session can read and paste back into chat when asked)
6. **Environments:** **UNCHECK Development**, leave **Production + Preview** checked
7. **Sensitive** toggle: leave ON (default — Vercel auto-detects `KEY`)
8. Click **Save**
9. Click **Deployments** tab (top nav)
10. Latest production deploy row → three-dot menu (right) → **Redeploy**
11. Wait ~60 seconds
12. Test:
    ```bash
    curl -s -X POST -H "Content-Type: application/json" \
      -d '{"question":"What does a typical bakery in California earn?"}' \
      https://marginatlas-web-twtl.vercel.app/api/ask
    # expect: { answer: "(real Claude response)", toolCalls: N, preview: false }
    ```

### Cost monitoring (session note)

Once live, monitor Anthropic dashboard daily for the first week.
Alert if monthly burn exceeds $100. Per-IP rate limit (10/hour) is
the primary cost control.

---

## A.4 · France Sirene CSV download (optional)

### Why this is LOW priority

France is already partially covered at NUTS-2/3 via Phase 1
Eurostat. The Sirene CSV adds commune-level depth — ~60,000 new
cells. Useful but not blocking.

### Estimated time

30 minutes (600 MB download + unzip to 6 GB).

### Click-by-click (founder)

1. Visit `https://www.data.gouv.fr/fr/datasets/`
2. Search "Sirene Stock Unités Légales"
3. Find the dataset; click into it
4. Find file `StockUniteLegale_utf8.zip` (~600 MB compressed)
5. Click **Télécharger** (download)
6. Unzip on local disk (will expand to ~6 GB)
7. Move `StockUniteLegale.csv` to `E:\atlas\delivery\regional\fr_insee\`
8. Tell session: "Sirene CSV is in place"

### What the session does once CSV is in place

Track H executes (see `10_TRACK_H_FRANCE_SIRENE.md`):

- DuckDB streams the 6 GB CSV (RAM stays under 500 MB)
- Aggregates per (commune, NAF-3, employee_band)
- Maps NAF → industry_id
- Uploads to `regional_cells` with tier 'P'
- ~60,000 commune-level rows

---

## A.5 · Real image commission decision

### Why this is LOW priority

Current `SmartImage` placeholders (cream gradient + emoji glyph)
are tasteful enough to ship. Real images would feel more premium
but the founder hasn't said it's blocking.

### Estimated cost

$3-5k for high-quality consistent illustration across 18 surfaces.

### What to decide

Three options:

1. **Commission now.** Brief an illustrator; expect 4-6 weeks; integrate one image per surface as files arrive.
2. **Commission staged.** Commission the 6 highest-impact surfaces first (home hero, 4 featured tiles, cell hero), defer the rest.
3. **Stay placeholder.** Ship with current SmartImage; revisit post-launch.

### Recommended (session opinion)

**Option 2 — stage.** Real images on the 6 visible-on-home surfaces
materially raise the perceived quality. The other 12 surfaces are
deeper in the funnel; placeholders are fine until traffic justifies
the spend.

### Founder action if commissioning

1. Pick an illustrator (recommendations: Behance, Dribbble, or referral)
2. Brief: warm-earth palette (atlas amber, cream, parchment); restrained; no humans; no cartoon; semantic to each industry/region; consistent line weight
3. File format: WebP, 2× retina, max 200 KB each
4. Drop into `website/public/images/<category>/<name>.webp`
5. Tell session which surfaces have images; session updates the JSX in one commit

---

## A · Track A dashboard (for the session to report progress)

| Task | Status | Done at |
|---|---|---|
| A.1 DNS | OPEN | — |
| A.2 Editorial tone | OPEN | — |
| A.3 ANTHROPIC key | OPEN (blocked on A.2) | — |
| A.4 France Sirene CSV | OPEN | — |
| A.5 Image commission | OPEN | — |

The session keeps this table current in `docs/masterplan/PROGRESS.md`
after each founder confirmation.
