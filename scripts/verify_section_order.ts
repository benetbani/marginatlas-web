/**
 * verify_section_order - prebuild gate (data activation 2026-05-30, sub-project 1.3).
 *
 * Enforces the canonical per-level page skeleton: every page must render its
 * `<section id="...">` blocks in the order registered in
 * src/lib/page-layout/section-order.ts (PAGE_SECTION_ORDER).
 *
 * The check is a SUBSEQUENCE test, not equality: a page may legitimately omit
 * sections whose data is absent (they self-suppress), so the rendered ids must
 * appear in the canonical list in the same relative order, with no unregistered
 * id and no out-of-order id. This is what makes "a skeleton respected by all
 * entries or modifications" mechanically true instead of a convention.
 *
 * Some sections are rendered by COMPONENTS rather than a literal
 * <section id=> (e.g. the hero via DenseCellHero, city-character via
 * <CityCharacter>). Those are allowed to be absent from the literal scan; the
 * gate only validates the ORDER and MEMBERSHIP of the literal <section id=>
 * blocks that ARE present.
 *
 * Run: npx tsx scripts/verify_section_order.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PAGE_SECTION_ORDER } from "../src/lib/page-layout/section-order";

type PageCheck = {
  level: keyof typeof PAGE_SECTION_ORDER | string;
  file: string;
};

// Map each page file to its canonical level. Paths are relative to the
// website root. The [geo] page serves both region and city slugs, so it is
// checked against the region list (city === region today).
const PAGES: PageCheck[] = [
  { level: "cell", file: "src/app/[country]/[geo]/[industry]/page.tsx" },
  { level: "country", file: "src/app/[country]/page.tsx" },
  { level: "region", file: "src/app/[country]/[geo]/page.tsx" },
  { level: "industry", file: "src/app/(site)/industries/[industry]/page.tsx" },
];

/**
 * Extract <section id="..."> ids in source order, collapsing CONSECUTIVE
 * duplicates. A page commonly renders the same section id in both branches of
 * a ternary (`hasData ? <section id="hero">A : <section id="hero">B`); only one
 * renders at runtime, so two adjacent identical ids are one logical section,
 * not an out-of-order repeat. Non-adjacent duplicates are still surfaced (they
 * indicate a genuinely repeated section).
 */
function renderedSectionIds(source: string): string[] {
  const ids: string[] = [];
  const re = /<section[^>]*\sid="([a-z0-9-]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (ids[ids.length - 1] !== m[1]) ids.push(m[1]);
  }
  return ids;
}

/**
 * Is `rendered` a subsequence of `canonical`? Returns the first offending id
 * (unregistered or out-of-order) or null if it is a valid subsequence.
 */
function firstViolation(rendered: string[], canonical: readonly string[]): string | null {
  let cursor = 0;
  for (const id of rendered) {
    const idx = canonical.indexOf(id, cursor);
    if (idx === -1) {
      // Either not in the canonical list at all, or it appears earlier than
      // cursor (out of order).
      return canonical.includes(id)
        ? `${id} (out of order)`
        : `${id} (not registered for this level)`;
    }
    cursor = idx + 1;
  }
  return null;
}

let failures = 0;
for (const { level, file } of PAGES) {
  const canonical = PAGE_SECTION_ORDER[level];
  if (!canonical) {
    console.error(`✗ ${file}: no canonical order registered for level "${level}"`);
    failures++;
    continue;
  }
  let source: string;
  try {
    source = readFileSync(resolve(process.cwd(), file), "utf-8");
  } catch {
    console.error(`✗ ${file}: cannot read (path changed?)`);
    failures++;
    continue;
  }
  const rendered = renderedSectionIds(source);
  if (rendered.length === 0) {
    // A dispatcher page that delegates entirely to components is allowed to
    // have no literal sections; warn so it is visible but do not fail.
    console.log(`• ${level.padEnd(9)} ${file}: no literal <section id=> (component-rendered) — skipped`);
    continue;
  }
  const violation = firstViolation(rendered, canonical);
  if (violation) {
    console.error(
      `✗ ${level.padEnd(9)} ${file}\n` +
        `    rendered:  [${rendered.join(", ")}]\n` +
        `    canonical: [${canonical.join(", ")}]\n` +
        `    violation: ${violation}`,
    );
    failures++;
  } else {
    console.log(`✓ ${level.padEnd(9)} ${file}: [${rendered.join(", ")}]`);
  }
}

if (failures > 0) {
  console.error(`\n✗ verify_section_order: ${failures} page(s) violate the canonical skeleton.`);
  console.error(
    "  Each page's <section id=> blocks must be a subsequence of its level's list",
  );
  console.error("  in src/lib/page-layout/section-order.ts (PAGE_SECTION_ORDER).");
  process.exit(1);
}
console.log("\n✓ verify_section_order: all pages respect the canonical skeleton.");
