/**
 * src/lib/uk/law/employer_cost.ts
 *
 * One hire, all in (Pro section 77): what a year of one employee costs the business, 2026-27.
 *
 *   allIn = gross + employerNi - allowanceUsed + pension
 *   employerNi = 15% x max(0, gross - 5,000), or 15% x max(0, gross - 50,270) under 21 and for apprentices under 25
 *   allowanceUsed = min(allowance still unspent this year, employerNi)        (0 for a company whose only employee is its director)
 *   pension = 3% x max(0, min(gross, 50,270) - 6,240) when aged 22 to State Pension age and gross over 10,000
 *
 * gross already contains the 5.6 weeks of paid holiday. Statutory sick, maternity and paternity pay are contingent costs in
 * the weeks they happen and are not in the yearly figure (stated). Employers' liability insurance has no official price and
 * is not in it either.
 *
 * Each line is rounded to the penny and allIn is the sum of the rounded lines, so the bill adds up.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { employerClass1 } from "./national_insurance";
import { pennies, sumPennies } from "./money";

export function annualGross(hourly: number, hoursPerWeek: number, weeks = 52): number {
  return pennies(hourly * hoursPerWeek * weeks);
}

export type HireCost = { gross: number; employerNi: number; allowanceUsed: number; pension: number; allIn: number };

/**
 * One hire's yearly cost to the employer. Auto-enrolment follows Pensions Act 2008 s.3(1): aged at least 22, below State
 * Pension age, earnings of more than 10,000. An age that is not a number and a negative pay are refused.
 */
export function hireAllIn(input: { gross: number; age: number; apprentice?: boolean; allowanceRemaining?: number }): HireCost {
  if (!Number.isFinite(input.age) || input.age < 0) throw new RangeError(`hireAllIn: not an age (${input.age})`);
  if (input.gross < 0) throw new RangeError(`hireAllIn: pay cannot be negative (${input.gross})`);
  const gross = pennies(input.gross);
  const relief = input.age < 21 || (!!input.apprentice && input.age < 25);
  const employerNi = employerClass1(gross, { reliefToUpperSecondary: relief });
  const allowanceUsed = pennies(Math.min(Math.max(0, input.allowanceRemaining ?? 0), employerNi));
  const p = L.pension;
  const enrolled = input.age >= p.minAge && input.age < p.statePensionAge && gross > p.trigger;
  const pension = enrolled ? pennies(p.employerMinimum * Math.max(0, Math.min(gross, p.qualifyingUpper) - p.qualifyingLower)) : 0;
  return { gross, employerNi, allowanceUsed, pension, allIn: sumPennies([gross, employerNi, -allowanceUsed, pension]) };
}
