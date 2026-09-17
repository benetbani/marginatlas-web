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
 * WHAT IT READS (plan step 14b, 2026-09-17): the six fresh spine renders of
 * scripts/lib/page_renders.mjs, written by the pages-fresh gate at the head of
 * the chain; before that, four snapshots frozen on 2026-09-08. The baseline
 * keeps its old keys (cell-london-restaurants for the harness's
 * cell-gb-london-restaurants, country-gb-new for country-GB), which the module
 * maps; the line printed first says what was read and how old it was.
 *
 * Usage: node scripts/verify_section_bands.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage, renderEntries, describeRenders, nameWithKey, missingLine } from "./lib/measure_pages.mjs";
import { requireBrowser } from "./lib/local_only.mjs";

/* A BUILD SERVER HAS NO BROWSER. This gate photographs real pages, so it cannot
   run where chromium is not installed, and trying killed a production deploy on
   2026-08-27. It skips loudly there and runs unchanged on the design machine. */
await requireBrowser("section-bands", "whether every section sits in a declared band");

const BASELINE = "scripts/section_bands_baseline.json";
const RULE = "section-bands";

const entries = renderEntries();
console.log(`  ${describeRenders(entries, RULE)}`);
const missing = entries.filter((e) => !e.exists);

const counts = await eachPage(1440, () => {
  /* Card definition repointed 2026-09-08, fix wave Finding 2. The glass is
     gone, so `backdropFilter !== "none"` was false everywhere and this gate
     used to find zero cards while reporting success. Repointed at the
     harness's own single definition of a card
     (scripts/harness/check_page_holes.mjs): a `main [class*="rounded-[14px]"]`
     element with client rects, not nested inside another one. */
  const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter(
    (c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'),
  );
  const outer = cards;
  return outer
    .filter((c) => c.getBoundingClientRect().width > 1000)
    .map((c) => ({
      hero: !!c.closest("[data-hero='1']"),
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
    }));
});

const now = {};
let total = 0;
for (const entry of counts) {
  const bad = entry.result.filter((s) => !s.hero);
  now[entry.key] = bad.length;
  total += bad.length;
  if (bad.length) {
    console.log(`\n  ${nameWithKey(entry)}: ${bad.length} full-width section(s) with no wide form`);
    bad.forEach((s) => console.log(`     "${s.label}"`));
  }
}
console.log(`\n  ${total} full-width sections that could be paired.\n`);
for (const m of missing) console.log(missingLine(RULE, m));

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
if (missing.length) {
  console.log(`x verify_section_bands: ${missing.length} listed render(s) could not be read, so the count above is of the pages that were.`);
  process.exit(1);
}
console.log("PASS verify_section_bands.\n");
