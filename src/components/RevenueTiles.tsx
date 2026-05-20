/**
 * Plan v13 Wave 2 — Bottom 10% / Typical / Top 10% revenue tiles.
 *
 * Three prominent tiles anyone can read at a glance. Big numbers,
 * calm typography, no dollar-axis ticks needed.
 *
 * Plan v15 Block 6 — labels normalized to "Bottom 10% / Typical / Top 10%"
 * (was "Bottom 20% / Typical (median) / Top 10%"). Anchors use p10 / p50 / p90.
 * "Typical" carries an inline ⓘ tooltip disclosing the median definition.
 */
import { formatMoney } from "@/lib/format/money";

type Props = {
  p10?: number | null;
  // Plan v15 Block 6: p20 kept in the type for back-compat with older callers,
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
  // Plan v13 Wave 4a (D2) — silent omission: no usable percentiles → render
  // nothing, not an "Earnings distribution not available" banner.
  if (p50 == null && p10 == null && p90 == null) {
    return null;
  }

  return (
    <section className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Where every business lands">
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
        iconTitle="Median — the middle value. Half the businesses earn less, half earn more."
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
  const bg = tone === "accent" ? "bg-cream-100 border-atlas-300" : "bg-cream-50 border-parchment";
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
