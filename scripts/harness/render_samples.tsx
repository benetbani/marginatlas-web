/* THE SAMPLES SHEET, SECOND CUT (2026-09-23, after his verdict on the first:
   "number three I don't really like it; number four is totally blank, which is
   particularly wrong, it cannot be used in that form; number five is poorly
   executed on both sides; the things you pull as subs below the cards should be
   quite short, you just put a lot of words out there").

   WHAT CHANGED. The withheld sample is gone. The cents sample is drawn inside a
   real card full of money instead of an empty box, because the point of the
   treatment is a column of figures, not one. The comparison sample uses the
   page's own income breakdown on BOTH sides, and the comparison is a mark on
   the bar that is already there rather than two bars underneath it. Every
   caption is one short line. The sheet itself is now built to DISTANCES.md:
   64 at the page top, 48 between samples, 32 between the two frames, 12 under
   a card to its caption, and nothing off the ladder.

   EVERY FIGURE IS REAL AND NAMED. The cards are the site's own components over
   the site's own builders (London restaurants, the London city seed), so what
   he approves can be seated the same day.

   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_samples.tsx
   writes scratchpad/harness/samples.html, self-contained (the stylesheet is
   inlined), and reads scratchpad/harness/sample-edges.json when a previous
   measuring pass has written it. */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { Box, Rail } from "@/components/spine/kit";
import { MonthLine } from "@/components/spine/archetypes/MonthLine";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { IncomeBreakdown } from "@/components/spine/archetypes/IncomeBreakdown";
import { LastsCard } from "@/components/spine/cell/turn-two";
import { CustomersCard } from "@/components/spine/cell/exit";
import { loadCellHeroInstances } from "@/lib/spine/trade_hero_facts";
import { buildMarket } from "@/lib/spine/market_rows";
import { buildTradeCustomers } from "@/lib/spine/trade_customers_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildSplit } from "@/lib/spine/split_rows";
import { buildCityLiving } from "@/lib/spine/fact_rows";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { COPY } from "@/lib/spine/copy";

const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
const CSS_PATH = "scratchpad/pages/site.css";

/* The measuring pass's answer, when it exists: the distinct left starts of the
   text in the two cards sample 01 draws (scratchpad/step23/measure_edges.mjs).
   A rule drawn at a guessed position is the thing that sample argues against. */
const EDGES_PATH = "scratchpad/harness/sample-edges.json";
type EdgeRow = { id: string; cols: number[]; leaves: number; width: number };
const EDGES: EdgeRow[] = existsSync(EDGES_PATH) ? JSON.parse(readFileSync(EDGES_PATH, "utf8")) : [];
const edgesOf = (id: string): EdgeRow | null => EDGES.find((e) => e.id === id) ?? null;
const edgeCount = (e: EdgeRow | null) => (e ? `${e.cols.length} starts` : "not measured");
/* The income breakdown's track, measured in the same pass: sample 04's tick is
   placed on the bar the browser drew, never on an assumed one. */
type TrackBox = { left: number; top: number; width: number; height: number };
const TRACK: TrackBox | null = (EDGES.find((e: any) => e.id === "sample-split-track") as any)?.box ?? null;

function newestUnder(dir: string): number {
  let t = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    t = Math.max(t, e.isDirectory() ? newestUnder(p) : statSync(p).mtimeMs);
  }
  return t;
}
function ensureCss() {
  const inputs = [newestUnder("src"), ...["tailwind.config.ts", "postcss.config.js"].map((f) => (existsSync(f) ? statSync(f).mtimeMs : 0))];
  if (existsSync(CSS_PATH) && statSync(CSS_PATH).mtimeMs > Math.max(...inputs)) return;
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
}

/* THE FRAME, built to DISTANCES.md: 48 between samples, 8 under the title, 12
   under the provenance line, 32 between the frames, 12 from a card to its
   caption. The caption is one line and the type carries no exception. */
function Sample({ n, title, ask, from, left, right, leftNote, rightNote, leftLabel = "Today", rightLabel = "Proposed" }: {
  n: string; title: string; ask: string; from: string;
  left: React.ReactNode; right: React.ReactNode; leftNote: string; rightNote: string;
  leftLabel?: string; rightLabel?: string;
}) {
  const label = (accent = false): React.CSSProperties => ({
    fontSize: "var(--t-micro)", textTransform: "uppercase", letterSpacing: "0.12em",
    color: accent ? "var(--terra-text)" : "var(--c-muted)", marginBottom: 12,
  });
  const caption: React.CSSProperties = { fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12, marginBottom: 0 };
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span className="fig" style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)" }}>{n}</span>
        <h2 style={{ fontSize: "var(--t-head)", fontWeight: 600, color: "var(--c-ink)", margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: "var(--t-body)", color: "var(--c-ink2)", margin: 0, maxWidth: "68ch" }}>{ask}</p>
      <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", margin: "4px 0 24px", maxWidth: "68ch" }}>{from}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <div style={label()}>{leftLabel}</div>
          {left}
          <p style={caption}>{leftNote}</p>
        </div>
        <div>
          <div style={label(true)}>{rightLabel}</div>
          {right}
          <p style={caption}>{rightNote}</p>
        </div>
      </div>
    </section>
  );
}

