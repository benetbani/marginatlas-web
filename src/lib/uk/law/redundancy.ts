/**
 * src/lib/uk/law/redundancy.ts
 *
 * Statutory redundancy pay and statutory notice (Employment Rights Act 1996, ss 86, 162), from 6 April 2026.
 *
 * REDUNDANCY. Two whole years of service needed. Counting back from the dismissal, each of the last (up to) 20 whole years
 * earns weeks of pay by the age held throughout that year: 0.5 below 22, 1 from 22 to 40, 1.5 from 41. With integer ages,
 * the k-th most recent year (k = 0, 1, ...) is held at age (ageAtDismissal - 1 - k) throughout. A week's pay is capped at
 * 751, so the most anyone can get is 30 x 751 = 22,530. Years and age are taken at the relevant date, which a dismissal
 * without the statutory notice moves to the day that notice would have ended (s 145(5)).
 *
 * NOTICE (the employer's minimum): none under a month; one week from a month to two years; then a week per whole year, up
 * to twelve.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

export function statutoryRedundancyPay(input: { ageAtDismissal: number; wholeYears: number; weeklyPay: number }): { weeks: number; weeklyPayUsed: number; pay: number } {
  // a part year would count as a whole one in the loop below, and an age that is not a number would pay every year at 1.5
  if (!Number.isFinite(input.ageAtDismissal) || input.ageAtDismissal < 0) throw new RangeError(`statutoryRedundancyPay: not an age (${input.ageAtDismissal})`);
  if (!Number.isInteger(input.wholeYears) || input.wholeYears < 0) throw new RangeError(`statutoryRedundancyPay: not a whole number of years (${input.wholeYears})`);
  if (!Number.isFinite(input.weeklyPay) || input.weeklyPay < 0) throw new RangeError(`statutoryRedundancyPay: not a week's pay (${input.weeklyPay})`);
  const r = L.redundancy;
  const weeklyPayUsed = Math.min(input.weeklyPay, r.weeklyPayCap);
  if (input.wholeYears < r.minYears) return { weeks: 0, weeklyPayUsed, pay: 0 };
  let weeks = 0;
  for (let k = 0; k < Math.min(input.wholeYears, r.maxYears); k++) {
    const age = input.ageAtDismissal - 1 - k;
    weeks += age < 22 ? r.weeksUnder22 : age < 41 ? r.weeks22To40 : r.weeks41Plus;
  }
  return { weeks, weeklyPayUsed, pay: pennies(weeks * weeklyPayUsed) };
}

export function statutoryNoticeWeeks(monthsOfService: number): number {
  if (!Number.isFinite(monthsOfService) || monthsOfService < 0) throw new RangeError(`statutoryNoticeWeeks: not a number of months (${monthsOfService})`);
  if (monthsOfService < 1) return 0;
  if (monthsOfService < 24) return 1;
  return Math.min(12, Math.floor(monthsOfService / 12));
}
