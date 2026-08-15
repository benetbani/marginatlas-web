#!/usr/bin/env node
/**
 * scripts/verify_sitemap_no_redirects.mjs
 *
 * TWO RULES: a declared URL may not be a redirect, and may not set noindex.
 *
 * A SITEMAP STATES THE PAGES YOU WANT INDEXED. A REDIRECT IS NOT ONE OF THEM.
 *
 * Found 2026-08-09: `/browse` was declared in the static shard at priority 0.8,
 * the joint-highest on it. The route is `permanentRedirect("/world")` and its
 * own canonical tag names /world, so the sitemap was asking a crawler to fetch
 * a URL that immediately disowns itself, while /world sat two lines below.
 *
 * Checked across all eleven non-country URLs on that shard, it was the only one.
 * This gate is what keeps it the only one.
 *
 * THE CHECK IS OFFLINE, on purpose. Following the URLs would be a stronger test
 * and would need the network, and the prebuild chain must never need a network
 * or a secret: a gate that can fail on a blip is a gate that gets switched off.
 * So it reads the source instead, and matches a literal path in sitemap.ts
 * against a route file whose body only redirects.
 *
 * STATED BLIND SPOT: it sees literal `${BASE_URL}/path` entries. A URL built in
 * a loop from data, which is how the country, city and cell shards work, is not
 * checked here. Those are generated from real entities and none of them is a
 * redirect; if that ever changes this check will not notice.
 *
 *   node scripts/verify_sitemap_no_redirects.mjs
 */
import fs from "node:fs";
import path from "node:path";

const SITEMAP = "src/app/sitemap.ts";
const APP = "src/app";

/** Comments stripped: a commented-out URL is not a declaration, and a note
 *  explaining a redirect is not a redirect. */
function code(file) {
  return fs
    .readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
}

/** Literal paths declared in the sitemap, e.g. `${BASE_URL}/faq` -> "/faq". */
function declaredPaths() {
  const src = code(SITEMAP);
  const out = new Set();
  for (const m of src.matchAll(/\$\{BASE_URL\}(\/[a-z0-9\-/]*)/g)) {
    const p = m[1];
    if (p && p !== "/" && !p.includes("${")) out.add(p);
  }
  return [...out];
}

/** The page file serving a literal path, if one exists. Route groups are
 *  transparent, so /faq may live at src/app/(site)/faq/page.tsx. */
function pageFor(urlPath) {
  const seg = urlPath.replace(/^\//, "");
  const candidates = [
    path.join(APP, seg, "page.tsx"),
    path.join(APP, "(site)", seg, "page.tsx"),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c.replace(/\\/g, "/");
  return null;
}

const REDIRECTS = /\b(permanentRedirect|redirect)\s*\(/;

/* A page setting robots index:false is asking NOT to be indexed. Declaring it in
   the sitemap asks a crawler to fetch it and then be told to go away: two
   opposite signals about one URL, and a wasted crawl.
   Found 2026-08-09: /you was declared at priority 0.6 while setting
   { index: false, follow: false }, CORRECTLY, because everything on that page
   lives in the reader's own browser and the served HTML is three "Loading your
   shortlist" placeholders that will never be anything else. The noindex was
   right. The declaration was the wrong half. */
const NOINDEX = /robots\s*:\s*\{[^}]*index\s*:\s*false/;

let failed = 0;
const offenders = [];
const paths = declaredPaths();

for (const p of paths) {
  const file = pageFor(p);
  if (!file) continue;
  const src = code(file);
  if (REDIRECTS.test(src)) offenders.push({ p, file, why: "redirects" });
  else if (NOINDEX.test(src)) offenders.push({ p, file, why: "sets robots index:false" });
}

console.log(`sitemap-no-redirects: ${paths.length} literal path(s) declared, ${paths.filter(pageFor).length} resolved to a route file`);

if (offenders.length > 0) {
  failed++;
  console.error(`\nx ${offenders.length} declared URL(s) should not be in a sitemap:\n`);
  for (const o of offenders) console.error(`  ${o.p}  ${o.why}  ->  ${o.file}`);
  console.error(
    `\n  Declare the DESTINATION instead. The route can stay: a redirect keeps\n` +
      `  existing links working, which is what it is for. Only the sitemap entry\n` +
      `  goes, because a sitemap is a list of pages you want indexed.`,
  );
}

if (failed > 0) {
  console.error(`sitemap-no-redirects: ${failed} failure(s)`);
  process.exit(1);
}
console.log("sitemap-no-redirects: every declared URL is a real page");
process.exit(0);
