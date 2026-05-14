---
title: "Why we use friendly terms instead of statistical jargon"
date: "2026-04-20"
excerpt: "Replace 'median' with 'typical'. Replace 'p10/p90' with 'smallest 10% / biggest 10%'. The reasoning, in detail."
author: "Margin Atlas team"
---

Statistical terminology is a barrier for non-statisticians. We deliberately replace it with plain English:

- 'median' → 'typical' (with `?` tooltip explaining)
- 'p10' → 'smallest 10%'
- 'p90' → 'biggest 10%'
- 'mean wage per employee' → 'wage per employee'
- 'NAICS 6-digit classification' → '(invisible to the user)'

The tradeoff: some statisticians find our terms imprecise. We chose accessibility because:

1. Statisticians can still find precision in the methodology page
2. The 95% of non-statistician users get value from accessible labels
3. Friendly UI doesn't lose anything statistically — the underlying numbers are unchanged
