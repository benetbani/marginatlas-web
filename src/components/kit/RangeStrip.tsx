/**
 * RangeStrip - THE signature spread display (design-system 10.1 / Article 5).
 *
 * A "typical" figure on its own is a half-truth: the spread IS the story. This
 * is the one strip the whole site uses to show it, always as SEVEN gradations
 * (never a lone low / typical / high), so the reader who learns it on one page
 * reads it everywhere. It consolidates the older three-band PercentileStrip and
 * two-stop SpreadBar into one grammar.
 *
 * The strip plots the distribution on a positional log axis (clamped 8..92% so
 * a long tail never runs off the edge): a quiet seven-step density ramp spanning
 * the bottom-tenth to the top-tenth, the middle-half (p25..p75) seated a touch
 * deeper because that is where most firms land, and the typical (p50) carries
 * the lone accent tick and label. An optional "you are here" marker is the one
 * ink moment when a calculator feeds a reader's own number in.
 *
 * Contract (design-system 10.2): nullable in, silence out (returns null when the
 * core p10/p50/p90 are absent or degenerate); tokens only, no raw color; direct
 * labels, no legend; server-renderable SVG, motion-reduce safe by default. When
 * p25/p75 are not supplied they are interpolated from the core points so the
 * IQR band still reads.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import * as React from "react";
import { scaleLog } from "@visx/scale";
import { TierDot, type Tier } from "@/components/ui/tier-dot";

export type RangeStripProps = {
  /** Bottom-tenth value. */
  p10: number | null | undefined;
  /** Lower-quartile value. Interpolated from p10/p50 when omitted. */
  p25?: number | null;
  /** The typical (median) value, marked with the lone accent. */
  p50: number | null | undefined;
  /** Upper-quartile value. Interpolated from p50/p90 when omitted. */
  p75?: number | null;
  /** Top-tenth value. */
  p90: number | null | undefined;
  /** Formatter for the axis labels (e.g. fmtUSD). */
  format: (n: number) => string;
  /** Optional "you are here" value (a calculator marks the reader's figure). */
  you?: number | null;
  /** Optional confidence tier shown quiet, top-right (design-system 10.2 #9). */
  tier?: Tier | null;
  /** "default" is the full masthead strip; "compact" trims chrome for rows. */
  size?: "default" | "compact";
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  className?: string;
};

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

// The seven gradation tones, low tail to high tail. A quiet symmetric warm ramp
// (tails faint, the body present) so the strip reads as a distribution density
// without implying deeper equals better. Tokens only; the accent stays reserved
// for the typical marker, the one vermillion moment.
const GRADIENT_TONES = [
  "fill-cream-200",
  "fill-cream-300",
  "fill-cocoa-100",
  "fill-cocoa-300",
  "fill-cocoa-100",
  "fill-cream-300",
  "fill-cream-200",
] as const;

