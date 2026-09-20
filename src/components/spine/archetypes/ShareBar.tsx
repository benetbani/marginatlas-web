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
 */
import * as React from "react";

export type SharePart = { key: string; name: string; share: number };

const PART_COLOURS = ["var(--terra)", "var(--terra-border)", "var(--c-ink2)", "var(--c-muted)"];

export function ShareBar({ parts, unit = "%" }: { parts: SharePart[]; unit?: string }) {
  const live = parts.filter((p) => p && p.name && Number.isFinite(p.share) && p.share > 0).slice(0, 4);
  if (live.length < 2) return null;
  const total = live.reduce((s, p) => s + p.share, 0);
  const leader = live.reduce((a, b) => (b.share > a.share ? b : a), live[0]);
  const colourOf = (p: SharePart) => {
    /* the largest in the accent, the second largest in the tint, the rest ink-greys, whatever their order along the bar */
    const rank = [...live].sort((a, b) => b.share - a.share).findIndex((q) => q.key === p.key);
    return PART_COLOURS[Math.min(rank, PART_COLOURS.length - 1)];
  };
  return (
    <div data-archetype="share-bar" data-visual="1" data-wedges={String(live.length)} data-leader={leader.key}>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {live.map((p) => (
          <span key={p.key} data-wedge={p.key} className="block h-full min-w-[3px] first:rounded-l-full last:rounded-r-full" style={{ width: `${((p.share / total) * 100).toFixed(2)}%`, background: colourOf(p) }} />
        ))}
      </div>
      <div className="mt-3 grid gap-1.5" data-expect-rows={live.length}>
        {live.map((p) => (
          <div key={p.key} data-row={p.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-[8px] bg-[var(--c-soft)] px-3 py-2">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-[3px]" style={{ background: colourOf(p) }} />
            <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{p.name}</span>
            <span className="rounded-md border border-[var(--c-border)] bg-[var(--c-card)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]">{Math.round(p.share)}{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
