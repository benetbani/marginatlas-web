/**
 * ThresholdGauge - the survival / break-even line as a position on a scale
 * (design-system 10.1, charts family).
 *
 * Some numbers are not a spread, they are a LINE: the point at which a firm
 * starts covering its costs. This gauge replaces prose like "covers its costs
 * at about 85 sales a day" with a single readable track: a quiet caution zone
 * below the line (not yet covering), a quiet positive zone above it (covered),
 * and one marked tick at the threshold. It answers "how far do I have to get
 * before the lights stay on" at a glance, without a legend.
 *
 * Color jobs (the fixed grammar): the threshold tick is the lone atlas moment,
 * the one spotlight per view. The two zones never compete with it: the below
 * zone is a quiet amber caution tint, the above zone a quiet moss positive tint.
 * Meaning never rides on color alone, so each zone also carries a plain word
 * (its label) and the marker carries a sign-bearing label. The split sits at the
 * threshold's position, (value - min) / (max - min).
 *
 * This is DATA: opaque zones, a direct marker label, no gridlines, no legend.
 * Built from HTML + Tailwind (a track div, two zone fills sized by width %, an
 * absolutely-positioned tick) so it stays responsive and server-renderable with
 * no client JS. Reduces to a legible 375px column (the zone words wrap under
 * their zones, the marker label never shrinks below the 11px floor).
 *
 * Contract (design-system 10.2): nullable in, silence out. Returns null when the
 * value is absent or not finite, or when the scale is degenerate (max <= min),
 * rather than draw a meaningless line. When no max is given it defaults to a
 * sensible ceiling (value * 1.8) so the threshold seats comfortably left of
 * center with room to read "above the line" headroom.
 *
 * Section: feeds the break-even / survival-line blocks on the cell + country
 * pages (covers-costs-at, minimum-viable-volume) and any place a single
 * threshold needs to read as a position, not a bare figure.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { isNum, hasText, clamp01, ChartEyebrow } from "./helpers";

export type ThresholdGaugeProps = {
  /** The threshold position on the scale (the break-even / survival figure). */
  value: number | null;
  /** Floor of the scale. @default 0 */
  min?: number;
  /** Ceiling of the scale. Defaults to value * 1.8 when not given. */
  max?: number;
  /** Label sat under the tick, e.g. "85 sales a day". */
  markerLabel?: string | null;
  /** Plain word under the below zone. @default "Below the line" */
  belowLabel?: string | null;
  /** Plain word under the above zone. @default "Covering costs" */
  aboveLabel?: string | null;
  /** Optional quiet line under the gauge. */
  caption?: string | null;
  /** Inline chart eyebrow above the gauge. */
  eyebrow?: string | null;
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  className?: string;
};

export function ThresholdGauge({
  value,
  min = 0,
  max,
  markerLabel,
  belowLabel = "Below the line",
  aboveLabel = "Covering costs",
  caption,
  eyebrow,
  ariaLabel,
  className,
}: ThresholdGaugeProps) {
  // Nullable in, silence out: the threshold must be a real number.
  if (!isNum(value)) return null;

  // A sensible ceiling when none is given: the threshold seats a touch left of
  // center (1 / 1.8 = 56%) so the "covered" headroom reads as the larger field.
  const ceiling = isNum(max) ? max : value * 1.8;
  const floor = isNum(min) ? min : 0;

  // Degenerate scale, or a threshold that falls outside it, cannot form a
  // credible split: silence out rather than draw a tick off the track.
  if (ceiling <= floor) return null;
  if (value < floor || value > ceiling) return null;

  // The split: where the threshold sits as a fraction of the scale, clamped a
  // touch off each edge so the tick and its label never collide with an end.
  const frac = clamp01((value - floor) / (ceiling - floor));
  const tickPct = Math.max(2, Math.min(98, frac * 100));
  // The below zone runs from the floor to the threshold; the above zone fills
  // the rest. Sized off the true fraction so the zones meet exactly at the tick.
  const belowPct = frac * 100;

  const below = hasText(belowLabel) ? belowLabel : "Below the line";
  const above = hasText(aboveLabel) ? aboveLabel : "Covering costs";

  const ariaText: string =
    ariaLabel ??
    `Break-even line${
      hasText(markerLabel) ? ` at ${markerLabel}` : ""
    }. Below the line is not covering costs; above the line is covered.`;

  return (
    <figure
      role="group"
      aria-label={ariaText}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(eyebrow) ? <ChartEyebrow className="mb-3">{eyebrow}</ChartEyebrow> : null}

      {/* the track: two opaque zone fills meeting at the threshold. amber caution
          below (not yet covering), moss positive above (covered). A hairline
          rule frames it; the zones carry their own plain words below, so meaning
          never rides on color alone. */}
      <div
        className="relative flex h-6 w-full overflow-hidden rounded-full border border-parchment"
        aria-hidden="true"
      >
        <span
          className="h-full bg-amber-100"
          style={{ width: `${belowPct}%` }}
        />
        <span className="h-full flex-1 bg-moss-100" />
      </div>

      {/* the threshold tick: the lone atlas moment. A 3px bar ringed in the card
          colour so it separates cleanly from the zone seam it sits on. Rendered
          over the track in its own zero-height row so it never clips the rule. */}
      <div className="relative h-0" aria-hidden="true">
        <span
          className="absolute -top-6 h-6 w-[3px] -translate-x-1/2 rounded-sm bg-atlas-500 ring-2 ring-cream-50"
          style={{ left: `${tickPct}%` }}
        />
      </div>

      {/* the marker label under the tick: a sign-bearing line (the figure the
          line sits at), tabular so it reads as data. Positioned under the tick
          but constrained inside the track so a near-edge threshold stays legible. */}
      {hasText(markerLabel) ? (
        <div className="relative mt-2 h-5">
          <span
            className="absolute top-0 inline-flex max-w-[60%] items-center gap-1 whitespace-nowrap text-[12px] font-semibold tabular-nums text-atlas-700"
            style={{
              left: `${tickPct}%`,
              // Anchor the label by its near edge at the track ends so a
              // threshold close to an edge never overflows the gauge.
              transform: `translateX(${
                tickPct < 18 ? "0" : tickPct > 82 ? "-100%" : "-50%"
              })`,
            }}
          >
            <span aria-hidden="true" className="font-display leading-none">|</span>
            {markerLabel}
          </span>
        </div>
      ) : null}

      {/* zone words: the plain meaning of each side, quiet, under their zones.
          Direct labels, no legend. The below word sits left under the caution
          zone, the above word right under the positive zone. */}
      <div
        className={[
          "flex items-baseline justify-between gap-3",
          hasText(markerLabel) ? "mt-1" : "mt-2",
        ].join(" ")}
      >
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-amber-700">
          <span aria-hidden="true">↓</span>
          {below}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-moss-700">
          {above}
          <span aria-hidden="true">↑</span>
        </span>
      </div>

      {hasText(caption) ? (
        <figcaption className="mt-2.5 text-[11px] leading-relaxed text-cocoa-700">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
