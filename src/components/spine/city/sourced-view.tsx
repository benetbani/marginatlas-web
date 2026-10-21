/**
 * THE CITY PAGE, TARGET v9 (his "v9 looks right. Record it as the approved London target", 2026-10-21, FOUNDER-VERDICTS "London
 * (/cities/london) v9 approved"): the view. It draws v9's sections in v9's order with v9's words (COPY.cityV9) and the figures the
 * builder reads from data/sourced/ (src/lib/spine/city_v9.ts); it computes no figure of its own, only each drawing's geometry from them.
 *
 * Its own view, beside SpineCityBody (city-view.tsx), which still draws every city v9 does not hold: the route and the harness ask
 * `drawsCityV9(slug)` and choose between the two the same way.
 *
 * THE LOOK IS THE KIT'S (sheets/kit/kit.css, KIT-VERSION 2) and v9's own (its builder's EXTRA_CSS), through the site's tokens: the root
 * sets design-tokens.ts `kit` as CSS variables (`kitCssVars`) and globals.css, THE KIT PAGE and THE KIT PAGE: THE CITY, hold the rules,
 * scoped under `.kit4`, every class here prefixed `k-` so no site rule (`.fig`, `.note`, `.sub`) reaches in. No hex and no pixel here.
 *
 * HIS THREE RULES OF 2026-10-21, AS v9 DRAWS THEM: the name inside the one white card with the flag large above it ("The card with the
 * name of the city is sooooo ugly ... flag so small"); each section's featured part in terracotta, marked `data-focal` ("a ratio of
 * terracotta in almost every sextion ... it refers to the focal focus of the sextion or its featured part"); long lists behind a click
 * (the boroughs, the tax bands); one start line for the title and the answer across the cards of a band (`.k-sbody`, a subgrid row).
 *
 *   hero          the photograph (bright, never darkened, no credit); the white card: the flag, London, the country, the £ / $ switch;
 *                 median full-time pay, its basis line, eight cells, the place line and the method link
 *   chapter 01    Costs of trading here: Prime shop rent and Property tax stacked beside Rent by district
 *   chapter 02    Living here: What living here costs | Rent against pay
 *   chapter 03    The customers: What people earn | People by age
 *   chapter 04    Visitors: When visitors come | How long visitors stay
 *   chapter 05    Other UK cities: the table
 *   exit          Where to next: three doors and the source line
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { kitCssVars } from "@/lib/design-tokens";
import { reportHref } from "@/lib/spine/report";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { countryPageTarget } from "@/lib/geo/page_targets";
import { LON, PHONE_SHOWN, WEEK_HOURS, peerText, srcOf, type CityV9, type IndexCell, type V9Borough, type V9Strip } from "@/lib/spine/city_v9";
import type { Money } from "@/lib/spine/industry_v4";
import { CurrencySwitch } from "@/components/spine/industry/currency-switch";
import type { LoudSeat } from "@/lib/spine/loud_seats";
import { Crumbs } from "@/components/spine/Crumbs";
import { buildCityCrumbs } from "@/lib/spine/crumb_rows";
import { SeeAll } from "./see-all";

/**
 * THE LOUD MOMENTS OF v9, declared for the loud-seats gate, which holds a kit render (`data-composition="kit"`) to this table and not to
 * the September view's. Seat one is the hero's answer, the median full-time pay in terracotta. Seat two is the prime shop rent's figure
 * (v9's builder: "MODEL 8.3 row 04: LOUD 2, the prime rent's figure in terracotta"). No third. Each section's featured part in
 * terracotta is his rule of 2026-10-21 for every section, marked `data-focal`, not a seat.
 */
export const LOUD_SEATS_KIT = [
  { seat: 1, card: "00 take", figure: "median full-time pay a month, London's", state: "LIT", condition: "v9's hero answer in the kit's terracotta, on the one city v9 draws (buildCityV9 returns null wherever a row is missing)" },
  { seat: 2, card: "04 prime-rent", figure: "prime shop rent a m² a month, New Bond Street's", state: "LIT", condition: "v9 marks the prime rent's card loud (MODEL 8.3 row 04, LOUD 2), its figure in terracotta" },
  { seat: 3, card: "none", figure: "no third loud moment", state: "NO HONEST CANDIDATE", condition: "v9, approved on 2026-10-21, draws two loud figures; each section's featured part in terracotta is his rule for every section (data-focal), not a seat" },
] as const satisfies readonly LoudSeat[];

const T = COPY.cityV9;
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const METHOD = "/methodology";
const HERO = { src: "/spine/city-london.webp", small: "/spine/city-london-1200.webp", w: 2400, h: 1350 };
const FOCAL = { "data-focal": "" } as const;
const pct = (x: number) => `${x.toFixed(1)}%`;
const r0 = (x: number) => String(Math.round(x));
type PeerKey = keyof typeof T.names;
const nameOf = (k: string) => T.names[k as PeerKey];

