import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  BreadcrumbJsonLd,
  OrganizationJsonLd,
  ArticleJsonLd,
  SportsTeamJsonLd,
} from '@/components/seo/JsonLd';

describe('BreadcrumbJsonLd', () => {
  it('renders script tag with JSON-LD schema', () => {
    const items = [
      { name: 'Teams', url: 'https://example.com/teams' },
      { name: 'Football', url: 'https://example.com/football' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates correct BreadcrumbList schema', () => {
    const items = [
      { name: 'Teams', url: 'https://example.com/teams' },
      { name: 'Football', url: 'https://example.com/football' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
    }
  });

  it('sets correct positions in breadcrumb items', () => {
    const items = [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Teams', url: 'https://example.com/teams' },
      { name: 'Football', url: 'https://example.com/football' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    }
  });

  it('includes name in each breadcrumb item', () => {
    const items = [
      { name: 'Teams', url: 'https://example.com/teams' },
      { name: 'Football', url: 'https://example.com/football' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.itemListElement[0].name).toBe('Teams');
      expect(schema.itemListElement[1].name).toBe('Football');
    }
  });

  it('includes item URL in each breadcrumb item', () => {
    const items = [
      { name: 'Teams', url: 'https://example.com/teams' },
      { name: 'Football', url: 'https://example.com/football' },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.itemListElement[0].item).toBe('https://example.com/teams');
      expect(schema.itemListElement[1].item).toBe('https://example.com/football');
    }
  });
});

describe('OrganizationJsonLd', () => {
  it('renders script tag with JSON-LD schema', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates correct Organization schema', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
    }
  });

  it('includes organization name', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.name).toBe('PhillySportsPack');
    }
  });

  it('includes organization URL', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.url).toBe('https://phillysportspack.com');
    }
  });

  it('includes organization description', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.description).toContain('Philadelphia high school sports');
    }
  });

  it('includes sameAs array with default social links', () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.sameAs).toBeDefined();
      expect(Array.isArray(schema.sameAs)).toBe(true);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    }
  });
});

describe('ArticleJsonLd', () => {
  const articleProps = {
    title: 'Test Article',
    description: 'This is a test article',
    author: 'John Doe',
    datePublished: '2024-01-01',
    url: 'https://example.com/article',
    imageUrl: 'https://example.com/image.jpg',
  };

  it('renders script tag with JSON-LD schema', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates correct Article schema', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
    }
  });

  it('includes article headline', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.headline).toBe('Test Article');
    }
  });

  it('includes article description', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.description).toBe('This is a test article');
    }
  });

  it('includes author information', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe('John Doe');
    }
  });

  it('includes publication date', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.datePublished).toBe('2024-01-01');
    }
  });

  it('uses dateModified when provided', () => {
    const { container } = render(
      <ArticleJsonLd {...articleProps} dateModified="2024-01-15" />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.dateModified).toBe('2024-01-15');
    }
  });

  it('defaults dateModified to datePublished when not provided', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.dateModified).toBe('2024-01-01');
    }
  });

  it('includes article URL', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.url).toBe('https://example.com/article');
    }
  });

  it('includes publisher information', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.publisher['@type']).toBe('Organization');
      expect(schema.publisher.name).toBe('PhillySportsPack');
      expect(schema.publisher.url).toBe('https://phillysportspack.com');
    }
  });

  it('includes image URL when provided', () => {
    const { container } = render(<ArticleJsonLd {...articleProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.image).toBe('https://example.com/image.jpg');
    }
  });

  it('omits image property when not provided', () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test"
        description="Test"
        author="Test"
        datePublished="2024-01-01"
        url="https://example.com"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.image).toBeUndefined();
    }
  });
});

describe('SportsTeamJsonLd', () => {
  const teamProps = {
    name: 'Central High Falcons',
    sport: 'Football',
    url: 'https://example.com/teams/central-high',
    city: 'Philadelphia',
    state: 'PA',
  };

  it('renders script tag with JSON-LD schema', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates correct SportsTeam schema', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('SportsTeam');
    }
  });

  it('includes team name', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.name).toBe('Central High Falcons');
    }
  });

  it('includes sport', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.sport).toBe('Football');
    }
  });

  it('includes team URL', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.url).toBe('https://example.com/teams/central-high');
    }
  });

  it('includes location when city and state provided', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.location).toBeDefined();
      expect(schema.location['@type']).toBe('Place');
      expect(schema.location.address.addressLocality).toBe('Philadelphia');
      expect(schema.location.address.addressRegion).toBe('PA');
    }
  });

  it('omits location when city not provided', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="Test Team"
        sport="Football"
        url="https://example.com"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.location).toBeUndefined();
    }
  });

  it('handles team without location', () => {
    const { container } = render(
      <SportsTeamJsonLd
        name="Generic Team"
        sport="Basketball"
        url="https://example.com"
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@type']).toBe('SportsTeam');
      expect(schema.name).toBe('Generic Team');
    }
  });

  it('includes AddressPostalAddress in location', () => {
    const { container } = render(<SportsTeamJsonLd {...teamProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.location.address['@type']).toBe('PostalAddress');
    }
  });
});
