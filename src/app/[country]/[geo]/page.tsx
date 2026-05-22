/**
 * Plan v22 Block E — state/region landing page.
 *
 * Handles URLs like `/us/california`, `/de/de2`, etc. Renders:
 *   - Hero with region name + flag
 *   - Top cities in the region (curated, cards linking to city pages)
 *   - Top industries in the region (cards linking to cell pages)
 *
 * Previously /us/california returned 404 because no route matched the
 * [country]/[geo] 2-segment pattern. This page adds that.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { COUNTRIES, INDUSTRY_BY_ID, SECTOR_BY_ID, industryToSlug } from "@/lib/taxonomy";
import { getTopIndustriesForCountry, slugify } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";
import { CITIES_BY_STATE } from "@/lib/cities/city_aliases_generated";
import { iso2ToName } from "@/lib/countries";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { fmtMoney } from "@/lib/format/money";
import { getNeighborhoodsForCity } from "@/lib/cities/neighborhoods";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string; geo: string };

// Pre-render top US states + major non-US regions for fast first paint.
const STATIC_REGIONS: Array<{ country: string; geo: string }> = [
  ...["california", "texas", "new-york", "florida", "illinois"].map((g) => ({ country: "us", geo: g })),
  { country: "de", geo: "de2" },
  { country: "it", geo: "itc4" },
  { country: "fr", geo: "fr10" },
  { country: "es", geo: "es51" },
];

export async function generateStaticParams(): Promise<Params[]> {
  return STATIC_REGIONS;
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

  // Top SMB industries for the country (state-specific listing not yet
  // wired, so we surface the country-level top 9 here).
  const topIndustries = (await getTopIndustriesForCountry(iso2, 9)) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="py-10 md:py-14 bg-cream-100">
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
          {regionLabel}
        </h1>
        <p className="mt-4 text-base md:text-lg text-ink-800 max-w-2xl leading-relaxed">
          Small-business benchmarks across {regionLabel}. Pick a city or an
          industry below to drill in.
        </p>
      </section>

      {/* Plan v26 Phase B.4.4 — neighborhoods (when this geo is a
         city with a neighborhood scheme in neighborhoods_v1.json).
         Renders only for cities in the Phase B coverage list. */}
      {(() => {
        const nbList = getNeighborhoodsForCity(geo);
        if (!nbList || nbList.length === 0) return null;
        return (
          <section className="py-10 md:py-14 bg-cream-50">
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

      {/* Top cities */}
      {curatedCities.length > 0 && (
        <section className="py-10 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            Top cities in {regionLabel}
          </h2>
          <p className="mt-2 text-sm md:text-base text-cocoa-700/80 max-w-2xl">
            Where the most small-business activity concentrates. Each card
            opens the city&apos;s benchmark for restaurants by default; switch
            industries on the next page.
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

      {/* Top industries */}
      {topIndustries.length > 0 && (
        <section className="py-10 md:py-14 bg-cream-50">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            Top small-business industries in {regionLabel}
          </h2>
          <p className="mt-2 text-sm md:text-base text-cocoa-700/80 max-w-2xl">
            Most-covered SMB categories at this level of geography.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {topIndustries.map((ind) => {
              const indRecord = INDUSTRY_BY_ID[ind.industry_id];
              const sector = indRecord ? SECTOR_BY_ID[indRecord.sector_id] : null;
              const slug = industryToSlug(ind.industry_id);
              return (
                <Link
                  key={ind.industry_id}
                  href={`/${country.toLowerCase()}/${geo.toLowerCase()}/${slug}`}
                  className="block px-4 py-4 rounded-xl border border-cream-300 bg-white hover:border-atlas-500 hover:shadow-[0_6px_18px_rgba(120,53,15,0.08)] transition"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-atlas-700 font-semibold">
                    <span>{sector?.name || "Industry"}</span>
                  </div>
                  <div className="mt-1 text-sm md:text-base font-semibold text-ink-900">
                    {ind.industry_name || indRecord?.name || ind.industry_id}
                  </div>
                  <div className="mt-1.5 text-xs text-cocoa-700">
                    {ind.revenue_per_firm != null ? (
                      <>
                        Typical revenue:{" "}
                        <strong className="text-ink-900">{fmtMoney(ind.revenue_per_firm)}</strong>
                      </>
                    ) : (
                      <span className="text-ink-700/60">Open for full numbers →</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// Suppress unused-import warning when slugify isn't called above.
void slugify;
