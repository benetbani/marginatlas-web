---
title: "How many data cells do you have? A peek under the hood"
date: "2026-05-09"
excerpt: "419,895 direct cells + 9,111 distribution-transferred + 57,816 extrapolated. Almost 500k total."
author: "Margin Atlas team"
---

Margin Atlas v1.19 contains:

- **419,895** direct cells from primary statistical agencies (US, EU, JP, BR, PL, SG, NO, etc.)
- **9,111** cells with US-anchored shape-transferred distributions
- **57,816** extrapolated cells across 219 countries using regression on World Bank macro features

Total: ~487,000 cells. Every cell knows its quality tier and shows it as a star rating on the page.
