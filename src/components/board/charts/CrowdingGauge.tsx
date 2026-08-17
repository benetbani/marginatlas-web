/**
 * src/components/board/charts/CrowdingGauge.tsx
 *
 * A 0..100 half-circle gauge for market crowding: higher means MORE crowded
 * (less room to enter). The arc fills clockwise with the value, and the fill
 * tone shifts with pressure: low crowding reads moss (good), mid reads amber
 * (watch), high reads clay (hard). The track behind it shows the full sweep.
 *
 * Note the sign convention: unlike the proprietary "Market room" score (where
 * higher = better), this gauge plots crowding directly, so a high value is the
 * unfavourable end. The color ramp encodes that, so the reader is not misled.
 *
 * Returns null when value is absent. Built on @visx/shape Arc. Tokens only,
 * no raw color. Server-renderable, motion-reduce safe (static draw).
 */
import * as React from "react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";

type Props = {
  value: number | null;
};

/** Fill class by pressure level. Higher value = more crowded = worse. */
function pressureFill(v: number): string {
  /* A MONOTONIC DARKENING, not a traffic light. It was moss / amber / clay
     until 2026-08-17 and the first two hues are banned outright. Terracotta
     is deliberately NOT used at the low-pressure end: on this page it means
     "favourable" on the score scale, and one hue must not mean two things.
     So the arc simply deepens as pressure rises, into the site's own maroon.
     The arc LENGTH and the printed figure carry the reading regardless. */
  if (v >= 66) return "fill-clay-500";
  if (v >= 33) return "fill-cocoa-500";
  return "fill-cocoa-300";
}

export function CrowdingGauge({ value }: Props) {
  if (value == null || !Number.isFinite(value)) return null;
  const v = Math.max(0, Math.min(100, value));

  const W = 120;
  const H = 72;
  const outer = 52;
  const inner = 38;
  // Bottom half-circle: sweep from -90deg (left) to +90deg (right).
  const start = -Math.PI / 2;
  const end = Math.PI / 2;
  const valueEnd = start + (end - start) * (v / 100);

  // Place the arc centre near the bottom so the half-circle sits upright.
  const cx = W / 2;
  const cy = H - 8;

  return (
    <figure className="w-[150px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Market crowding ${Math.round(v)} out of 100, where higher is more crowded.`}
      >
        <Group top={cy} left={cx}>
          {/* full-sweep track */}
          <Arc
            innerRadius={inner}
            outerRadius={outer}
            startAngle={start}
            endAngle={end}
            cornerRadius={2}
            className="fill-parchment"
          />
          {/* value fill */}
          <Arc
            innerRadius={inner}
            outerRadius={outer}
            startAngle={start}
            endAngle={valueEnd}
            cornerRadius={2}
            className={pressureFill(v)}
          />
        </Group>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-ink-900 tabular-nums"
          fontSize="18"
          fontWeight={600}
        >
          {Math.round(v)}
        </text>
      </svg>
    </figure>
  );
}
