/**
 * scripts/verify_dead_anchors.ts
 *
 * THE OTHER HALF OF THE DEAD-LINK CHECK.
 *
 * `find_dead_links.ts` verifies that the ROUTE behind an href exists, and on
 * line 88 it does this:
 *
 *     const clean = path.split("#")[0].split("?")[0];
 *
 * The fragment is thrown away before anything is checked. So `/about-data#tax`
 * passes for exactly as long as `/about-data` exists, whether or not anything
 * on that page is called `tax`.
 *
 * That is not hypothetical. On 2026-07-29 the site footer , which renders on
 * every page , carried FIVE anchors into `about-data`: `#contact`, `#glossary`,
 * `#quality`, `#sources` and `#tax`. The page defined `#estimated`,
 * `#measured`, `#modeled` and `#regional`. All five links landed silently at
 * the top of the page, and had done for as long as the footer had existed,
 * under a green gate.
 *
 * A fragment that goes nowhere is worse than a 404. A 404 tells the reader
 * something is wrong; a dead fragment just quietly fails to scroll, and the
 * reader concludes the content is missing or that they misread the link.
 *
 * WHAT IT CHECKS. Every internal href carrying a fragment, where the target
 * route is a page we own. The target page must define that id.
 *
 * WHAT IT DOES NOT CHECK, deliberately:
 *   - ids produced at runtime from data (a chapter anchor built from a slug).
 *     Those cannot be seen statically, so a target file that generates ids in a
 *     template literal is skipped rather than guessed at.
 *   - external links.
 *   - `#` alone, which is a deliberate no-op.
 *
 * Usage: node --experimental-strip-types scripts/verify_dead_anchors.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";

const APP = resolve(process.cwd(), "src/app");
const SRC = resolve(process.cwd(), "src");

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

/**
 * Resolve a URL path to the page file that serves it.
 * Route groups like `(site)` do not appear in the URL, so a path may live at
 * either depth and both are tried.
 */
function pageFileFor(urlPath: string): string | null {
  const seg = urlPath.replace(/^\/+|\/+$/g, "");
  const candidates = seg
    ? [`${APP}/${seg}/page.tsx`, `${APP}/(site)/${seg}/page.tsx`]
    : [`${APP}/page.tsx`, `${APP}/(site)/page.tsx`];
  return candidates.find((c) => existsSync(c)) ?? null;
}

/** Ids a file defines literally. Template-built ids are invisible here. */
function idsIn(file: string): { ids: Set<string>; dynamic: boolean } {
  const src = readFileSync(file, "utf8");
  const ids = new Set<string>();
  for (const m of src.matchAll(/\bid=["']([A-Za-z][\w-]*)["']/g)) ids.add(m[1]);
  // `id={`ch-${n}`}` or `id={anchor}` , generated, so we cannot judge this page.
  const dynamic = /\bid=\{/.test(src);
  return { ids, dynamic };
}

const failures: string[] = [];
const skipped: string[] = [];
let checked = 0;

for (const file of walk(SRC)) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/href=["'](\/[^"'#]*)#([A-Za-z][\w-]*)["']/g)) {
      const [, path, frag] = m;
      const target = pageFileFor(path);
      if (!target) return; // find_dead_links owns missing routes
      checked++;
      const { ids, dynamic } = idsIn(target);
      if (ids.has(frag)) return;
      if (dynamic) {
        skipped.push(`${rel}:${i + 1}  ${path}#${frag}  (target builds ids at runtime)`);
        return;
      }
      failures.push(
        `${rel}:${i + 1}  ${path}#${frag}\n      ${relative(process.cwd(), target).replace(/\\/g, "/")} defines: ${[...ids].join(", ") || "(no ids at all)"}`,
      );
    }
  });
}

if (failures.length) {
  console.error(`x verify_dead_anchors: ${failures.length} link(s) point at a fragment that does not exist.\n`);
  for (const f of failures) console.error("   " + f);
  console.error(
    "\n   A dead fragment is worse than a 404: it fails to scroll and the reader\n" +
      "   concludes the content is missing. Add the id, point the link somewhere\n" +
      "   real, or remove it. Do not leave it promising a section.",
  );
  process.exit(1);
}
console.log(
  `verify_dead_anchors: PASS. ${checked} fragment link(s) checked` +
    (skipped.length ? `, ${skipped.length} skipped (runtime ids).` : "."),
);
