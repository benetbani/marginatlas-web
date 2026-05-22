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
 * Run: `npx tsx scripts/audit/deploy_smoke_test.ts`
 *   or `BASE=https://www.marginatlas.com npx tsx scripts/audit/deploy_smoke_test.ts`
 */
export {}; // make this file a module to avoid global-scope collisions

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
  {
    name: "Sitemap shard 0 (static + countries) > 1 KB",
    url: "/sitemap/0.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
  {
    name: "Sitemap shard 1 (US cells) > 1 KB",
    url: "/sitemap/1.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
  {
    name: "Sitemap shard 2 (regional cells) > 1 KB",
    url: "/sitemap/2.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
  {
    name: "Sitemap shard 3 (coverage) > 1 KB",
    url: "/sitemap/3.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
  {
    name: "Sitemap shard 4 (region-industry hubs) > 1 KB",
    url: "/sitemap/4.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
  {
    name: "Sitemap shard 5 (neighborhoods) > 1 KB",
    url: "/sitemap/5.xml",
    check: (status, _h, body) => status === 200 && body.length > 1024,
  },
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
    return {
      pass,
      status,
      reason: pass ? "" : a.failReason || `assertion returned false (status=${status}, body length=${body.length})`,
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
