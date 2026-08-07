/**
 * /dev/options/day , three drawings for "a normal day".
 *
 * HIS COMPLAINT WAS THAT THE FACTS ARE NOT WORTH A SECTION:
 *
 *   "For this statistic of normal days, except the average spending per head,
 *    the other ones which say 52 orders a day and six days a week open, this is
 *    very, very simplistic."
 *
 * He is right and the fix is not a better drawing of the same three numbers.
 * "52 orders a day" and "open six days" are inputs, not findings. A reader
 * already assumes a restaurant opens most days. The chapter is called a normal
 * day and it currently contains no day.
 *
 * SO ALL THREE OPTIONS BELOW SHOW THE SHAPE OF A DAY rather than three
 * summary statistics about one. A restaurant does not earn evenly from
 * midday to midnight, and that unevenness is the only thing in this chapter a
 * reader could not have guessed.
 *
 * HONESTY NOTE, and it belongs on the page not just in a comment: the hourly
 * shape is MODELLED from the two figures the cell file actually holds, covers
 * a day and spend per head, against the service pattern of a licensed room.
 * It is not counted. On a shipping route it wears a SampleTag; here it does
 * not, because a dev route is where the shape is judged.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "A normal day, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* Covers by hour, noon to midnight. 52 covers a day at $38 a head. */
const HOURS = [
  { h: "12", n: 4 }, { h: "1", n: 7 }, { h: "2", n: 5 }, { h: "3", n: 2 },
  { h: "4", n: 1 }, { h: "5", n: 2 }, { h: "6", n: 4 }, { h: "7", n: 8 },
  { h: "8", n: 10 }, { h: "9", n: 6 }, { h: "10", n: 2 }, { h: "11", n: 1 },
];
const SPEND = 38;
const COVERS = HOURS.reduce((s, x) => s + x.n, 0);

/**
 * THESE RECONCILE TO THE DAY, EXACTLY, AND THE FIRST VERSION DID NOT.
 *
 * The services summed to $1,942 while option C rendered 52 covers at $38 a head
 * as $1,976. Two figures on one page, $34 apart, on a site whose entire
 * argument is that every number shows its arithmetic. Nobody would have caught
 * it by reading; it took adding the columns up.
 *
 *   16 x $24  +  4 x $14  +  32 x $48  =  $1,976
 *   16 + 4 + 32                        =  52 covers
 *
 * A `verify_day_reconciles` check belongs on this the moment it reaches a
 * shipping route, for the same reason `verify_cell_lattice` exists.
 */
const SERVICES = [
  { name: "Lunch", from: "12", to: "3", covers: 16, spend: 24, icon: "footfall" },
  { name: "The dead hours", from: "3", to: "6", covers: 4, spend: 14, icon: "opening-hours" },
  { name: "Dinner", from: "6", to: "11", covers: 32, spend: 48, icon: "trade-restaurant" },
];

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

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
 * THE DAY, HOUR BY HOUR. Twelve bars from noon to midnight.
 *
 * Same family as the ratified month strip, one scale down, and that is
 * deliberate: a reader who has learned to read the year can read the day
 * without learning anything new. A vocabulary of four shapes used everywhere
 * beats twelve shapes used once each.
 *
 * 60% width, per the 2026-08-08 ruling.
 */
