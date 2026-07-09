/**
 * src/lib/scores/recommend_core.ts
 *
 * PURE adapters between the two real row sources and the composite engine, plus
 * ranking + budget filtering. No async, no I/O; the async orchestration lives in
 * recommend.ts. Kept pure so the ranking logic is unit-testable without a DB.
 */

import {
  compositeScore,
  type CompositeScore,
  type CompositeWeights,
} from "./composite";
import type { CityColumn } from "@/lib/markets/across_cities";
import type { CityActivityRow } from "@/lib/scores/city_board";

/** Map a place column (one trade across cities) + that city's demand onto the composite. */
export function compositeForColumn(
  col: CityColumn,
  demand: number | null,
  weights?: CompositeWeights,
): CompositeScore | null {
  return compositeScore(
    {
      keepPct: col.netMarginFraction != null ? col.netMarginFraction * 100 : null,
      breakInScore: col.breakInScore,
      survivalYr5Pct: col.survivalYr5,
      demandScore: demand,
      restsOnModeled: true,
    },
    weights,
  );
}

/** Map a trade row (one city's trades) + that city's demand onto the composite. */
export function compositeForActivityRow(
  row: CityActivityRow,
  demand: number | null,
  weights?: CompositeWeights,
): CompositeScore | null {
  return compositeScore(
    {
      keepPct: row.netMarginPct,
      breakInScore: row.breakInScore,
      survivalYr5Pct: row.survivalYr5,
      demandScore: demand,
      restsOnModeled: true,
    },
    weights,
  );
}

/** Sort by composite score descending; rows with a null composite sink to the end. */
export function rankByComposite<T extends { composite: CompositeScore | null }>(
  rows: T[],
): T[] {
  return [...rows].sort(
    (a, b) => (b.composite?.score ?? -1) - (a.composite?.score ?? -1),
  );
}

/**
 * Keep rows whose modeled startup cost is within budget. A row with an UNKNOWN
 * cost is kept (we never exclude on a number we do not hold); `omitted` counts
 * only the rows a known cost put over budget, for an honest "N above your budget".
 */
export function filterByBudget<T extends { startupCostUsd: number | null }>(
  rows: T[],
  budgetUsd: number | null,
): { kept: T[]; omitted: number } {
  if (budgetUsd == null || !(budgetUsd > 0)) return { kept: rows, omitted: 0 };
  const kept = rows.filter(
    (r) => r.startupCostUsd == null || r.startupCostUsd <= budgetUsd,
  );
  return { kept, omitted: rows.length - kept.length };
}
