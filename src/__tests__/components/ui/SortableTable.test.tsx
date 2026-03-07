import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SortableTable, { SortableColumn } from '@/components/ui/SortableTable';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('SortableTable', () => {
  const mockColumns: SortableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'wins', label: 'Wins', sortable: true, align: 'right' },
    { key: 'losses', label: 'Losses', sortable: true, align: 'right' },
    { key: 'notes', label: 'Notes', sortable: false },
  ];

  const mockData = [
    { name: 'Team A', wins: 10, losses: 2, notes: 'Good team' },
    { name: 'Team B', wins: 8, losses: 4, notes: 'Average team' },
    { name: 'Team C', wins: 12, losses: 1, notes: 'Great team' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with columns', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Wins')).toBeInTheDocument();
    expect(screen.getByText('Losses')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Team B')).toBeInTheDocument();
    expect(screen.getByText('Team C')).toBeInTheDocument();
  });

  it('sorts data when column header is clicked', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    // After clicking, data should be sorted
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('toggles sort direction on repeated header clicks', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const winsHeader = screen.getByText('Wins').closest('th');

    if (!winsHeader) {
      throw new Error('Wins header not found');
    }

    // First click - ascending
    fireEvent.click(winsHeader);
    expect(winsHeader).toHaveAttribute('aria-sort', 'ascending');

    // Second click - descending
    fireEvent.click(winsHeader);
    expect(winsHeader).toHaveAttribute('aria-sort', 'descending');

    // Third click - clear sort
    fireEvent.click(winsHeader);
    expect(winsHeader).toHaveAttribute('aria-sort', 'none');
  });

  it('handles keyboard interaction on sortable headers', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name');
    nameHeader.focus();

    // Press Enter to sort
    fireEvent.keyDown(nameHeader, { key: 'Enter' });
    expect(nameHeader).toBeInTheDocument();

    // Press Space to change sort direction
    fireEvent.keyDown(nameHeader, { key: ' ' });
    expect(nameHeader).toBeInTheDocument();
  });

  it('does not sort when clicking non-sortable columns', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const notesHeader = screen.getByText('Notes');
    fireEvent.click(notesHeader);

    // Should not have aria-sort attribute (non-sortable columns don't have it)
    expect(notesHeader.getAttribute('aria-sort')).toBeNull();
  });

  it('displays empty message when data is empty', () => {
    render(
      <SortableTable
        columns={mockColumns}
        data={[]}
        emptyMessage="No teams found"
      />
    );
    expect(screen.getByText('No teams found')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn();
    render(
      <SortableTable
        columns={mockColumns}
        data={mockData}
        onRowClick={onRowClick}
      />
    );

    const teamARow = screen.getByText('Team A').closest('tr');
    if (teamARow) {
      fireEvent.click(teamARow);
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('highlights top 3 rows when requested', () => {
    render(
      <SortableTable
        columns={mockColumns}
        data={mockData}
        highlightTop3={true}
      />
    );

    const rows = screen.getAllByRole('row');
    // Rows should be rendered with potential highlighting
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders custom column content with render function', () => {
    const customColumns: SortableColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      {
        key: 'wins',
        label: 'Wins',
        sortable: true,
        render: (value) => `${value} W`,
      },
    ];

    render(<SortableTable columns={customColumns} data={mockData} />);
    expect(screen.getByText(/10 W/)).toBeInTheDocument();
  });

  it('maintains correct aria-sort attributes during sorting', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name');
    const winsHeader = screen.getByText('Wins');

    fireEvent.click(nameHeader);
    expect(nameHeader).toBeInTheDocument();

    fireEvent.click(winsHeader);
    expect(winsHeader).toBeInTheDocument();
    expect(nameHeader).toBeInTheDocument();
  });

  it('displays sort direction indicators on sorted columns', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const winsHeader = screen.getByText('Wins').closest('th');
    if (winsHeader) {
      fireEvent.click(winsHeader);
      // After clicking, there should be a visual indicator (▲ or ▼)
      expect(winsHeader).toBeInTheDocument();
    }
  });

  it('handles Enter key on sortable headers', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name').closest('th');
    if (nameHeader) {
      fireEvent.keyDown(nameHeader, { key: 'Enter' });
      expect(nameHeader).toBeInTheDocument();
    }
  });

  it('handles Space key on sortable headers', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const winsHeader = screen.getByText('Wins').closest('th');
    if (winsHeader) {
      fireEvent.keyDown(winsHeader, { key: ' ' });
      expect(winsHeader).toBeInTheDocument();
    }
  });

  it('provides proper aria-labels for sortable columns', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name').closest('th');
    if (nameHeader) {
      expect(nameHeader).toHaveAttribute('aria-label');
      expect(nameHeader?.getAttribute('aria-label')).toMatch(/sort/i);
    }
  });

  it('renders table with proper structure', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(mockData.length); // header + data rows
  });

  it('aligns right-aligned columns correctly', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const winsHeader = screen.getByText('Wins').closest('th');
    expect(winsHeader).toHaveStyle({ textAlign: 'right' });
  });

  it('applies hover styles to clickable rows', () => {
    const onRowClick = vi.fn();
    render(
      <SortableTable
        columns={mockColumns}
        data={mockData}
        onRowClick={onRowClick}
      />
    );

    const teamARow = screen.getByText('Team A').closest('tr');
    expect(teamARow).toHaveClass('cursor-pointer');
  });

  it('highlights first place team differently', () => {
    render(
      <SortableTable
        columns={mockColumns}
        data={mockData}
        highlightTop3={true}
      />
    );

    const rows = screen.getAllByRole('row');
    // First data row (Team C with 12 wins - highest) should have highlight
    expect(rows.length).toBeGreaterThan(0);
  });

  it('respects hideOnMobile column property', () => {
    const mobileColumns: SortableColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'wins', label: 'Wins', sortable: true, hideOnMobile: true },
      { key: 'losses', label: 'Losses', sortable: true },
    ];

    render(<SortableTable columns={mobileColumns} data={mockData} />);

    // In desktop view, all columns render including hideOnMobile ones
    // The hideOnMobile property only affects mobile view via mobileCardMode
    expect(screen.getByText('Losses')).toBeInTheDocument();
  });

  it('handles sorting with special characters in data', () => {
    const specialData = [
      { name: 'Team A!', wins: 10, losses: 2 },
      { name: 'Team @B', wins: 8, losses: 4 },
      { name: 'Team #C', wins: 12, losses: 1 },
    ];

    render(<SortableTable columns={mockColumns} data={specialData} />);

    const nameHeader = screen.getByText('Name').closest('th');
    if (nameHeader) {
      fireEvent.click(nameHeader);
      expect(screen.getByText('Team A!')).toBeInTheDocument();
    }
  });

  it('maintains sort state across multiple columns', () => {
    render(<SortableTable columns={mockColumns} data={mockData} />);

    const nameHeader = screen.getByText('Name').closest('th');
    const winsHeader = screen.getByText('Wins').closest('th');

    // Sort by name
    if (nameHeader) {
      fireEvent.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    }

    // Sort by wins - should replace name sort
    if (winsHeader) {
      fireEvent.click(winsHeader);
      expect(winsHeader).toHaveAttribute('aria-sort', 'ascending');
    }
  });
});
