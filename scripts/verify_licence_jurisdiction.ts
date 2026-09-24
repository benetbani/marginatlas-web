/**
 * verify_licence_jurisdiction: a page off the United States prints no licence
 * named for a United States jurisdiction (the goal's A9, 2026-09-24).
 *
 * The trade page's `03 permits` reads the trade's shard, which is the trade's
 * and not a country's, under the basis "Typical for the trade anywhere". On
 * production /gb/london/craft-breweries-taprooms listed a "Federal brewer's
 * notice / manufacturing permit" and a "State manufacturer / brewery licence";
 * nine names across eight live trades are the United States' own.
 * `isUsJurisdictionLicence` (src/lib/spine/permits_rows.ts) names them and
 * `buildPermits(id, iso2)` withholds them with a stated line off a US page.
 * This gate holds, over every live trade:
 *
 *   1. built for the United Kingdom, no printed cell's name is US-named, and
 *      every licence it withholds as US-named is counted in its stated line;
 *   2. built for the United States, every US-named licence prints (they are
 *      true there);
 *   3. a name that says "state or national" is not US-named and prints
 *      anywhere;
 *   4. the pinned case: craft breweries on a UK page withholds exactly its two
 *      and says so.
 *
 * BLIND SPOT: the predicate reads the words "federal" and "state"; a US-only
 * name without either (a "DMV permit", a county form) passes here, and the
 * zoning and occupancy wording (41 names) is left as US-worded but generic.
 * No network, no browser.
 */
import { red } from "./lib/red";
import { INDUSTRIES } from "../src/lib/taxonomy";
import { buildPermits, isUsJurisdictionLicence } from "../src/lib/spine/permits_rows";
import { industryRows } from "../src/lib/facts/industry_shard";
import { COPY } from "../src/lib/spine/copy";

const RULE = "licence-jurisdiction";
const FILE = "src/lib/spine/permits_rows.ts";
const reds: string[] = [];
const fail = (detail: string, remedy: string) => reds.push(red({ rule: RULE, file: FILE, detail, remedy }));

let usNamed = 0;
let tradesTouched = 0;
for (const ind of INDUSTRIES) {
  const names = industryRows(ind.id, "licensing.licences.*.name").map((r) => String(r.value ?? "").trim()).filter(Boolean);
  const days = new Map(industryRows(ind.id, "licensing.licences.*.typical_days").map((f) => [f.rowKey, f.value] as const));
  const printable = industryRows(ind.id, "licensing.licences.*.name").filter((r) => {
    const d = days.get(r.rowKey);
    return typeof d === "number" && Number.isFinite(d) && d > 0 && String(r.value ?? "").trim() !== "";
  }).map((r) => String(r.value).trim());
  const ours = printable.filter(isUsJurisdictionLicence);
  if (ours.length) { tradesTouched++; usNamed += ours.length; }

  const gb = buildPermits(ind.id, "GB");
  for (const c of gb?.cells ?? []) {
    if (isUsJurisdictionLicence(String(c.label))) fail(`${ind.id} on a UK page prints "${c.label}", a licence named for the United States`, "withhold it off a US page through isUsJurisdictionLicence, with the stated line");
  }
  if (ours.length) {
    const line = gb?.withheld ?? "";
    const want = ours.length === 1 ? COPY.tradePermits.foreignOne : COPY.tradePermits.foreignMany.replace("{n}", String(ours.length));
    if (!line.includes(want)) fail(`${ind.id} on a UK page withholds ${ours.length} US-named licence(s) and its line reads "${line}"`, "state the count in the permits card's withheld line (COPY.tradePermits.foreignOne or foreignMany)");
  }
  const us = buildPermits(ind.id, "US");
  const usLabels = new Set((us?.cells ?? []).map((c) => String(c.label)));
  for (const n of ours) if (!usLabels.has(n)) fail(`${ind.id} on a US page does not print "${n}", which is true there`, "withhold US-named licences only off a US page");
  void names;
}

const hedged = ["State or national pharmacy premises permit", "Therapist professional licence (state or national board)"];
for (const h of hedged) if (isUsJurisdictionLicence(h)) fail(`"${h}" names both a state and a nation and was read as US-named`, "leave a name that says \"state or national\" to print anywhere");

const beer = buildPermits("craft_beer_mfg", "GB");
if (!beer || (beer.cells ?? []).some((c) => /federal|state manufacturer/i.test(String(c.label)))) fail("craft_beer_mfg on a UK page still prints a Federal or State licence", "withhold both off a US page");
if (!beer?.withheld?.includes(COPY.tradePermits.foreignMany.replace("{n}", "2"))) fail(`craft_beer_mfg on a UK page does not say it withholds two US-named licences ("${beer?.withheld ?? ""}")`, "state the count in the withheld line");

if (reds.length) {
  console.error(`verify_licence_jurisdiction: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_licence_jurisdiction: ${INDUSTRIES.length} live trades; ${usNamed} licence names across ${tradesTouched} trades are named for the United States, printed on a US page and withheld with their line on a UK page; names saying "state or national" print anywhere; craft breweries on a UK page withholds its two and says so.`);
