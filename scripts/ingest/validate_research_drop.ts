/**
 * validate_research_drop.ts — check a research-drop JSON file is well-formed and
 * sane BEFORE anyone tries to load it. Pure read + taxonomy check; no DB, no env.
 *
 * Run: npx tsx scripts/ingest/validate_research_drop.ts <path-to-drop.json>
 * Exit 0 = clean (warnings allowed), exit 1 = errors found or file unreadable.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRY_BY_ID } from "../../src/lib/taxonomy";
import { validateResearchDrop } from "./research_drop_schema";

function main(): void {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: validate_research_drop.ts <path-to-drop.json>");
    process.exit(1);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf-8"));
  } catch (e) {
    console.error(`Cannot read/parse ${file}: ${(e as Error).message}`);
    process.exit(1);
  }

  const known = new Set(Object.keys(INDUSTRY_BY_ID));
  const issues = validateResearchDrop(parsed, known);
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  for (const w of warns) console.warn(`  warn  ${w.path}: ${w.msg}`);
  for (const e of errors) console.error(`  ERROR ${e.path}: ${e.msg}`);

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s), ${warns.length} warning(s). Drop is NOT loadable.`);
    process.exit(1);
  }
  console.log(`OK: drop valid (${warns.length} warning(s)).`);
}

main();
