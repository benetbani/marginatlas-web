/**
 * /dev/options/scale , three drawings for good-versus-bad WITHOUT colour.
 *
 * WHY THIS FILE EXISTS. The founder ruled on 2026-08-09, asked in plain terms
 * and answered without hedging: terracotta plus cool neutrals, no green, no
 * amber, no exceptions. Measured on the served HTML, green and amber survive on
 * exactly three live page types, and on those they are not decoration:
 *
 *     /cities/london            green 40, amber 24
 *     /industries/restaurants   green 22, amber 12
 *     /decide                   green  8
 *
 * They encode good-versus-bad. CrowdingGauge is literal about it:
 *     if (v >= 66) return "fill-clay-500";   // red
 *     if (v >= 33) return "fill-amber-400";  // amber
 *     return "fill-moss-500";                // green
 *
 * So the palette rule cannot simply be applied. Deleting the hue without
 * replacing the signal takes meaning off the page rather than tidying it, and
 * that is a worse defect than the colour. The question is not "which grey" but
 * HOW A READER SHOULD SEE GOOD FROM BAD once hue is gone. That is a design
 * decision and it is his, per the standing deal: three drawings, one file.
 *
 * WHAT IS WRONG WITH THE TRAFFIC LIGHT ANYWAY, beyond the palette. It states a
 * verdict and hides the reasoning: green at 32 and amber at 33 look like a
 * different kind of thing rather than one point apart, and nothing on the page
 * says who decided that 66 is bad. Every option below has to carry the value
 * AND the reason, which the colour never did.
 *
 * OPTION C IS THE ONE I WOULD ARGUE FOR, and from BRAND.md rather than taste.
 * This site's characteristic move is to name the thing that actually decides
 * the outcome instead of implying it. A boundary drawn and labelled in words
 * is that move; a colour is the opposite of it.
 *
 * DATA. Real, from the London district multipliers already shipping on the
 * /gb/ and /us/ routes, the same figures the 2026-08-08 clamp work verified.
 * Nothing here is invented. Three districts sit exactly on the 3.0 ceiling, so
 * they read "at least", which is the fix that shipped for the clip.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { DivergingBars, type DivergingRow } from "@/components/spine2/DivergingBars";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Good and bad without colour, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

/* Real district rent multipliers against the London city rate. The three at
   3.000 are ON the model's ceiling, so they are bounds, not readings. */
const D = [
  { name: "City of London", mult: 3.0, clipped: true },
  { name: "West End", mult: 3.0, clipped: true },
  { name: "South Bank", mult: 3.0, clipped: true },
  { name: "Shoreditch", mult: 1.612, clipped: false },
  { name: "Soho", mult: 1.551, clipped: false },
];
/* The boundary the FIRST version of option C named, kept only because A still
   refers to a threshold. It is not used by the ruled drawing. */
const BOUNDARY = 1.8;

/* ALL SEVEN London districts, read out of getNeighborhoodMultiplier on
   2026-08-09 rather than transcribed: 3.00 / 3.00 / 3.00 / 1.54 / 1.45 / 1.43 /
   1.29. The first three sit on the model's 3.0 ceiling and are floors, which is
   why they carry `clipped` and render "at least".
   The five-district set above is the one the earlier options used; this is the
   full scheme, because a chart about distance from the average needs the whole
   set or the average is not the average. */
const DISTRICTS: DivergingRow[] = [
  { label: "City of London", value: 3.0, clipped: true },
  { label: "West End", value: 3.0, clipped: true },
  { label: "South Bank", value: 3.0, clipped: true },
  { label: "West London", value: 1.54 },
  { label: "North London", value: 1.45 },
  { label: "East London", value: 1.43 },
  { label: "South London", value: 1.29 },
];

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
        Reads good from bad by {leads}. Caption is {words} words, budget 20.
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
 * THE LABELLED TRACK. Direction is carried by two words, not by a hue.
 *
 * One rule from "cheap" to "dear", the neutral ramp for the ticks, a single
 * terracotta pip for the district being read. A reader knows which end is bad
 * because the end says so. This is the cheapest possible replacement and it
 * needs no new component: it is a scale, which is on the ratified list of
 * familiar forms.
 *
 * Its weakness, stated: it says where, never why.
 */
