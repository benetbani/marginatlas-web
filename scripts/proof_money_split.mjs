/**
 * proof_money_split , the before and after sheet for the cell page's $100 bar.
 *
 * Renders the EXACT markup the page uses, at three widths, twice: once with the
 * widths set to the literal percentages (what shipped), once normalised to the
 * true total (what ships now). The split used is a real-shaped one that rounds
 * to 99, which is the 20% of cases where the bar stopped short of its own track.
 *
 *   node scripts/proof_money_split.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/money-split/money-split-before-after.html";

/* A split that rounds to 99: 33 + 31 + 9 + 23 + 3. The kept slice is last and
   terracotta, exactly as the page's honesty sort pins it. */
const SEGMENTS = [
  { label: "Cost of goods", pct: 33 },
  { label: "Payroll", pct: 31 },
  { label: "Rent and premises", pct: 9 },
  { label: "Everything else", pct: 23 },
  { label: "What the owner keeps", pct: 3, kept: true },
];
const GREY_RAMP = ["#a3a3a1", "#b4b4b2", "#c4c4c2", "#d3d3d1"];
const TERRA = "#fb8469";
const SUM = SEGMENTS.reduce((a, s) => a + s.pct, 0);

const bar = (normalize) => {
  const w = (s) => (normalize ? (s.pct / SUM) * 100 : s.pct);
  const segs = SEGMENTS.map(
    (s, i) =>
      `<div style="height:100%;width:${w(s).toFixed(3)}%;background:${
        s.kept ? TERRA : GREY_RAMP[i % GREY_RAMP.length]
      }"></div>`,
  ).join("");
  const legend = SEGMENTS.map(
    (s, i) =>
      `<span class="lg"><i style="background:${
        s.kept ? TERRA : GREY_RAMP[i % GREY_RAMP.length]
      }"></i>${s.label} <b>${s.pct}%</b></span>`,
  ).join("");
  return `<div class="track">${segs}</div><div class="legend">${legend}</div>`;
};

const WIDTHS = [
  [320, "a phone"],
  [480, "a half card"],
  [760, "a full band"],
];

const columns = WIDTHS.map(
  ([w, note]) => `
  <section class="col" style="width:${w}px">
    <div class="w">${w}px wide &middot; ${note}</div>
    <div class="lab">After, normalised</div>
    <div class="card">${bar(true)}</div>
    <div class="lab">Before, literal percentages</div>
    <div class="card">${bar(false)}</div>
  </section>`,
).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>Where each $100 of sales goes, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .cols{display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start;margin-top:34px}
  .col{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:12px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid #e7e5e3;border-radius:8px;padding:14px;margin-bottom:26px}
  .track{display:flex;height:32px;overflow:hidden;border-radius:8px;border:1px solid #d9d9d7}
  .legend{margin-top:8px;display:flex;flex-wrap:wrap;gap:4px 16px}
  .lg{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#57575b}
  .lg i{width:10px;height:10px;border-radius:2px;display:inline-block}
  .lg b{font-weight:500;color:#1b1b1a;font-variant-numeric:tabular-nums}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>Where each $100 of sales goes, before and after</h1>
<p>The same five slices, drawn twice, at three widths. They round to
<b>99</b>, not 100, which happens in about one split in five.</p>
<p><b>Look at the right-hand end of the lower bar in each pair.</b> It stops
short of its own track and leaves a pale notch, immediately after the terracotta
slice. On a section whose entire claim is that these five parts ARE the hundred
dollars, that gap reads as a sixth cost nobody named. The upper bar fills the
track. No printed figure changed: the legend still carries the real numbers.</p>
<div class="cols">${columns}
</div>
<footer>Sample split, shaped like a real one. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  segments sum to ${SUM}, so the old bar filled ${SUM}% of its track`);
console.log(`  wrote ${OUT}`);
