/**
 * src/lib/spine/uk_sources.ts
 *
 * THE UNITED KINGDOM'S SOURCES, NAMED ONCE (plan 06, task B4; his ruling of 2026-10-04 on R-002: "One sources page"). The site
 * names no source agency on a card, a heading or a title (R-002, the copy rulings); the UK's registers and statistics are licensed
 * under the Open Government Licence v3.0, which asks for the source to be acknowledged with its attribution statement and allows one
 * page that holds them all where many are impractical. That page is About the figures, section `#sources`; every UK page's foot
 * carries the licence sentence and a link to it (SourcesFoot.tsx). THIS IS THE ONE MODULE ALLOWED TO NAME THEM
 * (scripts/verify_no_source_agencies.ts allow-lists it), so the names live here and nowhere a reader meets them by accident.
 *
 * BUILT FROM THE REPOSITORY'S OWN RECORDS ONLY: every `publisher` in data/sections/*.json, the register slices' manifest
 * (data/uk/registers/manifest.json, its rows read through the parent's ledger E:/atlas/registers/uk/tables/ledger.json for the
 * licence and the attribution line), the research notes the section files name (2026-09-25-uk-official-figures.md,
 * 2026-09-25-R4-customers-GB.md), and the `url` fields of the rules, changes and thresholds files. A licence line prints only where
 * those records name the licence: the statistics office and the valuation statistics (the ledger), GOV.UK (the plan's list), and
 * the three departments whose statistics are GOV.UK publications (their records' links are gov.uk pages); every other entry prints
 * none, never a licence guessed. Nothing on the page may imply that a source endorses the site (the licence's own condition), so the section says
 * so in its first line.
 *
 * An entry is a publisher, what the pages print from it (a label, plain words), each dataset or page read (its title as published,
 * its link where the records hold one), and its attribution line. The test (tests/spine/uk_sources.test.ts) holds the list to the
 * records: every section file's publisher maps to an entry, every register slice a page reads maps to one, and no attribution line
 * is anything but the two the ledger states.
 */

/** The Open Government Licence's attribution statement for public sector information (the ledger's line for the valuation
 *  statistics and GOV.UK, and the foot of every UK page). */
export const OGL_LINE = "Contains public sector information licensed under the Open Government Licence v3.0.";
/** The statistics office's own attribution statement (the ledger's line for every register row it publishes). */
export const ONS_LINE = "Source: Office for National Statistics licensed under the Open Government Licence v3.0.";

export type UkSourceItem = {
  /** What the UK pages print from it, plain words. */
  prints: string;
  /** The dataset, release or page as published. */
  title: string;
  /** Its link, where the records hold one; null where they name the table only. */
  url: string | null;
};

export type UkSource = {
  key: string;
  publisher: string;
  /** The names the repository's files use for this publisher (a section file's `publisher` starts with one of them). */
  names: string[];
  items: UkSourceItem[];
  /** The attribution line its licence asks for, where the records name the licence; null otherwise. */
  attribution: string | null;
};

