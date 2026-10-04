/**
 * src/lib/uk/pnl/london.ts
 *
 * The money of a trade in London, from the register slices (data/uk/registers) and the trade's recipe. Server-side only:
 * turnover.json is two megabytes and never belongs in a client bundle.
 *
 * Withholds, never guesses, and says why (londonWithholding): no recipe; no London bands for the trade's code; under 40
 * businesses in London on the register (the register's own floor: no quantile prints there); no kind of premises for the
 * trade; a kind of premises that averages over unlike occupiers (shops, offices); or under 100 premises
 * of that kind in London, where the valuation's rounding (counts to 10, floorspace to 1,000 m2) moves the average area by
 * more than a tenth.
 */
import turnoverJson from "../../../../data/uk/registers/turnover.json";
import premisesJson from "../../../../data/uk/registers/premises.json";
import { buildInputs, type PremisesRow } from "./inputs";
import { RECIPES } from "./recipes";
import { summarise, type Form, type PnlInputs, type PnlSummary } from "./model";
import { shapeRanges, type PnlRanges } from "./ranges";

type TurnoverFile = { trades: Record<string, { by_geography: Record<string, { turnover_bands_k: number[] | null; thin: boolean; enterprises: number }> }> };
type PremisesFile = { trade_category: Record<string, string>; rows: Record<string, { categories: Record<string, Partial<PremisesRow>> }> };
const TURNOVER = turnoverJson as unknown as TurnoverFile;
const PREMISES = premisesJson as unknown as PremisesFile;
const LONDON = "E12000007";
export const GENERIC_PREMISES: ReadonlySet<string> = new Set(["Shops", "Offices (Inc Computer Centres)"]);
export const MIN_PREMISES = 100;

/** Why a trade's London money is withheld, or null when it can be built. The data's limits are checked before the
 *  recipe, so a trade without one still says what else it lacks. */
export function londonWithholding(slug: string): string | null {
  const london = TURNOVER.trades[slug]?.by_geography[LONDON];
  const bands = london?.turnover_bands_k;
  if (!london || !bands || bands.every((c) => c === 0)) return "no London turnover bands for the trade's code";
  if (london.thin) return `${london.enterprises} businesses in London on the register, under the 40 its figures need`;
  const category = PREMISES.trade_category[slug];
  if (!category) return "no kind of premises for the trade";
  if (GENERIC_PREMISES.has(category)) return `its premises are valued as ${category.toLowerCase()}, an average over unlike occupiers`;
  const row = PREMISES.rows[LONDON]?.categories[category];
  if (!row || !row.rv_per_m2 || !row.count || !row.floorspace_k_m2) return `no London valuation row for ${category.toLowerCase()}`;
  if (row.count < MIN_PREMISES) return `${row.count} ${category.toLowerCase()} premises in London, too few for the valuation's rounding`;
  if (!RECIPES[slug]) return "no recipe";
  return null;
}

export function londonTradeInputs(slug: string, form: Form = "sole trader"): PnlInputs | null {
  if (londonWithholding(slug) !== null) return null;
  const category = PREMISES.trade_category[slug];
  const row = PREMISES.rows[LONDON].categories[category] as PremisesRow;
  const bands = TURNOVER.trades[slug].by_geography[LONDON].turnover_bands_k as number[];
  return buildInputs(RECIPES[slug], { revenueBandsK: bands, premises: row, premisesCategory: category, place: "London", form });
}

export function londonTradeSummary(slug: string, form: Form = "sole trader"): PnlSummary | null {
  const inputs = londonTradeInputs(slug, form);
  return inputs ? summarise(inputs) : null;
}

/** The headline figures' range across the three band shapes (ranges.ts), or null when the trade is withheld. */
export function londonTradeRanges(slug: string, form: Form = "sole trader"): PnlRanges | null {
  const inputs = londonTradeInputs(slug, form);
  return inputs ? shapeRanges(inputs) : null;
}
