/**
 * Metropolis page for any of the top-200 cities.
 *
 * Route: /cities/[slug]
 *
 * Rebuilt on the Atlas Page Kit (WS5, 2026-06-13) to the content-map reading
 * order for a city. The former data-board wall is replaced by an answer-first
 * masthead carrying the city's single Business Climate Score, the honest take,
 * then the founder's city sections in order: who the local customer is
 * (spending power), what shop and office space costs, tourist money vs local
 * money (always rendered), what an owner keeps across the everyday trades, the
 * best areas to set up, the neighbourhoods, how the city is changing, and the
 * rival + peer cities. London is the one fully-filled exemplar; every other city
 * fills from its real figures and self-omits otherwise. A sticky section nav
 * tracks the bands that actually render.
 *
 * The view model (src/lib/cities/city_view.ts) is pure and maps the figures the
 * page already holds into kit props; the heavier wiring (the ranked activities,
 * the neighbourhood grid, the signature panel, the peers) stays in the page.
 *
 * No client JS beyond the sticky nav. revalidate: 12h.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../data/cities/neighborhoods_v1.json";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { CityPeers } from "@/components/cities/CityPeers";
import { buildCityPeers } from "@/lib/scores/city_peers";
import { CitySignaturePanel } from "@/components/cities/CitySignaturePanel";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { breakInWord } from "@/lib/scores/band_labels";
import { BreakInStrip } from "@/components/cities/BreakInStrip";
import {
  buildCityActivities,
  buildCityScore,
} from "@/lib/scores/city_board";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { fmtPct } from "@/components/board/format";
import { TakeHomeValue } from "@/components/monetization/TakeHomeValue";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getNeighborhoodEconomics } from "@/lib/economics/neighborhood_economics";
import { slugToIndustry } from "@/lib/taxonomy";
import { AtlasPictogram } from "@/components/brand/pictograms";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";
import { NeighborhoodCover } from "@/components/cities/NeighborhoodCover";
import {
  AnswerFirstMasthead,
  HonestTakeBox,
  RangeStrip,
  StickySectionNav,
  RealityCheck,
  ContrarianInsight,
  SectionEmpty,
} from "@/components/kit";
import {
  buildCityView,
  cityFmtUsdFull,
  type CityView,
} from "@/lib/cities/city_view";

export const revalidate = 43200; // 12 hours

/** Band to the per-row break-in badge tone, the EXACT moss / atlas / clay scale
 * the score badges and the country "easiest to break in" panel use, so the
 * badge reads identically here. Higher = easier = warmer. Tokens only, no hex. */
function breakInBadge(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "border-moss-300 bg-moss-50 text-moss-700";
    case "manageable":
    case "demanding":
      return "border-atlas-300 bg-atlas-100/60 text-atlas-700";
    case "brutal":
      return "border-clay-300 bg-clay-100/60 text-clay-700";
  }
}

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
  cost_of_living_index?: number; // cost-of-living index, a leading metro = 100
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

/** Up to four neighborhoods to feature per city (founder 2026-06-08), the famous
 * ones everyone knows. Cities absent here fall back to the first four in their
 * scheme. Slugs must match data/cities/neighborhoods_v1.json. */
const FEATURED_NEIGHBORHOODS: Record<string, string[]> = {
  "new-york": ["manhattan-midtown", "brooklyn", "queens", "bronx"],
  london: ["city-of-london", "west-end", "south-bank", "east-london"],
};

/** The curated "best area for which business" read for the London exemplar
 * (sanctioned invented-but-plausible, founder). Each line names a real London
 * district and the trade that genuinely suits it, so the section carries a
 * concrete, found-nowhere-else read rather than a generic template. Every other
 * city self-omits this block until its own areas are curated. */
