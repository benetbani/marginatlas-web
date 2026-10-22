/**
 * THE INDUSTRY PAGE, TARGET v8 (FOUNDER-VERDICTS "v8 is the approved industry target."; his "Yes: port v8 onto the site on the
 * server once the v7 port is done."): the view. v8 is v7 through the section filter on the kit of 2026-10-22 (RULEBOOK 3.7;
 * sheets/industry/README.md, "v8"; the filter's record v8/FILTER.md). It draws v8's sections in v8's order with v8's words
 * (COPY.industryV8) and the figures the builder reads from data/sourced/ (src/lib/spine/industry_v8.ts); it computes no figure, only
 * each drawing's geometry. v7's view and words are gone: this is the one.
 *
 * THE LOOK IS KIT-VERSION 3'S (sheets/kit/v3: tokens.json sha256:7302ecf366227259, kit3.css, kit3.py at 2a83eca), through the site's
 * tokens: version 3's tokens (design-tokens.ts `kit3`) are set as the kit's own variables for this page (`kit3CssVars`, a :root rule
 * this view writes, so the KIT 3 laws, which read `var(--color-*)` and `var(--shadow-*)` at the page's root, read the page's own),
 * and globals.css, THE KIT 3 PAGE: THE INDUSTRY, holds the rules under `.kit3.k-industry`. The markup is kit3.py's: the kit's class
 * names and version 3's hooks (`data-surface`, `data-disclosure`, `data-focal`, `data-kind`, `data-answer`, `data-display`,
 * `data-case`), which the laws read. No hex and no pixel in this file. The route sets `<meta name="ma:kit" content="3">` on this
 * page alone.
 *
 *   hero          the photograph (Storyblocks 357538047, lifted, never darkened, no credit), "A trade", the name, the lead; the plate:
 *                 operating profit of every 100 of sales, "as in all businesses" in the answer's line, two cells with their units
 *                 (the range's up and down arrows), the place line and the method link
 *   opening band  How many last (one falling line, the table behind "Year by year") | Trades next door (bare: no mark, no key, no fold)
 *   chapter 01    How it makes money, one band of three: Where each 100 goes (headed by operating profit) | What a year leaves (the
 *                 receipt, two notes: what goes back into the place, a small restaurant's sales) | Who works in it
 *                 (An hour of work cut on his word of 2026-10-22; its four figures stand in the official ratios' fold)
 *   chapter 02    The ratios it runs on: The official ratios (the range on one line) | What they say; Money in and out | Guests and seats
 *   chapter 03    Where it pays best: Country by country (the European survey's seven, their own counts as their own small table, the
 *                 rest behind the fold, the three tables on one set of columns; the best of the European survey ticked, each ticked
 *                 column naming its direction, data-best="high"; EUR / USD)
 *   chapter 04    Season, crowd and size: Busy and quiet months (one figure) | How crowded it is (people for every restaurant, the EU
 *                 among its countries) | Who makes the sales (the donut; What one sells in a year behind the fold)
 *   exit          Where to next as the kit's informative cards (his approved example 19): Restaurants in London, Hotels, and
 *                 Restaurants in 34 countries with two photographs; the source line
 *
 * THE FORMS (the kit's, 2a83eca): the two owner's ratio lists `data-form="owner-ratios"` (the exempt form, his FV 2221, "The ratios
 * chapter in v6 is right as it is."), the official ratios and the country table `data-form="compare-table"`, What they say
 * `data-form="note-list"`; the focal part (`data-focal`) where the target places it. Every section carries its case (`data-case`,
 * Round A of the filter: the decision it changes | why this page | why its own place), CASES below, the target's own words.
 *
 * THE RATIO NAMES ARE PLAIN TEXT. The target links each to its glossary entry, and those entries do not exist yet: a link to nowhere
 * would answer 404 at the edge (src/lib/routing/route_shapes.ts). They become links when the glossary does.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { kit3CssVars } from "@/lib/design-tokens";
import { reportHref } from "@/lib/spine/report";
import { EU, d1, srcOf, type IndustryV8, type Money, type Ratio, type RatioEnd, type RatioValue, type V8LinePoint } from "@/lib/spine/industry_v8";
import { isUsdOnly, type V4Row } from "@/lib/spine/industry_v4";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildIndustryCrumbs } from "@/lib/spine/crumb_rows";
import { CurrencySwitch3 } from "./currency-switch";
import { OpenAll } from "./kit3-islands";

/**
 * THE LOUD MOMENTS OF v8 (the kit's LOUD law; MOVING.md: "terracotta on each section's focal part inside data-focal, one a section
 * (FOCAL)"), declared for the loud-seats gate, which holds a kit render (`data-composition="kit"`) to the table its view exports. Seat
 * one is the hero's answer, 11.7 in terracotta. v8, as v7, marks no section loud (`data-loud`, none: version 3 moved the page's
 * terracotta onto each section's one focal part, his FV 2109 and FV 2128), so seats two and three hold none. Each column's best in
 * the table is in terracotta by his ruling (FV 1789 to 1790), marked `data-founder-accent`.
 */
export const LOUD_SEATS_KIT = [
  { seat: 1, card: "00 take", figure: "operating profit of every 100 of sales, the EU's, 11.7", state: "LIT", condition: "v8's hero answer in the kit's terracotta, on the one trade v8 draws (buildIndustryV8 returns null wherever a row is missing)" },
  { seat: 2, card: "none", figure: "no second loud section", state: "NO HONEST CANDIDATE", condition: "v8, approved 2026-10-22 as v7 was, marks no section loud: on kit version 3 each section's one focal part (data-focal) carries the terracotta instead (his FV 2109, FV 2128)" },
  { seat: 3, card: "none", figure: "no third loud section", state: "NO HONEST CANDIDATE", condition: "as seat two; the table's column winners are his ruling, not a seat" },
] as const satisfies readonly LoudSeat[];

