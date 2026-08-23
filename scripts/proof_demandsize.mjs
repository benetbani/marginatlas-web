/**
 * proof_demandsize , the before and after sheet for "the spending pool".
 *
 * ONE COLUMN AT FULL WIDTH, shot at several viewport widths. This band splits at
 * 768px; a card in a narrow column inside a wide window is not a card in a narrow
 * window, and that mistake made an earlier sheet in this loop blind to the very
 * defect it was drawn for.
 *
 *   node scripts/proof_demandsize.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/spending-pool/spending-pool-before-after.html";
const r = (p) => readFileSync(`scratchpad/dem-${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-dem.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The spending pool, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;--t-sub:18px;}
  .ma-glyph .a{stroke:#c2410c}
  .ma-glyph .af{fill:#c2410c;stroke:none}
  *{box-sizing:border-box}
  body{margin:0;padding:28px 16px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:22px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:30px 0 4px}
  p{color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:12px 0 6px}
  .hold{margin-bottom:16px}
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a}
</style>
<h1>The spending pool, before and after</h1>

<p><b>Every card here is the real band, server rendered.</b> The top pair is built
from the data a real London page is built from. The bottom pair is the bundled
sample the workshop draws.</p>

<p>The band is meant to be two cards side by side: <b>how much money is in the
town</b> on the left, and <b>how much of it is residents against visitors</b> on the
right. The left card carries a headline figure, dollars spent per resident a
year, and under a rule a second figure, how many millionaires live there.</p>

<p><b>Neither figure has a source, so both are dropped before the page is built.
The card was drawn anyway.</b> A reader got a bordered card containing the words
<b>"The spending pool"</b> and, underneath them, nothing at all. Look at the BEFORE
card: it is an empty box with a title.</p>

<p><b>Checked on eight cities across four continents. All eight.</b> London, Tokyo,
New York, Sao Paulo, Berlin, Mumbai, Lagos, Sydney: not one of them holds either
figure, and every one of them drew the empty card.</p>

<table class="t">
<tr><th>City</th><th>Spend per resident</th><th>Millionaires</th><th>The card held</th></tr>
<tr><td>London</td><td>none</td><td>none</td><td class="bad">only its heading</td></tr>
<tr><td>Tokyo</td><td>none</td><td>none</td><td class="bad">only its heading</td></tr>
<tr><td>New York</td><td>none</td><td>none</td><td class="bad">only its heading</td></tr>
<tr><td>Sao Paulo</td><td>none</td><td>none</td><td class="bad">only its heading</td></tr>
<tr><td>Berlin, Mumbai, Lagos, Sydney</td><td>none</td><td>none</td><td class="bad">only its heading</td></tr>
<tr><td>the bundled sample</td><td>$22K</td><td>227K</td><td>content, as designed</td></tr>
</table>

<p><b>A heading is not content.</b> The card now leaves when its figures do, which
is what every other card on this page already does. The card beside it is
untouched and takes the row on its own.</p>

<p><b>Nothing else moved, and the sample proves it: that pair is byte for byte
identical.</b> Three words leave the real page, "The spending pool", and they are
the title of the box that was empty. No figure changed in either direction and
nothing was added.</p>

<p><b>The card itself was NOT replaced, and the library is the reason to say so
out loud.</b> The catalogue carries twenty-nine stat cards and the closest one does
exactly this job: a label, a big number, a percentage against last year. It ships
a green arrow for up and a red one for down. <b>This site has one accent colour and
that is the whole rule</b>, so both would have to go, and with them the card's
reason to exist. What is left after stripping it is what is already here. <b>No
block fixes a missing guard.</b></p>

<h2>A real London page</h2>
<div class="lab">After</div><div class="hold">${r("live-after")}</div>
<div class="lab">Before, an empty box with a title</div><div class="hold">${r("live-before")}</div>

<h2>The bundled sample, unchanged</h2>
<div class="lab">After</div><div class="hold">${r("seed-after")}</div>
<div class="lab">Before</div><div class="hold">${r("seed-before")}</div>

<footer>The sample card carries illustrative figures. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
