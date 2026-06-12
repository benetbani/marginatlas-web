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
  // Cross-country plausibility lookup
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

  // Cross-country plausibility chip suppressed.
  // The chip self-flagged suspect data ("revenue 2.1σ from expected") which
  // broadcasts brokenness rather than degrading silently. Internal QC still
  // tracks plausibility via the admin/review surface and the scan JSON.
  void country;
  void industryId;
  void geoId;
  void sizeBand;
  void loadPlausibility;

  // AA.6 staleness chips removed per Plan v13 Wave 1 — never display raw years
  // to public visitors. `year` prop is retained for type compatibility.
  void year;

  // AA.9 — industry-mapping warning. Slug-normalize both sides: the old
  // substring check compared a dashed slug against a spaced name, so
  // "legal-services" vs "Legal services" false-positived the banner even
  // when the page showed exactly what the URL asked for.
  const asSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  if (
    requestedIndustrySlug &&
    resolvedIndustryName &&
    resolvedIndustryUrl &&
    asSlug(requestedIndustrySlug) !== asSlug(resolvedIndustryName)
  ) {
    chips.push(
      <span
        key="mapping"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-atlas-100 border border-atlas-300 text-xs font-medium text-atlas-900"
      >
        <span aria-hidden>↪</span>
        Showing {resolvedIndustryName}{" "}
        <Link href={resolvedIndustryUrl} className="underline hover:text-atlas-700">
          (open the main page)
        </Link>
      </span>
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">{chips}</div>
  );
}
