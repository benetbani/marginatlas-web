/**
 * IndexNow stays a tool he runs by hand (P1-G of the page architecture, 2026-10-09: "a key file in public/ and
 * scripts/seo/indexnow.ts, run by hand after each deploy he approves to post the addresses whose status changed; never in the chain
 * or the build"). Its key file is served, its payload is the protocol's, and Phase 1's list holds only addresses whose status
 * Phase 1 changed: each noindex now, each the address of its own page (self-canonical) and passed by the real routing untouched, a
 * United States page named by a census description only where the census counted it at its floor (so milestone 1 had it indexed).
 * Nothing in the gate chain, the npm scripts or the build runs it: it posts to the network, and a post is his to make.
 *
 * THE INSTRUMENTS: the tool's own phase1Sets; the real routing (routeRequest), asked as tests/routing/junk_url_rule.test.ts asks
 * it; and the tool's own main, run in this process with fetch stubbed, so a check here can never post: a run that reached for the
 * network would reach the stub. WHAT IT CANNOT SEE: whether an address was in an engine's index before Phase 1 (the census says
 * only what milestone 1's rule indexed), what an engine does with a post, and what a page draws once the edge passes it. The counts
 * pinned below move when the census or a place table does, and then the commit that moves them says why.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/seo/indexnow.test.ts
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";
import {
  INDEXNOW_KEY, INDEXNOW_HOST, INDEXNOW_ENDPOINT, KEY_FILE, KEY_LOCATION, BATCH,
  toUrls, batches, payload, phase1Sets, emptySets, parseFromBatch, unknownOptions, failureNote, main, type Phase1Set,
} from "../../scripts/seo/indexnow";
import { routeRequest } from "../../src/middleware";
import { SERVED_FILES } from "../../src/lib/routing/served_files";
import { isIndexable, floorStanding } from "../../src/lib/seo/indexable";
import { canonicalPath } from "../../src/lib/seo/alias_canonical";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "indexnow";
const FILE = "scripts/seo/indexnow.ts";
const REMEDY =
  "Keep scripts/seo/indexnow.ts a tool run by hand after a deploy he approved: no gate, npm script or build step runs it, and its key file stays in public/ (rerun scripts/gen_served_files.ts)";
const LIST_REMEDY =
  "Keep in phase1Sets (scripts/seo/indexnow.ts) only an address whose status Phase 1 changed, that names itself canonical and that the edge passes; a count that moved on purpose is corrected in tests/seo/indexnow.test.ts in the commit that moves it";
const TOOL_REMEDY = "Keep the tool's refusals and its failure report in scripts/seo/indexnow.ts: a bad option, an empty set, a refused line (by number) and a failed post's body are said, and nothing is posted";
const PIN_REMEDY = "Keep no gate, npm script or build step running scripts/seo/indexnow.ts, and do not name its path in scripts/prebuild_all.ts, even in a comment";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
/** A check that reads a helper the tool may not export yet: a throw is a failed check, not a crash. */
const holds = (fn: () => boolean): boolean => {
  try { return fn(); } catch { return false; }
};
const firstFew = (list: string[]) => (list.length ? `: ${list.slice(0, 5).join("; ")}` : "");

/** Phase 1's list as it stands on 2026-10-09, set by set. It moves when the census or a place table does. */
const PINNED: ReadonlyArray<readonly [string, number]> = [
  ["the country industries hubs", 195],
  ["the region industries hubs", 871],
  ["the UK trade pages off London", 1518],
  ["the United States pages named by a census description", 125],
  ["the /decide pairs", 34776],
];
const PINNED_TOTAL = 37485;
const PINNED_POSTS = [10000, 10000, 10000, 7485];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let caller = 0;
/** The real routing's answer to a browser asking for the address, from an address of its own so the rate limit never answers. */
const passesEdge = (path: string): boolean => {
  caller++;
  const r = routeRequest(new NextRequest(`https://${INDEXNOW_HOST}${path}`, {
    headers: { host: INDEXNOW_HOST, "user-agent": UA, "accept-language": "en-GB", "x-real-ip": `10.${(caller >> 16) & 255}.${(caller >> 8) & 255}.${caller & 255}` },
  }));
  return r.status === 200 && r.headers.get("x-middleware-next") === "1";
};

