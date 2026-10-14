/**
 * src/lib/spine/slots/plan.ts , A COUNTRY'S SLOTS (plan 2026-10-13 country-page-journey, Task 4; spec section 3: "A slot without its data
 * omits itself"): every stage's builder asked in the model's order, the slots that answer kept. The masthead (slots 1 and 2, his HeroBoard)
 * draws on every country; every other slot draws where its builder returns a model. `drawn` is the list the zones, the rail and the
 * replicability gate read. The trades' margins (slot 5b, the controller's ruling on Q1) come from the seed the route hands the view
 * (`margins`, the live money rows), so a caller without the seed passes none and 5b omits itself.
 */
import type { SlotId } from "@/lib/spine/country_slots";
import type { MarginCard } from "@/lib/spine/margin_rows";
import type { SlotModel } from "./types";
import { buildCustomersSlot, buildSpendSlot, buildTradesSlot, buildMarginsSlot, type CustomersDrawing, type SpendDrawing, type TradesDrawing, type MarginsDrawing } from "./market";
import { buildOpenSlot, type OpenDrawing } from "./open";
import { buildHireSlot, type HireDrawing } from "./hire";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot, buildPeersSlot, type CreditDrawing, type PeersDrawing } from "./run";
import { buildLastingSlot, buildExitSlot, type LastingDrawing, type ExitDrawing } from "./last";
import { buildDealingsSlot, buildChangesSlot, buildCloseSlot, type DealingsDrawing, type ChangesDrawing, type CloseDrawing } from "./rules";

export type PlannedSlot =
  | { id: "tax-on-profit"; model: null }
  | { id: "customers"; model: SlotModel<CustomersDrawing> }
  | { id: "spend"; model: SlotModel<SpendDrawing> }
  | { id: "trades"; model: SlotModel<TradesDrawing> }
  | { id: "margins"; model: SlotModel<MarginsDrawing> }
  | { id: "open"; model: SlotModel<OpenDrawing> }
  | { id: "hire"; model: SlotModel<HireDrawing> }
  | { id: "running-costs"; model: SlotModel<null> }
  | { id: "credit"; model: SlotModel<CreditDrawing> }
  | { id: "filings"; model: SlotModel<null> }
  | { id: "peers"; model: SlotModel<PeersDrawing> }
  | { id: "lasting"; model: SlotModel<LastingDrawing> }
  | { id: "exit"; model: SlotModel<ExitDrawing> }
  | { id: "dealings"; model: SlotModel<DealingsDrawing> }
  | { id: "changes"; model: SlotModel<ChangesDrawing> }
  | { id: "close"; model: SlotModel<CloseDrawing> };

export function planCountry(iso2In: string, name: string, today: string, margins: { card: MarginCard | null; tagged?: boolean } = { card: null }): { slots: PlannedSlot[]; drawn: SlotId[] } {
  const iso2 = iso2In.toUpperCase();
  const slots: PlannedSlot[] = [{ id: "tax-on-profit", model: null }];
  const customers = buildCustomersSlot(iso2); if (customers) slots.push({ id: "customers", model: customers });
  const spend = buildSpendSlot(iso2); if (spend) slots.push({ id: "spend", model: spend });
  const trades = buildTradesSlot(iso2); if (trades) slots.push({ id: "trades", model: trades });
  const keep = buildMarginsSlot(iso2, margins.card, !!margins.tagged); if (keep) slots.push({ id: "margins", model: keep });
  const open = buildOpenSlot(iso2, today); if (open) slots.push({ id: "open", model: open });
  const hire = buildHireSlot(iso2, today); if (hire) slots.push({ id: "hire", model: hire });
  const running = buildRunningCostsSlot(iso2, today); if (running) slots.push({ id: "running-costs", model: running });
  const credit = buildCreditSlot(iso2, today); if (credit) slots.push({ id: "credit", model: credit });
  const filings = buildFilingsSlot(iso2, today); if (filings) slots.push({ id: "filings", model: filings });
  const peers = buildPeersSlot(iso2); if (peers) slots.push({ id: "peers", model: peers });
  const lasting = buildLastingSlot(iso2, today); if (lasting) slots.push({ id: "lasting", model: lasting });
  const exit = buildExitSlot(iso2, today); if (exit) slots.push({ id: "exit", model: exit });
  const dealings = buildDealingsSlot(iso2); if (dealings) slots.push({ id: "dealings", model: dealings });
  const changes = buildChangesSlot(iso2, today); if (changes) slots.push({ id: "changes", model: changes });
  const close = buildCloseSlot(iso2, name); if (close) slots.push({ id: "close", model: close });
  const drawn = slots.flatMap((s): SlotId[] => (s.id === "tax-on-profit" ? ["tax-on-profit", "where-it-stands"] : [s.id]));
  return { slots, drawn };
}
