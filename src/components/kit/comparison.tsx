/**
 * Comparison grammar - the public entry the pages already import.
 *
 * The Atlas table family now lives in ./tables (the Claude-design table-system
 * ported into real React + Tailwind: AtlasTable primitive + ComparisonTable,
 * OwnerKeepTable, CostSplitTable, RangeTable, WeightedCompare). This module:
 *
 *   1. re-exports that family so a single import path stays valid, and
 *   2. keeps the existing public API working unchanged. LikeForLikeTable and
 *      WageRangeTracks (and their prop types LikeForLikeColumn / LikeForLikeRow
 *      / WageTrack) keep their exact shapes; their callers are untouched.
 *      LikeForLikeTable is now a thin adapter over the new ComparisonTable, so
 *      both express the one grammar from one place.
 *
 * The shared way Atlas compares places without shaming any of them: a
 * comparison holds ONE axis constant and the leader cell per row takes the lone
 * vermillion tint. The leader mark is opt-out (noLeaderMark): when the columns
 * span different price regimes (countries), the page passes noLeaderMark so a
 * raw figure is never crowned across borders (the data-sanity rule from WS1).
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 * Server-renderable.
 */
import * as React from "react";
import {
  ComparisonTable,
  type ComparisonColumn,
  type ComparisonRow,
} from "./tables/ComparisonTable";
import { isNum, hasText, RangeTrack } from "./tables/helpers";

/* Re-export the whole table family from the established import path. */
export {
  AtlasTable,
  type AtlasTableProps,
  type AtlasColumn,
  type AtlasRow,
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonColumn,
  type ComparisonRow,
  OwnerKeepTable,
  type OwnerKeepTableProps,
  type OwnerKeepTrade,
  CostSplitTable,
  type CostSplitTableProps,
  type CostSplitRow,
  RangeTable,
  type RangeTableProps,
  type RangeTableRow,
  WeightedCompare,
  type WeightedCompareProps,
  type WeightedColumn,
  type WeightedMetric,
  TableShell,
  type TableShellProps,
  MeaningChip,
  type ChipTone,
  InlineBar,
  figureCellClass,
  type FigureTone,
  resolveLeaderKey,
  money,
  moneyFull,
  percent,
  DASH,
} from "./tables";

/* ------------------------------------------------------------------ */
/* LikeForLikeTable - the existing public API, now an adapter over the */
/* ported ComparisonTable. Prop shape is unchanged: `cells` are display */
/* strings, `metric` is the comparable number for the leader mark.      */
/* ------------------------------------------------------------------ */

export type LikeForLikeColumn = { key: string; label: string; sub?: string };

export type LikeForLikeRow = {
  label: string;
  hint?: string;
  /** Display string per column key (null renders the dash). */
  cells: Record<string, string | null | undefined>;
  /** Optional comparable numbers per column for the leader mark. */
  metric?: Record<string, number | null | undefined>;
  /** Whether a higher metric is the stronger one (default true). */
  higherIsBetter?: boolean;
};

export function LikeForLikeTable({
  columns,
  rows,
  eyebrow,
  heading,
  lede,
  noLeaderMark = false,
  footnote,
  id,
  className,
}: {
  columns: LikeForLikeColumn[];
  rows: LikeForLikeRow[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Suppress every leader mark (e.g. columns span price regimes). */
  noLeaderMark?: boolean;
  footnote?: string;
  id?: string;
  className?: string;
}) {
  // Map the like-for-like shape onto the family's AtlasRow shape: `cells` are
  // pre-formatted display strings, `metric` carries the comparable number used
  // only to resolve the leader tint.
  const mappedColumns: ComparisonColumn[] = (columns ?? []).map((c) => ({
    key: c.key,
    label: c.label,
    sub: c.sub,
  }));
  const mappedRows: ComparisonRow[] = (rows ?? []).map((r) => ({
    label: r.label,
    hint: r.hint,
    display: r.cells,
    values: r.metric ?? {},
    higherIsBetter: r.higherIsBetter,
    // Without a metric there is nothing to crown; leave the row uncrowned but
    // still rendered, matching the prior behavior (a dash-aware display row).
    noLeader: !r.metric,
  }));

  return (
    <ComparisonTable
      columns={mappedColumns}
      rows={mappedRows}
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      metricLabel="Metric"
      noLeaderMark={noLeaderMark}
      footnote={footnote}
      // Preserve the prior contract: this entry renders whenever it has >= 2
      // columns and >= 1 row, even if sparse (callers gate their own data).
      keepWhenThin
      id={id}
      className={className}
    />
  );
}

/* ------------------------------------------------------------------ */
/* WageRangeTracks - one role/place per row, rail + fill + median tick.*/
/* Unchanged public API; now built on the family's shared RangeTrack.  */
/* ------------------------------------------------------------------ */

export type WageTrack = {
  label: string;
  low?: number | null;
  median?: number | null;
  high?: number | null;
};

export function WageRangeTracks({
  tracks,
  format,
  className,
}: {
  tracks: WageTrack[];
  format: (n: number) => string;
  className?: string;
}) {
  const rows = (tracks ?? []).filter(
    (t) => hasText(t.label) && (isNum(t.low) || isNum(t.median) || isNum(t.high)),
  );
  if (rows.length === 0) return null;

  const lows = rows.map((r) => r.low).filter(isNum) as number[];
  const highs = rows.map((r) => r.high).filter(isNum) as number[];
  const meds = rows.map((r) => r.median).filter(isNum) as number[];
  const lo = Math.min(...[...lows, ...meds]);
  const hi = Math.max(...[...highs, ...meds]);

  return (
    <ul className={["space-y-3.5", className].filter(Boolean).join(" ")}>
      {rows.map((r, i) => {
        const label = isNum(r.median)
          ? format(r.median)
          : isNum(r.low) && isNum(r.high)
            ? `${format(r.low)} to ${format(r.high)}`
            : isNum(r.low)
              ? format(r.low)
              : isNum(r.high)
                ? format(r.high)
                : "";
        const showRail =
          (isNum(r.low) || isNum(r.median)) && (isNum(r.high) || isNum(r.median));
        return (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink-900">{r.label}</span>
              <span className="font-display text-sm font-semibold tabular-nums text-ink-900">
                {label}
              </span>
            </div>
            {showRail ? (
              <RangeTrack
                low={r.low}
                median={r.median}
                high={r.high}
                domainLow={lo}
                domainHigh={hi}
                className="mt-1.5"
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
