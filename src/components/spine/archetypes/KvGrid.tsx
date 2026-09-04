/**
 * KvGrid , THE KEY-VALUE GRID ARCHETYPE. Label over figure over one qualifier,
 * two columns, no borders and no tiles (the founder's tile ban of 2026-08-30),
 * a row heading printed once for a group of cells (his repetition verdict:
 * "said it once at the top as a column"), and the law built in:
 *
 *  - EQUAL ROWS (ruling 8, 2026-09-04): below the wide layouts every label
 *    reserves two lines, so a label that wraps never drops its figure below
 *    its neighbour's; from lg up the labels are one line and the reserve
 *    is off. Figures in one row share a baseline by construction.
 *  - NO EMPTY SLOT, EVER: a cell without a value is not rendered; a grid
 *    without cells renders nothing. Rows appear as data lands.
 *  - ONE ACCENT, NEVER HERE: cells are ink; the accent belongs to the answer.
 *  - A MODELLED CELL CARRIES ITS OWN TAG (rule 4A), beside its label.
 *
 * Programmatic by construction: the same component draws the masthead grid of
 * every country, and any other label-over-figure set on the site.
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

export function KvGrid({ cells, className = "" }: { cells: KvCell[]; className?: string }) {
  const live = cells.filter((c) => c.value != null && c.value !== "");
  if (live.length === 0) return null;
  const out: React.ReactNode[] = [];
  let lastGroup: string | undefined;
  for (const c of live) {
    if (c.group && c.group !== lastGroup) {
      out.push(
        <div key={`g-${c.group}`} className="col-span-full -mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          {c.group}
        </div>,
      );
      lastGroup = c.group;
    }
    out.push(
      <div key={c.key} data-kv-cell={c.key}>
        <div className="min-h-[2.6em] text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)] lg:min-h-0">{c.label}</div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{c.value}</Fig>
          {c.confidence && c.confidence !== "measured" ? <SampleTag /> : null}
        </div>
        {c.note ? <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]" style={{ textWrap: "balance" }}>{c.note}</div> : null}
      </div>,
    );
  }
  return (
    /* A LONE CELL TAKES THE WIDTH. Measured by the harness on the three
       countries that hold one companion fact: a two-column grid with one cell
       left its second column as a 232x144 hole at 768 and 170x132 at 375. The
       column count follows the cells, never the other way round. */
    <div data-idea="I8" data-archetype="kv-grid" className={`grid ${live.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-x-10 gap-y-4 ${className}`}>
      {out}
    </div>
  );
}
