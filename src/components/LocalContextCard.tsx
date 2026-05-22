/**
 * Reformation idea #5 — local cost-of-living anchor card.
 *
 * Shows 4 quick stats per country that help readers interpret the
 * revenue numbers in context:
 *   - Median wage per employee (USD-eq)
 *   - Country tier multiplier vs global SMB median
 *   - Local currency symbol
 *   - One-line interpretation
 *
 * Source: data/.../country_smb_baseline.json — already used by the
 * synthesis engine, so we're surfacing the same numbers that drive
 * estimated cells. Server component, zero client cost.
 */
import countryBaseline from "@/lib/cells/country_smb_baseline.json";

type Baseline = {
  payroll_per_employee_usd: number;
  revenue_multiplier: number;
  currency: string;
};

const BASELINES = countryBaseline as unknown as {
  default_fallback: Baseline;
  countries: Record<string, Baseline>;
};

function fmtMoney(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

type Props = {
  /** ISO-2 country code (uppercase or lowercase). */
  iso2: string;
  /** Optional country display name; falls back to the iso2. */
  countryName?: string;
};

export function LocalContextCard({ iso2, countryName }: Props) {
  const upper = iso2.toUpperCase();
  const cb = BASELINES.countries[upper] || BASELINES.default_fallback;

  const tierLabel =
    cb.revenue_multiplier >= 1.5
      ? "high-cost / premium pricing"
      : cb.revenue_multiplier >= 1.0
        ? "developed market, mid-pricing"
        : cb.revenue_multiplier >= 0.5
          ? "emerging market, lower pricing"
          : "low-cost market";

  return (
    <section className="py-8 md:py-10">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Local context
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2 max-w-3xl">
        What numbers mean here
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Reference points for reading the revenue and payroll
        figures against the local economy.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="rounded-2xl border border-parchment bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-2">
            Median wage
          </div>
          <div className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 tabular-nums">
            {fmtMoney(cb.payroll_per_employee_usd)}
          </div>
          <div className="text-xs text-cocoa-700/70 mt-2">
            per employee, per year
          </div>
        </div>
        <div className="rounded-2xl border border-parchment bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-2">
            Price tier
          </div>
          <div className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 tabular-nums">
            {cb.revenue_multiplier.toFixed(2)}x
          </div>
          <div className="text-xs text-cocoa-700/70 mt-2">
            vs global median
          </div>
        </div>
        <div className="rounded-2xl border border-parchment bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-2">
            Currency
          </div>
          <div className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            {cb.currency} USD
          </div>
          <div className="text-xs text-cocoa-700/70 mt-2">
            displayed in dollars
          </div>
        </div>
        <div className="rounded-2xl border border-parchment bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-2">
            Market type
          </div>
          <div className="font-display text-base md:text-lg font-medium tracking-tight text-ink-900 leading-tight">
            {tierLabel}
          </div>
          <div className="text-xs text-cocoa-700/70 mt-2">
            for {countryName || upper}
          </div>
        </div>
      </div>
    </section>
  );
}
