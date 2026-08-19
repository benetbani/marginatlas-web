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
 * WHAT IT CANNOT SEE: whether a document states a count OUTSIDE a carrier block.
 * Nothing stops a new file from typing "103 gates" in prose tomorrow. Catching
 * that needs a scan for count-shaped sentences, which is a different instrument
 * and a noisier one; this gate keeps the carriers honest, and the prose rule in
 * `docs/loop/05-GUARDRAILS.md` covers the rest until that instrument exists.
 */
import { spawnSync } from "node:child_process";

const r = spawnSync("npx", ["tsx", "scripts/counts.ts", "--check"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);

if (r.status !== 0) {
  console.error(
    "[verify_counts_fresh] FAIL: a generated counts block is stale.\n" +
      "Fix with: npx tsx scripts/counts.ts --write",
  );
  process.exit(1);
}

console.log("[verify_counts_fresh] PASS: every counts carrier is current");
