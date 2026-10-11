/**
 * /industries , the trade axis, on the v2 system.
 *
 * PROMOTED 2026-08-07 from `/dev/industries2`. The URL is unchanged and the
 * metadata is carried over from the page this replaces, including the
 * canonical.
 *
 * IT DRAWS THE SITE'S CHROME, LIKE EVERY PAGE (truth-fixes round 3C,
 * 2026-10-12). It was promoted out of `(site)` to carry a masthead and a
 * footer of its own, and a reader who pressed Trades in the bar landed on a
 * page with no skip link, no seven-name bar, no sheet, no newsletter bar and
 * not the site's footer. It draws <SiteChrome> itself now, as the country and
 * trade routes outside the group do, and writes no masthead, no <main> and no
 * footer: SiteChrome's <main id="main"> is the page's one landmark. The v2
 * ground (`.av2`) stays and is the column's first child, so the rule in
 * globals.css (THE ZONES, round 3C) lets it meet the bar and the foot.
 * tests/chrome/masthead.test.ts draws this route and reads its markup.
 *
 * WHY IT STILL SITS OUTSIDE `(site)`. A route group does not appear in the
 * URL, so moving the index out changed what wraps it and never its path, and
 * moving it back would change nothing a reader sees now.
 *
 * ONLY THE INDEX MOVED. `/industries/[industry]` and its `across` child are
 * still on the older generation and still want <SiteChrome>, so they stay in
 * `(site)`. Two different route groups may serve `/industries` and
 * `/industries/[industry]` because those are different paths.
 *
 * WHY THIS PAGE. The site is trade by place. `/world` is the place door. There
 * has never been a trade door at this bar, so a reader who arrives thinking "I
 * want to open a bakery" rather than "tell me about Berlin" has nowhere to
 * land. That is half the lattice with no entrance.
 *
 * THE NOTE IS THE POINT, NOT THE PERCENTAGE. 179 trades carry a one-line
 * structural reason, and it is the same thing the homepage was missing:
 * "Feed and breeding stock heavy. Margins erode quickly with feed price."
 * A figure with a reason attached is a finding. A figure alone is a statistic.
 *
 * NO LEAGUE TABLE. Ranking trades by margin ranks businesses against each
 * other, which the standing rule forbids, and a "worst margins" list badmouths
 * everything at the bottom of it. The sample of notes is spaced evenly through
 * the list so the selection carries no claim, and the trades themselves are
 * shown inside their sector in the taxonomy's own order.
 */
import * as React from "react";

import { SiteChrome } from "@/components/SiteChrome";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { sectorGroups, visibleTradeCount, notableNotes } from "@/lib/trades/trade_index";

import "@/styles/atlas-spine.css";

export const revalidate = 86400;

export const metadata = {
  title: "All trades: Margin Atlas",
  description:
    "Every trade covered in Margin Atlas, grouped by sector. Pick one to see its cost shape and the revenue range it runs depending on the city.",
  alternates: { canonical: "/industries" },
};

function IndustriesBody() {
  const groups = sectorGroups();
  const total = visibleTradeCount();
  const notes = notableNotes(6);

  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        {/* 1 , THE OTHER DOOR. Stated as what it is for, not as what it
            contains. A reader arrives with a trade in mind, not with a wish to
            browse a taxonomy. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <h1 style={{ maxWidth: "18ch" }}>
                Start from the business, not the place.
              </h1>
              <p className="k" style={{ margin: "16px 0 0", maxWidth: "44ch" }}>
                Pick a trade to see what it takes, what its owner keeps, and
                what makes the difference between the two. Then narrow it to a
                city.
              </p>
            </div>

            <div className="panel pad">
              <div className="statblock">
                <div className="hd">
                  <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                  What is in here
                </div>
                <div className="row">
                  <span className="nm">
                    Trades with a page
                    <span className="s">small-business trades only</span>
                  </span>
                  <span className="v">{total}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Grouped into
                    <span className="s">the sectors below</span>
                  </span>
                  <span className="v">{groups.length}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Carrying a reason, not just a figure
                    <span className="s">one line on what shapes the margin</span>
                  </span>
                  <span className="v">{notes.length ? "most" : "none yet"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 , WHAT SHAPES A MARGIN. The warming section, and the only place
            the site's structural voice appears at trade level. Six notes taken
            evenly across the list, so this is a sample and not a ranking. */}
        {notes.length ? (
          <section className="panel pad rise" style={{ marginTop: 18 }}>
            <div className="lab" style={{ marginBottom: 14 }}>
              What actually shapes a margin
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: "22px 32px",
              }}
            >
              {notes.map((t) => (
                <div key={t.id}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span
                      className="fig"
                      style={{ fontSize: 20, fontWeight: 600, color: "var(--terra-deep)" }}
                    >
                      {t.keepsPer100}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                      {t.name}
                    </span>
                  </div>
                  <p className="k" style={{ margin: "6px 0 0", fontSize: 12.5 }}>
                    {t.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="k" style={{ margin: "18px 0 0", maxWidth: "62ch" }}>
              The figure is what the trade typically leaves out of every hundred
              before the owner is paid, across all the places it is measured. It
              is a starting shape, not a forecast: the same trade two cities
              apart can end the year in different places, which is what the
              trade page is for.
            </p>
          </section>
        ) : null}

        {/* 3 , EVERY TRADE, BY SECTOR. ONE PANEL, columns, plain links. Seven
            panels of pills was the shape he called ugly on the country index,
            and 200 trades would be worse. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 16 }}>
            Every trade with a page
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "26px 32px",
            }}
          >
            {groups.map((g) => (
              <div key={g.id}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--ink)",
                    paddingBottom: 8,
                    marginBottom: 8,
                    borderBottom: "1px solid var(--hair)",
                  }}
                >
                  {g.name}
                </div>
                {/* `minHeight: 40` IS THE TAP TARGET. DESIGN.md sets a 40px
                    floor and a 13px link in a bare list measures 17px, which
                    `scripts/loop/mobile.mjs` found 224 times on this page at
                    390x844. The page this replaced used a padded grid that
                    cleared the floor by accident; a plain list does not.

                    On every width rather than only on touch, because an inline
                    style cannot carry a media query and the alternative is a
                    rule in the generated stylesheet, which is the founder's
                    design. The cost is a longer list on a desktop screen, and
                    that trade is written up in
                    design/loop5/reviews/E2-tap-targets.md. */}
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {g.trades.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`/industries/${t.slug}`}
                        style={{
                          fontSize: 13,
                          color: "var(--ink-2)",
                          display: "flex",
                          alignItems: "center",
                          minHeight: 40,
                        }}
                      >
                        {t.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* Chrome is opted into, not inherited (the same shape as the country and trade routes outside `(site)`): the bar and its sheet, the one
   <main>, the newsletter bar and the footer are SiteChrome's, and the body above is the page. */
export default function IndustriesIndex() {
  return (
    <SiteChrome>
      <IndustriesBody />
    </SiteChrome>
  );
}
