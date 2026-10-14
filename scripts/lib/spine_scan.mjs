/**
 * scripts/lib/spine_scan.mjs , THE SPINE'S SCAN SET, ONE ENUMERATION FOR EVERY TEST THAT READS THE SPINE'S SOURCE (plan 2026-10-12
 * rhythm-air-inside, Task 1C, fix round 1 of its review; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * section 2: "every page drawn by the spine views").
 *
 * WHY IT EXISTS. The spacing pin read nine folders it was handed by name. A folder it was not handed (home/, openings/, a new one) and a
 * component put in a file at the root (zones.tsx, Crumbs.tsx, the foots, the kit itself) were read by nobody, and the test printed PASS about
 * source it had not opened: seven hand-rolled distances stood in files it never saw (country/how-to-view.tsx:95, archetypes/stories.tsx:881,
 * :895 and :1170, atlas-index.tsx:153 and :411, kit-index.tsx:572). CLAUDE.md names the trap ("a gate that skips directories by bare name will
 * eventually skip real source ... compare its walk against a separate enumeration"), and the type floor's source check (Task 3) and the tiles
 * test (Task 5) were about to copy the same hand-kept walker. There is one walker, here.
 *
 * THE RULE. The scan set is every .tsx file under src/components/spine EXCEPT what SPINE_OUT names, by path from the repo root (never by a
 * bare name, so a folder called `home` anywhere else is not skipped), each entry with the reason it is not read. A new folder, or a component
 * put in a file at the root, is therefore read from its first commit, and a file leaves the scan only by a line below that says why. In scope
 * are the pages the spec names (country, city, trade, industry, district) and every piece they draw, the kit, the zones, the crumbs, the
 * foots, the shell and the locked section included; out are the pages and dev surfaces the spec does not name.
 *
 * THE GUARD (`findings`). The walk is checked against a second enumeration made another way: one recursive listing of the whole root,
 * classified by stat, not the walk's own recursion. A finding names the entry and the remedy when
 *   - a folder, at any depth, is neither walked nor named out;
 *   - a .tsx file is neither returned nor under a named path (or the walk returned a file the listing does not hold);
 *   - a file at the root that is not a .tsx is not named out: nothing in it is read, and the root is where a component gets put without a
 *     folder, so nothing standing there goes unnamed;
 *   - a name in SPINE_OUT matches no path (renamed or deleted: its line would go on excusing a path that no longer holds it while the file
 *     that took its place was read without a word), names a folder without its trailing slash or a file with one, lies outside the root,
 *     or has no reason.
 * The fixtures at the end of tests/spine/spacing_pin.test.ts run each of these reds on a temp tree (plan 2026-10-12, Task 1C, fix round 2),
 * but one: the parenthesis in the second, the walk and the listing disagreeing, needs a runtime whose recursive listing is partial, and no tree reaches it.
 *
 * ITS BLIND SPOT, stated before any number: the guard checks paths, and that a reason exists, not that the reason is still true (a reason says
 * what a file is and who draws it on the day it was written); and it reads names, not imports, so a page that begins to draw a file named out
 * is not noticed. Moving such a file back in is a reviewer's line. Only .tsx files are returned: a .ts holds no markup, and only one at the
 * root is accounted for, by name.
 *
 * INTERFACE, kept small so a test takes it as it is (run from the repo root, as every gate does):
 *   scanSpine({ root, out, skipDir }?)  ->  { files, outFiles, findings }
 *     files     string[]  the .tsx files to read: repo-relative, forward slashes, sorted by path
 *     outFiles  string[]  the .tsx files SPINE_OUT names (each under a named path), sorted
 *     findings  { entry, detail, remedy }[]  the guard's reds; empty when every entry is walked or named out
 *   SPINE_ROOT  the folder scanned, "src/components/spine"
 *   SPINE_OUT   Map of path to reason; a folder's path ends with "/", a file's does not
 * `root`, `out` and `skipDir` are for proofs on a scratch tree; a test that reads the real spine passes none of them. `skipDir(path)` answers
 * whether the walk keeps out of the folder at `path` (no trailing slash); its default is the SPINE_OUT check, `(p) => out.has(p + "/")`, and
 * a proof injects one to stand for a walk that drops a folder, which the guard must then name. A test that needs a narrower set of its own
 * (the kit's own file, a file that holds the piece it checks for) filters `files` and says why where it does.
 */
import { existsSync, readdirSync, statSync } from "node:fs";

export const SPINE_ROOT = "src/components/spine";

/**
 * What the scans do not read, each by path from the repo root with the reason. A reason says what the file is and who draws it, so a
 * reviewer can tell whether it still stands.
 * @type {Map<string, string>}
 */
