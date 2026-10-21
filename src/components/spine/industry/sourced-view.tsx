/**
 * THE INDUSTRY PAGE, TARGET v4 (his "Go" of 2026-10-21, FOUNDER-VERDICTS "The industry page (/industries/restaurants) v4 approved"):
 * the view. It draws v4's sections in v4's order with v4's words (COPY.industryV4) and the figures the builder reads from
 * data/sourced/ (src/lib/spine/industry_v4.ts); it computes no figure of its own, only each drawing's geometry from them.
 *
 * Its own view, beside SpineIndustryBody (industry-view.tsx), which still draws every trade v4 does not hold: the route and the
 * harness ask `drawsIndustryV4(slug)` and choose between the two the same way.
 *
 * THE LOOK IS THE KIT'S (sheets/kit/kit.css, KIT-VERSION 2), through the site's tokens: the root sets design-tokens.ts `kit` as CSS
 * variables (`kitCssVars`) and globals.css, THE KIT PAGE, holds the rules, scoped under `.kit4`, every class here prefixed `k-` so no
 * site rule (`.fig`, `.note`, `.sub`) reaches in. No hex and no pixel in this file.
 *
 *   hero          the photograph (Storyblocks 357538047, bright, never darkened, no credit), "A trade", the name, the lead; the white
 *                 card: operating profit of every 100 of sales, the basis line, four cells, the place line and the method link
 *   opening band  How many last | Trades next door
 *   chapter 01    How it makes money: Where each 100 goes | What a year leaves; An hour of work | Who works in it;
 *                 What it puts back | Small and big
 *   chapter 02    Where it pays best: Country by country (eight rows and the United States, the rest behind the fold, the € / $ switch)
 *   chapter 03    What the trade is like: Busy and quiet months (loud, terracotta) | How crowded it is | Who makes the sales (the donut)
 *   exit          Where to next: three doors and the source line
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { kitCssVars } from "@/lib/design-tokens";
import { reportHref } from "@/lib/spine/report";
import { d1, isUsdOnly, type IndustryV4, type Money, type V4Row } from "@/lib/spine/industry_v4";
import { CurrencySwitch } from "./currency-switch";

const T = COPY.industryV4;
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const METHOD = "/methodology";
const HERO = { src: "/spine/industry-restaurants.webp", small: "/spine/industry-restaurants-1200.webp", w: 2400, h: 1350 };

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

/** The kit's glyphs (kit_head.html's sprite), each in its 24 box; drawn at the hero cells' size. */
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
  bars: <path d="M5 20V12M12 20V5M19 20v-9" strokeWidth="2.2" />,
  shop: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9h16M4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 2 3 1 0 2-1.3 2-3 0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M5.5 12v8h13v-8M10 20v-5h4v5" />
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

