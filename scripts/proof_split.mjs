/**
 * proof_split , the evidence sheet for the resident/visitor bar.
 *
 *   node scripts/proof_split.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/split/split-evidence.html";
const card = readFileSync("scratchpad/dem-live-after40.html", "utf8");
const tw = readFileSync("scratchpad/tw-dem.css", "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const repro = esc(readFileSync("scratchpad/split.txt", "utf8").replace(/^\s*\n/, ""));

const html = `<!doctype html>
<meta charset="utf-8">
<title>How seasonal it is, and the total nobody was checking</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;--t-sub:18px;}
  .ma-glyph .a{stroke:#c2410c}.ma-glyph .af{fill:#c2410c;stroke:none}
  *{box-sizing:border-box}
  body{margin:0;padding:28px 16px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:22px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:28px 0 4px}
  p{color:#57575b;margin:0 0 8px;max-width:72ch}
  pre{background:#fff;border:1px solid #e7e2df;border-radius:10px;padding:12px 14px;
      overflow-x:auto;font-size:11.5px;line-height:1.5;font-family:ui-monospace,monospace;color:#3a3a38}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:12px 0 6px}
  .hold{margin-bottom:16px;max-width:440px}
  footer{margin-top:32px;font-size:12px;color:#8c8c8a;max-width:72ch}
</style>
<h1>How seasonal it is, and the total nobody was checking</h1>

<p><b>Nothing a reader sees has changed, and this sheet is the evidence for a
change made underneath.</b> The card below is the real section, server rendered from
a real London page.</p>

<div class="lab">As it ships, unchanged</div>
<div class="hold">${card}</div>

<p>The bar is two segments: the share of the town that is residents and the share
that is visitors. <b>Drawing them as one whole bar is a claim that between them they
account for everything.</b> Nothing was checking that they do.</p>

<p>The two shares are rounded separately before they arrive, so each carries up to
half a point of error and the pair can land on 99 or on 101. <b>At 99 a strip of
bare card shows through the end of the bar. At 101 the last segment is squeezed,
so what is drawn stops matching what is printed beside it.</b></p>

<pre>${repro}</pre>

<p><b>Two responses, because the two causes are different.</b> Within a point of 100
it is rounding, so the widths are now taken as shares of the real total and the
bar closes; the printed figures are untouched. Further out than that, a slice has
gone missing somewhere upstream, the shape no longer means what it claims, and
<b>the card draws nothing rather than draw a bar with a hole in it.</b></p>

<p><b>All eight real cities land on exactly 100 today, so nothing moves.</b> That was
true by luck; it is now true by construction. This is the fourth thing this month
that was correct only by coincidence, after a label crowding that happened to
clear by four pixels, a comparison that happened to be anchored right on one city
out of 252, and a chapter guard that happened to hold.</p>

<footer>The card carries real London figures. The reproduction above is arithmetic,
not a render: it shows what the bar would draw, and today it draws none of it.
Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
