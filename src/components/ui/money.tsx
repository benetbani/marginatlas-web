/**
 * src/components/ui/money.tsx
 *
 * Canonical money-rendering primitive. Wraps the existing
 * `fmtMoney` formatter (src/lib/format/money.ts) with the design-
 * system guarantees every numeric UI on Atlas needs:
 *
 *   - tabular-nums so digits line up in tables, waterfalls, and
 *     stat cards (zero column shift when values change)
 *   - consistent "-" fallback for null / NaN / Infinity
 *   - aria-label that spells the value out for screen readers
 *     when the visual rendering compacts to "$3.2M"
 *
 * Use this anywhere a single currency amount renders. For
 * percent / count, use the sibling primitives.
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { fmtMoney } from "@/lib/format/money";

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The value to render. null / NaN / Infinity render as "-". */
  value: number | null | undefined;
  /** Currency symbol prefix. Default "$". */
  symbol?: string;
  /** Optional verbose aria-label override. */
  ariaLabel?: string;
}

const Money = React.forwardRef<HTMLSpanElement, MoneyProps>(
  ({ className, value, symbol = "$", ariaLabel, ...props }, ref) => {
    const display = fmtMoney(value, symbol);
    // For screen readers: spell out the exact value rather than the
    // compacted "$3.2M" form. "-" stays as-is (the visual fallback
    // is already meaningful to assistive tech).
    const srLabel =
      ariaLabel ??
      (value != null && isFinite(value) && !isNaN(value)
        ? `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : display);

    return (
      <span
        ref={ref}
        className={cn("tabular-nums", className)}
        aria-label={srLabel === display ? undefined : srLabel}
        {...props}
      >
        {display}
      </span>
    );
  },
);
Money.displayName = "Money";

export { Money };
