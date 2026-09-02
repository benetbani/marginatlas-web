/* throwaway: did a page's MARKUP move, ignoring the regenerated stylesheet?
   The harness rebuilds site.css from source every run, so one new Tailwind class
   changes every page's inlined <style> and every page shows as modified. This
   strips the style blocks and compares what is left.
   node scratchpad/loop18_bodydiff.mjs <a.html> <b.html> */
import { readFileSync } from "node:fs";
const body = (f) => readFileSync(f, "utf8").replace(/<style>[\s\S]*?<\/style>/g, "<style/>");
const [a, b] = [body(process.argv[2]), body(process.argv[3])];
console.log(a === b ? "MARKUP IDENTICAL" : `MARKUP MOVED (${a.length} -> ${b.length} bytes)`);
