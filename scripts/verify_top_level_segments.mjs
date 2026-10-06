#!/usr/bin/env node
/**
 * scripts/verify_top_level_segments.mjs
 *
 * Keeps src/lib/routing/top_level_segments.ts true to src/app.
 *
 * WHY IT MATTERS MORE THAN A TIDINESS CHECK. That list is what lets
 * src/middleware.ts pin a 404 on a made-up first segment. If a new route folder
 * lands and the list is not updated, middleware will conclude the new route
 * "could only have matched [country]" and 404 A REAL PAGE. This gate is the
 * thing standing between adding a folder and taking a page off the site.
 *
 * So it fails in BOTH directions:
 *   - a folder or metadata file the list is missing  ->  that route would 404
 *   - a name in the list with neither               ->  a dead permission
 *
 * Route groups "(name)" are transparent and their children count as top level.
 * "_name" folders are Next private and not routable. "[name]" IS the wildcard
 * this whole mechanism exists to bound, so it is never a static segment.
 *
 * A METADATA ROUTE FILE holds a first segment as surely as a folder does
 * (2026-10-06). src/app/icon.tsx serves at /icon, and a walk of folders alone
 * never listed it, so the middleware pinned the site icon to 404, its own PNG
 * the body, on every page. Each such file's address is Next's own
 * (scripts/lib/metadata_routes.mjs), and only a dotless one takes a name: the
 * middleware never judges a last part with a dot as a place.
 *
 *   node scripts/verify_top_level_segments.mjs
 */
import fs from "node:fs";
import path from "node:path";

import { red, redSummary } from "./lib/red.mjs";
import { metadataRoutes, requestedAddress } from "./lib/metadata_routes.mjs";

const APP = "src/app";
const LIST = "src/lib/routing/top_level_segments.ts";
const RULE = "top-level-segments";

function topSegments(dir, out = new Set()) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("_")) continue;                       // private, not routable
    if (e.name.startsWith("(")) { topSegments(path.join(dir, e.name), out); continue; } // transparent
    if (e.name.startsWith("[")) continue;                       // the wildcard itself
    out.add(e.name);
  }
  return out;
}

const folders = topSegments(APP);
const childFolders = topSegments(path.join(APP, "[country]"));

/* THE FILES THAT HOLD A SEGMENT (2026-10-06, the header's last paragraph). A
   dotted address (/robots.txt, /sitemap/0.xml) is a file name and takes no
   name here, so a made-up /sitemap/zz keeps its 404; a file inside a folder
   adds nothing the folder has not. Each name maps to the file that holds it,
   for the red below. */
const files = new Map();
const childFiles = new Map();
for (const { file, address } of metadataRoutes(APP)) {
  const requested = requestedAddress(address);
  if (requested.split("/").pop().includes(".")) continue;
  const [first, second] = requested.split("/").filter(Boolean);
  if (first === "[country]") {
    if (second && !second.startsWith("[") && !childFolders.has(second)) childFiles.set(second, file);
  } else if (!first.startsWith("[") && !folders.has(first)) {
    files.set(first, file);
  }
}

const onDisk = new Set([...folders, ...files.keys()]);
const src = fs.readFileSync(LIST, "utf8");
/* TWO SETS IN ONE FILE (2026-09-19): TOP_LEVEL_SEGMENTS, then
   COUNTRY_STATIC_CHILDREN, the static children of src/app/[country] (the
   middleware exempted "industries" by name and pinned 404 on /gb/how-to-open
   for every deploy since that route was added). Each set is read from its own
   `new Set([` and compared to its own folder. */
const firstSet = src.indexOf("new Set([");
const secondSet = src.indexOf("new Set([", firstSet + 1);
const body = src.slice(firstSet, secondSet > 0 ? secondSet : undefined);
const declared = new Set([...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
const childrenOnDisk = new Set([...childFolders, ...childFiles.keys()]);
const childrenBody = secondSet > 0 ? src.slice(secondSet) : "";
const childrenDeclared = new Set([...childrenBody.matchAll(/"([^"]+)"/g)].map((m) => m[1]));

const missing = [...onDisk].filter((s) => !declared.has(s)).sort();
const stale = [...declared].filter((s) => !onDisk.has(s)).sort();
const childMissing = [...childrenOnDisk].filter((s) => !childrenDeclared.has(s)).sort();
const childStale = [...childrenDeclared].filter((s) => !childrenOnDisk.has(s)).sort();

console.log(`top-level-segments: ${folders.size} route folder(s) and ${files.size} metadata route file(s) on disk, ${declared.size} declared; ${childFolders.size} static child folder(s) and ${childFiles.size} metadata route file(s) of [country] on disk, ${childrenDeclared.size} declared`);

if (missing.length === 0 && stale.length === 0 && childMissing.length === 0 && childStale.length === 0) {
  console.log("top-level-segments: both lists match src/app");
  process.exit(0);
}

/* THE RED, one canonical line per name (plan-2026-09-17/02-ERRORS.md, step
   16). A missing folder's line is the line of the set's `new Set([` opener,
   which is where the name has to be added; a stale name's line is the line
   that declares it, which is the line to delete. */
const lines = src.split("\n");
const setLine = lines.findIndex((l) => l.includes("new Set([")) + 1 || undefined;
const lineOf = (name) => lines.findIndex((l) => l.includes(`"${name}"`)) + 1 || undefined;

for (const s of missing) {
  red({
    rule: RULE,
    file: LIST,
    line: setLine,
    detail: files.has(s)
      ? `metadata route ${files.get(s)} serves at /${s} and "${s}" is not in the list, so middleware will pin it to 404 as a place we do not hold`
      : `route folder ${APP}/${s} is on disk and not in the list, so middleware will 404 it as a place we do not hold`,
    remedy: `add "${s}" to the set in ${LIST}`,
  });
}
for (const s of stale) {
  red({
    rule: RULE,
    file: LIST,
    line: lineOf(s),
    detail: `"${s}" is in the list and neither a route folder ${APP}/${s} nor a metadata route file holds it, a permission nobody revoked`,
    remedy: `remove "${s}" from the set in ${LIST}`,
  });
}
for (const s of childMissing) {
  red({
    rule: RULE,
    file: LIST,
    line: (lines.findIndex((l) => l.includes("COUNTRY_STATIC_CHILDREN")) + 1) || undefined,
    detail: childFiles.has(s)
      ? `metadata route ${childFiles.get(s)} serves at /<country>/${s} and "${s}" is not in COUNTRY_STATIC_CHILDREN, so middleware will pin it to 404 as a region the country does not hold`
      : `static child folder ${APP}/[country]/${s} is on disk and not in COUNTRY_STATIC_CHILDREN, so middleware will pin 404 on /<country>/${s} while the page renders`,
    remedy: `add "${s}" to COUNTRY_STATIC_CHILDREN in ${LIST}`,
  });
}
for (const s of childStale) {
  red({
    rule: RULE,
    file: LIST,
    line: lineOf(s),
    detail: `"${s}" is in COUNTRY_STATIC_CHILDREN and neither a folder ${APP}/[country]/${s} nor a metadata route file holds it, a permission nobody revoked`,
    remedy: `delete "${s}" from COUNTRY_STATIC_CHILDREN in ${LIST}`,
  });
}
redSummary(
  RULE,
  missing.length + stale.length + childMissing.length + childStale.length,
  `edit the sets in ${LIST} so they match the folders and metadata route files under ${APP} and ${APP}/[country]`,
  `${missing.length} missing, ${stale.length} stale; children ${childMissing.length} missing, ${childStale.length} stale`,
);
process.exit(1);
