"use client";

/**
 * THE COST SIMULATOR'S BODY (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first). One state: the place, its defaults (the
 * bundle), the reader's changes, the display currency. Each change recomputes the engine at once (no Apply button) and the answer is announced
 * politely; a place switch fetches its defaults from /api/calculator and puts every lever back to the new place's (the plan's Reading 15). The words
 * come in the seed; this file imports no server module and no copy table.
 *
 * THE ZONES: the masthead alone; the instrument (the answer, your margin, your numbers and your month); what moves it most; the money to open it beside
 * where figures come from. A section with nothing to draw is not passed to a zone, and the zones close up so no two lone zones stand together.
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { getStoredCurrency } from "@/components/CurrencySwitcher";
import type { CurrencyCode } from "@/lib/currency";
import { simulate } from "@/lib/simulator/engine";
import { FRESH, toEngine, type SimBundle, type SimState } from "@/lib/simulator/bundle";
import { makeFormat } from "@/lib/simulator/display";
import { ADDRESS_DEBOUNCE_MS, calculatorHref } from "@/lib/simulator/state";
import type { Place } from "@/lib/simulator/place";
import type { CalculatorSeed } from "@/lib/simulator/seed";
import { AnswerSection, InstrumentGrid, MarginSection, Masthead, MonthSection, MovesSection, OpeningSection, SourcesSection } from "./sections";
import { LeversCard } from "./levers";

export function CalculatorClient({ seed }: { seed: CalculatorSeed }) {
  const W = seed.words;
  const [place, setPlace] = React.useState<Place>(seed.place);
  const [bundle, setBundle] = React.useState<SimBundle>(seed.bundle);
  const [state, setState] = React.useState<SimState>(seed.state);
  const [show, setShow] = React.useState<CurrencyCode>("USD");
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  /* The lever the reader last moved: it shows its effect beside it (spec section 7); none on arrival. */
  const [active, setActive] = React.useState<string | null>(null);

  /* THE SITE'S CURRENCY SWITCH: its stored choice once hydrated, then each change it announces. A change redraws every figure and writes no lever. */
  React.useEffect(() => {
    setShow(getStoredCurrency());
    const on = (e: Event) => { const c = (e as CustomEvent<CurrencyCode>).detail; if (c) setShow(c); };
    window.addEventListener("atlas:currency-change", on);
    return () => window.removeEventListener("atlas:currency-change", on);
  }, []);

  /* THE ADDRESS FOLLOWS (spec section 3): the place and the changed levers, written with replaceState once the reader pauses, so a drag writes one entry
     and Back leaves the page as it came. */
  React.useEffect(() => {
    const href = calculatorHref(place, state, bundle);
    const t = window.setTimeout(() => {
      if (window.location.pathname + window.location.search !== href) window.history.replaceState(window.history.state, "", href);
    }, ADDRESS_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [place, state, bundle]);

  const inputs = React.useMemo(() => toEngine(bundle, state), [bundle, state]);
  const r = React.useMemo(() => simulate(inputs), [inputs]);
  const fmt = React.useMemo(() => makeFormat(bundle.currency, show), [bundle.currency, show]);
  const taxed = bundle.tax.law === "uk";
  const changed = Object.keys(state.levers).length + Object.keys(state.heads).length + Object.keys(state.pay).length > 0 || state.form !== null || !!state.on.owner || !!state.on.target;
  const notes = changed ? [W.sources.yours, ...bundle.notes].slice(0, 5) : bundle.notes;

  const pick = async (next: { country: string; city: string | null; trade: string }) => {
    setBusy(true);
    setFailed(false);
    try {
      const q = new URLSearchParams({ country: next.country, trade: next.trade });
      if (next.city) q.set("city", next.city);
      const res = await fetch(`/api/calculator?${q.toString()}`);
      if (!res.ok) throw new Error(`calculator: ${res.status}`);
      const body = (await res.json()) as { place: Place; bundle: SimBundle };
      setPlace(body.place);
      setBundle(body.bundle);
      setState(FRESH);
      setActive(null);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const teamHeads = inputs.roles.reduce((a, x) => a + (x.heads > 0 ? x.heads : 0), 0);
  const sales = inputs.sales ? inputs.sales.v : null;
  const moves = <MovesSection key="moves" W={W} r={r} fmt={fmt} roles={bundle.roles} />;
  const opening = <OpeningSection key="opening" W={W} r={r} fmt={fmt} bundle={bundle} state={state} taxed={taxed} />;
  const sources = <SourcesSection key="sources" W={W} notes={notes} />;
  const hasMoves = r.moves.length > 0 && r.perHundred.held;
  const hasOpening = r.paybackMonths.held || r.paybackMonths.reason !== "no-opening";
  /* THE MONEY TO OPEN IT TAKES THREE FIFTHS FROM 1024 (the model laws' LABEL GAP, measured on the render at 1280): in an even half (504px) its rows' labels
     stood 168 to 227px from their figures; at three fifths (605px) the rows split into two lists, each label beside its figure. */
  const after: Array<{ key: string; split: ZoneSplit; label: string; body: React.ReactNode[] }> =
    hasMoves && hasOpening ? [{ key: "moves", split: "2-1", label: W.moves.title, body: [moves] }, { key: "money", split: "3-2", label: W.opening.title, body: [opening, sources] }]
    : hasMoves ? [{ key: "moves", split: "2-1", label: W.moves.title, body: [moves, sources] }]
    : hasOpening ? [{ key: "money", split: "3-2", label: W.opening.title, body: [opening, sources] }]
    : [{ key: "sources", split: "2-1", label: W.sources.title, body: [sources] }];
  const zones: Array<{ key: string; split: ZoneSplit; label: string; body: React.ReactNode[] }> = [
    { key: "head", split: "wide", label: W.title, body: [<Masthead key="head" W={W} place={place} choices={seed.choices} onPick={pick} busy={busy} failed={failed} />] },
    {
      key: "instrument",
      split: "wide",
      label: W.answer.title,
      body: [
        <InstrumentGrid
          key="grid"
          answer={<AnswerSection W={W} r={r} fmt={fmt} taxed={taxed} cellSpread={bundle.spread?.kind === "tenths"} />}
          margin={<MarginSection W={W} r={r} fmt={fmt} taxed={taxed} />}
          levers={<LeversCard W={W} bundle={bundle} state={state} r={r} fmt={fmt} set={setState} active={active} onActive={setActive} />}
          month={<MonthSection W={W} r={r} fmt={fmt} sales={sales} bundle={bundle} teamHeads={teamHeads} />}
        />,
      ],
    },
    ...after,
  ];
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      <SourcesFoot iso2={place.iso2} />
      <ReportFoot path={seed.path} />
    </>
  );
}
