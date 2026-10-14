/**
 * src/lib/home/contents.ts
 *
 * THE ATLAS AS A CONTENTS PAGE (plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 4A; spec
 * docs/superpowers/specs/2026-10-13-home-quiet-editorial-design.md, section 2, item 3): six numbered departments, each its title,
 * its one line, at most four members chosen by a rule read from the code (never a hand-kept list of places or trades) and its door. A
 * department never pads: a member that fails its rule is left out, so a thin state draws fewer rows and the door still stands.
 *
 *   01 Countries      the countries held to the registers (countryHeldToRegisters: the UK), then the world page's broadest coverage
 *                     (buildWorldAtlas's `deepest`, its "where the map goes furthest"), each with a page (countryPageTarget); a flag
 *   02 Cities         the cities held to sources (cityHeldToSources), largest metro first (buildCityCards), each printing its own figure on
 *                     its page (`payUsd`, the city's own typical pay) and holding its small photograph (cityThumb); names only
 *   03 Trades         rule 32's everyday trades (EVERYDAY_TRADES, in its order), each whose world net is the trade's own (resolveTradeNet's
 *                     shard branch, never the sector profile's residual), printing the figure its industry page prints (industryHeroFacts)
 *   04 Tools          the four tools: Decide, Check, Calculator, Compare
 *   05 Reading        the knowledge base's tracks that hold an article (LEARN_BY_FAMILY), then the newest post whose title holds no list
 *                     count (getAllPosts is newest first; src/lib/home/list_counts.ts)
 *   06 How it is made Sources and licences, the corrections log, the coverage report; its door About the figures, the method
 *
 * Each builder takes its source as an argument with the real one as its default, so tests/home/contents.test.ts feeds it thin and odd
 * states. Server only: it reads the shards, the coverage report and the blog's files.
 */
import { COUNTRIES, industryToSlug, slugToIndustry, tradeRowName } from "@/lib/taxonomy";
import { countryHeldToRegisters, cityHeldToSources } from "@/lib/uk/registers/register_city";
import { countryPageTarget } from "@/lib/geo/page_targets";
import { getCoverageReport } from "@/lib/quality/coverage-report";
import { getCoverageRows } from "@/lib/coverage/report";
import { buildWorldAtlas } from "@/lib/scores/world_atlas";
import { buildCityCards, type CityCard } from "@/lib/spine/city_cards";
import { cityThumb } from "@/lib/cities/city_images";
import { EVERYDAY_TRADES } from "@/lib/spine/everyday_trades";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { industryPictogramId } from "@/lib/brand/industry_pictogram";
import { LEARN_BY_FAMILY } from "@/lib/learn/articles";
import { getAllPosts } from "@/lib/blog";
import { UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";
import { holdsListCount } from "@/lib/home/list_counts";
import { COPY } from "@/lib/spine/copy";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";
import type { AtlasPictogramId } from "@/components/brand/pictograms";

export const DEPARTMENT_ORDER = ["countries", "cities", "trades", "tools", "reading", "method"] as const;
export type DepartmentKey = (typeof DEPARTMENT_ORDER)[number];
/** At most four members a department (the spec: three or four rows), never padded to it. */
export const MEMBERS_MAX = 4;

export type MemberMark = { kind: "flag"; iso2: string } | { kind: "photo"; src: string; position: string | null } | { kind: "pictogram"; id: AtlasPictogramId } | { kind: "icon"; id: AtlasIconId };
export type ContentsMember = { key: string; name: string; href: string; mark: MemberMark; figure: { text: string; prov: Provenance } | null };
export type ContentsDepartment = { key: DepartmentKey; index: string; title: string; line: string; members: ContentsMember[]; door: { label: string; href: string } };
export type Contents = Record<DepartmentKey, ContentsDepartment>;

/** Each department's door. The method's is About the figures' reading section, the address the mobile sheet gives that page (SHEET_TRUST). */
const DOOR_HREF: Record<DepartmentKey, string> = { countries: "/countries", cities: "/cities", trades: "/industries", tools: "/tools", reading: "/learn", method: "/about-data#reading" };
/** About the figures, the method: the sixth department's door and the band's one link (HomeBand). */
export const ABOUT_THE_FIGURES = { label: COPY.home.contents.depts.method.door, href: DOOR_HREF.method };

function dept(key: DepartmentKey, members: ContentsMember[]): ContentsDepartment {
  const D = COPY.home.contents.depts[key];
  return { key, index: String(DEPARTMENT_ORDER.indexOf(key) + 1).padStart(2, "0"), title: D.title, line: D.line, members: members.slice(0, MEMBERS_MAX), door: { label: D.door, href: DOOR_HREF[key] } };
}

/** The world page's "where the map goes furthest": the broadest covered countries, as /world builds them (src/app/world/page.tsx). */
export function worldBroadest(): string[] {
  const report = getCoverageReport();
  const valid = new Set(COUNTRIES.map((c) => c.code));
  const nameOf = (iso2: string) => COUNTRIES.find((c) => c.code === iso2)?.name || iso2;
  return buildWorldAtlas({ ...report, countries: getCoverageRows() }, valid, nameOf, report?.totals?.industries_covered ?? 0).deepest.map((c) => c.iso2);
}

/** 01: the countries held to the registers, then `broadest`, each once and each with a page. */
export function contentsCountries(broadest: readonly string[] = worldBroadest()): ContentsDepartment {
  const held = COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).map((c) => c.code);
  const seen = new Set<string>();
  const members: ContentsMember[] = [];
  for (const raw of [...held, ...broadest]) {
    const code = String(raw).toUpperCase();
    if (seen.has(code)) continue;
    seen.add(code);
    const target = countryPageTarget(code);
    if (!target) continue;
    members.push({ key: code.toLowerCase(), name: target.label, href: target.href, mark: { kind: "flag", iso2: code }, figure: null });
  }
  return dept("countries", members);
}

