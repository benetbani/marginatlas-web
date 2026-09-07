/* THE HARNESS PREFLIGHT (sys:harness-preflight, the build loop's run 24,
   2026-09-07). Every harness script calls preflight() before it does anything,
   and the gate `harness-preflight` in the chain keeps it so. Three checks, in
   order, each with the exact remedy printed:

   1. THE WORKING DIRECTORY IS THE SITE ROOT: a package.json here named
      "marginatlas". The loop paid four times on 2026-09-06 for a shell that
      had drifted to the parent folder, where a script runs against nothing
      or writes nowhere and says little. Remedy: cd /e/atlas/website.
   2. WHEN THE SCRIPT WILL LAUNCH A BROWSER: Playwright's chromium is on disk
      at the path Playwright itself resolves. The browser folder vanished
      between two green runs on 2026-09-06 and the failure came late, from
      inside a launch, after a render had already run. Remedy: npx playwright
      install chromium, which is a download, and this check never runs it: a
      download happens on the founder's word only.
   3. FREE MEMORY IS PRINTED (node's reading of free physical memory, in MB),
      so a starved run says so at its head instead of in a browser timeout
      later. Under the chain's bar it is a warning line, not a stop: a harness
      script needs one browser, the chain needs the machine.

   A wrong ground stops the script with exit 2 (a finding's exit is 1, so the
   two are never confused) and the remedies on stderr. The preflight downloads,
   installs and changes nothing.

   As a command: node scripts/harness/preflight.mjs [--browser] [--browser-path=<path>]
   proves the checks without touching the machine (a wrong --browser-path
   fails with the remedy; run from another folder, it fails with the cd). */
import { existsSync, readFileSync } from "node:fs";
import { freemem } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

export const SITE_NAME = "marginatlas";
export const MEMORY_BAR_MB = 900;
export const GROUND_EXIT = 2;

/** Playwright's own idea of where its chromium is; existence is checked by the caller. */
export function chromiumPath() {
  return chromium.executablePath();
}

export function preflight({ browser = false, name = "harness", browserPath = null } = {}) {
  const problems = [];
  let pkgName = null;
  try { pkgName = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")).name ?? null; } catch { /* no package.json here: reported below */ }
  if (pkgName !== SITE_NAME) problems.push(`the working directory is ${process.cwd()}, not the site root (no package.json named "${SITE_NAME}" here). Remedy: cd /e/atlas/website, then run the command again.`);
  if (browser) {
    let path = browserPath;
    if (!path) { try { path = chromiumPath(); } catch (e) { problems.push(`Playwright cannot say where its browser is (${e && e.message}). Remedy: npm install, from the site root.`); } }
    if (path && !existsSync(path)) problems.push(`Playwright's browser is not on disk at ${path}. Remedy: npx playwright install chromium, a download the loop runs only on the founder's word.`);
  }
  const free = Math.round(freemem() / 1048576);
  const memoryLine = `free memory ${free} MB` + (free < MEMORY_BAR_MB ? ` (under the ${MEMORY_BAR_MB} MB bar: one browser is fine, the chain is not)` : "");
  if (problems.length) {
    console.error(`preflight ${name}: STOP, the ground is wrong.`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error(`  ${memoryLine}`);
    process.exit(GROUND_EXIT);
  }
  console.log(`preflight ${name}: ${memoryLine}; working directory ${process.cwd()}${browser ? "; browser on disk" : ""}`);
  return { free };
}

/* The command form, for proving the checks. */
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const browser = process.argv.includes("--browser") || process.argv.some((a) => a.startsWith("--browser-path="));
  const browserPath = process.argv.find((a) => a.startsWith("--browser-path="))?.slice("--browser-path=".length) ?? null;
  preflight({ browser, name: "command", browserPath });
}
