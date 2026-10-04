/**
 * verify_css_minifies , THE STYLESHEET MUST SURVIVE THE PRODUCTION BUILD'S MINIMIZER.
 *
 * WHY. On 2026-10-04 the United Kingdom's band page passed all 170 gates here and on Vercel, and the deploy then died inside
 * `next build`: "CssSyntaxError: static/css/....css:5872:60: Missed semicolon". Next's CSS minimizer
 * (node_modules/next/dist/build/webpack/plugins/css-minimizer-plugin.js) parses every stylesheet with postcss-scss, where `//`
 * opens a line comment, and the zones' `border-image: ... fill 0 // 0 100vmax` lost the rest of its line there. The dev server
 * and every browser read the shorthand correctly, so nothing on this machine could see the fault until a deploy failed.
 *
 * WHAT IT DOES. Builds the site's stylesheet the way the build does (Tailwind over src/app/globals.css with the project's own
 * config) and runs the result through Next's own minimizer, the plugin's options exactly: postcss with cssnano-simple, parsed by
 * postcss-scss. A parse or minify error is a red that names the generated line and, where its text is found there, the line of
 * globals.css it came from. Planted by hand on the day: the shorthand put back into a tint zone's rule fails with the deploy's
 * own message ("Missed semicolon").
 *
 * BLIND SPOT, stated: it builds globals.css only (the site's one Tailwind entry); a CSS module or a component's own stylesheet
 * is not built here. It proves the minimizer parses and minifies the CSS, not that a browser draws it as intended.
 *
 * usage: node scripts/verify_css_minifies.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { red, redSummary } from "./lib/red.mjs";

const RULE = "css-minifies";
const SOURCE = "src/app/globals.css";
const require = createRequire(import.meta.url);
const out = join(tmpdir(), `atlas-css-minify-${process.pid}.css`);

const built = spawnSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", SOURCE, "-o", out], { encoding: "utf8" });
if (built.status !== 0) {
  red({ rule: RULE, file: SOURCE, detail: `Tailwind could not build the stylesheet (exit ${built.status}): ${(built.stderr || "").trim().split("\n").slice(-1)[0] ?? ""}`, remedy: `run npx tailwindcss -i ${SOURCE} -o out.css and read its error` });
  process.exit(1);
}

const cssnanoSimple = require("next/dist/compiled/cssnano-simple");
const scss = require("next/dist/compiled/postcss-scss");
const postcss = require("next/node_modules/postcss");
const css = readFileSync(out, "utf8");

/** The line of globals.css that holds the offending generated line's text, if it is there to find. */
function sourceLineOf(text) {
  const t = text.trim();
  if (t.length < 8) return null;
  const lines = readFileSync(SOURCE, "utf8").split("\n");
  const i = lines.findIndex((l) => l.trim() === t || l.includes(t));
  return i >= 0 ? i + 1 : null;
}

try {
  const result = await postcss([cssnanoSimple({ colormin: false }, postcss)]).process(css, { from: out, to: `${out}.min.css`, parser: scss });
  console.log(`PASS ${RULE} , ${SOURCE} builds to ${css.length} bytes and Next's minimizer (cssnano-simple over postcss-scss) takes it to ${result.css.length}.`);
} catch (e) {
  const genLine = typeof e.line === "number" ? css.split("\n")[e.line - 1] ?? "" : "";
  const src = sourceLineOf(genLine);
  red({
    rule: RULE,
    file: SOURCE,
    line: src ?? undefined,
    detail: `the production minimizer rejects the built stylesheet at its line ${e.line}:${e.column} (${e.reason || e.message}): "${genLine.trim().slice(0, 90)}"`,
    remedy: "write the declaration so an SCSS parser reads it whole (no // in a value: use the longhand properties), then run this gate again",
  });
  redSummary(RULE, 1, "fix the declaration named above; the deploy's next build fails on it otherwise");
  process.exitCode = 1;
} finally {
  rmSync(out, { force: true });
}
