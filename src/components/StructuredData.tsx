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
  year: number;
  source?: string; // ignored intentionally
  medianRevenue?: number | null;
  nEnterprises?: number | null;
};

export function CellDataset({
  url,
  industryName,
  geoName,
  year,
  nEnterprises,
}: CellDatasetProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${industryName} business benchmarks in ${geoName}, ${year}`,
    description: `Revenue, employment, and wage benchmarks for ${industryName.toLowerCase()} firms in ${geoName}${
      nEnterprises ? `, covering ${nEnterprises.toLocaleString()} businesses` : ""
    }.`,
    url,
    keywords: [
      industryName,
      geoName,
      "small business",
      "benchmark",
      "revenue",
      "employment",
      "wages",
    ],
    creator: {
      "@type": "Organization",
      name: "Margin Atlas",
      url: "https://marginatlas.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tesseract Research",
    },
    isAccessibleForFree: true,
    datePublished: `${year}-01-01`,
    spatialCoverage: { "@type": "Place", name: geoName },
    variableMeasured: [
      "typical revenue per firm",
      "employees per firm",
      "wages per employee",
    ],
    // NOTE: deliberately no `measurementTechnique` field — would leak method.
    // NOTE: deliberately no `license` field — keep redistribution implicit.
  };
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
      "Small-business benchmarks across 40+ countries — revenue, employment, and wage distributions.",
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
