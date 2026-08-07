/**
 * /dev/options/move , three drawings for "what one move is worth".
 *
 * HIS COMPLAINT WAS ABOUT LANGUAGE AS MUCH AS DRAWING, and it is the sharpest
 * note in the whole review:
 *
 *   "When you say 1% off food costs, you are right about that, you are totally
 *    correct about that, but the person doesn't understand that this is like a
 *    1% decrease of the food costs. It's pretty complicated, you make the
 *    subsections complicated. The subsections are not skimmable."
 *
 * and separately: "then you say what one realistic step is worth. That's not
 * understandable."
 *
 * SO EVERY LABEL HERE IS A VERB IN THE SECOND PERSON. "1% off food cost" is a
 * noun phrase describing an accounting delta. "Pay 1% less for food" is an
 * instruction a person can picture themselves carrying out. The figures are
 * identical; only the grammar changed, and the grammar was the defect.
 *
 * THE BLOCK'S JOB: show that small operational changes are worth real money,
 * and which one is worth most. That is a magnitude comparison over a handful of
 * items, so it is bars. The dataviz reference is unambiguous on that and there
 * is no cleverness to add.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "What one move is worth, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/**
 * The moves, with the labels rewritten as instructions.
 *
 * `was` is what the page says today, kept beside each one so the change is
 * visible rather than asserted. It does not render on the real page.
 */
const MOVES = [
  { icon: "price-per-unit", say: "Charge 5% more", was: "5% price rise", worth: 21000, note: "food follows it up" },
  { icon: "supplier", say: "Pay 1% less for food", was: "1% off food cost", worth: 6200, note: "on $618K of takings" },
  { icon: "wages", say: "Cut 1% from the rota", was: "1% off staff cost", worth: 6200, note: "one shift a fortnight" },
  { icon: "footfall", say: "Serve 5 more a day", was: "5 more orders a day", worth: 41000, note: "at the same spend" },
  { icon: "commercial-rent", say: "Sign 10% cheaper rent", was: "10% off the rent you sign", worth: 8000, note: "next time you renew" },
];
const KEEP = 43000;
/* The trailing zero is noise, and "$8.0K" beside "$21K" reads as a different
   kind of quantity rather than a rounder one. Same class of defect as the
   missing currency mark on the cell page: a formatter that is inconsistent
   across its own range makes a reader ask a question the number should have
   answered. */
const money = (n: number) =>
  `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}K`;

function Frame({ letter, name, why, children }: {
  letter: string; name: string; why: string; children: React.ReactNode;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 3 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 22 }}>{why}</div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 26 }}>{children}</div>
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * THE LADDER. Five moves, ordered by what they are worth, bar length is the
 * money, figure on the bar.
 *
 * Magnitude over a handful of items is a bar chart and nothing else. The only
 * decisions worth making are the ordering, biggest first so the answer is the
 * first thing read, and the labelling, which is where the whole defect was.
 */
function OptionA() {
  const sorted = [...MOVES].sort((a, b) => b.worth - a.worth);
  const max = sorted[0].worth;
  return (
    <div>
      {sorted.map((m, i) => (
        <div key={m.say} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr)", gap: 12, alignItems: "center", marginBottom: 13 }}>
          <GlyphIcon id={m.icon as GlyphId} size={24} />
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 13.5, color: INK, fontWeight: i === 0 ? 600 : 400 }}>{m.say}</span>
              <span className="fig" style={{ fontSize: i === 0 ? 19 : 15, fontWeight: 600, color: i === 0 ? TERRA : INK, fontVariantNumeric: "tabular-nums" }}>
                {money(m.worth)}
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--n5)" }}>
              <div style={{ width: `${(m.worth / max) * 100}%`, height: 10, borderRadius: 5, background: i === 0 ? TERRA : "var(--n3)" }} />
            </div>
          </div>
        </div>
      ))}
      <p className="k" style={{ margin: "18px 0 0", maxWidth: "58ch" }}>
        Five more covers a day is worth more than every cost cut on this list.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * AGAINST WHAT YOU KEEP TODAY. The same five, but each bar starts at the
 * current keep so the reader sees the move as a change to their own number.
 *
 * "$41K" means nothing on its own. "$43K becomes $84K" is a life. This is the
 * denominator rule from PRODUCT.md applied to a delta: never a figure without
 * the thing that makes it real.
 */
