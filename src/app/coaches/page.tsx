"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PSPPromo from "@/components/ads/PSPPromo";
import { Breadcrumb } from "@/components/ui";

// Hardcoded fallback data (used until Supabase is connected)
const COACHES_FALLBACK = [
  { id: 1, slug: "tim-mcdevitt", name: "Tim McDevitt", school: "La Salle College HS", sport: "football", sportName: "Football", record: "156-92-2", championships: 3, yearsCoaching: "1995-present", bio: "Legendary La Salle football coach with multiple state titles." },
  { id: 2, slug: "gabe-infante", name: "Gabe Infante", school: "St. Joseph's Prep", sport: "football", sportName: "Football", record: "98-15", championships: 9, yearsCoaching: "2011-present", bio: "Led the Hawks to multiple PIAA state championships and national recognition." },
  { id: 3, slug: "matt-walp", name: "Matt Walp", school: "Neumann-Goretti", sport: "football", sportName: "Football", record: "87-34", championships: 2, yearsCoaching: "2008-present", bio: "Built a powerhouse program in the Catholic League." },
  { id: 4, slug: "carl-arrigale", name: "Carl Arrigale", school: "Neumann-Goretti", sport: "basketball", sportName: "Basketball", record: "312-156", championships: 10, yearsCoaching: "1995-present", bio: "All-time great with 10 PIAA state titles and consistent NBA pipeline." },
  { id: 5, slug: "andre-noble", name: "Andre Noble", school: "Imhotep Charter", sport: "basketball", sportName: "Basketball", record: "178-42", championships: 6, yearsCoaching: "2015-present", bio: "Built an undefeated dynasty with an 85-game winning streak." },
  { id: 6, slug: "chris-mcnesby", name: "Chris McNesby", school: "Roman Catholic", sport: "basketball", sportName: "Basketball", record: "201-118", championships: 4, yearsCoaching: "2000-present", bio: "Consistently developed NBA talent and won multiple Catholic League titles." },
  { id: 7, slug: "kyle-werman", name: "Kyle Werman", school: "La Salle College HS", sport: "baseball", sportName: "Baseball", record: "234-167", championships: 3, yearsCoaching: "2000-present", bio: "Multiple PIAA state titles and consistent playoff appearances." },
  { id: 8, slug: "bill-dyer", name: "Bill Dyer", school: "Father Judge HS", sport: "baseball", sportName: "Baseball", record: "142-89", championships: 2, yearsCoaching: "2005-present", bio: "Won a PIAA state title in 2023 and built a strong Catholic League program." },
];

const SPORT_TABS = [
  { id: "all", label: "All Sports" },
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "baseball", label: "Baseball" },
  { id: "track-field", label: "Track & Field" },
  { id: "lacrosse", label: "Lacrosse" },
  { id: "wrestling", label: "Wrestling" },
  { id: "soccer", label: "Soccer" },
];

const SPORT_EMOJIS: Record<string, string> = {
  football: "🏈", basketball: "🏀", baseball: "⚾",
  "track-field": "🏃", lacrosse: "🥍", wrestling: "🤼", soccer: "⚽",
};

