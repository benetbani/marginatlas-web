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

/** The country step, where we publish that country's page. */
function countryCrumb(iso2: string): SpineCrumb | null {
  const t = countryPageTarget(iso2);
  return t ? { label: t.label, href: t.href } : null;
}

/** The place step: a city page, a region page, or the place's name as text. */
function placeCrumb(iso2: string, geo: string, fallback?: string): SpineCrumb | null {
  const t = geoPageTarget(iso2, geo);
  if (t) return { label: t.name, href: t.href };
  const name = clean(fallback) || clean(geo);
  return name ? { label: name } : null;
}

/** THE TRADE PAGE: country, place, this trade. */
export function buildCellCrumbs(meta: { iso2?: string; geo?: string; trade?: string; city?: string } | undefined): SpineCrumb[] {
  const iso2 = clean(meta?.iso2).toUpperCase();
  const trade = clean(meta?.trade);
  if (!iso2 || !trade) return [];
  const out: SpineCrumb[] = [];
  const c = countryCrumb(iso2);
  if (c) out.push(c);
  const p = placeCrumb(iso2, clean(meta?.geo), clean(meta?.city));
  if (p) out.push(p);
  out.push({ label: trade });
  return out;
}

/** THE CITY PAGE: country, this city. The slug is what the view holds; the identity file answers the name and the country. */
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
  const out: SpineCrumb[] = [];
  const c = countryCrumb(id.iso2);
  if (c) out.push(c);
  const p = placeCrumb(id.iso2, slug, id.name);
  if (p) out.push(p);
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
