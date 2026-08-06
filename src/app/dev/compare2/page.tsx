/**
 * /dev/compare2 , two cities side by side, rebuilt to the v2 system.
 *
 * A REVIEW ARTIFACT at a dev route. Nothing links to it. The live
 * `/compare/cities/[pair]` is untouched and its URL is never renamed.
 *
 * WHY THIS PAGE. It answers the one question the site cannot answer in a single
 * view: is it better here, or there. Everything else on the site is one place
 * at a time.
 *
 * THE STRUCTURAL LINE IS THE POINT, NOT THE TABLE. Each seeded pair carries an
 * editorial hook written with it, and it is the most useful sentence on the
 * page: "Two financial capitals on opposite sides of the Atlantic. London is
 * older and denser, New York is bigger and richer per resident." A table of
 * three rows tells a reader what is different. That sentence tells them why,
 * which is the difference between a statistic and a finding.
 *
 * NO WINNER, NO SCORE. Three measures, both cities, and the reader decides.
 * A composite would mean weights nobody ratified, and it would rank two places
 * against each other on a scale this data cannot carry.
 *
 * NO POPULATION, NO GDP. Both are in the file and both are banned as trivia by
 * the founder's standing rule. A bigger city is not a better one to open in,
 * and printing the figure invites exactly that reading.
 */
import * as React from "react";

import { CountryFlag } from "@/components/CountryFlag";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { GlyphId } from "@/components/spine2/glyphs";
import { Place } from "@/components/spine2/Place";
import { SiteFooter } from "@/components/spine2/SiteFooter";
import { cityPair, seededPairs, cityName, cityIso2 } from "@/lib/compare/city_pair";

import "@/styles/atlas-spine.css";

export const metadata = {
  title: "Compare , proposal , Margin Atlas dev",
  robots: { index: false, follow: false },
};

const LEFT = "london";
const RIGHT = "new-york";

export default function ComparePropos() {
  const pair = cityPair(LEFT, RIGHT);
  const others = seededPairs()
    .filter((p) => !(p.left === LEFT && p.right === RIGHT))
    .slice(0, 8);

  if (!pair) {
    return (
      <div className="av2" style={{ position: "relative" }}>
        <Place />
        <div className="wrap">
          <section className="panel pad rise" style={{ marginTop: 16 }}>
            <p className="note" style={{ margin: 0 }}>
              That pair is not one this site has figures for.
            </p>
          </section>
        </div>
      </div>
    );
  }

  const Side = ({ s }: { s: { name: string; iso2: string } }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <CountryFlag iso2={s.iso2} className="w-[18px]" />
      {s.name}
    </span>
  );

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
              <a href="/world">The world</a>
              <span className="s">&rsaquo;</span>
              <a href="/compare">Compare</a>
            </nav>
          </div>
        </header>

        {/* 1 , THE PAIR, AND WHY THEY ARE A PAIR. The hook does the work a
            three row table cannot: it says what kind of difference this is
            before any figure is read. */}
        <section className="glass rise" style={{ padding: "30px 32px", marginTop: 16 }}>
          <h1 style={{ maxWidth: "20ch" }}>
            {pair.left.name} against {pair.right.name}.
          </h1>
          {pair.hook ? (
            <p className="k" style={{ margin: "16px 0 0", maxWidth: "58ch", fontSize: 15 }}>
              {pair.hook}
            </p>
          ) : null}
        </section>

        {/* 2 , THE THREE MEASURES. Both cities on every row, and the gap named
            in words rather than left for the reader to compute. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="statblock">
            <div className="hd">
              <GlyphIcon id={"compare" as GlyphId} size={18} />
              What actually differs
            </div>
            {/* The column heads go ABOVE the rows. They were below, so a reader
                met "$65K $75K" with no way to tell which column was which until
                after they had read both. */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1.25fr) 92px 92px",
                gap: 16,
                padding: "9px 0 10px",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <span />
              <span style={{ textAlign: "right" }}>
                <Side s={pair.left} />
              </span>
              <span style={{ textAlign: "right" }}>
                <Side s={pair.right} />
              </span>
            </div>
            {pair.lines.map((line) => (
              <div
                key={line.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.25fr) 92px 92px",
                  gap: 16,
                  alignItems: "baseline",
                  padding: "13px 0",
                  borderTop: "1px solid var(--grp-rule)",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--ink)" }}>
                  {line.label}
                  <span style={{ display: "block", fontSize: 11, color: "var(--muted)" }}>
                    {line.sub}
                    {line.gap ? `, ${line.gap}` : ""}
                  </span>
                </span>
                <span
                  className="fig"
                  style={{ fontSize: 17, fontWeight: 600, textAlign: "right", color: "var(--ink)" }}
                >
                  {line.left ?? "not published"}
                </span>
                <span
                  className="fig"
                  style={{ fontSize: 17, fontWeight: 600, textAlign: "right", color: "var(--ink)" }}
                >
                  {line.right ?? "not published"}
                </span>
              </div>
            ))}
          </div>

          <p className="k" style={{ margin: "16px 0 0", maxWidth: "60ch" }}>
            No score, and no winner. What people earn sets what a customer can
            spend and what a rota costs, and those two pull in opposite
            directions. Which of them matters more depends on the trade, so the
            trade page is where the answer is.
          </p>
        </section>

        {/* 3 , THE OTHER PAIRS. Flags rather than a wall of names, and the hook
            trimmed to its first sentence so the list stays a list. */}
        <section className="panel pad rise" style={{ marginTop: 18 }}>
          <div className="lab" style={{ marginBottom: 14 }}>
            Other pairs worth reading
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px 28px",
            }}
          >
            {others.map((p) => {
              const ln = cityName(p.left);
              const rn = cityName(p.right);
              if (!ln || !rn) return null;
              return (
                <a
                  key={`${p.left}-${p.right}`}
                  href={`/compare/cities/${p.left}-vs-${p.right}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    fontSize: 13,
                    color: "var(--ink-2)",
                    padding: "7px 0",
                    borderTop: "1px solid var(--hair)",
                  }}
                >
                  <CountryFlag iso2={cityIso2(p.left) ?? ""} className="w-[16px]" />
                  <span>{ln}</span>
                  <span style={{ color: "var(--faint)" }}>vs</span>
                  <CountryFlag iso2={cityIso2(p.right) ?? ""} className="w-[16px]" />
                  <span>{rn}</span>
                </a>
              );
            })}
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
