/**
 * MarkList , THE UNIVERSAL LIST CARD (B3, 2026-09-10). His reference is a card
 * with a big figure at the top and, under it, rows of country flag, country
 * name and figure; his use of it is the reason this is built before the three
 * that follow: "the one with flags is pretty universal but the use can be
 * beyond the use of flags itself, universal format."
 *
 * So the form is one headline figure with its own words, then a list of rows,
 * and a row is a leading MARK, a name and a figure. The flag is ONE thing that
 * can sit in the mark slot. Nothing in this file knows what a flag is.
 *
 * WHAT PORTED AND WHAT DID NOT. The reference is blue and white; this palette
 * is terracotta and warm neutrals, so colour did not port, and this card
 * spends none of it: there is no accent text on it anywhere, no pill and no
 * marked row. His small delta pill beside the headline did not port either,
 * for the reason IncomeBreakdown.tsx already recorded for the same pill: a
 * delta needs a prior period to be honest about, and neither file behind this
 * card holds one (mark_list_rows.ts, and DATA-REQUIREMENTS.md 19).
 *
 * THE LAW INSIDE IT, five clauses.
 *
 * 1. THE MARK IS OPTIONAL AND THE CARD READS WITHOUT IT. A card that collapses
 *    into nonsense when the marks are gone is a flag card, not a universal one.
 *    So the mark has no column of its own unless a row carries one: with marks
 *    the grid is `[mark, name, figure]`, without them it is `[name, figure]`
 *    and the names sit flush to the card's own padding edge. Nothing is
 *    reserved, nothing is left blank, and the figures keep the same right edge
 *    either way. The `no-marks` story is the same card on the same data with
 *    the marks dropped, and it is there so this clause is looked at rather
 *    than asserted.
 *
 * 2. EVERY ROW CARRIES A FIGURE (PART 5: "a label never stands where a number
 *    goes"). A member of the set that holds no figure is WITHHELD with a
 *    stated line counting them and saying why, exactly as the country money
 *    card withholds its trades (`margin_rows.ts`). Never printed blank, never
 *    dropped in silence. The card declares the count it withheld
 *    (`data-withheld`) so the harness can hold the line and the count to each
 *    other in both directions: a withheld member with no line is a silent
 *    drop, and a line with nothing withheld is a card apologising for
 *    something that did not happen.
 *
 * 3. THE HEADLINE IS NOT LOUD. It is the card's one focal figure, 30px in
 *    `--c-ink` (PART 6: "Ink at 30 is how a quiet card gets hierarchy without
 *    spending an accent"), and it is NOT one of the page's three accent
 *    moments. It does not compete with the rows because it is not the same
 *    kind of statement: the rows are the highest few members, and the headline
 *    is the MIDDLE of the whole set, which is the one reading the rows cannot
 *    give. That is what makes it an answer rather than a number sitting at the
 *    top: "what does an ordinary one look like, and who is at the top" is one
 *    question, and this card answers it in one look. The basis line under it
 *    names the size of the set, so the reader can see the rows are a slice of
 *    something larger.
 *
 * 4. THE ROWS ARE ONE HEIGHT BY CONSTRUCTION, not by content luck: every row
 *    is `h-11` (2.75rem), a declared height, which is the second of the two
 *    mechanisms PART 5 names for ruling 7 ("`auto-rows-fr`, or a fixed row
 *    height on a table"). `auto-rows-fr` is NOT used here on purpose: it
 *    equalises rows only when the grid has a definite height to share out, and
 *    this card is as tall as its content, so `fr` rows would fall back to
 *    sizing themselves and a wrapped name would make one row taller than its
 *    siblings. 2.75rem is also the 44px target a row needs the day it becomes
 *    a link. THE BLIND SPOT OF A DECLARED HEIGHT, and it is the reason the
 *    harness measures two things rather than one: equal heights become
 *    trivially true, so a row whose content is TALLER than the row would pass
 *    a height comparison while spilling over the divider. The harness reads
 *    each row's scroll height against its client height for exactly that, and
 *    the fault was planted and watched go red before the rule was trusted.
 *
 * 5. `CountryFlag` IS REUSED, NEVER REIMPLEMENTED, and this file does not
 *    import it: a caller passes the flag in as the mark. That component holds
 *    the whole flag law (height from `--flag-row` or `--flag-hero`, width from
 *    `--flag-row-w` or `--flag-hero-w`, `object-contain` so the flag is fitted
 *    into that box rather than stretched to it, radius stripped, a hairline as
 *    an outline rather than a border) and one line of border arithmetic inside
 *    it once put 215 flag violations on the site at once. THE MARK COLUMN IS
 *    2.5rem, and it is NOT sized to the widest mark at runtime, because one
 *    shared column is the whole point: a per-row `auto` column sizes to that
 *    row's own mark and lands every name at a different left edge, which is the
 *    exact fault RankedBars.tsx records as its alignment bug. 2.5rem is not
 *    tied to the flag token either, and deliberately: nothing in this file may
 *    know what a flag is, so the column is sized to hold the widest mark KIND
 *    this card will ever carry, with the 30px flag box sitting inside it and
 *    10px to spare on every row alike.
 *
 *    THE HARNESS NOW COMPARES MARK WIDTHS AS WELL AS HEIGHTS (2026-09-11), and
 *    this clause used to say the opposite: "a correct flag set has deliberately
 *    unequal widths (Switzerland is square, Qatar is a ribbon), so a width rule
 *    would red the component for obeying its own law." True of the old law,
 *    false of this one. The founder ruled
 *    "all-flags-same-width-please-madatory-always", so every mark occupies one
 *    box and the shape inside it is letterboxed, never stretched; unequal
 *    widths are the fault now. A consequence worth noting here because it
 *    deleted a hazard: no mark can overflow the 2.5rem column any more, so the
 *    widest shape in common use (11:28) no longer has to fail loudly in it.
 *
 * WHAT IT COUNTS AGAINST. Nothing in the bar family: this card draws no bar,
 * no track and no fill, so PART 6's ledger of three bar drawings a page is
 * untouched by it. It declares `data-idea="I11"` (RANKED ROWS, cap two a
 * page, FORM-CATALOG.md), which is what it actually is. The day someone puts a
 * track behind these figures it becomes I2 and spends a bar, and that is a
 * different card with a different declaration.
 *
 * A ROW THAT NAVIGATES, built 2026-09-18 (plan step 33's sixth dispatch) for
 * the first section that has a destination on every row: the trade page's
 * `13 rivals` (MODEL.md 8.6, "every row a link"). Until then this paragraph
 * said the fourth column was not built because nothing used it. PART 5's
 * law, exactly: a row that navigates carries an arrow at its right edge and
 * a `--c-soft` hover, and a row that does not carries neither, so a page
 * never has two rows that look the same and behave differently. A row with
 * an `href` is drawn as an `<a>` on the same grid, with one more column at
 * the right edge for the arrow; the column is drawn when ANY row carries an
 * href, the same rule as the marks, so a card whose rows navigate keeps one
 * right edge for every figure, and a card with a stray link among static
 * rows shows the fault rather than hiding it (no harness rule reads the
 * arrows yet; a row navigating without its arrow, or an arrow on a row that
 * does not, shows in the photograph). The figures keep one right edge
 * either way; only the arrow column sits past them. Measured on the trade
 * page at 1280, 768 and 375: the four rows one height, nothing overflows.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import type { DoorKind } from "@/lib/spine/door_kinds";
import { CompanionRow, type Companion } from "./BentoBand";

/** PART 9 rule 22's floor, the model's and not this file's: "a ranked
 *  comparison with fewer than four members". Under four the card draws
 *  nothing rather than a short list with an apology under it. Exported so the
 *  builder holds the same number rather than a second copy of it. */
