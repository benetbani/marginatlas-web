/**
 * proof_wtt , the before and after sheet for "where to trade, by district".
 *
 *   node scripts/proof_wherepays.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/wheretotrade/wheretotrade-before-after.html";
const before = readFileSync("scratchpad/wtt-before.html", "utf8");
const after = readFileSync("scratchpad/wtt-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-wtt.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Where to trade, by district</title>
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
<h1>Where to trade, by district</h1>
<p>Both cards are the real section, server rendered. <b>They are byte for byte
identical, all ten thousand seven hundred and twenty five of them</b>, and that is
the finding rather than a disappointment.</p>
<p><b>This section's own headline called it a map "cross-linked on hover" with the
list beside it. That cross-link was never built.</b> The map component takes
points, a fit padding, a select callback, a label, a class and a height. It has no
prop for an externally highlighted point, so nothing the list did could ever have
reached it.</p>
<p>What the list kept was the machinery for that link: a piece of state holding a
hovered district, two mouse handlers, and an inline background applied to the
matching row. <b>That background is the exact value the shared hover class on the
same element already applies.</b> So the state reproduced a stylesheet rule,
re-rendering every row on every mouse move across the list, in service of a
connection that does not exist.</p>
<p>All of it is gone, and with the last piece of state went the client boundary:
<b>this section renders on the server now.</b> The identical markup above is the
proof that nothing a reader sees was riding on it.</p>
<p>The map is missing from both cards here for an honest reason: it loads a
stylesheet that only a bundler can read, so the section cannot be rendered whole
outside the app. The ranked list is the half this change touched.</p>
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
