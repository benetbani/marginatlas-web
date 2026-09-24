/**
 * verify_browser_gates_skip: every script the chain runs that launches a
 * browser skips loudly on a build server (the goal's A8, 2026-09-24).
 *
 * Vercel runs the whole chain before every build, and its build machine has
 * no Playwright browser. Each browser gate therefore calls `requireBrowser`
 * (scripts/lib/local_only.mjs), which prints SKIPPED with what was not
 * checked and exits 0 where the design machine is absent. A gate that
 * launches without it dies on the build server and fails the deploy: three
 * did on 2026-08-27, and `gloss-tap` did on 2026-09-24 (batch eight, Vercel:
 * "browserType.launch: Executable doesn't exist at /vercel/.cache/
 * ms-playwright/..."), after a local chain of 162 of 162, because the design
 * machine HAS a browser and no local run can see the omission. This gate
 * reads every script the chain registers: one that calls `chromium.launch(`,
 * or imports a local module that does, must call `requireBrowser(` (in
 * itself or in that module).
 *
 * BLIND SPOT: it reads source one import deep and looks for the call, not its
 * order; a script that launches before its guard runs, or through a module
 * two imports away, passes here. Planted (the guard removed from gloss-tap),
 * watched red.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { red } from "./lib/red";
import { newCommentState, stripComments } from "./lib/strip_comments";

const RULE = "browser-gates-skip";
const REGISTRY = "scripts/prebuild_all.ts";
const LAUNCH = /\bchromium\s*\.\s*launch\s*\(/;
const GUARD = /\brequireBrowser\s*\(/;
const reds: string[] = [];

/** A file's source with its comments removed, so a guard or a launch named in a comment counts for nothing. */
function code(file: string): string {
  const state = newCommentState();
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => stripComments(line, state))
    .join("\n");
}

const registered = [...new Set([...code(REGISTRY).matchAll(/script:\s*"([^"]+)"/g)].map((m) => m[1]))];
let launching = 0;
for (const script of registered) {
  if (!existsSync(script)) continue; /* a missing script is the chain's own red */
  const src = code(script);
  let via: string | null = null;
  let guardedVia = false;
  if (!LAUNCH.test(src)) {
    for (const m of src.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g)) {
      const base = resolve(dirname(script), m[1]);
      const file = [base, `${base}.mjs`, `${base}.ts`, `${base}.js`].find((f) => existsSync(f) && statSync(f).isFile());
      if (!file) continue;
      const mod = code(file);
      if (LAUNCH.test(mod)) {
        via = relative(process.cwd(), file).replace(/\\/g, "/");
        guardedVia = GUARD.test(mod);
        break;
      }
    }
    if (!via) continue;
  }
  launching++;
  if (!GUARD.test(src) && !guardedVia) {
    reds.push(
      red({
        rule: RULE,
        file: script,
        detail: via ? `launches a browser through ${via} and never calls requireBrowser` : "launches a browser and never calls requireBrowser",
        remedy: "call `await requireBrowser(RULE, \"what is not checked\")` from scripts/lib/local_only.mjs before the launch, so a build server skips loudly instead of failing the deploy",
      }),
    );
  }
}

if (reds.length) {
  console.error(`verify_browser_gates_skip: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_browser_gates_skip: ${registered.length} chain scripts read; the ${launching} that launch a browser, directly or through a local module, each call requireBrowser, so a build server skips them loudly.`);
