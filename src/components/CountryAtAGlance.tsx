/**
 * CountryAtAGlance — dense 5-stat row that sits directly under the
 * country page hero. Country-page rebuild §1 (2026-05-25): replaced
 * the old count-of-things tiles ("44 industries covered", "Cities
 *
 * useless-tile-ok: JSDoc names the removed tile, not rendered
 * ranked 0", "Median typical revenue", "Top SMB sector", "Owner take
 * after CIT") with five facts a person evaluating starting a small
 * business actually wants:
 *
 *   1. Nominal GDP per capita (customer purchasing-power ceiling)
 *   2. Average monthly salary (employee cost AND customer affordability)
 *   3. Net wealth per adult (customer savings depth)
 *   4. Self-employment share (competitive density of local SMB market)
 *   5. Days to start a business (first operational question)
 *
 * Each tile shows the number + a guiding word in the dark-red-to-
 * dark-green gradient (or neutral atlas-brown for size descriptors).
 * Data fields come from src/lib/economics/country_metrics.ts.
 *
 * Server component, no client JS.
 */

import Link from "next/link";
import {
  getCountryEconomicsSnapshot,
  fmtGdpPerCapita,
  fmtSalaryMonthly,
  fmtWealthPerAdult,
  fmtPct,
  fmtDays,
} from "@/lib/economics/country_metrics";
import { getGuidingWord, type Metric } from "@/lib/cities/guiding_word";
import type { TopIndustryRow } from "@/lib/cells";

type Props = {
  iso2: string;
  /**
   * Kept for backward compat with the country page's import shape;
   * no longer consumed since the §1 rebuild dropped the "top sector"
   * and "median typical revenue" tiles.
   */
  topIndustries?: TopIndustryRow[];
};

type Tile = {
  label: string;
  value: string;
  metric: Metric | null;
  rawForGuidingWord: number | null;
};

export function CountryAtAGlance({ iso2 }: Props) {
  const code = iso2.toUpperCase();
  const snap = getCountryEconomicsSnapshot(code);

  const tiles: Tile[] = [
    {
      label: "GDP per capita",
      value: fmtGdpPerCapita(snap.gdpPerCapita),
      metric: "gdp_per_capita_usd_yr",
      rawForGuidingWord: snap.gdpPerCapita,
    },
    {
      label: "Avg salary / mo",
      value: fmtSalaryMonthly(snap.avgMonthlySalary),
      metric: "gross_salary_usd_mo",
      rawForGuidingWord: snap.avgMonthlySalary,
    },
    {
      label: "Net wealth / adult",
      value: fmtWealthPerAdult(snap.netWealthPerAdult),
      metric: "net_wealth_usd_adult",
      rawForGuidingWord: snap.netWealthPerAdult,
    },
    {
      label: "Self-employed",
      value: fmtPct(snap.selfEmploymentPct),
      metric: "self_employment_pct",
      rawForGuidingWord: snap.selfEmploymentPct,
    },
    {
      label: "Days to start",
      value: fmtDays(snap.daysToStart),
      metric: "days_to_start",
      rawForGuidingWord: snap.daysToStart,
    },
  ];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {tiles.map((t) => {
          const guiding =
            t.metric != null && t.rawForGuidingWord != null
              ? getGuidingWord(t.metric, t.rawForGuidingWord)
              : null;
          return (
            <div
              key={t.label}
              className="atlas-card-band px-4 py-3"
            >
              <div className="text-[10px] uppercase tracking-wide text-ink-700/70 font-medium">
                {t.label}
              </div>
              <div className="mt-1 text-xl md:text-2xl font-semibold text-ink-900 tabular-nums leading-tight truncate">
                {t.value}
              </div>
              {guiding && guiding.word ? (
                <div
                  className="mt-0.5 text-[11px] font-medium truncate"
                  style={{ color: guiding.color }}
                >
                  {guiding.word}
                </div>
              ) : (
                <div className="mt-0.5 text-[11px] text-ink-700/40 truncate">
                  not yet measured
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-ink-700/60">
          Snapshot of the country page. Scroll for activities, cities, and regions.
        </span>
        <Link
          href={`/methodology`}
          className="text-atlas-700 hover:text-atlas-900 font-medium whitespace-nowrap"
        >
          How we measure →
        </Link>
      </div>
    </section>
  );
}
