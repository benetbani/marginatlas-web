/**
 * scripts/scope_atlas_css.mjs
 *
 * Wave 4 foundation. Reads the frozen mockup stylesheet at
 * E:/atlas/design/mockups/atlas.css (the single source of truth, ratified to
 * ship AS WRITTEN per DECISIONS-PORT-AND-LAUNCH) and emits a scoped copy at
 * src/styles/atlas-spine.css in which every rule is confined under the `.av2`
 * root class, so the v2 visual system cannot leak into the 615 existing pages.
 *
 * Re-run after any mockup stylesheet change:  node scripts/scope_atlas_css.mjs
 * NEVER edit src/styles/atlas-spine.css by hand; it is generated.
 *
 * Transform rules (mechanical):
 *   :root            -> .av2                (tokens attach to the page-tree root)
 *   html, body       -> .av2
 *   body::after      -> .av2::after         (the grain layer; position:fixed on a
 *                                            pseudo is viewport-relative as long as
 *                                            .av2 itself has no transform/filter,
 *                                            which this script asserts)
 *   *                -> .av2, .av2 *        (the reset)
 *   anything else    -> .av2 <selector>     (descendant scope)
 *   @keyframes       -> pass through untouched (from/to/% are not selectors)
 *   @media/@supports -> recurse into their rules
 *
 * Special cases:
 *   1. `html{scroll-behavior:smooth}` (v11 jump layer) must live on the real
 *      scrolling element, so it becomes `html:has(.av2)` , the one rule that
 *      escapes the wrapper, and it carries no var() so it needs no tokens.
 *   2. The --sans/--fig font tokens gain the next/font CSS variables
 *      (--font-geist / --font-grotesk, provided by src/lib/fonts-spine.ts on
 *      the .av2 wrapper) ahead of the mockups' Google-Fonts stacks, which
 *      remain as fallback.
 *   3. Relative url() asset references (the .skyline hero images) would be
 *      module-resolved by Next's css-loader and fail the build, so they are
 *      rewritten to absolute /spine/<name> URLs (passed through untouched)
 *      and the files that exist in the mockup folder are copied into
 *      public/spine/. A reference whose file does not exist (the mockups ship
 *      url(_skyline.jpeg) with no such file, relying on a tolerant 404 plus
 *      the london.png fallback layer) keeps its layer and 404s harmlessly,
 *      exactly as the mockup does.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import postcss from "postcss";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, "../../design/mockups/atlas.css");
const OUT = resolve(here, "../src/styles/atlas-spine.css");
const SCOPE = ".av2";

/* Same trap as sync_glyphs, same cause, and it would have surfaced the moment
   the glyph one was fixed: this reads ../../design/mockups/atlas.css, which
   lives in the PARENT repository and is never present on a build server. See
   the long note in scripts/sync_glyphs.mjs. A freshness check with no source
   cannot verify anything, and the generated stylesheet is committed. */
if (!existsSync(SRC)) {
  console.log(
    `scope_atlas_css: SKIPPED. The mockup stylesheet is not in this repository\n` +
      `  (${SRC})\n` +
      `  It lives in the parent project, so a build server never has it. Nothing to\n` +
      `  verify here; the scoped stylesheet is committed. This is not a pass.`,
  );
  process.exit(0);
}

const input = readFileSync(SRC, "utf8");
const root = postcss.parse(input, { from: SRC });

/** True when the rule sits inside an @keyframes block. */
function inKeyframes(rule) {
  for (let p = rule.parent; p; p = p.parent) {
    if (p.type === "atrule" && /keyframes$/i.test(p.name)) return true;
  }
  return false;
}

function mapSelector(sel) {
  const s = sel.trim();
  if (s === ":root" || s === "html" || s === "body") return SCOPE;
  if (s === "*") return `${SCOPE}, ${SCOPE} *`;
  if (s.startsWith("body")) return SCOPE + s.slice("body".length);
  if (s.startsWith("html")) return SCOPE + s.slice("html".length);
  return `${SCOPE} ${s}`;
}

let ruleCount = 0;
let scopeLevelTransform = null;

root.walkRules((rule) => {
  if (inKeyframes(rule)) return;
  ruleCount++;

  // Special case 1: html{scroll-behavior:smooth} must target the scroller.
  if (rule.selector === "html") {
    const props = [];
    rule.walkDecls((d) => props.push(d.prop));
    if (props.length > 0 && props.every((p) => p === "scroll-behavior")) {
      rule.selector = `html:has(${SCOPE})`;
      return;
    }
  }

  rule.selectors = rule.selectors.map(mapSelector);

  // Assert: nothing mapped onto .av2 itself may create a containing block for
  // position:fixed (the .jumprail/.jumpsheet/grain layers depend on viewport
  // positioning). transform/filter/backdrop-filter/perspective would break it.
  if (rule.selectors.includes(SCOPE)) {
    rule.walkDecls((d) => {
      if (/^(transform|filter|backdrop-filter|perspective|will-change|contain)$/.test(d.prop)) {
        scopeLevelTransform = `${d.prop}: ${d.value}`;
      }
    });
  }
});

