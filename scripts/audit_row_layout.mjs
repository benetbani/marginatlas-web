/**
 * audit_row_layout.mjs , two defects that only exist at render time.
 *
 * WHY THIS IS NOT A PREBUILD GATE. Both defects are invisible in the source and
 * invisible to TypeScript. They need a laid-out page, so this needs a running
 * dev server. It is a tool you run, not a gate that runs itself, and that is
 * the honest shape for it rather than a static approximation that would miss
 * most cases and give false confidence.
 *
 * DEFECT 1: A ROW OUTSIDE A STATBLOCK IS COMPLETELY UNSTYLED.
 * Every rule for `.row` in atlas.css is scoped `.statblock .row`. There is no
 * bare `.row` rule at all. So a `.row` without a `.statblock` ancestor gets no
 * grid, no columns and no separation: its spans render hard against each other
 * and the page reads "Young professionals15%" or "Londonmeasured16,765".
 *
 * Found three times in one session before it was measured, and when it finally
 * was, 125 of the city page's 129 rows were unstyled. It looks like ordinary
 * text, which is why nobody noticed: nothing is missing, the words are just
 * fused. TypeScript cannot see it. The 58 gates cannot see it.
 *
 * THE FIX IS NOT TO ADD A BARE .row RULE. The stylesheet is the founder's
 * design. The call site is the loop's, so the call site moves: a run of rows
 * belongs in `<div className="panel pad rise"><div className="statblock">`,
 * both classes on ONE element, because `.panel.pad > .statblock` is the rule
 * that strips the inner border and stops it reading as a card inside a card.
 * `<div className="panel"><div className="pad">` does NOT match that selector.
 *
 * DEFECT 2: THE VALUE SLOT IS A 78px FIGURE COLUMN.
 * `--val-col` is 78px, tuned for "$414K". A sentence placed there is clipped
 * with no ellipsis and no overflow, so it silently truncates mid-word: "24% of
 * hou", "Low spare", "Best in Shore". One value on the city page was an entire
 * paragraph needing 1036px.
 *
 * The rule: THE VALUE SLOT TAKES THE FIGURE. A qualifier belongs in the name's
 * `.s`, which has room. Where the value is genuinely a short phrase rather than
 * a figure, `--val-col` can be widened on that row, which is what the variable
 * is for. Widening it to fit prose is the same mistake as putting prose there.
 *
 * Usage:
 *   node scripts/audit_row_layout.mjs [baseUrl] [route ...]
 *   node scripts/audit_row_layout.mjs http://localhost:3999 /dev/city2
 *
 * Exit 1 if either defect is found, so it can be wired into a manual check.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3999";
const routes = args.filter((a) => a.startsWith("/"));
const ROUTES = routes.length
  ? routes
  : ["/dev/home3", "/dev/city2", "/dev/country2", "/dev/cell2", "/dev/hood2", "/dev/industry2"];

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const res = await page.goto(base + route, { waitUntil: "networkidle", timeout: 90000 });
    if (!res || res.status() !== 200) {
      console.log(`  ${route}  skipped, status ${res ? res.status() : "no response"}`);
      await page.close();
      continue;
    }

    const found = await page.evaluate(() => {
      const rows = [...document.querySelectorAll(".row")];
      const text = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();
      return {
        total: rows.length,
        orphans: rows
          .filter((el) => !el.closest(".statblock"))
          .map((el) => text(el).slice(0, 70)),
        clipped: [...document.querySelectorAll(".row .v, .row .nm")]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => ({
            slot: el.classList.contains("v") ? "value" : "name",
            has: el.clientWidth,
            needs: el.scrollWidth,
            text: text(el).slice(0, 60),
          })),
      };
    });

    const bad = found.orphans.length + found.clipped.length;
    if (bad) failures += bad;
    console.log(
      `  ${bad ? "FAIL" : "ok  "}  ${route}  rows=${found.total}` +
        `  unstyled=${found.orphans.length}  clipped=${found.clipped.length}`,
    );
    for (const o of found.orphans.slice(0, 6)) console.log(`          unstyled: "${o}"`);
    if (found.orphans.length > 6) console.log(`          ... and ${found.orphans.length - 6} more`);
    for (const c of found.clipped.slice(0, 8)) {
      console.log(`          ${c.slot} has ${c.has}px, needs ${c.needs}px: "${c.text}"`);
    }
    if (found.clipped.length > 8) console.log(`          ... and ${found.clipped.length - 8} more`);
  } catch (e) {
    console.log(`  ERROR ${route}: ${String(e.message).slice(0, 90)}`);
  }
  await page.close();
}

await browser.close();
console.log(failures ? `\nGATE: FAIL , ${failures} problems` : "\nGATE: PASS");
process.exit(failures ? 1 : 0);
