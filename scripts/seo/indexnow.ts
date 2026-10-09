/**
 * scripts/seo/indexnow.ts
 *
 * INDEXNOW, BY HAND, AFTER A DEPLOY HE APPROVED (P1-G of the page architecture, 2026-10-09). IndexNow needs no account: the key
 * below is served at KEY_LOCATION (public/<key>.txt), and Bing, Yandex and the protocol's other engines read a post of the
 * addresses whose status changed. It never runs in the gate chain or the build (the gate indexnow holds that): it talks to the
 * network, and a post is his to make.
 *
 * usage, from E:/atlas/website (the coverage files are read from the working folder, and a set that reads empty refuses the run):
 *   node node_modules/tsx/dist/cli.mjs scripts/seo/indexnow.ts --phase1                    the addresses Phase 1 changed: a dry run
 *   node node_modules/tsx/dist/cli.mjs scripts/seo/indexnow.ts --list=<file>               one address a line (a path, or a full
 *                                                                                           address on www.marginatlas.com): a dry run
 *   add --send to post them, BATCH to a request; add --from-batch=<n> to resume after a 429 (a whole number inside the list)
 * A dry run prints what it would send and touches nothing. An option it does not know refuses the run.
 *
 * WHAT PHASE 1'S LIST HOLDS: the addresses whose index status Phase 1 changed, from indexable to noindex, each the address of its own
 * page. WHAT IT LEAVES OUT: the /opening and /buy-or-start pages of every place but London also lost their index status; they are
 * linked only from their trade pages and are left to the next crawl. And the United States addresses a census description names
 * that changed nothing for an engine or are not a page of their own: one the census counted under its floor (milestone 1 had it
 * noindex already), one that names another page canonical (an alias) and one a redirect moves (365 of the census's 490 on 2026-10-09).
 */
import { readFileSync } from "node:fs";
import { COUNTRIES, SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import { retiredPlaceTarget } from "../../src/lib/taxonomy/retired_paths";
import { hasOwn } from "../../src/lib/own";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { hasRegionalCoverage } from "../../src/lib/coverage/regional";
import { getAdmin1Regions } from "../../src/lib/coverage/admin1";
import { CITY_SLUGS_BY_COUNTRY } from "../../src/lib/routing/city_paths_generated";
import { NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { US_DESCRIPTION_SLUGS } from "../../src/lib/routing/place_slugs_generated";
import { floorStanding } from "../../src/lib/seo/indexable";
import { canonicalPath } from "../../src/lib/seo/alias_canonical";
import census from "../../data/seo/floor_census.json";

export const INDEXNOW_KEY = "69fd594eb74f011d470c833c8baab986";
export const INDEXNOW_HOST = "www.marginatlas.com";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const KEY_FILE = `public/${INDEXNOW_KEY}.txt`;
export const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
/** The protocol's limit of addresses to one post. */
export const BATCH = 10_000;

export type Phase1Set = { name: string; addresses: string[] };

/** An address a redirect moves, as the middleware reads them: a retired trade under a place (retiredPlaceTarget) and a renamed trade
 *  (TAXONOMY_REDIRECTS, by the address's last part). */
function isMoved(path: string): boolean {
  const word = path.split("/").filter(Boolean).pop() ?? "";
  return retiredPlaceTarget(path) !== null || hasOwn(TAXONOMY_REDIRECTS, word);
}

/** The addresses whose status Phase 1 changed (P1-B), set by set: each was indexable before and is noindex now, and is the address
 *  of its own page. The census's United States pages named by a description are kept only where the change was real: the census
 *  counted the page at its floor (milestone 1 indexed it), it names itself canonical and no redirect moves it. */
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
    if (!(parts.length === 3 && parts[0] === "us" && US_DESCRIPTION_SLUGS.has(parts[2]))) return false;
    return floorStanding(p)?.atFloor === true && canonicalPath(p) === p && !isMoved(p);
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

/** The names of the sets that hold no address: run from another folder the coverage files are not found and a set reads empty. */
export function emptySets(sets: readonly Phase1Set[]): string[] {
  return sets.filter((s) => s.addresses.length === 0).map((s) => s.name);
}

/** Lines to the site's full addresses, once each: a path or a full https address on the host, lowercased and without one trailing
 *  slash (the form the edge answers, so two spellings are one address); blanks and # notes skipped. `refusedAt` holds the 1-based
 *  line numbers of the refused lines, in step with `refused`. */
export function toUrls(lines: readonly string[]): { urls: string[]; refused: string[]; refusedAt: number[] } {
  const urls: string[] = [];
  const refused: string[] = [];
  const refusedAt: number[] = [];
  const seen = new Set<string>();
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    let url: URL | null = null;
    try {
      url = new URL(line.startsWith("/") ? `https://${INDEXNOW_HOST}${line}` : line);
    } catch {
      url = null;
    }
    if (!url || url.host !== INDEXNOW_HOST || url.protocol !== "https:") {
      refused.push(line);
      refusedAt.push(i + 1);
      return;
    }
    const href = `https://${INDEXNOW_HOST}${url.pathname.toLowerCase().replace(/(.)\/$/, "$1")}`;
    if (!seen.has(href)) {
      seen.add(href);
      urls.push(href);
    }
  });
  return { urls, refused, refusedAt };
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

/** The options the tool takes; anything else (a typo of --from-batch would start again from the first post) refuses the run. */
export function unknownOptions(args: readonly string[]): string[] {
  return args.filter((a) => !(a === "--phase1" || a === "--send" || a.startsWith("--list=") || a.startsWith("--from-batch=")));
}

/** Where to resume: the batch number after --from-batch=, a whole number inside the list, else the reason it is refused. */
export function parseFromBatch(arg: string | undefined, batchCount: number): { from: number } | { error: string } {
  if (arg === undefined) return { from: 0 };
  if (!/^\d+$/.test(arg)) return { error: `--from-batch takes a whole number, the batch to resume at; got "${arg}"` };
  const from = Number(arg);
  if (from >= batchCount) {
    return { error: `--from-batch=${from} is past the end: the list has ${batchCount} ${batchCount === 1 ? "batch" : "batches"}${batchCount ? `, numbered 0 to ${batchCount - 1}` : ""}` };
  }
  return { from };
}

/** What the API said when it refused a post (its 400 or 422 text), cut to a line or two; null when it said nothing. */
export function failureNote(body: string): string | null {
  const text = body.replace(/\s+/g, " ").trim();
  return text ? `indexnow: the response said: ${text.length > 400 ? `${text.slice(0, 400)}...` : text}` : null;
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
    if (res.status !== 200 && res.status !== 202) {
      const note = failureNote(await res.text().catch(() => ""));
      if (note) console.error(note);
      return 1;
    }
  }
  return 0;
}

