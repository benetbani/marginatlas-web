/**
 * src/app/_design/spine2-story.tsx
 *
 * The Wave 4 spine2 catalog story: every foundation component rendered with
 * realistic sample data inside a `.av2`-scoped block. Sample data is the
 * mockups' own (cell ch 08, city ch 16, the cell close) so the render is
 * directly comparable against the frozen crops in design/crops/cell-mock.
 *
 * Lives inside the _design private folder per the catalog convention
 * (CLAUDE.md: catalog story mandatory before merge). _design is a Next
 * PRIVATE folder and never routes, so the same story is mounted on the
 * routable /dev/spine2 page for eyeballing and screenshot verification.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { Statblock } from "@/components/spine2/Statblock";
import { Ledger } from "@/components/spine2/Ledger";
import { TierPill, TierDefinitions } from "@/components/spine2/TierPill";
import { Fig } from "@/components/spine2/Fig";
import { SwatchLegend } from "@/components/spine2/SwatchLegend";
import { Reading } from "@/components/spine2/Reading";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { usd, usdParts, pct, fig } from "@/components/spine2/fmt";

export function Spine2Story() {
  return (
    <div id="spine2" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* Statblock , norail (the hero at-a-glance form) and railed (cell 08
            right panel, the crop-compare target), side by side */}
        <div className="grid g2">
          <div className="panel pad">
            <Statblock
              header={{ label: "What the typical room does", icon: "benchmark" }}
              rail={false}
              rows={[
                { label: "Revenue a year", value: "$620", unit: "K" },
                { label: "The owner keeps", value: "$43", unit: "K", answer: true },
                { label: "How much more than typical you need", value: "+12", unit: "%" },
                { label: "To break in", value: "Demanding" },
                { label: "Cash before you open", value: "$341", unit: "K" },
                { label: "A row with a null figure self-omits", value: null },
              ]}
            />
            <p className="note" style={{ marginTop: 15, fontSize: "12.5px" }}>
              <b>The typical London restaurant does not pay its owner well.</b> You
              have to be well above the middle of the trade.
            </p>
          </div>
          <div className="panel pad" style={{ display: "flex", flexDirection: "column" }}>
            <Statblock
              header={{ label: "What hiring actually costs", icon: "hiring" }}
              rows={[
                { icon: "taxes", label: "Employer contributions", sub: "on every wage", value: "+15", unit: "%", answer: true },
                { icon: "hiring", label: "To recruit one chef", sub: "agency or advert", value: "$2.4", unit: "K" },
                { icon: "first-year", label: "Weeks to fill a chef role", value: "5" },
                { icon: "staffing-rota", label: "Staff churn a year", sub: "hospitality", value: "32", unit: "%" },
                { icon: "wages", label: "Churn cost, a year", sub: "rehiring and retraining", value: "$11", unit: "K" },
              ]}
            />
            <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
              A $34K line cook really costs <b>$39K</b>. Five and a half people is
              what $210K buys in London, and that is the whole rota this room can
              afford. Churn adds another eleven thousand nobody budgets.
            </p>
          </div>
        </div>

        {/* Ledger , framed with header (city 16), then the definitions note
            rendered from TIER_COPY (M7: one source for pill and definition) */}
        <div style={{ marginTop: 28 }}>
          <Ledger
            rows={[
              { label: "Rent by district", tier: "measured", how: "assessed rent, property by property" },
              { label: "Median pay", tier: "measured", how: "published pay by role and region" },
              { label: "Revenue", tier: "built", how: "sector revenue over business count" },
              { label: "What the owner keeps", tier: "built", how: "the residual of the five lines" },
              { label: "Cost to fit out", tier: "thin", how: "no register exists, so this is a range" },
              { label: "A row with no tier never renders", tier: null, how: "should not appear" },
            ]}
          />
          <TierDefinitions style={{ marginTop: 14, maxWidth: "78ch" }} />
        </div>

        {/* Ledger , bare/embedded variant (cell 18: inside the method card,
            no header row, no frame) plus the small atoms */}
        <div className="grid g2" style={{ marginTop: 28 }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 12 }}>Bare ledger, method-embedded</div>
            <Ledger
              header={false}
              bare
              rows={[
                { label: "Rent and rates", tier: "measured", how: "assessed rent on comparable units" },
                { label: "Revenue", tier: "built", how: "sector revenue over business count" },
                { label: "Cost to fit out", tier: "thin", how: "no register exists, so this is a range" },
              ]}
            />
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 12 }}>Atoms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <TierPill tier="measured" />
              <TierPill tier="built" />
              <TierPill tier="thin" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "baseline", marginTop: 16, fontSize: 18 }}>
              <Fig value="$620" unit="K" />
              <Fig value="+15" unit="%" answer />
              <Fig value="2.1" unit="x UK" />
              <Fig value={usd(1250000)} />
              <Fig {...(usdParts(43000) ?? { value: null })} />
              <Fig value={pct(0.34)} />
              <Fig value={fig(12500)} />
            </div>
            <div style={{ marginTop: 18 }}>
              <SwatchLegend
                items={[
                  { label: "Food and drink", figure: "34%", tone: "n1" },
                  { label: "Staff", figure: "31%", tone: "n2" },
                  { label: "Rent and rates", figure: "12%", tone: "n3" },
                  { label: "Marketing", figure: "4%", tone: "n5" },
                  { label: "You keep", figure: "7%", tone: "terra" },
                ]}
                note="Heights are exactly proportional. The last slice is a range, 4% to 10%."
              />
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 18, color: "var(--ink)" }}>
              <GlyphIcon id="owner-keeps" size={13} />
              <GlyphIcon id="owner-keeps" size={16} />
              <GlyphIcon id="owner-keeps" size={18} />
              <GlyphIcon id="owner-keeps" size={24} />
              <GlyphIcon id="spending-power" size={24} />
              <GlyphIcon id="wealth-household" size={24} />
              <GlyphIcon id="trade-restaurant" size={24} />
              <GlyphIcon id="trade-cafe" size={24} />
              <GlyphIcon id="confidence" size={24} />
            </div>
          </div>
        </div>

        {/* Reading , the M1 door/fact grammar inside the .tiles grid: doors
            are <a> with chevron and hover accent, facts are <span> */}
        <div className="tiles" style={{ marginTop: 28 }}>
          <Reading glyph="trade-cafe" label="Cafes in London" figure="$25K kept" />
          <Reading glyph="trade-bar" label="Bars in London" figure="$38K kept" />
          <Reading glyph="trade-restaurant" label="Restaurants, Manchester" figure="$41K kept" />
          <Reading glyph="skyline" label="Every trade in London" figure="42 trades" href="/" />
          <Reading glyph="neighborhood" label="Restaurants by district" figure="6 areas" />
          <Reading glyph="global-spread" label="The UK overall" figure="$36 in every $100" href="/" />
        </div>
      </div>
    </div>
  );
}
