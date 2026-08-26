/**
 * Confirm the orphan list with COMMENTS STRIPPED, because the naive grep that
 * checked it found only comment mentions and would have saved files that
 * nothing imports.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { stripCommentLines } from "../scripts/lib/strip_comments";

const ORPHANS = [
  "TurnoverBandChip", "MastheadImage", "CountryMastheadImage", "AnnualCostStack",
  "SubIndustryPicker", "Archetypes", "Fitgrid", "HexLens", "Hoodcards", "Matrix",
  "Quad", "SparkTrend", "Tline", "Voices", "Wealth", "Zonecard", "calc-config",
  "bar-list",
];

const files: string[] = [];
(function walk(d: string) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if ([".ts", ".tsx"].includes(extname(p))) files.push(relative(process.cwd(), p).split(sep).join("/"));
  }
})("src");

for (const name of ORPHANS) {
  const hits: string[] = [];
  for (const f of files) {
    /* Never count the file's own definition. */
    if (f.includes(`/${name}.`)) continue;
    const code = stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
    /* Only an IMPORT or a JSX use counts as a call site. */
    const imported = new RegExp(`from\\s+["'][^"']*${name}["']`).test(code);
    const used = new RegExp(`<${name}[\\s/>]`).test(code);
    if (imported || used) hits.push(`${f}${imported ? " [import]" : ""}${used ? " [jsx]" : ""}`);
  }
  console.log(`  ${hits.length === 0 ? "ORPHAN " : "IN USE "} ${name.padEnd(22)} ${hits.slice(0, 3).join("  ") || ""}`);
}
