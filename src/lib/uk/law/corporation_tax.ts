/**
 * src/lib/uk/law/corporation_tax.ts
 *
 * Corporation Tax, financial year 2026, for a single company with no associated companies and a 12-month accounting
 * period (the limits are divided by associated companies and shortened for short periods; both out of scope, stated).
 *
 *   P <= 50,000                 tax = 19% x P
 *   50,000 < P <= 250,000       tax = 25% x P - (3/200) x (250,000 - P)          (marginal relief)
 *   P > 250,000                 tax = 25% x P
 *
 * Between the limits the formula is 0.265 x P - 3,750, so the marginal rate there is 26.5% and the effective rate climbs
 * from 19% to 25%. It is continuous at both limits (9,500 at 50,000; 62,500 at 250,000), which the tests assert.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies } from "./money";

/** Corporation tax on a year's taxable profit; a loss or no profit pays nothing; a profit that is not finite is refused. */
export function corporationTax(profit: number): number {
  if (!Number.isFinite(profit)) throw new RangeError(`corporationTax: not a finite profit (${profit})`);
  const c = L.corporationTax;
  if (profit <= 0) return 0;
  if (profit <= c.lowerLimit) return pennies(c.smallProfitsRate * profit);
  if (profit <= c.upperLimit) return pennies(c.mainRate * profit - c.marginalReliefFraction * (c.upperLimit - profit));
  return pennies(c.mainRate * profit);
}
