/**
 * scripts/verify_rendered_design.mjs , THE DESIGN LINTER, rendered driver.
 *
 * audit_mockup.mjs points the linter at the frozen file:// mockups. This points
 * the SAME pass (scripts/lib/design_linter.mjs) at the rendered React routes.
 *
 * Why it exists: the mockups were beaten to zero blockers over four review
 * rounds. Nothing carries that standard into the port. A React kit can
 * reintroduce every defect the design run removed , white text on a light
 * fill, a card with 90px of dead space, six terracotta marks in one chapter,
 * an href="#" , and the mockup gate will still print green, because the
 * mockups did not change. This is the gate that stops country #2 doing that.
 *
 * ---------------------------------------------------------------------------
 * IT NEEDS A SERVER. Two ways, and it will never quietly do neither:
 *
 *   ATTACH (default)   a dev server is already running; point at its port.
 *       npm run dev -- -p 3410
 *       node scripts/verify_rendered_design.mjs --port 3410
 *
 *   SERVE              the gate starts one itself and kills it afterwards.
 *       node scripts/verify_rendered_design.mjs --serve --port 3410
 *       (slower: a cold Next dev server compiles each route on first hit)
 *
 * If nothing answers on the port and --serve was not passed, this FAILS with
 * instructions. An unreachable page has not passed; it was never looked at.
 * ---------------------------------------------------------------------------
 *
 * Routes: every src/app/dev/spine2* catalog page, discovered at run time so the
 * list cannot go stale. Override for real pages:
 *   node scripts/verify_rendered_design.mjs /gb/london/restaurants /gb/london
 *   ROUTES="/gb/london/restaurants,/gb/london" node scripts/verify_rendered_design.mjs
 *
 * Options:  --port <n>  --serve  --width <n>  --json  --timeout <ms>
 *
 * Writes design/loop/audit-rendered/<route>-<width>.json.
 * Exit 1 on any BLOCKER, or if any route could not be rendered. MAJOR and
 * MINOR print as warnings: they are the queue, not the gate.
 *
 * NOT wired into prebuild. It drives a browser and a dev server, which is
 * minutes, not seconds; prebuild is a per-build gate. Run it in CI and before
 * a ship:  npm run verify:rendered
 */
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { spawn, execSync } from "node:child_process";
import net from "node:net";

import { INPAGE, findChrome, formatReport, tally } from "./lib/design_linter.mjs";

const OUT = "E:/atlas/design/loop/audit-rendered";

/* ------------------------------------------------------------------ args -- */
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const PORT = Number(flag("--port", process.env.PORT || 3410));
const SERVE = argv.includes("--serve");
const jsonOnly = argv.includes("--json");
const NAV_TIMEOUT = Number(flag("--timeout", 90000));
const widthArg = flag("--width", null);
const WIDTHS = widthArg ? [Number(widthArg)] : [1440, 390];
const BASE = `http://127.0.0.1:${PORT}`;

const positional = argv.filter((a, i) => !a.startsWith("--") && !["--port", "--width", "--timeout"].includes(argv[i - 1]));

function discoverCatalogRoutes() {
  const dir = "src/app/dev";
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((d) => d.startsWith("spine2"))
    .sort()
    .map((d) => `/dev/${d}`);
}

const ROUTES = positional.length
  ? positional
  : process.env.ROUTES
    ? process.env.ROUTES.split(",").map((s) => s.trim()).filter(Boolean)
    : discoverCatalogRoutes();

if (!ROUTES.length) {
  console.error("x verify_rendered_design: no routes to check. A gate with nothing to look at has not passed.");
  process.exit(1);
}

const exe = findChrome();
if (!exe) { console.error("x verify_rendered_design: no Chrome found. Set CHROME_EXE."); process.exit(1); }

/* ---------------------------------------------------------------- server -- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Is anything listening? A raw TCP connect, NOT an HTTP request: fetching "/"
 *  asks a dev server to compile the heaviest page on the site, and a cold
 *  compile is slower than any sane health-check timeout. Next binds the port
 *  when it is ready to serve; routes compile on demand under the nav timeout. */
function alive(timeoutMs = 2000) {
  return new Promise((resolve) => {
    const sock = net.connect({ port: PORT, host: "127.0.0.1" });
    const done = (v) => { sock.destroy(); resolve(v); };
    sock.setTimeout(timeoutMs);
    sock.once("connect", () => done(true));
    sock.once("timeout", () => done(false));
    sock.once("error", () => done(false));
  });
}

let server = null;
async function startServer() {
  console.log(`starting a dev server on ${PORT} (--serve)...`);
  server = spawn("npm", ["run", "dev", "--", "-p", String(PORT)], {
    shell: process.platform === "win32",
    env: { ...process.env, BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (b) => { if (/error/i.test(b.toString())) process.stdout.write("  dev: " + b.toString()); });
  server.stderr.on("data", (b) => process.stdout.write("  dev! " + b.toString()));
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    if (await alive()) { console.log("dev server is up.\n"); return true; }
    await sleep(1500);
  }
  return false;
}
/** Only ever kills a server THIS process started. On Windows `npm run dev`
 *  is cmd -> npm -> node and the node child outlives a tree-kill often enough
 *  that the port stays held, so the port itself is the second thing checked. */
function stopServer() {
  if (!server) return;
  const pid = server.pid;
  server = null;
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGTERM");
    }
  } catch { /* already gone */ }
  if (process.platform !== "win32") return;
  try {
    const out = execSync(`netstat -ano -p tcp`, { encoding: "utf8" });
    const stuck = [...new Set(out.split("\n")
      .filter((l) => l.includes(`:${PORT} `) && l.includes("LISTENING"))
      .map((l) => l.trim().split(/\s+/).pop()))];
    for (const p of stuck) {
      if (/^\d+$/.test(p)) { try { execSync(`taskkill /pid ${p} /T /F`, { stdio: "ignore" }); } catch { /* gone */ } }
    }
  } catch { /* nothing to reap */ }
}

