import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  OrganizationJsonLd,
  SportsTeamJsonLd,
  SportsEventJsonLd,
  WebSiteJsonLd,
  FAQPageJsonLd,
} from '@/components/seo/JsonLd';

describe('OrganizationJsonLd', () => {
  it('renders script tag with Organization schema', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('uses default values when no props provided', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('PhillySportsPack');
    expect(schema.url).toBe('https://phillysportspack.com');
  });

  it('accepts custom props', () => {
    const { container } = render(
      <OrganizationJsonLd
        name="Custom Sports"
        url="https://custom.com"
        description="Custom sports database"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.name).toBe('Custom Sports');
    expect(schema.url).toBe('https://custom.com');
    expect(schema.description).toBe('Custom sports database');
  });

  it('includes logo when provided', () => {
    const { container } = render(
      <OrganizationJsonLd logo="https://example.com/logo.png" />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.logo).toBe('https://example.com/logo.png');
  });

  it('includes social media links (sameAs)', () => {
    const { container } = render(
      <OrganizationJsonLd
        sameAs={[
          'https://twitter.com/test',
          'https://facebook.com/test',
        ]}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.sameAs).toHaveLength(2);
    expect(schema.sameAs).toContain('https://twitter.com/test');
  });

  it('includes contactPoint', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.contactPoint).toBeDefined();
    expect(schema.contactPoint['@type']).toBe('ContactPoint');
  });
});

describe('SportsTeamJsonLd', () => {
  it('renders script tag with SportsTeam schema', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="Lincoln High"
        sport="football"
        url="https://example.com/teams/lincoln"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@type']).toBe('SportsTeam');
  });

  it('includes location when city and state provided', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="Central High"
        sport="basketball"
        city="Philadelphia"
        state="Pennsylvania"
        url="https://example.com"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.location).toBeDefined();
    expect(schema.location['@type']).toBe('Place');
    expect(schema.location.address.addressLocality).toBe('Philadelphia');
    expect(schema.location.address.addressRegion).toBe('Pennsylvania');
  });

  it('includes logo when provided', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="West High"
        sport="soccer"
        url="https://example.com"
        logo="https://example.com/logo.png"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.logo).toBe('https://example.com/logo.png');
  });

  it('includes memberOf (league/conference) when provided', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="South High"
        sport="baseball"
        url="https://example.com"
        memberOf={{
          name: 'Catholic League',
          url: 'https://example.com/leagues/catholic',
        }}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.memberOf).toBeDefined();
    expect(schema.memberOf['@type']).toBe('Organization');
    expect(schema.memberOf.name).toBe('Catholic League');
  });
});

describe('SportsEventJsonLd', () => {
  it('renders script tag with SportsEvent schema', () => {
    const { container } = render(
      <SportsEventJsonLd
        name="Lincoln vs Central"
        startDate="2024-10-15T14:00:00Z"
        url="https://example.com/events/1"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@type']).toBe('SportsEvent');
  });

  it('includes location when provided', () => {
    const { container } = render(
      <SportsEventJsonLd
        name="Championship Game"
        startDate="2024-11-20T18:00:00Z"
        location={{
          name: 'Lincoln Stadium',
          city: 'Philadelphia',
          state: 'Pennsylvania',
        }}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.location).toBeDefined();
    expect(schema.location.name).toBe('Lincoln Stadium');
    expect(schema.location.address.addressLocality).toBe('Philadelphia');
  });

  it('includes home and away teams', () => {
    const { container } = render(
      <SportsEventJsonLd
        name="Game 1"
        startDate="2024-10-15T14:00:00Z"
        homeTeam={{
          name: 'Lincoln High',
          url: 'https://example.com/teams/lincoln',
        }}
        awayTeam={{
          name: 'Central High',
          url: 'https://example.com/teams/central',
        }}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.homeTeam).toBeDefined();
    expect(schema.homeTeam['@type']).toBe('SportsTeam');
    expect(schema.homeTeam.name).toBe('Lincoln High');

    expect(schema.awayTeam).toBeDefined();
    expect(schema.awayTeam['@type']).toBe('SportsTeam');
    expect(schema.awayTeam.name).toBe('Central High');
  });

  it('includes description and end date when provided', () => {
    const { container } = render(
      <SportsEventJsonLd
        name="Tournament"
        description="Regional championship tournament"
        startDate="2024-11-01T09:00:00Z"
        endDate="2024-11-03T17:00:00Z"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.description).toBe('Regional championship tournament');
    expect(schema.endDate).toBe('2024-11-03T17:00:00Z');
  });
});

describe('WebSiteJsonLd', () => {
  it('renders script tag with WebSite schema', () => {
    const { container } = render(<WebSiteJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@type']).toBe('WebSite');
  });

  it('uses default values', () => {
    const { container } = render(<WebSiteJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.name).toBe('PhillySportsPack');
    expect(schema.url).toBe('https://phillysportspack.com');
  });

  it('includes SearchAction with search URL template', () => {
    const { container } = render(<WebSiteJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.potentialAction).toBeDefined();
    expect(schema.potentialAction['@type']).toBe('SearchAction');
    expect(schema.potentialAction.target).toBeDefined();
    expect(schema.potentialAction['query-input']).toBe('required name=search_term_string');
  });

  it('accepts custom search URL', () => {
    const customUrl = 'https://custom.com/find?q={search_term_string}';
    const { container } = render(<WebSiteJsonLd searchUrl={customUrl} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.potentialAction.target.urlTemplate).toBe(customUrl);
  });

  it('accepts custom props', () => {
    const { container } = render(
      <WebSiteJsonLd
        name="Custom Sports"
        url="https://custom.com"
        description="Custom database"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.name).toBe('Custom Sports');
    expect(schema.url).toBe('https://custom.com');
    expect(schema.description).toBe('Custom database');
  });
});

describe('FAQPageJsonLd', () => {
  it('renders script tag with FAQPage schema', () => {
    const { container } = render(
      <FAQPageJsonLd
        items={[
          {
            question: 'What is this?',
            answer: 'This is a test.',
          },
        ]}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@type']).toBe('FAQPage');
  });

  it('includes all FAQ items with proper structure', () => {
    const { container } = render(
      <FAQPageJsonLd
        items={[
          {
            question: 'How do I search?',
            answer: 'Use the search bar at the top.',
          },
          {
            question: 'How do I contact support?',
            answer: 'Email us at support@example.com',
          },
        ]}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('How do I search?');
    expect(schema.mainEntity[0].acceptedAnswer).toBeDefined();
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('handles empty items array', () => {
    const { container } = render(<FAQPageJsonLd items={[]} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.mainEntity).toHaveLength(0);
  });
});
