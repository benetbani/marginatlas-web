/**
 * FirstYearTimeline , the city page's Full-width first-year chart, hand-rolled
 * page-locally to fix the two defects the single-band kit Timeline cannot express
 * (B8): node labels overprinting phase captions, and concurrent phases drawn as
 * overlapping opaque rects (Licensing painted over Fit-out from wk 4).
 *
 * Structure: node labels live in their OWN region ABOVE the axis (width-aware
 * greedy lane placement, three stalk heights, numbered-legend fallback), and
 * phases live BELOW the axis as thin TRANSLUCENT lanes , concurrent phases get
 * separate lanes, never stacked fills , with each caption set inside its band.
 * No label can touch a caption at any width because they occupy disjoint bands.
 * Server-safe: pure SVG, no hooks, no client directive. Mobile swaps to the
 * CSS-only vertical rail (same grammar as the kit Timeline).
 */
import * as React from "react";
import { Box, TERRA } from "@/components/spine/kit";

export type FYPhase = [label: string, from: number, to: number];
export type FYNode = { at: number; label: string; sub?: string; kind?: "breakeven" | "normal" };

const INK = "#1b1b1a";
const MUTED = "#8c8c8a";
const CAPTION = "#6f6f6d";
const TERRA_TEXT = "#c2410c";

