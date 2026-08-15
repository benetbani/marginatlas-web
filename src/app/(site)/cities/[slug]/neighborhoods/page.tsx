/**
 * Neighborhood hub page for a city.
 *
 * Route: /cities/[slug]/neighborhoods
 *
 * Only renders if the city has a neighborhood scheme in
 * neighborhoods_v1.json (23 cities so far). Otherwise 404 — the
 * metropolis page is the canonical destination.
 *
 * Each row deep-links into the neighborhood × industry page with
 * the city's most representative headline industry.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../../../data/cities/neighborhoods_v1.json";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { colors } from "@/lib/design-tokens";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import {
  getNeighborhoodMultiplier,
  hasNeighborhoodIntensity,
  tagLabel,
} from "@/lib/economics/neighborhood_multipliers";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineHoodBody } from "@/components/spine/hood/hood-view";
import { buildSpineHoodSeed } from "@/lib/spine/adapt_hood";

export const revalidate = 43200;

type City = {
  slug: string;
  name: string;
  iso2: string;
  pop_m: number;
};
type Neighborhood = {
  slug: string;
  name: string;
  character: string;
  description?: string;
};
type NeighborhoodScheme = {
  scheme: string;
  neighborhoods: Neighborhood[];
};

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const NEIGHBORHOODS = (neighborhoodsJson as { cities: Record<string, NeighborhoodScheme> }).cities;

/**
 * The trade that tends to fit a district's character.
 *
 * SEVEN OF THESE EIGHT SLUGS NAMED NO INDUSTRY. law-offices, specialty-retail,
 * auto-repair, construction-residential, hotels, coffee-shops and bookstores
 * are not slugs this taxonomy has ever produced; only "restaurants" resolved.
 * They are the hyphenated twins of the invented ids that were found in the
 * /learn article tags, which suggests both lists were written from memory
 * rather than from the taxonomy.
 *
 * Nothing broke, because `industry` is never used: only `name` is rendered.
 * That is the whole risk. The row ends in an arrow, which is an invitation to
 * link it, and the day someone accepts it seven districts in eight would have
 * gone to a 404.
 *
 * The slugs are now the real ones, verified against industryToSlug. Two
 * characters had no honest match and carry `industry: null`:
 *
 *   affluent-residential  "specialty retail" is a category, not a trade. The
 *                         nearest entries are specialty FOOD, grocers and
 *                         sporting goods, which are three different shops.
 *   central-business      the only law entry is sole-practitioner law firms,
 *                         which is not default-visible, so it has no page.
 *
 * NOT LINKED YET, deliberately. For 209 of the 252 cities the character these
 * map from is template-assigned rather than observed, so linking would turn an
 * invented premise into a recommendation with a destination. The arrow is gone
 * until the district data is settled; the names still read.
 */
const CHARACTER_HEADLINE: Record<
  string,
  { industry: string | null; name: string }
> = {
  "central-business": { industry: null, name: "Law offices" },
  "affluent-residential": { industry: null, name: "Specialty retail" },
  "mid-residential": { industry: "restaurants", name: "Restaurants" },
  "working-residential": { industry: "auto-repair-shops", name: "Auto repair" },
  "industrial": { industry: "residential-construction", name: "Construction" },
  "tourist": { industry: "hotels-lodging", name: "Hotels" },
  "mixed-urban": { industry: "cafes-coffee-shops", name: "Coffee shops" },
  "academic": { industry: "indie-bookstores", name: "Bookstores" },
};

