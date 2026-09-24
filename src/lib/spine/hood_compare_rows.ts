/**
 * src/lib/spine/hood_compare_rows.ts
 *
 * DISTRICTS, SIDE BY SIDE, `03 compare` (MODEL.md 8.8; plan step 35,
 * 2026-09-19; RE-RULED 2026-09-24, the goal's B2 and C1): the page's one
 * table, on CompareTable (B7), full width by the wide-table sanction as the
 * country's `09`. The seven districts as rows, cheapest rent first (the `01`
 * order, so the page's lists read the same way down).
 *
 * THE COLUMNS ARE WHAT A SHOP TAKES THERE, MEASURED, one a trade:
 * `data/economics/district_turnover_measured_v1.json` (plan step 45,
 * 2026-09-17, read by nothing until this builder), the median VAT turnover
 * of the enterprises registered in each district in 2023/24, from the
 * national business register, for three trades: cafes (the class is
 * "unlicensed restaurants and cafes", so the caveat says restaurants are in
 * it), hairdressing and beauty (the class the file's `barbershops` key
 * measures, so the head names the class and never the site's trade), and
 * dental practices. Pounds to dollars at the London drops' own rate
 * (`fx.ts` GBP, 1.32), as every London figure on the site. Absolutes, never
 * the file's multiple of London (clause 15); the best cell per column ticked
 * (the highest takings), the archetype's own reading; terracotta never
 * enters a table.
 *
 * WHY THE COLUMNS CHANGED (the 2026-09-19 ruling (c) put rent and visitors
 * here): they were the same figures `01 rank` and `02 premium` print two
 * cards above, so every figure in the table printed twice on the page, and
 * with two short columns across the full width the table's middle stood
 * empty, fourteen LABEL GAP rows of 568 to 601 px at 1280 (his clause 59, "a
 * three-column table ... should just not be that wide"). Three measured
 * columns carry figures nothing else on the page prints, and fill the width.
 *
 * WITHHOLDING: a district under 40 registered enterprises for a trade is the
 * file's own thin mark, and its cell is an en dash, said once in the note
 * (dental: City of London 20, South Bank 5). A trade the file does not hold
 * for a district prints the same dash. The registered-address caveat (a
 * district of registered offices reads the offices' turnover) is the
 * caveat's "registered in each district".
 *
 * THE HOME ROW (ruling b): on a district page that district's row is
 * `home: true`, tinted, in its place. Rows never navigate (M23).
 */
import { COPY } from "@/lib/spine/copy";
import { hoodCity, spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { byRent } from "@/lib/spine/hood_take_rows";
import { convertToUsd } from "@/lib/finance/fx";
import turnoverJson from "../../../data/economics/district_turnover_measured_v1.json";
import type { CompareColumn, CompareRow } from "@/components/spine/archetypes/CompareTable";

type TurnoverDistrict = { n: number; median: number; thin?: boolean };
type TurnoverTrade = { label: string; districts: Record<string, TurnoverDistrict> };
const TURNOVER = (turnoverJson as unknown as { trades: Record<string, TurnoverTrade> }).trades;

/** The file's own thin mark: an area under this many enterprises is too few to measure. */
export const TURNOVER_THIN = 40;
/** The file's trades, in the order the columns read; the head names the class the file measured. */
export const TURNOVER_TRADES = [
  { file: "cafes-coffee-shops", key: "cafes" },
  { file: "barbershops", key: "hair" },
  { file: "dental-practices", key: "dental" },
] as const;

export type HoodCompareData = {
  rows: CompareRow[];
  columns: CompareColumn[];
  entityHead: string;
  caveat: string;
  /** One line for a dashed cell, said once; null where every cell holds a figure. */
  note: string | null;
  /** The reference district's name (the rows' order starts there). */
  cheapest: string;
  /** The home row's key on a district page; null on the hub. */
  home: string | null;
  /** Cells withheld as thin, for the stories and the gates. */
  dashed: number;
};

/** One district's median takings for one trade in dollars a year, or null where the file is thin or silent. */
export function measuredTakings(trade: string, district: string): number | null {
  const d = TURNOVER[trade]?.districts?.[district];
  if (!d || d.thin || !(d.n >= TURNOVER_THIN) || !(d.median > 0)) return null;
  const usd = convertToUsd("GBP", d.median * 1000);
  return usd == null ? null : Math.round(usd);
}

/** Null when the city is not admitted, or when `focus` names a district the scheme does not hold. */
export function buildHoodCompare(citySlug: string, focus: string | null = null): HoodCompareData | null {
  const city = hoodCity(citySlug);
  const rows = spineHoodDistricts(citySlug);
  if (!city || !rows) return null;
  if (focus && !rows.some((d) => d.slug === focus)) return null;
  /* The measured file holds London alone; another admitted city draws no table rather than a table of dashes (clause 32). */
  if (!rows.some((d) => TURNOVER_TRADES.some((t) => measuredTakings(t.file, d.slug) != null))) return null;
  const ranked = byRent(rows);
  const iso2 = city.iso2.toUpperCase();
  const out: CompareRow[] = ranked.map((d) => ({
    iso2,
    key: d.slug,
    name: d.name,
    home: d.slug === focus,
    values: Object.fromEntries(TURNOVER_TRADES.map((t) => [t.key, measuredTakings(t.file, d.slug)])),
  }));
  const dashed = out.reduce((n, r) => n + TURNOVER_TRADES.filter((t) => r.values[t.key] == null).length, 0);
  return {
    rows: out,
    columns: TURNOVER_TRADES.map((t): CompareColumn => ({ key: t.key, head: COPY.hoodCompare.cols[t.key], unit: "usd", best: "max" })),
    entityHead: COPY.cityDistricts.phoneHead.name,
    caveat: COPY.hoodCompare.caveat,
    note: dashed === 0 ? null : COPY.hoodCompare.dash,
    cheapest: ranked[0].name,
    home: focus,
    dashed,
  };
}
