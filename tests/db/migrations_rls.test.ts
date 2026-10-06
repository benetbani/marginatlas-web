/**
 * EVERY TABLE A MIGRATION CREATES HAS ROW LEVEL SECURITY (the checkup of 2026-10-06, finding 1). Three files created tables and
 * never enabled it (the live database had it on anyway, measured that day); db/migrations/2026-10-06-rls-everywhere.sql made the
 * files say what the database does. This holds the rule for every file to come: a `create table` is matched, in the same file
 * or a later one, by `alter table <name> enable row level security`, or by a guarded loop that names the table as a literal in
 * a file that enables it. SQL comments are stripped first, so a table named in prose never counts.
 *
 * Holds the rule on db/migrations/*.sql, and its plants: a migration that creates a table without it reds; one that enables it
 * passes.
 *
 * Run: npx tsx tests/db/migrations_rls.test.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "migrations-rls";
const DIR = "db/migrations";
const REMEDY = "enable row level security on the table in the same migration (the service role keeps writing); never rely on the dashboard's default";
let failed = 0;
const check = (file: string, label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

type Migration = { file: string; sql: string };
const stripComments = (sql: string) => sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
const CREATE = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:"?public"?\.)?"?([a-z_][a-z0-9_]*)"?/gi;

/** The tables created without row level security in this or any later file, for a set of migrations in date order. */
export function tablesWithoutRls(migrations: Migration[]): Array<{ table: string; file: string }> {
  const sorted = [...migrations].sort((a, b) => a.file.localeCompare(b.file));
  const bodies = sorted.map((m) => ({ file: m.file, sql: stripComments(m.sql).toLowerCase() }));
  const out: Array<{ table: string; file: string }> = [];
  bodies.forEach((m, i) => {
    for (const hit of m.sql.matchAll(CREATE)) {
      const table = hit[1].toLowerCase();
      const later = bodies.slice(i);
      const enabled = later.some((n) => {
        const direct = new RegExp(`alter\\s+table\\s+(?:if\\s+exists\\s+)?(?:only\\s+)?(?:"?public"?\\.)?"?${table}"?\\s+enable\\s+row\\s+level\\s+security`).test(n.sql);
        const looped = /enable\s+row\s+level\s+security/.test(n.sql) && n.sql.includes(`'${table}'`);
        return direct || looped;
      });
      if (!enabled) out.push({ table, file: m.file });
    }
  });
  return out;
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".sql"));
const migrations: Migration[] = files.map((f) => ({ file: f, sql: readFileSync(join(DIR, f), "utf8") }));
const created = migrations.flatMap((m) => [...stripComments(m.sql).toLowerCase().matchAll(CREATE)].map((h) => h[1]));
console.log(`${files.length} migration files, ${created.length} tables created`);

const missing = tablesWithoutRls(migrations);
check(DIR, `every table a migration creates has row level security (${missing.map((m) => `${m.table} in ${m.file}`).join("; ") || "all"})`, missing.length === 0);

/* The plants. */
const bare = tablesWithoutRls([{ file: "2099-01-01-plant.sql", sql: "create table if not exists public.plant_emails (id bigserial primary key, email text);" }]);
check("tests/db/migrations_rls.test.ts", "the plant: a table created without it reds", bare.length === 1 && bare[0].table === "plant_emails");
const fixed = tablesWithoutRls([{ file: "2099-01-01-plant.sql", sql: "create table public.plant_emails (id int);\nalter table public.plant_emails enable row level security;" }]);
check("tests/db/migrations_rls.test.ts", "the plant: a table that enables it passes", fixed.length === 0);
const prose = tablesWithoutRls([{ file: "2099-01-01-plant.sql", sql: "create table public.plant_emails (id int);\n-- alter table public.plant_emails enable row level security;" }]);
check("tests/db/migrations_rls.test.ts", "the plant: a commented-out enable does not count", prose.length === 1);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("db/migrations_rls: all pass");
