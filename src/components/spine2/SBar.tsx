/**
 * src/components/spine2/SBar.tsx
 *
 * `sbar` (BATCH-A): a one-line proportional split , segments flex-weighted
 * to their values with 2px gaps, ALL labels carried by the SwatchLegend
 * below, never in-bar. "What the $36 is made of", "how a household spends
 * $100".
 *
 * Interface per BATCH-A:
 *   - Text-on-fill (M4): NO text on any fill , that is this component's
 *     contract; the legend is the sole label carrier. (In-bar labels belong
 *     to the future `wealth .spread` variant, not here.)
 *   - Accent budget: at most one `terra` segment, enforced , extras render
 *     in ink with a dev-time error, so the accent cannot become wallpaper.
 *   - Caption coupling (M7): legend entries and segment widths are ONE
 *     array , a legend that says $25 over a segment flexed to 24 is the M7
 *     species; the single `segments` source makes it structurally impossible.
 *   - Self-omit (M9): a partition with a hole misleads , a null/non-positive
 *     value, or a sum drifting more than ±2 from the stated whole, renders
 *     NOTHING. The legend never omits independently while the bar renders.
 *   - `total` (beyond the BATCH-A prop list): the ±2 drift rule needs the
 *     stated whole to drift FROM. It defaults to 100 (every per-$100
 *     instance); the country hero passes 36, its stated all-in load.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { SwatchLegend } from "./SwatchLegend";

export type SBarTone = "terra" | "ink" | "n2" | "n3" | "n4" | "n5";

export type SBarSeg = {
  label: string;
  /** Flex weight; the split must partition the stated whole. */
  value: number;
  /** Legend figure ("$25"). */
  display: string;
  /** terra only on the answer share. */
  tone: SBarTone;
};

export interface SBarProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: SBarSeg[];
  /** Default true; the legend IS the label carrier. */
  legend?: boolean;
  /** The stated whole the segments must partition (±2). Default 100. */
  total?: number;
}

const SUM_TOLERANCE = 2;

const SBar = React.forwardRef<HTMLDivElement, SBarProps>(
  ({ segments, legend = true, total = 100, className, ...props }, ref) => {
    // M9: a partition with a hole renders nothing.
    if (segments.length === 0) return null;
    if (segments.some((s) => s.value == null || !Number.isFinite(s.value) || s.value <= 0)) {
      return null;
    }
    const sum = segments.reduce((a, s) => a + s.value, 0);
    if (Math.abs(sum - total) > SUM_TOLERANCE) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `SBar: segments sum to ${sum} against a stated whole of ${total}; ` +
            "a partition with a hole renders nothing.",
        );
      }
      return null;
    }

    // Accent budget: at most one terra segment.
    const terraCount = segments.filter((s) => s.tone === "terra").length;
    if (process.env.NODE_ENV !== "production" && terraCount > 1) {
      console.error(
        `SBar: at most one terra segment; got ${terraCount}. Extras render in ink.`,
      );
    }
    let terraUsed = false;
    const toned = segments.map((s) => {
      if (s.tone !== "terra") return s;
      if (!terraUsed) {
        terraUsed = true;
        return s;
      }
      return { ...s, tone: "ink" as const };
    });

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div className="sbar">
          {toned.map((s, i) => (
            <i key={i} style={{ flex: s.value, background: `var(--${s.tone})` }} />
          ))}
        </div>
        {legend ? (
          <SwatchLegend
            items={toned.map((s) => ({
              label: s.label,
              figure: s.display,
              tone: s.tone,
            }))}
          />
        ) : null}
      </div>
    );
  },
);
SBar.displayName = "SBar";

export { SBar };
