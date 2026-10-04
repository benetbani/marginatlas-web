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
const REMEDY = "send a retired trade's place path to its successor in the same place, else the place's own page, in one hop";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const at = (p: string) => retiredPlaceTarget(p);
check(`retired with no successor, under a city: /gb/london/banking to the city's page (${at("/gb/london/banking")})`, at("/gb/london/banking") === "/cities/london");
check(`retired with no successor, under a region: /us/new-york/banking to the state's page (${at("/us/new-york/banking")})`, at("/us/new-york/banking") === "/us/new-york");
check(`merged into a live trade: /gb/london/sit-down-restaurants to restaurants in London (${at("/gb/london/sit-down-restaurants")})`, at("/gb/london/sit-down-restaurants") === "/gb/london/restaurants");
check(`merged, under a region: /us/california/plumbing-services to plumbers in California (${at("/us/california/plumbing-services")})`, at("/us/california/plumbing-services") === "/us/california/plumbers");
check("a place the country does not hold: the country's page", at("/gb/atlantis/banking") === "/gb");
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
