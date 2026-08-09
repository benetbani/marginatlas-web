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
 *   - a folder in src/app that the list is missing  ->  that route would 404
 *   - a name in the list with no folder             ->  a dead permission
 *
 * Route groups "(name)" are transparent and their children count as top level.
 * "_name" folders are Next private and not routable. "[name]" IS the wildcard
 * this whole mechanism exists to bound, so it is never a static segment.
 *
 *   node scripts/verify_top_level_segments.mjs
 */
import fs from "node:fs";
import path from "node:path";

const APP = "src/app";
const LIST = "src/lib/routing/top_level_segments.ts";

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

const onDisk = topSegments(APP);
const src = fs.readFileSync(LIST, "utf8");
const body = src.slice(src.indexOf("new Set(["));
const declared = new Set([...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]));

const missing = [...onDisk].filter((s) => !declared.has(s)).sort();
const stale = [...declared].filter((s) => !onDisk.has(s)).sort();

console.log(`top-level-segments: ${onDisk.size} route folder(s) on disk, ${declared.size} declared`);

if (missing.length === 0 && stale.length === 0) {
  console.log("top-level-segments: the list matches src/app");
  process.exit(0);
}

if (missing.length) {
  console.error(`\nx ${missing.length} route folder(s) missing from the list: ${missing.join(", ")}`);
  console.error(`  MIDDLEWARE WILL 404 THESE. A first segment that is neither a country nor`);
  console.error(`  in the list is treated as a place we do not hold. Add them to ${LIST}.`);
}
if (stale.length) {
  console.error(`\nx ${stale.length} name(s) in the list with no folder: ${stale.join(", ")}`);
  console.error(`  A permission nobody revoked. Remove them from ${LIST}.`);
}
process.exit(1);
