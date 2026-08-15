/**
 * verify_no_hardcoded_place , a component must not name one city for everybody.
 *
 * The spine components were built against a London seed, and the seed's place
 * kept getting baked into their links. Seven survived promotion to real data:
 *
 *   cell-view  Related      every "related trade" row -> /gb/london/<trade>,
 *                           under a heading reading "in this place"
 *   cell-view  Close        one more, on a row whose own label says
 *                           "Look at X in {city} instead"
 *   NeighborhoodExplorer    all six TRADE_ROUTES entries, on the card headed
 *                           "What works in {district}"
 *
 * None of them 404s. That is the point. A reader in Madrid follows a link that
 * promises their own city and lands on London's economics, with the destination
 * page perfectly happy to render, which this project treats as its worst
 * available failure: another place's data with nothing on screen to notice.
 *
 * THE RULE. A path literal naming a real city, in a component, is banned. The
 * place a page is about comes from its datum: every spine adapter puts iso2 and
 * a slug on meta, and where a component has no place it must render no link
 * rather than borrow one.
 *
 * Not scanned: src/app/dev (the sandbox is built on the seed and should say
 * so), _design, and /admin. Comments are stripped, so a note ABOUT a hardcoded
 * London is not itself one.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import cityListJson from "../data/cities/city_list_v1.json";
import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SRC = resolve(PROJECT_ROOT, "src");

const CITY_SLUGS = new Set(
  (cityListJson as { cities: Array<{ slug: string }> }).cities.map((c) => c.slug),
);

/**
 * Deliberate uses, each with the reason it is not the defect above.
 *
 * The test for this list is whether the page is ABOUT that place. A showcase
 * link to one real cell is an example; a component that renders for every city
 * and links to one of them is not.
 */
const EXEMPT: Array<[string, string]> = [
  [
    "src/components/spine2/SiteFooter.tsx",
    "a single worked example in the footer's Places column, labelled 'Restaurants in London'. It names the place it opens, so a reader is never told it is theirs",
  ],
  [
    "src/app/world/page.tsx",
    "one worked example on the world map page, same reasoning as the footer",
  ],
];

/** "/gb/london/..." or "/gb/london" as a whole path segment pair. */
const PLACE_PATH = /["'`]\/([a-z]{2})\/([a-z][a-z0-9-]{2,})(?=[/"'`])/g;

type Hit = { file: string; line: number; path: string; text: string };

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

const exemptSet = new Set(EXEMPT.map(([f]) => f));
const hits: Hit[] = [];

for (const file of walk(SRC)) {
  const rel = file.replace(PROJECT_ROOT, "").replace(/^[\\/]/, "").replace(/\\/g, "/");
  if (
    rel.includes("/dev/") ||
    rel.includes("/admin/") ||
    rel.includes("_design") ||
    rel.includes("spine-seeds") ||
    exemptSet.has(rel)
  ) {
    continue;
  }
  let src: string;
  try {
    src = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const state = newCommentState();
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // Strips block comments too, which a startsWith check does not, and which
    // is why my own explanatory notes kept showing up in the ad-hoc version.
    const code = stripComments(lines[i], state);
    if (lines[i].includes("allow-hardcoded-place")) continue;
    PLACE_PATH.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = PLACE_PATH.exec(code)) !== null) {
      const [, iso2, place] = m;
      if (!CITY_SLUGS.has(place)) continue;
      hits.push({
        file: rel,
        line: i + 1,
        path: `/${iso2}/${place}`,
        text: lines[i].trim().slice(0, 110),
      });
    }
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_no_hardcoded_place] PASS: no component names one city for every ` +
      `reader (${EXEMPT.length} documented exemption(s))`,
  );
  process.exit(0);
}

console.error(
  `[verify_no_hardcoded_place] FAIL: ${hits.length} hardcoded place(s):`,
);
for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.path}\n    ${h.text}`);
console.error(
  "\nA reader in another city follows this and lands somewhere else, on a page " +
    "\nthat renders perfectly. Take the place from the datum: every spine " +
    "\nadapter puts iso2 and a slug on meta. Where there is no place, render no " +
    "\nlink rather than borrow one.",
);
process.exit(1);
