/**
 * proof_cost_to_open , the before and after sheet for "what it costs to open one".
 *
 * The BEFORE half reproduces the live page's real conditions exactly: terracotta
 * IS declared at the document root by the page shell, and the two neutral greys
 * are NOT, because they live only inside the v2 stylesheet's scope and this page
 * never enters it. So the largest bar paints and everything else is transparent.
 *
 * This is not a mock of the bug. The before card asks for the same undefined
 * properties the shipped component asked for, so the browser produces the same
 * nothing.
 *
 *   node scripts/proof_cost_to_open.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/cost-to-open/cost-to-open-before-after.html";

/* Three setup lines shaped like a real fit-out-dominated stack. */
const ITEMS = [
  { name: "Fit-out", usd: 164000 },
  { name: "Equipment", usd: 42000 },
  { name: "Deposit and fees", usd: 18000 },
];
const money = (n) => (n >= 1000000 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1000)}K`);
const maxItem = Math.max(...ITEMS.map((i) => i.usd));

const rows = (broken) =>
  ITEMS.map((it, i) => {
    const p = Math.max(3, (it.usd / maxItem) * 100);
    const track = broken ? "var(--n5)" : "var(--track)";
    const fill = i === 0 ? "var(--terra)" : broken ? "var(--n3)" : "var(--chart-4)";
    return `
    <div class="row">
      <span class="lab">${it.name}</span>
      <span class="barwrap">
        <span class="track" style="background:${track}"></span>
        <span class="fill" style="width:${p.toFixed(1)}%;background:${fill}"></span>
      </span>
      <span class="fig">${money(it.usd)}</span>
    </div>`;
  }).join("");

const card = (broken) => `
  <div class="card">
    <div class="head">
      <span class="kicker">What it costs to open one</span>
    </div>
    <div class="figs">
      <div><b>$224K</b><span>to open the doors</span></div>
      <div><b class="terra">4.5 years</b><span>to earn it back</span></div>
    </div>
    ${rows(broken)}
  </div>`;

const WIDTHS = [
  [320, "a phone"],
  [480, "a half card"],
  [760, "a full band"],
];

const columns = WIDTHS.map(
  ([w, note]) => `
  <section class="col" style="width:${w}px">
    <div class="w">${w}px &middot; ${note}</div>
    <div class="lab2">After</div>
    ${card(false)}
    <div class="lab2">Before, as it ships today</div>
    ${card(true)}
  </section>`,
).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>What it costs to open one, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  /* EXACTLY what the live page declares at its root, and nothing more. The two
     greys the shipped bars asked for are deliberately absent, because they are
     absent there. */
  :root{ --terra:#fb8469; --terra-text:#c2410c; --chart-4:#9a9a9e; --track:#e6e6e6;
         --c-ink:#1b1b1a; --c-ink2:#565654; --c-muted:#6f6f6d; --c-border:#e7e2df; }
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:var(--c-ink);
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .cols{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;margin-top:30px}
  .col{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab2{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid var(--c-border);border-radius:14px;padding:16px;margin-bottom:24px}
  .kicker{font-size:12px;font-weight:500;color:var(--c-ink)}
  .figs{display:flex;flex-wrap:wrap;gap:4px 24px;align-items:flex-end;margin:10px 0 14px}
  .figs b{display:block;font-size:22px;font-weight:400;font-variant-numeric:tabular-nums}
  .figs .terra{color:var(--terra-text)}
  .figs span{display:block;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--c-muted)}
  .row{display:grid;grid-template-columns:110px 1fr 52px;gap:12px;align-items:center;margin:8px 0}
  .lab{font-size:12px;color:var(--c-ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .barwrap{position:relative;display:block;height:16px}
  .track{position:absolute;top:0;bottom:0;width:100%;border-radius:2px}
  .fill{position:absolute;top:0;bottom:0;left:0;border-radius:2px}
  .fig{text-align:right;font-size:12.5px;font-variant-numeric:tabular-nums}
  footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>What it costs to open one, before and after</h1>
<p>Three setup lines, drawn twice, at three widths. Same numbers, same words.</p>
<p><b>The lower card in each pair is what ships today.</b> The grey track and the
two smaller bars are missing entirely. They ask for two colours that are declared
only inside a stylesheet scope this page never enters, and a colour that does not
exist paints nothing at all. Only the largest bar survives, because its
terracotta is declared a second time at the page root. The drawing exists to show
that the fit-out dwarfs everything under it, and there was nothing left to
dwarf.</p>
<div class="cols">${columns}
</div>
<footer>Sample numbers, shaped like a real fit-out. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
