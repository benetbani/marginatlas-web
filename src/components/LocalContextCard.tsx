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
 *
 * Visual upgrade §3 (2026-05-26): 4 hand-rolled stat tiles migrated to
 * the StatCard primitive so they match the rest of the site's stat
 * rhythm.
 */
import countryBaseline from "@/lib/cells/country_smb_baseline.json";
import { StatCard } from "@/components/ui/stat-card";

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
        <StatCard
          variant="card"
          size="lg"
          label="Median wage"
          value={fmtMoney(cb.payroll_per_employee_usd)}
          sub="per employee, per year"
        />
        <StatCard
          variant="card"
          size="lg"
          label="Price tier"
          value={`${cb.revenue_multiplier.toFixed(2)}x`}
          sub="vs global median"
        />
        <StatCard
          variant="card"
          size="lg"
          label="Currency"
          value={`${cb.currency} USD`}
          sub="displayed in dollars"
        />
        <StatCard
          variant="card"
          size="lg"
          label="Market type"
          value={
            <span className="text-base md:text-lg font-medium leading-tight normal-case tracking-normal">
              {tierLabel}
            </span>
          }
          sub={`for ${countryName || upper}`}
        />
      </div>
    </section>
  );
}
