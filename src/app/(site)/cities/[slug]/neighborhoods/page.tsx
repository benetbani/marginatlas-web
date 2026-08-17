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
    /* No column cap and no gutter of its own: SiteChrome's <main> already gives
       this route `max-w-content mx-auto px-6`. `max-w-5xl mx-auto px-4 md:px-6`
       here made a 976px column inside the site's 1072, the third instance of the
       same doubled-padding defect in this tree. */
    <article className="pb-16 pt-8 md:pt-12">
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
          /* THE FOUR-COLOUR SCALE IS GONE, and it was two banned hues.
             `multColor` ran moss-700 / moss-500 / delta.caution / delta.negative,
             i.e. two greens and two ambers, on the revenue multiplier of every
             district on all 252 of these pages. The palette is terracotta plus
             cool neutrals; green and amber are named bans.
             It is deleted rather than recoloured, because the colour was
             duplicating the sign. The figure already prints "+18%" or "-12%",
             so the reader has the direction before any hue reaches them, and a
             four-step ramp implied a precision the model does not hold (43 of
             1,266 districts sit exactly on the 3.0 clip). The figure now sets
             in ink like every other number in the atlas. */
          return (
            /* NOT A LINK, and it never usefully was. This card wrapped
               /{country}/{city}/{district}, and there is no district route:
               three segments is the TRADE route, so 191 of the 194 district
               slugs 404 and three open a trade page at 200 (garden-district ->
               building & garden supply stores).

               There is nothing to point it at either. The only page below a
               district is /{country}/{city}/{district}/{trade}, which needs a
               trade this card cannot honestly choose: the headline trade is
               derived from a character that is template-assigned on 209 of the
               252 cities.

               So the card is what it always should have been. It IS the
               district's detail, not a door to it: name, character,
               multiplier breakdown, trades, streets. Nothing is lost but a
               404. */
            <div
              key={n.slug}
              id={n.slug}
              /* Canonical surface, and the fix is structural as well as visual.
                 Was `rounded-2xl border border-parchment bg-white`, a STATIC
                 element with a background: AtlasFrame paints its photograph from
                 fixed layers at z-index 0, and CSS paints positioned elements
                 after the backgrounds of static ones, so every district card on
                 every one of these pages was drawn UNDERNEATH the picture and
                 read as a washed patch of sky. `.atlas-card` is
                 `position: relative`, so it sits on top, and its .955 fill lets
                 the photograph read through instead of blocking it. */
              className="atlas-card scroll-mt-24 group p-5 md:p-6"
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
                      {/* "at least" when the figure is the model's bound rather
                          than a reading. getNeighborhoodMultiplier clips at 3.0,
                          and 43 of the 1,266 districts land exactly there,
                          including Manhattan FiDi, Midtown, SoHo/Tribeca, the
                          City of London and the West End. So the most-looked-at
                          districts were the ones printing a bare +200%, which
                          reads as a measurement and is a ceiling.

                          The convention is not invented here: CityDistrictPicker
                          and DivergingBars both already prefix "at least " on
                          the same flag, and the city page passes `clipped`
                          through for exactly this. This page computed the same
                          multiplier and dropped the qualifier. */}
                      <div className="font-display text-xl font-semibold tabular-nums leading-none text-ink-900">
                        {mult.clipped ? "at least " : ""}
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
            </div>
          );
        })}
      </div>
    </article>
  );
}
