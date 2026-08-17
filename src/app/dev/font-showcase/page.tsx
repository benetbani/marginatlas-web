/**
 * /dev/font-showcase — the display-face decision page (Fable P1-03).
 *
 * Five serif candidates rendered on the same real-shaped Atlas business-page
 * mock so the founder can FEEL the choice, not guess it: the incumbent
 * (Newsreader) plus four hand-picked challengers. Body sans stays Inter
 * everywhere; only the display voice is on trial.
 *
 * The winner ships as a single `--font-display` slot swap in layout.tsx.
 * Nothing on this page hardcodes a face into the product.
 *
 * Type specimen: values are marked SAMPLE and never ship on a live route.
 */
import * as React from "react";
import type { Metadata } from "next";
import {
  Newsreader,
  Fraunces,
  Literata,
  Besley,
  Source_Serif_4,
} from "next/font/google";

export const metadata: Metadata = {
  title: "Display face showcase",
  robots: { index: false, follow: false },
};

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--cand-newsreader",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--cand-fraunces",
  display: "swap",
});
const literata = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--cand-literata",
  display: "swap",
});
const besley = Besley({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--cand-besley",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--cand-source-serif",
  display: "swap",
});

type Candidate = {
  id: string;
  name: string;
  cssVar: string;
  status: "current" | "challenger";
  read: string;
  figures: string;
};

const CANDIDATES: Candidate[] = [
  {
    id: "newsreader",
    name: "Newsreader",
    cssVar: "var(--cand-newsreader)",
    status: "current",
    read: "The incumbent. Quiet news-serif manners, slightly narrow, polite. Reads cleanly but rarely announces itself.",
    figures: "Lining figures are decent; the 1 is timid at display sizes.",
  },
  {
    id: "fraunces",
    name: "Fraunces",
    cssVar: "var(--cand-fraunces)",
    status: "challenger",
    read: "The boldest voice here. Warm, soft-wonky old-style soul with modern drawing; instantly recognizable as a brand face.",
    figures: "Characterful numerals with real presence; the $ and digits anchor hard.",
  },
  {
    id: "literata",
    name: "Literata",
    cssVar: "var(--cand-literata)",
    status: "challenger",
    read: "The bookish authority. Designed for long reading; feels like a well-made reference volume, warm and unhurried.",
    figures: "Superb, even numerals that sit beautifully in tables and mastheads alike.",
  },
  {
    id: "besley",
    name: "Besley",
    cssVar: "var(--cand-besley)",
    status: "challenger",
    read: "The ledger voice. A British Clarendon revival: sturdy, slab-shouldered, honest. Money printed by people who mean it.",
    figures: "Strong, confident digits; the heaviest number presence of the set.",
  },
  {
    id: "source-serif",
    name: "Source Serif 4",
    cssVar: "var(--cand-source-serif)",
    status: "challenger",
    read: "The safe modern editorial. Crisp, confident, zero fuss; disappears into the content in a good way.",
    figures: "Clean lining figures, excellent at every size; the least distinctive of the four.",
  },
];

/* The same business-page mock, rendered once per face. All display type in
   this component binds to the candidate var; body copy stays the site sans. */
