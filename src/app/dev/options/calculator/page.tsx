"use client";

/**
 * /dev/options/calculator , three drawings for the calculator.
 *
 * THEY ARE LIVE ON PURPOSE. The whole complaint is that the sliders do not
 * look draggable, and a screenshot cannot answer that. Drag them.
 *
 * WHAT HE SAID, and every one of these is addressed below:
 *   "the levers are not dominant enough, the person does not understand they
 *    can be moved"                                          , the handle
 *   "the icon you have chosen does not look like a lever"    , the handle
 *   "is this per month or per year, they will be distorted"  , the unit
 *   "the icons are very small to be understood"              , 24px not 13px
 *   "the average visitor will just skip it"                  , the payoff
 *   "the title can be in the middle of the horizontal bar, the numbers on top,
 *    and the bars should take more vertical space"           , option A IS this
 *   "the problem that there are no currencies is still evident even here"
 *                                                            , the switcher
 *
 * ONE THING DELIBERATELY CONSTANT ACROSS ALL THREE: every row states its unit
 * in the row. "Staff cost" alone is the defect he named. "Staff cost, a year"
 * is not.
 */
import * as React from "react";

import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";

import "@/styles/atlas-spine.css";

const TERRA = "var(--terra)";

/* Two currencies, because the point is that a drawing must survive the long
   one. Rates are illustrative on a dev route. */
/**
 * The formatter has to survive BOTH ends of the range and the first version did
 * not. It divided everything by a thousand, so "average spend, a head" at $38
 * rendered as "$0K" on the very first screenshot. A calculator whose input
 * reads zero while its handle sits mid-track is worse than no calculator.
 */
