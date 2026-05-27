/**
 * src/components/ui/number.tsx
 *
 * Generic number-rendering primitive. Locale-aware comma separation,
 * tabular-nums, optional unit suffix. Use for counts (n_enterprises,
 * employees, etc.) where neither currency nor percent is right.
 *
 * Compact mode: when `compact` is true, large values render with
 * K / M / B suffixes (same compaction as Money but without the
 * currency symbol). Useful for axis labels and stat cards.
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

function compactFormat(v: number): string {
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${Math.round(abs)}`;
}

export interface NumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The value to render. null / NaN / Infinity render as "-". */
  value: number | null | undefined;
  /** Optional unit suffix, e.g. "firms", "employees". */
  unit?: string;
  /** Use compact K/M/B suffixes. Default false. */
  compact?: boolean;
  /** Decimal places. Default 0. Only applied when `compact` is false. */
  fractionDigits?: number;
}

const NumberDisplay = React.forwardRef<HTMLSpanElement, NumberProps>(
  ({ className, value, unit, compact = false, fractionDigits = 0, ...props }, ref) => {
    if (value == null || !isFinite(value) || isNaN(value)) {
      return (
        <span ref={ref} className={cn("tabular-nums", className)} {...props}>
          -
        </span>
      );
    }
    const numeric = compact
      ? compactFormat(value)
      : value.toLocaleString(undefined, {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        });
    const display = unit ? `${numeric} ${unit}` : numeric;

    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        {display}
      </span>
    );
  },
);
NumberDisplay.displayName = "NumberDisplay";

export { NumberDisplay as Number };
