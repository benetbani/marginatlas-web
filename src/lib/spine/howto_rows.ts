/**
 * src/lib/spine/howto_rows.ts
 *
 * THE HOW-TO PAGE'S ROWS, "How to open a business in [country name]" (founder
 * ruling 8, 2026-09-04): the legal forms with their fee, time and paperwork
 * (the same rows the country page's registering table draws), the cells the
 * answer card holds (payroll, sales tax, the LLC's time and cost, said with
 * the words they carry), what each form is in plain words, what the paperwork
 * dots mean, the country's authored notes where held, and doors back. Every
 * figure comes from the builders the country page already uses, so nothing
 * on this page can disagree with that one. Local and synchronous.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { buildSetupRows } from "@/lib/spine/setup_rows";
import { buildHowToSteps, type HowToStepsData } from "@/lib/spine/howto_steps_rows";
import { buildLocalsNotes, type LocalNote } from "@/lib/spine/locals_rows";
import { buildCloseDoors } from "@/lib/spine/close_rows";
import { COPY } from "@/lib/spine/copy";
import { inSentence } from "@/lib/spine/place_names";
import { countryPageTarget } from "@/lib/geo/page_targets";
import type { Door } from "@/components/spine/archetypes/Terminus";
import type { TierRow } from "@/components/spine/archetypes/TiersTable";

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

export type HowToData = {
  iso2: string;
  name: string;
  title: string;
  lead: string;
  cells: ReturnType<typeof buildHeroFacts>["cells"];
  tiers: TierRow[];
  /** THE ORDERED STEPS (2026-09-23): the country shard's own sequence, or null where it holds none. */
  steps: HowToStepsData | null;
  forms: LocalNote[];
  dots: LocalNote[];
  locals: LocalNote[] | null;
  doors: Door[];
};

export function buildHowTo(iso2: string): HowToData | null {
  const code = iso2.toUpperCase();
  const name = (COUNTRIES as Array<{ code: string; name: string }>).find((c) => c.code === code)?.name;
  if (!name) return null;
  const tiers = buildSetupRows(code);
  /* NO FORMS ON FILE, NO PAGE: a how-to page that cannot say which forms exist
     would be a title over a legend. The door on the country page reads the
     same rule, and the route answers 404. */
  if (tiers.length === 0) return null;
  const facts = buildHeroFacts(code);
  const forms: LocalNote[] = tiers
    .map((t) => ({ label: t.tier, fact: COPY.tiers.explainers[t.tier as keyof typeof COPY.tiers.explainers] ?? "" }))
    .filter((n) => n.fact.length > 0);
  const dots: LocalNote[] = ([1, 2, 3, 4, 5] as const).map((n) => ({ label: COPY.howto.dotLabels[n - 1], fact: COPY.tiers.paperwork[n] }));
  const localsBuilt = buildLocalsNotes(code);
  /* THE COUNTRY ADDRESS COMES FROM THE RESOLVER, never assembled here: the
     geo-link gate's rule, and Greece's dead /el links are why. */
  const back = countryPageTarget(code);
  const doors: Door[] = [
    ...(back ? [{ key: "back", label: fill(COPY.howto.back, { country: inSentence(name) }), href: back.href, kind: "link" as const, lands: back.answers }] : []),
    ...buildCloseDoors(code).filter((d) => d.key !== "pro"),
  ];
  return {
    iso2: code,
    name,
    title: fill(COPY.howto.title, { country: inSentence(name) }),
    lead: COPY.howto.lead,
    /* THE LLC'S TIME AND COST LEAVE THE MASTHEAD (2026-09-23): `01 steps` now
       prints the registration step by step with its own days and fee, so the
       masthead's "To register an LLC: 1 day, $16" was the same fact said twice
       on one screen, which is clause 66 and which the art-direction gate
       caught as a figure repeated across two cards in the first screen. What
       stays is what the steps do not carry: what a business pays. */
    cells: facts.cells.filter((c) => c.key !== "llc-time" && c.key !== "llc-cost"),
    tiers,
    steps: buildHowToSteps(code),
    forms,
    dots,
    locals: localsBuilt ? localsBuilt.notes : null,
    doors,
  };
}
