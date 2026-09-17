/**
 * scripts/verify_harness_preflight.ts
 *
 * THE PREFLIGHT IS CALLED FIRST BY EVERY HARNESS SCRIPT (sys:harness-preflight,
 * the build loop's run 24, 2026-09-07). Browser-free, in the chain as
 * `harness-preflight`. Walks scripts/harness/ and, for every script there
 * (.mjs, .ts, .tsx; not the preflight itself, not the environment preload),
 * demands an import of ./preflight.mjs and a preflight() call that comes
 * before the first browser launch and before the first read of the
 * arguments, so a script on the wrong ground stops before it does anything.
 * A script that launches a browser must ask the preflight for the browser
 * check. Comments are stripped before the scan, so a quoted example cannot
 * satisfy it.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";
import { red, redSummary } from "./lib/red";

const RULE = "harness-preflight";
const DIR = "scripts/harness";
const SKIP = new Set(["preflight.mjs", "env.cjs"]);
/* Each red names the script and the line of the thing that is out of order:
   the launch or the argv read that comes before the call, the call that lacks
   the browser flag, or line 1 for a missing import or call (plan-2026-09-17/
   02-ERRORS.md, step 16). */
const reds: { file: string; line: number; detail: string; remedy: string }[] = [];
let scripts = 0;

for (const name of readdirSync(DIR).sort()) {
  if (SKIP.has(name) || !/\.(mjs|ts|tsx)$/.test(name)) continue;
  scripts++;
  const file = `${DIR}/${name}`;
  const src = stripCommentLines(readFileSync(join(DIR, name), "utf8").split("\n")).join("\n");
  const lineAt = (offset: number) => src.slice(0, offset).split("\n").length;
  const imports = /import\s*\{[^}]*\bpreflight\b[^}]*\}\s*from\s*"\.\/preflight\.mjs"/.test(src);
  /* Spaces and tabs only: `\s` would swallow the blank line above the call and hand the test an empty line. */
  const call = src.search(/^[ \t]*preflight\(/m);
  if (!imports) reds.push({ file, line: 1, detail: "does not import preflight from ./preflight.mjs", remedy: 'add `import { preflight } from "./preflight.mjs"` and call it first' });
  if (call === -1) { reds.push({ file, line: 1, detail: "never calls preflight()", remedy: "call preflight() before any browser launch and before reading process.argv" }); continue; }
  const launch = src.search(/chromium\.launch\(/);
  const argv = src.search(/process\.argv/);
  if (launch !== -1 && launch < call) reds.push({ file, line: lineAt(launch), detail: `launches a browser before the preflight on line ${lineAt(call)}`, remedy: "move the preflight() call above the launch" });
  if (argv !== -1 && argv < call) reds.push({ file, line: lineAt(argv), detail: `reads its arguments before the preflight on line ${lineAt(call)}`, remedy: "move the preflight() call above the first process.argv read" });
  const callText = src.slice(call, src.indexOf("\n", call));
  if (launch !== -1 && !/browser:\s*true/.test(callText)) reds.push({ file, line: lineAt(call), detail: "launches a browser and does not ask the preflight for the browser check", remedy: "pass { browser: true } to preflight()" });
}

console.log(`harness preflight: ${scripts} scripts check their ground first; ${reds.length} red(s)`);
for (const r of reds) red({ rule: RULE, ...r });
if (reds.length) {
  redSummary(RULE, reds.length, "make each harness script above import preflight and call it before its launch and its argv", `${scripts} scripts read`);
  process.exit(1);
}
