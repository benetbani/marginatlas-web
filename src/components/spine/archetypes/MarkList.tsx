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
 *    the whole flag law (height from `--flag-row` or `--flag-hero`, width
 *    auto, `object-contain`, radius stripped, a hairline as an outline rather
 *    than a border) and one line of border arithmetic inside it once put 215
 *    flag violations on the site at once. THE MARK COLUMN IS 2.5rem, which is
 *    exactly what a 2:1 flag occupies at the row rung, and the widest shape in
 *    common use (11:28) does not fit it: that is a loud failure, not a silent
 *    one, because the mark sits in a box the harness's own overflow rule
 *    measures. The column is NOT sized to the widest mark at runtime, because
 *    one shared column is the whole point: a per-row `auto` column sizes to
 *    that row's own mark and lands every name at a different left edge, which
 *    is the exact fault RankedBars.tsx records as its alignment bug. And the
 *    harness compares mark HEIGHTS, never widths: a correct flag set has
 *    deliberately unequal widths (Switzerland is square, Qatar is a ribbon),
 *    so a width rule would red the component for obeying its own law, which is
 *    the measurement trap this project has already paid for once.
 *
 * WHAT IT COUNTS AGAINST. Nothing in the bar family: this card draws no bar,
 * no track and no fill, so PART 6's ledger of three bar drawings a page is
 * untouched by it. It declares `data-idea="I11"` (RANKED ROWS, cap two a
 * page, FORM-CATALOG.md), which is what it actually is. The day someone puts a
 * track behind these figures it becomes I2 and spends a bar, and that is a
 * different card with a different declaration.
 *
 * NOT BUILT, AND SAID RATHER THAN LEFT AS A GAP: a row that navigates. PART 5
 * requires a navigating row to carry an arrow at its right edge and a
 * `--c-soft` hover, which is a fourth column and a second look; no section has
 * adopted this card yet, so which rows have a destination is not known, and a
 * fourth column built for a link nothing uses would be decoration. `MarkRow`
 * therefore carries no `href`.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";

/** PART 9 rule 22's floor, the model's and not this file's: "a ranked
 *  comparison with fewer than four members". Under four the card draws
 *  nothing rather than a short list with an apology under it. Exported so the
 *  builder holds the same number rather than a second copy of it. */
export const MARK_LIST_FLOOR = 4;

/** A row: the name, its figure, and whatever stands in front of them. `mark`
 *  is a node rather than an id or an iso2 on purpose , this file must not know
 *  what kind of thing a mark is, or the next subject (a trade icon, a rank
 *  numeral, nothing at all) would need a branch in here. */
export type MarkRow = { key: string; name: string; value: number; mark?: React.ReactNode };

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
};

/* THE MARK COLUMN, and why it is a constant. See clause 5 of the header: one
   column shared by every row is what lands every name at one left edge, and
   2.5rem is a 2:1 flag's width at `--flag-row`. */
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
   draws, in characters, plus a little slack; `ch` is the advance of "0" in the
   row's own font at the row's own size and the figure is drawn in that same
   font at that size, so n characters occupy at most n ch whenever no glyph in
   the string is wider than a digit. THE BLIND SPOT, stated rather than
   assumed: this cannot tell a formatter whose glyphs are all digit-width or
   narrower from one carrying a wider glyph (a "%" is wider than "0" in some
   faces). A few pixels are absorbed by the 12px column gap, and a real
   overrun is reported by the harness's own overflow rule. */
function geometry(figChars: number, marks: boolean): React.CSSProperties {
  const fig = `calc(${figChars}ch + 0.5rem)`;
  return { gridTemplateColumns: marks ? `${MARK_COL} minmax(0,1fr) ${fig}` : `minmax(0,1fr) ${fig}` };
}

export function MarkList({ id, kicker, icon, tagged, headline, basis, head, rows, fmt, withheld = 0, withheldLine = null }: MarkListProps) {
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
  const figChars = Math.max(1, ...rows.map((r) => fmt(r.value).length));
  const GEO = geometry(figChars, marks);
  return (
    <Box id={id} data-archetype="mark-list" data-idea="I11" data-rows={rows.length} data-marks={marks ? "1" : "0"} data-withheld={withheld}>
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      {/* THE HEADLINE: the set's middle, at the focal rung, in ink. Clause 3. */}
      <div data-answer="1">
        <div className={HEAD_CLS}>{headline.label}</div>
        <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{fmt(headline.value)}</Fig>
      </div>
      <p className="mt-2 max-w-[46ch] text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
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
      <div className={`${ROW} mt-3.5 items-baseline pb-2`} style={GEO}>
        {marks ? <span aria-hidden="true" /> : null}
        <div className="col-span-2 flex items-baseline justify-between gap-x-3">
          <span className={HEAD_CLS}>{head.name}</span>
          <span className={HEAD_CLS}>{head.value}</span>
        </div>
      </div>
      <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={rows.length}>
        {rows.map((r) => (
          <div key={r.key} className={`${ROW} h-11 items-center`} style={GEO} data-row={r.key} data-value={r.value}>
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
            <span className={NAME_CLS}>{r.name}</span>
            <Fig className="py-0.5 text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{fmt(r.value)}</Fig>
          </div>
        ))}
      </div>
      {/* THE WITHHELD LINE SITS AT THE FOOT, not at the top where the money
          card puts it, because it is a statement about what is NOT in the list
          and it reads after the list rather than before it. PART 7's fourth
          part is exactly this: "THE FOOT, where earned. One line, a coverage
          statement." */}
      {withheldLine ? <p data-withheld-line="1" className="mt-2.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{withheldLine}</p> : null}
    </Box>
  );
}
