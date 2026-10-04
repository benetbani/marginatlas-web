# R5: the United Kingdom's country-level data, inventoried

Written 2026-10-04 for the UK page reform, read-only. Website repo `E:/atlas/website` on branch `uk-page-reform` (head `1eab1424`); data-pipeline repo `E:/atlas`. No project file was edited. Every number below was copied from the file named beside it or computed by one of the throwaway scripts in `E:/atlas/website/scratchpad/research-r5/`; the one exception is a handful of parent-repo values in section 2.10 and pitfalls 27 and 28 that a read-only sweep copied from the files named and that were not re-opened (each is marked as the sweep's reading, or not marked "re-read").

| Script | What it does | Output |
|---|---|---|
| `extract_render_text.mjs` | visible text of the harness render of /gb, by element id | `gb_render_oct1.txt` |
| `probe_gb_builders.ts` (tsx, harness tsconfig) | calls the pure builders the /gb body draws from, for GB | `gb_builders.json` |
| `dump_ts_tables.ts` (tsx) | dumps the inline TS tables (small-business regimes, sales tax, taxonomy, peer groups) | `ts_tables.json` |
| `dump_shard.mjs` | every fact of `data/facts/country/GB.json` as a line | `gb_shard.tsv` |
| `coverage_rank.mjs` | coverage, tags, fills, UK rank and percentile, peer values, for every UK field in every country-level file | `coverage_rank.txt`, `coverage_rank.json` |
| `seed_vs_shard.mjs` | which GB shard facts equal the illustrative GB seed value for value | `seed_vs_shard.txt` |

"Shown today" is the harness render `scratchpad/harness/pages/country-GB.html` (written 2026-10-01 19:32 by the chain's `pages-fresh` step) checked against the builders' own output; the only commits since (`26821cfb`, `1eab1424`) change the city cards' look, not a figure. The country route mounts the spine body for every country (`isSpineReformEnabledFor("country")` defaults on), and GB takes the "rich" composition in `src/components/spine/country/country-view.tsx` (the branch `if (rich)`), so the legacy body further down `src/app/[country]/page.tsx` never renders.

## 0. How each file marks its tier

| File (what the page reads it through) | Countries | Tier mark on a value | How the page reads it |
|---|---|---|---|
| `data/facts/country/<ISO2>.json` (country shard, `src/lib/facts/country_shard.ts`) | 198 files (195 in the taxonomy, plus ER, KP, SS) | per fact: `tag` held / modeled / placeholder; `c` is a fixed function of the tag (held 0.9, modeled 0.55, placeholder 0, official held 1.0); `methodId` "researched" or, on 16 GB facts, "official-2026-09-25"; `period` "latest" or a date. No "measured" tag exists. GB: 432 facts, 32 held, 373 modeled, 27 placeholder | held prints as measured, modeled as modelled, placeholder never prints (the store drops it) |
| `data/economic_indicators/country_profile_v2.json` (`getCountryProfile`) | 197 | per ROW only: `tier` A (50, "hand-anchored"), B (146), C (1, "regional-cluster + GDP-tier interpolation"). `quality_flags` is in the type but on 0 of 197 rows. Known fills: electricity 0.13 on 52 rows, minimum wage at 0.45 x median on 150 rows, quartiles at 0.65 and 1.55 x median on 195 rows, five-year inflation 0.1476 on 8 rows | tier A reads "measured", B and C "modeled" |
| `src/lib/tax/country_rates_2024.json` (`getCountryRates`) | 130 | none ("planning estimates", PwC 2024 cross-referenced) | measured |
| `src/lib/tax/smb_effective_rates.ts` (`getSmbRegime`, `getVatRow`) | 58 regimes, 70 sales-tax rows | none ("deliberately conservative" hand reads) | the regime rate is tagged modeled; the sales tax measured |
| `data/legal/business_formation_costs_v1.json` | 152 | none ("mandatory government and notary fees", "typical online filing turnaround") | measured |
| `data/cities/country_signature_v1.json` (`getCountrySignature`) | 196 | none ("anchored to 2024-2025 indices") | modeled (sample mark) |
| `data/sections/*.json` (nine files) | GB only | no tag; each block carries `source.publisher`, `url`, a `period` | printed as fact |
| `data/external/brain-skeleton/*.csv` (`src/lib/external/brain_data.ts`) | 162 to 217 | none (World Bank snapshot of 2026-05-25) | not printed on /gb |
| `data/economics/*.json` | 47 to 200 | `source_quality` A/B/C (pay), hand-curated (wealth, self-employment), `_meta.confidence` (deciles) | mostly not printed on /gb |
| `data/archetypes/locals_notes.json` | GB only | authored | placeholder |
| `data/london/london_market_v1.json` | London | `confidence: "modeled"` | printed untagged |

`data/facts/VERIFICATION.md` (2026-09-18) checked 146 "held" rows on trade shards: 53.4% could not be checked and the rest matched an outside source 57.4% of the time against an 80% bar, so "held" is the bank's word, not a verification.

## 1. Shown today

Every figure the /gb page prints, in page order. "Computed" means arithmetic in the builder or component on the figures beside it.

### Masthead (`#take`, `buildHeroBoard`)

| # | Figure as printed | Field and file | Tier |
|---|---|---|---|
| 1 | Total effective tax burden **20%** "on profit, for a small business under Self Assessment" (and the bar: 20 tax, 80 you keep) | `SMB_EFFECTIVE_RATES.GB.effective_rate` 0.2, `local_name` "Self Assessment", `src/lib/tax/smb_effective_rates.ts` | modeled (hand-set; 58 countries hold a regime) |
| 2 | The other taxes: Corporation tax **19% to 25%** | `tax_detail.groups.*.items.*.value` [corporation_tax], GB shard | modeled |
| 3 | VAT **20%** "once sales pass **$119K** a year" | same [vat] "20%"; `setup.vat_threshold_usd` 119385, GB shard | modeled |
| 4 | Dividend tax **10.75%** | same [dividend_tax] | modeled |
| 5 | Capital gains **18% to 24%** | same [capital_gains] | modeled |
| 6 | Clean dealing **71**/100, level "high" | `corruption_perception_index` 71, profile; level = thirds of 197 rows | tier A |
| 7 | Admin ease **84**/100, "high" | `ease_of_doing_business_index` 84, profile; 197 rows | tier A (but see pitfall 13) |
| 8 | Days to trade **21 days**, "medium" | `setup.total_days` 21, GB shard, printed only if not below the LLC filing days (1); level among the 112 countries the guard prints | modeled |
| 9 | Hiring staff **Easy** | `people_pay.hiring.hire_ease` "easy", GB shard | modeled |
| 10 | Average salary **$4,315**/mo, "high" | `median_wage_full_time_usd` 51785 / 12, profile; set of 195 | tier A |
| 11 | Register a company **$133**, "low" | `costs.license_setup_usd` 133, GB shard (guarded against the LLC fee 133); set of 140 | modeled |
| 12 | Placement readouts: "Higher than eight / nine / six / nine / one countries in ten" for rows 6, 7, 8, 10, 11 | computed, `src/lib/spine/placement.ts` | computed |

Row 2 to 5 sit behind the answer's plus. The shard's fifth tax row, business rates "5%", is dropped by the builder (`key === "business_rates"`).

### 01 What it costs to open, and to run

| # | Section | Figure | Field and file | Tier |
|---|---|---|---|---|
| 13 | Registering, by legal form | Sole Trader **$0**, **1 day**, paperwork 1 of 5 (dots) | `countries.GB[0]` (`setup_cost_usd`, `setup_days`, `complexity_score`), `data/legal/business_formation_costs_v1.json` | file untiered, page measured |
| 14 | same | LLC, Private Limited Company (Ltd): **$133**, **1 day**, 1 of 5 | `countries.GB[1]` | same |
| 15 | same | Joint-Stock, Public Limited Company (Plc): **$133**, **7 days**, 3 of 5 | `countries.GB[2]` | same |
| 16 | The bill to register | **$133** "limited company, all in: the other 3 steps are free" | `costs.license_setup_usd` 133, shard | modeled |
| 17 | same | Steps: Register the company, Online, **1 day**, **$133**; Register for tax, Online, **1 day**, **$0**; Open a business bank account, Online or in branch, **21 days**, **$0**; Register for VAT (if sales are high), Online, **7 days**, **$0** | `setup.steps.*.name/how/time_days/cost_usd`, shard | modeled |
| 18 | same (plus) | Licences by trade: Cafe or takeaway **28 days** (Food business registration); Bar or restaurant (alcohol) **6 to 10 weeks** (Premises licence); Childcare **3 to 4 months** (Ofsted registration); Taxi or private hire **4 to 8 weeks** (Council operator licence); Most retail and online **0 days** (No licence needed) | `licensing.list.*.trade/licence/lead_time`, shard (1 of 198 shards holds it) | modeled |
| 19 | What staff cost | Minimum salary **$33K**, "Higher than nine countries in ten" | `minimum_wage_annual_usd` 32877, profile | tier A |
| 20 | same | Average salary **$52K**, "Higher than nine countries in ten" | `median_wage_full_time_usd` 51785, profile | tier A (a median, see pitfall 6) |
| 21 | same | A full-time hire **$59K** a year; Salary; **$6,773** employer's share; "15% on pay above **$6,632** a year" | computed: (51785 - 6632) x 0.15 = 6773, 51785 + 6773 = 58558; `rates.GB.employer_social` 0.15 (`country_rates_2024.json`); `employment.employer_ni_threshold_usd` 6632 (shard) | rate untiered; threshold held (official, 2026-04) |
| 22 | Employing people | **28 days** paid holiday a year, bank holidays included | `employment.holiday_days` 28, shard | held (official, 2026) |
| 23 | same | Longest week **48 hours**, opt-out allowed | `employment.max_week_hours` 48 | held (official) |
| 24 | same | Sick pay **$163** a week, from day one | `employment.sick_pay_usd_week` 163 | held (official, 2026-04) |
| 25 | same | Unfair dismissal **2 years** of service before a claim | `employment.dismissal_qualifying_years` 2 | held (official) |
| 26 | same | Maternity pay **39 weeks** at the statutory rate | `employment.maternity_paid_weeks` 39 | held (official) |
| 27 | Running costs | **$0.32** per kWh of business electricity | `electricity_usd_per_kwh_commercial` 0.32, profile | tier A |
| 28 | same | world track: **$0.07** low, "Highest", "World median **$0.13**" | `worldRange("electricity_usd_per_kwh_commercial")` over 197 profile rows: min 0.073 (SA), median 0.13, max 0.32 (GB) | computed (see pitfall 2) |
| 29 | same | Diesel **$2.59**/L (no world track, by design) | `diesel_usd_per_liter` 2.59, profile | tier A |
| 30 | same | Cost of living **41**/100, "High"; "Median city **29**"; ends 1 and 100 | `cost_of_living_index` of the 7 UK cities in `data/cities/city_list_v1.json`, population-weighted 66.1 (New York 100), rescaled to the 252-city scale; level among 105 countries | modeled |
| 31 | Insurance | **$2,200** a year for the covers ticked | computed: sum of the four covers below (all ticked by default) | modeled |
| 32 | same | Property and contents **$700**/yr; Employers' liability, Required, "at least **$6.6M** of cover once you employ", **$600**/yr; Professional indemnity **$550**/yr; Public liability **$350**/yr | `insurance.covers.*.typical_usd/required`, shard; `insurance.employers_liability_min_cover_usd` 6632500, shard | covers modeled (seed values, pitfall 1); minimum cover held (official) |
| 33 | Against the peers | United Kingdom **20%**, **15%**, **$133**, **21 days**, **$52K**; Ireland 12.5%, 11.8%, $688, 12 days, $59K; France 22%, 42%, $321, 14 days, $42K; Germany 27%, 19.7%, $1,150, 21 days, $49K; Netherlands 19%, 19%, $2,064, 14 days, $50K (columns: Effective tax, Payroll on staff, LLC all in, Days to trade, Average salary) | `SMB_EFFECTIVE_RATES`; `country_rates_2024.json` employer_social; shard `costs.license_setup_usd` and `setup.total_days` (guarded); profile `median_wage_full_time_usd`; peers from `PEER_GROUPS.GB` = IE, FR, DE, NL | mixed, as in rows 1, 8, 11, 20, 21 |

### 02 Red tape, borrowing and getting paid

| # | Section | Figure | Field and file | Tier |
|---|---|---|---|---|
| 34 | Dealing with the state | five spectra drawn as dots (no number printed): Tax predictability, Clean dealing, Getting things done, Waiting time, Courts | `government.tax_predictability` 7, `low_bribery` 7, `task_efficiency` 7, `time_efficiency` 8, `judicial_impartiality` 8 (0 to 10), `country_signature_v1.json` | modeled |
| 35 | same | **14%** foreign-owned firms | `foreign_owned_pct` 14 | modeled |
| 36 | Legal and admin costs, "To run" | **$66** a year to file the company statement | `admin.confirmation_statement_usd` 66, shard | held (official, 2026-02) |
| 37 | same | Admin a year **55 hours**; Filings a year **9** | `admin_load.hours_per_year` 55, `admin_load.filings_per_year` 9, shard | modeled (seed values, pitfall 1) |
| 38 | same | Changing the name **$27** | `admin.name_change_usd` 27 | held (official) |
| 39 | same, "To close" | **$17** to close a company with no debts, online | `closing.strike_off_usd` 17 | held (official) |
| 40 | same | Closing with debts **6 to 12 months** via an insolvency practitioner; Owner's liability **Limited** unless personally guaranteed | `closing.time_months` "6 to 12", `closing.liability`, shard | modeled (seed values) |
| 41 | Borrowing | **6.61%** average rate on a new small-business loan | `financing.sme_loan_rate_pct` 6.61, shard (equal to profile `bank_lending_rate_pct` 0.0661) | held (official, 2026-07) |
| 42 | same | world track **1.3%** to **78%**, "World median **13.2%**" | `worldRange("bank_lending_rate_pct")` over 197 rows: min 0.013 (JP), median 0.1323, max 0.78 (AR) | computed |
| 43 | same | Central bank rate **3.75%** | `financing.base_rate_pct` 3.75 | held (official, 2026-09) |
| 44 | same | Start-up loans **$663 to $33K**, "7.5% fixed, 1 to 5 years" | `financing.startup_loan_min_usd` 663, `_max_usd` 33162, `_rate_pct` 7.5 (shard); the 1 to 5 years is a copy constant | held (official, 2026-04) |
| 45 | same | Innovate UK grants **$30K to $2M** for innovative projects | `grants.list.*.value` [innovate_uk_grants], shard | modeled (seed value) |
| 46 | same | A start-up loan **$661** a month, **$40K** repaid in all | computed by `LoanLever`: $33,000 (the max rounded down to 500) at 7.5% over 5 years | computed |
| 47 | Getting paid | **60%** pay by card; ring: Card 60%, Bank transfer 20%, Cash 12%, Digital wallet 8% | `payments.methods.*.pct`, shard | modeled (seed values, pitfall 1) |
| 48 | same | Card fees **1.5%** of each card sale; Card payouts **1 to 3 days** | `payments.card_fee_pct` 1.5, `payments.settlement_days`, shard | modeled (seed values) |
| 49 | same | Foreign owner's account **Yes**; Opening an account **Some paperwork** | `setup.banking.can_foreigner` "True", `setup.banking.friction` "medium", shard | modeled |

### 03 What to open, and where

| # | Section | Figure | Field and file | Tier |
|---|---|---|---|---|
| 50 | What London's trades keep | **10.5%** "of sales kept as profit by the middle trade"; Barbershops 22%, Accounting & tax 22%, Dental practices 18%, Marketing agencies 18%, Nail salons 14%, Veterinary care 14%, Dry cleaners 12%; behind the plus Auto repair 11%, Cleaning 10%, Hotels 10%, Food trucks 10%, Sports & fitness 9%, Cafes 8%, Bars & nightclubs 7%, Bakeries 7%, Grocery 3% | `activities.*.economics.net_margin_pct`, `data/london/london_market_v1.json` (16 of its entries); 10.5 is the median, computed | modeled (London, not national) |
| 51 | Time to sell | **6 to 12 months** "to sell a business, quicker than in **182 of 198** countries" | `risk_exit.exit.time_to_sell_months_low` 6 / `_high` 12, shard; 182 = shards whose high end exceeds 12 | held (GB is one of 2 held shards of 198) |
| 52 | same | Usual anywhere **9 to 18** months | medians of the 198 shards' low and high ends | computed |
| 53 | same | **Plenty of buyers** | `risk_exit.exit.climate` "active" | held |
| 54 | People by age | **33%** of people in the UK are 25 to 49; UK bars 18% (under 16), 11% (16 to 24: 10.7 in the file, marked `computed`, the published total less the published bands), 33%, 19% (50 to 64), 19% (65 and over); London 18%, 12%, 41%, 17%, 13% | `GB.age.bands` (mid-2024) and `GB.cities.london.age.bands` (mid-2025), `data/sections/people.json` | official (ONS, sourced) |
| 55 | The job market | **4.9%** out of work and looking; London **6.8%**; Under 25 **16.4%**; Hospitality **2.8** vacancies per 100 jobs; **3.3%** fewer staff on payroll a year on | `GB.rates` (May to July 2026), `GB.sector` (June to August 2026), `data/sections/job_market.json` | official (ONS, 15 Sep 2026) |
| 56 | The cities | 7 cards, typical customer pay a year: London **$62K**, Manchester **$48K**, Birmingham **$48K**, Leeds **$49K**, Glasgow, Bristol, Edinburgh on page two (builder values 61572, 48120, 47736, 48708, 50568, 52404, 57264) | `owner_col.median_salary_usd_mo` x 12, `data/facts/city/GB-<city>.json` (city level) | held per city shard |
| 57 | What locals know | four authored notes: "Registering is fast, payroll is not"; "The headline rent is not the rent" (rates and service charge can add a third); "Small premises often pay less"; "The first hire triggers a pension" | `GB`, `data/archetypes/locals_notes.json` | placeholder (authored) |
| 58 | What households spend on | **39%** of the food money goes on eating out; Eating out 7%, Groceries 11%, Housing and bills 18%, Getting around 14%, Leisure and holidays 11%, Furniture and appliances 7%, Everything else 32% | `income.household_spend.*.pct`, shard; 39 = 7 / (11 + 7), computed | modeled |
| 59 | Dealing with people | five spectra (dots): Openness, Innovation, Directness, Timekeeping, Straight dealing | `culture.openness_to_foreigners` 8, `innovation` 8, `communication_directness` 7, `punctuality` 7, `corruption_rejection` 8 (1 to 10), signature file | modeled |
| 60 | same | **14%** born abroad | `foreign_born_pct` 14, signature file | modeled |

### 04 The first years, and the close

| # | Section | Figure | Field and file | Tier |
|---|---|---|---|---|
| 61 | Who is still trading | **38%** of new firms still trading after 5 years; curve 95%, 75%, 56%, 45% (years 1 to 4; file 94.6, 74.7, 55.9, 45.0, 38.4) | `GB.curve` (2019 cohort), `data/sections/survival.json` | official (ONS Business demography 2024, Table 4.1) |
| 62 | same | "By region, year 5": **31%** West Midlands, **44%** South West; a region lever redraws the curve for each of 12 regions | `GB.regions`, `GB.regionCurves` (12 regions x 5 years) | official |
| 63 | What holds firms back | **61%** of small employers call tax a major obstacle; Energy prices 50%, Red tape 44%, Rivals 40%, Finding staff 37%, Late payment 26%, Premises 17%, Getting finance 16% | `GB.obstacles` (2024), survival.json | official (Longitudinal Small Business Survey 2024) |
| 64 | Where to next | "Start in London, the largest of **7** cities here" | count of covered UK cities | computed |

Counted against the files (the printed metrics matched against the shard by script): the page prints **106 of the 432 shard facts** (46 of them numbers; 88 modeled and 18 held, so 18 of the shard's 32 held facts; the official `employment.unemployment_pct` is not among them because the job market card prints the section file's 4.9), **7 of the profile's 39 numeric fields**, 3 tax-table values (the regime rate, its name, the employer rate), all 12 formation values, 12 of the 17 signature values, 91 section values (survival 75, including the 60 regional points behind the region lever; job market 6; age 10) and the 4 authored notes: about 235 country-level values. On top sit London's 16 margins and 7 city pay figures, which are city-level.

## 2. Held but not shown

Coverage is the number of countries holding a value that is not a placeholder. For shard metrics it is shards out of 198 (held count in brackets); for the profile, rows out of 197 (tier A in brackets), with fills named where detected. "GB only" means no other country holds the field, so no rank or percentile is possible. Script: `coverage_rank.mjs`.

### 2.1 Tax

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `tax_burden.total_pct` | GB shard | 30.5% | modeled | 198 (0 held) |
| `tax_burden.components.corporation_tax_pct` / `business_rates_pct_equiv` / `dividend_tax_pct` / `capital_gains_pct` | GB shard | 19 / 5 / 8 / 4 | modeled ("profit-equivalent annual weights", not statutory rates) | 198 (0 held) |
| `tax_burden.employer_oncost_pct`, `tax_burden.vat_rate_pct` | GB shard | 15%, 20% | modeled | 198 (0 held) |
| `tax_detail` [business_rates], [company_registration] | GB shard | "5%" (profit-equivalent estimate), "$133" | modeled | GB only |
| `setup.vat_threshold_local` | GB shard | 90000 (GBP) | modeled | 155 (42 held) |
| `vat_gst_standard_pct`, `vat_gst_reduced_pct` | profile | 0.20, 0.05 | tier A | 197 (50); reduced 177 non-null, 131 above zero |
| `corporate_income_tax_combined_pct`, `effective_corporate_tax_pct` | profile | 0.25, 0.21 | tier A | 197 (50) |
| `dividend_withholding_pct` | profile | 0 | tier A | 197 (50) |
| `personal_income_tax_marginal_50k_pct` | profile | 0.40 | tier A (looks wrong, pitfall 18) | 197 (50) |
| `property_tax_rate_pct` | profile | 0 | tier A (contradicted, pitfall 9) | 197 (50) |
| `employer_social_pct`, `payroll_tax_other_pct`, `health_insurance_employer_pct` | profile | 0.15, 0.015, 0 | tier A | 197 (50) |
| `rates.GB.cit` (and its note: "Main rate 25% (small profits rate 19% for profits under £50k)") | `src/lib/tax/country_rates_2024.json` | 0.25 | untiered | 130 |
| `VAT_RATES.GB.standard` | `smb_effective_rates.ts` | 0.2 | untiered | 70 |
| `rates.GB.commercial_property_tax_rate` ("Business rates UK multiplier 51.2p in £ ...") | `src/lib/finance/property_tax_2024.json` | 0.0512 | untiered (stale, pitfall 9) | 131 |
| `multipliers.GB.compliance` | `src/lib/finance/operating_cost_multipliers_2024.json` | 1.4 ("MTD + HMRC compliance heavy") | untiered | 130 |
| VAT threshold £90,000 (from 1 April 2024); small business rate relief at rateable value £12,000 (England, 2026-27); National Living Wage £12.71 an hour (from 1 April 2026); Employment Allowance £10,500 (from 6 April 2025); small profits rate 19% to £50,000, 25% above £250,000 (from 1 April 2023) | `data/sections/thresholds.json` | as listed, in GBP | official, each with a gov.uk URL | GB only (left off /gb on purpose: "the hero's VAT line and the hiring card's minimum salary on this page") |
| the composed government take (cit 25 + payroll 15) | computed in `adapt_country.ts` (`lenses` block, not drawn by the rich body) | 40% | derived | 130 |

### 2.2 Labour and pay

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `wage_p10_usd`, `wage_p90_usd` | profile | 33,412, 99,427 | modeled (decile ratios over the ASHE median) | 47 |
| `d1_over_d5`, `d9_over_d5` (2025) | `data/economics/wage_deciles_v1.json` | 0.6452, 1.92 | `_meta.confidence` modeled | 47 |
| `wage_p25_usd`, `wage_p75_usd` | profile | 38,816, 71,643 | fills (0.65 and 1.55 x median on 195 of 197) | do not use |
| `fully_loaded_labor_multiplier` | profile | 1.18 | tier A | 197 (50) |
| `labor_force_participation_pct` | profile | 63.5 | tier A | 197 (50) |
| `informal_economy_share_pct` | profile | 11 | tier A | 197 (50) |
| `informal_pct` (2020; also `dge_pct` 11.6896, `mimic_pct` 12.8276) | `brain-skeleton/informal_share.csv` | 12.2586 | untiered | 162 |
| `employment.unemployment_pct` | GB shard | 4.9 (2026-05/2026-07) | held (official) | GB only; the page prints the same 4.9 from `job_market.json` instead |
| `people_pay.pay_by_level_usd.junior / experienced / senior / specialist` | GB shard | 41,000 / 64,000 / 95,000 / 130,000 | modeled | 197 (0 held) |
| `people_pay.hiring.contract_ease`, `fire_ease`, `recruiting_depth` | GB shard | easy, moderate, deep | modeled | 197 (easy 43; moderate 104, hard 84, easy 9; deep 31) |
| `people_pay.talent_depth.*.score_1_5` | GB shard | finance 5, software_tech 5, professional_legal 5, creative_media 5, life_sciences 4, manufacturing_trades 3 | modeled (coined) | 197 |
| `people_pay.languages` | GB shard | English 91.1% (native), Welsh 1% (native) | modeled | 34 |
| `costs.labour_cost_index_usd` | GB shard | 65,416 | modeled (avg gross wage x 1.15, per the seed's `_meta`) | 194 (16 held) |
| `employment.hours`, `sick_pay`, `maternity` ("Up to 52 weeks leave, 39 weeks paid"), `notice` ("1 week per year worked, after a month"), `dismissal`, `union_pct` 22 | GB shard | as quoted | modeled (seed values except `sick_pay`) | GB only |
| `median_monthly_wage_usd` | `data/economics/median_monthly_wage_usd_v1.json` | 4,315 (quality A) | A | 200 (A 109, B 48, C 43) |
| `values_pct` (self-employment share) | `data/economics/self_employment_share_v1.json` | 14 | hand-curated | 123 |
| `payroll_per_employee_usd`, `revenue_multiplier` | `src/lib/cells/country_smb_baseline.json` | 46,000, 1.35 | untiered (disagrees with the 51,785 median) | 117 |

### 2.3 Costs

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `commercial_rent_t1/t2/t3_usd_per_sqm_year` | profile | 920 / 280 / 120 | tier A | 197 (50); left the page by ruling (rent goes to the city cards) |
| `costs.commercial_rent_usd_sqm_yr` | GB shard | 1,389 (London City prime office, per the seed's `_meta`) | modeled | 193 (16 held) |
| `costs.energy_usd_per_kwh` | GB shard | 0.32 | modeled | 197 (16 held) |
| `natural_gas_usd_per_therm` | profile | 1.10 | tier A | 197 (50) |
| `premises.lease_years_typical` "5 to 10", `deposit_months` 3, `break_clause` "Often at year 5", `rent_free_months` "2 to 3" | GB shard | as quoted | modeled (seed values) | GB only |
| `multipliers.GB.utilities`, `software` | `operating_cost_multipliers_2024.json` | 1.4, 1.1 | untiered | 130 |
| app fees by job: SumUp 1.69%, Square 1.75%, Zettle 1.75% (in person); FreeAgent £33, Coconut £12.99, Xero £18 a month; Fresha £14.95 a month, Treatwell 35% of a new client's first booking, Booksy £40; Tide free | `data/sections/local_apps.json` (read 2026-09-25) | as quoted | official price pages | GB only (trade pages only) |
| grocery market shares: Tesco 27.8, Sainsbury's 15.2, Asda 11.5, Aldi 10.6, Lidl 8.7, Morrisons 8.4 (12 weeks to 6 Sep 2026) | `data/sections/market_hold.json` | % | sourced (Worldpanel) | GB only (grocery trade pages) |

### 2.4 Finance and prices

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `inflation_5y_avg_pct` | profile | 0.038 | tier A (questioned, pitfall 19) | 197 (50; 8 rows at the 0.1476 fill) |
| `exchange_rate_volatility_pct` | profile | 0.06 | tier A | 197 (50) |
| CPI 1960 to 2024 (2010 = 100; 2024 = 147.4108) | `brain-skeleton/world_bank_cpi.csv`, rows keyed "UK" | 65 years | untiered | 173 countries hold 2024 (unreadable for GB, pitfall 8) |
| `usd_per_local_implied` 2024 | `brain-skeleton/world_bank_implied_fx.csv` | 1.2781 | untiered | 210 rows |
| `financing.ease_0_100`, `financing.sources` (4 names) | GB shard | 62; High-street bank loans, Start Up Loans, Angel and venture capital, Grants and innovation funds | modeled (seed values) | GB only |
| `grants.list` [r&d_tax_credits] "up to 27% of R&D spend"; [start_up_loans] "$663 to $33K"; [regional_growth_funds] "varies by area" | GB shard | as quoted | modeled | GB only |
| `values_usd_median_per_adult` (net wealth) | `data/economics/net_wealth_per_adult_usd_v1.json` | 151,000 | hand-curated | 124 |
| `income.median_income_usd`, `average_income_usd`, `top10_income_usd`, `top1_income_usd`, `gini`, `gini_band` | GB shard | 26,884, 32,275, 80,437, 137,358, 0.331, "moderate" | modeled (median is equivalised disposable household income in USD PPP, 2021; the rest lognormal derivations, pitfall 17) | 197 (3 held) |
| `gini` | profile | 35 | tier A | 197 |

### 2.5 Demographics and customers

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `population` 2024 | `brain-skeleton/world_bank_population.csv` | 69,226,000 | untiered | 197 (banned on the page as trivia) |
| `gdp_per_capita_usd` 2024 | `brain-skeleton/world_bank_gdp_per_capita.csv` | 53,246 | untiered | 193 |
| `gdp_per_capita_usd_nominal`, `_ppp`, `gdp_per_capita_growth_5y_pct`, `productivity_index` | profile | 49,500, 56,500, 0.012, 1.2 | tier A | 197 |
| `median_age`, `urbanization_pct` | profile | 41, 84 | tier A | 197 |
| `trips` (England 2025: walk 29%, car 58%, public 7% computed, other 6% computed) | `data/sections/people.json` | % | official | GB only |
| `online` (Great Britain, August 2026) | people.json | 28.8% of retail sales | official | GB only |
| `visits` (2024) | people.json | 42.6 million overseas visits; London 20.9 million overnight | official | GB only |
| weekly household spend by age of reference person (FYE 2023 to 2025 pooled): food £53.1 / 75.2 / 75.1 / 63.7 / 58.2 (under 30, 30 to 49, 50 to 64, 65 to 74, 75+); also clothing, recreation, restaurants and hotels; households 2.33M / 9.81M / 8.24M / 4.28M / 4.17M | `data/sections/spend_by_age.json` | GBP a week | official | GB only (trade pages) |
| weekly spend by income tenth (FYE 2025): hairdressing £1.9 to £11.0 (all 4.4), eating out £6.2 to £37.8 (all 17.8), groceries £41.7 to £104.2 (all 73.7) | `data/sections/spend_by_income.json` | GBP a week | official | GB only (trade pages) |
| `demand.consumer_spend_pool_usd_bn` 1,850; `businesses_total` 5,600,000; `businesses_per_1000_adults` 99; `consumer_segments` 44 / 26 / 18 / 12 | GB shard | as listed | modeled (seed values) | GB only |
| `sector_mix.sectors` services 80, production 13, construction 6, agriculture 1 | GB shard | % | modeled (seed values) | GB only |

### 2.6 Business environment and character

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `economic_profile.ease_of_business / talent_pool / access_to_financing / political_stability / economic_reward / affordability` | GB shard | 8 / 8 / 8 / 7 / 7 / 4 (1 to 10) | modeled (coined) | 198 |
| `character.gov_business.*.position_0_1` | GB shard | dealing 0.78, rules 0.78, enforcement 0.80, paperwork 0.68, tax_clarity 0.60, courts 0.82 | modeled | 198 |
| `character.culture_outsider.*.position_0_1` | GB shard | expression 0.60, directness 0.58, formality 0.42, pace 0.65, orientation 0.75, openness 0.70 | modeled | 198 |
| `character.locals_intel.*.title` | GB shard | "Price the hidden costs first.", "The bank account is the bottleneck.", "Two years changes the rules.", "London is not the only market." | modeled | GB only |
| `culture.ambition_chest_beating`, `government.innovation_capacity` | signature file | 7, 9 | modeled (the sixth trait of each table, cut by ruling) | 196 |
| `signature_sectors` labels | signature file | Insurance and reinsurance (Lloyd's of London); Creative industries (advertising, music, film); Pharmaceuticals and life sciences | modeled | 196 |
| `imports_pct_of_gdp`, `trade_openness_pct` | profile | 0.32, 0.62 | tier A | 197 |
| `exporting.openness_0_100` 72; partners United States 21, Germany 10, Netherlands 9, Ireland 7, France 6, China 6 | GB shard | % | modeled (seed values) | GB only |
| `infrastructure.internet_mbps` 90, `power_reliability_0_100` 95, `logistics_0_100` 80, `ecommerce_pct` 36 | GB shard | as listed | modeled (seed values) | GB only |
| `immigration.routes` Innovator Founder 70, Skilled Worker 45, Global Talent 60, Self-sponsorship 55 (difficulty 0 to 100) | GB shard | coined | modeled (seed values) | GB only |
| `admin_load.online_pct` | GB shard | 90 | modeled (seed value) | GB only |
| `closing.ease_0_100` 68, `cost_pct` 6, `solvent`, `insolvent` | GB shard | as listed | modeled (seed values; `solvent` corrected to "about $17") | GB only |
| `setup.structures` (sole trader, limited company, partnership: liability, tax, best for) | GB shard | words | modeled | 6 to 58 |
| admin-1 names England, Northern Ireland, Scotland, Wales | `data/coverage/admin1_regions_v1.json` | names only | none | 4 nations, no figures |

### 2.7 Trade-specific (country altitude)

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| engine net margin at national altitude: sports_fitness +21.0%, cafes_coffee +13.4% (flagged), grocery_stores -23.2%, auto_repair_shops -23.2%, hairdressers_beauty -28.5%, restaurants -44.0% | `data/archetypes/net_margin_snapshot.json` (taken 2026-09-04) | % | engine output | 188 to 195 per trade |
| `competition.trades.*.saturation_0_100` cafe 78, hair and beauty 64, convenience 72, online retail 58, cleaning 40, trades and repair 46 | GB shard | coined | modeled (seed values) | GB only |
| `trades_to_start.list` (hardship and cost to open, 6 trades) | GB shard | e.g. restaurant $120,000 | placeholder | GB only |
| `margin.kept_pct` 15, `margin.cost_stack` (labour 38, tax 16, premises and energy 13, other 18) | GB shard | % | placeholder | GB only |
| `country_industry_economics.json` | `src/lib/finance/` | no GB entry (60 countries, the UK not among them) | | |
| London trades beyond net margin (revenue, firms, survival yr1/yr3/yr5, chain share, churn) | `data/london/london_market_v1.json` | e.g. restaurants revenue 720,000, 13,000 firms, survival 89 / 54 / 38 | modeled | London (city level) |

### 2.8 Risk and exit

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `risk_exit.risks.*.score_1_10` | GB shard | energy_input_costs 9, rule_tax_changes 6, demand_cycle 6, currency_swings 5, skills_shortages 7 | held (coined index, DATA-REQUIREMENTS item 87) | 198 (2 held) |
| `risk_exit.exit.climate_score_0_100` | GB shard | 62 | held | 198 (2 held) |
| `risk_exit.exit.multiple_low` / `multiple_high` | GB shard | 2 / 3.5 (times yearly earnings) | held (withheld by ruling: a price is shown in currency, never a multiple) | 198 (2 held) |

### 2.9 Other

| Field | File | UK value | Tier | Coverage |
|---|---|---|---|---|
| `cities.list.*` for 8 cities: character, `market_index_vs_capital` (London 100, Glasgow 55, Leeds 55, Liverpool 55, Manchester 45, Birmingham 40, Edinburgh 38, Bristol 32), lat, lng | GB shard | as listed | modeled | GB only |
| `seasonality.months[0..11]` 55, 52, 58, 60, 62, 68, 70, 66, 72, 78, 92, 100 | GB shard | index, December 100 | modeled (seed values) | GB only |
| the adapter blocks the rich body never draws: `lenses`, `customers` (median plus p10/p90), `premises`, `ground`, `character.signature_sectors`, `honest_take` (authored GB verdict) | computed in `src/lib/spine/adapt_country.ts` | | as their sources | |
| `src/lib/spine-seeds/countries/GB.json` | illustrative seed of 2026-07-03, `_meta._note`: "Values carried from the UK design mockups. Most are placeholder/illustrative" | | sample | read by no live page; see pitfall 1 |

### 2.10 Held in the parent repo (E:/atlas), not carried by the website

From a read-only sweep of `E:/atlas` outside `website/` (secrets and `.env` files not opened). Values marked "re-read" were opened again for this file; the rest are the sweep's reading.

| What | Where | UK values | Tier | In the website? |
|---|---|---|---|---|
| Business births, deaths, stock and survival, from the business register | `E:/atlas/registers/uk/tables/survival_london_and_trades.json`, `by_borough.K02000001` (ONS Business Demography 2024, published 20 Nov 2025), re-read | 2024: births 317,440, deaths 280,370, active 2,859,535, birth rate 0.111, death rate 0.098; births by cohort 2019 363,825, 2020 333,020, 2021 363,995, 2022 336,925, 2023 316,025; survival 1y 0.934 (born 2023), 2y 0.689, 3y 0.535, 4y 0.44, 5y 0.384 (born 2019); period survival at 5 years 0.375277 (0.373673 to 0.376881); England rows alongside; 138 trades' UK-wide curves in `by_trade` | official (counted) | no: `export_for_site.py` writes to `E:/atlas/website/data/uk/registers`, which does not exist on this branch, and its survival slice leaves out the UK and England rows |
| Company insolvencies a year per trade | `company_failures_by_trade.json` (Gazette notices 2025-10-01 to 2026-09-30 matched to the Companies House snapshot of 2026-05-01), re-read | restaurants 28.9 insolvent per 1,000 live companies (43,634 live, 1,259 insolvent), the highest of 117 publishable trades; pubs 26.0; bars and nightclubs 25.7; dental practices 1.3, the lowest; no all-trades total | counted | not yet (the export's `failures.json`) |
| New companies a month per trade | `formations_by_month.json` (Companies House, data date 2026-05-01) | 24 months, 2024-05 to 2026-04, UK and London; restaurants UK from 384 to 786 a month; older months undercount (dissolved companies missing) | counted | no |
| Enterprises, local units, turnover per trade | `london_trades_by_borough.csv/.json` (ONS UK Business Counts, March 2026) | England row, no UK row: restaurants 28,360 enterprises, 33,455 local units, median turnover £252.1K | official | not yet (London and England only) |
| Rateable value per m2 by premises type | `london_premises_value_by_borough.json` (2023 rating list) | England: shops £165 over 393,850 premises; restaurants £195; cafes £151; offices £210; hair and beauty £127 | official | not yet |
| Upkeep: accounting fees, filings, payment terms | `E:/atlas/page-data/countries/GB.json` `upkeep`, and 13 GB rows in `page-data/derived/atlas_facts.csv`, re-read | accounting £1,800 ($2,381) a year, range $1,455 to $4,233; 4 VAT returns a year (held); **payment terms 30 days agreed, 38 actual** (modeled) | modeled; filing held | no: the website shard has no `upkeep` row, although `to_website.py` copies the CSV wholesale (10 other countries hold the block in the warehouse) |
| The warehouse's GB file | `page-data/countries/GB.json` (31 blocks, last reviewed 2026-08-30) | the source of the website shard; still holds registration £12, dividend 8%, capital gains 20%, start-up loans "fixed 6%", sick pay "About $145/week", energy 0.397 USD/kWh, and a `headline` block of mockup values (salary 44,000, net wealth 172,000, population 68,300,000) | seed and modeled | corrected on the website side only (2026-09-25) |
| Derived country tables | `page-data/derived/`: `rankings.json` (GB energy 189 of 197), `outliers.json` (GB rent 1,389 at z 11.1), `cost-indices.json`, `peer-averages.json`, `confidence.json` (GB mean 0.523 over 28 blocks) | as listed | derived | no |
| World Bank series | `E:/atlas/macro/global-aggregates/wb-*.json` (66 annual GBR rows each), re-read | new business density (new companies per 1,000 people aged 15 to 64) 18.62 in 2022 (10.91 in 2011, 18.19 in 2020); GDP per person PPP 62,009 (2024); labour force 35,470,266 (2025); services 72.45% and manufacturing 7.99% of GDP (2024) | official | no |
| IMF series | `macro/global-aggregates/imf-cpi-inflation.json`, `imf-ngdp-rpch.json` (1980 to 2031), re-read | CPI inflation 2019 1.8, 2020 0.9, 2021 2.6, 2022 9.1, 2023 7.3, 2024 2.5, 2025 3.4, 2026 3.2, 2027 2.4; real growth 2023 0.3, 2024 1.1, 2025 1.3, 2026 0.8 | official (the latest years are projections) | no |
| Eurostat regional business statistics | `macro/eurostat/` (`sbs_r_nuts06_r2`, 12 UK NUTS1 regions, 2008 to 2018; `bd_9bd_sz_cl_r2`: 2,939,520 active enterprises and 380,580 births in 2018) | the only split of the UK by region in either repo apart from survival; UK rows stop at 2018 or 2019 | official, stale | no |
| UK business population | `E:/atlas/design/loop/data/3D-SURVIVAL.md` (research note), re-read | 5,690,265 private-sector businesses at the start of 2025, 4.27M (75%) with no employees (Business Population Estimates 2025, tier "Measured"); 2024 deaths "lowest since 2016" | official (note) | no: the shard holds the seed's 5,600,000 |
| Dated and announced law changes | `design/loop/build/research/2026-09-25-uk-official-figures.md`; `2026-10-02-pro-sections-uk-law.md`, re-read | see section 3; announced: Budget on 28 Oct 2026; the Low Pay Commission's indicative April 2027 National Living Wage £13.02 to £13.34 (central £13.18, 3.7%); unfair dismissal qualifying period 6 months for dismissals from 1 Jan 2027, compensatory awards uncapped | official (notes) | no |
| Raw material | `extracted/uk/` (23,619 per-company files); `delivery/regional/gb_ons/nm141_lad_sic2_2024.csv` (local authorities, cut at exactly 25,000 rows); `macro/oecd-sdmx/MEI.csv` (monthly GBR to 2024-01) | not inventoried value by value | | no |

## 3. Time series and dates

Fields with history (several years) or a dated change:

| What | Where | Values | Read by the site? |
|---|---|---|---|
| Consumer prices 1960 to 2024 (2010 = 100) | `website/data/external/brain-skeleton/world_bank_cpi.csv`, keyed "UK" | 2019 119.6227, 2020 120.8064, 2021 123.8487, 2022 133.6601, 2023 142.7409, 2024 147.4108 (1960 6.2733). Computed: +47.41% 2010 to 2024, +23.23% 2019 to 2024, inflation 7.92% (2022), 6.79% (2023), 3.27% (2024) | no: `brain_data.ts` looks up "GB" and finds nothing |
| One cohort's survival, years 1 to 5 | `website/data/sections/survival.json` | 2019 births: 94.6, 74.7, 55.9, 45.0, 38.4%; the same for 12 regions | yes (first years card) |
| Seasonality by month | GB shard `seasonality.months[0..11]` | 55 to 100 | no (seed values) |
| Employer National Insurance change | `website/src/lib/tax/country_rates_2024.json` note | "15% on earnings above GBP 5,000 a year (from 6 April 2025; was 13.8% above GBP 9,100)" | the rate yes, the note no |
| Lines with an effective date | `website/data/sections/thresholds.json` | VAT £90,000 from 1 April 2024; National Living Wage £12.71 from 1 April 2026; Employment Allowance £10,500 from 6 April 2025; small profits rate from 1 April 2023; rate relief England 2026-27 | no (not seated on /gb) |
| Periods on the 16 official facts | GB shard `period` | holiday 2026; unemployment 2026-05/2026-07; sick pay 2026-04; base rate 2026-09; SME loan rate 2026-07; start-up loans 2026-04; Companies House fees 2026-02; NI threshold 2026-04 | the values yes, the periods no |
| Periods on the section files | `data/sections/*.json` | age mid-2024 (UK), mid-2025 (London); job market May to July 2026; online share August 2026; visits 2024; trips 2025; obstacles 2024; grocery shares 12 weeks to 6 Sep 2026; spending FYE 2023 to 2025 and FYE 2025 | partly |
| Dated changes in the research note behind the 2026-09-25 corrections | `E:/atlas/design/loop/build/research/2026-09-25-uk-official-figures.md` (a document, not a data file) | Companies House fees from 1 Feb 2026 ("was £50, £34, £20, £33"); employer NI 15% above £5,000 from 6 Apr 2025 (was 13.8% above £9,100; Employment Allowance £5,000 to £10,500); National Living Wage £12.71 from 1 Apr 2026 (£12.21 from 1 Apr 2025); dividend basic rate 10.75% from 6 Apr 2026 (was 8.75%); capital gains 18% and 24% from 30 Oct 2024, Business Asset Disposal Relief 18% from 6 Apr 2026; Statutory Sick Pay £123.25 from 6 Apr 2026 (was £118.75 from the fourth day); unfair dismissal qualifying period 2 years, **6 months where employment ends on or after 1 Jan 2027**; Bank Rate 3.75% since 18 Dec 2025, held 17 Sep 2026; Start Up Loans 7.5% from 6 Apr 2026 (was 6%, firms under 36 months); Class 4 NI 6% from 6 Apr 2024; business rates multipliers 43.2p and 48.0p from 1 Apr 2026 | only the current values reached the data files |
| Previous stored values (git history of the profile) | `git show 3acaf667` | median full-time pay 38,400 to 51,785; minimum wage 25,000 to 32,877; employer social 0.138 to 0.15; electricity 0.27 to 0.32; diesel 1.85 to 2.59; lending 0.065 to 0.0661 (all 2026-09-25) | corrections, not a series |

No other UK field in the website repo carries more than one year. GDP per capita, population and the implied exchange rate hold 2024 only; the informal share 2020 only.

In the parent repo (section 2.10), series the website does not carry:

| What | Where | Span |
|---|---|---|
| Business births by cohort, and 2024 births, deaths, stock | `registers/uk/tables/survival_london_and_trades.json` | 2019 to 2024 births: 363,825; 333,020; 363,995; 336,925; 316,025; 317,440 (down 12.8% from 2019 to 2024) |
| New companies a month per trade | `registers/uk/tables/formations_by_month.json` | 24 months, 2024-05 to 2026-04 |
| New business density, GDP per person PPP, labour force, services and manufacturing shares | `macro/global-aggregates/wb-*.json` | 1960 to 2025, one row a year (density 2011 10.91 to 2022 18.62) |
| CPI inflation and real growth | `macro/global-aggregates/imf-*.json` | 1980 to 2031 (projections at the end) |
| Regional business statistics | `macro/eurostat/sbs_r_nuts06_r2` | 2008 to 2018, 12 regions |
| Monthly economic indicators | `macro/oecd-sdmx/MEI.csv` | 1948 to 2024-01 |

## 4. Standouts

Method: for each field held by about 100 countries or more, the UK's rank counts the countries holding a strictly higher value (highest first) and strictly lower value (lowest first), ties not lifting either; the percentile is the share strictly below (the site's own placement arithmetic). Peers are Ireland, France, Germany and the Netherlands (`PEER_GROUPS.GB`). "Top tenth" means fewer than a tenth of the set sits above the UK. All figures from `coverage_rank.txt`. Facts already on the page are marked SHOWN.

### 4.1 The list

1. **A public limited company registers for $133 in 7 days: the cheapest and the fastest of the 121 countries** whose formation file holds a joint-stock row (next cheapest Vietnam $250; next fastest the US and Rwanda at 14 days; median $1,500 and 45 days; Germany $12,000 and 60 days). `countries.GB[tier=Joint-Stock].setup_cost_usd / setup_days`, formation file (fees only, share capital excluded by the file's own definition). SHOWN as a table row, not as a rank.
2. **A limited company in 1 day, tied fastest of 152** (with Chile, Estonia, Georgia, New Zealand, Rwanda); paperwork 1 of 5, shared with only Georgia, New Zealand and Rwanda; peers 7 to 14 days. Its $133 fee is the 29th cheapest of 152 (median $250; Ireland $60, France $250, Germany $400, Netherlands $800). `countries.GB[tier=LLC].*`. SHOWN (no rank).
3. **A sole trader registers free, in 1 day**: one of 20 free and one of 25 one-day countries of 144; peers $50 to $90 and 1 to 7 days. `countries.GB[tier=Sole Trader].*`. SHOWN.
4. **The bill to register is the lowest of the five peers**: $133 against Ireland $688, France $321, Germany $1,150, Netherlands $2,064; 19th lowest of the 140 countries whose bill prints. Shard `costs.license_setup_usd`, modeled. SHOWN.
5. **The minimum wage, $32,877 a year, is 5th highest of 197 and 2nd of the 47 countries whose figure is not the 0.45 x median fill** (only Australia, $41,500, is higher; Canada $32,000, New Zealand $28,000 below); highest of the peers (Netherlands 27,000, Ireland and Germany 26,500, France 23,500). Profile `minimum_wage_annual_usd`, tier A. SHOWN as "Higher than nine countries in ten".
6. **Full-time median pay, $51,785, is 16th of 197** (91.9th percentile; 11th of the 50 tier A rows); second of the five peers behind Ireland ($58,800). Profile `median_wage_full_time_usd`. SHOWN.
7. **Business electricity $0.32 a kWh: the highest of all 197 profile rows and of the 145 rows that are not the 0.13 fill; highest of the peers** (Ireland 0.28, Germany 0.22, Netherlands 0.21, France 0.19). Profile `electricity_usd_per_kwh_commercial`. SHOWN ("Highest"). Read with pitfall 2: in the shard's own `costs.energy_usd_per_kwh` the UK's 0.32 is 21st of 197 (Solomon Islands 0.7145, Hungary 0.398, Luxembourg 0.326 among those above), still the highest of the peers there (Ireland 0.30, Germany 0.27, Netherlands 0.179, France 0.171).
8. **A business sells in 6 to 12 months; 182 of 198 countries can take longer**; 11 others tie at 12 and only 4 are quicker (the US 8, the Emirates 10, Monaco and New Zealand 11); the usual band anywhere is 9 to 18. Shard `risk_exit.exit.time_to_sell_months_high` (held on GB, modeled on 196). SHOWN. The low end, 6 months, sits in the bottom tenth too (5 countries lower).
9. **The buyers' market is "active", one of 22 of 198** (with Ireland and the Netherlands among the peers; France and Germany "steady"); climate score 62, 17th of 198. `risk_exit.exit.climate`, `climate_score_0_100`. SHOWN as "Plenty of buyers"; the score is not.
10. **Admin ease 84/100 is tied 5th of 197** (behind New Zealand 87, Singapore 86, Denmark and Hong Kong 85; tied with the US and South Korea) and the highest of the peers (Ireland and Germany 79, France and the Netherlands 76). Profile `ease_of_doing_business_index`. SHOWN. A 2020 reading (pitfall 13).
11. **Prime commercial rent, $920 a square metre a year, is 5th of 197 (tied with the US and Switzerland) and 2nd of the 50 tier A rows, behind Hong Kong ($1,850)**; highest of the peers (France 880, Ireland and Netherlands 580, Germany 480). Mid-tier $280 is 11th, edge $120 12th. Profile `commercial_rent_t1/t2/t3_usd_per_sqm_year`. Not shown.
12. **The VAT registration threshold, $119,385 (£90,000), is 2.4 to 5.2 times the peers'** (Ireland $48,740, France $43,006, Germany $28,670, Netherlands $22,936); 25th highest of the 155 countries holding one. Shard `setup.vat_threshold_usd`. SHOWN only as the note beside VAT behind the plus.
13. **Hiring is rated "easy", one of 25 of 197** (Ireland too; France, Germany, Netherlands "moderate"); dismissal "moderate" where France, Germany and the Netherlands are "hard" (104 moderate, 84 hard, 9 easy). `people_pay.hiring.hire_ease`, `fire_ease`, modeled. Hire ease SHOWN.
14. **No employer health insurance and no dividend withholding tax**: the UK holds 0 on both, the lowest values (19 countries at 0 for health, 7 for dividends); peers' employer health 13% (France), 7.3% (Germany), 6.9% (Netherlands), 0 (Ireland). Profile `health_insurance_employer_pct`, `dividend_withholding_pct`. Not shown.
15. **Employer payroll 15% is the second lowest of the five** (Ireland 11.75% in the tax table, printed 11.8%; Netherlands 19%, Germany 19.7%, France 42%) and mid-world (58th highest of 130). `rates.*.employer_social`. SHOWN.
16. **Borrowing costs the most of the peers**: 6.61% on a new small-business loan against Ireland 4.3%, France 4.5%, Germany 4.5%, Netherlands 4.3%; but 44th lowest of 197 (world median 13.2%). Profile `bank_lending_rate_pct` (UK July 2026, peers older). SHOWN (world track).
17. **Prices rose 47.4% from 2010 to 2024, the most of the peers** (Netherlands 42.3%, Germany 34.9%, Ireland 27.2%, France 26.5%); 2019 to 2024 +23.2%, also the most (Netherlands 22.75%); inflation in 2023 6.79%, highest of the peers. World: 99th of 173 by 2010 to 2024 (median 55.7%), so middling worldwide. `world_bank_cpi.csv` rows keyed "UK". Not shown (unreadable today).
18. **Household budgets: groceries take 11%, 6th lowest of 197** (Singapore 7.3, US 8.1, Ireland 8.6, Luxembourg 9.6, Liechtenstein 10); **leisure and holidays 11%, 5th highest of 197** (Australia 13; Israel and Sweden 11.5; Austria 11.4); getting around 14% is the highest of the peers and housing and bills 18% the lowest (Ireland 26.3, France 26.2, Germany 37.5, Netherlands 28). `income.household_spend.*.pct`, modeled (from the national family spending survey per the seed's `_meta`). SHOWN as shares, never ranked.
19. **Median net wealth per adult, $151,000, is 10th of 124 and highest of the peers** (France 133,000, Ireland 130,000, Netherlands 113,000, Germany 69,000). `data/economics/net_wealth_per_adult_usd_v1.json`, hand-curated. Not shown.
20. **Openness to newcomers 8 of 10, tied 4th of 196** (Canada, New Zealand and Sweden at 9; 15 at 8, Ireland and the Netherlands among them); **innovation capacity 9 of 10, tied 3rd of 196** (Switzerland and Sweden at 10; Germany, Denmark, Finland, South Korea, the Netherlands, Singapore and the US at 9 with the UK); **self-promotion 7 of 10, tied 3rd** (the US 10, Israel 8, then 9 countries at 7; the highest of the peers, all 5 or 6). Signature file, modeled. Openness SHOWN as a dot; the other two are the cut sixth traits.
21. **Creative and media talent 5 of 5: one of two countries (with the US) of 197**; finance, software and legal talent also 5 (tied with 9, 14 and 5 others). `people_pay.talent_depth.*.score_1_5`, modeled, coined. Not shown.
22. **Energy costs scored 9 of 10 as a risk, tied 3rd of 198** (Ukraine and Venezuela 10; 15 countries at 9) and the highest of the peers (Ireland 8, Germany 8, Netherlands 7, France 4). `risk_exit.risks.*.score_1_10` [energy_input_costs], tagged held but a coined index (item 87). Not shown.
23. **The informal economy, 11%, is in the bottom tenth of 197** (20th lowest) yet the highest of the peers (all 8 to 9). Profile `informal_economy_share_pct`. Not shown. The other file disagrees on the peer order (pitfall 16).
24. **Personal income tax at 50k is 40%, 4th of 197**, with Ireland (40%); behind Belgium 45, Austria and Denmark 42. Profile `personal_income_tax_marginal_50k_pct`. Not shown, and probably wrong (pitfall 18).
25. **Natural gas $1.10 a therm, 14th of 197.** Profile `natural_gas_usd_per_therm`. Not shown.
26. **The cost of living (7 cities, population-weighted, New York 100) is 66.1, 21st of 105 countries, and the lowest of the peers** (Ireland 80.0, Netherlands 71.3, Germany 69.1, France 68.1). `getCountryCostOfLivingIndex` over `city_list_v1.json`, modeled. SHOWN as 41 on the city scale and "High"; the peer comparison is not.
27. **Days to trade, 21, ties Germany for the slowest of the peers** (Ireland 12, France and the Netherlands 14); 28th of the 112 countries whose days print. Shard `setup.total_days`, modeled. SHOWN. The 21 is the bank account (pitfall 14): of the 46 shards holding a bank-account step, only Malta (30 days) is slower than the UK's 21 (Panama also 21).
28. **The small-business tax rate, 20%, is the middle of the peers** (Ireland 12.5, Netherlands 19 below; France 22, Germany 27 above); 15th highest of only 58 regimes. SHOWN.
29. **Survival splits hard by region: 43.5% of the South West's 2019 births trade at year 5, 30.6% of the West Midlands'.** The West Midlands has the best first year of the 12 regions (95.3%) and the worst every year after (70.4% at year 2); Northern Ireland has the worst first year (88.1%) and the second best fifth year (42.8%). The UK loses most in year 2 (19.9 points, 94.6 to 74.7). `survival.json` `regionCurves`, official. Partly SHOWN (38%, the year-5 best and worst); the crossings are not.
30. **Under-25 unemployment, 16.4%, is 3.3 times the all-age 4.9%; London's 6.8% is above the UK's.** `job_market.json`, official. SHOWN.
31. **Tax is the obstacle small employers name most (61%), ahead of energy prices (50%).** `survival.json` obstacles, official. SHOWN.
32. **London is younger: 40.8% aged 25 to 49 against the UK's 33.0%; 12.6% aged 65 and over against 19.1%.** `people.json`, official. SHOWN.
33. **Gini 0.331 (shard) or 35 (profile): the most unequal of the five peers** (Ireland 0.264, Netherlands 0.29, France 0.297, Germany 0.309); mid-world (126th highest of 197). Not shown.
34. **Population 69.2 million, 21st of 197; GDP growth 1.2% a year over five years, 168th of 197.** Not top or bottom tenth; listed because they are often asked. Banned as trivia on the page.

From the parent repo (not on the website at all; ranks computed over the countries in the profile, by the same arithmetic):

35. **New companies per 1,000 people aged 15 to 64: 18.62 in 2022, 5th of 106 countries** (Estonia 24.32, Hong Kong 21.00, Liechtenstein 19.41, Luxembourg 18.90 ahead); tied 3rd of 143 in 2020 (18.19, with Luxembourg). Peers: Ireland 6.40, Netherlands 3.43, Germany 1.40 (2022), France 6.71 (its latest year): the UK registers companies at nearly three times Ireland's rate and thirteen times Germany's. `E:/atlas/macro/global-aggregates/wb-business-density.json`, GBR 2022, official.
36. **More businesses are born than die: 317,440 births against 280,370 deaths in 2024** (birth rate 11.1%, death rate 9.8%, on 2,859,535 active), although births are down 12.8% on 2019's 363,825. `registers/uk/tables/survival_london_and_trades.json`, official.
37. **Restaurants fail fastest: 28.9 insolvencies a year per 1,000 live companies, the highest of 117 trades** (pubs 26.0, bars and nightclubs 25.7); dental practices the lowest at 1.3. `registers/uk/tables/company_failures_by_trade.json`, counted.
38. **Manufacturing is 7.99% of GDP, the lowest of the peers** (France 9.57, Netherlands 10.07, Germany 18.01, Ireland 29.56); services 72.45%, 15th of 171. `wb-mfg-share-gdp.json`, `wb-services-share-gdp.json` (2024), official.

### 4.2 Where the UK is middling (so nobody overclaims)

Corporation tax main rate 25% (100th of 197 in the profile, median 25.01%); employer social 15% (91st of 197); sales tax 20% (44th of 197); clean dealing 71 (21st of 197, but the lowest of the peers with Ireland and France at 71, Germany 75, Netherlands 78); foreign-born 14% (40th of 196); median age 41 (50th of 197); labour force participation 63.5% (51st of 197); five-year inflation 3.8% (138th of 197 highest-first, the highest of the peers); shard `tax_burden.total_pct` 30.5% (115th of 198, the lowest of the peers).

## 5. Country details a business reader would want

| Detail | Held value | File | Tier | On /gb? |
|---|---|---|---|---|
| VAT rate and threshold | 20%; £90,000 ($119,385) of taxable turnover in 12 months, from 1 Apr 2024 | shard `tax_detail` [vat], `setup.vat_threshold_*`; `thresholds.json` | modeled; official | yes (behind the plus) |
| Reduced VAT rate | 5% | profile `vat_gst_reduced_pct` | tier A | no |
| Corporation tax | 19% to £50,000 of profit, 25% above £250,000 (marginal relief between), from 1 Apr 2023 | shard `tax_detail` [corporation_tax]; `thresholds.json` [small-profits]; `country_rates_2024.json` note | modeled; official | the range yes, the thresholds no |
| Small-business effective rate | 20%, "Self Assessment" | `smb_effective_rates.ts` | modeled | yes |
| Dividend tax, capital gains | 10.75%; 18% to 24% | shard `tax_detail` | modeled | yes (plus) |
| Employer National Insurance | 15% above £5,000 ($6,632) a year per employee | `country_rates_2024.json`; shard `employment.employer_ni_threshold_usd` | untiered; held | yes |
| Employment Allowance | £10,500 a year, from 6 Apr 2025 | `thresholds.json` | official | no |
| Minimum wage per hour | £12.71 (21 and over), from 1 Apr 2026; $32,877 a year in the profile | `thresholds.json` [wage]; profile | official; tier A | the yearly figure only |
| Typical pay | full-time median $51,785 (ASHE 2025, £39,039); tenths $33,412 and $99,427 | profile | tier A; deciles modeled | median yes (as "Average"), tenths no |
| Paid holiday | 28 days, bank holidays may count | shard `employment.holiday_days` | held | yes |
| Public holidays | NOT HELD (no count of bank holidays by nation anywhere in either repo's website data) | | | |
| Sick pay, maternity, dismissal, longest week | $163 a week from day one; 39 weeks paid; 2 years (6 months from 1 Jan 2027 per the research note); 48 hours with opt-out | shard `employment.*` | held | yes |
| Notice periods | "1 week per year worked, after a month" | shard `employment.notice` | modeled (seed) | no |
| Pension auto-enrolment rates | NOT HELD as a figure (only the authored note "The first hire triggers a pension") | `locals_notes.json` | placeholder | the note only |
| Payment terms, late-payment interest | not in the website repo (only "late payment" named by 26% of small employers as an obstacle); the warehouse holds 30 days agreed, 38 actual (modeled); statutory late-payment interest held nowhere | `survival.json` obstacles; `page-data/countries/GB.json` `upkeep.payment_terms` | official; modeled | the 26% only |
| Accounting fees | £1,800 ($2,381) a year, range $1,455 to $4,233 | `page-data/countries/GB.json` `upkeep.accounting` | modeled | no |
| Interest rates | Bank Rate 3.75% (since 18 Dec 2025); new SME loans 6.61% (July 2026); Start Up Loans £500 to £25,000 at 7.5% fixed | shard `financing.*` | held | yes |
| Rents | prime $920, mid $280, edge $120 a m² a year (national tiers); $1,389 (London City prime office) | profile; shard | tier A; modeled | no (city cards carry rent) |
| Business rates | small business rate relief at RV £12,000 (England 2026-27); multipliers NOT HELD in a data file (only in the research note: 43.2p and 48.0p for 2026-27) | `thresholds.json` | official | no |
| Electricity, diesel | $0.32 a kWh (all sizes, incl. Climate Change Levy, Q1 2026); $2.59 a litre (week of 21 Sep 2026) | profile | tier A | yes |
| Registration | sole trader free, 1 day; Ltd $133 (£100), 1 day; Plc $133, 7 days; bank account 21 days (modeled) | formation file; shard `setup.steps` | untiered; modeled | yes |
| Company running costs | confirmation statement $66 (£50); name change $27 (£20); strike-off $17 (£13) | shard `admin.*`, `closing.strike_off_usd` | held | yes |
| Licences | food business registration 28 days; premises licence 6 to 10 weeks; Ofsted 3 to 4 months; taxi 4 to 8 weeks; most retail none | shard `licensing.list` | modeled | yes (plus) |
| Insurance | employers' liability compulsory, at least £5M ($6.6M) of cover; typical premiums $350 to $700 a cover (seed) | shard `insurance.*` | held; modeled (seed) | yes |
| Business counts | website: 5,600,000 businesses, 99 per 1,000 adults (seed values); parent repo: 5,690,265 private-sector businesses at the start of 2025, 75% with no employees (research note); 2,859,535 active registered businesses, 317,440 births and 280,370 deaths in 2024 (register table); 18.62 new companies per 1,000 aged 15 to 64 (2022) | shard `demand.*`; `design/loop/data/3D-SURVIVAL.md`; `registers/uk/tables/survival_london_and_trades.json`; `macro/global-aggregates/wb-business-density.json` | seed; official | no |
| Survival | 38.4% at five years (2019 births); 12 regions 30.6% to 43.5% | `survival.json` | official | yes |
| Unemployment | 4.9% (May to July 2026); London 6.8%; under 25 16.4% | `job_market.json` | official | yes |
| Regional splits | survival by 12 regions; age and unemployment for London; 7 cities' pay; nothing else by nation or region at country level in the website repo | | | partly |
| Customers | online 28.8% of retail sales (Aug 2026); trips 58% by car, 29% walked (England 2025); 42.6M overseas visits (2024); spending by age and by income tenth | `people.json`, `spend_by_*.json` | official | no (age only) |
| Grocery concentration | Tesco 27.8%, Sainsbury's 15.2%, Asda 11.5%, Aldi 10.6%, Lidl 8.7%, Morrisons 8.4% | `market_hold.json` | sourced | no (trade pages) |
| Apps and their fees | card readers 1.69% to 1.75%; accounts £12.99 to £33 a month; booking platforms | `local_apps.json` | official price pages | no (trade pages) |
| Visas for founders and hires | Innovator Founder, Skilled Worker, Global Talent, Self-sponsorship (difficulty scores coined) | shard `immigration.routes` | modeled (seed) | no |

Not held in the website repo for the UK (parent-repo status in brackets): public holiday counts (nowhere); payment terms (warehouse, modeled) and statutory late-payment interest (nowhere); pension contribution rates (nowhere); apprenticeship levy (nowhere); Making Tax Digital dates (nowhere as data); minimum wage bands below 21 (the law note only); business rates multipliers by nation (the law notes only); business counts by size band or sector (register tables by trade, England and London); business births and deaths (register table, UK); regional GDP, pay or rent by region (Eurostat regions to 2018 only); a prior period for most figures, so no year-on-year change can be printed except prices and survival (World Bank and IMF series, register births).

## 6. Pitfalls found

1. **Seed values printed as "modeled".** 16 blocks of the GB shard (financing, grants, licensing, immigration, payments, insurance, premises, sector_mix, exporting, infrastructure, demand, seasonality, admin_load, competition, employment, closing) equal, value for value, the blocks of `src/lib/spine-seeds/countries/GB.json` whose own `_meta` reads "Illustrative seed for layout; to be researched and replaced", `method: "placeholder"`; in the shard they are tagged modeled, `methodId` "researched", `c` 0.55 (script `seed_vs_shard.mjs`; the only values that differ from the seed are the 2026-09-25 corrections: the start-up loans range, the cafe licence row, the sick-pay sentence and the strike-off sentence; the 16 official facts are additions, not edits). On /gb this prints: the payment mix 60/20/12/8, the 1.5% card fee and "1 to 3 days" (Getting paid), the four insurance premiums and their $2,200 sum, 55 admin hours and 9 filings, "6 to 12 months" to close with debts, and Innovate UK's "$30K to $2M". DATA-REQUIREMENTS item 72 says these blocks carry the illustrative-seed source in `page-data/countries/GB.json` and should stand as blocked seats until researched. Two cross-checks against official files: the 1.5% card fee is below every UK in-person rate in `local_apps.json` (SumUp 1.69%, Square and Zettle 1.75%); the seed's e-commerce share 36% disagrees with the ONS online share 28.8% in `people.json`.
2. **The electricity "world median $0.13" is the fill.** 52 of 197 profile rows hold exactly 0.13 (`GLOBAL_ELECTRICITY_REFERENCE`), so `worldRange` returns the fill as the median; `running_costs_rows.ts` withholds the fill for the figure but `world_stats.ts` does not drop it from the range. The UK's "Highest" compares a Q1 2026 official figure (24.14p at $1.3265) with 2024-reference interpolations; the shard's independent `costs.energy_usd_per_kwh` ranks the UK 21st of 197, and the two files disagree for Ireland (0.28 vs 0.30) and Germany (0.22 vs 0.27).
3. **Diesel's rank is an artefact.** 2.59 is the week of 21 Sep 2026; 11 rows hold exactly 1.85 (including Ireland, France and Germany), the look of a default. The page draws no track (correctly); any "dearest diesel in the world" claim from the profile would be false by construction.
4. **The minimum wage's world placement includes 150 fills.** On 150 of 197 rows the minimum divided by the median is 0.45 to within 0.005; `pay_rows.ts` ranks the UK among all 195 on purpose. Among the 47 non-fill rows the UK is 2nd; Ireland's 26,500 is itself fill-shaped.
5. **Quartiles are fixed multiples** (0.65 and 1.55 x median) on 195 of 197 rows; nothing should rank on them.
6. **"Average salary" is a median.** `median_wage_full_time_usd` 51,785 is ASHE 2025's full-time median (£39,039); the research note gives the mean as £48,512. The hero's $4,315 a month is the same median over 12.
7. **Mixed vintages.** The profile's convention is "USD (2024 reference year)", but the UK's pay, minimum wage, electricity, diesel and lending rate were rewritten on 2026-09-25 to 2025 and 2026 figures at $1.3265 per pound; the peers and the world were not. Every UK-against-world rank on those five fields compares different years (Ireland, France, Germany, Netherlands pay in the peers table are the older values).
8. **The UK's price index is filed under "UK".** `world_bank_cpi.csv` keys the UK's 65 years as "UK"; `brain_data.ts` has no alias, so `getCountryEconomicsSnapshot("GB").inflationPctYoy` returns null. (`regional_coverage_v1.json` lists both "GB" and "UK".)
9. **Business rates are stated three ways.** Profile `property_tax_rate_pct` 0 (the UK the lowest of 197, one of 8 zeros); `property_tax_2024.json` 0.0512 with "One of highest commercial property tax burdens globally" (3rd of 131); shard `tax_detail` [business_rates] "5%" and `business_rates_pct_equiv` 5 (a profit-equivalent). The 51.2p in `property_tax_2024.json` matches neither the 2024/25 multipliers in DATA-REQUIREMENTS item 93 (49.9p, 54.6p) nor the 2026-27 ones in the research note (43.2p, 48.0p).
10. **Two UK rents.** Shard `costs.commercial_rent_usd_sqm_yr` 1,389 is a London City prime office rent (the seed's `_meta`: "London City prime office ~GBP 100/sqft/yr ... London is the representative commercial city") sitting in a national field; profile prime is 920.
11. **Three "total tax" figures, one of them failing its own identity.** Shard `tax_burden.total_pct` 30.5 against its seed identity "total_pct = sum(components) = 19 + 5 + 8 + 4 = 36"; the hero's 20% (small-business regime); the adapter's composed 40% (25 + 15, built but not drawn). The shard's dividend 8 and capital gains 4 are on a basic-rate basis where most countries hold top rates (item 88), and disagree with the shard's own statutory 10.75% and 18% to 24%.
12. **The 20% "Self Assessment" rate is hand-set** and its note mixes the sole-trader regime (£1K trading allowance, income tax) with corporation-tax rates (19% to 25%); 58 countries hold a regime, so it cannot be ranked honestly. `adapt_country.ts`'s header still says "128 of 195".
13. **"Admin ease 84" looks like a 2020 reading of a discontinued index**, printed with a measured tag: the GB seed's `economic_profile._meta.source` cites "World Bank Doing Business 2020 EoDB score 83.5 (rank 8)", which rounds to the profile's 84, and the data-depth inventory of 2026-10-02 lists that source as "discontinued 2021". The profile itself names no source or year for the field (DATA-REQUIREMENTS item 33 asks for "a current ease-of-operating reading on one published scale").
14. **"Days to trade 21" is the bank account's modeled 21 days.** The research note (item 24) found no official figure for opening a business bank account; the shard's step is modeled and only 46 shards hold the step at all.
15. **The exit card's "held" is rare and its count one-sided.** GB is one of only 2 of 198 shards tagging the exit block held (196 modeled), though `country_exit_rows.ts` says "Every one of them carries the tag `held` on the shards read so far"; "182 of 198" counts the high end alone (11 tie at 12 months, 4 are quicker).
16. **Informal economy, two files, opposite peer order.** Profile 11% (highest of the peers, all 8 to 9) against `informal_share.csv` 12.2586% for 2020 (lowest of the peers: Netherlands 12.83, Ireland 13.76, France 14.67, Germany 15.23).
17. **The income block is household PPP and modelled tails.** Per the seed's `income._meta`: the median 26,884 is "equivalised disposable income ... USD PPP (OECD ... 2021)"; average 32,275, top tenth 80,437 and top 1% 137,358 are "MODELED lognormal from median and Gini". It cannot be set beside the pay median (51,785, gross, per person) without saying so.
18. **Personal income tax "at 50k" is 40%** while the research note puts the basic rate at 20% up to £50,270; the field is wrong in pounds or dollars, and ranks the UK 4th of 197.
19. **Five-year inflation 3.8% matches no window.** DATA-REQUIREMENTS item 94: the national CPI gives 4.3% over 2019 to 2023 and 4.5% over 2020 to 2024; eight tier B rows hold 14.76% exactly.
20. **Unfair dismissal goes stale on 1 Jan 2027** (6 months, per the research note's legislation reference); the page prints "2 years".
21. **Peers' Ireland payroll contradicts its own note**: `country_rates_2024.json` holds 0.1175 (printed 11.8%) beside "Employer PRSI 11.05% standard".
22. **Smaller disagreements**: GDP per capita 49,500 (profile, `country_factors_v1.json`) against 53,246 (World Bank 2024 CSV); payroll per employee 46,000 (`country_smb_baseline.json`) against the 51,785 median; the engine's national margins for GB are negative on 4 of 6 everyday trades (restaurants -44.0%) while London's curated file has them positive; `data/facts/index.json` counts 419 GB facts where the shard holds 432.

From the parent repo:

23. **The register figures are built but not wired.** `registers/uk/export_for_site.py` writes to `E:/atlas/website/data/uk/registers`, which does not exist on this branch; its survival slice carries the UK-wide trade curves, London and the boroughs, but not the UK's or England's own row, and the formations series and the editorial feed are not exported at all.
24. **Three "UK five-year survival" constructions from one release.** The website's `survival.json` follows the 2019 cohort (94.6, 74.7, 55.9, 45.0, 38.4); the register table's `survival` takes each horizon from a different cohort (1 year 0.934 from 2023 births, 2 years 0.689 from 2022, 3 years 0.535, 4 years 0.44, 5 years 0.384); its `survival_period` chains the latest year's closure rates (5 years 0.375). They agree only at five years on the 2019 cohort.
25. **Three business counts.** Shard `demand.businesses_total` 5,600,000 (seed; the research note calls it the start-2024 figure); 5,690,265 (start of 2025, every private-sector business); 2,859,535 active registered businesses (the base survival is computed on). Not interchangeable.
26. **More electricity figures.** The warehouse holds 0.397 USD/kWh (£0.30); the website profile 0.32 (24.14p, all business sizes with the levy, Q1 2026); `design/loop/data/CORRECTIONS.md` 28.76p ("small-band incl CCL, Q1 2026", $0.38); the official-figures note 35.02p for very small users. A small shop pays the small or very small band, above the page's $0.32.
27. **The warehouse lags the website, and a re-export would undo the corrections.** `page-data/countries/GB.json` still holds registration £12, dividend 8%, capital gains 20%, start-up loans at 6% and sick pay "About $145/week"; `page-data/tools/export/to_website.py` writes `atlas_facts.csv` over `website/data/facts/` wholesale, so the next export would reverse the 2026-09-25 fixes in the website shard (and bring the `upkeep` block in). The sweep also found an older income drop (`page-data/_drops/income/batch-7cc138b7`) holding a GB median of 48,550 against 26,884.
28. **One national wage floor, several city values** (sweep's reading): the UK city files hold `min_wage_usd_mo` from 2,376 (Leeds, still on £11.44 and employer NI 13.8%) to 2,825 (London); none uses the £12.71 rate in force since 1 Apr 2026.

## Appendix: counts

| Source | UK values |
|---|---|
| `data/facts/country/GB.json` | 432 facts (196 numeric): 32 held (16 official 2026-09-25, 16 researched), 373 modeled, 27 placeholder |
| `country_profile_v2.json` | 39 numeric fields (plus 7 identity fields) |
| tax tables (`country_rates_2024.json`, `smb_effective_rates.ts`) | 2 rates, 1 regime, 1 sales-tax row |
| `business_formation_costs_v1.json` | 3 legal forms x (fee, days, paperwork, local name) |
| `country_signature_v1.json` | 2 shares, 12 reads, 3 sector labels |
| brain-skeleton CSVs | GDP per capita, population, implied exchange rate (2024), informal share (2020, 3 measures), prices (65 years, under "UK") |
| `data/economics` | median monthly pay, net wealth, self-employment share, 2 decile ratios |
| `src/lib` tables | SMB baseline (2), operating cost multipliers (3), property tax (1), country factors (3, duplicates) |
| `data/sections` (GB only) | survival 75 shares (5 national, 60 regional, 2 extremes, 8 obstacles); job market 6; people 17; thresholds 5 lines; grocery 6 shares; spend by age 25; spend by income 43; app fees 11 |
| other | engine margins 6 trades; 4 authored notes; 16 London margins (city level); 7 city pay figures (city level) |
| Website total | about 730 UK country-level values (about 800 if the 65 years of prices count one by one) in 31 files; about 235 of them printed on /gb (106 shard facts, 7 profile fields, 3 tax values, 12 formation values, 12 signature values, 91 section values, 4 notes), so roughly a third; the brain-skeleton, `data/economics` and `src/lib` tables print nothing |
| Parent repo, not carried | register tables (UK row: 20 figures plus 138 trade curves; insolvencies for 117 trades; 24 months of formations per trade; England turnover and rateable values), warehouse `upkeep` (13 GB rows), World Bank (5 series of 66 years), IMF (2 series 1980 to 2031), Eurostat regions (2008 to 2018), two research notes with dated and announced law changes |
