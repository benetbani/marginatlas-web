// Read-only: the provenance mix of the figures the ten harness pages print (checkup 2026-10-08).
// Same definition as scripts/harness/check_provenance.mjs: a figure is an element with the `fig` class; it "says where it came
// from" when it carries data-src and a data-kind in the four kinds. BLIND SPOT (that script's): numbers outside `.fig` elements,
// in SVG text or aria labels are not counted; a data-src is not checked for truth.
// usage (cwd = E:/atlas/website): node <this file>
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
const require = createRequire(`${process.cwd()}/package.json`);
const { JSDOM } = require("jsdom");
const KINDS = ["counted", "worked out", "looked up", "estimate"];
const pages = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages;
const tot = { figs: 0, unstamped: 0 };
for (const k of KINDS) tot[k] = 0;
for (const p of pages) {
  const f = `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`;
  if (!existsSync(f)) { console.log("MISSING", f); continue; }
  const html = readFileSync(f, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");
  const doc = new JSDOM(html).window.document;
  const figs = [...doc.querySelectorAll(".fig")];
  const row = { figs: figs.length, unstamped: 0 };
  for (const k of KINDS) row[k] = 0;
  for (const el of figs) {
    const kind = el.getAttribute("data-kind") ?? "";
    if (el.getAttribute("data-src") && KINDS.includes(kind)) row[kind]++;
    else row.unstamped++;
  }
  for (const k of Object.keys(row)) tot[k] += row[k];
  console.log(`${p.surface}-${p.slugs.join("-")}`.padEnd(34), JSON.stringify(row));
}
console.log("TOTAL".padEnd(34), JSON.stringify(tot));
const pct = (n) => ((100 * n) / tot.figs).toFixed(1) + "%";
console.log("shares:", KINDS.map((k) => `${k} ${pct(tot[k])}`).join(", "), `, unstamped ${pct(tot.unstamped)}`);
