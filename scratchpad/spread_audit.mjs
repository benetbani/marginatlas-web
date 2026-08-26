/**
 * Measure the real p10..p90 spread, so the axis choice is a measurement rather
 * than a preference.
 *
 * The question a log axis answers: does the spread run over ORDERS OF
 * MAGNITUDE? If p90/p10 is around 3x, a log axis flatters a narrow spread and
 * makes a modest difference look dramatic. If it is 10x or more, a linear axis
 * crushes the bottom half into the left edge and the typical value lands
 * nowhere useful.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const found = [];

function scan(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) { scan(p); continue; }
    if (extname(p) !== ".json") continue;
    let raw;
    try { raw = readFileSync(p, "utf8"); } catch { continue; }
    if (!/p10|p_10/.test(raw)) continue;

    let j;
    try { j = JSON.parse(raw); } catch { continue; }

    /* Walk for any object carrying both a p10 and a p90, at any depth. */
    const walk = (o, path) => {
      if (!o || typeof o !== "object") return;
      const keys = Object.keys(o);
      const p10k = keys.find((k) => /^(rev_)?p10$/.test(k));
      const p90k = keys.find((k) => /^(rev_)?p90$/.test(k));
      const p50k = keys.find((k) => /^(rev_)?p50$/.test(k));
      if (p10k && p90k && typeof o[p10k] === "number" && typeof o[p90k] === "number" && o[p10k] > 0) {
        found.push({
          file: p.replace(/\\/g, "/"),
          path,
          p10: o[p10k],
          p50: typeof o[p50k] === "number" ? o[p50k] : null,
          p90: o[p90k],
          ratio: o[p90k] / o[p10k],
        });
      }
      for (const k of keys) walk(o[k], path ? `${path}.${k}` : k);
    };
    walk(j, "");
  }
}

scan("src/lib");
scan("data");

if (!found.length) {
  console.log("  no p10/p90 pair found in any JSON under src/lib or data");
  process.exit(0);
}

const ratios = found.map((f) => f.ratio).sort((a, b) => a - b);
const pct = (q) => ratios[Math.floor((ratios.length - 1) * q)];

console.log(`  ${found.length} spread(s) found\n`);
console.log(`  p90/p10 ratio:`);
console.log(`    min     ${ratios[0].toFixed(2)}x`);
console.log(`    p25     ${pct(0.25).toFixed(2)}x`);
console.log(`    median  ${pct(0.5).toFixed(2)}x`);
console.log(`    p75     ${pct(0.75).toFixed(2)}x`);
console.log(`    max     ${ratios[ratios.length - 1].toFixed(2)}x`);

const over10 = ratios.filter((r) => r >= 10).length;
const under4 = ratios.filter((r) => r < 4).length;
console.log(`\n    ${over10} of ${ratios.length} span 10x or more`);
console.log(`    ${under4} of ${ratios.length} span less than 4x`);

console.log(`\n  sample:`);
for (const f of found.slice(0, 6)) {
  console.log(
    `    ${f.ratio.toFixed(1).padStart(6)}x  p10 ${String(f.p10).padStart(9)}  ` +
      `p50 ${String(f.p50 ?? "-").padStart(9)}  p90 ${String(f.p90).padStart(10)}  ${f.file.split("/").pop()}`,
  );
}
