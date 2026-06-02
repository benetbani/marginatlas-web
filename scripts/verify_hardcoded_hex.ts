/**
 * scripts/verify_hardcoded_hex.ts
 *
 * Prebuild gate. Blocks NEW hardcoded hex color literals in src/app and
 * src/components .tsx files. Uses a committed baseline snapshot
 * (scripts/hardcoded_hex_baseline.json) so the existing offenders stay
 * green and only regressions fail. Tokenize new color via
 * src/lib/design-tokens.ts instead of inlining a hex.
 *
 * Excludes the image/icon routes that legitimately generate raw color.
 *
 * Run:     npx tsx scripts/verify_hardcoded_hex.ts
 * Reseed:  npx tsx scripts/verify_hardcoded_hex.ts --update-baseline
 *          (only when an excluded or genuinely-needed file changes; never
 *           to silence a real new literal in a normal component)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const ROOTS = ["src/app", "src/components"];
const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const BASELINE = "scripts/hardcoded_hex_baseline.json";

// Routes that render raster images or icons inherently carry raw color.
function excluded(p: string): boolean {
  return (
    p.includes("/og/") ||
    p.endsWith("icon.tsx") ||
    p.endsWith("apple-icon.tsx") ||
    p.endsWith("opengraph-image.tsx")
  );
}

function tsxFiles(): string[] {
  const out: string[] = [];
  for (const root of ROOTS) {
    if (!existsSync(root)) continue;
    for (const rel of readdirSync(root, { recursive: true }) as string[]) {
      const p = `${root}/${String(rel).replace(/\\/g, "/")}`;
      if (p.endsWith(".tsx") && !excluded(p)) out.push(p);
    }
  }
  return out;
}

function scan(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of tsxFiles()) {
    const m = readFileSync(f, "utf8").match(HEX);
    if (m && m.length) counts[f] = m.length;
  }
  return counts;
}

function main(): void {
  const counts = scan();

  if (process.argv.includes("--update-baseline")) {
    writeFileSync(BASELINE, JSON.stringify(counts, null, 2) + "\n");
    console.log(`Baseline written: ${Object.keys(counts).length} files with hex.`);
    return;
  }

  const baseline: Record<string, number> = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, "utf8"))
    : {};

  const violations: string[] = [];
  for (const [file, n] of Object.entries(counts)) {
    const allowed = baseline[file] ?? 0;
    if (n > allowed) violations.push(`  ${file}: ${n} hex (baseline ${allowed})`);
  }

  if (violations.length) {
    console.error("verify_hardcoded_hex: new hardcoded hex found:");
    console.error(violations.join("\n"));
    console.error("\nTokenize via src/lib/design-tokens.ts. If genuinely intended:");
    console.error("  npx tsx scripts/verify_hardcoded_hex.ts --update-baseline");
    process.exit(1);
  }

  console.log(
    `verify_hardcoded_hex: PASS (no new hex; ${Object.keys(counts).length} files baselined).`,
  );
}

main();
