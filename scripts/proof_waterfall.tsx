/**
 * proof_waterfall , the standalone proof sheet for the money waterfall.
 *
 * WHY THIS EXISTS INSTEAD OF A SCREENSHOT. The chart is a client component:
 * recharts measures the DOM, so it draws nothing in the static render harness,
 * and the live harness needs a dev server. On this machine the dev server
 * panicked repeatedly with 450MB of free memory, so there was no browser to
 * photograph it in. This renders the SAME chart element with an explicit width
 * and height, which is exactly what the responsive wrapper would have handed it
 * once measured, and writes the result to one self-contained HTML file.
 *
 * WHAT IT PROVES: the row maths, the stacking, the scales, the axis labels, the
 * value labels, the zero baseline and the connector geometry. All the parts that
 * could be wrong.
 * WHAT IT DOES NOT PROVE: that the responsive wrapper reports a sensible width
 * in a real browser. That wrapper is already shipped and already exercised by
 * the bar chart, so it is not the risk here.
 *
 *   npx tsx scripts/proof_waterfall.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { buildWaterfallRows, waterfallChart } from "../src/components/kit/charts/AtlasWaterfall";

/* One split, used in every column. A neighbourhood restaurant's hundred dollars
   of sales, shaped the way the cell page already shapes it. SAMPLE numbers for
   a design comparison, not a published figure. */
const COSTS = [
  { name: "Food + drink", pct: 31 },
  { name: "Wages", pct: 30 },
  { name: "Rent", pct: 9 },
  { name: "Other", pct: 22 },
];
const KEEP = 8;

const OUT = "docs/loop/artifacts/waterfall/waterfall-before-after.html";

/* ==========================================================================
   THE BEFORE, copied verbatim from money-chapter.tsx as it stands today.
   It is copied rather than imported because that module pulls in the whole
   spine kit and a React context, neither of which exists outside a page. The
   copy is byte-faithful to the shipped drawing code, raw hex values and all,
   which are themselves one of the reasons it is being replaced.
   ====================================================================== */
const SHORT: Record<string, string> = { "Food + drink": "Food", "Other": "Other" };
function SteppedWaterfallCopy({ costs, keep }: { costs: Array<{ name: string; pct: number }>; keep: number }) {
  const cols = costs.length + 2;
  const W = 480, H = 168, padL = 8, padR = 8, chartTop = 18, axisY = 128;
  const slot = (W - padL - padR) / cols;
  const bw = slot * 0.6;
  const bx = (i: number) => padL + i * slot + (slot - bw) / 2;
  const Y = (v: number) => chartTop + (1 - v / 100) * (axisY - chartTop);
  let level = 100;
  const steps = costs.map((c) => { const from = level; level -= c.pct; return { ...c, from, to: level }; });
  const grotesk = { fontFamily: "var(--font-grotesk)", fontWeight: 600 } as const;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }} role="img" aria-label="before">
      <rect x={bx(0)} y={Y(100)} width={bw} height={Y(0) - Y(100)} rx={2} fill="#e7e5e3" />
      <text x={bx(0) + bw / 2} y={Y(100) - 6} textAnchor="middle" fontSize={10.5} fill="#1b1b1a" style={grotesk}>$100</text>
      <text x={bx(0) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">Sales</text>
      {steps.map((s, i) => (
        <g key={s.name}>
          <line x1={bx(i) + bw} y1={Y(s.from)} x2={bx(i + 1) + bw} y2={Y(s.from)} stroke="#d8d4d1" strokeWidth={1} strokeDasharray="2 2" />
          <rect x={bx(i + 1)} y={Y(s.from)} width={bw} height={Math.max(1, Y(s.to) - Y(s.from))} rx={2} fill="#c1c1bf" />
          <text x={bx(i + 1) + bw / 2} y={Y(s.from) - 6} textAnchor="middle" fontSize={10} fill="#1b1b1a" style={grotesk}>-{s.pct}</text>
          <text x={bx(i + 1) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">{SHORT[s.name] ?? s.name}</text>
        </g>
      ))}
      <line x1={bx(steps.length) + bw} y1={Y(keep)} x2={bx(steps.length + 1) + bw} y2={Y(keep)} stroke="#d8d4d1" strokeWidth={1} strokeDasharray="2 2" />
      <rect x={bx(steps.length + 1)} y={Y(keep)} width={bw} height={Math.max(1.5, Y(0) - Y(keep))} rx={2} fill="#c2410c" />
      <text x={bx(steps.length + 1) + bw / 2} y={Y(keep) - 6} textAnchor="middle" fontSize={10.5} fill="#c2410c" style={grotesk}>${keep}</text>
      <text x={bx(steps.length + 1) + bw / 2} y={axisY + 13} textAnchor="middle" fontSize={9} fill="#8c8c8a">Keeps</text>
      <line x1={padL} y1={Y(0)} x2={W - padR} y2={Y(0)} stroke="#c9c9c7" strokeWidth={1} />
    </svg>
  );
}

