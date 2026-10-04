/**
 * src/lib/uk/law/national_insurance.ts
 *
 * National Insurance, 2026-27, on an annual basis: Class 4 on a sole trader's profit, Class 1 primary on an employee's
 * pay (a director's annual earnings period), Class 1 secondary (the employer's) with the under-21 and apprentice relief,
 * and the Employment Allowance as a business-wide budget.
 *
 * Payroll applies the thresholds per pay period (96 a week, 417 a month), which moves the annual figure by about a pound
 * on 30,000 of pay; the vertical prints yearly figures, so the annual basis is the one used and the difference is stated.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { bandedTax, pennies, sumPennies } from "./money";

function finite(x: number, what: string): void {
  if (!Number.isFinite(x)) throw new RangeError(`${what}: not a finite amount (${x})`);
}

/** Class 4 on a sole trader's annual profit; a loss pays nothing. */
export function class4(profit: number): number {
  finite(profit, "class4");
  const c = L.class4;
  return bandedTax(Math.max(0, profit), [
    { upTo: c.lowerProfitsLimit, rate: 0 },
    { upTo: c.upperProfitsLimit, rate: c.main },
    { upTo: Infinity, rate: c.additional },
  ]);
}

/** Class 1 primary on an employee's annual pay (the director's annual earnings period); no pay pays nothing. */
export function employeeClass1(pay: number): number {
  finite(pay, "employeeClass1");
  const c = L.class1Primary;
  return bandedTax(Math.max(0, pay), [
    { upTo: c.primaryThreshold, rate: 0 },
    { upTo: c.upperEarningsLimit, rate: c.main },
    { upTo: Infinity, rate: c.additional },
  ]);
}

/**
 * The employer's NI on one employee's annual pay, before the Employment Allowance. `reliefToUpperSecondary` is for an
 * employee under 21, an apprentice under 25 or a veteran in their first year: 0% up to the upper secondary threshold.
 */
export function employerClass1(pay: number, opts: { reliefToUpperSecondary?: boolean } = {}): number {
  finite(pay, "employerClass1");
  const c = L.class1Secondary;
  const from = opts.reliefToUpperSecondary ? c.upperSecondaryThreshold : c.secondaryThreshold;
  return pennies(Math.max(0, pay - from) * c.rate);
}

/**
 * The Employment Allowance is one budget for the whole business (the year's amount is in params_2026_27.ts), spent
 * against the employer's NI of all staff together, so how it is "allocated" between employees does not change the bill:
 *   netEmployerNi = max(0, sum of employer NI - allowance), when the business can claim it.
 * The bill is the sum of its rounded lines (money.ts). A company whose only employee paid above the secondary threshold
 * is its single director cannot claim it; the caller says so with `canClaim`.
 */
export function employerNiAfterAllowance(employerNiByEmployee: readonly number[], canClaim: boolean): { gross: number; allowanceUsed: number; net: number } {
  for (const x of employerNiByEmployee) {
    finite(x, "employerNiAfterAllowance");
    if (x < 0) throw new RangeError(`employerNiAfterAllowance: an employer NI bill cannot be negative (${x})`);
  }
  const gross = sumPennies(employerNiByEmployee);
  const allowanceUsed = canClaim ? Math.min(L.class1Secondary.employmentAllowance, gross) : 0;
  return { gross, allowanceUsed, net: pennies(gross - allowanceUsed) };
}
