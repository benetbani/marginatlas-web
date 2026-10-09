/**
 * Plan v26 P7 — per-deploy smoke test.
 *
 * Run AFTER every Vercel deploy to verify production didn't silently
 * regress. Designed to catch the class of bug where a Vercel build
 * succeeds but produces broken artifacts (empty sitemaps, broken cell
 * pages, missing UI elements).
 *
 * Each assertion is a single curl + content check. Exits non-zero if
 * any assertion fails, so this can be wired into CI / a cron / a
 * GitHub Action with email-on-failure.
 *
 * THE SITEMAP ROWS ARE THE TABLE'S (P1-E, 2026-10-09). They were typed here, shards 0 to 5 each over 1 KB, and drifted: shard 5 had
 * failed since 2026-08-08, and the families split makes shards 1, 2, 4 and 5 empty by design. They are now read from
 * SITEMAP_FAMILIES (src/lib/seo/sitemap_families.ts) through scripts/lib/sitemap_shard_probes.ts: a listed shard answers a sitemap
 * over 1 KB, an empty shard a valid empty urlset, a reserved shard is not asked. Run it from the commit that was deployed, so the
 * table it reads is the one the site was built from.
 *
 * BY HAND ONLY. Nothing in the chain, the build or package.json runs it (docs/superpowers/specs/2026-05-22-monitoring-setup.md
 * proposes a GitHub Action for it; this repo has no .github folder). It needs the live site, so it cannot run offline; what it asks
 * of the sitemaps lives in scripts/lib/sitemap_shard_probes.ts, apart from the network, so that part runs without the site.
 *
 * Run: `npx tsx scripts/audit/deploy_smoke_test.ts`
 *   or `BASE=https://www.marginatlas.com npx tsx scripts/audit/deploy_smoke_test.ts`
 */
import { shardProbes } from "../lib/sitemap_shard_probes"; // an import also makes this file a module (no global-scope collisions)

const BASE = process.env.BASE || "https://www.marginatlas.com";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xml,*/*;q=0.8",
};

type Assertion = {
  name: string;
  url: string;
  check: (status: number, headers: Headers, body: string) => boolean;
  failReason?: string;
  /** What to do when it fails, printed after the reason (the sitemap rows name SITEMAP_FAMILIES). */
  remedy?: string;
};

const ASSERTIONS: Assertion[] = [
  {
    name: "Homepage returns 200",
    url: "/",
    check: (status) => status === 200,
  },
  {
    name: "Homepage has no 'Click for details' placeholder",
    url: "/",
    check: (_s, _h, body) => !body.includes("Click for details"),
  },
  /* One row per shard the table serves: the listed ones over 1 KB, the empty ones a valid empty urlset (SITEMAP_FAMILIES). */
  ...shardProbes(),
  {
    name: "/us/california/restaurants returns 200",
    url: "/us/california/restaurants",
    check: (status) => status === 200,
  },
  {
    name: "/de/frankfurt/restaurants renders 'Frankfurt am Main' label",
    url: "/de/frankfurt/restaurants",
    check: (_s, _h, body) =>
      /Frankfurt am Main/.test(body) && !/in DE\?/.test(body),
  },
  {
    name: "/fr/lyon/restaurants renders 'Lyon' label",
    url: "/fr/lyon/restaurants",
    check: (_s, _h, body) => /Lyon/.test(body),
  },
  {
    name: "Synthesized cell at /xx/yy/restaurants returns 200 with Estimated badge",
    url: "/xx/yy/restaurants",
    check: (status, _h, body) =>
      status === 200 && /Estimated benchmark/.test(body),
  },
  {
    name: "/og/cell returns image/* content-type",
    url: "/og/cell?country=us&geo=california&industry=restaurants",
    check: (status, headers) => {
      const ct = headers.get("content-type") || "";
      return status === 200 && ct.startsWith("image/");
    },
  },
  {
    name: "/industries page links to /industries/[slug] (not /us/california)",
    url: "/industries",
    check: (_s, _h, body) =>
      /href="\/industries\/restaurants"/.test(body) &&
      !/href="\/us\/california\/restaurants"/.test(body),
  },
  {
    name: "/sitemap.xml or /sitemap/0.xml is reachable as XML (not 404 catch-all)",
    url: "/sitemap/0.xml",
    check: (_s, headers) => {
      const ct = headers.get("content-type") || "";
      return ct.includes("xml");
    },
  },
  {
    name: "Robots.txt is plain text",
    url: "/robots.txt",
    check: (status, headers, body) => {
      const ct = headers.get("content-type") || "";
      return status === 200 && ct.includes("text") && body.includes("Sitemap:");
    },
  },
  {
    name: "Neighborhood route /us/new-york/manhattan/restaurants returns 200",
    url: "/us/new-york/manhattan/restaurants",
    check: (status, _h, body) =>
      status === 200 && /Manhattan/.test(body),
  },
];

async function probe(a: Assertion): Promise<{ pass: boolean; status: number; reason: string }> {
  try {
    const res = await fetch(BASE + a.url, {
      headers: HEADERS,
      redirect: "follow",
    });
    const status = res.status;
    let body = "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) {
      body = await res.text();
    }
    const pass = a.check(status, res.headers, body);
    const why = a.failReason || `assertion returned false (status=${status}, body length=${body.length})`;
    return {
      pass,
      status,
      reason: pass ? "" : a.remedy ? `${why}. Remedy: ${a.remedy}` : why,
    };
  } catch (e) {
    return {
      pass: false,
      status: 0,
      reason: `network error: ${(e as Error).message}`,
    };
  }
}

async function main() {
  console.log(`Smoke test against ${BASE}\n`);
  let pass = 0;
  let fail = 0;
  const failures: Array<{ name: string; reason: string }> = [];

  for (const a of ASSERTIONS) {
    process.stdout.write(`  ${a.name}... `);
    const r = await probe(a);
    if (r.pass) {
      console.log("PASS");
      pass++;
    } else {
      console.log(`FAIL (${r.reason})`);
      fail++;
      failures.push({ name: a.name, reason: r.reason });
    }
    await new Promise((res) => setTimeout(res, 200));
  }

  console.log(`\n=== Summary ===`);
  console.log(`  ${pass} / ${ASSERTIONS.length} pass`);
  if (fail > 0) {
    console.error(`\n=== Failures ===`);
    for (const f of failures) {
      console.error(`  ${f.name}: ${f.reason}`);
    }
    process.exit(1);
  }
}

main();
