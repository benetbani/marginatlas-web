# Margin Atlas UK register tables, version 2026.10

Tables computed by Margin Atlas from official UK registers: what each one is, where it comes from, what it leaves out.
Our derived tables are offered under CC BY 4.0 (attribution: Margin Atlas, with the version); the sources' own
licences and attribution lines below apply to the figures they supply.

## Files

- `trades_by_borough.csv`: 4,795 rows
- `food_by_borough.csv`: 487 rows
- `survival_by_borough.csv`: 38 rows
- `survival_by_trade_group.csv`: 76 rows
- `rateable_value_by_borough.csv`: 735 rows
- `station_footfall.csv`: 430 rows
- `failures_by_trade.csv`: 137 rows
- `trades_sic.json`: the site's trades mapped to UK SIC 2007 codes (exact, shared, approximate), each with its note
- `ledger.json`: every kind of figure, how it is made, its source, date, licence line and what it leaves out

Not in this free pack: `companies_by_district.csv` and `new_companies_by_month.csv` (postcode districts and monthly history).

## Sources and licences

- **Businesses and premises per trade and borough** (counted): ONS UK Business Counts (IDBR) via Nomis: NM_199_1 enterprises by industry and turnover band; NM_141_1 local units by industry and employment band. Source: Office for National Statistics licensed under the Open Government Licence v3.0. Data: March 2026 register snapshot; turnover is VAT-return turnover for the latest year the register holds.
- **The middle business's yearly turnover per trade and borough, with the quarter and tenth points** (worked out): ONS UK Business Counts (IDBR) via Nomis: NM_199_1 enterprises by industry and turnover band; NM_141_1 local units by industry and employment band. Source: Office for National Statistics licensed under the Open Government Licence v3.0. Data: March 2026 register snapshot; turnover is VAT-return turnover for the latest year the register holds.
- **The share of businesses turning over less than 100,000 pounds** (worked out): ONS UK Business Counts (IDBR) via Nomis: NM_199_1 enterprises by industry and turnover band; NM_141_1 local units by industry and employment band. Source: Office for National Statistics licensed under the Open Government Licence v3.0. Data: March 2026 register snapshot; turnover is VAT-return turnover for the latest year the register holds.
- **Food businesses, hygiene ratings and new businesses awaiting a first inspection** (counted): Food Standards Agency, food hygiene rating scheme open data (ratings.food.gov.uk/open-data). Contains public sector information licensed under the Open Government Licence v3.0. Food hygiene ratings data as of 2026-10-02. Data: 2026-10-02.
- **Live companies per trade and postcode district** (counted): Companies House free company data product (BasicCompanyData). Companies House register, snapshot of 2026-05-01. Data: 2026-05-01.
- **Company age and the share under two years old** (worked out): Companies House free company data product (BasicCompanyData). Companies House register, snapshot of 2026-05-01. Data: 2026-05-01.
- **The share of companies with secured borrowing** (worked out): Companies House free company data product (BasicCompanyData). Companies House register, snapshot of 2026-05-01. Data: 2026-05-01.
- **New companies a month per trade** (counted): Companies House free company data product (BasicCompanyData). Companies House register, snapshot of 2026-05-01. Data: 2026-05-01.
- **How many new businesses are still trading after one to five years** (worked out): ONS Business Demography, UK: 2024, reference tables (published 20 November 2025). Source: Office for National Statistics licensed under the Open Government Licence v3.0. Data: published 20 November 2025: births 2019 to 2023, births and closures in 2024.
- **Businesses born and closed in a year per borough** (counted): ONS Business Demography, UK: 2024, reference tables (published 20 November 2025). Source: Office for National Statistics licensed under the Open Government Licence v3.0. Data: published 20 November 2025: births 2019 to 2023, births and closures in 2024.
- **The official estimate of a year's rent per square metre, by kind of premises and borough** (counted): Valuation Office Agency, Non-domestic rating: business floorspace, March 2025 (special category by local authority). Contains public sector information licensed under the Open Government Licence v3.0. Data: 1 April 2021 (the 2023 rating list counted at 31 March 2025).
- **Station entries and exits on a weekday, a Saturday and a Sunday** (counted): TfL annual station counts 2025 (v08.2, 2026-07-06) and 2024; Powered by TfL Open Data. Powered by TfL Open Data. Data: counts for 2025 (released 6 July 2026) and 2024.
- **Saturday against a weekday at each station** (worked out): TfL annual station counts 2025 (v08.2, 2026-07-06) and 2024; Powered by TfL Open Data. Powered by TfL Open Data. Data: counts for 2025 (released 6 July 2026) and 2024.
- **Company insolvencies a year per 1,000 live companies, per trade** (worked out): The Gazette company insolvency notices (codes 2441, 2452, 2410 insolvent; 2431 solvent), published 2025-10-01 to 2026-09-30; Companies House register snapshot 2026-05-01. Contains public sector information licensed under the Open Government Licence v3.0. Data: notices October 2025 to September 2026; register of 1 May 2026.

