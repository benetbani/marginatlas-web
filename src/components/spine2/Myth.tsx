/**
 * src/components/spine2/Myth.tsx
 *
 * Folklore, struck out, corrected: the claim (quiet, struck through in
 * neutral n3 after v10) versus the correction (dominant, carrying the page's
 * accent on its key phrase). Cell 12 / city 12 / country 18 (BATCH-A).
 *
 * THE COMPONENT OWNS THE HIERARCHY. The v10 fix (fix-list B18) exists because
 * the falsehood was once the biggest type in the card: the claim is now quiet
 * and struck in neutral, the fix dominates and keeps the only accent, and no
 * prop can restyle either. The "What everyone says" lab is part of the
 * device's fixed grammar (identical on all three mockup instances) and ships
 * inside the component for the same reason.
 *
 * Per BATCH-A, exactly:
 *   - whole-component self-omit (M9) unless BOTH `claim` and `fix` are
 *     present: a struck claim without its correction asserts nothing, and a
 *     correction without its claim is plain prose that belongs in a .note;
 *   - `note` omits alone (cell 12 has none, city 12 / country 18 do);
 *   - the pairing with evidence (a statblock, a drain) is COMPOSITION at the
 *     page, not a variant here;
 *   - text-on-fill (M4): none by construction.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface MythProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Rendered struck, quiet. */
  claim: string | null;
  /** The correction; its <b> is the accent carrier. */
  fix: React.ReactNode;
  note?: string | null;
}

const Myth = React.forwardRef<HTMLDivElement, MythProps>(
  ({ claim, fix, note, className, ...props }, ref) => {
    if (claim == null || claim === "" || fix == null) return null;

    return (
      <div ref={ref} className={cn("myth", className)} {...props}>
        <div className="lab" style={{ marginBottom: 12 }}>
          What everyone says
        </div>
        <p className="claim">{claim}</p>
        <p className="fix">{fix}</p>
        {note != null && note !== "" ? (
          <p className="note" style={{ marginTop: 16 }}>
            {note}
          </p>
        ) : null}
      </div>
    );
  },
);
Myth.displayName = "Myth";

export { Myth };
