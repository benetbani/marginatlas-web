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
import type { AtlasIconId } from "@/components/brand/icons";
import { COPY } from "@/lib/spine/copy";
import type { IncomeSegment } from "@/lib/spine/income_rows";

/**
 * THE TRADE PAGE'S SEAT (MODEL.md 8.6 `05 split`; plan step 33's third
 * dispatch, 2026-09-18) added four optional props and changed nothing for
 * the country stories, which pass none of them:
 *  - `icon`, the opener's tile (PART 7: one opener style on the whole page).
 *  - `netLabel`, the words over the focal: the trade page passes the same
 *    words `00 take`'s companion wears, because they are one figure from one
 *    builder (R7, M20); the default is this file's own "Net income".
 *  - `withheld`, THE WITHHELD STATE: the net still stands at 30 (it is the
 *    one builder's figure and prints on `00` regardless) and the stated line
 *    stands at 16 where the bar and the legend would, so the card's height
 *    does not collapse and nothing is scaled to fit. The residual law's
 *    refusal (income_rows.ts: the lines and the net over a hundred) is the
 *    only caller today. No segments are drawn and the legend is empty.
 *  - `foot`, one line after the legend, and `detail`, THE PLUS at the foot
 *    (DetailPanel, closed on arrival, weightless in the hierarchy): the
 *    trade page's fixed and variable costs, the plus's one honest seat.
 */
export type IncomeBreakdownProps = {
  id: string;
  kicker: string;
  /** HIS POP-UP (2026-09-22, QUEUE ui:the-gloss): what the opener's term means, one sentence, at the rail. */
  gloss?: string;
  netPct: number;
  segments: IncomeSegment[];
  basis: string;
  icon?: AtlasIconId;
  netLabel?: string;
  withheld?: string | null;
  foot?: string | null;
  detail?: React.ReactNode;
  /** THE WITHHELD STATE'S SECOND DRAWING (2026-09-24, the goal's B8): the
   *  costs split among themselves, every $100 spent, with no net segment,
   *  under its own basis line. Drawn only when `withheld` is set and two or
   *  more segments come; its marks are `data-mix-*`, never `data-seg-*`, so
   *  "a withheld breakdown draws no segment of sales" still holds and the
   *  harness reads the two drawings apart. */
  mix?: { basis: string; segments: IncomeSegment[] } | null;
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
 *  remainder method): the DISPLAYED digits always sum to exactly the total
 *  asked for, without touching the underlying shares the bar and the
 *  harness both measure.
 *
 *  THE NET IS NOT IN THIS SET ANY MORE (plan step 34's second dispatch,
 *  2026-09-18). It was, and the rounding could land the spare point on a
 *  cost line and leave the net a point under its own printed form: the
 *  restaurants shard's ladder net is 6.5, the one net builder prints it as
 *  7% on the industry hero (trade_net.ts, `netText`, a plain round), and
 *  this card printed 6% in its focal and its legend, one figure at two
 *  values on one page, the exact fault R7 exists to stop (MODEL.md PART 9
 *  clause 42); measured on the 230 drawn industry pages, 30 disagreed by a
 *  point. The trade page's copy gate compared the builders' strings and
 *  never the card's digits, so it passed. Now the net prints as the one
 *  builder does (`Math.round`, the same arithmetic as `netText`) and the
 *  COST shares reconcile to what is left of the hundred, so the net a
 *  reader meets on the opening card and on this one is one figure and the
 *  digits still sum to 100. A surplus (integer shares whose sum runs a
 *  point past the target, possible only inside the residual law's
 *  half-point tolerance) comes off the largest share, the smallest relative
 *  distortion; no shard reaches it today, counted. */
function roundToTotal(values: Array<{ key: string; value: number }>, total: number): Record<string, number> {
  const floored = values.map((v) => ({ key: v.key, floor: Math.floor(v.value), rem: v.value - Math.floor(v.value) }));
  const sum = floored.reduce((a, f) => a + f.floor, 0);
  const out: Record<string, number> = {};
  if (sum <= total) {
    const bump = new Set([...floored].sort((a, b) => b.rem - a.rem).slice(0, total - sum).map((f) => f.key));
    for (const f of floored) out[f.key] = f.floor + (bump.has(f.key) ? 1 : 0);
  } else {
    const trim = new Set([...floored].sort((a, b) => b.floor - a.floor).slice(0, sum - total).map((f) => f.key));
    for (const f of floored) out[f.key] = f.floor - (trim.has(f.key) ? 1 : 0);
  }
  return out;
}

