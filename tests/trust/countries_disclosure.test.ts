/**
 * /COUNTRIES OPENS BY CONTINENT, A COUNTRY IS ITS FLAG AND ITS NAME, THE PICKER PRINTS NO COUNT (his rulings of 2026-10-07).
 * North America and Europe come first and stand open, the other four continents are folded, a tile carries no benchmark
 * line, and the home picker's "195 countries / 128 activities" column is gone. Run: npx tsx tests/trust/countries_disclosure.test.ts
 */
import { readFileSync } from "node:fs";

let failed = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const page = readFileSync("src/app/(site)/countries/page.tsx", "utf8");
const picker = readFileSync("src/components/NavigatorForm.tsx", "utf8");

const order = /const CONTINENT_ORDER = \[([^\]]*)\]/.exec(page);
const names = order ? [...order[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
check("CONTINENT_ORDER starts with North America, then Europe", names[0] === "North America" && names[1] === "Europe");
check("Africa is not first", names.length > 0 && names[0] !== "Africa");

check("the page draws each continent as a native <details>", /<details\b/.test(page));
check("the continent map hands each continent its index", /CONTINENT_ORDER\.map\(\(continent, i\)/.test(page));
const open = /<details\b[^>]*?\bopen=\{([^}]+)\}/s.exec(page);
const opens = open ? Array.from({ length: names.length }, (_, i) => Boolean(new Function("i", `return ${open[1]};`)(i))) : [];
check("exactly the first two continents are open", opens.length === 6 && opens.filter(Boolean).length === 2 && opens[0] === true && opens[1] === true);

check("the page no longer says benchmarks", !/benchmarks/i.test(page));
check("the page no longer draws a Stat", !/<Stat\b/.test(page));

check("the picker no longer prints a countries count", !/countries<\/div>/.test(picker));
check("the picker no longer prints an activities count", !/activities<\/div>/.test(picker));

if (failed > 0) { console.error(`trust/countries_disclosure: ${failed} failure(s). Remedy: in src/app/(site)/countries/page.tsx order the continents North America, Europe first, draw each as a <details> open only for the first two, and print only a flag and a name per country; in src/components/NavigatorForm.tsx remove the countries and activities count, then run npx tsx tests/trust/countries_disclosure.test.ts`); process.exit(1); }
console.log("trust/countries_disclosure: all pass");