function OptionB() {
  const sorted = [...MOVES].sort((a, b) => b.worth - a.worth);
  const max = KEEP + sorted[0].worth;
  const w = 100;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>You keep</span>
        <span className="fig" style={{ fontSize: 22, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}>
          {money(KEEP)}
        </span>
        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>today</span>
      </div>
      {sorted.map((m, i) => (
        <div key={m.say} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
            <span style={{ fontSize: 13.5, color: INK, fontWeight: i === 0 ? 600 : 400 }}>{m.say}</span>
            <span className="fig" style={{ fontSize: 15, fontWeight: 600, color: i === 0 ? TERRA : INK, fontVariantNumeric: "tabular-nums" }}>
              {money(KEEP + m.worth)}
            </span>
          </div>
          <div style={{ position: "relative", height: 12 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "var(--n5)" }} />
            <div style={{ position: "absolute", left: 0, width: `${(KEEP / max) * w}%`, height: 12, borderRadius: "6px 0 0 6px", background: "var(--n3)" }} />
            <div style={{ position: "absolute", left: `${(KEEP / max) * w}%`, width: `${(m.worth / max) * w}%`, height: 12, borderRadius: "0 6px 6px 0", background: i === 0 ? TERRA : "var(--n4)" }} />
          </div>
        </div>
      ))}
      <p className="k" style={{ margin: "18px 0 0", maxWidth: "58ch" }}>
        Grey is what you keep now. Colour is what the move adds.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * THE ONE THAT MATTERS. Emphasis taken to its conclusion: one move gets the
 * figure, the other four are context beneath it.
 *
 * `choosing-a-form` calls emphasis the most underused form and says it is the
 * honest answer whenever one series is the point. Here one move is worth more
 * than the other four cost cuts combined, and a list of five equal bars buries
 * that. This is the same argument as the site's own "terracotta marks the
 * answer once per chapter", applied to which figure gets to be large.
 */
function OptionC() {
  const sorted = [...MOVES].sort((a, b) => b.worth - a.worth);
  const best = sorted[0];
  const rest = sorted.slice(1);
  const restTotal = rest.reduce((s, m) => s + m.worth, 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        {/* 24, not the 40 this drawing wants. `GlyphIcon` types its size as
            18 | 13 | 16 | 24, which is the ratified scale enforcing itself at
            the compiler, and that is the system working rather than getting in
            the way. Widening it to 32 and 40 is proposed in the visual-reform
            spec and is his to rule on; until he does, the anchor is 24. */}
        <GlyphIcon id={best.icon as GlyphId} size={24} />
        <div>
          <div className="fig" style={{ fontSize: 46, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {money(best.worth)}
          </div>
          <div style={{ fontSize: 14, color: INK, marginTop: 4 }}>{best.say}</div>
        </div>
      </div>
      <p className="k" style={{ margin: "14px 0 20px", maxWidth: "56ch" }}>
        That is one table more a night, and it beats every cost cut below.
      </p>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 14 }}>
        {rest.map((m) => (
          <div key={m.say} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 9 }}>
            <GlyphIcon id={m.icon as GlyphId} size={16} />
            <span style={{ fontSize: 12.5, color: "var(--muted)", flex: 1 }}>{m.say}</span>
            <span className="fig" style={{ fontSize: 13.5, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>
              {money(m.worth)}
            </span>
          </div>
        ))}
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--faint)" }}>
          Those four together come to {money(restTotal)}.
        </div>
      </div>
    </div>
  );
}

export default function MoveOptions() {
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
              <span>What one move is worth, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "22ch" }}>The defect here was grammar.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            You said nobody reads &ldquo;1% off food cost&rdquo; as a one per
            cent decrease. Every label below is now an instruction instead.
          </p>
        </section>

        {/* The rewrite, shown as a table because this one really is a list and
            the 4-row ledger cap does not apply to a before-and-after of copy. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>The same figures, said differently</div>
          {MOVES.map((m) => (
            <div key={m.say} style={{ display: "grid", gridTemplateColumns: "1fr 22px 1fr", gap: 10, alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--faint)", textDecoration: "line-through" }}>{m.was}</span>
              <span style={{ fontSize: 13, color: "var(--faint)" }}>&rsaquo;</span>
              <span style={{ fontSize: 13, color: INK }}>{m.say}</span>
            </div>
          ))}
        </section>

        <Frame letter="A" name="The ladder"
          why="Five moves ordered by what they are worth, bar length is the money, figure on the bar. Magnitude over a handful of items is a bar chart and nothing else.">
          <OptionA />
        </Frame>

        <Frame letter="B" name="Against what you keep today"
          why="Each bar starts at your current keep, so the move is a change to your own number rather than a figure floating on its own.">
          <OptionB />
        </Frame>

        <Frame letter="C" name="The one that matters"
          why="One move is worth more than the other four combined. Five equal bars bury that; emphasis says it.">
          <OptionC />
        </Frame>

        <SiteFooter />
      </div>
    </div>
  );
}
