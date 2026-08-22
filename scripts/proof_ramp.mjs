/**
 * proof_ramp , the before and after sheet for "getting to break-even".
 *
 * Two cases, because only one of them shows anything:
 *
 *   TODAY      the one trade that carries a ramp figure. Break-even lands at the
 *              halfway mark, the marker is nowhere near an edge, and the two
 *              versions are identical. That is the point: nothing a reader sees
 *              today changes.
 *   A SLOWER   a ramp of a year or more. Break-even lands at the end of the
 *   TRADE      horizon, and in the shipped version half the marker is eaten by
 *              the box that rounds the track's ends.
 *
 *   node scripts/proof_ramp.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/ramp/ramp-before-after.html";
const TERRA = "#fb8469";
const LINE_STRONG = "#d8d0cb";
const BORDER = "#e7e2df";
const TRACK = "#e6e6e6";

const CASES = [
  { name: "Today: the one trade that has a ramp figure", open: 16, be: 26 },
  { name: "A slower trade, once one gets a ramp figure", open: 16, be: 58 },
];

function bar(openWeek, breakevenWeek, clipped) {
  const openAt = Math.min(openWeek, breakevenWeek);
  const horizon = Math.max(52, breakevenWeek);
  const pct = (w) => Math.max(0, Math.min(100, (w / horizon) * 100));
  const segs = [];
  if (openAt > 0) segs.push(["Fit-out", 0, openAt, LINE_STRONG]);
  if (breakevenWeek > openAt) segs.push(["Ramp", openAt, breakevenWeek, BORDER]);
  if (horizon > breakevenWeek) segs.push(["Profit", breakevenWeek, horizon, TRACK]);
  const tickPct = pct(breakevenWeek);
  const anchor = tickPct < 14 ? "0%" : tickPct > 86 ? "-100%" : "-50%";
  const fills = segs
    .map(([l, f, t, c]) => `<div class="seg" style="width:${pct(t - f).toFixed(2)}%;background:${c}"></div>`)
    .join("");
  const dot = `<span class="dot" style="left:${tickPct.toFixed(2)}%"></span>`;
  const track = `<div class="track">${fills}${clipped ? dot : ""}</div>`;
  const legend = segs
    .map(([l, f, t, c]) => `<span class="lg"><i style="background:${c}"></i>${l} <b>wk ${f}-wk ${t}</b></span>`)
    .join("");
  return `<div class="phase">
    <div class="lblrow"><span class="belbl" style="left:${tickPct.toFixed(2)}%;transform:translateX(${anchor})">Break-even, week ${breakevenWeek}</span></div>
    ${clipped ? track : `<div class="hold">${track}${dot}</div>`}
    <div class="ends"><span>0</span><span>week ${horizon}</span></div>
    <div class="legend">${legend}</div>
  </div>`;
}

const WIDTHS = [[320, "a phone"], [480, "a half card"], [760, "a full band"]];

const body = CASES.map(
  (c) => `
  <h2>${c.name}</h2>
  <p class="sub">Opens at week ${c.open}. Break-even at week ${c.be}.</p>
  <div class="cols">
    ${WIDTHS.map(([w, note]) => `
    <section class="col" style="width:${w}px">
      <div class="w">${w}px &middot; ${note}</div>
      <div class="lab">After</div>
      <div class="card">${bar(c.open, c.be, false)}</div>
      <div class="lab">Before</div>
      <div class="card">${bar(c.open, c.be, true)}</div>
    </section>`).join("")}
  </div>`,
).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Getting to break-even, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:34px 0 2px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .sub{font-size:13px;margin:0 0 4px}
  b{font-weight:500;font-variant-numeric:tabular-nums}
  .cols{display:flex;flex-wrap:wrap;gap:34px;align-items:flex-start;margin-top:14px}
  .col{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid ${BORDER};border-radius:14px;padding:16px;margin-bottom:22px}
  .lblrow{position:relative;height:18px}
  .belbl{position:absolute;top:0;white-space:nowrap;font-size:11px;font-weight:500;color:#c2410c}
  .hold{position:relative}
  .track{position:relative;display:flex;height:12px;overflow:hidden;border-radius:999px;border:1px solid ${BORDER}}
  .seg{height:100%;border-right:1px solid rgba(255,255,255,.7)}
  .seg:last-child{border-right:0}
  .dot{position:absolute;top:50%;width:14px;height:14px;transform:translate(-50%,-50%);
       border-radius:50%;background:${TERRA};border:2px solid #fff;box-shadow:0 0 0 1px ${BORDER}}
  .ends{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;
        letter-spacing:.04em;text-transform:uppercase;color:#6f6f6d}
  .legend{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:10px;border-top:1px solid ${BORDER};padding-top:10px}
  .lg{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#565654}
  .lg i{width:10px;height:10px;border-radius:2px;display:inline-block}
  .lg b{color:#1b1b1a}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>Getting to break-even, before and after</h1>
<p>The break-even marker used to live inside the track, and the track hides its
overflow so its ends stay rounded. A marker is centred on its position, so at
either extreme half of it was eaten by the very rounding it shared a box with.</p>
<p><b>The first case is what ships today, and the two versions are identical.</b>
That is the point: nothing a reader currently sees changes. The second case is a
trade whose ramp runs past the end of the year. Look at the right-hand end of the
lower bar: half the orange marker is gone.</p>
${body}
<footer>Sample weeks. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
for (const c of CASES) {
  const horizon = Math.max(52, c.be);
  console.log(`  ${c.name.split(":")[0].padEnd(10)} break-even wk ${String(c.be).padStart(2)} of ${horizon}  ->  marker at ${((c.be / horizon) * 100).toFixed(0)}%`);
}
console.log(`\n  wrote ${OUT}`);
