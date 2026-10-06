/**
 * NO FILTER CHIPS ON /extremes (QUEUE ui:extremes-chips; his refusals of 2026-09-22 name filter chips). The page draws every
 * lens as a section, in order, with its anchor. Run: npx tsx tests/trust/no_lens_chips.test.ts
 */
import { existsSync, readFileSync } from "node:fs";

let failed = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const page = readFileSync("src/app/(site)/extremes/page.tsx", "utf8");
check("the page mounts no LensFilter", !/LensFilter/.test(page));
check("the chip component is gone", !existsSync("src/components/extremes/LensFilter.tsx"));
check("every lens is drawn as a section with its anchor", /lenses\.map\(\(l\) => \(\s*<section key=\{l\.key\} id=\{l\.key\}/.test(page));
if (failed > 0) { console.error(`trust/no_lens_chips: ${failed} failure(s). Remedy: draw every lens as a section in src/app/(site)/extremes/page.tsx and delete src/components/extremes/LensFilter.tsx, then run npx tsx tests/trust/no_lens_chips.test.ts`); process.exit(1); }
console.log("trust/no_lens_chips: all pass");
