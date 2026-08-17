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
import cityListJson from "../../../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../../../data/cities/neighborhoods_v1.json";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { CityPeers } from "@/components/cities/CityPeers";
import { buildCityPeers } from "@/lib/scores/city_peers";
import { CitySignaturePanel } from "@/components/cities/CitySignaturePanel";
import { CityWatchAction } from "@/components/cities/CityWatchAction";
import type { WatchInput } from "@/lib/watch_store";
import { breakInWord } from "@/lib/scores/band_labels";
import {
  buildCityActivities,
  buildCityScore,
} from "@/lib/scores/city_board";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getNeighborhoodEconomics } from "@/lib/economics/neighborhood_economics";
import {
  NeighborhoodCover,
  spreadCoverIndexes,
} from "@/components/cities/NeighborhoodCover";
import { CityDistrictPicker, type DistrictSummary } from "@/components/cities/CityDistrictPicker";
import {
  getNeighborhoodMultiplier,
  hasNeighborhoodIntensity,
  tagLabel,
} from "@/lib/economics/neighborhood_multipliers";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import {
  AnswerFirstMasthead,
  BeatCard,
  HonestTakeBox,
  RangeStrip,
  StickySectionNav,
  RealityCheck,
  ContrarianInsight,
  SectionEmpty,
  ScoreBand,
  VisitorSplit,
  ComparisonBars,
  OwnerKeepTable,
  OneThing,
  VsWorld,
  ZoomControl,
  type ComparisonItem,
  type OwnerKeepTrade,
  type ChipTone,
  type ZoomHrefs,
} from "@/components/kit";
import {
  buildCityView,
  cityFmtUsdFull,
  type CityView,
} from "@/lib/cities/city_view";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineShell } from "@/components/spine/shell";
import { SpineCityBody } from "@/components/spine/city/city-view";
import { buildSpineCitySeed } from "@/lib/spine/adapt_city";

export const revalidate = 43200; // 12 hours

/** The city activities' break-in band to the OwnerKeepTable chip tone. The kit's
 * MeaningChip speaks easy / moderate / hard / neutral (meaning-only colour); the
 * four break-in bands fold onto it so the table chip reads the same easier-is-
 * warmer scale the per-row badge used to. Higher band = easier. */
