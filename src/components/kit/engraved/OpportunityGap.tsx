/**
 * kit/engraved/OpportunityGap.tsx — the opportunity-quadrant engraved plot.
 *
 * A two-axis engraved scatter that reads at a glance: the horizontal axis is how
 * much money is around (wealth / spending power), the vertical axis is how thin
 * the trade supply is (high = few firms competing). Each trade is a small etched
 * dot. The top-right quadrant, where money is present but supply is thin, is
 * washed faint moss and labelled "room to move"; two or three example trades in
 * that quadrant carry their names. Axes are drawn with end-labels only, no
 * gridlines, in the engraved-almanac manner.
 *
 * Honest by default: when trade-level density is not held, the frame still draws
 * (the quadrant, the axes, the wash) and the foundation SampleState sits inside
 * it, clearly tagged illustrative. The component always renders something and
 * never invents a real-looking dot.
 *
 * Composed from the Wave-1 foundation (meaningStep, Glyph, SampleState, Eyebrow)
 * and the engraved CSS vars; color is referenced only via var(--...). SVG
 * coordinate / path numbers are geometry, not style tokens, so they stay inline
 * like every other Atlas chart. Server-renderable, no client JS. No em-dashes,
 * no source-agency names, AA contrast, legible at 375px.
 */
import * as React from "react";
import { Glyph, SampleState, Eyebrow } from "./primitives";

/* ------------------------------------------------------------------ */
/* Types.                                                              */
/* ------------------------------------------------------------------ */

/** One trade placed on the opportunity plot. */
export type OpportunityTrade = {
  /** The trade name, e.g. "Bakeries". */
  name: string;
  /** Horizontal position, 0..1: money around (left = thin, right = plentiful). */
  x: number;
  /** Vertical position, 0..1: supply thinness (low = crowded, high = thin). */
  y: number;
};

export type OpportunityGapProps = {
  /** The trades to plot. Null or empty renders the framed sample state. */
  trades?: OpportunityTrade[] | null;
  /** The horizontal end-labels [low, high]. @default ["Less money around", "More money around"] */
  axisX?: [string, string];
  /** The vertical end-labels [low, high]. @default ["Supply crowded", "Supply thin"] */
  axisY?: [string, string];
  /** Force the honest sample state even when trades are supplied. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Plot geometry (an internal viewBox; numbers are geometry).          */
/* ------------------------------------------------------------------ */

const VB = 320; // square viewBox
const PAD_L = 30; // gutter to the y axis
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 28; // gutter to the x axis
const PLOT_L = PAD_L;
const PLOT_R = VB - PAD_R;
const PLOT_T = PAD_T;
const PLOT_B = VB - PAD_B;
const PLOT_W = PLOT_R - PLOT_L;
const PLOT_H = PLOT_B - PLOT_T;
const MID_X = PLOT_L + PLOT_W / 2;
const MID_Y = PLOT_T + PLOT_H / 2;

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);
/** Map a 0..1 x to a plot pixel (left to right). */
const px = (x: number) => PLOT_L + clamp01(x) * PLOT_W;
/** Map a 0..1 y to a plot pixel (bottom up: high y sits high). */
const py = (y: number) => PLOT_B - clamp01(y) * PLOT_H;

const DEFAULT_AXIS_X: [string, string] = ["Less money around", "More money around"];
const DEFAULT_AXIS_Y: [string, string] = ["Supply crowded", "Supply thin"];

/** A trade is "in the room" when money is present and supply is thin. */
const inRoom = (t: OpportunityTrade) => clamp01(t.x) >= 0.5 && clamp01(t.y) >= 0.5;

/* ------------------------------------------------------------------ */
/* OpportunityGap.                                                     */
/* ------------------------------------------------------------------ */

