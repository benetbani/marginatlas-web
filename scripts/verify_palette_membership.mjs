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
  /* THE TEAL BAND IS REMOVED, 2026-08-17, because this gate was giving two
     different answers about one colour.

     `teal` joined BANNED_NAMES earlier today, so `bg-teal-700` fails. This band
     simultaneously declared the identical value legal as a hex, so
     `colors.teal[700]` passed. Same pixel, opposite verdicts, decided purely by
     how an author happened to spell it. A gate that contradicts itself is worse
     than a narrow one, because both answers can be cited.

     Resolved toward BANNED, on evidence rather than preference:
       - #345a47 and #4d7c64 measure h=150 and h=149. That is green. Teal is
         near 180. The name on the token is wrong, which is precisely how the
         blog cover palette kept a banned green for months under the label
         "teal" until a screenshot caught it today.
       - The founder's rule is "no green", stated without qualification.
       - The site has already been acting on this: the sage ramp came out of the
         blog covers and out of CostBar this session, both times on the measured
         hue rather than the name.

     The old comment defended widening this band from 150 to 145 so it would not
     split the ramp. That reasoning was sound about the ramp and never asked
     whether the ramp belonged.

     WHAT REMAINS, deliberately, and it is the honest half of this: the `teal`
     ramp is still defined in design-tokens.ts and still read once, by
     NeighborhoodCover. Its four hex values are now counted as debt in the
     baseline and can be ratcheted down like anything else. Deleting the ramp
     needs its call site converted first, or it fails silently, and that file is
     being edited by another agent as this lands. */
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

/**
 * Tailwind class families whose colour is decided by a banned token name.
 *
 * ORANGE JOINED THE LIST ON 2026-08-16, and the omission had teeth. The hue
 * scanner below reads hex and rgb(), so a Tailwind CLASS name carries no colour
 * it can see: `bg-orange-50` is just a string. moss and amber were named here
 * for exactly that reason and orange was not, while the founder note quoted at
 * the top of this file, "at the bottom of the home page I see a shade of orange
 * that is not accepted as a brand color", sat directly above the gap.
 *
 * What it missed: the home page's primary call to action, the submit button on
 * the navigator, painted border-orange-200 / bg-orange-50 / text-orange-700.
 * orange-700 is #c2410c at hue 17.5 degrees against a brand accent of #991600
 * at 8.6, which is why it reads as a different colour rather than a shade.
 *
 * Costs nothing to add: those five classes were the only orange-* in the whole
 * repository, and they are now atlas-50/200/700. Terracotta comes from the
 * atlas ramp, which is plain hex in the Tailwind config and needs no stylesheet
 * to be in scope.
 */
/**
 * THE LIST WENT FROM THREE NAMES TO NINETEEN ON 2026-08-17, and the gap it left
 * is the same one this comment block was already written about, one level up.
 *
 * The note above records that `orange` was missing while `moss` and `amber`
 * were present, and that the omission cost the home page's primary call to
 * action. What nobody then asked was the next question: those three are the
 * ramps THIS PROJECT defined. Tailwind ships seventeen more, and every one of
 * them is a hue this palette does not contain. A component writing
 * `bg-emerald-700` was not evading the gate; the gate simply had no idea the
 * word existed.
 *
 * Measured before widening, comments stripped, across all of src:
 *
 *     moss     23 in 9 files    caught
 *     emerald  14 in 4 files    INVISIBLE
 *     amber    11 in 2 files    caught
 *     rose      3 in 2 files    INVISIBLE
 *     stone     1               INVISIBLE
 *     teal      1               INVISIBLE
 *
 * So the gate saw 34 of 53. Nineteen off-palette uses, more than a third, sat
 * outside its vocabulary, and one of them was a fourteen-use green.
 *
 * TWO NAMES ON THIS LIST NEED THEIR REASONS WRITTEN DOWN, because neither is
 * obvious from the word alone:
 *
 *   teal   is a ramp THIS project defines, overriding Tailwind's, and
 *          design-tokens calls it "the single cool counterweight". Its own
 *          values are #345a47 and #4d7c64, which measure hue 149 and 150. That
 *          is green. Teal sits near 180. The founder banned green outright, and
 *          a banned hue under a permitted name is exactly how the blog cover
 *          palette kept one for months.
 *   stone  is Tailwind's WARM neutral. The ratified palette is terracotta plus
 *          COOL neutrals, so warm greys are off-palette for the same reason
 *          cream is.
 *
 * NOT banned, deliberately: slate, gray, zinc and neutral are cool greys and
 * are on-palette. Banning them would be a different decision, and a much larger
 * one, than closing a blind spot.
 */
