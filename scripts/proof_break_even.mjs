/**
 * proof_break_even , the before and after sheet for "when it clears costs".
 *
 * Renders the exact markup of the headroom track, at three widths, in the two
 * cases that matter:
 *
 *   HEALTHY   break-even below a typical day. Both versions agree, and should.
 *   UNDERWATER break-even ABOVE a typical day. The old version drew the
 *             typical-day tick to the RIGHT of the break-even dot, which reads
 *             as a comfortable cushion, on exactly the trades that have none.
 *
 * The two figure tiles are drawn too, because they are the tell: they already
 * said zero headroom while the picture above them said otherwise.
 *
 *   node scripts/proof_break_even.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/break-even/break-even-before-after.html";
const TERRA = "#fb8469";
const TRACK = "#e6e6e6";
const INK = "#1b1b1a";

const CASES = [
  { name: "Healthy: break-even below a typical day", covers: 38, typical: 62 },
  { name: "Underwater: break-even ABOVE a typical day", covers: 71, typical: 54 },
];

/* OLD: domain is the larger of the two, the dot is clamped into 4..96, and the
   typical-day tick is pinned to the right edge whatever the numbers say. */
const oldGeom = (covers, typical) => {
  const domain = Math.max(typical, covers, 1);
  return { be: Math.max(4, Math.min(96, (covers / domain) * 100)), typ: 100, pinned: true };
};
/* NEW: both markers positioned from the same domain, no clamp. */
const newGeom = (covers, typical) => {
  const domain = Math.max(typical, covers, 1);
  return { be: (covers / domain) * 100, typ: (typical / domain) * 100, pinned: false };
};

const track = (g) => `
  <div class="chips">
    <span class="chip"><i class="dot"></i><b>${"{be}"}</b> to break even</span>
    <span class="chip"><b>${"{typ}"}</b> a typical day<i class="tick"></i></span>
  </div>
  <div class="rail">
    <span class="tickmark" style="left:${g.typ.toFixed(2)}%"></span>
    <span class="bedot" style="left:${g.be.toFixed(2)}%"></span>
  </div>`;

const tiles = (covers, typical) => `
  <div class="tiles">
    <div><b>${Math.max(0, Math.round(typical - covers))}</b><span>covers of headroom</span></div>
    <div><b>${Math.round((covers / Math.max(typical, 1)) * 100)}%</b><span>of a typical day</span></div>
  </div>`;

const block = (c, geom) =>
  track(geom(c.covers, c.typical))
    .replace("{be}", String(Math.round(c.covers)))
    .replace("{typ}", String(Math.round(c.typical))) + tiles(c.covers, c.typical);

const WIDTHS = [
  [320, "a phone"],
  [480, "a half card"],
  [760, "a full band"],
];

const body = CASES.map(
  (c) => `
  <h2>${c.name}</h2>
  <p class="sub">Break-even <b>${c.covers}</b> covers a day. A typical day <b>${c.typical}</b>.</p>
  <div class="cols">
    ${WIDTHS.map(
      ([w, note]) => `
    <section class="col" style="width:${w}px">
      <div class="w">${w}px &middot; ${note}</div>
      <div class="lab">After</div>
      <div class="card">${block(c, newGeom)}</div>
      <div class="lab">Before</div>
      <div class="card">${block(c, oldGeom)}</div>
    </section>`,
    ).join("")}
  </div>`,
).join("\n");

const html = `<!doctype html>
<meta charset="utf-8">
<title>When it clears costs, before and after</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:36px 28px 60px;background:#fafaf9;color:${INK};
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:0 0 12px}
  h2{font-size:15px;font-weight:500;margin:36px 0 2px}
  p{max-width:68ch;color:#57575b;margin:0 0 8px}
  .sub{font-size:13px;margin:0 0 4px}
  b{font-weight:500;font-variant-numeric:tabular-nums}
  .cols{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;margin-top:16px}
  .col{max-width:100%}
  .w{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c8c8a;margin-bottom:10px}
  .lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:0 0 6px}
  .card{background:#fff;border:1px solid #e7e5e3;border-radius:8px;padding:14px;margin-bottom:22px}
  .chips{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;color:#6f6f6d;margin-bottom:8px}
  .chip{display:inline-flex;align-items:center;gap:6px}
  .chip .dot{width:8px;height:8px;border-radius:50%;background:${TERRA};display:inline-block}
  .chip .tick{width:2px;height:10px;border-radius:2px;background:${INK};display:inline-block}
  .rail{position:relative;height:6px;border-radius:999px;background:${TRACK};margin:0 0 16px}
  .tickmark{position:absolute;top:50%;width:2px;height:12px;transform:translate(-50%,-50%);
            border-radius:999px;background:${INK}}
  .bedot{position:absolute;top:50%;width:14px;height:14px;transform:translate(-50%,-50%);
         border-radius:50%;background:${TERRA};border:2px solid #fff;box-shadow:0 0 0 1px #e3e3e3}
  .tiles{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#e7e2df;border:1px solid #e7e2df;border-radius:12px;overflow:hidden}
  .tiles > div{background:#fff;padding:10px 14px}
  .tiles b{display:block;font-size:18px}
  .tiles span{display:block;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#6f6f6d}
  footer{margin-top:40px;font-size:12px;color:#8c8c8a;max-width:68ch}
</style>
<h1>When it clears costs, before and after</h1>
<p>The orange dot is break-even. The black tick is a typical day. The gap between
them is the room the owner still has.</p>
<p><b>The second case is the one to read.</b> Break-even is ABOVE a typical day:
this trade does not clear its costs on an ordinary day. In the lower "before"
version the black typical-day tick still sits at the far right, to the RIGHT of
the orange dot, drawing a comfortable cushion that does not exist. The two tiles
underneath already said zero headroom. The picture disagreed with them, and the
picture is the half a reader believes.</p>
${body}
<footer>Sample numbers, shaped like real ones. Nothing on this sheet is published anywhere.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
for (const c of CASES) {
  const o = oldGeom(c.covers, c.typical), n = newGeom(c.covers, c.typical);
  console.log(
    `  ${c.name.split(":")[0].padEnd(11)} break-even ${String(c.covers).padStart(3)}  typical ${String(c.typical).padStart(3)}` +
      `   BEFORE dot ${o.be.toFixed(1)}% tick ${o.typ.toFixed(1)}%` +
      `   AFTER dot ${n.be.toFixed(1)}% tick ${n.typ.toFixed(1)}%`,
  );
}
console.log(`\n  wrote ${OUT}`);
