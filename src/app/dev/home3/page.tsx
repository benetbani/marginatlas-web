/**
 * /dev/home3 , the home page rebuilt to the v2 system.
 *
 * A REVIEW ARTIFACT. It renders at a dev route and nothing links to it. The live
 * home page is untouched. The founder designs; this is a proposal he can look at.
 *
 * WHY IT EXISTS. Research on 2026-08-03 found that PRODUCT.md already specifies
 * this page and the live one disobeys: strategic principle 7 says "above the
 * fold: the headline number and one sentence of context", and the live page
 * opens with a rotating question and a search form, first figure one section
 * down.
 *
 * The competitive read said the same thing from the other side. Levels.fyi
 * answers the identical question shape, what does X earn at Y, and shows no
 * figure above the fold at all. Our World in Data shares the ethos and renders
 * real data before asking for anything. So answer-first is both what the
 * doctrine demands and the position the nearest competitor has left open.
 *
 * WHAT IS DELIBERATELY ABSENT, each named in PRODUCT.md's own anti-references:
 * the "#1 atlas" superlative, the rotating headline, hero video, glassmorphism,
 * an identical three-card grid, a stat-tile row, a logo wall, a testimonial.
 *
 * THE NUMBERS ARE REAL. Every figure comes from data/cells/restaurants-in-london
 * .json, the one reconciled cell that exists today, and each carries the tier its
 * own file states. That is also the constraint: a second worked example needs a
 * second reconciled cell.
 */
import * as React from "react";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { Myth } from "@/components/spine2/Myth";
import { Range } from "@/components/spine2/Range";
import type { GlyphId } from "@/components/spine2/glyphs";
import { frontPageFigures } from "@/lib/home/front_page_figures";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Home , proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/* Money in the page's own register. Matches the city adapter so the home page
   and the page it links to can never print one figure two ways. */
