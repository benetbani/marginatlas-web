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

export type TierRow = { tier: string; local_term?: string; cost_usd?: number; days?: number; complexity_1_5?: number };
/** A row of the figures shape: the name block's two lines and the two figures as printed (null prints an en dash). */
export type TiersFigureRow = { key: string; name: string; sub?: string | null; a: string | null; b: string | null };
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

const HEAD = "text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]";
/* name | fee | time | dots | chevron, from md; the widths are the file's own
   extremes, a $12,000 fee and a 90-day wait, not the exemplar's. */
const GRID = "grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem_4.75rem] gap-x-3 md:grid-cols-[minmax(0,1fr)_5.5rem_5rem_4.75rem]";
/* name | fee | time, the registering shape with the dots off. */
const GRID_NO_DOTS = "grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-x-3 md:grid-cols-[minmax(0,1fr)_5.5rem_5rem]";
/* name | a | b, the figures shape: a count and a year's pay ("$44K", "$8,500"). */
const GRID_FIGURES = "grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem] gap-x-3";
const DASH = <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>;

function Dots({ n }: { n: number }) {
  return (
    <span aria-label={`paperwork ${n} of 5`} role="img" className="flex items-center justify-end gap-1">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: i <= n ? "var(--terra)" : "var(--c-soft2)" }} />)}
    </span>
  );
}

type RegisteringProps = { rows: TierRow[]; howTo?: { href: string; label: string } | null; dots?: boolean; panel?: boolean; door?: boolean; heads?: undefined; figures?: undefined };
type FiguresProps = { heads: TiersHeads; figures: TiersFigureRow[]; rows?: undefined; howTo?: undefined; dots?: false; panel?: false; door?: false };