export function RangeStrip({
  p10,
  p25,
  p50,
  p75,
  p90,
  format,
  you,
  tier,
  size = "default",
  ariaLabel,
  className,
}: RangeStripProps) {
  // Nullable in, silence out: the core three points must be real and ordered.
  if (!isNum(p10) || !isNum(p50) || !isNum(p90) || p90 <= p10) return null;

  // Interpolate the quartiles when absent so the IQR band always reads.
  const q25 = isNum(p25) ? p25 : (p10 + p50) / 2;
  const q75 = isNum(p75) ? p75 : (p50 + p90) / 2;

  const compact = size === "compact";
  const W = 760;
  const H = compact ? 56 : 96;
  const padX = compact ? 18 : 64;
  // Clamp the plotted window a touch outside the data so the end ticks breathe.
  const lo = Math.max(1, p10 * 0.85);
  const hi = p90 * 1.18;
  const x = scaleLog({ domain: [lo, hi], range: [padX, W - padX] });
  const xp = (v: number) => x(Math.max(lo, Math.min(hi, v)));
  const trackY = compact ? 30 : 50;
  const trackH = 8;
  const r = trackH / 2;

  // Seven equal gradation segments spanning the plotted bottom-tenth to
  // top-tenth, each a step of the quiet ramp. Drawn first, under the band and
  // markers.
  const x0 = xp(p10);
  const x1 = xp(p90);
  const segW = (x1 - x0) / 7;

  const label =
    ariaLabel ??
    `Spread from ${format(p10)} at the bottom tenth to ${format(
      p90,
    )} at the top tenth, typical ${format(p50)}.`;

  return (
    <figure className={className ? `w-full ${className}` : "w-full"}>
      {tier ? (
        <figcaption className="mb-1 flex justify-end">
          <TierDot tier={tier} showLabel />
        </figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={label}
      >
        {/* seven-gradation density ramp (the signature) */}
        <g>
          {GRADIENT_TONES.map((tone, i) => (
            <rect
              key={i}
              x={x0 + segW * i}
              y={trackY}
              width={segW + 0.5 /* hairline overlap to avoid seams */}
              height={trackH}
              className={tone}
            />
          ))}
        </g>
        {/* rounded end caps over the ramp so the strip reads as one track */}
        <rect
          x={x0}
          y={trackY}
          width={x1 - x0}
          height={trackH}
          rx={r}
          className="fill-none"
        />
        {/* middle half p25..p75 seated a touch deeper: where most firms land */}
        <rect
          x={xp(q25)}
          y={trackY - 1.5}
          width={Math.max(2, xp(q75) - xp(q25))}
          height={trackH + 3}
          rx={r}
          className="fill-cocoa-300/60"
        />
        {/* typical marker: the lone accent */}
        <line
          x1={xp(p50)}
          x2={xp(p50)}
          y1={trackY - (compact ? 8 : 12)}
          y2={trackY + trackH + (compact ? 8 : 12)}
          className="stroke-atlas-500"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* you marker (calculator), the one ink moment */}
        {isNum(you) ? (
          <g>
            <line
              x1={xp(you)}
              x2={xp(you)}
              y1={trackY - (compact ? 8 : 12)}
              y2={trackY + trackH + (compact ? 8 : 12)}
              className="stroke-ink-900"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {!compact ? (
              <>
                <text
                  x={xp(you)}
                  y={trackY + trackH + 28}
                  textAnchor="middle"
                  className="fill-ink-900 tabular-nums"
                  fontSize="14"
                  fontWeight={700}
                >
                  {format(you)}
                </text>
                <text
                  x={xp(you)}
                  y={trackY - 18}
                  textAnchor="middle"
                  className="fill-ink-900"
                  fontSize="11.5"
                  fontWeight={700}
                  letterSpacing="0.04em"
                >
                  YOU
                </text>
              </>
            ) : null}
          </g>
        ) : null}

        {/* endpoint + typical labels (direct, no legend) */}
        {!compact ? (
          <>
            <text
              x={x0}
              y={trackY - 16}
              textAnchor="middle"
              className="fill-cocoa-500"
              fontSize="11.5"
              letterSpacing="0.04em"
            >
              BOTTOM 10%
            </text>
            <text
              x={x0}
              y={trackY + trackH + 26}
              textAnchor="middle"
              className="fill-ink-700 tabular-nums"
              fontSize="14"
              fontWeight={600}
            >
              {format(p10)}
            </text>

            <text
              x={x1}
              y={trackY - 16}
              textAnchor="middle"
              className="fill-cocoa-500"
              fontSize="11.5"
              letterSpacing="0.04em"
            >
              TOP 10%
            </text>
            <text
              x={x1}
              y={trackY + trackH + 26}
              textAnchor="middle"
              className="fill-ink-700 tabular-nums"
              fontSize="14"
              fontWeight={600}
            >
              {format(p90)}
            </text>

            <text
              x={xp(p50)}
              y={trackY - 18}
              textAnchor="middle"
              className="fill-atlas-700"
              fontSize="11.5"
              fontWeight={600}
              letterSpacing="0.04em"
            >
              TYPICAL
            </text>
            <text
              x={xp(p50)}
              y={trackY + trackH + 28}
              textAnchor="middle"
              className="fill-ink-900 tabular-nums"
              fontSize="17"
              fontWeight={700}
            >
              {format(p50)}
            </text>
          </>
        ) : null}
      </svg>
      {compact ? (
        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-cocoa-500">
          <span>{format(p10)}</span>
          <span className="font-semibold text-ink-900">{format(p50)}</span>
          <span>{format(p90)}</span>
        </div>
      ) : null}
    </figure>
  );
}
