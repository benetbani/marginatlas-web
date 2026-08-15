/**
 * verify_no_internal_notes - prebuild gate for v34 sanity sweep §1 #8.
 *
 * Fails the build if any user-visible source file contains:
 *   - "Cloned from X" (the auto_dealers/auto_dealers_gas split note
 *     visible on production today)
 *   - "Wave Nb" / "Wave 4b split"
 *   - bare TODO / FIXME / XXX / HACK / DEBUG strings in JSX text
 *
 * These patterns are fine in CODE COMMENTS but must never reach the
 * rendered DOM. The script walks src/ AND data/ AND public/ for any
 * .ts .tsx .json .md file that could be string-interpolated into a
 * page.
 *
 * Per-line opt-out: append `// allow-internal-note` to a line. Use
 * only when the match is provably non-rendered (e.g. a doc-string).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const PROJECT_ROOT = process.cwd();
const SCAN_DIRS = ["src", "data"].map((d) => resolve(PROJECT_ROOT, d));

// Patterns that should never appear in JSX text or in a data file
// whose contents get rendered. Each entry is a [label, regex].
// XXX and DEBUG are too noisy (XXX is also an ISO3 placeholder code,
// DEBUG can be a legitimate config name). Stick to the actual leaked
// engineering markers the founder reported plus TODO/FIXME.
const FORBIDDEN: Array<[string, RegExp]> = [
  ["clone-note", /Cloned from\s+\w+/],
  ["wave-note", /Wave\s+\d+[a-z]?\s+split/i],
  ["bare-todo", /\bTODO\b/],
  ["bare-fixme", /\bFIXME\b/],
  /* OPERATIONAL PROSE, added 2026-08-09, and the four patterns above are why it
     was needed. They catch leftover MARKERS, and the leak was a whole sentence
     of perfectly grammatical English describing this project's plumbing:

       "No coverage data on disk for Afghanistan yet: run the coverage audit
        to refresh."

     It shipped on 66 of 195 live coverage pages, 34% of them, every one
     declared in the sitemap. Nothing flagged it, because it contains no marker
     and reads like copy.

     The test is not tone, it is ADDRESSEE. A reader has no disk to check and no
     audit to run, so a sentence telling them to do either was written for
     somebody else and left in. */
  ["ops-run-the", /\brun the [a-z ]{3,20}(audit|script|job|pipeline|sync|import|export)\b/i],
  ["ops-on-disk", /\b(on|to) disk\b/i],
  ["ops-rerun", /\bre-?run (the|this)\b/i],
  ["ops-regenerate", /\bregenerate (the|this)\b/i],
];

type Hit = { file: string; line: number; text: string; label: string };

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      /* Skip build output. "coverage" USED TO BE IN THIS LIST and it was the
         real reason the leak shipped.

         It was meant to skip the vitest coverage report. That directory is
         <root>/coverage, and this walk only ever starts at src/ and data/, so
         the entry never protected anything. What it DID do is match by NAME at
         any depth, silently skipping three directories of real source:

           src/app/(site)/coverage   the 195 public scorecard pages
           src/lib/coverage
           data/coverage

         So the "run the coverage audit to refresh" sentence on 66 live pages
         was never scanned by the gate that exists to catch it. The gate
         reported PASS for months, correctly, about files it had not read.

         Matching a build directory by bare name is the bug. If the vitest
         report ever needs skipping, skip it by PATH from the root. */
      if (name === "node_modules" || name === ".next") continue;
      walk(p, acc);
    } else if (
      p.endsWith(".tsx") ||
      p.endsWith(".ts") ||
      p.endsWith(".json")
    ) {
      acc.push(p);
    }
  }
  return acc;
}

/**
 * Strip comments from one line, carrying block state across lines.
 *
 * WHY THIS REPLACED A startsWith() TEST. The old check asked whether a line
 * BEGAN with a comment marker, so it understood the first line of a block
 * comment and none of the rest. This repo writes long multi-line comments
 * almost exclusively, which meant every continuation line was scanned as if it
 * were rendered text. The moment the gate could finally see the coverage page,
 * it reported four leaks and all four were prose inside the comment that
 * documented the real leak.
 *
 * A false positive there is not cosmetic. The next person's cheapest way out is
 * // allow-internal-note on the line, and a gate people routinely silence stops
 * being a gate.
 *
 * Returns the CODE half of the line, so an inline `// note` and a `/* ... *\/`
 * span both disappear while real JSX text on the same line survives.
 */
