/* throwaway: what D3 reads today, and what it would read if lone-survivor bands
   were counted. Measured from the RENDERED grid-template-columns at a given
   width rather than from the class string, because a lone survivor's shape comes
   from a :has() variant that the class string cannot be read for.
   node scratchpad/loop17_d3.mjs [width] */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";

const width = Number(process.argv[2] ?? 1440);
const dir = "E:/atlas/website/docs/loop/artifacts/final-pages";
const slugs = readdirSync(dir).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""));

const b = await chromium.launch();
for (const slug of slugs) {
  const p = await b.newPage({ viewport: { width, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(`${dir}/${slug}.html`).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  const rows = await p.evaluate(() => {
    const out = [];
    const TABLE = { "1-1": 1, "1-2": 0.5, "2-1": 2, "2-3": 2 / 3, "3-2": 1.5 };
    for (const el of document.querySelectorAll("div.grid")) {
      const cls = String(el.className);
      if (!/^mt-8 grid grid-cols-1 items-start gap-8/.test(cls)) continue;
      const ws = getComputedStyle(el).gridTemplateColumns.split(" ").map(parseFloat).filter((v) => !Number.isNaN(v));
      let ratio = "one-col";
      if (ws.length === 2) {
        const r = ws[0] / ws[1];
        let best = "", bd = 1e9;
        for (const [k, v] of Object.entries(TABLE)) { const d = Math.abs(r - v); if (d < bd) { bd = d; best = k; } }
        ratio = best;
      }
      // what the gate reads today, from the class string
      const m = cls.match(/(?:^|\s)lg:grid-cols-(2|\[[^\]]+\])/) || cls.match(/(?:^|\s)md:grid-cols-(2|\[[^\]]+\])/);
      out.push({
        kids: el.childElementCount,
        rendered: ratio,
        declared: m ? m[1] : "?",
        widths: ws.map((v) => Math.round(v)).join("/"),
        first: (el.firstElementChild?.id) || (el.firstElementChild?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28),
      });
    }
    return out;
  });
  await p.close();
  if (!rows.length) { console.log(`\n${slug}: no bands`); continue; }
  console.log(`\n${slug}  @${width}`);
  for (const r of rows) console.log(`   kids=${r.kids}  rendered=${r.rendered.padEnd(7)} widths=${r.widths.padEnd(11)} declaredClass=${r.declared.padEnd(12)} ${r.first}`);
  const today = rows.filter((r) => r.kids >= 2).map((r) => r.declared);
  const all = rows.map((r) => r.rendered);
  const check = (seq, name) => {
    const f = [];
    for (let i = 1; i < seq.length; i++) if (seq[i] === seq[i - 1]) f.push(`bands ${i} and ${i + 1} both ${seq[i]}`);
    for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 1] && seq[i - 1] === seq[i - 2]) f.push(`bands ${i - 1}..${i + 1} three alike`);
    console.log(`   ${name}: [${seq.join(", ")}]  ${f.length ? "FINDINGS: " + f.join("; ") : "clean"}`);
  };
  check(today, "gate today (>=2 kids, class)");
  check(all, "every band (rendered)  ");
}
await b.close();
