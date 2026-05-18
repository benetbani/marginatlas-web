# 35 · Track EE — Performance + ISR + Monitoring

> 357k+ cells. Vercel free tier. Need cache tuning + precompute strategy
> + perf audit to keep page loads fast without burning serverless minutes.

---

## 1 · Goal

Cell page p50 server response < 200ms. Home page Lighthouse Performance ≥
85. Build time < 5 min on Vercel. No bundle bloat.

---

## 2 · Sub-tracks

### EE.1 — ISR cache strategy tiered by quality

Current: cell pages `revalidate = 604800` (7 days).

Replace with tiered:
- quality_10 ≥ 8 (high-value cells, US/EU NUTS): revalidate weekly
- quality_10 4-7: revalidate monthly
- quality_10 < 4: `dynamic = 'force-dynamic'` (no cache, less storage)

Implementation: compute revalidate value from cell quality in the
page component. Use `unstable_cache` API or `revalidate` export.

Effort: 1.5 hr.

### EE.2 — Build-time precomputation

Currently `generateStaticParams` returns top 100 US cells. Extend:
- Top 200 US cells (from cells_master)
- Top 5 cells per non-US country (191 countries × 5 = 955)
- Top 10 cells per tier-1 city (~25 cities × 10 = 250)
- Total: ~1,400 pre-rendered cells, build time ~3-5 min

Effort: 1.5 hr.

### EE.3 — Edge runtime audit

Move stateless API routes to Edge runtime:
- `/api/cell-snapshot` (already simple GET)
- `/api/popular-cell-snapshot`
- `/api/cell-lookup`

Keep Node runtime for:
- `/api/ask` (needs full Node fetch + complex tool loop)
- `/api/export-csv` (large response)
- `/api/newsletter` (Supabase write)

Effort: 1 hr.

### EE.4 — Bundle size audit

`next build` outputs bundle sizes per route. Audit:
- Identify largest client components
- Replace heavy npm packages with native APIs where possible
- Lazy-load below-fold components (intersection observer triggers
  hydration)

Target: First-load JS < 150 KB for home; < 100 KB for cell page.

Effort: 2 hr.

### EE.5 — Image optimization

When real images land (founder commission):
- Use Next.js Image component everywhere (already done in SmartImage
  placeholder; verify same pattern for real images)
- Source images in WebP at 2x retina
- Lazy-load below fold
- Image priority hints on hero only

Effort: 1 hr.

### EE.6 — Cache headers tuning

Audit Cache-Control headers:
- Static assets: `public, max-age=31536000, immutable`
- API routes: vary per endpoint
- Cell pages: `public, max-age=0, must-revalidate, s-maxage=86400`
- /api/ask: `private, no-cache` (per-user)

Effort: 1 hr.

### EE.7 — Broken-link audit

Crawl all sitemap URLs, report 404s + 500s.

Script: `scripts/test/broken_link_audit.py`. Concurrent (5 at a time
to stay polite), uses RamGuard.

Effort: 1 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| EE.1 ISR tiered | 1.5 hr |
| EE.2 Build-time precompute | 1.5 hr |
| EE.3 Edge runtime audit | 1 hr |
| EE.4 Bundle size audit | 2 hr |
| EE.5 Image optimization | 1 hr |
| EE.6 Cache headers | 1 hr |
| EE.7 Broken-link audit | 1 hr |
| **Total** | **~9 hr** |

---

## 4 · Verification gate

- Lighthouse Performance ≥ 85 on home + cell pages
- Build wall-time < 5 min on Vercel
- First-load JS < 150 KB home, < 100 KB cell
- 0 broken links in top 1000 sampled URLs
- Cell page p50 < 200ms in production

---

## 5 · What this unlocks

- Site scales to 500k+ cells without slowing down
- Vercel costs stay bounded
- Pro-tier "performance SLA" becomes a real claim
