/**
 * robots.txt policy test (2026-08-09).
 *
 * TWO DEFECTS, both found by reading the file rather than the served output.
 *
 * 1. /dev/ was crawlable. 58 of this repository's 113 page routes live under
 *    src/app/dev, they are served at 200 in production, and robots.txt withheld
 *    /api/, /_next/ and /admin but never them. /dev/cell2 alone is 202KB of
 *    public HTML. They are prototypes: the workshop, not the shop.
 *
 * 2. The sitemap list stopped at shard 4. generateSitemaps registers EIGHT
 *    shards. Shard 6 (cities, 525 URLs) and shard 7 (the learn corpus, 55) were
 *    never declared, so 580 live URLs were invisible in the one file a crawler
 *    reads to find them. Shard 5 stays off the list on purpose: the
 *    neighbourhood pages were withdrawn from the index on 2026-08-08.
 *
 * Follows this repository's test idiom: a bare tsx script that prints PASS/FAIL
 * per case and exits 1 on any failure. No framework is installed and none is
 * needed.
 */
import robots from "../../src/app/robots";

const out = robots();
const groups = Array.isArray(out.rules) ? out.rules : [out.rules];

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

/* Every group that is allowed in at all must be kept out of /dev/. A group that
   is already disallowed from "/" wholesale (the training harvesters) needs no
   /dev/ entry, and demanding one would be a rule about nothing. */
for (const g of groups) {
  const agents = ([] as string[]).concat(g.userAgent ?? "*").join(", ");
  const disallow = ([] as string[]).concat(g.disallow ?? []);
  const blanketBlocked = disallow.includes("/");
  if (blanketBlocked) {
    check(`[${agents}] blocked wholesale, no /dev/ rule needed`, true);
    continue;
  }
  check(`[${agents}] disallows /dev/`, disallow.includes("/dev/"), `got ${JSON.stringify(disallow)}`);
}

/* The internals that were already withheld must stay withheld. This is the
   regression half: it is easy to rewrite a disallow list and drop one. */
for (const g of groups) {
  const disallow = ([] as string[]).concat(g.disallow ?? []);
  if (disallow.includes("/")) continue;
  const agents = ([] as string[]).concat(g.userAgent ?? "*").join(", ");
  for (const required of ["/api/", "/_next/", "/admin"]) {
    check(`[${agents}] still disallows ${required}`, disallow.includes(required));
  }
}

/* Shard 5 is empty by decision, so it is the one id that must NOT be declared.
   Every other registered shard must be. Hard-coded rather than imported from
   sitemap.ts, deliberately: importing the module under test to build the
   expectation would make this test agree with any change it made. */
const declared = ([] as string[]).concat(out.sitemap ?? []);
for (const id of [0, 1, 2, 3, 4, 6, 7]) {
  const url = `https://www.marginatlas.com/sitemap/${id}.xml`;
  check(`sitemap shard ${id} declared`, declared.includes(url));
}
check(
  "sitemap shard 5 NOT declared (withdrawn 2026-08-08)",
  !declared.includes("https://www.marginatlas.com/sitemap/5.xml"),
);

if (failed > 0) {
  console.error(`robots: ${failed} failures`);
  process.exit(1);
}
console.log("robots: all pass");
