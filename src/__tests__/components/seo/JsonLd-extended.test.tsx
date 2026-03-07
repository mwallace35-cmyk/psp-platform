import { render } from '@testing-library/react';
import { CoachJsonLd, ChampionshipJsonLd } from '@/components/seo/JsonLd';
import { describe, it, expect } from 'vitest';

describe('CoachJsonLd', () => {
  it('renders script tag with proper schema.org type', () => {
    const { container } = render(
      <CoachJsonLd
        name="John Doe"
        sport="football"
        school="Lincoln High"
        record="85-20"
        championships={3}
        url="https://example.com/coach"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('John Doe');
    expect(schema.jobTitle).toBe('football Coach');
  });

  it('includes affiliation when school is provided', () => {
    const { container } = render(
      <CoachJsonLd
        name="Jane Smith"
        sport="basketball"
        school="Central High"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.affiliation).toBeDefined();
    expect(schema.affiliation['@type']).toBe('Organization');
    expect(schema.affiliation.name).toBe('Central High');
  });

  it('includes description with championships and record', () => {
    const { container } = render(
      <CoachJsonLd
        name="Coach Winner"
        sport="baseball"
        championships={5}
        record="120-30"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.description).toContain('Coach Winner');
    expect(schema.description).toContain('5 championships');
    expect(schema.description).toContain('120-30');
  });
});

describe('ChampionshipJsonLd', () => {
  it('renders script tag with Event schema type', () => {
    const { container } = render(
      <ChampionshipJsonLd
        sport="football"
        year={2023}
        winner="Lincoln High"
        url="https://example.com/championship"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schema = JSON.parse(script?.textContent || '{}');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Event');
  });

  it('includes proper championship event details', () => {
    const { container } = render(
      <ChampionshipJsonLd
        sport="basketball"
        year={2024}
        winner="Central High"
        runnerUp="West High"
        url="https://example.com/bb-championship"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.name).toBe('2024 basketball Championship');
    expect(schema.description).toContain('2024');
    expect(schema.description).toContain('basketball championship');
    expect(schema.location.name).toBe('Philadelphia');
  });

  it('includes winner organization', () => {
    const { container } = render(
      <ChampionshipJsonLd
        sport="baseball"
        year={2023}
        winner="Northeast High"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.winner).toBeDefined();
    expect(schema.winner['@type']).toBe('Organization');
    expect(schema.winner.name).toBe('Northeast High');
  });

  it('includes runner-up when provided', () => {
    const { container } = render(
      <ChampionshipJsonLd
        sport="soccer"
        year={2023}
        winner="School A"
        runnerUp="School B"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.runnerUp).toBeDefined();
    expect(schema.runnerUp['@type']).toBe('Organization');
    expect(schema.runnerUp.name).toBe('School B');
  });

  it('sets date range for the championship year', () => {
    const { container } = render(
      <ChampionshipJsonLd
        sport="track"
        year={2025}
        winner="Fast High"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || '{}');

    expect(schema.startDate).toBe('2025-01-01');
    expect(schema.endDate).toBe('2025-12-31');
  });
});
