/**
 * /dev/options/keep , three drawings for "what owners actually keep".
 *
 * THE HEAVIEST BLOCK ON THE PAGE. 105 words today, measured, plus a
 * "modelled, not measured" aside, plus a second sub-block about rent, plus a
 * third sentence about what sits below the line. His verdict on this one was
 * blunt: "lots of numbers, weak visual execution, simplistic forms. Nobody
 * reads these subsections."
 *
 * WHAT THE BLOCK IS ACTUALLY FOR. Two things, and today they are fused into
 * one wall:
 *   1. how many owners in this trade get paid a proper wage
 *   2. what separates the ones who do from the ones who do not
 *
 * Each option below picks a different answer to "which of those two leads".
 * That is the decision, and it is his.
 *
 * OPTION C IS THE ONE I WOULD ARGUE FOR, and the argument is from BRAND.md
 * rather than from taste. The site's most characteristic move is "yes, but not
 * the main reason": acknowledge the obvious explanation, then point past it.
 * The finding buried in this block is that the thing dividing top from bottom
 * is the lease, not the cooking. That is the move, and today it is the fourth
 * paragraph of a wall nobody reaches.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "What owners keep, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* From the reconciled London cell. */
const D = {
  paid: 25,
  partial: 29,
  none: 46,
  wage: "$95K",
  rentTop: 9,
  rentBottom: 18,
  rentGap: "$56K",
  revenue: "$618K",
};

