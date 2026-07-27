/**
 * /dev/spine2-tracks , Wave 4 TRACKS catalog: Scale (+TrackBar), Range,
 * SBar, ColSplit rendered with the mockups' own data inside the `.av2`
 * scoped block, so the render is directly comparable against the frozen
 * crops (cell-mock/06, country-mock/08, city-mock/08).
 *
 * Screenshot: node scripts (shot pattern from scripts/shot_spine2.mjs,
 * locator #spine2-tracks, url /dev/spine2-tracks).
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { ColSplit } from "@/components/spine2/ColSplit";
import { SBar } from "@/components/spine2/SBar";
import { Scale } from "@/components/spine2/Scale";
import { Range } from "@/components/spine2/Range";
import { Statblock } from "@/components/spine2/Statblock";

export const metadata = {
  title: "spine2 tracks kit | dev",
  robots: { index: false, follow: false },
};

const kUsd = (n: number) => `$${Math.round(n / 1000)}K`;

export default function Spine2TracksPage() {
  return (
    <div id="spine2-tracks" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* ============ ColSplit , cell ch06 "Where the money goes" ============ */}
        <div className="grid g12" style={{ alignItems: "start" }}>
          <div>
            <div className="lab" style={{ marginBottom: 12 }}>
              Every dollar of revenue, top to bottom
            </div>
            <ColSplit
              segments={[
                { label: "Staff", value: 34, display: "34%", tone: "n1" },
                { label: "Food & drink", value: 31, display: "31%", tone: "n2" },
                { label: "Rent & rates", value: 13, display: "13%", tone: "n3" },
                { label: "Running costs", value: 11, display: "11%", tone: "n4" },
                { label: "Marketing", value: 4, display: "4%", tone: "n5" },
                { label: "You keep", value: 7, display: "7%", tone: "n1", kept: true },
              ]}
              legendNote="Heights are exactly proportional. The last slice is a range, 4% to 10%."
            />
          </div>
          <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
            <Statblock
              header={{ label: "What one move is worth", icon: "margin" }}
              rows={[
                { icon: "supplier", label: "1% off food cost", sub: "on $620K", value: "$6.2", unit: "K" },
                { icon: "staffing-rota", label: "1% off staff cost", value: "$6.2", unit: "K" },
                { icon: "sale-tag", label: "5% price rise", value: "$18", unit: "K" },
                { label: "Both cost lines, 2% each", value: "$24.8", unit: "K", answer: true },
              ]}
            />
            <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
              Two thirds of every dollar goes on staff and food, and{" "}
              <b>the 7% at the end is all that pays you.</b> The last row is worth
              more than 20% more customers, and it costs nothing but attention.
            </p>
          </div>
        </div>

        {/* ColSplit variants , country 15 pair (280px) and city ch06 (340px, no answer) */}
        <div className="panel pad-lg" style={{ marginTop: 28 }}>
          <div className="grid g2" style={{ gap: 36 }}>
            <div>
              <div className="lab" style={{ marginBottom: 12 }}>A restaurant in the UK</div>
              <ColSplit
                height={280}
                segments={[
                  { label: "Staff", value: 34, display: "$34", tone: "n1" },
                  { label: "Food", value: 31, display: "$31", tone: "n2" },
                  { label: "Rent", value: 13, display: "$13", tone: "n3" },
                  { label: "Running", value: 15, display: "$15", tone: "n4" },
                  { label: "Keeps", value: 7, display: "$7", tone: "n1", kept: true },
                ]}
              />
            </div>
            <div>
              <div className="lab" style={{ marginBottom: 12 }}>The same, in Poland</div>
              <ColSplit
                height={280}
                segments={[
                  { label: "Staff", value: 28, display: "$28", tone: "n1" },
                  { label: "Food", value: 32, display: "$32", tone: "n2" },
                  { label: "Rent", value: 8, display: "$8", tone: "n3" },
                  { label: "Running", value: 20, display: "$20", tone: "n4" },
                  { label: "Keeps", value: 12, display: "$12", tone: "n1", kept: true },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="grid g2" style={{ marginTop: 28, alignItems: "start" }}>
          <div>
            <div className="lab" style={{ marginBottom: 12 }}>
              Each $100 of a high-street unit&apos;s cost, no answer segment
            </div>
            <ColSplit
              height={340}
              segments={[
                { label: "Rent", value: 44, display: "$44", tone: "n1" },
                { label: "Business rates", value: 22, display: "$22", tone: "n2" },
                { label: "Fit-out, spread", value: 18, display: "$18", tone: "n3" },
                { label: "Service charge", value: 16, display: "$16", tone: "n4" },
              ]}
            />
          </div>

          {/* ============ SBar , country hero + country ch10 ============ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
              <Statblock
                header={{ label: "Before you trade", icon: "taxes" }}
                rail={false}
                rows={[
                  { label: "Headline profit tax", value: "25", unit: "%" },
                  { label: "All-in load", value: "36", unit: "%", answer: true },
                  { label: "To register a company", value: "1", unit: "day" },
                  { label: "Full-time wage floor", value: "$24", unit: "K" },
                ]}
              />
              <div style={{ marginTop: 16 }}>
                <div className="lab" style={{ marginBottom: 10 }}>
                  What the $36 is made of
                </div>
                <SBar
                  total={36}
                  segments={[
                    { label: "Profit tax", value: 25, display: "$25", tone: "terra" },
                    { label: "Contributions", value: 6, display: "$6", tone: "n2" },
                    { label: "Rates", value: 5, display: "$5", tone: "n4" },
                  ]}
                />
              </div>
            </div>
            <div className="panel pad">
              <div className="lab" style={{ marginBottom: 16 }}>
                How a household spends $100
              </div>
              <SBar
                segments={[
                  { label: "Housing", value: 29, display: "$29", tone: "ink" },
                  { label: "Food", value: 16, display: "$16", tone: "n2" },
                  { label: "Transport", value: 14, display: "$14", tone: "n3" },
                  { label: "Eating out", value: 11, display: "$11", tone: "n4" },
                  { label: "Else", value: 30, display: "$30", tone: "n5" },
                ]}
              />
              <p className="note" style={{ marginTop: 18 }}>
                Housing takes the first three of every ten. What is left after
                that, not headline income, is what a high-street trade competes for.
              </p>
            </div>
          </div>
        </div>

        {/* ============ Scale , city ch08 / city ch14 / country 17 / city ch03 ============ */}
        <div className="grid g12" style={{ marginTop: 28, alignItems: "start" }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Rent by district{" "}
              <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 400 }}>
                multiple of the city rate, lightest first
              </span>
            </div>
            <Scale
              gap="wide"
              accent="min"
              rows={[
                { label: "Brixton", value: 42, display: "x1.1" },
                { label: "Hackney", value: 50, display: "x1.3" },
                { label: "Shoreditch", value: 62, display: "x1.6" },
                { label: "Canary Wharf", value: 73, display: "x1.9" },
                { label: "Covent Garden", value: 85, display: "x2.2" },
                { label: "Mayfair", value: 100, display: "x2.6" },
              ]}
            />
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 14 }}>
              The pressures operators name, by how hard they bite
            </div>
            <Scale
              accent="max"
              rows={[
                { label: "Rent reviews", value: 100, display: "×1.4" },
                { label: "Rates revaluation", value: 74, display: "+9%" },
                { label: "Wage floor", value: 68, display: "+6.7%" },
                { label: "Licensing hours", value: 44, display: "tighter" },
              ]}
            />
            <div style={{ marginTop: 22 }}>
              <div className="lab" style={{ marginBottom: 14 }}>
                What households have in the bank
              </div>
              <Scale
                accent="max"
                rows={[
                  { label: "The middle household", value: 11, display: "$8.4K" },
                  { label: "The top tenth", value: 100, display: "$74K" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="grid g12" style={{ marginTop: 28, alignItems: "start" }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              The ground, against the world median{" "}
              <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 400 }}>
                accent null: the answer is not an extreme, so no row accents
              </span>
            </div>
            <Scale
              rows={[
                { label: "Rule of law", value: 88, display: "strong" },
                { label: "Currency stability", value: 82, display: "steady" },
                { label: "Contract enforcement", value: 80, display: "reliable" },
                { label: "Cost of borrowing", value: 58, display: "dear" },
                { label: "Corruption tax on a shop", value: 12, display: "near nil" },
              ]}
            />
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 14 }}>
              Self-omit: a one-row scale ranks nothing, so nothing renders below
            </div>
            <Scale
              accent="max"
              rows={[{ label: "Only reading", value: 100, display: "$74K" }]}
            />
          </div>
        </div>

        {/* ============ Range , country ch08 wages (linear, degenerate row) ============ */}
        <div className="panel pad" style={{ marginTop: 28 }}>
          <div className="grid g21" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <div className="lab" style={{ marginBottom: 20 }}>
                Typical pay, and its usual range
              </div>
              <Range
                domain={[20000, 80000]}
                ticks={[20000, 40000, 60000, 80000]}
                fmt={kUsd}
                rows={[
                  { label: "Manager", lo: 34000, mid: 44000, hi: 58000, display: kUsd(44000) },
                  { label: "Skilled trade", lo: 30000, mid: 38000, hi: 50000, display: kUsd(38000) },
                  { label: "Supervisor", lo: 27000, mid: 33000, hi: 41000, display: kUsd(33000) },
                  { label: "Shop floor", lo: 24000, mid: 27000, hi: 32000, display: kUsd(27000) },
                  { label: "Wage floor", lo: 24000, mid: 24000, hi: 24000, display: kUsd(24000) },
                ]}
              />
            </div>
            <div>
              <p className="note">
                The wage floor is <b>$24K</b> for a full-time adult, and it has
                risen faster than prices for several years. On top of every wage
                an employer adds about <b>15%</b> in contributions.
              </p>
              <Statblock
                style={{ marginTop: 16 }}
                header={{ label: "The part first-timers miss" }}
                rail={false}
                rows={[
                  { label: "A $30K hire really costs", value: "$34.5", unit: "K", answer: true },
                  { label: "Overtime, above 48h", value: "1.5", unit: "x" },
                  { label: "A rota of six adds", value: "$27", unit: "K" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Range , city ch03 incomes (log scale) */}
        <div className="grid g12" style={{ marginTop: 28, alignItems: "start" }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 20 }}>
              Household income after tax, log axis
            </div>
            <Range
              scale="log"
              domain={[20000, 400000]}
              ticks={[20000, 50000, 100000, 400000]}
              fmt={kUsd}
              rows={[
                { label: "Middle earner", lo: 30000, mid: 47000, hi: 68000, display: kUsd(47000) },
                { label: "Top 10%", lo: 95000, mid: 130000, hi: 180000, display: kUsd(130000) },
                { label: "Top 1%", lo: 240000, mid: 350000, hi: 400000, display: kUsd(350000) },
              ]}
            />
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 20 }}>
              Half-range rows degrade to the marker alone
            </div>
            <Range
              domain={[20000, 80000]}
              ticks={[20000, 40000, 60000, 80000]}
              fmt={kUsd}
              rows={[
                { label: "Full range", lo: 30000, mid: 44000, hi: 58000, display: kUsd(44000) },
                { label: "Missing an end", lo: 30000, mid: 38000, hi: null, display: kUsd(38000) },
                { label: "No range at all", lo: null, mid: 27000, hi: null, display: kUsd(27000) },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
