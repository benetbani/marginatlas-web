/**
 * IncomeBreakdown , THE INCOME-BREAKDOWN ARCHETYPE (task 11, 2026-09-10). His
 * most literal instruction: "the income breakdown is used exactly for
 * income breakdown with the main figure being the net income percentage."
 * Ported from mechanic B6 of design/references/founder-2026-09-10.md: a
 * headline percentage, one horizontal bar split into segments beneath it, a
 * legend naming each segment and its share underneath that. It replaces the
 * section he called totally broken ("for the net profit margin, this
 * section that you have created, it's totally broken").
 *
 * WHAT PORTED AND WHAT DID NOT. His reference is blue, cyan and amber; this
 * palette is terracotta and warm neutrals with a three-figure accent
 * budget, so colour did not port. Segments are told apart by TONE (a grey
 * ramp by magnitude, kit.tsx's GREY_RAMP, the same one StackBar already
 * uses for exactly this reason) and HATCH (a distinct repeating line
 * pattern per segment), never by hue. His small delta pill did not port
 * either: a delta needs a real prior period to be honest about, and every
 * figure this card prints is a modelled, unchanging baseline
 * (income_rows.ts), so a delta pill here would be a fabricated number
 * wearing a real one's costume.
 *
 * THE ACCENT IS OFF THIS CARD (his ruling, 2026-09-08, on this exact
 * section: ship it "labelled sample, and quiet"). Every segment, including
 * net, is neutral: net stands out by being the darkest tone, flat with no
 * hatch, at the focal rung and pinned last in the bar, never by colour. It
 * is not one of the page's three loud moments and it wears the sample mark
 * unconditionally, because every figure it prints is modelled
 * (income_rows.ts's own doc comment says why).
 *
 * THIS CARD COUNTS AS ONE OF THE PAGE'S THREE BAR-FAMILY DRAWINGS. Say so
 * again at the call site that adds it to a real page, so the count is never
 * taken from this file alone.
 *
 * THE LAW INSIDE IT:
 *  - The bar is full width and one bar: cost segments in descending share
 *    (the builder's order), then net, always last, regardless of rank,
 *    which is the same "kept pinned last" idiom kit.tsx's StackBar already
 *    uses for the same reason.
 *  - Every drawn segment carries `data-row` / `data-seg-key` /
 *    `data-seg-share`. `data-row` feeds the shared rows-cut mechanism
 *    (`data-expect-rows` on the track), which proves the drawn count
 *    matches the declared count at every width; the harness separately sums
 *    every `data-seg-share` to prove the segments plus net reach a hundred.
 *  - The legend names every drawn segment and no more (`data-legend-key`),
 *    each swatch styled identically to its bar segment so the two can never
 *    disagree.
 *  - Displayed percentages are reconciled to sum to exactly 100 (a
 *    largest-remainder rounding, since independently-rounded shares almost
 *    never do on their own); the underlying `data-seg-share` values stay
 *    the raw, unrounded figures the builder computed, which is what the
 *    harness measures for the honesty check.
 *  - Fewer than two segments and the section self-omits (the builder's own
 *    honest minimum; this component repeats the guard rather than trusting
 *    every future caller to honour it).
 */
