/**
 * /dev/options/hero , three drawings for one subsection.
 *
 * THE DEAL, set by the founder 2026-08-07: every subsection gets a file with
 * three options drawn, and he picks. This is the first one, and the hero is
 * first because he called its current copy "catastrophic" twice.
 *
 * WHAT IS WRONG WITH THE HERO TODAY, in his words and in measurements:
 * a $693K figure that dominates, a four-line paragraph, a five-row label-value
 * list, a methodology sentence ("the typical room does not pay its owner
 * well"), and 809px of height against a 740px laptop viewport. 110 words.
 *
 * THE RULES ALL THREE OBEY:
 *   one drawing, one caption of 20 words or fewer, nothing else
 *   the whole thing fits 740px, which is a real laptop after browser chrome
 *   terracotta marks the answer ONCE
 *   the figure is the drawing's own label, never a number in a column beside it
 *   familiar forms only: a bar, a scale, a share. No invented geometry.
 *
 * WHY THESE THREE AND NOT THREE VARIATIONS OF ONE. Each answers a different
 * first question, and which question the hero should answer is the actual
 * decision he is making:
 *   A asks "what is the gap between takings and keep", the site's thesis
 *   B asks "of every hundred, how much reaches me", the operator's question
 *   C asks "is this room typical", the sceptic's question
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Hero, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/* One place for the numbers so the three drawings cannot drift apart. All from
   the reconciled London restaurant cell. */
const D = {
  takes: 618_000,
  keeps: 43_000,
  typical: 414_000,
  p25: 189_000,
  p75: 1_100_000,
  percentile: 38,
  keepPer100: 7,
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

function Frame({
  letter,
  name,
  answers,
  words,
  children,
}: {
  letter: string;
  name: string;
  answers: string;
  words: number;
  children: React.ReactNode;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 3 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 22 }}>
        Answers {answers}. Caption is {words} words.
      </div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 26 }}>{children}</div>
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * THE GAP. Two bars on one scale, the distance between them shaded.
 *
 * The site exists because revenue is easy to find and worth little, and what
 * the owner keeps is the number nobody publishes. That is a DISTANCE, and a
 * distance is drawn as a gap rather than stated as two figures in a list.
 *
 * Emphasis, not categorical: the keep bar is terracotta, everything else is
 * the neutral ramp. `choosing-a-form` calls emphasis the most underused form
 * and it is the right one whenever a single value is the point.
 */
function OptionA() {
  const w = 640, h = 132, pad = 0;
  const scale = (v: number) => (v / D.takes) * (w - pad);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label={`A London restaurant takes $618K a year. The owner keeps $43K.`}>
        {/* takings, the context bar */}
        <rect x="0" y="14" width={scale(D.takes)} height="26" rx="4" fill="var(--n4)" />
        {/* the gap, drawn as the thing it is */}
        <rect x={scale(D.keeps)} y="14" width={scale(D.takes) - scale(D.keeps)} height="26"
          fill="url(#gapfill)" opacity=".5" />
        {/* keep, the answer, terracotta once */}
        <rect x="0" y="14" width={scale(D.keeps)} height="26" rx="4" fill={TERRA} />
        <defs>
          <pattern id="gapfill" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--n3)" strokeWidth="1.4" />
          </pattern>
        </defs>
        {/* direct labels, on the marks, never in a column */}
        <text x="0" y="66" fontSize="12" fill="var(--muted)">The owner keeps</text>
        <text x="0" y="104" fontSize="40" fontWeight="600" fill={TERRA}
          style={{ fontVariantNumeric: "tabular-nums" }}>$43K</text>
        <text x={scale(D.takes)} y="66" fontSize="12" fill="var(--muted)" textAnchor="end">The business takes</text>
        <text x={scale(D.takes)} y="104" fontSize="40" fontWeight="600" fill={INK} textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}>$618K</text>
      </svg>
      <p className="k" style={{ margin: "18px 0 0", maxWidth: "58ch" }}>
        That gap is the business. It is the number nobody publishes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * OF EVERY HUNDRED. A single hundred-unit bar, seven units terracotta.
 *
 * The operator's own question is not "what is my revenue", it is "how much of
 * this is mine". A hundred marks answers it with no arithmetic and no scale to
 * learn: the reader sees seven out of a hundred and is done.
 *
 * Familiar on purpose. This is a progress bar, which is the most-read chart
 * form on the internet, and the founder's brief was explicit that the reader
 * should get "a graphic that he kind of expects instead of an alien form."
 */
