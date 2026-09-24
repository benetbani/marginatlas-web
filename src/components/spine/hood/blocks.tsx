/**
 * The neighbourhood pages' cards (MODEL.md 8.8; plan step 35, 2026-09-19),
 * drawn once here for the hub, the district page and the story sheet, so a
 * story is the card and not a copy of it (the trade page's turn-one.tsx
 * idiom). Every card takes the builder's data and nothing else; the builders
 * (src/lib/spine/hood_*_rows.ts) are pure over the files by the city's slug,
 * so the page, the stories and the copy gates read one set of figures.
 *
 * THE SAMPLE MARK'S WIRING, said once for the render group: every card here
 * whose figures are modelled or authored passes `sample` to the kit's `Rail`
 * (`tagged` to RankedBars, `confidence` on the answer card's answer), and the
 * kit draws `SampleTag` there, behind his switch (MODEL.md, THE SAMPLE MARK IS
 * BEHIND ONE SWITCH); scripts/verify_sample_tags.ts reads this render group
 * for that name. SampleTag is imported here and not called, as the city
 * view imports it, so the reference the gate reads is in the group.
 */
import * as React from "react";
import { Box, Rail, SampleTag } from "@/components/spine/kit";
import { AnswerCard } from "@/components/spine/archetypes/AnswerCard";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { Terminus, type Door } from "@/components/spine/archetypes/Terminus";
import { rentMult } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import type { HoodTakeData } from "@/lib/spine/hood_take_rows";
import type { HoodRankData } from "@/lib/spine/hood_rank_rows";
import type { HoodPremiumData } from "@/lib/spine/hood_premium_rows";
import type { HoodCompareData } from "@/lib/spine/hood_compare_rows";
import type { HoodCharacterData } from "@/lib/spine/hood_character_rows";

void SampleTag;

/**
 * `00 take`, FULL WIDTH, the page's only 40 (8.8, loud 1): the answer card
 * at page level, the flag and the h1 (the city on the hub, the district on
 * its page with the crumb naming the city and the country once under it,
 * PART 3), the spread or the district's own rent against the cheapest at 40
 * in `--terra-text`, the companions docked as the KvGrid, the provenance
 * line as the foot. hood_take_rows.ts says what the figure is and why.
 */
export function HoodTake({ id = "take", take }: { id?: string; take: HoodTakeData | null }) {
  if (!take) return null;
  /* The hub and the district page are two surfaces with one answer (the rent spread, or the district's own rent: `rent-lightest`); each declares its own. */
  return <AnswerCard id={id} name={take.name} iso2={take.iso2} crumb={take.crumb.length ? take.crumb : undefined} subtitle={take.subtitle} answer={take.answer} cells={take.cells} tone="accent" foot={take.foot} answers={take.focus ? SURFACE_ANSWERS.district : SURFACE_ANSWERS.hood} />;
}

/**
 * `01 rank`: the city's district card one altitude down, the same builder
 * and the same words (hood_rank_rows.ts): RankedBars in its table form,
 * `ceiling="set"`, `feature="none"`, `best="min"`, the cheapest first
 * printing its own 1.00x, the dearest the ceiling, tagged modelled. The one
 * line this card adds is the clip line under the basis, drawn only when a
 * district's composed rent sits on the engine's bound.
 */
export function RankCard({ id = "rank", rank }: { id?: string; rank: HoodRankData | null }) {
  if (!rank) return null;
  return (
    <RankedBars
      id={id}
      kicker={COPY.cityDistricts.kicker}
      icon="best-areas"
      tagged={rank.tagged}
      basis={rank.basis}
      withheldLine={rank.clipLine}
      rows={rank.rows}
      worldMax={rank.worldMax}
      ceiling="set"
      feature="none"
      best="min"
      topLabel={COPY.cityDistricts.dearest}
      fmt={rentMult}
      phoneHead={rank.phoneHead}
    />
  );
}

/**
 * `02 premium`: MarkList with no marks, the seven districts by visitors a
 * year per resident, the headline the set's middle in ink (never loud), every
 * row a door to the district's page (PART 5: the arrow and the hover are the
 * archetype's), the withheld count and its line when a district holds no
 * figure. Sourced and dated on every row, so no sample mark.
 */
export function PremiumCard({ id = "premium", premium }: { id?: string; premium: HoodPremiumData | null }) {
  if (!premium) return null;
  return <MarkList id={id} kicker={premium.kicker} icon="tourist" tagged={premium.tagged} headline={premium.headline} basis={premium.basis} head={premium.head} rows={premium.rows} fmt={premium.fmt} withheld={premium.withheld} withheldLine={premium.withheldLine} />;
}

/**
 * `03 compare`, FULL WIDTH by the wide-table sanction (the archetype draws
 * its own `data-wide-table` wrapper): the seven districts side by side, what
 * a shop takes there for three trades, MEASURED since 2026-09-24
 * (hood_compare_rows.ts says why the rent and visitor columns left), the
 * home row tinted on a district page and no row home on the hub, no flags
 * (every row is in one city, MarkList's own law for a mark that would say
 * the same thing seven times). Measured figures carry no sample mark.
 */
export function CompareCard({ id = "compare", compare }: { id?: string; compare: HoodCompareData | null }) {
  if (!compare) return null;
  return <CompareTable id={id} icon="benchmark" kicker={COPY.hoodCompare.kicker} entityHead={compare.entityHead} rows={compare.rows} columns={compare.columns} note={compare.note ?? undefined} caveat={compare.caveat} flags={false} />;
}

/** `04 works`: the drawn blocked seat (M19), waiting on DATA-REQUIREMENTS item 70. */
export function WorksSeat({ id = "works" }: { id?: string }) {
  return <BlockedSeat id={id} icon="where-it-pays" kicker={COPY.blocked.hoodWorks.kicker} line={COPY.blocked.hoodWorks.line} foot={COPY.blocked.hoodWorks.foot} />;
}

/**
 * `05 character`: THE PAGE'S ONE PROSE SECTION (R9, `data-editorial="1"`
 * through NoteList's default), the cheapest district's rows on the hub and
 * the district's own on its page, the first row's label saying it is the
 * note's first line, the foot saying where the other districts' notes are
 * (one line, no door; no basis, hood_character_rows.ts says why). The notes
 * are authored: the opener carries the mark.
 */
export function CharacterCard({ id = "character", character }: { id?: string; character: HoodCharacterData | null }) {
  if (!character) return null;
  return (
    <Box id={id}>
      <Rail icon="district-mix" kicker={character.kicker} sample={character.sample} />
      {/* Two columns from 600 of container (his clause 51, 2026-09-20): a note is a block of text and lives in one half; one column at the wide seat (693 at 1280, 720 stacked at 768) put every note in the left half with the right half blank (312 by 234 by the page filter). */}
      <NoteList notes={character.rows} columns={2} />
      {/* The foot at the ladder's slot rung (8, PART 2) under the last hairline: measured 2026-09-19 at 1440, the seat beside this card reads 130 of 217 inked at a 12px foot, 59.9 percent against the art-direction gate's 60, and 130 of 213 at 8, 61; the card's own height is the pair's. */}
      <p data-foot className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{character.foot}</p>
    </Box>
  );
}

/** `06 close`, FULL WIDTH on the hero band (the trade's precedent): the terminus with its three doors at most, the pill last. */
export function HoodClose({ id = "close", doors }: { id?: string; doors: Door[] }) {
  if (doors.length === 0) return null;
  return (
    <Box id={id}>
      <Terminus kicker={COPY.close.kicker} doors={doors} />
    </Box>
  );
}
