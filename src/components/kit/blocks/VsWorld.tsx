/**
 * VsWorld - the "vs the world" anchor for money pages (design-system, blocks
 * family).
 *
 * One honest glance: this place's figure for the trade set against the global
 * median, no ranking drama. Two short bars make the gap legible without an axis
 * or a legend, a signed delta line reads the distance in plain words, and a
 * like-for-like caveat is always shown so the comparison is never mistaken for a
 * straight ranking across price regimes.
 *
 * The "here" subject carries the lone accent: its label and figure take the warm
 * terracotta and its bar the quiet atlas fill, so the eye lands on this place.
 * The global median stays neutral ink on a cream bar. The delta reads moss when
 * here sits above the median, a calm amber when it sits below (never brand red),
 * and neutral brown at par.
 *
 * Nullable inputs: when either figure is missing the block keeps its place with a
 * calm "not held yet" line, never a fabricated bar and never a crash. Both bars
 * are scaled to the larger of the two values, with a small floor so a tiny figure
 * still shows.
 *
 * This is DATA: solid figures, tabular-nums, opaque bars, no opacity-faded text,
 * AA contrast. Reduces to a legible 375px form (the bars and figures hold, the
 * label wraps). Server-renderable, no client JS.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/**
 * Compact USD fallback, used only when the caller does not pass a pre-formatted
 * display string for a figure. The dash matches the kit's en-dash.
 */
function fmtUsdCompact(n: number | null | undefined): string {
  if (!isNum(n)) return "–";
  const a = Math.abs(n);
  if (a >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${v.toFixed(v < 10 ? 1 : 0)}M`;
  }
  if (a >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export type VsWorldProps = {
  /** This place's figure for the metric. Null renders the empty state. */
  here: number | null | undefined;
  /** The global median figure for the metric. Null renders the empty state. */
  world: number | null | undefined;
  /** Metric name used in the delta line, e.g. "bakery revenue". @default "typical revenue" */
  metric?: string;
  /** Label for the subject row. @default "Here" */
  hereLabel?: string;
  /** Label for the comparison row. @default "Global median" */
  worldLabel?: string;
  /** Pre-formatted display for `here`, e.g. "$387K". Falls back to compact USD. */
  hereDisplay?: string | null;
  /** Pre-formatted display for `world`, e.g. "$344K". Falls back to compact USD. */
  worldDisplay?: string | null;
  /** The always-on like-for-like caveat. @default "Not adjusted for local prices." */
  caveat?: React.ReactNode;
  /** Block eyebrow above the rows. @default "vs the world" */
  eyebrow?: string;
  id?: string;
  className?: string;
};

/** One labelled bar: the plain label, a short bar, and the figure beside it. */
function VsRow({
  label,
  display,
  fraction,
  accent,
}: {
  label: string;
  display: string;
  fraction: number;
  accent?: boolean;
}) {
  // A small floor so a tiny value still reads as a bar, not an empty track.
  const width = Math.max(4, Math.round(fraction * 100));
  const labelColor = accent ? "text-atlas-700" : "text-cocoa-700";
  const figColor = accent ? "text-atlas-700" : "text-ink-900";
  const barColor = accent ? "bg-atlas-500/85" : "bg-cream-400";
  return (
    <div className="grid grid-cols-[minmax(5.5rem,auto)_1fr_minmax(3.25rem,auto)] items-center gap-3">
      <span className={["min-w-0 text-[13px] font-semibold", labelColor].join(" ")}>
        {label}
      </span>
      <span className="relative h-3 overflow-hidden rounded-full border border-parchment bg-cream-200">
        <span
          aria-hidden="true"
          className={["absolute inset-y-0 left-0 rounded-full", barColor].join(" ")}
          style={{ width: `${width}%` }}
        />
      </span>
      <span
        className={[
          "text-right text-[13.5px] font-semibold tabular-nums",
          figColor,
        ].join(" ")}
      >
        {display}
      </span>
    </div>
  );
}

export function VsWorld({
  here,
  world,
  metric = "typical revenue",
  hereLabel = "Here",
  worldLabel = "Global median",
  hereDisplay,
  worldDisplay,
  caveat = "Not adjusted for local prices.",
  eyebrow = "vs the world",
  id,
  className,
}: VsWorldProps) {
  const have = isNum(here) && isNum(world);

  const wrapper = (children: React.ReactNode) => (
    <section
      id={id}
      aria-label="Compared to the global median"
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );

  const header = (delta?: React.ReactNode) => (
    <div className="mb-3.5 flex items-baseline justify-between gap-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
        {eyebrow}
      </div>
      {delta ?? null}
    </div>
  );

  if (!have) {
    return wrapper(
      <>
        {header()}
        <p className="m-0 text-[13px] leading-relaxed text-cocoa-700">
          A global comparison is not held for this trade yet.
        </p>
        <p className="mt-3.5 text-xs leading-relaxed text-cocoa-500">{caveat}</p>
      </>,
    );
  }

  // Both figures are finite here. Compute the signed gap and the bar scale.
  const max = Math.max(here, world, 1);
  const pctDiff = world !== 0 ? Math.round(((here - world) / world) * 100) : null;
  const above = isNum(pctDiff) && pctDiff > 0;
  const below = isNum(pctDiff) && pctDiff < 0;
  /* The diverging grammar, one hue and its absence: terracotta above the global
     median, a deepening cocoa below it, plain cocoa when level. It was moss and
     amber until 2026-08-17, both banned outright. The signed figure and the word
     ("above" / "below" / "level with") carry the direction regardless of tone. */
  const deltaColor = above ? "text-atlas-700" : below ? "text-cocoa-900" : "text-cocoa-700";
  const deltaWord = above ? "above" : below ? "below" : "at";
  const sign = above ? "+" : "";

  const delta = isNum(pctDiff) ? (
    <span className={["text-right text-[12.5px] font-semibold", deltaColor].join(" ")}>
      <span className="tabular-nums">
        {sign}
        {pctDiff}%
      </span>{" "}
      {deltaWord} the global median {metric}
    </span>
  ) : (
    <span className="text-right text-[12.5px] font-semibold text-cocoa-700">
      level with the global median {metric}
    </span>
  );

  return wrapper(
    <>
      {header(delta)}

      <div className="flex flex-col gap-2.5">
        <VsRow
          label={hereLabel}
          display={hasText(hereDisplay) ? hereDisplay : fmtUsdCompact(here)}
          fraction={here / max}
          accent
        />
        <VsRow
          label={worldLabel}
          display={hasText(worldDisplay) ? worldDisplay : fmtUsdCompact(world)}
          fraction={world / max}
        />
      </div>

      <p className="mt-3.5 text-xs leading-relaxed text-cocoa-500">{caveat}</p>
    </>,
  );
}
