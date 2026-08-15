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
import { COUNTRIES } from "../../src/lib/taxonomy";

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
    /* Route groups are STRIPPED, not skipped. This used to `continue` on any
       directory inside a (group), which threw away a pattern for every single
       route under src/app/(site): /pricing, /faq, /compare, /methodology and
       the rest contributed nothing to this list.

       Nothing looked broken, because the [country] and [country]/[geo]
       wildcards match any one- or two-segment path, so those routes still
       "existed" as far as pathExists was concerned. They were being validated
       by the wildcard rather than by themselves, which is the same reason a
       genuinely dead two-segment link could never be detected.

       buildStaticTopLevel below already strips groups. The two disagreed. */
    const hasPage =
      existsSync(join(dir, "page.tsx")) ||
      existsSync(join(dir, "page.ts")) ||
      existsSync(join(dir, "route.ts")) ||
      existsSync(join(dir, "route.tsx"));
    if (!hasPage) continue;
    const relDir = relative(APP, dir).replace(/\\/g, "/");
    if (!relDir) continue;
    const parts = relDir
      .split("/")
      // A (group) is organisational and never appears in the URL.
      .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
      .map((seg) => {
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

/**
 * THE SINGLE-SEGMENT HOLE. Found 2026-07-30, closed here.
 *
 * `src/app/[country]/page.tsx` yields the pattern `^/([^/]+)$`, and that
 * matches EVERY top-level path in existence. So `pathExists("/api")` returned
 * true, and so would `/anything`. For as long as the country route has existed
 * this gate has been structurally unable to detect a dead top-level link, and
 * it reported PASS the whole time.
 *
 * It was not hypothetical. Two were live: `/api`, in the footer of every page,
 * and `/about`, on the benchmarks download page. Both render "Country not
 * found" and both answer 200 rather than 404, so they are soft 404s linked from
 * real pages.
 *
 * The fix: a LITERAL single-segment href must match a STATIC route. A link
 * written out by hand as `/api` is a site section, not a country; country links
 * are built from data and this gate already skips template literals. The set
 * below is the escape hatch for the rare hand-written link to a real dynamic
 * value, and it is deliberately tiny so that adding to it is a decision.
 */
function buildStaticTopLevel(): Set<string> {
  const segs = new Set<string>();
  for (const dir of walkDirs(APP)) {
    const rel = relative(APP, dir).replace(/\\/g, "/");
    // Route groups do not appear in the URL, so `(site)/pricing` is top level.
    const parts = rel.split("/").filter((p) => !(p.startsWith("(") && p.endsWith(")")));
    if (parts.length !== 1) continue;
    const name = parts[0];
    if (name.startsWith("[") || name.startsWith("_") || name.startsWith("@")) continue;
    const hasRoute =
      existsSync(join(dir, "page.tsx")) ||
      existsSync(join(dir, "page.ts")) ||
      existsSync(join(dir, "route.ts")) ||
      existsSync(join(dir, "route.tsx"));
    if (hasRoute) segs.add(name);
  }
  return segs;
}

/**
 * Every top-level directory name under src/app, route groups flattened,
 * whether or not it has a page of its own.
 *
 * Deliberately laxer than buildStaticTopLevel: this only asks "is /<seg> a real
 * section of this app", so /dev/spine-city is recognised even though src/app/dev
 * has no page.tsx. Whether the specific deeper path exists is then pathExists's
 * job, which is where /dev/compare gets caught.
 */
function buildAppTopLevelDirs(): Set<string> {
  const out = new Set<string>();
  for (const dir of walkDirs(APP)) {
    const rel = relative(APP, dir).replace(/\\/g, "/");
    const parts = rel.split("/").filter((p) => !(p.startsWith("(") && p.endsWith(")")));
    if (parts.length !== 1) continue;
    const name = parts[0];
    if (name.startsWith("[") || name.startsWith("@")) continue;
    out.add(name.toLowerCase());
  }
  return out;
}

/**
 * Lowercased country codes, the legitimate first segment of a hand-written
 * /gb/london/restaurants. Read from the taxonomy so it can never drift.
 */
const COUNTRY_SEGMENTS = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));

/** Hand-written links to a real value of a dynamic segment. Keep this small. */
const KNOWN_DYNAMIC_LITERALS = new Set([
  "/ke", // Kenya, used as a worked example on the /dev/cell scratch route.
]);

// /account left this set 2026-06-08: Milestone 1 makes it a real route (server
// wrapper + saved cells), so links to it are valid. The rest stay blocked until
// their routes are built.
const KNOWN_DEFERRED = new Set([
  "/sign-up",
  "/sign-in",
  "/login",
  "/logout",
  "/dashboard",
]);

function findDeadLinks(): Dead[] {
  const patterns = buildRoutePatterns();
  const staticTop = buildStaticTopLevel();
  const appTopLevelDirs = buildAppTopLevelDirs();
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
        const bare = href.split(/[?#]/)[0];
        const segs = bare.split("/").filter(Boolean);
        // Must be tested BEFORE pathExists, which the [country] wildcard
        // makes return true for every single-segment path.
        const swallowedByWildcard =
          segs.length === 1 && !staticTop.has(segs[0]) && !KNOWN_DYNAMIC_LITERALS.has(bare);
        /* THE SAME HOLE AT DEPTH TWO AND THREE, closed 2026-08-09.
           The comment above says the single-segment hole was found and fixed.
           It was, at depth one only, and the identical hole sat open one level
           down for exactly as long. `[country]/[geo]` yields ^/([^/]+)/([^/]+)$
           and matches EVERY two-segment path, so a literal like /billing/invoices
           resolved and this gate reported PASS. Verified by injecting
           /definitely/not-a-route and /definitely/not/a-route: both passed.

           Two live ones were sitting behind it, /billing/card and
           /billing/invoices, on the account page.

           What separates a real link from a swallowed one is the FIRST segment.
           /gb/london/restaurants is a hand-written country path and legitimate.
           /billing/invoices names a site section that does not exist. So a deep
           literal is dead when its first segment is neither a real directory in
           src/app nor a country code. Both lists are derived, so neither needs
           maintaining. */
        const head = segs[0]?.toLowerCase() ?? "";
        const deepSwallowed =
          segs.length >= 2 &&
          segs.length <= 3 &&
          !appTopLevelDirs.has(head) &&
          !COUNTRY_SEGMENTS.has(head) &&
          !KNOWN_DYNAMIC_LITERALS.has(bare);
        const reason = KNOWN_DEFERRED.has(bare)
          ? "deferred-route (auth not built)"
          : swallowedByWildcard
          ? "single-segment link with no static route; only the [country] wildcard matched it, so it renders 'Country not found' at 200"
          : deepSwallowed
          ? `no /${head} section in src/app and "${head}" is not a country code; only the [country]/[geo] wildcard matched it`
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
