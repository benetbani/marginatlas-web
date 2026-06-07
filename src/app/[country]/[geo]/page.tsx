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
  return {
    title: `${regionLabel}: small-business benchmarks | Margin Atlas`,
    description: `Typical revenue, employment, and wages for small businesses in ${regionLabel}, ${countryName}.`,
  };
}

function cityLabelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w === "dc" ? "DC" : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}

export default async function RegionLandingPage({
  params,
}: {
  params: Promise<Params>;
}) {
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
    <div>
      {/* Hero. White-reset 2026-06-06: was bg-cream-100, now pure white like
          every other hero band; no rule above it (first section). */}
      <section id="hero" className="py-10 md:py-14 bg-white">
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
        <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 leading-[1.05]">
          Best and hardest businesses in {regionLabel}
        </h1>
        <p className="mt-4 text-base md:text-lg text-ink-800 max-w-2xl leading-relaxed">
          Which small businesses tend to leave the most for an owner in{" "}
          {regionLabel}, and which ones quietly eat the margin. Pick a city or an
          activity below to see the real numbers.
        </p>
      </section>

      {/* Place-level decision lede (bible Section 5, "best and hardest
         businesses in [city]"). The opinionated read of which activities in
         the local mix leave the most for an owner and which are the harder way
         to make a living, drawn from the densest local activities and their
         margin structure. Mounts only when the synthesis produced a real
         contrast (see showGeoVerdict). It links each named activity straight to
         the cell page so the reader can check the numbers. */}
      {showGeoVerdict ? (
        <GeoViabilityLede
          verdict={geoVerdict}
          hrefFor={(industryId) =>
            `/${country.toLowerCase()}/${geo.toLowerCase()}/${industryToSlug(industryId)}`
          }
        />
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
          <section id="neighborhoods" className="py-10 md:py-14 bg-cream-50">
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
              Neighborhoods of {regionLabel}
            </h2>
            <p className="mt-2 text-sm md:text-base text-cocoa-700/80 max-w-2xl">
              Each neighborhood has its own character: financial district,
              affluent residential, tourist core, industrial. We adjust the
              city-level numbers for the local economy below.
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
        <section id="top-cities" className="py-10 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            Cities in {regionLabel}
          </h2>
          <p className="mt-2 text-sm md:text-base text-cocoa-700/80 max-w-2xl">
            The numbers for {regionLabel} live at the city level. Pick a city to
            see its small-business benchmarks. Each card opens the city&apos;s
            restaurants benchmark by default; switch industries on the next page.
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
        <section className="py-10 md:py-14">
          <EasiestToBreakIn rows={easiestBreakIn} placeName={regionLabel} />
        </section>
      ) : null}
    </div>
  );
}
