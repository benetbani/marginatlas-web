"use client";
/**
 * SortTable, A TABLE'S HEADS ORDER ITS ROWS (the goal of 2026-09-26, mechanism M5; design/loop/build/goal-2026-09-26/PLAN.md).
 * His message of that afternoon asked that the tables already built be studied for ease of use, and a comparison table read top
 * to bottom answers one question only, the order its builder chose. A press on a column's head brings that column's best figure
 * to the top (the tick's own direction: lowest first where the lowest wins), a second press turns it over, so "where does my
 * country stand on tax" is read off the position of the tinted row. Page-agnostic: the rows arrive drawn (the caller's cells,
 * flags and ticks), each with the figures it sorts by.
 *
 * THE LAW, inside the component:
 *  - THE OPENING ORDER IS THE CALLER'S (the home row first): nothing moves until the reader asks.
 *  - THE HOME ROW STAYS MARKED wherever it lands: its tint is drawn here, on the row, from `home`.
 *  - THE SORTED HEAD SAYS ITS DIRECTION: an arrow beside it and `aria-sort` on its column head; a head not sorted carries a faint
 *    pair of arrows, the sign that it can be pressed (the sortable table's convention on public-service sites), in the head's
 *    own grey; the sorted head is in ink. No new colour, no hover decoration on a row (his ruling of 2026-07-11).
 *  - A FIGURE NOT HELD SORTS LAST in either direction; rows that tie keep the caller's order.
 *  - A COLUMN WHOSE HIGHER AND LOWER ARE NEITHER BETTER (`best: "none"`, a salary) sorts highest first on its first press.
 *  - UNDER THREE ROWS there is nothing to order: the heads are plain words and nothing listens.
 *  - One polite line tells a screen reader the order after each press; it is empty on arrival.
 *  - Both forms, the table and the phone's stacked rows, follow the one order.
 */
import * as React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type SortColumn = { key: string; head: string; best: "min" | "max" | "none" };
/** The words of the polite line: `said` holds {head} and {dir}; `low` and `high` are the two directions. */
export type SortWords = { said: string; low: string; high: string };
/** `cells`: the table form's cells for this row (the name cell first); `phone`: the phone form's row, drawn. */
export type SortRow = { key: string; home?: boolean; values: Record<string, number | null>; cells: React.ReactNode; phone: React.ReactNode };
type Dir = "asc" | "desc";

const HEAD = "text-[length:var(--t-micro)] font-semibold";
const held = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v);

/** Two chevrons, up and down: both faint on a head not sorted, the one of the direction alone in ink on the sorted head. */
function Arrows({ dir }: { dir: Dir | null }) {
  return (
    <svg aria-hidden viewBox="0 0 10 14" className="h-3.5 w-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {dir !== "desc" ? <path d="M2 5 5 2l3 3" opacity={dir ? 1 : 0.5} /> : null}
      {dir !== "asc" ? <path d="M2 9l3 3 3-3" opacity={dir ? 1 : 0.5} /> : null}
    </svg>
  );
}

export function SortTable({ label, columns, rows, entityHead, wideClass, phoneClass, phoneCols, words }: {
  label: string;
  words: SortWords;
  columns: SortColumn[];
  rows: SortRow[];
  entityHead: string;
  /** The container-query classes that show the table form and the phone form (the caller's, written out in full). */
  wideClass: string;
  phoneClass: string;
  phoneCols: string;
}) {
  const [order, setOrder] = React.useState<{ col: string; dir: Dir } | null>(null);
  const [said, setSaid] = React.useState("");
  const sortable = rows.length >= 3;
  const press = (c: SortColumn) => {
    const dir: Dir = order && order.col === c.key ? (order.dir === "asc" ? "desc" : "asc") : c.best === "min" ? "asc" : "desc";
    setOrder({ col: c.key, dir });
    setSaid(words.said.replace("{head}", c.head).replace("{dir}", dir === "asc" ? words.low : words.high));
  };
  const shown = React.useMemo(() => {
    if (!order) return rows;
    const sign = order.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a.values[order.col], y = b.values[order.col];
      if (!held(x) && !held(y)) return 0;
      if (!held(x)) return 1;
      if (!held(y)) return -1;
      return (x - y) * sign;
    });
  }, [rows, order]);
  const dirOf = (c: SortColumn): Dir | null => (order && order.col === c.key ? order.dir : null);
  const headButton = (c: SortColumn, phone: boolean) => {
    const dir = dirOf(c);
    return (
      <button
        type="button"
        onClick={() => press(c)}
        data-sort-head={c.key}
        className={`inline-flex min-h-6 items-center justify-end gap-1 rounded-sm text-right ${HEAD} ${dir ? "text-[var(--c-ink)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"} ${phone ? "w-full" : ""}`}
        style={phone ? { fontSize: "var(--t-mark)" } : undefined}
      >
        <span>{c.head}</span>
        <Arrows dir={dir} />
      </button>
    );
  };
  return (
    <>
      <div className={wideClass}>
        <Table className="table-fixed text-[length:var(--t-micro)]">
          <caption className="sr-only">{label}</caption>
          {/* THE NAME'S COLUMN IS 10rem; the figure columns share what is left equally (a fixed table's rule for columns with no
              width). A share with a floor, max(9.5rem, 19%), is not a width a table column takes: a column mixing a length and a
              percentage lays out as auto, and "United Kingdom" fell to 67px. */}
          <colgroup>
            <col style={{ width: "10rem" }} />
            {columns.map((c) => (
              <col key={c.key} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow className="border-[var(--c-border)] hover:bg-transparent">
              <TableHead scope="col" className={`h-auto px-0 pb-2 text-left ${HEAD} text-[var(--c-muted)]`}>{entityHead}</TableHead>
              {columns.map((c) => {
                const dir = dirOf(c);
                return (
                  <TableHead key={c.key} scope="col" aria-sort={sortable ? (dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none") : undefined} className={`h-auto px-2 pb-2 text-right ${sortable ? "" : `${HEAD} text-[var(--c-muted)]`}`}>
                    {sortable ? headButton(c, false) : c.head}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) => (
              <TableRow key={r.key} data-row={r.key} data-home={r.home ? "1" : undefined} className={`h-12 border-[var(--c-border)] hover:bg-transparent ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
                {r.cells}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={phoneClass} data-phone-table="1">
        <div className={`grid ${phoneCols} gap-x-2 border-b border-[var(--c-border)] pb-2`}>
          {columns.map((c) => (sortable ? <span key={c.key} className="flex justify-end">{headButton(c, true)}</span> : <span key={c.key} className={`text-right ${HEAD} text-[var(--c-muted)]`} style={{ fontSize: "var(--t-mark)" }}>{c.head}</span>))}
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {shown.map((r) => (
            <div key={r.key} data-row={r.key} data-home={r.home ? "1" : undefined} className={`py-2 ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
              {r.phone}
            </div>
          ))}
        </div>
      </div>
      {sortable ? <p aria-live="polite" className="sr-only">{said}</p> : null}
    </>
  );
}