export function FirstYearTimeline({ span, unit, phases = [], nodes, startLabel }: {
  span: number; unit: "week" | "day"; phases?: FYPhase[]; nodes: FYNode[]; startLabel?: string;
}) {
  if (!nodes || nodes.length === 0) return null;
  const W = 680, padL = 28, padR = 28, axisY = 100;
  const innerW = W - padL - padR;
  const safeSpan = span > 0 ? span : Math.max(1, ...nodes.map((n) => n.at));
  const X = (t: number) => padL + (Math.max(0, Math.min(safeSpan, t)) / safeSpan) * innerW;
  const uLabel = (t: number) => (unit === "week" ? `wk ${Math.round(t)}` : `day ${Math.round(t)}`);
  const sorted = [...nodes].sort((a, b) => a.at - b.at);

  /* ---- phases: greedy lane assignment (a phase takes the first lane whose last
   * band has ended), so overlapping-in-time phases land on separate lanes. ---- */
  const byStart = [...phases].sort((a, b) => a[1] - b[1]);
  const laneEnds: number[] = [];
  const phaseLanes = byStart.map((p) => {
    let lane = laneEnds.findIndex((end) => p[1] >= end);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(p[2]); } else { laneEnds[lane] = p[2]; }
    return { label: p[0], from: p[1], to: p[2], lane };
  });
  const laneCount = Math.max(1, laneEnds.length);
  const LANE_H = 16, LANE_GAP = 6, lanesTop = axisY + 10;
  const laneY = (lane: number) => lanesTop + lane * (LANE_H + LANE_GAP);
  const endpointY = lanesTop + laneCount * (LANE_H + LANE_GAP) + 8;
  const H = endpointY + 8;

  /* ---- nodes: width-aware greedy placement ABOVE the axis, three stalk heights;
   * whatever still cannot fit drops to a numbered legend. The break-even node is
   * always terracotta at its own height and never shares or drops. ---- */
  const STALKS = [22, 44, 66];
  const MIN_GAP = 10;
  const estW = (s: string) => Math.max(30, (s ? s.length : 0) * 5.6 + 8);
  const anchorFor = (x: number): "start" | "middle" | "end" => (x < padL + innerW * 0.16 ? "start" : x > padL + innerW * 0.84 ? "end" : "middle");
  const edgesOf = (x: number, w: number, a: "start" | "middle" | "end") => (a === "start" ? { l: x, r: x + w } : a === "end" ? { l: x - w, r: x } : { l: x - w / 2, r: x + w / 2 });
  type Placed = { n: FYNode; i: number; x: number; be: boolean; lane: number; anchor: "start" | "middle" | "end"; legend?: number };
  const placed: Placed[] = [];
  const lastRight: number[] = [];
  let legendCount = 0;
  sorted.forEach((n, i) => {
    const x = X(n.at);
    if (n.kind === "breakeven") { placed.push({ n, i, x, be: true, lane: 0, anchor: "middle" }); return; }
    const anchor = anchorFor(x);
    const e = edgesOf(x, estW(n.label), anchor);
    let done = false;
    for (let L = 0; L < STALKS.length; L++) {
      if (lastRight[L] === undefined || e.l >= lastRight[L] + MIN_GAP) {
        lastRight[L] = e.r;
        placed.push({ n, i, x, be: false, lane: L, anchor });
        done = true; break;
      }
    }
    if (!done) { legendCount += 1; placed.push({ n, i, x, be: false, lane: 0, anchor, legend: legendCount }); }
  });
  const legendItems = placed.filter((p) => p.legend);
  const capW = (s: string) => s.length * 5.2 + 6;

  return (
    <Box>
      {/* Desktop SVG , labels above the axis, phase lanes below: disjoint bands */}
      <svg className="hidden w-full sm:block" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="First-year timeline: milestones above the axis, build and trade phases in lanes below" preserveAspectRatio="xMidYMid meet">
        {/* phase lanes , translucent, one lane per concurrent phase, caption inside its band */}
        {phaseLanes.map((p, i) => {
          const x0 = X(p.from), x1 = X(p.to), bw = x1 - x0;
          const profit = /profit|break|surplus/i.test(p.label);
          const y = laneY(p.lane);
          const cap = p.label.toUpperCase();
          const centered = bw >= capW(cap) + 8;
          return (
            <g key={`ph-${i}`}>
              <rect x={x0 + 0.5} y={y} width={Math.max(0, bw - 1)} height={LANE_H} rx={3} fill={profit ? TERRA : MUTED} opacity={profit ? 0.15 : 0.16} />
              <text x={centered ? x0 + bw / 2 : x0 + 4} y={y + 11} textAnchor={centered ? "middle" : "start"} fill={profit ? TERRA_TEXT : CAPTION} fontSize={8} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>{cap}</text>
            </g>
          );
        })}
        {/* axis */}
        <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke="#d8d0cb" strokeWidth={1.5} />
        <text x={padL} y={endpointY} textAnchor="start" fill={MUTED} fontSize={9}>{startLabel || (unit === "week" ? "wk 0" : "day 0")}</text>
        <text x={W - padR} y={endpointY} textAnchor="end" fill={MUTED} fontSize={9}>{uLabel(safeSpan)}</text>
        {/* nodes , all label text lives strictly above the axis */}
        {placed.map((p) => {
          const { n, i, x, be } = p;
          if (be) {
            const topY = axisY - 50;
            return (
              <g key={`n-${i}`}>
                <line x1={x} y1={axisY} x2={x} y2={topY} stroke={TERRA} strokeWidth={1.5} />
                <circle cx={x} cy={topY} r={6} fill={TERRA} stroke="#fff" strokeWidth={2} />
                <circle cx={x} cy={topY} r={9} fill="none" stroke={TERRA} strokeWidth={1} opacity={0.45} />
                <text x={x} y={topY - 12} textAnchor="middle" fill={TERRA_TEXT} fontSize={11} fontWeight={600}>{n.label}</text>
                {n.sub ? <text x={x} y={topY - 24} textAnchor="middle" fill={MUTED} fontSize={9}>{n.sub}</text> : null}
              </g>
            );
          }
          if (p.legend) {
            return (
              <g key={`n-${i}`}>
                <line x1={x} y1={axisY} x2={x} y2={axisY - 12} stroke="#cfc8c3" strokeWidth={1} />
                <circle cx={x} cy={axisY - 12} r={7} fill="#fff" stroke={INK} strokeWidth={1} />
                <text x={x} y={axisY - 8.8} textAnchor="middle" fill={INK} fontSize={8.5} fontWeight={600}>{p.legend}</text>
              </g>
            );
          }
          const stalk = STALKS[p.lane] ?? 22;
          const ny = axisY - stalk;
          return (
            <g key={`n-${i}`}>
              <line x1={x} y1={axisY} x2={x} y2={ny} stroke="#cfc8c3" strokeWidth={1} />
              <circle cx={x} cy={ny} r={3.5} fill={INK} stroke="#fff" strokeWidth={1.5} />
              <text x={x} y={ny - 8} textAnchor={p.anchor} fill={INK} fontSize={10.5}>{n.label}</text>
              {n.sub ? <text x={x} y={ny - 20} textAnchor={p.anchor} fill={MUTED} fontSize={9}>{n.sub}</text> : null}
            </g>
          );
        })}
      </svg>

      {/* numbered legend for any label too crowded to sit on the axis */}
      {legendItems.length > 0 ? (
        <ol className="mt-2 hidden grid-cols-2 gap-x-6 gap-y-1 sm:grid">
          {legendItems.map((p) => (
            <li key={`lg-${p.i}`} className="flex items-baseline gap-2 text-[11px] text-[var(--c-ink2)]">
              <span className="fig shrink-0 text-[var(--c-muted)]">{p.legend}.</span>
              <span className="min-w-0">{p.n.label} <span className="text-[var(--c-muted)]">({uLabel(p.n.at)})</span></span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* Mobile vertical rail , CSS-only swap, no horizontal scroll */}
      <ol className="relative ml-1 space-y-3 border-l border-[var(--c-line-strong)] pl-4 sm:hidden">
        {sorted.map((n, i) => {
          const be = n.kind === "breakeven";
          return (
            <li key={`m-${i}`} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: be ? TERRA : INK, boxShadow: be ? "0 0 0 2px rgba(251,132,105,0.35)" : "0 0 0 1px #e7e2df" }} />
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-[12.5px] ${be ? "font-semibold text-[var(--terra-text)]" : "font-medium text-[var(--c-ink)]"}`}>{n.label}</span>
                <span className="fig shrink-0 text-[10.5px] text-[var(--c-muted)]">{uLabel(n.at)}</span>
              </div>
              {n.sub ? <div className="text-[11px] text-[var(--c-muted)]">{n.sub}</div> : null}
            </li>
          );
        })}
      </ol>
    </Box>
  );
}
