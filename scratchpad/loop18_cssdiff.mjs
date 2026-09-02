/* throwaway: the CSS RULE SET difference between two renders of one page, which
   is the test runs 14 to 17 established for "did the regenerated stylesheet add
   junk". Split both files' inlined <style> on "}" and compare the sets.
   node scratchpad/loop18_cssdiff.mjs <before.html> <after.html> */
import { readFileSync } from "node:fs";
const rules = (f) => {
  const s = readFileSync(f, "utf8");
  const m = s.match(/<style>([\s\S]*?)<\/style>/g) || [];
  return new Set(m.join("").split("}").map((r) => r.trim()).filter(Boolean));
};
const [a, b] = [rules(process.argv[2]), rules(process.argv[3])];
const added = [...b].filter((r) => !a.has(r));
const dropped = [...a].filter((r) => !b.has(r));
console.log(`rules before ${a.size}, after ${b.size}, added ${added.length}, dropped ${dropped.length}`);
added.forEach((r) => console.log("  + " + r.slice(0, 150)));
dropped.forEach((r) => console.log("  - " + r.slice(0, 150)));
