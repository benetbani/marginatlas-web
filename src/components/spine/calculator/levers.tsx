/**
 * THE LEVERS, THE PAGE'S ONE CARD (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, item 3: "Team, Premises, Sales, You, Loan; each a slider
 * beside a typed figure with its source line; team rows as steppers"; MODEL 10.4, a card stays where the reader operates it). Each row draws the
 * figure in the reader's currency and writes the base figure back (display.ts), stamped "yours" once set; its line says where the default came
 * from, or that the figure is the reader's, with a reset. The fixed costs a month are the card's 30. Q4 answer A: the team rows are steppers with
 * their counts, no bar.
 */
import * as React from "react";
import { Box, Rail, Fig, Focal, Basis } from "@/components/spine/kit";
import { Range } from "@/components/spine/interact/Range";
import { BOUNDS, HEADS_MAX, PAY_MAX, clampTo } from "@/lib/simulator/bounds";
import type { Format } from "@/lib/simulator/display";
import type { EngineResult } from "@/lib/simulator/engine";
import type { LeverKey, SimBundle, SimInput, SimRole, SimState } from "@/lib/simulator/bundle";
import type { CalculatorWords } from "@/lib/simulator/seed";
import type { Provenance } from "@/lib/spine/provenance";
import { Reason, reasonOf, withYours } from "./sections";

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const LINE = "mt-1 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]";
const RESET = "tap-y ml-2 underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]";
const STEP = "tap-y h-11 w-11 rounded-md border border-[var(--c-line-strong)] text-[length:var(--t-lead)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)] disabled:opacity-40";
const TOGGLE = "tap-y rounded-md border border-[var(--c-line-strong)] px-3 py-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]";

function Group({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    /* 24 FROM THE GROUP ABOVE (release 3 job C, 2026-10-16: the line rule read the levers' first group 32 under the focal block, its mb-6 and this
       margin collapsing to the larger, once the calculator joined its scan set): the group step, so the focal block and each group stand 24 apart. */
    <section aria-labelledby={`levers-${id}`} data-lever-group={id} className="mt-6">
      <h3 id={`levers-${id}`} data-typography="custom" className="text-[length:var(--t-lead)] font-semibold leading-6 text-[var(--c-ink)]">{title}</h3>
      <ul className="mt-4 grid gap-6">{children}</ul>
    </section>
  );
}

/** WHAT THE LEVER JUST DID (spec section 7: "the answer stands above the levers and each lever shows its effect beside it"; no live region: the answer
 *  alone announces, the final review's M2): under the lever the reader
 *  last moved, the break-even as it now stands, or the reason it cannot be worked out. Only the lever in hand carries it, so the page prints the answer
 *  twice only while the reader is moving something, never on arrival. */
export type Effect = { figure: string; prov: Provenance | null } | { words: string } | null;
function EffectLine({ effect, W }: { effect: Effect; W: CalculatorWords }) {
  if (!effect) return null;
  return (
    <p data-effect="" className="mt-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
      {"figure" in effect ? (
        <>
          {W.levers.effect} <Fig className="font-semibold" prov={effect.prov}>{effect.figure}</Fig> {W.levers.effectTail}
        </>
      ) : effect.words}
    </p>
  );
}

export function LeverRow({ id, W, input, value, yours, kind, unit, fmt, effect = null, onChange, onClear, onReset }: { id: LeverKey; W: CalculatorWords; input: SimInput; value: number | null; yours: boolean; kind: "money" | "share" | "count"; unit?: string; fmt: Format; effect?: Effect; onChange: (x: number) => void; onClear: () => void; onReset: () => void }) {
  const b = BOUNDS[id];
  const show = (x: number) => (kind === "money" ? fmt.toShow(x) : kind === "share" ? x * 100 : x);
  const back = (x: number) => (kind === "money" ? fmt.fromShow(x) : kind === "share" ? x / 100 : x);
  const stamp: Provenance | null = yours ? { src: `calculator:lever:${id}`, kind: "yours" } : input.stamp ? { src: input.stamp.src, kind: input.stamp.kind } : null;
  return (
    <li data-lever-row={id}>
      <Range
        id={`lever-${id}`}
        label={W.levers.labels[id]}
        min={show(b.min)}
        max={show(b.max)}
        step={kind === "money" ? 1 : kind === "share" ? b.step * 100 : b.step}
        value={value === null ? null : show(value)}
        onChange={(x) => onChange(back(x))}
        onClear={onClear}
        format={(x) => (kind === "money" ? `${fmt.symbol}${Math.round(x).toLocaleString("en-GB")}` : kind === "share" ? `${x.toFixed(1)}%` : x.toLocaleString("en-GB"))}
        unit={unit}
        prov={stamp}
        symbol={kind === "money" ? fmt.symbol : ""}
        decimals={kind === "share" || b.step < 1 ? 1 : 0}
      />
      <p data-line="" className={LINE}>
        {yours ? W.levers.yourFigure : input.line}
        {yours ? <button type="button" onClick={onReset} className={RESET}>{W.levers.reset}</button> : null}
      </p>
      <EffectLine effect={effect} W={W} />
    </li>
  );
}

