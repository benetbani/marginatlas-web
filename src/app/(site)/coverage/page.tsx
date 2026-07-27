/**
 * /coverage: the coverage hub.
 *
 * Was a 308-redirect to /world. Now a distinct depth-first view: every covered
 * country grouped into four tiers (deep / good / starter / modeled) by how much
 * sub-national measurement it carries, rendered by the v2 CoverageHubV2
 * component on real data from data/quality/coverage_v2.json. /world stays as the
 * map/grid entry point; this page answers "how deep do the numbers go".
 *
 * Server component. Reads the pre-computed coverage report at build/ISR time.
 */
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import CoverageHubV2 from "@/components/v2/CoverageHubV2";
import { COUNTRIES } from "@/lib/taxonomy";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Coverage: where Margin Atlas reaches",
  description:
    "Every country Margin Atlas covers, grouped by how deep the numbers go, from neighborhood-level measurement to modeled estimates.",
  alternates: { canonical: "/coverage" },
};

type Tier = "deep" | "good" | "starter" | "modeled";

type ReportCountry = {
  iso2: string;
  regional_cells: number;
  extrapolated_cells: number;
};

type CoverageReport = {
  generated_at: string;
  countries: ReportCountry[];
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

// Tier by sub-national measurement depth, matching the component's semantics:
// deep = neighborhood/city depth, good = regional, starter = some real cells,
// modeled = country-level extrapolation only.
function tierFor(c: ReportCountry): Tier {
  if (c.regional_cells >= 3000) return "deep";
  if (c.regional_cells >= 300) return "good";
  if (c.regional_cells >= 1) return "starter";
  return "modeled";
}

const NAME_BY_ISO2 = new Map(COUNTRIES.map((c) => [c.code, c.name]));

export default function CoveragePage() {
  const report = loadReport();
  const refreshed = report ? report.generated_at.slice(0, 10) : "";
  const countries = (report?.countries ?? [])
    .map((c) => ({
      iso2: c.iso2,
      name: NAME_BY_ISO2.get(c.iso2.toUpperCase()) || c.iso2,
      tier: tierFor(c),
      cellCount: c.regional_cells + c.extrapolated_cells,
      lastRefreshed: refreshed,
    }))
    .filter((c) => c.cellCount > 0);

  return <CoverageHubV2 countries={countries} />;
}