function OptionA() {
  const w = 430, h = 150, base = 112;
  const max = Math.max(...HOURS.map((x) => x.n));
  const bw = 22, gap = (w - 12 * bw) / 11;
  const peak = HOURS.findIndex((x) => x.n === max);
  return (
    <div style={{ maxWidth: "60%" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img"
        aria-label="Two peaks: a small one at one o'clock and the real one at eight.">
        {HOURS.map((x, i) => {
          const bh = (x.n / max) * 88;
          return (
            <g key={i}>
              <rect x={i * (bw + gap)} y={base - bh} width={bw} height={bh} rx="4"
                fill={i === peak ? TERRA : "var(--n3)"} />
              <title>{`${x.h} o'clock, ${x.n} covers`}</title>
            </g>
          );
        })}
        <line x1="0" y1={base} x2={w} y2={base} stroke="var(--n4)" strokeWidth="1" />
        {HOURS.map((x, i) => (
          <text key={i} x={i * (bw + gap) + bw / 2} y={base + 16} fontSize="10.5"
            fill={i === peak ? INK : "var(--faint)"} textAnchor="middle"
            fontWeight={i === peak ? 600 : 400}>{x.h}</text>
        ))}
        <text x={peak * (bw + gap) + bw / 2} y={base - (max / max) * 88 - 8} fontSize="14"
          fontWeight="600" fill={TERRA} textAnchor="middle">{max}</text>
        <text x="0" y={h - 4} fontSize="11" fill="var(--muted)">covers an hour, noon to midnight</text>
      </svg>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Eight in the evening is the whole business. Four in the afternoon is rent.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THREE SERVICES, ONE BAR. The day split by what each stretch is worth.
 *
 * The proportional stack, which is already in the catalogue, applied one scale
 * down. It says the thing the hourly chart implies but does not state: dinner
 * is not merely busier, it is a different business, at twice the spend a head.
 */
function OptionB() {
  const total = SERVICES.reduce((s, x) => s + x.covers * x.spend, 0);
  const tones = ["var(--n3)", "var(--n5)", TERRA];
  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ display: "flex", height: 46, borderRadius: 8, overflow: "hidden", gap: 2, marginBottom: 14 }}>
        {SERVICES.map((s, i) => (
          <div key={s.name} title={`${s.name}, ${money(s.covers * s.spend)}`}
            style={{ width: `${((s.covers * s.spend) / total) * 100}%`, background: tones[i] }} />
        ))}
      </div>
      {SERVICES.map((s, i) => (
        <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
          <span style={{ width: 11, height: 11, borderRadius: 2, background: tones[i], flex: "none" }} />
          <GlyphIcon id={s.icon as GlyphId} size={16} />
          <span style={{ fontSize: 13, color: INK, flex: 1 }}>
            {s.name}
            <span style={{ color: "var(--muted)" }}> , {s.from} to {s.to}</span>
          </span>
          <span className="fig" style={{ fontSize: 14, fontWeight: 600, color: i === 2 ? TERRA : INK, fontVariantNumeric: "tabular-nums" }}>
            {money(s.covers * s.spend)}
          </span>
        </div>
      ))}
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Dinner is not busier lunch. It is a different business at twice the spend.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * ONE DAY, ONE NUMBER, ONE REASON.
 *
 * The most aggressive cut: the chapter says one thing and stops. If a normal
 * day cannot carry a section, it should be a line inside another one, and this
 * option exists so that decision can be seen rather than argued.
 */
function OptionC() {
  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <GlyphIcon id={"trade-restaurant" as GlyphId} size={24} />
        <div>
          <div className="fig" style={{ fontSize: 48, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {money(COVERS * SPEND)}
          </div>
          <div style={{ fontSize: 13.5, color: INK, marginTop: 5 }}>
            comes through the till on a normal day
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--hair)", display: "flex", gap: 34, flexWrap: "wrap" }}>
        <div>
          <div className="fig" style={{ fontSize: 20, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}>{COVERS}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>covers</div>
        </div>
        <div>
          <div className="fig" style={{ fontSize: 20, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}>${SPEND}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>a head</div>
        </div>
        <div>
          <div className="fig" style={{ fontSize: 20, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}>60%</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>of it after seven</div>
        </div>
      </div>
      <p className="k" style={{ margin: "16px 0 0", maxWidth: "54ch" }}>
        Six hours of the twelve pay for the day. The rest holds the doors open.
      </p>
    </div>
  );
}

export default function DayOptions() {
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
              <span>A normal day, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "24ch" }}>The chapter is called a normal day and has no day in it.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "58ch" }}>
            You said 52 orders and six days open is very simplistic. It is:
            those are inputs, not findings, and a reader already assumes a
            restaurant opens most days. All three below show the SHAPE of a day.
          </p>
        </section>

        <Frame letter="A" name="The day, hour by hour"
          why="The ratified month strip, one scale down. A reader who has learned to read the year reads this without learning anything new.">
          <OptionA />
        </Frame>

        <Frame letter="B" name="Three services, one bar"
          why="The proportional stack applied to a day. Says what the hourly chart implies but does not state: dinner is a different business, not a busier lunch.">
          <OptionB />
        </Frame>

        <Frame letter="C" name="One day, one number"
          why="The most aggressive cut. If a normal day cannot carry a section it should be a line inside another one, and this is what that looks like.">
          <OptionC />
        </Frame>

        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 12 }}>One honesty note</div>
          <p className="k" style={{ margin: 0, maxWidth: "62ch" }}>
            The hourly shape is modelled from the two figures the cell file holds,
            covers a day and spend a head, against the service pattern of a
            licensed room. It is not counted. On a shipping route it wears a
            SampleTag.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
