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
 */
import { listCountryProfiles } from "@/lib/economic_profile";

export type WorldRange = { min: number; p25: number; median: number; p75: number; max: number; count: number };

const cache = new Map<string, WorldRange | null>();
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** The world's range for one profile field, or null under twenty countries. Zero and negative values are not figures and are left out. */
export function worldRange(field: string): WorldRange | null {
  if (cache.has(field)) return cache.get(field)!;
  const values = listCountryProfiles()
    .map((p) => (p as unknown as Record<string, unknown>)[field])
    .filter((v): v is number => isNum(v) && v > 0)
    .sort((a, b) => a - b);
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
  const values = listCountryProfiles()
    .map((p) => (p as unknown as Record<string, unknown>)[field])
    .filter((x): x is number => isNum(x) && x > 0);
  return { below: values.filter((x) => x < v).length, count: values.length };
}
