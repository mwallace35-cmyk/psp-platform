"use client";
import { School } from "lucide-react";

export default function CategoryTabs({
  categories,
  categoryCounts,
  activeCategory,
  schoolRecordBooksCount,
  onSelectCategory,
  onSelectSchools,
}: {
  categories: string[];
  categoryCounts: Record<string, number>;
  activeCategory: string | null;
  schoolRecordBooksCount: number;
  onSelectCategory: (cat: string) => void;
  onSelectSchools: () => void;
}) {
  return (
    /* Category Pills Navigation */
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        overflowX: "auto",
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      {categories.map((cat) => {
        const count = categoryCounts[cat] || 0;
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? "var(--psp-navy, #0a1628)" : "var(--psp-navy, #0a1628)",
              background: isActive ? "var(--psp-gold, #f0a500)" : "#f3f4f6",
              border: `2px solid ${isActive ? "var(--psp-gold, #f0a500)" : "transparent"}`,
              borderRadius: 20,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 200ms ease",
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            }}
          >
            {cat} <span style={{ marginLeft: 6, opacity: 0.85 }}>({count})</span>
          </button>
        );
      })}
      <button
        onClick={onSelectSchools}
        style={{
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: activeCategory === "__schools__" ? "var(--psp-navy, #0a1628)" : "var(--psp-navy, #0a1628)",
          background: activeCategory === "__schools__" ? "var(--psp-gold, #f0a500)" : "#f3f4f6",
          border: `2px solid ${activeCategory === "__schools__" ? "var(--psp-gold, #f0a500)" : "transparent"}`,
          borderRadius: 20,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 200ms ease",
          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
        }}
      >
        <School className="w-4 h-4 inline" /> School Records ({schoolRecordBooksCount})
      </button>
    </div>
  );
}
