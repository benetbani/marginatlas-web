/**
 * Every sitemap shard holds one family, and every address it lists is a page the site wants indexed (P1-E of the page
 * architecture, 2026-10-09; docs/superpowers/specs/2026-10-09-page-architecture-design.md in the design repo, section 4a).
 *
 * Refuses: an address outside its shard's family, one indexFor refuses, one that does not name itself canonical (an alias, which
 * names the live slug's page), one the edge does not pass untouched (a 404 or a redirect), one listed twice; an address no page
 * file under src/app serves, and one whose page says noindex, itself or in a layout above it, or sets robots in a form this gate
 * cannot read; a listed or empty shard generateSitemaps does not write; an empty shard that writes an address; robots.txt's list
 * unequal to the table's listed shards; a lastmod that is a time rather than a page's own date, or a `new Date()` in
 * src/app/sitemap.ts (the build's time).
 *
 * THE INSTRUMENT: src/app/sitemap.ts itself, called offline (no listed shard reads the database since the families split), the
 * real middleware's routing (routeRequest) for each address, asked with a browser's request, and the files of src/app for the page
 * that serves it. WHAT IT CANNOT SEE: what a page renders once the edge passes it (its own notFound() or redirect; the gate
 * sitemap-no-redirects reads the literal addresses), Google's own reading of a canonical, a robots tag set in a module the page
 * imports, not in the page or its layouts, and whether robotsFor is asked about the page's own address (the gate indexable holds
 * that, route by route). A robots tag the page builds by a function other than robotsFor is refused as unreadable, never guessed.
 * The page checks stand apart from indexFor on purpose: indexFor answers "index" for an address outside the families it names, so
 * it cannot say that a page exists or that the page itself says index.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/seo/sitemap_families.test.ts
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { NextRequest } from "next/server";
import { generateSitemaps } from "../../src/app/sitemap";
import robots from "../../src/app/robots";
import { routeRequest } from "../../src/middleware";
import { SITEMAP_FAMILIES, listedShardIds, servedShardIds, shardUrl } from "../../src/lib/seo/sitemap_families";
import { classify, indexFor, isIndexable, robotsFor } from "../../src/lib/seo/indexable";
import { canonicalPath } from "../../src/lib/seo/alias_canonical";
import { COUNTRIES, SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { hasOwn } from "../../src/lib/own";
import { sitemapEntries } from "../../scripts/lib/sitemap_entries";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "sitemap-families";
const FILE = "src/lib/seo/sitemap_families.ts";
const SITEMAP = "src/app/sitemap.ts";
const SELF = "tests/seo/sitemap_families.test.ts";
const REMEDY = "Change SITEMAP_FAMILIES (src/lib/seo/sitemap_families.ts) or the shard's builder in src/app/sitemap.ts; rerun scripts/gen_served_files.ts";
const R_PAGE = "List only an address a page.tsx under src/app serves: fix the shard's builder in src/app/sitemap.ts, or add the page";
const R_ROBOTS = "List only a page whose robots tag says index: take the address out of the shard's builder in src/app/sitemap.ts, or set the page's robots through robotsFor (src/lib/seo/indexable.ts) and no literal noindex in the page or its layouts";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
const firstFew = (list: string[]) => (list.length ? `: ${list.slice(0, 5).join("; ")}` : "");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let caller = 0;
const passesEdge = (path: string): boolean => {
  caller++;
  const r = routeRequest(new NextRequest(`https://www.marginatlas.com${path}`, {
    headers: { host: "www.marginatlas.com", "user-agent": UA, "accept-language": "en-GB", "x-real-ip": `10.7.${caller >> 8}.${caller & 255}` },
  }));
  return r.status === 200 && r.headers.get("x-middleware-next") === "1";
};

/* THE PAGES OF THE APP, by address: every page.tsx under src/app at the address its folders make (route groups transparent), and
   the one that serves an address, matched part by part from the left with a static folder before a dynamic one (the App Router's
   order). A folder kind this walk does not read (a catch-all, a slot, an intercepting route) throws, naming it, rather than leave a
   page out. */
