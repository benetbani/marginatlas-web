/**
 * proof_demand , the before and after sheet for "what a customer spends".
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

const OUT = "docs/loop/artifacts/demand/demand-before-after.html";
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

const healthyBefore = read("scratchpad/demand-live-before.html");
const healthyAfter = read("scratchpad/demand-live-after.html");
const brokenBefore = read("scratchpad/demand-before.html");
const brokenAfter = read("scratchpad/demand-after.html");
const tw = read("scratchpad/tw-demand.css");

const nothing = `<p class="none">Draws nothing at all.</p>`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>What a customer spends, before and after</title>
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
<h1>What a customer spends, before and after</h1>
<p>Both halves of each pair are the real section, server rendered. <b>Every word
and figure is byte for byte identical</b>, checked node by node.</p>
<p><b>The first pair is what a real trade page actually receives.</b> The visits
figure is deliberately left out upstream for want of an honest source, so only the
spend figure arrives. The band split itself into two halves regardless, so the one
figure sat in the left half of a full-width band with the right half empty and a
dividing rule drawn down the middle of nothing. It only splits when there are two
figures to split now.</p>
<p>The focal figure also sat at forty pixels, which is not a step on this site's
type ladder: the ladder has one size for a section's own focal figure and a larger
one reserved for the single dominant figure of a whole page, and this is the
first. It is on the ladder now, and the ratchet moved down.</p>
<h2>What a live trade page receives</h2>
<div class="lab">After</div>${healthyAfter || nothing}
<div class="lab">Before</div>${healthyBefore || nothing}

<h2>The workshop shape, with both figures</h2>
<div class="lab">After</div>${brokenAfter || nothing}
<div class="lab">Before</div>${brokenBefore || nothing}

<footer>Illustrative figures. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  healthy: before ${healthyBefore.length}b, after ${healthyAfter.length}b`);
console.log(`  broken:  before ${brokenBefore.length}b, after ${brokenAfter.length}b`);
console.log(`  wrote ${OUT}`);
