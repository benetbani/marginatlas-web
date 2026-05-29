/**
 * industry_reach_check.ts - timeout-proof reachability audit.
 *
 * Reachability depends only on the SET of distinct industry_ids in each
 * data table, not on row counts. PostgREST blocks aggregate functions on
 * this project ("Use of aggregate functions is not allowed"), and a full
 * paged scan hits the statement timeout on the large tables. So this audit
 * uses the project's `pg` driver for a single cheap GROUP BY that returns
 * ~78 / ~236 rows, then checks each distinct id against the exact-first
 * candidate resolver.
 *
 * A DB industry_id is reachable when industryQueryCandidates(its slug)
 * contains it. Read-only. Writes data/audit/industry_vocab_gap.json.
 *
 * Requires a direct Postgres URL (SUPABASE_DB_URL or DATABASE_URL) in the
 * environment. If absent, exits with a clear message rather than producing
 * a misleading partial result.
 *
 * Usage: npx tsx scripts/audit/industry_reach_check.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

config({ path: resolve(process.cwd(), ".env.local") });

async function run(): Promise<void> {
  const dbUrl =
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!dbUrl) {
    console.error(
      "industry_reach_check: no direct Postgres URL found " +
        "(SUPABASE_DB_URL / DATABASE_URL / POSTGRES_URL). " +
        "Cannot run a GROUP BY without aggregate access. Aborting rather " +
        "than emitting a partial/misleading result.",
    );
    process.exit(2);
  }

  const { default: pg } = await import("pg");
  const { industryToSlug } = await import("../../src/lib/taxonomy");
  const { industryQueryCandidates } = await import(
    "../../src/lib/cells/industry_resolution"
  );

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  // This is a one-off audit, not a hot read path. The GROUP BY scans the
  // full (unindexed) table, which exceeds the default per-statement budget.
  // Lift the timeout for THIS connection only so the audit can complete
  // before the perf indexes land. Does not affect the app's connections.
  await client.query("SET statement_timeout = 0");

  const report: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
  };

  const tables: Array<{ table: string; col: string }> = [
    { table: "regional_cells", col: "industry_id" },
    { table: "extrapolated_cells", col: "industry_id" },
  ];

  try {
    for (const { table, col } of tables) {
      const { rows } = await client.query(
        `SELECT ${col} AS id, count(*)::bigint AS n FROM ${table} GROUP BY ${col}`,
      );
      const counts = new Map<string, number>();
      for (const r of rows) counts.set(r.id as string, Number(r.n));
      const totalRows = [...counts.values()].reduce((a, b) => a + b, 0);
      const drops: Array<{ db_industry_id: string; rows: number; resolves_to: string | null }> = [];
      for (const [id, n] of counts) {
        const slug = industryToSlug(id) ?? id;
        const candidates = industryQueryCandidates(slug);
        if (!candidates.includes(id)) {
          drops.push({ db_industry_id: id, rows: n, resolves_to: candidates[0] ?? null });
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
  } finally {
    await client.end();
  }

  const out = resolve(process.cwd(), "data/audit/industry_vocab_gap.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`Wrote ${out}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
