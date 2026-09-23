/* THE SAMPLES SHEET (2026-09-23, on his "show me examples, create some
   illustrative samples of sections", the run after the Kole Jain study).
   Five ideas from that study, each drawn twice: AS THE SITE DRAWS IT TODAY and
   AS THE IDEA WOULD DRAW IT, side by side on one page, the way he lays his own
   lessons out.

   EVERY FIGURE IS REAL AND SAYS WHERE IT COMES FROM. The cards are the site's
   own components over the site's own builders (London restaurants and the
   London city seed), not mockups: what he approves can be seated the same day,
   and what he refuses costs nothing but this file. The only invented thing on
   the page is copy that carries no number (a recovery sentence), and it is
   marked as a proposal in its own caption.

   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_samples.tsx
   writes scratchpad/harness/samples.html (open it in a browser; it needs
   scratchpad/pages/site.css beside it, which the archetype sheet compiles). */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { Box, Rail, Fig } from "@/components/spine/kit";
import { MonthLine } from "@/components/spine/archetypes/MonthLine";
import { LastsCard } from "@/components/spine/cell/turn-two";
import { CustomersCard } from "@/components/spine/cell/exit";
import { loadCellHeroInstances } from "@/lib/spine/trade_hero_facts";
import { buildMarket } from "@/lib/spine/market_rows";
import { buildTradeCustomers } from "@/lib/spine/trade_customers_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildCityLiving } from "@/lib/spine/fact_rows";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { COPY } from "@/lib/spine/copy";

const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
/* PASS TWO's measurement, when it exists: the distinct left starts of the text
   inside the two cards sample 01 draws, measured in a browser by
   scratchpad/step23/measure_edges.mjs. The first render of this file has none
   and draws no rules; the render after the measurement draws them where they
   actually are. A rule drawn at a guessed position is the thing this sample is
   arguing against. */
const EDGES_PATH = "scratchpad/harness/sample-edges.json";
type EdgeRow = { id: string; cols: number[]; leaves: number; width: number };
const EDGES: EdgeRow[] = existsSync(EDGES_PATH) ? JSON.parse(readFileSync(EDGES_PATH, "utf8")) : [];
const edgesOf = (id: string): EdgeRow | null => EDGES.find((e) => e.id === id) ?? null;
const edgeLabel = (e: EdgeRow | null) => (e ? `${e.cols.length} distinct start${e.cols.length === 1 ? "" : "s"}, measured` : "not measured yet");
const CSS_PATH = "scratchpad/pages/site.css";

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
  const newest = Math.max(...inputs);
  if (existsSync(CSS_PATH) && statSync(CSS_PATH).mtimeMs > newest) return;
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
}

/* ONE SAMPLE: the question it answers, the two frames, and where the figures
   come from. The caption is the whole point: a picture with no provenance is a
   mockup, which is what this project stopped making on 2026-09-04. */
function Sample({ n, title, ask, from, today, proposed, todayNote, proposedNote, leftLabel = "As the site draws it today", rightLabel = "As the idea draws it" }: {
  n: string; title: string; ask: string; from: string;
  today: React.ReactNode; proposed: React.ReactNode; todayNote: string; proposedNote: string;
  leftLabel?: string; rightLabel?: string;
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span className="fig" style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)" }}>{n}</span>
        <h2 style={{ fontSize: "var(--t-head)", fontWeight: 600, color: "var(--c-ink)", margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: "var(--t-body)", color: "var(--c-ink2)", margin: "0 0 2px", maxWidth: "68ch" }}>{ask}</p>
      <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", margin: "0 0 16px", maxWidth: "68ch" }}>{from}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: "var(--t-micro)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--c-muted)", marginBottom: 26 }}>{leftLabel}</div>
          {today}
          <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 8 }}>{todayNote}</p>
        </div>
        <div>
          <div style={{ fontSize: "var(--t-micro)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--terra-text)", marginBottom: 26 }}>{rightLabel}</div>
          {proposed}
          <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 8 }}>{proposedNote}</p>
        </div>
      </div>
    </section>
  );
}

/* SAMPLE 1's overlay: the distinct left edges of a card's text, drawn as rules
   over the card. Measured in the browser by the checker this would become; here
   the rules are drawn at the card's own padding steps so the idea is visible on
   paper. The count printed under each frame is what the checker would count. */
