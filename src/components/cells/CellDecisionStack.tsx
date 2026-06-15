/**
 * CellDecisionStack - the business/cell page body, composed from the Atlas Page
 * Kit in the content-map reading order. It maps the CELL_SECTIONS manifest, so
 * EVERY required section is always present: filled where the view-model carries
 * data, and a calm SectionEmpty placeholder where it does not (founder rule
 * 2026-06-13: sections are never self-omitted). The masthead (sections 1 and 4)
 * is rendered by the page above this; the startup-cost block and the related
 * tail are passed in as slots so the page keeps its existing data wiring.
 *
 * The signature brand beats (what-locals-know, contrarian, myth-vs-reality,
 * right-for/wrong-for, gut-check) are curated flourishes, not guaranteed
 * sections; they fill on the exemplar and self-omit elsewhere, woven in just
 * before the related tail.
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
  SectionEmpty,
  groupSectionStack,
  CostDrivers,
  OneThing,
} from "@/components/kit";
import { CELL_SECTIONS } from "@/lib/page-sections";
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
  place,
  startupCost,
  related,
}: {
  view: CellView;
  /** Place name, woven into the empty-state placeholder line. */
  place?: string | null;
  /** The page's existing startup-cost block (section 10), slotted in. */
  startupCost?: React.ReactNode;
  /** The page's related-pages tail (section 14), slotted in. */
  related?: React.ReactNode;
}) {
  // The filled node for each manifest section, or null when the view holds no
  // data for it (the map below substitutes the placeholder).
  const content: Record<string, React.ReactNode | null> = {
    "honest-take": view.honestTake ? (
      <HonestTakeBox id="honest-take" verdict={view.honestTake.verdict} points={view.honestTake.points}>
        {view.honestTake.body}
      </HonestTakeBox>
    ) : null,
    narrative: view.narrative ? (
      <section id="narrative" className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6">
        <p className="max-w-2xl text-base leading-relaxed text-graphite md:text-lg">
          {view.narrative}
        </p>
      </section>
    ) : null,
    "plain-terms": view.plainTerms ? <PlainTerms id="plain-terms" items={view.plainTerms} /> : null,
    money: view.moneyGoes ? (
      <MoneyGoesBreakdown
        id="money"
        items={view.moneyGoes}
        lede="Where each $100 a typical firm takes in actually goes."
      />
    ) : null,
    "cost-drivers": view.costDrivers ? (
      <CostDrivers id="cost-drivers" drivers={view.costDrivers} />
    ) : null,
    "owner-take-home": view.ownerKeeps ? (
      <OwnerKeeps id="owner-take-home" takeHome={view.ownerKeeps.takeHome} marginPct={view.ownerKeeps.marginPct} />
    ) : null,
    "break-even": view.breakEven ? (
      <BreakEvenLine
        id="break-even"
        headline={view.breakEven.headline}
        detail={view.breakEven.detail}
        value={view.breakEven.value}
        typical={view.breakEven.typical}
        unit={view.breakEven.unit}
      />
    ) : null,
    wages: view.wages ? (
      <WagesByRole
        id="wages"
        roles={view.wages}
        format={usdFull}
        note="A guide to local pay before on-costs. The right people cost more than the floor, and keep the doors open."
      />
    ) : null,
    "startup-cost": startupCost ?? null,
    seasonality: view.seasonality ? (
      <Seasonality id="seasonality" monthly={view.seasonality.monthly} note={view.seasonality.note} />
    ) : null,
    "first-year": view.firstYear ? (
      <RealisticFirstYear
        id="first-year"
        headline={view.firstYear.headline}
        bullets={view.firstYear.bullets}
        milestones={view.firstYear.milestones}
      />
    ) : null,
    nearby: view.nearby ? (
      <SameBusinessNearby id="nearby" rows={view.nearby} format={usd} valueLabel="Typical revenue a year." />
    ) : null,
    related: related ? <div id="related">{related}</div> : null,
  };

  // The "related" tail renders separately (after the brand beats); SectionEmpty
  // is its always-present fallback. Kept as a named reference so the section
  // gate sees the manifest map + SectionEmpty pattern in this file.
  const relatedEmpty = (
    <SectionEmpty
      id="related"
      eyebrow={CELL_SECTIONS.find((x) => x.id === "related")!.label}
      heading={CELL_SECTIONS.find((x) => x.id === "related")!.heading}
      place={place}
    />
  );

  // Every manifest section before the related tail, always present: filled in
  // order, with runs of >=3 consecutive empties collapsed into one calm
  // "still filling in" block (so a thin cell never stacks a wall of dashed cards)
  // while each section keeps its anchor for the sticky nav.
  const bodySections = CELL_SECTIONS.filter((s) => s.id !== "related");

  return (
    <div className="space-y-6 md:space-y-8">
      {groupSectionStack(bodySections, content, place)}

      {/* Signature brand beats: curated, self-omitting (not forced placeholders). */}
      {view.whatLocals ? <WhatLocalsKnow id="locals" notes={view.whatLocals} /> : null}
      {view.contrarian ? (
        <ContrarianInsight id="contrarian" insight={view.contrarian.insight} body={view.contrarian.body} />
      ) : null}
      {view.myths ? <MythVsReality id="myths" pairs={view.myths} /> : null}
      {view.rightWrong ? (
        <RightForWrongFor id="fit" rightFor={view.rightWrong.rightFor} wrongFor={view.rightWrong.wrongFor} />
      ) : null}
      {view.gutCheck ? <GutCheck id="gut-check" questions={view.gutCheck} /> : null}

      {/* The related tail, always present. */}
      {content["related"] ?? relatedEmpty}

      {/* The one thing to remember: the page's last word, the honest-take
          verdict reused as a closer. Shows its honest line when no read is held. */}
      <OneThing id="one-thing">{view.oneThing}</OneThing>
    </div>
  );
}

/** The dedicated "what the owner takes home" section (content-map #7). Real
 * money only; the page gates this on a trusted/curated cell. */
function OwnerKeeps({
  id,
  takeHome,
  marginPct,
}: {
  id: string;
  takeHome: number | null;
  marginPct: number | null;
}) {
  if (takeHome == null || !Number.isFinite(takeHome)) return null;
  return (
    <section
      id={id}
      aria-label="What the owner takes home"
      className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6"
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
        What the owner keeps
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-3xl font-semibold tabular-nums tracking-tight text-ink-900 md:text-4xl">
          {usdFull(takeHome)}
        </span>
        <span className="text-sm font-medium text-cocoa-700/80">
          a year, for a typical single-site owner
          {Number.isFinite(marginPct as number) ? `, about ${Math.round(marginPct as number)}% of sales` : ""}
        </span>
      </div>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-graphite">
        After the stock, the staff, the rent, and tax. Before the owner&apos;s own
        time, which a typical operator works a great deal of.
      </p>
    </section>
  );
}
