/**
 * src/lib/uk/law/income_tax.ts
 *
 * Income tax for an rUK taxpayer (England, Wales, Northern Ireland), 2026-27, on non-savings income (trading profit,
 * salary) and dividends. Savings income is out of scope (a street business owner's figures do not need it).
 *
 * THE ORDER, as the law sets it: the personal allowance is set against non-savings income first, then dividends; the bands
 * are filled by non-savings income first and dividends sit on top (the top slice). The first 500 pounds of dividends are
 * taxed at 0% but still use up band.
 *
 * THE TAPER: the allowance falls by 1 pound for every 2 pounds of adjusted net income above 100,000, so it is zero from
 * 125,140. Read as "1 pound for every complete 2 pounds", the reduction is floor(excess / 2).
 *
 * Every band's tax is rounded to the penny and the lines summed, so the breakdown adds up to the total.
 */
import { UK_2026_27 as L } from "./params_2026_27";
import { pennies, sumPennies } from "./money";

const IT = L.incomeTax;
const DV = L.dividends;

export function personalAllowance(adjustedNetIncome: number): number {
  if (adjustedNetIncome <= IT.taperThreshold) return IT.personalAllowance;
  const reduction = Math.floor((adjustedNetIncome - IT.taperThreshold) / 2);
  return Math.max(0, IT.personalAllowance - reduction);
}

/** Tax on `amount` of income placed in the bands starting at `start` (taxable income already below it). */
function fill(start: number, amount: number, rates: readonly [number, number, number]): number[] {
  const edges = [0, IT.basicRateBand, IT.additionalRateThreshold, Infinity];
  const lines: number[] = [];
  let pos = start;
  let left = amount;
  for (let i = 0; i < 3 && left > 0; i++) {
    if (pos >= edges[i + 1]) continue;
    const take = Math.min(left, edges[i + 1] - Math.max(pos, edges[i]));
    lines.push(take * rates[i]);
    pos += take;
    left -= take;
  }
  return lines;
}

export type IncomeTaxBreakdown = {
  allowance: number;
  taxableNonSavings: number;
  taxableDividends: number;
  nonSavingsTax: number;
  dividendTax: number;
  total: number;
};

export function incomeTax(nonSavings: number, dividends = 0): IncomeTaxBreakdown {
  if (nonSavings < 0 || dividends < 0) throw new Error("incomeTax: income cannot be negative");
  const allowance = personalAllowance(nonSavings + dividends);
  const paNonSavings = Math.min(allowance, nonSavings);
  const paDividends = Math.min(allowance - paNonSavings, dividends);
  const taxableNonSavings = nonSavings - paNonSavings;
  const taxableDividends = dividends - paDividends;
  const nonSavingsTax = sumPennies(fill(0, taxableNonSavings, [IT.basic, IT.higher, IT.additional]));
  const free = Math.min(DV.allowance, taxableDividends);
  const dividendTax = sumPennies(fill(taxableNonSavings + free, taxableDividends - free, [DV.basic, DV.higher, DV.additional]));
  return {
    allowance,
    taxableNonSavings,
    taxableDividends,
    nonSavingsTax,
    dividendTax,
    total: pennies(nonSavingsTax + dividendTax),
  };
}
