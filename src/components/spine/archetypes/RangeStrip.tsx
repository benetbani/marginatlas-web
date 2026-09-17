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
 * 2026-09-18). A mark may be the strip's LEAD, `lead`, drawn at the head rung
 * in ink with an ink tick: the size says which mark is the answer of the
 * spread, and the colour says nothing, because the country page's accents are
 * the hero's and the staff card's (PART 6) and the strip is not on that list.
 * `accent` survives as a separate flag for the one strip the model still lets
 * mark a member in colour (the city's premises strip, its own size class,
 * until 8.3's `04` bento retires it); a mark can be lead, accent, both or
 * neither, and the country's customers strip is lead only.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type StripMark = { key: string; label: string; value: number; accent?: boolean; lead?: boolean; sub?: string };
export type RangeStripProps = {
  marks: StripMark[];
  scale?: "log" | "linear";
  fmt: (v: number) => string;
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
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{m.label}</div>
        <Fig className={`mt-1 block text-[length:var(--t-head)] font-semibold leading-none ${m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(m.value)}</Fig>
        <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
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
  const align = (x: number): React.CSSProperties => (x < 15 ? { left: `${x}%`, transform: "translateX(0)", textAlign: "left" } : x > 85 ? { left: `${x}%`, transform: "translateX(-100%)", textAlign: "right" } : { left: `${x}%`, transform: "translateX(-50%)", textAlign: "center" });
  /* EVERY SECOND MARK STEPS, whenever the strip holds three or more. A rule
     on distance cannot know a label's width at render time and let a middle
     label collide with an end one (measured by the harness on every premises
     strip); alternation is deterministic and holds for five marks. */
  const rows = placed.map((_, i) => (live.length >= 3 ? i % 2 : 0));
  const twoRows = rows.some((r) => r === 1);
  return (
    <div data-archetype="range-strip" data-idea="I12" data-marks={String(live.length)} data-scale={useLog ? "log" : "linear"}>
      <div className="relative" style={{ height: twoRows ? 104 : 72 }}>
        {/* the figures, over their ticks */}
        {placed.map((p, i) => (
          <div key={p.m.key} data-mark={p.m.key} className="absolute whitespace-nowrap" style={{ ...align(p.x), top: rows[i] === 1 ? 18 : 0 }}>
            <Fig className={`block font-semibold leading-none ${p.m.accent || p.m.lead ? "text-[length:var(--t-head)]" : "text-[length:var(--t-body)]"} ${p.m.accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(p.m.value)}</Fig>
          </div>
        ))}
        {/* the track and the ticks */}
        <div aria-hidden className="absolute inset-x-0 h-px bg-[var(--c-line-strong)]" style={{ top: twoRows ? 48 : 36 }} />
        {placed.map((p) => (
          <div key={`t-${p.m.key}`} aria-hidden className="absolute w-px -translate-x-1/2" style={{ left: `${p.x}%`, top: twoRows ? 42 : 30, height: 13, background: p.m.accent ? "var(--terra)" : "var(--c-ink)" }} />
        ))}
        {/* the names, under their ticks, stepping to a second row when crowded */}
        {placed.map((p, i) => (
          <div key={`l-${p.m.key}`} data-mark-label={p.m.key} className="absolute whitespace-nowrap text-[length:var(--t-micro)] text-[var(--c-muted)]" style={{ ...align(p.x), top: (twoRows ? 60 : 48) + rows[i] * 18 }}>{p.m.label}</div>
        ))}
      </div>
      <p className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p>
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
