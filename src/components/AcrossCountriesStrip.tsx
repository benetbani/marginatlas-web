/**
 * AcrossCountriesStrip — shows the same industry across other countries.
 * Used on non-US cell pages and country landing pages. Bar length is the
 * predicted typical revenue relative to the top country in the strip.
 *
 * Plan v3.0 §M (flags) + §O (cross-pivots).
 */

import { cellUrl, type Cell } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtMoney } from "@/lib/format/money";

export function AcrossCountriesStrip({
  industryName,
  currentCountryName,
  cells,
}: {
  industryName: string;
  currentCountryName: string;
  cells: Cell[];
}) {
  if (cells.length === 0) return null;
  const maxRev = Math.max(...cells.map((c) => c.revenue_per_firm || 0));

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        {industryName} across the world
      </h2>
      <p className="text-sm text-ink-700/70 mt-1">
        How {currentCountryName} compares to other countries with the
        highest typical revenue in this industry.
      </p>
      <div className="mt-4 card">
        <div className="space-y-1.5">
          {cells.map((c) => {
            const pct =
              maxRev > 0 && c.revenue_per_firm
                ? Math.max(6, (c.revenue_per_firm / maxRev) * 100)
                : 0;
            return (
              <a
                key={c.geo_id}
                href={cellUrl(c) || "#"}
                className="grid grid-cols-[180px_1fr_auto] items-center gap-3 px-2 py-1.5 rounded hover:bg-cream-100 transition"
              >
                <div className="text-sm text-ink-900 truncate inline-flex items-center gap-2">
                  <CountryFlag iso2={c.country} label={c.geo_name || c.country} className="w-5" />
                  <span className="truncate">{c.geo_name || c.country}</span>
                </div>
                <div className="h-3 bg-cream-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-atlas-400 to-atlas-600"
                    style={{ width: `${pct}%`, transition: "width 0.4s ease" }}
                  />
                </div>
                <div className="text-xs text-ink-900 tabular-nums text-right w-24 font-medium">
                  {fmtMoney(c.revenue_per_firm)}
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-cocoa-700/70">
          Bars show typical revenue per firm (estimated).
        </div>
      </div>
    </section>
  );
}
