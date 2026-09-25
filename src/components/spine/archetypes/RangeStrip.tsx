/**
 * RangeStrip , THE RANGE-STRIP ARCHETYPE. Up to five named marks of ONE
 * quantity on ONE scale: a hairline track, a tick per mark placed by value,
 * the figure over its tick and the name under it, the ends pinned inside the
 * box, a basis line beneath in the practical register. Log scale where the
 * span runs to many times (rents), linear where it does not (pay). One mark
 * may carry the accent when the strip is a spread around an answer (the
 * typical pay); a set of places carries none.
 *
 * Built for the founder's rulings of 2026-09-04: premises "in five metrics"
 * (12), practical words instead of "x7.7 prime street against the edge of
 * town" (10, 11), and the same strip on city pages with city figures. The
 * marks are whatever the data holds; a mark not held is not drawn and the
 * basis says what the strip covers.
 *
 * THE LAW INSIDE IT: figures at a quantity's size over their marks (B3), the
 * name under the mark, nothing drawn between marks that means anything, the
 * scale's domain from the data (G6), labels that never overlap: when two
 * marks sit closer than a label's width the labels step to alternate rows,
 * and the harness checks it. Fewer than two marks and the strip becomes a
 * figure with its label, never a track with one tick.
 *
 * THE LEAD MARK IS INK (MODEL.md 8.2, `13 customers`: "the typical goes to
 * ink, giving up the accent it held"; plan step 31's sixth dispatch,
 * 2026-09-18). A mark may be the strip's LEAD, `lead`, drawn in ink with an
 * ink tick: the size says which mark is the answer of the spread, and the
 * colour says nothing, because the country page's accents are the hero's and
 * the staff card's (PART 6) and the strip is not on that list. `accent`
 * survives as a separate flag (the head rung in terracotta) for a strip the
 * model lets mark a member in colour; none does today, since the city's
 * premises strip left with 8.3's `04` bento. A mark can be lead, accent,
 * both or neither; the country's customers strip and the city's earnings
 * strip are lead only.
 *
 * THE LEAD IS THE CARD'S 30 (M3: "the typical mark is the card's 30 in ink
 * on every strip that holds one"; 8.3's `07`: "the typical is the card's 30
 * in ink, the site's strip law"; plan step 32's fourth dispatch,
 * 2026-09-18). It drew at the head rung, 20, for one day, and FOCAL redded
 * every strip that held it for holding no 30 (country-GB and country-AF
 * `#customers`, city-london `#earnings`, in the laws list of that morning).
 * At `--t-focal` the figure's box is 30 tall, so when a lead sits in the
 * strip the track, the ticks and the names all sit 12 lower than they would
 * (the lead's row is 30 where a body figure's is 14, the stepped row is 18
 * down, and 18 plus 30 meets the ticks at 42 without the shift), and the box
 * is 12 taller; a strip with no lead draws exactly what it drew before, so
 * the premises strips and the industry's `14 worth` do not move. A lead
 * figure is about twice the width of a body one, so it centres only between
 * a quarter and three quarters of the track and hangs inward outside that
 * band, where a body figure centres between 15 and 85 percent; measured on
 * the city's stories at 375 before the thresholds were set. Fewer than two
 * marks and the lead is the same 30 alone, a figure with its label.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type StripMark = { key: string; label: string; value: number; accent?: boolean; lead?: boolean; sub?: string };
export type RangeStripProps = {
  marks: StripMark[];
  scale?: "log" | "linear";
  fmt: (v: number) => string;
  /** The basis line beneath the strip. AN EMPTY STRING DRAWS NOTHING (plan
   *  step 33's sixth dispatch, 2026-09-18): the trade page's `14 worth` stands
   *  its basis and note at the card's foot, the one-object card's composition
   *  (the opener at the top, the basis at the foot, the object centred in
   *  what is left), and an empty paragraph under the track would be an
   *  invisible 18px that shifts the centre. Every other caller passes its
   *  basis here and nothing changes for it. */
  basis: string;
  /** One quiet line beneath the basis (an absent spread, an extra figure). */
  note?: string | null;
  /** A single extra figure under a hairline (the electricity rate). */
  extra?: { value: string; label: string } | null;
};

const PAD = 6; // percent of the track kept clear at each end so end labels stay inside the box

