/**
 * FeaturedCellTile — server-rendered tile for the home-page 12-tile
 * featured anchors grid (Plan v3.0 §N).
 *
 * Each tile shows: flag, industry title, region tagline, the typical
 * revenue (when available), and an optional industry-themed image
 * placeholder at the top.
 *
 * Renders even when the underlying cell isn't found yet — falls back to
 * a "Coming soon" chip so the marketing list works today.
 */

import { getCellBySlug } from "@/lib/cells";
import { flagFromIso2 } from "@/lib/countries";
import { SmartImage } from "./SmartImage";

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
  const href = `/${spec.iso2.toLowerCase()}/${spec.geo}/${spec.industry}`;
  const flag = spec.flagOverride || flagFromIso2(spec.iso2);

  return (
    <a
      href={href}
      className="group relative block rounded-2xl bg-white border border-cream-300 overflow-hidden hover:border-atlas-600 hover:shadow-[0_8px_24px_rgba(120,53,15,0.10)] transition"
    >
      {/* Image placeholder (HOME-2 in plan) */}
      <SmartImage
        alt={`${spec.title} in ${spec.region}`}
        glyph={spec.glyph}
        aspectRatio={1.6}
        rounded="lg"
        className="rounded-b-none rounded-t-2xl"
      />
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-atlas-700 font-semibold flex items-center gap-1.5">
          <span className="flag" aria-hidden>{flag}</span>
          <span>{spec.region}</span>
        </div>
        <div className="mt-1 text-base font-semibold text-ink-900 leading-snug">
          {spec.title}
        </div>
        <div className="mt-2 text-sm text-cocoa-700">
          {cell && cell.revenue_per_firm != null ? (
            <>
              Typical revenue:{" "}
              <strong className="text-ink-900">{fmtMoney(cell.revenue_per_firm)}</strong>
              {cell.n_enterprises ? (
                <span className="text-ink-700/70"> · {cell.n_enterprises.toLocaleString()} firms</span>
              ) : null}
            </>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-parchment text-cocoa-700 text-[11px]">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
