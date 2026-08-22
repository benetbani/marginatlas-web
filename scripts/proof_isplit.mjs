/**
 * proof_isplit , the before and after sheet for the trade page's $100 stack.
 *
 * Two ladders. A healthy one, where the two versions are identical and should
 * be. And one where a floor in the arithmetic fires, which is what happens when
 * measured margins do not arrive in textbook order and nothing upstream promises
 * they will: the four parts total 107, the bar squeezes itself back inside its
 * own track and looks perfectly fine, and the printed percentages beside it add
 * to more than the hundred dollars the section is about.
 *
 *   node scripts/proof_isplit.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/industry-split/industry-split-before-after.html";
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

const healthyBefore = read("scratchpad/isplit-before.html");
const healthyAfter = read("scratchpad/isplit-after.html");
const brokenBefore = read("scratchpad/isplit-broken-before.html");
const brokenAfter = read("scratchpad/isplit-broken-after.html");
const tw = read("scratchpad/tw-isplit.css");

const nothing = `<p class="none">Draws nothing at all.</p>`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>Where each $100 goes, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet">
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
  h2{font-size:15px;font-weight:500;margin:34px 0 4px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:14px 0 6px}
  .none{background:#fff;border:1px dashed var(--c-border);border-radius:10px;padding:14px 16px;
        color:#8c8c8a;font-size:13px;margin:0}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>Where each $100 goes, before and after</h1>
<p>This stack is built well: the last stage is the residual of the other three, so
rounding cannot escape and the four parts add to exactly a hundred. <b>The healthy
ladder below is identical in both versions, and should be.</b></p>
<p><b>What can escape is a floor.</b> Every stage is clamped at zero, and measured
margins are under no obligation to arrive in textbook order. Put a ladder through
it where the net figure sits above the operating one and the four parts total
<b>107</b>; above the gross figure and they total <b>135</b>. The bar is a flexible
row, so it quietly squeezes itself back inside its own track and looks perfectly
fine, <b>while the percentages printed beside it add to a third more than the
hundred dollars the section is about.</b></p>
<p>It refuses to draw now. The tolerance is one point rather than the four used on
the trade-in-a-place page, deliberately: that stack rounds each slice on its own
and drifts by about a point in ordinary use, while this one is exact by
construction, so anything off here means a floor fired.</p>

<h2>A healthy ladder</h2>
<div class="lab">After</div>${healthyAfter || nothing}
<div class="lab">Before</div>${healthyBefore || nothing}

<h2>A ladder whose parts total 107</h2>
<div class="lab">After</div>${brokenAfter || nothing}
<div class="lab">Before</div>${brokenBefore || nothing}

<footer>Illustrative figures. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  healthy: before ${healthyBefore.length}b, after ${healthyAfter.length}b`);
console.log(`  broken:  before ${brokenBefore.length}b, after ${brokenAfter.length}b`);
console.log(`  wrote ${OUT}`);
