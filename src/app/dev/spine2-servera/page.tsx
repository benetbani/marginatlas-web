/**
 * /dev/spine2-servera , catalog of the Wave 4 SERVER-A components: Late,
 * Voices, Myth, Band, Tiles, Take, Zonecard, Qa, Defs, Ctl.
 *
 * Same .av2 pattern as /dev/spine2. Every component renders the mockups' own
 * content (cell 17 verdict, cell 21 tiles, country 18 myth, country 16
 * zonecard, cell 14 voices, cell 12/04 late, cell 19/20/15 tail) so the
 * render is directly comparable against the frozen crops in
 * design/crops/{cell,country}-mock.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { Late } from "@/components/spine2/Late";
import { Voices } from "@/components/spine2/Voices";
import { Myth } from "@/components/spine2/Myth";
import { Band } from "@/components/spine2/Band";
import { Tiles } from "@/components/spine2/Tiles";
import { Take } from "@/components/spine2/Take";
import { Zonecard } from "@/components/spine2/Zonecard";
import { Qa } from "@/components/spine2/Qa";
import { Defs } from "@/components/spine2/Defs";
import { Ctl } from "@/components/spine2/Ctl";
import { Statblock } from "@/components/spine2/Statblock";
import type { FigureRegistry } from "@/components/spine2/figures";

export const metadata = {
  title: "spine2 server-a kit | dev",
  robots: { index: false, follow: false },
};

/* The page's figure registry , lands at page assembly; here it carries the
   cell page's own key figures, the ones the ch17 chips restate. */
const CELL_FIGURES: FigureRegistry = {
  "kept-share": "7 cents kept",
  "break-in": "demanding to break in",
  "payback-years": "4.5 years to earn it back",
};

function Lab({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab" style={{ margin: "34px 0 12px" }}>
      {children}
    </div>
  );
}

