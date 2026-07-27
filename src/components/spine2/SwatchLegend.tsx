/**
 * src/components/spine2/SwatchLegend.tsx
 *
 * The `.col-legend` swatch row, extracted as a shared atom because it is used
 * standalone by col-split, sbar, dots and wealth (BATCH-A). Each item is a
 * swatch (tone from the neutral ramp or the accent), a label, and an optional
 * `<b>` figure. The optional trailing `note` is the honesty sentence
 * (cell §06: "Heights are exactly proportional...") rendered as the muted
 * legend entry the mockup uses, so note and legend stay one object (M7).
 *
 * Tones resolve to CSS variables only, never raw color.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type SwatchTone = "terra" | "ink" | "n1" | "n2" | "n3" | "n4" | "n5";

export interface SwatchLegendItem {
  label: React.ReactNode;
  /** Printed figure ("4%", "$25"); omits alone when null. */
  figure?: string | null;
  /** Swatch tone; null renders the item without a swatch. */
  tone?: SwatchTone | null;
}

export interface SwatchLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SwatchLegendItem[];
  /** The muted trailing sentence (the mockups' honesty note). */
  note?: string | null;
}

const SwatchLegend = React.forwardRef<HTMLDivElement, SwatchLegendProps>(
  ({ items, note, className, ...props }, ref) => {
    const renderable = items.filter((it) => it.label != null);
    if (renderable.length === 0 && !note) return null;
    return (
      <div ref={ref} className={cn("col-legend", className)} {...props}>
        {renderable.map((it, i) => (
          <span className="li" key={i}>
            {it.tone ? (
              <span className="sw" style={{ background: `var(--${it.tone})` }} />
            ) : null}
            {it.label}
            {it.figure != null && it.figure !== "" ? <b>{it.figure}</b> : null}
          </span>
        ))}
        {note ? (
          <span className="li" style={{ color: "var(--muted)" }}>
            {note}
          </span>
        ) : null}
      </div>
    );
  },
);
SwatchLegend.displayName = "SwatchLegend";

export { SwatchLegend };
