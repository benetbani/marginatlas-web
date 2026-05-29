/**
 * industry_vocab_gap.ts - reachability audit for the industry-vocabulary
 * drift between the loaded data (regional_cells / extrapolated_cells) and
 * the website taxonomy (industries.json).
 *
 * For every distinct industry_id in the data tables, it asks: does the
 * site's own round-trip (industryToSlug -> slugToIndustry ->
 * resolveToMeasuredIndustry) land back on the SAME id the DB row uses?
 * If not, the data-access layer queries for the wrong industry_id and the
 * real rows behind that id are unreachable (the page falls through to
 * coarser country-level data or, worst case, resolves to an unrelated
 * industry).
 *
 * Output: data/audit/industry_vocab_gap.json - the full list of broken
 * ids with row counts, so the fix (a vocabulary crosswalk) can be derived
 * and so this can be re-run as a regression check after the fix lands.
 *
 * Read-only. Usage: npx tsx scripts/audit/industry_vocab_gap.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

config({ path: resolve(process.cwd(), ".env.local") });

type Drop = {
  db_industry_id: string;
  rows: number;
  via_slug: string;
  resolves_to: string | null;
  reason: "remapped" | "unresolved";
};

async function distinctIndustryCounts(
  table: string,
  col: string,
): Promise<Map<string, number>> {
  const { supabaseAdmin } = await import("../../src/lib/supabase");
  const counts = new Map<string, number>();
  let from = 0;
  const page = 1000;
  for (;;) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(col)
      .range(from, from + page - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data as Record<string, unknown>[]) {
      const k = r[col] as string;
      if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    if (data.length < page) break;
    from += page;
    if (from > 1_000_000) break; // safety stop
  }
  return counts;
}

async function run(): Promise<void> {
  // Reachability is now measured against the EXACT-FIRST candidate resolver
  // (industryQueryCandidates), not the old single-resolve round-trip. A DB
  // industry_id is reachable when the candidate list for its own slug
  // contains it - i.e. a query for that slug would hit its rows.
  const { industryToSlug } = await import("../../src/lib/taxonomy");
  const { industryQueryCandidates } = await import(
    "../../src/lib/cells/industry_resolution"
  );

  const tables: Array<{ table: string; col: string }> = [
    { table: "regional_cells", col: "industry_id" },
    { table: "extrapolated_cells", col: "industry_id" },
  ];

  const report: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
  };

  for (const { table, col } of tables) {
    const counts = await distinctIndustryCounts(table, col);
    const totalRows = [...counts.values()].reduce((a, b) => a + b, 0);
    const drops: Drop[] = [];
    for (const [id, rows] of counts) {
      const slug = industryToSlug(id) ?? id;
      const candidates = industryQueryCandidates(slug);
      const reachable = candidates.includes(id);
      if (!reachable) {
        drops.push({
          db_industry_id: id,
          rows,
          via_slug: slug,
          resolves_to: candidates[0] ?? null,
          reason: candidates.length ? "remapped" : "unresolved",
        });
      }
    }
    drops.sort((a, b) => b.rows - a.rows);
    const droppedRows = drops.reduce((a, d) => a + d.rows, 0);
    report[table] = {
      distinct_ids: counts.size,
      broken_ids: drops.length,
      total_rows: totalRows,
      unreachable_rows: droppedRows,
      unreachable_pct: Number(((droppedRows / totalRows) * 100).toFixed(1)),
      drops,
    };
    console.log(
      `${table}: ${drops.length}/${counts.size} ids broken; ` +
        `${droppedRows}/${totalRows} rows unreachable ` +
        `(${((droppedRows / totalRows) * 100).toFixed(1)}%)`,
    );
  }

  const out = resolve(process.cwd(), "data/audit/industry_vocab_gap.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`Wrote ${out}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
