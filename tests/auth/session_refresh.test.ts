/**
 * THE SESSION REFRESH'S GUARDS (the checkup of 2026-10-06, finding 4; src/lib/supabase/middleware_session.ts). The middleware now
 * refreshes a Supabase session on its way out; this holds that it touches nothing it should not: with auth off, for a file, for a request
 * without a session cookie, for a redirect, and without the project's address, the response comes back the very same object,
 * its cache header untouched, and no call leaves the machine (none of these cases reaches the client). The middleware calls it
 * on every route it decides. Since cleanup round 2 of the plan 2026-10-10 the four dotless icon routes (/icon, /icon1, /icon2,
 * /apple-icon) are files to it too, through the set the rate-limit skip reads (src/lib/routing/icon_routes.ts), proved by a count
 * of the calls the real middleware makes with accounts on (the switch and a stand-in project address set for that block only).
 *
 * Run: npx tsx tests/auth/session_refresh.test.ts
 */
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { refreshSessionOn, isFileRequest } from "../../src/lib/supabase/middleware_session";
import { middleware } from "../../src/middleware";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "session-refresh";
const FILE = "src/lib/supabase/middleware_session.ts";
const ICONS_FILE = "src/lib/routing/icon_routes.ts";
const ICON_ADDRESSES = ["/icon", "/icon1", "/icon2", "/apple-icon"];
const REMEDY = "refresh only with auth on, for a page and never a file, with a session cookie on the request and a response that is not a redirect; mark a refreshed response private";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

const req = (cookie?: string) => new NextRequest("https://www.marginatlas.com/gb", { headers: cookie ? { cookie } : {} });
const page = () => { const r = NextResponse.next(); r.headers.set("Cache-Control", "public, s-maxage=21600"); return r; };

