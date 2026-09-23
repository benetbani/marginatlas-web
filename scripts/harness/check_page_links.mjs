#!/usr/bin/env node
/**
 * check_page_links , THE WALK OVER THE LINKS THE PAGES ACTUALLY OFFER
 * (2026-09-22, QUEUE ui:links-and-the-dead-link-walk; his words after the push
 * of 2026-09-20: "the names of the neighbourhoods are not clickable").
 *
 * WHY THIS EXISTS BESIDE `dead-links`, WHICH ALREADY WALKS LINKS. That one
 * reads SOURCE for literal `href="/..."` strings. Every link on a spine page is
 * composed from data (`/${iso2}/${city}/${trade}`), so it is literally invisible
 * to it: a source walk cannot see a link that does not exist until a builder
 * runs. This one reads the RENDERED pages, the same ones the page laws, the
 * holes and the model laws read, so it sees what a reader would click.
 *
 * WHAT IT CHECKS
 *  1. SHAPE: every internal href resolves to a route that exists in src/app.
 *     Dynamic segments match one segment, catch-alls match the rest.
 *  2. HYGIENE: no `/dev/` route reaches a reader; no double slash, no trailing
 *     slash, no uppercase segment, no space, no empty segment.
 *  3. THE FLOOR: each surface offers at least as many distinct internal links
 *     as it does today. A page with fifteen sections and seven ways out is a
 *     dead end, for a reader and for a search engine. THE FLOOR MAY ONLY RISE.
 *     It is the opposite of the reds ratchets in this folder, and for the same
 *     reason: the number that must not drift is the one nobody watches.
 *
 * WHAT IT CANNOT SEE, STATED. Whether the page at the other end RENDERS. A
 * route pattern matching is not a page existing: `/gb/london` matches
 * `/[country]/[geo]` and answers "Not found" on production, because no city
 * called london sits at that route (the city page is `/cities/london`). Only a
 * fetch can tell those apart, and the chain may never need the network. So:
 * this gate is the shape, the production fetch after a push is the substance,
 * and the two are not the same instrument.
 *
 *   node scripts/harness/check_page_links.mjs [<rendered.html> ...]
 *   node scripts/harness/check_page_links.mjs --list        (the harness set)
 *   node scripts/harness/check_page_links.mjs --list --counts   (print, judge nothing)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename, resolve } from "node:path";

const PAGES_DIR = "scratchpad/harness/pages";
const LIST = "scripts/harness/pages.json";

/* THE FLOOR, one per surface, seeded at what the pages offered the day the walk
   was written (2026-09-22) and raised as the links land. Never lowered: a page
   type that loses a way out has lost something a reader used. */
const LINK_FLOOR = { country: 2, city: 16, cell: 7, industry: 2, hood: 10, howto: 3 };

const surfaceOf = (name) =>
  name.startsWith("country-") ? "country" :
  name.startsWith("city-") ? "city" :
  name.startsWith("cell-") ? "cell" :
  name.startsWith("industry-") ? "industry" :
  name.startsWith("hood-") ? "hood" :
  name.startsWith("howto-") ? "howto" : "other";

/* THE ROUTES, from src/app: every directory holding a page or a route handler.
   Route groups `(x)` and private folders `_x` do not appear in a URL; `[x]` is
   one segment, `[...x]` and `[[...x]]` are the rest. */
function routePatterns(dir = "src/app", url = []) {
  const out = [];
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  const hasPage = entries.some((e) => /^(page|route)\.(tsx?|jsx?)$/.test(e));
  if (hasPage) out.push(url.slice());
  for (const e of entries) {
    const p = join(dir, e);
    if (!statSync(p).isDirectory()) continue;
    if (e.startsWith("_")) continue;
    const seg = e.startsWith("(") && e.endsWith(")") ? null : e;
    out.push(...routePatterns(p, seg == null ? url : [...url, seg]));
  }
  return out;
}

