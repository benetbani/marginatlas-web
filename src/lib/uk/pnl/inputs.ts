/**
 * src/lib/uk/pnl/inputs.ts
 *
 * A trade's money inputs in one place, from a recipe: measured lines where the registers or the law give them, the trade
 * research's shares only where nothing better exists, each line carrying its kind and its basis.
 *
 * PREMISES, from the official valuation statistics for the trade's kind of premises in the place:
 *   average area      area = floorspace / count                        (worked out)
 *   rateable value    RV_A = rv_per_m2 x area                          (worked out; the valuation's estimate of a year's rent at
 *                                                                       1 April 2021, so a rent proxy dated 2021)
 * ANCHOR SALES, the business that occupies the average premises under the size rule (model.ts): the mean sales of the
 *   registered businesses below 5m (banded.ts bandMeanK), worked out from the counted bands.
 * THE RECIPE says which costs move with each pound of sales (variable) and which are sized by the business's sales across
 * businesses but fixed within one (sized: staff, running costs). Rent and rates are never in a recipe: a trade researched
 * at "rent 15% of sales" prints its place's measured rent.
 */
import { pennies } from "../law/money";
import { bandMeanK } from "./banded";
import type { Kind } from "./kinds";
import type { Form, PnlInputs } from "./model";

export type PremisesRow = { rv_per_m2: number; count: number; floorspace_k_m2: number };
/** One recipe line: `driver` is the research cost driver it carries, by its exact name in the research file. */
export type RecipeShare = { key: string; driver: string; shareOfSales: number; kind: Kind; basis: string };
export type Recipe = {
  trade: string;
  research: string;
  retailHospitalityLeisure: boolean;
  utilitiesCarried: boolean;
  variable: readonly RecipeShare[];
  sized: readonly RecipeShare[];
};

export function premisesFromValuation(row: PremisesRow): { areaM2: number; rateableValue: number } {
  if (!(row.count > 0 && row.floorspace_k_m2 > 0 && row.rv_per_m2 > 0)) throw new Error("premisesFromValuation: an empty valuation row");
  const areaM2 = (row.floorspace_k_m2 * 1000) / row.count;
  return { areaM2, rateableValue: pennies(row.rv_per_m2 * areaM2) };
}

export function anchorSalesFromBands(revenueBandsK: readonly number[]): number | null {
  const m = bandMeanK(revenueBandsK);
  return m === null ? null : pennies(m.k * 1000);
}

export function buildInputs(
  recipe: Recipe,
  ctx: { revenueBandsK: readonly number[]; premises: PremisesRow; premisesCategory: string; place: string; form: Form },
): PnlInputs {
  const { areaM2, rateableValue } = premisesFromValuation(ctx.premises);
  const anchor = anchorSalesFromBands(ctx.revenueBandsK);
  if (anchor === null) throw new Error(`buildInputs: no registered ${recipe.trade} businesses below 5m in ${ctx.place}`);
  const share = (x: RecipeShare) => ({ key: x.key, share: x.shareOfSales, kind: x.kind, source: `${x.basis} (${recipe.research})` });
  return {
    revenueBandsK: ctx.revenueBandsK,
    variable: recipe.variable.map(share),
    sized: recipe.sized.map(share),
    premises: {
      rateableValue,
      areaM2,
      retailHospitalityLeisure: recipe.retailHospitalityLeisure,
      kind: "worked out",
      source: `the official estimate of a year's rent for the average ${ctx.premisesCategory.toLowerCase()} premises in ${ctx.place} (${Math.round(areaM2)} m2), April 2021 valuation`,
    },
    anchorSales: { value: anchor, kind: "worked out", source: `the mean sales of the registered businesses under 5m in ${ctx.place}` },
    form: ctx.form,
  };
}
