---
title: "The shape-transfer method, explained"
date: "2026-04-21"
excerpt: "How we derive per-firm distributions for non-US cells when only national-level aggregates are available."
author: "Margin Atlas team"
---

When a statistical agency publishes only aggregates ('total turnover of all bakeries in Spain was €4.2B in 2022'), we can't directly tell what the typical bakery earns.

We use **shape transfer**: find the US analog (where we have full p10..p90 distributions for bakeries), compute the country's mean per firm from the aggregate, then scale the US distribution shape by that ratio.

Math:
```
scale = country_mean_per_firm / us_median_per_firm
estimated_p10 = us_p10 × scale
estimated_p25 = us_p25 × scale
…
```

We tag every shape-transferred cell with `derivation_method='shape_transfer'` and show a clear 'Estimated' badge so users know.
