/**
 * proof_close , the before and after sheet for "the close".
 *
 *   node scripts/proof_close.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/close/close-before-after.html";
const r = (p) => readFileSync(`scratchpad/${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-close.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The close, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-sub:18px;}
  *{box-sizing:border-box}
  body{margin:0;padding:36px 24px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:32px 0 6px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:12px 0 6px}
  .hold{margin-bottom:18px}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>The close, before and after</h1>
<p>All four cards are the real section, server rendered. <b>Every word and figure
is byte for byte identical</b>, checked node by node.</p>
<p><b>The second pair is the one to read, at full width.</b> This band is built to a
stated rule, written in its own comment: one full-width band, both flanks carrying
content, never a lockup huddled left over a blank right. The recap figure on the
left is OPTIONAL, and its guard lets it vanish whenever the trade carries no kept
figure. With it gone the row had one thing to space and put it at the start, so
<b>the band failed its own stated rule</b>: a lone call to action on the left and
an empty right.</p>
<p>With no recap, that block now spans the row and pushes its own two halves apart,
so both flanks carry something either way. When the recap is present nothing moves
at all.</p>

<h2>With the recap figure</h2>
<div class="lab">After</div><div class="hold">${r("close-after")}</div>
<div class="lab">Before</div><div class="hold">${r("close-before")}</div>

<h2>Without it, which the guard allows</h2>
<div class="lab">After</div><div class="hold">${r("close-norecap-after")}</div>
<div class="lab">Before</div><div class="hold">${r("close-norecap-before")}</div>

<footer>Illustrative figures from the bundled sample. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
