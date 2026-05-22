/**
 * AcrossStatesStrip — horizontal "how this industry stacks up across the
 * country" view. Bar lengths are firm count (or revenue) relative to the
 * leader. Each row is a link to that state's cell page for the same
 * industry.
 */

import type { Cell } from "@/lib/cells";
import { cellUrl } from "@/lib/cells";
import { fmtMoney } from "@/lib/format/money";

type CellLike = Cell;

type Props = {
  industryName: string;
  currentGeoName: string;
  cells: CellLike[];
};

export function AcrossStatesStrip({ industryName, currentGeoName, cells }: Props) {
  if (cells.length === 0) return null;
  const maxN = Math.max(...cells.map((c) => c.n_enterprises || 0));
  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        {industryName} across the country
      </h2>
      <p className="text-sm text-ink-700/70 mt-1">
        How {currentGeoName} stacks up against the other states with the most
        firms in this industry.
      </p>
      <div className="mt-4 card">
        <div className="space-y-1.5">
          {cells.map((c) => {
            const pct = maxN > 0 && c.n_enterprises ? Math.max(6, (c.n_enterprises / maxN) * 100) : 0;
            return (
              <a
                key={c.geo_id}
                href={cellUrl(c) || "#"}
                className="grid grid-cols-[140px_1fr_auto] items-center gap-3 px-2 py-1.5 rounded hover:bg-ink-100/60 transition"
              >
                <div className="text-sm text-ink-900 truncate">{c.geo_name || c.geo_id}</div>
                <div className="h-3 bg-cream-100/70 rounded overflow-hidden">
                  <div
                    className="h-full bg-atlas-500"
                    style={{ width: `${pct}%`, transition: "width 0.4s ease" }}
                  />
                </div>
                <div className="text-xs text-ink-700/60 tabular-nums text-right w-20">
                  {fmtMoney(c.revenue_per_firm)}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
