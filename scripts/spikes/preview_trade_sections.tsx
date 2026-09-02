/**
 * scripts/spikes/preview_trade_sections.tsx
 *
 * ONE FILE THE FOUNDER OPENS, showing the ten specialised trade sections that
 * were designed and built on 2026-08-21 and have reached no reader since.
 *
 * He asked for these sections again on 2026-08-31 without knowing they exist:
 * the typical setup, the three most-sold prices, tipping, what public space
 * costs, whether you can hire, how skilled they must be, who walks in, what
 * goes wrong, the deals and regimes, and the town hall's corruption read. The
 * components are real and finished. The DATA behind them was never gathered,
 * which is the only reason they live on an internal workshop route.
 *
 * WHY A SPIKE AND NOT A SURFACE IN THE HARNESS. The harness's surface list is
 * read by other gates (ship_check counts named dossier pages, the conformance
 * gate maps slugs to constitutions), so adding a workshop to it would make
 * those gates argue about a page that is not a page. This writes one standalone
 * file to the design folder and touches nothing else.
 *
 * EVERY NUMBER IN HERE IS INVENTED, and the file says so at the top of itself
 * in the reader's own words. The fixtures are duplicated from the workshop
 * route deliberately rather than imported: that route keeps them inline
 * precisely so nothing real can import them, and a spike is not a reason to
 * weaken that.
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/spikes/preview_trade_sections.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import {
  TypicalSetup,
  WhatThingsCost,
  Tipping,
  PublicSpaceCost,
  PeopleYouNeed,
  WhoWalksIn,
  WhatGoesWrong,
  DealsAndRegimes,
  TownHall,
} from "../../src/components/kit/trade/TradeSections";
import { Band } from "../../src/components/spine/kit";
import { profileFor, type TradeSectionId } from "../../src/lib/cells/trade_profile";

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
 * THE HOURLY PAY IS A PLACE FIGURE, NOT A TRADE ONE, and it sits on both
 * fixtures only because these two objects stand in for two pages of the SAME
 * city. On a real page it arrives once from the city and every money figure in
 * every section is measured against it. Two different values here would silently
 * say a restaurant and a plumber are in different towns.
 */
const LOCAL_HOURLY_PAY = 19;

