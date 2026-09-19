/**
 * THE INDUSTRY PAGE'S TURN TWO (MODEL.md 8.7; plan step 34's third
 * dispatch, 2026-09-19): `06 places` full width (the page's second of three,
 * R1), then the band `07 formats | 08 channels`. Each card is drawn ONCE
 * here and mounted by industry-view.tsx on the page and by the archetype
 * stories on the sheet, so the card a story is judged on is the card the
 * page draws (the renderers-agree rule, plan step 25). The view seats them.
 *
 * `06 places` (PlacesTable): the page's one table, on CompareTable (B7),
 * off industry_places_rows.ts over the slate resolved by the adapter: one
 * row per city where the trade resolves to a real local measurement, two
 * columns in the table's own units (take-home a year, net margin), the best
 * cell of each column in ink with the tick as the archetype marks a better
 * value wherever two rows hold one, NO home row (`home: false` on every
 * row, the page has no home), flags on (the cities are in different
 * countries, the city peers' rule; the trade's peers turn theirs off because
 * their places share one flag), rows never navigate (M23), terracotta never
 * enters a table. QUIET, by table law. The table draws its own
 * `data-wide-table` wrapper, the sanction the full-width and lone-card gates
 * read. UNDER FOUR CITIES THE DRAWN BLOCKED SEAT STANDS WHERE THE TABLE
 * WOULD, at the table's full width and under the table's own sanction (the
 * same wrapper, the country page's own precedent for its peers table): the
 * same kicker, the same tile, one stated line naming the count and the
 * floor, the requirement in its foot, no figure, so the page keeps its
 * three full widths whether the block is drawn or seated (243 of 243 trades
 * stand seated today under the own-row law, the builder's header carries
 * the count and the measurement behind it). A seat holds
 * no figure by its law, so nothing here is at 30; the table's figures are
 * siblings and exempt from the focal rung (PART 4, EVEN_BY_RULING).
 *
 * `07 formats` (FormatsCard): the mark list with no marks and no doors,
 * off formats_rows.ts (the shard's formats on the one net builder's net),
 * highest first, the headline the set's middle at 30 in ink, the form's own
 * law (never loud); the opener's mark on, behind his switch, every row
 * modelled. Under four formats (no shard today) the withheld state on
 * BentoMetric, the rivals' precedent: the structure, the stated line where
 * the list would stand, never a short list. The census reads MarkList.
 *
 * `08 channels` (ChannelsCard): THE TRADE PAGE'S OWN CARD, cell/turn-two.tsx's
 * MixCard, mounted here unchanged off the same builder at the world altitude
 * (`buildMix(id, "world")`, the basis without its city clause), the seat
 * awaiting his click on candidate 5, the donut: KvGrid, the leader first,
 * every cell at the head rung, no 30, no accent, the FOCAL finding on the
 * card standing until he clicks, exactly as it stands on the trade page.
 * 8.7 names this seat the page's third accent, on the largest line's
 * figure; the accent waits for the donut with the form, so the page carries
 * TWO loud moments (the take at 40, the payback at 30) until his click, and
 * nothing here is lit. The census reads KvGrid.
 */
import * as React from "react";
import { CompareTable } from "@/components/spine/archetypes/CompareTable";
import { BlockedSeat } from "@/components/spine/archetypes/BlockedSeat";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { BentoMetric } from "@/components/spine/archetypes/BentoBand";
import { COPY } from "@/lib/spine/copy";
import type { IndustryPlacesData } from "@/lib/spine/industry_places_rows";
import type { FormatsData } from "@/lib/spine/formats_rows";

export { MixCard as ChannelsCard } from "@/components/spine/cell/turn-two";

export function PlacesTable({ id = "places", places }: { id?: string; places: IndustryPlacesData | null }) {
  if (!places) return null;
  if (places.state === "table") {
    return (
      <CompareTable
        id={id}
        icon="where-it-pays"
        kicker={COPY.industryPlaces.kicker}
        entityHead={places.entityHead}
        rows={places.rows}
        columns={places.columns}
        note={places.note ?? undefined}
        caveat={places.caveat}
        sample
      />
    );
  }
  return (
    <div data-wide-table className="mt-8">
      <BlockedSeat id={id} icon="where-it-pays" kicker={COPY.industryPlaces.kicker} line={places.line ?? COPY.industryPlaces.blocked.none} foot={places.foot ?? COPY.industryPlaces.blocked.foot} />
    </div>
  );
}

export function FormatsCard({ id = "formats", formats }: { id?: string; formats: FormatsData | null }) {
  if (!formats) return null;
  if (formats.state === "list" && formats.middle != null) {
    return (
      <MarkList
        id={id}
        icon="subtype"
        kicker={formats.kicker}
        tagged={formats.sample}
        headline={{ label: formats.middleLabel, value: formats.middle }}
        basis={formats.basis}
        head={formats.head}
        rows={formats.rows.map((r) => ({ key: r.key, name: r.name, value: r.value }))}
        fmt={formats.fmt}
        withheld={0}
        withheldLine={null}
      />
    );
  }
  return <BentoMetric id={id} icon="subtype" kicker={formats.kicker} sample={formats.sample} withheld={formats.stateLine ?? COPY.industryFormats.state.replace("{k}", "none")} basis={formats.basis} />;
}
