/**
 * Applies the type-ladder changes to the MOCKUP stylesheet, which is the source
 * of truth for src/styles/atlas-spine.css.
 *
 * The scoped copy is generated ("NEVER edit src/styles/atlas-spine.css by
 * hand"), so a hand-edit there survives only until the next regeneration and
 * the freshness gate catches it immediately, which is exactly what happened.
 */
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "E:/atlas/design/mockups/atlas.css";
let s = readFileSync(SRC, "utf8");
const before = s;

/* 1. The ladder tokens, declared next to the font stacks in :root. */
const anchor = "  --fig:'Space Grotesk',ui-monospace,'SF Mono',monospace;";
if (!s.includes("--t-answer")) {
  s = s.replace(
    anchor,
    anchor +
      `

  /* THE TYPE LADDER, 2026-08-21. Ten steps, declared identically in
     website/src/app/globals.css so the v2 spine and the rest of the site stop
     running separate scales. Measured before it was drawn: 44 distinct sizes
     across 2,758 declarations, 8px to 86px, a 10.75x range, on two ladders that
     did not know about each other. Converged on sizes this site already used
     rather than invented. Read-text range is now 4.36x.
     --t-mark is the ONLY step below the read floor and is for marks a reader
     glances at, never for a sentence. Founder: "eleven for anything you read,
     ten for marks." */
  --t-mark:10px; --t-micro:11px; --t-small:12px; --t-body:14px; --t-lead:16px;
  --t-sub:18px; --t-head:20px; --t-section:24px; --t-focal:30px; --t-answer:48px;`,
  );
}

/* 2. The answer figure comes onto the ladder. It was the largest type on the
      site and it is the founder's "H1 to smallest font" complaint in one rule.
      48 against the 30px focal step is exactly the 1.6x the answer-first rule
      requires, so nothing is lost by capping it. */
s = s.replace("font-size:clamp(56px,8.4vw,86px)", "font-size:clamp(30px,5vw,48px)");
s = s.replace(/(\.answer \.num\{)font-size:52px\}/g, "$1font-size:30px}");

/* 3. The floor. Marks rise to 10, read labels rise to 11. */
const SUBS = [
  [/font-size:\s*8px/g, "font-size:10px"],
  [/font-size:\s*9px/g, "font-size:10px"],
  [/font-size:\s*9\.5px/g, "font-size:10px"],
  [/font-size:\s*10\.5px/g, "font-size:11px"],
];
let raised = 0;
for (const [rx, rep] of SUBS) {
  const hits = s.match(rx);
  if (hits) raised += hits.length;
  s = s.replace(rx, rep);
}

if (s === before) {
  console.log("  no change");
} else {
  writeFileSync(SRC, s);
  console.log(`  ladder tokens added, answer figure capped at 48, ${raised} sub-floor sizes raised`);
}
