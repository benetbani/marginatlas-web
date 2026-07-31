/**
 * scripts/verify_district_mix.ts
 *
 * THE DISTRICT POPULATION MIX, HELD TO ITS SHAPE.
 *
 * Ratified 2026-07-31, decisions 5 and 6. Each district names the population
 * types that are largest there, from the same capped vocabulary the city uses,
 * plus the types that are notably thin. The trades a district favours are
 * DERIVED from these at render time and never authored, so this file is the
 * only place a district's character is stated.
 *
 * WHAT IT CHECKS, per city file:
 *   1. Every key is in the capped vocabulary, so districts and cities are
 *      describing themselves in the same words.
 *   2. At most five types per district. The founder set the number.
 *   3. Shares run largest first, because the renderer and the derivation both
 *      assume it and neither would fail visibly if it were wrong.
 *   4. No type appears twice in one district.
 *   5. `scarce` never overlaps `top`. A type cannot be both a district's
 *      defining feature and notably absent from it.
 *   6. The five shares sum to at most 100. They are the top five of nine, so
 *      they should NOT sum to exactly 100; anything over is an authoring error.
 *   7. Every district in the list has a row, and no row invents a district.
 *   8. The figure carries a tier.
 *
 * Usage: npx tsx scripts/verify_district_mix.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_ARCHETYPE_KEYS } from "../src/lib/cities/city_spine2_types";

/** Decision 5. */
const MAX_TYPES_PER_DISTRICT = 5;

const allowed = new Set<string>(CITY_ARCHETYPE_KEYS);
const failures: string[] = [];

function cityFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["fixtures", "data/cities"]) {
    const abs = resolve(process.cwd(), dir);
    if (!existsSync(abs)) continue;
    for (const n of readdirSync(abs)) if (n.endsWith(".json")) out.push(resolve(abs, n));
  }
  return out;
}

let checked = 0;

for (const file of cityFiles()) {
  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  const districts = doc.districts as Record<string, unknown> | undefined;
  if (!districts) continue;
  const rel = file.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\//, "");

  const mix = districts.mix as Record<string, unknown> | undefined;
  if (!mix) {
    failures.push(
      `${rel}: districts.mix is absent entirely. A page's shape never varies by\n` +
        `      place, so a city without a reading holds a NullFigure with its reason.`,
    );
    continue;
  }
  if (mix.value === null) continue;
  checked++;

  if (!mix.tier) failures.push(`${rel}: districts.mix carries no tier.`);

  const rows = (mix.rows as Array<Record<string, unknown>>) ?? [];
  for (const r of rows) {
    const slug = String(r.districtSlug);
    const top = (r.top as Array<Record<string, unknown>>) ?? [];
    const scarce = (r.scarce as string[]) ?? [];

    if (top.length > MAX_TYPES_PER_DISTRICT) {
      failures.push(`${rel}: district "${slug}" lists ${top.length} types; the ratified maximum is ${MAX_TYPES_PER_DISTRICT}.`);
    }

    const seen = new Set<string>();
    let sum = 0;
    let prev = Infinity;
    for (const t of top) {
      const key = String(t.key);
      const share = Number(t.sharePct ?? 0);
      if (!allowed.has(key)) {
        failures.push(
          `${rel}: district "${slug}" uses type "${key}", which is not in the capped\n` +
            `      vocabulary. Allowed: ${[...allowed].join(", ")}`,
        );
      }
      if (seen.has(key)) failures.push(`${rel}: district "${slug}" lists "${key}" more than once.`);
      seen.add(key);
      if (share > prev) {
        failures.push(
          `${rel}: district "${slug}" is not ordered largest first ("${key}" at ${share}\n` +
            `      follows ${prev}). The renderer and the favoured-trades derivation both\n` +
            `      assume this order and neither would fail visibly if it were wrong.`,
        );
      }
      prev = share;
      sum += share;
    }

    if (sum > 100) {
      failures.push(`${rel}: district "${slug}" shares sum to ${sum}, which is over 100.`);
    }

    for (const s of scarce) {
      if (!allowed.has(String(s))) {
        failures.push(`${rel}: district "${slug}" marks "${s}" scarce, which is not in the capped vocabulary.`);
      }
      if (seen.has(String(s))) {
        failures.push(
          `${rel}: district "${slug}" lists "${s}" as both a top type and notably absent.\n` +
            `      A type cannot be a district's defining feature and missing from it.`,
        );
      }
    }
  }

  const list = districts.list as Record<string, unknown> | undefined;
  const listRows = (list?.districts as Array<Record<string, unknown>>) ?? [];
  if (listRows.length) {
    const known = new Set(listRows.map((d) => String(d.slug)));
    const covered = new Set(rows.map((r) => String(r.districtSlug)));
    for (const s of known) if (!covered.has(s)) failures.push(`${rel}: district "${s}" has no population mix row.`);
    for (const s of covered) if (!known.has(s)) failures.push(`${rel}: mix row references "${s}", not a district in the list.`);
  }
}

if (failures.length) {
  console.error(`x verify_district_mix: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(`verify_district_mix: PASS. ${checked} city file(s) with a district mix.`);
