# Production reality audit — v24 + v25

Generated 2026-05-22T08:56:11.138Z against https://www.marginatlas.com.

## Summary

**13 of 16 checks passed (81.3%).**

## Per-check results

| # | Block | Check | Result | Note |
|---|---|---|---|---|
| 1 | v24 Block 2 + v25 Block 6 | Featured tiles: no 'Click for details' anywhere on homepage | PASS |  |
| 2 | v25 Block 7 | /industries page links to /industries/[slug], not /us/california | PASS |  |
| 3 | v25 Block 7 + Block 10 | Sector emoji icons render on /industries | PASS |  |
| 4 | v25 Block 4 | Profit waterfall present on a cell page (NetProfitWaterfall section visible) | PASS |  |
| 5 | v25 Block 11 | Estimated badge appears on a forced-synthesis cell | PASS |  |
| 6 | v25 Block 9 | Right TOC uses xl:gap-16 (further from content) | PASS |  |
| 7 | v24 Block 11 | Sitemap shard 0 has real content (>1KB) | PASS |  |
| 8 | v24 Block 11 | Sitemap shard 2 (regional cells) has real content | FAIL | Sitemap shard 2 still empty — v24 Block 11 routing fix not live |
| 9 | v24 Block 4 | Frankfurt → 'Frankfurt am Main' label (not 'Hessen') | FAIL | Frankfurt still routes to Hessen — v24 Block 4 not live |
| 10 | v24 Block 3 | Substitution disclosure banner present on industry-substituted cell | PASS |  |
| 11 | v25 Block 3 | Cell page never 404s on missing data (synthesis fallback) | PASS |  |
| 12 | v25 Block 2 + Block 6 | Featured tile shows a $-prefixed revenue (not 'Click for details') | PASS |  |
| 13 | v25 Block 7 | /industries Popular list links to global pages | PASS |  |
| 14 | v24 Block 4 | Lyon → 'Lyon' label (manual alias works) | PASS |  |
| 15 | Plan v26 A.3 | /og/cell route returns image (Edge-to-Node switch landed) | PASS |  |
| 16 | v25 Block 6 | Featured tile count is 6 (symmetric 2x3 grid), not 9 | FAIL | Found wrong number of featured tiles (expected 6) |

## URLs probed

- / → HTTP 200
- /industries → HTTP 200
- /industries → HTTP 200
- /us/california/restaurants → HTTP 200
- /xx/yy/restaurants → HTTP 200
- /us/california/restaurants → HTTP 200
- /sitemap/0.xml → HTTP 200
- /sitemap/2.xml → HTTP 200
- /de/frankfurt/restaurants → HTTP 200
- /us/california/gyms → HTTP 200
- /xx/yy/restaurants → HTTP 200
- / → HTTP 200
- /industries → HTTP 200
- /fr/lyon/restaurants → HTTP 200
- /og/cell?country=us&geo=california&industry=restaurants → HTTP 200
- / → HTTP 200
