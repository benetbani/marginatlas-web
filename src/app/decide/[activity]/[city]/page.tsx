/**
 * Decision wizard: /decide/[activity]/[city]
 *
 * Founder's "where should I open my pharmacy / pet shop" question made
 * concrete. Given an activity + a city, iterates through every
 * neighborhood with curated intensity data, ranks them by the
 * neighborhood revenue multiplier, and surfaces the top 3 with a
 * rationale derived from the tag set.
 *
 * Phase 2 of the commuter+tourism+anomaly-tag framework. See
 * docs/strategy/2026-05-25-COMMUTER-TOURISM-NEIGHBORHOOD-FRAMEWORK.md.
 *
 * Server component. No client JS. revalidate 12h.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import neighborhoodsJson from "../../../../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../../../../data/cities/city_list_v1.json";
import {
  slugToIndustry,
  resolveToMeasuredIndustry,
  industryToSlug,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import {
  getNeighborhoodMultiplier,
  hasNeighborhoodIntensity,
  tagLabel,
  type NeighborhoodTag,
} from "@/lib/economics/neighborhood_multipliers";

export const revalidate = 43200;

type Neighborhood = { slug: string; name: string; character: string; description?: string };
type City = { slug: string; name: string; iso2: string };

const NEIGHBORHOODS = (
  neighborhoodsJson as { cities: Record<string, { neighborhoods: Neighborhood[] }> }
).cities;
const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

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
    description: `Top neighborhoods ranked by expected revenue uplift for a ${ind.name.toLowerCase()} in ${cityRow.name}.`,
  };
}

/**
 * Generate a one-line rationale from the tag set for an activity.
 * The rationale answers "why is this neighborhood good (or bad) for X?"
 */
