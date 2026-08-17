/**
 * src/components/ui/percent.tsx
 *
 * Percent-rendering primitive. tabular-nums by default; optional
 * sign indicator for delta percentages (e.g. YoY change), with
 * semantic color via moss / clay tokens.
 *
 * Three modes:
 *   - plain        : "32%" — neutral, no sign
 *   - signed       : "+32%" / "-15%" — always shows sign
 *   - signed-color : "+32%" in moss-700 / "-15%" in clay-700,
 *                    consumer can override via `positiveClass` /
 *                    `negativeClass` if a section needs different
 *                    semantics (e.g. cost growth where + is bad)
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface PercentProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The value to render. Pass as the fraction (0.32 = 32%) by default, or as the whole number (32 = 32%) if `asWhole` is true. */
  value: number | null | undefined;
  /** If true, `value` is already the whole percent (e.g. 32 not 0.32). Default false. */
  asWhole?: boolean;
  /** Display mode. Default "plain". */
  mode?: "plain" | "signed" | "signed-color";
  /** Decimal places. Default 0. */
  fractionDigits?: number;
  /** Tailwind class for positive values when mode = signed-color. */
  positiveClass?: string;
  /** Tailwind class for negative values when mode = signed-color. */
  negativeClass?: string;
}

const Percent = React.forwardRef<HTMLSpanElement, PercentProps>(
  (
    {
      className,
      value,
      asWhole = false,
      mode = "plain",
      fractionDigits = 0,
      positiveClass = "text-atlas-700",
      negativeClass = "text-clay-700",
      ...props
    },
    ref,
  ) => {
    if (value == null || !isFinite(value) || isNaN(value)) {
      return (
        <span ref={ref} className={cn("tabular-nums", className)} {...props}>
          -
        </span>
      );
    }
    const whole = asWhole ? value : value * 100;
    const formatted = whole.toFixed(fractionDigits);
    const sign = mode !== "plain" ? (whole >= 0 ? "+" : "") : "";
    // `formatted` already includes "-" for negatives; sign just adds the "+".
    const display = `${sign}${formatted}%`;
    const colorClass =
      mode === "signed-color"
        ? whole >= 0
          ? positiveClass
          : negativeClass
        : undefined;

    return (
      <span
        ref={ref}
        className={cn("tabular-nums", colorClass, className)}
        {...props}
      >
        {display}
      </span>
    );
  },
);
Percent.displayName = "Percent";

export { Percent };