const PATTERNS = routePatterns().map((segs) => ({
  segs,
  rest: segs.some((s) => s.startsWith("[...") || s.startsWith("[[...")),
}));

function routeExists(path) {
  const parts = path.split("/").filter((s) => s.length > 0);
  for (const { segs, rest } of PATTERNS) {
    if (!rest && segs.length !== parts.length) continue;
    let ok = true;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      if (s.startsWith("[...") || s.startsWith("[[...")) { ok = parts.length >= i; break; }
      if (s.startsWith("[")) { if (parts[i] == null) { ok = false; break; } continue; }
      if (s !== parts[i]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

/* THE SCAN SET IS THE LIST, NEVER THE FOLDER, and that is not a detail. The
   renders directory keeps every page any run ever rendered: on the day this was
   written it held 49 files while `scripts/harness/pages.json` named 8, and the
   41 others were months old. Judging the folder read six stale district pages
   as live ones and reported a fault ("one link on five district pages") that no
   page served any more. A checker that cannot tell a stale artifact from the
   page is worse than no checker, so this one reads the list the chain keeps
   fresh (`pages-fresh` renders exactly these before any page gate runs), and a
   file named on the command line is judged because a person asked for it. */
const named = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const listed = JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => join(PAGES_DIR, `${p.surface}-${p.slugs.join("-")}.html`));
const files = (named.length ? named : listed).filter((f) => {
  if (existsSync(f)) return true;
  console.log(`  ${basename(f, ".html")}: NO RENDER: named in ${LIST} and not on disk; run pages-fresh`);
  return false;
});
if (!files.length) { console.error("usage: check_page_links.mjs <rendered.html ...> | --list"); process.exit(2); }

const COUNTS_ONLY = process.argv.includes("--counts");
let reds = 0;
const rows = [];
for (const f of files) {
  const html = readFileSync(f, "utf8");
  const name = basename(f, ".html");
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  const internal = hrefs.filter((h) => h.startsWith("/") && !h.startsWith("//"));
  const distinct = [...new Set(internal)];
  const bad = [];
  for (const h of distinct) {
    const path = h.split("#")[0].split("?")[0];
    if (path === "") continue;
    if (/\/dev(\/|$)/.test(path)) bad.push([h, "a dev route in front of a reader"]);
    else if (/\/\//.test(path)) bad.push([h, "a double slash"]);
    else if (path.length > 1 && path.endsWith("/")) bad.push([h, "a trailing slash"]);
    else if (/[A-Z ]/.test(path)) bad.push([h, "an upper-case letter or a space in the path"]);
    else if (!routeExists(path)) bad.push([h, "no route in src/app answers this shape"]);
  }
  const surface = surfaceOf(name);
  const floor = LINK_FLOOR[surface];
  rows.push({ name, surface, n: distinct.length, floor, bad });
  if (COUNTS_ONLY) continue;
  for (const [h, why] of bad) { console.log(`  ${name}: ${h}: ${why}`); reds++; }
  if (floor != null && distinct.length < floor) {
    console.log(`  ${name}: LINK FLOOR: ${distinct.length} distinct internal link(s) against a floor of ${floor} for a ${surface} page`);
    reds++;
  }
}

for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`${r.name}: ${r.n} distinct internal link(s)${r.floor != null ? `, floor ${r.floor}` : ""}${r.bad.length ? `, ${r.bad.length} bad` : ""}`);
}
console.log(`page links: ${files.length} page(s), ${reds} red(s)`);
if (COUNTS_ONLY) process.exit(0);
if (reds) {
  console.error("\nFAIL , a link a reader can click is broken, or a page type offers fewer ways out than it did.");
  console.error("The floor may only rise. Never lower it to make this pass: add the links back.");
  process.exit(1);
}
console.log(`PASS check_page_links , ${files.length} page(s), every internal link a known route shape, every floor met.`);
