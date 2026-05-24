/**
 * CountryAtAGlance — dense 5-stat row that sits directly under the
 * country page hero. Replaces the old AtlasHeroImage photo, which the
 * founder removed in v32: the first frame must carry information, not
 * decorate it. Every stat here is computed from data already loaded by
 * the parent page (no extra DB calls).
 */

import Link from "next/link";
import type { TopIndustryRow } from "@/lib/cells";
import { SECTOR_BY_ID, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { getCitiesForCountry } from "@/lib/cities";
import { getCountryTaxRates } from "@/lib/tax";
import { getCountryCoverage } from "@/lib/quality/coverage-report";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { fmtMoney } from "@/lib/format/money";

type Props = {
  iso2: string;
  topIndustries: TopIndustryRow[];
};

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

export function CountryAtAGlance({ iso2, topIndustries }: Props) {
  const code = iso2.toUpperCase();
  const coverage = getCountryCoverage(code);
  const cities = getCitiesForCountry(code);
  const regions = getAdmin1Regions(code);
  const rates = getCountryTaxRates(code);

  const industriesCovered = coverage?.industries ?? topIndustries.length;
  const revenues = topIndustries
    .map((i) => i.revenue_per_firm)
    .filter((r): r is number => r != null && r > 0);
  const medianRev = median(revenues);

  const topInd = topIndustries[0];
  const topSector = topInd
    ? SECTOR_BY_ID[INDUSTRY_BY_ID[topInd.industry_id]?.sector_id ?? ""] ?? null
    : null;

  const ownerTakePct = 1 - rates.cit;

  const tiles: Array<{ label: string; value: string; sub?: string }> = [
    {
      label: "Industries covered",
      value: String(industriesCovered),
      sub: industriesCovered === 1 ? "small-business benchmark" : "small-business benchmarks",
    },
    {
      label: "Cities ranked",
      value: String(cities.length),
      sub: regions.length > 0 ? `${regions.length} region${regions.length === 1 ? "" : "s"}` : undefined,
    },
    {
      label: "Median typical revenue",
      value: medianRev != null ? fmtMoney(medianRev) : "n/a",
      sub: "across top industries",
    },
    {
      label: "Top SMB sector",
      value: topSector?.name ?? topInd?.industry_name ?? "Varied",
      sub: topInd?.industry_name ?? undefined,
    },
    {
      label: "Owner take after CIT",
      value: `${(ownerTakePct * 100).toFixed(0)}%`,
      sub: `${(rates.cit * 100).toFixed(1)}% corporate income tax`,
    },
  ];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="bg-white border border-ink-200 rounded-xl px-4 py-3"
          >
            <div className="text-[10px] uppercase tracking-wide text-ink-700/70 font-medium">
              {t.label}
            </div>
            <div className="mt-1 text-xl md:text-2xl font-semibold text-ink-900 tabular-nums leading-tight truncate">
              {t.value}
            </div>
            {t.sub && (
              <div className="mt-0.5 text-[11px] text-ink-700/70 truncate">
                {t.sub}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-ink-700/60">
          Snapshot of the whole country page. Scroll for the full picture.
        </span>
        <Link
          href={`/coverage/${code.toLowerCase()}`}
          className="text-atlas-700 hover:text-atlas-900 font-medium whitespace-nowrap"
        >
          Full scorecard →
        </Link>
      </div>
    </section>
  );
}
