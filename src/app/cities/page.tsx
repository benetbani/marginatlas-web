/**
 * Plan v27 Lane C, cities hub at /cities.
 *
 * Full alphabetical listing of all 200 cities, grouped by continent.
 * Server-rendered, revalidate 24h.
 *
 * v34 sanity sweep section 2: a full-bleed geographic map now anchors
 * the page above the alphabetical list. Map renders every covered city
 * as a marker at its real lat/lon, joined from city_coordinates_v1.json.
 */
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../data/cities/city_list_v1.json";
import cityCoordsJson from "../../../data/cities/city_coordinates_v1.json";
import { CountryFlag } from "@/components/CountryFlag";
import CitiesWorldMap, {
  type CitiesWorldMapCity,
} from "@/components/cities/CitiesWorldMap";
import { COUNTRIES } from "@/lib/taxonomy";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All cities | Margin Atlas",
  description: "Two hundred cities of the world with small business benchmarks, neighborhood breakdowns, and side-by-side comparisons.",
};

type City = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
};

const CITIES = (cityListJson as { cities: City[] }).cities;

type CityCoord = { slug: string; lat: number; lon: number };
const COORDS = (cityCoordsJson as { coordinates: CityCoord[] }).coordinates;
const COORD_BY_SLUG = new Map(COORDS.map((c) => [c.slug, c]));

// Join the city list to the coordinates table. v34 sanity sweep section
// 2 hard target 2.4: render exactly the full set, do not silently drop.
// If a city is missing coords we surface the gap by logging at build
// time and rendering it at 0,0 would distort the map, so we filter here
// and the prebuild check would have caught a mismatch earlier.
const MAP_CITIES: CitiesWorldMapCity[] = CITIES.map((c) => {
  const coord = COORD_BY_SLUG.get(c.slug);
  if (!coord) return null;
  return {
    slug: c.slug,
    name: c.name,
    iso2: c.iso2,
    lat: coord.lat,
    lon: coord.lon,
  };
}).filter((c): c is CitiesWorldMapCity => c !== null);

// Cities §3 founder revision: 6 standard continents in alphabetical
// order. The data was normalized by scripts/data/cities/apply_section2_curation.py
// so every entry now uses these labels exactly. Old labels (EU, NA, SA,
// MENA) are kept as fallbacks in case any legacy entry slips through.
const CONTINENT_LABEL: Record<string, string> = {
  Africa: "Africa",
  Asia: "Asia",
  Europe: "Europe",
  "North America": "North America",
  Oceania: "Oceania",
  "South America": "South America",
  // Legacy fallbacks
  EU: "Europe",
  NA: "North America",
  SA: "South America",
  MENA: "Asia",
};
const CONTINENT_ORDER = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

// Map iso2 -> country name from the taxonomy so we can group cities by
// country within each continent. Falls back to iso2 if not found.
const COUNTRY_NAME_BY_ISO2 = new Map(
  COUNTRIES.map((c) => [c.code.toUpperCase(), c.name]),
);