(async () => {
  const saved = { auth: process.env.NEXT_PUBLIC_AUTH_ENABLED, url: process.env.NEXT_PUBLIC_SUPABASE_URL, anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY };

  delete process.env.NEXT_PUBLIC_AUTH_ENABLED;
  const off = page();
  check("auth off: the same response, its cache header untouched", (await refreshSessionOn(req("sb-abc-auth-token=x"), off)) === off && off.headers.get("Cache-Control") === "public, s-maxage=21600");

  process.env.NEXT_PUBLIC_AUTH_ENABLED = "1";
  const anon = page();
  check("auth on, no session cookie (a reader, a crawler): the same response", (await refreshSessionOn(req("theme=dark"), anon)) === anon && anon.headers.get("Cache-Control") === "public, s-maxage=21600");

  const redirect = NextResponse.redirect("https://www.marginatlas.com/ar", 308);
  check("auth on, a redirect: left as it is", (await refreshSessionOn(req("sb-abc-auth-token=x"), redirect)) === redirect);

  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const noConfig = page();
  check("auth on, a session cookie, no project address: the same response, no call made", (await refreshSessionOn(req("sb-abc-auth-token=x"), noConfig)) === noConfig);

  const mw = readFileSync("src/middleware.ts", "utf8");
  check("the middleware refreshes on every route it decides", /export async function middleware\([^)]*\)[^{]*\{\s*return refreshSessionOn\(req, routeRequest\(req\)\);/.test(mw));

  check("a photograph's address is a file", isFileRequest("/cities/london.jpeg"));
  check("a data-pack file is a file", isFileRequest("/data/uk/2026.10/readme.md"));
  check("a page and an API route are not files", !isFileRequest("/gb") && !isFileRequest("/gb/london/restaurants") && !isFileRequest("/api/cell-lookup"));
  check("a made-up file the edge answers with a 404 is a file here too (one definition, src/lib/routing/names_file.ts)", isFileRequest("/gb/london/x.y-z") && isFileRequest("/zz/x.") && isFileRequest("/data/uk/2026.10/NOTHING.ABCDEFGHIJKL"));
  check("only the last part decides", !isFileRequest("/data/uk/2026.10/summary"));
  /* Read from the source, since no offline request can tell a skipped refresh from one that found no session. */
  const src = readFileSync(FILE, "utf8");
  const guard = src.indexOf("if (isFileRequest(req.nextUrl.pathname)) return res;");
  check("the file guard returns the response before the client is made", guard > -1 && guard < src.indexOf("createServerClient("));

  /* THE ICON ROUTES ARE FILES TOO (cleanup round 2). /icon, /icon1, /icon2 and /apple-icon have no dot, so the dotted-file rule does not
     see them, and with accounts on a signed-in reader's browser asked Supabase once for each (the head links all four on every page).
     They are exempt through the set the rate-limit skip reads (ICON_ROUTES), one definition for both.
     THE INSTRUMENT: the real exported middleware (the routing decision, then the refresh) is handed a request that carries a
     live-looking session cookie, with the accounts switch on and a stand-in project address (a .localhost name, set for this block
     only), and fetch is replaced by a counter that answers every call with an error, so nothing leaves the machine. A page counts
     one call, which proves the counter sees what a refresh does; an icon route must count none. WHAT IT CANNOT SEE: a refresh that
     reaches no network call (a cookie the SDK cannot read); the control below says whether the cookie is read. */
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const soon = Math.floor(Date.now() / 1000) + 3600;
  const session = { access_token: `${b64({ alg: "none" })}.${b64({ sub: "reader", aud: "authenticated", role: "authenticated", exp: soon })}.x`, refresh_token: "r", token_type: "bearer", expires_in: 3600, expires_at: soon, user: { id: "reader", aud: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" } };
  const live = `sb-standin-auth-token=${JSON.stringify(session)}`;
  const outside = { auth: process.env.NEXT_PUBLIC_AUTH_ENABLED, url: process.env.NEXT_PUBLIC_SUPABASE_URL, anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, fetch: globalThis.fetch };
  const asks: string[] = [];
  let caller = 0;
  const callsFor = async (path: string): Promise<number> => {
    asks.length = 0;
    caller++;
    await middleware(new NextRequest(`https://www.marginatlas.com${path}`, { headers: { host: "www.marginatlas.com", "user-agent": UA, "accept-language": "en-GB,en;q=0.9", "x-real-ip": `10.8.${caller >> 8}.${caller & 255}`, cookie: live } }));
    return asks.length;
  };
  let pageCalls = -1;
  const iconCalls: Array<[string, number]> = [];
  try {
    process.env.NEXT_PUBLIC_AUTH_ENABLED = "1";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://standin.localhost";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "stand-in-key";
    globalThis.fetch = (async (input: unknown) => { asks.push(String((input as { url?: string })?.url ?? input)); return new Response("{}", { status: 500, headers: { "content-type": "application/json" } }); }) as typeof fetch;
    pageCalls = await callsFor("/gb");
    for (const p of ICON_ADDRESSES) iconCalls.push([p, await callsFor(p)]);
  } finally {
    globalThis.fetch = outside.fetch;
    for (const [k, v] of [["NEXT_PUBLIC_AUTH_ENABLED", outside.auth], ["NEXT_PUBLIC_SUPABASE_URL", outside.url], ["NEXT_PUBLIC_SUPABASE_ANON_KEY", outside.anon]] as const) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
  const ICON_REMEDY = `exempt the icon routes from the refresh through the set the rate-limit skip reads: import { ICON_ROUTES } from "@/lib/routing/icon_routes" in src/middleware.ts and src/lib/supabase/middleware_session.ts, and have isFileRequest answer true for them`;
  check(`the instrument sees a refresh: with accounts on, a page request with a live session cookie asks the project (${pageCalls} call${pageCalls === 1 ? "" : "s"})`, pageCalls >= 1, { remedy: "the stand-in cookie or project address no longer makes the client ask: read the block against @supabase/ssr, so a zero for an icon route below means something" });
  for (const [path, n] of iconCalls) check(`with accounts on and a live session cookie, ${path} asks the project nothing (${n} call${n === 1 ? "" : "s"}): an icon route is a file, not a page`, n === 0, { remedy: ICON_REMEDY });
  check("the icon routes are files to the refresh and a made-up neighbour is not", ICON_ADDRESSES.every((p) => isFileRequest(p)) && !isFileRequest("/icon7") && !isFileRequest("/apple-icon1") && !isFileRequest("/iconography"), { remedy: ICON_REMEDY });
  const middlewareSrc = readFileSync("src/middleware.ts", "utf8");
  const importsSet = (text: string) => /import\s*\{[^}]*\bICON_ROUTES\b[^}]*\}\s*from\s*["']@\/lib\/routing\/icon_routes["']/.test(text);
  check(`the rate-limit skip and the session refresh read one set, ICON_ROUTES in ${ICONS_FILE}, not two lists (${importsSet(middlewareSrc) ? "middleware.ts imports it" : "middleware.ts does not"}, ${importsSet(src) ? "middleware_session.ts imports it" : "middleware_session.ts does not"})`, importsSet(middlewareSrc) && importsSet(src) && !/\bconst ICON_ROUTES\b/.test(middlewareSrc) && !/\bconst ICON_ROUTES\b/.test(src), { file: ICONS_FILE, remedy: ICON_REMEDY });

  for (const [k, v] of [["NEXT_PUBLIC_AUTH_ENABLED", saved.auth], ["NEXT_PUBLIC_SUPABASE_URL", saved.url], ["NEXT_PUBLIC_SUPABASE_ANON_KEY", saved.anon]] as const) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("auth/session_refresh: all pass");
})();
