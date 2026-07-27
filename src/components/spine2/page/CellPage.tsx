/**
 * src/components/spine2/page/CellPage.tsx
 *
 * The trade page: the whole cell spine, assembled from one cell file.
 *
 * Order is the frozen mockup's order. The numbers are not: a chapter whose
 * data the file does not carry never mounts, and the spine is renumbered so
 * the reader never meets a gap where a section used to be (M9). Three
 * chapters are absent for every cell at launch and say why in the report:
 * the peer-city strip has no peer cells to compare against, the operator
 * voices are not in the schema, and nothing measures this trade against the
 * same trade worldwide yet.
 *
 * Two deliberate divergences from the frozen spec, both PORT-CONTRACT calls:
 *   M2  , the masthead wordmark is a link to the lattice root, and the flag
 *         control is a button, because it does something rather than going
 *         somewhere.
 *   M6  , the cash curve's second, unlabelled dashed series is gone.
 *
 * Everything here is a server component except the store island, which wraps
 * the chapter list and takes the server-rendered chapters straight through as
 * children.
 */
import * as React from "react";
import Link from "next/link";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { Band } from "@/components/spine2/Band";
import type { CellPageModel, ChapterId } from "@/lib/cells/spine2_adapter";

import { ChapterSection, type Chapter } from "./ChapterHead";
import { ChapterGap } from "./ChapterGap";
import { CellStoreProvider } from "./store";
import { Ch01Hero } from "./Ch01Hero";
import { Ch02Calculator } from "./Ch02Calculator";
import { Ch03Keep } from "./Ch03Keep";
import { Ch04Bill } from "./Ch04Bill";
import { Ch05Day } from "./Ch05Day";
import { Ch06Money } from "./Ch06Money";
import { Ch07Floor } from "./Ch07Floor";
import { Ch08Team } from "./Ch08Team";
import { Ch09Opening } from "./Ch09Opening";
import { Ch10Year } from "./Ch10Year";
import { Ch11FirstYear } from "./Ch11FirstYear";
import { Ch12Survival } from "./Ch12Survival";
import { Ch13Cities } from "./Ch13Cities";
import { Ch15Watch } from "./Ch15Watch";
import { Ch17Verdict } from "./Ch17Verdict";
import { Ch18Method } from "./Ch18Method";
import { Ch19Words } from "./Ch19Words";
import { Ch20Questions } from "./Ch20Questions";
import { Ch21Next } from "./Ch21Next";

function JumpNav({ chapters }: { chapters: Chapter[] }) {
  const items = chapters.map((c) => (
    <li key={c.anchor}>
      <a href={`#${c.anchor}`}>
        <span className="n">{c.num}</span>
        <span className="t">{c.title}</span>
      </a>
    </li>
  ));

  return (
    <nav className="jump" aria-label="Chapters">
      <ol className="jumprail">{items}</ol>
      <details className="jumpsheet">
        <summary className="jchip">
          <span className="jc-n">{chapters.length}</span>
          <span className="jc-t">chapters</span>
        </summary>
        <ol className="jlist">{items}</ol>
      </details>
    </nav>
  );
}

