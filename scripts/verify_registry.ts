/**
 * scripts/verify_registry.ts
 *
 * Prebuild gate — the design section registry contract.
 *
 * Reads every JSON file in E:/atlas/design/registry/ (../design/registry
 * relative to this website repo; resolved from the script's own location
 * with a cwd fallback). For each file it checks:
 *
 *   - the file parses as JSON;
 *   - sections live in a top-level array (or a `sections` array);
 *   - every section has id, index, heading, and a state in
 *     {approved, candidate, rejected};
 *   - every approved section has a non-null cropApprovedHash;
 *   - section ids are unique within the file.
 *
 * Bootstrap tolerance: if the registry directory is missing or holds
 * no JSON yet, the gate PASSES with a note (the registry is being
 * stood up; there is nothing to verify).
 *
 * Run: npx tsx scripts/verify_registry.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const STATES = ["approved", "candidate", "rejected"];

function scriptDir(): string {
  try {
    return __dirname; // CJS (tsx default for this repo; no "type":"module")
  } catch {
    return resolve(process.cwd(), "scripts"); // ESM fallback
  }
}

function registryDir(): string {
  const fromScript = resolve(scriptDir(), "..", "..", "design", "registry");
  if (existsSync(fromScript)) return fromScript;
  return resolve(process.cwd(), "..", "design", "registry");
}

const DIR = registryDir();

if (!existsSync(DIR)) {
  console.log(`verify_registry: PASS (registry dir not found at ${DIR}; bootstrap tolerance).`);
  process.exit(0);
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log(`verify_registry: PASS (registry dir ${DIR} holds no JSON yet; bootstrap tolerance).`);
  process.exit(0);
}

const violations: string[] = [];
let sectionCount = 0;

for (const file of files) {
  const abs = join(DIR, file);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(abs, "utf-8"));
  } catch (err) {
    violations.push(`${file}: invalid JSON (${err instanceof Error ? err.message : String(err)})`);
    continue;
  }

  const sections: unknown[] | null = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { sections?: unknown }).sections)
      ? ((parsed as { sections: unknown[] }).sections)
      : null;
  if (!sections) {
    violations.push(`${file}: no sections array (expected a top-level array or a "sections" key)`);
    continue;
  }

  const seen = new Map<string, number>();
  sections.forEach((raw, i) => {
    sectionCount++;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      violations.push(`${file}: section[${i}]: not an object`);
      return;
    }
    const s = raw as Record<string, unknown>;
    const label = `${file}: section[${i}]${typeof s.id === "string" && s.id ? ` (id=${s.id})` : ""}`;

    if (typeof s.id !== "string" || s.id.length === 0) violations.push(`${label}: missing/empty id`);
    if (s.index === undefined || s.index === null) violations.push(`${label}: missing index`);
    if (typeof s.heading !== "string" || s.heading.length === 0)
      violations.push(`${label}: missing/empty heading`);
    if (typeof s.state !== "string" || !STATES.includes(s.state))
      violations.push(`${label}: state "${String(s.state)}" not in {${STATES.join(", ")}}`);
    if (s.state === "approved" && (s.cropApprovedHash === undefined || s.cropApprovedHash === null))
      violations.push(`${label}: approved section has null/missing cropApprovedHash`);

    if (typeof s.id === "string" && s.id.length > 0) {
      const prior = seen.get(s.id);
      if (prior !== undefined) {
        violations.push(`${file}: duplicate id "${s.id}" (sections ${prior} and ${i})`);
      } else {
        seen.set(s.id, i);
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`verify_registry: ${violations.length} violation(s) in ${DIR}:`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log(
  `verify_registry: PASS (${files.length} registry file(s), ${sectionCount} section(s) conform).`,
);