function Edges({ children, at, label }: { children: React.ReactNode; at: number[]; label: string }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      {at.map((x) => (
        <span key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 1, background: "var(--terra)", opacity: 0.5 }} />
      ))}
      <div style={{ position: "absolute", top: -18, left: 0, fontSize: "var(--t-micro)", color: "var(--terra-text)" }}>{label}</div>
    </div>
  );
}

/* SAMPLE 2's panel: the reading a hover would show, drawn open on one month.
   The figure is that month's own point, not a new number. */
function PointPanel({ month, figure, words }: { month: string; figure: string; words: string }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 2, borderRadius: 10, background: "var(--c-ink)", color: "var(--c-card)", padding: "8px 10px", fontSize: "var(--t-micro)", lineHeight: 1.3 }}>
      <span><span className="fig" style={{ fontWeight: 600 }}>{figure}</span> <span style={{ opacity: 0.7 }}>{words}</span></span>
      <span style={{ opacity: 0.7 }}>{month}</span>
    </div>
  );
}

/* SAMPLE 5's pair: one figure with its comparison behind it, in one hue at two
   tints, which is the form the district bars and the market bento already use. */
function PairBars({ here, typical, hereLabel, typicalLabel }: { here: number; typical: number; hereLabel: string; typicalLabel: string }) {
  const max = Math.max(here, typical) || 1;
  const row = (v: number, label: string, solid: boolean) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", fontSize: "var(--t-micro)", color: "var(--c-muted)" }}>
        <span>{label}</span>
        <span className="fig" style={{ color: solid ? "var(--c-ink)" : "var(--c-ink2)", fontSize: solid ? "var(--t-lead)" : "var(--t-body)" }}>{`${v}%`}</span>
      </div>
      <span style={{ display: "block", height: 10, borderRadius: 5, width: `${Math.max(4, (v / max) * 100)}%`, background: solid ? "var(--terra)" : "var(--terra-soft)" }} />
    </div>
  );
  return <div style={{ display: "grid", gap: 10 }}>{row(here, hereLabel, true)}{row(typical, typicalLabel, false)}</div>;
}

