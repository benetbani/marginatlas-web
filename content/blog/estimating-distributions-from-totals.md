---
title: "How we estimate per-firm distributions when only totals are public"
date: "2026-05-05"
excerpt: "Some countries only publish aggregates: total revenue for all restaurants in France. We use US-anchored shape transfer to derive the distribution."
author: "Margin Atlas team"
---

Statistical agencies vary widely in what they publish. The US Census Bureau gives us full per-firm distributions for NAICS-6 × state × size band. Eurostat gives us aggregates for NACE × size band × NUTS-2.

When we only have a country-industry total, we can't directly say what the typical firm earns. But we can estimate.

### Shape transfer

For each (country, industry, size band) cell that lacks a distribution, we:

1. Find the matching US cell (same friendly industry, same size band). We know its full p10-p90 in USD
2. Compute the country's mean revenue per firm from the aggregate
3. Scale the US distribution shape by the ratio of country mean to US mean
4. Tag the result as **Estimated** so users know

The assumption is that within a given industry × size band, the *shape* of the distribution is roughly similar across countries: what changes is the magnitude. This holds well for tradable goods and surprisingly well for many services.

We mark every shape-transferred number with a clear 'Estimated' badge.
