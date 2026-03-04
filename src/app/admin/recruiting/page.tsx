"use client";

import { useState } from "react";

interface RecruitEntry {
  id: number;
  player_id: number | null;
  sport_id: string;
  class_year: number;
  position: string;
  star_rating: number;
  composite_rating: number;
  status: string;
  committed_school: string;
  committed_date: string;
  offers: string[];
  ranking_247: number | null;
  ranking_rivals: number | null;
  ranking_on3: number | null;
  ranking_espn: number | null;
  url_247: string;
  url_rivals: string;
  url_on3: string;
  url_maxpreps: string;
  url_hudl: string;
  height: string;
  weight: number | null;
  highlights_url: string;
  notes: string;
  // display
  player_name?: string;
  school_name?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

const EMPTY_RECRUIT: Omit<RecruitEntry, "id"> = {
  player_id: null,
  sport_id: "football",
  class_year: CURRENT_YEAR,
  position: "",
  star_rating: 3,
  composite_rating: 0,
  status: "unsigned",
  committed_school: "",
  committed_date: "",
  offers: [],
  ranking_247: null,
  ranking_rivals: null,
  ranking_on3: null,
  ranking_espn: null,
  url_247: "",
  url_rivals: "",
  url_on3: "",
  url_maxpreps: "",
  url_hudl: "",
  height: "",
  weight: null,
  highlights_url: "",
  notes: "",
  player_name: "",
  school_name: "",
};

const SPORTS = ["football", "basketball", "baseball", "lacrosse", "soccer", "track-field", "wrestling"];
const STATUSES = ["unsigned", "committed", "signed", "enrolled", "decommitted"];

export default function AdminRecruitingPage() {
  const [recruits, setRecruits] = useState<RecruitEntry[]>([]);
  const [editing, setEditing] = useState<Omit<RecruitEntry, "id"> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [offersText, setOffersText] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const handleSave = () => {
    if (!editing || !editing.player_name?.trim()) return;
    const entry = { ...editing, offers: offersText.split(",").map(s => s.trim()).filter(Boolean) };
    if (editingId !== null) {
      setRecruits(prev => prev.map(r => r.id === editingId ? { ...entry, id: editingId } as RecruitEntry : r));
    } else {
      setRecruits(prev => [...prev, { ...entry, id: Date.now() } as RecruitEntry]);
    }
    setEditing(null);
    setEditingId(null);
    setOffersText("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this recruit?")) {
      setRecruits(prev => prev.filter(r => r.id !== id));
    }
  };

  const filtered = recruits.filter(r => {
    if (filterSport !== "all" && r.sport_id !== filterSport) return false;
    if (filterYear !== "all" && r.class_year !== Number(filterYear)) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontFamily: "'Barlow Condensed', sans-serif", margin: 0 }}>Recruiting Manager</h1>
          <p style={{ fontSize: 12, color: "var(--g400)", margin: "4px 0 0" }}>
            Track recruiting profiles, star ratings, commitments, and external links.
          </p>
        </div>
      </div>