function OptionA() {
  const W = 560, H = 74, pad = 14;
  const max = 3.2;
  const x = (m: number) => pad + ((W - pad * 2) * m) / max;
  return (
    <div style={{ maxWidth: "60%" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Rent against the London rate, from cheap to dear. Shoreditch sits at 1.6 times.">
        <line x1={pad} y1={38} x2={W - pad} y2={38} stroke="var(--n4)" strokeWidth={2} />
        {[0, 1, 2, 3].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={32} x2={x(t)} y2={44} stroke="var(--n3)" strokeWidth={1.5} />
            <text x={x(t)} y={60} textAnchor="middle" fontSize={11} fill="var(--muted)">{t}x</text>
          </g>
        ))}
        <circle cx={x(1.612)} cy={38} r={7} fill={TERRA} />
        <text x={x(1.612)} y={20} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>1.6x</text>
        <text x={pad} y={74} fontSize={11.5} fill="var(--muted)">cheaper</text>
        <text x={W - pad} y={74} textAnchor="end" fontSize={11.5} fill="var(--muted)">dearer</text>
      </svg>
      <p style={{ fontSize: 13, color: INK, marginTop: 12 }}>
        Shoreditch rent runs 1.6 times the London rate.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ B */
/**
 * THE PEER COLUMN. Good and bad come from company, not from colour.
 *
 * Every district on one shared baseline, ordered, the one being read in
 * terracotta and the rest on the neutral ramp. A reader judges by who is above
 * and below, which is how anyone actually reads a league table, and the form is
 * already ratified: bars from a shared baseline with the figure on the bar.
 *
 * It also solves something the traffic light could not: the three districts on
 * the model's ceiling are visibly tied AND marked "at least", so the bound
 * reads as a bound instead of a measurement.
 */
function OptionB() {
  const max = 3.2;
  return (
    <div style={{ maxWidth: "60%" }}>
      {D.map((d) => {
        const isSubject = d.name === "Shoreditch";
        return (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
            <span style={{ width: 116, fontSize: 12.5, color: isSubject ? INK : "var(--muted)", fontWeight: isSubject ? 600 : 400, flex: "none" }}>
              {d.name}
            </span>
            <span style={{ flex: 1, height: 22, background: "var(--n1)", borderRadius: 2, position: "relative" }}>
              <span style={{
                position: "absolute", inset: 0, width: `${(d.mult / max) * 100}%`,
                background: isSubject ? TERRA : "var(--n4)", borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 7,
              }}>
                <span className="fig" style={{ fontSize: 12, fontWeight: 600, color: "var(--paper)", fontVariantNumeric: "tabular-nums" }}>
                  {d.clipped ? "at least 3.0x" : `${d.mult.toFixed(1)}x`}
                </span>
              </span>
            </span>
          </div>
        );
      })}
      <p style={{ fontSize: 13, color: INK, marginTop: 12 }}>
        Shoreditch is the cheapest lease of the five.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ C */
/**
 * DISTANCE FROM THE AVERAGE. RULED 2026-08-09, and this is the corrected C.
 *
 * His verdict on the first version: "closer to version C, but you have made a
 * mistake, this C is not very smart. You should put the average on the center,
 * and then from the average say how far you'd lie on the right side ... and on
 * the left side, minus that. That's the actual difference."
 *
 * He is right and the first version was weaker than I argued. It drew a
 * boundary I had chosen and measured every district against MY line. This
 * measures them against EACH OTHER, so the drawing carries a fact rather than
 * my opinion of where bad starts, and it needs no threshold to defend.
 *
 * ONE CORRECTION THE DATA FORCED, and it is why the centre is the average of
 * the districts rather than the city rate. Measured across four cities: every
 * London district is above the city rate, 7 of 7, as is every district in Paris
 * and Tokyo, because 13 of the 14 rent tags push above 1.0. Centred there, every
 * bar would be terracotta and the grey side would never appear. Against the
 * average of the set, London splits 3 right and 4 left.
 */
function OptionC() {
  return (
    <div>
      <DivergingBars rows={DISTRICTS} />
      <p style={{ fontSize: 13, color: INK, marginTop: 16 }}>
        Three districts cost double what the other four do.
      </p>
    </div>
  );
}

export default function ScaleOptionsPage() {
  return (
    <>
      <Place />
      <main className="wrap av2">
        <section className="panel pad" style={{ marginTop: 24 }}>
          <h1 style={{ fontSize: 21, fontWeight: 600, color: INK, marginBottom: 8 }}>
            Good and bad, without colour
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 640 }}>
            You ruled: terracotta and neutrals only, no green, no amber. Those two
            colours are still doing a job on three pages , they are how a reader
            currently tells a good score from a bad one. Below are three ways to
            keep that meaning without them. Pick one and it becomes the rule
            everywhere.
          </p>
        </section>

        <Frame letter="A" name="The labelled track" leads="position, with the ends named" words={8}>
          <OptionA />
        </Frame>
        <Frame letter="B" name="The peer column" leads="company, ordered against neighbours" words={7}>
          <OptionB />
        </Frame>
        <Frame letter="C" name="The stated boundary" leads="a named line, with its reason" words={11}>
          <OptionC />
        </Frame>

        <section className="panel pad" style={{ marginTop: 18 }}>
          <p style={{ fontSize: 13, color: INK, lineHeight: 1.65, maxWidth: 640 }}>
            My argument is for C. A colour asserts a verdict and hides who decided
            it: nothing on the page today says why 66 is bad and 65 is not. C draws
            the same line but says what it is, which is the move this site is built
            on. A is the cheapest and works anywhere. B is the strongest when the
            reader knows the neighbours.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
