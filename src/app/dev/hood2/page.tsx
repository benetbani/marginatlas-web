/**
 * /dev/hood2 , the neighbourhood page, v2.
 *
 * THE LAST OF THE THREE PHANTOM ROUTES. `/dev/cell2`, `/dev/hood2` and
 * `/dev/industry2` were all in the default route list of
 * `audit_row_layout.mjs` and all three reported `ok, 0 unstyled, 0 clipped` for
 * days without ever having a route file. All three exist now.
 *
 * IT READS REAL DATA. `buildSpineHoodSeed` is the same builder the live
 * `/cities/[slug]/neighborhoods` route uses, over the seven broad London
 * districts. Nothing here is invented, so nothing needs a `SampleTag`.
 *
 * WHAT THE PAGE IS ABOUT, and it is one idea rather than a directory. The
 * seed's own myth block states it: revenue rank and rent rank are different
 * lists. The loudest district takes the most and hands a large share of the
 * lift straight to the lease. So the page leads on rent against the city rate,
 * not on revenue, because rent is the figure that decides what survives.
 *
 * WHAT IS DELIBERATELY NOT HERE:
 *
 * - **A map.** The seed carries a lat and lng per district and the previous
 *   generation drew pins from them. A map is a real component with real
 *   decisions in it, and porting one is not the same as porting a list. It
 *   stays on the previous-generation page until the founder rules on the v2
 *   version.
 * - **A keep claim per district.** The adapter refuses to derive one and says
 *   so: the retired keep index is gone and nothing replaced it. Rent against
 *   the city rate is knowable; what an owner keeps street by street is not.
 * - **A ranking that reads as a recommendation.** The districts are ordered by
 *   rent, lightest first, which is a measurement. Calling the top one "best"
 *   would be a verdict the data does not support.
 */
import { notFound } from "next/navigation";

import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { Statblock, type StatRow } from "@/components/spine2/Statblock";
import { ChapterGap } from "@/components/spine2/page/ChapterGap";
import { buildSpineHoodSeed } from "@/lib/spine/adapt_hood";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Neighbourhoods , v2 proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

/** London, because it is the only city with curated districts behind it. Every
 *  other city falls through to the non-spine page upstream. */
const CITY = "london";

const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

type District = {
  name: string;
  slug: string;
  character?: string;
  tags?: string[];
  rent_mult?: number;
  rev_vs_city_pct?: number;
  price_tier?: string;
  walkability?: number;
  blurb?: string;
  verdict?: string;
  best_trades?: Array<{ name?: string } | string>;
  cell_href?: string;
};