const T = COPY.industryV8;
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{([\w:-]+)\}/g, (_m, k) => vars[k] ?? "");
const METHOD = "/methodology";
const HERO = { src: "/spine/industry-restaurants.webp", small: "/spine/industry-restaurants-1200.webp", w: 2400, h: 1350 };
const R = "restaurants";

/**
 * Each section's case (Round A of the section filter, RULEBOOK 3.7; the CASE law reads `data-case`): three parts, the decision it
 * changes | why this page | why its own place. The target's own words (build_industry_v8.py CASES); Round B judges whether each is
 * true (v8/FILTER.md holds the verdicts).
 */
const CASES: Record<string, string> = {
  lasts: "a visitor weighing whether to open a restaurant reads this to see the odds it is still open after five years | this page, because survival is the trade's own, the same in any city | its own place, because the odds are the first risk an owner weighs, before any money",
  "next-door": "a visitor choosing between food, drink and lodging reads this to see which nearby trade keeps the most of each sale | this page, because it sets this trade beside its neighbours | its own place, because it answers which trade, where the rest of the page answers how this one works",
  split: "a visitor setting prices and a team reads this to see where each 100 of sales goes | this page, because the split of sales is the trade's own economics | its own place, because it draws the page's answer whole: purchases, staff and operating profit",
  year: "a visitor asking whether a restaurant can pay them reads this to see a year's operating profit in money | this page, because it is the trade's average year across Europe | its own place, because it turns the shares into a year's money, and what goes back into the place",
  people: "a visitor planning a team reads this to see how many people a restaurant runs on, and how many are owners | this page, because team size is the trade's own | its own place, because it counts people, where its partners count money",
  ratios: "a visitor checking their own books reads this to set them beside the trade's official ratios | this page, because the ratios are the trade's, across countries | its own place, because it gathers every official ratio in one table",
  say: "a visitor reading the ratios table reads this to know what the ratios mean in plain words | this page, because it reads the table beside it | its own place, because it is the page's one prose reading",
  money: "a visitor setting up their books reads this to know which money ratios to track and what moves them | this page, because they are the trade's working ratios | its own place, because no survey publishes them, so they carry a formula, not a number",
  guests: "a visitor planning a dining room reads this to know which guest and seat ratios to track and what moves them | this page, because they are the trade's working ratios | its own place, because they count guests and seats, where its partner counts money",
  places: "a visitor choosing where to open reads this to see what a restaurant keeps, sells and employs in each country | this page, because it sets the trade side by side across countries | its own place, because it is the page's one comparison of places",
  months: "a visitor planning cash reads this to see when the money comes in through the year | this page, because the season is the trade's own | its own place, because it reads time, where its partners read rivals and size",
  density: "a visitor weighing rivals reads this to see how many people each restaurant shares | this page, because density is the trade's, country by country | its own place, because it reads rivals, where its partners read time and size",
  channels: "a visitor opening a small restaurant reads this to see how much of the trade's sales small ones make, and what one sells | this page, because the size split is the trade's own | its own place, because it is the page's one reading by size",
};

/** Version 3's tokens as the kit's own variables, for this page: a :root rule, so the page and the laws' probes read one set. */
const ROOT_VARS = `:root{${Object.entries(kit3CssVars())
  .map(([k, v]) => `${k}:${v}`)
  .join(";")}}`;

/* ------------------------------------------------------------------ the kit's small parts (kit3.py) */

/** The money pair: euros first, its dollars in parentheses (the switch on the root puts dollars first). `src` stamps its provenance. */
function M({ m, src }: { m: Money; src?: string }) {
  return (
    <span className="m" {...(src ? { "data-src": src } : {})}>
      <span className="p">{m.local}</span>
      <span className="s">{m.usd}</span>
    </span>
  );
}
/** A printed figure with its provenance (`data-src`, the file and row it was read from), the mark the fact-once gate reads. */
function S({ src, focal, children }: { src: string; focal?: boolean; children: React.ReactNode }) {
  return (
    <span data-src={src} {...(focal ? { "data-focal": "" } : {})}>
      {children}
    </span>
  );
}
/** The words under a section's figure (kit3's `.unit`; the line rule reads `data-focal-words`). */
function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="unit" data-focal-words="">
      {children}
    </span>
  );
}
/** A sentence from the copy with figures in it: each `{key}` becomes its part (a stamped figure, a money pair). */
function Fill({ text, parts }: { text: string; parts: Record<string, React.ReactNode> }) {
  const bits = text.split(/(\{[\w:-]+\})/g).filter(Boolean);
  return (
    <>
      {bits.map((p, i) => {
        const m = /^\{([\w:-]+)\}$/.exec(p);
        return <React.Fragment key={i}>{m ? parts[m[1]] : p}</React.Fragment>;
      })}
    </>
  );
}

