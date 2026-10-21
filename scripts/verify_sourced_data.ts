/**
 * verify_sourced_data , THE SOURCED FILES HOLD THE CONTRACT (plan 2026-10-17 replicable pages, Task 4; constitution law 14: every
 * figure said at its level, and the law of data: never print a figure nobody can trace).
 *
 * Reads every *.json under data/sourced/ (walked by path, scripts/lib/sourced_index.mjs) and holds each to the contract through
 * src/lib/sourced/schema.ts's checkFile: an id, a source with publisher, title and an http(s) URL, a retrieved date, and rows each
 * with an item, a geo with a known level, a code and a name, a number or a null with a note, a unit, a year starting with four
 * digits, and a row-level source as complete as a file's. It reds a file id used twice (an id is the Sources page's anchor), and an
 * index (src/lib/sourced/files.ts) that does not import exactly these files (the loader would miss one, or import one that is gone).
 *
 * THE PLANTED FILE FIRST: a file missing a row's source URL, year, unit and level must red through the same judge, each fault named,
 * before the real files are judged. It never passes having read nothing: no file under data/sourced/ is a red.
 *
 * BLIND SPOT: it checks the shape, never the value: a wrong figure copied faithfully with its source reads right; and it cannot tell a
 * URL that answers from one that is dead (no network in the chain).
 *
 * Run: node node_modules/tsx/dist/cli.mjs scripts/verify_sourced_data.ts
 */
import { readFileSync } from "node:fs";
import { checkFile } from "../src/lib/sourced/schema";
import { INDEX_FILE, SOURCED_DIR, indexSource, sourcedJsonFiles } from "./lib/sourced_index.mjs";
import { red, redSummary } from "./lib/red";

const RULE = "sourced-data";
const REMEDY = "give every row under data/sourced/ its source URL, year, unit and geo level (a null its note), then run scripts/gen_sourced_index.ts";
let failed = 0;
const fault = (file: string, detail: string, remedy = REMEDY) => { failed++; red({ rule: RULE, file, detail, remedy }); };

/* The planted file. */
const planted = {
  id: "planted", source: { publisher: "P", title: "T", url: "https://example.org" }, retrieved: "2026-10-17",
  rows: [{ item: "x", geo: { level: "town", code: "c", name: "n" }, value: 1, unit: "", source: { publisher: "P", title: "T", url: "" } }],
};
const pf = checkFile(planted, "planted");
const seen = ["source.url", "geo.level", "unit missing", "year"].filter((k) => pf.some((f) => f.includes(k)));
if (seen.length !== 4) fault("src/lib/sourced/schema.ts", `PLANTED NOT SEEN: a row without its source URL, year, unit and level drew ${pf.length} faults (${pf.join("; ") || "none"})`, "mend checkFile in src/lib/sourced/schema.ts");
else console.log(`PASS  the planted file: a row without its source URL, year, unit and level reds (${pf.length} faults)`);

/* The real files. */
const files = sourcedJsonFiles();
if (!files.length) fault(SOURCED_DIR, "READ NOTHING: no *.json under data/sourced/", "merge a data branch before this gate runs, or take the gate out of GATES with the reason");
const ids = new Map<string, string>();
let rows = 0;
for (const f of files) {
  let d: unknown;
  try { d = JSON.parse(readFileSync(f, "utf8")); } catch (e) { fault(f, `not JSON (${(e as Error).message})`); continue; }
  const faults = checkFile(d, f);
  for (const x of faults.slice(0, 20)) fault(f, x);
  if (faults.length > 20) fault(f, `and ${faults.length - 20} more faults`);
  const o = d as { id?: string; rows?: unknown[] };
  if (Array.isArray(o.rows)) rows += o.rows.length;
  if (typeof o.id === "string") {
    if (ids.has(o.id)) fault(f, `id "${o.id}" is also ${ids.get(o.id)}'s (an id is its Sources page anchor)`, "give each file its own id");
    else ids.set(o.id, f);
  }
}

/* The index the loader imports. */
let index = "";
try { index = readFileSync(INDEX_FILE, "utf8"); } catch { /* reds below */ }
if (index !== indexSource(files)) fault(INDEX_FILE, `the loader's index does not import exactly the ${files.length} files under data/sourced/`, "run node node_modules/tsx/dist/cli.mjs scripts/gen_sourced_index.ts");

if (failed) { redSummary(RULE, failed, REMEDY, `${files.length} files`); process.exit(1); }
console.log(`ok ${RULE}: ${files.length} files, ${rows} rows under data/sourced/ hold the contract, each id once, the index current`);
