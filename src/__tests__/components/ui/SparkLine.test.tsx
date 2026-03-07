import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SparkLine from '@/components/ui/SparkLine';

describe('SparkLine', () => {
  it('renders SVG element', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with default dimensions', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '80');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders with custom width', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} width={100} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
  });

  it('renders with custom height', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} height={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '50');
  });

  it('renders dash when data is empty', () => {
    const { container } = render(<SparkLine data={[]} />);
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('—');
  });

  it('renders dash when data is undefined', () => {
    const { container } = render(<SparkLine data={undefined as any} />);
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('—');
  });

  it('renders single point as circle', () => {
    const { container } = render(<SparkLine data={[5]} />);
    const circle = container.querySelector('circle');
    expect(circle).toBeInTheDocument();
  });

  it('single point circle has correct center', () => {
    const { container } = render(<SparkLine data={[5]} width={80} height={24} />);
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('cx', '40');
    expect(circle).toHaveAttribute('cy', '12');
  });

  it('renders polyline for multiple data points', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('polyline has correct fill and stroke', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('fill', 'none');
    expect(polyline).toHaveAttribute('stroke', '#f0a500');
  });

  it('renders with custom color', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} color="#ff0000" />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke', '#ff0000');
  });

  it('renders with custom color for single point', () => {
    const { container } = render(<SparkLine data={[5]} color="#00ff00" />);
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('fill', '#00ff00');
  });

  it('does not show dot by default', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(0);
  });

  it('shows dot when showDot is true', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} showDot={true} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(1);
  });

  it('dot has correct styling', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} showDot={true} />);
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '2');
    expect(circle).toHaveAttribute('fill', '#f0a500');
  });

  it('dot shows at last data point', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} showDot={true} width={100} />);
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('r', '2');
  });

  it('polyline has stroke width 1.5', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke-width', '1.5');
  });

  it('polyline has round line cap', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke-linecap', 'round');
  });

  it('polyline has round line join', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('handles flat data (all same values)', () => {
    const { container } = render(<SparkLine data={[5, 5, 5, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('handles increasing data', () => {
    const { container } = render(<SparkLine data={[1, 2, 3, 4, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline?.getAttribute('points')).toBeDefined();
  });

  it('handles decreasing data', () => {
    const { container } = render(<SparkLine data={[5, 4, 3, 2, 1]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline?.getAttribute('points')).toBeDefined();
  });

  it('handles data with negative values', () => {
    const { container } = render(<SparkLine data={[-5, -2, 0, 3, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('handles large data values', () => {
    const { container } = render(<SparkLine data={[1000, 2000, 3000]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('viewBox is correct', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} width={80} height={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 80 24');
  });

  it('viewBox updates with dimension changes', () => {
    const { container } = render(<SparkLine data={[1, 2, 3]} width={100} height={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 100 50');
  });

  it('renders with all options', () => {
    const { container } = render(
      <SparkLine data={[1, 3, 2, 5, 4]} width={120} height={40} color="#ff6b6b" showDot={true} />
    );
    const svg = container.querySelector('svg');
    const polyline = container.querySelector('polyline');
    const circle = container.querySelector('circle');
    expect(svg).toHaveAttribute('width', '120');
    expect(polyline).toHaveAttribute('stroke', '#ff6b6b');
    expect(circle).toBeInTheDocument();
  });

  it('renders many data points', () => {
    const data = Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.1) * 10);
    const { container } = render(<SparkLine data={data} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('single point with showDot true', () => {
    const { container } = render(<SparkLine data={[42]} showDot={true} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(1);
  });

  it('two points render polyline', () => {
    const { container } = render(<SparkLine data={[1, 5]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });
});
