/**
 * src/lib/spine/world_stats.ts
 *
 * WHERE A COUNTRY'S FIGURE STANDS AMONG THE COUNTRIES (2026-09-25; his words that day: "the numbers that you put on the site ...
 * you just blast them over there with no relation to each other"). One sweep per field over every country profile the atlas holds
 * (data/economic_indicators/country_profile_v2.json through getCountryProfile's list), giving the world's lowest, the middle half
 * (the 25th to the 75th percentile), the median and the highest, and a country's place among them. A card then draws its figure
 * ON the world's range instead of printing it alone.
 *
 * THE SET IS THE PROFILES THAT HOLD THE FIELD, and says how many (a range over twenty countries is not the world's); a field held
 * by fewer than twenty returns null and the card draws its figure without the range.
 *
 * A FILL IS NOT A COUNTRY'S FIGURE (2026-10-04, the UK page reform; research R5, pitfall 2): the profile holds the commercial
 * electricity price at exactly 0.13 for 52 of 197 countries, the reference value the file fills a gap with, so the range's median
 * WAS the fill ("World median $0.13" on the United Kingdom's page) and a hairline strip would have drawn 52 marks on one point.
 * A field whose fill is known is swept without it (FIELD_FILLS), so the median, the quartiles, the placement and every mark drawn
 * stand on measured countries only, and the count says how many. Its blind spot: a country whose real figure equals the fill is
 * dropped with the fills; the file carries no per-field flag, so the two cannot be told apart (running_costs_rows.ts says the same
 * of the figure itself).
 */
import { listCountryProfiles } from "@/lib/economic_profile";
import { ELECTRICITY_FILL_USD_PER_KWH } from "@/lib/spine/running_costs_rows";

export type WorldRange = { min: number; p25: number; median: number; p75: number; max: number; count: number };

/** The known fill of a profile field: a value equal to it is the file's stand-in, not a measurement, and is left out of the set. */
const FIELD_FILLS: Record<string, (v: number) => boolean> = {
  electricity_usd_per_kwh_commercial: (v) => Math.abs(v - ELECTRICITY_FILL_USD_PER_KWH) < 1e-9,
};

const cache = new Map<string, WorldRange | null>();
const valuesCache = new Map<string, number[]>();
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The set's quantile of a list sorted lowest first, interpolated between its neighbours. Exported so a range of another set (the
 *  home page's London trades, home_answers.ts) is cut by this rule and not by a copy of it. */
export function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Whether `v` is the field's known fill rather than a country's figure. */
export function isFieldFill(field: string, v: number): boolean {
  const fill = FIELD_FILLS[field];
  return fill ? fill(v) : false;
}

/** Every country's held value for one profile field, lowest first: zero and negative values are not figures, and a known fill is
 *  not a country's figure, so both are left out. The marks of a world strip and the range below are read from this one list. */
export function worldValues(field: string): number[] {
  const hit = valuesCache.get(field);
  if (hit) return hit;
  const values = listCountryProfiles()
    .map((p) => (p as unknown as Record<string, unknown>)[field])
    .filter((v): v is number => isNum(v) && v > 0 && !isFieldFill(field, v))
    .sort((a, b) => a - b);
  valuesCache.set(field, values);
  return values;
}

/** The world's range for one profile field, or null under twenty countries. */
export function worldRange(field: string): WorldRange | null {
  if (cache.has(field)) return cache.get(field)!;
  const values = worldValues(field);
  const out = values.length >= 20
    ? { min: values[0], p25: quantile(values, 0.25), median: quantile(values, 0.5), p75: quantile(values, 0.75), max: values[values.length - 1], count: values.length }
    : null;
  cache.set(field, out);
  return out;
}

/** How many of the countries in the set hold a lower value than `v` (the placement words read it). */
export function countBelow(field: string, v: number): { below: number; count: number } | null {
  const r = worldRange(field);
  if (!r) return null;
  const values = worldValues(field);
  return { below: values.filter((x) => x < v).length, count: values.length };
}
