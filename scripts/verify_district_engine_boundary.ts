/**
 * scripts/verify_district_engine_boundary.ts
 *
 * THE DISTRICT ENGINE MUST READ THE SAME TRADE UNDER EITHER SPELLING, AND A
 * TRADE IT DOES NOT KNOW MUST SAY SO.
 *
 * Found 2026-09-17 (bug:district-revenue-dead): the site's URL slugs are
 * hyphenated and built from names (dental-practices, cafes-coffee-shops),
 * every table in src/lib/economics/neighborhood_multipliers.ts is keyed by
 * underscore id (dental_practices, cafes_coffee), and adapt_city passed the
 * slug straight in. Every lookup missed, every multiplier fell to a neutral
 * 1.0, and every London district printed a revenue of exactly +0% while the
 * rent side, keyed by tag, kept varying. It rendered perfectly. Nothing on the
 * page could tell "the model says this district is average" from "the model
 * was never asked". The engine now resolves either spelling at its boundary
 * and carries activityKnown=false on a miss; this gate keeps both true.
 *
 * The sibling bug (bug:rent-share-invented): adapt_city typed the baseline
 * rent share as 0.12, and that constant alone decided the sign of four
 * district rows. The share is read from the baselines table now through one
 * accessor whose fallback is the table's own median, marked unsourced.
 *
 * WHAT IT CHECKS, none of it needing the network, a secret or a browser:
 *   1. For every taxonomy industry the engine holds a coefficient for, the
 *      hyphenated URL slug resolves to the same engine id as the id itself.
 *      This is the two-of-ten case (cafes-coffee-shops, clothing-shoe-stores)
 *      a bare hyphen swap would miss.
 *   2. End to end on London's seven curated districts for three trades: the
 *      slug form and the id form return the identical final multiplier.
 *   3. A string no table knows comes back activityKnown=false, activityId
 *      null, on both getNeighborhoodMultiplier and getNeighborhoodNetMargin.
 *      A silent 1.0 with activityKnown=true is the bug under another name.
 *   4. rentOccupancyShareFor returns the same sourced share for the slug and
 *      the id of every baseline row; an unknown trade comes back unsourced at
 *      the fallback; the fallback IS the median of the table, recomputed here.
 *   5. adapt_city.ts carries no literal rent share: `baseRentShare = 0.NN`
 *      may not come back, comments stripped before the scan.
 *
 * BLIND SPOT: it cannot see what a card prints. Whether a bounded figure
 * reaches a reader is the harness's question (check_page_holes and the
 * honest answer written at getNeighborhoodMultiplier).
 *
 * Negative-tested 2026-09-17 against two planted faults: the resolver with
 * its taxonomy step removed (check 1 and 2 red) and `baseRentShare = 0.12`
 * typed back into adapt_city (check 5 red).
 *
 * Usage: npx tsx scripts/verify_district_engine_boundary.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRIES, industryToSlug } from "../src/lib/taxonomy";
import {
  KNOWN_ACTIVITY_IDS,
  resolveEngineActivity,
  getNeighborhoodMultiplier,
  getNeighborhoodNetMargin,
} from "../src/lib/economics/neighborhood_multipliers";
import {
  INDUSTRY_BASELINES,
  RENT_OCCUPANCY_FALLBACK,
  rentOccupancyShareFor,
} from "../src/lib/qa/industry_baselines";
import { newCommentState, stripComments } from "./lib/strip_comments";

const failures: string[] = [];
const fail = (s: string) => failures.push(s);

/* 1. Every engine-known taxonomy trade resolves identically under its URL slug.
   Membership is read off the exported set first: resolving an unknown id warns
   once by design, and a gate that prints seventy warnings on PASS is a gate
   whose one red line nobody sees. */
let knownTrades = 0;
for (const ind of INDUSTRIES) {
  if (!KNOWN_ACTIVITY_IDS.has(ind.id)) continue;
  const byId = resolveEngineActivity(ind.id);
  if (!byId.known) {
    fail(`resolution: ${ind.id} is in KNOWN_ACTIVITY_IDS but resolveEngineActivity says unknown.`);
    continue;
  }
  knownTrades++;
  const slug = industryToSlug(ind.id);
  const bySlug = resolveEngineActivity(slug);
  if (!bySlug.known || bySlug.id !== byId.id) {
    fail(
      `resolution: "${slug}" (the URL slug of ${ind.id}) resolves to ${String(bySlug.id)} but the id resolves to ${byId.id}.\n` +
        `      Either spelling must reach the same coefficients; a miss here is a district revenue of exactly +0%.`,
    );
  }
}
if (knownTrades < 20) {
  fail(`resolution: only ${knownTrades} taxonomy trades are known to the engine; expected dozens. Did KNOWN_ACTIVITY_IDS lose a table?`);
}

