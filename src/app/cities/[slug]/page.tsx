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
import { MoreDepthBanner } from "@/components/monetization";
import { ComparableCitiesRibbon } from "@/components/ComparableCitiesRibbon";
import { TopProfitableActivities } from "@/components/cities/TopProfitableActivities";
import { MostSaturatedActivities } from "@/components/cities/MostSaturatedActivities";
import { BusinessFormationCosts } from "@/components/cities/BusinessFormationCosts";
import { CoverageIndicator } from "@/components/CoverageIndicator";
import { getGuidingWord, type Metric } from "@/lib/cities/guiding_word";

export const revalidate = 43200; // 12 hours

type City = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number; // metro population in millions
  gdp_b: number; // metro GDP in USD billions
  wealth_z: number; // legacy field, not rendered
  // CitiesFix v1 metrics (enriched by scripts/data/cities/enrich_city_metrics.py)
  avg_gross_salary_usd_year?: number; // metro average gross salary, USD per year
  hdi?: number; // city HDI (0-1), with country-bump fallback
  gini?: number; // Gini coefficient, city-level when available else national
  // CitiesFix2 sec 6: the 3 new metrics
  cost_of_living_index?: number; // Numbeo COL, NYC = 100
  unemployment_pct?: number;
  tourist_arrivals_m?: number;
  sources?: Record<string, string>;
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
  // Plan v30 hotfix — pre-render Tier 1 only at build (~20 cities).
  // Tier 2+3 land on-demand via ISR. Was Tier 1+2 (90+ pages) which
  // contributed to the build-worker OOM that killed every Vercel
  // deploy since the new bundles landed.
  return CITIES.filter((c) => c.tier === 1).map((c) => ({ slug: c.slug }));
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

  const heroRecord = getCityHero(city.slug);
  // Sanity §7 — only render the <img> when we have a real photo. Pattern
  // fallbacks (variant=pattern) drop to the cream/cocoa gradient block.
  const hero =
    heroRecord && heroRecord.variant !== "pattern" && heroRecord.image_url_full
      ? heroRecord
      : undefined;
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const scheme = NEIGHBORHOODS[city.slug];

  return (
    <article className="pb-16">
      {/* Cities §4 founder layout: hero image full-bleed, cards
         overlaid at the bottom. City name in bottom-LEFT, stat cards
         in bottom-CENTER + bottom-RIGHT. The image stays as the
         dominant visual but the page does not waste the whole first
         frame on it alone. */}
      <section className="relative w-full h-[480px] md:h-[600px] overflow-hidden bg-stone-100 mb-8 md:mb-12">
        {hero ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image_url_full}
              alt={hero.alt}
              className="w-full h-full object-cover"
              style={{ filter: "contrast(1.06) saturate(0.88)" }}
            />
            {/* Heavier bottom gradient so the overlaid cards have
               enough contrast against any photograph. */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/35 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cream-100 via-parchment to-cocoa-100" />
        )}

        {/* CitiesFix2 sec 6: 8 city stat cards overlaid on the image.
           City name + country bottom-left; 8 cards in a tight strip.
           Each card has a colored guiding word (sec 7).
           Salary is per MONTH, not per year (founder spec). */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* City name + country block, bottom-left */}
            <div className="text-white mb-3 md:mb-4">
              <div className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide font-semibold mb-1.5 opacity-90">
                <CountryFlag iso2={city.iso2} className="w-5" />
                <span>{countryName}</span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-balance"
                style={{ overflowWrap: "anywhere", hyphens: "auto" }}
              >
                {city.name}
              </h1>
            </div>

            {/* 8-card strip: 2 cols mobile, 4 cols tablet, 8 cols desktop. */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5 md:gap-2">
              <StatOverlayCard
                label="Metro pop"
                value={`${city.pop_m.toFixed(1)}M`}
                metric="metro_pop_m"
                rawValue={city.pop_m}
              />
              <StatOverlayCard
                label="Metro GDP"
                value={`$${city.gdp_b.toFixed(0)}B`}
                metric="metro_gdp_b"
                rawValue={city.gdp_b}
              />
              <StatOverlayCard
                label="Salary / mo"
                value={
                  city.avg_gross_salary_usd_year
                    ? `$${Math.round(city.avg_gross_salary_usd_year / 12 / 100) * 100}`
                    : "-"
                }
                metric="gross_salary_usd_mo"
                rawValue={
                  city.avg_gross_salary_usd_year
                    ? city.avg_gross_salary_usd_year / 12
                    : null
                }
              />
              <StatOverlayCard
                label="HDI"
                value={city.hdi != null ? city.hdi.toFixed(3) : "-"}
                metric="hdi"
                rawValue={city.hdi ?? null}
              />
              <StatOverlayCard
                label="Gini"
                value={city.gini != null ? city.gini.toFixed(1) : "-"}
                metric="gini"
                rawValue={city.gini ?? null}
              />
              <StatOverlayCard
                label="Cost of living"
                value={
                  city.cost_of_living_index != null
                    ? city.cost_of_living_index.toFixed(0)
                    : "-"
                }
                metric="cost_of_living_index"
                rawValue={city.cost_of_living_index ?? null}
              />
              <StatOverlayCard
                label="Unemployment"
                value={
                  city.unemployment_pct != null
                    ? `${city.unemployment_pct.toFixed(1)}%`
                    : "-"
                }
                metric="unemployment_pct"
                rawValue={city.unemployment_pct ?? null}
              />
              <StatOverlayCard
                label="Tourism / yr"
                value={
                  city.tourist_arrivals_m != null
                    ? `${city.tourist_arrivals_m.toFixed(1)}M`
                    : "-"
                }
                metric="tourist_arrivals_m"
                rawValue={city.tourist_arrivals_m ?? null}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Sanity-§8: apologetic expanded CoverageIndicator banner
            replaced with a quiet inline methodology link. */}
        <section className="mb-10">
          <CoverageIndicator
            tier={city.tier === 1 ? "regional" : "estimated"}
            variant="compact"
          />
        </section>

        {/* Source disclosure footnote for the hero stats. Quiet so the
           page stays editorial; visible enough to be honest about
           which figures are city-specific and which fall through to a
           national fallback. */}
        {(city.sources?.gini || city.sources?.hdi) && (
          <p className="text-xs text-cocoa-700/60 mb-8 max-w-3xl leading-relaxed">
            {city.sources?.gini?.startsWith("National") ? (
              <>
                Gini coefficient shown at the national level (city-level
                inequality data is not consistently published).{" "}
              </>
            ) : null}
            {city.sources?.hdi?.startsWith("Extrapolated") ? (
              <>
                HDI extrapolated from the country baseline plus a city-tier
                adjustment.{" "}
              </>
            ) : null}
          </p>
        )}

        {/* Cities sec 6: top 5 most / least profitable activities. */}
        <TopProfitableActivities countryIso2={city.iso2} />

        {/* Cities sec 6: top 5 most saturated activities (brain population). */}
        <MostSaturatedActivities
          countryIso2={city.iso2}
          countryName={countryName}
        />

        {/* Cities sec 6: business formation costs by legal tier. */}
        <BusinessFormationCosts
          countryIso2={city.iso2}
          countryName={countryName}
        />

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
          {/* v34 Phase C city-page lock: depth on quartiles + the
             full list of industries beyond the headline ten. */}
          <MoreDepthBanner
            headline={`See every industry covered in ${city.name}, plus lower-mid and upper-mid quartiles per cell.`}
            tier="basic"
            entry="city_truncated_industries"
          />
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
                  href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}`}
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

/** Stat card overlaid on the hero image (CitiesFix2 sec 6 + 7).
 * Tight padding, semi-transparent backdrop, three lines:
 *   1. label   (tiny uppercase)
 *   2. value   (tabular)
 *   3. guiding word (colored on the red-to-green gradient per metric)
 *
 * When rawValue is null (data missing) the guiding line is hidden. */
function StatOverlayCard({
  label,
  value,
  metric,
  rawValue,
}: {
  label: string;
  value: string;
  metric: Metric;
  rawValue: number | null;
}) {
  const guiding =
    rawValue != null ? getGuidingWord(metric, rawValue) : null;
  return (
    <div className="bg-cream-50/95 backdrop-blur-sm border border-parchment rounded-lg px-2 py-1.5 md:px-2.5 md:py-2 shadow-md">
      <div className="text-[8px] md:text-[9px] uppercase tracking-wide text-cocoa-700/70 font-semibold">
        {label}
      </div>
      <div className="font-display text-base md:text-xl font-medium text-ink-900 tabular-nums leading-tight">
        {value}
      </div>
      {guiding && guiding.word ? (
        <div
          className="text-[9px] md:text-[10px] font-semibold leading-none"
          style={{ color: guiding.color }}
        >
          {guiding.word}
        </div>
      ) : null}
    </div>
  );
}
