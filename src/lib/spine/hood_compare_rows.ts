/**
 * src/lib/spine/hood_compare_rows.ts
 *
 * DISTRICTS, SIDE BY SIDE, `03 compare` (MODEL.md 8.8; plan step 35,
 * 2026-09-19): the page's one table, on CompareTable (B7), full width by the
 * wide-table sanction as the country's `09` and the city's `11`. The seven
 * districts as rows, cheapest first (the `01` order, so the two cards read
 * the same way down), two columns, the controller's ruling (c):
 *  - `rent`: every district's shop rent against the cheapest, `rentMult`'s
 *    notation, the head naming the reference ("Rent, against South London",
 *    PART 5's one recorded exception to the three-word cap), unit "mult",
 *    best "min" (a burden). The same rebased figures `01` prints, off
 *    hood_scheme.ts's `rent_mult` (modelled, item 15).
 *  - `visitors`: `tourism_intensity`, visitors a year per resident, unit
 *    "per", best "max"; the same figures `02` prints.
 * The one-word `character` class is NOT a column (clause 19), `walkability`
 * is printed nowhere (item 66), `price_tier` is a word where a figure goes
 * and is `05`'s note instead. Rows never navigate (M23; CompareTable draws
 * no href in either form). The best cell per column in ink with the tick,
 * the archetype's own reading; terracotta never enters a table.
 *
 * THE HOME ROW (ruling b): on a district page that district's row is
 * `home: true`, tinted `--c-soft` with a semibold name and marked by nothing
 * else, in its ranked place (CompareTable's own law, the trade's peers
 * table's precedent: the reader's own place is the one reason a row is
 * marked). On the hub no row is home. A district whose intensity row holds
 * no visitor figure prints an en dash there and the card says so once in
 * the note (PART 5's blanks; none on London's seven).
 *
 * The caveat is PART 7's basis: what each column is and over what, the rent
 * said modelled, the visitors' year, fourteen words at most.
 */
import { COPY } from "@/lib/spine/copy";
import { hoodCity, spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { againstCheapest, byRent } from "@/lib/spine/hood_take_rows";
import type { CompareColumn, CompareRow } from "@/components/spine/archetypes/CompareTable";

export type HoodCompareData = {
  rows: CompareRow[];
  columns: CompareColumn[];
  entityHead: string;
  caveat: string;
  /** One line for a dashed visitor cell, said once; null where every row holds one. */
  note: string | null;
  /** The reference district's name, the head's own word. */
  cheapest: string;
  /** The home row's key on a district page; null on the hub. */
  home: string | null;
  year: number | null;
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** Null when the city is not admitted, or when `focus` names a district the scheme does not hold. */
export function buildHoodCompare(citySlug: string, focus: string | null = null): HoodCompareData | null {
  const city = hoodCity(citySlug);
  const rows = spineHoodDistricts(citySlug);
  if (!city || !rows) return null;
  if (focus && !rows.some((d) => d.slug === focus)) return null;
  const ranked = byRent(rows);
  const cheapest = ranked[0];
  const iso2 = city.iso2.toUpperCase();
  const year = rows.map((d) => d.tourism?.year).find((y) => y != null) ?? null;
  const dashed = rows.filter((d) => d.tourism == null).length;
  return {
    rows: ranked.map((d) => ({ iso2, key: d.slug, name: d.name, home: d.slug === focus, values: { rent: againstCheapest(d, cheapest), visitors: d.tourism?.value ?? null } })),
    columns: [
      { key: "rent", head: fill(COPY.cityDistricts.phoneHead.value, { district: cheapest.name }), unit: "mult", best: "min" },
      { key: "visitors", head: COPY.hoodCompare.cols.visitors, unit: "per", best: "max" },
    ],
    entityHead: COPY.cityDistricts.phoneHead.name,
    caveat: fill(year != null ? COPY.hoodCompare.caveatYear : COPY.hoodCompare.caveat, { year: String(year ?? ""), cheapest: cheapest.name }),
    note: dashed === 0 ? null : COPY.hoodCompare.dash,
    cheapest: cheapest.name,
    home: focus,
    year,
  };
}
