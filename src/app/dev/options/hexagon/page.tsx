/**
 * /dev/options/hexagon , three ways to get the country shape down to six.
 *
 * HIS RULING, 2026-08-09: "you have made those from the core idea of hexagon.
 * You have gone to ten different qualities. We only go with a hexagon, only six
 * parameters. That became quickly disgusting."
 *
 * Measured: it is NINE, not ten, and the file header calls them "the nine
 * judgment lenses". LENS_ORDER in CountryShape has nine entries and
 * polygonPath draws one side per entry, so the page renders an enneagon.
 *
 * TWO OF THE NINE ARE NOT DATA. `momentum` and `path` are pushed with a
 * hardcoded score of 0.5 and sample:true, because trend data is not held. They
 * are honest (they carry the sample tag) and they are still two sides of a
 * polygon carrying no information. They go in every option below, which is not
 * a decision he needs to make.
 *
 * That leaves SEVEN real lenses for six slots, and the whole question is which
 * one goes. Each option answers it differently.
 *
 * WHAT EACH LENS ACTUALLY READS, from the source rather than the label:
 *   Reward   tax load, what the owner keeps
 *   Cost     cost-of-living index
 *   Entry    ease of starting a business
 *   People   salary level, the talent bill
 *   Demand   GDP per capita + net wealth, averaged
 *   Edge     1 - selfEmploymentPct / 60
 *   Risk     corruption perception + ease of business, averaged
 *
 * NO SCORES ARE DRAWN HERE, DELIBERATELY. The decision is which six axes, not
 * what any country scores on them, and drawing a country's real shape three
 * times would invite a judgement about the data instead of the form. Each
 * hexagon is a greyed skeleton with its axes labelled, which is the empty-state
 * pattern this project already settled on: show what the drawing WILL hold,
 * never invent a figure to fill it.
 */
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Six lenses, three options , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const TERRA = "var(--terra)";
const INK = "var(--ink)";

const R = 92;
const VB = 260;
const CX = VB / 2;
const CY = VB / 2 + 4;

function point(i: number, radius: number): [number, number] {
  const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

/** A greyed six-axis skeleton with its axes named. No values: none are held. */
function Hexagon({ axes, merged }: { axes: string[]; merged?: string }) {
  const ring = (r: number) =>
    Array.from({ length: 6 }, (_, i) => point(i, r).join(",")).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${VB} ${VB}`} role="img"
      aria-label={`A six-axis shape: ${axes.join(", ")}.`} style={{ maxWidth: 260 }}>
      {[0.4, 0.7, 1].map((f) => (
        <polygon key={f} points={ring(R * f)} fill="none" stroke="var(--n2)" strokeWidth={1} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--n2)" strokeWidth={1} />;
      })}
      {axes.map((label, i) => {
        const [x, y] = point(i, R + 20);
        const anchor = Math.abs(x - CX) < 6 ? "middle" : x > CX ? "start" : "end";
        const isMerged = label === merged;
        return (
          <text key={label} x={x} y={y + 4} textAnchor={anchor}
            fontSize={11.5} fontWeight={isMerged ? 600 : 400}
            fill={isMerged ? TERRA : "var(--muted)"}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function Frame({
  letter, name, cut, why, axes, merged,
}: {
  letter: string; name: string; cut: string; why: string; axes: string[]; merged?: string;
}) {
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: 24, fontWeight: 600, color: TERRA }}>{letter}</span>
        <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 20 }}>{cut}</div>
      <div style={{ borderTop: "1px solid var(--hair)", paddingTop: 22, display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
        <Hexagon axes={axes} merged={merged} />
        <p style={{ fontSize: 13, color: INK, lineHeight: 1.65, maxWidth: 330 }}>{why}</p>
      </div>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid var(--hair)", fontSize: 12, color: "var(--faint)" }}>
        {letter} , yes / no
      </div>
    </section>
  );
}

export default function HexagonOptionsPage() {
  return (
    <>
      <Place />
      <main className="wrap av2">
        <section className="panel pad" style={{ marginTop: 24 }}>
          <h1 style={{ fontSize: 21, fontWeight: 600, color: INK, marginBottom: 8 }}>
            Six lenses, not nine
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 660 }}>
            The country shape draws nine sides today. Two of them, Momentum and
            Path, are placeholders: no trend data is held, so both are pinned at
            mid-scale. They go in all three options and are not a decision. That
            leaves seven real lenses for six slots, and the only question is
            which one goes.
          </p>
        </section>

        <Frame
          letter="A"
          name="Drop Edge , RATIFIED, and shipped with his renames"
          cut="Reward, Cost, Ease of entry, Talent, Purchasing power, Risk. Nothing merges."
          axes={["Reward", "Cost", "Ease of entry", "Talent", "Purchasing power", "Risk"]}
          why="Edge is one minus self-employment share over sixty. High self-employment mostly means informal work, not an empty market: it runs near ninety per cent in low-income countries. So the lens reads highest where an economy is poorest, which is the opposite of the thing it claims to measure. This project already rejected a rule with exactly that confound, the wage-to-GDP band, on exactly this reasoning. Every surviving lens keeps its own source and none is diluted by an average."
        />

        <Frame
          letter="B"
          name="Merge Entry and Risk"
          cut="Reward, Cost, Rules, People, Demand, Edge. Two become one."
          axes={["Reward", "Cost", "Rules", "People", "Demand", "Edge"]}
          merged="Rules"
          why="Entry reads ease of starting a business. Risk averages corruption perception with ease of business. They share an input, so the shape counts it twice and a country with easy paperwork is pushed outward on two axes for one fact. Merging them into Rules removes the double count and keeps Edge. The cost is a broader lens with two meanings inside it, which is the thing averages do to a measurement."
        />

        <Frame
          letter="C"
          name="Drop Risk"
          cut="Reward, Cost, Entry, People, Demand, Edge. Nothing merges."
          axes={["Reward", "Cost", "Entry", "People", "Demand", "Edge"]}
          why="The mirror of B. Rather than fusing the two overlapping lenses, keep the sharper one: Entry reads a single thing from a single source, while Risk is already an average of two. It keeps Edge, so it only holds if the self-employment proxy is defensible, which is the argument against it."
        />

        <section className="panel pad" style={{ marginTop: 18 }}>
          <p style={{ fontSize: 13, color: INK, lineHeight: 1.65, maxWidth: 660 }}>
            <strong>Ruled: A, and it is live.</strong> He also renamed four axes
            so each says what it reads: People became Talent, Entry became Ease
            of entry, Demand became Purchasing power. Cost, Risk and Reward were
            already right and are unchanged. B and C stay on this page as the
            record of what was weighed, not as live choices.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
