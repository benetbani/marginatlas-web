export const revalidate = 86400;

export default function MethodologyPage() {
  return (
    <article className="prose prose-slate max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">Methodology</h1>
      <p className="mt-4 text-lg text-ink-800/80 leading-relaxed">
        Margin Atlas builds one unified <code>cells_master</code> from primary
        statistical-agency sources across 40+ countries. Every cell is a
        (country × geography × industry × size × year) combination, with
        revenue, employment, and payroll distributions derived from
        official microdata aggregates.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Sources</h2>
      <ul className="mt-4 space-y-2 text-ink-800">
        <li>🇺🇸 <strong>US</strong> — Census SUSB, CBP, ZBP; BEA SAGDP; SEC EDGAR.</li>
        <li>🇨🇦 <strong>Canada</strong> — StatCan business-statistics tables.</li>
        <li>🇦🇺 <strong>Australia</strong> — ABS Australian Industry, Census 2021, Labour Account.</li>
        <li>🇪🇺 <strong>EU + EFTA</strong> — Eurostat SBS (sbs_sc_sca_r2, sbs_na_sca_r2, sbs_r_nuts06_r2, bd_*) covering 37 countries.</li>
        <li>🇩🇪 <strong>Germany</strong> — Destatis GENESIS-Online 47415-*, 48121-*, 48112-*, 13111, 82111.</li>
        <li>🇯🇵 <strong>Japan</strong> — e-Stat Economic Census for Business Activity 2021 (decoded via getMetaInfo).</li>
        <li>🇫🇷 <strong>France</strong> — INSEE SIRENE full legal-unit registry (29.5M units).</li>
        <li>🇵🇱 <strong>Poland</strong> — GUS BDL.</li>
        <li>🇧🇷 <strong>Brazil</strong> — IBGE SIDRA (CEMPRE, PAS, PMS, POF).</li>
        <li>🇸🇬 <strong>Singapore</strong> — SingStat Table Builder.</li>
        <li>🇳🇴 <strong>Norway</strong> — SSB PxWebApi.</li>
        <li>🇦🇷 <strong>Argentina</strong> — datos.gob.ar Series.</li>
        <li>Cross-country macro — OECD QNA (38 OECD members), World Bank Indicators (200+ countries).</li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Coverage tiers</h2>
      <ul className="mt-4 space-y-2 text-ink-800">
        <li><strong>P</strong> (Production) — direct primary data, no derivation.</li>
        <li><strong>S</strong> (Statistical) — derived from size brackets via bucket interpolation.</li>
        <li><strong>M</strong> (Modeled) — extrapolated where direct data is unavailable.</li>
        <li><strong>T</strong> (Total only) — aggregates without per-firm distribution.</li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Industry classifications</h2>
      <p className="text-ink-800">
        Every cell carries its native classification (NAICS 2017, NACE Rev. 2,
        ISIC Rev. 4, SSIC, PKD, WZ2008, etc.) plus mappings to the cross-country
        comparable codes via the published correspondence tables.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Quality score</h2>
      <p className="text-ink-800">
        Each cell carries a 0–100 quality score combining source authority,
        sample size, recency, and coverage completeness. The mean score across
        v1.15 is ~85.
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-ink-900">Versioning</h2>
      <p className="text-ink-800">
        Each release is immutable and citable. Current version: <strong>v1.15.0</strong>.
        Bulk download via GitHub Releases and Hugging Face Datasets.
      </p>
    </article>
  );
}
