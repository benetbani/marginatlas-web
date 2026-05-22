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
  | "tiny-tap-target";

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

  // 1. Fixed px widths in arbitrary value classes
  // e.g. w-[800px], min-w-[1200px], style={{ width: "1024px" }}
  const fixedPx = /(?:w-|min-w-|max-w-)\[(\d+)px\]/.exec(line);
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

  // 2. Large text (text-5xl/6xl/7xl etc.) with NO smaller-text base or
  // explicit mobile variant on the same className. The common safe
  // pattern is `text-4xl md:text-6xl` — base (mobile) is small, larger
  // for desktop. Warn only when the large size has no smaller text-N
  // partner on the same line.
  const largeTxt = /\btext-([5-9])xl\b/.exec(line) || /\btext-([1-9]\d)xl\b/.exec(line);
  if (largeTxt) {
    // Any smaller text-Nxl, text-Nrm, text-base, text-sm, text-xs on
    // the same line counts as a mobile base. (Order: text-xs < text-sm <
    // text-base < text-lg < text-xl < text-2xl < text-3xl < text-4xl.)
    const hasSmallerBase =
      /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl)\b/.test(line) ||
      /\b(sm|xs):text-/.test(line);
    if (!hasSmallerBase) {
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
