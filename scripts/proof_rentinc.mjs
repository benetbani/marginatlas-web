/**
 * proof_rentinc , the evidence sheet for "rent against income".
 *
 * THERE IS NO AFTER HERE, and that is the finding. Nothing changed: the card is
 * correct, it reaches no reader, and the one edit that looked free turned out not
 * to be. The sheet is the evidence for all three.
 *
 *   node scripts/proof_rentinc.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/rent-income/rent-income-evidence.html";
const card = readFileSync("scratchpad/ri-seed-after.html", "utf8");
const tw = readFileSync("scratchpad/tw-ri.css", "utf8");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Rent against income, and why nothing changed</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>${tw}</style>
<style>
  :root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
        --c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
        --terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
        --t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;--t-sub:18px;--t-focal:30px;}
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
  .hold{margin-bottom:16px;max-width:420px}
  table.t{border-collapse:collapse;font-size:13px;margin:6px 0 4px;width:100%;max-width:520px}
  table.t th,table.t td{border:1px solid #e2e2df;padding:3px 8px;text-align:left}
  table.t th{background:#f2f1ef;font-weight:500}
  .bad{color:#a3341c;font-weight:600}
  footer{margin-top:34px;font-size:12px;color:#8c8c8a}
</style>
<h1>Rent against income, and why nothing changed</h1>

<p><b>Nothing was changed this time, and this sheet is the evidence for that
decision rather than for a fix.</b> The card below is the real section, server
rendered. It only renders from the bundled sample; see the next paragraph.</p>

<h2>The card</h2>
<div class="lab">As it ships</div>
<div class="hold">${card}</div>

<p><b>First: it reaches no reader.</b> The card needs a monthly one-bed rent and a
median income. The module that builds a real city page drops the whole
cost-of-living block, with the reason written in: no honest source. Checked on
eight cities across four continents, London included: <b>it draws nothing on every
one of them.</b> Eleventh section this loop has found that reaches nobody.</p>

<p><b>Second: it is well built, and the library's nearest block would undo the best
decision in it.</b> The catalogue has a card that is almost exactly this shape: a
big figure, then labelled rows with values. It puts a coloured dot beside each
row, cycling through a five-colour ramp, and <b>the first colour in that ramp is
this site's one accent</b>. That would put the accent on "One-bed rent". This card's
author deliberately took the accent OFF it, on a written rule: <b>the accent marks
the answer, and a cost is not an answer.</b> Adopting the block would have to
re-break that.</p>

<h2>Third: a number a reader can check, that does not always survive checking</h2>

<p>The card prints three figures and the third is worked out from the other two:
rent times twelve, over income. <b>A reader can check it, so it has to survive being
checked.</b> Both printed figures are rounded, and the percentage is worked out from
the unrounded ones. The rent carries an extra decimal on purpose, and the card's
own note says why: so the two sides reconcile. <b>The income beside it does not.</b></p>

<p>Swept nearly three million plausible rent and income pairs:</p>
<table class="t">
<tr><th>The printed percentage against the two printed figures</th><th>share of pairs</th></tr>
<tr><td>agrees exactly</td><td>52.7%</td></tr>
<tr><td>out by 1 point</td><td class="bad">40.4%</td></tr>
<tr><td>out by 2</td><td class="bad">5.2%</td></tr>
<tr><td>out by 3 or more</td><td class="bad">1.7%</td></tr>
</table>
<p><b>Worst case in the sweep: 9 points.</b> A rent of $1,151 a month shown as $1K
against an income of $12,411 shown as $12K. The card says 111%; the two figures
beside it say 120%. That is a low-income city, which is a shape this site covers.
<b>Recorded and not fixed: the fix means printing a figure differently, and this
card prints to nobody.</b></p>

<h2>Fourth, and the most useful thing here</h2>

<p>The one edit that looked free was to move the big percentage off Tailwind's
size scale and onto the site's own ladder. <b>Both are thirty pixels, so it should
have changed nothing.</b> It changed the card by nine pixels.</p>

<p><b>Tailwind's step also sets a line height. The ladder token sets a size only.</b>
So the swap left the line height to inherit and the card grew. Pairing it with a
tight line height, which is what the only other card on that ladder step does,
makes the card six pixels <i>shorter</i> instead, and makes this card's spacing
differ from its neighbour in the same band. <b>Neither is neutral.</b> Reverted, and
the reason is written into the code where the next person will meet it.</p>

<p><b>This matters far beyond this card.</b> There are <b>414</b> sizes waiting to be
moved onto that ladder. <b>Not one of them is a find and replace.</b></p>

<footer>The card carries illustrative figures from the bundled sample. Nothing on
this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