const RESTAURANT = {
  localHourlyPay: LOCAL_HOURLY_PAY,
  /* THE ANSWER, its own field. It used to be the first of six equal rows. */
  headcount: { low: 9, high: 12 },
  covers: "48 seats",
  lease: "10 years",
  /* THE EVIDENCE, in the constitution's two named families. Five rows, because
     the sixth became the answer. */
  setupFamilies: [
    {
      name: "The place",
      rows: [
        { label: "Covers", value: "48 seats" },
        { label: "Lease", value: "10 years" },
        { label: "Fit-out", value: "$120,000" },
      ],
    },
    {
      name: "The kit",
      rows: [
        { label: "Kitchen", value: "$34,000" },
        { label: "Power", value: "$740 a month" },
      ],
    },
  ],
  prices: [
    { item: "Main course", price: 22 },
    { item: "Glass of wine", price: 8, note: "175ml" },
    { item: "Dessert", price: 9 },
  ],
  /* Not the sum of the three above: a normal visit is a main and a drink, and
     only some tables take a dessert. Carried as its own field for exactly that
     reason, which is what the constitution allows for. */
  typicalTicket: 31,
  /* THE REFERENCE, B1: what a normal visit costs at the TYPICAL restaurant in
     this city, on the same definition. It is a second measured quantity, never
     derived from the ticket or from the three prices, and the two trades below
     point opposite ways on purpose so this document shows both directions of
     the verdict rather than only the flattering one. */
  cityTypicalTicket: 24,
  tipping: { expectation: 78, share: 12 },
  /* WHAT THE LICENCE BUYS, which the card never held: how many tables one covers
     and how many more people they seat. Without both, the break-even line is
     omitted rather than estimated, which is the constitution's own instruction. */
  publicSpace: { annual: 1240, unit: "table", unitsCovered: 4, seatsPerUnit: 4 },
  hire: [
    ["Chef", 22, "Hard", "months to fill"],
    ["Sous chef", 41, "Slow"],
    ["Server", 74, "Quick"],
    ["Kitchen porter", 88, "Same week"],
  ] as Array<[string, number, string, string?]>,
  skill: 3 as const,
  /* `kind` IS STRUCTURE, NOT COPY. It tells the section which of the three fixed
     spectra a row is, so the component can compose the portrait and the
     consequence in its own English rather than gluing pole labels together. */
  personas: [
    { kind: "money" as const, spectrum: "Money", left: "Careful", right: "Comfortable", value: 64 },
    { kind: "residency" as const, spectrum: "Lives here", left: "Passing through", right: "Local", value: 38 },
    { kind: "age" as const, spectrum: "Age", left: "Younger", right: "Older", value: 45 },
  ],
  risks: [
    { risk: "Break-in", safety: 4, driver: "street frontage, cash on site" },
    { risk: "Being sued", safety: 7, driver: "allergen and slip claims" },
    { risk: "Fines and penalties", safety: 5, driver: "hygiene and licensing checks" },
  ],
  /* WHAT COVER COSTS, so the risk ranking becomes a decision. Where a trade holds
     no such figure the ranking stands alone and the card implies no price. */
  riskCover: 2100,
  /* THE WORTH IS ON THE ROW, THE TERMS ARE BEHIND THE CLICK (K6: no figure ever
     hides). The two bite on different costs on purpose, so the composed
     consequence has to say so rather than reaching for "both". */
  deals: [
    {
      name: "Hospitality rate",
      worth: 2600,
      cuts: "premises" as const,
      detail:
        "Business rates are reduced for premises below a rateable value threshold, applied by the council each April and claimed once rather than annually.",
    },
    {
      name: "Apprentice relief",
      worth: 1700,
      cuts: "staff" as const,
      detail:
        "No employer contributions on staff under twenty-five in their first year, which is claimed through payroll and stops the month the year ends.",
    },
  ],
  townHall: { cleanliness: 71, scale: "A published perception measure" },
};

const PLUMBER = {
  localHourlyPay: LOCAL_HOURLY_PAY,
  headcount: { low: 1, high: 3 },
  vehicles: "2 vans",
  premises: "None",
  /* THE FAMILY NAMES ARE THE TRADE'S OWN. A plumber has no place, so printing
     "THE PLACE: none" would be the restaurant's shape forced onto him. Two
     families is the shape; which two is the trade's business. */
  setupFamilies: [
    {
      name: "The round",
      rows: [
        { label: "Vans", value: "2" },
        { label: "Premises", value: "None" },
        { label: "Insurance", value: "$1,400 a year" },
      ],
    },
    {
      name: "The kit",
      rows: [
        { label: "Tools", value: "$9,500" },
        { label: "Stock held", value: "$3,000" },
      ],
    },
  ],
  prices: [
    { item: "Call-out", price: 85 },
    { item: "Boiler service", price: 110 },
    { item: "Bathroom install", price: 3400 },
  ],
  typicalTicket: 190,
  /* He charges UNDER the local norm, where the restaurant charges over it. */
  cityTypicalTicket: 205,
  /* THE FOURTH SLOT IS A DURATION NOW, not a description. It became the second
     half of the card's answer ("Qualified plumber. Months to fill."), and
     "the binding constraint" there would have read as a sentence explaining
     itself in a circle. */
  hire: [
    ["Qualified plumber", 18, "Hard", "months to fill"],
    ["Apprentice", 62, "Steady"],
    ["Labourer", 84, "Same week"],
  ] as Array<[string, number, string, string?]>,
  skill: 4 as const,
  risks: [
    { risk: "Break-in", safety: 3, driver: "tools in a parked van overnight" },
    { risk: "Being sued", safety: 5, driver: "water damage claims" },
    { risk: "Fines and penalties", safety: 8, driver: "certification checks" },
  ],
  /* The same $1,400 his setup card lists as insurance, on purpose: one trade, one
     figure, and a reader who notices it twice should find it agreeing with
     itself. */
  riskCover: 1400,
};

