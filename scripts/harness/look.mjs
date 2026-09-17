/**
 * ONE COMMAND TO LOOK (plan step 27, 2026-09-17). The doctrine's rule 7 as a
 * verb: re-render one page with the harness preloads, photograph one card at
 * the widths the change can fail at, print the JPEG paths, open nothing.
 *
 * usage, from E:/atlas/website:
 *   npm run look -- <surface> <slug...> <#id | heading text> [widths]
 *
 *   npm run look -- city london "#districts"            (1280 only, the default)
 *   npm run look -- city london "#districts" 1280,375   (a layout change)
 *   npm run look -- country GB "What staff cost" 1280,768,375
 *
 * Widths follow the doctrine: a copy change at 1280; a layout change at 1280
 * and 375; a new form at all three. The photographs land under
 * scratchpad/harness/shots/look/<surface>-<slug>-<id>-<width>.jpeg, beside
 * the harness's own, never over them. Open them with the Read tool and say
 * what a person would see; this tool takes the picture and stops.
 *
 * Why three preloads on the render: render_page.tsx needs the harness env
 * (a Supabase URL that is never read) and the next/font stub, and without
 * them it exits on "supabaseUrl is required" after a five-second wait. The
 * harness driver carries the same list; this file borrows it so there is one.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "look" });

const argv = process.argv.slice(2);
if (argv.length < 3) {
  console.error('usage: npm run look -- <surface> <slug...> <#id | heading text> [widths]\n  e.g. npm run look -- city london "#districts" 1280,375');
  process.exit(2);
}
/* The last arg is widths only if it looks like widths; the target is the arg before it. */
const looksLikeWidths = (a) => /^\d{3,4}(,\d{3,4})*$/.test(a);
const widths = looksLikeWidths(argv[argv.length - 1]) ? argv.pop() : "1280";
const target = argv.pop();
const [surface, ...slugs] = argv;
if (!surface || !slugs.length || !target) {
  console.error("look: need a surface, at least one slug, and a target (#id or heading text)");
  process.exit(2);
}

const TSX = [process.execPath, "node_modules/tsx/dist/cli.mjs", "--tsconfig", "scripts/tsconfig.harness.json", "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs"];
function run(cmd, what) {
  const r = spawnSync(cmd[0], cmd.slice(1), { stdio: "inherit" });
  if (r.status !== 0) { console.error(`look: ${what} exited ${r.status}`); process.exit(r.status ?? 1); }
}

const stem = `${surface}-${slugs.join("-")}`;
const rendered = resolve("scratchpad/harness/pages", `${stem}.html`);
run([...TSX, "scripts/harness/render_page.tsx", surface, ...slugs], "the render");
if (!existsSync(rendered)) { console.error(`look: the render did not write ${rendered}`); process.exit(1); }

const outDir = resolve("scratchpad/harness/shots/look");
mkdirSync(outDir, { recursive: true });
const idPart = target.replace(/^#/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
const prefix = resolve(outDir, `${stem}-${idPart}`);
run([process.execPath, "scripts/harness/shoot_page.mjs", rendered, target, prefix, widths], "the photograph");

console.log(`look: ${surface} ${slugs.join(" ")} ${target} at ${widths}`);
for (const w of widths.split(",")) console.log(`  ${prefix}-${w}.jpeg`);