type AppRoute = { file: string; parts: string[] };
function appRoutes(dir = "src/app", parts: string[] = []): AppRoute[] {
  const out: AppRoute[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const at = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (e.name.startsWith("_")) continue; // private, not routable
      if (/^(?:@|\(\.|\[\.|\[\[)/.test(e.name)) throw new Error(`${at}: a folder kind the page walk does not read; teach appRoutes in ${SELF}`);
      out.push(...appRoutes(at, /^\(.*\)$/.test(e.name) ? parts : [...parts, e.name]));
    } else if (/^page\.(?:tsx|ts|jsx|js)$/.test(e.name)) out.push({ file: at, parts });
  }
  return out;
}
/* The first part of an address that [country] serves: a country the site holds, and nothing else (the one closed set the walk
   knows). Without it [country] and [country]/[geo] would serve any one-word or two-word address, /status with its page gone too. */
const COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));
const isHeldCountry = (part: string) => COUNTRY_CODES.has(part) && !TOP_LEVEL_SEGMENTS.has(part);
function pageFileFor(routes: AppRoute[], path: string): string | null {
  const parts = path.split("/").filter(Boolean);
  const fits = routes.filter(
    (r) => r.parts.length === parts.length && r.parts.every((p, i) => (p === "[country]" && i === 0 ? isHeldCountry(parts[0]) : p.startsWith("[") || p === parts[i])),
  );
  fits.sort((a, b) => {
    for (let i = 0; i < a.parts.length; i++) {
      const later = Number(a.parts[i].startsWith("[")) - Number(b.parts[i].startsWith("["));
      if (later !== 0) return later;
    }
    return 0;
  });
  return fits[0]?.file ?? null;
}

/* WHAT A PAGE SAYS ABOUT ROBOTS, read from its source (comments stripped): through robotsFor, a literal index, a literal noindex, a
   form this gate does not read, or nothing, and then the nearest layout above it that says anything answers, the root layout's
   index last. */
type RobotsMode = "robotsFor" | "index" | "none" | "noindex" | "unreadable";
const routeCode = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const robotsModeIn = (code: string): RobotsMode => {
  if (/\bnoindex\b|\bindex\s*:\s*false\b/i.test(code)) return "noindex";
  if (!/\brobots\s*:/.test(code)) return "none";
  if (/\brobots\s*:\s*robotsFor\(/.test(code)) return "robotsFor";
  return /\brobots\s*:\s*\{\s*index\s*:\s*true\b/.test(code) ? "index" : "unreadable";
};
function robotsOfPage(pageFile: string): { mode: RobotsMode; via: string } {
  const own = robotsModeIn(routeCode(pageFile));
  if (own !== "none") return { mode: own, via: pageFile };
  const dirs = pageFile.split("/").slice(0, -1);
  for (let n = dirs.length; n >= 2; n--) {
    const layout = `${dirs.slice(0, n).join("/")}/layout.tsx`;
    if (!existsSync(layout)) continue;
    const mode = robotsModeIn(routeCode(layout));
    if (mode !== "none") return { mode, via: layout };
  }
  return { mode: "none", via: pageFile };
}

async function main(): Promise<void> {
  /* THE TABLE */
  const ids = SITEMAP_FAMILIES.map((s) => s.id);
  check(`the table names each shard once (${ids.join(", ")})`, new Set(ids).size === ids.length);
  check(`the listed shards are 0, 3, 6, 7 and 8 (got ${listedShardIds().join(", ")})`, JSON.stringify(listedShardIds()) === "[0,3,6,7,8]");
  check("shards 1, 2, 4 and 5 answer empty and are not listed", JSON.stringify(SITEMAP_FAMILIES.filter((s) => s.state === "empty").map((s) => s.id)) === "[1,2,4,5]");
  check("shards 9 to 12 are reserved: trade per country, where to open, editions, retired addresses", JSON.stringify(SITEMAP_FAMILIES.filter((s) => s.state === "reserved").map((s) => s.id)) === "[9,10,11,12]");
  const generated = (await generateSitemaps()).map((g) => Number(g.id));
  check(`generateSitemaps writes every listed and every empty shard (${generated.join(", ")})`, JSON.stringify(generated) === JSON.stringify(servedShardIds()), SITEMAP);
  const declared = ([] as string[]).concat(robots().sitemap ?? []);
  check(`robots.txt lists exactly the listed shards (${declared.length})`, JSON.stringify(declared) === JSON.stringify(listedShardIds().map(shardUrl)), "src/app/robots.ts");

  /* THE EMPTY SHARDS */
  for (const s of SITEMAP_FAMILIES.filter((x) => x.state === "empty")) {
    const n = (await sitemapEntries([s.id])).length;
    check(`shard ${s.id} answers empty (${n} addresses)`, n === 0, SITEMAP);
  }

  /* EVERY LISTED ADDRESS */
  const entries = await sitemapEntries();
  const familyOf = new Map(SITEMAP_FAMILIES.map((s) => [s.id, s.family] as const));
  const wrongFamily = entries.filter((e) => classify(e.path) !== familyOf.get(e.shard)).map((e) => `${e.path} (shard ${e.shard}, a ${classify(e.path)} page)`);
  check(`every address sits in its family's shard (${entries.length})${firstFew(wrongFamily)}`, entries.length > 0 && wrongFamily.length === 0, SITEMAP);
  const refused = entries.filter((e) => !isIndexable(e.path)).map((e) => `${e.path} (${indexFor(e.path).reason})`);
  check(`every address is one indexFor admits${firstFew(refused)}`, refused.length === 0, SITEMAP);
  const notSelf = entries.filter((e) => canonicalPath(e.path) !== e.path).map((e) => `${e.path} names ${canonicalPath(e.path)}`);
  check(`every address names itself canonical${firstFew(notSelf)}`, notSelf.length === 0, SITEMAP);
  const held = entries.filter((e) => !passesEdge(e.path)).map((e) => e.path);
  check(`every address passes the edge untouched, no 404 and no redirect (${caller} asked)${firstFew(held)}`, held.length === 0, "src/middleware.ts");
  const seen = new Map<string, number>();
  const twice: string[] = [];
  for (const e of entries) {
    const at = seen.get(e.path);
    if (at !== undefined) twice.push(`${e.path} (shards ${at} and ${e.shard})`);
    seen.set(e.path, e.shard);
  }
  check(`no address is listed twice${firstFew(twice)}`, twice.length === 0, SITEMAP);
  const live = Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((s) => !hasOwn(RETIRED, s));
  const londonListed = entries.filter((e) => e.shard === 8).length;
  check(`shard 8 lists London's ${live.length} trade pages (${londonListed})`, londonListed === live.length, SITEMAP);
  check("no industries hub is listed", entries.every((e) => classify(e.path) !== "hub"), SITEMAP);

  /* A PAGE THE SITE SERVES, AND ITS OWN ROBOTS TAG SAYS INDEX. indexFor answers "index" for an address outside the families it
     names, so on its own it vouches for no page: the pages are asked, by their files. */
  const routes = appRoutes();
  const pageOf = new Map<string, string>();
  const unserved: string[] = [];
  for (const e of entries) {
    const page = pageFileFor(routes, e.path);
    if (page) pageOf.set(e.path, page);
    else unserved.push(e.path);
  }
  check(`every address is served by a page.tsx under src/app (${pageOf.size} of ${entries.length}, by ${new Set(pageOf.values()).size} pages of ${routes.length})${firstFew(unserved)}`, entries.length > 0 && unserved.length === 0, SITEMAP, R_PAGE);
  const saysNoindex: string[] = [];
  const modes = new Map<string, number>();
  for (const e of entries) {
    const page = pageOf.get(e.path);
    if (!page) continue;
    const { mode, via } = robotsOfPage(page);
    modes.set(mode, (modes.get(mode) ?? 0) + 1);
    if (mode === "noindex" || mode === "unreadable") saysNoindex.push(`${e.path} (${mode} in ${via})`);
    else if (mode === "robotsFor" && !(robotsFor(e.path).index && robotsFor(e.path).googleBot.index)) saysNoindex.push(`${e.path} (robotsFor answers noindex in ${via})`);
  }
  check(`the robots tag of the page serving every address says index (${[...modes].map(([m, n]) => `${n} ${m}`).join(", ")})${firstFew(saysNoindex)}`, entries.length > 0 && saysNoindex.length === 0, SITEMAP, R_ROBOTS);

  /* LASTMOD: A PAGE'S OWN DATE OR NOTHING */
  const timed = entries
    .filter((e) => e.lastModified !== undefined && !(typeof e.lastModified === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.lastModified)))
    .map((e) => `${e.path} (${String(e.lastModified)})`);
  check(`every lastmod is a page's own date or absent${firstFew(timed)}`, timed.length === 0, SITEMAP);
  const code = stripCommentLines(readFileSync(SITEMAP, "utf8").split("\n")).join("\n");
  check("the sitemap file never stamps the build's time (no `new Date()`)", !/new Date\(\s*\)/.test(code), SITEMAP);
}

main().then(
  () => {
    if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
    console.log("seo/sitemap_families: all pass");
    process.exit(0);
  },
  (e: unknown) => {
    failed++;
    red({ rule: RULE, file: SITEMAP, detail: `the sitemaps could not be asked offline: ${e instanceof Error ? e.stack ?? e.message : String(e)}`.slice(0, 400), remedy: REMEDY });
    redSummary(RULE, failed, REMEDY, "checks failed");
    process.exit(1);
  },
);
