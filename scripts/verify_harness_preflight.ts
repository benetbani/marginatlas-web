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

const DIR = "scripts/harness";
const SKIP = new Set(["preflight.mjs", "env.cjs"]);
const reds: string[] = [];
let scripts = 0;

for (const name of readdirSync(DIR).sort()) {
  if (SKIP.has(name) || !/\.(mjs|ts|tsx)$/.test(name)) continue;
  scripts++;
  const src = stripCommentLines(readFileSync(join(DIR, name), "utf8").split("\n")).join("\n");
  const imports = /import\s*\{[^}]*\bpreflight\b[^}]*\}\s*from\s*"\.\/preflight\.mjs"/.test(src);
  /* Spaces and tabs only: `\s` would swallow the blank line above the call and hand the test an empty line. */
  const call = src.search(/^[ \t]*preflight\(/m);
  if (!imports) reds.push(`${name}: does not import preflight from ./preflight.mjs`);
  if (call === -1) { reds.push(`${name}: never calls preflight()`); continue; }
  const launch = src.search(/chromium\.launch\(/);
  const argv = src.search(/process\.argv/);
  if (launch !== -1 && launch < call) reds.push(`${name}: launches a browser before the preflight`);
  if (argv !== -1 && argv < call) reds.push(`${name}: reads its arguments before the preflight`);
  const callText = src.slice(call, src.indexOf("\n", call));
  if (launch !== -1 && !/browser:\s*true/.test(callText)) reds.push(`${name}: launches a browser and does not ask the preflight for the browser check`);
}

console.log(`harness preflight: ${scripts} scripts check their ground first; ${reds.length} red(s)`);
for (const r of reds) console.log("  " + r);
if (reds.length) process.exit(1);
