/**
 * EVERY API ROUTE HAS A RATE LIMIT, OR SAYS WHY IT HAS NONE (the checkup of 2026-10-06): checkout, the billing portal, the
 * lookups, the take-home reveal and saved cells answered any number of requests from one address (the page limit in the
 * middleware skips /api). Each now calls `tooMany` or `checkRateLimit` (src/lib/rate_limit.ts); the routes below are exempt, each
 * with its reason. A new route under src/app/api reds until it does one or the other.
 *
 * Run: npx tsx tests/api/route_limits.test.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "api-route-limits";
const REMEDY = "call tooMany(req, \"<route>\", <limit>) at the top of each handler, or add the route to EXEMPT with its reason";
let failed = 0;
const check = (file: string, label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const EXEMPT: Record<string, string> = {
  "src/app/api/stripe/webhook/route.ts": "Stripe's own servers, every request signature-checked; a limit could drop a paying reader's event",
  "src/app/api/go/route.ts": "the no-script search's redirect: pure arithmetic on slugs, no database, no write, nothing to drain",
  "src/app/api/popular-cell-snapshot/route.ts": "takes no request and serves one cached answer",
};

function routes(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) routes(p, out);
    else if (name === "route.ts") out.push(p.split("\\").join("/"));
  }
  return out;
}

const all = routes("src/app/api");
for (const route of all) {
  const code = stripCommentLines(readFileSync(route, "utf8").split("\n")).join("\n");
  const limited = /\btooMany\(|\bcheckRateLimit\(/.test(code);
  if (EXEMPT[route]) check(route, `${route} is exempt (${EXEMPT[route]}) and carries no limit`, !limited);
  else check(route, `${route} limits its requests`, limited);
}
for (const route of Object.keys(EXEMPT)) check(route, `the exemption names a route that exists (${route})`, all.includes(route));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(`api/route_limits: all ${all.length} routes pass`);
