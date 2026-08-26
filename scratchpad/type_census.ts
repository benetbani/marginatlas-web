/**
 * Counts every type SIZE this site declares, from source, with comments
 * stripped so a size named in prose is not counted as a use.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { stripCommentLines } from "../scripts/lib/strip_comments";

const TW = new Map<string, number>([
  ["text-xs", 12], ["text-sm", 14], ["text-base", 16], ["text-lg", 18],
  ["text-xl", 20], ["text-2xl", 24], ["text-3xl", 30], ["text-4xl", 36],
  ["text-5xl", 48], ["text-6xl", 60], ["text-7xl", 72], ["text-8xl", 96],
  ["text-9xl", 128],
]);

const counts = new Map<number, number>();
const where = new Map<number, Set<string>>();

function bump(px: number, file: string) {
  counts.set(px, (counts.get(px) ?? 0) + 1);
  if (!where.has(px)) where.set(px, new Set());
  const s = where.get(px)!;
  if (s.size < 4) s.add(file);
}

function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (![".ts", ".tsx", ".css"].includes(extname(p))) continue;
    const lines = stripCommentLines(readFileSync(p, "utf8").split("\n"));
    for (const line of lines) {
      for (const m of line.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) bump(parseFloat(m[1]), p);
      for (const m of line.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) bump(parseFloat(m[1]), p);
      for (const [cls, px] of TW) {
        const re = new RegExp(`(?:^|[\\s"'\`:])${cls}(?![\\w-])`, "g");
        for (const _ of line.matchAll(re)) bump(px, p);
      }
    }
  }
}

walk("src");

const sizes = [...counts.keys()].sort((a, b) => a - b);
console.log(`DISTINCT SIZES DECLARED: ${sizes.length}\n`);
let total = 0;
for (const s of sizes) {
  const n = counts.get(s)!;
  total += n;
  console.log(`  ${String(s).padStart(6)}px  ${String(n).padStart(4)}  ${[...where.get(s)!].slice(0, 2).join("  ")}`);
}
console.log(`\n  total declarations: ${total}`);
console.log(`  smallest ${sizes[0]}px, largest ${sizes[sizes.length - 1]}px, ratio ${(sizes[sizes.length - 1] / sizes[0]).toFixed(2)}x`);
