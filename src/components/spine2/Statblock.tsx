/**
 * src/components/spine2/Statblock.tsx
 *
 * The binding primitive and the RowLattice reference implementation: a titled
 * set of label-value readings, one row per figure, optional icon rail.
 * 26 of the 60 shared-kit instances (BATCH-A).
 *
 * Interface per BATCH-A, exactly:
 *   - `value` null -> the row does not render (M9 pattern 2, never a dash).
 *   - zero renderable rows -> the whole block renders nothing.
 *   - `answer` is an authored editorial role, at most ONE per block; the
 *     component enforces the budget (extra answers render unaccented, with a
 *     dev-time console.error) so the accent cannot become wallpaper (M5 note:
 *     this is a role, not a threshold-restated-as-flag).
 *   - `rail` defaults to true iff any row carries an icon; a railed row
 *     without its own icon lets the label fall into the content column via
 *     the stylesheet's `:not(.norail) .row>.nm:first-child{grid-column:2}`.
 *   - `neg` from the mockups is dropped entirely: v6 A9 made it a visual
 *     no-op (the minus sign is the signal).
 *   - Text-on-fill (M4): none by construction , every figure sits on panel
 *     white; the component offers no way to put one on a ramp fill.
 */
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { RowLattice } from "./RowLattice";
import { Fig } from "./Fig";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export type StatRow = {
  icon?: GlyphId;
  label: string;
  /** Inline quiet qualifier ("of revenue"), rendered as the .s span. */
  sub?: string;
  /** Pre-formatted figure; null/missing row does not render. */
  value: string | null;
  /** Rendered as the small .u suffix. */
  unit?: string;
  /** The block's ONE answer row; max one enforced. */
  answer?: boolean;
};

export interface StatblockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** null = headerless block (city §05). */
  header?: { label: string; icon?: GlyphId } | null;
  rows: StatRow[];
  /** false = norail; default derived: true iff any row has an icon. */
  rail?: boolean;
  /** A7 de-chrome for non-CSS-reachable nestings; see RowLattice. */
  bare?: boolean;
}

const statblockVariants = cva("statblock", {
  variants: {
    rail: { true: "", false: "norail" },
  },
  defaultVariants: { rail: true },
});

const Statblock = React.forwardRef<HTMLDivElement, StatblockProps>(
  ({ header, rows, rail, bare, className, ...props }, ref) => {
    const renderable = rows.filter((r) => r.value != null && r.value !== "");
    if (renderable.length === 0) return null;

    const answerCount = renderable.filter((r) => r.answer).length;
    if (process.env.NODE_ENV !== "production" && answerCount > 1) {
      console.error(
        `Statblock: at most one answer row per block; got ${answerCount}. ` +
          "Only the first keeps the accent.",
      );
    }

    const hasRail = rail ?? renderable.some((r) => r.icon != null);
    let answerUsed = false;

    return (
      <RowLattice
        ref={ref}
        frame={statblockVariants({ rail: hasRail })}
        bare={bare}
        className={className}
        headerBand={
          header ? (
            <div className="hd">
              {header.icon ? <GlyphIcon id={header.icon} size={18} /> : null}
              {header.label}
            </div>
          ) : null
        }
        {...props}
      >
        {renderable.map((r, i) => {
          const isAnswer = Boolean(r.answer) && !answerUsed;
          if (r.answer) answerUsed = true;
          return (
            <div className="row" key={i}>
              {hasRail && r.icon ? <GlyphIcon id={r.icon} size={18} /> : null}
              <span className="nm">
                {r.label}
                {r.sub ? <span className="s">{r.sub}</span> : null}
              </span>
              <Fig className="v" value={r.value} unit={r.unit} answer={isAnswer} />
            </div>
          );
        })}
      </RowLattice>
    );
  },
);
Statblock.displayName = "Statblock";

export { Statblock, statblockVariants };
