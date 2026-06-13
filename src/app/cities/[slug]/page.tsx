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
 *   3. Coverage indicator (quiet inline methodology line)
 *   4. CitySignaturePanel (demographics + signature sectors + commercial
 *      streets; culture + government scores are country-only and suppressed
 *      here via showInstitutions=false; null until the city is curated)
 *   5. Neighborhood mini-strip (only if the city has a scheme)
 *   6. Ranked activities table (buildCityActivities: easiest to break in
 *      first; every city resolves through the cell engine, self-omits if thin)
 *   7. Cities-like-this peer comparison (peers by economic similarity, each
 *      with its own headline city score, each linking to that peer's city page)
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
import { CityPeers } from "@/components/cities/CityPeers";
// TopProfitableActivities + MostSaturatedActivities dropped per
// founder direction 2026-05-26. Replaced by CitySignaturePanel
// (demographics + 3 signature sectors + culture spectrums +
// government scores). NYC ships first; other cities show null
// until their data is curated.
import { CitySignaturePanel } from "@/components/cities/CitySignaturePanel";
import { CoverageIndicator } from "@/components/CoverageIndicator";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { BoardHero } from "@/components/board/BoardHero";
import { CityScoreMasthead } from "@/components/board/BreakInScore";
import { MastheadImage } from "@/components/board/MastheadImage";
import { getCityHero, isPatternHero } from "@/lib/images/city_heroes";
import { DataSection } from "@/components/board/DataSection";
import { fmtPct } from "@/components/board/format";
import { TakeHomeValue } from "@/components/monetization/TakeHomeValue";
import { BreakInStrip } from "@/components/cities/BreakInStrip";
import {
  buildCityBoard,
  buildCityActivities,
  buildCityScore,
} from "@/lib/scores/city_board";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { breakInWord } from "@/lib/scores/band_labels";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getNeighborhoodEconomics } from "@/lib/economics/neighborhood_economics";
import { slugToIndustry } from "@/lib/taxonomy";
import { AtlasPictogram } from "@/components/brand/pictograms";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";

export const revalidate = 43200; // 12 hours

/** Band to the per-row break-in badge tone, the EXACT moss / atlas / clay scale
 * the break-in masthead and the country "easiest to break in" panel use, so the
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

/** Up to four neighborhoods to feature per city (founder 2026-06-08), the famous
 * ones everyone knows. Cities absent here fall back to the first four in their
 * scheme. Slugs must match data/cities/neighborhoods_v1.json. */