export const MARK_LIST_FLOOR = 4;

/** PART 9 clause 20's line: a ranking of six or more is one column read top to
 *  bottom at every width; under six the rows may stand in two columns on a wide
 *  card (PART 5). The model's number, held here beside the floor. */
export const TWO_COLUMN_CAP = 6;

/** A row: the name, its figure, and whatever stands in front of them. `mark`
 *  is a node rather than an id or an iso2 on purpose , this file must not know
 *  what kind of thing a mark is, or the next subject (a trade icon, a rank
 *  numeral, nothing at all) would need a branch in here. */
export type MarkRow = {
  key: string;
  name: string;
  value: number;
  mark?: React.ReactNode;
  /** A destination makes the row a door (PART 5): drawn as a link with an arrow at its right edge and a `--c-soft` hover. */
  href?: string;
  /** What a row that navigates promises: the kind its page's masthead answers (door_kinds.ts), set by the builder with the href and stamped as `data-lands` (plan step 39, 2026-09-19). */
  lands?: DoorKind;
};

export type MarkListProps = {
  id: string;
  kicker: string;
  icon?: AtlasIconId;
  tagged?: boolean;
  /** The set's own figure and the words over it. Formatted with the same `fmt`
   *  as every row, so the card cannot hold two notations for one quantity. */
  headline: { label: string; value: number };
  basis: string;
  /** The two column heads. The unit is said HERE, once, and nowhere else
   *  (PART 5: "THE UNIT. Said once, in the column head"). */
  head: { name: string; value: string };
  rows: MarkRow[];
  fmt: (v: number) => string;
  /** How many members of the set hold no figure. Declared even when zero: the
   *  harness reads it against the presence of the line below. */
  withheld?: number;
  withheldLine?: string | null;
  /** THE COMPOSER'S WORD THAT THE WIDE SEAT OPENS NO HOLE (2026-09-20): the
   *  two-column form below exists for a wide card beside a SHORTER partner
   *  (PART 5's clause is about the hole a tall one-column list opens beside
   *  it). Beside a TALLER partner the one-column list is the fit, and two
   *  columns would leave the list's own card short: the trade page's `13
   *  rivals` at 693 stands 397 in one column beside the donut's 409, and 308
   *  in two columns with 100 of air under it. The caller says which partner
   *  it has; the component cannot see the band. */
  oneColumn?: boolean;
  /** THE FOOT, PART 7's fourth part, where earned (2026-09-23, the city's `20
   *  crew`): companion figures at 16 under a hairline after the list, drawn by
   *  the same `CompanionRow` RankedBars' foot uses, so the two list cards' feet
   *  are one markup. The crew card's is the week's usual hours, which is the
   *  other half of a wage bill and belongs to this card rather than to one of
   *  its own. */
  foot?: { items: Companion[]; line?: string | null } | null;
};

