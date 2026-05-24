/**
 * Shared loader for the coverage_v2.json snapshot produced by the
 * quality pipeline. Module-cached so the JSON parse happens once per
 * Node process. Server-only.
 */

import fs from "node:fs";
import path from "node:path";

export type CoverageReport = {
  generated_at?: string;
  totals?: {
    countries?: number;
    regional_cells_total?: number;
    extrapolated_cells_total?: number;
    industries_covered?: number;
  };
  countries: CoverageCountry[];
};

export type CoverageCountry = {
  iso2: string;
  regional_cells: number;
  extrapolated_cells: number;
  industries: number;
  geographies?: number;
  tiers?: Record<string, number>;
  avg_quality?: number;
  avg_quality_10?: number;
  year_range?: [number | null, number | null];
};

function load(): CoverageReport | null {
  const candidates = [
    path.resolve(process.cwd(), "data/quality/coverage_v2.json"),
    path.resolve(process.cwd(), "delivery/quality/coverage_v2.json"),
  ];
  for (const p of candidates) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      return JSON.parse(raw) as CoverageReport;
    } catch {
      continue;
    }
  }
  return null;
}

const REPORT: CoverageReport | null = load();

export function getCoverageReport(): CoverageReport | null {
  return REPORT;
}

export function getCountryCoverage(iso2: string): CoverageCountry | null {
  if (!REPORT) return null;
  const code = iso2.toUpperCase();
  return REPORT.countries.find((c) => c.iso2 === code) ?? null;
}