/** Label and value rows: the value in the next column, never across the card. */
function Rows({ rows, className = "" }: { rows: Array<{ key: string; label: React.ReactNode; value: React.ReactNode }>; className?: string }) {
  return (
    <dl className={`k-kv ${className}`.trim()}>
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One subsection: a title, the question, the figure, one drawing, at most one fold, the caption "Place, 2026." */
function Card({ id, title, ask, tag, loud, per100, children, caption }: { id: string; title: string; ask: string; tag?: string; loud?: boolean; per100?: boolean; children: React.ReactNode; caption: string }) {
  return (
    <article className="k-sub" data-section={id} {...(loud ? { "data-loud": "" } : {})} {...(per100 ? { "data-per": "100" } : {})} aria-labelledby={`k-${id}`}>
      <header>
        <h3 id={`k-${id}`}>
          {title}
          {tag ? <span className="k-etag">{tag}</span> : null}
        </h3>
        <p className="k-ask">{ask}</p>
      </header>
      {children}
      <p className="k-caption">{caption}</p>
    </article>
  );
}

/** A chapter: a muted number and one plain title, then its bands; `tint` alternates the near-white ground. */
function Chapter({ num, id, title, tint, children }: { num?: string; id: string; title: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section className={`k-chapter${tint ? " k-tint" : ""}`} aria-labelledby={id} data-chapter={num ?? ""}>
      <div className="k-chead">
        {num ? <span className="k-num">{num}</span> : null}
        <h2 id={id}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ the hero */

function Hero({ v }: { v: IndustryV4 }) {
  const glyph = { high: "globe", low: "pin", all: "bars", next: "shop" } as const;
  return (
    <section className="k-hero" aria-labelledby="k-ind-h" data-hero="1">
      <div className="k-pano">
        {/* Bright, never darkened, no credit (FV 1604 to 1605, 1631 to 1633, 1777 to 1778). */}
        <img src={HERO.src} srcSet={`${HERO.small} 1200w, ${HERO.src} 2400w`} sizes="100vw" alt={T.hero.photoAlt} width={HERO.w} height={HERO.h} fetchPriority="high" />
      </div>
      <div className="k-hero-grid">
        <div className="k-title-plate">
          <p className="k-crumb">{T.hero.kicker}</p>
          <h1 id="k-ind-h">{T.nextDoor.names.restaurants}</h1>
          <p className="k-lede">{T.hero.lede}</p>
        </div>
        <div className="k-fig-card" data-answer-card="">
          <div className="k-answer">
            <div>
              <p className="k-al">{T.hero.answerLabel}</p>
              <p className="k-av">
                <span className="k-big">{v.hero.answer}</span> {T.hero.answerUnit}
              </p>
              <p className="k-as">{T.hero.basis}</p>
            </div>
          </div>
          <div className="k-cells">
            {v.hero.cells.map((c) => (
              <div className="k-cell" key={c.key}>
                <p className="k-cl">
                  <Glyph id={glyph[c.key]} />
                  {T.hero.cells[c.key]}
                </p>
                <p className="k-cv">
                  {c.value}
                  {c.country ? <span className="k-cn">{c.country}</span> : null}
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

/* ------------------------------------------------------------------ the opening band: how many last | trades next door */

function Lasts({ v }: { v: IndustryV4 }) {
  return (
    <Card id="lasts" title={T.lasts.title} ask={T.lasts.ask} caption={T.eu}>
      <p className="k-fig">
        {v.lasts.five}% <span className="k-unit">{T.lasts.unit}</span>
      </p>
      <table className="k-forms">
        <caption className="k-sr">{T.lasts.caption}</caption>
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
              <td data-l={T.lasts.head.trade}>{y.trade}</td>
              <td data-l={T.lasts.head.all}>{y.all ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="k-note">{T.lasts.note}</p>
    </Card>
  );
}

function NextDoor({ v }: { v: IndustryV4 }) {
  const nd = v.nextDoor;
  const pct = (x: number) => `${((x / nd.scaleTop) * 100).toFixed(1)}%`;
  const name = (k: string) => T.nextDoor.names[k as keyof typeof T.nextDoor.names];
  const aria = fill(T.nextDoor.aria, { list: nd.items.map((i) => `${name(i.key)} ${i.text}`).join(", "), all: nd.all.text });
  return (
    <Card id="next-door" title={T.nextDoor.title} ask={T.nextDoor.ask} caption={T.eu}>
      <p className="k-fig">
        {nd.rankWord} <span className="k-unit">{T.nextDoor.unit}</span>
      </p>
      <div className="k-tbars" data-kind="ranked-bars" role="img" aria-label={aria}>
        {nd.items.map((i) => (
          <div key={i.key} className={`k-tb${i.me ? " k-me" : ""}`}>
            <span className="k-tn">{name(i.key)}</span>
            <span className="k-tv">{i.text}</span>
            <span className="k-tr">
              <b style={{ width: pct(i.value) }} />
              <i className="k-mk" style={{ left: pct(nd.all.value) }} />
            </span>
          </div>
        ))}
      </div>
      <p className="k-mkkey">
        <i />
        {fill(T.nextDoor.allKey, { all: nd.all.text })}
      </p>
      <Fold summary={T.nextDoor.fold}>
        {nd.items.map((i) => (
          <p className="k-def" key={i.key}>
            <b>{name(i.key)}</b> {T.nextDoor.defs[i.key as keyof typeof T.nextDoor.defs]}
          </p>
        ))}
      </Fold>
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 01: how it makes money */

function Split({ v }: { v: IndustryV4 }) {
  const { trade: r, all: a } = v.split;
  const bar = (name: string, p: { purchases: number; staff: number; left: number }) => {
    const tot = p.purchases + p.staff + p.left;
    /* The three parts at their shares of 99.4 of the track, the two 2s of gap taking the rest (the target's own arithmetic). */
    const w = (x: number) => `${((x / tot) * 99.4).toFixed(2)}%`;
    return (
      <div className="k-kbar">
        <p className="k-kn">
          {name}
          <b>{d1(p.left)}</b>
        </p>
        <div className="k-kt">
          <span className="k-kp" style={{ width: w(p.purchases) }}>
            <i>{d1(p.purchases)}</i>
          </span>
          <span className="k-ks" style={{ width: w(p.staff) }}>
            <i>{d1(p.staff)}</i>
          </span>
          <span className="k-kk" style={{ width: w(p.left) }} />
        </div>
      </div>
    );
  };
  const aria = fill(T.split.aria, { p: d1(r.purchases), s: d1(r.staff), k: d1(r.left), ap: d1(a.purchases), as: d1(a.staff), ak: d1(a.left) });
  return (
    <Card id="split" title={T.split.title} ask={T.split.ask} caption={T.eu} per100>
      <p className="k-fig">
        {d1(r.staff)} <span className="k-unit">{fill(T.split.unit, { all: d1(a.staff) })}</span>
      </p>
      <div className="k-kbars" data-kind="part-bar" role="img" aria-label={aria}>
        {bar(T.split.rows.trade, r)}
        {bar(T.split.rows.all, a)}
      </div>
      <ul className="k-akey">
        <li><i className="k-kp" />{T.split.key.purchases}</li>
        <li><i className="k-ks" />{T.split.key.staff}</li>
        <li><i className="k-kk" />{T.split.key.left}</li>
      </ul>
      <p className="k-note">{T.split.note}</p>
    </Card>
  );
}

function Year({ v }: { v: IndustryV4 }) {
  const y = v.year;
  return (
    <Card id="year" title={T.year.title} ask={T.year.ask} caption={T.eu}>
      <p className="k-fig">
        <M m={y.left} />
        <span className="k-unit">{T.year.unit}</span>
      </p>
      <Rows
        className="k-year"
        rows={[
          { key: "sales", label: T.year.rows.sales, value: <M m={y.sales} /> },
          { key: "bought", label: T.year.rows.bought, value: <M m={y.bought} /> },
          { key: "staff", label: T.year.rows.staff, value: <M m={y.staff} /> },
          { key: "left", label: T.year.rows.left, value: <M m={y.leftRow} /> },
        ]}
      />
      <p className="k-note">
        {T.year.note.split("{all}")[0]}
        <M m={y.allLeft} />
        {T.year.note.split("{all}")[1]}
      </p>
    </Card>
  );
}

function Hour({ v }: { v: IndustryV4 }) {
  const h = v.hour;
  const pos = (x: number) => (x / h.scaleTop) * 100;
  const aria = fill(T.hour.aria, { c: h.costs.toFixed(2), v: h.adds.toFixed(2), l: h.leaves.local.replace(/^\D+/, "") });
  return (
    <Card id="hour" title={T.hour.title} ask={T.hour.ask} caption={T.eu}>
      <p className="k-fig">
        <M m={h.leaves} />
        <span className="k-unit">
          {T.hour.unit.split("{all}")[0]}
          <M m={h.allLeaves} />
          {T.hour.unit.split("{all}")[1]}
        </span>
      </p>
      <div className="k-hstrip" data-kind="range-strip" role="img" aria-label={aria}>
        <span className="k-hl k-up" style={{ left: `${pos(h.costs).toFixed(1)}%` }}>
          {T.hour.costs} <M m={h.costsMoney} />
        </span>
        <span className="k-hr" data-rail="" />
        <span className="k-hgap" style={{ left: `${pos(h.costs).toFixed(1)}%`, width: `${(pos(h.adds) - pos(h.costs)).toFixed(1)}%` }} />
        <span className="k-hm k-c" data-mark="" style={{ left: `${pos(h.costs).toFixed(1)}%` }} />
        <span className="k-hm k-v" data-mark="" style={{ left: `${pos(h.adds).toFixed(1)}%` }} />
        <span className="k-hl k-dn" style={{ left: `${pos(h.adds).toFixed(1)}%` }}>
          {T.hour.adds} <M m={h.addsMoney} />
        </span>
      </div>
      <p className="k-note">{T.hour.note}</p>
    </Card>
  );
}

function People({ v }: { v: IndustryV4 }) {
  const p = v.people;
  return (
    <Card id="people" title={T.people.title} ask={T.people.ask} caption={T.eu}>
      <p className="k-fig">
        {fill(T.people.fig, { n: p.persons })} <span className="k-unit">{fill(T.people.unit, { all: p.allPersons })}</span>
      </p>
      <Rows
        rows={[
          { key: "wage", label: T.people.rows.wage, value: p.wage },
          { key: "owners", label: T.people.rows.owners, value: p.owners },
          { key: "jobs", label: T.people.rows.jobs, value: p.jobs },
        ]}
      />
      <p className="k-note">{fill(T.people.note, { jobs: p.jobs })}</p>
    </Card>
  );
}

function PutsBack({ v }: { v: IndustryV4 }) {
  const b = v.putsBack;
  return (
    <Card id="puts-back" title={T.putsBack.title} ask={T.putsBack.ask} caption={T.eu}>
      <p className="k-fig">
        {b.share}%<span className="k-unit">{T.putsBack.unit}</span>
      </p>
      <Rows
        rows={[
          { key: "put", label: T.putsBack.rows.put, value: <M m={b.put} /> },
          { key: "left", label: T.putsBack.rows.left, value: <M m={b.left} /> },
          { key: "all", label: T.putsBack.rows.all, value: fill(T.putsBack.allValue, { n: b.allShare }) },
        ]}
      />
      <p className="k-note">{T.putsBack.note}</p>
    </Card>
  );
}

function SmallBig({ v }: { v: IndustryV4 }) {
  const s = v.smallBig;
  return (
    <Card id="small-big" title={T.smallBig.title} ask={T.smallBig.ask} caption={T.eu}>
      <p className="k-fig">
        <M m={s.lead} />
        <span className="k-unit">{fill(T.smallBig.unit, { n: s.smallShare })}</span>
      </p>
      <Rows rows={s.rows.map((r, i) => ({ key: r.key, label: T.smallBig.sizes[i], value: <M m={r.money} /> }))} />
      <p className="k-note">{fill(T.smallBig.note, { n: s.times })}</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ chapter 02: where it pays best */

function PeerCell({ label, children, win }: { label: string; children: React.ReactNode | null; win?: boolean }) {
  if (children === null) {
    return (
      <td className="k-none" data-l={label}>
        <span className="k-v">–</span>
      </td>
    );
  }
  return (
    <td className={win ? "k-win" : undefined} data-l={label}>
      <span className="k-v">
        {win ? <Tick /> : null}
        {children}
      </span>
    </td>
  );
}

function Table({ v }: { v: IndustryV4 }) {
  const t = v.table;
  const [hGor, hSales, hPeople, hOpen] = T.table.heads;
  const tr = (r: V4Row) => {
    const eu = r.ownSurvey === "EU";
    return (
      <tr key={r.code}>
        <th scope="row">{r.name}</th>
        <PeerCell label={hGor[0]} win={r.gor !== null && r.gor === t.best.gor}>
          {r.gor === null ? null : d1(r.gor)}
        </PeerCell>
        <PeerCell label={hSales[0]} win={eu && r.salesUsd !== null && r.salesUsd === t.best.salesUsd}>
          {r.sales === null ? null : isUsdOnly(r.sales) ? <span className="k-usd">{r.sales.usdOnly}</span> : <M m={r.sales} />}
        </PeerCell>
        <PeerCell label={hPeople[0]}>{r.people}</PeerCell>
        <PeerCell label={hOpen[0]} win={eu && r.open5 !== null && r.open5 === t.best.open5}>
          {r.open5 === null ? null : `${d1(r.open5)}%`}
        </PeerCell>
      </tr>
    );
  };
  const table = (rows: V4Row[], caption: string) => (
    <table className="k-peers">
      <caption className="k-sr">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{T.table.country}</th>
          {T.table.heads.map(([a, b]) => (
            <th scope="col" key={a}>
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
    <article className="k-sub k-wide" data-section="places" aria-labelledby="k-places">
      <header className="k-hsw">
        <div>
          <h3 id="k-places">{T.table.title}</h3>
          <p className="k-ask">{fill(T.table.ask, { n: String(t.count) })}</p>
        </div>
        <CurrencySwitch label={T.currency.group} />
      </header>
      {table(t.first, T.table.captionFirst)}
      <Fold summary={fill(T.table.fold, { n: String(t.rest.length) })}>{table(t.rest, fill(T.table.captionRest, { n: String(t.rest.length) }))}</Fold>
      <p className="k-key">
        <Tick />
        <span>{T.table.key}</span>
      </p>
      <p className="k-note">{T.table.usNote}</p>
      <p className="k-note">
        <a href={METHOD}>{T.hero.how}</a>
      </p>
      <p className="k-caption">{T.table.caption}</p>
    </article>
  );
}

/* ------------------------------------------------------------------ chapter 03: what the trade is like */

function Months({ v }: { v: IndustryV4 }) {
  const m = v.months;
  const top = Math.max(...m.shape);
  const aria = fill(T.months.aria, { list: m.shape.map((x, i) => `${T.months.names[i]} ${d1(x)}`).join(", ") });
  return (
    <Card id="months" title={T.months.title} tag={T.months.tag} ask={T.months.ask} caption={T.eu} loud>
      <p className="k-fig">
        {m.swing}% <span className="k-unit">{fill(T.months.unit, { busiest: T.months.names[m.busiest], quietest: T.months.names[m.quietest] })}</span>
      </p>
      {/* The page's second loud section (METHODOLOGY 6.4): twelve columns from zero in the page's colour, no month featured. */}
      <div className="k-vchart" data-kind="month-columns" role="img" aria-label={aria}>
        {m.shape.map((x, i) => (
          <div className="k-vcol" key={i}>
            <span className="k-vb">
              <b style={{ height: `${((x / top) * 100).toFixed(1)}%` }} />
            </span>
            <span className="k-vm" data-mark-label="">
              {T.months.letters[i]}
            </span>
          </div>
        ))}
      </div>
      <p className="k-note">{fill(T.months.note, { n: String(m.members) })}</p>
    </Card>
  );
}

function Density({ v }: { v: IndustryV4 }) {
  const d = v.density;
  const label = (r: { name: string; end: "low" | "high" | null }) => (r.end === "low" ? fill(T.density.lowest, { name: r.name }) : r.end === "high" ? fill(T.density.highest, { name: r.name }) : r.name);
  return (
    <Card id="density" title={T.density.title} ask={T.density.ask} caption={T.density.caption}>
      <p className="k-fig">
        {d.eu} <span className="k-lvl">{T.density.levels[d.level]}</span>
        <span className="k-unit">{fill(T.density.unit, { n: String(d.count) })}</span>
      </p>
      <Rows rows={d.rows.map((r) => ({ key: r.name, label: label(r), value: r.value }))} />
    </Card>
  );
}

/** The page's one donut (his B9): 144 across in its own box, the parts clockwise from the top, in neutrals (the largest in ink). */
function Donut({ v }: { v: IndustryV4 }) {
  const parts = v.donut.parts;
  const tone = { small: "var(--k-ink)", medium: "var(--k-muted)", large: "var(--k-donut2)", corporate: "var(--k-n3)" } as const;
  const r = 56, c = 72, w = 22;
  const circ = 2 * Math.PI * r;
  const tot = parts.reduce((s, p) => s + p.value, 0);
  let acc = 0;
  const arcs = parts.map((p) => {
    const ln = (p.value / tot) * circ;
    const el = (
      <circle key={p.key} cx={c} cy={c} r={r} fill="none" style={{ stroke: tone[p.key] }} strokeWidth={w} strokeDasharray={`${(ln - 1.5).toFixed(2)} ${(circ - ln + 1.5).toFixed(2)}`} strokeDashoffset={(-acc).toFixed(2)} transform={`rotate(-90 ${c} ${c})`} />
    );
    acc += ln;
    return el;
  });
  const aria = fill(T.donut.aria, { list: parts.map((p) => `${T.donut.parts[p.key]} ${d1(p.value)}%`).join(", ") });
  return (
    <Card id="channels" title={T.donut.title} ask={T.donut.ask} caption={T.eu}>
      <p className="k-fig">
        {v.donut.small}% <span className="k-unit">{T.donut.unit}</span>
      </p>
      <div className="k-drow">
        <svg className="k-dnut" viewBox="0 0 144 144" width="144" height="144" data-kind="donut" role="img" aria-label={aria}>
          {arcs}
        </svg>
        <Rows
          rows={parts.map((p) => ({
            key: p.key,
            label: (
              <>
                <i className="k-k" style={{ background: tone[p.key] }} />
                {T.donut.parts[p.key]}
              </>
            ),
            value: `${d1(p.value)}%`,
          }))}
        />
      </div>
      <p className="k-note">{T.donut.note}</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ the exit */

const DOOR_HREF = ["/gb/london/restaurants", "/gb/manchester/restaurants", "/compare"];
const dateText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Close({ v, path }: { v: IndustryV4; path: string }) {
  return (
    <section className="k-chapter k-close" aria-labelledby="k-close-h" data-close="">
      <div className="k-chead">
        <h2 id="k-close-h">{T.close.title}</h2>
      </div>
      <div className="k-doors">
        {T.close.doors.map((d, i) => (
          <a key={d.title} className={`k-door${i === 2 ? " k-cmp" : ""}`} href={DOOR_HREF[i]}>
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

export function SpineIndustryV4Body({ v, path }: { v: IndustryV4; path: string }) {
  return (
    <div className="kit4" data-spine-body="" data-composition="kit" data-page="industry" style={kitCssVars() as React.CSSProperties}>
      <Hero v={v} />
      <section className="k-chapter" aria-labelledby="k-c0" data-chapter="opening">
        <h2 id="k-c0" className="k-sr">
          {T.openingTitle}
        </h2>
        <div className="k-pair k-w57">
          <Lasts v={v} />
          <NextDoor v={v} />
        </div>
      </section>
      <Chapter num="01" id="k-c1" title={T.chapters.money} tint>
        <div className="k-pair k-w75">
          <Split v={v} />
          <Year v={v} />
        </div>
        <div className="k-pair k-next">
          <Hour v={v} />
          <People v={v} />
        </div>
        <div className="k-pair k-next">
          <PutsBack v={v} />
          <SmallBig v={v} />
        </div>
      </Chapter>
      <Chapter num="02" id="k-c2" title={T.chapters.where}>
        <Table v={v} />
      </Chapter>
      <Chapter num="03" id="k-c3" title={T.chapters.like} tint>
        <div className="k-cluster">
          <Months v={v} />
          <Density v={v} />
          <Donut v={v} />
        </div>
      </Chapter>
      <Close v={v} path={path} />
    </div>
  );
}
