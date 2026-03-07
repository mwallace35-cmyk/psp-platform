import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '@/components/ui/DataTable';

describe('DataTable', () => {
  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'score' as const, label: 'Score', align: 'right' as const },
  ];
  const data = [
    { name: 'Player A', score: '100' },
    { name: 'Player B', score: '85' },
  ];

  it('renders table with headers and data', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Player A')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const onClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onClick} />);
    fireEvent.click(screen.getByText('Player A'));
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('calls onRowClick with correct row data', () => {
    const onClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onClick} />);
    fireEvent.click(screen.getByText('Player B'));
    expect(onClick).toHaveBeenCalledWith(data[1]);
  });

  it('renders custom render function', () => {
    const columnsWithRender = [
      { key: 'name' as const, label: 'Name', render: (val: unknown) => `** ${val} **` },
    ];
    render(<DataTable columns={columnsWithRender} data={[{ name: 'Test' }]} />);
    expect(screen.getByText('** Test **')).toBeInTheDocument();
  });

  it('renders multiple rows correctly', () => {
    const moreData = [
      { name: 'Player A', score: '100' },
      { name: 'Player B', score: '85' },
      { name: 'Player C', score: '92' },
    ];
    render(<DataTable columns={columns} data={moreData} />);
    expect(screen.getByText('Player A')).toBeInTheDocument();
    expect(screen.getByText('Player B')).toBeInTheDocument();
    expect(screen.getByText('Player C')).toBeInTheDocument();
  });

  it('applies text alignment classes correctly', () => {
    render(<DataTable columns={columns} data={data} />);
    const table = screen.getByText('Score').closest('th');
    expect(table).toHaveClass('text-right');
  });

  it('renders dash for null/undefined values', () => {
    const dataWithNull = [
      { name: 'Player A', score: undefined },
    ];
    render(<DataTable columns={columns} data={dataWithNull} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies cursor-pointer class when onRowClick provided', () => {
    const onClick = vi.fn();
    const { container } = render(<DataTable columns={columns} data={data} onRowClick={onClick} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('cursor-pointer');
  });

  it('does not apply cursor-pointer class when onRowClick not provided', () => {
    const { container } = render(<DataTable columns={columns} data={data} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).not.toHaveClass('cursor-pointer');
  });

  it('passes row data to custom render function', () => {
    const renderFn = vi.fn(() => 'rendered');
    const columnsWithRender = [
      { key: 'name' as const, label: 'Name', render: renderFn },
    ];
    const testData = [{ name: 'Test Value' }];
    render(<DataTable columns={columnsWithRender} data={testData} />);
    expect(renderFn).toHaveBeenCalledWith('Test Value', testData[0]);
  });
});
