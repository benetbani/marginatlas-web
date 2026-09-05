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

export function KvGrid({ cells, className = "" }: { cells: KvCell[]; className?: string }) {
  const live = cells.filter((c) => c.value != null && c.value !== "");
  if (live.length === 0) return null;
  const groups: Array<{ group?: string; cells: KvCell[] }> = [];
  for (const c of live) {
    const last = groups[groups.length - 1];
    if (last && last.group === c.group) last.cells.push(c);
    else groups.push({ group: c.group, cells: [c] });
  }
  const anyHeading = groups.some((g) => g.group);
  return (
    <div data-idea="I8" data-archetype="kv-grid" data-groups={String(groups.length)} className={`[container-type:inline-size] ${className}`}>
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
            <div className={`grid ${g.cells.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-x-10 gap-y-4`}>
              {g.cells.map((c) => (
                <div key={c.key} data-kv-cell={c.key}>
                  <div className="min-h-[2.6em] text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)] lg:min-h-0">{c.label}</div>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
