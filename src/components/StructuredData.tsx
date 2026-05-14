/**
 * StructuredData — emits JSON-LD schema.org markup.
 * Used on cell pages, blog posts, country/sector pages.
 */

type CellDatasetProps = {
  url: string;
  industryName: string;
  geoName: string;
  year: number;
  source: string;
  medianRevenue?: number | null;
  nEnterprises?: number | null;
};

export function CellDataset({
  url,
  industryName,
  geoName,
  year,
  source,
  medianRevenue,
  nEnterprises,
}: CellDatasetProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${industryName} business benchmarks in ${geoName}, ${year}`,
    description: `Revenue, employment, and wage distributions for ${industryName.toLowerCase()} businesses in ${geoName}. ${nEnterprises ? `Based on ${nEnterprises.toLocaleString()} firms.` : ""} Source: ${source}.`,
    url,
    keywords: [industryName, geoName, "small business", "benchmark", "revenue", "employment", "wages"],
    creator: {
      "@type": "Organization",
      name: "Margin Atlas",
      url: "https://marginatlas.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tesseract Research",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    datePublished: `${year}-01-01`,
    spatialCoverage: { "@type": "Place", name: geoName },
    variableMeasured: ["typical revenue per firm", "employees per firm", "wages per employee"],
    ...(medianRevenue
      ? {
          measurementTechnique:
            "Aggregated from statistical agency surveys, normalized to industry × geography × size × year cells",
        }
      : {}),
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

export function Article({ title, description, datePublished, url, author = "Margin Atlas team" }: ArticleProps) {
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
      logo: {
        "@type": "ImageObject",
        url: "https://marginatlas.com/icon.png",
      },
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
    logo: "https://marginatlas.com/icon.png",
    description: "The unified database of small-business margins across 40+ countries.",
    sameAs: [
      "https://huggingface.co/datasets/tesseract-research/atlas-global",
      "https://github.com/benetbani/atlas-data",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
