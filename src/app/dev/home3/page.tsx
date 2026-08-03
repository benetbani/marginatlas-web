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

export default function HomeProposal() {
  const {
    revenue,
    keeps,
    keepsHi,
    p25,
    paidProperly,
    revenueTier,
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

              <h1 style={{ marginTop: 16, maxWidth: "18ch" }}>
                A restaurant in London takes {money(revenue)} a year.
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
                    <span className="s">the middle restaurant</span>
                  </span>
                  <span className="v">{money(revenue)}</span>
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
                <div className="row">
                  <span className="nm">
                    The weaker quarter
                    <span className="s">one in four is below</span>
                  </span>
                  <span className="v">{money(p25)}</span>
                </div>
                <p className="k" style={{ margin: "10px 0 0" }}>
                  {revenueTier}. Every figure on this site says which route it
                  came down.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2 , THE LINE THAT IS THE ARGUMENT. One number, alone, because it is
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

        {/* 3 , THE NAVIGATOR. Below the proof, not in place of it. */}
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

        {/* 4 , COVERAGE, HONESTLY. Including where it is thin, because that is
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

        <footer style={{ padding: "40px 0 24px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
