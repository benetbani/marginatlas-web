/**
 * scripts/verify_canonical_urls.ts
 *
 * EVERY SHIPPING ROUTE NOMINATES ITS OWN CANONICAL URL.
 *
 * Sibling to verify_page_metadata.ts, and the second half of the same defect.
 * That gate holds the fact that a route states a title. This one holds the fact
 * that a route states which URL it IS.
 *
 * THE MECHANISM, which is the whole reason this can go wrong silently. Next
 * resolves metadata down the segment tree and merges it per top-level KEY, by
 * REPLACEMENT rather than by deep merge. A route that declares `metadata` or
 * `generateMetadata` and simply does not mention `alternates` does not fall back
 * to nothing: it inherits the root layout's `alternates` object whole. The root
 * layout at src/app/layout.tsx sets `canonical: "/"`, because the root layout IS
 * the home page's metadata. So every route that stays silent about `alternates`
 * emits, in its rendered HTML:
 *
 *     <link rel="canonical" href="https://www.marginatlas.com">
 *
 * which is a page telling a crawler, in the one tag built for exactly this
 * purpose, that it is the home page. The page renders perfectly. Its title is
 * right, its description is right, it typechecks, it passes every other gate. It
 * is simply not eligible to appear in a search result, because a canonical
 * pointing elsewhere is an instruction to index the other URL instead.
 *
 * THE MEASUREMENT that produced this gate, 2026-08-06: 49 shipping page.tsx
 * routes exist. 29 of them declared metadata and no `alternates`. Confirmed on
 * rendered output from the dev server, not inferred from source: /cities/london
 * and /pricing both served their own titles beside a canonical of
 * https://www.marginatlas.com, while /extremes, which declares its own
 * alternates, served the correct self-canonical. The 29 included every dynamic
 * route that generates the long tail: cities/[slug], [country]/[geo],
 * compare/cities/[pair], decide/[activity]/[city], blog/[slug], learn/[slug],
 * coverage/[iso2].
 *
 * WHAT THIS GATE CHECKS, both facts rather than judgements:
 *
 *   1. A route that declares metadata declares `alternates` too. Presence, not
 *      quality. Whether a canonical is the BEST url for a page is arguable and a
 *      gate that tried to settle it would be argued with and then ignored.
 *      Whether the route said anything at all is a fact.
 *
 *   2. No route other than "/" hard-codes `canonical: "/"`. This is the same
 *      defect written out by hand instead of inherited, and a presence-only
 *      check would wave it through.
 *
 * NOINDEX IS NOT AN EXEMPTION HERE, and that is deliberate. It is one in
 * verify_page_metadata, because a page nobody will list does not need search
 * copy. It is not one here, because a noindex page that stays silent about
 * `alternates` still emits the inherited "/" canonical, which is a page saying
 * do not list me while nominating the home page as its true self. Those are
 * contradictory instructions pointed at the most valuable URL on the domain.
 * The private surfaces answer this gate with `alternates: { canonical: null }`,
 * which clears the inherited value and resolves to no tag at all. See the
 * comment blocks in (site)/account, (site)/signin, (site)/saved, (site)/you and
 * embed/[country]/[geo]/[industry].
 *
 * EXEMPTIONS: /dev, /admin and /_design. Workbenches and operator tools, never
 * search surfaces, exactly as in verify_page_metadata.
 *
 * A route that declares NO metadata at all is not this gate's business. It is a
 * miss, and verify_page_metadata already fails it; counting it twice would put
 * one defect in two reports.
 *
 * WHAT THIS GATE DOES NOT SCAN, stated plainly so the boundary is known: only
 * page.tsx. Layouts, route handlers and not-found boundaries can also carry a
 * `metadata` export and inherit the same "/" canonical. One of them did.
 * src/app/not-found.tsx declared a title and no alternates, so every 404 on the
 * site served Next's automatic noindex beside a canonical pointing at the home
 * page. It is repaired in the same change as the 29 routes, and its own comment
 * carries the reasoning. If a second such file appears, widen the walk here.
 *
 * Usage: npx tsx scripts/verify_canonical_urls.ts
 * Exit 0 = pass, exit 1 = at least one non-exempt route leaves its canonical
 * inherited, or hard-codes the home page as its own.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = resolve(ROOT, "src/app");

/**
 * Routes that declared metadata and no `alternates` on the day this gate was
 * written. There are none. All 29 were repaired in the same change that
 * registered the gate: 18 static routes took a literal self-canonical, 8 dynamic
 * routes build one from their RESOLVED params inside generateMetadata (the shape
 * already used by (site)/industries/[industry] and [country]), and three private
 * or embedded surfaces took `canonical: null` beside a noindex.
 *
 * This list shrinks and never grows. A new route may not be added here. Since it
 * is empty, a route arriving without `alternates` is simply a fail.
 */
const ALLOWLIST = new Set<string>([]);

/** Route prefixes that are not search surfaces. Matched on whole segments, so
 *  /dev covers /dev/spine but never a route named /development. */
const EXEMPT_PREFIXES = ["/dev", "/admin", "/_design"];

