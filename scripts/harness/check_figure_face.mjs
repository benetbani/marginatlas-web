/**
 * check_figure_face , THE MODEL LAWS' FIGURE FACE LOAD TEST, HELD TO A RED AND A PASS (2026-10-15). check_model_laws.mjs decided the figure
 * face "did not load" when a ten-digit tabular probe measured the same width in the figure face and the body face; Geist's and Space
 * Grotesk's tabular digits are the same width, so it redded wherever both faces really load and passed where neither is installed (CLAUDE.md
 * working rule 1). It now uses the classic detection (the probe in `"<face>", monospace` against `monospace`, and with `serif`). This writes
 * planted pages and runs the model laws on each as the chain runs them: a page naming a face that does not exist must red FIGURE FACE's
 * "did not load"; a page naming a face it loads itself (Geist Mono from next's own font file, as a data URI, so it loads on any machine with
 * node_modules) must not, and nor must a page naming Space Grotesk where fontconfig lists it installed (this build server, GitHub's CI).
 * BLIND SPOT, stated: it proves the load test on three faces at one weight; a page whose figures were measured and found every one in the
 * face is the pass read here, so a fixture whose figure face loads and whose `.fig` drew another family would red for that reason instead,
 * and the output file says which. Where fontconfig is absent (Windows) the Space Grotesk case says it was skipped; it is not a pass.
 *
 *   node scripts/harness/check_figure_face.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";
import { red, redSummary } from "../lib/red.mjs";

await requireBrowser("figure-face", "whether the model laws' FIGURE FACE tells a face that loaded from one that did not");
preflight({ browser: true, name: "check_figure_face" });

const RULE = "figure-face";
const DIR = "scratchpad/harness/figure-face";
mkdirSync(DIR, { recursive: true });
const MONO = readFileSync("node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2").toString("base64");
const page = (face, fontFace = "") => `<!doctype html><html><head><meta charset="utf-8"><title>figure face</title><style>${fontFace}
:root { --font-num: ${face}, ui-sans-serif, sans-serif; }
body { margin: 0; font-family: Geist, ui-sans-serif, system-ui, sans-serif; }
.fig { font-family: var(--font-num); font-variant-numeric: tabular-nums; }
</style></head><body><main style="width:1120px;margin:0 auto;padding:16px"><div id="planted" data-block="planted" data-card="" class="spine-card"><h3>Planted</h3><p>The figure <span class="fig" style="font-size:30px">$1,234,567</span></p></div></main></body></html>`;

const fcHas = (family) => { const r = spawnSync("fc-list", [":", "family"], { encoding: "utf8" }); return r.status === 0 ? r.stdout.split("\n").some((l) => l.split(",").map((x) => x.trim()).includes(family)) : null; };
const grotesk = fcHas("Space Grotesk");
const CASES = [
  { key: "absent", html: page(`"Atlas Absent Face 7"`), want: "red" },
  { key: "loaded", html: page(`"Atlas Fixture Mono"`, `@font-face { font-family: "Atlas Fixture Mono"; src: url(data:font/woff2;base64,${MONO}) format("woff2"); font-weight: 100 900; }`), want: "pass" },
  { key: "installed", html: page(`"Space Grotesk"`), want: "pass", skip: grotesk === true ? null : grotesk === false ? "fontconfig lists no Space Grotesk on this machine" : "no fontconfig on this machine" },
];
const DID_NOT_LOAD = /FIGURE FACE: [^\n]*it did not load/;
let failed = 0, read = 0;
for (const c of CASES) {
  if (c.skip) { console.log(`SKIP  ${c.key}: ${c.skip}; not a pass`); continue; }
  const file = `${DIR}/fixture-${c.key}.html`;
  writeFileSync(file, c.html, "utf8");
  const r = spawnSync(process.execPath, ["scripts/harness/check_model_laws.mjs", file], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  writeFileSync(`${DIR}/fixture-${c.key}.out.txt`, out, "utf8");
  /* A gate never passes having read nothing: the model laws must have measured the page at a width, and found its figure. */
  const measured = /fixture-[a-z]+@\d+: \d+ model-law finding/.test(out) && !/FIGURE FACE: no \.fig elements/.test(out);
  if (measured) read++;
  const faceReds = out.split("\n").filter((l) => /FIGURE FACE/.test(l));
  const ok = measured && (c.want === "red" ? DID_NOT_LOAD.test(out) : faceReds.length === 0);
  if (ok) console.log(`PASS  ${c.key}: FIGURE FACE ${c.want === "red" ? "reds: the named face did not load" : "passes: the named face loaded and every figure drew in it"}`);
  else { failed++; red({ rule: RULE, file: "scripts/harness/check_model_laws.mjs", detail: `${c.key}: wanted FIGURE FACE to ${c.want}, ${measured ? `read ${faceReds.length ? faceReds.join(" | ").trim() : "no FIGURE FACE finding"}` : "the page was not measured"} (the output is in ${DIR})`, remedy: "detect the figure face by the classic test: the probe in the named face before a generic against the generic alone, monospace and serif, loaded when either differs" }); }
}
if (!read) { failed++; red({ rule: RULE, file: "scripts/harness/check_model_laws.mjs", detail: "no planted page was measured", remedy: "run the model laws on the planted pages" }); }
if (failed) { redSummary(RULE, failed, "FIGURE FACE tells a face that loaded from one that did not", `${CASES.length} planted pages`); process.exit(1); }
console.log(`PASS figure-face: ${read} planted page(s) read by the model laws.`);
