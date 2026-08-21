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
  CanYouHire,
  SkillLevel,
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
