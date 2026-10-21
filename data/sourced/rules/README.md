# data/sourced/rules: the rules and the risk, from the issuers

Written by job D3 (data-rules) on 2026-10-17 for the plan's Task 3. Every file follows the sourced-data contract of the plan's
Task 1 and passes `python3 /srv/atlas/wc/briefs/validate_sourced.py data/sourced/rules`. Every row of the Step 2 files and the
tax case carries its own `source` (the issuer's page); the file-level `source` only names the set. Money stays in the currency
the issuer publishes. Retrieved 2026-10-17 unless a row says otherwise.

| File | Rows | What it holds | Where from |
|---|---|---|---|
| `b-ready-2025.json` | 808 | For each of the 101 B-READY 2025 economies: company entry days (Q119) and cost in local currency (Q120), whether a paid-in minimum capital is required (Q25, 1/0), liquidation and reorganisation time (months) and cost (% of asset value), and the enterprise-survey share of social charges in labour cost (`tax7`, what firms report). Measured in each economy's largest business city (handbook); the workbook names no city. Never its labour answers. | World Bank, B-READY_ALL_DATA_2025.zip, workbook 02 (23 Dec 2025); units from the B-READY Methodology Handbook, 2nd edition; currencies from ISO 4217 list one |
| `rates-and-loans.json` | 633 | Central bank rates and their changes since mid-2024 (UK, US, euro area, Hungary); new business loan rates: UK all firms monthly and SMEs (Aug 2026), US small-business term loans quarterly, ECB MIR loans up to EUR 0.25m monthly for all 21 euro-area countries, Hungary under EUR 1m. | Bank of England, Federal Reserve, ECB Data Portal, MNB, Federal Reserve Bank of Kansas City |
| `registration.json` | 19 | Registration fees by legal form, minimum capital (Italy, Hungary), the court's decision deadline (Hungary). | Companies House, California SOS and FTB, LA Office of Finance, Rome and Bologna Chambers of Commerce, njt.jog.gov.hu, birosag.hu |
| `scotland-business-rates-2026.json` | 9 | Scotland's non-domestic rates 2026-27 (`GB-SCT`): basic 48.1p, intermediate 53.5p and higher 54.8p (basic plus the additional factor, the sum worked); Small Business Bonus Scheme thresholds (12,000, 15,000, 20,000, combined 35,000); the 15% and 40% hospitality reliefs up to RV 100,000. England's rates stay in local-business-taxes.json. | SSI 2026/39, SSI 2026/68 (legislation.gov.uk), Scottish Government circular 7/2026 |
| `licences.json` | 83 | Restaurant, cafe and barbershop licences in the four cities: issuer in `note`, fee, wait only where the issuer states one, one row per fee. | FSA, Home Office, MHCLG, City of London, LA County DPH, California ABC, LADOT, California Board of Barbering and Cosmetology, Roma Capitale SUAP, Gov. Decree 210/2009 |
| `card-fee-caps.json` | 2 | The UK caps on card interchange fees: 0.2% of a UK consumer debit card payment, 0.3% of a credit card payment (the card bank's share only; the shop's own bank and the scheme add their uncapped fees). | retained Regulation (EU) 2015/751, articles 3 and 4, legislation.gov.uk |
| `uk5-country-rows.json` | 29 | The country page's rows no file held: filing deadlines (VAT, accounts, first accounts, corporation tax, the return, the confirmation statement) and the four late-accounts penalties; registration in about 24 hours; the steps (Corporation Tax set-up, which gov.uk now gives no deadline; the employer before the first payday; a food business 28 days before trading; a sole trader at once); the Start Up Loan (500 to 25,000, 7.5% fixed, 1 to 5 years); the workplace pension (3% from the employer, 6,240 to 50,270); six rule changes (unfair dismissal to 6 months, 1 Jan 2027; tribunal claims 3 to 6 months, 1 Oct 2026; sick pay from day one, 6 Apr 2026; Making Tax Digital at 50,000, 30,000 and 20,000, April 2026 to 2028; the registration fee 100 pounds, 1 Feb 2026). Every value read from the page's words; two "before" figures (the old fee, the old waiting days) are not on gov.uk's current pages and are said so. Rebuild: `bash uk5_gov_fetch.sh && python3 uk5_country_rows.py`. | gov.uk content API, 17 pages (each row's own url and sha256) |
| `profit-taxes.json` | 27 | Company and sole-trader rates, owners' contributions, the alternative regimes (Italy's forfetario, Hungary's KIVA). | HMRC, IRS, California FTB, Normattiva, Agenzia delle Entrate, INPS, MEF Dipartimento Finanze, NAV |
| `vat-sales-tax.json` | 10 | Standard rate, the rate on a restaurant meal, the registration threshold; Los Angeles sales tax. | HMRC, CDTFA, Normattiva, Agenzia delle Entrate, NAV |
| `employer-charges.json` | 22 | Employer charges by name and rate; the wage floor and its kind (`wage_floor`: statutory, city ordinance, or collective agreement). | HMRC, GOV.UK, IRS, US DOL, California EDD and DIR, LA Office of Wage Standards, CCNL Pubblici Esercizi tables, njt.jog.gov.hu |
| `leave-notice.json` | 8 | Paid leave and the employer's notice by law; paid sick leave in California and Los Angeles. | GOV.UK, California DIR, Wages LA, Normattiva, Hungarian Labour Code |
| `local-business-taxes.json` | 14 | Business rates multipliers and relief (England), LA city business tax and its exemption, IRAP Lazio, Rome TARI per m2 by trade, Budapest HIPA and its exemption. | GOV.UK, LA Office of Finance, MEF IRAP list, Roma Capitale (AC 121/2026), Budapest council, Act C of 1990 |
| `insolvency.json` | 9 | A company and a sole trader if the business fails: fees, discharge periods, the procedures by name. | GOV.UK, US Courts, Normattiva, njt.jog.gov.hu |
| `rule-changes.json` | 16 | Rule changes of the last two years: `year` is the date it took effect, `note` the before and after. | as each rule |
| `tax-case-40000.json` | 60 | A sole trader with a profit of 40,000 in the local currency under 2026 rules: every parameter its own row, each component and the total computed and said how, the regime named, the alternatives in `note`. | as each parameter |