export function RangeStrip({ marks, scale = "linear", fmt, basis, note, extra }: RangeStripProps) {
  const live = marks.filter((m) => Number.isFinite(m.value));
  if (live.length === 0) return null;
  if (live.length === 1) {
    const m = live[0];
    return (
      <div data-archetype="range-strip" data-idea="I12" data-marks="1">
        <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{m.label}</div>
        <Fig className={`mt-1 block font-semibold leading-none ${m.lead ? "text-[length:var(--t-focal)]" : "text-[length:var(--t-head)]"} ${m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(m.value)}</Fig>
        {basis ? <p className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
        {note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
        {extra ? <Extra extra={extra} /> : null}
      </div>
    );
  }
  const sorted = [...live].sort((a, b) => a.value - b.value);
  const lo = sorted[0].value, hi = sorted[sorted.length - 1].value;
  const useLog = scale === "log" && lo > 0 && hi / lo >= 3;
  const pos = (v: number) => {
    if (hi === lo) return 50;
    const t = useLog ? (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) : (v - lo) / (hi - lo);
    return PAD + t * (100 - 2 * PAD);
  };
  /* LABELS STEP TO A SECOND ROW when two marks sit closer than about 18% of
     the track, which is the width of a five-character figure at body size in
     a 300px card. Alternation keeps every label readable at every width. */
  const placed = sorted.map((m) => ({ m, x: pos(m.value) }));
  /* END LABELS ALIGN INWARD: a label centred on a tick near either end pokes
     past the card (measured by the harness: two labels outside on every
     premises strip). Below 15% a label hangs right of its tick, above 85% it
     hangs left, in between it centres. */
  const align = (x: number, wide = false): React.CSSProperties => {
    const [lo, hi] = wide ? [25, 75] : [15, 85];
    return x < lo ? { left: `${x}%`, transform: "translateX(0)", textAlign: "left" } : x > hi ? { left: `${x}%`, transform: "translateX(-100%)", textAlign: "right" } : { left: `${x}%`, transform: "translateX(-50%)", textAlign: "center" };
  };
  /* EVERY SECOND MARK STEPS, whenever the strip holds three or more. A rule
     on distance cannot know a label's width at render time and let a middle
     label collide with an end one (measured by the harness on every premises
     strip); alternation is deterministic and holds for five marks. */
  const rows = placed.map((_, i) => (live.length >= 3 ? i % 2 : 0));
  const twoRows = rows.some((r) => r === 1);
  /* THE LEAD'S SHIFT: a lead figure is 30 tall where a body figure is 14, so the track and everything under it sit 12 lower (the header says why). */
  const shift = live.some((m) => m.lead) ? 12 : 0;
  return (
    <div data-archetype="range-strip" data-idea="I12" data-marks={String(live.length)} data-scale={useLog ? "log" : "linear"}>
      <div className="relative" style={{ height: (twoRows ? 104 : 72) + shift }}>
        {/* the figures, over their ticks */}
        {placed.map((p, i) => (
          <div key={p.m.key} data-mark={p.m.key} className="absolute whitespace-nowrap" style={{ ...align(p.x, !!p.m.lead), top: rows[i] === 1 ? 18 : 0 }}>
            <Fig className={`block font-semibold leading-none ${p.m.lead ? "text-[length:var(--t-focal)]" : p.m.accent ? "text-[length:var(--t-head)]" : "text-[length:var(--t-body)]"} ${p.m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(p.m.value)}</Fig>
          </div>
        ))}
        {/* the track and the ticks */}
        <div aria-hidden className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: (twoRows ? 48 : 36) + shift }} />
        {placed.map((p) => (
          <div key={`t-${p.m.key}`} aria-hidden className="absolute w-px -translate-x-1/2" style={{ left: `${p.x}%`, top: (twoRows ? 42 : 30) + shift, height: 13, background: p.m.accent ? "var(--terra)" : "var(--c-ink)" }} />
        ))}
        {/* the names, under their ticks, stepping to a second row when crowded */}
        {placed.map((p, i) => (
          <div key={`l-${p.m.key}`} data-mark-label={p.m.key} className="absolute whitespace-nowrap text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ ...align(p.x), top: (twoRows ? 60 : 48) + shift + rows[i] * 18 }}>{p.m.label}</div>
        ))}
      </div>
      {basis ? <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
      {note ? <p className="mt-0.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{note}</p> : null}
      {extra ? <Extra extra={extra} /> : null}
    </div>
  );
}

function Extra({ extra }: { extra: { value: string; label: string } }) {
  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 border-t border-[var(--c-border)] pt-3">
      <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{extra.value}</Fig>
      <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{extra.label}</span>
    </div>
  );
}
