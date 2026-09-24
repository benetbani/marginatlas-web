#!/usr/bin/env node
/**
 * spine_unread_fields , WHICH FIELDS OF THE DATA FILES NO SPINE BUILDER READS
 * (the goal's E1, 2026-09-24; SELECTION.md section 1's first source, "files
 * outside the fact bank").
 *
 * `unused_fields.mjs` walks the four fact banks. The files outside them, the
 * country profile (197 countries, about forty fields a row) and the economics
 * files, had to be walked by hand: C3 did it on 2026-09-24. This walks them in
 * one command: every field of every row in `data/economic_indicators/*.json`
 * and `data/economics/*.json` (or the files named), with the rows holding a
 * value, against two rings of source: the spine's own builders (the files
 * under `src/lib/spine` and `src/components/spine`) and every module they
 * import under `src/`, followed through `@/` and relative imports. A field no
 * builder names prints with where it IS named: only below the spine (an
 * accessor that may rename it), off the spine (an old page), or nowhere.
 *
 * WHAT IT CANNOT SEE, STATED:
 *   - a field read through a composed name (`${kind}_pct`) reads as unread;
 *   - the test is a substring, so a field whose name sits inside a longer one
 *     reads as read by the longer one's reader;
 *   - READ IS NOT DRAWN: a builder can read a field and print nothing of it
 *     (the stability lens reads `exchange_rate_volatility_pct` and no spine
 *     page draws the lens); the census and the render say what is drawn, and
 *     C3's test was the UK render's text;
 *   - reach is by static import: a module loaded by a computed path, or a
 *     file read with fs at a path built at run time, is not followed;
 *   - a file whose rows are not objects (a flat map of numbers) has no fields
 *     to list and says so.
 * No network, no browser; it reads and writes nothing.
 *
 *   node scripts/audit/spine_unread_fields.mjs [--all] [data/file.json ...]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, basename, sep } from "node:path";

const ROOT = process.cwd();
const SHOW_ALL = process.argv.includes("--all");
const named = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const rel = (p) => relative(ROOT, p).split(sep).join("/");

/* The spine's reach: its own folders, then every module they import under src/. */
const EXTS = [".ts", ".tsx", ".js", ".mjs", ".jsx"];
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.some((e) => name.endsWith(e))) out.push(resolve(p));
  }
  return out;
}
function resolveSpec(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = resolve(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const e of [...EXTS, ".json"]) if (existsSync(base + e)) return base + e;
  for (const e of EXTS) if (existsSync(join(base, "index" + e))) return join(base, "index" + e);
  return null;
}
const IMPORT_RE = /(?:import|export)\s[^;]*?from\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)|import\s*["']([^"']+)["']/g;
const roots = [...walk(join(ROOT, "src", "lib", "spine")), ...walk(join(ROOT, "src", "components", "spine"))];
const reached = new Set();
const reachedJson = new Map(); // json path -> first importer
const queue = [...roots];
while (queue.length) {
  const f = queue.pop();
  if (reached.has(f)) continue;
  reached.add(f);
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3] ?? m[4];
    const r = resolveSpec(f, spec);
    if (!r || !r.startsWith(resolve(ROOT))) continue;
    if (r.endsWith(".json")) { if (!reachedJson.has(r)) reachedJson.set(r, f); continue; }
    if (!reached.has(r)) queue.push(r);
  }
}
/* TWO RINGS, because the first run (2026-09-24) found the country profile's
   46 fields all "read": `src/lib/economic_profile/index.ts`, which the spine
   reaches, names every field to type and map them, so a reach test alone says
   nothing. The inner ring is the spine's own folders, the builders that name a
   field to use it; the outer ring is what they import, where a field can be
   named without reaching a page (or reach one under another name, through an
   accessor that renames it, which is why the outer ring is printed and not
   dropped). */
