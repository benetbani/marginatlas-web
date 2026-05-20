/**
 * PostTaxToggle — optional after-tax view on a cell page (Track P Phase P.2).
 *
 * Free for everyone (country-level approximation, per founder decision
 * 2026-05-18 Option C). Regional refinement is Pro-only in a future Phase P.3.
 *
 * Shows owner take-home after estimated corporate tax + employer social
 * contributions. Disclaimer banner clarifies "not tax advice".
 */

"use client";

import { useState } from "react";
import { estimatePostTax, getEffectiveCorporateTaxRate } from "@/lib/tax";

type Props = {
  country: string;          // ISO-2
  regionId?: string | null; // sub-region id (state, Land, canton, etc.)
  grossRevenue: number | null;
  payroll: number | null;   // total payroll for the typical firm (USD/year)
};

function fmtMoney(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export function PostTaxToggle({ country, regionId, grossRevenue, payroll }: Props) {
  const [open, setOpen] = useState(false);
  const result = estimatePostTax(country, grossRevenue, payroll);
  if (!result) return null;

  // Plan v10 SS — combined CIT for sub-regional cells (Munich Hebesatz,
  // California state CIT, Zug canton, etc.). Falls back to country rate.
  const effective = getEffectiveCorporateTaxRate(country, regionId);
  // Apply the sub-regional rate when it differs from country base
  let effectiveCitOwed = result.cit_owed;
  let effectiveOwnerTake = result.owner_take;
  if (effective.subregional && effective.rate !== result.rates.cit) {
    effectiveCitOwed = result.pre_tax_profit > 0
      ? result.pre_tax_profit * effective.rate
      : 0;
    effectiveOwnerTake = result.pre_tax_profit - effectiveCitOwed;
  }

  // CC.5: distinguish "no payroll data" from "payroll is genuinely $0" so
  // we can hide the misleading "Payroll: $0" + employer social row.
  const payrollMissing = payroll === null || payroll === undefined;

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium">
            Owner take-home estimate
          </div>
          <div className="text-sm text-ink-700/60 mt-0.5">
            After estimated corporate tax and employer social contributions.
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1.5 rounded-lg border border-atlas-300 hover:border-atlas-600 hover:bg-atlas-50 text-sm font-medium text-atlas-700 transition"
          aria-expanded={open}
        >
          {open ? "Hide after-tax breakdown" : "Show after-tax breakdown →"}
        </button>
      </div>

      {open && (
        <div className="mt-5 space-y-1.5 text-sm">
          <Row label="Gross revenue" value={fmtMoney(result.gross_revenue)} />
          {/* Plan v13 Wave 4a (D2): silent omission: when payroll is missing,
             quietly drop the payroll + employer-social rows. The take-home
             calculation still runs (treating payroll as zero) so the user
             sees a number, just an upper-bound one. No banner. */}
          {!payrollMissing && (
            <>
              <Row label="Estimated payroll" value={`− ${fmtMoney(result.payroll)}`} muted />
              <Row
                label={`Employer social contributions (${fmtPct(result.rates.employer_social)})`}
                value={`− ${fmtMoney(result.employer_social_cost)}`}
                muted
              />
            </>
          )}
          <div className="border-t border-cream-300 mt-2 pt-2">
            <Row
              label="Pre-tax profit"
              value={fmtMoney(result.pre_tax_profit)}
            />
          </div>
          <Row
            label={`Corporate income tax (${effective.breakdown})`}
            value={`− ${fmtMoney(effectiveCitOwed)}`}
            muted
          />
          <div className="border-t border-atlas-300 mt-2 pt-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-ink-900">
              Owner take-home
            </div>
            <div className="text-lg font-bold text-atlas-700">
              {fmtMoney(effectiveOwnerTake)}
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-cream-100 border border-parchment p-3 text-xs text-ink-800 leading-relaxed">
            <strong className="text-ink-900">Planning estimate only: not tax advice.</strong>
            {" "}
            Country-level approximation. Actual liability varies by region,
            business form, deductions, incentives, and treaty positions.
            {!result.country_specific && (
              <>
                {" "}This country isn&apos;t in the rate table yet: figures use
                a conservative OECD-average fallback.
              </>
            )}
            {" "}State / canton / Land-level refinement is a Pro feature
            (Track P Phase P.3).
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-ink-700/70" : "text-ink-900"}`}>
      <div className="text-sm">{label}</div>
      <div className="text-sm font-medium tabular-nums">{value}</div>
    </div>
  );
}
