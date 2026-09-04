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
 * Structural contract, relied on by tests/spine/setup_tiers_expand.test.ts:
 * rows are the direct children of [data-idea="I5"]; a row with a panel has a
 * <button aria-expanded>; the open panel is the row's second child.
 */
import * as React from "react";
import { Fig, usd } from "@/components/spine/kit";
import { COPY } from "./copy";

export type TierRow = { tier: string; local_term?: string; cost_usd?: number; days?: number; complexity_1_5?: number };
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

function Dots({ n }: { n: number }) {
  return (
    <span aria-label={`paperwork ${n} of 5`} role="img" className="flex items-center justify-end gap-1">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: i <= n ? "var(--terra)" : "var(--c-soft2)" }} />)}
    </span>
  );
}

export function TiersTable({ rows, howTo }: { rows: TierRow[]; howTo?: { href: string; label: string } | null }) {
  const [open, setOpen] = React.useState<number | null>(null);
  if (rows.length === 0) return null;
  const anyDots = rows.some((t) => isNum(t.complexity_1_5));
  return (
    <div data-archetype="tiers-table">
      {/* THE HEADS, ONCE, AT EVERY WIDTH. On a phone the name column has no
          head (the name is its own head) and the three readings' heads sit
          right-aligned over their column. */}
      <div className={`${GRID} items-end border-b border-[var(--c-border)] pb-2`}>
        <span aria-hidden />
        <span className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.fee}</span>
        <span className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.time}</span>
        <span className={`text-right ${HEAD}`} style={{ fontSize: "var(--t-mark)" }}>{COPY.tiers.heads.paperwork}</span>
      </div>
      <div data-idea="I5" className="divide-y divide-[var(--c-border)]">
        {rows.map((t, i) => {
          const isOpen = open === i;
          const explainer = COPY.tiers.explainers[t.tier as keyof typeof COPY.tiers.explainers];
          const paperwork = isNum(t.complexity_1_5) ? COPY.tiers.paperwork[t.complexity_1_5 as 1 | 2 | 3 | 4 | 5] : undefined;
          const hasPanel = Boolean(explainer || paperwork);
          const localTerm = t.local_term && t.local_term !== t.tier ? t.local_term : null;
          /* ONE GRID FOR THE ROW at every width: the name block spans the
             readings' columns on a phone and takes its own column from md.
             The name block reserves two lines so every row is one height. */
          const line = (
            <span className={`${GRID} w-full items-center gap-y-1`} data-tier-row={i}>
              {/* THE NAME BLOCK spans the row on a phone and takes the first
                  column from md; it reserves two lines so every row is one
                  height; the chevron rides at its right edge. */}
              <span className="col-span-4 flex min-w-0 items-center gap-2 md:col-span-1">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[length:var(--t-lead)] font-medium leading-tight text-[var(--c-ink)]">{t.tier}</span>
                  <span className="block min-h-[1.3em] truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{localTerm ?? " "}</span>
                </span>
                <span aria-hidden className={`shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform md:hidden ${isOpen ? "rotate-90" : ""}`}>{hasPanel ? "›" : ""}</span>
              </span>
              {/* On a phone the readings sit on their own row under the heads; a spacer keeps them in their columns. */}
              <span aria-hidden className="md:hidden" />
              <span className="text-right">
                {t.cost_usd === 0 ? <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{COPY.free}</span> : isNum(t.cost_usd) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{usd(t.cost_usd)}</Fig> : <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>}
              </span>
              <span className="text-right">
                {isNum(t.days) ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.days} {t.days === 1 ? "day" : "days"}</Fig> : <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>}
              </span>
              <span className="flex items-center justify-end gap-2">
                {isNum(t.complexity_1_5) ? <Dots n={t.complexity_1_5} /> : null}
                <span aria-hidden className={`hidden text-[length:var(--t-micro)] text-[var(--c-muted)] transition-transform md:inline ${isOpen ? "rotate-90" : ""}`}>{hasPanel ? "›" : ""}</span>
              </span>
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
      {anyDots ? <div className="mt-2 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.tiers.legend}</div> : null}
      {howTo ? (
        <div className="mt-2.5 text-right">
          <a href={howTo.href} className="text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{howTo.label} <span aria-hidden>&#8594;</span></a>
        </div>
      ) : null}
    </div>
  );
}
