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
 * ONE EXCEPTION, AND ONLY ONE, SINCE 2026-09-11: THE CITY CARD. The founder
 * reversed himself for that card and stated the scope in the same breath: "the
 * cities should have their placeholder image ... just keep a placeholder image,
 * you can just blast the London in all of them, the London image with the bridge
 * that we have, you know, not the map." So a photograph is now sanctioned behind
 * a city card and nowhere else, and the ban below is NARROWED rather than
 * deleted: the gate still fails a photograph painted anywhere on a page, in any
 * hero, in any frame, in any gutter, in any mockup stylesheet.
 *
 * THE EXCEPTION IS A FILE, NOT A FLAG, and that is deliberate. It names
 * `src/lib/spine/city_cards.ts`, the one module allowed to say which file the
 * card shows, and it names nothing else. The two components that paint it
 * (CardPager, CityCards) receive the path as data and never spell a filename,
 * so they stay fully covered by this gate: a second photograph appearing in
 * either of them still fails. A reviewer reading the exception can therefore see
 * the whole of the sanctioned surface in one file of about fifty lines, which is
 * the property a blanket allow-comment on each offending line would have
 * destroyed.
 *
 * WHAT IT CANNOT SEE, stated before it is trusted: it reads source, not a
 * render, so a photograph assembled at runtime from a variable it cannot follow
 * would pass , and the city card's placeholder reaches both card components by
 * exactly that route, which is WHY the exception has to be a named file rather
 * than something this scan could have discovered. It also permits the files
 * themselves to stay on disk under public/, because the founder's photograph is
 * his and may be wanted again; the ban is on painting it, not on keeping it.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { globSync } from "node:fs";
import { stripCommentLines } from "./lib/strip_comments";

const ROOT = process.cwd();

/* The images that may never be painted as a background. Add a name here the
   day another photograph lands in public/ and the rule extends itself. */
const BANNED_IMAGES = ["_skyline.jpeg", "london.jpeg"];

/* A reference used to count only when the stripped line ALSO did something
   visibly painterly with it: a CSS background, a CSS url(), or a JS/TSX property
   that ends up as one. That was too narrow, and the proof is this very change.
   The city card's placeholder is declared as
     export const CITY_CARD_PLACEHOLDER_IMAGE = "/spine/_skyline.jpeg";
   and then handed to an `<img src={...}>` in two components that never spell a
   filename. Under the old pattern NEITHER line matched: the declaration carries
   no painting token and the paint carries no filename. So a photograph could be
   reintroduced site-wide, through any module that exports a path, and this gate
   would print PASS , which is the gate's own documented blind spot, reached for
   real on the first attempt after it was written down.
   So the test is now simply: a live (non-comment) line that NAMES a banned image
   is a red. A path in source exists to be used; there is no innocent reason to
   write one of these filenames in live code. The narrower pattern is kept only
   to LABEL the finding, so the message still says how it is being painted when
   that is visible from the line. */
const PAINTING = /background|backgroundImage|url\(|src=|DEFAULT_BG/;

/* THE ONE SANCTIONED SURFACE. See the header: the founder's 2026-09-11 ruling
   put a placeholder photograph behind the city card and nothing else, and this
   is the single module permitted to name the file it shows. Paths are compared
   from the repo root with forward slashes, the same form `relative()` produces
   for the report lines below. Adding a path here is a design decision about what
   the site paints, so it needs his words beside it, as this one has. */
const ALLOWED_TO_NAME_A_PHOTOGRAPH = new Set(["src/lib/spine/city_cards.ts"]);

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

let exempt = 0;
for (const file of files) {
  const rel = relative(ROOT, file).split("\\").join("/");
  /* THE CITY CARD'S OWN MODULE, counted rather than silently skipped, so the
     exception is visible in the gate's own output every time it runs. */
  if (ALLOWED_TO_NAME_A_PHOTOGRAPH.has(rel)) { exempt += 1; continue; }
  const raw = readFileSync(file, "utf8").split("\n");
  const stripped = stripCommentLines(raw);
  stripped.forEach((line, i) => {
    for (const img of BANNED_IMAGES) {
      if (!line.includes(img)) continue;
      const how = PAINTING.test(line) ? "is painted here" : "is named in live code here, which is how one gets painted";
      reds.push(`${rel}:${i + 1}: a photograph ${how} (${img}): ${line.trim().slice(0, 90)}`);
    }
  });
}

console.log(`no background photo: ${files.length} source file(s) scanned, ${exempt} exempt (the city card's placeholder, his ruling of 2026-09-11), ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r}`);
if (reds.length) {
  console.log("");
  console.log("  The founder killed the background photograph on 2026-09-07 and it came back three times.");
  console.log("  The page ground is var(--c-ground). A card floats on it in white. No photograph.");
}
process.exit(reds.length ? 1 : 0);