export function OpportunityGap({
  trades,
  axisX = DEFAULT_AXIS_X,
  axisY = DEFAULT_AXIS_Y,
  sample,
  className,
}: OpportunityGapProps) {
  const empty = sample || !trades || trades.length === 0;

  // Sanitise + cap, so a malformed datum can never crash or escape the frame.
  const dots = empty
    ? []
    : trades!
        .filter((t) => t && typeof t.name === "string" && t.name.length > 0)
        .slice(0, 40)
        .map((t) => ({ ...t, x: clamp01(t.x), y: clamp01(t.y) }));

  // The example trades to label: those sitting in the room, the thinnest-supply
  // first, then the most money around. Capped at three so the plot stays calm.
  const labelled = dots
    .filter(inRoom)
    .sort((a, b) => b.y - a.y || b.x - a.x)
    .slice(0, 3);
  const labelledSet = new Set(labelled);

  return (
    <div className={className} style={{ fontFamily: "var(--font-body)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <Eyebrow>The opportunity gap</Eyebrow>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            letterSpacing: "0.02em",
            color: "var(--accent)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              background: "var(--accent-subtle)",
              border: "1px solid var(--accent-fill)",
            }}
          />
          Room to move
        </span>
      </div>

      <div
        style={{
          border: "1px solid var(--hairline-strong)",
          borderRadius: "12px",
          background: "var(--surface-card)",
          padding: "10px",
          position: "relative",
        }}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          width="100%"
          role="img"
          aria-label={
            empty
              ? "Opportunity quadrant, illustrative frame, data not held"
              : `Opportunity quadrant: ${dots.length} trades plotted by money around and supply thinness`
          }
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
        >
          {/* The faint moss wash on the top-right quadrant: money present, supply thin. */}
          <rect
            x={MID_X}
            y={PLOT_T}
            width={PLOT_R - MID_X}
            height={MID_Y - PLOT_T}
            fill="var(--accent-subtle)"
          />
          {/* A second, fainter inner wash so the corner reads as the deepest room. */}
          <rect
            x={MID_X + (PLOT_R - MID_X) * 0.34}
            y={PLOT_T}
            width={(PLOT_R - MID_X) * 0.66}
            height={(MID_Y - PLOT_T) * 0.66}
            fill="var(--accent-subtle)"
            opacity={0.55}
          />

          {/* The quadrant split: two faint hairlines, dashed, no gridlines. */}
          <line
            x1={MID_X}
            y1={PLOT_T}
            x2={MID_X}
            y2={PLOT_B}
            stroke="var(--hairline-strong)"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />
          <line
            x1={PLOT_L}
            y1={MID_Y}
            x2={PLOT_R}
            y2={MID_Y}
            stroke="var(--hairline-strong)"
            strokeWidth="0.8"
            strokeDasharray="2 4"
          />

          {/* The two axes: solid engraved lines, end-labels only. */}
          <line x1={PLOT_L} y1={PLOT_T} x2={PLOT_L} y2={PLOT_B} stroke="var(--ink-700)" strokeWidth="1.1" />
          <line x1={PLOT_L} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B} stroke="var(--ink-700)" strokeWidth="1.1" />
          {/* Small surveyor ticks at the four axis ends. */}
          <line x1={PLOT_L - 3} y1={PLOT_T} x2={PLOT_L} y2={PLOT_T} stroke="var(--ink-700)" strokeWidth="1.1" />
          <line x1={PLOT_R} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B + 3} stroke="var(--ink-700)" strokeWidth="1.1" />

          {/* The "room to move" label, sitting in the washed corner. */}
          <text
            x={PLOT_R - 4}
            y={PLOT_T + 14}
            textAnchor="end"
            style={{
              font: "600 11px var(--font-body)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fill: "var(--accent)",
            }}
          >
            Room to move
          </text>

          {/* x-axis end-labels. */}
          <text
            x={PLOT_L}
            y={PLOT_B + 18}
            textAnchor="start"
            style={{ font: "500 10px var(--font-body)", fill: "var(--text-faint)" }}
          >
            {axisX[0]}
          </text>
          <text
            x={PLOT_R}
            y={PLOT_B + 18}
            textAnchor="end"
            style={{ font: "500 10px var(--font-body)", fill: "var(--text-faint)" }}
          >
            {axisX[1]}
          </text>

          {/* y-axis end-labels, set vertically along the axis. */}
          <text
            x={PLOT_L - 8}
            y={PLOT_B}
            textAnchor="end"
            transform={`rotate(-90 ${PLOT_L - 8} ${PLOT_B})`}
            style={{ font: "500 10px var(--font-body)", fill: "var(--text-faint)" }}
          >
            {axisY[0]}
          </text>
          <text
            x={PLOT_L - 8}
            y={PLOT_T}
            textAnchor="start"
            transform={`rotate(-90 ${PLOT_L - 8} ${PLOT_T})`}
            style={{ font: "500 10px var(--font-body)", fill: "var(--text-faint)" }}
          >
            {axisY[1]}
          </text>

          {/* The trades: small etched dots. Those in the room read moss; the rest, ink. */}
          {dots.map((t, i) => {
            const cx = px(t.x);
            const cy = py(t.y);
            const room = inRoom(t);
            const isLabelled = labelledSet.has(t);
            return (
              <g key={`${t.name}-${i}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isLabelled ? 3.6 : 2.4}
                  fill={room ? "var(--accent-fill)" : "var(--surface-card)"}
                  stroke={room ? "var(--accent)" : "var(--ink-700)"}
                  strokeWidth="1"
                />
                {isLabelled ? (
                  <circle cx={cx} cy={cy} r="6.4" fill="none" stroke="var(--accent-fill)" strokeWidth="0.7" opacity={0.7} />
                ) : null}
              </g>
            );
          })}

          {/* The labelled example trades: name set beside the dot, kept in-frame. */}
          {labelled.map((t, i) => {
            const cx = px(t.x);
            const cy = py(t.y);
            // Place the label inward (toward the axis) so it never clips the edge.
            const toLeft = cx > PLOT_R - 70;
            const lx = toLeft ? cx - 9 : cx + 9;
            return (
              <text
                key={`lab-${t.name}-${i}`}
                x={lx}
                y={cy + 3}
                textAnchor={toLeft ? "end" : "start"}
                style={{
                  font: "600 10px var(--font-body)",
                  fill: "var(--accent)",
                }}
              >
                {t.name}
              </text>
            );
          })}
        </svg>

        {/* The honest not-held state, framed inside the quadrant. */}
        {empty ? (
          <div style={{ marginTop: "10px" }}>
            <SampleState
              glyph="bulb"
              what="Trade-level supply not held yet"
              reason="Dots appear once each trade's firm density is confirmed against local spending power."
            />
          </div>
        ) : null}
      </div>

      {/* The read line: plain-language guidance, no ranking across geographies. */}
      <p
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          fontSize: "12px",
          lineHeight: 1.5,
          color: "var(--text-muted)",
        }}
      >
        <span aria-hidden="true" style={{ flex: "0 0 auto", color: "var(--cocoa-500)", marginTop: "1px" }}>
          <Glyph name="scale" size={14} stroke={1.4} />
        </span>
        <span>
          {empty
            ? "The top-right corner is where money is present and few firms compete. Trades land here once their figures are held."
            : labelled.length > 0
              ? "Up and to the right is the room to move: money is present and few firms compete there."
              : "No trade sits clearly in the room here yet. The corner stays open as the figures fill in."}
        </span>
      </p>
    </div>
  );
}

export default OpportunityGap;
