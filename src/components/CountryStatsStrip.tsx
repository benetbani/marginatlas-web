/**
 * CountryStatsStrip — "Cost of doing business" strip.
 *
 * Country-page rebuild §2 (2026-05-25): replaced the corporate-form
 * tax overlay (Corporate income tax / Employer social rate / Owner
 * take vs pre-tax / Rate source) with four facts an SMB operator
 *
 * useless-tile-ok: JSDoc names the removed tile, not rendered
 * actually faces day to day:
 *
 *   1. Headline VAT/GST (the sales-tax cost on every customer order)
 *   2. Typical small-business tax (the local regime by name, e.g.
 *      Régime micro-entreprise, Simples Nacional, Forfettario)
 *   3. Time to launch (typical sole-trader days, from formation data)
 *   4. Inflation, last 12 months (year-over-year CPI)
 *
 * Per founder direction: "Corporate income tax" is the wrong frame
 * for most small businesses. Most SMBs are sole proprietors,
 * simplified-regime taxpayers, or pass-through entities. The
 * "Rate source" tile (Country-specific / Regional benchmark fallback)
 * is internal data-quality metadata and was removed entirely.
 *
 * useless-tile-ok: JSDoc names the removed tile and its values, not rendered
 *
 * Server component, no client JS.
 */

import { getSmbRegime, getVatRow } from "@/lib/tax/smb_effective_rates";
import { getCountryEconomicsSnapshot, fmtDays, fmtPct } from "@/lib/economics/country_metrics";
import { getGuidingWord, type Metric } from "@/lib/cities/guiding_word";
import { StatCard } from "@/components/ui/stat-card";

type Props = {
  iso2: string;
};

function fmtPctDecimal(decimal: number): string {
  // Decimal 0.22 -> "22%". Use no fraction for round percentages.
  const pct = decimal * 100;
  if (Math.abs(pct - Math.round(pct)) < 0.1) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

export function CountryStatsStrip({ iso2 }: Props) {
  const key = iso2.toUpperCase();
  const snap = getCountryEconomicsSnapshot(key);
  const regime = getSmbRegime(key);
  const vat = getVatRow(key);

  type Tile = {
    label: string;
    value: string;
    sub?: string;
    metric: Metric | null;
    rawForGuidingWord: number | null;
  };

  const tiles: Tile[] = [
    {
      label: vat?.local_name || "VAT / GST",
      value: vat ? fmtPctDecimal(vat.standard) : "-",
      sub: vat ? "Headline rate" : "Not yet measured",
      metric: null,
      rawForGuidingWord: null,
    },
    {
      label: "Typical SMB tax",
      value: regime ? fmtPctDecimal(regime.effective_rate) : "-",
      sub: regime?.local_name || "Standard rates apply",
      metric: null,
      rawForGuidingWord: null,
    },
    {
      label: "Time to launch",
      value: fmtDays(snap.daysToStart),
      sub: "Sole trader, typical",
      metric: "days_to_start",
      rawForGuidingWord: snap.daysToStart,
    },
    {
      label: "Inflation, 12 mo",
      value: fmtPct(snap.inflationPctYoy, 1),
      sub: "Year over year",
      metric: "inflation_pct_yoy",
      rawForGuidingWord: snap.inflationPctYoy,
    },
  ];

  return (
    <section className="py-6">
      <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-3">
        Cost of doing business
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map((t) => {
          const guiding =
            t.metric != null && t.rawForGuidingWord != null
              ? getGuidingWord(t.metric, t.rawForGuidingWord)
              : null;
          // Prefer guiding word when present; fall back to t.sub
          // (which carries the regime name or "headline rate" hint).
          const sub = guiding?.word || t.sub;
          const subColor = guiding?.color;
          return (
            <StatCard
              key={t.label}
              label={t.label}
              value={t.value}
              sub={sub}
              subColor={subColor}
              variant="soft"
              size="lg"
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-700/70 max-w-2xl">
        Headline rates only. Effective burden varies by sector, deductions,
        and revenue band. Open a cell page for the full after-tax breakdown.
      </p>
    </section>
  );
}
