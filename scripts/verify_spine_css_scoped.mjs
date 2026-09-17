/**
 * verify_spine_css_scoped: THE SPINE STYLESHEET STAYS UNDER .av2, READ FROM THE
 * SITE'S OWN FILE (plan step 14, 2026-09-17).
 *
 * `src/styles/atlas-spine.css` was GENERATED until 2026-09-17 from the parent
 * repository's design/mockups/atlas.css by scripts/scope_atlas_css.mjs, and the
 * chain's `spine-css-fresh` gate compared the two. Plan step 5 retired that
 * mockup stylesheet (the July glass-and-map system he killed on 2026-09-07), so
 * the gate went red against a source that no longer means anything and would
 * have stayed red forever, which is how a gate gets ignored on the day it is
 * right. The generator is deleted with this file's arrival; the stylesheet is
 * the site's own now and is edited by hand like any other.
 *
 * What the generator guaranteed BY CONSTRUCTION is what this gate now asserts
 * BY READING, and both are properties of a file in src/, never of another repo:
 *   1. Every rule outside @keyframes is scoped: each selector starts with `.av2`
 *      (`.av2`, `.av2 ...`, `.av2::after`, `.av2, .av2 *`) or is the one
 *      sanctioned escape, `html:has(.av2)`, which carries scroll-behavior to
 *      the real scrolling element. A bare selector would leak the v2 system
 *      into every page that does not opt in.
 *   2. No rule whose selector list includes `.av2` itself declares transform,
 *      filter, backdrop-filter, perspective, will-change or contain: any of
 *      those makes .av2 a containing block for position:fixed and breaks the
 *      jump rail, the jump sheet and the grain layer, which are viewport-fixed.
 *
 * A red names the file, the line, the rule and the remedy. Negative test:
 *   node scripts/verify_spine_css_scoped.mjs --css=<path to a copy with a lie>
 * Usage in the chain: node scripts/verify_spine_css_scoped.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";

const SCOPE = ".av2";
const ESCAPE = "html:has(.av2)";
const CONTAINING = /^(transform|filter|backdrop-filter|perspective|will-change|contain)$/;
const cssArg = process.argv.find((a) => a.startsWith("--css="));
const FILE = cssArg ? resolve(cssArg.slice("--css=".length)) : resolve("src/styles/atlas-spine.css");

const root = postcss.parse(readFileSync(FILE, "utf8"), { from: FILE });
const failures = [];
let rules = 0;

function inKeyframes(rule) {
  for (let p = rule.parent; p; p = p.parent) if (p.type === "atrule" && /keyframes$/i.test(p.name)) return true;
  return false;
}
function scoped(sel) {
  const s = sel.trim();
  if (s === ESCAPE) return true;
  if (s === SCOPE) return true;
  if (!s.startsWith(SCOPE)) return false;
  /* `.av2x` is not `.av2`; the character after the scope must end the class name. */
  const next = s.charAt(SCOPE.length);
  return next === "" || /[\s:.,>+~\[]/.test(next);
}

root.walkRules((rule) => {
  if (inKeyframes(rule)) return;
  rules++;
  const line = rule.source?.start?.line ?? 0;
  for (const sel of rule.selectors) {
    if (!scoped(sel)) failures.push(`${FILE}:${line}: rule "${sel}" is not under ${SCOPE} (SCOPED). Remedy: prefix it with "${SCOPE} " or delete it; the only escape is "${ESCAPE}".`);
  }
  if (rule.selectors.some((s) => s.trim() === SCOPE)) {
    rule.walkDecls((d) => {
      if (CONTAINING.test(d.prop)) failures.push(`${FILE}:${d.source?.start?.line ?? line}: "${d.prop}: ${d.value}" on ${SCOPE} itself (NO CONTAINING BLOCK). Remedy: move it to a child; .av2 must stay a plain box so the fixed jump rail, jump sheet and grain layer keep the viewport.`);
    });
  }
});

if (failures.length) {
  console.error(`x verify_spine_css_scoped: ${failures.length} finding(s) in ${FILE}`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`ok verify_spine_css_scoped: ${rules} rules, every one under ${SCOPE} (or ${ESCAPE}), none making .av2 a containing block.`);
