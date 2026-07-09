/**
 * src/lib/scores/recommend.ts
 *
 * The async recommender orchestrator. Both directions fetch the real entity-scoped
 * row set (buildAcrossCities for places-for-trade, buildCityActivities for
 * trades-for-place), resolve each row's composite via recommend_core, rank by it,
 * and budget-filter. Presentation lives at the /decide route; this returns data.
 *
 * DEMAND resolution mirrors the live /cities/[slug] call site exactly (city record
 * from city_list_v1.json + the country economics snapshot -> buildCityScore ->
 * .components.demand), so the demand axis matches production.
 */

import { buildAcrossCities } from "@/lib/markets/across_cities";
import {
  buildCityActivities,
  buildCityScore,
  type CityActivityRow,
} from "@/lib/scores/city_board";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { slugToIndustry, industryToSlug } from "@/lib/taxonomy";
import cityListJson from "../../../data/cities/city_list_v1.json";
import {
  compositeForColumn,
  compositeForActivityRow,
  rankByComposite,
  filterByBudget,
} from "./recommend_core";
import {
  DEFAULT_COMPOSITE_WEIGHTS,
  type CompositeScore,
  type CompositeWeights,
} from "./composite";

type CityRecord = {
  slug: string;
  name: string;
  iso2: string;
  pop_m?: number;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  tourist_arrivals_m?: number;
};

const CITIES: CityRecord[] = (cityListJson as { cities: CityRecord[] }).cities;
const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export interface RecommendRow {
  id: string;
  name: string;
  href: string;
  keepPct: number | null;
  startupCostUsd: number | null;
  composite: CompositeScore | null;
}

export interface RecommendResult {
  direction: "places-for-trade" | "trades-for-place";
  subject: string;
  rows: RecommendRow[];
  weightsUsed: CompositeWeights;
  budgetUsd: number | null;
  omittedForBudget: number;
}

function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * The city's DEMAND sub-score (0..100) or null. Replays the live resolution:
 * the bundled city record + the country economics snapshot fed to buildCityScore,
 * reading .components.demand. Null-safe (buildCityScore is null when no demand leg).
 */
export function resolveCityDemand(citySlug: string, iso2: string): number | null {
  const city = CITY_BY_SLUG.get(citySlug);
  if (!city) return null;
  const econSnap = getCountryEconomicsSnapshot(iso2);
  const score = buildCityScore({
    city: {
      slug: city.slug,
      popM: city.pop_m ?? null,
      avgGrossSalaryUsdYear: city.avg_gross_salary_usd_year ?? null,
      costOfLivingIndex: city.cost_of_living_index ?? null,
      touristArrivalsM: city.tourist_arrivals_m ?? null,
    },
    econ: {
      selfEmploymentPct: econSnap.selfEmploymentPct,
      avgMonthlySalary: econSnap.avgMonthlySalary,
      netWealthPerAdult: econSnap.netWealthPerAdult,
    },
  });
  return score?.components.demand ?? null;
}

/** places-for-trade: rank the across-cities slate for one trade by composite. */
export async function rankPlacesForTrade(
  industryId: string,
  opts: { budgetUsd?: number | null; weights?: CompositeWeights } = {},
): Promise<RecommendResult | null> {
  const across = await buildAcrossCities(industryId);
  if (!across) return null;
  const weights = opts.weights ?? DEFAULT_COMPOSITE_WEIGHTS;

  const rows: RecommendRow[] = across.cities.map((col) => {
    // The curated CityRef slug travels on the column itself (added as a one-line
    // widening, mirroring the existing `country` field): it is the SAME key
    // city_list_v1.json uses, so this join can never miss on a href-derived
    // geo-slug drift. See CityColumn.slug's doc comment in across_cities.ts.
    const demand = resolveCityDemand(col.slug, col.country);
    const composite = compositeForColumn(col, demand, weights);
    return {
      id: col.slug,
      name: col.name,
      href: col.href,
      keepPct: col.netMarginFraction != null ? Math.round(col.netMarginFraction * 100) : null,
      startupCostUsd: col.startupCostUsd,
      composite,
    };
  });

  const { kept, omitted } = filterByBudget(rows, opts.budgetUsd ?? null);
  return {
    direction: "places-for-trade",
    subject: across.activityName,
    rows: rankByComposite(kept),
    weightsUsed: weights,
    budgetUsd: opts.budgetUsd ?? null,
    omittedForBudget: omitted,
  };
}

/** trades-for-place: rank one city's trade slate by composite (demand is constant per city). */
export async function rankTradesForPlace(
  citySlug: string,
  countryIso2: string,
  opts: { budgetUsd?: number | null; weights?: CompositeWeights } = {},
): Promise<RecommendResult | null> {
  const activities: CityActivityRow[] = await buildCityActivities({
    slug: citySlug,
    countryIso2,
  });
  if (activities.length === 0) return null;
  const weights = opts.weights ?? DEFAULT_COMPOSITE_WEIGHTS;
  const demand = resolveCityDemand(citySlug, countryIso2);
  const city = CITY_BY_SLUG.get(citySlug);

  const rows: RecommendRow[] = activities.map((row) => {
    const composite = compositeForActivityRow(row, demand, weights);
    return {
      id: row.slug,
      name: row.name,
      href: row.href,
      keepPct: isNum(row.netMarginPct) ? Math.round(row.netMarginPct) : null,
      startupCostUsd: row.startupCostUsd,
      composite,
    };
  });

  const { kept, omitted } = filterByBudget(rows, opts.budgetUsd ?? null);
  return {
    direction: "trades-for-place",
    subject: city?.name ?? citySlug,
    rows: rankByComposite(kept),
    weightsUsed: weights,
    budgetUsd: opts.budgetUsd ?? null,
    omittedForBudget: omitted,
  };
}

// slugToIndustry/industryToSlug are re-exported for the route layer to resolve a
// trade slug -> industryId before calling rankPlacesForTrade.
export { slugToIndustry, industryToSlug };