function stripComments(line: string, state: { inBlock: boolean }): string {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (state.inBlock) {
      const end = line.indexOf("*/", i);
      if (end === -1) return out;
      state.inBlock = false;
      i = end + 2;
      continue;
    }
    const lineComment = line.indexOf("//", i);
    const blockOpen = line.indexOf("/*", i);
    if (blockOpen !== -1 && (lineComment === -1 || blockOpen < lineComment)) {
      out += line.slice(i, blockOpen);
      state.inBlock = true;
      i = blockOpen + 2;
      continue;
    }
    if (lineComment !== -1) return out + line.slice(i, lineComment);
    return out + line.slice(i);
  }
  return out;
}

function isAllowed(line: string): boolean {
  return line.includes("allow-internal-note");
}

/**
 * Independently enumerate every App Router page/route file under src/app.
 *
 * This exists to check the CHECKER. The gate spent months reporting PASS about
 * a directory its own skip list quietly removed, and nothing could notice,
 * because the only record of what got scanned was the scan itself.
 *
 * So this enumeration deliberately does NOT share walk()'s skip logic. A
 * self-test that inherits the bug it is testing for is not a test. The only
 * directories skipped here are node_modules and .next, neither of which can
 * contain a route the reader reaches.
 *
 * The invariant: every public page must appear in the scanned set. If a future
 * skip rule hides a route again, this fails loudly and names it, on the day the
 * rule is written rather than after it ships.
 */
function routeFiles(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) routeFiles(p, acc);
    else if (name === "page.tsx" || name === "route.ts") acc.push(p);
  }
  return acc;
}

const hits: Hit[] = [];

const scanned = new Set(SCAN_DIRS.flatMap((d) => walk(d)));
const unseen = routeFiles(resolve(PROJECT_ROOT, "src", "app")).filter(
  (f) => !scanned.has(f),
);
if (unseen.length > 0) {
  console.error(
    `[verify_no_internal_notes] FAIL: the scan is blind to ` +
      `${unseen.length} App Router file(s). Something in walk() is skipping ` +
      `real source, so a PASS from this gate would not mean anything:`,
  );
  for (const f of unseen) console.error(`  ${f.replace(PROJECT_ROOT, ".")}`);
  process.exit(1);
}

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    let src: string;
    try {
      src = readFileSync(file, "utf-8");
    } catch {
      continue;
    }
    const lines = src.split("\n");
    const isSource = file.endsWith(".ts") || file.endsWith(".tsx");
    // Block-comment state runs the length of the FILE, not the line.
    const state = { inBlock: false };
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      // Advance the comment state even on skipped lines, or an opt-out inside
      // a block comment would leave the parser stuck mid-comment.
      const line = isSource ? stripComments(raw, state) : raw;
      if (isAllowed(raw)) continue;
      if (!line.trim()) continue;

      /* THE ADMIN SURFACE IS ADDRESSED TO A DEVELOPER ON PURPOSE, so the
         operational-prose rules do not apply there. /admin is disallowed in
         robots.txt and exists to be operated; "No scan report on disk. Run ..."
         is correct copy for its actual reader.

         Scoped rather than dropped: the first run of the ops rules flagged six
         lines and every one was in /admin, which would have made a real rule
         look like noise. The marker rules (TODO, FIXME, clone notes) still apply
         everywhere, because a leftover marker is a leftover marker. */
      const isAdminSurface = file.replace(/\\/g, "/").includes("/admin/");

      for (const [label, regex] of FORBIDDEN) {
        if (isAdminSurface && label.startsWith("ops-")) continue;
        if (regex.test(line)) {
          hits.push({
            file: file.replace(PROJECT_ROOT, "."),
            line: i + 1,
            // Report the RAW line: the reader needs to find it in the file.
            text: raw.trim().slice(0, 160),
            label,
          });
        }
      }
    }
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_no_internal_notes] PASS: no internal notes leaking into ` +
      `user-visible source across ${SCAN_DIRS.join(", ")}`,
  );
  process.exit(0);
}

console.error(
  `[verify_no_internal_notes] FAIL: ${hits.length} internal-note ` +
    `leak(s) found:`,
);
for (const h of hits) {
  console.error(`  [${h.label}] ${h.file}:${h.line}: ${h.text}`);
}
console.error(
  `\nTo opt a single line out, append // allow-internal-note (use only ` +
    `when the match is provably non-rendered).`,
);
process.exit(1);
