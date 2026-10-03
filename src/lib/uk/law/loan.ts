/**
 * src/lib/uk/law/loan.ts
 *
 * The repayment of a fixed-rate loan repaid monthly over n months (an annuity):
 *   payment = A x r / (1 - (1 + r)^-n),   r = annualRatePct / 100 / 12;   payment = A / n when r = 0.
 * Derivation: the present value of n payments of size x at rate r is x (1 - (1 + r)^-n) / r; set it equal to A.
 * The denominator is computed as -expm1(-n log1p(r)), since (1 + r)^-n = exp(-n ln(1 + r)): the same number, but it keeps
 * its digits when r is tiny. The plain form keeps only the digits of r that survive in 1 + r: it is wrong by pounds long
 * before it divides by zero (417.00 a month for 416.67 at 1e-10 %, on 25,000 over five years), so guarding 1 + r === 1
 * would not repair it. (The two forms agree to the penny on 540,000 loans of 1 to 360 months at 0.1% to 30%.)
 * The total repaid is n x the exact payment, rounded once: the one printed total here that is not the sum of its rounded
 * lines (60 x 500.95 is 30,057.00, 8p over the 30,056.92 printed). A lender's schedule pays the rounded payment and settles
 * the pennies in the last one: on the worked example, each month's interest rounded to the penny, 59 x 500.95 and a last
 * 500.91, 4p more in all.
 */
import { pennies } from "./money";

export function annuity(input: { principal: number; annualRatePct: number; months: number }): { monthly: number; totalRepaid: number; interest: number } {
  const { principal: A, annualRatePct, months: n } = input;
  if (!Number.isFinite(A) || A < 0) throw new RangeError(`annuity: not a principal (${A})`);
  if (!Number.isFinite(annualRatePct) || annualRatePct < 0) throw new RangeError(`annuity: not an annual rate (${annualRatePct})`);
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`annuity: not a whole number of months, at least one (${n})`);
  const r = annualRatePct / 100 / 12;
  const exact = r === 0 ? A / n : (A * r) / -Math.expm1(-n * Math.log1p(r));
  const totalRepaid = pennies(exact * n);
  return { monthly: pennies(exact), totalRepaid, interest: pennies(totalRepaid - A) };
}
