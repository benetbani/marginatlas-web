/**
 * Metropolis page for any of the top-200 cities.
 *
 * Route: /cities/[slug]
 *
 * Rebuilt on the board kit (2026-06-05) to match the cell page and the country
 * page. The heavy full-bleed hero with its overlaid stat table was replaced by
 * the quiet BoardHero plus the four-section city data board (Demand depth,
 * Location and rent, Market structure, Survival baseline), so the figures reach
 * above the fold in the same fixed scaffold the reader learns once and reads on
 * every page. A city has no single Atlas score, so the score strip is empty.
 *
 * Sections (server-rendered):
 *   1. BoardHero (plain city name, country eyebrow, empty score strip)
 *   2. City data board (buildCityBoard: demand / location / market / survival)
 *   3. Ranked activities table (buildCityActivities: best owner take-home
 *      first; London sourced from the curated dataset, other cities omit)
 *   4. Industry mosaic. 10 representative SMB industries
 *   5. Neighborhood mini-strip (only if the city has a scheme)
 *   6. Curiosities preview (deep-link to /curiosities)
 *   7. Sister cities ribbon
 *   8. Compare-with deep-links
 *
 * No client JS beyond the board's ShowMore toggle. revalidate: 12h.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../data/cities/neighborhoods_v1.json";
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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { BoardHero } from "@/components/board/BoardHero";
import { MastheadImage } from "@/components/board/MastheadImage";
import { getCityHero, isPatternHero } from "@/lib/images/city_heroes";
import { DataSection } from "@/components/board/DataSection";
import { fmtUSD, fmtPct } from "@/components/board/format";
import { buildCityBoard, buildCityActivities } from "@/lib/scores/city_board";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";

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
  // Pre-render Tier 1 only at build (~20 cities).
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

  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const scheme = NEIGHBORHOODS[city.slug];

  // Masthead atmosphere image. Resolve this city's hero photo (the same source
  // CityHero uses), and pass only its URL to the shared <MastheadImage>
  // treatment behind the board masthead. Self-omits to plain white when the
  // city has no curated photo or only a pattern-card fallback.
  const cityHero = getCityHero(city.slug);
  const mastheadSrc =
    cityHero && !isPatternHero(cityHero)
      ? cityHero.image_url_regular || cityHero.image_url_full || null
      : null;

  // City data board. Built from values the page already holds (the city record)
  // plus the country economics snapshot for the country the city sits in; no
  // new query, no invented number. Every section and every row is always
  // present, so a datum we do not hold shows as the board's dash and the page
  // shape never depends on the data. This is the city-altitude sibling of the
  // cell page's A-J board and the country page's five-section board.
  const econSnap = getCountryEconomicsSnapshot(city.iso2);
  const board = buildCityBoard({
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
    },
  });

  // Ranked activities in this city, best owner take-home first. London is
  // sourced from the curated dataset (every activity, its modeled after-tax
  // take-home and net margin); every other city returns an empty list and the
  // table omits cleanly. Each row links to that activity's cell page under the
  // city, the same /{iso2}/{slug}/{activity} shape the industry mosaic uses.
  const activities = buildCityActivities({
    slug: city.slug,
    countryIso2: city.iso2,
  });

  return (
    <article className="pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Board masthead (rebuilt 2026-06-05 to match the cell + country
           pages). The heavy full-bleed photo hero with its overlaid stat
           table was removed: it duplicated the population / salary / cost /
           tourism figures the data board now carries, and the board reaches
           the figures above the fold in the shared scaffold. Plain city name
           is the H1; a city has no single Atlas score, so the score strip is
           passed empty (overall null, no parts) and renders as a dash. The
           country eyebrow keeps the place context the old hero carried.

           The masthead carries the same deliberate exception to the pure-white
           system the country page does: a low-opacity duotone city photo sits
           behind the flag, eyebrow, and title as atmosphere, then fades to
           white so the data board below reads on a clean surface. The image
           self-omits when the city has no resolvable photo (see MastheadImage),
           so the masthead degrades to plain white rather than a broken frame.
           The masthead content sits in a relative layer above the image. */}
        <div className="relative overflow-hidden rounded-2xl">
          <MastheadImage src={mastheadSrc} />
          <div className="relative">
            <div className="flex items-center gap-2 pt-4">
              <CountryFlag iso2={city.iso2} className="w-5" />
              <SectionEyebrow size="md">{countryName}</SectionEyebrow>
            </div>
            <BoardHero title={city.name} score={{ overall: null, parts: [] }} />
          </div>
        </div>

        {/* The city data board. Four fixed sections the reader can learn once
           and read on every city, rendered immediately under the masthead.
           Each section always renders all of its rows; a datum we do not hold
           shows as the board's dash, so the page shape never depends on the
           data. */}
        <div className="mt-2">
          {board.map((s) => (
            <DataSection section={s} key={s.key} />
          ))}
        </div>

        {/* Activities in this city, ranked by what an owner keeps after tax,
           best at top and hardest at the bottom. London is sourced from the
           curated activity dataset; every other city omits this block cleanly
           (empty list) rather than show invented take-home. Each row links to
           that activity's full cell benchmark under the city. */}
        {activities.length > 0 && (
          <section className="mt-10">
            <SectionEyebrow>Best and hardest</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mt-1">
              What an owner keeps in {city.name}
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/80 mt-1.5 mb-5 max-w-2xl leading-relaxed">
              Every activity we cover in {city.name}, ranked by typical after-tax
              owner take-home. Best at the top, hardest at the bottom. Open any
              row for the full revenue, cost stack, and survival read. Modeled
              from local business demography. Directional.
            </p>
            <ul className="divide-y divide-parchment border-y border-parchment">
              {activities.map((a, i) => (
                <li key={a.slug}>
                  <Link
                    href={a.href}
                    className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors"
                  >
                    <span className="flex min-w-0 items-baseline gap-2.5">
                      <span className="w-5 shrink-0 text-[11px] tabular-nums text-cocoa-500">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700 transition-colors">
                        {a.name}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3">
                      {a.netMarginPct != null && (
                        <span className="hidden text-[11px] tabular-nums text-cocoa-500 sm:inline">
                          {fmtPct(a.netMarginPct)} net
                        </span>
                      )}
                      <span className="font-display text-base font-semibold tabular-nums text-ink-900">
                        {fmtUSD(a.takeHome)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-cocoa-500">
              Owner take-home is after tax, for a typical single-site operator.
            </p>
          </section>
        )}

        {/* Sanity-§8: apologetic expanded CoverageIndicator banner
            replaced with a quiet inline methodology link. */}
        <section className="mb-10 mt-10">
          <CoverageIndicator
            tier={city.tier === 1 ? "regional" : "estimated"}
            variant="compact"
          />
        </section>

        {/* The old Gini / HDI source-disclosure footnote was removed with the
           heavy hero (2026-06-05): the rebuilt board does not surface Gini or
           HDI, so a disclaimer for absent figures only confused. The board's
           own per-section modeled footnotes carry the honesty now. */}

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
