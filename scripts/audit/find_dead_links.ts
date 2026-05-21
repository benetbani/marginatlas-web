/**
 * Plan v17 Phase 3.1 — static link validator.
 *
 * Walks src/ for every literal `href="/..."` and verifies the route
 * exists in src/app/. Catches typos and references to deferred routes
 * (/sign-up, /sign-in) without needing a live server.
 *
 * Routes are identified by walking src/app/ and finding every directory
 * with a page.tsx, route.ts, or route.tsx file. Dynamic segments like
 * [country], [industry] match any non-empty path segment.
 *
 * Output: data/audit/dead-links.json with one row per broken reference
 * (file:line, href value, why it's broken).
 *
 * Run: `npx tsx scripts/audit/find_dead_links.ts`
 *      `npx tsx scripts/audit/find_dead_links.ts --strict`  (exit 1 on any)
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const APP = resolve(SRC, "app");
const OUT_DIR = resolve(ROOT, "data", "audit");
const STRICT = process.argv.includes("--strict");

type Dead = {
  file: string;
  line: number;
  href: string;
  reason: string;
};

function walkDirs(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      acc.push(p);
      walkDirs(p, acc);
    }
  }
  return acc;
}

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walkFiles(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

/** Build the route pattern list from src/app/. Each pattern is a regex
 * that matches a URL path. Dynamic segments become wildcards. */
function buildRoutePatterns(): RegExp[] {
  const patterns: RegExp[] = [];
  patterns.push(/^\/$/); // root
  for (const dir of walkDirs(APP)) {
    // Skip routes hidden behind a parenthesis group (Next route groups)
    if (dir.split(/[\\/]/).some((seg) => seg.startsWith("(") && seg.endsWith(")"))) continue;
    const hasPage =
      existsSync(join(dir, "page.tsx")) ||
      existsSync(join(dir, "page.ts")) ||
      existsSync(join(dir, "route.ts")) ||
      existsSync(join(dir, "route.tsx"));
    if (!hasPage) continue;
    const relDir = relative(APP, dir).replace(/\\/g, "/");
    if (!relDir) continue;
    const parts = relDir.split("/").map((seg) => {
      if (seg.startsWith("[") && seg.endsWith("]")) {
        // Catch-all
        if (seg.startsWith("[...")) return "(.+)";
        return "([^/]+)";
      }
      return seg.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    });
    const pattern = "^/" + parts.join("/") + "$";
    patterns.push(new RegExp(pattern));
  }
  return patterns;
}

function pathExists(path: string, patterns: RegExp[]): boolean {
  // Strip query string + fragment
  const clean = path.split("#")[0].split("?")[0];
  // Trailing slash normalisation (middleware redirects these to no-slash)
  const canonical = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  for (const re of patterns) {
    if (re.test(canonical)) return true;
  }
  return false;
}

const KNOWN_DEFERRED = new Set([
  "/sign-up",
  "/sign-in",
  "/login",
  "/logout",
  "/account",
  "/dashboard",
]);

function findDeadLinks(): Dead[] {
  const patterns = buildRoutePatterns();
  const dead: Dead[] = [];
  const files = walkFiles(SRC).filter((f) => !f.includes(`${join("scripts", "audit")}`));
  const re = /href=["'](\/[^"']*)["']/g;
  for (const file of files) {
    const src = readFileSync(file, "utf-8");
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        const href = m[1];
        if (href.includes("${")) continue; // template literal handled elsewhere
        if (href.startsWith("/_next") || href.startsWith("/static") || href.startsWith("//")) continue;
        // Reject pure fragments / queries (no path)
        if (href === "/" || href.startsWith("/#") || href.startsWith("/?")) continue;
        const reason = KNOWN_DEFERRED.has(href.split(/[?#]/)[0])
          ? "deferred-route (auth not built)"
          : pathExists(href, patterns)
          ? ""
          : "no matching route in src/app/";
        if (reason) {
          dead.push({
            file: relative(ROOT, file).replace(/\\/g, "/"),
            line: i + 1,
            href,
            reason,
          });
        }
      }
    }
  }
  return dead;
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const dead = findDeadLinks();
  const outPath = join(OUT_DIR, "dead-links.json");
  writeFileSync(outPath, JSON.stringify(dead, null, 2));
  if (dead.length === 0) {
    console.log("✓ No dead href literals found.");
    return;
  }
  console.log(`✗ ${dead.length} dead href literal(s) found:`);
  const byReason = new Map<string, Dead[]>();
  for (const d of dead) {
    const arr = byReason.get(d.reason) || [];
    arr.push(d);
    byReason.set(d.reason, arr);
  }
  for (const [reason, list] of byReason) {
    console.log(`\n  ${reason} (${list.length}):`);
    for (const d of list.slice(0, 20)) {
      console.log(`    ${d.file}:${d.line}  →  ${d.href}`);
    }
    if (list.length > 20) console.log(`    … (${list.length - 20} more)`);
  }
  if (STRICT) process.exit(1);
}

main();
