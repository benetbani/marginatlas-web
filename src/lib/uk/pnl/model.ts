/**
 * src/lib/uk/pnl/model.ts
 *
 * The money of one trade in one place, built from parts a reader can check, instead of a curated margin.
 *
 * TWO QUESTIONS, TWO READINGS OF THE SAME COSTS. The register's quartiles are different businesses of different sizes, so
 * a business's costs cannot be held fixed across them: a restaurant taking 125k does not employ the crew of one taking
 * 600k or rent its room. One rule sizes them, THE SIZE RULE: across businesses, premises, staff and running costs grow in
 * proportion to sales. It is anchored where the premises are measured:
 *
 *   anchor sales      A    the mean sales of the registered businesses below 5m (banded.ts bandMeanK)
 *   average premises       rent proxy RV_A (the valuation's average premises of the trade's kind in the place), whose
 *                          occupier, under the size rule, is the business with the mean sales
 *   variable share    v    each pound of sales spent on goods, supplies, commission, delivery fees
 *   sized share       s    staff and running costs, a share of the sales of a business of any size
 *
 * ACROSS BUSINESSES (the quartiles: what owners of different sizes keep):
 *   rent proxy        RV(R) = RV_A x R / A
 *   business rates    rates(RV(R)), the law on the scaled value: small business relief and the 51,000 step apply
 *   profit            P(R) = R - v R - s R - RV(R) - rates(RV(R)), every line rounded first (parts add to the bill)
 *   owner keeps       K(R) = P - tax(P) when P > 0; P when P <= 0 (a loss is a loss; no tax on it)
 *
 * ONE BUSINESS, SHORT RUN (break-even: the business in the average premises cannot shed its crew when sales dip):
 *   fixed costs       F_A = s A + RV_A + rates(RV_A)
 *   break-even        R* = F_A / (1 - v)
 *   share above it    1 - cdf(R*): the registered businesses taking at least what the average premises needs
 *   At its own sales A the two readings agree: P(A) = (1 - v) A - F_A.
 *
 * THE QUARTILE FIGURES are the take-home of the business AT each sales quartile. P is increasing in R except where the law
 * steps (rates rise by 2,448 at a rateable value of 51,000) and steepens (the relief taper between 12,000 and 15,000), so
 * near those points this is not exactly the quartile of take-home; the label says "the business at", which it is.
 *
 * WHAT IT CANNOT SEE: businesses outside the register; costs other than the recipe's lines; the costs' own spread (one set
 * of shares, not a distribution); premises whose size does not follow sales (a large room for small takings, or the
 * reverse); the valuation's premises and the register's businesses are different counts of different things, so the
 * anchor is the best match available, not a measured pairing. The company form assumes the director is the company's only
 * employee, so no Employment Allowance: a company with staff can claim it, and then keeps more (the median London
 * barbershop as a company: 24,343.99 without the allowance, 25,164.87 with it).
 *
 * A QUARTILE IN AN OPEN BAND (under 50k or over 50m) rests on the 5k floor or the 100m cap, so its sales print only in
 * words, and so does any money of the business at it: sales.open says which quartiles do.
 */
import { bandCdf, bandQuantile, type BandShape } from "./banded";
import { combineKinds, type Kind } from "./kinds";
import { pennies, sumPennies } from "../law/money";
import { businessRates } from "../law/business_rates";
import { bestCompanyTakeHome, soleTraderTakeHome } from "../law/take_home";

export type Form = "sole trader" | "company";
export type Share = { key: string; share: number; kind: Kind; source: string };
export type Line = { key: string; amount: number; kind: Kind; source: string };
export type Premises = { rateableValue: number; areaM2: number; retailHospitalityLeisure: boolean; kind: Kind; source: string };
export type PnlInputs = {
  revenueBandsK: readonly number[];
  variable: readonly Share[];
  sized: readonly Share[];
  premises: Premises;
  anchorSales: { value: number; kind: Kind; source: string };
  form: Form;
};

const total = (shares: readonly Share[]) => shares.reduce((a, x) => a + x.share, 0);

function check(inputs: PnlInputs): void {
  const v = total(inputs.variable), s = total(inputs.sized);
  if (!(v >= 0 && s >= 0 && v + s < 1)) throw new Error("model: shares must be non-negative and leave something of each pound");
  if (!(inputs.anchorSales.value > 0)) throw new Error("model: the anchor's sales must be positive");
}

