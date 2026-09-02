/**
 * scripts/spikes/preview_form_library.tsx
 *
 * ONE FILE THE FOUNDER OPENS, showing all eight catalog-v2 forms built into
 * src/components/spine/forms-v2.tsx, side by side, at the width a real card
 * gives them.
 *
 * WHY THEY ARE SHOWN TOGETHER AND NOT ONE AT A TIME. The defect they correct is
 * SAMENESS: the ten trade sections of 2026-08-31 were each defensible alone and
 * all read as one shape when the page was photographed. A form library previewed
 * form by form would pass exactly the same way. Eight specimens in one frame is
 * the only arrangement in which "these two are the same shape" is visible, which
 * is the question this file exists to answer.
 *
 * THE SECOND FOUR ARE THE ONES THAT DRAW, and they are the harder half. A form
 * that draws nothing cannot slip back into a horizontal track; a lollipop, a
 * ladder, a threshold and a range each can, and each does it by a different
 * lazy move. They are placed in this grid directly under the four that draw
 * nothing so that the page is read in one scroll rather than two.
 *
 * EVERY NUMBER IN HERE IS INVENTED, and the file says so at the top of itself in
 * the reader's own words. The forms take their figures as props and hold none.
 *
 * WHY A SPIKE AND NOT A ROUTE. Same reason as preview_trade_sections.tsx, which
 * this file copies its CSS-inlining and HTML wrapper from: the harness's surface
 * list is read by other gates, so a workshop added to it makes those gates argue
 * about a page that is not a page. This writes one standalone file to the design
 * folder and touches nothing else.
 *
 * Run: set -a; . ./.env.local; set +a; npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/spikes/preview_form_library.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

import {
  BenchmarkPair,
  StateWord,
  RankedTiles,
  OptionCards,
  LollipopColumn,
  StepLadder,
  ClearanceRing,
  RangeBracket,
} from "../../src/components/spine/forms-v2";
import { Box, usd } from "../../src/components/spine/kit";

/**
 * ONE DECIMAL OF THOUSANDS, for the ranking only. The kit's `usd` rounds to
 * whole thousands above 1000, which is right on a page and wrong in a specimen:
 * three of the seven rents below round to the same "$3K" and a ranking whose
 * labels repeat cannot be judged for whether its stems are readable.
 */
const usdK = (n: number) => "$" + (n / 1000).toFixed(1) + "K";

const CSS_PATH = "scratchpad/pages/site.css";
try {
  execFileSync(process.execPath, [
    "node_modules/tailwindcss/lib/cli.js",
    "-i",
    "src/app/globals.css",
    "-o",
    CSS_PATH,
    "--minify",
  ]);
} catch {
  /* A stale stylesheet still previews; the harness regenerates it constantly. */
}
const css = readFileSync(CSS_PATH, "utf8");

/**
 * THE SPECIMEN FRAME is preview chrome and nothing else: a name, the catalog's
 * own idea and budget for the form, and the one line that says when to reach for
 * it. It is deliberately plain, in the muted grey the other spike uses, so that
 * nothing in the chrome competes with the four shapes being judged.
 */
function Specimen({
  name,
  idea,
  useWhen,
  children,
}: {
  name: string;
  idea: string;
  useWhen: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#1b1b1a" }}>{name}</div>
        {/* NO SMALL-CAPS: it leaves the digits at full size, so "shares a cap of
            3" photographed with a big 3 in the middle of a small line. */}
        <div style={{ fontSize: 12, color: "#8a847e", letterSpacing: "0.04em" }}>{idea}</div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "#6f6f6d", marginBottom: 10, maxWidth: "56ch" }}>
        {useWhen}
      </div>
      <Box>{children}</Box>
    </div>
  );
}

