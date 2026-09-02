/**
 * THROWAWAY. The REAL Tipping card in every branch its reading can reach.
 *
 * The preview's only tipping fixture is a restaurant where tipping is expected,
 * so the branch StateWord exists for, "not expected here", renders on no page in
 * the tree. A4 set the precedent: draw every state the reading can reach in a
 * harness, photograph them side by side, and ship the one the real data has.
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.harness.json \
 *   --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop6_b2_branches.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { Tipping } from "../src/components/kit/trade/TradeSections";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

const CASES: Array<{ note: string; expectation: number | null; share: number | null }> = [
  { note: "expectation 78, share 12: EXPECTED (the only case any page renders)", expectation: 78, share: 12 },
  { note: "expectation 30, share 5: OFFERED RATHER THAN EXPECTED", expectation: 30, share: 5 },
  { note: "expectation 4, share null: NOT EXPECTED", expectation: 4, share: null },
  { note: "expectation 70, share null: a custom with no share held", expectation: 70, share: null },
  { note: "expectation 6, share 10: a share nobody leaves", expectation: 6, share: 10 },
  { note: "expectation null: the card must render NOTHING", expectation: null, share: 12 },
];

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1240, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1b1b1a", marginBottom: 18 }}>
      The tipping card, every branch, at its own 416px and at 327
    </h1>
    {CASES.map((c) => (
      <div key={c.note} style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 8 }}>{c.note}</div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 416, flex: "none" }}>
            <Tipping expectation={c.expectation} typicalShare={c.share} />
          </div>
          <div style={{ width: 327, flex: "none" }}>
            <Tipping expectation={c.expectation} typicalShare={c.share} />
          </div>
        </div>
      </div>
    ))}
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<title>Tipping, every branch</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
[data-trade-section]{padding:0}
</style>
</head>
<body style="font-family: var(--font-body);">${body}</body>
</html>`;

writeFileSync("scratchpad/loop6/b2-branches.html", html, "utf8");
console.log("wrote scratchpad/loop6/b2-branches.html");
