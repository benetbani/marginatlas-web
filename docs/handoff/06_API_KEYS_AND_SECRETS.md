# 06 · API Keys and Secrets

> Every credential the project depends on: where stored, where used,
> what it unlocks, what's blocked without it, and how to rotate it.
>
> All keys live in `E:\atlas\website\.env.local` (gitignored). Mirror
> to Vercel env vars to make them live in production where indicated.

---

## 1 · Master key table

| Key | Stored in | Used by | In Vercel? | Status | What's blocked without it |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Next.js (client + server) | ✅ Production + Preview + Development | works | Everything DB-related |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Next.js client | ✅ Production + Preview + Development | works | Client-side reads |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Next.js server routes + Python ingest | ✅ Production + Preview | works | Server-side writes; bypasses RLS |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | `.env.local` + Vercel | Next.js (download CTAs) | ✅ Production + Preview + Development | works | Cold parquet downloads (R2 currently private) |
| `ANTHROPIC_API_KEY` | `.env.local` only | `/api/ask` route | ❌ **NOT in Vercel** | gated | /ask live mode (currently preview-stub) |
| `CENSUS_API_KEY` | `.env.local` only | `scripts/ingest/us_census/` | not needed in Vercel | works | US Census CBP/SUSB ingest |
| `DESTATIS_API_TOKEN` | `.env.local` only | `scripts/ingest/de_destatis/` | not needed in Vercel | works but blocked | Destatis API (free tier only Länder) |
| `ESTAT_APP_ID` | `.env.local` only | `scripts/ingest/jp_estat/` | not needed in Vercel | works | Japan e-Stat Economic Census ingest |
| KOSIS Korea API key | — | — | — | **IMPOSSIBLE** | Korea ingest |

---

## 2 · Per-key details

### `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://npfqasdghbffqgmzgxzr.supabase.co`
- **Purpose:** Base URL for all Supabase REST + SDK calls
- **Public:** Yes — the `NEXT_PUBLIC_` prefix means it's exposed to the browser
- **Rotation:** Tied to the Supabase project; can't be rotated independently. If the project is migrated, this URL changes too.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `sb_publishable_LLQeOTyVG7nvLLMdOVt1LA_JEs-qswQ`
- **Purpose:** Client-side reads with RLS-protected access
- **Public:** Yes — designed to be safe in browser
- **Rotation:** Supabase dashboard → Settings → API → JWT Settings → Generate new

### `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `sb_secret_WNmSDeJjZf9QCdyQdjfmLA_ZFPNGRcf`
- **Purpose:** Server-side reads AND writes; bypasses RLS
- **Public:** **NO** — full DB access. Never expose to browser.
- **Used by:** All Next.js server routes (`src/lib/supabase.ts → supabaseAdmin`), all Python ingest scripts
- **Rotation:** Supabase dashboard → Settings → API → Generate new service-role key, then update `.env.local` and Vercel env vars simultaneously

### `NEXT_PUBLIC_R2_PUBLIC_URL`
- **Value:** `https://pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev`
- **Purpose:** Public-facing R2 bucket URL for parquet exports
- **Status:** R2 bucket access disabled per Plan A lockdown (D-051). URL still valid but returns 403.
- **Rotation:** Cloudflare dashboard → R2 → bucket → Settings → Custom domains

### `ANTHROPIC_API_KEY`
- **Value:** `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`
- **Model used:** `claude-sonnet-4-5` (fixed in `src/app/api/ask/route.ts`)
- **Purpose:** Powers the agentic loop in `/api/ask` (currently in preview-stub mode)
- **In Vercel:** **NO** — intentional. Adding to Vercel flips `/ask` from preview-stub to live agentic.
- **When to flip live:** After founder decides the editorial tone (D-040). Then paste into Vercel Settings → Environment Variables → ANTHROPIC_API_KEY, mark sensitive, apply to Production + Preview (NOT Development — Vercel rejects sensitive vars in Dev).
- **Rotation:** Anthropic console → API Keys → revoke + create new. Update `.env.local` + Vercel.

