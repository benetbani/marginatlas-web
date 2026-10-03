/**
 * src/lib/uk/law/params_2026_27.ts
 *
 * Every UK legal parameter the vertical's formulas read, for the tax year 6 April 2026 to 5 April 2027 (England, and the
 * rest of the UK where the figure is UK-wide). One object, typed, each value with the page it was read on and the date.
 * A formula never types a rate or a threshold of its own: it reads it here, so a Budget change is one edit and one test run.
 *
 * Sources were read on 2026-10-02 (design/loop/build/research/2026-10-02-pro-sections-uk-law.md and
 * 2026-10-02-guides-hub-and-sources.md) and confirmed on 2026-10-03, every value with its quoted sentence and page, in
 * docs/uk-law/2026-27-readings.md. Scottish income tax bands are NOT here: a Scottish taxpayer's figures are out of
 * scope until a scottish block is added, and the functions say so by name (rUK).
 */
export const UK_2026_27 = {
  taxYear: "2026-27",
  incomeTax: {
    /** rUK (England, Wales, Northern Ireland) non-savings rates. https://www.gov.uk/income-tax-rates */
    personalAllowance: 12_570,
    /** The allowance falls by 1 pound for every 2 pounds of adjusted net income above this. */
    taperThreshold: 100_000,
    /** https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past (the rates page prints the band only as 12,571 to 50,270) */
    basicRateBand: 37_700,
    additionalRateThreshold: 125_140,
    basic: 0.2,
    higher: 0.4,
    additional: 0.45,
  },
  dividends: {
    /** https://www.gov.uk/tax-on-dividends (rates from 6 April 2026) */
    allowance: 500,
    basic: 0.1075,
    higher: 0.3575,
    additional: 0.3935,
  },
  class4: {
    /** https://www.gov.uk/self-employed-national-insurance-rates */
    lowerProfitsLimit: 12_570,
    upperProfitsLimit: 50_270,
    main: 0.06,
    additional: 0.02,
  },
  class1Primary: {
    /** https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 (annual earnings period) */
    primaryThreshold: 12_570,
    upperEarningsLimit: 50_270,
    main: 0.08,
    additional: 0.02,
  },
  class1Secondary: {
    /** same page; the 15% rate from the National Insurance Contributions (Secondary Class 1 Contributions) Act 2025, s.1: https://www.legislation.gov.uk/ukpga/2025/11/section/1 */
    secondaryThreshold: 5_000,
    /** under 21s, apprentices under 25 and veterans: 0% up to this */
    upperSecondaryThreshold: 50_270,
    rate: 0.15,
    employmentAllowance: 10_500,
  },
  pension: {
    /** thresholds for 2026-27: https://www.thepensionsregulator.gov.uk/en/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds ; the 3% employer minimum: https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay */
    trigger: 10_000,
    qualifyingLower: 6_240,
    qualifyingUpper: 50_270,
    employerMinimum: 0.03,
    /** aged between 22 and State Pension age: https://www.gov.uk/workplace-pensions/joining-a-workplace-pension */
    minAge: 22,
    /** State Pension age is 66 rising to 67 between 2026 and 2028 (https://www.gov.uk/government/publications/state-pension-age-timetable/state-pension-age-timetable); 66 is used, the change dated in the guide */
    statePensionAge: 66,
  },
  corporationTax: {
    /** rates and limits: https://www.gov.uk/corporation-tax-rates ; the standard fraction 3/200 for the year from 1 April 2026: https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax/rates-and-allowances-corporation-tax (the Marginal Relief guidance prints no fraction) */
    lowerLimit: 50_000,
    upperLimit: 250_000,
    smallProfitsRate: 0.19,
    mainRate: 0.25,
    marginalReliefFraction: 3 / 200,
  },
  businessRates: {
    /** England 2026-27. Multipliers: https://www.gov.uk/estimate-your-business-rates and the multipliers notification 2/2026; which uses qualify: https://www.gov.uk/guidance/business-rates-multipliers-qualifying-retail-hospitality-or-leisure */
    smallMultiplier: 0.432,
    standardMultiplier: 0.48,
    rhlSmallMultiplier: 0.382,
    rhlStandardMultiplier: 0.43,
    /** the small multipliers apply below this rateable value */
    smallThreshold: 51_000,
    /** at and above this the high-value multiplier applies (500,000 itself is high-value: https://www.gov.uk/estimate-your-business-rates); out of scope for street businesses, the function refuses it */
    highValueThreshold: 500_000,
    /** https://www.gov.uk/business-rates-relief/small-business-rate-relief */
    sbrrFullUpTo: 12_000,
    sbrrNoneFrom: 15_000,
  },
  leaseRentTax: {
    /** SDLT, non-residential lease rent: the 3.5% discount rate from Finance Act 2003 Sch 5 para 8(1); the bands from https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-rates */
    discountRate: 0.035,
    sdlt: [
      { upTo: 150_000, rate: 0 },
      { upTo: 5_000_000, rate: 0.01 },
      { upTo: Infinity, rate: 0.02 },
    ],
    /** Wales, Land Transaction Tax on rent. https://www.gov.wales/land-transaction-tax-rates-and-bands */
    ltt: [
      { upTo: 225_000, rate: 0 },
      { upTo: 2_000_000, rate: 0.01 },
      { upTo: Infinity, rate: 0.02 },
    ],
    /** the rent taken for every year after the fifth: the highest of the first five (Finance Act 2003 Sch 17A para 7(3); https://www.gov.uk/guidance/stamp-duty-land-tax-leasehold-purchases) */
    yearsBeforeHighestRule: 5,
  },
  redundancy: {
    /** https://www.gov.uk/redundancy-your-rights/redundancy-pay ; cap from 6 April 2026 (SI 2026/310) */
    weeklyPayCap: 751,
    maxYears: 20,
    minYears: 2,
    /** weeks of pay per whole year of service, by the age held throughout that year */
    weeksUnder22: 0.5,
    weeks22To40: 1,
    weeks41Plus: 1.5,
  },
  minimumWage: {
    /** from 1 April 2026. https://www.gov.uk/national-minimum-wage-rates */
    age21Plus: 12.71,
    age18To20: 10.85,
    under18: 8.0,
    apprentice: 8.0,
  },
} as const;

export type UkLaw = typeof UK_2026_27;
