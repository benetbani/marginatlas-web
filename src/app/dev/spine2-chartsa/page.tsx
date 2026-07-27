/**
 * /dev/spine2-chartsa , the Wave 4 CHARTS-A catalog: Matrix, ShrinkBars
 * (ramp + track), Fitgrid, Tline, rendered with the mockups' real data
 * inside a `.av2`-scoped block, directly comparable against the frozen
 * crops:
 *   design/crops/country-mock/06-06-licences-by-trade.jpeg   (Matrix)
 *   design/crops/cell-mock/04-04-where-a-38-bill-goes.jpeg   (ShrinkBars ramp)
 *   design/crops/cell-mock/12-12-business-survival...jpeg    (ShrinkBars track,
 *     form identical, FIGURES CORRECTED: the data layer replaced the old
 *     74/52/41 survival readings with the true 94/64/39)
 *   design/crops/country-mock/05-05-how-long-it-takes-to-open.jpeg (Tline)
 *
 * Every caption below interpolates from the same constants the marks render
 * from (PORT-CONTRACT M7): the matrix note derives its slow columns, the
 * dwindle note derives its cents-in-the-dollar, the myth fix derives from
 * the first survival reading, and the tline sidebar derives the opening
 * week from the critical lane.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { Statblock } from "@/components/spine2/Statblock";
import { Matrix, type MatrixRow } from "@/components/spine2/Matrix";
import { ShrinkBars, type ShrinkStage } from "@/components/spine2/ShrinkBars";
import { Fitgrid, type FitRow, type FitWinner } from "@/components/spine2/Fitgrid";
import { Tline, criticalEndWk, type TStep, type Tick } from "@/components/spine2/Tline";

export const metadata = {
  title: "spine2 charts A | dev",
  robots: { index: false, follow: false },
};

/* ---------- shared little interpolation helpers (M7 captions) ---------- */

const SMALL_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];
const word = (n: number) => SMALL_WORDS[n] ?? String(n);

const joinAnd = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/* ---------- Matrix , country ch06, the real UK licence grid ---------- */

const LICENCE_COLS = ["Premises", "Food", "Alcohol", "Late hours", "Special"];
const LICENCE_ROWS: MatrixRow[] = [
  { trade: "Restaurant", marks: ["req", "req", "slow", "slow", "none"] },
  { trade: "Cafe", marks: ["req", "req", "none", "none", "none"] },
  { trade: "Bar", marks: ["req", "none", "slow", "slow", "none"] },
  { trade: "Grocery", marks: ["req", "req", "req", "none", "none"] },
  { trade: "Gym", marks: ["req", "none", "none", "none", "req"] },
  { trade: "Salon", marks: ["req", "none", "none", "none", "req"] },
  { trade: "Childcare", marks: ["req", "none", "none", "none", "slow"] },
  { trade: "Auto repair", marks: ["req", "none", "none", "none", "req"] },
];

/* ---------- ShrinkBars ramp , cell ch04, the $38 bill ---------- */

const BILL_START = 38;
const BILL_STAGES: ShrinkStage[] = [
  { label: "A guest spends", sub: "$38", remaining: 38 },
  { label: "After food and staff", sub: "$13 left", remaining: 13 },
  { label: "After running costs", sub: "$8 left", remaining: 8 },
  { label: "After rent and rates", sub: "$2.65 is yours", remaining: 2.65 },
];
const money = (v: number) => `$${v}`;

/* ---------- ShrinkBars track , cell ch12, CORRECTED survival ---------- */
/* The data layer corrected the mockup's 74/52/41: year-1 was nobody's
   figure (it resembles a 2-year rate). True cohort track: 94 / 64 / 39. */

const SURVIVAL: ShrinkStage[] = [
  { label: "Year 1", remaining: 94 },
  { label: "Year 3", remaining: 64 },
  { label: "Year 5", remaining: 39 },
];
const yearOneInTen = Math.round((SURVIVAL[0].remaining as number) / 10);

/* ---------- Tline , country ch05, decision to first sale ---------- */

