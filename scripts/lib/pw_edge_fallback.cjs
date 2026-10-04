/**
 * scripts/lib/pw_edge_fallback.cjs , LET THE BROWSER GATES DRIVE THE INSTALLED EDGE WHEN PLAYWRIGHT'S OWN CHROMIUM IS ABSENT.
 *
 * Opt-in, for the design machine only: `NODE_OPTIONS=--require=./scripts/lib/pw_edge_fallback.cjs`. Nothing imports it and no
 * gate changes. Written 2026-10-04 (the UK page reform) because this desktop holds no Playwright browser build
 * (`chromium-1223` is missing, noted in commit 1eab1424), so every browser gate failed to launch here, and downloading a
 * browser needs the founder's word. Edge is installed and is Chromium, so `channel: "msedge"` runs the same engine.
 *
 * WHAT IT DOES: when `chromium.executablePath()` does not exist on disk and Edge does, a `chromium.launch()` call that names
 * neither an `executablePath` nor a `channel` is given `channel: "msedge"`, and `chromium.executablePath()` answers Edge's
 * executable (the harness preflight asks it whether a browser is on disk). A launch that names either is left alone, and on
 * a machine that holds the bundled build nothing changes at all. It prints one line the first time it steps in, so a run
 * that used Edge says so.
 *
 * ITS BLIND SPOT: Edge's build is not the bundled build, so a pixel-exact comparison against photographs taken with the
 * bundled browser can differ by font hinting; the layout gates read boxes and computed styles, which do not.
 */
const fs = require("node:fs");
let pw;
try {
  pw = require("playwright");
} catch {
  pw = null;
}
if (pw && pw.chromium && typeof pw.chromium.launch === "function") {
  const chromium = pw.chromium;
  let bundled = "";
  try {
    bundled = chromium.executablePath();
  } catch {
    bundled = "";
  }
  const EDGE = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => fs.existsSync(p));
  if ((!bundled || !fs.existsSync(bundled)) && EDGE) {
    const launch = chromium.launch.bind(chromium);
    /* The harness preflight asks Playwright where its browser is and refuses when that file is absent; the answer here is
       Edge's own executable, which is the browser every launch below drives. */
    chromium.executablePath = () => EDGE;
    let said = false;
    chromium.launch = (opts = {}) => {
      if (opts.executablePath || opts.channel) return launch(opts);
      if (!said) {
        said = true;
        process.stderr.write("[pw-edge-fallback] Playwright's chromium is absent here; launching the installed Edge (channel msedge)\n");
      }
      return launch({ ...opts, channel: "msedge" });
    };
  }
}
