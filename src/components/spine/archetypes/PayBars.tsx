/**
 * PayBars , THE PAY-BARS ARCHETYPE (what staff cost). Two horizontal bars,
 * "Minimum salary" and "Average salary", on ONE track whose right edge is the
 * WORLD'S HIGHEST average salary, named at the edge. The founder's rulings of
 * 2026-09-04: (13) "what staff costs should have its edge on the level of the
 * highest level of the world for that metric, so if Switzerland has the
 * highest then only it touches the right side"; (14) "typical pay should
 * always be at least 10% ahead of the wage floor, replace words with minimum
 * salary and average salary". The builder decides withholding; this draws.
 *
 * THE LAW INSIDE IT:
 *  - One scale for both bars, the world's highest average, so a country's
 *    minimum never draws longer than its average and only the world's
 *    highest touches the edge. A fill is clamped to the track.
 *  - The edge is named: the country that holds it and its figure, in the
 *    micro line over the track's right end.
 *  - The average carries the accent; the minimum the lighter tone.
 *  - A pair the builder withholds (the average under 110 percent of the
 *    minimum) draws no bar: one line says why, and the figures stay unsaid
 *    rather than drawn as a lie. A single figure draws as a figure, no track.
 *  - No figures, nothing drawn.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type PayRow = { key: "minimum" | "average"; label: string; value: number };
export type PayBarsProps = {
  rows: PayRow[];
  worldMax: { value: number; name: string } | null;
  withheld?: string | null;
  fmt: (v: number) => string;
  edgeLabel: (name: string, figure: string) => string;
};

export function PayBars({ rows, worldMax, withheld, fmt, edgeLabel }: PayBarsProps) {
  const live = rows.filter((r) => Number.isFinite(r.value) && r.value > 0);
  if (withheld) {
    return (
      <div data-archetype="pay-bars" data-withheld="1">
        <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{withheld}</p>
      </div>
    );
  }
  if (live.length === 0) return null;
  if (live.length === 1 || !worldMax || !(worldMax.value > 0)) {
    return (
      <div data-archetype="pay-bars" data-bars="0" className="flex flex-wrap gap-x-6 gap-y-1.5">
        {live.map((r) => (
          <span key={r.key} data-pay={r.key} className="flex items-baseline gap-1.5">
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{fmt(r.value)}</Fig>
            <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.label}</span>
          </span>
        ))}
      </div>
    );
  }
  const max = worldMax.value;
  return (
    <div data-archetype="pay-bars" data-bars={String(live.length)} data-idea="I2">
      <div className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-x-3 gap-y-2">
        {/* THE EDGE, NAMED, across the card's width so it never cuts in the track's column (measured: cut at every width in a 347px card). */}
        <span data-edge className="col-span-3 text-right text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{edgeLabel(worldMax.name, fmt(max))}</span>
        {live.map((r) => {
          const share = Math.max(0, Math.min(1, r.value / max));
          const accent = r.key === "average";
          return (
            <React.Fragment key={r.key}>
              <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.label}</span>
              <span data-track className="relative block h-3 overflow-hidden rounded-full bg-[var(--c-soft)]" role="img" aria-label={`${r.label} ${fmt(r.value)} a year, against the world's highest ${fmt(max)}`}>
                <span data-bar={r.key} aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(share * 100).toFixed(1)}%`, background: accent ? "var(--terra)" : "var(--terra-border)" }} />
              </span>
              <Fig className={`text-[length:var(--t-body)] font-semibold ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(r.value)}</Fig>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
