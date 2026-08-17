/**
 * State/region landing page.
 *
 * Handles URLs like `/us/california`, `/de/de2`, etc. The region page is an
 * INDEX into its cities: the defensible numbers live at the city level, so the
 * region reads as "here is this region, here are its cities, go into one." It
 * renders:
 *   - Hero with region name + flag
 *   - The best/hardest-activities lede (synthesis, self-omits when thin)
 *   - The region's cities (curated, cards linking to city pages) as the
 *     primary content
 *
 * It no longer surfaces a top-industries list. That block showed the country's
 * top industries on every region of a country (the same nine everywhere, a
 * known misrepresentation), so it was removed; the cities now carry the page.
 *
 * Previously /us/california returned 404 because no route matched the
 * [country]/[geo] 2-segment pattern. This page adds that.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { COUNTRIES, INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { getTopIndustriesForCountry, getCellBySlug, withBudget } from "@/lib/cells";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { buildEasiestToBreakIn, type PlaceActivityCell } from "@/lib/scores/country_board";
import { EasiestToBreakIn } from "@/components/countries/EasiestToBreakIn";
import { CountryFlag } from "@/components/CountryFlag";
import { CITIES_BY_STATE } from "@/lib/cities/city_aliases_generated";
import { iso2ToName } from "@/lib/countries";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
// The resolver for "does a page exist for this place", pure and database-free.
// generateMetadata below asks it for this route's canonical rather than pasting
// one together from the two params; see the note there.
import { geoPageTarget } from "@/lib/geo/page_targets";
import { getNeighborhoodsForCity } from "@/lib/cities/neighborhoods";
// City character. Renders only when this geo has
// a hand-curated entry in src/lib/places/city_character.ts. Self-suppresses
// for cities without entries (most cities in v1).
import { CityCharacter } from "@/components/sections/CityCharacter";
// Place-level decision lede (bible Section 5, the City page row). Pure
// synthesis module + warm server component, the same established pattern as
// the country, industry, and cell verdicts.
import { generateGeoVerdict } from "@/lib/scores/geo_verdict";
import { GeoViabilityLede } from "@/components/geo/GeoViabilityLede";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";
import { SpineShell } from "@/components/spine/shell";
import { SpineCityBody } from "@/components/spine/city/city-view";
import { SiteChrome } from "@/components/SiteChrome";

// Curated, cross-country-stable margin shape per activity (the same table the
// industry page uses). Read at module scope so the lookup is a plain object
// access, no query. Net/gross/asset are structural ratios that hold across
// places; the geo page joins them to its locally-typical revenue to rank which
// activities actually leave the most for an owner.
type IndustryMarginRow = {
  gross_margin?: number | null;
  operating_margin?: number | null;
  net_margin?: number | null;
  asset_intensity?: number | null;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupMargin(industryId: string): IndustryMarginRow {
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string; geo: string };

// Build-time prerender DISABLED (2026-05-31). The region page runs
// getTopIndustriesForCountry, a heavy Supabase query; on the current DB
// compute it exceeds Vercel's 300s per-page static-gen limit for big states
// (/us/illinois, /us/texas) and KILLS the whole build. dynamicParams=true
// (above) means every region still renders fine on first request and is then
// cached for `revalidate` seconds, so users see no difference. Re-enable a
// small prerender list once DB compute is bumped off NANO.
export async function generateStaticParams(): Promise<Params[]> {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo } = await params;
  const iso2 = country.toUpperCase();
  const countryName = iso2ToName(iso2) || iso2;
  const regions = getRegionsForCountry(iso2, countryName);
  const regionEntry = regions.find((r) => r.value === geo.toLowerCase());
  const regionLabel = regionEntry?.label || geo;
  // THE CANONICAL IS RESOLVED, NEVER ASSEMBLED. Without an `alternates` of its
  // own this route inherited the root layout's `canonical: "/"`, so every region
  // page told a crawler it was the home page. The obvious repair, pasting the
  // two params back together, is the exact move verify_geo_link_construction
  // exists to stop: of 290 real country and place pairs, 248 resolve to no page
  // at all, and a canonical is a claim that a URL exists.
  //
  // WHY THE `kind` CHECK IS LOAD-BEARING. geoPageTarget tries CITY FIRST, which
  // is right for a link (it wants the page that actually holds the place) and
  // wrong for a canonical here, because this route serves REGIONS. `us/new-york`
  // is the collision the gate documents: the slug names a city in one list and a
  // state in another, this URL renders New York STATE, and the resolver hands
  // back /cities/new-york. Taking that href would tell a crawler the state page
  // is really the city page, which is the same defect the gate was written for,
  // moved into a different tag.
  //
  // So a region target is taken as-is, and anything else (a city collision, or a
  // slug that resolves to nothing and will 404 below) nominates NOTHING. A null
  // canonical resolves to no tag, which is honest silence; an invented one is a
  // wrong answer stated confidently.
  const target = geoPageTarget(country, geo);
  const canonical = target?.kind === "region" ? target.href : null;
  return {
    title: `${regionLabel}: small-business benchmarks | Margin Atlas`,
    description: `Typical revenue, employment, and wages for small businesses in ${regionLabel}, ${countryName}.`,
    alternates: { canonical },
  };
}

function cityLabelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w === "dc" ? "DC" : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}

async function RegionLandingPageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  // Spine reform (flag-gated, default OFF). The spine body renders the bundled
  // London seed regardless of `params`; that is intentional for this scaffold and
  // never ships live because the flag stays OFF until real-data adapters land.
  if (isSpineReformEnabledFor("region")) {
    return (
      <SpineShell>
        <SpineCityBody />
      </SpineShell>
    );
  }

  const { country, geo } = await params;
  const iso2 = country.toUpperCase();
  const countryMeta = COUNTRIES.find((c) => c.code === iso2);
  if (!countryMeta) notFound();
  const countryName = countryMeta.name;
  const regions = getRegionsForCountry(iso2, countryName);
  const regionEntry = regions.find((r) => r.value === geo.toLowerCase());
  if (!regionEntry) notFound();

  const regionLabel = regionEntry.label;
  const curatedCities = CITIES_BY_STATE[iso2]?.[geo.toLowerCase()] || [];

  // Country-level dense SMB activities, used ONLY as the internal feed for the
  // best/hardest lede and the easiest-to-break-in panel below. It is no longer
  // surfaced as a region industry LIST: that list was the same nine activities
  // on every region of a country (a known misrepresentation), so it was
  // removed. The lede and the break-in panel re-resolve each activity at THIS
  // geo and self-omit anything that does not produce a defensible local read,
  // so they stay honest even though the seed is country-level.
  const topIndustries = (await getTopIndustriesForCountry(iso2, 9)) ?? [];

  // "The easiest businesses to break into here" panel, the place-level flip side
  // of the across-cities comparison. It ranks THIS place's activities by the
  // single break-in rating (the same 0..100 score each business shows on its own
  // masthead). The cell-page links here resolve a genuinely sub-national cell for
  // a known city (a county / nuts2 / lad measurement, not a country aggregate),
  // so the score is the real local read and matches that city cell's masthead. We
  // resolve the destination cell for each top activity at THIS geo (a bounded,
  // budgeted set of reads) and hand them to the pure place-board builder, which
  // scores each through the SAME break-in path the masthead uses and drops any
  // activity whose cell misrouted, is synthesized, or carries no defensible
  // take-home, so a row is never a wrong number. The builder self-omits a thin
  // ranking, and the section below renders nothing in that case. Each read is
  // budgeted, so a slow one degrades that one activity rather than the page.
  const geoLower = geo.toLowerCase();
  const resolvedActivities: PlaceActivityCell[] = await Promise.all(
    topIndustries.map(async (ind) => ({
      industryId: ind.industry_id,
      industryName:
        ind.industry_name || INDUSTRY_BY_ID[ind.industry_id]?.name || ind.industry_id,
      cell: await withBudget(
        getCellBySlug(country.toLowerCase(), geoLower, industryToSlug(ind.industry_id), {
          sizeBand: null,
          year: null,
        }),
        null,
        4_000,
        `easiest-break-in:${iso2}/${geoLower}/${ind.industry_id}`,
      ),
    })),
  );
  const easiestBreakIn = buildEasiestToBreakIn({
    iso2,
    geo: geoLower,
    activities: resolvedActivities,
    econ: { avgMonthlySalary: getCountryEconomicsSnapshot(iso2).avgMonthlySalary },
  });

  // Place-level decision lede (bible Section 5, the City page move: "best and
  // hardest businesses", using the actual economic modules, not a listicle).
  // Pure synthesis from data already loaded: the densest local activities and
  // the typical revenue each turns over, joined to each activity's curated,
  // cross-country-stable margin shape. The single derived signal is "what
  // reaches the owner" (revenue x net margin); no new query, no invented
  // number. Each clause and entry self-omits when its input is missing.
  const geoVerdict = generateGeoVerdict({
    placeLabel: regionLabel,
    activities: topIndustries.map((ind) => {
      const m = lookupMargin(ind.industry_id);
      return {
        industryId: ind.industry_id,
        name: ind.industry_name || INDUSTRY_BY_ID[ind.industry_id]?.name || ind.industry_id,
        typicalRevenue: ind.revenue_per_firm ?? null,
        netMargin: m.net_margin ?? null,
        grossMargin: m.gross_margin ?? null,
        assetIntensity: m.asset_intensity ?? null,
      };
    }),
  });
  // Mount the lede only when the synthesis produced real signal: a named
  // contrast (best and hardest), which needs enough distinct activities with
  // both a typical revenue and a curated margin. Otherwise it would be the
  // generic thin-coverage line, which we omit rather than show as an apology.
  const showGeoVerdict =
    geoVerdict.best.length > 0 || geoVerdict.hardest.length > 0;

  return (
    /* SURFACES, 2026-08-17. Every band on this page was a bare <section> with a
       py-10 rhythm, two of them carrying a full-width opaque ground: white on
       the hero and the cream-50 step on the neighbourhoods, the latter spelled
       out no further because Tailwind's content scan does not strip comments and
       naming a retired utility in prose re-emits it into the stylesheet. Both
       defects at once:

       - A full-width opaque ground blanks the site photograph across the whole
         column, which the founder has ruled against three times. A band is not
         a card.
       - Worse, a static element is not painted at all. AtlasFrame's fixed
         layers sit at z-index 0 and paint above every in-flow non-positioned
         descendant, so the entire page was covered by the frame's opaque base.
         Measured on a reproduction of the real layering, in a browser: a static
         block with a solid fill sampled identical to the empty gutter.

       So the bands become a stack of .atlas-card, which is `position: relative`
       and translucent at .955, and the spacing moves from per-section padding to
       one gap on the stack. The city and neighbourhood tiles keep their own
       rounded-2xl bg-white: they sit INSIDE a card, so their fill is not what
       carries the picture, and converging a surface is not the same as
       flattening a mark. Same call /countries made for its 194 country tiles. */
    <div className="relative space-y-6 md:space-y-8 py-6 md:py-8">
      <section id="hero" className="atlas-card px-5 py-6 md:px-7 md:py-8">
        <nav className="text-sm text-cocoa-700/70 mb-4">
          <Link href="/" className="hover:text-atlas-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${country.toLowerCase()}`} className="hover:text-atlas-700">{countryName}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink-900">{regionLabel}</span>
        </nav>
        <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 flex items-center gap-2">
          <CountryFlag iso2={iso2} className="w-5" />
          <span>{countryName}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink-900 leading-[1.05]">
          Best and hardest businesses in {regionLabel}
        </h1>
        {/* The lede lost its third sentence, "pick a city or an activity below
            to see the real numbers", which described the two grids of city
            cards immediately underneath it. */}
        <p className="mt-4 text-base md:text-lg text-ink-800 max-w-2xl leading-relaxed">
          Which small businesses tend to leave the most for an owner in{" "}
          {regionLabel}, and which ones quietly eat the margin.
        </p>
      </section>

      {/* Place-level decision lede (bible Section 5, "best and hardest
         businesses in [city]"). The opinionated read of which activities in
         the local mix leave the most for an owner and which are the harder way
         to make a living, drawn from the densest local activities and their
         margin structure. Mounts only when the synthesis produced a real
         contrast (see showGeoVerdict). It links each named activity straight to
         the cell page so the reader can check the numbers. */}
      {/* Carded at the mount rather than inside the component: GeoViabilityLede
          opens a bare `border-y parchment` section with no surface, and it lives
          in another agent's tree. */}
      {showGeoVerdict ? (
        <div className="atlas-card px-5 py-2 md:px-7">
        <GeoViabilityLede
          verdict={geoVerdict}
          hrefFor={(industryId) =>
            `/${country.toLowerCase()}/${geo.toLowerCase()}/${industryToSlug(industryId)}`
          }
        />
        </div>
      ) : null}

      {/* Plan v32 Sprint G — city character panel. Renders only for
         hand-curated cities (NYC, LA, London, Paris, Tokyo, etc.).
         For other geos this is a no-op so the page reads as before. */}
      <CityCharacter geoId={`${iso2}-CITY-${geo.toLowerCase()}`} countryIso2={iso2} />

      {/* Plan v26 Phase B.4.4 — neighborhoods (when this geo is a
         city with a neighborhood scheme in neighborhoods_v1.json).
         Renders only for cities in the Phase B coverage list. */}
      {(() => {
        const nbList = getNeighborhoodsForCity(geo);
        if (!nbList || nbList.length === 0) return null;
        return (
          <section id="neighborhoods" className="atlas-card px-5 py-5 md:px-7 md:py-6">
            <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
              Neighborhoods of {regionLabel}
            </h2>
            {/* The list of characters this dropped, "financial district,
                affluent residential, tourist core, industrial", is printed on
                every card below it as the card's own eyebrow. */}
            <p className="mt-2 text-sm text-cocoa-700/80 max-w-2xl">
              City-level numbers, adjusted for each local economy.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {nbList.map((nb) => (
                <Link
                  key={nb.slug}
                  href={`/${country.toLowerCase()}/${geo.toLowerCase()}/${nb.slug}/restaurants`}
                  className="group block rounded-2xl border border-parchment hover:border-atlas-500 bg-white p-5 transition-colors"
                >
                  <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold">
                    {nb.character.replace(/-/g, " ")}
                  </div>
                  <div className="mt-1.5 font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                    {nb.name}
                  </div>
                  {nb.description && (
                    <p className="mt-2 text-xs text-cocoa-700/70 line-clamp-2">
                      {nb.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Cities in this region. The region page is an index into its cities:
         the real numbers live at the city level, so this is the page's primary
         content. It leads after the hero and the best/hardest lede, and
         self-omits when a region has no curated cities (the page still renders
         with the lede and whatever else resolves). */}
      {curatedCities.length > 0 && (
        <section id="top-cities" className="atlas-card px-5 py-5 md:px-7 md:py-6">
          <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
            Cities in {regionLabel}
          </h2>
          {/* Three sentences became one. "Pick a city to see its small-business
              benchmarks" described the grid of city cards directly beneath it,
              and every card already says "Open city benchmarks" on its own
              face. What survives is the only claim neither the grid nor the
              cards make: which industry a card lands on. */}
          <p className="mt-2 text-sm text-cocoa-700/80 max-w-2xl">
            The numbers live at the city level. Each card opens that city&apos;s
            restaurants benchmark; switch activity on the next page.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {curatedCities.map((citySlug) => (
              <Link
                key={citySlug}
                href={`/${country.toLowerCase()}/${citySlug}/restaurants`}
                className="group block rounded-2xl border border-parchment hover:border-atlas-500 bg-white p-5 transition-colors"
              >
                <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold">
                  City
                </div>
                <div className="mt-1.5 font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                  {cityLabelFromSlug(citySlug)}
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-atlas-700 group-hover:text-atlas-900 font-medium border-b border-atlas-200 group-hover:border-atlas-500 pb-0.5 transition-colors">
                  Open city benchmarks
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* The easiest businesses to break into here. The place-level flip side of
         the across-cities comparison: it ranks this place's activities by the
         single break-in rating (the same 0..100 score each business shows on its
         own masthead). It is the deeper read under the cities index: which of
         this place's activities are actually the easiest to get started in.
         Self-omits when too few activities resolve a defensible score.
         Deliberately no registered section id, so it stays out of the
         region-page canonical skeleton order. */}
      {easiestBreakIn.length > 0 ? (
        <section className="atlas-card px-5 py-5 md:px-7 md:py-6">
          <EasiestToBreakIn rows={easiestBreakIn} placeName={regionLabel} />
        </section>
      ) : null}
    </div>
  );
}

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function RegionLandingPage(props: Parameters<typeof RegionLandingPageBody>[0]) {
  return (
    <SiteChrome>
      <RegionLandingPageBody {...props} />
    </SiteChrome>
  );
}
