/**
 * RangePair, A COUNTRY'S RANGE AGAINST THE WORLD'S (2026-09-25). Two spans on one axis from zero: the country's own (quick end to
 * slow end) in the accent, the usual span anywhere in a neutral under it, each with its two ends printed at the span's ends. A
 * reader sees in one look whether the country is quicker or slower than usual, which two separate figures could not say.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type Span = { key: string; label: string; lo: number; hi: number; accent?: boolean };

export function RangePair({ spans, max, fmt, ticks, unit, aria }: { spans: Span[]; max: number; fmt: (v: number) => string; ticks?: number[]; unit?: string; aria: string }) {
  const live = spans.filter((s) => Number.isFinite(s.lo) && Number.isFinite(s.hi) && s.hi >= s.lo);
  if (live.length < 2 || !(max > 0)) return null;
  const at = (v: number) => Math.max(0, Math.min(100, (v / max) * 100));
  return (
    <div data-archetype="range-pair" data-visual="1" role="img" aria-label={aria} className="flex flex-col gap-6">
      {live.map((s) => (
        <div key={s.key} data-row={s.key}>
          <div className="mb-2 flex items-baseline gap-3">
            <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{s.label}</span>
            <Fig className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{`${fmt(s.lo)} to ${fmt(s.hi)}`}</Fig>
            {unit ? <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{unit}</span> : null}
          </div>
          <div className="relative h-4 rounded-full">
            <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
            <span aria-hidden className="absolute inset-y-0 rounded-full" style={{ left: `${at(s.lo)}%`, width: `${Math.max(2, at(s.hi) - at(s.lo))}%`, ...(s.accent ? { backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(90deg, var(--terra-border), var(--terra))" } : { backgroundColor: "var(--c-line-strong)" }) }} />
          </div>
        </div>
      ))}
      {/* THE AXIS, so the spans read against a scale and not against each other alone. */}
      {ticks && ticks.length > 1 ? (
        <div aria-hidden className="relative -mt-2 h-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {ticks.map((t) => (
            /* The ends align inward, so the axis never runs past its card: a label is pulled left by its own share of the way along. */
            <span key={t} className="absolute whitespace-nowrap" style={{ left: `${at(t)}%`, transform: `translateX(-${at(t)}%)` }}>{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
