/**
 * THE COST SIMULATOR'S SECTIONS (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, items 1, 2 and 4 to 7; Q4 answered as written, A). The
 * masthead; the answer (the page's one 40, a day at 16, the firms above it); your margin (its 30); your month (one bar, then the bill as fact rows,
 * a switch for a month or a year holding words and figures only, the bar outside it); what moves it most (RankedBars); the money to open it (the
 * months to pay back at 30, the bill as fact rows); where figures come from (NoteList, the page's one prose section). Each figure through the kit's
 * Fig with its stamp; an output resting on the reader's figure says so in its line; a figure that cannot be worked out leaves its reason where it
 * would stand. One supporting line a card (the plain-copy law), two in the answer, the page's masthead.
 * NOT HERE YET: the country plan's signal on the firms above break-even and on the margin (spec section 4); its component is another branch's.
 */
import * as React from "react";
import { Box, Rail, Fig, Focal, Basis } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import { RankedBars, type BarRow } from "@/components/spine/archetypes/RankedBars";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { Switch } from "@/components/spine/interact/Switch";
import { STACKED } from "@/components/spine/zones";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { inSentence } from "@/lib/spine/place_names";
import { shown, type Format } from "@/lib/simulator/display";
import type { BillLine, EngineResult, Out } from "@/lib/simulator/engine";
import type { SimBundle, SimRole, SimState } from "@/lib/simulator/bundle";
import type { Place } from "@/lib/simulator/place";
import type { CalculatorWords, Choices } from "@/lib/simulator/seed";
import type { Provenance } from "@/lib/spine/provenance";

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const prov = (o: Out, key: string): Provenance | null => (o.held ? { src: `calculator:${key}`, kind: o.kind } : null);
/** A figure's words, said to rest on the reader's figures where they do (spec section 3: "an output that rests on one says 'your figures' in its line"). */
export const withYours = (text: string, o: Out, W: CalculatorWords): string => (o.held && o.yours ? `${text}${W.yoursTail}` : text);

/** The words that stand where a figure cannot be worked out. */
export function reasonOf(o: Out, W: CalculatorWords): string {
  if (o.held) return "";
  const R = W.reasons;
  const by: Record<string, string> = { needs: R.needs, "no-margin": R.noMargin, "no-sales": R.noSales, loss: R.loss, "no-ticket": R.noTicket, "no-opening": R.noOpening, "out-of-reach": R.outOfReach, "beyond-spread": R.beyondSpread, "no-spread": R.noSpread, "no-target": R.noTarget };
  return by[o.reason] ?? "";
}

export function Reason({ o, W }: { o: Out; W: CalculatorWords }) {
  return <p data-line="" data-reason={o.held ? undefined : o.reason} className="text-[length:var(--t-lead)] leading-6 text-[var(--c-ink)]">{reasonOf(o, W)}</p>;
}

