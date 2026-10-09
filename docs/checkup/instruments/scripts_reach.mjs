// Read-only (checkup 2026-10-08): which files under scripts/ and tests/ are reached from something that runs.
// Entries: every script the chain's GATES array names (scripts/prebuild_all.ts), every file a package.json script names,
// scripts/prebuild_all.ts itself. Edges: static imports/requires (relative, @/), plus any "scripts/..." or "tests/..." path
// literal inside a reached file (a spawned script). BLIND SPOT: a script run only by hand from a document (a runbook line) is
// "unreached" here; each unreached file is a candidate, never a verdict, until its history and the docs are read.
// usage (cwd = E:/atlas/website): node <this file> > out.txt
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
const ROOT = process.cwd();
const rel = (p) => relative(ROOT, p).split(sep).join("/");
const SKIP = new Set(["node_modules", ".next", ".git", "scratchpad", "_archive"]);
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|cjs|py|sh)$/.test(name)) out.push(rel(p));
  }
  return out;
}
const all = [...walk(join(ROOT, "scripts")), ...walk(join(ROOT, "tests"))];
const allSet = new Set(all);
const runner = readFileSync("scripts/prebuild_all.ts", "utf8");
const gateScripts = [...runner.matchAll(/script:\s*"([^"]+)"/g)].map((m) => m[1]);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const pkgFiles = [];
for (const v of Object.values(pkg.scripts)) for (const m of String(v).matchAll(/((?:scripts|tests)\/[\w./-]+\.(?:tsx?|mjs|cjs|js|py))/g)) pkgFiles.push(m[1]);
const entries = new Set(["scripts/prebuild_all.ts", ...gateScripts, ...pkgFiles].filter((f) => allSet.has(f)));
const IMPORT = /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
const PATHLIT = /["'`]((?:scripts|tests)\/[\w./-]+\.(?:tsx?|mjs|cjs|js|py|sh))["'`]/g;
const EXT = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
function resolveSpec(from, spec) {
  let base;
  if (spec.startsWith(".")) base = resolve(dirname(join(ROOT, from)), spec);
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return rel(base);
  for (const e of EXT) if (existsSync(base + e)) return rel(base + e);
  for (const e of EXT) if (existsSync(join(base, "index" + e))) return rel(join(base, "index" + e));
  return null;
}
const seen = new Set();
const stack = [...entries];
while (stack.length) {
  const f = stack.pop();
  if (seen.has(f)) continue;
  seen.add(f);
  let t = "";
  try { t = readFileSync(f, "utf8"); } catch { continue; }
  for (const m of t.matchAll(IMPORT)) { const r = resolveSpec(f, m[1] ?? m[2] ?? m[3]); if (r && allSet.has(r) && !seen.has(r)) stack.push(r); }
  for (const m of t.matchAll(PATHLIT)) if (allSet.has(m[1]) && !seen.has(m[1])) stack.push(m[1]);
}
const unreached = all.filter((f) => !seen.has(f));
const lines = (f) => { try { return readFileSync(f, "utf8").split("\n").length; } catch { return 0; } };
const byDir = {};
for (const f of unreached) { const d = f.split("/").slice(0, 2).join("/"); byDir[d] = (byDir[d] ?? 0) + 1; }
console.log(`scripts+tests files: ${all.length}; entries ${entries.size} (gates ${gateScripts.length}, package.json ${pkgFiles.length}); reached ${seen.size}; unreached ${unreached.length} (${unreached.reduce((a, f) => a + lines(f), 0)} lines)`);
console.log("unreached by folder:", Object.entries(byDir).sort((a, b) => b[1] - a[1]).map(([d, n]) => `${d} ${n}`).join("; "));
console.log("\nUNREACHED:");
for (const f of unreached.sort()) console.log(`${String(lines(f)).padStart(5)} ${f}`);
