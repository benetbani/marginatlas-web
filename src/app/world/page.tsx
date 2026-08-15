/**
 * /world , the atlas index, on the v2 system.
 *
 * PROMOTED 2026-08-07 from `/dev/world2`. The URL is unchanged and the metadata
 * is carried over from the page this replaces, including the canonical, which
 * matters: 29 routes were repaired that week and this is one of them.
 *
 * WHY IT SITS OUTSIDE `(site)`. Everything in that route group is wrapped in
 * <SiteChrome>, which is the previous generation's masthead and footer. This
 * page carries its own. A route group does not appear in the URL, so moving the
 * folder out changes what wraps the page and never changes its path. The
 * `[country]` tree already resolves the same tension the other way round, by
 * rendering <SiteChrome> itself.
 *
 * THE DATA IS THE SAME DATA. `buildWorldAtlas` already exists, already groups
 * covered countries by region ordered broadest first, and already refuses to
 * render ISO3 codes and regional aggregates that the coverage report has
 * historically leaked. Rebuilding the view does not mean rebuilding the read:
 * a second source of truth for "which countries are covered" is how two pages
 * start disagreeing about the size of the site.
 *
 * WHAT IS DELIBERATELY NOT HERE:
 *
 * - **A map.** A choropleth of coverage would colour 105 countries as "covered"
 *   when one has figures reconciled line by line. The picture would be a
 *   stronger claim than the data supports, and it would be the first thing a
 *   reader saw.
 * - **A depth badge on every tile.** The kit has one. Three depth words next to
 *   105 country names is a second alphabet a reader has to learn before the
 *   list becomes useful.
 * - **Search.** 105 names is a page you scan, not one you query. Ctrl-F exists.
 */
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCoverageReport } from "@/lib/quality/coverage-report";
import { getCoverageRows } from "@/lib/coverage/report";
import { buildWorldAtlas } from "@/lib/scores/world_atlas";
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { citiesByCountry } from "@/lib/home/front_page_figures";
import { countryPageTarget } from "@/lib/geo/page_targets";

import "@/styles/atlas-spine.css";

export const revalidate = 21600; // 6 hours

export const metadata = {
  title: "World map: Margin Atlas",
  description: "Every country in Margin Atlas.",
  alternates: { canonical: "/world" },
};

function countryName(iso2: string): string {
  return COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
}

/**
 * A country link, RESOLVED rather than assembled.
 *
 * `verify_geo_link_construction` rejects `/${iso2.toLowerCase()}` written by
 * hand, and it is right to: Greece is held as `GR`, so every hand-built `/el`
 * link was dead on every Greek page. The resolver checks the same list the
 * route gates on, so a link it returns cannot 404 and a country it refuses
 * renders as plain text instead of a promise.
 *
 * The chevron is the door contract from atlas.css, "a chevron marks a door,
 * its absence marks a fact", which is implemented there on `.tiles>a` only.
 * A statblock row has no link rule at all, so without the mark an anchor in
 * `.nm` reads as body text.
 */
function CountryDoor({ iso2, name }: { iso2: string; name: string }) {
  const target = countryPageTarget(iso2);
  if (!target) return <>{name}</>;
  return (
    <a href={target.href} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <CountryFlag iso2={iso2} className="w-[18px]" />
      {name}
      <span aria-hidden="true" style={{ color: "var(--faint)", marginLeft: 6 }}>
        &rsaquo;
      </span>
    </a>
  );
}

/**
 * One country in the index: its flag, then its name.
 *
 * The flag is what makes a list of ninety-nine names scannable rather than a
 * wall: the eye finds a country by its colours long before it reads the word.
 * `CountryFlag` renders flat SVGs at a canonical 3:2 from a CDN, so ninety-nine
 * of them are ninety-nine cached requests and no bytes in the bundle.
 *
 * A country with no page is plain text, never a link that 404s.
 */
