/**
 * robots.txt and the edge's 451 list tell every crawler the same thing (P1-F of the page architecture, 2026-10-09; his "Adopt the
 * plan": Google-Extended allowed, Claude-SearchBot and Claude-User named, the harvesters blocked), and the two defects of
 * 2026-08-09 stay closed.
 *
 * 2026-08-09: /dev/ was crawlable (58 of 113 page routes, served at 200), and the sitemap list stopped at shard 4 while eight
 * shards were registered. 2026-10-09: robots.txt blocked Google-Extended, a token no request carries, and the edge's 451 list
 * held three harvesters robots.txt never named (Amazonbot, YouBot, ImagesiftBot); both now read src/lib/seo/crawlers.ts.
 *
 * THE EXPECTATIONS ARE TYPED HERE, on purpose: importing the list under test to build them would make this test agree with any
 * change it made.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/app/robots.test.ts
 */
import { NextRequest } from "next/server";
import robots from "../../src/app/robots";
import { routeRequest, AI_CRAWLER_PATTERNS } from "../../src/middleware";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "robots";
const FILE = "src/app/robots.ts";
const MW = "src/middleware.ts";
const REMEDY =
  "Change HARVESTERS, ANSWERING_AGENTS or INTERNALS in src/lib/seo/crawlers.ts: src/app/robots.ts and AI_CRAWLER_PATTERNS in src/middleware.ts both read them, so the two change together";
/* The sitemap rows name their own remedy: the table, not the crawler lists, is what they hold (P1-E, 2026-10-09). */
const SITEMAP_REMEDY =
  "Declare the listed shards of SITEMAP_FAMILIES (src/lib/seo/sitemap_families.ts) and no other: src/app/robots.ts and src/app/sitemap.ts both read it, so change these rows only when the table changes on purpose";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

const out = robots();
const groups = Array.isArray(out.rules) ? out.rules : [out.rules];
type Group = (typeof groups)[number];
const agentsOf = (g: Group) => ([] as string[]).concat(g.userAgent ?? "*");
const disallowOf = (g: Group) => ([] as string[]).concat(g.disallow ?? []);
const groupOf = (agent: string) => groups.find((g) => agentsOf(g).some((a) => a.toLowerCase() === agent.toLowerCase()));
const letIn = (agent: string) => { const g = groupOf(agent); return !!g && !disallowOf(g).includes("/"); };
const shutOut = (agent: string) => { const g = groupOf(agent); return !!g && disallowOf(g).includes("/"); };

/* THE ANSWERING AGENTS, Claude's two by name and Google-Extended among them (2026-10-09). */
const ANSWERING = ["ChatGPT-User", "PerplexityBot", "OAI-SearchBot", "Claude-SearchBot", "Claude-User", "Google-Extended"];
for (const a of ANSWERING) check(`${a} is named in the answering group and let in`, letIn(a) && groupOf(a) === groupOf("ChatGPT-User"));
for (const a of ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"]) check(`${a} is let in`, letIn(a));

/* THE HARVESTERS, blocked from everything: the split of 2026-08-01 less Google-Extended, and the three the edge alone refused. */
const HARVEST = ["GPTBot", "ClaudeBot", "anthropic-ai", "CCBot", "Bytespider", "cohere-ai", "FacebookBot", "Meta-ExternalAgent", "Diffbot", "Amazonbot", "YouBot", "ImagesiftBot"];
for (const a of HARVEST) check(`${a} is blocked from everything`, shutOut(a));

/* ROBOTS.TXT AND THE EDGE AGREE: every name a blocking group holds is answered 451, no name a group lets in is, and every 451
   pattern blocks a name robots.txt blocks. */
const blockedNames = groups.filter((g) => disallowOf(g).includes("/")).flatMap(agentsOf);
const allowedNames = groups.filter((g) => !disallowOf(g).includes("/")).flatMap(agentsOf).filter((a) => a !== "*");
const at451 = (name: string) => AI_CRAWLER_PATTERNS.some((re) => re.test(name));
const unrefused = blockedNames.filter((a) => !at451(a));
check(`every name robots.txt blocks is refused 451 at the edge${unrefused.length ? `: not refused ${unrefused.join(", ")}` : ""}`, blockedNames.length > 0 && unrefused.length === 0, MW);
const refusedButLetIn = allowedNames.filter(at451);
check(`no name robots.txt lets in is refused 451 at the edge${refusedButLetIn.length ? `: refused ${refusedButLetIn.join(", ")}` : ""}`, refusedButLetIn.length === 0, MW);
const strayPatterns = AI_CRAWLER_PATTERNS.filter((re) => !blockedNames.some((a) => re.test(a))).map(String);
check(`every 451 pattern blocks a name robots.txt blocks${strayPatterns.length ? `: ${strayPatterns.join(", ")}` : ""}`, strayPatterns.length === 0, MW);
check("google-extended left the 451 list (no request carries it; robots.txt alone reads it)", !at451("Google-Extended"), MW);

/* THE EDGE ITSELF, asked with each crawler's user agent in the form its operator publishes. */
let client = 0;
const statusFor = (ua: string) =>
  routeRequest(new NextRequest("https://www.marginatlas.com/gb", { headers: { host: "www.marginatlas.com", "user-agent": ua, "accept-language": "en-GB", "x-real-ip": `10.9.0.${client++}` } })).status;
const UA = {
  GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  ClaudeBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  "Claude-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
  "Claude-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +Claude-SearchBot@anthropic.com)",
  "ChatGPT-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
} as const;
check("GPTBot is answered 451 at the edge", statusFor(UA.GPTBot) === 451, MW);
check("ClaudeBot is answered 451 at the edge", statusFor(UA.ClaudeBot) === 451, MW);
for (const a of ["Claude-User", "Claude-SearchBot", "ChatGPT-User"] as const) check(`${a} is served at the edge, never 451`, statusFor(UA[a]) !== 451, MW);

/* THE WORKSHOP AND THE INTERNALS (2026-08-09): every group let in at all is kept out of /dev/, /api/, /_next/ and /admin. */
for (const g of groups) {
  const disallow = disallowOf(g);
  if (disallow.includes("/")) continue;
  const agents = agentsOf(g).join(", ");
  for (const required of ["/dev/", "/api/", "/_next/", "/admin"]) check(`[${agents}] disallows ${required}`, disallow.includes(required));
}

/* THE SITEMAPS BY FAMILY (P1-E, 2026-10-09): shards 0, 3, 6, 7 and 8 declared; 1, 2, 4 and 5 answer empty and are not; 9 to 12 are
   reserved. Typed here, not read from the table, for the reason in the header. */
const declared = ([] as string[]).concat(out.sitemap ?? []);
for (const id of [0, 3, 6, 7, 8]) check(`sitemap shard ${id} declared`, declared.includes(`https://www.marginatlas.com/sitemap/${id}.xml`), FILE, SITEMAP_REMEDY);
for (const id of [1, 2, 4, 5, 9, 10, 11, 12]) check(`sitemap shard ${id} NOT declared`, !declared.includes(`https://www.marginatlas.com/sitemap/${id}.xml`), FILE, SITEMAP_REMEDY);
check(`robots.txt declares five shards (${declared.length})`, declared.length === 5, FILE, SITEMAP_REMEDY);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("robots: all pass");
