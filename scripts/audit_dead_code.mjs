/**
 * scripts/audit_dead_code.mjs , what nothing references.
 *
 * READ-ONLY. It deletes nothing and changes nothing. It produces the evidence a
 * removal decision needs, because "this looks unused" has been wrong on this
 * project seven times in three days: a social card route that already existed,
 * two related-links components that already existed, a component I called unused
 * that was rendered twice, a function I called exported that was private.
 *
 * WHAT COUNTS AS REFERENCED. A file is live if anything imports it, if it is a
 * Next.js route file (page/layout/route/not-found/error/sitemap/robots/icon), or
 * if it is named in a config or a script registry. Route files are entry points
 * and have no importers by design, so treating "no importer" as dead would
 * condemn every page on the site.
 *
 * WHAT THIS CANNOT SEE, stated so nobody trusts it further than it deserves:
 * dynamic imports built from a variable, anything referenced only from a string
 * at runtime, and anything reached through a barrel file it cannot resolve. So
 * its output is a CANDIDATE LIST for a human, never a delete list.
 *
 * Usage: node scripts/audit_dead_code.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, extname, relative, resolve, dirname } from "node:path";

const SRC = "src";
const EXT = [".ts", ".tsx"];
const ROUTE_FILES = new Set([
  "page.tsx", "layout.tsx", "route.ts", "route.tsx", "template.tsx",
  "not-found.tsx", "error.tsx", "global-error.tsx", "loading.tsx",
  "sitemap.ts", "robots.ts", "icon.tsx", "opengraph-image.tsx", "middleware.ts",
  "default.tsx",
  /* Framework convention files. Next loads these by NAME, so nothing imports
     them and "no importer" is not evidence of anything. Missing these was the
     tool's one real false positive on its first run. */
  "instrumentation.ts", "instrumentation-client.ts", "manifest.ts",
  "apple-icon.tsx", "twitter-image.tsx",
]);

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") walk(p, out); }
    else if (EXT.includes(extname(e.name))) out.push(p.replace(/\\/g, "/"));
  }
  return out;
}

const files = walk(SRC);
const bySpec = new Map(); // resolved path -> file

/** Resolve an import specifier to a file in src, or null. */
function resolveSpec(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null;
  base = base.replace(/\\/g, "/");
  const rel = base.startsWith(SRC) ? base : relative(process.cwd(), base).replace(/\\/g, "/");
  for (const c of [rel + ".ts", rel + ".tsx", rel + "/index.ts", rel + "/index.tsx", rel]) {
    if (files.includes(c)) return c;
  }
  return null;
}

const referencedBy = new Map(files.map((f) => [f, new Set()]));

for (const f of files) {
  const src = readFileSync(f, "utf8");
  const specs = [
    ...src.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g),
    ...src.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g),
  ].map((m) => m[1]);
  for (const s of specs) {
    const target = resolveSpec(s, f);
    if (target && target !== f) referencedBy.get(target)?.add(f);
  }
}

/** Config and registry files can name a path as a plain string. */
const registryText = ["scripts/prebuild_all.ts", "next.config.js", "next.config.mjs", "tailwind.config.ts", "package.json"]
  .map((p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } })
  .join("\n");

const isRoute = (f) => ROUTE_FILES.has(f.split("/").pop());
const namedInRegistry = (f) => registryText.includes(f.replace(/^src\//, "").replace(/\.(tsx?|mjs)$/, ""));

const orphans = files.filter(
  (f) => referencedBy.get(f).size === 0 && !isRoute(f) && !namedInRegistry(f),
);

/* Group so the output is a decision aid rather than a wall. */
const group = (f) =>
  f.startsWith("src/app/dev/") ? "dev route tree"
  : f.startsWith("src/app/_design") ? "design catalog"
  : f.startsWith("src/components/") ? "component"
  : f.startsWith("src/lib/") ? "lib"
  : f.startsWith("src/app/") ? "app"
  : "other";

const byGroup = {};
for (const f of orphans) (byGroup[group(f)] ??= []).push(f);

console.log(`audit_dead_code , READ ONLY, nothing changed.\n`);
console.log(`scanned ${files.length} files in src/`);
console.log(`nothing imports, and not a route or registry entry: ${orphans.length}\n`);

for (const [g, list] of Object.entries(byGroup).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`--- ${g} (${list.length}) ---`);
  for (const f of list.sort()) console.log(`  ${f}`);
  console.log();
}

/* Dev route trees are the other half of the question: a dev PAGE is a route, so
   it never shows as an orphan, but the whole tree may still be scaffolding. */
const devRoutes = files.filter((f) => /^src\/app\/dev\/.*\/page\.tsx$/.test(f));
console.log(`--- dev routes (${devRoutes.length}) , entry points, so never orphans ---`);
console.log(`  These are scaffolding by definition. Removal is a judgment about`);
console.log(`  whether each still earns its keep, not a reference question.\n`);
for (const f of devRoutes.sort()) console.log(`  ${f.replace("src/app", "").replace("/page.tsx", "")}`);
