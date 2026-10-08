"use client";
/**
 * TiersTable , THE TIERS-TABLE ARCHETYPE (registering, by legal form). The
 * founder's expandable table (2026-08-30: "this should be an expandable
 * section... the old table was pretty good... with the complexity as pointers
 * having those terracotta points, that's quite nice"), rebuilt to his rulings
 * of 2026-09-04: EQUAL ROWS in every case (8), a phone form that is not
 * botched (9), and a door to "How to open a business in [country name]" (8).
 *
 * THE LAW INSIDE IT:
 *  - Every row is the same height by construction: the name block reserves
 *    two lines (name, local term or nothing), the readings sit on one line,
 *    so a long local term never makes its row taller than its neighbour.
 *  - The heads are said ONCE (fee, time, paperwork) at every width; on a
 *    phone each row is three lines, name, local term, readings under the
 *    heads, and nothing scrolls sideways (law M).
 *  - Every figure is visible with the card shut (K6, rule 18); only prose
 *    lives behind the disclosure: what the legal FORM is, in words true in
 *    every country, and what the paperwork level means.
 *  - The dots are one idea declared on the set (I5), terracotta by his word.
 *  - The door renders only when the page exists; never a dead link.
 *  - A row that opens carries his plus at its end (Plus, below), turned to a cross while open.
 *
 * COLUMN HEADS AS PROPS, THE KIT WORK OF MODEL.md 8.6 `06 team` (plan step
 * 33's third dispatch, 2026-09-18; the trade composition's 1.2): the same
 * table takes a second shape, `heads` plus `figures`, for a set whose rows
 * are a name and two figures with one unit each and nothing else: the head
 * of the name column and of the two figure columns are the caller's words,
 * the dots column, the expand button and the door are off, and no row is
 * crowned (a wage row has no best). The name block keeps its two-line
 * reserve (`sub` is the second line, or nothing); a name that runs past one
 * line wraps within the reserve rather than truncating (clause 31). The
 * three switches `dots`, `panel` and `door` are real on the registering
 * shape too, so a caller can draw the legal forms without a column it has
 * no data for. Every head is stamped `data-head` and the root declares
 * `data-heads`, the count the harness checks the drawn heads against, one
 * of each and never repeated.
 *
 * Structural contract, relied on by tests/spine/setup_tiers_expand.test.ts:
 * rows are the direct children of [data-idea="I5"]; a row with a panel has a
 * <button aria-expanded>; the open panel is the row's second child.
 */
import * as React from "react";
import { Fig, usd } from "@/components/spine/kit";
import { COPY } from "./copy";
import type { Provenance } from "@/lib/spine/provenance";

export type TierRow = { tier: string; local_term?: string; cost_usd?: number; days?: number; complexity_1_5?: number };
/** A row of the figures shape: the name block's two lines and the two figures as printed (null prints an en dash). */
/** `aProv`, `bProv` (plan 2026-10-08, home sections): where each figure came from, stamped on it (the provenance ratchet); a row
 *  that passes none stamps nothing, as before. */
export type TiersFigureRow = { key: string; name: string; sub?: string | null; a: string | null; b: string | null; aProv?: Provenance | null; bProv?: Provenance | null };
export type TiersHeads = { name?: string; a: string; b: string };
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function TierPanel({ explainer, paperwork }: { explainer?: string; paperwork?: string }) {
  if (!explainer && !paperwork) return null;
  return (
    <div className="mt-2 rounded-[8px] bg-[var(--c-soft)] p-4">
      {explainer ? <p className="text-[length:var(--t-micro)] leading-relaxed text-[var(--c-ink2)]">{explainer}</p> : null}
      {paperwork ? <p className={"text-[length:var(--t-micro)] leading-relaxed text-[var(--c-muted)]" + (explainer ? " mt-2" : "")}>{paperwork}</p> : null}
    </div>
  );
}

