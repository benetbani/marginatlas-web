/**
 * THE PLACE SWITCH'S ROUTE (plan 2026-10-13 cost-simulator, Task 3; spec section 3: "a place switch fetches its defaults from one API route ... an
 * unknown country, city or trade answers 404"). respond() on a stub loader and on the real defaults builder (offline: the shards, no database), the
 * route's source (rate-limited first, the place's three words its only reads, so no lever ever reaches the server), the edge's route table.
 * BLIND SPOT, stated: it reads the route's source, not a running server; Task 9 asks the deployed route once, after his deploy word.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/api.test.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-api";
const FILE = "src/lib/simulator/respond.ts";
const ROUTE = "src/app/api/calculator/route.ts";
const REMEDY = "answer a known place with its defaults and an unknown one with 404, read only the place's three words, rate-limit first, and regenerate the edge's route table with the route";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const nonFinite = (x: unknown): boolean => (typeof x === "number" ? !Number.isFinite(x) : Array.isArray(x) ? x.some(nonFinite) : x !== null && typeof x === "object" ? Object.values(x as Record<string, unknown>).some(nonFinite) : false);

async function main(): Promise<void> {
  const R = await import("../../src/lib/simulator/respond").catch(() => null);
  check("the responder is there", !!R);
  if (!R) { redSummary(RULE, failed, REMEDY, "module missing"); process.exit(1); }
  const D = await import("../../src/lib/simulator/defaults");
  const B = await import("../../src/lib/simulator/bundle");
  const E = await import("../../src/lib/simulator/engine");
  type Bundle = Awaited<ReturnType<typeof D.buildBundle>>;
  const seen: string[] = [];
  const stub = async (p: { iso2: string; city: string | null; trade: string }) => { seen.push(`${p.iso2}/${p.city}/${p.trade}`); return { stub: true } as unknown as Bundle; };

  const ok = await R.respond({ country: "gb", city: "london", trade: "restaurants" }, stub);
  check(`a known place answers 200 with the place and its defaults (${ok.status}, ${seen.join(" ")})`, ok.status === 200 && "bundle" in ok.body && ok.body.place.city === "london" && seen[0] === "GB/london/restaurants" && /s-maxage/.test(ok.headers["Cache-Control"] ?? ""));
  for (const q of [{ country: "xx", city: null, trade: "restaurants" }, { country: "gb", city: "atlantis", trade: "restaurants" }, { country: "gb", city: "london", trade: "constructor" }, { country: "gb", city: "berlin", trade: "restaurants" }]) {
    const a = await R.respond(q, stub);
    check(`${JSON.stringify(q)} answers 404 and loads nothing (${a.status})`, a.status === 404 && a.body.place === null && seen.length === 1);
  }

  /* The real defaults travel as JSON and rebuild the same engine in the browser. */
  const real = await R.respond({ country: "de", city: "berlin", trade: "restaurants" }, async (p) => D.buildBundle(p, { cell: null }));
  const body = real.body as { bundle: Bundle };
  const back = JSON.parse(JSON.stringify(body)) as { bundle: Bundle };
  const be = (b: Bundle) => { const r = E.simulate(B.toEngine(b, B.FRESH)); return r.breakEven.held ? r.breakEven.value : null; };
  check(`Berlin's defaults survive the wire whole (${be(back.bundle)} against ${be(body.bundle)})`, real.status === 200 && !nonFinite(body) && JSON.stringify(back) === JSON.stringify(body) && be(back.bundle) === be(body.bundle) && be(body.bundle) !== null);

  /* THE ROUTE: rate-limited before anything, the place's three words its only reads. */
  check("the route is there", existsSync(ROUTE), ROUTE);
  const src = existsSync(ROUTE) ? readFileSync(ROUTE, "utf8") : "";
  const body0 = src.slice(src.indexOf("export async function GET"));
  check("its first act is the rate limit, as the cell lookup's", /export async function GET\(req: NextRequest\) \{\s*const limited = tooMany\(req, "calculator", 120\);\s*if \(limited\) return limited;/.test(src), ROUTE);
  const reads = [...body0.matchAll(/\.get\("([^"]+)"\)/g)].map((m) => m[1]).sort();
  check(`it reads the place's three words and nothing else (${reads.join(", ")})`, JSON.stringify(reads) === JSON.stringify(["city", "country", "trade"]), ROUTE);
  check("it answers through respond() with the defaults loader", /respond\(/.test(src) && /loadPlaceBundle/.test(src), ROUTE);

  /* THE EDGE: an address the route table does not hold answers 404 there. */
  const shapes = readFileSync("src/lib/routing/route_shapes.ts", "utf8");
  check('the edge\'s route table holds ["api", "calculator"]', shapes.includes('["api", "calculator"]'), "src/lib/routing/route_shapes.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/api: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-api crashed:", e); process.exit(1); });
