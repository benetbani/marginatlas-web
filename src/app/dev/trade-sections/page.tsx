/**
 * /dev/trade-sections , the ten specialised sections, in the workshop.
 *
 * WHY THIS ROUTE EXISTS AND WHY IT IS UNDER /dev. The founder asked for these
 * sections and said "you don't even need to bother with real data, it is all
 * about design, functionality, surface, ease of use." The standing rule is that
 * a figure is never fabricated. Both are satisfied exactly one way: build the
 * surface where he can judge it, with content that is openly illustrative, and
 * let a real source arrive before any of it reaches a reader.
 *
 * /dev is robots-disallowed and linked from nowhere public. It is the workshop,
 * not the shop.
 *
 * EVERY NUMBER ON THIS PAGE IS MADE UP AND THE PAGE SAYS SO AT THE TOP. That
 * banner is not decoration: a screenshot of this page will outlive the session
 * that made it, and the next person to find it must not be able to mistake it
 * for a rendering of real data.
 *
 * IT SHOWS TWO TRADES SIDE BY SIDE ON PURPOSE. A restaurant gets tipping and a
 * pavement licence; a plumber gets neither, because a plumber has no frontage
 * and nobody tips one. That difference IS the feature, and a single-trade
 * preview would hide it entirely.
 */
import type { Metadata } from "next";
import { profileFor, type TradeSectionId } from "@/lib/cells/trade_profile";
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
} from "@/components/kit/trade/TradeSections";
import { AtlasBarChart } from "@/components/kit/charts/AtlasBarChart";

export const metadata: Metadata = {
  title: "Trade sections , workshop",
  robots: { index: false, follow: false },
};

/* ILLUSTRATIVE ONLY. Shaped to look plausible so the DESIGN can be judged;
   none of it is measured and none of it may be copied to a reader-facing
   route. Kept in this file rather than a fixture so it cannot be imported by
   anything real: verify_no_fixture_in_routes exists because placeholder data
   with the right shape is indistinguishable from a page citing its own
   provenance while every number in it was invented. */
/* A PLACE FIGURE, NOT A TRADE ONE. Both trades below stand for two pages of the
   same city, so they measure their prices against the same hour of pay. */
const LOCAL_HOURLY_PAY = 19;

const RESTAURANT = {
  localHourlyPay: LOCAL_HOURLY_PAY,
  headcount: { low: 9, high: 12 },
  covers: "48 seats",
  lease: "10 years",
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
  typicalTicket: 31,
  tipping: { expectation: 78, share: 12 },
  /* What the licence buys: how many tables it covers and how many more people
     they seat. Without both, the break-even line is omitted, never estimated. */
  publicSpace: { annual: 1240, unit: "table", unitsCovered: 4, seatsPerUnit: 4 },
  hire: [
    ["Chef", 22, "Hard", "months to fill"],
    ["Sous chef", 41, "Slow"],
    ["Server", 74, "Quick"],
    ["Kitchen porter", 88, "Same week"],
  ] as Array<[string, number, string, string?]>,
  skill: 3 as const,
  /* `kind` is structure, not copy: it says which of the three fixed spectra a row
     is, so the section composes its own English instead of gluing pole labels. */
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
  /* What cover costs, so the risk ranking becomes a decision. A trade holding no
     such figure gets the ranking alone and no implied price. */
  riskCover: 2100,
  /* The worth sits on the row and the terms sit behind the click (K6: no figure
     ever hides). The two bite on different costs, so the composed consequence
     has to say so rather than reaching for "both". */
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
  /* The fourth slot is a DURATION: it becomes the second half of the merged
     people card's answer, "Qualified plumber. Months to fill." */
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
  /* The same $1,400 his setup card lists as insurance: one trade, one figure. */
  riskCover: 1400,
};

function Rendered({ id, trade }: { id: TradeSectionId; trade: "restaurant" | "plumber" }) {
  const r = RESTAURANT;
  const p = PLUMBER;
  const isR = trade === "restaurant";
  /* Two trades in one document, so the anchors are prefixed and the plumber's
     "what it costs" link cannot land on the restaurant's card. */
  const a = (s: string) => `${trade}-${s}`;
  switch (id) {
    case "typical-setup":
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
    /* B1 and B2 are ONE card. The profile still lists both ids because a profile
       says what a trade has, not how a page lays it out: the merged card renders
       under the first and the second draws nothing. */
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
      return isR ? <DealsAndRegimes rows={r.deals} /> : null;
    case "town-hall":
      return isR ? <TownHall cleanliness={r.townHall.cleanliness} scale={r.townHall.scale} /> : null;
    default:
      return null;
  }
}

