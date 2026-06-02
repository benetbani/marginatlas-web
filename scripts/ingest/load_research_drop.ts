/**
 * load_research_drop.ts — load a validated research-drop JSON into Supabase.
 *
 * Default is DRY-RUN: prints the rows it WOULD upsert, writes nothing. Pass
 * --commit to actually write. Pass --rollback <drop_id> to delete rows from a
 * prior load. Every loaded row is tagged coverage_source = "research-drop:<id>"
 * so a load is fully reversible.
 *
 * Run:
 *   npx tsx scripts/ingest/load_research_drop.ts <file>            # dry-run
 *   npx tsx scripts/ingest/load_research_drop.ts <file> --commit   # write
 *   npx tsx scripts/ingest/load_research_drop.ts --rollback <id>   # undo
 *
 * Needs SUPABASE_DB_URL (parent E:/atlas/secrets.env) or the PostgREST env in
 * website/.env.local. Uses the supabase-js admin client.
 */
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve, basename } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

import { INDUSTRY_BY_ID } from "../../src/lib/taxonomy";
import { iso2ToIso3, iso2ToName } from "../../src/lib/countries";
import {
  type ResearchDrop,
  type ActivityDrop,
  type SizeBandDrop,
  validateResearchDrop,
  normalizeBand,
  confidenceToQuality,
} from "./research_drop_schema";

// Per-activity percentile spread around the per-firm point estimate (matches the
// coarse spread synthesizeCell uses, so research rows read consistently).
const SPREAD = { p10: 0.4, p25: 0.65, p50: 1.0, p75: 1.55, p90: 2.3 };

type ExtrapRow = {
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

function dropId(file: string, drop: ResearchDrop): string {
  // Stable id from country + sector + capture date (no Date.now: keep reproducible).
  return `${drop.country_iso2}_${drop.sector_cluster}_${drop.captured_at}`.replace(
    /[^A-Za-z0-9_]/g,
    "-",
  );
}

function bandRows(
  drop: ResearchDrop,
  a: ActivityDrop,
  b: SizeBandDrop,
  iso3: string,
  id: string,
): ExtrapRow | null {
  const band = normalizeBand(b.band);
  if (!band) return null;
  const usd =
    b.revenue_per_firm_local != null ? b.revenue_per_firm_local * a.fx_to_usd : null;
  const conf = b.confidence ?? drop.confidence_default ?? "modeled";
  const { quality_score, coverage_tier } = confidenceToQuality(conf);
  return {
    country_iso3: iso3,
    country_name: iso2ToName(drop.country_iso2) || drop.country_iso2,
    industry_id: a.industry_id,
    year: 2025,
    size_band: band,
    predicted_rev_per_firm: usd,
    quality_score,
    coverage_tier,
    coverage_source: `research-drop:${id}`,
  };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const commit = argv.includes("--commit");
  const rollbackIdx = argv.indexOf("--rollback");

  const { supabaseAdmin } = await import("../../src/lib/supabase");

  if (rollbackIdx !== -1) {
    const id = argv[rollbackIdx + 1];
    if (!id) {
      console.error("usage: --rollback <drop_id>");
      process.exit(1);
    }
    const tag = `research-drop:${id}`;
    if (!commit) {
      const { count } = await supabaseAdmin
        .from("extrapolated_cells")
        .select("*", { count: "exact", head: true })
        .eq("coverage_source", tag);
      console.log(`DRY-RUN rollback: would delete ${count ?? 0} rows tagged ${tag}. Pass --commit.`);
      return;
    }
    const { error } = await supabaseAdmin
      .from("extrapolated_cells")
      .delete()
      .eq("coverage_source", tag);
    console.log(error ? `rollback error: ${error.message}` : `rolled back ${tag}`);
    return;
  }

  const file = argv.find((x) => !x.startsWith("--"));
  if (!file) {
    console.error("usage: load_research_drop.ts <file> [--commit]");
    process.exit(1);
  }
  const drop = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf-8")) as ResearchDrop;

  // Re-validate before loading; never trust an unvalidated drop.
  const issues = validateResearchDrop(drop, new Set(Object.keys(INDUSTRY_BY_ID)));
  const errors = issues.filter((i) => i.level === "error");
  if (errors.length) {
    console.error(`Drop has ${errors.length} validation error(s); run research:validate. Aborting.`);
    for (const e of errors) console.error(`  ${e.path}: ${e.msg}`);
    process.exit(1);
  }

  const iso3 = iso2ToIso3(drop.country_iso2);
  if (!iso3) {
    console.error(`Cannot map ${drop.country_iso2} to iso3.`);
    process.exit(1);
  }
  const id = dropId(basename(file), drop);

  const rows: ExtrapRow[] = [];
  for (const a of drop.activities) {
    for (const b of a.size_bands) {
      const r = bandRows(drop, a, b, iso3, id);
      if (r) rows.push(r);
    }
  }

  if (!commit) {
    console.log(`DRY-RUN: drop ${id} -> ${rows.length} extrapolated_cells rows (iso3 ${iso3}).`);
    for (const r of rows.slice(0, 12)) {
      console.log(
        `  ${r.industry_id.padEnd(22)} ${r.size_band.padEnd(7)} ` +
          `$${r.predicted_rev_per_firm?.toFixed(0) ?? "null"} q${r.quality_score} ${r.coverage_tier}`,
      );
    }
    if (rows.length > 12) console.log(`  ... +${rows.length - 12} more`);
    console.log(`\nNo writes. Re-run with --commit to apply.`);
    return;
  }

  // Upsert by the table's primary key (country_iso3, year, industry_id, size_band).
  const { error } = await supabaseAdmin
    .from("extrapolated_cells")
    .upsert(rows, { onConflict: "country_iso3,year,industry_id,size_band" });
  if (error) {
    console.error(`load error: ${error.message}`);
    process.exit(1);
  }
  console.log(`Loaded ${rows.length} rows for drop ${id}. coverage_source=research-drop:${id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
