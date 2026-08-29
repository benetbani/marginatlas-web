#!/usr/bin/env node
/**
 * verify_no_quartile_words , NOTATION N9's checkable half.
 *
 * Founder, 2026-08-30, verbatim: "we should seek to find the average, the top
 * ten percent and the bottom ten percent. Instead you are just saying the
 * lower quarter or the upper quarter... that's not very helpful." N9's law:
 * a spread renders as deciles or the typical figure stands alone; quartile
 * WORDS never reach a reader again. The words are strings and strings are
 * checkable, so this gate exists the same day the rule did (working method
 * rule 4).
 *
 * SCOPE, said loudly: the rebuilt spine (src/components/spine, src/lib/spine),
 * where the ruling landed and which is decile-clean today. The legacy site
 * carries 42 quartile strings across monetization, pricing, dev catalogues
 * and learn articles (measured before this scope was set); marching through
 * them file-by-file is the forbidden method (rulebook 43), so they take N9
 * as their pages are rebuilt, and until then they are NOT CHECKED here
 * rather than silently passed. Comments are stripped first with the shared
 * lib: the ban is on what a READER sees, and the code may say "quartile"
 * while explaining why the reader never does.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("tsx/cjs");
const { stripComments, newCommentState } = require("./lib/strip_comments.ts");

const BANNED = /lower quarter|upper quarter|quartile/i;

const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(e)) files.push(p);
  }
}
walk("src/components/spine");
walk("src/lib/spine");

const hits = [];
for (const f of files) {
  const state = newCommentState();
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const code = stripComments(line, state);
    if (BANNED.test(code)) hits.push(`${f}:${i + 1}  ${code.trim().slice(0, 90)}`);
  });
}

if (hits.length) {
  console.log("x verify_no_quartile_words: quartile words in user-visible source (N9 bans them).");
  hits.forEach((h) => console.log("     " + h));
  console.log("  A spread is deciles or the typical alone; quartiles never render again.");
  process.exit(1);
}
console.log("  NOT CHECKED here, loudly: the legacy site (42 known quartile strings); N9 binds each page as it is rebuilt.");
console.log(`PASS verify_no_quartile_words. ${files.length} spine source files carry no quartile wording.`);
