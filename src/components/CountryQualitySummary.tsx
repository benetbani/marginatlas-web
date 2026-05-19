/**
 * CountryQualitySummary — Track FF.2.
 *
 * Reads the coverage_v2.json snapshot for this country and renders a
 * 3-stat preview: cell count, average quality dots, year range. Links
 * out to the full /coverage/[iso2] scorecard.
 *
 * Server component; no fetches. Renders nothing if the country isn't in
 * the audit snapshot.
 */
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type CoverageReport = {
  countries: Array<{
    iso2: string;
    regional_cells: number;
    extrapolated_cells: number;
    industries: number;
    avg_quality_10: number;
    year_range: [number | null, number | null];
  }>;
};

function loadReport(): CoverageReport | null {
  const candidates = [
    path.resolve(process.cwd(), "data/quality/coverage_v2.json"),
    path.resolve(process.cwd(), "delivery/quality/coverage_v2.json"),
  ];
  for (const p of candidates) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8")) as CoverageReport;
    } catch {
      continue;
    }
  }
  return null;
}

const REPORT = loadReport();

export function CountryQualitySummary({ iso2 }: { iso2: string }) {
  if (!REPORT) return null;
  const entry = REPORT.countries.find((c) => c.iso2 === iso2.toUpperCase());
  if (!entry) return null;
  const totalCells = entry.regional_cells + entry.extrapolated_cells;
  if (totalCells === 0) return null;

  return (
    <section className="py-6">
      <div className="rounded-xl border border-ink-200 bg-cream-50 p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div>
            <div className="text-2xl font-semibold text-ink-900 tabular-nums">
              {entry.industries}
            </div>
            <div className="text-xs text-ink-700/70">industries covered</div>
          </div>
        </div>
        <Link
          href={`/coverage/${iso2.toLowerCase()}`}
          className="text-sm text-atlas-700 hover:text-atlas-900 font-medium whitespace-nowrap"
        >
          Full scorecard →
        </Link>
      </div>
    </section>
  );
}
