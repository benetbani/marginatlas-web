/**
 * scripts/crop_sections.mjs
 *
 * Section-level crop renderer + registry sync for the design review loop.
 * Renders ONE dev route, slices it at every h2 boundary (plus the masthead
 * above the first h2), writes one jpeg crop per section, and merges the
 * result into the per-page registry at E:/atlas/design/registry/<page>.json.
 *
 * Usage:  node scripts/crop_sections.mjs <page> [date]
 *         <page> = cell | city | country | industry | hood | home
 *         PREVIEW_PORT env overrides the default :3000.
 *
 * NO DEV SERVER NEEDED FOR THE FOUR SPINE PAGES. It reads the built preview file
 * when one exists and only falls back to localhost when it does not. The founder
 * has said plainly not to run a dev server for his benefit, and the review loop
 * asking for one made the whole loop something nobody would run. Set
 * PREVIEW_PORT to force the server path.
 * Output: E:/atlas/design/crops/<page>/<id>.jpeg + the registry json.
 */
import { chromium } from "playwright-core";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const ROUTES = {
  cell: "/dev/spine-cell",
  city: "/dev/spine-city",
  country: "/dev/spine",
  industry: "/dev/spine-industry",
  hood: "/dev/spine-hood",
  home: "/dev/home2",
};

const page = process.argv[2];
if (!ROUTES[page]) {
  console.error(`Usage: node scripts/crop_sections.mjs <${Object.keys(ROUTES).join("|")}> [date]`);
  process.exit(1);
}
const date = process.argv[3] || new Date().toISOString().slice(0, 10);
const cropDir = `E:/atlas/design/crops/${page}`;
const registryPath = `E:/atlas/design/registry/${page}.json`;

function findChrome() {
  if (process.env.CHROME_EXE && existsSync(process.env.CHROME_EXE)) return process.env.CHROME_EXE;
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
  ];
  for (const c of candidates) if (c && existsSync(c)) return c;
  try {
    // playwright's own cached chromium, if installed
    const list = execSync("npx playwright install --dry-run chromium 2>&1", { encoding: "utf8" });
    const m = /browsers[\\/].*?chrome(?:\.exe)?/i.exec(list);
    if (m) return m[0];
  } catch {}
  return null;
}

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");

/* THE BUNDLED BROWSER IS A FALLBACK, NOT AN ERROR. This exited when no system
   Chrome was installed, which is a machine that can still render perfectly well
   through playwright's own chromium. Every other script in this repository uses
   that one. */
const exe = findChrome();
const browser = exe
  ? await chromium.launch({ executablePath: exe, headless: true })
  : await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const tab = await ctx.newPage();
const BUILT = {
  cell: "docs/loop/artifacts/final-pages/cell-london-restaurants.html",
  city: "docs/loop/artifacts/final-pages/city-london.html",
  industry: "docs/loop/artifacts/final-pages/industry-restaurants.html",
  hood: "docs/loop/artifacts/final-pages/hood-london.html",
};
const builtFile = BUILT[page];
const useBuilt = !process.env.PREVIEW_PORT && builtFile && existsSync(builtFile);
if (useBuilt) {
  await tab.goto(`file:///E:/atlas/website/${builtFile}`, { waitUntil: "load", timeout: 120000 });
  console.log(`  reading the built preview: ${builtFile}`);
} else {
  const PORT = process.env.PREVIEW_PORT || "3000";
  await tab.goto(`http://localhost:${PORT}${ROUTES[page]}`, { waitUntil: "networkidle", timeout: 120000 });
}
await tab.waitForSelector("h2", { timeout: 60000 });
await tab.waitForTimeout(1500); // let streaming + fonts settle

// Section boundaries: masthead = main's top to the first h2; then h2-to-h2; last h2 to main's bottom.
const sections = await tab.evaluate(() => {
  const root = document.querySelector("main") || document.body;
  const r = root.getBoundingClientRect();
  const rootTop = r.top + window.scrollY;
  const rootBottom = r.bottom + window.scrollY;
  const h2s = Array.from(root.querySelectorAll("h2")).map((h) => ({
    heading: (h.innerText || "").trim().replace(/\s+/g, " "),
    top: h.getBoundingClientRect().top + window.scrollY,
  }));
  const out = [{ heading: "Masthead", top: rootTop, height: (h2s[0] ? h2s[0].top : rootBottom) - rootTop }];
  h2s.forEach((h, i) => out.push({ heading: h.heading, top: h.top, height: (h2s[i + 1] ? h2s[i + 1].top : rootBottom) - h.top }));
  return out.filter((s) => s.height >= 40).map((s) => ({ ...s, top: Math.max(0, Math.round(s.top)), height: Math.round(s.height) }));
});

