#!/usr/bin/env node
/**
 * scripts/verify_search_params_suspense.mjs
 *
 * A CLIENT COMPONENT READING useSearchParams WITHOUT A SUSPENSE BOUNDARY MAKES
 * THE WHOLE PAGE INVISIBLE TO A CRAWLER, AND NOTHING ELSE NOTICES.
 *
 * This is Next's documented behaviour, and the failure mode is the worst kind:
 * the page looks perfect in a browser. Next still reports the route as
 * prerendered. The build passes. But the HTML that gets served contains only the
 * chrome and the React payload, so the rendered markup exists solely as escaped
 * strings inside a script tag.
 *
 * Found on 2026-08-09, on two live routes, measured on production:
 *
 *     /decide         h1=0  h2=0  p=0  20 divs   9 visible words
 *     /margin-index   h1=0  h2=0  p=0  20 divs   9 visible words
 *     /compare        h1=1  h2=2  p=10 179 divs  831 visible words
 *
 * All three use the same hook, src/lib/url_state.ts:64 -> useSearchParams.
 * /compare renders because it wraps its client in Suspense. The other two never
 * got the boundary, and /margin-index's own docstring claimed it was
 * "server-rendered so the no-JS answer is present (crawlable)" while it was not.
 *
 * THE CHECK. For every shipping page.tsx: collect the components it imports from
 * its own route folder or from src/components. If the page or any of those
 * files reaches useSearchParams (directly or through useUrlStateMap), the page
 * must contain a Suspense boundary.
 *
 * ONE LEVEL OF IMPORT DEPTH, deliberately. Full transitive analysis needs a
 * module graph, and every real instance of this defect has been a page
 * rendering a client island directly. Stated plainly because it is the blind
 * spot: a component that hides the hook two levels down will not be caught.
 *
 * Measured clean after the fix, so this is a HARD gate rather than a ratchet.
 *
 *   node scripts/verify_search_params_suspense.mjs
 */
import fs from "node:fs";
import path from "node:path";

const APP = "src/app";
const HOOK = /useSearchParams|useUrlStateMap/;

/**
 * Comments are stripped before the hook is looked for, and the first run of this
 * gate is why. It flagged the cell page, whose only two matches are the words
 * "useSearchParams" inside two `//` comments EXPLAINING the behaviour. The page
 * renders 33 paragraphs on production. A gate that cannot tell a call from a
 * note about a call reports a working page as broken, and this is the third
 * time that exact class has appeared in this repository today.
 */
function code(file) {
  return fs
    .readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
}

/** Every shipping page.tsx. /dev is the workshop and is excluded. */
function pages(dir = APP, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (e.name !== "dev") pages(p, out);
    } else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

/** Resolve a page's local imports to files on disk. Relative and @/ only. */
function importedFiles(pageFile) {
  const src = code(pageFile);
  const dir = path.dirname(pageFile);
  const out = [];
  for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    let base = null;
    if (spec.startsWith("./") || spec.startsWith("../")) base = path.join(dir, spec);
    else if (spec.startsWith("@/")) base = path.join("src", spec.slice(2));
    if (!base) continue;
    for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
      const f = (base + ext).replace(/\\/g, "/");
      if (fs.existsSync(f)) { out.push(f); break; }
    }
  }
  return out;
}

let failed = 0;
const offenders = [];
let scanned = 0;

for (const page of pages()) {
  const src = code(page);
  const deps = importedFiles(page);
  const reaches =
    HOOK.test(src) || deps.some((d) => HOOK.test(code(d)));
  if (!reaches) continue;
  scanned++;
  if (!/<Suspense/.test(src)) {
    offenders.push({
      page,
      via: deps.filter((d) => HOOK.test(code(d))).map((d) => path.basename(d)),
    });
  }
}

console.log(`search-params-suspense: ${scanned} page(s) reach useSearchParams`);

if (offenders.length > 0) {
  failed++;
  console.error(`\nx ${offenders.length} page(s) read search params with no Suspense boundary:\n`);
  for (const o of offenders) {
    console.error(`  ${o.page}`);
    if (o.via.length) console.error(`      via ${o.via.join(", ")}`);
  }
  console.error(
    `\n  Next opts the ENTIRE route into client-side rendering. The page still\n` +
      `  builds, still reports as prerendered, and still looks right in a browser,\n` +
      `  but the served HTML carries no headings and no paragraphs. Wrap the client\n` +
      `  in <Suspense fallback={...}>, as src/app/(site)/compare/page.tsx does.`,
  );
}

if (failed > 0) {
  console.error(`search-params-suspense: ${failed} failure(s)`);
  process.exit(1);
}
console.log("search-params-suspense: every one of them is wrapped");
process.exit(0);
