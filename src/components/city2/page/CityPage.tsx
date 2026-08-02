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
import { CityDistrictMap } from "@/components/city2/CityDistrictMap";
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
              <div className="glass rise" style={{ padding: "32px 32px" }}>
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

        {/* 03 , the income spread. Three dumbbells, printed as a range with the
            median called out, because the middle of a spread is the number an
            operator prices against and the ends are what tells them how wide
            the market is. */}
        {at("incomeAndWealth") != null ? (
          <ChapterSection chapter={at("incomeAndWealth") as Chapter}>
            {model.incomeAndWealth != null ? (
              <>
                {model.incomeAndWealth.spread.length ? (
                  <div className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      {model.incomeAndWealth.spread.map((r) => (
                        <div className="row" key={r.label}>
                          <span className="nm">{r.label}</span>
                          <span className="v">
                            {r.median} <span className="s">{r.lo} to {r.hi}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="panel rise">
                  <div className="pad">
                    <div className="row">
                      <span className="nm">The top tenth against the middle earner</span>
                      <span className="v">
                        {model.incomeAndWealth.topTenthVsMiddle ?? "not published"}
                      </span>
                    </div>
                    <div className="row">
                      <span className="nm">Paid by card</span>
                      <span className="v">{model.incomeAndWealth.paidByCard ?? "not published"}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ChapterGap subject="household income and wealth" />
            )}
          </ChapterSection>
        ) : null}

        {/* 04 , visitors. The busiest and quietest months are DERIVED from the
            twelve-month index, never authored, so a city whose season runs the
            other way round reads correctly without anyone remembering to say
            so. */}
        {at("visitors") != null ? (
          <ChapterSection chapter={at("visitors") as Chapter}>
            {model.visitors != null ? (
              <>
                <div className="panel rise" style={{ marginBottom: 10 }}>
                  <div className="pad">
                    <div className="row">
                      <span className="nm">Visitors a year</span>
                      <span className="v">{model.visitors.count ?? "not published"}</span>
                    </div>
                    <div className="row">
                      <span className="nm">What they spend here</span>
                      <span className="v">{model.visitors.spend ?? "not published"}</span>
                    </div>
                    <div className="row">
                      <span className="nm">Each, on average</span>
                      <span className="v">{model.visitors.spendPerVisitor ?? "not published"}</span>
                    </div>
                    <div className="row">
                      <span className="nm">Share of all spend in the city</span>
                      <span className="v">{model.visitors.shareOfCitySpend ?? "not published"}</span>
                    </div>
                  </div>
                </div>
                {model.visitors.peak && model.visitors.trough ? (
                  <p className="k" style={{ margin: "0 0 6px" }}>
                    Busiest in {model.visitors.peak.month}, at {model.visitors.peak.index} against a
                    year of 100. Quietest in {model.visitors.trough.month}, at{" "}
                    {model.visitors.trough.index}.
                  </p>
                ) : (
                  <p className="k" style={{ margin: "0 0 6px" }}>
                    No month-by-month visitor count is published for this city, so the busy and
                    quiet parts of the year are not stated here.
                  </p>
                )}
                {model.visitors.topDistrict ? (
                  <p className="k" style={{ margin: 0 }}>
                    Visitor money lands hardest in {model.visitors.topDistrict.name}
                    {model.visitors.topDistrict.share
                      ? `, at ${model.visitors.topDistrict.share} of what is spent there`
                      : ", though no share is published for it"}
                    .
                  </p>
                ) : null}
              </>
            ) : (
              <ChapterGap subject="visitor numbers through the year" />
            )}
          </ChapterSection>
        ) : null}
        {/* 05 , POPs. Ratified 2026-06-22, filled in the contract and the file
            since the city page was built, and rendering as a stated gap until
            now. The spending read is the part an operator needs: who is here
            matters only once you know what they can spend. */}
        {at("people") != null ? (
          <ChapterSection chapter={at("people") as Chapter}>
            {model.people != null ? (
              <>
                {model.people.residents ? (
                  <div className="row">
                    <span className="nm">People living here</span>
                    <span className="v">{model.people.residents}</span>
                  </div>
                ) : null}

                {model.people.bands.length ? (
                  <div className="panel rise" style={{ margin: "10px 0" }}>
                    <div className="pad">
                      {model.people.bands.map((b) => (
                        <div className="row" key={b.label}>
                          <span className="nm">{b.label}</span>
                          <span className="v">{b.sharePct}% of households</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {model.people.types.map((t) => (
                  <div key={t.key} className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      <div className="row">
                        <span className="nm">
                          {t.icon ? <GlyphIcon id={t.icon as GlyphId} size={16} /> : null}
                          {t.name}
                        </span>
                        <span className="v">{t.sharePct}%</span>
                      </div>
                      <div className="row">
                        <span className="nm">What they can spend</span>
                        <span className="v">
                          {t.spendingPower}
                          {t.income ? ` , ${t.income} after tax` : ""}
                        </span>
                      </div>
                      <p className="k" style={{ margin: "8px 0 0" }}>
                        {t.ageRange}. {t.tenure}.
                        {t.buys.length ? ` Spends on ${t.buys.map((b) => b.toLowerCase()).join(", ")}.` : ""}
                        {t.favours.length ? ` Good for ${t.favours.join(", ")}.` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <ChapterGap subject="who lives here and what they can spend" />
            )}
          </ChapterSection>
        ) : null}
        {/* 06 , what space costs. Three sizes with what each one costs, the
            split of where that money goes, and one worked example in a named
            trade so the reader can attach the abstraction to a room. */}
        {at("spaceCosts") != null ? (
          <ChapterSection chapter={at("spaceCosts") as Chapter}>
            {model.spaceCosts != null ? (
              <>
                {model.spaceCosts.sizes.length ? (
                  <div className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      {model.spaceCosts.sizes.map((u) => (
                        <div className="row" key={u.label}>
                          <span className="nm">
                            {u.label}
                            <span className="s">{u.description}</span>
                          </span>
                          <span className="v">
                            {u.area ?? "size not stated"}
                            {u.annualCost ? `, ${u.annualCost} a year` : ", not priced"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {model.spaceCosts.costSplit.length ? (
                  <div className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      {model.spaceCosts.costSplit.map((c) => (
                        <div className="row" key={c.label}>
                          <span className="nm">{c.label}</span>
                          <span className="v">{c.value}</span>
                        </div>
                      ))}
                      <p className="k" style={{ margin: "8px 0 0" }}>
                        Where every 100 of a unit&rsquo;s yearly cost goes.
                      </p>
                    </div>
                  </div>
                ) : null}

                {model.spaceCosts.anchorTrade ? (
                  <p className="k" style={{ margin: "0 0 6px" }}>
                    A {model.spaceCosts.anchorTrade.tradeName.toLowerCase()} here takes about{" "}
                    {model.spaceCosts.anchorTrade.area ?? "an unstated amount of space"}
                    {model.spaceCosts.anchorTrade.demandPerDay
                      ? `, does ${model.spaceCosts.anchorTrade.demandPerDay}`
                      : ""}
                    {model.spaceCosts.anchorTrade.annualSpaceCost
                      ? `, and pays ${model.spaceCosts.anchorTrade.annualSpaceCost} a year to stand there`
                      : ""}
                    .
                  </p>
                ) : null}

                {model.spaceCosts.note ? (
                  <p className="k" style={{ margin: 0 }}>
                    {model.spaceCosts.note}
                  </p>
                ) : null}
              </>
            ) : (
              <ChapterGap subject="what space costs" />
            )}
          </ChapterSection>
        ) : null}
        {/* 07 , what owners keep, across trades. Rows come from the reconciled
            cell files where one exists; see buildTradeEconomics for why that
            matters and what it already fixed. */}
        {at("tradeEconomics") != null ? (
          <ChapterSection chapter={at("tradeEconomics") as Chapter}>
            {model.tradeEconomics != null ? (
              <>
                {model.tradeEconomics.rows.map((r) => (
                  <div key={r.tradeSlug} className="panel rise" style={{ marginBottom: 8 }}>
                    <div className="pad">
                      <div className="row">
                        <span className="nm">{r.tradeName}</span>
                        <span className="v">{r.ownerKeeps} kept</span>
                      </div>
                      <div className="row">
                        <span className="nm">Revenue</span>
                        <span className="v">{r.revenue}</span>
                      </div>
                      <div className="row">
                        <span className="nm">Cost to open</span>
                        <span className="v">{r.costToOpen}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="k" style={{ margin: "10px 0 0" }}>
                  {model.tradeEconomics.reconciled} of {model.tradeEconomics.rows.length} of these
                  trades has a page of its own where the arithmetic is shown line by line. The rest
                  are the city&rsquo;s own figures and are not yet reconciled against a trade.
                </p>
              </>
            ) : (
              <ChapterGap subject="what owners keep by trade" />
            )}
          </ChapterSection>
        ) : null}
        {/* 08 , rent by district. The SAME list chapter 10 renders, read as a
            scale rather than as cards, so the two can never print different
            multiples for one place. A district with no priced unit says so
            instead of dropping out, or three of six missing would read as a
            complete list. */}
        {at("districtRent") != null ? (
          <ChapterSection chapter={at("districtRent") as Chapter}>
            {model.districtRent != null ? (
              <>
                <div className="panel rise">
                  <div className="pad">
                    {model.districtRent.rows.map((r) => (
                      <div className="row" key={r.slug}>
                        <span className="nm">{r.name}</span>
                        <span className="v">
                          {r.rent ?? "not priced"}
                          {r.annualUnitCost ? (
                            <span className="s">{r.annualUnitCost} a year</span>
                          ) : (
                            <span className="s">not priced here</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="k" style={{ margin: "10px 0 0" }}>
                  Rent against the city rate, where 1.0 is the city rate itself. The yearly figure
                  prices {model.districtRent.unitPriced}, and {model.districtRent.priced} of{" "}
                  {model.districtRent.rows.length} districts carry a price for it.
                </p>
              </>
            ) : (
              <ChapterGap subject="rent by district" />
            )}
          </ChapterSection>
        ) : null}
        {/* 09 , which district suits which trade. The best district per row is
            DERIVED from the `best` cell, never authored twice. */}
        {at("tradeFit") != null ? (
          <ChapterSection chapter={at("tradeFit") as Chapter}>
            {model.tradeFit != null ? (
              <>
                {model.tradeFit.rows.map((r) => (
                  <div key={r.tradeSlug} className="panel rise" style={{ marginBottom: 8 }}>
                    <div className="pad">
                      <div className="row">
                        <span className="nm">{r.tradeName}</span>
                        <span className="v">{r.best ? `Best in ${r.best}` : "no clear best area"}</span>
                      </div>
                      {/* "good" only. Including "best" here printed the top
                          district twice, once above and once in this list. */}
                      <p className="k" style={{ margin: "6px 0 0" }}>
                        {r.levels.some((l) => l.level === "good")
                          ? `Also works in ${r.levels
                              .filter((l) => l.level === "good")
                              .map((l) => l.district)
                              .join(", ")}.`
                          : "Nowhere else here suits it particularly."}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="k" style={{ margin: "10px 0 0" }}>
                  Judged across {model.tradeFit.districts.length} districts: rent against the trade
                  each one passes. Our reading, not a measurement.
                </p>
              </>
            ) : (
              <ChapterGap subject="the best area for each trade" />
            )}
          </ChapterSection>
        ) : null}
        {/* 10 , the districts. Three figures joined: rent, the wealth band and
            the population mix, with the favoured trades derived from the mix.
            Plain on purpose: the founder's bar for now is that every section
            exists everywhere, not that it is beautiful. */}
        {at("districts") != null ? (
          <ChapterSection chapter={at("districts") as Chapter}>
            {model.districts != null ? (
              <>
                {/* Decision 17, map v1: one measure, tap for detail. It sits
                    above the list rather than replacing it, because the list
                    carries every fact the map does and works with no
                    JavaScript, no WebGL and no network. Districts with no
                    point are simply absent from the map and still in the
                    list. */}
                <CityDistrictMap
                  cityName={model.meta.city}
                  pins={model.districts.rows
                    .filter((d) => d.centre != null)
                    .map((d) => ({
                      slug: d.slug,
                      name: d.name,
                      lat: (d.centre as { lat: number }).lat,
                      lng: (d.centre as { lng: number }).lng,
                      band: d.residentBand,
                      bandLabel: d.resident,
                      rent: d.rent,
                    }))}
                />
                {model.districts.rows.map((d) => (
                  <div key={d.slug} className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      <div className="row">
                        <span className="nm">
                          {d.icon ? <GlyphIcon id={d.icon as GlyphId} size={16} /> : null}
                          {d.name}
                        </span>
                        <span className="v">{d.rent ?? "rent not priced"}</span>
                      </div>
                      <p className="k" style={{ margin: "6px 0 10px" }}>
                        {d.blurb}
                      </p>
                      <div className="row">
                        <span className="nm">Who lives here</span>
                        <span className="v">{d.resident ?? "not read yet"}</span>
                      </div>
                      <div className="row">
                        <span className="nm">Here during the working day</span>
                        <span className="v">{d.daytime ?? "not read yet"}</span>
                      </div>
                      {d.mix.length ? (
                        <p className="k" style={{ margin: "10px 0 0" }}>
                          Mostly {d.mix.map((m) => `${m.name.toLowerCase()} ${m.sharePct}%`).join(", ")}.
                          {d.scarce.length
                            ? ` Few ${d.scarce.map((s) => s.toLowerCase()).join(" or ")}.`
                            : ""}
                        </p>
                      ) : (
                        <p className="k" style={{ margin: "10px 0 0" }}>
                          Who lives here is not filled in for this district yet.
                        </p>
                      )}
                      {d.favours.length ? (
                        <p className="k" style={{ margin: "6px 0 0" }}>
                          That mix tilts towards {d.favours.join(", ")}.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
                {model.districts.note ? (
                  <p className="k" style={{ margin: "12px 0 0" }}>
                    {model.districts.note}
                  </p>
                ) : null}
              </>
            ) : (
              <ChapterGap subject="the districts" />
            )}
          </ChapterSection>
        ) : null}
        {/* 11 , four readings and which way each is moving. The direction word
            prints only where no measured change exists; where one does, its own
            sign already says which way. */}
        {at("direction") != null ? (
          <ChapterSection chapter={at("direction") as Chapter}>
            {model.direction != null ? (
              <div className="panel rise">
                <div className="pad">
                  {model.direction.tiles.map((t) => (
                    <div className="row" key={t.label}>
                      <span className="nm">
                        {t.label}
                        <span className="s">{t.caption}</span>
                      </span>
                      <span className="v">{t.change ?? (t.direction === "up" ? "rising" : "falling")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ChapterGap subject="where the city is heading" />
            )}
          </ChapterSection>
        ) : null}

        {/* 12 , the myth. The two gaps at the bottom are DERIVED from the four
            numbers above them, and the whole chapter lands only because they are
            so far apart. */}
        {at("myths") != null ? (
          <ChapterSection chapter={at("myths") as Chapter}>
            {model.myths != null ? (
              <>
                {model.myths.claim ? (
                  <div className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      <div className="row">
                        <span className="nm">The claim</span>
                        <span className="v">{model.myths.claim}</span>
                      </div>
                      <div className="row">
                        <span className="nm">What is actually true</span>
                        <span className="v">{model.myths.reality}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {model.myths.comparison ? (
                  <div className="panel rise">
                    <div className="pad">
                      <div className="row">
                        <span className="nm">
                          {model.myths.comparison.tradeName} revenue
                          <span className="s">{model.myths.comparison.hereCity}</span>
                        </span>
                        <span className="v">{model.myths.comparison.hereRevenue}</span>
                      </div>
                      <div className="row">
                        <span className="nm">
                          The same, in {model.myths.comparison.peerCity}
                        </span>
                        <span className="v">{model.myths.comparison.peerRevenue}</span>
                      </div>
                      <div className="row">
                        <span className="nm">What the owner keeps here</span>
                        <span className="v">{model.myths.comparison.hereKeeps}</span>
                      </div>
                      <div className="row">
                        <span className="nm">
                          What they keep in {model.myths.comparison.peerCity}
                        </span>
                        <span className="v">{model.myths.comparison.peerKeeps}</span>
                      </div>
                      {model.myths.comparison.revenueGapPct != null &&
                      model.myths.comparison.keepsGapPct != null ? (
                        <p className="k" style={{ margin: "8px 0 0" }}>
                          {model.myths.comparison.revenueGapPct}% more crosses the till here, and
                          the owner keeps {model.myths.comparison.keepsGapPct}% more.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {model.myths.note ? (
                  <p className="k" style={{ margin: "10px 0 0" }}>
                    {model.myths.note}
                  </p>
                ) : null}
              </>
            ) : (
              <ChapterGap subject="the common myths" />
            )}
          </ChapterSection>
        ) : null}

        {/* 13 , peer cities. This city's own row is found by slug and prints
            "level", because a city is not zero percent of itself. */}
        {at("peers") != null ? (
          <ChapterSection chapter={at("peers") as Chapter}>
            {model.peers != null ? (
              <>
                <div className="panel rise">
                  <div className="pad">
                    {model.peers.rows.map((r) => (
                      <div className="row" key={r.city}>
                        <span className="nm">
                          {r.city}
                          {r.isThisCity ? <span className="s">this city</span> : null}
                        </span>
                        <span className="v">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="k" style={{ margin: "10px 0 0" }}>
                  Commercial rent against {model.meta.city}, for the same room.
                </p>
              </>
            ) : (
              <ChapterGap subject="how this city compares with its peers" />
            )}
          </ChapterSection>
        ) : null}

        {/* 14 , what to watch. A pressure with a known direction and no
            published magnitude prints its word, not an invented number. */}
        {at("watch") != null ? (
          <ChapterSection chapter={at("watch") as Chapter}>
            {model.watch != null ? (
              <>
                {model.watch.pressures.length ? (
                  <div className="panel rise" style={{ marginBottom: 10 }}>
                    <div className="pad">
                      {model.watch.pressures.map((p) => (
                        <div className="row" key={p.label}>
                          <span className="nm">{p.label}</span>
                          <span className="v">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {model.watch.localKnowledge.length ? (
                  <div className="panel rise">
                    <div className="pad">
                      <div className="hd">
                        <GlyphIcon id={"watch" as GlyphId} size={18} />
                        What people trading here know
                      </div>
                      {model.watch.localKnowledge.map((line) => (
                        <p className="k" style={{ margin: "6px 0 0" }} key={line}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <ChapterGap subject="what to watch" />
            )}
          </ChapterSection>
        ) : null}

        {/* 15 , operators. A number beside a quote prints only when the file
            says what it measures. One in the London file does not, and it is
            not printed. */}
        {at("voices") != null ? (
          <ChapterSection chapter={at("voices") as Chapter}>
            {model.voices != null ? (
              <>
                {model.voices.quotes.map((q) => (
                  <div className="panel rise" style={{ marginBottom: 8 }} key={q.quote}>
                    <div className="pad">
                      <p className="k" style={{ margin: 0 }}>
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <div className="row" style={{ marginTop: 8 }}>
                        <span className="nm">
                          {q.trade}
                          <span className="s">{q.district}</span>
                        </span>
                        {q.pull ? (
                          <span className="v">
                            {q.pull}
                            {q.pullNote ? <span className="s">{q.pullNote}</span> : null}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <ChapterGap subject="what operators say" />
            )}
          </ChapterSection>
        ) : null}

        {/* 16 , the verdict. The chips restate figures printed above; none of
            them introduces a number that appears nowhere else. */}
        {at("verdict") != null ? (
          <ChapterSection chapter={at("verdict") as Chapter}>
            {model.verdict != null ? (
              <div className="panel rise">
                <div className="pad">
                  <p className="k" style={{ margin: 0 }}>
                    {model.verdict.text}
                  </p>
                  {model.verdict.chips.length ? (
                    <div style={{ marginTop: 10 }}>
                      {model.verdict.chips.map((c) => (
                        <span className="tag" key={c} style={{ marginRight: 8 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <ChapterGap subject="the verdict" />
            )}
          </ChapterSection>
        ) : null}

        {/* 17 , the method ledger. The tier counts are COUNTED from the rows,
            never authored, because that claim is the one a reader is most
            entitled to check. */}
        {at("methodology") != null ? (
          <ChapterSection chapter={at("methodology") as Chapter}>
            {model.methodology != null ? (
              <>
                <div className="panel rise">
                  <div className="pad">
                    {model.methodology.rows.map((r) => (
                      <div className="row" key={r.figure}>
                        <span className="nm">
                          {r.figure}
                          <span className="s">{r.how}</span>
                        </span>
                        <span className="v">{r.tier}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="k" style={{ margin: "10px 0 0" }}>
                  {model.methodology.counts.measured} of these are measured,{" "}
                  {model.methodology.counts.built} are built from published inputs, and{" "}
                  {model.methodology.counts.thin} are the thinnest kind, where nobody publishes the
                  figure and we say so.
                </p>
              </>
            ) : (
              <ChapterGap subject="how we work this out" />
            )}
          </ChapterSection>
        ) : null}

        {/* The closing band. Unnumbered, so it has no chapter head. Its figure
            is RESOLVED from the field it restates, so the band and the chapter
            it quotes cannot disagree. */}
        {model.remember != null ? (
          <section className="glass rise" style={{ padding: "26px 32px", margin: "18px 0" }}>
            <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
              {model.remember.text}
            </p>
            {model.remember.figure ? (
              <div className="answer" style={{ marginTop: 16 }}>
                <div className="num fig" style={{ fontSize: "clamp(30px,4vw,44px)" }}>
                  {model.remember.figure}
                </div>
                <div className="l">{model.remember.figureLabel}</div>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* 18 , where to go next. A tile with no href renders flat, which is
            what the mockup does for pages not built yet. Inventing the URL
            would manufacture a dead link. */}
        {at("next") != null ? (
          <ChapterSection chapter={at("next") as Chapter}>
            {model.next != null ? (
              <div className="panel rise">
                <div className="pad">
                  {model.next.tiles.map((t) => (
                    <div className="row" key={t.label}>
                      <span className="nm">
                        {t.icon ? <GlyphIcon id={t.icon as GlyphId} size={16} /> : null}
                        {t.href ? <a href={t.href}>{t.label}</a> : t.label}
                      </span>
                      <span className="v">{t.gloss}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ChapterGap subject="where to go next" />
            )}
          </ChapterSection>
        ) : null}

        <footer style={{ padding: "40px 0 22px" }}>
          <span className="tag">Margin Atlas</span>
        </footer>
      </div>
    </div>
  );
}
