/**
 * src/lib/spine/industry_open_rows.ts
 *
 * WHAT IT TAKES TO BE ALLOWED TO OPEN THE DOORS, the industry page's `04
 * open` (MODEL.md 8.7; plan step 34's second dispatch, 2026-09-18): a KvGrid
 * card of three cells at the world altitude, and at its foot his plus
 * (DetailPanel, closed on arrival) holding the licences by name with their
 * days. Pure over the shard through THE TRADE PAGE'S OWN BUILDERS, never a
 * second reading of the same fields: the licences come from permits_rows.ts
 * (the trade's `03 permits`, the same names, the same days, the same zero-day
 * withholding) and the months from open_rows.ts's metric and formatter (the
 * trade's `04 open` foot companion), so a figure a reader meets here is the
 * figure the trade page prints for the same shard. Synchronous, no database:
 * the stories, the copy gate and the harness build every trade by id.
 *
 * THE THREE CELLS, each with its file and field in data/facts/industry/
 * <id>.json through src/lib/facts/industry_shard.ts, in the order 8.7's row
 * names them (the first cell takes the card's width on KvGrid's COMPLETE
 * ROWS, the silhouette candidate 1's focal would take; no cell is at 30
 * until he clicks, the permits' and the survival grid's own seat):
 *  - LICENCES TO HOLD: the count of `licensing.licences.*` the shard names,
 *    243 of 243, two to five (2 / 46 / 146 / 49, counted 2026-09-18); the
 *    zero-day licence the permits builder withholds is a licence to hold
 *    all the same and is counted (its wait is what is not printed).
 *  - THE SLOWEST LICENCE: the longest `typical_days` among them, the
 *    permits builder's `longest`, 243 of 243 (973 days rows, 191 tagged
 *    held), printed in the permits' own unit ("75 days").
 *  - TO BREAK EVEN: `first_year.ramp_to_breakeven_months`, 243 of 243 (3
 *    held), printed by open_rows.ts's formatter ("6 months"), the trade
 *    page's own companion figure.
 * A cell whose figure is not on file is not drawn; its line stands under
 * the grid in the site's idiom (M19), never a word where the figure goes
 * (PART 5). No shard takes that path today. The card is null only where the
 * shard holds none of the three.
 *
 * WHAT IS NOT PRINTED: `typical_cost_band` (low, medium, high) is a word
 * and never stands where a figure goes; the compliance burden score is a
 * coined index (clause 17). The permits builder says the same.
 *
 * THE PLUS: the licences by name with their days, the permits' cells as
 * rows (two to five, the longest wait first), every row a figure, and the
 * permits' withheld line counting a licence with no wait on file
 * (DetailPanel's own `withheldLine`; one shard today). Two rows is the
 * panel's floor and the two two-licence shards clear it exactly.
 *
 * EVERY FIGURE IS MODELLED ON THE PAGE (R12, item 61), and the foot says so
 * in words because the sample mark is behind his switch.
 */
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { industryFigure } from "@/lib/facts/industry_shard";
import { buildPermits, PERMITS_METRICS } from "@/lib/spine/permits_rows";
import { monthsFigure, OPEN_METRICS } from "@/lib/spine/open_rows";
import { daysFigure } from "@/lib/spine/entry_bill_rows";
import { COPY } from "@/lib/spine/copy";

export const INDUSTRY_OPEN_METRICS = { name: PERMITS_METRICS.name, days: PERMITS_METRICS.days, ramp: OPEN_METRICS.ramp } as const;

/** The cells' keys in the order 8.7 names them; the first takes the card's width. */
export const INDUSTRY_OPEN_CELLS = ["licences", "slowest", "breakEven"] as const;
export type IndustryOpenCellKey = (typeof INDUSTRY_OPEN_CELLS)[number];

