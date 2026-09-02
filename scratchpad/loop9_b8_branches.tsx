/**
 * THROWAWAY. B8's branches, loop run 9.
 *
 * A4's rule, kept by B2, B3 and B6: photograph the BRANCHES, not the fixture.
 * The United Kingdom is a three-tier country and it is the only shape the eight
 * rendered pages hold, but `data/legal/business_formation_costs_v1.json` carries
 * 107 countries at three tiers, 30 at two, 13 at four and TWO AT FIVE. The
 * five-tier case is the one that decided this row against OptionCards, which
 * refuses five outright, so it has to be looked at rather than argued about.
 *
 * The static render also never opens a panel, because the page is server-rendered
 * with the disclosure closed, so the open state had never been photographed at
 * all. Case 6 renders the shipped panel markup directly, which is what `TierPanel`
 * is exported for.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop9_b8_branches.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { SetupTiers, TierPanel, type SetupTier } from "../src/components/spine/country/setup-tiers";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

/* 624 is the card's real width on the country page's 3-2 band; 343 is a
   full-width phone card; 420 is the same card at the md two-up width, which is
   the narrow-card-on-a-wide-screen case run 7 named. */
const W = [624, 420, 343];

const GB: SetupTier[] = [
  { tier: "Sole Trader", local_term: "Sole Trader", cost_usd: 0, days: 1, complexity_1_5: 1 },
  { tier: "LLC", local_term: "Private Limited Company (Ltd)", cost_usd: 15, days: 1, complexity_1_5: 1 },
  { tier: "Joint-Stock", local_term: "Public Limited Company (Plc)", cost_usd: 80, days: 7, complexity_1_5: 3 },
];

/* GERMANY'S OWN FIVE, VERBATIM from data/legal/business_formation_costs_v1.json.
   Note the two rows both filed as LLC, a UG and a GmbH, which is what found the
   duplicate-key defect: eleven countries carry a repeated tier name. */
const FIVE: SetupTier[] = [
  { tier: "Freelancer", local_term: "Freiberufler", cost_usd: 0, days: 7, complexity_1_5: 1 },
  { tier: "Sole Trader", local_term: "Einzelunternehmen", cost_usd: 50, days: 7, complexity_1_5: 2 },
  { tier: "LLC", local_term: "UG (haftungsbeschraenkt)", cost_usd: 400, days: 14, complexity_1_5: 3 },
  { tier: "LLC", local_term: "GmbH", cost_usd: 1500, days: 21, complexity_1_5: 4 },
  { tier: "Joint-Stock", local_term: "AG", cost_usd: 12000, days: 60, complexity_1_5: 5 },
];

/* ITALY'S FIVE, also verbatim, and the fee that read "$2K" before this row. */
const FIVE_IT: SetupTier[] = [
  { tier: "Freelancer", local_term: "Partita IVA (regime forfettario)", cost_usd: 0, days: 7, complexity_1_5: 2 },
  { tier: "Sole Trader", local_term: "Ditta Individuale", cost_usd: 200, days: 14, complexity_1_5: 3 },
  { tier: "LLC", local_term: "S.r.l.s. (simplified)", cost_usd: 200, days: 14, complexity_1_5: 3 },
  { tier: "LLC", local_term: "S.r.l.", cost_usd: 2500, days: 30, complexity_1_5: 4 },
  { tier: "Joint-Stock", local_term: "S.p.A.", cost_usd: 12000, days: 60, complexity_1_5: 5 },
];

const TWO: SetupTier[] = [
  { tier: "Sole Trader", local_term: "Mtregjistrim si tregtar", cost_usd: 0, days: 1, complexity_1_5: 1 },
  { tier: "LLC", local_term: "Shoqeri me Pergjegjesi te Kufizuar (SH.P.K.)", cost_usd: 12, days: 2, complexity_1_5: 2 },
];

/* The file's own extremes on one card: the longest local term, the largest fee
   and the longest wait, all of which the column widths were sized against. */
const EXTREMES: SetupTier[] = [
  { tier: "Freelancer", local_term: "Trabajador por cuenta propia", cost_usd: 0, days: 1, complexity_1_5: 1 },
  { tier: "LLC", local_term: "Sociedad de Responsabilidad Limitada (S. de R.L. de C.V.)", cost_usd: 12000, days: 90, complexity_1_5: 5 },
  { tier: "Joint-Stock", local_term: "Sociedad Anonima", cost_usd: 900, days: 30, complexity_1_5: 4 },
];

const NO_DOTS: SetupTier[] = [
  { tier: "Sole Trader", cost_usd: 0, days: 1 },
  { tier: "LLC", local_term: "Private Limited Company (Ltd)", cost_usd: 15, days: 1 },
];