mkdirSync(cropDir, { recursive: true });
mkdirSync("E:/atlas/design/registry", { recursive: true });

// Clamp every clip to the real document bounds: the scrollbar shaves the layout
// width below the viewport's 1280, and a last-section height can overshoot the
// document bottom , either makes page.screenshot throw "outside the image".
const doc = await tab.evaluate(() => ({
  w: document.documentElement.clientWidth,
  h: document.documentElement.scrollHeight,
}));

const rendered = [];
for (let i = 0; i < sections.length; i++) {
  const s = sections[i];
  const id = `${page}-${String(i).padStart(2, "0")}-${slugify(s.heading) || "untitled"}`;
  const y = Math.min(s.top, doc.h - 2);
  const height = Math.max(1, Math.min(s.height, 4000, doc.h - y));
  // fullPage is REQUIRED here: a plain screenshot only accepts clips inside the
  // current viewport; with fullPage the clip addresses page coordinates.
  const buf = await tab.screenshot({
    fullPage: true,
    clip: { x: 0, y, width: Math.min(1280, doc.w), height },
    type: "jpeg",
    quality: 82, // enough fidelity for the taste panel to read composition; weight/hex are judged from SOURCE by the gates, not from the crop
  });
  const cropRel = `design/crops/${page}/${id}.jpeg`;
  writeFileSync(`E:/atlas/${cropRel}`, buf);
  rendered.push({
    id, index: i, heading: s.heading, state: "candidate",
    crop: cropRel, cropHash: createHash("sha1").update(buf).digest("hex"),
    cropApprovedHash: null, verdicts: [], kb: Math.round(buf.length / 1024),
  });
}
await browser.close();

// Registry merge. LOCK RULE: this script never mutates a human decision. An existing
// entry keeps its state, verdicts and cropApprovedHash no matter what re-renders; only
// crop + cropHash refresh. If an entry is "approved" and the fresh cropHash differs from
// the hash that was approved, the visual changed under an approval: that is a lock
// violation, reported and exit 1, never silently absorbed.
const prev = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf8")) : null;
const prevById = new Map((prev?.sections || []).map((e) => [e.id, e]));
const violations = [];
const merged = rendered.map(({ kb, ...fresh }) => {
  const old = prevById.get(fresh.id);
  if (!old) return fresh;
  prevById.delete(fresh.id);
  if (old.state === "approved" && old.cropApprovedHash !== fresh.cropHash) {
    violations.push({ id: fresh.id, approvedHash: old.cropApprovedHash, newHash: fresh.cropHash });
  }
  const kept = { ...old, index: fresh.index, heading: fresh.heading, crop: fresh.crop, cropHash: fresh.cropHash };
  delete kept.stale;
  return kept;
});
for (const old of prevById.values()) merged.push({ ...old, stale: true }); // id no longer renders: keep, mark stale

writeFileSync(registryPath, JSON.stringify({ page, route: ROUTES[page], updated: date, sections: merged }, null, 2), "utf8");

console.log(`\n${page} ${ROUTES[page]}  ${rendered.length} sections  registry ${registryPath}\n`);
console.log(["id".padEnd(48), "state".padEnd(11), "kb".padStart(5), "  heading"].join(""));
for (const e of merged) {
  const kb = rendered.find((r) => r.id === e.id)?.kb;
  const state = e.stale ? "stale" : e.state;
  console.log([e.id.padEnd(48), state.padEnd(11), String(kb ?? "-").padStart(5), "  " + e.heading].join(""));
}
if (violations.length) {
  console.error(`\nLOCK VIOLATIONS (${violations.length}): approved sections whose crop changed`);
  for (const v of violations) console.error(`  ${v.id}: approved ${v.approvedHash} -> new ${v.newHash}`);
  process.exit(1);
}
process.exit(0);
