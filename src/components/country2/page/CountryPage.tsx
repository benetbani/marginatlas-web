/**
 * src/components/country2/page/CountryPage.tsx
 *
 * The country page. Twenty-one chapters, always, in every country.
 *
 * The assembly is written against the FULL spine from its first commit, so a
 * chapter that is not yet filled renders a stated gap rather than being absent
 * from the file. That is deliberate and it is cheap: when a chapter lands, the
 * fixture changes and nothing here moves at all. It also means the page's shape
 * is correct today, which is the founder's rule: a page is always complete and
 * never varies by place.
 *
 * It reuses the spine-2 component kit and the `.av2` stylesheet rather than
 * growing a second one. Verified before relying on it: the country mockup
 * speaks the same vocabulary as the trade and city mockups (`panel`, `pad`,
 * `rise`, `chhead`, `chnum`, `itile`, `gi-*`, `row`, `nm`, `v`, `fig`, `k`,
 * `eight`, `readcol`, `col-split`, `sbar`, `ledger`, `take`, `tiles`, `band`,
 * `trust`), and the RulerColumn in that kit was built from this page's own
 * chapters 02 and 04. The three data page types are one visual product by
 * construction rather than by discipline.
 *
 * WHAT THIS DELIBERATELY DOES NOT PORT, recorded rather than dropped quietly:
 *   - the twenty-one-entry chapter jump rail, which is navigation rather than
 *     content and which the city port also left out;
 *   - the "something look wrong" button in the trust band, because a button
 *     that does nothing is a dead affordance and worse than no button.
 *
 * TWO CLASSES THAT LOOK GENERIC AND ARE NOT, both found by looking at the page
 * rather than at the markup, and both worth knowing before extending this file:
 *   - `.row` is scoped to `.statblock .row`. A bare `.row` inside a plain
 *     `.panel > .pad` gets NO layout at all: the name and the figure run
 *     together into one line of unstyled text ("Open a bank accountsets your
 *     opening date5 weeks"). Every label-and-figure list here goes through
 *     `Statblock`, which is what owns that frame.
 *   - `.k` is not a top-level class either; it exists only nested inside other
 *     components. Supporting prose uses `.note`, which is what the country
 *     mockup itself uses on every chapter.
 */
import * as React from "react";

import { ChapterSection, type Chapter } from "@/components/spine2/page/ChapterHead";
import { Place } from "@/components/spine2/Place";
import { ChapterGap } from "@/components/spine2/page/ChapterGap";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { RulerColumn, type RulerReading } from "@/components/spine2/RulerColumn";
import { Statblock, type StatRow } from "@/components/spine2/Statblock";
import { SBar, type SBarTone } from "@/components/spine2/SBar";
import { ColSplit, type ColSplitTone } from "@/components/spine2/ColSplit";
import { Ledger } from "@/components/spine2/Ledger";
import type { Tier } from "@/components/spine2/tiers";
import { numberWord, type CountryPageModel, type CountryChapterId } from "@/lib/countries/country_adapter";

import "@/styles/atlas-spine.css";

/** The ramp step a cost part carries, as the kit names it. The adapter already
 *  resolved 0 to 4 into these; this only narrows the string. */
const asColTone = (t: string): ColSplitTone => t as ColSplitTone;

