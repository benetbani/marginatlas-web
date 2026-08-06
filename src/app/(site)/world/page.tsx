/**
 * /world - the global atlas entry point.
 *
 * Reformation (bible Section 5, the free-portal map row, and Section 25 voice:
 * blunt, practical, skeptical of easy money). The page no longer opens as a flat
 * grid of every flag. It leads with the thesis the whole atlas turns on, the
 * country sets the conditions but the operator and the address decide the
 * outcome, then guides the reader: start where the map goes furthest, then read
 * the rest by region.
 *
 * The only per-country figure surfaced is breadth, the count of activities
 * measured in a country. It is a plain count, never a quality or confidence
 * score (D-107 + R-002 lockdown: no benchmark-count or quality score leaked into
 * the UI). Every figure comes from the pre-computed coverage report through a
 * pure synthesis module (src/lib/scores/world_atlas); the page invents nothing.
 *
 * /world is the map and breadth entry. /coverage is the depth view (how deep the
 * numbers run inside a country); the two cross-link rather than duplicate.
 *
 * URL, metadata, and revalidate are preserved. Every /{iso2} link and the
 * /coverage link are unchanged. Server-rendered, no client JS.
 */
import Link from "next/link";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCoverageReport } from "@/lib/quality/coverage-report";
import {
  buildWorldAtlas,
  ATLAS_COPY,
  type AtlasCountry,
} from "@/lib/scores/world_atlas";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 21600; // 6 hours

export const metadata = {
  title: "World map: Margin Atlas",
  description: "Every country in Margin Atlas.",
  alternates: { canonical: "/world" },
};

function countryName(iso2: string): string {
  return COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
}

/**
 * One country, as an editorial directory tile: the code, the name, and how broad
 * the map runs for it as a plain activity count. Uniform size so no tile shouts
 * over another. The whole tile is the link target.
 */
function CountryTile({ country }: { country: AtlasCountry }) {
  return (
    <Link
      href={`/${country.iso2.toLowerCase()}`}
      className="group flex items-baseline gap-3 rounded-xl border border-parchment bg-cream-50 p-3 transition-colors hover:border-atlas-500 hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
    >
      <span className="w-7 shrink-0 font-mono text-xs font-semibold text-cocoa-500">
        {country.iso2}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700">
          {countryName(country.iso2)}
        </span>
        {country.activities > 0 ? (
          <span className="mt-0.5 block text-xs tabular-nums text-cocoa-500">
            {country.activities} activities
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export default async function WorldPage() {
  const report = getCoverageReport();

  // Only real ISO2 codes from the taxonomy may render. The coverage report
  // historically leaked ISO3 codes (BDI, AFG, ZWE) and regional aggregates
  // (AFE, EUU, WLD); the validity set keeps them out by construction.
  const validIso2 = new Set(COUNTRIES.map((c) => c.code));

  const atlas = buildWorldAtlas(
    report,
    validIso2,
    countryName,
    report?.totals?.industries_covered ?? 0,
  );

  // Defensive: with no coverage report at all there is nothing honest to show.
  // Render the framing and the cross-link rather than an empty or faked grid.
  const hasData = atlas.countriesCovered > 0;

  return (
    <div className="py-10 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 pt-2 text-sm text-cocoa-500">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">World</span>
      </nav>

      <header className="max-w-3xl">
        <SectionEyebrow size="md" className="mb-3">
          {ATLAS_COPY.eyebrow}
        </SectionEyebrow>
        <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-tight text-ink-900 md:text-5xl lg:text-[3.3rem]">
          {ATLAS_COPY.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-graphite md:text-xl">
          {ATLAS_COPY.lead}
        </p>
        {hasData ? (
          <p className="mt-4 text-sm tabular-nums text-cocoa-500">
            <span className="font-medium text-ink-900">
              {atlas.countriesCovered}
            </span>{" "}
            countries carry data, across{" "}
            <span className="font-medium text-ink-900">
              {atlas.activitiesMapped}
            </span>{" "}
            kinds of small business. Tap a country to drill into its regions and
            activities.
          </p>
        ) : null}
      </header>

      {/* The guided entry: the broadest markets first, so a reader starts where
          a plan can be checked against the most real ranges instead of at the
          top of an alphabet. Self-omits if there is nothing to lead with. */}
      {atlas.deepest.length > 0 ? (
        <section aria-labelledby="world-deepest" className="mt-12 md:mt-16">
          <div className="max-w-3xl">
            <h2
              id="world-deepest"
              className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 md:text-3xl"
            >
              Start where the map goes furthest
            </h2>
            <p className="mt-3 text-base leading-relaxed text-graphite">
              {ATLAS_COPY.deepestBlurb}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-8 md:grid-cols-4">
            {atlas.deepest.map((country) => (
              <CountryTile key={country.iso2} country={country} />
            ))}
          </div>
        </section>
      ) : null}

      {/* The rest of the world by region. Geographic, not alphabetic; broadest
          country first inside each region. A region with no covered country
          self-omits. */}
      {atlas.regions.length > 0 ? (
        <section aria-labelledby="world-regions" className="mt-14 md:mt-20">
          <div className="max-w-3xl">
            <h2
              id="world-regions"
              className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 md:text-3xl"
            >
              By region
            </h2>
            <p className="mt-3 text-base leading-relaxed text-graphite">
              {ATLAS_COPY.restNote}
            </p>
          </div>
          <div className="mt-8 space-y-12 md:mt-10 md:space-y-14">
            {atlas.regions.map((region) => (
              <div key={region.name}>
                <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink-900">
                  {region.name}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {region.countries.map((country) => (
                    <CountryTile key={country.iso2} country={country} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Cross-link to the depth-first view. Breadth lives here; depth lives on
          /coverage. The two complement rather than repeat. */}
      <section className="mt-16 border-t border-parchment pt-8 md:mt-20">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">
            How deep do the numbers go?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite">
            {ATLAS_COPY.depthClose}{" "}
            <Link
              href="/coverage"
              className="font-medium text-atlas-700 underline-offset-2 hover:underline"
            >
              See the coverage view
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
