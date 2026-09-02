/**
 * THROWAWAY. B3's branches, loop run 7.
 *
 * B2's finding: photograph the BRANCHES, not the fixture. The preview holds one
 * pavement fixture, a restaurant charged $1,240 a table for four tables, and it
 * is the only branch any document in this tree renders. The others decide whether
 * the card is honest.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop7_b3_branches.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { PublicSpaceCost } from "../src/components/kit/trade/TradeSections";

const css = readFileSync("scratchpad/pages/site.css", "utf8");
const PAY = 19;

function Case({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1a" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 10, maxWidth: "80ch" }}>{note}</div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}

function At({ w, children }: { w: number; children: React.ReactNode }) {
  return (
    <div style={{ width: w, flex: "none" }}>
      <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{w}px</div>
      {children}
    </div>
  );
}

const W = [624, 327];

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>B3, every branch, at 624 and 327</h1>

    <Case title="1. CHARGED, everything held (the only branch the preview renders)" note="$1,240 a table, four tables, four seats each, a $31 ticket.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={1240} unit="table" unitsCovered={4} seatsPerUnit={4} typicalTicket={31} localHourlyPay={PAY} />
        </At>
      ))}
    </Case>

    <Case title="2. FREE, the branch that used to lie" note="annual 0. It printed 'they pay for themselves at about one extra customer a week' because the break-even floored at one. It must now say the space costs nothing and state NO payback.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={0} unit="table" unitsCovered={4} seatsPerUnit={4} typicalTicket={31} localHourlyPay={PAY} />
        </At>
      ))}
    </Case>

    <Case title="3. NO COUNT: the rate takes the answer back" note="Only the per-unit fee is held. No total, no evidence rows, no break-even.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={1240} unit="table" unitsCovered={null} seatsPerUnit={null} typicalTicket={31} localHourlyPay={PAY} />
        </At>
      ))}
    </Case>

    <Case title="4. NO TICKET: a total, but nothing to price it in" note="The break-even is omitted rather than estimated; the fixed-cost line takes its place.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={1240} unit="table" unitsCovered={4} seatsPerUnit={4} typicalTicket={null} localHourlyPay={PAY} />
        </At>
      ))}
    </Case>

    <Case title="5. NO SEATS PER UNIT: one evidence fact, so no two-up" note="The grid must not put one cell in a half and leave the other half empty.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={1240} unit="table" unitsCovered={4} seatsPerUnit={null} typicalTicket={31} localHourlyPay={PAY} />
        </At>
      ))}
    </Case>

    <Case title="6. A SQUARE METRE, and no local pay: the universality check" note="Rule 21. The unit is not a table and no wage is held, so the yardstick must vanish and every sentence must still read.">
      {W.map((w) => (
        <At key={w} w={w}>
          <PublicSpaceCost annual={38} unit="square metre" unitsCovered={12} seatsPerUnit={2} typicalTicket={4} localHourlyPay={null} />
        </At>
      ))}
    </Case>

    <Case title="7. THE REFUSALS: no fee, and no unit" note="Both must render nothing.">
      <At w={327}>
        <PublicSpaceCost annual={null} unit="table" unitsCovered={4} seatsPerUnit={4} typicalTicket={31} localHourlyPay={PAY} />
      </At>
      <At w={327}>
        <PublicSpaceCost annual={1240} unit={null} unitsCovered={4} seatsPerUnit={4} typicalTicket={31} localHourlyPay={PAY} />
      </At>
    </Case>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head><meta charset="utf-8"><title>B3 branches</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
[data-trade-section]{padding:0}
</style></head>
<body style="font-family: var(--font-body);">${body}</body></html>`;

mkdirSync("scratchpad/loop7", { recursive: true });
writeFileSync("scratchpad/loop7/b3-branches.html", html, "utf8");
console.log("wrote scratchpad/loop7/b3-branches.html");