export default async function HoodV2Proposal() {
  const d = await buildSpineHoodSeed(CITY);
  if (!d) notFound();

  const meta = d.meta ?? {};
  const districts: District[] = d.districts ?? [];

  /* Lightest lease first. That is a measurement, not a recommendation, and the
     ordering is the same one the adapter uses for its own derived notes so the
     page and the masthead cannot disagree about which district is which. */
  const byRent = [...districts].sort(
    (a, b) => (a.rent_mult ?? Infinity) - (b.rent_mult ?? Infinity),
  );

  /**
   * The rent row. The figure is the multiple against the city rate, which is
   * the one thing here that is genuinely knowable, and the qualifier carries
   * the revenue read so the value slot holds a figure and not a phrase.
   */
  const rentRows: StatRow[] = byRent.map((n) => ({
    icon: "commercial-rent" as GlyphId,
    label: n.name,
    sub: isNum(n.rev_vs_city_pct)
      ? `takings ${n.rev_vs_city_pct >= 0 ? "+" : ""}${Math.round(n.rev_vs_city_pct)}% against the city`
      : "no revenue read for this district",
    value: isNum(n.rent_mult) ? `x${n.rent_mult.toFixed(2)}` : null,
  }));

  const lightest = byRent[0];
  const heaviest = byRent[byRent.length - 1];

  return (
    <div className="av2" style={{ position: "relative" }}>
      <Place />
      <div className="wrap">
        <header className="mast">
          <div className="in">
            <span className="brand">
              <span className="m" />
              Margin Atlas
            </span>
            <nav className="lat" aria-label="Where you are">
              <a href="/">Home</a>
              <span className="s">&rsaquo;</span>
              <a href="/world">The world</a>
              <span className="s">&rsaquo;</span>
              <a href={meta.city_href ?? `/cities/${CITY}`}>{meta.city ?? "London"}</a>
              <span className="s">&rsaquo;</span>
              <span>Districts</span>
            </nav>
          </div>
        </header>

        {/* 1 , THE ANSWER. Rent against the city rate, because that is the
            figure that decides what survives, and because the seed refuses to
            derive a keep per district and says so. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <div className="grid g12" style={{ gap: 40, alignItems: "center" }}>
            <div>
              <h1 style={{ maxWidth: "19ch" }}>
                The lease is the difference between two addresses.
              </h1>
              <p className="k" style={{ margin: "16px 0 0", maxWidth: "46ch" }}>
                {meta.hero_note ??
                  "Rent as a multiple, district by district. Takings are not what stays."}
              </p>
            </div>

            <div className="panel pad">
              <div className="statblock">
                <div className="hd">
                  <GlyphIcon id={"where-it-pays" as GlyphId} size={18} />
                  {meta.city ?? "London"}
                </div>
                <div className="row">
                  <span className="nm">
                    Districts on the map
                    <span className="s">the broad ones, not every street</span>
                  </span>
                  <span className="v">{districts.length || "none yet"}</span>
                </div>
                <div className="row">
                  <span className="nm">
                    Lightest lease
                    <span className="s">{lightest?.name ?? "not filled"}</span>
                  </span>
                  <span className="v">
                    {isNum(lightest?.rent_mult) ? `x${lightest.rent_mult.toFixed(2)}` : "not filled"}
                  </span>
                </div>
                <div className="row">
                  <span className="nm">
                    Heaviest lease
                    <span className="s">{heaviest?.name ?? "not filled"}</span>
                  </span>
                  <span className="v">
                    {isNum(heaviest?.rent_mult) ? `x${heaviest.rent_mult.toFixed(2)}` : "not filled"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {meta.provenance_line ? (
            <p className="note" style={{ margin: "18px 0 0", maxWidth: "76ch" }}>
              {meta.provenance_line}
            </p>
          ) : null}
        </section>

        {/* 2 , EVERY DISTRICT BY RENT. Lightest first. The figure is the
            multiple; the takings read is the qualifier, because a multiple is a
            figure and "takings 12% above the city" is a phrase. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          {rentRows.some((r) => r.value != null) ? (
            <>
              <Statblock
                header={{ label: "What the lease costs, as a multiple", icon: "commercial-rent" as GlyphId }}
                rows={rentRows}
              />
              <p className="k" style={{ margin: "12px 0 0", maxWidth: "64ch" }}>
                Lightest lease first. That is a measurement and not a
                recommendation: a light lease in a quiet district and a heavy
                one on a busy street can end the year in the same place. The
                baseline of 1.0 is a district with no premium, so read these
                against each other rather than against the number one.
              </p>
            </>
          ) : (
            <>
              <div className="lab" style={{ marginBottom: 14 }}>
                <GlyphIcon id={"commercial-rent" as GlyphId} size={18} /> What the lease costs
              </div>
              <ChapterGap
                reason="No district rent multiples have been filled for this city."
                scope="this city"
              />
            </>
          )}
        </section>

        {/* 3 , WHAT EACH DISTRICT IS. The character read, which is the part a
            figure cannot carry. One card per district, its own words from the
            seed, never written here. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 16 }}>
            What each district is like
          </div>
          {districts.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px 32px",
              }}
            >
              {byRent.map((n) => (
                <div key={n.slug}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span
                      className="fig"
                      style={{ fontSize: 18, fontWeight: 600, color: "var(--terra-deep)" }}
                    >
                      {isNum(n.rent_mult) ? `x${n.rent_mult.toFixed(2)}` : "?"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                      {n.cell_href ? <a href={n.cell_href}>{n.name}</a> : n.name}
                    </span>
                  </div>
                  {/* ONE expression below, not two. Written as two adjacent JSX
                      expressions on separate lines, the newline and indent
                      between them collapse to a space and the page renders
                      "mid residential , mid" with a space before the comma.
                      Invisible in the source, obvious the moment the rendered
                      text is read as prose. */}
                  {n.character ? (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                      {n.character + (n.price_tier ? `, ${n.price_tier}` : "")}
                    </div>
                  ) : null}
                  {/* THE PER-DISTRICT VERDICT IS NOT RENDERED, and leaving it
                      out is the point rather than an omission.

                      The adapter derives it from one comparison and it can only
                      ever produce three sentences. Every London district sits
                      above the city rate, so all seven printed the identical
                      line: "Rent runs heavier than the city rate here; the
                      lease takes its share before the takings arrive." Seven
                      copies of one sentence is not seven readings, it is
                      wallpaper, and it flatly contradicted the hero calling the
                      first one the lightest lease.

                      The multiple beside the name already says everything that
                      sentence said, and says it in a form a reader can compare.
                      The rule behind it is stated once below the block instead
                      of seven times inside it. */}
                  {n.blurb ? (
                    <p className="k" style={{ margin: "8px 0 0", fontSize: 12.5 }}>
                      {n.blurb}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <ChapterGap
              reason="No districts have been curated for this city, so there is nothing to describe."
              scope="this city"
            />
          )}
        </section>

        {/* 4 , THE MYTH. The "yes, but not the main reason" move, and the
            sharpest thing on the page: revenue rank and rent rank are simply
            not the same list. The claim, the reality and the tell all come from
            the seed. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            <GlyphIcon id={"myth-reality" as GlyphId} size={18} /> What everyone assumes
          </div>
          {meta.myth?.claim ? (
            <>
              <p
                className="k"
                style={{ margin: 0, maxWidth: "62ch", textDecoration: "line-through" }}
              >
                {meta.myth.claim}
              </p>
              <p className="k" style={{ margin: "12px 0 0", maxWidth: "66ch" }}>
                {meta.myth.reality}
              </p>
              {meta.myth.tell ? (
                <p className="note" style={{ margin: "14px 0 0", maxWidth: "62ch" }}>
                  {meta.myth.tell}
                </p>
              ) : null}
            </>
          ) : (
            <ChapterGap
              reason="No claim has been checked against the district figures for this city."
              scope="this city"
            />
          )}
        </section>

        {/* 5 , THE EXIT. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Where to go from here
          </div>
          <div className="close">
            <div className="links">
              <a href={meta.city_href ?? `/cities/${CITY}`}>
                The city as a whole
                <span className="g">{meta.city ?? "London"}</span>
              </a>
              <a href="/gb/london/restaurants">
                One trade here, in full
                <span className="g">restaurants</span>
              </a>
              <a href="/world">
                Somewhere else entirely
                <span className="g">the world</span>
              </a>
            </div>
            <p className="k" style={{ margin: 0, maxWidth: "52ch" }}>
              A district read is a rent read. What an owner keeps depends on the
              trade as much as the address, which is what the trade-by-place
              page is for.
            </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
