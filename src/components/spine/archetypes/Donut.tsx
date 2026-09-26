/**
 * Donut, HIS B9 AND THE GOLD STANDARD'S B28 (rules/FOUNDER-VERDICTS.md 2026-09-10
 * and 2026-09-20; design/references/founder-2026-09-20-gold-standard-sections.md):
 * two to five named parts of one whole, drawn as a ring, each part's share
 * written beside its name in a pill, the leader's share the card's figure.
 * The first question, PART 9 clause 57: parts that sum to a hundred are best
 * shown as the whole they make, so the eye reads the leader's size against
 * the rest before it reads any number. Its family is the shape-and-area
 * family (FORM-CATALOG), one per page (his cap).
 *
 * THE LAW, inside the component:
 *  - THE RING: an SVG circle of stroked arcs, the leader wedge in the accent,
 *    the second in the accent's tint, the rest in ink-greys, never a second
 *    hue (B33). A hairline gap between wedges. The leader's share sits in
 *    the ring's centre at the focal rung in ink, the site's one 30 on the
 *    card, and NOTHING ELSE IN THE CENTRE: the leader's name is its first
 *    row, under the accent swatch (a first render put the name under the
 *    figure inside the ring, where "Dine-in and on-premise" broke at its
 *    hyphen across two lines in a 144px circle; the senior review of
 *    2026-09-20). The ring is never larger than 160px, so it stands beside
 *    its rows at every card width and under them at 375.
 *  - THE ROWS, one per part in the ring's order: a swatch of the wedge's
 *    colour, the name at the body rung, the share in a pill at the row's
 *    end. Hairlines between rows. No sentence.
 *  - `data-archetype="donut"`, `data-visual="1"`, `data-wedges` the count
 *    (never `data-parts`: that name is clause 58's declaration of hidden
 *    parts, and the page laws read it as PARTS NOT REVEALED; the donut's
 *    parts are all in view); `data-row` on every row and `data-expect-rows`
 *    on the list, so ROWS CUT proves every part draws.
 *  - NO ACCENT TEXT: the wedge is colour on a drawing, so the accent budget
 *    does not count it, and the leader's figure is ink.
 *
 * Gated by the archetype harness (stories `donut`: the exemplar's three
 * parts, a five-part shard, a two-part shard) and the page laws.
 */
import * as React from "react";
import { partTones } from "@/components/spine/charts/part_tones";

export type DonutPart = { key: string; name: string; share: number };

/* The parts' tones are the shared ramp (charts/part_tones.ts, 2026-09-26): ink2 and muted, this ring's third and fourth, read as one grey. */

export function Donut({ parts, unit = "%" }: { parts: DonutPart[]; unit?: string }) {
  const live = parts.filter((p) => p && p.name && Number.isFinite(p.share) && p.share > 0).slice(0, 5);
  if (live.length < 2) return null;
  const total = live.reduce((s, p) => s + p.share, 0);
  const tones = partTones(live.length);
  const r = 44, c = 2 * Math.PI * r;
  let offset = 0;
  const arcs = live.map((p, i) => {
    const frac = p.share / total;
    const len = Math.max(0, frac * c - 2);
    const dash = `${len} ${c - len}`;
    const el = <circle key={p.key} r={r} cx="60" cy="60" fill="none" stroke={tones[i].c} strokeOpacity={tones[i].o} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={-offset * c + c / 4} data-wedge={p.key} />;
    offset += frac;
    return el;
  });
  const leader = live[0];
  return (
    <div data-archetype="donut" data-visual="1" data-wedges={String(live.length)} className="[container-type:inline-size]">
    {/* THE RING BESIDE ITS ROWS FROM 440px OF CONTAINER, ABOVE THEM UNDER IT: the industry's narrow seat (347 at 1280) and every phone put the ring first and the rows under, so no name is squeezed beside the ring (the archetype harness's BOTCHED MOBILE on the first render, 2026-09-20). The container query is written out in full, the kit's rule. */}
    <div className="grid grid-cols-1 items-center gap-4 [@container(min-width:440px)]:grid-cols-[auto_minmax(0,1fr)]">
      <div className="relative mx-auto h-36 w-36 [@container(min-width:440px)]:mx-0">
        <svg viewBox="0 0 120 120" width="144" height="144" role="img" aria-label={`${leader.name} ${Math.round(leader.share)}${unit} of the whole`} className="block h-36 w-36">
          {arcs}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{Math.round(leader.share)}{unit}</span>
        </div>
      </div>
      <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]" data-expect-rows={live.length}>
        {live.map((p, i) => (
          <div key={p.key} data-row={p.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 py-2">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-[3px]" style={{ background: tones[i].c, opacity: tones[i].o }} />
            <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{p.name}</span>
            <span className="rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]">{Math.round(p.share)}{unit}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
