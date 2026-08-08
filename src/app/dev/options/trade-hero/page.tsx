/**
 * /dev/options/trade-hero , three drawings for the trade page's opening.
 *
 * HIS VERDICT ON WHAT IS THERE NOW: "a gigantic title on top, which doesn't
 * say anything. Then a paragraph below it, which is never readable. And then a
 * table below it." And on the provenance line beneath it: "one of the most
 * disgusting phrases of the text. Totally robotic, unneeded, no context, dumb."
 *
 * THAT IS A CONTENT VERDICT, NOT A LAYOUT ONE, so drawing the same sentence
 * better would still be wrong. The question each option answers differently is
 * what a TRADE page should lead with at all.
 *
 * WHAT MAKES A TRADE PAGE DIFFERENT FROM A TRADE-IN-A-PLACE PAGE. The cell page
 * has a room, a city and a reconciled set of figures. This page has a trade and
 * no address, so every money figure on it is a shape rather than an amount. The
 * honest lead is therefore a RATIO or a SPREAD, never a sum: "restaurants keep
 * seven of every hundred" travels, and "restaurants take $618K" does not.
 *
 * THE PROVENANCE LINE IS GONE FROM ALL THREE. Where a figure needs its
 * provenance, the tier vocabulary already carries it on the figure itself.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Trade page opening, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* Restaurants, from the measured margin table and the across-cities build. */
const D = {
  keep: 7,
  gross: 65,
  operating: 10,
  neighbours: [
    { name: "Food trucks", keep: 12 },
    { name: "Cafes", keep: 9 },
    { name: "Pizzerias", keep: 9 },
    { name: "Restaurants", keep: 7, self: true },
    { name: "Bars", keep: 7 },
    { name: "Sit-down restaurants", keep: 5 },
  ],
  cities: [
    { name: "Dubai", keep: 11 },
    { name: "Sydney", keep: 9 },
    { name: "New York", keep: 8 },
    { name: "London", keep: 7 },
    { name: "Berlin", keep: 6 },
    { name: "Lisbon", keep: 4 },
  ],
};

function Frame({ letter, name, leads, children }: {
  letter: string; name: string; leads: string; children: React.ReactNode;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 3 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 22 }}>{leads}</div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 26 }}>{children}</div>
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * THE KEEP, AND THE PLACES IT COMES FROM.
 *
 * One figure and the spread behind it. The trade keeps seven of every hundred,
 * and the six cities where it is measured locally run from four to eleven. That
 * second half is what stops the seven reading as a promise.
 */
