/**
 * Plan v27 Lane C.3 — neighborhood hub page for a city.
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
import cityListJson from "../../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../../data/cities/neighborhoods_v1.json";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";

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

const CHARACTER_HEADLINE: Record<string, { industry: string; name: string }> = {
  "central-business": { industry: "law-offices", name: "Law offices" },
  "affluent-residential": { industry: "specialty-retail", name: "Specialty retail" },
  "mid-residential": { industry: "restaurants", name: "Restaurants" },
  "working-residential": { industry: "auto-repair", name: "Auto repair" },
  "industrial": { industry: "construction-residential", name: "Construction" },
  "tourist": { industry: "hotels", name: "Hotels" },
  "mixed-urban": { industry: "coffee-shops", name: "Coffee shops" },
  "academic": { industry: "bookstores", name: "Bookstores" },
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
  return {
    title: `${city.name} neighborhoods | Margin Atlas`,
    description: `Every neighborhood in ${city.name} with its headline small-business industry.`,
  };
}

export default async function NeighborhoodHub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
        character and headline small-business industry.
      </p>

      <div className="space-y-4">
        {scheme.neighborhoods.map((n) => {
          const headline = CHARACTER_HEADLINE[n.character] || { industry: "restaurants", name: "Restaurants" };
          // Plan v30 Lane 2 — surface deep flavor data when populated.
          const flavor = getNeighborhoodFlavor(slug, n.slug);
          return (
            <Link
              key={n.slug}
              href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}/${headline.industry}`}
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
                    {flavor && (
                      <>
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5">
                          {flavor.price_tier}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700/60 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
                          walks {flavor.walkability}
                        </span>
                      </>
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
                <div className="hidden md:block text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
                    Headline
                  </div>
                  <div className="text-sm font-medium text-atlas-700">
                    {headline.name} →
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
