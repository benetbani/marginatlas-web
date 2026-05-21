# Plan v17 — Site-wide Audit and Performance Master Plan

> **Why this exists.** Founder's 2026-05-21 second walkthrough surfaced
> two cross-cutting failures: clicks lead to nowhere (404s, 500s, empty
> renders) and pages load painfully slowly. Both must be solved
> systematically, not page by page.

**Goal:** Every link on the site lands on a working page, and every page
streams its first paint under one second on a warm Vercel edge.

**Architecture:** Build a real link-and-perf crawler. Run it against
production. Categorise every failure. Fix in waves. Wire the crawler
into the prebuild guard so the regression can't return silently.

**Cadence:** One commit per phase. Push after each phase. Verify on
production before the next phase starts.

---

## Phase 1 — Build the audit crawler

### 1.1 URL inventory generator

**File:** `scripts/audit/enumerate_urls.ts`

Reads source and emits a deduped list of every URL the site can
generate:

- Static literals: walk every `.tsx` and `.ts` under `src/`, extract every `href="..."` and `router.push("...")` and `redirect("...")` argument
- Dynamic route fans:
  - `/sectors/{id}` for every sector in `taxonomy/sectors.json` (25)
  - `/industries/{slug}` for every industry in `taxonomy/industries.json` (192 visible)
  - `/{country}` for every country code in `COUNTRIES`
  - `/{country}/{geo}/{industry}` for the 9 FEATURED tuples + 50 sampled cells from `regional_cells`
  - `/coverage/{iso2}` for top 50 countries
  - `/blog/{slug}` for every markdown post
- API routes (with sample query strings):
  - `/api/cell-lookup?country=us&industry=restaurants&region=california`
  - `/api/cell-snapshot?country=us&geo=california&industry=restaurants`
  - `/api/popular-cell-snapshot`
  - `/api/export-csv?country=us&region=california&industry=restaurants`
  - `/api/newsletter` (POST sample)
  - `/api/ask` (POST sample)

Output: JSON file at `data/audit/url-inventory.json` with shape
`{ path: string, source: "literal" | "sector" | "industry" | "country" | "cell" | "api", origin?: string }[]`.

### 1.2 HTTP prober

**File:** `scripts/audit/probe_urls.ts`

Reads `data/audit/url-inventory.json` and probes each URL against a
target base (`PROD=https://www.marginatlas.com` or `LOCAL=http://localhost:3000`).

For each URL:

- Fire GET (or POST for API endpoints) with a real browser User-Agent + `Accept-Language: en-US,en;q=0.9`
- Capture: HTTP status, response time, content length, presence of `<h1>` in HTML, presence of well-known error markers ("Application error", "500", "Not found", empty `<main>`)
- Classify:
  - **ok**: 200 + `<h1>` present + content ≥ 5kB
  - **slow**: ok but response time > 1500 ms
  - **empty**: 200 but no `<h1>` or content < 1kB
  - **404**: HTTP 404 or "Not found" body match
  - **500**: HTTP 5xx
  - **redirect-loop**: too many redirects
  - **timeout**: response time > 10000 ms

Output: `data/audit/probe-results.json`.

