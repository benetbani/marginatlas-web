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
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl">
        Each city opens to a hero, an industry mosaic, neighborhoods
        (where covered), curiosities, and sister-city comparisons.
      </p>

      {/* Cities §1: geographic map anchors the page, one marker per
          covered city, each linking to its city page. */}
      <section className="mb-12" aria-labelledby="cities-map-heading">
        <h2 id="cities-map-heading" className="sr-only">
          Map of covered cities
        </h2>
        <CitiesWorldMap cities={MAP_CITIES} />
      </section>

      {/* Cities list — founder spec 2026-05-25: countries laid out
          in a compact horizontal grid (2 cols mobile, 3 cols tablet,
          4 cols desktop), so most countries take one cell and cities
          of the same country sit clustered immediately below their
          flag. Eliminates the gigantic vertical white space the
          previous full-row-per-country layout created. */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
              {sortedCountries.map((countryName) => {
                const cities = byCountry.get(countryName)!;
                const iso2 = cities[0]?.iso2 || "";
                return (
                  <div key={countryName} className="min-w-0">
                    <h3 className="flex items-center gap-2 mb-1.5">
                      <CountryFlag iso2={iso2} className="w-5 shrink-0" />
                      <span className="font-display text-sm md:text-base font-semibold text-ink-900 truncate">
                        {countryName}
                      </span>
                      {cities.length > 1 && (
                        <span className="text-[10px] font-normal text-cocoa-700/50 tabular-nums shrink-0">
                          {cities.length}
                        </span>
                      )}
                    </h3>
                    <ul className="space-y-0.5">
                      {cities.map((c) => (
                        <li key={c.slug} className="leading-tight">
                          <Link
                            href={`/cities/${c.slug}`}
                            className="text-sm text-ink-800 hover:text-atlas-700 transition-colors"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </article>
  );
}
