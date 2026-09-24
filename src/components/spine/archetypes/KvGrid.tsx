/**
 * KvGrid , THE KEY-VALUE GRID ARCHETYPE. Label over figure over one qualifier,
 * no borders and no tiles (the founder's tile ban of 2026-08-30), a row
 * heading printed once for a group of cells (his repetition verdict: "said it
 * once at the top as a column"), and the law built in:
 *
 *  - EQUAL ROWS (ruling 8, 2026-09-04): below the wide layouts every label
 *    reserves two lines, so a label that wraps never drops its figure below
 *    its neighbour's; from lg up the labels are one line and the reserve
 *    is off. Figures in one row share a baseline by construction.
 *  - NO EMPTY SLOT, EVER: a cell without a value is not rendered; a grid
 *    without cells renders nothing. Rows appear as data lands.
 *  - COMPLETE ROWS (PART 9 clause 10, "three cells in a four-cell grid with
 *    a hole"; plan step 31's second dispatch, 2026-09-17, the first card to
 *    hand this grid five cells in one group): a group of an odd count above
 *    one never leaves a slot open in its last row. Its FIRST cell takes the
 *    width, the lone-cell law below applied inside a group, and the rest
 *    pair off beneath it. So five cells are one wide and two rows of two,
 *    three are one wide and one row of two, and no row is short. Which cell
 *    leads is the caller's order; the width marks nothing (same rung, same
 *    ink) and it is the silhouette the focal-cell candidate would take the
 *    day he clicks it, so only the rung would change then.
 *  - ONE ACCENT, NEVER HERE: cells are ink; the accent belongs to the answer.
 *  - A MODELLED CELL CARRIES ITS OWN TAG (rule 4A), beside its label.
 *  - THE COLUMNS FOLLOW THE GRID'S OWN WIDTH (build loop run 7, 2026-09-05):
 *    cells sit in GROUPS, a run of cells under one heading or none; inside a
 *    group two columns (one for a lone cell); when the grid is at least 900
 *    pixels wide the groups sit side by side, each heading over its own
 *    cells, so a wide card holds four cells across instead of two columns
 *    spread over it with air between (the how-to hero, run 5). Narrower, the
 *    groups stack as before, so the answer card's docked grid is unchanged.
 *    A container query, not a breakpoint: the grid decides, not the page.
 *
 * Programmatic by construction: the same component draws the masthead grid of
 * every country, the how-to hero, and any other label-over-figure set.
 */
import * as React from "react";
import { Fig, SampleTag } from "@/components/spine/kit";

export type KvCell = {
  key: string;
  label: string;
  value: React.ReactNode;
  note?: string;
  group?: string;
  confidence?: "measured" | "modeled" | "placeholder";
};

/* The container-query classes are written out in full below, never assembled from a constant: the stylesheet compiler scans source for literal class strings and generates nothing for a template. */

/**
 * THE LABEL RESERVE, TWO WAYS (plan step 33's second dispatch, 2026-09-18,
 * the trade page's `03 permits`, MODEL.md 8.6). The default, "two-lines", is
 * the law above: two lines below lg, none from lg up, right for every label
 * a builder writes (four words at most). "row" is for a grid whose labels
 * are NAMES the caller may not shorten (a licence is what the shard calls
 * it, five to twelve words, "Food service or retail food establishment
 * permit"): a fixed reserve is either too short for those or too tall for
 * everything else, so the reserve becomes THE ROW'S OWN TALLEST LABEL. Each
 * cell is a column and its figure sits on the cell's floor; the grid row is
 * as tall as its tallest label; so every figure in a row shares one top by
 * construction, at every width, whatever the labels wrap to. Ruling 8 held
 * by a different mechanism, not relaxed: the archetype harness's UNEQUAL
 * rule reads the figures' tops and does not know which reserve drew them.
 * One limit, stated: a `note` under a figure lifts that figure off the
 * floor, so a "row" grid carries no notes (the permits cells carry none).
 */
export type KvLabelReserve = "two-lines" | "row";

