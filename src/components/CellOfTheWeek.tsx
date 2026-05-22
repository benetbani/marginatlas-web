/**
 * CellOfTheWeek — Plan v4.0 Step 19.
 *
 * One hand-curated cell per week with a one-line editorial note. Rotates
 * deterministically by the ISO week number so the home page never feels
 * stale. Server component — fetches the cell at render time.
 */

import { getCellBySlug, type Cell } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";
import { getCellOfTheWeekSnapshot, findSnapshotCell } from "@/lib/snapshots";
import { fmtMoney } from "@/lib/format/money";

/**
 * Plan v17 fix — same timeout pattern as FeaturedCellTile. Bound the
 * homepage stream time so a cold-cache Supabase call doesn't park the
 * "Snapshot of the week" section as an empty `<template>` placeholder.
 */
async function fetchCellWithTimeout(
  country: string,
  geo: string,
  industry: string,
  ms = 1500,
): Promise<Cell | null> {
  let timer: NodeJS.Timeout | null = null;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    return await Promise.race([getCellBySlug(country, geo, industry), timeout]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

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
    note: "California restaurants are the canonical SMB benchmark: high firm count, real spread, strong data.",
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
    note: "Germany's metal products manufacturing: the backbone of the Mittelstand.",
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
    note: "Software development in California: both the long tail of indie shops and the well-funded startups.",
  },
  {
    country: "it",
    geo: "italy",
    industry: "restaurants",
    note: "Italian restaurants: globally the most-searched SMB benchmark; the data tells the story.",
  },
  {
    country: "jp",
    geo: "japan",
    industry: "restaurants",
    note: "Japanese restaurants: small footprint, high firm density, family-owned tradition.",
  },
];

function weekNumber(d: Date): number {
  // ISO-8601 week number (close enough for rotation purposes).
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
}

export async function CellOfTheWeek() {
  const week = weekNumber(new Date());
  const snap = getCellOfTheWeekSnapshot();
  // Plan v18 Phase 0 — read from baked snapshot first (sync); fall back
  // to the Plan v17 2-try timeout race only if the snapshot is missing
  // or this week's pick isn't in it.
  const MAX_TRIES = 2;
  for (let i = 0; i < MAX_TRIES; i++) {
    const pick = ROTATION[(week + i) % ROTATION.length];
    const industrySnapshotKey = pick.industry.replace(/-/g, "_");
    const baked = findSnapshotCell(snap, pick.country, pick.geo, industrySnapshotKey);
    let cell: { revenue_per_firm: number | null; industry_name: string | null; geo_name: string | null } | null;
    if (baked) {
      cell = {
        revenue_per_firm: baked.revenue_per_firm,
        industry_name: baked.industry_name,
        geo_name: baked.geo_name,
      };
    } else {
      const live = await fetchCellWithTimeout(pick.country, pick.geo, pick.industry);
      cell = live
        ? {
            revenue_per_firm: live.revenue_per_firm ?? null,
            industry_name: live.industry_name ?? null,
            geo_name: live.geo_name ?? null,
          }
        : null;
    }
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
                Snapshot of the week
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
                <p className="mt-3 text-sm md:text-base text-ink-900/85 leading-relaxed max-w-2xl">
                  {pick.note}
                </p>
                <div className="mt-4 text-xs text-atlas-700 font-medium group-hover:text-atlas-900">
                  Open the full snapshot →
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-[10px] uppercase tracking-wider text-cocoa-700/70 font-medium">
                  Typical revenue
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-ink-900 tabular-nums">
                  {fmtMoney(cell.revenue_per_firm)}
                </div>
              </div>
            </div>
          </a>
        </section>
      );
    }
  }
  return null;
}
