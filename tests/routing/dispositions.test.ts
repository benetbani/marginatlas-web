/**
 * NO ADDRESS IS REDIRECTED OR RETIRED BEFORE THE INVENTORY (his URL rule as restated on 2026-10-09: "never change the address of a
 * page that keeps its content; retire an address only by a permanent redirect to the page that now holds its content, or by a 404
 * when nothing does"; and his ruling that every redirect and every other 404 waits for the inventory of his Search Console
 * exports). The page architecture's dispositions gate (section 5), as the guard Phase 1 needs: while data/seo/inventory.json does
 * not exist, no disposition table may exist and every place the site redirects from is pinned BY IDENTITY, not by count, to what it
 * was on 2026-10-09 (main 22df8098 and this branch). P1-A's new 404s are the edge's (src/lib/routing/edge_not_found.ts) and
 * redirect nothing.
 *
 * THE PINS: tests/routing/redirect_pins.txt, one fact per line, compared with the same lines computed live (CRLF read as LF).
 * Counting places passed a swap, a retarget, a single-quoted source, a new retirement and a trailingSlash (the review of Task 9).
 *   config <source> -> <destination> <status>    each entry of next.config.js's redirects(), evaluated as Next reads it and in its
 *                                                order: the two literal ones, then the blog posts of data/blog/retired_posts.json
 *                                                and data/blog/moved_posts.json
 *   retired /industries/<slug> -> <redirectTo>   each entry of RETIRED (src/lib/taxonomy/retired.ts)
 *   renamed <old> -> <new>                       each entry of TAXONOMY_REDIRECTS (src/lib/taxonomy/legacy_redirects.ts)
 *   route <file> <statement>                     each redirect( or permanentRedirect( line of src/app, comments stripped and
 *                                                spaces collapsed (src/app/dev/ is held by the gate dev-routes-sealed)
 *   vercel.json keys <keys>                      the top-level keys of vercel.json: redirects, rewrites, routes, trailingSlash and
 *                                                cleanUrls would each move an address
 *   next.config redirect-shaping keys <keys>     trailingSlash, skipTrailingSlashRedirect, skipMiddlewareUrlNormalize, basePath,
 *                                                i18n and rewrites, whichever the evaluated config holds
 *   middleware NextResponse.redirect( calls <n>  the call sites in src/middleware.ts, comments stripped
 *   mw <address> <status> <where>                what the real routeRequest (src/middleware.ts) answers a browser for 15 addresses
 *                                                (one case of each redirect and of the 404 for an invented word): the Location, or
 *                                                "rewrite" (the status-pinned 404), or "pass"; the apex row keeps its Location's
 *                                                host, so a retargeted apex redirect changes it
 *
 * HOW A LEGITIMATE CHANGE GOES IN. Never by editing redirect_pins.txt to pass. A redirect on a route new in a commit that retires no
 * published address (a sign-in bounce, a form's redirect after a post) is added to the pins in that commit, with the reason in the
 * commit message. An address that exists is neither retargeted nor retired before the inventory: undo the change.
 *
 * WHAT IT CANNOT SEE.
 *   - Redirects set outside the repo: the dashboard's redirects and the apex domain setting at Vercel (the apex row asks only the
 *     middleware's fallback for the apex).
 *   - A regex inside an existing middleware site widened to an address no pinned row names: the call count pins how many sites there
 *     are and the 15 rows pin what they answer, not what else each condition would match.
 *   - The city and district tables (src/lib/routing/edge_not_found.ts and the generated place tables): deliberately unpinned, because
 *     a city or district added on purpose adds its own /gb/<city> hop; /gb/london and /gb/london/west-end show the hop works.
 *   - A redirect written in a place it does not read: a helper in src/lib that a route calls (none holds one today), or a response
 *     header that sets a Location.
 *   - The after-inventory checks (one hop to a 200, dated and kept 365 days, no inventory address at 404, no internal link to a
 *     redirect or a 404) are not written yet; the day the inventory arrives this gate fails until they are.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/routing/dispositions.test.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
/* routeRequest, not middleware: since A7 (2026-10-06) `middleware` is async (the session refresh wraps the routing), and the
   routing decision is what is pinned, as tests/routing/junk_url_rule.test.ts asks it. */
