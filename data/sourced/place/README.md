# data/sourced/place

The place figures for the replicable pages (plan Task 2, `/srv/atlas/wc/PLAN-replicable.md`). Every file follows the sourced-data
contract of Task 1: one row per published figure, each with its `geo.level`, `year`, `unit`, `measure` and its own `source` (the
file-level `source` is only the first of several publishers where a file mixes them). Checked by
`python3 /srv/atlas/wc/briefs/validate_sourced.py data/sourced/place`. Retrieved 2026-10-17. Money stays in the currency the source
publishes; nothing is converted.

| File | Rows | Items | What it holds | Licence |
|---|---|---|---|---|
| `populations-age.json` | 30 | `population`, `age_share` | City and metro population, each boundary named; share aged 65 and over and the younger band as each source bands it (UK 0 to 15, US under 18, Italy and Hungary 0 to 14). London and UK (ONS mid-2025), Los Angeles city, metro, US (ACS 2020-2024), Rome and Italy (Istat 1 Jan 2025), Budapest and Hungary (KSH 1 Jan 2026), functional urban areas of Rome, Budapest, London (Eurostat; London's last year is 2018) | OGL v3; US public domain; CC BY 4.0 (Istat, KSH, Eurostat) |
| `incomes.json` | 55 | `income`, `income_distribution` | One headline income per place, its measure in `measure`: ASHE median gross annual pay, full-time, workplace (London, UK) with mean and percentiles; ACS median household income (LA city, metro, US) with the 16 household bands; MEF mean declared taxable income (Rome, Italy) with the 8 bands of total declared income; KSH average gross monthly earnings by employer's head office (Budapest, Hungary). The four are different measures and never compare | OGL v3; public domain; CC BY 3.0 IT (MEF); CC BY 4.0 (KSH) |
| `visitors.json` | 10 | `visitors` | A year of visitors, the unit naming what is counted: visits (London, ONS 2025), visitors (Los Angeles Tourism 2025, rounded, boundary not named by the publisher), nights (Rome comune, Eurostat from Istat, 2025, break in series), arrivals and nights (Budapest, KSH 2025) | OGL v3; publisher's copyright (LA, one figure quoted); CC BY 4.0 |
| `visitors-monthly.json` | 84 | `visitors_month`, `visitors_quarter` | Months where the source publishes months: Budapest nights (KSH, Jan 2025 to Aug 2026), the province of Roma arrivals and nights (Istat, 2025). London is published by quarter only (ONS 2025, provisional). None for Los Angeles | CC BY 4.0; OGL v3 |
| `household-spending-eating-out.json` | 308 | `eating_out_share` | Catering services (COICOP 11.1) over household final consumption, every country and year from 2015 Eurostat publishes (national accounts, visitors' spending included); ONS Family Spending 11.1 for London and the UK (3-year average to FYE2025, residents only); BLS Consumer Expenditure food away from home for the Los Angeles metro, every 2-year table 2014-2015 to 2023-2024 | CC BY 4.0; OGL v3; public domain |
| `prime-street-rents-2025.json` | 90 | `prime_rent_m2_year` | Cushman & Wakefield Main Streets Across the World 2025: one figure per catalog city the report names, the city's most expensive street, EUR per m² a year (USD per sq ft, street, page and rank in `note`). `geo.code` is the catalog slug; each row has `country` (ISO2) | Cushman & Wakefield copyright: one figure per city quoted with attribution, the tables never reproduced |
| `voa-retail-rents-2025.json` | 39 | `shop_rent_m2_year` | VOA retail rateable value per m², 31 March 2025 (2023 list, valuation date 1 April 2021): London, its 33 boroughs (level `county`), Manchester, Leeds, Birmingham, Bristol, England and Wales. Scotland is not in the VOA list | OGL v3 |
| `flat-rents.json` | 37 | `flat_rent_month` | One-bedroom rents from official sources only: London and its 33 boroughs (ONS, rents recorded April 2025 to March 2026, median) and Los Angeles city, metro, US (ACS 2020-2024 median gross rent, sitting tenants). Rome and Budapest publish no official one-bedroom level | OGL v3; public domain |
| `transport-passes.json` | 6 | `transport_pass_month`, `transport_fare_cap_week` | Each operator's tariff, the zones in `note`: TfL Travelcard zones 1-2 and 1-6; LA Metro sells no monthly pass (`null` with the fact) and caps fares at USD 18 in seven days; ATAC monthly personal pass, Roma Capitale; BKK monthly Budapest pass | Operators' tariffs quoted as published |
| `uk-flat-rents-pipr-2026.json` | 7 | `flat_rent_month` | The seven UK catalog cities, August 2026, ONS Price Index of Private Rents (one-bed rental price, an average): English cities at the local authority, London at the region, Edinburgh and Glasgow at their Broad Rental Market Areas (level `metro`; the index has no Scottish council figure) | OGL v3 |
| `uk-transport-passes-2026.json` | 6 | `transport_pass_month` | Manchester (TfGM 28-day Bee Bus), Birmingham (NX West Midlands 4 week), Leeds (MCard Countywide Bus Month), Bristol (First FirstMonth, Bristol Zone), Edinburgh (Lothian Ridacard 4 week), Glasgow (First 4 Week City & Local); the unit says month or 28 days | Operators' tariffs quoted as published |
| `uk-visitors-ips-2025.json` | 12 | `visitors` | Visits and nights by overseas residents, 2025, for six UK cities: ONS Table 17 (top 50 GB towns), the table London's row comes from | OGL v3 |
| `uk-eating-out-regions-2025.json` | 5 | `eating_out_share` | ONS Family Spending A35 (3-year average to FYE2025), catering 11.1 over total expenditure: North West, West Midlands, Yorkshire and The Humber, South West, Scotland, each said as the region's | OGL v3 |
| `uk-business-births-la-2024.json` | 6 | `birth_rate` | ONS business demography 2024, births (1.1d) over active enterprises (3.1d), by local authority, all industries, six UK cities | OGL v3 |
| `uk5-uk-visits-month.json` | 24 | `uk_visits_month` | Overseas residents' visits each month, July 2022 to June 2024, the latest 24 months the ONS has published monthly (the series stops at June 2024; from July 2024 the survey's new design is quarterly only): 2022-23 final UK estimates (released 17 May 2024), January to June 2024 provisional Great Britain estimates (released 18 October 2024) | OGL v3 |
| `uk5-london-visits-month-worked.json` | 12 | `visits_month_worked` | WORKED OUT, not published: London's 2025 quarters (ONS Table 7, region visited) spread over their months by the UK's 2023 monthly pattern, London in month m = London's quarter x (UK month m / UK quarter); every row stamped `kind: "worked out"` with both inputs and the unrounded result in `inputs`. Pinned by `src/lib/sourced/uk5_visits_worked.test.ts` | OGL v3 |
| `uk5-london-airports-month.json` | 84 | `airport_passengers_month`, `airport_passengers_month_london` | Terminal passengers at Heathrow, Gatwick, Stansted, Luton, London City and Southend (the CAA's group London Area Airports), each month, September 2025 to August 2026, and the six summed a month; residents and visitors together, never a count of visitors | CAA conditions: referenced in any publication, never sold on |
| `uk5-voa-borough-rents-2026.json` | 36 | `shop_rent_m2_month` | Retail rateable value a m2, a month, for each of London's 33 boroughs, the publisher's groups Inner and Outer London, and the London region (the row behind the hero's GBP 22.42): VOA business floorspace, March 2026, Tables FS2.2 and FS2.1, the 31 March 2026 column over 12, the same arithmetic as `uk3-shop-rent-month-2026.json`; each borough row carries `geo.group` (inner or outer) | OGL v3 |
| `uk5-population-age-bands-2025.json` | 10 | `age_group_share` | Residents of London (the ONS London region) and the United Kingdom in five age groups, 0 to 14, 15 to 24, 25 to 44, 45 to 64, 65 and over, mid-2025, summed from the ONS five-year bands (Nomis NM_2002_1, the dataset behind `populations-age.json`); 65 and over is all ages less the groups to 64 | OGL v3 |
| `ons-ashe-residence-deciles-2025.json` | 18 | `pay_tenth` | The nine tenths of full-time gross annual pay (the 10th to the 90th percentile, the median as the 50th) for London and the UK, ASHE 2025 provisional, place of residence (table 8) via Nomis NM_30_1, each with the year over 12 as `value_month`; so a page draws deciles, not quartiles | OGL v3 |

## Codes

The four test cities carry the same `geo.code` in every file except the prime rents: London `E12000007` (Greater London), Los
Angeles `0644000` (the city), Rome `058091` (the comune), Budapest `HU110`. Countries are ISO2 (`GB`, `US`, `IT`, `HU`). Metro
areas: `31080` (LA-Long Beach-Anaheim MSA), `IT001F`, `HU001F`, `UK001F` (Eurostat functional urban areas). London boroughs and
English cities use their ONS codes.

## Reading the years

A `year` is the publisher's period: a calendar year (`2025`), a survey span (`2020-2024`, `2023-2024`, `2022/23-2024/25`), a month
(`2025-07`) or a quarter (`2025-Q3`). Several rows can share an item, a place and a year with different measures (visits and nights,
all guests and international): pick by `measure`, never by position.

## Rebuilding

The deciles file rebuilds with `python3 -I data/sourced/place/_scripts/uk5_ashe_residence_deciles.py data/raw/uk5-visitors/nomis/ashe-residence-deciles-2025.csv data/sourced/place/ons-ashe-residence-deciles-2025.json`. The three `uk5-` files (2026-10-20) rebuild from the repo alone: `python3 -I data/sourced/place/_scripts/uk5_visitors_month.py` reads the downloads kept under `data/raw/uk5-visitors/` (their URLs, dates and sha256 in its `SOURCES.md`). The borough rents (2026-10-21) rebuild with `python3 -I data/sourced/place/_scripts/uk5_voa_borough_rents.py data/raw/uk5-visitors/voa/NDR_Business_Floorspace_Tables_2026.xlsx data/sourced/place/uk5-voa-borough-rents-2026.json` (the workbook's sha256 in the file's `source`). The age groups (2026-10-21) rebuild with `python3 -I data/sourced/place/_scripts/uk5_population_age_bands.py data/raw/uk5-visitors/nomis/ages5-2025.csv data/sourced/place/uk5-population-age-bands-2025.json` (the download's URL and sha256 in the file's `source`).


The builder scripts and raw downloads of 2026-10-17 are on the build server under `/srv/atlas/runs/data-place/` (`scripts/b_*.py`,
`dl/`); every row's `source.url` is the file or API call it was read from. The job's report, with what was left out and why:
`/srv/atlas/wc/reports/data-place.md`.
