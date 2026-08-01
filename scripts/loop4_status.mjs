/**
 * scripts/loop4_status.mjs , the facts behind the morning report.
 *
 * WHY THIS EXISTS. The morning report is the one file the founder reads after an
 * unattended run, and a report written from memory at 5am is exactly the kind of
 * document that overstates what happened. This prints only what can be counted:
 * commits, iteration headings, backlog counts, working-tree state. The loop
 * writes the prose; this supplies the numbers it is not allowed to guess at.
 *
 * It asserts nothing and changes nothing. Read-only.
 *
 * Usage:
 *   node scripts/loop4_status.mjs                 since the loop-4 seed
 *   node scripts/loop4_status.mjs <ref>           since an explicit ref
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WEBSITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PARENT = resolve(WEBSITE, "..");
const LOOP4 = resolve(PARENT, "design/loop4");

/** Run a command, returning "" rather than throwing. A status tool must never
 *  be the thing that fails the run. */
function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

/* The baseline: where the loop started. Defaults to the commit that seeded the
   apparatus, so "since the loop began" is a fact rather than a feeling. */
const since = process.argv[2] || sh(`git log --format=%H -1 --grep="loop4: seed"`, PARENT) || "HEAD~1";

const out = [];
const say = (s = "") => out.push(s);

say("LOOP 4 STATUS");
say("=".repeat(64));
say();

/* ------------------------------ the repos ------------------------------- */

const branch = sh("git rev-parse --abbrev-ref HEAD", WEBSITE);
const ahead = sh(`git rev-list --count origin/${branch}..HEAD`, WEBSITE) || "0";
const dirty = sh("git status --porcelain", WEBSITE);

say(`website branch      ${branch}`);
say(`unpushed commits    ${ahead}`);
say(`working tree        ${dirty ? `DIRTY , ${dirty.split("\n").length} file(s)` : "clean"}`);
if (dirty) for (const line of dirty.split("\n").slice(0, 12)) say(`                    ${line}`);

const parentDirty = sh("git status --porcelain design/loop4", PARENT);
say(`loop4 docs          ${parentDirty ? "UNCOMMITTED" : "committed"}`);
say();

/* ---------------------------- what got built ---------------------------- */

const commits = sh(`git log --oneline --no-merges ${since}..HEAD`, WEBSITE);
const lines = commits ? commits.split("\n") : [];
say(`COMMITS SINCE ${since.slice(0, 8)}   (${lines.length})`);
say("-".repeat(64));
for (const l of lines) say(`  ${l}`);
if (!lines.length) say("  none");
say();

const churn = sh(`git diff --shortstat ${since}..HEAD`, WEBSITE);
if (churn) say(`  ${churn.trim()}`);
say();

/* ------------------------------ iterations ------------------------------ */

const ledger = read(resolve(LOOP4, "LEDGER4.md"));
const specs = [...ledger.matchAll(/^## (I-\d+) , (.+)$/gm)].map((m) => ({ id: m[1], title: m[2] }));
const results = new Set([...ledger.matchAll(/^### (I-\d+) , RESULT/gm)].map((m) => m[1]));

say(`ITERATIONS IN THE LEDGER   (${specs.length})`);
say("-".repeat(64));
for (const s of specs) {
  const done = results.has(s.id) || s.id === "I-0";
  say(`  ${done ? "[done]     " : "[NO RESULT]"} ${s.id} , ${s.title.replace(/ , SPEC$/, "")}`);
}
if (!specs.length) say("  none");
say();

const unfinished = specs.filter((s) => s.id !== "I-0" && !results.has(s.id));
if (unfinished.length) {
  say(`  WARNING: ${unfinished.length} iteration(s) have a SPEC and no RESULT.`);
  say(`  An iteration that did not finish must say so in the report.`);
  say();
}

/* ------------------------------- backlog -------------------------------- */

const backlog = read(resolve(LOOP4, "BACKLOG4.md"));
const open = (backlog.match(/^- \[ \]/gm) || []).length;
const closed = (backlog.match(/^- \[x\]/gm) || []).length;
const partial = (backlog.match(/^- \[~\]/gm) || []).length;

say("BACKLOG");
say("-".repeat(64));
say(`  open        ${open}`);
say(`  part done   ${partial}`);
say(`  closed      ${closed}`);
say();

/* Highest-scoring open items, so the next pick is a fact and not a mood. */
const items = [...backlog.matchAll(/^- \[ \] \*\*([A-Z]\d+)\.(.+?)\*\*([\s\S]*?)(?=\n- \[|\n##|\n---)/gm)];
const scored = items
  .map((m) => {
    const score = [...m[3].matchAll(/\*\*(\d+)\*\*/g)].map((s) => Number(s[1])).pop() ?? 0;
    return { id: m[1], title: m[2].trim().slice(0, 58), score };
  })
  .filter((i) => i.score >= 8)
  .sort((a, b) => b.score - a.score);

say(`  unblocked at 8+, highest first   (${scored.length})`);
for (const i of scored.slice(0, 12)) say(`    ${String(i.score).padStart(2)}  ${i.id}  ${i.title}`);
say();

/* ------------------------------ artifacts ------------------------------- */

const reviews = sh("git ls-files design/loop4/reviews", PARENT);
say("ARTIFACTS THE FOUNDER CAN OPEN");
say("-".repeat(64));
for (const f of (reviews ? reviews.split("\n") : []).slice(0, 20)) say(`  ${f}`);
if (!reviews) say("  none yet");
say();

say("=".repeat(64));
say("Gate results are NOT in this file. Run them and paste the real output:");
say("  npx tsc --noEmit ; npm run prebuild ; node scripts/loop_gate.mjs");
say("A gate result written from memory is the one number nobody may guess at.");

console.log(out.join("\n"));
