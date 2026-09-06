/**
 * THE INDEX LINKS RESOLVE: every link in the stories index of a rendered sheet
 * points at an id the sheet holds, and every story on the sheet is listed.
 * The build loop's run 21 (sys:stories-index).
 *
 * usage: node scripts/harness/check_index_links.mjs [scratchpad/harness/archetypes.html]
 *   exit 1 on a dangling link or an unlisted story.
 */
import { readFileSync } from "node:fs";
const file = process.argv[2] ?? "scratchpad/harness/archetypes.html";
const html = readFileSync(file, "utf8");
const links = [...html.matchAll(/href="#(story-[^"]+)"/g)].map((m) => m[1]);
const ids = new Set([...html.matchAll(/<section id="(story-[^"]+)"/g)].map((m) => m[1]));
const dangling = links.filter((l) => !ids.has(l));
const linked = new Set(links);
const unlisted = [...ids].filter((id) => !linked.has(id));
console.log(`index links: ${links.length} links, ${ids.size} stories; ${dangling.length} dangling, ${unlisted.length} unlisted`);
for (const d of dangling) console.log(`  x dangling: #${d}`);
for (const u of unlisted) console.log(`  x unlisted story: ${u}`);
process.exit(dangling.length || unlisted.length ? 1 : 0);
