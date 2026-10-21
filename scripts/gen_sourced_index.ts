/**
 * gen_sourced_index , writes src/lib/sourced/files.ts, the static imports of every file under data/sourced/ (scripts/lib/
 * sourced_index.mjs). Run after a data file is added or removed: node node_modules/tsx/dist/cli.mjs scripts/gen_sourced_index.ts
 */
import { writeFileSync } from "node:fs";
import { INDEX_FILE, indexSource, sourcedJsonFiles } from "./lib/sourced_index.mjs";

const files = sourcedJsonFiles();
writeFileSync(INDEX_FILE, indexSource(files));
console.log(`wrote ${INDEX_FILE}: ${files.length} files`);
