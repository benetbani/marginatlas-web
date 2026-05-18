# 42 · Track LL — Distribution + Density Refinement

> Better histograms. Confidence intervals. Year-over-year deltas.
> Smarter tail modeling. Sankey for industry mix.

---

## 1 · Goal

Statistical sophistication beyond the current 5-percentile piecewise-uniform
density. Better reflects the long-tail nature of SMB revenue distributions.

---

## 2 · Sub-tracks

### LL.1 — Bootstrap confidence intervals

For each cell, compute bootstrap CI around p50:
- Pull N independent re-samples of {p10, p25, p50, p75, p90}
- For each bootstrap, perturb each percentile by ε ~ Uniform(-5%, +5%)
- Compute resulting medians
- Take 2.5%-97.5% of the distribution as 95% CI

Render: "Typical $X (95% CI $Y - $Z)" instead of just $X.

Effort: 2 hr.

### LL.2 — Smarter tail modeling

Current histogram models the right tail as `(pMax = p90 + 0.6 × (p90-p75))`.
For very long-tail distributions (revenue p90/p50 > 5), this clips
the true tail.

Replace with Pareto-tail fit:
- Fit Pareto distribution to p75-p90 portion
- Extrapolate to p99 using Pareto's shape parameter
- Render histogram with proper Pareto tail

Effort: 3 hr.

### LL.3 — Year-over-year deltas

Cell page shows year + value. Add: comparison to previous year (when
multiple years exist in regional_cells):
- "+8.3% vs 2023"
- Color: moss for positive growth, clay for negative
- Sparkline showing 3-5 year trend

Effort: 2 hr.

### LL.4 — Industry mix sankey

On sector pages, show flow chart:
- Source: total establishments in sector
- Flows: split by sub-industry × country
- Sink: typical revenue per industry

Sankey diagram via simple SVG (no D3 dependency).

Effort: 3 hr.

### LL.5 — Cross-city normalization

Currently all revenue in USD. Add option:
- "PPP-adjusted" toggle on cell page
- "Cost-of-living adjusted" toggle
- Both use a per-country PPP factor + COL index

Source: World Bank PPP conversion + Numbeo COL or equivalent.

Effort: 2 hr.

---

## 3 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| LL.1 Bootstrap CIs | 2 hr | MED |
| LL.2 Pareto tail | 3 hr | MED |
| LL.3 YoY deltas | 2 hr | HIGH |
| LL.4 Industry mix sankey | 3 hr | LOW |
| LL.5 Cross-city normalization | 2 hr | MED |
| **Total** | **~12 hr** | |

---

## 4 · Verification gate

- All 5 features render correctly on sample cells
- Visual comparison: new distributions feel more natural for long-tail
  cells (e.g. /us/california/restaurants)
- YoY deltas show for cells with multiple years of data

---

## 5 · What this unlocks

- Distribution quality goes from "OK" to "statistically respectable"
- YoY trend gives users a "what's changing" signal
- PPP toggle answers "is this real wealth or just exchange rate"