const CUR = {
  USD: {
    sym: "$",
    fmt: (n: number) =>
      n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n)}`,
  },
  /* Indonesian steps in thousands the way English does, and it has its own
     words for them: ribu, juta, miliar. "Rp 3234 jt" is the same mistake as
     writing "$3234 thousand", so the ladder is walked properly. This is the
     kind of thing a currency switcher gets wrong when it is bolted on at the
     end rather than designed into the figure, which is why it is being built
     alongside the drawings and not after them. */
  IDR: {
    sym: "Rp",
    fmt: (n: number) => {
      /* ACTUAL RUPIAH, not thousands of them. The first version scaled in
         thousands and then compared against the plain ladder, so $210K rendered
         as "Rp 3.2 tr", triliun, when it is miliar. Off by a factor of a
         thousand, and it looked entirely plausible.
         ribu 10^3, juta 10^6, miliar 10^9, triliun 10^12. */
      const r = n * 15_400;
      if (r >= 1e12) return `Rp ${(r / 1e12).toFixed(1)} tr`;
      if (r >= 1e9) return `Rp ${(r / 1e9).toFixed(r >= 1e10 ? 0 : 1)} mld`;
      if (r >= 1e6) return `Rp ${Math.round(r / 1e6)} jt`;
      return `Rp ${Math.round(r / 1e3)} rb`;
    },
  },
} as const;
type CurKey = keyof typeof CUR;

type Lever = {
  id: string;
  icon: GlyphId;
  label: string;
  unit: string;
  min: number;
  max: number;
  init: number;
  money: boolean;
  suffix?: string;
};

const LEVERS: Lever[] = [
  { id: "orders", icon: "footfall", label: "Orders", unit: "a day", min: 30, max: 90, init: 52, money: false },
  { id: "spend", icon: "price-per-unit", label: "Average spend", unit: "a head", min: 22, max: 70, init: 38, money: true },
  { id: "food", icon: "supplier", label: "Food and drink", unit: "share of takings", min: 22, max: 40, init: 31, money: false, suffix: "%" },
  { id: "staff", icon: "wages", label: "Staff cost", unit: "a year", min: 150000, max: 290000, init: 210000, money: true },
  { id: "rent", icon: "commercial-rent", label: "Rent and rates", unit: "a year", min: 40000, max: 130000, init: 80000, money: true },
];

function useLevers() {
  const [v, setV] = React.useState<Record<string, number>>(
    Object.fromEntries(LEVERS.map((l) => [l.id, l.init])),
  );
  const set = (id: string, n: number) => setV((p) => ({ ...p, [id]: n }));
  /* The one number the reader is here for. Revenue less the three cost lines,
     with running costs held at the modelled share. */
  const revenue = v.orders * v.spend * 313;
  const keep = Math.max(0, revenue - revenue * (v.food / 100) - v.staff - v.rent - revenue * 0.15);
  return { v, set, revenue, keep };
}

function money(n: number, c: CurKey) {
  return CUR[c].fmt(n);
}

function Frame({
  letter,
  name,
  fixes,
  children,
}: {
  letter: string;
  name: string;
  fixes: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 3 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 22 }}>{fixes}</div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 24 }}>{children}</div>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ A */
/**
 * HIS OWN LAYOUT, DRAWN. Label centred on the track, value above it, and the
 * track thick enough to read as a thing you push rather than a hairline.
 *
 * The handle is 30px with a visible grip and a grab cursor. That is the
 * affordance fix: a 12px dot on a 3px line is a decoration, a 30px handle with
 * three grip lines is a control, and nobody has to be told which.
 */
function OptionA({ cur }: { cur: CurKey }) {
  const { v, set, keep } = useLevers();
  return (
    <div>
      {LEVERS.map((l) => {
        const pct = ((v[l.id] - l.min) / (l.max - l.min)) * 100;
        const shown = l.money ? money(v[l.id], cur) : `${v[l.id]}${l.suffix ?? ""}`;
        return (
          <div key={l.id} style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <GlyphIcon id={l.icon} size={24} />
              <span className="fig" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                {shown}
              </span>
            </div>
            <div style={{ position: "relative", height: 34 }}>
              <input
                type="range"
                aria-label={`${l.label}, ${l.unit}`}
                min={l.min}
                max={l.max}
                step={l.money && l.max > 1000 ? 1000 : 1}
                value={v[l.id]}
                onChange={(e) => set(l.id, Number(e.target.value))}
                style={{ position: "absolute", inset: 0, width: "100%", height: 34, opacity: 0, cursor: "grab", zIndex: 2 }}
              />
              {/* the track, thick */}
              <div style={{ position: "absolute", top: 9, left: 0, right: 0, height: 16, borderRadius: 8, background: "var(--n5)" }} />
              <div style={{ position: "absolute", top: 9, left: 0, width: `${pct}%`, height: 16, borderRadius: 8, background: "var(--n4)" }} />
              {/* the label, ON the track, which is what he asked for */}
              <div style={{ position: "absolute", top: 11, left: 14, fontSize: 12, color: "var(--ink-2)", pointerEvents: "none" }}>
                {l.label}, {l.unit}
              </div>
              {/* THE HANDLE. 30px, gripped, unmistakable. */}
              <div
                style={{
                  position: "absolute", top: 2, left: `calc(${pct}% - 15px)`,
                  width: 30, height: 30, borderRadius: 9, background: TERRA,
                  boxShadow: "var(--lift-control)", pointerEvents: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
                }}
              >
                <span style={{ width: 1.5, height: 12, background: "rgba(255,255,255,.75)", borderRadius: 1 }} />
                <span style={{ width: 1.5, height: 12, background: "rgba(255,255,255,.75)", borderRadius: 1 }} />
                <span style={{ width: 1.5, height: 12, background: "rgba(255,255,255,.75)", borderRadius: 1 }} />
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 16, display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>You would keep</span>
        <span className="fig" style={{ fontSize: 40, fontWeight: 600, color: TERRA, fontVariantNumeric: "tabular-nums" }}>
          {money(keep, cur)}
        </span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>a year</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THE ANSWER FIRST, THE LEVERS UNDER IT.
 *
 * "The average visitor will just skip it" is not fixed by a better slider. It
 * is fixed by showing the payoff BEFORE anything is touched, so the reader
 * knows what moving something will change. The keep figure is the biggest thing
 * on the block and it moves while you drag.
 *
 * Ratified rule, and it fits here exactly: answer first, controls below.
 */
function OptionB({ cur }: { cur: CurKey }) {
  const { v, set, keep, revenue } = useLevers();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
        <span className="fig" style={{ fontSize: 54, fontWeight: 600, color: TERRA, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {money(keep, cur)}
        </span>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>
          is yours, on {money(revenue, cur)} of takings
        </span>
      </div>
      <p className="k" style={{ margin: "0 0 22px", maxWidth: "52ch" }}>
        Drag any line. The figure above moves with it.
      </p>

      {LEVERS.map((l) => {
        const pct = ((v[l.id] - l.min) / (l.max - l.min)) * 100;
        const shown = l.money ? money(v[l.id], cur) : `${v[l.id]}${l.suffix ?? ""}`;
        return (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "26px minmax(0,1fr) 96px", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <GlyphIcon id={l.icon} size={24} />
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>
                {l.label}, {l.unit}
              </div>
              <div style={{ position: "relative", height: 24 }}>
                <input
                  type="range" aria-label={`${l.label}, ${l.unit}`}
                  min={l.min} max={l.max} step={l.money && l.max > 1000 ? 1000 : 1}
                  value={v[l.id]} onChange={(e) => set(l.id, Number(e.target.value))}
                  style={{ position: "absolute", inset: 0, width: "100%", height: 24, opacity: 0, cursor: "grab", zIndex: 2 }}
                />
                <div style={{ position: "absolute", top: 9, left: 0, right: 0, height: 6, borderRadius: 3, background: "var(--n5)" }} />
                <div style={{ position: "absolute", top: 9, left: 0, width: `${pct}%`, height: 6, borderRadius: 3, background: TERRA, opacity: .35 }} />
                <div style={{
                  position: "absolute", top: 0, left: `calc(${pct}% - 12px)`, width: 24, height: 24,
                  borderRadius: 8, background: "var(--card)", border: `2px solid ${TERRA}`,
                  boxShadow: "var(--lift-control)", pointerEvents: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
                }}>
                  <span style={{ width: 1.5, height: 9, background: TERRA, borderRadius: 1 }} />
                  <span style={{ width: 1.5, height: 9, background: TERRA, borderRadius: 1 }} />
                </div>
              </div>
            </div>
            <span className="fig" style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {shown}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * WHAT EACH LINE COSTS YOU, AS A STACK THAT MOVES.
 *
 * The other two are a form. This one is a drawing: the five lines are a
 * proportional stack of the takings and dragging a lever visibly takes a bite
 * out of what is left. A reader who never touches a control still learns the
 * shape, which is the honest answer to "the average visitor will skip it."
 */
function OptionC({ cur }: { cur: CurKey }) {
  const { v, set, keep, revenue } = useLevers();
  const parts = [
    { label: "Food and drink", val: revenue * (v.food / 100), tone: "var(--n2)" },
    { label: "Staff", val: v.staff, tone: "var(--n3)" },
    { label: "Running costs", val: revenue * 0.15, tone: "var(--n4)" },
    { label: "Rent and rates", val: v.rent, tone: "var(--n5)" },
    { label: "You keep", val: keep, tone: TERRA },
  ];
  const total = parts.reduce((s, p) => s + p.val, 0) || 1;
  return (
    <div>
      <div style={{ display: "flex", height: 54, borderRadius: 8, overflow: "hidden", gap: 2, marginBottom: 10 }}>
        {parts.map((p) => (
          <div key={p.label} title={`${p.label} ${money(p.val, cur)}`}
            style={{ width: `${(p.val / total) * 100}%`, background: p.tone, minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginBottom: 22 }}>
        {parts.map((p) => (
          <span key={p.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: p.tone }} />
            <span style={{ color: p.label === "You keep" ? "var(--ink)" : "var(--muted)", fontWeight: p.label === "You keep" ? 600 : 400 }}>
              {p.label}
            </span>
            <span className="fig" style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>
              {money(p.val, cur)}
            </span>
          </span>
        ))}
      </div>

      {LEVERS.map((l) => {
        const pct = ((v[l.id] - l.min) / (l.max - l.min)) * 100;
        const shown = l.money ? money(v[l.id], cur) : `${v[l.id]}${l.suffix ?? ""}`;
        return (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <GlyphIcon id={l.icon} size={24} />
            <span style={{ fontSize: 12, color: "var(--muted)", width: 168, flex: "none" }}>
              {l.label}, {l.unit}
            </span>
            <div style={{ position: "relative", height: 26, flex: 1 }}>
              <input
                type="range" aria-label={`${l.label}, ${l.unit}`}
                min={l.min} max={l.max} step={l.money && l.max > 1000 ? 1000 : 1}
                value={v[l.id]} onChange={(e) => set(l.id, Number(e.target.value))}
                style={{ position: "absolute", inset: 0, width: "100%", height: 26, opacity: 0, cursor: "grab", zIndex: 2 }}
              />
              <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 6, borderRadius: 3, background: "var(--n5)" }} />
              <div style={{
                position: "absolute", top: 1, left: `calc(${pct}% - 12px)`, width: 24, height: 24, borderRadius: 12,
                background: TERRA, boxShadow: "var(--lift-control)", pointerEvents: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ width: 10, height: 2, background: "rgba(255,255,255,.85)", borderRadius: 1 }} />
              </div>
            </div>
            <span className="fig" style={{ fontSize: 14, fontWeight: 600, width: 92, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {shown}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function CalculatorOptions() {
  const [cur, setCur] = React.useState<CurKey>("USD");
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
              <span>Calculator, three options</span>
            </nav>
          </div>
        </header>

        <section className="glass rise" style={{ padding: "28px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "24ch" }}>Three calculators. Drag them.</h1>
          <p className="k" style={{ margin: "14px 0 0", maxWidth: "56ch" }}>
            A screenshot cannot tell you whether a slider looks draggable. These
            work.
          </p>
          <div style={{ marginTop: 18, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Currency</span>
            {(["USD", "IDR"] as CurKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setCur(k)}
                className={cur === k ? "chip chip-a" : "chip"}
                style={{ cursor: "pointer", minHeight: 34 }}
              >
                {k === "USD" ? "Dollar" : "Rupiah"}
              </button>
            ))}
          </div>
        </section>

        <Frame letter="A" name="Your layout, drawn"
          fixes="Label on the track, figure above it, a thick bar and a 30px gripped handle. Every row states its unit.">
          <OptionA cur={cur} />
        </Frame>

        <Frame letter="B" name="Answer first, levers under it"
          fixes="The keep figure leads and moves as you drag, so a reader who never touches a control still gets the payoff.">
          <OptionB cur={cur} />
        </Frame>

        <Frame letter="C" name="The stack that moves"
          fixes="Not a form but a drawing: dragging visibly takes a bite out of what is left.">
          <OptionC cur={cur} />
        </Frame>

        <SiteFooter />
      </div>
    </div>
  );
}
