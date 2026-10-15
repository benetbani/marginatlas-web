/**
 * src/lib/spine/country_slots.ts , THE COUNTRY PAGE'S SLOT MODEL AS DATA (plan 2026-10-13 country-page-journey, Task 1A; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, sections 2 and 3; R5 section 5, which the spec adopts row for row).
 *
 * Sixteen slots in seven stages, the same for every country, and a seventeenth, 5b "What trades keep" (SHARE), after slot 5 (the
 * controller's ruling on the plan's Q1, 2026-10-13: a country's sourced net margins for its trades draw there, slot 5 stays MONEY): one
 * question, one answer type, one source, one thin state and one tap down each. A country draws the slots its data holds, in this order
 * (src/lib/spine/slots/plan.ts); a slot without its data omits itself (no seat, no "Not known yet"). The stage order is the phone's one
 * column; a desktop pair joins two neighbouring slots of one stage (src/lib/spine/slots/zones.ts). Stages 2 to 6 are the page's chapters,
 * numbered 01 to 05; the masthead (stage 1) and the close (stage 7) stand outside them. `n` is the slot's place in page order, `num` its
 * number in the spec's table ("5b" for the ruled one). The words a slot prints are COPY.journey's; `source`, `thin` and `plus` are R5's
 * notes, for a reader of this file.
 */
import { COPY } from "@/lib/spine/copy";
import type { AtlasIconId } from "@/components/brand/icons";

export type AnswerType = "money" | "share" | "time" | "position" | "state" | "dated-pair" | "table" | "doors";
export type StageId = "orient" | "market" | "open" | "run" | "last" | "rules" | "next";
export type SlotId = "tax-on-profit" | "where-it-stands" | "customers" | "spend" | "trades" | "margins" | "open" | "hire" | "running-costs" | "credit" | "filings" | "peers" | "lasting" | "exit" | "dealings" | "changes" | "close";

export type StageDef = { id: StageId; n: number; question: string; heading: string | null; index: string | null };
export type SlotDef = { n: number; num: string; id: SlotId; stage: StageId; question: string; type: AnswerType; heading: string; domId: string; icon: AtlasIconId | null; source: string; thin: string; plus: readonly string[] };

const J = COPY.journey;

export const STAGES: readonly StageDef[] = [
  { id: "orient", n: 1, question: "What is this country like for a small business?", heading: null, index: null },
  { id: "market", n: 2, question: "Is there money here, and where?", heading: J.stages.market, index: "01" },
  { id: "open", n: 3, question: "What does opening take?", heading: J.stages.open, index: "02" },
  { id: "run", n: 4, question: "What does staying open cost?", heading: J.stages.run, index: "03" },
  { id: "last", n: 5, question: "Will it survive, and what if it does not?", heading: J.stages.last, index: "04" },
  { id: "rules", n: 6, question: "Which rules bind me, and what is changing?", heading: J.stages.rules, index: "05" },
  { id: "next", n: 7, question: "Where do I go from here?", heading: null, index: null },
];

