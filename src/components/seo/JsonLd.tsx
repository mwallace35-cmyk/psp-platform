interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = "PhillySportsPack",
  url = "https://phillysportspack.com",
  logo = "https://phillysportspack.com/logo.png",
  description = "Complete Philadelphia high school sports database covering football, basketball, baseball, soccer, lacrosse, track & field, wrestling. Stats, records, championships, and player profiles across 400+ schools and 10,000+ athletes.",
  sameAs = [
    "https://twitter.com/phillysportspack",
    "https://facebook.com/phillysportspack",
    "https://instagram.com/phillysportspack",
  ],
}: OrganizationJsonLdProps = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs: sameAs.filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export function ArticleJsonLd({ title, description, author, datePublished, dateModified, url, imageUrl }: {
  title: string; description: string; author: string; datePublished: string; dateModified?: string; url: string; imageUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    datePublished,
    dateModified: dateModified || datePublished,
    url,
    publisher: { "@type": "Organization", name: "PhillySportsPack", url: "https://phillysportspack.com" },
    ...(imageUrl && { image: imageUrl }),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

interface SportsTeamJsonLdProps {
  name: string;
  sport: string;
  city?: string;
  state?: string;
  url: string;
  logo?: string;
  memberOf?: {
    name: string;
    url?: string;
  };
}

export function SportsTeamJsonLd({
  name,
  sport,
  city,
  state,
  url,
  logo,
  memberOf,
}: SportsTeamJsonLdProps) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    sport,
    url,
  };

  if (logo) {
    schema.logo = logo;
  }

  if (city || state) {
    schema.location = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(city && { addressLocality: city }),
        ...(state && { addressRegion: state }),
      },
    };
  }

  if (memberOf) {
    schema.memberOf = {
      "@type": "Organization",
      name: memberOf.name,
      ...(memberOf.url && { url: memberOf.url }),
    };
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export function CoachJsonLd({ name, sport, school, record, championships, yearsActive, url }: {
  name: string; sport: string; school?: string; record?: string; championships?: number; yearsActive?: string; url?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: `${sport} Coach`,
    ...(school && { affiliation: { "@type": "Organization", name: school } }),
    ...(url && { url }),
    description: `${name} is a ${sport} coach${championships ? ` with ${championships} championship${championships > 1 ? 's' : ''}` : ''}${record ? ` and a record of ${record}` : ''}.`,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export function ChampionshipJsonLd({ sport, year, winner, runnerUp, url }: {
  sport: string; year: number; winner: string; runnerUp?: string; url?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${year} ${sport} Championship`,
    description: `${year} Philadelphia high school ${sport} championship`,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    location: {
      "@type": "Place",
      name: "Philadelphia",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Philadelphia",
        addressRegion: "Pennsylvania",
      },
    },
    ...(url && { url }),
    winner: {
      "@type": "Organization",
      name: winner,
    },
    ...(runnerUp && {
      runnerUp: {
        "@type": "Organization",
        name: runnerUp,
      },
    }),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export function PersonJsonLd({ name, description, sport, school, url, imageUrl, college, proTeam }: {
  name: string;
  description?: string;
  sport?: string;
  school?: string;
  url?: string;
  imageUrl?: string;
  college?: string;
  proTeam?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(description && { description }),
    ...(url && { url }),
    ...(imageUrl && { image: imageUrl }),
    ...(sport && { knowsAbout: sport }),
    ...(school && { affiliation: { "@type": "EducationalOrganization", name: school } }),
    ...(college && { alumniOf: { "@type": "CollegeOrUniversity", name: college } }),
    ...(proTeam && { memberOf: { "@type": "SportsTeam", name: proTeam } }),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

interface SportsEventJsonLdProps {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    city?: string;
    state?: string;
  };
  homeTeam?: {
    name: string;
    url?: string;
  };
  awayTeam?: {
    name: string;
    url?: string;
  };
  url?: string;
}

export function SportsEventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  homeTeam,
  awayTeam,
  url,
}: SportsEventJsonLdProps) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name,
    startDate,
  };

  if (description) {
    schema.description = description;
  }

  if (endDate) {
    schema.endDate = endDate;
  }

  if (location) {
    schema.location = {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        ...(location.city && { addressLocality: location.city }),
        ...(location.state && { addressRegion: location.state }),
      },
    };
  }

  if (homeTeam) {
    schema.homeTeam = {
      "@type": "SportsTeam",
      name: homeTeam.name,
      ...(homeTeam.url && { url: homeTeam.url }),
    };
  }

  if (awayTeam) {
    schema.awayTeam = {
      "@type": "SportsTeam",
      name: awayTeam.name,
      ...(awayTeam.url && { url: awayTeam.url }),
    };
  }

  if (url) {
    schema.url = url;
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
}

export function WebSiteJsonLd({
  name = "PhillySportsPack",
  url = "https://phillysportspack.com",
  description = "Philadelphia high school sports database",
  searchUrl = "https://phillysportspack.com/search?q={search_term_string}",
}: WebSiteJsonLdProps = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrl,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageJsonLdProps {
  items: FAQItem[];
}

export function FAQPageJsonLd({ items }: FAQPageJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
