/**
 * ComparisonBars - peer comparison (design-system 10.1, charts family).
 *
 * A short list of like-for-like cells (the same trade across nearby cities, the
 * same role across places) ranked by a value, each a horizontal bar relative to
 * the leader. The subject row carries the lone vermillion accent; peers are warm
 * taupe. Direct value labels at the end of each row, no axis, no legend.
 *
 * Honesty rail (the data-sanity rule from WS1): a comparison only ranks when it
 * holds ONE axis constant. When the rows span different price regimes (e.g.
 * countries on different currencies or cost bases), pass `noLeaderMark` so no
 * raw figure is crowned across borders, and the `caveat` carries the like-for-
 * like reminder. Rows are sorted high-to-low by default so the bar reads as a
 * ranking, not a scatter.
 *
 * This is DATA: opaque bars, direct labels, no gridlines, color = meaning (the
 * subject). Reduces to a legible 375px column (labels wrap above the bar, never
 * shrink). Filled + empty states. The bars do the kit's one subtle reveal on
 * enter via the shared ds-slide-up keyframe, motion-safe-gated, so the component
 * stays server-renderable with no client JS.
 *
 * Section: feeds the "same business nearby" / "across nearby cities" peer blocks
 * on the cell + city pages, and the like-for-like rows on the compare tool.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { fmtUsdCompact, isNum, hasText, ChartEmpty, ChartEyebrow } from "./helpers";

export type ComparisonItem = {
  label: string;
  value: number | null | undefined;
  /** The subject row: carries the vermillion accent. */
  highlight?: boolean;
  /** Optional leading glyph (the only emoji the brand allows: a country flag). */
  flag?: React.ReactNode;
};

export type ComparisonBarsProps = {
  items: ComparisonItem[];
  /** Inline chart eyebrow above the list. */
  label?: string | null;
  /** Compact-USD by default; pass a matching formatter to override. */
  format?: (n: number) => string;
  /** Keep the input order instead of sorting high-to-low. @default false */
  unsorted?: boolean;
  /**
   * Suppress the accent crown and rank framing when rows span price regimes, so
   * a raw figure is never crowned across borders. The bars still draw to scale
   * for shape, but the subject is the only tinted row.
   */
  noLeaderMark?: boolean;
  /** The like-for-like caveat shown quietly under the bars. */
  caveat?: string | null;
  className?: string;
};

export function ComparisonBars({
  items,
  label,
  format = fmtUsdCompact,
  unsorted = false,
  noLeaderMark = false,
  caveat,
  className,
}: ComparisonBarsProps) {
  const clean = (items ?? []).filter(
    (it): it is ComparisonItem & { value: number } => hasText(it.label) && isNum(it.value),
  );

  if (clean.length === 0) {
    return (
      <ChartEmpty
        eyebrow={label}
        note="Not held yet. Comparable cells appear once nearby places are covered."
        className={className}
      />
    );
  }

  // Sort high-to-low so the bars read as a ranking. Across price regimes
  // (noLeaderMark) the input order is kept instead, so the chart never implies a
  // cross-border ranking from figures that are not like-for-like.
  const ordered = unsorted || noLeaderMark ? clean : [...clean].sort((a, b) => b.value - a.value);
  const max = Math.max(...ordered.map((i) => i.value)) || 1;

  return (
    <figure role="group" aria-label={label || "Comparison"} className={["m-0", className].filter(Boolean).join(" ")}>
      {hasText(label) ? <ChartEyebrow className="mb-3">{label}</ChartEyebrow> : null}

      {/* the one subtle reveal: the bars rise and fade in on enter via the shared
          keyframe, motion-safe-gated so reduced-motion gets the final state. */}
      <div className="flex flex-col gap-2.5 motion-safe:animate-ds-slide-up">
        {ordered.map((it) => {
          const pct = Math.max(3, (it.value / max) * 100);
          const hot = !!it.highlight;
          // The accent fill is reserved for the subject. Across price regimes
          // (noLeaderMark) peers all read taupe; within a regime the subject is
          // still the only tinted row, which keeps "leader" honest.
          const fill = hot ? "bg-chart-primary" : "bg-cream-400";
          const labelColor = hot ? "text-atlas-700" : "text-ink-700";
          const figColor = hot ? "text-atlas-700" : "text-ink-900";
          return (
            // Desktop: label / bar / figure in one row. Mobile: bar drops full
            // width under the label+figure so labels never shrink below 11px.
            <div
              key={it.label}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(82px,130px)_1fr_minmax(64px,auto)]"
            >
              <span
                className={[
                  "inline-flex min-w-0 items-center gap-1.5 truncate text-[13px]",
                  hot ? "font-bold" : "font-medium",
                  labelColor,
                ].join(" ")}
              >
                {it.flag ? <span aria-hidden="true">{it.flag}</span> : null}
                <span className="truncate">{it.label}</span>
              </span>
              <span className="relative order-last col-span-2 h-3.5 overflow-hidden rounded-full bg-cream-200 sm:order-none sm:col-span-1">
                <span
                  className={["absolute inset-y-0 left-0 rounded-full", fill].join(" ")}
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className={["text-right font-sans text-[13.5px] font-semibold tabular-nums", figColor].join(" ")}>
                {format(it.value)}
              </span>
            </div>
          );
        })}
      </div>

      {hasText(caveat) ? (
        <figcaption className="mt-3 text-[11px] leading-relaxed text-cocoa-700">{caveat}</figcaption>
      ) : null}
    </figure>
  );
}
