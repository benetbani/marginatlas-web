/**
 * src/components/spine2/Quad.tsx
 *
 * Country 14's opportunity scatter: trades as points on a supply-density x
 * demand-money plane, the thin-supply/high-money quadrant tinted as the
 * opportunity zone.
 *
 * Contract points (BATCH-B, risk 5):
 * - ZONE = { xMin: 50, yMax: 50 } is ONE named constant with THREE readers:
 *   the drawn zone tint (inline-styled from it), the point accent
 *   (`inZone`), and the accented corner label's colour. The mockup hand-set
 *   two `hi` points while Vehicle repair at (64,46) sat inside the drawn
 *   zone unmarked , the page tinted a zone by one rule and accented points
 *   by another, the exact drift M5 exists to kill. The port derives, so
 *   THREE points accent on the UK data (the sanctioned divergence,
 *   COMPONENT-BUDGET D6).
 * - M6 de-collision: labels flip inward past FLIP_AT (the mockups' 1D
 *   flip), PLUS a vertical min-gap sorted-push per left/right label column
 *   (the pcoords GAP=13 pattern from country 13's IIFE, expressed in % of
 *   plot height) with leader lines wherever a label moves off its node.
 * - M6 axis poles: all four corners named; the zone corner carries the
 *   accent colour, derived from ZONE.
 * - M9: a point missing either coordinate does not render; fewer than 4
 *   renderable points omits the plot (a 2-point scatter is a list , the
 *   section's side statblock carries the finding as rows).
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

/** The one constant the tint, the accent and the corner colour read (M5/M7). */
export const ZONE = { xMin: 50, yMax: 50 } as const;
/** Labels past this x flip inward so nothing leaves the plot. */
const FLIP_AT = 55;
/** Vertical min-gap between labels, % of plot height (pcoords GAP=13 ~ 4%). */
const GAP = 4;
const MIN_POINTS = 4;

export type QuadPoint = {
  id: string;
  label: string;
  icon: GlyphId;
  /** How crowded the trade runs, 0..100 (right = thin). */
  supplyPct: number | null;
  /** Where the money is, 0..100 of plot height (top = money around). */
  demandPct: number | null;
};

export function inZone(p: { supplyPct: number; demandPct: number }): boolean {
  return p.supplyPct >= ZONE.xMin && p.demandPct <= ZONE.yMax;
}

export interface QuadProps extends React.HTMLAttributes<HTMLDivElement> {
  points: QuadPoint[];
  /** All four corners, per M6 , never a single pole label. */
  axisPoles: { tl: string; tr: string; bl: string; br: string };
}

type PlacedPoint = {
  id: string;
  label: string;
  icon: GlyphId;
  x: number;
  y: number;
  hi: boolean;
  flip: boolean;
  labelY: number;
};

/** The pcoords sorted-push, applied per left/right label column. */
function placeLabels(pts: Omit<PlacedPoint, "labelY">[]): PlacedPoint[] {
  const placed = pts.map((p) => ({ ...p, labelY: p.y }));
  for (const flip of [false, true]) {
    const col = placed
      .filter((p) => p.flip === flip)
      .sort((a, b) => a.labelY - b.labelY);
    for (let i = 1; i < col.length; i++)
      if (col[i].labelY - col[i - 1].labelY < GAP)
        col[i].labelY = col[i - 1].labelY + GAP;
  }
  return placed;
}

const Quad = React.forwardRef<HTMLDivElement, QuadProps>(
  ({ points, axisPoles, className, ...props }, ref) => {
    const renderable = points.filter(
      (p) => p.supplyPct != null && p.demandPct != null,
    );
    if (renderable.length < MIN_POINTS) return null;

    const placed = placeLabels(
      renderable.map((p) => {
        const x = p.supplyPct as number;
        const y = p.demandPct as number;
        return {
          id: p.id,
          label: p.label,
          icon: p.icon,
          x,
          y,
          hi: inZone({ supplyPct: x, demandPct: y }),
          flip: x > FLIP_AT,
        };
      }),
    );
    const leaders = placed.filter((p) => Math.abs(p.labelY - p.y) > 1);

    /* The accented corner derives from where ZONE sits (x high = right,
       y low = top), so the corner colour cannot drift from the tint. */
    const zoneCorner =
      `${ZONE.yMax <= 50 ? "t" : "b"}${ZONE.xMin >= 50 ? "r" : "l"}` as const;
    const corner = (
      key: "tl" | "tr" | "bl" | "br",
      pos: React.CSSProperties,
    ) => (
      <span
        className="axl"
        style={{
          ...pos,
          ...(key === zoneCorner ? { color: "var(--terra-deep)" } : null),
        }}
      >
        {axisPoles[key]}
      </span>
    );

    return (
      <div ref={ref} className={cn("quad", className)} {...props}>
        <span className="cross h" />
        <span className="cross v" />
        <span
          className="zone"
          style={{
            left: `${ZONE.xMin}%`,
            right: 0,
            top: 0,
            bottom: `${100 - ZONE.yMax}%`,
          }}
        />
        {corner("tl", { left: 8, top: 8 })}
        {corner("tr", { right: 8, top: 8 })}
        {corner("bl", { left: 8, bottom: 8 })}
        {corner("br", { right: 8, bottom: 8 })}
        {leaders.length > 0 ? (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {leaders.map((p) => (
              <line
                key={p.id}
                x1={p.flip ? p.x - 3 : p.x + 3}
                y1={p.y}
                x2={p.flip ? p.x - 4.5 : p.x + 4.5}
                y2={p.labelY}
                stroke={p.hi ? "var(--terra-line)" : "var(--n4)"}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        ) : null}
        {placed.map((p) => (
          <span
            className={cn("pt", p.hi && "hi", p.flip && "flip")}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            key={p.id}
          >
            <GlyphIcon id={p.icon} size={13} />
          </span>
        ))}
        {/* Labels ride zero-size .pt anchors positioned in PLOT coordinates so
            the vertical nudge stays honest at any width; the 19px inset keeps
            the visual offset of the mockups' 32px-from-box-edge. */}
        {placed.map((p) => (
          <span
            className={cn("pt", p.hi && "hi", p.flip && "flip")}
            style={{
              left: `${p.x}%`,
              top: `${p.labelY}%`,
              width: 0,
              height: 0,
              border: 0,
              background: "transparent",
              boxShadow: "none",
            }}
            key={`lb-${p.id}`}
            aria-hidden="true"
          >
            <span className="lb" style={p.flip ? { right: 19 } : { left: 19 }}>
              {p.label}
            </span>
          </span>
        ))}
      </div>
    );
  },
);
Quad.displayName = "Quad";

export { Quad };