function CountryLink({ iso2, name }: { iso2: string; name: string }) {
  const target = countryPageTarget(iso2);
  const inner = (
    <>
      <CountryFlag iso2={iso2} className="w-[18px]" />
      <span>{name}</span>
    </>
  );
  /**
   * `minHeight` IS THE TAP TARGET, and it is here because this page regressed
   * one on 2026-08-07.
   *
   * DESIGN.md sets a 40px floor. The page this replaced rendered each country
   * as a bordered tile with 12px of padding and two lines of text, roughly
   * 58px, so it cleared the floor by accident. A 13px link in a bare list is
   * 21px, and 99 of them at 21px is a page a thumb cannot use. Measured at
   * 390x844 by `scripts/loop/mobile.mjs`.
   *
   * 40px on every width, not just touch, because an inline style cannot carry
   * a media query and the alternative is a rule in the generated stylesheet,
   * which is the founder's design and not the loop's to edit. The cost is a
   * longer list on a desktop screen. That trade is written up in
   * `design/loop5/reviews/E2-tap-targets.md` and is one number to reverse.
   */
  const style: React.CSSProperties = {
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 9,
    minHeight: 40,
  };
  if (!target) return <span style={{ ...style, color: "var(--muted)" }}>{inner}</span>;
  return (
    <a href={target.href} style={{ ...style, color: "var(--ink-2)" }}>
      {inner}
    </a>
  );
}

