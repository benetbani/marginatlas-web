/**
 * ShareBar, HIS GOLD STANDARD'S B29, the stacked share bar over its list
 * (design/references/founder-2026-09-20-gold-standard-sections.md; rules/
 * FOUNDER-VERDICTS.md 2026-09-20): one whole as one bar split into its named
 * parts, then the parts as rows with their shares, each row a pale panel with
 * its swatch. Built 2026-09-20 late evening for the trade's market bento (the
 * dayparts: when the week's takings come in) on his word after the push: the
 * pages hold more sections, from what the files hold, and a share of a whole
 * is drawn. The first question, PART 9 clause 57: two to four parts of a
 * whole that lie along a line (the day, the week) are best shown as one bar
 * cut into lengths, the eye reading "the weekend is the biggest piece" before
 * any number; the donut is the same family's form for parts with no order.
 *
 * THE LAW, inside the component:
 *  - THE BAR: one track of the card's width, the parts as lengths in order,
 *    the largest in the accent, the second in the accent's tint, the rest in
 *    ink-greys (the donut's palette), a hairline gap between parts; never a
 *    second hue (B33). The parts are scaled to their own sum, so a whole that
 *    sums to 99 or 101 still fills the bar and the figures say what they say.
 *  - THE ROWS, one per part in the bar's order: a pale panel (the inset panel
 *    of B26) holding the swatch, the name at the body rung and the share in a
 *    pill at the row's end; no sentence.
 *  - `data-archetype="share-bar"`, `data-visual="1"`, `data-wedges` the count
 *    (never `data-parts`, clause 58's name; every part is in view),
 *    `data-row` on each row and `data-expect-rows` on the list, so ROWS CUT
 *    proves every part draws. The largest part's share is not a focal: the
 *    card that holds the bar names its own.
 *
 * Gated by the archetype harness (stories `share-bar`: the exemplar's three
 * parts, a four-part whole, a two-part whole) and the page laws.
 *
 * THE LED FORM (2026-09-25, his word on the treemap that drew a household's
 * budget: "What households spend on could be a horizontal bar rather than that
 * monstrosity"). A whole of up to eight parts, where the card's own figure is
 * worked from two of them (a household's food money, split between groceries
 * and eating out): `lead` names those two, and they stand first along the bar
 * and alone carry the colour, the first the accent and the second its tint;
 * every other part is one neutral, the remainder (`residualKey`, "everything
 * else") the palest and last. The bar is thicker (`tall`), the rows stand two
 * a line from 560px of card, and each share is printed once, in its row.
 */
import * as React from "react";
import { partTones } from "@/components/spine/charts/part_tones";

export type SharePart = { key: string; name: string; share: number };

/* The plain form's tones are the shared ramp by rank (charts/part_tones.ts, 2026-09-26); four parts at most, so no tone needs its
   opacity here. */

/** `fill` (2026-09-25): the rows take the height the level lends the card (a taller neighbour), shared evenly, instead of a
 *  blank under the last row; a row never falls under its content. */
/** `bracket` (2026-09-26, the goal's M6 guide marks): in the led form, a bracket over the lead pair named in one word, where the
 *  card's figure is worked from those two parts (a household's food money: eating out and groceries), so the reader sees which
 *  parts make the figure before reading a number. */
export function ShareBar({ parts, unit = "%", lead, residualKey, tall = false, fill = false, bracket }: { parts: SharePart[]; unit?: string; lead?: string[]; residualKey?: string; tall?: boolean; fill?: boolean; bracket?: string }) {
  const all = parts.filter((p) => p && p.name && Number.isFinite(p.share) && p.share > 0);
  const leads = (lead ?? []).map((k) => all.find((p) => p.key === k)).filter((p): p is SharePart => !!p);
  const led = leads.length >= 2;
  /* Four parts at most, unless the card names its lead pair: then eight, the lead first, the rest by size, the remainder last. */
  const live = led
    ? [...leads, ...all.filter((p) => !leads.includes(p)).sort((a, b) => (a.key === residualKey ? 1 : b.key === residualKey ? -1 : b.share - a.share))].slice(0, 8)
    : all.slice(0, 4);
  if (live.length < 2) return null;
  const total = live.reduce((s, p) => s + p.share, 0);
  const leader = live.reduce((a, b) => (b.share > a.share ? b : a), live[0]);
  const colourOf = (p: SharePart) => {
    if (led) return p.key === leads[0].key ? "var(--terra)" : p.key === leads[1].key ? "var(--terra-border)" : p.key === residualKey ? "var(--c-soft2)" : "var(--c-line-strong)";
    /* the largest in the accent, the second largest in the tint, the rest ink-greys, whatever their order along the bar */
    const rank = [...live].sort((a, b) => b.share - a.share).findIndex((q) => q.key === p.key);
    return partTones(live.length)[rank].c;
  };
  return (
    <div className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
    <div data-archetype="share-bar" data-visual="1" data-form={led ? "led" : "plain"} data-wedges={String(live.length)} data-leader={leader.key} className={fill ? "flex flex-1 flex-col" : undefined}>
      {led && bracket ? (
        <div aria-hidden data-bracket className="relative mb-1 h-6">
          <span className="absolute bottom-0 h-2 rounded-t-[2px] border-x-2 border-t-2 border-[var(--c-ink2)]" style={{ left: 0, width: `${((leads[0].share + leads[1].share) / total) * 100}%` }} />
          <span className="absolute bottom-3 whitespace-nowrap text-[length:var(--t-micro)] font-semibold text-[var(--c-ink2)]" style={{ left: `${((leads[0].share + leads[1].share) / total) * 50}%`, transform: "translateX(-50%)" }}>{bracket}</span>
        </div>
      ) : null}
      <div className={`flex w-full gap-0.5 overflow-hidden ${tall ? "h-9 rounded-lg" : "h-3 rounded-full"}`} aria-hidden="true">
        {live.map((p) => (
          <span key={p.key} data-wedge={p.key} className={`block h-full min-w-[3px] ${tall ? "first:rounded-l-lg last:rounded-r-lg" : "first:rounded-l-full last:rounded-r-full"}`} style={{ width: `${((p.share / total) * 100).toFixed(2)}%`, background: colourOf(p) }} />
        ))}
      </div>
      <div className={`mt-3 grid gap-2 ${led ? "[@container(min-width:560px)]:grid-cols-2" : ""} ${fill ? "flex-1 auto-rows-fr" : ""}`} data-expect-rows={live.length}>
        {live.map((p) => (
          /* In the led form the remainder's row spans the line when the rows are two a line and odd in number, so no row stands alone. */
          <div key={p.key} data-row={p.key} className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-[8px] bg-[var(--c-soft)] px-3 py-2 ${led && p.key === residualKey && live.length % 2 === 1 ? "[@container(min-width:560px)]:col-span-2" : ""}`}>
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-[3px] border border-[var(--c-border)]" style={{ background: colourOf(p) }} />
            <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{p.name}</span>
            <span className="rounded-md border border-[var(--c-border)] bg-[var(--c-card)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]">{Math.round(p.share)}{unit}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