const FEATURED_NEIGHBORHOODS: Record<string, string[]> = {
  "new-york": ["manhattan-midtown", "brooklyn", "queens", "bronx"],
  london: ["city-of-london", "west-end", "south-bank", "east-london"],
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
  const boardInput = {
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
  };
  const board = buildCityBoard(boardInput);

  // The city's ONE headline score (the founder chose: cities get a headline
  // score; countries and industries do not). Built from the same board signals,
  // banded on the same thresholds as the cell break-in rating so the badge reads
  // identically. Null for a thin city with no demand signal, so the masthead
  // omits the badge cleanly rather than showing a wrong number.
  const cityScore = buildCityScore(boardInput);

  // Ranked activities in this city, easiest to break in first. Every city now
  // resolves through the cell engine: each candidate activity's destination cell
  // is scored through the same break-in path its own masthead uses, kept only
  // when it is a trusted local measurement (so no invented number ranks), and the
  // list self-omits when fewer than three activities resolve. Each row links to
  // that activity's cell page under the city, the same /{iso2}/{slug}/{activity}
  // shape the industry mosaic uses. Async (it reads the engine, budgeted).
  const activities = await buildCityActivities({
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
           is the H1, and the city's ONE headline score (the founder chose:
           cities carry a headline score, countries and industries do not)
           renders as a band-toned badge beneath it, reusing the exact
           BreakInMasthead markup so the badge reads identically to the cell
           page's. It omits entirely for a thin city with no demand signal. The
           country eyebrow keeps the place context the old hero carried.

           The masthead carries the same deliberate exception to the pure-white
           system the country page does: a low-opacity duotone city photo sits
           behind the flag, eyebrow, and title as atmosphere, then fades to
           white so the data board below reads on a clean surface. The image
           self-omits when the city has no resolvable photo (see MastheadImage),
           so the masthead degrades to plain white rather than a broken frame.
           The masthead content sits in a relative layer above the image. */}
        <div className="relative overflow-hidden rounded-2xl">
          <MastheadImage src={mastheadSrc} filter={false} />
          <div className="relative">
            <div className="flex items-center gap-2 pt-4">
              <CountryFlag iso2={city.iso2} className="w-5" />
              <SectionEyebrow size="md">{countryName}</SectionEyebrow>
            </div>
            <BoardHero title={city.name} />
            {cityScore ? (
              <div className="pb-3">
                <CityScoreMasthead score={cityScore} />
              </div>
            ) : null}
            {/* Thin-coverage marker. Tier 2 and Tier 3 cities hold fewer real
               figures, so a quiet, factual chip says so plainly (honest, not
               broken, and not apologetic per the Sanity pass). Flagship Tier 1
               cities omit it. */}
            {city.tier !== 1 ? (
              <div className="pb-3">
                <span className="text-[10px] uppercase tracking-wide font-semibold text-cocoa-700/60 bg-cream-100 border border-parchment rounded-full px-2 py-0.5">
                  Lighter coverage
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* The city data board. Four fixed sections the reader can learn once
           and read on every city, rendered immediately under the masthead.
           Each section always renders all of its rows; a datum we do not hold
           shows as the board's dash, so the page shape never depends on the
           data. */}
        <div className="mt-2">
          {board.map((s) => (
            <DataSection section={s} key={s.key} muteEmpty variant="ruled" />
          ))}
        </div>

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

        {/* The break-in spread: one dot per everyday trade on a 0-100 difficulty
           track, the one branded city signature visualization and the visual
           companion to the Business Climate Score above. Built from the same
           activity scores the ranked table below uses; self-omits below three. */}
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

        {/* Founder direction 2026-05-26: dropped TopProfitableActivities
            (most / least profitable, was sec 6) and MostSaturatedActivities
            (most crowded fields). Replaced by the CitySignaturePanel
            below (demographics + signature sectors + commercial streets).
            The culture-spectrum and government-score blocks are
            country-altitude reads, so showInstitutions is false here and
            those blocks render on the country page only. The business
            formation costs table likewise moved to the country page.
            Renders null when the city has no curated entry in
            city_signature_v1.json. */}
        <CitySignaturePanel
          citySlug={city.slug}
          cityName={city.name}
          iso2={city.iso2}
          showInstitutions={false}
          showStreets={shownNeighborhoods.length === 0}
        />

        {/* Neighborhoods: up to four featured areas (founder 2026-06-08), with the
           full list one click away. The redundant full grid, the "N sub-areas"
           heading, and the "shape of {city}" subtitle were removed. */}
        {shownNeighborhoods.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
              Neighborhoods
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
              Where {city.name} does business
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
              The areas that set the tone, each with its own pace and prices. Open
              one for its street-level numbers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shownNeighborhoods.map((n) => {
                // Merge 2026-06-13: commercial streets fold UNDER their
                // neighborhood. The top prime streets for this area surface on
                // the card, so the city has one places model (neighborhoods)
                // with streets nested, not two overlapping lists.
                const streets = (
                  getNeighborhoodEconomics(city.slug, n.slug)?.prime_streets ?? []
                )
                  .map((s) => s.name)
                  .slice(0, 2);
                return (
                  <Link
                    key={n.slug}
                    href={`/${city.iso2.toLowerCase()}/${city.slug}/${n.slug}`}
                    className="group block rounded-xl border border-parchment hover:border-atlas-500 bg-cream-50 p-4 transition-colors"
                  >
                    <div className="font-medium text-sm text-ink-900 group-hover:text-atlas-700 leading-tight">
                      {n.name}
                    </div>
                    <div className="text-[11px] text-cocoa-700/60 mt-1 capitalize">
                      {n.character.replace(/-/g, " ")}
                    </div>
                    {streets.length > 0 ? (
                      <div className="text-[11px] text-cocoa-700/80 mt-2 leading-snug">
                        {streets.join(", ")}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
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

        {/* Activities in this city, ranked by owner take-home (highest first).
           The masthead score already answers "easiest to break in", so this table
           answers "what earns the most here"; each row still carries the break-in
           badge so ease stays visible. Every city resolves through the cell engine,
           and only trusted local measurements rank, so a row never carries an
           invented number; the list self-omits below three rows. Each row links to
           that activity's full cell benchmark under the city. */}
        {activities.length > 0 && (
          <section className="mt-10">
            <SectionEyebrow>Everyday trades</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mt-1">
              What an owner keeps in {city.name}
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/80 mt-1.5 mb-5 max-w-2xl leading-relaxed">
              The everyday businesses you find in almost any city, and what a
              typical owner keeps after tax in {city.name}. The badge is the same 0
              to 100 break-in read each business shows on its own page, higher means
              easier to get started. Modeled from local business demography.
              Directional.
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
                            className="shrink-0 text-cocoa-700/70 group-hover:text-atlas-700 transition-colors"
                          />
                          <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700 transition-colors">
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
        )}

        {/* Cities like this: a real peer comparison (replaces the old
           restaurants-hardcoded sister-cities ribbon). Peers are chosen by
           economic similarity (size, wealth, cost) with a different-country
           preference and at most one per country, each carries its OWN headline
           0 to 100 city score on the same scale as this page's masthead, and
           each card links to that peer's CITY page. Self-omits below two peers. */}
        <CityPeers citySlug={city.slug} cityName={city.name} />
      </div>
    </article>
  );
}
