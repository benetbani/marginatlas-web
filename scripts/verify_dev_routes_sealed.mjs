#!/usr/bin/env node
/**
 * scripts/verify_dev_routes_sealed.mjs
 *
 * THE WORKSHOP IS NOT THE SHOP.
 *
 * src/app/dev holds prototypes and the founder's review surfaces: 58 of this
 * repository's 113 page routes. They exist so a design can be ruled on before it
 * ships, and they are meant to be disposable.
 *
 * ON 2026-08-09 THEY WERE NOT DISPOSABLE. Four shipping routes imported their
 * page BODIES straight out of the workshop:
 *
 *   (site)/cities/[slug]/neighborhoods/page.tsx  <- dev/spine-hood/hood-view
 *   (site)/cities/[slug]/page.tsx                <- dev/spine-city/city-view
 *   [country]/[geo]/page.tsx                     <- dev/spine-city/city-view
 *   (site)/industries/[industry]/page.tsx        <- dev/spine-industry/industry-view
 *
 * Three live page types rendered from a directory everyone treats as scratch.
 * That is a large share of why changes here "clash": a rule about shipping
 * pages either misses production code sitting in /dev, or has to special-case
 * it, and nobody remembers which. It also made the obvious cleanup impossible,
 * because deleting a stale prototype could take a live page with it.
 *
 * The eleven modules moved to src/components/spine/{hood,city,industry}/ with
 * their filenames intact. This gate stops them, or anything like them, drifting
 * back.
 *
 * TWO RULES, and only the first is about imports:
 *
 *   1. Nothing outside src/app/dev may import from src/app/dev.
 *   2. robots.txt must disallow /dev/ for every crawler group that is not
 *      already blocked wholesale. A prototype at 200 is fine; a prototype in
 *      the index is a second, worse version of a page that ships.
 *
 * Rule 2 is also checked by tests/app/robots.test.ts. Deliberate overlap: that
 * test owns the shape of robots.txt, this gate owns "the workshop is sealed",
 * and a reader of either should not have to know about the other.
 *
 * Measured clean on 2026-08-09 immediately after the three moves, so this is a
 * HARD gate. If it fails, do NOT add an exception: move the module out of /dev
 * instead. That is the entire point.
 *
 *   node scripts/verify_dev_routes_sealed.mjs
 */
import fs from "node:fs";
import path from "node:path";

const SRC = "src";
const DEV = "src/app/dev";

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

/* ZERO KNOWN LEAKS, AND THE ONE THAT WAS HERE MET ITS OWN EXIT CONDITION.

   src/app/[country]/page.tsx used to import the DEFAULT EXPORT of a dev route
   page and render it as a component: `import SpineCountry from
   "@/app/dev/spine/page"`. It was allowed on a written exit condition: "when the
   country page gets an honest data adapter, its body becomes a component under
   src/components/spine/country/ and this entry is deleted along with the
   allowance."

   That happened on 2026-08-28. src/lib/spine/adapt_country.ts is the adapter and
   src/components/spine/country/country-view.tsx is the body, so the route mounts
   a component from src/components and reaches into the workshop for nothing.
   The gate caught the closure itself and asked for this deletion, which is the
   allowance behaving exactly as it was written to.

   Do not add an entry back. If you are tempted to, move the module instead. */
const KNOWN_LEAKS = new Set([]);

let failed = 0;

/* ---- Rule 1: no import crosses INTO the workshop from outside it ---- */
const leaks = [];
let scanned = 0;
for (const f of walk(SRC)) {
  if (f.startsWith(DEV + "/")) continue;
  scanned++;
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    // Import/re-export/dynamic-import statements only. A prose mention of
    // "dev/spine-city/motion" in a comment is a citation, not a dependency, and
    // there are several of those recording where a pattern came from.
    if (!/^\s*(import|export)\b|import\s*\(/.test(line)) return;
    if (/["'](@\/app\/dev\/|\.\.?\/(\.\.\/)*app\/dev\/)/.test(line)) {
      if (KNOWN_LEAKS.has(f)) return;
      leaks.push({ file: f, line: i + 1, text: line.trim() });
    }
  });
}

/* A recorded leak that has been fixed must stop being recorded, or the
   allowance outlives the reason and the next file on that path inherits it. */
for (const f of KNOWN_LEAKS) {
  const src = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  const stillLeaks = /^\s*(import|export)\b.*["']@\/app\/dev\//m.test(src);
  if (stillLeaks) {
    console.log(`PASS  known leak still present and still allowed: ${f}`);
  } else {
    failed++;
    console.log(`FAIL  ${f} no longer imports from the workshop. Delete it from KNOWN_LEAKS.`);
  }
}

if (leaks.length === 0) {
  console.log(`PASS  nothing else outside the workshop imports from it (${scanned} files scanned)`);
} else {
  failed++;
  console.log(`FAIL  ${leaks.length} import(s) reach into src/app/dev from outside it:`);
  for (const l of leaks) console.log(`        ${l.file}:${l.line}  ${l.text}`);
  console.log("      Move the module to src/components/ instead of exempting it.");
}

/* ---- Rule 2: the workshop is not advertised ---- */
const robotsSrc = fs.readFileSync("src/app/robots.ts", "utf8");
// Count groups that allow anything at all, and require /dev/ in each.
const disallowLists = [...robotsSrc.matchAll(/disallow:\s*(\[[^\]]*\]|"[^"]*")/g)].map((m) => m[1]);
const allowingGroups = disallowLists.filter((d) => !/^"\/"$/.test(d.trim()));
const missing = allowingGroups.filter((d) => !d.includes("/dev/"));

if (allowingGroups.length > 0 && missing.length === 0) {
  console.log(`PASS  robots.txt disallows /dev/ in all ${allowingGroups.length} crawler group(s) that are let in`);
} else {
  failed++;
  console.log(`FAIL  ${missing.length} of ${allowingGroups.length} crawler group(s) in robots.ts may crawl /dev/`);
}

if (failed > 0) {
  console.error(`dev_routes_sealed: ${failed} failure(s)`);
  process.exit(1);
}
console.log("dev_routes_sealed: the workshop is sealed");
process.exit(0);
