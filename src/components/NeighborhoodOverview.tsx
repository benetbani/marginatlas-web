/**
 * NeighborhoodOverview component.
 *
 * Renders the neighborhood landing UI (character chip, editorial
 * paragraph, 10-industry mosaic, sister neighborhoods). Used by the
 * combined cell-or-overview dispatcher at
 * src/app/[country]/[geo]/[industry]/page.tsx — when the URL
 * `/[country]/[geo]/[industry]` happens to resolve as a known
 * (city, neighborhood) pair instead of a (geo, industry) cell, this
 * component renders instead of the cell page.
 *
 * Server component. Reads neighborhoods_v1.json + city_list_v1.json
 * via the existing cities helpers.
 */
import Link from "next/link";
import cityListJson from "../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../data/cities/neighborhoods_v1.json";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import { COUNTRIES } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";

type City = { slug: string; name: string; iso2: string; pop_m: number };
export type Neighborhood = {
  slug: string;
  name: string;
  character: string;
  description?: string;
};
type Scheme = { scheme: string; neighborhoods: Neighborhood[] };

const CITIES = (cityListJson as { cities: City[] }).cities;
const NEIGHBORHOODS = (neighborhoodsJson as { cities: Record<string, Scheme> }).cities;

const HEADLINE_INDUSTRIES = [
  { slug: "restaurants", name: "Restaurants" },
  { slug: "coffee-shops", name: "Coffee shops" },
  { slug: "law-offices", name: "Law offices" },
  { slug: "hair-salons", name: "Hair salons" },
  { slug: "construction-residential", name: "Construction" },
  { slug: "software-dev-services", name: "Software services" },
  { slug: "fitness-centers", name: "Fitness centers" },
  { slug: "specialty-retail", name: "Specialty retail" },
  { slug: "auto-repair", name: "Auto repair" },
  { slug: "real-estate-brokerage", name: "Real estate" },
];

/**
 * Returns the (city, neighborhood) entry if `(country, citySlug,
 * neighborhoodSlug)` matches a known scheme. Returns null otherwise.
 * Used by the cell-page dispatcher to decide whether to render the
 * neighborhood overview or fall through to the cell page.
 */
export function findNeighborhoodContext(
  country: string,
  citySlug: string,
  neighborhoodSlug: string,
): { city: City; nb: Neighborhood } | null {
  const cityEntry = CITIES.find(
    (c) => c.slug === citySlug && c.iso2.toLowerCase() === country.toLowerCase(),
  );
  if (!cityEntry) return null;
  const scheme = NEIGHBORHOODS[citySlug];
  if (!scheme) return null;
  const nb = scheme.neighborhoods.find((n) => n.slug === neighborhoodSlug);
  if (!nb) return null;
  return { city: cityEntry, nb };
}

export function listSiblingNeighborhoods(
  citySlug: string,
  excludeSlug: string,
): Neighborhood[] {
  return (NEIGHBORHOODS[citySlug]?.neighborhoods || []).filter(
    (n) => n.slug !== excludeSlug,
  );
}

export function NeighborhoodOverview({
  country,
  city,
  nb,
}: {
  country: string;
  city: City;
  nb: Neighborhood;
}) {
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const flavor = getNeighborhoodFlavor(city.slug, nb.slug);
  const siblings = listSiblingNeighborhoods(city.slug, nb.slug);
  const cc = country.toLowerCase();

  return (
    <article className="pb-16 max-w-5xl mx-auto px-4 md:px-6 pt-2 md:pt-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700 font-semibold mb-3 flex-wrap">
        <Link href={`/cities/${city.slug}`} className="hover:text-atlas-700 transition-colors">
          {city.name}
        </Link>
        <span aria-hidden>·</span>
        <CountryFlag iso2={city.iso2} className="w-3.5" />
        <span>{countryName}</span>
        <span aria-hidden>·</span>
        <Link href={`/cities/${city.slug}/neighborhoods`} className="hover:text-atlas-700 transition-colors">
          all neighborhoods
        </Link>
      </div>

      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink-900">
          {nb.name}
        </h1>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-atlas-700 bg-atlas-50 border border-atlas-200 rounded-full px-2 py-0.5">
          {nb.character.replace(/-/g, " ")}
        </span>
        {flavor?.price_tier && (
          <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
            {flavor.price_tier}
          </span>
        )}
      </div>

      <p className="text-base md:text-lg text-cocoa-700 max-w-2xl leading-relaxed mb-8">
        {flavor?.character_paragraph ||
          nb.description ||
          `${nb.name} is one of ${city.name}'s ${nb.character.replace(/-/g, " ")} sub-areas.`}
      </p>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-2">
          Ten industries in {nb.name}
        </div>
        <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-4">
          Pick a category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
          {HEADLINE_INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/${cc}/${city.slug}/${nb.slug}/${ind.slug}`}
              className="group block rounded-xl border border-cream-300 hover:border-atlas-500 bg-white p-3 transition-colors"
            >
              <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 transition-colors leading-tight">
                {ind.name}
              </div>
              <div className="mt-2 text-[10px] text-cocoa-700 flex items-center gap-1 font-medium">
                See benchmark <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {siblings.length > 0 && (
        <section>
          <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold mb-2">
            Elsewhere in {city.name}
          </div>
          <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-4">
            Other neighborhoods
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {siblings.map((n) => (
              <Link
                key={n.slug}
                href={`/${cc}/${city.slug}/${n.slug}`}
                className="group block rounded-xl border border-cream-300 hover:border-atlas-500 bg-cream-50 p-3 transition-colors"
              >
                <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 transition-colors leading-tight">
                  {n.name}
                </div>
                <div className="text-[10px] text-cocoa-700 mt-0.5 capitalize">
                  {n.character.replace(/-/g, " ")}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