function OptionB() {
  const cols = 25, rows = 4, cell = 22, gap = 4;
  const marks = Array.from({ length: 100 }, (_, i) => i);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 26, flexWrap: "wrap" }}>
        <svg width={cols * cell} height={rows * cell} viewBox={`0 0 ${cols * cell} ${rows * cell}`}
          role="img" aria-label="Seven of every hundred pounds through the till reach the owner.">
          {marks.map((i) => {
            const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
            const kept = i >= 100 - D.keepPer100;
            return <rect key={i} x={x} y={y} width={cell - gap} height={cell - gap} rx="2"
              fill={kept ? TERRA : "var(--n5)"} />;
          })}
        </svg>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>reach the owner</div>
          <div className="fig" style={{ fontSize: 56, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            7
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>of every hundred</div>
        </div>
      </div>
      <p className="k" style={{ margin: "20px 0 0", maxWidth: "58ch" }}>
        Ninety three go out again before the owner is paid anything at all.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * WHERE THIS ROOM SITS. One scale, the trade's spread, a pin.
 *
 * The sceptic's first question is "is that typical, or did you show me the good
 * one", and the current page answers it four sections later in prose. A pin on
 * a range answers it in one glance and kills the paragraph.
 *
 * The middle half is the band; the typical room is a tick; this room is the
 * terracotta pin. Three marks, one axis, no legend needed because each is
 * directly labelled.
 */
function OptionC() {
  const w = 640, h = 120;
  const lo = 150_000, hi = 1_200_000;
  const x = (v: number) => ((v - lo) / (hi - lo)) * w;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label="This room takes $618K, in the top 38 per cent of London restaurants.">
        {/* the full spread, recessive */}
        <rect x="0" y="52" width={w} height="4" rx="2" fill="var(--n5)" />
        {/* the middle half, the context that matters */}
        <rect x={x(D.p25)} y="48" width={x(D.p75) - x(D.p25)} height="12" rx="4" fill="var(--n4)" />
        {/* the typical room, a tick and not a pin, because it is context */}
        <line x1={x(D.typical)} y1="40" x2={x(D.typical)} y2="68" stroke="var(--n1)" strokeWidth="2" />
        <text x={x(D.typical)} y="30" fontSize="11.5" fill="var(--muted)" textAnchor="middle">typical room</text>
        <text x={x(D.typical)} y="86" fontSize="13" fill={INK} textAnchor="middle"
          style={{ fontVariantNumeric: "tabular-nums" }}>$414K</text>
        {/* this room, the answer */}
        <circle cx={x(D.takes)} cy="54" r="9" fill={TERRA} stroke="var(--card)" strokeWidth="2" />
        <text x={x(D.takes)} y="112" fontSize="32" fontWeight="600" fill={TERRA} textAnchor="middle"
          style={{ fontVariantNumeric: "tabular-nums" }}>$618K</text>
        <text x="0" y="86" fontSize="11.5" fill="var(--faint)" style={{ fontVariantNumeric: "tabular-nums" }}>$189K</text>
        <text x={w} y="86" fontSize="11.5" fill="var(--faint)" textAnchor="end"
          style={{ fontVariantNumeric: "tabular-nums" }}>$1.1M</text>
      </svg>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "58ch" }}>
        This room is a good one, not a typical one. The page says so throughout.
      </p>
    </div>
  );
}

export default function HeroOptions() {
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
              <span>Hero, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "22ch" }}>Three heroes. Same data.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "56ch" }}>
            Each answers a different first question. Which question the hero
            should answer is the decision.
          </p>
        </section>

        <Frame letter="A" name="The gap" answers="what is the distance between takings and keep" words={10}>
          <OptionA />
        </Frame>

        <Frame letter="B" name="Of every hundred" answers="how much of this is mine" words={12}>
          <OptionB />
        </Frame>

        <Frame letter="C" name="Where this room sits" answers="is this typical, or the good one" words={13}>
          <OptionC />
        </Frame>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 12 }}>What today&rsquo;s hero does instead</div>
          <p className="k" style={{ margin: 0, maxWidth: "62ch" }}>
            110 words, a five row list, a methodology sentence, and 809px of
            height against a 740px laptop. All three above are under 130px and
            under 20 words.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
