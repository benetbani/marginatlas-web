/**
 * /dev/home3 , the home page.
 *
 * A REVIEW ARTIFACT at a dev route. Nothing links to it. The live home page is
 * untouched.
 *
 * WHY IT EXISTS. `PRODUCT.md` principle 7 says "above the fold: the headline
 * number and one sentence of context". The live page opens with a rotating
 * question and a search form, first figure one section down.
 *
 * WHAT THE SECOND PASS CHANGED, and it is the important part. The first version
 * was correct and too heavy: seven sections, three of them the same shape, a
 * figure over a two column grid over a paragraph. Correct is not the bar for a
 * front door. It read as a report.
 *
 * EIGHT SECTIONS AND NO TWO OF THEM THE SAME FORM:
 *
 *   1 answer      hero, one figure           the proof
 *   2 find        a control, not prose       the reader who knows what they want
 *   3 spread      a chart                    the only chart on the page
 *   4 places      a scannable grid           the only place it feels like an atlas
 *   5 myth        struck claim, editorial    the only section with a voice
 *   6 what        a short list               the only section about the product
 *   7 coverage    three counts               the only section admitting what is thin
 *   8 next        links                      the exit
 *
 * CUT: a standalone "1 in 4 pay their owner properly" block. It was a third
 * figure-and-paragraph section and the fact belongs in the hero copy, which is
 * where it now sits.
 *
 * THE NUMBERS ARE REAL. Every figure comes from data/cells/restaurants-in-london
 * .json or from the same city file that builds /cities/[slug]. The constraint
 * that shapes this page: exactly one cell has been reconciled, so there is
 * exactly one worked example to show.
 */
import * as React from "react";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { Range } from "@/components/spine2/Range";
import { frontPageFigures } from "@/lib/home/front_page_figures";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Home , proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/* Money in the page's own register, matching the city adapter so the home page
   and the page it links to can never print one figure two ways. */
