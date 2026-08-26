import { RETIRED } from "../src/lib/taxonomy/retired";

/* TAXONOMY_REDIRECTS lives inside middleware.ts and is not exported, so read it
   out of the source rather than importing the module (importing middleware
   pulls in next/server). */
import { readFileSync } from "node:fs";
const src = readFileSync("src/middleware.ts", "utf8");
const block = /const TAXONOMY_REDIRECTS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(src);
if (!block) {
  console.log("could not locate TAXONOMY_REDIRECTS in middleware source");
  process.exit(1);
}
const pairs = [...block[1].matchAll(/"([a-z0-9-]+)"\s*:\s*"([a-z0-9-]+)"/g)].map((m) => [m[1], m[2]]);
console.log(`TAXONOMY_REDIRECTS holds ${pairs.length} pairs`);

const retired = new Set(Object.keys(RETIRED));

const keyCollisions = pairs.filter(([from]) => retired.has(from));
const valueCollisions = pairs.filter(([, to]) => retired.has(to));

console.log(`\nRETIRED slug that is also a REDIRECT SOURCE (my block never fires): ${keyCollisions.length}`);
keyCollisions.forEach(([f, t]) => console.log(`   ${f} -> ${t}`));

console.log(`\nAn old URL pointing AT a retired slug (chain or 404): ${valueCollisions.length}`);
valueCollisions.forEach(([f, t]) => console.log(`   ${f} -> ${t}   [${t} is retired]`));