export function Masthead({ W, place, choices, onPick, busy, failed }: { W: CalculatorWords; place: Place; choices: Choices; onPick: (next: { country: string; city: string | null; trade: string }) => void; busy: boolean; failed: boolean }) {
  const field = "h-12 w-full rounded-md border border-[var(--c-line-strong)] bg-[var(--c-card)] px-3 text-[length:var(--t-lead)] text-[var(--c-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]";
  const label = "flex flex-col gap-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]";
  return (
    <div data-hero="1">
      <h1 id="headline" data-typography="custom" className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]">{W.title}</h1>
      <form data-sim-pick="" aria-label={W.pick.label} aria-busy={busy} onSubmit={(e) => e.preventDefault()} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className={label}>
          {W.pick.country}
          <select name="country" value={place.country} onChange={(e) => onPick({ country: e.target.value, city: null, trade: place.trade })} className={field}>
            {choices.countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label className={label}>
          {W.pick.city}
          <select name="city" value={place.city ?? ""} onChange={(e) => onPick({ country: place.country, city: e.target.value || null, trade: place.trade })} className={field}>
            <option value="">{fill(W.pick.anywhere, { country: inSentence(place.countryName) })}</option>
            {choices.cities.filter((c) => c.iso2 === place.iso2).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className={label}>
          {W.pick.trade}
          <select name="trade" value={place.trade} onChange={(e) => onPick({ country: place.country, city: place.city, trade: e.target.value })} className={field}>
            {choices.trades.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
      </form>
      {failed ? <p data-line="" role="status" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{W.pick.failed}</p> : null}
    </div>
  );
}

export function AnswerSection({ W, r, fmt, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; taxed: boolean }) {
  const be = r.breakEven;
  const rows: FactRow[] = [
    ...(be.held ? [{ key: "day", label: W.answer.day, value: fmt.money(be.value / 365), prov: prov(be, "break-even-a-day") }] : []),
    ...(r.customersADay.held ? [{ key: "customers", label: W.answer.customers, note: W.answer.customersNote, value: Math.round(r.customersADay.value).toLocaleString("en-GB"), prov: prov(r.customersADay, "customers-a-day") }] : []),
    ...(r.shareAbove.held ? [{ key: "firms", label: W.answer.firms, note: W.answer.firmsNote, value: fmt.percent(r.shareAbove.value, 0), prov: prov(r.shareAbove, "firms-above-break-even") }] : []),
    ...(r.targetSales.held ? [{ key: "goal", label: W.answer.goal, note: taxed ? W.answer.goalNote : W.answer.goalNoteWorld, value: fmt.money(r.targetSales.value / 12), prov: prov(r.targetSales, "sales-for-your-goal") }] : []),
  ];
  return (
    <Box id="answer" data-archetype="sim-answer" data-level="page" data-answers={SURFACE_ANSWERS.calculator} data-sim-answer="">
      <Rail icon="break-even" kicker={W.answer.title} level={2} />
      <div aria-live="polite">
        {be.held ? (
          <div data-sim-figure="">
            <Fig className="block text-[length:var(--t-answer)] font-semibold leading-none text-[var(--terra-text)]" prov={prov(be, "break-even-a-month")}>{fmt.money(be.value / 12)}</Fig>
            <p data-focal-words="" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{W.answer.month}</p>
          </div>
        ) : (
          <p data-sim-label="" data-line="" data-reason={be.reason} className="text-[length:var(--t-lead)] leading-6 text-[var(--c-ink)]">{reasonOf(be, W)}</p>
        )}
      </div>
      <FactRows rows={rows} className="mt-6" />
      <Basis>{be.held && be.yours ? W.answer.basisYours : W.answer.basis}</Basis>
    </Box>
  );
}

export function MarginSection({ W, r, fmt, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; taxed: boolean }) {
  const m = r.marginBefore;
  const rows: FactRow[] = taxed && r.marginAfter.held ? [{ key: "after", label: W.margin.after, value: fmt.percent(r.marginAfter.value), prov: prov(r.marginAfter, "margin-after-tax") }] : [];
  return (
    <Box id="margin">
      <Rail icon="margin" kicker={W.margin.title} level={2} />
      {m.held ? (
        <Focal
          figure={fmt.percent(m.value)}
          words={withYours(taxed ? W.margin.words : W.margin.wordsNoTax, m, W)}
          placement={r.salesRank.held ? fill(W.margin.placement, { pct: fmt.percent(r.salesRank.value, 0) }) : null}
          prov={prov(m, "margin-before-tax")}
          live
        />
      ) : (
        <Reason o={m} W={W} />
      )}
      <FactRows rows={rows} />
    </Box>
  );
}

/** THE INSTRUMENT'S LEVEL (spec section 4: "From 1024 the levers stand left and the answer and the bill right"; on a phone the answer stands above the
 *  levers). One wide zone holds it: the zone's own stacked rhythm under 1024 (STACKED), then two columns, the levers card spanning the three rows the
 *  answer, the margin and the month stand in. */
export function InstrumentGrid({ answer, margin, levers, month }: { answer: React.ReactNode; margin: React.ReactNode; levers: React.ReactNode; month: React.ReactNode }) {
  return (
    <div data-calc-grid="" className={`${STACKED} lg:grid-cols-[2fr_3fr] lg:gap-x-16 lg:[&>*:nth-child(3)]:col-start-1 lg:[&>*:nth-child(3)]:row-start-1 lg:[&>*:nth-child(3)]:row-span-3 lg:[&>*:not(:nth-child(3))]:col-start-2`}>
      <div className="min-w-0">{answer}</div>
      <div className="min-w-0">{margin}</div>
      <div className="min-w-0">{levers}</div>
      <div className="min-w-0">{month}</div>
    </div>
  );
}

/** THE MONTH AS ONE BAR (R7 4.6, "the signature drawing"): the costs that follow sales, the fixed costs and the profit, in greys and ink (no accent:
 *  the card's figure is no loud moment), the break-even ticked; at a loss the costs run past the sales, whose tick stands where they stop. The axis
 *  is the larger of the sales and the costs, so nothing is clipped. Its key is a list of words: no figure is printed twice. */
function MonthBar({ W, variable, fixed, sales, breakEven }: { W: CalculatorWords; variable: number; fixed: number; sales: number; breakEven: number | null }) {
  const costs = variable + fixed;
  const scale = Math.max(sales, costs, breakEven ?? 0) || 1;
  const loss = sales < costs;
  const parts: Array<{ key: "variable" | "fixed" | "profit"; value: number; fill: string }> = [
    { key: "variable", value: variable, fill: "var(--c-line-strong)" },
    { key: "fixed", value: fixed, fill: "var(--c-muted)" },
    ...(loss ? [] : [{ key: "profit" as const, value: sales - costs, fill: "var(--c-ink)" }]),
  ];
  const pct = (x: number) => `${Math.min(100, (x / scale) * 100)}%`;
  return (
    <div data-archetype="month-bar" role="img" aria-label={fill(W.month.bar, { last: (loss ? W.month.key.loss : W.month.key.profit).toLowerCase() })} className="relative mt-6">
      <div className="flex h-8 w-full overflow-hidden rounded-md bg-[var(--c-soft)]">
        {parts.map((s) => <span key={s.key} data-part={s.key} className="h-full" style={{ width: pct(s.value), background: s.fill }} />)}
      </div>
      {breakEven !== null ? <span data-tick="break-even" aria-hidden className="absolute -top-1 h-10 w-0.5 bg-[var(--c-ink)]" style={{ left: pct(breakEven) }} /> : null}
      {loss ? <span data-tick="sales" aria-hidden className="absolute -top-1 h-10 w-0.5 bg-[var(--c-ink2)]" style={{ left: pct(sales) }} /> : null}
      <ul data-key="" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">
        {parts.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: s.fill }} />{W.month.key[s.key]}</li>
        ))}
        {loss ? <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-0.5 bg-[var(--c-ink2)]" />{W.month.key.loss}</li> : null}
        <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-0.5 bg-[var(--c-ink)]" />{W.month.tick}</li>
      </ul>
    </div>
  );
}

