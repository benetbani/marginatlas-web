/**
 * src/components/city2/page/CityPage.tsx
 *
 * The city page. Eighteen chapters, always, in every city.
 *
 * The assembly is written against the FULL spine from its first commit, so a
 * chapter that is not yet ported renders a stated gap rather than being absent
 * from the file. That is deliberate and it is cheap: when a chapter lands, one
 * ternary changes and nothing else moves. It also means the page's shape is
 * correct today, which is the founder's rule , a page is always complete and
 * never varies by place.
 *
 * It reuses the spine-2 component kit and the `.av2` stylesheet rather than
 * growing a second one. Verified before relying on it: the city mockup speaks
 * the same vocabulary as the trade mockup (`panel`, `pad`, `rise`, `chhead`,
 * `chnum`, `itile`, `gi-*`, `row`, `nm`, `v`, `fig`, `k`), so the two page types
 * are one visual product by construction rather than by discipline.
 */
import * as React from "react";

import { ChapterSection, type Chapter } from "@/components/spine2/page/ChapterHead";
import { ChapterGap } from "@/components/spine2/page/ChapterGap";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { RulerColumn, type RulerReading } from "@/components/spine2/RulerColumn";
import type { CityPageModel, CityChapterId } from "@/lib/cities/city_adapter";

import "@/styles/atlas-spine.css";

export function CityPage({ model }: { model: CityPageModel }) {
  const byId = new Map(model.chapters.map((c) => [c.id, c]));
  const at = (id: CityChapterId): Chapter | null =>
    (byId.get(id) as unknown as Chapter) ?? null;

  /** A chapter that exists in the spine but has no port yet. */
  const gap = (id: CityChapterId, subject: string) =>
    at(id) != null ? (
      <ChapterSection chapter={at(id) as Chapter}>
        <ChapterGap subject={subject} />
      </ChapterSection>
    ) : null;

  return (
    <div className="av2">
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Where you are">
              <a href={`/${model.meta.countrySlug}`}>{model.meta.country}</a>
              <span className="s">&rsaquo;</span>
              <a href={model.meta.urlPath}>{model.meta.city}</a>
            </nav>
          </div>
        </header>

        {/* 01 */}
        {at("hero") != null ? (
          <ChapterSection chapter={at("hero") as Chapter}>
            {model.hero != null ? (
              <div className="glass rise" style={{ padding: "32px 34px" }}>
                <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
                  <div>
                    <div className="crumb">
                      <span>{model.hero.city}</span>
                      <span className="d" />
                      <span>{model.hero.country}</span>
                    </div>
                    <h1 style={{ marginTop: 16, maxWidth: "13ch" }}>
                      Opening a business in {model.hero.city}
                    </h1>
                    <div className="answer" style={{ marginTop: 22 }}>
                      <div
                        className="num fig"
                        style={{ fontSize: "clamp(42px,5.6vw,62px)" }}
                      >
                        {model.hero.headline}
                      </div>
                      <div className="l">{model.hero.headlineLabel}</div>
                    </div>
                  </div>
                  <div className="panel pad">
                    <div className="statblock">
                      <div className="hd">
                        <GlyphIcon id={"scorecard" as GlyphId} size={18} />
                        {model.hero.city} at a glance
                      </div>
                      {model.hero.glance.map((g) => (
                        <div className="row" key={g.label}>
                          <span className="nm">
                            {g.label}
                            {g.sub ? <span className="s">{g.sub}</span> : null}
                          </span>
                          {/* A glance row with no figure states its absence
                              rather than vanishing, so the panel is four rows
                              tall in every city. */}
                          <span className="v">{g.value ?? "not published"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ChapterGap subject="the headline figure" />
            )}
          </ChapterSection>
        ) : null}

        {/* 02 , the seven-number ruler. Reuses the trade page's dot ruler, which
            is the same object the mockup draws. */}
        {at("scorecard") != null ? (
          <ChapterSection chapter={at("scorecard") as Chapter}>
            {model.scorecard != null ? (
              <RulerColumn
                className="rise"
                mark="dot"
                readings={model.scorecard.rows.map(
                  (r): RulerReading => ({
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
                readingLabel="reading"
                valueLabel="value"
              />
            ) : (
              <ChapterGap subject="the seven key numbers" />
            )}
          </ChapterSection>
        ) : null}

        {gap("incomeAndWealth", "household income and wealth")}
        {gap("visitors", "visitor numbers through the year")}
        {gap("people", "who lives here and what they can spend")}
        {gap("spaceCosts", "what space costs")}
        {gap("tradeEconomics", "what owners keep by trade")}
        {gap("districtRent", "rent by district")}
        {gap("tradeFit", "the best area for each trade")}
        {gap("districts", "the districts")}
        {gap("direction", "where the city is heading")}
        {gap("myths", "the common myths")}
        {gap("peers", "how this city compares with its peers")}
        {gap("watch", "what to watch")}
        {gap("voices", "what operators say")}
        {gap("verdict", "the verdict")}
        {gap("methodology", "how we work this out")}
        {gap("next", "where to go next")}

        <footer style={{ padding: "40px 0 24px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
