/**
 * THE MONEY AND THE WORDS (plan 2026-10-13 cost-simulator, Task 4A; spec section 4: "the money in the reader's display currency through the site's
 * existing switch"; Review Focus 1, a loss with a true minus, and 5, a currency switch mid-session: the half that is arithmetic).
 * The display's round trips in every currency the switch offers, the pound's two rates as the site holds them (fx.ts for a UK figure in dollars,
 * currency.ts for the rest), the signed forms; the lever's typed figure empty, stamped, its symbol; and every string of COPY.calculator held to the
 * copy rules (four-word headings, twelve-word lines, three-word labels, no semicolon, no em-dash, no method word, no "we", no corporate word).
 * BLIND SPOT, stated: the copy check reads the strings, not the page; the plain-copy gate reads the page (Task 4C).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/display.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CURRENCIES } from "../../src/lib/currency";
import { COPY } from "../../src/lib/spine/copy";
import { Range } from "../../src/components/spine/interact/Range";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-display";
const FILE = "src/lib/simulator/display.ts";
const REMEDY = "show a base figure exactly in its own currency, a UK figure in dollars at fx.ts's pound rate, every other through dollars, a loss with U+2212 before the symbol; keep every calculator string inside the copy rules";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const D = await import("../../src/lib/simulator/display").catch(() => null);
  const BD = await import("../../src/lib/simulator/bounds").catch(() => null);
  check("the display module is there", !!D);
  check("the bounds are there", !!BD, "src/lib/simulator/bounds.ts");
  if (!D || !BD) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }

  /* REVIEW FOCUS 5, THE ARITHMETIC: a typed figure keeps its base value whatever the currency. */
  const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  for (const base of ["GBP", "USD"] as const) for (const c of CURRENCIES) for (const x of [0, 1, 362, 1507.72, 556017.36, 2e7]) {
    if (!near(D.fromDisplay(D.toDisplay(x, base, c.code), base, c.code), x)) check(`${x} ${base} through ${c.code} comes back to itself`, false);
  }
  check("every base figure comes back to itself through every currency", true);
  check("a UK figure in pounds is the law's pounds exactly", D.toDisplay(31551.16, "GBP", "GBP") === 31551.16 && D.money(31551.16, "GBP", "GBP") === "£31,551");
  check(`a UK figure in dollars is at fx.ts's pound rate, the trade page's dollars (${D.toDisplay(556017.36, "GBP", "USD")})`, near(D.toDisplay(556017.36, "GBP", "USD"), 556017.36 * 1.3265));
  check(`a dollar figure in pounds is at the display rate (${D.toDisplay(1000, "USD", "GBP")})`, near(D.toDisplay(1000, "USD", "GBP"), 743.5));
  check(`typing 2,000 dollars on a UK view keeps 2,000 / 1.3265 pounds (${D.fromDisplay(2000, "GBP", "USD")})`, near(D.fromDisplay(2000, "GBP", "USD"), 2000 / 1.3265));

  /* REVIEW FOCUS 1, THE SIGN: a loss is a true minus before the symbol. */
  check(`a loss: ${D.money(-12345, "USD", "USD")}, ${D.money(-12345, "USD", "USD", true)}, ${D.percent(-0.04, 0)}`, D.money(-12345, "USD", "USD") === "−$12,345" && D.money(-12345, "USD", "USD", true) === "−$12K" && D.percent(-0.04, 0) === "−4%");
  check(`no minus on nothing, no "$-" anywhere (${D.money(-0.4, "USD", "USD")}, ${D.percent(-0.0001, 1)})`, D.money(-0.4, "USD", "USD") === "$0" && D.percent(-0.0001, 1) === "0.0%" && !D.money(-5000, "USD", "USD").includes("$-"));
  check(`millions compact: ${D.money(1234567, "USD", "USD", true)}`, D.money(1234567, "USD", "USD", true) === "$1.23M");

  /* THE BOUNDS: every lever bounded, the clamp holding them. */
  check("every lever has bounds with min below max and a step", Object.values(BD.BOUNDS).every((b) => b.min < b.max && b.step > 0) && BD.clampTo("area", 999999) === BD.BOUNDS.area.max && BD.clampTo("area", -5) === BD.BOUNDS.area.min, "src/lib/simulator/bounds.ts");

  /* THE LEVER: empty when nothing is held, stamped, its symbol a prop; today's callers draw as before. */
  const html = (p: Partial<React.ComponentProps<typeof Range>>) => renderToStaticMarkup(React.createElement(Range, { id: "x", label: "Rent", min: 0, max: 100, step: 1, value: 50, onChange: () => {}, format: (v: number) => String(v), ...p }));
  check("by default the typed figure reads as before: $ and a whole number", /\$<\/span><input[^>]*value="50"/.test(html({})), "src/components/spine/interact/Range.tsx");
  check("an empty value draws an empty field, says so, and is no figure", /data-empty=""/.test(html({ value: null })) && /<input type="text"[^>]*value=""/.test(html({ value: null })) && !/class="fig /.test(html({ value: null, prov: { src: "x", kind: "estimate" } })), "src/components/spine/interact/Range.tsx");
  check("the typed figure carries its stamp", /class="fig [^"]*"[^>]*data-src="calculator:lever:rent" data-kind="yours"|data-src="calculator:lever:rent" data-kind="yours"[^>]*class="fig /.test(html({ prov: { src: "calculator:lever:rent", kind: "yours" } })), "src/components/spine/interact/Range.tsx");
  check("no symbol when none is asked, one decimal when asked", !html({ symbol: "" }).includes(">$<") && /value="7.5"/.test(html({ value: 7.5, decimals: 1, symbol: "" })), "src/components/spine/interact/Range.tsx");

  /* THE WORDS: every string of COPY.calculator inside the copy rules. */
  const strings: Array<[string, string]> = [];
  const walk = (o: unknown, at: string) => { if (typeof o === "string") strings.push([at, o]); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, `${at}.${k}`); };
  walk(COPY.calculator, "calculator");
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const METHOD = [/\bmodell?ed\b/i, /\bwithheld\b/i, /\bon file\b/i, /\bnot gathered\b/i, /\bnot measured\b/i, /typical for the trade anywhere/i, /\bthe model\b/i, /\bplaceholder\b/i, /as on the opening card/i, /\bworked from\b/i, /\bwe\b/i];
  const LABEL = /^calculator\.(levers\.labels|levers\.groups|levers\.units|bill\.(?!teamNote|ratesNote|ratesStandard)|moves\.rows|month\.key|month\.(monthTab|yearTab|tick)|pick\.(country|city|trade|label)|answer\.(day|customers|firms|goal)|margin\.after|opening\.(total|yours)|sources\.\w+\.label|lines\.openingItems)\b/;
  const PLACEHOLDERS = new Set(["country", "city", "pct", "n", "index", "m2", "sales", "last"]);
  const faults: string[] = [];
  for (const [at, s] of strings) {
    if (s.trim() === "" && !at.endsWith(".runShare")) faults.push(`${at}: empty`);
    if (words(s) > 12) faults.push(`${at}: ${words(s)} words`);
    if (/\.title$/.test(at) && words(s) > 4) faults.push(`${at}: a heading of ${words(s)} words`);
    if (LABEL.test(at) && words(s) > 3) faults.push(`${at}: a label of ${words(s)} words`);
    if (s.includes(";") || s.includes(String.fromCharCode(0x2014))) faults.push(`${at}: a semicolon or an em-dash`);
    for (const re of METHOD) if (re.test(s)) faults.push(`${at}: "${s.match(re)?.[0]}"`);
    for (const b of COPY.banned) if (s.toLowerCase().includes(b)) faults.push(`${at}: the corporate word "${b}"`);
    for (const m of s.matchAll(/\{(\w+)\}/g)) if (!PLACEHOLDERS.has(m[1])) faults.push(`${at}: an unknown slot {${m[1]}}`);
  }
  check(`every one of the ${strings.length} calculator strings keeps the copy rules (${faults.slice(0, 8).join("; ") || "all"})`, strings.length > 100 && faults.length === 0, "src/lib/spine/copy.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/display: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-display crashed:", e); process.exit(1); });
