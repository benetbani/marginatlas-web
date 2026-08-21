/**
 * scripts/audit_render_graph.ts , what actually renders, and what does not.
 *
 * WHY A GRAPH AND NOT A GREP. Searching for a component's name finds its own
 * definition, every comment that mentions it, and every doc that discusses it.
 * This project has been bitten by exactly that: a naive grep once counted a
 * sweep's own EXPLANATORY COMMENTS as both conversions and defects, reporting
 * 112 uses against 41 when the real numbers were 83 and 103.
 *
 * So: parse imports, build a directed graph, and walk it from the routes a
 * reader can actually reach. Anything the walk never touches renders nowhere,
 * whatever any grep says about it.
 *
 * THREE VERDICTS, and the middle one is the interesting one:
 *
 *   READER    reachable from a route a reader can load
 *   WORKSHOP  reachable ONLY from src/app/dev or src/app/_design
 *             `_design` is a Next PRIVATE FOLDER and therefore has NO URL AT
 *             ALL, so anything reachable only from there renders for nobody,
 *             ever, including the person who wrote it
 *   ORPHAN    reached by nothing
 *
 * WHAT THIS CANNOT SEE, stated before its numbers get quoted:
 *   - dynamic imports built from a variable (`import(base + name)`). It reads
 *     static specifiers only.
 *   - a component rendered through a registry keyed by string.
 *   - whether a reachable component is behind an off feature flag. Reachable is
 *     not the same as rendered.
 *   So it can prove a component is UNREACHABLE. It cannot prove one is USED.
 *   That asymmetry is why deleting from this list is safe and trusting it as a
 *   usage census is not.
 *
 * Run: npx tsx scripts/audit_render_graph.ts [--json]
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, relative, sep, dirname, resolve } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const SRC = "src";
const EXT = [".ts", ".tsx"];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.includes(extname(p))) out.push(rel(p));
  }
  return out;
}
const rel = (p: string) => relative(process.cwd(), p).split(sep).join("/");

const files = walk(SRC);
const fileSet = new Set(files);

/** Resolve an import specifier to a file in this repo, or null if external. */
function resolveSpec(fromFile: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = join(dirname(fromFile), spec);
  else return null; // node_modules

  base = relative(process.cwd(), resolve(base)).split(sep).join("/");

  for (const cand of [
    base,
    ...EXT.map((e) => base + e),
    ...EXT.map((e) => `${base}/index${e}`),
  ]) {
    if (fileSet.has(cand)) return cand;
  }
  return null;
}

/* Static specifiers only. A template-literal import is invisible here and that
   is recorded as a blind spot rather than papered over. */
const IMPORT_RE = /(?:^|\s)(?:import|export)[\s\S]*?from\s*["']([^"']+)["']/g;
const BARE_IMPORT_RE = /(?:^|\s)import\s*["']([^"']+)["']/g;
const DYNAMIC_RE = /import\(\s*["']([^"']+)["']\s*\)/g;

const edges = new Map<string, Set<string>>();
let dynamicWithVariable = 0;

for (const f of files) {
  const code = stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
  const targets = new Set<string>();
  for (const re of [IMPORT_RE, BARE_IMPORT_RE, DYNAMIC_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      const t = resolveSpec(f, m[1]);
      if (t) targets.add(t);
    }
  }
  /* Count the ones we cannot follow, so the blind spot has a number. */
  if (/import\(\s*[^"')]/.test(code)) dynamicWithVariable++;
  edges.set(f, targets);
}

/** Route roots. Next App Router: page/layout/template/error/not-found/route. */
const ROOT_RE = /^src\/app\/.*\/(page|layout|template|error|not-found|loading|route|default)\.tsx?$/;
const isRoot = (f: string) => ROOT_RE.test(f) || /^src\/app\/(page|layout|not-found|error|global-error|sitemap|robots)\.tsx?$/.test(f);
const isWorkshopRoot = (f: string) => f.startsWith("src/app/dev/") || f.includes("/_design/");

const roots = files.filter(isRoot);
const readerRoots = roots.filter((f) => !isWorkshopRoot(f));
const workshopRoots = roots.filter(isWorkshopRoot);

/* Middleware and instrumentation are real entry points too. */
for (const extra of ["src/middleware.ts", "src/instrumentation.ts"]) {
  if (fileSet.has(extra)) readerRoots.push(extra);
}

function reachFrom(starts: string[]): Set<string> {
  const seen = new Set<string>();
  const stack = [...starts];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    for (const t of edges.get(f) ?? []) if (!seen.has(t)) stack.push(t);
  }
  return seen;
}

const reader = reachFrom(readerRoots);
const workshop = reachFrom(workshopRoots);

const components = files.filter((f) => f.startsWith("src/components/"));
const readerOnly: string[] = [];
const workshopOnly: string[] = [];
const orphan: string[] = [];

for (const c of components) {
  if (reader.has(c)) readerOnly.push(c);
  else if (workshop.has(c)) workshopOnly.push(c);
  else orphan.push(c);
}

console.log(`\n  ROUTES        ${roots.length}  (${readerRoots.length} reader, ${workshopRoots.length} workshop)`);
console.log(`  COMPONENTS    ${components.length}\n`);
console.log(`  reachable by a reader        ${String(readerOnly.length).padStart(4)}`);
console.log(`  ONLY from the workshop       ${String(workshopOnly.length).padStart(4)}   (src/app/dev, and _design which has NO URL)`);
console.log(`  ORPHAN, reached by nothing   ${String(orphan.length).padStart(4)}\n`);

if (dynamicWithVariable) {
  console.log(`  !! ${dynamicWithVariable} file(s) contain a dynamic import this cannot follow. Treat the orphan list as a CANDIDATE list.\n`);
}

const show = (title: string, list: string[]) => {
  if (!list.length) return;
  console.log(`  ${title}`);
  list.sort().forEach((f) => console.log(`      ${f}`));
  console.log("");
};

show("ORPHAN , reached by nothing:", orphan);
show("WORKSHOP ONLY , renders for no reader:", workshopOnly);

/* GATE MODE. Orphans are now zero and this keeps them there. It does NOT fail
   on workshop-only components: 43 of those exist and several are the shadcn
   primitives the migration is about to start using, so failing on them would
   fight the plan. Only "reached by nothing at all" is an error.

   Blind spot restated, because this now blocks a build: it reads STATIC import
   specifiers. A component reached through a string registry looks orphaned to
   it. Two such files were found on 2026-08-21 (verify_deepening required them
   by path) and the fix was to correct the stale registry, not to weaken this. */
if (process.argv.includes("--gate")) {
  if (orphan.length) {
    console.log(`  FAIL  ${orphan.length} component(s) reached by nothing.`);
    console.log("        Delete them, or wire them up. If one is reached through a");
    console.log("        string registry rather than an import, say so where the");
    console.log("        registry lives, because this gate cannot see that.");
    process.exit(1);
  }
  console.log("  PASS  every component is reachable");
  process.exit(0);
}

if (process.argv.includes("--json")) {
  writeFileSync(
    "data/audit/render_graph.json",
    JSON.stringify({ generatedFrom: "scripts/audit_render_graph.ts", counts: { components: components.length, reader: readerOnly.length, workshopOnly: workshopOnly.length, orphan: orphan.length }, orphan: orphan.sort(), workshopOnly: workshopOnly.sort() }, null, 2) + "\n",
  );
  console.log("  wrote data/audit/render_graph.json\n");
}
