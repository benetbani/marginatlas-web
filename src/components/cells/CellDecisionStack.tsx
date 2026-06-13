/**
 * CellDecisionStack - the business/cell page body, composed from the Atlas Page
 * Kit in the content-map reading order. Takes a CellView (pure view model) and
 * renders only the sections it carries, so a thin cell shows a clean short page
 * and the London exemplar shows the full stack. The masthead is rendered by the
 * page above this; the startup-cost block is passed in as a slot so the page can
 * keep its existing data wiring.
 *
 * Tokens only via the kit; no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import {
  HonestTakeBox,
  PlainTerms,
  MoneyGoesBreakdown,
  BreakEvenLine,
  WagesByRole,
  Seasonality,
  RealisticFirstYear,
  SameBusinessNearby,
  WhatLocalsKnow,
  ContrarianInsight,
  MythVsReality,
  RightForWrongFor,
  GutCheck,
} from "@/components/kit";
import type { CellView } from "@/lib/cells/cell_view";

function usdFull(n: number): string {
  return Number.isFinite(n) ? `$${Math.round(n).toLocaleString("en-US")}` : "–";
}
function usd(n: number): string {
  if (!Number.isFinite(n)) return "–";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export function CellDecisionStack({
  view,
  startupCost,
}: {
  view: CellView;
  /** The page's existing startup-cost block, slotted into reading order. */
  startupCost?: React.ReactNode;
}) {
  return (
    <div className="space-y-6 md:space-y-8">
      {view.honestTake ? (
        <HonestTakeBox
          id="honest-take"
          verdict={view.honestTake.verdict}
          points={view.honestTake.points}
        >
          {view.honestTake.body}
        </HonestTakeBox>
      ) : null}

      {view.narrative ? (
        <section id="narrative" className="max-w-3xl">
          <p className="text-base leading-relaxed text-graphite md:text-lg">
            {view.narrative}
          </p>
        </section>
      ) : null}

      {view.plainTerms ? <PlainTerms id="plain-terms" items={view.plainTerms} /> : null}

      {view.moneyGoes ? (
        <MoneyGoesBreakdown
          id="money"
          items={view.moneyGoes}
          lede="Where each $100 a typical firm takes in actually goes."
        />
      ) : null}

      {view.breakEven ? (
        <BreakEvenLine
          id="break-even"
          headline={view.breakEven.headline}
          detail={view.breakEven.detail}
        />
      ) : null}

      {view.wages ? (
        <WagesByRole
          id="wages"
          roles={view.wages}
          format={usdFull}
          note="A guide to local pay before on-costs. The right people cost more than the floor, and keep the doors open."
        />
      ) : null}

      {startupCost ? <div id="startup-cost">{startupCost}</div> : null}

      {view.seasonality ? (
        <Seasonality
          id="seasonality"
          monthly={view.seasonality.monthly}
          note={view.seasonality.note}
        />
      ) : null}

      {view.firstYear ? (
        <RealisticFirstYear
          id="first-year"
          headline={view.firstYear.headline}
          bullets={view.firstYear.bullets}
        />
      ) : null}

      {view.nearby ? (
        <SameBusinessNearby
          id="nearby"
          rows={view.nearby}
          format={usd}
          valueLabel="Typical revenue a year."
        />
      ) : null}

      {view.whatLocals ? <WhatLocalsKnow id="locals" notes={view.whatLocals} /> : null}

      {view.contrarian ? (
        <ContrarianInsight
          id="contrarian"
          insight={view.contrarian.insight}
          body={view.contrarian.body}
        />
      ) : null}

      {view.myths ? <MythVsReality id="myths" pairs={view.myths} /> : null}

      {view.rightWrong ? (
        <RightForWrongFor
          id="fit"
          rightFor={view.rightWrong.rightFor}
          wrongFor={view.rightWrong.wrongFor}
        />
      ) : null}

      {view.gutCheck ? <GutCheck id="gut-check" questions={view.gutCheck} /> : null}
    </div>
  );
}