const body = renderToStaticMarkup(
  <div className="spine-scope" style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px 64px" }}>
    <div
      style={{
        border: "1px solid #e3ded9",
        background: "#fff7ed",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 28,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 600, color: "#1b1b1a", marginBottom: 8 }}>
        Every number on this page is made up.
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "#3d3935", maxWidth: "72ch" }}>
        All eight forms the form catalog gained on 2026-09-01, built into the kit where a page can
        import them. Each one replaces a reading that the ten trade sections drew as a horizontal
        line with a dot on it, and none of these may read that way. The first four are on the top
        two rows and two of them draw nothing at all: a number beside its reference, and a word at
        the size of a figure, are complete answers, and adding a meter underneath one so that it
        looks designed is the exact fault being corrected. The last four are on the bottom two rows
        and those are the ones that draw, which is where the old habit pulls hardest. The only
        question this file asks is whether the eight SHAPES are different enough to tell apart at a
        glance.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 30 }}>
      <Specimen
        name="BenchmarkPair"
        idea="I9 figure alone, free"
        useWhen="Use when one number only means something beside another one: a price against the typical price, a rent against the city median."
      >
        {/* THE ACCENT PROP IS ASKED FOR HERE AND NOWHERE ELSE ON THE PAGE. A
            ticket is a price and a price is worth pointing at; of the other
            seven specimens, four carry their accent inside the form and three
            are left in ink so the page can be judged for shape before colour. */}
        <BenchmarkPair
          label="What a table spends"
          value={31}
          reference={24}
          referenceLabel="the typical trade in this city"
          format={usd}
          accent
        />
      </Specimen>

      <Specimen
        name="StateWord"
        idea="I9 figure alone, free"
        useWhen="Use when the answer is a yes, a no, or a not-applicable: whether tipping is expected, whether a licence is required, whether a permit exists at all."
      >
        <StateWord
          label="Pavement licence"
          state="Not required here"
          fact="No council permit covers tables on the pavement in this district, so the four outside seats cost nothing beyond the rent."
        />
      </Specimen>

      <Specimen
        name="RankedTiles"
        idea="I6 tile set, shares a cap of 3"
        useWhen="Use for a short ordered set of named things, up to six, where the ORDER is the reading: roles by difficulty, risks by likelihood."
      >
        <RankedTiles
          ariaLabel="Roles by how long they take to fill, hardest first"
          rows={[
            { name: "Chef", value: "14 wks" },
            { name: "Sous chef", value: "6 wks" },
            { name: "Bartender", value: "4 wks" },
            { name: "Server", value: "2 wks" },
            { name: "Kitchen porter", value: "1 wk" },
          ]}
        />
      </Specimen>

      <Specimen
        name="OptionCards"
        idea="I6 tile set, shares a cap of 3"
        useWhen="Use for a choice among two to four comparable options that are not points on one scale: legal forms, packages, licence tiers."
      >
        <OptionCards
          ariaLabel="How to register the business"
          options={[
            {
              name: "Sole trader",
              figure: "$0",
              unit: "a year to run",
              means: "Nothing to file, and your own money is on the line.",
            },
            {
              name: "Limited company",
              figure: "$310",
              unit: "a year to run",
              means: "Yearly accounts, and the company owes its debts.",
              usual: true,
            },
            {
              name: "Partnership",
              figure: "$140",
              unit: "a year to run",
              means: "One return each, and the liability is shared.",
            },
          ]}
        />
      </Specimen>

      {/* THE FOUR THAT DRAW. Each one is a shape the ten rejected sections
          could have used instead of a track, and each is one lazy decision away
          from being a track again. They sit under the four silent forms so the
          whole vocabulary photographs in a single frame. */}
      <Specimen
        name="LollipopColumn"
        idea="I2 bar set, shares a cap of 3"
        useWhen="Use for a ranking of five or more named things where the DISTANCES matter as well as the order. Vertical, always: laid on its side it is the shape being replaced."
      >
        <LollipopColumn
          ariaLabel="Monthly rent by trade in this district, most expensive first"
          format={usdK}
          rows={[
            { name: "Restaurant", value: 6400 },
            { name: "Cafe", value: 4800 },
            { name: "Bakery", value: 4100 },
            { name: "Barber", value: 2900 },
            { name: "Nail salon", value: 2600 },
            { name: "Dry cleaner", value: 2200 },
            { name: "Locksmith", value: 1400 },
          ]}
        />
      </Specimen>

      <Specimen
        name="StepLadder"
        idea="I6 tile set, shares a cap of 3"
        useWhen="Use for a level on a ladder whose rungs have meanings: how hard a trade is to enter, how far a licence goes. Every rung is drawn, so the reader learns what the others would have meant."
      >
        <StepLadder
          ariaLabel="How much training this trade takes before you can open"
          /* PASSED IN CLIMBING ORDER, LOWEST FIRST, and drawn hardest at the
             top: the component reverses for the drawing so `reached` keeps
             counting the way anyone writing a ladder down would count. */
          steps={[
            { name: "Learn on the job", meaning: "Someone shows you on your first shift." },
            { name: "Train in a week", meaning: "A few days with a supplier or a trade body." },
            { name: "A short course", meaning: "Two or three weekends and a certificate." },
            { name: "Licensed or certified", meaning: "An exam and a licence before you open." },
            { name: "Years of apprenticeship", meaning: "Three or four years under someone else's name." },
          ]}
          reached={4}
        />
      </Specimen>

      <Specimen
        name="ClearanceRing"
        idea="I7 area, cap of 1"
        useWhen="Use for anything that must clear a line: break-even, a minimum wage bill, a licence threshold. The ring closes at the threshold and the surplus takes a second lap outside it, so clearing is seen rather than stated."
      >
        <ClearanceRing
          neededLabel="break-even needs"
          givenLabel="a typical month takes"
          needed={18400}
          given={23100}
          format={usd}
        />
      </Specimen>

      <Specimen
        name="RangeBracket"
        idea="I6 tile set, shares a cap of 3"
        useWhen="Use for an honest range: what it costs to open, what a fit-out runs to. The ends turn inward, the middle stays open, and the typical stands inside it as a numeral."
      >
        <RangeBracket
          lo={42000}
          hi={210000}
          typical={96000}
          format={usd}
          caption="typical fit-out"
          endLabels={["at the cheapest", "at the dearest"]}
        />
      </Specimen>
    </div>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The form library, catalog version 2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}

