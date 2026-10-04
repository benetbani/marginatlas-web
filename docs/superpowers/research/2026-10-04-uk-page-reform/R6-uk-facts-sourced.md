# R6. United Kingdom small-business facts, sourced and checked (2026-10-04)

Research note, 2026-10-04. Every value below was read today on the page named beside it. Nothing here is estimated, averaged or rounded beyond what the source prints. No existing file was edited and nothing was committed.

## What was written

| File | What it holds | Rows | Sources |
|---|---|---|---|
| `data/sections/changes.json` | Dated changes a small UK firm lives under, in force or enacted with a date | 38 | all primary |
| `data/sections/rules.json` | Standing rules behind the page's figures, in 7 topics | 70 | all primary |
| `data/sections/payments.json` | How UK customers pay (2025, and retail 2024) and what card readers charge | 4 blocks, about 50 figures | all primary |
| `data/sections/insurance_costs.json` | NOT WRITTEN: no credible source publishes a typical UK small-business premium per cover (section 4) | 0 | |

Every row carries `url` and `checked: "2026-10-04"`. No row in any file rests on a secondary source.

**Value objects.** The brief's set (`gbp`, `pct`, `days`, `months`, `years`, `text`, `over_gbp`) was kept, and extended only where the law's own unit needed it, as the brief allows ("keep the law's own units"): `pence` (business rates multipliers, stated in pence in the pound), `weeks`, `hours`, `day` (the day of sickness sick pay starts; the day of the month payroll tax is due), `per` (the period of a rate: hour, week, day, year) and `above: "bank_rate"` (a margin over Bank Rate). Change rows may also carry `note` (at most eight words), `url_before` (the page that states the old value) and `url_law` (the enacting instrument, for rows whose `url` is guidance). Each file's `_about` lists these.

**Method.** Pages were fetched with curl and read as text, or through the fetch tool where a site blocks curl (UK Finance). Legislation was read from legislation.gov.uk's XML, so the amendment wording (for "£50.00" substitute "£100.00") is the evidence, not a summary.

---

## 1. `changes.json`: 38 dated changes

Status `in_force` means in force on 2026-10-04; `enacted` means made law with a future date. Proposals are not included.

