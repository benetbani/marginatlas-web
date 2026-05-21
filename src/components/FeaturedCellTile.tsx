/**
 * FeaturedCellTile — home-page tile for the curated 3×3 featured grid.
 *
 * Plan v16 Block H change: tile ALWAYS renders the same shape. When the
 * underlying benchmark is unavailable, we render the tile chrome without
 * a number rather than dropping it. This preserves the grid's symmetric
 * 3×3 layout regardless of data state. The click still navigates to the
 * cell page (which has its own fallback handling).
 *
 * Compared with the prior null-return behavior (Plan v4.0 Step 16.7):
 * symmetry trumps perfect data density. The founder flagged 4-then-2
 * asymmetry as a major UX defect.
 */

import { getCellBySlug } from "@/lib/cells";
import { CountryFlag } from "@/components/CountryFlag";

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "";
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
};

export async function FeaturedCellTile({ spec }: { spec: FeaturedTileSpec }) {
  const cell = await getCellBySlug(spec.iso2.toLowerCase(), spec.geo, spec.industry);
  const revenue = cell?.revenue_per_firm ?? null;
  const href = `/${spec.iso2.toLowerCase()}/${spec.geo}/${spec.industry}`;

  return (
    <a
      href={href}
      className="group relative block rounded-2xl bg-white border border-parchment overflow-hidden hover:border-atlas-600 hover:shadow-[0_8px_24px_rgba(120,53,15,0.10)] transition-all"
    >
      <div className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-cocoa-700 font-medium">
            <CountryFlag iso2={spec.iso2} label={spec.region} className="w-5" />
            <span>{spec.region}</span>
          </span>
        </div>
        <div className="text-base font-semibold text-ink-900 leading-tight group-hover:text-atlas-700 transition-colors">
          {spec.title} in {spec.region}
        </div>
        <div className="mt-auto pt-3 border-t border-cocoa-700/10">
          <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-medium">
            Typical revenue
          </div>
          <div className="text-2xl font-semibold text-ink-900 tabular-nums min-h-[2rem]">
            {fmtMoney(revenue) || (
              <span className="text-base font-medium text-cocoa-700/60">
                Click for details
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
