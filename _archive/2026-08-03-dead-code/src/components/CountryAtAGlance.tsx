/**
 * CountryAtAGlance - the dense 8-stat scorecard that sits directly under the
 * country page hero. Country-page rebuild (2026-06-15, founder spec): restored
 * the dropped scorecard and expanded it from five tiles to the eight facts a
 * person sizing up a small business in a country actually wants:
 *
 *   1. GDP per capita        (customer purchasing-power ceiling)
 *   2. Average salary        (employee cost AND customer affordability)
 *   3. Net wealth per adult  (customer savings depth)
 *   4. Days to start         (the first operational question)
 *   5. Ease of doing business(how friendly the setup is)
 *   6. Minimum wage          (the legal hire floor)
 *   7. Population             (market size)
 *   8. Cost of living        (how pricey it is to operate)
 *
 * Each tile shows the number plus a short one-word read on a quiet meaning
 * scale (the getGuidingWord pattern, neutral where there is no good/bad).
 *
 * DATA HONESTY (founder rule): every tile ALWAYS renders. A tile fills with the
 * real figure where it is held, and where the specific metric is NOT held it
 * renders a clearly-illustrative SAMPLE tile (muted styling + a small "sample"
 * tag), NEVER a fabricated real-looking figure. The profile-sourced metrics use
 * the page's held-detection pattern: a profile is real only when its own iso2
 * matches this country (getCountryProfile returns a generic fallback otherwise).
 *
 * Server component, no client JS. Tokens only, no raw hex / px / ms, no
 * em-dashes, no source-agency names.
 */

import {
  getCountryEconomicsSnapshot,
  getCountryCostOfLivingIndex,
} from "@/lib/economics/country_metrics";
import { getCountryProfile } from "@/lib/economic_profile";
import { getBrainPopulationByIso2 } from "@/lib/external/brain_data";
import { getGuidingWord, type Metric } from "@/lib/cities/guiding_word";
import type { TopIndustryRow } from "@/lib/cells";

type Props = {
  iso2: string;
  /**
   * Kept for backward compat with the country page's import shape; no longer
   * consumed since the rebuild dropped the "top sector" tiles.
   */
  topIndustries?: TopIndustryRow[];
};

/** A sample value shown ONLY on a muted, tagged tile so it is never mistaken
 *  for a held figure. Plausible illustration of the metric's shape. */
type Tile = {
  label: string;
  /** The real, held value. Null means the metric is not held for this country. */
  value: number | null;
  /** Pre-formatted display for the held value. */
  fmt: (n: number) => string;
  /** The guiding-word metric, or null for a tile with no meaning scale. */
  metric: Metric | null;
  /** A clearly-illustrative sample figure for the not-held (skeleton) tile. */
  sample: number;
};

/* ------------------------------ formatters ------------------------------ */

function fmtUsdShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}
function fmtUsdPlain(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return `$${Math.round(n)}`;
}
function fmtCount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${Math.round(n)}`;
}
function fmtDaysShort(n: number): string {
  const d = Math.round(n);
  if (d <= 1) return "1 day";
  if (d <= 21) return `${d} days`;
  if (d <= 60) return `${Math.round(d / 7)} wks`;
  return `${Math.round(d / 30)} mo`;
}
function fmtIndex(n: number): string {
  return `${Math.round(n)}`;
}

export function CountryAtAGlance({ iso2 }: Props) {
  const code = iso2.toUpperCase();
  const snap = getCountryEconomicsSnapshot(code);

  // Held-detection: a profile is real only when its own iso2 matches this
  // country (the loader returns a generic fallback for unheld countries). Only
  // then do we trust the profile's figures; otherwise the profile-sourced tiles
  // show the sample treatment rather than a fallback number passed off as real.
  const profile = getCountryProfile(code);
  const profileHeld = profile.iso2.toUpperCase() === code;

  const gdpPerCapita =
    profileHeld && profile.gdp_per_capita_usd_nominal > 0
      ? profile.gdp_per_capita_usd_nominal
      : snap.gdpPerCapita; // brain GDP is a held real figure where present
  const avgSalaryAnnual =
    profileHeld && profile.median_wage_full_time_usd > 0
      ? profile.median_wage_full_time_usd
      : null;
  const minWageAnnual =
    profileHeld && profile.minimum_wage_annual_usd > 0
      ? profile.minimum_wage_annual_usd
      : null;
  const easeOfDoingBusiness =
    profileHeld && profile.ease_of_doing_business_index > 0
      ? profile.ease_of_doing_business_index
      : null;

  const population = getBrainPopulationByIso2().get(code) ?? null;
  const costOfLiving = getCountryCostOfLivingIndex(code);

  const tiles: Tile[] = [
    {
      label: "GDP per capita",
      value: gdpPerCapita,
      fmt: fmtUsdShort,
      metric: "gdp_per_capita_usd_yr",
      sample: 32000,
    },
    {
      label: "Average salary",
      value: avgSalaryAnnual,
      fmt: fmtUsdPlain,
      metric: "avg_salary_usd_yr",
      sample: 31000,
    },
    {
      label: "Net wealth / adult",
      value: snap.netWealthPerAdult,
      fmt: fmtUsdShort,
      metric: "net_wealth_usd_adult",
      sample: 45000,
    },
    {
      label: "Days to start",
      value: snap.daysToStart,
      fmt: fmtDaysShort,
      metric: "days_to_start",
      sample: 9,
    },
    {
      label: "Ease of business",
      value: easeOfDoingBusiness,
      fmt: fmtIndex,
      metric: "ease_of_doing_business",
      sample: 74,
    },
    {
      label: "Minimum wage",
      value: minWageAnnual,
      fmt: fmtUsdPlain,
      metric: "min_wage_usd_yr",
      sample: 16000,
    },
    {
      label: "Population",
      value: population,
      fmt: fmtCount,
      metric: "country_population",
      sample: 38_000_000,
    },
    {
      label: "Cost of living",
      value: costOfLiving,
      fmt: fmtIndex,
      metric: "country_cost_of_living_index",
      sample: 62,
    },
  ];

  return (
    <section
      id="scorecard"
      aria-label="Country at a glance"
      className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((t) => {
          const held = t.value != null && Number.isFinite(t.value);
          const shown = held ? t.value! : t.sample;
          const guiding =
            t.metric != null ? getGuidingWord(t.metric, shown) : null;
          return (
            <div
              key={t.label}
              className={[
                "rounded-lg border px-4 py-3",
                held
                  ? "border-parchment bg-white"
                  : "border-dashed border-cream-400 bg-cream-100/60",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-ink-700/70">
                  {t.label}
                </div>
                {held ? null : (
                  <span className="inline-flex shrink-0 items-center rounded-full border border-cream-400 bg-cream-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cocoa-500">
                    sample
                  </span>
                )}
              </div>
              <div
                className={[
                  "mt-1 truncate font-display text-xl font-semibold tabular-nums leading-tight md:text-2xl",
                  held ? "text-ink-900" : "text-cocoa-500",
                ].join(" ")}
              >
                {t.fmt(shown)}
              </div>
              {guiding?.word ? (
                <div
                  className="mt-0.5 truncate text-[11px] font-medium"
                  style={held ? { color: guiding.color } : { color: undefined }}
                >
                  <span className={held ? undefined : "text-cocoa-500/70"}>
                    {held ? guiding.word : "illustrative only"}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