| Item | Before | From | Effective date | Status | Primary URL | Verified |
|---|---|---|---|---|---|---|
| Corporation tax (main rate) | 19% | 25% on profits over £250,000 | 2023-04-01 | in force | https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax/rates-and-allowances-corporation-tax | primary |
| VAT threshold | £85,000 | £90,000 | 2024-04-01 | in force | https://www.gov.uk/government/publications/vat-increasing-the-registration-and-deregistration-thresholds | primary |
| Self-employed NI (Class 4 main rate) | 9% | 6% | 2024-04-06 | in force | https://www.gov.uk/government/publications/rates-and-allowances-national-insurance-contributions/rates-and-allowances-national-insurance-contributions | primary |
| Name change fee (online) | £8 | £20 | 2024-05-01 | in force | https://www.legislation.gov.uk/uksi/2024/155/made | primary |
| Capital gains, basic | 10% | 18% | 2024-10-30 | in force | https://www.gov.uk/government/publications/rates-and-allowances-capital-gains-tax/capital-gains-tax-rates-and-annual-tax-free-allowances | primary |
| Capital gains, higher | 20% | 24% | 2024-10-30 | in force | same page | primary |
| Employer NI | 13.8% above £9,100 | 15% above £5,000 | 2025-04-06 | in force | https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026 (before: .../2024-to-2025) | primary |
| Employment Allowance | £5,000 | £10,500 | 2025-04-06 | in force | same two pages | primary |
| Business sale relief (BADR) | 10% | 14% | 2025-04-06 | in force | https://www.gov.uk/business-asset-disposal-relief | primary |
| Late tax interest (margin over Bank Rate) | 2.5 points | 4 points | 2025-04-06 | in force | https://www.gov.uk/government/publications/rates-and-allowances-hmrc-interest-rates-for-late-and-early-payments/rates-and-allowances-hmrc-interest-rates | primary |
| Micro-entity turnover limit | £632,000 | £1,000,000 | 2025-04-06 (periods starting on or after) | in force | https://www.gov.uk/government/publications/life-of-a-company-annual-requirements/life-of-a-company-part-1-accounts | primary |
| Small company turnover limit | £10.2 million | £15 million | 2025-04-06 (periods starting on or after) | in force | same page | primary |
| Director ID check | not required | required (new directors; existing at next confirmation statement) | 2025-11-18 | in force | https://www.gov.uk/government/news/companies-house-confirms-identity-verification-rollout-from-18-november-2025 | primary |
| Bank Rate | 4% | 3.75% (held 17 Sep 2026; next decision 5 Nov 2026) | 2025-12-18 | in force | https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp | primary |
| Incorporation fee (online) | £50 | £100 (paper £71 to £124) | 2026-02-01 | in force | https://www.legislation.gov.uk/uksi/2025/1137/made | primary |
| Confirmation statement fee (online) | £34 | £50 (paper £62 to £110) | 2026-02-01 | in force | same instrument | primary |
| Strike-off fee (online) | £33 | £13 (paper £44 to £18) | 2026-02-01 | in force | same instrument | primary |
| Late return penalty (Company Tax Return, first flat penalty) | £100 | £200 | 2026-04-01 (returns due on or after) | in force | https://www.legislation.gov.uk/ukpga/2026/11/section/265/enacted | primary |
| Minimum wage (21+) | £12.21 an hour | £12.71 an hour | 2026-04-01 | in force | https://www.gov.uk/national-minimum-wage-rates | primary |
| Minimum wage (18-20) | £10 an hour | £10.85 an hour | 2026-04-01 | in force | same page | primary |
| Small rates multiplier (England, RV below £51,000) | 49.9p | 43.2p | 2026-04-01 | in force | https://www.gov.uk/calculate-your-business-rates | primary |
| Standard rates multiplier (England, RV £51,000 to £499,999) | 55.5p | 48p | 2026-04-01 | in force | same page | primary |
| Sick pay | £118.75 a week | £123.25 a week, or 80% of earnings if lower | 2026-04-06 | in force | https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 (before: .../2025-to-2026) | primary |
| Sick pay starts | day 4 of sickness | day 1 (earnings floor also removed) | 2026-04-06 | in force | https://www.acas.org.uk/employment-rights-act-2025 | primary |
| Maternity pay (weeks 7 to 39) | £187.18 a week | £194.32 a week | 2026-04-06 | in force | 2026-27 and 2025-26 employer rates pages | primary |
| Dividend tax, basic | 8.75% | 10.75% | 2026-04-06 | in force | https://www.legislation.gov.uk/ukpga/2026/11/section/4/enacted | primary |
| Dividend tax, higher | 33.75% | 35.75% | 2026-04-06 | in force | same section | primary |
| Business sale relief (BADR) | 14% | 18% | 2026-04-06 | in force | https://www.gov.uk/business-asset-disposal-relief | primary |
| Start-up loan rate | 6% | 7.5% fixed | 2026-04-06 | in force | https://www.startuploans.co.uk/support-and-guidance/frequently-asked-questions/changes-to-interest-rate-and-eligibility | primary (the lender's own page) |
| Start-up loan eligibility (months trading) | 36 | 60 | 2026-04-06 | in force | same page | primary |
| Unfair dismissal cap (compensatory award) | £118,223 | £123,543 | 2026-04-06 | in force | https://www.legislation.gov.uk/uksi/2026/310/made | primary |
| Week's pay cap (redundancy pay) | £719 | £751 | 2026-04-06 | in force | same instrument | primary |
| Digital tax records (Making Tax Digital for Income Tax) | not required | required over £50,000 qualifying income | 2026-04-06 | in force | https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax; law: https://www.legislation.gov.uk/uksi/2026/336/made (reg. 27) | primary |
| Tribunal claim limit | 3 months | 6 months | 2026-10-01 | in force | https://www.acas.org.uk/employment-rights-act-2025 | primary |
| Unfair dismissal (qualifying service) | 2 years | 6 months | 2027-01-01 | enacted | Acas page above; law: https://www.legislation.gov.uk/uksi/2026/559/made | primary |
| Unfair dismissal cap | £123,543 | no limit | 2027-01-01 | enacted | same two | primary |
| Digital tax records | over £50,000 | over £30,000 | 2027-04-06 | enacted | MTD guidance + SI 2026/336 | primary |
| Digital tax records | over £30,000 | over £20,000 | 2028-04-06 | enacted | same | primary |