/* 2. End to end on London's seven districts, three trades, both spellings. */
const LONDON = ["city-of-london", "west-end", "south-bank", "north-london", "south-london", "east-london", "west-london"];
const PAIRS: Array<[string, string]> = [
  ["dental-practices", "dental_practices"],
  ["cafes-coffee-shops", "cafes_coffee"],
  ["clothing-shoe-stores", "clothing_stores"],
];
let e2e = 0;
for (const [slug, id] of PAIRS) {
  for (const d of LONDON) {
    const a = getNeighborhoodMultiplier("london", d, slug);
    const b = getNeighborhoodMultiplier("london", d, id);
    e2e++;
    if (!a.activityKnown || !b.activityKnown) {
      fail(`end-to-end: london/${d} ${slug}: activityKnown is ${a.activityKnown} (slug) / ${b.activityKnown} (id); both must be true.`);
    } else if (a.final !== b.final) {
      fail(`end-to-end: london/${d}: "${slug}" gives ${a.final.toFixed(3)} and "${id}" gives ${b.final.toFixed(3)}. Same trade, same district, two answers.`);
    }
  }
}
/* The whole point: the slug form must VARY across districts, not sit at 1.0. */
const finals = new Set(LONDON.map((d) => getNeighborhoodMultiplier("london", d, "dental-practices").final.toFixed(3)));
if (finals.size < 2) {
  fail(`end-to-end: "dental-practices" returns ${[...finals].join(", ")} in every London district. The revenue half is not running.`);
}

/* 3. A miss is tagged, never a silent 1.0. The one warn this provokes is the
   engine doing its job; it is muted here so the gate's own output stays one line. */
{
  const realWarn = console.warn;
  console.warn = () => {};
  const m = getNeighborhoodMultiplier("london", "west-end", "no-such-trade-zz");
  if (m.activityKnown !== false || m.activityId !== null) {
    fail(`miss: an unknown activity came back activityKnown=${m.activityKnown}, activityId=${String(m.activityId)}; it must be false and null.`);
  }
  const nm = getNeighborhoodNetMargin("london", "west-end", "no-such-trade-zz", 0.1, 0.08);
  if (nm.activityKnown !== false) {
    fail(`miss: getNeighborhoodNetMargin lost the tag: activityKnown=${nm.activityKnown} for an unknown activity.`);
  }
  const fallbackRow = getNeighborhoodMultiplier("nowhere-city", "nowhere-district", "no-such-trade-zz");
  if (fallbackRow.activityKnown !== false) {
    fail(`miss: the city-default path lost the tag: activityKnown=${fallbackRow.activityKnown}.`);
  }
  console.warn = realWarn;
}

/* 4. The rent share reads the same row under either spelling; the fallback is the median. */
let shares = 0;
for (const id of Object.keys(INDUSTRY_BASELINES)) {
  const byId = rentOccupancyShareFor(id);
  const slug = industryToSlug(id);
  const bySlug = rentOccupancyShareFor(slug);
  shares++;
  if (!byId.sourced || !bySlug.sourced || byId.share !== bySlug.share) {
    fail(`rent share: ${id} reads ${byId.share} (${byId.sourced ? "sourced" : "fallback"}) by id and ${bySlug.share} (${bySlug.sourced ? "sourced" : "fallback"}) by slug "${slug}".`);
  }
}
{
  const unknown = rentOccupancyShareFor("no-such-trade-zz");
  if (unknown.sourced !== false || unknown.share !== RENT_OCCUPANCY_FALLBACK) {
    fail(`rent share: an unknown trade came back sourced=${unknown.sourced} share=${unknown.share}; it must be the marked fallback ${RENT_OCCUPANCY_FALLBACK}.`);
  }
  const sorted = Object.values(INDUSTRY_BASELINES).map((b) => b.rent_occupancy).sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  if (Math.abs(median - RENT_OCCUPANCY_FALLBACK) > 1e-12) {
    fail(`rent share: RENT_OCCUPANCY_FALLBACK is ${RENT_OCCUPANCY_FALLBACK} but the table's median is ${median}. The fallback must be computed from the table, not typed.`);
  }
}

/* 5. No literal rent share in adapt_city.ts, comments stripped. */
{
  const file = resolve(process.cwd(), "src/lib/spine/adapt_city.ts");
  const state = newCommentState();
  const lines = readFileSync(file, "utf-8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const code = stripComments(lines[i], state);
    if (/\bbaseRentShare\s*=\s*0?\.\d+/.test(code)) {
      fail(`adapt_city.ts:${i + 1}: a literal rent share is typed in (${code.trim()}). It must be read through rentOccupancyShareFor for the trade in question.`);
    }
  }
}

if (failures.length) {
  console.error(`x verify_district_engine_boundary: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(
  `verify_district_engine_boundary: PASS. ${knownTrades} engine-known trades resolve under both spellings, ${e2e} London rows agree end to end, a miss is tagged, ${shares} rent shares read the same by slug and id, fallback ${RENT_OCCUPANCY_FALLBACK} is the table's median, no literal share in adapt_city.`,
);