function Rendered({ id, trade }: { id: TradeSectionId; trade: "restaurant" | "plumber" }) {
  const r = RESTAURANT;
  const p = PLUMBER;
  const isR = trade === "restaurant";
  /* ONE DOCUMENT, TWO TRADES, SO THE ANCHORS ARE PREFIXED. Two cards both
     calling themselves #typical-setup would send every "what it costs" link to
     the restaurant's card, including the plumber's. */
  const a = (s: string) => `${trade}-${s}`;
  switch (id) {
    case "typical-setup":
      /* THE NEXT LINK, on a real trade page, points at the opening-cost section.
         There is no such section in this file, so it points at the one section
         here that answers the same question: what money changes hands. A dead
         href in a preview would show an affordance that does not work, which is
         worse than showing none. */
      return (
        <TypicalSetup
          anchorId={a("typical-setup")}
          headcount={isR ? r.headcount : p.headcount}
          families={isR ? r.setupFamilies : p.setupFamilies}
          covers={isR ? r.covers : null}
          lease={isR ? r.lease : null}
          vehicles={isR ? null : p.vehicles}
          premises={isR ? null : p.premises}
          next={{ label: "What people pay here", href: `#${a("what-things-cost")}` }}
        />
      );
    case "what-things-cost":
      return (
        <WhatThingsCost
          anchorId={a("what-things-cost")}
          rows={isR ? r.prices : p.prices}
          typicalTicket={isR ? r.typicalTicket : p.typicalTicket}
          cityTypicalTicket={isR ? r.cityTypicalTicket : p.cityTypicalTicket}
          localHourlyPay={isR ? r.localHourlyPay : p.localHourlyPay}
        />
      );
    case "tipping":
      return isR ? <Tipping expectation={r.tipping.expectation} typicalShare={r.tipping.share} /> : null;
    case "public-space":
      return isR ? (
        <PublicSpaceCost
          annual={r.publicSpace.annual}
          unit={r.publicSpace.unit}
          unitsCovered={r.publicSpace.unitsCovered}
          seatsPerUnit={r.publicSpace.seatsPerUnit}
          typicalTicket={r.typicalTicket}
          localHourlyPay={r.localHourlyPay}
        />
      ) : null;
    /* B1 AND B2 ARE ONE CARD. The profile still lists both ids, because a
       profile describes what a trade HAS rather than how a page lays it out.
       The merged card renders under the first and the second draws nothing, so
       neither the profile nor the section order had to be rewritten to get the
       merge the constitution asks for. */
    case "can-you-hire":
      return <PeopleYouNeed roles={isR ? r.hire : p.hire} level={isR ? r.skill : p.skill} />;
    case "skill-level":
      return null;
    case "who-walks-in":
      return isR ? <WhoWalksIn rows={r.personas} /> : null;
    case "what-goes-wrong":
      return (
        <WhatGoesWrong
          rows={isR ? r.risks : p.risks}
          insuranceAnnual={isR ? r.riskCover : p.riskCover}
          localHourlyPay={isR ? r.localHourlyPay : p.localHourlyPay}
        />
      );
    case "deals-and-regimes":
      return isR ? <DealsAndRegimes rows={r.deals} localHourlyPay={r.localHourlyPay} /> : null;
    case "town-hall":
      return isR ? <TownHall cleanliness={r.townHall.cleanliness} scale={r.townHall.scale} /> : null;
    default:
      return null;
  }
}

