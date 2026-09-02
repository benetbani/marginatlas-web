/**
 * THROWAWAY. C14's two cards, loop run 14, drawn BOTH WAYS on one page.
 *
 * `Dots` declared `data-idea="I5"` per INSTANCE, which is B7's `KV` defect still
 * standing in the kit. Nothing among the eight rendered pages draws this form, so
 * there is no live card to photograph and the fault has to be shown where it
 * actually lives: the dev spine route, whose six-lens scorecard renders SIX rows
 * in one Box and whose risk register renders FIVE.
 *
 * This harness renders each of those two cards TWICE at the same width. The
 * "before" column hand-writes the exact markup `Dots` used to emit, a per-row
 * `data-idea="I5"` on the dot row itself. The "after" column calls the shipped
 * `DotsSet` + `Dots`. The two must be pixel-identical, because the change is one
 * attribute moving up one level, and the DOM probe beside it must report the
 * crowding falling from 6 and 5 to 1 and 1.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop14_c14_dots.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { Dots, DotsSet, Fig } from "../src/components/spine/kit";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

/* 520 is the dev route's own two-up card width; 343 is a full-width phone card. */
const W = [520, 343];

/* The six lenses as the dev route sorts them, and the five risks it scores as
   SAFETY (11 minus magnitude), both verbatim from src/app/dev/spine/page.tsx. */
const LENSES = [
  { label: "Talent pool", s: 9 },
  { label: "Access to finance", s: 8 },
  { label: "Stability", s: 8 },
  { label: "Ease of entry", s: 7 },
  { label: "Purchasing power", s: 7 },
  { label: "Low tax load", s: 5 },
];
const RISKS = [
  { label: "Energy and input costs", s: 2 },
  { label: "Skills shortages", s: 4 },
  { label: "Demand cycle", s: 5 },
  { label: "Currency swings", s: 6 },
  { label: "Rule and tax changes", s: 7 },
];

/* THE MARKUP `Dots` USED TO EMIT, copied attribute for attribute, so the before
   column is the old shape and not an approximation of it. */
function OldDots({ score, max = 10 }: { score: number; max?: number }) {
  return (
    <div data-idea="I5" className="flex gap-[3px]" role="img" aria-label={`${score} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="h-[7px] w-[7px] rounded-full" style={{ background: i < score ? "#1a1a1a" : "var(--c-line-strong)" }} />
      ))}
    </div>
  );
}

function LensRows({ old }: { old: boolean }) {
  const rows = LENSES.map((r) => (
    <div key={r.label} className="grid grid-cols-[112px_1fr_30px] items-center gap-2.5">
      <span className="min-w-0 truncate text-[length:var(--t-body)] text-[var(--c-ink2)]">{r.label}</span>
      {old ? <OldDots score={r.s} max={10} /> : <Dots score={r.s} max={10} />}
      <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{r.s}</Fig>
    </div>
  ));
  return old ? <div className="space-y-2">{rows}</div> : <DotsSet className="space-y-2">{rows}</DotsSet>;
}

function RiskRows({ old }: { old: boolean }) {
  const rows = RISKS.map((r, i) => (
    <div key={r.label} className="hov -mx-2 grid grid-cols-[130px_1fr_auto] items-center gap-2.5 rounded-md px-2 py-1">
      <span className={`min-w-0 truncate text-[length:var(--t-body)] ${i === 0 ? "font-medium text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{r.label}</span>
      {old ? <OldDots score={r.s} max={10} /> : <Dots score={r.s} max={10} />}
      <Fig className="w-9 text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{r.s}/10</Fig>
    </div>
  ));
  return old ? <div className="space-y-2.5">{rows}</div> : <DotsSet className="space-y-2.5">{rows}</DotsSet>;
}

function Card({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ background: "#fff" }}>
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]" style={{ marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Case({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1a" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6f6f6d", marginBottom: 10, maxWidth: "90ch" }}>{note}</div>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>{children}</div>
    </section>
  );
}

function At({ w, label, children }: { w: number; label: string; children: React.ReactNode }) {
  return (
    <div style={{ width: w, flex: "none" }}>
      <div style={{ fontSize: 11, color: "#8a847e", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      {children}
    </div>
  );
}

const body = renderToStaticMarkup(
  <div className="spine-scope av2" style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>C14, the two cards that draw Dots, before and after, at 520 and 343</h1>

    <Case
      title="1. THE SIX-LENS SCORECARD, six rows in one Box"
      note="Before, each row declared its own I5, so this card announced SIX of one idea: the form-variety gate's per-card clause fails at three, and I5's page cap is three. After, the set declares once. The two columns must be indistinguishable."
    >
      {W.map((w) => (
        <At key={"o" + w} w={w} label={`before, ${w}px`}>
          <Card id={`lens-old-${w}`} title="The country, in six lenses"><LensRows old /></Card>
        </At>
      ))}
      {W.map((w) => (
        <At key={"n" + w} w={w} label={`after, ${w}px`}>
          <Card id={`lens-new-${w}`} title="The country, in six lenses"><LensRows old={false} /></Card>
        </At>
      ))}
    </Case>

    <Case
      title="2. THE RISK REGISTER, five rows in one Box"
      note="Five before, one after. The rows are sorted by safety ascending, so the top row is the biggest exposure and carries no accent, which rule 29A requires and which this change does not touch."
    >
      {W.map((w) => (
        <At key={"ro" + w} w={w} label={`before, ${w}px`}>
          <Card id={`risk-old-${w}`} title="What could go wrong"><RiskRows old /></Card>
        </At>
      ))}
      {W.map((w) => (
        <At key={"rn" + w} w={w} label={`after, ${w}px`}>
          <Card id={`risk-new-${w}`} title="What could go wrong"><RiskRows old={false} /></Card>
        </At>
      ))}
    </Case>

    <Case
      title="3. ONE ROW ALONE, which is the case a wrapper could have made worse"
      note="A card drawing a single dot row declared one I5 before and declares one now. It must not gain a margin, a gap or a rule from being wrapped."
    >
      {W.map((w) => (
        <At key={"so" + w} w={w} label={`before, ${w}px`}>
          <Card id={`solo-old-${w}`} title="One read"><div><OldDots score={7} max={10} /></div></Card>
        </At>
      ))}
      {W.map((w) => (
        <At key={"sn" + w} w={w} label={`after, ${w}px`}>
          <Card id={`solo-new-${w}`} title="One read"><DotsSet><Dots score={7} max={10} /></DotsSet></Card>
        </At>
      ))}
    </Case>
  </div>,
);

const html = `<!doctype html>
<html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">
<head><meta charset="utf-8"><title>C14 dots</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>${css}</style>
<style>
body{background:#faf8f6;margin:0}
:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;--font-grotesk:'Space Grotesk';}
.fig{font-family:var(--font-grotesk,'Space Grotesk'),'Space Grotesk',ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
</style></head>
<body style="font-family: var(--font-body);">${body}</body></html>`;

mkdirSync("scratchpad/loop14", { recursive: true });
writeFileSync("scratchpad/loop14/c14-dots.html", html, "utf8");
console.log("wrote scratchpad/loop14/c14-dots.html");
