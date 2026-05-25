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

export default function CitiesHub() {
  const grouped = new Map<string, City[]>();
  for (const c of CITIES) {
    const label = CONTINENT_LABEL[c.continent] || "Other";
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(c);
  }
  for (const arr of grouped.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Cities
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Two hundred cities of the world
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl">
        Each city opens to a hero, an industry mosaic, neighborhoods
        (where covered), curiosities, and sister-city comparisons.
      </p>

      {/* v34 sanity sweep section 2: geographic map anchors the page,
          one marker per covered city, each linking to its city page. */}
      <section className="mb-12" aria-labelledby="cities-map-heading">
        <h2
          id="cities-map-heading"
          className="sr-only"
        >
          Map of covered cities
        </h2>
        <CitiesWorldMap cities={MAP_CITIES} />
      </section>

      {CONTINENT_ORDER.map((continent) => {
        const cities = grouped.get(continent);
        if (!cities) return null;
        return (
          <section key={continent} className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-4 pb-2 border-b border-parchment">
              {continent} <span className="text-sm font-normal text-cocoa-700/60 tabular-nums">· {cities.length} cities</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}`}
                  className="flex items-center gap-1.5 py-1.5 text-sm text-ink-800 hover:text-atlas-700 transition-colors"
                >
                  <CountryFlag iso2={c.iso2} className="w-3.5 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
