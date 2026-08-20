/**
 * Plan v24 Block 10 — static accessibility audit.
 *
 * A full a11y audit needs axe-core in a headless browser to detect
 * runtime issues like color contrast, focus traps, and DOM-order vs
 * visual-order divergence. That's out of scope for a 2-3 hour block.
 *
 * This audit substitutes a SOURCE-LEVEL scan for common a11y
 * anti-patterns:
 *
 *   1. <img> tags without alt attribute (decorative images must use
 *      alt="" — empty string, not missing).
 *   2. <button> or <a> elements with no text content and no
 *      aria-label (icon-only buttons need a label).
 *   3. Link text that's purely "click here", "read more", "here",
 *      "link" — confuses screen readers.
 *   4. <input> without an associated <label> or aria-label.
 *
 * Output:
 *   data/audit/a11y_static_v1.json
 *   data/audit/a11y_static_REPORT.md
 *
 * Run: `npx tsx scripts/audit/a11y_static_audit.ts`
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { stripCommentLines } from "../lib/strip_comments";

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const AUDIT_DIR = resolve(ROOT, "data", "audit");

type FindingType =
  | "img-missing-alt"
  | "icon-button-no-label"
  | "vague-link-text"
  | "input-no-label";

type Finding = {
  type: FindingType;
  severity: "warn" | "info";
  file: string;
  line: number;
  snippet: string;
};

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

function classifyLine(
  file: string,
  lineNo: number,
  line: string,
  insideLabel: boolean,
): Finding[] {
  const rel = file.replace(ROOT, ".").replace(/\\/g, "/");
  const out: Finding[] = [];

  /* The private comment check that used to sit here is gone. It was a ninth copy
     of the `isCommentLine` shape catalogued in backlog P0-4, and it is dead now
     that the caller hands this function stripped lines. */

  // 1. <img> without alt= and not inside next/image which has alt prop
  // For Next's <Image> we expect `alt="..."` in props.
  // Match: <img ...> or <Image ...> on the line, check no alt= attribute.
  const imgTag = /<(img|Image)\b([^>]*)>/.exec(line);
  if (imgTag) {
    const attrs = imgTag[2];
    // Match either alt="..." literal or alt={...} expression
    const hasAlt = /\balt\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]+\})/.test(attrs);
    if (!hasAlt) {
      out.push({
        type: "img-missing-alt",
        severity: "warn",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      });
    }
  }

  // 2. Vague link text (full literal string children for an anchor)
  // Match >Click here<, >Read more<, >here<, >link<.
  const vague = /<a\b[^>]*>(?:\s*)(click here|read more|learn more|here|link|click)(?:\s*)</i.exec(line);
  if (vague) {
    out.push({
      type: "vague-link-text",
      severity: "info",
      file: rel,
      line: lineNo,
      snippet: line.trim().slice(0, 160),
    });
  }

  // 3. <input> with no label nearby — heuristic: check no aria-label,
  // no id-with-htmlFor pair on the SAME line.
  const inputTag = /<input\b([^>]*)>/.exec(line);
  if (inputTag) {
    const attrs = inputTag[1];
    const hasAriaLabel = /\baria-label(?:ledby)?\s*=/.test(attrs);
    const hasId = /\bid\s*=/.test(attrs);
    // Hidden inputs and submit/checkbox often labelled by other UI.
    const isHidden = /\btype\s*=\s*["']hidden["']/.test(attrs);
    const isHelper = /\btype\s*=\s*["'](?:submit|reset|button)["']/.test(attrs);
    /* `insideLabel` is the implicit association: `<label><input/>text</label>`
       needs no `id`, no `htmlFor` and no `aria-label`, and it is valid HTML that
       screen readers honour. Without this the audit reported three findings and
       all three were correct code. */
    if (!hasAriaLabel && !hasId && !isHidden && !isHelper && !insideLabel) {
      out.push({
        type: "input-no-label",
        severity: "info",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      });
    }
  }

  // 4. Icon-only buttons (button with className but no children text on same line,
  // no aria-label). Detect <button>{...icon...}</button> pattern.
  //
  // Refined to avoid false positives:
  //   - Multi-line buttons (no </button> on this line) are skipped —
  //     we cannot tell what's inside from this line alone.
  //   - Interpolated children ({foo}) are skipped — the interpolation
  //     might inject a label.
  // Only flag the obvious single-line icon-only button case.
  const btnTag = /<button\b([^>]*)>/.exec(line);
  if (btnTag) {
    const attrs = btnTag[1];
    const hasAriaLabel = /\baria-label(?:ledby)?\s*=/.test(attrs);
    if (!hasAriaLabel) {
      const after = line.slice(btnTag.index + btnTag[0].length);
      const closesOnSameLine = /<\/button>/.test(after);
      const hasInterpolation = /\{[^}]*\}/.test(after);
      if (!closesOnSameLine || hasInterpolation) {
        // We cannot determine inner content reliably; skip rather than
        // surface a false positive.
      } else {
        const visibleText = after.replace(/<[^>]+>/g, "").trim();
        const hasText = /[A-Za-z]{3,}/.test(visibleText);
        if (!hasText) {
        // Likely icon-only button — needs aria-label.
        out.push({
          type: "icon-button-no-label",
          severity: "warn",
          file: rel,
          line: lineNo,
          snippet: line.trim().slice(0, 160),
        });
        }
      }
    }
  }

  return out;
}

