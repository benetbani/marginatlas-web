/**
 * ComparisonTable - the like-for-like comparison, seated in the card frame.
 *
 * Metric-row x place-column. ONE axis is held constant (the same trade, the same
 * role) and the leader cell per row takes the lone quiet terracotta tint. The
 * leader mark is opt-out (noLeaderMark) for cross-country / price-regime columns
 * so a raw figure is never crowned across borders, the data-sanity rule. A
 * subject column wears the accent on its label + figures.
 *
 * Filled, empty, and mobile states. Below the self-omit threshold, or with no
 * comparable columns, it returns null (the page leads with what is held instead
 * of a wall of dashes), unless `keepWhenThin` asks it to stay.
 *
 * Tokens only, nullable inputs, server-renderable. No em-dashes, no source-
 * agency names.
 */
import * as React from "react";
import { AtlasTable, type AtlasColumn, type AtlasRow } from "./AtlasTable";
import { TableShell } from "./helpers";
import { hasText, isNum } from "./helpers";

export type ComparisonColumn = AtlasColumn;
export type ComparisonRow = AtlasRow;

export type ComparisonTableProps = {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Suppress every leader mark (columns span price regimes / borders). */
  noLeaderMark?: boolean;
  /** Top-left header for the metric column. */
  metricLabel?: string;
  caption?: React.ReactNode;
  footnote?: string;
  /** Render bare (no card) to nest inside a BeatCard. Default framed. */
  framed?: boolean;
  /**
   * Keep the table even when fewer than half the cells are held. Default false:
   * a too-thin table self-omits (returns null) so the page stays honest.
   */
  keepWhenThin?: boolean;
  id?: string;
  className?: string;
};

/** Share of cells (rows x columns) that carry a held value or display string. */
function heldFraction(cols: ComparisonColumn[], rows: ComparisonRow[]): number {
  const total = cols.length * rows.length;
  if (total === 0) return 0;
  let held = 0;
  for (const r of rows) {
    for (const c of cols) {
      if (hasText(r.display?.[c.key]) || isNum(r.values[c.key])) held += 1;
    }
  }
  return held / total;
}

export function ComparisonTable({
  columns,
  rows,
  eyebrow,
  heading,
  lede,
  noLeaderMark = false,
  metricLabel = "",
  caption,
  footnote,
  framed = true,
  keepWhenThin = false,
  id,
  className,
}: ComparisonTableProps) {
  const cols = (columns ?? []).filter((c) => hasText(c.key) && hasText(c.label));
  const validRows = (rows ?? []).filter((r) => hasText(r.label));

  // A comparison needs at least two columns to compare; with one it is just a
  // fact list (use AtlasTable / CostSplitTable directly for that).
  if (cols.length < 2 || validRows.length === 0) return null;

  // Self-omit when too thin: a wall of dashes stops reading as honest and starts
  // reading as broken. The page should lead with what is held instead.
  if (!keepWhenThin && heldFraction(cols, validRows) < 0.5) return null;

  return (
    <TableShell
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      caption={caption}
      footnote={footnote}
      framed={framed}
      id={id}
      className={className}
      ariaLabel="Comparison"
    >
      <AtlasTable
        columns={cols}
        rows={validRows}
        metricLabel={metricLabel}
        noLeaderMark={noLeaderMark}
        ariaLabel={heading || eyebrow || "Comparison"}
      />
    </TableShell>
  );
}
