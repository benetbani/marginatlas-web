/**
 * Plan v25 Block 4 — profit waterfall always renders all three bars.
 *
 * Earlier behavior: if Operating or Net margin was null the row
 * rendered as an empty bordered box ("partial fill" bug). The fix is
 * upstream — `fillMissingFields` in src/lib/cells/fill_defaults.ts
 * now populates gross_margin / operating_margin / net_margin with
 * industry defaults before the cell reaches the render layer. As a
 * defense-in-depth, this component ALSO falls back to safe defaults
 * (42% / 10% / 5%) if a caller still passes null, so the visual is
 * never broken.
 */
import { clampMargin } from "@/lib/finance/margin_floor";

type Props = {
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
};

const FALLBACK_GROSS = 0.42;
const FALLBACK_OPERATING = 0.1;
const FALLBACK_NET = 0.05;

export function MarginWaterfall({ grossMargin, operatingMargin, netMargin }: Props) {
  const g = clampMargin(grossMargin ?? FALLBACK_GROSS, "gross");
  const o = clampMargin(operatingMargin ?? FALLBACK_OPERATING, "operating");
  const n = clampMargin(netMargin ?? FALLBACK_NET, "net");

  return (
    <section className="py-6" aria-label="Profit waterfall">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium mb-3">
        Profit waterfall
      </div>
      <div className="flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Gross" pct={g} tone="bg-moss-200 text-ink-900" widthPct={100} />
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Operating" pct={o} tone="bg-moss-400 text-cream-50" widthPct={(o / g) * 100} />
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Net" pct={n} tone="bg-moss-600 text-cream-50" widthPct={(n / g) * 100} />
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