/* Column heads in sentence case too (2026-09-25, his capitals ruling; shadcn's table heads the same): capitals were the one
   exception left, and a head of three words ("Payroll on staff") read as texture like any label. */
const HEAD = "text-[length:var(--t-micro)] font-semibold text-[var(--c-muted)]";
/* name | fee | time | dots and the plus, from 480px of table; the widths are the file's own extremes, a $12,000 fee and a
   90-day wait, not the exemplar's. From 480px the last column holds five dots (56px), a gap and the plus (20px): 5.25rem. */
/* ON A PHONE THE NAME KEEPS ITS COLUMN (2026-10-04, the UK page reform; research R2, 3.2): name | fee 56 | time 60 | dots and the
   plus 84, 12 apart, leave the name 107px of a 343px table, room for "Joint-Stock" at 16px and a local name in two lines at 12,
   so each form's fee, time and dots stand on its name's first line in true columns, never on a second line under it. */
const GRID = "grid grid-cols-[minmax(0,1fr)_3.5rem_3.75rem_5.25rem] gap-x-3 [@container(min-width:480px)]:grid-cols-[minmax(0,1fr)_5.5rem_5rem_5.25rem]";
/* name | fee | time, the registering shape with the dots off. */
const GRID_NO_DOTS = "grid grid-cols-[minmax(0,1fr)_3.5rem_3.75rem] gap-x-3 [@container(min-width:480px)]:grid-cols-[minmax(0,1fr)_5.5rem_5rem]";
/* name | a | b, the figures shape: a count and a year's pay ("$44K", "$8,500"). From 330px of table the name keeps its column, the
   two readings narrowed to 60 and 68 until 480 (a wait of "120 days", a fee of "$12,000", "Pay a year" in one line), which leaves
   the name 178 to 327px: "Skilled tradesperson and foreman" in two lines at a phone's 343. */
const GRID_FIGURES = "grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem] gap-x-3 [@container(min-width:330px)]:grid-cols-[minmax(0,1fr)_3.75rem_4.25rem] [@container(min-width:480px)]:grid-cols-[minmax(0,1fr)_4.5rem_5.5rem]";
const DASH = <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>;

/** `tone`: the table's dots are the reading and carry the accent; the legend's dots only say what one and five dots mean, so they
 *  are drawn in ink (ART-DIRECTION C2: two legend groups in the accent made the card five accent marks). */
export function Dots({ n, tone = "terra" }: { n: number; tone?: "terra" | "ink" }) {
  return (
    <span aria-label={`paperwork ${n} of 5`} role="img" className="flex items-center justify-end gap-1">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className="h-2 w-2 rounded-full" style={{ background: i <= n ? (tone === "ink" ? "var(--c-ink2)" : "var(--terra)") : "var(--c-soft2)" }} />)}
    </span>
  );
}

/** THE FOUNDER'S PLUS ON A ROW THAT OPENS (the goal of 2026-09-26, the tables' study). The row's only sign was a chevron at 12px
 *  in the muted grey, which read as decoration, not as "this opens". The plus is his (DetailPanel.tsx's header, 2026-09-08: "the
 *  person clicks a plus and some more info appears"), the kit's InlineDisclosure glyph at the lead rung, in ink2 here because a
 *  sign a reader must find cannot be the faintest thing on the row; turned to a cross while the row is open. A row with nothing
 *  to open keeps the plus's room, invisible, so every row's dots end on one line. */
function Plus({ open, shown, className = "" }: { open: boolean; shown: boolean; className?: string }) {
  return (
    <span aria-hidden data-plus={shown ? "1" : undefined} className={`h-5 w-5 shrink-0 items-center justify-center text-[length:var(--t-lead)] leading-none text-[var(--c-ink2)] transition-transform motion-reduce:transition-none ${open ? "rotate-45" : ""} ${shown ? "" : "invisible"} ${className}`}>+</span>
  );
}