export async function generateStaticParams() {
  return Object.keys(NEIGHBORHOODS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = CITIES_BY_SLUG.get(slug);
  if (!city) return { title: "City not found | Margin Atlas" };
  // Built from the RESOLVED city, not the raw param, so the canonical is the
  // slug this page actually rendered. Without an `alternates` of its own this
  // route inherited the root layout's `canonical: "/"`.
  return {
    title: `${city.name} neighborhoods | Margin Atlas`,
    description: `Every neighborhood in ${city.name} with its headline small-business industry.`,
    alternates: { canonical: `/cities/${city.slug}/neighborhoods` },
  };
}

export default async function NeighborhoodHub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Spine reform (per-page flag, default OFF). Promoted to real data: the spine body
  // renders buildSpineHoodSeed (the same neighborhood engine the non-spine render below
  // uses), re-keyed to the real macro-districts and self-wrapping in SpineShell. Only a
  // city with curated districts + authored centroids (London today) returns a seed;
  // every other city returns undefined and falls through to the existing page below, so
  // none gets a 404 or an illustrative seed.
  if (isSpineReformEnabledFor("hood")) {
    const spineData = await buildSpineHoodSeed(slug);
    if (spineData) return <SpineHoodBody data={spineData} />;
  }

  const city = CITIES_BY_SLUG.get(slug);
  if (!city) notFound();
  const scheme = NEIGHBORHOODS[slug];
  if (!scheme) notFound();

  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;

  return (
    <article className="pb-16 max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-3">
        <Link href={`/cities/${city.slug}`} className="hover:text-atlas-700">
          {city.name}
        </Link>
        <span>·</span>
        <CountryFlag iso2={city.iso2} className="w-4" />
        <span>{countryName}</span>
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Every neighborhood in {city.name}
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl">
        {scheme.neighborhoods.length} sub-areas, each with its own
        character, anomaly tags, and revenue adjustment for a small
        business opening here vs the city baseline.
      </p>

      <div className="space-y-4">
        {scheme.neighborhoods.map((n) => {
          const headline = CHARACTER_HEADLINE[n.character] || { industry: "restaurants", name: "Restaurants" };
          // Surface deep flavor data when populated.
          const flavor = getNeighborhoodFlavor(slug, n.slug);
          // Phase 1 commuter+tourism+tag framework (2026-05-25): the
          // multiplier breakdown for a default activity (restaurants
          // — the most universal SMB benchmark). Future versions
          // expose an activity selector here.
          const mult = getNeighborhoodMultiplier(slug, n.slug, "restaurants");
          const hasIntensity = hasNeighborhoodIntensity(slug, n.slug);
          const multPct = Math.round((mult.final - 1) * 100);
          const multColor =
            mult.final > 1.15
              ? colors.moss[700]
              : mult.final > 1.0
                ? colors.moss[500]
                : mult.final > 0.85
                  ? colors.delta.caution
                  : colors.delta.negative;
          return (
            <Link
              key={n.slug}
              href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}`}
              className="group block rounded-2xl border border-parchment hover:border-atlas-500 bg-white p-5 md:p-6 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                      {n.name}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700/60 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
                      {n.character.replace(/-/g, " ")}
                    </span>
                    {/* Anomaly tags from the new framework. */}
                    {hasIntensity &&
                      mult.appliedTags
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
                    {flavor && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700/60 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
                        walks {flavor.walkability}
                      </span>
                    )}
                  </div>
                  {flavor ? (
                    <p className="text-sm md:text-base text-cocoa-700/90 max-w-2xl leading-relaxed">
                      {flavor.character_paragraph}
                    </p>
                  ) : n.description ? (
                    <p className="text-sm text-cocoa-700/80 max-w-2xl leading-relaxed">
                      {n.description}
                    </p>
                  ) : null}
                </div>
                <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
                  {hasIntensity && (
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
                        Restaurant revenue vs city
                      </div>
                      <div
                        className="font-display text-xl font-semibold tabular-nums leading-none"
                        style={{ color: multColor }}
                      >
                        {multPct >= 0 ? "+" : ""}
                        {multPct}%
                      </div>
                      <div className="text-[10px] text-cocoa-700/55 mt-1 tabular-nums">
                        commuter {mult.commuter.toFixed(2)}× | tourism {mult.tourism.toFixed(2)}× | tags {mult.tags.toFixed(2)}×
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
                      Headline
                    </div>
                    {/* No arrow. It is not a link, and a trailing arrow is a
                        promise of somewhere to go. */}
                    <div className="text-sm font-medium text-atlas-700">
                      {headline.name}
                    </div>
                  </div>
                </div>
              </div>
              {flavor && (
                <div className="border-t border-parchment pt-3 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
                      Food
                    </div>
                    <div className="text-cocoa-700">{flavor.food_scene}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
                      Don&apos;t miss
                    </div>
                    <div className="text-cocoa-700">{flavor.dont_miss}</div>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </article>
  );
}
