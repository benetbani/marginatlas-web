/**
 * src/components/board/charts/SpreadBar.tsx
 *
 * A compact horizontal spread: the p10..p90 range as a track, with the median
 * marked. Used where a single "typical" figure understates how wide the real
 * distribution is. Reads left (low) to right (high).
 *
 * Returns null when the core range is absent (p10 or p90 missing), so the
 * parent section still renders its rows without a broken chart. The median
 * marker is optional and simply omitted when null.
 *
 * Server-renderable SVG (no client JS). Tokens only via Tailwind fill/stroke
 * classes; no raw color. Static draw, so it is motion-reduce safe by default.
 */
import * as React from "react";
import { scaleLinear } from "@visx/scale";

type Props = {
  p10: number | null;
  median: number | null;
  p90: number | null;
};

export function SpreadBar({ p10, median, p90 }: Props) {
  if (
    p10 == null ||
    p90 == null ||
    !Number.isFinite(p10) ||
    !Number.isFinite(p90) ||
    p90 <= p10
  ) {
    return null;
  }

  const W = 320;
  const H = 64;
  const padX = 8;
  const trackY = 30;
  const trackH = 8;
  const r = trackH / 2;

  const x = scaleLinear({ domain: [p10, p90], range: [padX, W - padX] });
  const clamp = (v: number) => Math.max(p10, Math.min(p90, v));
  const hasMedian =
    median != null && Number.isFinite(median);

  return (
    <figure className="w-full max-w-[400px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={
          hasMedian
            ? "Spread from the bottom tenth to the top tenth, with the median marked."
            : "Spread from the bottom tenth to the top tenth."
        }
      >
        {/* full p10..p90 track */}
        <rect
          x={x(p10)}
          y={trackY}
          width={x(p90) - x(p10)}
          height={trackH}
          rx={r}
          className="fill-cream-300"
        />
        {/* median marker */}
        {hasMedian ? (
          <line
            x1={x(clamp(median as number))}
            x2={x(clamp(median as number))}
            y1={trackY - 8}
            y2={trackY + trackH + 8}
            className="stroke-atlas-500"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : null}
        {/* endpoint ticks */}
        <line
          x1={x(p10)}
          x2={x(p10)}
          y1={trackY - 3}
          y2={trackY + trackH + 3}
          className="stroke-cocoa-400"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={x(p90)}
          x2={x(p90)}
          y1={trackY - 3}
          y2={trackY + trackH + 3}
          className="stroke-cocoa-400"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    </figure>
  );
}
