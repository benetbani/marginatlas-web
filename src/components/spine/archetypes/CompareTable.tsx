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
 *
 * THE SEATED TABLE, three optional props for the trade page's `07 peers`
 * (MODEL.md 8.6; plan step 33's fourth dispatch, 2026-09-18), each inert
 * where a caller passes none, so the country's and the city's tables draw
 * exactly what they drew:
 *  - `withheld`: the stated line for rows the table does not hold, at the
 *    lead rung in `--c-ink2` under the table (the drawn blocked seat's own
 *    line, BlockedSeat.tsx; `data-withheld-line="rows"`). WITH IT THE TABLE
 *    DRAWS FROM ONE ROW: 8.6 seats the trade's table off the United States
 *    "present with its real structure, the heads said once and the home row
 *    printing its own real figure, under the stated line", and the two-row
 *    floor below stays for every caller that states no line (the country's
 *    builder returns null under two rows and the seat there is BlockedSeat).
 *    A one-row table marks no best value (that needs two figures), so the
 *    home row's only marks are its tint and its weight.
 *  - `note`: one line at `--t-micro` in `--c-muted` under the table, before
 *    the caveat, for a dash the card has to explain once (PART 5's blanks;
 *    the team card's idiom for its dashed pay column).
 *  - `flags`: off, no flag is drawn and the names sit flush to the card's
 *    edge (MarkList's own law for an optional mark). The trade's peers are
 *    places in ONE country, so a flag would be the same flag on every row,
 *    saying nothing five times; the country's and the city's rows are in
 *    different countries and keep theirs (`flags` defaults on).
 *
 * THE ORDER IN THE READER'S HANDS (the goal of 2026-09-26, M5; his message
 * that afternoon: "the already built tables should be studied for ease of
 * use, being understandable"). Read top to bottom the table answered one
 * question, its builder's order; "where does my country stand on tax" had to
 * be worked out cell by cell. Every figure head is now a button (SortTable,
 * src/components/spine/interact/SortTable.tsx): a press brings the column's
 * best figure to the top, the tick's own direction, a second press turns it
 * over, and the home row keeps its tint wherever it lands. The rows are drawn
 * here, as before, and handed to the sort drawn; the opening order is the
 * builder's. Under three rows nothing listens.
 */
import * as React from "react";
import { Box, Rail, Fig, usd } from "@/components/spine/kit";
import { StateMark } from "@/components/spine/forms-v2";
import { TableCell } from "@/components/ui/table";
import { SortTable, type SortRow } from "@/components/spine/interact/SortTable";
import { CountryFlag } from "@/components/CountryFlag";
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "./copy";
import { rentMult } from "@/lib/spine/district_rows";

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
 *  not renamed, so a stale reference cannot silently keep compiling.
 *
 *  TWO MORE JOINED 2026-09-19 (MODEL.md 8.8 `03 compare`, plan step 35, the
 *  controller's ruling (c)), neither a difference against the home row:
 *  "mult", a district's shop rent against the cheapest district of its set,
 *  the set's own member named in the column head ("Rent, against South
 *  London"), printed in `rentMult`'s notation ("2.50x", district_rows.ts, the
 *  one place that notation lives; the reference row prints its own 1.00x,
 *  PART 5's reference-row correction of 2026-09-10), which is NOT the
 *  deleted "x": that one was a multiple of the home row, this one is a
 *  multiple of a named member the table also prints; and "per", a plain
 *  count per one (visitors a year per resident), whole numbers when the
 *  column's values are whole and one decimal otherwise, the column's one
 *  decimal count (PART 5). */
/** `best: "none"` (2026-09-25): a column whose lower and higher values are neither better, a salary (cheaper staff and poorer
 *  customers at once), draws no tick. */
export type CompareColumn = { key: string; head: string; unit: "pct" | "usd" | "days" | "m" | "mult" | "per"; best: "min" | "max" | "none" };
/** `iso2` draws the flag; `key` names the row when two rows share a flag (two cities in one country). */
export type CompareRow = { iso2: string; key?: string; name: string; home?: boolean; values: Record<string, number | null> };
export type CompareTableProps = {
  id: string;
  kicker: string;
  icon?: AtlasIconId;
  rows: CompareRow[];
  columns: CompareColumn[];
  caveat?: string;
  entityHead?: string;
  /** The stated line for rows the table does not hold; with it the table draws from one row (the header's SEATED TABLE). */
  withheld?: string;
  /** One line explaining a dash, said once, under the table before the caveat. */
  note?: string;
  /** Off, no flag is drawn on any row. Defaults on. */
  flags?: boolean;
  /** The opener's sample mark. Defaults off. */
  sample?: boolean;
  /** IN A BAND (2026-09-20 evening, his word on the city's comparison table:
   *  "it should just not be that wide for three columns"): the table stands
   *  in a level beside another card, so it draws no full-width wrapper and no
   *  band margin of its own (the Band carries both), and the lone-card and
   *  full-width gates read it as an ordinary card. Off, the table is the
   *  page's full-width table under its own `data-wide-table` sanction. */
  inBand?: boolean;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Every branch prints the absolute figure the row holds; none carries a
 *  home-row special case anymore, because the home row is a row like any
 *  other now, not a zero this function used to manufacture. */
function fmt(unit: CompareColumn["unit"], v: number, whole = true): string {
  if (unit === "pct") return `${v}%`;
  /* "$0" in a column of figures, never the word (COPY.free's note, 2026-09-25). */
  if (unit === "usd") return usd(v);
  if (unit === "m") return `${v.toFixed(1)}M`;
  if (unit === "mult") return rentMult(v);
  if (unit === "per") return whole ? String(Math.round(v)) : v.toFixed(1);
  return `${v} ${v === 1 ? "day" : "days"}`;
}
const PHONE_COLS: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
/* THE TABLE FOLLOWS ITS CARD, NOT THE WINDOW (2026-09-26). Switched at the window's md, the wide form stood in a card half a 768
   window wide and cut every city on London's page to four letters ("Lon...", "Muni...", "Mad..."); a full-width card at 768 still
   gave the name 19% of the width and cut "United Kingdom". The table is its own container now, and the wide form draws from the
   width its columns need: the name's 10rem (a flag and "United Kingdom") and about 88px a figure column. The classes are written
   out in full, never assembled, so the stylesheet compiler sees them. */
const WIDE_FROM: Record<number, { wide: string; phone: string }> = {
  3: { wide: "hidden [@container(min-width:420px)]:block", phone: "[@container(min-width:420px)]:hidden" },
  4: { wide: "hidden [@container(min-width:500px)]:block", phone: "[@container(min-width:500px)]:hidden" },
  5: { wide: "hidden [@container(min-width:600px)]:block", phone: "[@container(min-width:600px)]:hidden" },
  6: { wide: "hidden [@container(min-width:690px)]:block", phone: "[@container(min-width:690px)]:hidden" },
};

export function CompareTable({ id, kicker, icon, rows, columns, caveat, entityHead, withheld, note, flags = true, sample = false, inBand = false }: CompareTableProps) {
  /* FIVE COLUMNS TAKE THREE A LINE ON A PHONE (2026-09-25, the country's peers gained the average salary): five figures in 327px
     ran "12 days" past the card; three a line, the heads and every row's figures wrapping the same way, keep each figure under its
     head. */
  const phoneCols = columns.length >= 5 ? "grid-cols-3 gap-y-1" : PHONE_COLS[Math.min(4, Math.max(1, columns.length))];
  /* The two-row floor for every caller that states no line; a seated table
     (a `withheld` line) draws from one row, the home row alone (the header). */
  if (rows.length < (withheld ? 1 : 2)) return null;
  const bestOf: Record<string, number | undefined> = {};
  for (const c of columns) {
    const vs = rows.map((r) => r.values[c.key]).filter(isNum);
    bestOf[c.key] = vs.length >= 2 && c.best !== "none" ? (c.best === "min" ? Math.min(...vs) : Math.max(...vs)) : undefined;
  }
  const isBestVal = (c: CompareColumn, v: number | null): boolean => isNum(v) && bestOf[c.key] != null && v === bestOf[c.key];
  const cellClass = (c: CompareColumn, v: number | null) => (isBestVal(c, v) ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]");
  /* ONE DECIMAL COUNT PER COLUMN (PART 5): a "per" column prints whole numbers when every value it holds is whole, one decimal otherwise, decided once for the column and never per cell. */
  const wholeOf: Record<string, boolean> = {};
  for (const c of columns) wholeOf[c.key] = rows.map((r) => r.values[c.key]).filter(isNum).every((v) => Number.isInteger(v));
  const print = (c: CompareColumn, v: number) => fmt(c.unit, v, wholeOf[c.key]);
  /** Desktop colgroup shares only; the phone form stacks the name above its
   *  own figures and never shares this row, so it needs no share at all. */
  const forms = WIDE_FROM[Math.min(6, Math.max(3, columns.length))];
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
        <Fig className="text-[length:var(--t-body)] font-semibold">{print(c, v)}</Fig>
      </span>
    ) : (
      <Fig className={`text-[length:var(--t-body)] ${cellClass(c, v)}`}>{print(c, v)}</Fig>
    );
    return <span className="inline-flex min-h-4 items-center justify-end align-middle">{inner}</span>;
  };
  /* THE ROWS, DRAWN ONCE FOR EACH FORM and handed to the sort with the figures it orders by (the header's ORDER IN THE READER'S
     HANDS). A name longer than its column wraps to a second line, never cut to an ellipsis. The column heads are the sort's, in
     sentence case (2026-09-25, his capitals ruling; shadcn's table heads the same). */
  const sortRows: SortRow[] = rows.map((r) => ({
    key: r.key ?? r.iso2,
    home: r.home,
    values: r.values,
    cells: (
      <>
        <TableCell className="px-0 py-0 align-middle">
          <span className="flex min-w-0 items-center gap-3">
            {flags ? <CountryFlag iso2={r.iso2} className="w-7 shrink-0" /> : null}
            <span data-label className={`min-w-0 break-words leading-tight text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : ""}`}>{r.name}</span>
          </span>
        </TableCell>
        {columns.map((c) => (
          <TableCell key={c.key} data-col={c.key} className="px-2 py-0 text-right align-middle whitespace-nowrap">
            {renderCell(c, r.values[c.key])}
          </TableCell>
        ))}
      </>
    ),
    phone: (
      <>
        <span className="flex items-center gap-3">
          {flags ? <CountryFlag iso2={r.iso2} className="w-6 shrink-0" /> : null}
          <span data-label className={`text-[length:var(--t-body)] text-[var(--c-ink)] ${r.home ? "font-semibold" : "font-medium"}`}>{r.name}</span>
        </span>
        <div className={`mt-1 grid ${phoneCols} gap-x-2`}>
          {columns.map((c) => (
            <span key={c.key} data-col={c.key} className="text-right whitespace-nowrap">
              {renderCell(c, r.values[c.key])}
            </span>
          ))}
        </div>
      </>
    ),
  }));
  return (
    <div {...(inBand ? { className: "h-full" } : { "data-wide-table": "", className: "mt-8" })}>
      <Box id={id} data-archetype="compare-table" data-flags={flags ? "1" : "0"} className={inBand ? "h-full" : undefined}>
        <Rail icon={icon} kicker={kicker} sample={sample} />
        <div className="[container-type:inline-size]">
          <SortTable
            label={caveat ?? kicker}
            words={COPY.sort}
            columns={columns.map((c) => ({ key: c.key, head: c.head, best: c.best }))}
            rows={sortRows}
            entityHead={entityHead ?? COPY.peers.cols.country}
            wideClass={forms.wide}
            phoneClass={forms.phone}
            phoneCols={phoneCols}
          />
        </div>
        {/* The stated line for the rows the table does not hold, at the lead rung where those rows would stand (the header's SEATED TABLE). */}
        {withheld ? <p data-withheld-line="rows" className="mt-3 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{withheld}</p> : null}
        {note ? <p className="mt-3 text-balance text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
        {caveat ? <p className={`${note ? "mt-1" : "mt-3"} text-balance text-[length:var(--t-micro)] text-[var(--c-muted)]`}>{caveat}</p> : null}
      </Box>
    </div>
  );
}
