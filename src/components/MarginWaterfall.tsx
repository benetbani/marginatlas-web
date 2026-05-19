/**
 * Plan v13 Wave 2 — gross → operating → net margin visual.
 *
 * Horizontal stacked-segment bar that shows revenue flowing through
 * cost stages. Calm color, no 3D, percentages labeled.
 */
import { clampMargin } from "@/lib/finance/margin_floor";

type Props = {
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
};

export function MarginWaterfall({ grossMargin, operatingMargin, netMargin }: Props) {
  if (grossMargin == null && operatingMargin == null && netMargin == null) {
    return (
      <section className="py-6">
        <p className="text-sm text-ink-700/60 italic">Margin breakdown not available.</p>
      </section>
    );
  }

  const g = grossMargin != null ? clampMargin(grossMargin, "gross") : null;
  const o = operatingMargin != null ? clampMargin(operatingMargin, "operating") : null;
  const n = netMargin != null ? clampMargin(netMargin, "net") : null;

  return (
    <section className="py-6" aria-label="Profit waterfall">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium mb-3">
        Profit waterfall
      </div>
      <div className="flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {g != null && (
          <Segment label="Gross" pct={g} tone="bg-moss-200 text-ink-900" widthPct={100} />
        )}
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {o != null && g != null && (
          <Segment label="Operating" pct={o} tone="bg-moss-400 text-cream-50" widthPct={(o / g) * 100} />
        )}
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        {n != null && g != null && (
          <Segment label="Net" pct={n} tone="bg-moss-600 text-cream-50" widthPct={(n / g) * 100} />
        )}
      </div>
    </section>
  );
}

function Segment({
  label,
  pct,
  tone,
  widthPct,
}: {
  label: string;
  pct: number;
  tone: string;
  widthPct: number;
}) {
  return (
    <div
      className={`${tone} flex items-center justify-between px-3 text-xs font-medium`}
      style={{ width: `${widthPct}%` }}
    >
      <span>{label}</span>
      <span className="tabular-nums">{(pct * 100).toFixed(1)}%</span>
    </div>
  );
}
