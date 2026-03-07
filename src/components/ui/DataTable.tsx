interface Column<T> {
  key: keyof T & string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const handleRowKeyDown = (row: T, e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(row);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: "var(--psp-gray-400)" }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const rowId = (row.id as string | number) ?? i;
            const firstColumnValue = row[columns[0].key]?.toString() ?? "Row";
            const secondColumnValue = columns.length > 1 ? row[columns[1].key]?.toString() ?? "" : "";
            const ariaLabelText = secondColumnValue ? `${firstColumnValue} - ${secondColumnValue}` : firstColumnValue;

            return (
            <tr
              key={rowId}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(e) => handleRowKeyDown(row, e)}
              tabIndex={onRowClick ? 0 : -1}
              role={onRowClick ? "button" : undefined}
              className={onRowClick ? "cursor-pointer data-table-row-clickable" : ""}
              aria-label={onRowClick ? `View details for ${ariaLabelText}` : undefined}
              style={onRowClick ? { outline: "none" } : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : (row[col.key]?.toString() ?? "—")}
                </td>
              ))}
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}
