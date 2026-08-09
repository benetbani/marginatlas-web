#!/usr/bin/env node
/**
 * scripts/verify_palette_membership.mjs
 *
 * THE PALETTE, ENFORCED BY HUE RATHER THAN BY NAME.
 *
 * Ratified by the founder 2026-08-09, asked as a straight question and answered
 * without hedging: terracotta plus cool neutrals only. NO GREEN, NO AMBER, NO
 * BROWN. No exceptions.
 *
 * WHY A NAME CHECK COULD NEVER HAVE HELD THE LINE. A gate that greps for the
 * word "green" does not see `#6f8f25`, and one that greps for "orange" does not
 * see `amber-400`. Four washed circles at the foot of the home page carried a
 * moss green, a cocoa brown and a saturated orange for months under a rule that
 * banned all three, because nothing ever converted them to a hue and looked.
 * So this reads the colour, not the label.
 *
 * WHAT IT IS A RATCHET, AND WHY IT IS NOT A HARD GATE YET. Measured on the day
 * it was written, green and amber render on THREE live page types:
 *
 *     /cities/london            green 40, amber 24
 *     /industries/restaurants   green 22, amber 12
 *     /decide                   green  8, amber  0
 *
 * and on ZERO others: not the home page, neither cell page, not /countries,
 * /cities or /world. On those three they are not decoration, they encode
 * good-versus-bad on score strips and gauges, so stripping the colour without
 * replacing the signal would take meaning off the page rather than tidy it.
 * Replacing it is design work: the founder's standing deal is three drawn
 * options per subsection, and the two pages carrying most of this are the two
 * he has already called "failed" and "very ugly" and wants redesigned anyway.
 *
 * So the ratchet records exactly what exists today. Nothing NEW may add a
 * banned hue, and the recorded set can only shrink. NEVER raise the baseline to
 * make this pass; that is the one move a ratchet cannot survive.
 *
 * TWO BLIND SPOTS, stated because rule 2 of the working method requires it.
 *
 * FIRST: this reads source files, so it sees a token a component MENTIONS, not
 * a pixel a reader SEES. A component naming `moss-500` behind a flag that is off
 * counts here and does not count on screen. The per-page figures above came from
 * the served HTML instead, which is the instrument that answers "does anyone
 * see it".
 *
 * SECOND, AND IT IS A REAL LIMIT ON THE RULE: THIS GATE CANNOT ENFORCE
 * "NO BROWN", and pretending otherwise would be worse than saying so. The
 * founder rejected a brown WASH, cocoa-500 #87745d, at the foot of the home
 * page. But measured:
 *
 *     ink-500    #7d6c58   h 32   s 17%   l 42%     the established ladder
 *     cocoa-500  #87745d   h 33   s 18%   l 45%     the one he rejected
 *
 * They are the same colour. The ink ladder is the body text of the entire site
 * and cannot be banned; no hue, saturation or lightness band separates it from
 * the wash. The difference is not the colour, it is what the colour is DOING:
 * a warm dark as type is the house style, the same warm dark as a decorative
 * fill behind a drawing is the defect. A hue check cannot see the difference
 * between type and fill, so it does not claim to.
 *
 * The brown rule therefore lives where it can actually be enforced: the spot
 * illustrations are restricted to three wash colours by name in
 * src/components/brand/spots/atlas-spots-data.ts, which is where all fourteen
 * offending washes were.
 *
 * What this gate DOES enforce, completely and by hue: no green, no amber. Those
 * are the two the founder named, and they have no such ambiguity.
 *
 *   node scripts/verify_palette_membership.mjs
 *   node scripts/verify_palette_membership.mjs --update-baseline   (SHRINK ONLY)
 */
import fs from "node:fs";
import path from "node:path";

const BASELINE = "scripts/palette_baseline.json";
/* STYLESHEETS ARE SCANNED TOO, ADDED 2026-08-09, AND THE FIRST VERSION MISSING
   THEM IS WHY. The gutters behind every page on the site painted
   rgba(74, 96, 24, .10) at "50% 120%" , moss-700 #4a6018, the banned green, at
   the foot of every route. It was in globals.css rather than a component, so a
   scan of src/components and src/app/**.tsx could not see it, and it is the
   most likely thing the founder was actually looking at when he said "at the
   bottom of the home page I see a shade of orange that is not accepted as a
   brand color." A palette gate that only reads components cannot enforce a
   palette. */
const ROOTS = ["src/components", "src/app", "src/styles"];

/** Hue bands the ratified palette allows, in HSL degrees. */
const ALLOWED = [
  { name: "terracotta", hMin: 0, hMax: 25 },
  { name: "ink/cocoa ladder", hMin: 25, hMax: 45, sMax: 45 },
  /* 145, not 150. The sanctioned pair is teal-700 #345a47 at h=150 and teal-500
     #4d7c64 at h=149, so a band starting at 150 splits a two-token ramp and
     rejected the lighter half. Nothing is smuggled in by the extra five
     degrees: the banned greens sit at h=77 and h=78, seventy degrees away. */
  { name: "teal", hMin: 145, hMax: 200 },
];
/** Anything at or below this saturation is a neutral and always allowed. */
const NEUTRAL_S_MAX = 12;