## What the tables cannot see

- uk.businesses: registered businesses only: those registered for neither VAT nor PAYE (54% of UK businesses, most sole traders) are absent, so the median is the median of registered businesses and sits above the median of all
- uk.businesses: turnover is the enterprise's, counted at its registered address, so an area full of accountants' and formation agents' offices carries other areas' turnover
- uk.businesses: counts are rounded to the nearest 5 by the statistics office
- uk.businesses: where several trades share one SIC code, or a trade's code is only near it, the figure is the whole code's
- uk.businesses: the median is interpolated inside a turnover band on a log scale; neither it nor the quarter and tenth points are printed where an area holds under 40 enterprises (the register's own total)
- uk.businesses: the quarter and tenth points of sales are read the same way; one below 50k or above 50m rests on an assumed floor or ceiling, so it prints only as 'under 50k' or 'over 50m'
- uk.businesses: the range around the median is the lowest and highest median the true counts could give, each count being off by up to 2 because every whole count is rounded to the nearest 5 (the register is a census: rounding, not sampling, is its error); it does not cover where inside its band the median sits
- uk.businesses: a smooth curve fitted to the bands is kept only as a check and never printed: real takings are far from such a curve in most places, London restaurants most of all
- uk.turnover.median: registered businesses only: those registered for neither VAT nor PAYE (54% of UK businesses, most sole traders) are absent, so the median is the median of registered businesses and sits above the median of all
- uk.turnover.median: turnover is the enterprise's, counted at its registered address, so an area full of accountants' and formation agents' offices carries other areas' turnover
- uk.turnover.median: counts are rounded to the nearest 5 by the statistics office
- uk.turnover.median: where several trades share one SIC code, or a trade's code is only near it, the figure is the whole code's
- uk.turnover.median: the median is interpolated inside a turnover band on a log scale; neither it nor the quarter and tenth points are printed where an area holds under 40 enterprises (the register's own total)
- uk.turnover.median: the quarter and tenth points of sales are read the same way; one below 50k or above 50m rests on an assumed floor or ceiling, so it prints only as 'under 50k' or 'over 50m'
- uk.turnover.median: the range around the median is the lowest and highest median the true counts could give, each count being off by up to 2 because every whole count is rounded to the nearest 5 (the register is a census: rounding, not sampling, is its error); it does not cover where inside its band the median sits
- uk.turnover.median: a smooth curve fitted to the bands is kept only as a check and never printed: real takings are far from such a curve in most places, London restaurants most of all
- uk.turnover.under100k: registered businesses only: those registered for neither VAT nor PAYE (54% of UK businesses, most sole traders) are absent, so the median is the median of registered businesses and sits above the median of all
- uk.turnover.under100k: turnover is the enterprise's, counted at its registered address, so an area full of accountants' and formation agents' offices carries other areas' turnover
- uk.turnover.under100k: counts are rounded to the nearest 5 by the statistics office
- uk.turnover.under100k: where several trades share one SIC code, or a trade's code is only near it, the figure is the whole code's
- uk.turnover.under100k: the median is interpolated inside a turnover band on a log scale; neither it nor the quarter and tenth points are printed where an area holds under 40 enterprises (the register's own total)
- uk.turnover.under100k: the quarter and tenth points of sales are read the same way; one below 50k or above 50m rests on an assumed floor or ceiling, so it prints only as 'under 50k' or 'over 50m'
- uk.turnover.under100k: the range around the median is the lowest and highest median the true counts could give, each count being off by up to 2 because every whole count is rounded to the nearest 5 (the register is a census: rounding, not sampling, is its error); it does not cover where inside its band the median sits
- uk.turnover.under100k: a smooth curve fitted to the bands is kept only as a check and never printed: real takings are far from such a curve in most places, London restaurants most of all
- uk.food.counts: food businesses only, as the FSA registers them
- uk.food.counts: business types are the FSA's and coarse: restaurants, cafes and canteens share one type
- uk.food.counts: awaiting inspection is mostly new businesses, with some re-registrations
- uk.companies.live: limited companies and LLPs only: sole traders and partnerships are not on the register
- uk.companies.live: the address is the registered office, not necessarily where the business trades; mass-registration postcodes are left out
- uk.companies.live: dormant companies are left out
- uk.companies.live: a company carrying several SIC codes counts for each of its trades
- uk.companies.age: limited companies and LLPs only: sole traders and partnerships are not on the register
- uk.companies.age: the address is the registered office, not necessarily where the business trades; mass-registration postcodes are left out
- uk.companies.age: dormant companies are left out
- uk.companies.age: a company carrying several SIC codes counts for each of its trades
- uk.companies.charge: limited companies and LLPs only: sole traders and partnerships are not on the register
- uk.companies.charge: the address is the registered office, not necessarily where the business trades; mass-registration postcodes are left out
- uk.companies.charge: dormant companies are left out
- uk.companies.charge: a company carrying several SIC codes counts for each of its trades
- uk.companies.new: live companies only: a company dissolved before the snapshot is missing, so older months undercount (the survivor trap)
- uk.companies.new: limited companies and LLPs only; sole traders are not on the register
- uk.companies.new: London by registered office; mass-registration postcodes (more than 200 live companies) are left out
- uk.companies.new: a company carrying several SIC codes counts for each of its trades; trades sharing a code share its count
- uk.survival: registered businesses only (VAT or PAYE)
- uk.survival: a borough's survival is all trades together; the statistics office publishes no borough-by-trade cut
- uk.survival: a trade's curve is its whole SIC group's, across the UK
- uk.survival: counts are rounded to the nearest 5; percentages are recomputed from them
- uk.births_deaths: registered businesses only (VAT or PAYE)
- uk.births_deaths: a borough's survival is all trades together; the statistics office publishes no borough-by-trade cut
- uk.births_deaths: a trade's curve is its whole SIC group's, across the UK
- uk.births_deaths: counts are rounded to the nearest 5; percentages are recomputed from them
- uk.premises.rv_m2: rateable value estimates rent at the valuation date (April 2021), not today's asking rent
- uk.premises.rv_m2: a category suppressed for a borough ([c]) or not present ([z]) prints nothing
- uk.premises.rv_m2: many premises are valued in a general category: most salons and many cafes are valued as Shops
- uk.premises.rv_m2: pubs and hotels are valued on receipts, not floorspace, and are absent
- uk.footfall: station users only, not passers-by
- uk.footfall: not yet tied to postcode districts
- uk.footfall.saturday: station users only, not passers-by
- uk.footfall.saturday: not yet tied to postcode districts
- uk.failures: limited companies only; sole traders' insolvencies are personal data and are not counted
- uk.failures: the per-1,000 rate divides by live, non-dormant companies of the trade on the May 2026 register
- uk.failures: a notice whose company name does not match the register is left out (the match rate is printed)
- uk.failures: the district is the registered office's
- uk.failures: each rate per 1,000 live companies carries a 95% interval; it prints only where the year holds 10 or more insolvencies, and from 10 to 29 it is marked 'few cases'

## How to cite

Margin Atlas (2026). UK register tables, version 2026.10. https://www.marginatlas.com/data
