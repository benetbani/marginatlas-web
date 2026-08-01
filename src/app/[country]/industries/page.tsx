/**
 * Country industry hub page (`/us/industries`,
 * `/de/industries`, ...).
 *
 * Directory page listing every SMB-relevant industry we cover for the
 * country, grouped by sector. Heavy on internal links to drive crawl
 * depth and to give each country its own topical-authority neighborhood
 * for the phrase universe.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  INDUSTRIES,
  SECTORS_ORDERED,
  industryToSlug,
  isDefaultVisible,
} from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { iso2ToName } from "@/lib/countries";
import { COUNTRIES } from "@/lib/taxonomy";
import { SiteChrome } from "@/components/SiteChrome";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { country: string };

function isKnownCountry(iso2: string): boolean {
  return COUNTRIES.some((c) => c.code === iso2);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  if (!isKnownCountry(iso2)) return { title: "Page not found" };
  const name = iso2ToName(iso2);
  const title = `Small business industries in ${name} | Margin Atlas`;
  const description = `Benchmarks and typical revenue for ${name}'s small business sectors: restaurants, retail, services, manufacturing, and more.`;
  return {
    title,
    description,
    alternates: { canonical: `/${country.toLowerCase()}/industries` },
    // images is repeated here rather than inherited. Next resolves metadata
    // per KEY by replacement, not by deep merge, so declaring openGraph at all
    // discards the root layout's openGraph including its images. Without this
    // line these ~195 country hubs emitted twitter:image but no og:image, and
    // og:image is what Facebook, LinkedIn, Slack and WhatsApp read.
    openGraph: {
      title,
      description,
      images: [{ url: "/og/default", width: 1200, height: 630 }],
    },
  };
}

async function CountryIndustriesPageBody({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country } = await params;
  const iso2 = country.toUpperCase();
  if (!isKnownCountry(iso2)) notFound();
  const name = iso2ToName(iso2);

  // Group SMB-relevant industries by sector, preserving the curated
  // SECTORS_ORDERED sequence so the page reads top-to-bottom in the same
  // shape as the master navigator.
  const bySector = new Map<string, typeof INDUSTRIES>();
  for (const ind of INDUSTRIES) {
    if (!isDefaultVisible(ind)) continue;
    const key = ind.sector_id || "other";
    if (!bySector.has(key)) bySector.set(key, []);
    bySector.get(key)!.push(ind);
  }
  // Alphabetise within each sector.
  for (const inds of bySector.values()) {
    inds.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="py-12">
      <div className="flex items-center gap-3 mb-6">
        <CountryFlag iso2={iso2} className="w-10" />
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900">
          Small business industries in {name}
        </h1>
      </div>
      <p className="text-ink-800 max-w-2xl mb-8">
        Benchmarks for the typical small business across {name}&apos;s
        economy. Click an industry to see typical revenue, profit margins,
        and cost structures.
      </p>

      {SECTORS_ORDERED.filter((s) => bySector.has(s.id)).map((sector) => {
        const inds = bySector.get(sector.id) || [];
        return (
          <section key={sector.id} className="mb-10">
            <h2 className="text-xl font-semibold text-ink-900 mb-4">
              {sector.name}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {inds.map((ind) => (
                <li key={ind.id}>
                  <Link
                    href={`/${country.toLowerCase()}/${country.toLowerCase()}/${industryToSlug(ind.id)}`}
                    className="block px-3 py-2 rounded-lg border border-parchment hover:border-atlas-400 hover:bg-cream-100 text-sm text-ink-900"
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
export default function CountryIndustriesPage(props: Parameters<typeof CountryIndustriesPageBody>[0]) {
  return (
    <SiteChrome>
      <CountryIndustriesPageBody {...props} />
    </SiteChrome>
  );
}