export const UK_SOURCES: readonly UkSource[] = [
  {
    key: "ons",
    publisher: "Office for National Statistics",
    names: ["ONS", "Office for National Statistics"],
    attribution: ONS_LINE,
    items: [
      { prints: "Registered businesses and their yearly sales, by trade, in Greater London", title: "UK Business Counts, March 2026 register snapshot, read through Nomis", url: "https://www.nomisweb.co.uk/" },
      { prints: "How many businesses last one, three and five years, by trade group and by region", title: "Business demography, UK: 2024, reference tables (20 November 2025)", url: "https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/datasets/businessdemographyreferencetable" },
      { prints: "Unemployment, youth unemployment and vacancies", title: "Labour market overview, UK: September 2026", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/september2026" },
      { prints: "Typical full-time pay, the UK's and its cities'", title: "Annual Survey of Hours and Earnings, April 2025, Tables 1.7a, 7.7a and 8.7a", url: null },
      { prints: "The population by age", title: "Population estimates, mid-2024 and mid-2025", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/annualmidyearpopulationestimates/mid2024" },
      { prints: "The online share of retail sales", title: "Retail sales, Great Britain: August 2026", url: "https://www.ons.gov.uk/businessindustryandtrade/retailindustry/bulletins/retailsales/latest" },
      { prints: "What households spend each week, by age and by income", title: "Family spending in the UK, April 2024 to March 2025, workbooks 1 and 2", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/bulletins/familyspendingintheuk/april2024tomarch2025" },
      /* His ruling of 2026-10-05 on PARKED P04.1: /gb's household card from the survey's own lines (data/sections/household_spend.json). */
      { prints: "What a household's week goes on, and eating out's share of the food money", title: "Family spending workbook 1: detailed expenditure and trends, financial year ending 2025, Table A1", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/familyspendingworkbook1detailedexpenditureandtrends" },
      { prints: "Overseas visits to the UK", title: "Travel trends: 2024", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/leisureandtourism/articles/traveltrends/2024" },
    ],
  },
  {
    key: "voa",
    publisher: "Valuation Office Agency",
    names: ["Valuation Office Agency"],
    attribution: OGL_LINE,
    items: [
      { prints: "The rateable value of an average London restaurant, salon or gym, behind the sales a business needs to break even", title: "Non-domestic rating: business floorspace, March 2025, special categories by local authority", url: "https://assets.publishing.service.gov.uk/media/694165351d8a56d23b7f0af9/NDR_SCat_Floorspace_LA_2025.zip" },
    ],
  },
  {
    key: "govuk",
    publisher: "GOV.UK",
    names: ["GOV.UK"],
    attribution: OGL_LINE,
    items: [
      { prints: "Tax rates, National Insurance, the minimum wage, VAT, business rates, company fees and filing dates, the rules of employing, statutory pay and the insurance the law requires", title: "Guidance pages, each read on the day stated in the file that holds it", url: "https://www.gov.uk/" },
      { prints: "What one worked hour of a hire costs, all in, and what letting that hire go costs", title: "Rates and thresholds for employers 2026 to 2027, holiday entitlement, redundancy pay and notice, and the Home Office code of practice on right-to-work checks", url: "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027" },
      { prints: "The stamp duty on a shop's lease, and VAT on its rent", title: "Stamp Duty Land Tax: leasehold purchases, and VAT notice 742A on opting to tax land and buildings", url: "https://www.gov.uk/guidance/stamp-duty-land-tax-leasehold-purchases" },
      { prints: "What a founder from abroad meets: the company and its address, the identity check, the tax code, the visas that let you run a business, and who cannot be sponsored", title: "Set up a limited company; verify your identity for Companies House; the Innovator Founder, Youth Mobility and Skilled Worker visa pages; the Home Office fees of 8 April 2026", url: "https://www.gov.uk/innovator-founder-visa" },
      { prints: "What failing costs a sole trader (bankruptcy and its end, the home, a Debt Relief Order) and a director's loan charge", title: "Guide to bankruptcy; how to get a Debt Relief Order; director information hub, duties upon insolvency; HMRC's Company Taxation Manual, CTM61505", url: "https://www.gov.uk/government/publications/guide-to-bankruptcy/guide-to-bankruptcy" },
      { prints: "What winding up a failed company costs, and how long it takes", title: "Creditors' voluntary liquidation (CVL) research report for the Insolvency Service (17 December 2024)", url: "https://www.gov.uk/government/publications/creditors-voluntary-liquidation-cvl-research-report-for-the-insolvency-service/cvl-research-report-for-the-insolvency-service" },
    ],
  },
  {
    key: "dbt",
    publisher: "Department for Business and Trade",
    names: ["Department for Business and Trade"],
    attribution: OGL_LINE,
    items: [
      { prints: "What small employers name as a major obstacle", title: "Longitudinal Small Business Survey 2024 (September 2025)", url: "https://gov.uk/government/statistics/small-business-survey-2024-businesses-with-employees/longitudinal-small-business-survey-2024-sme-employers-businesses-with-1-to-249-employees" },
    ],
  },
  {
    key: "dft",
    publisher: "Department for Transport",
    names: ["Department for Transport"],
    attribution: OGL_LINE,
    items: [
      { prints: "How trips are made: on foot, by car, by public transport", title: "National Travel Survey 2025", url: "https://www.gov.uk/government/statistics/national-travel-survey-2025/nts-2025-trips-by-purpose-age-mode-and-sex" },
    ],
  },
  {
    key: "desnz",
    publisher: "Department for Energy Security and Net Zero",
    names: ["Department for Energy Security and Net Zero"],
    attribution: OGL_LINE,
    items: [
      { prints: "Business electricity prices", title: "Gas and electricity prices in the non-domestic sector, tables 3.4.1 and 3.4.2, first quarter of 2026", url: null },
      { prints: "The pump price of diesel", title: "Weekly road fuel prices", url: "https://www.gov.uk/government/statistics/weekly-road-fuel-prices" },
    ],
  },
  {
    key: "legislation",
    publisher: "legislation.gov.uk",
    names: ["legislation.gov.uk"],
    attribution: null,
    items: [
      { prints: "The acts and statutory instruments behind each dated change", title: "Each instrument as made or enacted", url: "https://www.legislation.gov.uk/" },
      { prints: "The law of a shop's lease: renewal and its notices, signing it away, a refusal's compensation, registering it, the repairs claim", title: "Landlord and Tenant Act 1954, Part II; Land Registration Act 2002; Landlord and Tenant Act 1927, section 18; the contracting-out order of 2003 and the Land Registration fee order of 2024", url: "https://www.legislation.gov.uk/ukpga/Eliz2/2-3/56" },
      { prints: "When a failed company's debts reach its director: wrongful trading, the director ban, a guarantee after the lease is given up", title: "Insolvency Act 1986, sections 178 and 214; Company Directors Disqualification Act 1986, section 6", url: "https://www.legislation.gov.uk/ukpga/1986/45/section/214" },
    ],
  },
  {
    key: "boe",
    publisher: "Bank of England",
    names: ["Bank of England"],
    attribution: null,
    items: [
      { prints: "Bank Rate", title: "Bank Rate history", url: "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp" },
      { prints: "The exchange rate every figure in pounds is converted at", title: "Spot rate of 1.3265 dollars a pound, 23 September 2026, series XUDLUSS", url: null },
      { prints: "The rate on new loans to small and medium firms", title: "Series CFMZ6LD, July 2026", url: null },
    ],
  },
  {
    key: "visitbritain",
    publisher: "VisitBritain",
    names: ["VisitBritain"],
    attribution: null,
    items: [
      { prints: "London's overseas overnight visits", title: "Inbound visits and spend: trends by UK town, 2024", url: "https://www.visitbritain.org/node/359" },
    ],
  },
  {
    key: "ukfinance",
    publisher: "UK Finance",
    names: ["UK Finance"],
    attribution: null,
    items: [
      { prints: "How payments in the UK are made", title: "UK Payment Markets 2026, summary (19 August 2026)", url: "https://www.ukfinance.org.uk/policy-and-guidance/reports/uk-payment-markets-2026" },
    ],
  },
  {
    key: "brc",
    publisher: "British Retail Consortium",
    names: ["British Retail Consortium"],
    attribution: null,
    items: [
      { prints: "How shoppers pay in shops", title: "BRC Payments Survey 2025 (12 December 2025)", url: "https://brc.org.uk/news-and-events/news/corporate-affairs/2025/ungated/high-interest-rates-push-shoppers-from-credit-to-debit-cards/" },
    ],
  },
  {
    /* The insolvency slice the London trade pages read since masterplan step 04 (data/uk/registers/failures.json; the register
       ledger's row uk.failures names the licence and the attribution line). */
    key: "gazette",
    publisher: "The Gazette",
    names: ["The Gazette"],
    attribution: OGL_LINE,
    items: [
      { prints: "How many companies of a trade became insolvent in a year, the UK's", title: "Company insolvency notices, October 2025 to September 2026, matched to the Companies House register of 1 May 2026", url: null },
    ],
  },
  {
    /* The bank wall of opening from abroad (masterplan step 27): no right to a business account, from the regulator's report. */
    key: "fca",
    publisher: "Financial Conduct Authority",
    names: ["Financial Conduct Authority"],
    attribution: null,
    items: [
      { prints: "Whether a bank must open an account for a business", title: "UK payment accounts: access and closures, update (September 2024)", url: "https://www.fca.org.uk/publication/corporate/uk-payment-accounts-access-closures-update.pdf" },
    ],
  },
  {
    key: "worldpanel",
    publisher: "Worldpanel by Numerator",
    names: ["Worldpanel by Numerator"],
    attribution: null,
    items: [
      { prints: "Who holds the grocery market", title: "Grocery market share, 12 weeks to 6 September 2026", url: "https://www.worldpanelbynumerator.com/" },
    ],
  },
  {
    key: "acas",
    publisher: "Acas",
    names: ["Acas"],
    attribution: null,
    items: [
      { prints: "Notice periods and the Employment Rights Act 2025", title: "Guidance pages", url: "https://www.acas.org.uk/employment-rights-act-2025" },
    ],
  },
  {
    key: "tpr",
    publisher: "The Pensions Regulator",
    names: ["The Pensions Regulator"],
    attribution: null,
    items: [
      { prints: "The earnings thresholds for workplace pensions", title: "Earnings thresholds", url: "https://www.thepensionsregulator.gov.uk/en/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds" },
    ],
  },
  {
    key: "startuploans",
    publisher: "Start Up Loans",
    names: ["Start Up Loans"],
    attribution: null,
    items: [
      { prints: "The government start-up loan's amounts, rate and term", title: "Guidance and changes to the interest rate", url: "https://www.startuploans.co.uk/" },
    ],
  },
  {
    key: "sellers",
    publisher: "Sellers' own pages",
    names: [],
    attribution: null,
    items: [
      { prints: "App fees, card reader prices and the kit to open a trade", title: "Each seller's own UK pricing page, read on the day stated in the file that holds it", url: null },
    ],
  },
];

/** THE HOME PAGE'S SOURCES OUTSIDE THE UNITED KINGDOM (plan 2026-10-08, home sections 2 and 3): named here, the one module allowed
 *  to name a source, and printed on About the figures under the UK's list. An attribution line prints only where the record names
 *  the licence (the rule above); each section's export names its entry by `key` (data/home/manifest.json), and its gate holds it. */
export const WORLD_SOURCES: readonly UkSource[] = [
  {
    key: "worldbank",
    publisher: "World Bank",
    names: ["World Bank"],
    attribution: null,
    items: [
      { prints: "New limited companies per 1,000 people of working age, in Latin America and in Africa, on the home page", title: "World Development Indicators: new business density (IC.BUS.NDNS.ZS), and the labour force (SL.TLF.TOTL.IN) that sets the list's floor", url: "https://data.worldbank.org/indicator/IC.BUS.NDNS.ZS" },
    ],
  },
];

/** The register slices the UK pages read (data/uk/registers/manifest.json), each to its publisher's entry. */
export const UK_REGISTER_SOURCE: Readonly<Record<string, string>> = {
  "turnover.json": "ons",
  "survival.json": "ons",
  "premises.json": "voa",
  "failures.json": "gazette",
};

/** The foot of every UK page: the licence sentence and the one link (his ruling of 2026-10-04 on R-002). */
export const UK_SOURCES_FOOT = { line: OGL_LINE, link: "Sources and licences", href: "/about-data#sources" } as const;
