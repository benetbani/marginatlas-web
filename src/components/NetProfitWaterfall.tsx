/**
 * NetProfitWaterfall (Plan v10 Tracks TT + UU + ZZ).
 *
 * Single component that renders both the 13-row text breakdown AND the
 * horizontal stacked-bar visual. Reads the result of estimateNetProfit().
 *
 * Server component — pure SVG visual, no client JS.
 */
import { estimateNetProfit, type NetProfitWaterfall as Waterfall } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";

type Props = {
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  grossRevenue: number | null;
  payroll: number | null;
};

function fmtMoney(v: number): string {
  if (!isFinite(v) || isNaN(v)) return "-";
  const sign = v < 0 ? "−" : "";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
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

  return (
    <section className="card mt-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Net profit waterfall: typical firm
        </div>
        <div className="text-xs text-ink-700/60">
          Estimate · all figures annual USD
        </div>
      </div>

      {/* Visual bar (Track ZZ) */}
      <WaterfallBar w={w} />

      {/* Text breakdown (Track UU) */}
      <div className="mt-5 space-y-1 text-sm">
        <Row label="Gross revenue" value={fmtMoney(w.gross_revenue)} bold />
        <Row label={`− COGS (${fmtPct(1 - w.gross_profit / Math.max(w.gross_revenue, 1))})`} value={fmtMoney(-w.cogs)} muted />
        <Divider />
        <Row label="= Gross profit" value={fmtMoney(w.gross_profit)} />
        <Row label="− Estimated payroll" value={fmtMoney(-w.payroll)} muted />
        <Row label="− Employer social contributions" value={fmtMoney(-w.employer_social)} muted />
        <Divider />
        <Row label="= Operating profit (EBITDA proxy)" value={fmtMoney(w.operating_profit)} />
        <Row label="− Rent" value={fmtMoney(-w.fixed_costs.rent)} muted />
        <Row label="− Property tax" value={fmtMoney(-w.fixed_costs.property_tax)} muted />
        <Row label="− Insurance + licensing" value={fmtMoney(-w.fixed_costs.insurance)} muted />
        <Row label="− Utilities" value={fmtMoney(-w.fixed_costs.utilities)} muted />
        <Row label="− Software + subscriptions" value={fmtMoney(-w.fixed_costs.software)} muted />
        <Row label="− Other overhead (accounting, legal, filings)" value={fmtMoney(-w.fixed_costs.other_overhead)} muted />
        <Divider />
        <Row label="= Pre-tax profit" value={fmtMoney(w.pre_tax_profit)} />
        <Row label={`− Corporate income tax (${w.effective_cit_breakdown})`} value={fmtMoney(-w.corporate_income_tax)} muted />
        <div className="border-t border-atlas-300 mt-3 pt-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-ink-900">
            Net profit (owner take-home)
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-atlas-700">{fmtMoney(w.net_profit)}</div>
            <div className="text-[10px] text-ink-700/60 uppercase tracking-wide">
              {fmtPct(clampMargin(w.net_margin, "net"))} net margin
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-cream-100 border border-parchment p-3 text-xs text-ink-700/80 leading-relaxed">
        <strong className="text-ink-900">Estimate only: not financial or tax advice.</strong>{" "}
        COGS pulled from industry-typical gross margin. Payroll inferred
        from operating margin when not measured. Fixed costs from city /
        country commercial rent + commercial property tax + per-country
        operating-cost calibration. Corporate income tax uses combined
        federal + sub-regional rate where available. Actual figures vary
        materially by business model, scale, and execution.
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
  const segments: Array<{ label: string; value: number; color: string }> = [
    { label: "COGS", value: w.cogs, color: "#D5C4A1" },
    { label: "Payroll + social", value: w.payroll + w.employer_social, color: "#C19A6B" },
    { label: "Fixed costs", value: w.fixed_costs.total, color: "#A0826D" },
    { label: "Corporate tax", value: w.corporate_income_tax, color: "#7F5539" },
    { label: "Net profit", value: Math.max(w.net_profit, 0), color: "#C2410C" },
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
              className="relative group flex items-center justify-center text-xs font-medium text-white/90"
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
