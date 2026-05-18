/**
 * CellWarningChips (AA.6 + AA.9) — inline warning chips on a cell page.
 *
 * Surfaces two anomaly signals without making the page feel alarmist:
 *   AA.6 staleness — cells with year < 2018 get a warning chip
 *   AA.9 industry-mapping — when the URL slug resolved to a different
 *        industry than the user typed, render a quiet "showing X instead"
 *        chip with the canonical URL.
 */
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";

type Props = {
  year: number | null;
  requestedIndustrySlug?: string;
  resolvedIndustryName?: string;
  resolvedIndustryUrl?: string;
  // Plan v10 WW — cross-country plausibility lookup
  country?: string;
  geoId?: string | null;
  industryId?: string | null;
  sizeBand?: string | null;
};

type PlausibilityReport = {
  samples: Array<{
    check: string;
    country?: string;
    geo_id?: string | null;
    industry_id?: string | null;
    size_band?: string | null;
    z_score?: number;
    expected_revenue?: number;
    revenue_per_firm?: number;
    revenue_ratio?: number;
    poorer_country?: string;
    poorer_revenue?: number;
    richer_country?: string;
    richer_revenue?: number;
  }>;
};

let plausibilityCache: PlausibilityReport | null = null;
function loadPlausibility(): PlausibilityReport | null {
  if (plausibilityCache) return plausibilityCache;
  const candidates = [
    path.resolve(process.cwd(), "data/quality/plausibility_scan_v1.json"),
    path.resolve(process.cwd(), "delivery/quality/plausibility_scan_v1.json"),
  ];
  for (const p of candidates) {
    try {
      plausibilityCache = JSON.parse(fs.readFileSync(p, "utf-8")) as PlausibilityReport;
      return plausibilityCache;
    } catch {
      continue;
    }
  }
  return null;
}

export function CellWarningChips({
  year,
  requestedIndustrySlug,
  resolvedIndustryName,
  resolvedIndustryUrl,
  country,
  geoId,
  industryId,
  sizeBand,
}: Props) {
  const chips: React.ReactNode[] = [];

  // Plan v10 WW — cross-country plausibility chip
  if (country && industryId) {
    const report = loadPlausibility();
    if (report) {
      const upperCountry = country.toUpperCase();
      const match = report.samples.find(
        (s) =>
          s.industry_id === industryId &&
          ((s.check === "gdp_correlation" && s.country === upperCountry) ||
            (s.check === "poorer_richer_inversion" &&
              (s.poorer_country === upperCountry || s.richer_country === upperCountry)))
      );
      if (match) {
        const detail =
          match.check === "gdp_correlation" && match.z_score
            ? `revenue ${Math.abs(match.z_score).toFixed(1)}σ from expected for this GDP level`
            : match.check === "poorer_richer_inversion" && match.revenue_ratio
            ? `revenue ${match.revenue_ratio.toFixed(1)}× a richer-country peer`
            : "flagged by cross-country check";
        chips.push(
          <span
            key="cross-country"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clay-100 border border-clay-300 text-xs font-medium text-clay-900"
          >
            <span aria-hidden>⚠</span>
            Cross-country check: {detail}
          </span>
        );
      }
    }
  }

  // AA.6 — staleness
  if (year != null) {
    if (year < 2015) {
      chips.push(
        <span
          key="hide-stale"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clay-100 border border-clay-300 text-xs font-medium text-clay-900"
        >
          <span aria-hidden>⚠</span>
          Data from {year} — refresh pending
        </span>
      );
    } else if (year < 2018) {
      chips.push(
        <span
          key="warn-stale"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-200 border border-parchment text-xs font-medium text-ink-900"
        >
          <span aria-hidden>🕰</span>
          {year} data — newer benchmarks available for some neighbors
        </span>
      );
    }
  }

  // AA.9 — industry-mapping warning
  if (
    requestedIndustrySlug &&
    resolvedIndustryName &&
    resolvedIndustryUrl &&
    !requestedIndustrySlug
      .toLowerCase()
      .includes(resolvedIndustryName.toLowerCase().slice(0, 6))
  ) {
    chips.push(
      <span
        key="mapping"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-atlas-100 border border-atlas-300 text-xs font-medium text-atlas-900"
      >
        <span aria-hidden>↪</span>
        Showing {resolvedIndustryName} —{" "}
        <Link href={resolvedIndustryUrl} className="underline hover:text-atlas-700">
          canonical URL
        </Link>
      </span>
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">{chips}</div>
  );
}