/** `stack` (2026-09-24): the cells one under the other at every width, for a pair beside a taller neighbour (the answer card whose answer draws its share and whose companions are two: the industry hero with its cost withheld stood 480 by 162 of air beside the drawn answer, side by side). */
export function KvGrid({ cells, className = "", labelReserve = "two-lines", stack = false }: { cells: KvCell[]; className?: string; labelReserve?: KvLabelReserve; stack?: boolean }) {
  const byRow = labelReserve === "row";
  const live = cells.filter((c) => c.value != null && c.value !== "");
  if (live.length === 0) return null;
  const groups: Array<{ group?: string; cells: KvCell[] }> = [];
  for (const c of live) {
    const last = groups[groups.length - 1];
    if (last && last.group === c.group) last.cells.push(c);
    else groups.push({ group: c.group, cells: [c] });
  }
  const anyHeading = groups.some((g) => g.group);
  /* THE GRID'S TWO SHAPES, DECLARED (his clause 55, the page laws' KIND TWINS,
     2026-09-20): a group of an odd count above one leads with a cell across
     both columns ("lead"), an even count is a plain grid of pairs ("grid"), a
     lone cell takes the width ("one"). Two grids on one page are twins only
     when they are the same shape; the shape is read off the first group, the
     one the eye meets. */
  const first = groups[0].cells.length;
  const form = stack ? "stack" : first === 1 ? "one" : first % 2 === 1 ? "lead" : "grid";
  return (
    <div data-idea="I8" data-archetype="kv-grid" data-groups={String(groups.length)} data-form={form} className={`[container-type:inline-size] ${className}`}>
      {/* THE GROUPS: stacked below 900px, side by side above it, equal widths. */}
      <div className="grid gap-x-10 gap-y-4 [@container(min-width:900px)]:grid-flow-col [@container(min-width:900px)]:auto-cols-fr">
        {groups.map((g, gi) => (
          <div key={`${g.group ?? "cells"}-${gi}`} data-kv-group={g.group ?? ""} className="grid content-start gap-y-4">
            {g.group ? (
              <div className="-mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{g.group}</div>
            ) : anyHeading ? (
              /* A GROUP WITHOUT A HEADING RESERVES THE HEADING'S LINE when the
                 groups sit side by side, so every figure in the row shares
                 one baseline; stacked, the reserve is hidden. */
              <div aria-hidden className="-mb-2 hidden text-[length:var(--t-micro)] font-semibold uppercase [@container(min-width:900px)]:block">&nbsp;</div>
            ) : null}
            {/* A LONE CELL TAKES THE WIDTH. Measured by the harness on the three
                countries that hold one companion fact: a two-column grid with one
                cell left its second column as a 232x144 hole at 768 and 170x132
                at 375. The column count follows the cells, never the other way. */}
            <div className={`grid ${g.cells.length > 1 && !stack ? "grid-cols-2" : "grid-cols-1"} gap-x-10 gap-y-4`}>
              {g.cells.map((c, ci) => (
                /* COMPLETE ROWS: in an odd group above one, the first cell spans both columns. */
                <div key={c.key} data-kv-cell={c.key} className={`${!stack && g.cells.length > 1 && g.cells.length % 2 === 1 && ci === 0 ? "col-span-2" : ""} ${byRow ? "flex flex-col" : ""}`.trim() || undefined}>
                  {/* THE RESERVE IS EXACTLY TWO LINES BY CONSTRUCTION (plan step 31's
                      second dispatch, 2026-09-17, the first cards whose labels wrap at
                      375 and 768, "Net wealth per adult" and "Shop rent, major cities").
                      It read min-h 2.6em over an INHERITED line height of 1.5, so it
                      held 1.73 lines and a wrapped label pushed its figure 5px under
                      its neighbour's, measured on the rendered page; every earlier
                      caller had one-line labels, so the gap never showed. The label
                      now declares its line height, 1.3, and 2.6em is twice it. The
                      reserve itself is unchanged in size on purpose: raising it to
                      2.75em grew every one-line label by 1.8px and tipped a 118px
                      blank on the answer card's Fiji story at 768 over the 120 floor. */}
                  <div className={`${byRow ? "" : "min-h-[2.6em] lg:min-h-0 "}text-[length:var(--t-micro)] font-semibold uppercase leading-[1.3] tracking-wide text-[var(--c-muted)]`}>{c.label}</div>
                  {/* On the "row" reserve the figure sits on the cell's floor (`mt-auto`), so a row's figures share one top whatever their labels wrap to. */}
                  <div className={`${byRow ? "mt-auto pt-1" : "mt-1"} flex flex-wrap items-baseline gap-x-2 gap-y-1`}>
                    <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{c.value}</Fig>
                    {c.confidence && c.confidence !== "measured" ? <SampleTag /> : null}
                  </div>
                  {c.note ? <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ textWrap: "balance" }}>{c.note}</div> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
