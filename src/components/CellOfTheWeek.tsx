/**
 * CellOfTheWeek — Plan v4.0 Step 19.
 *
 * One hand-curated cell per week with a one-line editorial note. Rotates
 * deterministically by the ISO week number so the home page never feels
 * stale. Server component — fetches the cell at render time.
 */

import { getCellBySlug } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";

type Pick = {
  country: string;
  geo: string;
  industry: string;
  note: string;
};

/**
 * Curated rotation. Each entry's note is intentionally generic — keeps
 * Plan A editorial-tone lockdown intact.
 */
const ROTATION: Pick[] = [
  {
    country: "us",
    geo: "california",
    industry: "restaurants",
    note: "California restaurants are the canonical SMB benchmark — high firm count, real spread, strong data.",
  },
  {
    country: "us",
    geo: "new-york",
    industry: "real-estate-agencies",
    note: "Real estate agencies in New York: top-decile firms earn many multiples of the typical one.",
  },
  {
    country: "de",
    geo: "germany",
    industry: "metal-products-manufacturing",
    note: "Germany's metal products manufacturing — the backbone of the Mittelstand.",
  },
  {
    country: "fr",
    geo: "france",
    industry: "hotels-lodging",
    note: "French hotels & lodging: a long tail of small independent operators alongside the big chains.",
  },
  {
    country: "us",
    geo: "texas",
    industry: "residential-construction",
    note: "Residential construction in Texas: high firm count, wide revenue spread, low barrier to entry.",
  },
  {
    country: "us",
    geo: "florida",
    industry: "hairdressers-beauty",
    note: "Florida hairdressers & beauty: one of the highest small-firm densities in the country.",
  },
  {
    country: "us",
    geo: "california",
    industry: "software-development",
    note: "Software development in California — both the long tail of indie shops and the well-funded startups.",
  },
  {
    country: "it",
    geo: "italy",
    industry: "restaurants",
    note: "Italian restaurants — globally the most-searched SMB benchmark; the data tells the story.",
  },
  {
    country: "jp",
    geo: "japan",
    industry: "restaurants",
    note: "Japanese restaurants: small footprint, high firm density, family-owned tradition.",
  },
];

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function weekNumber(d: Date): number {
  // ISO-8601 week number (close enough for rotation purposes).
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
}

export async function CellOfTheWeek() {
  const week = weekNumber(new Date());
  // Pick this week's cell; if it has no data, walk forward.
  for (let i = 0; i < ROTATION.length; i++) {
    const pick = ROTATION[(week + i) % ROTATION.length];
    const cell = await getCellBySlug(pick.country, pick.geo, pick.industry);
    if (cell && cell.revenue_per_firm != null) {
      const href = `/${pick.country}/${pick.geo}/${pick.industry}`;
      return (
        <section className="py-8">
          <a
            href={href}
            className="block rounded-2xl border border-parchment bg-gradient-to-br from-atlas-50 via-cream-100 to-cream-200 hover:border-atlas-600 transition-all p-6 md:p-8"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-atlas-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-atlas-500" aria-hidden />
                Cell of the week
              </span>
              <span className="text-xs text-cocoa-700/60 tabular-nums">
                Week {week}
              </span>
            </div>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-ink-900 leading-tight inline-flex items-center gap-2 flex-wrap">
                  <CountryFlag iso2={pick.country} label={cell.geo_name || pick.country} className="w-7" />
                  <span>{cell.industry_name} in {cell.geo_name}</span>
                </h2>
                <p className="mt-3 text-sm md:text-base text-cocoa-900/85 leading-relaxed max-w-2xl">
                  {pick.note}
                </p>
                <div className="mt-4 text-xs text-atlas-700 font-medium group-hover:text-atlas-900">
                  Open the cell page →
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-[10px] uppercase tracking-wider text-cocoa-700/70 font-medium">
                  Typical revenue
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-ink-900 tabular-nums">
                  {fmtMoney(cell.revenue_per_firm)}
                </div>
                {cell.n_enterprises && (
                  <div className="mt-1 text-xs text-cocoa-700/70 tabular-nums">
                    Across {cell.n_enterprises.toLocaleString()} firms
                  </div>
                )}
              </div>
            </div>
          </a>
        </section>
      );
    }
  }
  return null;
}
