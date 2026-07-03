"use client";
/**
 * Sortable comparison table , the one client island on the spine country page.
 * The server (Neighbours) computes every value + the best-in-column flags and
 * passes serializable rows; this component only holds the sort state.
 */
import * as React from "react";

type Col = { key: string; label: string; unit: string };
type Cell = { raw: number | null; display: string; best: boolean };
type Row = { name: string; home: boolean; cells: Cell[] };

export function NeighboursTable({ cols, rows }: { cols: Col[]; rows: Row[] }) {
  const [sort, setSort] = React.useState<{ i: number; dir: 1 | -1 } | null>(null);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const r = [...rows];
    r.sort((a, b) => {
      const av = a.cells[sort.i].raw, bv = b.cells[sort.i].raw;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * sort.dir;
    });
    return r;
  }, [rows, sort]);
  const click = (i: number) => setSort((s) => (s && s.i === i ? { i, dir: (s.dir === 1 ? -1 : 1) as 1 | -1 } : { i, dir: 1 }));
  const arrow = (i: number) => (sort && sort.i === i ? (sort.dir === 1 ? " ↑" : " ↓") : "");
  return (
    <>
      {/* sm+ : the sortable table, table-fixed so columns share width and never scroll horizontally. */}
      <table className="hidden w-full table-fixed text-[13px] sm:table">
        <thead>
          <tr className="border-b border-[var(--c-border)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
            <th className="w-[26%] py-2 pr-3 text-left font-semibold">Country</th>
            {cols.map((c, i) => (
              <th key={c.key} onClick={() => click(i)} aria-sort={sort && sort.i === i ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className="min-w-0 cursor-pointer select-none px-2 py-2 text-right font-semibold transition hover:text-[var(--terra-text)]">
                <span className="block truncate">{c.label}{c.unit ? <span className="font-normal text-[var(--c-muted)]"> ({c.unit})</span> : null}<span className="text-[var(--terra-text)]">{arrow(i)}</span></span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-[var(--c-border)] transition hover:bg-[var(--c-soft)]" style={r.home ? { background: "#fff4f1" } : undefined}>
              <td className="min-w-0 truncate py-2.5 pr-3 font-medium text-[var(--c-ink)]">{r.name}</td>
              {r.cells.map((cell, i) => (
                <td key={i} className="px-2 py-2.5 text-right"><span className={`fig ${cell.best ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{cell.display}</span></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* mobile : stacked cards, no horizontal scroll. Renders in the current sort order. */}
      <div className="space-y-2 sm:hidden">
        {sorted.map((r) => (
          <div key={r.name} className="rounded-lg border border-[var(--c-border)] p-3" style={r.home ? { background: "#fff4f1" } : undefined}>
            <div className="mb-2 font-semibold text-[var(--c-ink)]">{r.name}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {r.cells.map((cell, i) => (
                <div key={i} className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-[11px] text-[var(--c-muted)]">{cols[i].label}</span>
                  <span className={`fig text-[13px] ${cell.best ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{cell.display}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
