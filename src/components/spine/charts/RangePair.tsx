/**
 * RangePair, A COUNTRY'S RANGE AGAINST THE WORLD'S (2026-09-25). Two spans on one axis from zero: the country's own (quick end to
 * slow end) in the accent, the usual span anywhere in a neutral under it, each with its two ends printed at the span's ends. A
 * reader sees in one look whether the country is quicker or slower than usual, which two separate figures could not say.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

/** `quiet` (2026-09-26): the span draws with its label alone, where the card's figure above already prints its two ends. */
export type Span = { key: string; label: string; lo: number; hi: number; accent?: boolean; quiet?: boolean };

/** `fill` (2026-09-26, the United Kingdom's time-to-sell card beside the seven trades): the pair takes the height its card is lent
 *  as a plot, a hairline at each tick from the top of the plot to the axis and the two spans spread evenly inside it, so the spare
 *  height reads as the chart's own space. Centred in a growing slot instead, the drawing left two blanks of 70px above and below it. */
export function RangePair({ spans, max, fmt, ticks, unit, aria, fill = false }: { spans: Span[]; max: number; fmt: (v: number) => string; ticks?: number[]; unit?: string; aria: string; fill?: boolean }) {
  const live = spans.filter((s) => Number.isFinite(s.lo) && Number.isFinite(s.hi) && s.hi >= s.lo);
  if (live.length < 2 || !(max > 0)) return null;
  const at = (v: number) => Math.max(0, Math.min(100, (v / max) * 100));
  return (
    <div data-archetype="range-pair" data-visual="1" role="img" aria-label={aria} className={`flex flex-col ${fill ? "flex-1" : "gap-6"}`}>
      <div className={fill ? "relative mt-4 flex flex-1 flex-col justify-evenly gap-6" : "contents"}>
      {/* THE PLOT'S HAIRLINES, one at each inner tick (the track's own ends stand for the axis's), drawn first so the tracks and
          the words paint over them. */}
      {fill && ticks ? ticks.filter((t) => at(t) > 0 && at(t) < 100).map((t) => <span key={`grid-${t}`} aria-hidden data-grid className="absolute inset-y-0 w-px bg-[var(--c-border)]" style={{ left: `${at(t)}%`, transform: `translateX(-${at(t)}%)` }} />) : null}
      {live.map((s) => (
        <div key={s.key} data-row={s.key} className={fill ? "relative" : undefined}>
          {/* On the plot the words sit on the card's white, so a hairline never runs through a label. */}
          <div className={`mb-2 flex items-baseline gap-3 ${fill ? "relative w-fit bg-[var(--c-card)] pr-2" : ""}`}>
            <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{s.label}</span>
            {s.quiet ? null : <Fig className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{`${fmt(s.lo)} to ${fmt(s.hi)}`}</Fig>}
            {unit && !s.quiet ? <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{unit}</span> : null}
          </div>
          <div className="relative h-4 rounded-full">
            <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
            <span aria-hidden className="absolute inset-y-0 rounded-full" style={{ left: `${at(s.lo)}%`, width: `${Math.max(2, at(s.hi) - at(s.lo))}%`, ...(s.accent ? { backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" } : { backgroundColor: "var(--c-line-strong)" }) }} />
          </div>
        </div>
      ))}
      </div>
      {/* THE AXIS, so the spans read against a scale and not against each other alone. */}
      {ticks && ticks.length > 1 ? (
        <div aria-hidden className={`relative h-4 text-[length:var(--t-micro)] text-[var(--c-muted)] ${fill ? "mt-2" : "-mt-2"}`}>
          {ticks.map((t) => (
            /* The ends align inward, so the axis never runs past its card; on the plot a middle label is centred on its hairline. */
            <span key={t} className="absolute whitespace-nowrap tabular-nums" style={{ left: `${at(t)}%`, transform: `translateX(-${fill && at(t) > 0 && at(t) < 100 ? 50 : at(t)}%)` }}>{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
