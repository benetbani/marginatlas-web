/**
 * Region industry hub page
 * (`/us/california/industries`, `/de/bayern/industries`, ...).
 *
 * Sister to /[country]/industries (T-C.5) but scoped to a sub-region.
 * Only renders when the country has regional cell coverage AND the
 * region slug resolves to a known admin1 region — otherwise 404s so
 * we don't broadcast empty hub pages.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  INDUSTRIES,
  SECTORS_ORDERED,
  industryToSlug,
  isDefaultVisible,
  COUNTRIES,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { iso2ToName } from "@/lib/countries";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { SiteChrome } from "@/components/SiteChrome";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string; geo: string };

function isKnownCountry(iso2: string): boolean {
  return COUNTRIES.some((c) => c.code === iso2);
}

function resolveRegionName(iso2: string, geoSlug: string): string | null {
  const regions = getAdmin1Regions(iso2);
  if (!regions.length) return null;
  const slug = geoSlug.toLowerCase();
  const hit = regions.find(
    (r) => r.slug.toLowerCase() === slug || r.ascii_name.toLowerCase() === slug
  );
  return hit ? hit.name : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, geo } = await params;
  const iso2 = country.toUpperCase();
  if (!isKnownCountry(iso2)) return { title: "Page not found" };
  if (!hasRegionalCoverage(iso2)) return { title: "Page not found" };
  const regionName = resolveRegionName(iso2, geo);
  if (!regionName) return { title: "Page not found" };
  const countryName = iso2ToName(iso2);
  const title = `Small business industries in ${regionName}, ${countryName} | Margin Atlas`;
  const description = `Benchmarks and typical revenue for small businesses across ${regionName}: restaurants, retail, services, manufacturing, and more.`;
  return {
    title,
    description,
    alternates: { canonical: `/${country.toLowerCase()}/${geo.toLowerCase()}/industries` },
    // See the note on the country-level hub: declaring openGraph replaces the
    // root layout's openGraph wholesale, so a route that declares the key must
    // supply its own images or it ships with no og:image at all.
    openGraph: {
      title,
      description,
      images: [{ url: "/og/default", width: 1200, height: 630 }],
    },
  };
}

async function RegionIndustriesPageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, geo } = await params;
  const iso2 = country.toUpperCase();
  if (!isKnownCountry(iso2)) notFound();
  if (!hasRegionalCoverage(iso2)) notFound();
  const regionName = resolveRegionName(iso2, geo);
  if (!regionName) notFound();
  const countryName = iso2ToName(iso2);

  // Group SMB-relevant industries by sector, in curated order.
  const bySector = new Map<string, typeof INDUSTRIES>();
  for (const ind of INDUSTRIES) {
    if (!isDefaultVisible(ind)) continue;
    const key = ind.sector_id || "other";
    if (!bySector.has(key)) bySector.set(key, []);
    bySector.get(key)!.push(ind);
  }
  for (const inds of bySector.values()) {
    inds.sort((a, b) => a.name.localeCompare(b.name));
  }

  /* SURFACES, 2026-08-17, same removal as the country-level twin. This page had
     no surface at all: breadcrumb, h1, lede and every sector heading sat on the
     site photograph, and the trade tiles were hairline outlines with no fill.
     AtlasFrame paints from fixed layers at z-index 0, above every in-flow
     non-positioned descendant, so a static block is not drawn. One card for the
     masthead, one per sector. */
  return (
    <div className="relative space-y-6 md:space-y-8 py-6 md:py-8">
      <div className="atlas-card px-5 py-6 md:px-7 md:py-8">
      <nav className="text-sm text-ink-700/70 mb-4">
        <Link href="/" className="hover:text-atlas-600">Home</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${country.toLowerCase()}`}
          className="hover:text-atlas-600 inline-flex items-center gap-1"
        >
          <CountryFlag iso2={iso2} className="w-4" />
          <span>{countryName}</span>
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${country.toLowerCase()}/${geo.toLowerCase()}`}
          className="hover:text-atlas-600"
        >
          {regionName}
        </Link>
        <span className="mx-2">/</span>
        <span>Activities</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 mb-3">
        Small business activities in {regionName}
      </h1>
      {/* Lost its second sentence, "click an industry to see typical revenue,
          profit margins, and cost structures for the region", which described
          the grid of clickable industries directly beneath it. */}
      <p className="text-ink-800 max-w-2xl">
        Benchmarks for the typical small business across {regionName},{" "}
        {countryName}.
      </p>
      </div>

      {SECTORS_ORDERED.filter((s) => bySector.has(s.id)).map((sector) => {
        const inds = bySector.get(sector.id) || [];
        return (
          <section key={sector.id} className="atlas-card px-5 py-5 md:px-7 md:py-6">
            <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-4">
              {sector.name}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {inds.map((ind) => (
                <li key={ind.id}>
                  <Link
                    href={`/${country.toLowerCase()}/${geo.toLowerCase()}/${industryToSlug(ind.id)}`}
                    /* Hover fill moved off the cream-100 warm sand onto
                       parchment, the site hairline and a true neutral, at 50%.
                       These tiles now sit on .atlas-card, which is near-white,
                       so the press wants to be darker and not warmer. */
                    className="block px-3 py-2 rounded-lg border border-parchment hover:border-atlas-400 hover:bg-parchment/50 text-sm text-ink-900 transition-colors"
                  >
                    {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* Chrome is opted into, not inherited. The site masthead, <main> and footer
   moved out of the root layout into <SiteChrome> so that the spine-2 trade
   page , which carries its own , can render without them. This tree sits
   outside src/app/(site)/ because it holds both kinds of route, so each page
   here asks for the chrome explicitly. */
export default function RegionIndustriesPage(props: Parameters<typeof RegionIndustriesPageBody>[0]) {
  return (
    <SiteChrome>
      <RegionIndustriesPageBody {...props} />
    </SiteChrome>
  );
}
