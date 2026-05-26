/**
 * scripts/db/backfill_plausibility_flags.ts
 *
 * Backend Phase 4 — backfill the plausibility_flags column on
 * extrapolated_cells from the existing data. Pure analysis: uses
 * the same analyzePlausibility() function the render layer uses,
 * so the DB column and the render decisions are identical.
 *
 * Migration prerequisite: run
 *   db/migrations/2026-05-26-plausibility-flags-column.sql
 * to add the column.
 *
 * Behaviour:
 *   1. Stream extrapolated_cells in batches of 500.
 *   2. For each row, build a Cell-compatible shape, run
 *      analyzePlausibility(), and UPDATE the plausibility_flags
 *      column.
 *   3. Honor 600MB RAM cap (R-024): single batch in memory at a time.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (DB writes). Without it the
 * script enters DRY-RUN mode and prints a summary of how many cells
 * WOULD be flagged.
 *
 * Run:
 *   npx tsx scripts/db/backfill_plausibility_flags.ts
 *   npx tsx scripts/db/backfill_plausibility_flags.ts --dry-run
 */
import { config } from "dotenv";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { analyzePlausibility } from "../../src/lib/qa/plausibility_suppression";
import type { Cell } from "../../src/lib/cells";

config({ path: path.resolve(process.cwd(), ".env.local") });

const BATCH = 500;
const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    console.error("  Backfill needs RLS-bypass to write the column.");
    process.exit(1);
  }
  const client = createClient(url, serviceKey, { auth: { persistSession: false } });

  console.log("=== Backfill plausibility_flags ===");
  console.log("Target table: extrapolated_cells");
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE (will UPDATE)"}`);
  console.log("");

  let offset = 0;
  let totalSeen = 0;
  let totalFlagged = 0;
  const reasonCounts: Record<string, number> = {};

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await client
      .from("extrapolated_cells")
      .select(
        "id, industry_id, n_enterprises, n_employees, total_revenue, total_revenue_usd, revenue_per_firm, rev_p10, rev_p25, rev_p50, rev_p75, rev_p90, payroll_per_employee"
      )
      .range(offset, offset + BATCH - 1);
    if (error) {
      console.error("✗ Query failed:", error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    totalSeen += data.length;

    for (const row of data) {
      const cell = row as unknown as Cell;
      const flags = analyzePlausibility(cell);
      if (flags.status === "ok") continue;
      totalFlagged++;
      for (const reason of Object.values(flags.fields)) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }
      if (!DRY_RUN) {
        const { error: updateErr } = await client
          .from("extrapolated_cells")
          .update({ plausibility_flags: flags })
          .eq("id", (row as { id: unknown }).id);
        if (updateErr) {
          console.error(`  ! UPDATE failed for id=${(row as { id: unknown }).id}:`, updateErr.message);
        }
      }
    }
    process.stdout.write(`  ${totalSeen} rows scanned, ${totalFlagged} flagged so far\r`);

    if (data.length < BATCH) break;
    offset += BATCH;
  }

  console.log("");
  console.log("");
  console.log("=== Summary ===");
  console.log(`Total rows scanned: ${totalSeen}`);
  console.log(`Total flagged: ${totalFlagged}`);
  console.log("");
  console.log("By reason code:");
  for (const [reason, count] of Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${reason.padEnd(40)} ${count}`);
  }
  if (DRY_RUN) {
    console.log("\nDRY-RUN. Re-run without --dry-run to actually write the column.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
