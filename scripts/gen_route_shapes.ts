/**
 * scripts/gen_route_shapes.ts
 *
 * Writes src/lib/routing/route_shapes.ts: the shapes of the addresses each route folder of src/app serves, and the three closed lists
 * the dynamic leaves of four of them resolve, so the edge can tell an address a route folder holds from one it does not (the plan
 * 2026-10-11, route-folder fall-through; QUEUE site:route-folder-fallthrough). Until then the middleware judged a first part no route
 * folder holds and the addresses inside the country tree, and left every other address to its route: /pricing/xyz, /about/xyz,
 * /new-businesses/x and /blog/no-such-post fit no page of their folder, Next sent them to the country tree's wildcard
 * ([country]/[geo]), and that answered 200 with an indexable head, a loading skeleton and a 404 drawn in the browser.
 *
 * FOUR SOURCES, all read from disk, never typed:
 *  - ROUTE_SHAPES: every page.* and route.* file of src/app, at the address its folders make (route groups dropped, a dynamic folder
 *    written "*"), and every metadata route file's dotless address (src/app/icon.tsx at /icon, by Next's own functions:
 *    scripts/lib/metadata_routes.mjs, as the top-level-segments gate reads them);
 *  - BLOG_SLUGS: the .md files of content/blog, which is getPost's own test (src/lib/blog.ts: the file `<slug>.md` exists);
 *  - LEARN_SLUGS: the keys of LEARN_BY_SLUG (src/lib/learn/articles.ts), which the learn route resolves;
 *  - CITY_PAIRS: `<left>-vs-<right>` of each pair of data/cities/city_comparisons_v1.json whose two cities data/cities/city_list_v1.json
 *    holds, which is the pair route's own check (it calls notFound() for a pair whose city the list does not hold).
 * The fourth leaf the edge closes, /coverage/<iso2>, resolves the country list the edge already holds (COUNTRIES), so it needs no list here.
 *
 * LEFT OUT, each for the rule that owns it: the home page (the edge never judges the empty address); the country tree, src/app/[country],
 * skipped by its path (the edge's place, trade and district rules judge it, and embed/[country] and pro/[country] below it are shapes);
 * an address with a dot in its last part (the file rule's: src/lib/routing/served_files.ts); a `_` folder (private, not routable).
 *
 * A FOLDER THIS SCRIPT CANNOT PLACE THROWS, naming it, rather than leave a route out: a parallel route's slot (@x), an intercepting route
 * ((.)x), a catch-all ([...x], [[...x]]), or a second dynamic folder at the root. Left out, the edge would answer 404 for a real address;
 * tests/routing/edge_not_found.test.ts reds when the committed file and a fresh generation differ, and catches the throw as a red.
 *
 * WHAT IT CANNOT SEE: what a route does with an address that fits its shape (the lists close four leaves; the embed shape and the three
 * pro shapes resolve their own and are named OPEN in the test: noindex routes that 404 by their resolvers), and a route written anywhere
 * but src/app (next.config.js holds no rewrite: tests/routing/dispositions.test.ts pins that).
 *
 *   npx tsx scripts/gen_route_shapes.ts
 */
import { readdirSync, writeFileSync } from "node:fs";
import { metadataRoutes, requestedAddress } from "./lib/metadata_routes.mjs";
import { LEARN_BY_SLUG } from "../src/lib/learn/articles";
import cityListJson from "../data/cities/city_list_v1.json";
import cityComparisonsJson from "../data/cities/city_comparisons_v1.json";

export const ROUTE_SHAPES_FILE = "src/lib/routing/route_shapes.ts";
const APP = "src/app";
const BLOG = "content/blog";

