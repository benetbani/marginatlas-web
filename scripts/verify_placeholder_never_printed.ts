/**
 * scripts/verify_placeholder_never_printed.ts
 *
 * A PLACEHOLDER IS NOT A FIGURE, AND NOTHING READS ONE UNASKED (2026-09-23
 * night, QUEUE sys:placeholder-never-printed).
 *
 * The bank tags a slot waiting on research `placeholder`, and the site's law is
 * that one is never printed. That night two new builders read one each as
 * "modelled": `buildCityCalendar` drew London's twelve placeholder months as a
 * 37 per cent swing on the exemplar and on production, and `buildCountrySpend`
 * built North Korea's placeholder household budget, which no page served only
 * because /kp is a 404 (North Korea is not in the site's country list; the
 * first report of this said /kp printed it, written from the builder without
 * fetching the page, and was wrong). Both mapped every tag that is not `held`
 * to "modeled", and nothing stopped them. So the refusal
 * moved into the store: `queryFacts` drops a placeholder unless the query asks
 * with `placeholders: "include"`, and every accessor and builder reads through
 * it. This gate keeps three things true, none of them needing the network, a
 * secret or a browser:
 *
 *   1. THE STORE REFUSES BY DEFAULT, ON THE REAL BANK. Every shard holding a
 *      placeholder is found by reading the four shard folders (so a new one
 *      anywhere is covered the day it lands) and loaded into the store, and a
 *      planted one is loaded beside them so the check is never vacuous. Each
 *      is asked three ways: `queryFacts` returns none of its placeholders,
 *      `factValue` returns null for each placeholder scalar, and the same
 *      query with `placeholders: "include"` returns every one.
 *   2. EVERY ASK IS NAMED. The literal `placeholders: "include"` appears in
 *      `src/` only in the files listed in ASKS below, each with its reason; an
 *      unlisted ask reds, and a listed file that no longer asks reds as stale.
 *   3. NOTHING GOES AROUND THE STORE. A read of the shard folders outside
 *      `src/lib/facts/` is listed in BYPASSES below and its file filters
 *      placeholders itself (the literal "placeholder" in its code, comments
 *      stripped), or it reds; a listed file that no longer reads the folders
 *      reds as stale. A READ is a path built from the segments `"data",
 *      "facts"`, or a written `data/facts/` path handed to a file read or an
 *      import on the same line. A string that only NAMES a shard (the
 *      provenance labels `trade_net.ts` and `city_income.ts` carry, "field:
 *      ... data/facts/industry/<id>.json") is not a read, and the first draft
 *      of this gate, which counted every such string, redded both.
 *
 * BLIND SPOT, STATED: it cannot see what a card prints. A listed ask whose
 * builder prints the placeholder anyway passes here; each reason says what the
 * ask is for, and the page is the harness's. And a read spelled some other way
 * (a `data/facts/` path written into a variable on one line and read on the
 * next, a path assembled from other pieces) is not seen.
 *
 * PLANTED ONCE WHEN THE RULE WAS BORN (2026-09-23 night), each on a byte copy
 * restored afterwards: the store's default filter removed (check 1 red on all
 * four holders, GB, KP, London and restaurants, and on the plant: eleven
 * lines); an unlisted `placeholders: "include"` typed into city_crew_rows.ts
 * (check 2 red on its line); the world scan's filter removed from
 * country_exit_rows.ts (check 3 red on its read). Before the store change the
 * draft of this gate read the old code and redded all three at once (71
 * problems), which is the same proof from the other side.
 *
 * Usage: npx tsx scripts/verify_placeholder_never_printed.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { allFacts, factValue, loadFacts, queryFacts } from "../src/lib/facts/store";
import { shardToFacts, type Shard } from "../src/lib/facts/shard";
import type { Fact } from "../src/lib/facts/types";
import { newCommentState, stripComments } from "./lib/strip_comments";
import { red } from "./lib/red";

const RULE = "placeholder-never-printed";
const ROOT = process.cwd();

/** The files allowed to ask the store for placeholders, and what each ask is for. */
const ASKS: Record<string, string> = {
  "src/lib/spine/fact_rows.ts":
    "buildCityDemand reads London's placeholder spend only to withhold it with the line that says what it is (\"the figure on file for London is a placeholder\"), truer than \"not on file\"",
};

/** The files allowed to read the shard folders by path, and why; each filters placeholders itself. */
const BYPASSES: Record<string, string> = {
  "src/lib/spine/country_exit_rows.ts":
    "the world's sale times, scanned from every country shard once per process for the usual band and the count that take longer; loading 198 shards into the store would slow every query after it",
};

const problems: string[] = [];
const fail = (file: string, detail: string, remedy: string, line?: number) =>
  problems.push(red({ rule: RULE, file, line, detail, remedy }));

/* ---- 1. The store refuses by default, on the real bank and on a plant. ---- */
type Holder = { file: string; entityId: string; placeholders: number; scalars: string[] };
const holders: Holder[] = [];
for (const folder of ["country", "city", "industry", "neighborhood"]) {
  const dir = join(ROOT, "data", "facts", folder);
  let names: string[];
  try {
    names = readdirSync(dir).filter((n) => n.endsWith(".json"));
  } catch {
    continue;
  }
  for (const name of names) {
    let shard: Shard;
    try {
      shard = JSON.parse(readFileSync(join(dir, name), "utf8")) as Shard;
    } catch {
      continue;
    }
    if (!Array.isArray(shard?.facts) || !shard.facts.some((f) => f && f.tag === "placeholder")) continue;
    const facts = shardToFacts(shard);
    const ph = facts.filter((f) => f.tag === "placeholder");
    if (ph.length === 0) continue;
    loadFacts(allFacts().concat(facts));
    holders.push({
      file: `data/facts/${folder}/${name}`,
      entityId: shard.entityId,
      placeholders: ph.length,
      scalars: [...new Set(ph.filter((f) => f.rowKey === "").map((f) => f.metric))],
    });
  }
}
/* THE PLANT: one placeholder and one held figure on an entity no shard uses,
   so the check proves the filter even on a day the bank holds no placeholder. */
