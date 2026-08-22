/**
 * proof_seasonality , the before and after sheet for "busy months and quiet months".
 *
 * BEFORE is the shipped drawing reproduced exactly: a 300-unit-wide picture with
 * preserveAspectRatio switched OFF, given the card's full width and a pinned
 * height. That combination scales the drawing HORIZONTALLY ONLY, so every letter
 * in it is distorted rather than merely resized.
 *
 * AFTER is the same chart drawn in layout: columns whose heights are
 * percentages, and text that is real text at a real size.
 *
 * Read the month initials along the bottom across the three widths.
 *
 *   node scripts/proof_seasonality.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/seasonality/seasonality-before-after.html";
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/* A year with a real shape: quiet late winter, a strong December. */
const M = [84, 79, 88, 95, 101, 104, 98, 92, 103, 110, 118, 131];
const top = Math.max(100, ...M);
const peak = M.indexOf(Math.max(...M));
const trough = M.indexOf(Math.min(...M));
const PLOT = 78;

/* ---- BEFORE: the shipped SVG, verbatim in geometry ---------------------- */
function beforeSvg() {
  const W = 300, H = 110, padL = 22, padR = 6, padTop = 10, padBot = 18;
  const innerW = W - padL - padR;
  const slot = innerW / M.length;
  const Y = (v) => padTop + (1 - v / top) * (H - padTop - padBot);
  const cols = M.map((v, i) => {
    const x = padL + i * slot + slot * 0.18, bw = slot * 0.64;
    return `<rect x="${x.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(Y(0) - Y(v)).toFixed(1)}" rx="1.5" fill="#c9c9c7"/>`;
  }).join("");
  const labels = M.map((_, i) =>
    `<text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${H - 5}" text-anchor="middle" fill="#8c8c8a" font-size="8">${MONTHS[i]}</text>`).join("");
  const marks = [peak, trough].map((i) =>
    `<text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${(Y(M[i]) - 4).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="#1b1b1a" font-weight="600">${M[i]}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:110px" preserveAspectRatio="none">
    <line x1="${padL}" y1="${Y(100).toFixed(1)}" x2="${W - padR}" y2="${Y(100).toFixed(1)}" stroke="#e0dedc" stroke-width="0.75" stroke-dasharray="3 3"/>
    <text x="${padL - 4}" y="${(Y(100) + 2.5).toFixed(1)}" text-anchor="end" fill="#8c8c8a" font-size="7.5">100</text>
    ${cols}
    <line x1="${padL}" y1="${Y(0).toFixed(1)}" x2="${W - padR}" y2="${Y(0).toFixed(1)}" stroke="#c9c9c7" stroke-width="1"/>
    ${labels}${marks}
  </svg>`;
}

/* ---- AFTER: the same chart in layout ------------------------------------ */
const MONTHS_ROW = 15;
const RULE = (100 / top) * PLOT + MONTHS_ROW;
function afterHtml() {
  const cols = M.map((v, i) => {
    const mark =
      i === peak || i === trough
        ? `<span class="mk" style="bottom:${((v / top) * PLOT + 3).toFixed(1)}px">${v}</span>`
        : "";
    return `<div class="col">${mark}<div class="bar" style="height:${((v / top) * PLOT).toFixed(1)}px"></div></div>`;
  }).join("");
  const months = MONTHS.map((mo) => `<span class="mo">${mo}</span>`).join("");
  return `<div class="plot" id="plot">
    <span class="axis" id="axis" style="bottom:${(RULE - 4).toFixed(1)}px">100</span>
    <div class="rule" id="rule" style="bottom:${RULE.toFixed(1)}px"></div>
    <div class="cols" style="height:${PLOT + 14}px">${cols}</div>
    <div class="base"></div>
    <div class="months">${months}</div>
  </div>`;
}

const WIDTHS = [[320, "a phone"], [480, "a half card"], [760, "a full band"]];

const columns = WIDTHS.map(([w, note]) => `
  <section class="col2" style="width:${w}px">
    <div class="w">${w}px &middot; ${note}</div>
    <div class="lab">After, drawn in layout</div>
    <div class="card">${afterHtml()}<div class="cap">Monthly demand, indexed; the dashed rule marks 100.</div></div>
    <div class="lab">Before, a stretched picture</div>
    <div class="card">${beforeSvg()}<div class="cap">Monthly demand, indexed; the dashed rule marks 100.</div></div>
  </section>`).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Busy months and quiet months, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet">
<style>
  :root{ --chart-5:#c0c0c4; --c-border:#e7e2df; --c-ink:#1b1b1a; --c-muted:#6f6f6d; }
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .cols{display:flex}
  .wrapcols{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;margin-top:30px}
  .col2{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid var(--c-border);border-radius:14px;padding:16px;margin-bottom:24px}
  .cap{margin-top:6px;font-size:11px;color:var(--c-muted)}
  /* the after chart */
  .plot{position:relative;padding-left:24px}
  .axis{position:absolute;left:0;width:20px;text-align:right;font-size:10px;line-height:1;color:var(--c-muted)}
  .rule{position:absolute;left:24px;right:0;border-top:1px dashed var(--c-border)}
  .plot .cols{display:flex;align-items:flex-end}
  .col{position:relative;flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
  .bar{width:64%;border-radius:1.5px;background:var(--chart-5)}
  .mk{position:absolute;left:0;right:0;text-align:center;font-size:10px;line-height:1;
      color:var(--c-ink);font-family:"Space Grotesk",ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .base{border-top:1px solid var(--chart-5)}
  .months{display:flex;margin-top:4px}
  .mo{flex:1;min-width:0;text-align:center;font-size:10px;line-height:1;color:var(--c-muted)}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>Busy months and quiet months, before and after</h1>
<p>The same twelve months, drawn twice, at three widths.</p>
<p><b>Read the month initials along the bottom of each chart, across the three
columns.</b> The lower one is a fixed three-hundred-unit picture stretched to fill
whatever width the card ends up at, with its aspect ratio deliberately unlocked
and its height pinned. So it is scaled sideways only: at the widest column the
letters are two and a half times too wide for their height. They are not just
bigger, they are the wrong shape. The upper chart is real text that never moves,
above bars that stretch on their own.</p>
<div class="wrapcols">${columns}
</div>
<footer>Sample year, shaped like a real one. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  peak ${M[peak]} in month ${peak + 1}, trough ${M[trough]} in month ${trough + 1}, axis top ${top}`);
console.log(`  horizontal stretch of the old drawing: ${(320 / 300).toFixed(2)}x at 320 wide, ${(760 / 300).toFixed(2)}x at 760 wide, against 1.00x vertical`);
console.log(`  wrote ${OUT}`);
