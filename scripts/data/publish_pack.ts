/**
 * PUBLISH THE UK DATA PACK (his ruling of 2026-10-05 on PARKED P0.3, option (a): "free and public, cited, as the credibility plan
 * proposes"). Copies a version of the pack the registers build (E:/atlas/cache/uk/pack/<version>/, registers/uk/build_pack.py)
 * into public/data/uk/<version>/, where /data links each file.
 *
 * WHAT STAYS OUT, by the credibility plan's free line (design/loop/build/goal-2026-10-02/CREDIBILITY.md, decision 3: "open the
 * borough-by-trade headline tables the free pages already show; street-level joins, history and any API stay" out of the free
 * line): the companies joined to postcode districts and the monthly series of new companies. The published README lists only what
 * is published and says what is not.
 *
 * By hand, never in the chain (it reads the parent repo): npx tsx scripts/data/publish_pack.ts [--version=2026.10]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PACK_VERSION, PACK_HELD_BACK } from "../../src/lib/data_pack";

const version = process.argv.find((a) => a.startsWith("--version="))?.slice("--version=".length) ?? PACK_VERSION;
const SRC = `E:/atlas/cache/uk/pack/${version}`;
const OUT = `public/data/uk/${version}`;
if (!existsSync(SRC)) { console.error(`publish_pack: no pack at ${SRC}`); process.exit(2); }
mkdirSync(OUT, { recursive: true });

/* Every published name in lowercase (the pack builds README.md and CITATION.cff): the site's canonical rule sends a path with a
   capital to its lowercase form, so a capital in a file's name is an address no reader reaches (src/lib/data_pack.ts). */
const files = readdirSync(SRC).filter((f) => !PACK_HELD_BACK.includes(f));
for (const f of files) if (f !== "README.md") copyFileSync(join(SRC, f), join(OUT, f.toLowerCase()));

/* The README as built, its file list cut to what is published, and one line saying what is not. */
const readme = readFileSync(join(SRC, "README.md"), "utf8");
const nl = readme.includes("\r\n") ? "\r\n" : "\n";
const kept = readme.split(nl).filter((line) => !PACK_HELD_BACK.some((h) => line.startsWith(`- \`${h}\``)));
const at = kept.findIndex((l) => l.startsWith("## Sources and licences"));
const note = [`Not in this free pack: ${PACK_HELD_BACK.map((h) => `\`${h}\``).join(" and ")} (postcode districts and monthly history).`, ""];
writeFileSync(join(OUT, "readme.md"), [...kept.slice(0, at), ...note, ...kept.slice(at)].join(nl));
console.log(`publish_pack: ${files.length} files to ${OUT} (held back: ${PACK_HELD_BACK.join(", ")})`);
