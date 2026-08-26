/**
 * Find every chart that plots twelve months and report what its vertical scale
 * actually starts from.
 *
 * The readiness ledger claims five month-of-year charts "disagree about where
 * zero is". One of its neighbouring claims about tables was measured wrong
 * today, so this checks rather than repeats.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if ([".tsx", ".ts"].includes(extname(p))) files.push(p);
  }
})("src");

const MONTHS = /Jan[^A-Za-z]{0,4}Feb|"Jan"[\s,]|'Jan'[\s,]|months?\s*[:=]/i;

const hits = [];
for (const p of files) {
  const rel = relative(process.cwd(), p).split(sep).join("/");
  const src = readFileSync(p, "utf8");
  /* Twelve month labels in a row is the signature. */
  const hasTwelve =
    /Jan[\s\S]{0,120}Feb[\s\S]{0,120}Mar[\s\S]{0,400}Dec/.test(src) ||
    /\bJ\W+F\W+M\W+A\W+M\W+J\W+J\W+A\W+S\W+O\W+N\W+D\b/.test(src);
  if (!hasTwelve) continue;
  if (!/<svg|<rect|polyline|<path|height:/.test(src)) continue;

  /* Does anything set a floor that is not zero? */
  const nonZeroFloor = [
    ...src.matchAll(/const\s+(lo|min|floor|yMin|d0)\s*=\s*([^;\n]+)/g),
  ].map((m) => `${m[1]} = ${m[2].trim().slice(0, 60)}`);

  const claimsZero = /zero[- ]baseline|ZERO baseline|from a zero/i.test(src);

  hits.push({ rel, nonZeroFloor, claimsZero, workshop: rel.startsWith("src/app/dev/") });
}

console.log(`  ${hits.length} file(s) plot twelve months\n`);
for (const h of hits) {
  const tag = h.workshop ? "[workshop]" : "[reader]  ";
  console.log(`  ${tag} ${h.rel}`);
  console.log(`      claims zero baseline: ${h.claimsZero}`);
  if (h.nonZeroFloor.length) {
    h.nonZeroFloor.slice(0, 3).forEach((f) => console.log(`      floor expr: ${f}`));
  } else {
    console.log(`      floor expr: none found (likely fixed at 0)`);
  }
}
