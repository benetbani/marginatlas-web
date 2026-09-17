/**
 * BOTH REPOS IN ONE STATUS (plan step 28, 2026-09-17). The first command of
 * every run, and the reason: the working directory drifted between the two
 * repos more than seven times in a fortnight, and a stash of half-withdrawn
 * work sat unnoticed for four days because nothing listed it.
 *
 * usage, from anywhere: node E:/atlas/website/scripts/status.mjs
 *        or, from the site: npm run status
 *
 * Prints, for the site (E:/atlas/website) and the loop (E:/atlas): the
 * branch, HEAD, dirty tracked files, stash count with each stash's message,
 * commits ahead of origin (the loop has no remote and says so); then free
 * memory against the floors; then the step in flight from the loop's
 * STATE.md. It runs git in each repo with an explicit cwd, so it cannot
 * itself drift. It changes nothing.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { freemem } from "node:os";
import { resolve } from "node:path";

const SITE = resolve("E:/atlas/website");
const LOOP = resolve("E:/atlas");
const STATE = resolve(LOOP, "design/loop/build/STATE.md");

function git(cwd, args) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return (r.stdout ?? "").trim();
}
function repo(name, cwd) {
  if (!existsSync(cwd)) { console.log(`${name}: ${cwd} does not exist`); return; }
  const branch = git(cwd, ["branch", "--show-current"]) || "(detached)";
  const head = git(cwd, ["log", "--oneline", "-1"]);
  const dirty = git(cwd, ["status", "--short"]).split("\n").filter((l) => l && !l.startsWith("??"));
  const stashes = git(cwd, ["stash", "list"]).split("\n").filter(Boolean);
  const remote = git(cwd, ["remote"]);
  let ahead = "no remote";
  if (remote) {
    const upstream = git(cwd, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
    ahead = upstream ? `${git(cwd, ["rev-list", "--count", `${upstream}..HEAD`])} ahead of ${upstream}` : "no upstream set";
  }
  console.log(`${name}  ${cwd}`);
  console.log(`  branch ${branch}   HEAD ${head}`);
  console.log(`  ${ahead}`);
  console.log(`  dirty tracked: ${dirty.length}${dirty.length ? "\n    " + dirty.join("\n    ") : ""}`);
  console.log(`  stashes: ${stashes.length}${stashes.length ? "\n    " + stashes.map((s) => s.slice(0, 160)).join("\n    ") : ""}`);
}

repo("site", SITE);
repo("loop", LOOP);

const free = Math.round(freemem() / 1048576);
const note = free < 620 ? "under the browser floor (620): a harness run will refuse" : free < 1100 ? "under the chain floor (1100): one browser is fine, the chain is not" : "room for the chain";
console.log(`memory  ${free} MB free, ${note}`);

if (existsSync(STATE)) {
  const s = readFileSync(STATE, "utf8");
  const line = (key) => (s.match(new RegExp(`^${key}: (.*)$`, "m")) ?? [])[1];
  console.log(`state   in flight: ${line("step-in-flight") ?? "(not recorded)"}`);
  console.log(`        done: ${line("steps-done") ?? "(not recorded)"}`);
} else {
  console.log(`state   ${STATE} not found`);
}
