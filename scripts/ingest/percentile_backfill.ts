/**
 * Plan v26 P1/P5 — backfill rev_p10/p25/p75/p90 nulls.
 *
 * The audit found 100% null on percentile columns in regional_cells
 * and 14% null in cells_master. The application synthesizes these at
 * render time via fillMissingFields() in src/lib/cells/fill_defaults.ts,
 * but persisting them to the DB avoids the synthesis hop on every
 * request.
 *
 * Strategy: for each row with non-null revenue_per_firm (or rev_p50)
 * but null percentile columns, write synthesized values using the
 * same log-normal multipliers as the render layer:
 *   p10 = p50 × 0.25
 *   p25 = p50 × 0.55
 *   p75 = p50 × 1.85
 *   p90 = p50 × 3.40
 *
 * Honors the 600 MB RAM cap (D-055) — streams in 500-row pages.
 *
 * Run: `npx tsx scripts/ingest/percentile_backfill.ts`
 *   or `npx tsx scripts/ingest/percentile_backfill.ts --table regional_cells --dry-run`
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

export {}; // module marker

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PCT_MULT = { p10: 0.25, p25: 0.55, p50: 1.0, p75: 1.85, p90: 3.4 };

const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}

const TABLE = arg("--table", "regional_cells") as
  | "regional_cells"
  | "cells_master";
const DRY_RUN = args.includes("--dry-run");
const PAGE_SIZE = parseInt(arg("--page-size", "500"), 10);

async function main() {
  console.log(`Backfilling ${TABLE} percentile nulls (page size ${PAGE_SIZE}, dry-run=${DRY_RUN})\n`);

  const rev50Col = TABLE === "regional_cells" ? "rev_p50" : "rev_p50";
  const idCols = TABLE === "regional_cells" ? ["country", "geo_id", "industry_id"] : ["country", "geo_id", "naics_6", "year", "size_band"];

  let totalUpdated = 0;
  let totalSkipped = 0;
  let offset = 0;

  while (true) {
    const { data, error } = await sb
      .from(TABLE)
      .select(`${idCols.join(",")}, ${rev50Col}, rev_p10, rev_p25, rev_p75, rev_p90`)
      .is("rev_p10", null) // only fetch rows that need backfill
      .not(rev50Col, "is", null)
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error(`Query error at offset ${offset}: ${error.message}`);
      break;
    }
    if (!data || data.length === 0) break;

    for (const row of data as unknown as Array<Record<string, unknown>>) {
      const r = row;
      const p50 = r[rev50Col] as number | null;
      if (!p50 || p50 <= 0) {
        totalSkipped++;
        continue;
      }
      const updates = {
        rev_p10: p50 * PCT_MULT.p10,
        rev_p25: p50 * PCT_MULT.p25,
        rev_p75: p50 * PCT_MULT.p75,
        rev_p90: p50 * PCT_MULT.p90,
      };
      if (DRY_RUN) {
        totalUpdated++;
        continue;
      }
      let q = sb.from(TABLE).update(updates);
      for (const col of idCols) {
        const v = r[col];
        if (v == null) continue;
        q = q.eq(col, v as string | number);
      }
      const { error: updErr } = await q;
      if (updErr) {
        console.error(`  update error: ${updErr.message}`);
        totalSkipped++;
      } else {
        totalUpdated++;
      }
    }

    console.log(
      `  offset ${offset}: scanned ${data.length}, updated ${totalUpdated}, skipped ${totalSkipped}`,
    );
    offset += data.length;
    if (data.length < PAGE_SIZE) break;
  }

  console.log(`\nDone. ${totalUpdated} rows updated, ${totalSkipped} skipped.`);
  if (DRY_RUN) console.log("(DRY RUN — no writes made.)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
