/**
 * src/lib/london/market.ts
 *
 * THE single loader for the curated London market dataset
 * (data/london/london_market_v1.json). Three modules used to import that file
 * independently (scores/cell_board.ts, scores/city_board.ts,
 * london/take_home.ts); they now all read it through here, so the one
 * correction below cannot be bypassed by adding a fourth reader.
 *
 * WHAT WAS WRONG. The file carries three figures per activity, `revenue`,
 * `net_margin_pct` and `owner_take_home`, of which only two are independent.
 * All twenty disagreed. Measured by calling the real buildCellView with exactly
 * the inputs the cell page passes on a London cell, then reading the printed
 * strings back:
 *
 *   London restaurants     $720,000 revenue, "Net margin 5%", "Owner take-home
 *                          $48K". 5% of $720,000 is $36,000. 33% out.
 *   London specialty trades $240,000, "12%", "$58K". 12% is $28,800. 101% out.
 *   London hotels          $1,600,000, "10%", "$130K". 10% is $160,000, so this
 *                          one printed a take-home BELOW its own shown margin,
 *                          which is the exact defect src/lib/finance/
 *                          owner_take_home.ts was written to prevent. The
 *                          curated branch short-circuits that module entirely.
 *
 * The gap runs +10% to +101%, and -19% on hotels. Every one of the twenty is
 * above the 0.5pp noise floor.
 *
 * WHY THIS IS A CONTRADICTION AND NOT TWO QUANTITIES UNDER ONE LABEL. That was
 * the first hypothesis and it was tested before anything was changed, because
 * take-home above net profit is what you would expect if take-home meant
 * profit plus the owner's own wage. It does not hold here:
 *
 *   1. The site has exactly one definition and it is written down twice. In
 *      src/lib/finance/net_profit.ts, `net_margin` is `net_profit /
 *      gross_revenue` and `net_profit` is `clamped_net_margin * gross_revenue`,
 *      so on every non-London cell the pair closes by construction. And the
 *      spine seed for this very cell, src/lib/spine-seeds/cells/
 *      GB-london-restaurants.json, states the identity verbatim in its
 *      `_identity` block: "owner take = keeps% x rev".
 *   2. The residual is already net of all wages. The ratified cost-share
 *      invariant (scripts/verify_cost_share_invariant.ts) is cost shares plus
 *      net margin = 1.0, with labour among the cost shares, so an owner wage is
 *      inside the costs and cannot also sit on top of the margin.
 *   3. The page prints them under one meaning. The masthead reads "Owner
 *      take-home $48K" while the money-goes card reads "What the owner keeps"
 *      at 5 per $100 of the same revenue. There is no label under which 5 and
 *      6.7 are both what the owner keeps.
 *   4. Hotels breaks the wage reading anyway, in the wrong direction.
 *
 * Nothing in the file, its schema or its source note documents any other
 * definition, so asserting one would have been inventing a meaning to keep a
 * number. The file's own note reads "Treat as directional ranges".
 *
 * THE CORRECTION. `owner_take_home` is recomputed from the file's own two other
 * figures, revenue x net_margin_pct, at load. No figure is imported from
 * outside the file, nothing is averaged, and the direction (margin is the
 * input, take-home is derived) is the one the seed's identity states. The
 * shared net-margin clamp was measured first and moves none of the twenty
 * margins, so the derived take-home agrees with the clamped margin the city
 * board prints as well as the raw one the cell page prints.
 *
 * FOUR OF THE TWENTY ACTIVITIES WERE UNREACHABLE, and had been for as long as
 * the slugs they are keyed on have been stale. The file keys activities by the
 * activity's URL slug, and every reader looks them up with
 * `industryToSlug(cell.industry_id)`. Four keys are not any industry's slug:
 *
 *   cafes-coffee       is now cafes-coffee-shops        (id cafes_coffee)
 *   childcare-social   is now childcare-social-services (id childcare_social)
 *   marketing-design   is now marketing-design-agencies (id marketing_design)
 *   specialty-trades   is now specialty-trades-mixed    (id specialty_trades)
 *
 * Enumerated rather than eyeballed: all 243 industry ids were mapped through
 * industryToSlug and compared against the 20 keys. The other 16 hit exactly one
 * industry each; these four hit none, so their curated economics, survival
 * curve and qualitative reads have never rendered anywhere.
 *
 * The re-key is a 1:1 identity, not a guess, and the code below asserts that
 * shape rather than hard-coding the four names. A legacy key is moved ONLY when
 * it is not already a live slug, AND the underscore form of the key is a real
 * industry id, AND that industry's current slug begins with the legacy key. All
 * four satisfy all three; anything that does not is left exactly where it is. So
 * a future slug change either resolves the same way or does nothing, and can
 * never point a curated London entry at a different trade.
 *
 * ONE READER STILL BYPASSES THIS MODULE, so the header's old claim that a
 * fourth reader is impossible was not true. src/lib/scores/activity_board.ts
 * imports data/london/london_market_v1.json directly for its survival
 * archetype. Nothing is wrong today (the take-home correction touches only
 * owner_take_home, and that reader wants only `survival`), but it reads the
 * legacy keys, so the activity pages for those four trades still find no
 * survival curve. That file is not this module's to change.
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE AND STAYS THERE.
 * Classified 2026-08-18. verify_take_home_identity flags a module that reaches
 * for `net_margin_pct` without importing the resolver. This one is the
 * correction ITSELF: it closes the identity at load, from the file's own two
 * independent figures, so importing the resolver here would be circular. The
 * resolver reconciles a structural profit against a shown margin; this file has
 * no structural profit to reconcile, only a curated margin and a revenue.
 *
 * Re-measured 2026-08-18: all 20 curated activities satisfy
 * take-home >= clamped margin x revenue, and the shared clamp moves NONE of the
 * 20 margins, so the derived figure agrees with the clamped margin the boards
 * print as well as with the raw one. Nothing here needs converting.
 *
 * Pure, no network, no side effects.
 */
