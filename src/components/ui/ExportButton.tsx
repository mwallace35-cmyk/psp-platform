'use client';

import { useState } from 'react';

interface ColumnConfig {
  key: string;
  label: string;
}

interface ExportButtonProps {
  data: Record<string, any>[];
  filename?: string;
  columns: ColumnConfig[];
}

export default function ExportButton({
  data,
  filename = 'psp-export.csv',
  columns,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) {
      return;
    }

    setIsExporting(true);

    try {
      // Build CSV header
      const header = columns.map((col) => `"${col.label}"`).join(',');

      // Build CSV rows
      const rows = data.map((row) =>
        columns
          .map((col) => {
            const value = row[col.key];
            // Escape quotes in values and wrap in quotes if contains comma or quote
            const stringValue = String(value ?? '');
            const escaped = stringValue.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      );

      // Combine header and rows
      const csv = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--psp-gray-600)',
        background: 'transparent',
        border: '1px solid var(--psp-gray-300)',
        borderRadius: '6px',
        cursor: isExporting || !data || data.length === 0 ? 'not-allowed' : 'pointer',
        opacity: isExporting || !data || data.length === 0 ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isExporting && data && data.length > 0) {
          (e.target as HTMLElement).style.borderColor = 'var(--psp-gold)';
          (e.target as HTMLElement).style.color = 'var(--psp-gold)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExporting && data && data.length > 0) {
          (e.target as HTMLElement).style.borderColor = 'var(--psp-gray-300)';
          (e.target as HTMLElement).style.color = 'var(--psp-gray-600)';
        }
      }}
      title="Export table to CSV"
    >
      <span>📥</span>
      <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
    </button>
  );
}
