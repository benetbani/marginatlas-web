# Phase 19 — Verification, quality gates, and the running scoreboard

> Continuous verification doc maintained throughout phases 1–18. Each
> phase appends a one-paragraph summary on completion. This file is
> the founder-facing scoreboard for how the sub-national plan is going.

## Per-phase scoreboard

| Phase | Status | Rows added | Spot-check pass rate | Notes |
|---|---|---|---|---|
| 01 EU NUTS | not started | 0 / 260,000 target | — | — |
| 02 EU LAU | not started | 0 / 150,000 target | — | — |
| 03 DE Kreise | not started | 0 / 24,000 target | — | — |
| 04 FR communes | not started | 0 / 60,000 target | — | — |
| 05 IT comuni | not started | 0 / 30,000 target | — | — |
| 06 ES municipios | not started | 0 / 30,000 target | — | — |
| 07 UK LAD/MSOA | not started | 0 / 37,000 target | — | — |
| 08 JP municipalities | not started | 0 / 7,500 target | — | — |
| 09 KR sigungu | not started | 0 / 7,000 target | — | — |
| 10 US counties+MSA+ZIP | not started | 0 / 175,000 target | — | — |
| 11 CA CSD | not started | 0 / 30,000 target | — | — |
| 12 AU+NZ | not started | 0 / 22,500 target | — | — |
| 13 IN+CN | not started | 0 / 20,000 target | — | — |
| 14 SEA | not started | 0 / 15,000 target | — | — |
| 15 LATAM | not started | 0 / 35,000 target | — | — |
| 16 MENA+AF | not started | 0 / 22,000 target | — | — |
| 17 OECD+WB | not started | 0 / 8,000 target | — | — |
| 18 City overlay | not started | 0 / 5,000 target | — | — |
| **TOTAL** | | 0 / **~940,000** | | |

## Quality gates (per phase)

Each phase must pass ALL of these before it counts as DONE:

1. **Rowcount within ±10%** of the target stated in the phase doc
2. **Spot-check pass rate ≥ 90%** — phase doc lists 10–25 specific URLs; each must return measured (not extrapolated) data
3. **No NULL geo_name** rows
4. **No orphan industry_id** — every row's industry_id exists in our taxonomy
5. **Coverage tier distribution makes sense** — Phase 1 (Eurostat) should be majority "S"; Phase 18 (city overlay) should be 100% "X"
6. **RAM peak < 600 MB RSS** during the pipeline run (logged by `ram_guard.py`)
7. **Resume from interruption tested** — kill the script mid-batch, restart, completes
8. **Sitemap auto-updated** — the new URLs appear in `/sitemap.xml`

## Global verification (after all phases)

Run `scripts/audit_regional_coverage.py`:

1. Total rows in `regional_cells` ≥ 700,000
2. ≥ 80% of (top-40-SMB-industry × top-200-city-globally) cells return measured data, not extrapolated
3. Coverage map per country shows multi-tier depth (state + city wherever possible)
4. No country in `COUNTRIES` is country-level-only
5. Featured cell tiles on home upgraded to point at city-level URLs where supported

## Test plan

`scripts/test/regional_smoke_test.py` — picks 200 random `(country, geo, industry)` URLs from `regional_cells` weighted by traffic; HTTP-fetches each from production and asserts:
- Status 200
- `<h1>` contains the industry name
- Distribution chart present
- AtlasScore renders
- No "Coming soon" string
- Coverage badge tier matches database tier

Run before each phase deploy + nightly cron after launch.

## Coverage map per country (template)

| Country | National | State/Province | District/County | Municipality/City | Notes |
|---|---|---|---|---|---|
| DE | ✓ | ✓ (16 Länder) | ✓ (401 Kreise) | ✓ (top 1k Gemeinden) | Phase 3 |
| FR | ✓ | ✓ | ✓ | ✓ (top 2k communes) | Phase 4 |
| IT | ✓ | ✓ | ✓ | ✓ (top 1k comuni) | Phase 5 |
| ES | ✓ | ✓ | ✓ | ✓ (top 1k municipios) | Phase 6 |
| UK | ✓ | ✓ | ✓ | ✓ (374 LAD + 500 MSOA) | Phase 7 |
| JP | ✓ | ✓ | n/a | ✓ (top 200) | Phase 8 |
| KR | ✓ | ✓ | n/a | ✓ (226 sigungu) | Phase 9 |
| US | ✓ | ✓ | ✓ (3,143 counties) | ✓ (384 MSA + 10k ZIP) | Phase 10 |
| CA | ✓ | ✓ | ✓ (293 CMA) | ✓ (top 500 CSD) | Phase 11 |
| AU | ✓ | ✓ | ✓ (SA4) | ✓ (top 300 SA2 + 100 LGA) | Phase 12 |
| NZ | ✓ | ✓ | n/a | ✓ (67 TLA) | Phase 12 |
| IN | ✓ | ✓ | ✓ (766 districts) | ✓ (top 100 cities) | Phase 13 |
| CN | ✓ | ✓ | n/a | ✓ (top 30 prefecture cities) | Phase 13 |
| SEA-6 | ✓ | ✓ | varies | ✓ (top 10–30 per country) | Phase 14 |
| LATAM-6 | ✓ | ✓ | n/a | ✓ (top 100–500 muni per country) | Phase 15 |
| MENA-AF-9 | ✓ | ✓ | varies | ✓ (top 10–30 per country) | Phase 16 |
| Long-tail OECD/WB | ✓ | ✓ | n/a | OECD FUA where available | Phase 17 |
| Long-tail other | ✓ | ✓ (partial) | n/a | top-5 city overlay | Phase 18 |

## Phase-completion log (updated as phases finish)

(empty — appended as phases complete)
