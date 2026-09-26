"use client";

/**
 * Range, THE READER'S OWN NUMBER (goal 2026-09-26, M3 of E:/atlas/design/loop/build/goal-2026-09-26/PLAN.md). A labelled slider
 * with a typed input beside it, sharing one value: drag for feel, type for precision (a slider alone cannot reach exactly
 * $41,500). Both snap to the step and both hold the ends. The native range input keeps the keyboard (arrows, Page keys, Home,
 * End) and a screen reader's reading, which says the value in the card's own grammar through `aria-valuetext`.
 *
 * THE LAW (the plan's M3): a lever sits only on a card that holds the rule it computes with; its default is a figure the card
 * already prints; the answer it moves is labelled as the reader's. Those are the caller's to keep; this control only carries the
 * number. The accent is the thumb and the filled track (the reader's own position is the card's answer while they hold it).
 */
import * as React from "react";

export function Range({ id, label, min, max, step, value, onChange, format, unit }: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  /** The value as the card prints it ("$52K"), for the screen reader's reading. */
  format: (v: number) => string;
  /** The words after the typed figure ("a year"). */
  unit?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const [draft, setDraft] = React.useState<string | null>(null);
  return (
    <div data-lever={id} className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <label htmlFor={`${id}-range`} className="shrink-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{label}</label>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => { setDraft(null); onChange(clamp(Number(e.target.value))); }}
        className="atlas-range min-w-[8rem] flex-1 cursor-pointer"
        style={{ ["--fill" as string]: `${max > min ? ((value - min) / (max - min)) * 100 : 0}%` } as React.CSSProperties}
      />
      <span className="inline-flex items-baseline gap-1">
        <span aria-hidden className="text-[length:var(--t-body)] text-[var(--c-muted)]">$</span>
        <input
          type="text"
          inputMode="numeric"
          aria-label={label}
          value={draft ?? Math.round(value).toLocaleString("en-US")}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
            if (Number.isFinite(n) && n >= min && n <= max) onChange(clamp(n));
          }}
          onBlur={() => {
            const n = Number((draft ?? "").replace(/[^0-9.]/g, ""));
            if (draft != null) onChange(clamp(Number.isFinite(n) && n > 0 ? n : value));
            setDraft(null);
          }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          className="fig w-24 rounded-sm border border-[var(--c-line-strong)] bg-[var(--c-card)] px-2 py-1 text-right text-[length:var(--t-body)] font-semibold tabular-nums text-[var(--c-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]"
        />
        {unit ? <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{unit}</span> : null}
      </span>
    </div>
  );
}