// Special case 2: prepend the next/font variables to the font tokens.
root.walkDecls((decl) => {
  if (decl.prop === "--sans") decl.value = `var(--font-geist,'Geist'),` + decl.value;
  if (decl.prop === "--fig") decl.value = `var(--font-grotesk,'Space Grotesk'),` + decl.value;
});

// Special case 3: relative url() assets -> /spine/<name> + copy into public/.
const MOCKUPS = dirname(SRC);
const PUBLIC_SPINE = resolve(here, "../public/spine");
const copied = [];
const kept = [];
const missing = [];
root.walkDecls((decl) => {
  if (!decl.value.includes("url(")) return;
  decl.value = decl.value.replace(
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/g,
    (whole, _q, ref) => {
      // Pass through data URIs, remote/absolute URLs, and fragment references
      // (url(#f) / url(%23f) inside inlined SVG data URIs).
      if (/^(data:|https?:|\/|#|%23)/.test(ref)) return whole;
      const src = resolve(MOCKUPS, ref);
      if (existsSync(src)) {
        mkdirSync(PUBLIC_SPINE, { recursive: true });
        const dest = resolve(PUBLIC_SPINE, ref);
        /* PREFER AN OPTIMISED VARIANT, AND NEVER CLOBBER ONE.
           The mockups carry source-quality assets (london.png is 3.0MB); the
           web copy must hold the weight budget (<=120KB for an LCP image).
           An unconditional copy silently reverted an optimised public copy back
           to source on the next resync , the pipeline restoring the very
           violation it was told to fix, with no output saying so.
           So: if `design/mockups/assets/<name>` holds a prepared variant, use
           it. Otherwise copy the source ONLY when the destination is absent or
           the source is not larger, and say plainly when a heavy source is
           being left in place. */
        const prepared = resolve(MOCKUPS, "assets", ref);
        if (existsSync(prepared)) {
          copyFileSync(prepared, dest);
          copied.push(`${ref} (prepared variant)`);
        } else if (!existsSync(dest)) {
          copyFileSync(src, dest);
          copied.push(ref);
        } else {
          const s = statSync(src).size, d = statSync(dest).size;
          if (s <= d) { copyFileSync(src, dest); copied.push(ref); }
          else kept.push(`${ref} (kept ${Math.round(d / 1024)}KB, source is ${Math.round(s / 1024)}KB)`);
        }
      } else {
        missing.push(ref);
      }
      return `url(/spine/${ref})`;
    },
  );
});

if (scopeLevelTransform) {
  console.error(
    `scope_atlas_css: FATAL , a rule scoped to ${SCOPE} declares "${scopeLevelTransform}", ` +
      `which would turn ${SCOPE} into a containing block and break the fixed-position ` +
      `jump rail / sheet / grain layers. Resolve in the mockup stylesheet first.`,
  );
  process.exit(1);
}

const banner = `/* =============================================================================
   GENERATED FILE , DO NOT EDIT.
   Source:    design/mockups/atlas.css (the frozen visual spec)
   Generator: scripts/scope_atlas_css.mjs   (re-run to re-sync)
   Every selector is scoped under ${SCOPE} so the v2 system cannot leak into
   existing pages. The ${SCOPE} wrapper must carry the font variables from
   src/lib/fonts-spine.ts and must never gain a transform or filter.
============================================================================= */
`;

const next = banner + root.toString() + "\n";

/* --check , a STALENESS gate, added 2026-07-26 after the real thing happened.
   Six edits were made to design/mockups/atlas.css across an afternoon; the
   generated copy in src/styles went eleven hours without being regenerated, so
   the React kit was silently rendering the pre-edit design. Nothing caught it,
   because a generated file that is merely OUT OF DATE is still valid CSS and
   still compiles. Freshness is the invariant, and it has to be asserted. */
if (process.argv.includes("--check")) {
  let current = "";
  try { current = readFileSync(OUT, "utf8"); } catch {}
  if (current !== next) {
    console.error(
      `x scope_atlas_css: ${OUT} is STALE against ${SRC}.\n` +
      `  The mockup stylesheet changed and the scoped copy was not regenerated,\n` +
      `  so the React kit is rendering an older design than the mockups show.\n` +
      `  Run: node scripts/scope_atlas_css.mjs`,
    );
    process.exit(1);
  }
  console.log(`ok scope_atlas_css: scoped stylesheet is current (${ruleCount} rules).`);
  process.exit(0);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, next);
console.log(`scope_atlas_css: wrote ${OUT} (${ruleCount} rules scoped).`);
if (copied.length) console.log(`  assets copied to public/spine/: ${copied.join(", ")}`);
if (kept.length) console.log(`  assets KEPT (public copy is lighter than the mockup source): ${kept.join(", ")}`);
if (missing.length)
  console.log(
    `  referenced but absent in mockups (kept as harmless 404 layers, as the mockup does): ${missing.join(", ")}`,
  );
