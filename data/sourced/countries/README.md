# data/sourced/countries: one harmonised official figure set for the catalog's countries (job D7, 2026-10-19)

Every file follows the sourced-data contract (PLAN-replicable Task 1) and is checked by
`python3 /srv/atlas/wc/briefs/validate_sourced.py data/sourced/countries`. Every value is read by a script in `_scripts/`
from the publisher's own file or API (raw pulls kept outside the repo, under /srv/atlas/runs/data-countries/dl). Money stays in
the currency the source publishes; nothing is converted. `geo.code` is the ISO 3166 alpha-2 code (the euro area is `EA`, level `eu`).

These files EXTEND data/sourced/business, place and rules: where an item name there already means a country's own page
(`minimum_wage`, `profit_tax_rate`), the harmonised series here takes its own name so a loader never confuses the two.

| File | Items | Source | Coverage |
|---|---|---|---|
| ilostat-minimum-wage.json | `minimum_wage_monthly` | ILOSTAT, statutory nominal gross monthly minimum wage, local currency | newest year, 90 catalog countries |
| oecd-corporate-tax-rates.json | `cit_rate_combined`, `cit_rate_central`, `cit_rate_small_business` | OECD Corporate Tax Statistics | 2026 (newest), 146 jurisdictions, 86 catalog countries |
| oecd-vat-rates.json | `vat_rate_standard`, `vat_rate_reduced` | OECD Consumption Tax Trends 2024, Annex Table 2.A.1 | as at 1 September 2023, 37 OECD members |
| eu-tedb-vat-rates.json | `vat_rate_standard`, `vat_rate_restaurant` | European Commission, Taxes in Europe Database | in force on 2026-10-19, 27 EU members |
| wdi-lending-rate.json | `lending_rate` | World Bank WDI FR.INR.LEND (IMF IFS) | 2016 to 2025, 66 catalog countries |
| bis-policy-rates.json | `central_bank_rate` | BIS central bank policy rates | December 2016 to 2025 and the newest month, 39 countries and the euro area |
| oecd-household-spending.json | `household_spending`, `household_spending_total` | OECD national accounts, Table 5 / 5A | newest year, 11 countries |
| unsd-household-spending.json | `household_spending`, `household_spending_total` | UN Statistics Division, Table 3.2 | newest year from 2015, 16 countries |
| wb-new-business-density.json | `new_business_density` | World Bank Entrepreneurship Database (WDI IC.BUS.NDNS.ZS) | 2015 to 2024, 100 catalog countries |
| wb-wgi-2025.json | `governance_control_of_corruption`, `_government_effectiveness`, `_regulatory_quality`, `_rule_of_law` | World Bank Worldwide Governance Indicators, 2026 update, the 0 to 100 scores of the 2025 revision (`GOV_WGI_*.SC`) | 2025, 215 (or 213) economies, 104 catalog countries |

Reading rules a builder must keep:
- `minimum_wage_monthly` is the ILO's monthly figure, often its own conversion of an hourly or daily rate (the note says how).
  It is said as "the statutory minimum, a month"; the law's own rate is `minimum_wage` in data/sourced/business and intl.
- `household_spending` rows are amounts: a share divides by the same country's `household_spending_total` of the same year.
  COICOP 2018 rows (Japan, Korea) are never set beside COICOP 1999 rows of the same division number.
- `lending_rate` is not a small-business rate (data note 19): it is said as the banks' lending rate.
- `central_bank_rate` for a euro member is the euro area's (`EA`).
- `new_business_density` counts limited companies only.
- `governance_*` is the official score, not a rank (the 2025 revision stopped publishing percentile ranks). `lower_n` of `of_n`
  is worked out from the published scores of every economy scored that year: said as a placement, never as the publisher's rank.

Licences: each file's `source.licence` says what was read. The BIS allows free use naming it, on condition that including the
statistics in a commercial product adds no charge for its users.


## Added for the industry page (2026-10-21)

| File | Items | Source | Coverage |
|---|---|---|---|
| eurostat-population-2023.json | `population_1jan` | Eurostat demo_pjan, population on 1 January 2023, both sexes, all ages (`_scripts/eurostat_population.py`) | 2023, every country Eurostat publishes and the EU of 27 |

Reading rule: `population_1jan` is the denominator of the industry page's restaurants for every 10,000 people (the 2023 enterprise
count of `business/eurostat-sbs-2023.json` over it). A country office's own count stays `population` in `business/populations.json`.
