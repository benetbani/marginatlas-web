/**
 * src/lib/uk/pnl/london.ts
 *
 * The money of a trade in London, from the register slices (data/uk/registers) and the trade's recipe. Server-side only:
 * turnover.json is two megabytes and never belongs in a client bundle.
 * The geography is a parameter since plan 2026-10-13 cost-simulator, Task 2 (England's rows, E92000001, for the calculator's English places); the
 * London functions keep their words.
 *
 * Withholds, never guesses, and says why (londonWithholding): no recipe; no London bands for the trade's code; under 40
 * businesses in London on the register (the register's own floor: no quantile prints there); no kind of premises for the
 * trade; a kind of premises that averages over unlike occupiers (the valuation's three bulk classes: shops, offices, and
 * factories, workshops and warehouses); or under 100 premises of that kind in London, where the valuation's rounding
 * (counts to 10, floorspace to 1,000 m2) moves the average area by more than a tenth.
 */
import turnoverJson from "../../../../data/uk/registers/turnover.json";
import premisesJson from "../../../../data/uk/registers/premises.json";
import { buildInputs, type PremisesRow } from "./inputs";
import { RECIPES } from "./recipes";
import { own } from "../../own";
import { summarise, type Form, type PnlInputs, type PnlSummary } from "./model";
import { shapeRanges, type PnlRanges } from "./ranges";

type TurnoverFile = { trades: Record<string, { by_geography: Record<string, { turnover_bands_k: number[] | null; thin: boolean; enterprises: number }> }> };
type PremisesFile = { trade_category: Record<string, string>; rows: Record<string, { categories: Record<string, Partial<PremisesRow>> }> };
const TURNOVER = turnoverJson as unknown as TurnoverFile;
const PREMISES = premisesJson as unknown as PremisesFile;
export const LONDON = "E12000007";
export const ENGLAND = "E92000001";
export const GENERIC_PREMISES: ReadonlySet<string> = new Set(["Shops", "Offices (Inc Computer Centres)", "Factories,Workshops And Warehouses(Inc Bakeries & Dairies)"]);
export const MIN_PREMISES = 100;

/** Why a trade's money in a geography is withheld, or null when it can be built. The data's limits are checked before the recipe, so a trade
 *  without one still says what else it lacks. `place` names the geography in the words (London, England). */
export function geographyWithholding(slug: string, geography: string, place: string): string | null {
  /* The slices' own entries only (src/lib/own.ts): `TURNOVER.trades["constructor"]` is the Object function, whose geography threw. */
  const g = own(own(TURNOVER.trades, slug)?.by_geography, geography);
  const bands = g?.turnover_bands_k;
  if (!g || !bands || bands.every((c) => c === 0)) return `no ${place} turnover bands for the trade's code`;
  if (g.thin) return `${g.enterprises} businesses in ${place} on the register, under the 40 its figures need`;
  const category = own(PREMISES.trade_category, slug);
  if (!category) return "no kind of premises for the trade";
  if (GENERIC_PREMISES.has(category)) return `its premises are valued as ${category.toLowerCase()}, an average over unlike occupiers`;
  const row = PREMISES.rows[geography]?.categories[category];
  if (!row || !row.rv_per_m2 || !row.count || !row.floorspace_k_m2) return `no ${place} valuation row for ${category.toLowerCase()}`;
  if (row.count < MIN_PREMISES) return `${row.count} ${category.toLowerCase()} premises in ${place}, too few for the valuation's rounding`;
  if (!own(RECIPES, slug)) return "no recipe";
  return null;
}

export function londonWithholding(slug: string): string | null {
  return geographyWithholding(slug, LONDON, "London");
}

/** The trade's turnover bands in a geography, or null where the register holds none for its code or too few (thin). */
export function geographyBands(slug: string, geography: string): { bands: number[]; enterprises: number } | null {
  const g = own(own(TURNOVER.trades, slug)?.by_geography, geography);
  const bands = g?.turnover_bands_k;
  if (!g || !bands || bands.every((c) => c === 0) || g.thin) return null;
  return { bands, enterprises: g.enterprises };
}

/** The valuation's average premises of the trade's kind in a geography, or null under geographyWithholding's premises rules. */
export function geographyPremises(slug: string, geography: string): { category: string; areaM2: number; rentPerM2: number } | null {
  const category = own(PREMISES.trade_category, slug);
  if (!category || GENERIC_PREMISES.has(category)) return null;
  const row = PREMISES.rows[geography]?.categories[category];
  if (!row || !row.rv_per_m2 || !row.count || !row.floorspace_k_m2 || row.count < MIN_PREMISES) return null;
  return { category, areaM2: (row.floorspace_k_m2 * 1000) / row.count, rentPerM2: row.rv_per_m2 };
}

export function geographyTradeInputs(slug: string, geography: string, place: string, form: Form = "sole trader"): PnlInputs | null {
  if (geographyWithholding(slug, geography, place) !== null) return null;
  /* Own entries (src/lib/own.ts), as geographyWithholding reads them: it answers null only when the trade holds each of these, so a word that
     names a built-in never gets here, and if it did the read is undefined and not the Object function. */
  const category = own(PREMISES.trade_category, slug) as string;
  const row = PREMISES.rows[geography].categories[category] as PremisesRow;
  const bands = own(TURNOVER.trades, slug)!.by_geography[geography].turnover_bands_k as number[];
  return buildInputs(own(RECIPES, slug)!, { revenueBandsK: bands, premises: row, premisesCategory: category, place, form });
}

export function londonTradeInputs(slug: string, form: Form = "sole trader"): PnlInputs | null {
  return geographyTradeInputs(slug, LONDON, "London", form);
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
