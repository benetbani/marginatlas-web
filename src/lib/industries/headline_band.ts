/**
 * src/lib/industries/headline_band.ts
 *
 * The ONE resolver for the figure the industry page leads with, and for the
 * cells that figure was built from.
 *
 * WHAT THE INDUSTRY PAGE LEADS WITH. Its masthead anchor is the median typical
 * revenue across the US-state cohort (src/lib/industries/industry_view.ts, the
 * `hasBand` branch). Not a worldwide average: the founder's standing rule is
 * that cross-place aggregation has garbage tails, so the figure is the median
 * of a trimmed band and it dashes entirely below five covered places. The
 * cohort is US states only, because they share one country, one currency and
 * broadly one price level; the across-countries slate is deliberately kept out
 * of the headline.
 *
 * WHY IT MOVED HERE. `activityPlaceFromCell` used to be a private function
 * inside src/app/(site)/industries/[industry]/page.tsx, which meant the page
 * was the only thing in the codebase that could compute this figure. The social
 * card at /og/industry has to print the SAME number the page prints, and a card
 * that leads on a different number than its page is a worse defect than a card
 * with no number at all. Re-deriving it beside the route would have been the
 * same fact in two places, which this project has already paid for more than
 * once. So the mapper moved to a module both can import, and the page's own
 * data flow is otherwise untouched.
 *
 * NOT A PURE MODULE, unlike its neighbour src/lib/scores/activity_board.ts.
 * That file's header promises no Supabase and no fetching, and it keeps that
 * promise; `cellUrl` and the cell query live in src/lib/cells, so putting this
 * there would have dragged the database client into a module documented as
 * pure. This module is the impure half and calls into the pure one.
 */
import {
  getSameIndustryAcrossStates,
  withBudget,
  cellUrl,
  type Cell,
} from "@/lib/cells";
import { iso2ToName } from "@/lib/countries";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";
import {
  summarizeActivityPlaces,
  type ActivityPlaceInput,
  type ActivityPlacesSummary,
} from "@/lib/scores/activity_board";

/**
 * The query shape behind the headline band, named once so the page and the
 * card cannot drift apart on it.
 *
 * The exclude id is a deliberate no-op: `getSameIndustryAcrossStates` returns
 * an empty slate unless the id starts with "US-", and "US-00" is not a real
 * FIPS code, so it satisfies the guard while excluding no actual state.
 */
export const US_STATE_SLATE_EXCLUDE = "US-00";
export const US_STATE_SLATE_LIMIT = 24;
/** Budget for the slate query. A slow query yields an empty band, never a wrong one. */
export const US_STATE_SLATE_BUDGET_MS = 4_000;

/**
 * Turn one cross-place Cell into a place row for the activity board's range +
 * "where it works" table, or null when the place has no usable typical revenue
 * (those are dropped rather than guessed).
 *
 * Owner take-home is the modeled after-tax net profit from the same tax-aware
 * estimator the cell page uses, so the worldwide table and the per-place cell
 * page agree on the method. The margin is floored defensively (clampMargin)
 * exactly as on the cell page, so no implausible figure leaks into the table.
 * The href points at that place's cell page for this activity via the shared
 * cellUrl shape, so every row resolves to a real benchmark.
 */
export function activityPlaceFromCell(
  cell: Cell,
  industryId: string | null,
  cohort: "us-state" | "country",
): ActivityPlaceInput | null {
  const typicalRevenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (typicalRevenue == null || !(typicalRevenue > 0)) return null;

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: industryId,
    sectorId: cell.sector_id || null,
    grossRevenue: typicalRevenue,
    payroll: null,
  });
  const netMarginPct =
    net.net_margin != null
      ? clampMargin(net.net_margin, "net", industryId) * 100
      : null;
  const takeHome = net.net_profit ?? null;

  const name =
    cell.geo_name || iso2ToName(cell.country) || cell.country.toUpperCase();

  return {
    name,
    href: cellUrl(cell),
    typicalRevenue,
    takeHome: takeHome != null && takeHome > 0 ? takeHome : null,
    netMarginPct,
    cohort,
  };
}

export type IndustryHeadlineBand = {
  /** The trimmed cross-place bands. `revenue.median` is the page's anchor. */
  summary: ActivityPlacesSummary;
  /**
   * The US-state cells that contributed a usable revenue to the band, so a
   * caller can state how those figures were produced. Empty when the slate is
   * empty or the query ran out of budget.
   */
  contributors: Cell[];
};

/**
 * Resolve the industry page's headline band for one trade.
 *
 * This runs the same three steps, over the same constants, that the page runs
 * inline: fetch the US-state slate, map each row through activityPlaceFromCell,
 * and summarise. It additionally hands back the cells behind the band, which
 * the page has no use for and the social card cannot do without.
 *
 * Fail-soft throughout. An empty slate, a query over budget, or fewer than the
 * band's five-place floor all produce an all-null revenue band, which every
 * caller is required to read as "print no figure" rather than "print a dash".
 */
export async function resolveIndustryHeadlineBand(
  industryId: string,
  activitySlug: string,
): Promise<IndustryHeadlineBand> {
  const cells = await withBudget(
    getSameIndustryAcrossStates(
      activitySlug,
      US_STATE_SLATE_EXCLUDE,
      US_STATE_SLATE_LIMIT,
    ),
    [] as Cell[],
    US_STATE_SLATE_BUDGET_MS,
    "industryHeadlineBand",
  );

  // Keep each cell paired with the row it produced, so `contributors` holds
  // exactly the states that put a revenue into the band and not the ones whose
  // revenue was missing. A caller deriving provenance must not be handed a
  // state that contributed nothing.
  const contributors: Cell[] = [];
  const places: ActivityPlaceInput[] = [];
  for (const cell of cells) {
    const place = activityPlaceFromCell(cell, industryId, "us-state");
    if (!place) continue;
    contributors.push(cell);
    places.push(place);
  }

  return { summary: summarizeActivityPlaces(places), contributors };
}
