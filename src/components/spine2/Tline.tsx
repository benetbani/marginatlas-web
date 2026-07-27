/**
 * src/components/spine2/Tline.tsx
 *
 * The opening timeline (country 05): steps as gantt lanes on a shared weeks
 * axis. Bar offset is when the step can start, width is how long it takes,
 * the value column carries its cash cost (or "free"), and the slow lane is
 * accented. BATCH-B "tline", port risk 2.
 *
 * Contract (BATCH-B + PORT-CONTRACT):
 * - left% = startWk/spanWk, width% = durWk/spanWk. No percentages in props.
 * - M5: CRITICAL = argmax(durWk), DERIVED, terracotta , the step that sets
 *   the opening date. (The mockup hand-sets `lane slow` on the bank; the
 *   derivation reproduces it and holds for every country.) First on a tie.
 * - M9: a step missing startWk or durWk omits its lane (its cost, if real,
 *   belongs in the side statblock as a fact). If the critical step is among
 *   the missing, the accent lands on the longest remaining , same rule.
 *   Zero renderable lanes omits the component.
 * - M6: lane labels live in the fixed left column, no collision. Axis ticks
 *   name both poles (>= 2 ticks asserted; the scale row omits, with a dev
 *   error, on fewer). Ticks render evenly spaced across the track column,
 *   exactly the mockup's form , supply evenly spaced atWk with the last at
 *   the span end.
 * - Span contract: a step past the drawn axis clamps to the span edge and
 *   errors in dev , widen spanWk rather than letting a lane escape the plot.
 * - M7: the owning section's "5 weeks / able to take money" figures must
 *   interpolate steps[CRITICAL].startWk + durWk , the same numbers the
 *   accented lane draws. `criticalEndWk` computes it for the caller.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export type TStep = {
  label: string;
  icon?: GlyphId;
  /** Week the step can start; null/undefined omits the lane (M9). */
  startWk: number | null | undefined;
  /** How long it takes, in weeks; null/undefined omits the lane (M9). */
  durWk: number | null | undefined;
  /** The value column: cash cost ("$60", "free") or a duration ("5 wk"). */
  cost: string;
};

export type Tick = { atWk: number; label: string };

export interface TlineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TStep[];
  /** The drawn axis span, in weeks. */
  spanWk: number;
  /** Both poles named (M6): at least 2, first at 0, last at the span end. */
  ticks: Tick[];
}

type LiveStep = TStep & { startWk: number; durWk: number };

function liveSteps(steps: TStep[]): LiveStep[] {
  return steps.filter(
    (s): s is LiveStep =>
      s.startWk != null &&
      Number.isFinite(s.startWk) &&
      s.durWk != null &&
      Number.isFinite(s.durWk),
  );
}

/** M5: the index (within renderable steps) of the step that sets the opening date. */
export function criticalIndex(steps: TStep[]): number | null {
  const live = liveSteps(steps);
  if (live.length === 0) return null;
  let best = 0;
  live.forEach((s, i) => {
    if (s.durWk > live[best].durWk) best = i;
  });
  return best;
}

/** M7: the week the critical step completes , the figure captions must interpolate. */
export function criticalEndWk(steps: TStep[]): number | null {
  const live = liveSteps(steps);
  const ci = criticalIndex(steps);
  if (ci == null) return null;
  return live[ci].startWk + live[ci].durWk;
}

const pctStr = (n: number) => `${+(n * 100).toFixed(2)}%`;

const Tline = React.forwardRef<HTMLDivElement, TlineProps>(
  ({ steps, spanWk, ticks, className, ...props }, ref) => {
    if (!Number.isFinite(spanWk) || spanWk <= 0) return null;
    const live = liveSteps(steps);
    if (live.length === 0) return null;

    const critical = criticalIndex(steps);

    if (process.env.NODE_ENV !== "production" && ticks.length < 2) {
      console.error("Tline: ticks must name both poles (>= 2); the scale row is omitted.");
    }

    return (
      <div ref={ref} className={cn("tline", className)} {...props}>
        {live.map((s, i) => {
          const left = Math.min(Math.max(s.startWk / spanWk, 0), 1);
          const width = Math.min(s.durWk / spanWk, 1 - left);
          if (
            process.env.NODE_ENV !== "production" &&
            s.startWk + s.durWk > spanWk + 1e-9
          ) {
            console.error(
              `Tline: "${s.label}" ends at week ${s.startWk + s.durWk}, past the ` +
                `${spanWk}-week axis; clamped. Widen spanWk.`,
            );
          }
          return (
            <div className={cn("lane", i === critical && "slow")} key={s.label}>
              <span className="nm">
                {s.icon ? <GlyphIcon id={s.icon} size={18} /> : null}
                {s.label}
              </span>
              <span className="track">
                <i style={{ left: pctStr(left), width: pctStr(width) }} />
              </span>
              <span className="v">{s.cost}</span>
            </div>
          );
        })}
        {ticks.length >= 2 ? (
          <div className="scale">
            <span />
            <span className="s">
              {ticks.map((t) => (
                <span key={t.label}>{t.label}</span>
              ))}
            </span>
            <span />
          </div>
        ) : null}
      </div>
    );
  },
);
Tline.displayName = "Tline";

export { Tline };