### `CENSUS_API_KEY`
- **Value:** `fe675776579e52608d53fcba230ea5a4f5889d18`
- **Purpose:** US Census Bureau APIs (CBP, SUSB, ACS, etc.)
- **Used by:** `scripts/ingest/us_census/fetch_cbp.py`
- **Auth pattern:** `?key={CENSUS_API_KEY}` URL param
- **Rate limit:** No published limit; observed throughput is ~50 calls/min comfortable
- **Rotation:** `https://api.census.gov/data/key_signup.html` — request a new key by email

### `DESTATIS_API_TOKEN`
- **Value:** `7ade8953b219486883cec3c549938227`
- **Purpose:** Destatis GENESIS REST API 2020
- **Used by:** `scripts/ingest/de_destatis/fetch.py`
- **Auth pattern:** HTTP header `username: TOKEN` (NOT as URL param) + POST method (not GET)
- **Limitation:** Free tier catalogue only exposes Germany + Länder tables. Kreis-level data requires paid subscription. Marked DUPLICATE (Eurostat Phase 1 already covers Länder).
- **Rotation:** Destatis account portal → API tokens

### `ESTAT_APP_ID`
- **Value:** `b71aaf298b2e3b51e5f161f8285d758806fdf5a4`
- **Purpose:** Japan Government Statistics Window (政府統計の総合窓口)
- **Used by:** `scripts/ingest/jp_estat/fetch.py`
- **Auth pattern:** `?appId={ESTAT_APP_ID}` URL param
- **App registered as:** "Atlas Tesseract Research" at `https://marginatlas.com`
- **Rotation:** e-Stat → My Page → API utilisation information → Issue new appId

### KOSIS Korea (none)
- **Status:** Permanently unavailable
- **Reason:** KOSIS registration form requires Korean mobile phone number for SMS verification. Founder doesn't have one. No workaround.
- **Implication:** Phase 9 (Korea sigungu) is permanently SKIPPED. Korea coverage only via:
  - Phase 18 city overlay (Seoul, Busan, Incheon, Daegu, Daejeon, Gwangju derived from extrapolated_cells × city share)
  - Phase 17 OECD overlay if/when activated

---

## 3 · `.env.local` exact contents

```
# Copy to .env.local and fill in real values (do NOT commit .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://npfqasdghbffqgmzgxzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_LLQeOTyVG7nvLLMdOVt1LA_JEs-qswQ
SUPABASE_SERVICE_ROLE_KEY=sb_secret_WNmSDeJjZf9QCdyQdjfmLA_ZFPNGRcf
# Cloudflare R2 public CDN for parquet/duckdb downloads
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev
# Anthropic — registered but /ask stays in preview mode until tone is locked.
ANTHROPIC_API_KEY=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
# Sub-national ingest API keys
CENSUS_API_KEY=fe675776579e52608d53fcba230ea5a4f5889d18
DESTATIS_API_TOKEN=7ade8953b219486883cec3c549938227
ESTAT_APP_ID=b71aaf298b2e3b51e5f161f8285d758806fdf5a4
```

---

## 4 · `.gitignore` confirmation

```
# env files (do not commit secrets)
.env*
!.env.local.example
```

This pattern excludes `.env.local`, `.env.production`, `.env`, etc.
The `.env.local.example` template is allowed (and committed) as a
sample for future contributors.

If you need to verify the gitignore is working:

```bash
cd /e/atlas/website
git check-ignore -v .env.local
# expect: .gitignore:32:.env*    .env.local
```

---

## 5 · How Python ingest scripts read keys

Pattern used by every script:

```python
import os
APP_ID = os.environ.get("ESTAT_APP_ID", "b71aaf298b2e3b51e5f161f8285d758806fdf5a4")
```

