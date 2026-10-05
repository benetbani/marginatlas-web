/**
 * WHERE A SIGNED-IN READER OF A LOCKED UK PAGE GOES (milestone 2, masterplan step 18): a reader holding a session cookie on a
 * page the paywall locks is sent to the uncached mirror under /pro; nobody else, and nowhere else.
 *
 * Run: npx tsx tests/monetization/pro_route.test.ts
 */
import { proRewrite } from "../../src/lib/monetization/pro_route";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "pro-route";
const FILE = "src/lib/monetization/pro_route.ts";
const REMEDY = "send only a signed-in reader of a page that locks to /pro, and only while the paywall is on";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const session = ["sb-abcd-auth-token"];
check("/gb with a session goes to /pro/gb", proRewrite("/gb", session, true) === "/pro/gb");
check("a London trade page with a chunked session cookie goes to its mirror", proRewrite("/gb/london/restaurants", ["sb-abcd-auth-token.0"], true) === "/pro/gb/london/restaurants");
check("London's city page goes to its mirror", proRewrite("/cities/london", session, true) === "/pro/cities/london");
check("a city outside the UK does not", proRewrite("/cities/paris", session, true) === null);
check("the district hub locks nothing, so it does not", proRewrite("/cities/london/neighborhoods", session, true) === null);
check("no session, no mirror", proRewrite("/gb", [], true) === null);
check("another cookie is not a session", proRewrite("/gb", ["sb-abcd-auth-token-code-verifier", "theme"], true) === null);
check("the paywall off, no mirror", proRewrite("/gb", session, false) === null);
check("the how-to page has no chapters, so it does not", proRewrite("/gb/how-to-open", session, true) === null);
check("/gb/london/industries is a static page, not a trade", proRewrite("/gb/london/industries", session, true) === null);
check("another country's page does not", proRewrite("/fr", session, true) === null);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/pro_route: all pass");
