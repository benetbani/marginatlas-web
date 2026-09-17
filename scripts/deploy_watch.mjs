/**
 * WATCH A DEPLOY LAND (plan step 20, 2026-09-17). Polls the live page until
 * the pushed code is what production serves, and never reads an empty fetch
 * as "not yet".
 *
 * usage, from E:/atlas/website:
 *   npm run deploy:watch -- --marker='data-archetype="city-cards"' [--url=/gb] [--minutes=15]
 *
 * The marker is a string the pushed code puts on the page and the previous
 * deploy did not (an archetype attribute, a new id, a new sentence). Each
 * poll prints the time, the byte count and the hit count on one line, so a
 * zero-byte body (a redirect loop, a TLS failure, a 500) shows as bytes=0
 * beside hits=0 and cannot pass for a page that has not changed yet. Exit 0
 * the first time the body is over 10,000 bytes and the marker is on it, with
 * the page's archetype census printed; exit 1 after the deadline with the
 * reason (never seen, or the fetch itself failing), so a shell can notice.
 *
 * The old form was scratchpad/arch/watch_deploy.sh with the marker written
 * into it; this one takes the marker, follows the www redirect itself, and
 * runs on node's TLS, which does not trip this machine's revocation check.
 */
const argv = process.argv.slice(2);
const arg = (k, d) => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const marker = arg("marker", null);
const url = new URL(arg("url", "/gb"), "https://marginatlas.com").href;
const minutes = Number(arg("minutes", "15"));
if (!marker) { console.error("deploy_watch: --marker=<string the new deploy puts on the page> is required"); process.exit(2); }

const deadline = Date.now() + minutes * 60_000;
const stamp = () => new Date().toTimeString().slice(0, 8);
let lastError = null;
for (;;) {
  let body = "";
  try {
    const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000), headers: { "cache-control": "no-cache" } });
    body = await r.text();
    lastError = r.ok ? null : `HTTP ${r.status}`;
  } catch (e) { lastError = e && e.message ? e.message : String(e); }
  const bytes = Buffer.byteLength(body);
  const hits = body.split(marker).length - 1;
  console.log(`${stamp()} bytes=${bytes} hits=${hits}${lastError ? ` (${lastError})` : ""}`);
  if (bytes > 10_000 && hits > 0) {
    console.log(`LIVE: ${url} serves the marker ${marker}`);
    const census = new Map();
    for (const m of body.matchAll(/data-archetype="([a-z-]+)"/g)) census.set(m[1], (census.get(m[1]) ?? 0) + 1);
    for (const [k, v] of [...census].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)} ${k}`);
    process.exit(0);
  }
  if (Date.now() > deadline) {
    console.log(`NOT SEEN after ${minutes} minutes: ${lastError ? `the fetch failed (${lastError})` : "production still serves a page without the marker; the build failed or is still queued"}`);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 45_000));
}
