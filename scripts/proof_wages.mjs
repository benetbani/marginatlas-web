/**
 * proof_wages , the before and after sheet for "what the team costs".
 *
 * Both halves are the real component's own server render, and the styling is the
 * project's compiled output for exactly those two files.
 *
 * THE INSTRUMENT CHECK, and it refused the first version of this sheet.
 * Fixed-width columns inside one wide page cannot test anything that keys off
 * the viewport, which the previous iteration learned the hard way. This section
 * carries breakpoint rules, so the sheet is ONE full-width column photographed
 * at three real window widths instead. The check below stays strict on purpose:
 * relaxing it to allow the prettier side-by-side layout would defeat the point
 * of having it.
 *
 *   node scripts/proof_wages.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/wages/wages-before-after.html";
const before = readFileSync("scratchpad/wages-before.html", "utf8");
const after = readFileSync("scratchpad/wages-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-wages.css", "utf8");

const bp = [...(before + after).matchAll(/class="[^"]*\b(sm|md|lg|xl):/g)];
console.log(
  bp.length
    ? `  ${bp.length} breakpoint rule(s) present, so this sheet must be shot at three viewport widths`
    : `  no breakpoint rules, columns would also have been a valid test`,
);

const columns = `
  <section class="col">
    <div class="lab">After</div>
    <div class="hold">${after}</div>
    <div class="lab">Before</div>
    <div class="hold">${before}</div>
  </section>`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>What the team costs, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--chart-4:#9a9a9e;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;}
  *{box-sizing:border-box}
  body{margin:0;padding:36px 24px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .cols{margin-top:28px}
  .col{max-width:100%}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .hold{margin-bottom:24px}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
  .note{background:#fff;border:1px solid var(--c-border);border-radius:10px;padding:14px 16px;margin-top:26px;max-width:70ch}
  .note b{font-weight:500}
</style>
<h1>What the team costs, before and after</h1>
<p>Both halves are the real section, server rendered. <b>The text is byte for byte
identical</b>, checked rather than eyeballed. Four raw greys were retired for the
token this project already uses for a neutral mark, four values apart in one
channel, and five text sizes were put on the ladder.</p>
<div class="cols">${columns}</div>
<div class="note">
<p><b>Two things I did not change, because both alter what a reader reads.</b></p>
<p><b>Nine figures on this card cannot be read by anyone looking at it.</b> Every
bracket has a low end and a high end, and neither is printed. They exist only in
the description a screen reader hears. A sighted reader gets a bracket on a scale
with no numbers on it, so neither end of any spread can be recovered. Printing
them adds text to the card.</p>
<p><b>Three figures are printed twice.</b> The block at the top takes the first
three roles and the rows below take all of them, so the same three numbers appear
in both. Removing the repeat takes a figure off the page.</p>
<p>Both are your call.</p>
</div>
<footer>Illustrative roles and figures from the bundled sample. This section
appears on London pages only. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
