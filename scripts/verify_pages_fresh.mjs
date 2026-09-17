/**
 * verify_pages_fresh , THE CHAIN SEES THE LIVE PAGES (plan-2026-09-17/
 * 02-ERRORS.md, step 14b, first half). Renders the six pages of
 * scripts/harness/pages.json from the real adapters and views with
 * scripts/harness/render_page.tsx --list, the same spawn as look.mjs and the
 * harness driver (tsx under the harness tsconfig, the env preload, the
 * next/font stub), and then asserts that every `fresh` entry of
 * scripts/lib/page_renders.mjs exists, was written after this gate started,
 * and is over 10,000 bytes. Runs FIRST in the chain (`phase: "first"` in
 * scripts/prebuild_all.ts, serially, before the pool), so the nine browser
 * gates that read those renders measure the source being deployed and not a
 * snapshot frozen on 2026-09-08.
 *
 * WHAT IT PRINTS beside the verdict: the bytes of each page, and whether
 * NEXT_PUBLIC_SUPABASE_URL was in the render's environment (the shell's, or
 * .env.local, which scripts/harness/env.cjs loads into the child).
 *
 * THE BLIND SPOT, stated before any gate downstream quotes a number off these
 * renders. The render needs a Supabase URL to START: src/lib/supabase.ts
 * constructs the client at import and @supabase/supabase-js throws
 * "supabaseUrl is required." (measured 2026-09-17 without the preload: exit 1
 * in 1.2 s before a page is touched), so with no URL this gate reds on that
 * line and nothing renders. WITH a URL but a database that rejects, times out
 * or is unreachable, the country and cell adapters fall back through
 * withBudget and dbFailed (src/lib/cells.ts) and the page renders anyway,
 * carrying the fallbacks; the nine gates then measure THAT state and cannot
 * tell it from a page drawn from live rows. The one instrument this has is
 * the query ledger's warn lines, `[cells] <label> failed, falling back` and
 * `[cells] <label> exceeded <n>ms budget, falling back` (src/lib/query_log.ts),
 * which the render prints to stderr: they are counted and printed here, and a
 * count above zero means the renders below carry fallbacks. That count is
 * information, not a red: a slow table must never take a deploy down (the
 * fail-soft is deliberate, cells.ts says why), and a page that renders from
 * fallbacks is still the page the site would serve in that state.
 *
 * WHAT ELSE IT CANNOT SEE: a render that is fresh and large and wrong. Size
 * and age prove the render step ran on this source; what the page draws is
 * the nine gates' business, and the harness's (npm run harness:page).
 *
 * Usage: npx tsx scripts/verify_pages_fresh.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { preflight } from "./harness/preflight.mjs";
import { pageRenders, describeRenders, HARNESS_LIST, FRESH_DIR } from "./lib/page_renders.mjs";
import { red, redSummary } from "./lib/red.mjs";

/* THE GROUND FIRST: the site root, free memory printed. No browser flag: the render is React, not a browser. */
preflight({ name: "pages-fresh" });

const RULE = "pages-fresh";
const RENDERER = "scripts/harness/render_page.tsx";
const MIN_BYTES = 10_000;
/* ONE SPELLING OF THE RENDER COMMAND, the harness driver's and look.mjs's. */
const SPAWN = [
  process.execPath,
  "node_modules/tsx/dist/cli.mjs",
  "--tsconfig", "scripts/tsconfig.harness.json",
  "--require", "./scripts/harness/env.cjs",
  "--require", "./scripts/spikes/stub_next_font.cjs",
  RENDERER, "--list", HARNESS_LIST,
];

/* Was a Supabase URL available to the render? The child's env.cjs loads
   .env.local when it exists, so the answer is "the shell has it, or the file
   names it"; the value itself is never read or printed here. */