/** The tool itself, its options and its Phase 1 sets passed in (the gate tests/seo/indexnow.test.ts runs it with fetch stubbed): the exit code. */
export async function main(args: readonly string[] = process.argv.slice(2), sets: () => Phase1Set[] = phase1Sets): Promise<number> {
  const unknown = unknownOptions(args);
  if (unknown.length) {
    console.error(`indexnow: not an option of this tool: ${unknown.join(" ")} (the options are --phase1, --list=<file>, --send, --from-batch=<n>)`);
    return 2;
  }
  const listArg = args.find((a) => a.startsWith("--list="))?.slice("--list=".length);
  const phase1 = args.includes("--phase1");
  if (phase1 === Boolean(listArg)) {
    console.error("indexnow: pass --phase1 or --list=<file>, one of the two");
    return 2;
  }
  let lines: string[];
  if (phase1) {
    const found = sets();
    for (const s of found) console.log(`${s.name}: ${s.addresses.length}`);
    const empty = emptySets(found);
    if (empty.length) {
      console.error(`indexnow: ${empty.length === 1 ? "a set reads" : "sets read"} empty (${empty.join("; ")}): run it from the website folder, E:/atlas/website, where the coverage files are`);
      return 2;
    }
    lines = found.flatMap((s) => s.addresses);
  } else {
    lines = readFileSync(listArg as string, "utf8").split(/\r?\n/);
  }
  const { urls, refused, refusedAt } = toUrls(lines);
  if (refused.length) {
    console.error(`indexnow: ${refused.length} lines are not addresses on ${INDEXNOW_HOST}; the first is line ${refusedAt[0]} of the list`);
    return 2;
  }
  const from = parseFromBatch(args.find((a) => a.startsWith("--from-batch="))?.slice("--from-batch=".length), batches(urls).length);
  if ("error" in from) {
    console.error(`indexnow: ${from.error}`);
    return 2;
  }
  console.log(`indexnow: ${urls.length} addresses in ${batches(urls).length} batches of up to ${BATCH}, to ${INDEXNOW_ENDPOINT}, key at ${KEY_LOCATION}`);
  for (const u of urls.slice(0, 3)) console.log(`  ${u}`);
  if (!args.includes("--send")) {
    console.log("indexnow: a dry run, nothing sent (add --send to post)");
    return 0;
  }
  return send(urls, from.from);
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
