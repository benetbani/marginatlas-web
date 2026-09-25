/**
 * THE HERO BOARD, his design of 2026-09-20 (rules/FOUNDER-VERDICTS.md under
 * that date; MODEL.md 8.2 row `00 take`'s bracket, the constitution by his
 * word): the flag and the name on one line, the total tax burden as the main
 * figure, an image in the centre, and on the right a column of at most six
 * supporting figures, each with a label that says where the country stands
 * among the countries: high, medium or low. Nothing a person finds on
 * Wikipedia; never population.
 *
 * ONE BUILDER, PURE OVER THE FILES. Every figure names its file and field
 * here and comes through the module that already prints it elsewhere on the
 * site (one figure, one builder), so the board and the card below it never
 * disagree:
 *  - the answer: hero_facts.ts (`getSmbRegime`, the effective rate on profit)
 *  - clean dealing: `corruption_perception_index`, country_profile_v2.json
 *    through getCountryProfile, 197 of 197 (50 measured, 147 interpolated),
 *    the footing card's own field. HIS WORD WAS "corruption level"; the score
 *    on file runs the other way (100 is clean), so under his label a 71 would
 *    read as 71 percent corrupt. The row keeps the site's name for the score,
 *    "Clean dealing", and the level reads the score as it is; his ruling on
 *    the name is owed and recorded in COUNTRY-PAGE-SECTIONS-PLAN-2026-09-20.md.
 *  - admin ease: `ease_of_doing_business_index`, the same file and field the
 *    footing card prints.
 *  - the administration's time: the days until an LLC can trade, the bill
 *    card's own guarded figure (entry_bill_rows.ts `buildEntryBill`, his
 *    ruling 1 of 2026-09-04: the time until the business can open, not the
 *    registration day count); this is the tangible measure of "efficiency of
 *    the administration" he named. Withheld where the guard withholds it.
 *  - the average monthly salary in dollars: the pay pair's average
 *    (pay_rows.ts, one builder with the staff-cost card) over twelve, whole
 *    dollars; withheld where the pair is withheld (ruling 14).
 *  - the LLC's all-in cost: the bill card's own guarded figure (the fees and
 *    a first licence, all in, never the government fee alone), 91 of 195
 *    printed; the sixth figure by the controller's proposal (his yes or no
 *    owed, reversible).
 *  - how easy it is to hire: NO ROW TODAY. The unemployment rate has no
 *    country field (DATA-REQUIREMENTS item 40); it is drawn the day the field
 *    exists, never from the city file and never as a "not gathered yet" line
 *    (his word of 2026-09-19).
 *
 * THE LEVEL is the placement builder's rank (placement.ts, R2: a tie is not
 * lower, the set is the countries holding the figure), read as thirds: the
 * top third of the world "high", the middle "medium", the bottom "low". The
 * level says where the figure stands and nothing about good or bad: a low
 * registration time is quick and a low salary is not, and the reader knows
 * which. A figure with no honest set (under twenty members) gets no level.
 *
 * THE IMAGE is a placeholder by his word ("put a placeholder at this moment,
 * or maybe the only image that we have"): the one photograph the repository
 * holds, `public/spine/_skyline.jpeg`, which is NOT the United Kingdom
 * (FOUNDER-VERDICTS.md, 2026-09-11: Positano). It is stamped `placeholder`
 * so no gate and no reader takes it for the country; the day he chooses real
 * photographs, a manifest names the file per country and this module reads
 * the manifest, never the disk.
 */
import { buildHeroFacts, type HeroFacts } from "@/lib/spine/hero_facts";
import { buildPayBars, worldPaySets } from "@/lib/spine/pay_rows";
import { placementRank } from "@/lib/spine/placement";
import { getCountryProfile, listCountryProfiles } from "@/lib/economic_profile";
import { buildEntryBill } from "@/lib/spine/entry_bill_rows";
import { COUNTRIES } from "@/lib/taxonomy";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { AtlasIconId } from "@/components/brand/icons";
import { queryFacts } from "@/lib/facts/store";
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";

export type HeroLevel = "high" | "medium" | "low";

export type HeroBoardRow = {
  /** The country's five keys, or a city's (city_hero_board.ts) since 2026-09-20 evening: the board is one archetype at two altitudes. */
  key: string;
  icon: AtlasIconId;
  label: string;
  /** The figure as printed. */
  value: string;
  /** One or two words under the figure saying its unit or basis, from the copy table. */
  unit: string;
  level: HeroLevel | null;
  confidence: "measured" | "modeled";
};

