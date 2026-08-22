/**
 * proof_masthead , the before and after sheet for the masthead turnover spread.
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

const OUT = "docs/loop/artifacts/masthead/masthead-before-after.html";
const before = readFileSync("scratchpad/masthead-before.html", "utf8");
const after = readFileSync("scratchpad/masthead-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-mast.css", "utf8");

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
<title>The turnover spread, before and after</title>
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
<h1>The turnover spread, before and after</h1>
<p>Both halves are the real masthead, server rendered. <b>Every visible word and
figure is byte for byte identical</b>, checked node by node.</p>
<p><b>What changed cannot be seen, and that is the point.</b> One of the two ways
this band gets built multiplies the typical figure by fixed constants, so it draws
the same shape for a restaurant, a barbershop and a dental practice. The ruling on
invented bands says that must be marked. The mark existed in the data and was
being thrown away one layer above the strip, so it never arrived. It arrives now,
and the description read aloud says <b>"Modelled range from ... to ..."</b> instead
of stating the range as fact.</p>
<p>Two other things went with it. The strip carried a second mode that ran its
track from grey into the accent colour: it has exactly one caller, that caller
always asked for the plain track, so <b>the accent branch drew on no page at
all</b> and it broke the same colour rule the risk scale broke. And the three
figures under the track were pushed to the ends with nothing stopping them meeting
on a narrow masthead; they now wrap instead.</p>
<div class="cols">${columns}</div>
<footer>Illustrative figures from the bundled sample. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