import londonJson from "../../../data/london/london_market_v1.json";
import { industryToSlug, INDUSTRY_BY_ID } from "@/lib/taxonomy";

type EconomicsShape = {
  revenue: number;
  net_margin_pct: number;
  owner_take_home: number;
  firms: number;
};

/**
 * Deep copy of the dataset with every activity's `owner_take_home` re-derived
 * from its own `revenue` and `net_margin_pct`. An activity missing either
 * input, or missing the economics block, is left exactly as it was: a figure
 * that cannot be derived is never guessed.
 */
function closeTakeHomeIdentity(file: typeof londonJson): typeof londonJson {
  const clone = JSON.parse(JSON.stringify(file)) as {
    activities: Record<string, { economics?: EconomicsShape }>;
  };
  for (const entry of Object.values(clone.activities)) {
    const ec = entry.economics;
    if (!ec) continue;
    if (!Number.isFinite(ec.revenue) || !Number.isFinite(ec.net_margin_pct)) {
      continue;
    }
    ec.owner_take_home = Math.round((ec.revenue * ec.net_margin_pct) / 100);
  }
  return clone as unknown as typeof londonJson;
}

/**
 * Move any activity keyed on a stale URL slug onto the slug its industry
 * carries today, so a curated entry cannot be silently unreachable. See the
 * module header for the three conditions; a key that fails any of them is left
 * untouched, and an entry is never overwritten if the live slug is already
 * present in the file.
 */
function rekeyLegacySlugs(file: typeof londonJson): typeof londonJson {
  const clone = file as unknown as { activities: Record<string, unknown> };

  // Every slug an industry actually resolves to today.
  const liveSlugs = new Set<string>();
  for (const id of Object.keys(INDUSTRY_BY_ID)) liveSlugs.add(industryToSlug(id));

  for (const key of Object.keys(clone.activities)) {
    if (liveSlugs.has(key)) continue;
    const industryId = key.replace(/-/g, "_");
    if (!(industryId in INDUSTRY_BY_ID)) continue;
    const current = industryToSlug(industryId);
    if (current === key) continue;
    if (!current.startsWith(key)) continue;
    if (current in clone.activities) continue;
    clone.activities[current] = clone.activities[key];
    delete clone.activities[key];
  }
  return clone as unknown as typeof londonJson;
}

/**
 * The curated London market dataset, with the stale activity keys moved onto
 * their live slugs and the take-home identity closed. Import this, never the
 * JSON.
 */
export const LONDON_MARKET = rekeyLegacySlugs(closeTakeHomeIdentity(londonJson));
