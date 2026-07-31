/**
 * scripts/verify_population_mix.ts
 *
 * THE CAP IS THE MECHANISM.
 *
 * The ratified POPs spec (PRODUCT-DIRECTION.md §3, 2026-06-22) calls for "8 to
 * 10 CAPPED archetypes" shown as a composition mix per place. The cap is not
 * tidiness. A mix is a claim about a place that only means something if every
 * place is describing itself in the same words.
 *
 * The failure this prevents is quiet. City one writes "students 15". City two,
 * authored three months later by someone reaching for a better word, writes
 * "student-renters 15". Nothing breaks, nothing looks wrong, and the layer whose
 * entire purpose was to make places comparable has stopped doing it, on a page
 * that still renders perfectly.
 *
 * WHAT IT CHECKS, across every city data file and fixture:
 *   1. Every archetype key is in the closed vocabulary.
 *   2. The vocabulary itself has not grown past the ratified ceiling of ten.
 *   3. Shares sum to 100. A mix that sums to 94 is not a mix.
 *   4. No key appears twice in one place.
 *   5. At most one type is marked `accent`, matching the one-accent rule.
 *
 * Adding a tenth archetype is a founder decision. It requires editing
 * CITY_ARCHETYPE_KEYS, which this gate reads rather than duplicates, so the
 * vocabulary has exactly one home.
 *
 * Usage: npx tsx scripts/verify_population_mix.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_ARCHETYPE_KEYS } from "../src/lib/cities/city_spine2_types";

/** The ratified ceiling. "8 to 10 capped archetypes". */
const RATIFIED_MAX = 10;

const failures: string[] = [];
const allowed = new Set<string>(CITY_ARCHETYPE_KEYS);

/* 0. The vocabulary itself. */
if (CITY_ARCHETYPE_KEYS.length > RATIFIED_MAX) {
  failures.push(
    `The archetype vocabulary has ${CITY_ARCHETYPE_KEYS.length} keys; the ratified\n` +
      `      ceiling is ${RATIFIED_MAX}. Growing it past that is a founder decision, not an\n` +
      `      authoring one, because every existing mix silently loses meaning.`,
  );
}
if (new Set(CITY_ARCHETYPE_KEYS).size !== CITY_ARCHETYPE_KEYS.length) {
  failures.push("CITY_ARCHETYPE_KEYS contains a duplicate.");
}

/** Every city-shaped JSON we hold: fixtures and any real city data. */
function cityFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["fixtures", "data/cities"]) {
    const abs = resolve(process.cwd(), dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs)) {
      if (name.endsWith(".json")) out.push(resolve(abs, name));
    }
  }
  return out;
}

let checked = 0;

for (const file of cityFiles()) {
  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue; // not our problem; other gates own malformed JSON
  }
  const people = doc.people as Record<string, unknown> | undefined;
  const arch = people?.archetypes as Record<string, unknown> | undefined;
  const types = arch?.types as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(types)) continue; // a NullFigure is a legitimate state

  const rel = file.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\//, "");
  checked++;

  const seen = new Set<string>();
  let sum = 0;
  let accents = 0;

  for (const t of types) {
    const key = String(t.key ?? "");
    if (!allowed.has(key)) {
      failures.push(
        `${rel}: archetype key "${key}" is not in the closed vocabulary.\n` +
          `      Allowed: ${[...allowed].join(", ")}`,
      );
    }
    if (seen.has(key)) failures.push(`${rel}: archetype key "${key}" appears more than once.`);
    seen.add(key);
    sum += Number(t.sharePct ?? 0);
    if (t.accent === true) accents++;
  }

  if (Math.abs(sum - 100) > 0.5) {
    failures.push(
      `${rel}: the population mix sums to ${sum}, not 100.\n` +
        `      A composition that does not close is not a composition. If a share is\n` +
        `      unknown, the file states the whole figure as null rather than a mix\n` +
        `      that silently omits people.`,
    );
  }
  if (accents > 1) {
    failures.push(`${rel}: ${accents} archetypes marked accent; at most one may be.`);
  }
}

if (failures.length) {
  console.error(`x verify_population_mix: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(
  `verify_population_mix: PASS. ${CITY_ARCHETYPE_KEYS.length} capped archetypes, ` +
    `${checked} place file(s) checked.`,
);
