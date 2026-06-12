/**
 * AcrossStatesStrip — horizontal "how this industry stacks up across the
 * country" view. Bar lengths are typical revenue per firm relative to the
 * leader (the number rendered on the right). Each row links to that
 * state's cell page for the same industry.
 *
 * Visual upgrade §3 (2026-05-26): migrated to BarList primitive. Old
 * version had a bug: bar length was n_enterprises but the displayed
 * number was revenue_per_firm — the bars and numbers told different
 * stories. Now both match.
 */

import type { Cell } from "@/lib/cells";
import { cellUrl } from "@/lib/cells";
import { fmtMoney } from "@/lib/format/money";
import { BarList } from "@/components/ui/bar-list";

type CellLike = Cell;

type Props = {
  industryName: string;
  currentGeoName: string;
  cells: CellLike[];
};

export function AcrossStatesStrip({ industryName, currentGeoName, cells }: Props) {
  if (cells.length === 0) return null;
  // Drop rows we cannot rank — no revenue, no bar.
  const ranked = cells
    .filter((c) => typeof c.revenue_per_firm === "number" && c.revenue_per_firm > 0)
    .sort((a, b) => (b.revenue_per_firm || 0) - (a.revenue_per_firm || 0));
  if (ranked.length === 0) return null;

  return (
    // SaaS reformation 2026-06-12: seated card section on the app ground.
    <section className="mt-5 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
      <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
        {industryName} across the country
      </h2>
      <p className="text-sm text-ink-700/70 mt-1.5">
        How {currentGeoName} stacks up against the other states. Bars and
        numbers both show typical revenue per firm.
      </p>
      <div className="mt-4">
        <BarList
          size="compact"
          data={ranked.map((c) => ({
            name: c.geo_name || c.geo_id,
            value: c.revenue_per_firm || 0,
            href: cellUrl(c) || undefined,
          }))}
          valueFormatter={(n) => fmtMoney(n)}
        />
      </div>
    </section>
  );
}
