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
 *
 * Reconciled with the 2026-06-14 Claude-design RangeStrip (charts family): the
 * design version is a sibling of this strip, sharing the seven-gradation ramp,
 * the log axis, the lone-accent typical and the "you" marker. The two reconcile
 * to ONE component, this one, which keeps its richer public API and behaviour
 * (interpolated quartiles, the IQR band seated deeper, the tier dot, the compact
 * row size, the CSS-only mobile-HTML / desktop-SVG split that the design lacked)
 * and folds in the only two props the design added that this did not have: an
 * optional `label` eyebrow above the strip and an optional `caption` line below
 * it (the "most cluster in the middle, the tails are wider than people assume"
 * voice). Both are additive and optional, so every existing call site is intact.
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
  /** Optional uppercase eyebrow above the strip (design reconciliation). */
  label?: string | null;
  /** Optional plain-voice line below the strip (design reconciliation). */
  caption?: string | null;
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  /**
   * Where the band came from. "measured" plots real percentiles and may say so;
   * "modelled" plots a shape derived from the typical figure and MUST NOT.
   *
   * WHY THIS EXISTS. `docs/adr/0001` records the founder's ruling: a Figure is
   * published as correct and wears no mark, but **a Band whose shape is invented
   * SHOULD be marked**, because "an unmarked band is a claim about spread that
   * the figures behind it do not support". That ruling was made and never
   * implemented.
   *
   * MEASURED, 2026-08-21, and it is worse than one invented band. TWO code paths
   * synthesise a spread from the typical revenue, using DIFFERENT constants:
   * London multiplies by 0.5 / 0.72 / 1.35 / 1.8, and the fill-defaults path by
   * 0.25 / 0.55 / 1.85 / 3.4. **Both were labelled "Bottom 10%" and "Top 10%".**
   * So two cells could show bands twice as wide as each other purely from which
   * code path filled them, and a reader had no way to tell either from a third
   * cell carrying real measured percentiles from the database.
   *
   * CONTEXT.md already names this: a Regime is "which rule produced a Band. Nine
   * code paths currently produce one and they disagree by about fifteen times in
   * typical width, so a band without its regime cannot be read."
   */
  basis?: "measured" | "modelled";
  className?: string;
};

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

