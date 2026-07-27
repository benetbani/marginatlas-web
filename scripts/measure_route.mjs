/**
 * scripts/measure_route.mjs , cold-load weight and stability for a route.
 *
 * The UX budget (design/loop2/UX-STANDARD.md section 8) is stated in bytes and
 * layout shift, so it has to be measured in bytes and layout shift, not
 * inferred from file sizes on disk , a dev server serves uncompressed, a build
 * serves compressed, and the difference is the whole question.
 *
 *   node scripts/measure_route.mjs --port 3450 /dev/spine2-serverb
 *
 * Reports transferred vs decoded bytes per resource class, the client JS total,
 * cumulative layout shift, and the largest contentful paint element.
 * Windows note: pass routes with MSYS_NO_PATHCONV=1 under Git Bash.
 */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const PORT = Number(flag("--port", 3450));
const WIDTH = Number(flag("--width", 390));
const routes = argv.filter((a, i) => !a.startsWith("--") && !["--port", "--width"].includes(argv[i - 1]));
if (!routes.length) { console.error("no route given"); process.exit(1); }

const exe = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => existsSync(p));
if (!exe) { console.error("no chrome"); process.exit(1); }

const kb = (n) => (n / 1024).toFixed(1) + "KB";
const classOf = (url, type) => {
  if (/\.(woff2?|ttf|otf)(\?|$)/i.test(url) || type === "font") return "font";
  if (/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(url) || type === "image") return "image";
  if (/\.css(\?|$)/i.test(url) || type === "stylesheet") return "css";
  if (/\.js(\?|$)/i.test(url) || type === "script") return "js";
  if (type === "document") return "html";
  return "other";
};

const browser = await chromium.launch({ executablePath: exe, headless: true });

for (const route of routes) {
  // A COLD load: fresh context, no cache, no service worker carry-over.
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 844 },
    deviceScaleFactor: 2,
    bypassCSP: false,
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });

  const res = new Map();
  page.on("response", async (r) => {
    try {
      const req = r.request();
      const h = await r.allHeaders();
      const enc = Number(h["content-length"] || 0);
      res.set(r.url(), {
        cls: classOf(r.url(), req.resourceType()),
        transferred: enc,
        url: r.url(),
      });
    } catch {}
  });

  const t0 = Date.now();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(2500); // let fonts settle and any shift land
  const loadMs = Date.now() - t0;

  // Decoded sizes + web vitals from the page itself.
  const perf = await page.evaluate(async () => {
    const entries = performance.getEntriesByType("resource").map((e) => ({
      url: e.name,
      decoded: e.decodedBodySize || 0,
      transferred: e.transferSize || 0,
    }));
    const nav = performance.getEntriesByType("navigation")[0];
    let cls = 0;
    for (const e of performance.getEntriesByType("layout-shift") || []) {
      if (!e.hadRecentInput) cls += e.value;
    }
    const lcp = performance.getEntriesByType("largest-contentful-paint").pop();
    return {
      entries,
      docDecoded: nav ? nav.decodedBodySize : 0,
      docTransferred: nav ? nav.transferSize : 0,
      cls,
      lcpMs: lcp ? Math.round(lcp.startTime) : null,
      lcpEl: lcp && lcp.element ? lcp.element.tagName + (lcp.element.className ? "." + String(lcp.element.className).split(" ")[0] : "") : null,
      domNodes: document.getElementsByTagName("*").length,
    };
  });

  const byClass = {};
  let totalT = 0, totalD = 0;
  const add = (cls, t, d) => {
    byClass[cls] = byClass[cls] || { t: 0, d: 0, n: 0 };
    byClass[cls].t += t; byClass[cls].d += d; byClass[cls].n++;
    totalT += t; totalD += d;
  };
  add("html", perf.docTransferred, perf.docDecoded);
  for (const e of perf.entries) {
    const cls = res.get(e.url)?.cls ?? classOf(e.url, "");
    add(cls, e.transferred, e.decoded);
  }

  console.log(`\n${"=".repeat(72)}\n${route}  @ ${WIDTH}px  cold, cache disabled\n${"=".repeat(72)}`);
  console.log("class      files   transferred     decoded");
  for (const [c, v] of Object.entries(byClass).sort((a, b) => b[1].t - a[1].t)) {
    console.log(`  ${c.padEnd(8)} ${String(v.n).padStart(4)}   ${kb(v.t).padStart(10)}  ${kb(v.d).padStart(10)}`);
  }
  console.log(`  ${"TOTAL".padEnd(8)} ${String(perf.entries.length + 1).padStart(4)}   ${kb(totalT).padStart(10)}  ${kb(totalD).padStart(10)}`);
  console.log(`\nload ${loadMs}ms   LCP ${perf.lcpMs ?? "n/a"}ms (${perf.lcpEl ?? "n/a"})   CLS ${perf.cls.toFixed(4)}   DOM ${perf.domNodes} nodes`);

  const B = { total: 900 * 1024, js: 300 * 1024, cls: 0.1 };
  const verdict = [];
  if (totalT > B.total) verdict.push(`TOTAL ${kb(totalT)} over the ${kb(B.total)} budget`);
  if ((byClass.js?.t ?? 0) > B.js) verdict.push(`JS ${kb(byClass.js.t)} over ${kb(B.js)}`);
  if (perf.cls > B.cls) verdict.push(`CLS ${perf.cls.toFixed(3)} over ${B.cls}`);
  console.log(verdict.length ? "\nOVER BUDGET: " + verdict.join(" | ") : "\nwithin budget");

  await ctx.close();
}
await browser.close();
