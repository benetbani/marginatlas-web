/**
 * PercentileStrip , editorial revenue distribution on a LINEAR axis (ADR 0002).
 *
 * Replaces the old flat gradient bar. Shows where firms land: a faint full
 * range (p10..p90), a bolder middle-half (p25..p75), and the typical (p50)
 * marked with the lone atlas accent. Tabular figures, no gridlines, no chrome.
 * Server-renderable SVG (no client JS).
 */
import * as React from "react";
import { scaleLinear } from "@visx/scale";

type Props = {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  /** Optional "you are here" value (the calculator marks the user's revenue). */
  you?: number | null;
  format: (n: number) => string;
};

export function PercentileStrip({ p10, p25, p50, p75, p90, you, format }: Props) {
  const W = 760;
  const H = 92;
  const padX = 64;
  const lo = Math.max(1, p10 * 0.85);
  const hi = p90 * 1.18;
  /* LINEAR, not logarithmic. ADR 0002, 2026-08-21: every percentile this site
     draws is a fixed multiple of the typical figure, so a log axis spaces
     constants evenly and makes a formula read as a measured distribution. */
  const x = scaleLinear({ domain: [lo, hi], range: [padX, W - padX] });
  const xp = (v: number) => x(Math.max(lo, Math.min(hi, v)));
  const trackY = 50;
  const trackH = 8;
  const r = trackH / 2;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Revenue distribution: bottom tenth ${format(p10)}, typical ${format(p50)}, top tenth ${format(p90)}`}
      >
        {/* full range p10..p90 */}
        <rect x={xp(p10)} y={trackY} width={xp(p90) - xp(p10)} height={trackH} rx={r} className="fill-paper-350" />
        {/* middle half p25..p75 */}
        <rect x={xp(p25)} y={trackY} width={xp(p75) - xp(p25)} height={trackH} rx={r} className="fill-atlas-200" />
        {/* typical marker */}
        <line x1={xp(p50)} x2={xp(p50)} y1={trackY - 12} y2={trackY + trackH + 12} className="stroke-atlas-500" strokeWidth={2.5} strokeLinecap="round" />
        {/* you marker (calculator) */}
        {you != null && (
          <g>
            <line x1={xp(you)} x2={xp(you)} y1={trackY - 12} y2={trackY + trackH + 12} className="stroke-ink-900" strokeWidth={2.5} strokeLinecap="round" />
            <text x={xp(you)} y={trackY + trackH + 28} textAnchor="middle" className="fill-ink-900 tabular-nums" fontSize="14" fontWeight={700}>{format(you)}</text>
            <text x={xp(you)} y={trackY - 18} textAnchor="middle" className="fill-ink-900" fontSize="11.5" fontWeight={700} letterSpacing="0.04em">YOU</text>
          </g>
        )}

        {/* endpoint labels */}
        <text x={xp(p10)} y={trackY - 16} textAnchor="middle" className="fill-ink-500" fontSize="11.5" letterSpacing="0.04em">BOTTOM 10%</text>
        <text x={xp(p10)} y={trackY + trackH + 26} textAnchor="middle" className="fill-ink-700 tabular-nums" fontSize="14" fontWeight={600}>{format(p10)}</text>

        <text x={xp(p90)} y={trackY - 16} textAnchor="middle" className="fill-ink-500" fontSize="11.5" letterSpacing="0.04em">TOP 10%</text>
        <text x={xp(p90)} y={trackY + trackH + 26} textAnchor="middle" className="fill-ink-700 tabular-nums" fontSize="14" fontWeight={600}>{format(p90)}</text>

        {/* typical label */}
        <text x={xp(p50)} y={trackY - 18} textAnchor="middle" className="fill-atlas-700" fontSize="11.5" fontWeight={600} letterSpacing="0.04em">TYPICAL</text>
        <text x={xp(p50)} y={trackY + trackH + 28} textAnchor="middle" className="fill-ink-900 tabular-nums" fontSize="17" fontWeight={700}>{format(p50)}</text>
      </svg>
    </figure>
  );
}
