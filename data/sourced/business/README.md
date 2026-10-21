# data/sourced/business

Official business statistics behind the trade, city, country and activity pages, one row per published figure, in the
`SourcedFile` contract of the replicable-pages plan (Task 1). Every row names its item, trade, the publisher's own class
(`officialClass`), the place and level it is measured at (`geo`), its unit, its own year, and what the figure is (`measure`).
A row's own `source` overrides the file's. Money stays in the currency the source publishes. Retrieved 2026-10-17.

`scripts/` holds the Python that pulled and wrote each file (`python3 scripts/<name>.py`; the downloads went to
`/srv/atlas/runs/data-business/dl` on the build server and are not committed). Check with
`python3 /srv/atlas/wc/briefs/validate_sourced.py data/sourced/business`.

Trades: `restaurants`, `cafes`, `barbershops`, `all` (the whole business economy). A trade is mapped to the nearest official
class. The class actually counted is always in `officialClass`, and a division-wide figure says so in its note (for example
`cafes` = NACE 56.30 beverage serving, which is pubs and bars in the UK. `barbershops` = hairdressing and beauty in Europe).

| file | what it holds | level | licence |
|---|---|---|---|
| `eurostat-sbs-2023.json` | Eurostat structural business statistics 2023 (sbs_ovw_act, sbs_sc_ovw), NACE 56.10, 56.30, 96.02 and the business economy: enterprises, mean turnover per enterprise, persons employed per enterprise, gross operating rate, staff and purchases shares of turnover, size-class split | country, EU (every published country) | Eurostat copyright notice (reuse with the source acknowledged) |
| `eurostat-business-demography.json` | Eurostat business demography (bd_size, reference year 2024; 5 years from the closed series bd_9bd_sz_cl_r2, mostly 2020): 1, 2, 3, 5-year survival, divisions I56 and S96 and the total | country, EU | Eurostat copyright notice |
| `eurostat-ses-2022.json` | Eurostat Structure of Earnings Survey 2022: mean hourly earnings by occupation group (all, managers, service and sales, elementary) in NACE I, S and the total, enterprises with 10+ employees | country, EU | Eurostat copyright notice |
| `ons-abs-2024.json` | ONS Annual Business Survey 2024: UK classes 56.1, 56.3, 96.02, divisions 56, 96 and the total (enterprises, mean turnover, cost shares, gross operating rate derived from aGVA minus employment costs); London and the other regions for divisions 56, 96 and the total (shares only) | country, region | Open Government Licence v3.0 |
| `ons-business-counts-2026.json` | ONS UK Business Counts, March 2026: local units and enterprises by SIC subclass, Greater London and the six other UK cities | city | Open Government Licence v3.0 |
| `ons-business-demography-2024.json` | ONS Business demography 2024: survival by SIC group (561, 563, 960, total), cohorts born 2019 to 2023 | country | Open Government Licence v3.0 |
| `ons-ashe-2025.json` | ONS ASHE 2025 provisional, table 15: median hourly pay excluding overtime for the trades' occupations, London | region | Open Government Licence v3.0 |
| `us-economic-census-2022.json` | US 2022 Economic Census: employer establishments, mean receipts, payroll share of receipts, employees per establishment, NAICS 722511, 722513, 722515, 812111, 812112, for the 45 US cities | city | US federal work, public domain |
| `us-cbp-nes-2023.json` | US County Business Patterns 2023 (employer establishments) and Nonemployer Statistics 2023 (businesses, mean receipts), same classes plus all sectors, each city's principal county (New York's five) | county | US federal work, public domain |
| `us-bls-oews-2025.json` | BLS OEWS May 2025: median hourly wage for the trades' occupations, Los Angeles-Long Beach-Anaheim | metro | US federal work, public domain |
| `us-bls-bed.json` | BLS Business Employment Dynamics: establishment survival, NAICS 72, 81 and total private, cohorts opened 2020 to 2024 | country | US federal work, public domain |
| `istat-asia-2024.json` | ISTAT ASIA local units 2023 and 2024: Rome, Milan, Naples, Turin, Florence (comune, NACE 3-digit) and their provinces (ATECO 5-digit, 2024) | city, metro | CC BY 4.0 (ISTAT legal notes) |
| `ksh-yearbook-2024.json` | KSH Regional Statistical Yearbook 2024, table 5.5.11: catering units by type, Budapest and Hungary, 31 December 2024 | city, country | not read (KSH terms page not reachable from the server) |
| `minimum-wages-2026.json` | Minimum wages from each government's page: UK (GOV.UK), City of Los Angeles (Office of Wage Standards), Hungary (Decree 426/2025.); Italy `null` (no statutory minimum wage) | country, city | GOV.UK under the OGL; official notices and legal text |
| `populations.json` | Population for every boundary that carries a count, from the same country's office (ONS, Census Bureau, ISTAT, KSH), same geo codes | city, county, metro, country | each row's own source |

Rules for using these rows on a page: a count compares only within one country, one register and one population source; a
ranking draws only one harmonised source (Eurostat SBS, the UK beside it); the gross operating rate is never "profit"; every
printed figure carries its own year.
