/**
 * ScoreBand - a single 0-to-100 score as a calm horizontal band with the value
 * pinned and the figure in display serif (design-system 10.1, charts family).
 *
 * A score is not inherently good or bad, so the band reads neutral by default; an
 * optional `tone` tints the marker + figure only when the score carries meaning.
 * The band is named in plain language (a single band word like "Strong"), never
 * left as a bare number, and can show optional peer ticks so a reader sees where
 * the field sits without a legend. Stacks cleanly for sub-scores.
 *
 * This is DATA: opaque band, direct value, no gridlines, no legend. Reduces to a
 * legible 375px form (the band and figure never shrink; the label wraps above).
 * Filled + empty states. Server-renderable, no client JS (a score band has no
 * animation of its own; the page's one count-up lives in the masthead).
 *
 * Section: feeds the 0-100 scorecards on the cell + country pages (owner
 * take-home score, competition pressure, data confidence, ease-of-entry), and
 * any place where a single bounded score needs a calm, honest band.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { isNum, hasText, clamp01, ChartEyebrow } from "./helpers";

export type ScoreTone = "neutral" | "positive" | "caution" | "negative" | "accent";

/** A named threshold the score falls into, e.g. Lean / Fair / Strong. */
export type ScoreBandStop = {
  /** Upper bound (inclusive) of this band, on the same scale as `outOf`. */
  upTo: number;
  /** The plain word shown when the score lands in this band. */
  word: string;
  /** Tone the marker + figure take when the score lands here. @default "neutral" */
  tone?: ScoreTone;
};

export type ScoreBandProps = {
  score: number | null | undefined;
  label: string;
  /** @default 100 */
  outOf?: number;
  /** Fixed tone override; when omitted the matched band's tone is used. */
  tone?: ScoreTone;
  /** Optional one-line clarifier under the band. */
  hint?: React.ReactNode;
  /**
   * Optional named bands (ascending by `upTo`). When set, the band the score
   * lands in supplies the plain word (and tone, unless `tone` is given), and the
   * threshold words render quietly under the band.
   */
  bands?: ScoreBandStop[] | null;
  /** Optional peer scores (same scale) shown as quiet ticks for context. */
  peers?: number[] | null;
  /** Inline chart eyebrow above the row. */
  eyebrow?: string | null;
  className?: string;
};

/* THESE FIVE TONES ARE THE SCORE-BAND FAMILY IN ANOTHER VOCABULARY, which is
   why they moved together with it on 2026-08-17. buildScoreBand in
   src/lib/cities/city_view.ts maps the four break-in bands onto them directly
   (brutal -> caution, demanding -> neutral, manageable -> accent, forgiving ->
   positive), so the mark under a city's climate score and the pill on its
   masthead are the same reading.

   positive was moss-700 and both caution and negative were amber; green and
   amber are banned outright. The replacement is intensity in one hue, per the
   palette gate's own instruction: terracotta at the favourable end, draining
   through the neutral default to a deepening cocoa at the unfavourable end.
   positive takes atlas-700 rather than the vermillion accent so it stays
   distinct from `accent`, which means "this is the subject" rather than "this
   is good", and keeps the visual weight moss-700 had. */
const MARK_TONE: Record<ScoreTone, string> = {
  neutral: "bg-ink-900",
  positive: "bg-atlas-700",
  caution: "bg-cocoa-500",
  negative: "bg-cocoa-700",
  accent: "bg-chart-primary",
};
const FIG_TONE: Record<ScoreTone, string> = {
  neutral: "text-ink-900",
  positive: "text-atlas-700",
  caution: "text-cocoa-700",
  negative: "text-cocoa-900",
  accent: "text-atlas-700",
};

export function ScoreBand({
  score,
  label,
  outOf = 100,
  tone,
  hint,
  bands,
  peers,
  eyebrow,
  className,
}: ScoreBandProps) {
  // A single definite number when present, so every usage (including the closure
  // in `.find`, where outer narrowing does not flow) is type-safe.
  const s: number | null = isNum(score) && outOf > 0 ? score : null;
  const have = s != null;
  const pct = s != null ? clamp01(s / outOf) : 0;

  // The band the score lands in (first whose upper bound it clears), if any.
  const sorted = (bands ?? []).filter((b) => hasText(b.word) && isNum(b.upTo)).sort((a, b) => a.upTo - b.upTo);
  const matched =
    s != null ? (sorted.find((b) => s <= b.upTo) ?? sorted[sorted.length - 1]) : undefined;
  const effTone: ScoreTone = tone ?? matched?.tone ?? "neutral";
  const markColor = MARK_TONE[effTone];
  const figColor = have ? FIG_TONE[effTone] : "text-cocoa-700";

  const cleanPeers = (peers ?? []).filter(isNum).map((p) => clamp01(p / outOf));

  return (
    <div className={className}>
      {hasText(eyebrow) ? <ChartEyebrow className="mb-2.5">{eyebrow}</ChartEyebrow> : null}

      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-[13.5px] font-semibold text-ink-900">{label}</span>
        <span className="inline-flex shrink-0 items-baseline gap-1">
          <span className={["font-display text-[26px] font-medium leading-none tracking-tight tabular-nums", figColor].join(" ")}>
            {s != null ? Math.round(s) : "–"}
          </span>
          <span className="text-xs font-medium text-cocoa-700">/{outOf}</span>
          {have && matched ? (
            <span className={["ml-1.5 text-[11px] font-semibold uppercase tracking-wide", figColor].join(" ")}>
              {matched.word}
            </span>
          ) : null}
        </span>
      </div>

      {/* the band: a quiet atlas fill to the score, opaque, no gridline */}
      <div className="relative h-2.5 overflow-hidden rounded-full border border-parchment bg-paper-200">
        {have ? (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-chart-primary/85"
            style={{ width: `${pct * 100}%` }}
            aria-hidden="true"
          />
        ) : null}
        {/* peer ticks: quiet ink hairlines so the field reads without a legend */}
        {cleanPeers.map((p, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute top-0 h-full w-px -translate-x-1/2 bg-ink-900/30"
            style={{ left: `${p * 100}%` }}
          />
        ))}
      </div>

      {/* the value marker, sitting above the band so it never clips */}
      {have ? (
        <div className="relative h-0">
          <span
            aria-hidden="true"
            className={[
              // a 2px card-colour ring separates the marker from the band
              "absolute -top-[13px] h-4 w-[3px] -translate-x-1/2 rounded-sm ring-2 ring-white",
              markColor,
            ].join(" ")}
            style={{ left: `${pct * 100}%` }}
          />
        </div>
      ) : null}

      {/* threshold words under the band, evenly spaced */}
      {sorted.length > 0 ? (
        <div className={["flex justify-between", have ? "mt-2.5" : "mt-2"].join(" ")}>
          {sorted.map((b) => (
            <span key={b.word} className="text-[11px] tracking-wide text-cocoa-700">
              {b.word}
            </span>
          ))}
        </div>
      ) : null}

      {hint ? <div className="mt-2 text-xs leading-relaxed text-cocoa-700">{hint}</div> : null}
    </div>
  );
}
