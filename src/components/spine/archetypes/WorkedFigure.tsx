/**
 * WorkedFigure, A FIGURE WITH ITS WORKING (2026-09-20 night, built for the
 * trade page's `16 customers`; his words on the market bento that night:
 * "a subsection cannot be only with one number", and "think on how the
 * elements should be placed, if the person expects them there").
 *
 * The form: one figure at the focal rung under its label, and beneath a
 * hairline the two to four figures it was worked out from, each with its
 * words, in the order they combine. The reader takes the answer first and
 * the arithmetic second; the card's basis says the computation in words, so
 * the row never has to (PART 9 clause 66, the obvious not said twice).
 * Its family is the fact family, beside the grid; where KvGrid is figures
 * that stand side by side, this is figures that make another one.
 *
 * THE LAW, inside the component:
 *  - ONE FOCAL at 30 (PART 4: every section card takes exactly one), in ink,
 *    or in the accent where the seat has declared its loud moment.
 *  - THE WORKING AT 16, never between 16 and 30: the focal above it is the
 *    card's 30, and the model laws read the whole card, not this element.
 *  - TWO TO FOUR working figures. Fewer than two is a number with nothing
 *    behind it, which clause 65 forbids; more than four is a grid, and the
 *    grid is KvGrid.
 *  - `data-archetype="worked-figure"`, `data-working` the count. It is not a
 *    drawing: no `data-visual`, so its level still owes a visual of its own.
 *
 * Gated by the archetype harness (stories `worked-figure`), the page laws and
 * the model laws on every page that seats it.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { CompanionRow, type Companion } from "@/components/spine/archetypes/BentoBand";

export const WORKING_MIN = 2;
export const WORKING_MAX = 4;

export function WorkedFigure({ label, figure, working, accent = false }: { label: string; figure: string; working: Companion[]; accent?: boolean }) {
  if (!figure || working.length < WORKING_MIN) return null;
  const shown = working.slice(0, WORKING_MAX);
  return (
    <div data-archetype="worked-figure" data-working={String(shown.length)}>
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div>
      <Fig className={`mt-1 block text-[length:var(--t-focal)] font-semibold leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{figure}</Fig>
      <div data-second className="mt-4 border-t border-[var(--c-border)] pt-3">
        <CompanionRow items={shown} />
      </div>
    </div>
  );
}
