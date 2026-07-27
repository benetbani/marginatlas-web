/**
 * src/components/spine2/Range.tsx
 *
 * `range` (BATCH-A): dumbbell range rows on one shared axis , each row a
 * band (lo-hi) with end caps and a marker at the typical value, plus a tick
 * axis row. "Typical pay and its usual range" / income distribution.
 *
 * Interface per BATCH-A, exactly:
 *   - Position math is owned by the component: `scale` "linear" (country
 *     wages) or "log" (city incomes), over the explicit `domain`. Positions
 *     are clamped to the rail.
 *   - Degenerate range (country "Wage floor": lo == mid == hi, or a
 *     half-range with only one end): band and caps are skipped, the marker
 *     alone renders , never a band with one invented end (M9).
 *   - Self-omit (M9): no `mid`, no row; the axis omits when `ticks` is
 *     empty; the whole component renders nothing below 1 row. A domain that
 *     cannot position anything (hi <= lo, or a log scale over a non-positive
 *     edge) renders nothing , a broken axis cannot be drawn honestly.
 *   - Caption coupling (M7): the tick formatter is the `fmt` prop, the same
 *     function the caller derives row `display` strings from , an axis in
 *     $K over rows printed in raw dollars is the M7 species.
 *   - Text-on-fill (M4): none , the rail carries no text.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Fig } from "./Fig";

export type RangeRow = {
  label: string;
  /** mid required; lo/hi only count as a pair. */
  lo: number | null;
  mid: number;
  hi: number | null;
  /** Printed value for the mid ("$44K"). */
  display: string;
};

export interface RangeProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: RangeRow[];
  /** Explicit lo/hi of the axis; never inferred silently. */
  domain: [number, number];
  /** Position math owned by the component. */
  scale?: "linear" | "log";
  /** Axis ticks, formatted via `fmt`. */
  ticks: number[];
  fmt: (n: number) => string;
}

const AXIS_RAIL_HEIGHT_PX = 16; // the mockups' inline axis rail height

const Range = React.forwardRef<HTMLDivElement, RangeProps>(
  ({ rows, domain, scale = "linear", ticks, fmt, className, ...props }, ref) => {
    const [d0, d1] = domain;
    if (
      !Number.isFinite(d0) ||
      !Number.isFinite(d1) ||
      d1 <= d0 ||
      (scale === "log" && d0 <= 0)
    ) {
      return null;
    }

    const pos = (v: number): number => {
      const p =
        scale === "log"
          ? (Math.log(v / d0) / Math.log(d1 / d0)) * 100
          : ((v - d0) / (d1 - d0)) * 100;
      return Math.min(100, Math.max(0, p));
    };

    const renderable = rows.filter((r) => Number.isFinite(r.mid));
    if (renderable.length === 0) return null;

    const axisTicks = ticks.filter((t) => Number.isFinite(t) && (scale !== "log" || t > 0));

    return (
      <div ref={ref} className={cn("range", className)} {...props}>
        {renderable.map((r, i) => {
          const hasBand =
            r.lo != null &&
            r.hi != null &&
            Number.isFinite(r.lo) &&
            Number.isFinite(r.hi) &&
            r.hi > r.lo &&
            (scale !== "log" || r.lo > 0);
          const L = hasBand ? pos(r.lo as number) : 0;
          const H = hasBand ? pos(r.hi as number) : 0;
          const M = pos(r.mid);
          return (
            <div className="r" key={i}>
              <span className="l">{r.label}</span>
              <span className="rail">
                {hasBand ? (
                  <>
                    <span className="b" style={{ left: `${L}%`, width: `${H - L}%` }} />
                    <span className="c" style={{ left: `${L}%` }} />
                    <span className="c" style={{ left: `${H}%` }} />
                  </>
                ) : null}
                <span className="m" style={{ left: `${M}%` }} />
              </span>
              <Fig className="v" value={r.display} />
            </div>
          );
        })}
        {axisTicks.length > 0 ? (
          <div className="r axis">
            <span />
            <span className="rail" style={{ height: AXIS_RAIL_HEIGHT_PX }}>
              {axisTicks.map((t, i) => (
                <span className="tk" style={{ left: `${pos(t)}%` }} key={i}>
                  {fmt(t)}
                </span>
              ))}
            </span>
            <span />
          </div>
        ) : null}
      </div>
    );
  },
);
Range.displayName = "Range";

export { Range };
