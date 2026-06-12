/**
 * Decision wizard: /decide/[activity]/[city]
 *
 * Founder's "where should I open my pharmacy / pet shop" question made
 * concrete. Given an activity + a city, iterates through every
 * neighborhood with curated intensity data, ranks them by NET MARGIN
 * (revenue uplift minus rent drag), and surfaces the top 3 with a
 * rationale derived from the tag set.
 *
 * 2026-05-26 upgrade:
 *   - Ranks by net margin, not revenue. Times Square revenue uplift is
 *     real, but Times Square rent eats it. Net margin tells the
 *     truth.
 *   - Adds an activity selector so the user can swap industry without
 *     editing the URL.
 *   - Surfaces a "rev / rent / margin" three-number summary on every
 *     card so the operator can see what's actually driving the rank.
 *
 * Phase 2 of the commuter+tourism+anomaly-tag framework. See
 * docs/strategy/2026-05-25-COMMUTER-TOURISM-NEIGHBORHOOD-FRAMEWORK.md.
 *
 * Server component. revalidate 12h.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import neighborhoodsJson from "../../../../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../../../../data/cities/city_list_v1.json";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import {
  slugToIndustry,
  resolveToMeasuredIndustry,
  industryToSlug,
  INDUSTRIES,
  isExcludedFromDiscovery,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import {
  getNeighborhoodNetMargin,
  hasNeighborhoodIntensity,
  tagLabel,
  type NeighborhoodTag,
} from "@/lib/economics/neighborhood_multipliers";
import { INDUSTRY_BASELINES } from "@/lib/qa/industry_baselines";
import DecideActivitySelector from "@/components/DecideActivitySelector";
import { ProgressBar } from "@/components/ui/progress-bar";
import { colors } from "@/lib/design-tokens";

export const revalidate = 43200;

type Neighborhood = { slug: string; name: string; character: string; description?: string };
type City = { slug: string; name: string; iso2: string };

const NEIGHBORHOODS = (
  neighborhoodsJson as { cities: Record<string, { neighborhoods: Neighborhood[] }> }
).cities;
const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

/**
 * Get the baseline (city-level) net margin for an activity.
 * Falls back to the default 0.08 if nothing curated.
 */
function baselineNetMarginFor(activityId: string): number {
  const row = INDUSTRY_MARGINS.industries[activityId];
  if (row && typeof row.net_margin === "number") return row.net_margin;
  return INDUSTRY_MARGINS.default_fallback?.net_margin ?? 0.08;
}

/** Baseline rent occupancy share for an activity. Falls back to 0.08. */
function baselineRentShareFor(activityId: string): number {
  const row = INDUSTRY_BASELINES[activityId];
  if (row && typeof row.rent_occupancy === "number") return row.rent_occupancy;
  return 0.08;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ activity: string; city: string }>;
}): Promise<Metadata> {
  const { activity, city } = await params;
  const ind = slugToIndustry(activity);
  const cityRow = CITIES_BY_SLUG.get(city);
  if (!ind || !cityRow) return { title: "Decision not found | Margin Atlas" };
  return {
    title: `Where to open a ${ind.name.toLowerCase()} in ${cityRow.name} | Margin Atlas`,
    description: `Top neighborhoods ranked by expected net margin for a ${ind.name.toLowerCase()} in ${cityRow.name}.`,
  };
}

/**
 * Activity-aware rationale from the tag set.
 */
function rationaleFor(
  activityId: string,
  tags: NeighborhoodTag[],
): string {
  const active = tags.filter((t) => t !== "residential_only");
  if (active.length === 0) {
    return "Baseline residential market. Low rent, steady local demand.";
  }
  const primary = active[0];

  const isResidentialActivity = [
    "pet_stores",
    "pet_daycare",
    "pet_walking_sitting",
    "residential_cleaning",
    "childcare_daycare",
    "daycare_preschool",
    "dental_practices",
    "auto_repair_shops",
    "veterinary_pet_care",
  ].includes(activityId);

  if (isResidentialActivity) {
    if (active.includes("luxury_district")) {
      return "Premium pricing absorbs the rent. Wealthy local customers spend more on the category.";
    }
    if (active.includes("gentrifying_edge")) {
      return "Residential market growing, manageable rent, recurring local customer base.";
    }
    if (
      active.includes("financial_cbd") ||
      active.includes("tourist_zone") ||
      active.includes("transit_hub")
    ) {
      return "Wrong audience: pure commuter / tourist zone, no recurring residents. Rent kills the margin.";
    }
  }

  const byTag: Partial<Record<NeighborhoodTag, string>> = {
    financial_cbd: "Strong daytime worker base. B2B services + lunch trade dominate. Rent high but revenue follows.",
    tourist_zone: "Visitor footfall is real, but rent often eats the revenue uplift. Works only for impulse + premium.",
    luxury_district: "Premium pricing on the category absorbs the highest rent in the city.",
    free_economic_zone: "Special tax + customs regime attracts foreign business and premium retail.",
    university_district: "Student + faculty demand; price-sensitive on staples, lower rent than the CBD.",
    industrial_park: "Daytime worker demand; cheap rent; limited residential.",
    tech_corridor: "Young high-earner residents + offices; rent climbing but tolerated.",
    embassy_quarter: "Expat customer base + premium pricing tolerated.",
    medical_cluster: "Hospital workers + patient flow; pharmacy and quick food dominate.",
    transit_hub: "Massive footfall but rent extreme. Convenience and quick formats only.",
    gentrifying_edge: "Rising local incomes + lower rent than established zones. Sweet spot for first-movers.",
    nightlife_zone: "Bar + late-night food economy. Rent moderate; weekend peaks.",
    religious_pilgrimage: "Pilgrim-driven demand; religious goods and modest categories.",
  };
  return byTag[primary] || "Mixed local economy.";
}