function Column({ trade, activityId, name }: { trade: "restaurant" | "plumber"; activityId: string; name: string }) {
  const profile = profileFor(activityId);
  /* The town-hall section is not in any profile yet: it is a PLACE fact rather
     than a trade fact, so it belongs to the country page. Shown here because
     the founder asked to see all ten together. */
  const ids: TradeSectionId[] = trade === "restaurant"
    ? [...profile.sections, "deals-and-regimes", "town-hall"]
    : profile.sections;

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-3">
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          {name}
        </div>
        <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {ids.length} sections, chosen by the trade profile
        </div>
      </div>
      <div className="space-y-4">
        {ids.map((id) => (
          <Rendered key={id} id={id} trade={trade} />
        ))}
      </div>
    </div>
  );
}

export default function TradeSectionsWorkshop() {
  return (
    /* `av2` and the container CANNOT be the same element. The spine reset is
       `.av2, .av2 * { margin:0; padding:0 }`, which is specificity (0,1,0) on
       the element carrying the class and therefore beats Tailwind's `px-6`
       exactly. The first version of this page put both on <main> and every
       card rendered flush against the left edge of the window. Scope outside,
       lay out inside. */
    <main className="av2">
      {/* Inline, not a class. The reset is `.av2, .av2 * { padding:0 }`, so it
          kills Tailwind padding on the scope element AND on every descendant:
          moving the container inside .av2 was not enough, and the second
          attempt rendered flush left too. An inline style is the only thing
          that beats it. This is why the spine pages carry their own layout
          classes instead of Tailwind's. */}
      <div className="mx-auto max-w-content" style={{ padding: "40px 24px" }}>
      <div
        className="mb-8 rounded-lg border-2 border-dashed px-4 py-3"
        style={{ borderColor: "var(--terra-border)" }}
      >
        <div className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">
          Every number on this page is invented.
        </div>
        <div className="mt-1 text-[length:var(--t-body)] text-[var(--c-ink2)]">
          This is the workshop. These ten sections are here so the design can be
          judged before any of them is fed real figures. Nothing here is
          measured, and none of it reaches a reader until a real source exists.
        </div>
      </div>

      {/* A REAL BAR CHART, on the shadcn chart primitive and recharts, in the
          locked skin. Twelve months of takings, zero baseline, one accent on the
          peak, direct ticks, no legend, no glued sentence. Everything that used
          to be hand-rolled divs. */}
      <div
        className="mb-8 rounded-[14px] border"
        style={{ borderColor: "var(--c-border)", padding: "20px" }}
      >
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
          Through the year
        </div>
        <div className="mb-3 text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">
          Busy months and slow months
        </div>
        <AtlasBarChart
          bars={[
            { label: "Jan", value: 62 }, { label: "Feb", value: 68 },
            { label: "Mar", value: 79 }, { label: "Apr", value: 84 },
            { label: "May", value: 91 }, { label: "Jun", value: 97 },
            { label: "Jul", value: 104 }, { label: "Aug", value: 99 },
            { label: "Sep", value: 93 }, { label: "Oct", value: 88 },
            { label: "Nov", value: 82 }, { label: "Dec", value: 112 },
          ]}
          answer="Dec"
          prefix="$"
          suffix="k"
          height={180}
        />
      </div>

      {/* typography-ok: workshop page inside .av2, so it uses the spine's own
          --t-section step rather than the canonical h1 token. No URL, no reader. */}
      <h1 className="mb-1 text-[length:var(--t-section)] font-semibold tracking-tight text-[var(--c-ink)]">
        Ten sections, two trades
      </h1>
      <p className="mb-8 text-[length:var(--t-body)] text-[var(--c-ink2)]">
        A restaurant gets tipping and a pavement licence. A plumber gets
        neither, because a plumber has no frontage and nobody tips one. That
        difference is the point.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Column trade="restaurant" activityId="restaurants" name="Restaurants, London" />
        <Column trade="plumber" activityId="plumbers" name="Plumbers, London" />
        </div>
      </div>
    </main>
  );
}
