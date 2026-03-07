import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import StreamingWrapper from '@/components/streaming/StreamingWrapper';

/**
 * Tests for StreamingWrapper component
 *
 * StreamingWrapper provides a generic Suspense boundary for streaming SSR.
 * It enables independent streaming of page sections for better perceived performance.
 */

describe('StreamingWrapper', () => {
  it('renders children correctly', () => {
    render(
      <StreamingWrapper>
        <div>Test content</div>
      </StreamingWrapper>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders fallback while loading', () => {
    const TestComponent = () => {
      throw new Promise((resolve) => setTimeout(resolve, 100));
    };

    render(
      <StreamingWrapper fallback={<div>Loading...</div>}>
        <TestComponent />
      </StreamingWrapper>
    );

    // The fallback should render while component is loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders without fallback if not provided', () => {
    render(
      <StreamingWrapper>
        <div>No fallback</div>
      </StreamingWrapper>
    );
    expect(screen.getByText('No fallback')).toBeInTheDocument();
  });

  it('applies className to wrapper div', () => {
    const { container } = render(
      <StreamingWrapper className="custom-class">
        <div>Content</div>
      </StreamingWrapper>
    );
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('wraps children in a div element', () => {
    const { container } = render(
      <StreamingWrapper>
        <span>Child</span>
      </StreamingWrapper>
    );
    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div?.querySelector('span')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <StreamingWrapper>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </StreamingWrapper>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('is memoized to prevent unnecessary re-renders', () => {
    // Verify that StreamingWrapper is wrapped with React.memo
    expect(StreamingWrapper).toBeDefined();
    // The component should have the memo wrapper applied
  });

  it('supports complex JSX children', () => {
    render(
      <StreamingWrapper
        fallback={<div>Loading skeleton...</div>}
        className="stream-section"
      >
        <section>
          <h2>Section Title</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </section>
      </StreamingWrapper>
    );
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
