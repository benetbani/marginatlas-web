/**
 * V2 variant C. Harness-only, colocated with its /dev route, deliberately NOT in
 * src/components: it is a candidate for the founder to look at, not a kit member.
 *
 * A and B are not here. Both are the real `ScoreBand`, imported untouched; they
 * differ only in whether the caller passes the `peers` prop the component has
 * always accepted and no live caller supplies. That is the whole of B, and
 * writing a second component for it would have hidden how small the change is.
 *
 * C is a bullet graph to Stephen Few's specification, which matters here for one
 * reason beyond taste: Few mandates that the qualitative ranges be encoded as
 * "distinct intensities from dark to light of a single hue" for colourblind
 * safety, and caps them at five, preferring three. That is the same rule this
 * house already holds as a preference. C is therefore not a departure from the
 * palette; it is the palette with a citation behind it.
 */
import * as React from "react";

const W = 420;
const H = 44;
const PAD_L = 4;
const PAD_R = 4;
const BAR_Y = 17;
const BAR_H = 10;

export type BulletBand = { upTo: number; word: string };

/** Three intensities of ONE hue, darkest = hardest. Tokens, never raw colour. */
const BAND_FILLS = ["fill-paper-400", "fill-paper-350", "fill-paper-200"] as const;

export function BulletScore({
  score,
  outOf = 100,
  label,
  bands,
  comparative,
  comparativeLabel,
}: {
  score: number;
  outOf?: number;
  label: string;
  bands: BulletBand[];
  /** The one perpendicular marker: what this score is being measured against. */
  comparative: number | null;
  comparativeLabel: string;
}) {
  const inner = W - PAD_L - PAD_R;
  const toX = (v: number) => PAD_L + (Math.max(0, Math.min(outOf, v)) / outOf) * inner;

  const word = bands.find((b) => score <= b.upTo)?.word ?? bands[bands.length - 1]?.word ?? "";

  return (
    <figure className="w-full">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-600">
          {label}
        </span>
        <span className="text-base font-semibold tabular-nums text-ink-900">
          {score}
          <span className="text-[11px] font-normal text-ink-600">/{outOf}</span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${label}: ${score} out of ${outOf}, ${word}${
          comparative != null ? `, against ${comparativeLabel} at ${comparative}` : ""
        }`}
      >
        {/* Qualitative ranges: three intensities of one hue, dark to light. */}
        {bands.map((b, i) => {
          const from = i === 0 ? 0 : bands[i - 1].upTo;
          return (
            <rect
              key={b.word}
              x={toX(from)}
              y={BAR_Y - 5}
              width={Math.max(1, toX(b.upTo) - toX(from))}
              height={BAR_H + 10}
              className={BAND_FILLS[Math.min(i, BAND_FILLS.length - 1)]}
            />
          );
        })}
        {/* The measure: one dark bar from zero. */}
        <rect
          x={toX(0)}
          y={BAR_Y}
          width={Math.max(1, toX(score) - toX(0))}
          height={BAR_H}
          className="fill-ink-900"
        />
        {/* The comparative: one perpendicular marker, and only one. */}
        {comparative != null ? (
          <line
            x1={toX(comparative)}
            x2={toX(comparative)}
            y1={BAR_Y - 8}
            y2={BAR_Y + BAR_H + 8}
            className="stroke-atlas-600"
            strokeWidth={2.5}
          />
        ) : null}
        {/* Scale ends only. Few's spec keeps the axis minimal. */}
        <text x={toX(0)} y={H - 2} textAnchor="start" className="fill-ink-600 text-[9px] tabular-nums">
          0
        </text>
        <text x={toX(outOf)} y={H - 2} textAnchor="end" className="fill-ink-600 text-[9px] tabular-nums">
          {outOf}
        </text>
      </svg>
      <figcaption className="mt-1 text-[11px] leading-snug text-ink-600">
        {word}
        {comparative != null ? (
          <>
            {". "}
            The line is {comparativeLabel}, at {comparative}.
          </>
        ) : (
          ". No comparison shown."
        )}
      </figcaption>
    </figure>
  );
}
