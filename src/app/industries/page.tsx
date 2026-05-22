/**
 * /industries — top-level industry directory page.
 *
 * Mirror of /browse but pivoted around industries: alphabetical index,
 * sector grouping, plus a curated "popular industries" strip. Adds a
 * meaningful third entry path alongside countries and sectors.
 */
import Link from "next/link";
import {
  INDUSTRIES,
  INDUSTRIES_BY_SECTOR,
  SECTORS_ORDERED,
  industryToSlug,
  isDefaultVisible,
} from "@/lib/taxonomy";
import { sectorIcon } from "@/lib/taxonomy/sector_icons";

export const revalidate = 86400;

export const metadata = {
  title: "All industries: Margin Atlas",
  description:
    "Every industry covered in Margin Atlas. Pick one to see how it earns across the whole world.",
  alternates: { canonical: "/industries" },
};

const POPULAR: Array<{ id: string; label: string; glyph: string }> = [
  { id: "restaurants", label: "Restaurants", glyph: "🍽️" },
  { id: "cafes_coffee", label: "Cafés & coffee shops", glyph: "☕" },
  { id: "legal_services", label: "Legal services", glyph: "⚖️" },
  { id: "software_development", label: "Software development", glyph: "💻" },
  { id: "residential_construction", label: "Residential construction", glyph: "🏗️" },
  { id: "real_estate_agencies", label: "Real estate agencies", glyph: "🏘️" },
  { id: "management_consulting", label: "Management consulting", glyph: "💼" },
  { id: "marketing_design", label: "Marketing & design", glyph: "🎨" },
  { id: "grocery_stores", label: "Grocery stores", glyph: "🛒" },
  { id: "metal_products_mfg", label: "Metal products mfg", glyph: "⚙️" },
  { id: "auto_repair_shops", label: "Auto repair", glyph: "🔧" },
  { id: "hotels_lodging", label: "Hotels & lodging", glyph: "🏨" },
];

export default function IndustriesIndex() {
  const visibleSectors = SECTORS_ORDERED.filter(
    (s) => (INDUSTRIES_BY_SECTOR[s.id] || []).some(isDefaultVisible)
  );

  return (
    <div className="py-10">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
          Industries
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Every industry we cover
        </h1>
        <p className="mt-3 text-lg text-ink-800/80">
          Pick an industry to see how it earns worldwide: typical
          revenue, employment, after-tax owner take-home, and where
          every business lands from bottom 10% to top 10%.
        </p>
      </header>

      {/* Popular */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mb-3">
          Popular industries
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {POPULAR.map((p) => (
            <Link
              key={p.id}
              href={`/industries/${industryToSlug(p.id)}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream-100 border border-parchment hover:border-atlas-500 hover:bg-white transition text-sm text-ink-900"
            >
              <span className="text-xl leading-none">{p.glyph}</span>
              <span className="flex-1 font-medium">{p.label}</span>
              <span className="text-atlas-600">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* By sector */}
      <section className="mt-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mb-3">
          By sector
        </h2>
        <p className="text-sm text-ink-700/70 mb-5">
          Click a sector for the full list of industries inside, or jump
          straight to a specific industry below.
        </p>
        <div className="space-y-8">
          {visibleSectors.map((s) => {
            const inds = (INDUSTRIES_BY_SECTOR[s.id] || []).filter(isDefaultVisible);
            if (inds.length === 0) return null;
            return (
              <div key={s.id}>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-ink-900 flex items-center gap-2">
                    <span aria-hidden className="text-lg leading-none">{sectorIcon(s.id)}</span>
                    {s.name}
                  </h3>
                  <Link
                    href={`/sectors/${s.id}`}
                    className="text-xs text-atlas-700 hover:text-atlas-900 font-medium"
                  >
                    Sector page →
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inds.map((ind) => (
                    <Link
                      key={ind.id}
                      href={`/industries/${industryToSlug(ind.id)}`}
                      className="inline-flex px-2.5 py-1 rounded-full bg-white border border-ink-200 text-xs text-ink-900 hover:border-atlas-500 hover:bg-atlas-50 transition"
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alphabetical */}
      <section className="mt-12">
        <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mb-3">
          A-Z
        </h2>
        <p className="text-sm text-ink-700/70 mb-5">
          {INDUSTRIES.filter(isDefaultVisible).length} default-visible
          industries. Each opens its worldwide benchmark page: typical
          revenue, employment, and how the industry varies country by
          country.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1.5 text-sm">
          {[...INDUSTRIES]
            .filter(isDefaultVisible)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((ind) => (
              <Link
                key={ind.id}
                href={`/industries/${industryToSlug(ind.id)}`}
                className="text-ink-900 hover:text-atlas-700 truncate"
              >
                {ind.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