/* THE MARK COLUMN, and why it is a constant. See clause 5 of the header: one
   column shared by every row is what lands every name at one left edge, and
   2.5rem holds the widest mark kind this card carries with room to spare,
   including the 30px flag box of `--flag-row-w`. Not derived from that token:
   this file must not know what a flag is. */
const MARK_COL = "2.5rem";
/* No `align-items` in this class, deliberately: the head baselines its two
   words and a data row centres its three cells, and two class names both
   setting it would be decided by the order Tailwind emits them rather than by
   the order they are written (RankedBars.tsx paid for that lesson first). */
const ROW = "grid gap-x-3";
const HEAD_CLS = "text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]";
/* `py-0.5` on the name and on the figure alike: a name and a figure reserving
   the same vertical padding hold one row whatever either of them says. */
const NAME_CLS = "min-w-0 py-0.5 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]";

/* ONE TEMPLATE FOR THE WHOLE CARD, computed once and set identically on the
   head and on every row. The figure column is the widest figure THIS card
   draws, in characters, plus a little slack.

   `ch` IS THE ROW'S UNIT, NOT THE FIGURE'S (2026-09-11). It is the advance of
   "0" in THIS GRID ELEMENT'S font, the body sans; the figure inside is drawn
   in the display face (globals.css `--font-num`, via `.fig`). Measured: Geist's
   tabular "0" is 0.600em, Space Grotesk's 0.620em, so n characters occupy at
   most n x 1.034 ch. The `+ 0.5rem` slack covers that 3.4% for every figure
   length this card draws, and it is a smaller cushion than RankedBars' 1rem,
   so this is the call site to re-measure first if the figure face ever changes
   again. THE BLIND SPOT, stated rather than assumed: this cannot tell a
   formatter whose glyphs are all digit-width or narrower from one carrying a
   wider glyph (a "%" is wider than "0" in some faces). A few pixels are
   absorbed by the 12px column gap, and a real overrun is reported by the
   harness's own overflow rule (check_archetypes.mjs BOTCHED MOBILE). */
/* THE ARROW COLUMN, a constant for the same reason the mark column is: one
   column shared by every row keeps every figure on one right edge. Sized to
   the glyph at the body rung with air on its left. */
const ARROW_COL = "1.25rem";
function geometry(figChars: number, marks: boolean, doors: boolean): React.CSSProperties {
  const fig = `calc(${figChars}ch + 0.5rem)`;
  const cols = [marks ? MARK_COL : null, "minmax(0,1fr)", fig, doors ? ARROW_COL : null].filter((c): c is string => c != null);
  return { gridTemplateColumns: cols.join(" ") };
}

