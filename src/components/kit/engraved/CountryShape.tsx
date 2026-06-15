/**
 * kit/engraved/CountryShape.tsx — the lens "shape" radar (accepted #21).
 *
 * A nine-spoke radar that plots a country across the nine judgment lenses
 * (reward, cost, entry, people, demand, edge, risk, momentum, path). The plotted
 * polygon is the lone atlas accent filled soft with a crisp accent edge; the
 * spokes are faint engraved hairlines; a faint concentric contour grid carries
 * three rings labelled "weak / fair / strong" (never numbers, since cities stay
 * the only scored entity on the Atlas); each lens is labelled at the rim with a
 * one-word read. This is a qualitative PROFILE of a country's shape, not a score.
 *
 * It composes from the engraved foundation (CompassRosette at the hub, Glyph in
 * the rim labels, SampleState for the not-held path) and reads color only through
 * the engraved CSS vars. The radar geometry is built inline with polar math; the
 * SVG path / coordinate / stroke numbers are geometry, not style tokens, so they
 * stay inline like every other Atlas chart.
 *
 * Honest by default: lenses may be null or empty, in which case the asset draws a
 * faint dotted nonagon under a clearly-tagged SampleState ("profile still
 * forming"), never a fabricated polygon. The view derives each lens's 0..1 from
 * held metrics upstream; momentum and path may arrive as sample until trend data
 * lands, so a per-lens `sample` flag dots that one spoke's read rather than
 * implying a measured value. Server-renderable, no client JS. No em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { meaningStep, CompassRosette, Glyph, SampleState, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* The nine judgment lenses, in fixed clockwise order from the top.    */
/* ------------------------------------------------------------------ */

/** The stable key of a judgment lens. */
export type LensKey =
  | "reward"
  | "cost"
  | "entry"
  | "people"
  | "demand"
  | "edge"
  | "risk"
  | "momentum"
  | "path";

/** One lens plotted on the shape radar. */
export type ShapeLens = {
  /** The lens key (drives glyph + canonical position). */
  key: LensKey;
  /** The rim label, e.g. "Reward". */
  label: string;
  /** The lens position on the spoke, 0..1 (hub to rim); higher reads stronger. */
  score: number;
  /** Optional one-word read at the rim, e.g. "Generous". */
  read?: string | null;
  /**
   * Mark this lens as illustrative (e.g. momentum / path before trend data
   * lands). The spoke still plots, but the read is tagged as a sample rather
   * than implying a confirmed measure.
   */
  sample?: boolean;
};

export type CountryShapeProps = {
  /** The lenses to plot. Null or empty draws the dotted nonagon + SampleState. */
  lenses?: ShapeLens[] | null;
  /** Force the honest sample state regardless of input. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Canonical lens order + the glyph each lens reads with.              */
/* ------------------------------------------------------------------ */

const LENS_ORDER: readonly LensKey[] = [
  "reward",
  "cost",
  "entry",
  "people",
  "demand",
  "edge",
  "risk",
  "momentum",
  "path",
];

const LENS_GLYPH: Record<LensKey, GlyphName> = {
  reward: "coin",
  cost: "basket",
  entry: "key",
  people: "people",
  demand: "bank",
  edge: "ribbon",
  risk: "scale",
  momentum: "leaf",
  path: "flag",
};

/* ------------------------------------------------------------------ */
/* Geometry. A regular nonagon, spoke 0 at the top, clockwise.         */
/* The viewBox is a square; the hub sits at centre. Three rings carry  */
/* the weak / fair / strong contour at 1/3, 2/3, 3/3 of the radius.    */
/* ------------------------------------------------------------------ */

const VB = 360; // viewBox edge
const CX = VB / 2;
const CY = VB / 2;
const R = 116; // outer (strong) ring radius
const RINGS = [
  { r: R * (1 / 3), label: "weak" },
  { r: R * (2 / 3), label: "fair" },
  { r: R, label: "strong" },
] as const;

/** Polar -> cartesian for spoke i of n, starting at the top, going clockwise. */
function spokePoint(i: number, n: number, radius: number): { x: number; y: number } {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius };
}

