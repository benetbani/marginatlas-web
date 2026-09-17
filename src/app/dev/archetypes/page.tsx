/**
 * /dev/archetypes , the stories page. Every archetype drawn across its
 * instance set, for the founder to open and the harness to measure. Dev
 * surface only; never linked from the site.
 */
import * as React from "react";
import { loadCityHeroInstances } from "@/lib/spine/city_hero_facts";
import { AnswerCardStories, RankedBarsStories, pickRankedBarsInstances, pickCityDistrictInstances, CompareTableStories, CardPagerStories, CityCardsStories, TiersTableStories, RangeStripStories, SpectraTableStories, NoteListStories, TerminusStories, PayBarsStories, KvGridStories, IncomeBreakdownStories, BentoBandStories, BentoMetricStories, MarkListStories, BlockedSeatStories, CityHeroStories, CityVerdictStories, pickCityVerdictInstances, pickCityStripInstances, pickCityReadsInstances, pickCityCloseInstances, pickAllInstances, StoriesIndex, pickCityPeerInstances } from "@/components/spine/archetypes/stories";

export const dynamic = "force-static";

const h = "mb-8 mt-16 text-[length:var(--t-head)] font-semibold text-[var(--c-ink)] first:mt-0";

export default async function ArchetypesPage() {
  const cityHero = await loadCityHeroInstances();
  const instances = pickAllInstances(cityHero);
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-10">
      <h1 data-typography="custom" className={h}>Archetypes, every instance</h1>
      <StoriesIndex instances={instances} />
      <h2 data-typography="custom" className={h}>The answer card</h2>
      <AnswerCardStories />
      <h2 data-typography="custom" className={h}>The ranked bars</h2>
      <RankedBarsStories city={pickCityDistrictInstances(cityHero)} />
      <h2 data-typography="custom" className={h}>The comparison table</h2>
      <CompareTableStories city={pickCityPeerInstances(cityHero)} />
      <h2 data-typography="custom" className={h}>The card pager</h2>
      <CardPagerStories />
      <h2 data-typography="custom" className={h}>The city cards, three looks to choose between</h2>
      <CityCardsStories />
      <h2 data-typography="custom" className={h}>The tiers table</h2>
      <TiersTableStories />
      <h2 data-typography="custom" className={h}>The range strip</h2>
      <RangeStripStories city={pickCityStripInstances(cityHero)} />
      <SpectraTableStories city={pickCityReadsInstances(cityHero)} />
      <NoteListStories />
      <TerminusStories city={pickCityCloseInstances(cityHero)} />
      <PayBarsStories />
      <KvGridStories />
      <h2 data-typography="custom" className={h}>The income breakdown</h2>
      <IncomeBreakdownStories />
      <h2 data-typography="custom" className={h}>The bento band</h2>
      <BentoBandStories city={cityHero} />
      <h2 data-typography="custom" className={h}>The metric cell standing alone</h2>
      <BentoMetricStories />
      <h2 data-typography="custom" className={h}>The mark list</h2>
      <MarkListStories />
      <h2 data-typography="custom" className={h}>The drawn blocked seat</h2>
      <BlockedSeatStories />
      <CityHeroStories instances={cityHero} />
      <CityVerdictStories instances={pickCityVerdictInstances(cityHero)} />
    </main>
  );
}
