/**
 * src/components/spine2/AxisDots.tsx
 *
 * The strip + mini merge (BATCH-A strip, BATCH-B mini): stops positioned by
 * VALUE on one horizontal axis inside an explicit domain, never at even
 * intervals. One component, two skeletons picked by `track`:
 *
 * - track "line" (the peers strip, cell ch13 / city peers): hairline axis,
 *   alternating captions with stems, `.strip` classes. Mobile re-forms to a
 *   stacked list purely in CSS (atlas-spine.css 466-473).
 * - track "gradient" (the mini scale, cell ch07): terracotta-gradient track,
 *   captions below, `.mini` classes, optional honest-range band (.band-rng).
 *
 * Derived marks (M5): the accent is the stop with role "subject", exactly one
 * allowed. "Which one is you" is a fact on the data (same footing as M1's
 * href), but the mark itself derives from the role, never a styling flag.
 * Zero subjects, or more than one, self-omits the whole component: a peers
 * strip exists to place THIS page among peers (M9), and two subjects would
 * make the accent a lie.
 *
 * Named marks (M6): every stop carries figure + name. Caption de-collision is
 * the sorted min-gap push (the GAP=13 pattern from the country 13 pcoords
 * de-collision), applied per caption side in percent-of-track units; dots and
 * stems stay at their true value positions, only captions shift.
 *
 * Self-omit (M9): a stop without a finite value drops row-level; fewer than 2
 * surviving stops, or a lost subject, omits the component.
 */
import * as React from "react";

/** Min caption gap, percent of track width. The sorted-push pattern constant. */
export const GAP = 13;

export interface AxisStop {
  value: number | null | undefined;
  /** The printed figure ("$43K", "$1,225", "-54%", "level"). */
  display: string;
  /** The name under (or over) the figure. */
  label: string;
  /** Second quiet line, gradient track only (.cp .n2). */
  sub?: string;
  /** Exactly one stop carries the subject role; it takes the accent. */
  role?: "subject";
}

export interface AxisDotsProps {
  stops: AxisStop[];
  /** Explicit [lo, hi]; never inferred silently. */
  domain: [number, number];
  /** Honest-range band [lo, hi], gradient track only. Missing just drops the band. */
  range?: [number, number];
  /** Picks the skeleton: "line" = .strip, "gradient" = .mini. Default "line". */
  track?: "line" | "gradient";
  /** Default: "alternate" on the line track, "below" on the gradient track. */
  captions?: "alternate" | "below";
  /** Default: true on the line track, false on the gradient track. */
  stems?: boolean;
}

type Placed = {
  stop: AxisStop & { value: number };
  x: number; // true value position, percent
  capX: number; // caption position after de-collision
  up: boolean; // caption above the axis (alternate mode only)
};

export function AxisDots({
  stops,
  domain,
  range,
  track = "line",
  captions = track === "line" ? "alternate" : "below",
  stems = track === "line",
}: AxisDotsProps) {
  const [lo, hi] = domain;
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi <= lo) return null;

  const valid = (stops ?? []).filter(
    (s): s is AxisStop & { value: number } => s.value != null && Number.isFinite(s.value),
  );
  if (valid.length < 2) return null;
  if (valid.filter((s) => s.role === "subject").length !== 1) return null;

  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  const sorted = [...valid].sort((a, b) => a.value - b.value);

  /* caption sides: alternate by sorted index, or all below */
  const placed: Placed[] = sorted.map((stop, i) => ({
    stop,
    x: pos(stop.value),
    capX: pos(stop.value),
    up: captions === "alternate" ? i % 2 === 0 : false,
  }));

  /* de-collision, per caption side: sorted min-gap push, then pull back inside
     the right edge. Dots keep their true positions; only captions move. */
  for (const side of captions === "alternate" ? [true, false] : [false]) {
    const group = placed.filter((p) => p.up === side);
    const xs = decollide(group.map((p) => p.capX), GAP);
    group.forEach((p, i) => {
      p.capX = xs[i];
    });
  }

  if (track === "gradient") {
    return (
      <div className="mini">
        <div className="tr" />
        {range &&
        Number.isFinite(range[0]) &&
        Number.isFinite(range[1]) &&
        range[1] > range[0] ? (
          <span
            className="band-rng"
            style={{
              left: `${pos(range[0]).toFixed(2)}%`,
              width: `${(pos(range[1]) - pos(range[0])).toFixed(2)}%`,
            }}
          />
        ) : null}
        {placed.map((p, i) => (
          <span
            key={i}
            className={p.stop.role === "subject" ? "st a" : "st"}
            style={{ left: `${p.x.toFixed(2)}%` }}
          />
        ))}
        {placed.map((p, i) => {
          const edge = p.capX <= 2 ? " l" : p.capX >= 98 ? " r" : "";
          return (
            <span key={`c${i}`} className={`cp${edge}`} style={{ left: `${p.capX.toFixed(2)}%` }}>
              <b className="f">{p.stop.display}</b>
              <span className="n">{p.stop.label}</span>
              {p.stop.sub ? <span className="n2">{p.stop.sub}</span> : null}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="strip">
      <div className="ax" />
      {placed.map((p, i) => {
        const here = p.stop.role === "subject";
        return (
          <React.Fragment key={i}>
            {stems ? (
              <span
                className="stem"
                style={
                  p.up
                    ? { left: `${p.x.toFixed(2)}%`, top: 40, height: 26 }
                    : { left: `${p.x.toFixed(2)}%`, top: 66, height: 24 }
                }
              />
            ) : null}
            <span
              className={here ? "pt here" : "pt"}
              style={{ left: `${p.x.toFixed(2)}%` }}
            />
            <span
              className={here ? "cap here" : "cap"}
              style={{ left: `${p.capX.toFixed(2)}%`, top: p.up ? 2 : 92 }}
            >
              <span className="f">{p.stop.display}</span>
              <span className="n">{p.stop.label}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Sorted min-gap push (the GAP=13 pattern): walk left to right forcing at
 * least `gap` between neighbours, then pull back from the right edge so
 * nothing leaves the track. Input must be ascending.
 */
function decollide(xs: number[], gap: number): number[] {
  const out = xs.slice();
  for (let i = 1; i < out.length; i++) {
    if (out[i] - out[i - 1] < gap) out[i] = out[i - 1] + gap;
  }
  if (out.length && out[out.length - 1] > 100) {
    out[out.length - 1] = 100;
    for (let i = out.length - 2; i >= 0; i--) {
      if (out[i + 1] - out[i] < gap) out[i] = Math.max(0, out[i + 1] - gap);
    }
  }
  return out;
}