// The seven gradation tones, low tail to high tail. Symmetric, tails faint and
// the body present, so the strip reads as a distribution density without
// implying deeper equals better. Tokens only; the accent stays reserved for the
// typical marker, the one vermillion moment.
//
// BOTH DEFECTS THE PREVIOUS COMMENT RECORDED ARE FIXED, 2026-08-18. It had
// measured them and left them, on the ground that new values are the founder's
// call. They are not new values: every tone below is a token this site already
// ships, and the two defects were a hue that meant nothing and a ramp that ran
// backwards.
//
// What it was, outward-in by relative luminance:
//   paper-200 .8550   parchment .7682   paper-250 .8070   cocoa-300 .4626
// The third tone was LIGHTER than the second, so a strip built to darken toward
// its body lightened on the way in and then fell off a cliff into a warm tan.
// Photographed at 900px the centre read as a different MATERIAL from its own
// tails rather than as more of them.
//
// What it is now, strictly monotonic inward and a true neutral (s=0%) at every
// step, so density is carried by intensity in one hue, which is the site's rule
// for exactly this reading:
//   paper-200 .8550   parchment .7682   paper-350 .6938   paper-400 .5209
// The body lands at .5209 against the old .4626, a hair lighter, so the strip
// keeps the weight it had while the tan goes. `paper-400` is the same token the
// site's other chart masses use, which is what makes this strip agree with the
// bars beside it instead of arguing with them.
const GRADIENT_TONES = [
  "fill-paper-200",
  "fill-parchment",
  "fill-paper-350",
  "fill-paper-400",
  "fill-paper-350",
  "fill-parchment",
  "fill-paper-200",
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
  label,
  caption,
  ariaLabel,
  basis = "measured",
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

  /* THE END WORDS FOLLOW THE BASIS. "Bottom 10%" is a percentile claim, and a
     band built by multiplying the typical figure by a constant has no
     percentiles in it to claim. When the shape is modelled the ends say which
     direction they point and nothing more. */
  const isModelled = basis === "modelled";
  const lowWord = isModelled ? "Lower" : "Bottom 10%";
  const highWord = isModelled ? "Higher" : "Top 10%";

  // Seven equal gradation segments spanning the plotted bottom-tenth to
  // top-tenth, each a step of the quiet ramp. Drawn first, under the band and
  // markers.
  const x0 = xp(p10);
  const x1 = xp(p90);
  const segW = (x1 - x0) / 7;

  const ariaText: string =
    ariaLabel ??
    isModelled
      ? `Modelled range from ${format(p10)} to ${format(p90)}, typical ${format(p50)}.`
      : `Spread from ${format(p10)} at the bottom tenth to ${format(p90)} at the top tenth, typical ${format(p50)}.`;

  // Where a value sits along the plotted track, as a percent of the band, so the
  // mobile HTML markers land at the same spot the SVG accents do. Clamped a touch
  // off each edge so a marker never collides with an endpoint label.
  const trackPct = (v: number, edge: number) => {
    const span = x1 - x0;
    if (span <= 0) return 50;
    const pct = ((xp(v) - x0) / span) * 100;
    return Math.max(edge, Math.min(100 - edge, pct));
  };
  const p50Pos = trackPct(p50, 6);
  const youPos = isNum(you) ? trackPct(you, 2) : null;
  // The "you" marker and its labels render only once the reader's scenario has
  // moved meaningfully off the typical. At rest the calculator seeds you === p50,
  // so a second marker + label on the same x just smears the TYPICAL label; once
  // a lever moves it clear, the ink "you" marker separates out cleanly.
  const youOffTypical =
    isNum(you) && isNum(p50) && Math.abs(you - p50) >= Math.max(1, p50 * 0.025);

  return (
    <figure className={className ? `w-full ${className}` : "w-full"}>
      {hasText(label) || tier ? (
        <figcaption className="mb-1.5 flex items-center justify-between gap-3">
          {hasText(label) ? (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
              {label}
            </span>
          ) : (
            <span />
          )}
          {tier ? <TierDot tier={tier} showLabel /> : null}
        </figcaption>
      ) : null}
      {/* Mobile (below sm): the SVG's baked-in 11..17px text scales to roughly
          5..8px in a phone column, illegible. Show the signature as real HTML at
          a readable size instead, gated CSS-only so it stays server-rendered with
          no hydration. The desktop SVG below is untouched. The default masthead
          size is the one that renders SVG-only on phones; the compact size keeps
          its own HTML row, so this mobile view is reserved for the default. */}
      {!compact ? (
        <div className="block sm:hidden" role="img" aria-label={ariaText}>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 text-left">
              <div className="text-[11px] font-medium uppercase tracking-wide text-cocoa-700">
                {lowWord}
              </div>
              <div className="text-base font-semibold tabular-nums text-ink-700">
                {format(p10)}
              </div>
            </div>
            <div className="min-w-0 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-atlas-700">
                Typical
              </div>
              <div className="text-lg font-bold tabular-nums text-ink-900">
                {format(p50)}
              </div>
            </div>
            <div className="min-w-0 text-right">
              <div className="text-[11px] font-medium uppercase tracking-wide text-cocoa-700">
                {highWord}
              </div>
              <div className="text-base font-semibold tabular-nums text-ink-700">
                {format(p90)}
              </div>
            </div>
          </div>
          {/* The spread as a horizontal track: the seven-tone ramp in a gradient
              bar, the typical carrying the lone accent tick. Tokens only. */}
          <div className="relative mt-2 h-2 w-full rounded-full bg-gradient-to-r from-paper-200 via-paper-400 to-paper-200">
            <span
              className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-atlas-500"
              style={{ left: `${p50Pos}%` }}
              aria-hidden="true"
            />
            {youOffTypical && youPos != null ? (
              <span
                className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-900"
                style={{ left: `${youPos}%` }}
                aria-hidden="true"
              />
            ) : null}
          </div>
          {youOffTypical ? (
            <div className="mt-1.5 text-[11px] font-semibold tabular-nums text-ink-900">
              You: {format(you)}
            </div>
          ) : null}
        </div>
      ) : null}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={compact ? "h-auto w-full" : "hidden h-auto w-full sm:block"}
        role="img"
        aria-label={ariaText}
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
        {/* middle half p25..p75 seated a touch deeper: where most firms land.
            Neutral since 2026-08-18. This band overlays the gradation ramp, so
            while it was cocoa-300/60 it put a warm cast over the strip's centre
            independently of the ramp underneath: half the tan in a photograph of
            this strip was this rect, not the tones. It is the same quantity the
            ramp already encodes, so it may not encode it in a second hue. */}
        <rect
          x={xp(q25)}
          y={trackY - 1.5}
          width={Math.max(2, xp(q75) - xp(q25))}
          height={trackH + 3}
          rx={r}
          className="fill-paper-450/60"
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
        {youOffTypical ? (
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
              className="fill-cocoa-700"
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
              className="fill-cocoa-700"
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
        <div className="mt-1 flex items-baseline justify-between gap-2 text-[11px] tabular-nums text-cocoa-700">
          <span>{format(p10)}</span>
          <span className="font-semibold text-ink-900">{format(p50)}</span>
          <span>{format(p90)}</span>
          {/* The compact SVG suppresses the you label to stay row-height; carry it
              in the footer instead so the marker reads in the quiet voice on every
              viewport, not just as a bare tick. */}
          {youOffTypical ? (
            <span className="font-semibold text-ink-900">You {format(you)}</span>
          ) : null}
        </div>
      ) : null}
      {hasText(caption) ? (
        <figcaption
          className={[
            "text-[13px] leading-relaxed text-cocoa-700",
            compact ? "mt-1.5" : "mt-2 sm:mt-1",
          ].join(" ")}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