export type HeroBoardData = {
  iso2: string;
  name: string;
  answer: HeroFacts["answer"];
  /** The words under the answer's figure. Absent, the country's: `COPY.answer.basis` with the regime named (HeroBoard.tsx). A city's board says its own ("Pay, a year."). */
  answerBasis?: string | null;
  /** The basis line under the answer, the masthead's own words. */
  subtitle: string | null;
  /** THE ANSWER DRAWN at the answer column's foot (2026-09-24), the figure never printed a second time: the country's tax on profit as the whole filled to the share (his law of 2026-09-19, "a share of a whole is drawn"), its two parts named; a city's typical pay as its place among the covered cities, the two ends named. `value` is out of 100; `aria` names the drawing for a screen reader. */
  answerBar?: { value: number; part?: string; rest?: string; ends?: readonly [string, string]; aria: string } | null;
  rows: HeroBoardRow[];
  /** THE TAXES BEHIND THE RATE, behind the answer column's plus (his clause 58, parts behind a click; 2026-09-25): the rates a small
   *  business meets besides the one on profit, as the country's shard lists them (the UK's four national taxes) or, where it lists none,
   *  the two every profile holds (sales tax and the rate on company profit). Two rows at least or none. */
  taxes?: DetailRow[] | null;
  /** The line under the column saying what the chips are among. Absent, the country's (`COPY.heroBoard.levelBasis`). */
  levelBasis?: string;
  image: { src: string; alt: string; placeholder: boolean };
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isPos = (v: unknown): v is number => isNum(v) && v > 0;

/** The smallest set a level may be read against; under it the row prints its figure and no level. */
export const LEVEL_SET_FLOOR = 20;

/** The level of a figure among its set, read as thirds of the placement rank. */
export function levelOf(value: number, values: readonly number[]): HeroLevel | null {
  const { strictlyLower, total } = placementRank(value, values);
  if (total < LEVEL_SET_FLOOR) return null;
  const share = strictlyLower / total;
  if (share >= 2 / 3) return "high";
  if (share >= 1 / 3) return "medium";
  return "low";
}

/* THE SWEEPS, once per process: the profiles' two scores over every country
   holding a row, and the LLC's cost and days over every country whose
   formation file holds the tier. */
let sweep: { clean: number[]; admin: number[]; llcDays: number[]; llcCost: number[] } | null = null;
function sweeps() {
  if (sweep) return sweep;
  const clean: number[] = [], admin: number[] = [], llcDays: number[] = [], llcCost: number[] = [];
  for (const p of listCountryProfiles()) {
    if (isNum(p.corruption_perception_index)) clean.push(p.corruption_perception_index);
    if (isNum(p.ease_of_doing_business_index)) admin.push(p.ease_of_doing_business_index);
  }
  const list: any = COUNTRIES;
  const codes: string[] = Array.isArray(list) ? list.map((c: any) => String(c.iso2 ?? c.code ?? "").toUpperCase()).filter(Boolean) : Object.keys(list).map((k) => k.toUpperCase());
  for (const iso2 of codes) {
    const bill = buildEntryBill(iso2);
    if (bill?.verdict.days.state === "printed") llcDays.push(bill.verdict.days.value);
    if (bill?.verdict.bill.state === "printed") llcCost.push(bill.verdict.bill.value);
  }
  sweep = { clean, admin, llcDays, llcCost };
  return sweep;
}

/** The one placeholder the repository holds, on every country until a real
 *  photograph is chosen for it (then a manifest names the file per country;
 *  the module never reads the disk, so it renders the same on the build
 *  server and in the harness). */
export function heroImageFor(iso2: string): HeroBoardData["image"] {
  void iso2;
  return { src: "/spine/_skyline.jpeg", alt: "", placeholder: true };
}

export function buildHeroBoard(iso2In: string): HeroBoardData {
  const iso2 = iso2In.toUpperCase();
  const facts = buildHeroFacts(iso2);
  const profile = getCountryProfile(iso2);
  const profileHeld = profile.iso2.toUpperCase() === iso2;
  const profileConfidence: HeroBoardRow["confidence"] = profileHeld && profile.tier === "A" ? "measured" : "modeled";
  const s = sweeps();
  const rows: HeroBoardRow[] = [];

  if (profileHeld && isNum(profile.corruption_perception_index)) {
    const v = Math.round(profile.corruption_perception_index);
    rows.push({ key: "clean", icon: "corruption", label: COPY.heroBoard.rows.clean, value: String(v), unit: COPY.heroBoard.units.of100, level: levelOf(profile.corruption_perception_index, s.clean), confidence: profileConfidence });
  }
  if (profileHeld && isNum(profile.ease_of_doing_business_index)) {
    const v = Math.round(profile.ease_of_doing_business_index);
    rows.push({ key: "admin", icon: "ease-of-business", label: COPY.heroBoard.rows.admin, value: String(v), unit: COPY.heroBoard.units.of100, level: levelOf(profile.ease_of_doing_business_index, s.admin), confidence: profileConfidence });
  }
  const bill = buildEntryBill(iso2);
  const hiring = hireEase(iso2);
  if (bill?.verdict.days.state === "printed" && isPos(bill.verdict.days.value)) {
    const d = bill.verdict.days.value;
    rows.push({ key: "llc-days", icon: "red-tape", label: COPY.heroBoard.rows.llcDays, value: String(d), unit: d === 1 ? COPY.heroBoard.units.day : COPY.heroBoard.units.days, level: levelOf(d, s.llcDays), confidence: bill.verdict.days.tag === "held" ? "measured" : "modeled" });
  }
  /* HOW EASY IT IS TO HIRE (his hero list of 2026-09-20: "how easy it is to hire ... definitely an aspect"; 2026-09-25). The shard's
     word for the country (`people_pay.hiring.hire_ease`: easy on 25, moderate on 168, hard on 4 of 198), printed as the row's value;
     the word IS the level, so the row draws no chip beside it. */
  if (hiring) rows.push({ key: "hiring", icon: "hiring", label: COPY.heroBoard.rows.hiring, value: hiring, unit: "", level: null, confidence: "modeled" });
  const pay = buildPayBars(iso2);
  const avg = pay && pay.withheld == null ? pay.rows.find((r) => r.key === "average") ?? null : null;
  if (avg && isPos(avg.value)) {
    const month = Math.round(avg.value / 12);
    const set = worldPaySets().averages.map((a) => a / 12);
    rows.push({ key: "salary-month", icon: "wages", label: COPY.heroBoard.rows.salaryMonth, value: usd(month), unit: COPY.heroBoard.units.aMonth, level: levelOf(month, set), confidence: pay!.confidence === "measured" ? "measured" : "modeled" });
  }
  if (bill?.verdict.bill.state === "printed" && isNum(bill.verdict.bill.value)) {
    const c = bill.verdict.bill.value;
    rows.push({ key: "llc-cost", icon: "register-cost", label: COPY.heroBoard.rows.llcCost, value: usd(c), unit: COPY.heroBoard.units.allIn, level: levelOf(c, s.llcCost), confidence: bill.verdict.bill.tag === "held" ? "measured" : "modeled" });
  }

  const share = facts.answer && isNum(facts.answer.share) && facts.answer.share > 0 && facts.answer.share < 1 ? facts.answer.share : null;
  const answerBar = share != null && facts.answer ? { value: share * 100, part: COPY.heroBoard.share.part, rest: COPY.heroBoard.share.rest, aria: `${facts.answer.value} ${COPY.heroBoard.share.of}` } : null;
  return { iso2, name: facts.name, answer: facts.answer, subtitle: facts.subtitle, answerBar, rows, taxes: heroTaxes(iso2), image: heroImageFor(iso2) };
}

/** The shard's word for how easy hiring is, as the board prints it, or null. */
function hireEase(iso2: string): string | null {
  const code = countryEntityId(iso2);
  if (!code || !loadCountryShard(code)) return null;
  const f = queryFacts({ entityId: code, metrics: ["people_pay.hiring.hire_ease"], rowKey: "" })[0];
  if (!f || f.tag === "placeholder" || typeof f.value !== "string") return null;
  return (COPY.heroBoard.hireEase as Record<string, string>)[f.value.trim().toLowerCase()] ?? null;
}

/** THE TAXES BEHIND THE RATE (see `taxes` on the type): the shard's national taxes where it lists them, else the profile's two rates. */
function heroTaxes(iso2: string): DetailRow[] | null {
  const code = countryEntityId(iso2);
  const rows: DetailRow[] = [];
  if (code && loadCountryShard(code)) {
    const items = queryFacts({ entityId: code }).filter((f) => f.metric.startsWith("tax_detail.groups.*.items.*.") && f.tag !== "placeholder");
    const byKey = new Map<string, { name?: string; value?: string }>();
    for (const f of items) {
      const key = String(f.rowKey ?? "");
      const row = byKey.get(key) ?? {};
      if (f.metric.endsWith(".name") && typeof f.value === "string") row.name = f.value;
      if (f.metric.endsWith(".value") && typeof f.value === "string") row.value = f.value;
      byKey.set(key, row);
    }
    /* A percentage only: the list's fixed fees (the company's registration) are the board's own row above, and a rate held as a
       share of profit "equivalent" is not a rate a reader can check. */
    const threshold = queryFacts({ entityId: code, metrics: ["setup.vat_threshold_usd"], rowKey: "" })[0];
    for (const [key, r] of byKey) {
      if (!r.name || !r.value || !/%$/.test(r.value.trim()) || key === "business_rates") continue;
      const note = key === "vat" && threshold && isPos(threshold.value) ? COPY.heroBoard.taxNotes.vatFrom.replace("{amount}", usd(threshold.value)) : undefined;
      rows.push({ label: r.name, value: r.value.trim(), note });
    }
  }
  if (rows.length < 2) {
    rows.length = 0;
    const profile = getCountryProfile(iso2);
    if (profile.iso2.toUpperCase() === iso2.toUpperCase()) {
      if (isPos(profile.vat_gst_standard_pct)) rows.push({ label: COPY.heroBoard.taxNotes.salesTax, value: `${Math.round(profile.vat_gst_standard_pct * 1000) / 10}%` });
      if (isPos(profile.corporate_income_tax_combined_pct)) rows.push({ label: COPY.heroBoard.taxNotes.companyTax, value: `${Math.round(profile.corporate_income_tax_combined_pct * 1000) / 10}%` });
    }
  }
  return rows.length >= 2 ? rows : null;
}
