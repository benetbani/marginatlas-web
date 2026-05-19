/**
 * Country city shortcut tiles (Track N).
 *
 * Renders 6-12 of the top-attention cities for a country, sourced from
 * the Track M canonical 100-city list. Each tile fetches a snapshot for
 * the default industry (restaurants) and links directly to that cell —
 * removing the country → region → cell drill friction.
 *
 * Cities with no measured / extrapolated data are dropped from the grid
 * (per R-016: no "Coming soon" placeholders).
 */

import Link from "next/link";
import { getCitiesForCountry, type CityEntry } from "@/lib/cities";
import { getCellBySlug } from "@/lib/cells";

type Props = {
  iso2: string;
  /** Default industry slug to feature on each tile. */
  defaultIndustry?: string;
  /** Max number of tiles to render (defaults to 12). */
  limit?: number;
};

type Snapshot = {
  city: CityEntry;
  found: boolean;
  n_enterprises: number | null;
  revenue_per_firm: number | null;
};

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${Math.round(v / 1e3)}K`;
  return `$${Math.round(v)}`;
}

export async function CountryCityShortcuts({
  iso2,
  defaultIndustry = "restaurants",
  limit = 12,
}: Props) {
  const cities = getCitiesForCountry(iso2, limit);
  if (cities.length === 0) return null;

  const iso2Lower = iso2.toLowerCase();
  const snapshots: Snapshot[] = await Promise.all(
    cities.map(async (city) => {
      const cell = await getCellBySlug(iso2Lower, city.slug, defaultIndustry);
      return {
        city,
        found: !!cell,
        n_enterprises: cell?.n_enterprises ?? null,
        revenue_per_firm: cell?.revenue_per_firm ?? null,
      };
    })
  );

  // Drop tiles with no resolvable cell — no placeholders (R-016).
  const renderable = snapshots.filter((s) => s.found);
  if (renderable.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        Top cities in {cities[0].country_name}
      </h2>
      <p className="mt-1 text-sm text-ink-700/70">
        Skip the region drill: pick a city directly.
      </p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {renderable.map((s) => {
          const { city } = s;
          const href = `/${iso2Lower}/${city.slug}/${defaultIndustry.replace(/_/g, "-")}`;
          return (
            <Link
              key={city.id}
              href={href}
              className="block px-4 py-3 rounded-xl border border-cream-300 bg-white hover:border-atlas-600 hover:shadow-[0_6px_18px_rgba(120,53,15,0.08)] transition"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-ink-900">
                  {city.name}
                </div>
                {city.tier === 1 && (
                  <span className="text-[9px] uppercase tracking-wider text-atlas-700 font-semibold">
                    Global
                  </span>
                )}
              </div>
              {s.revenue_per_firm != null ? (
                <div className="mt-1.5 text-xs text-cocoa-700">
                  Typical{" "}
                  <strong className="text-ink-900">{fmtMoney(s.revenue_per_firm)}</strong>
                </div>
              ) : (
                <div className="mt-1.5 text-xs text-ink-700/60">
                  Open for full numbers →
                </div>
              )}
              {city.data_status === "extrapolated" && (
                <div className="mt-1.5 text-[10px] uppercase tracking-wider text-cocoa-700/60">
                  Estimated
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
