#!/usr/bin/env node
/**
 * verify_token_contrast , no colour token may carry text below WCAG AA.
 *
 * WHY THIS EXISTS. The colour tokens live in design/mockups/atlas.css, which is
 * the founder's file and is edited by eye. A token nudged two shades lighter
 * still compiles, still typechecks, still looks fine on the machine it was
 * chosen on, and can drop body text under 4.5:1 with nothing to notice. This is
 * the same class of invisible drift as the stale stylesheet the freshness gates
 * were built for.
 *
 * MEASURED CLEAN BEFORE IT WAS WRITTEN, which is why it can be a hard gate
 * rather than another ratchet. 251 `color:` declarations across the v2
 * stylesheet, of which 247 are AA or better on the card surface:
 *
 *   --ink         19.43   --ink-2   8.83   --terra-deep  7.34   --n1  7.19
 *   --muted        6.33   --terra   5.35   --n2          5.00
 *
 * The three exceptions are allowlisted below with reasons, not silently
 * skipped.
 *
 * WHAT THIS DELIBERATELY DOES NOT CHECK, and it is the more interesting half.
 * SC 1.4.11 asks 3:1 for graphical objects needed to understand content, and
 * two meaning-bearing fills are under it: --n4 at 1.81 and --n5 at 1.34 against
 * the card, used for the twelve-bar year strip and the hero range bar. That is
 * reported at the end and does NOT fail, for two reasons: the year strip is a
 * RATIFIED drawing, and the fix belongs in the founder's file. A gate that
 * fails on something only he can change is a gate that gets switched off.
 *
 * Note: `2026-08-08-contrast-and-the-neutral-ramp.md`.
 *
 * Run: node scripts/verify_token_contrast.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const CSS = resolve(ROOT, "src/styles/atlas-spine.css");
const AA_BODY = 4.5;
const NON_TEXT = 3.0;

/* Text colours that are legitimately below AA. Each needs a reason, and the
   reason is that none of them carries a sentence. */
const ALLOW = new Map([
  ["--faint", "two ::after decorative marks on tile and hoodcard links, no prose"],
  ["--terra-bright", "the .cta .ar arrow glyph, not text"],
]);

const src = readFileSync(CSS, "utf8");

/* ---- tokens ---- */
const tokens = new Map();
for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]+\))/gi)) {
  if (!tokens.has(m[1])) tokens.set(m[1], m[2].trim());
}

const parse = (v) => {
  if (v.startsWith("#")) {
    const s = v.slice(1);
    const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s.slice(0, 6);
    return { rgb: [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)), a: 1 };
  }
  const p = v.replace(/rgba?\(|\)/g, "").split(/[,\s/]+/).filter(Boolean).map(Number);
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
};
/* NO ROUNDING. This composites in continuous space and only the caller may
   round, because rounding here is how this gate spent its life measuring pure
   white: 255*0.955 + 247*0.045 = 254.64, and Math.round makes that 255. The
   luminance function below takes fractional channels without complaint. */
const over = (s, d, a) => s.map((c, i) => a * c + (1 - a) * d[i]);
const lum = (rgb) =>
  0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2]);
