/**
 * THROWAWAY. Step zero of loop run 6.
 *
 * BenchmarkPair and StateWord are the two forms the founder called
 * "completely mediocre slop" on 2026-09-01, that version 3 redesigned ON PAPER,
 * and that have NEVER RENDERED ANYWHERE with real data. Four wave-B rows point
 * at them. A4's harness (the ring in all four of its states) is the pattern:
 * draw every state the reading can reach, photograph it, and look, BEFORE
 * building cards on top of it.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop6_states.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { BenchmarkPair, StateWord } from "../src/components/spine/forms-v2";
import { Box, Rail } from "../src/components/spine/kit";

const css = readFileSync("scratchpad/pages/site.css", "utf8");
const usd = (n: number) => `$${n >= 1000 ? n.toLocaleString() : String(n)}`;

/* The Section wrapper in TradeSections.tsx is not exported, so its frame is
   reconstructed here exactly as it draws: Box, 20px of inline padding, Rail,
   then the form. Nothing else, because the point is to see the FORM. */
function Card({ kicker, w, children }: { kicker: string; w: number; children: React.ReactNode }) {
  return (
    <div style={{ width: w, flex: "none" }}>
      <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {w}px
      </div>
      <Box data-trade-section="1">
        <div style={{ padding: 20 }}>
          <Rail icon="sale-tag" kicker={kicker} />
          {children}
        </div>
      </Box>
    </div>
  );
}

function Row({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1a" }}>{title}</div>
      {note ? <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 10, maxWidth: "80ch" }}>{note}</div> : <div style={{ height: 10 }} />}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}

