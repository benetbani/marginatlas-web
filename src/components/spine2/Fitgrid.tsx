/**
 * src/components/spine2/Fitgrid.tsx
 *
 * Trade x district fit (city 09) as three-level dots, with exactly one
 * terracotta dot per row , the district that fits that trade best.
 * BATCH-B "fitgrid", port risk 2.
 *
 * Contract (BATCH-B + PORT-CONTRACT):
 * - M5: BEST = argmax(fit) per row, DERIVED , the mockup's hand-set `d hi`
 *   is never accepted. `FITGRID_MID_AT = 0.5` sets the mid dot. A row where
 *   argmax is not computable (all null, or a tie the data cannot break)
 *   renders with no terracotta dot rather than a fake winner.
 * - M9: a null cell renders EMPTY, and that is honest here , the grid reads
 *   "no reading". This is deliberately the opposite of Matrix, where the
 *   empty mark (the middle dot) asserts a fact ("not required") and so an
 *   unknown must omit the whole row. Same-looking grids, different claims.
 *   Under FITGRID_MIN_DISTRICTS districts the section self-omits ,
 *   "best of two" is not a finding.
 * - M7: the lead sentence naming the winners renders through `lead`, which
 *   receives the derived per-row winners from the same data the dots read.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

/** M5: at or above this fit, a district draws the mid (darker) dot. */
export const FITGRID_MID_AT = 0.5;

/** M9: under this many districts, "best of N" is not a finding. */
export const FITGRID_MIN_DISTRICTS = 3;

export type FitRow = {
  trade: string;
  /** v12 C37: the trade column takes a row glyph. */
  icon?: GlyphId;
  /** 0..1 per district, aligned with `districts`; null = no reading. */
  fit: Array<number | null | undefined>;
};

export type FitWinner = { trade: string; district: string };

export interface FitgridProps extends React.HTMLAttributes<HTMLDivElement> {
  districts: string[];
  rows: FitRow[];
  rowHeader?: string;
  /**
   * M7 caption coupling: receives the derived winners (rows whose argmax is
   * computable, in row order). Rendered as the lead .note above the table.
   */
  lead?: (winners: FitWinner[]) => React.ReactNode;
}

/** Strict argmax: null on empty, all-null, or an unbroken tie for the top. */
function bestIndex(fit: Array<number | null | undefined>): number | null {
  let best: number | null = null;
  let tied = false;
  fit.forEach((v, i) => {
    if (v == null || !Number.isFinite(v)) return;
    if (best == null || v > (fit[best] as number)) {
      best = i;
      tied = false;
    } else if (v === fit[best]) {
      tied = true;
    }
  });
  return tied ? null : best;
}

const Fitgrid = React.forwardRef<HTMLDivElement, FitgridProps>(
  ({ districts, rows, rowHeader = "Trade", lead, className, ...props }, ref) => {
    if (districts.length < FITGRID_MIN_DISTRICTS) return null;
    if (rows.length === 0) return null;

    const bests = rows.map((r) => bestIndex(r.fit.slice(0, districts.length)));
    const winners: FitWinner[] = rows
      .map((r, ri) => {
        const b = bests[ri];
        return b == null ? null : { trade: r.trade, district: districts[b] };
      })
      .filter((w): w is FitWinner => w != null);

    return (
      <>
        {lead ? (
          <p className="note" style={{ marginBottom: 16, maxWidth: "70ch" }}>
            {lead(winners)}
          </p>
        ) : null}
        <div ref={ref} className={cn("fitgrid", className)} {...props}>
          <table>
            <thead>
              <tr>
                <th>{rowHeader}</th>
                {districts.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.trade}>
                  <td>
                    {r.icon ? <GlyphIcon id={r.icon} size={18} /> : null}
                    {r.trade}
                  </td>
                  {districts.map((_, ci) => {
                    const v = r.fit[ci];
                    if (v == null || !Number.isFinite(v)) return <td key={ci} />;
                    const isBest = bests[ri] === ci;
                    return (
                      <td key={ci}>
                        <span className={cn("d", !isBest && v >= FITGRID_MID_AT && "mid", isBest && "hi")} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  },
);
Fitgrid.displayName = "Fitgrid";

export { Fitgrid };
