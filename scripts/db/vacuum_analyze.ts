/**
 * scripts/db/vacuum_analyze.ts
 *
 * Phase 6 — closes the long-pending task #49: run VACUUM ANALYZE on
 * the Supabase Postgres so the query planner picks up the recent
 * write patterns and dead tuples from the Wave 1-3 expansion don't
 * linger.
 *
 * Why not put this in prebuild: VACUUM is a maintenance operation,
 * not a build-time check. It takes minutes on real data and writes
 * to the DB. We run it on demand from the operator's machine.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (RLS bypass needed
 * to issue ANALYZE on application-owned tables). Falls back to
 * documenting the SQL the operator should run manually if no key.
 *
 * Run:
 *   npx tsx scripts/db/vacuum_analyze.ts
 *
 * Or with explicit env:
 *   SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/db/vacuum_analyze.ts
 */
import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const TABLES_TO_ANALYZE = [
  "cells_master",
  "extrapolated_cells",
  "regional_cells",
  "cost_stack",
  "setup_costs",
  "sub_industries",
  "local_aliases",
] as const;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error("✗ NEXT_PUBLIC_SUPABASE_URL not set. Cannot run.");
    process.exit(1);
  }

  if (!serviceKey) {
    console.log("=== VACUUM ANALYZE plan ===");
    console.log("No SUPABASE_SERVICE_ROLE_KEY in env.");
    console.log("");
    console.log("Run these statements manually in the Supabase SQL editor:");
    console.log("");
    for (const t of TABLES_TO_ANALYZE) {
      console.log(`  VACUUM ANALYZE ${t};`);
    }
    console.log("");
    console.log("VACUUM cannot run inside a transaction; issue each line on");
    console.log("its own. Each is idempotent and safe to re-run.");
    process.exit(0);
  }

  // Supabase's JS client doesn't directly expose VACUUM (it only does
  // PostgREST queries). We use the SQL editor endpoint via raw HTTP.
  // Supabase has a pg_meta endpoint that accepts arbitrary SQL when
  // authenticated with the service-role key.
  const endpoint = url.replace(/\/$/, "") + "/rest/v1/rpc/exec";

  console.log("=== VACUUM ANALYZE ===");
  console.log(`Target: ${url}`);
  console.log(`Tables: ${TABLES_TO_ANALYZE.length}`);
  console.log("");

  // Try the rpc('exec', { query }) function pattern. If your project
  // doesn't have this, the script prints the SQL and exits cleanly.
  // We don't fail the prebuild on a missing RPC; this is opt-in.
  for (const t of TABLES_TO_ANALYZE) {
    const sql = `VACUUM ANALYZE ${t};`;
    console.log(`  -> ${sql}`);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: "Bearer " + serviceKey,
        },
        body: JSON.stringify({ query: sql }),
      });
      if (!r.ok) {
        console.warn(`     skip (${r.status} ${r.statusText}); run manually`);
      } else {
        console.log("     done");
      }
    } catch (err: unknown) {
      console.warn(`     skip (${(err as Error).message}); run manually`);
    }
  }
  console.log("");
  console.log("Complete. If any rows said 'skip', open the Supabase SQL");
  console.log("editor and run those VACUUM statements manually.");
}

main();