function supabaseUrlPresence() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return "present (in the environment)";
  if (existsSync(".env.local") && /^\s*NEXT_PUBLIC_SUPABASE_URL\s*=\s*\S/m.test(readFileSync(".env.local", "utf8"))) return "present (from .env.local)";
  return "ABSENT";
}

const started = Date.now();
const urlPresence = supabaseUrlPresence();
console.log(`pages-fresh: rendering ${HARNESS_LIST} with ${RENDERER} --list into ${FRESH_DIR}/ (Supabase URL ${urlPresence})`);

const r = spawnSync(SPAWN[0], SPAWN.slice(1), { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const stdout = r.stdout ?? "";
const stderr = r.stderr ?? "";
/* The render's own lines pass through, indented, so the chain's tail shows them. */
for (const line of (stdout + stderr).split(/\r?\n/)) if (line.trim()) console.log(`    ${line}`);

const fallbacks = (stderr + stdout).split(/\r?\n/).filter((l) => /\[cells\] .* falling back/.test(l));
const reds = [];

if (r.error) {
  reds.push({ file: RENDERER, detail: `the render could not be spawned (${r.error.message})`, remedy: "run npm install from the site root, then npm run harness:page to see the render's own error" });
} else if (r.status !== 0) {
  const supabase = /supabaseUrl is required/.test(stderr + stdout);
  reds.push({
    file: RENDERER,
    detail: supabase
      ? `the render exited ${r.status} on "supabaseUrl is required": NEXT_PUBLIC_SUPABASE_URL was ${urlPresence}, and src/lib/supabase.ts constructs its client at import`
      : `the render exited ${r.status}`,
    remedy: supabase
      ? "set NEXT_PUBLIC_SUPABASE_URL (Vercel has it; locally .env.local carries it) and run again; no page renders without it"
      : "run npm run harness:page and read the render's own error above",
  });
}

const entries = pageRenders({ kinds: ["fresh"] });
for (const e of entries) {
  if (!e.exists) {
    reds.push({ file: e.path, detail: `${e.name} did not render (no file)`, remedy: `run npm run harness:page -- --only=${e.name} and read why ${e.surface} ${e.slugs.join(" ")} does not render` });
    continue;
  }
  const fresh = e.mtime.getTime() >= started;
  const big = e.bytes > MIN_BYTES;
  if (!fresh) reds.push({ file: e.path, detail: `${e.name} is STALE: written ${e.mtime.toISOString()}, before this gate started at ${new Date(started).toISOString()}`, remedy: `the render did not rewrite it; run npm run harness:page -- --only=${e.name} and read the render's error` });
  if (!big) reds.push({ file: e.path, detail: `${e.name} is ${e.bytes} bytes, under the ${MIN_BYTES}-byte floor for a rendered page`, remedy: `open the file; a page this small drew no body, so read the adapter for ${e.surface} ${e.slugs.join(" ")}` });
  console.log(`  ${fresh && big ? "ok" : "x "} ${e.name.padEnd(28)} ${String(e.bytes).padStart(9)} bytes  written ${e.mtime.toISOString()}${fresh ? "" : "  (STALE)"}`);
}

console.log(`  Supabase URL: ${urlPresence}; query fallbacks in the render's output: ${fallbacks.length}${fallbacks.length ? " (the renders below carry the adapters' fallbacks, and the gates measure that state)" : ""}`);
for (const f of fallbacks) console.log(`    ${f.trim()}`);
console.log(`  ${describeRenders(entries, RULE)}`);

for (const f of reds) red({ rule: RULE, ...f });
if (reds.length) {
  redSummary(RULE, reds.length, `every page in ${HARNESS_LIST} must render fresh and whole before the browser gates read it`, `${entries.length} listed, ${((Date.now() - started) / 1000).toFixed(1)} s`);
  process.exit(1);
}
console.log(`PASS pages-fresh: ${entries.length} page(s) rendered fresh from ${HARNESS_LIST} in ${((Date.now() - started) / 1000).toFixed(1)} s.`);
