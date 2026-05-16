/**
 * FeaturedCellTile — server-rendered tile for the home-page 12-tile
 * featured anchors grid (Plan v4.0 Step 16).
 *
 * Plan v4.0 change: NO "Coming soon" tiles. If the underlying cell is
 * not found, this component returns null and the tile is dropped from
 * the grid entirely. Callers should expect this and not allocate visual
 * space for missing tiles.
 */

import { getCellBySlug } from "@/lib/cells";
import { flagFromIso2 } from "@/lib/countries";

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export type FeaturedTileSpec = {
  iso2: string;
  geo: string;
  industry: string;
  title: string;
  region: string;
  glyph: string;
  flagOverride?: string;
};

export async function FeaturedCellTile({ spec }: { spec: FeaturedTileSpec }) {
  const cell = await getCellBySlug(spec.iso2.toLowerCase(), spec.geo, spec.industry);
  // Plan v4.0 Step 16.7: if data is missing, drop the tile entirely.
  if (!cell || cell.revenue_per_firm == null) return null;

  const href = `/${spec.iso2.toLowerCase()}/${spec.geo}/${spec.industry}`;
  const flag = spec.flagOverride || flagFromIso2(spec.iso2);

  return (
    <a
      href={href}
      className="group relative block rounded-2xl bg-white border border-parchment overflow-hidden hover:border-atlas-600 hover:shadow-[0_8px_24px_rgba(120,53,15,0.10)] transition-all"
    >
      <div className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-cocoa-700 font-medium">
            <span className="flag text-lg leading-none" aria-hidden>{flag}</span>
            <span>{spec.region}</span>
          </span>
          {cell.year && (
            <span className="text-cocoa-700/50 tabular-nums">{cell.year}</span>
          )}
        </div>
        <div className="text-base font-semibold text-ink-900 leading-tight group-hover:text-atlas-700 transition-colors">
          {spec.title} in {spec.region}
        </div>
        <div className="mt-auto pt-3 border-t border-cocoa-700/10 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-medium">
              Typical revenue
            </div>
            <div className="text-2xl font-semibold text-ink-900 tabular-nums">
              {fmtMoney(cell.revenue_per_firm)}
            </div>
          </div>
          {cell.n_enterprises ? (
            <div className="text-[10px] text-cocoa-700/60 text-right tabular-nums leading-tight">
              <div className="font-medium text-cocoa-900">
                {cell.n_enterprises >= 1000
                  ? `${(cell.n_enterprises / 1000).toFixed(1)}k`
                  : cell.n_enterprises.toLocaleString()}
              </div>
              <div>firms</div>
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}
