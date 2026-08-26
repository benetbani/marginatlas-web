/**
 * scripts/lib/local_only.mjs , THE TWO THINGS A BUILD SERVER DOES NOT HAVE.
 *
 * Vercel clones only `website/` into `/vercel/path0`. It has no parent repo and
 * no browser binary. Several design-review gates need one or both, and on
 * 2026-08-27 three of them failed a production deploy for exactly that reason:
 * one read `E:/atlas/design/ART-DIRECTION.md`, the others launched chromium.
 *
 * This is the THIRD time the parent-repo class of defect has killed deploys, and
 * `verify_no_parent_repo_reads` exists because of the first two. It did not catch
 * this one, because its test for "guarded" was that the word `existsSync` appears
 * somewhere in the file. Mine appeared, and then the gate failed anyway. A check
 * that reads for a word rather than for a behaviour is not a check.
 *
 * So the declaration is explicit and machine-readable now: a gate that needs
 * something a build server lacks calls one of these, and the meta-gate looks for
 * the CALL, not for a word that happens to be nearby.
 *
 * SKIPPING IS LOUD, ALWAYS. A skipped gate and a passed gate must never look
 * alike , that confusion is this project's most expensive recurring mistake. Every
 * skip prints what was missing and what was therefore not checked.
 */
import { existsSync, readFileSync } from "node:fs";

/** The design machine is the one with the design repo beside the website repo.
 *  Every gate in this file needs something only that machine has. */
const DESIGN_REPO = "E:/atlas/design";

function skip(gate, missing, notChecked) {
  console.log(`SKIPPED ${gate}`);
  console.log(`  missing here: ${missing}`);
  console.log(`  NOT CHECKED on this machine: ${notChecked}`);
  console.log(`  This runs on the design machine, where it fails hard. It is not disabled.`);
  process.exit(0);
}

/**
 * Read a file that lives in the parent design repo. Returns its contents on the
 * design machine; prints a loud skip and exits 0 anywhere else.
 */
export function parentRepoFile(path, gate, notChecked) {
  if (!existsSync(path)) skip(gate, `the design repo (${path})`, notChecked);
  return readFileSync(path, "utf8");
}

/**
 * Confirm a real browser is installed before a gate tries to drive one. Exits 0
 * with a loud skip when it is not, which is every build server.
 */
export async function requireBrowser(gate, notChecked) {
  /* THE QUESTION IS "AM I ON THE MACHINE THESE GATES ARE FOR", NOT "DID A LAUNCH
     FAIL". Matching on the text of a launch error is a guess about wording that
     nobody controls, and if the wording differs by one word the gate throws and
     kills the deploy , which is the exact failure this file was written to end.
     The design repo is the certain signal. These gates photograph pages against a
     design corpus that lives beside it, so where that repo is absent they have
     nothing to check and skip; where it is present they run, and ANY launch
     failure there is a real fault that must surface loudly rather than be mistaken
     for an absent browser.
     It is also faster: a build server never starts a browser at all. */
  if (!existsSync(DESIGN_REPO)) skip(gate, `the design repo (${DESIGN_REPO})`, notChecked);
  await import("playwright");
}
