/**
 * THE HOME PAGE'S PRO SAID ONCE, AND THE LAUNCH CHECK'S COUNTS (milestone 3, masterplan step 35; his ruling 23 of 2026-09-26: "a
 * quiet band after the search and the UK answers: what Pro opens, the price, one button"). The Pro band draws only while the
 * paywall's switch is on, its title an h2 as every section's on the home (plan 2026-10-09), its prices through the plan and the
 * year first, led with as the pricing page leads, "$38 a month, billed yearly" (his decision of 2026-10-09), one button to /pricing;
 * and the launch check's item (i) reads the live home's band and passes the rebuilt home, which prints no counts since his
 * instruction of 2026-10-07 ("reform home drastically"; tests/trust/home_shape.test.ts holds that).
 *
 * Run: npx tsx tests/home/home_bands.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { ProBand } from "../../src/components/spine/home/ProBand";
import { priceLine, yearlyHeadline } from "../../src/lib/monetization/plan";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-bands";
const FILE = "src/components/spine/home/home-view.tsx";
const REMEDY = "draw Pro only with the paywall's switch on, its prices through the plan; keep the launch check reading the live home's band and passing the rebuilt home that prints no counts";
let failed = 0;
/* A check may be a value or a function: a function that throws (a name the plan does not export yet) is a failed check. */
const check = (label: string, ok: boolean | (() => boolean), at?: { file?: string; remedy?: string }) => {
  let pass = false;
  try { pass = typeof ok === "function" ? ok() : ok; } catch { pass = false; }
  if (pass) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY });
};
/* The band's own checks name the band's file: ProBand.tsx draws all of it (the title, the figures, the button, the switch). */
const BAND_AT = { file: "src/components/spine/home/ProBand.tsx", remedy: "draw Pro as ProBand holds it: nothing while the paywall's switch is off; with it on, the pricing page's lead as the focal figure, the year's total then the month to month price through the plan, one button to /pricing, the title an h2 (a Rail at level 2)" };

const set = (on: boolean) => { process.env.NEXT_PUBLIC_AUTH_ENABLED = on ? "1" : ""; process.env.NEXT_PUBLIC_PAYWALL = on ? "1" : ""; };
set(false);
const off = renderToStaticMarkup(React.createElement(ProBand));
set(true);
const on = renderToStaticMarkup(React.createElement(ProBand));
set(false);
check("nothing about Pro prints while the switch is off", off === "", BAND_AT);
/* His decision of 2026-10-09: the year leads. The focal figure is the pricing page's own lead, the year by the month with how it is
   billed (a "$38 a month" alone reads as a month-to-month price, which is $48), then the year's total, then the month to month
   price, every figure through the plan, and one button to /pricing. The card is narrow, so the band keeps the last two words of the
   lead together (a no-break space) and the line breaks after its comma; the text a visitor reads is the plan's line. */
const focal = /data-focal="1"[^>]*>([^<]*)</.exec(on)?.[1]?.replace(/\xa0/g, " ");
check(`with the switch on: the focal figure is the pricing page's lead, "${yearlyHeadline()}"`, () => focal === yearlyHeadline(), BAND_AT);
check("with the switch on: the year's total, then the month to month price, all through the plan, one button to /pricing", () => {
  const atYear = on.indexOf(priceLine("year"));
  return atYear > -1 && on.indexOf(priceLine("month")) > atYear
    && /Billed yearly/.test(on) && /Month to month/.test(on)
    && (on.match(/href="\/pricing"/g) ?? []).length === 1 && (on.match(/<a /g) ?? []).length === 1;
}, BAND_AT);

/* One h2 a section on the home (plan 2026-10-09, home introduction): the Pro band's title too. The notebook left the home with that plan
   (where to next links /blog). */
check("with the switch on: the band's title is an h2", () => /<h2 [^>]*data-rail-title=""[^>]*>Pro<\/h2>/.test(on), BAND_AT);

const launch = readFileSync("scripts/verify_launch_ready.ts", "utf8");
check("the launch check's item (i) reads the live home's band and passes the rebuilt home only while it prints no stamped count", /What the atlas holds/.test(launch) && /data-composition="zones"/.test(launch) && /atlas_ledger\\\.ts:/.test(launch));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_bands: all pass");
