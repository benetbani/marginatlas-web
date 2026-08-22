/**
 * proof_operator , the evidence sheet for "the typical operator".
 *
 * THERE IS NO BEFORE AND AFTER HERE, because nothing was changed. This sheet is
 * the evidence for a KEEP: the section in both the shapes it can take, at three
 * widths, so the claim that it holds up can be checked rather than trusted.
 *
 *   node scripts/proof_operator.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/operator/operator-as-it-stands.html";
const three = readFileSync("scratchpad/op-before.html", "utf8");
const two = readFileSync("scratchpad/op-live-before.html", "utf8");
const tw = readFileSync("scratchpad/tw-op.css", "utf8");

const WIDTHS = [[320, "a phone"], [480, "a half card"], [760, "a full band"]];

const columns = WIDTHS.map(([w, note]) => `
  <section class="col" style="width:${w}px">
    <div class="wlab">${w}px &middot; ${note}</div>
    <div class="lab">What a live trade page shows: two facts</div>
    <div class="hold">${two}</div>
    <div class="lab">The workshop shape: three facts</div>
    <div class="hold">${three}</div>
  </section>`).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The typical operator, as it stands</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-sub:18px;}
  *{box-sizing:border-box}
  body{margin:0;padding:36px 24px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .cols{display:flex;flex-wrap:wrap;gap:34px;align-items:flex-start;margin-top:28px}
  .col{max-width:100%}
  .wlab{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .hold{margin-bottom:22px}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>The typical operator, as it stands</h1>
<p><b>Nothing was changed here, and this sheet is the evidence for that.</b> Every
other section in this loop has turned up something. This one did not, and a clean
section deserves to be shown clean rather than quietly skipped.</p>
<p>What was checked, and what it found: <b>no raw colour values</b> in the section
itself, only the card surface it sits on. <b>No text size off the ladder</b>, every
one a named step. <b>No text hidden behind a hover.</b> <b>No breakpoint rules at
all</b>, so nothing is pitched at a width no phone reaches. And <b>the column count
follows the number of facts</b>, so when the live page drops the third one, as it
does, the strip becomes two columns rather than three with a hole in it. That last
one is the fault that has appeared twice elsewhere in this loop, and this section
already gets it right.</p>
<p><b>A nit I claimed and then withdrew.</b> Before rendering this I expected the
three-fact shape to wrap its middle label onto two lines at phone width. It does
not: all three fit on one line at 320. Written down because the point of
photographing a thing is that it can contradict you, and it did.</p>
<div class="cols">${columns}
</div>
<footer>Illustrative figures from the bundled sample. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