const SPINE_OWN = roots.map((f) => readFileSync(f, "utf8")).join("\n");
const rootSet = new Set(roots);
const BELOW = [...reached].filter((f) => !rootSet.has(f)).map((f) => ({ f, t: readFileSync(f, "utf8") }));
const ALL_SRC = walk(join(ROOT, "src")).map((f) => ({ f, t: readFileSync(f, "utf8") }));
const OFF = ALL_SRC.filter((s) => !reached.has(s.f));

/* The files: the named ones, or the two folders. */
const files = named.length
  ? named.map((n) => resolve(n))
  : ["economic_indicators", "economics"].flatMap((d) => readdirSync(join(ROOT, "data", d)).filter((n) => n.endsWith(".json")).map((n) => resolve(ROOT, "data", d, n)));

/* A file's rows: the largest collection of objects it holds, an array or a map keyed by id, found at any depth. */
function rowsOf(node) {
  let best = [];
  (function visit(v) {
    if (Array.isArray(v)) {
      const objs = v.filter((x) => x && typeof x === "object" && !Array.isArray(x));
      if (objs.length > best.length) best = objs;
      for (const x of v) if (x && typeof x === "object") visit(x);
    } else if (v && typeof v === "object") {
      const vals = Object.values(v);
      const objs = vals.filter((x) => x && typeof x === "object" && !Array.isArray(x));
      if (objs.length >= 5 && objs.length === vals.length && objs.length > best.length) best = objs;
      for (const x of vals) if (x && typeof x === "object") visit(x);
    }
  })(node);
  return best;
}
const heldValue = (v) => (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && v.trim() !== "") || typeof v === "boolean";

let unreadTotal = 0;
for (const file of files) {
  const name = rel(file);
  let json;
  try { json = JSON.parse(readFileSync(file, "utf8")); } catch { console.log(`\n${name}: not JSON, skipped`); continue; }
  const rows = rowsOf(json);
  const importer = reachedJson.get(file);
  const byPath = !importer && (SPINE_OWN.includes(basename(file)) || BELOW.some((s) => s.t.includes(basename(file)))) ? "named by path" : null;
  const reach = importer ? `imported by the spine (${rel(importer)})` : byPath ? "named by path in the spine's modules" : "NOT imported by any module the spine reaches";
  if (!rows.length) { console.log(`\n${name}: no rows of objects; ${reach}`); continue; }
  const held = new Map();
  for (const r of rows) for (const [k, v] of Object.entries(r)) if (heldValue(v)) held.set(k, (held.get(k) ?? 0) + 1);
  const lines = [];
  let unread = 0;
  const list = (set, k) => { const hits = set.filter((s) => s.t.includes(k)).map((s) => rel(s.f)); return hits.length ? `${hits.slice(0, 3).join(", ")}${hits.length > 3 ? ` (+${hits.length - 3})` : ""}` : ""; };
  for (const [k, n] of [...held.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    const own = SPINE_OWN.includes(k);
    if (own && !SHOW_ALL) continue;
    if (!own) unread++;
    const below = own ? "" : list(BELOW, k);
    const off = own ? "" : list(OFF, k);
    const where = own ? "named by a spine builder"
      : below ? `named below the spine: ${below}${off ? `; off it: ${off}` : ""}`
      : off ? `named off the spine: ${off}`
      : "named nowhere in src";
    lines.push(`  ${own ? "  " : "- "}${k.padEnd(40)} ${String(n).padStart(4)} of ${rows.length}  ${where}`);
  }
  unreadTotal += unread;
  console.log(`\n${name}: ${rows.length} rows, ${held.size} fields, ${unread} no spine builder names; ${reach}`);
  for (const l of lines) console.log(l);
}
console.log(`\nspine_unread_fields: ${files.length} file(s), ${unreadTotal} field(s) no spine builder names (${roots.length} builders in src/lib/spine and src/components/spine, ${reached.size} modules they reach). A candidate to open, never a finding: the header's blind spots.`);
