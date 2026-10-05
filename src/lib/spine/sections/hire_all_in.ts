/**
 * src/lib/spine/sections/hire_all_in.ts
 *
 * ONE HIRE, ALL IN (milestone 2, masterplan step 22; his ruling 28 of 2026-09-26, the first Pro sections; DATA-REQUIREMENTS
 * item 77). What one hire costs the business for every hour they actually work, all in, and what letting them go costs after
 * 1, 3 and 10 years: computed by the law engine (src/lib/uk/law), never read off a sentence, and tested against the research's
 * worked examples (design/loop/build/research/2026-10-02-pro-sections-uk-law.md, 77.4 A and B, 76.5, 76.8 D).
 *
 *   the year:      gross at the National Living Wage for a 37.5-hour week, 52 weeks (holiday is paid time inside it);
 *                  all in = gross + employer NIC - the Employment Allowance used + the employer's pension minimum (hireAllIn)
 *   the hour:      all in over the hours worked, 52 weeks less the 5.6 weeks of statutory holiday at 37.5 hours (1,740)
 *   the parting:   statutory redundancy (none under two years' service) plus statutory notice paid in lieu, at the same
 *                  week's pay, for a worker aged 35 (every year of service then earns one week, 22 to 40)
 *   the extras:    the law's own amounts the page prints nowhere else: the right-to-work penalty per worker, and the most
 *                  statutory redundancy can cost
 *
 * Computed money is given in pounds and in dollars through the site's FX module (src/lib/finance/fx.ts), as the staff card
 * prints its money; a law's own amounts stay in pounds. Not in the figure: employers' liability insurance (no official price;
 * the insurance card holds the duty), and sick, maternity and paternity pay, which fall only in the weeks they happen.
 */
import type { FactRow } from "@/components/spine/archetypes/FactRows";
import { convertToUsd } from "@/lib/finance/fx";
import type { Provenance } from "@/lib/spine/provenance";
import { annualGross, hireAllIn } from "@/lib/uk/law/employer_cost";
import { pennies, sumPennies } from "@/lib/uk/law/money";
import { UK_2026_27 as L } from "@/lib/uk/law/params_2026_27";
import { statutoryNoticeWeeks, statutoryRedundancyPay } from "@/lib/uk/law/redundancy";

/** The research's example A: a full-time week (77.4). */
export const HIRE_WEEK_HOURS = 37.5;
/** The age the parting bill is stated for: every year of service from 1 to 10 then earns one week (s.162, 22 to 40). */
export const PARTING_AGE = 35;
export const PARTING_YEARS = [1, 3, 10] as const;

export type Money = { gbp: number; usd: number | null; prov: Provenance };
export type HireAllIn = {
  gross: Money;
  allIn: Money;
  workedHours: number;
  perWorkedHour: Money;
  parting: Array<{ years: (typeof PARTING_YEARS)[number]; redundancy: number; notice: number } & Money>;
  extras: FactRow[];
};

const money = (gbp: number, src: string): Money => ({ gbp, usd: convertToUsd("GBP", gbp), prov: { src, kind: "worked out" } });
const gbpText = (n: number) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

/** The parting bill for one worker: statutory redundancy (s.155, s.162, s.227) plus statutory notice (s.86) paid in lieu. */
export function partingBill(input: { weeklyPay: number; age: number; years: number }): { redundancy: number; notice: number; total: number } {
  const redundancy = statutoryRedundancyPay({ ageAtDismissal: input.age, wholeYears: input.years, weeklyPay: input.weeklyPay }).pay;
  const notice = pennies(statutoryNoticeWeeks(input.years * 12) * input.weeklyPay);
  return { redundancy, notice, total: sumPennies([redundancy, notice]) };
}

export function buildHireAllIn(opts: { gross?: number; allowance: boolean }): HireAllIn {
  const hourly = L.minimumWage.age21Plus;
  const gross = opts.gross ?? annualGross(hourly, HIRE_WEEK_HOURS);
  const basis = opts.gross == null ? "national living wage, 37.5 hours" : `${opts.gross} a year`;
  const cost = hireAllIn({ gross, age: PARTING_AGE, allowanceRemaining: opts.allowance ? L.class1Secondary.employmentAllowance : 0 });
  const workedHours = pennies((52 - L.holiday.weeks) * HIRE_WEEK_HOURS);
  const weeklyPay = gross / 52;
  const src = `uk/law/employer_cost.ts:hireAllIn:${basis}:${opts.allowance ? "with the allowance" : "without the allowance"}`;
  /* The most statutory redundancy can cost: twenty years, every one at 41 or over, at the capped week (s.162, s.227). */
  const redundancyCap = statutoryRedundancyPay({ ageAtDismissal: 61, wholeYears: L.redundancy.maxYears, weeklyPay: L.redundancy.weeklyPayCap }).pay;
  return {
    gross: money(cost.gross, `uk/law/employer_cost.ts:annualGross:${basis}`),
    allIn: money(cost.allIn, src),
    workedHours,
    perWorkedHour: money(pennies(cost.allIn / workedHours), `${src}:per worked hour`),
    parting: PARTING_YEARS.map((years) => {
      const bill = partingBill({ weeklyPay, age: PARTING_AGE, years });
      return { years, redundancy: bill.redundancy, notice: bill.notice, ...money(bill.total, `uk/law/redundancy.ts:redundancy and notice:${basis}:${years} years`) };
    }),
    /* The law's own amounts the page prints nowhere else: /gb already prints the sick-pay rate (its rule changes), the paid
       holiday (the employment card) and the pension minimum (the staff card), so they are not repeated here. */
    extras: [
      { key: "right-to-work", icon: "red-tape", label: "Right-to-work fine", value: gbpText(L.rightToWork.penaltyFirst), note: `Per worker, ${gbpText(L.rightToWork.penaltyRepeat)} if repeated`, prov: { src: "uk/law/params_2026_27.ts:rightToWork.penaltyFirst", kind: "looked up" } },
      { key: "redundancy-cap", icon: "closing", label: "Redundancy at most", value: gbpText(redundancyCap), note: "Twenty years, all at 41 or over", prov: { src: "uk/law/redundancy.ts:statutoryRedundancyPay:the cap", kind: "worked out" } },
    ],
  };
}
