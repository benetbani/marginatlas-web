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
  // Plan v13 Wave 4a — avg-employees-per-firm display removed (n_enterprises
  // denominator is unreliable, so the derived ratio looks dubious).
  if (wagePerEmployee != null) {
    variableMeasured.push({
      "@type": "PropertyValue",
      name: "wage per employee",
      value: wagePerEmployee,
      unitText: "USD per year",
    });
  }

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${industryName} business benchmarks in ${geoName}, ${year}`,
    description: `Revenue, employment, and wage benchmarks for ${industryName.toLowerCase()} firms in ${geoName}${
      nEnterprises ? `, covering ${nEnterprises.toLocaleString()} businesses` : ""
    }.`,
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
      `${year}`,
    ].filter(Boolean),
    creator: {
      "@type": "Organization",
      name: "Margin Atlas",
      url: "https://marginatlas.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tesseract Research",
      url: "https://marginatlas.com",
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    datePublished: `${year}-01-01`,
    temporalCoverage: `${year}/${year}`,
    spatialCoverage: { "@type": "Place", name: geoName },
    variableMeasured: variableMeasured.length > 0 ? variableMeasured : [
      "typical revenue per firm",
      "wages per employee",
    ],
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Margin Atlas",
      url: "https://marginatlas.com",
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

  if (qualityScore != null) {
    data.additionalProperty = {
      "@type": "PropertyValue",
      name: "Confidence score (1-10)",
      value: Math.round((qualityScore / 10) * 10) / 10,
    };
  }

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

export function Organization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Margin Atlas",
    url: "https://marginatlas.com",
    description:
      "Small-business benchmarks across 40+ countries: revenue, employment, and wage distributions.",
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
