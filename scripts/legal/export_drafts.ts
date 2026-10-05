/**
 * scripts/legal/export_drafts.ts
 *
 * Writes the legal drafts (src/lib/legal/pro_legal.ts, the one source the terms, privacy and cookies pages draw from launch day)
 * to the markdown file he reads and approves (milestone 2, masterplan step 30). Not a gate: it writes outside the website.
 *
 *   npx tsx scripts/legal/export_drafts.ts [--out=<file>]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { PRO_LEGAL, toMarkdown } from "../../src/lib/legal/pro_legal";

const arg = process.argv.find((a) => a.startsWith("--out="));
const OUT = arg ? arg.slice("--out=".length) : "E:/atlas/design/loop/build/m2/legal/PRO-LEGAL-DRAFT.md";
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, toMarkdown(PRO_LEGAL), "utf8");
console.log(`wrote ${OUT}`);
