---
title: "Reading Eurostat SBS: a non-economist's guide"
date: "2026-04-26"
excerpt: "Eurostat's Structural Business Statistics is the most under-used public dataset in Europe. Here's how to find what you need."
author: "Margin Atlas team"
---

Eurostat's SBS family of tables is gold, comprehensive, free, well-maintained, but the table names are inscrutable.

Key ones:

- **sbs_sc_sca_r2**: by NACE × size class, EU-wide
- **sbs_na_sca_r2**: by NACE × size class, finer detail
- **sbs_r_nuts06_r2**: by NUTS-2 region × NACE
- **bd_size_r3**: business demography by size
- **earn_ses_***: earnings by NACE × size

The quirks:

- Codes like 'V11110' mean 'Number of enterprises'. 'V12110' is turnover.
- Years 2008-2021 are well-covered; 2022 partial.
- Some EU candidate countries (Serbia, Bosnia) are included.

We pull all of these into raw parquets, normalize, and serve. The hard part is done.
