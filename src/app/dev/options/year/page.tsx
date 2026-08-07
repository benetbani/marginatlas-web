/**
 * /dev/options/year , three drawings for "through the year".
 *
 * THIS ONE IS DIFFERENT FROM THE OTHER FILES, because he already specified the
 * answer. His words:
 *
 *   "Through the year, the subsection is quite interesting. The problem is
 *    that you have made it very wide, when it should not be very wide, and
 *    those bars are gigantically wide. The bars should represent a month, and
 *    they should be like 12 tall bars that they either go positive or negative,
 *    but they should be way less wider and taller so the person can understand
 *    visually where are the peaks in terms of months."
 *
 * So option A is that, built to the letter, and it is the recommendation. B and
 * C exist because a specification is not the same as having seen it, and the
 * two alternatives are cheap now and expensive after the page is rebuilt.
 *
 * ALL THREE ANSWER ONE QUESTION: which months pay for the year. A restaurant
 * does not earn a twelfth of its year every month, and the shape of that is the
 * whole point of the chapter.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Through the year, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* Deviation from the average month, per cent. Illustrative on a dev route. */
const M = [-18, -22, -8, 4, 11, 19, 26, 24, 9, -3, -12, 14];
const NAMES = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const FULL = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

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
 * HIS SPECIFICATION, TO THE LETTER. Twelve narrow bars, tall, above and below
 * a baseline, in a block that is not full width.
 *
 * The narrowness is the point rather than a constraint: at 26px a bar is a
 * mark you compare against eleven others at a glance, and at 90px it is a
 * panel you read one at a time. Height carries the value; width carries
 * nothing, so width should be small.
 */