if (!(await alive())) {
  if (SERVE) {
    if (!(await startServer())) {
      stopServer();
      console.error(`x verify_rendered_design: the dev server never answered on ${BASE}.`);
      process.exit(1);
    }
  } else {
    console.error(
      `x verify_rendered_design: nothing is answering on ${BASE}.\n` +
      `  Start one:   npm run dev -- -p ${PORT}\n` +
      `  Or let the gate do it:   node scripts/verify_rendered_design.mjs --serve --port ${PORT}\n` +
      `  A page that was never rendered has NOT passed.`,
    );
    process.exit(1);
  }
}

/* ---------------------------------------------------------------- driver -- */
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
const ALL = [];
const unrendered = [];

/* Dev-server noise that is not a page defect. Fonts and images are aborted by
 * this gate itself (see the route handler), so their failures are ours. */
const NOISE = /React DevTools|Fast Refresh|Failed to load resource|net::ERR_FAILED|net::ERR_ABORTED|favicon|hot-update|webpack-hmr|\[Fast Refresh\]/i;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const tab = await ctx.newPage();
    const errors = [];
    tab.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    tab.on("console", (m) => { if (m.type() === "error" && !NOISE.test(m.text())) errors.push(m.text()); });
    // Everything off-origin is aborted: this box cannot reach Google Fonts, and
    // waiting on them is what hangs a capture. Glyph metrics shift; computed
    // colour, geometry and overflow do not.
    await tab.route("**/*", (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));

    const load = async () => {
      errors.length = 0;
      await tab.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await tab.waitForFunction(() => document.body && document.body.innerText.trim().length > 40, { timeout: NAV_TIMEOUT });
      await tab.waitForTimeout(900);
      return tab.evaluate(INPAGE);
    };

    let res = null, navError = null;
    try {
      res = await load();
    } catch (e) {
      navError = String(e).split("\n")[0].slice(0, 200);
    }
    /* A cold dev server serves a chunk mid-write often enough to throw one
       "Invalid or unexpected token" that never reproduces. A defect survives a
       reload; a compile race does not. One retry, and only the second reading
       counts. */
    if (!res || errors.length) {
      try {
        const again = await load();
        if (again) { res = again; navError = null; }
      } catch (e) {
        if (!res) navError = String(e).split("\n")[0].slice(0, 200);
      }
    }
    await ctx.close();

    if (!res) {
      // An errored route has NOT passed. It could not be measured, so it cannot
      // be clean. Counting it as a failure stops a broken page printing green.
      unrendered.push(`${route} @ ${width}px , ${navError ?? "no result"}`);
      ALL.push({ route, width, when: new Date().toISOString(), error: navError, findings: [{ sev: "BLOCKER", code: "NO-RENDER", section: "page", msg: navError ?? "the route produced nothing" }], stats: {} });
      continue;
    }
    for (const e of errors) res.findings.push({ sev: "BLOCKER", code: "JS-ERROR", section: "page", msg: e });

    const report = { route, width, when: new Date().toISOString(), ...res };
    writeFileSync(`${OUT}/${route.replace(/^\//, "").replace(/\//g, "-") || "root"}-${width}.json`, JSON.stringify(report, null, 2), "utf8");
    ALL.push(report);
  }
}
await browser.close();
stopServer();

/* ---------------------------------------------------------------- report -- */
const total = { BLOCKER: 0, MAJOR: 0, MINOR: 0 };
for (const r of ALL) {
  const t = tally(r.findings);
  for (const k of Object.keys(total)) total[k] += t[k];
}

if (jsonOnly) {
  console.log(JSON.stringify({ total, unrendered, reports: ALL }, null, 2));
} else {
  for (const r of ALL) console.log(formatReport(r, `${r.route} @ ${r.width}px`));
  console.log(`\n${"=".repeat(74)}`);
  console.log(`TOTAL   ${total.BLOCKER} blocker   ${total.MAJOR} major   ${total.MINOR} minor   over ${ROUTES.length} routes x ${WIDTHS.length} widths`);
  if (total.MAJOR || total.MINOR) {
    console.log(`        ${total.MAJOR} major and ${total.MINOR} minor are WARNINGS: the queue, not the gate.`);
  }
  if (unrendered.length) {
    console.log(`\nROUTES THAT DID NOT RENDER (counted as failures):`);
    for (const u of unrendered) console.log("  x " + u);
  }
  console.log(`reports ${OUT}\n`);
}
process.exit(total.BLOCKER > 0 ? 1 : 0);
