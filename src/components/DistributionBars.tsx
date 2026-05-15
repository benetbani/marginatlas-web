import { Tooltip } from "./Tooltip";

type Props = {
  p10?: number | null;
  p25?: number | null;
  p50?: number | null;
  p75?: number | null;
  p90?: number | null;
  currencySymbol?: string;
};

function formatMoney(v: number | null | undefined, currency = "$"): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `${currency}${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${currency}${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${currency}${(v / 1e3).toFixed(0)}K`;
  return `${currency}${v.toFixed(0)}`;
}

/**
 * DistributionBars — visualizes the per-firm revenue spread without using
 * jargon like "percentile". Renders 3 named tiers stacked vertically with
 * a width proportional to value.
 */
export function DistributionBars({ p10, p25, p50, p75, p90, currencySymbol = "$" }: Props) {
  const values = [
    { label: "Smallest 10%",       v: p10, tone: "bg-atlas-200" },
    { label: "Quarter mark",       v: p25, tone: "bg-atlas-300" },
    { label: "Typical (middle)",   v: p50, tone: "bg-atlas-500" },
    { label: "Three-quarter mark", v: p75, tone: "bg-atlas-700" },
    { label: "Biggest 10%",        v: p90, tone: "bg-atlas-800" },
  ];
  const max = Math.max(...values.map((d) => d.v || 0));
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-3 flex items-center">
        Yearly revenue per firm — the spread
        <Tooltip text="What the smallest, typical, and biggest firms in this category actually bring in. The 'typical' value is the middle of the pack: half make more, half make less." />
      </div>
      <div className="space-y-2.5">
        {values.map((d) => {
          const pct = max > 0 && d.v ? Math.max(8, (d.v / max) * 100) : 0;
          return (
            <div key={d.label} className="flex items-center gap-3">
              <div className="w-32 text-xs text-ink-700/80 shrink-0">{d.label}</div>
              <div className="flex-1 h-7 bg-cream-200 rounded overflow-hidden">
                <div
                  className={`h-full ${d.tone}`}
                  style={{ width: `${pct}%`, transition: "width 0.4s ease" }}
                />
              </div>
              <div className="w-24 text-sm font-medium text-ink-900 text-right">
                {formatMoney(d.v, currencySymbol)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