export default function CoachesPage() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [coaches] = useState(COACHES_FALLBACK);

  const filteredCoaches = useMemo(() => {
    let result = coaches;
    if (selectedSport !== "all") {
      result = result.filter((c) => c.sport === selectedSport);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.school.toLowerCase().includes(q)
      );
    }
    return result;
  }, [coaches, selectedSport, searchQuery]);

  const totalChampionships = coaches.reduce((sum, c) => sum + (c.championships || 0), 0);

  return (
    <>
      <Breadcrumb items={[{ label: "Coaches" }]} />

      {/* Hero */}
      <div className="sport-hdr" style={{ borderBottomColor: "var(--psp-gold)" }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>📋</span>
          <h1>Coaches Directory</h1>
          <div className="stat-pills">
            <div className="pill"><strong>{coaches.length}</strong> coaches</div>
            <div className="pill"><strong>{totalChampionships}</strong> combined titles</div>
            <span className="db-tag"><span className="dot" /> Supabase</span>
          </div>
        </div>
      </div>

      {/* Sport Tabs */}
      <div className="subnav">
        <div className="subnav-inner">
          {SPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSport(tab.id)}
              className={selectedSport === tab.id ? "active" : ""}
              style={{
                padding: "12px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: selectedSport === tab.id ? "var(--psp-navy)" : "var(--g500)",
                background: "transparent",
                border: "none",
                borderBottom: selectedSport === tab.id ? "3px solid var(--psp-navy)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="espn-container">
        <main>
          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search coaches by name or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
              style={{ width: "100%", padding: "10px 14px", fontSize: 13 }}
            />
          </div>

          {/* Results Header */}
          <div className="sec-head">
            <h2>{selectedSport === "all" ? "All" : SPORT_TABS.find(t => t.id === selectedSport)?.label} Coaches</h2>
            <span style={{ fontSize: 11, color: "var(--g400)", marginLeft: "auto" }}>
              {filteredCoaches.length} {filteredCoaches.length === 1 ? "coach" : "coaches"}
            </span>
          </div>

          {/* Coach Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 16 }}>
            {filteredCoaches.map((coach) => (
              <Link
                key={coach.id}
                href={`/${coach.sport}/coaches/${coach.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "var(--psp-white)",
                    border: "1px solid var(--g100)",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: ".15s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header */}
                  <div style={{ background: "var(--psp-navy)", padding: 16, color: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{SPORT_EMOJIS[coach.sport] || "📋"}</span>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {coach.name}
                      </h3>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>{coach.school}</div>
                    <div
                      style={{
                        display: "inline-block",
                        marginTop: 6,
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        background: "rgba(255,255,255,.15)",
                        color: "var(--psp-gold)",
                      }}
                    >
                      {coach.sportName}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                    {coach.bio && (
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.5, flex: 1 }}>
                        {coach.bio}
                      </p>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        paddingTop: 12,
                        borderTop: "1px solid var(--g100)",
                      }}
                    >
                      {coach.record && (
                        <div>
                          <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>Record</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--psp-navy)" }}>{coach.record}</div>
                        </div>
                      )}
                      {coach.championships !== undefined && (
                        <div>
                          <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>Titles</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--psp-gold)" }}>{coach.championships}</div>
                        </div>
                      )}
                      {coach.yearsCoaching && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>Years</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{coach.yearsCoaching}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCoaches.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--g400)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontWeight: 600 }}>No coaches found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your search or sport filter.</div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="widget">
            <div className="w-head">🏆 Most Titles</div>
            <div className="w-body">
              {[...coaches]
                .sort((a, b) => (b.championships || 0) - (a.championships || 0))
                .slice(0, 5)
                .map((coach, idx) => (
                  <div key={coach.id} className="w-row">
                    <span className={`rank ${idx < 3 ? "top" : ""}`}>{idx + 1}</span>
                    <span className="name">{coach.name}</span>
                    <span className="val">{coach.championships}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">📊 By Sport</div>
            <div className="w-body">
              {["Football", "Basketball", "Baseball"].map((sport) => {
                const count = coaches.filter(c => c.sportName === sport).length;
                const titles = coaches.filter(c => c.sportName === sport).reduce((s, c) => s + (c.championships || 0), 0);
                return (
                  <div key={sport} className="w-row">
                    <span className="name">{sport}</span>
                    <span className="val">{count} coaches, {titles} titles</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">🔗 Quick Links</div>
            <div className="w-body">
              <Link href="/football" className="w-link">&#8594; Football</Link>
              <Link href="/basketball" className="w-link">&#8594; Basketball</Link>
              <Link href="/baseball" className="w-link">&#8594; Baseball</Link>
              <Link href="/search" className="w-link">&#8594; Player Search</Link>
              <Link href="/our-guys" className="w-link">&#8594; Our Guys</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={1} />
        </aside>
      </div>
    </>
  );
}
