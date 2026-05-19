import { SECTORS_ORDERED, COUNTRIES, INDUSTRIES_BY_SECTOR } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";

export const revalidate = 86400; // 1 day

export const metadata = {
  title: "Browse | Margin Atlas",
  description:
    "Browse 191 countries and 25 sectors across the Margin Atlas database. Pick a country to drill into local business benchmarks, or a sector to compare across the world.",
  alternates: { canonical: "/browse" },
};

export default function BrowsePage() {
  // Show top 16 countries by quality, group the rest into a single open section
  const topCountries = COUNTRIES.filter((c) => c.quality === "A" || c.quality === "B").slice(0, 16);
  const allOthers = COUNTRIES.filter((c) => c.quality === "C" || c.quality === "D");

  return (
    <div>
      <header className="py-10">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          Browse
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          The whole atlas, three ways
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Start where you think. Country if you know the place. Sector if you
          know the industry. Or one of the world entry points at the top.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/world"
            className="inline-flex items-center px-4 py-2 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800 transition"
          >
            Open the world map →
          </a>
          <a
            href="/coverage"
            className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 text-sm font-medium hover:bg-white transition"
          >
            See coverage report →
          </a>
          <a
            href="/compare"
            className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 text-sm font-medium hover:bg-white transition"
          >
            Compare cells →
          </a>
        </div>
      </header>

      {/* By country */}
      <section className="py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By country</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          The 16 countries with the richest data. <span className="text-ink-700/50">{allOthers.length} more available with lighter coverage.</span>
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
            <summary className="text-sm text-atlas-600 cursor-pointer hover:underline">
              + Show {allOthers.length} more countries
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
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">By sector</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          Big industry families. Pick one to see the specific industries inside.
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
                <div className="font-medium text-ink-900">{s.name}</div>
                <div className="text-xs text-ink-700/60 mt-1">
                  {s.examples.slice(0, 3).join(" · ")}
                </div>
                <div className="text-xs text-atlas-600 mt-2">
                  {indCount} industries →
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Popular pages: globally diverse picks */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900">Popular pages</h2>
        <p className="text-sm text-ink-700/70 mt-1">
          Hand-picked entry points across the atlas. Click any tile to see the
          full cell: distribution, time series, after-tax owner take.
        </p>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/us/new-york/restaurants", "US", "Restaurants, New York"],
            ["/gb/london/legal-services", "GB", "Legal services, London"],
            ["/de/munich/software-development", "DE", "Software dev, Munich"],
            ["/es/madrid/cafes-coffee-shops", "ES", "Cafés, Madrid"],
            ["/jp/jp-13000/restaurants", "JP", "Restaurants, Tokyo"],
            ["/br/br-sp/grocery-stores", "BR", "Grocery, São Paulo"],
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
              <span className="text-atlas-600">→</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