/** Build a closed polygon path through the n given radii (one per spoke). */
function polygonPath(radii: number[]): string {
  return (
    radii
      .map((rad, i) => {
        const p = spokePoint(i, radii.length, rad);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function CountryShape({ lenses, sample, className }: CountryShapeProps) {
  const n = LENS_ORDER.length;

  /* -- Empty / not-held: faint dotted nonagon under the honest sample tag. -- */
  if (sample || !lenses || lenses.length === 0) {
    return (
      <div className={["eng-shape", className].filter(Boolean).join(" ")}>
        <div className="eng-shape__stage" aria-hidden="true">
          <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" style={{ display: "block", opacity: 0.5 }}>
            {/* a single faint dotted nonagon at the fair ring */}
            <path
              d={polygonPath(Array.from({ length: n }, () => RINGS[1].r))}
              fill="none"
              stroke="var(--hairline-strong)"
              strokeWidth="1"
              strokeDasharray="2 5"
              strokeLinejoin="round"
            />
            {Array.from({ length: n }).map((_, i) => {
              const p = spokePoint(i, n, RINGS[1].r);
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--hairline)"
                  strokeWidth="0.8"
                  strokeDasharray="1 5"
                />
              );
            })}
            <circle cx={CX} cy={CY} r="2.4" fill="var(--hairline-strong)" />
          </svg>
        </div>
        <SampleState
          glyph="bulb"
          what="Profile still forming"
          reason="The nine-lens shape draws once enough of this country's basics are confirmed. It reads a country's character, never a score."
          minH={120}
        />
      </div>
    );
  }

  /* -- Resolve the lenses into canonical order, holding gaps honestly. -- */
  const byKey = new Map<LensKey, ShapeLens>();
  for (const l of lenses) byKey.set(l.key, l);
  const resolved = LENS_ORDER.map((key) => byKey.get(key) ?? null);
  const held = resolved.filter((l): l is ShapeLens => l != null);

  // The plotted radius per spoke; a missing lens collapses to the hub (no claim).
  const radii = resolved.map((l) => (l ? clamp01(l.score) * R : 0));
  // A faint overall read tints the polygon edge on the quiet clay -> moss scale.
  const avg = held.length ? held.reduce((s, l) => s + clamp01(l.score), 0) / held.length : 0;
  const tone = meaningStep(avg);

  return (
    <div className={["eng-shape", className].filter(Boolean).join(" ")}>
      <div className="eng-shape__stage">
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          width="100%"
          role="img"
          aria-label="Nine-lens country shape: a qualitative profile across reward, cost, entry, people, demand, edge, risk, momentum and path."
          style={{ display: "block" }}
        >
          {/* faint concentric contour grid: weak / fair / strong rings */}
          {RINGS.map((ring, ri) => (
            <path
              key={ring.label}
              d={polygonPath(Array.from({ length: n }, () => ring.r))}
              fill="none"
              stroke="var(--hairline-strong)"
              strokeWidth={ri === RINGS.length - 1 ? 1 : 0.7}
              strokeLinejoin="round"
              opacity={ri === RINGS.length - 1 ? 0.75 : 0.5}
            />
          ))}

          {/* the contour ring labels, stacked up the top spoke (never numbers) */}
          {RINGS.map((ring) => (
            <text
              key={ring.label}
              x={CX + 4}
              y={CY - ring.r + 3}
              textAnchor="start"
              style={{
                font: "500 8.5px var(--font-body)",
                letterSpacing: "0.06em",
                fill: "var(--text-faint)",
              }}
            >
              {ring.label}
            </text>
          ))}

          {/* faint engraved spokes out to the strong ring */}
          {LENS_ORDER.map((_, i) => {
            const p = spokePoint(i, n, R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="var(--hairline-strong)"
                strokeWidth="0.7"
                opacity="0.55"
              />
            );
          })}

          {/* the plotted profile: soft accent fill + a crisp accent edge */}
          <path
            d={polygonPath(radii)}
            fill="var(--accent-fill)"
            fillOpacity="0.12"
            stroke="var(--accent-fill)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* a small engraved node at each held vertex; missing lenses sit dark at the hub */}
          {resolved.map((l, i) => {
            if (!l) return null;
            const p = spokePoint(i, n, clamp01(l.score) * R);
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3.4" fill="var(--surface-card)" stroke="var(--accent-fill)" strokeWidth="1.3" />
                <circle cx={p.x} cy={p.y} r="1.3" fill="var(--accent-fill)" />
              </g>
            );
          })}

          {/* the compass rosette at the hub, the brand orienting mark */}
          <g transform={`translate(${CX - 17} ${CY - 17})`}>
            <CompassRosette size={34} tone="var(--cocoa-500)" ring="var(--hairline-strong)" ticks={16} filled={false} />
          </g>
        </svg>

        {/* rim labels: a glyph, the lens word, and its one-word read, placed by
            the same polar math so each label sits beside its spoke tip. */}
        {resolved.map((l, i) => {
          const p = spokePoint(i, n, R);
          const dx = (p.x - CX) / R; // -1..1 horizontal bias
          const align = dx > 0.25 ? "start" : dx < -0.25 ? "end" : "center";
          // place the label as a percentage of the stage so it tracks the spoke
          const leftPct = (p.x / VB) * 100;
          const topPct = (p.y / VB) * 100;
          const key = LENS_ORDER[i];
          const label = l?.label ?? capitalize(key);
          const isHeld = l != null;
          const isSample = l?.sample === true;
          const t = isHeld ? meaningStep(clamp01(l.score)) : null;
          return (
            <div
              key={key}
              className="eng-shape__rim"
              data-align={align}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <span className="eng-shape__rim-head">
                <Glyph
                  name={LENS_GLYPH[key]}
                  size={12}
                  stroke={1.4}
                  color={isHeld ? "var(--cocoa-500)" : "var(--text-faint)"}
                />
                <span className="eng-shape__rim-label">{label}</span>
              </span>
              {isHeld && l.read ? (
                <span className="eng-shape__rim-read" style={{ color: t ? t.fg : "var(--text-faint)" }}>
                  <span className="eng-shape__rim-dot" style={{ background: t ? t.dot : "var(--text-faint)" }} />
                  {l.read}
                  {isSample ? <span className="eng-shape__rim-tag">sample</span> : null}
                </span>
              ) : (
                <span className="eng-shape__rim-read" style={{ color: "var(--text-faint)" }}>
                  not held
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* the quiet read line: a profile, not a score; the meaning scale, in words */}
      <div className="eng-shape__foot">
        <span className="eng-shape__foot-note" style={{ color: tone.fg }}>
          <span className="eng-shape__rim-dot" style={{ background: tone.dot }} />
          A profile of this country's shape, read across nine lenses. The rings mark
          weak, fair and strong; cities stay the only scored entity.
        </span>
      </div>

      {/* scoped styles: composed from the engraved CSS vars + geometry, kept
          inside this one file (no globals.css edits, no shared-file edits). */}
      <style>{`
        .eng-shape {
          border: 1px solid var(--hairline-strong);
          border-radius: 16px;
          background: var(--surface-card);
          padding: 20px 18px 16px;
        }
        .eng-shape__stage {
          position: relative;
          max-width: 420px;
          margin: 0 auto;
        }
        .eng-shape__rim {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          gap: 1px;
          width: max-content;
          max-width: 96px;
          pointer-events: none;
          line-height: 1.2;
        }
        .eng-shape__rim[data-align="start"] {
          transform: translate(2%, -50%);
          align-items: flex-start;
          text-align: left;
        }
        .eng-shape__rim[data-align="end"] {
          transform: translate(-102%, -50%);
          align-items: flex-end;
          text-align: right;
        }
        .eng-shape__rim[data-align="center"] {
          align-items: center;
          text-align: center;
        }
        .eng-shape__rim-head {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .eng-shape__rim-label {
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--text-strong);
        }
        .eng-shape__rim-read {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 500;
        }
        .eng-shape__rim[data-align="end"] .eng-shape__rim-read,
        .eng-shape__rim[data-align="end"] .eng-shape__rim-head {
          flex-direction: row-reverse;
        }
        .eng-shape__rim-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex: 0 0 auto;
          display: inline-block;
        }
        .eng-shape__rim-tag {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
          border: 1px solid var(--hairline-strong);
          border-radius: 4px;
          padding: 0 3px;
          margin-left: 3px;
        }
        .eng-shape__rim[data-align="end"] .eng-shape__rim-tag {
          margin-left: 0;
          margin-right: 3px;
        }
        .eng-shape__foot {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--hairline-strong);
        }
        .eng-shape__foot-note {
          display: flex;
          align-items: baseline;
          gap: 7px;
          font-family: var(--font-body);
          font-size: 12px;
          line-height: 1.5;
        }
        .eng-shape__foot-note .eng-shape__rim-dot {
          position: relative;
          top: 4px;
        }
        @media (max-width: 380px) {
          .eng-shape {
            padding: 16px 12px 14px;
          }
          .eng-shape__rim {
            max-width: 72px;
          }
          .eng-shape__rim-label {
            font-size: 10.5px;
          }
          .eng-shape__rim-read {
            font-size: 9.5px;
          }
        }
      `}</style>
    </div>
  );
}

/** Title-case a lens key for the fallback label when no display label is given. */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
