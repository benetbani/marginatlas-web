/**
 * src/components/spine2/ColSplit.tsx
 *
 * `col-split` (BATCH-A): a vertical proportional money column , every
 * dollar of revenue (or cost) split top-to-bottom, segment heights exactly
 * the money (v6 A2: flex-basis 0, padding on the labels, so the stated
 * proportions are true).
 *
 * Interface per BATCH-A, exactly:
 *   - Text-on-fill (M4), the load-bearing case: the in-fill text colour is
 *     DERIVED from `tone`, never a prop. n1/n2 carry white (7.1:1 / 5.0:1),
 *     n3 and lighter carry ink (the `.lt` class), the kept segment carries
 *     white on the terra gradient. No third option, no override.
 *   - `thin` is derived too: a segment whose computed height cannot hold
 *     its label renders unlabeled and its label falls to the legend below.
 *   - `kept` is the answer segment (terracotta gradient); max one, enforced
 *     , extras render on their own tone with a dev-time error.
 *   - Self-omit (M9), whole-component: a partition with a missing segment
 *     is a lie. A null/non-positive value, or a sum drifting more than ±2
 *     (ShareStack's tolerance) from the stated whole, renders NOTHING.
 *     No row-level omission is possible.
 *   - Caption coupling (M7): `legendNote` and the thin segment's legend
 *     entry render from the same segments array, in one SwatchLegend.
 *   - Segment order is authored (the money's own narrative), never sorted.
 *   - `total` (beyond the BATCH-A prop list): the ±2 drift rule needs the
 *     stated whole to drift FROM; defaults to 100 (every mockup instance is
 *     a per-$100 or per-cent split).
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { SwatchLegend } from "./SwatchLegend";

export type ColSplitTone = "n1" | "n2" | "n3" | "n4" | "n5";

export type ColSeg = {
  label: string;
  /** The money/share; height IS this number. */
  value: number;
  /** Printed figure ("34%", "$34"). */
  display: string;
  /** Ramp position; text colour DERIVED from this (M4). */
  tone: ColSplitTone;
  /** The answer segment (terracotta gradient); max one. */
  kept?: boolean;
};

export interface ColSplitProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must partition the stated whole. */
  segments: ColSeg[];
  /** Column height in px; the stylesheet default is 420. */
  height?: number;
  /** The honesty note ("Heights are exactly proportional..."). */
  legendNote?: string | null;
  /** The stated whole the segments must partition (±2). Default 100. */
  total?: number;
}

const SUM_TOLERANCE = 2;
const DEFAULT_HEIGHT_PX = 420; // the stylesheet's .col-split height
/** Below this computed px height a label cannot sit in the band (11px label
 *  padding + the line itself); the segment renders thin, label to legend. */
const LABEL_MIN_PX = 18;

/** M4: n1/n2 carry white (stylesheet default); n3+ carry ink via .lt. */
const INK_TONES: ReadonlySet<ColSplitTone> = new Set(["n3", "n4", "n5"]);

const ColSplit = React.forwardRef<HTMLDivElement, ColSplitProps>(
  ({ segments, height, legendNote, total = 100, className, ...props }, ref) => {
    // M9: a partition with a hole renders nothing.
    if (segments.length === 0) return null;
    if (segments.some((s) => s.value == null || !Number.isFinite(s.value) || s.value <= 0)) {
      return null;
    }
    const sum = segments.reduce((a, s) => a + s.value, 0);
    if (Math.abs(sum - total) > SUM_TOLERANCE) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `ColSplit: segments sum to ${sum} against a stated whole of ${total}; ` +
            "a partition with a hole renders nothing.",
        );
      }
      return null;
    }

    const keptCount = segments.filter((s) => s.kept).length;
    if (process.env.NODE_ENV !== "production" && keptCount > 1) {
      console.error(
        `ColSplit: at most one kept segment; got ${keptCount}. ` +
          "Only the first keeps the gradient.",
      );
    }

    const columnPx = height ?? DEFAULT_HEIGHT_PX;
    let keptUsed = false;
    const resolved = segments.map((s) => {
      const isKept = Boolean(s.kept) && !keptUsed;
      if (s.kept) keptUsed = true;
      // Kept segments centre their label (padding 0), so they hold it at any
      // height; ramp segments go thin when the band cannot hold the label.
      const thin = !isKept && (s.value / sum) * columnPx < LABEL_MIN_PX;
      return { ...s, isKept, thin };
    });

    const legendItems = resolved
      .filter((s) => s.thin)
      .map((s) => ({ label: s.label, figure: s.display, tone: s.tone }));

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div
          className="col-split"
          style={height != null ? { height } : undefined}
        >
          {resolved.map((s, i) =>
            s.isKept ? (
              <div className="seg answer" style={{ flex: s.value }} key={i}>
                <span className="nm">{s.label}</span>
                <span className="v">{s.display}</span>
              </div>
            ) : (
              <div
                className={cn("seg", INK_TONES.has(s.tone) && "lt", s.thin && "thin")}
                style={{ flex: s.value, background: `var(--${s.tone})` }}
                key={i}
              >
                {s.thin ? null : (
                  <>
                    <span className="nm">{s.label}</span>
                    <span className="v">{s.display}</span>
                  </>
                )}
              </div>
            ),
          )}
        </div>
        {legendItems.length > 0 || legendNote ? (
          <SwatchLegend items={legendItems} note={legendNote ?? undefined} />
        ) : null}
      </div>
    );
  },
);
ColSplit.displayName = "ColSplit";

export { ColSplit };
