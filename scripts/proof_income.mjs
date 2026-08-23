/**
 * proof_income , the before and after sheet for "what customers earn here".
 *
 *   node scripts/proof_income.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/income/income-before-after.html";
const r = (p) => readFileSync(`scratchpad/inc-${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-inc.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>What customers earn here, before and after</title>
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
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px;width:100%;max-width:560px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a}
</style>
<h1>What customers earn here, before and after</h1>

<p><b>Both cards are the real section, server rendered, from the data a real London
page is built from.</b> Three incomes are marked on one scale: the median, the top
tenth and the top hundredth. The gaps between them are enormous, so the scale is
a squeezing one, which is right.</p>

<p><b>The labels were not under their marks.</b> The three marks sat at their real
places on that scale. The three labels underneath were spread evenly across the
row, one at each end and one in the middle. Those are two different rules, so the
further apart they drifted the wider the card got.</p>

<p><b>Measured in a browser, not eyeballed.</b> The word "Median" and its figure sat
<b>82 pixels</b> from the mark they name at phone width and <b>258 pixels</b> at
reading width, which is more than a third of the card. At that size a reader
scanning left to right met the Median label, then the Top 10% label, and only
then the median's own mark.</p>

<table class="t">
<tr><th>Distance from label to its own mark</th><th>320px</th><th>480px</th><th>760px</th></tr>
<tr><td>Median, before</td><td class="bad">82px</td><td class="bad">146px</td><td class="bad">258px</td></tr>
<tr><td>Median, after</td><td>0px</td><td>0px</td><td>0px</td></tr>
<tr><td>Top 10%, before</td><td class="bad">43px</td><td class="bad">71px</td><td class="bad">119px</td></tr>
<tr><td>Top 10%, after</td><td>0px</td><td>0px</td><td>0px</td></tr>
<tr><td>Top 1%, before</td><td>5px</td><td>4px</td><td>18px</td></tr>
<tr><td>Top 1%, after</td><td>9px</td><td>3px</td><td>6px</td></tr>
</table>

<p>The last one keeps a few pixels on purpose. Its mark is almost at the right
edge, so a label centred on it would hang off the card. <b>That fault, a mark or
label centred at the very end of a scale with half of it outside the box, is now
the most repeated one this loop has found.</b> It is pinned inside the edge
instead.</p>

<p><b>The second thing: the whole drawing grew with the card.</b> It was one fixed
picture stretched to whatever width it was given, so every part of it stretched.
The marker dots went from a two and a half pixel radius on a phone to nearly
seven at reading width. The plot went from 67 pixels tall to 182, for three ticks
that never needed more than about fifty. <b>The card was 301 pixels tall at
reading width and is 172 now</b>, and the 129 that went was empty.</p>

<table class="t">
<tr><th></th><th>320px</th><th>480px</th><th>760px</th></tr>
<tr><td>Dot radius, before</td><td class="bad">2.5px</td><td class="bad">4.1px</td><td class="bad">6.9px</td></tr>
<tr><td>Dot radius, after</td><td>3.5px</td><td>3.5px</td><td>3.5px</td></tr>
<tr><td>Card height, before</td><td>186px</td><td class="bad">228px</td><td class="bad">301px</td></tr>
<tr><td>Card height, after</td><td>172px</td><td>172px</td><td>172px</td></tr>
</table>

<p><b>Now only the scale stretches.</b> Positions are a proportion of the width;
everything that is drawn is a fixed size. <b>And four raw colour codes went with
it.</b> They were typed into the drawing rather than taken from the site's palette,
which means they could not follow it anywhere. All four are palette entries now.</p>

<p><b>One more thing, found by asking what could break it.</b> The card lets itself
in on the median alone, and then needs all three figures to place its marks. A
missing tail figure falls back to zero, and on a squeezing scale a zero is not a
position at all. Checked across ten cities: <b>exactly one, London, draws this card
at all</b>, the other nine hold no median and it omits. None reaches the broken
state. Unreached is not the same as impossible, so the card now draws nothing
rather than draw a mark it cannot place, or three marks out of order.</p>

<p><b>Nothing a reader reads changed.</b> Byte-identical text, both cards, and the
description a screen reader hears is word for word the one that was there.</p>

<p><b>NOT a library block, and here is what I checked.</b> The catalogue has 141
things matching a scale, a range or a gauge. The nearest, by its own description a
value-against-target chart, turned out to be ten months of invented revenue with a
band across it: the wrong shape, and content that would have to be deleted on
arrival. Nothing in the catalogue draws three labelled points on a squeezing
scale. This is the same call as the other two charts this loop rebuilt by hand,
and for the same reason.</p>

<h2>A real London page</h2>
<div class="lab">After</div><div class="hold">${r("live-after")}</div>
<div class="lab">Before</div><div class="hold">${r("live-before")}</div>

<h2>The bundled sample</h2>
<div class="lab">After</div><div class="hold">${r("seed-after")}</div>
<div class="lab">Before</div><div class="hold">${r("seed-before")}</div>

<footer>The sample card carries illustrative figures. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