export function TeamRow({ role, W, fmt, heads, headsYours, pay, payYours, effect = null, onHeads, onPay, onPayReset }: { role: SimRole; W: CalculatorWords; fmt: Format; heads: number; headsYours: boolean; pay: number | null; payYours: boolean; effect?: Effect; onHeads: (n: number) => void; onPay: (x: number) => void; onPayReset: () => void }) {
  const headsProv: Provenance = headsYours ? { src: `calculator:lever:team:${role.key}`, kind: "yours" } : { src: role.headsStamp.src, kind: role.headsStamp.kind };
  const payProv: Provenance | null = payYours ? { src: `calculator:lever:pay:${role.key}`, kind: "yours" } : role.pay.stamp ? { src: role.pay.stamp.src, kind: role.pay.stamp.kind } : null;
  return (
    <li data-team-row={role.key}>
      {/* THE STEPPER IN THE NEXT COLUMN, never pushed to the card's far edge (PART 5's row, the model laws' LABEL GAP: no justify-between row on a card
          over 420px, measured on the card at 768): one fluid column on a phone, the name's 22ch from 768. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 md:grid-cols-[minmax(0,22ch)_auto]">
        <span className="min-w-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
          {role.name}
          {role.sub ? <span className="block text-[var(--c-muted)]">{role.sub}</span> : null}
        </span>
        <span className="inline-flex shrink-0 items-center gap-2">
          <button type="button" aria-label={`${W.levers.remove}: ${role.name}`} disabled={heads <= 0} onClick={() => onHeads(Math.max(0, heads - 1))} className={STEP}>{"−"}</button>
          <Fig className="block min-w-8 text-right text-[length:var(--t-lead)] font-semibold tabular-nums text-[var(--c-ink)]" prov={headsProv}>{heads.toLocaleString("en-GB", { maximumFractionDigits: 1 })}</Fig>
          <button type="button" aria-label={`${W.levers.add}: ${role.name}`} disabled={heads >= HEADS_MAX} onClick={() => onHeads(Math.min(HEADS_MAX, heads + 1))} className={STEP}>+</button>
        </span>
      </div>
      {heads > 0 ? (
        <div className="mt-3">
          <Range id={`pay-${role.key}`} label={W.levers.labels.pay} min={0} max={fmt.toShow(PAY_MAX)} step={1} value={pay === null ? null : fmt.toShow(pay)} onChange={(x) => onPay(fmt.fromShow(x))} format={(x) => `${fmt.symbol}${Math.round(x).toLocaleString("en-GB")}`} unit={W.levers.units.year} prov={payProv} symbol={fmt.symbol} />
          <p data-line="" className={LINE}>
            {payYours ? W.levers.yourFigure : role.pay.line}
            {payYours ? <button type="button" onClick={onPayReset} className={RESET}>{W.levers.reset}</button> : null}
          </p>
        </div>
      ) : null}
      <EffectLine effect={effect} W={W} />
    </li>
  );
}

export function LeversCard({ W, bundle, state, r, fmt, set, active = null, onActive = () => {} }: { W: CalculatorWords; bundle: SimBundle; state: SimState; r: EngineResult; fmt: Format; set: (s: SimState) => void; active?: string | null; onActive?: (key: string) => void }) {
  const valueOf = (k: LeverKey) => (has(state.levers, k) ? state.levers[k] ?? null : bundle.inputs[k].value);
  const touch = (key: string, next: SimState) => { onActive(key); set(next); };
  const setLever = (k: LeverKey, x: number | null) => touch(k, { ...state, levers: { ...state.levers, [k]: x === null ? null : clampTo(k, x) } });
  const reset = (k: LeverKey) => { const levers = { ...state.levers }; delete levers[k]; touch(k, { ...state, levers }); };
  const toggle = (k: "owner" | "target", on: boolean) => { const levers = { ...state.levers }; if (!on) delete levers[k]; touch(k, { ...state, levers, on: { ...state.on, [k]: on } }); };
  const effectOf = (key: string): Effect => (active !== key ? null : r.breakEven.held ? { figure: fmt.money(r.breakEven.value / 12), prov: { src: "calculator:break-even-a-month", kind: r.breakEven.kind } } : { words: reasonOf(r.breakEven, W) });
  const U = W.levers.units;
  const row = (k: LeverKey, kind: "money" | "share" | "count", unit?: string) => (
    <LeverRow key={k} id={k} W={W} input={bundle.inputs[k]} value={valueOf(k)} yours={has(state.levers, k)} kind={kind} unit={unit} fmt={fmt} effect={effectOf(k)} onChange={(x) => setLever(k, x)} onClear={() => setLever(k, null)} onReset={() => reset(k)} />
  );
  return (
    /* THE PAGE'S ONE PROSE SECTION (art direction E1: a source line under every lever, 681 characters on the render at 1440, over the 220 a card holds
       unless it is the page's one exempt section; where figures come from keeps its facts to short phrases for this). */
    <Box id="levers" keep data-archetype="sim-levers" data-editorial="1">
      <Rail icon="calculator" kicker={W.levers.title} level={2} />
      {r.fixedYear.held ? <Focal figure={fmt.money(r.fixedYear.value / 12)} words={withYours(W.levers.fixed, r.fixedYear, W)} prov={{ src: "calculator:fixed-costs-a-month", kind: r.fixedYear.kind }} /> : <Reason o={r.fixedYear} W={W} />}
      <Group id="team" title={W.levers.groups.team}>
        {bundle.path === "uk-model" ? (
          <li data-team-note="">
            <p data-line="" className={LINE}>{W.levers.staffLine}</p>
            <p data-line="" className={LINE}>{W.levers.hireOnTop}</p>
          </li>
        ) : (
          <li data-team-note="">
            <p data-line="" className={LINE}>{bundle.teamLine}</p>
          </li>
        )}
        {bundle.roles.map((role) => (
          <TeamRow
            key={role.key}
            role={role}
            W={W}
            fmt={fmt}
            heads={has(state.heads, role.key) ? state.heads[role.key] : role.heads}
            headsYours={has(state.heads, role.key)}
            pay={has(state.pay, role.key) ? state.pay[role.key] : role.pay.value}
            payYours={has(state.pay, role.key)}
            effect={effectOf(`team:${role.key}`)}
            onHeads={(n) => touch(`team:${role.key}`, { ...state, heads: { ...state.heads, [role.key]: n } })}
            onPay={(x) => touch(`team:${role.key}`, { ...state, pay: { ...state.pay, [role.key]: Math.min(PAY_MAX, Math.max(0, x)) } })}
            onPayReset={() => { const pay = { ...state.pay }; delete pay[role.key]; touch(`team:${role.key}`, { ...state, pay }); }}
          />
        ))}
        {bundle.ukLaw ? <li><p data-line="" className={LINE}>{W.lines.team.ukLaw}</p></li> : row("oncost", "share", `${U.pct} ${U.pay}`)}
      </Group>
      <Group id="premises" title={W.levers.groups.premises}>
        {row("area", "count", U.m2)}
        {row("rent", "money", U.year)}
        {row("service", "money", U.year)}
      </Group>
      <Group id="sales" title={W.levers.groups.sales}>
        {row("sales", "money", U.year)}
        {row("ticket", "money", U.head)}
        {row("goods", "share", `${U.pct} ${U.share}`)}
        {bundle.path === "world" ? row("runShare", "share", `${U.pct} ${U.share}`) : null}
      </Group>
      <Group id="you" title={W.levers.groups.you}>
        <li data-lever-row="owner-on">
          <button type="button" aria-pressed={!!state.on.owner} onClick={() => toggle("owner", !state.on.owner)} className={TOGGLE}>{state.on.owner ? W.levers.stopPaying : W.levers.payYourself}</button>
          {state.on.owner ? null : <p data-line="" className={LINE}>{W.lines.owner.off}</p>}
        </li>
        {state.on.owner ? row("owner", "money", U.year) : null}
        <li data-lever-row="target-on">
          <button type="button" aria-pressed={!!state.on.target} onClick={() => toggle("target", !state.on.target)} className={TOGGLE}>{state.on.target ? W.levers.dropTarget : W.levers.setTarget}</button>
        </li>
        {state.on.target ? row("target", "money", U.year) : null}
        {bundle.tax.law === "uk" ? (
          <li data-lever-row="form">
            <label className="flex flex-col gap-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">
              {W.levers.form}
              <select value={state.form ?? bundle.tax.form} onChange={(e) => touch("form", { ...state, form: e.target.value === "company" ? "company" : "sole trader" })} className="h-12 rounded-md border border-[var(--c-line-strong)] bg-[var(--c-card)] px-3 text-[length:var(--t-lead)] text-[var(--c-ink)]">
                <option value="sole trader">{W.levers.sole}</option>
                <option value="company">{W.levers.company}</option>
              </select>
            </label>
            <p data-line="" className={LINE}>{W.lines.form}</p>
          </li>
        ) : null}
      </Group>
      <Group id="loan" title={W.levers.groups.loan}>
        {row("loanAmount", "money")}
        {row("loanRate", "count", U.pct)}
        {row("loanYears", "count", U.years)}
        {row("opening", "money")}
      </Group>
      {r.fixedYear.held ? <Basis>{W.levers.basis}</Basis> : null}
    </Box>
  );
}
