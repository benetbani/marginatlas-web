/**
 * Plan v27 Lane C.2 — metropolis page for any of the top-200 cities.
 *
 * Route: /cities/[slug]
 *
 * Sections (server-rendered):
 *   1. Hero (full-bleed Unsplash if cached, fallback initial card)
 *   2. Meta strip (country, population, GDP, currency)
 *   3. Industry mosaic — 10 representative SMB industries with median revenue
 *   4. Neighborhood mini-strip (only if the city has a scheme; deep-link
 *      to the neighborhood hub)
 *   5. Curiosities preview (deep-link to /curiosities)
 *   6. Sister cities ribbon
 *   7. Compare-with deep-links
 *
 * No client JS. revalidate: 12h.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../data/cities/neighborhoods_v1.json";
import { getCityHero } from "@/lib/images/city_heroes";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { ComparableCitiesRibbon } from "@/components/ComparableCitiesRibbon";
import { CoverageIndicator } from "@/components/CoverageIndicator";

export const revalidate = 43200; // 12 hours

type City = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  gdp_b: number;
  wealth_z: number;
};

type Neighborhood = {
  slug: string;
  name: string;
  character: string;
  description?: string;
};

type NeighborhoodScheme = {
  scheme: "α-macro" | "β-subdivisions" | "γ-none";
  neighborhoods: Neighborhood[];
};

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const NEIGHBORHOODS = (neighborhoodsJson as { cities: Record<string, NeighborhoodScheme> }).cities;

const HEADLINE_INDUSTRIES = [
  { id: "restaurants", name: "Restaurants" },
  { id: "coffee_shops", name: "Coffee shops" },
  { id: "law_offices", name: "Law offices" },
  { id: "hair_salons", name: "Hair salons" },
  { id: "construction_residential", name: "Construction" },
  { id: "software_dev_services", name: "Software services" },
  { id: "fitness_centers", name: "Fitness centers" },
  { id: "specialty_retail", name: "Specialty retail" },
  { id: "auto_repair", name: "Auto repair" },
  { id: "real_estate_brokerage", name: "Real estate" },
];

export async function generateStaticParams() {
  // Pre-render Tier 1+2 cities; Tier 3 lazy.
  return CITIES.filter((c) => c.tier <= 2).map((c) => ({ slug: c.slug }));
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
    title: `${city.name} small business benchmarks | Margin Atlas`,
    description: `Revenue, employment, and wage benchmarks for small businesses in ${city.name}. Neighborhoods, sister cities, and industry deep-dives.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = CITIES_BY_SLUG.get(slug);
  if (!city) notFound();

  const hero = getCityHero(city.slug);
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const scheme = NEIGHBORHOODS[city.slug];

  return (
    <article className="pb-16">
      {/* Hero */}
      <section className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden bg-stone-100 mb-8 md:mb-12">
        {hero ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image_url_full}
              alt={hero.alt}
              className="w-full h-full object-cover"
              style={{ filter: "contrast(1.06) saturate(0.88)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(212,119,6,0.22) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cream-100 via-parchment to-cocoa-100" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide font-semibold mb-2 opacity-90">
            <CountryFlag iso2={city.iso2} className="w-4" />
            <span>{countryName}</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight">
            {city.name}
          </h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Meta strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          <MetaTile label="Country" value={countryName} />
          <MetaTile label="Metro population" value={`${city.pop_m.toFixed(1)}M`} />
          <MetaTile label="Metro GDP" value={`$${city.gdp_b.toFixed(0)}B`} />
          <MetaTile label="Wealth tier" value={city.wealth_z >= 2 ? "Top" : city.wealth_z >= 1 ? "Upper" : city.wealth_z >= 0 ? "Mid" : "Emerging"} />
        </section>

        {/* Coverage chip */}
        <section className="mb-10">
          <CoverageIndicator
            tier={city.tier === 1 ? "regional" : "estimated"}
            variant="expanded"
            industryName="local small business"
            geoName={city.name}
          />
        </section>

        {/* Industry mosaic */}
        <section className="mb-12 md:mb-16">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
            Ten industries
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
            What small businesses in {city.name} look like
          </h2>
          <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
            A starting grid of the most-shared SMB categories. Each card
            opens the full benchmark for {city.name}.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {HEADLINE_INDUSTRIES.map((ind) => (
              <Link
                key={ind.id}
                href={`/${city.iso2.toLowerCase()}/${city.slug}/${ind.id.replace(/_/g, "-")}`}
                className="group block rounded-2xl border border-parchment hover:border-atlas-500 bg-white p-4 transition-colors"
              >
                <div className="font-display text-base md:text-lg font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors leading-tight">
                  {ind.name}
                </div>
                <div className="mt-3 text-xs text-cocoa-700/70 flex items-center gap-1.5 font-medium border-b border-atlas-200 group-hover:border-atlas-500 pb-0.5 transition-colors w-fit">
                  See benchmark
                  <span aria-hidden>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Neighborhood mini-strip */}
        {scheme && scheme.neighborhoods.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
              Neighborhoods
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
              The {scheme.neighborhoods.length} sub-areas
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
              The shape of {city.name} below the headline figure.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {scheme.neighborhoods.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}/restaurants`}
                  className="group block rounded-xl border border-parchment hover:border-atlas-500 bg-cream-50 p-3 transition-colors"
                >
                  <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 leading-tight">
                    {n.name}
                  </div>
                  <div className="text-[11px] text-cocoa-700/60 mt-1 capitalize">
                    {n.character.replace(/-/g, " ")}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href={`/cities/${city.slug}/neighborhoods`}
                className="text-sm text-atlas-700 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
              >
                Explore all neighborhoods →
              </Link>
            </div>
          </section>
        )}

        {/* Curiosities preview */}
        <section className="mb-12 md:mb-16">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
            Curiosities
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
            What stands out in {city.name}
          </h2>
          <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
            The most expensive trade, the most crowded category, the
            biggest surprise.{" "}
            <Link
              href={`/cities/${city.slug}/curiosities`}
              className="text-atlas-700 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
            >
              See the full set →
            </Link>
          </p>
        </section>

        {/* Sister cities ribbon */}
        <ComparableCitiesRibbon
          citySlug={city.slug}
          industrySlug="restaurants"
          industryName="restaurants"
        />
      </div>
    </article>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-parchment bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-1">
        {label}
      </div>
      <div className="font-display text-lg md:text-xl font-medium text-ink-900 tabular-nums leading-tight">
        {value}
      </div>
    </div>
  );
}
