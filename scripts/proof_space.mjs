/**
 * proof_space , the before and after sheet for the "what space costs" band.
 *
 * ONE COLUMN AT FULL WIDTH, shot at several viewport widths. Do not put the
 * cards side by side: this band splits at 768px, and a card in a 380px column
 * inside a 1280px window is not a card in a 380px window. That mistake made an
 * earlier sheet in this loop unable to see the very defect it was drawn for.
 *
 *   node scripts/proof_space.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/space/space-before-after.html";
const r = (p) => readFileSync(`scratchpad/space-${p}.html`, "utf8");
const tw = readFileSync("scratchpad/tw-space.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>What space costs, before and after</title>
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
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  .good{color:#1b1b1a;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a}
</style>
<h1>What space costs, before and after</h1>

<p><b>Every card here is the real band, server rendered.</b> The top pair is built
from the data a real London page is built from. The bottom pair is the bundled
sample the workshop draws.</p>

<p>The band puts each peer city as a dot on one axis, labelled with its gap from
the home city in percentage points. <b>It worked out that gap by subtracting a
fixed 100 from each city's cost index.</b> That is a gap from the home city only
while the home city happens to read exactly 100. The bundled sample does. <b>The
real data does not: London reads 75 on it.</b></p>

<p>So on the London page the strip drew <b>London 25 points below itself</b>, put
Munich on the identical spot, and <b>reversed the sign of every city dearer than
home.</b> Los Angeles read as 11 points cheaper than London when the source has it
14 points dearer.</p>

<p><b>And London is not a special case.</b> The site carries 252 cities. <b>Exactly
one of them, New York, reads 100 on that index</b>, which is the only value at
which the old arithmetic came out right. The typical city reads 52, so it was
drawn 48 points below itself. The lowest, Alexandria, was drawn 80 points below
itself. <b>Every figure on this strip was wrong on 251 of 252 city pages.</b></p>

<table class="t">
<tr><th>City</th><th>Cost index</th><th>Drawn before</th><th>Drawn after</th></tr>
<tr><td>London (home)</td><td class="fig">75</td><td class="fig bad">-25pp</td><td class="fig good">0</td></tr>
<tr><td>Munich</td><td class="fig">75</td><td class="fig bad">-25pp</td><td class="fig good">0</td></tr>
<tr><td>Paris</td><td class="fig">73</td><td class="fig bad">-27pp</td><td class="fig good">-2pp</td></tr>
<tr><td>Los Angeles</td><td class="fig">89</td><td class="fig bad">-11pp</td><td class="fig good">+14pp</td></tr>
</table>

<p>The fix is the arithmetic the <b>peer table further down the same page has
always used</b> for this same figure: subtract the home city, not a fixed number.
Nothing else moved. <b>The sample pair below is byte for byte identical</b>, which
is the proof that only the arithmetic changed.</p>

<p><b>A second thing was hiding in plain sight.</b> London and Munich carry the same
cost index, so they land on the same point, and the later dot covered the earlier
one. The one dot drawn in terracotta, the home city, the entire point of the
strip, <b>was buried under a grey peer.</b> It is drawn on top now. That was true
before this change too: look at the before card and the marker at that spot is
grey.</p>

<p><b>What is NOT fixed, said plainly.</b> Narrow this window to phone width and the
words <b>Paris</b> and <b>Munich</b> run together above the axis. That crowding is
identical before and after, and it is the reason this section is already parked
for a decision. It cannot be fixed by arithmetic: separating labels needs their
width in pixels, and this section is drawn on the server where no pixel widths
exist. The two ways out, dropping to a plain list on a phone or moving every
label off the axis, both change what the section looks like. That is a call to
make, not a bug to patch.</p>

<p><b>A third thing, which no picture on this sheet can show.</b> The small "?"
beside the axis explains what a percentage point is, and it ended its sentence
with the words <b>"the London rent level"</b>, typed in rather than taken from the
page. On London that reads correctly. <b>On the other 251 city pages it named
London while the axis above it named the city you were actually reading.</b> It
now takes the name from the page, checked on London, Tokyo and Sao Paulo. The
gloss only exists once the "?" is opened, so it is absent from these cards by
design.</p>

<h2>A real London page</h2>
<div class="lab">After</div><div class="hold">${r("live-after")}</div>
<div class="lab">Before</div><div class="hold">${r("live-before")}</div>

<h2>The bundled sample, unchanged</h2>
<div class="lab">After</div><div class="hold">${r("seed-after")}</div>
<div class="lab">Before</div><div class="hold">${r("seed-before")}</div>

<footer>The sample card carries illustrative cities, figures and lease terms.
Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
