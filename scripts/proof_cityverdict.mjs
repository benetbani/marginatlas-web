/**
 * proof_cityverdict , the before and after sheet for "the rent, district by district".
 *
 *   node scripts/proof_wherepays.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/cityverdict/cityverdict-before-after.html";
const before = readFileSync("scratchpad/cv-before.html", "utf8");
const after = readFileSync("scratchpad/cv-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-cv.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The rent, district by district, before and after</title>
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
<h1>The rent, district by district, before and after</h1>
<p>Both cards are the real section, server rendered. <b>Every word and figure is
byte for byte identical</b>, checked node by node.</p>
<p><b>Narrow this window to phone width and read the three-cell strip.</b> Three
fixed columns in a phone card leave each cell about fifty pixels, so <b>"the
baseline" printed as "the bas..."</b> with nothing to recover it from, and the
middle tag wrapped onto two lines while its neighbours did not, dropping that
cell's figure and name below the other two. A three-cell strip that will not fit
three across is not a three-cell strip.</p>
<p>The cells size themselves now and wrap exactly when they must. Nothing is cut,
and the hairlines come from the gap rather than from a divider rule, which is what
stops a wrapped line starting with one. Same shape the masthead scorecard uses,
and for the same reason. At full width nothing moves.</p>
<p>Recorded and not changed: this section is <b>London only</b>. Off London the
district set is left undefined upstream and the whole card omits itself.</p>
<div class="lab">After</div>
<div class="hold">${after}</div>
<div class="lab">Before</div>
<div class="hold">${before}</div>
<footer>Illustrative districts and figures from the bundled sample. Nothing on
this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