/**
 * THE BANDS, straight off the constitution's own SPACE line for each section.
 * This is the fifth test ("does it earn the room it takes") answered
 * structurally, once, rather than card by card. Measured before any of this
 * existed: every card was 1072px wide at 1280, which is wider than a reader can
 * sweep in one go, and the thin ones spent two thirds of it on nothing.
 *
 * The ratios are the constitution's own two-thirds/one-third pairings:
 *   A1 setup (2) beside A2 prices (1)
 *   B1+B2 the merged people card (1) beside B3 who walks in (2)
 *   C1 tipping and C2 the pavement, two lean cards, equal halves
 *   C3 the schemes (2) beside C4 the town hall (1)
 *   C5 what goes wrong, alone
 *
 * TWO SPLITS THE PHOTOGRAPH CHANGED, on 2026-09-02, and both for one reason: a
 * ranking set as a standing wants a column and not a sweep.
 *
 * THE PEOPLE CARD WENT FROM TWO THIRDS TO EQUAL HALVES, AND THEN TO ONE THIRD.
 * Photographed at 1280 on two thirds, each role's name sat about 500px from its
 * own reading, four rows deep, which is the founder's first named fault class
 * arriving inside a border. Photographed at one third instead, the standing was
 * perfect and the four-step skill band under it collapsed to three-line labels
 * in skinny boxes, so halves was the width at which BOTH readings held: 520px.
 * A3 then replaced that band with the catalogue's VERTICAL StepLadder, which
 * needs no width at all, and 520 immediately showed the stranding again at four
 * rows: "Kitchen porter" sat about 430px from "Same week". The constraint that
 * held the card wide is gone, so the band is 1-2 and the card takes the 347px
 * column its standing wanted from the start. Who-walks-in takes the other two
 * thirds, which its three spectra and their pole labels wanted anyway.
 *
 * C5 DECLARES ITSELF LEAN. Alone in a band it took Band's two thirds and came
 * out 693px wide holding three short rows. `lean` moves that air outside the
 * card's edge, where an uneven band is a composition instead of a hole.
 *
 * C1 AND C2 WENT FROM EQUAL HALVES TO TWO FIFTHS AND THREE, on 2026-09-02, and
 * the photograph decided it. Tipping's Meter had been the one thing spanning its
 * card edge to edge; with the track gone (B2) the card was a figure, a note and a
 * state row in a 520px box, and the block beside the figure came out about 255 by
 * 100 pixels of nothing, which is half the card's width and taller than a line.
 * The pavement card wanted the other way anyway: at 520 its "ALL OF THEM $4,960 a
 * year, a month and a half of local pay" row was already running at its own edge.
 * At 416 and 624 tipping's fact and consequence both wrap and fill, and only its
 * answer block is left-packed, which is the grammar of the rail above it and the
 * reading A5 ratified for exactly this test.
 * NOT 1-2, WHICH IS WHAT THE CONTENT WOULD OTHERWISE HAVE ASKED FOR: the band
 * directly above is already 1-2, and D3 forbids a band repeating the split of the
 * band before it. The effective sequence down the page is now 2-1, 1-2, 2-3, 2-1
 * and a lone lean card, with no two neighbours alike.
 *
 * ONE PLACE WHERE THE KIT ANSWERS AND NOT THE CONSTITUTION. C5 alone is given a
 * band of its own rather than the full width the constitution allows it, because
 * Band's lone-child rule re-templates to two thirds and art direction D1 bans
 * full width for anything carrying a finding.
 *
 * `skill-level` IS ABSENT FROM EVERY BAND. It merged into `can-you-hire`, and it
 * renders nothing on its own, so listing it would leave a hole in a row.
 */
const BANDS: Array<{ ids: TradeSectionId[]; split: "2-1" | "1-1" | "1-2" | "2-3" | "3-2" }> = [
  { ids: ["typical-setup", "what-things-cost"], split: "2-1" },
  { ids: ["can-you-hire", "who-walks-in"], split: "1-2" },
  { ids: ["tipping", "public-space"], split: "2-3" },
  { ids: ["deals-and-regimes", "town-hall"], split: "1-1" },
  { ids: ["what-goes-wrong"], split: "2-1" },
];