const OPENING_SPAN_WK = 6;
const BANK_START_WK = 0.5;
const BANK_DUR_WK = 4.5;
const OPENING_STEPS: TStep[] = [
  { label: "Register the company", icon: "register-cost", startWk: 0, durWk: 0.5, cost: "$60" },
  { label: "Register for tax", startWk: 0.5, durWk: 0.35, cost: "free" },
  { label: "Open a bank account", startWk: BANK_START_WK, durWk: BANK_DUR_WK, cost: `${BANK_START_WK + BANK_DUR_WK} wk` },
  { label: "Licence, if needed", startWk: 1.8, durWk: 0.75, cost: "$180" },
  { label: "Register for sales tax", startWk: 4.9, durWk: 0.5, cost: "free" },
];
const OPENING_TICKS: Tick[] = [
  { atWk: 0, label: "day 0" },
  { atWk: 3, label: "week 3" },
  { atWk: 6, label: "week 6" },
];
/* M7: the sidebar's figures interpolate the SAME derivation the accented
   lane draws , the critical step's completion week. */
const openWk = Math.round(criticalEndWk(OPENING_STEPS) ?? 0);

/* ---------- Fitgrid , city ch09, trade x district fit ---------- */

const DISTRICTS = ["Brixton", "Hackney", "Shoreditch", "Canary W.", "Covent G.", "Mayfair"];
const FIT_ROWS: FitRow[] = [
  { trade: "Restaurant", icon: "trade-restaurant", fit: [0.3, 0.6, 0.85, 0.6, 0.55, 0.3] },
  { trade: "Cafe", icon: "trade-cafe", fit: [0.55, 0.8, 0.6, 0.5, 0.35, 0.3] },
  { trade: "Hair salon", icon: "trade-salon", fit: [0.55, 0.8, 0.6, 0.3, 0.25, 0.5] },
  { trade: "Gym", icon: "trade-gym", fit: [0.85, 0.6, 0.55, 0.5, 0.3, 0.25] },
  { trade: "Grocery", icon: "trade-grocery", fit: [0.8, 0.6, 0.4, 0.55, 0.3, 0.25] },
  { trade: "Bar", icon: "trade-bar", fit: [0.35, 0.5, 0.9, 0.3, 0.6, 0.55] },
];
const winnerOf = (winners: FitWinner[], trade: string) =>
  winners.find((w) => w.trade === trade)?.district ?? "";