function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 10_000) return `$${Math.round(v / 1_000)}K`;
  if (a >= 1_000) return `$${(v / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `$${Math.round(v)}`;
}

/* Myth's contract: the <b> in `fix` is the accent carrier, and terracotta
   marks the answer once per chapter. The correction's punch is its last clause,
   so that clause is the <b>. Falls back to the plain string when the sentence
   has no colon, rather than guessing at a split point. */
function emphasiseLastClause(text: string): React.ReactNode {
  const i = text.lastIndexOf(": ");
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i + 2)}
      <b>{text.slice(i + 2)}</b>
    </>
  );
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
  } = frontPageFigures();

  return (
    <div className="av2">
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Sections">
              <a href="#answer">The answer</a>
              <span className="s">&rsaquo;</span>
              <a href="#find">Find yours</a>
            </nav>
          </div>
        </header>

        {/* 1 , THE WORKED ANSWER. The whole bet: a stranger reads one true,
            complete, qualified answer before being asked for anything. */}
        <section id="answer" className="glass rise" style={{ padding: "32px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <div className="crumb">
                <span>Restaurants</span>
                <span className="d" />
                <span>London</span>
              </div>

              {/* THE ROOM IS NAMED. An unqualified "a restaurant in London"
                  reads as the typical one, and this is not it: the file says
                  so itself. Naming the room is what makes the keeps figure
                  beneath it true rather than merely accurate. */}
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

              <p className="k" style={{ margin: "18px 0 0", maxWidth: "48ch" }}>
                That gap is the business. Revenue is what crosses the till;
                what an owner keeps is what is left after rent, staff, stock and
                the state. This site publishes the second number, for every
                trade and place it can.
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
                {/* The fourth row is the qualifier, not a fourth figure about
                    money. Without it a reader takes this room for the typical
                    one, which is the failure the whole page is arguing against. */}
                <div className="row">
                  <span className="nm">
                    Restaurants taking more
                    <span className="s">this is not the typical room</span>
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


        {/* 2 , THE SPREAD. Directly after the answer, because "is that typical
            or did you show me the good one" is the next thought a sceptical
            reader has, and answering it unprompted is the whole posture. */}
        <section className="panel rise" style={{ marginTop: 18 }}>
          <div className="pad">
            <div className="lab" style={{ marginBottom: 12 }}>
              Whether that room is typical
            </div>
            <div className="grid g12" style={{ gap: 32, alignItems: "start" }}>
              <div>
                {/* Two rows on one axis, which is the point: the room from the
                    section above, placed on the distribution of the whole
                    trade, so a reader can see where it sits rather than take
                    the claim on trust. The room row is a marker with no band,
                    the component's degenerate case, because a single modelled
                    scenario has no quartiles of its own and inventing it two
                    ends would be a fabrication.

                    Log scale: the distribution is right-skewed, and a linear
                    axis crushes three quarters of the trade into the left
                    fifth of the rail. fmt is the same money() the row display
                    uses, so the axis and the figures cannot disagree. */}
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
              <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
                The middle restaurant in London takes {money(medianRevenue)}, so
                the room above is a good one, not a typical one. The quarter of
                the trade above the middle takes {money(p75)}; the quarter below
                takes {money(p25)}. That is close to six times between one
                restaurant and another in the same city, which is why a single
                average is the wrong thing to publish and why this site
                publishes the spread instead.
                <br />
                <br />
                {skewNote}
              </p>
            </div>
          </div>
        </section>

        {/* 3 , THE LINE THAT IS THE ARGUMENT. One number, alone, because it is
            the sentence the whole product exists to be able to say. */}
        <section className="panel rise" style={{ marginTop: 18 }}>
          <div className="pad">
            <div className="lab" style={{ marginBottom: 12 }}>
              What that means for the person opening one
            </div>
            <div className="grid g12" style={{ gap: 32, alignItems: "start" }}>
              <div className="answer">
                {/* A figure, not the phrase "1 in 4". The slot is tabular-nums
                    by system rule, which is right for digits and reads
                    mechanically for words. The denominator lives in the label
                    where it belongs. */}
                <div className="num fig" style={{ fontSize: "clamp(34px,4.4vw,48px)" }}>
                  {paidProperly}%
                </div>
                <div className="l">
                  of London restaurants pay their owner properly
                </div>
              </div>
              <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
                Properly means an owner draw of about twice the London average
                wage, for the hours the job actually takes. The other three in
                four are buying themselves a job at a discount, and most of them
                did not know that before they signed the lease.
                <br />
                <br />
                No public register measures owner pay at this grain. This is a
                modelled figure and it says so, which is the point: a number that
                cannot show its working does not belong on the page.
              </p>
            </div>
          </div>
        </section>

        {/* 4 , THE NAVIGATOR. Below the proof, not in place of it. */}
        <section id="find" className="panel rise" style={{ marginTop: 18 }}>
          <div className="pad">
            <div className="lab" style={{ marginBottom: 12 }}>
              Find yours
            </div>
            <div className="grid g12" style={{ gap: 22, alignItems: "center" }}>
              <p className="k" style={{ margin: 0, maxWidth: "46ch" }}>
                Pick a trade and a place. Where the figures are thin the page
                says so rather than guessing, and it still shows you the shape of
                the thing.
              </p>
              <div className="setter">
                <span className="lab">Trade</span>
                <span className="v">Restaurants</span>
                <span className="lab">Place</span>
                <span className="v">London</span>
                <a className="chip chip-a" href="/gb/london/restaurants">
                  Open this page
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5 , THE MYTH. The research spine had "how the numbers are made"
            here. This is a SUBSTITUTION and it needs a verdict: showing a
            widely repeated claim being corrected demonstrates the method far
            better than describing the method does, and myth-debunking is
            already a stated part of the product. The tier vocabulary that
            section 6 would have carried is stated on the answer panel and
            again below. Self-omits when the cell carries no myth. */}
        {myth ? (
          <section className="panel rise" style={{ marginTop: 18 }}>
            <div className="pad">
              <Myth
                claim={myth.claim}
                fix={emphasiseLastClause(myth.reality)}
                note="That claim traces back to a television advertisement, not a study. It is repeated so often that people sign leases believing it, and it is wrong in both directions: the first year is survivable, the fifth is where the trade actually thins."
              />
            </div>
          </section>
        ) : null}

        {/* 6 , COVERAGE, HONESTLY. Including where it is thin, because that is
            the claim nobody else makes. */}
        <section className="panel rise" style={{ marginTop: 18 }}>
          <div className="pad">
            <div className="lab" style={{ marginBottom: 12 }}>
              What is actually covered
            </div>
            {/* A bare .row does not space its halves. Outside a statblock the
                three parts render hard against each other and this section
                first read "Londonmeasured16,765". Same defect the district map
                header had. The statblock is the row's home. */}
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
            <p className="k" style={{ margin: "12px 0 0", maxWidth: "62ch" }}>
              Most pages carry a figure built from published inputs rather than
              observed in that exact place, and every one of them says which.
              Saying so is the product. A site that hid it would read better and
              be worth less.
            </p>
          </div>
        </section>

        {/* 7 , WHERE TO GO NEXT. Real routes only. Every href here is
            requested and confirmed to resolve before this page is delivered,
            because seven live link defects on this site came from links that
            were reasonable to assume and wrong. */}
        <section className="panel rise" style={{ marginTop: 18 }}>
          <div className="pad">
            <div className="lab" style={{ marginBottom: 12 }}>
              Where to go from here
            </div>
            {/* .close is the mockups' own closing-links block: hairline rows,
                a figure-face glyph on the right, terracotta on hover. The first
                version of this section hand-rolled a statblock, whose rows
                carry no link affordance at all, so three links rendered as
                plain body text. Porting beats inventing. */}
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
              <div>
                <div className="lab" style={{ marginBottom: 10 }}>
                  What the tier word on a figure means
                </div>
                <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
                  <b>Measured</b> is counted in that exact place.{" "}
                  <b>Built from published inputs</b> is arithmetic on figures
                  that were published, shown so it can be checked.{" "}
                  <b>Thin</b> means the shape is right and the level is not
                  certain.
                  <br />
                  <br />
                  The tier says which route a figure came down. It does not
                  certify the figure is right, and nothing on this site claims
                  it does.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ padding: "40px 0 24px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
