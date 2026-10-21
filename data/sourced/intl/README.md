# data/sourced/intl: official business statistics for the catalog's countries outside the EU, the US and the UK

Written by job D4 (data-intl), 2026-10-18. Every file follows the sourced-data contract (PLAN-replicable Task 1) and passes
`python3 /srv/atlas/wc/briefs/validate_sourced.py data/sourced/intl`. `scripts/` holds the script that wrote each file
(raw downloads are not committed; they were in /srv/atlas/runs/data-intl/dl on the build server).

| file | publisher | what it holds | level | licence |
|---|---|---|---|---|
| oecd-sdbs.json | OECD | SDBS structural statistics: Korea, New Zealand, Türkiye, Israel, Costa Rica, Chile and Colombia (shares only), Japan and Canada totals | country | CC BY 4.0 |
| oecd-business-demography.json | OECD | survival of EMPLOYER enterprises: Korea, New Zealand, Israel, Canada, Brazil, Colombia | country | CC BY 4.0 |
| statcan-canada.json | Statistics Canada | business counts (locations) June 2026 by metro area and city, food-service finances 2024 by province, populations | country, region, metro, city | Statistics Canada Open Licence |
| abs-australia.json | Australian Bureau of Statistics | business counts June 2025 by state and class and by capital-city council (division only), survival of 2021-22 entrants, industry shares 2024-25, populations | country, region, city | CC BY 4.0 |
| estat-japan.json | Statistics Bureau of Japan, METI | 2021 Economic Census: restaurants (group 76), coffee shops, barbers; ten cities; 2020 census populations | country, city | Government of Japan Standard Terms (CC BY 4.0 compatible) |
| inegi-mexico.json | INEGI | 2024 Economic Census (year 2023): Mexico and Mexico City; 2020 census population | country, city | INEGI terms of free use |
| ibge-brazil.json | IBGE | CEMPRE 2024 for eight cities, PAS 2024 finances, employer survival to 2022, population estimates | country, region, city | IBGE free reuse with citation |
| statssa-south-africa.json | Statistics South Africa | food and beverages industry 2022: margins and cost shares | country | Stats SA, use with acknowledgement |
| mospi-india.json | MoSPI (NSO) | ASUSE 2025, unincorporated sector, all activities | country | GODL-India |
| nbs-china.json | NBS China | catering enterprises above designated size, 2024, by municipality and province (typed from the yearbook image) | country, city, region | citation of source |
| bps-indonesia.json | BPS-Statistics Indonesia | food and beverage services 2023, national totals (rounded as published) | country | citation of source |
| minimum-wages.json | national and provincial governments | legal minimum wages, each row its own government page | country, region, city | official notices |

Rules for the loader and the pages:
- Compare only like with like: the count unit differs by country (enterprises, establishments, business locations, local
  units, economic units, enterprises above designated size). Never rank two countries' counts together.
- Several rows can share item, trade and geo with different `officialClass` or `unit` (Japan table 7-1 and 9-1A; Canada
  722511 and 7225; Brazil CEMPRE and PAS). Filter by class and unit, not by item alone.
- Margins are named for what they are: `gross_operating_rate` (operating surplus), `operating_profit_margin`,
  `net_profit_margin`, `pretax_profit_margin`, `ebitda_share` are different measures and are never shown as one.
- Survival: OECD and IBGE rows are EMPLOYER enterprises or units; ABS rows are all businesses. Never in one ranking.
- One class covering two trades is written under both (`restaurants` and `cafes`), the note says so.