/** The kit's glyphs (kit_head.html's sprite and kit3.py's EXTRA_SYMBOLS), drawn inline at one of version 3's three icon sizes. */
const GLYPH: Record<string, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  /* the range's up and down arrows (kit3.py EXTRA_SYMBOLS, i-up and i-down, a9c7023) */
  up: <path d="M12 19V5M6 11l6-6 6 6" strokeWidth="2" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" strokeWidth="2" />,
  bars: <path d="M5 20V12M12 20V5M19 20v-9" strokeWidth="2.2" />,
  shop: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9h16M4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 2 3 1 0 2-1.3 2-3 0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M5.5 12v8h13v-8M10 20v-5h4v5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" strokeWidth="2.2" />,
  chev: <path d="M6 9l6 6 6-6" strokeWidth="2" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" />,
};
function Icon({ id, size = 16 }: { id: keyof typeof GLYPH; size?: 16 | 20 | 24 }) {
  return (
    <svg className={`i${size}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {GLYPH[id]}
    </svg>
  );
}
function Tick() {
  return (
    <svg className="tk" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 1. The fold: the depth of one section, closed on arrival behind its plus, on a panel (kit3.fold). */
function Fold({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="fold" data-surface="panel" data-disclosure="fold">
      <summary>
        <span>{summary}</span>
        <Icon id="plus" />
      </summary>
      <div className="fold-in">{children}</div>
    </details>
  );
}

/** Label and value rows (kit.rows): the value in the next column, 24 after the longest label (the kit of 2a83eca). */
function Rows({ rows, className = "kv" }: { rows: Array<{ key: string; label: React.ReactNode; value: React.ReactNode }>; className?: string }) {
  return (
    <dl className={className}>
      {rows.map((r) => (
        <div key={r.key} data-row="">
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A second list in one section, under its own title (kit3.group). */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="group">
      <p className="lt">{title}</p>
      {children}
    </div>
  );
}

/** One open section in four parts (kit3.card): title and question; the figure; the body; the caption "Place, 2026.". `form` is the
 *  kit's named form (kit3.card's `form=`), the exempt forms the laws read; every section's case stands on it (`data-case`, CASES). */
function Sub({ id, title, ask, tag, per100, cls, form, fig, children, caption }: { id: string; title: string; ask: string; tag?: string; per100?: boolean; cls?: string; form?: "compare-table" | "note-list" | "owner-ratios"; fig?: React.ReactNode; children: React.ReactNode; caption: string }) {
  return (
    <article id={id} className={`sub spine-card${cls ? ` ${cls}` : ""}`} data-section={id} data-block={id} data-card="" {...(per100 ? { "data-per": "100" } : {})} {...(form ? { "data-form": form } : {})} data-case={CASES[id]} aria-labelledby={`h-${id}`}>
      <header>
        <h3 id={`h-${id}`}>
          {title}
          {tag ? <span className="etag">{tag}</span> : null}
        </h3>
        <p className="ask">{ask}</p>
      </header>
      <div className="sfig">{fig ?? null}</div>
      <div className="sbody">{children}</div>
      <p className="caption">{caption}</p>
    </article>
  );
}

/** A chapter (kit.chapter): a muted number and one plain title, then its bands; `tint` alternates the near-white ground. */
function Chapter({ num, id, title, tint, children }: { num: string; id: string; title: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section className={`chapter${tint ? " tint" : ""}`} aria-labelledby={id} data-chapter={num}>
      <div className="wrap">
        <div className="chead">
          <span className="num">{num}</span>
          <h2 id={id}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the hero */

function Hero({ v }: { v: IndustryV8 }) {
  /* two cells, the range's highest and lowest, by the up and down arrows (all businesses in the answer's line, bars and cafes cut) */
  const cells = v.hero.cells.filter((c) => c.key === "high" || c.key === "low");
  const glyph = { high: "up", low: "down" } as const;
  return (
    <section className="city-hero ind" aria-labelledby="ind-h" data-hero="1">
      <div className="pano" data-visual="1">
        {/* Bright, never darkened, no credit (FV 1604 to 1605, 1631 to 1633, 1777 to 1778). */}
        <img src={HERO.src} srcSet={`${HERO.small} 1200w, ${HERO.src} 2400w`} fetchPriority="high" sizes="100vw" alt={T.hero.photoAlt} width={HERO.w} height={HERO.h} />
      </div>
      <div className="wrap hero-grid">
        <div className="title-plate" data-surface="plate">
          <p className="crumb">{T.hero.kicker}</p>
          <h1 id="ind-h" data-display="">
            {T.hero.name}
          </h1>
          <p className="lede">{T.hero.lede}</p>
        </div>
        <div id="take" className="fig-card" data-surface="plate" data-archetype="answer-card" data-level="page" data-answers={SURFACE_ANSWERS.industry} data-block="take" data-card="">
          <div className="answer">
            <div>
              <p className="al">{T.hero.answerLabel}</p>
              <p className="av" data-answer="">
                <span className="big" data-src={srcOf("SBS", "gross_operating_rate", R, EU)}>
                  {v.hero.answer}
                </span>{" "}
                {T.hero.answerUnit}
              </p>
              <p className="as">{T.hero.basis}</p>
            </div>
          </div>
          <div className="cells">
            {cells.map((c) => (
              <div className="cell" data-surface="panel" key={c.key}>
                <p className="cl">
                  <Icon id={glyph[c.key as "high" | "low"]} size={24} />
                  {T.hero.cells[c.key as "high" | "low"]}
                </p>
                <p className="cv">
                  <S src={c.src}>{c.value}</S>
                  <span className="cn">{c.country ? fill(T.hero.unitPlace, { name: c.country }) : T.hero.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="cap">
            {T.hero.place} <a href={METHOD}>{T.hero.how}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the opening band: how many last | trades next door */

function Lasts({ v }: { v: IndustryV8 }) {
  /* one falling line carries it (the kit's line, gallery "Still trading"; Round B on v7 and v8): restaurants to five years in
     terracotta, all businesses to three on the benchmark grey; the year-by-year table behind the fold */
  const x = (year: number) => ((year / 5) * 100).toFixed(1);
  const yAt = (value: number) => (100 - value).toFixed(1);
  /* each line starts at (opening, 100 of 100 still open), the target's own first point */
  const points = (pts: V8LinePoint[]) => ["0.0,0.0", ...pts.map((p) => `${x(p.year)},${yAt(p.value)}`)].join(" ");
  const aria = fill(T.lasts.lineAria, { r: v.lasts.line.rest.map((p) => p.text).join(", "), a: v.lasts.line.all.map((p) => p.text).join(", ") });
  return (
    <Sub
      id="lasts"
      title={T.lasts.title}
      ask={T.lasts.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <S src={srcOf("DEMO", "survival_5y", R, EU)}>{v.lasts.five}%</S> <Unit>{T.lasts.unit}</Unit>
        </p>
      }
    >
      <div data-kind="line" data-visual="" role="img" aria-label={aria}>
        <div className="lplot" data-plot="" data-focal="">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={points(v.lasts.line.all)} fill="none" stroke="var(--color-benchmark)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={points(v.lasts.line.rest)} fill="none" stroke="var(--color-terra)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          {v.lasts.line.all.map((p) => (
            <span key={`b${p.year}`} className="dot b" style={{ left: `${x(p.year)}%`, top: `${yAt(p.value)}%` }} />
          ))}
          {v.lasts.line.rest.map((p) => (
            <span key={p.year} className="dot" style={{ left: `${x(p.year)}%`, top: `${yAt(p.value)}%` }} />
          ))}
        </div>
        <div className="lx">
          <span style={{ left: 0 }}>{T.lasts.x.open}</span>
          <span style={{ left: "60%" }}>{T.lasts.x.three}</span>
          <span style={{ left: "100%" }}>{T.lasts.x.five}</span>
        </div>
      </div>
      <ul className="akey">
        <li>
          <i className="tc" />
          {T.lasts.key.trade}
        </li>
        <li>
          <i className="bm" />
          {T.lasts.key.all}
        </li>
      </ul>
      <Fold summary={T.lasts.fold}>
        <table className="forms">
          <caption className="sr">{T.lasts.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{T.lasts.head.open}</th>
              <th scope="col">{T.lasts.head.trade}</th>
              <th scope="col">{T.lasts.head.all}</th>
            </tr>
          </thead>
          <tbody>
            {v.lasts.years.map((y) => (
              <tr key={y.key}>
                <th scope="row">{T.lasts.years[y.key as keyof typeof T.lasts.years]}</th>
                <td data-l={T.lasts.label.trade}>
                  <S src={srcOf("DEMO", `survival_${y.key.slice(1)}y`, R, EU)}>{y.trade}</S>
                </td>
                <td data-l={T.lasts.label.all}>{y.all === null ? "–" : <S src={srcOf("DEMO", `survival_${y.key.slice(1)}y`, "all", EU)}>{y.all}</S>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">{T.lasts.note}</p>
      </Fold>
    </Sub>
  );
}

function NextDoor({ v }: { v: IndustryV8 }) {
  const nd = v.nextDoor;
  const pct = (x: number) => `${((x / nd.scaleTop) * 100).toFixed(1)}%`;
  const name = (k: string) => T.nextDoor.names[k as keyof typeof T.nextDoor.names];
  const aria = fill(T.nextDoor.aria, { list: nd.items.map((i) => `${name(i.key)} ${i.text}`).join(", ") });
  return (
    <Sub
      id="next-door"
      title={T.nextDoor.title}
      ask={T.nextDoor.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <span>{nd.rankWord}</span> <Unit>{T.nextDoor.unit}</Unit>
        </p>
      }
    >
      {/* bare since v8 (Round B on v7): one rank, one bar list, no all-businesses mark, no key, no dictionary fold */}
      <div className="rbars" data-kind="ranked-bars" data-visual="" role="img" aria-label={aria}>
        {nd.items.map((i) => (
          <div key={i.key} className="rb" {...(i.me ? { "data-focal": "" } : {})}>
            <span>{name(i.key)}</span>
            <span className="tv" data-src={i.src}>
              {i.text}
            </span>
            <span className="tr" data-bar="">
              <b style={{ width: pct(i.value) }} />
            </span>
          </div>
        ))}
      </div>
    </Sub>
  );
}

/* ------------------------------------------------------------------ chapter 01: how it makes money */

function Split({ v }: { v: IndustryV8 }) {
  const { trade: r, all: a } = v.split;
  const bar = (name: string, p: { purchases: number; staff: number; left: number }, t: string) => {
    const tot = p.purchases + p.staff + p.left;
    /* The three parts at their shares of 99.4 of the track, the two 2s of gap taking the rest (the target's own arithmetic). */
    const w = (x: number) => `${((x / tot) * 99.4).toFixed(2)}%`;
    return (
      <div>
        <p className="kn">{name}</p>
        <div className="kt" data-seg="">
          <span className="n3" style={{ width: w(p.purchases) }}>
            <i data-src={srcOf("SBS", "purchases_share", t, EU)}>{d1(p.purchases)}</i>
          </span>
          <span className="ink2" style={{ width: w(p.staff) }}>
            <i data-src={srcOf("SBS", "staff_cost_share", t, EU)}>{d1(p.staff)}</i>
          </span>
          <span className="tc" data-profit="" style={{ width: w(p.left) }} />
        </div>
      </div>
    );
  };
  const aria = fill(T.split.aria, { p: d1(r.purchases), s: d1(r.staff), k: d1(r.left), ap: d1(a.purchases), as: d1(a.staff), ak: d1(a.left) });
  return (
    <Sub
      id="split"
      title={T.split.title}
      ask={T.split.ask}
      caption={T.eu}
      per100
      fig={
        <p className="fig">
          <S src={srcOf("SBS", "gross_operating_rate", R, EU)}>{d1(r.left)}</S> <Unit>{T.split.unit}</Unit>
        </p>
      }
    >
      <div className="kbars" data-kind="part-bar" data-visual="" data-focal="" role="img" aria-label={aria}>
        {bar(T.split.rows.trade, r, R)}
        {bar(T.split.rows.all, a, "all")}
      </div>
      <ul className="akey">
        <li>
          <i className="n3" />
          {T.split.key.purchases}
        </li>
        <li>
          <i className="ink2" />
          {T.split.key.staff}
        </li>
        <li>
          <i className="tc" />
          {T.split.key.left}
        </li>
      </ul>
      <p className="note">
        <Fill
          text={T.split.note}
          parts={{
            s: <S src={srcOf("SBS", "staff_cost_share", R, EU)}>{d1(r.staff)}</S>,
            all: <S src={srcOf("SBS", "staff_cost_share", "all", EU)}>{d1(a.staff)}</S>,
          }}
        />
      </p>
    </Sub>
  );
}

function Year({ v }: { v: IndustryV8 }) {
  const y = v.year;
  return (
    <Sub
      id="year"
      title={T.year.title}
      ask={T.year.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <M m={y.left} src={srcOf("ECON", "surplus_per_business", R, EU)} /> <Unit>{T.year.unit}</Unit>
        </p>
      }
    >
      <Rows
        className="kv year"
        rows={[
          /* a receipt: sales, less purchases, less staff, a sum line (the stylesheet's), operating profit in terracotta */
          { key: "sales", label: T.year.rows.sales, value: <M m={y.sales} src={srcOf("SBS", "sales_per_business", R, EU)} /> },
          {
            key: "purchases",
            label: T.year.rows.purchases,
            value: (
              <>
                <span className="mi">{T.year.minus}</span>
                <M m={y.bought} src={srcOf("ECON", "purchases_per_business", R, EU)} />
              </>
            ),
          },
          {
            key: "staff",
            label: T.year.rows.staff,
            value: (
              <>
                <span className="mi">{T.year.minus}</span>
                <M m={y.staff} src={srcOf("ECON", "staff_cost_per_business", R, EU)} />
              </>
            ),
          },
          {
            key: "profit",
            label: <b>{T.year.rows.profit}</b>,
            value: (
              <b data-focal="">
                <M m={y.leftRow} src={srcOf("ECON", "surplus_per_business", R, EU)} />
              </b>
            ),
          },
        ]}
      />
      {/* What it puts back and the small one's sales, the two notes (Round B on v7: their sections merged here) */}
      <p className="note">
        <Fill
          text={T.year.noteBack}
          parts={{
            share: <S src={srcOf("ECON", "investment_share_of_surplus", R, EU)}>{v.putsBack.share}</S>,
            put: <M m={v.putsBack.put} src={srcOf("ECON", "investment_per_business", R, EU)} />,
          }}
        />
      </p>
      <p className="note">
        <Fill
          text={T.year.noteSmall}
          parts={{
            n: <S src={`derived:${srcOf("SBS", "size_class_share", R, EU)}:0 to 9`}>{v.smallBig.smallShare}</S>,
            sales: <M m={v.smallBig.lead} src={srcOf("SIZE", "sales_per_business_by_size", R, EU, "0 to 9 persons employed")} />,
          }}
        />
      </p>
    </Sub>
  );
}

function People({ v }: { v: IndustryV8 }) {
  const p = v.people;
  return (
    <Sub
      id="people"
      title={T.people.title}
      ask={T.people.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <S src={srcOf("SBS", "persons_per_business", R, EU)} focal>
            {fill(T.people.fig, { n: p.persons })}
          </S>{" "}
          <Unit>{fill(T.people.unit, { all: p.allPersons })}</Unit>
        </p>
      }
    >
      <Rows
        rows={[
          { key: "wage", label: T.people.rows.wage, value: <S src={srcOf("ECON", "employees_per_business", R, EU)}>{p.wage}</S> },
          { key: "owners", label: T.people.rows.owners, value: <S src={srcOf("ECON", "owners_per_business", R, EU)}>{p.owners}</S> },
          { key: "jobs", label: T.people.rows.jobs, value: <S src={`derived:${srcOf("ECON", "employees_per_business", R, EU)}*fte_share`}>{p.jobs}</S> },
        ]}
      />
      <p className="note">{T.people.note}</p>
    </Sub>
  );
}

/* ------------------------------------------------------------------ chapter 02: the ratios it runs on */

/** A ratio's printed value (the target's ratio_value): text, or a money pair; a dash where none is published. */
function RV({ value, src }: { value: RatioValue; src: string | null }) {
  if (value === null) return <>–</>;
  if ("money" in value) return <M m={value.money} src={src ?? undefined} />;
  return src ? <S src={src}>{value.text}</S> : <>{value.text}</>;
}
function End({ e }: { e: RatioEnd }) {
  return (
    <span>
      <span className="cn">{e.name}</span>
      <RV value={e.value} src={e.src} />
    </span>
  );
}

function RatioTable({ rows, caption }: { rows: Ratio[]; caption: string }) {
  const H = T.ratios.official;
  return (
    <table className="forms ratios">
      <caption className="sr">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{H.head.ratio}</th>
          <th scope="col">{H.head.trade}</th>
          <th scope="col">{H.head.all}</th>
          <th scope="col">{H.head.range}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} data-ratio={r.key}>
            <th scope="row">
              {/* Plain text: the target's link to the glossary entry waits for the entry (the header says why). */}
              <span className="rname">{r.name}</span>
              <span className="rf">{r.formula}</span>
            </th>
            <td data-l={H.label.trade}>
              <RV value={r.restaurants} src={r.src.restaurants} />
            </td>
            <td data-l={H.label.all}>
              <RV value={r.all} src={r.src.all} />
            </td>
            <td data-l={H.label.range} className="rng">
              {r.lo && r.hi ? (
                <span className="lh">
                  <End e={r.lo} />
                  <span className="to">{H.to}</span>
                  <End e={r.hi} />
                </span>
              ) : (
                "–"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OfficialRatios({ v }: { v: IndustryV8 }) {
  const O = T.ratios.official;
  const r = v.ratios;
  return (
    <Sub id="ratios" title={O.title} ask={O.ask} caption={T.eu} cls="ratiosec" form="compare-table">
      <RatioTable rows={r.first} caption={O.captionFirst} />
      <Fold summary={fill(O.fold, { n: String(r.hour.length + r.trade.length) })}>
        <Group title={O.hour.title}>
          <RatioTable rows={r.hour} caption={O.hour.caption} />
        </Group>
        <Group title={O.trade.title}>
          <RatioTable rows={r.trade} caption={O.trade.caption} />
        </Group>
        <p className="note">{O.swingNote}</p>
      </Fold>
      <p className="note">{O.note}</p>
    </Sub>
  );
}

/** One line of "What they say": its words, each `{key}` (or `{key:all}`) the ratio's printed value with its provenance. */
function SayLine({ text, v }: { text: string; v: IndustryV8 }) {
  const parts = text.split(/(\{[\w:-]+\})/g).filter(Boolean);
  return (
    <li>
      {parts.map((p, i) => {
        const m = /^\{([\w-]+)(?::(all))?\}$/.exec(p);
        if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
        if (m[1] === "third") return <React.Fragment key={i}>{T.ratios.say.third[v.ratios.hourThird]}</React.Fragment>;
        const r = v.ratios.byKey[m[1]];
        return <RV key={i} value={m[2] ? r.all : r.restaurants} src={m[2] ? r.src.all : r.src.restaurants} />;
      })}
    </li>
  );
}

function WhatTheySay({ v }: { v: IndustryV8 }) {
  const S_ = T.ratios.say;
  return (
    <Sub id="say" title={S_.title} ask={S_.ask} caption={T.eu} form="note-list">
      <ul className="says">
        {S_.lines.map((l) => (
          <SayLine key={l} text={l} v={v} />
        ))}
      </ul>
      <div className="kinds3" data-surface="panel">
        {S_.kinds.map((k) => (
          <p key={k.term}>
            <b>{k.term}</b> {k.rest}
          </p>
        ))}
      </div>
    </Sub>
  );
}

/** 2. The question list (kit3.qlist): independent questions, several may open at once; "Open all" past five. No number on it: the
 *  owner's ratios, the kit's exempt form `owner-ratios` (his FV 2221). */
type OwnerList = { title: string; ask: string; items: ReadonlyArray<{ name: string; formula: string; answer: string }> };
function QList({ id, list }: { id: string; list: OwnerList }) {
  return (
      <div className="qlist" id={id} data-disclosure="qlist">
        {list.items.length > 5 ? <OpenAll list={id} open={T.ratios.openAll} close={T.ratios.closeAll} /> : null}
        {list.items.map((q) => (
          <details key={q.name}>
            <summary>
              <span>{`${q.name}: ${q.formula}`}</span>
              <Icon id="chev" />
            </summary>
            <p className="qa">{q.answer}</p>
          </details>
        ))}
      </div>
  );
}
function MoneyList() {
  const L = T.ratios.money;
  return (
    <Sub id="money" title={L.title} ask={L.ask} caption={T.ratios.anyCountry} form="owner-ratios">
      <QList id="qmoney" list={L} />
    </Sub>
  );
}
function Guests() {
  const L = T.ratios.guests;
  return (
    <Sub id="guests" title={L.title} ask={L.ask} caption={T.ratios.anyCountry} form="owner-ratios">
      <QList id="qguests" list={L} />
    </Sub>
  );
}

/* ------------------------------------------------------------------ chapter 03: where it pays best */

function PeerCell({ label, children, win }: { label: string; children: React.ReactNode | null; win?: boolean }) {
  if (children === null) {
    return (
      <td className="none" data-l={label}>
        <span className="v">–</span>
      </td>
    );
  }
  return (
    /* Each column's best in terracotta is his ruling (FOUNDER-VERDICTS 1789 to 1790), not a loud seat: the cell says so
       (`data-founder-accent`), so the accent walk does not count it. */
    <td className={win ? "win" : undefined} data-l={label} {...(win ? { "data-founder-accent": "1" } : {})}>
      <span className="v">
        {win ? <Tick /> : null}
        {children}
      </span>
    </td>
  );
}

function Table({ v }: { v: IndustryV8 }) {
  const t = v.table;
  const [hGor, hSales, hPeople, hOpen] = T.table.heads;
  /* Each column's win, the European survey's best (Round B on v8: the United States counts hotels in with restaurants, and companies
     with staff alone, so its 59.3% is never ticked against the survey; the United Kingdom's own count neither). More favours an
     owner in all three ticked columns: the column says so where its table ticks it (data-best="high", the TICK law). */
  const wins: Array<(r: V4Row) => boolean> = [
    (r) => r.gor !== null && r.gor === t.best.gor,
    (r) => r.ownSurvey === "EU" && r.salesUsd !== null && r.salesUsd === t.best.salesUsd,
    () => false,
    (r) => r.ownSurvey === "EU" && r.open5 !== null && r.open5 === t.best.open5,
  ];
  const tr = (r: V4Row) => {
    /* Each row's own files (the v4 builder reads them): the European survey's, the UK's own and the US's own. */
    const f = r.ownSurvey === "EU" ? ({ gor: "SBS", sales: "SBS", people: "SBS", open: "DEMO" } as const) : r.ownSurvey === "GB" ? ({ gor: "UK_ABS", sales: "UK_ABS", people: "UK_ABS", open: "UK_DEMO" } as const) : ({ gor: "US_EC", sales: "US_EC", people: "US_EC", open: "US_BED" } as const);
    const src = (k: keyof typeof f, item: string) => srcOf(f[k], item, R, r.code);
    return (
      <tr key={r.code}>
        <th scope="row">{r.name}</th>
        <PeerCell label={hGor[0]} win={wins[0](r)}>
          {r.gor === null ? null : <S src={src("gor", "gross_operating_rate")}>{d1(r.gor)}</S>}
        </PeerCell>
        <PeerCell label={hSales[0]} win={wins[1](r)}>
          {r.sales === null ? null : isUsdOnly(r.sales) ? (
            <span className="usd" data-src={src("sales", "sales_per_business")}>
              {r.sales.usdOnly}
            </span>
          ) : (
            <M m={r.sales} src={src("sales", "sales_per_business")} />
          )}
        </PeerCell>
        <PeerCell label={hPeople[0]}>{r.people === null ? null : <S src={src("people", r.ownSurvey === "US" ? "employees_per_business" : "persons_per_business")}>{r.people}</S>}</PeerCell>
        <PeerCell label={hOpen[0]} win={wins[3](r)}>
          {r.open5 === null ? null : <S src={src("open", "survival_5y")}>{`${d1(r.open5)}%`}</S>}
        </PeerCell>
      </tr>
    );
  };
  /* The three tables on one set of columns (table-layout fixed, the colgroup), so their own counts read under the survey's; a column
     names its direction where this table ticks it (TICK: the tick is the table's own highest). */
  const table = (rows: V4Row[], caption: string) => (
    <table className="peers" data-archetype="compare-table">
      <caption className="sr">{caption}</caption>
      <colgroup>
        <col className="c0" />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">{T.table.country}</th>
          {T.table.heads.map(([a, b], i) => (
            <th scope="col" key={a} {...(rows.some(wins[i]) ? { "data-best": "high" } : {})}>
              {a}
              <small>{b}</small>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows.map(tr)}</tbody>
    </table>
  );
  return (
    <Sub id="places" title={T.table.title} ask={fill(T.table.ask, { n: String(t.count) })} caption={T.table.caption} cls="wide" form="compare-table">
      <div className="tsw">
        <CurrencySwitch3 label={T.currency.group} />
      </div>
      {table(t.first, fill(T.table.captionFirst, { n: String(t.first.length) }))}
      {/* their own counts as their own small table under its title, its head read by a screen reader (the stylesheet hides it) */}
      <Group title={T.table.own}>{table(t.own, T.table.captionOwn)}</Group>
      <Fold summary={fill(T.table.fold, { n: String(t.rest.length) })}>{table(t.rest, fill(T.table.captionRest, { n: String(t.rest.length) }))}</Fold>
      <p className="key">
        <Tick />
        <span>{T.table.key}</span>
      </p>
      <p className="note">{T.table.usNote}</p>
      <p className="note">
        <a href={METHOD}>{T.hero.how}</a>
      </p>
    </Sub>
  );
}

/* ------------------------------------------------------------------ chapter 04: season, crowd and size */

function Months({ v }: { v: IndustryV8 }) {
  const m = v.months;
  const h = (x: number) => `${((x / m.scaleTop) * 100).toFixed(1)}%`;
  const aria = fill(T.months.aria, { list: m.shape.map((x, i) => `${T.months.names[i]} ${d1(x)}`).join(", ") });
  return (
    <Sub
      id="months"
      title={T.months.title}
      tag={T.months.tag}
      ask={T.months.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <S src={`derived:${srcOf("SEASON", "season_index_month", R, EU)}:busiest/quietest`}>{m.swing}%</S>{" "}
          <Unit>{fill(T.months.unit, { busiest: T.months.names[m.busiest], quietest: T.months.names[m.quietest] })}</Unit>
        </p>
      }
    >
      {/* Every month grey but the busiest (the section's focal part; one figure a month since v8, the swing carries the section),
          the quietest hollow, a line at the year's average (100) named Average, at --avg on the columns' scale. */}
      <div className="vchart" data-kind="month-columns" data-visual="" style={{ "--avg": h(100) } as React.CSSProperties} role="img" aria-label={aria}>
        {m.shape.map((x, i) => (
          <div className={`vcol${i === m.quietest ? " low" : ""}`} key={i} {...(i === m.busiest ? { "data-focal": "" } : {})}>
            <div className="vb">
              {i === 0 ? <span className="avgl">{T.months.average}</span> : null}
              <b style={{ height: h(x) }} />
            </div>
            <span className="vm">
              <span className="ml">{T.months.names[i].slice(0, 3)}</span>
              <span className="ms">{T.months.letters[i]}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="note">{fill(T.months.note, { n: String(m.members) })}</p>
    </Sub>
  );
}

function Density({ v }: { v: IndustryV8 }) {
  const d = v.density;
  return (
    <Sub
      id="density"
      title={T.density.title}
      ask={T.density.ask}
      caption={T.density.caption}
      fig={
        <p className="fig">
          <S src={d.src} focal>
            {d.eu}
          </S>{" "}
          <Unit>{T.density.unit}</Unit>
        </p>
      }
    >
      {/* people for every restaurant, most first; the EU in bold among the countries it sums (the target's own insertion) */}
      <Rows
        rows={d.rows.map((r) => ({
          key: r.name,
          label: r.eu ? <b>{r.name}</b> : r.name,
          value: r.eu ? (
            <b>
              <S src={r.src}>{r.people}</S>
            </b>
          ) : (
            <S src={r.src}>{r.people}</S>
          ),
        }))}
      />
    </Sub>
  );
}

/** The page's one donut, 144 across, the parts clockwise from the top; the small ones the section's focal part, in terracotta. Each
 *  size named over its range (his sizes, FV 1679); What one sells in a year behind the fold (Round B on v7). */
function Donut({ v }: { v: IndustryV8 }) {
  const parts = v.donut.parts;
  const tone = { small: "var(--color-terra)", medium: "var(--color-ink-2)", large: "var(--color-faint)", corporate: "var(--color-n3)" } as const;
  const key = { small: "tc", medium: "ink2", large: "fa", corporate: "n3" } as const;
  const measure = { small: "0 to 9 persons employed", large: "50 to 249 persons employed", corporate: "250 persons employed or more" } as Record<string, string>;
  const r = 60, c = 72, w = 24;
  const circ = 2 * 3.14159265 * r;
  const tot = parts.reduce((s, p) => s + p.value, 0);
  let acc = 0;
  const arcs = parts.map((p) => {
    const ln = (p.value / tot) * circ;
    const el = <circle key={p.key} cx={c} cy={c} r={r} fill="none" style={{ stroke: tone[p.key] }} strokeWidth={w} strokeDasharray={`${(ln - 2).toFixed(2)} ${(circ - ln + 2).toFixed(2)}`} strokeDashoffset={(-acc).toFixed(2)} transform={`rotate(-90 ${c} ${c})`} />;
    acc += ln;
    return el;
  });
  const aria = fill(T.donut.aria, { list: parts.map((p) => `${T.donut.parts[p.key]} ${d1(p.value)}%`).join(", ") });
  return (
    <Sub
      id="channels"
      title={T.donut.title}
      ask={T.donut.ask}
      caption={T.eu}
      fig={
        <p className="fig">
          <S src={srcOf("SIZE", "turnover_share_by_size", R, EU, measure.small)}>{v.donut.small}%</S> <Unit>{T.donut.unit}</Unit>
        </p>
      }
    >
      <div className="ringrow">
        <svg className="donut" data-kind="donut" data-visual="" data-focal="" viewBox="0 0 144 144" role="img" aria-label={aria}>
          {arcs}
        </svg>
        <Rows
          rows={parts.map((p) => ({
            key: p.key,
            label: (
              <>
                <i className={`k ${key[p.key]}`} />
                <span className="sz">
                  {T.donut.parts[p.key]}
                  <small>{T.donut.ranges[p.key]}</small>
                </span>
              </>
            ),
            value: <S src={p.key === "medium" ? `derived:${srcOf("SIZE", "turnover_share_by_size", R, EU)}:10 to 49` : srcOf("SIZE", "turnover_share_by_size", R, EU, measure[p.key])}>{`${d1(p.value)}%`}</S>,
          }))}
        />
      </div>
      {/* What one sells in a year, his four sizes (the Sales by size section merged here, Round B on v7) */}
      <Fold summary={T.donut.fold}>
        <Rows
          rows={v.salesBySize.rows.map((s) => ({
            key: s.key,
            label: T.donut.sizes[s.key],
            value: <M m={s.money} src={s.src} />,
          }))}
        />
      </Fold>
    </Sub>
  );
}

/* ------------------------------------------------------------------ the exit */

const dateText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The exit as the kit's informative cards (kit3.exit_cards, info_card; his approved example 19): the photograph, the kicker with
 *  its icon, the title, one line, and the foot with where it leads; the whole card the link. */
function Close({ v, path }: { v: IndustryV8; path: string }) {
  const doorKey = (d: (typeof T.close.cards)[number]) => d.city ?? (d.href === "/compare" ? "compare" : "hotels");
  const lands = (d: (typeof T.close.cards)[number]) => (d.city ? SURFACE_ANSWERS.cell : d.href === "/compare" ? SURFACE_ANSWERS.compare : SURFACE_ANSWERS.industry);
  return (
    <section className="chapter close tint" aria-labelledby="c9" data-close="">
      <div className="wrap">
        <div className="chead">
          <h2 id="c9">{T.close.title}</h2>
        </div>
        <div className="icards" data-archetype="terminus" data-target="kit">
          {T.close.cards.map((d, i) => (
            <a key={d.title} className="icard" data-surface="card" href={v.doors[i].href} data-door={doorKey(d)} data-lands={lands(d)}>
              <span className={`icimg${d.img.length > 1 ? " split" : ""}`} data-media="">
                {/* each photograph's path stands whole in the copy, never assembled here (the geo-link-construction gate) */}
                {d.img.map((img, j) => (
                  <img key={img} src={img} alt={d.alt[j]} loading="lazy" />
                ))}
              </span>
              <span className="icbody">
                <span className="ickick">
                  <Icon id={d.icon as keyof typeof GLYPH} />
                  {d.kicker}
                </span>
                <h3>{fill(d.title, { n: String(v.table.count) })}</h3>
                <span className="icline">{d.line}</span>
                <span className="icfoot">
                  <span className="icgo">{d.go}</span>
                  <Icon id="arrow" />
                </span>
              </span>
            </a>
          ))}
        </div>
        <p className="srcline">
          <a href={METHOD}>{T.close.how}</a>
          <a href={reportHref(path)} rel="nofollow" data-report="1">
            {T.close.report}
          </a>
          <span>{fill(T.close.checked, { date: dateText(v.checked) })}</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the page */

export function SpineIndustryV8Body({ v, path }: { v: IndustryV8; path: string }) {
  return (
    <div className="kit3 k-industry" data-spine-body="" data-composition="kit" data-kit="3" data-page="industry">
      {/* Version 3's tokens for this page (design-tokens.ts kit3; the header says why at :root). */}
      <style dangerouslySetInnerHTML={{ __html: ROOT_VARS }} />
      {/* THE TRAIL BACK UP (Crumbs.tsx, the site's rule since 2026-09-22, which the target predates and he never overruled): Trades /
          sector / the trade, above the photograph. */}
      <div className="wrap crumbs">
        <Crumbs items={buildIndustryCrumbs(v.trade)} />
      </div>
      <Hero v={v} />
      <section className="chapter" aria-labelledby="c0" data-chapter="opening">
        <div className="wrap">
          <h2 id="c0" className="sr" data-typography="custom">
            {T.openingTitle}
          </h2>
          <div className="pair w57">
            <Lasts v={v} />
            <NextDoor v={v} />
          </div>
        </div>
      </section>
      {/* An hour of work cut on his word of 2026-10-22 ("Cut An hour of work from the industry page."): the three left share one band. */}
      <Chapter num="01" id="c1" title={T.chapters.money} tint>
        <div className="cluster c3">
          <Split v={v} />
          <Year v={v} />
          <People v={v} />
        </div>
      </Chapter>
      <Chapter num="02" id="c2" title={T.chapters.ratios}>
        <div className="band-stack">
          <div className="pair w21">
            <OfficialRatios v={v} />
            <WhatTheySay v={v} />
          </div>
          <div className="pair">
            <MoneyList />
            <Guests />
          </div>
        </div>
      </Chapter>
      <Chapter num="03" id="c3" title={T.chapters.where} tint>
        <Table v={v} />
      </Chapter>
      <Chapter num="04" id="c4" title={T.chapters.like}>
        <div className="cluster c3">
          <Months v={v} />
          <Density v={v} />
          <Donut v={v} />
        </div>
      </Chapter>
      <Close v={v} path={path} />
    </div>
  );
}
