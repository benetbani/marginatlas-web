/**
 * MinimumWage - a small two-value display: the legal wage floor beside the
 * typical real pay for a trade, with a one-line plain note. Strictly
 * like-for-like (same place, same period); never ranked across countries.
 *
 * Two figures sit side by side: the legal floor in solid ink, the typical
 * real pay in the warm accent so the eye lands on what the trade actually
 * pays. A quiet hairline separates them. The unit suffix (per hour by
 * default) and an optional period qualifier read in muted brown. Both
 * figures are pre-formatted strings: this block never parses or computes a
 * number, so it cannot invent one.
 *
 * Nullable inputs: when either figure is missing the block renders its
 * honest empty state, a calm "not held yet" line, never a fabricated value
 * and never a crash.
 *
 * This is DATA: solid figures, tabular-nums, no opacity-faded text, AA
 * contrast, a legible 375px form (the two cells wrap and the divider turns
 * into a top hairline). Server-renderable, no client JS.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export type MinimumWageProps = {
  /** Pre-formatted legal wage floor, e.g. "$11.20". Null renders the empty state. */
  floor: string | null;
  /** Pre-formatted typical real pay for the trade, e.g. "$14.50". Null renders the empty state. */
  real: string | null;
  /** Unit suffix shown after each figure. @default "/hr" */
  unit?: string;
  /** Period qualifier, e.g. "as of 2026". Same period for both figures. */
  period?: React.ReactNode;
  /** One-line plain note, e.g. "Skilled bakers earn above the floor." */
  note?: React.ReactNode;
  /** Section label. @default "Minimum wage and real pay" */
  title?: string;
  /** Inline eyebrow above the row. Falls back to `title` when omitted. */
  eyebrow?: string | null;
  className?: string;
};

/** One labelled figure: the plain word above, the value beside its unit. */
function WageCell({
  label,
  value,
  sub,
  unit,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  unit?: string;
  accent?: boolean;
}) {
  const figColor = accent ? "text-atlas-700" : "text-ink-900";
  return (
    <div className="min-w-[7.5rem] flex-1">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cocoa-700">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={[
            "font-display text-[30px] font-medium leading-none tracking-tight tabular-nums",
            figColor,
          ].join(" ")}
        >
          {value}
        </span>
        {hasText(unit) ? (
          <span className="text-[13px] font-medium text-cocoa-700">{unit}</span>
        ) : null}
      </div>
      <div className="mt-1.5 text-xs text-cocoa-700">{sub}</div>
    </div>
  );
}

export function MinimumWage({
  floor,
  real,
  unit = "/hr",
  period,
  note,
  title = "Minimum wage and real pay",
  eyebrow,
  className,
}: MinimumWageProps) {
  const eyebrowText = hasText(eyebrow) ? eyebrow : title;
  const have = hasText(floor) && hasText(real);

  if (!have) {
    return (
      <section className={className} aria-label={title}>
        {hasText(eyebrowText) ? (
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
            {eyebrowText}
          </div>
        ) : null}
        <p className="text-[13px] leading-relaxed text-cocoa-700">
          Pay figures are not held for this trade yet.
        </p>
      </section>
    );
  }

  return (
    <section className={className} aria-label={title}>
      {hasText(eyebrowText) ? (
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
          {eyebrowText}
        </div>
      ) : null}

      {/* two like-for-like figures, real pay accented; wraps cleanly at 375px */}
      <div className="flex flex-wrap items-stretch gap-x-5 gap-y-4">
        <WageCell label="Legal floor" value={floor} sub="set by law" unit={unit} />
        {/* a quiet hairline between the two; a top border once the cells wrap */}
        <div
          aria-hidden="true"
          className="hidden w-px shrink-0 self-stretch bg-parchment sm:block"
        />
        <WageCell
          label="Typical real pay"
          value={real}
          sub="what this trade pays"
          unit={unit}
          accent
        />
      </div>

      {((note != null && note !== false) || period != null) && (
        <p className="mt-4 max-w-[58ch] text-[13px] leading-relaxed text-cocoa-700">
          {note}
          {period != null ? <span className="text-cocoa-500"> {period}</span> : null}
        </p>
      )}
    </section>
  );
}