function ch(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/* ---- THE GROUND A CARD ACTUALLY SITS ON ----------------------------------
   This gate used to composite the card over `--paper`, a near-white token, and
   then round. Both together meant it measured every text token against PURE
   WHITE, which is a surface that never renders anywhere on this site.

   The real stack, and `globals.css` lines 160-169 already computed it by hand
   without ever turning it into a check: a white base, then the photograph at
   opacity .32 under saturate(.85) contrast(1.02), then the card. The darkest
   pixel in /spine/_skyline.jpeg is rgb(1,2,0). At .32 over white that composites
   to a backdrop of rgb(173), so the worst card ground on the site is the card
   alpha applied over rgb(173).

   WHY A WORST-CASE BOUND IS SOUND, AND WHY THE BLUR RADIUS DOES NOT APPEAR HERE.
   A Gaussian blur is a convex combination of its input pixels: every output
   pixel is a weighted average with non-negative weights summing to one, so it
   can never fall below the darkest input pixel nor rise above the brightest.
   Bounding the photograph once therefore bounds it for EVERY blur radius,
   forever, and this gate needs no knowledge of the blur at all.

   THE SATURATE HALF IS NOT COVERED BY THAT ARGUMENT, AND HERE IS WHY IT STILL
   HOLDS. The real filter is `blur(26px) saturate(1.15)`. A saturation filter is
   a colour matrix, not a convex combination: it preserves LINEAR luma by
   construction but not WCAG relative luminance, which applies the sRGB transfer
   first. Measured on real pixels, saturate(1.15) moves relative luminance in
   both directions, e.g. rgb(10,200,40) rises from .4153 to .4508 after clamping.
   So convexity alone does not bound it.

   It is bounded here for a different and narrower reason: THE FLOOR PIXEL IS
   ALREADY BLACK. The darkest pixel is rgb(1,2,0), relative luminance .0005, and
   no colour matrix can push a pixel below zero. Saturation can only move the
   ground UP from that floor, which makes the card ground lighter, which makes
   dark text on it read BETTER, never worse. The AtlasFrame layer also applies
   saturate(.85) before the card applies 1.15, so the photograph reaching a card
   is desaturated first, which widens the margin further.

   THE CONDITION TO RE-CHECK IF THE PHOTOGRAPH EVER CHANGES: this argument needs
   the darkest pixel to be at or near black. Swap in an image whose darkest pixel
   is a SATURATED MID-TONE and saturate() could push its luminance below the
   measured floor, and this bound would need recomputing rather than inheriting.
   That is the one input here that is a property of the picture rather than of
   the maths.

   THIS MATTERS MORE THE MORE TRANSPARENT THE CARD GETS. At the current .955 the
   difference between the old assumption and the truth is about half a point on
   a ratio of seventeen and no AA verdict flips, which is why nobody noticed. At
   .80 the true ground is rgb(238) against the assumed 255; at .62 it is rgb(224).
   A translucency ladder built while this gate still reported white would pass
   the whole way down and be wrong the whole way down. ---------------------- */
const PHOTO_DARKEST = [1, 2, 0];      // measured off /spine/_skyline.jpeg
const PHOTO_OPACITY = 0.32;           // AtlasFrame photo layer
const BASE = [255, 255, 255];         // the white base beneath the photograph
const BACKDROP = over(PHOTO_DARKEST, BASE, PHOTO_OPACITY);

const cardTok = parse(tokens.get("--card") ?? "rgba(255,255,255,.955)");
const CARD = over(cardTok.rgb, BACKDROP, cardTok.a);

/* ---- every token used as TEXT.
   The boundary matters: `border-color:` and `text-decoration-color:` both
   contain the substring `color:`, and matching loosely reports four tokens as
   text that never carry any. ---- */
const used = new Map();
for (const m of src.matchAll(/(?:^|[{;\s])color:\s*var\((--[a-z0-9-]+)\)/gm)) {
  used.set(m[1], (used.get(m[1]) ?? 0) + 1);
}

const fails = [];
const rows = [];
for (const [tok, count] of [...used].sort((a, b) => b[1] - a[1])) {
  const raw = tokens.get(tok);
  if (!raw) continue;
  const { rgb, a } = parse(raw);
  const r = ratio(over(rgb, CARD, a), CARD);
  rows.push({ tok, count, r });
  if (r < AA_BODY && !ALLOW.has(tok)) fails.push({ tok, count, r });
}

console.log("=== verify_token_contrast ===");
for (const { tok, count, r } of rows) {
  const tag = ALLOW.has(tok) ? "allowed" : r >= 7 ? "AAA" : r >= AA_BODY ? "AA" : "FAIL";
  console.log(`  ${tok.padEnd(16)}${String(count).padStart(4)} uses   ${r.toFixed(2).padStart(6)}:1   ${tag}`);
}

/* ---- informational: meaning-bearing fills under SC 1.4.11 ---- */
const FILL_NOTE = ["--n3", "--n4", "--n5"];
const low = FILL_NOTE.map((t) => {
  const p = parse(tokens.get(t) ?? "#000");
  return { t, r: ratio(over(p.rgb, CARD, p.a), CARD) };
}).filter((x) => x.r < NON_TEXT);
if (low.length) {
  console.log(
    `\n  Not failed, reported: ${low.length} neutral fill(s) under the ${NON_TEXT}:1 that\n` +
      `  SC 1.4.11 asks of a graphical object needed to understand the content.`,
  );
  for (const x of low) console.log(`     ${x.t}  ${x.r.toFixed(2)}:1 against the card`);
  console.log(`  These are the founder's to change, and one of them draws a ratified drawing.`);
}

if (fails.length) {
  console.error(`\nx verify_token_contrast: ${fails.length} token(s) carry text below ${AA_BODY}:1.\n`);
  for (const f of fails) console.error(`   ${f.tok}  ${f.r.toFixed(2)}:1  across ${f.count} declaration(s)`);
  console.error(
    `\n  The tokens live in design/mockups/atlas.css. Darken the token, or stop\n` +
      `  using it for text. Do not add it to the allowlist without a reason that\n` +
      `  says why it carries no prose.\n`,
  );
  process.exit(1);
}

console.log(`\n  GATE: PASS  ${rows.length} text tokens, all AA or allowlisted.`);
process.exit(0);
