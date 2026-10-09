/**
 * Reachability of every source file (checkup 2026-10-06): the import graph from the entry points Next serves, so a file is
 * called dead only when nothing a reader can reach imports it.
 *
 *   node docs/checkup/instruments/reach.mjs   writes scratchpad/_reach_out.json and prints the summary (kept with the ledgers since 2026-10-08)
 *
 * Entry points: every Next route file under src/app (page, layout, template, loading, error, not-found, global-error, default,
 * route, and the metadata files icon, apple-icon, opengraph-image, twitter-image, sitemap, robots, manifest), src/middleware.ts,
 * src/instrumentation*.ts and the root sentry configs. A route under src/app/dev or src/app/_design is a DEV entry (served or
 * private review surfaces); everything else is a PRODUCT entry. Scripts and tests are GATE entries.
 *
 * Imports parsed: `import ... from "x"`, `import "x"`, `export ... from "x"`, `import("x")`, `require("x")`; resolved for
 * relative paths and the `@/` alias to src/, with .ts .tsx .js .jsx .mjs .cjs .json and /index.* tried in that order.
 * BLIND SPOT: a module named only in a string that is not an import (a path built at runtime, a file read with fs) is not an
 * edge; such files are listed by the script as unreachable and must be checked by grep before anything is deleted.
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";

const ROOT = process.cwd();
const rel = (p) => relative(ROOT, p).split(sep).join("/");
const EXT = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];
const SKIP = new Set(["node_modules", ".next", ".git", "scratchpad", "scratch", "_archive", "design-assets"]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(name)) out.push(p);
  }
  return out;
}

const srcFiles = walk(join(ROOT, "src"));
const gateFiles = [...walk(join(ROOT, "scripts")), ...walk(join(ROOT, "tests"))];
const ROUTE_FILE = /^(page|layout|template|loading|error|not-found|global-error|default|route|icon|apple-icon|opengraph-image|twitter-image|sitemap|robots|manifest)\.(tsx?|jsx?)$/;
const entries = { product: [], dev: [] };
for (const f of srcFiles) {
  const r = rel(f);
  const base = r.split("/").pop();
  const isEntry = (r.startsWith("src/app/") && ROUTE_FILE.test(base)) || /^src\/(middleware|instrumentation(-client)?)\.(ts|js)$/.test(r);
  if (!isEntry) continue;
  (r.startsWith("src/app/dev/") || r.startsWith("src/app/_design/") ? entries.dev : entries.product).push(f);
}
for (const c of ["sentry.client.config.ts", "sentry.server.config.ts", "sentry.edge.config.ts"]) if (existsSync(join(ROOT, c))) entries.product.push(join(ROOT, c));

const IMPORT = /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
function resolveSpec(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = join(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const e of EXT) if (existsSync(base + e)) return base + e;
  for (const e of EXT) if (existsSync(join(base, "index" + e))) return join(base, "index" + e);
  return null;
}
const edges = new Map();
function importsOf(f) {
  if (edges.has(f)) return edges.get(f);
  const out = [];
  let text = "";
  try { text = readFileSync(f, "utf8"); } catch { edges.set(f, out); return out; }
  for (const m of text.matchAll(IMPORT)) {
    const spec = m[1] ?? m[2] ?? m[3];
    const r = resolveSpec(f, spec);
    if (r && /\.(tsx?|jsx?|mjs|cjs)$/.test(r)) out.push(r);
  }
  edges.set(f, out);
  return out;
}
function reach(starts) {
  const seen = new Set();
  const stack = [...starts];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    for (const n of importsOf(f)) if (!seen.has(n)) stack.push(n);
  }
  return seen;
}
const product = reach(entries.product);
const dev = reach(entries.dev);
const gates = reach(gateFiles);

const classes = { product: [], devOnly: [], gateOnly: [], unreachable: [] };
for (const f of srcFiles) {
  const r = rel(f);
  if (product.has(f)) classes.product.push(r);
  else if (dev.has(f)) classes.devOnly.push(r);
  else if (gates.has(f)) classes.gateOnly.push(r);
  else classes.unreachable.push(r);
}
const lines = (r) => { try { return readFileSync(join(ROOT, r), "utf8").split("\n").length; } catch { return 0; } };
const sumLines = (xs) => xs.reduce((a, r) => a + lines(r), 0);
const byDir = (xs) => {
  const m = {};
  for (const r of xs) { const d = r.split("/").slice(0, 3).join("/"); m[d] = (m[d] ?? 0) + 1; }
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};
const out = {
  generated: new Date().toISOString(),
  entries: { product: entries.product.length, dev: entries.dev.length },
  counts: Object.fromEntries(Object.entries(classes).map(([k, v]) => [k, { files: v.length, lines: sumLines(v) }])),
  byDir: Object.fromEntries(Object.entries(classes).map(([k, v]) => [k, byDir(v)])),
  files: classes,
};
writeFileSync("scratchpad/_reach_out.json", JSON.stringify(out, null, 1));
console.log(`entries: ${out.entries.product} product, ${out.entries.dev} dev`);
for (const [k, v] of Object.entries(out.counts)) console.log(`${k.padEnd(12)} ${String(v.files).padStart(5)} files ${String(v.lines).padStart(7)} lines`);
for (const k of ["devOnly", "gateOnly", "unreachable"]) console.log(`\n${k} by folder:`, out.byDir[k].slice(0, 14).map(([d, n]) => `${d} ${n}`).join("; "));

/* ---- appended: dev-only files a gate or test still imports, and gates that name /dev or a dev-only folder by path ---- */
const devTouchedByGates = classes.devOnly.filter((r) => gates.has(join(ROOT, r)));
writeFileSync("scratchpad/_reach_dev_gates.json", JSON.stringify(devTouchedByGates, null, 1));
console.log(`\ndev-only files a gate or test imports: ${devTouchedByGates.length}`);
for (const r of devTouchedByGates.slice(0, 40)) console.log("  " + r);
