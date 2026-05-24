/**
 * /browse — top-level directory page.
 *
 * Plan v32 rewrite. The previous hero ("The whole atlas, three ways")
 * was abstract and the CTA buttons didn't map onto the section headings
 * below. New structure: a clear three-door entry block (Country / Sector
 * / City), then the curated country, sector, and benchmark lists.
 */

import { SECTORS_ORDERED, COUNTRIES, INDUSTRIES_BY_SECTOR, INDUSTRIES, isDefaultVisible } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import { sectorIcon } from "@/lib/taxonomy/sector_icons";
import { TOP_100_CITIES } from "@/lib/cities";

export const revalidate = 86400; // 1 day

export const metadata = {
  title: "Browse | Margin Atlas",
  description:
    "Find a small-business benchmark by country, sector, or city. Coverage spans 194 countries, 20 sectors, 192 industries, and 100+ ranked cities.",
  alternates: { canonical: "/browse" },
};

export default function BrowsePage() {
  const topCountries = COUNTRIES.filter(
    (c) => c.quality === "A" || c.quality === "B"
  ).slice(0, 16);
  const allOthers = COUNTRIES.filter(
    (c) => c.quality === "C" || c.quality === "D"
  );

  const visibleIndustries = INDUSTRIES.filter(isDefaultVisible).length;
  const countryCount = COUNTRIES.length;
  const sectorCount = SECTORS_ORDERED.length;
  const cityCount = TOP_100_CITIES.length;

  // Flag previews for the country entry card
  const flagPreview = ["US", "GB", "DE", "FR", "JP", "BR"];
  // Sector glyphs for the sector entry card
  const sectorPreview = SECTORS_ORDERED.slice(0, 6);
  // Marquee cities for the city entry card
  const cityPreview = ["London", "New York", "Tokyo", "Paris", "Berlin", "Sao Paulo"];

  return (
    <div>
      <header className="pt-2 pb-6">
        <div className="text-xs uppercase tracking-wide text-atlas-700 font-semibold">
          Browse the atlas
        </div>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Find any small-business benchmark
        </h1>
        <p className="mt-3 text-base md:text-lg text-ink-700 max-w-3xl leading-relaxed">
          Three doors into the same numbers. Pick whichever matches what you
          already know about the business you&apos;re looking up.
        </p>
      </header>

      {/* Three-door entry block. Each door is a card with a clear noun,
          a one-line stat, a preview row, and a single anchor. */}
      <section className="grid md:grid-cols-3 gap-3">
        <EntryCard
          eyebrow="Country"
          title="Pick a place"
          stat={`${countryCount} countries`}
          subtitle="Drill from country to region, city, and industry."
          href="#by-country"
          preview={
            <div className="flex items-center gap-1.5 flex-wrap">
              {flagPreview.map((iso2) => (
                <CountryFlag key={iso2} iso2={iso2} className="w-7" />
              ))}
              <span className="text-xs text-ink-700/60 ml-1">and more</span>
            </div>
          }
        />
        <EntryCard
          eyebrow="Sector"
          title="Pick a kind of business"
          stat={`${sectorCount} sectors, ${visibleIndustries} industries`}
          subtitle="See an industry side-by-side across the whole world."
          href="#by-sector"
          preview={
            <div className="flex items-center gap-2 flex-wrap text-base">
              {sectorPreview.map((s) => (
                <span key={s.id} aria-hidden="true" className="leading-none">
                  {sectorIcon(s.id)}
                </span>
              ))}
              <span className="text-xs text-ink-700/60">and more</span>
            </div>
          }
        />
        <EntryCard
          eyebrow="City"
          title="Pick a city directly"
          stat={`${cityCount}+ cities ranked`}
          subtitle="Skip the country and region drill. Go straight to a metro."
          href="/world"
          preview={
            <div className="text-xs text-ink-700/80 leading-relaxed">
              {cityPreview.join(" · ")}
            </div>
          }
        />
      </section>

      {/* By country */}
      <section id="by-country" className="pt-12 pb-6 scroll-mt-20">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            Top countries
          </h2>
          <span className="text-xs text-ink-700/60">
            {allOthers.length} more with lighter coverage below
          </span>
        </div>
        <p className="text-sm text-ink-700/80">
          The 16 countries with the richest data. Click any one to see local
          tax overlay, top SMB industries, and ranked cities.
        </p>
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {topCountries.map((c) => (
            <a
              key={c.code}
              href={`/${c.code.toLowerCase()}`}
              className="card hover:border-atlas-500 transition flex items-center gap-3"
            >
              <CountryFlag iso2={c.code} label={c.name} className="w-8" />
              <div>
                <div className="font-medium text-ink-900">{c.name}</div>
                <div className="text-xs text-ink-700/60">
                  {c.quality === "A" ? "Richest data" : "Good coverage"}
                </div>
              </div>
            </a>
          ))}
        </div>
        {allOthers.length > 0 && (
          <details className="mt-6">
            <summary className="text-sm text-atlas-700 cursor-pointer hover:underline">
              Show {allOthers.length} more countries
            </summary>
            <div className="mt-3 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {allOthers.map((c) => (
                <a
                  key={c.code}
                  href={`/${c.code.toLowerCase()}`}
                  className="px-3 py-2 rounded-lg border border-parchment bg-white hover:border-atlas-500 transition text-sm flex items-center gap-2"
                >
                  <CountryFlag iso2={c.code} label={c.name} className="w-5" />
                  <span className="text-ink-900">{c.name}</span>
                </a>
              ))}
            </div>
          </details>
        )}
      </section>

      {/* By sector */}
      <section id="by-sector" className="py-12 scroll-mt-20">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            Top sectors
          </h2>
          <a
            href="/industries"
            className="text-xs text-atlas-700 hover:text-atlas-900 font-medium whitespace-nowrap"
          >
            All industries A to Z →
          </a>
        </div>
        <p className="text-sm text-ink-700/80">
          The 20 industry families we cover. Each sector page lists every
          industry inside with its worldwide median.
        </p>
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SECTORS_ORDERED.map((s) => {
            const indCount = (INDUSTRIES_BY_SECTOR[s.id] || []).length;
            return (
              <a
                key={s.id}
                href={`/sectors/${s.id}`}
                className="card hover:border-atlas-500 transition"
              >
                <div className="font-medium text-ink-900 flex items-center gap-2">
                  <span aria-hidden className="text-base leading-none">
                    {sectorIcon(s.id)}
                  </span>
                  {s.name}
                </div>
                <div className="text-xs text-ink-700/60 mt-1">
                  {s.examples.slice(0, 3).join(" · ")}
                </div>
                <div className="text-xs text-atlas-700 mt-2">
                  {indCount} industries →
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Most-asked benchmarks. Hand-picked country+industry combos, kept
         deliberately short so it doesn't read as a dump. */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
          Most-asked benchmarks
        </h2>
        <p className="text-sm text-ink-700/80 mt-1">
          Hand-picked country and industry combinations. Each opens the full
          benchmark: distribution from bottom 10% to top 10%, after-tax owner
          take-home, and nearby cities for context.
        </p>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/us/new-york/restaurants", "US", "Restaurants, New York"],
            ["/gb/london/legal-services", "GB", "Legal services, London"],
            ["/de/munich/software-development", "DE", "Software dev, Munich"],
            ["/es/madrid/cafes-coffee-shops", "ES", "Cafés, Madrid"],
            ["/jp/jp-13000/restaurants", "JP", "Restaurants, Tokyo"],
            ["/br/br-sp/grocery-stores", "BR", "Grocery, Sao Paulo"],
            ["/mx/mx-cmx/restaurants", "MX", "Restaurants, Mexico City"],
            ["/au/australia/cafes-coffee-shops", "AU", "Cafés, Australia"],
            ["/al/tirana/cafes-coffee-shops", "AL", "Cafés, Tirana"],
            ["/ch/zurich/legal-services", "CH", "Pro services, Zurich"],
            ["/ae/ae/grocery-stores", "AE", "Retail, UAE"],
            ["/in/india/software-development", "IN", "Software dev, India"],
          ].map(([href, iso2, label]) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-parchment bg-white hover:border-atlas-500 transition text-sm text-ink-900"
            >
              <CountryFlag iso2={iso2} label={label} className="w-6" />
              <span className="flex-1">{label}</span>
              <span className="text-atlas-700">→</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function EntryCard({
  eyebrow,
  title,
  stat,
  subtitle,
  href,
  preview,
}: {
  eyebrow: string;
  title: string;
  stat: string;
  subtitle: string;
  href: string;
  preview: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group block bg-white border border-ink-200 hover:border-atlas-500 rounded-2xl p-5 transition-colors"
    >
      <div className="text-[10px] uppercase tracking-wide text-atlas-700 font-semibold">
        {eyebrow}
      </div>
      <div className="mt-1 text-lg font-semibold text-ink-900">{title}</div>
      <div className="mt-1 text-xs text-ink-700/70">{stat}</div>
      <div className="mt-3">{preview}</div>
      <p className="mt-3 text-sm text-ink-700 leading-snug">{subtitle}</p>
      <div className="mt-3 text-xs text-atlas-700 font-medium group-hover:text-atlas-900">
        Open →
      </div>
    </a>
  );
}
