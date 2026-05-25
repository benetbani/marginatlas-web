/**
 * TopProfitableActivities (Cities sec 6).
 *
 * Two side-by-side ranked lists for a city page:
 *   - top 5 most profitable activities (highest net margin)
 *   - top 5 least profitable activities (lowest net margin)
 *
 * Data source: src/lib/finance/industry_margins.json (global per-industry
 * net margins). Per founder, margins do not vary materially by city,
 * so the rankings are surfaced on the city page with a footer note that
 * the data is industry-level.
 *
 * Server component, no client JS. Self-suppresses if the margins file
 * is empty.
 */

import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";

type Row = {
  gross_margin?: number;
  operating_margin?: number;
  net_margin?: number;
};

type MarginsFile = {
  default_fallback?: Row;
  industries: Record<string, Row>;
};

const FILE = industryMarginsJson as unknown as MarginsFile;

type Ranked = {
  id: string;
  name: string;
  slug: string;
  netMargin: number;
};

function buildRankings(): Ranked[] {
  const rows: Ranked[] = [];
  for (const [id, row] of Object.entries(FILE.industries || {})) {
    const net = row?.net_margin;
    if (typeof net !== "number" || !isFinite(net)) continue;
    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;
    rows.push({
      id,
      name: ind.name,
      slug: industryToSlug(id),
      netMargin: net,
    });
  }
  rows.sort((a, b) => b.netMargin - a.netMargin);
  return rows;
}

function formatPct(n: number): string {
  if (!isFinite(n)) return "-";
  // n is already a fraction (0.12 = 12%) per the existing file convention.
  return `${(n * 100).toFixed(1)}%`;
}

export function TopProfitableActivities({
  countryIso2,
}: {
  countryIso2: string;
}) {
  const ranked = buildRankings();
  if (ranked.length < 10) return null;

  const top5 = ranked.slice(0, 5);
  const bottom5 = ranked.slice(-5).reverse();

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Profit margins, by activity
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        What earns and what bleeds
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Net profit margin ranges, by industry. Margins are industry-level
        (consistent across geographies, with light local variation). The
        list on the left ends up with what most generously rewards the
        operator; the list on the right tends to grind.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <RankedList
          title="Most profitable"
          rows={top5}
          countryIso2={countryIso2}
        />
        <RankedList
          title="Least profitable"
          rows={bottom5}
          countryIso2={countryIso2}
        />
      </div>
    </section>
  );
}

function RankedList({
  title,
  rows,
  countryIso2,
}: {
  title: string;
  rows: Ranked[];
  countryIso2: string;
}) {
  return (
    <div className="rounded-2xl border border-parchment bg-white p-4 md:p-5">
      <div className="text-[11px] uppercase tracking-wide text-cocoa-700/70 font-semibold mb-3">
        {title}
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.id}>
            <a
              href={`/${countryIso2.toLowerCase()}/${countryIso2.toLowerCase()}/${r.slug}`}
              className="flex items-baseline justify-between gap-3 py-1.5 px-2 -mx-2 rounded-md hover:bg-cream-100 transition-colors"
            >
              <span className="text-sm text-ink-900 truncate">{r.name}</span>
              <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                {formatPct(r.netMargin)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
