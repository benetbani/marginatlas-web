/**
 * verify_section_bands , ONE SECTION PER ROW IS THE DEFECT.
 *
 * Founder, 2026-06-18, ratified and then not applied: "bento two-up bands
 * (never one section per row)". Restated 2026-08-25: "there are no sections that
 * should not occupy the full width, and you just slap the full width out of
 * them... the human brain on the desktop cannot just move its eyes from the left
 * to the right."
 *
 * Measured 2026-08-25 at 1440: 28 of 39 sections were a single 1072px card.
 *
 * A section may be full width when it holds a WIDE FORM that cannot be halved: a
 * comparison table with four or more columns, a ranked strip with seven or more
 * rows, or a map. Those are counted separately and are not the defect.
 *
 * BLIND SPOT: this counts what RENDERS at 1440. It cannot tell a section that is
 * full width by design from one that is full width by neglect. That is what the
 * allowlist below is for, and every entry in it names its form.
 *
 * Usage: node scripts/verify_section_bands.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/section_bands_baseline.json";

const counts = await eachPage(1440, () => {
  const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
  return outer
    .filter((c) => c.getBoundingClientRect().width > 1000)
    .map((c) => ({
      cols: c.querySelectorAll("thead th, thead td").length,
      rows: c.querySelectorAll("tbody tr, ol > li").length,
      hasMap: !!c.querySelector("[aria-label='District map'], canvas"),
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
    }));
});

const wide = (s) => s.cols >= 4 || s.rows >= 7 || s.hasMap;
const now = {};
let total = 0;
for (const { name, result } of counts) {
  const bad = result.filter((s) => !wide(s));
  now[name] = bad.length;
  total += bad.length;
  if (bad.length) {
    console.log(`\n  ${name}: ${bad.length} full-width section(s) with no wide form`);
    bad.forEach((s) => console.log(`     "${s.label}"`));
  }
}
console.log(`\n  ${total} full-width sections that could be paired.\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_section_bands: full-width sections GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log("PASS verify_section_bands.\n");
