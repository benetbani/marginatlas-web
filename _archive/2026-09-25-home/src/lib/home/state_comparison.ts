/**
 * state_comparison.ts -- an honest like-for-like data story: the SAME trade
 * compared across four comparable large US states, with real revenue resolved
 * live via the same cell accessor the example tiles use. Trusted-local only
 * (synthetic / extrapolated / national reads self-omit), and only the clean-
 * resolving US slugs are used (the US industry-misroute does not touch these).
 * A trade with fewer than three resolving states is dropped; the section
 * self-omits when nothing resolves. Nothing is hardcoded or fabricated.
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { fmtMoney } from "@/lib/format/money";

export type StateRevenue = { state: string; href: string; revenue: string };
export type TradeComparison = {
  trade: string;
  rows: StateRevenue[];
  /**
   * How far apart the best and worst state are, as a percent above the
   * lowest. The band led with four numbers and left the reader to do this
   * subtraction; the founder's rule is that a catalog concept must not be
   * "slammed like a list of elements", and the spread IS the point of the
   * list. Computed from the raw figures before formatting rounds them.
   */
  spreadPct: number;
  /** The strongest and weakest state, named, so the spread has ends. */
  topState: string;
  bottomState: string;
};

// Clean-resolving US industry slugs ONLY (the US misroute does not touch these).
const TRADES: { slug: string; label: string }[] = [
  { slug: "restaurants", label: "Restaurants" },
  { slug: "software-development", label: "Software firms" },
  { slug: "grocery-stores", label: "Grocery stores" },
];
const STATES: { slug: string; label: string }[] = [
  { slug: "california", label: "California" },
  { slug: "new-york", label: "New York" },
  { slug: "texas", label: "Texas" },
  { slug: "florida", label: "Florida" },
];

async function revenueFor(stateSlug: string, industrySlug: string): Promise<number | null> {
  const cell = await withBudget(
    getCellBySlug("us", stateSlug, industrySlug, { sizeBand: null, year: null }),
    null,
    4_000,
    `state-comp:${stateSlug}/${industrySlug}`,
  );
  if (!cell || !isTrustedLocalCell(cell)) return null;
  const rev = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  return typeof rev === "number" && rev > 0 ? rev : null;
}

export async function loadStateComparisons(): Promise<TradeComparison[]> {
  const out: TradeComparison[] = [];
  for (const t of TRADES) {
    const rows: StateRevenue[] = [];
    const raw: { state: string; value: number }[] = [];
    for (const s of STATES) {
      const rev = await revenueFor(s.slug, t.slug);
      if (rev == null) continue;
      rows.push({ state: s.label, href: `/us/${s.slug}/${t.slug}`, revenue: fmtMoney(rev) });
      raw.push({ state: s.label, value: rev });
    }
    // Common-sense gate: a real comparison needs spread, not the same number
    // repeated. Some trades (e.g. grocery stores) resolve to a single national
    // figure that is identical for every state, which is not a comparison at
    // all. Require the displayed values to be meaningfully distinct, else drop
    // the trade.
    const distinct = new Set(rows.map((r) => r.revenue)).size;
    if (rows.length >= 3 && distinct >= Math.max(2, rows.length - 1)) {
      const sorted = [...raw].sort((a, b) => b.value - a.value);
      const top = sorted[0];
      const bottom = sorted[sorted.length - 1];
      out.push({
        trade: t.label,
        rows,
        spreadPct: Math.round(((top.value - bottom.value) / bottom.value) * 100),
        topState: top.state,
        bottomState: bottom.state,
      });
    }
  }
  return out;
}
