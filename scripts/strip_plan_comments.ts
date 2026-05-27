/**
 * scripts/strip_plan_comments.ts
 *
 * Architecture-audit strategy H (2026-05-27).
 *
 * Mechanical sweep that strips project-management vocabulary from
 * source comments while preserving the substantive engineering
 * reasoning that follows. Audit found 500+ comment sites in src/
 * tagged with "Plan v15 Block 8b", "Plan v32 Sprint G", "ATO Phase 6",
 * "v34 Phase C", etc. These tags carry no information for a
 * newcomer and are noise once the original ticket is gone.
 *
 * Transformations (each on a single comment line):
 *   "Plan v25 Block 1 — derived profit fields..."
 *     → "Derived profit fields..."
 *   "ATO Phase 6 — turnover band classification..."
 *     → "Turnover band classification..."
 *   "Plan v32 hotfix. Founder reported..."
 *     → "Founder reported..."
 *   "v34 Phase C — calculator result panel..."
 *     → "Calculator result panel..."
 *   "Plan v3.0 §M (flags) + §O (cross-pivots)."
 *     → (whole line stripped if nothing substantive remains)
 *
 * Preservation rules:
 *   - lines like "v34 Phase G reverted: ..." keep "Reverted: ..."
 *     (the date/revert info is engineering-substantive)
 *   - if stripping leaves <8 chars of text, drop the comment line
 *     entirely (it was pure PM noise) unless the line is part of a
 *     JSDoc block, in which case the line becomes ` *` to keep the
 *     block well-formed
 *   - real data terminology like "NUTS-3", "NAICS-6", "AA.6 staleness"
 *     is preserved (no leading "Plan v")
 *
 * Run: npx tsx scripts/strip_plan_comments.ts [--dry-run]
 * Exit 0 = success. Without --dry-run, files are modified in place.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = ["src/lib", "src/app", "src/components"];
const DRY = process.argv.includes("--dry-run");

/**
 * Matches the PM-tag prefix of a comment.
 *
 * The prefix starts with one of the recognised PM vocabulary anchors
 * (Plan vN, ATO Phase N, v34 Phase X, Sprint X) and runs up to (and
 * including) the first separator that introduces the substantive
 * content.
 *
 * Recognised separators (strict): em-dash, en-dash, " - " (single
 * hyphen with surrounding spaces), or ": ". A bare hyphen is NOT a
 * separator because hyphenated PM-tag words exist (e.g.
 * "Plan v26 follow-up", "Plan v32 hotfix", "Plan v24 A.5 drift fix").
 *
 * Inside the tag body, we allow letters, digits, dots, spaces, §, +,
 * comma, parens, and hyphens (so multi-word tags like
 * "Block 8b", "Phase C.4", "Wave 4a (D2)", "follow-up" all consume
 * cleanly).
 */
const PM_PREFIX_RE =
  /^(?<lead>\s*(?:\/\/|\*\*?|\/\*\*?)\s*)(?<tag>(?:Plan\s+v\d+(?:\.\d+)?|ATO\s+Phase\s+\d+|v3[0-9]\s+Phase\s+[A-Z]\d?|Sprint\s+[A-Z]\d?(?!\w))(?:[\w.§+,()\-\s]*?))\s*(?<sep>[—–]|\s-\s|:\s|:$)\s*/;

/**
 * Matches an "ATO Phase N" or "Phase N" prefix on a comment line
 * where the line starts with a recognised PM anchor but no Plan-vN
 * (e.g. "// ATO Phase 6 — stamp the turnover band ...").
 * Covered by PM_PREFIX_RE above; kept here as documentation.
 */

type FileChange = {
  file: string;
  before: number;
  after: number;
  stripped: number;
  dropped: number;
};

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === "dist") continue;
      walk(full, files);
    } else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx"))) {
      files.push(full);
    }
  }
  return files;
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  const m = s.match(/^([^A-Za-z]*)([a-z])(.*)$/s);
  if (!m) return s;
  return m[1] + m[2].toUpperCase() + m[3];
}

/**
 * Transform a single line. Returns:
 *  - { kind: "unchanged" } if no PM pattern matched
 *  - { kind: "stripped", line } if the PM prefix was removed
 *  - { kind: "dropped" } if the whole line should be removed
 *    (nothing substantive remained)
 */
function transformLine(
  line: string,
): { kind: "unchanged" } | { kind: "stripped"; line: string } | { kind: "dropped" } {
  const m = line.match(PM_PREFIX_RE);
  if (!m || !m.groups) return { kind: "unchanged" };
  const lead = m.groups.lead;
  const rest = line.slice(m[0].length);

  // If the line is "// Plan v..." with no substantive trailing content,
  // drop it entirely. We detect this by looking at what survived.
  const trimmedRest = rest.trim();
  // Strip a trailing "*/" block-end if present so a one-line /** comment
  // remaining empty becomes a drop candidate.
  const restNoEnd = trimmedRest.replace(/\*\/\s*$/, "").trim();

  if (restNoEnd.length < 6) {
    // Pure PM line. Drop it entirely.
    return { kind: "dropped" };
  }

  // Reconstruct: comment marker + (capitalized) substantive content.
  // Preserve closing "*/" if it was at end of line.
  const closing = trimmedRest.match(/\*\/\s*$/)?.[0] ?? "";
  const body = restNoEnd;
  const rebuilt = lead + capitalizeFirst(body) + (closing ? " " + closing : "");
  return { kind: "stripped", line: rebuilt };
}

const changes: FileChange[] = [];
const droppedLinesByFile = new Map<string, number[]>();
let totalStripped = 0;
let totalDropped = 0;

for (const target of TARGETS) {
  const abs = path.resolve(ROOT, target);
  const files = walk(abs);
  for (const file of files) {
    const text = fs.readFileSync(file, "utf-8");
    const lines = text.split(/\r?\n/);
    const out: string[] = [];
    let stripped = 0;
    let dropped = 0;
    const drops: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const result = transformLine(lines[i]);
      if (result.kind === "unchanged") {
        out.push(lines[i]);
      } else if (result.kind === "stripped") {
        out.push(result.line);
        stripped++;
      } else {
        // dropped — skip
        dropped++;
        drops.push(i + 1);
      }
    }

    if (stripped === 0 && dropped === 0) continue;
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    changes.push({
      file: rel,
      before: lines.length,
      after: out.length,
      stripped,
      dropped,
    });
    droppedLinesByFile.set(rel, drops);
    totalStripped += stripped;
    totalDropped += dropped;
    if (!DRY) {
      // Preserve trailing newline if original had one.
      const newText = out.join("\n") + (text.endsWith("\n") ? "" : "");
      fs.writeFileSync(file, newText, "utf-8");
    }
  }
}

console.log("=== strip_plan_comments ===");
console.log(`  Mode: ${DRY ? "dry-run (no writes)" : "in-place edits"}`);
console.log(`  Files touched: ${changes.length}`);
console.log(`  Lines stripped (prefix removed): ${totalStripped}`);
console.log(`  Lines dropped (pure PM noise): ${totalDropped}`);
console.log("");

if (changes.length > 0) {
  // Sort by impact, show top 25.
  changes.sort((a, b) => b.stripped + b.dropped - (a.stripped + a.dropped));
  console.log("  Top 25 files by impact:");
  for (const c of changes.slice(0, 25)) {
    console.log(
      `    ${c.file.padEnd(60)} stripped=${c.stripped}  dropped=${c.dropped}`,
    );
  }
}

console.log("");
console.log("  Done.");
