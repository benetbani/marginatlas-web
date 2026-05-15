/**
 * TimeSeriesChart — pure-SVG sparkline of typical revenue per firm over time.
 *
 * Server-renderable. Zero dependencies. Designed for ~5–10 data points,
 * not for high-density charts. If fewer than 2 points exist, renders
 * nothing.
 */

type TimePoint = {
  year: number;
  revenue_per_firm: number | null;
  n_enterprises: number | null;
};

export type TimeSeriesChartProps = {
  data: TimePoint[];
  metric?: "revenue_per_firm" | "n_enterprises";
  height?: number;
  currencySymbol?: string;
  label?: string;
};

export function TimeSeriesChart({
  data,
  metric = "revenue_per_firm",
  height = 140,
  currencySymbol = "$",
  label,
}: TimeSeriesChartProps) {
  const pts = data
    .filter((d) => d[metric] != null && !isNaN(d[metric] as number))
    .map((d) => ({ year: d.year, v: d[metric] as number }));
  if (pts.length < 2) return null;

  const yearMin = pts[0].year;
  const yearMax = pts[pts.length - 1].year;
  const yearRange = Math.max(yearMax - yearMin, 1);

  const vMin = Math.min(...pts.map((p) => p.v));
  const vMax = Math.max(...pts.map((p) => p.v));
  const vRange = Math.max(vMax - vMin, 1);

  // viewBox is unitless; we scale on render via SVG itself.
  const W = 600;
  const H = height;
  const padL = 56;
  const padR = 16;
  const padT = 18;
  const padB = 28;

  const x = (year: number) => padL + ((year - yearMin) / yearRange) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - vMin) / vRange) * (H - padT - padB);

  // Line path
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p.v).toFixed(1)}`)
    .join(" ");

  // Area path (fill under curve)
  const areaPath =
    `M${x(pts[0].year).toFixed(1)},${(H - padB).toFixed(1)} ` +
    pts.map((p) => `L${x(p.year).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ") +
    ` L${x(pts[pts.length - 1].year).toFixed(1)},${(H - padB).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.5, 1].map((t) => vMin + t * vRange);

  // X-axis ticks: first, middle, last (or just first + last if only 2 points)
  const xTickIdx = pts.length <= 3 ? pts.map((_, i) => i) : [0, Math.floor(pts.length / 2), pts.length - 1];
  const xTicks = xTickIdx.map((i) => pts[i]);

  // Latest value annotation
  const last = pts[pts.length - 1];
  const first = pts[0];
  const pctChange = ((last.v - first.v) / first.v) * 100;

  return (
    <div className="card">
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">
          {label || (metric === "revenue_per_firm" ? "Typical revenue over time" : "Number of firms over time")}
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
            pctChange >= 0
              ? "bg-moss-100 text-moss-700"
              : "bg-clay-100 text-clay-700"
          }`}
        >
          {pctChange >= 0 ? "+" : ""}
          {pctChange.toFixed(1)}% · {yearMin}–{yearMax}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${H}px` }}
        role="img"
        aria-label={`Time series chart: ${metric} from ${yearMin} to ${yearMax}`}
      >
        <defs>
          <linearGradient id="ts-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#EEE6D2" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines + labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(v)}
              y2={y(v)}
              stroke="#E8DDC7"
              strokeWidth="1"
              strokeDasharray="2,3"
            />
            <text
              x={padL - 8}
              y={y(v) + 4}
              fontSize="10"
              fill="#78350F"
              textAnchor="end"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {metric === "revenue_per_firm"
                ? formatMoneyAxis(v, currencySymbol)
                : formatCount(v)}
            </text>
          </g>
        ))}

        {/* Area under curve */}
        <path d={areaPath} fill="url(#ts-fill)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#C2410C"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {pts.map((p) => (
          <circle
            key={p.year}
            cx={x(p.year)}
            cy={y(p.v)}
            r="3"
            fill="#C2410C"
            stroke="#FAFAF7"
            strokeWidth="1.5"
          />
        ))}

        {/* X-axis labels */}
        {xTicks.map((p) => (
          <text
            key={`xtick-${p.year}`}
            x={x(p.year)}
            y={H - 8}
            fontSize="10"
            fill="#78350F"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {p.year}
          </text>
        ))}

        {/* Latest value label */}
        <text
          x={x(last.year) + 6}
          y={y(last.v) - 8}
          fontSize="11"
          fill="#1A1A1A"
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          textAnchor="end"
        >
          {metric === "revenue_per_firm" ? formatMoneyAxis(last.v, currencySymbol) : formatCount(last.v)}
        </text>
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

function formatCount(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toFixed(0);
}
