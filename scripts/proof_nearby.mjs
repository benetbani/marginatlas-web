/**
 * proof_nearby , the before and after sheet for "the same trade, comparable places".
 *
 * BOTH HALVES ARE THE REAL COMPONENT. The before is the shipped version's own
 * server render, captured before the change; the after is the new one's. Neither
 * is a reproduction. The styling is the project's own Tailwind output, compiled
 * against exactly those two files, so the classes resolve to what they resolve
 * to on the site.
 *
 * The two are shown at three widths because the whole risk of this change is
 * that a grid of boxes and a real table do not lay out the same way.
 *
 *   npx tsx scratchpad/capture_nearby.tsx scratchpad/nearby-after.html
 *   node scripts/proof_nearby.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/nearby/nearby-before-after.html";
const before = readFileSync("scratchpad/nearby-before.html", "utf8");
const after = readFileSync("scratchpad/nearby-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-out.css", "utf8");

/* ONE COLUMN AT FULL WIDTH, and the sheet is photographed at three VIEWPORT
   widths instead. This matters and the first version of this sheet got it wrong:
   the phone layout of this section is a media query on the viewport, not on the
   container, so three fixed-width columns inside one wide page all render as
   desktop. The stacked phone layout was invisible in it. */
const columns = `
  <section class="col">
    <div class="lab">After, a real table</div>
    <div class="hold">${after}</div>
    <div class="lab">Before, a grid of boxes</div>
    <div class="hold">${before}</div>
  </section>`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>The same trade, comparable places, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  /* the page's own tokens, as the shell declares them */
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;}
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .cols{margin-top:28px}
  .col{max-width:100%}
  .wlab{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .hold{margin-bottom:24px}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
           clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>The same trade, comparable places, before and after</h1>
<p>Both halves are the real section, server rendered. Neither is a mock up. The
styling is the project's own compiled output for exactly these two renders.</p>
<p><b>The look should be the same. That is the whole point of this one.</b> What
changed is underneath: the before is a grid of plain boxes wearing a header, with
its sort state on a button where the attribute is discarded and its column names
hidden on anything wider than a phone. Above 640 pixels a screen reader read a
place name and then four bare numbers with nothing saying which was which. The
after is a real table, so the structure carries the meaning and the sort state
sits on the header that announces it.</p>
<div class="cols">${columns}</div>
<footer>Illustrative places and figures from the bundled sample. Nothing on this
sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  before ${before.length} bytes | after ${after.length} bytes`);
console.log(`  wrote ${OUT}`);
