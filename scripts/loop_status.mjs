#!/usr/bin/env node
/**
 * loop_status , the whole orientation of one tick, in ONE process.
 *
 * WHY THIS EXISTS. Orientation used to mean reading five documents, roughly 800
 * lines, every tick. On a 30-minute tick that is the orient budget spent before
 * any work starts, and it is spent again every 30 minutes for as long as the loop
 * runs. This prints everything a tick needs to decide what to do, in a single
 * node process and under a second.
 *
 * IT ALSO ENFORCES THE ONE-PROCESS RULE the operating rules §3 added after a
 * `git log | while read` over 1,000 commits spawned thousands of processes,
 * timed out, and left the machine reporting `fork: Resource temporarily
 * unavailable`. Everything below is three git invocations and some file reads.
 * If you extend it, do not add a subprocess per row.
 *
 * WHAT IT CANNOT DO, stated before anything quotes it:
 *   - It does NOT run the gate chain. It reports the count carried in CLAUDE.md's
 *     generated block, which `verify_counts_fresh` keeps honest, and it says so.
 *     A green line here is evidence the block is fresh, never that the site works.
 *   - It reads the backlog as TEXT. It cannot tell an item that is genuinely
 *     unblocked from one whose blocker is written in prose inside the item.
 *   - It cannot distinguish a tree that is dirty from a crashed tick from one
 *     that is dirty because a tick is running right now.
 *
 * Run: node scripts/loop_status.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const read = (p) => (existsSync(resolve(ROOT, p)) ? readFileSync(resolve(ROOT, p), "utf8") : "");
/* trimEnd, NOT trim. `git status --porcelain` encodes state in columns 1 and 2,
   so a leading space is DATA: ` M .mcp.json` trimmed becomes `M .mcp.json` and
   slicing the fixed 3-char prefix then eats the dot. That defect printed
   `mcp.json` on this script's first run and would have reported the
   intentionally-dirty file as an unexpected one forever. */
const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trimEnd();
  } catch {
    return "";
  }
};

/* ---- 1. THE TREE ------------------------------------------------------- */
/* Known-dirty by rule, not by accident. `.mcp.json` is intentionally dirty and
   is never committed; scratchpad and the installed skill dir are untracked
   working space. Anything else dirty means a tick crashed mid-write. */
const KNOWN_DIRTY = [".mcp.json", "scratchpad/", ".agents/", "skills-lock.json"];
const branch = git("rev-parse", "--abbrev-ref", "HEAD");
const porcelain = git("status", "--porcelain");
const dirty = porcelain
  .split("\n")
  .filter(Boolean)
  .map((l) => l.slice(3))
  .filter((f) => !KNOWN_DIRTY.some((k) => f.startsWith(k)));
const ahead = git("rev-list", "--count", "origin/main..HEAD") || "?";
const head = git("log", "-1", "--format=%h %s");

/* ---- 2. THE CHAIN ------------------------------------------------------ */
/* Carried, not re-derived. `scripts/counts.ts` owns this number and
   `verify_counts_fresh` fails the chain when the block goes stale. A second
   implementation here would be exactly the divergent-instrument defect that
   `prebuild:serial` already is. */
const claude = read("CLAUDE.md");
const gateCount = (claude.match(/- \*\*(\d+)\*\* gates in the prebuild chain/) ?? [])[1] ?? "?";
const routeCount = (claude.match(/- \*\*(\d+)\*\* App Router page routes/) ?? [])[1] ?? "?";

/* ---- 3. THE QUEUE ------------------------------------------------------ */
const BACKLOG = "docs/superpowers/plans/2026-08-19-masterplan/06-BACKLOG.md";
const backlog = read(BACKLOG);
const items = [...backlog.matchAll(/^- \[([ x~?])\]\s+\*\*([^\n]+?)\*\*/gm)].map((m) => ({
  state: m[1],
  title: m[2].replace(/\s+/g, " ").trim(),
}));
const open = items.filter((i) => i.state === " ");
const inFlight = items.filter((i) => i.state === "~");
const blocked = items.filter((i) => i.state === "?");
const done = items.filter((i) => i.state === "x");

/* ---- 4. THE LOOP'S OWN MEMORY ------------------------------------------ */
const state = read("docs/loop/STATE.md");
const tick = (state.match(/\|\s*Tick\s*\|\s*\*\*(\d+)\*\*/) ?? [])[1] ?? "?";
const decisions = read("docs/loop/DECISIONS-NEEDED.md");
const openQuestions = (decisions.match(/^\*\*Q\d+\./gm) ?? []).length;

/* ---- 5. THE DESTINATION ------------------------------------------------ */
/* The readiness ledger is the only thing here that answers "closer to
   production" with a number rather than a feeling. */
const ledger = read("docs/loop/11-PRODUCTION-READINESS.md");
/* G-ids, not R-ids. `R1`..`R13` are already the review-gate checks in
   `03-PROCEDURE.md` §2, and two id spaces sharing a prefix is how a check gets
   cited as a goal. */
const crit = [...ledger.matchAll(/^\|\s*(G\d+)\s*\|[^|]*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/gm)];
/* Leading `*` stripped before matching. The ledger's own legend prints the
   states in bold, so the first criterion to reach MET was written `**MET**` and
   this counter read straight past it: the score stayed at 1/30 on the tick that
   moved it. Same class as the wrapped-title defect at tick 14 , a document
   formatted for a human, parsed by a tool that wanted it plain. */
const met = crit.filter((c) => /^MET\b/i.test(c[3].replace(/^\*+/, ""))).length;

/* ---- PRINT ------------------------------------------------------------- */
const L = (k, v) => console.log("  " + k.padEnd(22) + v);
console.log("=== loop_status ===");
L("branch", branch + (branch === "main" ? "" : "   <- NOT main"));
L("unpushed", ahead + " commits   (never push; the founder pushes)");
L("HEAD", head);
L("tree", dirty.length === 0 ? "clean apart from the knowns" : dirty.length + " UNEXPECTED dirty: " + dirty.join(" "));
L("chain (carried)", gateCount + " gates, " + routeCount + " routes   [gated by counts-fresh, NOT run here]");
L("tick", tick);
L("queue", open.length + " open, " + inFlight.length + " in flight, " + blocked.length + " blocked, " + done.length + " done");
L("open questions", openQuestions + "   (docs/loop/DECISIONS-NEEDED.md)");
L("readiness", crit.length ? met + " / " + crit.length + " criteria MET" : "ledger not found");

if (inFlight.length) {
  console.log("\n  IN FLIGHT , finish this before starting anything new:");
  for (const i of inFlight) console.log("     " + i.title.slice(0, 110));
}
console.log("\n  TOP OF QUEUE:");
for (const i of open.slice(0, 3)) console.log("     " + i.title.slice(0, 110));

/* ---- THE THREE HALT CONDITIONS ---------------------------------------- */
/* Printed last so they are the final thing on screen. An unattended loop needs
   to be told to stop by something other than a human noticing. */
const halts = [];
if (dirty.length) halts.push("TREE DIRTY , checkpoint-commit before taking new work (operating rules §12.1)");
if (branch !== "main") halts.push("WRONG BRANCH , the loop works on main only");
if (inFlight.length > 1) halts.push("MORE THAN ONE ITEM IN FLIGHT , converge before opening a third");
if (halts.length) {
  console.log("\n  !! HALT CONDITIONS:");
  for (const h of halts) console.log("     " + h);
  process.exit(2);
}
console.log("\n  clear to take the top item.");
process.exit(0);