/** The three shapes this codebase actually uses, plus the re-export form,
 *  which nothing uses today but which would otherwise read as a miss. Kept
 *  identical to verify_page_metadata so the two gates agree on what counts as
 *  declaring metadata. */
const DECLARES_METADATA = [
  /\bexport\s+(?:const|let|var)\s+metadata\b/,
  /\bexport\s+(?:async\s+)?function\s+generateMetadata\b/,
  /\bexport\s*\{[^}]*\b(?:metadata|generateMetadata)\b[^}]*\}/,
];

/** The `alternates` key as a metadata property. Whitespace is loose because it
 *  is written both inline and across several lines. */
const DECLARES_ALTERNATES = /\balternates\s*:/;

/** A canonical hard-coded to the site root. Correct on the home page and on
 *  nothing else. Matches both quote styles; a template literal that resolves to
 *  "/" at runtime is beyond a source scan and is not pretended otherwise. */
const CANONICAL_IS_ROOT = /\bcanonical\s*:\s*["']\/["']/;

/** Strip comments so a file that merely discusses canonicals does not count as
 *  setting one. Every repaired route in this change carries a comment naming
 *  `alternates`, so without this the gate would pass on prose. Same reasoning,
 *  and the same helper, as verify_page_metadata.ts. */
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
const claimsRoot: Miss[] = [];
let exemptCount = 0;
let noMetadataCount = 0;
let okCount = 0;

for (const file of files) {
  const route = routeOf(file);
  const raw = readFileSync(file, "utf8");
  const code = stripComments(raw);
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  if (isExempt(route)) {
    exemptCount++;
    continue;
  }
  // No metadata at all is verify_page_metadata's finding, not this one.
  if (!DECLARES_METADATA.some((re) => re.test(code))) {
    noMetadataCount++;
    continue;
  }
  if (!DECLARES_ALTERNATES.test(code)) {
    missing.push({ route, file: rel });
    continue;
  }
  // Declared, but declared the home page. Only "/" may say that about itself.
  if (route !== "/" && CANONICAL_IS_ROOT.test(code)) {
    claimsRoot.push({ route, file: rel });
    continue;
  }
  okCount++;
}

const carried = missing.filter((m) => ALLOWLIST.has(m.route));
const newMisses = missing.filter((m) => !ALLOWLIST.has(m.route));
const repaired = [...ALLOWLIST].filter((r) => !missing.some((m) => m.route === r)).sort();

console.log("=== verify_canonical_urls ===");
console.log(`  Routes scanned: ${files.length}`);
console.log(`  Declare metadata and their own canonical: ${okCount}`);
console.log(`  Exempt (dev, admin, _design): ${exemptCount}`);
console.log(`  No metadata at all (verify_page_metadata owns these): ${noMetadataCount}`);
console.log(`  Missing, carried on the allowlist: ${carried.length}`);
console.log(`  Missing, new: ${newMisses.length}`);
console.log(`  Hard-coded canonical "/" outside the home page: ${claimsRoot.length}`);

if (repaired.length > 0) {
  console.log("");
  console.log(`  ${repaired.length} allowlist entr(ies) now declare alternates. Delete them from`);
  console.log("  ALLOWLIST in this file so the list keeps shrinking:");
  for (const r of repaired) console.log(`  - ${r}`);
}

if (carried.length > 0) {
  console.log("");
  console.log("  Still inheriting the root canonical (allowlisted, awaiting repair):");
  for (const m of carried) console.log(`  - ${m.route}   ${m.file}`);
}

if (newMisses.length > 0) {
  console.log("");
  console.log(`  ${newMisses.length} route(s) declare metadata but no alternates:`);
  for (const m of newMisses) console.log(`  - ${m.route}   ${m.file}`);
  console.log("");
  console.log("  What this does: Next merges metadata per top-level KEY by");
  console.log("  replacement, so a route silent about alternates inherits the root");
  console.log("  layout's `canonical: \"/\"` and tells a crawler it IS the home page.");
  console.log("");
  console.log("  Fix, static route:  alternates: { canonical: \"/its/own/path\" }");
  console.log("  Fix, dynamic route: build the path from the RESOLVED params inside");
  console.log("  generateMetadata, so it matches the URL that actually rendered. See");
  console.log("  src/app/(site)/industries/[industry]/page.tsx and src/app/[country].");
  console.log("  Fix, private or embedded surface: robots index false beside");
  console.log("  alternates: { canonical: null }, which clears the inherited value.");
}

if (claimsRoot.length > 0) {
  console.log("");
  console.log(`  ${claimsRoot.length} route(s) hard-code the home page as their own canonical:`);
  for (const m of claimsRoot) console.log(`  - ${m.route}   ${m.file}`);
  console.log("");
  console.log("  Only \"/\" may name \"/\" as its canonical. Anywhere else this is the");
  console.log("  inherited defect written out by hand: the route asks to be dropped");
  console.log("  from the index in favour of the home page.");
}

const failures = newMisses.length + claimsRoot.length;
if (failures > 0) {
  console.log("");
  console.log(`  GATE: FAIL  (${failures} route(s) do not own their canonical URL)`);
  process.exit(1);
}

console.log("");
console.log("  GATE: PASS");
