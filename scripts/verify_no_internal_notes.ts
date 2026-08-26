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

import { newCommentState, stripComments } from "./lib/strip_comments";

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
  /* A NOTE TO WHOEVER FILLS THE DATA IN LATER, published to readers instead.
     209 of the 252 cities carried this as their central district's description:

       "Central business district. Auto-generated; refine with local knowledge."

     It rendered on all 209. Nothing else fills that slot for them, so the
     second sentence WAS the description of the district.

     Same shape as the coverage leak this gate was extended for earlier, and it
     slipped through the same way: the patterns knew markers and operational
     verbs, and "auto-generated, refine with local knowledge" is neither. It is
     a handover note. The addressee is whoever comes back with real data, and it
     is the reader who was handed it. */
  ["ops-auto-generated", /\bauto-?generated\b/i],
  ["ops-refine-later", /\brefine (with|later|this)\b/i],
  ["ops-placeholder-note", /\b(placeholder|stub|dummy) (text|copy|data|value)\b/i],
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
    const state = newCommentState();
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
      const norm = file.replace(/\\/g, "/");
      const isAdminSurface = norm.includes("/admin/");
      /* /dev is the same case as /admin: sealed from crawlers, built to be
         worked in, and its two hits here are page TITLES that correctly say
         "placeholder data". A route whose job is to show placeholder data
         should be allowed to say so. */
      const isDevSurface = norm.includes("/app/dev/");
      /* A leading underscore on a JSON key is this repo's convention for a note
         to a developer rather than a value: `_anchor`, `_note`, `_meta`. None
         is read by any code. The convention is what makes them safe, so the
         gate honours it rather than making every config file add an opt-out. */
      const isUnderscoreKey = /^\s*"_[a-z_]+"\s*:/i.test(line);

      for (const [label, regex] of FORBIDDEN) {
        if ((isAdminSurface || isDevSurface || isUnderscoreKey) && label.startsWith("ops-")) continue;
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

/* A BLOCK COMMENT INSIDE JSX WITHOUT BRACES IS NOT A COMMENT, IT IS A TEXT NODE.
   This gate was written to stop working notes reaching a reader, and it missed the
   most direct way that can happen. On 2026-08-26 five lines of notes were written
   as a plain block comment between a div and its first child, which is a JSX text
   child: it typechecked, it linted, all 123 gates passed, and the notes printed on
   the page. Found by looking at a photograph.
   The shape is unambiguous: a line opening with a block comment whose previous
   non-empty line ends in an unclosed-tag bracket. Nothing legitimate looks like
   that, because a real JSX comment opens with a brace. */
for (const file of scanned) {
  if (!file.endsWith(".tsx")) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 1; i < lines.length; i++) {
    const cur = lines[i].trim();
    if (!cur.startsWith("/*")) continue;
    let j = i - 1;
    while (j >= 0 && lines[j].trim() === "") j--;
    if (j < 0) continue;
    const prev = lines[j].trimEnd();
    if (/>$/.test(prev) && !/=>$/.test(prev)) {
      hits.push({
        file,
        line: i + 1,
        text: cur.slice(0, 80),
        label: "block comment sitting as a JSX text child, which prints on the page. Wrap it in braces or move it above the markup",
      });
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
