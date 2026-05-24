/**
 * sync_sub_industries.ts — push the in-code seed to the DB.
 *
 * Reads SUB_INDUSTRIES_SEED from src/lib/taxonomy/sub_industries_seed.ts
 * and UPSERTs each row into the sub_industries table.
 *
 * Idempotent: re-running picks up new variants and updates name /
 * description / data_ready on existing rows. Does NOT delete rows
 * that were removed from the seed (manual DB cleanup if a variant
 * gets pulled — rare, requires founder confirmation anyway).
 *
 * Run: `npx tsx scripts/sync_sub_industries.ts`
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. Reads it directly,
 * does not require a running Next server.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SUB_INDUSTRIES_SEED } from "../src/lib/taxonomy/sub_industries_seed";

const ROOT = process.cwd();

function loadEnvLocal() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }
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
  } catch (err) {
    console.error("Could not read .env.local:", err);
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`Syncing ${SUB_INDUSTRIES_SEED.length} sub-industries to Supabase...`);

  const rows = SUB_INDUSTRIES_SEED.map((v) => ({
    id: v.id,
    parent_industry_id: v.parent_industry_id,
    name: v.name,
    description: v.description ?? null,
    data_ready: v.data_ready,
    prevalent_in: v.prevalent_in ?? null,
  }));

  // Upsert in one batch. Supabase / PostgREST handles up to ~1000 rows
  // per call comfortably; we have 33.
  const { data, error, count } = await supabase
    .from("sub_industries")
    .upsert(rows, { onConflict: "id", count: "exact" })
    .select("id");

  if (error) {
    console.error("\n✗ Upsert failed:", error.message);
    console.error("Details:", error);
    process.exit(1);
  }

  console.log(`✓ Synced ${data?.length ?? count ?? rows.length} sub-industries.`);

  // Show the ready-vs-unready split.
  const ready = SUB_INDUSTRIES_SEED.filter((v) => v.data_ready).length;
  console.log(
    `  ${ready} ready to render, ${SUB_INDUSTRIES_SEED.length - ready} pending Phase 1 data.`,
  );

  if (ready === 0) {
    console.log(
      "\n  Hint: Phase 1 work flips data_ready to true one variant at a time",
    );
    console.log("  as real primary-source data lands. Update");
    console.log("  src/lib/taxonomy/sub_industries_seed.ts and re-run this");
    console.log("  script to push the change.");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
