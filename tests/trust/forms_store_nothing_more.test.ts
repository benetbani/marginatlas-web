/**
 * THE FORMS STORE WHAT THE READER GAVE AND NOTHING MORE (the checkup of 2026-10-06): the privacy page says the site holds "what
 * you gave us and nothing more", and the contact and correction forms stored the sender's IP address and user agent, which
 * nothing ever read. Holds that no form route writes either again (the rate limits read the address in memory only), and that
 * the privacy page still makes the promise this holds.
 *
 * Run: npx tsx tests/trust/forms_store_nothing_more.test.ts
 */
import { readFileSync } from "node:fs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "forms-minimal";
const REMEDY = "store only what the reader typed; read an address in memory for a rate limit, never into a row";
let failed = 0;
const check = (file: string, label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const ROUTES = ["src/app/api/contact/route.ts", "src/app/api/correction/route.ts", "src/app/api/newsletter/route.ts"];
for (const route of ROUTES) {
  const code = stripCommentLines(readFileSync(route, "utf8").split("\n")).join("\n");
  const stored = /\b(ip|user_agent|ip_address)\s*:/.test(code);
  check(route, `${route} stores no IP address or user agent`, !stored);
}
const privacy = readFileSync("src/app/(site)/privacy/page.tsx", "utf8");
check("src/app/(site)/privacy/page.tsx", "the privacy page still promises what this holds", privacy.includes("what you gave us and nothing more"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/forms_store_nothing_more: all pass");
