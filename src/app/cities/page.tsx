/**
 * Plan v27 Lane C — cities hub at /cities.
 *
 * Full alphabetical listing of all 200 cities, grouped by continent.
 * Server-rendered, revalidate 24h.
 */
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { CountryFlag } from "@/components/CountryFlag";

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
    <article className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
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
