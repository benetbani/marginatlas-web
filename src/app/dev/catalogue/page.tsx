/**
 * /dev/catalogue , the ten drawings, for one ruling.
 *
 * WHY THIS PAGE EXISTS. The founder rejected the visual execution of three
 * pages on 2026-08-07 and named the reason himself: "it is impossible to
 * babyhand everything and tell you, you should draw this thing on this part."
 * He is right, and judging forty section instances one at a time is the machine
 * that produced that sentence.
 *
 * So he judges SHAPES, once. Ten of them, on one scroll. Keep, kill or fix each
 * one. After that a gate refuses any subsection that is not a survivor, and he
 * never rules on the same shape twice.
 *
 * NOTHING HERE IS INVENTED, and that is the point rather than a caveat. The
 * measured cause of the rejection was not a shortage of drawings: the kit holds
 * 46 components and 220 glyphs, and the three rejected pages used `Statblock`
 * 17 times, 27 glyphs, and on two of the pages a single icon size. The
 * vocabulary was already his. It was not reached for.
 *
 * EVERY SHAPE IS SHOWN TWICE, once with a dollar figure and once with an
 * Indonesian rupiah figure. `Rp 9.500.000` is roughly twice the length of
 * `$618K`, and a drawing whose label column was tuned to a dollar breaks on a
 * rupiah. Ten currencies are coming; a shape that cannot hold the long one is
 * not a survivor, and finding that out now costs a scroll rather than a
 * redraw of every page.
 *
 * THE NUMBERS ARE ILLUSTRATIVE AND THAT IS FINE HERE. This is a dev route, it
 * is noindex, and the question on this page is the SHAPE. Where a figure is
 * invented it is the mockup's own, and no shape on this page is ever fed real
 * data by a shipping route without going through its page adapter first.
 */
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { Fig } from "@/components/spine2/Fig";
import { Hundred } from "@/components/spine2/Hundred";
import { UnitGrid } from "@/components/spine2/UnitGrid";
import { SBar } from "@/components/spine2/SBar";
import { Range } from "@/components/spine2/Range";
import { MonthDeviation } from "@/components/spine2/MonthDeviation";
import { RankBarsV2 } from "@/components/spine2/RankBarsV2";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "The ten drawings , one ruling , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/* The two figures every shape is tested against. The rupiah one is the whole
   reason this page shows each drawing twice. */
const USD = { rev: "$618K", keep: "$43K", unit: "$38" };
const IDR = { rev: "Rp 9.500.000.000", keep: "Rp 660.000.000", unit: "Rp 580.000" };

/**
 * One catalogue entry. The verdict box is not decoration: it is the thing he
 * fills in, and putting the shape's name and number beside it is what makes a
 * one-line reply ("3 kill, 7 fix wider") unambiguous.
 */
function Shape({
  n,
  name,
  encodes,
  where,
  usd,
  idr,
  note,
}: {
  n: number;
  name: string;
  encodes: string;
  where: string;
  usd: React.ReactNode;
  idr: React.ReactNode;
  note?: string;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: 26, fontWeight: 600, color: "var(--terra)" }}>
          {String(n).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>
        Encodes {encodes}. Used for {where}.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px 32px",
          alignItems: "start",
        }}
      >
        <div>
          <div className="lab" style={{ marginBottom: 10 }}>Dollar</div>
          {usd}
        </div>
        <div>
          <div className="lab" style={{ marginBottom: 10 }}>Rupiah, the long figure</div>
          {idr}
        </div>
      </div>

      {note ? (
        <p className="k" style={{ margin: "16px 0 0", maxWidth: "64ch" }}>
          {note}
        </p>
      ) : null}

      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid var(--hair)",
          fontSize: 12,
          color: "var(--faint)",
        }}
      >
        {String(n).padStart(2, "0")} , keep / kill / fix
      </div>
    </section>
  );
}

