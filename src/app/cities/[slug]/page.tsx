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
// TopProfitableActivities + MostSaturatedActivities dropped per
// founder direction 2026-05-26. Replaced by CitySignaturePanel
// (demographics + 3 signature sectors + culture spectrums +
// government scores). NYC ships first; other cities show null
// until their data is curated.
import { CitySignaturePanel } from "@/components/cities/CitySignaturePanel";
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

        {/* Founder layout 2026-05-25: city name bottom-LEFT, 8-cell
           data TABLE (4 cols, 2 rows) bottom-RIGHT. The cells share
           one outer border and hairline dividers, not 8 separate
           rounded cards. Reads like a broadsheet market table sitting
           on a photograph, not a row of utility chips. */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end">
            {/* LEFT: city name + country + flag (5 of 12 cols on md+) */}
            <div className="text-white md:col-span-5">
              <div className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.18em] font-semibold mb-2 opacity-90">
                <CountryFlag iso2={city.iso2} className="w-5" />
                <span>{countryName}</span>
              </div>
              <h1
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.04]"
                style={{ whiteSpace: "nowrap" }}
              >
                {city.name}
              </h1>
            </div>

            {/* RIGHT: 4-col x 2-row unified data table (7 of 12 cols on md+) */}
            <div className="md:col-span-7">
              <CityStatTable
                cards={[
                  {
                    label: "Metro pop",
                    value: `${city.pop_m.toFixed(1)}M`,
                    metric: "metro_pop_m",
                    rawValue: city.pop_m,
                  },
                  {
                    label: "Metro GDP",
                    value: `$${city.gdp_b.toFixed(0)}B`,
                    metric: "metro_gdp_b",
                    rawValue: city.gdp_b,
                  },
                  {
                    label: "Salary / mo",
                    value: city.avg_gross_salary_usd_year
                      ? `$${Math.round(city.avg_gross_salary_usd_year / 12 / 100) * 100}`
                      : "-",
                    metric: "gross_salary_usd_mo",
                    rawValue: city.avg_gross_salary_usd_year
                      ? city.avg_gross_salary_usd_year / 12
                      : null,
                  },
                  {
                    label: "HDI",
                    value: city.hdi != null ? city.hdi.toFixed(3) : "-",
                    metric: "hdi",
                    rawValue: city.hdi ?? null,
                  },
                  {
                    label: "Gini",
                    value: city.gini != null ? city.gini.toFixed(1) : "-",
                    metric: "gini",
                    rawValue: city.gini ?? null,
                  },
                  {
                    label: "Cost of living",
                    value:
                      city.cost_of_living_index != null
                        ? city.cost_of_living_index.toFixed(0)
                        : "-",
                    metric: "cost_of_living_index",
                    rawValue: city.cost_of_living_index ?? null,
                  },
                  {
                    label: "Unemployment",
                    value:
                      city.unemployment_pct != null
                        ? `${city.unemployment_pct.toFixed(1)}%`
                        : "-",
                    metric: "unemployment_pct",
                    rawValue: city.unemployment_pct ?? null,
                  },
                  {
                    label: "Tourism / yr",
                    value:
                      city.tourist_arrivals_m != null
                        ? `${city.tourist_arrivals_m.toFixed(1)}M`
                        : "-",
                    metric: "tourist_arrivals_m",
                    rawValue: city.tourist_arrivals_m ?? null,
                  },
                ]}
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

        {/* Founder direction 2026-05-26: dropped TopProfitableActivities
            (most / least profitable, was sec 6) and MostSaturatedActivities
            (most crowded fields). Replaced by the CitySignaturePanel
            below (demographics + signature sectors + culture spectrums
            + government scores). Renders null when the city has no
            curated entry in city_signature_v1.json. */}
        <CitySignaturePanel
          citySlug={city.slug}
          cityName={city.name}
          iso2={city.iso2}
        />

        {/* Cities sec 6: business formation costs by legal tier. */}
        <BusinessFormationCosts
          countryIso2={city.iso2}
          countryName={countryName}
        />

        {/* Decision wizard CTA. Phase 2 framework discoverability. */}
        <section className="mb-12 md:mb-16">
          <div className="atlas-card p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-2">
                Decision wizard
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 leading-tight mb-1.5">
                Where in {city.name} should you open?
              </h2>
              <p className="text-sm text-cocoa-700/80 max-w-xl leading-relaxed">
                Pick any activity. Atlas ranks every neighborhood by
                expected net margin, weighing commuter density, tourism,
                anomaly zones, and rent drag.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                href={`/decide/restaurants/${city.slug}`}
                className="px-4 py-2.5 rounded-full bg-atlas-700 hover:bg-atlas-800 text-cream-50 text-sm font-semibold shadow-sm transition text-center whitespace-nowrap"
              >
                Restaurants &rarr;
              </Link>
              <Link
                href={`/decide/pharmacies-drug-stores/${city.slug}`}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-cream-100 border border-ink-200 hover:border-atlas-700 text-ink-900 text-sm font-semibold transition text-center whitespace-nowrap"
              >
                Pharmacies &rarr;
              </Link>
              <Link
                href={`/decide`}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-cream-100 border border-ink-200 hover:border-atlas-700 text-ink-900 text-sm font-semibold transition text-center whitespace-nowrap"
              >
                Other activity
              </Link>
            </div>
          </div>
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

/** City stat TABLE overlaid on the hero image. Founder spec 2026-05-25:
 * NOT 8 separate utility cards with rounded corners. ONE unified table,
 * 4 columns x 2 rows, with a single outer border and hairline dividers
 * between cells. Reads like a broadsheet market table sitting on the
 * photograph. Bigger labels, bigger values, guiding word in color. */
type StatCard = {
  label: string;
  value: string;
  metric: Metric;
  rawValue: number | null;
};

function CityStatTable({ cards }: { cards: StatCard[] }) {
  return (
    <div className="rounded-lg overflow-hidden bg-cream-50/95 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-cocoa-700/15">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-cocoa-700/12">
        {cards.slice(0, 4).map((c) => (
          <StatTableCell key={c.label} card={c} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-cocoa-700/12 border-t border-cocoa-700/12">
        {cards.slice(4, 8).map((c) => (
          <StatTableCell key={c.label} card={c} />
        ))}
      </div>
    </div>
  );
}

function StatTableCell({ card }: { card: StatCard }) {
  const guiding =
    card.rawValue != null ? getGuidingWord(card.metric, card.rawValue) : null;
  return (
    <div className="px-3 py-2.5 md:px-4 md:py-3">
      <div className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-cocoa-700/70 font-semibold leading-none mb-1.5">
        {card.label}
      </div>
      <div className="font-display text-xl md:text-2xl font-medium text-ink-900 tabular-nums leading-none">
        {card.value}
      </div>
      {guiding && guiding.word ? (
        <div
          className="mt-1.5 text-[11px] md:text-xs font-semibold leading-none"
          style={{ color: guiding.color }}
        >
          {guiding.word}
        </div>
      ) : (
        <div className="mt-1.5 text-[11px] md:text-xs text-cocoa-700/40 leading-none">
          not measured
        </div>
      )}
    </div>
  );
}