      {/* Add/Edit form */}
      {editing ? (
        <div style={{
          background: "var(--card)", border: "1px solid var(--g200)", borderRadius: 8, padding: 20, marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px" }}>
            {editingId ? "Edit Recruit" : "Add Recruit"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Player Name *</label>
              <input style={inputStyle} value={editing.player_name || ""}
                onChange={e => setEditing({ ...editing, player_name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>School</label>
              <input style={inputStyle} value={editing.school_name || ""}
                onChange={e => setEditing({ ...editing, school_name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Sport</label>
              <select style={inputStyle} value={editing.sport_id}
                onChange={e => setEditing({ ...editing, sport_id: e.target.value })}>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Class Year</label>
              <select style={inputStyle} value={editing.class_year}
                onChange={e => setEditing({ ...editing, class_year: Number(e.target.value) })}>
                {[CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2, CURRENT_YEAR + 3].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Position</label>
              <input style={inputStyle} value={editing.position} placeholder="QB, WR, PG, etc."
                onChange={e => setEditing({ ...editing, position: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Star Rating</label>
              <select style={inputStyle} value={editing.star_rating}
                onChange={e => setEditing({ ...editing, star_rating: Number(e.target.value) })}>
                {[2, 3, 4, 5].map(s => <option key={s} value={s}>{s} ★</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={editing.status}
                onChange={e => setEditing({ ...editing, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Committed School</label>
              <input style={inputStyle} value={editing.committed_school}
                onChange={e => setEditing({ ...editing, committed_school: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Height</label>
              <input style={inputStyle} value={editing.height} placeholder="6-2"
                onChange={e => setEditing({ ...editing, height: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Weight (lbs)</label>
              <input style={inputStyle} type="number" value={editing.weight || ""}
                onChange={e => setEditing({ ...editing, weight: e.target.value ? Number(e.target.value) : null })} />
            </div>
          </div>

          {/* External URLs */}
          <h4 style={{ fontSize: 12, fontWeight: 700, margin: "16px 0 8px", color: "var(--g400)" }}>External Profile URLs</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>247Sports URL</label>
              <input style={inputStyle} value={editing.url_247}
                onChange={e => setEditing({ ...editing, url_247: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Rivals URL</label>
              <input style={inputStyle} value={editing.url_rivals}
                onChange={e => setEditing({ ...editing, url_rivals: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>On3 URL</label>
              <input style={inputStyle} value={editing.url_on3}
                onChange={e => setEditing({ ...editing, url_on3: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>MaxPreps URL</label>
              <input style={inputStyle} value={editing.url_maxpreps}
                onChange={e => setEditing({ ...editing, url_maxpreps: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Hudl URL</label>
              <input style={inputStyle} value={editing.url_hudl}
                onChange={e => setEditing({ ...editing, url_hudl: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Highlights URL</label>
              <input style={inputStyle} value={editing.highlights_url}
                onChange={e => setEditing({ ...editing, highlights_url: e.target.value })} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Offers (comma-separated school names)</label>
            <input style={inputStyle} value={offersText} placeholder="Penn State, Rutgers, Temple, Villanova"
              onChange={e => setOffersText(e.target.value)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, minHeight: 50 }} value={editing.notes}
              onChange={e => setEditing({ ...editing, notes: e.target.value })} />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={handleSave} style={btnPrimary}>
              {editingId ? "Save Changes" : "Add Recruit"}
            </button>
            <button onClick={() => { setEditing(null); setEditingId(null); setOffersText(""); }} style={btnSecondary}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
          <button onClick={() => setEditing({ ...EMPTY_RECRUIT })} style={btnPrimary}>
            + Add Recruit
          </button>
          <select value={filterSport} onChange={e => setFilterSport(e.target.value)} style={selectStyle}>
            <option value="all">All Sports</option>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={selectStyle}>
            <option value="all">All Classes</option>
            {[CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2, CURRENT_YEAR + 3].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {/* Recruits table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--g400)", fontSize: 13 }}>
          No recruits yet. Click &quot;Add Recruit&quot; to get started.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--g200)" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>School</th>
              <th style={thStyle}>Sport</th>
              <th style={thStyle}>Class</th>
              <th style={thStyle}>Pos</th>
              <th style={thStyle}>Stars</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--g100)" }}>
                <td style={tdStyle}><strong>{r.player_name}</strong></td>
                <td style={tdStyle}>{r.school_name || "—"}</td>
                <td style={tdStyle}>{r.sport_id}</td>
                <td style={tdStyle}>{r.class_year}</td>
                <td style={tdStyle}>{r.position || "—"}</td>
                <td style={tdStyle}>
                  <span style={{ color: "#f0a500" }}>{"★".repeat(r.star_rating)}</span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    padding: "1px 6px", borderRadius: 3,
                    background: r.status === "committed" || r.status === "signed" ? "#16a34a" : "var(--g100)",
                    color: r.status === "committed" || r.status === "signed" ? "#fff" : "var(--g500)",
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => {
                    setEditing(r);
                    setEditingId(r.id);
                    setOffersText((r.offers || []).join(", "));
                  }} style={{ ...btnSmall, marginRight: 4 }}>Edit</button>
                  <button onClick={() => handleDelete(r.id)} style={{ ...btnSmall, color: "#dc2626" }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--g400)", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "7px 10px", borderRadius: 5, border: "1px solid var(--g200)", background: "var(--bg)", color: "var(--text)", fontSize: 12 };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "var(--g400)", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { padding: "8px 10px", verticalAlign: "middle" };
const btnPrimary: React.CSSProperties = { padding: "7px 16px", borderRadius: 5, border: "none", background: "#f0a500", color: "#0a1628", fontWeight: 700, fontSize: 12, cursor: "pointer" };
const btnSecondary: React.CSSProperties = { padding: "7px 16px", borderRadius: 5, border: "1px solid var(--g200)", background: "none", color: "var(--text)", fontWeight: 600, fontSize: 12, cursor: "pointer" };
const btnSmall: React.CSSProperties = { padding: "3px 10px", borderRadius: 4, border: "1px solid var(--g200)", background: "none", color: "var(--text)", fontSize: 11, cursor: "pointer" };
const selectStyle: React.CSSProperties = { padding: "6px 10px", borderRadius: 5, border: "1px solid var(--g200)", background: "var(--bg)", color: "var(--text)", fontSize: 12 };
