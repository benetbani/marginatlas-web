/**
 * /dev/options/catalog , three drawings for the home page catalog.
 *
 * HIS BRIEF, 2026-08-09: "we should have some catalog concepts, high business
 * climate and low cost countries / booming cities / declining neighbourhoods of
 * the most famous cities of the world / high margin industries."
 *
 * AND THE CONSTRAINT THAT IS THE WHOLE PROBLEM: "but this catalog concept
 * should not be slammed like a list of elements." A grid of cards, a column of
 * links, a table of names, all fail that by construction. The collection has to
 * read as a THING, not as its members stacked up.
 *
 * Behind it sits the bigger complaint: "it doesn't show the vision of the site,
 * what it represents, its long term vision." A page that lists what the site
 * CONTAINS is a directory. A page that shows what the site can SEE is an atlas.
 * Each option below is a different answer to which of those the reader meets.
 *
 * DATA IS REAL, computed from the fact warehouse on 2026-08-09, not invented:
 *
 *   countries   198 with a tax figure, 194 with both tax and labour cost.
 *               Medians 33.9% and $11,500. THIRTY-NINE sit below both.
 *   cities      252 with a growth figure. Median 4.0% a year, top 12.0%.
 *   industries  243 with a net margin. Median 7.2%, top 25.2%.
 *   districts   NOT HELD. No decline metric exists yet, so that collection
 *               carries a sample tag rather than a number I made up.
 *
 * OPTION B IS THE ONE I ARGUE FOR, and the argument is structural rather than
 * aesthetic. See the note at the foot of the page.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "The catalog, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

type Collection = {
  title: string;
  /** The claim. Never a category name. */
  claim: string;
  measured: number;
  qualifying: number;
  unit: string;
  /** Where the qualifying set sits on the scale, 0..1, and its width. */
  clusterAt: number;
  clusterWide: number;
  members: string[];
  sample?: boolean;
};

const COLLECTIONS: Collection[] = [
  {
    title: "Cheap to run, light to tax",
    claim: "Below the world median on what the state takes and on what staff cost",
    measured: 194, qualifying: 39, unit: "countries",
    clusterAt: 0.08, clusterWide: 0.26,
    members: ["Timor-Leste", "Sudan", "Vanuatu", "Cambodia", "Kosovo"],
  },
  {
    title: "Growing fastest",
    claim: "Where the customers are arriving quicker than anywhere else",
    measured: 252, qualifying: 18, unit: "cities",
    clusterAt: 0.78, clusterWide: 0.2,
    members: ["Abuja", "Ahmedabad", "Surat", "Hanoi", "Bangalore"],
  },
  {
    title: "Districts on the way down",
    claim: "Famous addresses whose trade is thinning, and what that does to rent",
    measured: 0, qualifying: 0, unit: "districts",
    clusterAt: 0.14, clusterWide: 0.2,
    members: [], sample: true,
  },
  {
    title: "What the trade itself keeps",
    claim: "Trades whose margin survives before a single decision about place",
    measured: 243, qualifying: 21, unit: "trades",
    clusterAt: 0.8, clusterWide: 0.18,
    members: ["Mental health practice", "Nutritionist", "Sole accounting", "Sole law firm", "Chiropractic"],
  },
];

function Frame({
  letter, name, leads, children,
}: { letter: string; name: string; leads: string; children: React.ReactNode }) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 20 }}>{leads}</div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 24 }}>{children}</div>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * THE PLATE. Each collection is a drawn field with its members placed in it.
 *
 * The most atlas-like answer, and the one that fails on the fourth collection:
 * trades have no geography, so the plate has to become something else for one
 * entry in four. A catalog whose members are four different drawings is a list
 * of elements wearing a costume.
 */
