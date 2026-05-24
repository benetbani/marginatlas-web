/**
 * scripts/vacuum_supabase.ts — runs VACUUM ANALYZE on the deepening
 * tables via a direct Postgres connection.
 *
 * Required env (add to .env.local):
 *   SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<DB_PASSWORD>@aws-0-<region>.pooler.supabase.com:6543/postgres
 *
 * Find it in Supabase Dashboard → Project Settings → Database →
 * Connection string → "URI" tab → copy the "Session pooler" URL,
 * paste the DB password where it says [YOUR-PASSWORD].
 *
 * (Run from E:\atlas\website)
 *   npx tsx scripts/vacuum_supabase.ts
 *
 * VACUUM cannot run inside a transaction, so this script uses a
 * dedicated pg Client with autoCommit. Safe to re-run any time. The
 * tables stay readable during VACUUM (no exclusive locks).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

const ROOT = process.cwd();

function loadEnvLocal() {
  if (process.env.SUPABASE_DB_URL) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) {
  console.error("\n✗ SUPABASE_DB_URL is not set in .env.local.\n");
  console.error("  Get it from:");
  console.error("    Supabase Dashboard → Project Settings → Database");
  console.error("    → Connection string → URI tab → 'Session pooler'");
  console.error("    Replace [YOUR-PASSWORD] with the actual DB password.\n");
  console.error("  Then re-run: npx tsx scripts/vacuum_supabase.ts\n");
  process.exit(1);
}

const TABLES = ["cells_master", "regional_cells", "extrapolated_cells"];

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  for (const table of TABLES) {
    process.stdout.write(`  VACUUM ANALYZE ${table}...`);
    const start = Date.now();
    try {
      await client.query(`VACUUM ANALYZE ${table};`);
      const ms = Date.now() - start;
      console.log(` ✓ (${ms}ms)`);
    } catch (err) {
      console.log(` ✗`);
      console.error("    error:", (err as Error).message);
    }
  }

  await client.end();
  console.log("\n✓ Done. Query planner now has fresh statistics; dead tuples reclaimed.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
