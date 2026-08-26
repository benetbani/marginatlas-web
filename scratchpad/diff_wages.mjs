import { readFileSync } from "node:fs";

const b = readFileSync("scratchpad/wages-before.html", "utf8");
const a = readFileSync("scratchpad/wages-after.html", "utf8");

const txt = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .split("")
    .map((t) => t.replace(/&[a-z]+;/g, " ").trim())
    .filter(Boolean);

const tb = txt(b);
const ta = txt(a);
console.log(`  text nodes  before ${tb.length}   after ${ta.length}`);
console.log(`  identical text: ${JSON.stringify(tb) === JSON.stringify(ta) ? "YES" : "NO"}`);

const money = tb.filter((t) => /^\$\d+K$/.test(t));
const uniq = [...new Set(money)];
console.log(`\n  money figures printed on the card: ${money.length}`);
console.log(`    ${money.join("  ")}`);
console.log(`  distinct figures: ${uniq.length}, so ${money.length - uniq.length} are repeats`);

/* Are the low and the high recoverable by a sighted reader? They are written
   into the description a screen reader hears. Count how many distinct figures
   live only there. */
const labels = [...b.matchAll(/aria-label="([^"]+)"/g)].map((m) => m[1]);
const inLabels = new Set();
for (const l of labels) for (const m of l.matchAll(/\$\d+K/g)) inLabels.add(m[0]);
const onScreen = new Set(money);
const hidden = [...inLabels].filter((f) => !onScreen.has(f));
console.log(`\n  figures in the spoken description: ${inLabels.size}`);
console.log(`  of those, NEVER printed on screen: ${hidden.length}`);
console.log(`    ${hidden.join("  ")}`);
