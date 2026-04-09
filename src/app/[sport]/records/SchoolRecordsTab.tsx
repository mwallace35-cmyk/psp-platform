"use client";

import Link from "next/link";

// Computed records from stats tables
interface ComputedRecord {
  stat_category: string;
  stat_name: string;
  scope: "career" | "season";
  rank: number;
  value: number;
  display_value: string;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  season_label: string | null;
  year: number | null;
  source: "computed";
}

// School record book
interface SchoolRecordBook {
  school_name: string;
  school_slug: string;
  records: ComputedRecord[];
}

// School Records Tab
export default function SchoolRecordsTab({
  schoolBooks,
  totalSchools,
  searchValue,
  onSearch,
  sport,
  sportColor,
}: {
  schoolBooks: SchoolRecordBook[];
  totalSchools: number;
  searchValue: string;
  onSearch: (v: string) => void;
  sport: string;
  sportColor: string;
}) {
  return (
    <div>
      {/* Search box */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder={`Search ${totalSchools} schools...`}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "10px 16px",
            fontSize: 14,
            border: "2px solid #e5e7eb",
            borderRadius: 8,
            outline: "none",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}
          onFocus={(e) => (e.target.style.borderColor = sportColor)}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        {searchValue && (
          <span style={{ marginLeft: 12, fontSize: 13, color: "#6b7280" }}>
            {schoolBooks.length} of {totalSchools} schools
          </span>
        )}
      </div>

      {/* School cards grid */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {schoolBooks.map((schoolBook) => (
          <div key={schoolBook.school_slug} style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            {/* Header */}
            <div
              style={{
                padding: "12px 16px",
                background: "var(--psp-navy, #0a1628)",
                borderBottom: `3px solid ${sportColor}`,
              }}
            >
              <h3 className="psp-h4 text-white">
                <Link href={`/${sport}/schools/${schoolBook.school_slug}`} style={{ color: "#fff", textDecoration: "none" }}>
                  {schoolBook.school_name} →
                </Link>
              </h3>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{schoolBook.records.length} records</span>
            </div>

            {/* Record table */}
            <div style={{ padding: "8px 0" }}>
              <table aria-label="School record book" style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
                      Stat
                    </th>
                    <th style={{ padding: "6px 12px", textAlign: "right", fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolBook.records.slice(0, 5).map((rec) => (
                    <tr key={`${rec.player_slug}-${rec.scope}`} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "6px 12px" }}>
                        <span style={{ fontWeight: 500 }}>{rec.stat_name}</span>
                      </td>
                      <td style={{ padding: "6px 12px", textAlign: "right", fontWeight: 700, color: sportColor }}>
                        {rec.display_value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {schoolBooks.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <p>No schools match "{searchValue}"</p>
        </div>
      )}
    </div>
  );
}
