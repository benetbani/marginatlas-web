/**
 * verify_page_has_h1 , every public page says what it is.
 *
 * /margin-index is the site's free keep-ranked leaderboard, linked from the
 * footer and the home page, and it had no h1. Its only heading came from
 * <Movement>, which emits an h2 and lives inside the view component, so the
 * document outline started at h2 whenever the board resolved and there was no
 * heading at all when it did not: the controls, and one unstyled sentence.
 *
 * Nothing caught it because a heading usually arrives through a component, so
 * grepping the page file alone answers the wrong question. This gate follows
 * the imports.
 *
 * NOT a crawler rule. A reader landing mid-site needs the page to name itself,
 * and a heading that only exists on the happy path is exactly the one missing
 * when a reader most needs to know where they are.
 *
 * The check is a transitive scan, bounded at depth 3, over local imports
 * (`@/...` and relative). It answers "can an h1 be reached from this page",
 * which is a lower bar than "does one render on every branch": a page whose h1
 * sits behind a conditional passes here. That limit is stated rather than
 * hidden, because the margin-index defect was precisely of that shape once the
 * board failed to resolve, and this gate would not have caught it if the h1 had
 * lived in the view. Put the h1 on the page, not in the branch.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";

import { newCommentState, stripComments } from "./lib/strip_comments";

const PROJECT_ROOT = process.cwd();
const APP_DIR = resolve(PROJECT_ROOT, "src", "app");

/**
 * Routes that must NOT carry an h1, with the reason each one is exempt.
 * Both emit no page of their own; an h1 would be wrong, not missing.
 */
const EXEMPT: Array<[string, string]> = [
  [
    "(site)/browse/page.tsx",
    "permanentRedirect throws before render; the 308 carries no body at all",
  ],
  [
    "embed/[country]/[geo]/[industry]/page.tsx",
    "an iframe fragment inside someone else's document; an h1 would inject a heading into THEIR outline",
  ],
];

/** Source with comments removed, so a comment mentioning h1 never counts. */
function codeOf(file: string): string {
  let src: string;
  try {
    src = readFileSync(file, "utf-8");
  } catch {
    return "";
  }
  const state = newCommentState();
  return src
    .split("\n")
    .map((l) => stripComments(l, state))
    .join("\n");
}

function resolveImport(spec: string, fromFile: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = resolve(PROJECT_ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null; // a package, never ours
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  return existsSync(base) && statSync(base).isFile() ? base : null;
}

function reachesH1(file: string, seen = new Set<string>(), depth = 0): boolean {
  if (depth > 3 || seen.has(file)) return false;
  seen.add(file);
  const code = codeOf(file);
  if (/<h1[\s>]/.test(code)) return true;
  for (const m of code.matchAll(/from\s+["']([^"']+)["']/g)) {
    const target = resolveImport(m[1], file);
    if (target && reachesH1(target, seen, depth + 1)) return true;
  }
  return false;
}

function pages(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) pages(p, acc);
    else if (name === "page.tsx") acc.push(p);
  }
  return acc;
}

const rel = (p: string) =>
  p.replace(APP_DIR, "").replace(/^[\\/]/, "").replace(/\\/g, "/");

/* /dev is sealed from crawlers and _design is a Next private folder that does
   not route. /admin is internal by design and operated, not read. */
const isPublic = (p: string) => {
  const r = rel(p);
  return (
    !r.startsWith("dev/") && !r.includes("/admin/") && !r.startsWith("admin/") && !r.includes("_design")
  );
};

const exemptSet = new Set(EXEMPT.map(([p]) => p));
const missing = pages(APP_DIR)
  .filter(isPublic)
  .filter((p) => !exemptSet.has(rel(p)))
  .filter((p) => !reachesH1(p));

if (missing.length === 0) {
  console.log(
    `[verify_page_has_h1] PASS: every public page names itself ` +
      `(${EXEMPT.length} documented exemption(s))`,
  );
  process.exit(0);
}

console.error(
  `[verify_page_has_h1] FAIL: ${missing.length} public page(s) with no ` +
    `reachable <h1>:`,
);
for (const m of missing) console.error(`  ${rel(m)}`);
console.error(
  "\nA reader landing here cannot tell what the page is. Put an h1 on the " +
    "\nPAGE rather than inside a view component, so it survives the branch " +
    "\nwhere the data does not resolve. If the route genuinely must not carry " +
    "\none, add it to EXEMPT in this file with the reason.",
);
process.exit(1);