// Build the activity selector options once at module load. Discovery-excluded
// (solo-professional or non-SMB) activities are hidden from the selector too.
const ACTIVITY_OPTIONS = INDUSTRIES.filter(
  (i) =>
    ((i.audience || "smb_friendly") === "smb_core" || (i.audience || "smb_friendly") === "smb_friendly") &&
    !isExcludedFromDiscovery(i),
)
  .map((i) => ({ value: industryToSlug(i.id), label: i.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default async function DecideWizard({
  params,
}: {
  params: Promise<{ activity: string; city: string }>;
}) {
  const { activity, city } = await params;
  const rawInd = slugToIndustry(activity);
  const ind = resolveToMeasuredIndustry(rawInd) || rawInd;
  if (!ind) notFound();

  const cityRow = CITIES_BY_SLUG.get(city);
  if (!cityRow) notFound();

  const scheme = NEIGHBORHOODS[city];
  if (!scheme) notFound();

  const baselineNetMargin = baselineNetMarginFor(ind.id);
  const baselineRentShare = baselineRentShareFor(ind.id);

  type Ranked = {
    neighborhood: Neighborhood;
    breakdown: ReturnType<typeof getNeighborhoodNetMargin>;
    isCurated: boolean;
  };

  const ranked: Ranked[] = scheme.neighborhoods
    .map((n) => ({
      neighborhood: n,
      breakdown: getNeighborhoodNetMargin(
        city,
        n.slug,
        ind.id,
        baselineNetMargin,
        baselineRentShare,
      ),
      isCurated: hasNeighborhoodIntensity(city, n.slug),
    }))
    // Sort: curated first, then by net margin descending (the actual
    // founder question: "where is profit highest").
    .sort((a, b) => {
      if (a.isCurated !== b.isCurated) return a.isCurated ? -1 : 1;
      return b.breakdown.neighborhoodNetMargin - a.breakdown.neighborhoodNetMargin;
    });

  const curatedCount = ranked.filter((r) => r.isCurated).length;
  const top3 = ranked.slice(0, 3);

  return (
    <article className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-cocoa-700/70 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span>/</span>
        <Link href={`/cities/${city}`} className="hover:text-atlas-700">
          <CountryFlag iso2={cityRow.iso2} className="w-4 inline-block align-middle mr-1" />
          {cityRow.name}
        </Link>
        <span>/</span>
        <span className="text-ink-900">Where to open</span>
      </nav>

      {/* Hero */}
      <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
        Decision wizard
      </div>
      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 leading-tight">
        Where to open a {ind.name.toLowerCase()} in {cityRow.name}
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-6 max-w-2xl leading-relaxed">
        Every neighborhood in {cityRow.name} ranked by expected NET
        MARGIN, not just revenue. Tourist + financial-CBD zones get
        revenue uplift but the rent often eats it.
      </p>

      {/* Activity selector. Lets the user try the same city for a different activity. */}
      <div className="mb-10">
        <DecideActivitySelector
          citySlug={city}
          currentActivity={industryToSlug(ind.id)}
          options={ACTIVITY_OPTIONS}
        />
      </div>

      {/* Empty state */}
      {curatedCount === 0 && ranked.length === 0 ? (
        <div className="atlas-card p-8 text-center">
          <h2 className="font-display text-xl text-ink-900 mb-2">
            {cityRow.name} not yet covered at neighborhood resolution
          </h2>
          <p className="text-sm text-cocoa-700/80 max-w-md mx-auto">
            Open the city page for the cell-level benchmark in the meantime.
          </p>
          <Link
            href={`/cities/${city}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-atlas-700 hover:text-atlas-900"
          >
            Open {cityRow.name} city page &rarr;
          </Link>
        </div>
      ) : (
        <>
          {/* Top 3 picks */}
          <section className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
              Top 3 by net margin
            </h2>
            {/* Max margin used to scale the per-card ProgressBar so the
                visual comparison is honest: a 12% bar next to an 18% bar
                actually looks 2/3 as long. */}
            {(() => {
              const maxMargin = Math.max(
                0.01,
                ...top3.map((r) => r.breakdown.neighborhoodNetMargin),
              );
              return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((r, idx) => {
                const b = r.breakdown;
                const marginPct = (b.neighborhoodNetMargin * 100).toFixed(1);
                const revPct = Math.round((b.revenueMultiplier - 1) * 100);
                const rentPct = Math.round((b.rentMultiplier - 1) * 100);
                const color =
                  b.neighborhoodNetMargin >= 0.15
                    ? colors.moss[900]
                    : b.neighborhoodNetMargin >= 0.08
                      ? colors.delta.positive
                      : b.neighborhoodNetMargin >= 0
                        ? colors.delta.caution
                        : colors.delta.negative;
                const tone =
                  b.neighborhoodNetMargin >= 0.15
                    ? "success"
                    : b.neighborhoodNetMargin >= 0.08
                      ? "success"
                      : b.neighborhoodNetMargin >= 0
                        ? "warning"
                        : "danger";
                const rationale = rationaleFor(ind.id, b.appliedTags);
                return (
                  <Link
                    key={r.neighborhood.slug}
                    href={`/${cityRow.iso2.toLowerCase()}/${city}/${r.neighborhood.slug}/${industryToSlug(ind.id)}`}
                    className="atlas-card p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-atlas-700 font-semibold">
                        #{idx + 1}
                      </div>
                      <div
                        className="font-display text-2xl font-semibold tabular-nums leading-none"
                        style={{ color }}
                      >
                        {marginPct}%
                      </div>
                    </div>
                    <ProgressBar
                      value={Math.max(0, b.neighborhoodNetMargin)}
                      max={maxMargin}
                      size="sm"
                      tone={tone}
                    />
                    <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">
                      {r.neighborhood.name}
                    </h3>
                    <p className="text-xs text-cocoa-700/80 leading-relaxed flex-1">
                      {rationale}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {b.appliedTags
                        .filter((t) => t !== "residential_only")
                        .slice(0, 3)
                        .map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5"
                          >
                            {tagLabel(t)}
                          </span>
                        ))}
                    </div>
                    <div className="text-[10px] text-cocoa-700/55 tabular-nums pt-1 border-t border-[rgba(76,39,18,0.06)]">
                      revenue {revPct >= 0 ? "+" : ""}
                      {revPct}% &middot; rent {rentPct >= 0 ? "+" : ""}
                      {rentPct}% &middot; net margin {marginPct}%
                    </div>
                  </Link>
                );
              })}
            </div>
              );
            })()}
          </section>

          {/* Full ranking table */}
          <section className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
              All neighborhoods ranked
            </h2>
            <div className="rounded-2xl bg-white border border-[rgba(76,39,18,0.10)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream-50">
                  <tr className="border-b border-[rgba(76,39,18,0.10)]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Neighborhood
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Tags
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Revenue
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Rent
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                      Net margin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((r) => {
                    const b = r.breakdown;
                    const marginPct = (b.neighborhoodNetMargin * 100).toFixed(1);
                    const revPct = Math.round((b.revenueMultiplier - 1) * 100);
                    const rentPct = Math.round((b.rentMultiplier - 1) * 100);
                    const color =
                      b.neighborhoodNetMargin >= 0.15
                        ? colors.moss[900]
                        : b.neighborhoodNetMargin >= 0.08
                          ? colors.delta.positive
                          : b.neighborhoodNetMargin >= 0
                            ? colors.delta.caution
                            : colors.delta.negative;
                    return (
                      <tr
                        key={r.neighborhood.slug}
                        className="border-t border-[rgba(76,39,18,0.06)]"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-ink-900">
                            {r.neighborhood.name}
                          </div>
                          {!r.isCurated && (
                            <div className="text-[10px] text-cocoa-700/55 mt-0.5">
                              heuristic estimate
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {b.appliedTags
                              .filter((t) => t !== "residential_only")
                              .slice(0, 3)
                              .map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5"
                                >
                                  {tagLabel(t)}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                          {revPct >= 0 ? "+" : ""}
                          {revPct}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                          {rentPct >= 0 ? "+" : ""}
                          {rentPct}%
                        </td>
                        <td
                          className="px-4 py-3 text-right font-display text-base font-semibold tabular-nums"
                          style={{ color }}
                        >
                          {marginPct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-cocoa-700/70 max-w-3xl">
              Baseline {ind.name.toLowerCase()} net margin: {(baselineNetMargin * 100).toFixed(1)}%
              of revenue (from the industry margin table). Baseline rent
              share: {(baselineRentShare * 100).toFixed(1)}% of revenue.
              Neighborhood net margin = baseline minus the additional
              rent drag at this neighborhood.
            </p>
          </section>

          {/* Methodology footnote */}
          <section className="text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
            The multiplier composes commuter intensity (daytime /
            resident pop), tourism intensity (visitors per resident),
            anomaly tags (financial CBD, luxury district, tech corridor,
            etc), and rent drag per tag. See{" "}
            <Link
              href="/methodology"
              className="text-atlas-700 font-medium hover:text-atlas-900 underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
            >
              How we measure
            </Link>{" "}
            for the math.
          </section>
        </>
      )}
    </article>
  );
}