---

## 2. `rules.json`: 70 standing rules

"In force" gives the period a figure belongs to where the source dates it.

### filings (23)

| Label | Value | Note | In force | Primary URL | Verified |
|---|---|---|---|---|---|
| Confirmation statement | every 12 months | at least one | standing | https://www.gov.uk/guidance/confirmation-statement-guidance | primary |
| Statement grace period | 14 days | after the review period ends | standing | same | primary |
| Statement fee | £50 | online; £110 paper | from 2026-02-01 | same | primary |
| Annual accounts due | 9 months | after year end (private company) | standing | https://www.gov.uk/government/publications/life-of-a-company-annual-requirements/life-of-a-company-part-1-accounts | primary |
| First accounts due | 21 months | after incorporation, if the period is over 12 months | standing | same | primary |
| Company tax return | 12 months | after the accounting period | standing | https://www.gov.uk/company-tax-returns | primary |
| Corporation tax due | 9 months and 1 day | after period end; profits up to £1.5m | standing | https://www.gov.uk/pay-corporation-tax | primary |
| VAT return period | 3 months | usual, if registered | standing | https://www.gov.uk/vat-returns | primary |
| VAT return due | 1 month and 7 days | after period end; payment the same day | standing | same | primary |
| Payroll report (FPS) | on or before each payday | if you employ | standing | https://www.gov.uk/running-payroll/reporting-to-hmrc | primary |
| Payroll tax due | 22nd of the month | 19th by post | standing | https://www.gov.uk/running-payroll/paying-hmrc | primary |
| Late accounts | £150 / £375 / £750 / £1,500 | up to 1 month / 1 to 3 / 3 to 6 / over 6 months late | standing | https://www.gov.uk/annual-accounts/penalties-for-late-filing | primary |
| Late accounts again | penalty doubled | late 2 years in a row | standing | same | primary |
| Late tax return | £200; a further £200 at 3 months; 10% of unpaid tax at 6 months; a further 10% at 12 months | | £200 from 2026-04-01 | https://www.gov.uk/company-tax-returns/penalties-for-late-filing | primary |
| Late three times | £1,000 each flat penalty | third late return running | from 2026-04-01 | same | primary |
| Late tax interest | 7.75% | Bank Rate plus 4% | from 2026-01-09 | HMRC interest rates page (section 1) | primary |
| Statement not filed | up to £5,000 fine | company may be struck off | standing | confirmation statement guidance | primary |

(Four "Late accounts" rows and four "Late tax return" rows are separate keys in the file; collapsed here.)

### employing (24)

