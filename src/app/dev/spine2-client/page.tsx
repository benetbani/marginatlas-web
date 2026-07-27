/**
 * /dev/spine2-client , the Wave 4 client-component catalog: Calc with the
 * restaurant config (cell 02) and Archetypes with the city POPS (city 05),
 * rendered inside the `.av2` scope for direct comparison against the frozen
 * crops (design/crops/cell-mock/02-02-calculator.jpeg and
 * city-mock/05-...who-lives-here.jpeg).
 *
 * The page itself stays a static server component; the two client islands
 * hydrate below it. Calc reads its URL state once on mount from
 * location.search, so this page never opts into dynamic rendering.
 */
import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { Calc } from "@/components/spine2/Calc";
import { Archetypes, type Pop } from "@/components/spine2/Archetypes";
import {
  RESTAURANT_LONDON,
  RESTAURANT_LONDON_PUBLISHED,
} from "@/components/spine2/calc-config";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";

export const metadata = {
  title: "spine2 client kit | dev",
  robots: { index: false, follow: false },
};

/** The city mockup's POPS data (city.html, the population-types IIFE). */
const LONDON_POPS: Pop[] = [
  {
    id: "young-renters",
    name: "Young renters",
    sharePct: 18,
    spend: "low-spare",
    incomeAfterTax: 34000,
    savings: 1200,
    ageRange: "22 to 30",
    tenure: "Renting, shared",
    buys: "Coffee, takeaway, gyms, nights out",
    trades: [{ label: "Cafes", figure: null }, { label: "bars", figure: null }, { label: "gyms", figure: null }],
  },
  {
    id: "young-professionals",
    name: "Young professionals",
    glyph: "hiring",
    sharePct: 15,
    spend: "good-spare",
    incomeAfterTax: 58000,
    savings: 9000,
    ageRange: "27 to 38",
    tenure: "Renting alone",
    buys: "Eating out, fitness, grooming",
    trades: [{ label: "Restaurants", figure: null }, { label: "salons", figure: null }, { label: "gyms", figure: null }],
  },
  {
    id: "families",
    name: "Families with kids",
    glyph: "trade-childcare",
    sharePct: 17,
    spend: "squeezed",
    incomeAfterTax: 62000,
    savings: 6000,
    ageRange: "30 to 45",
    tenure: "Mortgaged",
    buys: "Groceries, childcare, repairs",
    trades: [{ label: "Grocery", figure: null }, { label: "childcare", figure: null }, { label: "auto", figure: null }],
  },
  {
    id: "established-owners",
    name: "Established owners",
    glyph: "wealth-household",
    sharePct: 12,
    spend: "high",
    incomeAfterTax: 95000,
    savings: 48000,
    ageRange: "45 to 60",
    tenure: "Owned outright",
    buys: "Dining, home, services",
    trades: [{ label: "Restaurants", figure: null }, { label: "retail", figure: null }, { label: "dental", figure: null }],
  },
  {
    id: "wealthy-households",
    name: "Wealthy households",
    glyph: "bank",
    sharePct: 6,
    spend: "very-high",
    incomeAfterTax: 210000,
    savings: 180000,
    ageRange: "40 to 65",
    tenure: "Owned, prime",
    buys: "Fine dining, premium retail",
    trades: [{ label: "Fine dining", figure: null }, { label: "boutiques", figure: null }],
  },
  {
    id: "retired-residents",
    name: "Retired residents",
    sharePct: 11,
    spend: "fixed",
    incomeAfterTax: 29000,
    savings: 32000,
    ageRange: "65 plus",
    tenure: "Owned outright",
    buys: "Groceries, pharmacy, local",
    trades: [{ label: "Grocery", figure: null }, { label: "pharmacy", figure: null }, { label: "cafes", figure: null }],
  },
  {
    id: "students",
    name: "Students",
    sharePct: 8,
    spend: "very-low",
    incomeAfterTax: 14000,
    savings: 400,
    ageRange: "18 to 24",
    tenure: "Halls or shared",
    buys: "Cheap food, phone repair",
    trades: [{ label: "Takeaway", figure: null }, { label: "barbers", figure: null }, { label: "repair", figure: null }],
  },
  {
    id: "recent-arrivals",
    name: "Recent arrivals",
    glyph: "visa-permit",
    sharePct: 9,
    spend: "building",
    incomeAfterTax: 38000,
    savings: 2600,
    ageRange: "24 to 40",
    tenure: "Renting",
    buys: "Groceries, remittance, transport",
    trades: [{ label: "Grocery", figure: null }, { label: "barbers", figure: null }, { label: "phone", figure: null }],
  },
  {
    id: "shift-and-service",
    name: "Shift and service",
    glyph: "staffing-rota",
    sharePct: 4,
    spend: "low",
    incomeAfterTax: 27000,
    savings: 900,
    ageRange: "25 to 50",
    tenure: "Renting",
    buys: "Convenience, late hours",
    trades: [{ label: "Convenience", figure: null }, { label: "takeaway", figure: null }],
  },
];

export default function Spine2ClientDevPage() {
  return (
    <div className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* Calc , cell 02, the restaurant config */}
        <section className="ch" id="ch-02">
          <div className="chhead">
            <div className="hd">
              <span className="itile">
                <GlyphIcon id="calculator" size={24} />
              </span>
              <span className="chnum">02</span>
              <h2>Calculator</h2>
            </div>
          </div>
          <Calc config={RESTAURANT_LONDON} published={RESTAURANT_LONDON_PUBLISHED} />
          <p className="note" style={{ marginTop: 12, fontSize: "12.5px" }}>
            Six variables, one answer. The bars on the right show what a single
            realistic step on each is worth to you, biggest first. Everything
            else on this page describes the <b>typical</b> room.
          </p>
        </section>

        {/* Archetypes , city 05, the POPS sample */}
        <section className="ch" id="ch-05" style={{ marginTop: 56 }}>
          <div className="chhead">
            <div className="hd">
              <span className="itile">
                <GlyphIcon id="wealth-household" size={24} />
              </span>
              <span className="chnum">05</span>
              <h2>Who lives here</h2>
            </div>
          </div>
          <Archetypes pops={LONDON_POPS} defaultSelectedId="young-professionals" />
        </section>
      </div>
    </div>
  );
}