Items: `company_entry_days`, `company_entry_cost`, `minimum_capital_required`, `liquidation_months`, `liquidation_cost_pct`,
`reorganisation_months`, `reorganisation_cost_pct`, `labour_tax_share_of_labour_cost`, `central_bank_rate` (+ `_upper`, `_mro`,
`_change`), `business_loan_rate`, `small_business_loan_rate`, `registration_fee`, `registration_stamp_duty`, `chamber_annual_fee`,
`annual_company_tax`, `registration_required`, `registration_wait_days`, `minimum_capital`, `licence_fee`, `licence_annual_fee`,
`licence_wait_days`, `licence_required`, `tax_rate`, `profit_tax_rate`, `income_tax_rate`, `income_tax_allowance`,
`owner_contribution_rate`, `vat_rate_standard`, `vat_rate_restaurant`, `vat_threshold`, `sales_tax_rate`, `employer_charge_rate`,
`employer_charge_threshold`, `employer_allowance`, `wage_floor`, `paid_leave`, `paid_sick_leave`, `notice_employer`,
`local_tax_rate`, `local_tax_exemption`, `local_tax_relief_threshold`, `liquidation_court_fee`, `bankruptcy_fee`,
`bankruptcy_discharge`, `insolvency_procedure`, `rule_change`, `tax_case_profit`, `tax_case_parameter`, `tax_case_component`,
`tax_case_total`, `tax_case_share_of_profit`, `tax_case_kept`.

`value: null` rows state a fact in words (a requirement without a fee on the page, Italy's lack of a statutory minimum wage).

Rebuild: the builders are in `_scripts/` (`bready.py`, `build_rates.py`, `build_step2.py`, `build_taxcase.py`, helpers in
`lib.py`); they read the raw downloads kept on the build server under `/srv/atlas/wc/cwd/data-rules/dl/` and need
`openpyxl` (the research venv `/srv/atlas/wc/cwd/research-rules/venv`).

Licences: GOV.UK and Companies House pages are under the Open Government Licence v3.0 (stated on the pages). The other
publishers' terms were not read; check them before any reuse beyond citation.
