/* throwaway (C29): the TEXT difference between two renders of one page, ignoring
   markup, so a formatter change can be read as the figures it moved rather than
   as a byte diff. Both sides are split on tags and compared as token lists.
   node scratchpad/loop18_moneydiff.mjs <before.html> <after.html> */
import { readFileSync } from "node:fs";
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
const texts = (f) =>
  strip(readFileSync(f, "utf8"))
    .split(/<[^>]*>/)
    .map((t) => t.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
const [a, b] = [texts(process.argv[2]), texts(process.argv[3])];
// longest-common-subsequence walk, small enough for these pages
const n = a.length, m = b.length;
const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
let i = 0, j = 0, out = [];
while (i < n && j < m) {
  if (a[i] === b[j]) { i++; j++; continue; }
  if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(["-", a[i], a.slice(Math.max(0, i - 3), i).join(" | ")]); i++; }
  else { out.push(["+", b[j], b.slice(Math.max(0, j - 3), j).join(" | ")]); j++; }
}
while (i < n) out.push(["-", a[i], a.slice(Math.max(0, i - 3), i++).join(" | ")]);
while (j < m) out.push(["+", b[j], b.slice(Math.max(0, j - 3), j++).join(" | ")]);
console.log(`${out.length} text differences`);
for (const [sign, t, ctx] of out) console.log(`${sign} ${JSON.stringify(t)}     <= after: ${ctx.slice(-80)}`);
