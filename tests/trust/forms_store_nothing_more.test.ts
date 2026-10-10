/**
 * THE FORMS STORE WHAT THE READER GAVE AND NOTHING MORE (the checkup of 2026-10-06): the privacy page says the site holds "what
 * you gave us and nothing more", and the contact and correction forms stored the sender's IP address and user agent, which
 * nothing ever read. Holds that no form route writes either again (the rate limits read the address in memory only), and that
 * the privacy page still makes the promise this holds.
 *
 * Run: npx tsx tests/trust/forms_store_nothing_more.test.ts
 */
import { readFileSync } from "node:fs";
import ts from "typescript";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "forms-minimal";
const REMEDY = "store only what the reader typed; read an address in memory for a rate limit, never into a row";
let failed = 0;
const check = (file: string, label: string, ok: boolean, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

const ROUTES = ["src/app/api/contact/route.ts", "src/app/api/correction/route.ts", "src/app/api/newsletter/route.ts"];
for (const route of ROUTES) {
  const code = stripCommentLines(readFileSync(route, "utf8").split("\n")).join("\n");
  const stored = /\b(ip|user_agent|ip_address)\s*:/.test(code);
  check(route, `${route} stores no IP address or user agent`, !stored);
}
/* NO CONSOLE CALL HOLDS WHAT THE READER TYPED (cleanup round 2, item 4). The newsletter route logged the address when an insert
   failed ("would insert: <email>"): a console line reaches the host's logs and, as a breadcrumb, every error report Sentry sends
   (its trail holds console lines, which the privacy page now says). A failure is logged with the error's code and message and
   nothing the reader wrote. The scan is the route's syntax, not its text: any variable inside a console call's arguments named for
   what was typed (the address, the raw body value, the row built from it, the body, a message, a name) reds, whatever it is wrapped
   in; a property read off another object (error.message) is not a variable. BLIND SPOT: it reads names, so a value copied into a
   variable called something else would pass; the three routes hold no such copy today. */
const TYPED = new Set(["email", "raw", "row", "body", "message", "name"]);
function consoleCallsHolding(file: string): string[] {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const found: string[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) && n.expression.expression.text === "console") {
      const seen = new Set<string>();
      const look = (m: ts.Node): void => { if (ts.isIdentifier(m) && TYPED.has(m.text) && !(ts.isPropertyAccessExpression(m.parent) && m.parent.name === m)) seen.add(m.text); ts.forEachChild(m, look); };
      n.arguments.forEach(look);
      if (seen.size) found.push(`console.${n.expression.name.text} on line ${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} names ${[...seen].join(" and ")}`);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}
for (const route of ROUTES) {
  const held = consoleCallsHolding(route);
  check(route, `${route} logs nothing the reader typed: no console call names the address, the body or the row (${held.join(", ") || "none"})`, held.length === 0, "log a failure with the error's code and message only (error.code, error.message), never the address or anything else the reader wrote: a console line reaches the host's logs and, as a breadcrumb, every error report");
}
const privacy = readFileSync("src/app/(site)/privacy/page.tsx", "utf8");
check("src/app/(site)/privacy/page.tsx", "the privacy page still promises what this holds", privacy.includes("what you gave us and nothing more"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/forms_store_nothing_more: all pass");