function main() {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });

  const files = walk(SRC).filter(
    (f) =>
      !f.includes("node_modules") &&
      !f.includes(".next") &&
      !f.endsWith(".d.ts"),
  );
  console.log(`Scanning ${files.length} source files…\n`);

  const findings: Finding[] = [];
  for (const f of files) {
    const raw = readFileSync(f, "utf-8").split(/\r?\n/);
    /* COMMENTS ARE NOT MARKUP. This audit had no comment handling at all, so a
       `<input>` written inside an explanatory comment counted as a finding. The
       whole file is stripped once, in order, and the code half is what gets
       classified. */
    const lines = stripCommentLines(raw);
    /* IS THIS INPUT INSIDE A `<label>`? `classifyLine` reads ONE line, so it
       structurally could not see a wrapping label on an earlier line, and every
       one of the three findings this audit reported was exactly that: a valid
       implicit association it had no way to observe. Depth is carried across the
       file, and the same-line case is handled by asking whether a `<label` opens
       before the `<input` on that line. */
    let labelDepth = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const opensHere = line.indexOf("<label");
      const inputAt = line.search(/<input\b/);
      const insideLabel =
        labelDepth > 0 || (opensHere !== -1 && inputAt !== -1 && opensHere < inputAt);
      findings.push(...classifyLine(f, i + 1, line, insideLabel));
      labelDepth += (line.match(/<label\b/g) ?? []).length;
      labelDepth -= (line.match(/<\/label>/g) ?? []).length;
      if (labelDepth < 0) labelDepth = 0;
    }
  }

  const counters: Record<FindingType, number> = {
    "img-missing-alt": 0,
    "icon-button-no-label": 0,
    "vague-link-text": 0,
    "input-no-label": 0,
  };
  for (const f of findings) counters[f.type]++;

  console.log("=== Findings ===");
  for (const [k, v] of Object.entries(counters)) {
    console.log(`  ${k.padEnd(24)}: ${v}`);
  }

  writeFileSync(
    join(AUDIT_DIR, "a11y_static_v1.json"),
    JSON.stringify({ counters, findings }, null, 2),
  );

  const byType: Record<FindingType, Finding[]> = {
    "img-missing-alt": [],
    "icon-button-no-label": [],
    "vague-link-text": [],
    "input-no-label": [],
  };
  for (const f of findings) byType[f.type].push(f);

  const md: string[] = [];
  md.push("# Accessibility static audit (Plan v24 Block 10)");
  md.push("");
  md.push(`Generated ${new Date().toISOString()}.`);
  md.push("");
  md.push(`Scanned ${files.length} TS/TSX source files.`);
  md.push("");
  md.push("## Findings");
  md.push("");
  for (const [k, v] of Object.entries(counters)) {
    md.push(`- **${k}**: ${v}`);
  }
  md.push("");
  for (const [type, rows] of Object.entries(byType)) {
    if (rows.length === 0) continue;
    md.push(`## ${type} (${rows.length})`);
    md.push("");
    for (const r of rows.slice(0, 30)) {
      md.push(`- [${r.severity}] \`${r.file}:${r.line}\`  ` + "\n  ```\n  " + r.snippet + "\n  ```");
    }
    if (rows.length > 30) md.push(`- … and ${rows.length - 30} more`);
    md.push("");
  }
  md.push("## Next steps");
  md.push("");
  md.push("This audit only catches static patterns. A full a11y sweep");
  md.push("needs axe-core in a headless browser to detect runtime");
  md.push("issues (color contrast, focus management, DOM order vs");
  md.push("visual order, dynamic ARIA states).");
  md.push("");
  writeFileSync(join(AUDIT_DIR, "a11y_static_REPORT.md"), md.join("\n"));

  console.log(`\n→ ${join(AUDIT_DIR, "a11y_static_v1.json")}`);
  console.log(`→ ${join(AUDIT_DIR, "a11y_static_REPORT.md")}`);

  /* THIS IS A GATE NOW, AND UNTIL 2026-08-20 IT COULD NOT FAIL. The file held no
     `process.exit` at all, so the backlog's instruction to "wire it into
     prebuild" would have added a 105th entry to a chain that already carries five
     checks which cannot go red. A gate that cannot fail is worse than no gate: it
     costs a slot, prints a tick, and buys nothing.

     A HARD FAIL RATHER THAN A RATCHET, and that is only honest because the count
     is genuinely zero. It read three before this commit and all three were
     `<label><input/></label>`, correct code the line-by-line detector could not
     see. With that fixed and comments stripped, every one of the four checks
     reports zero across 696 files, so there is no debt to ratchet down and any
     finding from here is a regression introduced after this line was written.

     NEGATIVE-TESTED, because a check reporting zero because it stopped looking is
     the exact failure this repo keeps meeting. A fixture carrying one real
     violation of each kind plus eight valid patterns was scanned: all four fired,
     none of the eight was reported, and an `<img>` inside a comment was ignored. */
  if (findings.length > 0) {
    console.error(`\nx a11y_static: ${findings.length} finding(s).`);
    for (const f of findings.slice(0, 30)) {
      console.error(`   [${f.type}] ${f.file}:${f.line}\n     ${f.snippet}`);
    }
    if (findings.length > 30) console.error(`   ... and ${findings.length - 30} more`);
    console.error(
      `\n  Fix the markup. An <input> inside its own <label> needs no id or\n` +
        `  aria-label and is not a finding; if this gate says otherwise, the\n` +
        `  detector is wrong and the detector is what to change.\n`,
    );
    process.exit(1);
  }

  console.log(`\n  GATE: PASS  4 checks, 0 findings across ${files.length} files.`);
}

main();
