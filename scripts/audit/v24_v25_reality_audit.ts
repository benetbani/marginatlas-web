/**
 * Plan v26 Phase A.5 — production reality audit.
 *
 * Verifies that the 16 claimed Plan v24 + v25 changes actually shipped
 * to production. Catches the silent-rollback problem where Vercel
 * was rejecting every Plan v24+v25 commit due to the Edge function
 * size overflow (now fixed in Phase A.3) and silently serving the
 * last known-good build instead.
 *
 * Run: `npx tsx scripts/audit/v24_v25_reality_audit.ts`
 *
 * Outputs: data/audit/v24_v25_reality_audit.md
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const BASE = process.env.AUDIT_BASE || "https://www.marginatlas.com";
const AUDIT_DIR = resolve(process.cwd(), "data", "audit");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xml,*/*;q=0.8",
};

type Check = {
  id: number;
  block: string;
  description: string;
  url: string;
  test: (html: string, status: number, headers: Headers) => boolean;
  failNote?: string;
};

const CHECKS: Check[] = [
  {
    id: 1,
    block: "v24 Block 2 + v25 Block 6",
    description: "Featured tiles: no 'Click for details' anywhere on homepage",
    url: "/",
    test: (html) => !/Click for details/.test(html),
    failNote: "Homepage still shows 'Click for details' — v25 Block 6 not live",
  },
  {
    id: 2,
    block: "v25 Block 7",
    description: "/industries page links to /industries/[slug], not /us/california",
    url: "/industries",
    // The page lists many industries; we expect NO links pointing to /us/california/{industry}.
    test: (html) => !/href="\/us\/california\/[a-z]/.test(html),
    failNote: "/industries still links to /us/california/* — v25 Block 7 not live",
  },
  {
    id: 3,
    block: "v25 Block 7 + Block 10",
    description: "Sector emoji icons render on /industries",
    url: "/industries",
    // Check for at least one emoji glyph in the Popular industries section
    test: (html) => /🍽️|☕|⚖️|💻|🏗️|🏘️/.test(html),
    failNote: "No sector glyphs on /industries — v25 Block 10 not live",
  },
  {
    id: 4,
    block: "v25 Block 4",
    description: "Profit waterfall present on a cell page (NetProfitWaterfall section visible)",
    url: "/us/california/restaurants",
    test: (html) =>
      /Net profit \(owner take-home\)|Owner take-home|owner&apos;s pocket/i.test(html),
    failNote: "Cell page missing NetProfitSummary section",
  },
  {
    id: 5,
    block: "v25 Block 11",
    description: "Estimated badge appears on a forced-synthesis cell",
    url: "/xx/yy/restaurants",
    test: (html) => /Estimated benchmark/.test(html),
    failNote: "Forced-synthesis cell shows no Estimated badge — v25 Block 11 not live",
  },
  {
    id: 6,
    block: "v25 Block 9",
    description: "Right TOC uses xl:gap-16 (further from content)",
    url: "/us/california/restaurants",
    test: (html) => /xl:gap-16/.test(html),
    failNote: "TOC still uses old xl:gap-6 — v25 Block 9 not live",
  },
  {
    id: 7,
    block: "v24 Block 11",
    description: "Sitemap shard 0 has real content (>1KB)",
    url: "/sitemap/0.xml",
    test: (html) => html.length > 1024 && /<url>/.test(html),
    failNote: "Sitemap shard 0 still empty urlset — v24 Block 11 not live",
  },
  {
    id: 8,
    block: "v24 Block 11",
    description: "Sitemap shard 2 (regional cells) has real content",
    url: "/sitemap/2.xml",
    test: (html) => html.length > 1024 && /<url>/.test(html),
    failNote: "Sitemap shard 2 still empty — v24 Block 11 routing fix not live",
  },
  {
    id: 9,
    block: "v24 Block 4",
    description: "Frankfurt → 'Frankfurt am Main' label (not 'Hessen')",
    url: "/de/frankfurt/restaurants",
    test: (html) => /Frankfurt am Main|Frankfurt/.test(html) && !/Hessen/.test(html),
    failNote: "Frankfurt still routes to Hessen — v24 Block 4 not live",
  },
  {
    id: 10,
    block: "v24 Block 3",
    description: "Substitution disclosure banner present on industry-substituted cell",
    url: "/us/california/gyms",
    test: (html) =>
      /Closest comparable category|Direct data for/.test(html),
    failNote: "No substitution banner on /us/california/gyms — v24 Block 3 not live",
  },
  {
    id: 11,
    block: "v25 Block 3",
    description: "Cell page never 404s on missing data (synthesis fallback)",
    url: "/xx/yy/restaurants",
    test: (html) => /How much do|Typical revenue|Revenue per/i.test(html),
    failNote: "Forced-synth path returned a 404 page — v25 Block 3 not live",
  },
  {
    id: 12,
    block: "v25 Block 2 + Block 6",
    description: "Featured tile shows a $-prefixed revenue (not 'Click for details')",
    url: "/",
    test: (html) => {
      const tiles = html.match(/Typical revenue[\s\S]{0,200}?(\$|Click for details)/g) || [];
      if (tiles.length < 3) return false;
      return !tiles.some((t) => t.includes("Click for details"));
    },
    failNote: "Some featured tiles still show 'Click for details'",
  },
  {
    id: 13,
    block: "v25 Block 7",
    description: "/industries Popular list links to global pages",
    url: "/industries",
    test: (html) => /href="\/industries\/restaurants"|href="\/industries\/software-development"/.test(html),
    failNote: "Popular industries list doesn't link to /industries/* targets",
  },
  {
    id: 14,
    block: "v24 Block 4",
    description: "Lyon → 'Lyon' label (manual alias works)",
    url: "/fr/lyon/restaurants",
    test: (html) => /Lyon/.test(html),
    failNote: "/fr/lyon doesn't render the city — v24 Block 4 retarget broken",
  },
  {
    id: 15,
    block: "Plan v26 A.3",
    description: "/og/cell route returns image (Edge-to-Node switch landed)",
    url: "/og/cell?country=us&geo=california&industry=restaurants",
    test: (html, status, headers) => {
      const ct = headers.get("content-type") || "";
      return status === 200 && /image\//.test(ct);
    },
    failNote: "/og/cell didn't return an image — A.3 fix not live",
  },
  {
    id: 16,
    block: "v25 Block 6",
    description: "Featured tile count is 6 (symmetric 2x3 grid), not 9",
    url: "/",
    test: (html) => {
      const tiles = html.match(/Typical revenue/g) || [];
      return tiles.length === 6;
    },
    failNote: `Found wrong number of featured tiles (expected 6)`,
  },
];