/** One business's year at sales R under the size rule, each line rounded first. */
export function billAt(sales: number, inputs: PnlInputs): Line[] {
  check(inputs);
  const rv = pennies((inputs.premises.rateableValue * sales) / inputs.anchorSales.value);
  const rates = businessRates({ rateableValue: rv, retailHospitalityLeisure: inputs.premises.retailHospitalityLeisure }).bill;
  return [
    ...inputs.variable.map((x) => ({ key: x.key, amount: pennies(x.share * sales), kind: x.kind, source: x.source })),
    ...inputs.sized.map((x) => ({ key: x.key, amount: pennies(x.share * sales), kind: x.kind, source: x.source })),
    {
      key: "rent",
      amount: rv,
      kind: combineKinds([inputs.premises.kind, inputs.anchorSales.kind]),
      // at any sales but the anchor's the amount is the average premises scaled by the size rule, and the words say so
      source: sales === inputs.anchorSales.value
        ? inputs.premises.source
        : `${inputs.premises.source}, scaled to this business's sales: ${Math.round((inputs.premises.areaM2 * sales) / inputs.anchorSales.value)} m2 at the same rent per m2 (the size rule)`,
    },
    { key: "business rates", amount: rates, kind: combineKinds([inputs.premises.kind, inputs.anchorSales.kind, "looked up"]), source: `2026-27 rates on a rateable value of ${Math.round(rv).toLocaleString("en-GB")}` },
  ];
}

export function profitAt(sales: number, inputs: PnlInputs): number {
  return pennies(sales - sumPennies(billAt(sales, inputs).map((l) => l.amount)));
}

export function keepsOfProfit(profit: number, form: Form): number {
  if (profit <= 0) return profit;
  return form === "sole trader" ? soleTraderTakeHome(profit).takeHome : bestCompanyTakeHome(profit).takeHome;
}

export function keepsAt(sales: number, inputs: PnlInputs): number {
  return keepsOfProfit(profitAt(sales, inputs), inputs.form);
}

/** The fixed costs of the business in the average premises, a year: its crew and running costs, rent and rates. */
export function anchorFixed(inputs: PnlInputs): number {
  const a = inputs.anchorSales.value;
  return sumPennies(billAt(a, inputs).slice(inputs.variable.length).map((l) => l.amount));
}

export function breakEvenSales(inputs: PnlInputs): number {
  return pennies(anchorFixed(inputs) / (1 - total(inputs.variable)));
}

/** The share of registered businesses whose sales clear the break-even, the bands read under `shape` (log-flat by default). */
export function shareAboveBreakEven(inputs: PnlInputs, shape: BandShape = "log-flat"): number | null {
  const cdf = bandCdf(inputs.revenueBandsK, breakEvenSales(inputs) / 1000, shape);
  return cdf === null ? null : 1 - cdf;
}

/** What `extra` more cost a year takes from the owner after tax, for the business at `sales` (the marginal view a lever shows). */
export function afterTaxCostOf(extra: number, sales: number, inputs: PnlInputs): number {
  const p = profitAt(sales, inputs);
  return pennies(keepsOfProfit(p, inputs.form) - keepsOfProfit(pennies(p - extra), inputs.form));
}

export type PnlSummary = {
  sales: { q25: number; q50: number; q75: number; open: { q25: boolean; q50: boolean; q75: boolean }; kind: Kind };
  anchor: { sales: number; fixed: number; kind: Kind };
  breakEven: { value: number; kind: Kind };
  shareAbove: { value: number; kind: Kind } | null;
  medianBill: { lines: Line[]; profit: number };
  marginAtMedian: number;
  keeps: { q25: number; q50: number; q75: number; kind: Kind };
};

/** The headline figures, the register's bands read under `shape` (log-flat, the figure a page prints, by default; ranges.ts
 *  reads them under all three). */
export function summarise(inputs: PnlInputs, shape: BandShape = "log-flat"): PnlSummary | null {
  check(inputs);
  const q = (p: number) => bandQuantile(inputs.revenueBandsK, p, shape);
  const q25 = q(0.25), q50 = q(0.5), q75 = q(0.75);
  if (!q25 || !q50 || !q75) return null;
  const s25 = pennies(q25.k * 1000), s50 = pennies(q50.k * 1000), s75 = pennies(q75.k * 1000);
  const costKind = combineKinds([...inputs.variable.map((x) => x.kind), ...inputs.sized.map((x) => x.kind), inputs.premises.kind, inputs.anchorSales.kind]);
  const share = shareAboveBreakEven(inputs, shape);
  const profit50 = profitAt(s50, inputs);
  return {
    sales: {
      q25: s25, q50: s50, q75: s75,
      open: { q25: q25.openBelow || q25.openAbove, q50: q50.openBelow || q50.openAbove, q75: q75.openBelow || q75.openAbove },
      kind: combineKinds(["counted"]),
    },
    anchor: { sales: inputs.anchorSales.value, fixed: anchorFixed(inputs), kind: costKind },
    breakEven: { value: breakEvenSales(inputs), kind: costKind },
    shareAbove: share === null ? null : { value: share, kind: combineKinds(["counted", costKind]) },
    medianBill: { lines: billAt(s50, inputs), profit: profit50 },
    marginAtMedian: profit50 / s50,
    keeps: { q25: keepsAt(s25, inputs), q50: keepsAt(s50, inputs), q75: keepsAt(s75, inputs), kind: combineKinds(["counted", costKind, "looked up"]) },
  };
}
