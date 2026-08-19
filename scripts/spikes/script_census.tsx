/**
 * scripts/spikes/script_census.tsx , which scripts does anything actually run?
 *
 * WHY. `scripts/` holds 260 tracked files and the prebuild chain registers 104.
 * The rest are unlabelled: some are instruments a step file calls by name, some
 * are npm scripts, some are one-shots that served their purpose in June. This
 * repo's own corollary is that a check nothing runs is not coverage, and the
 * same logic applies to a tool nobody can find.
 *
 * MEASURED IN ONE PROCESS, deliberately. Tick 12 wrote the rule after a
 * per-commit loop over a thousand commits exhausted the machine's process table:
 * this reads every tracked text file exactly once, builds one index, and answers
 * every question from it.
 *
 * THE FOUR BUCKETS
 *   gate        registered in the GATES array of scripts/prebuild_all.ts
 *   npm         named by a script in package.json
 *   referenced  named by any other tracked file (a doc, a step file, another
 *               script), so somebody can find it
 *   orphan      named by nothing at all
 *
 * WHAT IT CANNOT SEE, and it matters before anything is deleted on this basis:
 *   1. A file referenced only from a COMMIT MESSAGE or a chat transcript is an
 *      orphan here and may still be the instrument somebody reaches for.
 *   2. It matches by basename as well as path, so a script whose name is a
 *      common word will look referenced when the word appears in prose.
 *   3. It says nothing about whether a script still WORKS. Orphan is a claim
 *      about attention, not about correctness.
 *
 * Run: npx tsx scripts/spikes/script_census.tsx
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { newCommentState, stripComments } from "../lib/strip_comments";

const TEXT = /\.(ts|tsx|mjs|cjs|js|json|md|sql|css|yml|yaml)$/;

function tracked(): string[] {
  return execFileSync("git", ["ls-files"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\n")
    .filter(Boolean);
}

function main() {
  const files = tracked();
  const scripts = files.filter((f) => f.startsWith("scripts/") && TEXT.test(f));

  /* One read of every text file in the repo. Everything below is answered from
     this map rather than from another walk. */
  const contents = new Map<string, string>();
  for (const f of files) {
    if (!TEXT.test(f)) continue;
    try {
      contents.set(f, fs.readFileSync(f, "utf8"));
    } catch {
      /* a file in the index but not on disk: skip rather than crash */
    }
  }

  /* Gates: parsed with strip_comments so a registration quoted inside an
     explanatory comment cannot count as a registration. */
  const gates = new Set<string>();
  const chain = contents.get("scripts/prebuild_all.ts") ?? "";
  const state = newCommentState();
  for (const line of chain.split("\n")) {
    const code = stripComments(line, state);
    const m = /script:\s*"([^"]+)"/.exec(code);
    if (m) gates.add(m[1]);
  }

  const pkg = contents.get("package.json") ?? "";

  const rows = scripts.map((s) => {
    const base = path.basename(s);
    const isGate = gates.has(s);
    const inNpm = pkg.includes(base);
    let refs = 0;
    for (const [f, text] of contents) {
      if (f === s) continue;
      if (f === "scripts/prebuild_all.ts" || f === "package.json") continue;
      if (text.includes(s) || text.includes(base)) refs++;
    }
    const bucket = isGate ? "gate" : inNpm ? "npm" : refs > 0 ? "referenced" : "orphan";
    return { path: s, bucket, refs };
  });

  const by = (b: string) => rows.filter((r) => r.bucket === b);
  console.log(`\nSCRIPT CENSUS, ${scripts.length} tracked text files under scripts/\n`);
  for (const b of ["gate", "npm", "referenced", "orphan"]) {
    console.log(`  ${b.padEnd(12)} ${String(by(b).length).padStart(4)}`);
  }

  console.log(`\nORPHANS, named by nothing tracked (${by("orphan").length}):`);
  for (const r of by("orphan").sort((a, b) => a.path.localeCompare(b.path))) {
    console.log(`  ${r.path}`);
  }

  /* Referenced-but-thin is the interesting middle: one mention is often a single
     line in one document, which is worth knowing before calling it maintained. */
  const thin = by("referenced").filter((r) => r.refs <= 1);
  console.log(`\nREFERENCED EXACTLY ONCE (${thin.length}), the thin middle:`);
  for (const r of thin.sort((a, b) => a.path.localeCompare(b.path)).slice(0, 40)) {
    console.log(`  ${r.path}`);
  }

  console.log(
    "\nOrphan is a claim about attention, not about correctness, and a file referenced only from a commit message reads as an orphan here.",
  );
}

main();
