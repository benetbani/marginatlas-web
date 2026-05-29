/**
 * industry_vocab_gap.ts - reachability audit for the industry-vocabulary
 * drift between the loaded data (regional_cells / extrapolated_cells) and
 * the website taxonomy.
 *
 * Reachability is measured against the EXACT-FIRST candidate resolver
 * (industryQueryCandidates): a DB industry_id is reachable when the
 * candidate list for its own slug contains it - i.e. a query for that slug
 * would hit its rows.
 *
 * Distinct industry_ids (and their row counts) are read from a server-side
 * aggregate RPC when available, falling back to a bounded paged scan. The
 * aggregate avoids the statement-timeout that a full table scan hits on the
 * large unindexed tables. Read-only.
 *
 * Usage: npx tsx scripts/audit/industry_vocab_gap.ts
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

/**
 * Distinct industry_id -> row count. Tries a single GROUP BY via PostgREST's
 * aggregate support; if that is not exposed, falls back to a bounded paged
 * scan. The aggregate is one cheap query and sidesteps the full-scan
 * statement-timeout on the unindexed large tables.
 */
async function distinctIndustryCounts(
  table: string,
): Promise<Map<string, number>> {
  const { supabaseAdmin } = await import("../../src/lib/supabase");
  const counts = new Map<string, number>();

  // Preferred: server-side aggregate (PostgREST: select=industry_id,count()).
  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("industry_id, count:count()")
      .order("industry_id", { ascending: true });
    if (!error && data && data.length > 0 && "count" in (data[0] as object)) {
      for (const r of data as unknown as Array<{ industry_id: string; count: number }>) {
        if (r.industry_id) counts.set(r.industry_id, Number(r.count) || 0);
      }
      return counts;
    }
  } catch {
    // fall through to paged scan
  }

  // Fallback: bounded paged scan (may hit a timeout on huge tables, but
  // returns whatever it collected before failing).
  let from = 0;
  const page = 1000;
  for (;;) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("industry_id")
      .range(from, from + page - 1);
    if (error) break;
    if (!data || data.length === 0) break;
    for (const r of data as unknown as Record<string, unknown>[]) {
      const k = r.industry_id as string;
      if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    if (data.length < page) break;
    from += page;
    if (from > 1_000_000) break;
  }
  return counts;
}

async function run(): Promise<void> {
  const { industryToSlug } = await import("../../src/lib/taxonomy");
  const { industryQueryCandidates } = await import(
    "../../src/lib/cells/industry_resolution"
  );

  const report: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
  };

  for (const table of ["regional_cells", "extrapolated_cells"]) {
    const counts = await distinctIndustryCounts(table);
    const totalRows = [...counts.values()].reduce((a, b) => a + b, 0);
    const drops: Drop[] = [];
    for (const [id, rows] of counts) {
      const slug = industryToSlug(id) ?? id;
      const candidates = industryQueryCandidates(slug);
      if (!candidates.includes(id)) {
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
      unreachable_pct:
        totalRows > 0 ? Number(((droppedRows / totalRows) * 100).toFixed(1)) : null,
      drops,
    };
    console.log(
      `${table}: ${drops.length}/${counts.size} ids broken; ` +
        `${droppedRows}/${totalRows} rows unreachable ` +
        `(${totalRows > 0 ? ((droppedRows / totalRows) * 100).toFixed(1) : "n/a"}%)`,
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
