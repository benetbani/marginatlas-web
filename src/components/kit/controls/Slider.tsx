"use client";

/**
 * Slider - a labeled range control paired with an exact numeric input
 * (interaction-control foundation, agency principles P1 + P2).
 *
 * P1 (controls act on the visible numbers in place): the slider drives a value
 * the page re-derives from, live. P2 (respond at the action's tempo): there is
 * NO Apply button. `onChange` fires on every move so the consumer can recompute
 * client-side under 100ms; for server-pending derivations the consumer wraps the
 * result in PendingShell, not this control.
 *
 * Research note: a slider alone fails for precise values (you cannot drag to
 * exactly 18%). So a typed numeric input sits beside it, sharing one value: drag
 * for feel, type for precision. Both snap to `step`, both clamp to [min, max].
 *
 * Token-styled (no pre-styled global range exists, so the track and thumb are
 * built here from utilities), keyboard-operable, 44px touch target, focus ring,
 * reduced-motion safe (the thumb transition is dropped under motion-reduce).
 * Constraint-safe: no em-dashes, no raw hex or px, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type SliderProps = {
  /** Visible label above the control. */
  label: string;
  min: number;
  max: number;
  /** Snap increment. Both the slider and the typed input round to this. */
  step: number;
  value: number;
  /** Live change (no submit). Fires on every drag tick and typed edit. */
  onChange: (next: number) => void;
  /** Formats the live value label (e.g. (n) => `${n}%`). Defaults to the number. */
  format?: (n: number) => string;
  /** Tick values to mark under the track (must fall within [min, max]). */
  ticks?: number[];
  /** Unit shown after the numeric input (e.g. "%", "/mo"). */
  suffix?: string;
  /** Stable id; the label, input, and slider are wired to it. */
  id: string;
  className?: string;
};

/** Round to the nearest step from min, then clamp to [min, max]. */
function snap(raw: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(raw)) return min;
  const stepped = step > 0 ? Math.round((raw - min) / step) * step + min : raw;
  const clamped = Math.min(max, Math.max(min, stepped));
  // Kill floating-point dust from the step math (0.1 + 0.2 style drift).
  const decimals = (String(step).split(".")[1] ?? "").length;
  return decimals > 0 ? Number(clamped.toFixed(decimals)) : clamped;
}

export function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  ticks,
  suffix,
  id,
  className,
}: SliderProps) {
  const valueId = `${id}-value`;
  const inputId = `${id}-input`;
  const display = format ? format(value) : String(value);

  // The typed input keeps its own draft string so a reader can clear it and
  // retype without the value snapping mid-keystroke; it commits on blur/Enter.
  const [draft, setDraft] = React.useState<string>(String(value));
  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = React.useCallback(() => {
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) {
      const next = snap(parsed, min, max, step);
      onChange(next);
      setDraft(String(next));
    } else {
      setDraft(String(value));
    }
  }, [draft, min, max, step, onChange, value]);

  // Fraction along the track (0..1) for the filled portion + tick reading.
  const frac = max > min ? (value - min) / (max - min) : 0;

  return (
    <div className={cn("w-full", className)}>
      {/* label + the live value reading */}
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink-900">
          {label}
        </label>
        <output
          id={valueId}
          htmlFor={id}
          className="text-sm font-semibold tabular-nums text-atlas-700"
        >
          {display}
        </output>
      </div>

      {/* the range + the exact numeric entry, sharing one value */}
      <div className="mt-2 flex items-center gap-3">
        <div className="relative flex h-11 min-w-0 flex-1 items-center">
          {/* track (under the native input, which is transparent on top) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cream-300"
          >
            <div
              className="h-full rounded-full bg-atlas-500"
              style={{ width: `${Math.max(0, Math.min(1, frac)) * 100}%` }}
            />
          </div>

          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-valuetext={display}
            onChange={(e) => onChange(snap(Number(e.target.value), min, max, step))}
            className={cn(
              // The native input is the full-height hit area (44px), transparent
              // so the token track above shows through; only the thumb paints.
              "atlas-range relative z-10 h-11 w-full cursor-pointer appearance-none bg-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
              "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-atlas-500 [&::-webkit-slider-thumb]:shadow-subtle [&::-webkit-slider-thumb]:transition-transform motion-reduce:[&::-webkit-slider-thumb]:transition-none [&:active::-webkit-slider-thumb]:scale-110",
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-atlas-500 [&::-moz-range-thumb]:shadow-subtle [&::-moz-range-track]:bg-transparent",
            )}
          />

          {/* tick marks, if supplied */}
          {ticks && ticks.length > 0 ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full mt-1">
              {ticks
                .filter((t) => t >= min && t <= max)
                .map((t) => {
                  const p = max > min ? (t - min) / (max - min) : 0;
                  return (
                    <span
                      key={t}
                      className="absolute -translate-x-1/2 text-[10px] font-medium tabular-nums text-cocoa-700"
                      style={{ left: `${p * 100}%` }}
                    >
                      {format ? format(t) : t}
                    </span>
                  );
                })}
            </div>
          ) : null}
        </div>

        {/* exact numeric entry for precise values */}
        <div className="flex items-center gap-1">
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={draft}
            aria-label={`${label}, exact value`}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft();
              }
            }}
            className={cn(
              "h-11 w-16 rounded-md border border-parchment bg-cream-50 px-2 text-right text-sm font-semibold tabular-nums text-ink-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />
          {suffix ? (
            <span className="text-sm font-medium text-cocoa-700">{suffix}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