const WIDTHS = [347, 520, 343];

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1240, margin: "0 auto", padding: "24px" }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1b1b1a", marginBottom: 4 }}>
      BenchmarkPair and StateWord, every state, at three real card widths
    </h1>
    <p style={{ fontSize: 13, color: "#565654", maxWidth: "90ch", marginBottom: 26 }}>
      347 is a one-third column at 1280, 520 an equal half, 343 a full-width card at 375. Every
      figure is invented.
    </p>

    <Row
      title="BenchmarkPair 1. ABOVE its reference"
      note="$31 against $24, the catalogue's own worked example. Expect a badge reading 'about a third more' with an up triangle."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="What people pay here" w={w}>
          <BenchmarkPair value={31} reference={24} referenceLabel="the typical trade in this city" format={usd} />
        </Card>
      ))}
    </Row>

    <Row title="BenchmarkPair 2. BELOW its reference" note="$18 against $24, a quarter less.">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="What people pay here" w={w}>
          <BenchmarkPair value={18} reference={24} referenceLabel="the typical trade in this city" format={usd} />
        </Card>
      ))}
    </Row>

    <Row
      title="BenchmarkPair 3. LEVEL with its reference"
      note="$24 against $24.40, inside the 3% dead band: 'the same, near enough', with the level bar."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="What people pay here" w={w}>
          <BenchmarkPair value={24} reference={24.4} referenceLabel="the typical trade in this city" format={(n) => usd(Math.round(n))} />
        </Card>
      ))}
    </Row>

    <Row
      title="BenchmarkPair 4. ZERO reference, and 5. ABSENT reference, and 6. absent LABEL"
      note="All three must render NOTHING. An empty card below each caption is the pass."
    >
      <Card kicker="Zero reference" w={347}>
        <BenchmarkPair value={31} reference={0} referenceLabel="the typical trade" format={usd} />
      </Card>
      <Card kicker="Absent reference" w={347}>
        <BenchmarkPair value={31} reference={null} referenceLabel="the typical trade" format={usd} />
      </Card>
      <Card kicker="Absent label" w={347}>
        <BenchmarkPair value={31} reference={24} referenceLabel={null} format={usd} />
      </Card>
    </Row>

    <Row
      title="BenchmarkPair 7. THE ENDS OF THE PHRASE LIST"
      note="$190 against $24 is off the fraction scale; $3 against $24 is 'a fraction of it'; $48 against $24 is exactly twice."
    >
      <Card kicker="Many times" w={347}>
        <BenchmarkPair value={190} reference={24} referenceLabel="the typical trade" format={usd} />
      </Card>
      <Card kicker="A fraction" w={347}>
        <BenchmarkPair value={3} reference={24} referenceLabel="the typical trade" format={usd} />
      </Card>
      <Card kicker="Twice" w={347}>
        <BenchmarkPair value={48} reference={24} referenceLabel="the typical trade" format={usd} />
      </Card>
    </Row>

    <Row
      title="BenchmarkPair 8. ACCENT ON, and with the form's own label instead of a rail"
      note="The badge takes terracotta. Compare it against the neutral twin in row 1."
    >
      <Card kicker="What people pay here" w={347}>
        <BenchmarkPair value={31} reference={24} referenceLabel="the typical trade in this city" format={usd} accent />
      </Card>
      <div style={{ width: 347, flex: "none" }}>
        <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          347px, own label, no rail
        </div>
        <Box data-trade-section="1">
          <div style={{ padding: 20 }}>
            <BenchmarkPair
              value={31}
              reference={24}
              referenceLabel="the typical trade in this city"
              format={usd}
              label="What a table spends"
            />
          </div>
        </Box>
      </div>
      <div style={{ width: 347, flex: "none" }}>
        <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          THREE STACKED, 347px, the B1 case
        </div>
        <Box data-trade-section="1">
          <div style={{ padding: 20 }}>
            <Rail icon="sale-tag" kicker="What people pay here" />
            <div style={{ display: "grid", gap: 16 }}>
              <BenchmarkPair value={22} reference={19} referenceLabel="the typical main course" format={usd} label="Main course" />
              <BenchmarkPair value={8} reference={7} referenceLabel="the typical glass" format={usd} label="Glass of wine" />
              <BenchmarkPair value={9} reference={6} referenceLabel="the typical dessert" format={usd} label="Dessert" />
            </div>
          </div>
        </Box>
      </div>
    </Row>

    <Row
      title="StateWord 1. YES, 2. NO, 3. NOT APPLICABLE"
      note="A tick, a cross, a dash, each on a 36px disc, the phrase at lead beside it, the consequence under it."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Tipping" w={w}>
          <StateWord
            kind="yes"
            state="Expected"
            fact="It goes to the staff, so it lifts their take-home without lifting your wage cost."
          />
        </Card>
      ))}
    </Row>

    <Row title="" note="">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Tipping" w={w}>
          <StateWord
            kind="no"
            state="Not expected here"
            fact="Wages carry the whole of pay here, so budget the full cost of a shift into the rota."
          />
        </Card>
      ))}
    </Row>

    <Row title="" note="">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Tables on the pavement" w={w}>
          <StateWord
            kind="na"
            state="Not required here"
            fact="No council permit covers tables on the pavement."
          />
        </Card>
      ))}
    </Row>

    <Row
      title="StateWord 4. ACCENT, 5. a state that wraps, 6. no supporting fact, 7. no state at all"
      note="The last card must render NOTHING."
    >
      <Card kicker="Tipping" w={347}>
        <StateWord kind="yes" state="Expected" fact="It goes to the staff." accent />
      </Card>
      <Card kicker="Tipping" w={347}>
        <StateWord
          kind="no"
          state="Not expected, and offering may be refused"
          fact="Wages carry the whole of pay here."
        />
      </Card>
      <Card kicker="Tipping" w={347}>
        <StateWord kind="na" state="Not expected here" />
      </Card>
      <Card kicker="No state" w={347}>
        <StateWord kind="yes" state={null} fact="Something." />
      </Card>
    </Row>

    <Row
      title="THE B2 CASE: a state AND a share in one card"
      note="StateWord above, then the share. Left: the share as a BenchmarkPair against a reference. Right: the not-expected branch, where there is no share at all."
    >
      <div style={{ width: 347, flex: "none" }}>
        <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          expected + share
        </div>
        <Box data-trade-section="1">
          <div style={{ padding: 20 }}>
            <Rail icon="payments" kicker="Tipping" />
            <StateWord kind="yes" state="Expected" fact="Left on the card, and it goes straight to the staff." />
            <div style={{ marginTop: 16 }}>
              <BenchmarkPair
                value={12}
                reference={10}
                referenceLabel="the usual restaurant tip"
                format={(n) => `${n}%`}
                label="The customary share"
              />
            </div>
          </div>
        </Box>
      </div>
      <div style={{ width: 347, flex: "none" }}>
        <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          not expected, no share
        </div>
        <Box data-trade-section="1">
          <div style={{ padding: 20 }}>
            <Rail icon="payments" kicker="Tipping" />
            <StateWord
              kind="no"
              state="Not expected here"
              fact="Wages carry the whole of pay, so budget the full cost of a shift into the rota."
            />
          </div>
        </Box>
      </div>
    </Row>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BenchmarkPair and StateWord, every state</title>
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
<body style="font-family: var(--font-body);">
${body}
</body>
</html>`;

writeFileSync("scratchpad/loop6/states.html", html, "utf8");
console.log(`wrote scratchpad/loop6/states.html (${Math.round(html.length / 1024)}KB)`);