/* Sample 01: the measured left starts, drawn where the browser found them. */
function Edges({ children, at }: { children: React.ReactNode; at: number[] }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      {at.map((x) => (
        <span key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 1, background: "var(--terra)", opacity: 0.45 }} />
      ))}
    </div>
  );
}

/* Sample 02: the reading a hover shows, drawn open on one point. Two lines, no
   more: the figure with its unit, and which month it is. */
function PointPanel({ month, figure, words }: { month: string; figure: string; words: string }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 2, borderRadius: 8, background: "var(--c-ink)", color: "var(--c-card)", padding: "8px 12px", fontSize: "var(--t-micro)", lineHeight: 1.3 }}>
      <span><span className="fig" style={{ fontWeight: 600 }}>{figure}</span> <span style={{ opacity: 0.7 }}>{words}</span></span>
      <span style={{ opacity: 0.7 }}>{month}</span>
    </div>
  );
}

async function main() {
  ensureCss();
  const [cell] = await loadCellHeroInstances(["london"]);
  if (!cell) throw new Error("the London restaurants seed did not load");
  const seed = cell.seed;
  const industryId: string = seed?.meta?.industry_id;

  const market: any = buildMarket(industryId, "place", { iso2: seed?.meta?.iso2, slug: seed?.meta?.geo, tradeName: seed?.meta?.trade });
  const monthPoints = Array.isArray(market?.months) ? market.months : null;
  const customers = buildTradeCustomers(industryId);
  const lasts = buildLasts(industryId);
  const split: any = buildSplit(seed);
  const living: any = buildCityLiving("london");
  const facts: any = industryHeroFacts(industryId);

  /* The two percentages sample 04 compares: this city's own net margin, and the
     same trade's typical anywhere. A dollar is never compared with a percent,
     which is the mistake the first cut of this sheet nearly drew. */
  const netHere: number | null = typeof seed?.net?.pct === "number" ? seed.net.pct : null;
  const typicalText: string | null = typeof facts?.answer?.value === "string" ? facts.answer.value : null;
  const typicalPct: number | null = typicalText && /^\d+(\.\d+)?%$/.test(typicalText) ? Number(typicalText.replace("%", "")) : null;

  const body = (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: "var(--t-answer)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--c-ink)", margin: 0 }}>Four samples</h1>
        <p style={{ fontSize: "var(--t-body)", color: "var(--c-ink2)", maxWidth: "68ch", marginTop: 8 }}>
          Our own cards, our own builders, every figure real. Left is what the site draws today; right is the change. This sheet is built to the distance ladder written the same day.
        </p>
      </header>

      {/* 01 ALIGNMENT */}
      {lasts && customers ? (
        <Sample
          n="01"
          title="Alignment, counted"
          ask="How many distinct left starts does the text in a card have? Three is the cap this proposes."
          from="Both cards ship today. The rules are measured in a browser, not drawn by hand."
          leftLabel={`The grid card, ${edgeCount(edgesOf("sample-lasts"))}`}
          rightLabel={`The card of 2026-09-20, ${edgeCount(edgesOf("sample-customers"))}`}
          left={<Edges at={edgesOf("sample-lasts")?.cols ?? []}><LastsCard id="sample-lasts" lasts={lasts} /></Edges>}
          right={<Edges at={edgesOf("sample-customers")?.cols ?? []}><CustomersCard id="sample-customers" customers={customers} /></Edges>}
          leftNote="Three starts. Nothing wanders."
          rightNote="Five. The pair on the hairline drifts with the figure above it."
        />
      ) : null}

      {/* 02 A READING ON EVERY POINT */}
      {monthPoints && monthPoints.length === 12 ? (
        <Sample
          n="02"
          title="A reading on every point"
          ask="The line draws twelve months and names one. The other eleven have no number anywhere."
          from="The twelve points are the restaurants shard's own seasonality. The panel prints the point it sits on."
          left={
            <Box id="sample-swing-today">
              <Rail icon="seasonality" kicker={COPY.tradeMarket.kickers.swing} />
              <MonthLine points={monthPoints} />
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{COPY.tradeMarket.monthsBasis}</p>
            </Box>
          }
          right={
            <Box id="sample-swing-proposed">
              <Rail icon="seasonality" kicker={COPY.tradeMarket.kickers.swing} />
              <MonthLine points={monthPoints} />
              <div style={{ marginTop: -80, marginLeft: 120, position: "relative", zIndex: 2 }}>
                <PointPanel month="March" figure={String(monthPoints[2].value)} words="of the busiest month" />
              </div>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 64 }}>{COPY.tradeMarket.monthsBasis}</p>
            </Box>
          }
          leftNote="December named in a pill. March unreadable."
          rightNote="Any point, two readings, on hover and on keyboard."
        />
      ) : null}

      {/* 03 THE CENTS, IN A CARD FULL OF MONEY */}
      {living?.cells?.length ? (
        <Sample
          n="03"
          title="Precision available, not loud"
          ask="In a column of money, cents at full weight fight the figures a reader is scanning."
          from="The city page's living costs card, London's own figures, as it ships."
          left={
            <Box id="sample-living-today">
              <Rail icon="cost-breakdown" kicker={COPY.cityLiving.kicker} />
              <KvGrid cells={living.cells} />
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{living.basis}</p>
            </Box>
          }
          right={
            <Box id="sample-living-proposed">
              <Rail icon="cost-breakdown" kicker={COPY.cityLiving.kicker} />
              <KvGrid cells={living.cells.map((c: any) => (typeof c.value === "string" && /\.\d\d$/.test(c.value)
                ? { ...c, value: <span>{String(c.value).split(".")[0]}<span style={{ fontSize: "var(--t-body)", color: "var(--c-muted)" }}>.{String(c.value).split(".")[1]}</span></span> }
                : c))} />
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{living.basis}</p>
            </Box>
          }
          leftNote="Four figures, four weights of attention, all equal."
          rightNote="Dollars read first. The cents stay, quietly."
        />
      ) : null}

      {/* 04 THE COMPARISON, ON THE BAR THAT IS ALREADY THERE */}
      {split && netHere != null && typicalPct != null ? (
        <Sample
          n="04"
          title="The comparison on the mark itself"
          ask="Five per cent: good or bad? The same trade's typical is 7, and the card never says so."
          from="The trade page's income breakdown, as it ships. The mark sits where the typical net falls on the same bar."
          left={
            <IncomeBreakdown id="sample-split-today" icon="cost-breakdown" kicker={COPY.tradeSplit.kicker} netLabel={split.netLabel} netPct={split.netPct} segments={split.segments} basis={split.basis} foot={split.foot} />
          }
          right={
            <div style={{ position: "relative" }}>
              <IncomeBreakdown id="sample-split-proposed" icon="cost-breakdown" kicker={COPY.tradeSplit.kicker} netLabel={split.netLabel} netPct={split.netPct} segments={split.segments} basis={split.basis} foot={split.foot} />
              {/* THE TYPICAL'S TICK, ON THE MEASURED BAR. The net is the bar's
                  last segment, so the trade's typical net falls at (100 minus
                  its percent) of the track's width. The box comes from the
                  measuring pass; with no measurement the tick is not drawn at
                  all, because a mark in the wrong place is worse than none. */}
              {TRACK ? (
                <>
                  <span style={{ position: "absolute", left: TRACK.left + Math.round(TRACK.width * (100 - typicalPct) / 100), top: TRACK.top - 4, height: TRACK.height + 8, borderLeft: "2px solid var(--c-ink)" }} />
                  <span style={{ position: "absolute", left: TRACK.left + Math.round(TRACK.width * (100 - typicalPct) / 100) - 64, top: TRACK.top - 24, fontSize: "var(--t-micro)", fontWeight: 600, color: "var(--c-ink)" }}>{`${typicalPct}% typical`}</span>
                </>
              ) : null}
            </div>
          }
          leftNote="A number with nothing to stand against."
          rightNote="One tick: the trade's typical, on the same bar."
        />
      ) : null}
    </div>
  );

  const html = `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: Space Grotesk, ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Four samples, 2026-09-23</title><style>${readFileSync(CSS_PATH, "utf8")}</style><style>body{background:var(--c-ground);margin:0}</style></head><body class="spine-scope">${renderToStaticMarkup(body)}</body></html>`;
  const out = "scratchpad/harness/samples.html";
  writeFileSync(out, html.replace(/(src|href)="\/(cities|spine|flags)\//g, (_m, a, d) => `${a}="${PUBLIC_URL}${d}/`), "utf8");
  console.log(`render_samples: wrote ${out}`);
  console.log(`  net here ${netHere}%, typical anywhere ${typicalPct}%; months ${monthPoints ? monthPoints.length : 0}; living ${living?.cells?.length ?? 0} cells; split ${split ? split.segments.length : 0} segments`);
}

main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1); });
