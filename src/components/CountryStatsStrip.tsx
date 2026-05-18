/**
 * CountryStatsStrip — Track FF.2.
 *
 * Compact 4-tile block under the city shortcuts on every country page:
 *   - Corporate income tax rate
 *   - Employer social contribution rate
 *   - Effective owner-take percentage (1 - cit - employer_social)
 *   - "Tax rates verified" or "Fallback" label
 *
 * Pure server, no fetches — reads from country_rates_2024.json.
 */
import { getCountryTaxRates, hasCountrySpecificRates } from "@/lib/tax";

type Props = {
  iso2: string;
};

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export function CountryStatsStrip({ iso2 }: Props) {
  const rates = getCountryTaxRates(iso2);
  const verified = hasCountrySpecificRates(iso2);
  // Headline: of every $100 of pre-tax profit (already net of payroll), how
  // much hits the owner after CIT?
  const ownerTakePct = 1 - rates.cit;

  return (
    <section className="py-6">
      <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-3">
        Tax overlay
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile
          label="Corporate income tax"
          value={fmtPct(rates.cit)}
          accent
        />
        <Tile
          label="Employer social rate"
          value={fmtPct(rates.employer_social)}
        />
        <Tile
          label="Owner take vs pre-tax"
          value={fmtPct(ownerTakePct)}
        />
        <Tile
          label="Rate source"
          value={verified ? "Country-specific" : "OECD fallback"}
        />
      </div>
      <p className="mt-2 text-xs text-ink-700/70 max-w-2xl">
        Headline rates only — actual liability varies by deductions, regional
        surcharges, and business form. Cell pages show the full after-tax
        breakdown including owner take-home.
      </p>
    </section>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-cream-100 border border-parchment">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent ? "text-atlas-700" : "text-ink-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