export default function CataloguePage() {
  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Where you are">
              <a href="/">Home</a>
              <span className="s">&rsaquo;</span>
              <span>The ten drawings</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "20ch" }}>Ten drawings. One ruling.</h1>
          <p className="k" style={{ margin: "16px 0 0", maxWidth: "58ch" }}>
            Every subsection on every page will have to be one of these. Kill the
            ones you do not want and they never appear again.
          </p>
          <div className="panel pad" style={{ marginTop: 20 }}>
            <div className="statblock">
              <div className="hd">
                <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                Why the pages read like reports
              </div>
              <div className="row">
                <span className="nm">
                  Drawings in the kit
                  <span className="s">already built, already yours</span>
                </span>
                <span className="v">46</span>
              </div>
              <div className="row">
                <span className="nm">
                  Times the label-value list was used
                  <span className="s">next highest was three</span>
                </span>
                <span className="v">17</span>
              </div>
              <div className="row">
                <span className="nm">
                  Icons drawn, and never used
                  <span className="s">220 exist, 27 were used</span>
                </span>
                <span className="v">193</span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 , the one he already approved. It leads because it is the bar. */}
        <Shape
          n={1}
          name="Spend walk"
          encodes="a sequence of subtractions from one unit of money"
          where="where a bill goes"
          note="You approved this one on the cell page. It is the bar the other nine are held to: the drawing carries the meaning, each number sits on the thing it describes, and it needs no paragraph."
          usd={
            <SBar
              segments={[
                { label: "A guest spends", value: 38, display: USD.unit, tone: "n5" },
                { label: "After food and staff", value: 13, display: "$13", tone: "n3" },
                { label: "After running costs", value: 7.6, display: "$7.60", tone: "n2" },
                { label: "Yours", value: 2.66, display: "$2.66", tone: "terra" },
              ]}
              total={38}
            />
          }
          idr={
            <SBar
              segments={[
                { label: "A guest spends", value: 38, display: IDR.unit, tone: "n5" },
                { label: "After food and staff", value: 13, display: "Rp 198.000", tone: "n3" },
                { label: "After running costs", value: 7.6, display: "Rp 116.000", tone: "n2" },
                { label: "Yours", value: 2.66, display: "Rp 40.600", tone: "terra" },
              ]}
              total={38}
            />
          }
        />

        {/* 02 */}
        <Shape
          n={2}
          name="Proportional stack"
          encodes="parts of a hundred, heights exactly the money"
          where="where every hundred goes"
          note="Replaces the three side-by-side tables on the trade page, where the label sat on one edge and the figure on the other and the eye had to travel."
          usd={
            <SBar
              segments={[
                { label: "Staff", value: 34, display: "34%", tone: "ink" },
                { label: "Food and drink", value: 31, display: "31%", tone: "n2" },
                { label: "Running costs", value: 15, display: "15%", tone: "n3" },
                { label: "Rent and rates", value: 13, display: "13%", tone: "n4" },
                { label: "You keep", value: 7, display: "7%", tone: "terra" },
              ]}
              total={100}
            />
          }
          idr={
            <SBar
              segments={[
                { label: "Staff", value: 34, display: "Rp 3.230.000.000", tone: "ink" },
                { label: "Food and drink", value: 31, display: "Rp 2.945.000.000", tone: "n2" },
                { label: "Running costs", value: 15, display: "Rp 1.425.000.000", tone: "n3" },
                { label: "Rent and rates", value: 13, display: "Rp 1.235.000.000", tone: "n4" },
                { label: "You keep", value: 7, display: "Rp 665.000.000", tone: "terra" },
              ]}
              total={100}
            />
          }
        />

        {/* 03 , his own fix, drawn. */}
        <Shape
          n={3}
          name="Month strip"
          encodes="one value across a year, above and below a baseline"
          where="through the year"
          note="Your fix, drawn. Twelve narrow bars instead of the wide ones, so the peaks and the troughs are visible without reading a single label."
          usd={
            <MonthDeviation
              months={[-18, -22, -8, 4, 11, 19, 26, 24, 9, -3, -12, 14]}
              mode="deviation"
              header={{ title: "Against the average month", sub: "per cent" }}
            />
          }
          idr={
            <MonthDeviation
              months={[-18, -22, -8, 4, 11, 19, 26, 24, 9, -3, -12, 14]}
              mode="deviation"
              header={{ title: "Against the average month", sub: "the shape does not change with the currency" }}
            />
          }
        />

        {/* 04 */}
        <Shape
          n={4}
          name="Single answer"
          encodes="the one number a page exists to give"
          where="the hero"
          note="The hero states the answer and stops. Both sentences you called catastrophic were methodology sitting where this should be."
          usd={
            <div>
              <Fig className="v" value={USD.keep} answer />
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                is what the owner keeps
              </div>
            </div>
          }
          idr={
            <div>
              <Fig className="v" value={IDR.keep} answer />
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
                is what the owner keeps
              </div>
            </div>
          }
        />

        {/* 05 */}
        <Shape
          n={5}
          name="Ranked bars, label on the bar"
          encodes="a few items, ordered, with the figure on the bar itself"
          where="where it pays best, what it costs to open"
          note="The label and the figure sit on the same object. Nothing to scan across."
          usd={
            <RankBarsV2
              rows={[
                { id: "a", label: "Fit-out and kitchen", value: 223000, display: "$223K" },
                { id: "b", label: "Deposit and first rent", value: 29000, display: "$29K" },
                { id: "c", label: "Opening stock", value: 18000, display: "$18K" },
                { id: "d", label: "Registration and insurance", value: 9000, display: "$9K" },
              ]}
              total={{ label: "Cash before the doors open", value: 279000, display: "$279K" }}
            />
          }
          idr={
            <RankBarsV2
              rows={[
                { id: "a", label: "Fit-out and kitchen", value: 223000, display: "Rp 3.430.000.000" },
                { id: "b", label: "Deposit and first rent", value: 29000, display: "Rp 446.000.000" },
                { id: "c", label: "Opening stock", value: 18000, display: "Rp 277.000.000" },
                { id: "d", label: "Registration and insurance", value: 9000, display: "Rp 138.000.000" },
              ]}
              total={{ label: "Cash before the doors open", value: 279000, display: "Rp 4.290.000.000" }}
            />
          }
        />

        {/* 06 */}
        <Shape
          n={6}
          name="Unit grid"
          encodes="a proportion of a population, one mark per business"
          where="what owners actually keep"
          note="A hundred marks. The reader counts nothing and understands immediately, which is the opposite of the three-number list this replaces."
          usd={
            <UnitGrid
              total={100}
              layout="blocks"
              groups={[
                { count: 25, tone: "terra", label: { big: "25", small: "pay the owner properly" } },
                { count: 29, tone: "neutral", label: { big: "29", small: "pay something, less" } },
                { count: 46, tone: "faint", label: { big: "46", small: "pay nothing at all" } },
              ]}
            />
          }
          idr={
            <UnitGrid
              total={100}
              layout="blocks"
              groups={[
                { count: 25, tone: "terra", label: { big: "25", small: "pay the owner properly" } },
                { count: 29, tone: "neutral", label: { big: "29", small: "pay something, less" } },
                { count: 46, tone: "faint", label: { big: "46", small: "pay nothing at all" } },
              ]}
            />
          }
        />

        {/* 07 */}
        <Shape
          n={7}
          name="Range band"
          encodes="one value inside the spread it belongs to"
          where="quartiles, is this room typical"
          note="Shows the room against the trade without a second chart and without a sentence explaining the percentile."
          usd={
            <Range
              rows={[
                { label: "This room", lo: 189000, mid: 618000, hi: 1100000, display: "$618K" },
                { label: "Typical room", lo: 189000, mid: 414000, hi: 1100000, display: "$414K" },
              ]}
              domain={[150000, 1200000]}
              ticks={[200000, 400000, 800000]}
              fmt={(n) => `$${Math.round(n / 1000)}K`}
            />
          }
          idr={
            <Range
              rows={[
                { label: "This room", lo: 189000, mid: 618000, hi: 1100000, display: "Rp 9,5 mld" },
                { label: "Typical room", lo: 189000, mid: 414000, hi: 1100000, display: "Rp 6,4 mld" },
              ]}
              domain={[150000, 1200000]}
              ticks={[200000, 400000, 800000]}
              fmt={(n) => `Rp ${(n / 65).toFixed(0)}jt`}
            />
          }
        />

        {/* 08 */}
        <Shape
          n={8}
          name="Hundred, grouped"
          encodes="a split of a hundred where the groups are the point"
          where="survival, who keeps what"
          note="Same family as the unit grid, read as three blocks rather than a hundred marks. Use where the groups matter more than the count."
          usd={
            <Hundred
              total={100}
              groups={[
                { kind: "over", count: 39, label: "still trading at five years" },
                { kind: "mid", count: 55, label: "traded, then closed" },
                { kind: "none", count: 6, label: "never opened" },
              ]}
              caption="Each mark is one business that opened."
            />
          }
          idr={
            <Hundred
              total={100}
              groups={[
                { kind: "over", count: 39, label: "still trading at five years" },
                { kind: "mid", count: 55, label: "traded, then closed" },
                { kind: "none", count: 6, label: "never opened" },
              ]}
              caption="Currency does not touch this one."
            />
          }
        />

        {/* 09 */}
        <Shape
          n={9}
          name="Two-way compare"
          encodes="this against that, on one axis"
          where="against its neighbours"
          note="Replaces the trade page's list of sector siblings, which was a column of numbers with no shared axis to read them against."
          usd={
            <RankBarsV2
              rows={[
                { id: "s", label: "Restaurants, this trade", value: 7, display: "7%" },
                { id: "a", label: "Food trucks", value: 12, display: "12%" },
                { id: "b", label: "Cafes", value: 9, display: "9%" },
                { id: "c", label: "Bars", value: 7, display: "7%" },
                { id: "d", label: "Sit-down restaurants", value: 5, display: "5%" },
              ]}
              total={{ label: "Best in the sector", value: 12, display: "12%" }}
            />
          }
          idr={
            <RankBarsV2
              rows={[
                { id: "s", label: "Restaurants, this trade", value: 7, display: "7%" },
                { id: "a", label: "Food trucks", value: 12, display: "12%" },
                { id: "b", label: "Cafes", value: 9, display: "9%" },
                { id: "c", label: "Bars", value: 7, display: "7%" },
                { id: "d", label: "Sit-down restaurants", value: 5, display: "5%" },
              ]}
              total={{ label: "Best in the sector", value: 12, display: "12%" }}
            />
          }
        />

        {/* 10 , the ledger, and the only survivor of the shape that caused the
            rejection. Capped at four rows so it can never become the default
            again. */}
        <Shape
          n={10}
          name="Short ledger, four rows maximum"
          encodes="a handful of facts that genuinely are a list"
          where="a scorecard, never an answer"
          note="This is the shape you called disgusting, kept on a leash. Four rows, never more, and never where a drawing would do. It was used seventeen times across three pages and that is what made them read like reports."
          usd={
            <div className="statblock">
              <div className="hd">
                <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                London, restaurants
              </div>
              <div className="row">
                <span className="nm">Rooms trading<span className="s">counted there</span></span>
                <span className="v">16,765</span>
              </div>
              <div className="row">
                <span className="nm">Typical takings<span className="s">a year</span></span>
                <span className="v">$414K</span>
              </div>
              <div className="row">
                <span className="nm">Reconciled<span className="s">line by line</span></span>
                <span className="v">1</span>
              </div>
            </div>
          }
          idr={
            <div className="statblock">
              <div className="hd">
                <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                Jakarta, restaurants
              </div>
              <div className="row">
                <span className="nm">Rooms trading<span className="s">counted there</span></span>
                <span className="v">21,400</span>
              </div>
              <div className="row">
                <span className="nm">Typical takings<span className="s">a year</span></span>
                <span className="v">Rp 6,4 mld</span>
              </div>
              <div className="row">
                <span className="nm">Reconciled<span className="s">line by line</span></span>
                <span className="v">0</span>
              </div>
            </div>
          }
        />

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            How to reply
          </div>
          <p className="k" style={{ margin: 0, maxWidth: "60ch" }}>
            One line. Numbers and a word each, for example: 3 keep, 7 fix wider,
            10 kill. Anything you do not mention is kept.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