Concurrency: 4 parallel probes (don't overload the dev server or trip Vercel rate limit).

### 1.3 Report generator

**File:** `scripts/audit/report.ts`

Reads `probe-results.json` and emits a human-readable markdown summary
at `data/audit/REPORT.md`:

- Summary counters per category
- Top-20 slowest URLs with timing
- Every 404 / 500 / empty result with source attribution (where in the codebase did the broken link come from)
- Suggested actions per failure type

### 1.4 Commit + push Phase 1

Commit message: `Plan v17 Phase 1: build site-wide audit crawler`.

---

## Phase 2 — Run audit against production

### 2.1 First crawl

Run all three scripts against production:

```bash
cd E:\atlas\website
npx tsx scripts/audit/enumerate_urls.ts
npx tsx scripts/audit/probe_urls.ts --base https://www.marginatlas.com
npx tsx scripts/audit/report.ts
```

Save the report as `data/audit/REPORT-baseline.md` for the historical
record.

### 2.2 Triage

Categorise every failure. For each:

- Is it a code defect (broken `href` literal, missing route)?
- Is it a data defect (geo/industry slug doesn't resolve)?
- Is it a perf failure (timeout)?
- Is it a third-party dependency (Supabase down, Anthropic key missing)?

Build a `data/audit/triage.csv` with one row per failure + fix-class.

---

## Phase 3 — Fix every broken link

Each fix-class becomes a separate commit. No fix-it-later code.

### 3.1 Dead `href` literals

Common cases:

- Footer links to `/sign-up`, `/sign-in` (auth deferred) → temporarily route to `/pricing` with a friendly note, or hide the link entirely until B-011 lands
- Pricing CTAs to `/sign-up?tier=X` → same treatment
- `/methodology` → already redirects to `/about-data` per D-035, confirm
- Any other 404 → replace with the closest valid destination

### 3.2 Broken sector / industry / country slug mismatches

Some FEATURED-style tuples use slugs that don't exist in the taxonomy.
Build a CI check that walks every FEATURED-like array in source and
verifies each tuple resolves at build time. Fail the build if not.

### 3.3 Broken sub-niche → parent fallback chain

`PARENT_FALLBACK_MAP` in `src/lib/taxonomy.ts` should cover every
visible industry that lacks direct data. Audit script writes
`data/audit/unmapped-industries.json` listing every visible industry
whose `getCellBySlug` returns null in a default country. Each entry
gets either a new `parent_id`, a new `PARENT_FALLBACK_MAP` entry, or
removal from the visible set.

### 3.4 Compare page + navigator submission

Block A3/A5 from Plan v16 hardened these but the audit will surface
remaining cases (e.g. submitting with no industry, with corp_only gate,
etc.). Each unhandled case → one fix.

### 3.5 Commit per fix-class

---

## Phase 4 — Performance pass

### 4.1 Diagnose: why is the site slow

Three suspects:

1. **`/[country]/[geo]/[industry]` is `force-dynamic`** (R-003 hotfix). Every page render hits Vercel function + Supabase. No CDN cache. This is the biggest hit.
2. **`/sectors/[sector]/page` fans out 6 Supabase calls in parallel via `quickStat`**. Cold cache = 6× round-trip to Supabase.
3. **No `Cache-Control` headers on most routes.** Vercel's default is fine for static, but dynamic pages should explicitly set `s-maxage` so the edge keeps the response warm.

### 4.2 S-100: restore ISR on benchmark pages

Originally captured in chapter 15 §7 and Plan v16 §A10. Plan:

1. Create `src/components/DimensionSwitcherClient.tsx` — client component that reads `useSearchParams()` for `size`, `year`.
2. Strip `searchParams` from `/[country]/[geo]/[industry]/page.tsx` server component. The server component reads default size/year only.
3. Drop `export const dynamic = "force-dynamic"`.
4. Restore `export const revalidate = 21600;` and `export const dynamicParams = true;`.
5. Build locally and curl a non-pre-rendered URL through `npm start`. Must return 200, must not crash with `DYNAMIC_SERVER_USAGE`.

This was deferred from Plan v16 with explicit warning about R-003 regression — test locally before push.

### 4.3 Edge caching on dynamic-but-cacheable routes

Add `Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400`
to:

- `/api/cell-snapshot/route.ts`
- `/api/popular-cell-snapshot/route.ts`
- `/api/cell-lookup/route.ts` (per-query cache)

Vercel will respect `s-maxage` at the edge.

### 4.4 Reduce Supabase fan-out on `/sectors/[sector]`

`quickStat()` makes 6 sequential `getCellBySlug` calls. Replace with
one batched query that returns 6 cells at once via PostgREST `in()`
filter.

### 4.5 Lazy-load below-fold homepage components

`CellOfTheWeek`, `TaxOverlayTeaser`, `AskWidget`, `CityPicker`, blog
rail — all below-fold. Convert to dynamic imports with React `Suspense`
fallbacks so the first paint of the hero + navigator + featured grid
doesn't wait on these.

### 4.6 Commit per perf fix; verify each against production before the next

---

## Phase 5 — Re-audit

After every fix lands, run the crawler again and check that the
failure count drops to zero. Save the diff between
`REPORT-baseline.md` and the new run as `REPORT-fixed.md`.

If new failures emerge, loop back to Phase 3 with a fresh triage.

---

## Phase 6 — Permanent CI

### 6.1 Wire audit into prebuild

Add `"verify:links": "npx tsx scripts/audit/probe_urls.ts --base http://localhost:3000 --strict"` to package.json.

The `--strict` mode exits 1 on any non-ok result.

The crawler runs against a freshly built local server, not production —
that way the build fails on broken links before a deploy can ship them.

### 6.2 Local server boot helper

Add `scripts/audit/run-local-audit.sh` that:

1. Starts `npm start` in the background
2. Waits for `http://localhost:3000/` to return 200
3. Runs the crawler with `--strict`
4. Kills the dev server
5. Exits with the crawler's exit code

### 6.3 Commit Phase 6

---

## Sign-off

Plan complete when:

- `data/audit/REPORT-fixed.md` shows zero non-ok results
- Production homepage loads in under 1500 ms warm and under 3000 ms cold
- Benchmark page loads in under 2000 ms warm
- `npm run verify:links` passes on a fresh `npm start` build

---

## What's NOT in scope

- Building the missing routes themselves (`/sign-up`, `/sign-in`, etc.). Those wait on auth (B-011).
- New ingest. Not a perf or routing issue.
- Sentry re-enable (S-103).
- Real images (B-008).

Anything that surfaces in the audit but doesn't fall in scope: append to
chapter 11's S-list as a follow-up and move on.
