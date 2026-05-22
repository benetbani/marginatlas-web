/**
 * Plan v24 Block 2.3.c — prebuild guard for featured tile resolution.
 *
 * Reads data/snapshots/featured-tiles.json. Fails if any tile has a
 * null revenue_per_firm. The build fails on Vercel, preventing a
 * half-empty featured grid from shipping to production.
 *
 * Run: `npx tsx scripts/verify_featured_tiles.ts`
 *
 * If this fires: re-run `scripts/snapshots/build_homepage_snapshots.ts`
 * to regenerate the snapshot, then re-check. If still failing, the
 * FEATURED tuples in src/app/page.tsx need adjustment (replace the
 * unresolved tuples or drop the count to maintain symmetry).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SNAPSHOT_PATH = resolve(process.cwd(), "data", "snapshots", "featured-tiles.json");

if (!existsSync(SNAPSHOT_PATH)) {
  console.error(
    "✗ Snapshot missing. Run scripts/snapshots/build_homepage_snapshots.ts first.",
  );
  process.exit(1);
}

const data = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8")) as {
  cells: Array<{ iso2: string; geo: string; industry_id: string; revenue_per_firm: number | null }>;
};

const cells = data.cells || [];
const unresolved = cells.filter((c) => c.revenue_per_firm == null);

if (unresolved.length > 0) {
  console.error(`✗ ${unresolved.length} featured tile(s) have no revenue:`);
  for (const c of unresolved) {
    console.error(`    ${c.iso2}/${c.geo}/${c.industry_id}`);
  }
  console.error(
    "\n  Fix by: (1) replacing the FEATURED tuples in src/app/page.tsx OR",
  );
  console.error(
    "  (2) updating scripts/snapshots/build_homepage_snapshots.ts FEATURED array",
  );
  console.error("  to mirror the page, then re-running the snapshot builder.");
  process.exit(1);
}

console.log(`✓ All ${cells.length} featured tiles resolve.`);