The hardcoded default is the actual key value. This means:
- Scripts work even if `os.environ` isn't loaded
- BUT if the key ever changes, both the env var AND every script's default needs updating

Cleaner pattern (TODO): every script should `from common.config import KEYS` and pull from a single source. Not done yet.

---

## 6 · Vercel env var addition click-by-click

When adding `ANTHROPIC_API_KEY` (or any other sensitive key) to
Vercel:

1. Vercel dashboard → `marginatlas-web` project → Settings (left sidebar)
2. Click **Environment Variables** (inner sidebar)
3. Form: **Key** = `ANTHROPIC_API_KEY`, **Value** = paste the key
4. Environments: **UNCHECK Development** (Vercel rejects sensitive vars in Dev), leave **Production + Preview** checked
5. **Sensitive** toggle: leave ON (default for any var with `KEY` in name)
6. Click **Save**
7. Trigger redeploy: Deployments tab → latest production row → three-dot menu → Redeploy
8. Wait ~60s; verify /ask flips from stub to live (test with a real question)

---

## 7 · Founder identity for registrations

When registering for any new API service, use:

| Field | Value |
|---|---|
| Email | `benet@researchtesseract.com` |
| Display name | Atlas Tesseract Research |
| Company / organisation | Tesseract Research |
| URL | `https://marginatlas.com` |
| Purpose / use case | Industry benchmarking research / Sub-national business statistics ingest |
| Phone | (founder's; ask if needed) |

Avoid using personal accounts not tied to `researchtesseract.com`.
Keeps the audit trail clean.

---

## 8 · Things that LOOK like secrets but aren't

| Item | Why not a secret |
|---|---|
| Supabase project ref `npfqasdghbffqgmzgxzr` | Public — visible in any URL |
| R2 bucket subdomain `pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev` | Public — designed for public CDN |
| GitHub repo URL | Repo is private but the URL leaks no data |
| Anthropic model name `claude-sonnet-4-5` | Public — Anthropic publishes this |
| Eurostat / IBGE / e-Stat dataset IDs | Public — these are the equivalent of table names |
| Vercel project URL `marginatlas-web-twtl.vercel.app` | Public — Vercel auto-generates and indexes |

---

## 9 · Things that ARE secrets

| Item | Why secret |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Full DB access including writes; bypasses RLS |
| `ANTHROPIC_API_KEY` | Costs money per token; can be abused |
| `CENSUS_API_KEY` | Rate-limited; abuse triggers block |
| `DESTATIS_API_TOKEN` | Auth credential for paid (potential) usage |
| `ESTAT_APP_ID` | Auth credential; abuse can revoke the registration |

---

## 10 · Rotation playbook

When rotating any sensitive key:

1. Generate new key at the source (Supabase / Anthropic / Census / etc.)
2. Update `.env.local` (replace value, don't delete the old line — comment it out for rollback)
3. Update Vercel env vars (if the key is in Vercel)
4. Update Python script defaults if you use them
5. Redeploy Vercel (Deployments → Redeploy)
6. Test with the new key (call the endpoint that uses it)
7. Revoke the old key at the source
8. Remove the commented-out old value from `.env.local`

---

## 11 · What NEVER to do with keys

| Rule | Why |
|---|---|
| NEVER commit `.env.local` to git | Public exposure of all keys |
| NEVER echo a key value into a chat response | Could end up in logs / training data |
| NEVER paste a key into a code comment or README | Same |
| NEVER use a `console.log` with a key | Browser exposure |
| NEVER use a service-role key in `NEXT_PUBLIC_*` env var | Public exposure |
| NEVER share the Anthropic key in a forum / Discord / etc. | Abuse + cost |
| NEVER hardcode in source committed to git | Same as the first |

If you need to give the founder back one of their own keys (because
they asked, "where is my Anthropic key"), read it from `.env.local`
with the Read tool and paste in the chat response — but ONLY when
explicitly asked.