export function CountryPage({ model }: { model: CountryPageModel }) {
  const byId = new Map(model.chapters.map((c) => [c.id, c]));
  const at = (id: CountryChapterId): Chapter | null =>
    (byId.get(id) as unknown as Chapter) ?? null;

  /** A chapter whose data is not filled for this country. The reason comes
   *  from the file when it states one, which it usually does, and it is a
   *  better sentence than any generic line: "this comparison needs five other
   *  country files built the same way as this one, and none exists yet". */
  const gap = (id: CountryChapterId, subject: string) => (
    <ChapterGap subject={subject} reason={model.gapReasons[id] ?? null} key={id} />
  );

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
              <a href={model.meta.urlPath}>{model.meta.country}</a>
            </nav>
          </div>
        </header>

        {/* 01 , the answer. A SHARE of profit, never a sum of money: the
            country page was parked for months because every candidate headline
            was a currency total, and most of the world does not price anything
            in dollars. */}
        {at("hero") != null ? (
          <ChapterSection chapter={at("hero") as Chapter}>
            {model.hero != null ? (
              <div className="glass rise" style={{ padding: "32px 32px" }}>
                <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
                  <div>
                    <div className="crumb">
                      <span>{model.hero.country}</span>
                      <span className="d" />
                      <span>{model.hero.region}</span>
                    </div>
                    {/* The ARTICLED name, not the bare one. This title is a
                        sentence and the crumb above it is a label; the first
                        render read "Opening a business in United Kingdom". */}
                    <h1 style={{ marginTop: 16, maxWidth: "13ch" }}>
                      Opening a business in {model.hero.countryInSentence}
                    </h1>
                    {model.hero.texture ? (
                      <p className="texture">
                        <b>{model.hero.texture.figure}</b> {model.hero.texture.line}
                      </p>
                    ) : null}
                    <div className="answer">
                      <div className="num fig">{model.hero.headline}</div>
                      <div className="l">{model.hero.headlineLabel}</div>
                    </div>
                  </div>
                  <div className="panel pad">
                    <Statblock
                      rail={false}
                      header={{ label: "Before you trade", icon: "taxes" as GlyphId }}
                      rows={model.hero.glance.map(
                        (g): StatRow => ({
                          label: g.label,
                          /* A glance row with no figure states its absence
                             rather than vanishing, so the panel is three rows
                             tall in every country. */
                          value: g.value ?? "not published",
                        }),
                      )}
                    />
                    {model.hero.parts.length ? (
                      <div style={{ marginTop: 16 }}>
                        <div className="lab" style={{ marginBottom: 10 }}>
                          {model.hero.partsLabel}
                        </div>
                        {/* No accent. A breakdown has no single answer, and
                            painting the largest slice terracotta reads as "this
                            is the finding" about a component that is only
                            arithmetic. The ramp orders it by size and nothing
                            else. */}
                        <SBar
                          total={model.hero.parts.reduce((a, p) => a + p.sharePct, 0)}
                          segments={model.hero.parts.map((p, i) => ({
                            label: p.label,
                            value: p.sharePct,
                            display: `${p.sharePct}%`,
                            tone: (["ink", "n3", "n5"][i] ?? "n4") as SBarTone,
                          }))}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 18,
                    borderTop: "1px solid var(--hair)",
                  }}
                >
                  <span className="tag">Reviewed {model.hero.reviewedAt}</span>
                </div>
              </div>
            ) : (
              gap("hero", "what the state takes")
            )}
          </ChapterSection>
        ) : null}

        {/* 02 , the eight numbers. The accent is DERIVED from the percentile by
            the shared EIGHT_EXTREME constant, so the caption's claim about the
            top and bottom tenth cannot disagree with the dots. The mockup
            hand-set it per row, which is how it came to paint 68 and 6 and
            leave 86 unmarked. */}
        {at("scorecard") != null ? (
          <ChapterSection chapter={at("scorecard") as Chapter}>
            {model.scorecard != null ? (
              <RulerColumn
                className="rise"
                mark="dot"
                readings={model.scorecard.rows.map(
                  (r): RulerReading => ({
                    glyph: r.glyph as GlyphId,
                    label: r.label,
                    sub: r.sub,
                    pos: r.value == null ? null : r.position,
                    value: r.value ?? "not published",
                  }),
                )}
                scale={{
                  left: "lowest",
                  mid: model.scorecard.baselineLabel,
                  right: "highest",
                }}
                accent={{ rule: "extreme", hi: 90, lo: 10 }}
                caption={() => "a terracotta dot is the top or bottom tenth worldwide"}
                captionSecondary="against every country we hold"
                readingLabel="reading"
                valueLabel="value"
              />
            ) : (
              gap("scorecard", "the eight key numbers")
            )}
          </ChapterSection>
        ) : null}

        {/* 03 , the six qualities. Every axis is normalised so that further out
            is better for an owner, and the page says so, or the shape would be
            unreadable. */}
        {at("shape") != null ? (
          <ChapterSection chapter={at("shape") as Chapter}>
            {model.shape != null ? (
              <>
                <p className="note" style={{ margin: "0 0 10px", maxWidth: "74ch" }}>
                  Six qualities on one rule: a higher score is better for an owner. Read
                  the top of this list as what the country is good at and the bottom as
                  what it charges you.
                </p>
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "Read a higher score as better" }}
                  rows={model.shape.axes.map(
                    (a): StatRow => ({
                      label: a.label,
                      sub: a.note,
                      value: String(a.score),
                    }),
                  )}
                />
              </>
            ) : (
              gap("shape", "the six qualities that describe this country")
            )}
          </ChapterSection>
        ) : null}

        {/* 04 , the twelve readings. Grouped in the order a founder meets them,
            easiest first inside each group, on one shared scale. The caption
            counts the accented rows itself, so the sentence and the marks come
            from the same derivation. */}
        {at("rules") != null ? (
          <ChapterSection chapter={at("rules") as Chapter}>
            {model.rules != null ? (
              <RulerColumn
                className="rise full"
                mark="bar"
                sort="asc"
                readings={model.rules.readings.map(
                  (r): RulerReading => ({
                    glyph: (r.icon ?? undefined) as GlyphId | undefined,
                    label: r.label,
                    group: r.group,
                    pos: r.position,
                    value: r.value,
                  }),
                )}
                scale={{ left: "easy for an owner", right: "hard" }}
                accent={{ rule: "atOrAbove", threshold: 55 }}
                /* The caption COUNTS the accented set it is handed, so the
                   sentence and the marks come from one derivation. A country
                   with nothing heavy gets the other sentence rather than
                   "the no in terracotta". */
                caption={(accented) =>
                  accented.length === 0
                    ? `One scale across all ${numberWord(model.rules?.groups ?? 0)} groups, easiest at the top of each. Nothing here is heavy enough to cost you real time or money.`
                    : `One scale across all ${numberWord(model.rules?.groups ?? 0)} groups, easiest at the top of each. The ${numberWord(accented.length)} in terracotta are the ones that will actually cost you time or money here.`
                }
                readingLabel="reading"
                valueLabel="where it lands"
              />
            ) : (
              gap("rules", "what the rules are like")
            )}
          </ChapterSection>
        ) : null}

        {/* 05 , how long it takes to open. The distance between a company
            existing and a business that can take money is the whole chapter,
            and it is read off two figures rather than asserted. */}
        {at("opening") != null ? (
          <ChapterSection chapter={at("opening") as Chapter}>
            {model.opening != null ? (
              <>
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "The honest timeline", icon: "register-cost" as GlyphId }}
                  rows={[
                    { label: "Company registered", value: model.opening.daysToRegister },
                    {
                      label: "Able to take money",
                      value: model.opening.weeksToTakeMoney,
                      answer: true,
                    },
                    { label: "Total cash to set up", value: model.opening.cashToSetUp },
                  ]}
                />
                {/* THE VALUE COLUMN CARRIES WHICHEVER OF THE TWO THE STEP
                    ACTUALLY HAS. Printing the fee always put "no fee published"
                    beside the one step that sets the opening date, so the
                    column's most important row was the one absence in it. The
                    design does the same: four lanes print a price and the bank
                    lane prints its weeks. */}
                <Statblock
                  className="rise"
                  style={{ marginTop: 14 }}
                  header={{ label: "From decision to first sale" }}
                  rows={model.opening.steps.map(
                    (s): StatRow => ({
                      icon: (s.icon ?? undefined) as GlyphId | undefined,
                      label: s.label,
                      sub: s.bottleneck
                        ? "sets your opening date"
                        : s.cost != null && s.takes
                          ? s.takes
                          : undefined,
                      value: s.cost ?? s.takes ?? "not published",
                      answer: s.bottleneck,
                    }),
                  )}
                />
                {model.opening.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.opening.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("opening", "how long it takes to open")
            )}
          </ChapterSection>
        ) : null}

        {/* 06 , licences by trade. The per-trade total is DERIVED by counting
            everything that is not "none", so the count and the row it sits on
            cannot disagree. */}
        {at("licences") != null ? (
          <ChapterSection chapter={at("licences") as Chapter}>
            {model.licences != null ? (
              <>
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "What each trade needs", icon: "licence-specific" as GlyphId }}
                  rows={model.licences.rows.map(
                    (r): StatRow => ({
                      label: r.tradeName,
                      sub: r.slow.length
                        ? `slow: ${r.slow.map((s) => s.toLowerCase()).join(", ")}`
                        : undefined,
                      value: `${r.total} ${r.total === 1 ? "licence" : "licences"}`,
                    }),
                  )}
                />
                {model.licences.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.licences.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("licences", "which licences each trade needs")
            )}
          </ChapterSection>
        ) : null}

        {/* 07 , where margin goes. The column refuses to draw a partition that
            does not add to a hundred, which is the correct outcome: if part of
            a shop's money has gone missing, nobody should be reading a chart
            about it. */}
        {at("marginStack") != null ? (
          <ChapterSection chapter={at("marginStack") as Chapter}>
            {model.marginStack != null ? (
              <div className="grid g12" style={{ gap: 20, alignItems: "start" }}>
                <div className="rise">
                  <div className="lab" style={{ marginBottom: 12 }}>
                    Share of revenue, {model.marginStack.subject}
                  </div>
                  <ColSplit
                    height={300}
                    segments={model.marginStack.parts.map((p) => ({
                      label: p.label,
                      value: p.sharePct,
                      display: `${p.sharePct}%`,
                      tone: asColTone(p.tone),
                      kept: p.kept,
                    }))}
                  />
                </div>
                <div className="panel pad rise">
                  <Statblock
                    rail={false}
                    header={{
                      label: model.marginStack.decidedByLabel,
                      icon: "cost-breakdown" as GlyphId,
                    }}
                    rows={model.marginStack.decidedBy.map(
                      (p): StatRow => ({ label: p.label, value: `${p.sharePct}%` }),
                    )}
                  />
                  {/* The only sentence here that is not already a segment on
                      the column: what those lines take between them. */}
                  {model.marginStack.decidedBy.length ? (
                    <p className="note" style={{ margin: "10px 0 0" }}>
                      Between them those lines take {model.marginStack.decidedByPct} of
                      every 100 that crosses the till.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              gap("marginStack", "where the margin goes")
            )}
          </ChapterSection>
        ) : null}

        {/* 08 , what staff cost. The worked example is DERIVED from the wage
            and the surcharge printed above it, because those three numbers only
            hold together as arithmetic and a reader will check them. */}
        {at("staffCost") != null ? (
          <ChapterSection chapter={at("staffCost") as Chapter}>
            {model.staffCost != null ? (
              <>
                {/* The floor has no range. Printing "$24K, $24K to $24K" is a
                    range that says nothing, and the design draws that row flat
                    for the same reason. */}
                <Statblock
                  className="rise"
                  rail={false}
                  style={{ marginBottom: 10 }}
                  header={{ label: "Typical pay, and its usual range", icon: "min-wage" as GlyphId }}
                  rows={model.staffCost.payScale.map(
                    (r): StatRow => ({
                      label: r.label,
                      sub: r.floor ? "a full-time adult, no range" : `${r.lo} to ${r.hi}`,
                      value: r.typical,
                    }),
                  )}
                />
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "The part first-timers miss", icon: "wages" as GlyphId }}
                  rows={[
                    {
                      label: "On top of every wage",
                      value: model.staffCost.employerOnCost,
                      sub: "in contributions",
                    },
                    model.staffCost.workedExample
                      ? {
                          label: `A ${model.staffCost.workedExample.wage} hire really costs`,
                          value: model.staffCost.workedExample.reallyCosts,
                          answer: true,
                        }
                      : { label: "A worked hire", value: null },
                    {
                      label: model.staffCost.overtimeAfter
                        ? `Overtime, ${model.staffCost.overtimeAfter}`
                        : "Overtime",
                      value: model.staffCost.overtime,
                    },
                  ]}
                />
                {model.staffCost.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.staffCost.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("staffCost", "what staff cost")
            )}
          </ChapterSection>
        ) : null}

        {/* 09 , can you find and keep staff. One grid, one attribute: the
            mockup drew skilled workers and second-language speakers as one
            partition, which read as though one were a subset of the other. */}
        {at("staffSupply") != null ? (
          <ChapterSection chapter={at("staffSupply") as Chapter}>
            {model.staffSupply != null ? (
              <>
                {model.staffSupply.skilledInHundred != null ? (
                  <p className="note" style={{ margin: "0 0 10px" }}>
                    Of every hundred working people here,{" "}
                    {model.staffSupply.skilledInHundred} hold a degree or a skilled trade.
                  </p>
                ) : null}
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "The hiring reality", icon: "hiring" as GlyphId }}
                  rows={model.staffSupply.rows.map(
                    (r): StatRow => ({ label: r.label, value: r.value }),
                  )}
                />
                {model.staffSupply.shortages.length ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    Known shortages: {model.staffSupply.shortages.join(", ")}.
                  </p>
                ) : null}
                {model.staffSupply.note ? (
                  <p className="note" style={{ margin: "6px 0 0" }}>
                    {model.staffSupply.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("staffSupply", "whether you can find and keep staff")
            )}
          </ChapterSection>
        ) : null}

        {/* 10 , who has money to spend. */}
        {at("households") != null ? (
          <ChapterSection chapter={at("households") as Chapter}>
            {model.households != null ? (
              <>
                {model.households.split.length ? (
                  <div className="panel pad rise" style={{ marginBottom: 10 }}>
                    <div className="lab" style={{ marginBottom: 12 }}>
                      How a household spends a hundred
                    </div>
                    <SBar
                      total={model.households.split.reduce((a, p) => a + p.amount, 0)}
                      segments={model.households.split.map((p, i) => ({
                        label: p.label,
                        value: p.amount,
                        display: p.display,
                        tone: (["ink", "n2", "n3", "n4", "n5"][i] ?? "n4") as SBarTone,
                      }))}
                    />
                  </div>
                ) : null}
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "The customer, nationally", icon: "who-for" as GlyphId }}
                  rows={model.households.rows.map(
                    (r): StatRow => ({ label: r.label, sub: r.sub, value: r.value }),
                  )}
                />
              </>
            ) : (
              gap("households", "who has money to spend")
            )}
          </ChapterSection>
        ) : null}

        {/* 11 , how many people you can reach. */}
        {at("reach") != null ? (
          <ChapterSection chapter={at("reach") as Chapter}>
            {model.reach != null ? (
              <Statblock
                className="rise"
                rail={false}
                header={{
                  label: `People you can reach from ${model.reach.origin}`,
                  icon: "catchment" as GlyphId,
                }}
                rows={model.reach.rings.map(
                  (r): StatRow => ({ label: r.label, value: r.people }),
                )}
              />
            ) : (
              gap("reach", "how many people a site reaches")
            )}
          </ChapterSection>
        ) : null}

        {/* 12 , owner take-home by trade. The highlighted row is DERIVED by
            taking the maximum of what the owner keeps. */}
        {at("tradeTakeHome") != null ? (
          <ChapterSection chapter={at("tradeTakeHome") as Chapter}>
            {model.tradeTakeHome != null ? (
              <>
                <Statblock
                  className="rise"
                  header={{ label: "What the owner keeps", icon: "owner-keeps" as GlyphId }}
                  rows={model.tradeTakeHome.rows.map(
                    (r): StatRow => ({
                      icon: (r.icon ?? undefined) as GlyphId | undefined,
                      label: r.tradeName,
                      sub: `${r.revenue} revenue, ${r.costToOpen} to open, ${r.breakIn.toLowerCase()} to break into`,
                      value: `${r.ownerKeeps} kept`,
                      answer: r.top,
                    }),
                  )}
                />
                {model.tradeTakeHome.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.tradeTakeHome.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("tradeTakeHome", "what owners keep by trade")
            )}
          </ChapterSection>
        ) : null}

        {/* 13 , against neighbouring countries. Every axis is normalised so
            that higher is better for an owner, stated once rather than labelled
            at one pole with a word that means the opposite. */}
        {at("neighbours") != null ? (
          <ChapterSection chapter={at("neighbours") as Chapter}>
            {model.neighbours != null ? (
              <>
                <p className="note" style={{ margin: "0 0 10px", maxWidth: "74ch" }}>
                  A higher score is better for an owner on every one of these:{" "}
                  {model.neighbours.axes.map((a) => a.toLowerCase()).join(", ")}.
                </p>
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "Scored on each axis", icon: "compare" as GlyphId }}
                  rows={model.neighbours.rows.map(
                    (r): StatRow => ({
                      label: r.country,
                      sub: r.isThisCountry ? "this country" : undefined,
                      value: r.scores.join(" / "),
                      answer: r.isThisCountry,
                    }),
                  )}
                />
                {model.neighbours.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.neighbours.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("neighbours", "how this country compares with its neighbours")
            )}
          </ChapterSection>
        ) : null}

        {/* 14 , which trades are under-served. Which trades sit in the
            opportunity corner is DERIVED from their own coordinates, so the
            sentence cannot name a trade the chart puts somewhere else. */}
        {at("underServed") != null ? (
          <ChapterSection chapter={at("underServed") as Chapter}>
            {model.underServed != null ? (
              <>
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "Thin against the money", icon: "where-it-pays" as GlyphId }}
                  rows={[
                    {
                      label: "Thin on the ground, and money around",
                      value: model.underServed.opportunity.length
                        ? model.underServed.opportunity.map((o) => o.tradeName).join(", ")
                        : "nothing stands out",
                      answer: model.underServed.opportunity.length > 0,
                    },
                    {
                      label: "Everything else we judged",
                      value: model.underServed.rest.length
                        ? model.underServed.rest.map((o) => o.tradeName).join(", ")
                        : "nothing else",
                    },
                  ]}
                />
                {model.underServed.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.underServed.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("underServed", "which trades are under-served")
            )}
          </ChapterSection>
        ) : null}

        {/* 15 , the same business abroad. This country's column is chapter 07's
            stack, read from there, so the two chapters cannot draw different
            columns for the same country. */}
        {at("abroad") != null ? (
          <ChapterSection chapter={at("abroad") as Chapter}>
            {model.abroad != null ? (
              <>
                <div className="grid g2" style={{ gap: 32 }}>
                  <div className="rise">
                    <div className="lab" style={{ marginBottom: 12 }}>
                      {model.abroad.tradeName} in {model.abroad.here.country}
                    </div>
                    <ColSplit
                      height={260}
                      segments={model.abroad.here.parts.map((p) => ({
                        label: p.label,
                        value: p.sharePct,
                        display: `${p.sharePct}%`,
                        tone: asColTone(p.tone),
                        kept: p.kept,
                      }))}
                    />
                  </div>
                  <div className="rise">
                    <div className="lab" style={{ marginBottom: 12 }}>
                      The same, in {model.abroad.peer.country}
                    </div>
                    <ColSplit
                      height={260}
                      segments={model.abroad.peer.parts.map((p) => ({
                        label: p.label,
                        value: p.sharePct,
                        display: `${p.sharePct}%`,
                        tone: asColTone(p.tone),
                        kept: p.kept,
                      }))}
                    />
                  </div>
                </div>
                {model.abroad.hereKeeps != null && model.abroad.peerKeeps != null ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    The same trade keeps {model.abroad.peerKeeps}% in{" "}
                    {model.abroad.peer.country} against {model.abroad.hereKeeps}% here.
                  </p>
                ) : null}
                {model.abroad.note ? (
                  <p className="note" style={{ margin: "6px 0 0" }}>
                    {model.abroad.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("abroad", "the same business in another country")
            )}
          </ChapterSection>
        ) : null}

        {/* 16 , zones. The commonest honest answer is "none of this helps
            you", and saying it is more useful than an empty table. So this
            chapter renders its verdict even when it has no list. */}
        {at("zones") != null ? (
          <ChapterSection chapter={at("zones") as Chapter}>
            {model.zones != null ? (
              <>
                <div className="zonecard rise">
                  <GlyphIcon id={"free-zone" as GlyphId} size={24} />
                  <span className="t">{model.zones.verdict}</span>
                </div>
                {model.zones.zones.length ? (
                  <Statblock
                    className="rise"
                    rail={false}
                    style={{ marginTop: 10 }}
                    header={{ label: "What each one reaches" }}
                    rows={model.zones.zones.map(
                      (z): StatRow => ({
                        label: z.name,
                        sub: z.effect,
                        value: z.trades.length ? z.trades.join(", ") : "no high-street trade",
                      }),
                    )}
                  />
                ) : null}
              </>
            ) : (
              gap("zones", "the zones and special structures")
            )}
          </ChapterSection>
        ) : null}

        {/* 17 , stability and safety. */}
        {at("stability") != null ? (
          <ChapterSection chapter={at("stability") as Chapter}>
            {model.stability != null ? (
              <>
                {model.stability.ground.length ? (
                  <Statblock
                    className="rise"
                    rail={false}
                    style={{ marginBottom: 10 }}
                    header={{ label: "The ground, against the world median" }}
                    rows={model.stability.ground.map(
                      (g): StatRow => ({
                        label: g.label,
                        value: g.word,
                        /* Accented only when EXACTLY ONE reading is the costly
                           one. Two accents in a block is no accent, and the
                           block would silently drop the second anyway. */
                        answer:
                          g.costly && model.stability!.ground.filter((x) => x.costly).length === 1,
                      }),
                    )}
                  />
                ) : null}
                <Statblock
                  className="rise"
                  rail={false}
                  header={{ label: "What it costs you", icon: "safety" as GlyphId }}
                  rows={model.stability.rows.map(
                    (r): StatRow => ({ label: r.label, value: r.value }),
                  )}
                />
                {model.stability.note ? (
                  <p className="note" style={{ margin: "10px 0 0" }}>
                    {model.stability.note}
                  </p>
                ) : null}
              </>
            ) : (
              gap("stability", "how stable the ground under a lease is")
            )}
          </ChapterSection>
        ) : null}

        {/* 18 , the myth. Every figure in the supporting panel is read from
            chapter 05 or chapter 04, so a correction lands on both pages at
            once. */}
        {at("myth") != null ? (
          <ChapterSection chapter={at("myth") as Chapter}>
            {model.myth != null ? (
              <>
                <div className="panel rise" style={{ marginBottom: 10 }}>
                  <div className="pad">
                    <div className="lab" style={{ marginBottom: 10 }}>
                      What everyone says
                    </div>
                    <p className="note" style={{ margin: 0 }}>
                      {model.myth.claim}
                    </p>
                    <p className="note" style={{ margin: "10px 0 0" }}>
                      {model.myth.reality}
                    </p>
                    {model.myth.note ? (
                      <p className="note" style={{ margin: "10px 0 0" }}>
                        {model.myth.note}
                      </p>
                    ) : null}
                  </div>
                </div>
                {model.myth.rows.length ? (
                  <Statblock
                    className="rise"
                    rail={false}
                    header={{
                      label: model.myth.panelLabel ?? "What the numbers say",
                      icon: "myth-reality" as GlyphId,
                    }}
                    rows={model.myth.rows.map(
                      (r): StatRow => ({ label: r.label, value: r.value }),
                    )}
                  />
                ) : null}
              </>
            ) : (
              gap("myth", "the biggest myth about this country")
            )}
          </ChapterSection>
        ) : null}

        {/* 19 , the verdict. The chips restate figures printed above; none of
            them introduces a number that appears nowhere else. */}
        {at("verdict") != null ? (
          <ChapterSection chapter={at("verdict") as Chapter}>
            {model.verdict != null ? (
              <div className="take rise">
                <div className="v">{model.verdict.text}</div>
                {model.verdict.chips.length ? (
                  <div className="chips">
                    {model.verdict.chips.map((c) => (
                      <span className="chip" key={c.text}>
                        {c.icon ? <GlyphIcon id={c.icon as GlyphId} size={13} /> : null}
                        {c.text}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              gap("verdict", "our verdict on this country")
            )}
          </ChapterSection>
        ) : null}

        {/* 20 , the method ledger. The tier counts are COUNTED from the rows,
            never authored, because that claim is the one a reader is most
            entitled to check. */}
        {at("methodology") != null ? (
          <ChapterSection chapter={at("methodology") as Chapter}>
            {model.methodology != null ? (
              <>
                <Ledger
                  className="rise"
                  rows={model.methodology.rows.map((r) => ({
                    label: r.figure,
                    tier: r.tier as Tier,
                    how: r.how,
                  }))}
                />
                <p className="note" style={{ marginTop: 14, maxWidth: "78ch" }}>
                  {model.methodology.counts.measured} of these come from a published
                  record, {model.methodology.counts.built} we compute from published
                  records, and {model.methodology.counts.thin} are the thinnest kind,
                  where nobody publishes the figure and we say so rather than inventing
                  precision.
                </p>
              </>
            ) : (
              gap("methodology", "how we work this out")
            )}
          </ChapterSection>
        ) : null}

        {/* The closing band. Unnumbered, so it has no chapter head. Its figure
            is RESOLVED from the field it restates, so the band and the hero
            cannot disagree. */}
        {model.remember != null ? (
          <section className="ch">
            <div className="band rise">
              <div className="grid g12" style={{ gap: 32, alignItems: "center" }}>
                <div>
                  <div className="lab" style={{ marginBottom: 14 }}>
                    One thing to remember
                  </div>
                  <h3 style={{ fontSize: 22, lineHeight: 1.32, maxWidth: "26ch" }}>
                    {model.remember.text}
                  </h3>
                </div>
                {model.remember.figure ? (
                  <div style={{ textAlign: "center" }}>
                    <div
                      className="fig"
                      style={{ fontSize: 56, fontWeight: 600, lineHeight: 0.9, color: "var(--terra-bright)" }}
                    >
                      {model.remember.figure}
                    </div>
                    <div style={{ fontSize: 13, marginTop: 10 }}>
                      {model.remember.figureLabel}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* 21 , where to go next. A tile with no href renders flat, which is
            what the mockup does for pages not built yet. Inventing the URL
            would manufacture a dead link. */}
        {at("next") != null ? (
          <ChapterSection chapter={at("next") as Chapter}>
            {model.next != null ? (
              <div className="tiles rise">
                {model.next.tiles.map((t) =>
                  t.href ? (
                    <a href={t.href} key={t.label}>
                      <span className="t">
                        {t.icon ? <GlyphIcon id={t.icon as GlyphId} size={18} /> : null}
                        {t.label}
                      </span>
                      <span className="g">{t.gloss}</span>
                    </a>
                  ) : (
                    <span key={t.label}>
                      <span className="t">
                        {t.icon ? <GlyphIcon id={t.icon as GlyphId} size={18} /> : null}
                        {t.label}
                      </span>
                      <span className="g">{t.gloss}</span>
                    </span>
                  ),
                )}
              </div>
            ) : (
              gap("next", "where to go next")
            )}
          </ChapterSection>
        ) : null}

        {/* The trust band. Every reading is derived: the review month from the
            file's own meta, the business count from the hero, the trade count
            from chapter 12, the tier tally from chapter 20. The mockup printed
            "42 trades covered" beside a table of seven, which is what happens
            when a trust band is typed by hand. */}
        <section style={{ padding: "0 0 20px" }}>
          <div className="trust rise">
            <span className="t">
              <GlyphIcon id={"freshness" as GlyphId} size={18} />
              Reviewed <b>{model.trust.reviewedAt}</b>
            </span>
            {model.trust.businesses ? (
              <span className="t">
                <GlyphIcon id={"market-size" as GlyphId} size={18} />
                <b>{model.trust.businesses}</b> businesses
                {model.trust.tradesCovered != null ? (
                  <>
                    , <b>{model.trust.tradesCovered}</b> trades covered
                  </>
                ) : null}
              </span>
            ) : null}
            {model.trust.counts ? (
              <span className="t">
                <GlyphIcon id={"confidence" as GlyphId} size={18} />
                <b>{model.trust.counts.measured}</b> measured,{" "}
                <b>{model.trust.counts.built}</b> built, <b>{model.trust.counts.thin}</b>{" "}
                thin
              </span>
            ) : null}
          </div>
        </section>

        <footer style={{ padding: "40px 0 22px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
