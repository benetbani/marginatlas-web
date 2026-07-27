/**
 * src/components/spine2/Scale.tsx
 *
 * `scale` (BATCH-A): ranked horizontal bars against one shared implied
 * track , positions/magnitudes of siblings on a common measure (rent
 * multiples, savings, pressures, stability).
 *
 * Interface per BATCH-A, exactly:
 *   - `value` is the bar length as a percentage of the shared track,
 *     resolved by the caller as the row's share of the instance max or of a
 *     stated scale (country 17's bars are positions against the world
 *     median, NOT shares of their own max , only the caller knows which).
 *   - No `hi` flag on rows (M5): the accent row is DERIVED from `accent` +
 *     values , the unique max ("max") or unique min ("min"). A section
 *     whose answer is not an extreme has no accent (`accent` null/absent),
 *     and a tied extreme accents nothing (the answer must be one row).
 *   - Ordering (M7): section labs state the order ("lightest first"), so
 *     the component sorts by value rather than trusting array order , the
 *     caption cannot lie about a render the component itself sorted. The
 *     direction is taken from the caller's array (first vs last renderable
 *     value), then enforced strictly.
 *   - Self-omit (M9): a row with a null value drops; the whole component
 *     renders nothing under 2 rows , one bar against nothing ranks nothing.
 *   - Text-on-fill (M4): none , bars are 5px tracks and carry no text.
 *   - `gap` "wide" is city §08's 22px row rhythm (inline in the mockup; no
 *     stylesheet class exists for it, so it stays an inline style here).
 */
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Fig } from "./Fig";
import { TrackBar } from "./TrackBar";

export type ScaleRow = {
  label: string;
  /** Bar length, share of the instance max (or stated scale), 0-100. */
  value: number | null;
  /** The value column: figure or word ("x1.1", "+9%", "strong"). */
  display: string;
};

export interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: ScaleRow[];
  /** Which extreme is the section's answer; the hi row is DERIVED (M5). */
  accent?: "max" | "min" | null;
  gap?: "default" | "wide";
}

const scaleVariants = cva("scale", {
  variants: {
    gap: { default: "", wide: "" },
  },
  defaultVariants: { gap: "default" },
});

const WIDE_GAP_PX = 22;

const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ rows, accent, gap = "default", className, style, ...props }, ref) => {
    const renderable = rows.filter(
      (r): r is ScaleRow & { value: number } =>
        r.value != null && Number.isFinite(r.value),
    );
    if (renderable.length < 2) return null;

    // M7: the render is sorted by value; direction follows the caller's array.
    const ascending =
      renderable[renderable.length - 1].value >= renderable[0].value;
    const sorted = [...renderable].sort((a, b) =>
      ascending ? a.value - b.value : b.value - a.value,
    );

    // M5: the accent row is derived , the unique extreme, or nothing.
    let hiIndex = -1;
    if (accent === "max" || accent === "min") {
      const pick =
        accent === "max"
          ? Math.max(...sorted.map((r) => r.value))
          : Math.min(...sorted.map((r) => r.value));
      const at = sorted.filter((r) => r.value === pick);
      if (at.length === 1) hiIndex = sorted.findIndex((r) => r.value === pick);
    }

    return (
      <div
        ref={ref}
        className={cn(scaleVariants({ gap }), className)}
        style={gap === "wide" ? { gap: WIDE_GAP_PX, ...style } : style}
        {...props}
      >
        {sorted.map((r, i) => (
          <div className={cn("r", i === hiIndex && "hi")} key={i}>
            <span className="l">{r.label}</span>
            <TrackBar pct={r.value} />
            <Fig className="v" value={r.display} />
          </div>
        ))}
      </div>
    );
  },
);
Scale.displayName = "Scale";

export { Scale, scaleVariants };
