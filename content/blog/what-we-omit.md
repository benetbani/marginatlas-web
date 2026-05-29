---
title: "What we won't show: data quality and what we omit"
date: "2026-04-29"
excerpt: "We delete cells with fewer than 5 firms, and we flag any cell where the underlying disclosure isn't safe."
author: "Margin Atlas team"
---

Statistical agencies have privacy rules. When a (state × industry × size band) cell contains fewer than 3 firms, the agency suppresses the numbers: publishing them could identify individual businesses.

Margin Atlas inherits those rules and adds two of our own:

1. **No cell with fewer than 5 reported firms** appears on the site (raises the privacy bar).
2. **No revenue figure with a coefficient of variation > 30%** is shown without a clear 'high uncertainty' flag.

This means some cells you might expect (e.g. 'plumbing in Wyoming, 250+ employees') won't show up. Those firms exist, but there are too few to publish honestly.
