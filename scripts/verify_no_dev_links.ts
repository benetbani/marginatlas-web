/**
 * verify_no_dev_links , a public page may not send a reader into /dev.
 *
 * The spine components were built at /dev/spine-cell, /dev/spine-city and
 * friends, then promoted to render real data on the public routes. The hand-off
 * links did not come with them. Eleven of them were still pointing into the
 * sandbox, including the primary call to action on three page types:
 *
 *   "Open Compare"   every city and /[country]/[geo] page   -> /dev/compare
 *   "Pick a place"   every industry page                    -> /dev/spine-city
 *   every district row on the city page                     -> /dev/spine-hood
 *
 * /dev/compare does not exist at all, so that button was a 404. The rest are
 * worse than a 404: the sandbox renders ONE hardcoded example regardless of
 * what was clicked, so every district in every city opened the same borrowed
 * London page, presented as if it were the place the reader asked for.
 *
 * Three separate gates were green the whole time, and each for its own reason.
 * find_dead_links matches a literal href against the route table, and
 * /dev/spine-city is a real directory, so it resolves. verify_dev_routes_sealed
 * checks that /dev is not CRAWLABLE, which is a different question from whether
 * a public page links into it. And nothing at all looked at `x.href ?? "/dev/…"`
 * fallbacks, which fail silently by design: they only appear when the real link
 * is missing, which is exactly when nobody is looking.
 *
 * Scope is src/components and the public route tree. src/app/dev is exempt for
 * the obvious reason, and so is a comment: this file's own docstring names four
 * dev routes.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SCAN_DIRS = [
  resolve(PROJECT_ROOT, "src", "components"),
  resolve(PROJECT_ROOT, "src", "app"),
];

/** Any string literal naming a /dev route, in an href or a default value. */
const DEV_LINK = /["'`]\/dev\/[a-z0-9-]/i;

type Hit = { file: string; line: number; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      // The sandbox may link to itself. Skipped by PATH from the app root, not
      // by bare name, so a component directory called "dev" is still scanned.
      if (p === resolve(PROJECT_ROOT, "src", "app", "dev")) continue;
      walk(p, acc);
    } else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

const hits: Hit[] = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    let src: string;
    try {
      src = readFileSync(file, "utf-8");
    } catch {
      continue;
    }
    const state = newCommentState();
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const code = stripComments(lines[i], state);
      if (lines[i].includes("allow-dev-link")) continue;
      if (DEV_LINK.test(code)) {
        hits.push({
          file: file.replace(PROJECT_ROOT, "."),
          line: i + 1,
          text: lines[i].trim().slice(0, 130),
        });
      }
    }
  }
}

if (hits.length === 0) {
  console.log(
    "[verify_no_dev_links] PASS: no public surface links into the /dev sandbox",
  );
  process.exit(0);
}

console.error(`[verify_no_dev_links] FAIL: ${hits.length} link(s) into /dev:`);
for (const h of hits) console.error(`  ${h.file}:${h.line}: ${h.text}`);
console.error(
  "\nA reader following one of these lands in the sandbox, which renders a " +
    "\nhardcoded example rather than what they clicked. Point it at the real " +
    "\nroute, or, if there is no destination, pass an undefined href so the " +
    "\nelement renders as text instead of linking to somebody else's data.",
);
process.exit(1);
