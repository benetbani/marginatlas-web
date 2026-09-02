/**
 * THROWAWAY. Step zero of loop run 7.
 *
 * OptionCards is the last unshipped form with queued rows (B4 trade, B8
 * country), and B4 is its first real test. Version 3 redesigned it ON PAPER
 * after the founder called seven of the eight forms "completely mediocre slop",
 * and it has never rendered anywhere with data. The sixth run's step zero paid
 * for itself twice over on BenchmarkPair, so the same check runs here first.
 *
 * THE CLAIM THIS FILE EXISTS TO TEST, in the catalogue's own words: "every
 * card's figure sits on ONE shared baseline and every card's hairline at ONE
 * shared height, whatever the name's length. Normalise the header height; never
 * let a two-line name push one card's figure below its neighbours'." The first
 * version of the form was rejected for exactly that fault, so it is VERIFIED BY
 * MEASURING, in scratchpad/loop7_measure_cards.mjs, and not by eye.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop7_optioncards.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { OptionCards } from "../src/components/spine/forms-v2";
import { Box, Rail } from "../src/components/spine/kit";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

/* The Section wrapper in TradeSections.tsx is not exported, so its frame is
   reconstructed exactly as it draws: Box, 20px of inline padding, Rail, then
   the form. Nothing else, because the point is to see the FORM. */
