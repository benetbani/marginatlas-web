/**
 * scripts/vacuum_supabase.ts — runs VACUUM ANALYZE on the atlas
 * Supabase tables via a direct Postgres connection.
 *
 * Required env (add to .env.local):
 *   SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<DB_PASSWORD>@aws-0-<region>.pooler.supabase.com:6543/postgres
 *
 * Find it in Supabase Dashboard → Project Settings → Database →
 * Connection string → "URI" tab → copy the "Session pooler" URL,
 * paste the DB password where it says [YOUR-PASSWORD].
 *
 * (Run from E:\atlas\website)
 *   npx tsx scripts/vacuum_supabase.ts            # full vacuum + analyze
 *   npx tsx scripts/vacuum_supabase.ts --dry-run  # just report table stats
 *   npx tsx scripts/vacuum_supabase.ts --analyze-only  # ANALYZE only (no vacuum)
 *
 * VACUUM cannot run inside a transaction, so this script uses a
 * dedicated pg Client with autoCommit. Safe to re-run any time. The
 * tables stay readable during VACUUM (no exclusive locks; only
 * VACUUM FULL takes an exclusive lock, which this script never uses).
 *
 * 2026-05-26 update: added sub_industries, local_aliases,
 * newsletter_signups (created after the deepening rollout); added
 * pre-/post- row count + dead-tuple reporting; added dry-run mode.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

const ROOT = process.cwd();
const ARGS = new Set(process.argv.slice(2));
const DRY_RUN = ARGS.has("--dry-run");
const ANALYZE_ONLY = ARGS.has("--analyze-only");

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

// All tables the website reads/writes at render time. Order roughly
// matches "biggest read traffic first" so the planner stats refresh
// where it matters most.
const TABLES = [
  // Cell-page surface — heaviest read by far.
  "cells_master",
  "regional_cells",
  "extrapolated_cells",
  // Industry-deepening framework (post-rollout 2026-05-24).
  "sub_industries",
  "local_aliases",
  // Newsletter capture (low volume, but indexed by email).
  "newsletter_signups",
];

type TableStats = {
  table: string;
  liveTuples: number;
  deadTuples: number;
  totalRelationSize: string; // human formatted (e.g. "120 MB")
  lastVacuum: string | null;
  lastAutovacuum: string | null;
  lastAnalyze: string | null;
};

async function fetchStats(client: Client, table: string): Promise<TableStats | null> {
  const r = await client.query(
    `
    SELECT
      relname AS table,
      n_live_tup AS live,
      n_dead_tup AS dead,
      pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
      last_vacuum,
      last_autovacuum,
      last_analyze
    FROM pg_stat_user_tables
    WHERE relname = $1
    `,
    [table],
  );
  if (r.rowCount === 0) return null;
  const row = r.rows[0];
  return {
    table: row.table,
    liveTuples: Number(row.live ?? 0),
    deadTuples: Number(row.dead ?? 0),
    totalRelationSize: row.total_size ?? "?",
    lastVacuum: row.last_vacuum ? new Date(row.last_vacuum).toISOString() : null,
    lastAutovacuum: row.last_autovacuum ? new Date(row.last_autovacuum).toISOString() : null,
    lastAnalyze: row.last_analyze ? new Date(row.last_analyze).toISOString() : null,
  };
}

function fmtStats(s: TableStats): string {
  const deadPct = s.liveTuples > 0 ? ((s.deadTuples / s.liveTuples) * 100).toFixed(1) : "0.0";
  return (
    `${s.table.padEnd(22)} ` +
    `live=${String(s.liveTuples).padStart(8)} ` +
    `dead=${String(s.deadTuples).padStart(7)} (${deadPct}%) ` +
    `size=${s.totalRelationSize.padStart(8)}`
  );
}

async function main() {
  console.log(
    DRY_RUN
      ? "Mode: DRY RUN (report stats only, no VACUUM)"
      : ANALYZE_ONLY
        ? "Mode: ANALYZE only (refresh planner stats, no VACUUM)"
        : "Mode: VACUUM ANALYZE (reclaim dead tuples + refresh stats)",
  );

  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log("Connected to Supabase Postgres.\n");

  // Pre-run snapshot.
  console.log("Before:");
  const pre: Record<string, TableStats | null> = {};
  for (const table of TABLES) {
    const stats = await fetchStats(client, table);
    pre[table] = stats;
    if (stats) {
      console.log("  " + fmtStats(stats));
    } else {
      console.log(`  ${table.padEnd(22)} (table not found)`);
    }
  }

  if (DRY_RUN) {
    console.log("\nDry run: skipping VACUUM/ANALYZE.");
    await client.end();
    return;
  }

  // Run the operation.
  console.log("");
  for (const table of TABLES) {
    if (!pre[table]) continue;
    const op = ANALYZE_ONLY ? `ANALYZE ${table}` : `VACUUM ANALYZE ${table}`;
    process.stdout.write(`  ${op}...`);
    const start = Date.now();
    try {
      await client.query(`${op};`);
      const ms = Date.now() - start;
      console.log(` ✓ (${ms}ms)`);
    } catch (err) {
      console.log(` ✗`);
      console.error("    error:", (err as Error).message);
    }
  }

  // Post-run snapshot.
  console.log("\nAfter:");
  for (const table of TABLES) {
    const stats = await fetchStats(client, table);
    if (stats) {
      const before = pre[table];
      const reclaimed = before ? before.deadTuples - stats.deadTuples : 0;
      const tag = reclaimed > 0 ? `(reclaimed ${reclaimed})` : "";
      console.log("  " + fmtStats(stats) + " " + tag);
    }
  }

  await client.end();
  console.log("\n✓ Done. Query planner has fresh statistics; dead tuples reclaimed.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
