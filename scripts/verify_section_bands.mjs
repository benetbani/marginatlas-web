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
 * TIGHTENED 2026-08-25 BY THE FOUNDER, same day, after seeing the first count:
 * "for every subsection that stretches left to right full width, I think we
 * should ban it except hero section."
 *
 * So there is no wide-form exemption any more. A four-column table, a seven-row
 * strip and a map are not licences to take the whole width; they are forms that
 * have to be REDESIGNED to fit a half, or promoted to the hero. Only the hero is
 * exempt, and a page has exactly one.
 *
 * A section declares itself the hero with data-hero="1". Nothing else counts,
 * because "it looked like a hero" is how thirty-nine of them got there.
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
      hero: !!c.closest("[data-hero='1']"),
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
    }));
});

const now = {};
let total = 0;
for (const { name, result } of counts) {
  const bad = result.filter((s) => !s.hero);
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
