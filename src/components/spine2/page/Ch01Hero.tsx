/**
 * Chapter 01 , the answer.
 *
 * The framing decision this chapter carries (SCHEMA-REPORT option A,
 * model-first with the measured room beside it): the page states plainly
 * which room it is describing, and the typical room's revenue sits in the
 * same panel so the two can never be confused. The old line, that the modelled
 * room is what the typical room does, was false by a third.
 *
 * The answer figure, the marker on the measured spread and one panel row move
 * with the slider, so those three live in the store island; everything else
 * here is server-rendered.
 */
import * as React from "react";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { HeroModel } from "@/lib/cells/spine2_adapter";
import { HeroAnswer, HeroPanel } from "./store";

export function Ch01Hero({
  hero,
  methodAnchor,
}: {
  hero: HeroModel;
  methodAnchor: string | null;
}) {
  const sitesRounded = `about ${Math.round(hero.sites / 1000)},000`;

  return (
    <section id="ch-01" style={{ padding: "30px 0 0" }}>
      <div className="glass rise" style={{ padding: "38px 38px 30px" }}>
        <div className="grid g12" style={{ gap: 42, alignItems: "center" }}>
          <div>
            <div className="crumb">
              <GlyphIcon id="trade-restaurant" size={13} />
              <span>{hero.crumb.trade}</span>
              <span className="d" />
              <span>{hero.crumb.city}</span>
              <span className="d" />
              <span>{hero.crumb.country}</span>
            </div>
            <h1 style={{ marginTop: 18, maxWidth: "15ch" }}>{hero.title}</h1>
            <p className="texture">
              There are <b>{sitesRounded}</b> of them, and the typical one takes{" "}
              <b>{hero.medianRevenue}</b> a year. This page models a{" "}
              <b>{hero.floorAreaSqm} m&sup2;</b> room taking{" "}
              <b>{hero.modelRevenue}</b>, the top {hero.topShare}% of the trade,
              because that is roughly what it takes to pay an owner properly.
            </p>
            <HeroAnswer hero={hero} />
          </div>

          <div className="panel pad">
            <HeroPanel hero={hero} />
            <p className="note" style={{ marginTop: 15, fontSize: "12.5px" }}>
              <b>The typical room does not pay its owner well.</b> That is why
              the room modelled here is not the typical one, and why the page
              says so wherever the two figures sit together.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--hair)",
          }}
        >
          {/* The freshness tag STAYS. The tier breakdown that used to follow it
              ("3 of 7 lines measured, 3 built, 1 thin, with the working shown in
              full") was removed on the founder's instruction, 2026-07-26: "That's
              very bad ... There is no need for an idiotic disclaimer, please."
              It lives in the method chapter, which is where a reader who wants it
              goes looking. `hero.tierLine` and `methodAnchor` are still built by
              the adapter and are still used there. */}
          <span className="tag">Reviewed {hero.reviewedAt}</span>
        </div>
      </div>
    </section>
  );
}
