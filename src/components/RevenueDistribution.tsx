/**
 * Plan v13 Wave 2 — log-normal distribution curve.
 *
 * Replaces the cluster-bar chart with a single smooth SVG curve.
 * Asymmetric (right-tailed) since real revenue distributions are
 * log-normal. Three vertical markers at p20 / p50 / p90 with subtle
 * labels. No grid, no axes — pure shape.
 *
 * Fits the curve from supplied percentiles using simple-statistics'
 * sample variance over the log-transformed observations (log-normal MLE).
 */
import { sampleVariance, mean } from "simple-statistics";
import { formatMoney } from "@/lib/format/money";

type Props = {
  p10?: number | null;
  p25?: number | null;
  p50: number | null;
  p75?: number | null;
  p90?: number | null;
  currencySymbol?: string;
};

export function RevenueDistribution({
  p10,
  p25,
  p50,
  p75,
  p90,
  currencySymbol = "$",
}: Props) {
  // Collect available percentile points
  const points: Array<{ q: number; v: number }> = [];
  if (p10 != null && p10 > 0) points.push({ q: 0.1, v: p10 });
  if (p25 != null && p25 > 0) points.push({ q: 0.25, v: p25 });
  if (p50 != null && p50 > 0) points.push({ q: 0.5, v: p50 });
  if (p75 != null && p75 > 0) points.push({ q: 0.75, v: p75 });
  if (p90 != null && p90 > 0) points.push({ q: 0.9, v: p90 });

  // Plan v13 Wave 4a (D2) — silent omission: insufficient percentile points
  // for a log-normal fit → render nothing, not a "Distribution shape not
  // estimable" banner.
  if (points.length < 2 || p50 == null) {
    return null;
  }

  // Log-normal MLE from percentiles: ln(v) is normally distributed
  const logVals = points.map((p) => Math.log(p.v));
  const mu = mean(logVals);
  const sigma2 = logVals.length > 1 ? sampleVariance(logVals) : 0.25;
  const sigma = Math.sqrt(Math.max(0.05, sigma2));

  // Generate the curve over [exp(mu - 3σ), exp(mu + 3σ)]
  const xMin = Math.exp(mu - 3 * sigma);
  const xMax = Math.exp(mu + 3 * sigma);
  const W = 600;
  const H = 180;
  const padX = 16;
  const padY = 12;

  const N = 80;
  const samples: Array<{ x: number; y: number }> = [];
  let yMax = 0;
  for (let i = 0; i <= N; i++) {
    const xVal = xMin + (xMax - xMin) * (i / N);
    if (xVal <= 0) continue;
    const lnX = Math.log(xVal);
    const yVal =
      (1 / (xVal * sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((lnX - mu) ** 2) / (2 * sigma * sigma));
    samples.push({ x: xVal, y: yVal });
    if (yVal > yMax) yMax = yVal;
  }

  // Project to SVG coords
  const sx = (v: number) => padX + ((v - xMin) / (xMax - xMin)) * (W - 2 * padX);
  const sy = (v: number) => H - padY - (v / yMax) * (H - 2 * padY);

  const linePath = samples
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
    .join(" ");
  const areaPath = `M${sx(samples[0].x).toFixed(1)},${(H - padY).toFixed(1)} ${samples
    .map((p) => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
    .join(" ")} L${sx(samples[samples.length - 1].x).toFixed(1)},${(H - padY).toFixed(1)} Z`;

  // p20 marker (interpolate if not supplied)
  const p20 = p10 != null && p50 != null ? p10 + (p50 - p10) * 0.4 : null;

  const markers: Array<{ x: number; label: string; sub: string }> = [];
  if (p20 != null) markers.push({ x: p20, label: "Bottom 20%", sub: `${currencySymbol}${formatMoney(p20)}` });
  markers.push({ x: p50, label: "Median", sub: `${currencySymbol}${formatMoney(p50)}` });
  if (p90 != null) markers.push({ x: p90, label: "Top 10%", sub: `${currencySymbol}${formatMoney(p90)}` });

  return (
    <section className="py-6" aria-label="Revenue distribution">
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: "180px" }}
        role="img"
        aria-label="Smooth distribution curve of revenue per firm"
      >
        <path d={areaPath} fill="#86C3B9" fillOpacity="0.35" />
        <path d={linePath} fill="none" stroke="#3A7268" strokeWidth="2" />
        {markers.map((m) => (
          <g key={m.label}>
            <line
              x1={sx(m.x)}
              x2={sx(m.x)}
              y1={padY}
              y2={H - padY}
              stroke="#3A7268"
              strokeWidth="1"
              strokeDasharray="2,3"
              opacity="0.5"
            />
            <text
              x={sx(m.x)}
              y={padY + 12}
              fontSize="10"
              fill="#3A7268"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="500"
            >
              {m.label}
            </text>
            <text
              x={sx(m.x)}
              y={H + 18}
              fontSize="10"
              fill="#3A3A3A"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {m.sub}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
