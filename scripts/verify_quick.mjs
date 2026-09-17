/**
 * THE PER-CHANGE CHECK, ONE COMMAND (plan step 22, 2026-09-17).
 *
 * Runs, in order, each to its own file under scratchpad/quick/, each exit
 * code printed on its own line, and stops at the first red:
 *
 *   1. the typecheck                     npx tsc --noEmit
 *   2. the targeted harness              scripts/harness/harness.mjs --only=<story>   (one line per story)
 *                                        scripts/harness/harness.mjs page --only=<page> [--section=<id>]
 *   3. the two copy gates                scripts/verify_archetype_copy.ts, scripts/verify_model_laws_copy.ts
 *
 * usage, from E:/atlas/website:
 *   npm run verify:quick -- [--story=<kind>[/<key>]]... [--page=<page>[#<section>]]...
 *
 *   e.g. npm run verify:quick -- --story=ranked-bars/london:districts --page=city#districts
 *
 * With no --story and no --page, step 2 is skipped and the line says so; that
 * is a copy-only change's check. This never runs the full harness and never
 * the chain: those run once per step and once per session (DOCTRINE 6a).
 *
 * WHY EACH STEP REDIRECTS TO A FILE. `| tail` reports tail's exit code,
 * always 0; on 2026-08-25 a 120-gate chain failed one and was read as a
 * pass. The file is the evidence; the exit code is read from the child, not
 * from a pipe.
 *
 * WHY IT STOPS AT THE FIRST RED. One change, one verification: a copy gate
 * red on top of a typecheck red is two things to fix and neither is
 * falsifiable. Fix the first, run again.
 *
 * Measured on 2026-09-17 with a warm stylesheet, 1.5 GB free: tsc 35 s, one
 * story 6 s, one page card 19 s, the two copy gates 9 s, so a typical run is
 * about seventy seconds. The full harness is 43 s on its own and the chain
 * six minutes; this exists so neither is run between edits.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const out = resolve(root, "scratchpad/quick");
mkdirSync(out, { recursive: true });

const args = process.argv.slice(2);
const stories = args.filter((a) => a.startsWith("--story=")).map((a) => a.slice(8));
const pages = args.filter((a) => a.startsWith("--page=")).map((a) => a.slice(7));
const unknown = args.filter((a) => !a.startsWith("--story=") && !a.startsWith("--page="));
if (unknown.length) {
  console.error(`verify:quick: unknown argument(s) ${unknown.join(" ")}\nusage: npm run verify:quick -- [--story=<kind>[/<key>]]... [--page=<page>[#<section>]]...`);
  process.exit(2);
}

/* NO npx AND NO SHELL. On Windows npx is a .cmd shim, and Node refuses to
   spawn a .cmd without a shell (EINVAL, its 2024 hardening), while a shell
   does not escape arguments. So each tool is run on node itself through the
   entry file its package ships: the typecheck and tsx both. Measured: this is
   also faster than the shim by about two seconds a step. */
const tsc = ["node", "node_modules/typescript/bin/tsc"];
const tsx = ["node", "node_modules/tsx/dist/cli.mjs"];
const steps = [
  { name: "tsc", cmd: [...tsc, "--noEmit"] },
  ...stories.map((s) => ({ name: `story ${s}`, cmd: ["node", "scripts/harness/harness.mjs", `--only=${s}`] })),
  ...pages.map((p) => {
    const [page, section] = p.split("#");
    const cmd = ["node", "scripts/harness/harness.mjs", "page", `--only=${page}`];
    if (section) cmd.push(`--section=${section}`);
    return { name: `page ${p}`, cmd };
  }),
  { name: "archetype-copy", cmd: [...tsx, "scripts/verify_archetype_copy.ts"] },
  { name: "model-laws-copy", cmd: [...tsx, "scripts/verify_model_laws_copy.ts"] },
];

if (!stories.length && !pages.length) console.log("verify:quick: no --story or --page given, so the targeted harness is skipped (a copy-only change)");

const started = Date.now();
let i = 0;
for (const step of steps) {
  i += 1;
  const file = resolve(out, `${String(i).padStart(2, "0")}-${step.name.replace(/[^a-z0-9]+/gi, "-")}.txt`);
  const t0 = Date.now();
  const r = spawnSync(step.cmd[0], step.cmd.slice(1), { cwd: root, shell: false, encoding: "utf8" });
  writeFileSync(file, `$ ${step.cmd.join(" ")}\n\n${r.stdout ?? ""}${r.stderr ?? ""}`);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  const code = r.status ?? 1;
  console.log(`${code === 0 ? "ok " : "RED"}  ${step.name.padEnd(44)} exit ${code}  ${secs}s  ${file.replace(root + "\\", "").replace(root + "/", "")}`);
  if (code !== 0) {
    const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n").slice(-8).join("\n");
    console.log(`\n${tail}\n\nverify:quick: stopped at the first red, ${step.name}; fix it and run again.`);
    process.exit(code);
  }
}
console.log(`verify:quick: all ${steps.length} green in ${((Date.now() - started) / 1000).toFixed(0)}s`);
