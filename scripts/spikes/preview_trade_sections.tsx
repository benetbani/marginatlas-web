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
  CanYouHire,
  SkillLevel,
  WhoWalksIn,
  WhatGoesWrong,
  DealsAndRegimes,
  TownHall,
} from "../../src/components/kit/trade/TradeSections";
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

const RESTAURANT = {
  setup: [
    { label: "People", value: "9 to 12" },
    { label: "Covers", value: "48 seats" },
    { label: "Kitchen kit", value: "$34,000" },
    { label: "Fit-out", value: "$120,000" },
    { label: "Power", value: "$740 a month" },
    { label: "Lease", value: "10 years" },
  ],
  prices: [
    { item: "Main course", price: 22 },
    { item: "Glass of wine", price: 8, note: "175ml" },
    { item: "Dessert", price: 9 },
  ],
  tipping: { expectation: 78, share: 12 },
  publicSpace: { annual: 1240, unit: "table" },
  hire: [
    ["Chef", 22, "Hard", "months to fill"],
    ["Sous chef", 41, "Slow"],
    ["Server", 74, "Quick"],
    ["Kitchen porter", 88, "Same week"],
  ] as Array<[string, number, string, string?]>,
  skill: 3 as const,
  personas: [
    { spectrum: "Money", left: "Careful", right: "Comfortable", value: 64 },
    { spectrum: "Lives here", left: "Passing through", right: "Local", value: 38 },
    { spectrum: "Age", left: "Younger", right: "Older", value: 45 },
  ],
  risks: [
    { risk: "Break-in", safety: 4, driver: "street frontage, cash on site" },
    { risk: "Being sued", safety: 7, driver: "allergen and slip claims" },
    { risk: "Fines and penalties", safety: 5, driver: "hygiene and licensing checks" },
  ],
  deals: [
    ["Hospitality rate", "Reduced business rates below a rateable value threshold"],
    ["Apprentice relief", "No employer contributions on staff under 25 in year one"],
  ] as Array<[string, React.ReactNode]>,
  townHall: { cleanliness: 71, scale: "Published perception measure, national" },
};

const PLUMBER = {
  setup: [
    { label: "People", value: "1 to 3" },
    { label: "Vans", value: "2" },
    { label: "Tools", value: "$9,500" },
    { label: "Stock held", value: "$3,000" },
    { label: "Insurance", value: "$1,400 a year" },
    { label: "Premises", value: "None" },
  ],
  prices: [
    { item: "Call-out", price: 85 },
    { item: "Boiler service", price: 110 },
    { item: "Bathroom install", price: 3400 },
  ],
  hire: [
    ["Qualified plumber", 18, "Hard", "the binding constraint"],
    ["Apprentice", 62, "Steady"],
    ["Labourer", 84, "Same week"],
  ] as Array<[string, number, string, string?]>,
  skill: 4 as const,
  risks: [
    { risk: "Break-in", safety: 3, driver: "tools in a parked van overnight" },
    { risk: "Being sued", safety: 5, driver: "water damage claims" },
    { risk: "Fines and penalties", safety: 8, driver: "certification checks" },
  ],
};

function Rendered({ id, trade }: { id: TradeSectionId; trade: "restaurant" | "plumber" }) {
  const r = RESTAURANT;
  const p = PLUMBER;
  const isR = trade === "restaurant";
  switch (id) {
    case "typical-setup":
      return <TypicalSetup rows={isR ? r.setup : p.setup} />;
    case "what-things-cost":
      return <WhatThingsCost rows={isR ? r.prices : p.prices} />;
    case "tipping":
      return isR ? <Tipping expectation={r.tipping.expectation} typicalShare={r.tipping.share} /> : null;
    case "public-space":
      return isR ? <PublicSpaceCost annual={r.publicSpace.annual} unit={r.publicSpace.unit} /> : null;
    case "can-you-hire":
      return <CanYouHire roles={isR ? r.hire : p.hire} />;
    case "skill-level":
      return <SkillLevel level={isR ? r.skill : p.skill} />;
    case "who-walks-in":
      return isR ? <WhoWalksIn rows={r.personas} /> : null;
    case "what-goes-wrong":
      return <WhatGoesWrong rows={isR ? r.risks : p.risks} />;
    case "deals-and-regimes":
      return isR ? <DealsAndRegimes rows={r.deals} /> : null;
    case "town-hall":
      return isR ? <TownHall cleanliness={r.townHall.cleanliness} scale={r.townHall.scale} /> : null;
    default:
      return null;
  }
}

function Column({ trade, activityId, name }: { trade: "restaurant" | "plumber"; activityId: string; name: string }) {
  const profile = profileFor(activityId);
  /* town-hall is a PLACE fact, so no trade profile lists it; shown here because
     the point of this file is to see all ten at once. */
  const ids: TradeSectionId[] =
    trade === "restaurant" ? [...profile.sections, "deals-and-regimes", "town-hall"] : profile.sections;
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {ids.map((id) => (
          <Rendered key={id} id={id} trade={trade} />
        ))}
      </div>
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
<style>body{background:#faf8f6;margin:0}</style>
</head>
<body style="font-family: var(--font-body);">
${body}
</body>
</html>`;

const out = "E:/atlas/design/TRADE-SECTIONS-AS-BUILT.html";
writeFileSync(out, html, "utf8");
console.log(`wrote ${out} (${Math.round(html.length / 1024)}KB)`);