export default function Spine2ChartsAPage() {
  return (
    <div id="spine2-chartsa" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* ============ Matrix , country 06 ============ */}
        <section className="ch">
          <div className="chhead">
            <div className="hd">
              <span className="itile"><GlyphIcon id="licence-specific" size={24} /></span>
              <span className="chnum">06</span>
              <h2>Licences by trade</h2>
            </div>
          </div>
          <div className="panel pad">
            <Matrix
              cols={LICENCE_COLS}
              rows={LICENCE_ROWS}
              note={(slowCols) => (
                <>
                  Premises registration is universal and quick.{" "}
                  {joinAnd(slowCols.map((c) => c.toLowerCase()))}{" "}
                  {slowCols.length === 1 ? "is the slow one" : "are the slow ones"}, and they
                  gate exactly the trades that most want them.
                </>
              )}
            />
          </div>
        </section>

        {/* ============ ShrinkBars ramp , cell 04 ============ */}
        <section className="ch" style={{ marginTop: 44 }}>
          <div className="chhead">
            <div className="hd">
              <span className="itile"><GlyphIcon id="worked-example" size={24} /></span>
              <span className="chnum">04</span>
              <h2>Where a $38 bill goes</h2>
            </div>
          </div>
          <div className="panel pad-lg">
            <ShrinkBars
              start={BILL_START}
              stages={BILL_STAGES}
              variant="ramp"
              inBarFmt={money}
              note={(keptShare) => (
                <>
                  Bar widths are exactly the money.{" "}
                  {word(Math.round(keptShare * 100)).replace(/^./, (c) => c.toUpperCase())} cents
                  in the dollar is what reaches the owner.
                </>
              )}
            />
          </div>
        </section>

        {/* ============ ShrinkBars track , cell 12, corrected figures ============ */}
        <section className="ch" style={{ marginTop: 44 }}>
          <div className="chhead">
            <div className="hd">
              <span className="itile"><GlyphIcon id="myth-reality" size={24} /></span>
              <span className="chnum">12</span>
              <h2>Business survival, year by year</h2>
            </div>
          </div>
          <div className="grid g12">
            <div className="panel pad-lg">
              <div className="myth" style={{ marginBottom: 20 }}>
                <div className="lab" style={{ marginBottom: 12 }}>What everyone says</div>
                <p className="claim">Nine in ten restaurants fail.</p>
                <p className="fix">
                  In truth <b>{word(yearOneInTen)} in ten</b> are still trading a year in. The
                  closures come later, and quietly.
                </p>
              </div>
              <ShrinkBars
                start={100}
                stages={SURVIVAL}
                variant="track"
                firstBarFmt={(v) => `${v}% still trading`}
              />
            </div>
            <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
              <div className="lab" style={{ marginBottom: 12 }}>When they close, and why</div>
              <div className="late">
                <div className="l"><span className="i">Y1</span><span className="t">Ran out of cash<span>Not out of customers. The fit-out was funded and the first eight months were not.</span></span></div>
                <div className="l"><span className="i">Y3</span><span className="t">The review, or the founder<span>Rent resets upward, or the person working ninety hours stops being able to.</span></span></div>
                <div className="l"><span className="i">Y5</span><span className="t">Reinvestment nobody saved for<span>The kitchen is tired and the room looks it, and there is no money to put back.</span></span></div>
              </div>
              <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
                Each of these has a cash cause, and each one is visible a year before it happens.
              </p>
            </div>
          </div>
          <p className="note" style={{ marginTop: 12, fontSize: "11.5px" }}>
            Catalog note: the crop shows 74 / 52 / 41. The data layer corrected those survival
            readings to 94 / 64 / 39, so this render carries the true figures on the identical form.
          </p>
        </section>

        {/* ============ Tline , country 05 ============ */}
        <section className="ch" style={{ marginTop: 44 }}>
          <div className="chhead">
            <div className="hd">
              <span className="itile"><GlyphIcon id="register-cost" size={24} /></span>
              <span className="chnum">05</span>
              <h2>How long it takes to open</h2>
            </div>
          </div>
          <div className="grid g12" style={{ alignItems: "start" }}>
            <div className="panel pad">
              <div className="lab" style={{ marginBottom: 16 }}>
                From decision to first sale{" "}
                <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 400 }}>
                  weeks
                </span>
              </div>
              <Tline steps={OPENING_STEPS} spanWk={OPENING_SPAN_WK} ticks={OPENING_TICKS} />
            </div>
            <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--fig)", fontSize: 44, fontWeight: 600, lineHeight: 0.95, color: "var(--terra-deep)" }}>
                {openWk} weeks
              </div>
              <div style={{ fontSize: "13.5px", color: "var(--ink-2)", marginTop: 8, maxWidth: "26ch" }}>
                to a business that can actually take money, not the day the company exists
              </div>
              <Statblock
                style={{ marginTop: 18 }}
                header={{ label: "The honest timeline" }}
                rail={false}
                rows={[
                  { label: "Company registered", value: "1 day" },
                  { label: "Able to take money", value: `${openWk} wk`, answer: true },
                  { label: "Total cash to set up", value: "$240" },
                ]}
              />
              <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
                The company is quick and nearly free. <b>The bank account is what sets your opening
                date</b>, and it is slower for a founder without local history.
              </p>
            </div>
          </div>
        </section>

        {/* ============ Fitgrid , city 09 ============ */}
        <section className="ch" style={{ marginTop: 44 }}>
          <div className="chhead">
            <div className="hd">
              <span className="itile"><GlyphIcon id="best-areas" size={24} /></span>
              <span className="chnum">09</span>
              <h2>Best area for each trade</h2>
            </div>
          </div>
          <div className="panel pad">
            <Fitgrid
              districts={DISTRICTS}
              rows={FIT_ROWS}
              lead={(winners) => (
                <>
                  <b>
                    Restaurants belong in {winnerOf(winners, "Restaurant")}, salons in{" "}
                    {winnerOf(winners, "Hair salon")}.
                  </b>{" "}
                  The terracotta dot is the district that fits each trade best, weighing its rent
                  against the customers who pass.
                </>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
