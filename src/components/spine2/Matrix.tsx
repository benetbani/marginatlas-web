/**
 * src/components/spine2/Matrix.tsx
 *
 * The licence grid (country 06): trades x licence types as a three-state
 * table , required, required-and-slow, not required , with a per-trade count.
 * BATCH-B "matrix", port risk 1.
 *
 * Contract (BATCH-B + PORT-CONTRACT):
 * - `LicenceMark` is 'req' | 'slow' | 'none'. The Total column DERIVES:
 *   count(m !== 'none'). It is never passed in.
 * - M5: `MATRIX_ACCENT = 'slow'` , terracotta marks the thing that costs you
 *   time (the v9 audit moved it off 'req', which 8 of 8 trades shared).
 *   'req' renders quiet ink-2, 'none' renders the muted middle dot.
 * - M9, strict: the middle dot asserts a fact ("not required"), so a cell
 *   whose status is unknown must never render as none. A column unknown
 *   across all rows drops first; after that, A ROW WITH ANY UNKNOWN MARK
 *   OMITS ENTIRELY. Fewer than MIN_ROWS surviving rows omits the whole
 *   section (the owning page supplies its zonecard-style one-liner).
 *   (Contrast Fitgrid, where an empty cell honestly means "no reading".)
 * - M7: the "slow columns" note derives from the data. `note` receives the
 *   column names where any surviving row carries the ACCENT mark, so the
 *   caption and the accent render from one source and cannot drift.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { ChartFigure } from "./ChartFigure";

export type LicenceMark = "req" | "slow" | "none";

/** M5: terracotta marks the mark that costs you time. Stated in v9, a constant here. */
export const MATRIX_ACCENT: LicenceMark = "slow";

/** M9: under this many surviving rows, the grid is not a finding. */
export const MATRIX_MIN_ROWS = 3;

export type MatrixRow = {
  trade: string;
  /** One mark per column; null/undefined = unknown (omits the row, see M9). */
  marks: Array<LicenceMark | null | undefined>;
};

export interface MatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Licence types, in column order. */
  cols: string[];
  rows: MatrixRow[];
  /** First column header; the row dimension's name. */
  rowHeader?: string;
  totalHeader?: string;
  /**
   * M7 caption coupling: receives the derived accent-column names (columns
   * where any surviving row's mark === MATRIX_ACCENT). Rendered as the .note
   * under the grid. Never hand-write the column names in the caption.
   */
  note?: (slowCols: string[]) => React.ReactNode;
}

const MARK_CELL: Record<LicenceMark, { className: string; text: string }> = {
  req: { className: "req", text: "req" },
  slow: { className: "slow", text: "slow" },
  none: { className: "no", text: "·" },
};

const Matrix = React.forwardRef<HTMLDivElement, MatrixProps>(
  ({ cols, rows, rowHeader = "Trade", totalHeader = "Total", note, className, ...props }, ref) => {
    // 1. A column unknown across all rows drops (before row omission, so an
    //    entirely-unknown column cannot silently kill every row).
    const keptCol = cols.map((_, ci) => rows.some((r) => r.marks[ci] != null));
    const liveCols = cols.filter((_, ci) => keptCol[ci]);

    // 2. A row with ANY unknown surviving mark omits entirely (M9 strict).
    const liveRows = rows
      .map((r) => ({
        trade: r.trade,
        marks: r.marks.filter((_, ci) => keptCol[ci]),
      }))
      .filter(
        (r) =>
          r.marks.length === liveCols.length &&
          r.marks.every((m): m is LicenceMark => m != null),
      ) as Array<{ trade: string; marks: LicenceMark[] }>;

    // 3. Under MIN_ROWS the grid self-omits; the page owner speaks instead.
    if (liveCols.length === 0 || liveRows.length < MATRIX_MIN_ROWS) return null;

    // Derived, never passed: per-row total and the accent columns for the note.
    const totals = liveRows.map((r) => r.marks.filter((m) => m !== "none").length);
    const slowCols = liveCols.filter((_, ci) =>
      liveRows.some((r) => r.marks[ci] === MATRIX_ACCENT),
    );

    return (
      <ChartFigure
        caption={note ? note(slowCols) : undefined}
        captionClassName="note"
        captionStyle={{ marginTop: 14 }}
      >
        <div ref={ref} className={cn("matrix", className)} {...props}>
          <table>
            <thead>
              <tr>
                <th>{rowHeader}</th>
                {liveCols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>{totalHeader}</th>
              </tr>
            </thead>
            <tbody>
              {liveRows.map((r, ri) => (
                <tr key={r.trade}>
                  <td>{r.trade}</td>
                  {r.marks.map((m, ci) => {
                    const cell = MARK_CELL[m];
                    return (
                      <td key={ci} className={cell.className}>
                        {cell.text}
                      </td>
                    );
                  })}
                  <td className="tot">{totals[ri]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartFigure>
    );
  },
);
Matrix.displayName = "Matrix";

export { Matrix };
