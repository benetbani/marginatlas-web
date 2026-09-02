/**
 * THROWAWAY. B4's branches, loop run 7. B2's rule: photograph the branches, not
 * the fixture. The preview holds one schemes fixture, two priced schemes on a
 * restaurant, and the branches that decide whether the card is honest are the
 * ones it does not hold.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop7_b4_branches.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { DealsAndRegimes, type RegimeRow } from "../src/components/kit/trade/TradeSections";

const css = readFileSync("scratchpad/pages/site.css", "utf8");
const PAY = 19;

const TWO: RegimeRow[] = [
  { name: "Hospitality rate", worth: 2600, cuts: "premises", detail: "Business rates are reduced for premises below a rateable value threshold, applied by the council each April and claimed once rather than annually." },
  { name: "Apprentice relief", worth: 1700, cuts: "staff", detail: "No employer contributions on staff under twenty-five in their first year, which is claimed through payroll and stops the month the year ends." },
];

const UNPRICED: RegimeRow[] = [
  TWO[0],
  { name: "Employment allowance for small employers", worth: null, cuts: "staff", detail: "The first slice of the employer contribution bill is written off each year, so what it is worth depends on a payroll this page does not know." },
  { name: "Zone relief", worth: 900, cuts: "premises", detail: "Applies inside the enterprise zone only, and the boundary is drawn street by street." },
];

const ONE: RegimeRow[] = [TWO[0]];

const ALL_UNPRICED: RegimeRow[] = [
  { name: "Sector regime", worth: null, cuts: "profit", detail: "A reduced rate on trading profit for firms inside the named sector." },
  { name: "Social contribution rebate", worth: null, cuts: "staff", detail: "A share of employer contributions is returned each quarter." },
];

function Case({ title, note, rows, pay }: { title: string; note: string; rows: RegimeRow[]; pay: number | null }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1a" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 10, maxWidth: "80ch" }}>{note}</div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        {[520, 327].map((w) => (
          <div key={w} style={{ width: w, flex: "none" }}>
            <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{w}px</div>
            <DealsAndRegimes rows={rows} localHourlyPay={pay} />
          </div>
        ))}
      </div>
    </section>
  );
}

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>B4, every branch, at 520 and 327</h1>
    <Case title="1. TWO PRICED SCHEMES (the only branch the preview renders)" note="The total leads, the table carries both worths and their yardsticks." rows={TWO} pay={PAY} />
    <Case title="2. ONE SCHEME UNPRICED, AND A NAME THAT WRAPS" note="No total is possible, so the COUNT leads and it must take the WORDS rung at 24, never the focal rung: a word is not a quantity. The unpriced cell must print the reason, not a blank." rows={UNPRICED} pay={PAY} />
    <Case title="3. EVERY SCHEME UNPRICED" note="The count leads and the yardstick column must not draw at all." rows={ALL_UNPRICED} pay={PAY} />
    <Case title="4. NO LOCAL WAGE HELD: the universality check" note="Rule 21. Two columns, and every sentence must still read." rows={TWO} pay={null} />
    <Case title="5. ONE SCHEME" note="A table of one row is still a table, and the consequence must not say 'both'." rows={ONE} pay={PAY} />
    <Case title="6. NO SCHEMES: the refusal" note="Must render nothing." rows={[]} pay={PAY} />
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head><meta charset="utf-8"><title>B4 branches</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
[data-trade-section]{padding:0}
details[open] > div{display:block}
</style></head>
<body style="font-family: var(--font-body);">${body}</body></html>`;

mkdirSync("scratchpad/loop7", { recursive: true });
writeFileSync("scratchpad/loop7/b4-branches.html", html, "utf8");
console.log("wrote scratchpad/loop7/b4-branches.html");