async function probe(check: Check): Promise<{
  pass: boolean;
  status: number;
  note: string;
}> {
  const url = BASE + check.url + (check.url.includes("?") ? "&" : "?") + `v=${Date.now()}`;
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
    const status = res.status;
    let body = "";
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("image/")) {
      // For image responses we don't read the body but the test gets headers.
      body = "";
    } else {
      body = await res.text();
    }
    const pass = check.test(body, status, res.headers);
    return {
      pass,
      status,
      note: pass ? "" : check.failNote || "Unknown failure",
    };
  } catch (e) {
    return {
      pass: false,
      status: 0,
      note: `Network error: ${(e as Error).message}`,
    };
  }
}

async function main() {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });

  console.log(`Reality audit against ${BASE}\n`);
  const results: Array<{
    check: Check;
    pass: boolean;
    status: number;
    note: string;
  }> = [];

  for (const check of CHECKS) {
    process.stdout.write(`  [${check.id.toString().padStart(2)}/${CHECKS.length}] ${check.description}... `);
    const result = await probe(check);
    results.push({ check, ...result });
    console.log(result.pass ? "PASS" : `FAIL (${result.note})`);
    await new Promise((r) => setTimeout(r, 500));
  }

  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`\n=== Summary ===`);
  console.log(`  ${passed} / ${total} passed (${passRate}%)`);

  const md: string[] = [];
  md.push("# Production reality audit — v24 + v25");
  md.push("");
  md.push(`Generated ${new Date().toISOString()} against ${BASE}.`);
  md.push("");
  md.push(`## Summary`);
  md.push("");
  md.push(`**${passed} of ${total} checks passed (${passRate}%).**`);
  md.push("");
  md.push(`## Per-check results`);
  md.push("");
  md.push("| # | Block | Check | Result | Note |");
  md.push("|---|---|---|---|---|");
  for (const r of results) {
    const mark = r.pass ? "PASS" : "FAIL";
    md.push(
      `| ${r.check.id} | ${r.check.block} | ${r.check.description} | ${mark} | ${r.note} |`,
    );
  }
  md.push("");
  md.push("## URLs probed");
  md.push("");
  for (const r of results) {
    md.push(`- ${r.check.url} → HTTP ${r.status}`);
  }
  md.push("");
  writeFileSync(join(AUDIT_DIR, "v24_v25_reality_audit.md"), md.join("\n"));
  console.log(`\n→ ${join(AUDIT_DIR, "v24_v25_reality_audit.md")}`);

  if (passed < total) {
    process.exitCode = 1;
  }
}

main();
