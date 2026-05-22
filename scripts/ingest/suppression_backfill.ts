/**
 * Plan v26 P4 follow-up — migrate suppression from JSON file to DB flag.
 *
 * After running Migration 3 (docs/superpowers/specs/2026-05-22-supabase-migrations.md)
 * which adds an `is_suppressed BOOLEAN` column to regional_cells /
 * cells_master / extrapolated_cells, this script reads
 * data/quality/cell_triage_slim_v1.json and sets the flag on each
 * matching row.
 *
 * Once this runs, triage.ts (and the bundled JSON) can be deleted
 * entirely. Suppression becomes a `.eq('is_suppressed', FALSE)`
 * filter in every query.
 *
 * Run: `npx tsx scripts/ingest/suppression_backfill.ts`
 *
 * Requires:
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - Migration 3 already applied
 *
 * Honors the 600 MB RAM cap (D-055) — processes one entry at a time.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

export {}; // module marker

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type SlimEntry = {
  country: string;
  geo_id: string;
  industry_id: string;
  decision: "suppress" | "override";
};

async function main() {
  const raw = readFileSync(
    resolve(process.cwd(), "data/quality/cell_triage_slim_v1.json"),
    "utf-8",
  );
  const data = JSON.parse(raw) as { entries: SlimEntry[] };
  console.log(`Loaded ${data.entries.length} suppression entries.`);

  // First, check that the is_suppressed column exists.
  const { error: checkErr } = await sb
    .from("regional_cells")
    .select("is_suppressed")
    .limit(1);
  if (checkErr) {
    console.error(
      `regional_cells.is_suppressed not found. Run Migration 3 first:\n` +
        `  docs/superpowers/specs/2026-05-22-supabase-migrations.md\n`,
    );
    console.error(`Supabase error: ${checkErr.message}`);
    process.exit(1);
  }

  // Group entries by (country, geo_id, industry_id) and apply to the
  // appropriate table. The triage data was generated from a mix of
  // regional_cells and extrapolated_cells. We try regional first;
  // anything that doesn't match falls through to extrapolated.
  let updated = 0;
  let skipped = 0;
  for (const e of data.entries) {
    if (e.decision !== "suppress") continue;

    // Try regional_cells first
    let { count: regCount } = await sb
      .from("regional_cells")
      .select("*", { count: "exact", head: true })
      .eq("country", e.country)
      .eq("geo_id", e.geo_id)
      .eq("industry_id", e.industry_id);

    if (regCount && regCount > 0) {
      const { error } = await sb
        .from("regional_cells")
        .update({
          is_suppressed: true,
          suppress_reason: "scale_or_outlier",
        })
        .eq("country", e.country)
        .eq("geo_id", e.geo_id)
        .eq("industry_id", e.industry_id);
      if (!error) updated += regCount;
      continue;
    }

    // Try extrapolated_cells (geo_id is iso-3 here)
    const { count: extCount } = await sb
      .from("extrapolated_cells")
      .select("*", { count: "exact", head: true })
      .eq("country_iso3", e.geo_id)
      .eq("industry_id", e.industry_id);
    if (extCount && extCount > 0) {
      const { error } = await sb
        .from("extrapolated_cells")
        .update({
          is_suppressed: true,
          suppress_reason: "scale_or_outlier",
        })
        .eq("country_iso3", e.geo_id)
        .eq("industry_id", e.industry_id);
      if (!error) updated += extCount;
      continue;
    }

    skipped++;
  }

  console.log(`Updated: ${updated} rows`);
  console.log(`Skipped (no matching row): ${skipped} entries`);
  console.log(
    "\nNext step: remove the JSON-import in src/lib/cells/triage.ts and replace the in-memory Set check with a query that includes .eq('is_suppressed', FALSE).",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
