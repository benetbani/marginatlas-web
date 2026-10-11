/**
 * src/lib/spine/crumb_rows.ts
 *
 * THE TRAIL BACK UP, one builder for every surface (2026-09-22, QUEUE
 * ui:the-trail-back-up; his hundred interface words name breadcrumbs, and the
 * measurement that night said zero of the rendered pages carried one).
 *
 * THE HIERARCHY IS THE REAL ONE, never an invented one: country, city,
 * districts, district; country, place, trade; industries, trade. Every
 * destination resolves through `geo/page_targets.ts`, whose whole job is to
 * refuse a page the route would answer 404 on (it is the module that ended
 * the dead `/el` links for Greece), so a crumb pointing nowhere cannot be
 * built by accident. Where a step does not resolve it stays as text, which is
 * the legacy breadcrumb's contract too.
 *
 * THE LAST STEP IS THE PAGE. It carries no href here, and the component
 * refuses one anyway, so the two cannot drift.
 *
 * NO TRAIL SAYS ONE PLACE TWICE, AND NONE LOSES THE WAY TO A PLACE'S OWN PAGE (truth-fixes rounds 3A and 3A2; the review's M1). A place step whose label is the
 * country's own is said once, and the step that stays is the one with a page of its own: the place's city page or region page where it has one (Singapore, Hong
 * Kong, Monaco, Luxembourg and four more words of the place table, whose page bears their country's name), else the country's step. countryAndPlace is the one
 * function the two builders that pair the steps (the trade page and the district pages) read, so the rule is written once.
 * THE STATED EXCEPTION IS THE CITY PAGE'S OWN TRAIL (buildCityCrumbs): country, then the page itself, so a city named like its country reads "Singapore /
 * Singapore". The page is the last step and never a link, so folding the repeat leaves one step, which the component draws as nothing (two steps at least), and the
 * page would lose its only way back up to the country page. The repeat stays, and a row of tests/spine/trade_head.test.ts pins it as stated behaviour.
 *
 * WHAT THIS CANNOT SEE, STATED: whether the resolved page RENDERS. The
 * resolvers answer from the route rules and the lists the routes gate on, not
 * from a fetch, and the chain may never reach the network. The link walk
 * (`scripts/harness/check_page_links.mjs`) has the same blind spot and says so.
 */
import { countryPageTarget, geoPageTarget, neighbourhoodsHubTarget, districtPageTarget } from "@/lib/geo/page_targets";
import { getCityIdentity } from "@/lib/cities/city_tier";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import type { SpineCrumb } from "@/components/spine/Crumbs";
import { COPY } from "@/lib/spine/copy";

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** The same words in two steps, whatever the case: one place said twice. */
const sameLabel = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** The country step, where we publish that country's page. */
function countryCrumb(iso2: string): SpineCrumb | null {
  const t = countryPageTarget(iso2);
  return t ? { label: t.label, href: t.href } : null;
}

/** THE COUNTRY'S STEP AND THE PLACE'S STEP, as one pair, for every builder that has both (the trade page and the district pages). A place whose
 *  label says the country's own name is said once (truth-fixes round 3A: /gb/gb/restaurants read "United Kingdom / United Kingdom /
 *  Restaurants"). WHICH STEP STAYS (round 3A2, the review's M1): where the place has a page of its own, a city page or a region page, its step
 *  stays with that link, the nearer parent, and the country's step goes, because the step round 3A dropped was the one that carried the way
 *  to the place's page and the country's carried only the way one level further up. Where the place has no page (/gb/gb, an id no table
 *  labels) its step goes and the country's stays, link and all. The place's name is its page's own where a page exists, else the fallback
 *  the caller holds, else the word. The country's step is absent where we publish no page for the country. */
function countryAndPlace(iso2: string, geo: string, fallback?: string): SpineCrumb[] {
  const country = countryCrumb(iso2);
  const t = geoPageTarget(iso2, geo);
  const name = t ? t.name : clean(fallback) || clean(geo);
  const place: SpineCrumb | null = !name ? null : t ? { label: t.name, href: t.href } : { label: name };
  if (country && place && sameLabel(place.label, country.label)) return [place.href ? place : country];
  return [country, place].filter((step): step is SpineCrumb => step !== null);
}

/** THE TRADE PAGE: country, place, this trade. */
export function buildCellCrumbs(meta: { iso2?: string; geo?: string; trade?: string; city?: string } | undefined): SpineCrumb[] {
  const iso2 = clean(meta?.iso2).toUpperCase();
  const trade = clean(meta?.trade);
  if (!iso2 || !trade) return [];
  return [...countryAndPlace(iso2, clean(meta?.geo), clean(meta?.city)), { label: trade }];
}

/** THE CITY PAGE: country, this city. The slug is what the view holds; the identity file answers the name and the country. THE ONE TRAIL THAT MAY SAY A
 *  PLACE TWICE (truth-fixes round 3A2, the review's M1): a city named like its country reads "Singapore / Singapore" here, and it stays. The page is the last
 *  step and never a link, so folding the repeat leaves one step, which Crumbs draws as nothing (two steps at least) and takes from the page its only way
 *  back up to the country's page. A test row pins it as stated behaviour. */
export function buildCityCrumbs(citySlug: string | undefined): SpineCrumb[] {
  const slug = clean(citySlug).toLowerCase();
  const id = slug ? getCityIdentity(slug) : null;
  if (!id) return [];
  const c = countryCrumb(id.iso2);
  return c ? [c, { label: id.name }] : [];
}

/** THE DISTRICT PAGES: country, city, the districts hub, this district. The hub's own page ends at the hub, which is then the page and not a link. */
export function buildHoodCrumbs(citySlug: string | undefined, focus?: string | null): SpineCrumb[] {
  const slug = clean(citySlug).toLowerCase();
  const id = slug ? getCityIdentity(slug) : null;
  if (!id) return [];
  const out: SpineCrumb[] = countryAndPlace(id.iso2, slug, id.name);
  const district = clean(focus) ? districtPageTarget(slug, clean(focus)) : null;
  const hub = neighbourhoodsHubTarget(slug);
  if (district) {
    out.push(hub ? { label: COPY.crumbs.districts, href: hub.href } : { label: COPY.crumbs.districts });
    out.push({ label: district.name });
  } else {
    out.push({ label: COPY.crumbs.districts });
  }
  return out;
}

/** THE HOW-TO PAGE: country, this page's own subject. */
export function buildHowToCrumbs(iso2: string | undefined): SpineCrumb[] {
  const code = clean(iso2).toUpperCase();
  if (!code) return [];
  const c = countryCrumb(code);
  return c ? [c, { label: COPY.crumbs.howTo }] : [];
}

/** THE INDUSTRY PAGE: every trade we cover, the sector it belongs to as text (no page of its own), then this trade. It sits outside the geography, so its trail starts at the index. */
export function buildIndustryCrumbs(industryId: string | undefined): SpineCrumb[] {
  const facts = industryHeroFacts(clean(industryId));
  if (!facts?.name) return [];
  const out: SpineCrumb[] = [{ label: COPY.crumbs.industries, href: "/industries" }];
  const sector = facts.crumb?.[0];
  if (sector) out.push({ label: sector });
  out.push({ label: facts.name });
  return out;
}
