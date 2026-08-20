#!/usr/bin/env node
/**
 * shoot , render a route, compile its stylesheet, and serve both on one origin,
 * so the next thing an agent does is navigate and look.
 *
 * WHY THIS EXISTS. Backlog P3-8: five render spikes each re-derive the same
 * harness. The recipe is five steps with three documented traps in it, and every
 * tick that wanted a screenshot paid the whole cost again, which is most of why
 * twenty ticks produced no picture of this site. This is the one instrument.
 * It does the parts a script CAN do and stops exactly where the browser begins.
 *
 * IT DELIBERATELY DOES NOT SCREENSHOT. Driving a browser is an MCP tool call,
 * not a shell command, so a script cannot finish the job. Pretending otherwise
 * would mean shipping a "screenshot tool" that never takes one.
 *
 * ================= HOW TO ACTUALLY GET A PICTURE, 2026-08-20 =================
 *
 * THE BROWSER PANE CANNOT DO IT, and this is not a transient fault. Every
 * attempt returns, verbatim:
 *
 *     Screenshot timed out after 5s: the Browser pane is not displayed, so the
 *     page is not compositing frames. Display the pane and retry.
 *
 * A hidden pane composites no frames. `tabs_select` fronts a TAB inside the
 * pane and does not display the pane itself, so it does not help , measured,
 * the error is byte-identical afterwards. Displaying the pane is a host-app UI
 * action only the founder can take. **Do not spend a tick on this again.**
 *
 * THE PLAYWRIGHT MCP CAN. It drives its own browser and has no dependency on
 * pane visibility. `docs/verification-protocol.md` already named it as the
 * sanctioned instrument; nobody had established that the pane was the broken
 * half. Use `mcp__playwright__*`:
 *
 *     browser_resize    1280x900, then 375x812
 *     browser_navigate  the URL this script prints
 *     browser_evaluate  measure through the DOM
 *     browser_take_screenshot   type: "jpeg"   <- jpeg, png has timed out here
 *
 * TWO TRAPS THAT COST TIME, both still live:
 *   - **Screenshots land in `E:\atlas`, the PARENT repo**, not in this one, and
 *     not in the directory you pass to `--filename`. Look there.
 *   - **RELOAD AFTER EVERY RESIZE.** `browser_resize` alone does not re-run
 *     layout the way a fresh load does, and a height measured after a bare
 *     resize is fiction: 12,282px against 32,114px on the same file.
 *
 * ============================================================================
 *
 * Usage:
 *   node scripts/shoot.mjs [outDir] [port]
 *
 * Then navigate to the printed URL with the Playwright MCP.
 */
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdirSync, existsSync } from "node:fs";
import { join, extname, normalize, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const OUT = resolve(process.argv[2] ?? join(ROOT, "scratchpad", "shoot"));
const PORT = Number(process.argv[3] ?? 8899);

mkdirSync(OUT, { recursive: true });

/* FORWARD SLASHES, THEN QUOTE. `path.join` emits `\` on Windows, and a `\` that
   goes through `JSON.stringify` and then a `shell: true` command line is escaped
   twice and unescaped once, so the path arrives corrupted. It fails in a way that
   looks like a tailwind error: non-zero exit, 24 seconds in, with nothing but a
   browserslist warning on stderr. The same command with forward slashes exits 0.
   Every path handed to `run()` goes through here. */
const sh = (p) => JSON.stringify(String(p).replace(/\\/g, "/"));

const run = (label, cmd, args) => {
  process.stdout.write("  " + label.padEnd(28));
  const t = Date.now();
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", shell: true });
  const secs = ((Date.now() - t) / 1000).toFixed(1) + "s";
  if (r.status !== 0) {
    console.log("FAILED  " + secs);
    /* BOTH streams. Tailwind writes its progress to stderr, so a stderr-only
       tail buries the real error under a browserslist warning, which is exactly
       how the path bug above read as an unexplained compile failure. */
    const both = ["--- stdout ---", r.stdout ?? "", "--- stderr ---", r.stderr ?? ""].join("\n");
    console.error(both.split("\n").filter((l) => l.trim()).slice(-14).join("\n"));
    process.exit(1);
  }
  console.log("ok  " + secs);
  return r.stdout ?? "";
};

console.log("=== shoot ===\n  out: " + OUT + "\n");

/* 1. RENDER FIRST. The stylesheet compile must come after, never before:
      Tailwind emits only the classes it can SEE, so a class written after the
      compile emits no rule and the element renders unstyled while looking
      perfectly correct in source. That has cost this project twice. */
run("render route", "npx", [
  "tsx",
  "--env-file=.env.local",
  "--require",
  "./scripts/spikes/stub_next_font.cjs",
  "scripts/spikes/render_home_to_scratch.tsx",
  sh(OUT),
]);

/* 2. Compile the REAL stylesheet with the tailwind CLI, which inlines `@import`
      unlike the project's own postcss config. */
run("compile stylesheet", "npx", [
  "tailwindcss",
  "-i",
  "src/app/globals.css",
  "-o",
  sh(join(OUT, "site.css")),
  "--minify",
]);

/* 3. ONE ORIGIN, TWO ROOTS. The markup asks for `/spine/_skyline.jpeg` at an
      absolute path and `file:` is blocked in the browser tools, so the scratch
      render and the real `public/` have to answer on the same host and port. */
const ROOTS = [OUT, join(ROOT, "public")];
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  let p = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (p === "/") p = "/home.html";
  const safe = normalize(p).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
  for (const root of ROOTS) {
    const file = join(root, safe);
    try {
      if (!(await stat(file)).isFile()) continue;
      res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream" });
      res.end(await readFile(file));
      return;
    } catch { /* next root */ }
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found in any root: " + safe);
}).listen(PORT, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + PORT + "/";
  console.log("\n  serving " + ROOTS.map((r) => r.replace(ROOT, ".")).join("  then  "));
  console.log("  URL     " + url);
  console.log("\n  Next, with the PLAYWRIGHT MCP (the Browser pane cannot screenshot, see header):");
  console.log("    browser_resize 1280x900  ->  browser_navigate " + url + "  ->  browser_take_screenshot type:jpeg");
  console.log("    then resize 375x812 and NAVIGATE AGAIN. A bare resize lies about height.");
  console.log("    the file lands in E:\\atlas, the PARENT repo.\n");
  if (!existsSync(join(OUT, "home.html"))) console.log("  !! home.html missing, the render step lied about succeeding\n");
});
