/**
 * src/lib/uk/law/redundancy.ts
 *
 * Statutory redundancy pay and statutory notice (Employment Rights Act 1996, ss 86, 145, 155, 162, 210 and 227), from
 * 6 April 2026.
 *
 * REDUNDANCY. Two whole years of service needed (s 155). Counting back from the relevant date (the last day of employment,
 * which a dismissal without the statutory notice moves to the day that notice would have ended, s 145(5)), each of the
 * last (up to) 20 whole years earns weeks of pay by the age held throughout that year: 0.5 below 22, 1 from 22 to 40, 1.5
 * from 41 (s 162); there is no upper age. The years run between anniversaries of the day after the relevant date (years of
 * twelve months, s 210(3)), so the age held throughout the k-th most recent year (k = 0, 1, ...) is the age on its first
 * day, which is exactly ageAtDismissal - 1 - k when ageAtDismissal is the age on the day after the relevant date. (The age
 * on the last day itself is one too low on the eve of a birthday: someone whose last day is 31 December and who turns 42
 * on 1 January was 41 all that year, worth 1.5 weeks, not 1.) A week's pay is capped at 751 (s 227), so the most anyone
 * can get is 30 x 751 = 22,530.
 *
 * NOTICE (the employer's minimum, s 86): none under a month; one week from a month to two years; then a week per whole
 * year, up to twelve.
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