export default async function WorldPage() {
  const report = getCoverageReport();

  /* Only real ISO2 codes from the taxonomy may render. The coverage report has
     historically leaked ISO3 codes and regional aggregates; the validity set
     keeps them out by construction rather than by filtering after the fact. */
  const validIso2 = new Set(COUNTRIES.map((c) => c.code));

  /* Countries come from lib/coverage/report, the same reader the coverage hub,
     the scorecards and the sitemap use, so the world map cannot disagree with
     them about which countries exist.

     Reading the raw rows here cost Greece. Its 1,733 classified cells are keyed
     "EL", a statistical-agency spelling, and the validity set above correctly
     refused it, so a country covered at 7.6/10 was simply absent from the world
     map. The shared reader canonicalises the code instead of discarding it.
     Totals still come from the raw report; they are file-level sums, not
     per-country claims. */
  const atlas = buildWorldAtlas(
    { ...report, countries: getCoverageRows() },
    validIso2,
    countryName,
    report?.totals?.industries_covered ?? 0,
  );

  const cityCount = citiesByCountry();
  const hasData = atlas.countriesCovered > 0;

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
              <a href="/world">The world</a>
            </nav>
          </div>
        </header>

        {/* THE MAIN LANDMARK, ADDED 2026-08-09. This page was promoted out of
            <SiteChrome>, which is where <main> lives for every other route, and
            nothing replaced it. Measured on production: /world, /industries and
            the v2 cell page were the only three shipping pages emitting no main
            landmark, so a screen reader had no content region to jump to and a
            skip link had nothing to skip to. It closes before the footer, which
            is chrome and belongs outside the main region. */}
        <main>

        {/* 1 , THE OPENING. A title card is not a page opening. This states
            what the page is for, and carries the figure that makes the list
            below worth scrolling: most of the map is not filled, and the
            honest version of that is the first thing said rather than the
            last. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <h1 style={{ maxWidth: "17ch" }}>
                Every country, and how much of it is filled in.
              </h1>
              <p className="k" style={{ margin: "16px 0 0", maxWidth: "44ch" }}>
                Pick a country to see what a business there takes, what its
                owner keeps, and what the state takes in between. Where the
                figures are thin the page says so on the figure.
              </p>
            </div>

            {hasData ? (
              <div className="panel pad">
                <div className="statblock">
                  <div className="hd">
                    <GlyphIcon id={"global-spread" as GlyphId} size={18} />
                    How far the map goes
                  </div>
                  <div className="row">
                    <span className="nm">
                      Countries with figures
                      <span className="s">every one has a page</span>
                    </span>
                    <span className="v">{atlas.countriesCovered}</span>
                  </div>
                  <div className="row">
                    <span className="nm">
                      Trades mapped across them
                      <span className="s">not every trade in every country</span>
                    </span>
                    <span className="v">{atlas.activitiesMapped}</span>
                  </div>
                  <div className="row">
                    <span className="nm">
                      Reconciled line by line
                      <span className="s">restaurants in London, so far</span>
                    </span>
                    <span className="v">1</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {hasData ? (
          <>
            {/* 2 , START HERE. The guided entry: a reader begins where the data
                goes furthest rather than at the top of an alphabet. */}
            {atlas.deepest.length ? (
              <section className="panel pad rise" style={{ marginTop: 18 }}>
                <div className="lab" style={{ marginBottom: 14 }}>
                  Where the map goes furthest
                </div>
                <div className="statblock">
                  {atlas.deepest.map((c) => (
                    <div className="row" key={c.iso2}>
                      <span className="nm">
                        {/* The door contract, ported. atlas.css states it as
                            "a chevron marks a door, its absence marks a fact",
                            and implements it on .tiles>a only. A statblock row
                            has no link rule at all, so an <a> inside .nm reads
                            as plain text. The mark is the same glyph at the
                            same weight. */}
                        <CountryDoor iso2={c.iso2} name={c.name} />
                        <span className="s">
                          {cityCount[c.iso2]
                            ? `${cityCount[c.iso2]} ${cityCount[c.iso2] === 1 ? "city" : "cities"} beneath it`
                            : "no city page yet"}
                        </span>
                      </span>
                      <span className="v">{c.activities}</span>
                    </div>
                  ))}
                </div>
                <p className="k" style={{ margin: "12px 0 0", maxWidth: "58ch" }}>
                  The figure is how many trades carry a reading in that country.
                  It says how much of the map is filled, not whether the country
                  is a good place to open anything.
                </p>
              </section>
            ) : null}

            {/* 3 , EVERY COUNTRY. ONE PANEL, NOT SEVEN.
                Founder 2026-08-03: "all those repeated country ribbons are just
                ugly", "we should not slap so many repeated pieces in such a
                short part".

                The first version was seven full-width panels, each holding a
                run of pills. Seven cards and ninety-nine pills is ninety-nine
                identical objects and seven identical frames, in one scroll.
                One panel, regions as columns, names as plain links: the same
                information, two frames instead of seven, and no pill chrome
                repeating under the eye. */}
            <section className="panel pad rise" style={{ marginTop: 18 }}>
              <div className="lab" style={{ marginBottom: 16 }}>
                Every country with a page
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: "26px 32px",
                }}
              >
                {atlas.regions.map((region) => (
                  <div key={region.name}>
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
                      {region.name}
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {/* No padding on the li: the anchor carries its own 40px
                          minimum, and padding on the parent would push the row
                          past it without making the target any bigger. */}
                      {region.countries.map((c) => (
                        <li key={c.iso2}>
                          <CountryLink iso2={c.iso2} name={c.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 4 , THE EXIT. */}
            <section className="panel pad rise" style={{ marginTop: 18 }}>
              <div className="lab" style={{ marginBottom: 14 }}>
                Where to go from here
              </div>
              <div className="close">
                <div className="links">
                  <a href="/cities">
                    Every city with a page
                    <span className="g">{Object.values(cityCount).reduce((a, b) => a + b, 0)}</span>
                  </a>
                  <a href="/gb/london/restaurants">
                    The one worked example in full
                    <span className="g">$618K</span>
                  </a>
                  <a href="/coverage">
                    What is filled and what is not
                    <span className="g">honest</span>
                  </a>
                </div>
                <p className="k" style={{ margin: 0, maxWidth: "50ch" }}>
                  A country with few trades mapped still has a page, and that
                  page still has every section. A page whose shape changed by
                  place would teach a reader that some places do not count.
                </p>
              </div>
            </section>
          </>
        ) : (
          /* No coverage report means nothing honest to show. The framing and
             the exit stay; a faked or empty grid does not. */
          <section className="panel pad rise" style={{ marginTop: 18 }}>
            <p className="note" style={{ maxWidth: "62ch", margin: 0 }}>
              The coverage report is not available, so the country list is not
              being drawn. It is not empty, it is unread.
            </p>
          </section>
        )}

        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
