# Page-fill audit (Plan v24 Block 5)

Generated 2026-05-22T02:08:56.812Z against https://www.marginatlas.com.

Sample: 150 cell URLs drawn from Supabase (manual cities × top industries + top regional_cells + top US states).

## Summary

- ok: **149** (99.3%)
- thin: **0** (0.0%)
- missing-core: **1** (0.7%)
- broken: **0** (0.0%)
- rate-limited: **0** (0.0%)

## Section presence

- narrative: 59 (39.3%)
- revenue-tiles: 149 (99.3%)
- tax-and-cost-panel: 149 (99.3%)
- revenue-distribution: 149 (99.3%)
- across-states: 149 (99.3%)
- related-cells: 0 (0.0%)

## First 50 thin / missing / broken URLs

- missing-core (score 0.00, HTTP 200): /br/br-sp/auto-dealers-gas
  - missing: narrative, revenue-tiles, tax-and-cost-panel, revenue-distribution, across-states, related-cells

## Wired into

- `data/quality/thin_pages_v1.json` — sitemap excludes these URLs
- `src/app/sitemap.ts` reads via `isPathSuppressed()` at build time