/** The city cards of every country held to the registers, in the cards' own order (largest metro first). */
export function heldCityCards(): Array<{ iso2: string; card: CityCard }> {
  return COUNTRIES.filter((c) => countryHeldToRegisters(c.code)).flatMap((c) => (buildCityCards(c.code)?.cards ?? []).map((card) => ({ iso2: c.code, card })));
}

/** 02: the cities held to sources, each printing its own figure on its page and holding its small photograph; names only. */
export function contentsCities(cards: ReadonlyArray<{ iso2: string; card: CityCard }> = heldCityCards()): ContentsDepartment {
  const members: ContentsMember[] = [];
  for (const { iso2, card } of cards) {
    if (!cityHeldToSources(iso2, card.id) || typeof card.payUsd !== "number") continue;
    const thumb = cityThumb(card.id);
    if (!thumb) continue;
    members.push({ key: card.id, name: card.name, href: card.href, mark: { kind: "photo", src: thumb.src, position: thumb.position }, figure: null });
  }
  return dept("cities", members);
}

/** A trade's own world figure, the answer its industry page prints, or null where the trade holds no net of its own (the sector profile's
 *  residual is the sector's figure, never a trade row's). Stamped from the shard field the net is read from, an estimate (the site's kind
 *  for a world figure no register holds). */
export function tradeOwnFigure(industryId: string): { text: string; prov: Provenance } | null {
  const facts = industryHeroFacts(industryId);
  if (!facts?.answer || facts.net?.branch !== "shard") return null;
  return { text: facts.answer.value, prov: { src: `facts/industry/${industryId}.json:margin_ladder.net_margin_pct`, kind: "estimate" } };
}

/** 03: rule 32's trades in its order, each once, each whose world net is its own. */
export function contentsTrades(slugs: readonly string[] = [...EVERYDAY_TRADES]): ContentsDepartment {
  const seen = new Set<string>();
  const members: ContentsMember[] = [];
  for (const slug of slugs) {
    const ind = slugToIndustry(slug);
    if (!ind || seen.has(ind.id)) continue;
    seen.add(ind.id);
    const figure = tradeOwnFigure(ind.id);
    if (!figure) continue;
    members.push({ key: ind.id, name: tradeRowName(ind.id, ind.name), href: `/industries/${industryToSlug(ind.id)}`, mark: { kind: "pictogram", id: industryPictogramId(ind.id) }, figure });
  }
  return dept("trades", members);
}

const TOOLS: ReadonlyArray<{ key: keyof typeof COPY.home.contents.tools; href: string; icon: AtlasIconId }> = [
  { key: "decide", href: "/decide", icon: "where-it-pays" },
  { key: "check", href: "/check", icon: "benchmark" },
  { key: "calculator", href: "/calculator", icon: "calculator" },
  { key: "compare", href: "/compare", icon: "compare" },
];

/** 04: the four tools. */
export function contentsTools(): ContentsDepartment {
  return dept("tools", TOOLS.map((t) => ({ key: t.key, name: COPY.home.contents.tools[t.key], href: t.href, mark: { kind: "icon", id: t.icon }, figure: null })));
}

/* The learn page's three tracks, each at its section's own anchor (src/app/(site)/learn/page.tsx, id={`track-${track.family}`}); a track
   with no article self-omits there, so its member is drawn only when it holds one. */
const TRACKS: ReadonlyArray<{ family: "A" | "B" | "C"; href: string; icon: AtlasIconId }> = [
  { family: "A", href: "/learn#track-A", icon: "revenue" },
  { family: "B", href: "/learn#track-B", icon: "owner-keeps" },
  { family: "C", href: "/learn#track-C", icon: "range" },
];

/** 05: the tracks that hold an article, then the newest post whose title holds no list count. */
export function contentsReading(posts: ReadonlyArray<{ slug: string; title: string }> = getAllPosts(), tracksHeld: (family: "A" | "B" | "C") => boolean = (f) => LEARN_BY_FAMILY(f).length > 0): ContentsDepartment {
  const members: ContentsMember[] = TRACKS.filter((t) => tracksHeld(t.family)).map((t) => ({ key: `track-${t.family}`, name: COPY.home.contents.tracks[t.family], href: t.href, mark: { kind: "icon", id: t.icon }, figure: null }));
  const post = posts.find((p) => p.title.trim() !== "" && !holdsListCount(p.title));
  if (post) members.push({ key: `post-${post.slug}`, name: post.title, href: `/blog/${post.slug}`, mark: { kind: "icon", id: "bookmark" }, figure: null });
  return dept("reading", members);
}

/** 06: the sources list, the corrections log and the coverage report; the door About the figures. */
export function contentsMethod(): ContentsDepartment {
  const M = COPY.home.contents.method;
  return dept("method", [
    { key: "sources", name: UK_SOURCES_FOOT.link, href: UK_SOURCES_FOOT.href, mark: { kind: "icon", id: "filings" }, figure: null },
    { key: "corrections", name: M.corrections, href: "/corrections", mark: { kind: "icon", id: "change" }, figure: null },
    { key: "coverage", name: M.coverage, href: "/coverage", mark: { kind: "icon", id: "global-spread" }, figure: null },
  ]);
}

/** The six, from their real sources. */
export function buildContents(): Contents {
  return { countries: contentsCountries(), cities: contentsCities(), trades: contentsTrades(), tools: contentsTools(), reading: contentsReading(), method: contentsMethod() };
}