export function CellPage({ model }: { model: CellPageModel }) {
  const byId = new Map<ChapterId, Chapter>(
    model.chapters.map((c) => [c.id, { num: c.num, title: c.title, icon: c.icon, anchor: c.anchor }]),
  );
  const at = (id: ChapterId): Chapter | null => byId.get(id) ?? null;

  const methodChapter = at("method");
  const countryHref = `/${model.meta.country.slug}`;
  const cityHref = `/${model.meta.country.slug}/${model.meta.city.slug}`;

  return (
    <div className={`av2 ${spineFontVariables}`}>
      <div className="skyline" />

      <div className="wrap">
        <header className="mast">
          <div className="in">
            <Link href="/" className="brand">
              <span className="m" />
              Margin Atlas
            </Link>
            <nav className="lat">
              <Link href={countryHref}>{model.meta.country.name}</Link>
              <span className="s">&rsaquo;</span>
              <Link href={cityHref}>{model.meta.city.name}</Link>
              <span className="s">&rsaquo;</span>
              <span className="on">{model.meta.trade.name}</span>
            </nav>
          </div>
        </header>

        <JumpNav chapters={model.chapters} />

        <CellStoreProvider model={model.store}>
          {model.hero != null ? (
            <Ch01Hero hero={model.hero} methodAnchor={methodChapter?.anchor ?? null} />
          ) : null}

          {at("calculator") != null ? (
            <ChapterSection chapter={at("calculator") as Chapter}>
              {model.calculator != null ? (
                <Ch02Calculator calculator={model.calculator} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("keep") != null ? (
            <ChapterSection chapter={at("keep") as Chapter}>
              {model.keep != null ? (
                <Ch03Keep
                  keep={model.keep}
                  noun={model.meta.trade.noun}
                  city={model.meta.city.name}
                />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("bill") != null ? (
            <ChapterSection chapter={at("bill") as Chapter}>
              {model.bill != null ? (
                <Ch04Bill bill={model.bill} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("day") != null ? (
            <ChapterSection chapter={at("day") as Chapter}>
              {model.day != null ? (
                <Ch05Day day={model.day} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("money") != null ? (
            <ChapterSection chapter={at("money") as Chapter}>
              {model.money != null ? (
                <Ch06Money money={model.money} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("floor") != null ? (
            <ChapterSection chapter={at("floor") as Chapter}>
              {model.floor != null ? (
                <Ch07Floor floor={model.floor} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("team") != null ? (
            <ChapterSection chapter={at("team") as Chapter}>
              {model.team != null ? (
                <Ch08Team team={model.team} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("opening") != null ? (
            <ChapterSection chapter={at("opening") as Chapter}>
              {model.opening != null ? (
                <Ch09Opening opening={model.opening} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("year") != null ? (
            <ChapterSection chapter={at("year") as Chapter}>
              {model.year != null ? (
                <Ch10Year year={model.year} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("firstYear") != null ? (
            <ChapterSection chapter={at("firstYear") as Chapter}>
              {model.firstYear != null ? (
                <Ch11FirstYear firstYear={model.firstYear} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("survival") != null ? (
            <ChapterSection chapter={at("survival") as Chapter}>
              {model.survival != null ? (
                <Ch12Survival survival={model.survival} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("cities") != null ? (
            <ChapterSection chapter={at("cities") as Chapter}>
              {model.cities != null ? (
                <Ch13Cities cities={model.cities} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {/* 14, operator voices. `Voices.tsx` is built but there is no schema
              slot for sourced quotes yet, so this chapter has no model and
              always renders its gap. It is wired anyway, because the whole
              point of the completeness rule is that chapter 14 is chapter 14 in
              every city. When the slot exists this becomes an ordinary gate. */}
          {at("voices") != null ? (
            <ChapterSection chapter={at("voices") as Chapter}>
              <ChapterGap subject="what operators say" />
            </ChapterSection>
          ) : null}

          {at("watch") != null ? (
            <ChapterSection chapter={at("watch") as Chapter}>
              {model.watch != null ? (
                <Ch15Watch watch={model.watch} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {/* 16, versus the world. No component and no schema slot: the
              comparison it would draw has not been decided on. Same reasoning
              as 14 , the chapter exists so the page's shape does not move. */}
          {at("world") != null ? (
            <ChapterSection chapter={at("world") as Chapter}>
              <ChapterGap subject="how this trade compares worldwide" />
            </ChapterSection>
          ) : null}

          {at("verdict") != null ? (
            <ChapterSection chapter={at("verdict") as Chapter}>
              {model.verdict != null ? (
                <Ch17Verdict
                  verdict={model.verdict}
                  figures={model.figures}
                  city={model.meta.city.name}
                  noun={model.meta.trade.noun}
                />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {model.method != null && methodChapter != null ? (
            <ChapterSection chapter={methodChapter}>
              <Ch18Method method={model.method} />
            </ChapterSection>
          ) : null}

          {at("words") != null ? (
            <ChapterSection chapter={at("words") as Chapter}>
              {model.words != null ? (
                <Ch19Words words={model.words} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          {at("questions") != null ? (
            <ChapterSection chapter={at("questions") as Chapter}>
              {model.questions != null ? (
                <Ch20Questions questions={model.questions} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}

          <section className="ch">
            <Band
              className="rise"
              takeaway={model.band.takeaway}
              figure={model.band.figure}
              figureSub={model.band.figureSub}
              figureSize={64}
            />
          </section>

          {at("next") != null ? (
            <ChapterSection chapter={at("next") as Chapter}>
              {model.next != null ? (
                <Ch21Next next={model.next} />
              ) : (
                <ChapterGap />
              )}
            </ChapterSection>
          ) : null}
        </CellStoreProvider>

        <section style={{ padding: "0 0 30px" }}>
          <div className="trust rise">
            <span className="t">
              <GlyphIcon id="freshness" size={18} />
              Reviewed <b>{model.trust.reviewedAt}</b>
            </span>
            {model.trust.sites > 0 ? (
              <span className="t">
                <GlyphIcon id="market-size" size={18} />
                Based on about <b>{Math.round(model.trust.sites / 1000)},000</b>{" "}
                {model.meta.city.name} {model.meta.trade.noun}s
              </span>
            ) : null}
            {model.trust.tierLine !== "" ? (
              <span className="t">
                <GlyphIcon id="confidence" size={18} />
                {model.trust.tierLine}
              </span>
            ) : null}
            <button type="button" className="flag">
              <GlyphIcon id="flag" size={18} />
              Something look wrong? Flag it
            </button>
          </div>
        </section>

        <footer>
          <span>
            Margin Atlas <span style={{ color: "var(--muted)" }}>&middot;</span>{" "}
            {model.meta.trade.name} in {model.meta.city.name}
          </span>
          <span>Reviewed {model.trust.reviewedAt}</span>
        </footer>
      </div>
    </div>
  );
}
