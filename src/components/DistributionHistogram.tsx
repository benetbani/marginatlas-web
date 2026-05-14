/**
 * DistributionHistogram — approximate density chart derived from the 5 known
 * percentiles (p10/p25/p50/p75/p90).
 *
 * The shape is piecewise-uniform between adjacent percentiles, which is the
 * maximum-entropy estimate when no further information is available.
 * Compared to the 5-bar percentile chart this gives a much more intuitive
 * sense of where firms actually cluster.
 *
 * Server-renderable. Zero dependencies.
 */

type Props = {
  p10?: number | null;
  p25?: number | null;
  p50?: number | null;
  p75?: number | null;
  p90?: number | null;
  currencySymbol?: string;
  bins?: number; // resolution; default 24
};

export function DistributionHistogram({
  p10,
  p25,
  p50,
  p75,
  p90,
  currencySymbol = "$",
  bins = 24,
}: Props) {
  if (p10 == null || p25 == null || p50 == null || p75 == null || p90 == null) {
    return null;
  }

  // Anchor mass: cumulative probabilities at each percentile, plus
  // approximate min/max derived by mirroring the tail spreads.
  const tailBelow = Math.max((p25 - p10) * 0.6, 1);
  const tailAbove = Math.max((p90 - p75) * 0.6, 1);
  const pMin = Math.max(p10 - tailBelow, 0);
  const pMax = p90 + tailAbove;

  const anchors: { v: number; cum: number }[] = [
    { v: pMin, cum: 0 },
    { v: p10, cum: 0.10 },
    { v: p25, cum: 0.25 },
    { v: p50, cum: 0.50 },
    { v: p75, cum: 0.75 },
    { v: p90, cum: 0.90 },
    { v: pMax, cum: 1.0 },
  ];

  // Build piecewise-constant density f(v) and integrate over each of `bins`
  // equally-sized buckets in [pMin, pMax].
  const W = pMax - pMin;
  const binWidth = W / bins;
  const heights: number[] = new Array(bins).fill(0);
  for (let i = 0; i < bins; i++) {
    const a = pMin + i * binWidth;
    const b = a + binWidth;
    let mass = 0;
    // Integrate piecewise density across each anchor segment
    for (let k = 0; k < anchors.length - 1; k++) {
      const left = anchors[k];
      const right = anchors[k + 1];
      const segLow = left.v;
      const segHigh = right.v;
      if (segHigh <= a || segLow >= b) continue; // no overlap
      const overlap = Math.max(0, Math.min(b, segHigh) - Math.max(a, segLow));
      const segDensity = (right.cum - left.cum) / Math.max(segHigh - segLow, 1);
      mass += overlap * segDensity;
    }
    heights[i] = mass;
  }

  const maxH = Math.max(...heights);
  // viewBox dims
  const SVG_W = 720;
  const SVG_H = 200;
  const padL = 12;
  const padR = 12;
  const padT = 16;
  const padB = 32;
  const innerW = SVG_W - padL - padR;
  const innerH = SVG_H - padT - padB;
  const barGap = 1;
  const barW = innerW / bins - barGap;

  // Mark p10/p50/p90 on x-axis
  const markers: { v: number; label: string }[] = [
    { v: p10, label: "Bottom 10%" },
    { v: p50, label: "Typical" },
    { v: p90, label: "Top 10%" },
  ];

  function xAt(v: number): number {
    return padL + ((v - pMin) / Math.max(W, 1)) * innerW;
  }

  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-1">
        Where firms actually cluster
      </div>
      <div className="text-xs text-ink-700/60 mb-3">
        Estimated density across the revenue range. Marks show bottom 10%, typical, and top 10%.
      </div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${SVG_H}px` }}
        role="img"
        aria-label="Revenue distribution histogram"
      >
        <defs>
          <linearGradient id="hist-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Bars */}
        {heights.map((h, i) => {
          const x = padL + i * (innerW / bins) + barGap / 2;
          const barH = maxH > 0 ? (h / maxH) * innerH : 0;
          const y = padT + (innerH - barH);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill="url(#hist-fill)"
              rx="1.5"
            />
          );
        })}

        {/* Baseline */}
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          stroke="#E5E7EB"
          strokeWidth="1"
        />

        {/* Markers */}
        {markers.map((m) => (
          <g key={m.label}>
            <line
              x1={xAt(m.v)}
              x2={xAt(m.v)}
              y1={padT}
              y2={padT + innerH}
              stroke="#1A1A1A"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.55"
            />
            <text
              x={xAt(m.v)}
              y={SVG_H - 16}
              fontSize="10"
              fill="#1A1A1A"
              textAnchor="middle"
              fontWeight="500"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {m.label}
            </text>
            <text
              x={xAt(m.v)}
              y={SVG_H - 4}
              fontSize="10"
              fill="#64748B"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {formatMoneyAxis(m.v, currencySymbol)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function formatMoneyAxis(v: number, sym: string): string {
  if (v >= 1e9) return `${sym}${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${sym}${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${sym}${(v / 1e3).toFixed(0)}K`;
  return `${sym}${v.toFixed(0)}`;
}