const SPARSE: SetupTier[] = [
  { tier: "Sole Trader", local_term: "Sole Trader", complexity_1_5: 1 },
  { tier: "LLC", local_term: "Private Limited Company (Ltd)", cost_usd: 15 },
  { tier: "Joint-Stock", local_term: "Public Limited Company (Plc)", days: 7, complexity_1_5: 3 },
];

const EXPLAINERS_LLC =
  "A company that stands apart from its owner: liability stops at what the company owns. More paperwork and a public filing, in exchange for that wall. The usual step up once a shop takes on staff or signs a lease.";
const PAPERWORK_4 = "A notary or a court, minimum capital and signed articles. Three to six weeks.";
const PAPERWORK_1 = "An online form in under an hour. No notary, no capital, nobody to visit.";

function Case({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1a" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 10, maxWidth: "90ch" }}>{note}</div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}

function At({ w, children }: { w: number; children: React.ReactNode }) {
  return (
    <div style={{ width: w, flex: "none" }}>
      <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{w}px</div>
      <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

const body = renderToStaticMarkup(
  <div className="spine-scope av2" style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>B8, every shape the file holds, at 624, 420 and 343</h1>

    <Case title="1. THREE TIERS, the United Kingdom (107 of 152 countries)" note="The only shape the eight rendered pages carry. The Sole Trader row is one of the eight rows in the whole file whose local term equals its tier, so it is also the widest name-to-figure gap the card ever draws.">
      {W.map((w) => (
        <At key={w} w={w}><SetupTiers tiers={GB} /></At>
      ))}
    </Case>

    <Case title="2. FIVE TIERS, Germany's own (DE and IT)" note="THE CASE THAT DECIDED THIS ROW. OptionCards refuses five and renders nothing, so this section would have vanished from two real country pages. What must be checked here is that five rows still read as a set and that nothing collides.">
      {W.map((w) => (
        <At key={w} w={w}><SetupTiers tiers={FIVE} /></At>
      ))}
    </Case>

    <Case title="2b. ITALY'S FIVE, and the fee that was misprinted" note="S.r.l. costs $2,500 exactly and the kit's abbreviation printed it as $2K. Fifty-three rows across fifty-two countries were wrong the same way, so this card prints the fee in full.">
      {[624, 343].map((w) => (
        <At key={w} w={w}><SetupTiers tiers={FIVE_IT} /></At>
      ))}
    </Case>

    <Case title="3. TWO TIERS (30 countries)" note="The floor. Two rows must still read as a table rather than as two stray facts.">
      {W.map((w) => (
        <At key={w} w={w}><SetupTiers tiers={TWO} /></At>
      ))}
    </Case>

    <Case title="4. THE FILE'S OWN EXTREMES" note="The longest local term in the file (56 characters), the largest fee ($12,000) and the longest wait (90 days), which are the three numbers the column widths were sized against. A figure that does not fit its column is the collision fault.">
      {W.map((w) => (
        <At key={w} w={w}><SetupTiers tiers={EXTREMES} /></At>
      ))}
    </Case>

    <Case title="5. A COLUMN THAT IS NOT HELD, and rows that are part-held" note="No complexity anywhere means no dots and no legend, and the card must not print a legend for a column it does not draw. A row missing one figure must leave that cell empty rather than shifting its neighbours.">
      {[624, 343].map((w) => (
        <At key={w} w={w}><SetupTiers tiers={NO_DOTS} /></At>
      ))}
      {[624, 343].map((w) => (
        <At key={`s${w}`} w={w}><SetupTiers tiers={SPARSE} /></At>
      ))}
    </Case>
    <Case title="6. THE PANEL, WHICH NO RENDER HAS EVER SHOWN" note="Both harnesses render server-side with the disclosure shut, so this markup has never been in a photograph. It says what the form IS and what its paperwork level means, and it no longer restates the row's own three figures. The last one is a row whose form has no explainer, where the panel must still be worth opening.">
      {[584, 303].map((w) => (
        <div key={w} style={{ width: w, flex: "none" }}>
          <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{w}px of row</div>
          <TierPanel explainer={EXPLAINERS_LLC} paperwork={PAPERWORK_4} />
          <div style={{ height: 12 }} />
          <TierPanel paperwork={PAPERWORK_1} />
        </div>
      ))}
    </Case>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head><meta charset="utf-8"><title>B8 branches</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
</style></head>
<body style="font-family: var(--font-body);">${body}</body></html>`;

mkdirSync("scratchpad/loop9", { recursive: true });
writeFileSync("scratchpad/loop9/b8-branches.html", html, "utf8");
console.log("wrote scratchpad/loop9/b8-branches.html");
