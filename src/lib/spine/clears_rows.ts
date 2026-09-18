/**
 * src/lib/spine/clears_rows.ts
 *
 * WHEN IT CLEARS COSTS, the trade page's `08 clears` (MODEL.md 8.6; plan step
 * 33, fourth dispatch, 2026-09-18): the needed share of a typical day's
 * takings, one figure, LOUD (accent three, the page's third and last). The
 * composition's form is the single-share ring (B4's "week activity"), which is
 * not in the archetypes folder, so it is candidate 4 of FORM-CATALOG's
 * CANDIDATES AWAITING HIS CLICK and its mockup is owed to the review sheet;
 * until his click the SEAT is the catalogued plain figure, BentoMetric, the
 * share at 30 in `--terra-text` (cell/turn-two.tsx). Pure over the seed and
 * the shard, synchronous, so the stories, the copy gates and the harness
 * build it without the database.
 *
 * TWO FEEDS, IN 8.6's ORDER, each figure with its file and field:
 *  1. THE ENGINE, where `meta.money_shown`: `break_even.share_pct`, which
 *     adapt_cell.ts carries off computeBreakeven() (src/lib/economics/
 *     breakeven.ts) as breakevenOrdersDaily over currentOrdersDaily, the
 *     engine's own unrounded ratio; or, on a seed that carries the two
 *     rounded counts alone (the bundled dev seed), covers_per_day over
 *     typical_covers_per_day. STATED, because the brief did not predict it:
 *     that ratio reduces to the trade's fixed-cost share over its gross
 *     margin (the monthly revenue and the average order value cancel), both
 *     read from INDUSTRY_BASELINES by trade, so the engine's share is a
 *     TRADE constant (75 for restaurants: 0.51 over 0.68) and the city's
 *     takings never enter it. This measurement cannot distinguish a London
 *     day from a California day; the gate on `money_shown` changes which
 *     table feeds the figure, not the altitude it is measured at, and the
 *     basis says so in the foot's words.
 *  2. THE SHARD, otherwise: `cost_structure.breakeven_utilization_pct` in
 *     data/facts/industry/<id>.json, through src/lib/facts/industry_shard.ts.
 *     Counted 2026-09-18: 243 of 243 shards hold it, 79 tagged held, none at
 *     zero, 45 to 92. Every shard figure is modelled on the page (R12).
 *
 * ALWAYS DRAWS on a trade that holds a shard or an engine share; null only on
 * a sector-average cell with neither (no shard, money not shown), which draws
 * none of turn two's cards. The figure prints as a whole percent.
 */
import { industryFigure } from "@/lib/facts/industry_shard";
import { COPY } from "@/lib/spine/copy";

export const CLEARS_METRIC = "cost_structure.breakeven_utilization_pct";

export type ClearsData = {
  /** The share, a whole percent, 1 to 100 or over (a day that does not clear its costs runs past 100). */
  value: number;
  /** As printed: "70%". */
  figure: string;
  branch: "engine" | "shard";
  basis: string;
  foot: string;
  /** The page's third accent (8.6): always on, the card's one figure in `--terra-text`. */
  accent: true;
  /** Modelled on both feeds (R12; the engine's is a modelled ratio). */
  sample: true;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The engine's share off the seed, or null where money is not shown or the seed holds none. */
function engineShare(seed: any): number | null {
  if (seed?.meta?.money_shown !== true) return null;
  const b = seed?.break_even;
  if (!b) return null;
  if (isNum(b.share_pct) && b.share_pct > 0) return b.share_pct;
  if (isNum(b.covers_per_day) && isNum(b.typical_covers_per_day) && b.covers_per_day > 0 && b.typical_covers_per_day > 0) return (b.covers_per_day / b.typical_covers_per_day) * 100;
  return null;
}

export function buildClears(seed: any): ClearsData | null {
  const engine = engineShare(seed);
  let value: number | null = null;
  let branch: ClearsData["branch"] = "engine";
  if (engine != null) value = engine;
  else {
    const id: string | undefined = typeof seed?.meta?.industry_id === "string" ? seed.meta.industry_id : undefined;
    const f = id ? industryFigure(id, CLEARS_METRIC) : null;
    if (f && f.value > 0) { value = f.value; branch = "shard"; }
  }
  if (value == null) return null;
  const pct = Math.max(1, Math.round(value));
  return { value: pct, figure: `${pct}%`, branch, basis: COPY.tradeClears.basis, foot: COPY.tradeClears.foot, accent: true, sample: true };
}
