/**
 * Stepper, A SEQUENCE DRAWN AS A SEQUENCE (2026-09-23, QUEUE
 * ui:how-to-as-a-stepper; briefs/VISUAL-CHOICE.md section 2: "a sequence of
 * steps takes a numbered stepper, never cards side by side, because cards lose
 * the order and the order is the whole content").
 *
 * THE FORM: one rail down the left, a numbered mark on it for each step, the
 * step's name at the lead rung beside it, and under the name the two figures
 * that step costs a reader: how long it takes and what it costs, with the word
 * for how it is done. The rail is what makes it a sequence rather than a list:
 * the eye follows one line from the first mark to the last.
 *
 * THE LAW, inside the component:
 *  - A ROW IS NOT PROSE, and it says so. globals.css caps every `li` under
 *    `main` at the prose measure, which is right for a note list and wrong
 *    here: it held every step row to 536px inside a 651px card and squeezed
 *    the name column to 98px, so "Open a business bank account" wrapped to
 *    three lines while 115px of the card stood empty. Measured 2026-09-23.
 *  - THE ROW'S SHAPE FOLLOWS THE CARD, NOT THE WINDOW. The columns open at a
 *    container width of 520 and stack below it, because the same card is 1032
 *    wide on one page and 480 in a half seat on another, and a layout switched
 *    on the window put three-line names in a 100px column while the window was
 *    wide. Measured on the how-to page, 2026-09-23.
 *  - THE ORDER IS THE CALLER'S. Nothing is sorted here. A sequence whose order
 *    the drawing decides is not a sequence.
 *  - TWO STEPS AT LEAST, or it draws nothing: one step is an instruction, not a
 *    process, and it belongs in a sentence.
 *  - THE NUMBERS ARE MARKS, at the micro rung on the rail, never figures: they
 *    are ordinals, and a reader who reads them as quantities has been misled.
 *    They still carry tabular numerals, because a column of ordinals is read
 *    down like any other column and the art-direction rule counts every bare
 *    digit on the page, ordinal or not.
 *  - A MISSING FIGURE IS A SILENCE, not a dash and not a zero. A step whose
 *    days or cost the file does not hold draws the other one and says nothing
 *    where the missing one would be.
 *  - NO DRAWING BEYOND THE RAIL. The sequence is the picture; a bar per step
 *    would be a second reading of a number already printed.
 *  - `data-archetype="stepper"`, `data-visual="1"`, `data-steps`. It counts as
 *    its level's visual: the rail is a drawing, and a page whose only drawing
 *    is this one is not a page without a picture.
 *
 * Gated by the archetype harness (stories `stepper`), the page laws and the
 * model laws on every page that seats it.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type Step = {
  key: string;
  name: string;
  /** How the step is done, in the file's own word. */
  how?: string | null;
  /** How long it takes, as printed. */
  days?: string | null;
  /** What it costs, as printed, or the word for free. */
  cost?: string | null;
};

export const STEPPER_MIN = 2;

export function Stepper({ steps, compact = false }: { steps: Step[]; compact?: boolean }) {
  const live = steps.filter((s) => s && s.name);
  if (live.length < STEPPER_MIN) return null;
  /* THE COMPACT FORM (2026-09-25, the country page's bill card at two fifths): a narrow card cannot give the three readings their
     own columns beside the name (the wide form's container rule sends them to a second line, and four steps stood twice as tall
     as the registering table beside them), so the name carries how the step is done as a muted line under it and the days and the
     cost stand in two columns to its right. ONE GRID FOR THE WHOLE LIST, each row a subgrid of it, so the days and the costs keep
     one right edge down the list (the hero board's alignment law). */
  if (compact) {
    return (
      <ol data-archetype="stepper" data-visual="1" data-steps={String(live.length)} data-form="compact" className="relative m-0 grid w-full list-none grid-cols-[24px_minmax(0,1fr)_auto_auto] gap-x-3 p-0">
        {live.map((s, i) => {
          const last = i === live.length - 1;
          return (
            <li key={s.key} data-row className="relative col-span-full grid max-w-none grid-cols-subgrid items-baseline pb-3 last:pb-0">
              {/* The rail is on every row and hidden on the last, so every row holds the same children in the same order and the
                  days and the costs are one column each to anything that reads the rows by position (the page laws' ALIGNMENT). */}
              <span aria-hidden className={last ? "hidden" : "absolute left-3 top-6 h-[calc(100%-16px)] w-px bg-[var(--c-border)]"} />
              <span aria-hidden className="tabular-figures relative z-[1] flex h-6 w-6 items-center justify-center self-start rounded-full border border-[var(--c-line-strong)] bg-[var(--c-card)] text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink)]">{s.name}</div>
                {s.how ? <div data-step-how className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{s.how}</div> : null}
              </div>
              <span data-step-days className="text-right">{s.days ? <Fig className="text-[length:var(--t-body)] font-semibold leading-none text-[var(--c-ink)]">{s.days}</Fig> : null}</span>
              <span data-step-cost className="text-right">{s.cost ? <Fig className="text-[length:var(--t-body)] font-semibold leading-none text-[var(--c-ink)]">{s.cost}</Fig> : null}</span>
            </li>
          );
        })}
      </ol>
    );
  }
  return (
    <ol data-archetype="stepper" data-visual="1" data-steps={String(live.length)} className="relative m-0 w-full list-none p-0 [container-type:inline-size]">
      {live.map((s, i) => {
        const last = i === live.length - 1;
        return (
          <li key={s.key} data-row className="relative grid max-w-none grid-cols-[24px_minmax(0,1fr)] gap-x-4 gap-y-2 pb-4 last:pb-0 [@container(min-width:520px)]:grid-cols-[24px_minmax(0,1fr)_minmax(88px,120px)_minmax(88px,120px)_minmax(80px,110px)] [@container(min-width:520px)]:items-baseline">
            {/* THE RAIL, drawn behind the marks and stopped at the last one, so the
                sequence ends where the steps end rather than trailing into the basis. */}
            {!last ? <span aria-hidden className="absolute left-3 top-6 h-[calc(100%-16px)] w-px bg-[var(--c-border)]" /> : null}
            <span
              aria-hidden
              className="tabular-figures relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border border-[var(--c-line-strong)] bg-[var(--c-card)] text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]"
            >
              {i + 1}
            </span>
            <div className="min-w-0 text-[length:var(--t-lead)] font-medium leading-snug text-[var(--c-ink)]">{s.name}</div>
            {/* THE THREE READINGS IN THEIR OWN COLUMNS from 768 up, so the long step
                and the dear step are found by running down a column rather than by
                reading every row; under 768 they wrap under the name in one line,
                which is the same order without the columns. */}
            <div className="col-start-2 flex flex-wrap items-baseline gap-x-6 gap-y-1 [@container(min-width:520px)]:col-start-3 [@container(min-width:520px)]:col-span-3 [@container(min-width:520px)]:grid [@container(min-width:520px)]:grid-cols-subgrid">
              <span data-step-days className="[@container(min-width:520px)]:text-right">
                {s.days ? <Fig className="text-[length:var(--t-lead)] font-semibold leading-none text-[var(--c-ink)]">{s.days}</Fig> : null}
              </span>
              <span data-step-cost className="[@container(min-width:520px)]:text-right">
                {s.cost ? <Fig className="text-[length:var(--t-lead)] font-semibold leading-none text-[var(--c-ink)]">{s.cost}</Fig> : null}
              </span>
              <span data-step-how className="text-[length:var(--t-micro)] text-[var(--c-muted)] [@container(min-width:520px)]:text-right">{s.how ?? ""}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
