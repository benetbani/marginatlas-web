/**
 * Plan v27 Lane C.1 - top-200 cities homepage mosaic.
 *
 * Replaces the flat alphabetical CityPicker with a continent-grouped
 * card grid. Each card shows the city hero (Unsplash, where cached),
 * country flag, and a deep-link to the metropolis sub-page.
 *
 * Server component - zero client cost. Tab switching is plain anchor
 * links to /cities/[continent], so we don't pay client-JS for
 * filtering.
 *
 * Data sources:
 *   - data/cities/city_list_v1.json (200 cities)
 *   - data/images/city_heroes_v1.json (subset have heroes)
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { getCityHero } from "@/lib/images/city_heroes";
import { CountryFlag } from "@/components/CountryFlag";

type City = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  gdp_b: number;
  wealth_z: number;
};

const CITIES = (cityListJson as { cities: City[] }).cities;

const CONTINENT_LABEL: Record<string, string> = {
  NA: "Americas",
  SA: "Americas",
  EU: "Europe",
  Asia: "Asia-Pacific",
  Oceania: "Asia-Pacific",
  Africa: "Africa",
  MENA: "Middle East",
};

const CONTINENT_ORDER = ["Americas", "Europe", "Asia-Pacific", "Middle East", "Africa"];

function groupByContinent(): Map<string, City[]> {
  const m = new Map<string, City[]>();
  for (const c of CITIES) {
    const label = CONTINENT_LABEL[c.continent] || "Other";
    if (!m.has(label)) m.set(label, []);
    m.get(label)!.push(c);
  }
  for (const [k, arr] of m.entries()) {
    arr.sort((a, b) => b.pop_m - a.pop_m);
    m.set(k, arr);
  }
  return m;
}

type Props = {
  /** Maximum cards to show per continent. Default 16. */
  limit?: number;
};

export function TopCitiesMosaic({ limit = 16 }: Props) {
  const grouped = groupByContinent();

  return (
    <section className="py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Top 200 cities of the world
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 max-w-3xl">
        Where the world&apos;s small businesses make their money
      </h2>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl">
        Two hundred metros, from megacities to wealth-concentrated micros.
        Each card opens a deeper page: neighborhoods, curiosities, and
        comparisons with sister cities.
      </p>

      {CONTINENT_ORDER.map((continent) => {
        const cities = grouped.get(continent);
        if (!cities || cities.length === 0) return null;
        const shown = cities.slice(0, limit);
        return (
          <div key={continent} className="mb-12 md:mb-16">
            <div className="flex items-baseline justify-between mb-4 md:mb-6">
              <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900">
                {continent}
              </h3>
              <span className="text-xs text-cocoa-700/60 font-medium tabular-nums">
                {cities.length} cities
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {shown.map((c) => {
                const heroRecord = getCityHero(c.slug);
                // Sanity §7 — pattern-fallback variants render the
                // initial-letter gradient block, same as cache-miss.
                const hero =
                  heroRecord && heroRecord.variant !== "pattern" && heroRecord.image_url_small
                    ? heroRecord
                    : undefined;
                return (
                  <a
                    key={c.slug}
                    href={`/cities/${c.slug}`}
                    className="group block rounded-md overflow-hidden bg-white border border-parchment hover:border-atlas-500 transition-colors"
                  >
                    <div className="relative aspect-[4/3] bg-stone-100">
                      {hero ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={hero.image_url_small}
                            alt={hero.alt}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            style={{ filter: "contrast(1.05) saturate(0.85)" }}
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255,247,230,0) 40%, rgba(212,119,6,0.18) 100%)",
                              mixBlendMode: "multiply",
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-parchment">
                          <span className="font-display text-3xl md:text-4xl font-medium text-cocoa-700/40">
                            {c.name.slice(0, 1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CountryFlag iso2={c.iso2} className="w-3.5" />
                        <span className="text-[10px] uppercase tracking-wide text-cocoa-700/60 font-semibold truncate">
                          {c.iso2}
                        </span>
                      </div>
                      <div className="font-display text-base md:text-lg font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors truncate">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-cocoa-700/70 mt-0.5 tabular-nums">
                        {c.pop_m.toFixed(1)}M people
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            {cities.length > limit && (
              <div className="mt-4 text-sm text-cocoa-700/70">
                + {cities.length - limit} more  - {" "}
                <a
                  href="/cities"
                  className="text-atlas-700 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
                >
                  see all {cities.length} {continent} cities →
                </a>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
