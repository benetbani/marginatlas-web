/**
 * FactRows, A SECTION'S FACTS AS RULED ROWS (2026-10-04, the UK page reform; his words that day: "on the mobile version the
 * rendering of the tables and of many elements has a horrible execution"). The label-over-figure grid stood each fact as a cell
 * with its glyph above its words on a phone, so three facts took 300px of a screen with a figure alone on every line; research R2
 * (3.6, Q5) measured the alternative: label and figure on ONE line, a hairline between rows, the note under the label.
 *
 * THE LAW, inside the component:
 *  - THE ROW IS PART 5's ROW: the label (with its glyph) then the figure in the very next column; from 420px of width the label
 *    column is at most 26ch of the 14px words (PART 5's 22ch for the words plus the 28px glyph and its 12px gap) and a third column
 *    takes the leftover, the value left-aligned after the label, so a label never stands more than a third of the section from
 *    its figure (the model laws' LABEL GAP; a right-aligned value in a 28ch row measured 220px from a short label) (PART 5,
 *    "never justify-between across a card wider than 420px"); under 420px the row is [1fr auto], the only place PART 5 allows.
 *  - 14 ON 20 FOR THE WORDS, 16 FOR THE FIGURE (the lead rung: the section's own figure above holds the 30, and nothing stands
 *    between 16 and 30 under it), 12 ON 16 FOR A NOTE; tabular figures, right-aligned in their column (DISTANCES 5.7, rule 2).
 *  - A HAIRLINE BETWEEN ROWS, NONE ABOVE THE FIRST; 12px of padding top and bottom around the glyph's 28px tile, the label's 20px
 *    line centred on it, so a one-line row is 52px and a row with its note 64px.
 *  - NO EMPTY ROW: a fact without a value is not drawn, and no facts draw nothing.
 *  - `data-archetype="fact-rows"`, `data-row` and `data-label` on each, so the harness reads its rows like any other.
 */
import * as React from "react";
import type { Provenance } from "@/lib/spine/provenance";
import { Fig, Ico, SampleTag } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";

export type FactRow = {
  key: string;
  label: string;
  value: React.ReactNode;
  note?: string | null;
  icon?: AtlasIconId;
  confidence?: "measured" | "modeled" | "placeholder";
  /** Where the row's figure came from (src/lib/spine/provenance.ts), stamped on its figure; a row without one stamps nothing. */
  prov?: Provenance | null;
};

/* A DATE NEVER BREAKS OVER TWO LINES (the design review, 2026-10-04: "since 1 / Apr 2026"): a note's "1 Apr 2026" keeps its two
   spaces unbreakable. */
const DATE = /(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})/g;
const keepDates = (s: string) => s.replace(DATE, "$1\u00a0$2\u00a0$3");

export function FactRows({ rows, className = "" }: { rows: FactRow[]; className?: string }) {
  const live = rows.filter((r) => r.value != null && r.value !== "");
  if (live.length === 0) return null;
  /* TWO LISTS SIDE BY SIDE FROM 600px OF WIDTH (2026-10-04, the band page at 768, where a section takes the column's 720px):
     one list of rows used the left half and left the right half blank (the page filter's WHITE SPACE, 330 by 144 on the running
     costs); two rows or more split into two lists, the first half on the left, each list one grid of its own, so its figures
     share one edge. Under 600px the two lists are one run, the second's first row ruled like any other. */
  const lists = live.length >= 2 ? [live.slice(0, Math.ceil(live.length / 2)), live.slice(Math.ceil(live.length / 2))] : [live];
  const row = (r: FactRow, i: number) => (
    <div
      key={r.key}
      data-row={r.key}
      className={`col-span-full grid grid-cols-subgrid items-start py-3 ${i > 0 ? "border-t border-[var(--c-border)]" : ""}`}
    >
      <dt className="flex min-w-0 items-start gap-3">
        {r.icon ? (
          <span aria-hidden className="shrink-0">
            <Ico id={r.icon} tone="terra" />
          </span>
        ) : null}
        <span className="min-w-0">
          {/* THE LABEL'S FIRST LINE IS CENTRED ON THE TILE (28): a 20px line 4px down, and the figure the same, so the glyph, the
              words and the figure share one centre line whatever the two faces' metrics; a label that wraps keeps 20px lines
              (a 28px line height doubled the gap inside "Late payment / interest"). */}
          <span data-label className="block pt-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
            {r.label}
            {r.confidence && r.confidence !== "measured" ? <SampleTag /> : null}
          </span>
          {r.note ? <span className="block text-[length:var(--t-micro)] leading-4 text-[var(--c-muted)]">{keepDates(r.note)}</span> : null}
        </span>
      </dt>
      <dd className="text-right [@container(min-width:420px)]:text-left">
        <Fig className="block pt-1 text-[length:var(--t-lead)] leading-5 text-[var(--c-ink)]" prov={r.prov}>{r.value}</Fig>
      </dd>
    </div>
  );
  return (
    <div className={`[container-type:inline-size] ${className}`}>
      <div data-archetype="fact-rows" data-rows={String(live.length)} className="grid grid-cols-1 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-x-12">
        {lists.map((list, li) => (
          /* ONE GRID FOR A LIST, EACH ROW A SUBGRID OF IT (DISTANCES 5.7, rule 3: "one column, one right edge"; separate row grids
             sized each figure's column to its own figure, so "3.75%" and "$663 to $33K" stood on two right edges). */
          <dl
            key={li}
            className={`grid min-w-0 grid-cols-[minmax(0,1fr)_fit-content(55%)] gap-x-4 text-[length:var(--t-body)] [@container(min-width:420px)]:grid-cols-[minmax(0,26ch)_fit-content(50%)_1fr] ${li > 0 ? "border-t border-[var(--c-border)] [@container(min-width:600px)]:border-t-0" : ""}`}
          >
            {list.map((r, i) => row(r, i))}
          </dl>
        ))}
      </div>
    </div>
  );
}