function OptionA() {
  const lo = Math.min(...D.cities.map((c) => c.keep));
  const hi = Math.max(...D.cities.map((c) => c.keep));
  const W = 430;
  const x = (v: number) => ((v - (lo - 1)) / ((hi + 1) - (lo - 1))) * W;
  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: 54, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {D.keep}
        </span>
        <span style={{ fontSize: 15, color: INK }}>of every hundred reaches the owner</span>
      </div>
      <svg viewBox={`0 0 ${W} 62`} width="100%" style={{ marginTop: 18 }} role="img"
        aria-label={`Across six measured cities the keep runs from ${lo} to ${hi} of every hundred.`}>
        <rect x={x(lo)} y="18" width={x(hi) - x(lo)} height="10" rx="5" fill="var(--n4)" />
        {/* THE ACCENT MARKS THE TRADE'S OWN FIGURE, not a city.
            The first version highlighted London, which is meaningless here: a
            trade page has no address, so singling out one city is emphasis
            pointing at nothing. The terracotta dot is the 7 in the headline
            above, so the figure and the strip are the same claim. */}
        {D.cities.map((c) => {
          const isSelf = c.keep === D.keep;
          return (
            <g key={c.name}>
              <circle cx={x(c.keep)} cy="23" r={isSelf ? 7 : 5}
                fill={isSelf ? TERRA : "var(--n2)"} stroke="var(--card)" strokeWidth="2" />
              <title>{`${c.name}, ${c.keep} of every hundred`}</title>
            </g>
          );
        })}
        <text x={x(D.keep)} y="12" fontSize="11.5" fill={TERRA} textAnchor="middle" fontWeight="600">
          the trade
        </text>
        <text x={x(lo)} y="50" fontSize="11.5" fill="var(--faint)" textAnchor="middle">Lisbon {lo}</text>
        <text x={x(hi)} y="50" fontSize="11.5" fill="var(--faint)" textAnchor="middle">Dubai {hi}</text>
      </svg>
      <p className="k" style={{ margin: "14px 0 0", maxWidth: "54ch" }}>
        Six cities measure it locally. The address moves it more than the menu does.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * WHERE THE TRADE SITS AMONG ITS OWN.
 *
 * A reader arriving at a trade page usually has two or three trades in mind.
 * The first useful thing is not what this one keeps in isolation, it is whether
 * it keeps more or less than the ones beside it.
 *
 * Position, never a league table: these are neighbours in one sector on one
 * axis, which is a measurement. Ranking every trade in the atlas against each
 * other would be a verdict and is a standing rule against.
 */
function OptionB() {
  const max = Math.max(...D.neighbours.map((n) => n.keep));
  return (
    <div style={{ maxWidth: "60%" }}>
      {D.neighbours.map((n) => (
        <div key={n.name} style={{ marginBottom: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 13.5, color: n.self ? INK : "var(--muted)", fontWeight: n.self ? 600 : 400 }}>
              {n.name}
            </span>
            <span className="fig" style={{ fontSize: n.self ? 17 : 14, fontWeight: 600, color: n.self ? TERRA : "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
              {n.keep}
            </span>
          </div>
          <div style={{ height: 9, borderRadius: 5, background: "var(--n5)" }}>
            <div style={{ width: `${(n.keep / max) * 100}%`, height: 9, borderRadius: 5, background: n.self ? TERRA : "var(--n3)" }} />
          </div>
        </div>
      ))}
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Of every hundred, kept before the owner is paid. Its own sector, not the atlas.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * THE SHAPE OF THE HUNDRED, AS THE OPENING.
 *
 * The most aggressive: skip a headline figure entirely and open on the cost
 * stack, because a trade IS its cost shape. A restaurant is not a business that
 * happens to keep seven; it is a business where two thirds of the money is gone
 * before the rent is paid, and the seven falls out of that.
 *
 * This also collapses two chapters into one, which answers the separate
 * complaint that the page is a gigantic title, then a paragraph, then a table.
 */
function OptionC() {
  const parts = [
    { name: "Direct cost of sales", pct: 35, tone: "var(--n2)" },
    { name: "Running the business", pct: 55, tone: "var(--n3)" },
    { name: "Fixed costs and tax", pct: 3, tone: "var(--n4)" },
    { name: "The owner keeps", pct: 7, tone: TERRA },
  ];
  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ display: "flex", height: 52, borderRadius: 8, overflow: "hidden", gap: 2, marginBottom: 14 }}>
        {parts.map((p) => (
          <div key={p.name} title={`${p.name}, ${p.pct}%`}
            style={{ width: `${p.pct}%`, background: p.tone, minWidth: 3 }} />
        ))}
      </div>
      {parts.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ width: 11, height: 11, borderRadius: 2, background: p.tone, flex: "none" }} />
          <span style={{ fontSize: 13, color: p.pct === 7 ? INK : "var(--muted)", fontWeight: p.pct === 7 ? 600 : 400, flex: 1 }}>
            {p.name}
          </span>
          <span className="fig" style={{ fontSize: p.pct === 7 ? 17 : 14, fontWeight: 600, color: p.pct === 7 ? TERRA : "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
            {p.pct}%
          </span>
        </div>
      ))}
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Two thirds is gone before the rent. The seven is what the first three leave.
      </p>
    </div>
  );
}

export default function TradeHeroOptions() {
  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand"><span className="m" />Margin Atlas</span>
            <nav className="lat" aria-label="Where you are">
              <a href="/">Home</a>
              <span className="s">&rsaquo;</span>
              <span>Trade page opening, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "26ch" }}>A trade page has no address, so it cannot lead with a sum.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            You called the current opening a gigantic title that says nothing,
            then an unreadable paragraph, then a table. That is a content
            problem, so these change what it leads with, not how it is drawn.
          </p>
        </section>

        <Frame letter="A" name="The keep, and the places it comes from"
          leads="Leads with the ratio, then the spread across the six cities that measure it locally. The spread is what stops the seven reading as a promise.">
          <OptionA />
        </Frame>

        <Frame letter="B" name="Where it sits among its own"
          leads="Leads with position. A reader arriving at a trade page usually has two or three trades in mind, and whether this one keeps more than its neighbours is the first useful fact.">
          <OptionB />
        </Frame>

        <Frame letter="C" name="The shape of the hundred"
          leads="No headline figure at all. A trade IS its cost shape, and the seven falls out of it. This also merges two chapters into one.">
          <OptionC />
        </Frame>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 12 }}>What is gone from all three</div>
          <p className="k" style={{ margin: 0, maxWidth: "64ch" }}>
            The provenance line. Where a figure needs its provenance the tier
            vocabulary already carries it on the figure itself.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