function rationaleFor(
  activityId: string,
  tags: NeighborhoodTag[],
  multiplier: number,
): string {
  if (tags.length === 0 || tags.every((t) => t === "residential_only")) {
    if (multiplier >= 1.1) {
      return "Residential demand carries it; low rent helps.";
    }
    return "Baseline residential market.";
  }

  const active = tags.filter((t) => t !== "residential_only");
  const primary = active[0];

  // Pet shop, pet daycare, residential cleaning, childcare etc.
  const isResidentialActivity = [
    "pet_stores",
    "pet_daycare",
    "pet_walking_sitting",
    "residential_cleaning",
    "childcare_daycare",
    "daycare_preschool",
    "dental_practices",
    "auto_repair_shops",
  ].includes(activityId);

  if (isResidentialActivity) {
    if (active.includes("luxury_district")) {
      return "Premium pricing absorbs higher rent. Wealthy local customers spend more on the category.";
    }
    if (active.includes("gentrifying_edge")) {
      return "Residential market growing, lower rent than the CBD, recurring local customer base.";
    }
    if (
      active.includes("financial_cbd") ||
      active.includes("tourist_zone") ||
      active.includes("transit_hub")
    ) {
      return "Wrong audience: pure commuter / tourist zone, no recurring residents. Avoid.";
    }
  }

  // Activity-agnostic rationales by primary tag.
  const byTag: Partial<Record<NeighborhoodTag, string>> = {
    financial_cbd: "Strong daytime worker base. B2B services + lunch trade dominate.",
    tourist_zone: "High visitor footfall; impulse + premium spend; weekend evening peaks.",
    luxury_district: "Premium-priced category; high-net-worth local customer base.",
    free_economic_zone: "Special tax + customs regime attracts foreign business and premium retail.",
    university_district: "Student + faculty demand; price-sensitive on staples, premium on experiences.",
    industrial_park: "Daytime worker demand; minimal residential.",
    tech_corridor: "Young high-earner residents + offices; strong demand for premium services.",
    embassy_quarter: "International expat customer base; premium pricing tolerated.",
    medical_cluster: "Hospital workers + patient flow; pharmacy and quick-service food dominate.",
    transit_hub: "Massive transit footfall; convenience and quick formats win.",
    gentrifying_edge: "Rising local incomes, room for new concepts, lower rent than established zones.",
    nightlife_zone: "Bar + late-night food + Uber-out economy; weekend peaks.",
    religious_pilgrimage: "Pilgrim-driven demand; religious goods and modest categories spike.",
  };

  return byTag[primary] || "Mixed local economy.";
}

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

  // Compute multiplier for every neighborhood that has curated intensity data.
  type Ranked = {
    neighborhood: Neighborhood;
    multiplier: ReturnType<typeof getNeighborhoodMultiplier>;
    isCurated: boolean;
  };

  const ranked: Ranked[] = scheme.neighborhoods
    .map((n) => ({
      neighborhood: n,
      multiplier: getNeighborhoodMultiplier(city, n.slug, ind.id),
      isCurated: hasNeighborhoodIntensity(city, n.slug),
    }))
    // Sort: curated first, then by multiplier descending.
    .sort((a, b) => {
      if (a.isCurated !== b.isCurated) return a.isCurated ? -1 : 1;
      return b.multiplier.final - a.multiplier.final;
    });

  const curatedCount = ranked.filter((r) => r.isCurated).length;
  const top3 = ranked.filter((r) => r.isCurated).slice(0, 3);

  return (
    <article className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-cocoa-700/70 mb-6">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/cities/${city}`} className="hover:text-atlas-700">
          {cityRow.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">Where to open</span>
      </nav>

      {/* Hero */}
      <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
        Decision wizard
      </div>
      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 leading-tight">
        Where to open a {ind.name.toLowerCase()} in {cityRow.name}
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl leading-relaxed">
        Every neighborhood in {cityRow.name} ranked by the commuter +
        tourism + anomaly-tag framework. Top picks first.
      </p>

      {/* Empty state when no neighborhoods have curated intensity. */}
      {curatedCount === 0 ? (
        <div className="rounded-2xl bg-white border border-[rgba(76,39,18,0.10)] p-8 text-center">
          <h2 className="font-display text-xl text-ink-900 mb-2">
            {cityRow.name} not yet covered at neighborhood resolution
          </h2>
          <p className="text-sm text-cocoa-700/80 max-w-md mx-auto">
            We're seeding the curated neighborhood data city by city. Open
            the city page for the cell-level benchmark in the meantime.
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
          {/* Top 3 picks. */}
          <section className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-5">
              Top 3 neighborhoods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((r, idx) => {
                const m = r.multiplier;
                const pct = Math.round((m.final - 1) * 100);
                const color =
                  m.final > 1.15
                    ? "#14532D"
                    : m.final > 1.0
                      ? "#16A34A"
                      : m.final > 0.85
                        ? "#CA8A04"
                        : "#7F1D1D";
                const rationale = rationaleFor(ind.id, m.appliedTags, m.final);
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
                        {pct >= 0 ? "+" : ""}
                        {pct}%
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">
                      {r.neighborhood.name}
                    </h3>
                    <p className="text-xs text-cocoa-700/80 leading-relaxed flex-1">
                      {rationale}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.appliedTags
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
                    <div className="text-[10px] text-cocoa-700/55 tabular-nums pt-1">
                      commuter {m.commuter.toFixed(2)}× &middot; tourism{" "}
                      {m.tourism.toFixed(2)}× &middot; tags {m.tags.toFixed(2)}×
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Full ranking table. */}
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
                      vs city
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((r) => {
                    const m = r.multiplier;
                    const pct = Math.round((m.final - 1) * 100);
                    const color =
                      m.final > 1.15
                        ? "#14532D"
                        : m.final > 1.0
                          ? "#16A34A"
                          : m.final > 0.85
                            ? "#CA8A04"
                            : "#7F1D1D";
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
                              city default (not yet curated)
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {m.appliedTags
                              .filter((t) => t !== "residential_only")
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
                        <td
                          className="px-4 py-3 text-right font-display text-base font-semibold tabular-nums"
                          style={{ color }}
                        >
                          {pct >= 0 ? "+" : ""}
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Methodology footnote. */}
          <section className="text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
            The multiplier composes three factors: commuter intensity
            (daytime / resident pop), tourism intensity (visitors per
            resident), and a set of anomaly tags (financial CBD, luxury
            district, tech corridor, etc). Each factor has activity-
            specific elasticities. See{" "}
            <Link
              href="/methodology"
              className="text-atlas-700 font-medium hover:text-atlas-900 underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
            >
              How we measure
            </Link>{" "}
            for the full math.
          </section>
        </>
      )}
    </article>
  );
}
