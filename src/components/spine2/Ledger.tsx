/**
 * src/components/spine2/Ledger.tsx
 *
 * The confidence ledger: per-figure provenance , what the figure is, how
 * solid (TierPill), where it comes from. Built on the RowLattice frame; the
 * three-column grid, zebra and responsive `how`-column drop live in the
 * scoped stylesheet.
 *
 * Per BATCH-A:
 *   - a row with no `tier` never renders (a provenance row that cannot state
 *     its provenance is the one row this component must never fake);
 *   - `how` omits per-row;
 *   - `header: false` + `bare` is the embedded/frameless variant the method
 *     card nests (cell §18);
 *   - zero rows renders nothing , though a data page without a ledger should
 *     be treated as a build error upstream, not a silent omit.
 *
 * `tierTally(rows)` is exported for the trust strip (M7: the "3 measured,
 * 3 built, 1 thin" tally must be DERIVED from the same rows the ledger
 * renders, never typed by hand).
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { RowLattice } from "./RowLattice";
import { TierPill } from "./TierPill";
import { TIERS, type Tier } from "./tiers";

export type LedgerRow = {
  /** What the figure is. */
  label: string;
  tier: Tier | null;
  /** Where it comes from; null renders the row without it. */
  how: string | null;
};

export interface LedgerProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: LedgerRow[];
  /** false for the nested/bare variant (cell §18 has no header row). */
  header?: boolean;
  /** Embedded/frameless (inside the method card); set by the parent. */
  bare?: boolean;
}

/** Count rows by tier , the trust strip's tally source (structural M7). */
export function tierTally(rows: LedgerRow[]): Record<Tier, number> {
  const tally = { measured: 0, built: 0, thin: 0 } as Record<Tier, number>;
  for (const r of rows) {
    if (r.tier != null && TIERS.includes(r.tier)) tally[r.tier]++;
  }
  return tally;
}

const Ledger = React.forwardRef<HTMLDivElement, LedgerProps>(
  ({ rows, header = true, bare, className, ...props }, ref) => {
    const renderable = rows.filter((r) => r.tier != null);
    if (renderable.length === 0) return null;

    return (
      <RowLattice
        ref={ref}
        frame="ledger"
        bare={bare}
        className={cn(className)}
        headerBand={
          header ? (
            <div className="lh">
              <span>What the figure is</span>
              <span>How solid</span>
              <span>Where it comes from</span>
            </div>
          ) : null
        }
        {...props}
      >
        {renderable.map((r, i) => (
          <div className="lr" key={i}>
            <span className="nm">{r.label}</span>
            <span>
              <TierPill tier={r.tier} />
            </span>
            {r.how != null && r.how !== "" ? <span className="how">{r.how}</span> : null}
          </div>
        ))}
      </RowLattice>
    );
  },
);
Ledger.displayName = "Ledger";

export { Ledger };
