/**
 * src/components/spine2/calc-config.ts
 *
 * Trade configs for the calculator. Plain module, serialisable data only:
 * formatters are named FormatIds and leverage moves are declarative specs,
 * so a config could come off the wire unchanged.
 *
 * RESTAURANT_LONDON is the mockup's CONFIG.restaurant (cell.html) restated
 * to the ratified interface. The one deliberate change is the M7 fix BATCH-C
 * calls out: the mockup probed orders by v*0.05 (2.6 orders) under a
 * hand-typed "five more orders a day" caption; here the move IS five orders
 * and the caption is templated from the same spec, so the sentence and the
 * arithmetic can never drift apart.
 *
 * Calibration: 52 x $38 x 313 days = $618,488 revenue;
 * x (1 - 31%) - 210,286 - 80,403 - 92,773 = $43,295 , the published $43K.
 * assertCalibration proves it in dev; the number gate owns it at build.
 */

import type { CalcConfig } from "./calc-engine";
import { assertCalibration } from "./calc-engine";

export const RESTAURANT_LONDON: CalcConfig = {
  trade: "Restaurant, London",
  days: 313,
  vars: [
    {
      id: "vol",
      kind: "volume",
      label: "Orders a day",
      glyph: "unit-economics",
      min: 30,
      max: 90,
      step: 2,
      defaultValue: 52,
      format: "int",
      leverage: { kind: "abs", amount: 5, direction: "up", noun: "orders a day" },
    },
    {
      id: "price",
      kind: "price",
      label: "Average spend",
      glyph: "spending-power",
      min: 22,
      max: 70,
      step: 2,
      defaultValue: 38,
      format: "usd",
      leverage: { kind: "abs", amount: 2, direction: "up", noun: "a head" },
    },
    {
      id: "food",
      kind: "pct",
      label: "Food and drink",
      glyph: "trade-grocery",
      min: 22,
      max: 40,
      step: 1,
      defaultValue: 31,
      format: "pct",
      leverage: { kind: "abs", amount: 2, direction: "down", noun: "food cost" },
    },
    {
      id: "staff",
      kind: "fixed",
      label: "Staff cost",
      glyph: "staffing-rota",
      min: 150000,
      max: 290000,
      step: 5000,
      defaultValue: 210286,
      format: "money",
      leverage: { kind: "pct", pct: 5, direction: "down", noun: "the rota" },
    },
    {
      id: "rent",
      kind: "fixed",
      label: "Rent and rates",
      glyph: "commercial-rent",
      min: 40000,
      max: 130000,
      step: 2000,
      defaultValue: 80403,
      format: "money",
      leverage: { kind: "pct", pct: 10, direction: "down", noun: "the rent you sign" },
    },
    {
      id: "run",
      kind: "fixed",
      label: "Running costs",
      glyph: "cost-breakdown",
      min: 55000,
      max: 135000,
      step: 2000,
      defaultValue: 92773,
      format: "money",
      leverage: { kind: "pct", pct: 5, direction: "down", noun: "running costs" },
    },
  ],
  notes: [
    { below: 0, say: "this room loses money; the rent or the orders have to move" },
    { below: 30000, say: "below a real wage, you are buying yourself a hard job" },
    { below: 70000, say: "a wage, but less than your head chef earns" },
    { below: 120000, say: "a genuinely good living, top third of the trade" },
    { below: Infinity, say: "exceptional, the very top of London" },
  ],
};

/** The page's headline take-home the defaults must reproduce. */
export const RESTAURANT_LONDON_PUBLISHED = { ownerKeeps: 43295 };

if (process.env.NODE_ENV !== "production") {
  assertCalibration(RESTAURANT_LONDON, RESTAURANT_LONDON_PUBLISHED);
}