const WIDTHS: Array<[number, string]> = [
  [320, "a phone"],
  [480, "a half card"],
  [760, "a full band"],
];

function main() {
  const { rows, closes } = buildWaterfallRows({
    start: { label: "Sales", value: 100 },
    steps: COSTS.map((c) => ({ label: c.name, value: c.pct })),
    end: { label: "Keeps", value: KEEP },
    prefix: "$",
  });

  if (!closes) {
    console.error("  the identity does not close. Nothing drawn, which is the correct behaviour.");
    process.exit(1);
  }
  console.log(`  rows: ${rows.length}  (1 opening + ${COSTS.length} deductions + 1 kept)`);
  for (const r of rows) {
    console.log(`    ${r.label.padEnd(14)} base=${String(r.base).padStart(3)}  delta=${String(r.delta).padStart(3)}  top=${r.base + r.delta}  close=${r.close}`);
  }

  const columns = WIDTHS.map(([w, note]) => {
    const el = waterfallChart({ rows, max: 100, reading: "money waterfall" });
    const after = renderToStaticMarkup(
      React.cloneElement(el as React.ReactElement<any>, { width: w, height: 190 }),
    );
    const before = renderToStaticMarkup(<SteppedWaterfallCopy costs={COSTS} keep={KEEP} />);

    /* A connector is a dashed line drawn by the Customized escape hatch. If the
       library changed shape under us these vanish silently, so they are counted
       and printed rather than eyeballed. */
    const connectors = (after.match(/stroke-dasharray="2 2"/g) || []).length;
    console.log(`  ${String(w).padStart(4)}px  connectors drawn: ${connectors} (expected ${rows.length - 1})`);

    return `
    <section class="col" style="width:${w}px">
      <div class="w">${w}px wide &middot; ${note}</div>
      <div class="lab">After, on the chart library</div>
      <div class="card">${after}</div>
      <div class="lab">Before, hand cut</div>
      <div class="card">${before}</div>
    </section>`;
  }).join("\n");

  const html = `<!doctype html>
<meta charset="utf-8">
<title>The money waterfall, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --chart-1:#e62200; --chart-2:#57575b; --chart-3:#6f6f74; --chart-4:#9a9a9e; --chart-5:#c0c0c4;
    --font-grotesk:"Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter, ui-sans-serif, system-ui, sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .cols{display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start;margin-top:34px}
  .col{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:12px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid #e7e5e3;border-radius:8px;padding:14px;margin-bottom:26px}
  .card svg{display:block;max-width:100%}
  .tabular-nums{font-variant-numeric:tabular-nums}
  .fill-\\[var\\(--chart-2\\)\\]{fill:var(--chart-2)}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>The money waterfall, before and after</h1>
<p>The same hundred dollars of sales, drawn twice, at three widths. The upper chart
in each column is built on the chart library. The lower one is the hand cut version
it replaces.</p>
<p>Read the LABELS across the three columns. The lower chart scales its own text
along with the drawing, so the same words are tiny in a narrow column and oversized
in a wide one. The upper chart holds one size everywhere.</p>
<div class="cols">${columns}
</div>
<footer>Sample numbers, chosen to look like a real split. Nothing on this sheet is
published anywhere.</footer>
`;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, html, "utf8");
  console.log(`\n  wrote ${OUT}`);
}

main();
