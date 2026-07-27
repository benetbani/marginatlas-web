/**
 * src/components/spine2/Fig.tsx
 *
 * The figure atom: a pre-formatted value plus the small quiet `.u` unit
 * suffix ("K", "%", "yr", "wk", "x UK"), used by ~10 components (statblock,
 * eight, scale, range, ledger, tiles...). BATCH-A atoms list, item 1.
 *
 * - `value` null/empty renders nothing (M9: never a dash, never a blank cell).
 * - `answer` adds the `.a` accent class; the ONE-answer budget is enforced by
 *   the owning block (e.g. Statblock), not here.
 * - The base class is `fig` (Space Grotesk, tabular numerals); owners layer
 *   their own value-cell class on top (Statblock passes className="v").
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface FigProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | null | undefined;
  /** Rendered as the small .u suffix after the value. */
  unit?: string | null;
  /** The answer accent (.a). Budgeted by the owning block. */
  answer?: boolean;
}

const Fig = React.forwardRef<HTMLSpanElement, FigProps>(
  ({ value, unit, answer, className, ...props }, ref) => {
    if (value == null || value === "") return null;
    return (
      <span ref={ref} className={cn("fig", className, answer && "a")} {...props}>
        {value}
        {unit ? <span className="u">{unit}</span> : null}
      </span>
    );
  },
);
Fig.displayName = "Fig";

export { Fig };
