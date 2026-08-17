/**
 * OKLCH palette audit (Brand Design Constitution section 4.4).
 *
 * The warm Atlas palette is authored as hex in src/lib/design-tokens.ts. This
 * script is the OKLCH source-of-truth lens: it converts the palette to OKLCH,
 * verifies each ramp is perceptually monotonic (lightness descends as the step
 * climbs), and audits WCAG AA contrast on the pairings the constitution relies
 * on. It changes no rendered color; it proves the palette is sound and
 * accessible before the chart kit and pages build on it.
 *
 * Run: node scripts/tokens/oklch-audit.mjs
 * Exits non-zero if a required contrast pairing fails or a ramp is non-monotonic.
 */
import { converter, wcagContrast } from "culori";

const toOklch = converter("oklch");
const fail = [];

// Mirror of the ramps + roles in src/lib/design-tokens.ts (kept in step by hand;
// this is an audit, the token file remains the value authority).
//
// THE AMBER RAMP AND TWO MOSS/AMBER PAIRINGS LEFT THIS FILE 2026-08-17. Both
// hues are banned outright and their call sites are now cleared, so auditing
// them proved the accessibility of colours nothing paints. Worse, a hand-copy
// like this one does not fail when the ramp it mirrors is deleted: it keeps
// passing, quietly, about values that no longer exist anywhere. The same
// hand-copy problem is why the grounds below were stale, see the next note.
const ramps = {
  atlas: ["#fff1ee", "#ffd9d0", "#ffb3a3", "#fb8469", "#f24e2f", "#e62200", "#c11c00", "#991600", "#701000", "#4a0a00"],
  cream: ["#ffffff", "#fbfaf7", "#f7f6f4", "#efeeeb", "#e4e2dd", "#c3bfb7", "#8d887e"],
  ink: ["#faf4ec", "#f0e7d9", "#e4d8c5", "#cbb79c", "#7d6c58", "#5d4d3b", "#463726", "#2c2015", "#211810"],
};

console.log("== OKLCH ramp audit (lightness must descend) ==");
for (const [name, hexes] of Object.entries(ramps)) {
  let prevL = Infinity;
  let mono = true;
  const Ls = hexes.map((h) => {
    const { l } = toOklch(h);
    if (l > prevL + 0.001) mono = false;
    prevL = l;
    return l.toFixed(3);
  });
  console.log(`  ${name.padEnd(6)} L: ${Ls.join(" ")}  ${mono ? "OK monotonic" : "NON-MONOTONIC"}`);
  if (!mono) fail.push(`ramp ${name} is not lightness-monotonic`);
}

// Required contrast pairings: [foreground, background, minRatio, label]
//
// THE GROUND WAS STALE IN SIX OF THESE. Every "on ground" pairing tested
// against #fbfaf7, the cream body ground, and that token was retoned to
// #f7f7f8 in the cream purge. So this audit was certifying contrast against a
// colour the site had stopped painting. #f7f7f8 is a hair darker (l 97.1 vs
// 98.4) so every ratio here moves slightly, and none of them across a
// threshold. The kept/warning pairings are gone with their ramps.
const GROUND = "#f7f7f8"; // --atlas-surface-paper, the body ground
const CARD = "#ffffff";
const pairings = [
  ["#211810", CARD, 4.5, "ink-900 on card"],
  ["#211810", GROUND, 4.5, "ink-900 on app ground"],
  ["#534231", GROUND, 4.5, "cocoa-700 muted on ground"],
  ["#991600", GROUND, 4.5, "atlas-700 text accent on ground"],
  ["#5c1813", GROUND, 4.5, "clay-700 danger on ground"],
  ["#ffffff", "#e62200", 3.0, "white on atlas-500 accent surface"],
  ["#ffffff", "#211810", 4.5, "white on ink-900 inverse"],
  // chart marks on the white card, non-text 3:1
  ["#e62200", CARD, 3.0, "chart primary on card"],
  ["#87745d", CARD, 3.0, "chart cost on card"],
];

console.log("\n== WCAG AA contrast audit ==");
for (const [fg, bg, min, label] of pairings) {
  const ratio = wcagContrast(fg, bg);
  const ok = ratio >= min;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${ratio.toFixed(2)}:1 (need ${min})  ${label}`);
  if (!ok) fail.push(`${label}: ${ratio.toFixed(2)}:1 below ${min}`);
}

console.log("");
if (fail.length) {
  console.error(`OKLCH AUDIT FAILED (${fail.length}):`);
  fail.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log("OKLCH AUDIT PASS: warm palette is perceptually sound and AA-accessible.");