function hexToHsl(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l: l * 100 };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) hue = ((b - r) / d + 2) * 60;
  else hue = ((r - g) / d + 4) * 60;
  return { h: hue, s: s * 100, l: l * 100 };
}

export function isPaletteLegal(hex) {
  const { h, s, l } = hexToHsl(hex);
  if (s <= NEUTRAL_S_MAX) return true;      // any neutral
  /* PAPER TONES ARE NOT COLOURS. Above ~93% lightness a tint reads as warm or
     cool white whatever its hue: #fff7e6 is 95% and is the cream this site is
     printed on. The first threshold here was 97%, which rejected it and two
     siblings, and tuning a rule until it passes is how a gate stops meaning
     anything , so this is set on what a reader perceives, not on what made the
     scan quiet. Below 93 the hue is visible and is judged: #fde9cc at 90% is a
     peach and stays caught. */
  if (l >= 93 || l <= 4) return true;
  return ALLOWED.some((b) => h >= b.hMin && h < b.hMax && (b.sMax == null || s <= b.sMax));
}

/** Tailwind class families whose colour is decided by a banned token name. */
const BANNED_TOKENS = /\b(?:bg|text|border|fill|stroke|from|via|to|ring|divide|outline|shadow|decoration|accent|caret)-(moss|amber)-\d+\b/g;

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

/** rgb()/rgba() written as numbers, which no hex scan can see. */
function rgbLiteralsToHex(src) {
  const out = [];
  for (const m of src.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g)) {
    const [r, g, b] = [m[1], m[2], m[3]].map(Number);
    if (r > 255 || g > 255 || b > 255) continue;
    out.push("#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join(""));
  }
  return out;
}

/* Everything above is importable; everything below only runs when this file is
   executed directly. Without the guard, importing isPaletteLegal to test it
   against the founder's own verdicts ran the whole scan and exited, which is
   how the first version of this file made itself untestable. */
const RUN_AS_SCRIPT = process.argv[1] && path.resolve(process.argv[1]).endsWith("verify_palette_membership.mjs");
if (!RUN_AS_SCRIPT) { /* imported for isPaletteLegal only */ }
else main();

function main() {
const found = {};
for (const root of ROOTS) {
  for (const f of walk(root)) {
    /* COMMENTS ARE STRIPPED FIRST, and the first run of this gate is why. It
       flagged atlas-spots-data.ts for carrying #6f8f25, which appears there
       exactly once: inside the comment recording that the moss green was
       REMOVED. A gate that cannot tell a colour from a note about a colour
       reports a file for documenting its own fix. */
    const src = fs
      .readFileSync(f, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
    let n = (src.match(BANNED_TOKENS) || []).length;
    // Raw hex, judged by hue rather than by name.
    for (const m of src.match(/#[0-9a-fA-F]{6}\b/g) || []) if (!isPaletteLegal(m)) n++;
    // ...and the same judgement on rgb()/rgba(), which is how the green in the
    // gutters hid from a hex-only scan for months.
    for (const m of rgbLiteralsToHex(src)) if (!isPaletteLegal(m)) n++;
    if (n > 0) found[f] = n;
  }
}

const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : { files: {} };

if (process.argv.includes("--update-baseline")) {
  for (const [f, n] of Object.entries(found)) {
    const was = base.files[f];
    if (was != null && n > was) {
      console.error(`x refusing to raise the baseline: ${f} went ${was} -> ${n}.`);
      console.error(`  A ratchet that can be raised is a suggestion. Remove the colour instead.`);
      process.exit(1);
    }
  }
  fs.writeFileSync(BASELINE, JSON.stringify({ files: found, recorded: process.argv[3] ?? base.recorded ?? "unset" }, null, 2) + "\n");
  console.log(`palette: baseline written, ${Object.keys(found).length} file(s).`);
  process.exit(0);
}

const grown = [];
for (const [f, n] of Object.entries(found)) {
  const was = base.files[f] ?? 0;
  if (n > was) grown.push({ f, was, now: n });
}

const total = Object.values(found).reduce((a, b) => a + b, 0);
const baseTotal = Object.values(base.files).reduce((a, b) => a + b, 0);
console.log(`palette: ${total} banned-hue use(s) in ${Object.keys(found).length} file(s) (baseline ${baseTotal})`);

if (grown.length > 0) {
  console.error(`\nx ${grown.length} file(s) added green, amber or another off-palette hue:\n`);
  for (const g of grown) console.error(`  ${g.f}  ${g.was} -> ${g.now}`);
  console.error(
    `\n  The ratified palette is terracotta plus cool neutrals: no green, no amber,\n` +
      `  no brown. Founder, 2026-08-09, asked directly and answered "no exceptions".\n` +
      `  Show good-versus-bad with intensity and position instead of hue.\n` +
      `  Do NOT run --update-baseline to clear this. It refuses to raise anyway.`,
  );
  process.exit(1);
}

console.log("palette: no new green or amber");
process.exit(0);
}
