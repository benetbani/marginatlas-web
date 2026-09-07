/**
 * src/lib/spine/district_rows.ts
 *
 * THE CITY'S DISTRICT RANKING (city:districts, the build loop's run 25,
 * 2026-09-07), for the RankedBars archetype with the burden direction: every
 * ranked district as a row, its rent load (the district's shop rent as a
 * multiple of the city average) as the value, its character as the note; the
 * set's heaviest as the top rule, since a world's best for a burden would be
 * a rule at the floor. The founder's D1 (2026-07-11): rank by rent load,
 * lightest first; the archetype puts the lightest at the right and marks it.
 *
 * MODELLED, AND SAID SO: the multiples are composed from a per-tag constant
 * table with damping (src/lib/economics/neighborhood_multipliers.ts), so the
 * card is tagged; a measured district rent is DATA-REQUIREMENTS.md 15.
 *
 * Draws only for a city with two or more ranked districts. Synchronous over a
 * seed, so the stories and the view share it. The multiple prints with two
 * decimals always, the page's one notation for it.
 */
import type { BarRow } from "@/components/spine/archetypes/RankedBars";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type CityDistrictBars = { rows: BarRow[]; worldMax: number; tagged: boolean; districts: number };

/** The rent multiple's one notation. */
export const rentMult = (v: number) => `x${v.toFixed(2)}`;

export function buildCityDistrictBars(seed: any): CityDistrictBars | null {
  const list: any[] = Array.isArray(seed?.where_to_trade?.list)
    ? seed.where_to_trade.list.filter((r: any) => r && typeof r.name === "string" && r.name && isNum(r.rent_mult) && r.rent_mult > 0)
    : [];
  if (list.length < 2) return null;
  const rows: BarRow[] = list.map((r) => ({
    key: String(r.slug ?? r.name).toLowerCase(),
    name: String(r.name),
    value: r.rent_mult,
    note: typeof r.character === "string" && r.character ? r.character : undefined,
  }));
  return { rows, worldMax: Math.max(...rows.map((r) => r.value)), tagged: true, districts: rows.length };
}
