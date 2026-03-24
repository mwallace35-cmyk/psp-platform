"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Metadata } from "next";
import { getSchoolComparisonData, searchSchoolsForComparison } from "@/lib/data/school-compare";
import { SkeletonCard } from "@/components/ui/Skeleton";
import SortableTable from "@/components/ui/SortableTable";
import Link from "next/link";

function SchoolCompareContent() {
  const searchParams = useSearchParams();
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sport, setSport] = useState("football");

  // Load initial comparison from URL params
  useEffect(() => {
    const schoolParam = searchParams?.get("schools");
    const sportParam = searchParams?.get("sport");

    if (schoolParam) {
      const slugs = schoolParam.split(",").filter(Boolean);
      setSelectedSchools(slugs);
      loadComparison(slugs, sportParam || "football");
    }

    if (sportParam) {
      setSport(sportParam);
    }
  }, [searchParams]);

  const loadComparison = async (schools: string[], selectedSport: string) => {
    setLoading(true);
    try {
      const data = await getSchoolComparisonData(schools, selectedSport);
      setComparisonData(data);
    } catch (error) {
      console.error("Failed to load comparison:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchSchoolsForComparison(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const addSchool = (schoolSlug: string) => {
    if (!selectedSchools.includes(schoolSlug) && selectedSchools.length < 4) {
      const newSchools = [...selectedSchools, schoolSlug];
      setSelectedSchools(newSchools);
      loadComparison(newSchools, sport);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeSchool = (schoolSlug: string) => {
    const newSchools = selectedSchools.filter((s) => s !== schoolSlug);
    setSelectedSchools(newSchools);
    if (newSchools.length > 0) {
      loadComparison(newSchools, sport);
    }
  };

  const handleSportChange = (newSport: string) => {
    setSport(newSport);
    if (selectedSchools.length > 0) {
      loadComparison(selectedSchools, newSport);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="psp-h1 text-[var(--psp-navy)] mb-2"
        >
          Compare Schools
        </h1>
        <p className="text-gray-600">
          Compare up to 4 schools side-by-side. See all-time records, championships, and more.
        </p>
      </div>

      {/* School Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Search Schools
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type school name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {searchResults.map((school) => (
                <button
                  key={school.slug}
                  onClick={() => addSchool(school.slug)}
                  disabled={selectedSchools.length >= 4 || selectedSchools.includes(school.slug)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-b last:border-b-0"
                >
                  <p className="font-semibold text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-400">
                    {school.city}, {school.state}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Schools */}
        {selectedSchools.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSchools.map((slug) => {
              const school = comparisonData.find((s) => s.school_slug === slug);
              return (
                <div
                  key={slug}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm"
                >
                  {school?.school_name || slug}
                  <button
                    onClick={() => removeSchool(slug)}
                    className="font-bold cursor-pointer hover:text-blue-600"
                  >
                    �
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sport Filter */}
      {selectedSchools.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Sport
          </label>
          <div className="flex gap-2">
            {["football", "basketball", "baseball"].map((s) => (
              <button
                key={s}
                onClick={() => handleSportChange(s)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sport === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {loading ? (
        <SkeletonCard showImage={false} />
      ) : comparisonData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Metric
                </th>
                {comparisonData.map((school) => (
                  <th
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                  >
                    <Link href={`/football/schools/${school.school_slug}`}>
                      <span className="cursor-pointer hover:underline">
                        {school.school_name}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* All-Time Record */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  All-Time Record
                </td>
                {comparisonData.map((school) => (
                  <td key={school.school_id} className="px-6 py-3 text-center text-sm">
                    {school.all_time_wins}-{school.all_time_losses}
                    {school.all_time_ties > 0 ? `-${school.all_time_ties}` : ""}
                  </td>
                ))}
              </tr>

              {/* Win Percentage */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Win %
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.win_percentage ===
                        Math.max(...comparisonData.map((s) => s.win_percentage))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.win_percentage.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Championships */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Championships
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.total_championships ===
                        Math.max(...comparisonData.map((s) => s.total_championships))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.total_championships}
                  </td>
                ))}
              </tr>

              {/* Pro Athletes */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Pro Athletes
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.pro_athletes ===
                        Math.max(...comparisonData.map((s) => s.pro_athletes))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.pro_athletes}
                  </td>
                ))}
              </tr>

              {/* College Placements */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  College Placements
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.college_placements ===
                        Math.max(...comparisonData.map((s) => s.college_placements))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.college_placements}
                  </td>
                ))}
              </tr>

              {/* All-City Selections */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  All-City Selections
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.all_city_selections ===
                        Math.max(...comparisonData.map((s) => s.all_city_selections))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.all_city_selections}
                  </td>
                ))}
              </tr>

              {/* Current Roster */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  Current Roster
                </td>
                {comparisonData.map((school) => (
                  <td
                    key={school.school_id}
                    className="px-6 py-3 text-center text-sm font-semibold"
                    style={{
                      color: school.current_roster_size ===
                        Math.max(...comparisonData.map((s) => s.current_roster_size))
                        ? "var(--psp-gold)"
                        : "inherit",
                    }}
                  >
                    {school.current_roster_size}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : selectedSchools.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-8 text-center border-l-4 border-blue-500">
          <p className="text-gray-700">
            Select 2-4 schools above to compare their records and achievements.
          </p>
        </div>
      ) : (
        <div className="bg-red-50 rounded-lg p-8 text-center border-l-4 border-red-500">
          <p className="text-red-700">No comparison data available for selected schools.</p>
        </div>
      )}
    </div>
  );
}

export default function SchoolComparePage() {
  return (
    <Suspense fallback={<SkeletonCard showImage={false} />}>
      <SchoolCompareContent />
    </Suspense>
  );
}
