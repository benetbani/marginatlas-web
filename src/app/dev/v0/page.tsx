/**
 * /dev/v0 , the v0 staging route.
 *
 * Drop a component pasted from v0 into src/components/v0, import it below, and
 * pass it the REAL data from @/lib/v0/cell-props. This is where a v0 design is
 * proved against real numbers before it goes anywhere near a live page.
 *
 * Nothing here ships: it is a dev route behind the same convention as the other
 * /dev/* surfaces.
 */
import type { Metadata } from "next";
import "@/styles/v0-tokens.css";
import { CELL_LONDON_RESTAURANTS as data, usd } from "@/lib/v0/cell-props";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/* ------------------------------------------------------------------ *
 * 1. import v0 components here as they arrive, for example:
 *      import { Hero } from "@/components/v0/Hero";
 *      import { MoneySplit } from "@/components/v0/MoneySplit";
 * 2. render them below, passing `data`.
 * ------------------------------------------------------------------ */

export default function V0Staging() {
  return (
    <main style={{ background: "var(--v0-paper)", color: "var(--v0-ink)", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1000px] px-8 py-14">
        <div
          className="v0-card"
          style={{ padding: 22, marginBottom: 40 }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--v0-muted)" }}>
            v0 staging
          </div>
          <p style={{ marginTop: 10, fontSize: 14, color: "var(--v0-ink-2)", maxWidth: "62ch", lineHeight: 1.6 }}>
            Import a component from <code>src/components/v0</code> and render it below with the
            real data. Tokens from <code>styles/v0-tokens.css</code> are already loaded, so an
            on-brand v0 component renders correctly with no restyling.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 26, flexWrap: "wrap" }}>
            <Fact k="trade" v={`${data.meta.trade}, ${data.meta.city}`} />
            <Fact k="the answer" v={`${usd(data.answer.ownerKeepsUsdYear)} a year`} accent />
            <Fact k="to open" v={usd(data.heroStats.costToOpenUsd)} />
            <Fact k="sections wired" v="0" />
          </div>
        </div>

        {/* ---- render v0 components here ---- */}
        <p style={{ fontSize: 13, color: "var(--v0-muted)" }}>
          No v0 components imported yet.
        </p>
      </div>
    </main>
  );
}

function Fact({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div>
      <div
        className="v0-fig"
        style={{ fontSize: 19, fontWeight: 600, color: accent ? "var(--v0-accent-deep)" : "var(--v0-ink)" }}
      >
        {v}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--v0-muted)", marginTop: 4 }}>
        {k}
      </div>
    </div>
  );
}