/** `fill` on the registering shape too (2026-09-25, the country page's bill card at 3-2): the legal forms share the height the card
 *  beside gives this one, each row one equal share, the legend and the door at the foot; the caller's Box is a flex column. */
type RegisteringProps = { rows: TierRow[]; howTo?: { href: string; label: string } | null; dots?: boolean; panel?: boolean; door?: boolean; heads?: undefined; figures?: undefined; fill?: boolean };
/** `fill`: the rows share the height a taller card beside this one gives the card (the goal's B12, 2026-09-24), MarkList's one-column rule; the caller's Box is a flex column. */
type FiguresProps = { heads: TiersHeads; figures: TiersFigureRow[]; rows?: undefined; howTo?: undefined; dots?: false; panel?: false; door?: false; fill?: boolean };

export function TiersTable(props: RegisteringProps | FiguresProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  if (props.heads) return <FiguresTable heads={props.heads} figures={props.figures} fill={props.fill} />;
  const { rows, howTo, dots = true, panel = true, door = true, fill = false } = props;
  if (rows.length === 0) return null;
  const anyDots = dots && rows.some((t) => isNum(t.complexity_1_5));
  /* A LOCAL NAME LONGER THAN ITS LINE WRAPS, NEVER CUT (2026-09-26): Mexico's "Sociedad de Responsabilidad Limitada (S. de R.L. de
     C.V.)" ran 7 to 20px past its line at every width and was cut to an ellipsis. Where any row's local name passes 36 characters
     (about the narrowest line's 190px at 12px) every row reserves two lines for it, so the rows stay one height (the harness's
     UNEQUAL) and the long name has its second line. */
  const longTerm = rows.some((t) => (t.local_term && t.local_term !== t.tier ? t.local_term.length : 0) > 36);
  /* A NAME THAT WRAPS IN THE PHONE'S NAME COLUMN (107px at 16px holds about twelve characters) makes every row keep two name
     lines there, so the rows stay one height (the harness's UNEQUAL measured 85 against 61 on Argentina's forms); under 340px of
     table the column is 65px and every name keeps two lines whatever its length (69 against 45 on the sheet's 301px card). */
  const longName = rows.some((t) => String(t.tier ?? "").length > 12);
  /* A WORD THAT CANNOT BREAK (2026-10-04): a name holding a word of more than eight letters ("Freelancer", 82px at 16px) cannot
     wrap inside the 67px name column of a 303px card, and broke inside the word ("Freela / ncer"); such a table stacks its rows
     under 330px of width. Names that break at a space or a hyphen ("Sole Trader", "Joint-Stock") keep their column down to 300px
     (the how-to page's 305px card held them in two lines beside their readings), and every table stacks under 300. */
  const longWord = rows.some((t) => String(t.tier ?? "").split(/[\s-]+/).some((w) => w.length > 8));
  const stackName = longWord ? "[@container(max-width:329px)]:col-span-full" : "[@container(max-width:299px)]:col-span-full";
  const stackCell = longWord ? "[@container(max-width:329px)]:[grid-row:3]" : "[@container(max-width:299px)]:[grid-row:3]";
  const grid = dots ? GRID : GRID_NO_DOTS;
  return (
    /* THE ROW FOLLOWS THE CARD, NOT THE WINDOW (2026-09-26): switched at the window's md, a legal form's name took its own column
       in a card half a 768 window wide and was cut to one letter ("S...", "L...", "J..." on the United Kingdom's page). The table
       is its own container now: from 480px of it the name has its column (the three readings take 244px and 36px of gaps, and a
       name with its local term needs about 170), under that the name spans the row and the readings sit under it. */
    <div data-archetype="tiers-table" data-shape="registering" data-heads={dots ? 3 : 2} className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
      {/* THE HEADS, ONCE, AT EVERY WIDTH. On a phone the name column has no
          head (the name is its own head) and the three readings' heads sit
          right-aligned over their column. */}
      <div className={`${grid} items-end border-b border-[var(--c-border)] pb-2`}>
        <span aria-hidden />
        <span data-head className={`text-right ${HEAD}`}>{COPY.tiers.heads.fee}</span>
        <span data-head className={`text-right ${HEAD}`}>{COPY.tiers.heads.time}</span>
        {dots ? <span data-head className={`text-right ${HEAD}`}>{COPY.tiers.heads.paperwork}</span> : null}
      </div>
      <div data-idea="I5" className={fill ? "flex flex-1 flex-col divide-y divide-[var(--c-border)]" : "divide-y divide-[var(--c-border)]"}>
        {rows.map((t, i) => {
          const isOpen = open === i;
          const explainer = panel ? COPY.tiers.explainers[t.tier as keyof typeof COPY.tiers.explainers] : undefined;
          const paperwork = panel && isNum(t.complexity_1_5) ? COPY.tiers.paperwork[t.complexity_1_5 as 1 | 2 | 3 | 4 | 5] : undefined;
          const hasPanel = Boolean(explainer || paperwork);
          const localTerm = t.local_term && t.local_term !== t.tier ? t.local_term : null;
          /* ONE GRID FOR THE ROW at every width: the name block spans the
             readings' columns on a phone and takes its own column from md.
             The name block reserves two lines so every row is one height. */
          /* THE FIGURES STAND ON THE NAME'S LINE (2026-09-25, his word that night: "the alignment of text in the middle of
             tables is quite bad"): the name block reserves two lines, and centring the row put the fee and the time between
             the name and its second line, level with neither. The row aligns on the first baseline, so each figure reads on
             the line of the name it belongs to; the model laws' ROW LINE clause measures it. */
          /* THE RESERVED LINES STAND UNDER THE ROW, NOT INSIDE IT (2026-10-04, the 768 photo): the name used to reserve its two lines
             itself, so a one-line "LLC" left 24px between it and its local name, and in the 336px half of a 768 band "Private Limited
             Company (Ltd)" sat nearer the next form than its own. The row reserves the height now (a two-line name, 4, the local
             name's lines: 68.5 or 85) and packs its lines at the top, so the local name always hugs its name and every row is still
             one height (the harness's UNEQUAL). */
          const reserve = longName
            ? longTerm ? "[@container(max-width:479px)]:min-h-[5.3125rem]" : "[@container(max-width:479px)]:min-h-[4.28125rem]"
            : longTerm ? "[@container(max-width:340px)]:min-h-[5.3125rem]" : "[@container(max-width:340px)]:min-h-[4.28125rem]";
          const line = (
            <span className={`${grid} w-full content-start items-baseline gap-y-1 ${reserve}`} data-tier-row={i}>
              {/* THE NAME BLOCK spans the row on a phone and takes the first
                  column from md; it reserves two lines so every row is one
                  height; the chevron rides at its right edge. */}
              {/* A NARROW TABLE STACKS: THE NAME TAKES THE ROW AND THE READINGS STAND ON ONE LINE UNDER IT (research R2, pattern f; the
                  German page's 303px card, 2026-10-04): under 330px where a name holds a word that cannot break, under 300 always
                  (`longWord` above); wider (the band page's 343 at 375, a 768 half's 336) the name keeps its column. Each reading
                  names its column, so on the line under the name it stands under its own head, never in the first free cell. */}
              <span className={`flex min-w-0 items-start gap-2 [grid-row:1] ${stackName}`}>
                <span className="min-w-0 flex-1">
                  <span data-label className="block break-words text-[length:var(--t-lead)] font-medium leading-6 text-[var(--c-ink)]">{t.tier}</span>
                </span>
                {dots ? null : <Plus open={isOpen} shown={hasPanel} className="inline-flex" />}
              </span>
              <span className={`col-start-2 text-right [grid-row:1] ${stackCell}`} data-col="fee">
                {/* A zero fee prints "$0" in this column of figures (COPY.free's note, 2026-09-25). */}
                {isNum(t.cost_usd) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{usd(t.cost_usd)}</Fig> : DASH}
              </span>
              <span className={`col-start-3 text-right [grid-row:1] ${stackCell}`} data-col="time">
                {isNum(t.days) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.days} {t.days === 1 ? "day" : "days"}</Fig> : DASH}
              </span>
              {dots ? (
                <span className={`col-start-4 flex items-center justify-end gap-2 [grid-row:1] ${stackCell}`}>
                  {isNum(t.complexity_1_5) ? <Dots n={t.complexity_1_5} /> : null}
                  <Plus open={isOpen} shown={hasPanel} className="inline-flex" />
                </span>
              ) : null}
              {/* THE LOCAL NAME IS THE ROW'S SECOND LINE (2026-10-04, the UK page reform): under the name in its own column from 480px
                  of table; on a narrower table across the whole row under the figures, so it wraps over the table's width rather than
                  the name's 107px (Mexico's "Sociedad de Responsabilidad Limitada (S. de R.L. de C.V.)" ran to six lines there, and
                  the rows stopped being one height, the harness's UNEQUAL). Never cut; every row reserves the same lines for it (two
                  where any local name passes 36 characters, one otherwise); 12 on the snug leading, over the readability floor. */}
              <span className={`col-span-full block break-words text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)] [grid-row:2] [@container(min-width:480px)]:col-span-1 [@container(min-width:480px)]:col-start-1 ${longTerm ? "min-h-[2.75em]" : "min-h-[1.375em]"}`}>{localTerm ?? " "}</span>
            </span>
          );
          return (
            <div key={`${t.tier}-${i}`} className={fill ? "flex flex-1 basis-0 flex-col justify-center py-2 first:pt-2 last:pb-2" : "py-2 first:pt-2 last:pb-0"}>
              {hasPanel ? (
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]">{line}</button>
              ) : (
                <div className="flex w-full">{line}</div>
              )}
              {isOpen && hasPanel ? <TierPanel explainer={explainer} paperwork={paperwork} /> : null}
            </div>
          );
        })}
      </div>
      {/* The legend's text on the prose measure (his clause 51, 2026-09-20); the rule above it keeps the table's width. */}
      {/* THE LEGEND DRAWN (2026-09-25, his word that night: "symbols ... can be used to replace words"): one dot and five, each
          with its words, where a sentence said the same ("More dots, more paperwork: one is an online form, five a lawyer"). */}
      {anyDots ? (
        <div data-legend="dots" className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          <span className="inline-flex items-center gap-2"><Dots n={1} tone="ink" />{COPY.tiers.legendEnds.one}</span>
          <span className="inline-flex items-center gap-2"><Dots n={5} tone="ink" />{COPY.tiers.legendEnds.five}</span>
        </div>
      ) : null}
      {door && howTo ? (
        <div className="mt-3 text-right">
          <a href={howTo.href} className="tap-y inline-block text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{howTo.label} <span aria-hidden>&#8594;</span></a>
        </div>
      ) : null}
    </div>
  );
}

