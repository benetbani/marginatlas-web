/**
 * NO ADDRESS IS REDIRECTED OR RETIRED BEFORE THE INVENTORY (his URL rule as restated on 2026-10-09: "never change the address of a
 * page that keeps its content; retire an address only by a permanent redirect to the page that now holds its content, or by a 404
 * when nothing does"; and his ruling that every redirect and every other 404 waits for the inventory of his Search Console
 * exports). The page architecture's dispositions gate (section 5), as the guard Phase 1 needs: while data/seo/inventory.json does
 * not exist, no disposition table may exist and the places the site redirects from stay the ones of 2026-10-09 (main 22df8098 and
 * this branch). P1-A's new 404s are the edge's (src/lib/routing/edge_not_found.ts) and redirect nothing.
 *
 * WHAT IT CANNOT SEE: a redirect written outside the places it reads (the middleware's redirect calls, next.config.js's redirects,
 * the blog's two redirect lists and the routes of src/app that call redirect or permanentRedirect). The after-inventory checks (one
 * hop to a 200, dated and kept 365 days, no inventory address at 404, no internal link to a redirect or a 404) are not written
 * yet; the day the inventory arrives this gate fails until they are.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/routing/dispositions.test.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "dispositions";
const REMEDY = "Give the address its line in src/lib/routing/dispositions.ts, or wait for the inventory";
const INVENTORY = "data/seo/inventory.json";
const TABLE = "src/lib/routing/dispositions.ts";
let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");

/** Where the site redirects on 2026-10-09. Equal, not at most: a redirect removed retires an address too. */
const MIDDLEWARE_REDIRECTS = 8;
const CONFIG_SOURCES = ["/cities/:slug/curiosities", "/download/2026-benchmarks"];
const BLOG_LISTS: Record<string, number> = { "data/blog/retired_posts.json": 58, "data/blog/moved_posts.json": 2 };
const ROUTE_FILES = [
  "src/app/(site)/account/page.tsx",
  "src/app/(site)/browse/page.tsx",
  "src/app/(site)/decide/go/route.ts",
  "src/app/[country]/[geo]/page.tsx",
  "src/app/api/contact/route.ts",
  "src/app/api/go/route.ts",
  "src/app/auth/callback/route.ts",
  "src/app/auth/signout/route.ts",
  "src/app/random/route.ts",
];

if (existsSync(INVENTORY)) {
  check(
    `${INVENTORY} exists: write the after-inventory checks of this gate (one hop to a 200, dated, kept 365 days, no inventory address at 404, no internal link to a redirect or a 404) before any disposition`,
    false,
    "tests/routing/dispositions.test.ts",
    "Write the after-inventory checks in tests/routing/dispositions.test.ts (the spec's section 5), then give each address its line in src/lib/routing/dispositions.ts",
  );
} else {
  check(`no disposition table before the inventory (${TABLE} does not exist)`, !existsSync(TABLE), TABLE);
  const mw = (code("src/middleware.ts").match(/NextResponse\.redirect\(/g) ?? []).length;
  check(`the middleware redirects from the same ${MIDDLEWARE_REDIRECTS} places (counted ${mw})`, mw === MIDDLEWARE_REDIRECTS, "src/middleware.ts");
  const cfg = readFileSync("next.config.js", "utf8");
  const at = cfg.indexOf("async redirects()");
  const sources = at < 0 ? [] : [...cfg.slice(at).matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);
  check(`next.config.js redirects the same literal sources (${sources.join(", ")})`, JSON.stringify(sources) === JSON.stringify(CONFIG_SOURCES), "next.config.js");
  for (const [file, n] of Object.entries(BLOG_LISTS)) {
    const count = Object.keys((JSON.parse(readFileSync(file, "utf8")) as { posts: Record<string, unknown> }).posts).length;
    check(`${file} redirects the same ${n} posts (counted ${count})`, count === n, file);
  }
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((n) => {
      const p = `${d}/${n}`;
      return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
    });
  const routes = walk("src/app").filter((f) => !f.startsWith("src/app/dev/") && /\b(?:permanentRedirect|redirect)\s*\(/.test(code(f))).sort();
  const added = routes.filter((f) => !ROUTE_FILES.includes(f));
  const removed = ROUTE_FILES.filter((f) => !routes.includes(f));
  check(
    `the routes that redirect are the same ${ROUTE_FILES.length}${added.length ? `; new: ${added.join(", ")}` : ""}${removed.length ? `; gone: ${removed.join(", ")}` : ""}`,
    added.length === 0 && removed.length === 0,
    "src/app",
  );
  console.log("dispositions: 4 deferred (data/seo/inventory.json does not exist yet: one hop to a 200, dated and kept 365 days, no inventory address at 404, no internal link to a redirect or a 404)");
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("routing/dispositions: all pass");
