/**
 * THE DEPLOY CHAIN, LOCALLY, BEFORE A PUSH (plan step 30, 2026-09-17).
 *
 * A push on 2026-09-11 failed on Vercel at 54 seconds on the no-cream gate,
 * a red that would have shown locally in six minutes. This runs what Vercel
 * runs when it runs `npm run build`: npm's prebuild hook, which is the whole
 * gate chain, and then the Next build. Here the chain runs at concurrency 1
 * (this 8 GB machine segfaults above four and dies on memory above one), to
 * a file, with the summary and the exit code printed; the Next build is
 * minutes and a spare gigabyte, so it runs only with --build.
 *
 * usage, from E:/atlas/website:
 *   npm run verify:deploy            the chain, serial, to scratchpad/deploy/chain.txt
 *   npm run verify:deploy -- --build the chain, then `next build` to scratchpad/deploy/build.txt
 *
 * It refuses under the chain's memory floor (preflight, exit 2) rather than
 * dying in a browser gate and calling it a failure. A green run is named in
 * STATE.md before the push; the doctrine says once per session, when memory
 * allows. Vercel's own run remains the authority: this is the same list on a
 * different machine.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { preflight, CHAIN_FLOOR_MB } from "./harness/preflight.mjs";

preflight({ browser: false, name: "verify_deploy", floor: CHAIN_FLOOR_MB });

const build = process.argv.includes("--build");
const out = resolve("scratchpad/deploy");
mkdirSync(out, { recursive: true });

function step(name, cmd, file) {
  const t0 = Date.now();
  console.log(`verify:deploy: ${name} ...`);
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const text = `$ ${cmd.join(" ")}\n\n${r.stdout ?? ""}${r.stderr ?? ""}`;
  writeFileSync(file, text);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  /* The chain's own summary block, printed so the numbers sit beside the exit code and never three lines above it. */
  const i = text.indexOf("=== Summary ===");
  if (i !== -1) console.log(text.slice(i, i + 700).trim());
  console.log(`verify:deploy: ${name} exit ${r.status} in ${secs}s, full output in ${file}`);
  return r.status ?? 1;
}

const TSX = [process.execPath, "node_modules/tsx/dist/cli.mjs"];
const chain = step("the gate chain, serial", [...TSX, "scripts/prebuild_all.ts", "--concurrency=1", "--no-bail"], resolve(out, "chain.txt"));
if (chain !== 0) { console.log("verify:deploy: the chain is red; Vercel would fail this push. Read scratchpad/deploy/chain.txt from its === Failures === block."); process.exit(chain); }
if (!build) { console.log("verify:deploy: chain green. The Next build was not run (add --build; it is minutes and a spare gigabyte)."); process.exit(0); }
const nb = step("next build", [process.execPath, "node_modules/next/dist/bin/next", "build"], resolve(out, "build.txt"));
process.exit(nb);