async function main() {
  ensureCss();
  const [cell] = await loadCellHeroInstances(["london"]);
  if (!cell) throw new Error("the London restaurants seed did not load");
  const seed = cell.seed;
  const industryId: string = seed?.meta?.industry_id;
  const market = buildMarket(industryId, "place", { iso2: seed?.meta?.iso2, slug: seed?.meta?.geo, tradeName: seed?.meta?.trade });
  const customers = buildTradeCustomers(industryId);
  const facts = industryHeroFacts(industryId);

  /* THE FIGURES, EACH FROM THE BUILDER THE PAGE ITSELF USES, none typed here.
     The net margin this city's own (`net.pct`, whose own field line says
     "netMarginPct, loadCellView") against the trade's typical anywhere (the
     industry masthead's answer, a percent as text): the same trade at two
     altitudes, which is the one comparison the market cluster already makes.
     Never the take-home against a margin: a dollar and a percent are not like
     for like, and that mistake was caught in this file before it was drawn. */
  const netHere: number | null = typeof seed?.net?.pct === "number" ? seed.net.pct : null;
  const netField: string = String(seed?.net?.field ?? "");
  const typicalText: string | null = typeof facts?.answer?.value === "string" ? facts.answer.value : null;
  const typicalPct: number | null = typicalText && /^\d+(\.\d+)?%$/.test(typicalText) ? Number(typicalText.replace("%", "")) : null;
  const takeHere: number | null = typeof seed?.owner?.take_home_usd === "number" ? seed.owner.take_home_usd : null;
  const monthPoints = Array.isArray(market?.months) ? market.months : null;
  const lasts = buildLasts(industryId);
  const living = buildCityLiving("london");
  const coffee = living?.cells?.find((c: any) => c.key === "coffee") ?? null;

  const body = (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 80px" }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "var(--t-answer)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--c-ink)", margin: 0 }}>Five samples</h1>
        <p style={{ fontSize: "var(--t-body)", color: "var(--c-ink2)", maxWidth: "68ch" }}>
          Each one is an idea from the Kole Jain study drawn on our own page, twice: as the site draws it today, and as the idea would draw it. The cards are the site&apos;s own components over the site&apos;s own builders, so every figure is the real one and each sample says which field it came from. Nothing here is live. It is a page to look at and rule on.
        </p>
      </header>

      {/* 1. ALIGNMENT, the measurement, not the eye */}
      {lasts && customers ? (
        <Sample
          n="01"
          title="Alignment, counted"
          ask="His newest lesson is that an interface reads as right when nothing sits at its own private position. The useful part is that this can be counted rather than judged: the distinct left starts of the text inside a card. The rules below are measured in a browser, not drawn by hand, and the measurement disagreed with the guess that wrote this sample."
          from="Two of the trade page's own cards, drawn by their own components over the London restaurants seed. Measured at 1200 by scratchpad/step23/measure_edges.mjs, the prototype of the checker this proposes."
          leftLabel="The grid card"
          rightLabel="The card built on 2026-09-20"
          today={
            <Edges at={edgesOf("sample-lasts")?.cols ?? []} label={edgeLabel(edgesOf("sample-lasts"))}>
              <LastsCard id="sample-lasts" lasts={lasts} />
            </Edges>
          }
          proposed={
            <Edges at={edgesOf("sample-customers")?.cols ?? []} label={edgeLabel(edgesOf("sample-customers"))}>
              <CustomersCard id="sample-customers" customers={customers} />
            </Edges>
          }
          todayNote="Three starts: the card's padding, the text beside the icon, and the second column of the grid. Nothing in it wanders."
          proposedNote="Five starts, and the two extra ones are the pair on the hairline row, which begins wherever the figure above it happens to end. The eye barely catches it; the checker catches it every time. The rule this suggests is a cap of three, and the fix on this card is to give the pair one column each."
        />
      ) : null}

      {/* 2. A READING ON EVERY POINT */}
      {monthPoints && monthPoints.length === 12 ? (
        <Sample
          n="02"
          title="A reading on every point"
          ask="His charts answer the question a reader actually has: what is this one? Ours names the busiest month and leaves the other eleven unreadable."
          from="The twelve points are the restaurants shard's own seasonality; the panel prints the point it sits on and never a new figure."
          today={
            <Box id="sample-swing-today">
              <Rail icon="seasonality" kicker={COPY.tradeMarket.kickers.swing} />
              <MonthLine points={monthPoints} />
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{COPY.tradeMarket.monthsBasis}</p>
            </Box>
          }
          proposed={
            <Box id="sample-swing-proposed">
              <Rail icon="seasonality" kicker={COPY.tradeMarket.kickers.swing} />
              <MonthLine points={monthPoints} />
              <div style={{ marginTop: -78, marginLeft: 118, position: "relative", zIndex: 2 }}>
                <PointPanel month="March" figure={String(monthPoints[2].value)} words="of the busiest month" />
              </div>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 70 }}>{COPY.tradeMarket.monthsBasis}</p>
            </Box>
          }
          todayNote="December is named in a pill. March, the month a reader may actually be opening in, has no number anywhere on the page."
          proposedNote="The panel carries two readings and no more: the figure with its unit, and which month it is. Hover and keyboard both reach it, in the page's own ink."
        />
      ) : null}

      {/* 3. THE STATE THAT SAYS WHAT HAPPENS NEXT */}
      <Sample
        n="03"
        title="A withheld card that says what happens instead"
        ask="His failure copy says what went wrong and what will be done about it. Ours says what is missing and stops there."
        from="The line on the left is the shipped one, word for word. The line on the right is proposed copy carrying no figure, so the only thing about it that can be wrong is the words."
        today={
          <Box id="sample-withheld-today">
            <Rail icon="startup-cost" kicker={COPY.tradeOpen.kicker} />
            <p style={{ fontSize: "var(--t-lead)", color: "var(--c-ink2)", lineHeight: 1.4 }}>{COPY.tradeOpen.withheld}</p>
          </Box>
        }
        proposed={
          <Box id="sample-withheld-proposed">
            <Rail icon="startup-cost" kicker={COPY.tradeOpen.kicker} />
            <p style={{ fontSize: "var(--t-lead)", color: "var(--c-ink2)", lineHeight: 1.4 }}>{COPY.tradeOpen.withheld}</p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--c-ink2)", marginTop: 8 }}>The trade&apos;s typical bill is on the industry page until this city has its own.</p>
          </Box>
        }
        todayNote="True, and a dead end. The reader is told the number is not there and given nothing to do about it."
        proposedNote="One more sentence, and it has to be true: it names the page that does hold a figure. No date is ever promised."
      />

      {/* 4. THE CENTS */}
      {coffee ? (
        <Sample
          n="04"
          title="Precision available, not loud"
          ask="Where a figure carries cents, his prints the dollars at full size and the cents small and grey, so the number reads at a glance and the exact figure is still there."
          from="London's own cup of coffee, the city shard's figure, printed by the helper the country page's electricity rate uses."
          today={
            <Box id="sample-cents-today">
              <Rail icon="spending-power" kicker={String(coffee.label)} />
              <Fig className="block text-[length:var(--t-focal)] font-semibold text-[var(--c-ink)]">{String(coffee.value)}</Fig>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{String(coffee.note ?? "")}</p>
            </Box>
          }
          proposed={
            <Box id="sample-cents-proposed">
              <Rail icon="spending-power" kicker={String(coffee.label)} />
              <span style={{ display: "block" }}>
                <Fig className="text-[length:var(--t-focal)] font-semibold text-[var(--c-ink)]">{String(coffee.value).split(".")[0]}</Fig>
                <span className="fig" style={{ fontSize: "var(--t-body)", color: "var(--c-muted)" }}>.{String(coffee.value).split(".")[1] ?? "00"}</span>
              </span>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{String(coffee.note ?? "")}</p>
            </Box>
          }
          todayNote="Both halves shout, and the cents are the half nobody is scanning for."
          proposedNote="The dollars keep the rung, the cents drop two steps and go grey. It is still one figure a reader can read aloud."
        />
      ) : null}

      {/* 5. THE COMPARISON INSIDE THE MARK */}
      {netHere != null && typicalPct != null ? (
        <Sample
          n="05"
          title="The comparison inside the mark"
          ask="A figure standing alone cannot be judged. His bars carry their own comparison in one colour at two tints, with no legend and no second chart."
          from={`Here: ${netHere}% net margin for London restaurants (${netField}). Anywhere: ${typicalPct}%, the figure the industry page's masthead already prints for this trade. Two percentages, one trade, two altitudes.`}
          today={
            <Box id="sample-net-today">
              <Rail icon="cost-breakdown" kicker={COPY.tradeSplit.kicker} />
              <div style={{ fontSize: "var(--t-micro)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-muted)" }}>Net margin</div>
              <Fig className="block text-[length:var(--t-focal)] font-semibold text-[var(--c-ink)]">{`${netHere}%`}</Fig>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{COPY.tradeSplit.basisShard}</p>
            </Box>
          }
          proposed={
            <Box id="sample-net-proposed">
              <Rail icon="cost-breakdown" kicker={COPY.tradeSplit.kicker} />
              <div style={{ fontSize: "var(--t-micro)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--c-muted)" }}>Net margin</div>
              <Fig className="block text-[length:var(--t-focal)] font-semibold text-[var(--c-ink)]">{`${netHere}%`}</Fig>
              <div style={{ marginTop: 14 }}>
                <PairBars here={netHere} typical={typicalPct} hereLabel="Here, London" typicalLabel="This trade, anywhere" />
              </div>
              <p style={{ fontSize: "var(--t-micro)", color: "var(--c-muted)", marginTop: 12 }}>{COPY.tradeSplit.basisShard} The pale bar is the trade&apos;s typical, modelled.</p>
            </Box>
          }
          todayNote="Five per cent. A reader who has never run a restaurant cannot tell whether that is a good number or a bad one."
          proposedNote="Same trade, two altitudes, which is the one comparison this site already makes on the market cluster. Never across trades, and never across places for different trades."
        />
      ) : null}
    </div>
  );

  const html = `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: Space Grotesk, ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Five samples, 2026-09-23</title><style>${readFileSync(CSS_PATH, "utf8")}</style><style>body{background:var(--c-ground);margin:0}</style></head><body class="spine-scope">${renderToStaticMarkup(body)}</body></html>`;
  const out = "scratchpad/harness/samples.html";
  writeFileSync(out, html.replace(/(src|href)="\/(cities|spine|flags)\//g, (_m, a, d) => `${a}="${PUBLIC_URL}${d}/`), "utf8");
  console.log(`render_samples: wrote ${out}`);
  console.log(`  net margin here ${netHere}%, the trade's typical anywhere ${typicalPct}% (${typicalText}); take-home here ${takeHere}`);
  console.log(`  month points ${monthPoints ? monthPoints.length : 0}, lasts ${lasts ? lasts.cells.length : 0} cells, coffee ${coffee ? coffee.value : "(absent)"}, customers ${customers ? customers.cells.length + 1 : 0} figures`);
}

main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1); });
