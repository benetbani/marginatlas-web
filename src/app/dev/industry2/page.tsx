/**
 * /dev/industry2 , the trade detail page, v2.
 *
 * THE SECOND OF THE THREE PHANTOM ROUTES TO BECOME REAL. `/dev/cell2`,
 * `/dev/hood2` and `/dev/industry2` were all named in the default route list of
 * `audit_row_layout.mjs` and all three reported `ok, 0 unstyled, 0 clipped` for
 * days. None had a route file. Next renders the layout for an unmatched path,
 * so each answered HTTP 200 with 594 characters of chrome and no content.
 *
 * WHAT THIS PAGE IS. The trade detail page is one of the five locked page
 * types and the only one with no v2 component at all: the live
 * `/industries/[industry]` renders `SpineIndustryBody`, 739 lines of the
 * previous generation, inside `SpineShell`, behind the same unset master flag
 * that hides the cell page.
 *
 * IT READS REAL DATA, NOT A FIXTURE. `buildSpineIndustrySeed` is the same
 * builder the live route uses: margins from the measured table, the per-city
 * take-home leaderboard from `buildAcrossCities`, survival from the curated
 * archetype. Nothing here is invented, so nothing needs a `SampleTag`, and
 * unlike `/dev/city2` and `/dev/country2` this page is not blocked from ever
 * being promoted.
 *
 * THE SECTION ORDER IS PORTED, NOT DESIGNED. It follows the previous
 * generation's spine, whose section comments run BREAK-EVEN, OPERATOR, CAPITAL
 * PAYBACK, SURVIVAL, WHO IT SUITS, CAVEATS, CLOSE. Four of those the adapter
 * omits outright with a stated reason (`first_year`, `payback`,
 * `cost_structure`, `seasonality` have no honest source at trade altitude), so
 * they are not here either.
 *
 * EVERY SECTION IS GUARDED AND NONE VANISHES. The ratified rule is that a page
 * is always complete and its shape never varies by place: a missing figure
 * states its absence, and it is never a dash, a zero, or a section that
 * silently disappears. So each block either renders its figures or renders
 * `ChapterGap` saying what is not filled. That is why the page is the same
 * length for a trade with three cities and a trade with none.
 *
 * NO LEAGUE TABLE, and this is a standing rule rather than a preference.
 * Ranking trades against each other ranks businesses against each other, and a
 * "worst margins" list badmouths everything at the bottom of it. The benchmark
 * block compares this trade to its own sector neighbours and to the atlas
 * median, which is a position, not a verdict.
 */
import { notFound } from "next/navigation";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { Statblock, type StatRow } from "@/components/spine2/Statblock";
import { ChapterGap } from "@/components/spine2/page/ChapterGap";
import { buildSpineIndustrySeed } from "@/lib/spine/adapt_industry";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Trade detail , v2 proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/** The trade this workbench renders. One slug, chosen because it is the one
 *  trade with a reconciled cell behind it, so the figures here can be checked
 *  against `/dev/cell2` rather than only against themselves. */
const SLUG = "restaurants";

const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** Whole dollars, abbreviated, matching `moneyFine` on the cell page so the two
 *  pages do not spell the same quantity two ways. */
