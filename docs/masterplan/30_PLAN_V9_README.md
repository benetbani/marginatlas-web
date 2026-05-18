# 30 · Plan v9 — Everything We Haven't Done

> Founder direction (2026-05-18): "prepare the next plan with everything
> that we have not done so far, improvements that we have not thought
> about. Focus on improving the home page. Improvements to the logic.
> Quality checks for the newly added countries. So many other things.
> Very detailed and quite long."
>
> This is the deepest planning round so far. Spans 15 new tracks (AA-OO)
> covering quality verification, home page completion, logic + bug fixes,
> SEO, performance, section pages, auth/Stripe, analytics, Wave 4
> ingest, distribution refinement, localization, public API, automated
> testing + CI, and product strategy items we've never planned.

---

## 1 · What's already shipped

Plan v7 + v8 highlights (for context):
- 191 countries surfaced (49 → 191 via free-coverage unlock)
- /ask production live (Claude Sonnet 4.5 agentic loop)
- QualityDots 1-10 system on every cell
- Home page upgraded (6 new sections: GlobalCoverageStrip,
  TaxOverlayTeaser, AskWidget, CityPicker, QualityLegend, plus
  the original featured tiles)
- Tax overlay MVP (64-country rate table + per-cell toggle)
- Sub-national ingest for US/AU/MX/GB/ES/NL/JP/BR/CA
- Wave 3 city overlay for 12 small countries
- 80+ city slug aliases (London boroughs, NYC, CDMX, etc.)
- Sitemap v2 with quality filter (~30k URLs)
- ~357k regional_cells rows total

## 2 · What's still missing

Roughly 15 new track files cover the gaps:

| # | Track | Theme | Effort |
|---|---|---|---|
| 31 | AA — Quality verification + anomaly detection | Catch bad cells before users do | 10-12 hr |
| 32 | BB — Home page completion | What's STILL missing on / | 8-10 hr |
| 33 | CC — Logic improvements + bug fixes | Slug resolution, edge cases, error handling | 10-12 hr |
| 34 | DD — SEO + OG images + structured data | Per-cell discoverability | 8-10 hr |
| 35 | EE — Performance + ISR + monitoring | Make 357k cells fast | 8-9 hr |
| 36 | FF — Section pages + /world + country enrichment | Containers stop being stubs | 18-22 hr |
| 37 | GG — Coverage audit + per-country scorecard + /coverage | Public-facing quality accounting | 6-8 hr |
| 38 | HH — Top-1000 cities full curation | Scale beyond 200 | 14-18 hr |
| 39 | II — Auth + Stripe + Pro features | Paid tier infrastructure | 18-24 hr |
| 40 | JJ — Analytics + monitoring + error tracking | Operational visibility | 5-7 hr |
| 41 | KK — Wave 4-8 city overlay for 142 new countries | Cities for every covered country | 5-7 hr |
| 42 | LL — Distribution + density refinement | Better histograms, confidence intervals | 6-8 hr |
| 43 | MM — Localization + i18n + currency | Multi-language + local currency | 12-15 hr |
| 44 | NN — Public API + SDK + webhooks | Ecosystem play | 15-20 hr |
| 45 | OO — Tests + CI + visual regression | Catch regressions before they ship | 15 hr |

Total estimated effort: **~165-195 hours** spread across 12-16 sessions.

## 3 · Reading order

For executors:
1. Read `46_EXECUTION_PROMPT_V9.md` (paste-ready for autonomous run)
2. Read the per-track file before executing that track
3. Honour the never-do rules in `docs/handoff/10_NEVER_DO_RULES.md`

For founder skimming:
1. This file (you are here)
2. `31_TRACK_AA_QUALITY_VERIFICATION.md` (highest-criticality)
3. `32_TRACK_BB_HOMEPAGE_COMPLETION.md` (most visible polish)
4. `38_TRACK_HH_TOP_1000_CITIES.md` (your explicit ask from earlier)

## 4 · Tracks summary one-liner each

- **AA Quality Verification**: scan all cells for anomalies (outliers,
  monotonicity violations, suspicious zeros, cross-source disagreements)
- **BB Home Page Completion**: hero rewrite, "what's new" strip, footer
  redesign, search-Cmd+K-on-home, country/sector chips, founder's voice
- **CC Logic + Bug Fixes**: slug resolution bug (metal→mining), Mexico
  CDMX names, smart 404, error boundaries, adaptive breadcrumbs
- **DD SEO**: per-cell OG images, JSON-LD enrichment, canonical tags,
  internal linking, hreflang scaffolding
- **EE Performance**: ISR tuning per tier, build-time precompute, edge
  runtime audit, image optimization, bundle audit
- **FF Section Pages**: /world map page, country page tax + neighborhood
  + quality summary, sector cross-country view, compare upgrades, browse
  page rebuild
- **GG Coverage Audit**: per-country scorecard JSON + markdown report +
  public /coverage page with world heatmap
- **HH Top-1000 Cities**: source from UN/OECD/Brookings + per-city overlay
  + /cities directory page
- **II Auth + Stripe**: Supabase magic link + Google + Stripe checkout +
  Pro feature gates + billing portal
- **JJ Analytics**: Vercel/Plausible + /ask cost monitoring + top-query
  dashboard + Sentry error tracking
- **KK Wave 4 City Overlay**: capital + 3-5 major cities for each of 142
  new countries
- **LL Distribution Refinement**: bootstrap CIs, smarter tail modeling,
  year-over-year deltas, industry-mix sankey
- **MM Localization**: en/es/de/fr/jp; localized number formats; local
  currency display option (still USD as anchor)
- **NN Public API**: REST + GraphQL endpoints, OpenAPI spec, Python +
  JS SDKs, webhooks for data updates
- **OO Testing + CI**: Playwright E2E smoke tests, Percy/Chromatic visual
  regression, TS strict mode tightening, unit tests for critical helpers,
  GitHub Actions polish, Husky pre-commit hooks

## 5 · Maintenance protocol (unchanged)

Same as previous plans:
1. Update `04_CURRENT_STATE.md` at session end
2. Append decisions to `03_DECISION_LOG.md`
3. Strike through done items in `11_NEXT_STEPS.md`
4. Commit `handoff: <summary>` and push
5. `tsc --noEmit` + `verify_taxonomy.ts` + `npm run lint` before every commit

## 6 · Plan v9 vs v8 vs v7

| Plan | Focus | Status |
|---|---|---|
| v6 (12 tracks A-L) | Sub-national ingest pipeline | Largely shipped (sessions 5-9) |
| v7 (5 tracks M-Q) | Wave 2 UX: cities + neighborhoods + tax + nav | M+N+P shipped, O partial, Q pending |
| v8 (8 tracks R-Y) | Extrapolation + quality + section pages + audit | R+S+U+V.1 shipped, T+W+X+Y pending |
| **v9 (15 tracks AA-OO)** | Everything else | Pending |

After v9 ships, the atlas is a complete product: 191 countries with
data, 1000+ cities curated, tax overlay, quality verification,
multilingual, auth/Stripe, public API, monitored, well-tested.

That's the goal.
