"use client";

import { Suspense, useState, useEffect } from "react";
import type { Metadata } from "next";
import { searchRecruits, getTopViewedPlayers, getRecentCommits } from "@/lib/data/recruiter";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Link from "next/link";

function RecruiterPortalContent() {
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Filters
  const [sport, setSport] = useState("football");
  const [positions, setPositions] = useState<string[]>([]);
  const [minHeight, setMinHeight] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [minGpa, setMinGpa] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [divisionPref, setDivisionPref] = useState("");
  const [search, setSearch] = useState("");

  // Sidebar data
  const [topViewed, setTopViewed] = useState<any[]>([]);
  const [recentCommits, setRecentCommits] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadRecruits();
    loadSidebarData();
  }, []);

  const loadRecruits = async () => {
    setLoading(true);
    try {
      const data = await searchRecruits({
        sport,
        position: positions,
        minHeight: minHeight || undefined,
        minWeight: minWeight ? parseInt(minWeight) : undefined,
        minGpa: minGpa ? parseFloat(minGpa) : undefined,
        starRating: starRating || undefined,
        divisionPreference: divisionPref || undefined,
        search: search || undefined,
        limit: 50,
      });
      setRecruits(data);
    } catch (error) {
      console.error("Failed to load recruits:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSidebarData = async () => {
    try {
      const [viewed, commits] = await Promise.all([
        getTopViewedPlayers(10),
        getRecentCommits(5),
      ]);
      setTopViewed(viewed);
      setRecentCommits(commits);
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecruits();
  };

  const FOOTBALL_POSITIONS = [
    "QB",
    "RB",
    "WR",
    "TE",
    "OL",
    "DL",
    "LB",
    "DB",
    "K",
  ];

  const BASKETBALL_POSITIONS = ["PG", "SG", "SF", "PF", "C"];

  const BASEBALL_POSITIONS = ["C", "1B", "2B", "3B", "SS", "OF", "DH", "P"];

  const sportPositions = {
    football: FOOTBALL_POSITIONS,
    basketball: BASKETBALL_POSITIONS,
    baseball: BASEBALL_POSITIONS,
  };

  const currentPositions =
    sportPositions[sport as keyof typeof sportPositions] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1
          className="psp-h1 text-[var(--psp-navy)] mb-2"
        >
          Recruiter Portal
        </h1>
        <p className="text-xl text-gray-400 mb-4">
          Discover Philly's next stars — Browse and connect with top high school athletes.
        </p>
        <p className="text-sm text-gray-400">
          Contact info requires registration. Free browsing for all coaches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search & Filter Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Sport & Search Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Sport
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => {
                      setSport(e.target.value);
                      setPositions([]);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="baseball">Baseball</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Search Name
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Player name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Positions */}
              {currentPositions.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Positions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentPositions.map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          setPositions(
                            positions.includes(pos)
                              ? positions.filter((p) => p !== pos)
                              : [...positions, pos]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                          positions.includes(pos)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Measurables Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Min Height
                  </label>
                  <input
                    type="text"
                    value={minHeight}
                    onChange={(e) => setMinHeight(e.target.value)}
                    placeholder="e.g. 6-0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Min Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={minWeight}
                    onChange={(e) => setMinWeight(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Min GPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={minGpa}
                    onChange={(e) => setMinGpa(e.target.value)}
                    placeholder="e.g. 3.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Other Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Star Rating
                  </label>
                  <select
                    value={starRating}
                    onChange={(e) => setStarRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Any</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Division Preference
                  </label>
                  <select
                    value={divisionPref}
                    onChange={(e) => setDivisionPref(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="NAIA">NAIA</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Search Recruits
              </button>
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} showImage={true} />
              ))}
            </div>
          ) : recruits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recruits.map((recruit) => (
                <div key={recruit.id} className="bg-white rounded-lg shadow-lg p-5">
                  {/* Player Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-bold text-gray-900">{recruit.name}</h2>
                      <p className="text-sm text-gray-400">
                        <Link
                          href={`/football/schools/${recruit.school_slug}`}
                          className="hover:underline"
                        >
                          {recruit.school_name}
                        </Link>
                      </p>
                    </div>
                    <div className="text-right">
                      {recruit.star_rating && (
                        <div className="text-yellow-500">
                          {"⭐".repeat(recruit.star_rating)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Measurables */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-400">
                    {recruit.height && <div>Height: {recruit.height}</div>}
                    {recruit.weight && <div>Weight: {recruit.weight} lbs</div>}
                    {recruit.graduation_year && (
                      <div>Class: {recruit.graduation_year}</div>
                    )}
                  </div>

                  {/* Positions */}
                  {recruit.positions && recruit.positions.length > 0 && (
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {recruit.positions.slice(0, 3).map((pos: string) => (
                        <span
                          key={pos}
                          className="px-2 py-1 bg-gray-100 text-gray-900 text-xs rounded font-semibold"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 text-sm">
                    <Link
                      href={`/football/players/${recruit.slug}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-semibold text-center hover:bg-blue-700 transition"
                    >
                      View Profile
                    </Link>
                    {recruit.hudl_url && (
                      <a
                        href={recruit.hudl_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-200 text-gray-900 rounded font-semibold hover:bg-gray-300 transition"
                      >
                        Hudl
                      </a>
                    )}
                  </div>

                  {/* Contact Gate */}
                  {!showContactInfo && (
                    <button
                      onClick={() => setShowContactInfo(true)}
                      className="w-full mt-3 px-3 py-2 bg-gray-100 text-gray-900 rounded font-semibold hover:bg-gray-200 transition text-sm"
                    >
                      Register to Contact
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-400">
                No recruits found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration CTA */}
          <div className="bg-blue-600 text-white rounded-lg p-6">
            <h2 className="font-bold text-lg mb-2">College Coaches</h2>
            <p className="text-sm mb-4">Register to contact players and unlock recruiting tools.</p>
            <button className="w-full px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition">
              Register Now
            </button>
          </div>

          {/* Most Viewed */}
          {topViewed.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "var(--psp-navy)" }}
              >
                Most Viewed
              </h3>
              <div className="space-y-3">
                {topViewed.map((player) => (
                  <Link
                    key={player.id}
                    href={`/football/players/${player.slug}`}
                    className="block p-2 hover:bg-gray-50 rounded transition cursor-pointer"
                  >
                    <p className="font-semibold text-gray-900">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.school_name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Commits */}
          {recentCommits.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "var(--psp-navy)" }}
              >
                Latest Commits
              </h3>
              <div className="space-y-3">
                {recentCommits.map((commit, idx) => (
                  <div key={idx} className="p-2 border-l-4 border-blue-600">
                    <p className="font-semibold text-gray-900 text-sm">
                      {commit.player_name}
                    </p>
                    <p className="text-xs text-gray-400">{commit.college}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecruiterPortalPage() {
  return (
    <Suspense fallback={<SkeletonCard showImage={false} />}>
      <RecruiterPortalContent />
    </Suspense>
  );
}