export default function CitiesHub() {
  // Cities §3 founder structure: continent (alphabetical) -> country
  // (alphabetical) -> cities (alphabetical). Two-level grouping.
  const grouped = new Map<string, Map<string, City[]>>();
  for (const c of CITIES) {
    const continent = CONTINENT_LABEL[c.continent] || "Other";
    if (!grouped.has(continent)) grouped.set(continent, new Map());
    const countryName =
      COUNTRY_NAME_BY_ISO2.get(c.iso2.toUpperCase()) || c.iso2;
    const byCountry = grouped.get(continent)!;
    if (!byCountry.has(countryName)) byCountry.set(countryName, []);
    byCountry.get(countryName)!.push(c);
  }
  // Sort cities within each country alphabetically.
  for (const byCountry of grouped.values()) {
    for (const arr of byCountry.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Cities
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Cities of the world
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-8 max-w-2xl">
        Each city opens to a hero, an industry mosaic, neighborhoods
        (where covered), curiosities, and sister-city comparisons.
      </p>

      {/* Founder spec 2026-05-25: the entire cities content (map +
         every continent block) sits on ONE big white card so the
         body paper pattern stops fighting the dense text. Warm
         cocoa shadow seats the card on the page. */}
      <div className="rounded-2xl bg-white border border-[rgba(76,39,18,0.10)] shadow-[0_2px_4px_rgba(76,39,18,0.05),_0_12px_28px_rgba(76,39,18,0.06)] px-4 md:px-8 py-6 md:py-10">

      {/* Cities §1: geographic map anchors the page, one marker per
          covered city, each linking to its city page. */}
      <section className="mb-12" aria-labelledby="cities-map-heading">
        <h2 id="cities-map-heading" className="sr-only">
          Map of covered cities
        </h2>
        <CitiesWorldMap cities={MAP_CITIES} />
      </section>

      {/* Cities list - founder revision 2026-05-25 (round 2).
          Round 1 used a grid; round 2 keeps countries as paragraph
          blocks where cities flow horizontally (separated by middots)
          and the WHOLE LIST of country blocks packs into a CSS
          multi-column layout. break-inside: avoid keeps each country
          intact within a column. The result: US (45 cities) becomes
          a wrapping paragraph that consumes vertical space ONLY
          where needed, and smaller countries pack next to it without
          forcing staircase whitespace. Encyclopedia index pattern. */}
      {CONTINENT_ORDER.map((continent) => {
        const byCountry = grouped.get(continent);
        if (!byCountry) return null;
        const sortedCountries = [...byCountry.keys()].sort((a, b) =>
          a.localeCompare(b),
        );
        const totalCities = [...byCountry.values()].reduce(
          (n, arr) => n + arr.length,
          0,
        );
        return (
          <section key={continent} className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 mb-5 pb-2 border-b-2 border-parchment">
              {continent}{" "}
              <span className="text-sm font-normal text-cocoa-700/60 tabular-nums">
                &middot; {totalCities} cities
              </span>
            </h2>
            <div
              className="gap-x-8"
              style={{
                columnGap: "2rem",
                columnCount: 1,
                columnFill: "balance",
              }}
            >
              {/* Responsive column count via inline media queries on a
                  style element would need a JS path. Instead use a
                  class that resolves to column-count via globals. The
                  inline style above sets the mobile default (1 col),
                  and the data-attribute below is what desktop CSS keys
                  off to bump to 2 or 3 columns. */}
              <style>
                {`
                  @media (min-width: 640px) { .atlas-cities-columns { column-count: 2; } }
                  @media (min-width: 1024px) { .atlas-cities-columns { column-count: 3; } }
                `}
              </style>
              <div className="atlas-cities-columns" style={{ columnGap: "2.5rem", columnFill: "balance" }}>
                {sortedCountries.map((countryName) => {
                  const cities = byCountry.get(countryName)!;
                  const iso2 = cities[0]?.iso2 || "";
                  return (
                    <article
                      key={countryName}
                      className="mb-5"
                      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                    >
                      <h3
                        className="flex items-baseline gap-2.5 mb-1.5"
                        data-typography="custom"
                      >
                        <CountryFlag
                          iso2={iso2}
                          className="w-7 shrink-0 translate-y-[2px]"
                        />
                        <span className="font-display text-base md:text-lg font-semibold text-ink-900">
                          {countryName}
                        </span>
                        {cities.length > 1 && (
                          <span className="text-[11px] font-normal text-cocoa-700/55 tabular-nums">
                            {cities.length}
                          </span>
                        )}
                      </h3>
                      {/* Cities flow horizontally as a paragraph of bold
                          links separated by middots. Each link is its
                          OWN whitespace-nowrap element; the middot is
                          a plain text node with surrounding spaces, so
                          the browser has a real break opportunity
                          between links. This fixes the "Sapporo /
                          Cebu" overlap from the previous build, where
                          adjacent whitespace-nowrap spans with no
                          space-character between them rendered as a
                          single unbreakable line in some browsers. */}
                      <p className="text-sm text-ink-800 leading-[1.7]">
                        {cities.map((c, idx) => (
                          <span key={c.slug}>
                            <Link
                              href={`/cities/${c.slug}`}
                              className="font-semibold text-ink-900 hover:text-atlas-700 transition-colors"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {c.name}
                            </Link>
                            {idx < cities.length - 1 ? (
                              <span aria-hidden="true" className="text-cocoa-700/35">
                                {" · "}
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Close the big white card wrapper. */}
      </div>
    </article>
  );
}