export default function Spine2ServerAPage() {
  return (
    <div id="spine2-servera" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* ---- Take , cell 17, the verdict ---- */}
        <Lab>Take , cell 17</Lab>
        <Take
          verdict={
            <>
              A London restaurant is <b>deep demand on a thin margin.</b> The room
              fills, the money moves, and about seven cents of every dollar reaches
              the owner. The rooms that pay their owner well mostly signed a cheaper
              lease and ran a shorter menu.
            </>
          }
          chips={[
            { glyph: "owner-keeps", figureId: "kept-share" },
            { glyph: "competition", figureId: "break-in" },
            { glyph: "first-year", figureId: "payback-years" },
          ]}
          figures={CELL_FIGURES}
        />

        {/* ---- Myth , country 18, paired with its evidence statblock
             (composition at the page, per BATCH-A) ---- */}
        <Lab>Myth , country 18</Lab>
        <div className="panel pad-lg">
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <Myth
              claim="It is hard to start a business here."
              fix={
                <>
                  Starting is the easy part: <b>a day and $60</b> gives you a company
                  that legally exists. What is hard comes after.
                </>
              }
              note="The bank account takes weeks. Then the property rates arrive, on top of a rent already among the dearest in Europe. Britain lets you in quickly and charges you to stay."
            />
            <Statblock
              header={{ label: "Easy in, dear to hold", icon: "myth-reality" }}
              rail={false}
              rows={[
                { label: "To have a company", value: "1 day", answer: true },
                { label: "To take money", value: "5 wk" },
                { label: "Cash to set up", value: "$240" },
                { label: "Property rates, year one", value: "$5.9", unit: "K" },
              ]}
            />
          </div>
        </div>

        {/* ---- Band , the cell signature moment (figureSize 64 on cell) ---- */}
        <Lab>Band , cell close</Lab>
        <Band
          takeaway="Deep demand, real revenue, a thin slice at the end. The rooms that pay properly signed a cheaper room and ran a shorter menu."
          figure="1 in 4"
          figureSub="pay the owner a real living"
          figureSize={64}
        />

        {/* ---- Tiles , cell 21, the mixed doors/facts close (M1: 2 doors,
             4 facts; at launch facts dominate) ---- */}
        <Lab>Tiles , cell 21</Lab>
        <Tiles
          readings={[
            { glyph: "trade-cafe", label: "Cafes in London", figure: "$25K kept" },
            { glyph: "trade-bar", label: "Bars in London", figure: "$38K kept" },
            { glyph: "trade-restaurant", label: "Restaurants, Manchester", figure: "$41K kept" },
            { glyph: "skyline", label: "Every trade in London", figure: "42 trades", href: "/" },
            { glyph: "neighborhood", label: "Restaurants by district", figure: "6 areas" },
            { glyph: "global-spread", label: "The UK overall", figure: "$36 in every $100", href: "/" },
          ]}
        />

        {/* ---- Voices , cell 14, quotes anchored to figures ---- */}
        <Lab>Voices , cell 14</Lab>
        <div className="panel pad">
          <Voices
            voices={[
              {
                say: "The rent review nearly closed us in year four. Nobody warns you it only goes one way.",
                who: "Full service · Islington",
                figure: "+31%",
              },
              {
                say: "Delivery looked like free money until I did the maths. A third goes to the app before I have paid for the food.",
                who: "Neighbourhood · Peckham",
                figure: "30%",
              },
              {
                say: "The month I got food cost from 34 to 30 was the month I finally paid myself properly.",
                who: "Bistro · Hackney",
                figure: "$25K",
              },
              {
                say: "A quote whose figure is missing keeps its words, and the figure cell does not render.",
                who: "Row-level degrade · M9",
                figure: null,
              },
            ]}
          />
        </div>

        {/* ---- Late , cell 12 (year codes) and cell 04 (ordinals):
             the index is data, never a counter ---- */}
        <div className="grid g2">
          <div>
            <Lab>Late , cell 12, year codes</Lab>
            <div className="panel pad">
              <div className="lab" style={{ marginBottom: 12 }}>
                When they close, and why
              </div>
              <Late
                items={[
                  {
                    index: "Y1",
                    title: "Ran out of cash",
                    sub: "Not out of customers. The fit-out was funded and the first eight months were not.",
                  },
                  {
                    index: "Y3",
                    title: "The review, or the founder",
                    sub: "Rent resets upward, or the person working ninety hours stops being able to.",
                  },
                  {
                    index: "Y5",
                    title: "Reinvestment nobody saved for",
                    sub: "The kitchen is tired and the room looks it, and there is no money to put back.",
                  },
                ]}
              />
            </div>
          </div>
          <div>
            <Lab>Late , cell 04, ordinals</Lab>
            <div className="panel pad">
              <Late
                items={[
                  {
                    index: "01",
                    title: "Two businesses in one room",
                    sub: "A kitchen and a floor full of staff, and both get paid before you do.",
                  },
                  {
                    index: "02",
                    title: "Food is about a third of every bill",
                    sub: "The one cost you can move week to week.",
                  },
                  {
                    index: "03",
                    title: "People are about another third",
                    sub: "Set by the menu: more dishes means more chefs.",
                  },
                  {
                    index: "04",
                    title: "The last third pays for everything else",
                    sub: "Space, power, insurance, cards, marketing. What survives is yours.",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ---- Zonecard , country 16, the verified absence; the sibling
             'unknown' presence renders nothing at all ---- */}
        <Lab>Zonecard , country 16</Lab>
        <Zonecard
          presence={{ state: "verified-none" }}
          glyph="free-zone"
          lead="Nothing here moves the needle for a high-street trade."
          explain="The UK's freeports and enterprise zones matter for warehousing and manufacturing, not a shop or a restaurant. If that changes for your trade, this section will say so."
        />
        <Zonecard
          presence={{ state: "unknown" }}
          glyph="free-zone"
          lead="This one never renders"
          explain="absence-of-knowledge is not knowledge-of-absence."
        />

        {/* ---- Ctl , cell 15, what you set versus what is set for you ---- */}
        <Lab>Ctl , cell 15</Lab>
        <div className="panel pad">
          <Ctl
            you={[
              "Prices and the menu",
              "The rota and the hours",
              "Format, and how many chefs",
              "Waste, stock, suppliers",
              "Which room you sign, once",
            ]}
            not={[
              "The rent review",
              "Rates and tax",
              "The wage floor",
              "Energy prices",
              "Footfall on the street",
            ]}
          />
          <p className="note" style={{ marginTop: 16 }}>
            Four of the five on the right move against you over time, and none move
            back.
          </p>
        </div>

        {/* ---- Defs , cell 19, what these words mean ---- */}
        <Lab>Defs , cell 19</Lab>
        <Defs
          defs={[
            {
              glyph: "revenue",
              term: "Revenue",
              plain:
                "Everything that crosses the till in a year, before any cost is paid. Not profit, and not what you take home.",
            },
            {
              glyph: "owner-keeps",
              term: "What the owner keeps",
              plain:
                "What is left after every cost, including your own staff wages, but before your personal tax. This is the number that pays you.",
            },
            {
              glyph: "break-even",
              term: "The daily floor",
              plain:
                "What you must take on an average open day just to cover the costs you have already committed to.",
            },
            {
              glyph: "startup-cost",
              term: "Cash before you open",
              plain:
                "Everything you spend before the first sale, plus the losses while trade builds. Not the fit-out alone.",
            },
            {
              glyph: "unit-economics",
              term: "An order",
              plain:
                "One bill, not one person. A table of two that shares three plates is one order.",
            },
            {
              glyph: "benchmark",
              term: "Typical",
              plain:
                "The middle of the trade, not the average. Half of London restaurants sit above it and half below.",
            },
          ]}
        />

        {/* ---- Qa , cell 20, native details/summary, zero client JS ---- */}
        <Lab>Qa , cell 20</Lab>
        <Qa
          items={[
            {
              q: "Is $43,000 really all an owner makes?",
              a: "That is what the typical room leaves after every cost, including the wages of everyone who works there. Many owners also pay themselves a salary that sits inside the staff line, so their total take is higher. The point of the figure is that the business itself only generates about seven cents in the dollar of surplus.",
            },
            {
              q: "Why does London keep about the same as Manchester?",
              a: "London rooms take far more money but pay far more rent and higher wages to take it. The extra revenue is almost entirely consumed by the extra cost of being in London. Size of market and size of margin are different questions.",
            },
            {
              q: "Can I trust a number that is modeled?",
              a: "Only as far as its arithmetic. That is why the working is shown above rather than hidden. If you disagree with an input, change it in the calculator and the answer moves. A figure you cannot argue with is a figure you should not trust.",
            },
            {
              q: "What is the single biggest mistake people make?",
              a: "Budgeting the fit-out and nothing else. The four thin months after opening close more rooms than bad food does, and they appear on no opening-cost list.",
            },
            {
              q: "Does this include delivery?",
              a: "Yes, in the revenue line. Be careful with it: platform commission runs near a third, so on a seven per cent margin delivery orders can cost you money while looking like growth.",
            },
          ]}
        />
      </div>
    </div>
  );
}