function billRows(r: EngineResult, b: SimBundle, W: CalculatorWords, fmt: Format, span: 1 | 12, teamHeads: number): FactRow[] {
  const sum = (lines: BillLine[]) => lines.reduce((a, l) => a + Math.round(l.year * 100), 0) / 100;
  const group = (key: string, label: string, pick: (l: BillLine) => boolean, note: string | null = null): FactRow | null => {
    const lines = r.bill.filter(pick);
    if (lines.length === 0) return null;
    const yours = lines.some((l) => l.yours);
    return { key, label, note: yours ? W.levers.yourFigure : note, value: fmt.money(sum(lines) / span), prov: { src: `calculator:bill:${key}`, kind: lines.every((l) => l.kind === "worked out") && !yours ? "worked out" : "estimate" } };
  };
  return [
    group("goods", W.bill.goods, (l) => l.part === "variable" && l.key !== "share:running"),
    group("running", W.bill.running, (l) => l.key === "share:running" || l.key === "line:running"),
    group("crew", W.bill.crew, (l) => l.key === "line:crew"),
    group("team", W.bill.team, (l) => l.key.startsWith("team:"), fill(W.bill.teamNote, { n: teamHeads.toLocaleString("en-GB", { maximumFractionDigits: 1 }) })),
    group("rent", W.bill.rent, (l) => l.key === "rent"),
    group("service", W.bill.service, (l) => l.key === "service"),
    group("rates", W.bill.rates, (l) => l.key === "rates", b.ratesLine),
    group("loan", W.bill.loan, (l) => l.key === "loan"),
    group("owner", W.bill.owner, (l) => l.key === "owner"),
  ].filter((x): x is FactRow => x !== null);
}

