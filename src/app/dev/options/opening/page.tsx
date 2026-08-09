/**
 * /dev/options/opening , three drawings for "what it costs to open".
 *
 * ON HIS STILL-TO-RULE LIST since 2026-08-07, with the complaint attached:
 * "to open the doors, $130K needed" is hard to parse. It is, and the reason is
 * that the sentence leads with a number whose job is unclear: it is neither the
 * fit-out, nor the total, nor the cash you actually need.
 *
 * THE DATA HAS A FINDING IN IT AND THE PAGE DOES NOT SAY IT. From the
 * reconciled London cell, verbatim, on cashBeforeOpen:
 *
 *     "opening costs plus the modeled trading losses while trade builds;
 *      MOST PEOPLE BUDGET THE FIT-OUT AND NOTHING ELSE"
 *
 * Fit-out is $186,000. The total opening stack is $231,134. The cash you need
 * before the doors open is $360,134. So the number most people plan around is
 * a little over half what they need, and that gap is the subject.
 *
 * Every figure below is from data/cells/restaurants-in-london.json. Nothing is
 * invented. Two carry tier "thin" and are marked: fit-out, which has no
 * register behind it and is a wide range, and first-year insurance.
 *
 * OPTION B IS THE ONE I ARGUE FOR, and it is the same reasoning that won on the
 * keep block: this site's characteristic move is to name the obvious answer and
 * point past it. "The fit-out is not the number" is that move, and it is the
 * only one of the three that changes what a reader does.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "What it costs to open, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* From data/cells/restaurants-in-london.json, `opening` and `year1`. */
const STACK = [
  { label: "Fit-out", v: 186000, thin: true },
  { label: "Deposit and first rent", v: 29093 },
  { label: "Opening stock", v: 12000 },
  { label: "Insurance, year one", v: 2730, thin: true },
  { label: "Licence", v: 1178 },
  { label: "Company registration", v: 133 },
];
const TOTAL = 231134;
const CASH_BEFORE_OPEN = 360134;
const FITOUT_LO = 93000;
const FITOUT_HI = 353000;

const usd = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;

function Frame({
  letter, name, leads, words, children,
}: {
  letter: string; name: string; leads: string; words: number; children: React.ReactNode;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 20 }}>
        Leads with {leads}. Caption is {words} words, budget 20.
      </div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 24 }}>{children}</div>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * THE STACK. What the total is made of, largest first.
 *
 * His ruled grammar throughout: light track, one fill, the figure inside its
 * own bar. One terracotta mark for the line that dominates; everything else on
 * the neutral ramp, which is the emphasis-not-categorical rule.
 *
 * Its weakness: it answers "what is in the total" when the reader's question is
 * "how much money do I need", and those have different answers here.
 */
function OptionA() {
  const max = STACK[0].v;
  return (
    <div style={{ maxWidth: "60%" }}>
      {STACK.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ width: 168, flex: "none", fontSize: 12.5, textAlign: "right", color: INK }}>
            {s.label}
            {s.thin ? <span style={{ color: "var(--faint)" }}> ~</span> : null}
          </span>
          <span style={{ flex: 1, height: 24, background: "var(--n5)", borderRadius: "var(--r-xs)", position: "relative" }}>
            <span style={{
              position: "absolute", top: 0, bottom: 0, left: 0,
              width: `${Math.max((s.v / max) * 100, 8)}%`,
              background: i === 0 ? TERRA : "var(--n3)",
              borderRadius: "var(--r-xs)",
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 6, overflow: "hidden",
            }}>
              <span className="fig" style={{ fontSize: 12, fontWeight: 600, color: "var(--paper)", fontVariantNumeric: "tabular-nums" }}>
                {usd(s.v)}
              </span>
            </span>
          </span>
        </div>
      ))}
      <p style={{ fontSize: 13, color: INK, marginTop: 14 }}>
        The fit-out is four fifths of {usd(TOTAL)}. Everything else is rounding.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * WHAT PEOPLE BUDGET AGAINST WHAT THEY NEED. The gap is the drawing.
 *
 * Two bars on one scale: the fit-out most people plan around, and the cash the
 * doors actually need before they open. The shaded distance between them is the
 * thing nobody budgets, and it is the finding the cell file already records.
 *
 * Same shape as the ratified hero, "the gap", which is deliberate: he approved
 * that form and it is the site's clearest sentence about a difference.
 */