/* THE SPINE COLOUR TOKENS AND THE FIGURE FACE, copied verbatim from
   src/components/spine/shell.tsx, for the reason preview_trade_sections.tsx
   records: the shell declares them in an inline <style> that a standalone file
   never renders, so without this block --c-ink, --c-border and --terra-text all
   resolve to nothing, every hairline draws in the inherited near-black, and
   nothing carries the accent. A preview that lies about the design is worse
   than no preview. --font-grotesk is appended because next/font supplies it in
   the app and nothing supplies it here, and an UNDEFINED var inside a
   font-family invalidates the whole declaration rather than falling through. */
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}

.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}

/* THE TYPE LADDER IS NOT COPIED HERE, and that is checked rather than assumed.
   The colour tokens above had to be copied because the shell declares them in
   an inline style no standalone file renders. The ladder is different: it is
   declared at :root in src/app/globals.css, which is the stylesheet inlined
   above, so every text-[length:var(--t-focal)] in these four forms resolves
   from the same source the app uses. A third copy of the eight rungs, in a
   spike, is exactly the drift verify_type_ladder exists to stop. If a specimen
   ever photographs with its answer, its labels and its fine print all at one
   size, that resolution is what broke. */
</style>
</head>
<body style="font-family: var(--font-body);">
${body}
</body>
</html>`;

const out = "E:/atlas/design/FORM-LIBRARY.html";
writeFileSync(out, html, "utf8");
console.log(`wrote ${out} (${Math.round(html.length / 1024)}KB)`);