export function MarkList({ id, kicker, icon, tagged, headline, basis, head, rows, fmt, withheld = 0, withheldLine = null, oneColumn = false, foot = null }: MarkListProps) {
  /* The component repeats the builder's floor rather than trusting every
     future caller to honour it, the same guard IncomeBreakdown.tsx keeps. */
  if (rows.length < MARK_LIST_FLOOR || !Number.isFinite(headline.value)) return null;
  /* MARKS ARE DRAWN IF ANY ROW CARRIES ONE, not if every row does. A set where
     some rows have a mark and some do not is a caller fault, and this is the
     loud way to meet it: the column is drawn, the rows missing their mark are
     visibly empty, and the harness names the card and counts them. Drawing no
     marks at all in that case would hide the fault inside a layout that looks
     deliberate. */
  const marks = rows.some((r) => r.mark != null);
  /* DOORS ARE DRAWN IF ANY ROW CARRIES ONE, the marks' rule: a row with an
     href among rows without is a caller fault and is met loudly, the arrow
     column drawn and the static rows visibly without an arrow. */
  const doors = rows.some((r) => typeof r.href === "string" && r.href.length > 0);
  const figChars = Math.max(1, ...rows.map((r) => fmt(r.value).length));
  const GEO = geometry(figChars, marks, doors);
  return (
    /* THE ONE-COLUMN LIST FILLS ITS LEVEL (the goal's B12, 2026-09-24). Every
       caller of `oneColumn` seats the list beside a taller card (the donut on
       the trade and industry pages, the texture table on the city), and a
       band stretches both to one height (founder ruling 7). With fixed rows
       the slack piled at the foot: a 653 by 120 to 144 blank under the trade
       page's rivals on 13 London trades at 1280 (E7's sweep), and 87 of
       nothing under the city's crew card on every city (the page laws'
       CARD FOOT BLANK). The rows now share the height, RankedBars' rule
       (`minmax(2.5rem,1fr)` there): each keeps its 2.75rem floor and takes
       an equal part of the slack, the name and the figure centred in it, so
       the air reads as the table's own spacing; where the list is the taller
       card nothing moves. The two-column form keeps its declared rows. */
    <Box id={id} className={oneColumn ? "flex flex-col" : ""} data-archetype="mark-list" data-idea="I11" data-rows={rows.length} data-marks={marks ? "1" : "0"} data-doors={doors ? "1" : "0"} data-withheld={withheld}>
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      {/* THE HEADLINE: the set's middle, at the focal rung, in ink. Clause 3. */}
      <div data-answer="1">
        <div className={HEAD_CLS}>{headline.label}</div>
        <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{fmt(headline.value)}</Fig>
      </div>
      {basis ? <p className="mt-2 max-w-[46ch] text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
      {/* THE HEAD STANDS ON THE SAME COLUMNS AS THE ROWS: the same `GEO`, an
          empty cell over the marks, and then one span across the name and
          figure columns holding the two heads at its ends. The value head is
          wider than a figure column is, so it cannot live inside that column;
          spanning is the honest way to say a label is wider than the column it
          names, and it puts the head's right edge exactly where every figure's
          right edge is. This is not the `justify-between` PART 5 bans: that
          clause is about a label held apart from its own figure, and
          check_model_laws.mjs reads it as such (a row drawing a `.fig` or
          carrying `[data-row]`); these are two column names and the head
          carries neither. */}
      {/* TWO COLUMNS OF ROWS ON A WIDE CARD (PART 5, THE GEOMETRY: "On a card
          wide enough to open a hole, rows go into two columns of rows, never
          one wide row"; built 2026-09-18, plan step 33's sixth dispatch, for
          the trade page's `13 rivals` in the wide seat of its 2-1 band, where
          a one-column list of four stood 397 tall beside a two-mark strip and
          opened a 280 by 138 blank on the strip's card that no split in the
          closed set could close). The rows flow DOWN the left column and then
          down the right (column-major, `grid-flow-col` on a declared row
          count), so the ranking still reads top to bottom, each column under
          its own heads (PART 5: "a wide table reconfigures into two narrower
          reads with their heads said once", one head row per read); the
          second head row is drawn only when the columns are. The switch is
          the CONTAINER'S width, 600px, the same rung NoteList's two columns
          fire at, never the viewport: the same card at 520 in a 1-1 band
          stays one column. SIX OR MORE ROWS STAY ONE COLUMN whatever the
          width (PART 9 clause 20, "a ranking of six or more drawn as
          left-to-right columns", and PART 5: "Six or more ranked members is a
          table read top to bottom"), so the two-column form is the under-six
          form and a six-row list is the tall list it always was. Every row
          keeps its declared height and its own top hairline (the container's
          divide rule cannot tell two columns apart, so each row draws its own
          line), and the harness's ROWS CUT, NO FIGURE and UNEQUAL read the
          rows wherever they stand. */}
      {(() => {
        const twoCols = rows.length < TWO_COLUMN_CAP && !oneColumn;
        const perCol = Math.ceil(rows.length / 2);
        const headRow = (hidden: boolean) => (
          <div className={`${ROW} items-baseline pb-2 ${hidden ? "hidden [@container(min-width:600px)]:grid" : ""}`} style={GEO} aria-hidden={hidden ? "true" : undefined}>
            {marks ? <span aria-hidden="true" /> : null}
            <div className="col-span-2 flex items-baseline justify-between gap-x-3">
              <span className={HEAD_CLS}>{head.name}</span>
              <span className={HEAD_CLS}>{head.value}</span>
            </div>
            {/* An empty cell over the arrow column, so the value head's right edge stays over every figure's. */}
            {doors ? <span aria-hidden="true" /> : null}
          </div>
        );
        const rowEl = (r: MarkRow) => {
          const cells = (
            <>
              {marks ? (
                <span className="flex min-w-0 items-center">
                  {/* THE MARK'S OWN BOX, and the only thing in this card the
                      harness measures for size. The outer cell is a grid item
                      and stretches to the track, so measuring IT would be
                      vacuous; this inner box is inline and is exactly as big as
                      whatever was passed in. It exists only where a mark does,
                      so a missing mark is a missing element rather than an empty
                      box nobody can tell from a drawn one. */}
                  {r.mark != null ? <span data-mark className="inline-flex items-center">{r.mark}</span> : null}
                </span>
              ) : null}
              <span data-label className={NAME_CLS}>{r.name}</span>
              <Fig className="py-0.5 text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{fmt(r.value)}</Fig>
              {/* THE ARROW, at the right edge of a row that navigates and on
                  no other (PART 5, LINKS LOOK LIKE LINKS): the cell is drawn
                  on every row of a card with doors so the columns hold, and
                  the glyph only where the row has somewhere to go. */}
              {doors ? (
                <span aria-hidden="true" className="text-right text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.href ? <>&#8594;</> : null}</span>
              ) : null}
            </>
          );
          const rowCls = `${ROW} ${oneColumn ? "min-h-11" : "h-11"} items-center border-t border-[var(--c-border)]`;
          return r.href ? (
            <a key={r.key} href={r.href} className={`${rowCls} no-underline transition-colors hover:bg-[var(--c-soft)]`} style={GEO} data-row={r.key} data-value={r.value} data-lands={r.lands}>
              {cells}
            </a>
          ) : (
            <div key={r.key} className={rowCls} style={GEO} data-row={r.key} data-value={r.value}>
              {cells}
            </div>
          );
        };
        return (
          <div className={oneColumn ? "mt-4 flex flex-1 flex-col [container-type:inline-size]" : "mt-4 [container-type:inline-size]"}>
            <div
              className={twoCols ? "grid [@container(min-width:600px)]:grid-flow-col [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-x-6 [@container(min-width:600px)]:grid-rows-[auto_repeat(var(--ml-rows),2.75rem)]" : oneColumn ? "grid flex-1" : "grid"}
              style={twoCols ? ({ "--ml-rows": String(perCol) } as React.CSSProperties) : oneColumn ? { gridTemplateRows: "auto", gridAutoRows: "minmax(2.75rem,1fr)" } : undefined}
              data-expect-rows={rows.length}
              data-columns={twoCols ? "2" : "1"}
            >
              {headRow(false)}
              {rows.slice(0, twoCols ? perCol : rows.length).map(rowEl)}
              {twoCols ? headRow(true) : null}
              {twoCols ? rows.slice(perCol).map(rowEl) : null}
            </div>
          </div>
        );
      })()}
      {/* THE WITHHELD LINE SITS AT THE FOOT, not at the top where the money
          card puts it, because it is a statement about what is NOT in the list
          and it reads after the list rather than before it. PART 7's fourth
          part is exactly this: "THE FOOT, where earned. One line, a coverage
          statement." */}
      {withheldLine ? <p data-withheld-line="1" className="mt-3 text-[length:var(--t-micro)] text-[var(--c-muted)]">{withheldLine}</p> : null}
      {foot && foot.items.length > 0 ? (
        <div data-foot className="mt-3 border-t border-[var(--c-border)] pt-3">
          <CompanionRow items={foot.items} />
          {foot.line ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot.line}</p> : null}
        </div>
      ) : null}
    </Box>
  );
}