function breakInChipTone(band: BreakInBand): ChipTone {
  switch (band) {
    case "forgiving":
      return "easy";
    case "manageable":
      return "moderate";
    case "demanding":
      return "hard";
    case "brutal":
      return "hard";
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
  const title = `${city.name} small business benchmarks | Margin Atlas`;
  const description = `Revenue, employment, and wage benchmarks for small businesses in ${city.name}. Neighborhoods, comparable cities, and industry deep-dives.`;
  const ogPath = `/og/city?slug=${encodeURIComponent(city.slug)}`;
  // Built from the RESOLVED city, not the raw param, so the canonical is the
  // slug this page actually rendered. Without an `alternates` of its own this
  // route inherited the root layout's `canonical: "/"` and all 252 city pages
  // told a crawler they were the home page.
  const canonical = `/cities/${city.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    // title, description and images are all repeated below rather than
    // inherited. Next resolves metadata per KEY by replacement, not by deep
    // merge, so declaring openGraph at all discards the root layout's
    // openGraph, images included. Same for twitter. See the note in
    // src/app/layout.tsx.
    openGraph: {
      title,
      description,
      images: [{ url: ogPath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogPath],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Spine reform (flag-gated, default OFF). On promotion the body renders REAL, reconciled
  // data from buildSpineCitySeed (the same accessors this route runs below, plus the real
  // neighborhood engine), never the illustrative seed. When the adapter finds no city it
  // returns undefined; we notFound() to match the non-spine page. Flag OFF path untouched.
  if (isSpineReformEnabledFor("city")) {
    const spineData = await buildSpineCitySeed(slug);
    if (!spineData) notFound();
    return (
      <SpineShell>
        <SpineCityBody data={spineData} />
      </SpineShell>
    );
  }

  const city = CITIES_BY_SLUG.get(slug);
  if (!city) notFound();

  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  const scheme = NEIGHBORHOODS[city.slug];
  let allDistricts: DistrictSummary[] = [];

  // Up to four featured neighborhoods (founder 2026-06-08): flagship cities curate
  // which four lead, any other city falls back to the first four in its scheme.
  let shownNeighborhoods: Neighborhood[] = [];
  /* One cover ramp per featured district, spread so no two of the four draw the
     same gradient. Computed once here rather than inside the map, which would
     recompute the whole row per tile. */
  let coverIndexes: number[] = [];
  if (scheme && scheme.neighborhoods.length > 0) {
    const bySlug = new Map(scheme.neighborhoods.map((n) => [n.slug, n]));
    const featured = (FEATURED_NEIGHBORHOODS[city.slug] ?? [])
      .map((s) => bySlug.get(s))
      .filter((n): n is Neighborhood => Boolean(n));
    shownNeighborhoods = (featured.length > 0 ? featured : scheme.neighborhoods).slice(0, 4);
    coverIndexes = spreadCoverIndexes(
      shownNeighborhoods.map((n) => `${city.slug}-${n.slug}`),
    );

    /* EVERY district, for the picker section. The four above are a visual
       entry point with cover art; this is the complete set, and it is where
       the 25,320 district-by-trade pages moved to on 2026-08-08. Computed on
       the server so the client component fetches nothing. */
    allDistricts = scheme.neighborhoods.map((n) => {
      const mult = getNeighborhoodMultiplier(city.slug, n.slug, "restaurants");
      const flavor = getNeighborhoodFlavor(city.slug, n.slug);
      return {
        slug: n.slug,
        name: n.name,
        character: n.character,
        blurb: flavor?.character_paragraph ?? n.description ?? null,
        pct: Math.round((mult.final - 1) * 100),
        clipped: mult.clipped,
        commuter: mult.commuter,
        tourism: mult.tourism,
        tags: mult.tags,
        tagLabels: hasNeighborhoodIntensity(city.slug, n.slug)
          ? mult.appliedTags.filter((t) => t !== "residential_only").map(tagLabel)
          : [],
        /* Fifth and last copy of the same broken URL. This one feeds
           CityDistrictPicker's "Everything in {district}" link, which is the
           most prominent of the lot. /{country}/{city}/{district} is the TRADE
           route with a district in the industry slot; the district's entry on
           the neighbourhoods hub is the page that actually holds it. */
        href: `/cities/${city.slug}/neighborhoods#${n.slug}`,
      } satisfies DistrictSummary;
    });
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

  // Peer cities: the same selection CityPeers renders, resolved here so the
  // "peers" section is ALWAYS present (CityPeers itself draws when two or more
  // peers resolve, a calm placeholder otherwise) AND so the peers that carry
  // their own climate score can drive a like-for-like ComparisonBars beside the
  // cards, and seed the masthead ScoreBand's context ticks. Mirrors the
  // component's own two-peer floor without regressing it.
  const peers = buildCityPeers(city.slug, 3);
  const peerCount = peers.length;
  const scoredPeers = peers.filter(
    (p): p is typeof p & { score: number } => typeof p.score === "number",
  );

  // The median climate score across the peers that carry their own score, the
  // like-for-like figure for the VsWorld block below: this city's OWN 0 to 100
  // climate score against the middle of its already-resolved peers, the same
  // scored entity on the same scale, never the revenue aggregate. Null when no
  // peer is scored (the block then shows its honest empty state).
  const peerMedianScore: number | null = (() => {
    if (scoredPeers.length === 0) return null;
    const sorted = scoredPeers.map((p) => p.score).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  })();

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
    peerScores: scoredPeers.map((p) => p.score),
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

  // The sticky-nav sections. Every required city section now ALWAYS renders
  // (content or a calm placeholder), so the nav lists all eight, after the lead
  // anchors (overview, the honest take). StickySectionNav drops any genuinely
  // dead anchor on mount, so listing them all is safe.
  const navSections: Array<{ id: string; label: string }> = [
    { id: "headline", label: "Overview" },
    // The honest take is always present (filled or a calm placeholder), so the
    // anchor is always listed.
    { id: "honest-take", label: "The honest take" },
    { id: "customer", label: "The local customer" },
    { id: "space", label: "What space costs" },
    { id: "visitors", label: "Tourist vs local" },
    { id: "owners-keep", label: "What owners keep" },
    { id: "best-areas", label: "Best areas" },
    { id: "neighbourhoods", label: "Neighbourhoods" },
    { id: "changing", label: "How it is changing" },
    { id: "peers", label: "Rival and peer cities" },
  ];

  // The altitude ladder for this place. A city has no single trade, so the
  // place coordinate (this city, in its country) is what stays sticky, and the
  // ladder offers only the two place altitudes that genuinely resolve: up to
  // the whole country, and the current "whole city" rung. The business and
  // neighbourhood altitudes are trade-specific, so they are omitted here (no
  // single trade to hold), keeping the control honest. The country href is the
  // canonical country page (iso2 lowercased); the city href is this page.
  const zoomHrefs: ZoomHrefs = {
    country: `/${city.iso2.toLowerCase()}`,
    city: `/cities/${city.slug}`,
  };

  // The masthead "keep this city" item (kind "city"): the whole place flagged
  // to come back to. The second line carries the climate band word when the
  // city is scored, else a plain "City level" so the row always reads honestly.
  const cityWatchItem: WatchInput = {
    kind: "city",
    slug: city.slug,
    label: `${city.name}, ${countryName}`,
    href: `/cities/${city.slug}`,
    sub: cityScore
      ? `${breakInWord(cityScore.band)} climate`
      : "City level",
  };

  return (
    <article className="pb-16">
      {/* Altitude ladder for this place: the same city held sticky, stepping out
         to the whole country and resting at the whole-city rung. A city has no
         single trade, so the place coordinate is what the ladder keeps; the
         trade-specific business and neighbourhood altitudes are omitted. Server-
         renderable, reversible, costs nothing to hydrate. */}
      <ZoomControl
        trade={countryName}
        place={city.name}
        altitude="city"
        hrefs={zoomHrefs}
      />
      {/* No max-width and no padding of its own. SiteChrome's <main> already
         gives this route `max-w-content mx-auto px-6`, so the former
         `mx-auto max-w-6xl px-4 md:px-6` here was a second column cap INSIDE the
         first and a second gutter on top of the first: 1024px of content where
         every sibling page type reads at 1072, and the only doubled padding on
         the site. This is now a bare flex row. */}
      <div className="xl:flex xl:gap-16">
        <div className="min-w-0 xl:flex-1">
          {/* THE HERO, in ONE card.
             Was `<HeroWash category="city">`, which paints `.atlas-wash--city`:
             an OPAQUE `var(--atlas-surface-paper)` ground with an amber radial
             over it. Two separate faults in one wrapper. The opaque ground sat
             across the full width of the reading column at the very top of every
             city page, painting out the fixed photograph exactly where the
             founder says the picture must still read; and amber is not in the
             palette (terracotta plus cool neutrals only).
             The replacement is the mechanism the founder named: legibility is a
             property of the CARD, not of a band behind it. The masthead, the
             keep-this-city action and the climate band are one `.atlas-card`,
             which is translucent at .955 so the photograph still reads at its
             edges, is `position: relative` so it sits ABOVE the fixed frame
             layers rather than under them, and carries the site's one card
             treatment instead of a fourth hand-rolled surface.
             Folding the score band into the same card also retires a flat
             `border-parchment bg-cream-50` hand-roll and makes the hero read as
             one answer rather than two stacked slabs. */}
          <div className="atlas-card px-5 pb-6 md:px-7 md:pb-7">
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

            {/* Keep this whole city on the watch list, the one durable
               affordance the masthead carries. A city has no single take-home,
               so there is no make-it-yours here; the reader flags the place and
               moves on, the floating tray holds the shortlist. */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CityWatchAction item={cityWatchItem} />
            </div>

            {/* The Business Climate Score as a calm 0-100 band: the plain climate
               word, the four threshold words quietly under the track, and the
               peer cities below shown as context ticks. Self-omits on an unscored
               city (the masthead already softens that case). */}
            {view.scoreBand ? (
              <div className="mt-6 border-t border-parchment pt-6">
                <ScoreBand
                  score={view.scoreBand.score}
                  label={view.scoreBand.label}
                  tone={view.scoreBand.tone}
                  bands={view.scoreBand.bands}
                  peers={view.scoreBand.peers.length > 0 ? view.scoreBand.peers : null}
                  hint={view.scoreBand.hint}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-8 space-y-6 md:space-y-8">
            {/* The honest take, right after the headline numbers. The brand
               heartbeat box is ALWAYS present: on a thin city with no read yet it
               falls back to the calm SectionEmpty placeholder rather than
               silently vanishing, so the through-line never disappears. */}
            {view.honestTake ? (
              <HonestTakeBox
                id="honest-take"
                verdict={view.honestTake.verdict}
                points={view.honestTake.points}
              >
                {view.honestTake.body}
              </HonestTakeBox>
            ) : (
              <SectionEmpty
                id="honest-take"
                eyebrow="The honest take"
                heading={`The honest take on ${city.name}`}
                place={city.name}
              />
            )}

            {/* Who the local customer is: spending power, with a real income
               spread where one exists (the 7-gradation strip). */}
            {view.customer ? (
              <BeatCard
                id="customer"
                eyebrow="The local customer"
                heading="Who you are selling to, and how freely they spend"
              >
                {view.customer.note ? (
                  <p className="max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
                    {view.customer.note}
                  </p>
                ) : null}
                <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {view.customer.stats.map((s, i) => (
                    <div key={i}>
                      <dd className="font-display text-2xl font-semibold tabular-nums tracking-tight text-ink-900">
                        {s.value}
                      </dd>
                      <dt className="mt-0.5 text-sm font-medium text-cocoa-700">{s.label}</dt>
                      {s.hint ? (
                        <p className="mt-0.5 text-[11px] leading-relaxed text-cocoa-500">{s.hint}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
                {/* The spread, and the heading is doing real work now. It read
                    "What residents earn a year" directly under a stat reading
                    "Average pay each month", so one card carried one quantity
                    in two units and the reader had to reconcile "$5K" against
                    a TYPICAL tick of "$57,024" with nothing on the page
                    connecting them. The stat above is now the same year, and
                    this heading says the strip is that average spread out
                    rather than a second answer to the same question. The
                    caption comes from the view beside the numbers themselves,
                    so the words and the figures cannot drift. */}
                {view.customer.incomeSpread ? (
                  <div className="mt-6 border-t border-parchment pt-5">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                      How that pay spreads, a year
                    </p>
                    <RangeStrip
                      p10={view.customer.incomeSpread.p10}
                      p25={view.customer.incomeSpread.p25}
                      p50={view.customer.incomeSpread.p50}
                      p75={view.customer.incomeSpread.p75}
                      p90={view.customer.incomeSpread.p90}
                      format={cityFmtUsdFull}
                      caption={view.customer.spreadCaption}
                    />
                  </div>
                ) : null}
              </BeatCard>
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
                  <dl className="atlas-card mt-3 grid gap-x-8 gap-y-3 px-5 py-4 sm:grid-cols-2 md:px-7">
                    {view.space.stats.map((s, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-4">
                        <dt className="min-w-0 text-sm text-cocoa-700">
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
               hand-rolled stacked bar is now the kit VisitorSplit: one honest
               proportion bar where the DOMINANT slice (the steady resident-and-
               worker trade, per the copy) carries the lone accent. It is a
               footfall share, not money, so the note keeps that clear. When no
               split is estimable the section keeps its headline + body prose. */}
            <BeatCard
              id="visitors"
              eyebrow="Tourist vs local"
              heading={view.visitorSplit.headline}
            >
              <>
                {view.visitorSplit.body ? (
                  <p className="max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
                    {view.visitorSplit.body}
                  </p>
                ) : null}
                {view.visitorSplit.items ? (
                  (() => {
                    // The view carries the two slices as per-100 footfall shares
                    // (resident slice flagged `kept`); feed them to VisitorSplit
                    // as the resident/visitor magnitudes so the chart tints
                    // whichever side is the steady money, and keeps the labels.
                    const items = view.visitorSplit.items;
                    const res = items.find((it) => it.kept);
                    const vis = items.find((it) => !it.kept);
                    return (
                      <VisitorSplit
                        className="mt-5"
                        resident={res?.perHundred ?? null}
                        visitor={vis?.perHundred ?? null}
                        residentLabel={res?.label ?? "Residents and workers"}
                        visitorLabel={vis?.label ?? "Visitors"}
                        eyebrow="Where the trade comes from"
                        note="A rough share of where a typical street's trade comes from, by footfall, not a revenue figure."
                      />
                    );
                  })()
                ) : null}
              </>
            </BeatCard>

            {/* What an owner keeps across the everyday trades. Every city resolves
               through the cell engine; only trusted local measurements rank, so a
               row never carries an invented number; the list self-omits below
               three rows. Each row links to that activity's full cell benchmark
               under the city. This is now the kit OwnerKeepTable: trades ranked by
               take-home, the break-in read on each row as a meaning chip (no longer
               a separate BreakInStrip header AND a per-row badge, so the break-in
               signal shows ONCE), and the net margin %. The table self-omits when
               nothing is held, but the page still gates the whole section on three
               real reads so a thin city falls to the calm SectionEmpty instead. */}
            {activities.length > 0 ? (
              <BeatCard
                id="owners-keep"
                eyebrow="What owners keep"
                heading={`What an owner keeps in ${city.name}`}
              >
                {/* 47 words down to 22, and nothing a reader needed is gone.
                    "The everyday businesses you find in almost any city, and
                    what a typical owner keeps after tax here" restated the
                    table's own caption two elements below it, and the sentence
                    explaining the break-in chip restated the chip's column
                    header. What survives is the read, the direction of the ease
                    scale, and the provenance, which is the one part that is
                    load-bearing rather than descriptive. */}
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
                  What a typical owner keeps here, trade by trade. A higher ease
                  score means an easier start. Modeled from local business
                  demography, directional.
                </p>
                <OwnerKeepTable
                  framed={false}
                  trades={activities.map(
                    (a): OwnerKeepTrade => ({
                      trade: a.name,
                      href: a.href,
                      ease: a.breakInBand ? breakInChipTone(a.breakInBand) : undefined,
                      easeLabel:
                        a.breakInScore != null && a.breakInBand != null
                          ? `${a.breakInScore} ${breakInWord(a.breakInBand)}`
                          : undefined,
                      margin: a.netMarginPct,
                      takeHome: a.takeHome,
                    }),
                  )}
                  caption="Owner take-home is after tax, for a typical single-site operator."
                />
              </BeatCard>
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
              /* The one section on this page that is pure prose: four rows of
                 area, trade and reason, with no figure, no chart and no cover
                 art. It is where a mark earns its place rather than decorates,
                 and `neighborhood-street` is the kit's own spot for exactly
                 this read ("the few blocks that set the tone, where a trade
                 lives or dies"). BeatCard hosts it top-right, and hides it
                 below the sm breakpoint, so the phone layout is untouched.
                 Restraint is the kit's documented rule: signature beats only,
                 which is why this is the page's one spot and not eleven. */
              <BeatCard
                id="best-areas"
                eyebrow="Best areas"
                heading="Where to set up, by what you are opening"
                spot="neighborhood-street"
              >
                {/* The second sentence restated the heading, so it is gone. */}
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
                  No single area suits every business. These are the parts of {city.name} that fit a given trade.
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
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cocoa-700">
                        {a.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </BeatCard>
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
              <BeatCard
                id="neighbourhoods"
                eyebrow="Neighbourhoods"
                heading={`Where ${city.name} does business`}
              >
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
                  The areas that set the tone, each with its own pace and prices.
                  Open one for its street-level numbers.
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {shownNeighborhoods.map((n, i) => {
                    const streets = (
                      getNeighborhoodEconomics(city.slug, n.slug)?.prime_streets ?? []
                    )
                      .map((s) => s.name)
                      .slice(0, 2);
                    return (
                      /* Was /{country}/{city}/{district}, which is the TRADE
                         route with a district slug in the industry slot: 191 of
                         194 district slugs 404 there, three open a trade page.
                         It goes to the district's own entry on the
                         neighbourhoods hub now, by anchor, which is the only
                         page that actually holds it. */
                      <Link
                        key={n.slug}
                        href={`/cities/${city.slug}/neighborhoods#${n.slug}`}
                        className="group block overflow-hidden rounded-xl border border-parchment bg-white transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift"
                      >
                        {/* The cover carries no label here: the card body
                            three lines down prints the same name, and both
                            were drawing it. See NeighborhoodCover's
                            `showLabel`.

                            `coverIndex` comes from the row-wide spread computed
                            above. Without it, London drew City of London and
                            West End on the SAME gradient, byte for byte, two
                            tiles apart: four names hashing into six buckets
                            collide more often than not. See
                            `spreadCoverIndexes`. */}
                        <NeighborhoodCover
                          name={n.name}
                          seed={`${city.slug}-${n.slug}`}
                          className="h-20"
                          showLabel={false}
                          coverIndex={coverIndexes[i]}
                        />
                        <div className="p-4">
                          <div className="text-sm font-medium leading-tight text-ink-900 group-hover:text-atlas-700">
                            {n.name}
                          </div>
                          <div className="mt-1 text-[11px] capitalize text-cocoa-500">
                            {n.character.replace(/-/g, " ")}
                          </div>
                          {streets.length > 0 ? (
                            <div className="mt-2 text-[11px] leading-snug text-cocoa-700">
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
              </BeatCard>
            ) : (
              <SectionEmpty
                id="neighbourhoods"
                eyebrow="Neighbourhoods"
                heading="The districts, drilled down"
                place={city.name}
              />
            )}

            {/* The complete district set, one open at a time. This is where the
               25,320 district-by-trade URLs went: they were 90% of the sitemap
               and shared 95% of their text with each other. */}
            <CityDistrictPicker cityName={city.name} districts={allDistricts} />

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
                  <ul className="atlas-card mt-3 space-y-2.5 px-5 py-4 md:px-7">
                    {view.changing.points.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed text-cocoa-700 md:text-base"
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
               that peer's city page. Self-omits below two peers. Where this city
               AND its peers each carry a climate score, a ComparisonBars sits
               above the cards: a like-for-like ranking on the ONE shared 0-100
               scale (one axis held constant, so a leader mark is honest), the
               subject city the lone accent. The cards stay below for the flags,
               continents, and the step-sideways links. */}
            {peerCount >= 2 ? (
              <div id="peers" className="space-y-4">
                {cityScore && scoredPeers.length >= 1
                  ? (() => {
                      const items: ComparisonItem[] = [
                        { label: city.name, value: cityScore.score, highlight: true },
                        ...scoredPeers.map((p) => ({ label: p.name, value: p.score })),
                      ];
                      return (
                        <div className="atlas-card px-5 py-5 md:px-7">
                          <ComparisonBars
                            items={items}
                            label="Business Climate Score, this city and its peers"
                            format={(n) => `${Math.round(n)}`}
                            caveat="Each city's own 0 to 100 climate score, higher is friendlier to a small business. The same scale as this page."
                          />
                        </div>
                      );
                    })()
                  : null}
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

            {/* This city's OWN climate score against the median of its already-
               resolved peer cities: a real like-for-like, the same scored entity
               on the same 0 to 100 scale as this page, never the revenue
               aggregate. Always present (the block carries its own honest empty
               state): here/world fall to null on an unscored city or one with no
               scored peer, so it reads "not held yet" rather than vanishing. No
               new section id, the eight city anchors are untouched. */}
            {(() => {
              const haveBoth = cityScore != null && peerMedianScore != null;
              return (
                <div className="atlas-card px-5 py-5 md:px-7">
                  <VsWorld
                    eyebrow="Versus its peers"
                    here={haveBoth ? cityScore.score : null}
                    world={haveBoth ? peerMedianScore : null}
                    metric="business climate score"
                    hereLabel={city.name}
                    worldLabel="Peer median"
                    hereDisplay={haveBoth ? String(Math.round(cityScore.score)) : null}
                    worldDisplay={haveBoth ? String(Math.round(peerMedianScore)) : null}
                    caveat="Each city's own 0 to 100 climate score, the same scale as this page."
                  />
                </div>
              );
            })()}

            {/* The one thing to remember: the city's read reused as the close. */}
            <OneThing id="one-thing" lastChecked="June 2026">
              {view.masthead.answer}
            </OneThing>
          </div>
        </div>

        <StickySectionNav sections={navSections} />
      </div>
    </article>
  );
}
