import { readFileSync } from "node:fs";
const s = readFileSync("scratchpad/rs-after/home.html", "utf8");

/* RangeStrip draws at viewBox 0 0 760 <H>. Find that exact svg. */
const m = [...s.matchAll(/<svg[^>]*viewBox="0 0 760 \d+"[^>]*>([\s\S]*?)<\/svg>/g)];
console.log(`  strips found: ${m.length}`);
for (const [i, hit] of m.entries()) {
  const body = hit[1];
  const xs = [...body.matchAll(/\b(?:cx|x)="([\d.]+)"/g)].map((v) => Math.round(Number(v[1])));
  const uniq = [...new Set(xs)].sort((a, b) => a - b);
  console.log(`\n  strip ${i + 1}`);
  console.log(`    marks      : ${(body.match(/<(rect|circle|line|path)\b/g) || []).length}`);
  console.log(`    x values   : ${uniq.join(", ")}`);
  console.log(`    span       : ${uniq.length ? uniq[0] + " to " + uniq[uniq.length - 1] : "none"} (track runs 64 to 696)`);
}
