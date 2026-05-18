# 27 · Track X — Coverage Audit + Quality Report

> After Tracks R-W land, audit the state of the database. Per-country
> coverage score 1-10. Gaps clearly listed. Recommended next-session
> targets ranked by impact.

---

## 1 · Goal

A single audit report (`docs/ingest/COVERAGE_AUDIT_v2.md`) that:
- Lists every country in COUNTRIES
- Per country: cell count, distinct industries, avg quality_10,
  city count, tax overlay coverage (Y/N)
- Identifies the 20 highest-impact gaps to fill next
- Lists countries below quality threshold (< 4 avg) — candidates for
  removal OR aggressive proxy upgrade

---

## 2 · X.1 — Audit script

`scripts/audit_coverage_v2.py`:

```python
"""Coverage audit per country, post Track R-W."""
import requests, json
from collections import defaultdict

# For each country:
#   - count cells in regional_cells + extrapolated_cells fallback
#   - distinct industries
#   - avg quality_10
#   - city count (city_overlay rows)
#   - is_in_tax_table?
#   - is_in_top100?

OUTPUT = "delivery/coverage_audit_v2.json"
```

Output structure:
```json
{
  "generated_at": "2026-05-18T...",
  "totals": {"countries": 100, "cells": 400000, "cities": 200},
  "per_country": [
    {"iso2": "US", "cells": 100000, "industries": 80,
     "avg_quality_10": 8.5, "cities": 12, "tax_coverage": true,
     "in_top100": true, "verdict": "EXCELLENT"},
    ...
  ],
  "gaps": [
    {"iso2": "...", "issue": "no city data", "priority": "HIGH"},
    ...
  ],
  "remove_candidates": [
    {"iso2": "VEN", "reason": "avg_quality_10 = 1.8"},
    ...
  ]
}
```

Effort: 2 hr.

## 3 · X.2 — Coverage report doc

Convert audit JSON to `docs/ingest/COVERAGE_AUDIT_v2.md` with:
- Top-line numbers (countries / cells / cities / avg quality)
- Per-tier breakdown (10/9/8 / 7/6/5 / 4/3/2/1)
- Per-region breakdown (Europe / N America / LATAM / Asia / MENA / Africa / Oceania)
- Heatmap-style table (country × quality 1-10)
- Top 20 priority gaps with effort estimate per
- Removal candidates with reason

Effort: 1.5 hr.

## 4 · X.3 — Coverage page on the site

`/coverage` — public page showing:
- World map with country dots colored by quality
- Filterable table
- "Where would you like us to expand?" CTA (placeholder for future
  feedback form)

Effort: 3-4 hr (server component with the map + data table).

## 5 · X.4 — Per-country quality summary on landing pages

Add to `/[country]` page: "Coverage quality: X/10 across N cells."
With link to /coverage filtered to that country.

Effort: 30 min (Track T.1 overlap).

## 6 · X.5 — Quality threshold enforcement

CI check: fail build if any country in COUNTRIES has avg quality < 3
(unless explicitly allowlisted as "watch-list" in a small JSON file).

Effort: 1 hr.

---

## 7 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| X.1 Audit script | 2 hr | HIGH |
| X.2 Coverage doc | 1.5 hr | HIGH |
| X.3 Coverage page | 3-4 hr | MED |
| X.4 Per-country summary | 30 min | LOW (Track T overlap) |
| X.5 CI threshold | 1 hr | MED |
| **Total** | **~8-9 hr** | |

---

## 8 · Verification gate

- `docs/ingest/COVERAGE_AUDIT_v2.md` exists with all required sections
- `/coverage` page renders
- Per-country page shows quality summary
- CI fails when a "removed" country has avg quality > 3 (sanity check)

---

## 9 · What this unlocks

- Honest, public-facing accounting of data quality
- Founder + future sessions know exactly what's strong / weak
- Quality scoring becomes a first-class product surface (trust signal)
