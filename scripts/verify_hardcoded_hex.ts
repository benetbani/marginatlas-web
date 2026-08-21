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

import { newCommentState, stripComments } from "./lib/strip_comments";

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

/**
 * COMMENTS ARE STRIPPED, added 2026-08-16 after this gate failed a file for
 * documenting its own fix.
 *
 * The navigator's submit button was moved off stock Tailwind orange onto the
 * brand ramp, and the comment recording it named the three colours involved,
 * #c2410c, #991600 and #fff1ee, because "a different hue" is an assertion and
 * the numbers are the evidence. This gate counted all four as new hardcoded
 * hex in a component.
 *
 * A hex inside a comment paints nothing. verify_palette_membership already
 * learned this exact lesson and says so in its own source: it flagged
 * atlas-spots-data.ts for a green that appears there once, inside the comment
 * recording that the green was removed. CLAUDE.md carries the general rule,
 * that comment detection belongs in scripts/lib/strip_comments rather than in
 * each gate's own guess.
 *
 * The effect on the ratchet is one-way and safe: stripping can only lower a
 * count, never raise one, so no existing baseline entry can start failing.
 */
function scan(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of tsxFiles()) {
    const state = newCommentState();
    const code = readFileSync(f, "utf8")
      .split("\n")
      .map((line) => stripComments(line, state))
      .join("\n");
    /* A HEX INSIDE AN ATTRIBUTE SELECTOR IS NOT A COLOUR THIS SITE IS SETTING.
       It is a selector MATCHING somebody else's markup so it can be overridden
       with a token. Added 2026-08-21 when the shadcn chart primitive landed: its
       class string carries five, all of the shape

           [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50

       where the hex is the thing being targeted and `stroke-border` is the token
       replacing it. Counting those as hardcoded colour inverted the gate's
       meaning: the line exists precisely BECAUSE the colour is being tokenised.

       Stripped before counting rather than exempting the file, because
       exempting a whole file would hide the next real violation in it, and
       raising the baseline to pass is banned outright. */
    const withoutSelectors = code.replace(/\[[a-zA-Z-]+=['"]#[0-9a-fA-F]{3,8}['"]\]/g, "[]");
    const m = withoutSelectors.match(HEX);
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
