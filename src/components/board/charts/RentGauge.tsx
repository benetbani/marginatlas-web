/**
 * src/components/board/charts/RentGauge.tsx
 *
 * A 0..100 half-circle gauge for rent-to-revenue pressure: higher means rent
 * eats MORE of revenue (more pressure on the margin). Same shape and tone ramp
 * as CrowdingGauge: low pressure reads moss (good), mid amber (watch), high
 * clay (hard). The track shows the full sweep behind the value fill.
 *
 * This plots pressure directly, so a high value is the unfavourable end (the
 * inverse framing of the proprietary "Rent headroom" score). The color ramp
 * carries that meaning.
 *
 * Returns null when value is absent. Built on @visx/shape Arc. Tokens only,
 * server-renderable, motion-reduce safe (static draw).
 */
import * as React from "react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";

type Props = {
  value: number | null;
};

/** Fill class by pressure level. Higher value = more rent pressure = worse. */
function pressureFill(v: number): string {
  if (v >= 66) return "fill-clay-500";
  if (v >= 33) return "fill-amber-400";
  return "fill-moss-500";
}

export function RentGauge({ value }: Props) {
  if (value == null || !Number.isFinite(value)) return null;
  const v = Math.max(0, Math.min(100, value));

  const W = 120;
  const H = 72;
  const outer = 52;
  const inner = 38;
  const start = -Math.PI / 2;
  const end = Math.PI / 2;
  const valueEnd = start + (end - start) * (v / 100);

  const cx = W / 2;
  const cy = H - 8;

  return (
    <figure className="w-[150px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Rent-to-revenue pressure ${Math.round(v)} out of 100, where higher is more pressure.`}
      >
        <Group top={cy} left={cx}>
          <Arc
            innerRadius={inner}
            outerRadius={outer}
            startAngle={start}
            endAngle={end}
            cornerRadius={2}
            className="fill-cream-300"
          />
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