| Label | Value | Note | In force | Primary URL | Verified |
|---|---|---|---|---|---|
| Pension, employer | 3% | minimum, of qualifying earnings | from April 2019 | https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay | primary |
| Pension, total | 8% | minimum, employer and worker | from April 2019 | same | primary |
| Pension band starts / ends | £6,240 / £50,270 a year | qualifying earnings | 2026-27 | https://www.thepensionsregulator.gov.uk/en/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds | primary |
| Enrolment trigger | £10,000 a year | | 2026-27 | same | primary |
| Minimum wage, 21+ / 18-20 / under 18 / apprentice | £12.71 / £10.85 / £8 / £8 an hour | | from 2026-04-01 | https://www.gov.uk/national-minimum-wage-rates | primary |
| Maternity pay, early | 90% of average weekly earnings | first 6 weeks | standing | https://www.gov.uk/maternity-pay-leave/pay | primary |
| Maternity pay, weekly | £194.32 | next 33 weeks, or 90% if lower | 2026-27 | same | primary |
| Maternity pay length | 39 weeks | | standing | same | primary |
| Statutory pay reclaim | 92% | 109% if Class 1 NI £45,000 or less | 2026-27 | https://www.gov.uk/recover-statutory-payments | primary |
| Sick pay | £123.25 a week | or 80% of earnings if lower | 2026-27 | https://www.gov.uk/statutory-sick-pay/what-youll-get | primary |
| Sick pay length | 28 weeks | paid from the first full day off | standing | https://www.gov.uk/employers-sick-pay/entitlement | primary |
| Paid holiday | 5.6 weeks | 28 days for a five-day week | standing | https://www.gov.uk/holiday-entitlement-rights | primary |
| Longest working week | 48 hours | average over 17 weeks; opt-out allowed | standing | https://www.gov.uk/maximum-weekly-working-hours | primary |
| Short / mid / long-service notice | 1 week / 1 week per full year / 12 weeks | 1 month to 2 years / 2 to 12 years / 12+ years | standing | https://www.acas.org.uk/notice-periods/notice-when-being-dismissed-or-made-redundant | primary |
| Employer NI | 15% | above the threshold | 2026-27 | https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 | primary |
| Employer NI threshold | £5,000 a year | £96 a week | 2026-27 | same | primary |
| Employment Allowance | £10,500 a year | | 2026-27 | same | primary |
| Unfair dismissal | 2 years | 6 months from 1 Jan 2027 | until 2026-12-31 | https://www.acas.org.uk/employment-rights-act-2025 | primary |

### paying (7)

| Label | Value | Note | Primary URL | Verified |
|---|---|---|---|---|
| Late payment interest | 8% above Bank Rate | business to business, unless a contract differs | https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt | primary |
| Recovery fee | £40 / £70 / £100 | debts up to £999.99 / £1,000 to £9,999.99 / £10,000 or more | https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs | primary |
| Default payment period | 30 days | after invoice or delivery, if none agreed | https://www.gov.uk/late-commercial-payments-interest-debt-recovery | primary |
| Agreed period limit | 60 days | between businesses; longer only if fair to both | same | primary |
| Public sector limit | 30 days | | same | primary |

### insurance (3)

