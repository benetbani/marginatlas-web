/**
 * StructuredData — emits minimal JSON-LD schema.org markup.
 *
 * PRIVACY POLICY: never reveal specific government datasets, table codes, or
 * derivation techniques. Schema.org is a public surface that scrapers and
 * AI crawlers can read. Keep it generic.
 */

type CellDatasetProps = {
  url: string;
  industryName: string;
  geoName: string;
  country?: string;
  year: number;
  source?: string; // ignored intentionally
  medianRevenue?: number | null;
  nEnterprises?: number | null;
  nEmployees?: number | null;
  wagePerEmployee?: number | null;
  revP10?: number | null;
  revP90?: number | null;
  qualityScore?: number | null;
  csvExportUrl?: string;
};

export function CellDataset({
  url,
  industryName,
  geoName,
  country,
  year,
  nEnterprises,
  nEmployees,
  medianRevenue,
  wagePerEmployee,
  revP10,
  revP90,
  qualityScore,
  csvExportUrl,
}: CellDatasetProps) {
  // DD.2 — enriched Dataset entry with variableMeasured PropertyValue entries
  // carrying real values, plus DataDownload distribution + temporal coverage.
  const variableMeasured: object[] = [];
  if (medianRevenue != null) {
    variableMeasured.push({
      "@type": "PropertyValue",
      name: "typical revenue per firm",
      value: medianRevenue,
      unitText: "USD",
      description:
        revP10 != null && revP90 != null
          ? `Bottom 10% ~ ${Math.round(revP10).toLocaleString()} USD; top 10% ~ ${Math.round(revP90).toLocaleString()} USD.`
          : undefined,
    });
  }
  // Avg-employees-per-firm display removed (n_enterprises
  // denominator is unreliable, so the derived ratio looks dubious).
  if (wagePerEmployee != null) {
    variableMeasured.push({
      "@type": "PropertyValue",
      name: "wage per employee",
      value: wagePerEmployee,
      unitText: "USD per year",
    });
  }

  // Raw `year` is suppressed from all public-facing surfaces
  // (founder R-002 catastrophic-flag). The `year` prop is still accepted for
  // type compatibility with callers, but never rendered into the JSON-LD.
  void year;

  /* The description used to be a fixed string promising "Revenue, employment,
     and wage benchmarks" regardless of what the caller actually supplied. That
     was harmless while the only caller passed all three. The spine-2 page
     supplies revenue and a firm count and no wage, so the fixed string began
     claiming, in machine-readable form, data the page does not have.
     Derived from what is genuinely present instead. */
  const measures = [
    medianRevenue != null ? "revenue" : null,
    nEnterprises != null ? "firm counts" : null,
    wagePerEmployee != null ? "wage" : null,
  ].filter(Boolean) as string[];
  const measureList =
    measures.length === 0
      ? "Business benchmarks"
      : measures.length === 1
        ? `${measures[0][0].toUpperCase()}${measures[0].slice(1)} benchmarks`
        : `${measures.slice(0, -1).join(", ")} and ${measures[measures.length - 1]} benchmarks`
            .replace(/^./, (c) => c.toUpperCase());

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${industryName} business benchmarks in ${geoName}`,
    description: `${measureList} for ${industryName.toLowerCase()} firms in ${geoName}.`,
    url,
    identifier: url,
    keywords: [
      industryName,
      geoName,
      country || "",
      "small business",
      "benchmark",
      "revenue",
      "employment",
      "wages",
    ].filter(Boolean),
    creator: {
      "@type": "Organization",
      name: "Margin Atlas",
      url: "https://www.marginatlas.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tesseract Research",
      url: "https://www.marginatlas.com",
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    spatialCoverage: { "@type": "Place", name: geoName },
    variableMeasured: variableMeasured.length > 0 ? variableMeasured : [
      "typical revenue per firm",
      "wages per employee",
    ],
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Margin Atlas",
      url: "https://www.marginatlas.com",
    },
    // NOTE: deliberately no `measurementTechnique` / source agency / license
    // fields — keep methodology private per R-002.
  };

  if (csvExportUrl) {
    data.distribution = [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: csvExportUrl,
      },
    ];
  }

  /* THE CONFIDENCE SCORE IS NO LONGER PUBLISHED, in any form.
     This emitted additionalProperty "Confidence score (1-10)" on every trade
     page. The same figure was deleted from the visible page, and the cell page
     still records why: "Data Quality section removed. The 10/10 confidence
     score and ★★★★★ rating exposed engineering provenance the founder
     explicitly said never to display."

     Removing it from the DOM and leaving it in the JSON-LD is the weaker half
     of that decision. Structured data is what an answer engine quotes, so the
     score kept being republished in the one place nobody looks at while
     reading, stripped of every caveat the page would have given it.

     `qualityScore` stays in the props to keep the call site honest about what
     it holds, and is deliberately unused here. Publishing machine-readable
     provenance is a separate question from displaying it, and it is the
     founder's to answer. */
  void qualityScore;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type BreadcrumbProps = {
  items: { name: string; url: string }[];
};

export function Breadcrumbs({ items }: BreadcrumbProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ArticleProps = {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  author?: string;
};

export function Article({
  title,
  description,
  datePublished,
  url,
  author = "Margin Atlas",
}: ArticleProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: datePublished,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: "Margin Atlas",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebSite schema. Home page only, and that placement is the whole point.
 *
 * WHAT IT IS FOR. The name a search engine prints above a result, the "site
 * name", is not taken from <title>, from the Organization block below, or from
 * the domain. Google reads it from WebSite structured data, and looks for that
 * markup on the home page specifically. The site carried Organization on every
 * page and WebSite nowhere, so the one signal that names the site was the one
 * signal missing, on a strategy whose growth plan is search.
 *
 * WHY IT IS NOT IN THE ROOT LAYOUT. Organization is mounted there because it
 * describes the publisher and is true of every page. WebSite marks the site's
 * front door; repeating it on 615 pages says every one of them is the front
 * door.
 *
 * NO potentialAction / SearchAction, deliberately. That property promises a URL
 * template a crawler can fill in with a query string, and this site has no
 * generic text search to point it at: the navigator resolves three fields into
 * /{country}/{geo}/{industry}, and /api/go is a form target, not a search
 * endpoint. Declaring a search URL that does not answer is a claim made
 * directly to a machine, which is the one audience that cannot tell it is
 * being told something untrue.
 */
export function WebSite() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Margin Atlas",
    url: "https://www.marginatlas.com",
    description:
      "What a small business earns, and what its owner actually keeps, trade by trade and place by place.",
    publisher: {
      "@type": "Organization",
      name: "Margin Atlas",
      url: "https://www.marginatlas.com",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function Organization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Margin Atlas",
    url: "https://www.marginatlas.com",
    description:
      "Small-business benchmarks worldwide: revenue, employment, and wage distributions.",
    // NOTE: no `sameAs` linking to data mirrors. We don't broadcast where the
    // raw data lives publicly.
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
