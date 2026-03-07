import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabGroup, { TabPanel } from '@/components/ui/TabGroup';

describe('TabGroup', () => {
  const tabs = [
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' },
    { key: 'tab3', label: 'Tab 3', icon: '🏈' },
  ];

  it('renders all tabs', () => {
    render(<TabGroup tabs={tabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('first tab is active by default', () => {
    render(<TabGroup tabs={tabs} />);
    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  it('activates specified default tab', () => {
    render(<TabGroup tabs={tabs} defaultTab="tab2" />);
    const secondTab = screen.getByText('Tab 2').closest('button');
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when tab is clicked', () => {
    const onChange = vi.fn();
    render(<TabGroup tabs={tabs} onChange={onChange} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('renders icon when provided', () => {
    render(<TabGroup tabs={tabs} />);
    expect(screen.getByText('🏈')).toBeInTheDocument();
  });

  it('renders pills variant (default)', () => {
    const { container } = render(<TabGroup tabs={tabs} variant="pills" />);
    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toHaveClass('p-1');
  });

  it('renders underline variant', () => {
    const { container } = render(<TabGroup tabs={tabs} variant="underline" />);
    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toHaveClass('border-b');
  });

  it('activates tab on click and updates aria-selected', () => {
    const { container } = render(<TabGroup tabs={tabs} />);
    const secondTab = screen.getByText('Tab 2').closest('button');
    fireEvent.click(secondTab!);
    expect(secondTab).toHaveAttribute('aria-selected', 'true');

    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab).toHaveAttribute('aria-selected', 'false');
  });

  it('navigates tabs with arrow keys', () => {
    const onChange = vi.fn();
    render(<TabGroup tabs={tabs} onChange={onChange} />);
    const firstTab = screen.getByText('Tab 1').closest('button') as HTMLButtonElement;

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('wraps around with arrow keys (right arrow on last tab)', () => {
    const onChange = vi.fn();
    render(<TabGroup tabs={tabs} defaultTab="tab3" onChange={onChange} />);
    const lastTab = screen.getByText('Tab 3').closest('button') as HTMLButtonElement;

    lastTab.focus();
    fireEvent.keyDown(lastTab, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('wraps around with arrow keys (left arrow on first tab)', () => {
    const onChange = vi.fn();
    render(<TabGroup tabs={tabs} onChange={onChange} />);
    const firstTab = screen.getByText('Tab 1').closest('button') as HTMLButtonElement;

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });

    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  it('sets correct aria-controls attribute', () => {
    render(<TabGroup tabs={tabs} />);
    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab).toHaveAttribute('aria-controls', 'tabpanel-tab1');
  });

  it('sets correct tab id attributes', () => {
    render(<TabGroup tabs={tabs} />);
    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab).toHaveAttribute('id', 'tab-tab1');
  });

  it('has tablist role', () => {
    const { container } = render(<TabGroup tabs={tabs} />);
    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
  });

  it('renders tab without icon', () => {
    const tabsNoIcon = [{ key: 'tab1', label: 'Tab 1' }];
    render(<TabGroup tabs={tabsNoIcon} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });
});

describe('TabPanel', () => {
  it('renders when activeTab matches tabKey', () => {
    render(
      <TabPanel tabKey="tab1" activeTab="tab1">
        <div>Panel Content</div>
      </TabPanel>
    );
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('does not render when activeTab does not match tabKey', () => {
    render(
      <TabPanel tabKey="tab1" activeTab="tab2">
        <div>Panel Content</div>
      </TabPanel>
    );
    expect(screen.queryByText('Panel Content')).not.toBeInTheDocument();
  });

  it('has correct role and attributes', () => {
    const { container } = render(
      <TabPanel tabKey="tab1" activeTab="tab1">
        <div>Panel Content</div>
      </TabPanel>
    );
    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel).toHaveAttribute('id', 'tabpanel-tab1');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-tab1');
  });
});
