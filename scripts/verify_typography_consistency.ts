/**
 * verify_typography_consistency.ts
 *
 * Walks src/app/ and src/components/ for <h1, <h2, <h3 tags with a
 * className. For each, verifies the className contains at least one
 * canonical typography token from src/lib/ui/typography.ts.
 *
 * Headings that intentionally diverge must carry data-typography="custom"
 * on the element OR a /* typography-ok: <reason> *\/ marker on the
 * same line or up to 3 lines above.
 *
 * Visual upgrade §5 (2026-05-26): runs as a prebuild gate (#13).
 *
 * Run: npx tsx scripts/verify_typography_consistency.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { TYPOGRAPHY_TOKENS } from "../src/lib/ui/typography";

const ROOT = process.cwd();
const SCAN_DIRS = [resolve(ROOT, "src/components"), resolve(ROOT, "src/app")];

type Hit = {
  file: string;
  line: number;
  tag: "h1" | "h2" | "h3";
  classNameSnippet: string;
  hasCanonical: boolean;
  hasCustomAttr: boolean;
  hasOkMarker: boolean;
};

function isCodeFile(name: string): boolean {
  return name.endsWith(".tsx") || name.endsWith(".jsx");
}

function walk(dir: string, out: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else if (isCodeFile(name)) out.push(full);
  }
}

function okMarkerReason(lines: string[], lineIdx: number): string {
  const re = /typography-ok\s*:\s*(.+?)(?:\*\/|\*\*\/|$)/i;
  for (let k = 0; k <= 3; k++) {
    const idx = lineIdx - k;
    if (idx < 0) break;
    const m = (lines[idx] || "").match(re);
    if (m) return m[1].trim();
  }
  return "";
}

/**
 * Find <h1, <h2, <h3 occurrences and extract the className value if
 * present. Robust enough for hand-written JSX patterns.
 */
type TagHit = {
  tag: "h1" | "h2" | "h3";
  className: string;
  hasCustomAttr: boolean;
  lineIdx: number;
};

function findHeadings(text: string): TagHit[] {
  const lines = text.split(/\r?\n/);
  const out: TagHit[] = [];
  // Multi-line match: heading tag through to its closing >
  const re = /<(h[123])\b([^>]*)>/gms;
  let m: RegExpExecArray | null;
  const full = lines.join("\n");
  while ((m = re.exec(full)) !== null) {
    const tag = m[1] as "h1" | "h2" | "h3";
    const attrs = m[2];
    const classMatch = attrs.match(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/);
    const className = (classMatch?.[1] ?? classMatch?.[2] ?? classMatch?.[3] ?? "").trim();
    const hasCustomAttr = /data-typography=["']custom["']/i.test(attrs);
    const lineIdx = full.slice(0, m.index).split("\n").length - 1;
    out.push({ tag, className, hasCustomAttr, lineIdx });
  }
  return out;
}

/**
 * Canonical check. For tokens that have a space (multi-word), we
 * require ALL the space-separated parts to appear in the className,
 * not necessarily contiguously. This handles patterns like
 * `font-display mt-3 text-2xl` where utility classes interleave.
 */
function isCanonical(tag: "h1" | "h2" | "h3", className: string): boolean {
  const tokens = TYPOGRAPHY_TOKENS[tag];
  return tokens.some((t) => {
    const parts = t.split(/\s+/).filter(Boolean);
    return parts.every((p) => className.includes(p));
  });
}

const files: string[] = [];
for (const d of SCAN_DIRS) walk(d, files);

const hits: Hit[] = [];
for (const file of files) {
  let text: string;
  try {
    text = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/);
  const headings = findHeadings(text);
  for (const h of headings) {
    // Skip headings with no className at all (e.g. <h2>Simple</h2>).
    // Those are usually intentionally unstyled.
    if (!h.className) continue;
    const hasCanonical = isCanonical(h.tag, h.className);
    const reason = okMarkerReason(lines, h.lineIdx);
    hits.push({
      file: relative(ROOT, file),
      line: h.lineIdx + 1,
      tag: h.tag,
      classNameSnippet: h.className.slice(0, 120),
      hasCanonical,
      hasCustomAttr: h.hasCustomAttr,
      hasOkMarker: reason.length > 0,
    });
  }
}

const violations = hits.filter(
  (h) => !h.hasCanonical && !h.hasCustomAttr && !h.hasOkMarker,
);

if (violations.length > 0) {
  console.error(
    `\nverify_typography_consistency: FAIL with ${violations.length} drift hit(s).`,
  );
  console.error(
    "Heading className does not contain a canonical typography token.",
  );
  console.error(
    "Allow with one of: canonical token, data-typography=\"custom\", or",
  );
  console.error(
    "/* typography-ok: <reason> */ comment up to 3 lines above.\n",
  );
  for (const v of violations.slice(0, 40)) {
    console.error(
      `  ${v.file.replace(/\\/g, "/")}:${v.line} <${v.tag}> "${v.classNameSnippet}"`,
    );
  }
  if (violations.length > 40) {
    console.error(`  ... and ${violations.length - 40} more.`);
  }
  process.exit(1);
}

console.log(
  `verify_typography_consistency: PASS. ${hits.length} headings scanned across ${files.length} files.`,
);