/**
 * THE FIGURES SHAPE: a name block and two figure columns under the caller's
 * heads, at PART 5's sizes (the heads at `--t-micro`, said once, on a phone
 * too; every figure at `--t-body`, 14, a table figure never larger), no
 * dots, no panel, no door, no crowned row, no accent. A null figure prints
 * an en dash; the caller says once what a dash means. Rows are the direct
 * children of `[data-idea="I5"]` as on the registering shape, each carrying
 * `data-tier-row`, so the harness's equal-heights rule reads both shapes
 * with one selector.
 */
function FiguresTable({ heads, figures, fill = false }: { heads: TiersHeads; figures: TiersFigureRow[]; fill?: boolean }) {
  if (figures.length === 0) return null;
  const nameHead = heads.name ?? null;
  /* THE ROWS SHARE A STRETCHED CARD (the goal's B12, 2026-09-24): the trade
     page's team sits at the narrow side of 3-2 beside the split, and where the
     split stands taller (a trade of three roles) the card's foot held 120 to
     144 of nothing (the London sweep: small leather goods, shoe repair, pet
     training). With `fill` the table takes the card's free height and its rows
     share it, as MarkList's one-column rows do beside the donut; a row never
     falls under its content. THE ROWS GROW, THEY ARE NOT EQUAL TRACKS: a grid
     of 1fr rows sizes every row to the tallest when the card is the band's
     tallest (measured on auto dealers: the last row 49 to 57, the card 9
     taller, four split cards beside it pushed over the page filter's floor),
     so the rows are a flex column that only grows into spare height. */
  return (
    /* THE NAME KEEPS ITS COLUMN FROM 330PX OF TABLE (2026-10-04, the band page's phone standard, DISTANCES.md 2.5: three number
       columns at the most beside a name). Under 360px of table the name took the row and its two figures stood on a second line
       under the two-line reserve, 26px below a one-line name (London's permits, every row, on a phone's 343px band). A table
       under 330 (a card's 303 at 375, a band's 288 at 320) still stands the name over its figures: beside two readings it would
       hold 136px, and "Skilled tradesperson and foreman" would need three lines of them (the archetype harness's TEXT CUT). */
    <div data-archetype="tiers-table" data-shape="figures" data-heads={nameHead ? 3 : 2} className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
      {/* THE HEADS, ONCE, AT EVERY WIDTH, at the micro rung a reader reads
          (PART 5: never 10px). The name column's head reads on every width
          here: a role is one of a set, not its own head the way a legal
          form's name is. */}
      <div className={`${GRID_FIGURES} items-end border-b border-[var(--c-border)] pb-2`}>
        {nameHead ? <span data-head className={HEAD}>{nameHead}</span> : <span aria-hidden />}
        <span data-head className={`text-right ${HEAD}`}>{heads.a}</span>
        <span data-head className={`text-right ${HEAD}`}>{heads.b}</span>
      </div>
      <div data-idea="I5" className={fill ? "flex flex-1 flex-col divide-y divide-[var(--c-border)]" : "divide-y divide-[var(--c-border)]"}>
        {figures.map((r, i) => (
          <div key={r.key} className={fill ? "flex grow items-center py-2 first:pt-2 last:pb-0" : "py-2 first:pt-2 last:pb-0"}>
            <div className="flex w-full">
              {/* ONE GRID FOR THE ROW at every width, the registering shape's
                  own phone form: from 330px of table the name block in its
                  column and the figures on its first line; under 330 the name
                  block spans the row, the figures under their heads below. */}
              <span className={`${GRID_FIGURES} w-full items-baseline gap-y-1`} data-tier-row={i}>
                {/* THE NAME BLOCK: two lines reserved on every row (2.5rem, two
                    lines of the lead rung at its tight leading, measured: the
                    two variants stood 37 and 39 before the reserve was one
                    number), the name wrapping into the second when it must
                    (clamped there, so two lines is the block's ceiling and its
                    floor) and the second name standing there otherwise. */}
                <span className="col-span-3 min-h-[2.5rem] min-w-0 [@container(min-width:330px)]:col-span-1">
                  {r.sub ? (
                    <>
                      <span data-label className="block truncate text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{r.name}</span>
                      <span className="block min-h-[1.3em] truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{r.sub}</span>
                    </>
                  ) : (
                    <span data-label className="line-clamp-2 text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{r.name}</span>
                  )}
                </span>
                {/* Under 330px of table the figures sit on their own row under the heads; a spacer keeps them in their columns. */}
                <span aria-hidden className="[@container(min-width:330px)]:hidden" />
                <span className="text-right" data-col="a">
                  {r.a != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]" prov={r.aProv}>{r.a}</Fig> : DASH}
                </span>
                <span className="text-right" data-col="b">
                  {r.b != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]" prov={r.bProv}>{r.b}</Fig> : DASH}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
