/**
 * Regional coverage gating.
 */
import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(
  process.cwd(), "data", "coverage", "regional_coverage_v1.json"
);

let MANIFEST: Record<string, boolean> = {};
try {
  MANIFEST = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
} catch {
  MANIFEST = {};
}

export function hasRegionalCoverage(iso2: string): boolean {
  return Boolean(MANIFEST[iso2.toUpperCase()]);
}