export function MonthSection({ W, r, fmt, sales, bundle, teamHeads }: { W: CalculatorWords; r: EngineResult; fmt: Format; sales: number | null; bundle: SimBundle; teamHeads: number }) {
  const p = r.profit;
  const variable = r.bill.filter((b) => b.part === "variable").reduce((a, b) => a + b.year, 0);
  const fixed = r.bill.filter((b) => b.part !== "variable").reduce((a, b) => a + b.year, 0);
  const S = r.billAt === "sales" ? sales : r.breakEven.held ? r.breakEven.value : null;
  return (
    <Box id="month">
      <Rail icon="cost-breakdown" kicker={W.month.title} level={2} />
      {p.held ? <Focal figure={fmt.money(p.value / 12)} words={withYours(p.value < 0 ? W.month.loss : W.month.profit, p, W)} prov={prov(p, "profit-a-month")} live /> : <Reason o={p} W={W} />}
      {S !== null ? <MonthBar W={W} variable={variable} fixed={fixed} sales={S} breakEven={r.breakEven.held ? r.breakEven.value : null} /> : null}
      <Switch
        id="month-span"
        label={W.month.span}
        className="mt-6"
        views={[
          { key: "month", label: W.month.monthTab, panel: <FactRows rows={billRows(r, bundle, W, fmt, 12, teamHeads)} /> },
          { key: "year", label: W.month.yearTab, panel: <FactRows rows={billRows(r, bundle, W, fmt, 1, teamHeads)} /> },
        ]}
      />
      {p.held && S !== null ? <Basis>{fill(W.month.basis, { sales: fmt.money(S) })}</Basis> : null}
    </Box>
  );
}

export function MovesSection({ W, r, fmt, roles }: { W: CalculatorWords; r: EngineResult; fmt: Format; roles: SimRole[] }) {
  if (r.moves.length === 0 || !r.perHundred.held) return null;
  const rowsWords = W.moves.rows as Record<string, string>;
  const nameOf = (key: string) => (key.startsWith("hire:") ? roles.find((x) => x.key === key.slice(5))?.name ?? key : rowsWords[key.replace(/^line:/, "")] ?? key);
  const rows: BarRow[] = r.moves.map((m) => ({ key: m.key, name: nameOf(m.key), value: fmt.toShow(m.rise), prov: { src: `calculator:move:${m.key}`, kind: m.kind } }));
  return (
    <RankedBars
      id="moves"
      kicker={W.moves.title}
      icon="ranking"
      level={2}
      basis={W.moves.basis}
      rows={rows}
      worldMax={Math.max(...rows.map((x) => x.value))}
      fmt={(v: number) => shown(v, fmt.show, true)}
      phoneHead={W.moves.phoneHead}
      ceiling="set"
      feature="leader"
      topLabel={W.moves.top}
      focal={{ figure: Math.round(r.perHundred.value).toLocaleString("en-GB"), accent: true, words: withYours(W.moves.focal, r.perHundred, W), prov: { src: "calculator:sales-per-hundred-of-fixed-costs", kind: r.perHundred.kind } }}
    />
  );
}

export function OpeningSection({ W, r, fmt, bundle, state, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; bundle: SimBundle; state: SimState; taxed: boolean }) {
  const pb = r.paybackMonths;
  if (!pb.held && pb.reason === "no-opening") return null;
  const typed = Object.prototype.hasOwnProperty.call(state.levers, "opening") ? state.levers.opening ?? null : null;
  const lines = bundle.opening.lines;
  const total = lines.reduce((a, l) => a + Math.round(l.amount * 100), 0) / 100;
  const rows: FactRow[] = typed !== null
    ? [{ key: "yours", label: W.opening.yours, value: fmt.money(typed), prov: { src: "calculator:lever:opening", kind: "yours" } }]
    : [
      ...lines.map((l) => ({ key: l.key, label: l.name, value: fmt.money(l.amount), prov: { src: l.stamp.src, kind: l.stamp.kind } })),
      ...(lines.length > 1 ? [{ key: "total", label: W.opening.total, value: fmt.money(total), prov: { src: "calculator:opening-total", kind: "estimate" as const } }] : []),
    ];
  return (
    <Box id="opening">
      <Rail icon="startup-cost" kicker={W.opening.title} level={2} />
      {pb.held ? <Focal figure={pb.value.toLocaleString("en-GB")} words={withYours(taxed ? W.opening.monthsUk : W.opening.months, pb, W)} prov={prov(pb, "months-to-pay-back")} live /> : <Reason o={pb} W={W} />}
      <FactRows rows={rows} className="mt-6" />
      {pb.held ? <Basis>{bundle.opening.line}</Basis> : null}
    </Box>
  );
}

export function SourcesSection({ W, notes }: { W: CalculatorWords; notes: Array<{ label: string; fact: string }> }) {
  return (
    <Box id="sources">
      <Rail icon="methodology" kicker={W.sources.title} level={2} />
      <NoteList notes={notes} />
    </Box>
  );
}
