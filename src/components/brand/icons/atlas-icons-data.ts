/* =============================================================================
 * Margin Atlas - icon family ("Atlas Modern")
 * Clean line glyphs on a 32-unit grid. One confident stroke weight (renderer
 * base 1.9), round terminals, generous negative space, legible at 16px.
 * Exactly ONE terracotta accent per glyph (the brand thread) carried by
 * class="a" (stroke) or class="af" (fill); the accent colour comes from CSS.
 * `body` is INNER markup only on an implied viewBox="0 0 32 32".
 * ===========================================================================*/

export type AtlasIconGroup =
  | "cell-economics"
  | "cost-economics"
  | "labor"
  | "place"
  | "market"
  | "place-scale"
  | "industry"
  | "decision-confidence"
  | "meta";

export type AtlasIconId =
  | "owner-keeps"
  | "revenue"
  | "range"
  | "break-even"
  | "cost-breakdown"
  | "worked-example"
  | "unit-economics"
  | "margin"
  | "daily-takings"
  | "staffing-rota"
  | "supplier"
  | "licence-specific"
  | "startup-cost"
  | "taxes"
  | "register-cost"
  | "red-tape"
  | "commercial-rent"
  | "first-year"
  | "calculator"
  | "hiring"
  | "min-wage"
  | "wages"
  | "free-zone"
  | "airport"
  | "tourist"
  | "best-areas"
  | "neighborhood"
  | "spending-power"
  | "competition"
  | "corruption"
  | "vs-world"
  | "payments"
  | "seasonality"
  | "currency-stability"
  | "ease-of-business"
  | "visa-permit"
  | "safety"
  | "market-size"
  | "skyline"
  | "transit"
  | "footfall"
  | "district-mix"
  | "high-street"
  | "anchor"
  | "catchment"
  | "vacancy"
  | "global-spread"
  | "ranking"
  | "benchmark"
  | "where-it-pays"
  | "trend"
  | "who-for"
  | "gut-check"
  | "honest-take"
  | "myth-reality"
  | "contrarian"
  | "verdict"
  | "scorecard"
  | "confidence"
  | "spread"
  | "subtype"
  | "methodology"
  | "freshness"
  | "bookmark"
  | "watch"
  | "flag"
  | "search"
  | "compare"
  | "operator-voices"
  | "locals-know";

export interface AtlasIconDef {
  id: AtlasIconId;
  group: AtlasIconGroup;
  /** 1-3 words */
  label: string;
  /** one plain sentence */
  blurb: string;
  /** inner SVG markup, implied viewBox="0 0 32 32" */
  body: string;
  /** optional simplified variant for size <= 16 (unused in the current set) */
  body16?: string;
}

export const ATLAS_ICON_GROUPS: ReadonlyArray<{ key: AtlasIconGroup; label: string }> = [
  { key: "cell-economics", label: "Cell economics" },
  { key: "cost-economics", label: "Cost & money in" },
  { key: "labor", label: "Labour" },
  { key: "place", label: "Place" },
  { key: "market", label: "Market" },
  { key: "place-scale", label: "Place & scale" },
  { key: "industry", label: "Industry" },
  { key: "decision-confidence", label: "Decision & confidence" },
  { key: "meta", label: "Meta & trust" },
];

