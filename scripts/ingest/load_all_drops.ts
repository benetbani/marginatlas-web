/**
 * load_all_drops.ts - load EVERY validated research-drop in deep-research/drops
 * into Supabase in ONE process. This is the repeatable "enrich a country, run
 * one command" loader. It is idempotent (upsert by primary key with
 * merge-duplicates), so re-running after you add or edit drops only changes the
 * rows that changed. One process, so it never thrashes memory the way spawning a
 * tsx per file does.
 *
 * Default is DRY-RUN (prints what it would write, no DB writes). Pass --commit
 * to write. Every row is tagged coverage_source = "research-drop:<id>" so any
 * single drop is reversible via load_research_drop.ts --rollback <id> --commit.
 *
 * Run from website/:
 *   npx tsx scripts/ingest/load_all_drops.ts                       # dry-run, all drops
 *   npx tsx scripts/ingest/load_all_drops.ts --commit              # write all drops
 *   npx tsx scripts/ingest/load_all_drops.ts --commit --only india # subset by filename
 *   npx tsx scripts/ingest/load_all_drops.ts --commit --include-extrapolated
 *
 * Needs SUPABASE_DB_URL / the admin env in website/.env.local (same as the
 * single-file loader).
 */
import { config } from "dotenv";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

import { INDUSTRY_BY_ID } from "../../src/lib/taxonomy";
import { iso2ToIso3, iso2ToName } from "../../src/lib/countries";
import {
  type ResearchDrop,
  validateResearchDrop,
  normalizeBand,
  confidenceToQuality,
} from "./research_drop_schema";

const DROPS_DIR = resolve(process.cwd(), "../deep-research/drops");

type Row = {
  country_iso3: string;
  country_name: string;
  industry_id: string;
  year: number;
  size_band: string;
  predicted_rev_per_firm: number | null;
  quality_score: number;
  coverage_tier: string;
  coverage_source: string;
};

function dropId(d: ResearchDrop): string {
  return `${d.country_iso2}_${d.sector_cluster}_${d.captured_at}`.replace(/[^A-Za-z0-9_]/g, "-");
}

function buildRows(d: ResearchDrop, iso3: string, id: string): Row[] {
  const rows: Row[] = [];
  const name = iso2ToName(d.country_iso2) || d.country_iso2;
  for (const a of d.activities) {
    for (const b of a.size_bands) {
      const band = normalizeBand(b.band);
      if (!band) continue;
      const usd = b.revenue_per_firm_local != null ? b.revenue_per_firm_local * a.fx_to_usd : null;
      const conf = b.confidence ?? d.confidence_default ?? "modeled";
      const { quality_score, coverage_tier } = confidenceToQuality(conf);
      rows.push({
        country_iso3: iso3,
        country_name: name,
        industry_id: a.industry_id,
        year: 2025,
        size_band: band,
        predicted_rev_per_firm: usd,
        quality_score,
        coverage_tier,
        coverage_source: `research-drop:${id}`,
      });
    }
  }
  return rows;
}

function collectFiles(only: string | null, includeExtra: boolean): string[] {
  const files: string[] = [];
  const take = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      if (f.endsWith(".json") && (!only || f.includes(only))) files.push(join(dir, f));
    }
  };
  take(DROPS_DIR);
  if (includeExtra) {
    take(join(DROPS_DIR, "extrapolated"));
    take(join(DROPS_DIR, "extrapolated", "crosscountry"));
  }
  return files.sort();
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const commit = argv.includes("--commit");
  const onlyIdx = argv.indexOf("--only");
  const only = onlyIdx !== -1 ? argv[onlyIdx + 1] : null;
  const includeExtra = argv.includes("--include-extrapolated");

  const known = new Set(Object.keys(INDUSTRY_BY_ID));
  const files = collectFiles(only, includeExtra);

  let supabaseAdmin: { from: (t: string) => any } | null = null;
  if (commit) ({ supabaseAdmin } = await import("../../src/lib/supabase"));

  console.log(`=== load_all_drops (${commit ? "COMMIT" : "DRY-RUN"}): ${files.length} files ===`);
  let totalRows = 0;
  let errors = 0;
  for (const file of files) {
    const name = basename(file);
    let d: ResearchDrop;
    try {
      d = JSON.parse(readFileSync(file, "utf-8")) as ResearchDrop;
    } catch (e) {
      console.log(`  SKIP ${name}: not valid JSON`);
      errors++;
      continue;
    }
    const issues = validateResearchDrop(d, known).filter((i) => i.level === "error");
    if (issues.length) {
      console.log(`  SKIP ${name}: ${issues.length} validation error(s)`);
      errors++;
      continue;
    }
    const iso3 = iso2ToIso3(d.country_iso2);
    if (!iso3) {
      console.log(`  SKIP ${name}: no iso3 for ${d.country_iso2}`);
      errors++;
      continue;
    }
    const id = dropId(d);
    const rows = buildRows(d, iso3, id);
    if (commit && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from("extrapolated_cells")
        .upsert(rows, { onConflict: "country_iso3,year,industry_id,size_band" });
      if (error) {
        console.log(`  ERROR ${id}: ${error.message}`);
        errors++;
        continue;
      }
    }
    totalRows += rows.length;
    console.log(`  ${commit ? "loaded" : "dry-run"} ${id.padEnd(38)} ${String(rows.length).padStart(4)} rows (${iso3})`);
  }
  console.log(`\nTotal rows ${commit ? "upserted" : "to load"}: ${totalRows} | files with errors: ${errors}`);
  if (!commit) console.log("No writes. Re-run with --commit to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