export type IndustryOpenData = {
  industryId: string;
  /** The printed cells, in 8.7's order, each with its label and figure. */
  cells: KvCell[];
  /** The figures behind the cells, for the gates: the licence count, the slowest wait in days, the months to break even; null where not on file. */
  values: { licences: number | null; slowestDays: number | null; rampMonths: number | null };
  /** The keys whose figure is not on file, each with its stated line under the grid. */
  withheld: IndustryOpenCellKey[];
  withheldLines: string[];
  /** The plus: the licences by name with their days, or null under two rows. */
  detail: { summary: string; rows: DetailRow[]; withheldLine: string | null } | null;
  basis: string;
  foot: string;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function buildIndustryOpen(industryId: string | undefined): IndustryOpenData | null {
  if (!industryId) return null;
  const permits = buildPermits(industryId);
  const ramp = industryFigure(industryId, INDUSTRY_OPEN_METRICS.ramp);
  const rampMonths = ramp && ramp.value > 0 ? ramp.value : null;
  const licences = permits && permits.count > 0 ? permits.count : null;
  const slowestDays = permits?.longest?.days ?? null;
  if (licences == null && slowestDays == null && rampMonths == null) return null;

  const L = COPY.industryOpen.cells;
  const W = COPY.industryOpen.withheld;
  const cells: KvCell[] = [];
  const withheld: IndustryOpenCellKey[] = [];
  const withheldLines: string[] = [];
  if (licences != null) cells.push({ key: "licences", label: L.licences, value: String(licences), confidence: "modeled" });
  else { withheld.push("licences"); withheldLines.push(W.licences); }
  if (slowestDays != null) cells.push({ key: "slowest", label: L.slowest, value: daysFigure(slowestDays), confidence: "modeled" });
  else { withheld.push("slowest"); withheldLines.push(W.slowest); }
  if (rampMonths != null) cells.push({ key: "breakEven", label: L.breakEven, value: monthsFigure(rampMonths), confidence: "modeled" });
  else { withheld.push("breakEven"); withheldLines.push(W.breakEven); }

  /* THE PLUS: the permits' own cells as rows, the longest wait first as the permits builder orders them; the zero-day licence is the panel's withheld line, counted. */
  const rows: DetailRow[] = (permits?.cells ?? []).map((c) => ({ label: c.label, value: typeof c.value === "string" ? c.value : String(c.value ?? "") })).filter((r) => r.label && r.value);
  const zero = permits ? permits.count - rows.length : 0;
  const withheldLine = zero <= 0 ? null : zero === 1 ? COPY.industryOpen.detail.withheldOne : COPY.industryOpen.detail.withheldMany.replace("{n}", String(zero));
  const detail = rows.length >= 2 ? { summary: COPY.industryOpen.detail.summary, rows, withheldLine } : null;

  return {
    industryId,
    cells,
    values: { licences, slowestDays, rampMonths: isNum(rampMonths) ? rampMonths : null },
    withheld,
    withheldLines,
    detail,
    basis: COPY.industryOpen.basis,
    foot: COPY.industryOpen.foot,
    confidence: "modeled",
  };
}

/** How the ids fall, counted rather than remembered, for the gates and the record. */
export function countIndustryOpen(ids: string[]): { total: number; cards: number; threeCells: number; withheldCells: number; plusRows: Record<number, number>; noPlus: number; zeroDay: number } {
  const out = { total: ids.length, cards: 0, threeCells: 0, withheldCells: 0, plusRows: {} as Record<number, number>, noPlus: 0, zeroDay: 0 };
  for (const id of ids) {
    const o = buildIndustryOpen(id);
    if (!o) continue;
    out.cards++;
    if (o.cells.length === 3) out.threeCells++;
    out.withheldCells += o.withheld.length;
    if (o.detail) { out.plusRows[o.detail.rows.length] = (out.plusRows[o.detail.rows.length] ?? 0) + 1; if (o.detail.withheldLine) out.zeroDay++; } else out.noPlus++;
  }
  return out;
}