export const SPINE_OUT = new Map([
  /* src/components/spine/home/ IS READ since plan 2026-10-13 home-quiet-editorial, Task 7B: the home's project is built, so its source holds the spine's distances, type floor and tiles rules like every page the kit draws. */
  /* PAGES THE SPEC DOES NOT NAME (its scope: country, city, trade, industry and district pages). */
  [`${SPINE_ROOT}/openings/`, "the /new-businesses page's view (new companies, US restaurants): not a country, city, trade, industry or district page, so outside the spec's scope"],
  [`${SPINE_ROOT}/country/how-to-view.tsx`, "the how-to-open page's view (/[country]/how-to-open), an appendix to the country page that the spec's scope does not name"],
  [`${SPINE_ROOT}/WhereNext.tsx`, "the where-to-next doors of the /new-businesses page, named out with its view (openings/): no country, city, trade, industry or district page draws it, and the home has not drawn it since plan 2026-10-13"],
  /* DEV AND INDEX SURFACES, drawn on no page the spec names. */
  [`${SPINE_ROOT}/archetypes/stories.tsx`, "the archetype stories: each archetype drawn on data-chosen instances for the /dev/archetypes page and the archetype harness, so no page of the site draws them"],
  [`${SPINE_ROOT}/atlas-index.tsx`, "the AtlasIndex browse and list shell (cities, world and extremes), drawn by the /dev/index-cities, /dev/index-countries and /dev/index-world pages alone"],
  [`${SPINE_ROOT}/kit-index.tsx`, "the index kit: the row, table, lock and sort primitives of the Margin Index page (/margin-index), the AtlasIndex and the /dev decision and showcase pages; drawn on no country, city, trade, industry or district page"],
  [`${SPINE_ROOT}/forms-v2.tsx`, "the catalog-v2 form library: eight reading forms for the older trade sections kit, which a dev page and the spikes draw; the one piece a spine page draws, StateMark, is a glyph in the compare table"],
  [`${SPINE_ROOT}/SpineMap.tsx`, "the MapLibre map component, drawn by the /dev/index-world and /dev/spine pages alone; it holds no section opener, focal block or basis line"],
  [`${SPINE_ROOT}/conveyor.tsx`, "the click-through carousel primitive, drawn by the /dev/spine showcase alone; it holds no section opener, focal block or basis line"],
  [`${SPINE_ROOT}/keep.ts`, "a retired helper (the keep index): a .ts file, so no markup, kept only for the /dev/decide sandbox that still imports it"],
]);

/**
 * @typedef {{ entry: string, detail: string, remedy: string }} SpineFinding
 */

/**
 * @param {{ root?: string, out?: Map<string, string>, skipDir?: (path: string) => boolean }} [options]
 * @returns {{ files: string[], outFiles: string[], findings: SpineFinding[] }}
 */
export function scanSpine({ root = SPINE_ROOT, out = SPINE_OUT, skipDir = (/** @type {string} */ p) => out.has(`${p}/`) } = {}) {
  /** @type {SpineFinding[]} */
  const findings = [];
  const add = (entry, detail, remedy) => { findings.push({ entry, detail, remedy }); };
  if (!existsSync(root)) {
    add(root, "the spine's folder is not there from here", "run from the repo root, where src/components/spine stands");
    return { files: [], outFiles: [], findings };
  }

  /* THE WALK: from the root, a folder is entered unless `skipDir` says not (by default, unless SPINE_OUT names it by path), and a .tsx is returned unless SPINE_OUT names it. */
  /** @type {string[]} */
  const files = [];
  const entered = new Set();
  const walk = (/** @type {string} */ dir) => {
    entered.add(dir);
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) { if (!skipDir(p)) walk(p); }
      else if (e.name.endsWith(".tsx") && !out.has(p)) files.push(p);
    }
  };
  walk(root);
  files.sort();

  /* THE SECOND ENUMERATION: one recursive listing of the root, each entry classified by stat. */
  const dirs = new Set();
  const tsx = new Set();
  const other = new Set();
  for (const rel of readdirSync(root, { recursive: true })) {
    const p = `${root}/${String(rel).replace(/\\/g, "/")}`;
    if (statSync(p, { throwIfNoEntry: false })?.isDirectory()) dirs.add(p);
    else if (p.endsWith(".tsx")) tsx.add(p);
    else other.add(p);
  }
  const named = (/** @type {string} */ p) => out.has(p) || out.has(`${p}/`) || [...out.keys()].some((k) => k.endsWith("/") && p.startsWith(k));
  const walked = new Set(files);

  const NAME_IT = "name it in SPINE_OUT (scripts/lib/spine_scan.mjs) with the reason it is not read";
  const FAULT = `fix the walk in scripts/lib/spine_scan.mjs (it reads every .tsx under ${root} but what SPINE_OUT names, so a miss is its fault), or name the entry in SPINE_OUT with the reason it is not read`;
  for (const d of [...dirs].sort()) if (!named(d) && !entered.has(d)) add(d, "a folder neither walked nor named out", FAULT);
  for (const f of [...tsx].sort()) if (!named(f) && !walked.has(f)) add(f, "a .tsx neither read nor named out", FAULT);
  for (const f of files) if (!tsx.has(f)) add(f, "the walk returned a file the second listing does not hold", "the two enumerations disagree: fix the walk in scripts/lib/spine_scan.mjs");
  for (const f of [...other].sort()) {
    if (f.slice(0, f.lastIndexOf("/")) === root && !named(f)) add(f, "a file at the root that is not a .tsx, and not named out", `nothing in it is read; ${NAME_IT}, or move it into a folder`);
  }
  for (const [key, reason] of out) {
    const folder = key.endsWith("/");
    const bare = folder ? key.slice(0, -1) : key;
    if (!bare.startsWith(`${root}/`)) { add(key, `named out, and it lies outside ${root}`, "name an entry by its path from the repo root, under the spine's folder"); continue; }
    const isFile = tsx.has(bare) || other.has(bare);
    if (folder ? !dirs.has(bare) : !isFile) {
      const detail = folder ? (isFile ? "a file named with a trailing slash" : "named out, and no such folder") : (dirs.has(bare) ? "a folder named without its trailing slash" : "named out, and no such file");
      add(key, detail, "correct its path (a folder's ends with a slash, a file's does not), or delete the line if the entry is gone: a renamed file is read until it is named again");
      continue;
    }
    if (typeof reason !== "string" || reason.trim() === "") add(key, "named out with no reason", "give it the reason it is not read: what the entry is and who draws it");
  }

  return { files, outFiles: [...tsx].filter(named).sort(), findings };
}