import * as React from "react";
import { Box, Fig, GREY_RAMP, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { IncomeSegment } from "@/lib/spine/income_rows";

export type IncomeBreakdownProps = {
  id: string;
  kicker: string;
  netPct: number;
  segments: IncomeSegment[];
  basis: string;
};

const NET_KEY = "net";

/** One repeating-line pattern per drawn cost segment, cycling before it
 *  ever needs to (this card draws at most six: four named lines, the
 *  smaller-costs bucket, and the rare named residual). Every stripe is
 *  `--c-card`, the card's own white, laid over the segment's flat tone: no
 *  new colour enters the file, and TONE still carries magnitude while HATCH
 *  carries identity, so two segments sharing a tone still read as two
 *  things without a colour key. Net, drawn separately below, takes neither
 *  the ramp nor a hatch, which is what makes "flat and dark" its own
 *  unambiguous signal rather than a seventh pattern to keep straight. */
const HATCH_PERIOD_PX = [6, 6, 5, 5, 4, 8];
/* EXPORTED for RankedBars.tsx (task 12, 2026-09-10): its non-leader bars
 * take the plain 45-degree entry, HATCH[0], as the site's one hatch system
 * rather than a second one drawn independently. Nothing here changes for
 * this card , the export is additive. */
export const HATCH: string[] = [
  `repeating-linear-gradient(45deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[0]}px)`,
  `repeating-linear-gradient(-45deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[1]}px)`,
  `repeating-linear-gradient(90deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[2]}px)`,
  `repeating-linear-gradient(0deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[3]}px)`,
  `repeating-linear-gradient(45deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[4]}px), repeating-linear-gradient(-45deg, var(--c-card) 0, var(--c-card) 1px, transparent 1px, transparent ${HATCH_PERIOD_PX[4]}px)`,
  `repeating-linear-gradient(45deg, var(--c-card) 0, var(--c-card) 2px, transparent 2px, transparent ${HATCH_PERIOD_PX[5]}px)`,
];

/** Independently-rounded percentages almost never sum to a clean 100; the
 *  founder's hardest rule on this task is that a breakdown which does not
 *  add up is worse than none. Floor every share, then hand the leftover
 *  whole points to the largest fractional remainders first (the largest-
 *  remainder method): the DISPLAYED digits always sum to exactly 100,
 *  without touching the underlying shares the bar and the harness both
 *  measure. */
function roundToHundred(values: Array<{ key: string; value: number }>): Record<string, number> {
  const floored = values.map((v) => ({ key: v.key, floor: Math.floor(v.value), rem: v.value - Math.floor(v.value) }));
  const deficit = Math.max(0, 100 - floored.reduce((a, f) => a + f.floor, 0));
  const bump = new Set([...floored].sort((a, b) => b.rem - a.rem).slice(0, deficit).map((f) => f.key));
  const out: Record<string, number> = {};
  for (const f of floored) out[f.key] = f.floor + (bump.has(f.key) ? 1 : 0);
  return out;
}

export function IncomeBreakdown({ id, kicker, netPct, segments, basis }: IncomeBreakdownProps) {
  const live = segments.filter((s) => Number.isFinite(s.share) && s.share > 0);
  if (live.length < 2 || !Number.isFinite(netPct)) return null;

  const rounded = roundToHundred([...live.map((s) => ({ key: s.key, value: s.share })), { key: NET_KEY, value: netPct }]);
  const ariaLabel = `Net income ${rounded[NET_KEY]} percent. ${live.map((s) => `${s.label} ${rounded[s.key]} percent`).join(", ")}.`;

  return (
    <Box id={id} data-archetype="income-breakdown">
      {/* THE SAMPLE MARK IS UNCONDITIONAL (his ruling, 2026-09-08): every
          figure this card ever prints is the same modelled split for every
          country (income_rows.ts explains why), so there is no "measured"
          variant of this card for the tag to distinguish it from. */}
      <Rail kicker={kicker} sample />
      <div data-answer="1">
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.incomeBreakdown.netLabel}</div>
        <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{rounded[NET_KEY]}%</Fig>
      </div>
      <p className="mt-2 max-w-[46ch] text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
      {/* THE BAR: one track, full width, cost segments in the builder's
          descending order, net pinned last. `data-expect-rows` on the track
          plus `data-row` on every child is the site's existing rows-cut
          mechanism (RankedBars, PayBars already use it); it is reused here
          rather than reinvented, and it already runs at every width. */}
      <div
        className="mt-3.5 flex h-8 overflow-hidden rounded-lg border border-[var(--c-border)]"
        data-expect-rows={live.length + 1}
        role="img"
        aria-label={ariaLabel}
      >
        {live.map((s, i) => (
          <div
            key={s.key}
            data-row={s.key}
            data-seg-key={s.key}
            data-seg-share={String(s.share)}
            className="h-full border-r border-[var(--c-card)]"
            style={{ width: `${s.share}%`, background: GREY_RAMP[Math.min(i, GREY_RAMP.length - 1)], backgroundImage: HATCH[i % HATCH.length] }}
          />
        ))}
        <div
          data-row={NET_KEY}
          data-seg-key={NET_KEY}
          data-seg-share={String(netPct)}
          className="h-full"
          style={{ width: `${netPct}%`, background: "var(--c-ink)" }}
        />
      </div>
      {/* THE LEGEND: every drawn segment, no more, each swatch painted with
          the exact tone+hatch its bar segment carries so the two can never
          visually disagree. */}
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {live.map((s, i) => (
          <span key={s.key} data-legend-key={s.key} className="inline-flex min-w-0 items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm border border-[var(--c-border)]" style={{ background: GREY_RAMP[Math.min(i, GREY_RAMP.length - 1)], backgroundImage: HATCH[i % HATCH.length] }} />
            <span data-label className="truncate">{s.label}</span>
            <Fig className="ml-auto shrink-0 text-[var(--c-ink)]">{rounded[s.key]}%</Fig>
          </span>
        ))}
        <span data-legend-key={NET_KEY} className="inline-flex min-w-0 items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm border border-[var(--c-border)]" style={{ background: "var(--c-ink)" }} />
          <span data-label className="truncate">{COPY.incomeBreakdown.netLabel}</span>
          <Fig className="ml-auto shrink-0 text-[var(--c-ink)]">{rounded[NET_KEY]}%</Fig>
        </span>
      </div>
    </Box>
  );
}
