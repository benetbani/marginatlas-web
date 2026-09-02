/**
 * THROWAWAY. B6's branches, loop run 8.
 *
 * B2's rule, and the brief's own instruction for this row: photograph the
 * BRANCHES, not the fixture. The preview holds ONE town-hall fixture, a
 * cleanliness of 71, and it is the only branch any document in this tree renders.
 * The other branches are where the honesty is decided: absent data, a genuinely
 * middling reading and a good reading are three different states, and a card that
 * renders two of them identically is the sixth run's tipping defect wearing a new
 * hat.
 *
 * Both thresholds are rendered from BOTH sides, because a band's boundary is the
 * one value a guard can get wrong silently.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop8_b6_branches.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { TownHall } from "../src/components/kit/trade/TradeSections";

const css = readFileSync("scratchpad/pages/site.css", "utf8");
const SCALE = "A published perception measure";

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

/* 520 is the card's real width in the preview's fourth band; 327 is a full-width
   phone card. */
const W = [520, 327];

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>B6, every state, at 520 and 327</h1>

    <Case title="1. CLEAN, 71 (the only branch the preview renders)" note="Rung 3 of 3, the top of the ladder, which is where the card's own answer says clean is.">
      {W.map((w) => (
        <At key={w} w={w}>
          <TownHall cleanliness={71} scale={SCALE} />
        </At>
      ))}
    </Case>

    <Case title="2. THE UPPER BOUNDARY, 65 and 64" note="65 must reach the top rung and 64 the middle one. A boundary is the one value a guard gets wrong without saying so.">
      {W.map((w) => (
        <At key={w} w={w}>
          <TownHall cleanliness={65} scale={SCALE} />
        </At>
      ))}
      {W.map((w) => (
        <At key={`b${w}`} w={w}>
          <TownHall cleanliness={64} scale={SCALE} />
        </At>
      ))}
    </Case>

    <Case title="3. MIDDLING, 52" note="THE STATE THE BRIEF ASKS ABOUT. It must look like neither of its neighbours: a middle rung filled, its own consequence, and no borrowed mark.">
      {W.map((w) => (
        <At key={w} w={w}>
          <TownHall cleanliness={52} scale={SCALE} />
        </At>
      ))}
    </Case>

    <Case title="4. THE LOWER BOUNDARY, 40 and 39" note="40 must reach the middle rung and 39 the bottom one.">
      {W.map((w) => (
        <At key={w} w={w}>
          <TownHall cleanliness={40} scale={SCALE} />
        </At>
      ))}
      {W.map((w) => (
        <At key={`b${w}`} w={w}>
          <TownHall cleanliness={39} scale={SCALE} />
        </At>
      ))}
    </Case>

    <Case title="5. FRICTION, 18, and the ends of the scale, 0 and 100" note="The bottom rung carries the card's accent here. Rule 29A governs a SCALE's direction and this one is not inverted; the question the photograph settles is whether terracotta on bad news reads as a recommendation.">
      <At w={520}>
        <TownHall cleanliness={18} scale={SCALE} />
      </At>
      <At w={520}>
        <TownHall cleanliness={0} scale={SCALE} />
      </At>
      <At w={520}>
        <TownHall cleanliness={100} scale={SCALE} />
      </At>
    </Case>

    <Case title="6. NO SCALE NAMED" note="The basis must still read as a sentence when the caller holds no name for the measure.">
      <At w={520}>
        <TownHall cleanliness={71} />
      </At>
      <At w={327}>
        <TownHall cleanliness={71} />
      </At>
    </Case>

    <Case title="7. THE REFUSALS: absent, off the scale, and not a number" note="null, 150, -5 and NaN must every one render NOTHING. The Meter this replaces filled a track past its own end for a 150.">
      <At w={327}>
        <TownHall cleanliness={null} scale={SCALE} />
      </At>
      <At w={327}>
        <TownHall cleanliness={150} scale={SCALE} />
      </At>
      <At w={327}>
        <TownHall cleanliness={-5} scale={SCALE} />
      </At>
      <At w={327}>
        <TownHall cleanliness={Number.NaN} scale={SCALE} />
      </At>
    </Case>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head><meta charset="utf-8"><title>B6 branches</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
[data-trade-section]{padding:0}
</style></head>
<body style="font-family: var(--font-body);">${body}</body></html>`;

mkdirSync("scratchpad/loop8", { recursive: true });
writeFileSync("scratchpad/loop8/b6-branches.html", html, "utf8");
console.log("wrote scratchpad/loop8/b6-branches.html");
