/**
 * Bottom 10% / Typical / Top 10% revenue tiles.
 *
 * Three prominent tiles anyone can read at a glance. Big numbers,
 * calm typography, no dollar-axis ticks needed.
 *
 * Labels normalized to "Bottom 10% / Typical / Top 10%"
 * (was "Bottom 20% / Typical (median) / Top 10%"). Anchors use p10 / p50 / p90.
 * "Typical" carries an inline ⓘ tooltip disclosing the median definition.
 */
import { formatMoney } from "@/lib/format/money";
import { paretoTail } from "@/lib/stats/pareto";

type Props = {
  p10?: number | null;
  // P20 kept in the type for back-compat with older callers,
  // but no longer rendered. p10 is the canonical low anchor.
  p20?: number | null;
  p50: number | null;
  p90: number | null;
  currencySymbol?: string;
};

export function RevenueTiles({
  p10,
  p50,
  p90,
  currencySymbol = "$",
}: Props) {
  // Silent omission: no usable percentiles → render
  // nothing, not an "Earnings distribution not available" banner.
  if (p50 == null && p10 == null && p90 == null) {
    return null;
  }

  // Pareto-tail extrapolation for top 1% / top 0.1%.
  // Only shown when both p50 and p90 are present and the fit yields α > 1
  // (finite-mean regime). Helper returns null otherwise — keeps casual
  // visitors away from numbers we can't stand behind.
  const tail = paretoTail(p50, p90);

  return (
    <section className="py-6" aria-label="Where every business lands">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile
          eyebrow="Bottom 10% earn"
          icon="▼"
          value={p10 ?? null}
          currencySymbol={currencySymbol}
          tone="muted"
        />
        <Tile
          eyebrow="Typical"
          icon="ⓘ"
          iconTitle="Median. The middle value: half the businesses earn less, half earn more."
          value={p50}
          currencySymbol={currencySymbol}
          tone="accent"
        />
        <Tile
          eyebrow="Top 10% earn"
          icon="▲"
          value={p90}
          currencySymbol={currencySymbol}
          tone="muted"
        />
      </div>
      {tail && (
        <div className="mt-4 rounded-lg border border-parchment bg-cream-50 px-4 py-3 md:px-5 md:py-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
          <span className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
            Modeled tail
          </span>
          <span className="text-ink-800">
            Top 1%:{" "}
            <span className="font-semibold text-ink-900 tabular-nums">
              {currencySymbol}
              {formatMoney(tail.p99)}
            </span>
          </span>
          <span className="text-ink-800">
            Top 0.1%:{" "}
            <span className="font-semibold text-ink-900 tabular-nums">
              {currencySymbol}
              {formatMoney(tail.p999)}
            </span>
          </span>
          <span
            className="text-xs text-ink-700/70"
            title={`Single-parameter Pareto fit on the p50/p90 anchors. Tail index α = ${tail.alpha.toFixed(2)}.`}
          >
            Pareto-fit estimate ⓘ
          </span>
        </div>
      )}
    </section>
  );
}

function Tile({
  eyebrow,
  icon,
  iconTitle,
  value,
  currencySymbol,
  tone,
}: {
  eyebrow: string;
  icon: string;
  iconTitle?: string;
  value: number | null;
  currencySymbol: string;
  tone: "muted" | "accent";
}) {
  // White-reset 2026-06-06: both tiles are white surfaces; the accent tile is
  // distinguished by its vermillion border + accent icon/text, not a cream fill.
  const bg = tone === "accent" ? "bg-white border-atlas-300" : "bg-white border-parchment";
  const txt = tone === "accent" ? "text-ink-900" : "text-ink-800";
  const iconColor = tone === "accent" ? "text-atlas-600" : "text-ink-500";
  return (
    <div className={`rounded-xl border ${bg} p-5 md:p-6`}>
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium flex items-center">
        <span aria-hidden="true" className={`text-xs mr-1 ${iconColor}`} title={iconTitle}>
          {icon}
        </span>
        {eyebrow}
      </div>
      <div className={`mt-1 text-3xl md:text-4xl font-semibold tabular-nums ${txt}`}>
        {value != null ? `${currencySymbol}${formatMoney(value)}` : "-"}
      </div>
    </div>
  );
}