function Frame({
  letter,
  name,
  leads,
  words,
  children,
}: {
  letter: string;
  name: string;
  leads: string;
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
        Leads with {leads}. Caption is {words} words, against 105 today.
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
 * THE HUNDRED, SPLIT THREE WAYS. The existing idea with everything else cut.
 *
 * The current block already has this drawing. It is buried under four
 * paragraphs. This is what it looks like when the drawing is allowed to do the
 * work: one grid, one figure, one line, and the two sub-blocks moved out.
 */
function OptionA() {
  const marks = Array.from({ length: 100 }, (_, i) => i);
  const cols = 20, cell = 26, gap = 5;
  const tone = (i: number) =>
    i < D.paid ? TERRA : i < D.paid + D.partial ? "var(--n3)" : "var(--n5)";
  return (
    <div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        <svg width={cols * cell} height={5 * cell} viewBox={`0 0 ${cols * cell} ${5 * cell}`}
          role="img" aria-label="25 of every 100 owners are paid a proper wage.">
          {marks.map((i) => (
            <rect key={i} x={(i % cols) * cell} y={Math.floor(i / cols) * cell}
              width={cell - gap} height={cell - gap} rx="2.5" fill={tone(i)} />
          ))}
        </svg>
        <div style={{ minWidth: 190 }}>
          <div className="fig" style={{ fontSize: 52, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {D.paid}
          </div>
          <div style={{ fontSize: 13, color: INK, marginTop: 4, marginBottom: 16 }}>
            in a hundred are paid {D.wage} or more
          </div>
          {[
            { n: D.partial, t: "paid something, less than that", c: "var(--n3)" },
            { n: D.none, t: "paid nothing at all", c: "var(--n5)" },
          ].map((r) => (
            <div key={r.t} style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 7 }}>
              <span style={{ width: 11, height: 11, borderRadius: 2, background: r.c, flex: "none", transform: "translateY(1px)" }} />
              <span className="fig" style={{ fontSize: 15, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}>{r.n}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.t}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="k" style={{ margin: "20px 0 0", maxWidth: "60ch" }}>
        Each mark is one restaurant. Forty six are trading and paying their owner nothing.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THE WAGE LINE. One axis of owner take-home with a threshold drawn on it.
 *
 * A hundred marks answers "how many". A line answers "where do I land", which
 * is the question an operator reading this page actually holds. The threshold
 * is the thing that makes it a finding rather than a distribution: below this
 * mark, the job does not pay a wage.
 */
function OptionB() {
  const w = 660, h = 150;
  /* An illustrative shape, fitted to the two figures the page already states:
     the share paid properly and the share paid nothing. */
  const bars = [0, 0, 2, 6, 13, 16, 9, 5, 3, 2, 1, 1];
  const max = Math.max(...bars);
  const bw = w / bars.length;
  const threshold = 6.4; /* index where the wage line falls */
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label={`Most owners land below ${D.wage}, which is what the job needs to pay.`}>
        {bars.map((v, i) => {
          const bh = (v / max) * 96;
          return <rect key={i} x={i * bw + 3} y={110 - bh} width={bw - 6} height={bh} rx="4"
            fill={i >= threshold ? TERRA : "var(--n4)"} />;
        })}
        <line x1={threshold * bw} y1="6" x2={threshold * bw} y2="118" stroke={INK} strokeWidth="2" strokeDasharray="4 3" />
        <text x={threshold * bw + 8} y="18" fontSize="12" fill={INK}>{D.wage}, a proper wage</text>
        <text x="4" y="136" fontSize="11.5" fill="var(--faint)">nothing</text>
        <text x={w - 4} y="136" fontSize="11.5" fill="var(--faint)" textAnchor="end">well paid</text>
        <text x={threshold * bw - 10} y="136" fontSize="13" fill="var(--muted)" textAnchor="end">
          most land here
        </text>
      </svg>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "60ch" }}>
        Twenty five in a hundred clear the line. The rest run a business that does not pay one.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * TWO ROOMS, SAME TAKINGS. The "yes, but not the main reason" move, drawn.
 *
 * The real finding in this block is that what divides the top from the bottom
 * is the lease and not the cooking, and today it is the fourth paragraph of a
 * wall. Here it IS the drawing: two identical rooms, one difference, and the
 * gap between what their owners keep.
 *
 * BRAND.md calls this move the warmest thing the site does, because it treats
 * the reader as someone who already had a theory. Everyone blames the food
 * cost. It is the rent.
 */
function OptionC() {
  const rooms = [
    { name: "Top quarter", rent: D.rentTop, keep: 71, tone: TERRA },
    { name: "Bottom quarter", rent: D.rentBottom, keep: 15, tone: "var(--n3)" },
  ];
  const w = 300;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "26px 34px" }}>
        {rooms.map((r) => (
          <div key={r.name}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <GlyphIcon id={"commercial-rent" as GlyphId} size={24} />
              <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{r.name}</span>
            </div>
            <svg viewBox={`0 0 ${w} 74`} width="100%" role="img"
              aria-label={`${r.name}: rent takes ${r.rent} per cent of takings.`}>
              {/* the takings bar, identical in both */}
              <rect x="0" y="8" width={w} height="20" rx="4" fill="var(--n5)" />
              <rect x="0" y="8" width={(r.rent / 25) * w} height="20" rx="4" fill={r.tone} />
              <text x="0" y="52" fontSize="30" fontWeight="600" fill={r.tone}
                style={{ fontVariantNumeric: "tabular-nums" }}>{r.rent}%</text>
              <text x="0" y="70" fontSize="12" fill="var(--muted)">of takings goes on rent</text>
            </svg>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--hair)", display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <span className="fig" style={{ fontSize: 40, fontWeight: 600, color: TERRA, fontVariantNumeric: "tabular-nums" }}>
          {D.rentGap}
        </span>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>
          is the difference on the same {D.revenue} of takings
        </span>
      </div>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "60ch" }}>
        Everyone blames the cooking. It is what they signed for the room.
      </p>
    </div>
  );
}

export default function KeepOptions() {
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
              <span>What owners keep, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "24ch" }}>The heaviest block on the page.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            105 words today, in four paragraphs, around a drawing nobody reaches.
            Each of these leads with a different one of the two things it says.
          </p>
        </section>

        <Frame letter="A" name="The hundred, split three ways"
          leads="how many owners are paid a wage" words={13}>
          <OptionA />
        </Frame>

        <Frame letter="B" name="The wage line"
          leads="where a reader would land" words={17}>
          <OptionB />
        </Frame>

        <Frame letter="C" name="Two rooms, same takings"
          leads="what separates top from bottom" words={11}>
          <OptionC />
        </Frame>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 12 }}>If you want an argument</div>
          <p className="k" style={{ margin: 0, maxWidth: "62ch" }}>
            C. The site&rsquo;s best move is naming the obvious cause and pointing
            past it, and the lease beating the cooking is exactly that. Today it
            is the fourth paragraph.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
