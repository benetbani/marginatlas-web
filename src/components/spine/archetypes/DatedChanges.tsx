/**
 * DatedChanges, THE RULES THAT CHANGED AND THE ONES COMING (2026-10-04, the UK page reform; his words that day: "there has to be
 * some context below, there has to be some hot stuff, some gold nuggets ... but we should avoid going and making each section with
 * a line of sentences below"). Research R4 (patterns P9 and P13, device D2): the most country-specific context a page can carry is
 * time, what a fee, a rate or a right was and what it is or will be, and it prints as two absolutes with a date, so nothing compares,
 * concludes or ranks (PART 9 clauses 12 and 15). Every row is a sourced change in force, or enacted with its date; never a proposal.
 *
 * THE LAW, inside the component:
 *  - TWO RUNS, TWO SECTIONS: what is COMING (soonest first) and what CHANGED (latest first), each its own section with its own
 *    title, side by side in one zone from 768, the coming run first on a phone (a change a reader can still plan for leads).
 *  - A ROW IS A DATE, AN ITEM OF THREE WORDS OR FEWER, AND ITS TWO VALUES: before (ink2) and from (ink, semibold), the arrow between
 *    them a mark, never a word. From 420px of a run the three stand on one line (the date in its own column); narrower, the date
 *    is the row's first line and the item and its values share the second (values past 22 characters take a third line).
 *  - A hairline between rows; 14 on 20 for the item and the values, 12 on 16 for the date and the run's head; tabular figures.
 *  - A RUN SHOWS ITS `shown` ROWS, the rest behind the plus in the same form, newest first, counted as changes (a rate and its
 *    threshold are one change in two rows) (clause 58, parts on a click).
 *  - `data-archetype="dated-changes"`: a sibling-figure form, like a table (no one figure at 30; its figures are equals).
 */
import * as React from "react";
import { Fig, InlineDisclosure } from "@/components/spine/kit";

export type ChangeRow = {
  key: string;
  /** Three words or fewer ("Incorporation fee"). */
  item: string;
  /** As printed ("1 Feb 2026"). */
  dateText: string;
  /** The date itself ("2026-02-01"), to order the rows behind the plus. */
  iso?: string;
  before: string;
  from: string;
};

/* ONE GRID FOR A RUN, EACH ROW A SUBGRID OF IT (2026-10-04; the model laws' ROW LINE: a figure reads on its row name's first line,
   and DISTANCES 5.7 rule 3: one column, one right edge). From 420px of section a row is the date, the item and its two values on
   one line, the values in one right-aligned column; narrower, the date is the row's first line and the item and its values share
   the second, the values at the right edge. */
function Row({ r, first }: { r: ChangeRow; first: boolean }) {
  return (
    <li data-row={r.key} className={`col-span-full grid max-w-none grid-cols-subgrid items-baseline gap-y-1 py-3 ${first ? "" : "border-t border-[var(--c-border)]"}`}>
      {/* `!font-normal`: the global .fig rule sets 600 after the utilities, and a date and a value before are read, not stressed. */}
      <span className="fig col-span-full text-[length:var(--t-micro)] !font-normal leading-4 text-[var(--c-muted)] [@container(min-width:420px)]:col-span-1 [@container(min-width:420px)]:leading-5">{r.dateText}</span>
      <span data-label className="min-w-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">{r.item}</span>
      {/* LONG VALUES TAKE A LINE OF THEIR OWN UNDER THE ITEM ON A NARROW RUN (2026-10-04, the model laws' ROW LINE at 375): "over
          £50,000 to over £30,000" wrapped beside a two-line item, its second figure level with the item's second line; past 22
          characters the two values stand under the item, right-aligned as every row's values are. */}
      <span className={`flex flex-wrap items-baseline justify-end gap-x-2 text-right text-[length:var(--t-body)] leading-5 ${(r.before + r.from).length > 22 ? "[@container(max-width:419px)]:col-span-full" : ""}`}>
        <Fig className="!font-normal text-[var(--c-ink2)]">{r.before}</Fig>
        <span aria-hidden className="text-[var(--c-muted)]">&rarr;</span>
        <span className="sr-only">to</span>
        <Fig className="text-[var(--c-ink)]">{r.from}</Fig>
      </span>
    </li>
  );
}

/* The values' column grows to its words and stops at 60% (50% beside the date), past which its words wrap, so a long change never
   squeezes its item to nothing (the harness's BOTCHED MOBILE). */
const RUN_GRID = "m-0 grid list-none grid-cols-[minmax(0,1fr)_fit-content(60%)] gap-x-4 p-0 [@container(min-width:420px)]:grid-cols-[6.5rem_minmax(0,1fr)_fit-content(50%)]";

/**
 * ONE RUN OF CHANGES as its own section's body (2026-10-04): what is coming, or what changed. Two runs stand as two sections side
 * by side in one zone, each with its own title, so neither runs the full width of the page (PART 9 clause 36, three full widths;
 * the full-width gates). `shown` rows, the rest behind the plus in the same form.
 */
export function ChangeRun({ rows, shown, more, moreOne }: { rows: ChangeRow[]; shown?: number; more?: string; moreOne?: string }) {
  if (rows.length === 0) return null;
  const visible = shown != null ? rows.slice(0, shown) : rows;
  /* THE ROWS BEHIND THE PLUS NEWEST FIRST (the code review of 2026-10-04: the lead rows the run had no room for opened the list at
     April 2025 and the later ones followed it); a stable sort keeps a rate beside its threshold. */
  const rest = shown != null ? [...rows.slice(shown)].sort((a, b) => (b.iso ?? "").localeCompare(a.iso ?? "")) : [];
  /* Counted as changes, not rows: a rate changed with its threshold is one change. */
  const n = new Set(rest.map((r) => r.key.replace(/-(rate|threshold)$/, ""))).size;
  const summary = n === 1 && moreOne ? moreOne : (more ?? "").replace("{n}", String(n));
  return (
    <div data-archetype="dated-changes" data-rows={String(rows.length)} className="[container-type:inline-size]">
      <ol className={RUN_GRID}>
        {visible.map((r, i) => (
          <Row key={r.key} r={r} first={i === 0} />
        ))}
      </ol>
      {rest.length > 0 && more ? (
        <InlineDisclosure name="changes-more" summary={summary} className="group mt-1 border-t border-[var(--c-border)] [&>summary]:min-h-11">
          <ol className={RUN_GRID}>
            {rest.map((r, i) => (
              <Row key={r.key} r={r} first={i === 0} />
            ))}
          </ol>
        </InlineDisclosure>
      ) : null}
    </div>
  );
}
