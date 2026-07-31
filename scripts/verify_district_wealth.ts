/**
 * scripts/verify_district_wealth.ts
 *
 * THE BAND IS THE DECISION. AN INDEX NUMBER IS FORECLOSED.
 *
 * Ratified 2026-07-31, decision 1. A district wealth read ships as one of five
 * bands and never as a number, and the reason is evidence rather than taste:
 *
 *   - roughly 84% of household income variance sits WITHIN a small area rather
 *     than between areas, so a district figure describes a minority of what
 *     people there actually earn, before any estimation error;
 *   - where district boundaries do not nest inside official ones, interpolated
 *     median household income is wrong by more than 10% in about 44% of cases;
 *   - UK small-area guidance holds that a difference under 5 to 10% between two
 *     small areas is not defensible at all.
 *
 * "Shoreditch 118" therefore claims a precision that does not exist. The
 * pressure to add it back will be real, because a number sorts, colours a map
 * and looks rigorous. This gate exists so that pressure has to argue with a
 * failing build rather than with somebody's memory of a decision.
 *
 * WHAT IT CHECKS, per city file:
 *   1. Every band is one of the five. No free text, no invented sixth step.
 *   2. No numeric score rides along beside the band, under any name.
 *   3. Every district in the list has a wealth row. A grid the reader scans
 *      must not have a hole in it.
 *   4. No row references a district that does not exist.
 *   5. The figure carries a tier, because most cities will be `estimated` for
 *      years and the page has to be able to say so.
 *
 * Usage: npx tsx scripts/verify_district_wealth.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_DISTRICT_WEALTH_BANDS } from "../src/lib/cities/city_spine2_types";

const allowed = new Set<string>(CITY_DISTRICT_WEALTH_BANDS);
const failures: string[] = [];

/** Any field on a wealth row that is a number is a smuggled index. */
const BAND_FIELDS = new Set(["districtSlug", "resident", "daytime"]);

function cityFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["fixtures", "data/cities"]) {
    const abs = resolve(process.cwd(), dir);
    if (!existsSync(abs)) continue;
    for (const name of readdirSync(abs)) if (name.endsWith(".json")) out.push(resolve(abs, name));
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
  const wealth = districts.wealth as Record<string, unknown> | undefined;
  if (!wealth) {
    failures.push(
      `${rel}: districts.wealth is absent entirely.\n` +
        `      The completeness rule says a page's shape never varies by place. A city\n` +
        `      with no reading holds a NullFigure with its reason, not a missing key.`,
    );
    continue;
  }
  if (wealth.value === null) continue; // a NullFigure is a legitimate state
  checked++;

  const rows = (wealth.rows as Array<Record<string, unknown>>) ?? [];

  if (!wealth.tier) {
    failures.push(`${rel}: districts.wealth carries no tier, so the page cannot say how solid it is.`);
  }

  for (const r of rows) {
    for (const field of ["resident", "daytime"]) {
      const v = String(r[field] ?? "");
      if (!allowed.has(v)) {
        failures.push(
          `${rel}: district "${r.districtSlug}" has ${field} = "${v}", which is not one of the five bands.\n` +
            `      Allowed: ${[...allowed].join(", ")}`,
        );
      }
    }
    for (const [k, v] of Object.entries(r)) {
      if (!BAND_FIELDS.has(k) && typeof v === "number") {
        failures.push(
          `${rel}: district "${r.districtSlug}" carries a numeric field "${k}" = ${v}.\n` +
            `      A district wealth read is a BAND. An index number was foreclosed by\n` +
            `      name on 2026-07-31, on the evidence in this file's header. Remove it.`,
        );
      }
    }
  }

  // Completeness both ways against the district list.
  const list = districts.list as Record<string, unknown> | undefined;
  const listRows = (list?.districts as Array<Record<string, unknown>>) ?? [];
  if (listRows.length) {
    const known = new Set(listRows.map((d) => String(d.slug)));
    const covered = new Set(rows.map((r) => String(r.districtSlug)));
    for (const slug of known) {
      if (!covered.has(slug)) {
        failures.push(`${rel}: district "${slug}" is in the list but has no wealth row.`);
      }
    }
    for (const slug of covered) {
      if (!known.has(slug)) {
        failures.push(`${rel}: wealth row references "${slug}", which is not a district in the list.`);
      }
    }
  }
}

if (failures.length) {
  console.error(`x verify_district_wealth: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(
  `verify_district_wealth: PASS. ${allowed.size} bands, ${checked} city file(s) with a reading.`,
);
