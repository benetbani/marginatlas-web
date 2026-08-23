/**
 * proof_customers , the before and after sheet for the "who buys, and when" chapter.
 *
 *   node scripts/proof_customers.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/customers/customers-before-after.html";
const r = (p) => readFileSync(`scratchpad/cust-${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-cust.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Who buys, and when, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;--t-sub:18px;--t-head:20px;}
  .ma-glyph .a{stroke:#c2410c}
  .ma-glyph .af{fill:#c2410c;stroke:none}
  *{box-sizing:border-box}
  body{margin:0;padding:28px 16px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:22px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:30px 0 4px}
  p{color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:12px 0 4px}
  /* The holder is outlined so the foot of the chapter is visible; the outline is
     this sheet's, not the page's. NOTHING ELSE IS ADDED. An earlier draft of this
     sheet tinted the empty container to point at it, and that tint had higher
     specificity than the fix, so it forced the container back on in BOTH cards and
     the two measured identically. The instrument had cancelled the thing it was
     measuring. The gap is shown by the outline and by the measured heights instead. */
  .hold{margin-bottom:16px;outline:1px dashed #c9c3bd;outline-offset:6px}
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a}
</style>
<h1>Who buys, and when, before and after</h1>

<p><b>Every block here is the real chapter, cut out of a real city page, server
rendered.</b> The dashed outline is this sheet's, not the page's.</p>

<p>This chapter is built to hold four cards: <b>the spending pool, how seasonal it
is, what customers earn, and rent measured against that income.</b> The two on the
right sit in a container that splits the row between them.</p>

<p><b>Both of them can leave, and the container was drawn anyway.</b> On seven of the
eight cities checked, that container ended the chapter holding nothing, and the
spacing above it still applied, so a reader got a band of dead air at the foot of
the chapter. It is invisible by definition, which is why it
survived. <b>Measured in a browser rather than
eyeballed: the Tokyo chapter is 260 pixels tall before and 244 after at phone
width, and 239 before and 223 after at both wider sizes. Sixteen pixels of
nothing, gone, at every width. London measures the same to the pixel before and
after, because one half of its container does draw.</b></p>

<p><b>The container now leaves when both its halves do.</b> The rule is written as
"hide me if I am empty" rather than as a list of conditions, on purpose: the two
cards decide for themselves whether to draw, and any condition copied up here
would be free to drift away from theirs.</p>

<p><b>Nothing a reader reads changed.</b> Both chapters carry byte-identical text
before and after; the only difference in the markup is that one rule. London is
below as the control: one half of its container does draw, so nothing there moves
at all.</p>

<h2>Tokyo, where both halves are absent</h2>
<div class="lab">After</div><div class="hold">${r("tokyo-after")}</div>
<div class="lab">Before, note where the outline sits under the card</div>
<div class="hold">${r("tokyo-before")}</div>

<h2>London, where one half draws, as the control</h2>
<div class="lab">After</div><div class="hold">${r("london-after")}</div>
<div class="lab">Before</div><div class="hold">${r("london-before")}</div>

<h2>What is in this chapter on a real page</h2>
<table class="t">
<tr><th>Card</th><th>London</th><th>The other seven cities</th></tr>
<tr><td>The spending pool</td><td class="bad">omitted</td><td class="bad">omitted</td></tr>
<tr><td>How seasonal it is</td><td>drawn</td><td>drawn</td></tr>
<tr><td>What customers earn</td><td>drawn</td><td class="bad">omitted</td></tr>
<tr><td>Rent against income</td><td class="bad">omitted</td><td class="bad">omitted</td></tr>
</table>

<p><b>Read that table.</b> A heading that promises who buys and when opens, on seven
of eight cities, onto a single small card showing what share of the town is
visitors. <b>Rent against income reaches no reader anywhere, London included.</b>
Those are two separate sections that were never written into this loop's list at
all; they are in it now, and they get their own turns. <b>Neither was touched
here.</b></p>

<footer>Nothing on this sheet is published anywhere. The dashed outline is drawn
by this sheet, to show where the foot of each chapter falls.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
