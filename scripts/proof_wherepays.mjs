/**
 * proof_wherepays , the before and after sheet for "the rent, city by city".
 *
 *   node scripts/proof_wherepays.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/wherepays/wherepays-before-after.html";
const before = readFileSync("scratchpad/wp-before.html", "utf8");
const after = readFileSync("scratchpad/wp-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-wp.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The rent, city by city, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;}
  *{box-sizing:border-box}
  body{margin:0;padding:36px 24px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:14px 0 6px}
  .hold{margin-bottom:20px}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
           clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>The rent, city by city, before and after</h1>
<p>Both cards are the real section, server rendered. <b>The look should be the
same. That is the point of this one.</b></p>
<p>What changed is underneath. Cities down the side, one measure across the top,
and a header row drawn to look like one with <b>nothing underneath it</b>: zero
table elements, so the words naming the column were never attached to the figures
they name. A screen reader got a city, a number, a city, a number. <b>Third section
in this loop with the same fault</b>, and the third time the library's own table
answers it.</p>
<p>Two smaller things went with it. The figure column was pinned at four and a half
rem, which on a phone took a third of the row for a two-character number; it sizes
itself now. And the link moved from the whole row to the city name and its arrow,
because a row cannot be wrapped in a link inside a table. <b>One row in this list
carries a link</b>, and the row still lights on hover, so it still reads as
reachable.</p>
<div class="lab">After, a real table</div>
<div class="hold">${after}</div>
<div class="lab">Before, a grid of boxes</div>
<div class="hold">${before}</div>
<footer>Illustrative cities and figures from the bundled sample. Nothing on this
sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
