# data/sourced/trades (the UK share, S-U1, 2026-10-20)

The UK files of branch data-trades (job D6; its report /srv/atlas/wc/reports/data-trades.md), only what the UK trade pages read:

| file | what it holds | from data-trades |
|---|---|---|
| `classes-uk.json` | the class map's UK SIC 2007 rows, 212 trades (codes, titles, match, otherParts, evidence) | `classes.json`, 1 of its 11 classifications (`scripts/uk_trim.py`) |
| `ons-abs.json` | ONS Annual Business Survey 2024: enterprises, mean turnover, cost shares, gross operating rate; divisions by region | whole |
| `ons-business-counts.json` | UK Business Counts March 2026, seven UK cities: read for DENSITY ONLY (businesses for every 10,000 people, oriented among the seven); a count never prints (his ruling of 2026-10-20) | whole |
| `ons-business-demography.json` | ONS business demography 2024: survival by SIC group | whole |
| `vat-by-activity-uk.json` | the VAT rates HMRC sets by activity, UK rows | `vat-by-activity.json`, UK rows (`scripts/uk_trim.py`) |

Rows carry `classCode`, not `trade`: the loader keeps them apart (`sourcedClassRows`, src/lib/sourced/load.ts) and the trade page joins
them through `classes-uk.json`. Beside them, written by this job from held or official files: `business/ons-abs-size-sections-2024.json`
(every ABS section by size band, the people tiers; `business/scripts/uk_abs_size_sections.py`) and `business/hmrc-tax-gap-2026.json`
(HMRC's tax gap 2024 to 2025, the informal block; `business/scripts/uk_hmrc_tax_gap.py`).
