/**
 * scripts/pipeline/review_staged.ts
 *
 * City-data pipeline, the review step. Lists every staged draft in
 * data/cities/_staged/ and, per city, shows what each target would change vs the
 * current live data (before -> after), plus its confidence and sources. This is
 * the human review surface: read it, then promote the good ones with
 * scripts/pipeline/promote_staged.ts <slug>. Read-only; changes nothing.
 *
 * Run: npx tsx scripts/pipeline/review_staged.ts
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const DATA = resolve(ROOT, "data", "cities");
const STAGED = resolve(DATA, "_staged");

if (!existsSync(STAGED)) {
  console.log("No staged drafts yet (data/cities/_staged/ is empty).");
  process.exit(0);
}
const files = readdirSync(STAGED).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("No staged drafts yet.");
  process.exit(0);
}

function load<T>(rel: string): T {
  return JSON.parse(readFileSync(resolve(DATA, rel), "utf-8")) as T;
}
const liveSig = load<{ cities: Record<string, Record<string, unknown>> }>(
  "city_signature_v1.json",
).cities;
const liveList = load<{ cities: Array<Record<string, unknown>> }>("city_list_v1.json").cities;
const liveBySlug = new Map(liveList.map((c) => [c.slug as string, c]));

console.log("");
console.log("=".repeat(78));
console.log(`STAGED DRAFTS FOR REVIEW  (${files.length})`);
console.log("=".repeat(78));

for (const f of files.sort()) {
  const staged = JSON.parse(readFileSync(resolve(STAGED, f), "utf-8"));
  const slug = staged.slug as string;
  const targets = staged.targets ?? {};
  console.log("");
  console.log(`### ${slug}  (${staged.name ?? ""}, researched ${staged.researched_at ?? "?"})`);

  for (const [key, t] of Object.entries<Record<string, unknown>>(targets)) {
    const status = (t as { status?: string }).status;
    const conf = (t as { confidence?: string }).confidence;
    if (status !== "filled") {
      console.log(`  ${key}: SKIPPED  (${(t as { notes?: string }).notes ?? "no reason"})`);
      continue;
    }
    const values = (t as { values?: Record<string, unknown> }).values ?? {};
    console.log(`  ${key}: FILLED  [${conf ?? "?"}]`);

    if (key === "sectors") {
      const sig = liveSig[slug] ?? {};
      const liveSectors = Array.isArray(sig.signature_sectors)
        ? (sig.signature_sectors as Array<{ label: string }>).map((s) => s.label)
        : ["(inherits country fallback)"];
      const proposed = ((values.signature_sectors as Array<{ label: string; industry_slug: string }>) ?? []).map(
        (s) => `${s.label} -> ${s.industry_slug}`,
      );
      console.log(`     before: ${liveSectors.join(" | ")}`);
      console.log(`     after:  ${proposed.join(" | ")}`);
    } else if (key === "demographics") {
      const sig = liveSig[slug] ?? {};
      console.log(
        `     foreign_born: ${sig.foreign_born_pct ?? "(country)"} -> ${values.foreign_born_pct}` +
          `   foreign_owned: ${sig.foreign_owned_pct ?? "(country)"} -> ${values.foreign_owned_pct}`,
      );
    } else if (key === "board_economics") {
      const rec = liveBySlug.get(slug) ?? {};
      for (const k of ["avg_gross_salary_usd_year", "cost_of_living_index", "tourist_arrivals_m"]) {
        if (k in values) console.log(`     ${k}: ${rec[k] ?? "(absent)"} -> ${values[k]}`);
      }
    } else {
      console.log(`     ${JSON.stringify(values).slice(0, 200)}`);
    }
    const sources = (t as { sources?: string[] }).sources ?? [];
    if (sources.length) console.log(`     sources: ${sources.join("  ")}`);
  }
}

console.log("");
console.log("Promote a reviewed city:  npx tsx scripts/pipeline/promote_staged.ts <slug>");
console.log("");
