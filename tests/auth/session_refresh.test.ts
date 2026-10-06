/**
 * THE SESSION REFRESH'S GUARDS (the checkup of 2026-10-06, finding 4; src/lib/supabase/middleware_session.ts). The middleware now
 * refreshes a Supabase session on its way out; this holds that it touches nothing it should not: with auth off, for a file, for a request
 * without a session cookie, for a redirect, and without the project's address, the response comes back the very same object,
 * its cache header untouched, and no call leaves the machine (none of these cases reaches the client). The middleware calls it
 * on every route it decides.
 *
 * Run: npx tsx tests/auth/session_refresh.test.ts
 */
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { refreshSessionOn, isFileRequest } from "../../src/lib/supabase/middleware_session";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "session-refresh";
const FILE = "src/lib/supabase/middleware_session.ts";
const REMEDY = "refresh only with auth on, for a page and never a file, with a session cookie on the request and a response that is not a redirect; mark a refreshed response private";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

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
  /* Read from the source, since no offline request can tell a skipped refresh from one that found no session. */
  const src = readFileSync(FILE, "utf8");
  const guard = src.indexOf("if (isFileRequest(req.nextUrl.pathname)) return res;");
  check("the file guard returns the response before the client is made", guard > -1 && guard < src.indexOf("createServerClient("));

  for (const [k, v] of [["NEXT_PUBLIC_AUTH_ENABLED", saved.auth], ["NEXT_PUBLIC_SUPABASE_URL", saved.url], ["NEXT_PUBLIC_SUPABASE_ANON_KEY", saved.anon]] as const) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("auth/session_refresh: all pass");
})();
