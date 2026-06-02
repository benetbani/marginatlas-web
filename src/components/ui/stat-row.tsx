/**
 * src/components/ui/stat-row.tsx
 *
 * A single horizontal label-to-value row: label on the left, a tabular-nums
 * value on the right, a hairline rule beneath. Stack several to build the
 * compact stat lists the cell-page panels and the v2 hero use well. This is
 * the row counterpart to StatCard (the vertical KPI tile); use StatRow when
 * many small facts stack, StatCard when one number leads.
 *
 * Missing value renders a muted hyphen, never undefined or NaN.
 *
 * Design system, 2026-06-02.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface StatRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-side label. */
  label: React.ReactNode;
  /** Right-side value. Caller formats it; null renders a muted hyphen. */
  value: React.ReactNode;
  /** Show the bottom hairline. Default true; the last row can pass false. */
  divider?: boolean;
}

const StatRow = React.forwardRef<HTMLDivElement, StatRowProps>(
  ({ className, label, value, divider = true, ...props }, ref) => {
    const isEmpty =
      value == null || (typeof value === "string" && value.trim() === "");

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-baseline justify-between gap-4 py-2",
          divider && "border-b border-parchment last:border-b-0",
          className,
        )}
        {...props}
      >
        <span className="text-sm text-cocoa-700">{label}</span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isEmpty ? "text-cocoa-700/40" : "text-ink-900",
          )}
        >
          {isEmpty ? "-" : value}
        </span>
      </div>
    );
  },
);
StatRow.displayName = "StatRow";

export { StatRow };
