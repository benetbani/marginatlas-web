/**
 * SeverityGlyph - a tiny inline severity meter for the start of a risk row
 * (design-system 10.1, charts family). A risk list reads visually, not as a
 * column of colored words: a three-step ladder fills in proportion to how much
 * the risk should worry the reader, so the shape carries the meaning and the
 * color only reinforces it.
 *
 * Three ascending steps, filled low-to-high:
 *   rare    = 1 of 3 filled, quiet (cocoa-500)  - worth knowing, rarely bites
 *   watch   = 2 of 3 filled, caution (amber-600) - keep an eye on it
 *   serious = 3 of 3 filled, danger (clay-700)   - plan for it
 * Unfilled steps stay as hairline parchment outlines (cream-300), so the empty
 * room above a low severity is legible as "more could fill" rather than blank.
 *
 * This is DATA at its smallest: opaque token fills, no gradient, no shadow,
 * crisp at a ~16px area. The fill color is never the sole carrier of meaning;
 * the count of filled steps (a shape) and the aria-label (e.g. "Severity:
 * watch") both say it too, so it reads for a colour-blind reader and a screen
 * reader alike. There is no vermillion here: severity is not the page subject,
 * so the accent stays reserved for the one "here" elsewhere in the view.
 *
 * Contract (design-system 10.2): nullable in, silence out is not needed since
 * `level` is a closed union, but the glyph still draws cleanly at every level.
 * Server-renderable SVG, no client JS, motion-reduce safe (it does not move).
 * Sizing is a Tailwind size class on the wrapper (default h-4 w-4 = a 16px-ish
 * area), never a raw px in a style attribute; the viewBox numbers below are
 * geometry, not design tokens, so they stay inline.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";

export type SeverityLevel = "rare" | "watch" | "serious";

export type SeverityGlyphProps = {
  /** How much the risk should worry the reader; sets fill count + tone. */
  level: SeverityLevel;
  /**
   * Tailwind size class for the glyph box, e.g. "h-4 w-4" (the default, a
   * ~16px square). Pass a larger pair like "h-5 w-5" to scale it up. Kept as a
   * class rather than a px so the glyph stays token-scaled and crisp.
   * @default "h-4 w-4"
   */
  size?: string;
  className?: string;
};

/** Per-level config: how many of the three steps fill, the token tone, the word. */
const LEVELS: Record<
  SeverityLevel,
  { filled: 1 | 2 | 3; tone: string; word: string }
> = {
  // The fill color rides on `currentColor`, set here as a token text class on
  // the wrapping <svg>. cocoa for the quiet rare step, amber for watch, clay
  // (the destructive maroon) for serious. No atlas/vermillion: severity is not
  // the subject of the view.
  rare: { filled: 1, tone: "text-cocoa-500", word: "rare" },
  watch: { filled: 2, tone: "text-amber-600", word: "watch" },
  serious: { filled: 3, tone: "text-clay-700", word: "serious" },
};

// Three ascending steps in a 12x12 viewBox, read bottom-up (step 0 lowest and
// shortest, step 2 tallest). Geometry only - these are layout numbers, not
// design tokens. Each step is a thin bar; heights climb so the ladder reads as
// a rising meter even before the fill is noticed.
const STEPS = [
  { x: 0.5, y: 7.5, h: 4 }, // lowest, shortest
  { x: 4.5, y: 4.5, h: 7 }, // middle
  { x: 8.5, y: 1.5, h: 10 }, // highest, tallest
] as const;
const STEP_W = 3;

export function SeverityGlyph({
  level,
  size = "h-4 w-4",
  className,
}: SeverityGlyphProps) {
  const cfg = LEVELS[level];

  return (
    <svg
      viewBox="0 0 12 12"
      role="img"
      aria-label={`Severity: ${cfg.word}`}
      className={[size, cfg.tone, "inline-block shrink-0 align-[-0.15em]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {STEPS.map((s, i) => {
        const isFilled = i < cfg.filled;
        return isFilled ? (
          // A filled step: solid currentColor (the level's token tone).
          <rect
            key={i}
            x={s.x}
            y={s.y}
            width={STEP_W}
            height={s.h}
            rx={0.75}
            fill="currentColor"
          />
        ) : (
          // An empty step: a parchment (cream-300) hairline outline, so the
          // headroom above a low severity reads as "could fill", not blank.
          <rect
            key={i}
            x={s.x}
            y={s.y}
            width={STEP_W}
            height={s.h}
            rx={0.75}
            fill="none"
            className="stroke-parchment"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}
