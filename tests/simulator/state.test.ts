/**
 * THE ADDRESS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "State in the address: country, city and trade, and only the levers that differ
 * from the defaults ... an unknown lever is ignored, one out of range clamped ... Canonical /calculator on every view; a view with parameters is
 * noindex"; Review Focus 4: a typed figure out of range, the address's half). The round trip; the clamps and the ignored; the href; the robots; the
 * edge no longer caching a page that reads its address; the client writing the address with replaceState after a pause.
 * BLIND SPOT, stated: it reads the client's and the page's source for the wiring; the browser check in Task 9 watches the address change.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/state.test.ts
 */
import { readFileSync } from "node:fs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-state";
const FILE = "src/lib/simulator/state.ts";
const REMEDY = "write only the levers that differ from the defaults into v, read them back clamped, ignore what names nothing, keep /calculator canonical and noindex every view with parameters, and let the edge never cache a page that reads its address";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const St = await import("../../src/lib/simulator/state").catch(() => null);
  const Seo = await import("../../src/lib/simulator/seo").catch(() => null);
  check("the address module is there", !!St);
  check("the robots module is there", !!Seo, "src/lib/simulator/seo.ts");
  if (!St || !Seo) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const P = await import("../../src/lib/simulator/place");
  const D = await import("../../src/lib/simulator/defaults");
  const B = await import("../../src/lib/simulator/bundle");
  const lp = P.resolvePlace({ country: "gb", city: "london", trade: "restaurants" })!;
  const lb = D.buildBundle(lp, { cell: null });
  const bp = P.resolvePlace({ country: "de", city: "berlin", trade: "restaurants" })!;
  const bb = D.buildBundle(bp, { cell: null });
  const chef = bb.roles.find((r) => r.key === "head_chef_or_kitchen_lead")!.key;
  const cook = bb.roles.find((r) => r.key === "line_and_prep_cook")!.key;

  /* THE ROUND TRIP: only what differs, back as it went. */
  check("the defaults write nothing", St.encodeState(B.FRESH, lb) === null && St.encodeState({ ...B.FRESH, levers: { area: lb.inputs.area.value } }, lb) === null);
  const s = { levers: { area: 250, rent: 410.5, sales: null, owner: 52000 }, on: { owner: true, target: true }, heads: { [chef]: 2, [cook]: 4.5 }, pay: { [chef]: 61000 }, form: null };
  const v = St.encodeState(s, bb);
  const back = St.decodeState(v, bb);
  check(`a state goes out and comes back whole (${v})`, v === `area:250,rent:410.5,sales:,owner:52000,target:on,team:${chef}-2.${cook}-4.5,pay:${chef}-61000` && JSON.stringify(back) === JSON.stringify({ levers: { area: 250, rent: 410.5, sales: null, owner: 52000 }, on: { owner: true, target: true }, heads: { [chef]: 2, [cook]: 4.5 }, pay: { [chef]: 61000 }, form: null }));
  check("the legal form travels in the UK alone", St.encodeState({ ...B.FRESH, form: "company" }, lb) === "form:company" && St.decodeState("form:company", lb).form === "company" && St.decodeState("form:company", bb).form === null);

  /* REVIEW FOCUS 4, THE ADDRESS'S HALF: clamped, ignored, never thrown. */
  const odd = St.decodeState("area:-5,rent:abc,zz:1", lb);
  check(`v=area:-5,rent:abc,zz:1 reads as the least floor space and nothing else (${JSON.stringify(odd.levers)})`, JSON.stringify(odd.levers) === JSON.stringify({ area: 5 }));
  check("a figure past the top is held at the top", St.decodeState("area:999999,sales:1e99", lb).levers.area === 2000 && St.decodeState("area:999999,sales:1e99", lb).levers.sales === undefined);
  check("a role the place does not hold is ignored, heads past fifty held at fifty", JSON.stringify(St.decodeState(`team:nobody-3.${chef}-99`, bb).heads) === JSON.stringify({ [chef]: 50 }));
  check("an address of 3,000 characters reads as the defaults", JSON.stringify(St.decodeState("area:1,".repeat(500), lb)) === JSON.stringify(B.FRESH));
  check("nothing at all reads as the defaults", JSON.stringify(St.decodeState(null, lb)) === JSON.stringify(B.FRESH) && JSON.stringify(St.decodeState("", lb)) === JSON.stringify(B.FRESH));

  /* THE HREF: the bare page clean, every other view its place and its changes. */
  check(`London at its defaults is /calculator (${St.calculatorHref(lp, B.FRESH, lb)})`, St.calculatorHref(lp, B.FRESH, lb) === "/calculator");
  check(`Berlin with its floor space changed (${St.calculatorHref(bp, { ...B.FRESH, levers: { area: 250 } }, bb)})`, St.calculatorHref(bp, { ...B.FRESH, levers: { area: 250 } }, bb) === "/calculator?country=de&city=berlin&trade=restaurants&v=area:250");
  const anyDe = P.resolvePlace({ country: "de", city: null, trade: "restaurants" })!;
  check("anywhere in a country carries no city", St.calculatorHref(anyDe, B.FRESH, D.buildBundle(anyDe, { cell: null })) === "/calculator?country=de&trade=restaurants");

  /* THE ROBOTS: canonical on every view, noindex with any parameter. */
  const bare = Seo.calculatorMetadata({});
  const view = Seo.calculatorMetadata({ country: "gb", city: "london", trade: "restaurants" });
  check("the bare page: canonical /calculator, indexable", (bare.alternates as { canonical?: string })?.canonical === "/calculator" && bare.robots === undefined, "src/lib/simulator/seo.ts");
  check("a view with parameters: canonical /calculator, noindex, followed", (view.alternates as { canonical?: string })?.canonical === "/calculator" && JSON.stringify(view.robots) === JSON.stringify({ index: false, follow: true }), "src/lib/simulator/seo.ts");

  /* THE WIRING: the page, the client, the edge. */
  const page = readFileSync("src/app/(site)/calculator/page.tsx", "utf8");
  check("the page asks its robots of calculatorMetadata and hands v to the seed", /export async function generateMetadata/.test(page) && /calculatorMetadata\(/.test(page) && /v: one\(q\.v\)/.test(page) && !/export const metadata/.test(page), "src/app/(site)/calculator/page.tsx");
  const client = readFileSync("src/components/spine/calculator/CalculatorClient.tsx", "utf8");
  check("the client writes the address with replaceState after a pause, and never navigates", /window\.history\.replaceState\(/.test(client) && /ADDRESS_DEBOUNCE_MS/.test(client) && /calculatorHref\(/.test(client) && !/useRouter|router\.push/.test(client), "src/components/spine/calculator/CalculatorClient.tsx");
  const mw = readFileSync("src/middleware.ts", "utf8");
  check("the edge caches no /calculator: the page reads its address", !/^\s*\/\^\\\/calculator\$\/,/m.test(mw), "src/middleware.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/state: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-state crashed:", e); process.exit(1); });