export function TiersTable(props: RegisteringProps | FiguresProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  if (props.heads) return <FiguresTable heads={props.heads} figures={props.figures} />;
  const { rows, howTo, dots = true, panel = true, door = true } = props;
  if (rows.length === 0) return null;
  const anyDots = dots && rows.some((t) => isNum(t.complexity_1_5));
  const grid = dots ? GRID : GRID_NO_DOTS;
  const span = dots ? "col-span-4" : "col-span-3";
  return (
    <div data-archetype="tiers-table" data-shape="registering" data-heads={dots ? 3 : 2}>
      {/* THE HEADS, ONCE, AT EVERY WIDTH. On a phone the name column has no
          head (the name is its own head) and the three readings' heads sit
          right-aligned over their column. */}
      <div className={`${grid} items-end border-b border-[var(--c-border)] pb-2`}>
        <span aria-hidden />
        <span data-head className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.fee}</span>
        <span data-head className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.time}</span>
        {dots ? <span data-head className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.paperwork}</span> : null}
      </div>
      <div data-idea="I5" className="divide-y divide-[var(--c-border)]">
        {rows.map((t, i) => {
          const isOpen = open === i;
          const explainer = panel ? COPY.tiers.explainers[t.tier as keyof typeof COPY.tiers.explainers] : undefined;
          const paperwork = panel && isNum(t.complexity_1_5) ? COPY.tiers.paperwork[t.complexity_1_5 as 1 | 2 | 3 | 4 | 5] : undefined;
          const hasPanel = Boolean(explainer || paperwork);
          const localTerm = t.local_term && t.local_term !== t.tier ? t.local_term : null;
          /* ONE GRID FOR THE ROW at every width: the name block spans the
             readings' columns on a phone and takes its own column from md.
             The name block reserves two lines so every row is one height. */
          const line = (
            <span className={`${grid} w-full items-center gap-y-1`} data-tier-row={i}>
              {/* THE NAME BLOCK spans the row on a phone and takes the first
                  column from md; it reserves two lines so every row is one
                  height; the chevron rides at its right edge. */}
              <span className={`${span} flex min-w-0 items-center gap-2 md:col-span-1`}>
                <span className="min-w-0 flex-1">
                  <span data-label className="block truncate text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{t.tier}</span>
                  <span className="block min-h-[1.3em] truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{localTerm ?? " "}</span>
                </span>
                <span aria-hidden className={`shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform md:hidden ${isOpen ? "rotate-90" : ""}`}>{hasPanel ? "›" : ""}</span>
              </span>
              {/* On a phone the readings sit on their own row under the heads; a spacer keeps them in their columns. */}
              <span aria-hidden className="md:hidden" />
              <span className="text-right" data-col="fee">
                {t.cost_usd === 0 ? <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{COPY.free}</span> : isNum(t.cost_usd) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{usd(t.cost_usd)}</Fig> : DASH}
              </span>
              <span className="text-right" data-col="time">
                {isNum(t.days) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.days} {t.days === 1 ? "day" : "days"}</Fig> : DASH}
              </span>
              {dots ? (
                <span className="flex items-center justify-end gap-2">
                  {isNum(t.complexity_1_5) ? <Dots n={t.complexity_1_5} /> : null}
                  <span aria-hidden className={`hidden text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform md:inline ${isOpen ? "rotate-90" : ""}`}>{hasPanel ? "›" : ""}</span>
                </span>
              ) : null}
            </span>
          );
          return (
            <div key={`${t.tier}-${i}`} className="py-2 first:pt-2 last:pb-0">
              {hasPanel ? (
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full text-left">{line}</button>
              ) : (
                <div className="flex w-full">{line}</div>
              )}
              {isOpen && hasPanel ? <TierPanel explainer={explainer} paperwork={paperwork} /> : null}
            </div>
          );
        })}
      </div>
      {/* The legend's text on the prose measure (his clause 51, 2026-09-20); the rule above it keeps the table's width. */}
      {anyDots ? <div className="mt-2 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]"><span className="block [max-width:var(--measure-prose)]">{COPY.tiers.legend}</span></div> : null}
      {door && howTo ? (
        <div className="mt-2.5 text-right">
          <a href={howTo.href} className="text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{howTo.label} <span aria-hidden>&#8594;</span></a>
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
function FiguresTable({ heads, figures }: { heads: TiersHeads; figures: TiersFigureRow[] }) {
  if (figures.length === 0) return null;
  const nameHead = heads.name ?? null;
  return (
    <div data-archetype="tiers-table" data-shape="figures" data-heads={nameHead ? 3 : 2}>
      {/* THE HEADS, ONCE, AT EVERY WIDTH, at the micro rung a reader reads
          (PART 5: never 10px). The name column's head reads on every width
          here: a role is one of a set, not its own head the way a legal
          form's name is. */}
      <div className={`${GRID_FIGURES} items-end border-b border-[var(--c-border)] pb-2`}>
        {nameHead ? <span data-head className={HEAD}>{nameHead}</span> : <span aria-hidden />}
        <span data-head className={`text-right ${HEAD}`}>{heads.a}</span>
        <span data-head className={`text-right ${HEAD}`}>{heads.b}</span>
      </div>
      <div data-idea="I5" className="divide-y divide-[var(--c-border)]">
        {figures.map((r, i) => (
          <div key={r.key} className="py-2 first:pt-2 last:pb-0">
            <div className="flex w-full">
              {/* ONE GRID FOR THE ROW at every width, the registering shape's
                  own phone form: the name block spans the row on a phone and
                  takes its own column from md, the figures under their heads
                  on the line below. */}
              <span className={`${GRID_FIGURES} w-full items-center gap-y-1`} data-tier-row={i}>
                {/* THE NAME BLOCK: two lines reserved on every row (2.5rem, two
                    lines of the lead rung at its tight leading, measured: the
                    two variants stood 37 and 39 before the reserve was one
                    number), the name wrapping into the second when it must
                    (clamped there, so two lines is the block's ceiling and its
                    floor) and the second name standing there otherwise. */}
                <span className="col-span-3 min-h-[2.5rem] min-w-0 md:col-span-1">
                  {r.sub ? (
                    <>
                      <span data-label className="block truncate text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{r.name}</span>
                      <span className="block min-h-[1.3em] truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{r.sub}</span>
                    </>
                  ) : (
                    <span data-label className="line-clamp-2 text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{r.name}</span>
                  )}
                </span>
                {/* On a phone the figures sit on their own row under the heads; a spacer keeps them in their columns. */}
                <span aria-hidden className="md:hidden" />
                <span className="text-right" data-col="a">
                  {r.a != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.a}</Fig> : DASH}
                </span>
                <span className="text-right" data-col="b">
                  {r.b != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.b}</Fig> : DASH}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