import { routeRequest } from "../../src/middleware";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "dispositions";
const SELF = "tests/routing/dispositions.test.ts";
const INVENTORY = "data/seo/inventory.json";
const TABLE = "src/lib/routing/dispositions.ts";
const PINS = "tests/routing/redirect_pins.txt";
const TABLE_REMEDY = `Delete ${TABLE}. No disposition table is written until the inventory exists`;
const PIN_REMEDY =
  "Undo the redirect change. No address is redirected, retired or retargeted before the inventory exists (his URL rule, 2026-10-09). " +
  "Never edit redirect_pins.txt to pass; a redirect on a route new in this commit that retires no published address is added to the pins with the reason in the commit message";
const PINS_GONE_REMEDY = `Restore ${PINS} from git (git checkout -- ${PINS}); it is never written to make a change pass`;
const SUMMARY_REMEDY = `read each red above: delete a disposition table, undo a redirect change; never edit ${PINS} to pass`;
const SHOWN = 20;

let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy: string, lines: string[] = []) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  for (const l of lines) console.error(l);
  red({ rule: RULE, file, detail: label, remedy });
};
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");

/** The 15 addresses whose answer is pinned: each redirect of the middleware once, and the 404 for an invented word under a held
 *  country. [address, host]; the host is www unless it is named. */
const ADDRESSES: ReadonlyArray<readonly [string, string?]> = [
  ["/GB/London"], ["/industries/banking"], ["/gb/london/banking"], ["/us/new-york/banking"], ["/gb/liverpool/banking"],
  ["/industries/crop-farming"], ["/industries/auto-dealers-gas-stations"], ["/gb/london/auto-dealers-gas-stations"],
  ["/sectors"], ["/sectors/abc"], ["/gb/london"], ["/gb/london/west-end"], ["/gb/atlantis/banking"], ["/gb/atlantis/restaurants"],
  ["/gb/london", "marginatlas.com"],
];
const WWW = "www.marginatlas.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let caller = 0;
/** One `mw` row: the real routing's answer, each request from its own address so the rate limit never answers instead. */
function mwRow(path: string, host = WWW): string {
  caller++;
  const origin = `https://${host}`;
  let answer: string;
  try {
    const res = routeRequest(new NextRequest(`${origin}${path}`, {
      headers: { host, "user-agent": UA, "accept-language": "en-GB", "x-real-ip": `10.9.${caller >> 8}.${caller & 255}` },
    }));
    const location = res.headers.get("location");
    const to = location ? new URL(location, origin) : null;
    const where = to ? (to.origin === origin ? `${to.pathname}${to.search}` : to.href) : res.headers.get("x-middleware-rewrite") ? "rewrite" : res.headers.get("x-middleware-next") === "1" ? "pass" : "other";
    answer = `${res.status} ${where}`;
  } catch (e) {
    answer = `throws ${e instanceof Error ? e.message : String(e)}`;
  }
  return `mw ${host === WWW ? "" : host}${path} ${answer}`;
}

type ConfigRedirect = { source: string; destination: string; permanent?: boolean; statusCode?: number; [key: string]: unknown };
type LoadedConfig = Record<string, unknown> & { redirects?: () => Promise<ConfigRedirect[]> };
const SHAPING = ["trailingSlash", "skipTrailingSlashRedirect", "skipMiddlewareUrlNormalize", "basePath", "i18n", "rewrites"];

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((n) => {
    const p = `${d}/${n}`;
    return statSync(p).isDirectory() ? walk(p) : /\.(?:[cm]?[jt]s|[jt]sx)$/.test(n) ? [p] : [];
  });

