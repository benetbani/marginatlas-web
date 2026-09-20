/**
 * Ring, HIS B4 AND THE GOLD STANDARD'S B31 (rules/FOUNDER-VERDICTS.md 2026-09-10
 * and 2026-09-20; design/references/founder-2026-09-20-gold-standard-sections.md):
 * one share of a whole drawn as a sweep around a ring, the figure inside it,
 * one caption under. The first question, PART 9 clause 57: a single share
 * (the part of a day that pays the fixed costs) is best shown as how much of
 * the circle it takes, so the eye reads "most of the day" or "a third of it"
 * before the number. Its family is the shape-and-area family, beside the
 * donut; where the donut is many parts, the ring is one.
 *
 * THE LAW, inside the component:
 *  - THE SWEEP: an SVG circle, the share's arc in the accent from twelve
 *    o'clock, the rest in the accent's tint; a share over the whole (a day
 *    that does not clear its costs) fills the ring and the figure says the
 *    number past a hundred, never a second lap.
 *  - THE FIGURE inside the ring at the focal rung; `accent` puts it in the
 *    accent text colour (the seat's declared loud moment), else ink. One
 *    caption under the ring at the micro rung, in grey.
 *  - `data-archetype="ring"`, `data-visual="1"`, `data-share` the whole
 *    percent. No second hue.
 *
 * Gated by the archetype harness (stories `ring`: the exemplar, a share over
 * a hundred, a share under a quarter) and the page laws.
 */
import * as React from "react";

export function Ring({ value, figure, caption, accent = false }: { value: number; figure: string; caption?: string; accent?: boolean }) {
  if (!Number.isFinite(value) || value <= 0) return null;
  const share = Math.min(1, value / 100);
  const r = 44, c = 2 * Math.PI * r;
  const len = share * c;
  return (
    <div data-archetype="ring" data-visual="1" data-share={String(Math.round(value))} className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" width="144" height="144" role="img" aria-label={`${figure} of the whole`} className="block h-36 w-36">
          <circle r={r} cx="60" cy="60" fill="none" stroke="var(--terra-soft)" strokeWidth="14" />
          <circle r={r} cx="60" cy="60" fill="none" stroke="var(--terra)" strokeWidth="14" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={c / 4} strokeLinecap={share >= 1 ? "butt" : "round"} data-sweep />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`fig text-[length:var(--t-focal)] leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{figure}</span>
        </div>
      </div>
      {caption ? <div className="mt-2 max-w-[22ch] text-center text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{caption}</div> : null}
    </div>
  );
}