/** A page or a route handler: the files that make an address answer. */
const ROUTE_FILE = /^(?:page|route)\.(?:tsx|ts|jsx|js)$/;
/** A folder kind this script does not read: a parallel route's slot, an intercepting route, a catch-all (optional or not). */
const UNREAD_FOLDER = /^(?:@|\(\.|\[\.|\[\[)/;

/** Code-unit order, never the locale's: the table is compared with a fresh generation on this machine's NTFS and on Vercel's Linux. */
const byText = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** The shapes the routes of a tree answer (src/app, or a tree of a test's own), each the parts of an address (a dynamic part written "*"), sorted. */
export function routeShapes(root = APP): string[][] {
  const found = new Map<string, string[]>();
  /** The home page (no part) and an address with a dot in its last part are no shape. */
  const add = (parts: string[]): void => {
    if (parts.length === 0 || parts[parts.length - 1].includes(".")) return;
    found.set(parts.join("/"), parts);
  };
  const walk = (dir: string, parts: string[]): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const at = `${dir}/${e.name}`;
      if (!e.isDirectory()) {
        if (ROUTE_FILE.test(e.name)) add(parts);
        continue;
      }
      if (e.name.startsWith("_")) continue; // private, not routable
      if (UNREAD_FOLDER.test(e.name)) {
        throw new Error(`${at}: a folder kind this script does not read (a slot, an intercepting route or a catch-all); teach scripts/gen_route_shapes.ts its shape`);
      }
      if (/^\(.*\)$/.test(e.name)) { walk(at, parts); continue; } // a route group is transparent
      if (e.name.startsWith("[")) {
        if (parts.length === 0) {
          if (at === `${root}/[country]`) continue; // the country tree, judged by the edge's own rules
          throw new Error(`${at}: a second dynamic folder at the root; the edge reads src/app/[country] as the one wildcard, so teach scripts/gen_route_shapes.ts and src/lib/routing/edge_not_found.ts this one`);
        }
        walk(at, [...parts, "*"]);
        continue;
      }
      walk(at, [...parts, e.name]);
    }
  };
  walk(root, []);
  /* A metadata route file holds an address as surely as a page does: each dotless one (a dotted one is the file rule's), as the
     top-level-segments gate reads them (scripts/verify_top_level_segments.mjs), the country tree's left to its own rules. */
  for (const { file, address } of metadataRoutes(root)) {
    const parts = requestedAddress(address).split("/").filter(Boolean);
    if (parts.length === 0 || parts[parts.length - 1].includes(".")) continue;
    if (parts[0] === "[country]") continue;
    if (parts[0].startsWith("[")) {
      throw new Error(`${file}: serves at ${address}, under a dynamic first part; teach scripts/gen_route_shapes.ts and src/lib/routing/edge_not_found.ts this one`);
    }
    add(parts.map((p) => (p.startsWith("[") ? "*" : p)));
  }
  return [...found.values()].sort((a, b) => byText(a.join("/"), b.join("/")));
}

/** The posts of content/blog, by slug, sorted: the files `<slug>.md`, which is getPost's own test of a slug. */
export function blogSlugs(): string[] {
  return readdirSync(BLOG).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -".md".length)).sort(byText);
}

/** The articles of the knowledge base, by slug, sorted: the keys of LEARN_BY_SLUG, which the learn route resolves. */
export function learnSlugs(): string[] {
  return [...LEARN_BY_SLUG.keys()].sort(byText);
}

/** The city comparisons by pair slug, sorted: each pair of the comparisons file whose two cities the city list holds, as the pair
 *  route's own checks read them. */
export function cityPairs(): string[] {
  const listed = new Set((cityListJson as { cities: Array<{ slug: string }> }).cities.map((c) => c.slug));
  return (cityComparisonsJson as { pairs: Array<{ left: string; right: string }> }).pairs
    .filter((p) => listed.has(p.left) && listed.has(p.right))
    .map((p) => `${p.left}-vs-${p.right}`)
    .sort(byText);
}

/** The file's whole text, from the routes of src/app, content/blog, the knowledge base and the city files. */
export function renderRouteShapes(): string {
  const shape = (s: readonly string[]) => `  [${s.map((p) => JSON.stringify(p)).join(", ")}],`;
  const row = (v: string) => `  ${JSON.stringify(v)},`;
  return [
    "/**",
    " * GENERATED by scripts/gen_route_shapes.ts from the routes of src/app, content/blog, src/lib/learn/articles.ts and data/cities; do not",
    " * edit by hand. The edge middleware reads it (src/lib/routing/edge_not_found.ts) to tell an address a route folder holds from one it",
    " * does not; tests/routing/edge_not_found.test.ts reds when this file and a fresh generation differ.",
    " */",
    "",
    "/** The address shapes the routes of src/app answer, one array of parts each, in order: a literal part is a static folder and \"*\" a",
    " *  dynamic one (any value; the three lists below close the leaves of the blog, the learn articles and the city pairs, and the edge's",
    " *  own country list closes /coverage/<iso2>). Route groups are dropped. Left out, each for the rule that owns it: the home page, which",
    " *  the edge never judges; the country tree, src/app/[country], judged by the edge's place and trade rules; and an address with a dot in",
    " *  its last part, the file rule's (src/lib/routing/served_files.ts). A first part here is a TOP_LEVEL_SEGMENTS name, and an address of",
    " *  such a name that fits none of its shapes is one no route holds, which Next sends to the country tree's wildcard. */",
    "export const ROUTE_SHAPES: ReadonlyArray<readonly string[]> = [",
    ...routeShapes().map(shape),
    "];",
    "",
    "/** The posts of content/blog, by slug: getPost's own test of a slug is that the file `<slug>.md` exists. */",
    "export const BLOG_SLUGS: ReadonlySet<string> = new Set([",
    ...blogSlugs().map(row),
    "]);",
    "",
    "/** The articles of the knowledge base, by slug: the keys of LEARN_BY_SLUG (src/lib/learn/articles.ts), which the learn route resolves. */",
    "export const LEARN_SLUGS: ReadonlySet<string> = new Set([",
    ...learnSlugs().map(row),
    "]);",
    "",
    "/** The city comparisons by pair slug, `<left>-vs-<right>`: each pair of data/cities/city_comparisons_v1.json whose two cities",
    " *  data/cities/city_list_v1.json holds, as the pair route's own checks read them. */",
    "export const CITY_PAIRS: ReadonlySet<string> = new Set([",
    ...cityPairs().map(row),
    "]);",
    "",
  ].join("\n");
}

if (require.main === module) {
  const text = renderRouteShapes();
  writeFileSync(ROUTE_SHAPES_FILE, text);
  console.log(`gen_route_shapes: ${routeShapes().length} shapes, ${blogSlugs().length} posts, ${learnSlugs().length} articles and ${cityPairs().length} city pairs written to ${ROUTE_SHAPES_FILE}`);
}
