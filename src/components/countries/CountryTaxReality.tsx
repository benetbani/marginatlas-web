/**
 * CountryTaxReality — the "how the tax actually lands" panel for the
 * country page (bible Section 5, the friction-adjusted view; Section 6
 * module 10, tax/compliance burden, free-basic tier).
 *
 * Fills the registered `tax-overview` slot in the canonical country-page
 * skeleton (src/lib/page-layout/section-order COUNTRY_PAGE_SECTIONS),
 * which has been an empty slot since the Wave 4a stub was pulled. It is a
 * pure restatement of data the page already loads: the headline sales-tax
 * row (getVatRow) and the typical small-business regime (getSmbRegime).
 * It invents no numbers and runs no query.
 *
 * The one worked figure is an honest arithmetic restatement, not a model:
 * for the densest local activity's typical revenue, it shows the sales tax
 * the customer pays on top and the slice the small-business regime takes.
 * Framed as illustrative, not a benchmark, so it cannot read as fake
 * precision. The whole block self-omits (returns null) when neither the
 * sales-tax row nor the regime exists, so thin-coverage countries simply
 * do not render it.
 *
 * Alongside what the government takes, the panel also carries the "how hard
 * it is to set up" beat: the typical days to register a sole trader. This is
 * the single home for both the tax burden and the setup friction, so the
 * figure that used to repeat in the board climate card and the cost-of-doing-
 * business strip now lives here once. The setup card self-omits when the
 * days figure is absent, exactly like the rate cards.
 *
 * Server component, no client JS. All colour and type from tokens.
 *
 * Design system: application section. Consumes the tax domain
 * (src/lib/tax/smb_effective_rates). 2026-06-04.
 */
import * as React from "react";
import type { SmbRegime, VatRow } from "@/lib/tax/smb_effective_rates";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface CountryTaxRealityProps {
  countryName: string;
  /** Headline sales-tax row, or null when uncurated. */
  vat: VatRow | null;
  /** Typical small-business regime, or null when uncurated. */
  regime: SmbRegime | null;
  /** Densest local activity, if the top-industries query returned one. */
  topActivity: { name: string; typicalRevenue: number | null } | null;
  /**
   * Typical days to register a sole trader, or null when uncurated. The
   * "how hard it is to set up" signal, folded here from the former board
   * climate card and cost-of-doing-business strip so it lives once.
   */
  daysToRegister: number | null;
  /** Currency-aware money formatter supplied by the page. */
  fmt: (n: number) => string;
}

/** Round the days-to-register figure into a plain "N days" word. */
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
  topActivity,
  daysToRegister,
  fmt,
}: CountryTaxRealityProps) {
  // Self-omit when there is nothing real to say. The setup figure rides
  // alongside the tax read, so it can also carry the panel on its own.
  const hasSetup = daysToRegister != null && daysToRegister > 0;
  if (!vat && !regime && !hasSetup) return null;

  const revenue =
    topActivity && topActivity.typicalRevenue != null
      ? topActivity.typicalRevenue
      : null;

  // The single honest worked figure: pure arithmetic on the typical
  // revenue we already display, not a margin model. Only computed when
  // both a revenue and at least one rate exist.
  const salesTaxOnOrder =
    revenue != null && vat && vat.standard > 0 ? revenue * vat.standard : null;
  const smbTaxSlice =
    revenue != null && regime && regime.effective_rate > 0
      ? revenue * regime.effective_rate
      : null;

  return (
    <div>
      <SectionEyebrow className="mb-2">What the government takes, and how hard it is to set up</SectionEyebrow>
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        The tax that lands on a {countryName} small business
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-graphite leading-relaxed">
        Two charges shape the cash a small operator keeps: the sales tax the
        customer pays on every order, and the regime that taxes what the
        business earns. The time it takes to register sets how fast a new
        operator can start trading. Here is how each one reads locally.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {/* Sales tax */}
        {vat ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Sales tax on every order
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {pctWord(vat.standard)}
              </span>
            </div>
            <p className="mt-2 text-sm text-graphite leading-relaxed">
              The headline {vat.local_name} rate. It rides on top of the price,
              so the customer carries it, but it sets the gap between the sticker
              and what reaches the till.
            </p>
          </div>
        ) : null}

        {/* SMB regime */}
        {regime ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Typical small-business tax
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {pctWord(regime.effective_rate)}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-atlas-700">
              {regime.local_name}
            </p>
            <p className="mt-2 text-sm text-graphite leading-relaxed">
              {regime.notes}
            </p>
          </div>
        ) : null}

        {/* Time to set up: the registration-friction signal, folded here from
           the former board climate card and cost-of-doing-business strip. */}
        {hasSetup ? (
          <div className="atlas-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-medium text-ink-700/70">
                Time to register a business
              </span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                {daysWord(daysToRegister!)}
              </span>
            </div>
            <p className="mt-2 text-sm text-graphite leading-relaxed">
              The typical time to register a sole trader and start trading. It
              measures the paperwork drag at the front, not the running cost,
              so a short window means a new operator can open quickly.
            </p>
          </div>
        ) : null}
      </div>

      {/* One honest worked figure, tied to the densest activity. */}
      {topActivity && revenue != null && (salesTaxOnOrder != null || smbTaxSlice != null) ? (
        <p className="mt-4 max-w-2xl text-sm text-cocoa-700 leading-relaxed">
          To make it concrete: a typical {topActivity.name.toLowerCase()} here
          turns over about <strong className="text-ink-900">{fmt(revenue)}</strong> a
          year.
          {salesTaxOnOrder != null ? (
            <>
              {" "}
              At {pctWord(vat!.standard)}, the customer pays roughly{" "}
              <strong className="text-ink-900">{fmt(salesTaxOnOrder)}</strong> of
              sales tax on top of that.
            </>
          ) : null}
          {smbTaxSlice != null ? (
            <>
              {" "}
              The small-business regime then takes about{" "}
              <strong className="text-ink-900">{fmt(smbTaxSlice)}</strong> of what
              the business earns.
            </>
          ) : null}{" "}
          Treat these as round illustrations, not a filing. The real bill turns
          on the sector, the deductions, and the revenue band.
        </p>
      ) : (
        <p className="mt-4 max-w-2xl text-xs text-ink-700/70 leading-relaxed">
          Headline rates only. The effective burden moves with sector,
          deductions, and revenue band. Open a specific activity for the full
          after-tax breakdown.
        </p>
      )}
    </div>
  );
}
