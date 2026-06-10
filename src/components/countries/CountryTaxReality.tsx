/**
 * CountryTaxReality — the "what it takes to set up and run a business here"
 * panel, the decisive read on the country page (founder 2026-06-09: tax + setup
 * friction is the country page's most decisive read, so this block leads, right
 * after the verdict). It states the OWNER's real cost burden: the business tax
 * on profit, the cost and time to register, and the payroll tax on staff. Sales
 * tax is demoted to a single secondary line (customers carry it). No worked
 * example: a quiet link points down to a specific business for the after-tax math.
 *
 * Pure restatement of data the page already loads (the SMB regime, the employer
 * payroll rate, the typical registration cost + days). Invents no numbers and
 * runs no query. Self-omits when none of the figures exist. The full legal-tier
 * cost breakdown sits in BusinessFormationCosts directly below this block.
 *
 * Server component, no client JS. Tokens only, no em-dashes, no source agencies.
 */
import * as React from "react";
import type { SmbRegime, VatRow } from "@/lib/tax/smb_effective_rates";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface CountryTaxRealityProps {
  countryName: string;
  /** Headline sales-tax row (demoted to a secondary line), or null. */
  vat: VatRow | null;
  /** Typical small-business tax regime (the lead "business tax"), or null. */
  regime: SmbRegime | null;
  /** Typical days to register a sole trader, or null. */
  daysToRegister: number | null;
  /** Typical one-time government cost to register (USD), or null. */
  registrationCostUsd: number | null;
  /** Employer payroll / social-contribution rate as a decimal, or null. */
  payrollRate: number | null;
  /** The densest local activity name + its cell-page href, for the down-link. */
  topActivity: { name: string; href: string } | null;
  /** Currency-aware money formatter supplied by the page. */
  fmt: (n: number) => string;
}

function daysWord(days: number): string {
  const n = Math.round(days);
  return n === 1 ? "1 day" : `${n} days`;
}

function pctWord(decimal: number): string {
  const pct = decimal * 100;
  if (Math.abs(pct - Math.round(pct)) < 0.1) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

export function CountryTaxReality({
  countryName,
  vat,
  regime,
  daysToRegister,
  registrationCostUsd,
  payrollRate,
  topActivity,
  fmt,
}: CountryTaxRealityProps) {
  const hasDays = daysToRegister != null && daysToRegister > 0;
  const hasCost = registrationCostUsd != null && registrationCostUsd >= 0;
  const hasRegister = hasDays || hasCost;
  const hasPayroll = payrollRate != null && payrollRate > 0;
  // Self-omit when there is nothing real to say about setting up or running.
  if (!regime && !hasRegister && !hasPayroll && !vat) return null;

  return (
    <div>
      <SectionEyebrow className="mb-2">What it takes to set up and run a business here</SectionEyebrow>
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        Setting up and running a {countryName} business
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-graphite leading-relaxed">
        The charges that actually land on an owner: the tax on what the business
        earns, the cost and time to register, and the payroll tax on every
        employee. Together they shape the cash a small operator keeps.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {/* Business tax (the lead): the typical small-business regime. */}
        {regime ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Business tax
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {pctWord(regime.effective_rate)}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-atlas-700">{regime.local_name}</p>
            <p className="mt-2 text-sm text-graphite leading-relaxed">{regime.notes}</p>
          </div>
        ) : null}

        {/* Cost and time to register. */}
        {hasRegister ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Cost to register
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {hasCost
                  ? registrationCostUsd === 0
                    ? "Free"
                    : fmt(registrationCostUsd!)
                  : daysWord(daysToRegister!)}
              </span>
            </div>
            <p className="mt-2 text-sm text-graphite leading-relaxed">
              {hasCost && hasDays
                ? `The typical government fee to register a small business, and about ${daysWord(
                    daysToRegister!,
                  )} to be trading. Professional fees on top vary widely.`
                : hasCost
                  ? "The typical government fee to register a small business. Professional fees on top vary widely."
                  : `About ${daysWord(daysToRegister!)} to register a sole trader and start trading.`}
            </p>
          </div>
        ) : null}

        {/* Payroll tax on staff: the employer social-contribution rate. */}
        {hasPayroll ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Payroll tax on staff
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {pctWord(payrollRate!)}
              </span>
            </div>
            <p className="mt-2 text-sm text-graphite leading-relaxed">
              The employer social contribution added on top of gross wages for
              every employee. It sets the real cost of hiring beyond the salary.
            </p>
          </div>
        ) : null}
      </div>

      {/* Sales tax, demoted: customers carry it, so it is secondary. */}
      {vat && vat.standard > 0 ? (
        <p className="mt-4 max-w-2xl text-sm text-cocoa-700 leading-relaxed">
          Sales tax ({vat.local_name}) adds {pctWord(vat.standard)} on top of the
          price, but the customer carries it, so it is not the owner's burden.
        </p>
      ) : null}

      {/* No worked example: send the reader to a specific business for the math. */}
      {topActivity ? (
        <p className="mt-3 text-sm">
          <a
            href={topActivity.href}
            className="text-atlas-700 hover:text-atlas-900 font-medium"
          >
            See what a typical {topActivity.name.toLowerCase()} keeps after tax &rarr;
          </a>
        </p>
      ) : null}
    </div>
  );
}
