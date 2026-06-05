/**
 * src/components/board/charts/SurvivalCurve.tsx
 *
 * A tiny three-point survival line: the share of businesses still trading at
 * year 1, year 3, and year 5. X is the year (1 / 3 / 5), Y is percent on a
 * fixed 0..100 scale so the decline reads at a glance and curves stay
 * comparable across pages.
 *
 * Returns null unless at least two of the three points are real (a single
 * point is not a curve). Missing points are dropped from the line and their
 * dots omitted, rather than faked.
 *
 * Server-renderable SVG (no client JS). Tokens only. Motion-reduce safe.
 */
import * as React from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";

type Props = {
  yr1: number | null;
  yr3: number | null;
  yr5: number | null;
};

type Pt = { year: number; pct: number };

export function SurvivalCurve({ yr1, yr3, yr5 }: Props) {
  const raw: Array<[number, number | null]> = [
    [1, yr1],
    [3, yr3],
    [5, yr5],
  ];
  const points: Pt[] = raw
    .filter(
      (p): p is [number, number] =>
        p[1] != null && Number.isFinite(p[1]),
    )
    .map(([year, pct]) => ({ year, pct }));

  if (points.length < 2) return null;

  const W = 320;
  const H = 80;
  const padX = 10;
  const padY = 12;

  const x = scaleLinear({ domain: [1, 5], range: [padX, W - padX] });
  const y = scaleLinear({ domain: [0, 100], range: [H - padY, padY] });

  const summary = points
    .map((p) => `year ${p.year} ${Math.round(p.pct)}%`)
    .join(", ");

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Share of businesses still trading: ${summary}.`}
      >
        {/* baseline */}
        <line
          x1={padX}
          x2={W - padX}
          y1={H - padY}
          y2={H - padY}
          className="stroke-cream-300"
          strokeWidth={1}
        />
        <LinePath<Pt>
          data={points}
          x={(d) => x(d.year)}
          y={(d) => y(d.pct)}
          className="stroke-atlas-500"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {points.map((p) => (
          <circle
            key={p.year}
            cx={x(p.year)}
            cy={y(p.pct)}
            r={3}
            className="fill-atlas-500"
          />
        ))}
      </svg>
    </figure>
  );
}