export const atlasIcons: AtlasIconDef[] = [
  /* Cell economics */
  {
    id: "owner-keeps",
    group: "cell-economics",
    label: "Owner keeps",
    blurb: "What the owner actually takes home after costs.",
    body: `<path d="M6 9h15a2 2 0 0 1 2 2v3.5h-4.5a2.5 2.5 0 0 0 0 5H23V23a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z"/><circle class="af" cx="18.5" cy="17" r="1.9"/>`,
  },
  {
    id: "revenue",
    group: "cell-economics",
    label: "Revenue",
    blurb: "The top line a business turns over before costs.",
    body: `<circle cx="16" cy="16" r="9"/><path class="a" d="M16 21v-9M12.5 15l3.5-3.5L19.5 15"/>`,
  },
  {
    id: "range",
    group: "cell-economics",
    label: "Range",
    blurb: "The low to high spread with the typical point marked.",
    body: `<path d="M7 16h18"/><path d="M7 12.5v7M25 12.5v7"/><circle class="af" cx="16" cy="16" r="2"/>`,
  },
  {
    id: "break-even",
    group: "cell-economics",
    label: "Break even",
    blurb: "Where rising revenue meets falling cost.",
    body: `<path d="M7 11l18 10"/><path d="M7 21L25 11"/><circle class="af" cx="16" cy="16" r="2.1"/>`,
  },
  {
    id: "cost-breakdown",
    group: "cell-economics",
    label: "Cost breakdown",
    blurb: "How the total cost splits across its parts.",
    body: `<circle cx="16" cy="16" r="9"/><path d="M16 16V7M16 16l7.8 4.5"/><path class="af" d="M16 16V7a9 9 0 0 1 7.8 4.5z"/>`,
  },
  {
    id: "worked-example",
    group: "cell-economics",
    label: "Worked example",
    blurb: "A real calculation carried all the way to a number.",
    body: `<path d="M9 6h9l5 5v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M18 6v5h5"/><path class="a" d="M11 20h8"/>`,
  },
  {
    id: "unit-economics",
    group: "cell-economics",
    label: "Unit economics",
    blurb: "What a single sale earns once its costs are met.",
    body: `<path d="M16 7l8 4.5v9L16 25l-8-4.5v-9z"/><path d="M8 11.5l8 4.5 8-4.5M16 16v9"/><circle class="af" cx="16" cy="13.4" r="1.9"/>`,
  },
  {
    id: "margin",
    group: "cell-economics",
    label: "Margin",
    blurb: "The share of revenue a business actually keeps.",
    body: `<rect x="11" y="8" width="10" height="18" rx="2"/><path d="M11 17h10"/><path class="af" d="M12.5 9.5h7v6h-7z"/>`,
  },
  {
    id: "daily-takings",
    group: "cell-economics",
    label: "Daily takings",
    blurb: "How money comes in across a trading day.",
    body: `<path d="M6 22l5-4 4 3 5-8 4 5"/><circle class="af" cx="20" cy="13" r="2"/>`,
  },
  {
    id: "staffing-rota",
    group: "cell-economics",
    label: "Staffing rota",
    blurb: "Who works which shifts and what it costs.",
    body: `<rect x="7" y="9" width="18" height="16" rx="2.5"/><path d="M7 14h18M13 14v11M19 14v11"/><path class="af" d="M13 14h6v5.5h-6z"/>`,
  },
  {
    id: "supplier",
    group: "cell-economics",
    label: "Supplier",
    blurb: "The cost of goods coming through the door.",
    body: `<rect x="4" y="11" width="13" height="9" rx="1.5"/><path d="M17 14h4l3 3v3h-7z"/><circle cx="9" cy="22" r="2.1"/><circle cx="21" cy="22" r="2.1"/><circle class="af" cx="10.5" cy="15.5" r="1.8"/>`,
  },
  {
    id: "licence-specific",
    group: "cell-economics",
    label: "Trade licence",
    blurb: "The permit a specific trade has to hold.",
    body: `<circle cx="16" cy="13" r="7"/><path d="M11.5 18.5L10 26l6-3 6 3-1.5-7.5"/><circle class="af" cx="16" cy="13" r="2"/>`,
  },
  /* Cost & money in */
  {
    id: "startup-cost",
    group: "cost-economics",
    label: "Startup cost",
    blurb: "The money needed up front to open the doors.",
    body: `<ellipse cx="16" cy="11" rx="8" ry="3"/><path d="M8 11v9a8 3 0 0 0 16 0v-9"/><circle class="af" cx="16" cy="16" r="2"/>`,
  },
  {
    id: "taxes",
    group: "cost-economics",
    label: "Taxes",
    blurb: "The slice of earnings the state takes.",
    body: `<circle cx="16" cy="16" r="9"/><path class="a" d="M12 20l8-8"/><circle cx="13" cy="13" r="1.4"/><circle cx="19" cy="19" r="1.4"/>`,
  },
  {
    id: "register-cost",
    group: "cost-economics",
    label: "Register cost",
    blurb: "The cost and paperwork of registering a business.",
    body: `<path d="M10 6h8l5 5v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M18 6v5h5"/><circle class="af" cx="15" cy="18.5" r="2.2"/>`,
  },
  {
    id: "red-tape",
    group: "cost-economics",
    label: "Red tape",
    blurb: "The checklist of approvals before you can trade.",
    body: `<rect x="8" y="8" width="16" height="18" rx="2.5"/><path d="M12 8V6.5h8V8"/><path class="a" d="M12 17l3 3 6-7"/>`,
  },
  {
    id: "commercial-rent",
    group: "cost-economics",
    label: "Commercial rent",
    blurb: "What a unit costs to lease in a place.",
    body: `<rect x="8" y="13" width="16" height="13" rx="1.5"/><path d="M8 13l2-5h12l2 5"/><circle class="af" cx="16" cy="19.5" r="2"/>`,
  },
  {
    id: "first-year",
    group: "cost-economics",
    label: "First year",
    blurb: "How the opening twelve months tend to go.",
    body: `<rect x="7" y="9" width="18" height="17" rx="2.5"/><path d="M7 14.5h18"/><path d="M12 7v4M20 7v4"/><circle class="af" cx="16" cy="20" r="2"/>`,
  },
  {
    id: "calculator",
    group: "cost-economics",
    label: "Calculator",
    blurb: "Run the numbers for your own situation.",
    body: `<rect x="9" y="6" width="14" height="20" rx="2.5"/><path d="M12 11h8"/><circle cx="13" cy="16" r="1.2"/><circle cx="19" cy="16" r="1.2"/><circle cx="13" cy="20.5" r="1.2"/><circle class="af" cx="19" cy="20.5" r="2"/>`,
  },
  /* Labour */
  {
    id: "hiring",
    group: "labor",
    label: "Hiring",
    blurb: "Adding a person to the payroll.",
    body: `<circle cx="13" cy="12" r="4"/><path d="M6 25c0-4.4 3.1-7 7-7 1.4 0 2.7.3 3.8.9"/><path class="a" d="M21 19h6M24 16v6"/>`,
  },
  {
    id: "min-wage",
    group: "labor",
    label: "Minimum wage",
    blurb: "The legal pay floor beneath what is actually paid.",
    body: `<circle cx="16" cy="13" r="6.5"/><path d="M16 9.5v7M13.8 11.4h3a1.6 1.6 0 0 1 0 3.2h-2.6"/><path class="a" d="M8 24h16"/>`,
  },
  {
    id: "wages",
    group: "labor",
    label: "Wages",
    blurb: "What staff are paid across roles.",
    body: `<rect x="7" y="18" width="4" height="8" rx="1.5"/><rect x="14" y="14" width="4" height="12" rx="1.5"/><rect class="af" x="21" y="9" width="4" height="17" rx="1.5"/>`,
  },
  /* Place */
  {
    id: "free-zone",
    group: "place",
    label: "Free zone",
    blurb: "A marked area with lighter tax and trade rules.",
    body: `<path d="M6 15.5l9-9a2 2 0 0 1 1.4-.6H23a2 2 0 0 1 2 2v6.6a2 2 0 0 1-.6 1.4l-9 9a2 2 0 0 1-2.8 0l-6.6-6.6a2 2 0 0 1 0-2.8z"/><circle class="af" cx="19.5" cy="12.5" r="2"/>`,
  },
  {
    id: "airport",
    group: "place",
    label: "Airport",
    blurb: "Air links that bring trade and visitors.",
    body: `<path d="M16 5.5c1.4 0 2.3 1.4 2.3 3.3v3.9l7.7 4.6v2.4l-7.7-2.3v4.3l2.4 1.8v1.9L16 27l-4.7-1.6v-1.9l2.4-1.8v-4.3L6 23.7v-2.4l7.7-4.6V8.8c0-1.9.9-3.3 2.3-3.3z"/><circle class="af" cx="16" cy="7.2" r="1.7"/>`,
  },
  {
    id: "tourist",
    group: "place",
    label: "Tourist",
    blurb: "Visitors who lift demand for some trades.",
    body: `<rect x="6" y="11" width="20" height="14" rx="2.5"/><path d="M11 11l1.6-3h6.8l1.6 3"/><circle cx="16" cy="18" r="4"/><circle class="af" cx="16" cy="18" r="1.8"/>`,
  },
  {
    id: "best-areas",
    group: "place",
    label: "Best areas",
    blurb: "Where a trade tends to do best in a place.",
    body: `<path d="M16 26c5.5-6.5 8-10 8-13.5a8 8 0 0 0-16 0c0 3.5 2.5 7 8 13.5z"/><circle class="af" cx="16" cy="12.5" r="2.4"/>`,
  },
  {
    id: "neighborhood",
    group: "place",
    label: "Neighborhood",
    blurb: "The block-level character around a site.",
    body: `<path d="M4 17l6-5 6 5v9H4z"/><path d="M15 19l5-4 5 4v7h-10z"/><circle class="af" cx="20" cy="21.5" r="1.8"/>`,
  },
  /* Market */
  {
    id: "spending-power",
    group: "market",
    label: "Spending power",
    blurb: "How much locals can actually spend.",
    body: `<path d="M9 11h14l-1.4 13a2 2 0 0 1-2 1.8H12.4a2 2 0 0 1-2-1.8z"/><path d="M12.5 13v-2a3.5 3.5 0 0 1 7 0v2"/><circle class="af" cx="16" cy="18.5" r="2"/>`,
  },
  {
    id: "competition",
    group: "market",
    label: "Competition",
    blurb: "How crowded the field already is.",
    body: `<path d="M9 26V9"/><path d="M9 9.5l7 1.8-7 1.8"/><path d="M23 26V9"/><path class="af" d="M23 9.5l-7 1.8 7 1.8z"/>`,
  },
  {
    id: "corruption",
    group: "market",
    label: "Corruption",
    blurb: "How often a hand needs greasing to operate.",
    body: `<rect x="6" y="11" width="20" height="14" rx="2.5"/><path d="M6.5 13l9.5 7 9.5-7"/><circle class="af" cx="16" cy="8.5" r="2"/>`,
  },
  {
    id: "vs-world",
    group: "market",
    label: "Vs the world",
    blurb: "This place set against the global picture.",
    body: `<circle cx="16" cy="16" r="9"/><path d="M7 16h18"/><path d="M16 7c3 3.2 3 14.8 0 18M16 7c-3 3.2-3 14.8 0 18"/><circle class="af" cx="21.5" cy="11" r="2"/>`,
  },
  {
    id: "payments",
    group: "market",
    label: "Payments",
    blurb: "How customers tend to pay.",
    body: `<rect x="5" y="9" width="22" height="15" rx="3"/><path d="M5 14h22"/><rect class="af" x="9" y="17.5" width="5" height="3.5" rx="1"/>`,
  },
  {
    id: "seasonality",
    group: "market",
    label: "Seasonality",
    blurb: "How trade rises and falls across the year.",
    body: `<path d="M6 18c2.5-9 6.5-9 10 0s7.5 9 10 0"/><circle class="af" cx="11" cy="12.3" r="2"/>`,
  },
  /* Place & scale */
  {
    id: "currency-stability",
    group: "place-scale",
    label: "Currency stability",
    blurb: "How steady the local money holds its value.",
    body: `<circle cx="16" cy="16" r="8.5"/><path class="a" d="M16 10.5v11M13.2 13h4.4a2.1 2.1 0 0 1 0 4.2h-3.9"/>`,
  },
  {
    id: "ease-of-business",
    group: "place-scale",
    label: "Ease of business",
    blurb: "How simple it is to open and operate here.",
    body: `<path d="M9 25V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M9 25h13"/><circle class="af" cx="18" cy="16" r="1.9"/>`,
  },
  {
    id: "visa-permit",
    group: "place-scale",
    label: "Visa permit",
    blurb: "What it takes for a foreigner to set up here.",
    body: `<rect x="8" y="6" width="16" height="20" rx="2.5"/><circle cx="16" cy="13" r="3.4"/><path d="M12.5 20.5h7"/><circle class="af" cx="16" cy="13" r="1.6"/>`,
  },
  {
    id: "safety",
    group: "place-scale",
    label: "Safety",
    blurb: "How safe a place is to live and trade in.",
    body: `<path d="M16 6l9 3.2v6.3c0 5.8-3.9 9.4-9 11-5.1-1.6-9-5.2-9-11V9.2z"/><path class="a" d="M12 16l3 3 5-6"/>`,
  },
  {
    id: "market-size",
    group: "place-scale",
    label: "Market size",
    blurb: "The reach of customers a place can offer.",
    body: `<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="5"/><circle class="af" cx="16" cy="16" r="2.2"/>`,
  },
  {
    id: "skyline",
    group: "place-scale",
    label: "Skyline",
    blurb: "The density and scale of a city's core.",
    body: `<rect x="6" y="15" width="5" height="11" rx="1"/><rect x="13" y="9" width="6" height="17" rx="1"/><rect x="21" y="18" width="5" height="8" rx="1"/><circle class="af" cx="16" cy="13" r="1.7"/>`,
  },
  {
    id: "transit",
    group: "place-scale",
    label: "Transit",
    blurb: "How people move through a city.",
    body: `<circle cx="9" cy="22" r="2.6"/><circle cx="23" cy="10" r="2.6"/><path d="M11 20l10-8"/><circle class="af" cx="16" cy="16" r="2"/>`,
  },
  {
    id: "footfall",
    group: "place-scale",
    label: "Footfall",
    blurb: "How many people pass a spot on foot.",
    body: `<path d="M22 25V9a1.5 1.5 0 0 0-1.5-1.5H18"/><circle cx="7" cy="20" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><circle class="af" cx="22" cy="20" r="2"/>`,
  },
  {
    id: "district-mix",
    group: "place-scale",
    label: "District mix",
    blurb: "The blend of uses that fills a district.",
    body: `<rect x="8" y="8" width="16" height="16" rx="2.5"/><path d="M16 8v16M8 16h16"/><path class="af" d="M16 16h6.2a1.8 1.8 0 0 1 1.8 1.8V24H16z"/>`,
  },
  {
    id: "high-street",
    group: "place-scale",
    label: "High street",
    blurb: "A run of shopfronts along one street.",
    body: `<path d="M5 14l3-6h16l3 6"/><path d="M6 14v12h20V14"/><rect class="af" x="11" y="18" width="6" height="8" rx="0.5"/>`,
  },
  {
    id: "anchor",
    group: "place-scale",
    label: "Anchor",
    blurb: "A landmark store that pulls in nearby trade.",
    body: `<rect x="10" y="10" width="12" height="16" rx="1.5"/><path d="M10 15h12"/><rect x="5" y="20" width="3.5" height="6" rx="1"/><rect x="23.5" y="20" width="3.5" height="6" rx="1"/><circle class="af" cx="16" cy="20" r="2"/>`,
  },
  {
    id: "catchment",
    group: "place-scale",
    label: "Catchment",
    blurb: "The area a site draws its customers from.",
    body: `<ellipse cx="16" cy="23" rx="9.5" ry="3.2"/><path d="M16 21c4-5 6-7.5 6-10.6a6 6 0 0 0-12 0c0 3.1 2 5.6 6 10.6z"/><circle class="af" cx="16" cy="10.4" r="1.9"/>`,
  },
  {
    id: "vacancy",
    group: "place-scale",
    label: "Vacancy",
    blurb: "An empty unit waiting to be let.",
    body: `<rect x="8" y="7" width="16" height="11" rx="2"/><path d="M16 18v8"/><circle class="af" cx="16" cy="12.5" r="2"/>`,
  },
  /* Industry */
  {
    id: "global-spread",
    group: "industry",
    label: "Global spread",
    blurb: "Where a trade is biggest around the world.",
    body: `<circle cx="16" cy="16" r="9"/><path d="M7 16h18M16 7v18"/><circle cx="11" cy="11" r="1.3"/><circle cx="20.5" cy="20.5" r="1.3"/><circle class="af" cx="20.5" cy="11" r="2"/>`,
  },
  {
    id: "ranking",
    group: "industry",
    label: "Ranking",
    blurb: "Where a place sits on the leaderboard.",
    body: `<rect x="6" y="17" width="6.5" height="9" rx="1"/><path class="af" d="M14 12h4.5a1 1 0 0 1 1 1v13h-6.5V13a1 1 0 0 1 1-1z"/><rect x="20" y="20" width="6.5" height="6" rx="1"/>`,
  },
  {
    id: "benchmark",
    group: "industry",
    label: "Benchmark",
    blurb: "How a figure reads against the norm.",
    body: `<path d="M7 22a9 9 0 0 1 18 0"/><path d="M16 22l5-5"/><circle cx="16" cy="22" r="1.6"/><circle class="af" cx="21" cy="17" r="2"/>`,
  },
  {
    id: "where-it-pays",
    group: "industry",
    label: "Where it pays",
    blurb: "The places a trade earns the most.",
    body: `<path d="M6 9l7-2 6 2 7-2v16l-7 2-6-2-7 2z"/><path d="M13 7v16"/><circle class="af" cx="17" cy="14" r="2.2"/>`,
  },
  {
    id: "trend",
    group: "industry",
    label: "Trend",
    blurb: "How a figure has moved over the years.",
    body: `<path d="M6 21l6-5 4 3 7-9"/><path class="a" d="M21.5 7h4.5v4.5"/>`,
  },
  /* Decision & confidence */
  {
    id: "who-for",
    group: "decision-confidence",
    label: "Who it's for",
    blurb: "Whether this kind of operator is a fit for you.",
    body: `<circle cx="15" cy="13" r="4.2"/><path d="M7 25c0-4.5 3.6-7.5 8-7.5 1.4 0 2.7.3 3.9.8"/><path class="a" d="M19 23l2.3 2.3 4.2-4.7"/>`,
  },
  {
    id: "gut-check",
    group: "decision-confidence",
    label: "Gut check",
    blurb: "A quick read on whether the numbers feel right.",
    body: `<path d="M16 25C8.5 19.5 6 14.5 6 11.2A4.8 4.8 0 0 1 16 9a4.8 4.8 0 0 1 10 2.2c0 3.3-2.5 8.3-10 13.8z"/><circle class="af" cx="16" cy="13.5" r="2.2"/>`,
  },
  {
    id: "honest-take",
    group: "decision-confidence",
    label: "Honest take",
    blurb: "The plain verdict once the numbers are in.",
    body: `<path d="M7 8h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H14l-5 4v-4H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><circle class="af" cx="16" cy="14" r="2.2"/>`,
  },
  {
    id: "myth-reality",
    group: "decision-confidence",
    label: "Myth vs reality",
    blurb: "Sorting a common belief from what the data shows.",
    body: `<path d="M8 11l5.5 5.5M13.5 11L8 16.5"/><path class="a" d="M18 16l2.6 2.6 5.4-6.2"/>`,
  },
  {
    id: "contrarian",
    group: "decision-confidence",
    label: "Contrarian",
    blurb: "The case that runs against the crowd.",
    body: `<path d="M10 23V11M6.5 14.5L10 11l3.5 3.5"/><path class="a" d="M21 10v12M17.5 18.5L21 22l3.5-3.5"/>`,
  },
  {
    id: "verdict",
    group: "decision-confidence",
    label: "Verdict",
    blurb: "The decision mark once everything is weighed.",
    body: `<circle cx="16" cy="16" r="9.5"/><path class="a" d="M11 16l3.6 3.6 6.4-7"/>`,
  },
  {
    id: "scorecard",
    group: "decision-confidence",
    label: "Scorecard",
    blurb: "Stacked ratings with the best one on top.",
    body: `<path class="a" d="M8 10h15"/><path d="M8 16h11"/><path d="M8 22h7"/>`,
  },
  {
    id: "confidence",
    group: "decision-confidence",
    label: "Confidence",
    blurb: "How firm the underlying data is.",
    body: `<rect x="5" y="12" width="19" height="8" rx="4"/><path d="M26 15v2"/><rect class="af" x="7.5" y="14" width="6.5" height="4" rx="2"/>`,
  },
  {
    id: "spread",
    group: "decision-confidence",
    label: "Spread",
    blurb: "The low to high band with the typical point marked.",
    body: `<path d="M16 7v18"/><path d="M12 7h8M12 25h8"/><circle class="af" cx="16" cy="16" r="2"/>`,
  },
  {
    id: "subtype",
    group: "decision-confidence",
    label: "Subtype",
    blurb: "Narrowing to a sub-industry and size band.",
    body: `<circle cx="10" cy="10" r="3.2"/><path d="M10 13.2v5.8a3 3 0 0 0 3 3h3"/><circle class="af" cx="20" cy="22" r="2.4"/>`,
  },
  /* Meta & trust */
  {
    id: "methodology",
    group: "meta",
    label: "Methodology",
    blurb: "How the numbers on a page are worked out.",
    body: `<path d="M13 6v7l-5.5 9.5A2 2 0 0 0 9.2 25.5h13.6a2 2 0 0 0 1.7-3L19 13V6"/><path d="M11.5 6h9"/><circle class="af" cx="16" cy="20" r="2"/>`,
  },
  {
    id: "freshness",
    group: "meta",
    label: "Freshness",
    blurb: "How recently the data was refreshed.",
    body: `<circle cx="16" cy="16" r="9"/><path d="M16 11v5"/><path class="a" d="M16 16l4.2 2.6"/>`,
  },
  {
    id: "bookmark",
    group: "meta",
    label: "Bookmark",
    blurb: "Save a page to return to it later.",
    body: `<path d="M9 6.5h14V26l-7-5-7 5z"/><circle class="af" cx="16" cy="13.5" r="2"/>`,
  },
  {
    id: "watch",
    group: "meta",
    label: "Watch",
    blurb: "Keep an eye on a place or trade.",
    body: `<path d="M4 16s5-8.5 12-8.5S28 16 28 16s-5 8.5-12 8.5S4 16 4 16z"/><circle cx="16" cy="16" r="3.6"/><circle class="af" cx="16" cy="16" r="1.7"/>`,
  },
  {
    id: "flag",
    group: "meta",
    label: "Flag",
    blurb: "Report a figure that looks wrong.",
    body: `<path d="M9 26V7"/><path class="af" d="M9 8h13l-3 4 3 4H9z"/>`,
  },
  {
    id: "search",
    group: "meta",
    label: "Search",
    blurb: "Find a place, trade or page.",
    body: `<circle cx="14" cy="14" r="8"/><path class="a" d="M19.8 19.8L26 26"/>`,
  },
  {
    id: "compare",
    group: "meta",
    label: "Compare",
    blurb: "Weigh two places or trades side by side.",
    body: `<path d="M16 7v17"/><path d="M7 12h18"/><path d="M7 12l-3 6h6zM25 12l-3 6h6z"/><circle class="af" cx="16" cy="8" r="2"/>`,
  },
  {
    id: "operator-voices",
    group: "meta",
    label: "Operator voices",
    blurb: "What real operators say about a trade.",
    body: `<path d="M5 8h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9l-5 4v-4H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"/><circle cx="10" cy="13.5" r="1.3"/><circle cx="14.5" cy="13.5" r="1.3"/><circle class="af" cx="19" cy="13.5" r="1.6"/>`,
  },
  {
    id: "locals-know",
    group: "decision-confidence",
    label: "What locals know",
    blurb: "The insider read you can't Google.",
    body: `<circle class="a" cx="10" cy="10" r="4.5"/><path d="M13.2 13.2 25 25"/><path d="M21 21l2.5-2.5M24 24l2.5-2.5"/>`,
  },
];

export const ATLAS_ICONS_BY_ID: Readonly<Record<AtlasIconId, AtlasIconDef>> =
  Object.fromEntries(atlasIcons.map((d) => [d.id, d])) as Record<AtlasIconId, AtlasIconDef>;

/** Back-compat alias: existing consumers (index.ts, _design, brand-glyphs) import ATLAS_ICONS. */
export const ATLAS_ICONS = atlasIcons;
