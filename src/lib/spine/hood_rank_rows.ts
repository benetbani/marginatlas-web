/**
 * src/lib/spine/hood_rank_rows.ts
 *
 * RENT BY DISTRICT, `01 rank` (MODEL.md 8.8; plan step 35, 2026-09-19): the
 * city page's `03 districts` one altitude down, THE SAME BUILDER AND THE
 * SAME WORDS (M16, M20: a reader who came down from the city page meets the
 * same table under the same head). `buildCityDistrictBars` (district_rows.ts)
 * is handed the hood rows in the city seed's own shape, so the seven figures
 * are byte for byte the city card's: every district's shop rent against the
 * cheapest, cheapest first, the cheapest printing its own 1.00x under a head
 * that names it, nobody featured (his 2026-09-10 ruling), the set's dearest
 * the ceiling. RankedBars draws it in its table form (seven members: PART 5,
 * six or more is a table read top to bottom), `ceiling="set"` (a within-city
 * ranking has no world maximum; left at "world" the track would owe a
 * placement line, PART 9 clause 5) and `feature="none"`.
 *
 * THE TIE 8.8 NAMES IS NOT IN THIS COLUMN. "Three of seven districts tie at
 * an identical clipped revenue reading" is the engine's REVENUE multiplier
 * (the City of London, the West End and the South Bank on its 3.0 ceiling),
 * which this card does not print. The seven rent figures hold no tie
 * (measured 2026-09-19: 1.20, 1.30, 1.59, 2.10, 2.49, 2.96 and 3.00 off the
 * engine, rebased 1.00 to 2.50). One of them sits on a bound: the West End's
 * composed rent is 3.10 and the engine's rent clip prints 3.00, so its
 * figure is the ceiling and not a reading, and the card says so in one line
 * under the basis (`clipLine`), drawn only when a row is clipped. The city
 * card's rows carry no clip flag today, so it draws no such line; the same
 * line is one field away there (adapt_city.ts could pass
 * `nm.rentClipped`), the controller's call.
 */
import { buildCityDistrictBars, type CityDistrictBars } from "@/lib/spine/district_rows";
import { spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { COPY } from "@/lib/spine/copy";

export type HoodRankData = CityDistrictBars & {
  /** The districts whose composed rent sat on the engine's clip, by name; the line under the basis names them. */
  clipped: string[];
  clipLine: string | null;
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** Null when the city is not admitted. */
export function buildHoodRank(citySlug: string): HoodRankData | null {
  const rows = spineHoodDistricts(citySlug);
  if (!rows) return null;
  const bars = buildCityDistrictBars({ where_to_trade: { list: rows.map((d) => ({ name: d.name, slug: d.slug, rent_mult: d.rent_mult })) } });
  if (!bars) return null;
  const clipped = rows.filter((d) => d.rent_clipped).map((d) => d.name);
  const clipLine = clipped.length === 0 ? null : clipped.length === 1 ? fill(COPY.hoodRank.clipOne, { district: clipped[0] }) : fill(COPY.hoodRank.clipMany, { districts: clipped.join(", ") });
  return { ...bars, clipped, clipLine };
}
