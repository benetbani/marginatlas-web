/**
 * scripts/verify_page_metadata.ts
 *
 * EVERY SHIPPING ROUTE STATES ITS OWN TITLE.
 *
 * The whole product is a search surface. 615 prerendered pages exist so that
 * somebody typing "how much does a coffee shop in Lisbon make" lands on the
 * page that answers it. A route that declares no metadata has no title of its
 * own and no description of its own, which means the one lever that decides
 * whether a search result gets clicked is left at whatever the layer above
 * happened to set.
 *
 * WHAT ACTUALLY HAPPENS, which is worse than being untitled. Next resolves
 * metadata down the segment tree and merges it per top-level KEY, so a page
 * with no `metadata` export does not render blank: it inherits the root layout
 * in src/app/layout.tsx, title and description and `alternates.canonical: "/"`
 * together. Four distinct pages then present themselves to a crawler under one
 * title and one canonical URL. Nothing errors, nothing looks broken in a
 * browser, and the pages quietly do not compete for anything.
 *
 * THE MEASUREMENT that produced this gate, 2026-08-04: 101 page.tsx routes
 * exist, 73 export `metadata` or `generateMetadata`, 28 export neither. Of
 * those 28, 24 are correctly silent and are exempted below. Four are shipping
 * pages a reader can reach, and one of them is the home page.
 *
 * EXEMPTIONS, because a missing title is the right answer there:
 *
 *   1. /dev, /admin and /_design. These are workbenches and operator tools.
 *      They should not be indexed at all, so a search title for them is not a
 *      thing that was forgotten, it is a thing that would be wrong.
 *
 *   2. Any route whose own file sets `robots: { index: false }`. A page that
 *      has already said "do not list me" has answered the question this gate
 *      asks. Most such files also carry a title, which is fine; the exemption
 *      exists so a future noindex route does not have to invent SEO copy for
 *      a page no search engine will ever render.
 *
 * The check is on EXISTENCE, not on quality. Whether a title is good is a
 * judgement, and a gate that tried to make it would be argued with and then
 * ignored. Whether a title exists is a fact, and this holds that fact.
 *
 * Usage: npx tsx scripts/verify_page_metadata.ts
 * Exit 0 = pass, exit 1 = at least one non-exempt route declares no metadata.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = resolve(ROOT, "src/app");

/**
 * Routes that declared no metadata on the day this gate was written. They were
 * carried so the chain stayed green while they were repaired one at a time, and
 * every one of them was a real defect rather than an accepted exception.
 *
 * EMPTY as of 2026-08-06. All four are repaired: "/" and "/browse" state a
 * title, a description, and their own canonical ("/browse" points at /world,
 * where its 308 lands); "/account" and "/signin" are private surfaces and take
 * `robots: { index: false }` with the inherited canonical cleared, which is the
 * correct answer for a page that is not a search result at all. /signin needed
 * a server component to hold the export, since a "use client" module may not
 * declare metadata.
 *
 * This list shrinks and never grows. A new route may not be added here. Now
 * that it is empty, a route arriving without metadata is simply a fail.
 */
const ALLOWLIST = new Set<string>([]);

/** Route prefixes that are not search surfaces. Matched on whole segments, so
 *  /dev covers /dev/spine but never a route named /development. */
const EXEMPT_PREFIXES = ["/dev", "/admin", "/_design"];

/** The three shapes this codebase actually uses, plus the re-export form,
 *  which nothing uses today but which would otherwise read as a miss. */
const DECLARES_METADATA = [
  /\bexport\s+(?:const|let|var)\s+metadata\b/,
  /\bexport\s+(?:async\s+)?function\s+generateMetadata\b/,
  /\bexport\s*\{[^}]*\b(?:metadata|generateMetadata)\b[^}]*\}/,
];

/** A file that has already opted out of being listed. Whitespace is loose
 *  because the declaration is formatted both on one line and across several. */
const NOINDEX = /robots\s*:\s*\{[^}]*index\s*:\s*false/;

/** Strip comments so a file that merely discusses metadata does not count as
 *  declaring it. Same reasoning, and the same helper, as
 *  verify_no_parent_repo_reads.ts. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

function walk(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p, out);
    } else if (e.name === "page.tsx") {
      out.push(p);
    }
  }
  return out;
}

/**
 * File path to the URL the reader sees. Route groups, `(site)` and friends,
 * are organisational and contribute no segment. Dynamic segments are kept as
 * written, since `[country]` is the honest name of that route.
 */
function routeOf(file: string): string {
  const rel = relative(APP_DIR, file).replace(/\\/g, "/");
  const segments = rel
    .replace(/\/?page\.tsx$/, "")
    .split("/")
    .filter((s) => s.length > 0 && !/^\(.*\)$/.test(s));
  return "/" + segments.join("/");
}

function isExempt(route: string): boolean {
  return EXEMPT_PREFIXES.some((p) => route === p || route.startsWith(p + "/"));
}

type Miss = { route: string; file: string };

const files = walk(APP_DIR).sort();
const missing: Miss[] = [];
let exemptCount = 0;
let noindexCount = 0;

for (const file of files) {
  const route = routeOf(file);
  const raw = readFileSync(file, "utf8");
  const code = stripComments(raw);

  if (DECLARES_METADATA.some((re) => re.test(code))) continue;

  if (isExempt(route)) {
    exemptCount++;
    continue;
  }
  if (NOINDEX.test(code)) {
    noindexCount++;
    continue;
  }
  missing.push({ route, file: relative(ROOT, file).replace(/\\/g, "/") });
}

const carried = missing.filter((m) => ALLOWLIST.has(m.route));
const newMisses = missing.filter((m) => !ALLOWLIST.has(m.route));
const repaired = [...ALLOWLIST].filter((r) => !missing.some((m) => m.route === r)).sort();

console.log("=== verify_page_metadata ===");
console.log(`  Routes scanned: ${files.length}`);
console.log(`  Declare metadata or generateMetadata: ${files.length - missing.length - exemptCount - noindexCount}`);
console.log(`  Exempt (dev, admin, _design): ${exemptCount}`);
console.log(`  Exempt (robots index false): ${noindexCount}`);
console.log(`  Missing, carried on the allowlist: ${carried.length}`);
console.log(`  Missing, new: ${newMisses.length}`);

if (repaired.length > 0) {
  console.log("");
  console.log(`  ${repaired.length} allowlist entr(ies) now declare metadata. Delete them from`);
  console.log("  ALLOWLIST in this file so the list keeps shrinking:");
  for (const r of repaired) console.log(`  - ${r}`);
}

if (carried.length > 0) {
  console.log("");
  console.log("  Still untitled (allowlisted, awaiting repair):");
  for (const m of carried) console.log(`  - ${m.route}   ${m.file}`);
}

if (newMisses.length > 0) {
  console.log("");
  console.log(`  ${newMisses.length} route(s) declare neither metadata nor generateMetadata:`);
  for (const m of newMisses) console.log(`  - ${m.route}   ${m.file}`);
  console.log("");
  console.log("  Fix: export a `metadata: Metadata` object, or an async");
  console.log("  `generateMetadata()` where the title depends on the params.");
  console.log("  A page with no title of its own inherits the root layout's,");
  console.log("  canonical URL included, and stops competing for anything.");
  console.log("  If the route should not be indexed, set robots index false.");
  console.log("");
  console.log(`  GATE: FAIL  (${newMisses.length} untitled route(s))`);
  process.exit(1);
}

console.log("");
console.log("  GATE: PASS");