function money(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e6) return `$${(a / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (a >= 1e3) return `$${Math.round(a / 1e3)}K`;
  return `$${Math.round(a)}`;
}

/**
 * A titled block that either renders rows or states its own gap.
 *
 * The guard lives here rather than at each call site because there are nine of
 * them and a rule applied by hand nine times is a rule applied eight times.
 */
function Block({
  label,
  icon,
  rows,
  gap,
  note,
  valCol,
}: {
  label: string;
  icon: GlyphId;
  rows: StatRow[];
  gap: string;
  note?: string;
  valCol?: number;
}) {
  const renderable = rows.filter((r) => r.value != null && r.value !== "");
  return (
    <section className="panel pad rise" style={{ marginTop: 18 }}>
      {renderable.length ? (
        <>
          <Statblock
            header={{ label, icon }}
            rows={renderable}
            style={valCol ? { ["--val-col" as string]: `${valCol}px` } : undefined}
          />
          {note ? (
            <p className="k" style={{ margin: "12px 0 0", maxWidth: "62ch" }}>
              {note}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div className="lab" style={{ marginBottom: 14 }}>
            <GlyphIcon id={icon} size={18} /> {label}
          </div>
          <ChapterGap reason={gap} scope="this trade" />
        </>
      )}
    </section>
  );
}

export default async function IndustryV2Proposal() {
  const d = await buildSpineIndustrySeed(SLUG);
  if (!d) notFound();

  const name: string = d.meta?.name ?? SLUG;
  const sector: string | undefined = d.meta?.sector;
  const keeps: number | undefined = d.margin_index?.keeps_per_100;

  /* ---- the money stack, four stages that total exactly 100 ---- */
  const splitRows: StatRow[] = (d.money_split?.items ?? []).map(
    (i: { name: string; pct: number; kept?: boolean }) => ({
      icon: (i.kept ? "owner-keeps" : "cost-breakdown") as GlyphId,
      label: i.name,
      sub: i.kept ? "what is left after the three above" : "of every hundred",
      value: String(Math.round(i.pct)),
      unit: "%",
      answer: Boolean(i.kept),
    }),
  );

  /* ---- what an operator actually gets ---- */
  const op = d.operator ?? {};
  const operatorRows: StatRow[] = [
    isNum(op.owner_keeps_pct)
      ? {
          icon: "owner-keeps" as GlyphId,
          label: "What the owner keeps",
          sub: "of every hundred through the till",
          value: String(Math.round(op.owner_keeps_pct)),
          unit: "%",
          answer: true,
        }
      : null,
    isNum(op.capital_to_open_usd)
      ? {
          icon: "startup-cost" as GlyphId,
          label: "Cash before the doors open",
          sub: "the typical build for this trade",
          value: money(op.capital_to_open_usd),
        }
      : null,
    isNum(op.survival_1yr_pct)
      ? {
          icon: "first-year" as GlyphId,
          label: "Still trading after a year",
          sub: "across the trade, not this room",
          value: String(Math.round(op.survival_1yr_pct)),
          unit: "%",
        }
      : null,
  ].filter(Boolean) as StatRow[];

  /* ---- survival, the curated archetype ---- */
  const sv = d.survival ?? {};
  const survivalRows: StatRow[] = [
    isNum(sv.yr1_pct) ? { icon: "first-year" as GlyphId, label: "After one year", sub: "of those that opened", value: String(Math.round(sv.yr1_pct)), unit: "%" } : null,
    isNum(sv.yr3_pct) ? { icon: "first-year" as GlyphId, label: "After three years", sub: "of those that opened", value: String(Math.round(sv.yr3_pct)), unit: "%" } : null,
    isNum(sv.yr5_pct) ? { icon: "first-year" as GlyphId, label: "After five years", sub: "of those that opened", value: String(Math.round(sv.yr5_pct)), unit: "%", answer: true } : null,
  ].filter(Boolean) as StatRow[];

  /* ---- where it pays best. Real cities, like-for-like, one currency. ---- */
  const places: Array<{ name: string; take_home_usd: number; net_margin_pct: number }> =
    d.where_pays?.places ?? [];
  const placeRows: StatRow[] = places.slice(0, 10).map((p) => ({
    icon: "where-it-pays" as GlyphId,
    label: p.name,
    sub: `${Math.round(p.net_margin_pct)} of every hundred kept`,
    value: money(p.take_home_usd),
  }));

  /* ---- against its own neighbours, never a league table ---- */
  const benchTrades: Array<{ name: string; keeps?: number; keeps_per_100?: number; self?: boolean }> =
    d.benchmark?.trades ?? [];
  const benchRows: StatRow[] = benchTrades.map((t) => {
    const v = isNum(t.keeps_per_100) ? t.keeps_per_100 : isNum(t.keeps) ? t.keeps : null;
    return {
      icon: "ranking" as GlyphId,
      label: t.name,
      sub: t.self ? "this trade" : "a neighbour in the same sector",
      value: v == null ? null : String(Math.round(v)),
      unit: "%",
      answer: Boolean(t.self),
    };
  });

  /* ---- formats inside the trade ---- */
  const subList: Array<{ name: string; keep_pct?: number; capital_usd?: number }> =
    d.subtypes?.list ?? [];
  const subRows: StatRow[] = subList.map((s) => ({
    icon: "subtype" as GlyphId,
    label: s.name,
    sub: isNum(s.capital_usd) ? `${money(s.capital_usd)} to open` : "capital not filled",
    value: isNum(s.keep_pct) ? String(Math.round(s.keep_pct)) : null,
    unit: "%",
  }));

  const suits: string[] = d.who_suits?.suits ?? [];
  const thinkTwice: string[] = d.who_suits?.think_twice ?? [];
  const myths: string[] = d.caveats?.myths ?? [];
  const honestTake: string | undefined = d.caveats?.honest_take;

  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Where you are">
              <a href="/">Home</a>
              <span className="s">&rsaquo;</span>
              <a href="/industries">Trades</a>
              <span className="s">&rsaquo;</span>
              <span>{name}</span>
            </nav>
          </div>
        </header>

        {/* 1 , THE ANSWER. The trade, what it keeps, and the reason attached.
            BRAND.md voice move 1: a figure alone is a statistic, a figure with
            a reason is a finding. The lead is the adapter's own verdict text,
            not a sentence written here. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <h1 style={{ maxWidth: "20ch" }}>
                {d.verdict?.headline ?? `What ${name.toLowerCase()} keep.`}
              </h1>
              {d.verdict?.lead ? (
                <p className="k" style={{ margin: "16px 0 0", maxWidth: "46ch" }}>
                  {d.verdict.lead}
                </p>
              ) : null}
            </div>

            <div className="panel pad">
              <div className="statblock">
                <div className="hd">
                  <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                  {name}
                </div>
                <div className="row">
                  <span className="nm">
                    Kept of every hundred
                    <span className="s">before the owner is paid a wage</span>
                  </span>
                  <span className="v">{isNum(keeps) ? `${Math.round(keeps)}%` : "not filled"}</span>
                </div>
                {/* The SECTOR IS NOT A FIGURE, so it is not in the value slot.
                    "Food & drink" needed 96px against the 78px column and was
                    cut mid-phrase. DESIGN.md is direct about this: "the value
                    slot takes the figure, the qualifier goes in the name's .s",
                    and widening the column to hold prose is the same mistake as
                    putting prose there. The count of sector neighbours is the
                    figure; the sector name is what qualifies it. */}
                <div className="row">
                  <span className="nm">
                    Neighbours in {sector ?? "its sector"}
                    <span className="s">compared against, further down</span>
                  </span>
                  <span className="v">{benchRows.length || "none"}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Cities with a real reading
                    <span className="s">measured locally, not modelled</span>
                  </span>
                  <span className="v">{places.length || "none yet"}</span>
                </div>
              </div>
            </div>
          </div>
          {d.provenance_line ? (
            <p className="note" style={{ margin: "18px 0 0", maxWidth: "72ch" }}>
              {d.provenance_line}
            </p>
          ) : null}
        </section>

        {/* 2 , WHERE THE MONEY GOES. Four stages that total exactly 100,
            because every stage is a real gap in the measured ladder and the
            last is the residual. A stack that does not total is a partition
            with a hole. */}
        <Block
          label="Where every hundred goes"
          icon={"cost-breakdown" as GlyphId}
          rows={splitRows}
          note={d.money_split?.annotation}
          gap="No measured margin ladder has been filled for this trade yet, so the hundred cannot be split without inventing the stages."
        />

        {/* 3 , THE OPERATOR. A different cut from the hero: what one owner
            walks away with, what it costs to get there, and whether they are
            still there a year later. */}
        <Block
          label="What an owner actually gets"
          icon={"owner-keeps" as GlyphId}
          rows={operatorRows}
          gap="Neither the keep, the capital to open, nor the first-year survival has been filled for this trade."
          valCol={96}
        />

        {/* 4 , SURVIVAL. The attrition is front-loaded and the page says so
            rather than leaving a reader to infer it from three numbers. */}
        <Block
          label="How many are still trading"
          icon={"first-year" as GlyphId}
          rows={survivalRows}
          note={d.survival?.note}
          gap="No survival curve has been filled for this trade."
        />

        {/* 5 , WHERE IT PAYS. The commercial heart, and fully real: each city
            is a trusted local measurement with the same after-tax take-home
            the trade-by-place page computes. It self-omits upstream below
            three cities, which is why the gap copy names the threshold. */}
        <Block
          label="Where this trade pays best"
          icon={"where-it-pays" as GlyphId}
          rows={placeRows}
          note={d.where_pays?.note}
          gap="Fewer than three cities resolve to a real local measurement for this trade, so a ranking would be a list of one or two places pretending to be a pattern."
          valCol={96}
        />

        {/* 6 , THE NEIGHBOURS. Position, not verdict. Ranking trades against
            each other ranks businesses against each other, which is a standing
            rule, so this compares to its own sector and to the atlas median. */}
        <Block
          label="Against its neighbours"
          icon={"vs-world" as GlyphId}
          rows={benchRows}
          note={d.benchmark?.note ?? d.benchmark?.avg_note}
          gap="No sector neighbours carry a measured keep, so there is nothing honest to sit this trade beside."
        />

        {/* 7 , FORMATS. The variance inside one trade name, which is the thing
            a single national average hides. */}
        <Block
          label="Formats inside this trade"
          icon={"subtype" as GlyphId}
          rows={subRows}
          note={d.subtypes?.note}
          gap="No formats have been separated out for this trade yet, so the page cannot show the spread inside the name."
          valCol={96}
        />

        {/* 8 , WHO IT SUITS. Two columns and no scoring, because "suits you"
            is not a number and rendering it as one would be the false
            precision the whole site argues against. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            <GlyphIcon id={"who-for" as GlyphId} size={18} /> Who this trade suits
          </div>
          {suits.length || thinkTwice.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "22px 32px",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
                  It suits
                </div>
                {suits.length ? (
                  suits.map((s, i) => (
                    <p key={i} className="k" style={{ margin: "0 0 8px" }}>
                      {s}
                    </p>
                  ))
                ) : (
                  <p className="k" style={{ margin: 0 }}>
                    Not filled for this trade.
                  </p>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
                  Think twice if
                </div>
                {thinkTwice.length ? (
                  thinkTwice.map((s, i) => (
                    <p key={i} className="k" style={{ margin: "0 0 8px" }}>
                      {s}
                    </p>
                  ))
                ) : (
                  <p className="k" style={{ margin: 0 }}>
                    Not filled for this trade.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <ChapterGap reason="No character read has been written for this trade yet." scope="this trade" />
          )}
        </section>

        {/* 9 , WHAT PEOPLE GET WRONG. The "yes, but not the main reason" move
            at trade altitude. It is the warmest thing the site does, because it
            treats the reader as someone who already had a theory. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            <GlyphIcon id={"myth-reality" as GlyphId} size={18} /> What people get wrong
          </div>
          {myths.length || honestTake ? (
            <>
              {myths.map((m, i) => (
                <p key={i} className="k" style={{ margin: "0 0 10px", maxWidth: "64ch" }}>
                  {m}
                </p>
              ))}
              {honestTake ? (
                <p className="note" style={{ margin: "14px 0 0", maxWidth: "68ch" }}>
                  {honestTake}
                </p>
              ) : null}
            </>
          ) : (
            <ChapterGap reason="No claims have been checked against the figures for this trade yet." scope="this trade" />
          )}
        </section>

        {/* 10 , THE EXIT. Where a reader goes when the trade page has told them
            what it can: a place, because the dollars only land once a city is
            picked, and that is the provenance line's own argument. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Where to go from here
          </div>
          <div className="close">
            <div className="links">
              <a href="/industries">
                Every trade with a page
                <span className="g">the index</span>
              </a>
              <a href="/gb/london/restaurants">
                This trade in one city, in full
                <span className="g">London</span>
              </a>
              <a href="/world">
                Pick the place instead
                <span className="g">the world</span>
              </a>
            </div>
            <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
              The figures here are place-stable and directional. The dollars
              land once a city is picked, which is what the trade-by-place page
              is for.
            </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
