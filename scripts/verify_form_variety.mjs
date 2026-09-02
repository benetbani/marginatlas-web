#!/usr/bin/env node
/**
 * verify_form_variety , THE CHECK THAT WOULD HAVE CAUGHT THE SLOP.
 *
 * On 2026-09-01 the founder rejected ten trade sections built as the same
 * horizontal track: "in all sections you have just used this horizontal bar
 * with the points in between... you have overused it like crazy." Every one of
 * the project's other checks passed on that page, because all of them test
 * RULES (is this size legal, is this colour legal, is this figure honest) and
 * none tests SAMENESS. Ugliness of this exact kind was invisible to the whole
 * suite.
 *
 * The cause was in the law itself: FORM-CATALOG v1 capped the "bar family" at
 * three per page and declared the "dot and marker family" free, while eight of
 * that family's nine entries were a horizontal track with markers on it. So the
 * law forbade repeating bars and licensed unlimited look-alikes. Catalogue v2
 * replaced the family budget with a budget on the VISUAL IDEA, and this gate is
 * what makes that budget real rather than advisory.
 *
 * HOW A FORM DECLARES ITSELF. Every catalogue form carries data-idea="I1".."I10"
 * on its outermost element. A budget cannot be enforced by looking at a shape,
 * because a shape is exactly what a machine cannot see; it is enforced by the
 * form naming its own idea, the same way data-hero and data-wide-table already
 * work for the width law.
 *
 * WHAT IT CANNOT SEE, SAID BEFORE IT IS QUOTED: it counts only what is TAGGED.
 * An untagged drawing is invisible to it, so the untagged count is printed on
 * every run rather than hidden, and it is a debt, not a pass. This check cannot
 * distinguish "no forms on this page" from "no forms tagged on this page",
 * which is why the tagged total is always reported beside the caps.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireBrowser } from "./lib/local_only.mjs";

const PAGES_DIR = "docs/loop/artifacts/final-pages";
const CATALOG = "E:/atlas/rules/FORM-CATALOG.md";

/* The caps come from the catalogue, PARSED, never retyped: a cap that lives in
   two files diverges, and this project has paid for that ten different ways. */
function readCaps() {
  if (!existsSync(CATALOG)) return null;
  const md = readFileSync(CATALOG, "utf8");
  const caps = new Map();
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(I\d+)\s*\|[^|]*\|[^|]*\|\s*\*{0,2}(\d+|unlimited)\*{0,2}\s*\|/);
    if (m) caps.set(m[1], m[2] === "unlimited" ? Infinity : parseInt(m[2], 10));
  }
  return caps.size > 0 ? caps : null;
}

const caps = readCaps();
if (!caps) {
  console.log("SKIPPED form-variety");
  console.log("  missing here: the catalogue's visual-idea table (" + CATALOG + ")");
  console.log("  NOT CHECKED: whether any page repeats one visual idea past its cap.");
  process.exit(0);
}

await requireBrowser("form-variety", "whether any page repeats one visual idea past its cap");
const { chromium } = await import("playwright");

const pages = existsSync(PAGES_DIR)
  ? readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"))
  : [];
if (pages.length === 0) {
  console.log("SKIPPED form-variety: no rendered pages to read.");
  process.exit(0);
}

const browser = await chromium.launch();
const failures = [];
let totalTagged = 0;
for (const file of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
    await page.goto(pathToFileURL(resolve(PAGES_DIR, file)).href);
  const measured = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll("[data-idea]")) {
      const k = el.getAttribute("data-idea");
      out[k] = (out[k] || 0) + 1;
    }
    /* PER-CARD CONCENTRATION, added 2026-09-02 after loop run 6 rendered three
       BenchmarkPairs in one card and found the page budget could not see it:
       I9 is uncapped, and it is rightly uncapped, because every card on the site
       carries figures. The fault was never "this page has many figures", it was
       "this ONE CARD repeats one shape three times", which is the founder's
       original complaint at card scale. Three focal figures in one card is
       three claimants and no answer, and the badges rag because each starts
       where its own figure ends.
       A card is the bordered box the kit draws; matching on the radius plus a
       border is how every other rendered-design gate here finds one. */
    const crowded = [];
    for (const card of document.querySelectorAll('[class*="rounded-[14px]"][class*="border"]')) {
      const inner = {};
      for (const el of card.querySelectorAll("[data-idea]")) {
        /* only the card's OWN forms, not a nested card's */
        if (el.closest('[class*="rounded-[14px]"][class*="border"]') !== card) continue;
        const k = el.getAttribute("data-idea");
        inner[k] = (inner[k] || 0) + 1;
      }
      for (const [k, n] of Object.entries(inner)) {
        if (n >= 3) {
          const kicker = (card.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
          crowded.push({ idea: k, n, kicker });
        }
      }
    }
    return { counts: out, crowded };
  });
  const counts = measured.counts;
  for (const c of measured.crowded) {
    failures.push(
      `${file}: one card repeats ${c.idea} ${c.n} times ("${c.kicker}"). A page budget cannot see this, because the crowding is inside a single card; three of one shape in one card is three claimants and no answer.`,
    );
  }
  await page.close();
  for (const [idea, n] of Object.entries(counts)) {
    totalTagged += n;
    const cap = caps.get(idea);
    if (cap === undefined) {
      failures.push(`${file}: declares an idea the catalogue does not list: ${idea}.`);
    } else if (n > cap) {
      failures.push(
        `${file}: ${idea} appears ${n} times, cap is ${cap}. This is the sameness the founder rejected; give one of them its own form from the catalogue's index.`,
      );
    }
  }
}
await browser.close();

console.log(`  ${totalTagged} tagged form(s) across ${pages.length} page(s).`);
console.log("  NOT CHECKED, loudly: any drawing without a data-idea attribute is invisible here.");
if (failures.length) {
  console.log("x verify_form_variety: a page repeats one visual idea past its cap.");
  failures.forEach((f) => console.log("     " + f));
  process.exit(1);
}
console.log("PASS verify_form_variety. No page exceeds a visual-idea cap.");
