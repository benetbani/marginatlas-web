/**
 * Raise every type size below the ladder floor, in READER-FACING code only.
 *
 * Founder ruling 2026-08-21: "eleven for anything you read, ten for marks."
 * So 8px, 9px and 9.5px rise to the mark step, and 10.5px rises to the read
 * floor, because a 10.5px key/value label is read rather than glanced at.
 *
 * /dev is skipped on purpose: the workshop has no URL and no reader.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, sep } from "node:path";

const SUBS = [
  [/text-\[8px\]/g, "text-[10px]"],
  [/text-\[9px\]/g, "text-[10px]"],
  [/text-\[9\.5px\]/g, "text-[10px]"],
  [/text-\[10\.5px\]/g, "text-[11px]"],
  [/font-size:\s*8px/g, "font-size:10px"],
  [/font-size:\s*9px/g, "font-size:10px"],
  [/font-size:\s*9\.5px/g, "font-size:10px"],
  [/font-size:\s*10\.5px/g, "font-size:11px"],
];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      if (e === "dev") continue; // the workshop, no URL, no reader
      walk(p);
      continue;
    }
    if ([".ts", ".tsx", ".css"].includes(extname(p))) files.push(p);
  }
})("src");

let touched = 0;
let replaced = 0;
for (const p of files) {
  const before = readFileSync(p, "utf8");
  let after = before;
  let n = 0;
  for (const [rx, rep] of SUBS) {
    const hits = after.match(rx);
    if (hits) n += hits.length;
    after = after.replace(rx, rep);
  }
  if (after !== before) {
    writeFileSync(p, after);
    touched++;
    replaced += n;
    console.log(`  ${String(n).padStart(3)}  ${p.split(sep).join("/")}`);
  }
}
console.log(`\n  ${replaced} declarations raised across ${touched} reader-facing files`);
