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
 *
 * THE CHECK IS THE MECHANIC, finished 2026-09-10 (his B7, the comparison; "M3" was a slip, there are no M mechanics in the reference file, corrected 2026-09-17;
 * design/references/founder-2026-09-10.md). Ink and weight alone on the
 * winning cell proved too quiet to read at a glance in the rendered
 * photograph, so a small tick now sits beside the figure, reused from
 * forms-v2's StateMark("yes") rather than a second glyph drawn for this
 * table. Ink only, never terracotta: the accent budget is three figures a
 * page and this table can carry a winning tick in every column, so a hue on
 * each would spend the whole page's emphasis on one card. The name column
 * also gives back what it was wasting: a colgroup now holds it to 1.2 of a
 * 1.2-plus-columns share, the same ratio kit-index.tsx's own compare table
 * already draws, and the value columns split what is left evenly instead of
 * however auto layout happened to leave them.
 *
 * THE TICK'S HEIGHT IS RESERVED ON EVERY CELL, the same day, once the phone
 * width read three row heights instead of one (69, 70 and 72, not the two a
 * plain tick-or-not split would give): every row already carried the 1px
 * divide-y border its neighbours above it draw and the first row does not,
 * and now some rows also carried a 16px tick beside a 14px figure that had
 * never needed the room. The two stack, so a first row with no tick, a
 * later row with no tick, and a later row with a tick read as three heights,
 * not two. Every cell now floors at the tick's own height, drawn or not
 * (min-h-4 on the one wrapper every branch returns through), the same idea
 * as TiersTable's name block reserving its local-term line whether or not a
 * term exists, so a row's height stops depending on which of its columns
 * happens to hold a winner (ruling 8, 2026-09-04, equal rows in every case).
 *
 * TWO MARKERS FOR THE HARNESS (plan step 11, 2026-09-17). `data-label` on the
 * name cell of every row, in both forms, so LABEL GAP and ROW SENTENCE in
 * check_model_laws.mjs can read a label at all; `data-col={c.key}` on every
 * VALUE cell, in both forms, never on a head (heads are words by design), so
 * UNIT MIX can group a column's cells by their key and read the units across
 * them. Until then both rules printed UNMEASURED on every page.
 */
import * as React from "react";
import { Box, Rail, Fig, usd } from "@/components/spine/kit";
import { StateMark } from "@/components/spine/forms-v2";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountryFlag } from "@/components/CountryFlag";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "./copy";

/** THE UNITS: "pct", "usd" and "days" are the country table's figures, each
 *  column an absolute, never a difference. "m" joined 2026-09-08 (task 9) for
 *  the city peers table's visitor counts (millions a year), the one absolute
 *  the other three units cannot honestly hold (it is neither a currency, a
 *  percentage nor a day count). EVERY CELL IS AN ABSOLUTE FIGURE IN ITS OWN
 *  COLUMN'S UNIT (his words, 2026-09-07, on the old signed-difference columns:
 *  "for Los Angeles you say minus 14, for Paris you say plus 2, for customer
 *  income you say minus 10%, and for Los Angeles you say plus 3%. So you have
 *  made a mishmash of all of these things."): "index", "pctdiff" and "x" were
 *  signed differences against the home row and are deleted with this comment,
 *  not renamed, so a stale reference cannot silently keep compiling. */
export type CompareColumn = { key: string; head: string; unit: "pct" | "usd" | "days" | "m"; best: "min" | "max" };
/** `iso2` draws the flag; `key` names the row when two rows share a flag (two cities in one country). */
export type CompareRow = { iso2: string; key?: string; name: string; home?: boolean; values: Record<string, number | null> };
export type CompareTableProps = { id: string; kicker: string; icon?: AtlasIconId; rows: CompareRow[]; columns: CompareColumn[]; caveat?: string; entityHead?: string };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Every branch prints the absolute figure the row holds; none carries a
 *  home-row special case anymore, because the home row is a row like any
 *  other now, not a zero this function used to manufacture. */
function fmt(unit: CompareColumn["unit"], v: number): string {
  if (unit === "pct") return `${v}%`;
  if (unit === "usd") return v === 0 ? COPY.free : usd(v);
  if (unit === "m") return `${v.toFixed(1)}M`;
  return `${v} ${v === 1 ? "day" : "days"}`;
}
const PHONE_COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