type Post = { host?: string; key?: string; keyLocation?: string; urlList: string[] };
/** The tool's main, in this process, with fetch stubbed and the console held: what it printed, its exit code and every post it made. */
async function tool(args: string[], answer: (post: number) => Response = () => new Response("", { status: 200 }), setsOf?: () => Phase1Set[]) {
  const posts: Post[] = [];
  const to: string[] = [];
  const out: string[] = [];
  const err: string[] = [];
  const real = { fetch: globalThis.fetch, log: console.log, error: console.error };
  globalThis.fetch = (async (url: unknown, init?: RequestInit) => {
    to.push(String(url));
    posts.push(JSON.parse(String(init?.body)) as Post);
    return answer(posts.length - 1);
  }) as typeof fetch;
  console.log = (...a: unknown[]) => { out.push(a.join(" ")); };
  console.error = (...a: unknown[]) => { err.push(a.join(" ")); };
  let code = -1;
  try {
    code = await main(args, setsOf);
  } catch (e) {
    err.push(e instanceof Error ? e.message : String(e));
  } finally {
    globalThis.fetch = real.fetch;
    console.log = real.log;
    console.error = real.error;
  }
  return { code, out: out.join("\n"), err: err.join("\n"), posts, to };
}

async function run(): Promise<void> {
  /* THE KEY */
  check(`the key is 32 lowercase hex characters (${INDEXNOW_KEY})`, /^[0-9a-f]{32}$/.test(INDEXNOW_KEY));
  check(`the key file holds the key and nothing else (${KEY_FILE})`, existsSync(KEY_FILE) && readFileSync(KEY_FILE, "utf8") === INDEXNOW_KEY, KEY_FILE);
  check(`the edge serves the key file at ${KEY_LOCATION}`, SERVED_FILES.has(`/${INDEXNOW_KEY}.txt`) && KEY_LOCATION === `https://www.marginatlas.com/${INDEXNOW_KEY}.txt`, "src/lib/routing/served_files.ts");

  /* THE PAYLOAD */
  const { urls, refused } = toUrls(["/gb/industries", "https://www.marginatlas.com/gb/industries", "https://example.com/x", "", "# a note", "/decide/restaurants/london"]);
  check(
    "a list takes paths and the site's own addresses, once each, skips blanks and notes, and refuses another host",
    JSON.stringify(urls) === JSON.stringify(["https://www.marginatlas.com/gb/industries", "https://www.marginatlas.com/decide/restaurants/london"]) &&
      JSON.stringify(refused) === JSON.stringify(["https://example.com/x"]),
  );
  check(
    "two spellings of one address are one: lowercased, one trailing slash dropped, the root kept",
    holds(() => JSON.stringify(toUrls(["/GB/Industries/", "https://www.marginatlas.com/gb/industries", "HTTPS://WWW.MARGINATLAS.COM/Gb/Industries/", "/"]).urls) === JSON.stringify(["https://www.marginatlas.com/gb/industries", "https://www.marginatlas.com/"])),
    FILE,
    TOOL_REMEDY,
  );
  check(
    "a refused line is reported by its number in the list (blank lines and notes counted)",
    holds(() => JSON.stringify(toUrls(["/gb", "# a note", "", "https://example.com/x", "not an address"]).refusedAt) === "[4,5]"),
    FILE,
    TOOL_REMEDY,
  );
  const many = Array.from({ length: 25_001 }, (_, i) => `https://www.marginatlas.com/x/${i}`);
  check(`a post holds at most ${BATCH} addresses (25,001 in ${batches(many).map((b) => b.length).join(", ")})`, JSON.stringify(batches(many).map((b) => b.length)) === "[10000,10000,5001]");
  check("the payload is the protocol's: host, key, keyLocation, urlList", JSON.stringify(Object.keys(payload(["https://www.marginatlas.com/gb"]))) === '["host","key","keyLocation","urlList"]' && payload([]).host === INDEXNOW_HOST && payload([]).keyLocation === KEY_LOCATION);

  /* PHASE 1'S LIST: addresses whose status changed, each of its own page and passed by the edge */
  const sets = phase1Sets();
  for (const s of sets) console.log(`      ${s.name}: ${s.addresses.length}`);
  const all = sets.flatMap((s) => s.addresses);
  check("Phase 1's list holds its five sets, none empty", sets.length === 5 && sets.every((s) => s.addresses.length > 0), FILE, LIST_REMEDY);
  const drift = PINNED.filter(([name, n]) => sets.find((s) => s.name === name)?.addresses.length !== n).map(([name, n]) => `${name} is ${sets.find((s) => s.name === name)?.addresses.length ?? "missing"}, pinned ${n}`);
  check(
    `the sets hold the pinned counts (${PINNED.map(([, n]) => n.toLocaleString("en-GB")).join(" + ")} = ${PINNED_TOTAL.toLocaleString("en-GB")} addresses, ${all.length.toLocaleString("en-GB")} now)${firstFew(drift)}`,
    drift.length === 0 && all.length === PINNED_TOTAL,
    FILE,
    LIST_REMEDY,
  );
  check(
    `the list posts in ${PINNED_POSTS.length} batches of ${PINNED_POSTS.map((n) => n.toLocaleString("en-GB")).join(", ")} (${batches(all).map((b) => b.length).join(", ")})`,
    JSON.stringify(batches(all).map((b) => b.length)) === JSON.stringify(PINNED_POSTS),
    FILE,
    LIST_REMEDY,
  );
  const stillIndexed = all.filter(isIndexable);
  check(`every address on the list is noindex now (${all.length})${firstFew(stillIndexed)}`, all.length > 0 && stillIndexed.length === 0, FILE, LIST_REMEDY);
  const us = sets.find((s) => s.name === "the United States pages named by a census description")?.addresses ?? [];
  const belowFloor = us.filter((p) => floorStanding(p)?.atFloor !== true);
  check(`every United States address was counted at its floor, so milestone 1 had it indexed (${us.length})${firstFew(belowFloor)}`, us.length > 0 && belowFloor.length === 0, FILE, LIST_REMEDY);
  const notSelf = all.filter((p) => canonicalPath(p) !== p).map((p) => `${p} names ${canonicalPath(p)}`);
  check(`every address on the list names itself canonical${firstFew(notSelf)}`, notSelf.length === 0, FILE, LIST_REMEDY);
  const held = all.filter((p) => !passesEdge(p));
  check(`every address on the list passes the real routing untouched, no 404 and no redirect (${caller.toLocaleString("en-GB")} asked)${firstFew(held)}`, held.length === 0 && caller === all.length, "src/middleware.ts", LIST_REMEDY);
  const whole = toUrls(all);
  check(
    `the list reads whole through toUrls: none refused, none merged with another (${whole.urls.length} of ${all.length})`,
    whole.refused.length === 0 && whole.urls.length === all.length,
    FILE,
    LIST_REMEDY,
  );

  /* THE TOOL'S OWN REFUSALS AND REPORTS, run in this process with fetch stubbed */
  check(
    "a set that reads empty is named (run from another folder the coverage files are not found)",
    holds(() => JSON.stringify(emptySets([{ name: "a", addresses: [] }, { name: "b", addresses: ["/x"] }])) === '["a"]' && emptySets(sets).length === 0),
    FILE,
    TOOL_REMEDY,
  );
  check(
    "an option the tool does not know is named, a typo of --from-batch among them",
    holds(() => JSON.stringify(unknownOptions(["--phase1", "--send", "--list=a.txt", "--from-batch=2", "--frombatch=2", "--from-batch", "list.txt"])) === '["--frombatch=2","--from-batch","list.txt"]'),
    FILE,
    TOOL_REMEDY,
  );
  const from = (arg: string | undefined) => parseFromBatch(arg, 4);
  check(
    "--from-batch takes a whole number inside the list: 0 to 3 of 4 pass; a word, a negative, a fraction, a blank and a value past the end are refused",
    holds(() =>
      (from("0") as { from: number }).from === 0 &&
      (from("3") as { from: number }).from === 3 &&
      JSON.stringify(from(undefined)) === '{"from":0}' &&
      ["abc", "-1", "1.5", "", " 2", "4", "99"].every((a) => "error" in from(a))),
    FILE,
    TOOL_REMEDY,
  );
  const dry = await tool(["--phase1"]);
  check(`a dry run posts nothing and says so (${dry.out.split("\n").find((l) => l.startsWith("indexnow: ")) ?? "no report"})`, dry.code === 0 && dry.posts.length === 0 && dry.out.includes(`${all.length} addresses in ${PINNED_POSTS.length} batches`) && dry.out.includes("a dry run, nothing sent"), FILE, TOOL_REMEDY);
  const sent = await tool(["--phase1", "--send"]);
  check(
    `--send posts the list to the endpoint in ${PINNED_POSTS.length} posts of ${sent.posts.map((p) => p.urlList.length).join(", ")}, each the protocol's body, every address once`,
    sent.code === 0 &&
      sent.to.every((u) => u === INDEXNOW_ENDPOINT) &&
      JSON.stringify(sent.posts.map((p) => p.urlList.length)) === JSON.stringify(PINNED_POSTS) &&
      sent.posts.every((p) => JSON.stringify(Object.keys(p)) === '["host","key","keyLocation","urlList"]' && p.host === INDEXNOW_HOST && p.key === INDEXNOW_KEY && p.keyLocation === KEY_LOCATION) &&
      new Set(sent.posts.flatMap((p) => p.urlList)).size === all.length,
    FILE,
    TOOL_REMEDY,
  );
  const resumed = await tool(["--phase1", "--send", "--from-batch=3"]);
  check(`--from-batch=3 posts only the last batch (${resumed.posts.map((p) => p.urlList.length).join(", ") || "none"})`, resumed.code === 0 && resumed.posts.length === 1 && resumed.posts[0].urlList.length === PINNED_POSTS[3], FILE, TOOL_REMEDY);
  const badFrom: Awaited<ReturnType<typeof tool>>[] = [];
  for (const a of ["--from-batch=abc", "--from-batch=-1", "--from-batch=4", "--from-batch=99", "--from-batch="]) badFrom.push(await tool(["--phase1", "--send", a]));
  check(
    "a --from-batch that is no number, or past the end, refuses the run before any post (exit 2)",
    badFrom.every((r) => r.code === 2 && r.posts.length === 0 && r.err.includes("--from-batch")),
    FILE,
    TOOL_REMEDY,
  );
  const typo = await tool(["--phase1", "--send", "--from-batch", "2"]);
  check("a bare --from-batch, or any option the tool does not know, refuses the run before any post (exit 2)", typo.code === 2 && typo.posts.length === 0 && typo.err.includes("not an option of this tool"), FILE, TOOL_REMEDY);
  const readsEmpty = await tool(["--phase1", "--send"], undefined, () => sets.map((s) => (s.name === "the region industries hubs" ? { ...s, addresses: [] } : s)));
  check(
    "a set that reads empty (the coverage files not found from another folder) refuses the run before any post (exit 2), naming the set",
    readsEmpty.code === 2 && readsEmpty.posts.length === 0 && readsEmpty.err.includes("the region industries hubs") && readsEmpty.err.includes("run it from the website folder"),
    FILE,
    TOOL_REMEDY,
  );
  const refusedPost = await tool(["--phase1", "--send"], () => new Response("urls are not on the host", { status: 422 }));
  check(
    "a post the API refuses stops the run (exit 1) and prints the API's own words",
    refusedPost.code === 1 && refusedPost.posts.length === 1 && refusedPost.out.includes("422 an address is not on the host") && refusedPost.err.includes("the response said: urls are not on the host") && holds(() => failureNote("   ") === null),
    FILE,
    TOOL_REMEDY,
  );
  const dir = mkdtempSync(join(tmpdir(), "indexnow-gate-"));
  try {
    const list = join(dir, "list.txt");
    writeFileSync(list, ["/gb/industries", "# a note", "", "https://example.com/not-printed-in-the-refusal", "/decide/restaurants/london"].join("\r\n"));
    const bad = await tool([`--list=${list}`, "--send"]);
    check(
      "a list line that is no address on the host refuses the run before any post (exit 2), by its line number and not its text",
      bad.code === 2 && bad.posts.length === 0 && bad.err.includes("the first is line 4 of the list") && !bad.err.includes("example.com"),
      FILE,
      TOOL_REMEDY,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  /* NEVER IN THE CHAIN OR THE BUILD: the path of the tool, in either slash, is named nowhere in the chain file, an npm command or vercel.json */
  const names = (text: string) => /scripts[\\/]+seo[\\/]+indexnow/.test(text.replace(/\\/g, "/"));
  const chain = readFileSync("scripts/prebuild_all.ts", "utf8");
  check("no gate runs the script (its path is named nowhere in scripts/prebuild_all.ts)", chain.includes("script:") && !names(chain), "scripts/prebuild_all.ts", PIN_REMEDY);
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts?: Record<string, string> };
  const npmRuns = Object.entries(pkg.scripts ?? {}).filter(([, cmd]) => names(cmd));
  check(`no npm script runs it${npmRuns.length ? `: ${npmRuns.map(([n]) => n).join(", ")}` : ""}`, npmRuns.length === 0, "package.json", PIN_REMEDY);
  const vercel = existsSync("vercel.json") ? readFileSync("vercel.json", "utf8") : "";
  check("the build never runs it (vercel.json)", !vercel.includes("indexnow"), "vercel.json", PIN_REMEDY);
  const src = readFileSync(FILE, "utf8");
  check("it posts only with --send, a dry run otherwise, through one fetch", src.includes('args.includes("--send")') && (src.match(/\bfetch\(/g) ?? []).length === 1);
}

run().then(
  () => {
    if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
    console.log("seo/indexnow: all pass");
  },
  (e: unknown) => {
    red({ rule: RULE, file: FILE, detail: `the gate could not run: ${e instanceof Error ? e.stack ?? e.message : String(e)}`.slice(0, 400), remedy: REMEDY });
    redSummary(RULE, failed + 1, REMEDY, "checks failed");
    process.exit(1);
  },
);
