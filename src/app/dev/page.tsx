/**
 * /dev , the index of every workbench route.
 *
 * WHY IT EXISTS. There are 46 route folders under src/app/dev and the founder
 * has been told each URL by hand, one at a time, in chat. This is one URL that
 * reaches all of them.
 *
 * THE LIST IS STATIC AND THAT IS DELIBERATE. Reading the directory at module
 * scope is what broke forty consecutive deploys on this project: it works
 * locally and the path is not there at build time. The list below was generated
 * from src/app/dev on 2026-08-04 and is maintained by hand. A route added
 * without adding a line here simply does not appear, which is a smaller failure
 * than a build that cannot run.
 *
 * WHAT THE TWO GROUPS MEAN. The first seven render the ratified v2 system and
 * are what any design question is about. The rest are previous generations,
 * kept because they are where a decision was made and sometimes because
 * something in them is still the best version of an idea. They are not the
 * current bar and should not be read as it.
 *
 * The city and country routes are v2 even though their route file is a thin
 * wrapper: the `.av2` root lives in the component next door, which is why a
 * one-level scan of the route files puts them in the wrong group.
 */
import * as React from "react";

import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Workbench , Margin Atlas dev",
  robots: { index: false, follow: false },
};

type Route = { slug: string; what: string };

/** The ratified v2 system. Generated 2026-08-04, maintained by hand. */
const CURRENT: Route[] = [
  { slug: "home3", what: "The home page. Eight sections, answer first, then why the number is the number." },
  { slug: "world2", what: "Every country, by region, with flags. The place door." },
  { slug: "industries2", what: "Every trade, by sector. The trade door, and the other half of the lattice." },
  { slug: "compare2", what: "Two cities side by side. No score and no winner, stated on the page." },
  { slug: "pricing2", what: "Free, Basic, Premium as three columns of one table rather than three cards." },
  { slug: "city2", what: "The city page. Eighteen chapters, always, whatever the data behind them." },
  { slug: "country2", what: "The country page. Twenty-one chapters, eleven of them stating why they are empty." },
];

/** Previous generations. Kept for the decisions in them, not as the bar. */
const EARLIER: Route[] = [
  { slug: "cell-v2", what: "Cell page, London restaurants" },
  { slug: "spine", what: "The original spine prototype" },
  { slug: "spine-cell", what: "Spine, cell" },
  { slug: "spine-city", what: "Spine, city" },
  { slug: "spine-hood", what: "Spine, neighbourhood" },
  { slug: "spine-industry", what: "Spine, industry" },
  { slug: "spine-kit", what: "Spine component showcase" },
  { slug: "spine2", what: "Spine 2 prototype" },
  { slug: "kit", what: "Atlas page kit catalog" },
  { slug: "charts", what: "Chart primitives" },
  { slug: "brand-glyphs", what: "Glyph set preview" },
  { slug: "font-showcase", what: "Display face showcase" },
  { slug: "home", what: "Home, earlier" },
  { slug: "home2", what: "Home, earlier still" },
  { slug: "cities", what: "Cities index, earlier" },
  { slug: "country", what: "Country, earlier" },
  { slug: "compare", what: "Compare, earlier" },
  { slug: "pricing", what: "Pricing, earlier" },
  { slug: "decide", what: "The recommender, earlier" },
  { slug: "decide-v2", what: "The recommender, second attempt" },
  { slug: "calculator", what: "Calculator" },
  { slug: "gold-mine", what: "Gold-mine card catalog" },
  { slug: "london-commercial", what: "London commercial rents" },
  { slug: "index-world", what: "World index, earlier" },
  { slug: "index-cities", what: "Cities index, earlier" },
  { slug: "index-countries", what: "Countries index, earlier" },
  { slug: "index-extremes", what: "Extremes index, earlier" },
  { slug: "distribution-states", what: "Distribution component states" },
  { slug: "lock-states", what: "Paywall lock states" },
  { slug: "cell", what: "Cell, earlier" },
  { slug: "cell-reform", what: "Cell reform prototype" },
  { slug: "v0", what: "First sketch" },
];

function List({ rows, accent }: { rows: Route[]; accent: boolean }) {
  return (
    <div className="statblock">
      {rows.map((r) => (
        <div className="row" key={r.slug}>
          <span className="nm">
            <a href={`/dev/${r.slug}`}>/dev/{r.slug}</a>
            <span className="s">{r.what}</span>
          </span>
          {accent ? <span className="v">v2</span> : null}
        </div>
      ))}
    </div>
  );
}

export default function DevIndex() {
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
              <a href="/dev">Workbench</a>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "20ch" }}>Every page built, in one place.</h1>
          <p className="k" style={{ margin: "16px 0 0", maxWidth: "56ch", fontSize: 15 }}>
            Nothing here is linked from the site and nothing here ships. The
            first seven render the ratified system; the rest are earlier
            generations, kept for the decisions in them.
          </p>
        </section>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            The current system
          </div>
          <List rows={CURRENT} accent />
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "60ch" }}>
            Zero of these are reachable by a reader. The ratified design system
            ships on no live route, which is the single fact that decides what
            is worth building next.
          </p>
        </section>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Earlier generations
          </div>
          <List rows={EARLIER} accent={false} />
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