function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 10_000) return `$${Math.round(v / 1_000)}K`;
  if (a >= 1_000) return `$${(v / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `$${Math.round(v)}`;
}

export default function HomeProposal() {
  const {
    roomRevenue,
    roomSqm,
    medianRevenue,
    keeps,
    keepsHi,
    p25,
    p75,
    skewNote,
    myth,
    paidProperly,
    roomTier,
    takeMoreThanRoom,
    countries,
    cities,
    reconciled,
    places,
    survival,
  } = frontPageFigures();

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
            <nav className="lat" aria-label="Sections">
              <a href="#find">Find yours</a>
              <span className="s">&rsaquo;</span>
              <a href="#places">Places</a>
              <span className="s">&rsaquo;</span>
              <a href="#coverage">Coverage</a>
            </nav>
          </div>
        </header>

        {/* 1 , THE ANSWER. A stranger reads one true, complete, qualified answer
            before being asked for anything. The room is NAMED: an unqualified
            "a restaurant in London" reads as the typical one, and this is not
            it, which the data file says of itself. */}
        <section id="answer" className="glass rise" style={{ padding: "32px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <div className="crumb">
                <span>Restaurants</span>
                <span className="d" />
                <span>London</span>
              </div>

              <h1 style={{ marginTop: 16, maxWidth: "20ch" }}>
                A {roomSqm} square metre London restaurant takes{" "}
                {money(roomRevenue)} a year.
              </h1>

              <div className="answer" style={{ marginTop: 32 }}>
                <div className="num fig" style={{ fontSize: "clamp(42px,5.6vw,62px)" }}>
                  {money(keeps)}
                </div>
                <div className="l">is what the owner keeps</div>
              </div>

              <p className="k" style={{ margin: "18px 0 0", maxWidth: "46ch" }}>
                That gap is the business, and it is the number nobody publishes.
                About one in {Math.round(100 / paidProperly)} London restaurants
                pay their owner properly for the hours the job takes. Most of the rest did not
                know that before they signed the lease.
              </p>
            </div>

            <div className="panel pad">
              <div className="statblock">
                <div className="hd">
                  <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                  The same room, read four ways
                </div>
                <div className="row">
                  <span className="nm">
                    Takes a year
                    <span className="s">this room, {roomSqm} sqm</span>
                  </span>
                  <span className="v">{money(roomRevenue)}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Owner keeps
                    <span className="s">on the conservative read</span>
                  </span>
                  <span className="v">{money(keeps)}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Generous read
                    <span className="s">costs at their lowest</span>
                  </span>
                  <span className="v">{money(keepsHi)}</span>
                </div>
                {/* The qualifier, not a fourth figure about money. Without it a
                    reader takes this room for the typical one. */}
                <div className="row">
                  <span className="nm">
                    Restaurants taking more
                    <span className="s">not the typical room</span>
                  </span>
                  <span className="v">{takeMoreThanRoom}%</span>
                </div>
                <p className="k" style={{ margin: "10px 0 0" }}>
                  {roomTier}. Every figure on this site says which route it came
                  down.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2 , FIND YOURS. A control, deliberately not another block of prose,
            and deliberately second: a reader who already knows what they want
            should not have to scroll past the argument to leave. */}
        <section id="find" className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="grid g12" style={{ gap: 24, alignItems: "center" }}>
            <div className="setter">
              <span className="lab">Trade</span>
              <span className="v">Restaurants</span>
              <span className="lab">Place</span>
              <span className="v">London</span>
              <a className="chip chip-a" href="/gb/london/restaurants">
                Open this page
              </a>
            </div>
            <p className="k" style={{ margin: 0, maxWidth: "40ch" }}>
              Pick a trade and a place. Where the figures are thin the page says
              so rather than guessing.
            </p>
          </div>
        </section>

        {/* 3 , THE SPREAD. The only chart on the page, and it earns the slot by
            answering the next thought a sceptic has: is that typical, or did
            you show me the good one. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Whether that room is typical
          </div>
          <div className="grid g12" style={{ gap: 32, alignItems: "start" }}>
            <div>
              {/* Two rows on one axis: the room above, placed on the whole
                  trade's distribution, so a reader can see where it sits rather
                  than take the claim on trust. The room row is a marker with no
                  band, the component's degenerate case, because one modelled
                  scenario has no quartiles and inventing it two ends would be a
                  fabrication.

                  Log scale: the distribution is right-skewed and a linear axis
                  crushes three quarters of the trade into the left fifth of the
                  rail. fmt is the same money() the rows print with, so the axis
                  and the figures cannot disagree. */}
              <Range
                rows={[
                  {
                    label: "Middle restaurant",
                    lo: p25,
                    mid: medianRevenue,
                    hi: p75,
                    display: money(medianRevenue),
                  },
                  {
                    label: "This room",
                    lo: null,
                    mid: roomRevenue,
                    hi: null,
                    display: money(roomRevenue),
                  },
                ]}
                domain={[p25 * 0.8, p75 * 1.15]}
                scale="log"
                ticks={[200_000, 400_000, 800_000]}
                fmt={money}
              />
            </div>
            <p className="k" style={{ margin: 0, maxWidth: "50ch" }}>
              The middle restaurant takes {money(medianRevenue)}, so the room
              above is a good one and not a typical one. The quarter above the
              middle takes {money(p75)}; the quarter below takes {money(p25)}.
              Close to six times between one restaurant and another in the same
              city, which is why an average is the wrong thing to publish.
              <br />
              <br />
              {skewNote}
            </p>
          </div>
        </section>

        {/* 4 , PLACES. The only section that is scannable rather than read, and
            the only one where the lattice is visible as a lattice. Every name
            is a route that exists, taken from the same file that builds it. */}
        <section id="places" className="panel pad rise" style={{ marginTop: 18 }}>
          {/* The first label here failed the trivia gate as a count-of-things,
              correctly: it described the site rather than helping anyone decide
              anything. A navigational prompt does the same job and is not about
              us. Note the gate reads the file, not the rendered output, so a
              comment quoting the banned phrase fails it too. */}
          <div className="lab" style={{ marginBottom: 14 }}>
            Start with a city
          </div>
          {/* Chips, not .tiles. A three column tile grid put 25 cities in nine
              rows and 500px of a front page, and .tiles a .g is the figure
              face, so the place names rendered as tabular numerals. A wrapped
              run of chips is three lines and reads as an index, which is what
              this is. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {places.map((c) => (
              <a key={c.slug} className="chip chip-place" href={`/cities/${c.slug}`}>
                {c.name}
              </a>
            ))}
          </div>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            And {cities - places.length} more, across {countries} countries.
            Every one has a page whatever the data behind it, because a page
            that disappears where the figures are thin teaches a reader that
            some places do not count.
          </p>
        </section>

        {/* 5 , THE MYTH. The only section with a voice rather than a figure, and
            the only one that argues with the reader. Self-omits when the cell
            carries no myth, because a claim with no correction is worse than
            no section. */}
        {myth && survival ? (
          <section className="panel pad rise" style={{ marginTop: 18 }}>
            <div className="lab" style={{ marginBottom: 12 }}>
              What everyone says
            </div>
            <p
              className="claim"
              style={{
                fontSize: "clamp(20px,2.5vw,27px)",
                fontWeight: 600,
                letterSpacing: "-.02em",
                lineHeight: 1.2,
                color: "var(--muted)",
                margin: 0,
                maxWidth: "24ch",
                textDecoration: "line-through",
                textDecorationColor: "var(--terra)",
                textDecorationThickness: 2,
              }}
            >
              {myth.claim}
            </p>

            {/* The correction as two figures, not two sentences. A reader takes
                "94 still trading at one year, 39 at five" in a glance and would
                not have read the paragraph it replaced. */}
            <div
              style={{ display: "flex", gap: 48, flexWrap: "wrap", margin: "26px 0 0" }}
            >
              <div className="answer">
                <div className="num fig" style={{ fontSize: "clamp(34px,4.2vw,46px)" }}>
                  {Math.round(survival.year1)}%
                </div>
                <div className="l">still trading after a year</div>
              </div>
              <div className="answer">
                <div className="num fig" style={{ fontSize: "clamp(34px,4.2vw,46px)", color: "var(--n1)" }}>
                  {Math.round(survival.year5)}%
                </div>
                <div className="l">still trading after five</div>
              </div>
            </div>

            <p className="k" style={{ margin: "20px 0 0", maxWidth: "50ch" }}>
              The first year is survivable. The fifth is where the trade thins,
              and that is the part nobody warns anyone about.
            </p>
          </section>
        ) : null}

        {/* 6 , WHAT A PAGE GIVES YOU. The only section about the product rather
            than about a number. Three lines, not three identical cards. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            What a page gives you
          </div>
          <div className="statblock">
            <div className="row">
              <span className="nm">
                What the business takes, and what the owner keeps
                <span className="s">the second one is the point</span>
              </span>
            </div>
            <div className="row">
              <span className="nm">
                The spread, not an average
                <span className="s">where you would land, not where the middle is</span>
              </span>
            </div>
            <div className="row">
              <span className="nm">
                Where every figure came from
                <span className="s">stated on the figure, not in a footnote</span>
              </span>
            </div>
          </div>
        </section>

        {/* 7 , COVERAGE. The only section that admits what is thin, which is
            the claim no competitor makes. */}
        <section id="coverage" className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            What is actually covered
          </div>
          <div className="statblock">
            <div className="row">
              <span className="nm">
                Countries with a page
                <span className="s">every one, whatever the data behind it</span>
              </span>
              <span className="v">{countries}</span>
            </div>
            <div className="row">
              <span className="nm">
                Cities with a page
                <span className="s">and a neighbourhood level beneath them</span>
              </span>
              <span className="v">{cities}</span>
            </div>
            <div className="row">
              <span className="nm">
                Places with figures reconciled line by line
                <span className="s">restaurants in London</span>
              </span>
              <span className="v">{reconciled}</span>
            </div>
          </div>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "60ch" }}>
            Most pages carry a figure built from published inputs rather than
            observed in that exact place, and every one says which. Saying so is
            the product. A site that hid it would read better and be worth less.
          </p>
        </section>

        {/* 8 , THE EXIT. Ported from the mockups' own .close block: hairline
            rows, a figure-face glyph on the right, terracotta on hover. An
            earlier version hand-rolled a statblock here and rendered three
            links as plain body text with no affordance at all. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Where to go from here
          </div>
          <div className="close">
            <div className="links">
              <a href="/gb/london/restaurants">
                The worked example in full
                <span className="g">{money(roomRevenue)}</span>
              </a>
              <a href="/cities">
                Every city with a page
                <span className="g">{cities}</span>
              </a>
              <a href="/countries">
                Every country with a page
                <span className="g">{countries}</span>
              </a>
            </div>
            <p className="k" style={{ margin: 0, maxWidth: "50ch" }}>
              <b>Measured</b> is counted in that exact place.{" "}
              <b>Built from published inputs</b> is arithmetic on figures that
              were published, shown so it can be checked. <b>Thin</b> means the
              shape is right and the level is not certain. The tier says which
              route a figure came down; it does not certify the figure is right.
            </p>
          </div>
        </section>

        <footer style={{ padding: "40px 0 24px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
