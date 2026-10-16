/**
 * src/lib/simulator/cell_facts.ts , WHAT A TRADE CELL GIVES THE DEFAULTS (plan 2026-10-13 cost-simulator, Task 2; R7 4.1's sales row, "a trusted
 * cell's typical", the firms above break-even "from its p10 to p90", and the cost to open, "the cell's held bill"). Pure: the cell's type only is
 * read from src/lib/cells.ts, so the chain's tests import this without the database client. Dollars, as the cells hold them.
 */
import type { Cell } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { setupItemsFromCell } from "@/lib/spine/setup_items";

export type CellFacts = {
  src: string;
  typical: number | null;
  tenths: { p10: number; p25: number; p50: number; p75: number; p90: number } | null;
  firms: number | null;
  setup: { items: Array<{ name: string; usd: number }>; scope: string; src: string } | null;
};

const pos = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) && x > 0 ? x : null);

export function cellFacts(cell: Cell | null | undefined, place: { country: string; city: string | null; trade: string; industryId: string }): CellFacts | null {
  if (!cell) return null;
  const trusted = isTrustedLocalCell(cell, place.industryId);
  const t = [pos(cell.rev_p10), pos(cell.rev_p25), pos(cell.rev_p50), pos(cell.rev_p75), pos(cell.rev_p90)];
  const rising = t.every((x, k) => x !== null && (k === 0 || x >= (t[k - 1] as number)));
  return {
    src: `cells:${place.country}:${place.city}:${place.trade}`,
    typical: trusted ? pos(cell.rev_p50) ?? pos(cell.revenue_per_firm) : null,
    tenths: trusted && rising ? { p10: t[0] as number, p25: t[1] as number, p50: t[2] as number, p75: t[3] as number, p90: t[4] as number } : null,
    firms: trusted ? pos(cell.n_enterprises) : null,
    setup: setupItemsFromCell(cell) ?? null,
  };
}
