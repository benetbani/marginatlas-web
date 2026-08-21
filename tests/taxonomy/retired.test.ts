/**
 * tests/taxonomy/retired.test.ts
 *
 * Gate for the retirement record (src/lib/taxonomy/retired.ts) and the promise
 * it makes: no activity URL this atlas has ever published will 404.
 *
 * WHY THIS IS THE GATE THAT MATTERS MOST IN PHASE 1. Retiring 59 activities is
 * the largest deliberate removal of pages in this project's history, and the
 * founder's stated fear about it is search: "The issue is long term SEO/AEO,
 * that scares me." A retired page that 404s throws away whatever authority it
 * had AND adds a crawl error. A retired page that redirects hands that
 * authority to a page that still exists.
 *
 * The failure this guards against is silent in the worst way: a slug keyed
 * wrongly produces a map the middleware never matches, and the symptom is an
 * ordinary 404 rather than an error anybody would investigate.
 */
import { RETIRED, redirectFor } from "../../src/lib/taxonomy/retired";
import { isInScope } from "../../src/lib/taxonomy/scope_rules";
import { industryToSlug } from "../../src/lib/taxonomy";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import industriesJson from "../../src/lib/taxonomy/industries.json";

interface Industry {
  id: string;
  name: string;
  sector_id: string;
}
const INDUSTRIES = (industriesJson as unknown as { industries: Industry[] }).industries;

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
    if (detail) console.log(`        ${detail}`);
  }
}

const slugs = Object.keys(RETIRED);
console.log(`\n  ${slugs.length} retired slugs\n`);

check("the record is not empty", slugs.length > 0);

/* THE KEYING BUG THIS EXISTS FOR. The slug comes from the activity's NAME, not
   its id. Keyed by id, every entry here would be unmatchable by the middleware
   and the whole redirect layer would be inert while looking complete.

   Two legitimate sources of a key: an activity the taxonomy still lists (now
   out of scope), and a LEGACY slug from a past rename, which by definition no
   longer appears in the taxonomy. Anything outside both is a typo. */
const liveSlugs = new Set(INDUSTRIES.map((i) => industryToSlug(i.id)));
const legacySlugs = new Set(Object.keys(TAXONOMY_REDIRECTS));
const unmatchable = slugs.filter((s) => !liveSlugs.has(s) && !legacySlugs.has(s));
check(
  "every retired slug is either a real activity or a known legacy slug",
  unmatchable.length === 0,
  unmatchable.join(", "),
);

/* THE CHAIN COLLAPSE, asserted. Every legacy slug pointing at a retired
   activity must have its own direct entry, or the reader takes two hops. */
const uncollapsed = Object.entries(TAXONOMY_REDIRECTS).filter(
  ([from, to]) => liveSlugs.has(to) && !RETIRED[from] && RETIRED[to],
);
check(
  "no legacy slug reaches a retired activity in two hops",
  uncollapsed.length === 0,
  uncollapsed.map(([f, t]) => `${f} -> ${t} -> /industries`).join(", ") +
    (uncollapsed.length ? "  , re-run scripts/gen_retired.ts" : ""),
);

/* The record must agree with the rules that generated it. If someone edits the
   rules and forgets to re-run the generator, this is what says so. */
const shouldBeRetired = new Set(
  INDUSTRIES.filter((i) => !isInScope(i).inScope).map((i) => industryToSlug(i.id)),
);
const missing = [...shouldBeRetired].filter((s) => !RETIRED[s]);
const extra = slugs.filter((s) => !shouldBeRetired.has(s) && !TAXONOMY_REDIRECTS[s]);
check(
  "every out-of-scope activity is in the record",
  missing.length === 0,
  missing.length ? `not retired: ${missing.join(", ")} , re-run scripts/gen_retired.ts` : "",
);
check(
  "nothing in-scope was retired by accident",
  extra.length === 0,
  extra.length ? `wrongly retired: ${extra.join(", ")}` : "",
);

let noReason = 0;
let selfRedirect = 0;
let emptyTarget = 0;
let relativeTarget = 0;

for (const [slug, entry] of Object.entries(RETIRED)) {
  if (!entry.reason || entry.reason.length < 10) noReason++;
  if (!entry.redirectTo) emptyTarget++;
  if (entry.redirectTo === `/industries/${slug}`) selfRedirect++;
  if (entry.redirectTo && !entry.redirectTo.startsWith("/")) relativeTarget++;
}

check("every entry carries a reason a human can audit", noReason === 0, `${noReason} without one`);
check("every entry has a destination", emptyTarget === 0, `${emptyTarget} without one`);
check("no entry redirects to itself, which would loop", selfRedirect === 0, `${selfRedirect} self-referential`);
check("every destination is site-absolute", relativeTarget === 0, `${relativeTarget} relative`);

/* A REDIRECT INTO A RETIRED PAGE IS A CHAIN, and search engines treat a chain
   as a soft 404. Phase 2 adds merged activities pointing at survivors, which is
   exactly where this can start happening, so the check is in place before it
   can. */
const chains = Object.entries(RETIRED).filter(([, e]) => {
  const m = /^\/industries\/([a-z0-9-]+)$/.exec(e.redirectTo);
  return m ? Boolean(RETIRED[m[1]]) : false;
});
check(
  "no redirect points at another retired page",
  chains.length === 0,
  chains.map(([s, e]) => `${s} -> ${e.redirectTo}`).join(", "),
);

/* THE COUPLING TO THE MIDDLEWARE, asserted rather than assumed. The redirect
   only fires for paths matching `^/industries/([a-z0-9-]+)/?$`. A slug carrying
   any other character is in this record, resolvable by `redirectFor`, and still
   404s in a browser, which is the one failure mode that would survive every
   other check on this page. Kept as a character-class assertion rather than a
   copy of the route regex, so the two cannot drift into disagreement. */
const unroutable = slugs.filter((s) => !/^[a-z0-9-]+$/.test(s));
check(
  "every retired slug can match the middleware's URL pattern",
  unroutable.length === 0,
  unroutable.join(", "),
);

check("resolves a destination for a retired slug", Boolean(redirectFor(slugs[0])));
check("returns null for a live slug", redirectFor("restaurants") === null);
check("returns null for a slug that does not exist at all", redirectFor("not-a-real-activity") === null);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