const BANNED_NAMES = [
  "moss", "amber", "orange",
  "red", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "stone",
];
const FAMILIES =
  "bg|text|border|fill|stroke|from|via|to|ring|divide|outline|shadow|decoration|accent|caret";
const bannedTokenRe = (names) =>
  new RegExp(`\\b(?:${FAMILIES})-(?:${names.join("|")})-\\d+\\b`, "g");
const BANNED_TOKENS = bannedTokenRe(BANNED_NAMES);

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * A file's source with comments removed.
 *
 * Extracted so the scan and the widening guard below read a file the SAME way.
 * They used to strip inline, in one place only, and the moment a second reader
 * appeared that would have been two strippers drifting apart, which is the
 * defect this repo has already paid for twice in one session.
 *
 * The first run of this gate is why comments are stripped at all: it flagged
 * atlas-spots-data.ts for carrying #6f8f25, which appears there exactly once,
 * inside the comment recording that the moss green was REMOVED. A gate that
 * cannot tell a colour from a note about a colour reports a file for
 * documenting its own fix.
 */
function sourceOf(f) {
  return fs
    .readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
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
    /* Comments stripped first; see sourceOf, which the widening guard shares. */
    const src = sourceOf(f);
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

/**
 * WIDENING THE DETECTOR IS NOT THE SAME OPERATION AS RAISING THE BASELINE, and
 * until 2026-08-17 this gate could not tell the two apart, so it forbade both.
 *
 * That was the right default and it had a cost: the ban list could never grow.
 * Adding `emerald` to it makes four files "rise" without a single line of
 * component code changing, the refusal fires, and the only way past is to
 * delete the guard. A ratchet that punishes improving its own instrument
 * eventually gets its instrument left alone.
 *
 * So the baseline now records the ban list it was measured with, and a rise is
 * permitted ONLY when it is fully EXPLAINED by names added in the same commit.
 * The check is arithmetic, not a promise: for each file that grew, count the
 * tokens matching only the NEWLY added names. If the rise is larger than that
 * count, something else grew too, and it refuses exactly as before.
 *
 * That keeps the bright line intact. A regression cannot be laundered through a
 * widening, because the widening can only ever account for its own discoveries.
 */
if (process.argv.includes("--update-baseline")) {
  /* A baseline written before 2026-08-17 carries no `bannedNames`, and it was
     measured with exactly these three. Without that fallback the very first
     widening can never be recorded: `added` comes out empty, nothing is
     explainable, and the guard refuses its own bootstrap. Knowing the prior
     list is not a guess here, it is the list this file held until today. */
  const LEGACY_BANNED_NAMES = ["moss", "amber", "orange"];
  const prevNames = Array.isArray(base.bannedNames) ? base.bannedNames : LEGACY_BANNED_NAMES;
  const added = BANNED_NAMES.filter((n) => !prevNames.includes(n));
  const addedRe = added.length ? bannedTokenRe(added) : null;

  /* A DETECTOR WIDENS IN TWO WAYS, and the first version of this guard knew
     only one of them. Adding a NAME is one. REMOVING AN ALLOWED HUE BAND is the
     other, and it makes hex values that were legal yesterday illegal today
     without a line of component code changing, which is the same situation for
     the same reason. Removing the teal band is what exposed the gap.

     So a rise may also be explained by a hex or rgb() literal in that file
     which the OLD bands allowed and the new ones do not. The arithmetic
     property is unchanged: a regression still cannot hide inside a widening,
     because only colours the removal newly condemns are ever counted. */
  /* Same bootstrap as LEGACY_BANNED_NAMES above: a baseline written before the
     bands were recorded carries none, and without a fallback the first band
     removal can never be recorded. These are the three this file held until
     today, the third being the teal band whose removal is documented in
     ALLOWED. Not a guess: it is the list this commit edits. */
  const LEGACY_ALLOWED = [
    { name: "terracotta", hMin: 0, hMax: 25 },
    { name: "ink/cocoa ladder", hMin: 25, hMax: 45, sMax: 45 },
    { name: "teal", hMin: 145, hMax: 200 },
  ];
  const prevBands = Array.isArray(base.allowedBands) ? base.allowedBands : LEGACY_ALLOWED;
  const legalUnder = (bands, hex) => {
    const { h, s, l } = hexToHsl(hex);
    if (s <= NEUTRAL_S_MAX) return true;
    if (l >= 93 || l <= 4) return true;
    return bands.some((b) => h >= b.hMin && h < b.hMax && (b.sMax == null || s <= b.sMax));
  };
  const newlyCondemned = (src) => {
    if (!prevBands) return 0;
    const hexes = [...(src.match(/#[0-9a-fA-F]{6}\b/g) || []), ...rgbLiteralsToHex(src)];
    return hexes.filter((x) => legalUnder(prevBands, x) && !isPaletteLegal(x)).length;
  };

  /* A MISSING ENTRY MEANS ZERO, NOT "SKIP", and reading it as "skip" was a hole
     this guard inherited and that its own first test caught.

     The old line was `const was = base.files[f]; if (was != null && n > was)`,
     so a file with NO baseline entry, i.e. a file that was previously clean,
     was never examined at all. A brand new violation in a clean file went
     straight into the baseline. Proved by injecting `bg-emerald-500` into a
     component with no entry: the main gate correctly exited 1, and
     --update-baseline wrote it in and exited 0.

     The main gate below has always read `base.files[f] ?? 0`. The two readers
     disagreed, and the more permissive one was the one that could write. */
  for (const [f, n] of Object.entries(found)) {
    const was = base.files[f] ?? 0;
    if (n <= was) continue;

    const rise = n - was;
    const src = sourceOf(f);
    const explained =
      (addedRe ? (src.match(addedRe) || []).length : 0) + newlyCondemned(src);
    if (rise > explained) {
      console.error(`x refusing to raise the baseline: ${f} went ${was} -> ${n}.`);
      if (added.length) {
        console.error(
          `  Newly banned names explain only ${explained} of the ${rise} added.` +
            `\n  The remaining ${rise - explained} is a regression, not a discovery.`,
        );
      }
      console.error(`  A ratchet that can be raised is a suggestion. Remove the colour instead.`);
      process.exit(1);
    }
    const why = [
      added.length ? `names +${added.join(",")}` : null,
      prevBands && prevBands.length !== ALLOWED.length ? "hue band removed" : null,
    ].filter(Boolean).join(" and ");
    console.error(`  widened: ${f} ${was} -> ${n}, all ${rise} explained by ${why || "detector change"}`);
  }

  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      {
        files: found,
        bannedNames: BANNED_NAMES,
        allowedBands: ALLOWED,
        recorded: process.argv[3] ?? base.recorded ?? "unset",
      },
      null,
      2,
    ) + "\n",
  );
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
      `  src/lib/scores/band_tone.ts is the one place that already does it.\n` +
      `\n  Do NOT run --update-baseline to clear this. It refuses to raise, EXCEPT\n` +
      `  for a rise fully explained by names added to BANNED_NAMES in the same\n` +
      `  commit, which is a wider detector rather than a new colour. If you did\n` +
      `  not widen that list, this path is closed to you: remove the colour.`,
  );
  process.exit(1);
}

console.log("palette: no new green or amber");
process.exit(0);
}
