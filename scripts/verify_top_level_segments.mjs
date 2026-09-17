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

import { red, redSummary } from "./lib/red.mjs";

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
    detail: `route folder ${APP}/${s} is on disk and not in the list, so middleware will 404 it as a place we do not hold`,
    remedy: `add "${s}" to the set in ${LIST}`,
  });
}
for (const s of stale) {
  red({
    rule: RULE,
    file: LIST,
    line: lineOf(s),
    detail: `"${s}" is in the list and ${APP}/${s} does not exist, a permission nobody revoked`,
    remedy: `remove "${s}" from the set in ${LIST}`,
  });
}
redSummary(
  RULE,
  missing.length + stale.length,
  `edit the set in ${LIST} so it matches the folders under ${APP}`,
  `${missing.length} missing, ${stale.length} stale`,
);
process.exit(1);
