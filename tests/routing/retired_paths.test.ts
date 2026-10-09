/**
 * A retired trade under a place goes to the nearest live page in one hop (milestone 1, M1; his interview of 2026-09-26, answer 12;
 * QUEUE launch:retired-trades-live). Production answered 200 with a default page for `/gb/london/banking` on 2026-10-04.
 *
 * Run: npx tsx tests/routing/retired_paths.test.ts
 */
import { retiredPlaceTarget } from "../../src/lib/taxonomy/retired_paths";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "retired-paths";
const FILE = "src/lib/taxonomy/retired_paths.ts";
const REMEDY = "send a retired trade's path under a place a table holds to its successor in the same place, else the place's own page, in one hop";
/* A place no table holds is the opposite case: no hop at all, so a red on those rows must not tell the reader to send it to a page. */
const GUARD_REMEDY = "send a place no table holds nowhere: retiredPlaceTarget returns null when placeNotHeldIn (src/lib/routing/place_words.ts) says so, and the edge answers 404 for it (src/lib/routing/edge_not_found.ts)";
const ENCODED_REMEDY = "read the place as its route does, percent-decoded and lowercased (routeWord in src/lib/routing/place_words.ts, which placeNotHeldIn uses): an accented place the table holds is held, so its retired trade goes to the country's page";
let failed = 0;
const check = (label: string, ok: boolean, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy });
};

const at = (p: string) => retiredPlaceTarget(p);
check(`retired with no successor, under a city: /gb/london/banking to the city's page (${at("/gb/london/banking")})`, at("/gb/london/banking") === "/cities/london");
check(`retired with no successor, under a region: /us/new-york/banking to the state's page (${at("/us/new-york/banking")})`, at("/us/new-york/banking") === "/us/new-york");
check(`merged into a live trade: /gb/london/sit-down-restaurants to restaurants in London (${at("/gb/london/sit-down-restaurants")})`, at("/gb/london/sit-down-restaurants") === "/gb/london/restaurants");
check(`merged, under a region: /us/california/plumbing-services to plumbers in California (${at("/us/california/plumbing-services")})`, at("/us/california/plumbing-services") === "/us/california/plumbers");
check("a place no table holds: no hop, the edge's 404 (P1-A, 2026-10-09)", at("/gb/atlantis/banking") === null, GUARD_REMEDY);
check(`a place a table holds that is neither a region nor a listed city: the country's page (${at("/gb/liverpool/banking")})`, at("/gb/liverpool/banking") === "/gb");
/* The places the table spells with an accent (the review of 2026-10-09): the middleware hands this function the percent-encoded address,
   and the table holds the decoded word, as the route receives it. */
check(`an accented place the table holds, percent-encoded as the middleware sees it: /br/s%c3%a3o-paulo/banking to the country's page (${at("/br/s%c3%a3o-paulo/banking")})`, at("/br/s%c3%a3o-paulo/banking") === "/br", ENCODED_REMEDY);
check("an accented place no table holds, percent-encoded: no hop, the edge's 404", at("/br/s%c3%a3o-atlantis/banking") === null, GUARD_REMEDY);
check("any case: /GB/London/Banking as /gb/london/banking", at("/GB/London/Banking") === "/cities/london");
check("a live trade stays where it is", at("/gb/london/restaurants") === null);
check("not a place path: /industries/banking (the middleware's own block)", at("/industries/banking") === null);
check("not a place path: /cities/london/banking", at("/cities/london/banking") === null);
check("a country's static child is no place: /gb/how-to-open/banking", at("/gb/how-to-open/banking") === null);
check("not a country: /zz/london/banking", at("/zz/london/banking") === null);

/* Every successor is a live trade (never itself retired, never unknown), so a merge never lands on a second hop or a 404. */
const live = new Set(Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((s) => !(s in RETIRED)));
const bad = Object.entries(RETIRED)
  .map(([slug, e]) => [slug, /^\/industries\/([a-z0-9-]+)$/.exec(e.redirectTo)?.[1]] as const)
  .filter(([, to]) => to !== undefined && !live.has(to as string))
  .map(([slug, to]) => `${slug} to ${to}`);
check(`every merge's successor is a live trade${bad.length ? `: ${bad.join(", ")}` : ""}`, bad.length === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("routing/retired_paths: all pass");
