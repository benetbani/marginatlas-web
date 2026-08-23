/**
 * proof_citypeers , the before and after sheet for the peer comparison table.
 *
 *   node scripts/proof_citypeers.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/citypeers/citypeers-before-after.html";
const r = (p) => readFileSync(`scratchpad/cp-${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-cp.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>The peer comparison table, before and after</title>
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
  p{color:#57575b;margin:0 0 8px;max-width:72ch}
  .fig{font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:12px 0 6px}
  .hold{margin-bottom:18px;outline:1px dashed #c9c3bd;outline-offset:6px}
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px;width:100%;max-width:560px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a;max-width:72ch}
</style>
<h1>The peer comparison table, before and after</h1>

<p><b>A whole section of the site had never once appeared on a page.</b> Four rows,
four measures, every city in the peer set set beside the home city. Written,
finished, mounted, and it could not draw.</p>

<p>The table adds a row only when at least one city carries the figure that row
needs. <b>The check was handed the row's name instead of the figure's name</b> ,
"rent" where the figure is called rent index, "vis" where it is called visitors.
So it never found anything, no row was ever added, and the section quietly
returned nothing. <b>Reproduced against both shapes of data this site has: it could
not draw for any input, the bundled sample included.</b></p>

<p><b>This is why the closing chapter of four city pages was a heading above blank
space.</b> That chapter holds this table and one other card. On London the other
card had something to show, so the chapter looked thin rather than broken. On New
York, Mumbai, Lagos and Sydney it did not, and the chapter rendered as the words
"The next move" and nothing else. <b>All four are now full.</b></p>

<table class="t">
<tr><th>The closing chapter</th><th>before</th><th>after</th></tr>
<tr><td>London</td><td class="bad">3,130 bytes, no table</td><td>11,815 bytes</td></tr>
<tr><td>New York</td><td class="bad">340 bytes: a heading and nothing else</td><td>9,045 bytes</td></tr>
<tr><td>City pages with an empty chapter</td><td class="bad">4 of 8</td><td>0 of 8</td></tr>
</table>

<p><b>This adds text a reader can see, which is normally something I refuse to do.</b>
It is the whole point here: the section was meant to be there and was silently
missing. Nothing was invented. Every figure in the table is computed from figures
the page already held, and every row reads as a gap from the home city, so the
home column is zero all the way down. On New York: Chicago is 23 points cheaper on
rent, 20 points lower on customer income, and 81 points lower on visitors.</p>

<p><b>How it was found.</b> Not by reading the section, which looks correct. A sweep
across fifteen real pages reported which section titles never appear on any of
them, and this one came back as never seen while its data was plainly present.
That contradiction is what pointed at the guard. <b>Reading one section at a time
would not have found this,</b> because the section reads as fine.</p>

<h2>New York, where the chapter was a heading and nothing else</h2>
<div class="lab">After</div><div class="hold">${r("new-york-after")}</div>
<div class="lab">Before</div><div class="hold">${r("new-york-before")}</div>

<h2>London, where the chapter had one card</h2>
<div class="lab">After</div><div class="hold">${r("london-after")}</div>
<div class="lab">Before</div><div class="hold">${r("london-before")}</div>

<footer>Both pages are the real closing chapter, server rendered, cut from the
whole page. The dashed outline is this sheet's. Nothing here is published
anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
