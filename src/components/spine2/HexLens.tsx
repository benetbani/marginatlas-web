/**
 * src/components/spine2/HexLens.tsx
 *
 * Country 03's "country in one shape": six owner-relevant qualities as
 * normalised 0-1 radial distances on a hexagonal radar, every axis oriented
 * so further from the centre is better for an owner. The paired key
 * statblock renders FROM the same axes, sorted descending , no second data
 * source (M7).
 *
 * Contract points (BATCH-B):
 * - Exactly 6 axes with values or the SVG omits (a missing axis collapses
 *   the hexagon into a different polygon and the cross-country shape
 *   comparison lies); the key statblock survives on the rows that have
 *   values. Vertex coords derive from index/6 trig; ring radii from the
 *   fixed [0.25, 0.5, 0.75, 1] web. Nothing positional in props.
 * - KEY_HI / KEY_LO are the named constants the key's value classes derive
 *   from (they lived inline in the mockup IIFE).
 * - M6 de-collision: side vertices keep the anchor-flip (start/end); the
 *   middle-anchored top and bottom vertices word-wrap into up to two lines
 *   (top vertex stacks upward, bottom downward) so long localised axis
 *   names cannot collide with the web or overflow.
 * - M7: `orientationNote` is rendered exactly once (the encoding's
 *   contract sentence); the `summary` prose is a FUNCTION of the sorted
 *   axes so "pulled wide on X, pinched on Y" interpolates the top-2 /
 *   bottom-2 from data, never hand-written per country.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** Key-statblock accents , derived from value, named here, never inline. */
export const KEY_HI = 0.85;
export const KEY_LO = 0.3;

const AXES_REQUIRED = 6;
const RINGS = [0.25, 0.5, 0.75, 1];
const CX = 150;
const CY = 138;
const R = 96;
const LABEL_R = R + 26;
/** Middle-anchored labels wrap at this length; two lines maximum. */
const WRAP_AT = 14;
const LINE_H = 12;

export type HexAxis = {
  key: string;
  /** 0..1, normalised, out = good. Null omits the SVG (see header). */
  value: number | null;
  /** The key row's quiet qualifier ("a company in a day, $60"). */
  note?: string;
};

export interface HexLensProps extends React.HTMLAttributes<HTMLDivElement> {
  axes: HexAxis[];
  /** The encoding contract sentence, rendered ONCE (M7). */
  orientationNote: React.ReactNode;
  /** Key statblock header. */
  keyHeader?: string;
  /** M7: prose derived from the sorted axes (descending). */
  summary?: (sortedDesc: Array<HexAxis & { value: number }>) => React.ReactNode;
}

function point(i: number, r: number, n = AXES_REQUIRED): [number, number] {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
}

function ringPath(g: number): string {
  return (
    Array.from({ length: AXES_REQUIRED }, (_, i) => {
      const [x, y] = point(i, R * g);
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z"
  );
}

/** Greedy two-line word wrap for the middle-anchored vertices. */
function wrapLabel(text: string): string[] {
  if (text.length <= WRAP_AT) return [text];
  const words = text.split(" ");
  if (words.length < 2) return [text];
  let first = words[0];
  let i = 1;
  while (i < words.length && (first + " " + words[i]).length <= WRAP_AT) {
    first = `${first} ${words[i]}`;
    i++;
  }
  const rest = words.slice(i).join(" ");
  return rest ? [first, rest] : [first];
}

const HexLens = React.forwardRef<HTMLDivElement, HexLensProps>(
  (
    {
      axes,
      orientationNote,
      keyHeader = "Read further out as better",
      summary,
      className,
      ...props
    },
    ref,
  ) => {
    const withValues = axes.filter(
      (a): a is HexAxis & { value: number } =>
        a.value != null && Number.isFinite(a.value),
    );
    const svgOk =
      axes.length === AXES_REQUIRED && withValues.length === AXES_REQUIRED;
    if (process.env.NODE_ENV !== "production" && !svgOk && axes.length > 0) {
      console.error(
        `HexLens: needs exactly ${AXES_REQUIRED} axes with values for the radar ` +
          `(got ${axes.length}, ${withValues.length} valued); omitting the SVG, keeping the key.`,
      );
    }
    const sorted = [...withValues].sort((a, b) => b.value - a.value);
    if (!svgOk && sorted.length === 0) return null;

    const keyBlock = (
      <div>
        <p className="note" style={{ marginBottom: 16 }}>
          {orientationNote}
        </p>
        {sorted.length > 0 ? (
          <div className="statblock norail">
            <div className="hd">{keyHeader}</div>
            {sorted.map((a, i) => (
              <div className="row" key={i}>
                <span className="nm">
                  {a.key}
                  {a.note ? <span className="s">{a.note}</span> : null}
                </span>
                <span
                  className={cn(
                    "v",
                    a.value <= KEY_LO ? "neg" : a.value >= KEY_HI ? "a" : undefined,
                  )}
                >
                  {Math.round(a.value * 100)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {summary ? (
          <p className="note" style={{ marginTop: 16 }}>
            {summary(sorted)}
          </p>
        ) : null}
      </div>
    );

    if (!svgOk) {
      return (
        <div ref={ref} className={className} {...props}>
          {keyBlock}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("hexwrap", className)} {...props}>
        <div className="hexlens">
          <svg viewBox="0 0 300 280">
            {RINGS.map((g) => (
              <path className="web" d={ringPath(g)} key={g} />
            ))}
            {axes.map((_, i) => {
              const [x, y] = point(i, R);
              return (
                <line
                  className="spoke"
                  x1={CX}
                  y1={CY}
                  x2={x.toFixed(1)}
                  y2={y.toFixed(1)}
                  key={i}
                />
              );
            })}
            <path
              className="shape"
              d={
                axes
                  .map((a, i) => {
                    const [x, y] = point(i, R * (a.value as number));
                    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(" ") + " Z"
              }
            />
            {axes.map((a, i) => {
              const [x, y] = point(i, R * (a.value as number));
              return (
                <circle
                  className="nd"
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r={3.6}
                  key={i}
                />
              );
            })}
            {axes.map((a, i) => {
              const [x, y] = point(i, LABEL_R);
              const anchor =
                x > CX + 6 ? "start" : x < CX - 6 ? "end" : "middle";
              /* Side four: anchor-flip only. Middle-anchored top/bottom:
                 two-line wrap, top stacks upward so no line enters the web. */
              const lines =
                anchor === "middle" ? wrapLabel(a.key) : [a.key];
              const isTop = y < CY;
              const startY = isTop ? y - (lines.length - 1) * LINE_H : y;
              return (
                <text className="axl" textAnchor={anchor} key={i}>
                  {lines.map((line, li) => (
                    <tspan
                      x={x.toFixed(1)}
                      y={(startY + li * LINE_H).toFixed(1)}
                      key={li}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>
        </div>
        {keyBlock}
      </div>
    );
  },
);
HexLens.displayName = "HexLens";

export { HexLens };
