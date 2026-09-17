/**
 * scripts/verify_counts_fresh.ts , the carriers hold current numbers.
 *
 * A thin wrapper over `scripts/counts.ts --check`, registered in the chain so a
 * stale block fails the build rather than waiting to be noticed. The generator
 * holds the reasoning; this holds the registration.
 *
 * WHY A SEPARATE FILE rather than registering `counts.ts --check` directly: the
 * chain's entries are all `verify_*` by convention and a reader scanning the
 * GATES array should not have to know that one entry is a generator wearing a
 * flag. It also gives the failure somewhere to explain itself.
 *
 * THE RED (2026-09-17, plan-2026-09-17/02-ERRORS.md step 16). The generator
 * prints the stale files as `  <file> (<why>)` lines; this wrapper reads them
 * back out of the child's output and prints one canonical line per file
 * through scripts/lib/red, with the line of the block's begin marker when the
 * file is a carrier, and a count line that carries the rule and the remedy.
 * The child's own output is passed through above them, unchanged. If the
 * generator's output ever changes shape and no file can be read out of it,
 * the red names scripts/counts.ts itself rather than printing nothing, so a
 * failure is never silent about where to look.
 *
 * WHAT IT CANNOT SEE: whether a document states a count OUTSIDE a carrier block.
 * Nothing stops a new file from typing "103 gates" in prose tomorrow. Catching
 * that needs a scan for count-shaped sentences, which is a different instrument
 * and a noisier one; this gate keeps the carriers honest, and the prose rule in
 * `docs/loop/05-GUARDRAILS.md` covers the rest until that instrument exists.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { red, redSummary } from "./lib/red";

const RULE = "counts-fresh";
const GENERATOR = "scripts/counts.ts";
const REMEDY = `run npx tsx ${GENERATOR} --write and commit what it rewrote`;

const r = spawnSync("npx", ["tsx", GENERATOR, "--check"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);

/** The line a carrier's generated block begins on, so the red can point at it. */
function blockLine(file: string): number | undefined {
  if (!existsSync(file)) return undefined;
  const i = readFileSync(file, "utf8").split("\n").findIndex((l) => l.includes("<!-- counts:begin"));
  return i === -1 ? undefined : i + 1;
}

if (r.status !== 0) {
  const named = [...`${r.stdout ?? ""}\n${r.stderr ?? ""}`.matchAll(/^ {2}(\S+) \((.+)\)\s*$/gm)];
  for (const [, file, why] of named) {
    red({ rule: RULE, file, line: blockLine(file), detail: why, remedy: REMEDY });
  }
  if (named.length === 0) {
    red({
      rule: RULE,
      file: GENERATOR,
      detail: `--check exited ${r.status ?? "with no status"} without naming a file; its output is above`,
      remedy: REMEDY,
    });
  }
  redSummary(RULE, Math.max(named.length, 1), REMEDY, "a generated count or the gate registry is stale");
  process.exit(1);
}

console.log("[verify_counts_fresh] PASS: every counts carrier is current");
