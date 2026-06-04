// scripts/shot_preview.mjs
// Screenshot a REMOTE Vercel preview, sending the protection-bypass header so
// protected previews open for automation. Browser UA so the app middleware
// does not 451/403 us. Full-page PNG into screens/.
//
// Usage:
//   BYPASS=<secret> node scripts/shot_preview.mjs <baseUrl> <route> [--mobile]
import { chromium } from "playwright";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const baseUrl = positional[0];
const route = positional[1] || "/";
const mobile = args.includes("--mobile");
const token = process.env.BYPASS || "";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const viewport = mobile
  ? { width: 390, height: 844 }
  : { width: 1280, height: 900 };

mkdirSync("screens", { recursive: true });
const ctx = await chromium.launchPersistentContext(
  join(tmpdir(), "pw-atlas-preview-msedge"),
  {
    channel: "msedge",
    viewport,
    userAgent: UA,
    args: ["--no-first-run", "--no-default-browser-check"],
    extraHTTPHeaders: token ? { "x-vercel-protection-bypass": token } : {},
  },
);
const page = ctx.pages()[0] || (await ctx.newPage());
const url = baseUrl.replace(/\/$/, "") + route;
try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
} catch {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
}
await page.waitForTimeout(1500);
const slug =
  (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_")) +
  (mobile ? "_m" : "");
const out = join("screens", slug + ".png");
await page.screenshot({ path: out, fullPage: true });
console.log("saved " + out);
await ctx.close();
