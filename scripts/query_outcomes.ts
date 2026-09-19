/**
 * THE QUERY OUTCOME TABLE, AGAINST THE LIVE DATABASE (plan step 18, 2026-09-17).
 *
 * Gate-free by design: it needs the network and the service key, which the
 * chain must never need. Run it by hand when a form "worked" and nothing
 * arrived, or after a migration, and read one line per query:
 *
 *   npx tsx --env-file=.env.local scripts/query_outcomes.ts
 *
 * Two halves. First, every table the site reads or writes gets a one-row
 * select with an exact count, so a table that does not exist prints its
 * error verbatim (PostgREST: "Could not find the table 'public.x' in the
 * schema cache") and an existing one prints ok with its row count. NOT
 * `head: true`: a HEAD request carries no error body, so on its first run
 * this script printed `ok: ? rows` for two tables that do not exist, which
 * is the exact blindness it was written to end. A count that comes back
 * null is printed as a finding, never as ok. Second, the
 * site's own readers run through `withBudget` with QUERY_OUTCOMES=1, so the
 * ledger in src/lib/query_log.ts shows what a page render would log. The
 * table list is written here by hand from `grep -rho '\.from("[a-z_]*"' src`
 * plus the two REST routes (corrections, contact_messages); if a new table
 * appears in src and not here, the script is stale and says nothing about it.
 *
 * With --write-test, the two reader-facing tables take one marked row each
 * in the exact shape their route posts (newsletter_signups: email and
 * source; corrections: cell_url, message, email, ip, user_agent), the row's
 * id is printed, and the row is deleted by that id in the same run. That is
 * plan step 19's "a test signup lands as a row", proved and cleaned up; the
 * addresses end in .invalid so no real reader is ever in the table.
 *
 * Exit 1 when any table errors, so a shell can notice; the words are the point.
 *
 * THE TABLE HALF IS EXPORTED (plan step 50, 2026-09-19): `checkTables(db)`
 * returns one outcome per table in the same shape the lines print, and
 * `makeClient()` builds the client the same way `main()` does, so the launch
 * checklist (scripts/verify_launch_ready.ts, by hand, never in the chain) runs
 * this script's own function for its "two tables present" line instead of a
 * second query list. `main()` runs only when this file is the entry point.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

process.env.QUERY_OUTCOMES = "1";

/* Every table src/ touches: readers in src/lib, the API routes, the two REST routes. */
export const TABLES: Array<{ name: string; where: string; off?: string }> = [
  { name: "cells_master", where: "src/lib/cells.ts, the US cells" },
  { name: "regional_cells", where: "src/lib/cells/*.ts, trusted-local cells" },
  { name: "extrapolated_cells", where: "src/lib/cells/*.ts" },
  { name: "saved_cells", where: "src/app/api/saved-cells", off: "auth is 'Coming soon', the feature is off" },
  { name: "subscriptions", where: "src/app/api/stripe/webhook", off: "billing is off" },
  { name: "newsletter_signups", where: "src/app/api/newsletter (migration 2026-08-16-newsletter-source.sql)" },
  { name: "corrections", where: "src/app/api/correction, by REST (migration 2026-08-16-corrections.sql)" },
  { name: "contact_messages", where: "src/app/api/contact, by REST (migration 2026-08-01-contact-messages.sql)" },
];

/** One table's outcome: `ok` with its count; `off` when it is missing and its feature is off (never an error); `error` or `nocount` otherwise. */
export type TableOutcome = {
  name: string;
  where: string;
  off?: string;
  state: "ok" | "off" | "error" | "nocount";
  count: number | null;
  message?: string;
  ms: number;
};

/** The client `main()` builds: the URL and a key from the environment (load .env.local first), or null with the reason. */
export function makeClient(): { db: SupabaseClient; url: string; role: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const role = process.env.SUPABASE_SERVICE_ROLE_KEY ? "service role" : "anon key (RLS applies; a 0 may be a policy, not an empty table)";
  return { db: createClient(url, key, { auth: { persistSession: false } }), url, role };
}