| Label | Value | Primary URL | Verified |
|---|---|---|---|
| Minimum cover (employers' liability) | £5 million | https://www.gov.uk/employers-liability-insurance | primary |
| Uninsured fine | £2,500 a day | same | primary |
| Certificate not shown | £1,000 | same | primary |

### holidays (3), 2026

| Label | Value | Primary URL | Verified |
|---|---|---|---|
| England and Wales | 8 bank holidays | https://www.gov.uk/bank-holidays (counted from the page's own feed, /bank-holidays.json) | primary |
| Scotland | 10 (includes a one-off "World Cup bank holiday" on 15 June 2026; 2027 has 9) | same | primary |
| Northern Ireland | 10 | same | primary |

### premises (7), England 2026-27

| Label | Value | Primary URL | Verified |
|---|---|---|---|
| Full relief limit | rateable value £12,000 or less pays no rates (one property) | https://www.gov.uk/business-rates-relief/small-business-rate-relief | primary |
| Relief ends | £15,000 (tapers 100% to 0% from £12,001) | same | primary |
| Small multiplier | 43.2p (RV below £51,000) | https://www.gov.uk/calculate-your-business-rates | primary |
| Standard multiplier | 48p (RV £51,000 to £499,999) | same | primary |
| Small retail multiplier | 38.2p (retail, hospitality, leisure; below £51,000) | same | primary |
| Retail multiplier | 43p (retail, hospitality, leisure; £51,000 to £499,999) | same | primary |
| High-value multiplier | 50.8p (RV £500,000 or more) | same | primary |

The retail, hospitality and leisure multipliers replace the 2025-26 relief for those trades (same page).

### closing (3)

| Label | Value | Primary URL | Verified |
|---|---|---|---|
| Strike-off notice | at least 2 months after the Gazette notice | https://www.gov.uk/government/publications/striking-off-or-dissolving-a-limited-company/striking-off-or-dissolving-a-limited-company | primary |
| No-trading period | 3 months before applying (no trading, no name change) | https://www.gov.uk/strike-off-your-company-from-companies-register | primary |
| Strike-off fee | £13 online, £18 paper | https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees | primary |

---

## 3. `payments.json`

### (a) All UK payments, 2025, by number (UK Finance, UK Payment Markets 2026 summary, published 19 August 2026)

Source: https://www.ukfinance.org.uk/system/files/2026-08/PaymentMarketsReport_2026Summary.pdf (linked from https://www.ukfinance.org.uk/policy-and-guidance/reports/uk-payment-markets-2026). Verified primary.

| Method (the report's own names) | Payments, millions | Share printed by the report |
|---|---|---|
| Debit card | 26,610 (16,180 contactless) | 54% |
| Credit / charge / purchasing card | 5,333 (3,007 contactless) | not printed |
| Faster Payments and other remote banking | 6,190 | not printed (second most used method) |
| Direct Debit | 5,090 | 10% |
| Cash | 3,942 | 8% |
| Bacs Direct Credit | 1,835 | not printed |
| Standing order | 551 | not printed |
| Cheque | 77 | 0.2% |
| Other | 145 | not printed |
| **Total (CHAPS excluded)** | **49,712** | |
| Card payments (debit and credit) | | 64% |
| Contactless (cards and mobile wallets) | 19.2 billion | 39% |

History printed by the report: cash 45% (2015), 17% (2020), 8% (2025); contactless 3%, 27%, 39%.

**Caution.** The printed method counts sum to 49,773 million, not the printed 49,712 million. So the file stores shares only where the report prints them and computes none.

**Consumers only, 2025:** 41.6 billion payments (35.0 billion spontaneous, 6.5 billion regular bills). Debit cards 63% and credit or charge cards 12% of consumer payments by number; 3.8 billion cash payments by consumers. 58% of adults used mobile payments at least once a month; 37.6 million people were registered for a mobile wallet. The report counts mobile wallet payments inside card payments and gives them no separate share of payments.

### (b) Retail transactions, 2024 (British Retail Consortium, BRC Payments Survey 2025, press release 12 December 2025)

Source: https://brc.org.uk/news-and-events/news/corporate-affairs/2025/ungated/high-interest-rates-push-shoppers-from-credit-to-debit-cards/. Verified primary (the publisher's own release).

| Method | Share of retail transactions |
|---|---|
| Debit card | 64.0% |
| Credit card | 12.6% |
| Cash | 19.2% |

20.4 billion transactions. Card fees paid by retailers: £1.48 billion. This is the closest published figure to "the share of in-person payments made by card". It covers retailers' transactions, not only in-person ones.

### (c) Card readers (providers' own UK pages)

| Provider | Fee | Monthly | Payout | URL | Matches `local_apps.json`? |
|---|---|---|---|---|---|
| SumUp, Pay-as-you-go | 1.69% | £0 | next day into a SumUp Business Account, weekends and holidays included | https://www.sumup.com/en-gb/pricing/ ; payout: https://www.sumup.com/en-gb/business-account/ | yes (1.69%) |
| SumUp, Payments Plus | 0.99% | £19 | | same | (not in local_apps) |
| Square, Free plan | 1.75% in person (UK cards), plus 1.5% on non-UK cards; online 1.4% + 25p; keyed in 2.5% | £0 | free standard transfer "as soon as the next day"; instant transfer in minutes for 1.5% | https://squareup.com/gb/en/pricing ; https://squareup.com/gb/en/payments/instant-transfers | yes (1.75%) |
| Zettle (now PayPal Point of Sale) | 1.75% | none | "typically within minutes" into a PayPal Business account; automatic transfers to a bank with no added fee | https://www.zettle.com/gb/pricing | yes (1.75%) |

All verified primary.

---

## 4. `insurance_costs.json`: not written

The brief: write it only if a credible source publishes a typical yearly premium (an insurer's or broker's average from its own policy data, with year and cover). No such figure exists for any of the four covers as a UK small-business typical. What exists:

- **"From" prices (the cheapest tenth), not typical premiums.** Simply Business's own pages: public liability, 10% of customers paid £64.78 or less a year for up to £2 million cover, 1 Jan to 30 Jun 2026 (https://www.simplybusiness.co.uk/business-insurance/public-liability-insurance/). Professional indemnity: 10% paid £82.75 or less for up to £1 million, same period (https://www.simplybusiness.co.uk/business-insurance/professional-indemnity-insurance/). Employers' liability, £10 million cover with up to £2 million public liability: 10% paid £79.80 or less, same period (https://www.simplybusiness.co.uk/business-insurance/employers-liability-insurance/). AXA: public liability "from £63 a year", which 10% of customers paid or less, April to June 2026. Hiscox: public liability "from £5.20 per month". All primary, but they describe the cheapest tenth, not what a typical firm pays.
- **Medians by trade, published by a comparison site from its partner's data (secondary).** MoneySuperMarket, citing Simply Business data. Medians ("51% of customers paid this or less") for whole trade policies bought in 2024: builders £168.24, roofers £305.10, painters and decorators £87.54, electricians £88.30, plasterers £78.61, caterers £135.66. These are bundled trade policies, not public liability alone (https://www.moneysupermarket.com/business-insurance/public-liability/). Its employers' liability page gives an "average" of £16.97 a month for £10 million employers' liability plus up to £2 million public liability, a median for 1 Feb to 30 Apr 2025. Professional indemnity: accountants averaged £87.86 and consultants £111.03 a year (quotes bought 1 Oct to 31 Dec 2024).
- **Property or contents:** only example quotes for named profiles (Simply Business). No average or median anywhere.
- GoCompare reportedly prints a professional indemnity median (£81.78). Its page blocked every fetch, so this is unverified.

Verdict: no file. The page's four premiums cannot be replaced like for like. If the founder wants an insurance figure, the honest candidates are the cheapest-tenth prices above, printed as what they are ("10% of customers paid £64.78 or less, up to £2m cover, H1 2026"). That needs his ruling.

---

## 5. Checked and reported only (no file)

### Innovate UK grants (the page prints "$30K to $2M")

- **Smart grants are closed.** ukri.org: "Smart grants are now closed for new applications as funding is being aligned to Innovate UK's new strategic direction" (https://www.ukri.org/councils/innovate-uk/guidance-for-applicants/guidance-for-specific-funds/smart-innovation-funding-guidance/). Smart was Innovate UK's open, any-sector grant. Its last round opened 14 Nov 2024 and closed 22 Jan 2025. It took projects with total eligible costs of £100,000 to £500,000 (6 to 18 months), or £100,000 to £1 million for 19 to 24 month collaborations (https://apply-for-innovation-funding.service.gov.uk/competition/2057/overview/94b01162-f7ac-45b1-aede-ce7663a3be3a). The seed's "$30K to $2M" matches neither.
- **What is open today.** The Innovation Funding Service (https://apply-for-innovation-funding.service.gov.uk/competition/search) lists 28 competitions on 2026-10-04, every one themed. Examples open to small firms: Frontier AI: SME Champions, Phase 1 (share of up to £3.1 million, closes 11 Nov 2026); Engineering Biology Investor Partnerships (share of up to £8 million, closes 2 Dec 2026); UK-Singapore CRD 2026 (share of up to £3 million). No programme has one grant range for "small firms".
- **Innovation Loans (SMEs):** £100,000 to £5 million. 3.7% a year interest during the project, plus 3.7% deferred; 7.4% during repayment. The expression of interest closes 9 Oct 2026 (https://apply-for-innovation-funding.service.gov.uk/competition/2505/overview/8ef63f10-ea07-4ffd-9812-e944542751b6). Primary.

Verdict: "Innovate UK grants $30K to $2M" must be removed. No current programme carries that range.

### Hours a small firm spends on tax and admin

- **No official figure.** The National Audit Office (10 Feb 2025) says HMRC "has not carried out research into the time taken by businesses to comply with tax obligations in most cases since 2015" (https://www.nao.org.uk/wp-content/uploads/2025/02/the-administrative-cost-of-the-tax-system-summary.pdf). HMRC's own estimate is in money only: £15.4 billion a year across all businesses, £6.6 billion of it paid to agents and software firms. Primary.
- **Best non-official figure: 44 hours and £4,500 a year on tax compliance per small firm.** From the FSB report "Taking a Toll", April 2025, a survey of over 1,400 small business owners. **Secondary only:** the FSB's own page blocked every fetch, and the figure was confirmed through press coverage (Accountancy Age, 22 April 2025: https://www.accountancyage.com/2025/04/22/hmrc-red-tape-casts-uk-smes-25bn-a-year/).
- **Related official nugget:** 73% of small businesses used a tax agent or external accountant in the past 12 months (HMRC, Agents, Small and Mid-Sized Businesses Customer Survey 2025, fieldwork Sep to Nov 2025: https://www.gov.uk/government/publications/agents-small-and-mid-sized-businesses-customer-survey-2025/agents-small-and-mid-sized-businesses-customer-survey-2025). Primary. Not written to a file because it is a survey share, not a rule.

---

## 6. Not sourced (searched, not written)

| Fact | What was searched | Result |
|---|---|---|
| Typical premiums: public liability, employers' liability, professional indemnity, property or contents | Simply Business, AXA, Hiscox, MoneySuperMarket, GoCompare, Hiscox fair value assessment (PDF), web search for insurer and broker averages | only cheapest-tenth prices or trade-bundle medians (section 4) |
| Hours of admin a year (official) | HMRC customer surveys 2024 and 2025, HMRC research report 375, NAO 2025 | none since 2015; FSB 44 hours secondary only |
| A count of "filings a year" | gov.uk filing guides | no official count; it depends on VAT registration and payroll. The filings themselves are in `rules.json` |
| How long an insolvent liquidation takes | gov.uk liquidation guides (creditors' and members' voluntary), closing a company | no duration published; a members' voluntary liquidation requires debts paid within 12 months, a solvency rule, not a duration |
| Share of payments by mobile wallet | UK Finance summary | wallet payments are counted inside card payments; only adoption figures (58% monthly use) |
| Share of in-person payments by card | UK Finance summary, BRC | none for in-person only; BRC's retail-transaction shares are the closest (section 3b) |
| SumUp payout time to an outside bank account | SumUp help pages (rendered by script, unreadable), SumUp press page | only a 2023 press release ("typically took one to two business days"); not current, not written |
| Start Up Loans minimum (£500) | startuploans.co.uk home page | "up to £25,000" read; £500 not seen today, not written |
| Accounts filed by software only from 1 April 2028 | Companies House "Life of a company" guide | announced by the registrar; not verified as enacted, so not in `changes.json` |
| UK Finance Payment Markets full report tables | report page | members-only; the free summary was used |

---

## 7. The placeholders on the page and their verdict

| Placeholder (seed `src/lib/spine-seeds/countries/GB.json`) | Verdict | Replace with (file, key) |
|---|---|---|
| Payment mix: card 60%, bank transfer 20%, cash 12%, digital wallet 8% | **Replace.** No category matches the report's. | `payments.json` `all_payments`: debit card 54%, cards 64%, Direct Debit 10%, cash 8% of all UK payments in 2025, with counts for every method; or `retail`: debit 64.0%, credit 12.6%, cash 19.2% of retail transactions in 2024. "Digital wallet 8%" must go: wallets are inside card payments (58% of adults pay by phone at least monthly) |
| Card fee 1.5% | **Replace.** No provider charges 1.5%. | `payments.json` `card_readers`: SumUp 1.69%, Square 1.75%, Zettle 1.75% (in person) |
| Card payouts "1 to 3 days" | **Replace.** | SumUp next day (into its own account), Square as soon as the next day (instant for 1.5%), Zettle within minutes (into a PayPal account) |
| Insurance: property $700, employers' liability $600, professional indemnity $550, public liability $350; total "$2,200 a year" | **Remove all four and the total.** No typical premium is published (section 4). The "$183 a month" proposed in R4 2.7 falls with them. | Keep the law: `rules.json` `insurance` (£5m minimum, £2,500 a day uninsured, £1,000 certificate). Cheapest-tenth prices only if the founder rules for them |
| "55 hours" of admin a year | **Remove.** No official figure since 2015. | FSB's 44 hours and £4,500 (2025 survey) is secondary only. It could replace this after a check on the FSB's own page and a ruling that a trade-body survey may print |
| "9 filings" a year | **Remove the count.** It depends on VAT and payroll. | `rules.json` `filings`: each filing with its deadline and its penalty |
| "6 to 12 months" to close a company with debts | **Remove.** No official duration. | `rules.json` `closing`: strike-off at least 2 months after the Gazette notice, 3 months without trading first, £13 online. A company with debts needs a licensed insolvency practitioner, a rule with no duration |
| "Innovate UK grants $30K to $2M" | **Remove.** Smart grants are closed. | Nothing like for like. Possible: Innovation Loans £100,000 to £5 million (SMEs), with the EOI closing 9 Oct 2026 (dated, so it will go stale) |

**Other seed lines the checks contradict (found in passing, not asked):**

- `grants` "Start Up Loans ... fixed 6% rate": wrong since 6 April 2026. The rate is 7.5% and trading under 60 months qualifies (`changes.json`).
- `closing.solvent` "struck off for about $40": the online fee is £13 since 1 Feb 2026 (£18 paper).
- `insurance` "fines up to $3,000 a day": the law says £2,500 a day.
- `employment.sick_pay` "About $145/week": the rate is £123.25 a week or 80% of earnings if lower. `employment.dismissal` "after 2 years" changes to 6 months on 1 Jan 2027.

## 8. Corrections to the earlier notes

- R4 (2.3, 2.4 and D2) dates the minimum wage rise to 6 April 2026. The official date is **1 April 2026**.
- R4 marked several changes [snippet]. All are now confirmed on primary pages: Companies House fees, employer NI, VAT threshold, director ID, minimum wage, late accounts penalties.
- New since 2026-09-25: the Company Tax Return late filing penalties doubled for returns due from 1 April 2026 (£100 to £200; £500 to £1,000 for repeat failures; Finance Act 2026 s.265). The online strike-off fee fell from £33 to £13 on 1 Feb 2026. The tribunal claim limit rose from 3 to 6 months on 1 Oct 2026. The unfair dismissal cap rose to £123,543 on 6 April 2026 and goes on 1 Jan 2027. Scotland has 10 bank holidays in 2026 because of the one-off World Cup holiday on 15 June.
