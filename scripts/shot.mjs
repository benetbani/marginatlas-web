/**
 * shot.mjs — full-page screenshots of local routes via Playwright + system Edge/Chrome.
 *
 * The efficient visual loop: one command screenshots whole pages (no scrolling,
 * no desktop capture) of any route. Uses an ISOLATED profile of the installed
 * Edge/Chrome (own temp user-data-dir) so it never touches your open browser and
 * needs no Chromium download. A real browser UA passes the anti-scraper middleware.
 *
 *   node scripts/shot.mjs /ke/kenya/restaurants /id          # desktop
 *   node scripts/shot.mjs --mobile /ke/kenya/restaurants     # 390px viewport
 *
 * Output: screens/<route>.png  (read it with the Read tool).
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const argv = process.argv.slice(2);
const mobile = argv.includes("--mobile");
const routes = argv.filter((a) => !a.startsWith("--"));
if (routes.length === 0) routes.push("/");

const BASE = "http://localhost:3210";
mkdirSync("screens", { recursive: true });
const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };

let ctx;
for (const channel of ["msedge", "chrome"]) {
  try {
    ctx = await chromium.launchPersistentContext(join(tmpdir(), "pw-atlas-" + channel), {
      channel,
      viewport,
      args: ["--no-first-run", "--no-default-browser-check"],
    });
    console.log("channel:", channel);
    break;
  } catch (e) {
    console.log(`(${channel} unavailable: ${e.message.split("\n")[0]})`);
  }
}
if (!ctx) {
  console.log("no usable browser channel");
  process.exit(1);
}
const page = ctx.pages()[0] || (await ctx.newPage());

for (const route of routes) {
  const slug =
    (route.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root") + (mobile ? "_m" : "");
  const out = `screens/${slug}.png`;
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`OK  ${route} [${resp ? resp.status() : "?"}] -> ${out}`);
  } catch (e) {
    console.log(`ERR ${route}: ${e.message.split("\n")[0]}`);
  }
}
await ctx.close();