/** One one-row select with an exact count per table in TABLES, in order; the words of each line are the state's. */
export async function checkTables(db: SupabaseClient): Promise<TableOutcome[]> {
  const out: TableOutcome[] = [];
  for (const { name, where, off } of TABLES) {
    const t0 = Date.now();
    const { count, error } = await db.from(name).select("*", { count: "exact" }).limit(1);
    const ms = Date.now() - t0;
    if (error && off) out.push({ name, where, off, state: "off", count: null, message: error.message, ms });
    else if (error) out.push({ name, where, state: "error", count: null, message: error.message, ms });
    else if (count == null) out.push({ name, where, state: "nocount", count: null, ms });
    else out.push({ name, where, state: "ok", count, ms });
  }
  return out;
}

/** The line `main()` prints for one outcome. */
export function tableLine(o: TableOutcome): string {
  const name = o.name.padEnd(22);
  if (o.state === "off") return `  ${name} missing, and its feature is off (${o.off}); not counted as an error: ${o.message} (${o.ms}ms)`;
  if (o.state === "error") return `  ${name} error: ${o.message} (${o.ms}ms)`;
  if (o.state === "nocount") return `  ${name} no count came back and no error either; treated as an error (${o.ms}ms)`;
  return `  ${name} ok: ${o.count} rows (${o.ms}ms)`;
}

async function main() {
  const client = makeClient();
  if (!client) {
    console.error("query_outcomes: NEXT_PUBLIC_SUPABASE_URL and a key are not in the environment. Run with --env-file=.env.local.");
    process.exit(2);
  }
  const { db, url, role } = client;
  console.log(`query_outcomes: ${url} with the ${role}\n`);
  console.log("=== Tables ===");
  let errors = 0;
  for (const o of await checkTables(db)) {
    if (o.state === "error" || o.state === "nocount") errors++;
    console.log(tableLine(o));
  }

  if (process.argv.includes("--write-test")) {
    console.log("\n=== A marked row in, and out again (--write-test) ===");
    const stamp = new Date().toISOString();
    const trials: Array<[string, Record<string, unknown>]> = [
      ["newsletter_signups", { email: `plan-step-19-${Date.now()}@example.invalid`, source: "footer", created_at: stamp }],
      ["corrections", { cell_url: "/query-outcomes/test", message: `query_outcomes --write-test at ${stamp}`, email: null, ip: null, user_agent: "scripts/query_outcomes.ts" }],
    ];
    for (const [t, row] of trials) {
      const ins = await db.from(t).insert(row).select("id").single();
      if (ins.error) { errors++; console.log(`  ${t.padEnd(22)} insert error: ${ins.error.message}`); continue; }
      const id = (ins.data as { id: number }).id;
      const del = await db.from(t).delete().eq("id", id);
      console.log(`  ${t.padEnd(22)} insert ok, id ${id}; delete ${del.error ? `error: ${del.error.message}` : "ok"}`);
      if (del.error) errors++;
    }
  }

  console.log("\n=== The site's own readers, through withBudget ===");
  const cells = await import("../src/lib/cells");
  const { queryLedger } = await import("../src/lib/query_log");
  await cells.withBudget(cells.getTopCells(5), [], 20_000, "getTopCells(5)");
  await cells.withBudget(cells.getTopRegionalCells(5), [], 20_000, "getTopRegionalCells(5)");
  for (const r of queryLedger) {
    console.log(`  ${r.label.padEnd(26)} ${r.outcome}${r.ms != null ? ` ${r.ms}ms` : ""}${r.detail ? `: ${r.detail}` : ""}`);
  }
  console.log(`\n${errors ? `${errors} table(s) in error` : "every table answered"}; ${queryLedger.length} reader outcome(s) logged.`);
  process.exit(errors ? 1 : 0);
}

if (require.main === module) main().catch((e) => { console.error("query_outcomes crashed:", e); process.exit(1); });