function OptionA() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 20, maxWidth: "76%" }}>
      {COLLECTIONS.map((c) => (
        <div key={c.title}>
          <svg viewBox="0 0 200 92" width="100%" role="img" aria-label={c.claim}>
            <rect x="0" y="0" width="200" height="92" fill="var(--n5)" rx="3" />
            {Array.from({ length: 46 }, (_, i) => {
              const x = 8 + ((i * 37) % 184);
              const y = 10 + ((i * 53) % 74);
              const inSet = i % 5 === 0;
              return (
                <circle key={i} cx={x} cy={y} r={inSet ? 3.2 : 1.7}
                  fill={inSet ? TERRA : "var(--n3)"} opacity={inSet ? 1 : 0.7} />
              );
            })}
          </svg>
          <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginTop: 8 }}>{c.title}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {c.sample ? "not held yet" : `${c.qualifying} of ${c.measured} ${c.unit}`}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THE SPREAD. One scale per collection: the whole world, and where the
 * interesting part of it sits.
 *
 * The reader sees the full measured population as a field of ticks, and the
 * qualifying set marked inside it. That does two jobs at once. It is not a list,
 * because the collection is a REGION of a scale rather than a set of rows. And
 * it answers "what does this site represent" without a sentence about vision:
 * you can see that all 194 were measured, and that 39 is a judgement made on
 * top of the measurement.
 *
 * It also survives all four collections unchanged, which is the argument.
 */
function OptionB() {
  return (
    <div style={{ maxWidth: "68%" }}>
      {COLLECTIONS.map((c) => (
        <div key={c.title} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{c.title}</span>
            <span className="fig" style={{ fontSize: 12.5, color: c.sample ? "var(--faint)" : "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
              {c.sample ? "not held yet" : `${c.qualifying} of ${c.measured}`}
            </span>
          </div>
          <div style={{ position: "relative", height: 30, background: "var(--n5)", borderRadius: "var(--r-xs)", overflow: "hidden", opacity: c.sample ? 0.45 : 1 }}>
            {Array.from({ length: 64 }, (_, i) => {
              const p = i / 63;
              const inSet = !c.sample && p >= c.clusterAt && p <= c.clusterAt + c.clusterWide;
              return (
                <span key={i} aria-hidden style={{
                  position: "absolute", left: `${p * 100}%`, top: inSet ? 5 : 10, bottom: inSet ? 5 : 10,
                  width: inSet ? 3 : 1.5,
                  background: inSet ? TERRA : "var(--n3)",
                  borderRadius: "var(--r-xs)",
                }} />
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 7 }}>
            {c.claim}
            {c.members.length > 0 ? (
              <span style={{ color: INK }}>. {c.members.slice(0, 3).join(", ")}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * THE QUADRANT. Two axes, and the collection is a corner of the plane.
 *
 * The best fit for the FIRST collection, which is genuinely two-variable: cheap
 * to run AND light to tax is a corner, not a threshold. It is also why this one
 * cannot carry the set: growth is one variable and margin is one variable, so
 * three of the four quadrants would have an invented second axis, which is a
 * drawing telling the reader something the data does not say.
 */
function OptionC() {
  const pts = [
    { x: 0.12, y: 0.18, k: true }, { x: 0.2, y: 0.1, k: true }, { x: 0.3, y: 0.24, k: true },
    { x: 0.18, y: 0.34, k: true }, { x: 0.36, y: 0.16, k: true },
    { x: 0.62, y: 0.55 }, { x: 0.74, y: 0.7 }, { x: 0.55, y: 0.8 }, { x: 0.82, y: 0.42 },
    { x: 0.68, y: 0.28 }, { x: 0.44, y: 0.62 }, { x: 0.9, y: 0.66 }, { x: 0.5, y: 0.45 },
  ];
  return (
    <div style={{ maxWidth: "56%" }}>
      <svg viewBox="0 0 240 200" width="100%" role="img"
        aria-label="Countries by tax burden against labour cost. Thirty-nine sit in the low corner.">
        <rect x="28" y="8" width="200" height="160" fill="var(--n5)" rx="3" />
        <rect x="28" y="88" width="80" height="80" fill={TERRA} opacity="0.09" />
        <line x1="108" y1="8" x2="108" y2="168" stroke="var(--n3)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="28" y1="88" x2="228" y2="88" stroke="var(--n3)" strokeWidth="1" strokeDasharray="3 4" />
        {pts.map((p, i) => (
          <circle key={i} cx={28 + p.x * 200} cy={8 + p.y * 160} r={p.k ? 4 : 2.6}
            fill={p.k ? TERRA : "var(--n3)"} />
        ))}
        <text x="28" y="184" fontSize="10.5" fill="var(--muted)">lighter tax</text>
        <text x="228" y="184" fontSize="10.5" fill="var(--muted)" textAnchor="end">heavier tax</text>
        <text x="22" y="168" fontSize="10.5" fill="var(--muted)" textAnchor="end" transform="rotate(-90 22 168)">dearer staff</text>
      </svg>
      <p style={{ fontSize: 13, color: INK, marginTop: 12 }}>
        Thirty-nine of 194 countries sit under both medians.
      </p>
    </div>
  );
}

export default function CatalogOptionsPage() {
  return (
    <>
      <Place />
      <main className="wrap av2">
        <section className="panel pad" style={{ marginTop: 24 }}>
          <h1 style={{ fontSize: 21, fontWeight: 600, color: INK, marginBottom: 8 }}>
            The catalog, three ways
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 660 }}>
            Four collections, and your constraint that they must not read as a
            slammed list of elements. Every figure below is computed from the
            warehouse: 194 countries carry both a tax and a labour figure, 252
            cities carry growth, 243 trades carry a margin. The district
            collection has no decline metric yet, so it is marked as not held
            rather than filled with a number I chose.
          </p>
        </section>

        <Frame letter="A" name="The plate" leads="Each collection is a drawn field, its members placed inside it.">
          <OptionA />
        </Frame>
        <Frame letter="B" name="The spread" leads="Each collection is a region of a scale showing the whole measured world.">
          <OptionB />
        </Frame>
        <Frame letter="C" name="The quadrant" leads="Two axes, and the collection is a corner of the plane.">
          <OptionC />
        </Frame>

        <section className="panel pad" style={{ marginTop: 18 }}>
          <p style={{ fontSize: 13, color: INK, lineHeight: 1.65, maxWidth: 660 }}>
            My argument is for B, and it is structural rather than a matter of
            taste. Only B carries all four collections in the same form. Trades
            have no geography, so A has to become a different drawing for one
            entry in four. Growth and margin are single variables, so C has to
            invent a second axis for three of the four. A catalog whose four
            entries are four different drawings is a list of elements wearing a
            costume, which is the thing you ruled out. B also answers the larger
            complaint without a sentence about vision: the reader can see that
            all 194 were measured and that 39 is a judgement made on top of the
            measurement. That is the difference between a directory and an atlas.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
