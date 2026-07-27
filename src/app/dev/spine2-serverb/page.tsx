/**
 * /dev/spine2-serverb , the SERVER-B Wave 4 catalog: Roster, Hoodcards,
 * StatTiles (tang / worlds / statcluster variants), Wealth, Method rendered
 * with the mockups' own data inside the `.av2` scope, so the render is
 * directly comparable against the frozen crops:
 *
 *   cell-mock/08 what a team costs   -> Roster
 *   cell-mock/05 a normal day        -> StatTiles (tang)
 *   cell-mock/15 what to watch       -> StatTiles (worlds)
 *   city-mock/04 visitors            -> StatTiles (statcluster)
 *   city-mock/05 who lives here      -> Wealth
 *   city-mock/10 the districts       -> Hoodcards (ALL facts, the launch state)
 *   cell-mock/18 how we work this out-> Method (Sum + embedded Ledger)
 *
 * Screenshot verification only; never linked, never indexed.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { Statblock } from "@/components/spine2/Statblock";
import { TierDefinitions } from "@/components/spine2/TierPill";
import { Roster } from "@/components/spine2/Roster";
import { Hoodcards } from "@/components/spine2/Hoodcards";
import { StatTiles } from "@/components/spine2/StatTiles";
import { Wealth } from "@/components/spine2/Wealth";
import { Method } from "@/components/spine2/Method";
import type { GlyphId } from "@/components/spine2/glyphs";

export const metadata = {
  title: "spine2 server-b kit | dev",
  robots: { index: false, follow: false },
};

function Chhead({ ico, num, title }: { ico: GlyphId; num: string; title: string }) {
  return (
    <div className="chhead">
      <div className="hd">
        <span className="itile">
          <GlyphIcon id={ico} size={24} />
        </span>
        <span className="chnum">{num}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default function Spine2ServerBPage() {
  return (
    <div id="spine2-serverb" className={`av2 ${spineFontVariables}`}>
      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 48 }}>
        {/* ============ cell 05 , StatTiles (tang) ============ */}
        <section className="ch">
          <Chhead ico="unit-economics" num="05" title="A normal day" />
          <StatTiles
            columns={3}
            align="center"
            /* the chapter is "a normal day", so the day count leads (mockup ch05) */
            lead={0}
            items={[
              { big: "52", label: "orders a day", pic: { kind: "fill", of: 90 } },
              { big: "$38", label: "average spend", pic: { kind: "disc", of: 58 } },
              { big: "6", label: "days a week open", pic: { kind: "week" } },
            ]}
          />
        </section>

        {/* ============ cell 08 , Roster ============ */}
        <section className="ch">
          <Chhead ico="wages" num="08" title="What a team costs" />
          <div className="grid g2">
            <div className="panel pad">
              <Roster
                contribPct={15}
                roles={[
                  { label: "Head chef", glyph: "staffing-rota", wage: 52000 },
                  { label: "Manager", glyph: "hiring", wage: 36000, partTime: true },
                  { label: "Line cook", glyph: "staffing-rota", wage: 34000 },
                  { label: "Waitstaff", glyph: "hiring", wage: 23000, count: 2 },
                  { label: "Kitchen porter", glyph: "staffing-rota", wage: 15000, partTime: true },
                ]}
              />
            </div>
            <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
              <Statblock
                header={{ label: "What hiring actually costs", icon: "hiring" }}
                rows={[
                  { icon: "taxes", label: "Employer contributions", sub: "on every wage", value: "+15", unit: "%", answer: true },
                  { icon: "hiring", label: "To recruit one chef", sub: "agency or advert", value: "$2.4", unit: "K" },
                  { icon: "first-year", label: "Weeks to fill a chef role", value: "5" },
                  { icon: "staffing-rota", label: "Staff churn a year", sub: "hospitality", value: "32", unit: "%" },
                  { icon: "wages", label: "Churn cost, a year", sub: "rehiring and retraining", value: "$11", unit: "K" },
                ]}
              />
              <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
                A $34K line cook really costs <b>$39K</b>. Five and a half people is
                what $210K buys in London, and that is the whole rota this room can
                afford. Churn adds another eleven thousand nobody budgets.
              </p>
            </div>
          </div>
        </section>

        {/* ============ cell 15 , StatTiles (worlds) ============ */}
        <section className="ch">
          <Chhead ico="watch" num="15" title="What to watch" />
          <div className="panel pad-lg">
            <div className="lab" style={{ marginBottom: 16 }}>The same room, three years</div>
            <StatTiles
              columns={3}
              align="left"
              /* "a normal year" is the answer and already carries the accent;
                 leading it by size makes the mark and the size agree (mockup ch15) */
              lead={1}
              items={[
                {
                  big: "−$53K",
                  label: "A bad year",
                  glyph: "gut-check",
                  tone: "bad",
                  caption: "Revenue $480K. You pay everyone else, then pay to keep the doors open.",
                },
                {
                  big: "$43K",
                  label: "A normal year",
                  glyph: "benchmark",
                  tone: "answer",
                  caption: "Revenue $620K. A wage, but less than the head chef earns.",
                },
                {
                  big: "$154K",
                  label: "A good year",
                  glyph: "trend",
                  caption: "Revenue $780K. The year that makes the other two worth it.",
                },
              ]}
            />
            <p className="note" style={{ marginTop: 18, maxWidth: "72ch" }}>
              Nothing about the room changes across those columns. Revenue about{" "}
              <b>a quarter either side of a normal year</b> is the difference between
              losing $53K and making $154K, because almost every cost underneath is
              already committed. About one year in six runs bad.
            </p>
          </div>
        </section>

        {/* ============ city 04 , StatTiles (statcluster) ============ */}
        <section className="ch">
          <Chhead ico="tourist" num="04" title="Visitors, and their money" />
          <div className="grid g2">
            <div className="panel pad" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <StatTiles
                columns={2}
                items={[
                  { big: "21M", label: "visitors a year", glyph: "tourist" },
                  { big: "$53B", label: "they spend here", glyph: "spending-power" },
                  { big: "$2,500", label: "spent per visitor", glyph: "payments" },
                  { big: "5.8", label: "nights, average stay", glyph: "first-year" },
                ]}
              />
              <p className="note" style={{ marginTop: 18 }}>
                One dollar in five across the city is a visitor&apos;s, but in the West
                End it is more than one in two. Visitor money is real and large, and it
                arrives on a schedule you do not control.
              </p>
            </div>
            <div className="panel pad">
              <div className="lab" style={{ marginBottom: 12 }}>
                Self-omit: a tile with a null figure reflows the grid
              </div>
              <StatTiles
                columns={2}
                items={[
                  { big: "21M", label: "visitors a year", glyph: "tourist" },
                  { big: null, label: "never renders" },
                  { big: "$2,500", label: "spent per visitor", glyph: "payments" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ============ city 05 , Wealth ============ */}
        <section className="ch">
          <Chhead ico="who-for" num="05" title="Who lives here, and what they can spend" />
          <Wealth
            label="Every London household, by wealth"
            bands={[
              { label: "Struggling", sharePct: 24, households: 840_000 },
              { label: "Getting by", sharePct: 31, households: 1_090_000 },
              { label: "Comfortable", sharePct: 27, households: 945_000 },
              { label: "Well off", sharePct: 12, households: 420_000 },
              { label: "Wealthy", sharePct: 6, households: 210_000 },
            ]}
            figs={[
              { big: "227K", label: "millionaire households", glyph: "wealth-household" },
              { big: "630K", label: "households over $150K", glyph: "spending-power" },
              { big: "24%", label: "below the poverty line", glyph: "who-for" },
              { big: "$8.4K", label: "typical household savings", glyph: "bank", tone: "answer" },
            ]}
          />
        </section>

        {/* ============ city 10 , Hoodcards (all facts, the launch state) ============ */}
        <section className="ch">
          <Chhead ico="neighborhood" num="10" title="The districts" />
          <Hoodcards
            readings={[
              { name: "Brixton", blurb: "Young, loud, independent. The cheapest way onto a real high street.", glyph: "high-street", figure: "x1.1", barPct: 42 },
              { name: "Hackney", blurb: "Creative money, brunch and salons. Rent rising fast.", glyph: "high-street", figure: "x1.3", barPct: 50 },
              { name: "Shoreditch", blurb: "Bars and small plates, thin by day, packed by night.", glyph: "high-street", figure: "x1.6", barPct: 62 },
              { name: "Canary Wharf", blurb: "Weekday lunch money, dead at the weekend.", glyph: "high-street", figure: "x1.9", barPct: 73 },
              { name: "Covent Garden", blurb: "Tourists all year. Footfall you pay dearly for.", glyph: "high-street", figure: "x2.2", barPct: 85 },
              { name: "Mayfair", blurb: "Wealth and expense accounts. Fine dining or nothing.", glyph: "high-street", figure: "x2.6", barPct: 100 },
            ]}
          />
        </section>

        {/* ============ cell 18 , Method (Sum + embedded Ledger) ============ */}
        <section className="ch">
          <Chhead ico="methodology" num="18" title="How we work this out" />
          <Method
            arithmetic={[
              { kind: "start", label: "Revenue", detail: "52 orders × $38 × 313 days", value: 618_488 },
              { kind: "sub", label: "less food and drink, 31%", value: -191_731 },
              { kind: "sub", label: "less staff, 34%", value: -210_286 },
              { kind: "sub", label: "less rent and rates", value: -80_403 },
              { kind: "sub", label: "less running costs, 15%", value: -92_773 },
              { kind: "result", label: "What the owner keeps", value: 43_295 },
            ]}
            footnote="Every figure on this page is built from those five lines. Change one in the calculator and the whole page follows."
            ledger={[
              { label: "Rent and rates", tier: "measured", how: "assessed rent on comparable units" },
              { label: "Staff pay", tier: "measured", how: "published pay by role and region" },
              { label: "Survival odds", tier: "measured", how: "business openings and closures" },
              { label: "Revenue", tier: "built", how: "sector revenue over business count" },
              { label: "Food and drink share", tier: "built", how: "purchases over revenue for the trade" },
              { label: "What the owner keeps", tier: "built", how: "the residual of the five lines" },
              { label: "Cost to fit out", tier: "thin", how: "no register exists, so this is a range" },
            ]}
          />
          <TierDefinitions style={{ marginTop: 14, maxWidth: "78ch" }} />
        </section>
      </div>
    </div>
  );
}
