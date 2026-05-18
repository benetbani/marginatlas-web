# 25 · Track V — Infrastructure Polish

> Once Tracks R/S/T/U land, the site has 100+ countries, 80+ city
> slugs, tax overlay, quality scoring. Need infrastructure to handle
> the scale: sitemap regen, ISR cache strategy, performance budget,
> /ask production unlock, build-time precomputation.

---

## 1 · Goals

- Sitemap covers every cell with quality_10 ≥ 4 (currently sitemap has
  ~15k URLs; new state will have ~250k+)
- ISR cache tuned for ~250k cell pages without blowing Vercel costs
- `/ask` production unlock diagnostic + fix
- Build-time precomputation of top cells per country (skip cold-start
  on country page first hit)
- No broken links anywhere

---

## 2 · V.1 — Sitemap split + regen

Current `sitemap.ts` returns a single array. Vercel limits at
50,000 entries per sitemap; we'll cross that threshold.

Split into multiple sitemaps via a sitemap index:

```
/sitemap.xml          → index, references sitemap-1, sitemap-2, ...
/sitemap-static.xml   → home + sectors + countries + static
/sitemap-cells-1.xml  → first 50k cells
/sitemap-cells-2.xml  → next 50k cells
...
```

Filter: only include cells with `quality_10 >= 4`.

Effort: 2 hr.

## 3 · V.2 — ISR cache tuning

Current cell page: `revalidate = 604800` (7 days). At ~250k cells × Vercel
free tier ISR cache, this is risky.

Tighten:
- Most-viewed cells (top 5k): keep 7-day revalidate
- Mid-popularity (next 50k): revalidate weekly
- Long-tail (everything else): on-demand revalidation only — `dynamic = 'force-dynamic'` for cells outside the top-N pre-rendered list

Effort: 1.5 hr.

## 4 · V.3 — Build-time precomputation

Currently `generateStaticParams` returns top 100 US cells. Extend to:
- Top 100 US cells
- Top 5 cells per non-US country (currently 50 countries → 250 cells)
- Top 10 cells per tier-1 city (top 100 cities × 10 → 1,000 cells)

Caps at ~1,400 pre-rendered cells. Build time: ~3 min on Vercel.

Effort: 1.5 hr.

## 5 · V.4 — /ask production unlock diagnostic

Currently preview:true despite ANTHROPIC_API_KEY in Vercel env vars.

Steps:
1. Add `src/app/api/debug-env/route.ts` returning `{ has_anthropic: !!process.env.ANTHROPIC_API_KEY, env_keys_count: Object.keys(process.env).length }`. No value, just presence boolean.
2. Push, redeploy, curl production
3. Diagnose:
   - If `has_anthropic: false` → Vercel injection issue; check Sensitive flag, scope (Production vs Preview), value typos
   - If `has_anthropic: true` → /api/ask code path bug; deeper investigation
4. Remove debug-env after fix

Effort: 1.5 hr.

## 6 · V.5 — Lighthouse / performance audit

Run Lighthouse on:
- / (home)
- /us (country)
- /us/california/restaurants (cell)
- /sectors/food_drink
- /compare

Target: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95.

Common issues to fix:
- Largest Contentful Paint (LCP) on home page
- Cumulative Layout Shift (CLS) on cell pages
- Image dimensions on SmartImage placeholder

Effort: 2-3 hr.

## 7 · V.6 — Edge middleware tuning

Current middleware: AI crawler block (451), bare scraper block (403),
60 req/min rate limit (429).

Add:
- Higher rate limit for authenticated users (when Auth lands)
- Lower rate limit for cells with quality_10 < 4 (discourage scraping
  of weak data)
- Per-country geo-blocking for sanctioned regions (Iran, North Korea —
  add to robots.txt + middleware)

Effort: 1.5 hr.

## 8 · V.7 — Broken link audit

Run end-to-end:
- Crawl all internal links from sitemap
- Check each returns 200
- Report any 404s

Use a Python script with `requests` + concurrent (limited to 5 at a
time to stay under RAM).

Effort: 1.5 hr.

---

## 9 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| V.1 Sitemap split | 2 hr | HIGH |
| V.2 ISR cache tuning | 1.5 hr | MED |
| V.3 Build-time precompute | 1.5 hr | MED |
| V.4 /ask diagnostic | 1.5 hr | MED (founder asked) |
| V.5 Performance audit | 2-3 hr | LOW |
| V.6 Middleware tuning | 1.5 hr | LOW |
| V.7 Broken link audit | 1.5 hr | MED |
| **Total** | **~11-12 hr** | |

---

## 10 · Verification gate

- Sitemap returns ≥ 200k URLs across split files
- Vercel build < 5 min wall-time
- /ask production returns `preview: false` for at least one test query
- Lighthouse Performance ≥ 85 on home + cell pages
- Broken-link audit: 0 internal 404s in top 1,000 sampled cells

---

## 11 · What this unlocks

The site can scale to the full ~250k cell inventory without breaking.
/ask works in production. Performance is verified, not assumed.
