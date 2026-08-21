#!/usr/bin/env node
/**
 * serve_shot , serve an already-rendered scratch directory plus public/ on one
 * origin, so the Playwright MCP can navigate to it.
 *
 * WHY THIS AND NOT scripts/shoot.mjs. `shoot.mjs` re-renders the HOMEPAGE as its
 * first step and takes no route argument, so it cannot serve a page that is
 * already on disk. Every non-homepage route therefore has to render itself, then
 * compile, then serve, and the serve half was being re-improvised each time.
 * This is that half, extracted, and nothing else: it renders nothing and
 * compiles nothing, so it can never overwrite the render you are trying to look
 * at. That is the whole point of it being a separate file.
 *
 * ONE ORIGIN, TWO ROOTS. The markup asks for `/spine/_skyline.jpeg` at an
 * absolute path and `file:` is blocked in the browser tools, so the scratch
 * render and the real `public/` have to answer on the same host and port.
 *
 * Usage:  node scripts/serve_shot.mjs <dir> [port] [entryFile]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, normalize, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const DIR = resolve(process.argv[2] ?? join(ROOT, "scratchpad", "shoot"));
const PORT = Number(process.argv[3] ?? 8899);
const ENTRY = process.argv[4] ?? "home.html";

const ROOTS = [DIR, join(ROOT, "public")];
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  let p = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (p === "/") p = "/" + ENTRY;
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
  console.log("  serving " + ROOTS.map((r) => r.replace(ROOT, ".")).join("  then  "));
  console.log("  URL     http://127.0.0.1:" + PORT + "/");
  if (!existsSync(join(DIR, ENTRY))) console.log("  !! " + ENTRY + " missing from " + DIR);
});
