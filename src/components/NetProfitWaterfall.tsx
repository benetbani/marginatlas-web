/**
 * NetProfitWaterfall (Plan v10 Tracks TT + UU + ZZ).
 *
 * Single component that renders both the 13-row text breakdown AND the
 * horizontal stacked-bar visual. Reads the result of estimateNetProfit().
 *
 * Server component — pure SVG visual, no client JS.
 */
import { estimateNetProfit, type NetProfitWaterfall as Waterfall } from "@/lib/finance/net_profit";
import { fmtMoney } from "@/lib/format/money";
import { colors } from "@/lib/design-tokens";

type Props = {
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  grossRevenue: number | null;
  payroll: number | null;
};

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

/**
 * Show the waterfall only when the actual computed
 * net profit is positive and finite. Suppress the negative-profit /
 * clamped-margin display that misled users on prior versions.
 */
function isWaterfallShowable(w: Waterfall): boolean {
  if (!isFinite(w.net_profit) || isNaN(w.net_profit)) return false;
  if (w.net_profit <= 0) return false;
  if (!isFinite(w.gross_revenue) || w.gross_revenue <= 0) return false;
  // Sanity: net margin can't be greater than 100% or below 0%.
  const trueMargin = w.net_profit / w.gross_revenue;
  if (trueMargin < 0 || trueMargin > 1) return false;
  // Sanity: every fixed-cost component must be finite.
  const fc = w.fixed_costs;
  for (const k of ["rent", "property_tax", "insurance", "utilities", "software", "other_overhead", "total"] as const) {
    const v = fc[k];
    if (!isFinite(v) || isNaN(v)) return false;
  }
  return true;
}

export function NetProfitWaterfall({
  iso2,
  geoId,
  industryId,
  sectorId,
  grossRevenue,
  payroll,
}: Props) {
  if (!grossRevenue || grossRevenue <= 0) return null;
  const w: Waterfall = estimateNetProfit({
    iso2,
    geoId,
    industryId,
    sectorId,
    grossRevenue,
    payroll,
  });

  // Refuse to render an inconsistent waterfall.
  // Founders saw cases like "−$34k net profit, 3% net margin" on Italian
  // coffee shops — internally the margin had been clamped but the profit
  // hadn't. The right answer is to suppress the section entirely with a
  // single honest line.
  if (!isWaterfallShowable(w)) {
    return (
      <section className="card mt-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
            Where does the money go?
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-800 leading-relaxed">
          Net profit is not currently estimable for this benchmark with sufficient
          confidence. Revenue, payroll, and headcount figures above are measured;
          fixed-cost calibration for this combination is being refreshed.
        </p>
      </section>
    );
  }

  const trueMargin = w.net_profit / Math.max(w.gross_revenue, 1);

  return (
    <section className="card mt-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Where does the money go?
        </div>
        <div className="text-xs text-ink-700/60">
          Estimate, annual USD
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-white border border-parchment p-3 text-xs text-ink-800 leading-relaxed">
        <strong className="text-ink-900">Estimate only, not financial or tax advice.</strong>{" "}
        Cost of goods is pulled from typical industry numbers. Pay is
        worked out from the typical labor share when it isn&apos;t measured
        directly. Rent, insurance, and utilities use city-and-country
        averages. Tax uses the combined national plus regional rate
        where we have it. Real numbers vary a lot by how the business
        is run.
      </div>

      {/* Visual bar */}
      <WaterfallBar w={w} />

      {/* Text breakdown */}
      <div className="mt-5 space-y-1 text-sm">
        <Row label="Gross revenue" value={fmtMoney(w.gross_revenue)} bold />
        <Row label={`Cost of goods sold (${fmtPct(1 - w.gross_profit / Math.max(w.gross_revenue, 1))})`} value={fmtMoney(-w.cogs)} muted />
        <Divider />
        <Row label="Gross profit" value={fmtMoney(w.gross_profit)} />
        <Row label="Estimated payroll" value={fmtMoney(-w.payroll)} muted />
        <Row label="Employer social contributions" value={fmtMoney(-w.employer_social)} muted />
        <Divider />
        <Row label="Profit before rent and taxes" value={fmtMoney(w.operating_profit)} />
        <Row label="Rent" value={fmtMoney(-w.fixed_costs.rent)} muted />
        <Row label="Property tax" value={fmtMoney(-w.fixed_costs.property_tax)} muted />
        <Row label="Insurance and licensing" value={fmtMoney(-w.fixed_costs.insurance)} muted />
        <Row label="Utilities" value={fmtMoney(-w.fixed_costs.utilities)} muted />
        <Row label="Software and subscriptions" value={fmtMoney(-w.fixed_costs.software)} muted />
        <Row label="Other overhead (accounting, legal, filings)" value={fmtMoney(-w.fixed_costs.other_overhead)} muted />
        <Divider />
        <Row label="Pre-tax profit" value={fmtMoney(w.pre_tax_profit)} />
        <Row label={`Corporate income tax (${w.effective_cit_breakdown})`} value={fmtMoney(-w.corporate_income_tax)} muted />
        <div className="border-t border-atlas-300 mt-3 pt-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-ink-900">
            Net profit (owner take-home)
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-atlas-700">{fmtMoney(w.net_profit)}</div>
            <div className="text-[10px] text-ink-700/60 uppercase tracking-wide">
              {fmtPct(trueMargin)} net margin
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-ink-700/70" : "text-ink-900"}`}>
      <div className={`text-sm ${bold ? "font-semibold" : ""}`}>{label}</div>
      <div className={`text-sm tabular-nums ${bold ? "font-semibold" : "font-medium"}`}>{value}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-cream-300 my-1.5" />;
}

function WaterfallBar({ w }: { w: Waterfall }) {
  // Color jobs (design-system 3.2): cocoa/ink ladder carries the cost
  // structure; the kept row is the one moss moment on the bar.
  const segments: Array<{ label: string; value: number; color: string }> = [
    { label: "Cost of goods", value: w.cogs, color: colors.cocoa[300] },
    { label: "Pay + employer taxes", value: w.payroll + w.employer_social, color: colors.cocoa[500] },
    { label: "Rent, insurance, other", value: w.fixed_costs.total, color: colors.ink[600] },
    { label: "Tax", value: w.corporate_income_tax, color: colors.cocoa[700] },
    { label: "Profit kept", value: Math.max(w.net_profit, 0), color: colors.moss[600] },
  ];
  const totalPositive = segments.reduce((s, x) => s + Math.max(x.value, 0), 0);
  if (totalPositive <= 0) return null;
  const widthFor = (v: number) => `${(Math.max(v, 0) / totalPositive) * 100}%`;

  return (
    <div className="mt-4">
      <div className="flex h-10 rounded-lg overflow-hidden border border-parchment">
        {segments.map((s, i) => {
          const w = widthFor(s.value);
          if (parseFloat(w) < 0.5) return null;
          return (
            <div
              key={i}
              style={{ width: w, backgroundColor: s.color }}
              className="relative group flex items-center justify-center text-xs font-medium text-cream-50/90"
              title={`${s.label}: ${s.value.toLocaleString()}`}
            >
              {parseFloat(w) > 8 ? s.label : null}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-ink-700/70">
        {segments.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
