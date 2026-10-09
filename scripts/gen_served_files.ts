/**
 * scripts/gen_served_files.ts
 *
 * Writes src/lib/routing/served_files.ts: every address with a dot in its last part that this site serves, so the edge can tell a
 * file it holds from an address that only looks like one (2026-10-06). Until then the middleware let any dotted address through
 * untouched, to spare the files under public/, and a made-up one reached a page route and answered 200 with "Page not found"
 * (`/data/uk/2026.10/nothing.csv`), a region named after it (`/zz/x.txt`) or a whole synthesized London page (`/gb/london/x.y`).
 *
 * TWO SOURCES, both read from disk, never typed:
 *  - every file under public/, at the address it is served from;
 *  - every file a route of src/app writes at a dotted address: its metadata files by Next's conventions (robots.ts as
 *    /robots.txt, sitemap.ts once per shard its generateSitemaps names) and any route folder with a dot in its name.
 * A file in src/app that would answer at a dotted address this script cannot place THROWS, naming it, rather than leave it out:
 * left out, the edge would answer 404 for a real route. tests/routing/edge_not_found.test.ts reds when the committed file and a
 * fresh generation differ, so a file added to public/ cannot ship unlisted.
 *
 *   npx tsx scripts/gen_served_files.ts
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { servedShardIds } from "../src/lib/seo/sitemap_families";

export const SERVED_FILES_FILE = "src/lib/routing/served_files.ts";
const PUBLIC = "public";
const APP = "src/app";

/** Every file under public/, as `/<path>`, sorted. */
export function publicFiles(dir = PUBLIC, prefix = ""): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...publicFiles(join(dir, e.name), `${prefix}/${e.name}`));
    else out.push(`${prefix}/${e.name}`);
  }
  return out.sort();
}

/** The shard ids a sitemap's generateSitemaps returns, read from its literal list; a list that is not literal throws. */
function sitemapIds(file: string, src: string): string[] {
  const m = /export\s+(?:async\s+)?function\s+generateSitemaps\s*\(\s*\)\s*(?::[^{]*)?\{\s*return\s*\[([^\]]*)\]\s*;?\s*\}/.exec(src);
  const entries = m ? m[1].match(/\{[^}]*\}/g) ?? [] : [];
  const ids = entries.map((e) => /^\{\s*id\s*:\s*(\d+)\s*,?\s*\}$/.exec(e)?.[1]);
  if (!m || entries.length === 0 || ids.some((id) => id === undefined)) {
    throw new Error(`${file}: generateSitemaps is not a literal list of { id: <number> }; teach scripts/gen_served_files.ts to read its shards`);
  }
  return ids as string[];
}

/** The shard ids a sitemap's generateSitemaps returns: the family table's when it reads servedShardIds (P1-E, 2026-10-09;
 *  src/lib/seo/sitemap_families.ts), else its literal list. */
function shardIdsOf(file: string, src: string): string[] {
  if (/\bservedShardIds\s*\(/.test(src)) return servedShardIds().map(String);
  return sitemapIds(file, src);
}

/** The URL path of a folder under src/app, groups dropped; null when a dynamic segment makes it more than one address. */
function routePath(segments: string[]): string | null {
  const kept = segments.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
  if (kept.some((s) => s.startsWith("["))) return null;
  return kept.length ? `/${kept.join("/")}` : "";
}

/** The dotted addresses the routes of src/app answer, each under the file that makes it. */
export function routeFiles(dir = APP, segments: string[] = []): Array<{ from: string; addresses: string[] }> {
  const out: Array<{ from: string; addresses: string[] }> = [];
  const base = routePath(segments);
  const place = (from: string, addresses: () => string[]) => {
    if (base === null) throw new Error(`${from}: a dotted address under a dynamic segment; teach scripts/gen_served_files.ts to list it`);
    out.push({ from, addresses: addresses() });
  };
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const at = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (e.name.startsWith("_")) continue; // private, not routable
      /* A route folder named like a file (`feed.xml/route.ts`) answers at that dotted address. */
      if (e.name.includes(".") && !e.name.startsWith("(") && !e.name.startsWith("[")) {
        const routed = readdirSync(at).some((f) => /^(route|page)\.(ts|tsx|js|jsx)$/.test(f));
        if (routed) place(at, () => [`${base}/${e.name}`]);
      }
      out.push(...routeFiles(at, [...segments, e.name]));
      continue;
    }
    /* Next's metadata files that answer at a dotted address. icon.tsx, opengraph-image.tsx and their kin answer at dotless
       ones (`/icon`), so they are not this table's. */
    if (/^robots\.(ts|js|txt)$/.test(e.name)) {
      place(at, () => [`${base}/robots.txt`]);
    } else if (/^sitemap\.(ts|js)$/.test(e.name)) {
      const src = readFileSync(at, "utf8");
      place(at, () => (/\bgenerateSitemaps\b/.test(src) ? shardIdsOf(at, src).map((id) => `${base}/sitemap/${id}.xml`) : [`${base}/sitemap.xml`]));
    } else if (e.name === "sitemap.xml" || e.name === "favicon.ico") {
      place(at, () => [`${base}/${e.name}`]);
    } else if (/^manifest\.(ts|js|json|webmanifest)$/.test(e.name)) {
      place(at, () => [`${base}/manifest.${e.name.endsWith(".json") ? "json" : "webmanifest"}`]);
    } else if (/^(icon|apple-icon|opengraph-image|twitter-image)\d*\.(ico|jpg|jpeg|png|gif|svg)$/.test(e.name) || /\.alt\.txt$/.test(e.name)) {
      throw new Error(`${at}: a static metadata image answers at a dotted address with a hash Next adds; teach scripts/gen_served_files.ts its address`);
    }
  }
  return out;
}

/** The file's whole text, from public/ and src/app. */
export function renderServedFiles(): string {
  const row = (a: string) => `  ${JSON.stringify(a)},`;
  /* Sorted by file: readdir order differs between this machine's NTFS and Vercel's Linux for names with "[", "_" or a capital,
     and the edge gate compares this file with a fresh generation on each. */
  const routes = routeFiles().sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
  return [
    "/**",
    " * GENERATED by scripts/gen_served_files.ts from public/ and the routes of src/app; do not edit by hand. The edge middleware",
    " * reads it (src/lib/routing/edge_not_found.ts) to tell a file this site serves from an address that only looks like one;",
    " * tests/routing/edge_not_found.test.ts reds when this file and a fresh generation differ.",
    " */",
    "",
    "/** Every address with a dot in its last part that this site serves: each file under public/, then each file a route of src/app",
    " *  writes there. Exact, as the middleware sees a path after its lowercase redirect: a capital in a file's name is an address",
    " *  no request reaches. */",
    "export const SERVED_FILES: ReadonlySet<string> = new Set([",
    "  /* public/ */",
    ...publicFiles().map(row),
    ...routes.flatMap((r) => [`  /* ${r.from} */`, ...r.addresses.map(row)]),
    "]);",
    "",
  ].join("\n");
}

if (require.main === module) {
  const text = renderServedFiles();
  writeFileSync(SERVED_FILES_FILE, text);
  console.log(`gen_served_files: ${text.split("\n").filter((l) => l.startsWith('  "')).length} addresses written to ${SERVED_FILES_FILE}`);
}
