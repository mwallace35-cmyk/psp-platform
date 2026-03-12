"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFilteredRecords, getRecordCount, type RecordFilter, type RecordWithDetails } from "@/lib/data/records";
import { SortableTable } from "@/components/ui";
import styles from "@/app/homepage.module.css";

interface RecordsExplorerViewProps {
  initialRecordCount: number;
  categories: string[];
  sports: string[];
}

export default function RecordsExplorerView({
  initialRecordCount,
  categories,
  sports,
}: RecordsExplorerViewProps) {
  // State
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedEra, setSelectedEra] = useState<"all-time" | "2020-26" | "2010-19" | "2000-09" | "pre-2000">("all-time");
  const [selectedScope, setSelectedScope] = useState<string>("");
  const [records, setRecords] = useState<RecordWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialRecordCount);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 25;

  // Build filter object
  const filters: RecordFilter = {
    category: selectedCategory || undefined,
    era: selectedEra,
    scope: selectedScope ? (selectedScope as "career" | "season" | "game" | "team") : undefined,
  };

  // Fetch records when filters change
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const [newRecords, newTotal] = await Promise.all([
          getFilteredRecords(filters, recordsPerPage, 0),
          getRecordCount(filters),
        ]);

        setRecords(newRecords);
        setTotalCount(newTotal);
      } catch (error) {
        console.error("Failed to fetch records:", error);
        setRecords([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [selectedCategory, selectedEra, selectedScope, selectedSport]);

  // Handle pagination
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);

    try {
      const offset = (page - 1) * recordsPerPage;
      const newRecords = await getFilteredRecords(filters, recordsPerPage, offset);
      setRecords(newRecords);
    } catch (error) {
      console.error("Failed to fetch page:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / recordsPerPage);

  // Table columns
  const columns = [
    { key: "rank", label: "Rank" },
    { key: "category", label: "Category" },
    { key: "record_value", label: "Record" },
    { key: "holder", label: "Holder" },
    { key: "school", label: "School" },
    { key: "year", label: "Year" },
  ];

  // Transform records for table
  const tableData = records.map((record, idx) => ({
    rank: ((currentPage - 1) * recordsPerPage + idx + 1).toString(),
    category: record.category,
    record_value: `${record.record_number || record.record_value || "N/A"}`,
    holder: record.player_name ? (
      <Link
        href={`/${record.sport_id || "football"}/players/${record.player_slug}`}
        className="text-blue-600 hover:underline"
      >
        {record.player_name}
      </Link>
    ) : (
      record.holder_name || "—"
    ),
    school: record.school_name ? (
      <Link
        href={`/${record.sport_id || "football"}/schools/${record.school_slug}`}
        className="text-blue-600 hover:underline"
      >
        {record.school_name}
      </Link>
    ) : (
      "—"
    ),
    year: record.year_set ? record.year_set.toString() : "—",
  }));

  return (
    <div>
      {/* Filter Panel */}
      <div className="mb-8 p-6 rounded-lg border border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--psp-navy)" }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: "var(--psp-gold)" }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Era Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--psp-navy)" }}>
              Era
            </label>
            <select
              value={selectedEra}
              onChange={(e) =>
                setSelectedEra(
                  e.target.value as "all-time" | "2020-26" | "2010-19" | "2000-09" | "pre-2000"
                )
              }
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: "var(--psp-gold)" }}
            >
              <option value="all-time">All-Time</option>
              <option value="2020-26">2020-2026</option>
              <option value="2010-19">2010-2019</option>
              <option value="2000-09">2000-2009</option>
              <option value="pre-2000">Pre-2000</option>
            </select>
          </div>

          {/* Scope Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--psp-navy)" }}>
              Scope
            </label>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: "var(--psp-gold)" }}
            >
              <option value="">All Scopes</option>
              <option value="career">Career</option>
              <option value="season">Single Season</option>
              <option value="game">Single Game</option>
              <option value="team">Team</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedSport("");
                setSelectedCategory("");
                setSelectedEra("all-time");
                setSelectedScope("");
              }}
              className="w-full px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: "var(--psp-navy)" }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-700">
          Showing <strong>{records.length}</strong> of <strong>{totalCount}</strong> records
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--psp-gold)" }}></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && records.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No records found matching your filters.</p>
        </div>
      )}

      {/* Records Table */}
      {!loading && records.length > 0 && (
        <>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(10, 22, 40, 0.05)", borderBottom: "2px solid var(--psp-gold)" }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left font-semibold"
                      style={{ color: "var(--psp-navy)" }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <td className="px-4 py-3">{row.rank}</td>
                    <td className="px-4 py-3 font-semibold">{row.category}</td>
                    <td className="px-4 py-3">{row.record_value}</td>
                    <td className="px-4 py-3">{row.holder}</td>
                    <td className="px-4 py-3">{row.school}</td>
                    <td className="px-4 py-3">{row.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{
                  background: currentPage === 1 ? "#e5e7eb" : "var(--psp-navy)",
                  color: currentPage === 1 ? "#999" : "white",
                }}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold"
                      style={{
                        background:
                          pageNum === currentPage ? "var(--psp-gold)" : "#e5e7eb",
                        color:
                          pageNum === currentPage ? "var(--psp-navy)" : "#333",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{
                  background:
                    currentPage === totalPages ? "#e5e7eb" : "var(--psp-navy)",
                  color: currentPage === totalPages ? "#999" : "white",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
