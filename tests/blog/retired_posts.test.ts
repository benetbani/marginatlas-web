/**
 * THE 58 RETIRED BLOG POSTS (his ruling of 2026-10-05 on PARKED P36.1, option (a): keep 2, rewrite 10, retire 58 before the site
 * goes public, each with a permanent redirect to its country page or the nearest live page). data/blog/retired_posts.json holds
 * the list and each post's destination, from the research's per-post verdicts; next.config.js redirects each one.
 *
 * Holds: 58 entries; none of them left in content/blog; the two kept posts and the eight rewritten still there and nothing else
 * (two of the ten to rewrite, method notes with no figure of their own, moved onto About the figures on 2026-10-06, each slug
 * redirecting to its section from data/blog/moved_posts.json, held here like the 58);
 * every destination a page that lives (a country of COUNTRIES, a route folder that exists, a live trade, a post still published),
 * never another retired post; next.config.js's redirects carry each one, permanent; no link anywhere in src/ or content/ to a
 * retired post.
 *
 * Run: npx tsx tests/blog/retired_posts.test.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "blog-retired";
const FILE = "data/blog/retired_posts.json";
const REMEDY = "retire the post with its redirect (data/blog/retired_posts.json and next.config.js), its file out of content/blog";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const KEEP = ["difference-between-firm-and-establishment", "median-vs-average"];
const REWRITE = [
  "global-hairdressers", "global-restaurants-overview", "global-retail-shifts", "hidden-economy-solo-proprietors",
  "how-to-benchmark-your-business", "industry-classification-different-meanings", "reading-eurostat-sbs",
  "size-band-statistics-matter",
];
/* THE TWO MOVED (P36.1, the rewrites of 2026-10-06; docs/superpowers/plans/2026-10-06-blog-rewrites/PLAN.md, D1). */
const MOVED_FILE = "data/blog/moved_posts.json";
const MOVED = ["what-we-omit", "when-we-extrapolate"];
const moved = existsSync(MOVED_FILE) ? (JSON.parse(readFileSync(MOVED_FILE, "utf8")) as { posts: Record<string, { to: string }> }).posts : {};

const list = existsSync(FILE) ? (JSON.parse(readFileSync(FILE, "utf8")) as { posts: Record<string, { to: string }> }).posts : {};
const retired = Object.keys(list);
check(`58 posts retired (${retired.length})`, retired.length === 58);
check("none of the kept or rewritten posts is retired", ![...KEEP, ...REWRITE].some((s) => s in list));
check(`the two method notes are moved, and only they (${Object.keys(moved).join(", ")})`, JSON.stringify(Object.keys(moved).sort()) === JSON.stringify([...MOVED].sort()));
check("no moved post is also retired", !MOVED.some((s) => s in list));

const onDisk = readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
check(`no retired post left in content/blog (${onDisk.filter((s) => s in list).join(", ") || "none"})`, !onDisk.some((s) => s in list));
check(`content/blog holds the two kept and the eight rewritten, and nothing else (${onDisk.length} files)`,
  JSON.stringify([...onDisk].sort()) === JSON.stringify([...KEEP, ...REWRITE].sort()));

/* A moved post lands on a section of About the figures that exists: its id is in the page. */
const aboutData = readFileSync("src/app/(site)/about-data/page.tsx", "utf8");
const lost = MOVED.filter((s) => { const m = /^\/about-data#([a-z-]+)$/.exec(moved[s]?.to ?? ""); return !m || !aboutData.includes(`id="${m[1]}"`); });
check(`every moved post lands on a section of About the figures that exists (${lost.join(", ") || "both"})`, lost.length === 0);

/* A destination lives: a country page, a route folder that exists, a live trade, a published post. */
const codes = new Set((COUNTRIES as Array<{ code: string }>).map((c) => c.code.toLowerCase()));
const routeExists = (seg: string) => ["src/app", "src/app/(site)"].some((d) => existsSync(join(d, seg, "page.tsx")));
const lives = (to: string): boolean => {
  const parts = to.split("/").filter(Boolean);
  if (parts.length === 1 && codes.has(parts[0])) return true;
  if (parts.length === 1) return routeExists(parts[0]);
  if (parts[0] === "industries" && parts.length === 2) return parts[1] in SLUG_TO_INDUSTRY && !(parts[1] in RETIRED);
  if (parts[0] === "blog" && parts.length === 2) return onDisk.includes(parts[1]) && !(parts[1] in list);
  return false;
};
const dead = retired.filter((s) => !lives(list[s].to));
check(`every destination is a page that lives (${dead.map((s) => `${s} -> ${list[s].to}`).join("; ") || "all"})`, dead.length === 0);

/* next.config.js carries each redirect, permanent. */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require(resolve("next.config.js")) as { redirects?: () => Promise<Array<{ source: string; destination: string; permanent: boolean }>> };
(async () => {
  const redirects = config.redirects ? await config.redirects() : [];
  const bySource = new Map(redirects.map((r) => [r.source, r]));
  const missing = retired.filter((s) => { const r = bySource.get(`/blog/${s}`); return !r || r.destination !== list[s].to || r.permanent !== true; });
  check(`next.config.js redirects every retired post to its destination, permanent (${missing.join(", ") || "all 58"})`, missing.length === 0);
  const missingMoved = MOVED.filter((s) => { const r = bySource.get(`/blog/${s}`); return !r || r.destination !== moved[s]?.to || r.permanent !== true; });
  check(`next.config.js redirects both moved posts to their sections, permanent (${missingMoved.join(", ") || "both"})`, missingMoved.length === 0);

  /* No link to a retired post anywhere a reader can follow one. */
  const linked: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(tsx?|md|mdx|json)$/.test(name) || p.replace(/\\/g, "/") === FILE) continue;
      const text = readFileSync(p, "utf8");
      for (const s of [...retired, ...MOVED]) if (text.includes(`/blog/${s}"`) || text.includes(`/blog/${s})`) || text.includes(`/blog/${s}#`)) linked.push(`${p}: /blog/${s}`);
    }
  };
  walk("src"); walk("content");
  check(`no link in src/ or content/ to a retired or moved post (${linked.slice(0, 3).join("; ") || "none"})`, linked.length === 0);

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("blog/retired_posts: all pass");
})();
