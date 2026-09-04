/**
 * CompareTable , THE COMPARISON-TABLE ARCHETYPE (the peers). The desktop
 * form the founder praised unprompted on 2026-08-30 is kept whole: a real
 * table, the home row tinted, figures right-aligned under column heads, the
 * best value per column in ink and weight, the rest quiet, an en dash for a
 * value not held, a caption once beneath. EQUAL ROWS by construction: every
 * row is one line tall (ruling 8).
 *
 * THE PHONE FORM IS NEW, because the stacked cards were "botched" (founder
 * ruling 5, 2026-09-04): the column heads are said ONCE in a header row, and
 * each country takes two lines, the flag and name on the first and its
 * figures right-aligned under their heads on the second. Four figures fit
 * 327px at body size; nothing scrolls sideways (law M); the hierarchy holds
 * because the name is the only medium-weight text in a row and the best
 * figures the only semibold.
 */
import * as React from "react";
import { Box, Rail, Fig, usd } from "@/components/spine/kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountryFlag } from "@/components/CountryFlag";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "./copy";

export type CompareColumn = { key: string; head: string; unit: "pct" | "usd" | "days"; best: "min" | "max" };
export type CompareRow = { iso2: string; name: string; home?: boolean; values: Record<string, number | null> };
export type CompareTableProps = { id: string; kicker: string; icon?: AtlasIconId; rows: CompareRow[]; columns: CompareColumn[]; caveat?: string };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function fmt(unit: CompareColumn["unit"], v: number): string {
  if (unit === "pct") return `${v}%`;
  if (unit === "usd") return v === 0 ? COPY.free : usd(v);
  return `${v} ${v === 1 ? "day" : "days"}`;
}

export function CompareTable({ id, kicker, icon, rows, columns, caveat }: CompareTableProps) {
  if (rows.length < 2) return null;
  const bestOf: Record<string, number | undefined> = {};
  for (const c of columns) {
    const vs = rows.map((r) => r.values[c.key]).filter(isNum);
    bestOf[c.key] = vs.length >= 2 ? (c.best === "min" ? Math.min(...vs) : Math.max(...vs)) : undefined;
  }
  const cellClass = (c: CompareColumn, v: number | null) => {
    const isBest = isNum(v) && bestOf[c.key] != null && v === bestOf[c.key];
    return isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]";
  };
  const head = "text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]";
  return (
    <div data-wide-table className="mt-8">
      <Box id={id} data-archetype="compare-table">
        <Rail icon={icon} kicker={kicker} />
        <div className="hidden md:block">
          <Table className="text-[length:var(--t-micro)]">
            <caption className="sr-only">{caveat ?? kicker}</caption>
            <TableHeader>
              <TableRow className="border-[var(--c-border)] hover:bg-transparent">
                <TableHead scope="col" className={`h-auto px-0 pb-2 text-left ${head}`}>{COPY.peers.cols.country}</TableHead>
                {columns.map((c) => (
                  <TableHead key={c.key} scope="col" className={`h-auto px-2 pb-2 text-right ${head}`}>{c.head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.iso2} data-row={r.iso2} className={`h-12 border-[var(--c-border)] hover:bg-transparent ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
                  <TableCell className="px-0 py-0 align-middle">
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <CountryFlag iso2={r.iso2} className="w-7 shrink-0" />
                      <span className={`text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : ""}`}>{r.name}</span>
                    </span>
                  </TableCell>
                  {columns.map((c) => {
                    const v = r.values[c.key];
                    return (
                      <TableCell key={c.key} className="px-2 py-0 text-right align-middle whitespace-nowrap">
                        {isNum(v) ? <Fig className={`text-[length:var(--t-body)] ${cellClass(c, v)}`}>{fmt(c.unit, v)}</Fig> : <span aria-label="not held" className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden" data-phone-table="1">
          <div className="grid grid-cols-4 gap-x-2 border-b border-[var(--c-border)] pb-2">
            {columns.map((c) => (
              <span key={c.key} className={`text-right ${head}`} style={{ fontSize: "var(--t-mark)" }}>{c.head}</span>
            ))}
          </div>
          <div className="divide-y divide-[var(--c-border)]">
            {rows.map((r) => (
              <div key={r.iso2} data-row={r.iso2} className={`py-2.5 ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
                <span className="flex items-center gap-2.5">
                  <CountryFlag iso2={r.iso2} className="w-6 shrink-0" />
                  <span className={`text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : "font-medium"}`}>{r.name}</span>
                </span>
                <div className="mt-1 grid grid-cols-4 gap-x-2">
                  {columns.map((c) => {
                    const v = r.values[c.key];
                    return (
                      <span key={c.key} className="text-right whitespace-nowrap">
                        {isNum(v) ? <Fig className={`text-[length:var(--t-body)] ${cellClass(c, v)}`}>{fmt(c.unit, v)}</Fig> : <span aria-label="not held" className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {caveat ? <p className="mt-2.5 text-balance text-[length:var(--t-micro)] text-[var(--c-muted)]">{caveat}</p> : null}
      </Box>
    </div>
  );
}
