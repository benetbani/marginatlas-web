/**
 * STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C): slots 3 to 5 drawn in the slot's frame (src/components/spine/country/Slot.tsx):
 * the covered cities' cards (one row, so the pager never draws), the household budget's share bar, London's trades' bars; and slot 5b (the
 * controller's ruling on Q1), the trades' net margins as the margin card draws them (founder ruling 6, vertical bars), its Box stamped as
 * the slot.
 */
import * as React from "react";
import { Slot } from "@/components/spine/country/Slot";
import { CityCards } from "@/components/spine/archetypes/CityCards";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { BarList } from "@/components/spine/charts/BarList";
import { RankedBars } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";
import { usd } from "@/lib/spine/money";
import { slotDef, stageOfSlot } from "@/lib/spine/country_slots";
import { SPEND_FOOD_IN, SPEND_FOOD_OUT, SPEND_RESIDUAL } from "@/lib/spine/country_spend_rows";
import type { SlotModel } from "@/lib/spine/slots/types";
import type { CustomersDrawing, MarginsDrawing, SpendDrawing, TradesDrawing } from "@/lib/spine/slots/market";

export function CustomersSlot({ model }: { model: SlotModel<CustomersDrawing> }) {
  const cards = model.drawing.cards;
  return (
    <Slot model={model}>
      {cards ? <CityCards cards={cards.cards} allHref={cards.allHref} allLabel={COPY.cities.allLabel} basis={COPY.cityCards.plain.basis} prevLabel={COPY.cities.prev} nextLabel={COPY.cities.next} /> : null}
    </Slot>
  );
}

export function SpendSlot({ model }: { model: SlotModel<SpendDrawing> }) {
  const spend = model.drawing.spend;
  return (
    <Slot model={model}>
      <div className="mt-1 flex flex-1 flex-col">
        <ShareBar parts={spend.rows.map((r) => ({ key: r.key, name: r.name, share: r.value, prov: r.prov }))} lead={[SPEND_FOOD_OUT, SPEND_FOOD_IN]} residualKey={SPEND_RESIDUAL} tall fill bracket={COPY.countrySpend.bracket} />
      </div>
    </Slot>
  );
}

export function TradesSlot({ model }: { model: SlotModel<TradesDrawing> }) {
  const { drawn, worldMax, middle } = model.drawing;
  return (
    <Slot model={model}>
      <BarList answer="money" items={drawn.map((r) => ({ key: r.key, label: r.name, value: r.value, display: usd(r.value), href: r.href, icon: r.icon, prov: r.prov }))} max={worldMax} reference={{ value: middle, label: COPY.londonSales.middleKey }} />
    </Slot>
  );
}

/** SLOT 5b: the margin card (RankedBars) is a whole card, its own opener and focal, so it stands as the slot with the slot's stamps on its
 *  Box, as the peers' table stands as slot 11. */
export function MarginsSlot({ model }: { model: SlotModel<MarginsDrawing> }) {
  const def = slotDef("margins");
  const { card, tagged } = model.drawing;
  return (
    <RankedBars
      id={def.domId}
      kicker={def.heading}
      icon={def.icon ?? "margin"}
      tagged={tagged}
      basis={COPY.margin.basis}
      withheldLine={null}
      rows={card.rows.map((r) => ({ key: r.key, name: r.name, href: r.href, lands: r.lands, value: r.margin, flagged: r.flagged }))}
      worldMax={card.worldMax}
      fmt={(v) => `${Math.round(v * 100)}%`}
      phoneHead={{ name: COPY.margin.phoneHead.trade, value: COPY.margin.phoneHead.value }}
      feature="none"
      focal={model.lead ? { figure: model.lead.figure, words: model.lead.words } : undefined}
      stamp={{ "data-slot": def.id, "data-stage": String(stageOfSlot("margins").n), "data-answer": def.type }}
    />
  );
}
