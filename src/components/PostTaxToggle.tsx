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
import { estimatePostTax } from "@/lib/tax";

type Props = {
  country: string;          // ISO-2
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

export function PostTaxToggle({ country, grossRevenue, payroll }: Props) {
  const [open, setOpen] = useState(false);
  const result = estimatePostTax(country, grossRevenue, payroll);
  if (!result) return null;

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
          <Row label="Estimated payroll" value={`− ${fmtMoney(result.payroll)}`} muted />
          <Row
            label={`Employer social contributions (${fmtPct(result.rates.employer_social)})`}
            value={`− ${fmtMoney(result.employer_social_cost)}`}
            muted
          />
          <div className="border-t border-cream-300 mt-2 pt-2">
            <Row
              label="Pre-tax profit"
              value={fmtMoney(result.pre_tax_profit)}
            />
          </div>
          <Row
            label={`Corporate income tax (${fmtPct(result.rates.cit)})`}
            value={`− ${fmtMoney(result.cit_owed)}`}
            muted
          />
          <div className="border-t border-atlas-300 mt-2 pt-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-cocoa-900">
              Owner take-home
            </div>
            <div className="text-lg font-bold text-atlas-700">
              {fmtMoney(result.owner_take)}
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-cream-100 border border-parchment p-3 text-xs text-ink-700/80 leading-relaxed">
            <strong className="text-cocoa-900">Planning estimate only — not tax advice.</strong>
            {" "}
            Country-level approximation. Actual liability varies by region,
            business form, deductions, incentives, and treaty positions.
            {!result.country_specific && (
              <>
                {" "}This country isn&apos;t in the rate table yet — figures use
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
