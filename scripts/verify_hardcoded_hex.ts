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
 * ZERO_BASELINE_FILES (2026-07-12, four-gates task): this gate's ROOTS
 * scan is recursive over ALL of src/app + src/components, so it already
 * structurally covered src/components/home/home2-view.tsx and
 * src/components/NavigatorForm.tsx , there was no separate "file set" to
 * extend the way verify_no_bold_display / verify_bar_budget have one.
 * What those two home files DID lack is the zero-tolerance treatment: the
 * baseline mechanism grandfathers whatever hex existed at the last
 * `--update-baseline` run for EVERY file uniformly, spine surfaces
 * included, so a home file could accumulate hex and, once baselined,
 * silently escape scrutiny forever. ZERO_BASELINE_FILES below forces the
 * allowed count to 0 for exactly these two files regardless of what the
 * committed baseline JSON says (and strips them from what a future
 * `--update-baseline` writes), closing that escape hatch for the home
 * surface specifically. Today both files hold zero hex, so this is a
 * no-op guard, not a new failure; it prevents one appearing ungated later.
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
const ZERO_BASELINE_FILES = new Set([
  "src/components/home/home2-view.tsx",
  "src/components/NavigatorForm.tsx",
]);

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
    // ZERO_BASELINE_FILES never get written into the baseline, so a future
    // reseed can never grandfather hex into these two home files.
    const toWrite: Record<string, number> = {};
    for (const [file, n] of Object.entries(counts)) {
      if (ZERO_BASELINE_FILES.has(file)) continue;
      toWrite[file] = n;
    }
    writeFileSync(BASELINE, JSON.stringify(toWrite, null, 2) + "\n");
    console.log(`Baseline written: ${Object.keys(toWrite).length} files with hex.`);
    if (ZERO_BASELINE_FILES.size > 0) {
      console.log(`  (${ZERO_BASELINE_FILES.size} zero-baseline file(s) excluded from the baseline: ${[...ZERO_BASELINE_FILES].join(", ")})`);
    }
    return;
  }

  const baseline: Record<string, number> = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, "utf8"))
    : {};

  const violations: string[] = [];
  for (const [file, n] of Object.entries(counts)) {
    const allowed = ZERO_BASELINE_FILES.has(file) ? 0 : (baseline[file] ?? 0);
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
