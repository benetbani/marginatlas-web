/**
 * proof_peerstrip , the evidence sheet for the peer rent strip.
 *
 * THERE IS NO AFTER HERE. This row is BLOCKED, and the sheet is the reproduction
 * that says why: every fix within reach either needs a measurement this site
 * deliberately does not take, or is a redesign of the section that is the
 * founder's call and not mine.
 *
 *   node scripts/proof_peerstrip.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/peerstrip/peerstrip-collision.html";
const spread = readFileSync("scratchpad/cs-before.html", "utf8");
const cluster = readFileSync("scratchpad/cs-cluster.html", "utf8");
const tw = readFileSync("scratchpad/tw-cs.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The peer rent strip, and where it breaks</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-border:#e7e2df;--c-line-strong:#d8d0cb;
        --c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;}
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
<h1>The peer rent strip, and where it breaks</h1>
<p><b>This row is blocked, and this sheet is why.</b> Both cards are the real
section, server rendered. Nothing was changed.</p>
<p>The strip puts each peer city as a dot on one axis, labelled with its name and
its gap from the home city. To stop the labels colliding it puts every other one
<b>above</b> the axis and the rest below, alternating <b>by position in the list</b>.
That works only while the values happen to be spread out.</p>
<p><b>Narrow this window to phone width and read the second card.</b> Three peers
within a few points of each other put two of them on the same side of the axis
with almost no gap, and the labels run together: <b>"ParisDublin"</b> over
<b>"-22pp8pp"</b>. Unreadable, and it is not a rare shape: European rent indices
genuinely cluster.</p>
<p><b>The first card is today's data, and it clears by about four pixels.</b> That
is luck, not logic. One more peer, or a different sort, and it reads like the
second.</p>
<p><b>Why it is blocked rather than fixed.</b> Alternating by distance instead of
index does not help: with three in a cluster, two still share a side. Assigning
more lanes needs each label's width, and a label's width is pixels while its
position is a percentage, so the two cannot be reconciled without measuring in a
browser, which this section deliberately does not do. The fixes that do work are
both design decisions: drop to a plain stacked list below some width, or move
every label off the axis into a wrapped row beneath it and leave the dots bare.
<b>Either changes what the section looks like, and this section has a written rule
saying the finding lives on the marker strip.</b> That is the founder's call.</p>

<h2>Today's data: it clears, barely</h2>
<div class="lab">As it ships</div><div class="hold">${spread}</div>

<h2>Three peers clustered: the labels collide</h2>
<div class="lab">As it ships, with clustered values</div><div class="hold">${cluster}</div>

<footer>The clustered card uses invented rent indices to force the shape; its city
names and the home marker are therefore nonsense, which is my test data and not a
defect in the section. The geometry is the point. Nothing on this sheet is
published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