export function CompareTable({ id, kicker, icon, rows, columns, caveat, entityHead }: CompareTableProps) {
  const phoneCols = PHONE_COLS[Math.min(4, Math.max(1, columns.length))];
  if (rows.length < 2) return null;
  const bestOf: Record<string, number | undefined> = {};
  for (const c of columns) {
    const vs = rows.map((r) => r.values[c.key]).filter(isNum);
    bestOf[c.key] = vs.length >= 2 ? (c.best === "min" ? Math.min(...vs) : Math.max(...vs)) : undefined;
  }
  const isBestVal = (c: CompareColumn, v: number | null): boolean => isNum(v) && bestOf[c.key] != null && v === bestOf[c.key];
  const cellClass = (c: CompareColumn, v: number | null) => (isBestVal(c, v) ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]");
  /** Desktop colgroup shares only; the phone form stacks the name above its
   *  own figures and never shares this row, so it needs no share at all. */
  const nameColPct = (1.2 / (1.2 + columns.length)) * 100;
  const valueColPct = (1 / (1.2 + columns.length)) * 100;
  /** The winning cell keeps the ink and weight cellClass always gave it, and
   *  now also carries the tick beside the figure, right-aligned as one group
   *  so the group, not just the figure, sits flush with the column above it.
   *
   *  THE TICK'S HEIGHT IS RESERVED ON EVERY CELL, held or not, winner or
   *  not, in the one wrapper every branch now returns through: min-h-4 (the
   *  icon's own 16 box, a step on the spacing scale rather than an arbitrary
   *  pixel) floors every cell at the height a tick would need, so a cell
   *  that draws no tick still stands as tall as one that does. This is
   *  height only, never width: a losing cell draws no icon and spends no
   *  gap on one, which is what keeps four figures inside 327px on a phone
   *  (a first attempt that always drew the icon, ink or none, reserved the
   *  gap too and overflowed the four-column table before this one). */
  const renderCell = (c: CompareColumn, v: number | null) => {
    const best = isBestVal(c, v);
    const inner = !isNum(v) ? (
      <span aria-label="not held" className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>
    ) : best ? (
      <span className="inline-flex items-center gap-1 text-[var(--c-ink)]">
        <StateMark kind="yes" />
        <Fig className="text-[length:var(--t-body)] font-semibold">{fmt(c.unit, v)}</Fig>
      </span>
    ) : (
      <Fig className={`text-[length:var(--t-body)] ${cellClass(c, v)}`}>{fmt(c.unit, v)}</Fig>
    );
    return <span className="inline-flex min-h-4 items-center justify-end align-middle">{inner}</span>;
  };
  const head = "text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]";
  return (
    <div data-wide-table className="mt-8">
      <Box id={id} data-archetype="compare-table">
        <Rail icon={icon} kicker={kicker} />
        <div className="hidden md:block">
          <Table className="table-fixed text-[length:var(--t-micro)]">
            <caption className="sr-only">{caveat ?? kicker}</caption>
            <colgroup>
              <col style={{ width: `${nameColPct}%` }} />
              {columns.map((c) => (
                <col key={c.key} style={{ width: `${valueColPct}%` }} />
              ))}
            </colgroup>
            <TableHeader>
              <TableRow className="border-[var(--c-border)] hover:bg-transparent">
                <TableHead scope="col" className={`h-auto px-0 pb-2 text-left ${head}`}>{entityHead ?? COPY.peers.cols.country}</TableHead>
                {columns.map((c) => (
                  <TableHead key={c.key} scope="col" className={`h-auto px-2 pb-2 text-right ${head}`}>{c.head}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key ?? r.iso2} data-row={r.key ?? r.iso2} className={`h-12 border-[var(--c-border)] hover:bg-transparent ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
                  <TableCell className="px-0 py-0 align-middle">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <CountryFlag iso2={r.iso2} className="w-7 shrink-0" />
                      <span data-label className={`truncate text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : ""}`}>{r.name}</span>
                    </span>
                  </TableCell>
                  {columns.map((c) => {
                    const v = r.values[c.key];
                    return (
                      <TableCell key={c.key} data-col={c.key} className="px-2 py-0 text-right align-middle whitespace-nowrap">
                        {renderCell(c, v)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden" data-phone-table="1">
          <div className={`grid ${phoneCols} gap-x-2 border-b border-[var(--c-border)] pb-2`}>
            {columns.map((c) => (
              <span key={c.key} className={`text-right ${head}`} style={{ fontSize: "var(--t-mark)" }}>{c.head}</span>
            ))}
          </div>
          <div className="divide-y divide-[var(--c-border)]">
            {rows.map((r) => (
              <div key={r.key ?? r.iso2} data-row={r.key ?? r.iso2} className={`py-2.5 ${r.home ? "bg-[var(--c-soft)]" : ""}`}>
                <span className="flex items-center gap-2.5">
                  <CountryFlag iso2={r.iso2} className="w-6 shrink-0" />
                  <span data-label className={`text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : "font-medium"}`}>{r.name}</span>
                </span>
                <div className={`mt-1 grid ${phoneCols} gap-x-2`}>
                  {columns.map((c) => {
                    const v = r.values[c.key];
                    return (
                      <span key={c.key} data-col={c.key} className="text-right whitespace-nowrap">
                        {renderCell(c, v)}
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
