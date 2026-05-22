/**
 * Plan v26 P0 — apply Supabase indexes via direct Postgres connection.
 *
 * Bypasses the Supabase API gateway 60-second timeout that's killing
 * multi-index migrations. Connects directly to Postgres and runs each
 * CREATE INDEX one-at-a-time, reporting progress.
 *
 * Setup (one-time, ~30 seconds):
 *
 *   1. Open Supabase dashboard → Project → Project Settings → Database
 *      → Connection string → URI tab. Copy the connection string.
 *      Looks like: postgresql://postgres:<password>@db.xxxx.supabase.co:5432/postgres
 *
 *   2. Open `.env.local` in this repo and add:
 *      DATABASE_URL=postgresql://postgres:...
 *
 *   3. Run: `npx tsx scripts/ops/apply_indexes.ts`
 *
 * The script will:
 *   - List the 10 indexes
 *   - For each: print "creating...", run CREATE INDEX, print "done in Xs"
 *   - On error: report the specific index that failed and continue
 *
 * Honors the 600 MB RAM cap — pg connections use kilobytes.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });
import { Client } from "pg";

export {}; // module marker

const INDEXES: Array<{ name: string; sql: string }> = [
  {
    name: "idx_regional_cells_quality_score",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_quality_score ON regional_cells (quality_score DESC NULLS LAST)",
  },
  {
    name: "idx_regional_cells_n_enterprises",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_n_enterprises ON regional_cells (n_enterprises DESC NULLS LAST)",
  },
  {
    name: "idx_regional_cells_country_industry",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_country_industry ON regional_cells (country, industry_id)",
  },
  {
    name: "idx_regional_cells_year_country",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_year_country ON regional_cells (year DESC, country)",
  },
  {
    name: "idx_regional_cells_geo_id",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_geo_id ON regional_cells (geo_id)",
  },
  {
    name: "idx_regional_cells_lookup",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_lookup ON regional_cells (country, geo_id, industry_id, year DESC)",
  },
  {
    name: "idx_cells_master_n",
    sql: "CREATE INDEX IF NOT EXISTS idx_cells_master_n ON cells_master (n DESC NULLS LAST)",
  },
  {
    name: "idx_cells_master_total_employment",
    sql: "CREATE INDEX IF NOT EXISTS idx_cells_master_total_employment ON cells_master (total_employment DESC NULLS LAST)",
  },
  {
    name: "idx_cells_master_lookup",
    sql: "CREATE INDEX IF NOT EXISTS idx_cells_master_lookup ON cells_master (country, geo_id, naics_6, year DESC)",
  },
  {
    name: "idx_cells_master_quality",
    sql: "CREATE INDEX IF NOT EXISTS idx_cells_master_quality ON cells_master (quality_score DESC NULLS LAST)",
  },
  // Suppression flag columns + their indexes (Migration 3)
  {
    name: "regional_cells.is_suppressed column",
    sql: "ALTER TABLE regional_cells ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE, ADD COLUMN IF NOT EXISTS suppress_reason TEXT",
  },
  {
    name: "cells_master.is_suppressed column",
    sql: "ALTER TABLE cells_master ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE, ADD COLUMN IF NOT EXISTS suppress_reason TEXT",
  },
  {
    name: "extrapolated_cells.is_suppressed column",
    sql: "ALTER TABLE extrapolated_cells ADD COLUMN IF NOT EXISTS is_suppressed BOOLEAN DEFAULT FALSE, ADD COLUMN IF NOT EXISTS suppress_reason TEXT",
  },
  {
    name: "idx_regional_cells_suppressed",
    sql: "CREATE INDEX IF NOT EXISTS idx_regional_cells_suppressed ON regional_cells (country, geo_id, industry_id) WHERE is_suppressed = TRUE",
  },
  {
    name: "idx_cells_master_suppressed",
    sql: "CREATE INDEX IF NOT EXISTS idx_cells_master_suppressed ON cells_master (country, geo_id, naics_6) WHERE is_suppressed = TRUE",
  },
  {
    name: "idx_extrapolated_cells_suppressed",
    sql: "CREATE INDEX IF NOT EXISTS idx_extrapolated_cells_suppressed ON extrapolated_cells (country_iso3, industry_id) WHERE is_suppressed = TRUE",
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "Missing DATABASE_URL in .env.local. Get the connection string from\n" +
        "  Supabase dashboard -> Project Settings -> Database -> Connection string -> URI tab\n" +
        "then add to .env.local as:\n" +
        "  DATABASE_URL=postgresql://postgres:<password>@db.xxxxx.supabase.co:5432/postgres\n",
    );
    process.exit(1);
  }
  const client = new Client({
    connectionString: url,
    statement_timeout: 600_000, // 10 minutes per statement
  });
  console.log("Connecting to Postgres...");
  await client.connect();
  console.log("Connected.\n");

  let succeeded = 0;
  let failed = 0;
  let skipped = 0;
  for (let i = 0; i < INDEXES.length; i++) {
    const idx = INDEXES[i];
    const label = `[${(i + 1).toString().padStart(2)}/${INDEXES.length}] ${idx.name}`;
    process.stdout.write(`${label}... `);
    const start = Date.now();
    try {
      await client.query(idx.sql);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`done in ${elapsed}s`);
      succeeded++;
    } catch (e) {
      const err = (e as Error).message;
      if (/already exists/i.test(err)) {
        console.log("already exists (skipped)");
        skipped++;
      } else {
        console.log(`FAILED: ${err}`);
        failed++;
      }
    }
  }

  await client.end();

  console.log("\n=== Summary ===");
  console.log(`  Succeeded: ${succeeded}`);
  console.log(`  Skipped (already existed): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