const PLANT: Fact[] = [
  { entityType: "city", entityId: "ZZ-placeholder-gate", rowKey: "", metric: "gate.placeholder", value: 1, unit: null, tag: "placeholder", c: 0, period: "latest", methodId: "gate" },
  { entityType: "city", entityId: "ZZ-placeholder-gate", rowKey: "", metric: "gate.held", value: 2, unit: null, tag: "held", c: 1, period: "latest", methodId: "gate" },
];
loadFacts(allFacts().concat(PLANT));
holders.push({ file: "scripts/verify_placeholder_never_printed.ts (the plant)", entityId: "ZZ-placeholder-gate", placeholders: 1, scalars: ["gate.placeholder"] });
if (factValue("ZZ-placeholder-gate", "gate.held")?.value !== 2)
  fail("src/lib/facts/store.ts", "the plant's held figure did not come back beside its filtered placeholder", "queryFacts must drop only the placeholder, never the held figure beside it");

for (const h of holders) {
  const leaked = queryFacts({ entityId: h.entityId }).filter((f) => f.tag === "placeholder").length;
  if (leaked > 0)
    fail(h.file, `queryFacts returned ${leaked} of ${h.placeholders} placeholder fact(s) for ${h.entityId} without being asked`, "queryFacts drops a placeholder unless the query carries placeholders: \"include\"");
  const asked = queryFacts({ entityId: h.entityId, placeholders: "include" }).filter((f) => f.tag === "placeholder").length;
  if (asked !== h.placeholders)
    fail(h.file, `the ask returned ${asked} of ${h.placeholders} placeholder fact(s) for ${h.entityId}`, "placeholders: \"include\" must return every placeholder the entity holds");
  const scalarLeaks = h.scalars.filter((m) => factValue(h.entityId, m) !== null);
  if (scalarLeaks.length)
    fail(h.file, `factValue returned ${scalarLeaks.length} placeholder scalar(s) for ${h.entityId} without being asked (${scalarLeaks.slice(0, 3).join(", ")}${scalarLeaks.length > 3 ? ", ..." : ""})`, "factValue reads through queryFacts and inherits its refusal");
}

/* ---- 2 and 3. Every ask named; nothing around the store. ---- */
const ASK_RE = /placeholders\s*:\s*["']include["']/;
const READ_RES = [
  /["']data["']\s*,\s*["']facts["']/, // a path built from segments
  /\b(?:readFileSync|readdirSync|statSync|existsSync|createReadStream|require)\s*\([^)]*data\/facts\//, // a written path handed to a read
  /\bfrom\s+["'][^"']*data\/facts\//, // a static import of a shard
  /\bimport\s*\(\s*["'`][^"'`]*data\/facts\//, // a dynamic import of one
];
const asksSeen = new Set<string>();
const readsSeen = new Set<string>();
function walk(dir: string, out: string[]): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e)) out.push(p);
  }
  return out;
}
for (const abs of walk(join(ROOT, "src"), [])) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  if (rel.startsWith("src/lib/facts/")) continue; // the store defines the ask and its loaders are the reads it is built on
  const lines = readFileSync(abs, "utf8").split(/\r?\n/);
  const state = newCommentState();
  let namesPlaceholder = false;
  const readLines: number[] = [];
  lines.forEach((raw, i) => {
    const code = stripComments(raw, state);
    if (code.includes("\"placeholder\"") || code.includes("'placeholder'")) namesPlaceholder = true;
    if (ASK_RE.test(code)) {
      asksSeen.add(rel);
      if (!ASKS[rel]) fail(rel, "asks the store for placeholders and is not on the gate's list", "withhold the placeholder instead, or add the file to ASKS with the reason the ask is for", i + 1);
    }
    if (READ_RES.some((re) => re.test(code))) readLines.push(i + 1);
  });
  if (readLines.length) {
    readsSeen.add(rel);
    if (!BYPASSES[rel]) fail(rel, "reads the shard folders around the store that refuses placeholders", "read through src/lib/facts, or add the file to BYPASSES with its reason and filter placeholders in its own read", readLines[0]);
    else if (!namesPlaceholder) fail(rel, "reads the shard folders around the store and never names \"placeholder\" in its code, so its read cannot be filtering one", "skip a fact whose tag is \"placeholder\" in the read", readLines[0]);
  }
}
for (const f of Object.keys(ASKS)) if (!asksSeen.has(f)) fail(f, "is on the gate's ASKS list and no longer asks for placeholders", "delete its entry from ASKS");
for (const f of Object.keys(BYPASSES)) if (!readsSeen.has(f)) fail(f, "is on the gate's BYPASSES list and no longer reads the shard folders", "delete its entry from BYPASSES");

if (problems.length) {
  console.error(`\nx ${RULE}: ${problems.length} problem(s).`);
  process.exit(1);
}
const real = holders.slice(0, -1);
console.log(
  `v ${RULE}: the store refuses every placeholder unasked on ${real.length} holder(s) in the bank (${real
    .map((h) => `${h.entityId} ${h.placeholders}`)
    .join(", ")}) and on the plant; ${asksSeen.size} named ask(s), ${readsSeen.size} named read(s) around the store, each filtering its own.`,
);