export function IncomeBreakdown({ id, kicker, gloss, netPct, segments, basis, icon, netLabel = COPY.incomeBreakdown.netLabel, withheld = null, foot = null, detail = null, mix = null }: IncomeBreakdownProps) {
  const live = withheld ? [] : segments.filter((s) => Number.isFinite(s.share) && s.share > 0);
  if (!Number.isFinite(netPct)) return null;
  if (!withheld && live.length < 2) return null;

  /* The net's printed form is the one builder's (a plain round); the cost shares take what is left of the hundred. */
  const netShown = Math.round(netPct);
  const rounded: Record<string, number> = { ...roundToTotal(live.map((s) => ({ key: s.key, value: s.share })), 100 - netShown), [NET_KEY]: netShown };
  const ariaLabel = `${netLabel} ${netShown} percent. ${withheld ? withheld : live.map((s) => `${s.label} ${rounded[s.key]} percent`).join(", ") + "."}`;
  /* The withheld state's mix: its shares are of the costs, so they round to a hundred of their own. */
  const mixLive = withheld && mix ? mix.segments.filter((s) => Number.isFinite(s.share) && s.share > 0) : [];
  const mixRounded: Record<string, number> = mixLive.length ? roundToTotal(mixLive.map((s) => ({ key: s.key, value: s.share })), 100) : {};

  return (
    <Box id={id} data-archetype="income-breakdown" data-withheld={withheld ? "1" : undefined} className="[container-type:inline-size]">
      {/* THE SAMPLE MARK IS UNCONDITIONAL (his ruling, 2026-09-08): every
          figure this card ever prints is the same modelled split for every
          country (income_rows.ts explains why), so there is no "measured"
          variant of this card for the tag to distinguish it from. */}
      <Rail icon={icon} kicker={kicker} gloss={gloss} sample />
      {withheld ? (
        /* THE WITHHELD HEAD TWO ABREAST FROM 640 OF THE CARD (the goal's B8,
           2026-09-24): stacked at 768 the card is 680 inside, and the net and
           its basis in the left half left 312 by 120 of nothing beside them
           (the page filter, London barbershops and chiropractic); the stated
           line now stands in that half. The 1280 seat is 584 inside and keeps
           the column, where the band's height is set by the team beside it. */
        <div className="[@container(min-width:560px)]:grid [@container(min-width:560px)]:grid-cols-2 [@container(min-width:560px)]:items-start [@container(min-width:560px)]:gap-x-8">
          <div>
            <div data-answer="1">
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{netLabel}</div>
              <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{netShown}%</Fig>
            </div>
            {basis ? <p className="mt-2 max-w-[46ch] text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
          </div>
          {/* THE WITHHELD STATE: the stated line at the lead rung where the
              bar would stand (the cost-to-open card's own idiom), so the seat
              keeps its height and the reader is told why there is no bar. */}
          <p data-withheld-line={id} className="mt-4 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)] [@container(min-width:560px)]:mt-0">{withheld}</p>
        </div>
      ) : null}
      {withheld ? (
        <>
          {mixLive.length >= 2 ? (
            <>
              {/* THE COSTS ON THEIR OWN BASE (the goal's B8): the same bar and
                  legend as the drawn state, the same tones and hatches in the
                  same order, with no net in it and a hundred of cost as its
                  whole; its basis line says so before the bar is read. */}
              {mix!.basis ? <p data-mix-basis className="mt-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">{mix!.basis}</p> : null}
              <div className="mt-2 flex h-8 overflow-hidden rounded-lg border border-[var(--c-border)]" data-expect-rows={mixLive.length} role="img" aria-label={`${mix!.basis} ${mixLive.map((s) => `${s.label} ${mixRounded[s.key]} percent`).join(", ")}.`}>
                {mixLive.map((s, i) => (
                  <div key={s.key} data-row={s.key} data-mix-key={s.key} data-mix-share={String(s.share)} className="h-full border-r border-[var(--c-card)] last:border-r-0" style={{ width: `${s.share}%`, background: GREY_RAMP[Math.min(i, GREY_RAMP.length - 1)], backgroundImage: HATCH[i % HATCH.length] }} />
                ))}
              </div>
              <div className="mt-3 [container-type:inline-size]">
                {/* THREE COLUMNS FROM 560 (the goal's B8): a five-line mix stood three rows tall in two, one row more than the short team tables beside it could meet at 1280, and left its last row half empty at 768. */}
                <div className="grid grid-cols-1 gap-x-4 divide-y divide-[var(--c-border)] [@container(min-width:360px)]:grid-cols-2 [@container(min-width:360px)]:gap-y-1.5 [@container(min-width:360px)]:divide-y-0 [@container(min-width:560px)]:grid-cols-3">
                  {mixLive.map((s, i) => (
                    <span key={s.key} data-mix-legend-key={s.key} className="inline-flex min-w-0 items-center gap-2 py-1 text-[length:var(--t-micro)] text-[var(--c-ink2)] [@container(min-width:360px)]:py-0">
                      <span aria-hidden className="h-3 w-3 shrink-0 rounded-sm border border-[var(--c-border)]" style={{ background: GREY_RAMP[Math.min(i, GREY_RAMP.length - 1)], backgroundImage: HATCH[i % HATCH.length] }} />
                      <span data-label className="truncate">{s.label}</span>
                      <Fig className="ml-auto shrink-0 text-[var(--c-ink)]">{mixRounded[s.key]}%</Fig>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {foot ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p> : null}
          {detail}
        </>
      ) : (
        <>
          {/* THE DRAWN CARD TWO ABREAST FROM 640 OF IT (the goal's B12, first
              row, 2026-09-24): the trade page stacks this band until lg, so at
              768 the card is 680 inside, and the two-column legend put each
              right-hand figure about 200 from a short name and, on an odd count,
              left its last cell empty over the foot: the page filter's `#split`
              hole on 78 of the 138 London trades. From 640 the net, its basis
              and the bar stand in the left half and the legend in the right, one
              column, so no figure stands far from its name and no cell is empty.
              The foot and the plus join the left half under the bar (the
              legend spans both rows), because a seven-line legend stands about
              50 taller than the net and its bar and the foot below both halves
              left that as air under the bar. The 1280 and 1024 seats are about
              580 inside and keep the column; the phone keeps it too. */}
          <div className="[@container(min-width:640px)]:grid [@container(min-width:640px)]:grid-cols-2 [@container(min-width:640px)]:grid-rows-[auto_1fr] [@container(min-width:640px)]:items-start [@container(min-width:640px)]:gap-x-8">
          <div className="[@container(min-width:640px)]:col-start-1 [@container(min-width:640px)]:row-start-1">
          <div data-answer="1">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{netLabel}</div>
            <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{netShown}%</Fig>
          </div>
          {basis ? <p className="mt-2 max-w-[46ch] text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
          {/* THE BAR: one track, full width, cost segments in the builder's
              descending order, net pinned last. `data-expect-rows` on the track
              plus `data-row` on every child is the site's existing rows-cut
              mechanism (RankedBars, PayBars already use it); it is reused here
              rather than reinvented, and it already runs at every width. */}
          <div
            className="mt-4 flex h-8 overflow-hidden rounded-lg border border-[var(--c-border)]"
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
          </div>
          {/* THE LEGEND: every drawn segment, no more, each swatch painted with
              the exact tone+hatch its bar segment carries so the two can never
              visually disagree. TWO COLUMNS BY THE CARD'S OWN WIDTH, ONE UNDER
              360px OF IT (plan step 33's third dispatch, 2026-09-18, the
              NoteList's container-query idiom): at a phone's 343 the fixed
              two columns clipped three of the trade page's labels ("Utilities
              and supplies" at 114px in a 96px cell, measured), and a name cut
              on a phone is clause 31's fault; a tablet's 344 half gets one
              column the same way, which is also why the trade page stacks the
              band until lg. */}
          <div className="mt-3 [container-type:inline-size] [@container(min-width:640px)]:col-start-2 [@container(min-width:640px)]:row-span-2 [@container(min-width:640px)]:row-start-1 [@container(min-width:640px)]:mt-0">
          {/* One column is the phone row form (PART 5: below 420 the row is
              [1fr auto] and the gap is the card's own inner width), so the
              rows take hairlines between them the way every phone row does,
              which is also what keeps the figure column from reading as a
              blank (the page filter's hole is 145 by 174 without them,
              measured). */}
          <div className="grid grid-cols-1 gap-x-4 divide-y divide-[var(--c-border)] [@container(min-width:360px)]:grid-cols-2 [@container(min-width:360px)]:gap-y-1.5 [@container(min-width:360px)]:divide-y-0">
            {live.map((s, i) => (
              <span key={s.key} data-legend-key={s.key} className="inline-flex min-w-0 items-center gap-2 py-1 text-[length:var(--t-micro)] text-[var(--c-ink2)] [@container(min-width:360px)]:py-0">
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-sm border border-[var(--c-border)]" style={{ background: GREY_RAMP[Math.min(i, GREY_RAMP.length - 1)], backgroundImage: HATCH[i % HATCH.length] }} />
                <span data-label className="truncate">{s.label}</span>
                <Fig className="ml-auto shrink-0 text-[var(--c-ink)]">{rounded[s.key]}%</Fig>
              </span>
            ))}
            <span data-legend-key={NET_KEY} className="inline-flex min-w-0 items-center gap-2 py-1 text-[length:var(--t-micro)] text-[var(--c-ink2)] [@container(min-width:360px)]:py-0">
              <span aria-hidden className="h-3 w-3 shrink-0 rounded-sm border border-[var(--c-border)]" style={{ background: "var(--c-ink)" }} />
              <span data-label className="truncate">{netLabel}</span>
              <Fig className="ml-auto shrink-0 text-[var(--c-ink)]">{rounded[NET_KEY]}%</Fig>
            </span>
          </div>
          </div>
          {foot || detail ? (
            <div className="[@container(min-width:640px)]:col-start-1 [@container(min-width:640px)]:row-start-2">
              {foot ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p> : null}
              {detail}
            </div>
          ) : null}
          </div>
        </>
      )}
    </Box>
  );
}