/** Every pinned fact, computed from the repo now. */
async function liveRows(): Promise<string[]> {
  const rows: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require(resolve("next.config.js")) as LoadedConfig;
  for (const r of config.redirects ? await config.redirects() : []) {
    const status = typeof r.statusCode === "number" ? r.statusCode : r.permanent ? 308 : 307;
    const extra = Object.keys(r).filter((k) => !["source", "destination", "permanent", "statusCode"].includes(k));
    rows.push(`config ${r.source} -> ${r.destination} ${status}${extra.length ? ` EXTRA:${extra.join(",")}` : ""}`);
  }
  const vercel = existsSync("vercel.json") ? Object.keys(JSON.parse(readFileSync("vercel.json", "utf8")) as object).sort().join(",") : "(file absent)";
  rows.push(`vercel.json keys ${vercel}`);
  rows.push(`next.config redirect-shaping keys ${SHAPING.filter((k) => k in config).join(",") || "none"}`);
  for (const slug of Object.keys(RETIRED).sort()) rows.push(`retired /industries/${slug} -> ${RETIRED[slug].redirectTo}`);
  for (const old of Object.keys(TAXONOMY_REDIRECTS).sort()) rows.push(`renamed ${old} -> ${TAXONOMY_REDIRECTS[old]}`);
  for (const f of walk("src/app").filter((p) => !p.startsWith("src/app/dev/")).sort()) {
    for (const line of code(f).split("\n").map((l) => l.trim().replace(/\s+/g, " "))) {
      if (/\b(?:permanentRedirect|redirect)\s*\(/.test(line)) rows.push(`route ${f} ${line}`);
    }
  }
  rows.push(`middleware NextResponse.redirect( calls ${(code("src/middleware.ts").match(/NextResponse\.redirect\(/g) ?? []).length}`);
  for (const [path, host] of ADDRESSES) rows.push(mwRow(path, host));
  return rows;
}

/** Rows present in one list and not the other, repeats counted (src/app/random/route.ts holds one statement twice). */
function difference(from: string[], other: string[]): string[] {
  const left = new Map<string, number>();
  for (const r of other) left.set(r, (left.get(r) ?? 0) + 1);
  const out: string[] = [];
  for (const r of from) {
    const n = left.get(r) ?? 0;
    if (n > 0) left.set(r, n - 1);
    else out.push(r);
  }
  return out;
}

/** At most SHOWN lines in all, shared between the two kinds so neither hides the other. */
function show(added: string[], removed: string[]): string[] {
  const nRemoved = Math.min(removed.length, SHOWN - Math.min(added.length, Math.ceil(SHOWN / 2)));
  const nAdded = Math.min(added.length, SHOWN - nRemoved);
  const lines = [...added.slice(0, nAdded).map((r) => `  + ${r}`), ...removed.slice(0, nRemoved).map((r) => `  - ${r}`)];
  const more = added.length + removed.length - lines.length;
  return more > 0 ? [...lines, `  ... and ${more} more`] : lines;
}

async function main() {
  if (existsSync(INVENTORY)) {
    check(
      `${INVENTORY} exists: write the after-inventory checks of this gate (one hop to a 200, dated, kept 365 days, no inventory address at 404, no internal link to a redirect or a 404) before any disposition`,
      false,
      SELF,
      "Write the after-inventory checks in tests/routing/dispositions.test.ts (the spec's section 5), then give each address its line in src/lib/routing/dispositions.ts",
    );
  } else {
    check(`no disposition table before the inventory (${TABLE} does not exist)`, !existsSync(TABLE), TABLE, TABLE_REMEDY);
    const live = await liveRows();
    if (!existsSync(PINS)) {
      check(`the pinned rows are missing: ${PINS} does not exist (${live.length} rows are computed live)`, false, PINS, PINS_GONE_REMEDY);
    } else {
      const text = readFileSync(PINS, "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "");
      const pinned = text === "" ? [] : text.split("\n");
      const added = difference(live, pinned);
      const removed = difference(pinned, live);
      const reordered = added.length === 0 && removed.length === 0 && live.some((r, i) => r !== pinned[i]);
      const first = live.findIndex((r, i) => r !== pinned[i]);
      const kinds = new Map<string, number>();
      for (const r of live) kinds.set(r.split(" ")[0], (kinds.get(r.split(" ")[0]) ?? 0) + 1);
      const tally = [...kinds].map(([k, n]) => `${k} ${n}`).join(", ");
      const what = reordered
        ? `the redirect places hold the pinned rows in another order (row ${first + 1}: live "${live[first]}", pinned "${pinned[first]}")`
        : `the redirect places differ from ${PINS}: ${added.length} row${added.length === 1 ? " is" : "s are"} in the repo and not in the pins ("+"), ${removed.length} in the pins and not in the repo ("-")`;
      check(
        added.length === 0 && removed.length === 0 && !reordered ? `the redirect places are the ${pinned.length} rows pinned in ${PINS} (${tally})` : what,
        added.length === 0 && removed.length === 0 && !reordered,
        PINS,
        PIN_REMEDY,
        show(added, removed),
      );
    }
    console.log("dispositions: 4 deferred (data/seo/inventory.json does not exist yet: one hop to a 200, dated and kept 365 days, no inventory address at 404, no internal link to a redirect or a 404)");
  }

  if (failed > 0) { redSummary(RULE, failed, SUMMARY_REMEDY, "checks failed"); process.exit(1); }
  console.log("routing/dispositions: all pass");
}

main().catch((e) => {
  red({ rule: RULE, file: SELF, detail: `the gate could not run: ${e instanceof Error ? e.message : String(e)}`, remedy: "run it by hand (node node_modules/tsx/dist/cli.mjs tests/routing/dispositions.test.ts) and read the error; it reads next.config.js, vercel.json, src/middleware.ts, src/app and the two taxonomy tables" });
  process.exit(1);
});
