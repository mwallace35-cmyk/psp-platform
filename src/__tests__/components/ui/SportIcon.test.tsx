import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SportIcon, { SPORT_EMOJI, SPORT_COLORS } from '@/components/ui/SportIcon';

describe('SportIcon', () => {
  it('renders sport icon', () => {
    render(<SportIcon sport="football" />);
    expect(screen.getByText('🏈')).toBeInTheDocument();
  });

  it('is a div element', () => {
    const { container } = render(<SportIcon sport="football" />);
    const icon = container.querySelector('div');
    expect(icon?.tagName).toBe('DIV');
  });

  it('applies flex centering classes', () => {
    const { container } = render(<SportIcon sport="football" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('inline-flex');
    expect(icon).toHaveClass('items-center');
    expect(icon).toHaveClass('justify-center');
  });

  it('applies rounded corner class', () => {
    const { container } = render(<SportIcon sport="basketball" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('rounded-xl');
  });

  it('renders football emoji', () => {
    render(<SportIcon sport="football" />);
    expect(screen.getByText('🏈')).toBeInTheDocument();
  });

  it('renders basketball emoji', () => {
    render(<SportIcon sport="basketball" />);
    expect(screen.getByText('🏀')).toBeInTheDocument();
  });

  it('renders baseball emoji', () => {
    render(<SportIcon sport="baseball" />);
    expect(screen.getByText('⚾')).toBeInTheDocument();
  });

  it('renders track-field emoji', () => {
    render(<SportIcon sport="track-field" />);
    expect(screen.getByText('🏃')).toBeInTheDocument();
  });

  it('renders lacrosse emoji', () => {
    render(<SportIcon sport="lacrosse" />);
    expect(screen.getByText('🥍')).toBeInTheDocument();
  });

  it('renders wrestling emoji', () => {
    render(<SportIcon sport="wrestling" />);
    expect(screen.getByText('🤼')).toBeInTheDocument();
  });

  it('renders soccer emoji', () => {
    render(<SportIcon sport="soccer" />);
    expect(screen.getByText('⚽')).toBeInTheDocument();
  });

  it('renders swimming emoji', () => {
    render(<SportIcon sport="swimming" />);
    expect(screen.getByText('🏊')).toBeInTheDocument();
  });

  it('renders golf emoji', () => {
    render(<SportIcon sport="golf" />);
    expect(screen.getByText('⛳')).toBeInTheDocument();
  });

  it('renders tennis emoji', () => {
    render(<SportIcon sport="tennis" />);
    expect(screen.getByText('🎾')).toBeInTheDocument();
  });

  it('renders default emoji for unknown sport', () => {
    render(<SportIcon sport="unknown-sport" />);
    expect(screen.getByText('🏅')).toBeInTheDocument();
  });

  it('applies sm size', () => {
    const { container } = render(<SportIcon sport="football" size="sm" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('text-lg');
    expect(icon).toHaveClass('w-8');
    expect(icon).toHaveClass('h-8');
  });

  it('applies md size by default', () => {
    const { container } = render(<SportIcon sport="football" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('text-2xl');
    expect(icon).toHaveClass('w-12');
    expect(icon).toHaveClass('h-12');
  });

  it('applies lg size', () => {
    const { container } = render(<SportIcon sport="football" size="lg" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('text-4xl');
    expect(icon).toHaveClass('w-16');
    expect(icon).toHaveClass('h-16');
  });

  it('applies sport color background', () => {
    const { container } = render(<SportIcon sport="football" />);
    const icon = container.querySelector('div');
    const style = icon?.getAttribute('style');
    expect(style).toBeDefined();
    expect(style).toContain('background');
  });

  it('applies default color for unknown sport', () => {
    const { container } = render(<SportIcon sport="unknown" />);
    const icon = container.querySelector('div');
    const style = icon?.getAttribute('style');
    expect(style).toBeDefined();
    expect(style).toContain('background');
  });

  it('applies custom className', () => {
    const { container } = render(<SportIcon sport="football" className="custom" />);
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('custom');
  });

  it('combines size and custom className', () => {
    const { container } = render(
      <SportIcon sport="basketball" size="lg" className="extra-class" />
    );
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('w-16');
    expect(icon).toHaveClass('extra-class');
  });

  it('exports SPORT_EMOJI constant', () => {
    expect(SPORT_EMOJI.football).toBe('🏈');
    expect(SPORT_EMOJI.basketball).toBe('🏀');
    expect(Object.keys(SPORT_EMOJI).length).toBeGreaterThan(0);
  });

  it('exports SPORT_COLORS constant', () => {
    expect(SPORT_COLORS.football).toBe('#16a34a');
    expect(SPORT_COLORS.basketball).toBe('#ea580c');
    expect(Object.keys(SPORT_COLORS).length).toBeGreaterThan(0);
  });

  it('has different colors for different sports', () => {
    const footballColor = SPORT_COLORS.football;
    const basketballColor = SPORT_COLORS.basketball;
    expect(footballColor).not.toBe(basketballColor);
  });

  it('renders with all size and style variations', () => {
    const { container } = render(
      <SportIcon sport="soccer" size="lg" className="highlight" />
    );
    const icon = container.querySelector('div');
    expect(icon).toHaveClass('w-16');
    expect(icon).toHaveClass('highlight');
    expect(screen.getByText('⚽')).toBeInTheDocument();
  });
});