function Column({ trade, activityId, name }: { trade: "restaurant" | "plumber"; activityId: string; name: string }) {
  const profile = profileFor(activityId);
  /* town-hall is a PLACE fact, so no trade profile lists it; shown here because
     the point of this file is to see all ten at once. */
  const ids: TradeSectionId[] =
    trade === "restaurant" ? [...profile.sections, "deals-and-regimes", "town-hall"] : profile.sections;
  const held = new Set(ids);
  /* A BAND KEEPS ONLY THE SECTIONS THIS TRADE HAS, and a band left with nothing
     does not draw. That is the whole reason a plumber's chapter C is one card
     and not a row with a gap in it. */
  const bands = BANDS.map((b) => ({ ...b, ids: b.ids.filter((id) => held.has(id)) })).filter((b) => b.ids.length > 0);
  return (
    <div style={{ minWidth: 0, flex: "1 1 380px" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a847e" }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: "#8a847e" }}>
          {ids.length} sections, chosen for this trade and no other
        </div>
      </div>
      {bands.map((b) => (
        <Band key={b.ids.join("-")} split={b.split}>
          {b.ids.map((id) => (
            <Rendered key={id} id={id} trade={trade} />
          ))}
        </Band>
      ))}
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
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "#3d3935", maxWidth: "68ch" }}>
        These are the ten sections you asked for, already built. Nothing here has been researched
        yet, so the figures are invented to a plausible shape, and the only question this file asks
        is whether the SHAPES are right. Two trades are shown, one after the other, on purpose: a
        restaurant gets ten sections and a plumber gets five, because a tipping section on a
        plumber and a pavement-licence section on a mobile trade would both say the site does not
        know what the business is.
      </div>
    </div>
    {/* STACKED, NOT SIDE BY SIDE. The first cut put the two trades in two
        columns, which squeezed each card to about 570px and collided the
        setup card's labels with its values. A preview that misrepresents the
        design is worse than no preview: each trade now renders at the width a
        real page gives it. */}
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <Column trade="restaurant" activityId="restaurants" name="A restaurant" />
      <Column trade="plumber" activityId="plumbers" name="A plumber" />
    </div>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The ten trade sections, as built</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}

/* THE PREVIEW WAS SHOWING THE WRONG PAGE, and only a screenshot found it.
   Measured at 1280 before this block existed: --c-ink, --c-border and
   --terra-text ALL resolved to nothing. Those are declared by SpineShell in an
   inline <style>, which this standalone file never renders, so every card drew
   its hairline in the inherited near-black instead of the warm #e7e2df, and
   nothing carried the accent. The founder judged ten sections in a colour
   scheme the site does not have. Copied verbatim from src/components/spine/
   shell.tsx so the two cannot say different things. --font-grotesk is added on
   the end because next/font supplies it in the app and nothing supplies it
   here: an UNDEFINED var inside a font-family makes the whole declaration
   invalid at computed-value time rather than falling through to the next name
   in the stack, so the fallbacks after it would never have been reached. */
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}

/* SAME FAULT, SECOND HALF. .fig is declared by the shell too, and by
   atlas-spine.css only under .av2, so in this file every figure on the page
   was rendering in the body sans instead of Space Grotesk. The figure face is
   half of what makes a number read as a measurement. */
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}

/* THE CARDS WERE DOUBLE-PADDED AT 40px. The sections carry their own inline
   padding as a defence against the .av2 reset, which zeroes Box's Tailwind p-5.
   This file is not .av2, so nothing zeroed it and the two stacked. Zero the
   outer one here: the section's own inline padding is then the only padding,
   which is exactly what it is under .av2. */
[data-trade-section]{padding:0}
</style>
</head>
<body style="font-family: var(--font-body);">
${body}
</body>
</html>`;

const out = "E:/atlas/design/TRADE-SECTIONS-AS-BUILT.html";
writeFileSync(out, html, "utf8");
console.log(`wrote ${out} (${Math.round(html.length / 1024)}KB)`);
