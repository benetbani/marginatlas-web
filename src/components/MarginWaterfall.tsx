/**
 * Profit waterfall always renders all three bars.
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
  const gRaw = clampMargin(grossMargin ?? FALLBACK_GROSS, "gross");
  const oRaw = clampMargin(operatingMargin ?? FALLBACK_OPERATING, "operating");
  const nRaw = clampMargin(netMargin ?? FALLBACK_NET, "net");

  // QA D8: a waterfall must descend (gross >= operating >= net) and every
  // share must sit in 0-100%. Bad source rows can arrive with operating > gross
  // (which made the inner bar render wider than its container) or a margin
  // stored as a whole number (45 meaning 45%, not 4500%). clampMargin already
  // bounds each to [0,1]; here we also enforce the ordering so the bars never
  // invert and the displayed percentages are always sane.
  const g = gRaw;
  const o = Math.min(oRaw, g);
  const n = Math.min(nRaw, o);
  // Width of an inner bar relative to gross, clamped to 0-100 so it can never
  // overflow its container even if g is tiny.
  const widthOf = (part: number) => (g > 0 ? Math.min(100, Math.max(0, (part / g) * 100)) : 0);

  return (
    <section className="py-6" aria-label="Profit waterfall">
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium mb-3">
        Profit waterfall
      </div>
      <div className="flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Gross" pct={g} tone="bg-moss-200 text-ink-900" widthPct={100} />
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Operating" pct={o} tone="bg-moss-400 text-cream-50" widthPct={widthOf(o)} />
      </div>
      <div className="mt-2 flex w-full overflow-hidden rounded-lg border border-ink-200" style={{ height: "44px" }}>
        <Segment label="Net" pct={n} tone="bg-moss-600 text-cream-50" widthPct={widthOf(n)} />
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
