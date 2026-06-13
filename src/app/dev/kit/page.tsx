/**
 * /dev/kit - the Atlas Page Kit catalog (design-system 12.4: a catalog story
 * before first use). Ungated dev route, like /dev/brand-glyphs. Every kit
 * primitive is rendered here with realistic sample data so the shared
 * vocabulary can be reviewed in one place and regressions are obvious.
 */
import {
  AnswerFirstMasthead,
  HonestTakeBox,
  RangeStrip,
  MoneyGoesBreakdown,
  PlainTerms,
  BreakEvenLine,
  WagesByRole,
  Seasonality,
  RealisticFirstYear,
  SameBusinessNearby,
  GutCheck,
  RealityCheck,
  RightForWrongFor,
  WhatLocalsKnow,
  ContrarianInsight,
  MythVsReality,
  LikeForLikeTable,
  WageRangeTracks,
  StickySectionNav,
  FreshnessStamp,
  FlagIt,
} from "@/components/kit";

export const metadata = { title: "Atlas Page Kit catalog" };

function usd(n: number): string {
  if (!Number.isFinite(n)) return "–";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function usdFull(n: number): string {
  return Number.isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "–";
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2
        data-typography="custom"
        className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function KitCatalogPage() {
  const nav = [
    { id: "k-masthead", label: "Masthead" },
    { id: "k-honest", label: "Honest take" },
    { id: "k-range", label: "Range strip" },
    { id: "k-money", label: "Money goes" },
    { id: "k-data", label: "Data sections" },
    { id: "k-beats", label: "Editorial beats" },
    { id: "k-compare", label: "Comparison" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-atlas-700">
        Dev catalog
      </p>
      <h1 className="font-display text-3xl font-medium tracking-tight text-ink-900">
        The Atlas Page Kit
      </h1>
      <p className="mt-2 max-w-2xl text-cocoa-700/80">
        Every shared primitive with sample data. Reference, not a shipped page.
      </p>

      <div className="mt-8 flex gap-6">
        <div className="min-w-0 flex-1 space-y-12">
          <div id="k-masthead">
            <AnswerFirstMasthead
              eyebrow="Restaurants · London · United Kingdom"
              tier="good"
              title="A London restaurant clears about $48,000 for its owner in a normal year."
              answer="Strong revenue, thin take-home. The rent and the wages decide it, not the dining room."
              anchor={{ label: "Typical revenue a year", value: 720000, format: "usd-full" }}
              spread={{ p10: 360000, p25: 520000, p50: 720000, p75: 1020000, p90: 1300000, format: usd }}
              stats={[
                { label: "Net margin", value: "5%" },
                { label: "Owner take-home", value: "$48K" },
                { label: "Firms in London", value: "13,000" },
              ]}
              breakIn="Hard to break into"
            />
          </div>

          <Block title="HonestTakeBox">
            <div id="k-honest">
              <HonestTakeBox
                verdict="The headline revenue is real, but a London restaurant is a wages-and-rent business, not a high-margin one."
                points={[
                  "Two thirds of every pound goes to staff and the landlord before the owner sees anything.",
                  "The best sites trade location for rent you cannot easily recover in a downturn.",
                ]}
              >
                Most owners draw a salary closer to a senior manager than a business owner, and the
                upside comes from a second site, not the first.
              </HonestTakeBox>
            </div>
          </Block>

          <Block title="RangeStrip (default + compact)">
            <div id="k-range" className="space-y-6">
              <RangeStrip
                p10={360000}
                p25={520000}
                p50={720000}
                p75={1020000}
                p90={1300000}
                format={usd}
                tier="good"
              />
              <div className="max-w-sm">
                <RangeStrip p10={360000} p50={720000} p90={1300000} format={usd} size="compact" />
              </div>
            </div>
          </Block>

          <Block title="MoneyGoesBreakdown">
            <div id="k-money">
              <MoneyGoesBreakdown
                items={[
                  { label: "Food and drink cost", perHundred: 30 },
                  { label: "Payroll", perHundred: 34, hint: "kitchen and front of house" },
                  { label: "Rent and rates", perHundred: 14 },
                  { label: "Everything else", perHundred: 12 },
                  { label: "Tax", perHundred: 5 },
                  { label: "What the owner keeps", perHundred: 5, kept: true },
                ]}
              />
            </div>
          </Block>

          <Block title="Data sections">
            <div id="k-data" className="space-y-6">
              <PlainTerms
                items={[
                  { label: "Covers a day", value: "about 320", hint: "across lunch and dinner" },
                  { label: "Average spend a head", value: "$38" },
                  { label: "Staff on the payroll", value: "14" },
                ]}
              />
              <BreakEvenLine
                headline="You cover your costs at about 240 covers a day."
                detail="Below that the rent and the salaried staff eat the month; above it, every table is margin."
              />
              <WagesByRole
                format={usdFull}
                roles={[
                  { role: "Head chef", low: 48000, median: 60000, high: 78000 },
                  { role: "Server", low: 26000, median: 31000, high: 38000 },
                  { role: "Kitchen porter", median: 24000 },
                ]}
              />
              <Seasonality
                monthly={[0.7, 0.65, 0.8, 0.85, 0.95, 1.0, 0.9, 0.85, 0.9, 0.95, 0.8, 1.0]}
                note="December and the summer terrace months carry the year; February is the one to survive."
              />
              <RealisticFirstYear
                headline="Plan to lose money for the first six months."
                bullets={[
                  "Most of the build cost lands before a single cover is served.",
                  "A new room takes a season to fill, longer without a known name.",
                  "One in seven closes inside the first year.",
                ]}
              />
              <SameBusinessNearby
                format={usdFull}
                rows={[
                  { name: "Manchester", href: "#", value: 540000, sub: "lower rent, thinner spend" },
                  { name: "Edinburgh", href: "#", value: 600000 },
                  { name: "Birmingham", href: "#", value: 500000 },
                ]}
                valueLabel="Typical revenue a year."
              />
            </div>
          </Block>

          <Block title="Editorial beats">
            <div id="k-beats" className="space-y-6">
              <GutCheck
                questions={[
                  "Can you cover six months of rent and wages before the room fills?",
                  "Do you have a chef you trust, or are you the chef?",
                  "Would the numbers still work if covers came in 20% under plan?",
                ]}
              />
              <RealityCheck
                truth="A full dining room is not the same as a profitable one."
                body="The sites that look busiest often run the thinnest, because the rent that buys the footfall also takes the margin."
              />
              <RightForWrongFor
                rightFor={["You have run a kitchen before", "You can fund a slow first year"]}
                wrongFor={["You need a salary from month one", "You are buying yourself a job, not a business"]}
              />
              <WhatLocalsKnow
                notes={[
                  "The good sites change hands quietly, before they ever reach an agent.",
                  "Rent-free periods are negotiable; the headline rent rarely is.",
                ]}
              />
              <ContrarianInsight
                insight="The second site, not the first, is where a restaurant owner actually makes money."
                body="The first pays for the learning. The brand, the suppliers, and the team only pay off when they are spread across more than one room."
              />
              <MythVsReality
                pairs={[
                  { myth: "A great chef guarantees a great business.", reality: "A great landlord deal does more for the bottom line than a star review." },
                  { myth: "Higher prices mean higher profit.", reality: "Above the local ceiling, covers fall faster than margin rises." },
                ]}
              />
            </div>
          </Block>

          <Block title="Comparison grammar">
            <div id="k-compare" className="space-y-6">
              <LikeForLikeTable
                eyebrow="Like for like"
                heading="The same restaurant across UK cities"
                lede="One country, one currency, comparable prices, so the leader is marked."
                columns={[
                  { key: "lon", label: "London" },
                  { key: "man", label: "Manchester" },
                  { key: "edi", label: "Edinburgh" },
                ]}
                rows={[
                  {
                    label: "Typical revenue",
                    cells: { lon: "$720K", man: "$540K", edi: "$600K" },
                    metric: { lon: 720000, man: 540000, edi: 600000 },
                  },
                  {
                    label: "Owner take-home",
                    cells: { lon: "$48K", man: "$52K", edi: "$50K" },
                    metric: { lon: 48000, man: 52000, edi: 50000 },
                  },
                  {
                    label: "Rent share",
                    cells: { lon: "14%", man: "9%", edi: "11%" },
                    metric: { lon: 14, man: 9, edi: 11 },
                    higherIsBetter: false,
                  },
                ]}
                footnote="Owner take-home is after tax, for a typical single-site operator."
              />
              <LikeForLikeTable
                eyebrow="Across countries"
                heading="The same restaurant in different countries"
                lede="Different price regimes, so no winner is crowned (noLeaderMark)."
                noLeaderMark
                columns={[
                  { key: "uk", label: "United Kingdom" },
                  { key: "de", label: "Germany" },
                  { key: "fr", label: "France" },
                ]}
                rows={[
                  {
                    label: "Net margin",
                    cells: { uk: "5%", de: "7%", fr: "6%" },
                    metric: { uk: 5, de: 7, fr: 6 },
                  },
                  {
                    label: "1-year survival",
                    cells: { uk: "82%", de: "85%", fr: "80%" },
                    metric: { uk: 82, de: 85, fr: 80 },
                  },
                ]}
                footnote="Figures are not adjusted for local prices."
              />
              <div className="rounded-lg border border-parchment bg-cream-50 p-5">
                <h3
                  data-typography="custom"
                  className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-cocoa-500"
                >
                  WageRangeTracks
                </h3>
                <WageRangeTracks
                  format={usdFull}
                  tracks={[
                    { label: "London", low: 28000, median: 33000, high: 40000 },
                    { label: "Manchester", low: 23000, median: 27000, high: 32000 },
                    { label: "Edinburgh", low: 25000, median: 29000, high: 35000 },
                  ]}
                />
              </div>
            </div>
          </Block>

          <Block title="Furniture">
            <div className="space-y-3">
              <FreshnessStamp updated="June 2026" tier="good" />
              <FlagIt />
            </div>
          </Block>
        </div>

        <StickySectionNav sections={nav} />
      </div>
    </div>
  );
}
