/**
 * src/components/spine2/ShrinkBars.tsx
 *
 * One monotonically shrinking quantity as proportional horizontal bars with
 * the figure printed inside. The BATCH-B dwindle+drain merge:
 *
 *   variant 'ramp'  , the dwindle (cell 04): a bill shrinking through cost
 *                     stages, tone stepping lighter as the money drains,
 *                     the kept remainder terracotta.
 *   variant 'track' , the drain (cell 12): cohort survival on a full-width
 *                     100% rail (the B6 fix: without the rail, 94% draws as
 *                     "everything survived").
 *
 * Contract (BATCH-B + PORT-CONTRACT):
 * - width% = remaining / start * 100. Nothing positional in props.
 * - MONOTONICITY ASSERT: the form's whole claim is shrinkage, so a rising
 *   `remaining` is a data bug , it THROWS in dev, and in production the
 *   component omits (a lying shrink chart is worse than absence).
 * - M5: KEEP = the last stage, terracotta, derived by position , ramp variant
 *   only. The track variant has no answer (a survival funnel has none, and
 *   A4 banned accent-as-default); its first-bar emphasis derives by index.
 * - M9, derived from the variant, never a prop:
 *     ramp  = omission 'all'  , the chain is the arithmetic; a missing stage
 *             breaks "after X, after Y" and the whole component omits.
 *     track = omission 'row'  , survival years are independent measured
 *             readings; a missing year omits its row and the rest stand.
 * - M4 text-on-fill AS CODE: the fill->text table below is the contract
 *   (n1 white, n2 white, n3 ink, n4 ink, terra white). The component sets
 *   both fill and text colour from it, so a bar can never carry a figure
 *   the fill cannot hold.
 * - M7: the ramp caption ("Seven cents in the dollar...") receives the
 *   derived kept share, `stages[last].remaining / start` , the same division
 *   the last bar's width draws.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { ChartFigure } from "./ChartFigure";

type Fill = "n1" | "n2" | "n3" | "n4" | "terra";

/** M4: which text colour each fill can carry. n1/n2 white, n3+ ink, terra white. */
const TEXT_ON_FILL: Record<Fill, "white" | "ink"> = {
  n1: "white",
  n2: "white",
  n3: "ink",
  n4: "ink",
  terra: "white",
};

/** The ramp's tone steps for non-final stages (v6 fourth-beat fix); last = terra. */
const RAMP_TONES: Fill[] = ["n2", "n3", "n4"];

export type ShrinkStage = {
  label: string;
  /** The bold second line in the ramp's label column ("$13 left"). Ramp only. */
  sub?: string;
  /** The quantity remaining at this stage; null/undefined = missing (see M9). */
  remaining: number | null | undefined;
};

export interface ShrinkBarsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The 100% quantity ($38 for the bill, 100 for a survival cohort). */
  start: number;
  /** Monotonically non-increasing; asserted. */
  stages: ShrinkStage[];
  variant?: "ramp" | "track";
  /** The figure printed inside each bar. Default: track "94%", ramp String(v). */
  inBarFmt?: (v: number) => string;
  /** Track only: the first bar's long form ("94% still trading"). Defaults to inBarFmt. */
  firstBarFmt?: (v: number) => string;
  /** Ramp only (M7): the .note-in caption, fed the derived kept share (0..1). */
  note?: (keptShare: number) => React.ReactNode;
}

function barStyle(widthPct: number, fill: Fill): React.CSSProperties {
  return {
    width: `${+widthPct.toFixed(2)}%`,
    background: `var(--${fill})`,
    color: TEXT_ON_FILL[fill] === "ink" ? "var(--ink)" : "var(--white)",
  };
}

const ShrinkBars = React.forwardRef<HTMLDivElement, ShrinkBarsProps>(
  ({ start, stages, variant = "ramp", inBarFmt, firstBarFmt, note, className, ...props }, ref) => {
    if (!Number.isFinite(start) || start <= 0) return null;

    const missing = (s: ShrinkStage) => s.remaining == null || !Number.isFinite(s.remaining);

    // M9, derived from the variant: ramp omits whole, track omits row-wise.
    if (variant === "ramp" && stages.some(missing)) return null;
    const live = stages.filter((s) => !missing(s)) as Array<
      ShrinkStage & { remaining: number }
    >;
    if (live.length === 0) return null;

    // Monotonicity assert: rising remaining is a data bug, not a style choice.
    let prev = start;
    for (const s of live) {
      if (s.remaining > prev) {
        const msg =
          `ShrinkBars: remaining rose (${prev} -> ${s.remaining} at "${s.label}"); ` +
          "the form's claim is shrinkage. Fix the data.";
        if (process.env.NODE_ENV !== "production") throw new Error(msg);
        console.error(msg);
        return null;
      }
      prev = s.remaining;
    }

    if (variant === "track") {
      const fmt = inBarFmt ?? ((v: number) => `${v}%`);
      const firstFmt = firstBarFmt ?? fmt;
      return (
        <div ref={ref} className={cn("drain", className)} {...props}>
          {live.map((s, i) => {
            const fill: Fill = i === 0 ? "n1" : "n2";
            return (
              <div className="step" key={s.label}>
                <span className="yr">{s.label}</span>
                <div className="track">
                  <div className="bar" style={barStyle((s.remaining / start) * 100, fill)}>
                    {i === 0 ? firstFmt(s.remaining) : fmt(s.remaining)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // ramp: tone steps by index, KEEP = last stage, terracotta, by position.
    const fmt = inBarFmt ?? ((v: number) => String(v));
    const last = live.length - 1;
    const keptShare = live[last].remaining / start;
    return (
      <ChartFigure caption={note ? note(keptShare) : undefined}>
        <div ref={ref} className={cn("dwindle", className)} {...props}>
          {live.map((s, i) => {
            const keep = i === last;
            const fill: Fill = keep ? "terra" : RAMP_TONES[Math.min(i, RAMP_TONES.length - 1)];
            return (
              <div className={cn("d", keep && "keep")} key={s.label}>
                <span className="lb">
                  {s.label}
                  {s.sub ? <b>{s.sub}</b> : null}
                </span>
                <span className="bar" style={barStyle((s.remaining / start) * 100, fill)}>
                  {fmt(s.remaining)}
                </span>
              </div>
            );
          })}
        </div>
      </ChartFigure>
    );
  },
);
ShrinkBars.displayName = "ShrinkBars";

export { ShrinkBars, TEXT_ON_FILL };
