/**
 * icon_column_test , THE TEST ICONOGRAPHY I6 ASKS FOR AND NOBODY HAS RUN.
 *
 * The founder, 2026-08-26: "the icons are small and hard to understand."
 *
 * The test is not whether a glyph is well drawn. It is whether a reader can NAME
 * the section from the shape alone, at the size it actually renders, with its
 * neighbours beside it. An icon that only reads when you already know the answer
 * is decoration with a border.
 *
 * WHAT THIS DRAWS. Every section icon in use across the four page types, in one
 * strip, three times:
 *
 *   column 1   the icon exactly as it renders on a page: a 16px glyph in a 28px
 *              tile. This is the only column that decides anything.
 *   column 2   the same glyph at 6x, which shows what was DRAWN as opposed to
 *              what arrives.
 *   column 3   the name of the section it stands for, which is the answer sheet
 *              and must be covered on the first pass.
 *
 * HOW TO READ IT. Look at column 1 only. Name the section. Then check column 3.
 * A glyph you cannot name, or name the same as its neighbour, has failed.
 *
 * Usage: npx tsx --tsconfig scripts/tsconfig.harness.json
 *          --require ./scripts/spikes/stub_next_font.cjs scripts/icon_column_test.tsx
 * Writes: docs/loop/artifacts/icon-column-test.html
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { AtlasIcon } from "@/components/brand/icons";

/* Every icon used by a Rail or a Movement across the four page types, with the
   section it stands for. The pairing is what makes the test answerable: an icon
   is judged against the thing it is supposed to mean. */
const ICONS: Array<[string, string]> = [
  ["benchmark", "Kept per $100, by trade"],
  ["best-areas", "Place and rivals"],
  ["bookmark", "The pick, and where to take it"],
  ["break-even", "When it clears costs"],
  ["catchment", "Who it reaches"],
  ["commercial-rent", "The rent, district by district"],
  ["compare", "The same trade, comparable places"],
  ["cost-breakdown", "Where each $100 goes"],
  ["daily-takings", "What it earns"],
  ["ease-of-business", "How hard it is to start"],
  ["first-year", "The first year"],
  ["footfall", "Who walks past"],
  ["gut-check", "What it takes, and what it pays"],
  ["high-street", "The high street"],
  ["locals-know", "What locals know"],
  ["market-size", "Market size"],
  ["myth-reality", "Myth vs. reality"],
  ["owner-keeps", "What the owner keeps"],
  ["ranking", "Ranked by rent load"],
  ["red-tape", "Red tape"],
  ["scorecard", "Quick reads"],
  ["seasonality", "How seasonal it is"],
  ["spending-power", "What customers earn here"],
  ["startup-cost", "What it costs to open one"],
  ["subtype", "Keep and cost, trades next door"],
  ["unit-economics", "How the money works"],
  ["wages", "What the team costs"],
  ["watch", "What to watch"],
  ["where-it-pays", "Where it pays"],
  ["who-for", "Who it suits"],
];

function Tile({ id, size, box }: { id: string; size: number; box: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        height: box,
        width: box,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: box / 4,
        background: "var(--c-soft)",
        border: "1px solid var(--c-border)",
      }}
    >
      <AtlasIcon id={id as any} size={size} className="spine-ic" style={{ color: "var(--c-ink2)" }} />
    </span>
  );
}

const CSS_FILE = "docs/loop/artifacts/final-pages/atlas-spine.css";

function page() {
  const rows = ICONS.map(([id, section]) => (
    <tr key={id}>
      <td style={{ padding: "10px 18px 10px 0", verticalAlign: "middle" }}>
        <Tile id={id} size={16} box={28} />
      </td>
      <td style={{ padding: "10px 26px 10px 0", verticalAlign: "middle" }}>
        <Tile id={id} size={96} box={168} />
      </td>
      <td style={{ padding: "10px 0", verticalAlign: "middle", fontSize: 13, color: "#1b1b1a" }}>
        <span className="answer">{section}</span>
        <div style={{ fontSize: 11, color: "#8c8c8a", marginTop: 2 }}>{id}</div>
      </td>
    </tr>
  ));
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".07em", color: "#8c8c8a" }}>
          <th style={{ textAlign: "left", padding: "0 18px 10px 0" }}>as it renders</th>
          <th style={{ textAlign: "left", padding: "0 26px 10px 0" }}>at 6x</th>
          <th style={{ textAlign: "left", padding: "0 0 10px" }}>what it stands for</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

const css = existsSync(CSS_FILE) ? readFileSync(CSS_FILE, "utf8") : "";
const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Icon column test</title>
<style>${css}</style>
<style>:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}</style>
<style>
  body { margin:0; padding:28px 32px; background:#faf9f8;
         font: 14px/1.5 ui-sans-serif, system-ui, "Segoe UI", sans-serif; color:#1b1b1a; }
  h1 { font-size:19px; margin:0 0 4px; }
  p.sub { color:#6f6f6d; margin:0 0 22px; max-width:62ch; font-size:13px; }
  /* The answer sheet is hidden until asked for, because a test you can read the
     answers off is not a test. */
  body.blind .answer { visibility:hidden; }
</style></head><body class="blind">
<h1>The icon column test</h1>
<p class="sub">Column one is the only column that decides anything: that is the size these
render at on a page. Name the section from the shape, then reveal the answers. A glyph you
cannot name, or that you name the same as its neighbour, has failed. Remove the class
"blind" on the body to show the answers.</p>
${renderToStaticMarkup(page())}
</body></html>`;

writeFileSync("docs/loop/artifacts/icon-column-test.html", html, "utf8");
console.log(`  wrote docs/loop/artifacts/icon-column-test.html  (${ICONS.length} icons)`);
