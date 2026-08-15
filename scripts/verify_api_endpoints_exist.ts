/**
 * verify_api_endpoints_exist , a form must post somewhere that exists.
 *
 * LeadMagnetForm defaulted to /api/lead-magnet/2026-benchmarks. There is no
 * lead-magnet route in this app and never was; the only signup endpoint is
 * /api/newsletter, which three sibling forms had been using all along.
 *
 * LeadMagnetForm is mounted on the HOME PAGE and on /download/2026-benchmarks,
 * so every email typed into either one POSTed to a 404, hit `if (!res.ok)
 * throw`, and showed the error state. Nothing was captured. The signup panel on
 * the front page of the site had never worked.
 *
 * Nothing could see it. find_dead_links reads `href=` attributes, which is a
 * different syntax and a different question. TypeScript is perfectly happy with
 * a string. And the failure is invisible from the outside: a reader who gets an
 * error assumes they mistyped something, and a developer testing the happy path
 * never sees a 404 they did not cause.
 *
 * So: every literal /api/... path in the source must correspond to a route
 * handler on disk. Template literals are skipped, as they are in find_dead_links,
 * because a path assembled at runtime cannot be resolved here.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, relative } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const SRC = resolve(PROJECT_ROOT, "src");
const API = resolve(SRC, "app", "api");

/** Route handlers on disk, as URL paths, with [dynamic] segments as wildcards. */
function buildApiPatterns(): RegExp[] {
  const patterns: RegExp[] = [];
  const walk = (dir: string) => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    const hasRoute =
      existsSync(join(dir, "route.ts")) || existsSync(join(dir, "route.tsx"));
    if (hasRoute) {
      const rel = relative(resolve(SRC, "app"), dir).replace(/\\/g, "/");
      const parts = rel.split("/").map((seg) => {
        if (seg.startsWith("[") && seg.endsWith("]")) {
          return seg.startsWith("[...") ? "(.+)" : "([^/]+)";
        }
        return seg.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      });
      patterns.push(new RegExp("^/" + parts.join("/") + "$"));
    }
    for (const name of entries) {
      const p = join(dir, name);
      try {
        if (statSync(p).isDirectory()) walk(p);
      } catch {
        /* unreadable, skip */
      }
    }
  };
  walk(API);
  return patterns;
}

/**
 * A literal /api/<something> path.
 *
 * The first character after /api/ must be alphanumeric, which is what
 * distinguishes an endpoint from a PREFIX. Bare "/api/" appears eight times in
 * robots.ts and middleware.ts as a Disallow directive and as path matching, and
 * the first version of this gate reported all eight as missing routes. A prefix
 * is not a call.
 */
const TARGET = /["'`](\/api\/[a-z0-9][^"'`?#\s]*)["'`?#]/gi;

type Hit = { file: string; line: number; path: string };

function walkFiles(dir: string, acc: string[] = []): string[] {
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
    if (s.isDirectory()) walkFiles(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

const patterns = buildApiPatterns();
const hits: Hit[] = [];

for (const file of walkFiles(SRC)) {
  // The route handlers themselves name their own paths in docstrings.
  if (file.startsWith(API)) continue;
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
    if (lines[i].includes("allow-missing-endpoint")) continue;
    TARGET.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TARGET.exec(code)) !== null) {
      const path = m[1];
      // Assembled at runtime; cannot be resolved statically.
      if (path.includes("${")) continue;
      if (patterns.some((re) => re.test(path))) continue;
      hits.push({
        file: file.replace(PROJECT_ROOT, "."),
        line: i + 1,
        path,
      });
    }
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_api_endpoints_exist] PASS: every literal /api path resolves ` +
      `(${patterns.length} route handler(s))`,
  );
  process.exit(0);
}

console.error(
  `[verify_api_endpoints_exist] FAIL: ${hits.length} reference(s) to an API ` +
    `route that does not exist:`,
);
for (const h of hits) console.error(`  ${h.file}:${h.line}: ${h.path}`);
console.error(
  "\nA form posting here gets a 404. Depending on how the caller checks the " +
    "\nresponse that is either a silent error state or, worse, a success " +
    "\nmessage for something that never happened. Point it at a real handler " +
    "\nor build one.",
);
process.exit(1);
