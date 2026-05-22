# Plan v24 — Sanity restoration (methodical)

> Approved by founder 2026-05-22. Twelve blocks. Each block has its own
> entry / exit criteria. Quality gates between blocks.

## Goal

Eliminate the cluster of data-integrity, UX-consistency, and link-correctness
bugs that surfaced in the 2026-05-22 walkthrough: residential-construction
showing $0.7B, Swiss restaurants at $245M, Frankfurt routing to Hessen,
half-empty featured grids, blank pages, silent industry substitutions.

## Architecture

Twelve sequential blocks, gated by exit criteria. Findings persist to
`data/quality/*` and `data/audit/*`. Suppression at the render layer
(never mutating source data). Disclosure when substitution happens.

## The twelve blocks

| Block | Focus | Effort |
|---|---|---|
| 1 | Scale-sanity scan + cross-country outlier flag + triage workflow | 5-6 hrs |
| 2 | Featured-tile consistency, hard guard against half-empty grids | 1-2 hrs |
| 3 | Industry-substitution disclosure banner | 2-3 hrs |
| 4 | City-alias expansion to ≥ 50 cities per top-30 countries | 3-4 hrs |
| 5 | Page-fill audit + sitewide suppression rule | 4-5 hrs |
| 6 | Cross-country chart root-cause fix | 1-2 hrs |
| 7 | Number-format consistency sweep | 2 hrs |
| 8 | Image quality + integrity audit | 2-3 hrs |
| 9 | Mobile responsive probe | 2-3 hrs |
| 10 | Accessibility audit | 2-3 hrs |
| 11 | SEO + structured-data integrity | 1-2 hrs |
| 12 | Performance regression test | 1-2 hrs |

## Approval gates

1. ✅ Now — full plan approved (2026-05-22)
2. After Block 1 Step 1.3 — triage decisions before suppression applied
3. After Block 4 Step 4.4 — sample of 30 city aliases before publish

## Cross-block quality gates

After every block:
- `npx tsc --noEmit` passes
- `npm run prebuild` passes (taxonomy, em-dashes, source-agencies, dead-links, featured-tiles)
- Local prod build returns 200 on top 20 URLs
- Commit + push
- Wait for Vercel deploy
- Re-curl top 20 URLs to verify

## Out of scope (Phase 2)

- Auth + Stripe (B-011 still deferred)
- Real-image commissioning ($1.8-3.5k Tier-1 spend)
- Atlas-badge embed program
- New ingest

## Documentation per block

- `data/audit/*_v1.json` (raw findings)
- `data/audit/*_REPORT.md` (human-readable summary)
- Commit per step (not sub-step)

## Status (2026-05-22, end of session)

All 12 blocks shipped to main. Commit chain:

| Block | Commit | Notes |
|---|---|---|
| 1 | `5aee0bd` | Scale-sanity scan + auto-triage + render-layer suppression |
| 2 | `a0daf51` | 6 verified featured tiles + prebuild guard |
| 3 | `8c7c77c` | CellFallbackBanner for industry substitution |
| 4 | `57fafd7` + `81eebee` | 91 manual city aliases retargeted to populated geo levels |
| 5 | `ef52712` | Page-fill audit + sitemap thin-page suppression |
| 6 | `b6589a5` | Cross-country chart SMB-bound filter |
| 7 | `40f6e42` | Canonical money formatter (17 duplicates removed) |
| 8 | `50d1ec7` | image_integrity.ts manifest probe (rate-limit handling) |
| 9 | `50d1ec7` | mobile_static_audit.ts + 3 real responsive fixes |
| 10 | `50d1ec7` | a11y_static_audit.ts (passed cleanly) |
| 11 | `d6c843e` + `52ca43f` | Unbroke production build + fixed sitemap-empty bug |
| 12 | `50d1ec7` | performance_static_audit.ts |

Biggest unforeseen discovery: production build had been failing
silently since Block 1 (triage.ts imported node:fs into the Edge OG
route). Vercel was rolling back to the last good build for weeks.
Fixed in `d6c843e`. The sitemap had additionally been emitting
zero URLs because Next 15 passes shard `id` as a string but the
dispatcher used strict-number equality (`id === 0`). Fixed in
`52ca43f`. Sitemap now contains 3,493 URLs across 5 shards.
