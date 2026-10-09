/**
 * scripts/seo/indexnow.ts
 *
 * INDEXNOW, BY HAND, AFTER A DEPLOY HE APPROVED (P1-G of the page architecture, 2026-10-09). IndexNow needs no account: the key
 * below is served at KEY_LOCATION (public/<key>.txt), and Bing, Yandex and the protocol's other engines read a post of the
 * addresses whose status changed. It never runs in the gate chain or the build (the gate indexnow holds that): it talks to the
 * network, and a post is his to make.
 *
 * usage, from E:/atlas/website:
 *   node node_modules/tsx/dist/cli.mjs scripts/seo/indexnow.ts --phase1                    the addresses Phase 1 changed: a dry run
 *   node node_modules/tsx/dist/cli.mjs scripts/seo/indexnow.ts --list=<file>               one address a line (a path, or a full
 *                                                                                           address on www.marginatlas.com): a dry run
 *   add --send to post them, BATCH to a request; add --from-batch=<n> to resume after a 429
 * A dry run prints what it would send and touches nothing.
 *
 * WHAT PHASE 1'S LIST LEAVES OUT: the /opening and /buy-or-start pages of every place but London also lost their index status;
 * they are linked only from their trade pages and are left to the next crawl.
 */
import { readFileSync } from "node:fs";
import { COUNTRIES, SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { hasOwn } from "../../src/lib/own";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { hasRegionalCoverage } from "../../src/lib/coverage/regional";
import { getAdmin1Regions } from "../../src/lib/coverage/admin1";
import { CITY_SLUGS_BY_COUNTRY } from "../../src/lib/routing/city_paths_generated";
import { NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { US_DESCRIPTION_SLUGS } from "../../src/lib/routing/place_slugs_generated";
import census from "../../data/seo/floor_census.json";

export const INDEXNOW_KEY = "69fd594eb74f011d470c833c8baab986";
export const INDEXNOW_HOST = "www.marginatlas.com";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const KEY_FILE = `public/${INDEXNOW_KEY}.txt`;
export const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
/** The protocol's limit of addresses to one post. */
export const BATCH = 10_000;

export type Phase1Set = { name: string; addresses: string[] };

/** The addresses Phase 1 changed (P1-B), set by set: each was indexable before and is noindex now. */
export function phase1Sets(): Phase1Set[] {
  const live = Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((s) => !hasOwn(RETIRED, s)).sort();
  const countryHubs = COUNTRIES.map((c) => `/${c.code.toLowerCase()}/industries`);
  const regionHubs = COUNTRIES.filter((c) => hasRegionalCoverage(c.code)).flatMap((c) =>
    getAdmin1Regions(c.code).map((r) => `/${c.code.toLowerCase()}/${r.slug.toLowerCase()}/industries`),
  );
  const ukPlaces = [...(CITY_SLUGS_BY_COUNTRY.gb ?? []).filter((s) => s !== "london"), ...getRegionsForCountry("GB", "United Kingdom").map((r) => r.value), "gb"];
  const ukTrades = ukPlaces.flatMap((p) => live.map((s) => `/gb/${p}/${s}`));
  const usDescribed = Object.keys((census as { pages: Record<string, unknown> }).pages).filter((p) => {
    const parts = p.split("/").filter(Boolean);
    return parts.length === 3 && parts[0] === "us" && US_DESCRIPTION_SLUGS.has(parts[2]);
  });
  const decidePairs = Object.keys(NEIGHBORHOOD_SLUGS).sort().flatMap((city) => live.map((s) => `/decide/${s}/${city}`));
  return [
    { name: "the country industries hubs", addresses: countryHubs },
    { name: "the region industries hubs", addresses: regionHubs },
    { name: "the UK trade pages off London", addresses: ukTrades },
    { name: "the United States pages named by a census description", addresses: usDescribed },
    { name: "the /decide pairs", addresses: decidePairs },
  ];
}

/** Lines to the site's full addresses, once each: a path or a full https address on the host; blanks and # notes skipped. */
export function toUrls(lines: readonly string[]): { urls: string[]; refused: string[] } {
  const urls: string[] = [];
  const refused: string[] = [];
  const seen = new Set<string>();
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    let url: URL | null = null;
    try {
      url = new URL(line.startsWith("/") ? `https://${INDEXNOW_HOST}${line}` : line);
    } catch {
      url = null;
    }
    if (!url || url.host !== INDEXNOW_HOST || url.protocol !== "https:") {
      refused.push(line);
      continue;
    }
    const href = `https://${INDEXNOW_HOST}${url.pathname}`;
    if (!seen.has(href)) {
      seen.add(href);
      urls.push(href);
    }
  }
  return { urls, refused };
}

/** Items in posts of at most `size`. */
export function batches<T>(items: readonly T[], size = BATCH): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** The protocol's body for one post. */
export function payload(urlList: readonly string[]): { host: string; key: string; keyLocation: string; urlList: string[] } {
  return { host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: [...urlList] };
}

const MEANING: Record<number, string> = {
  200: "accepted",
  202: "received; the key is being checked",
  400: "bad request: read the payload",
  403: "the key is not valid: is the key file live at its address?",
  422: "an address is not on the host, or the key does not match it",
  429: "too many requests: wait, then resume with --from-batch",
};

async function send(urls: string[], fromBatch: number): Promise<number> {
  const all = batches(urls);
  for (let i = fromBatch; i < all.length; i++) {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload(all[i])),
    });
    console.log(`indexnow: batch ${i} of ${all.length - 1}, ${all[i].length} addresses: ${res.status} ${MEANING[res.status] ?? ""}`);
    if (res.status !== 200 && res.status !== 202) return 1;
  }
  return 0;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const listArg = args.find((a) => a.startsWith("--list="))?.slice("--list=".length);
  const phase1 = args.includes("--phase1");
  if (phase1 === Boolean(listArg)) {
    console.error("indexnow: pass --phase1 or --list=<file>, one of the two");
    return 2;
  }
  let lines: string[];
  if (phase1) {
    const sets = phase1Sets();
    for (const s of sets) console.log(`${s.name}: ${s.addresses.length}`);
    lines = sets.flatMap((s) => s.addresses);
  } else {
    lines = readFileSync(listArg as string, "utf8").split(/\r?\n/);
  }
  const { urls, refused } = toUrls(lines);
  if (refused.length) {
    console.error(`indexnow: ${refused.length} lines are not addresses on ${INDEXNOW_HOST}; the first: ${refused[0]}`);
    return 2;
  }
  console.log(`indexnow: ${urls.length} addresses in ${batches(urls).length} batches of up to ${BATCH}, to ${INDEXNOW_ENDPOINT}, key at ${KEY_LOCATION}`);
  for (const u of urls.slice(0, 3)) console.log(`  ${u}`);
  if (!args.includes("--send")) {
    console.log("indexnow: a dry run, nothing sent (add --send to post)");
    return 0;
  }
  const fromBatch = Number(args.find((a) => a.startsWith("--from-batch="))?.slice("--from-batch=".length) ?? "0") || 0;
  return send(urls, fromBatch);
}

/* The exit code is set, never forced with process.exit: after a send the keep-alive sockets of the posts are still open, and on
   Windows process.exit then aborts on libuv's "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" (async.c) and exits
   3221226505 although every post went through. Measured on 2026-10-09 against a loopback stub: four posts, exit 3221226505 four
   runs of four; with process.exitCode, exit 0 four runs of four. The process ends by itself once the sockets idle. */
if (require.main === module) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (e: unknown) => {
      console.error(`indexnow: ${e instanceof Error ? e.message : String(e)}`);
      process.exitCode = 1;
    },
  );
}
