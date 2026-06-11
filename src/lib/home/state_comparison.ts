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
export type TradeComparison = { trade: string; rows: StateRevenue[] };

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
    for (const s of STATES) {
      const rev = await revenueFor(s.slug, t.slug);
      if (rev == null) continue;
      rows.push({ state: s.label, href: `/us/${s.slug}/${t.slug}`, revenue: fmtMoney(rev) });
    }
    if (rows.length >= 3) out.push({ trade: t.label, rows });
  }
  return out;
}
