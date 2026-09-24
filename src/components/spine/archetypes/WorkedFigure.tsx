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
 * OR THE LEAD OF A SET (2026-09-24, the goal's B1; FORM-CATALOG VERSION 6
 * named the three plain fact cards that move onto this form): where the
 * card's answer is the one member of a set a reader plans by (the longest of
 * a trade's licence waits, `03 permits`; the fifth year of its survival,
 * `09 lasts`), the working row is the rest of the set in the order the
 * builder gives it, and the basis says which member leads and why. The law
 * below is unchanged: one focal, the rest at 16, two to four of them.
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
 *  - BESIDE ITS WORKING FROM 560 OF ITS OWN WIDTH (2026-09-24, the goal's B1):
 *    under 560 the working stands under the hairline; from 560 it stands to
 *    the right of the figure behind a vertical hairline, because a figure
 *    block alone at the left of a wide card is a blank beside it (the page
 *    filter read 312 by 120 on the permits card at 768, where its level
 *    stacks to 680). The card's width decides, never the window's: the root
 *    is the container, the layout its child (an element cannot query itself).
 *  - `list`: the working as ONE COLUMN OF FIGURES against one column of words
 *    (a figure right aligned only in a column of figures, DISTANCES 5.7), for
 *    working words that are names and run long (a trade's licences); the
 *    inline row stays for short readings ("a visit", "after one year"). Two
 *    grid columns, so the card keeps its three left starts (DISTANCES 5.1).
 *
 * Gated by the archetype harness (stories `worked-figure`), the page laws and
 * the model laws on every page that seats it.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";
import { CompanionRow, type Companion } from "@/components/spine/archetypes/BentoBand";

export const WORKING_MIN = 2;
export const WORKING_MAX = 4;

export function WorkedFigure({ label, figure, working, accent = false, list = false }: { label: string; figure: string; working: Companion[]; accent?: boolean; list?: boolean }) {
  if (!figure || working.length < WORKING_MIN) return null;
  const shown = working.slice(0, WORKING_MAX);
  return (
    <div data-archetype="worked-figure" data-working={String(shown.length)} data-form={list ? "list" : "row"} className="[container-type:inline-size]">
      <div className="[@container(min-width:560px)]:grid [@container(min-width:560px)]:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] [@container(min-width:560px)]:items-center [@container(min-width:560px)]:gap-x-8">
        <div>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div>
          <Fig className={`mt-1 block text-[length:var(--t-focal)] font-semibold leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{figure}</Fig>
        </div>
        <div data-second className="mt-4 border-t border-[var(--c-border)] pt-3 [@container(min-width:560px)]:mt-0 [@container(min-width:560px)]:border-l [@container(min-width:560px)]:border-t-0 [@container(min-width:560px)]:pl-6 [@container(min-width:560px)]:pt-0">
          {list ? (
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-2">
              {shown.map((c, i) => (
                <React.Fragment key={`${c.figure}-${i}`}>
                  <Fig className="text-right text-[length:var(--t-lead)] font-semibold leading-none tabular-nums text-[var(--c-ink)]">{c.figure}</Fig>
                  <span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{c.words}</span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <CompanionRow items={shown} />
          )}
        </div>
      </div>
    </div>
  );
}
