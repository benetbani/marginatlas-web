/**
 * SectorAcrossWorld (FF.3) — strip showing the same representative industry
 * across 10-12 countries on a sector page.
 *
 * Server component; fan-out via Promise.all. Picks the first measured
 * industry in the sector and looks up the same industry in a curated
 * country list. Hides countries that 404.
 */
import Link from "next/link";
import { getCellBySlug } from "@/lib/cells";
import { industryToSlug, type Industry } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";

type Props = {
  sectorName: string;
  industries: Industry[];
};

const COUNTRIES_TO_SAMPLE: { iso2: string; geo: string; name: string }[] = [
  { iso2: "US", geo: "california", name: "California" },
  { iso2: "GB", geo: "gb", name: "United Kingdom" },
  { iso2: "DE", geo: "germany", name: "Germany" },
  { iso2: "FR", geo: "france", name: "France" },
  { iso2: "ES", geo: "madrid", name: "Madrid" },
  { iso2: "IT", geo: "italy", name: "Italy" },
  { iso2: "NL", geo: "netherlands", name: "Netherlands" },
  { iso2: "JP", geo: "japan", name: "Japan" },
  { iso2: "BR", geo: "br-sp", name: "São Paulo" },
  { iso2: "MX", geo: "mx-cmx", name: "Mexico City" },
  { iso2: "AU", geo: "australia", name: "Australia" },
  { iso2: "IN", geo: "india", name: "India" },
];

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export async function SectorAcrossWorld({ sectorName, industries }: Props) {
  if (industries.length === 0) return null;
  const focus = industries[0]; // first measured industry as the anchor
  const focusSlug = industryToSlug(focus.id);

  const results = await Promise.all(
    COUNTRIES_TO_SAMPLE.map(async (c) => {
      try {
        const cell = await getCellBySlug(c.iso2.toLowerCase(), c.geo, focusSlug);
        if (!cell || !cell.revenue_per_firm) return null;
        return {
          ...c,
          revenue: cell.revenue_per_firm,
          year: cell.year,
        };
      } catch {
        return null;
      }
    })
  );

  const live = results.filter(Boolean) as Array<{
    iso2: string;
    geo: string;
    name: string;
    revenue: number;
    year: number | null;
  }>;
  if (live.length === 0) return null;

  live.sort((a, b) => b.revenue - a.revenue);
  const max = live[0].revenue;

  return (
    <section className="py-8">
      <h2 className="text-lg md:text-xl font-semibold text-ink-900 mb-1">
        {focus.name} across the world
      </h2>
      <p className="text-sm text-ink-700/70 mb-4">
        Typical revenue per firm in {sectorName.toLowerCase()} — same industry,
        different country. Sorted by typical revenue.
      </p>
      <div className="space-y-1.5">
        {live.map((c) => {
          const pct = (c.revenue / max) * 100;
          return (
            <Link
              key={c.iso2}
              href={`/${c.iso2.toLowerCase()}/${c.geo}/${focusSlug}`}
              className="grid grid-cols-[140px,1fr,90px] items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream-100 transition"
            >
              <span className="flex items-center gap-2 text-sm text-ink-900">
                <CountryFlag iso2={c.iso2} label={c.name} className="w-5" />
                <span className="truncate">{c.name}</span>
              </span>
              <span className="h-2 bg-cream-100 rounded-full overflow-hidden">
                <span
                  className="block h-full bg-atlas-500"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="text-right text-sm font-medium text-ink-900 tabular-nums">
                {fmtMoney(c.revenue)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
