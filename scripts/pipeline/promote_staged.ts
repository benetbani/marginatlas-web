/**
 * scripts/pipeline/promote_staged.ts
 *
 * City-data pipeline, the human-gated promote step. Takes a REVIEWED staged file
 * and merges only its `status: filled` targets into the LIVE data files, after
 * re-running the validation gate. This is the one place staged data becomes live;
 * it is run by a human after reviewing the staged file, never by the loop.
 *
 * It writes the live JSON with the file's existing 2-space indent and preserved
 * key order, so the diff is just the promoted city's fields. It leaves the change
 * UNSTAGED so the founder reviews and ships it through the normal git + Vercel loop.
 *
 * Merges:
 *   sectors         -> city_signature_v1.json   cities[slug].signature_sectors
 *   demographics    -> city_signature_v1.json   cities[slug].foreign_born_pct / _owned_pct
 *   board_economics -> city_list_v1.json        record fields
 *   nbhd_economics  -> held (no live target file yet; reported, not merged)
 *
 * Run: npx tsx scripts/pipeline/promote_staged.ts <slug>
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DATA = resolve(ROOT, "data", "cities");
const slug = process.argv[2];
if (!slug) {
  console.error("usage: npx tsx scripts/pipeline/promote_staged.ts <slug>");
  process.exit(2);
}

const stagedPath = resolve(DATA, "_staged", `${slug}.json`);
if (!existsSync(stagedPath)) {
  console.error(`no staged file: ${stagedPath}`);
  process.exit(2);
}

// Re-run the validation gate; refuse to promote a staged file that does not pass.
try {
  execFileSync("npx", ["tsx", "scripts/pipeline/validate_staged.ts", slug], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
} catch {
  console.error(`\nREFUSING to promote ${slug}: validation gate failed.`);
  process.exit(1);
}

const staged = JSON.parse(readFileSync(stagedPath, "utf-8"));
const targets: Record<string, { status?: string; values?: Record<string, unknown> }> =
  staged.targets ?? {};

function readJson(rel: string): unknown {
  return JSON.parse(readFileSync(resolve(DATA, rel), "utf-8"));
}
function writeJson(rel: string, obj: unknown): void {
  writeFileSync(resolve(DATA, rel), JSON.stringify(obj, null, 2) + "\n");
}

const changed: string[] = [];
const held: string[] = [];

// --- city_signature_v1.json (sectors + demographics) ----------------------
const sectorsT = targets.sectors;
const demoT = targets.demographics;
if (sectorsT?.status === "filled" || demoT?.status === "filled") {
  const sig = readJson("city_signature_v1.json") as {
    cities: Record<string, Record<string, unknown>>;
  };
  sig.cities[slug] = sig.cities[slug] ?? {};
  if (sectorsT?.status === "filled") {
    sig.cities[slug].signature_sectors = sectorsT.values?.signature_sectors;
    changed.push("city_signature_v1.json: signature_sectors");
  }
  if (demoT?.status === "filled") {
    if (demoT.values?.foreign_born_pct != null)
      sig.cities[slug].foreign_born_pct = demoT.values.foreign_born_pct;
    if (demoT.values?.foreign_owned_pct != null)
      sig.cities[slug].foreign_owned_pct = demoT.values.foreign_owned_pct;
    changed.push("city_signature_v1.json: demographics");
  }
  writeJson("city_signature_v1.json", sig);
}

// --- city_list_v1.json (board economics) ----------------------------------
const econT = targets.board_economics;
if (econT?.status === "filled") {
  const list = readJson("city_list_v1.json") as { cities: Array<Record<string, unknown>> };
  const rec = list.cities.find((c) => c.slug === slug);
  if (rec) {
    for (const k of ["avg_gross_salary_usd_year", "cost_of_living_index", "tourist_arrivals_m"]) {
      if (econT.values && econT.values[k] != null) rec[k] = econT.values[k];
    }
    writeJson("city_list_v1.json", list);
    changed.push("city_list_v1.json: board economics");
  }
}

// --- nbhd_economics: held (no live target file yet) -----------------------
if (targets.nbhd_economics?.status === "filled") {
  held.push("nbhd_economics (no live neighborhood-economics file yet; build that surface first)");
}

// --- state ----------------------------------------------------------------
const statePath = resolve(DATA, "_pipeline", "state.json");
if (!existsSync(dirname(statePath))) mkdirSync(dirname(statePath), { recursive: true });
type State = { cities: Record<string, { status: string; at: string }> };
const state: State = existsSync(statePath)
  ? (JSON.parse(readFileSync(statePath, "utf-8")) as State)
  : { cities: {} };
const today = new Date().toISOString().slice(0, 10);
state.cities[slug] = { status: "promoted", at: today };
writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");

console.log(`\nPROMOTED ${slug}`);
for (const c of changed) console.log(`  + ${c}`);
for (const h of held) console.log(`  ~ held: ${h}`);
console.log(
  `\nLive files updated and left UNSTAGED. Review the diff, then ship via the normal loop:` +
    `\n  git diff data/cities/city_signature_v1.json` +
    `\n  (stage the touched data file, commit, push, Vercel-verify, fast-forward to main).`,
);