const BEST_AREAS: Record<string, Array<{ area: string; suits: string; why: string }>> = {
  london: [
    {
      area: "West End",
      suits: "Restaurants, bars, flagship retail",
      why: "The deepest footfall in the country, residents, office workers, and visitors together. Rents match it.",
    },
    {
      area: "City and Canary Wharf",
      suits: "Lunch trade, coffee, quick service",
      why: "A weekday office crowd with money and no time. Dead at the weekend, so build for five days, not seven.",
    },
    {
      area: "East London",
      suits: "Independent food, design studios, third-wave coffee",
      why: "The fastest-growing independent trade, a younger crowd, and rents still below the centre, though climbing.",
    },
    {
      area: "Residential high streets",
      suits: "Salons, clinics, childcare, neighbourhood cafes",
      why: "Steady local demand that does not depend on visitors, and the footfall a hybrid-working week now favours.",
    },
  ],
};

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
    description: `Revenue, employment, and wage benchmarks for small businesses in ${city.name}. Neighborhoods, comparable cities, and industry deep-dives.`,
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

  // Up to four featured neighborhoods (founder 2026-06-08): flagship cities curate
  // which four lead, any other city falls back to the first four in its scheme.
  let shownNeighborhoods: Neighborhood[] = [];
  if (scheme && scheme.neighborhoods.length > 0) {
    const bySlug = new Map(scheme.neighborhoods.map((n) => [n.slug, n]));
    const featured = (FEATURED_NEIGHBORHOODS[city.slug] ?? [])
      .map((s) => bySlug.get(s))
      .filter((n): n is Neighborhood => Boolean(n));
    shownNeighborhoods = (featured.length > 0 ? featured : scheme.neighborhoods).slice(0, 4);
  }

  // Country economics snapshot for the country the city sits in. Drives the
  // spending-power figures and feeds the score, no new query.
  const econSnap = getCountryEconomicsSnapshot(city.iso2);

  // The city's ONE headline score (the founder chose: cities get a headline
  // score; countries and industries do not). Built from the same board signals,
  // banded on the same thresholds as the cell break-in rating so the badge reads
  // identically. Null for a thin city with no demand signal.
  const cityScore = buildCityScore({
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

  // The pure view model: maps the figures above into the kit's section props,
  // in the content-map reading order, fully filling the London exemplar and
  // self-omitting elsewhere. The heavier wiring (activities, neighbourhoods,
  // peers) stays below in the page.
  const view: CityView = buildCityView({
    citySlug: city.slug,
    cityName: city.name,
    countryName,
    tier: city.tier,
    popM: city.pop_m ?? null,
    avgGrossSalaryUsdYear: city.avg_gross_salary_usd_year ?? null,
    costOfLivingIndex: city.cost_of_living_index ?? null,
    touristArrivalsM: city.tourist_arrivals_m ?? null,
    selfEmploymentPct: econSnap.selfEmploymentPct,
    avgMonthlySalary: econSnap.avgMonthlySalary,
    netWealthPerAdult: econSnap.netWealthPerAdult,
    cityScore: cityScore ? { score: cityScore.score, band: cityScore.band } : null,
    hasLondonMarket: city.slug === "london",
  });

  // Ranked activities in this city, by owner take-home (highest first). Every
  // city resolves through the cell engine; only trusted local measurements rank,
  // so a row never carries an invented number, and the list self-omits below
  // three. Each row links to that activity's cell page under the city. Async.
  const activities = await buildCityActivities({
    slug: city.slug,
    countryIso2: city.iso2,
  });

  // The best-areas read: the curated London exemplar, or a self-omit elsewhere.
  const bestAreas = BEST_AREAS[city.slug] ?? null;

  // Peer cities: the same selection CityPeers renders, resolved here so the
  // "peers" section is ALWAYS present (CityPeers itself draws when two or more
  // peers resolve, a calm placeholder otherwise). Mirrors the component's own
  // two-peer floor without regressing it.
  const peerCount = buildCityPeers(city.slug, 3).length;

  // The sticky-nav sections. Every required city section now ALWAYS renders
  // (content or a calm placeholder), so the nav lists all eight, after the lead
  // anchors (overview, the honest take). StickySectionNav drops any genuinely
  // dead anchor on mount, so listing them all is safe.
  const navSections: Array<{ id: string; label: string }> = [
    { id: "headline", label: "Overview" },
    ...(view.honestTake ? [{ id: "honest-take", label: "The honest take" }] : []),
    { id: "customer", label: "The local customer" },
    { id: "space", label: "What space costs" },
    { id: "visitors", label: "Tourist vs local" },
    { id: "owners-keep", label: "What owners keep" },
    { id: "best-areas", label: "Best areas" },
    { id: "neighbourhoods", label: "Neighbourhoods" },
    { id: "changing", label: "How it is changing" },
    { id: "peers", label: "Rival and peer cities" },
  ];

  return (
    <article className="pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6 xl:flex xl:gap-16">
        <div className="min-w-0 xl:flex-1">
          {/* Answer-first masthead, carrying the city's single Business Climate
             Score. The flag + country sit in the eyebrow; the score anchors the
             band on a flagship city and softens to a quiet stat on a thinner
             one. */}
          <AnswerFirstMasthead
            id="headline"
            eyebrow={
              <span className="inline-flex items-center gap-2">
                <CountryFlag iso2={city.iso2} className="w-5" />
                <span>{view.masthead.eyebrow}</span>
              </span>
            }
            tier={view.masthead.tier}
            title={view.masthead.title}
            answer={view.masthead.answer}
            anchor={view.masthead.anchor}
            stats={view.masthead.stats}
            breakIn={view.masthead.climateChip}
          />

          <div className="mt-8 space-y-6 md:space-y-8">
            {/* The honest take, right after the headline numbers. */}
            {view.honestTake ? (
              <HonestTakeBox
                id="honest-take"
                verdict={view.honestTake.verdict}
                points={view.honestTake.points}
              >
                {view.honestTake.body}
              </HonestTakeBox>
            ) : null}

            {/* Who the local customer is: spending power, with a real income
               spread where one exists (the 7-gradation strip). */}
            {view.customer ? (
              <section
                id="customer"
                className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
              >
                <SectionEyebrow className="mb-1">The local customer</SectionEyebrow>
                <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
                  Who you are selling to, and how freely they spend
                </h2>
                {view.customer.note ? (
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700/80 md:text-base">
                    {view.customer.note}
                  </p>
                ) : null}
                <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {view.customer.stats.map((s, i) => (
                    <div key={i}>
                      <dd className="font-display text-2xl font-semibold tabular-nums tracking-tight text-ink-900">
                        {s.value}
                      </dd>
                      <dt className="mt-0.5 text-sm font-medium text-cocoa-700/80">{s.label}</dt>
                      {s.hint ? (
                        <p className="mt-0.5 text-[11px] leading-relaxed text-cocoa-500">{s.hint}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
                {view.customer.incomeSpread ? (
                  <div className="mt-6 border-t border-parchment pt-5">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                      What residents earn a year
                    </p>
                    <RangeStrip
                      p10={view.customer.incomeSpread.p10}
                      p25={view.customer.incomeSpread.p25}
                      p50={view.customer.incomeSpread.p50}
                      p75={view.customer.incomeSpread.p75}
                      p90={view.customer.incomeSpread.p90}
                      format={cityFmtUsdFull}
                    />
                  </div>
                ) : null}
              </section>
            ) : (
              <SectionEmpty
                id="customer"
                eyebrow="Your customer"
                heading="Who the local customer is"
                place={city.name}
              />
            )}

            {/* What shop and office space costs: the commercial-rent character.
               A RealityCheck beat so it reads as an honest read, not a data
               card pretending to a quoted rent. */}
            {view.space ? (
              <div id="space">
                <RealityCheck
                  eyebrow="What space costs"
                  truth={view.space.verdict}
                  body={view.space.body}
                />
                {view.space.stats.length > 0 ? (
                  <dl className="mt-3 grid gap-x-8 gap-y-3 rounded-lg border border-parchment bg-cream-50 px-5 py-4 shadow-subtle sm:grid-cols-2 md:px-7">
                    {view.space.stats.map((s, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-4">
                        <dt className="min-w-0 text-sm text-cocoa-700/90">
                          {s.label}
                          {s.hint ? (
                            <span className="mt-0.5 block text-[11px] text-cocoa-500">{s.hint}</span>
                          ) : null}
                        </dt>
                        <dd className="shrink-0 font-display text-base font-semibold tabular-nums text-ink-900">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ) : (
              <SectionEmpty
                id="space"
                eyebrow="What space costs"
                heading="What shop and office space costs"
                place={city.name}
              />
            )}

            {/* Tourist money vs local money: ALWAYS rendered (founder). The
               split reuses the per-100 stacked bar, read as "where your trade
               comes from" rather than money out. */}
            <div id="visitors">
              <section className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
                <SectionEyebrow className="mb-1">Tourist vs local</SectionEyebrow>
                <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
                  {view.visitorSplit.headline}
                </h2>
                {view.visitorSplit.body ? (
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700/80 md:text-base">
                    {view.visitorSplit.body}
                  </p>
                ) : null}
                {view.visitorSplit.items ? (
                  (() => {
                    // A footfall share (where the trade comes from), NOT money:
                    // render as "n in 100", never dollar-prefixed.
                    const items = view.visitorSplit.items.filter(
                      (it) => typeof it.perHundred === "number" && (it.perHundred as number) >= 0,
                    ) as Array<{ label: string; perHundred: number; kept?: boolean }>;
                    const total = items.reduce((s, it) => s + it.perHundred, 0) || 100;
                    return (
                      <>
                        <div
                          className="mt-5 flex h-5 w-full overflow-hidden rounded-full border border-parchment"
                          role="img"
                          aria-label="Share of trade from residents versus visitors, out of 100."
                        >
                          {items.map((it, i) => (
                            <div
                              key={i}
                              className={it.kept ? "bg-cocoa-300" : "bg-atlas-500"}
                              style={{ width: `${(it.perHundred / total) * 100}%` }}
                              title={`${it.label}: ${Math.round(it.perHundred)} in 100`}
                            />
                          ))}
                        </div>
                        <dl className="mt-4 divide-y divide-parchment border-y border-parchment">
                          {items.map((it, i) => (
                            <div key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                              <dt className="flex items-center gap-2 text-sm text-cocoa-700/90">
                                <span
                                  aria-hidden="true"
                                  className={`h-2.5 w-2.5 rounded-sm ${it.kept ? "bg-cocoa-300" : "bg-atlas-500"}`}
                                />
                                {it.label}
                              </dt>
                              <dd className="shrink-0 font-display text-base font-semibold tabular-nums text-ink-900">
                                {Math.round(it.perHundred)} in 100
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-3 text-[11px] text-cocoa-500">
                          A rough share of where a typical street&apos;s trade comes
                          from, by footfall, not a revenue figure.
                        </p>
                      </>
                    );
                  })()
                ) : null}
              </section>
            </div>

            {/* The break-in spread: one dot per everyday trade on a 0-100
               difficulty track, the branded city-signature visualization and the
               visual companion to the Business Climate Score. Self-omits below
               three trades. */}
            <BreakInStrip
              cityName={city.name}
              items={activities
                .filter((a) => a.breakInScore != null && a.breakInBand != null)
                .map((a) => ({
                  name: a.name,
                  score: a.breakInScore as number,
                  band: a.breakInBand as BreakInBand,
                }))}
            />

            {/* What an owner keeps across the everyday trades. Every city resolves
               through the cell engine; only trusted local measurements rank, so a
               row never carries an invented number; the list self-omits below
               three rows. Each row links to that activity's full cell benchmark
               under the city. */}
            {activities.length > 0 ? (
              <section
                id="owners-keep"
                className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
              >
                <SectionEyebrow className="mb-1">What owners keep</SectionEyebrow>
                <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
                  What an owner keeps in {city.name}
                </h2>
                <p className="mt-1.5 mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700/80 md:text-base">
                  The everyday businesses you find in almost any city, and what a
                  typical owner keeps after tax here. The badge is the same 0 to
                  100 break-in read each business shows on its own page; higher
                  means easier to get started. Modeled from local business
                  demography. Directional.
                </p>
                <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
                  {[
                    activities.slice(0, Math.ceil(activities.length / 2)),
                    activities.slice(Math.ceil(activities.length / 2)),
                  ].map((col, ci) => (
                    <ul
                      key={ci}
                      className="divide-y divide-parchment border-y border-parchment"
                    >
                      {col.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={a.href}
                            className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <AtlasPictogram
                                id={industryPictogramId(slugToIndustry(a.slug)?.id)}
                                size={18}
                                className="shrink-0 text-cocoa-700/70 transition-colors group-hover:text-atlas-700"
                              />
                              <span className="truncate text-sm font-medium text-ink-900 transition-colors group-hover:text-atlas-700">
                                {a.name}
                              </span>
                              {a.breakInScore != null && a.breakInBand != null ? (
                                <span
                                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${breakInBadge(
                                    a.breakInBand,
                                  )}`}
                                >
                                  <span className="tabular-nums">{a.breakInScore}</span>
                                  <span>{breakInWord(a.breakInBand)}</span>
                                </span>
                              ) : null}
                            </span>
                            <span className="flex shrink-0 items-baseline gap-3">
                              {a.netMarginPct != null && (
                                <span className="hidden text-[11px] tabular-nums text-cocoa-500 sm:inline">
                                  {fmtPct(a.netMarginPct)} net
                                </span>
                              )}
                              <span className="font-display text-base font-semibold tabular-nums text-ink-900">
                                <TakeHomeValue takeHome={a.takeHome} cellHref={a.href} />
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-cocoa-500">
                  Owner take-home is after tax, for a typical single-site operator.
                </p>
              </section>
            ) : (
              <SectionEmpty
                id="owners-keep"
                eyebrow="What owners keep"
                heading="What an owner keeps across the everyday trades"
                place={city.name}
              />
            )}

            {/* The best areas to set up: which neighbourhood suits which
               business. The curated London exemplar; self-omits elsewhere until
               a city's own areas are curated. */}
            {bestAreas ? (
              <section
                id="best-areas"
                className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
              >
                <SectionEyebrow className="mb-1">Best areas</SectionEyebrow>
                <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
                  Where to set up, by what you are opening
                </h2>
                <p className="mt-1.5 mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700/80 md:text-base">
                  No single area suits every business. These are the parts of {city.name} that fit a given trade, and the reason they do.
                </p>
                <ul className="divide-y divide-parchment border-y border-parchment">
                  {bestAreas.map((a) => (
                    <li key={a.area} className="py-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-display text-base font-semibold text-ink-900">
                          {a.area}
                        </span>
                        <span className="text-sm font-medium text-atlas-700">{a.suits}</span>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cocoa-700/85">
                        {a.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <SectionEmpty
                id="best-areas"
                eyebrow="Best areas"
                heading="The best areas to set up"
                place={city.name}
              />
            )}

            {/* Signature panel: demographics + signature sectors + commercial
               streets. Culture + government are country-altitude reads, so
               showInstitutions is false here; streets fold under neighbourhoods
               when a scheme exists. Null until a city is curated. */}
            <CitySignaturePanel
              citySlug={city.slug}
              cityName={city.name}
              iso2={city.iso2}
              showInstitutions={false}
              showStreets={shownNeighborhoods.length === 0}
            />

            {/* Neighbourhoods: up to four featured areas, with the full list one
               click away. The drilled-down districts, clickable, real flavour. */}
            {shownNeighborhoods.length > 0 ? (
              <section
                id="neighbourhoods"
                className="rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6"
              >
                <SectionEyebrow className="mb-1">Neighbourhoods</SectionEyebrow>
                <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
                  Where {city.name} does business
                </h2>
                <p className="mt-1.5 mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700/80 md:text-base">
                  The areas that set the tone, each with its own pace and prices.
                  Open one for its street-level numbers.
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {shownNeighborhoods.map((n) => {
                    const streets = (
                      getNeighborhoodEconomics(city.slug, n.slug)?.prime_streets ?? []
                    )
                      .map((s) => s.name)
                      .slice(0, 2);
                    return (
                      <Link
                        key={n.slug}
                        href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}`}
                        className="group block overflow-hidden rounded-xl border border-parchment bg-white shadow-subtle transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift"
                      >
                        <NeighborhoodCover
                          name={n.name}
                          seed={`${city.slug}-${n.slug}`}
                          className="h-20"
                        />
                        <div className="p-4">
                          <div className="text-sm font-medium leading-tight text-ink-900 group-hover:text-atlas-700">
                            {n.name}
                          </div>
                          <div className="mt-1 text-[11px] capitalize text-cocoa-700/60">
                            {n.character.replace(/-/g, " ")}
                          </div>
                          {streets.length > 0 ? (
                            <div className="mt-2 text-[11px] leading-snug text-cocoa-700/80">
                              {streets.join(", ")}
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/cities/${city.slug}/neighborhoods`}
                    className="text-sm font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:decoration-atlas-700"
                  >
                    Explore all neighbourhoods &rarr;
                  </Link>
                </div>
              </section>
            ) : (
              <SectionEmpty
                id="neighbourhoods"
                eyebrow="Neighbourhoods"
                heading="The districts, drilled down"
                place={city.name}
              />
            )}

            {/* How the city is changing: a real direction, or an honest
               self-omit. The London exemplar fills it; every other city stays
               silent rather than printing a speculative trend. */}
            {view.changing ? (
              <div id="changing">
                <ContrarianInsight
                  eyebrow="How it is changing"
                  insight={view.changing.verdict}
                  body={view.changing.body}
                />
                {view.changing.points.length > 0 ? (
                  <ul className="mt-3 space-y-2.5 rounded-lg border border-parchment bg-cream-50 px-5 py-4 shadow-subtle md:px-7">
                    {view.changing.points.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-cocoa-700/90 md:text-base"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cocoa-500"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <SectionEmpty
                id="changing"
                eyebrow="How it is changing"
                heading="How the city is changing"
                place={city.name}
              />
            )}

            {/* Rival + peer cities: a real peer comparison, each carrying its OWN
               headline city score on the same scale as this page, each linking to
               that peer's city page. Self-omits below two peers. */}
            {peerCount >= 2 ? (
              <div id="peers">
                <CityPeers citySlug={city.slug} cityName={city.name} />
              </div>
            ) : (
              <SectionEmpty
                id="peers"
                eyebrow="Rival and peer cities"
                heading="Rival and peer cities"
                place={city.name}
              />
            )}
          </div>
        </div>

        <StickySectionNav sections={navSections} />
      </div>
    </article>
  );
}
