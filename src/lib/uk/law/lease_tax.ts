/**
 * src/lib/uk/law/lease_tax.ts
 *
 * Tax on the rent of a new non-residential lease: SDLT in England (and Northern Ireland), LTT in Wales.
 *
 *   NPV = sum over years i = 1..n of r_i / (1 + 3.5%)^i
 * where r_i is the rent payable for year i, except that every year after the fifth takes the highest rent of the first five
 * (the rule HMRC's own calculator applies). VAT on the rent is part of the rent when the landlord has opted to tax.
 * Then the tax is banded on the NPV: SDLT 0% to 150,000, 1% to 5,000,000, 2% above; LTT 0% to 225,000, 1% to 2,000,000,
 * 2% above. A lease premium is taxed separately and is out of scope here.
 *
 * Worked (tests): 25,000 a year for 10 years, NPV 207,915.13, SDLT 579.15; for 5 years, NPV 112,876.31, no SDLT.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { bandedTax, pennies } from "./money";

/** The net present value of a lease's rent, year by year; a rent that is negative or not a number is refused. */
export function leaseRentNpv(yearlyRents: readonly number[]): number {
  const t = L.leaseRentTax;
  for (const r of yearlyRents) {
    if (!Number.isFinite(r) || r < 0) throw new RangeError(`leaseRentNpv: not a yearly rent (${r})`);
  }
  if (yearlyRents.length === 0) return 0;
  const early = yearlyRents.slice(0, t.yearsBeforeHighestRule);
  const highest = Math.max(...early);
  let npv = 0;
  yearlyRents.forEach((r, i) => {
    const rent = i < t.yearsBeforeHighestRule ? r : highest;
    npv += rent / Math.pow(1 + t.discountRate, i + 1);
  });
  return pennies(npv);
}

export function sdltOnLeaseRent(npv: number): number {
  return bandedTax(npv, L.leaseRentTax.sdlt);
}

export function lttOnLeaseRent(npv: number): number {
  return bandedTax(npv, L.leaseRentTax.ltt);
}
