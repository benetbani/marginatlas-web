/**
 * V1 variants B and C. Harness-only, colocated with the /dev route that shows
 * them, deliberately NOT in src/components: these are candidates for the founder
 * to look at, not kit members, and putting them in the kit would make them
 * reachable by barrel re-export before anyone has chosen one.
 *
 * A is not here. A is the real `RangeStrip`, imported untouched, so the founder
 * compares against what actually ships rather than a re-implementation of it.
 *
 * WHAT B AND C CHANGE, and nothing else. Both keep RangeStrip's grammar: an
 * inter-quartile mass, a typical tick as the lone accent, the three headline
 * figures printed. B changes the SCALE to zero-based linear and adds a tick
 * axis. C keeps RangeStrip's log domain exactly and adds the tick axis plus a
 * plain-words note about what the scale is doing. Neither uses `cocoa`, which is
 * brown and which charter section 8 bans; A uses it and A is untouched by rule.
 */
import * as React from "react";

/** Compact money for axis ticks and figures. Local so the harness stays self-contained. */
function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(a >= 10_000_000_000 ? 0 : 1)}B`;
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v)}`;
}

export type Spread = {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
};

const W = 760;
const H = 96;
const PAD = 26;
const TRACK_Y = 40;
const TRACK_H = 18;

/** Round a value down/up to a readable tick. */
function niceTicks(lo: number, hi: number, count: number, log: boolean): number[] {
  const out: number[] = [];
  if (log) {
    const a = Math.log10(Math.max(1, lo));
    const b = Math.log10(hi);
    for (let i = 0; i < count; i++) {
      const t = a + ((b - a) * i) / (count - 1);
      out.push(Math.pow(10, t));
    }
  } else {
    for (let i = 0; i < count; i++) out.push(lo + ((hi - lo) * i) / (count - 1));
  }
  return out;
}

function Axis({
  ticks,
  toX,
}: {
  ticks: number[];
  toX: (v: number) => number;
}) {
  return (
    <g>
      <line
        x1={PAD}
        x2={W - PAD}
        y1={TRACK_Y + TRACK_H + 12}
        y2={TRACK_Y + TRACK_H + 12}
        className="stroke-paper-400"
        strokeWidth={1}
      />
      {ticks.map((t, i) => {
        const x = toX(t);
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={TRACK_Y + TRACK_H + 12}
              y2={TRACK_Y + TRACK_H + 17}
              className="stroke-paper-400"
              strokeWidth={1}
            />
            <text
              x={x}
              y={TRACK_Y + TRACK_H + 30}
              textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
              className="fill-ink-600 text-[11px] tabular-nums"
            >
              {money(t)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Body({
  s,
  toX,
  label,
}: {
  s: Spread;
  toX: (v: number) => number;
  label: string;
}) {
  const x10 = toX(s.p10);
  const x25 = toX(s.p25);
  const x50 = toX(s.p50);
  const x75 = toX(s.p75);
  const x90 = toX(s.p90);
  return (
    <>
      {/* full p10..p90 extent, quiet */}
      <rect
        x={x10}
        y={TRACK_Y + TRACK_H / 4}
        width={Math.max(1, x90 - x10)}
        height={TRACK_H / 2}
        className="fill-paper-200"
        rx={2}
      />
      {/* inter-quartile mass, the weight of the distribution */}
      <rect
        x={x25}
        y={TRACK_Y}
        width={Math.max(1, x75 - x25)}
        height={TRACK_H}
        className="fill-paper-400"
        rx={2}
      />
      {/* the typical value: the only accent on the graphic */}
      <line
        x1={x50}
        x2={x50}
        y1={TRACK_Y - 7}
        y2={TRACK_Y + TRACK_H + 7}
        className="stroke-atlas-600"
        strokeWidth={2.5}
      />
      <text x={x50} y={TRACK_Y - 13} textAnchor="middle" className="fill-atlas-700 text-[11px] font-semibold tabular-nums">
        {money(s.p50)}
      </text>
      <text x={x10} y={TRACK_Y - 13} textAnchor="start" className="fill-ink-600 text-[11px] tabular-nums">
        {money(s.p10)}
      </text>
      <text x={x90} y={TRACK_Y - 13} textAnchor="end" className="fill-ink-600 text-[11px] tabular-nums">
        {money(s.p90)}
      </text>
      <title>{label}</title>
    </>
  );
}

/**
 * VERSION B. Zero-based linear, `[0, p90 * 1.1]`, with a labelled tick axis.
 * The scale convention is `DistributionVisual`'s, the only one of the six
 * implementations that starts at zero; the axis is `spine2/Range`'s, the only
 * one of the six that has one.
 */
export function SpreadB({ s, note }: { s: Spread; note: string }) {
  const hi = s.p90 * 1.1;
  const toX = (v: number) => PAD + (v / hi) * (W - PAD * 2);
  const ticks = niceTicks(0, hi, 5, false);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={note}>
        <Body s={s} toX={toX} label={note} />
        <Axis ticks={ticks} toX={toX} />
      </svg>
      <figcaption className="mt-1 text-[11px] text-ink-600">
        Zero on the left. Every equal step across is an equal number of dollars.
      </figcaption>
    </figure>
  );
}

/**
 * VERSION C. RangeStrip's log domain, unchanged, plus the tick axis B has and a
 * plain-words note. The word "log" never appears: a reader who needs to be told
 * the axis is logarithmic is not helped by the word for it.
 */
export function SpreadC({ s, note }: { s: Spread; note: string }) {
  const lo = Math.max(1, s.p10 * 0.85);
  const hi = s.p90 * 1.18;
  const la = Math.log10(lo);
  const lb = Math.log10(hi);
  const toX = (v: number) =>
    PAD + ((Math.log10(Math.max(lo, v)) - la) / (lb - la)) * (W - PAD * 2);
  const ticks = niceTicks(lo, hi, 5, true);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={note}>
        <Body s={s} toX={toX} label={note} />
        <Axis ticks={ticks} toX={toX} />
      </svg>
      <figcaption className="mt-1 text-[11px] text-ink-600">
        The scale squeezes as it goes right. Each step across is roughly ten times
        the one before it, so the small end has room to be read.
      </figcaption>
    </figure>
  );
}
