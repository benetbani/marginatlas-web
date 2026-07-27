/**
 * src/components/spine2/SparkTrend.tsx
 *
 * The trendrow wrapper (BATCH-B "trendrow", city ch11): 2 to 4 ten-year
 * directions, each a derived delta figure over a neutral sparkline with a
 * one-word caption, rendered as the frozen `.trendrow` grid.
 *
 * The spark is built fresh here rather than importing the old kit's Spark:
 * that one is terracotta line + area fill by construction, which is not
 * visually neutral (the trendrow spark is a bare n3 polyline, terracotta only
 * on the accent series), and importing it would couple spine2 to the old
 * kit's token system.
 *
 * Derived marks (M5 + budget decision D7): deltaPct DERIVES from values
 * (values[last] / values[0] - 1), never passed, so the figure and the
 * polyline cannot disagree (M7). The accent follows DECLARED PER-METRIC
 * POLARITY: terracotta only on a series whose movement is against the owner
 * (`againstOwner` on the metric), never on mere direction. This deliberately
 * diverges from the mockup, which accented the falling series and thereby
 * drew good news (fewer vacancies) in the alarm colour. The .big "dn"/"up"
 * classes are reused as tones (dn = terra-deep), keyed to polarity, not sign;
 * the sign lives in the printed figure.
 *
 * Self-omit (M9): an item with fewer than 2 finite values, or no computable
 * delta (first value 0), omits; fewer than 2 surviving items omits the row.
 */
import * as React from "react";

import { GlyphIcon, type GlyphId } from "./GlyphIcon";

export interface TrendItem {
  label: string;
  icon?: GlyphId;
  /** The raw series; the delta figure and the polyline both derive from it. */
  values: Array<number | null | undefined>;
  /** One-line quiet caption ("over ten years", "recovering"). */
  caption?: string;
  /** Declared polarity: true when this movement works against an owner. */
  againstOwner?: boolean;
}

export interface SparkTrendProps {
  /** 2 to 4 items; extras beyond 4 are not rendered. */
  items: TrendItem[];
}

export function SparkTrend({ items }: SparkTrendProps) {
  const live = (items ?? [])
    .map((it) => {
      const values = (it.values ?? []).filter(
        (v): v is number => v != null && Number.isFinite(v),
      );
      if (values.length < 2 || values[0] === 0) return null;
      return { ...it, values, delta: values[values.length - 1] / values[0] - 1 };
    })
    .filter((it): it is TrendItem & { values: number[]; delta: number } => it != null)
    .slice(0, 4);
  if (live.length < 2) return null;

  return (
    <div className="trendrow">
      {live.map((it, i) => (
        <div key={i} className="t">
          <div className="h">
            {it.icon ? <GlyphIcon id={it.icon} size={13} /> : null}
            {it.label}
          </div>
          <div className={`big ${it.againstOwner ? "dn" : "up"}`}>{deltaPct(it.delta)}</div>
          <Sparkline values={it.values} accent={!!it.againstOwner} />
          {it.caption ? (
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{it.caption}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** "+18%" / "−22%" (typographic minus, the mockup's glyph). */
function deltaPct(delta: number): string {
  const v = Math.round(delta * 100);
  return v < 0 ? `−${Math.abs(v)}%` : `+${v}%`;
}

/** Bare polyline spark on the mockup's 100x32 viewBox; terminal dot on accent. */
function Sparkline({ values, accent }: { values: number[]; accent: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const X = (i: number) => 2 + (i / (values.length - 1)) * 96;
  const Y = (v: number) => (span === 0 ? 16 : 28 - ((v - min) / span) * 23);
  const pts = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const last = values.length - 1;
  return (
    <svg viewBox="0 0 100 32" role="img" aria-label="ten-year trend">
      <polyline className={accent ? "spark a" : "spark"} points={pts} />
      {accent ? (
        <circle className="sd" cx={X(last).toFixed(1)} cy={Y(values[last]).toFixed(1)} r={2.5} />
      ) : null}
    </svg>
  );
}
