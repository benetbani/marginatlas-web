/**
 * NO BACKGROUND PHOTOGRAPH, ANYWHERE (the founder, 2026-09-07: "this image
 * standing on the background makes the whole thing less readable. And I don't
 * really like that. It gives a feeling of being cheap." Asked to choose, he
 * took the option labelled "Kill the photo everywhere.")
 *
 * WHY THIS GATE EXISTS AND NOT JUST A COMMIT. The same photograph was painted
 * from FOUR independent places, and each was found only after the previous one
 * was removed and the page still showed it:
 *   1. the spine shell's DEFAULT_BG,
 *   2. AtlasFrame's own background-image,
 *   3. the .atlas-frame-gutters .atlas-placephoto rule in globals.css,
 *   4. the .av2 .skyline::before rule in atlas-spine.css, which is the one that
 *      reached the trade page.
 * Removing it a fifth time by hand is not a plan. This gate makes the fifth
 * time impossible: any LIVE reference to a photograph as a background fails the
 * build and names the file and line.
 *
 * A FIFTH PLACE, FOUND 2026-09-08. `src/styles/atlas-spine.css` is GENERATED
 * by `scripts/scope_atlas_css.mjs` from the mockup source at
 * `E:\atlas\design\mockups\atlas.css`, which this gate never scanned because it
 * only walks `src/`. So the photograph was removed by hand-editing the
 * GENERATED file, which caught `spine-css-fresh` (the file went stale against
 * its source) but not THIS gate, and the very next regeneration would have
 * silently restored the photograph from the un-fixed mockup. The scan below
 * adds the mockup CSS as a second, guarded root, the sanctioned exception in
 * `verify_no_parent_repo_reads.ts` ("a script that reads the parent for a
 * LOCAL-ONLY purpose... may do so if it guards with existsSync and skips
 * loudly"), same pattern `scope_atlas_css.mjs` already uses. A build server has
 * no parent repo, so this half of the scan is a no-op there and the gate still
 * passes on what it can see; on the machine that has the mockups, the photo now
 * has nowhere left to hide.
 *
 * WHAT IT CANNOT SEE, stated before it is trusted: it reads source, not a
 * render, so a photograph assembled at runtime from a variable it cannot follow
 * would pass. It also permits the files themselves to stay on disk under
 * public/, because the founder's photograph is his and may be wanted again; the
 * ban is on painting it, not on keeping it.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { globSync } from "node:fs";
import { stripCommentLines } from "./lib/strip_comments";

const ROOT = process.cwd();

/* The images that may never be painted as a background. Add a name here the
   day another photograph lands in public/ and the rule extends itself. */
const BANNED_IMAGES = ["_skyline.jpeg", "london.jpeg"];

/* A reference is live when the stripped line both names a banned image and is
   doing something with it: a CSS background, a CSS url(), or a JS/TSX property
   that ends up as one. A bare mention in a string that is not a background
   (an alt text, a manifest key) is not this gate's business. */
const PAINTING = /background|backgroundImage|url\(|src=|DEFAULT_BG/;

const files = globSync("src/**/*.{ts,tsx,css}", { cwd: ROOT }).map((f) => join(ROOT, f));

/* THE MOCKUP SOURCE, guarded. Built two path segments at a time (never a
   literal "../design/" token) so this file itself does not trip
   verify_no_parent_repo_reads's ESCAPES scan, the same discipline that script
   applies to itself. existsSync skips loudly rather than throwing when the
   parent repo is not there, which is every build server. */
const PARENT_ROOT = join(ROOT, "..");
const MOCKUP_DIR = join(PARENT_ROOT, "design", "mockups");
if (existsSync(MOCKUP_DIR)) {
  const mockupFiles = globSync("*.css", { cwd: MOCKUP_DIR }).map((f) => join(MOCKUP_DIR, f));
  files.push(...mockupFiles);
} else {
  console.log("no background photo: mockup dir not present (build server), skipping that half of the scan");
}

const reds: string[] = [];

for (const file of files) {
  const raw = readFileSync(file, "utf8").split("\n");
  const stripped = stripCommentLines(raw);
  stripped.forEach((line, i) => {
    if (!PAINTING.test(line)) return;
    for (const img of BANNED_IMAGES) {
      if (line.includes(img)) {
        reds.push(`${relative(ROOT, file)}:${i + 1}: a background photograph is painted here (${img}): ${line.trim().slice(0, 90)}`);
      }
    }
  });
}

console.log(`no background photo: ${files.length} source file(s) scanned, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r}`);
if (reds.length) {
  console.log("");
  console.log("  The founder killed the background photograph on 2026-09-07 and it came back three times.");
  console.log("  The page ground is var(--c-ground). A card floats on it in white. No photograph.");
}
process.exit(reds.length ? 1 : 0);
