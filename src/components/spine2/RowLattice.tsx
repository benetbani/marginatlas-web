/**
 * src/components/spine2/RowLattice.tsx
 *
 * The shared lattice base extracted while building Statblock (BATCH-A
 * dependency order, step 2): the frame, the optional header band slot, and
 * the A7 bare/de-chrome state. The icon rail, zebra, inset row rules and the
 * hover read-band are carried by the scoped stylesheet against the frame
 * class (`statblock`, `ledger`, `eight`, `readcol`, `hoodcards`), which is
 * why the base takes the frame class rather than re-implementing those
 * mechanics per family.
 *
 * A7 (bare): BATCH-A sketched a React context set by Panel, but the kit is
 * server-rendered (COMPONENT-BUDGET: "client components: exactly two") and
 * React context does not exist in server components, so `bare` is a plain
 * prop. Two paths cover every A7 case:
 *   1. A statblock DIRECTLY inside .panel.pad de-chromes purely in CSS
 *      (`.panel.pad>.statblock` in the stylesheet) , no prop needed.
 *   2. Any other nesting (the ledger inside .method, blocks in .more bodies)
 *      passes `bare`, which applies the same inline de-chrome the mockups
 *      themselves use (cell §18: style="border:0;border-radius:0").
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** The A7 de-chrome, matching what `.panel.pad>.statblock` does in CSS. */
export const BARE_STYLE: React.CSSProperties = {
  border: 0,
  borderRadius: 0,
  background: "transparent",
  boxShadow: "none",
};

export interface RowLatticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The frame class the stylesheet keys on: "statblock", "ledger", ... */
  frame: string;
  /** Pre-built header band (.hd for statblock, .lh for ledger); null omits. */
  headerBand?: React.ReactNode;
  /** A7: shed frame, radius, background (card-in-card / embedded contexts). */
  bare?: boolean;
}

const RowLattice = React.forwardRef<HTMLDivElement, RowLatticeProps>(
  ({ frame, headerBand, bare, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(frame, className)}
      style={bare ? { ...BARE_STYLE, ...style } : style}
      {...props}
    >
      {headerBand}
      {children}
    </div>
  ),
);
RowLattice.displayName = "RowLattice";

export { RowLattice };
