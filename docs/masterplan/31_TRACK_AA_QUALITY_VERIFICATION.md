# 31 · Track AA — Quality Verification + Anomaly Detection

> Founder direction (2026-05-18): "quality checks for the newly added
> countries." After Plan v8 unlocked 142 new countries via proxy
> extrapolation, we need automated checks that catch bad cells before
> users find them.

---

## 1 · Goal

Build a continuous quality verification pipeline that:
- Scans all ~357k cells for anomalies (outliers, monotonicity violations,
  suspicious zeros, currency conversion errors, source disagreements)
- Outputs a daily report with the 50 worst cells per category
- Updates `quality_10` scores when systemic issues are found
- Hides cells that fail hard rules
- Surfaces a per-country health dashboard

---

## 2 · Anomaly categories

### AA.1 — Monotonicity violations (already audited, near-zero)

Re-run periodically. `p10 ≤ p25 ≤ p50 ≤ p75 ≤ p90` must hold.

### AA.2 — Suspicious zeros

- Revenue zero but firms > 0
- Firms zero but revenue > 0
- Employees zero but firms > 0
- Payroll zero but employees > 0

### AA.3 — Outliers vs peers

For each (industry × size_band), compute median + IQR across all
countries. Flag cells where revenue_per_firm > 5× IQR above median
OR < 0.2× median below. These are likely currency conversion bugs or
source-data errors.

### AA.4 — Cross-source disagreement

When a (country × industry) has data in both regional_cells AND
extrapolated_cells:
- If the two values disagree by > 50%, flag for review
- Use this signal to refine extrapolation models

### AA.5 — Currency conversion sanity

For each cell, verify revenue_per_firm USD value is reasonable for the
country's GDP per capita. If revenue_per_firm > 100× GDP/capita for
small business, likely a FX bug.

### AA.6 — Year recency

Cells with year < 2018 should be flagged with a warning chip. Cells
with year < 2015 should be hidden from default UI.

### AA.7 — Quality vs source consistency

Cells with coverage_tier = 'P' should have quality_10 ≥ 7. If lower,
investigate why.

### AA.8 — Proxy chain depth

Track which proxy chain produced each cell. If chain depth > 2 (proxy
of proxy of proxy), force quality_10 to ≤ 4.

### AA.9 — Industry-mapping bugs

When the slug-to-industry resolver maps unexpectedly (the
metal-products-mfg → mining_quarrying bug from session 10), the cell
data is correct but the URL is misleading. Detect these by comparing
URL slug to resolved industry_id and warning users.

### AA.10 — Empty narrative cells

Cells that render with all 5 percentiles = null AND revenue_per_firm = null
AND n_employees = null shouldn't ship. Either fix the source OR hide.

---

## 3 · Implementation

### Script: `scripts/quality/scan_anomalies.py`

```python
"""Run all anomaly checks; output per-category JSON reports."""
import requests, json
from collections import defaultdict
from common.ram_guard import RamGuard

SUPABASE_URL = "..."
SVC = "..."

# Helpers for each check category
def check_monotonicity(rows): ...
def check_zeros(rows): ...
def check_outliers(rows): ...
def check_currency_sanity(rows): ...
# etc.

def main():
    with RamGuard(cap_mb=600, label="quality-scan"):
        # Pull all cells in batches; run checks; output report
        anomalies = defaultdict(list)
        for batch in paginate_cells():
            for row in batch:
                for check_name, check_fn in CHECKS.items():
                    issues = check_fn(row)
                    if issues:
                        anomalies[check_name].extend(issues)

        # Write JSON report
        with open("delivery/quality/scan_report.json", "w") as f:
            json.dump(dict(anomalies), f, indent=2)
        # Write top-50 per category to markdown
        write_markdown_report(anomalies)
```

Effort: 4 hr.

### Script: `scripts/quality/update_quality_10.py`

For cells that hit certain anomaly categories, update quality_score in
Supabase (via PostgREST PATCH). Examples:
- Suspicious zeros → quality_10 -= 2
- Outliers > 5× IQR → quality_10 set to max(2, current - 3)
- Proxy chain depth > 2 → quality_10 capped at 4

Effort: 2 hr.

### CI integration

Add `npm run verify:quality` that runs the scan in CI; fail build if
> 100 critical anomalies (severe outliers, monotonicity violations).

Effort: 1 hr.

### Per-country health dashboard

`/coverage/[iso2]` (extends Track GG): for each country, show:
- Total cells, by tier
- Anomaly count per category
- Recommended fixes
- Last scan date

Effort: 2 hr.

### Surface anomalies on cell pages

When a cell has known issues, render a small warning chip:
- "⚠ Outlier — typical for industry is $X, this is $Y. May be a
  currency conversion bug."
- "⚠ Stale data (2014). Newer benchmark available for [neighbor]."

Effort: 1.5 hr.

---

## 4 · Steps + effort

| Step | Effort |
|---|---|
| AA.1-AA.10 anomaly check implementations | 4 hr |
| Script: scan_anomalies.py | 2 hr |
| Script: update_quality_10.py | 2 hr |
| CI integration | 1 hr |
| Per-country health dashboard | 2 hr |
| Cell-page anomaly chips | 1.5 hr |
| **Total** | **~12-13 hr** |

---

## 5 · Verification gate

- Anomaly scan runs end-to-end in < 5 min
- Report identifies ≥ 100 cells across all categories (sanity — too few
  means checks aren't working)
- Quality_10 updates land in Supabase
- Per-country health dashboard renders for /us, /al, /mc
- Cell-page anomaly chip shows on a known-outlier cell

---

## 6 · What this unlocks

- Trust signal: founder + users see proactive quality work
- Bad cells caught + fixed before users find them
- Quality_10 becomes a TRUE confidence signal, not just a proxy depth marker
- Foundation for Pro-tier "verified data" badge (future)
