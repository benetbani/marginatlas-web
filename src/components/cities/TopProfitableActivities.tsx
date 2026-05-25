/**
 * TopProfitableActivities (CitiesFix2 sec 8 + 9 founder rev).
 *
 * Two side-by-side ranked lists:
 *   - top 5 most profitable activities
 *   - top 5 least profitable activities
 *
 * Hard fixes per founder feedback:
 *   - DROP sole-practitioner-by-design activities (consultants,
 *     freelancers, sole-traders). Their nominally high margins come
 *     from having no employees, no overhead, no inventory. Including
 *     them at the top of the list is misleading.
 *   - DROP activities that fall through to the default 3% margin.
 *     Showing every loss-making activity at 3% is unrealistic. We
 *     only rank activities with real measured net margins from
 *     industry_margins.json.
 *
 * Data source: src/lib/finance/industry_margins.json (explicit per
 * industry net margins; we drop any entry that does not have a
 * margin set or that falls back to the default).
 */

import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";

type Row = {
  gross_margin?: number;
  operating_margin?: number;
  net_margin?: number;
  notes?: string;
};

type MarginsFile = {
  default_fallback?: Row;
  industries: Record<string, Row>;
};

const FILE = industryMarginsJson as unknown as MarginsFile;

// CitiesFix2 sec 8: activities to drop because they are sole-practitioner
// by design. Their margins are arithmetically high (no overhead) but
// not directly comparable to activities that require staff, premises,
// or inventory. Ranking them at the top of "most profitable" misleads.
const SOLE_PRACTITIONER_BLOCKLIST = new Set<string>([
  "freelance_consultants",
  "management_consulting",
  "personal_trainers",
  "personal_coaching",
  "tutoring_education",
  "tutors_test_prep",
  "freelance_designers",
  "freelance_developers",
  "translators_interpreters",
  "writers_journalists",
  "independent_artists",
  "music_teachers_private",
  "yoga_instructors_solo",
  "real_estate_solo_agents",
  "notaries_solo",
  "tax_preparers_solo",
]);

// Name-pattern filter as a second line of defense (catches solo activities
// not in the explicit blocklist).
const SOLO_NAME_PATTERN =
  /\b(consult|freelance|independent|sole[\s-]?trader|solo|contractor|gig|coach|tutor|personal[\s-]?train)/i;

type Ranked = {
  id: string;
  name: string;
  slug: string;
  netMargin: number;
};

function buildRankings(): Ranked[] {
  const rows: Ranked[] = [];
  for (const [id, row] of Object.entries(FILE.industries || {})) {
    const net = row?.net_margin;
    if (typeof net !== "number" || !isFinite(net)) continue;

    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;

    // CitiesFix2 sec 8: drop sole-practitioner-by-design rows.
    if (SOLE_PRACTITIONER_BLOCKLIST.has(id)) continue;
    if (SOLO_NAME_PATTERN.test(id)) continue;
    if (SOLO_NAME_PATTERN.test(ind.name)) continue;

    // CitiesFix2 sec 8: drop corp_only and mixed_caution (smb-only ranking).
    const audience = ind.audience || "smb_friendly";
    if (audience !== "smb_core" && audience !== "smb_friendly") continue;

    rows.push({
      id,
      name: ind.name,
      slug: industryToSlug(id),
      netMargin: net,
    });
  }
  rows.sort((a, b) => b.netMargin - a.netMargin);
  return rows;
}

function formatPct(n: number): string {
  if (!isFinite(n)) return "-";
  return `${(n * 100).toFixed(1)}%`;
}

export function TopProfitableActivities({
  countryIso2,
}: {
  countryIso2: string;
}) {
  const ranked = buildRankings();
  if (ranked.length < 10) return null;

  const top5 = ranked.slice(0, 5);
  const bottom5 = ranked.slice(-5).reverse();

  return (
    <section className="mb-12 md:mb-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Profit margins, by activity
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
        What earns and what bleeds
      </h2>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Net profit margin by activity. Sole-practitioner activities
        (consulting, freelance work, solo training) are excluded so
        the ranking reflects businesses with real overhead. Activities
        without a measured margin are not shown.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <RankedList
          title="Most profitable"
          rows={top5}
          countryIso2={countryIso2}
        />
        <RankedList
          title="Least profitable"
          rows={bottom5}
          countryIso2={countryIso2}
        />
      </div>
    </section>
  );
}

function RankedList({
  title,
  rows,
  countryIso2,
}: {
  title: string;
  rows: Ranked[];
  countryIso2: string;
}) {
  return (
    <div className="rounded-2xl border border-parchment bg-white p-4 md:p-5">
      <div className="text-[11px] uppercase tracking-wide text-cocoa-700/70 font-semibold mb-3">
        {title}
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.id}>
            <a
              href={`/${countryIso2.toLowerCase()}/${countryIso2.toLowerCase()}/${r.slug}`}
              className="flex items-baseline justify-between gap-3 py-1.5 px-2 -mx-2 rounded-md hover:bg-cream-100 transition-colors"
            >
              <span className="text-sm text-ink-900 truncate">{r.name}</span>
              <span className="text-sm font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                {formatPct(r.netMargin)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