/* ------------------------------------------------------------------ the kit's small parts */

/** The money pair: the local figure, its dollars beside it (the switch on the root puts dollars first). */
function M({ m }: { m: Money }) {
  return (
    <span className="k-m">
      <span className="k-p">{m.local}</span>
      <span className="k-s">{m.usd}</span>
    </span>
  );
}
/** A printed figure with its provenance (`data-src`, the file and row it was read from), the mark the fact-once gate reads. */
function S({ src, children }: { src: string; children: React.ReactNode }) {
  return <span data-src={src}>{children}</span>;
}
/** The words under a card's figure, its own line (the line rule reads `data-focal-words`). */
function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="k-unit" data-focal-words="">
      {children}
    </span>
  );
}

/** The kit's glyphs (kit_head.html's sprite), each in its 24 box. */
const GLYPH: Record<string, React.ReactNode> = {
  wage: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.5 9.5v.01M17.5 14.5v.01" strokeWidth="2.4" />
    </>
  ),
  shop: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9h16M4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 2 3 1 0 2-1.3 2-3 0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M5.5 12v8h13v-8M10 20v-5h4v5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z" />
      <path d="M9.5 14.5l5-6" />
      <circle cx="9.8" cy="9" r="1.1" fill="currentColor" />
      <circle cx="14.2" cy="14" r="1.1" fill="currentColor" />
    </>
  ),
  hire: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4M18 8v6M15 11h6" />
    </>
  ),
  plane: <path d="M10.5 3.5c.6-.7 1.9-.7 2.4.2l.6 6.3 6.8 3.8v2l-6.8-1.6-.4 4.3 2 1.5v1.5l-3.1-.8-3.1.8v-1.5l2-1.5-.4-4.3L3.7 15.8v-2L10.5 10z" strokeWidth="1.7" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="18" cy="18" r="2.6" />
      <path d="M8.6 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.4" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M3 12.5h18" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" strokeWidth="2.2" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2" />,
};
function Glyph({ id, className }: { id: keyof typeof GLYPH; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {GLYPH[id]}
    </svg>
  );
}
function Tick() {
  return (
    <svg className="k-tk" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The depth of a card, closed on arrival behind its plus (one a card at most). */
function Fold({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="k-fold">
      <summary>
        <span>{summary}</span>
        <Glyph id="plus" />
      </summary>
      <div className="k-fold-in">{children}</div>
    </details>
  );
}

type Row = { key: string; label: React.ReactNode; value: React.ReactNode; focal?: boolean; tot?: boolean; none?: boolean };
/** Label and value rows: the value in the next column, never across the card. */
function Rows({ rows, className = "" }: { rows: Row[]; className?: string }) {
  return (
    <dl className={`k-kv ${className}`.trim()}>
      {rows.map((r) => (
        <div key={r.key} className={[r.tot ? "k-tot" : "", r.none ? "k-none" : ""].join(" ").trim() || undefined} {...(r.focal ? FOCAL : {})}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * One subsection: a title, the question, then its body (the figure, one drawing, at most one fold), the caption "Place, 2026." The
 * body is one box (`.k-sbody`), so the cards of a band share their header's height and the line their answer starts on (his
 * 2026-10-21: "a defined place where the title and answrr begins ... define it for each section"). `focalBody`: the section's focal
 * part is spread through its body (a mark on every track, a bar and its key), so `data-focal` goes on the body.
 */
function Card({ id, title, ask, tag, loud, focalBody, className = "", children, caption }: { id: string; title: string; ask: string; tag?: string; loud?: boolean; focalBody?: boolean; className?: string; children: React.ReactNode; caption: string }) {
  return (
    <article id={id} className={`k-sub spine-card ${className}`.trim()} data-section={id} data-block={id} data-card="" {...(loud ? { "data-loud": "" } : {})} aria-labelledby={`k-${id}`}>
      <header>
        <h3 id={`k-${id}`}>
          {title}
          {tag ? <span className="k-etag">{tag}</span> : null}
        </h3>
        <p className="k-ask">{ask}</p>
      </header>
      <div className="k-sbody" {...(focalBody ? FOCAL : {})}>
        {children}
      </div>
      <p className="k-caption">{caption}</p>
    </article>
  );
}

/** A chapter: a muted number and one plain title, then its bands; `tint` alternates the near-white ground. */
function Chapter({ num, id, title, tint, children }: { num: string; id: string; title: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section className={`k-chapter${tint ? " k-tint" : ""}`} aria-labelledby={id} data-chapter={num}>
      <div className="k-chead">
        <span className="k-num">{num}</span>
        <h2 id={id}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ the hero */

/** An index cell's figure: the score over 100 and the level its file names, in a neutral pill (never terracotta on a pill). */
function Index({ c }: { c: IndexCell }) {
  return (
    <>
      {c.score}/100 <span className="k-lvl">{T.levels[c.level]}</span>
    </>
  );
}

function Hero({ v }: { v: CityV9 }) {
  const c = v.hero.cells;
  const cells: Array<{ key: keyof typeof T.hero.cells; glyph: keyof typeof GLYPH; src: string; value: React.ReactNode }> = [
    { key: "wage", glyph: "wage", src: srcOf("EMPLOYER", "wage_floor", "GB"), value: <M m={c.wage} /> },
    { key: "shop", glyph: "shop", src: srcOf("SHOP", "shop_rent_m2_month", LON), value: <M m={c.shop} /> },
    { key: "tax", glyph: "receipt", src: srcOf("RATES", "local_tax_rate", "GB-ENG", "retail-low"), value: <M m={c.tax} /> },
    { key: "employer", glyph: "hire", src: srcOf("EMPLOYER", "employer_charge_rate", "GB", "class-1"), value: `${c.employer}%` },
    { key: "visits", glyph: "plane", src: srcOf("VISITORS", "visitors", LON, "visits"), value: c.visits },
    { key: "pull", glyph: "pin", src: srcOf("PULL", "visitor_pull_index", LON), value: <Index c={c.pull} /> },
    { key: "connect", glyph: "route", src: srcOf("CONNECT", "connectivity_index", LON), value: <Index c={c.connect} /> },
    { key: "unemp", glyph: "work", src: srcOf("UNEMP", "unemployment_rate", LON), value: `${c.unemp}%` },
  ];
  return (
    <section className="k-hero k-city-hero" aria-labelledby="k-city-h" data-hero="1">
      <div className="k-pano" data-visual="1">
        {/* Bright, never darkened, no credit (FV 1604 to 1605, 1631 to 1633, 1777 to 1778). */}
        <img src={HERO.src} srcSet={`${HERO.small} 1200w, ${HERO.src} 2400w`} sizes="100vw" alt={T.hero.photoAlt} width={HERO.w} height={HERO.h} fetchPriority="high" />
      </div>
      <div className="k-hero-grid">
        <div id="take" className="k-fig-card" data-archetype="answer-card" data-level="page" data-answers={SURFACE_ANSWERS.city} data-block="take" data-card="">
          {/* The name in the card (MODEL PART 3's identity): the flag first, large, with the switch; the h1 under it; the country. */}
          <div className="k-ident">
            <div className="k-idtop">
              {/* The site's flag source (CountryFlag.tsx's flagcdn file), drawn at v9's size: his "flag so small" of 2026-10-21. */}
              <img className="k-bigflag" src="https://flagcdn.com/gb.svg" alt={T.hero.flag} data-flag="" width={60} height={30} />
              <CurrencySwitch label={T.currency.group} local="£" />
            </div>
            <h1 id="k-city-h">{T.hero.name}</h1>
            <p className="k-where">{T.hero.where}</p>
          </div>
          <div className="k-answer" data-answer="">
            <div>
              <p className="k-al">{T.hero.answerLabel}</p>
              <p className="k-av">
                <span className="k-big" data-src={srcOf("PAY", "pay_median_month", LON)}>
                  <M m={v.hero.pay} />
                </span>{" "}
                <span className="k-avu">{T.hero.answerUnit}</span>
              </p>
              <p className="k-as">{T.hero.basis}</p>
            </div>
          </div>
          <div className="k-cells">
            {cells.map((x) => (
              <div className="k-cell" key={x.key}>
                <p className="k-cl">
                  <Glyph id={x.glyph} />
                  <span>{T.hero.cells[x.key]}</span>
                </p>
                <p className="k-cv">
                  <S src={x.src}>{x.value}</S>
                </p>
              </div>
            ))}
          </div>
          <p className="k-cap">
            {T.hero.place} <a href={METHOD}>{T.hero.how}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ chapter 01: costs of trading here */

function PrimeRent({ v }: { v: CityV9 }) {
  const p = v.prime;
  const n = String(p.count);
  const src = srcOf("PRIME", "prime_rent_m2_year", "london");
  return (
    <Card id="prime-rent" className="k-c-prime" title={T.prime.title} ask={T.prime.ask} caption={fill(T.prime.caption, { n })} loud>
      <p className="k-fig" {...FOCAL}>
        <S src={src}><M m={p.month} /></S> <Unit>{fill(T.prime.unit, { n })}</Unit>
      </p>
      <p className="k-bench">
        <span className="k-bv"><S src={`derived:${srcOf("PRIME", "prime_rent_m2_year", "all")}:median`}><M m={p.mid} /></S></span>
        <span className="k-bw">{fill(T.prime.bench, { n })}</span>
      </p>
      <Rows
        rows={[
          { key: "hundred", label: T.prime.rows.hundred, value: <S src={`derived:${src}*100`}><M m={p.hundred} /></S> },
          { key: "mid", label: T.prime.rows.mid, value: <S src={`derived:${srcOf("PRIME", "prime_rent_m2_year", "all")}:median*100`}><M m={p.midHundred} /></S> },
        ]}
      />
      <Fold summary={T.prime.fold}>
        <p className="k-note">{T.prime.note}</p>
      </Fold>
    </Card>
  );
}

function PropertyTax({ v }: { v: CityV9 }) {
  const t = v.tax;
  const [ex0, ex1, ex2] = T.tax.example;
  return (
    <Card id="property-tax" className="k-c-tax" title={T.tax.title} ask={T.tax.ask} caption={T.tax.caption}>
      <p className="k-fig">
        <S src={srcOf("RATES", "local_tax_rate", "GB-ENG", "retail-low")}>{t.rate}</S>{" "}
        <Unit>
          {T.tax.unit} <M m={t.under} />
        </Unit>
      </p>
      {/* The worked example is the section's featured part (his 2026-10-21), on the soft terracotta ground. */}
      <div className="k-example" {...FOCAL}>
        <p>
          {ex0} <M m={t.example.value} /> {ex1}{" "}
          <b>
            <S src={`derived:${srcOf("RATES", "local_tax_rate", "GB-ENG", "retail-low")}*example`}><M m={t.example.pays} /></S>
          </b>{" "}
          {ex2}
        </p>
      </div>
      <Fold summary={T.tax.fold}>
        <table className="k-bands">
          <caption className="k-sr">{T.tax.srCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{T.tax.head.value}</th>
              <th scope="col">{T.tax.head.shop}</th>
              <th scope="col">{T.tax.head.other}</th>
            </tr>
          </thead>
          <tbody>
            {t.bands.map((b) => (
              <tr key={b.key}>
                <th scope="row">
                  {b.label}
                  <span className="k-usd-row">{b.usd}</span>
                </th>
                <td className={b.lit ? "k-lit" : undefined}>{b.shop}</td>
                <td>{b.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="k-note">{T.tax.note}</p>
      </Fold>
    </Card>
  );
}

function Districts({ v }: { v: CityV9 }) {
  const d = v.districts;
  const n = String(d.total);
  const bar = (b: V9Borough, later = false) => (
    <li key={b.code} className={later ? "k-later" : undefined}>
      <span className="k-rn">{b.name}</span>
      <span className="k-rv">
        <S src={srcOf("BOROUGHS", "shop_rent_m2_month", b.code)}><M m={b.money} /></S>
      </span>
      <span className="k-rt">
        <b style={{ width: pct(b.width) }} />
        <i className="k-mk" style={{ left: pct(d.avgAt) }} />
      </span>
    </li>
  );
  return (
    <Card id="rent-by-district" className="k-c-dist" title={T.districts.title} ask={fill(T.districts.ask, { n })} caption={fill(T.districts.caption, { n })} focalBody>
      <p className="k-fig">
        {/* The two ends on one line (a span round them: the kit page's rule blocks a figure that stands right before its words). */}
        <span>
          <S src={`derived:${srcOf("BOROUGHS", "shop_rent_m2_month", "boroughs")}:lowest`}><M m={d.lo.money} /></S> to{" "}
          <S src={`derived:${srcOf("BOROUGHS", "shop_rent_m2_month", "boroughs")}:highest`}><M m={d.hi.money} /></S>
        </span>{" "}
        <Unit>{fill(T.districts.unit, { lo: d.lo.name, hi: d.hi.name })}</Unit>
      </p>
      <div className="k-rdist" data-kind="bar-ladder">
        {d.groups.map((g) => (
          <div key={g.key} className={`k-rgroup${g.key === "inner" ? "" : " k-later"}`}>
            <p className="k-rg">
              <span>{fill(T.districts.groupHead, { group: T.districts.groups[g.key], n: String(g.count) })}</span>
              <span className="k-rv">
                <S src={srcOf("BOROUGHS", "shop_rent_m2_month", g.code)}><M m={g.value} /></S>
              </span>
            </p>
            <ol className="k-rbars">{g.shown.map((b, i) => bar(b, g.key === "inner" && i >= PHONE_SHOWN))}</ol>
            {g.rest.length ? (
              <Fold summary={fill(T.districts.more, { n: String(g.rest.length) })}>
                <ol className="k-rbars">{g.rest.map((b) => bar(b))}</ol>
              </Fold>
            ) : null}
          </div>
        ))}
      </div>
      {/* A phone shows Inner London's first rows; the rest, and Outer London, open on this button (his "click to explore more ... in
          different forms"); a desktop shows them all beside the prime rent and the tax, the cluster level (Outer London's first
          rows before its fold, city_v9.ts OUTER_SHOWN). */}
      <SeeAll more={fill(T.districts.seeAll, { n })} less={T.districts.seeLess}>
        <Glyph id="plus" />
      </SeeAll>
      <p className="k-mkkey">
        <i />
        <span>
          {T.districts.key} <S src={srcOf("SHOP", "shop_rent_m2_month", LON)}><M m={d.avg} /></S> {T.districts.keyUnit}
        </span>
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 02: living here */

function Living({ v }: { v: CityV9 }) {
  const l = v.living;
  const [n0, n1] = T.living.foldNote;
  const TAX = "rules-uk3-tax-rates-2026-27";
  const worked = `derived:sourced/employer-charges:wage_floor:GB*${WEEK_HOURS}*52/12`;
  return (
    <Card id="living-costs" title={T.living.title} ask={T.living.ask} caption={T.living.caption}>
      <p className="k-fig">
        <S src={srcOf("FLAT", "flat_rent_month", LON)}><M m={l.flat} /></S> <Unit>{T.living.unit}</Unit>
      </p>
      <Rows
        rows={[
          { key: "pass", label: T.living.rows.pass, value: <S src={srcOf("PASS", "transport_pass_month", LON, "zones-1-2")}><M m={l.pass} /></S> },
          { key: "wage", label: T.living.rows.wage, value: <S src={worked}><M m={l.gross} /></S> },
          { key: "after", label: T.living.rows.after, value: <S src={`${worked}:after-tax:${TAX}`}><M m={l.after} /></S> },
          { key: "short", label: T.living.rows.short, value: <S src={`derived:flat+pass-after-tax`}><M m={l.short} /></S>, focal: true },
        ]}
      />
      <p className="k-note">{T.living.note}</p>
      <Fold summary={T.living.fold}>
        <Rows
          rows={[
            { key: "before", label: T.living.foldRows.before, value: <S src={worked}><M m={l.gross} /></S> },
            { key: "tax", label: T.living.foldRows.tax, value: <S src={`derived:${TAX}:income_tax_rate:basic`}>−<M m={l.tax} /></S> },
            { key: "ni", label: T.living.foldRows.ni, value: <S src={`derived:${TAX}:employee_ni_rate`}>−<M m={l.ni} /></S> },
            { key: "after", label: T.living.foldRows.after, value: <S src={`${worked}:after-tax:${TAX}`}><M m={l.after} /></S> },
          ]}
        />
        <p className="k-note">
          {n0} <M m={l.wage} /> {fill(n1, { hours: String(WEEK_HOURS) })}
        </p>
      </Fold>
    </Card>
  );
}

function RentPay({ v }: { v: CityV9 }) {
  const rp = v.rentPay;
  const lon = rp.london;
  const shareSrc = (k: string) => `derived:${srcOf("FLAT", "flat_rent_month", k)}/${srcOf("PAY", "pay_median_month", k)}`;
  const of = (s: { flat: Money | null; pay: Money }) => (
    <>
      {s.flat ? <M m={s.flat} /> : null} {T.rentPay.of} <M m={s.pay} />
    </>
  );
  return (
    <Card id="rent-against-pay" title={T.rentPay.title} ask={T.rentPay.ask} caption={T.rentPay.caption}>
      <p className="k-fig">
        <S src={shareSrc("london")}>{r0(lon.share)}%</S>{" "}
        <Unit>
          {T.rentPay.unit} {of(lon)}
        </Unit>
      </p>
      <div className="k-ringrow">
        <svg className="k-ring" data-kind="ring" viewBox="0 0 144 144" role="img" aria-label={fill(T.rentPay.ringAria, { n: r0(lon.share) })}>
          <circle cx="72" cy="72" r={rp.radius} fill="none" style={{ stroke: "var(--k-paper2)" }} strokeWidth="14" />
          <circle {...FOCAL} cx="72" cy="72" r={rp.radius} fill="none" style={{ stroke: "var(--k-terra)" }} strokeWidth="14" strokeDasharray={`${rp.dash.toFixed(1)} ${rp.circ.toFixed(1)}`} transform="rotate(-90 72 72)" />
          <text x="72" y="78" textAnchor="middle" className="k-rt">
            {T.rentPay.ringLabel}
          </text>
        </svg>
        <Rows
          className="k-cities"
          rows={[
            ...rp.others.map((s) => ({ key: s.key, label: nameOf(s.key), value: <S src={shareSrc(s.key)}>{r0(s.share as number)}%</S> })),
            ...rp.missing.map((s) => ({ key: s.key, label: nameOf(s.key), value: "–", none: true })),
          ]}
        />
      </div>
      <p className="k-note">{T.rentPay.none}</p>
      <Fold summary={T.rentPay.fold}>
        <Rows rows={[lon, ...rp.others].map((s) => ({ key: s.key, label: nameOf(s.key), value: of(s) }))} />
        <p className="k-note">{T.rentPay.foldNote}</p>
      </Fold>
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 03: the customers */

function Strip({ name, s, lit, src }: { name: string; s: V9Strip; lit: boolean; src: string }) {
  const last = s.tenths.length - 1;
  return (
    <div className={`k-strip${lit ? " k-lit" : ""}`} {...(lit ? FOCAL : {})}>
      <p className="k-sn">{name}</p>
      <div className="k-sl k-top">
        <span className="k-md" style={{ left: pct(s.pos[4]) }}>
          <S src={`${src}:median`}><M m={s.money[4]} /></S>
        </span>
      </div>
      <div className="k-sbar">
        <span className="k-span" style={{ left: pct(s.pos[0]), width: pct(s.pos[last] - s.pos[0]) }} />
        {s.pos.map((p, i) => (
          <span key={i} className={`k-t${i === 4 ? " k-md" : ""}`} style={{ left: pct(p) }} />
        ))}
      </div>
      <div className="k-sl">
        <span style={{ left: pct(s.pos[0]) }}>
          <S src={`${src}:10th`}><M m={s.money[0]} /></S>
        </span>
        <span className="k-end" style={{ left: pct(s.pos[last]) }}>
          <S src={`${src}:90th`}><M m={s.money[last]} /></S>
        </span>
      </div>
    </div>
  );
}

function Earn({ v }: { v: CityV9 }) {
  const { london: l, uk: u } = v.earn;
  const last = l.tenths.length - 1;
  const lsrc = srcOf("TENTHS", "pay_tenth", LON), usrc = srcOf("TENTHS", "pay_tenth", "GB");
  const aria = fill(T.earn.aria, { lo: l.money[0].local, hi: l.money[last].local, mid: l.money[4].local, ulo: u.money[0].local, uhi: u.money[last].local, umid: u.money[4].local });
  return (
    <Card id="what-people-earn" title={T.earn.title} ask={T.earn.ask} caption={T.earn.caption}>
      <p className="k-fig">
        <span>
          <S src={`${lsrc}:10th`}><M m={l.money[0]} /></S> to <S src={`${lsrc}:90th`}><M m={l.money[last]} /></S>
        </span>{" "}
        <Unit>{T.earn.unit}</Unit>
      </p>
      <div className="k-strips" data-kind="tenths-strip" role="img" aria-label={aria}>
        <Strip name={T.earn.names.london} s={l} lit src={lsrc} />
        <Strip name={T.earn.names.uk} s={u} lit={false} src={usrc} />
      </div>
      <p className="k-note">{T.earn.note}</p>
      <Fold summary={T.earn.fold}>
        <Rows rows={l.money.map((m, i) => ({ key: String(i), label: fill(T.earn.row, { i: String(i + 1) }), value: <S src={`${lsrc}:${(i + 1) * 10}th`}><M m={m} /></S> }))} />
      </Fold>
    </Card>
  );
}

function Ages({ v }: { v: CityV9 }) {
  const a = v.ages;
  const f = a.groups[a.focal];
  const bar = (k: "london" | "uk") => a.groups.map((g, i) => <span key={g.label} className={`k-g${i}`} style={{ width: `${g[k]}%` }} />);
  const aria = fill(T.ages.aria, { list: a.groups.map((g) => fill(T.ages.ariaPart, { group: g.label, london: String(g.london), uk: String(g.uk) })).join(". ") });
  const src = (geo: string, label: string) => srcOf("AGES", "age_group_share", geo, label.replace(/ /g, "-"));
  return (
    <Card id="people-by-age" title={T.ages.title} ask={T.ages.ask} caption={T.ages.caption} focalBody>
      <p className="k-fig">
        <S src={src(LON, f.label)}>{f.london.toFixed(1)}%</S> <Unit>{fill(T.ages.unit, { group: f.label, uk: `${f.uk.toFixed(1)}%` })}</Unit>
      </p>
      <div className="k-ages" data-kind="part-bar" role="img" aria-label={aria}>
        <p className="k-an">{T.ages.names.london}</p>
        <div className="k-abar">{bar("london")}</div>
        <p className="k-an">{T.ages.names.uk}</p>
        <div className="k-abar">{bar("uk")}</div>
      </div>
      <table className="k-agetab">
        <caption className="k-sr">{T.ages.srCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{T.ages.head.age}</th>
            <th scope="col">{T.ages.head.london}</th>
            <th scope="col">{T.ages.head.uk}</th>
          </tr>
        </thead>
        <tbody>
          {a.groups.map((g, i) => (
            <tr key={g.label} className={i === a.focal ? "k-me" : undefined}>
              <th scope="row">
                <i className={`k-sw k-g${i}`} data-swatch="" />
                {g.label}
              </th>
              <td>{i === a.focal ? `${g.london.toFixed(1)}%` : <S src={src(LON, g.label)}>{g.london.toFixed(1)}%</S>}</td>
              <td>{i === a.focal ? `${g.uk.toFixed(1)}%` : <S src={src("K02000001", g.label)}>{g.uk.toFixed(1)}%</S>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 04: visitors */

function Months({ v }: { v: CityV9 }) {
  const m = v.months;
  const top = m.values[m.busiest];
  const src = srcOf("MONTHS", "visits_month_worked", LON);
  const aria = fill(T.months.aria, { busiest: T.months.names[m.busiest], top: m.text[m.busiest], quietest: T.months.names[m.quietest], low: m.text[m.quietest] });
  return (
    <Card id="when-visitors-come" title={T.months.title} tag={T.months.tag} ask={T.months.ask} caption={T.months.caption}>
      <p className="k-fig">
        <S src={`${src}:busiest`}>{m.text[m.busiest]}</S> <Unit>{fill(T.months.unit, { month: T.months.names[m.busiest] })}</Unit>
      </p>
      <div className="k-vchart" data-kind="month-columns" role="img" aria-label={aria}>
        {m.values.map((x, i) => (
          <div key={i} className={`k-vcol${i === m.busiest ? " k-q3" : ""}`} {...(i === m.busiest ? FOCAL : {})}>
            <span className="k-vb">
              <b style={{ height: pct((x / top) * 100) }} />
            </span>
            <span className="k-vm" data-mark-label="">
              <span className="k-ml">{T.months.short[i]}</span>
              <span className="k-ms">{T.months.short[i][0]}</span>
            </span>
          </div>
        ))}
      </div>
      <Fold summary={T.months.fold}>
        <Rows rows={m.text.map((t, i) => ({ key: String(i), label: T.months.names[i], value: <S src={`${src}:${i + 1}`}>{t}</S> }))} />
      </Fold>
    </Card>
  );
}

function Stays({ v }: { v: CityV9 }) {
  const s = v.stays;
  const nightsSrc = (k: string) => (k === "london" ? `derived:${srcOf("VISITORS", "visitors", LON)}:nights/visits` : `derived:${srcOf("IPS", "visitors", k)}:nights/visits`);
  return (
    <Card id="how-long-visitors-stay" title={T.stays.title} ask={T.stays.ask} caption={T.stays.caption}>
      <p className="k-fig">
        <S src={nightsSrc("london")}>
          {s.nights} {T.stays.figUnit}
        </S>{" "}
        <Unit>{fill(T.stays.unit, { n: s.nightsMillion })}</Unit>
      </p>
      <Rows className="k-stays" rows={s.rows.map((r) => ({ key: r.key, label: nameOf(r.key), value: r.me ? r.value : <S src={nightsSrc(r.key)}>{r.value}</S>, tot: r.me, focal: r.me }))} />
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 05: other UK cities */

function PeerCell({ label, children, win }: { label: string; children: React.ReactNode | null; win?: boolean }) {
  if (children === null) {
    return (
      <td className="k-none" data-l={label}>
        <span className="k-v">–</span>
      </td>
    );
  }
  return (
    /* Each column's best in terracotta with its tick, the kit's comparison table (kit.py peer_cell), as on the industry page by his
       ruling (FOUNDER-VERDICTS 1789 to 1790), not one of the page's loud seats: the cell says so (`data-founder-accent`). */
    <td className={win ? "k-win" : undefined} data-l={label} {...(win ? { "data-founder-accent": "1" } : {})}>
      <span className="k-v">
        {win ? <Tick /> : null}
        {children}
      </span>
    </td>
  );
}

function Peers({ v }: { v: CityV9 }) {
  const p = v.peers;
  const H = T.peers.heads;
  const cols = ["pay", "unemp", "air", "shop", "visits"] as const;
  const order = [p.rows[0], ...p.rows.slice(1).sort((a, b) => nameOf(a.key).localeCompare(nameOf(b.key)))];
  const code = (k: string) => (k === "london" ? LON : k);
  const file = { pay: "PAY", unemp: "UNEMP", air: "AIR", shop: "SHOP", visits: "IPS" } as const;
  const item = { pay: "pay_median_month", unemp: "unemployment_rate", air: "connectivity_air_passengers", shop: "shop_rent_m2_month", visits: "visitors" } as const;
  const cell = (r: (typeof p.rows)[number], c: (typeof cols)[number]) => {
    const x = r[c];
    if (x === null) return <PeerCell key={c} label={`${H[c][0]}, ${H[c][1]}`}>{null}</PeerCell>;
    const text = peerText[c](x);
    const f = c === "visits" && r.me ? "VISITORS" : file[c];
    return (
      <PeerCell key={c} label={`${H[c][0]}, ${H[c][1]}`} win={x === p.best[c]}>
        <S src={srcOf(f, item[c], code(r.key))}>{typeof text === "string" ? text : <M m={text} />}</S>
      </PeerCell>
    );
  };
  return (
    <article id="other-cities" className="k-sub k-wide spine-card" data-section="other-cities" data-block="other-cities" data-card="" data-wide-table="" aria-labelledby="k-other-cities">
      <header>
        <h3 id="k-other-cities">{T.peers.title}</h3>
        <p className="k-ask">{T.peers.ask}</p>
      </header>
      <table className="k-peers" data-archetype="compare-table">
        <caption className="k-sr">{T.peers.srCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{T.peers.city}</th>
            {cols.map((c) => (
              <th scope="col" key={c}>
                {H[c][0]}
                <small>{H[c][1]}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {order.map((r) => (
            <tr key={r.key} className={r.me ? "k-me" : undefined}>
              {/* The names plain: a compare table's rows never navigate (MODEL M23, the doors gate); v9's links were placeholders. */}
              <th scope="row">{nameOf(r.key)}</th>
              {cols.map((c) => cell(r, c))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="k-key">
        <Tick />
        <span>{T.peers.key}</span>
      </p>
      <p className="k-caption">{T.peers.caption}</p>
    </article>
  );
}

/* ------------------------------------------------------------------ the exit */

const dateText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Close({ v, path }: { v: CityV9; path: string }) {
  const country = countryPageTarget("gb");
  /* The doors: the country page; London's trade page through the trade route (the one London trade page the site holds, as the city
     close's trade door has led since plan step 34); the side-by-side tool. */
  const doors = [
    { href: country?.href ?? "/gb", lands: country?.answers ?? SURFACE_ANSWERS.country },
    { href: `/gb/${v.slug}/restaurants`, lands: SURFACE_ANSWERS.cell },
    { href: "/compare", lands: SURFACE_ANSWERS.compare },
  ];
  return (
    <section className="k-chapter k-close" aria-labelledby="k-close-h" data-close="">
      <div className="k-chead">
        <h2 id="k-close-h">{T.close.title}</h2>
      </div>
      <div className="k-doors" data-archetype="terminus" data-target="kit">
        {T.close.doors.map((d, i) => (
          <a key={d.title} className={`k-door${i === 2 ? " k-cmp" : ""}`} href={doors[i].href} data-lands={doors[i].lands}>
            <span className="k-dk">{d.kind}</span>
            <h3>{d.title}</h3>
            <p>{d.line}</p>
            <span className="k-go-r">
              <Glyph id="arrow" />
            </span>
          </a>
        ))}
      </div>
      <p className="k-srcline">
        <a href={METHOD}>{T.close.how}</a>
        <a href={reportHref(path)} rel="nofollow" data-report="1">
          {T.close.report}
        </a>
        <span>{fill(T.close.checked, { date: dateText(v.checked) })}</span>
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ the page */

export function SpineCityV9Body({ v, path }: { v: CityV9; path: string }) {
  return (
    <div className="kit4" data-spine-body="" data-composition="kit" data-page="city" style={kitCssVars() as React.CSSProperties}>
      {/* THE TRAIL BACK UP (Crumbs.tsx, the site's rule since 2026-09-22, which the target predates and he never overruled): the country
          / the city, above the photograph, as on the industry page v4. */}
      <Crumbs items={buildCityCrumbs(v.slug)} />
      <Hero v={v} />
      <Chapter num="01" id="k-c1" title={T.chapters.costs} tint>
        {/* The plan's premises cluster (MODEL 8.3 `04 premises`, PART 10.8b): the boroughs' rents tall on the wide side, the prime rent and
            the council's tax stacked beside them; on a tablet and a phone one column, prime rent, the boroughs, the tax. */}
        <div className="k-premises">
          <PrimeRent v={v} />
          <Districts v={v} />
          <PropertyTax v={v} />
        </div>
      </Chapter>
      <Chapter num="02" id="k-c2" title={T.chapters.living}>
        <div className="k-pair">
          <Living v={v} />
          <RentPay v={v} />
        </div>
      </Chapter>
      <Chapter num="03" id="k-c3" title={T.chapters.customers} tint>
        <div className="k-pair k-w75">
          <Earn v={v} />
          <Ages v={v} />
        </div>
      </Chapter>
      <Chapter num="04" id="k-c4" title={T.chapters.visitors}>
        <div className="k-pair">
          <Months v={v} />
          <Stays v={v} />
        </div>
      </Chapter>
      <Chapter num="05" id="k-c5" title={T.chapters.peers} tint>
        <Peers v={v} />
      </Chapter>
      <Close v={v} path={path} />
    </div>
  );
}

