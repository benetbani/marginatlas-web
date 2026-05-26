/**
 * Plan v24 Block 9 — static mobile-responsive audit.
 *
 * A live mobile render audit needs a headless browser to measure
 * layout overflow, tap-target sizes, and font scaling. That's out of
 * scope for a 2-3 hour block.
 *
 * This audit substitutes a SOURCE-LEVEL scan for common mobile
 * anti-patterns:
 *
 *   1. Fixed pixel widths without responsive overrides (w-[800px],
 *      style={{ width: "800px" }}) — likely to overflow on phones.
 *   2. Large text sizes (text-5xl, text-6xl, text-7xl) without a
 *      smaller mobile variant — readable on desktop, off-screen on
 *      mobile.
 *   3. Grid / flex layouts with high column count and no responsive
 *      breakpoint (grid-cols-4, grid-cols-5 without md:/sm: prefix).
 *   4. Tap targets potentially smaller than 44x44 — text-xs buttons,
 *      p-1 / py-0.5 click targets.
 *
 * Output:
 *   data/audit/mobile_static_v1.json
 *   data/audit/mobile_static_REPORT.md
 *
 * Run: `npx tsx scripts/audit/mobile_static_audit.ts`
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const AUDIT_DIR = resolve(ROOT, "data", "audit");

type Severity = "warn" | "info";
type FindingType =
  | "fixed-px-width"
  | "large-text-no-mobile"
  | "high-col-no-breakpoint"
  | "tiny-tap-target"
  | "nowrap-on-content";

type Finding = {
  type: FindingType;
  severity: Severity;
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

function classifyLine(file: string, lineNo: number, line: string): Finding | null {
  const rel = file.replace(ROOT, ".").replace(/\\/g, "/");

  // Skip pure comment lines (JSX or JS comments) — they describe code,
  // they don't render.
  const trimmed = line.trim();
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("{/*")
  ) {
    return null;
  }

  // Skip the typography token registry — it defines the canonical sizes
  // for the rest of the codebase, it's not a use site.
  if (rel.endsWith("/lib/ui/typography.ts")) return null;

  // 1. Fixed px widths in arbitrary value classes
  // e.g. w-[800px], min-w-[1200px], style={{ width: "1024px" }}
  // max-w- is intentionally excluded — it caps width on large screens
  // but lets smaller screens use 100%, so it never breaks mobile.
  const fixedPx = /(?:^|\s)(?:w-|min-w-)\[(\d+)px\]/.exec(line);
  if (fixedPx) {
    const n = parseInt(fixedPx[1], 10);
    if (n > 400) {
      return {
        type: "fixed-px-width",
        severity: "warn",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      };
    }
  }
  const stylePx = /style=\{\s*\{[^}]*width:\s*["']?(\d+)px["']?/.exec(line);
  if (stylePx) {
    const n = parseInt(stylePx[1], 10);
    if (n > 400) {
      return {
        type: "fixed-px-width",
        severity: "warn",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      };
    }
  }

  // 2. Large text (text-5xl/6xl/7xl etc.) where the unprefixed (mobile)
  // base IS the large size. Safe pattern: `text-3xl md:text-5xl` — base
  // is small, larger only on >=md. Warn when the large size appears
  // without a breakpoint prefix AND no smaller base accompanies it.
  // Mobile-only components (path contains /mobile/) are exempt.
  if (!rel.includes("/mobile/")) {
    // Match large sizes that appear WITHOUT a responsive prefix.
    // Find any `text-Nxl` (N>=5) not preceded by `sm:`/`md:`/`lg:`/`xl:`/`2xl:`.
    const largeMatches =
      line.match(/(?<!:)\btext-(?:[5-9]|\d{2,})xl\b/g) || [];
    // Mobile-base sizes that count as a safe small companion.
    const hasSmallerBase =
      /(?<!:)\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl)\b/.test(line);
    if (largeMatches.length > 0 && !hasSmallerBase) {
      return {
        type: "large-text-no-mobile",
        severity: "warn",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      };
    }
  }

  // 3. grid-cols-N with N >= 4 and no responsive prefix on the same class
  const highCols = /\bgrid-cols-([4-9]|1[0-2])\b/.exec(line);
  if (highCols) {
    const hasResponsive = /\b(sm|md|lg|xl):grid-cols-/.test(line);
    const hasMobileCols = /\bgrid-cols-(1|2|3)\b.*\b(sm|md|lg):grid-cols-/.test(
      line,
    );
    if (!hasResponsive && !hasMobileCols) {
      return {
        type: "high-col-no-breakpoint",
        severity: "info",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      };
    }
  }

  // 4. tap targets — buttons with text-xs + p-1 (likely too small)
  // Crude heuristic; the LHS would need real DOM to measure.
  const tinyButton = /<(?:button|a)\b[^>]*className=["'][^"']*\b(text-xs|text-\[10px\]|text-\[11px\])\b[^"']*\b(p-1|py-0\.5|py-1)\b[^"']*["']/.exec(line);
  if (tinyButton) {
    return {
      type: "tiny-tap-target",
      severity: "info",
      file: rel,
      line: lineNo,
      snippet: line.trim().slice(0, 160),
    };
  }

  // 5. whitespace-nowrap on potentially long content. Tolerated when the
  // line also contains `truncate` (clipping is intentional), `tabular-nums`
  // (numbers are short), or small-text (`text-xs`, `text-[10/11px]`).
  // Also tolerated on the canonical button/tabs primitives where the
  // nowrap is the whole point of the variant.
  if (/\bwhitespace-nowrap\b/.test(line)) {
    // Skip when the nowrap class is not actually in a `className` attr —
    // that means it's in a comment or string explanation, not a render.
    if (!/className=/.test(line)) return null;
    const tolerated =
      /\b(truncate|tabular-nums|text-\[10px\]|text-\[11px\]|text-xs)\b/.test(line) ||
      /sr-only/.test(line) ||
      rel.endsWith("/ui/button.tsx") ||
      rel.endsWith("/ui/tabs.tsx");
    if (!tolerated) {
      return {
        type: "nowrap-on-content",
        severity: "info",
        file: rel,
        line: lineNo,
        snippet: line.trim().slice(0, 160),
      };
    }
  }

  return null;
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
    const lines = readFileSync(f, "utf-8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const r = classifyLine(f, i + 1, lines[i]);
      if (r) findings.push(r);
    }
  }

  // Group by type
  const counters: Record<FindingType, number> = {
    "fixed-px-width": 0,
    "large-text-no-mobile": 0,
    "high-col-no-breakpoint": 0,
    "tiny-tap-target": 0,
    "nowrap-on-content": 0,
  };
  for (const f of findings) counters[f.type]++;

  console.log("=== Findings ===");
  for (const [k, v] of Object.entries(counters)) {
    console.log(`  ${k.padEnd(24)}: ${v}`);
  }

  writeFileSync(
    join(AUDIT_DIR, "mobile_static_v1.json"),
    JSON.stringify({ counters, findings }, null, 2),
  );

  const byType: Record<FindingType, Finding[]> = {
    "fixed-px-width": [],
    "large-text-no-mobile": [],
    "high-col-no-breakpoint": [],
    "tiny-tap-target": [],
    "nowrap-on-content": [],
  };
  for (const f of findings) byType[f.type].push(f);

  const md: string[] = [];
  md.push("# Mobile static audit (Plan v24 Block 9)");
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
  md.push("## Severity legend");
  md.push("");
  md.push("- **warn** — likely to break mobile layout. Fix before next mobile sweep.");
  md.push("- **info** — worth a manual check. May be fine in context.");
  md.push("");

  for (const [type, rows] of Object.entries(byType)) {
    if (rows.length === 0) continue;
    md.push(`## ${type} (${rows.length})`);
    md.push("");
    for (const r of rows.slice(0, 25)) {
      md.push(`- [${r.severity}] \`${r.file}:${r.line}\`  ` + "\n  ```\n  " + r.snippet + "\n  ```");
    }
    if (rows.length > 25) md.push(`- … and ${rows.length - 25} more`);
    md.push("");
  }

  md.push("## Next steps");
  md.push("");
  md.push("This audit only catches static patterns. A full mobile sweep");
  md.push("needs a headless-browser probe at 320px / 375px / 414px");
  md.push("viewports to surface layout overflow and text reflow issues");
  md.push("the source scan misses.");
  md.push("");
  writeFileSync(join(AUDIT_DIR, "mobile_static_REPORT.md"), md.join("\n"));

  console.log(`\n→ ${join(AUDIT_DIR, "mobile_static_v1.json")}`);
  console.log(`→ ${join(AUDIT_DIR, "mobile_static_REPORT.md")}`);
}

main();