export const SLOTS: readonly SlotDef[] = [
  { n: 1, num: "1", id: "tax-on-profit", stage: "orient", question: "What share of profit goes to the state?", type: "share", heading: J.slots["tax-on-profit"].heading, domId: "take", icon: null, source: "hero_facts.ts, the regime (58 of 195); the UK's law engine (uk_tax_on_profit.ts)", thin: "the company tax rate under its own label (country_profile_v2.json corporate_income_tax_combined_pct, 198 of 198)", plus: ["the other taxes"] },
  { n: 2, num: "2", id: "where-it-stands", stage: "orient", question: "How does it sit for an owner?", type: "position", heading: J.slots["where-it-stands"].heading, domId: "take", icon: null, source: "hero_board.ts, the board's rows", thin: "no mark under a set of 20; Hiring staff moves to slot 7", plus: ["the row's placement sentence, in its readout"] },
  { n: 3, num: "3", id: "customers", stage: "market", question: "What do customers earn, and where?", type: "money", heading: J.slots.customers.heading, domId: "cities", icon: "best-areas", source: "city_cards.ts (every country the city list covers); range_rows.ts buildCustomersStrip (198; tenths on 47)", thin: "the national typical alone", plus: ["every covered city", "the tenths"] },
  { n: 4, num: "4", id: "spend", stage: "market", question: "Where does a household's money go?", type: "share", heading: J.slots.spend.heading, domId: "spend", icon: "spending-power", source: "country_spend_rows.ts (196 of 198); people.ts buildAgeMix (the people file)", thin: "omit", plus: ["people by age"] },
  { n: 5, num: "5", id: "trades", stage: "market", question: "Which trades make money here?", type: "money", heading: J.slots.trades.heading, domId: "trades", icon: "owner-keeps", source: "country_depth_rows.ts buildLondonTradeSales (the UK)", thin: "omit (173)", plus: ["more trades"] },
  { n: 6, num: "5b", id: "margins", stage: "market", question: "What share of sales do trades keep?", type: "share", heading: J.slots.margins.heading, domId: "margins", icon: "margin", source: "margin_rows.ts, the trades' sourced net margins (22 countries, the margin snapshot; the UK only where sourced or marked)", thin: "omit", plus: [] },
  { n: 7, num: "6", id: "open", stage: "open", question: "What do the forms cost, how long?", type: "table", heading: J.slots.open.heading, domId: "open", icon: "register-cost", source: "the formation file's tiers (152); entry_bill_rows.ts; howto_steps_rows.ts; country_licences_rows.ts; from_abroad.ts (the UK)", thin: "the bill or the table alone", plus: ["the steps", "licences by trade", "from abroad"] },
  { n: 8, num: "7", id: "hire", stage: "run", question: "What does one employee cost a year?", type: "money", heading: J.slots.hire.heading, domId: "hire", icon: "hiring", source: "pay_rows.ts (195 pairs); country_rates.ts employer_social; the shard's people_pay.hiring (197); rules.json employing (the UK)", thin: "the wage floor and the share", plus: ["rules of employing", "how hiring goes", "what the employer adds", "an hour, all in", "the job market"] },
  { n: 9, num: "8", id: "running-costs", stage: "run", question: "What do power and premises cost?", type: "money", heading: J.slots["running-costs"].heading, domId: "running-costs", icon: "cost-breakdown", source: "the profile's electricity (198, 52 fills left out) and diesel; rules.json premises and insurance (the UK); lease_by_law.ts (the UK)", thin: "electricity and its placement", plus: ["premises tax", "insurance by law", "the lease", "the peers' electricity"] },
  { n: 10, num: "9", id: "credit", stage: "run", question: "What does money cost me?", type: "share", heading: J.slots.credit.heading, domId: "credit", icon: "raise-money", source: "the profile's bank_lending_rate_pct (198); country_depth_rows.ts financing; country_rules.ts buildPayments (the UK)", thin: "the lending rate on its track", plus: ["start-up loans", "how customers pay", "when money lands"] },
  { n: 11, num: "10", id: "filings", stage: "run", question: "What must I file, and when?", type: "time", heading: J.slots.filings.heading, domId: "filings", icon: "filings", source: "rules.json filings (the UK)", thin: "omit", plus: ["late penalties and filing fees"] },
  { n: 12, num: "11", id: "peers", stage: "run", question: "Better deal than its peers?", type: "table", heading: J.slots.peers.heading, domId: "peers", icon: "benchmark", source: "peer_rows.ts (51 of 195)", thin: "omit", plus: ["sort by any head"] },
  { n: 13, num: "12", id: "lasting", stage: "last", question: "Of a hundred new firms, how many trade at year five?", type: "share", heading: J.slots.lasting.heading, domId: "lasting", icon: "first-year", source: "first_years.ts survival and obstacles; firms_last.ts; duel.ts (the UK)", thin: "omit", plus: ["what holds firms back", "by city", "trades that fail most"] },
  { n: 14, num: "13", id: "exit", stage: "last", question: "How long to sell, or to be freed if it fails?", type: "time", heading: J.slots.exit.heading, domId: "exit", icon: "sale-tag", source: "country_exit_rows.ts (198; left out on the UK); if_it_fails.ts and rules.json closing (the UK)", thin: "time to sell alone", plus: ["if it fails: its time rows, then its money and its state rows"] },
  { n: 15, num: "14", id: "dealings", stage: "rules", question: "How do the state and people deal?", type: "position", heading: J.slots.dealings.heading, domId: "dealings", icon: "bank", source: "character_rows.ts (192 of 195)", thin: "omit under two reads", plus: ["who trades here"] },
  { n: 16, num: "15", id: "changes", stage: "rules", question: "What changed, what is coming?", type: "dated-pair", heading: J.slots.changes.heading, domId: "changes", icon: "change", source: "country_rules.ts buildRuleChanges; data/sections/changes.json (the UK)", thin: "omit", plus: ["more changes"] },
  { n: 17, num: "16", id: "close", stage: "next", question: "Where now?", type: "doors", heading: J.slots.close.heading, domId: "close", icon: null, source: "close_rows.ts", thin: "fewer doors", plus: [] },
];

export function slotDef(id: SlotId): SlotDef {
  const s = SLOTS.find((x) => x.id === id);
  if (!s) throw new Error(`country_slots: no slot "${id}"`);
  return s;
}

export function stageDef(id: StageId): StageDef {
  const g = STAGES.find((x) => x.id === id);
  if (!g) throw new Error(`country_slots: no stage "${id}"`);
  return g;
}

export function stageOfSlot(id: SlotId): StageDef {
  return stageDef(slotDef(id).stage);
}