function Card({ kicker, w, id, children }: { kicker: string; w: number; id: string; children: React.ReactNode }) {
  return (
    <div style={{ width: w, flex: "none" }}>
      <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {w}px
      </div>
      <Box data-trade-section="1">
        <div style={{ padding: 20 }} data-probe={id}>
          <Rail icon="free-zone" kicker={kicker} />
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

/* 347 is a one-third column at 1280, 416 two fifths, 520 an equal half, 343 a
   full-width card at 375. Every figure here is invented. */
const WIDTHS = [347, 416, 520, 343];

const TWO = [
  { name: "Hospitality rate", figure: "$2,600", unit: "a year", means: "Business rates fall below a rateable value threshold." },
  { name: "Apprentice relief", figure: "$1,700", unit: "a year", means: "No employer contributions on staff under twenty-five.", usual: true },
];

const THREE = [
  { name: "Sole trader", figure: "$0", unit: "a year", means: "Nothing to file beyond your own tax return." },
  { name: "Limited company", figure: "$310", unit: "a year", means: "Accounts and a fee every year, and the business owes its debts rather than you.", usual: true },
  { name: "Partnership", figure: "$140", unit: "a year", means: "One return each, and the liability is shared." },
];

const FOUR = [
  { name: "Sole trader", figure: "$0", unit: "a year", means: "Nothing to file beyond your own tax return." },
  { name: "Limited company", figure: "$310", unit: "a year", means: "Accounts and a fee every year.", usual: true },
  { name: "Partnership", figure: "$140", unit: "a year", means: "One return each, and the liability is shared." },
  { name: "Branch", figure: "$480", unit: "a year", means: "A foreign parent files here as well as at home." },
];

/* THE FAULT THE FORM WAS REJECTED FOR: one name long enough to wrap. */
const LONG_NAME = [
  { name: "Hospitality rate", figure: "$2,600", unit: "a year", means: "Business rates fall below a threshold." },
  { name: "Employment allowance for small employers", figure: "$1,700", unit: "a year", means: "No employer contributions on the first slice of the payroll bill.", usual: true },
  { name: "Zone relief", figure: "$900", unit: "a year", means: "Applies inside the enterprise zone only." },
];

const MISSING_FIGURE = [
  { name: "Hospitality rate", figure: "$2,600", unit: "a year", means: "Business rates fall below a threshold." },
  { name: "Payroll relief", figure: null, unit: "a year", means: "What it is worth depends on a payroll this page does not know." },
  { name: "Zone relief", figure: "$900", unit: "a year", means: "Applies inside the enterprise zone only." },
];

const LONG_MEANS = [
  { name: "Sole trader", figure: "$0", unit: "a year", means: "Nothing to file beyond your own tax return." },
  {
    name: "Limited company",
    figure: "$310",
    unit: "a year",
    means:
      "Accounts and a confirmation statement every year, a filing fee each time, and the business owes its own debts rather than you owing them personally, which is the whole reason most operators here take it even though it costs more to run.",
    usual: true,
  },
  { name: "Partnership", figure: "$140", unit: "a year", means: "One return each, and the liability is shared." },
];

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1b1b1a", marginBottom: 4 }}>
      OptionCards, every state its reading reaches, at four real card widths
    </h1>
    <p style={{ fontSize: 13, color: "#565654", maxWidth: "90ch", marginBottom: 26 }}>
      347 is a one-third column at 1280, 416 two fifths, 520 an equal half, 343 a full-width card
      at 375. Every figure is invented. The shared baseline and the shared hairline height are
      measured in scratchpad/loop7_measure_cards.mjs, not judged by eye.
    </p>

    <Row title="1. TWO options, with the usual-choice badge" note="The floor of the form. One option is not a choice and renders nothing.">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Schemes you may qualify for" w={w} id={`two-${w}`}>
          <OptionCards options={TWO} ariaLabel="Two schemes" />
        </Card>
      ))}
    </Row>

    <Row title="2. THREE options, with the badge" note="The B4 and B8 case. Expect three cards in a row at 520 and 416, and a wrap below that.">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Registering, by legal form" w={w} id={`three-${w}`}>
          <OptionCards options={THREE} ariaLabel="Three legal forms" />
        </Card>
      ))}
    </Row>

    <Row title="3. FOUR options, the ceiling" note="Five is refused outright rather than truncated.">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Registering, by legal form" w={w} id={`four-${w}`}>
          <OptionCards options={FOUR} ariaLabel="Four legal forms" />
        </Card>
      ))}
    </Row>

    <Row title="4. NO badge anywhere" note="Nothing carries `usual`. The set must still read as one comparison, and the card then has no accent at all.">
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Schemes you may qualify for" w={w} id={`nobadge-${w}`}>
          <OptionCards options={THREE.map(({ usual, ...rest }) => rest)} ariaLabel="Three legal forms, no usual pick" />
        </Card>
      ))}
    </Row>

    <Row
      title="5. A LONG NAME THAT WRAPS, beside two short ones"
      note="THE ROW THE FORM WAS REJECTED FOR. A two-line name must lift every card's header together, never push its own figure below its neighbours'."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Schemes you may qualify for" w={w} id={`longname-${w}`}>
          <OptionCards options={LONG_NAME} ariaLabel="Three schemes, one long name" />
        </Card>
      ))}
    </Row>

    <Row
      title="6. ONE OPTION MISSING ITS FIGURE"
      note="The middle option carries no worth. The form's own filter drops it, so a set of three renders as two: look at what the reader is left with."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Schemes you may qualify for" w={w} id={`nofig-${w}`}>
          <OptionCards options={MISSING_FIGURE} ariaLabel="Three schemes, one unpriced" />
        </Card>
      ))}
    </Row>

    <Row
      title="7. A MEANING LINE THAT RUNS LONG"
      note="Clamped at three lines by the form. Check that the clamp cuts cleanly and that the tall card does not strand its neighbours."
    >
      {WIDTHS.map((w) => (
        <Card key={w} kicker="Registering, by legal form" w={w} id={`longmeans-${w}`}>
          <OptionCards options={LONG_MEANS} ariaLabel="Three legal forms, one long meaning" />
        </Card>
      ))}
    </Row>

    <Row
      title="8. THE REFUSALS: one option, five options, no options"
      note="All three must render NOTHING. An empty card under each caption is the pass."
    >
      <Card kicker="One option" w={347} id="one">
        <OptionCards options={[THREE[0]]} ariaLabel="One" />
      </Card>
      <Card kicker="Five options" w={520} id="five">
        <OptionCards options={[...FOUR, { name: "Co-operative", figure: "$95", unit: "a year", means: "Members own it." }]} ariaLabel="Five" />
      </Card>
      <Card kicker="No options" w={347} id="none">
        <OptionCards options={null} ariaLabel="None" />
      </Card>
    </Row>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OptionCards, every state</title>
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

mkdirSync("scratchpad/loop7", { recursive: true });
writeFileSync("scratchpad/loop7/optioncards.html", html, "utf8");
console.log(`wrote scratchpad/loop7/optioncards.html (${Math.round(html.length / 1024)}KB)`);