function Specimen({ c }: { c: Candidate }) {
  const serif = { fontFamily: c.cssVar } as React.CSSProperties;
  return (
    <section
      aria-label={`Specimen: ${c.name}`}
      className="bg-white border border-parchment rounded-lg shadow-card overflow-hidden"
    >
      {/* candidate header bar */}
      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-parchment bg-paper-100">
        <div className="flex items-baseline gap-3">
          <h2 data-typography="custom" className="text-2xl font-semibold text-ink-900" style={serif}>
            {c.name}
          </h2>
          {c.status === "current" ? (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-700 bg-paper-200 rounded-full px-2.5 py-0.5">
              current interim
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-atlas-700 bg-atlas-50 rounded-full px-2.5 py-0.5">
              candidate
            </span>
          )}
        </div>
        <span
          data-typography="custom"
          className="hidden sm:block text-3xl text-ink-300 select-none"
          style={serif}
          aria-hidden="true"
        >
          Aa
        </span>
      </header>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {/* masthead mock */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Restaurants &middot; California &middot; United States
        </p>
        <h3
          data-typography="custom"
          className="mt-3 text-3xl sm:text-4xl font-medium leading-tight text-ink-900"
          style={serif}
        >
          How much does a restaurant make in California?
        </h3>
        <p className="mt-3 text-base text-ink-700 max-w-[58ch]">
          A typical one brings in about $1.1M a year, and the owner keeps
          roughly 8% of it after rent, staff, and the rest.
        </p>

        {/* anchor number, split-number treatment */}
        <div className="mt-6 flex items-baseline gap-2" data-typography="custom">
          <span className="text-2xl sm:text-3xl font-semibold text-ink-700" style={serif}>
            $
          </span>
          <span
            className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink-900 tabular-nums"
            style={serif}
          >
            1.1
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-ink-700" style={serif}>
            M
          </span>
          <span className="ml-2 text-xl sm:text-2xl italic text-ink-500" style={serif}>
            a year
          </span>
        </div>

        {/* section head + lede */}
        <div className="mt-8 pt-6 border-t border-parchment">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
            Where the money goes
          </p>
          <h4
            data-typography="custom"
            className="mt-2 text-2xl font-medium text-ink-900"
            style={serif}
          >
            The rent is the silent partner.
          </h4>
          <p className="mt-2 text-base text-ink-700 max-w-[58ch]">
            Out of every $100 through the till, about $34 goes to food, $29 to
            pay, and $9 to the landlord before the owner sees a cent.
          </p>
        </div>

        {/* pull quote */}
        <blockquote
          data-typography="custom"
          className="mt-7 border-l-2 border-atlas-500 pl-5 text-xl sm:text-2xl leading-snug text-ink-900"
          style={serif}
        >
          &ldquo;The revenue looks healthy until you meet the rent.&rdquo;
        </blockquote>

        {/* numerals battery */}
        <div className="mt-8 pt-6 border-t border-parchment grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Numerals at display size
            </p>
            <p
              data-typography="custom"
              className="mt-2 text-3xl sm:text-4xl font-semibold text-ink-900 tabular-nums tracking-tight"
              style={serif}
            >
              0123456789
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Money in context
            </p>
            <p
              data-typography="custom"
              className="mt-2 text-3xl sm:text-4xl font-semibold text-ink-900 tabular-nums tracking-tight"
              style={serif}
            >
              $84,500 <span className="text-ink-500 font-normal">&middot;</span> 7.4%
            </p>
          </div>
        </div>

        {/* serif floor test (20px) */}
        <p
          data-typography="custom"
          className="mt-6 text-xl text-ink-800"
          style={serif}
        >
          At twenty pixels, the smallest size the serif is allowed to speak.
        </p>

        {/* the read */}
        <div className="mt-7 rounded-md bg-paper-100 px-5 py-4">
          <p className="text-sm text-ink-800">{c.read}</p>
          <p className="mt-1.5 text-sm text-ink-500">{c.figures}</p>
        </div>
      </div>
    </section>
  );
}

export default function FontShowcasePage() {
  return (
    <main
      className={[
        newsreader.variable,
        fraunces.variable,
        literata.variable,
        besley.variable,
        sourceSerif.variable,
        "min-h-screen pb-24",
      ].join(" ")}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
          Fable P1 &middot; the open brand action
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink-900">
          Pick the Atlas voice.
        </h1>
        <p className="mt-4 text-lg text-ink-700 leading-relaxed">
          Five serifs, one identical page. The winner becomes the site-wide
          display face with a single slot swap; the body sans (Inter) stays
          either way. Scroll, compare the mastheads and the money, and trust
          the one that feels like a wise guide rather than a costume.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cocoa-700 bg-paper-200 rounded-full px-3 py-1">
          Type specimen &middot; sample values &middot; not a live page
        </p>
      </div>

      {/* quick-compare strip: the anchor number in all five faces */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 mt-10">
        <div className="bg-white border border-parchment rounded-lg shadow-subtle px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            The same number, five voices
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            {CANDIDATES.map((c) => (
              <div key={c.id} className="flex items-baseline gap-1.5">
                <span
                  data-typography="custom"
                  className="text-3xl sm:text-4xl font-semibold text-ink-900 tabular-nums tracking-tight"
                  style={{ fontFamily: c.cssVar }}
                >
                  $1.1M
                </span>
                <span className="text-xs text-ink-500">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 mt-10 grid gap-10">
        {CANDIDATES.map((c) => (
          <Specimen key={c.id} c={c} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 mt-12">
        <p className="text-sm text-ink-500 leading-relaxed">
          To choose: name the face. The swap is one line in layout.tsx (the
          `--font-display` slot) plus removing the losers from this page.
          Until then the site keeps Newsreader as the interim voice.
        </p>
      </div>
    </main>
  );
}