function OptionB() {
  const max = CASH_BEFORE_OPEN;
  const rows = [
    { label: "What most people budget", sub: "the fit-out", v: 186000, terra: false },
    { label: "What the doors need", sub: "including losses while trade builds", v: CASH_BEFORE_OPEN, terra: true },
  ];
  return (
    <div style={{ maxWidth: "60%" }}>
      {rows.map((r) => (
        <div key={r.label} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, color: INK, marginBottom: 4 }}>
            {r.label} <span style={{ color: "var(--muted)" }}>, {r.sub}</span>
          </div>
          <span style={{ display: "block", height: 30, background: "var(--n5)", borderRadius: "var(--r-xs)", position: "relative" }}>
            <span style={{
              position: "absolute", top: 0, bottom: 0, left: 0,
              width: `${(r.v / max) * 100}%`,
              background: r.terra ? TERRA : "var(--n3)",
              borderRadius: "var(--r-xs)",
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 8, overflow: "hidden",
            }}>
              <span className="fig" style={{ fontSize: 14, fontWeight: 600, color: "var(--paper)", fontVariantNumeric: "tabular-nums" }}>
                {usd(r.v)}
              </span>
            </span>
          </span>
        </div>
      ))}
      <p style={{ fontSize: 13, color: INK, marginTop: 14 }}>
        The fit-out is the number people plan around. It is barely half.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * THE RANGE. The honest headline is that this is not one figure.
 *
 * Fit-out runs $93K to $353K, a 3.8x spread, and the cell file says why: no
 * register exists, so the top is a strip-out to bare brick and the bottom is
 * taking over a working kitchen. Drawing a single number hides that.
 *
 * Its weakness, and it is the reason I do not argue for it: a reader who wants
 * to know whether they can afford this gets "it depends", which is true and
 * unhelpful.
 */
function OptionC() {
  const lo = FITOUT_LO, hi = FITOUT_HI, taken = 186000;
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ position: "relative", height: 30, background: "var(--n5)", borderRadius: "var(--r-xs)" }}>
        <span style={{
          position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
          background: "var(--n3)", borderRadius: "var(--r-xs)", opacity: 0.55,
        }} />
        <span style={{ position: "absolute", top: -4, bottom: -4, left: `${pos(taken)}%`, width: 3, background: TERRA, borderRadius: "var(--r-xs)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
        <span>{usd(lo)} , taking over a working kitchen</span>
        <span>{usd(hi)} , stripped to bare brick</span>
      </div>
      <p style={{ fontSize: 13, color: INK, marginTop: 14 }}>
        No register exists. The fit-out is a range, not a figure.
      </p>
    </div>
  );
}

export default function OpeningOptionsPage() {
  return (
    <>
      <Place />
      <main className="wrap av2">
        <section className="panel pad" style={{ marginTop: 24 }}>
          <h1 style={{ fontSize: 21, fontWeight: 600, color: INK, marginBottom: 8 }}>
            What it costs to open
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 660 }}>
            You said &ldquo;to open the doors, $130K needed&rdquo; is hard to parse.
            It is, because the number it leads with is neither the fit-out, nor
            the total, nor the cash actually needed. These are three different
            answers to &ldquo;how much&rdquo;, and they disagree by a factor of two.
            Every figure is from the reconciled London file; a tilde marks the two
            with no register behind them.
          </p>
        </section>

        <Frame letter="A" name="The stack" leads="what the total is made of" words={10}>
          <OptionA />
        </Frame>
        <Frame letter="B" name="Budgeted against needed" leads="the gap nobody plans for" words={11}>
          <OptionB />
        </Frame>
        <Frame letter="C" name="The range" leads="the spread, and why it exists" words={9}>
          <OptionC />
        </Frame>

        <section className="panel pad" style={{ marginTop: 18 }}>
          <p style={{ fontSize: 13, color: INK, lineHeight: 1.65, maxWidth: 660 }}>
            My argument is for B, and the cell file makes it rather than me: the
            note on cash-before-open reads &ldquo;most people budget the fit-out and
            nothing else&rdquo;. That is a finding sitting in the data with no drawing
            attached. A is a good second block underneath it. C is true and it
            answers a question nobody is asking at this point on the page.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
