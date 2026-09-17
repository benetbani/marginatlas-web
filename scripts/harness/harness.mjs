/**
 * THE HARNESS DRIVER (plan step 21, 2026-09-17). One script behind `npm run
 * harness`, `harness:archetypes` and `harness:page`, so the render-then-check
 * pairs are written once and a target can be handed to both halves; an npm
 * script cannot pass `--only` to two commands joined by `&&`, and a flag typed
 * after `--` lands on the last command only.
 *
 * usage, from E:/atlas/website:
 *   node scripts/harness/harness.mjs                          the sheet, then every listed page (npm run harness)
 *   node scripts/harness/harness.mjs archetypes               the sheet: every story, three widths, shots on (npm run harness:archetypes)
 *   node scripts/harness/harness.mjs page                     every page in scripts/harness/pages.json, shots on (npm run harness:page)
 *   node scripts/harness/harness.mjs --only=<kind>[/<key>] [--shots]
 *       one story, or every story of one kind: rendered alone, checked with
 *       every archetype rule at three widths (npm run harness -- --only=...).
 *       The sheet's INDEX rule is skipped and says so; the sideways-scroll
 *       clause runs on the one-kind page. A kind or key that matches nothing
 *       exits 2 with the kinds and the keys of the nearest kind.
 *   node scripts/harness/harness.mjs page --only=<page> [--section=<id>] [--shots]
 *       one listed page (its surface, "city", or its file stem, "city-london"),
 *       rendered alone, checked at three widths; with --section, the card rules
 *       on that one card and the page rules (ACCENT BUDGET, ACCENT UNREADABLE,
 *       sideways scroll, NO SECTIONS) on the whole page, because a page-level
 *       count cannot be asked of one card (npm run harness:page -- --only=...).
 *       A page not in the list, or a section id no card carries, exits 2 with
 *       the list.
 *
 * The full forms are what the npm scripts ran before this file: the same
 * commands, the same order, `--shots` on, stopping at the first non-zero exit,
 * which is what `&&` did. The targeted forms default to no shots and take
 * `--shots` to write them beside, never over, the sheet's and the pages' own.
 *
 * The timings of the four forms, measured on 2026-09-17, are in the header of
 * render_archetypes.tsx and nowhere else, so they cannot drift apart.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. The children preflight again, each for its own needs (the checkers ask for the browser). */
preflight({ name: "harness" });

const args = process.argv.slice(2);
const mode = args[0] === "archetypes" || args[0] === "page" ? args[0] : "all";
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? null;
const only = flag("only");
const section = flag("section");
const shots = args.includes("--shots");
const unknown = args.filter((a) => a !== mode && !a.startsWith("--only=") && !a.startsWith("--section=") && a !== "--shots");
if (unknown.length || (section != null && (mode !== "page" || only == null)) || (only != null && mode === "all" && section != null)) {
  console.error(`harness: unexpected argument(s) ${unknown.join(" ") || (section != null ? "--section without page --only" : args.join(" "))}.`);
  console.error("usage: node scripts/harness/harness.mjs [archetypes|page] | --only=<kind>[/<key>] [--shots] | page --only=<page> [--section=<id>] [--shots]");
  process.exit(2);
}

/* The one spelling of the render command: tsx under the harness tsconfig, with the environment and the next/font stub preloaded. */
const TSX = [process.execPath, "node_modules/tsx/dist/cli.mjs", "--tsconfig", "scripts/tsconfig.harness.json", "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs"];
function run(cmd) {
  const [bin, ...rest] = cmd;
  const r = spawnSync(bin, rest, { stdio: "inherit" });
  if (r.error) { console.error(`harness: could not run ${rest.join(" ")}: ${r.error.message}`); process.exit(2); }
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const RENDER_ARCHETYPES = [...TSX, "scripts/harness/render_archetypes.tsx"];
const CHECK_ARCHETYPES = [process.execPath, "scripts/harness/check_archetypes.mjs"];
const RENDER_PAGE = [...TSX, "scripts/harness/render_page.tsx"];
const CHECK_PAGE = [process.execPath, "scripts/harness/check_page_holes.mjs"];

if (only == null) {
  if (mode === "all" || mode === "archetypes") { run(RENDER_ARCHETYPES); run([...CHECK_ARCHETYPES, "--shots"]); }
  if (mode === "all" || mode === "page") { run([...RENDER_PAGE, "--list"]); run([...CHECK_PAGE, "--list", "--shots"]); }
  /* Last, the two renderers compared on one card (plan step 25): the sheet and
     the page drew the same card under different stylesheets for weeks and no
     photograph showed it. Full runs only; it needs both renders present. */
  if (mode === "all") run([process.execPath, "scripts/harness/check_renderers_agree.mjs"]);
} else if (mode === "page") {
  /* THE PAGE, FROM THE LIST: by surface or by file stem, every entry that matches. */
  const list = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages;
  const stem = (p) => `${p.surface}-${p.slugs.join("-")}`;
  const hits = list.filter((p) => p.surface === only || stem(p) === only);
  if (!hits.length) {
    console.error(`harness page --only=${only}: no such page in scripts/harness/pages.json. The pages are: ${list.map((p) => `${p.surface} (${stem(p)})`).join(", ")}.`);
    process.exit(2);
  }
  for (const p of hits) {
    run([...RENDER_PAGE, p.surface, ...p.slugs]);
    run([...CHECK_PAGE, `scratchpad/harness/pages/${stem(p)}.html`, ...(section != null ? [`--section=${section}`] : []), ...(shots ? ["--shots"] : [])]);
  }
} else {
  run([...RENDER_ARCHETYPES, `--only=${only}`]);
  run([...CHECK_ARCHETYPES, `--only=${only}`, ...(shots ? ["--shots"] : [])]);
}