function OptionA() {
  const w = 430, h = 200, mid = 104, unit = 3.1;
  const bw = 22, gap = (w - 12 * bw) / 11;
  return (
    <div style={{ maxWidth: 470 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label="July runs 26 per cent above the average month; February 22 per cent below.">
        <line x1="0" y1={mid} x2={w} y2={mid} stroke="var(--n4)" strokeWidth="1" />
        {M.map((v, i) => {
          const x = i * (bw + gap);
          const bh = Math.abs(v) * unit;
          const y = v >= 0 ? mid - bh : mid;
          const peak = v === Math.max(...M);
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={bh} rx="4"
                fill={peak ? TERRA : v >= 0 ? "var(--n2)" : "var(--n4)"} />
              <title>{`${FULL[i]}, ${v > 0 ? "+" : ""}${v}%`}</title>
            </g>
          );
        })}
        {NAMES.map((n, i) => (
          <text key={i} x={i * (bw + gap) + bw / 2} y={mid + 20} fontSize="11"
            fill={M[i] === Math.max(...M) ? INK : "var(--faint)"} textAnchor="middle"
            fontWeight={M[i] === Math.max(...M) ? 600 : 400}>{n}</text>
        ))}
        <text x={6 * (bw + gap) + bw / 2} y={mid - Math.max(...M) * unit - 8} fontSize="15"
          fontWeight="600" fill={TERRA} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
          +26%
        </text>
        <text x="0" y={h - 6} fontSize="11.5" fill="var(--muted)">against the average month</text>
      </svg>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        July and August carry the year. February is the one to survive.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THE YEAR AS ONE CONTINUOUS SHAPE. Same data, read as a season rather than
 * twelve separate readings.
 *
 * Bars invite comparison between neighbours; an area invites reading the arc.
 * A restaurant's year IS an arc, so this is arguably the truer form, and it is
 * here so that claim can be looked at rather than asserted.
 */
function OptionB() {
  /* PAD is not cosmetic. Without it the first and last points sit exactly on
     the viewBox edges, so January's marker, December's marker and both month
     labels were sliced in half by the clip. A line chart that loses its first
     and last month is missing the two the reader looks for. */
  const w = 560, h = 170, mid = 88, unit = 2.6, PAD = 16;
  const step = (w - PAD * 2) / 11;
  const px = (i: number) => PAD + i * step;
  const pts = M.map((v, i) => `${px(i)},${mid - v * unit}`).join(" ");
  const area = `${px(0)},${mid} ${pts} ${px(11)},${mid}`;
  return (
    <div style={{ maxWidth: 600 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label="The year arcs from a February trough to a July peak.">
        <polygon points={area} fill={TERRA} opacity=".14" />
        <line x1={px(0)} y1={mid} x2={px(11)} y2={mid} stroke="var(--n4)" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke={TERRA} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />
        {M.map((v, i) => {
          const peak = v === Math.max(...M) || v === Math.min(...M);
          return peak ? (
            <circle key={i} cx={px(i)} cy={mid - v * unit} r="5" fill={TERRA}
              stroke="var(--card)" strokeWidth="2" />
          ) : null;
        })}
        {NAMES.map((n, i) => (
          <text key={i} x={px(i)} y={h - 22} fontSize="11" fill="var(--faint)" textAnchor="middle">{n}</text>
        ))}
        <text x={px(6)} y={mid - Math.max(...M) * unit - 12} fontSize="14" fontWeight="600"
          fill={TERRA} textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>+26%</text>
        <text x={px(1)} y={mid - Math.min(...M) * unit + 20} fontSize="14" fontWeight="600"
          fill="var(--muted)" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>-22%</text>
      </svg>
      <p className="k" style={{ margin: "12px 0 0", maxWidth: "54ch" }}>
        The year is one arc. February and July are its ends.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * TWELVE CELLS, ONE ROW. The smallest thing that can carry a year.
 *
 * No axis, no baseline, no height to read: the month is the cell and the
 * darkness is the takings. It fits in the corner of another block, which
 * matters because he said this section was made far too wide for what it says.
 *
 * The honest cost is precision. A reader sees which months are heavy and
 * cannot read 26 per cent off it, so the two ends are labelled directly.
 */
function OptionC() {
  const cell = 44, gap = 4;
  const max = Math.max(...M.map(Math.abs));
  return (
    <div>
      <div style={{ display: "flex", gap, marginBottom: 10 }}>
        {M.map((v, i) => {
          const a = Math.abs(v) / max;
          const up = v >= 0;
          return (
            /* THE THIN MONTHS HAD TO EARN THEIR OWN RAMP. The first version put
               the negatives on a single grey at 0.10 to 0.45 opacity, and
               February at -22 was indistinguishable from March at -8. The
               caption said "February, the thinnest" and the drawing did not
               show it, which is the drawing failing and the sentence covering
               for it. Deep months now darken on the neutral ramp the same way
               busy months darken on terracotta. */
            <div key={i} title={`${FULL[i]}, ${v > 0 ? "+" : ""}${v}%`}
              style={{
                width: cell, height: cell, borderRadius: 6,
                background: up ? TERRA : "var(--n1)",
                opacity: up ? 0.18 + a * 0.82 : 0.14 + a * 0.66,
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: 4,
              }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: up && a > 0.6 ? "var(--white)" : "var(--ink-2)" }}>
                {NAMES[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 12 * cell + 11 * gap }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>February, the thinnest</span>
        <span className="fig" style={{ fontSize: 12, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
          July, +26%
        </span>
      </div>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Darker is busier. Two summer months pay for two winter ones.
      </p>
    </div>
  );
}

export default function YearOptions() {
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
              <span>Through the year, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "24ch" }}>You already specified this one.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            A is your fix, built to the letter. B and C are here because a
            specification is not the same as having seen it, and they are cheap
            now and expensive after the page is rebuilt.
          </p>
        </section>

        <Frame letter="A" name="Twelve narrow bars, your fix"
          why="Narrow and tall, above and below a baseline, in a block that is not full width. Height carries the value; width carries nothing, so width is small.">
          <OptionA />
        </Frame>

        <Frame letter="B" name="The year as one arc"
          why="Bars invite comparison between neighbours; an area invites reading the season. A restaurant year is an arc.">
          <OptionB />
        </Frame>

        <Frame letter="C" name="Twelve cells, one row"
          why="The smallest thing that can carry a year. Fits beside another block rather than taking a full row, which was the original complaint.">
          <OptionC />
        </Frame>

        <SiteFooter />
      </div>
    </div>
  );
}
